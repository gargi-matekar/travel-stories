import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'
import { LazyWorldMap } from '@/components/animations'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const BASE_URL = 'https://travel-stories-eight.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'TheRoamingPostcards — Stories from the Road, by Gargi',
    template: '%s · TheRoamingPostcards',
  },
  description: 'Cinematic travel stories from across India and beyond. Real places, real questions, real feelings — by Gargi.',
  openGraph: {
    siteName: 'TheRoamingPostcards',
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: `${BASE_URL}/og/default`,
        width: 1200,
        height: 630,
        alt: 'TheRoamingPostcards by Gargi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@theroamingpostcards',
    creator: '@gargi',
  },
  icons: {
    icon: '/favicon.ico',
  },
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