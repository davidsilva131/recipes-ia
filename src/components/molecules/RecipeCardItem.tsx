import { Clock, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Recipe } from '@/lib/schemas/recipe'

type RecipeCardItemProps = {
  recipe: Recipe
  onRemove: () => void
  onClick?: () => void
  className?: string
}

export function RecipeCardItem({ recipe, onRemove, onClick, className }: RecipeCardItemProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={cn(
        'group flex flex-col gap-1.5 rounded-lg border bg-background p-3',
        'transition-colors hover:border-primary/30',
        onClick && 'cursor-pointer select-none',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="line-clamp-2 text-sm font-medium leading-tight">{recipe.title}</p>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
        >
          <X />
        </Button>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="size-3" />
        <span>{recipe.prepTime} min · {recipe.servings} personas</span>
      </div>
    </div>
  )
}
