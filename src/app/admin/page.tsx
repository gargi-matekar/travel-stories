// src/app/admin/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import AdminStoryList from '@/components/admin/AdminStoryList'

export default async function AdminDashboard() {
  const stories = await prisma.story.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      city: true,
      country: true,
      slug: true,
      totalCost: true,
      createdAt: true,
      _count: {
        select: { moodEntries: true, expenses: true }
      }
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-serif font-light text-white">Stories</h1>
          <p className="text-gray-500 mt-1">{stories.length} {stories.length === 1 ? 'story' : 'stories'} in the archive</p>
        </div>
        <Link
          href="/admin/new"
          className="px-5 py-2.5 bg-white text-black text-sm font-medium hover:bg-sand-100 transition-colors"
        >
          + New Story
        </Link>
      </div>

      <AdminStoryList stories={stories} />
    </div>
  )
}
