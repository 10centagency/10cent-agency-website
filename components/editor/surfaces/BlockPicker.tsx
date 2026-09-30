import { useEffect, useMemo, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { CATEGORIES, type BlockCategoryId, type InserterItem } from '../types'
import { searchBlocks } from '../registry'
import { cx } from '../blocks/helpers'

interface BlockPickerProps {
  onPick: (item: InserterItem) => void
  onClose: () => void
  /** compact = slash-menu/plus-button style list */
  compact?: boolean
}

export default function BlockPicker({ onPick, onClose, compact = false }: BlockPickerProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<BlockCategoryId | 'all'>('all')
  const [active, setActive] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const items = useMemo(() => {
    const searched = searchBlocks(query)
    if (category === 'all') return searched
    return searched.filter((i) => i.category === category)
  }, [query, category])

  useEffect(() => setActive(0), [query, category])

  /* click outside → close */
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [onClose])

  /* active item → scroll into view */
  useEffect(() => {
    itemRefs.current[active]?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const pick = (item: InserterItem) => onPick(item)

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (items.length ? (a + 1) % items.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (items.length ? (a - 1 + items.length) % items.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (items[active]) pick(items[active])
    }
  }

  return (
    <div
      ref={wrapRef}
      onKeyDown={onKeyDown}
      className={cx(
        'w-[340px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-panel',
        compact && 'w-[300px]',
      )}
    >
      {/* Search */}
      <div className="border-b border-slate-100 p-2">
        <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-2.5 py-2">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blocks…"
            className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1 border-b border-slate-100 px-2 py-2">
        {[{ id: 'all' as const, label: 'All' }, ...CATEGORIES].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id as BlockCategoryId | 'all')}
            className={cx(
              'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              category === cat.id ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className={cx('overflow-y-auto p-2', compact ? 'max-h-[260px]' : 'max-h-[340px]')}>
        {items.length === 0 ? (
          <p className="px-2 py-8 text-center text-sm text-slate-400">No blocks match “{query}”</p>
        ) : compact ? (
          <div className="space-y-0.5">
            {items.map((item, i) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[i] = el
                  }}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => pick(item)}
                  className={cx(
                    'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors',
                    active === i ? 'bg-brand-blue/10' : 'hover:bg-slate-50',
                  )}
                >
                  <Icon className={cx('h-4 w-4 shrink-0', active === i ? 'text-brand-blue' : 'text-slate-500')} />
                  <span className="text-sm font-medium text-slate-700">{item.title}</span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            {items.map((item, i) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[i] = el
                  }}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => pick(item)}
                  title={item.description}
                  className={cx(
                    'flex flex-col items-center gap-1.5 rounded-lg border px-1.5 py-3 transition-colors',
                    active === i
                      ? 'border-brand-blue bg-brand-blue/10'
                      : 'border-slate-200 hover:border-brand-blue/40 hover:bg-slate-50',
                  )}
                >
                  <Icon className={cx('h-5 w-5', active === i ? 'text-brand-blue' : 'text-slate-500')} />
                  <span className="line-clamp-2 text-center text-[10px] font-medium leading-tight text-slate-600">
                    {item.title}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 bg-slate-50 px-3 py-1.5 text-[10px] text-slate-400">
        ↑↓ navigate · ⏎ select · esc close
      </div>
    </div>
  )
}

