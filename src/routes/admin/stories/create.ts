// src/routes/admin/stories/create.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '../auth/verifyAdmin'

export async function createStory(request: Request) {
  // 1. Auth check
  const authError = verifyAdmin(request)
  if (authError) return authError.error

  // 2. Parse body
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  // 3. Validate required fields
  const required = [
    'title', 'slug', 'city', 'country', 'coverImage',
    'content', 'questionAsked', 'songName', 'songEmbedUrl',
    'latitude', 'longitude',
  ]
  const missing = required.filter((f) => !body[f] && body[f] !== 0)
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(', ')}` },
      { status: 400 }
    )
  }

  // 4. Parse & type-cast
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

  const lat = parseFloat(String(latitude))
  const lng = parseFloat(String(longitude))
  const cost = parseFloat(String(totalCost || 0))

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: 'latitude and longitude must be valid numbers' },
      { status: 400 }
    )
  }

  // 5. Create in DB
  try {
    const story = await prisma.story.create({
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
        latitude: lat,
        longitude: lng,
        totalCost: isNaN(cost) ? 0 : cost,
        moodEntries: {
          create: moodEntries.map((m) => ({
            day: parseInt(String(m.day)) || 1,
            mood: String(m.mood),
            note: m.note ? String(m.note) : null,
          })),
        },
        expenses: {
          create: expenses.map((e) => ({
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

    console.log(`[POST /api/admin/stories] Created story: ${story.slug}`)
    return NextResponse.json(story, { status: 201 })
  } catch (error: unknown) {
    console.error('[POST /api/admin/stories] DB error:', error)

    // Prisma unique constraint violation
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json(
        { error: `Slug "${slug}" is already taken. Choose a different slug.` },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        error: 'Database error while creating story',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}