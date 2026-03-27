import { useMemo, useState } from 'react'
import { INGREDIENT_LIST } from '@/lib/data/ingredients'

const MAX_SUGGESTIONS = 6

export function useIngredientAutocomplete(query: string, excluded: string[]) {
  const [activeIndex, setActiveIndex] = useState(-1)

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    return INGREDIENT_LIST.filter(
      (ing) => ing.includes(q) && !excluded.includes(ing)
    ).slice(0, MAX_SUGGESTIONS)
  }, [query, excluded])

  // Reset index when suggestions list changes
  useMemo(() => setActiveIndex(-1), [suggestions])

  const navigateDown = () =>
    setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : i))

  const navigateUp = () => setActiveIndex((i) => (i > 0 ? i - 1 : -1))

  const getActive = () => (activeIndex >= 0 ? suggestions[activeIndex] : null)

  return { suggestions, activeIndex, navigateDown, navigateUp, getActive }
}
