import { useRef, useState } from 'react'
import './DragDropSlots.css'

export interface DragDropSlotsProps {
  /** All available blocks (including optional unused distractor). */
  items: Array<{ label: string; value: number }>
  /** Slot contents: item index or null if empty. */
  slots: Array<number | null>
  onChange: (slots: Array<number | null>) => void
  instruction?: string
  /**
   * When set (one label per slot), show a matching layout:
   * terms stacked on the left, drop slots on the right.
   */
  slotLabels?: string[]
  /**
   * Worksheet layout for equation rearrange:
   * given equation + `|` + first `opSlotCount` slots, then remaining slots as new line.
   */
  worksheet?: {
    given: string
    /** Number of leading slots used for the Äquivalenzumformung after `|`. */
    opSlotCount: number
    lineHint?: string
  }
  /** Optional numeric result entry (e.g. final x). */
  result?: {
    label: string
    value: string
    onChange: (value: string) => void
  }
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
  slotLabels,
  worksheet,
  result,
}) => {
  const [drag, setDrag] = useState<DragState | null>(null)
  const [overSlot, setOverSlot] = useState<number | null>(null)
  const [overPool, setOverPool] = useState(false)
  const dragRef = useRef<DragState | null>(null)
  const pointerOrigin = useRef<{ x: number; y: number } | null>(null)

  const used = new Set(slots.filter((s): s is number => s !== null))
  const poolIndices = items.map((_, i) => i).filter((i) => !used.has(i))
  const opCount = worksheet?.opSlotCount ?? 0

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
      fillNextEmpty(current.itemIdx)
    }
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
    clearDrag()
  }

  const renderSlot = (slotIdx: number, placeholder: string) => {
    const itemIdx = slots[slotIdx] ?? null
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
          <span className="drag-drop-slots__placeholder">{placeholder}</span>
        )}
      </div>
    )
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

      {worksheet ? (
        <div className="drag-drop-slots__worksheet" aria-label="Umformung">
          <div className="drag-drop-slots__eq-row">
            <span className="drag-drop-slots__given">{worksheet.given}</span>
            <span className="drag-drop-slots__bar" aria-hidden>
              |
            </span>
            <div className="drag-drop-slots__slots drag-drop-slots__slots--inline">
              {Array.from({ length: opCount }, (_, i) => renderSlot(i, String(i + 1)))}
            </div>
          </div>
          {worksheet.lineHint && (
            <p className="drag-drop-slots__line-hint">{worksheet.lineHint}</p>
          )}
          <div className="drag-drop-slots__slots" aria-label="Umgestellte Gleichung">
            {Array.from({ length: Math.max(0, slots.length - opCount) }, (_, i) =>
              renderSlot(opCount + i, String(opCount + i + 1)),
            )}
          </div>
        </div>
      ) : slotLabels && slotLabels.length === slots.length ? (
        <div className="drag-drop-slots__match" aria-label="Zuordnung Begriff → Erklärung">
          {slots.map((_, slotIdx) => (
            <div key={`match-${slotIdx}`} className="drag-drop-slots__match-row">
              <div className="drag-drop-slots__match-term">{slotLabels[slotIdx]}</div>
              {renderSlot(slotIdx, '→')}
            </div>
          ))}
        </div>
      ) : (
        <div className="drag-drop-slots__slots" aria-label="Formelplätze">
          {slots.map((_, slotIdx) => renderSlot(slotIdx, String(slotIdx + 1)))}
        </div>
      )}

      {result && (
        <div className="drag-drop-slots__result">
          <label className="drag-drop-slots__result-label" htmlFor="eq-term-result">
            {result.label}
          </label>
          <input
            id="eq-term-result"
            className="drag-drop-slots__result-input"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={result.value}
            onChange={(e) => result.onChange(e.target.value)}
            placeholder="?"
            aria-label="Ergebnis für x"
          />
        </div>
      )}
    </div>
  )
}
