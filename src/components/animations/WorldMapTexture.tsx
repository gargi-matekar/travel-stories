'use client'

// components/animations/ConstellationBackground.tsx
// Replaces WorldMapTexture — fixed canvas behind entire site
// Draws faint constellation dot-and-line patterns that slowly pulse
// Opacity ~8–12% — visible but never distracting
// Zero interaction with content, pure background texture

import { useEffect, useRef } from 'react'

// Named constellation groups — coordinates are 0–1 fractions of canvas size
const CONSTELLATIONS = [
  // Orion-like — top left area
  {
    stars: [[0.08,0.12],[0.12,0.18],[0.16,0.14],[0.11,0.22],[0.14,0.28],[0.18,0.24],[0.10,0.32]],
    lines: [[0,1],[1,2],[1,3],[3,4],[4,5],[4,6]],
  },
  // Big Dipper-like — top right
  {
    stars: [[0.72,0.08],[0.78,0.11],[0.84,0.10],[0.88,0.14],[0.85,0.20],[0.78,0.22],[0.72,0.20]],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]],
  },
  // Southern Cross-like — bottom center
  {
    stars: [[0.48,0.72],[0.52,0.68],[0.56,0.72],[0.52,0.76],[0.44,0.70]],
    lines: [[0,2],[1,3],[0,4]],
  },
  // Cassiopeia W-shape — top center
  {
    stars: [[0.32,0.06],[0.37,0.12],[0.42,0.07],[0.47,0.13],[0.52,0.08]],
    lines: [[0,1],[1,2],[2,3],[3,4]],
  },
  // Small triangle — bottom left
  {
    stars: [[0.14,0.62],[0.20,0.58],[0.22,0.66]],
    lines: [[0,1],[1,2],[2,0]],
  },
  // Scattered cluster — bottom right
  {
    stars: [[0.78,0.65],[0.82,0.60],[0.86,0.65],[0.84,0.72],[0.79,0.72]],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,0]],
  },
]

export default function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    let frame = 0
    const onVis = () => {
      if (document.visibilityState === 'hidden') cancelAnimationFrame(rafRef.current)
      else rafRef.current = requestAnimationFrame(draw)
    }
    document.addEventListener('visibilitychange', onVis)

    const draw = () => {
      frame++
      const w = canvas.width; const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      CONSTELLATIONS.forEach((c, ci) => {
        // Each constellation pulses at a slightly different phase
        const pulse = 0.75 + 0.25 * Math.sin(frame * 0.008 + ci * 1.2)

        // Draw connection lines first (behind dots)
        c.lines.forEach(([a, b]) => {
          const [ax, ay] = c.stars[a]; const [bx, by] = c.stars[b]
          ctx.beginPath()
          ctx.moveTo(ax * w, ay * h)
          ctx.lineTo(bx * w, by * h)
          ctx.strokeStyle = `rgba(200,175,120,${0.055 * pulse})`
          ctx.lineWidth   = 0.6
          ctx.setLineDash([3, 6])
          ctx.stroke()
          ctx.setLineDash([])
        })

        // Draw star dots on top
        c.stars.forEach(([sx, sy], si) => {
          const starPulse = pulse * (0.85 + 0.15 * Math.sin(frame * 0.02 + si * 0.8))
          const r = 1.2 + 0.5 * Math.sin(frame * 0.015 + si * 1.4 + ci)

          // Soft glow
          const grd = ctx.createRadialGradient(sx*w, sy*h, 0, sx*w, sy*h, r * 3)
          grd.addColorStop(0, `rgba(220,195,140,${0.20 * starPulse})`)
          grd.addColorStop(1, 'rgba(220,195,140,0)')
          ctx.beginPath()
          ctx.arc(sx * w, sy * h, r * 3, 0, Math.PI * 2)
          ctx.fillStyle = grd; ctx.fill()

          // Core dot
          ctx.beginPath()
          ctx.arc(sx * w, sy * h, r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(220,195,140,${0.18 * starPulse})`
          ctx.fill()
        })
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0,
        width: '100vw', height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}