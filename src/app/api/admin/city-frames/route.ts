import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.json()
  const { storyId, frames } = body

  // Delete existing and re-insert (bulk replace pattern)
  await prisma.cityFrame.deleteMany({ where: { storyId } })
  const created = await prisma.cityFrame.createMany({
    data: frames.map((f: any, i: number) => ({ ...f, storyId, order: i })),
  })
  return NextResponse.json(created)
}