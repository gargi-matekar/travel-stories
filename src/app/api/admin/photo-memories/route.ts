import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.json()
  const { storyId, memories } = body

  await prisma.photoMemory.deleteMany({ where: { storyId } })
  const created = await prisma.photoMemory.createMany({
    data: memories.map((m: any, i: number) => ({ ...m, storyId, order: i })),
  })
  return NextResponse.json(created)
}