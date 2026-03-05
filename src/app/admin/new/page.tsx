// src/app/admin/new/page.tsx
import AdminStoryForm from '@/components/admin/AdminStoryForm'

export default function NewStoryPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-light text-white">New Story</h1>
        <p className="text-gray-500 mt-1">Document a new journey</p>
      </div>
      <AdminStoryForm />
    </div>
  )
}
