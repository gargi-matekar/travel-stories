// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean up existing data
  await prisma.expense.deleteMany()
  await prisma.moodEntry.deleteMany()
  await prisma.story.deleteMany()

  await prisma.story.create({
    data: {
      title: "Lost in Lisbon",
      slug: "lost-in-lisbon",
      city: "Lisbon",
      country: "Portugal",
      coverImage: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80",
      questionAsked: "Why are you always rushing?",
      songName: "Estranha Forma de Vida – Amália Rodrigues",
      songEmbedUrl: "https://open.spotify.com/embed/track/0OcfGCQsq9pYDfCcOIUwHC?utm_source=generator&theme=0",
      latitude: 38.7169,
      longitude: -9.1395,
      totalCost: 847.50,
      content: `## Arriving at the Edge of the World

Lisbon doesn't greet you. It waits.

I arrived on a Tuesday with a backpack too heavy for my shoulders and a heart too heavy for my chest. The city was golden at 6pm — the kind of gold that makes you feel like you've stepped into a memory you haven't made yet.

## The Alfama Quarter

The old city climbs upward with a stubborn grace. Narrow alleyways, laundry strung between windows, the faint wail of fado drifting from somewhere you'll never quite find. An elderly man sat in a doorway watching me with patient eyes, as if he knew something I didn't.

He probably did.

## The Miradouros

Lisbon's viewpoints are altars for the tired. I sat at Miradouro da Graça with a glass of Sagres and watched the Tagus turn copper. The city sprawled below me like a half-told story.

I pulled out my notebook, intending to write. But for the first time in years, I just sat.

## The Question

On Day 3, somewhere between a pastel de nata and a tram ride to Belém, the city asked me something I couldn't ignore. Not in words, exactly. In the way time moved here — slower, heavier, more honest.

*Why are you always rushing?*

I didn't have an answer. I'm not sure I was supposed to.

## Leaving

When I left on Sunday morning, the city was already forgetting me. But I wasn't forgetting it.

Lisbon does that. It lets you go without making it easy.`,
      moodEntries: {
        create: [
          { day: 1, mood: "Disoriented", note: "Jet lag and wonder in equal parts" },
          { day: 2, mood: "Curious", note: "Got lost in Alfama for 3 hours. Found a bookshop." },
          { day: 3, mood: "Melancholic", note: "The fado hit different in the evening" },
          { day: 4, mood: "Reflective", note: "That question wouldn't leave me alone" },
          { day: 5, mood: "Peaceful", note: "Finally stopped taking photos. Just looked." },
        ]
      },
      expenses: {
        create: [
          { title: "Flights (round trip)", amount: 320.00 },
          { title: "Accommodation (4 nights)", amount: 280.00 },
          { title: "Food & Coffee", amount: 142.50 },
          { title: "Transport & Tram passes", amount: 45.00 },
          { title: "Museums & Attractions", amount: 35.00 },
          { title: "Souvenirs & Books", amount: 25.00 },
        ]
      }
    }
  })

  await prisma.story.create({
    data: {
      title: "Tokyo After Midnight",
      slug: "tokyo-after-midnight",
      city: "Tokyo",
      country: "Japan",
      coverImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
      questionAsked: "What would you do if no one was watching?",
      songName: "Midnight Rain – Taylor Swift",
      songEmbedUrl: "https://open.spotify.com/embed/track/4HBZA5flZLE435QTztThqH?utm_source=generator&theme=0",
      latitude: 35.6762,
      longitude: 139.6503,
      totalCost: 1420.00,
      content: `## The City That Doesn't Sleep (But Never Seems Tired)

Tokyo has no center. Or rather, it has too many.

I arrived at Narita at 2am, slid through immigration with the mechanical efficiency the city demands, and took the Narita Express into a darkness punctuated by neon and light-rail precision.

## Shinjuku at 3am

The sleepless district. I walked because I couldn't stop walking. Every alley offered a new universe — a tiny bar for six people, a ramen shop with a plastic curtain and a cook who'd clearly been at it for decades, a crane machine arcade loud with nobody in it.

## The Politeness of Everything

What strikes you in Tokyo is how the city accommodates you without ever quite acknowledging you. The systems are flawless. The people are present and absent simultaneously.

On Day 2, a woman helped me decode a vending machine for fifteen minutes. We never exchanged names. She bowed. I bowed. She was gone.

## What the City Asked

In a park in Yanaka — the old neighborhood that escaped the bombs and the developers — I sat on a bench as cherry blossoms (slightly past peak) drifted down. A child ran by chasing a pigeon. Nobody was watching.

I laughed. Alone. For no reason.

*What would you do if no one was watching?*

More of that. Definitely more of that.`,
      moodEntries: {
        create: [
          { day: 1, mood: "Overwhelmed", note: "Sensory overload. Beautiful chaos." },
          { day: 2, mood: "Fascinated", note: "The vending machines alone deserve a documentary" },
          { day: 3, mood: "Solitary", note: "Crowds everywhere. Felt alone. Not unpleasantly." },
          { day: 4, mood: "Joyful", note: "The park. The blossom. The laugh." },
          { day: 5, mood: "Reluctant", note: "Not ready to leave. Never ready." },
        ]
      },
      expenses: {
        create: [
          { title: "Flights (round trip)", amount: 780.00 },
          { title: "Accommodation (5 nights)", amount: 350.00 },
          { title: "Food & Ramen", amount: 180.00 },
          { title: "JR Pass & Metro", amount: 65.00 },
          { title: "Museums & Temples", amount: 45.00 },
        ]
      }
    }
  })

  console.log('✅ Seed complete. Two stories created.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
