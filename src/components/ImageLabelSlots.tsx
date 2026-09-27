import { useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { BlockDragFrom } from './blockSlotPointer'
import { useBlockSlotPointer } from './useBlockSlotPointer'
import './ImageLabelSlots.css'

export type ImageLabelSlot = {
  id: string
  /** Drop-field centre as % of image box. */
  x: number
  y: number
  /** Leader tip on the region as % of image box. */
  targetX: number
  targetY: number
}

export interface ImageLabelSlotsProps {
  imageSrc: string
  imageAlt?: string
  attribution: string
  /** Draw SVG leader lines (default true). Set false if the image already has them. */
  drawLeaders?: boolean
  items: Array<{ label: string }>
  slots: ImageLabelSlot[]
  /** Slot contents: item index or null. */
  value: Array<number | null>
  onChange: (slots: Array<number | null>) => void
  instruction?: string
  disabled?: boolean
  /** Per-slot correctness after check. */
  partResults?: boolean[]
}

/**
 * Image labeling: drag or tap answer chips into fixed drop fields.
 * Mobile: Pointer Events + ghost + tap-select then tap-frame.
 */
export const ImageLabelSlots: React.FC<ImageLabelSlotsProps> = ({
  imageSrc,
  imageAlt = '',
  attribution,
  drawLeaders = true,
  items,
  slots,
  value,
  onChange,
  instruction,
  disabled = false,
  partResults,
}) => {
  const used = new Set(value.filter((s): s is number => s !== null))
  const poolIndices = items.map((_, i) => i).filter((i) => !used.has(i))

  const placeInSlot = useCallback(
    (slotIdx: number, itemIdx: number, fromSlot?: number) => {
      if (disabled) return
      const next = [...value]
      const prev = next[slotIdx]
      if (fromSlot !== undefined) {
        next[fromSlot] = prev ?? null
      }
      next[slotIdx] = itemIdx
      onChange(next)
    },
    [disabled, value, onChange],
  )

  const returnToPool = useCallback(
    (slotIdx: number) => {
      if (disabled) return
      const next = [...value]
      next[slotIdx] = null
      onChange(next)
    },
    [disabled, value, onChange],
  )

  const onDropOnSlot = useCallback(
    (state: BlockDragFrom, slotIdx: number) => {
      if (disabled) return
      if (state.from === 'pool') {
        placeInSlot(slotIdx, state.itemIdx)
      } else if (state.from === 'slot' && state.slotIdx !== slotIdx) {
        const next = [...value]
        const a = next[state.slotIdx] ?? null
        const b = next[slotIdx] ?? null
        next[state.slotIdx] = b
        next[slotIdx] = a
        onChange(next)
      }
    },
    [disabled, value, onChange, placeInSlot],
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
      const itemIdx = value[state.slotIdx]
      return itemIdx != null ? (items[itemIdx]?.label ?? '') : ''
    },
    [items, value],
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
    slotAttr: 'data-ils-slot',
    poolAttr: 'data-ils-pool',
    disabled,
    getLabel,
    onDropOnSlot,
    onDropOnPool,
  })

  return (
    <div className="image-label-slots">
      {instruction && (
        <p className="image-label-slots__instruction">{instruction}</p>
      )}
      {!disabled && (
        <p className="image-label-slots__hint">
          Ziehen oder tippen: Block wählen, dann Feld antippen.
        </p>
      )}

      <figure className="image-label-slots__figure">
        <div className="image-label-slots__stage">
          <img
            className="image-label-slots__img"
            src={imageSrc}
            alt={imageAlt}
            draggable={false}
            loading="lazy"
            decoding="async"
          />

          {drawLeaders && (
            <svg
              className="image-label-slots__leaders"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              {slots.map((s) => (
                <g key={`line-${s.id}`}>
                  <line
                    x1={s.x}
                    y1={s.y}
                    x2={s.targetX}
                    y2={s.targetY}
                    className="image-label-slots__leader-line"
                  />
                  <circle
                    cx={s.targetX}
                    cy={s.targetY}
                    r={0.9}
                    className="image-label-slots__leader-dot"
                  />
                </g>
              ))}
            </svg>
          )}

          {slots.map((s, slotIdx) => {
            const itemIdx = value[slotIdx] ?? null
            const filled = itemIdx !== null
            const label = filled ? items[itemIdx]?.label : ''
            const result = partResults?.[slotIdx]
            const resultClass =
              result === true
                ? 'image-label-slots__slot--ok'
                : result === false
                  ? 'image-label-slots__slot--bad'
                  : ''
            const slotState: BlockDragFrom = { from: 'slot', slotIdx }
            return (
              <div
                key={s.id}
                data-ils-slot={slotIdx}
                className={`image-label-slots__slot ${filled ? 'filled' : ''} ${
                  overSlot === slotIdx ? 'drag-over' : ''
                } ${isSelected(slotState) ? 'selected' : ''} ${resultClass}`}
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                aria-label={`Beschriftungsfeld ${slotIdx + 1}`}
                onClick={() => onSlotActivate(slotIdx)}
                role="button"
                tabIndex={disabled ? -1 : 0}
                onKeyDown={(e) => {
                  if (disabled) return
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSlotActivate(slotIdx)
                  }
                }}
              >
                {filled ? (
                  <div
                    className={`image-label-slots__chip in-slot ${
                      isDragging(slotState) ? 'dragging' : ''
                    } ${isSelected(slotState) ? 'selected' : ''}`}
                    onPointerDown={(e) => beginPointer(e, slotState)}
                  >
                    <span className="image-label-slots__handle" aria-hidden>
                      ≡
                    </span>
                    <span>{label}</span>
                    {!disabled && (
                      <button
                        type="button"
                        className="image-label-slots__clear"
                        aria-label="Zurück in den Vorrat"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation()
                          returnToPool(slotIdx)
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="image-label-slots__placeholder">
                    {slotIdx + 1}
                  </span>
                )}
              </div>
            )
          })}
        </div>
        <figcaption className="image-label-slots__attr">{attribution}</figcaption>
      </figure>

      <div
        className={`image-label-slots__pool ${overPool ? 'drag-over' : ''}`}
        data-ils-pool
        aria-label="Block-Vorrat"
      >
        {poolIndices.map((itemIdx) => {
          const state: BlockDragFrom = { from: 'pool', itemIdx }
          return (
            <div
              key={`pool-${itemIdx}`}
              className={`image-label-slots__chip ${
                isDragging(state) ? 'dragging' : ''
              } ${isSelected(state) ? 'selected' : ''}`}
              onPointerDown={(e) => beginPointer(e, state)}
            >
              <span className="image-label-slots__handle" aria-hidden>
                ≡
              </span>
              <span>{items[itemIdx]!.label}</span>
            </div>
          )
        })}
        {poolIndices.length === 0 && (
          <span className="image-label-slots__pool-empty">Alle Blöcke gesetzt</span>
        )}
      </div>

      {status && <p className="image-label-slots__status">{status}</p>}

      {ghost &&
        createPortal(
          <div
            ref={setGhostNode}
            className="image-label-slots__ghost"
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
