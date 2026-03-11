// src/app/stories/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import QuestionHighlight from '@/components/QuestionHighlight'
import SongPlayer from '@/components/SongPlayer'
import MapView from '@/components/MapView'
import StoryContent from '@/components/StoryContent'
import NavBar from '@/components/NavBar'
import JourneyRouteMap from '@/components/JourneyRouteMap'
import JourneyTimeline from '@/components/JourneyTimeline'
import LocalRecommendations from '@/components/LocalRecommendations'
import StoryAnimations from '@/components/StoryAnimations'
import dynamic from 'next/dynamic'

const PassportStamps      = dynamic(() => import('@/components/animations/PassportStamps'),      { ssr: false })
const FloatingCoordinates = dynamic(() => import('@/components/animations/FloatingCoordinates'), { ssr: false })
const ParallaxMountains   = dynamic(() => import('@/components/animations/ParallaxMountains'),   { ssr: false })

export const revalidate = 60

export async function generateStaticParams() {
  const stories = await prisma.story.findMany({ select: { slug: true } })
  return stories.map((s) => ({ slug: s.slug }))
}

export default async function StoryPage({ params }: { params: { slug: string } }) {
  const story = await prisma.story.findUnique({
    where: { slug: params.slug },
    include: {
      expenses:        true,
      journeySteps:    { orderBy: { order: 'asc' } },
      routeStops:      { orderBy: { order: 'asc' } },
      recommendations: true,
    },
  })

  if (!story) notFound()

  return (
    <>
      <NavBar />
      <StoryAnimations />

      <main
        className="min-h-screen bg-theme-primary text-theme-primary"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Passport stamp texture — works in both themes, uses CSS variable colors */}
        <PassportStamps />

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative h-[70vh] min-h-[500px] flex flex-col justify-end overflow-hidden">
          <div
            className="story-hero-bg absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url(${story.coverImage})` }}
          />
          {/* Gradient — works in both themes */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.15) 100%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)' }} />

          <div className="absolute top-6 left-6 z-10">
            <Link href="/stories"
              className="flex items-center gap-2 text-white/70 hover:text-white text-xs tracking-widest uppercase transition-colors">
              ← All Stories
            </Link>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 pb-14 w-full">
            <div className="story-reveal flex items-center gap-3 mb-4" style={{ animationDelay: '0.1s' }}>
              <span className="tracking-widest text-xs uppercase text-white/70">
                {story.city}, {story.country}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="text-white/60 text-xs px-3 py-1 rounded-full border border-white/20">
                ${story.totalCost.toLocaleString()}
              </span>
            </div>
            <h1 className="story-reveal text-4xl md:text-6xl font-serif font-light text-white leading-tight"
              style={{ animationDelay: '0.2s' }}>
              {story.title}
            </h1>
            <p className="story-reveal text-white/50 mt-3 text-sm" style={{ animationDelay: '0.35s' }}>
              {new Date(story.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="story-reveal mt-8 flex items-center gap-3 opacity-40" style={{ animationDelay: '0.5s' }}>
              <div className="w-px h-8 bg-white animate-pulse" />
              <span className="text-white text-xs tracking-[0.3em] uppercase">Scroll</span>
            </div>
          </div>
        </section>

        {/* ── SONG + QUESTION + STORY CONTENT ─────────────────────────────────
            FloatingCoordinates drifts faintly behind prose while reading    */}
        <div className="relative">
          <FloatingCoordinates />

          <div className="relative z-10 max-w-4xl mx-auto px-6">

            {/* ── SONG ─────────────────────────────────────────────────────── */}
            <section className="scroll-reveal py-16 border-t border-theme">
              <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: 'var(--sand)' }}>
                Song of the City
              </p>
              <SongPlayer songName={story.songName} embedUrl={story.songEmbedUrl} />
            </section>

            {/* ── QUESTION ─────────────────────────────────────────────────── */}
            <section className="scroll-reveal py-16 border-t border-theme">
              <QuestionHighlight question={story.questionAsked} />
            </section>

            {/* ── STORY CONTENT ────────────────────────────────────────────── */}
            <section className="scroll-reveal py-16 border-t border-theme">
              <StoryContent content={story.content} />
            </section>

          </div>
        </div>

        {/* Mountains divider — theme-aware via CSS vars in the component */}
        <ParallaxMountains />

        {/* ── JOURNEY ROUTE MAP ─────────────────────────────────────────────── */}
        {story.routeStops.length > 0 && (
          <section className="scroll-reveal py-16 border-t border-theme">
            <div className="max-w-4xl mx-auto px-6 mb-8">
              <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: 'var(--sand)' }}>
                The Path Taken
              </p>
              <h2 className="text-2xl font-serif font-light" style={{ color: 'var(--text-primary)' }}>
                Journey Route
              </h2>
            </div>
            <div className="max-w-4xl mx-auto px-6">
              <JourneyRouteMap stops={story.routeStops} />
            </div>
          </section>
        )}

        {/* ── JOURNEY TIMELINE ──────────────────────────────────────────────── */}
        {story.journeySteps.length > 0 && (
          <section className="scroll-reveal py-16 border-t border-theme">
            <div className="max-w-4xl mx-auto px-6">
              <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: 'var(--sand)' }}>
                The Journey
              </p>
              <h2 className="text-2xl font-serif font-light mb-12" style={{ color: 'var(--text-primary)' }}>
                Day by Day
              </h2>
              <JourneyTimeline steps={story.journeySteps} />
            </div>
          </section>
        )}

        {/* ── LOCAL RECOMMENDATIONS ─────────────────────────────────────────── */}
        {story.recommendations.length > 0 && (
          <section className="scroll-reveal py-16 border-t border-theme">
            <div className="max-w-4xl mx-auto px-6">
              <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: 'var(--sand)' }}>
                Curated Picks
              </p>
              <h2 className="text-2xl font-serif font-light mb-12" style={{ color: 'var(--text-primary)' }}>
                Local Recommendations
              </h2>
              <LocalRecommendations recommendations={story.recommendations} />
            </div>
          </section>
        )}

        {/* ── EXPENSE BREAKDOWN ─────────────────────────────────────────────── */}
        <section className="scroll-reveal py-16 border-t border-theme">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-xs tracking-[0.3em] uppercase mb-8" style={{ color: 'var(--sand)' }}>
              The Cost of This Story
            </h2>
            <div className="space-y-3">
              {story.expenses.map((expense, i) => (
                <div
                  key={expense.id}
                  className="expense-row flex items-center justify-between py-3 border-b border-theme"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>{expense.title}</span>
                  <span className="font-light tabular-nums" style={{ color: 'var(--text-primary)' }}>
                    ${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between py-4 pt-6">
                <span className="font-medium tracking-wide" style={{ color: 'var(--text-primary)' }}>Total</span>
                <span className="text-xl font-serif" style={{ color: 'var(--sand)' }}>
                  ${story.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── FULL MAP ──────────────────────────────────────────────────────── */}
        <section className="scroll-reveal py-16 border-t border-theme">
          <div className="max-w-4xl mx-auto px-6 mb-8">
            <h2 className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--sand)' }}>
              Where This Happened
            </h2>
            <p className="mt-2 text-lg font-serif" style={{ color: 'var(--text-primary)' }}>
              {story.city}, {story.country}
            </p>
          </div>
          <MapView latitude={story.latitude} longitude={story.longitude} city={story.city} />
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────────────── */}
        <div className="h-24 border-t border-theme">
          <div className="max-w-4xl mx-auto px-6 py-8 flex justify-between items-center">
            <Link href="/stories"
              className="text-sm transition-colors hover:opacity-80"
              style={{ color: 'var(--text-muted)' }}>
              ← Back to all stories
            </Link>
            <Link href="/map"
              className="text-sm transition-colors hover:opacity-80"
              style={{ color: 'var(--text-muted)' }}>
              Explore on map →
            </Link>
          </div>
        </div>

      </main>
    </>
  )
}