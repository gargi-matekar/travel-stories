'use client'

// src/components/LocalRecommendations.tsx

interface Recommendation {
  id: string
  name: string
  type: string
  description: string
  googleMapsUrl?: string | null
  priceRange?: string | null
}

const TYPES: Record<string, { icon: string; label: string; accent: string }> = {
  food:     { icon: '🍜', label: 'Food & Drink', accent: '#e8865a' },
  place:    { icon: '📍', label: 'Places',       accent: '#26d4a0' },
  shopping: { icon: '🛍️', label: 'Shopping',     accent: '#a78bfa' },
}

export default function LocalRecommendations({
  recommendations,
}: {
  recommendations: Recommendation[]
}) {
  if (!recommendations || recommendations.length === 0) return null

  const grouped = recommendations.reduce<Record<string, Recommendation[]>>((acc, r) => {
    const key = r.type in TYPES ? r.type : 'place'
    ;(acc[key] = acc[key] || []).push(r)
    return acc
  }, {})

  return (
    <div className="lr-root">
      {Object.entries(grouped).map(([type, items]) => {
        const cfg = TYPES[type] ?? TYPES.place
        return (
          <div key={type} className="lr-group">
            <div className="lr-group-header">
              <span className="lr-icon">{cfg.icon}</span>
              <span className="lr-group-label">{cfg.label}</span>
            </div>
            <div className="lr-grid">
              {items.map((rec) => (
                <div key={rec.id} className="lr-card">
                  <div className="lr-card-top">
                    <h3 className="lr-name">{rec.name}</h3>
                    {rec.priceRange && (
                      <span
                        className="lr-price"
                        style={{
                          color: cfg.accent,
                          borderColor: `${cfg.accent}40`,
                          background: `${cfg.accent}12`,
                        }}
                      >
                        {rec.priceRange}
                      </span>
                    )}
                  </div>
                  <p className="lr-desc">{rec.description}</p>
                  {rec.googleMapsUrl && (
                    <a
                      href={rec.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lr-link"
                      style={{ color: cfg.accent }}
                    >
                      Open in Maps
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display:'inline', marginLeft:4 }}>
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <style jsx>{`
        .lr-root { display: flex; flex-direction: column; gap: 40px; }
        .lr-group-header {
          display: flex; align-items: center; gap: 10px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 16px;
        }
        .lr-icon { font-size: 1rem; }
        .lr-group-label {
          font-size: 0.62rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: rgba(255,255,255,0.38);
          font-weight: 600;
        }
        .lr-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: 12px;
        }
        .lr-card {
          padding: 18px; border-radius: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column; gap: 8px;
          transition: border-color 0.2s, background 0.2s;
        }
        .lr-card:hover {
          background: rgba(255,255,255,0.055);
          border-color: rgba(255,255,255,0.1);
        }
        .lr-card-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 8px;
        }
        .lr-name {
          font-size: 0.88rem; font-weight: 500; color: #fff;
          margin: 0; font-family: Georgia, serif; line-height: 1.3;
        }
        .lr-price {
          font-size: 0.62rem; font-weight: 700;
          padding: 3px 7px; border-radius: 4px;
          border: 1px solid; white-space: nowrap; flex-shrink: 0;
        }
        .lr-desc {
          font-size: 0.79rem; color: rgba(255,255,255,0.42);
          margin: 0; line-height: 1.65; flex: 1;
        }
        .lr-link {
          font-size: 0.7rem; font-weight: 600;
          text-decoration: none; letter-spacing: 0.03em;
          transition: opacity 0.15s;
          display: inline-flex; align-items: center;
        }
        .lr-link:hover { opacity: 0.7; }
      `}</style>
    </div>
  )
}