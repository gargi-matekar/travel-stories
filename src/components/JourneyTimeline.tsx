'use client'

// src/components/JourneyTimeline.tsx

import { useEffect, useRef } from 'react'
import Image from 'next/image'

interface JourneyStep {
  id: string
  title: string
  description: string
  time?: string | null
  imageUrl?: string | null
  order: number
}

export default function JourneyTimeline({ steps }: { steps: JourneyStep[] }) {
  const rootRef = useRef<HTMLDivElement>(null)

  // Stagger each step in as it enters viewport
  useEffect(() => {
    if (!rootRef.current) return
    const items = rootRef.current.querySelectorAll('.jtl-step')

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const delay = parseInt(el.dataset.delay || '0', 10)
            setTimeout(() => el.classList.add('in-view'), delay)
            obs.unobserve(el)
          }
        })
      },
      { threshold: 0.15 }
    )

    items.forEach((el, i) => {
      ;(el as HTMLElement).dataset.delay = String(i * 100)
      obs.observe(el)
    })

    return () => obs.disconnect()
  }, [])

  if (!steps || steps.length === 0) return null

  const sorted = [...steps].sort((a, b) => a.order - b.order)

  return (
    <div ref={rootRef} className="jtl-root">
      {sorted.map((step, index) => (
        <div key={step.id} className="jtl-step">
          {/* Connector */}
          <div className="jtl-connector">
            <div className="jtl-dot">
              <span className="jtl-dot-num">{index + 1}</span>
            </div>
            {index < sorted.length - 1 && <div className="jtl-line" />}
          </div>

          {/* Content */}
          <div className="jtl-content">
            {step.time && <span className="jtl-time">{step.time}</span>}
            <h3 className="jtl-title">
              <span className="jtl-day">Day {index + 1}</span>
              <span className="jtl-sep"> — </span>
              {step.title}
            </h3>
            <p className="jtl-desc">{step.description}</p>

            {/* Photo */}
            {step.imageUrl && (
              <div className="jtl-img-wrap">
                <Image
                  src={step.imageUrl}
                  alt={step.title}
                  width={640}
                  height={360}
                  className="jtl-img"
                  unoptimized
                />
                <div className="jtl-img-overlay" />
              </div>
            )}
          </div>
        </div>
      ))}

      <style jsx>{`
        .jtl-root { display: flex; flex-direction: column; }

        .jtl-step {
          display: grid;
          grid-template-columns: 44px 1fr;
          gap: 20px;
          /* in-view class added by IntersectionObserver via StoryAnimations */
        }

        .jtl-connector {
          display: flex; flex-direction: column;
          align-items: center; padding-top: 3px;
        }
        .jtl-dot {
          width: 32px; height: 32px; border-radius: 50%;
          background: #e8865a;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 0 5px rgba(232,134,90,0.12), 0 0 20px rgba(232,134,90,0.15);
          z-index: 1;
          transition: box-shadow 0.3s ease;
        }
        .jtl-step.in-view .jtl-dot {
          box-shadow: 0 0 0 6px rgba(232,134,90,0.15), 0 0 28px rgba(232,134,90,0.25);
        }
        .jtl-dot-num { font-size: 0.6rem; font-weight: 800; color: #0c1118; }
        .jtl-line {
          width: 1px; flex: 1; min-height: 24px; margin: 6px 0;
          background: linear-gradient(to bottom, rgba(232,134,90,0.5), rgba(232,134,90,0.04));
        }
        .jtl-content { padding-bottom: 52px; }
        .jtl-time {
          display: inline-block;
          font-size: 0.62rem; letter-spacing: 0.18em;
          text-transform: uppercase; color: #e8865a;
          margin-bottom: 6px; font-weight: 600;
        }
        .jtl-title {
          font-size: 1.05rem; font-weight: 400;
          color: #fff; margin: 0 0 10px;
          font-family: Georgia, serif; line-height: 1.4;
        }
        .jtl-day  { color: #e8865a; font-weight: 600; }
        .jtl-sep  { color: rgba(255,255,255,0.2); }
        .jtl-desc {
          font-size: 0.9rem; line-height: 1.85;
          color: rgba(255,255,255,0.5); margin: 0;
          max-width: 58ch;
        }

        /* Photo */
        .jtl-img-wrap {
          position: relative;
          margin-top: 18px; border-radius: 6px; overflow: hidden;
          max-width: 520px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .jtl-img {
          width: 100%; height: auto; display: block;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .jtl-img-wrap:hover .jtl-img { transform: scale(1.04); }
        .jtl-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(12,17,24,0.4) 0%, transparent 50%);
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}