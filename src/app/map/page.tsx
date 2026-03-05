// src/app/map/page.tsx
import { prisma } from '@/lib/prisma'
import WorldMap from '@/components/WorldMap'
import NavBar from '@/components/NavBar'

export const revalidate = 60

export default async function MapPage() {
  const stories = await prisma.story.findMany({
    select: {
      id: true,
      title: true,
      city: true,
      country: true,
      slug: true,
      coverImage: true,
      latitude: true,
      longitude: true,
    },
  })

  return (
    <>
      <NavBar transparent />
      <main className="h-screen w-screen overflow-hidden relative">
        <WorldMap stories={stories} />
      </main>
    </>
  )
}
