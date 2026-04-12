// src/app/map/page.tsx
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import MapExplorer from '@/components/MapExplorer'
import NavBar from '@/components/NavBar'

export default async function MapPage() {
  const stories = await prisma.story.findMany({
    select: {
      id: true,
      title: true,
      city: true,
      state: true,
      country: true,
      slug: true,
      coverImage: true,
      latitude: true,
      longitude: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <NavBar />
      <main
        className="min-h-screen"
        style={{ background: 'transparent', color: 'var(--text-primary)' }}
      >
        <MapExplorer stories={stories} />
      </main>
    </>
  )
}