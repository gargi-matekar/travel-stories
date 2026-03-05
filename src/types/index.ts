// src/types/index.ts
export interface MoodEntry {
  id: string
  day: number
  mood: string
  note: string | null
  storyId: string
}

export interface Expense {
  id: string
  title: string
  amount: number
  storyId: string
}

export interface Story {
  id: string
  title: string
  slug: string
  city: string
  country: string
  coverImage: string
  content: string
  questionAsked: string
  songName: string
  songEmbedUrl: string
  latitude: number
  longitude: number
  totalCost: number
  createdAt: Date
  updatedAt: Date
  moodEntries: MoodEntry[]
  expenses: Expense[]
}

export type StoryListItem = Pick<Story, 'id' | 'title' | 'slug' | 'city' | 'country' | 'coverImage' | 'totalCost' | 'songName' | 'createdAt'> & {
  moodEntries: Pick<MoodEntry, 'mood'>[]
}

export interface StoryFormData {
  title: string
  slug: string
  city: string
  country: string
  coverImage: string
  content: string
  questionAsked: string
  songName: string
  songEmbedUrl: string
  latitude: number
  longitude: number
  totalCost: number
  moodEntries: { day: number; mood: string; note: string }[]
  expenses: { title: string; amount: number }[]
}
