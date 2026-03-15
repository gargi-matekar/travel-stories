// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const trip = await prisma.trip.create({
    data: {
      title: 'Tamil Nadu Coastal Journey',
      slug: 'tamil-nadu-coastal-journey',
      description: 'A soul-shifting road trip along the southeastern coast of India — from temple towns to the tip of the subcontinent.',
      coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
    },
  })

  const story = await prisma.story.create({
    data: {
      city: 'Rameshwaram',
      state: 'Tamil Nadu',
      country: 'India',
      title: 'Where the sea meets the sacred',
      slug: 'rameshwaram',
      coverImage: 'https://images.unsplash.com/photo-1609420012025-a6b2d30a6568?w=1200',
      coordinates: '9.2876° N, 79.3129° E',
      songName: 'Soorakaatham',
      songEmbedUrl: 'https://open.spotify.com/embed/track/3n3PyWFEOFMgBvQSMvfqBI',
      questionAsked: 'What does it mean to arrive at the edge of something?',
      closingReflection: "Some places don't ask for your itinerary. They ask for your presence.",
      content: '<p>Rameshwaram arrived like a dream half-remembered — salt in the air before the island even came into view.</p>',
      latitude: 9.2876,
      longitude: 79.3129,
      totalCost: 4200,
      tripId: trip.id,
    },
  })

  await prisma.cityFrame.createMany({
    data: [
      { storyId: story.id, title: 'Arrival', description: 'The bridge emerging from fog at dawn.', imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800', order: 0 },
      { storyId: story.id, title: 'Morning Ritual', description: 'Pilgrims bathing in the sea at 5am.', imageUrl: 'https://images.unsplash.com/photo-1567604130959-7e02e53de01f?w=800', order: 1 },
      { storyId: story.id, title: 'Temple Corridors', description: 'The longest corridor in any Hindu temple.', imageUrl: 'https://images.unsplash.com/photo-1585468274952-66591eb14165?w=800', order: 2 },
      { storyId: story.id, title: 'Fishermen at Dusk', description: 'Boats returning with the evening light.', imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', order: 3 },
      { storyId: story.id, title: 'Night Reflections', description: 'Sitting by the shore with nothing to do.', imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800', order: 4 },
    ],
  })

  await prisma.routeStop.createMany({
    data: [
      { storyId: story.id, name: 'Pamban Bridge', note: 'The gateway to the island', latitude: 9.2896, longitude: 79.2009, order: 0 },
      { storyId: story.id, name: 'Ramanathaswamy Temple', note: 'The most sacred site on the island', latitude: 9.2882, longitude: 79.3177, order: 1 },
      { storyId: story.id, name: 'Dhanushkodi', note: 'The ghost town at the tip of India', latitude: 9.1561, longitude: 79.4134, order: 2 },
    ],
  })

  await prisma.expense.createMany({
    data: [
      { storyId: story.id, title: 'Transport', amount: 1200 },
      { storyId: story.id, title: 'Accommodation', amount: 1500 },
      { storyId: story.id, title: 'Food', amount: 900 },
      { storyId: story.id, title: 'Temple & Entry Fees', amount: 600 },
    ],
  })

  await prisma.recommendation.createMany({
    data: [
      { storyId: story.id, name: 'Rameswaram Hotel Vasantha Bhavan', type: 'food', description: 'Best filter coffee and idli on the island. Arrives before 8am or it runs out.', priceRange: '₹50–150' },
      { storyId: story.id, name: 'Ramanathaswamy Temple', type: 'place', description: 'Walk the full corridor barefoot. Go at 5am to avoid crowds.', googleMapsUrl: 'https://maps.google.com/?q=Ramanathaswamy+Temple' },
      { storyId: story.id, name: 'Dhanushkodi Beach', type: 'place', description: 'The ghost town at the tip of the subcontinent. Rent a jeep from town.', googleMapsUrl: 'https://maps.google.com/?q=Dhanushkodi' },
    ],
  })

  await prisma.journeyStep.createMany({
    data: [
      { storyId: story.id, title: 'Cross Pamban Bridge', description: 'Arrive by the early morning train — the bridge crossing at sunrise is unforgettable.', time: '6:00 AM', order: 0 },
      { storyId: story.id, title: 'Temple darshan', description: 'Join the morning crowd at Ramanathaswamy. The corridor light at this hour is extraordinary.', time: '7:30 AM', order: 1 },
      { storyId: story.id, title: 'Drive to Dhanushkodi', description: 'Hire a jeep and drive to the ghost town. The road dissolves into sand.', time: '11:00 AM', order: 2 },
      { storyId: story.id, title: 'Sit with the sea', description: 'Where the Bay of Bengal meets the Indian Ocean. No agenda. Just sit.', time: '1:00 PM', order: 3 },
    ],
  })

  await prisma.photoMemory.createMany({
    data: [
      { storyId: story.id, imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800', caption: 'The fog rolling in off the Palk Strait at sunrise.', order: 0 },
      { storyId: story.id, imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', caption: 'Fresh fish being cleaned on the dock.', order: 1 },
      { storyId: story.id, imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', caption: 'A child watching the waves like a philosopher.', order: 2 },
    ],
  })

  console.log('✓ Seed complete — Trip + Story + all related data created')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())