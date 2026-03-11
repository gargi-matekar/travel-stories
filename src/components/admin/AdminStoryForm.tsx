// // src/components/admin/AdminStoryForm.tsx
// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'

// // ─── Types ───────────────────────────────────────────────────────────────────

// interface MoodRow {
//   day: string
//   mood: string
//   note: string
// }

// interface ExpenseRow {
//   title: string
//   description: string
//   amount: string
//   currency: 'INR' | 'USD'
// }

// interface ExistingStory {
//   id: string
//   title: string
//   slug: string
//   city: string
//   country: string
//   coverImage: string
//   content: string
//   questionAsked: string
//   songName: string
//   songEmbedUrl: string
//   latitude: number
//   longitude: number
//   totalCost: number
//   expenses: { title: string; amount: number }[]
// }

// // ─── Constants ────────────────────────────────────────────────────────────────

// const MOOD_OPTIONS = [
//   'Disoriented', 'Curious', 'Melancholic', 'Reflective', 'Peaceful',
//   'Overwhelmed', 'Fascinated', 'Solitary', 'Joyful', 'Reluctant',
//   'Anxious', 'Nostalgic', 'Excited', 'Grateful', 'Lonely',
//   'Free', 'Lost', 'Found', 'Inspired', 'Exhausted',
// ]

// const USD_TO_INR = 83.5

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function AdminStoryForm({ story }: { story?: ExistingStory }) {
//   const router = useRouter()
//   const isEdit = !!story

//   const [form, setForm] = useState({
//     title: story?.title || '',
//     slug: story?.slug || '',
//     city: story?.city || '',
//     country: story?.country || '',
//     coverImage: story?.coverImage || '',
//     content: story?.content || '',
//     questionAsked: story?.questionAsked || '',
//     songName: story?.songName || '',
//     songEmbedUrl: story?.songEmbedUrl || '',
//     latitude: String(story?.latitude || ''),
//     longitude: String(story?.longitude || ''),
//     totalCost: String(story?.totalCost || ''),
//   })

//   const [expenses, setExpenses] = useState<ExpenseRow[]>(
//     story?.expenses.map((e) => ({
//       title: e.title,
//       description: '',
//       amount: String(e.amount),
//       currency: 'INR' as 'INR' | 'USD',
//     })) || [{ title: '', description: '', amount: '', currency: 'INR' }]
//   )

//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [geocoding, setGeocoding] = useState(false)
//   const [geocodeStatus, setGeocodeStatus] = useState('')

//   // ── Handlers ─────────────────────────────────────────────────────────────

//   function handleChange(
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) {
//     const { name, value } = e.target
//     setForm((prev) => ({ ...prev, [name]: value }))
//     if (name === 'title' && !isEdit) {
//       const slug = value
//         .toLowerCase()
//         .replace(/[^a-z0-9\s-]/g, '')
//         .replace(/\s+/g, '-')
//         .replace(/-+/g, '-')
//         .trim()
//       setForm((prev) => ({ ...prev, title: value, slug }))
//     }
//   }

//   // City name → lat/lng via Nominatim (free, no API key)
//   async function handleGeocode() {
//     const query = [form.city, form.country].filter(Boolean).join(', ')
//     if (!query.trim()) {
//       setGeocodeStatus('Enter a city name first.')
//       return
//     }
//     setGeocoding(true)
//     setGeocodeStatus('Searching...')
//     try {
//       const res = await fetch(
//         `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
//         { headers: { 'Accept-Language': 'en' } }
//       )
//       const data = await res.json()
//       if (data && data.length > 0) {
//         const { lat, lon, display_name } = data[0]
//         setForm((prev) => ({
//           ...prev,
//           latitude: parseFloat(lat).toFixed(6),
//           longitude: parseFloat(lon).toFixed(6),
//         }))
//         const short = display_name.split(',').slice(0, 3).join(',')
//         setGeocodeStatus(`✓ Found: ${short}`)
//       } else {
//         setGeocodeStatus('Location not found. Try a more specific name.')
//       }
//     } catch {
//       setGeocodeStatus('Failed. Check your internet connection.')
//     } finally {
//       setGeocoding(false)
//     }
//   }


//   // Expenses
//   function updateExpense(index: number, field: keyof ExpenseRow, value: string) {
//     setExpenses((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)))
//   }
//   function addExpense() {
//     setExpenses((prev) => [...prev, { title: '', description: '', amount: '', currency: 'INR' }])
//   }
//   function removeExpense(index: number) {
//     if (expenses.length === 1) return
//     setExpenses((prev) => prev.filter((_, i) => i !== index))
//   }

//   function getAmountUSD(amount: string, currency: 'INR' | 'USD'): number {
//     const n = parseFloat(amount) || 0
//     return currency === 'INR' ? n / USD_TO_INR : n
//   }
//   function getTotalUSD(): number {
//     return expenses.reduce((sum, e) => sum + getAmountUSD(e.amount, e.currency), 0)
//   }

//   // Submit
//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault()
//     setLoading(true)
//     setError('')

//     // Auth is handled server-side via httpOnly cookie
//     const totalUSD = getTotalUSD()

//     const payload = {
//       ...form,
//       latitude: parseFloat(form.latitude),
//       longitude: parseFloat(form.longitude),
//       totalCost: totalUSD,
//       expenses: expenses.map((e) => ({
//         title: e.description ? `${e.title} — ${e.description}` : e.title,
//         amount: getAmountUSD(e.amount, e.currency),
//       })),
//     }

//     try {
//       const url = isEdit ? `/api/admin/stories/${story!.id}` : '/api/admin/stories'
//       const method = isEdit ? 'PUT' : 'POST'
//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       })
//       if (!res.ok) {
//         const data = await res.json()
//         throw new Error(data.error || 'Failed to save')
//       }
//       router.push('/admin')
//       router.refresh()
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : 'Something went wrong')
//       setLoading(false)
//     }
//   }

//   // ─── Style helpers ────────────────────────────────────────────────────────
//   const input = 'w-full px-4 py-3 bg-[#111] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-sand-500 transition-colors text-sm rounded-sm'
//   const select = 'w-full px-4 py-3 bg-[#111] border border-white/10 text-white focus:outline-none focus:border-sand-500 transition-colors text-sm rounded-sm appearance-none cursor-pointer'
//   const label = 'block text-xs tracking-widest text-gray-500 uppercase mb-2'
//   const hint  = 'text-gray-700 text-xs mt-1.5 leading-relaxed'
//   const card  = 'p-4 bg-[#0d0d0d] border border-white/5 rounded-sm'
//   const sectionTitle = 'text-lg font-serif text-white mb-1 pb-3 border-b border-white/10'

