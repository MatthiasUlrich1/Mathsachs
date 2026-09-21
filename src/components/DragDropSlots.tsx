import { useRef, useState } from 'react'
import './DragDropSlots.css'

export interface DragDropSlotsProps {
  /** All available blocks (including optional unused distractor). */
  items: Array<{ label: string; value: number }>
  /** Slot contents: item index or null if empty. */
  slots: Array<number | null>
  onChange: (slots: Array<number | null>) => void
  instruction?: string
}

type DragState =
  | { from: 'pool'; itemIdx: number }
  | { from: 'slot'; slotIdx: number }

/**
 * Formula builder: tap or drag chips from a pool into slots.
 * Tap fills the next empty slot; drag targets a specific slot.
 * Uses Pointer Events so touch (iOS) works — HTML5 DnD does not on Safari.
 */
export const DragDropSlots: React.FC<DragDropSlotsProps> = ({
  items,
  slots,
  onChange,
  instruction,
}) => {
  const [drag, setDrag] = useState<DragState | null>(null)
  const [overSlot, setOverSlot] = useState<number | null>(null)
  const [overPool, setOverPool] = useState(false)
  const dragRef = useRef<DragState | null>(null)
  const pointerOrigin = useRef<{ x: number; y: number } | null>(null)

  const used = new Set(slots.filter((s): s is number => s !== null))
  const poolIndices = items.map((_, i) => i).filter((i) => !used.has(i))

  const clearDrag = () => {
    dragRef.current = null
    pointerOrigin.current = null
    setDrag(null)
    setOverSlot(null)
    setOverPool(false)
  }

  const placeInSlot = (slotIdx: number, itemIdx: number, fromSlot?: number) => {
    const next = [...slots]
    const prev = next[slotIdx]
    if (fromSlot !== undefined) {
      next[fromSlot] = prev ?? null
    }
    next[slotIdx] = itemIdx
    onChange(next)
  }

  const fillNextEmpty = (itemIdx: number) => {
    const empty = slots.findIndex((s) => s === null)
    if (empty < 0) return
    placeInSlot(empty, itemIdx)
  }

  const returnToPool = (slotIdx: number) => {
    const next = [...slots]
    next[slotIdx] = null
    onChange(next)
  }

  const targetFromPoint = (
    clientX: number,
    clientY: number,
  ): { kind: 'slot'; idx: number } | { kind: 'pool' } | null => {
    const el = document.elementFromPoint(clientX, clientY)
    const slot = el?.closest('[data-slot-idx]') as HTMLElement | null
    if (slot) {
      const idx = Number(slot.dataset.slotIdx)
      if (Number.isFinite(idx)) return { kind: 'slot', idx }
    }
    if (el?.closest('[data-drop-pool]')) return { kind: 'pool' }
    return null
  }

  const beginDrag = (e: React.PointerEvent<HTMLElement>, state: DragState) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    pointerOrigin.current = { x: e.clientX, y: e.clientY }
    dragRef.current = state
    setDrag(state)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    const t = targetFromPoint(e.clientX, e.clientY)
    setOverSlot(t?.kind === 'slot' ? t.idx : null)
    setOverPool(t?.kind === 'pool')
  }

  const onPointerUp = (e: React.PointerEvent<HTMLElement>) => {
    const current = dragRef.current
    if (!current) return
    const origin = pointerOrigin.current
    const moved =
      origin != null &&
      (Math.abs(e.clientX - origin.x) > 8 || Math.abs(e.clientY - origin.y) > 8)
    const t = targetFromPoint(e.clientX, e.clientY)
    if (t?.kind === 'slot') {
      if (current.from === 'pool') {
        placeInSlot(t.idx, current.itemIdx)
      } else if (current.from === 'slot') {
        if (current.slotIdx !== t.idx) {
          const next = [...slots]
          const a = next[current.slotIdx] ?? null
          const b = next[t.idx] ?? null
          next[current.slotIdx] = b
          next[t.idx] = a
          onChange(next)
        }
      }
    } else if (t?.kind === 'pool' && current.from === 'slot') {
      returnToPool(current.slotIdx)
    } else if (!moved && current.from === 'pool') {
      // Tap chip → fill next empty slot (button-like)
      fillNextEmpty(current.itemIdx)
    }
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
    clearDrag()
  }

  return (
    <div className="drag-drop-slots">
      {instruction && <div className="drag-drop-slots__instruction">{instruction}</div>}

      <div
        className={`drag-drop-slots__pool ${overPool ? 'drag-over' : ''}`}
        data-drop-pool
        aria-label="Block-Vorrat"
      >
        {poolIndices.map((itemIdx) => (
          <div
            key={`pool-${itemIdx}`}
            className={`drag-drop-slots__chip ${
              drag?.from === 'pool' && drag.itemIdx === itemIdx ? 'dragging' : ''
            }`}
            onPointerDown={(e) => beginDrag(e, { from: 'pool', itemIdx })}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={clearDrag}
          >
            <span className="drag-drop-slots__handle">≡</span>
            <span>{items[itemIdx]!.label}</span>
          </div>
        ))}
        {poolIndices.length === 0 && (
          <span className="drag-drop-slots__pool-empty">Alle Blöcke gesetzt</span>
        )}
      </div>

      <div className="drag-drop-slots__slots" aria-label="Formelplätze">
        {slots.map((itemIdx, slotIdx) => {
          const filled = itemIdx !== null
          const label = filled ? items[itemIdx]?.label : ''
          return (
            <div
              key={`slot-${slotIdx}`}
              data-slot-idx={slotIdx}
              className={`drag-drop-slots__slot ${filled ? 'filled' : ''} ${
                overSlot === slotIdx ? 'drag-over' : ''
              }`}
            >
              {filled ? (
                <div
                  className={`drag-drop-slots__chip in-slot ${
                    drag?.from === 'slot' && drag.slotIdx === slotIdx ? 'dragging' : ''
                  }`}
                  onPointerDown={(e) => beginDrag(e, { from: 'slot', slotIdx })}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={clearDrag}
                  title="Ziehen oder tippen: zurück in den Vorrat"
                >
                  <span className="drag-drop-slots__handle">≡</span>
                  <span>{label}</span>
                  <button
                    type="button"
                    className="drag-drop-slots__clear"
                    aria-label="Zurück in den Vorrat"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation()
                      returnToPool(slotIdx)
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <span className="drag-drop-slots__placeholder">{slotIdx + 1}</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
