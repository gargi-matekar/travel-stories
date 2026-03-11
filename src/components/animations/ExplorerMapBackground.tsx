'use client'

// components/animations/ExplorerMapBackground.tsx
// Static decorative layer: paper-map grid lines + faint compass rose watermark.
// Pure SVG — zero JS animation, zero paint cost.
// Opacity 5–8%.

export default function ExplorerMapBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.06,
      }}
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          {/* Fine grid pattern */}
          <pattern id="map-minor" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(200,175,120,0.4)" strokeWidth="0.4" />
          </pattern>
          {/* Coarser grid */}
          <pattern id="map-major" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <rect width="200" height="200" fill="url(#map-minor)" />
            <path d="M 200 0 L 0 0 0 200" fill="none" stroke="rgba(200,175,120,0.7)" strokeWidth="0.8" />
          </pattern>
        </defs>

        {/* Grid fills whole background */}
        <rect width="100%" height="100%" fill="url(#map-major)" />

        {/* Meridian / parallel hint lines */}
        {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((pct) => (
          <g key={pct}>
            <line
              x1={`${pct}%`} y1="0" x2={`${pct}%`} y2="100%"
              stroke="rgba(200,175,120,0.25)" strokeWidth="0.6"
              strokeDasharray="6 14"
            />
            <line
              x1="0" y1={`${pct}%`} x2="100%" y2={`${pct}%`}
              stroke="rgba(200,175,120,0.25)" strokeWidth="0.6"
              strokeDasharray="6 14"
            />
          </g>
        ))}

        {/* Compass rose — centered, large, watermark feel */}
        <g transform="translate(50%, 50%)" style={{ transformOrigin: 'center' }}>
          <CompassRose cx={0} cy={0} r={120} />
        </g>
      </svg>
    </div>
  )
}

// ── Inline compass rose SVG shape ────────────────────────────────────────────

function CompassRose({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const c   = `${cx} ${cy}`
  const col = 'rgba(210,185,130,0.55)'

  // Build 8 directional points (N NE E SE S SW W NW)
  const pts = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 * Math.PI) / 180
    const long  = i % 2 === 0 ? r : r * 0.6
    const short = i % 2 === 0 ? r * 0.22 : r * 0.14
    return { angle, long, short }
  })

  return (
    <g>
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={col} strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r={r * 0.6} fill="none" stroke={col} strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={r * 0.2} fill="none" stroke={col} strokeWidth="0.8" />

      {/* Tick marks every 5 degrees */}
      {Array.from({ length: 72 }, (_, i) => {
        const a   = (i * 5 * Math.PI) / 180
        const len = i % 2 === 0 ? 8 : 4
        const x1  = cx + Math.sin(a) * (r - len)
        const y1  = cy - Math.cos(a) * (r - len)
        const x2  = cx + Math.sin(a) * r
        const y2  = cy - Math.cos(a) * r
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth="0.5" />
      })}

      {/* Direction arrows */}
      {pts.map(({ angle, long, short }, i) => {
        const tipX  = cx + Math.sin(angle) * long
        const tipY  = cy - Math.cos(angle) * long
        const left  = angle - Math.PI / 2
        const baseL = `${cx + Math.sin(left) * short},${cy - Math.cos(left) * short}`
        const baseR = `${cx - Math.sin(left) * short},${cy + Math.cos(left) * short}`
        const fill  = i % 2 === 0 ? col : 'none'
        return (
          <polygon
            key={i}
            points={`${tipX},${tipY} ${baseL} ${cx},${cy} ${baseR}`}
            fill={fill}
            stroke={col}
            strokeWidth="0.5"
          />
        )
      })}

      {/* Cardinal letters */}
      {(['N','E','S','W'] as const).map((dir, i) => {
        const a  = (i * 90 * Math.PI) / 180
        const lx = cx + Math.sin(a) * (r + 14)
        const ly = cy - Math.cos(a) * (r + 14)
        return (
          <text
            key={dir} x={lx} y={ly}
            textAnchor="middle" dominantBaseline="central"
            fontSize="14" fontFamily="Georgia, serif"
            fontWeight="600" fill={col} letterSpacing="0.1em"
          >{dir}</text>
        )
      })}
    </g>
  )
}