//   // ─── Render ───────────────────────────────────────────────────────────────
//   return (
//     <form onSubmit={handleSubmit} className="space-y-12 max-w-4xl pb-24">

//       {/* ── Basic Info ──────────────────────────────────────────────────── */}
//       <section>
//         <h2 className={sectionTitle}>Basic Info</h2>
//         <p className="text-gray-600 text-xs mb-6">Core details shown on the story card and grid.</p>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//           <div className="md:col-span-2">
//             <label className={label}>Story Title *</label>
//             <input type="text" name="title" value={form.title} onChange={handleChange}
//               className={input} placeholder="e.g. Lost in Lisbon" required />
//           </div>

//           <div>
//             <label className={label}>URL Slug *</label>
//             <input type="text" name="slug" value={form.slug} onChange={handleChange}
//               className={input} placeholder="lost-in-lisbon" required />
//             <p className={hint}>Auto-generated from title · /stories/<span className="text-gray-500">{form.slug || '...'}</span></p>
//           </div>

//           <div>
//             <label className={label}>Cover Image URL *</label>
//             <input type="url" name="coverImage" value={form.coverImage} onChange={handleChange}
//               className={input} placeholder="https://images.unsplash.com/photo-..." required />
//             <p className={hint}>Works with Unsplash, Pexels, or any public image link</p>
//           </div>

//           <div>
//             <label className={label}>City *</label>
//             <input type="text" name="city" value={form.city} onChange={handleChange}
//               className={input} placeholder="Lisbon" required />
//           </div>

//           <div>
//             <label className={label}>Country *</label>
//             <input type="text" name="country" value={form.country} onChange={handleChange}
//               className={input} placeholder="Portugal" required />
//           </div>

//         </div>
//       </section>

//       {/* ── Location ────────────────────────────────────────────────────── */}
//       <section>
//         <h2 className={sectionTitle}>Map Location</h2>
//         <p className="text-gray-600 text-xs mb-5">
//           Just fill in City &amp; Country above, then click the button below — no manual lat/lng needed.
//         </p>

//         <button
//           type="button" onClick={handleGeocode} disabled={geocoding}
//           className="mb-5 flex items-center gap-2 px-5 py-2.5 bg-sand-500/10 border border-sand-500/30 text-sand-300 text-sm hover:bg-sand-500/20 transition-all disabled:opacity-50 rounded-sm"
//         >
//           {geocoding
//             ? <><Spinner /> Detecting location...</>
//             : <>📍 Auto-detect from City Name</>}
//         </button>

//         {geocodeStatus && (
//           <p className={`text-sm mb-5 ${geocodeStatus.startsWith('✓') ? 'text-green-400' : 'text-yellow-500'}`}>
//             {geocodeStatus}
//           </p>
//         )}

//         <div className="grid grid-cols-2 gap-5">
//           <div>
//             <label className={label}>Latitude *</label>
//             <input type="number" name="latitude" value={form.latitude} onChange={handleChange}
//               className={input} placeholder="38.7169" step="any" required />
//           </div>
//           <div>
//             <label className={label}>Longitude *</label>
//             <input type="number" name="longitude" value={form.longitude} onChange={handleChange}
//               className={input} placeholder="-9.1395" step="any" required />
//           </div>
//         </div>
//       </section>

//       {/* ── Emotional Core ──────────────────────────────────────────────── */}
//       <section>
//         <h2 className={sectionTitle}>Emotional Core</h2>
//         <p className="text-gray-600 text-xs mb-6">The soul of the story — what made this place different.</p>
//         <div className="space-y-5">

//           <div>
//             <label className={label}>The Question This Place Asked You *</label>
//             <input type="text" name="questionAsked" value={form.questionAsked} onChange={handleChange}
//               className={input} placeholder="e.g. Why are you always rushing?" required />
//             <p className={hint}>Displayed as a large centered quote. Make it visceral and honest.</p>
//           </div>

//           <div>
//             <label className={label}>Song Name *</label>
//             <input type="text" name="songName" value={form.songName} onChange={handleChange}
//               className={input} placeholder="e.g. Estranha Forma de Vida – Amália Rodrigues" required />
//             <p className={hint}>Shown as "This city sounds like: ..."</p>
//           </div>

//           <div>
//             <label className={label}>Song Embed URL *</label>
//             <input type="url" name="songEmbedUrl" value={form.songEmbedUrl} onChange={handleChange}
//               className={input} placeholder="https://open.spotify.com/embed/track/..." required />
//             <p className={hint}>
//               <strong className="text-gray-500">Spotify:</strong> Open track → Share → Embed → copy the <code>src</code> URL (starts with https://open.spotify.com/embed/track/…)
//               <br />
//               <strong className="text-gray-500">YouTube:</strong> https://www.youtube.com/embed/VIDEO_ID
//             </p>
//           </div>

//         </div>
//       </section>

//       {/* ── Story Content ───────────────────────────────────────────────── */}
//       <section>
//         <h2 className={sectionTitle}>Story Content (Markdown)</h2>
//         <p className="text-gray-600 text-xs mb-4">
//           Use <code className="text-gray-500">## Heading</code>, paragraphs, <code className="text-gray-500">*italic*</code> for emphasis, and <code className="text-gray-500">![alt](url)</code> for images.
//         </p>
//         <textarea
//           name="content" value={form.content} onChange={handleChange} required
//           className={`${input} min-h-[420px] resize-y font-mono text-xs leading-6`}
//           placeholder={`## Arriving at the Edge of the World\n\nWrite your story here. Be honest. Be slow.\n\n## The Moment Everything Changed\n\nKeep going.`}
//         />
//       </section>


//       {/* ── Expenses ────────────────────────────────────────────────────── */}
//       <section>
//         <h2 className={sectionTitle}>Expenses</h2>
//         <p className="text-gray-600 text-xs mb-6">
//           Break down every cost. You can mix ₹ INR and $ USD — totals are converted automatically.
//           <span className="text-gray-700 ml-1">(Rate used: 1 USD = ₹{USD_TO_INR})</span>
//         </p>

