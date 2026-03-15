import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import JourneyRouteMap from '@/components/JourneyRouteMap'
import ExpenseBreakdown from '@/components/ExpenseBreakdown'
import PassportStamps from '@/components/animations/PassportStamps'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const trips = await prisma.trip.findMany({ select: { slug: true } })
  return trips.map((t) => ({ slug: t.slug }))
}

export default async function TripPage({ params }: Props) {
  const trip = await prisma.trip.findUnique({
    where: { slug: params.slug },
    include: {
      expenses: true, 
      stories: {
        include: {
          routeStops: { orderBy: { order: 'asc' } },
          journeySteps: { orderBy: { order: 'asc' } },
          cityFrames: { orderBy: { order: 'asc' }, take: 1 },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!trip) notFound()

  // Aggregate all route stops across stories for trip-level map
  const allStops = trip.stories.flatMap((s) =>
    s.routeStops.map((stop) => ({ ...stop, storyCity: s.city }))
  )

  // Aggregate all expenses
  const totalExpense = trip.expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <main style={{ background: 'transparent', color: 'var(--text-primary)' }}>
      {/* ── TRIP HERO ─────────────────────────────── */}
      <PassportStamps />
      <section
        className="relative flex items-end min-h-[70vh]"
        style={{ overflow: 'hidden' }}
      >
        {trip.coverImage && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${trip.coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
          }}
        />
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-16">
          <p className="text-xs tracking-[0.4em] uppercase mb-4 text-white/50">Journey</p>
          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-4"
            style={{ fontFamily: 'Georgia, serif', lineHeight: 1.1 }}
          >
            {trip.title}
          </h1>
          {trip.description && (
            <p className="text-lg md:text-xl max-w-2xl text-white/75 leading-relaxed">
              {trip.description}
            </p>
          )}
          {/* City route display */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            {trip.stories.map((story, i) => (
              <span key={story.id} className="flex items-center gap-2">
                <span
                  className="text-sm font-medium px-3 py-1 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {story.city}
                </span>
                {i < trip.stories.length - 1 && (
                  <span style={{ color: 'var(--accent)' }}>→</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOURNEY ROUTE MAP ─────────────────────── */}
      {allStops.length > 0 && (
        <section className="py-20" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="max-w-5xl mx-auto px-6">
            <p className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--accent)' }}>
              The Route
            </p>
            <h2
              className="text-3xl font-bold mb-8"
              style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}
            >
              Full Journey Map
            </h2>
            <JourneyRouteMap stops={allStops} />
          </div>
        </section>
      )}

      {/* ── CITIES IN THIS TRIP ───────────────────── */}
      <section className="py-20" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--accent)' }}>
            Destinations
          </p>
          <h2
            className="text-3xl font-bold mb-10"
            style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}
          >
            Cities in This Trip
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trip.stories.map((story) => {
              const coverFrame = story.cityFrames[0]
              const heroImage = coverFrame?.imageUrl || story.coverImage
              return (
                <Link key={story.id} href={`/stories/${story.slug}`}>
                  <div
                    className="group relative overflow-hidden rounded-xl cursor-pointer hover:shadow-2xl transition-all duration-300"
                    style={{ border: '1px solid var(--border)', height: 280 }}
                  >
                    {heroImage && (
                      <div
                        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage: `url(${heroImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    )}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)',
                      }}
                    />
                    <div className="absolute bottom-0 p-5">
                      <p className="text-xs tracking-widest uppercase text-white/50 mb-1">
                        {story.state || story.country}
                      </p>
                      <h3
                        className="text-xl font-bold text-white"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        {story.city}
                      </h3>
                      <p className="text-sm text-white/70 mt-1">{story.title}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── TRIP ITINERARY TIMELINE ───────────────── */}
      {trip.stories.some((s) => s.journeySteps.length > 0) && (
        <section className="py-20" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="max-w-3xl mx-auto px-6">
            <p className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--accent)' }}>
              Day by Day
            </p>
            <h2
              className="text-3xl font-bold mb-10"
              style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}
            >
              Trip Itinerary
            </h2>
            <div className="space-y-12">
              {trip.stories.map((story) =>
                story.journeySteps.length > 0 ? (
                  <div key={story.id}>
                    <h3
                      className="text-lg font-semibold mb-6"
                      style={{ color: 'var(--accent)', fontFamily: 'Georgia, serif' }}
                    >
                      {story.city}
                    </h3>
                    <div className="relative pl-8" style={{ borderLeft: '1px solid var(--border)' }}>
                      {story.journeySteps.map((step) => (
                        <div key={step.id} className="relative mb-6 last:mb-0">
                          <div
                            className="absolute -left-[1.35rem] w-3 h-3 rounded-full border-2"
                            style={{
                              background: 'var(--bg)',
                              borderColor: 'var(--accent)',
                              top: '4px',
                            }}
                          />
                          {step.time && (
                            <span
                              className="text-xs font-mono tracking-widest mb-1 block"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {step.time}
                            </span>
                          )}
                          <h4
                            className="font-semibold mb-1"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {step.title}
                          </h4>
                          {step.description && (
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                              {step.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── TRIP EXPENSES ─────────────────────────── */}
      {/* ── TRIP EXPENSES ─────────────────────────── */}
      {trip.expenses.length > 0 && (
        <ExpenseBreakdown
          expenses={trip.expenses}
          totalCost={totalExpense}
        />
      )}

    </main>
  )
}