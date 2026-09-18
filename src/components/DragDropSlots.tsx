import { useState } from 'react'
import './DragDropSlots.css'

export interface DragDropSlotsProps {
  /** All available blocks (including optional unused distractor). */
  items: Array<{ label: string; value: number }>
  /** Slot contents: item index or null if empty. */
  slots: Array<number | null>
  onChange: (slots: Array<number | null>) => void
  instruction?: string
}

/**
 * Formula builder: drag chips from a pool into empty slots.
 * Extra (wrong) blocks stay in the pool unused.
 */
export const DragDropSlots: React.FC<DragDropSlotsProps> = ({
  items,
  slots,
  onChange,
  instruction,
}) => {
  const [drag, setDrag] = useState<{ from: 'pool' | 'slot'; index: number } | null>(
    null,
  )
  const [overSlot, setOverSlot] = useState<number | null>(null)

  const used = new Set(slots.filter((s): s is number => s !== null))
  const poolIndices = items.map((_, i) => i).filter((i) => !used.has(i))

  const clearDrag = () => {
    setDrag(null)
    setOverSlot(null)
  }

  const placeInSlot = (slotIdx: number, itemIdx: number) => {
    const next = [...slots]
    const prev = next[slotIdx]
    // If coming from another slot, free that slot
    if (drag?.from === 'slot') {
      next[drag.index] = prev ?? null
    }
    next[slotIdx] = itemIdx
    onChange(next)
  }

  const returnToPool = (slotIdx: number) => {
    const next = [...slots]
    next[slotIdx] = null
    onChange(next)
  }

  const onDragStartPool = (e: React.DragEvent, poolPos: number) => {
    const itemIdx = poolIndices[poolPos]
    if (itemIdx === undefined) return
    setDrag({ from: 'pool', index: itemIdx })
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(itemIdx))
  }

  const onDragStartSlot = (e: React.DragEvent, slotIdx: number) => {
    const itemIdx = slots[slotIdx]
    if (itemIdx === null || itemIdx === undefined) return
    setDrag({ from: 'slot', index: slotIdx })
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', `slot:${slotIdx}`)
  }

  const onDropSlot = (e: React.DragEvent, slotIdx: number) => {
    e.preventDefault()
    if (!drag) {
      clearDrag()
      return
    }
    if (drag.from === 'pool') {
      placeInSlot(slotIdx, drag.index)
    } else if (drag.from === 'slot') {
      const fromSlot = drag.index
      if (fromSlot === slotIdx) {
        clearDrag()
        return
      }
      const next = [...slots]
      const a = next[fromSlot] ?? null
      const b = next[slotIdx] ?? null
      next[fromSlot] = b
      next[slotIdx] = a
      onChange(next)
    }
    clearDrag()
  }

  const onDropPool = (e: React.DragEvent) => {
    e.preventDefault()
    if (drag?.from === 'slot') {
      returnToPool(drag.index)
    }
    clearDrag()
  }

  return (
    <div className="drag-drop-slots">
      {instruction && <div className="drag-drop-slots__instruction">{instruction}</div>}

      <div
        className="drag-drop-slots__pool"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDropPool}
        aria-label="Block-Vorrat"
      >
        {poolIndices.map((itemIdx, poolPos) => (
          <div
            key={`pool-${itemIdx}`}
            className={`drag-drop-slots__chip ${
              drag?.from === 'pool' && drag.index === itemIdx ? 'dragging' : ''
            }`}
            draggable
            onDragStart={(e) => onDragStartPool(e, poolPos)}
            onDragEnd={clearDrag}
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
              className={`drag-drop-slots__slot ${filled ? 'filled' : ''} ${
                overSlot === slotIdx ? 'drag-over' : ''
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                setOverSlot(slotIdx)
              }}
              onDragLeave={() => setOverSlot(null)}
              onDrop={(e) => onDropSlot(e, slotIdx)}
            >
              {filled ? (
                <div
                  className="drag-drop-slots__chip in-slot"
                  draggable
                  onDragStart={(e) => onDragStartSlot(e, slotIdx)}
                  onDragEnd={clearDrag}
                  onDoubleClick={() => returnToPool(slotIdx)}
                  title="Doppelklick: zurück in den Vorrat"
                >
                  <span className="drag-drop-slots__handle">≡</span>
                  <span>{label}</span>
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
