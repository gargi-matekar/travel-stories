import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const trips = await prisma.trip.findMany({
    include: {
      stories: { select: { id: true, city: true, slug: true, coverImage: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(trips)
}

export async function POST(req: Request) {
  const { expenses, totalCost, ...data } = await req.json()

  const trip = await prisma.trip.create({
    data: {
      ...data,
      ...(expenses?.length && {
        expenses: {
          create: expenses,
        },
      }),
    },
  })
  return NextResponse.json(trip)
}