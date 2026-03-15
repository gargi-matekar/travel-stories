import TripForm from '@/components/admin/TripForm'

export default function NewTripPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-light text-white">New Trip</h1>
        <p className="text-gray-500 mt-1">Create a multi-city journey</p>
      </div>
      <TripForm mode="create" />
    </div>
  )
}