'use client'

// src/components/MapExplorer.tsx
// Tabbed map page: "World" (Leaflet pins) ↔ "India" (SVG state map)

import { useState, useEffect, useRef } from 'react'
import IndiaMapClient, { type ExploreStory } from '@/components/IndiaMapClient'

interface StoryPin {
  id: string
  title: string
  city: string
  state: string | null
  country: string
  slug: string
  coverImage: string
  latitude: number
  longitude: number
}

type Tab = 'world' | 'india'

export default function MapExplorer({ stories }: { stories: StoryPin[] }) {
  const [tab, setTab] = useState<Tab>('world')
  const [WorldMap, setWorldMap] = useState<React.ComponentType<{ stories: StoryPin[] }> | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Lazy-load the Leaflet map only when world tab is active
  useEffect(() => {
    if (tab === 'world' && !WorldMap) {
      import('@/components/WorldMapInner').then((mod) => {
        setWorldMap(() => mod.default)
        setMapLoaded(true)
      })
    }
  }, [tab, WorldMap])

  // Stories with valid coordinates for world map
  const pinnedStories = stories.filter(
    (s) => s.latitude !== 0 && s.longitude !== 0
  )

  // India tab needs ExploreStory shape (no lat/lng required)
  const exploreStories: ExploreStory[] = stories.map(({ id, title, city, state, country, slug, coverImage }) => ({
    id, title, city, state, country, slug, coverImage,
  }))

  return (
    <div style={{ color: 'var(--text-primary)' }}>
      {/* ── HEADER ── */}
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-6">
        <p
          className="text-xs tracking-[0.4em] uppercase mb-3 font-mono"
          style={{ color: 'var(--accent)' }}
        >
          The Territory
        </p>
        <h1
          className="text-4xl md:text-5xl font-bold mb-6"
          style={{ fontFamily: 'Georgia, serif', color: 'var(--text-primary)' }}
        >
          Explore
        </h1>

        {/* ── TAB SWITCHER ── */}
        <div
          className="inline-flex rounded-sm overflow-hidden"
          style={{ border: '1px solid var(--border)' }}
        >
          {(['world', 'india'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-mono tracking-[0.18em] uppercase transition-all duration-200"
              style={{
                background: tab === t ? 'var(--accent)' : 'transparent',
                color: tab === t ? '#0a0a0f' : 'var(--text-muted)',
                borderRight: t === 'world' ? '1px solid var(--border)' : 'none',
                fontWeight: tab === t ? 700 : 400,
                cursor: 'pointer',
              }}
            >
              {t === 'world' ? (
                <>
                  <GlobeIcon active={tab === t} />
                  World
                </>
              ) : (
                <>
                  <MapPinIcon active={tab === t} />
                  India
                </>
              )}
            </button>
          ))}
        </div>

        {/* story count */}
        <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
          {tab === 'world'
            ? `${pinnedStories.length} ${pinnedStories.length === 1 ? 'story' : 'stories'} on the map`
            : `${stories.filter(s => s.country?.toLowerCase() === 'india' || !s.country).length} stories across India`}
        </p>
      </div>

      {/* ── WORLD TAB ── */}
      {tab === 'world' && (
        <div className="max-w-5xl mx-auto px-6 pb-24">
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              height: '72vh',
              border: '1px solid var(--border)',
              background: 'var(--card-bg)',
            }}
          >
            {WorldMap ? (
              <WorldMap stories={pinnedStories} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-xs font-mono tracking-widest animate-pulse"
                  style={{ color: 'var(--text-muted)' }}
                >
                  LOADING MAP...
                </span>
              </div>
            )}

            {/* story count overlay */}
            <div
              className="absolute bottom-6 left-6 z-[1000] px-4 py-3 rounded-lg pointer-events-none"
              style={{
                background: 'rgba(8,8,12,0.88)',
                border: '1px solid var(--border)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <p
                className="text-xs tracking-widest uppercase font-mono"
                style={{ color: 'var(--text-muted)' }}
              >
                Stories
              </p>
              <p
                className="text-2xl font-serif"
                style={{ color: 'var(--text-primary)' }}
              >
                {pinnedStories.length}
              </p>
            </div>
          </div>

          {pinnedStories.length === 0 && (
            <p
              className="text-center mt-8 font-serif italic"
              style={{ color: 'var(--text-muted)' }}
            >
              No stories with coordinates yet — add lat/lng to your stories to see them here.
            </p>
          )}
        </div>
      )}

      {/* ── INDIA TAB ── */}
      {tab === 'india' && (
        // IndiaMapClient renders its own header section — skip duplicate header
        <div style={{ marginTop: '-6rem' }}>
          <IndiaMapClient stories={exploreStories} />
        </div>
      )}
    </div>
  )
}

function GlobeIcon({ active }: { active: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke={active ? '#0a0a0f' : 'var(--text-muted)'}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function MapPinIcon({ active }: { active: boolean }) {
  return (
    <svg width="11" height="12" viewBox="0 0 24 24" fill="none"
      stroke={active ? '#0a0a0f' : 'var(--text-muted)'}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}