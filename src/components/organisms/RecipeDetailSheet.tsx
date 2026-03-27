import { useState, useMemo, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { RecipeDisplay } from '@/components/organisms/RecipeDisplay'
import { Button } from '@/components/ui/button'
import { Copy, Check, X, Minus, Plus, Share2, ShoppingCart, StickyNote } from 'lucide-react'
import { useChatStore } from '@/stores/chatStore'
import type { Recipe } from '@/lib/schemas/recipe'

type RecipeDetailSheetProps = {
  recipe: Recipe | null
  open: boolean
  onClose: () => void
}

export function RecipeDetailSheet({ recipe, open, onClose }: RecipeDetailSheetProps) {
  const [copied, setCopied] = useState(false)
  const [shoppingCopied, setShoppingCopied] = useState(false)
  const [targetServings, setTargetServings] = useState(recipe?.servings ?? 2)

  const recipeNotes = useChatStore((s) => s.recipeNotes)
  const updateRecipeNote = useChatStore((s) => s.updateRecipeNote)
  const currentNote = recipe ? (recipeNotes[recipe.id] ?? '') : ''
  const [noteValue, setNoteValue] = useState(currentNote)

  useEffect(() => {
    setNoteValue(recipe ? (recipeNotes[recipe.id] ?? '') : '')
  }, [recipe?.id, recipeNotes])

  useEffect(() => {
    setTargetServings(recipe?.servings ?? 2)
  }, [recipe?.id])

  const scaledRecipe = useMemo(() => {
    if (!recipe) return null
    const ratio = targetServings / recipe.servings
    if (ratio === 1) return recipe
    return {
      ...recipe,
      servings: targetServings,
      ingredients: recipe.ingredients.map((ing) => scaleIngredient(ing, ratio)),
    }
  }, [recipe, targetServings])

  function copyShoppingList() {
    if (!recipe) return
    const list = [
      `Lista de compra — ${recipe.title}`,
      '',
      ...recipe.ingredients.map((i) => `☐ ${i}`),
    ].join('\n')
    navigator.clipboard.writeText(list)
    setShoppingCopied(true)
    setTimeout(() => setShoppingCopied(false), 2000)
  }

  function copyRecipe() {
    if (!recipe) return
    const text = [
      recipe.title,
      '',
      'Ingredientes:',
      ...recipe.ingredients.map((i) => `• ${i}`),
      '',
      'Pasos:',
      ...recipe.steps.map((s, idx) => `${idx + 1}. ${s}`),
      ...(recipe.tips?.length ? ['', 'Consejos:', ...recipe.tips.map((t) => `✦ ${t}`)] : []),
    ].join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function shareRecipe() {
    if (!recipe) return
    const text = [
      recipe.title,
      '',
      'Ingredientes:',
      ...recipe.ingredients.map((i) => `• ${i}`),
      '',
      'Pasos:',
      ...recipe.steps.map((s, idx) => `${idx + 1}. ${s}`),
    ].join('\n')

    if (navigator.share) {
      await navigator.share({ title: recipe.title, text })
    } else {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md"
      >
        <SheetHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
          <SheetTitle className="text-base">Detalle de receta</SheetTitle>
          <div className="flex items-center gap-1">
            {recipe && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={copyRecipe}
                className="text-muted-foreground"
                title="Copiar receta"
              >
                {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
              </Button>
            )}
            {recipe && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={copyShoppingList}
                className="text-muted-foreground"
                title="Copiar lista de compra"
              >
                {shoppingCopied
                  ? <Check className="size-4 text-green-500" />
                  : <ShoppingCart className="size-4" />}
              </Button>
            )}
            {recipe && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={shareRecipe}
                className="text-muted-foreground"
                title="Compartir receta"
              >
                <Share2 className="size-4" />
              </Button>
            )}
            <SheetClose asChild>
              <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
                <X className="size-4" />
                <span className="sr-only">Cerrar</span>
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        {recipe && (
          <div className="flex items-center justify-between border-b bg-muted/30 px-5 py-2.5">
            <span className="text-xs font-medium text-muted-foreground">Porciones</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTargetServings((s) => Math.max(1, s - 1))}
                disabled={targetServings <= 1}
                className="flex size-6 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-40"
              >
                <Minus className="size-3" />
              </button>
              <span className="min-w-8 text-center text-sm font-semibold tabular-nums">
                {targetServings}
              </span>
              <button
                onClick={() => setTargetServings((s) => Math.min(20, s + 1))}
                disabled={targetServings >= 20}
                className="flex size-6 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-40"
              >
                <Plus className="size-3" />
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {scaledRecipe && <RecipeDisplay recipe={scaledRecipe} />}

          {recipe && (
            <div className="mt-5 flex flex-col gap-2 border-t pt-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <StickyNote className="size-3" />
                Mis notas
              </div>
              <textarea
                value={noteValue}
                onChange={(e) => setNoteValue(e.target.value)}
                onBlur={() => recipe && updateRecipeNote(recipe.id, noteValue)}
                placeholder="Añade tus notas personales sobre esta receta…"
                rows={3}
                className="w-full resize-none rounded-lg border bg-muted/30 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-primary/40"
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function scaleIngredient(ingredient: string, ratio: number): string {
  if (ratio === 1) return ingredient
  return ingredient.replace(/\d+(?:[.,]\d+)?/g, (match) => {
    const num = parseFloat(match.replace(',', '.'))
    const scaled = Math.round(num * ratio * 10) / 10
    return String(scaled).replace('.', ',')
  })
}
