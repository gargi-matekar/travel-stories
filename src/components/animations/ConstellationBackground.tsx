'use client'

// components/animations/ConstellationBackground.tsx
// Fixed canvas — site-wide backdrop behind all content
// Dark mode:  gold constellation dots + dashed lines on navy
// Light mode: sepia ink dots + dashed lines on parchment
// Detects theme via .dark class on <html>

import { useEffect, useRef } from 'react'

const CONSTELLATIONS = [
  {
    stars: [[0.08,0.12],[0.12,0.18],[0.16,0.14],[0.11,0.22],[0.14,0.28],[0.18,0.24],[0.10,0.32]],
    lines: [[0,1],[1,2],[1,3],[3,4],[4,5],[4,6]],
  },
  {
    stars: [[0.72,0.08],[0.78,0.11],[0.84,0.10],[0.88,0.14],[0.85,0.20],[0.78,0.22],[0.72,0.20]],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]],
  },
  {
    stars: [[0.48,0.72],[0.52,0.68],[0.56,0.72],[0.52,0.76],[0.44,0.70]],
    lines: [[0,2],[1,3],[0,4]],
  },
  {
    stars: [[0.32,0.06],[0.37,0.12],[0.42,0.07],[0.47,0.13],[0.52,0.08]],
    lines: [[0,1],[1,2],[2,3],[3,4]],
  },
  {
    stars: [[0.14,0.62],[0.20,0.58],[0.22,0.66]],
    lines: [[0,1],[1,2],[2,0]],
  },
  {
    stars: [[0.78,0.65],[0.82,0.60],[0.86,0.65],[0.84,0.72],[0.79,0.72]],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,0]],
  },
]

function isDark() {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
}

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
      const dark = isDark()

      // Theme colours
      // Dark:  warm gold constellation on navy
      // Light: sepia ink constellation on parchment — lower opacity so it's subtle
      const lineColor  = dark ? 'rgba(200,175,120,' : 'rgba(90,60,20,'
      const dotColor   = dark ? 'rgba(220,195,140,' : 'rgba(90,60,20,'
      const glowColor  = dark ? 'rgba(220,195,140,' : 'rgba(140,90,30,'
      const lineBase   = dark ? 0.055 : 0.04
      const dotBase    = dark ? 0.18  : 0.12
      const glowBase   = dark ? 0.20  : 0.10

      ctx.clearRect(0, 0, w, h)

      CONSTELLATIONS.forEach((c, ci) => {
        const pulse = 0.75 + 0.25 * Math.sin(frame * 0.008 + ci * 1.2)

        c.lines.forEach(([a, b]) => {
          const [ax, ay] = c.stars[a]; const [bx, by] = c.stars[b]
          ctx.beginPath()
          ctx.moveTo(ax * w, ay * h)
          ctx.lineTo(bx * w, by * h)
          ctx.strokeStyle = `${lineColor}${lineBase * pulse})`
          ctx.lineWidth   = dark ? 0.6 : 0.5
          ctx.setLineDash([3, 6])
          ctx.stroke()
          ctx.setLineDash([])
        })

        c.stars.forEach(([sx, sy], si) => {
          const sp = pulse * (0.85 + 0.15 * Math.sin(frame * 0.02 + si * 0.8))
          const r  = (dark ? 1.2 : 0.9) + 0.4 * Math.sin(frame * 0.015 + si * 1.4 + ci)

          const grd = ctx.createRadialGradient(sx*w, sy*h, 0, sx*w, sy*h, r * 3)
          grd.addColorStop(0, `${glowColor}${glowBase * sp})`)
          grd.addColorStop(1, `${glowColor}0)`)
          ctx.beginPath()
          ctx.arc(sx*w, sy*h, r * 3, 0, Math.PI * 2)
          ctx.fillStyle = grd; ctx.fill()

          ctx.beginPath()
          ctx.arc(sx*w, sy*h, r, 0, Math.PI * 2)
          ctx.fillStyle = `${dotColor}${dotBase * sp})`
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
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  )
}