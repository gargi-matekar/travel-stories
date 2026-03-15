'use client'

// src/components/JourneyRouteMap.tsx

import { useEffect, useRef, useState } from 'react'

interface RouteStop {
  id: string
  name: string
  note?: string | null
  latitude: number
  longitude: number
  imageUrl?: string | null
  order: number
}

interface JourneyRouteMapProps {
  stops: RouteStop[]
}

export default function JourneyRouteMap({ stops }: JourneyRouteMapProps) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const mapRef        = useRef<any>(null)
  const animFrameRef  = useRef<number>(0)
  const initializingRef = useRef(false)   // ← prevents double-init in StrictMode

  const [activeStop, setActiveStop] = useState<RouteStop | null>(null)
  const [animDone,   setAnimDone]   = useState(false)
  const [replayKey,  setReplayKey]  = useState(0)

  const sorted = [...stops].sort((a, b) => a.order - b.order)

  // ── Inject Leaflet CSS once ───────────────────────────────
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

  // ── Map lifecycle ─────────────────────────────────────────
  useEffect(() => {
    if (sorted.length === 0) return

    // Prevent double-execution from React StrictMode
    if (initializingRef.current) return
    initializingRef.current = true

    setAnimDone(false)
    setActiveStop(null)

    let destroyed = false

    ;(async () => {
      const container = containerRef.current
      if (!container) { initializingRef.current = false; return }

      // Destroy any prior instance
      if (mapRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        mapRef.current.off()
        mapRef.current.remove()
        mapRef.current = null
      }

      // Clear innerHTML so Leaflet sees a truly fresh node
      container.innerHTML = ''

      const L = (await import('leaflet')).default

      // If cleanup already ran while we were awaiting, bail out
      if (destroyed) { initializingRef.current = false; return }

      // Fix broken default icon paths in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const coords: [number, number][] = sorted.map((s) => [s.latitude, s.longitude])
      const mid = coords[Math.floor(coords.length / 2)]

      const map = L.map(container, {
        center: mid,
        zoom: 13,
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

      // Ghost line
      L.polyline(coords, {
        color: '#ffffff', weight: 4, opacity: 0.05,
        lineCap: 'round', lineJoin: 'round',
      }).addTo(map)

      // Interpolated points for smooth animation
      const STEPS_PER_SEGMENT = 60
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
        color: '#e8865a', weight: 3, opacity: 1,
        lineCap: 'round', lineJoin: 'round',
      }).addTo(map)

      const glowLine = L.polyline([], {
        color: '#e8865a', weight: 12, opacity: 0.15,
        lineCap: 'round', lineJoin: 'round',
      }).addTo(map)

      const dotIcon = L.divIcon({
        className: '',
        html: `<div class="rmap-dot-outer"><div class="rmap-dot-inner"></div></div>`,
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

      // Stop markers
      sorted.forEach((stop, i) => {
        const icon = L.divIcon({
          className: '',
          html: `
            <div class="rmap-marker">
              <div class="rmap-marker-ring"></div>
              <span class="rmap-marker-num">${i + 1}</span>
            </div>`,
          iconSize: [34, 34], iconAnchor: [17, 17],
        })
        L.marker([stop.latitude, stop.longitude], { icon, zIndexOffset: 500 })
          .addTo(map)
          .on('click', () => setActiveStop((prev) => (prev?.id === stop.id ? null : stop)))
      })

      if (coords.length > 1) {
        map.fitBounds(L.latLngBounds(coords), {
          padding: [60, 60], maxZoom: 14, animate: true,
        })
      }

      initializingRef.current = false
    })()

    // Cleanup
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
    <div className="rmap-wrapper">
      <div ref={containerRef} className="rmap-canvas" />

      {/* Stops sidebar */}
      <div className="rmap-sidebar">
        <p className="rmap-sidebar-eyebrow">Stops</p>
        <ul className="rmap-stop-list">
          {sorted.map((stop, i) => (
            <li
              key={stop.id}
              className={`rmap-stop-item${activeStop?.id === stop.id ? ' rmap-stop-item--active' : ''}`}
              onClick={() => setActiveStop((prev) => (prev?.id === stop.id ? null : stop))}
            >
              <span className="rmap-stop-num">{i + 1}</span>
              <span className="rmap-stop-name">{stop.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Stop popup */}
      {activeStop && (
        <div className="rmap-popup-wrap">
          <div className="rmap-popup">
            {activeStop.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={activeStop.imageUrl} alt={activeStop.name} className="rmap-popup-img" />
            )}
            <div className="rmap-popup-body">
              <p className="rmap-popup-eyebrow">
                Stop {sorted.findIndex((s) => s.id === activeStop.id) + 1}
              </p>
              <h3 className="rmap-popup-name">{activeStop.name}</h3>
              {activeStop.note && <p className="rmap-popup-note">{activeStop.note}</p>}
            </div>
            <button className="rmap-popup-close" onClick={() => setActiveStop(null)}>✕</button>
          </div>
        </div>
      )}

      {/* Replay */}
      {animDone && (
        <button className="rmap-replay" onClick={() => setReplayKey((k) => k + 1)}>
          ↺ Replay route
        </button>
      )}

      <style jsx global>{`
        .rmap-wrapper {
          position: relative;
          height: 520px;
          width: 100%;
          border-radius: 4px;
          overflow: hidden;
          background: #0c1118;
        }
        .rmap-canvas {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .leaflet-control-attribution {
          background: rgba(12, 17, 24, 0.75) !important;
          color: rgba(255, 255, 255, 0.3) !important;
          font-size: 9px !important;
          border-radius: 4px 0 0 0 !important;
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
        .rmap-dot-outer {
          width: 20px; height: 20px; border-radius: 50%;
          background: rgba(232, 134, 90, 0.28);
          display: flex; align-items: center; justify-content: center;
          animation: rmap-dot-pulse 1.2s ease-in-out infinite;
        }
        .rmap-dot-inner {
          width: 8px; height: 8px; border-radius: 50%;
          background: #e8865a; border: 2px solid #fff;
          box-shadow: 0 0 10px rgba(232, 134, 90, 0.9);
        }
        @keyframes rmap-dot-pulse {
          0%, 100% { transform: scale(1);    opacity: 0.85; }
          50%       { transform: scale(1.55); opacity: 0.4; }
        }
        .rmap-marker {
          position: relative; width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }
        .rmap-marker-ring {
          position: absolute; inset: 0; border-radius: 50%;
          background: rgba(232, 134, 90, 0.2);
          animation: rmap-ring-pulse 2.8s ease-in-out infinite;
          transition: background 0.2s;
        }
        .rmap-marker:hover .rmap-marker-ring {
          background: rgba(232, 134, 90, 0.45); animation: none;
        }
        .rmap-marker-num {
          position: relative; z-index: 1;
          width: 22px; height: 22px; border-radius: 50%;
          background: #e8865a; border: 2.5px solid rgba(255, 255, 255, 0.9);
          color: #0c1118; font-size: 0.58rem; font-weight: 900;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 16px rgba(232, 134, 90, 0.6);
          transition: transform 0.2s;
        }
        .rmap-marker:hover .rmap-marker-num { transform: scale(1.2); }
        @keyframes rmap-ring-pulse {
          0%, 100% { transform: scale(1);   opacity: 0.35; }
          50%       { transform: scale(1.7); opacity: 0.08; }
        }
        .rmap-sidebar {
          position: absolute; top: 16px; right: 16px; z-index: 10;
          width: 180px; background: rgba(12, 17, 24, 0.9);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 10px; padding: 14px;
          max-height: 460px; overflow-y: auto;
        }
        .rmap-sidebar-eyebrow {
          font-size: 0.58rem; letter-spacing: 0.24em;
          text-transform: uppercase; color: #e8865a;
          margin: 0 0 10px; font-weight: 700;
        }
        .rmap-stop-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 4px;
        }
        .rmap-stop-item {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 8px; border-radius: 6px;
          cursor: pointer; transition: background 0.15s;
        }
        .rmap-stop-item:hover { background: rgba(255, 255, 255, 0.05); }
        .rmap-stop-item--active { background: rgba(232, 134, 90, 0.13); }
        .rmap-stop-num {
          width: 18px; height: 18px; border-radius: 50%;
          background: #e8865a; color: #0c1118;
          font-size: 0.55rem; font-weight: 900;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .rmap-stop-name { font-size: 0.73rem; color: rgba(255,255,255,0.65); line-height: 1.3; }
        .rmap-popup-wrap {
          position: absolute; bottom: 20px; left: 16px;
          z-index: 20; pointer-events: none;
        }
        .rmap-popup {
          position: relative; width: 256px;
          background: rgba(12, 17, 24, 0.97);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 12px; overflow: hidden;
          pointer-events: all;
          animation: rmap-popup-in 0.22s ease;
        }
        @keyframes rmap-popup-in {
          from { transform: translateY(10px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .rmap-popup-img { width: 100%; height: 110px; object-fit: cover; display: block; }
        .rmap-popup-body { padding: 12px 14px 14px; }
        .rmap-popup-eyebrow {
          font-size: 0.58rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: #e8865a;
          margin: 0 0 4px; font-weight: 700;
        }
        .rmap-popup-name {
          font-size: 0.95rem; font-weight: 500; color: #fff;
          margin: 0 0 5px; font-family: Georgia, serif;
        }
        .rmap-popup-note { font-size: 0.78rem; color: rgba(255,255,255,0.5); margin: 0; line-height: 1.55; }
        .rmap-popup-close {
          position: absolute; top: 8px; right: 8px;
          width: 22px; height: 22px; border-radius: 50%;
          background: rgba(0,0,0,0.55); border: none;
          color: rgba(255,255,255,0.6); font-size: 0.58rem;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.15s;
        }
        .rmap-popup-close:hover { background: rgba(232, 134, 90, 0.55); color: #fff; }
        .rmap-replay {
          position: absolute; bottom: 20px; right: 16px; z-index: 20;
          background: rgba(12, 17, 24, 0.9); backdrop-filter: blur(10px);
          border: 1px solid rgba(232, 134, 90, 0.35); color: #e8865a;
          font-size: 0.7rem; font-weight: 600; letter-spacing: 0.07em;
          padding: 7px 16px; border-radius: 20px;
          cursor: pointer; transition: background 0.15s, border-color 0.15s;
        }
        .rmap-replay:hover { background: rgba(232, 134, 90, 0.15); border-color: #e8865a; }
      `}</style>
    </div>
  )
}