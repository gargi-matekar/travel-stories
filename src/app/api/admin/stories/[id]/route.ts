// src/app/api/admin/stories/[id]/route.ts
import { updateStory } from '@/routes/admin/stories/update'
import { deleteStory } from '@/routes/admin/stories/delete'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return updateStory(request, params.id)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return deleteStory(request, params.id)
}