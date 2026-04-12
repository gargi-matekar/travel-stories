import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const story = await prisma.story.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  })
  if (!story) return NextResponse.json({ count: 0, liked: false })

  const count = await prisma.like.count({ where: { storyId: story.id } })
  return NextResponse.json({ count, liked: false })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { visitorId } = await req.json()
  if (!visitorId) return NextResponse.json({ error: 'missing visitorId' }, { status: 400 })

  const story = await prisma.story.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  })
  if (!story) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const existing = await prisma.like.findUnique({
    where: { storyId_visitorId: { storyId: story.id, visitorId } },
  })

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
  } else {
    await prisma.like.create({ data: { storyId: story.id, visitorId } })
  }

  const count = await prisma.like.count({ where: { storyId: story.id } })
  const liked = !existing

  return NextResponse.json({ count, liked })
}