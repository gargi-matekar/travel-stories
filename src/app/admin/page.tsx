// src/app/admin/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import AdminStoryList from '@/components/admin/AdminStoryList'
import DeleteTripButton from '@/components/admin/DeleteTripButton'

export default async function AdminDashboard() {
  const [stories, trips] = await Promise.all([
    prisma.story.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        city: true,
        country: true,
        slug: true,
        totalCost: true,
        createdAt: true,
        _count: { select: { expenses: true } },
      },
    }),
    prisma.trip.findMany({
      orderBy: { createdAt: 'desc' },
      include: { stories: { select: { city: true } } },
    }),
  ])

  return (
    <div>

      {/* ── TRIPS ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-serif font-light text-white">Trips</h1>
          <p className="text-gray-500 mt-1">
            {trips.length} {trips.length === 1 ? 'journey' : 'journeys'} in the archive
          </p>
        </div>
        <Link
          href="/admin/trips/new"
          className="px-5 py-2.5 bg-white text-black text-sm font-medium hover:bg-sand-100 transition-colors"
        >
          + New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded p-10 text-center mb-16">
          <p className="text-gray-600 text-sm">No trips yet.</p>
          <Link href="/admin/trips/new" className="mt-3 inline-block text-sand-400 hover:text-sand-300 text-xs transition-colors">
            + Create your first trip →
          </Link>
        </div>
      ) : (
        <div className="space-y-3 mb-16">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="flex items-center justify-between px-5 py-4 bg-[#0d0d0d] border border-white/5 rounded group"
            >
              <div>
                <p className="text-white text-sm font-medium">{trip.title}</p>
                <p className="text-gray-600 text-xs mt-0.5">
                  {trip.stories.length > 0
                    ? trip.stories.map((s) => s.city).join(' → ')
                    : 'No cities linked yet'}
                </p>
              </div>
              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  href={`/trips/${trip.slug}`}
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  View
                </Link>
                <Link
                  href={`/admin/trips/edit/${trip.id}`}
                  className="text-xs text-sand-400 hover:text-sand-300 transition-colors"
                >
                  Edit
                </Link>
                <DeleteTripButton tripId={trip.id} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── STORIES ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-serif font-light text-white">Stories</h1>
          <p className="text-gray-500 mt-1">
            {stories.length} {stories.length === 1 ? 'story' : 'stories'} in the archive
          </p>
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