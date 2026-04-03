// src/app/stories/page.tsx
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import StoryCard from '@/components/StoryCard'
import NavBar from '@/components/NavBar'

export const revalidate = 60

export default async function StoriesPage() {
  const stories = await prisma.story.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-theme-primary pt-20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-16">
            <p className="text-theme-sand tracking-[0.3em] text-sm uppercase mb-3">The Archive</p>
            <h1 className="text-5xl md:text-6xl font-serif font-light text-theme-primary">All Stories</h1>
            <p className="text-theme-muted mt-4 text-lg">
              {stories.length} {stories.length === 1 ? 'journey' : 'journeys'} documented
            </p>
          </div>

          {stories.length === 0 ? (
            <div className="text-center py-32 text-theme-muted">
              <p className="text-2xl font-serif">No stories yet.</p>
              <p className="mt-2 text-sm">The first adventure is waiting to be written.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map(story => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}