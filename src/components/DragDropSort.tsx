import { useRef, useState } from 'react'
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

/**
 * Reorder list via Pointer Events (mouse + touch).
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
  const draggedIdxRef = useRef<number | null>(null)

  const reorder = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0) return
    const newOrder = [...userOrder]
    const [removed] = newOrder.splice(from, 1)
    if (removed === undefined) return
    newOrder.splice(to, 0, removed)
    onChange(newOrder)
  }

  const orderIdxFromPoint = (clientX: number, clientY: number): number | null => {
    const el = document.elementFromPoint(clientX, clientY)
    const item = el?.closest('[data-sort-idx]') as HTMLElement | null
    if (!item) return null
    const idx = Number(item.dataset.sortIdx)
    return Number.isFinite(idx) ? idx : null
  }

  const clearDrag = () => {
    draggedIdxRef.current = null
    setDraggedIdx(null)
    setDragOverIdx(null)
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>, idx: number) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    draggedIdxRef.current = idx
    setDraggedIdx(idx)
    setDragOverIdx(idx)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggedIdxRef.current === null) return
    const over = orderIdxFromPoint(e.clientX, e.clientY)
    if (over !== null) setDragOverIdx(over)
  }

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const from = draggedIdxRef.current
    if (from === null) return
    const to = orderIdxFromPoint(e.clientX, e.clientY)
    if (to !== null) reorder(from, to)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
    clearDrag()
  }

  const moveBy = (orderIdx: number, delta: number) => {
    const to = orderIdx + delta
    if (to < 0 || to >= userOrder.length) return
    reorder(orderIdx, to)
  }

  return (
    <div className="drag-drop-sort">
      {instruction && <div className="drag-drop-instruction">{instruction}</div>}
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
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={clearDrag}
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
    </div>
  )
}
