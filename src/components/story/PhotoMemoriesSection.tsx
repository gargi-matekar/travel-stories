'use client'

interface PhotoMemory {
  id: string
  imageUrl: string
  caption?: string | null
  order: number
}

interface Props {
  memories: PhotoMemory[]
}

export default function PhotoMemoriesSection({ memories }: Props) {
  if (!memories || memories.length === 0) return null

  return (
    <section className="py-20" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--accent)' }}>
          In Photographs
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold mb-12"
          style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}
        >
          Photo Memories
        </h2>

        {/* Masonry-style grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {memories.map((memory, index) => (
            <div
              key={memory.id}
              className="break-inside-avoid relative group overflow-hidden rounded-lg"
              style={{ border: '1px solid var(--border)' }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={memory.imageUrl}
                  alt={memory.caption || `Memory ${index + 1}`}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Caption overlay */}
                {memory.caption && (
                  <div
                    className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
                    }}
                  >
                    <p
                      className="text-sm italic leading-relaxed"
                      style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'Georgia, serif' }}
                    >
                      "{memory.caption}"
                    </p>
                  </div>
                )}
              </div>
              {/* Caption below image (always visible fallback) */}
              {memory.caption && (
                <div className="p-3" style={{ background: 'var(--card-bg)' }}>
                  <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>
                    {memory.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}