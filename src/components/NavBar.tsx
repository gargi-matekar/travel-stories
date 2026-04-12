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
          <Link href="/trips" className="text-sm tracking-wide text-theme-secondary hover:text-theme-primary transition-colors">
            Trips
          </Link>
          <Link href="/map" className="text-sm tracking-wide text-theme-secondary hover:text-theme-primary transition-colors">
            Map
          </Link>
          <Link href="/explore" className="text-sm tracking-wide text-theme-secondary hover:text-theme-primary transition-colors">
            Explore
          </Link>

        </div>
      </div>
    </nav>
  )
}