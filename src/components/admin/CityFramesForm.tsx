// src/components/story/CityFramesSection.tsx
'use client'

import { useState } from 'react'

interface CityFrame {
  id: string
  title: string
  description?: string | null
  imageUrl: string
  order: number
}

interface Props {
  frames: CityFrame[]
  city: string
}

export default function CityFramesSection({ frames, city }: Props) {
  const [active, setActive] = useState(0)

  if (!frames || frames.length === 0) return null

  return (
    <section className="py-20 overflow-hidden" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <p className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--accent)' }}>
          Visual Memoir
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold"
          style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}
        >
          {city} in {frames.length} Frames
        </h2>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          Click a frame to spotlight it.
        </p>
      </div>

      {/* Desktop: spotlight layout */}
      <div className="hidden md:flex items-end justify-center gap-3 px-6 min-h-[520px]">
        {frames.map((frame, index) => {
          const isActive = index === active
          return (
            <div
              key={frame.id}
              onClick={() => setActive(index)}
              className="relative overflow-hidden rounded-2xl cursor-pointer flex-shrink-0"
              style={{
                width: isActive ? '420px' : '120px',
                height: isActive ? '520px' : '380px',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)',
                opacity: isActive ? 1 : 0.65,
                transform: isActive ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              {/* Background image */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${frame.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.6s ease',
                  transform: isActive ? 'scale(1)' : 'scale(1.05)',
                }}
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: isActive
                    ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)'
                    : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)',
                  transition: 'background 0.4s ease',
                }}
              />

              {/* Frame number — always visible */}
              <div
                className="absolute top-4 left-0 right-0 flex justify-center"
              >
                <span
                  className="text-xs font-mono tracking-widest px-2 py-1 rounded"
                  style={{
                    color: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.5)',
                    background: 'rgba(0,0,0,0.5)',
                    border: `1px solid ${isActive ? 'var(--accent)' : 'rgba(255,255,255,0.15)'}`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Collapsed: rotated title */}
              {!isActive && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ opacity: 1 }}
                >
                  <p
                    className="text-white text-xs font-semibold tracking-widest uppercase"
                    style={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      transform: 'rotate(180deg)',
                      letterSpacing: '0.2em',
                      textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                    }}
                  >
                    {frame.title}
                  </p>
                </div>
              )}

              {/* Expanded: full content */}
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 p-6"
                  style={{
                    animation: 'fadeUpIn 0.4s ease forwards',
                  }}
                >
                  <h3
                    className="text-xl font-bold text-white mb-2"
                    style={{ fontFamily: 'Georgia, serif', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
                  >
                    {frame.title}
                  </h3>
                  {frame.description && (
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'rgba(255,255,255,0.82)', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                    >
                      {frame.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile: horizontal scroll */}
      <div
        className="md:hidden flex gap-4 px-6 overflow-x-auto pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none' }}
      >
        {frames.map((frame, index) => (
          <div
            key={frame.id}
            className="relative flex-shrink-0 snap-start overflow-hidden rounded-xl"
            style={{ width: '75vw', height: '420px', border: '1px solid var(--border)' }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${frame.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }}
            />
            <div
              className="absolute top-3 left-3 text-xs font-mono px-2 py-1 rounded"
              style={{ color: 'var(--accent)', background: 'rgba(0,0,0,0.6)', border: '1px solid var(--accent)' }}
            >
              {String(index + 1).padStart(2, '0')}
            </div>
            <div className="absolute bottom-0 p-5">
              <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                {frame.title}
              </h3>
              {frame.description && (
                <p className="text-sm text-white/80">{frame.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes fadeUpIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}