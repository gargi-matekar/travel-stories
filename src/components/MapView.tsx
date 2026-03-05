// src/components/MapView.tsx
'use client'

import { useEffect, useState } from 'react'

interface MapViewProps {
  latitude: number
  longitude: number
  city: string
}

// Dynamically import to avoid SSR issues with Leaflet
export default function MapView({ latitude, longitude, city }: MapViewProps) {
  const [MapComponents, setMapComponents] = useState<React.ComponentType<MapViewProps> | null>(null)

  useEffect(() => {
    import('./MapViewInner').then((mod) => {
      setMapComponents(() => mod.default)
    })
  }, [])

  if (!MapComponents) {
    return (
      <div className="h-[400px] w-full bg-ink-800 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <p className="text-2xl mb-2">🗺️</p>
          <p className="text-sm">{city}</p>
        </div>
      </div>
    )
  }

  return <MapComponents latitude={latitude} longitude={longitude} city={city} />
}