// src/components/admin/AdminStoryForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// ─── Types ───────────────────────────────────────────────────────────────────

interface MoodRow {
  day: string
  mood: string
  note: string
}

interface ExpenseRow {
  title: string
  description: string
  amount: string
  currency: 'INR' | 'USD'
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
  moodEntries: { day: number; mood: string; note: string | null }[]
  expenses: { title: string; amount: number }[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MOOD_OPTIONS = [
  'Disoriented', 'Curious', 'Melancholic', 'Reflective', 'Peaceful',
  'Overwhelmed', 'Fascinated', 'Solitary', 'Joyful', 'Reluctant',
  'Anxious', 'Nostalgic', 'Excited', 'Grateful', 'Lonely',
  'Free', 'Lost', 'Found', 'Inspired', 'Exhausted',
]

const USD_TO_INR = 83.5

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminStoryForm({ story }: { story?: ExistingStory }) {
  const router = useRouter()
  const isEdit = !!story

  const [form, setForm] = useState({
    title: story?.title || '',
    slug: story?.slug || '',
    city: story?.city || '',
    country: story?.country || '',
    coverImage: story?.coverImage || '',
    content: story?.content || '',
    questionAsked: story?.questionAsked || '',
    songName: story?.songName || '',
    songEmbedUrl: story?.songEmbedUrl || '',
    latitude: String(story?.latitude || ''),
    longitude: String(story?.longitude || ''),
    totalCost: String(story?.totalCost || ''),
  })

  const [moods, setMoods] = useState<MoodRow[]>(
    story?.moodEntries.map((m) => ({
      day: String(m.day),
      mood: m.mood,
      note: m.note || '',
    })) || [{ day: '1', mood: '', note: '' }]
  )

  const [expenses, setExpenses] = useState<ExpenseRow[]>(
    story?.expenses.map((e) => ({
      title: e.title,
      description: '',
      amount: String(e.amount),
      currency: 'INR' as 'INR' | 'USD',
    })) || [{ title: '', description: '', amount: '', currency: 'INR' }]
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [geocoding, setGeocoding] = useState(false)
  const [geocodeStatus, setGeocodeStatus] = useState('')

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'title' && !isEdit) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setForm((prev) => ({ ...prev, title: value, slug }))
    }
  }

