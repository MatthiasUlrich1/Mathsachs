/**
 * Shared hit-testing + thresholds for block→slot interactions.
 * Prefer geometry (+ padding) over bare elementFromPoint so touch offsets
 * and mid-drag scroll still land on a slot.
 */

export const DRAG_MOVE_THRESHOLD_PX = 10
export const SLOT_HIT_PADDING_PX = 14

export type BlockDragFrom =
  | { from: 'pool'; itemIdx: number }
  | { from: 'slot'; slotIdx: number }

export type BlockDropTarget =
  | { kind: 'slot'; idx: number }
  | { kind: 'pool' }

function sameDrag(a: BlockDragFrom | null, b: BlockDragFrom | null): boolean {
  if (!a || !b || a.from !== b.from) return false
  if (a.from === 'pool' && b.from === 'pool') return a.itemIdx === b.itemIdx
  if (a.from === 'slot' && b.from === 'slot') return a.slotIdx === b.slotIdx
  return false
}

export { sameDrag }

/**
 * Resolve drop target under a pointer. Uses elementsFromPoint first, then
 * padded bounding boxes so slightly-missed frames still count on phones.
 */
export function hitTestBlockDrop(
  clientX: number,
  clientY: number,
  opts: {
    /** Attribute name on slot nodes, e.g. `data-slot-idx`. */
    slotAttr: string
    /** Attribute name on the pool node, e.g. `data-drop-pool`. */
    poolAttr: string
    /** Elements to ignore (ghost / source chip). */
    exclude?: Array<Element | null | undefined>
  },
): BlockDropTarget | null {
  const exclude = new Set(
    (opts.exclude ?? []).filter((el): el is Element => Boolean(el)),
  )

  const stack: Element[] =
    typeof document.elementsFromPoint === 'function'
      ? document.elementsFromPoint(clientX, clientY)
      : (() => {
          const one = document.elementFromPoint(clientX, clientY)
          return one ? [one] : []
        })()

  for (const el of stack) {
    if (exclude.has(el)) continue
    const slot = el.closest(`[${opts.slotAttr}]`) as HTMLElement | null
    if (slot && !exclude.has(slot)) {
      const idx = Number(slot.getAttribute(opts.slotAttr))
      if (Number.isFinite(idx)) return { kind: 'slot', idx }
    }
    const pool = el.closest(`[${opts.poolAttr}]`)
    if (pool && !exclude.has(pool)) return { kind: 'pool' }
  }

  // Geometry fallback with padding (finger often sits below the visual tip).
  const pad = SLOT_HIT_PADDING_PX
  let best: { idx: number; dist: number } | null = null
  for (const slot of document.querySelectorAll<HTMLElement>(`[${opts.slotAttr}]`)) {
    if (exclude.has(slot)) continue
    const r = slot.getBoundingClientRect()
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
    const idx = Number(slot.getAttribute(opts.slotAttr))
    if (Number.isFinite(idx) && (!best || dist < best.dist)) {
      best = { idx, dist }
    }
  }
  if (best) return { kind: 'slot', idx: best.idx }

  const pool = document.querySelector<HTMLElement>(`[${opts.poolAttr}]`)
  if (pool && !exclude.has(pool)) {
    const r = pool.getBoundingClientRect()
    if (
      clientX >= r.left - pad &&
      clientX <= r.right + pad &&
      clientY >= r.top - pad &&
      clientY <= r.bottom + pad
    ) {
      return { kind: 'pool' }
    }
  }
  return null
}

export function movedPastThreshold(
  origin: { x: number; y: number } | null,
  clientX: number,
  clientY: number,
  threshold = DRAG_MOVE_THRESHOLD_PX,
): boolean {
  if (!origin) return false
  return (
    Math.abs(clientX - origin.x) > threshold ||
    Math.abs(clientY - origin.y) > threshold
  )
}
