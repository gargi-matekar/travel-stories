// src/app/api/admin/route-stops/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { storyId, stops } = await req.json()
    if (!storyId || !Array.isArray(stops)) {
      return NextResponse.json({ error: 'Missing storyId or stops' }, { status: 400 })
    }
    await prisma.routeStop.deleteMany({ where: { storyId } })
    const created = await prisma.routeStop.createMany({
      data: stops.map((s: any, i: number) => ({
        storyId,
        name:      s.name,
        note:      s.note      ?? null,
        imageUrl:  s.imageUrl  ?? null,
        latitude:  parseFloat(s.latitude),
        longitude: parseFloat(s.longitude),
        order:     i,
      })),
    })
    return NextResponse.json({ success: true, count: created.count })
  } catch (err) {
    console.error('[route-stops POST]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const storyId = req.nextUrl.searchParams.get('storyId')
  if (!storyId) return NextResponse.json({ error: 'Missing storyId' }, { status: 400 })
  const stops = await prisma.routeStop.findMany({
    where: { storyId },
    orderBy: { order: 'asc' },
  })
  return NextResponse.json(stops)
}