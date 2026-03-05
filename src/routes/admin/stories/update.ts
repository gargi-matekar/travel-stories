// src/routes/admin/stories/update.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '../auth/verifyAdmin'

export async function updateStory(request: Request, id: string) {
  const authError = verifyAdmin(request)
  if (authError) return authError.error

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const {
    title, slug, city, country, coverImage, content,
    questionAsked, songName, songEmbedUrl,
    latitude, longitude, totalCost,
    moodEntries = [],
    expenses = [],
  } = body as {
    title: string; slug: string; city: string; country: string
    coverImage: string; content: string; questionAsked: string
    songName: string; songEmbedUrl: string
    latitude: number | string; longitude: number | string
    totalCost?: number | string
    moodEntries?: { day: number | string; mood: string; note?: string }[]
    expenses?: { title: string; amount: number | string }[]
  }

  try {
    // Wipe and recreate related records (simpler than diffing)
    await prisma.moodEntry.deleteMany({ where: { storyId: id } })
    await prisma.expense.deleteMany({ where: { storyId: id } })

    const story = await prisma.story.update({
      where: { id },
      data: {
        title: String(title),
        slug: String(slug).toLowerCase().trim(),
        city: String(city),
        country: String(country),
        coverImage: String(coverImage),
        content: String(content),
        questionAsked: String(questionAsked),
        songName: String(songName),
        songEmbedUrl: String(songEmbedUrl),
        latitude: parseFloat(String(latitude)),
        longitude: parseFloat(String(longitude)),
        totalCost: parseFloat(String(totalCost || 0)),
        moodEntries: {
          create: (moodEntries as { day: number | string; mood: string; note?: string }[]).map((m) => ({
            day: parseInt(String(m.day)) || 1,
            mood: String(m.mood),
            note: m.note ? String(m.note) : null,
          })),
        },
        expenses: {
          create: (expenses as { title: string; amount: number | string }[]).map((e) => ({
            title: String(e.title),
            amount: parseFloat(String(e.amount)) || 0,
          })),
        },
      },
      include: {
        moodEntries: true,
        expenses: true,
      },
    })

    console.log(`[PUT /api/admin/stories/${id}] Updated story: ${story.slug}`)
    return NextResponse.json(story)
  } catch (error: unknown) {
    console.error(`[PUT /api/admin/stories/${id}] DB error:`, error)

    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: `Story with id "${id}" not found` }, { status: 404 })
    }
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Slug already taken by another story' }, { status: 409 })
    }

    return NextResponse.json(
      {
        error: 'Database error while updating story',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}