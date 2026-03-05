// src/app/admin/new/loading.tsx
export default function NewStoryLoading() {
    return (
      <div className="max-w-4xl space-y-12">
        <div className="space-y-2">
          <div className="h-9 w-48 bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-36 bg-white/5 rounded animate-pulse" />
        </div>
        {/* Form skeleton sections */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-5">
            <div className="h-6 w-32 bg-white/5 rounded pb-3 border-b border-white/10 animate-pulse" />
            <div className="grid grid-cols-2 gap-5">
              {Array.from({ length: i === 0 ? 4 : 2 }).map((_, j) => (
                <div key={j} className={`space-y-2 ${j === 0 && i === 0 ? 'col-span-2' : ''}`}>
                  <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                  <div className="h-11 w-full bg-white/5 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }