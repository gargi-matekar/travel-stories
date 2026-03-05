// src/routes/stories/getBySlug.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function getStoryBySlug(slug: string) {
  try {
    const story = await prisma.story.findUnique({
      where: { slug },
      include: {
        moodEntries: { orderBy: { day: 'asc' } },
        expenses: true,
      },
    })

    if (!story) {
      return NextResponse.json(
        { error: `Story with slug "${slug}" not found` },
        { status: 404 }
      )
    }

    return NextResponse.json(story)
  } catch (error) {
    console.error(`[GET /api/stories/${slug}] Error:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch story' },
      { status: 500 }
    )
  }
}