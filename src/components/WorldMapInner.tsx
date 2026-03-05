// src/components/WorldMapInner.tsx
'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Link from 'next/link'

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

const markerIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 16px; height: 16px;
    background: #c9b99a;
    border: 2px solid #0f0f0f;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 2px 8px rgba(0,0,0,0.6);
    cursor: pointer;
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 16],
})

function MapResizer() {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100)
  }, [map])
  return null
}

export default function WorldMapInner({ stories }: { stories: StoryPin[] }) {
  return (
    <MapContainer
      center={[25, 15]}
      zoom={2}
      style={{ height: '100%', width: '100%', background: '#1a1a1a' }}
      zoomControl={true}
      attributionControl={true}
      minZoom={1.5}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={20}
      />

      {stories.map((story) => (
        <Marker
          key={story.id}
          position={[story.latitude, story.longitude]}
          icon={markerIcon}
        >
          <Popup minWidth={220} maxWidth={240}>
            <div style={{
              background: '#1a1a1a',
              borderRadius: '8px',
              overflow: 'hidden',
              margin: '-4px -6px',
              width: '220px'
            }}>
              <img
                src={story.coverImage}
                alt={story.title}
                style={{ width: '100%', height: '120px', objectFit: 'cover' }}
              />
              <div style={{ padding: '12px' }}>
                <p style={{ color: '#9a8260', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 4px' }}>
                  {story.city}, {story.country}
                </p>
                <p style={{ color: 'white', fontSize: '14px', margin: '0 0 10px', fontFamily: 'Georgia, serif' }}>
                  {story.title}
                </p>
                <a
                  href={`/stories/${story.slug}`}
                  style={{
                    display: 'inline-block',
                    padding: '6px 14px',
                    background: 'white',
                    color: 'black',
                    textDecoration: 'none',
                    fontSize: '11px',
                    borderRadius: '2px',
                    fontWeight: '500'
                  }}
                >
                  Read Story →
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      <MapResizer />
    </MapContainer>
  )
}