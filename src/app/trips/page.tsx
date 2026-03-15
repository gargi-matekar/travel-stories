import { LazyTravelRoutes, LazyWorldMap } from '@/components/animations'
import ExplorerMapBackground from '@/components/animations/ExplorerMapBackground'
import FloatingPolaroids from '@/components/animations/FloatingPolaroids'
import ParallaxMountains from '@/components/animations/ParallaxMountains'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function TripsPage() {
  const trips = await prisma.trip.findMany({
    include: {
      stories:  { select: { id: true, city: true } },
      expenses: { select: { amount: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main style={{ background: 'transparent' }} className="min-h-screen">
      
      <LazyTravelRoutes />
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
          {trips.map((trip) => {
            const totalUSD = trip.expenses.reduce((sum, e) => sum + e.amount, 0)
            const totalINR = totalUSD * 83.5

            return (
              <Link key={trip.id} href={`/trips/${trip.slug}`}>
                <div
                  className="group flex flex-col md:flex-row gap-6 p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105"
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
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h2
                        className="text-2xl font-bold"
                        style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}
                      >
                        {trip.title}
                      </h2>
                      {totalINR > 0 && (
                        <span
                          className="flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full"
                          style={{
                            background: 'var(--bg)',
                            color: 'var(--accent)',
                            border: '1px solid var(--border)',
                            letterSpacing: '0.05em',
                          }}
                        >
                          ₹{totalINR.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </span>
                      )}
                    </div>
                    {trip.description && (
                      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                        {trip.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {trip.stories.map((s, i) => (
                        <span key={s.id} className="flex items-center gap-1.5">
                          <span
                            className="text-xs px-2.5 py-1 rounded-full"
                            style={{
                              background: 'var(--bg)',
                              color: 'var(--text-muted)',
                              border: '1px solid var(--border)',
                            }}
                          >
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
            )
          })}
        </div>
      </div>
    </main>
  )
}