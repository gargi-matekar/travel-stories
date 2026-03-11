'use client'

// components/animations/ParallaxMountains.tsx
// Section divider — 3-layer SVG parallax mountain + pine tree silhouettes
// Dark mode:  navy/midnight blue silhouettes  (unchanged)
// Light mode: warm sepia/parchment brown hills — like ink on aged paper
// Detects theme via .dark on <html>

import { useEffect, useRef } from 'react'

const TREES: [number, number, number][] = [
  [42,  175, 0.90], [92,  170, 1.10], [152, 168, 0.85],
  [228, 172, 1.00], [308, 166, 1.20], [392, 170, 0.92],
  [472, 164, 1.05], [568, 168, 0.80], [648, 161, 1.15],
  [738, 165, 1.00], [838, 169, 0.90], [928, 162, 1.10],
  [1018,167, 0.85],[1108, 163, 1.00],[1198, 168, 0.92],
  [1288,160, 1.05],[1378, 166, 0.80],
]

export default function ParallaxMountains() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const bgRef   = useRef<SVGGElement>(null)
  const midRef  = useRef<SVGGElement>(null)
  const fgRef   = useRef<SVGGElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    let ticking = false
    const update = () => {
      const rect  = wrap.getBoundingClientRect()
      const vh    = window.innerHeight
      const total = vh + wrap.offsetHeight
      const prog  = Math.min(1, Math.max(0, (vh - rect.top) / total))
      if (bgRef.current)  bgRef.current.style.transform  = `translateY(${(prog - 0.5) * 48}px)`
      if (midRef.current) midRef.current.style.transform = `translateY(${(prog - 0.5) * 22}px)`
      if (fgRef.current)  fgRef.current.style.transform  = `translateY(${(prog - 0.5) * 8}px)`
      ticking = false
    }
    const onScroll = () => { if (!ticking) { requestAnimationFrame(update); ticking = true } }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position: 'relative', width: '100%', height: '200px',
        overflow: 'hidden', pointerEvents: 'none',
        borderTop:    '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* ── DARK MODE layers ─────────────────────────────────────────────── */}
      <svg className="dark-mountains"
        viewBox="0 0 1440 200" preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <g ref={bgRef} style={{ willChange: 'transform' }}>
          <path d="M 0 200 L 0 138 L 80 98 L 160 128 L 260 58 L 380 118 L 480 78
                   L 580 108 L 700 48 L 820 98 L 920 68 L 1040 103 L 1160 53
                   L 1280 88 L 1380 108 L 1440 93 L 1440 200 Z"
            fill="rgba(28, 38, 55, 0.50)" />
        </g>
        <g ref={midRef} style={{ willChange: 'transform' }}>
          <path d="M 0 200 L 0 158 L 100 118 L 200 143 L 320 83 L 440 128 L 540 98
                   L 640 123 L 760 68 L 880 113 L 980 88 L 1100 118 L 1220 78
                   L 1340 108 L 1440 118 L 1440 200 Z"
            fill="rgba(18, 27, 44, 0.68)" />
        </g>
        <g ref={fgRef} style={{ willChange: 'transform' }}>
          <path d="M 0 200 L 0 173 L 60 158 L 130 168 L 200 153 L 290 163 L 380 148
                   L 460 163 L 560 146 L 660 158 L 750 143 L 850 160 L 950 148
                   L 1060 163 L 1160 146 L 1260 156 L 1360 150 L 1440 158 L 1440 200 Z"
            fill="rgba(10, 15, 22, 0.88)" />
          {TREES.map(([tx, ty, ts], i) => (
            <g key={i} transform={`translate(${tx} ${ty}) scale(${ts})`}>
              <polygon points="0,-30 -11,0 11,0"  fill="rgba(8,13,20,0.95)" />
              <polygon points="0,-18 -8,5 8,5"    fill="rgba(8,13,20,0.95)" />
              <polygon points="0,-6  -10,10 10,10" fill="rgba(8,13,20,0.95)" />
              <rect x="-2" y="10" width="4" height="8" fill="rgba(8,13,20,0.95)" />
            </g>
          ))}
        </g>
        <line x1="0" y1="143" x2="1440" y2="143" stroke="rgba(232,134,90,0.05)" strokeWidth="1.5" />
      </svg>

      {/* ── LIGHT MODE layers — sepia ink hills ──────────────────────────── */}
      <svg className="light-mountains"
        viewBox="0 0 1440 200" preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <g style={{ willChange: 'transform' }}>
          <path d="M 0 200 L 0 138 L 80 98 L 160 128 L 260 58 L 380 118 L 480 78
                   L 580 108 L 700 48 L 820 98 L 920 68 L 1040 103 L 1160 53
                   L 1280 88 L 1380 108 L 1440 93 L 1440 200 Z"
            fill="rgba(90, 60, 20, 0.10)" />
        </g>
        <g style={{ willChange: 'transform' }}>
          <path d="M 0 200 L 0 158 L 100 118 L 200 143 L 320 83 L 440 128 L 540 98
                   L 640 123 L 760 68 L 880 113 L 980 88 L 1100 118 L 1220 78
                   L 1340 108 L 1440 118 L 1440 200 Z"
            fill="rgba(80, 50, 15, 0.14)" />
        </g>
        <g style={{ willChange: 'transform' }}>
          <path d="M 0 200 L 0 173 L 60 158 L 130 168 L 200 153 L 290 163 L 380 148
                   L 460 163 L 560 146 L 660 158 L 750 143 L 850 160 L 950 148
                   L 1060 163 L 1160 146 L 1260 156 L 1360 150 L 1440 158 L 1440 200 Z"
            fill="rgba(70, 42, 10, 0.22)" />
          {TREES.map(([tx, ty, ts], i) => (
            <g key={i} transform={`translate(${tx} ${ty}) scale(${ts})`}>
              <polygon points="0,-30 -11,0 11,0"  fill="rgba(55,35,10,0.30)" />
              <polygon points="0,-18 -8,5 8,5"    fill="rgba(55,35,10,0.30)" />
              <polygon points="0,-6  -10,10 10,10" fill="rgba(55,35,10,0.30)" />
              <rect x="-2" y="10" width="4" height="8" fill="rgba(55,35,10,0.30)" />
            </g>
          ))}
        </g>
        <line x1="0" y1="143" x2="1440" y2="143" stroke="rgba(181,69,27,0.08)" strokeWidth="1" />
      </svg>

      <style>{`
        :root .dark-mountains { display: none; }
        :root .light-mountains { display: block; }
        .dark .dark-mountains  { display: block; }
        .dark .light-mountains { display: none; }
      `}</style>
    </div>
  )
}