//         {/* Column headers (desktop) */}
//         <div className="hidden md:grid grid-cols-[1fr_1fr_150px_110px_32px] gap-3 mb-2 pl-1">
//           {['Item', 'Description', 'Amount', 'Currency', ''].map((h) => (
//             <span key={h} className="text-xs text-gray-700 uppercase tracking-widest">{h}</span>
//           ))}
//         </div>

//         <div className="space-y-3">
//           {expenses.map((exp, idx) => (
//             <div key={idx} className={`${card} grid grid-cols-1 md:grid-cols-[1fr_1fr_150px_110px_32px] gap-3 items-start`}>

//               {/* Title */}
//               <div>
//                 <label className="md:hidden text-xs text-gray-600 uppercase tracking-widest mb-1 block">Item</label>
//                 <input type="text" value={exp.title}
//                   onChange={(e) => updateExpense(idx, 'title', e.target.value)}
//                   className={input} placeholder="e.g. Flight" />
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="md:hidden text-xs text-gray-600 uppercase tracking-widest mb-1 block">Description</label>
//                 <input type="text" value={exp.description}
//                   onChange={(e) => updateExpense(idx, 'description', e.target.value)}
//                   className={input} placeholder="e.g. Round trip, economy" />
//               </div>

//               {/* Amount with symbol */}
//               <div>
//                 <label className="md:hidden text-xs text-gray-600 uppercase tracking-widest mb-1 block">Amount</label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none select-none">
//                     {exp.currency === 'INR' ? '₹' : '$'}
//                   </span>
//                   <input type="number" value={exp.amount} step="0.01" min="0"
//                     onChange={(e) => updateExpense(idx, 'amount', e.target.value)}
//                     className={`${input} pl-7`} placeholder="0.00" />
//                 </div>
//                 {/* Live conversion hint */}
//                 {exp.amount && parseFloat(exp.amount) > 0 && (
//                   <p className="text-gray-700 text-xs mt-1">
//                     {exp.currency === 'INR'
//                       ? `≈ $${(parseFloat(exp.amount) / USD_TO_INR).toFixed(2)} USD`
//                       : `≈ ₹${(parseFloat(exp.amount) * USD_TO_INR).toLocaleString('en-IN', { maximumFractionDigits: 0 })} INR`}
//                   </p>
//                 )}
//               </div>

//               {/* Currency selector */}
//               <div>
//                 <label className="md:hidden text-xs text-gray-600 uppercase tracking-widest mb-1 block">Currency</label>
//                 <div className="relative">
//                   <select value={exp.currency}
//                     onChange={(e) => updateExpense(idx, 'currency', e.target.value as 'INR' | 'USD')}
//                     className={select}>
//                     <option value="INR">₹ INR</option>
//                     <option value="USD">$ USD</option>
//                   </select>
//                   <ChevronDown />
//                 </div>
//               </div>

//               {/* Remove */}
//               <button type="button" onClick={() => removeExpense(idx)}
//                 className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-red-400 transition-colors text-xl leading-none mt-1"
//                 title="Remove">×</button>
//             </div>
//           ))}
//         </div>

//         <button type="button" onClick={addExpense}
//           className="mt-4 flex items-center gap-1.5 text-sm text-sand-400 hover:text-sand-300 transition-colors">
//           <span className="text-base">+</span> Add Expense
//         </button>

//         {/* Running total */}
//         {expenses.some((e) => parseFloat(e.amount) > 0) && (
//           <div className="mt-6 p-4 bg-[#0d0d0d] border border-white/5 rounded-sm flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-xs uppercase tracking-widest mb-0.5">Total Estimated Cost</p>
//               <p className="text-gray-700 text-xs">Converted to USD for storage</p>
//             </div>
//             <div className="text-right">
//               <p className="text-sand-300 font-serif text-xl">
//                 ₹{(getTotalUSD() * USD_TO_INR).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
//               </p>
//               <p className="text-gray-600 text-xs mt-0.5">${getTotalUSD().toFixed(2)} USD</p>
//             </div>
//           </div>
//         )}
//       </section>

//       {/* ── Error + Submit ──────────────────────────────────────────────── */}
//       {error && (
//         <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-sm">
//           ⚠ {error}
//         </div>
//       )}

//       <div className="flex gap-4 pt-6 border-t border-white/5">
//         <button type="submit" disabled={loading}
//           className="px-8 py-3 bg-white text-black font-medium hover:bg-sand-100 transition-colors disabled:opacity-50 flex items-center gap-2">
//           {loading && <Spinner dark />}
//           {loading ? 'Saving…' : isEdit ? 'Update Story' : 'Publish Story'}
//         </button>
//         <button type="button" onClick={() => router.push('/admin')}
//           className="px-8 py-3 border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors">
//           Cancel
//         </button>
//       </div>

//     </form>
//   )
// }

// // ─── Small UI helpers ────────────────────────────────────────────────────────

// function Spinner({ dark }: { dark?: boolean }) {
//   return (
//     <span className={`inline-block w-4 h-4 border-2 rounded-full animate-spin ${
//       dark ? 'border-black border-t-transparent' : 'border-white border-t-transparent'
//     }`} />
//   )
// }

// function ChevronDown() {
//   return (
//     <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▼</span>
//   )
// }

// function getCookie(name: string): string {
//   if (typeof document === 'undefined') return ''
//   const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
//   return match ? match[2] : ''
// }
// // Read the JS-accessible session cookie (not the httpOnly admin_token)
// function getAdminToken(): string {
//   if (typeof document === 'undefined') return ''
//   const match = document.cookie.match(/(^| )admin_session=([^;]+)/)
//   return match ? decodeURIComponent(match[2]) : ''
// }



// src/components/admin/AdminStoryForm.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExpenseRow {
  title: string
  description: string
  amount: string
  currency: 'INR' | 'USD'
}

interface JourneyStepRow {
  title: string
  description: string
  time: string
  imageUrl: string
}

interface RouteStopRow {
  name: string
  note: string
  latitude: string
  longitude: string
  imageUrl: string
}

interface RecommendationRow {
  name: string
  type: 'food' | 'place' | 'shopping'
  description: string
  latitude: string
  longitude: string
  googleMapsUrl: string
  priceRange: string
}

