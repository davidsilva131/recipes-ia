import { cn } from '@/lib/utils'
import type { Filter } from '@/lib/types/chat'

const FILTER_CONFIG: Record<Filter, { label: string; icon: string }> = {
  vegan: { label: 'Vegano', icon: '🌱' },
  quick: { label: 'Rápido (<20 min)', icon: '⚡' },
  budget: { label: 'Económico', icon: '🪙' },
}

type FilterBadgeProps = {
  filter: Filter
  active: boolean
  onClick: () => void
}

export function FilterBadge({ filter, active, onClick }: FilterBadgeProps) {
  const { label, icon } = FILTER_CONFIG[filter]
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium',
        'transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
      )}
    >
      <span>{icon}</span>
      {label}
    </button>
  )
}
