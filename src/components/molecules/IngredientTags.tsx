import { X } from 'lucide-react'

type IngredientTagsProps = {
  tags: string[]
  onRemove: (tag: string) => void
}

export function IngredientTags({ tags, onRemove }: IngredientTagsProps) {
  if (tags.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5 px-3 pt-3">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
        >
          {tag}
          <button
            onClick={() => onRemove(tag)}
            className="rounded-full opacity-60 transition-opacity hover:opacity-100"
            aria-label={`Eliminar ${tag}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
    </div>
  )
}
