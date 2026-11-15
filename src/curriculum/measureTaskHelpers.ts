import { parseNumber } from '../lib/num'
import { drawStartDegrees } from '../lib/protractorGeometry'
import {
  RULER_DEFAULT_UNIT_PX,
  RULER_MAX_ANGLE,
  RULER_MAX_CM,
  RULER_MAX_UNIT_PX,
  RULER_MIN_CM,
  RULER_MIN_UNIT_PX,
  drawStartLength,
  roundCm,
} from '../lib/rulerGeometry'
import {
  circlesOf,
  emptyCoordinateScene,
  pointNear,
  type CoordinateScene,
  type GraphObject,
} from '../lib/coordinateScene'
import type { Task, UserInput } from './types'

export interface AngleProtractorTaskInput {
  question: string
  /** measure: read off the drawn angle; draw: rotate the second leg to the target angle. */
  mode: 'measure' | 'draw'
  /** Target angle 1..179 (integer). */
  angle: number
  /** Rotation of the first leg in degrees (default 0). */
  startAngle?: number
  /** Accepted deviation in degrees (default 1). */
  tolerance?: number
  solution: string
  explanation: string
  instruction?: string
  dedupeKey?: string
}

/** Virtual Geodreieck: measure a drawn angle or draw an angle with the instrument. */
export const angleProtractorTask = (input: AngleProtractorTaskInput): Task => {
  const { mode, angle } = input
  if (!Number.isInteger(angle) || angle < 1 || angle > 179) {
    throw new Error(`angleProtractorTask: angle must be an integer 1..179, got ${angle}`)
  }
  const startAngle = input.startAngle ?? 0
  const tolerance = input.tolerance ?? 1
  const within = (got: number) => Math.abs(got - angle) <= tolerance + 1e-9
  return {
    question: input.question,
    unit: '°',
    answerKind: 'integer',
    solution: input.solution,
    explanation: input.explanation,
    ...(input.dedupeKey?.trim() ? { dedupeKey: input.dedupeKey.trim() } : {}),
    sampleAnswer: { kind: 'angleProtractor', degrees: angle, touched: true },
    interactive: {
      type: 'angleProtractor',
      props: {
        mode,
        angle,
        startAngle,
        tolerance,
        initialDegrees: mode === 'draw' ? drawStartDegrees(angle) : null,
        instruction:
          input.instruction ??
          (mode === 'measure'
            ? 'Miss den Winkel mit dem Geodreieck und trage die Gradzahl ein:'
            : 'Stelle den zweiten Schenkel mit dem Geodreieck auf den gesuchten Winkel ein:'),
      },
    },
    check: (answer: UserInput) => {
      if (answer.kind === 'angleProtractor') {
        return answer.touched && answer.degrees !== null && within(answer.degrees)
      }
      if (answer.kind === 'value') {
        const got = parseNumber(answer.value)
        return got !== null && within(got)
      }
      return false
    },
  }
}

export interface RulerMeasureTaskInput {
  question: string
  /** measure: measure a segment; draw: drag a segment of the target length off the ruler. */
  mode: 'measure' | 'draw'
  /** Target length in cm, 0.5..12, step 0.1. */
  lengthCm: number
  /** Tilt of the segment in degrees (default 0). */
  angle?: number
  /** Accepted deviation in cm (default 0.1). */
  tolerance?: number
  /** SVG units per cm (default 40). */
  unitPx?: number
  solution: string
  explanation: string
  instruction?: string
  dedupeKey?: string
}

/** Virtual ruler: measure a drawn segment or draw a segment of a given length. */
export const rulerMeasureTask = (input: RulerMeasureTaskInput): Task => {
  const { mode, lengthCm } = input
  if (
    !Number.isFinite(lengthCm) ||
    lengthCm < RULER_MIN_CM ||
    lengthCm > RULER_MAX_CM ||
    Math.abs(roundCm(lengthCm) - lengthCm) > 1e-9
  ) {
    throw new Error(`rulerMeasureTask: lengthCm must be 0.5..12 in steps of 0.1, got ${lengthCm}`)
  }
  const angle = input.angle ?? 0
  if (!Number.isFinite(angle) || Math.abs(angle) > RULER_MAX_ANGLE) {
    throw new Error(`rulerMeasureTask: angle must be within +-${RULER_MAX_ANGLE}, got ${angle}`)
  }
  const unitPx = input.unitPx ?? RULER_DEFAULT_UNIT_PX
  if (!Number.isFinite(unitPx) || unitPx < RULER_MIN_UNIT_PX || unitPx > RULER_MAX_UNIT_PX) {
    throw new Error(
      `rulerMeasureTask: unitPx must be ${RULER_MIN_UNIT_PX}..${RULER_MAX_UNIT_PX}, got ${unitPx}`,
    )
  }
  const tolerance = input.tolerance ?? 0.1
  const within = (got: number) => Math.abs(got - lengthCm) <= tolerance + 1e-9
  return {
    question: input.question,
    unit: 'cm',
    answerKind: 'decimal',
    solution: input.solution,
    explanation: input.explanation,
    ...(input.dedupeKey?.trim() ? { dedupeKey: input.dedupeKey.trim() } : {}),
    sampleAnswer: { kind: 'rulerMeasure', length: lengthCm, touched: true },
    interactive: {
      type: 'rulerMeasure',
      props: {
        mode,
        lengthCm,
        angle,
        tolerance,
        unitPx,
        initialLength: mode === 'draw' ? drawStartLength(lengthCm) : null,
        instruction:
          input.instruction ??
          (mode === 'measure'
            ? 'Miss die Strecke mit dem Lineal und trage die Länge in cm ein:'
            : 'Ziehe den Endpunkt am Lineal auf die gesuchte Länge:'),
      },
    },
    check: (answer: UserInput) => {
      if (answer.kind === 'rulerMeasure') {
        return answer.touched && answer.length !== null && within(answer.length)
      }
      if (answer.kind === 'value') {
        const got = parseNumber(answer.value)
        return got !== null && within(got)
      }
      return false
    },
  }
}

