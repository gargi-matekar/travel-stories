// src/components/WorldMap.tsx
'use client'

import { useEffect, useState } from 'react'

interface StoryPin {
  id: string
  title: string
  city: string
  country: string
  slug: string
  coverImage: string
  latitude: number
  longitude: number
}

export default function WorldMap({ stories }: { stories: StoryPin[] }) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{ stories: StoryPin[] }> | null>(null)

  useEffect(() => {
    import('./WorldMapInner').then((mod) => {
      setMapComponent(() => mod.default)
    })
  }, [])

  return (
    <div className="relative w-full h-full bg-ink-900">
      {MapComponent ? (
        <MapComponent stories={stories} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-600 text-sm">Loading map...</p>
        </div>
      )}

      {/* Story count overlay */}
      <div className="absolute bottom-8 left-8 z-[1000] bg-ink-900/90 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/10 pointer-events-none">
        <p className="text-gray-400 text-xs tracking-widest uppercase">Stories</p>
        <p className="text-white text-2xl font-serif">{stories.length}</p>
      </div>
    </div>
  )
}