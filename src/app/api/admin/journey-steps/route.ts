// src/app/api/admin/journey-steps/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { storyId, steps } = await req.json()
    if (!storyId || !Array.isArray(steps)) {
      return NextResponse.json({ error: 'Missing storyId or steps' }, { status: 400 })
    }
    await prisma.journeyStep.deleteMany({ where: { storyId } })
    const created = await prisma.journeyStep.createMany({
      data: steps.map((s: any, i: number) => ({ ...s, storyId, order: i })),
    })
    return NextResponse.json({ success: true, count: created.count })
  } catch (err) {
    console.error('[journey-steps POST]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const storyId = req.nextUrl.searchParams.get('storyId')
  if (!storyId) return NextResponse.json({ error: 'Missing storyId' }, { status: 400 })
  const steps = await prisma.journeyStep.findMany({
    where: { storyId },
    orderBy: { order: 'asc' },
  })
  return NextResponse.json(steps)
}