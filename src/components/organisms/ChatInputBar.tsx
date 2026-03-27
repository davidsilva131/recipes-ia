import { useRef } from 'react'
import { AlertCircle, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FilterBadge } from '@/components/molecules/FilterBadge'
import { useChatStore } from '@/stores/chatStore'
import { useRecipeGenerator } from '@/hooks/useRecipeGenerator'
import { cn } from '@/lib/utils'
import type { Filter } from '@/lib/types/chat'

const FILTERS: Filter[] = ['vegan', 'quick', 'budget']
const MAX_LENGTH = 500

type ChatInputBarProps = {
  value: string
  onChange: (value: string) => void
}

export function ChatInputBar({ value, onChange }: ChatInputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { activeFilters, toggleFilter, addMessage, isThinking } = useChatStore()
  const { generate, error, clearError } = useRecipeGenerator()

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = async () => {
    const trimmed = value.trim()
    if (!trimmed || isThinking) return
    addMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    })
    onChange('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    await generate(trimmed, activeFilters)
  }

  const canSend = value.trim().length > 0 && !isThinking

  return (
    <div className="shrink-0 border-t bg-background/80 px-4 pb-5 pt-4 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl flex-col gap-2">
        {/* Input container with filters inside */}
        <div
          className={cn(
            'flex flex-col rounded-2xl border bg-card transition-all',
            'focus-within:border-transparent focus-within:ring-2 focus-within:ring-ring'
          )}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Escríbeme lo que necesitas… ingredientes, restricciones o lo que se te antoje."
            rows={2}
            maxLength={MAX_LENGTH}
            disabled={isThinking}
            className={cn(
              'w-full resize-none overflow-hidden bg-transparent px-4 pt-3.5 pb-2 text-sm leading-relaxed outline-none',
              'placeholder:text-muted-foreground/40 disabled:opacity-50',
            )}
          />
          {/* Footer: filters + send */}
          <div className="flex items-center justify-between gap-2 px-3 pb-2.5 pt-1">
            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((f) => (
                <FilterBadge
                  key={f}
                  filter={f}
                  active={activeFilters.includes(f)}
                  onClick={() => toggleFilter(f)}
                />
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className={cn(
                'hidden text-xs tabular-nums sm:block',
                value.length > MAX_LENGTH * 0.85 ? 'text-amber-500' : 'text-muted-foreground/30'
              )}>
                {value.length}/{MAX_LENGTH}
              </span>
              <Button size="icon-sm" onClick={handleSend} disabled={!canSend} className="rounded-xl">
                <ArrowUp className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            <AlertCircle className="size-3.5 shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={clearError} className="opacity-60 hover:opacity-100">✕</button>
          </div>
        )}
      </div>
    </div>
  )
}
