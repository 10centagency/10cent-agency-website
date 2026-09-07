import { useCallback, useRef } from 'react'

interface ResizeHandleProps {
  side: 'left' | 'right'
  min: number
  max: number
  onResize: (next: number) => void
  onStart?: () => void
}

export default function ResizeHandle({ side, min, max, onResize, onStart }: ResizeHandleProps) {
  const start = useRef<{ x: number; w: number } | null>(null)

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!start.current) return
    const delta = e.clientX - start.current.x
    const next = side === 'left' ? start.current.w + delta : start.current.w - delta
    onResize(Math.min(max, Math.max(min, Math.round(next))))
  }, [side, min, max, onResize])

  const onMouseUp = useCallback(() => {
    start.current = null
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }, [onMouseMove])

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    onStart?.()
    const panelEl =
      side === 'left'
        ? (e.currentTarget.previousElementSibling as HTMLElement | null)
        : (e.currentTarget.nextElementSibling as HTMLElement | null)
    const w = panelEl?.getBoundingClientRect().width ?? min
    start.current = { x: e.clientX, w }
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div onMouseDown={onMouseDown} title="Drag to resize"
      className="relative z-20 w-2 shrink-0 cursor-col-resize bg-transparent transition-colors hover:bg-brand-blue/30 group">
      <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-8 w-[3px] rounded-full bg-slate-300 group-hover:bg-brand-blue" />
    </div>
  )
}
