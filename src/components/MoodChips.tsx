'use client'

// src/components/MoodChips.tsx
import Link from 'next/link'

const MOODS = [
  { label: 'Peace',     value: 'Peaceful',   color: '#22c55e' },
  { label: 'Adventure', value: 'Adventurous', color: '#f97316' },
  { label: 'Healing',   value: 'Reflective',  color: '#6366f1' },
  { label: 'Curiosity', value: 'Curious',     color: '#eab308' },
  { label: 'Melancholy',value: 'Melancholic', color: '#a855f7' },
  { label: 'Solitude',  value: 'Solitary',    color: '#6b7280' },
  { label: 'Joy',       value: 'Joyful',      color: '#ec4899' },
  { label: 'Wonder',    value: 'Fascinated',  color: '#f97316' },
]

export default function MoodChips() {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {MOODS.map((mood) => (
        <Link
          key={mood.value}
          href={`/stories?mood=${mood.value}`}
          className="px-5 py-2.5 text-sm tracking-wide border transition-all duration-300 hover:-translate-y-0.5"
          style={{ borderColor: 'var(--border-strong)', color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.borderColor = mood.color
            el.style.color = mood.color
            el.style.backgroundColor = mood.color + '14'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.borderColor = 'var(--border-strong)'
            el.style.color = 'var(--text-secondary)'
            el.style.backgroundColor = ''
          }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full mr-2"
            style={{ backgroundColor: mood.color, opacity: 0.7 }}
          />
          {mood.label}
        </Link>
      ))}
    </div>
  )
}