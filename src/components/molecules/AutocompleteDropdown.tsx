import { cn } from '@/lib/utils'

type AutocompleteDropdownProps = {
  suggestions: string[]
  activeIndex: number
  query: string
  onSelect: (value: string) => void
}

export function AutocompleteDropdown({
  suggestions,
  activeIndex,
  query,
  onSelect,
}: AutocompleteDropdownProps) {
  if (suggestions.length === 0) return null

  return (
    <ul
      role="listbox"
      className="absolute bottom-full left-0 right-0 z-50 mb-1.5 overflow-hidden rounded-xl border bg-popover shadow-lg"
    >
      {suggestions.map((s, i) => (
        <li
          key={s}
          role="option"
          aria-selected={i === activeIndex}
          onMouseDown={(e) => {
            e.preventDefault()
            onSelect(s)
          }}
          className={cn(
            'flex cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors',
            i === activeIndex
              ? 'bg-primary/10 text-primary'
              : 'text-foreground hover:bg-muted'
          )}
        >
          <span className="text-muted-foreground">🥕</span>
          <span>
            <HighlightMatch text={s} query={query} />
          </span>
        </li>
      ))}
    </ul>
  )
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const q = query.trim().toLowerCase()
  const idx = text.toLowerCase().indexOf(q)
  if (idx === -1) return <>{text}</>

  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-semibold text-primary">{text.slice(idx, idx + q.length)}</strong>
      {text.slice(idx + q.length)}
    </>
  )
}
