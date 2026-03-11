// prisma/seed.ts
// Run: npx prisma db seed

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding...')

  // ── Clean slate ──────────────────────────────────────────
  await prisma.recommendation.deleteMany()
  await prisma.routeStop.deleteMany()
  await prisma.journeyStep.deleteMany()
  await prisma.expense.deleteMany()
  await prisma.story.deleteMany()

  // ── Story 1: Rameshwaram ─────────────────────────────────
  const rameshwaram = await prisma.story.create({
    data: {
      slug:         'at-the-edge-of-the-land',
      title:        'At the Edge of the Land',
      city:         'Rameshwaram',
      country:      'India',
      coverImage:   'https://images.unsplash.com/photo-1621607512214-68297480165e?w=1600&q=80',
      questionAsked: 'What would you leave behind if the sea asked you to?',
      songName:     'Thiruvasakam in Symphony',
      songEmbedUrl: 'https://open.spotify.com/embed/track/3n3Ppam7vgaVa1iaRUIOKE',
      latitude:     9.2876,
      longitude:    79.3129,
      totalCost:    4200,
      content: `
        <p>The train arrived before dawn, breathing steam into air that already smelled of jasmine and salt. Rameshwaram doesn't wait for you to settle in — it begins on you immediately.</p>
        <p>The Ramanathaswamy Temple corridor is 1,212 metres long. Walking it at 5 AM, drenched by the 22 sacred wells, I stopped trying to understand and started just moving. That's what ritual asks of you. Not comprehension. Motion.</p>
        <p>Dhanushkodi is the other country entirely — a ghost town erased by the 1964 cyclone, where the road narrows to a ribbon of sand and the Bay of Bengal and the Indian Ocean converge without ceremony. You stand at the tip of India and both seas are right there, distinct colours, a visible seam. I stayed until the sun dropped completely and the sky turned that particular shade of nothing that precedes stars.</p>
        <p>I came back to the mainland changed by something I can't name. That's the only review Rameshwaram needs.</p>
      `,
      expenses: {
        create: [
          { title: 'Train (Chennai → Rameshwaram, sleeper)', amount: 820 },
          { title: 'Guesthouse near temple (2 nights)',       amount: 1100 },
          { title: 'Food — thalis, chai, tender coconut',     amount: 680 },
          { title: 'Auto to Dhanushkodi and back',            amount: 400 },
          { title: 'Temple offerings & entry',                amount: 200 },
          { title: 'Pamban bridge boat ride',                 amount: 300 },
          { title: 'Train back (Rameshwaram → Chennai)',      amount: 700 },
        ],
      },
      journeySteps: {
        create: [
          {
            order: 0,
            title: 'Arrival by Night Train',
            time:  '4:30 AM',
            description:
              'Boarded the Rameswaram Express from Chennai Central at 9 PM. Woke to the sound of temple bells and a platform vendor selling filter coffee in tiny steel cups. The air had changed.',
          },
          {
            order: 1,
            title: 'The 22 Sacred Wells',
            time:  '6:00 AM',
            description:
              'Completed the ritual bath circuit inside Ramanathaswamy Temple. Each of the 22 theerthams is a different well, a different story. By well fourteen I had stopped shivering.',
          },
          {
            order: 2,
            title: 'The Long Corridor',
            time:  '9:00 AM',
            description:
              'Walked the entire 1,212-metre corridor of the temple at low foot-traffic hours. The granite columns absorb sound in a way that feels intentional. I walked it twice.',
          },
          {
            order: 3,
            title: 'Pamban Bridge',
            time:  '11:30 AM',
            description:
              'Watched the railway drawbridge open for a fishing vessel from the adjacent road bridge. The sea here is translucent green, shallow for hundreds of metres on both sides.',
          },
          {
            order: 4,
            title: 'Drive to Dhanushkodi',
            time:  '3:00 PM',
            description:
              'Hired an auto-rickshaw for the 18 km drive on a single road through the island tip. The driver said nothing the whole way. The landscape did all the talking.',
          },
          {
            order: 5,
            title: 'Where Two Seas Meet',
            time:  '5:00 PM',
            description:
              'Stood at the southernmost point where the Bay of Bengal meets the Indian Ocean. You can see the colour difference clearly — one darker, one green. The seam is real.',
          },
        ],
      },
      routeStops: {
        create: [
          {
            order: 0,
            name:      'Rameswaram Railway Station',
            note:      'Start here. Pre-dawn arrivals are worth it — the town has a different texture in the dark.',
            latitude:  9.2880,
            longitude: 79.3137,
          },
          {
            order: 1,
            name:      'Ramanathaswamy Temple',
            note:      'The longest temple corridor in India. Go before 8 AM. The 22 wells circuit takes about 90 minutes.',
            latitude:  9.2882,
            longitude: 79.3174,
          },
          {
            order: 2,
            name:      'Agnitheertham Beach',
            note:      'The sacred bathing ghat directly east of the temple. Sunrise here is quietly spectacular.',
            latitude:  9.2842,
            longitude: 79.3196,
          },
          {
            order: 3,
            name:      'Pamban Bridge Viewpoint',
            note:      'Road bridge with a view of the railway drawbridge. Wait for a vessel — it opens maybe twice a day.',
            latitude:  9.2851,
            longitude: 79.2127,
          },
          {
            order: 4,
            name:      'Dhanushkodi Ghost Town',
            note:      'Ruins of the town destroyed by the 1964 cyclone. Eerie, beautiful, worth every km of dusty road.',
            latitude:  9.2010,
            longitude: 79.3988,
          },
          {
            order: 5,
            name:      'Land\'s End — Confluence Point',
            note:      'The actual tip where both seas meet. Bring water. There\'s nothing to buy here and that\'s the point.',
            latitude:  9.1710,
            longitude: 79.4166,
          },
        ],
      },
      recommendations: {
        create: [
          {
            name:        'Hotel Saravana Bhavan (Near Bus Stand)',
            type:        'food',
            description: 'The freshest fish thali on the island, served on banana leaves. ₹80 gets you rice, three curries, a piece of seer fish, and papad. Lunch only.',
            googleMapsUrl: 'https://maps.google.com/?q=Hotel+Saravana+Bhavan+Rameswaram',
            priceRange:  '₹60–₹120',
            latitude:    9.2876,
            longitude:   9.3143,
          },
          {
            name:        'Ramanathaswamy Temple',
            type:        'place',
            description: 'Go twice — once at 5 AM for the wells circuit, once at sunset for the corridor when the light falls differently through the columns.',
            googleMapsUrl: 'https://maps.google.com/?q=Ramanathaswamy+Temple+Rameswaram',
            latitude:    9.2882,
            longitude:   79.3174,
          },
          {
            name:        'Gandamadana Parvatham',
            type:        'place',
            description: 'A small hillock with the only elevated view of the whole island. Takes 20 minutes to climb. The panorama tells you exactly how small the strip of land is.',
            googleMapsUrl: 'https://maps.google.com/?q=Gandamadana+Parvatham+Rameswaram',
            latitude:    9.3010,
            longitude:   79.3142,
          },
          {
            name:        'Sea Shell Market (Agnitheertham Road)',
            type:        'shopping',
            description: 'Fishermen spread out conch shells, dried sea horses, and coral on cloth by the beach road. Prices are negotiable. Buy the conch, skip the plastic souvenirs.',
            priceRange:  '₹20–₹600',
          },
          {
            name:        'Floating Stone Beach',
            type:        'place',
            description: 'The legend says Ram\'s army used stones that float. Some actually do. Bring one home, leave questions behind.',
            googleMapsUrl: 'https://maps.google.com/?q=Floating+Stone+Beach+Rameswaram',
            latitude:    9.2910,
            longitude:   79.3388,
          },
          {
            name:        'Rameswaram Mess (Near Temple West Gate)',
            type:        'food',
            description: 'No menu, no sign. One family serves breakfast from 6–9 AM: idli, coconut chutney, vada. Temple priests eat here. That\'s recommendation enough.',
            priceRange:  '₹30–₹50',
          },
        ],
      },
    },
  })

  // ── Story 2: Varanasi ────────────────────────────────────
  const varanasi = await prisma.story.create({
    data: {
      slug:         'burning-and-becoming',
      title:        'Burning and Becoming',
      city:         'Varanasi',
      country:      'India',
      coverImage:   'https://images.unsplash.com/photo-1561361058-c24e01238a46?w=1600&q=80',
      questionAsked: 'Have you made peace with the things you cannot keep?',
      songName:     'Raga Bhairav — Morning',
      songEmbedUrl: 'https://open.spotify.com/embed/track/1KDDtDQzYzBKCdQFjk3Oax',
      latitude:     25.3176,
      longitude:    82.9739,
      totalCost:    3800,
      content: `
        <p>Varanasi operates on a different clock. The ghats have been burning for at least 3,500 years without interruption, and the city knows this about itself and acts accordingly — unhurried, certain, occasionally bewildering.</p>
        <p>I arrived expecting philosophy and found logistics. Death here is a municipal operation. Bodies arrive wrapped in orange and gold, carried through streets too narrow for cars, held on shoulders by sons who are not allowed to cry. The smoke from Manikarnika is constant. You get used to it faster than you think you should.</p>
        <p>The Ganga Aarti at Dashashwamedh Ghat happens every evening at sunset. Seven priests, synchronized fire, bells, the river, 3,000 people who came for the same reason you did. I watched it four evenings and cried twice and I'm still not sure why.</p>
      `,
      expenses: {
        create: [
          { title: 'Train (Delhi → Varanasi)',          amount: 950 },
          { title: 'Guesthouse on the ghats (3 nights)', amount: 1800 },
          { title: 'Food & chai',                        amount: 600 },
          { title: 'Boat on the Ganga (sunrise)',         amount: 250 },
          { title: 'Rickshaws & auto',                   amount: 200 },
        ],
      },
      journeySteps: {
        create: [
          {
            order: 0,
            title: 'First Morning Walk',
            time:  '5:00 AM',
            description:
              'Walked from Assi Ghat to Manikarnika in silence. The ghats at dawn belong to laundry, yoga, priests, and the dying. Tourists come later. Go early.',
          },
          {
            order: 1,
            title: 'Sunrise Boat on the Ganga',
            time:  '6:00 AM',
            description:
              'Rowed slowly past all 88 ghats. The boatman pointed at things without naming them. The mist made the far bank invisible. We were floating in a city and nowhere at once.',
          },
          {
            order: 2,
            title: 'Manikarnika Ghat',
            time:  '10:00 AM',
            description:
              'Watched a cremation from a respectful distance. No photographs. The fire is not a spectacle — it\'s an argument that the body was never the point.',
          },
          {
            order: 3,
            title: 'Old City Lanes',
            time:  '2:00 PM',
            description:
              'Got lost in the lanes behind Vishwanath temple. Found a sari weaver, a pandit making paan, a school where children were learning Sanskrit. Got more lost. Stayed lost on purpose.',
          },
          {
            order: 4,
            title: 'Ganga Aarti at Dashashwamedh',
            time:  '6:00 PM',
            description:
              'Seven priests, synchronized fire, the river, 3,000 people. I watched it four evenings. It doesn\'t get smaller. It might be the most alive thing I\'ve ever seen.',
          },
        ],
      },
      routeStops: {
        create: [
          {
            order: 0,
            name:      'Assi Ghat',
            note:      'The southernmost ghat and the best place to begin. Locals do yoga here at dawn. The chai is strong.',
            latitude:  25.2992,
            longitude: 82.9880,
          },
          {
            order: 1,
            name:      'Dashashwamedh Ghat',
            note:      'The main ghat. Aarti every evening. Always crowded, always worth it.',
            latitude:  25.3069,
            longitude: 83.0107,
          },
          {
            order: 2,
            name:      'Manikarnika Ghat',
            note:      'The burning ghat. Approach with quiet. No cameras.',
            latitude:  25.3115,
            longitude: 83.0110,
          },
          {
            order: 3,
            name:      'Sarnath',
            note:      'Buddha gave his first sermon here. 10 km from the ghats. A completely different frequency.',
            latitude:  25.3811,
            longitude: 83.0242,
          },
        ],
      },
      recommendations: {
        create: [
          {
            name:        'Kashi Chat Bhandar',
            type:        'food',
            description: 'The tamatar chaat here has been made the same way since 1920. Queue is long, turnover is fast, cost is nothing.',
            googleMapsUrl: 'https://maps.google.com/?q=Kashi+Chat+Bhandar+Varanasi',
            priceRange:  '₹20–₹60',
            latitude:    25.3103,
            longitude:   82.9991,
          },
          {
            name:        'Banaras Silk Weavers (Madanpura)',
            type:        'shopping',
            description: 'Go to the weavers directly, not the showrooms. You\'ll pay half the price and see the actual craft. Ask to watch — most will let you.',
            googleMapsUrl: 'https://maps.google.com/?q=Madanpura+Weavers+Varanasi',
          },
          {
            name:        'Sarnath Deer Park',
            type:        'place',
            description: 'Where the Buddha taught his first five disciples. The Dhamek Stupa is 2nd century CE. The lawn is quiet and the museum houses some of the finest Gupta-era sculpture in India.',
            googleMapsUrl: 'https://maps.google.com/?q=Sarnath+Deer+Park+Varanasi',
            latitude:    25.3811,
            longitude:   83.0242,
          },
        ],
      },
    },
  })

  console.log(`✅ Created: ${rameshwaram.title} (${rameshwaram.slug})`)
  console.log(`✅ Created: ${varanasi.title} (${varanasi.slug})`)
  console.log('🌱 Seed complete.')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())