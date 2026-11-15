import { useRef, useState } from 'react'
import type { UserInput } from '../curriculum/types'
import {
  NLM_CHIP_FONT,
  NLM_CHIP_H,
  NLM_CHIP_W,
  NLM_LINE_X0,
  NLM_LINE_X1,
  NLM_LINE_Y,
  NLM_ROW_Y,
  NLM_TICK_FONT,
  NLM_TICK_LABEL_Y,
  NLM_TRAY_Y,
  NLM_TRAY_ZONE_Y,
  NLM_VIEWBOX_H,
  NLM_VIEWBOX_W,
  nlmClampChip,
  nlmFormatTick,
  nlmLabelledTicks,
  nlmNudge,
  nlmEndDrag,
  nlmRowsByRank,
  nlmSlotX,
  nlmSnap,
  nlmTickValues,
  nlmValueFromX,
  nlmXFromValue,
} from '../lib/numberLineMultiLogic'
import './NumberLineMulti.css'

type NumberLineMultiValue = Extract<UserInput, { kind: 'numberLineMulti' }>

export interface NumberLineMultiProps {
  /** The labels to place (display text only; the values stay in the task's check). */
  items: Array<{ id: string; label: string }>
  /** Tray order (ids); defaults to the item order. */
  order?: string[]
  min: number
  max: number
  step: number
  /** Positions snap to this grid (default step / 2). */
  snap?: number
  /** Numbers are written at min, max and every labelEvery-th tick. */
  labelEvery: number
  value: NumberLineMultiValue
  onChange: (value: UserInput) => void
  instruction?: string
  disabled?: boolean
}

interface DragState {
  id: string
  cx: number
  cy: number
}

/**
 * Number line with several labels. Drag each label from the tray onto the line; it snaps to the
 * snap grid. Dragging it back into the tray removes it. Pointer events only (mouse, touch, stylus).
 */
