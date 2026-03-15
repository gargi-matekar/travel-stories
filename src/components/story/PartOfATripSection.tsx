import Link from 'next/link'

interface Trip {
  id: string
  title: string
  slug: string
  description?: string | null
  coverImage?: string | null
}

interface Props {
  trip: Trip
}

export default function PartOfATripSection({ trip }: Props) {
  return (
    <section className="py-16" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-sm tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
          Part of a Larger Journey
        </p>

        <Link href={`/trips/${trip.slug}`}>
          <div
            className="relative overflow-hidden rounded-2xl group cursor-pointer transition-all duration-300 hover:shadow-2xl"
            style={{
              border: '1px solid var(--border)',
              background: 'var(--card-bg)',
            }}
          >
            {/* Cover image strip */}
            {trip.coverImage && (
              <div
                className="h-32 w-full overflow-hidden"
                style={{
                  backgroundImage: `url(${trip.coverImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div
                  className="h-full w-full"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 40%, var(--card-bg) 100%)',
                  }}
                />
              </div>
            )}

            <div className="p-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--accent)' }}>
                  Journey
                </p>
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}
                >
                  {trip.title}
                </h3>
                {trip.description && (
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {trip.description}
                  </p>
                )}
              </div>
              {/* Arrow icon */}
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1"
                style={{ background: 'var(--accent)', color: 'white' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}