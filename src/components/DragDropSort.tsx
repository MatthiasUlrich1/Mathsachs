import { useState } from 'react'
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
 * Drag-and-drop sorting component.
 * Users drag items to reorder them (e.g., smallest to largest).
 */
export const DragDropSort: React.FC<DragDropSortProps> = ({
  items,
  userOrder,
  onChange,
  instruction,
}) => {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    setDragOverIdx(idx)
  }

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === targetIdx) {
      setDraggedIdx(null)
      setDragOverIdx(null)
      return
    }

    const newOrder = [...userOrder]
    const [removed] = newOrder.splice(draggedIdx, 1)
    newOrder.splice(targetIdx, 0, removed)
    onChange(newOrder)

    setDraggedIdx(null)
    setDragOverIdx(null)
  }

  const handleDragEnd = () => {
    setDraggedIdx(null)
    setDragOverIdx(null)
  }

  return (
    <div className="drag-drop-sort">
      {instruction && <div className="drag-drop-instruction">{instruction}</div>}
      <div className="drag-drop-container">
        {userOrder.map((itemIdx, orderIdx) => {
          const item = items[itemIdx]
          const isDragging = draggedIdx === orderIdx
          const isDragOver = dragOverIdx === orderIdx
          return (
            <div
              key={orderIdx}
              draggable
              onDragStart={(e) => handleDragStart(e, orderIdx)}
              onDragOver={(e) => handleDragOver(e, orderIdx)}
              onDrop={(e) => handleDrop(e, orderIdx)}
              onDragEnd={handleDragEnd}
              className={`drag-drop-item ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
            >
              <span className="drag-handle">≡</span>
              <span className="drag-item-label">{item.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
