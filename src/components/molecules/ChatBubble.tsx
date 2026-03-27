import { ChefHat } from 'lucide-react'
import { cn } from '@/lib/utils'

type ChatBubbleProps = {
  role: 'user' | 'assistant'
  children: React.ReactNode
}

export function ChatBubble({ role, children }: ChatBubbleProps) {
  const isUser = role === 'user'
  return (
    <div className={cn('flex flex-col gap-1 px-4 py-2 animate-in fade-in slide-in-from-bottom-2 duration-200', isUser && 'items-end')}>
      <span className={cn('text-xs text-muted-foreground/50', isUser ? 'mr-11' : 'ml-11')}>
        {isUser ? 'Tú' : 'Chef IA'}
      </span>
      <div className={cn('flex items-start gap-3', isUser && 'flex-row-reverse')}>
        <div
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
            isUser ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
          )}
        >
          {isUser ? '✦' : <ChefHat className="size-4" />}
        </div>
        <div
          className={cn(
            'rounded-2xl text-sm leading-relaxed',
            isUser
              ? 'max-w-[85%] rounded-tr-sm bg-primary px-4 py-3 text-primary-foreground sm:max-w-[70%]'
              : 'flex-1 rounded-tl-sm bg-muted px-5 py-4'
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
