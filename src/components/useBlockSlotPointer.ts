import { useCallback, useEffect, useRef, useState } from 'react'
import {
  type BlockDragFrom,
  type BlockDropTarget,
  hitTestBlockDrop,
  movedPastThreshold,
  sameDrag,
} from './blockSlotPointer'

export type BlockGhost = {
  x: number
  y: number
  label: string
}

type UseBlockSlotPointerOpts = {
  slotAttr: string
  poolAttr: string
  disabled?: boolean
  getLabel: (state: BlockDragFrom) => string
  onDropOnSlot: (state: BlockDragFrom, slotIdx: number) => void
  onDropOnPool: (state: BlockDragFrom) => void
}

/**
 * Pointer drag with visual ghost + tap-to-select then tap-frame.
 * Window-level listeners avoid iOS capture / scroll cancellation issues;
 * source chips keep receiving events (no pointer-events:none on capture target).
 */
export function useBlockSlotPointer({
  slotAttr,
  poolAttr,
  disabled = false,
  getLabel,
  onDropOnSlot,
  onDropOnPool,
}: UseBlockSlotPointerOpts) {
  const [selected, setSelected] = useState<BlockDragFrom | null>(null)
  const [drag, setDrag] = useState<BlockDragFrom | null>(null)
  const [overSlot, setOverSlot] = useState<number | null>(null)
  const [overPool, setOverPool] = useState(false)
  const [ghost, setGhost] = useState<BlockGhost | null>(null)

  const selectedRef = useRef<BlockDragFrom | null>(null)
  const dragRef = useRef<BlockDragFrom | null>(null)
  const activeRef = useRef<{
    pointerId: number
    origin: { x: number; y: number }
    state: BlockDragFrom
    dragging: boolean
    sourceEl: HTMLElement | null
  } | null>(null)
  const ghostElRef = useRef<HTMLElement | null>(null)

  const onDropOnSlotRef = useRef(onDropOnSlot)
  const onDropOnPoolRef = useRef(onDropOnPool)
  const getLabelRef = useRef(getLabel)
  onDropOnSlotRef.current = onDropOnSlot
  onDropOnPoolRef.current = onDropOnPool
  getLabelRef.current = getLabel

  useEffect(() => {
    selectedRef.current = selected
  }, [selected])
  useEffect(() => {
    dragRef.current = drag
  }, [drag])

  const clearHover = useCallback(() => {
    setOverSlot(null)
    setOverPool(false)
  }, [])

  const endDragVisual = useCallback(() => {
    dragRef.current = null
    setDrag(null)
    setGhost(null)
    clearHover()
  }, [clearHover])

  const hitAt = useCallback(
    (clientX: number, clientY: number): BlockDropTarget | null => {
      return hitTestBlockDrop(clientX, clientY, {
        slotAttr,
        poolAttr,
        exclude: [ghostElRef.current, activeRef.current?.sourceEl],
      })
    },
    [slotAttr, poolAttr],
  )

  const applyHover = useCallback(
    (t: BlockDropTarget | null) => {
      setOverSlot(t?.kind === 'slot' ? t.idx : null)
      setOverPool(t?.kind === 'pool')
    },
    [],
  )

  const placeFromState = useCallback((state: BlockDragFrom, t: BlockDropTarget) => {
    if (t.kind === 'slot') {
      onDropOnSlotRef.current(state, t.idx)
    } else {
      onDropOnPoolRef.current(state)
    }
  }, [])

  const detachWindow = useRef<(() => void) | null>(null)

  const cleanupWindow = useCallback(() => {
    detachWindow.current?.()
    detachWindow.current = null
    activeRef.current = null
  }, [])

  useEffect(() => () => cleanupWindow(), [cleanupWindow])

  const beginPointer = useCallback(
    (e: React.PointerEvent<HTMLElement>, state: BlockDragFrom) => {
      if (disabled) return
      if (e.pointerType === 'mouse' && e.button !== 0) return
      // Ignore secondary buttons / multi-touch noise.
      if (activeRef.current) return

      e.preventDefault()
      e.stopPropagation()

      const sourceEl = e.currentTarget
      activeRef.current = {
        pointerId: e.pointerId,
        origin: { x: e.clientX, y: e.clientY },
        state,
        dragging: false,
        sourceEl,
      }

      const onMove = (ev: PointerEvent) => {
        const active = activeRef.current
        if (!active || ev.pointerId !== active.pointerId) return

        if (
          !active.dragging &&
          movedPastThreshold(active.origin, ev.clientX, ev.clientY)
        ) {
          active.dragging = true
          dragRef.current = active.state
          setDrag(active.state)
          setSelected(null)
          selectedRef.current = null
          setGhost({
            x: ev.clientX,
            y: ev.clientY,
            label: getLabelRef.current(active.state),
          })
        }

        if (!active.dragging) return
        ev.preventDefault()
        setGhost({
          x: ev.clientX,
          y: ev.clientY,
          label: getLabelRef.current(active.state),
        })
        applyHover(hitAt(ev.clientX, ev.clientY))
      }

      const onUp = (ev: PointerEvent) => {
        const active = activeRef.current
        if (!active || ev.pointerId !== active.pointerId) return

        const wasDragging = active.dragging
        const stateNow = active.state
        const x = ev.clientX
        const y = ev.clientY

        cleanupWindow()
        endDragVisual()

        if (wasDragging) {
          const t = hitAt(x, y)
          if (t) placeFromState(stateNow, t)
          return
        }

        // Tap on a slot chip while another block is selected → place into that slot.
        const prior = selectedRef.current
        if (
          prior &&
          stateNow.from === 'slot' &&
          !sameDrag(prior, stateNow)
        ) {
          placeFromState(prior, { kind: 'slot', idx: stateNow.slotIdx })
          selectedRef.current = null
          setSelected(null)
          return
        }

        // Tap: select / deselect (progressive enhancement for unreliable drag).
        if (sameDrag(prior, stateNow)) {
          selectedRef.current = null
          setSelected(null)
        } else {
          selectedRef.current = stateNow
          setSelected(stateNow)
        }
      }

      window.addEventListener('pointermove', onMove, { passive: false })
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onUp)
      detachWindow.current = () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('pointercancel', onUp)
      }
    },
    [disabled, applyHover, hitAt, cleanupWindow, endDragVisual, placeFromState],
  )

  const onSlotActivate = useCallback(
    (slotIdx: number) => {
      if (disabled) return
      const sel = selectedRef.current
      if (!sel) return
      // Tapping the same filled slot that is already selected keeps selection
      // (click bubbles from the chip after pointerup selected it).
      if (sel.from === 'slot' && sel.slotIdx === slotIdx) return
      onDropOnSlotRef.current(sel, slotIdx)
      selectedRef.current = null
      setSelected(null)
    },
    [disabled],
  )

  const setGhostNode = useCallback((el: HTMLElement | null) => {
    ghostElRef.current = el
  }, [])

  const isSelected = useCallback(
    (state: BlockDragFrom) => sameDrag(selected, state),
    [selected],
  )

  const isDragging = useCallback(
    (state: BlockDragFrom) => sameDrag(drag, state),
    [drag],
  )

  const status =
    selected && !disabled
      ? 'Tippe einen Rahmen, um den Block einzusetzen. Nochmal tippen: Auswahl aufheben.'
      : null

  return {
    selected,
    drag,
    overSlot,
    overPool,
    ghost,
    status,
    beginPointer,
    onSlotActivate,
    setGhostNode,
    isSelected,
    isDragging,
    clearSelection: () => {
      selectedRef.current = null
      setSelected(null)
    },
  }
}