export interface CompassArcTaskInput {
  question: string
  /** Given points (grid units, 1 unit = 1 cm); shown fixed and labelled. */
  points: Array<{ id: string; x: number; y: number; label: string }>
  /** Required arcs; radius in grid units. With sameRadius the radius value is not checked. */
  targets: Array<{ centerId: string; radius: number }>
  /** Accepted radius deviation in grid units (default 0.15). */
  radiusTolerance?: number
  /** All arcs share one radius (value free, e.g. perpendicular bisector). */
  sameRadius?: boolean
  /** With sameRadius: the common radius must be larger than this. */
  minRadius?: number
  solution: string
  explanation: string
  instruction?: string
  dedupeKey?: string
}

/** Center distance within which a drawn circle counts as "around" a point. */
const COMPASS_CENTER_TOL = 0.35

/**
 * Compass as a circle tool in the coordinate editor: the learner draws arcs around given points.
 * The check only looks at circles; given (fixed) points are ignored.
 */
export const compassArcTask = (input: CompassArcTaskInput): Task => {
  const { points, targets, sameRadius = false, minRadius = 0 } = input
  const tol = input.radiusTolerance ?? 0.15
  if (targets.length === 0) throw new Error('compassArcTask: at least one target needed')
  const centers = targets.map((t) => {
    const p = points.find((q) => q.id === t.centerId)
    if (!p) throw new Error(`compassArcTask: unknown centerId "${t.centerId}"`)
    return { x: p.x, y: p.y }
  })
  const sampleR = (i: number) => targets[i]!.radius
  if (sameRadius && !(sampleR(0) > minRadius)) {
    throw new Error('compassArcTask: with sameRadius, targets[0].radius must exceed minRadius')
  }

  const reach = Math.max(1, ...targets.map((t) => t.radius), sameRadius ? minRadius * 1.5 : 0)
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const range = (vals: number[]): [number, number] => [
    Math.floor(Math.min(...vals) - reach) - 1,
    Math.ceil(Math.max(...vals) + reach) + 1,
  ]
  const fixedPoints: GraphObject[] = points.map((p) => ({
    id: p.id,
    kind: 'point',
    x: p.x,
    y: p.y,
    label: p.label,
    fixed: true,
  }))
  const blank = emptyCoordinateScene({
    xRange: range(xs),
    yRange: range(ys),
    snap: 'half',
    objects: fixedPoints,
  })
  const solutionScene: CoordinateScene = {
    ...blank,
    objects: [
      ...fixedPoints,
      ...targets.map((_t, i): GraphObject => ({
        id: `sol-arc-${i}`,
        kind: 'circle',
        cx: centers[i]!.x,
        cy: centers[i]!.y,
        r: sampleR(i),
        color: '#c62828',
      })),
    ],
  }

  const checkScene = (scene: CoordinateScene): boolean => {
    const circles = circlesOf(scene)
    const around = (c: { x: number; y: number }) =>
      circles.filter((o) => pointNear({ x: o.cx, y: o.cy }, c, COMPASS_CENTER_TOL))
    // No arcs around points that are not targets.
    if (circles.some((o) => !centers.some((c) => pointNear({ x: o.cx, y: o.cy }, c, COMPASS_CENTER_TOL)))) {
      return false
    }
    if (sameRadius) {
      // One common radius r > minRadius that every target center has an arc for.
      return circles.some((cand) => {
        const r = cand.r
        return (
          r > minRadius &&
          centers.every((c) => around(c).some((o) => Math.abs(o.r - r) <= tol + 1e-9))
        )
      })
    }
    const used = new Set<string>()
    return targets.every((t, i) => {
      const hit = around(centers[i]!).find(
        (o) => !used.has(o.id) && Math.abs(o.r - t.radius) <= tol + 1e-9,
      )
      if (!hit) return false
      used.add(hit.id)
      return true
    })
  }

  return {
    question: input.question,
    answerKind: 'text',
    solution: input.solution,
    explanation: input.explanation,
    ...(input.dedupeKey?.trim() ? { dedupeKey: input.dedupeKey.trim() } : {}),
    sampleAnswer: { kind: 'coordinateDraw', scene: solutionScene },
    interactive: {
      type: 'coordinateDraw',
      props: {
        instruction:
          input.instruction ??
          'Zeichne mit dem Zirkel die gesuchten Kreisbögen: Einstichpunkt antippen, dann den Radius ziehen.',
        allowedTools: ['select', 'point', 'segment', 'circle', 'label', 'delete'],
        blankScene: blank,
        solutionScene,
      },
    },
    check: (answer: UserInput) =>
      answer.kind === 'coordinateDraw' && checkScene(answer.scene),
  }
}
