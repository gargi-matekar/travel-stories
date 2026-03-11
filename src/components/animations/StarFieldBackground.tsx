'use client'

// components/animations/StarFieldBackground.tsx
// Dark mode:  130 white/gold stars + 4 simultaneous shooting stars
// Light mode: 80 soft sepia ink-dust motes drifting upward (no shooting stars)
// Detects theme via .dark on <html>, re-checks each frame
// Pauses on hidden tab, disabled on mobile (<768px)

import { useEffect, useRef, useCallback } from 'react'

interface Star {
  x: number; y: number; radius: number
  opacity: number; speed: number; twinkleOffset: number
}

interface Shooter {
  x: number; y: number; vx: number; vy: number
  length: number; opacity: number
  phase: 'idle' | 'in' | 'move' | 'out'
  progress: number; nextFire: number
}

const SHOOTER_SLOTS = 4

function isDark() {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
}

export default function StarFieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)
  const mouseRef  = useRef({ x: 0, y: 0 })
  const activeRef = useRef(true)

  const initStars = useCallback((n: number, w: number, h: number): Star[] =>
    Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      radius: 0.4 + Math.random() * 1.3,
      opacity: 0.10 + Math.random() * 0.22,
      speed: 0.012 + Math.random() * 0.028,
      twinkleOffset: Math.random() * Math.PI * 2,
    })), [])

  // Light mode: softer, smaller dust motes
  const initMotes = useCallback((n: number, w: number, h: number): Star[] =>
    Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      radius: 0.6 + Math.random() * 1.8,
      opacity: 0.06 + Math.random() * 0.12,
      speed: 0.04 + Math.random() * 0.10,
      twinkleOffset: Math.random() * Math.PI * 2,
    })), [])

  const spawnShooter = useCallback((w: number, nextFire: number): Shooter => ({
    x: Math.random() * w * 0.65, y: 8 + Math.random() * 110,
    vx: 3.0 + Math.random() * 2.6, vy: 0.9 + Math.random() * 1.9,
    length: 65 + Math.random() * 90,
    opacity: 0, phase: 'idle', progress: 0, nextFire,
  }), [])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = canvas.offsetWidth; let h = canvas.offsetHeight
    canvas.width = w; canvas.height = h

    let stars   = initStars(130, w, h)
    let motes   = initMotes(80, w, h)
    let shooters: Shooter[] = Array.from({ length: SHOOTER_SLOTS }, (_, i) =>
      spawnShooter(w, 40 + i * 60)
    )
    let frame = 0

    const onResize = () => {
      w = canvas.offsetWidth; h = canvas.offsetHeight
      canvas.width = w; canvas.height = h
      stars = initStars(130, w, h)
      motes = initMotes(80, w, h)
    }
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth  - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      }
    }
    const onVis = () => { activeRef.current = document.visibilityState === 'visible' }
    window.addEventListener('resize',    onResize, { passive: true })
    window.addEventListener('mousemove', onMouse,  { passive: true })
    document.addEventListener('visibilitychange', onVis)

    const draw = () => {
      if (!activeRef.current) { rafRef.current = requestAnimationFrame(draw); return }
      frame++
      ctx.clearRect(0, 0, w, h)
      const dark = isDark()
      const mx = mouseRef.current.x; const my = mouseRef.current.y

      if (dark) {
        // ── DARK MODE: stars ───────────────────────────────────────────────
        stars.forEach((s) => {
          s.y += s.speed
          if (s.y > h + 2) { s.y = -2; s.x = Math.random() * w }
          const twinkle = 0.72 + 0.28 * Math.sin(frame * 0.016 + s.twinkleOffset)
          ctx.beginPath()
          ctx.arc(s.x + mx * (s.radius / 1.5), s.y + my * (s.radius / 1.5), s.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,248,230,${s.opacity * twinkle})`
          ctx.fill()
        })

        // ── DARK MODE: shooting stars — 4 independent slots ───────────────
        shooters.forEach((sh) => {
          if (sh.phase === 'idle') {
            if (frame >= sh.nextFire) {
              sh.x = Math.random() * w * 0.65; sh.y = 8 + Math.random() * 110
              sh.vx = 3.0 + Math.random() * 2.6; sh.vy = 0.9 + Math.random() * 1.9
              sh.length = 65 + Math.random() * 90
              sh.opacity = 0; sh.phase = 'in'; sh.progress = 0
            }
            return
          }
          sh.progress++
          if (sh.phase === 'in') {
            sh.opacity = Math.min(0.9, sh.progress * 0.12)
            if (sh.progress >= 8) { sh.phase = 'move'; sh.progress = 0 }
          } else if (sh.phase === 'move') {
            sh.x += sh.vx; sh.y += sh.vy
            if (sh.progress >= 48) { sh.phase = 'out'; sh.progress = 0 }
          } else if (sh.phase === 'out') {
            sh.x += sh.vx; sh.y += sh.vy
            sh.opacity = Math.max(0, 0.85 - sh.progress * 0.055)
            if (sh.opacity <= 0) {
              sh.phase = 'idle'
              sh.nextFire = frame + 240 + Math.floor(Math.random() * 240)
            }
          }
          if (sh.phase !== 'idle') {
            const grad = ctx.createLinearGradient(
              sh.x - sh.length, sh.y - sh.length * 0.38, sh.x, sh.y
            )
            grad.addColorStop(0,   'rgba(255,248,230,0)')
            grad.addColorStop(0.6, `rgba(255,248,230,${sh.opacity * 0.4})`)
            grad.addColorStop(1,   `rgba(255,248,230,${sh.opacity})`)
            ctx.beginPath()
            ctx.moveTo(sh.x - sh.length, sh.y - sh.length * 0.38)
            ctx.lineTo(sh.x, sh.y)
            ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.stroke()
            ctx.beginPath()
            ctx.arc(sh.x, sh.y, 1.8, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255,255,255,${sh.opacity})`
            ctx.fill()
          }
        })

      } else {
        // ── LIGHT MODE: floating ink dust motes ───────────────────────────
        // Motes drift upward slowly, fade in/out, gentle parallax with mouse
        motes.forEach((s) => {
          s.y -= s.speed   // upward drift (opposite of dark mode)
          if (s.y < -3) { s.y = h + 3; s.x = Math.random() * w }
          const twinkle = 0.65 + 0.35 * Math.sin(frame * 0.012 + s.twinkleOffset)
          // Soft warm sepia ink colour
          ctx.beginPath()
          ctx.arc(
            s.x + mx * (s.radius / 3),
            s.y + my * (s.radius / 3),
            s.radius, 0, Math.PI * 2
          )
          // Random between rust (#b5451b) and sand (#b87420) tones
          const warm = Math.sin(s.twinkleOffset * 3) > 0
            ? `rgba(181,69,27,${s.opacity * twinkle})`   // rust
            : `rgba(184,116,32,${s.opacity * twinkle})`  // sand/brass
          ctx.fillStyle = warm
          ctx.fill()
        })
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize',    onResize)
      window.removeEventListener('mousemove', onMouse)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [initStars, initMotes, spawnShooter])

  return (
    <canvas ref={canvasRef} aria-hidden="true" style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0,
    }} />
  )
}