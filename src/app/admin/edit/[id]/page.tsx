// src/app/admin/edit/[id]/page.tsx
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminStoryForm from '@/components/admin/AdminStoryForm'

export default async function EditStoryPage({
  params,
}: {
  params: { id: string }
}) {
  const story = await prisma.story.findUnique({
    where: { id: params.id },
    include: {
      expenses:        true,
      journeySteps:    { orderBy: { order: 'asc' } },
      routeStops:      { orderBy: { order: 'asc' } },
      recommendations: true,
      cityFrames:      { orderBy: { order: 'asc' } },   // NEW
      photoMemories:   { orderBy: { order: 'asc' } },   // NEW
    },
  })

  if (!story) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-light text-white">Edit Story</h1>
        <p className="text-gray-500 mt-1">{story.title}</p>
      </div>
      <AdminStoryForm story={story} />
    </div>
  )
}