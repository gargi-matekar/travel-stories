'use client'

import { useRef } from 'react'

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
  const scrollRef = useRef<HTMLDivElement>(null)

  if (!frames || frames.length === 0) return null

  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <p className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--accent)' }}>
          Visual Memoir
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold"
          style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}
        >
          {city} in 5 Frames
        </h2>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          Five moments that defined the city for me.
        </p>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-5 px-6 md:px-12 overflow-x-auto pb-6 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {frames.map((frame, index) => (
          <CityFrameCard key={frame.id} frame={frame} index={index} />
        ))}
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

function CityFrameCard({ frame, index }: { frame: CityFrame; index: number }) {
  return (
    <div
      className="relative flex-shrink-0 snap-start overflow-hidden rounded-xl group cursor-pointer"
      style={{
        width: 'clamp(260px, 30vw, 380px)',
        height: 'clamp(360px, 50vw, 520px)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110"
        style={{
          backgroundImage: `url(${frame.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
        }}
      />

      {/* Frame number */}
      <div
        className="absolute top-4 left-4 text-xs font-mono tracking-widest px-2 py-1 rounded"
        style={{
          color: 'var(--accent)',
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid var(--accent)',
        }}
      >
        Frame {String(index + 1).padStart(2, '0')}
      </div>

      {/* Content at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3
          className="text-lg font-bold mb-1 text-white"
          style={{ fontFamily: 'Georgia, serif', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
        >
          {frame.title}
        </h3>
        {frame.description && (
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.8)', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
          >
            {frame.description}
          </p>
        )}
      </div>
    </div>
  )
}