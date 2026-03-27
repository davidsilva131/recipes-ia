import type { Recipe } from '@/lib/schemas/recipe'

export type Filter = 'vegan' | 'quick' | 'budget'

export type UserMessage = {
  id: string
  role: 'user'
  content: string
  timestamp: Date
}

export type AssistantMessage = {
  id: string
  role: 'assistant'
  content: Recipe
  timestamp: Date
}

export type ChatMessage = UserMessage | AssistantMessage