export const NumberLineMulti: React.FC<NumberLineMultiProps> = ({
  items,
  order,
  min,
  max,
  step,
  snap: snapProp,
  labelEvery,
  value,
  onChange,
  instruction,
  disabled = false,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const grab = useRef<{ id: string; dx: number; dy: number } | null>(null)
  const [drag, setDrag] = useState<DragState | null>(null)
  const snap = snapProp ?? step / 2
  const positions = value.positions ?? {}

  const rows = nlmRowsByRank(
    items.map((i) => i.id),
    positions,
  )
  const trayIds = order && order.length === items.length ? order : items.map((i) => i.id)
  const byId = new Map(items.map((it, index) => [it.id, { ...it, index }]))
  const ticks = nlmTickValues(min, max, step)
  const labelled = new Set(nlmLabelledTicks(min, max, step, labelEvery))

  const emit = (next: Record<string, number>) => onChange({ kind: 'numberLineMulti', positions: next })
  const place = (id: string, pos: number) => {
    if (positions[id] === pos) return
    emit({ ...positions, [id]: pos })
  }
  const remove = (id: string) => {
    if (!(id in positions)) return
    const { [id]: _removed, ...rest } = positions
    void _removed
    emit(rest)
  }

  const toSvg = (e: React.PointerEvent): { x: number; y: number } => {
    const r = svgRef.current?.getBoundingClientRect()
    const sx = r && r.width > 0 ? NLM_VIEWBOX_W / r.width : 1
    const sy = r && r.height > 0 ? NLM_VIEWBOX_H / r.height : 1
    const cx = Number.isFinite(e.clientX) ? e.clientX : 0
    const cy = Number.isFinite(e.clientY) ? e.clientY : 0
    return { x: (cx - (r?.left ?? 0)) * sx, y: (cy - (r?.top ?? 0)) * sy }
  }

  /** Where a label rests when it is not being dragged. */
  const restCentre = (id: string): { cx: number; cy: number } => {
    const pos = positions[id]
    if (typeof pos === 'number') {
      return { cx: nlmClampChip(nlmXFromValue(pos, min, max), 0).cx, cy: rows[id] ?? NLM_ROW_Y[0] }
    }
    return { cx: nlmSlotX(trayIds.indexOf(id), trayIds.length), cy: NLM_TRAY_Y }
  }

  const onDown = (id: string) => (e: React.PointerEvent) => {
    if (disabled) return
    try {
      // Capture on the svg: it never moves in the DOM, unlike the chip that is re-ordered while dragged.
      svgRef.current?.setPointerCapture?.(e.pointerId)
    } catch {
      /* synthetic pointers have nothing to capture */
    }
    const p = toSvg(e)
    const c = restCentre(id)
    // Keep the grab offset so the label does not jump under the finger.
    grab.current = { id, dx: c.cx - p.x, dy: c.cy - p.y }
    setDrag({ id, cx: c.cx, cy: c.cy })
  }

  const onMove = (e: React.PointerEvent) => {
    const g = grab.current
    if (!g || disabled) return
    const p = toSvg(e)
    const c = nlmClampChip(p.x + g.dx, p.y + g.dy)
    setDrag({ id: g.id, cx: c.cx, cy: c.cy })
    if (c.cy < NLM_TRAY_ZONE_Y) remove(g.id)
    else place(g.id, nlmSnap(nlmValueFromX(c.cx, min, max), min, max, snap))
  }

  const onUp = () => {
    const next = nlmEndDrag(grab.current, drag)
    grab.current = next.grab
    setDrag(next.drag)
  }

  const onKey = (id: string) => (e: React.KeyboardEvent) => {
    if (disabled) return
    const pos = positions[id]
    if (typeof pos !== 'number') {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        place(id, min)
      }
      return
    }
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0
    if (delta) {
      e.preventDefault()
      place(id, nlmNudge(pos, delta, min, max, snap))
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Escape') {
      e.preventDefault()
      remove(id)
    }
  }

  const fmt = (n: number) => Math.round(n * 100) / 100
  const dragging = drag?.id
  // The dragged label is drawn last, so it is on top.
  const drawOrder = dragging ? [...items.map((i) => i.id).filter((id) => id !== dragging), dragging] : items.map((i) => i.id)

  return (
    <div className="number-line-multi">
      {instruction && <p className="number-line-multi__instruction">{instruction}</p>}
      <svg
        ref={svgRef}
        className="number-line-multi__svg"
        viewBox={`0 0 ${NLM_VIEWBOX_W} ${NLM_VIEWBOX_H}`}
        role="group"
        aria-label="Zahlengerade: Zahlen an die richtige Stelle ziehen"
        aria-disabled={disabled || undefined}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onLostPointerCapture={onUp}
      >
        <line className="number-line-multi__line" x1={NLM_LINE_X0} y1={NLM_LINE_Y} x2={NLM_LINE_X1} y2={NLM_LINE_Y} />
        {ticks.map((t) => {
          const x = nlmXFromValue(t, min, max)
          const major = labelled.has(t)
          const h = major ? 12 : 7
          return (
            <g key={t}>
              <line className="number-line-multi__tick" x1={x} y1={NLM_LINE_Y - h} x2={x} y2={NLM_LINE_Y + h} />
              {major && (
                <text className="number-line-multi__num" x={x} y={NLM_TICK_LABEL_Y} textAnchor="middle" fontSize={NLM_TICK_FONT}>
                  {nlmFormatTick(t)}
                </text>
              )}
            </g>
          )
        })}
        {trayIds.map((id, i) => (
          <rect
            key={`slot-${id}`}
            className="number-line-multi__slot"
            x={fmt(nlmSlotX(i, trayIds.length) - NLM_CHIP_W / 2)}
            y={NLM_TRAY_Y - NLM_CHIP_H / 2}
            width={NLM_CHIP_W}
            height={NLM_CHIP_H}
            rx={8}
          />
        ))}
        {drawOrder.map((id) => {
          const item = byId.get(id)
          if (!item) return null
          const pos = positions[id]
          const placed = typeof pos === 'number'
          const isDragging = dragging === id && drag
          const c = isDragging ? { cx: drag.cx, cy: drag.cy } : restCentre(id)
          return (
            <g key={id}>
              {placed && (
                <>
                  <line
                    className="number-line-multi__stem"
                    x1={fmt(nlmXFromValue(pos, min, max))}
                    y1={fmt(c.cy + NLM_CHIP_H / 2)}
                    x2={fmt(nlmXFromValue(pos, min, max))}
                    y2={NLM_LINE_Y}
                  />
                  <circle className="number-line-multi__dot" cx={fmt(nlmXFromValue(pos, min, max))} cy={NLM_LINE_Y} r={5} />
                </>
              )}
              <g
                data-testid="nlm-chip"
                data-id={id}
                data-pos={placed ? pos : undefined}
                className={`number-line-multi__chip${placed ? ' number-line-multi__chip--placed' : ''}${isDragging ? ' number-line-multi__chip--dragging' : ''}`}
                tabIndex={disabled ? -1 : 0}
                role="button"
                aria-label={
                  placed
                    ? `${item.label}, platziert. Pfeiltasten verschieben, Entfernen legt zurück.`
                    : `${item.label}, noch nicht platziert. Eingabetaste legt auf die Zahlengerade.`
                }
                onPointerDown={onDown(id)}
                onKeyDown={onKey(id)}
              >
                <rect x={fmt(c.cx - NLM_CHIP_W / 2)} y={fmt(c.cy - NLM_CHIP_H / 2)} width={NLM_CHIP_W} height={NLM_CHIP_H} rx={8} />
                <text x={fmt(c.cx)} y={fmt(c.cy)} textAnchor="middle" dominantBaseline="central" fontSize={NLM_CHIP_FONT} pointerEvents="none">
                  {item.label}
                </text>
              </g>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
