import { ChefHat } from 'lucide-react'

export function ThinkingIndicator() {
  return (
    <div className="flex flex-col gap-1 px-4 py-2">
      <span className="ml-11 text-xs text-muted-foreground/50">Chef IA</span>
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ChefHat className="size-4" />
        </div>
        <div className="flex items-center gap-3 rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-2 rounded-full bg-muted-foreground/40 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground/60">Preparando tu receta…</span>
        </div>
      </div>
    </div>
  )
}
