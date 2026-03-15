import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import TripForm from '@/components/admin/TripForm'

export default async function EditTripPage({ params }: { params: { id: string } }) {
  const trip = await prisma.trip.findUnique({ where: { id: params.id } })
  if (!trip) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-light text-white">Edit Trip</h1>
        <p className="text-gray-500 mt-1">{trip.title}</p>
      </div>
      <TripForm mode="edit" initialData={{ ...trip, description: trip.description ?? '', coverImage: trip.coverImage ?? '' }} />
    </div>
  )
}