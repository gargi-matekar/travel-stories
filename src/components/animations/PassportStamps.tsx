'use client'

// components/animations/PassportStamps.tsx
// Scattered passport-stamp SVGs fixed to the viewport edges
// position:fixed so they stay visible as you scroll
// Theme-aware: darker/more opaque in light mode, softer in dark mode

import { useEffect, useState } from 'react'

function isDark() {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
}

export default function PassportStamps() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    // Detect initial theme
    setDark(isDark())
    // Watch for theme changes
    const observer = new MutationObserver(() => setDark(isDark()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // Theme colours
  const inkColor  = dark ? 'rgba(210,175,110,1)'  : 'rgba(120,70,20,1)'
  const inkFaint  = dark ? 'rgba(210,175,110,0.7)' : 'rgba(120,70,20,0.7)'
  const inkMuted  = dark ? 'rgba(210,175,110,0.5)' : 'rgba(120,70,20,0.5)'

  return (
    <div
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        pointerEvents: 'none',
        zIndex:        0,
        overflow:      'hidden',
      }}
    >
      {STAMPS.map((s, i) => {
        const opacity = dark ? s.opacityDark : s.opacityLight
        return (
          <div
            key={i}
            style={{
              position:  'fixed',
              top:       s.top,
              left:      s.left,
              opacity,
              transform: `rotate(${s.rotate}deg)`,
              width:     s.size,
              height:    s.size,
            }}
          >
            <StampSVG
              city={s.city}
              date={s.date}
              type={s.type}
              inkColor={inkColor}
              inkFaint={inkFaint}
              inkMuted={inkMuted}
            />
          </div>
        )
      })}

      {/* Subtle repeating grid lines — map paper feel */}
      <svg
        width="100%" height="100%"
        style={{ position: 'absolute', inset: 0, opacity: dark ? 0.025 : 0.04 }}
      >
        <defs>
          <pattern id="ps-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none"
              stroke={dark ? 'rgba(200,170,110,1)' : 'rgba(100,60,15,1)'}
              strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ps-grid)" />
      </svg>
    </div>
  )
}

// ── Individual stamp SVG ────────────────────────────────────────────────────

interface StampSVGProps {
  city: string; date: string; type: string
  inkColor: string; inkFaint: string; inkMuted: string
}

function StampSVG({ city, date, type, inkColor, inkFaint, inkMuted }: StampSVGProps) {
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}>

      {/* Outer dashed border */}
      <rect x="6" y="6" width="108" height="108" rx="4"
        fill="none" stroke={inkColor} strokeWidth="1.8" strokeDasharray="4 3" />
      <rect x="10" y="10" width="100" height="100" rx="2"
        fill="none" stroke={inkFaint} strokeWidth="0.6" />

      {/* City name */}
      <text x="60" y="36" textAnchor="middle"
        fontSize="9" fontFamily="Georgia, serif"
        fill={inkColor} letterSpacing="2">
        {city.toUpperCase()}
      </text>

      {/* Central icon */}
      {type === 'compass' && (
        <g transform="translate(60,62)">
          <circle r="18" fill="none" stroke={inkFaint} strokeWidth="0.8" />
          <circle r="13" fill="none" stroke={inkMuted} strokeWidth="0.4" strokeDasharray="2 3" />
          <polygon points="0,-14 2,-4 0,-1 -2,-4" fill={inkColor} />
          <polygon points="0,14 2,4 0,1 -2,4" fill={inkFaint} />
          <line x1="-14" y1="0" x2="14" y2="0" stroke={inkMuted} strokeWidth="0.5" />
          <circle r="2" fill={inkColor} />
        </g>
      )}
      {type === 'wave' && (
        <g>
          <path d="M 20 62 Q 30 52, 40 62 T 60 62 T 80 62 T 100 62"
            fill="none" stroke={inkColor} strokeWidth="1.2" />
          <path d="M 20 70 Q 30 60, 40 70 T 60 70 T 80 70 T 100 70"
            fill="none" stroke={inkFaint} strokeWidth="0.7" />
          <path d="M 20 54 Q 30 44, 40 54 T 60 54 T 80 54 T 100 54"
            fill="none" stroke={inkMuted} strokeWidth="0.5" />
        </g>
      )}
      {type === 'mountain' && (
        <g>
          <polygon points="60,38 80,72 40,72"
            fill="none" stroke={inkColor} strokeWidth="1.2" strokeLinejoin="round" />
          <polygon points="42,58 55,38 68,58"
            fill="none" stroke={inkFaint} strokeWidth="0.8" strokeLinejoin="round" />
          <line x1="30" y1="72" x2="90" y2="72"
            stroke={inkMuted} strokeWidth="0.8" />
        </g>
      )}

      {/* Date */}
      <text x="60" y="96" textAnchor="middle"
        fontSize="7" fontFamily="'Courier New', monospace"
        fill={inkFaint} letterSpacing="1.5">
        {date}
      </text>

      {/* Corner crosshairs */}
      {([[-1,-1],[1,-1],[-1,1],[1,1]] as [number,number][]).map(([cx, cy], j) => (
        <g key={j} transform={`translate(${60 + cx*44} ${60 + cy*44})`}>
          <line x1="-5" y1="0" x2="5" y2="0" stroke={inkMuted} strokeWidth="0.6" />
          <line x1="0" y1="-5" x2="0" y2="5" stroke={inkMuted} strokeWidth="0.6" />
        </g>
      ))}
    </svg>
  )
}

// ── Stamp positions — fixed to viewport edges, never overlapping content ────

const STAMPS = [
  // Left edge — top
  { city: 'Varanasi',    date: '2024 · NOV', type: 'wave',
    top: '12%',  left: '-18px', rotate: -8,  size: '110px',
    opacityLight: 0.22, opacityDark: 0.14 },
  // Right edge — top
  { city: 'Rameshwaram', date: '2024 · MAR', type: 'compass',
    top: '20%',  left: 'calc(100vw - 95px)', rotate: 6, size: '100px',
    opacityLight: 0.20, opacityDark: 0.12 },
  // Left edge — middle
  { city: 'Hampi',       date: '2023 · DEC', type: 'mountain',
    top: '44%',  left: '-14px', rotate: -5, size: '95px',
    opacityLight: 0.18, opacityDark: 0.11 },
  // Right edge — middle-low
  { city: 'Kolkata',     date: '2023 · AUG', type: 'wave',
    top: '58%',  left: 'calc(100vw - 88px)', rotate: 9, size: '105px',
    opacityLight: 0.20, opacityDark: 0.12 },
  // Left edge — low
  { city: 'Ladakh',      date: '2023 · JUL', type: 'mountain',
    top: '74%',  left: '-16px', rotate: -4, size: '90px',
    opacityLight: 0.18, opacityDark: 0.10 },
  // Right edge — bottom
  { city: 'Pondicherry', date: '2024 · JAN', type: 'compass',
    top: '82%',  left: 'calc(100vw - 92px)', rotate: 7, size: '98px',
    opacityLight: 0.20, opacityDark: 0.11 },
]