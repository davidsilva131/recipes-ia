import { useState, useCallback } from 'react'
import { generateText } from 'ai'
import { groq, DEFAULT_MODEL } from '@/lib/ai/client'
import { aiRecipeSchema } from '@/lib/ai/schemas'
import { useChatStore } from '@/stores/chatStore'

const FRIDGE_SYSTEM_PROMPT = `Eres un chef experto en cocina de aprovechamiento. El usuario te dará una lista de ingredientes disponibles en su nevera/despensa. Tu misión es crear una receta deliciosa usando ÚNICAMENTE esos ingredientes (puedes asumir que tienen sal, pimienta, aceite y agua).

Reglas:
- NO sugieras ingredientes que no estén en la lista del usuario
- Si con los ingredientes no se puede hacer nada coherente, responde con una receta muy simple
- Responde SIEMPRE en español
- Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional

Estructura JSON exacta:
{
  "title": "string",
  "description": "string",
  "ingredients": ["string con cantidades"],
  "steps": ["string"],
  "category": "desayuno" | "almuerzo" | "cena" | "postre" | "snack",
  "prepTime": number,
  "servings": number,
  "difficulty": "fácil" | "media" | "difícil",
  "tips": ["string"]
}`

export function useFridgeMode() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const addMessage = useChatStore((s) => s.addMessage)

  const generateFromFridge = useCallback(async (ingredients: string[]) => {
    if (ingredients.length === 0) return
    setError(null)
    setIsGenerating(true)

    // Add user message to chat
    addMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content: `🧊 Modo Nevera — Tengo: ${ingredients.join(', ')}`,
      timestamp: new Date(),
    })

    try {
      const { text } = await generateText({
        model: groq(DEFAULT_MODEL),
        system: FRIDGE_SYSTEM_PROMPT,
        prompt: `Ingredientes disponibles: ${ingredients.join(', ')}. Crea la mejor receta posible con estos ingredientes.`,
      })

      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('La IA no devolvió una receta válida.')

      const safeJson = jsonMatch[0].replace(/[\x00-\x1F\x7F]/g, ' ')
      const parsed = aiRecipeSchema.parse(JSON.parse(safeJson))

      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: { ...parsed, id: crypto.randomUUID() },
        timestamp: new Date(),
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con la IA.'
      setError(msg)
    } finally {
      setIsGenerating(false)
    }
  }, [addMessage])

  return { generateFromFridge, isGenerating, error, clearError: () => setError(null) }
}
