// src/types/index.ts

export interface Expense {
  id: string
  title: string
  amount: number
  storyId: string
}

export interface JourneyStep {
  id: string
  storyId: string
  title: string
  description: string
  time?: string | null
  imageUrl?: string | null
  order: number
}

export interface RouteStop {
  id: string
  storyId: string
  name: string
  note?: string | null
  latitude: number
  longitude: number
  imageUrl?: string | null
  order: number
}

export interface Recommendation {
  id: string
  storyId: string
  name: string
  type: string
  description: string
  latitude?: number | null
  longitude?: number | null
  googleMapsUrl?: string | null
  priceRange?: string | null
}

export interface CityFrame {
  id: string
  storyId: string
  title: string
  description?: string | null
  imageUrl: string
  order: number
}

export interface PhotoMemory {
  id: string
  storyId: string
  imageUrl: string
  caption?: string | null
  order: number
}

export interface Trip {
  id: string
  title: string
  slug: string
  description?: string | null
  coverImage?: string | null
  createdAt: Date
  updatedAt: Date
  stories?: Story[]
}

export interface Story {
  id: string
  title: string
  slug: string
  city: string
  state?: string | null        // NEW
  country: string
  coverImage: string
  content: string
  questionAsked: string
  songName: string
  songEmbedUrl: string
  latitude: number
  longitude: number
  totalCost: number
  coordinates?: string | null       // NEW
  closingReflection?: string | null // NEW
  tripId?: string | null            // NEW
  createdAt: Date
  updatedAt: Date
  trip?: Trip | null                // NEW
  expenses: Expense[]
  journeySteps: JourneyStep[]
  routeStops: RouteStop[]
  recommendations: Recommendation[]
  cityFrames: CityFrame[]           // NEW
  photoMemories: PhotoMemory[]      // NEW
}

export interface StoryFormData {
  title: string
  slug: string
  city: string
  state?: string
  country: string
  coverImage: string
  content: string
  questionAsked: string
  songName: string
  songEmbedUrl: string
  latitude: number
  longitude: number
  totalCost: number
  coordinates?: string
  closingReflection?: string
  tripId?: string | null
  expenses: { title: string; amount: number }[]
}

export type StoryListItem = Pick<
  Story,
  'id' | 'title' | 'slug' | 'city' | 'state' | 'country' | 'coverImage' | 'totalCost' | 'songName' | 'createdAt'
>