'use client'
import { useEffect, useState, useCallback } from 'react'

interface LikeButtonProps {
  slug: string
  variant?: 'card' | 'page'
}

function getVisitorId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem('trp_visitor_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('trp_visitor_id', id)
  }
  return id
}

export default function LikeButton({ slug, variant = 'card' }: LikeButtonProps) {
  const [count, setCount]   = useState(0)
  const [liked, setLiked]   = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const visitorId = getVisitorId()
    fetch(`/api/stories/${slug}/like`)
      .then(r => r.json())
      .then(data => {
        setCount(data.count)
        // check liked status client-side against localStorage
        const liked = localStorage.getItem(`trp_liked_${slug}`) === '1'
        setLiked(liked)
      })
  }, [slug])

  const toggle = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return

    const visitorId = getVisitorId()

    // optimistic update
    const wasLiked = liked
    setLiked(!wasLiked)
    setCount(c => wasLiked ? c - 1 : c + 1)
    setLoading(true)

    try {
      const res = await fetch(`/api/stories/${slug}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId }),
      })
      const data = await res.json()
      setCount(data.count)
      setLiked(data.liked)
      if (data.liked) {
        localStorage.setItem(`trp_liked_${slug}`, '1')
      } else {
        localStorage.removeItem(`trp_liked_${slug}`)
      }
    } catch {
      // revert on error
      setLiked(wasLiked)
      setCount(c => wasLiked ? c + 1 : c - 1)
    } finally {
      setLoading(false)
    }
  }, [slug, liked, loading])

  if (variant === 'page') {
    return (
      <button
        onClick={toggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          border: `1px solid ${liked ? 'rgba(200,80,80,0.6)' : 'var(--border)'}`,
          background: liked ? 'rgba(200,80,80,0.1)' : 'transparent',
          borderRadius: '2px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          letterSpacing: '0.12em',
          color: liked ? '#e05555' : 'var(--text-secondary)',
        }}
        aria-label={liked ? 'Unlike this story' : 'Like this story'}
      >
        <HeartIcon filled={liked} size={14} />
        <span>{count > 0 ? count : ''}</span>
        <span>{liked ? 'LIKED' : 'LIKE'}</span>
      </button>
    )
  }

  // card variant — compact
  return (
    <button
      onClick={toggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: '4px 8px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        transition: 'transform 0.15s ease',
        flexShrink: 0,
      }}
      aria-label={liked ? 'Unlike' : 'Like'}
      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <HeartIcon filled={liked} size={13} />
      {count > 0 && (
        <span style={{
          fontSize: '11px',
          color: liked ? '#e05555' : 'var(--text-muted)',
          fontFamily: 'monospace',
          lineHeight: 1,
        }}>
          {count}
        </span>
      )}
    </button>
  )
}

function HeartIcon({ filled, size = 14 }: { filled: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? '#e05555' : 'none'}
      stroke={filled ? '#e05555' : 'currentColor'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transition: 'all 0.2s ease', flexShrink: 0 }}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}