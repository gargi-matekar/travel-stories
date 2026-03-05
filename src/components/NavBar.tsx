'use client'
// src/components/NavBar.tsx
import Link from 'next/link'
import { useTheme } from '@/components/ThemeProvider'

interface NavBarProps { transparent?: boolean }

export default function NavBar({ transparent = false }: NavBarProps) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={transparent
        ? { background: 'transparent' }
        : { background: 'var(--nav-bg)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--border)' }
      }
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-lg tracking-wide transition-colors text-theme-primary hover:text-theme-accent">
          <span style={{ color: 'var(--accent)' }}>✦</span> Travel Stories
        </Link>

        <div className="flex items-center gap-7">
          <Link href="/stories" className="text-sm tracking-wide text-theme-secondary hover:text-theme-primary transition-colors">
            Stories
          </Link>
          <Link href="/map" className="text-sm tracking-wide text-theme-secondary hover:text-theme-primary transition-colors">
            Map
          </Link>

          {/* Toggle — sliding pill track */}
          <button
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-theme transition-all duration-200 hover:bg-theme-muted"
          >
            {/* Track */}
            <div
              className="relative w-9 h-5 rounded-full flex-shrink-0 transition-colors duration-300"
              style={{ backgroundColor: isDark ? 'var(--accent)' : 'var(--bg-muted)', border: '1px solid var(--border)' }}
            >
              {/* Thumb */}
              <div
                className="absolute top-0.5 w-4 h-4 rounded-full shadow-sm transition-all duration-300"
                style={{
                  left: isDark ? '18px' : '2px',
                  backgroundColor: isDark ? '#fff' : 'var(--accent)',
                }}
              />
            </div>
            <span className="text-sm select-none">{isDark ? '🌙' : '☀️'}</span>
          </button>
        </div>
      </div>
    </nav>
  )
}