interface ExistingStory {
  id: string
  title: string
  slug: string
  city: string
  country: string
  coverImage: string
  content: string
  questionAsked: string
  songName: string
  songEmbedUrl: string
  latitude: number
  longitude: number
  totalCost: number
  expenses:       { title: string; amount: number }[]
  journeySteps:   { title: string; description: string; time?: string | null; imageUrl?: string | null; order: number }[]
  routeStops:     { name: string; note?: string | null; latitude: number; longitude: number; imageUrl?: string | null; order: number }[]
  recommendations:{ name: string; type: string; description: string; latitude?: number | null; longitude?: number | null; googleMapsUrl?: string | null; priceRange?: string | null }[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const USD_TO_INR = 83.5

const emptyStep  = (): JourneyStepRow    => ({ title: '', description: '', time: '', imageUrl: '' })
const emptyStop  = (): RouteStopRow      => ({ name: '', note: '', latitude: '', longitude: '', imageUrl: '' })
const emptyRec   = (): RecommendationRow => ({ name: '', type: 'food', description: '', latitude: '', longitude: '', googleMapsUrl: '', priceRange: '' })
const emptyExp   = (): ExpenseRow        => ({ title: '', description: '', amount: '', currency: 'INR' })

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminStoryForm({ story }: { story?: ExistingStory }) {
  const router  = useRouter()
  const isEdit  = !!story
  const formRef = useRef<HTMLDivElement>(null)

  // Animate sections in on mount
  useEffect(() => {
    if (!formRef.current) return
    const sections = formRef.current.querySelectorAll('.form-section')
    sections.forEach((el, i) => {
      ;(el as HTMLElement).style.opacity = '0'
      ;(el as HTMLElement).style.transform = 'translateY(24px)'
      setTimeout(() => {
        ;(el as HTMLElement).style.transition = 'opacity 0.5s ease, transform 0.5s ease'
        ;(el as HTMLElement).style.opacity = '1'
        ;(el as HTMLElement).style.transform = 'translateY(0)'
      }, 80 + i * 60)
    })
  }, [])

  const [form, setForm] = useState({
    title:        story?.title        || '',
    slug:         story?.slug         || '',
    city:         story?.city         || '',
    country:      story?.country      || '',
    coverImage:   story?.coverImage   || '',
    content:      story?.content      || '',
    questionAsked: story?.questionAsked || '',
    songName:     story?.songName     || '',
    songEmbedUrl: story?.songEmbedUrl || '',
    latitude:     String(story?.latitude  || ''),
    longitude:    String(story?.longitude || ''),
    totalCost:    String(story?.totalCost || ''),
  })

  const [expenses, setExpenses] = useState<ExpenseRow[]>(
    story?.expenses.length
      ? story.expenses.map((e) => ({ title: e.title, description: '', amount: String(e.amount), currency: 'INR' as const }))
      : [emptyExp()]
  )

  const [journeySteps, setJourneySteps] = useState<JourneyStepRow[]>(
    story?.journeySteps.length
      ? story.journeySteps.map((s) => ({
          title:       s.title,
          description: s.description,
          time:        s.time     || '',
          imageUrl:    s.imageUrl || '',
        }))
      : []
  )

  const [routeStops, setRouteStops] = useState<RouteStopRow[]>(
    story?.routeStops.length
      ? story.routeStops.map((s) => ({
          name:      s.name,
          note:      s.note      || '',
          latitude:  String(s.latitude),
          longitude: String(s.longitude),
          imageUrl:  s.imageUrl  || '',
        }))
      : []
  )

  const [recommendations, setRecommendations] = useState<RecommendationRow[]>(
    story?.recommendations.length
      ? story.recommendations.map((r) => ({
          name:          r.name,
          type:          (r.type as 'food' | 'place' | 'shopping') || 'food',
          description:   r.description,
          latitude:      r.latitude  ? String(r.latitude)  : '',
          longitude:     r.longitude ? String(r.longitude) : '',
          googleMapsUrl: r.googleMapsUrl || '',
          priceRange:    r.priceRange    || '',
        }))
      : []
  )

  const [loading,        setLoading]        = useState(false)
  const [error,          setError]          = useState('')
  const [geocoding,      setGeocoding]      = useState(false)
  const [geocodeStatus,  setGeocodeStatus]  = useState('')
  const [activeSection,  setActiveSection]  = useState<string | null>(null)

  // ── Core form handler ─────────────────────────────────────────────────────

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'title' && !isEdit) {
      setForm((prev) => ({
        ...prev,
        title: value,
        slug: value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim(),
      }))
    }
  }

  // ── Geocode ────────────────────────────────────────────────────────────────

