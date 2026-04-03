// src/app/stories/[slug]/page.tsx
export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CitySongSection from '@/components/SongPlayer'
import CityQuestionSection from '@/components/QuestionHighlight'
import JourneyRouteMap from '@/components/JourneyRouteMap'
import CityFramesSection from '@/components/story/CityFramesSection'
import LocalRecommendationsSection from '@/components/LocalRecommendations'
import PhotoMemoriesSection from '@/components/story/PhotoMemoriesSection'
import JourneyTimeline from '@/components/JourneyTimeline'
import PartOfATripSection from '@/components/story/PartOfATripSection'
import ClosingReflection from '@/components/story/ClosingReflection'
import StoryContent from '@/components/StoryContent'

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  const stories = await prisma.story.findMany({ select: { slug: true } })
  return stories.map((s) => ({ slug: s.slug }))
}

export default async function StoryPage({ params }: Props) {
  const story = await prisma.story.findUnique({
    where: { slug: params.slug },
    include: {
      trip: true,
      cityFrames: { orderBy: { order: 'asc' } },
      routeStops: { orderBy: { order: 'asc' } },
      recommendations: true,
      photoMemories: { orderBy: { order: 'asc' } },
      journeySteps: { orderBy: { order: 'asc' } },
      // NOTE: expenses intentionally excluded — shown on Trip page only
    },
  })

  if (!story) notFound()

  return (
    <main style={{ background: 'transparent', color: 'var(--text-primary)' }}>

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="relative flex items-end" style={{ minHeight: '85vh', overflow: 'hidden' }}>
        {story.coverImage && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${story.coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
          }}
        />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-20">
          {story.coordinates && (
            <p className="text-xs font-mono mb-4 tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
              ◎ {story.coordinates}
            </p>
          )}
          <p className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {[story.state, story.country].filter(Boolean).join(', ')}
          </p>
          <h1
            className="font-bold text-white mb-4"
            style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 8vw, 5rem)', lineHeight: 1.1 }}
          >
            {story.city}
          </h1>
          <p
            className="max-w-xl leading-relaxed"
            style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'rgba(255,255,255,0.75)' }}
          >
            {story.title}
          </p>
        </div>
      </section>

      {/* ── 2. SONG OF THE CITY ─────────────────────────────────── */}
      <section className="py-20" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto px-6">
      {story.songName && story.songEmbedUrl && (
        <CitySongSection songName={story.songName} songEmbedUrl={story.songEmbedUrl} />
      )}
      </div>
      </section>

      {/* ── 3. QUESTION ─────────────────────────────────────────── */}
      <section className="py-20" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto px-6">
      {story.questionAsked && (
        <CityQuestionSection question={story.questionAsked} />
      )}
      </div>
      </section>

      {/* ── 4. STORY NARRATIVE ──────────────────────────────────── */}
      {story.content && (
        <section className="py-20" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="max-w-3xl mx-auto px-6">
          <StoryContent content={story.content} />
          </div>
        </section>
      )}

      {/* ── 5. JOURNEY ROUTE MAP ────────────────────────────────── */}
      {story.routeStops.length > 0 && (
        <section className="py-20" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--accent)' }}>The Walk</p>
            <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
              Journey Route
            </h2>
            <JourneyRouteMap stops={story.routeStops} />
          </div>
        </section>
      )}


      {/* ── 6. CITY IN 5 FRAMES ─────────────────────────────────── */}
      {story.cityFrames.length > 0 && (
        <CityFramesSection frames={story.cityFrames} city={story.city} />
      )}

      <section className="py-20" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto px-6">
          {/* ── 7. PLACES I LOVED ───────────────────────────────────── */}
          {story.recommendations.length > 0 && (
            <LocalRecommendationsSection recommendations={story.recommendations} />
          )}
        </div>
      </section>

      {/* ── 8. PHOTO MEMORIES ───────────────────────────────────── */}
      {story.photoMemories.length > 0 && (
        <PhotoMemoriesSection memories={story.photoMemories} />
      )}

      <section className="py-20" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto px-6">
          {/* ── 9. JOURNEY TIMELINE ─────────────────────────────────── */}
          {story.journeySteps.length > 0 && (
            <JourneyTimeline steps={story.journeySteps} />
          )}
        </div>
      </section>

      {/* ── 10. PART OF A LARGER TRIP ───────────────────────────── */}
      {story.trip && <PartOfATripSection trip={story.trip} />}

      {/* ── 11. CLOSING REFLECTION ──────────────────────────────── */}
      {story.closingReflection && (
        <ClosingReflection reflection={story.closingReflection} city={story.city} />
      )}

    </main>
  )
}