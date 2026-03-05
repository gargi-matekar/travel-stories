// src/app/stories/loading.tsx
import NavBar from '@/components/NavBar'
import { StoriesGridSkeleton } from '@/components/ui/Skeleton'

export default function StoriesLoading() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-ink-900 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Header skeleton */}
          <div className="mb-16 space-y-3">
            <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
            <div className="h-14 w-64 bg-white/5 rounded animate-pulse" />
            <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
          </div>
          <StoriesGridSkeleton />
        </div>
      </main>
    </>
  )
}