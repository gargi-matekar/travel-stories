import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const trip = await prisma.trip.findUnique({
    where: { id: params.id },
    include: {
      stories: {
        include: {
          routeStops:   { orderBy: { order: 'asc' } },
          journeySteps: { orderBy: { order: 'asc' } },
          cityFrames:   { orderBy: { order: 'asc' }, take: 1 },
        },
      },
      expenses: true,
    },
  })
  if (!trip) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(trip)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { expenses, totalCost, ...data } = await req.json()

  // Delete and recreate expenses (same bulk-replace pattern as other repeatable sections)
  await prisma.expense.deleteMany({ where: { storyId: undefined, story: undefined } })

  const trip = await prisma.trip.update({
    where: { id: params.id },
    data: {
      ...data,
      ...(expenses && {
        expenses: {
          deleteMany: {},
          create: expenses,
        },
      }),
    },
  })
  return NextResponse.json(trip)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.trip.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}