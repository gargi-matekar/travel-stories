// src/app/page.tsx
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import StoryCard from '@/components/StoryCard'
import { prisma } from '@/lib/prisma'
import MoodChips from '@/components/MoodChips'

async function getFeaturedStory() {
  return prisma.story.findFirst({
    orderBy: { createdAt: 'desc' },
    include: { moodEntries: { take: 1 } },
  })
}

async function getLatestStories() {
  return prisma.story.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6,
    include: { moodEntries: { take: 1 } },
  })
}

const MAP_PINS = [
  { top: '28%', left: '22%', delay: '0.2s' },
  { top: '45%', left: '52%', delay: '0.5s' },
  { top: '35%', left: '68%', delay: '0.8s' },
  { top: '60%', left: '32%', delay: '1.1s' },
  { top: '22%', left: '58%', delay: '1.4s' },
]

const MOODS = [
  { label: 'Peace',      value: 'Peaceful',    color: '#22c55e' },
  { label: 'Adventure',  value: 'Adventurous',  color: '#f97316' },
  { label: 'Healing',    value: 'Reflective',   color: '#6366f1' },
  { label: 'Curiosity',  value: 'Curious',      color: '#eab308' },
  { label: 'Melancholy', value: 'Melancholic',  color: '#a855f7' },
  { label: 'Solitude',   value: 'Solitary',     color: '#6b7280' },
  { label: 'Joy',        value: 'Joyful',       color: '#ec4899' },
  { label: 'Wonder',     value: 'Fascinated',   color: '#f97316' },
]

