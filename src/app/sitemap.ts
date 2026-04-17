import { PrismaClient } from '@prisma/client'
import { MetadataRoute } from 'next'

const prisma = new PrismaClient()

const BASE_URL = 'https://travel-stories-eight.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const stories = await prisma.story.findMany({
    select: { slug: true, updatedAt: true },
  })

  const trips = await prisma.trip.findMany({
    select: { slug: true, updatedAt: true },
  })

  const storyUrls = stories.map((s) => ({
    url: `${BASE_URL}/stories/${s.slug}`,
    lastModified: s.updatedAt,
  }))

  const tripUrls = trips.map((t) => ({
    url: `${BASE_URL}/trips/${t.slug}`,
    lastModified: t.updatedAt,
  }))

  return [
    { url: BASE_URL, lastModified: new Date() },
    { url: `${BASE_URL}/stories`, lastModified: new Date() },
    { url: `${BASE_URL}/trips`, lastModified: new Date() },
    ...storyUrls,
    ...tripUrls,
  ]
}