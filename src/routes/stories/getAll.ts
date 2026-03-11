// src/routes/stories/getAll.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function getAllStories() {
  try {
    const stories = await prisma.story.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(stories)
  } catch (error) {
    console.error('[GET /api/stories] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    )
  }
}