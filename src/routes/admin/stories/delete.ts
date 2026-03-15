// src/routes/admin/stories/delete.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '../auth/verifyAdmin'

export async function deleteStory(request: Request, id: string) {
  const authError = verifyAdmin()
  if (authError) return authError.error

  try {
    await prisma.story.delete({ where: { id } })
    console.log(`[DELETE /api/admin/stories/${id}] Deleted story`)
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error(`[DELETE /api/admin/stories/${id}] DB error:`, error)

    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: `Story with id "${id}" not found` }, { status: 404 })
    }

    return NextResponse.json(
      {
        error: 'Database error while deleting story',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}