  async function handleGeocode() {
    const query = [form.city, form.country].filter(Boolean).join(', ')
    if (!query.trim()) { setGeocodeStatus('Enter a city name first.'); return }
    setGeocoding(true); setGeocodeStatus('Searching...')
    try {
      const res  = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`, { headers: { 'Accept-Language': 'en' } })
      const data = await res.json()
      if (data?.length > 0) {
        const { lat, lon, display_name } = data[0]
        setForm((prev) => ({ ...prev, latitude: parseFloat(lat).toFixed(6), longitude: parseFloat(lon).toFixed(6) }))
        setGeocodeStatus(`✓ Found: ${display_name.split(',').slice(0, 3).join(',')}`)
      } else {
        setGeocodeStatus('Location not found.')
      }
    } catch { setGeocodeStatus('Failed. Check your connection.') }
    finally  { setGeocoding(false) }
  }

  // ── Expense helpers ────────────────────────────────────────────────────────

  const updateExpense  = (i: number, f: keyof ExpenseRow, v: string) => setExpenses((p) => p.map((e, idx) => idx === i ? { ...e, [f]: v } : e))
  const addExpense     = () => setExpenses((p) => [...p, emptyExp()])
  const removeExpense  = (i: number) => expenses.length > 1 && setExpenses((p) => p.filter((_, idx) => idx !== i))
  const getUSD         = (amount: string, currency: 'INR' | 'USD') => (parseFloat(amount) || 0) / (currency === 'INR' ? USD_TO_INR : 1)
  const getTotalUSD    = () => expenses.reduce((s, e) => s + getUSD(e.amount, e.currency), 0)

  // ── Journey step helpers ───────────────────────────────────────────────────

  const addStep      = () => setJourneySteps((p) => [...p, emptyStep()])
  const removeStep   = (i: number) => setJourneySteps((p) => p.filter((_, idx) => idx !== i))
  const updateStep   = (i: number, f: keyof JourneyStepRow, v: string) => setJourneySteps((p) => p.map((s, idx) => idx === i ? { ...s, [f]: v } : s))

  // ── Route stop helpers ─────────────────────────────────────────────────────

  const addStop      = () => setRouteStops((p) => [...p, emptyStop()])
  const removeStop   = (i: number) => setRouteStops((p) => p.filter((_, idx) => idx !== i))
  const updateStop   = (i: number, f: keyof RouteStopRow, v: string) => setRouteStops((p) => p.map((s, idx) => idx === i ? { ...s, [f]: v } : s))

  // ── Recommendation helpers ─────────────────────────────────────────────────

  const addRec       = () => setRecommendations((p) => [...p, emptyRec()])
  const removeRec    = (i: number) => setRecommendations((p) => p.filter((_, idx) => idx !== i))
  const updateRec    = (i: number, f: keyof RecommendationRow, v: string) => setRecommendations((p) => p.map((r, idx) => idx === i ? { ...r, [f]: v } : r))

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')

    const totalUSD = getTotalUSD()

    const payload = {
      ...form,
      latitude:  parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      totalCost: totalUSD,
      expenses: expenses.map((e) => ({
        title:  e.description ? `${e.title} — ${e.description}` : e.title,
        amount: getUSD(e.amount, e.currency),
      })),
      journeySteps: journeySteps.map((s, i) => ({ ...s, order: i })),
      routeStops:   routeStops.map((s, i) => ({
        ...s,
        latitude:  parseFloat(s.latitude)  || 0,
        longitude: parseFloat(s.longitude) || 0,
        order: i,
      })),
      recommendations: recommendations.map((r) => ({
        ...r,
        latitude:  r.latitude  ? parseFloat(r.latitude)  : null,
        longitude: r.longitude ? parseFloat(r.longitude) : null,
      })),
    }

    try {
      const url    = isEdit ? `/api/admin/stories/${story!.id}` : '/api/admin/stories'
      const method = isEdit ? 'PUT' : 'POST'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save')
      }
      router.push('/admin')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  // ─── Style tokens (matching your existing dark theme) ─────────────────────
  const inp    = 'w-full px-4 py-3 bg-[#111] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-sand-500 transition-colors text-sm rounded-sm'
  const sel    = 'w-full px-4 py-3 bg-[#111] border border-white/10 text-white focus:outline-none focus:border-sand-500 transition-colors text-sm rounded-sm appearance-none cursor-pointer'
  const lbl    = 'block text-xs tracking-widest text-gray-500 uppercase mb-2'
  const hint   = 'text-gray-700 text-xs mt-1.5 leading-relaxed'
  const secHdr = 'text-lg font-serif text-white mb-1 pb-3 border-b border-white/10'

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Travel-blog ambient animations ───────────────────────────────── */}
      <style jsx global>{`
        /* Floating compass rose in background */
        @keyframes compass-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes float-up {
          0%   { opacity: 0; transform: translateY(32px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pin-drop {
          0%   { transform: scale(0) translateY(-20px); opacity: 0; }
          60%  { transform: scale(1.2) translateY(4px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes path-draw {
          from { stroke-dashoffset: 200; opacity: 0.3; }
          to   { stroke-dashoffset: 0;   opacity: 1; }
        }
        @keyframes shimmer-travel {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232,134,90,0); }
          50%       { box-shadow: 0 0 16px 4px rgba(232,134,90,0.18); }
        }
        @keyframes stamp-in {
          0%   { transform: scale(1.4) rotate(-6deg); opacity: 0; }
          70%  { transform: scale(0.95) rotate(1deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes line-grow {
          from { width: 0; opacity: 0; }
          to   { width: 2rem; opacity: 1; }
        }

        /* Dynamic item entrance */
        .dynamic-item-enter {
          animation: float-up 0.35s ease forwards;
        }
        /* Image preview fade */
        .img-preview-fade {
          animation: float-up 0.4s ease;
        }
        /* Section title accent line */
        .section-accent-line::before {
          content: '';
          display: inline-block;
          width: 2rem;
          height: 1px;
          background: #e8865a;
          vertical-align: middle;
          margin-right: 0.75rem;
          animation: line-grow 0.5s ease;
        }
        /* Active section highlight */
        .form-section-active .section-card {
          border-color: rgba(232,134,90,0.2) !important;
        }
        /* Shimmer on focused inputs */
        input:focus, textarea:focus, select:focus {
          background-image: linear-gradient(90deg, transparent 0%, rgba(232,134,90,0.03) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer-travel 2s linear infinite;
        }
        /* Drag handle hint */
        .drag-num {
          cursor: default;
          user-select: none;
          color: #e8865a;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          opacity: 0.7;
          padding: 0 4px;
        }
        /* Add button hover glow */
        .btn-add-row:hover {
          animation: pulse-glow 1.2s ease infinite;
        }
      `}</style>

      <div ref={formRef}>
        <form onSubmit={handleSubmit} className="space-y-12 max-w-4xl pb-24">

          {/* ── Basic Info ──────────────────────────────────────────────────── */}
          <section className="form-section">
            <h2 className={`${secHdr} section-accent-line`}>Basic Info</h2>
            <p className="text-gray-600 text-xs mb-6">Core details shown on the story card and grid.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={lbl}>Story Title *</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} className={inp} placeholder="e.g. Lost in Lisbon" required />
              </div>
              <div>
                <label className={lbl}>URL Slug *</label>
                <input type="text" name="slug" value={form.slug} onChange={handleChange} className={inp} placeholder="lost-in-lisbon" required />
                <p className={hint}>Auto-generated from title · /stories/<span className="text-gray-500">{form.slug || '...'}</span></p>
              </div>
              <div>
                <label className={lbl}>Cover Image URL *</label>
                <input type="url" name="coverImage" value={form.coverImage} onChange={handleChange} className={inp} placeholder="https://images.unsplash.com/photo-..." required />
                {form.coverImage && (
                  <div className="mt-2 rounded-sm overflow-hidden h-24 img-preview-fade">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.coverImage} alt="Cover preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>
              <div>
                <label className={lbl}>City *</label>
                <input type="text" name="city" value={form.city} onChange={handleChange} className={inp} placeholder="Lisbon" required />
              </div>
              <div>
                <label className={lbl}>Country *</label>
                <input type="text" name="country" value={form.country} onChange={handleChange} className={inp} placeholder="Portugal" required />
              </div>
            </div>
          </section>

          {/* ── Map Location ────────────────────────────────────────────────── */}
          <section className="form-section">
            <h2 className={`${secHdr} section-accent-line`}>Map Location</h2>
            <p className="text-gray-600 text-xs mb-5">Fill in City & Country above, then auto-detect — no manual lat/lng needed.</p>
            <button type="button" onClick={handleGeocode} disabled={geocoding}
              className="mb-5 flex items-center gap-2 px-5 py-2.5 bg-sand-500/10 border border-sand-500/30 text-sand-300 text-sm hover:bg-sand-500/20 transition-all disabled:opacity-50 rounded-sm">
              {geocoding ? <><Spinner /> Detecting...</> : <>📍 Auto-detect from City Name</>}
            </button>
            {geocodeStatus && (
              <p className={`text-sm mb-5 ${geocodeStatus.startsWith('✓') ? 'text-green-400' : 'text-yellow-500'}`}>
                {geocodeStatus}
              </p>
            )}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={lbl}>Latitude *</label>
                <input type="number" name="latitude" value={form.latitude} onChange={handleChange} className={inp} placeholder="38.7169" step="any" required />
              </div>
              <div>
                <label className={lbl}>Longitude *</label>
                <input type="number" name="longitude" value={form.longitude} onChange={handleChange} className={inp} placeholder="-9.1395" step="any" required />
              </div>
            </div>
          </section>

          {/* ── Emotional Core ──────────────────────────────────────────────── */}
          <section className="form-section">
            <h2 className={`${secHdr} section-accent-line`}>Emotional Core</h2>
            <p className="text-gray-600 text-xs mb-6">The soul of the story.</p>
            <div className="space-y-5">
              <div>
                <label className={lbl}>The Question This Place Asked You *</label>
                <input type="text" name="questionAsked" value={form.questionAsked} onChange={handleChange} className={inp} placeholder="e.g. Why are you always rushing?" required />
              </div>
              <div>
                <label className={lbl}>Song Name *</label>
                <input type="text" name="songName" value={form.songName} onChange={handleChange} className={inp} placeholder="e.g. Estranha Forma de Vida – Amália Rodrigues" required />
              </div>
              <div>
                <label className={lbl}>Song Embed URL *</label>
                <input type="url" name="songEmbedUrl" value={form.songEmbedUrl} onChange={handleChange} className={inp} placeholder="https://open.spotify.com/embed/track/..." required />
                <p className={hint}>
                  <strong className="text-gray-500">Spotify:</strong> Open track → Share → Embed → copy the src URL<br />
                  <strong className="text-gray-500">YouTube:</strong> https://www.youtube.com/embed/VIDEO_ID
                </p>
              </div>
            </div>
          </section>

          {/* ── Story Content ───────────────────────────────────────────────── */}
          <section className="form-section">
            <h2 className={`${secHdr} section-accent-line`}>Story Content (Markdown)</h2>
            <p className="text-gray-600 text-xs mb-4">Use <code className="text-gray-500">## Heading</code>, paragraphs, <code className="text-gray-500">*italic*</code>, and <code className="text-gray-500">![alt](url)</code> for images.</p>
            <textarea name="content" value={form.content} onChange={handleChange} required
              className={`${inp} min-h-[420px] resize-y font-mono text-xs leading-6`}
              placeholder={`## Arriving at the Edge of the World\n\nWrite your story here. Be honest. Be slow.`} />
          </section>

          {/* ── Journey Timeline ────────────────────────────────────────────── */}
          <section className="form-section" onClick={() => setActiveSection('journey')}>
            <div className="flex items-center justify-between mb-1">
              <h2 className={`${secHdr} section-accent-line flex-1`}>Journey Timeline</h2>
              <button type="button" onClick={(e) => { e.stopPropagation(); addStep() }}
                className="btn-add-row flex items-center gap-1.5 text-xs text-sand-400 hover:text-sand-300 border border-sand-500/20 hover:border-sand-500/40 px-3 py-1.5 rounded-sm transition-all mb-3">
                + Add Day
              </button>
            </div>
            <p className="text-gray-600 text-xs mb-6">Day-by-day chronological account of your journey. Photos make it vivid.</p>

            {journeySteps.length === 0 && (
              <div className="border border-dashed border-white/10 rounded-sm p-8 text-center">
                <p className="text-gray-600 text-sm">No days added yet.</p>
                <button type="button" onClick={addStep} className="mt-3 text-sand-400 hover:text-sand-300 text-xs transition-colors">+ Add your first day →</button>
              </div>
            )}

            <div className="space-y-4">
              {journeySteps.map((step, i) => (
                <div key={i} className="dynamic-item-enter section-card p-5 bg-[#0d0d0d] border border-white/5 rounded-sm relative group">
                  {/* Day badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#e8865a]/10 border border-[#e8865a]/30 text-[#e8865a] text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      <span className="text-xs text-gray-600 uppercase tracking-widest">Day {i + 1}</span>
                    </div>
                    <button type="button" onClick={() => removeStep(i)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-700 hover:text-red-400 text-lg leading-none px-1">×</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={lbl}>Day Title *</label>
                      <input type="text" value={step.title} onChange={(e) => updateStep(i, 'title', e.target.value)}
                        className={inp} placeholder="e.g. Arrival by Night Train" required={journeySteps.length > 0} />
                    </div>
                    <div>
                      <label className={lbl}>Time (optional)</label>
                      <input type="text" value={step.time} onChange={(e) => updateStep(i, 'time', e.target.value)}
                        className={inp} placeholder="e.g. 4:30 AM" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className={lbl}>Description *</label>
                    <textarea value={step.description} onChange={(e) => updateStep(i, 'description', e.target.value)}
                      className={`${inp} min-h-[90px] resize-y`} placeholder="What happened this day — be specific and sensory." required={journeySteps.length > 0} />
                  </div>

                  <div>
                    <label className={lbl}>Photo URL (optional)</label>
                    <input type="url" value={step.imageUrl} onChange={(e) => updateStep(i, 'imageUrl', e.target.value)}
                      className={inp} placeholder="https://images.unsplash.com/photo-..." />
                    {step.imageUrl && (
                      <div className="mt-2 rounded-sm overflow-hidden h-28 img-preview-fade">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={step.imageUrl} alt="Day photo" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      </div>
                    )}
                    <p className={hint}>Unsplash, Pexels, or any public image URL. Shows beside this day's entry.</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Route Stops ─────────────────────────────────────────────────── */}
          <section className="form-section" onClick={() => setActiveSection('route')}>
            <div className="flex items-center justify-between mb-1">
              <h2 className={`${secHdr} section-accent-line flex-1`}>Route Stops</h2>
              <button type="button" onClick={(e) => { e.stopPropagation(); addStop() }}
                className="btn-add-row flex items-center gap-1.5 text-xs text-sand-400 hover:text-sand-300 border border-sand-500/20 hover:border-sand-500/40 px-3 py-1.5 rounded-sm transition-all mb-3">
                + Add Stop
              </button>
            </div>
            <p className="text-gray-600 text-xs mb-6">Markers for the animated walking route map. Order defines the path.</p>

            {routeStops.length === 0 && (
              <div className="border border-dashed border-white/10 rounded-sm p-8 text-center">
                <p className="text-gray-600 text-sm">No stops added yet.</p>
                <button type="button" onClick={addStop} className="mt-3 text-sand-400 hover:text-sand-300 text-xs transition-colors">+ Add your first stop →</button>
              </div>
            )}

            <div className="space-y-4">
              {routeStops.map((stop, i) => (
                <div key={i} className="dynamic-item-enter section-card p-5 bg-[#0d0d0d] border border-white/5 rounded-sm relative group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#e8865a]/10 border border-[#e8865a]/30 text-[#e8865a] text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      <span className="text-xs text-gray-600 uppercase tracking-widest">Stop {i + 1}</span>
                    </div>
                    <button type="button" onClick={() => removeStop(i)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-700 hover:text-red-400 text-lg leading-none px-1">×</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={lbl}>Location Name *</label>
                      <input type="text" value={stop.name} onChange={(e) => updateStop(i, 'name', e.target.value)}
                        className={inp} placeholder="e.g. Ramanathaswamy Temple" required={routeStops.length > 0} />
                    </div>
                    <div>
                      <label className={lbl}>Short Note</label>
                      <input type="text" value={stop.note} onChange={(e) => updateStop(i, 'note', e.target.value)}
                        className={inp} placeholder="e.g. Longest corridor in India" />
                    </div>
                    <div>
                      <label className={lbl}>Latitude *</label>
                      <input type="number" value={stop.latitude} onChange={(e) => updateStop(i, 'latitude', e.target.value)}
                        className={inp} placeholder="9.2882" step="any" required={routeStops.length > 0} />
                    </div>
                    <div>
                      <label className={lbl}>Longitude *</label>
                      <input type="number" value={stop.longitude} onChange={(e) => updateStop(i, 'longitude', e.target.value)}
                        className={inp} placeholder="79.3174" step="any" required={routeStops.length > 0} />
                    </div>
                  </div>

                  <div>
                    <label className={lbl}>Photo URL (optional)</label>
                    <input type="url" value={stop.imageUrl} onChange={(e) => updateStop(i, 'imageUrl', e.target.value)}
                      className={inp} placeholder="https://images.unsplash.com/photo-..." />
                    {stop.imageUrl && (
                      <div className="mt-2 rounded-sm overflow-hidden h-24 img-preview-fade">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={stop.imageUrl} alt="Stop" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      </div>
                    )}
                    <p className={hint}>Shows in the popup when a reader clicks this marker on the map.</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Local Recommendations ───────────────────────────────────────── */}
          <section className="form-section" onClick={() => setActiveSection('recs')}>
            <div className="flex items-center justify-between mb-1">
              <h2 className={`${secHdr} section-accent-line flex-1`}>Local Recommendations</h2>
              <button type="button" onClick={(e) => { e.stopPropagation(); addRec() }}
                className="btn-add-row flex items-center gap-1.5 text-xs text-sand-400 hover:text-sand-300 border border-sand-500/20 hover:border-sand-500/40 px-3 py-1.5 rounded-sm transition-all mb-3">
                + Add Pick
              </button>
            </div>
            <p className="text-gray-600 text-xs mb-6">Curated food, places, and shopping your readers shouldn't miss.</p>

            {recommendations.length === 0 && (
              <div className="border border-dashed border-white/10 rounded-sm p-8 text-center">
                <p className="text-gray-600 text-sm">No recommendations yet.</p>
                <button type="button" onClick={addRec} className="mt-3 text-sand-400 hover:text-sand-300 text-xs transition-colors">+ Add your first pick →</button>
              </div>
            )}

            <div className="space-y-4">
              {recommendations.map((rec, i) => (
                <div key={i} className="dynamic-item-enter section-card p-5 bg-[#0d0d0d] border border-white/5 rounded-sm relative group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-base">
                        {rec.type === 'food' ? '🍜' : rec.type === 'place' ? '📍' : '🛍️'}
                      </span>
                      <span className="text-xs text-gray-600 uppercase tracking-widest">
                        {rec.type === 'food' ? 'Food & Drink' : rec.type === 'place' ? 'Place' : 'Shopping'}
                      </span>
                    </div>
                    <button type="button" onClick={() => removeRec(i)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-700 hover:text-red-400 text-lg leading-none px-1">×</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={lbl}>Name *</label>
                      <input type="text" value={rec.name} onChange={(e) => updateRec(i, 'name', e.target.value)}
                        className={inp} placeholder="e.g. Hotel Saravana Bhavan" required={recommendations.length > 0} />
                    </div>
                    <div>
                      <label className={lbl}>Category *</label>
                      <div className="relative">
                        <select value={rec.type} onChange={(e) => updateRec(i, 'type', e.target.value)} className={sel}>
                          <option value="food">🍜 Food & Drink</option>
                          <option value="place">📍 Place to Visit</option>
                          <option value="shopping">🛍️ Shopping</option>
                        </select>
                        <ChevronDown />
                      </div>
                    </div>
                    <div>
                      <label className={lbl}>Price Range (optional)</label>
                      <input type="text" value={rec.priceRange} onChange={(e) => updateRec(i, 'priceRange', e.target.value)}
                        className={inp} placeholder="e.g. ₹60–₹120" />
                    </div>
                    <div>
                      <label className={lbl}>Google Maps URL (optional)</label>
                      <input type="url" value={rec.googleMapsUrl} onChange={(e) => updateRec(i, 'googleMapsUrl', e.target.value)}
                        className={inp} placeholder="https://maps.google.com/?q=..." />
                    </div>
                    <div>
                      <label className={lbl}>Latitude (optional)</label>
                      <input type="number" value={rec.latitude} onChange={(e) => updateRec(i, 'latitude', e.target.value)}
                        className={inp} placeholder="9.2882" step="any" />
                    </div>
                    <div>
                      <label className={lbl}>Longitude (optional)</label>
                      <input type="number" value={rec.longitude} onChange={(e) => updateRec(i, 'longitude', e.target.value)}
                        className={inp} placeholder="79.3174" step="any" />
                    </div>
                  </div>

                  <div>
                    <label className={lbl}>Description *</label>
                    <textarea value={rec.description} onChange={(e) => updateRec(i, 'description', e.target.value)}
                      className={`${inp} min-h-[72px] resize-y`}
                      placeholder="Why is this worth going to? Be specific — one great sentence beats five generic ones."
                      required={recommendations.length > 0} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Expenses ────────────────────────────────────────────────────── */}
          <section className="form-section">
            <h2 className={`${secHdr} section-accent-line`}>Expenses</h2>
            <p className="text-gray-600 text-xs mb-6">
              Break down every cost. Mix ₹ INR and $ USD — totals convert automatically.
              <span className="text-gray-700 ml-1">(Rate: 1 USD = ₹{USD_TO_INR})</span>
            </p>

            <div className="hidden md:grid grid-cols-[1fr_1fr_150px_110px_32px] gap-3 mb-2 pl-1">
              {['Item', 'Description', 'Amount', 'Currency', ''].map((h) => (
                <span key={h} className="text-xs text-gray-700 uppercase tracking-widest">{h}</span>
              ))}
            </div>

            <div className="space-y-3">
              {expenses.map((exp, idx) => (
                <div key={idx} className="section-card p-4 bg-[#0d0d0d] border border-white/5 rounded-sm grid grid-cols-1 md:grid-cols-[1fr_1fr_150px_110px_32px] gap-3 items-start">
                  <div>
                    <label className="md:hidden text-xs text-gray-600 uppercase tracking-widest mb-1 block">Item</label>
                    <input type="text" value={exp.title} onChange={(e) => updateExpense(idx, 'title', e.target.value)} className={inp} placeholder="e.g. Flight" />
                  </div>
                  <div>
                    <label className="md:hidden text-xs text-gray-600 uppercase tracking-widest mb-1 block">Description</label>
                    <input type="text" value={exp.description} onChange={(e) => updateExpense(idx, 'description', e.target.value)} className={inp} placeholder="e.g. Round trip, economy" />
                  </div>
                  <div>
                    <label className="md:hidden text-xs text-gray-600 uppercase tracking-widest mb-1 block">Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">{exp.currency === 'INR' ? '₹' : '$'}</span>
                      <input type="number" value={exp.amount} step="0.01" min="0" onChange={(e) => updateExpense(idx, 'amount', e.target.value)} className={`${inp} pl-7`} placeholder="0.00" />
                    </div>
                    {exp.amount && parseFloat(exp.amount) > 0 && (
                      <p className="text-gray-700 text-xs mt-1">
                        {exp.currency === 'INR' ? `≈ $${(parseFloat(exp.amount) / USD_TO_INR).toFixed(2)} USD` : `≈ ₹${(parseFloat(exp.amount) * USD_TO_INR).toLocaleString('en-IN', { maximumFractionDigits: 0 })} INR`}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <label className="md:hidden text-xs text-gray-600 uppercase tracking-widest mb-1 block">Currency</label>
                    <select value={exp.currency} onChange={(e) => updateExpense(idx, 'currency', e.target.value as 'INR' | 'USD')} className={sel}>
                      <option value="INR">₹ INR</option>
                      <option value="USD">$ USD</option>
                    </select>
                    <ChevronDown />
                  </div>
                  <button type="button" onClick={() => removeExpense(idx)} className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-red-400 transition-colors text-xl leading-none mt-1" title="Remove">×</button>
                </div>
              ))}
            </div>

            <button type="button" onClick={addExpense} className="btn-add-row mt-4 flex items-center gap-1.5 text-sm text-sand-400 hover:text-sand-300 transition-colors">
              <span className="text-base">+</span> Add Expense
            </button>

            {expenses.some((e) => parseFloat(e.amount) > 0) && (
              <div className="mt-6 p-4 bg-[#0d0d0d] border border-white/5 rounded-sm flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-0.5">Total Estimated Cost</p>
                  <p className="text-gray-700 text-xs">Converted to USD for storage</p>
                </div>
                <div className="text-right">
                  <p className="text-sand-300 font-serif text-xl">₹{(getTotalUSD() * USD_TO_INR).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                  <p className="text-gray-600 text-xs mt-0.5">${getTotalUSD().toFixed(2)} USD</p>
                </div>
              </div>
            )}
          </section>

          {/* ── Error + Submit ──────────────────────────────────────────────── */}
          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-sm">
              ⚠ {error}
            </div>
          )}

          <div className="flex gap-4 pt-6 border-t border-white/5">
            <button type="submit" disabled={loading}
              className="px-8 py-3 bg-white text-black font-medium hover:bg-sand-100 transition-colors disabled:opacity-50 flex items-center gap-2">
              {loading && <Spinner dark />}
              {loading ? 'Saving…' : isEdit ? 'Update Story' : 'Publish Story'}
            </button>
            <button type="button" onClick={() => router.push('/admin')}
              className="px-8 py-3 border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </>
  )
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function Spinner({ dark }: { dark?: boolean }) {
  return (
    <span className={`inline-block w-4 h-4 border-2 rounded-full animate-spin ${dark ? 'border-black border-t-transparent' : 'border-white border-t-transparent'}`} />
  )
}

function ChevronDown() {
  return <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▼</span>
}