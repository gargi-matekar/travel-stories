'use client'

// components/animations/TravelRouteLines.tsx
// Journey section backdrop — animated SVG route lines
// Dark mode:  warm orange glow routes on navy
// Light mode: rust/sepia ink routes on parchment — slightly more opaque
// Detects theme via .dark on <html>

import { useEffect, useRef, useState } from 'react'

interface RoutePoint { x: number; y: number }
interface Route { points: RoutePoint[]; label: string; dashLen: number }

const ROUTES: Route[] = [
  {
    label: 'Pune → Hampi', dashLen: 520,
    points: [{ x:340,y:480 },{ x:280,y:560 },{ x:260,y:640 },{ x:290,y:700 }],
  },
  {
    label: 'Pune → Rameshwaram', dashLen: 940,
    points: [{ x:340,y:480 },{ x:380,y:580 },{ x:390,y:660 },{ x:360,y:750 },{ x:350,y:800 }],
  },
  {
    label: 'Delhi → Varanasi', dashLen: 440,
    points: [{ x:400,y:220 },{ x:480,y:260 },{ x:520,y:310 },{ x:570,y:360 }],
  },
  {
    label: 'Mumbai → Goa', dashLen: 380,
    points: [{ x:290,y:500 },{ x:260,y:570 },{ x:240,y:620 }],
  },
]

function pointsToD(pts: RoutePoint[]): string {
  if (pts.length < 2) return ''
  const [first, ...rest] = pts
  let d = `M ${first.x} ${first.y}`
  rest.forEach((p, i) => {
    const prev = pts[i]
    const cpx  = (prev.x + p.x) / 2
    d += ` C ${cpx} ${prev.y + (p.y - prev.y) * 0.25}, ${cpx} ${prev.y + (p.y - prev.y) * 0.75}, ${p.x} ${p.y}`
  })
  return d
}

function approxLen(pts: RoutePoint[]): number {
  let l = 0
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i-1].x; const dy = pts[i].y - pts[i-1].y
    l += Math.sqrt(dx*dx + dy*dy)
  }
  return l
}

interface RouteState {
  progress: number; opacity: number; glowPhase: number
  phase: 'draw' | 'pulse' | 'fade' | 'idle'; delay: number
}

function isDark() {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
}

export default function TravelRouteLines() {
  const svgRef     = useRef<SVGSVGElement>(null)
  const rafRef     = useRef<number>(0)
  const runningRef = useRef(false)
  const stateRef   = useRef<RouteState[]>(
    ROUTES.map((_, i) => ({ progress: 0, opacity: 0, glowPhase: 0, phase: 'idle' as const, delay: i * 90 }))
  )
  const pathRefs = useRef<(SVGPathElement | null)[]>([])
  const glowRefs = useRef<(SVGPathElement | null)[]>([])
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted || !svgRef.current) return
    let frame = 0

    const tick = () => {
      frame++
      const dark = isDark()
      // Dark: max opacity 0.10 / Light: max opacity 0.14 (slightly more visible on parchment)
      const maxOpacity = dark ? 0.10 : 0.14

      stateRef.current.forEach((s, i) => {
        const path = pathRefs.current[i]; const glow = glowRefs.current[i]
        if (!path || !glow) return
        const len = approxLen(ROUTES[i].points) * 1.15

        if (!runningRef.current) {
          s.phase = 'idle'; s.progress = 0; s.opacity = 0
          path.style.strokeDashoffset = String(len)
          path.style.opacity = '0'; glow.style.opacity = '0'
          return
        }

        if (s.phase === 'idle') {
          if (frame >= s.delay) s.phase = 'draw'
        } else if (s.phase === 'draw') {
          s.progress = Math.min(1, s.progress + 0.003)
          s.opacity  = Math.min(maxOpacity, s.opacity + 0.003)
          const offset = len * (1 - s.progress)
          path.style.strokeDasharray  = `${len}`
          path.style.strokeDashoffset = `${offset}`
          path.style.opacity = `${s.opacity}`
          glow.style.strokeDasharray  = `${len}`
          glow.style.strokeDashoffset = `${offset}`
          glow.style.opacity = `${s.opacity * 0.6}`
          if (s.progress >= 1) { s.phase = 'pulse'; s.glowPhase = 0 }
        } else if (s.phase === 'pulse') {
          s.glowPhase += 0.03
          glow.style.opacity = `${(dark ? 0.06 : 0.08) + 0.04 * Math.sin(s.glowPhase)}`
          path.style.opacity = `${maxOpacity}`
          if (s.glowPhase > Math.PI * 5) s.phase = 'fade'
        } else if (s.phase === 'fade') {
          s.opacity = Math.max(0, s.opacity - 0.001)
          path.style.opacity = `${s.opacity}`
          glow.style.opacity = `${s.opacity * 0.5}`
          if (s.opacity <= 0) { s.phase = 'idle'; s.progress = 0; s.delay = frame + 180 + i * 90 }
        }
      })

      // Update stroke colors based on current theme
      pathRefs.current.forEach((p) => {
        if (p) p.setAttribute('stroke', isDark() ? 'rgba(232,190,130,1)' : 'rgba(140,70,20,1)')
      })
      glowRefs.current.forEach((g) => {
        if (g) g.setAttribute('stroke', isDark() ? 'rgba(232,134,90,1)' : 'rgba(181,69,27,1)')
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    const obs = new IntersectionObserver(([e]) => { runningRef.current = e.isIntersecting }, { threshold: 0.1 })
    obs.observe(svgRef.current)
    return () => { cancelAnimationFrame(rafRef.current); obs.disconnect() }
  }, [mounted])

  if (!mounted) return null

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    >
      <defs>
        <filter id="trl-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {ROUTES.map((route, i) => {
        const d = pointsToD(route.points); const len = approxLen(route.points) * 1.15
        return (
          <g key={i}>
            <path ref={(el) => { glowRefs.current[i] = el }}
              d={d} fill="none" stroke="rgba(232,134,90,1)"
              strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
              filter="url(#trl-glow)"
              style={{ strokeDasharray: len, strokeDashoffset: len, opacity: 0, transition: 'none' }} />
            <path ref={(el) => { pathRefs.current[i] = el }}
              d={d} fill="none" stroke="rgba(232,190,130,1)"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={len} strokeDashoffset={len}
              style={{ opacity: 0, transition: 'none' }} />
            <circle
              cx={route.points[route.points.length - 1].x}
              cy={route.points[route.points.length - 1].y}
              r="3" fill="rgba(232,134,90,0.4)" />
          </g>
        )
      })}
    </svg>
  )
}