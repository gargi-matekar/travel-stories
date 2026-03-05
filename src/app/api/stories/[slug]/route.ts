// src/app/api/stories/[slug]/route.ts
import { getStoryBySlug } from '@/routes/stories/getBySlug'

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  return getStoryBySlug(params.slug)
}