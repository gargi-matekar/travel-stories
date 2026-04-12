// src/components/Skeleton.tsx
// Reusable skeleton loading components

export function SkeletonPulse({ className = '' }: { className?: string }) {
    return (
      <div className={`animate-pulse bg-white/5 rounded-sm ${className}`} />
    )
  }
  
  // Story card skeleton — matches StoryCard layout
  export function StoryCardSkeleton() {
    return (
      <div className="bg-ink-800 rounded-lg overflow-hidden">
        {/* Image area */}
        <div className="h-72 bg-white/5 animate-pulse relative">
          {/* Top badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse" />
          </div>
          <div className="absolute top-4 right-4">
            <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse" />
          </div>
          {/* Bottom text */}
          <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
            <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
            <div className="h-5 w-48 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/5">
          <div className="h-3 w-36 bg-white/5 rounded animate-pulse" />
        </div>
      </div>
    )
  }
  
  // Stories grid skeleton
  export function StoriesGridSkeleton() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <StoryCardSkeleton key={i} />
        ))}
      </div>
    )
  }
  
  // Admin table skeleton
  export function AdminTableSkeleton() {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-ink-800 border border-white/5 animate-pulse">
            <div className="space-y-2 flex-1">
              <div className="h-4 w-48 bg-white/10 rounded" />
              <div className="h-3 w-32 bg-white/5 rounded" />
            </div>
            <div className="flex gap-2 ml-4">
              <div className="h-8 w-12 bg-white/10 rounded" />
              <div className="h-8 w-10 bg-white/10 rounded" />
              <div className="h-8 w-14 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }