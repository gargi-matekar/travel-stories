// src/app/admin/loading.tsx
import { AdminTableSkeleton } from '@/components/ui/Skeleton'

export default function AdminLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-white/5 rounded animate-pulse" />
      </div>
      <AdminTableSkeleton />
    </div>
  )
}