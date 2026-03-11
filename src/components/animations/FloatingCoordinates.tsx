'use client'

// components/animations/FloatingCoordinates.tsx
// Spawns geo-coordinate strings that fade in, drift, and fade out
// while the user is scrolling. Opacity 10–15%, desktop only.

import { useEffect, useRef } from 'react'

// Real places visited — extend freely
const COORDINATES = [
  '9.2881° N,  79.3129° E',
  '15.3350° N, 76.4600° E',
  '25.3176° N, 82.9739° E',
  '18.5204° N, 73.8567° E',
  '13.0827° N, 80.2707° E',
  '28.6139° N, 77.2090° E',
  '12.9716° N, 77.5946° E',
  '11.1271° N, 78.6569° E',
  '22.5726° N, 88.3639° E',
  '17.3850° N, 78.4867° E',
  '26.9124° N, 75.7873° E',
  '8.5241° N,  76.9366° E',
]

interface CoordParticle {
  id: number
  text: string
  x: number           // % from left
  y: number           // % from top
  opacity: number
  phase: 'in' | 'hold' | 'out' | 'dead'
  timer: number       // frames in current phase
  driftX: number
  driftY: number
  fontSize: number
}

let nextId = 0

export default function FloatingCoordinates() {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<CoordParticle[]>([])
  const rafRef       = useRef<number>(0)
  const activeRef    = useRef(false)
  const scrolling    = useRef(false)
  const scrollTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const spawnTimer   = useRef(0)

  const spawn = () => {
    const text = COORDINATES[Math.floor(Math.random() * COORDINATES.length)]
    particlesRef.current.push({
      id:       nextId++,
      text,
      x:        10 + Math.random() * 80,
      y:        10 + Math.random() * 80,
      opacity:  0,
      phase:    'in',
      timer:    0,
      driftX:   (Math.random() - 0.5) * 0.015,  // % per frame
      driftY:   -0.008 - Math.random() * 0.006,  // always drifts up slightly
      fontSize: 9 + Math.floor(Math.random() * 4),
    })
  }

  const tick = () => {
    const container = containerRef.current
    if (!container || !activeRef.current) return

    // Spawn a new particle every 90 frames while scrolling
    spawnTimer.current++
    if (scrolling.current && spawnTimer.current > 90) {
      spawnTimer.current = 0
      if (particlesRef.current.length < 6) spawn()
    }

    // Update particles & build DOM diff
    particlesRef.current = particlesRef.current.filter((p) => p.phase !== 'dead')

    particlesRef.current.forEach((p) => {
      p.timer++
      p.x += p.driftX
      p.y += p.driftY

      const MAX_OPACITY = 0.12 + Math.random() * 0.03  // 12–15%
      if (p.phase === 'in') {
        p.opacity = Math.min(MAX_OPACITY, p.opacity + 0.003)
        if (p.timer > 60) { p.phase = 'hold'; p.timer = 0 }
      } else if (p.phase === 'hold') {
        p.opacity = MAX_OPACITY
        if (p.timer > 180) { p.phase = 'out'; p.timer = 0 }
      } else if (p.phase === 'out') {
        p.opacity = Math.max(0, p.opacity - 0.004)
        if (p.opacity <= 0) p.phase = 'dead'
      }
    })

    // Sync DOM elements
    const existing = new Map<number, HTMLElement>()
    container.querySelectorAll<HTMLElement>('[data-coord-id]').forEach((el) => {
      existing.set(Number(el.dataset.coordId), el)
    })

    const liveIds = new Set(particlesRef.current.map((p) => p.id))

    // Remove dead
    existing.forEach((el, id) => {
      if (!liveIds.has(id)) el.remove()
    })

    // Update / create
    particlesRef.current.forEach((p) => {
      let el = existing.get(p.id)
      if (!el) {
        el = document.createElement('span')
        el.dataset.coordId = String(p.id)
        el.style.cssText = `
          position: absolute;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.12em;
          color: var(--coord-color, rgba(200, 180, 140, 1));
          pointer-events: none;
          white-space: nowrap;
          user-select: none;
          will-change: opacity, transform;
        `
        container.appendChild(el)
      }
      el.textContent   = p.text
      el.style.left    = `${p.x}%`
      el.style.top     = `${p.y}%`
      el.style.opacity = String(p.opacity)
      el.style.fontSize= `${p.fontSize}px`
    })

    rafRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    if (window.innerWidth < 768) return

    const onScroll = () => {
      scrolling.current = true
      if (scrollTimer.current) clearTimeout(scrollTimer.current)
      scrollTimer.current = setTimeout(() => { scrolling.current = false }, 300)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const obs = new IntersectionObserver(([entry]) => {
      activeRef.current = entry.isIntersecting
      if (activeRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(tick)
      } else {
        cancelAnimationFrame(rafRef.current)
      }
    }, { threshold: 0.01 })

    if (containerRef.current) obs.observe(containerRef.current)

    const onVis = () => {
      if (document.visibilityState === 'hidden') cancelAnimationFrame(rafRef.current)
      else if (activeRef.current) rafRef.current = requestAnimationFrame(tick)
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(rafRef.current)
      obs.disconnect()
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVis)
      if (scrollTimer.current) clearTimeout(scrollTimer.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}