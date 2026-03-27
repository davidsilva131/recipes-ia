import { useEffect, useRef } from 'react'
import { Sparkles } from 'lucide-react'
import { ChatBubble } from '@/components/molecules/ChatBubble'
import { ThinkingIndicator } from '@/components/molecules/ThinkingIndicator'
import { RecipeDisplay } from '@/components/organisms/RecipeDisplay'
import { useChatStore } from '@/stores/chatStore'

const SUGGESTIONS = [
  {
    emoji: '🍗',
    label: 'Tengo ingredientes en casa',
    query: 'Tengo pollo, arroz y tomate. ¿Qué receta me recomiendas?',
  },
  {
    emoji: '🛒',
    label: 'No sé qué comprar',
    query: 'Quiero hacer una receta sencilla y económica. Aún no tengo los ingredientes, dime qué comprar.',
  },
  {
    emoji: '⚡',
    label: 'Cena rápida para hoy',
    query: 'Necesito una cena lista en menos de 20 minutos con cosas que suele haber en casa.',
  },
  {
    emoji: '🌱',
    label: 'Quiero comer más sano',
    query: 'Dame una receta vegana, sabrosa y nutritiva para almorzar esta semana.',
  },
]

type ChatMessagesProps = {
  onSuggestionClick: (query: string) => void
}

export function ChatMessages({ onSuggestionClick }: ChatMessagesProps) {
  const { messages, isThinking } = useChatStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  if (messages.length === 0) {
    return <WelcomeScreen onSuggestionClick={onSuggestionClick} />
  }

  return (
    <div className="mx-auto max-w-3xl flex flex-col py-4">
      {messages.map((msg) => (
        <ChatBubble key={msg.id} role={msg.role}>
          {msg.role === 'user' ? msg.content : <RecipeDisplay recipe={msg.content} />}
        </ChatBubble>
      ))}
      {isThinking && <ThinkingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}

function WelcomeScreen({ onSuggestionClick }: { onSuggestionClick: (q: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-10 px-4 py-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <Sparkles className="size-8" />
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-emerald-500">
            <span className="size-2 rounded-full bg-white" />
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl font-semibold tracking-tight">Tu chef personal con IA</h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Cuéntame lo que tienes, lo que quieres o lo que necesitas comprar.
            <br />Sin restricciones — escríbeme como si fuera una conversación.
          </p>
        </div>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.query}
            onClick={() => onSuggestionClick(s.query)}
            className="group flex flex-col items-start gap-1.5 rounded-2xl border bg-card px-4 py-4 text-left transition-all hover:border-primary/30 hover:bg-accent hover:shadow-sm"
          >
            <span className="text-base">{s.emoji}</span>
            <span className="text-sm font-medium text-foreground">{s.label}</span>
            <span className="text-xs text-muted-foreground line-clamp-2">{s.query}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
