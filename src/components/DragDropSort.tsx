import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DRAG_MOVE_THRESHOLD_PX, SLOT_HIT_PADDING_PX } from './blockSlotPointer'
import './DragDropSort.css'

export interface DragDropSortProps {
  /** Items to sort (with label and value) */
  items: Array<{ label: string; value: number }>
  /** User's current ordering (indices in sorted order) */
  userOrder: number[]
  /** Callback when order changes */
  onChange: (newOrder: number[]) => void
  /** Optional instructions */
  instruction?: string
}

function orderIdxFromPoint(
  clientX: number,
  clientY: number,
  excludeEl?: Element | null,
): number | null {
  const stack =
    typeof document.elementsFromPoint === 'function'
      ? document.elementsFromPoint(clientX, clientY)
      : (() => {
          const one = document.elementFromPoint(clientX, clientY)
          return one ? [one] : []
        })()

  for (const el of stack) {
    if (excludeEl && (el === excludeEl || excludeEl.contains(el))) continue
    const item = el.closest('[data-sort-idx]') as HTMLElement | null
    if (!item) continue
    const idx = Number(item.dataset.sortIdx)
    if (Number.isFinite(idx)) return idx
  }

  const pad = SLOT_HIT_PADDING_PX
  let best: { idx: number; dist: number } | null = null
  for (const item of document.querySelectorAll<HTMLElement>('[data-sort-idx]')) {
    if (excludeEl && (item === excludeEl || excludeEl.contains(item))) continue
    const r = item.getBoundingClientRect()
    if (
      clientX < r.left - pad ||
      clientX > r.right + pad ||
      clientY < r.top - pad ||
      clientY > r.bottom + pad
    ) {
      continue
    }
    const cx = (r.left + r.right) / 2
    const cy = (r.top + r.bottom) / 2
    const dist = (clientX - cx) ** 2 + (clientY - cy) ** 2
    const idx = Number(item.dataset.sortIdx)
    if (Number.isFinite(idx) && (!best || dist < best.dist)) {
      best = { idx, dist }
    }
  }
  return best?.idx ?? null
}

/**
 * Reorder list via Pointer Events (mouse + touch).
 * Ghost + geometry hit-test; ▲/▼ buttons as reliable mobile fallback.
 * HTML5 Drag-and-Drop is unreliable on iOS Safari — do not use it here.
 */
export const DragDropSort: React.FC<DragDropSortProps> = ({
  items,
  userOrder,
  onChange,
  instruction,
}) => {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const [ghost, setGhost] = useState<{
    x: number
    y: number
    label: string
  } | null>(null)

  const activeRef = useRef<{
    pointerId: number
    from: number
    origin: { x: number; y: number }
    dragging: boolean
    sourceEl: HTMLElement | null
  } | null>(null)
  const detachRef = useRef<(() => void) | null>(null)
  const ghostElRef = useRef<HTMLElement | null>(null)

  const reorder = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0) return
    const newOrder = [...userOrder]
    const [removed] = newOrder.splice(from, 1)
    if (removed === undefined) return
    newOrder.splice(to, 0, removed)
    onChange(newOrder)
  }

  const clearDrag = () => {
    activeRef.current = null
    setDraggedIdx(null)
    setDragOverIdx(null)
    setGhost(null)
  }

  useEffect(
    () => () => {
      detachRef.current?.()
      detachRef.current = null
    },
    [],
  )

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>, idx: number) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    if (activeRef.current) return
    e.preventDefault()

    const label = items[userOrder[idx]!]?.label ?? ''
    activeRef.current = {
      pointerId: e.pointerId,
      from: idx,
      origin: { x: e.clientX, y: e.clientY },
      dragging: false,
      sourceEl: e.currentTarget,
    }

    const onMove = (ev: PointerEvent) => {
      const active = activeRef.current
      if (!active || ev.pointerId !== active.pointerId) return
      const moved =
        Math.abs(ev.clientX - active.origin.x) > DRAG_MOVE_THRESHOLD_PX ||
        Math.abs(ev.clientY - active.origin.y) > DRAG_MOVE_THRESHOLD_PX
      if (!active.dragging && moved) {
        active.dragging = true
        setDraggedIdx(active.from)
        setGhost({ x: ev.clientX, y: ev.clientY, label })
      }
      if (!active.dragging) return
      ev.preventDefault()
      setGhost({ x: ev.clientX, y: ev.clientY, label })
      const over = orderIdxFromPoint(
        ev.clientX,
        ev.clientY,
        ghostElRef.current,
      )
      if (over !== null) setDragOverIdx(over)
    }

    const onUp = (ev: PointerEvent) => {
      const active = activeRef.current
      if (!active || ev.pointerId !== active.pointerId) return
      const from = active.from
      const wasDragging = active.dragging
      detachRef.current?.()
      detachRef.current = null
      clearDrag()
      if (!wasDragging) return
      const to = orderIdxFromPoint(ev.clientX, ev.clientY, ghostElRef.current)
      if (to !== null) reorder(from, to)
    }

    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    detachRef.current = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }

  const moveBy = (orderIdx: number, delta: number) => {
    const to = orderIdx + delta
    if (to < 0 || to >= userOrder.length) return
    reorder(orderIdx, to)
  }

  return (
    <div className="drag-drop-sort">
      {instruction && <div className="drag-drop-instruction">{instruction}</div>}
      <p className="drag-drop-sort__hint">
        Ziehen zum Sortieren — oder ▲/▼ tippen.
      </p>
      <div className="drag-drop-container">
        {userOrder.map((itemIdx, orderIdx) => {
          const item = items[itemIdx]
          if (!item) return null
          const isDragging = draggedIdx === orderIdx
          const isDragOver = dragOverIdx === orderIdx && draggedIdx !== orderIdx
          return (
            <div
              key={`${itemIdx}-${orderIdx}`}
              data-sort-idx={orderIdx}
              onPointerDown={(e) => onPointerDown(e, orderIdx)}
              className={`drag-drop-item ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
              role="listitem"
              aria-grabbed={isDragging}
            >
              <span className="drag-handle" aria-hidden>
                ≡
              </span>
              <span className="drag-item-label">{item.label}</span>
              <span className="drag-reorder-btns">
                <button
                  type="button"
                  className="drag-reorder-btn"
                  aria-label="Nach oben"
                  disabled={orderIdx === 0}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation()
                    moveBy(orderIdx, -1)
                  }}
                >
                  ▲
                </button>
                <button
                  type="button"
                  className="drag-reorder-btn"
                  aria-label="Nach unten"
                  disabled={orderIdx === userOrder.length - 1}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation()
                    moveBy(orderIdx, 1)
                  }}
                >
                  ▼
                </button>
              </span>
            </div>
          )
        })}
      </div>

      {ghost &&
        createPortal(
          <div
            ref={(el) => {
              ghostElRef.current = el
            }}
            className="drag-drop-sort__ghost"
            style={{ left: ghost.x, top: ghost.y }}
            aria-hidden
          >
            {ghost.label}
          </div>,
          document.body,
        )}
    </div>
  )
}