  // City name → lat/lng via Nominatim (free, no API key)
  async function handleGeocode() {
    const query = [form.city, form.country].filter(Boolean).join(', ')
    if (!query.trim()) {
      setGeocodeStatus('Enter a city name first.')
      return
    }
    setGeocoding(true)
    setGeocodeStatus('Searching...')
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0]
        setForm((prev) => ({
          ...prev,
          latitude: parseFloat(lat).toFixed(6),
          longitude: parseFloat(lon).toFixed(6),
        }))
        const short = display_name.split(',').slice(0, 3).join(',')
        setGeocodeStatus(`✓ Found: ${short}`)
      } else {
        setGeocodeStatus('Location not found. Try a more specific name.')
      }
    } catch {
      setGeocodeStatus('Failed. Check your internet connection.')
    } finally {
      setGeocoding(false)
    }
  }

  // Mood
  function updateMood(index: number, field: keyof MoodRow, value: string) {
    setMoods((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)))
  }
  function addMood() {
    setMoods((prev) => [...prev, { day: String(prev.length + 1), mood: '', note: '' }])
  }
  function removeMood(index: number) {
    if (moods.length === 1) return
    setMoods((prev) => prev.filter((_, i) => i !== index))
  }

  // Expenses
  function updateExpense(index: number, field: keyof ExpenseRow, value: string) {
    setExpenses((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)))
  }
  function addExpense() {
    setExpenses((prev) => [...prev, { title: '', description: '', amount: '', currency: 'INR' }])
  }
  function removeExpense(index: number) {
    if (expenses.length === 1) return
    setExpenses((prev) => prev.filter((_, i) => i !== index))
  }

  function getAmountUSD(amount: string, currency: 'INR' | 'USD'): number {
    const n = parseFloat(amount) || 0
    return currency === 'INR' ? n / USD_TO_INR : n
  }
  function getTotalUSD(): number {
    return expenses.reduce((sum, e) => sum + getAmountUSD(e.amount, e.currency), 0)
  }

  // Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Auth is handled server-side via httpOnly cookie
    const totalUSD = getTotalUSD()

    const payload = {
      ...form,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      totalCost: totalUSD,
      moodEntries: moods.map((m) => ({
        day: parseInt(m.day) || 1,
        mood: m.mood,
        note: m.note,
      })),
      expenses: expenses.map((e) => ({
        title: e.description ? `${e.title} — ${e.description}` : e.title,
        amount: getAmountUSD(e.amount, e.currency),
      })),
    }

    try {
      const url = isEdit ? `/api/admin/stories/${story!.id}` : '/api/admin/stories'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
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

  // ─── Style helpers ────────────────────────────────────────────────────────
  const input = 'w-full px-4 py-3 bg-[#111] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-sand-500 transition-colors text-sm rounded-sm'
  const select = 'w-full px-4 py-3 bg-[#111] border border-white/10 text-white focus:outline-none focus:border-sand-500 transition-colors text-sm rounded-sm appearance-none cursor-pointer'
  const label = 'block text-xs tracking-widest text-gray-500 uppercase mb-2'
  const hint  = 'text-gray-700 text-xs mt-1.5 leading-relaxed'
  const card  = 'p-4 bg-[#0d0d0d] border border-white/5 rounded-sm'
  const sectionTitle = 'text-lg font-serif text-white mb-1 pb-3 border-b border-white/10'

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-12 max-w-4xl pb-24">

      {/* ── Basic Info ──────────────────────────────────────────────────── */}
      <section>
        <h2 className={sectionTitle}>Basic Info</h2>
        <p className="text-gray-600 text-xs mb-6">Core details shown on the story card and grid.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div className="md:col-span-2">
            <label className={label}>Story Title *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange}
              className={input} placeholder="e.g. Lost in Lisbon" required />
          </div>

          <div>
            <label className={label}>URL Slug *</label>
            <input type="text" name="slug" value={form.slug} onChange={handleChange}
              className={input} placeholder="lost-in-lisbon" required />
            <p className={hint}>Auto-generated from title · /stories/<span className="text-gray-500">{form.slug || '...'}</span></p>
          </div>

          <div>
            <label className={label}>Cover Image URL *</label>
            <input type="url" name="coverImage" value={form.coverImage} onChange={handleChange}
              className={input} placeholder="https://images.unsplash.com/photo-..." required />
            <p className={hint}>Works with Unsplash, Pexels, or any public image link</p>
          </div>

          <div>
            <label className={label}>City *</label>
            <input type="text" name="city" value={form.city} onChange={handleChange}
              className={input} placeholder="Lisbon" required />
          </div>

          <div>
            <label className={label}>Country *</label>
            <input type="text" name="country" value={form.country} onChange={handleChange}
              className={input} placeholder="Portugal" required />
          </div>

        </div>
      </section>

      {/* ── Location ────────────────────────────────────────────────────── */}
      <section>
        <h2 className={sectionTitle}>Map Location</h2>
        <p className="text-gray-600 text-xs mb-5">
          Just fill in City &amp; Country above, then click the button below — no manual lat/lng needed.
        </p>

        <button
          type="button" onClick={handleGeocode} disabled={geocoding}
          className="mb-5 flex items-center gap-2 px-5 py-2.5 bg-sand-500/10 border border-sand-500/30 text-sand-300 text-sm hover:bg-sand-500/20 transition-all disabled:opacity-50 rounded-sm"
        >
          {geocoding
            ? <><Spinner /> Detecting location...</>
            : <>📍 Auto-detect from City Name</>}
        </button>

        {geocodeStatus && (
          <p className={`text-sm mb-5 ${geocodeStatus.startsWith('✓') ? 'text-green-400' : 'text-yellow-500'}`}>
            {geocodeStatus}
          </p>
        )}

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={label}>Latitude *</label>
            <input type="number" name="latitude" value={form.latitude} onChange={handleChange}
              className={input} placeholder="38.7169" step="any" required />
          </div>
          <div>
            <label className={label}>Longitude *</label>
            <input type="number" name="longitude" value={form.longitude} onChange={handleChange}
              className={input} placeholder="-9.1395" step="any" required />
          </div>
        </div>
      </section>

      {/* ── Emotional Core ──────────────────────────────────────────────── */}
      <section>
        <h2 className={sectionTitle}>Emotional Core</h2>
        <p className="text-gray-600 text-xs mb-6">The soul of the story — what made this place different.</p>
        <div className="space-y-5">

          <div>
            <label className={label}>The Question This Place Asked You *</label>
            <input type="text" name="questionAsked" value={form.questionAsked} onChange={handleChange}
              className={input} placeholder="e.g. Why are you always rushing?" required />
            <p className={hint}>Displayed as a large centered quote. Make it visceral and honest.</p>
          </div>

          <div>
            <label className={label}>Song Name *</label>
            <input type="text" name="songName" value={form.songName} onChange={handleChange}
              className={input} placeholder="e.g. Estranha Forma de Vida – Amália Rodrigues" required />
            <p className={hint}>Shown as "This city sounds like: ..."</p>
          </div>

          <div>
            <label className={label}>Song Embed URL *</label>
            <input type="url" name="songEmbedUrl" value={form.songEmbedUrl} onChange={handleChange}
              className={input} placeholder="https://open.spotify.com/embed/track/..." required />
            <p className={hint}>
              <strong className="text-gray-500">Spotify:</strong> Open track → Share → Embed → copy the <code>src</code> URL (starts with https://open.spotify.com/embed/track/…)
              <br />
              <strong className="text-gray-500">YouTube:</strong> https://www.youtube.com/embed/VIDEO_ID
            </p>
          </div>

        </div>
      </section>

      {/* ── Story Content ───────────────────────────────────────────────── */}
      <section>
        <h2 className={sectionTitle}>Story Content (Markdown)</h2>
        <p className="text-gray-600 text-xs mb-4">
          Use <code className="text-gray-500">## Heading</code>, paragraphs, <code className="text-gray-500">*italic*</code> for emphasis, and <code className="text-gray-500">![alt](url)</code> for images.
        </p>
        <textarea
          name="content" value={form.content} onChange={handleChange} required
          className={`${input} min-h-[420px] resize-y font-mono text-xs leading-6`}
          placeholder={`## Arriving at the Edge of the World\n\nWrite your story here. Be honest. Be slow.\n\n## The Moment Everything Changed\n\nKeep going.`}
        />
      </section>

      {/* ── Mood Timeline ───────────────────────────────────────────────── */}
      <section>
        <h2 className={sectionTitle}>Mood Timeline</h2>
        <p className="text-gray-600 text-xs mb-6">
          One entry per day. Each appears as a coloured dot on a timeline on the story page.
          The note is optional but adds depth — one honest sentence is enough.
        </p>

        {/* Column headers (desktop) */}
        <div className="hidden md:grid grid-cols-[56px_180px_1fr_32px] gap-3 mb-2 pl-1">
          {['Day', 'Mood', 'What happened / how you felt', ''].map((h) => (
            <span key={h} className="text-xs text-gray-700 uppercase tracking-widest">{h}</span>
          ))}
        </div>

        <div className="space-y-3">
          {moods.map((mood, idx) => (
            <div key={idx} className={`${card} grid grid-cols-1 md:grid-cols-[56px_180px_1fr_32px] gap-3 items-center`}>

              {/* Day number */}
              <div>
                <label className="md:hidden text-xs text-gray-600 uppercase tracking-widest mb-1 block">Day</label>
                <input type="number" value={mood.day} min="1"
                  onChange={(e) => updateMood(idx, 'day', e.target.value)}
                  className={input} placeholder="1" />
              </div>

              {/* Mood dropdown */}
              <div>
                <label className="md:hidden text-xs text-gray-600 uppercase tracking-widest mb-1 block">Mood *</label>
                <div className="relative">
                  <select value={mood.mood} onChange={(e) => updateMood(idx, 'mood', e.target.value)}
                    className={select} required>
                    <option value="" disabled>Select mood…</option>
                    {MOOD_OPTIONS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="md:hidden text-xs text-gray-600 uppercase tracking-widest mb-1 block">Note</label>
                <input type="text" value={mood.note}
                  onChange={(e) => updateMood(idx, 'note', e.target.value)}
                  className={input}
                  placeholder="e.g. Got lost for 3 hours. Found a bookshop." />
              </div>

              {/* Remove */}
              <button type="button" onClick={() => removeMood(idx)}
                className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-red-400 transition-colors text-xl leading-none"
                title="Remove">×</button>
            </div>
          ))}
        </div>

        <button type="button" onClick={addMood}
          className="mt-4 flex items-center gap-1.5 text-sm text-sand-400 hover:text-sand-300 transition-colors">
          <span className="text-base">+</span> Add Day
        </button>
      </section>

      {/* ── Expenses ────────────────────────────────────────────────────── */}
      <section>
        <h2 className={sectionTitle}>Expenses</h2>
        <p className="text-gray-600 text-xs mb-6">
          Break down every cost. You can mix ₹ INR and $ USD — totals are converted automatically.
          <span className="text-gray-700 ml-1">(Rate used: 1 USD = ₹{USD_TO_INR})</span>
        </p>

        {/* Column headers (desktop) */}
        <div className="hidden md:grid grid-cols-[1fr_1fr_150px_110px_32px] gap-3 mb-2 pl-1">
          {['Item', 'Description', 'Amount', 'Currency', ''].map((h) => (
            <span key={h} className="text-xs text-gray-700 uppercase tracking-widest">{h}</span>
          ))}
        </div>

        <div className="space-y-3">
          {expenses.map((exp, idx) => (
            <div key={idx} className={`${card} grid grid-cols-1 md:grid-cols-[1fr_1fr_150px_110px_32px] gap-3 items-start`}>

              {/* Title */}
              <div>
                <label className="md:hidden text-xs text-gray-600 uppercase tracking-widest mb-1 block">Item</label>
                <input type="text" value={exp.title}
                  onChange={(e) => updateExpense(idx, 'title', e.target.value)}
                  className={input} placeholder="e.g. Flight" />
              </div>

              {/* Description */}
              <div>
                <label className="md:hidden text-xs text-gray-600 uppercase tracking-widest mb-1 block">Description</label>
                <input type="text" value={exp.description}
                  onChange={(e) => updateExpense(idx, 'description', e.target.value)}
                  className={input} placeholder="e.g. Round trip, economy" />
              </div>

              {/* Amount with symbol */}
              <div>
                <label className="md:hidden text-xs text-gray-600 uppercase tracking-widest mb-1 block">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none select-none">
                    {exp.currency === 'INR' ? '₹' : '$'}
                  </span>
                  <input type="number" value={exp.amount} step="0.01" min="0"
                    onChange={(e) => updateExpense(idx, 'amount', e.target.value)}
                    className={`${input} pl-7`} placeholder="0.00" />
                </div>
                {/* Live conversion hint */}
                {exp.amount && parseFloat(exp.amount) > 0 && (
                  <p className="text-gray-700 text-xs mt-1">
                    {exp.currency === 'INR'
                      ? `≈ $${(parseFloat(exp.amount) / USD_TO_INR).toFixed(2)} USD`
                      : `≈ ₹${(parseFloat(exp.amount) * USD_TO_INR).toLocaleString('en-IN', { maximumFractionDigits: 0 })} INR`}
                  </p>
                )}
              </div>

              {/* Currency selector */}
              <div>
                <label className="md:hidden text-xs text-gray-600 uppercase tracking-widest mb-1 block">Currency</label>
                <div className="relative">
                  <select value={exp.currency}
                    onChange={(e) => updateExpense(idx, 'currency', e.target.value as 'INR' | 'USD')}
                    className={select}>
                    <option value="INR">₹ INR</option>
                    <option value="USD">$ USD</option>
                  </select>
                  <ChevronDown />
                </div>
              </div>

              {/* Remove */}
              <button type="button" onClick={() => removeExpense(idx)}
                className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-red-400 transition-colors text-xl leading-none mt-1"
                title="Remove">×</button>
            </div>
          ))}
        </div>

        <button type="button" onClick={addExpense}
          className="mt-4 flex items-center gap-1.5 text-sm text-sand-400 hover:text-sand-300 transition-colors">
          <span className="text-base">+</span> Add Expense
        </button>

        {/* Running total */}
        {expenses.some((e) => parseFloat(e.amount) > 0) && (
          <div className="mt-6 p-4 bg-[#0d0d0d] border border-white/5 rounded-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-0.5">Total Estimated Cost</p>
              <p className="text-gray-700 text-xs">Converted to USD for storage</p>
            </div>
            <div className="text-right">
              <p className="text-sand-300 font-serif text-xl">
                ₹{(getTotalUSD() * USD_TO_INR).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
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
  )
}

// ─── Small UI helpers ────────────────────────────────────────────────────────

function Spinner({ dark }: { dark?: boolean }) {
  return (
    <span className={`inline-block w-4 h-4 border-2 rounded-full animate-spin ${
      dark ? 'border-black border-t-transparent' : 'border-white border-t-transparent'
    }`} />
  )
}

function ChevronDown() {
  return (
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▼</span>
  )
}

function getCookie(name: string): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : ''
}
// Read the JS-accessible session cookie (not the httpOnly admin_token)
function getAdminToken(): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(/(^| )admin_session=([^;]+)/)
  return match ? decodeURIComponent(match[2]) : ''
}