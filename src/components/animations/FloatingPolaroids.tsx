'use client'

// components/animations/FloatingPolaroids.tsx
// Gallery section — floating polaroid photos
// Slow vertical drift, ±2° rotation, hover straightens + caption fades in
// Disabled on mobile (<768px), replaced with static 2-col grid
// IntersectionObserver starts/stops the RAF loop

import { useEffect, useRef, useState } from 'react'

export interface PolaroidPhoto {
  src:      string
  caption:  string
  alt?:     string
}

interface Props {
  photos: PolaroidPhoto[]
}

interface Particle {
  x:       number   // % from left
  y:       number   // current translateY px
  vy:      number   // drift speed px/frame (upward = negative)
  baseRot: number   // resting rotation in degrees
  hovered: boolean
}

export default function FloatingPolaroids({ photos = [] }: Props) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const itemRefs      = useRef<(HTMLDivElement | null)[]>([])
  const captionRefs   = useRef<(HTMLParagraphElement | null)[]>([])
  const particlesRef  = useRef<Particle[]>([])
  const rafRef        = useRef<number>(0)
  const runningRef    = useRef(false)

  const [isMobile, setIsMobile] = useState(false)
  const [mounted,  setMounted]  = useState(false)

  if (!photos || photos.length === 0) return null

  // ── Initialise on client only ──────────────────────────────────────────────
  useEffect(() => {
    setMounted(true)
    setIsMobile(window.innerWidth < 768)
  }, [])

  useEffect(() => {
    if (!mounted || isMobile) return

    // Build one particle per photo, staggered so they don't all start at same y
    particlesRef.current = photos.map((_, i) => ({
      x:       6 + (i * 23) % 76,         // spread across width, never overflow
      y:       -(i * 180 + 40),            // stagger start positions above container
      vy:      0.20 + (i % 4) * 0.06,     // slightly different speeds
      baseRot: -2 + (i % 5) * 1.0,        // -2° to +2°
      hovered: false,
    }))

    const container = containerRef.current
    if (!container) return

    // ── IntersectionObserver ──────────────────────────────────────────────────
    const obs = new IntersectionObserver(
      ([entry]) => { runningRef.current = entry.isIntersecting },
      { threshold: 0.08 }
    )
    obs.observe(container)

    let containerH = container.offsetHeight || 700
    const onResize = () => { containerH = container.offsetHeight || 700 }
    window.addEventListener('resize', onResize, { passive: true })

    // ── Tab visibility ────────────────────────────────────────────────────────
    const onVis = () => {
      if (document.visibilityState === 'hidden') cancelAnimationFrame(rafRef.current)
      else rafRef.current = requestAnimationFrame(tick)
    }
    document.addEventListener('visibilitychange', onVis)

    // ── RAF loop ──────────────────────────────────────────────────────────────
    const tick = () => {
      if (runningRef.current) {
        particlesRef.current.forEach((p, i) => {
          const el      = itemRefs.current[i]
          const caption = captionRefs.current[i]
          if (!el) return

          // Drift downward (positive y direction on screen)
          p.y += p.vy

          // Loop: reset above container when it exits bottom
          if (p.y > containerH + 240) p.y = -(240 + Math.random() * 80)

          const rot   = p.hovered ? 0      : p.baseRot
          const scale = p.hovered ? 1.07   : 1
          const elev  = p.hovered ? '-12px' : '0px'

          el.style.transform  = `translateY(${p.y}px) rotate(${rot}deg) scale(${scale})`
          el.style.boxShadow  = p.hovered
            ? '0 20px 48px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.35)'
            : '0 8px 28px rgba(0,0,0,0.42), 0 2px 6px rgba(0,0,0,0.28)'

          if (caption) {
            caption.style.opacity = p.hovered ? '1' : '0.75'
          }
        })
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      obs.disconnect()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [mounted, isMobile, photos])

  // ── SSR / not yet mounted ──────────────────────────────────────────────────
  if (!mounted) return null

  // ── Mobile fallback — simple 2-col static grid ─────────────────────────────
  if (isMobile) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '14px',
        padding: '8px',
      }}>
        {photos.map((photo, i) => (
          <div key={i} style={{
            background: '#f5f0e8',
            padding: '8px 8px 36px',
            boxShadow: '0 4px 18px rgba(0,0,0,0.35)',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src} alt={photo.alt || photo.caption}
              style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
            />
            <p style={{
              marginTop: '7px', textAlign: 'center',
              fontFamily: "'Courier New', monospace",
              fontSize: '0.6rem', color: '#2e2416', lineHeight: 1.3,
            }}>
              {photo.caption}
            </p>
          </div>
        ))}
      </div>
    )
  }

  // ── Desktop — absolutely positioned drifting polaroids ─────────────────────
  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
    >
      {photos.map((photo, i) => {
        const p = particlesRef.current[i] || { x: 10 + i * 20, y: -200, baseRot: 0 }
        return (
          <div
            key={i}
            ref={(el) => { itemRefs.current[i] = el }}
            onMouseEnter={() => { if (particlesRef.current[i]) particlesRef.current[i].hovered = true }}
            onMouseLeave={() => { if (particlesRef.current[i]) particlesRef.current[i].hovered = false }}
            style={{
              position:   'absolute',
              left:       `${p.x}%`,
              top:        0,
              width:      'clamp(130px, 14vw, 190px)',
              background: '#f5f0e8',
              padding:    '9px 9px 40px',
              transform:  `translateY(${p.y}px) rotate(${p.baseRot}deg)`,
              boxShadow:  '0 8px 28px rgba(0,0,0,0.42)',
              willChange: 'transform',
              cursor:     'default',
              transition: 'box-shadow 0.25s ease',
              zIndex:     (i % 3) + 1,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src} alt={photo.alt || photo.caption}
              style={{
                width: '100%', aspectRatio: '4/3',
                objectFit: 'cover', display: 'block',
                pointerEvents: 'none',
              }}
            />
            <p
              ref={(el) => { captionRefs.current[i] = el }}
              style={{
                position:   'absolute',
                bottom:     '9px',
                left:       '9px',
                right:      '9px',
                textAlign:  'center',
                fontFamily: "'Courier New', monospace",
                fontSize:   'clamp(0.52rem, 0.9vw, 0.65rem)',
                color:      '#2e2416',
                lineHeight: 1.35,
                margin:     0,
                opacity:    0.75,
                transition: 'opacity 0.25s ease',
                pointerEvents: 'none',
              }}
            >
              {photo.caption}
            </p>
          </div>
        )
      })}
    </div>
  )
}