// src/components/StoryCard.tsx
'use client'
import Link from 'next/link'

interface StoryCardProps {
  story: {
    slug: string
    title: string
    city: string
    country: string
    coverImage: string
    totalCost: number
    songName: string
    moodEntries: { mood: string }[]
  }
}

export default function StoryCard({ story }: StoryCardProps) {
  const primaryMood = story.moodEntries[0]?.mood

  return (
    <Link href={`/stories/${story.slug}`} className="group block">
      <article
        className="relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 group-hover:-translate-y-1"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        <div className="relative h-72 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${story.coverImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

          <div className="absolute top-4 left-4 flex gap-2">
            {primaryMood && (
              <span className="bg-black/50 backdrop-blur-sm border border-white/20 text-white text-xs px-2.5 py-1 rounded-full">
                {primaryMood}
              </span>
            )}
          </div>
          <div className="absolute top-4 right-4">
            <span className="backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/20"
              style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
              ${story.totalCost.toLocaleString()}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-white/60 text-xs tracking-widest uppercase mb-1">
              {story.city}, {story.country}
            </p>
            <h2 className="text-white font-serif text-xl leading-tight">
              {story.title}
            </h2>
          </div>
        </div>

        <div className="px-5 py-3 flex items-center gap-2" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-theme-muted text-xs">♪</span>
          <p className="text-theme-muted text-xs truncate italic">{story.songName}</p>
        </div>
      </article>
    </Link>
  )
}