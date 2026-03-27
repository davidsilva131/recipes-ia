import { useCallback, useState } from 'react'
import { generateText } from 'ai'
import { groq, DEFAULT_MODEL } from '@/lib/ai/client'
import { aiRecipeSchema } from '@/lib/ai/schemas'
import { SYSTEM_PROMPT, buildRecipePrompt } from '@/lib/ai/prompts'
import { sanitizeMessage } from '@/lib/ai/sanitize'
import { useChatStore } from '@/stores/chatStore'
import type { ChatMessage, Filter } from '@/lib/types/chat'

/** Convert the chat history to CoreMessage format for the AI SDK */
function buildMessages(history: ChatMessage[], currentMessage: string, filters: Filter[]) {
  const past = history.slice(0, -1) // exclude the message just added to store
  const coreMessages = past.map((msg) => ({
    role: msg.role as 'user' | 'assistant',
    content:
      msg.role === 'user'
        ? msg.content
        : JSON.stringify(msg.content).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' '),
  }))
  coreMessages.push({ role: 'user', content: buildRecipePrompt(currentMessage, filters) })
  return coreMessages
}

export function useRecipeGenerator() {
  const [error, setError] = useState<string | null>(null)
  const { addMessage, setIsThinking, messages } = useChatStore()

  const generate = useCallback(
    async (rawMessage: string, filters: Filter[]) => {
      const message = sanitizeMessage(rawMessage)
      if (!message) return

      setError(null)
      setIsThinking(true)

      try {
        const { text } = await generateText({
          model: groq(DEFAULT_MODEL),
          system: SYSTEM_PROMPT,
          messages: buildMessages(messages, message, filters),
        })

        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) throw new Error('La IA no devolvió una receta válida. Inténtalo de nuevo.')

        // Replace all literal control characters with a space — valid as both
        // JSON structural whitespace and inside string values
        const safeJson = jsonMatch[0].replace(/[\x00-\x1F\x7F]/g, ' ')

        const parsed = aiRecipeSchema.parse(JSON.parse(safeJson))

        addMessage({
          id: crypto.randomUUID(),
          role: 'assistant',
          content: { ...parsed, id: crypto.randomUUID() },
          timestamp: new Date(),
        })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error al conectar con la IA. Inténtalo de nuevo.'
        setError(message)
      } finally {
        setIsThinking(false)
      }
    },
    [addMessage, setIsThinking, messages]
  )

  return { generate, error, clearError: () => setError(null) }
}
