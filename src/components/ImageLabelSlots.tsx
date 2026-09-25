import { useRef, useState } from 'react'
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

type DragState =
  | { from: 'pool'; itemIdx: number }
  | { from: 'slot'; slotIdx: number }

/**
 * Image labeling: drag answer chips into fixed drop fields.
 * Optional leader lines connect each slot to a precise region on the image.
 * Reusable across subjects (biology anatomy, maps, technical diagrams, …).
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
  const [drag, setDrag] = useState<DragState | null>(null)
  const [overSlot, setOverSlot] = useState<number | null>(null)
  const [overPool, setOverPool] = useState(false)
  const dragRef = useRef<DragState | null>(null)
  const pointerOrigin = useRef<{ x: number; y: number } | null>(null)

  const used = new Set(value.filter((s): s is number => s !== null))
  const poolIndices = items.map((_, i) => i).filter((i) => !used.has(i))

  const clearDrag = () => {
    dragRef.current = null
    pointerOrigin.current = null
    setDrag(null)
    setOverSlot(null)
    setOverPool(false)
  }

  const placeInSlot = (slotIdx: number, itemIdx: number, fromSlot?: number) => {
    if (disabled) return
    const next = [...value]
    const prev = next[slotIdx]
    if (fromSlot !== undefined) {
      next[fromSlot] = prev ?? null
    }
    next[slotIdx] = itemIdx
    onChange(next)
  }

  const fillNextEmpty = (itemIdx: number) => {
    const empty = value.findIndex((s) => s === null)
    if (empty < 0) return
    placeInSlot(empty, itemIdx)
  }

  const returnToPool = (slotIdx: number) => {
    if (disabled) return
    const next = [...value]
    next[slotIdx] = null
    onChange(next)
  }

  const targetFromPoint = (
    clientX: number,
    clientY: number,
  ): { kind: 'slot'; idx: number } | { kind: 'pool' } | null => {
    const el = document.elementFromPoint(clientX, clientY)
    const slot = el?.closest('[data-ils-slot]') as HTMLElement | null
    if (slot) {
      const idx = Number(slot.dataset.ilsSlot)
      if (Number.isFinite(idx)) return { kind: 'slot', idx }
    }
    if (el?.closest('[data-ils-pool]')) return { kind: 'pool' }
    return null
  }

  const beginDrag = (e: React.PointerEvent<HTMLElement>, state: DragState) => {
    if (disabled) return
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
      } else if (current.from === 'slot' && current.slotIdx !== t.idx) {
        const next = [...value]
        const a = next[current.slotIdx] ?? null
        const b = next[t.idx] ?? null
        next[current.slotIdx] = b
        next[t.idx] = a
        onChange(next)
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

  return (
    <div className="image-label-slots">
      {instruction && (
        <p className="image-label-slots__instruction">{instruction}</p>
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
            return (
              <div
                key={s.id}
                data-ils-slot={slotIdx}
                className={`image-label-slots__slot ${filled ? 'filled' : ''} ${
                  overSlot === slotIdx ? 'drag-over' : ''
                } ${resultClass}`}
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                aria-label={`Beschriftungsfeld ${slotIdx + 1}`}
              >
                {filled ? (
                  <div
                    className={`image-label-slots__chip in-slot ${
                      drag?.from === 'slot' && drag.slotIdx === slotIdx
                        ? 'dragging'
                        : ''
                    }`}
                    onPointerDown={(e) =>
                      beginDrag(e, { from: 'slot', slotIdx })
                    }
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={clearDrag}
                  >
                    <span className="image-label-slots__handle">≡</span>
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
        {poolIndices.map((itemIdx) => (
          <div
            key={`pool-${itemIdx}`}
            className={`image-label-slots__chip ${
              drag?.from === 'pool' && drag.itemIdx === itemIdx ? 'dragging' : ''
            }`}
            onPointerDown={(e) => beginDrag(e, { from: 'pool', itemIdx })}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={clearDrag}
          >
            <span className="image-label-slots__handle">≡</span>
            <span>{items[itemIdx]!.label}</span>
          </div>
        ))}
        {poolIndices.length === 0 && (
          <span className="image-label-slots__pool-empty">Alle Blöcke gesetzt</span>
        )}
      </div>
    </div>
  )
}
