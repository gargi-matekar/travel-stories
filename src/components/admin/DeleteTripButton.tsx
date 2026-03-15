'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteTripButton({ tripId }: { tripId: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)

  async function handleDelete() {
    await fetch(`/api/trips/${tripId}`, { method: 'DELETE' })
    router.refresh()
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-2">
        <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-300 transition-colors">Confirm</button>
        <button onClick={() => setConfirming(false)} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Cancel</button>
      </span>
    )
  }

  return (
    <button onClick={() => setConfirming(true)} className="text-xs text-gray-700 hover:text-red-400 transition-colors">
      Delete
    </button>
  )
}