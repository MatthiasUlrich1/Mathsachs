import { useCallback, useRef, useState } from 'react'
import {
  emptyCoordinateScene,
  newGraphObjectId,
  snapPoint,
  type CoordinateScene,
  type GraphObject,
  type SnapMode,
} from '../lib/coordinateScene'
import './CoordinateGraphEditor.css'

export type EditorTool =
  | 'select'
  | 'point'
  | 'segment'
  | 'ray'
  | 'line'
  | 'label'
  | 'delete'

export interface CoordinateGraphEditorProps {
  scene: CoordinateScene
  onChange: (scene: CoordinateScene) => void
  allowedTools?: EditorTool[]
  instruction?: string
  disabled?: boolean
  solutionOverlay?: CoordinateScene | null
}

const ALL_TOOLS: Array<{ id: EditorTool; label: string }> = [
  { id: 'select', label: 'Verschieben' },
  { id: 'point', label: 'Punkt' },
  { id: 'segment', label: 'Strecke' },
  { id: 'ray', label: 'Halbgerade' },
  { id: 'line', label: 'Gerade' },
  { id: 'label', label: 'Text' },
  { id: 'delete', label: 'Löschen' },
]

/** Interactive graph: draw lines / place & drag objects (optional snap). */
export function CoordinateGraphEditor({
  scene,
  onChange,
  allowedTools,
  instruction,
  disabled = false,
  solutionOverlay = null,
}: CoordinateGraphEditorProps) {
  const tools = ALL_TOOLS.filter((t) =>
    allowedTools ? allowedTools.includes(t.id) : true,
  )
  const [tool, setTool] = useState<EditorTool>(tools[0]?.id ?? 'point')
  const [pending, setPending] = useState<{ x: number; y: number } | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const xMin = Math.min(scene.xRange[0], scene.xRange[1])
  const xMax = Math.max(scene.xRange[0], scene.xRange[1])
  const yMin = Math.min(scene.yRange[0], scene.yRange[1])
  const yMax = Math.max(scene.yRange[0], scene.yRange[1])
  const cellSize = scene.cellSize ?? 32
  const padL = 36
  const padR = 44
  const padT = 28
  const padB = 36
  const gridW = (xMax - xMin) * cellSize
  const gridH = (yMax - yMin) * cellSize
  const totalW = padL + gridW + padR
  const totalH = padT + gridH + padB

  const toSvg = useCallback(
    (mx: number, my: number): [number, number] => [
      padL + (mx - xMin) * cellSize,
      padT + (yMax - my) * cellSize,
    ],
    [cellSize, xMin, yMax],
  )

  const screenToMath = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      const svg = svgRef.current
      if (!svg) return null
      const rect = svg.getBoundingClientRect()
      const sx = ((clientX - rect.left) / rect.width) * totalW
      const sy = ((clientY - rect.top) / rect.height) * totalH
      const mx = xMin + (sx - padL) / cellSize
      const my = yMax - (sy - padT) / cellSize
      return snapPoint({ x: mx, y: my }, scene.snap, scene.xRange, scene.yRange)
    },
    [cellSize, scene.snap, scene.xRange, scene.yRange, totalH, totalW, xMin, yMax],
  )

  const updateObjects = (objects: GraphObject[]) => onChange({ ...scene, objects })

  const hitTest = (p: { x: number; y: number }): GraphObject | null => {
    const tol = scene.snap === 'off' ? 0.4 : 0.35
    for (let i = scene.objects.length - 1; i >= 0; i--) {
      const o = scene.objects[i]!
      if (o.kind === 'point' || o.kind === 'label') {
        if (Math.hypot(o.x - p.x, o.y - p.y) <= tol) return o
      }
      if (o.kind === 'segment' || o.kind === 'ray' || o.kind === 'line') {
        if (
          Math.hypot(o.x1 - p.x, o.y1 - p.y) <= tol ||
          Math.hypot(o.x2 - p.x, o.y2 - p.y) <= tol
        ) {
          return o
        }
      }
    }
    return null
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return
    const p = screenToMath(e.clientX, e.clientY)
    if (!p) return
    ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)

    if (tool === 'select') {
      const hit = hitTest(p)
      if (hit) setDragId(hit.id)
      return
    }
    if (tool === 'delete') {
      const hit = hitTest(p)
      if (hit) updateObjects(scene.objects.filter((o) => o.id !== hit.id))
      return
    }
    if (tool === 'point') {
      updateObjects([
        ...scene.objects,
        { id: newGraphObjectId(), kind: 'point', x: p.x, y: p.y },
      ])
      return
    }
    if (tool === 'label') {
      const text = window.prompt('Beschriftung:', 'A')
      if (text == null || !text.trim()) return
      updateObjects([
        ...scene.objects,
        {
          id: newGraphObjectId(),
          kind: 'label',
          x: p.x,
          y: p.y,
          text: text.trim(),
        },
      ])
      return
    }
    if (tool === 'segment' || tool === 'ray' || tool === 'line') {
      if (!pending) {
        setPending(p)
        return
      }
      if (Math.hypot(pending.x - p.x, pending.y - p.y) < 1e-6) {
        setPending(null)
        return
      }
      updateObjects([
        ...scene.objects,
        {
          id: newGraphObjectId(),
          kind: tool,
          x1: pending.x,
          y1: pending.y,
          x2: p.x,
          y2: p.y,
        },
      ])
      setPending(null)
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (disabled) return
    const p = screenToMath(e.clientX, e.clientY)
    setHover(p)
    if (!dragId || !p) return
    updateObjects(
      scene.objects.map((o) => {
        if (o.id !== dragId) return o
        if (o.kind === 'point' || o.kind === 'label') {
          return { ...o, x: p.x, y: p.y }
        }
        const d1 = Math.hypot(o.x1 - p.x, o.y1 - p.y)
        const d2 = Math.hypot(o.x2 - p.x, o.y2 - p.y)
        if (d1 <= d2) return { ...o, x1: p.x, y1: p.y }
        return { ...o, x2: p.x, y2: p.y }
      }),
    )
  }

  const onPointerUp = () => setDragId(null)

  const [ox, oy] = toSvg(0, 0)
  const gridLines: React.ReactNode[] = []
  for (let x = xMin; x <= xMax; x++) {
    const [sx] = toSvg(x, 0)
    gridLines.push(
      <line
        key={`vx${x}`}
        x1={sx}
        y1={padT}
        x2={sx}
        y2={padT + gridH}
        stroke={x === 0 ? '#555' : '#c8c8c8'}
        strokeWidth={x === 0 ? 2 : 1}
      />,
    )
  }
  for (let y = yMin; y <= yMax; y++) {
    const [, sy] = toSvg(0, y)
    gridLines.push(
      <line
        key={`hy${y}`}
        x1={padL}
        y1={sy}
        x2={padL + gridW}
        y2={sy}
        stroke={y === 0 ? '#555' : '#c8c8c8'}
        strokeWidth={y === 0 ? 2 : 1}
      />,
    )
  }

  const renderObject = (o: GraphObject, ghost = false) => {
    const opacity = ghost ? 0.35 : 1
    const color = o.color ?? (ghost ? '#c62828' : '#1565c0')
    if (o.kind === 'point') {
      const [sx, sy] = toSvg(o.x, o.y)
      return (
        <g key={o.id} opacity={opacity}>
          <circle cx={sx} cy={sy} r={7} fill={color} stroke="#0d47a1" strokeWidth={2} />
          {o.label && (
            <text x={sx + 10} y={sy - 8} fontSize={12} fontWeight={700} fill="#334155">
              {o.label}
            </text>
          )}
        </g>
      )
    }
    if (o.kind === 'label') {
      const [sx, sy] = toSvg(o.x, o.y)
      return (
        <text
          key={o.id}
          x={sx + 4}
          y={sy - 4}
          fontSize={13}
          fontWeight={700}
          fill={color}
          opacity={opacity}
        >
          {o.text}
        </text>
      )
    }
    const [a, b] = extendForDisplay(o, xMin, xMax, yMin, yMax)
    const [p1, p2] = [toSvg(a[0], a[1]), toSvg(b[0], b[1])]
    const [h1x, h1y] = toSvg(o.x1, o.y1)
    const [h2x, h2y] = toSvg(o.x2, o.y2)
    return (
      <g key={o.id} opacity={opacity}>
        <line
          x1={p1[0]}
          y1={p1[1]}
          x2={p2[0]}
          y2={p2[1]}
          stroke={color}
          strokeWidth={2.5}
          markerEnd={o.kind === 'ray' ? 'url(#cge-arrow)' : undefined}
        />
        {!ghost && (
          <>
            <circle cx={h1x} cy={h1y} r={4} fill="#fff" stroke={color} strokeWidth={2} />
            <circle cx={h2x} cy={h2y} r={4} fill="#fff" stroke={color} strokeWidth={2} />
          </>
        )}
      </g>
    )
  }

  const previewLine =
    pending && hover && (tool === 'segment' || tool === 'ray' || tool === 'line')
      ? ({
          id: 'preview',
          kind: tool,
          x1: pending.x,
          y1: pending.y,
          x2: hover.x,
          y2: hover.y,
          color: '#64b5f6',
        } as GraphObject)
      : null

  return (
    <div className="coordinate-graph-editor">
      {instruction && (
        <p className="coordinate-graph-editor__instruction">{instruction}</p>
      )}
      <div className="coordinate-graph-editor__toolbar">
        {tools.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`coordinate-graph-editor__tool${tool === t.id ? ' is-active' : ''}`}
            disabled={disabled}
            onClick={() => {
              setTool(t.id)
              setPending(null)
            }}
          >
            {t.label}
          </button>
        ))}
        <label className="coordinate-graph-editor__snap">
          Raster
          <select
            value={scene.snap}
            disabled={disabled}
            onChange={(e) =>
              onChange({ ...scene, snap: e.target.value as SnapMode })
            }
          >
            <option value="off">frei</option>
            <option value="half">½</option>
            <option value="integer">ganz</option>
          </select>
        </label>
        <button
          type="button"
          className="coordinate-graph-editor__tool"
          disabled={disabled || scene.objects.length === 0}
          onClick={() => updateObjects([])}
        >
          Leeren
        </button>
      </div>
      <svg
        ref={svgRef}
        className={`coordinate-graph-editor__svg${disabled ? ' is-disabled' : ''}`}
        width={totalW}
        height={totalH}
        viewBox={`0 0 ${totalW} ${totalH}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="img"
        aria-label="Koordinatensystem zeichnen"
      >
        <defs>
          <marker
            id="cge-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <polygon points="0,0 8,4 0,8" fill="#1565c0" />
          </marker>
        </defs>
        <rect x={0} y={0} width={totalW} height={totalH} fill="#fafafa" />
        {gridLines}
        <line
          x1={padL}
          y1={oy}
          x2={padL + gridW + 10}
          y2={oy}
          stroke="#555"
          strokeWidth={2}
        />
        <line
          x1={ox}
          y1={padT + gridH}
          x2={ox}
          y2={padT - 10}
          stroke="#555"
          strokeWidth={2}
        />
        <text x={padL + gridW + 14} y={oy + 4} fontSize={14} fontWeight="bold" fill="#333">
          x
        </text>
        <text x={ox + 8} y={padT - 6} fontSize={14} fontWeight="bold" fill="#333">
          y
        </text>
        {solutionOverlay?.objects.map((o) => renderObject({ ...o, id: `sol-${o.id}` }, true))}
        {scene.objects.map((o) => renderObject(o))}
        {pending && (
          <circle
            cx={toSvg(pending.x, pending.y)[0]}
            cy={toSvg(pending.x, pending.y)[1]}
            r={5}
            fill="#90caf9"
            stroke="#1565c0"
            strokeWidth={2}
          />
        )}
        {previewLine && renderObject(previewLine)}
        {hover && tool !== 'select' && tool !== 'delete' && (
          <circle
            cx={toSvg(hover.x, hover.y)[0]}
            cy={toSvg(hover.x, hover.y)[1]}
            r={4}
            fill="#bbdefb"
            pointerEvents="none"
          />
        )}
      </svg>
      <p className="coordinate-graph-editor__hint">
        {tool === 'line' || tool === 'segment' || tool === 'ray'
          ? 'Zwei Punkte tippen: Start, dann Richtung/Ende.'
          : tool === 'select'
            ? 'Objekt antippen und ziehen.'
            : tool === 'label'
              ? 'Position tippen, dann Text eingeben.'
              : ''}
        {hover ? ` · (${fmt(hover.x)}|${fmt(hover.y)})` : ''}
      </p>
    </div>
  )
}

function fmt(n: number): string {
  return String(Number(n.toFixed(2))).replace('.', ',')
}

function extendForDisplay(
  o: Extract<GraphObject, { kind: 'segment' | 'ray' | 'line' }>,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
): [[number, number], [number, number]] {
  if (o.kind === 'segment') return [[o.x1, o.y1], [o.x2, o.y2]]
  const dx = o.x2 - o.x1
  const dy = o.y2 - o.y1
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const span = Math.max(xMax - xMin, yMax - yMin) * 2
  if (o.kind === 'ray') {
    return [
      [o.x1, o.y1],
      [o.x1 + ux * span, o.y1 + uy * span],
    ]
  }
  return [
    [o.x1 - ux * span, o.y1 - uy * span],
    [o.x1 + ux * span, o.y1 + uy * span],
  ]
}

export function createDefaultEditorScene(): CoordinateScene {
  return emptyCoordinateScene()
}
