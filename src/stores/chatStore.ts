import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatMessage, Filter } from '@/lib/types/chat'
import type { Recipe } from '@/lib/schemas/recipe'

type ChatStore = {
  messages: ChatMessage[]
  activeFilters: Filter[]
  favorites: Recipe[]
  isThinking: boolean
  addMessage: (msg: ChatMessage) => void
  toggleFilter: (filter: Filter) => void
  recipeNotes: Record<string, string>
  addFavorite: (recipe: Recipe) => void
  removeFavorite: (id: string) => void
  setIsThinking: (value: boolean) => void
  clearMessages: () => void
  updateRecipeNote: (id: string, note: string) => void
  clearFavorites: () => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      activeFilters: [],
      favorites: [],
      recipeNotes: {},
      isThinking: false,
      addMessage: (msg) =>
        set((s) => ({ messages: [...s.messages, msg] })),
      toggleFilter: (filter) =>
        set((s) => ({
          activeFilters: s.activeFilters.includes(filter)
            ? s.activeFilters.filter((f) => f !== filter)
            : [...s.activeFilters, filter],
        })),
      addFavorite: (recipe) =>
        set((s) => ({ favorites: [...s.favorites, recipe] })),
      removeFavorite: (id) =>
        set((s) => ({ favorites: s.favorites.filter((r) => r.id !== id) })),
      clearFavorites: () => set({ favorites: [] }),
      setIsThinking: (value) => set({ isThinking: value }),
      clearMessages: () => set({ messages: [] }),
      updateRecipeNote: (id, note) =>
        set((s) => ({ recipeNotes: { ...s.recipeNotes, [id]: note } })),
    }),
    {
      name: 'recetas-app',
      partialize: (s) => ({
        favorites: s.favorites,
        messages: s.messages,
        activeFilters: s.activeFilters,
        recipeNotes: s.recipeNotes,
      }),
    }
  )
)
