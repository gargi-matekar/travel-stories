// src/app/admin/layout.tsx
import Link from 'next/link'
import AdminLogout from '@/components/admin/AdminLogout'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-ink-900">
      {/* Admin nav */}
      <nav className="bg-ink-800 border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-white font-medium text-sm">
              Admin
            </Link>
            <span className="text-white/20">|</span>
            <Link
              href="/admin/new"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              + New Story
            </Link>
            <Link
              href="/stories"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              View Site →
            </Link>
          </div>
          <AdminLogout />
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  )
}
