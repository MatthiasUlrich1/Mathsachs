import { useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { BlockDragFrom } from './blockSlotPointer'
import { useBlockSlotPointer } from './useBlockSlotPointer'
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

/**
 * Formula / classify builder: drag or tap chips from a pool into slots.
 * Mobile: Pointer Events + ghost + tap-select then tap-frame
 * (HTML5 DnD is unreliable on iOS Safari).
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
  const used = new Set(slots.filter((s): s is number => s !== null))
  const poolIndices = items.map((_, i) => i).filter((i) => !used.has(i))
  const opCount = worksheet?.opSlotCount ?? 0

  const placeInSlot = useCallback(
    (slotIdx: number, itemIdx: number, fromSlot?: number) => {
      const next = [...slots]
      const prev = next[slotIdx]
      if (fromSlot !== undefined) {
        next[fromSlot] = prev ?? null
      }
      next[slotIdx] = itemIdx
      onChange(next)
    },
    [slots, onChange],
  )

  const returnToPool = useCallback(
    (slotIdx: number) => {
      const next = [...slots]
      next[slotIdx] = null
      onChange(next)
    },
    [slots, onChange],
  )

  const onDropOnSlot = useCallback(
    (state: BlockDragFrom, slotIdx: number) => {
      if (state.from === 'pool') {
        placeInSlot(slotIdx, state.itemIdx)
      } else if (state.from === 'slot') {
        if (state.slotIdx === slotIdx) return
        const next = [...slots]
        const a = next[state.slotIdx] ?? null
        const b = next[slotIdx] ?? null
        next[state.slotIdx] = b
        next[slotIdx] = a
        onChange(next)
      }
    },
    [slots, onChange, placeInSlot],
  )

  const onDropOnPool = useCallback(
    (state: BlockDragFrom) => {
      if (state.from === 'slot') returnToPool(state.slotIdx)
    },
    [returnToPool],
  )

  const getLabel = useCallback(
    (state: BlockDragFrom) => {
      if (state.from === 'pool') return items[state.itemIdx]?.label ?? ''
      const itemIdx = slots[state.slotIdx]
      return itemIdx != null ? (items[itemIdx]?.label ?? '') : ''
    },
    [items, slots],
  )

  const {
    overSlot,
    overPool,
    ghost,
    status,
    beginPointer,
    onSlotActivate,
    setGhostNode,
    isSelected,
    isDragging,
  } = useBlockSlotPointer({
    slotAttr: 'data-slot-idx',
    poolAttr: 'data-drop-pool',
    getLabel,
    onDropOnSlot,
    onDropOnPool,
  })

  const renderSlot = (slotIdx: number, placeholder: string) => {
    const itemIdx = slots[slotIdx] ?? null
    const filled = itemIdx !== null
    const label = filled ? items[itemIdx]?.label : ''
    const slotState: BlockDragFrom = { from: 'slot', slotIdx }
    const selected = isSelected(slotState)
    const dragging = isDragging(slotState)
    return (
      <div
        key={`slot-${slotIdx}`}
        data-slot-idx={slotIdx}
        className={`drag-drop-slots__slot ${filled ? 'filled' : ''} ${
          overSlot === slotIdx ? 'drag-over' : ''
        } ${selected ? 'selected' : ''}`}
        onClick={() => onSlotActivate(slotIdx)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSlotActivate(slotIdx)
          }
        }}
        aria-label={
          filled
            ? `Platz ${slotIdx + 1}: ${label}`
            : `Leerer Platz ${slotIdx + 1}`
        }
      >
        {filled ? (
          <div
            className={`drag-drop-slots__chip in-slot ${
              dragging ? 'dragging' : ''
            } ${selected ? 'selected' : ''}`}
            onPointerDown={(e) => beginPointer(e, slotState)}
            title="Ziehen oder tippen, dann Rahmen wählen"
          >
            <span className="drag-drop-slots__handle" aria-hidden>
              ≡
            </span>
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
      {instruction && (
        <div className="drag-drop-slots__instruction">{instruction}</div>
      )}
      <p className="drag-drop-slots__hint">
        Ziehen oder tippen: Block wählen, dann Rahmen antippen.
      </p>

      <div
        className={`drag-drop-slots__pool ${overPool ? 'drag-over' : ''}`}
        data-drop-pool
        aria-label="Block-Vorrat"
      >
        {poolIndices.map((itemIdx) => {
          const state: BlockDragFrom = { from: 'pool', itemIdx }
          return (
            <div
              key={`pool-${itemIdx}`}
              className={`drag-drop-slots__chip ${
                isDragging(state) ? 'dragging' : ''
              } ${isSelected(state) ? 'selected' : ''}`}
              onPointerDown={(e) => beginPointer(e, state)}
            >
              <span className="drag-drop-slots__handle" aria-hidden>
                ≡
              </span>
              <span>{items[itemIdx]!.label}</span>
            </div>
          )
        })}
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
              {Array.from({ length: opCount }, (_, i) =>
                renderSlot(i, String(i + 1)),
              )}
            </div>
          </div>
          {worksheet.lineHint && (
            <p className="drag-drop-slots__line-hint">{worksheet.lineHint}</p>
          )}
          <div
            className="drag-drop-slots__slots"
            aria-label="Umgestellte Gleichung"
          >
            {Array.from(
              { length: Math.max(0, slots.length - opCount) },
              (_, i) => renderSlot(opCount + i, String(opCount + i + 1)),
            )}
          </div>
        </div>
      ) : slotLabels && slotLabels.length > 0 ? (
        <div
          className="drag-drop-slots__match"
          aria-label="Zuordnung Begriff → Erklärung"
        >
          {slots.map((_, slotIdx) => (
            <div key={`match-${slotIdx}`} className="drag-drop-slots__match-row">
              <div className="drag-drop-slots__match-term">
                {slotLabels[slotIdx]?.trim() || `Gruppe ${slotIdx + 1}`}
              </div>
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
          <label
            className="drag-drop-slots__result-label"
            htmlFor="eq-term-result"
          >
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

      {status && <p className="drag-drop-slots__status">{status}</p>}

      {ghost &&
        createPortal(
          <div
            ref={setGhostNode}
            className="drag-drop-slots__ghost"
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
