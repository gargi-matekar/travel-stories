// src/app/layout.tsx
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'
import { LazyWorldMap } from '@/components/animations'

export const metadata: Metadata = {
  title: 'Travel Stories — Cinematic Journeys',
  description: 'Emotional travel storytelling. Real places, real questions, real feelings.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-theme-primary text-theme-primary antialiased min-h-screen">
        <LazyWorldMap />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
