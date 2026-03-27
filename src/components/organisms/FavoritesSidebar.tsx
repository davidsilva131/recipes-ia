import { useState } from 'react'
import { BookOpen, ChefHat, Moon, Search, Sun, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RecipeCardItem } from '@/components/molecules/RecipeCardItem'
import { useChatStore } from '@/stores/chatStore'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'
import type { Recipe } from '@/lib/schemas/recipe'
import { RecipeDetailSheet } from './RecipeDetailSheet'

type FavoritesSidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export function FavoritesSidebar({ isOpen, onClose }: FavoritesSidebarProps) {
  const { favorites, removeFavorite, clearFavorites } = useChatStore()
  const { theme, toggle } = useTheme()
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [confirmClearAll, setConfirmClearAll] = useState(false)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Recipe['category'] | 'todas'>('todas')

  const CATEGORY_LABELS: Record<Recipe['category'], string> = {
    desayuno: 'Desayuno',
    almuerzo: 'Almuerzo',
    cena: 'Cena',
    postre: 'Postre',
    snack: 'Snack',
  }
  const availableCategories = (Object.keys(CATEGORY_LABELS) as Recipe['category'][]).filter(
    (cat) => favorites.some((r) => r.category === cat)
  )

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-card',
        // Mobile: fixed overlay that slides in/out
        'fixed inset-y-0 left-0 z-40 w-72 transition-transform duration-200',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        // Desktop: always visible as a static flex child
        'lg:static lg:w-60 lg:shrink-0 lg:translate-x-0'
      )}
    >
      <div className="flex items-center justify-between border-b px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ChefHat className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">RecetasIA</p>
            <p className="text-xs text-muted-foreground">Tu chef digital</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onClose}
          className="lg:hidden text-muted-foreground"
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <BookOpen className="size-3" />
          Favoritos ({favorites.length})
        </p>
        {favorites.length > 0 && (
          <button
            onClick={() => {
              if (!confirmClearAll) {
                setConfirmClearAll(true)
                setTimeout(() => setConfirmClearAll(false), 3000)
                return
              }
              clearFavorites()
              setConfirmClearAll(false)
            }}
            className={cn(
              'flex items-center gap-1 rounded px-1.5 py-0.5 text-xs transition-colors',
              confirmClearAll
                ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                : 'text-muted-foreground/60 hover:text-muted-foreground'
            )}
            title="Vaciar favoritos"
          >
            <Trash2 className="size-3" />
            {confirmClearAll ? '¿Vaciar?' : ''}
          </button>
        )}
      </div>

      {favorites.length > 0 && (
        <div className="relative px-3 pb-2">
          <Search className="absolute left-5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar receta…"
            className="w-full rounded-lg border bg-background py-1.5 pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary/50"
          />
        </div>
      )}

      {availableCategories.length > 1 && (
        <div className="flex flex-wrap gap-1.5 px-3 pb-2">
          <button
            onClick={() => setActiveCategory('todas')}
            className={cn(
              'rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
              activeCategory === 'todas'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            Todas
          </button>
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors capitalize',
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      )}

      <div className="scrollbar-thin flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 pb-3">
        {(() => {
          const filtered = favorites
            .filter((r) => activeCategory === 'todas' || r.category === activeCategory)
            .filter((r) => r.title.toLowerCase().includes(search.toLowerCase()))
          if (favorites.length === 0) return <EmptyFavorites />
          if (filtered.length === 0 && search !== '')
            return (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Sin resultados para «{search}»
              </p>
            )
          return filtered.map((r) => (
            <RecipeCardItem
              key={r.id}
              recipe={r}
              onRemove={() => removeFavorite(r.id)}
              onClick={() => setSelectedRecipe(r)}
            />
          ))
        })()}
      </div>

      <RecipeDetailSheet
        recipe={selectedRecipe}
        open={selectedRecipe !== null}
        onClose={() => setSelectedRecipe(null)}
      />

      <div className="border-t p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          className="w-full justify-start gap-2 text-muted-foreground"
        >
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        </Button>
      </div>
    </aside>
  )
}

function EmptyFavorites() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center">
      <p className="text-sm text-muted-foreground">Sin favoritos aún</p>
      <p className="text-xs text-muted-foreground/60">
        Guarda recetas con el ícono 🔖
      </p>
    </div>
  )
}
