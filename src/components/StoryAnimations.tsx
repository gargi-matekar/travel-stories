'use client'

// src/components/StoryAnimations.tsx
// Injects all cinematic CSS + runs scroll observer + parallax hero
// Drop this once into the story page — no props needed.

import { useEffect } from 'react'

export default function StoryAnimations() {
  useEffect(() => {
    // ── Hero parallax ──────────────────────────────────────────────────────
    const heroBg = document.querySelector('.story-hero-bg') as HTMLElement | null
    const onScroll = () => {
      if (heroBg) {
        const y = window.scrollY
        // Moves bg up at half scroll speed — classic parallax
        heroBg.style.transform = `scale(1.1) translateY(${y * 0.25}px)`
      }

      // ── Scroll reveal ────────────────────────────────────────────────────
      document.querySelectorAll('.scroll-reveal:not(.revealed)').forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.88) {
          el.classList.add('revealed')
        }
      })

      // ── Expense rows stagger ─────────────────────────────────────────────
      document.querySelectorAll('.expense-row:not(.revealed)').forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.92) {
          el.classList.add('revealed')
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // Trigger once immediately for above-fold content
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <style jsx global>{`
      /* ── Hero title / meta entrance ────────────────────────────────────── */
      @keyframes story-reveal-in {
        from { opacity: 0; transform: translateY(28px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .story-reveal {
        opacity: 0;
        animation: story-reveal-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }

      /* ── Scroll-triggered section reveal ──────────────────────────────── */
      .scroll-reveal {
        opacity: 0;
        transform: translateY(36px);
        transition: opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1),
                    transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .scroll-reveal.revealed {
        opacity: 1;
        transform: translateY(0);
      }

      /* ── Expense row slide-in ──────────────────────────────────────────── */
      .expense-row {
        opacity: 0;
        transform: translateX(-16px);
        transition: opacity 0.45s ease, transform 0.45s ease;
      }
      .expense-row.revealed {
        opacity: 1;
        transform: translateX(0);
      }

      /* ── Journey timeline entrance (each step) ─────────────────────────── */
      .jtl-step {
        opacity: 0;
        transform: translateX(-20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      .jtl-step.in-view {
        opacity: 1;
        transform: translateX(0);
      }

      /* ── Recommendation cards hover lift ───────────────────────────────── */
      .lr-card {
        transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
                    border-color 0.2s ease,
                    background 0.2s ease !important;
      }
      .lr-card:hover {
        transform: translateY(-4px) !important;
      }

      /* ── Hero horizontal scan line ─────────────────────────────────────── */
      @keyframes scanline {
        0%   { top: -2px; opacity: 0.06; }
        100% { top: 100%; opacity: 0; }
      }
      main > section:first-child::after {
        content: '';
        position: absolute;
        left: 0; right: 0; height: 2px;
        background: linear-gradient(90deg, transparent, rgba(232,134,90,0.3), transparent);
        animation: scanline 6s linear infinite;
        pointer-events: none;
        z-index: 5;
      }

      /* ── Subtle grain texture on the whole page ─────────────────────────── */
      main::before {
        content: '';
        position: fixed;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
        opacity: 0.025;
        pointer-events: none;
        z-index: 1000;
      }

      /* ── Reading progress bar at top ───────────────────────────────────── */
      #reading-progress {
        position: fixed;
        top: 0; left: 0;
        height: 2px;
        background: linear-gradient(90deg, #e8865a, #e8a87a);
        width: 0%;
        transition: width 0.1s linear;
        z-index: 9999;
        box-shadow: 0 0 8px rgba(232,134,90,0.5);
      }
    `}</style>
  )
}