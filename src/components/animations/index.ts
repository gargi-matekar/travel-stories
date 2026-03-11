// components/animations/index.ts
// Lazy-loaded dynamic imports for all animation components
// Use these in your pages instead of direct imports to avoid SSR issues
// and keep initial bundle small.
//
// Usage:
//   import { LazyStarField, LazyFloatingCoords } from '@/components/animations'
//
//   <LazyStarField />
//   <LazyFloatingCoords />

import dynamic from 'next/dynamic'

/** Hero section — Milky Way star field on Canvas. Desktop only. */
export const LazyStarField = dynamic(
  () => import('./StarFieldBackground'),
  { ssr: false }
)

/** Scroll section — drifting GPS coordinate particles on Canvas. */
export const LazyFloatingCoords = dynamic(
  () => import('./FloatingCoordinates'),
  { ssr: false }
)

/** Story page — static paper map texture + compass watermark. */
export const LazyExplorerMap = dynamic(
  () => import('./ExplorerMapBackground'),
  { ssr: false }
)

/** Journey section — animated SVG route lines with glow pulse. */
export const LazyTravelRoutes = dynamic(
  () => import('./TravelRouteLines'),
  { ssr: false }
)

/** Gallery section — floating polaroid photos. Desktop only. */
export const LazyPolaroids = dynamic(
  () => import('./FloatingPolaroids'),
  { ssr: false }
)

/** Section divider — 3-layer parallax mountain landscape. */
export const LazyMountains = dynamic(
  () => import('./ParallaxMountains'),
  { ssr: false }
)

/** Site-wide — faint world map line art fixed background. */
export const LazyWorldMap = dynamic(
  () => import('./WorldMapTexture'),
  { ssr: false }
)

// ─── Re-export prop types for consumers ──────────────────────────────────────

export type { PolaroidPhoto } from './FloatingPolaroids'