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
