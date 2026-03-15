'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface ExpenseRow {
  id?: string
  title: string
  description: string
  amount: string
  currency: 'INR' | 'USD'
}

interface TripFormData {
  title: string
  slug: string
  description: string
  coverImage: string
}

interface Props {
  initialData?: TripFormData & {
    id?: string
    expenses?: { id: string; title: string; amount: number }[]
  }
  mode: 'create' | 'edit'
}

const USD_TO_INR = 83.5
const emptyExp = (): ExpenseRow => ({ title: '', description: '', amount: '', currency: 'INR' })

export default function TripForm({ initialData, mode }: Props) {
  const router  = useRouter()
  const formRef = useRef<HTMLDivElement>(null)
  const isEdit  = mode === 'edit'

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

  const [form, setForm] = useState<TripFormData>({
    title:       initialData?.title       ?? '',
    slug:        initialData?.slug        ?? '',
    description: initialData?.description ?? '',
    coverImage:  initialData?.coverImage  ?? '',
  })

  const [expenses, setExpenses] = useState<ExpenseRow[]>(
    initialData?.expenses?.length
      ? initialData.expenses.map((e) => ({
          id:          e.id,
          title:       e.title,
          description: '',
          amount:      String((e.amount * USD_TO_INR).toFixed(0)), // stored as USD, display as INR
          currency:    'INR' as const,
        }))
      : [emptyExp()]
  )

  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'title' && !isEdit) {
      setForm((prev) => ({
        ...prev,
        title: value,
        slug:  value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim(),
      }))
    }
  }

  // ── Expense helpers ──────────────────────────────────────────
  const updateExpense = (i: number, f: keyof ExpenseRow, v: string) =>
    setExpenses((p) => p.map((e, idx) => idx === i ? { ...e, [f]: v } : e))
  const addExpense    = () => setExpenses((p) => [...p, emptyExp()])
  const removeExpense = (i: number) => expenses.length > 1 && setExpenses((p) => p.filter((_, idx) => idx !== i))
  const getUSD        = (amount: string, currency: 'INR' | 'USD') =>
    (parseFloat(amount) || 0) / (currency === 'INR' ? USD_TO_INR : 1)
  const getTotalUSD   = () => expenses.reduce((s, e) => s + getUSD(e.amount, e.currency), 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const totalUSD = getTotalUSD()

    const payload = {
      ...form,
      totalCost: totalUSD,
      expenses: expenses
        .filter((e) => parseFloat(e.amount) > 0)
        .map((e) => ({
          title:  e.description ? `${e.title} — ${e.description}` : e.title,
          amount: getUSD(e.amount, e.currency),
        })),
    }

    try {
      const url    = isEdit ? `/api/trips/${initialData?.id}` : '/api/trips'
      const method = isEdit ? 'PATCH' : 'POST'
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
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

  const inp    = 'w-full px-4 py-3 bg-[#111] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-sand-500 transition-colors text-sm rounded-sm'
  const lbl    = 'block text-xs tracking-widest text-gray-500 uppercase mb-2'
  const hint   = 'text-gray-700 text-xs mt-1.5 leading-relaxed'
  const secHdr = 'text-lg font-serif text-white mb-1 pb-3 border-b border-white/10'
  const sel    = 'w-full px-4 py-3 bg-[#111] border border-white/10 text-white focus:outline-none focus:border-sand-500 transition-colors text-sm rounded-sm appearance-none cursor-pointer'

  return (
    <div ref={formRef}>
      <form onSubmit={handleSubmit} className="space-y-12 max-w-4xl pb-24">

        {/* ── Basic Info ─────────────────────────────────────────── */}
        <section className="form-section">
          <h2 className="section-accent-line text-lg font-serif text-white mb-1 pb-3 border-b border-white/10">
            Basic Info
          </h2>
          <p className="text-gray-600 text-xs mb-6">The journey overview shown on the trips page.</p>

          <div className="space-y-5">
            <div>
              <label className={lbl}>Trip Title *</label>
              <input
                type="text" name="title" value={form.title}
                onChange={handleChange} className={inp}
                placeholder="e.g. Tamil Nadu Coastal Journey" required
              />
            </div>

            <div>
              <label className={lbl}>URL Slug *</label>
              <input
                type="text" name="slug" value={form.slug}
                onChange={handleChange} className={inp}
                placeholder="tamil-nadu-coastal-journey" required
              />
              <p className={hint}>/trips/<span className="text-gray-500">{form.slug || '...'}</span></p>
            </div>

            <div>
              <label className={lbl}>Description</label>
              <textarea
                name="description" value={form.description}
                onChange={handleChange} rows={3}
                className={`${inp} resize-none`}
                placeholder="A short summary of the journey — shown as the subtitle on the trip page."
              />
            </div>

            <div>
              <label className={lbl}>Cover Image URL</label>
              <input
                type="url" name="coverImage" value={form.coverImage}
                onChange={handleChange} className={inp}
                placeholder="https://images.unsplash.com/photo-..."
              />
              {form.coverImage && (
                <div className="mt-2 rounded-sm overflow-hidden h-28">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.coverImage} alt="Cover preview"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Expenses ───────────────────────────────────────────── */}
        <section className="form-section">
          <h2 className="section-accent-line text-lg font-serif text-white mb-1 pb-3 border-b border-white/10">
            Expenses
          </h2>
          <p className="text-gray-600 text-xs mb-6">
            Full trip budget. Mix ₹ INR and $ USD — totals convert automatically.
            <span className="text-gray-700 ml-1">(Rate: 1 USD = ₹{USD_TO_INR})</span>
          </p>

          {/* Column headers — desktop */}
          <div className="hidden md:grid grid-cols-[1fr_1fr_150px_110px_32px] gap-3 mb-2 pl-1">
            {['Item', 'Description', 'Amount', 'Currency', ''].map((h) => (
              <span key={h} className="text-xs text-gray-700 uppercase tracking-widest">{h}</span>
            ))}
          </div>

          <div className="space-y-3">
            {expenses.map((exp, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#0d0d0d] border border-white/5 rounded-sm grid grid-cols-1 md:grid-cols-[1fr_1fr_150px_110px_32px] gap-3 items-start"
              >
                <div>
                  <label className="md:hidden text-xs text-gray-600 uppercase tracking-widest mb-1 block">Item</label>
                  <input
                    type="text" value={exp.title}
                    onChange={(e) => updateExpense(idx, 'title', e.target.value)}
                    className={inp} placeholder="e.g. Train ticket"
                  />
                </div>
                <div>
                  <label className="md:hidden text-xs text-gray-600 uppercase tracking-widest mb-1 block">Description</label>
                  <input
                    type="text" value={exp.description}
                    onChange={(e) => updateExpense(idx, 'description', e.target.value)}
                    className={inp} placeholder="e.g. Chennai to Madurai"
                  />
                </div>
                <div>
                  <label className="md:hidden text-xs text-gray-600 uppercase tracking-widest mb-1 block">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                      {exp.currency === 'INR' ? '₹' : '$'}
                    </span>
                    <input
                      type="number" value={exp.amount} step="0.01" min="0"
                      onChange={(e) => updateExpense(idx, 'amount', e.target.value)}
                      className={`${inp} pl-7`} placeholder="0.00"
                    />
                  </div>
                  {exp.amount && parseFloat(exp.amount) > 0 && (
                    <p className="text-gray-700 text-xs mt-1">
                      {exp.currency === 'INR'
                        ? `≈ $${(parseFloat(exp.amount) / USD_TO_INR).toFixed(2)} USD`
                        : `≈ ₹${(parseFloat(exp.amount) * USD_TO_INR).toLocaleString('en-IN', { maximumFractionDigits: 0 })} INR`}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <label className="md:hidden text-xs text-gray-600 uppercase tracking-widest mb-1 block">Currency</label>
                  <select
                    value={exp.currency}
                    onChange={(e) => updateExpense(idx, 'currency', e.target.value as 'INR' | 'USD')}
                    className={sel}
                  >
                    <option value="INR">₹ INR</option>
                    <option value="USD">$ USD</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▼</span>
                </div>
                <button
                  type="button" onClick={() => removeExpense(idx)}
                  className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-red-400 transition-colors text-xl leading-none mt-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="button" onClick={addExpense}
            className="mt-4 flex items-center gap-1.5 text-sm text-sand-400 hover:text-sand-300 transition-colors"
          >
            <span className="text-base">+</span> Add Expense
          </button>

          {/* Total summary */}
          {expenses.some((e) => parseFloat(e.amount) > 0) && (
            <div className="mt-6 p-4 bg-[#0d0d0d] border border-white/5 rounded-sm flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-0.5">Total Trip Cost</p>
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

        {/* ── Error + Submit ──────────────────────────────────────── */}
        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-sm">
            ⚠ {error}
          </div>
        )}

        <div className="flex gap-4 pt-6 border-t border-white/5">
          <button
            type="submit" disabled={loading}
            className="px-8 py-3 bg-white text-black font-medium hover:bg-sand-100 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Spinner dark />}
            {loading ? 'Saving…' : isEdit ? 'Update Trip' : 'Create Trip'}
          </button>
          <button
            type="button" onClick={() => router.push('/admin')}
            className="px-8 py-3 border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  )
}

function Spinner({ dark }: { dark?: boolean }) {
  return (
    <span className={`inline-block w-4 h-4 border-2 rounded-full animate-spin ${dark ? 'border-black border-t-transparent' : 'border-white border-t-transparent'}`} />
  )
}