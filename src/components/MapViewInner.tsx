// src/components/MapViewInner.tsx
'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet's default marker icon broken by webpack
const markerIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 20px; height: 20px;
    background: #c9b99a;
    border: 2px solid #0f0f0f;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 2px 8px rgba(0,0,0,0.6);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 20],
})

// Forces map to invalidate size after mount (fixes grey tile bug in some layouts)
function MapResizer() {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100)
  }, [map])
  return null
}

interface MapViewProps {
  latitude: number
  longitude: number
  city: string
}

export default function MapViewInner({ latitude, longitude, city }: MapViewProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={12}
      style={{ height: '400px', width: '100%', background: '#1a1a1a' }}
      zoomControl={true}
      attributionControl={true}
    >
      {/* Dark-themed OpenStreetMap tiles — completely free, no token */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={20}
      />
      <Marker position={[latitude, longitude]} icon={markerIcon}>
        <Popup>
          <div style={{ background: '#1a1a1a', color: 'white', padding: '4px', borderRadius: '4px' }}>
            <strong style={{ color: '#c9b99a' }}>{city}</strong>
          </div>
        </Popup>
      </Marker>
      <MapResizer />
    </MapContainer>
  )
}