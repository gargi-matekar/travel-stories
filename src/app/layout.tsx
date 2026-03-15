// src/app/layout.tsx
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'
import { LazyWorldMap } from '@/components/animations'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Travel Stories — Cinematic Journeys',
  description: 'Emotional travel storytelling. Real places, real questions, real feelings.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-theme-primary text-theme-primary antialiased min-h-screen">
        <LazyWorldMap />
        <ThemeProvider>
          <NavBar />
          {children}
          <Footer />
          </ThemeProvider>
      </body>
    </html>
  )
}
