// // src/routes/admin/stories/update.ts
// import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
// import { verifyAdmin } from '../auth/verifyAdmin'

// export async function updateStory(request: Request, id: string) {
//   const authError = verifyAdmin(request)
//   if (authError) return authError.error

//   let body: Record<string, unknown>
//   try {
//     body = await request.json()
//   } catch {
//     return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
//   }

//   const {
//     title, slug, city, country, coverImage, content,
//     questionAsked, songName, songEmbedUrl,
//     latitude, longitude, totalCost,
//     expenses = [],
//   } = body as {
//     title: string; slug: string; city: string; country: string
//     coverImage: string; content: string; questionAsked: string
//     songName: string; songEmbedUrl: string
//     latitude: number | string; longitude: number | string
//     totalCost?: number | string
//     expenses?: { title: string; amount: number | string }[]
//   }

//   try {
//     // Wipe and recreate related records (simpler than diffing)
//     await prisma.moodEntry.deleteMany({ where: { storyId: id } })
//     await prisma.expense.deleteMany({ where: { storyId: id } })

//     const story = await prisma.story.update({
//       where: { id },
//       data: {
//         title: String(title),
//         slug: String(slug).toLowerCase().trim(),
//         city: String(city),
//         country: String(country),
//         coverImage: String(coverImage),
//         content: String(content),
//         questionAsked: String(questionAsked),
//         songName: String(songName),
//         songEmbedUrl: String(songEmbedUrl),
//         latitude: parseFloat(String(latitude)),
//         longitude: parseFloat(String(longitude)),
//         totalCost: parseFloat(String(totalCost || 0)),
//         expenses: {
//           create: (expenses as { title: string; amount: number | string }[]).map((e) => ({
//             title: String(e.title),
//             amount: parseFloat(String(e.amount)) || 0,
//           })),
//         },
//       },
//       include: {
//         expenses: true,
//       },
//     })

//     console.log(`[PUT /api/admin/stories/${id}] Updated story: ${story.slug}`)
//     return NextResponse.json(story)
//   } catch (error: unknown) {
//     console.error(`[PUT /api/admin/stories/${id}] DB error:`, error)

//     if ((error as { code?: string }).code === 'P2025') {
//       return NextResponse.json({ error: `Story with id "${id}" not found` }, { status: 404 })
//     }
//     if ((error as { code?: string }).code === 'P2002') {
//       return NextResponse.json({ error: 'Slug already taken by another story' }, { status: 409 })
//     }

//     return NextResponse.json(
//       {
//         error: 'Database error while updating story',
//         detail: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 }
//     )
//   }
// }


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
    expenses      = [],
    journeySteps  = [],
    routeStops    = [],
    recommendations = [],
  } = body as {
    title: string; slug: string; city: string; country: string
    coverImage: string; content: string; questionAsked: string
    songName: string; songEmbedUrl: string
    latitude: number | string; longitude: number | string
    totalCost?: number | string
    expenses?:      { title: string; amount: number | string }[]
    journeySteps?:  { title: string; description: string; time?: string; imageUrl?: string; order: number }[]
    routeStops?:    { name: string; note?: string; latitude: number | string; longitude: number | string; imageUrl?: string; order: number }[]
    recommendations?: { name: string; type: string; description: string; latitude?: number | string; longitude?: number | string; googleMapsUrl?: string; priceRange?: string }[]
  }

  try {
    // ── Wipe related records then recreate (no moodEntry) ──────
    await prisma.expense.deleteMany({ where: { storyId: id } })
    await prisma.journeyStep.deleteMany({ where: { storyId: id } })
    await prisma.routeStop.deleteMany({ where: { storyId: id } })
    await prisma.recommendation.deleteMany({ where: { storyId: id } })

    const story = await prisma.story.update({
      where: { id },
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
        latitude:     parseFloat(String(latitude)),
        longitude:    parseFloat(String(longitude)),
        totalCost:    parseFloat(String(totalCost || 0)),

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

    console.log(`[PUT /api/admin/stories/${id}] Updated: ${story.slug}`)
    return NextResponse.json(story)
  } catch (error: unknown) {
    console.error(`[PUT /api/admin/stories/${id}] DB error:`, error)
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: `Story "${id}" not found` }, { status: 404 })
    }
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Slug already taken' }, { status: 409 })
    }
    return NextResponse.json(
      { error: 'Database error while updating story', detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}