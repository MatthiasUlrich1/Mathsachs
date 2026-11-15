import { parseNumber } from '../lib/num'
import { drawStartDegrees } from '../lib/protractorGeometry'
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
