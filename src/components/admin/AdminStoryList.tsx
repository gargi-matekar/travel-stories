// src/components/admin/AdminStoryList.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface StoryRow {
  id: string
  title: string
  city: string
  country: string
  slug: string
  totalCost: number
  createdAt: Date
  _count: { moodEntries: number; expenses: number }
}

export default function AdminStoryList({ stories }: { stories: StoryRow[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      // Auth via httpOnly cookie server-side
      await fetch(`/api/admin/stories/${id}`, {
        method: 'DELETE',
        headers: {},
      })
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setDeletingId(null)
      setConfirmId(null)
    }
  }

  if (!stories.length) {
    return (
      <div className="text-center py-24 text-gray-600">
        <p className="text-2xl font-serif mb-2">No stories yet.</p>
        <Link href="/admin/new" className="text-sand-400 hover:text-sand-300 text-sm">
          Create your first story →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {stories.map((story) => (
        <div
          key={story.id}
          className="flex items-center justify-between p-4 bg-ink-800 border border-white/5 hover:border-white/10 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="text-white font-medium truncate">{story.title}</h3>
              <span className="text-gray-600 text-xs hidden sm:block">/{story.slug}</span>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-gray-500 text-sm">{story.city}, {story.country}</span>
              <span className="text-gray-600 text-xs">
                {story._count.moodEntries} moods · {story._count.expenses} expenses
              </span>
              <span className="text-sand-600 text-xs">${story.totalCost.toLocaleString()}</span>
            </div>
            <p className="text-gray-700 text-xs mt-1">
              {new Date(story.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
              })}
            </p>
          </div>

          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <Link
              href={`/stories/${story.slug}`}
              className="px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
              target="_blank"
            >
              View
            </Link>
            <Link
              href={`/admin/edit/${story.id}`}
              className="px-3 py-1.5 text-xs text-white bg-ink-700 hover:bg-ink-600 border border-white/10 transition-colors"
            >
              Edit
            </Link>

            {confirmId === story.id ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-400">Delete?</span>
                <button
                  onClick={() => handleDelete(story.id)}
                  disabled={deletingId === story.id}
                  className="px-3 py-1.5 text-xs bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deletingId === story.id ? '...' : 'Yes'}
                </button>
                <button
                  onClick={() => setConfirmId(null)}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmId(story.id)}
                className="px-3 py-1.5 text-xs text-red-500 hover:text-red-400 border border-red-500/20 hover:border-red-500/40 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function getCookie(name: string): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : ''
}