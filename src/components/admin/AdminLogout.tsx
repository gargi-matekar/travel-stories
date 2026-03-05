// src/components/admin/AdminLogout.tsx
'use client'

import { useRouter } from 'next/navigation'

export default function AdminLogout() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
    >
      Logout
    </button>
  )
}
