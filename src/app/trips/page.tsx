import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function TripsPage() {
  const trips = await prisma.trip.findMany({
    include: { stories: { select: { id: true, city: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main style={{ background: 'transparent' }} className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <p className="text-sm tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--accent)' }}>
          All Journeys
        </p>
        <h1
          className="text-4xl md:text-5xl font-bold mb-16"
          style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}
        >
          Trips
        </h1>

        <div className="space-y-6">
          {trips.map((trip) => (
            <Link key={trip.id} href={`/trips/${trip.slug}`}>
              <div
                className="group flex flex-col md:flex-row gap-6 p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
              >
                {trip.coverImage && (
                  <div
                    className="flex-shrink-0 w-full md:w-48 h-36 rounded-xl overflow-hidden"
                    style={{
                      backgroundImage: `url(${trip.coverImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                )}
                <div className="flex-1">
                  <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}
                  >
                    {trip.title}
                  </h2>
                  {trip.description && (
                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                      {trip.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {trip.stories.map((s, i) => (
                      <span key={s.id} className="flex items-center gap-1.5">
                        <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                          {s.city}
                        </span>
                        {i < trip.stories.length - 1 && (
                          <span style={{ color: 'var(--accent)', fontSize: 10 }}>→</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}