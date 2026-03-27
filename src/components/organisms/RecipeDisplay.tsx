import { Bookmark, BookmarkCheck, Clock, Flame, Lightbulb, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/stores/chatStore'
import { cn } from '@/lib/utils'
import type { Recipe } from '@/lib/schemas/recipe'

const CATEGORY_LABELS: Record<Recipe['category'], string> = {
  desayuno: 'Desayuno',
  almuerzo: 'Almuerzo',
  cena: 'Cena',
  postre: 'Postre',
  snack: 'Snack',
}

type RecipeDisplayProps = { recipe: Recipe }

export function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  const favorites = useChatStore((s) => s.favorites)
  const { addFavorite, removeFavorite } = useChatStore()
  const saved = favorites.some((r) => r.id === recipe.id)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold leading-tight">{recipe.title}</h3>
          {recipe.description && (
            <p className="text-sm text-muted-foreground">{recipe.description}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => (saved ? removeFavorite(recipe.id) : addFavorite(recipe))}
          className={cn('shrink-0', saved && 'text-amber-500')}
          title={saved ? 'Quitar de favoritos' : 'Guardar receta'}
        >
          {saved ? <BookmarkCheck /> : <Bookmark />}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <MetaBadge icon={<Clock className="size-3.5" />} label={`${recipe.prepTime} min`} />
        <MetaBadge icon={<Users className="size-3.5" />} label={`${recipe.servings} personas`} />
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          {CATEGORY_LABELS[recipe.category]}
        </span>
        {recipe.difficulty && <DifficultyBadge level={recipe.difficulty} />}
        {recipe.calories && (
          <MetaBadge icon={<Flame className="size-3.5" />} label={`${recipe.calories} kcal`} />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <SectionTitle>Ingredientes</SectionTitle>
        <ul className="flex flex-col gap-1.5">
          {recipe.ingredients.map((ing, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm">
              <span className="size-1.5 shrink-0 rounded-full bg-primary" />
              {ing}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <SectionTitle>Pasos</SectionTitle>
        <ol className="flex flex-col gap-3">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {recipe.tips && recipe.tips.length > 0 && (
        <div className="flex flex-col gap-2 rounded-xl bg-amber-500/5 p-4">
          <SectionTitle>
            <span className="flex items-center gap-1.5">
              <Lightbulb className="size-3" />
              Consejos del chef
            </span>
          </SectionTitle>
          <ul className="flex flex-col gap-2">
            {recipe.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-0.5 shrink-0 text-amber-500">✦</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h4>
  )
}

function MetaBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
      {icon}
      {label}
    </div>
  )
}

const DIFFICULTY_STYLES: Record<string, string> = {
  'fácil': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  'media': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  'difícil': 'bg-red-500/10 text-red-600 dark:text-red-400',
}

function DifficultyBadge({ level }: { level: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${DIFFICULTY_STYLES[level] ?? ''}`}
    >
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  )
}
