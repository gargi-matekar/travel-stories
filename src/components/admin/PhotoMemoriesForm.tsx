'use client'

import { useState } from 'react'

interface Memory {
  imageUrl: string
  caption: string
}

interface Props {
  storyId: string
  initialMemories?: Memory[]
}

export default function PhotoMemoriesForm({ storyId, initialMemories = [] }: Props) {
  const [memories, setMemories] = useState<Memory[]>(
    initialMemories.length > 0 ? initialMemories : [{ imageUrl: '', caption: '' }]
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const update = (index: number, field: keyof Memory, value: string) => {
    setMemories((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/admin/photo-memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId, memories }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
          Photo Memories ({memories.length})
        </p>
        <button
          onClick={() => setMemories((prev) => [...prev, { imageUrl: '', caption: '' }])}
          className="text-xs px-3 py-1.5 rounded"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          + Add Photo
        </button>
      </div>

      {memories.map((memory, index) => (
        <div
          key={index}
          className="p-4 rounded-lg space-y-3"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono" style={{ color: 'var(--accent)' }}>
              Photo {index + 1}
            </span>
            {memories.length > 1 && (
              <button
                onClick={() => setMemories((prev) => prev.filter((_, i) => i !== index))}
                className="text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                Remove
              </button>
            )}
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Image URL</label>
            <input
              value={memory.imageUrl}
              onChange={(e) => update(index, 'imageUrl', e.target.value)}
              className="w-full px-3 py-2 rounded text-sm"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Caption</label>
            <input
              value={memory.caption}
              onChange={(e) => update(index, 'caption', e.target.value)}
              className="w-full px-3 py-2 rounded text-sm"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              placeholder="A quiet moment at sunrise..."
            />
          </div>
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-5 py-2 rounded text-sm font-semibold"
        style={{ background: 'var(--accent)', color: 'white', opacity: saving ? 0.6 : 1 }}
      >
        {saved ? '✓ Saved' : saving ? 'Saving...' : 'Save Memories'}
      </button>
    </div>
  )
}