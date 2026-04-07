// src/app/api/admin/stories/[id]/route.ts
// PUT  — update a story
// DELETE — delete a story

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ── PUT: update story core fields ────────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id   = params.id
    const body = await req.json()
    // Pull only the fields that exist on the Story model
    // (moodEntries removed — do NOT reference prisma.moodEntry here)
    const {
      title,
      slug,
      city,
      state,
      country,
      coverImage,
      content,
      questionAsked,
      songName,
      songEmbedUrl,
      latitude,
      longitude,
      totalCost,
      tripId,
      coordinates,    
      closingReflection, 
    } = body

    const story = await prisma.story.update({
      where: { id },
      data: {
        title,
        slug,
        city,
        state:state? String(state) : null, 
        country,
        coverImage,
        content,
        questionAsked,
        songName,
        songEmbedUrl,
        latitude:  latitude  != null ? parseFloat(latitude)  : undefined,
        longitude: longitude != null ? parseFloat(longitude) : undefined,
        totalCost: totalCost != null ? parseFloat(totalCost) : undefined,
        tripId:    tripId ?? null,
        coordinates:      coordinates      ?? null, 
        closingReflection: closingReflection ?? null, 
      },
    })

    return NextResponse.json(story)
  } catch (err: any) {
    console.error('[story PUT]', err)
    return NextResponse.json(
      { error: 'Database error while updating story', detail: err.message },
      { status: 500 }
    )
  }
}

// ── DELETE: remove story + all relations (cascade) ───────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Cascade delete is handled by Prisma schema (onDelete: Cascade)
    // so deleting the story removes expenses, journeySteps, routeStops,
    // recommendations automatically.
    await prisma.story.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[story DELETE]', err)
    return NextResponse.json(
      { error: 'Database error while deleting story', detail: err.message },
      { status: 500 }
    )
  }
}

// ── GET: fetch single story for edit form ─────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const story = await prisma.story.findUnique({
      where: { id: params.id },
      include: {
        expenses:        true,
        journeySteps:    { orderBy: { order: 'asc' } },
        routeStops:      { orderBy: { order: 'asc' } },
        recommendations: true,
      },
    })
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }
    return NextResponse.json(story)
  } catch (err: any) {
    console.error('[story GET]', err)
    return NextResponse.json(
      { error: 'Database error', detail: err.message },
      { status: 500 }
    )
  }
}