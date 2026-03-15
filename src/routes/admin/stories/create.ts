// src/routes/admin/stories/create.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '../auth/verifyAdmin'

export async function createStory(request: Request) {
  const authError = verifyAdmin()
  if (authError) return authError.error

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const required = [
    'title', 'slug', 'city', 'country', 'coverImage',
    'content', 'questionAsked', 'songName', 'songEmbedUrl',
    'latitude', 'longitude',
  ]
  const missing = required.filter((f) => !body[f] && body[f] !== 0)
  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing required fields: ${missing.join(', ')}` }, { status: 400 })
  }

  const {
    title, slug, city, country, coverImage, content,
    questionAsked, songName, songEmbedUrl,
    latitude, longitude, totalCost,
    tripId,
    expenses       = [],
    journeySteps   = [],
    routeStops     = [],
    recommendations = [],
  } = body as {
    title: string; slug: string; city: string; country: string
    coverImage: string; content: string; questionAsked: string
    songName: string; songEmbedUrl: string
    latitude: number | string; longitude: number | string
    totalCost?: number | string
    tripId?: string 
    expenses?:       { title: string; amount: number | string }[]
    journeySteps?:   { title: string; description: string; time?: string; imageUrl?: string; order: number }[]
    routeStops?:     { name: string; note?: string; latitude: number | string; longitude: number | string; imageUrl?: string; order: number }[]
    recommendations?: { name: string; type: string; description: string; latitude?: number | string; longitude?: number | string; googleMapsUrl?: string; priceRange?: string }[]
  }

  const lat  = parseFloat(String(latitude))
  const lng  = parseFloat(String(longitude))
  const cost = parseFloat(String(totalCost || 0))

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'latitude and longitude must be valid numbers' }, { status: 400 })
  }

  try {
    const story = await prisma.story.create({
      data: {
        title:        String(title),
        slug:         String(slug).toLowerCase().trim(),
        city:         String(city),
        country:      String(country),
        coverImage:   String(coverImage),
        content:      String(content),
        questionAsked: String(questionAsked),
        songName:     String(songName),
        songEmbedUrl: String(songEmbedUrl),
        latitude:     lat,
        longitude:    lng,
        totalCost:    isNaN(cost) ? 0 : cost,
        tripId:       tripId ? String(tripId) : null,

        expenses: {
          create: (expenses as { title: string; amount: number | string }[]).map((e) => ({
            title:  String(e.title),
            amount: parseFloat(String(e.amount)) || 0,
          })),
        },

        journeySteps: {
          create: (journeySteps as any[]).map((s, i) => ({
            title:       String(s.title),
            description: String(s.description),
            time:        s.time     ? String(s.time)     : null,
            imageUrl:    s.imageUrl ? String(s.imageUrl) : null,
            order:       i,
          })),
        },

        routeStops: {
          create: (routeStops as any[]).map((s, i) => ({
            name:      String(s.name),
            note:      s.note     ? String(s.note)     : null,
            imageUrl:  s.imageUrl ? String(s.imageUrl) : null,
            latitude:  parseFloat(String(s.latitude)),
            longitude: parseFloat(String(s.longitude)),
            order:     i,
          })),
        },

        recommendations: {
          create: (recommendations as any[]).map((r) => ({
            name:          String(r.name),
            type:          String(r.type),
            description:   String(r.description),
            googleMapsUrl: r.googleMapsUrl ? String(r.googleMapsUrl) : null,
            priceRange:    r.priceRange    ? String(r.priceRange)    : null,
            latitude:      r.latitude  ? parseFloat(String(r.latitude))  : null,
            longitude:     r.longitude ? parseFloat(String(r.longitude)) : null,
          })),
        },
      },
      include: {
        expenses: true,
        journeySteps:    { orderBy: { order: 'asc' } },
        routeStops:      { orderBy: { order: 'asc' } },
        recommendations: true,
      },
    })

    console.log(`[POST /api/admin/stories] Created: ${story.slug}`)
    return NextResponse.json(story, { status: 201 })
  } catch (error: unknown) {
    console.error('[POST /api/admin/stories] DB error:', error)
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: `Slug "${slug}" is already taken.` }, { status: 409 })
    }
    return NextResponse.json(
      { error: 'Database error while creating story', detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}