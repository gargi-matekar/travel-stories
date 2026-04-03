// src/app/admin/login/page.tsx
'use client'

export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      window.location.href = '/admin'
     } else {
      setError('Invalid password')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-ink-900 flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-sand-400 tracking-[0.3em] text-xs uppercase mb-3">
            Restricted
          </p>
          <h1 className="text-3xl font-serif font-light text-white">
            Admin Access
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 bg-ink-800 border border-white/10 text-white placeholder-gray-600 rounded-none focus:outline-none focus:border-sand-500 transition-colors"
            required
            autoFocus
          />
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-black font-medium hover:bg-sand-100 transition-colors disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </div>
    </main>
  )
}