export default async function HomePage() {
  const [featured, stories] = await Promise.all([
    getFeaturedStory(),
    getLatestStories(),
  ])

  return (
    <>
      <NavBar transparent />
      <main className="bg-theme-primary text-theme-primary">

        {/* ═══ SECTION 1: HERO ════════════════════════════════════════════════ */}
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden scanline-sweep">

          {/* Light: rotating sun rays (CSS-only via .hero-rays). Dark: starfield + scanline via globals.css */}
          <div className="hero-rays" />

          {/* Radial glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 55%, var(--glow-primary) 0%, transparent 70%)' }} />

          {/* Light mode: diagonal stamp line decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.035 }}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <line x1="-10%" y1="110%" x2="110%" y2="-10%" stroke="var(--accent)" strokeWidth="1" strokeDasharray="6 14" />
              <line x1="-10%" y1="95%"  x2="95%"  y2="-10%" stroke="var(--sand)"   strokeWidth="1" strokeDasharray="6 14" />
              <line x1="5%"   y1="110%" x2="110%" y2="5%"   stroke="var(--accent)" strokeWidth="1" strokeDasharray="6 14" />
            </svg>
          </div>

          <div className="relative z-20 text-center px-6 max-w-3xl mx-auto">
            {/* Light: "COORDINATES" stamp label | Dark: terminal-style label */}
            <p className="tracking-[0.5em] text-[10px] uppercase mb-8 font-mono animate-fade-up"
              style={{ color: 'var(--sand)', opacity: 0.65 }}>
              A cinematic travel journal
            </p>

            <h1 className="font-serif font-light leading-tight mb-6 animate-fade-up-delay-1"
              style={{ fontSize: 'clamp(2rem, 4.2vw, 3.2rem)', letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
              Travel stories that<br />
              <em className="not-italic" style={{ color: 'var(--sand)' }}>changed who I was.</em>
            </h1>

            <p className="text-base mb-12 max-w-md mx-auto leading-relaxed font-serif animate-fade-up-delay-2"
              style={{ color: 'var(--text-secondary)' }}>
              Every place asked me a question.<br />
              Every trip changed my mood.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up-delay-3">
              <Link href="/stories"
                className="accent-glow-hover px-8 py-3 text-sm tracking-[0.2em] uppercase font-medium font-mono transition-all duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
                Read Stories
              </Link>
              <Link href="/map"
                className="px-8 py-3 text-sm tracking-[0.2em] uppercase font-medium font-mono border transition-all duration-300 hover:bg-theme-muted-bg"
                style={{ borderColor: 'var(--border-strong)', color: 'var(--sand)' }}>
                Explore Map
              </Link>
            </div>
          </div>

          {/* Coordinate display — bottom corners */}
          <div className="absolute bottom-8 left-8 font-mono text-[9px] tracking-wider opacity-25"
            style={{ color: 'var(--text-muted)' }}>
            28.6139°N · 77.2090°E
          </div>
          <div className="absolute bottom-8 right-8 font-mono text-[9px] tracking-wider opacity-25"
            style={{ color: 'var(--text-muted)' }}>
            ALT 216M · LOG_001
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2" style={{ opacity: 0.3 }}>
            <span className="text-[9px] tracking-[0.4em] uppercase font-mono" style={{ color: 'var(--text-muted)' }}>Scroll</span>
            <div className="w-px h-10 animate-pulse"
              style={{ background: 'linear-gradient(to bottom, var(--text-muted), transparent)' }} />
          </div>
        </section>

        {/* ═══ SECTION 2: HOW THIS BLOG WORKS ════════════════════════════════ */}
        <section className="py-24 px-6 border-t border-theme section-scanline">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="tracking-[0.5em] text-[9px] uppercase text-theme-muted mb-3 font-mono">The format</p>
              <h2 className="font-serif text-3xl md:text-4xl font-light" style={{ color: 'var(--text-primary)' }}>
                How these stories are told
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: 'var(--border)' }}>
              {[
                {
                  icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                  </svg>),
                  number: '01', title: 'Song of the City',
                  desc: 'Every story has a song that captures how the place felt — not the sights, but the feeling.',
                },
                {
                  icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <circle cx="12" cy="5" r="1.5" fill="currentColor" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /><circle cx="12" cy="19" r="1.5" fill="currentColor" />
                    <line x1="12" y1="6.5" x2="12" y2="10.5" /><line x1="12" y1="13.5" x2="12" y2="17.5" />
                    <line x1="12" y1="5" x2="18" y2="5" /><line x1="12" y1="12" x2="18" y2="12" /><line x1="12" y1="19" x2="18" y2="19" />
                  </svg>),
                  number: '02', title: 'Mood Timeline',
                  desc: 'See how my emotions shifted day by day — from arrival anxiety to quiet belonging.',
                },
                {
                  icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>),
                  number: '03', title: 'A Question the Place Asked',
                  desc: "Every destination left one question behind — one I'm still trying to answer.",
                },
              ].map((card) => (
                <div key={card.number}
                  className="group bg-theme-primary p-8 hover:bg-theme-muted-bg transition-all duration-500 cursor-default"
                >
                  <div className="mb-6 transition-colors duration-300 group-hover:text-theme-accent"
                    style={{ color: 'var(--text-muted)' }}>
                    <div className="group-hover:scale-110 transition-transform duration-300 inline-block">
                      {card.icon}
                    </div>
                  </div>
                  <div className="text-[9px] tracking-[0.5em] uppercase mb-3 font-mono" style={{ color: 'var(--accent)', opacity: 0.6 }}>
                    {card.number}
                  </div>
                  <h3 className="font-serif text-lg mb-3 font-light" style={{ color: 'var(--text-primary)' }}>{card.title}</h3>
                  <p className="text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SECTION 3: FEATURED STORY ══════════════════════════════════════ */}
        {featured && (
          <section className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-10 h-px" style={{ backgroundColor: 'var(--border-strong)' }} />
                <p className="tracking-[0.4em] text-[10px] uppercase text-theme-muted">Latest story</p>
              </div>
              <Link href={`/stories/${featured.slug}`} className="group block relative overflow-hidden">
                <div className="relative h-[58vh] overflow-hidden rounded-sm">
                  {featured.coverImage ? (
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url(${featured.coverImage})` }} />
                  ) : (
                    <div className="absolute inset-0" style={{ backgroundColor: 'var(--bg-muted)' }} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-10 md:p-14 max-w-2xl">
                    <p className="tracking-[0.4em] text-[10px] uppercase mb-4" style={{ color: 'var(--sand-light)' }}>
                      {featured.city}, {featured.country}
                    </p>
                    <h2 className="font-serif font-light text-white mb-4 leading-tight"
                      style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
                      {featured.title}
                    </h2>
                    {featured.songName && (
                      <p className="text-sm italic mb-8 flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        <span style={{ opacity: 0.5 }}>♪</span> {featured.songName}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase font-medium transition-all duration-300 group-hover:gap-5"
                      style={{ color: 'var(--sand-light)' }}>
                      Read Story <span className="text-xs">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* ═══ SECTION 4: STORIES GRID ════════════════════════════════════════ */}
        {stories.length > 0 && (
          <section className="py-20 px-6 border-t border-theme">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
                <div>
                  <p className="tracking-[0.4em] text-[10px] uppercase text-theme-muted mb-3">Stories</p>
                  <h2 className="font-serif text-3xl md:text-4xl font-light" style={{ color: 'var(--text-primary)' }}>
                    Places I've been
                  </h2>
                </div>
                <Link href="/stories" className="text-sm tracking-[0.2em] uppercase self-start md:self-auto transition-opacity hover:opacity-70"
                  style={{ color: 'var(--sand)' }}>
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <StoryCard key={story.id} story={{
                    slug: story.slug, title: story.title, city: story.city, country: story.country,
                    coverImage: story.coverImage || '', totalCost: story.totalCost || 0,
                    songName: story.songName || '', moodEntries: story.moodEntries,
                  }} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══ SECTION 5: EXPLORE BY MOOD ════════════════════════════════════ */}
        <section className="py-20 px-6 border-t border-theme">
          <div className="max-w-4xl mx-auto text-center">
            <p className="tracking-[0.4em] text-[10px] uppercase text-theme-muted mb-3">Filter by feeling</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light mb-4" style={{ color: 'var(--text-primary)' }}>
              How did the journey feel?
            </h2>
            <p className="text-sm mb-12 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Every story is tagged with the emotion that defined it.
            </p>
            <MoodChips />
          </div>
        </section>

        {/* ═══ SECTION 6: MAP PREVIEW ═════════════════════════════════════════ */}
        <section className="py-20 px-6 border-t border-theme">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
              <div>
                <p className="tracking-[0.4em] text-[10px] uppercase text-theme-muted mb-3">Geography</p>
                <h2 className="font-serif text-3xl md:text-4xl font-light mb-5 leading-tight" style={{ color: 'var(--text-primary)' }}>
                  Travel through<br />
                  <em className="not-italic" style={{ color: 'var(--sand)' }}>places I've been</em>
                </h2>
                <p className="text-sm leading-8 mb-8" style={{ color: 'var(--text-secondary)' }}>
                  Every story is pinned to the place it happened. Explore the map to find stories
                  by location — or let geography surprise you.
                </p>
                <Link href="/map" className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase font-medium transition-all hover:gap-5"
                  style={{ color: 'var(--sand)' }}>
                  Explore Full Map →
                </Link>
              </div>

              {/* Map preview */}
              <Link href="/map" className="group block">
                <div className="relative h-72 overflow-hidden rounded-sm border border-theme"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}>

                  {/* Grid overlay */}
                  <div className="map-preview-grid absolute inset-0" />

                  {/* Latitude / longitude faint lines */}
                  <div className="absolute inset-0">
                    {[25, 50, 75].map((p) => (
                      <div key={p} className="absolute left-0 right-0 h-px"
                        style={{ top: `${p}%`, backgroundColor: 'var(--sand)', opacity: 0.15 }} />
                    ))}
                    {[20, 40, 60, 80].map((p) => (
                      <div key={p} className="absolute top-0 bottom-0 w-px"
                        style={{ left: `${p}%`, backgroundColor: 'var(--sand)', opacity: 0.15 }} />
                    ))}
                  </div> 

                  {/* Animated story pins */}
                  {MAP_PINS.map((pin, i) => (
                    <div key={i} className="absolute animate-pin-drop"
                      style={{ top: pin.top, left: pin.left, animationDelay: pin.delay, animationFillMode: 'both' }}>
                      <div className="relative">
                        <div className="w-3 h-3 rounded-full border-2"
                          style={{
                            backgroundColor: 'var(--sand)',
                            borderColor: 'var(--bg-primary)',
                            boxShadow: `0 0 0 2px var(--sand), 0 0 12px var(--sand)`,
                          }}
                        />
                        <div className="absolute inset-0 rounded-full animate-ping"
                          style={{ backgroundColor: 'var(--sand)', opacity: 0.2, animationDuration: `${2 + i * 0.5}s` }}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <span className="px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-medium"
                      style={{ backgroundColor: 'var(--sand)', color: 'var(--bg-primary)' }}>
                      Open Map
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-3 text-[8px] tracking-widest uppercase"
                    style={{ color: 'var(--text-muted)', opacity: 0.3 }}>
                    World
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ SECTION 7: AUTHOR ══════════════════════════════════════════════ */}
        <section className="py-24 px-6 border-t border-theme">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-14 md:gap-20 items-start">
              <div className="flex flex-col items-start gap-5">
                <div className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center border border-theme"
                  style={{ backgroundColor: 'var(--bg-muted)' }}>
                  <span className="font-serif text-2xl font-light" style={{ color: 'var(--sand)' }}>G</span>
                </div>
                <div>
                  <p className="font-serif text-base" style={{ color: 'var(--text-primary)' }}>Gargi</p>
                  <p className="text-xs tracking-widest uppercase mt-1" style={{ color: 'var(--text-muted)' }}>Solo Traveler</p>
                </div>
              </div>
              <div>
                <p className="tracking-[0.4em] text-[10px] uppercase text-theme-muted mb-5">
                  The traveler behind these miles
                </p>
                <div className="space-y-4 font-serif leading-8 text-base font-light" style={{ color: 'var(--text-secondary)' }}>
                  <p>I started traveling alone because I needed silence more than excitement.</p>
                  <p>Somewhere between train stations, temples, and quiet beaches, I realized places don't just give memories — they ask questions.</p>
                  <p className="italic" style={{ color: 'var(--sand)' }}>This website is where I record those questions.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ SECTION 8: REFLECTION QUOTE ═══════════════════════════════════ */}
        <section className="py-28 px-6 border-t border-theme relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[500px] h-[200px] rounded-full blur-[80px]"
              style={{ backgroundColor: 'var(--sand)', opacity: 0.06 }} />
          </div>
          <div className="max-w-3xl mx-auto text-center relative">
            <div className="font-serif font-light leading-snug mb-6"
              style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)', letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
              "Some places don't give answers.<br />
              <em className="not-italic" style={{ color: 'var(--sand)' }}>
                They just ask better questions."
              </em>
            </div>
            <div className="w-10 h-px mx-auto" style={{ backgroundColor: 'var(--border-strong)' }} />
          </div>
        </section>

        {/* ═══ SECTION 9: FOOTER ══════════════════════════════════════════════ */}
        <footer className="border-t border-theme py-14 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
              <div>
                <p className="font-serif text-xl font-light mb-2" style={{ color: 'var(--text-primary)' }}>
                  Travel <span style={{ color: 'var(--sand)' }}>Stories</span>
                </p>
                <p className="text-xs leading-6 max-w-xs" style={{ color: 'var(--text-muted)' }}>
                  Emotional travel storytelling.<br />Real places. Real questions. Real feelings.
                </p>
              </div>
              <div className="flex gap-14">
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase mb-5" style={{ color: 'var(--text-muted)' }}>Navigate</p>
                  <nav className="flex flex-col gap-3">
                    {[{label:'Home',href:'/'},{label:'Stories',href:'/stories'},{label:'Map',href:'/map'},{label:'About',href:'/about'}].map((l) => (
                      <Link key={l.href} href={l.href} className="text-sm transition-opacity hover:opacity-80"
                        style={{ color: 'var(--text-secondary)' }}>{l.label}</Link>
                    ))}
                  </nav>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase mb-5" style={{ color: 'var(--text-muted)' }}>Connect</p>
                  <nav className="flex flex-col gap-3">
                    {['Instagram','Twitter','Substack'].map((s) => (
                      <span key={s} className="text-sm cursor-default" style={{ color: 'var(--text-muted)' }}>{s}</span>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-theme flex flex-col md:flex-row justify-between items-center gap-3">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                © {new Date().getFullYear()} Travel Stories. All rights reserved.
              </p>
              <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)', opacity: 0.4 }}>
                Made with quiet curiosity
              </p>
            </div>
          </div>
        </footer>

      </main>
    </>
  )
}