// src/app/api/admin/recommendations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { storyId, recommendations } = await req.json()
    if (!storyId || !Array.isArray(recommendations)) {
      return NextResponse.json({ error: 'Missing storyId or recommendations' }, { status: 400 })
    }
    await prisma.recommendation.deleteMany({ where: { storyId } })
    const created = await prisma.recommendation.createMany({
      data: recommendations.map((r: any) => ({
        storyId,
        name:          r.name,
        type:          r.type,
        description:   r.description,
        googleMapsUrl: r.googleMapsUrl ?? null,
        priceRange:    r.priceRange    ?? null,
        latitude:      r.latitude  ? parseFloat(r.latitude)  : null,
        longitude:     r.longitude ? parseFloat(r.longitude) : null,
      })),
    })
    return NextResponse.json({ success: true, count: created.count })
  } catch (err) {
    console.error('[recommendations POST]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const storyId = req.nextUrl.searchParams.get('storyId')
  if (!storyId) return NextResponse.json({ error: 'Missing storyId' }, { status: 400 })
  const recs = await prisma.recommendation.findMany({ where: { storyId } })
  return NextResponse.json(recs)
}