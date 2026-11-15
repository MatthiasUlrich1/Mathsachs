/**
 * Task helpers for the Bettermarks-style interactions (issue #49, Part B).
 * Re-exported from taskHelpers.ts. Pure maths/pointer logic lives in src/lib/*.
 */
import {
  FRACTION_MODEL_MAX_DEN,
  FRACTION_MODEL_MIN_DEN,
  fractionModelMatches,
  fractionModelReachable,
  fractionModelStartDen,
  type FractionModelShape,
  type FractionTarget,
} from '../lib/fractionModelLogic'
import type { Task, UserInput } from './types'

export interface FractionModelTaskInput {
  question: string
  /** Bar or circle model. */
  shape: FractionModelShape
  /** The fraction to show: `num` of `den` parts shaded. */
  target: FractionTarget
  /** true (default): any equivalent fraction counts (2/4 for 1/2). false: the number of parts must equal `target.den`. */
  allowEquivalent?: boolean
  solution: string
  explanation: string
  instruction?: string
  dedupeKey?: string
}

/** Fraction model: set the number of parts (2..12) and shade parts by clicking. */
export const fractionModelTask = (input: FractionModelTaskInput): Task => {
  const { target, shape } = input
  const allowEquivalent = input.allowEquivalent ?? true
  if (shape !== 'bar' && shape !== 'circle') {
    throw new Error(`fractionModelTask: shape must be 'bar' or 'circle', got ${String(shape)}`)
  }
  if (
    !Number.isInteger(target.num) ||
    !Number.isInteger(target.den) ||
    target.num < 1 ||
    target.den < 1 ||
    target.num > target.den
  ) {
    throw new Error(`fractionModelTask: target must satisfy 1 <= num <= den, got ${target.num}/${target.den}`)
  }
  if (!allowEquivalent && (target.den < FRACTION_MODEL_MIN_DEN || target.den > FRACTION_MODEL_MAX_DEN)) {
    throw new Error(
      `fractionModelTask: target.den must be ${FRACTION_MODEL_MIN_DEN}..${FRACTION_MODEL_MAX_DEN} when allowEquivalent is false, got ${target.den}`,
    )
  }
  if (!fractionModelReachable(target)) {
    throw new Error(
      `fractionModelTask: ${target.num}/${target.den} cannot be shown with ${FRACTION_MODEL_MIN_DEN}..${FRACTION_MODEL_MAX_DEN} parts`,
    )
  }
  // Sample: the target's own number of parts when it fits, otherwise the smallest equivalent that does.
  let sampleDen = target.den
  if (sampleDen < FRACTION_MODEL_MIN_DEN || sampleDen > FRACTION_MODEL_MAX_DEN) {
    sampleDen = FRACTION_MODEL_MIN_DEN
    while ((target.num * sampleDen) % target.den !== 0) sampleDen++
  }
  const sampleCount = (target.num * sampleDen) / target.den
  return {
    question: input.question,
    answerKind: 'fraction',
    solution: input.solution,
    explanation: input.explanation,
    ...(input.dedupeKey?.trim() ? { dedupeKey: input.dedupeKey.trim() } : {}),
    sampleAnswer: {
      kind: 'fractionModel',
      den: sampleDen,
      shaded: Array.from({ length: sampleCount }, (_, i) => i),
    },
    interactive: {
      type: 'fractionModel',
      props: {
        shape,
        target: { num: target.num, den: target.den },
        allowEquivalent,
        initialDen: fractionModelStartDen(target.den),
        instruction:
          input.instruction ??
          'Stelle die Anzahl der Teile ein und färbe Teile durch Anklicken:',
      },
    },
    check: (answer: UserInput) =>
      answer.kind === 'fractionModel' && fractionModelMatches(answer.den, answer.shaded, target, allowEquivalent),
  }
}
