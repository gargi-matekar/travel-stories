// src/app/stories/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import QuestionHighlight from '@/components/QuestionHighlight'
import SongPlayer from '@/components/SongPlayer'
import MapView from '@/components/MapView'
import StoryContent from '@/components/StoryContent'
import NavBar from '@/components/NavBar'

export const revalidate = 60

export async function generateStaticParams() {
  const stories = await prisma.story.findMany({ select: { slug: true } })
  return stories.map((s) => ({ slug: s.slug }))
}

export default async function StoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const story = await prisma.story.findUnique({
    where: { slug: params.slug },
    include: {
      moodEntries: { orderBy: { day: 'asc' } },
      expenses: true,
    },
  })

  if (!story) notFound()

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-ink-900">
        {/* HERO SECTION */}
        <section className="relative h-screen min-h-[600px] flex flex-col justify-end">
          {/* Cover image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${story.coverImage})` }}
          />
          {/* Cinematic overlay */}
          <div className="absolute inset-0 cinematic-overlay" />
          {/* Back button */}
          <div className="absolute top-24 left-6 z-10">
            <Link
              href="/stories"
              className="flex items-center gap-2 text-white/70 hover:text-white text-sm tracking-wide transition-colors"
            >
              ← All Stories
            </Link>
          </div>

          {/* Hero content */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 pb-16 w-full">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sand-300 tracking-widest text-xs uppercase">
                {story.city}, {story.country}
              </span>
              <span className="w-1 h-1 bg-sand-500 rounded-full" />
              <span className="bg-sand-500/20 border border-sand-500/40 text-sand-300 text-xs px-3 py-1 rounded-full">
                ${story.totalCost.toLocaleString()}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-light text-white leading-tight">
              {story.title}
            </h1>
            <p className="text-gray-400 mt-4 text-sm">
              {new Date(story.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-6">
          {/* QUESTION SECTION */}
          <section className="py-24">
            <QuestionHighlight question={story.questionAsked} />
          </section>

          {/* SONG SECTION */}
          <section className="py-12 border-t border-white/5">
            <SongPlayer songName={story.songName} embedUrl={story.songEmbedUrl} />
          </section>

          {/* STORY CONTENT */}
          <section className="py-16 border-t border-white/5">
            <StoryContent content={story.content} />
          </section>
        </div>

        {/* MAP SECTION — full width */}
        <section className="py-16 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-6 mb-8">
            <h2 className="text-xs tracking-[0.3em] text-sand-400 uppercase">
              Where This Happened
            </h2>
            <p className="text-white mt-2 text-lg font-serif">
              {story.city}, {story.country}
            </p>
          </div>
          <MapView
            latitude={story.latitude}
            longitude={story.longitude}
            city={story.city}
          />
        </section>

        {/* EXPENSES SECTION */}
        <section className="py-16 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-xs tracking-[0.3em] text-sand-400 uppercase mb-8">
              The Cost of This Story
            </h2>
            <div className="space-y-3">
              {story.expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between py-3 border-b border-white/5"
                >
                  <span className="text-gray-400">{expense.title}</span>
                  <span className="text-white font-light tabular-nums">
                    ${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between py-4 pt-6">
                <span className="text-white font-medium tracking-wide">Total</span>
                <span className="text-sand-300 text-xl font-serif">
                  ${story.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer spacer */}
        <div className="h-24 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-6 py-8 flex justify-between items-center">
            <Link href="/stories" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">
              ← Back to all stories
            </Link>
            <Link href="/map" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">
              Explore on map →
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
