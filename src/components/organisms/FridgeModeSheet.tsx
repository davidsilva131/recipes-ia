import { useState } from 'react'
import { Refrigerator, X, Plus, Loader2, ChefHat } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useFridgeMode } from '@/hooks/useFridgeMode'
import { cn } from '@/lib/utils'

type FridgeModeSheetProps = {
  open: boolean
  onClose: () => void
}

export function FridgeModeSheet({ open, onClose }: FridgeModeSheetProps) {
  const [input, setInput] = useState('')
  const [ingredients, setIngredients] = useState<string[]>([])
  const { generateFromFridge, isGenerating, error, clearError } = useFridgeMode()

  function addIngredient() {
    const trimmed = input.trim()
    if (!trimmed || ingredients.includes(trimmed.toLowerCase())) return
    setIngredients((prev) => [...prev, trimmed.toLowerCase()])
    setInput('')
  }

  function removeIngredient(ing: string) {
    setIngredients((prev) => prev.filter((i) => i !== ing))
  }

  async function handleGenerate() {
    await generateFromFridge(ingredients)
    setIngredients([])
    setInput('')
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="mx-auto max-w-2xl rounded-t-2xl px-0 pb-0"
      >
        <SheetHeader className="flex flex-row items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Refrigerator className="size-4" />
            </div>
            <div>
              <SheetTitle className="text-sm font-semibold">Modo Nevera</SheetTitle>
              <p className="text-xs text-muted-foreground">¿Qué tienes disponible?</p>
            </div>
          </div>
          <SheetClose asChild>
            <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
              <X className="size-4" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-5 py-4">
          {/* Input row */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault()
                  addIngredient()
                }
              }}
              placeholder="Ej: pollo, arroz, tomate..."
              className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary/50"
            />
            <Button size="sm" variant="outline" onClick={addIngredient} disabled={!input.trim()}>
              <Plus className="size-4" />
            </Button>
          </div>

          {/* Tags */}
          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {ingredients.map((ing) => (
                <span
                  key={ing}
                  className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {ing}
                  <button
                    onClick={() => removeIngredient(ing)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20"
                  >
                    <X className="size-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}{' '}
              <button onClick={clearError} className="underline">
                Cerrar
              </button>
            </p>
          )}

          <div className="flex items-center gap-2 border-t pt-3">
            <p className="flex-1 text-xs text-muted-foreground">
              {ingredients.length === 0
                ? 'Añade al menos un ingrediente'
                : `${ingredients.length} ingrediente${ingredients.length > 1 ? 's' : ''} — la IA creará la mejor receta posible`}
            </p>
            <Button
              onClick={handleGenerate}
              disabled={ingredients.length === 0 || isGenerating}
              size="sm"
              className={cn('gap-2', isGenerating && 'opacity-80')}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Cocinando…
                </>
              ) : (
                <>
                  <ChefHat className="size-4" />
                  Generar receta
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
