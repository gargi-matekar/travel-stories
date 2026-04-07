'use client'

import { useEffect, useRef, useState } from 'react'

export interface TripCity {
  id: string
  city: string
  state?: string | null
  country?: string | null
  slug: string
  latitude: number
  longitude: number
  coverImage?: string | null
  title?: string | null
}

interface TripRouteMapProps {
  cities: TripCity[]
}

export default function TripRouteMap({ cities }: TripRouteMapProps) {
  const containerRef    = useRef<HTMLDivElement>(null)
  const mapRef          = useRef<any>(null)
  const animFrameRef    = useRef<number>(0)
  const initializingRef = useRef(false)

  const [activeCity, setActiveCity] = useState<TripCity | null>(null)
  const [animDone,   setAnimDone]   = useState(false)
  const [replayKey,  setReplayKey]  = useState(0)

  const sorted = [...cities]

  useEffect(() => {
    if (document.querySelector('link[data-leaflet]')) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
    link.crossOrigin = ''
    link.dataset.leaflet = '1'
    document.head.appendChild(link)
  }, [])

  useEffect(() => {
    if (sorted.length === 0) return
    if (initializingRef.current) return
    initializingRef.current = true

    setAnimDone(false)
    setActiveCity(null)

    let destroyed = false

    ;(async () => {
      const container = containerRef.current
      if (!container) { initializingRef.current = false; return }

      if (mapRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        mapRef.current.off()
        mapRef.current.remove()
        mapRef.current = null
      }
      container.innerHTML = ''

      const L = (await import('leaflet')).default
      if (destroyed) { initializingRef.current = false; return }

      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const coords: [number, number][] = sorted.map((c) => [c.latitude, c.longitude])
      const mid = coords[Math.floor(coords.length / 2)]

      const map = L.map(container, {
        center: mid,
        zoom: 6,
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: false,
      })
      mapRef.current = map

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20,
        }
      ).addTo(map)

      L.control.zoom({ position: 'bottomleft' }).addTo(map)

      // Ghost line between cities
      if (coords.length > 1) {
        L.polyline(coords, {
          color: '#ffffff', weight: 2, opacity: 0.06,
          lineCap: 'round', lineJoin: 'round',
          dashArray: '6 10',
        }).addTo(map)
      }

      // Interpolated points for smooth animation
      const STEPS_PER_SEGMENT = 80
      const allPoints: [number, number][] = [coords[0]]
      for (let i = 0; i < coords.length - 1; i++) {
        const [lat1, lng1] = coords[i]
        const [lat2, lng2] = coords[i + 1]
        for (let s = 1; s <= STEPS_PER_SEGMENT; s++) {
          const t = s / STEPS_PER_SEGMENT
          allPoints.push([lat1 + (lat2 - lat1) * t, lng1 + (lng2 - lng1) * t])
        }
      }

      const animLine = L.polyline([], {
        color: '#e8865a', weight: 2.5, opacity: 1,
        lineCap: 'round', lineJoin: 'round',
      }).addTo(map)

      const glowLine = L.polyline([], {
        color: '#e8865a', weight: 10, opacity: 0.12,
        lineCap: 'round', lineJoin: 'round',
      }).addTo(map)

      const dotIcon = L.divIcon({
        className: '',
        html: `<div class="trmap-dot-outer"><div class="trmap-dot-inner"></div></div>`,
        iconSize: [20, 20], iconAnchor: [10, 10],
      })
      const dotMarker = L.marker(coords[0], {
        icon: dotIcon, zIndexOffset: 1000, interactive: false,
      }).addTo(map)

      let drawn = 1
      const animate = () => {
        if (!mapRef.current || destroyed) return
        if (drawn < allPoints.length) {
          drawn++
          const slice = allPoints.slice(0, drawn)
          animLine.setLatLngs(slice)
          glowLine.setLatLngs(slice)
          dotMarker.setLatLng(slice[slice.length - 1])
          animFrameRef.current = requestAnimationFrame(animate)
        } else {
          dotMarker.remove()
          setAnimDone(true)
        }
      }
      animFrameRef.current = requestAnimationFrame(animate)

      // City markers — larger, labelled
      sorted.forEach((city, i) => {
        const isFirst = i === 0
        const isLast  = i === sorted.length - 1

        const icon = L.divIcon({
          className: '',
          html: `
            <div class="trmap-city-marker${isFirst ? ' trmap-city-marker--first' : isLast ? ' trmap-city-marker--last' : ''}">
              <div class="trmap-city-ring"></div>
              <span class="trmap-city-num">${i + 1}</span>
              <span class="trmap-city-label">${city.city}</span>
            </div>`,
          iconSize: [40, 40], iconAnchor: [20, 20],
        })
        L.marker([city.latitude, city.longitude], { icon, zIndexOffset: 500 })
          .addTo(map)
          .on('click', () => setActiveCity((prev) => (prev?.id === city.id ? null : city)))
      })

      if (coords.length > 1) {
        map.fitBounds(L.latLngBounds(coords), {
          padding: [80, 80], maxZoom: 10, animate: true,
        })
      }

      initializingRef.current = false
    })()

    return () => {
      destroyed = true
      initializingRef.current = false
      cancelAnimationFrame(animFrameRef.current)
      if (mapRef.current) {
        mapRef.current.off()
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [replayKey]) // eslint-disable-line react-hooks/exhaustive-deps

  if (sorted.length === 0) return null

  return (
    <div className="trmap-wrapper">
      <div ref={containerRef} className="trmap-canvas" />

      {/* City list sidebar */}
      <div className="trmap-sidebar">
        <p className="trmap-sidebar-eyebrow">Route</p>
        <ul className="trmap-city-list">
          {sorted.map((city, i) => (
            <li
              key={city.id}
              className={`trmap-city-item${activeCity?.id === city.id ? ' trmap-city-item--active' : ''}`}
              onClick={() => setActiveCity((prev) => (prev?.id === city.id ? null : city))}
            >
              {i > 0 && <div className="trmap-connector" />}
              <div className="trmap-city-row">
                <span className="trmap-city-dot">{i + 1}</span>
                <div>
                  <span className="trmap-city-name">{city.city}</span>
                  {city.state && (
                    <span className="trmap-city-state">{city.state}</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* City popup */}
      {activeCity && (
        <div className="trmap-popup-wrap">
          <div className="trmap-popup">
            {activeCity.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={activeCity.coverImage} alt={activeCity.city} className="trmap-popup-img" />
            )}
            <div className="trmap-popup-body">
              <p className="trmap-popup-eyebrow">
                {[activeCity.state, activeCity.country].filter(Boolean).join(' · ')}
              </p>
              <h3 className="trmap-popup-name">{activeCity.city}</h3>
              {activeCity.title && (
                <p className="trmap-popup-subtitle">{activeCity.title}</p>
              )}
              <a
                href={`/stories/${activeCity.slug}`}
                className="trmap-popup-link"
              >
                Read story →
              </a>
            </div>
            <button className="trmap-popup-close" onClick={() => setActiveCity(null)}>✕</button>
          </div>
        </div>
      )}

      {animDone && (
        <button className="trmap-replay" onClick={() => setReplayKey((k) => k + 1)}>
          ↺ Replay route
        </button>
      )}

      <style jsx global>{`
        .trmap-wrapper {
          position: relative;
          height: 540px;
          width: 100%;
          border-radius: 4px;
          overflow: hidden;
          background: #0c1118;
        }
        .trmap-canvas {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .leaflet-control-attribution {
          background: rgba(12, 17, 24, 0.75) !important;
          color: rgba(255, 255, 255, 0.3) !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a { color: rgba(255, 255, 255, 0.45) !important; }
        .leaflet-control-zoom a {
          background: rgba(12, 17, 24, 0.88) !important;
          color: rgba(255, 255, 255, 0.6) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(232, 134, 90, 0.2) !important;
          color: #e8865a !important;
        }
        /* Animated dot */
        .trmap-dot-outer {
          width: 20px; height: 20px; border-radius: 50%;
          background: rgba(232, 134, 90, 0.28);
          display: flex; align-items: center; justify-content: center;
          animation: trmap-dot-pulse 1.2s ease-in-out infinite;
        }
        .trmap-dot-inner {
          width: 8px; height: 8px; border-radius: 50%;
          background: #e8865a; border: 2px solid #fff;
          box-shadow: 0 0 10px rgba(232, 134, 90, 0.9);
        }
        @keyframes trmap-dot-pulse {
          0%, 100% { transform: scale(1);    opacity: 0.85; }
          50%       { transform: scale(1.55); opacity: 0.4; }
        }
        /* City markers */
        .trmap-city-marker {
          position: relative; width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }
        .trmap-city-ring {
          position: absolute; inset: 0; border-radius: 50%;
          background: rgba(232, 134, 90, 0.18);
          animation: trmap-ring-pulse 3s ease-in-out infinite;
        }
        .trmap-city-marker--first .trmap-city-ring,
        .trmap-city-marker--last  .trmap-city-ring {
          background: rgba(232, 134, 90, 0.30);
        }
        .trmap-city-marker:hover .trmap-city-ring {
          background: rgba(232, 134, 90, 0.45); animation: none;
        }
        .trmap-city-num {
          position: relative; z-index: 1;
          width: 26px; height: 26px; border-radius: 50%;
          background: #e8865a; border: 2.5px solid rgba(255,255,255,0.9);
          color: #0c1118; font-size: 0.6rem; font-weight: 900;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 16px rgba(232,134,90,0.6);
          transition: transform 0.2s;
        }
        .trmap-city-marker:hover .trmap-city-num { transform: scale(1.15); }
        /* City label below marker */
        .trmap-city-label {
          position: absolute;
          top: 100%; left: 50%; transform: translateX(-50%);
          margin-top: 4px;
          font-size: 0.6rem; font-weight: 700;
          color: rgba(255,255,255,0.75);
          white-space: nowrap;
          text-shadow: 0 1px 4px rgba(0,0,0,0.9);
          pointer-events: none;
          letter-spacing: 0.06em;
        }
        @keyframes trmap-ring-pulse {
          0%, 100% { transform: scale(1);   opacity: 0.35; }
          50%       { transform: scale(1.8); opacity: 0.08; }
        }
        /* Sidebar */
        .trmap-sidebar {
          position: absolute; top: 16px; right: 16px; z-index: 10;
          width: 190px; background: rgba(12, 17, 24, 0.92);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; padding: 14px;
          max-height: 500px; overflow-y: auto;
        }
        .trmap-sidebar-eyebrow {
          font-size: 0.58rem; letter-spacing: 0.24em;
          text-transform: uppercase; color: #e8865a;
          margin: 0 0 12px; font-weight: 700;
        }
        .trmap-city-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column;
        }
        .trmap-connector {
          width: 1px; height: 12px; background: rgba(232,134,90,0.25);
          margin-left: 9px; margin-bottom: 2px;
        }
        .trmap-city-row {
          display: flex; align-items: center; gap: 8px;
        }
        .trmap-city-item {
          cursor: pointer; padding: 5px 7px;
          border-radius: 6px; transition: background 0.15s;
        }
        .trmap-city-item:hover    { background: rgba(255,255,255,0.05); }
        .trmap-city-item--active  { background: rgba(232,134,90,0.13); }
        .trmap-city-dot {
          width: 18px; height: 18px; border-radius: 50%;
          background: #e8865a; color: #0c1118;
          font-size: 0.55rem; font-weight: 900;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .trmap-city-name {
          font-size: 0.78rem; color: rgba(255,255,255,0.75);
          font-weight: 500; display: block; line-height: 1.3;
        }
        .trmap-city-state {
          font-size: 0.62rem; color: rgba(255,255,255,0.35);
          display: block; margin-top: 1px;
        }
        /* Popup */
        .trmap-popup-wrap {
          position: absolute; bottom: 20px; left: 16px;
          z-index: 20; pointer-events: none;
        }
        .trmap-popup {
          position: relative; width: 270px;
          background: rgba(12,17,24,0.97);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px; overflow: hidden;
          pointer-events: all;
          animation: trmap-popup-in 0.22s ease;
        }
        @keyframes trmap-popup-in {
          from { transform: translateY(10px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .trmap-popup-img { width: 100%; height: 120px; object-fit: cover; display: block; }
        .trmap-popup-body { padding: 13px 15px 15px; }
        .trmap-popup-eyebrow {
          font-size: 0.58rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: #e8865a;
          margin: 0 0 4px; font-weight: 700;
        }
        .trmap-popup-name {
          font-size: 1.1rem; font-weight: 500; color: #fff;
          margin: 0 0 4px; font-family: Georgia, serif;
        }
        .trmap-popup-subtitle {
          font-size: 0.78rem; color: rgba(255,255,255,0.45);
          margin: 0 0 10px; line-height: 1.5;
          font-style: italic;
        }
        .trmap-popup-link {
          font-size: 0.72rem; color: #e8865a;
          font-weight: 600; letter-spacing: 0.05em;
          text-decoration: none; transition: opacity 0.15s;
        }
        .trmap-popup-link:hover { opacity: 0.75; }
        .trmap-popup-close {
          position: absolute; top: 8px; right: 8px;
          width: 22px; height: 22px; border-radius: 50%;
          background: rgba(0,0,0,0.55); border: none;
          color: rgba(255,255,255,0.6); font-size: 0.58rem;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.15s;
        }
        .trmap-popup-close:hover { background: rgba(232,134,90,0.55); color: #fff; }
        /* Replay */
        .trmap-replay {
          position: absolute; bottom: 20px; right: 16px; z-index: 20;
          background: rgba(12,17,24,0.9); backdrop-filter: blur(10px);
          border: 1px solid rgba(232,134,90,0.35); color: #e8865a;
          font-size: 0.7rem; font-weight: 600; letter-spacing: 0.07em;
          padding: 7px 16px; border-radius: 20px;
          cursor: pointer; transition: background 0.15s, border-color 0.15s;
        }
        .trmap-replay:hover { background: rgba(232,134,90,0.15); border-color: #e8865a; }
      `}</style>
    </div>
  )
}