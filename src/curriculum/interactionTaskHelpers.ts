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
import {
  FRACTION_WALL_DEFAULT_ROWS,
  FRACTION_WALL_MAX_ROW,
  equivalentWallSolution,
  wallCompareMatches,
  wallEquivalentMatches,
  wallFractionsEqual,
  type FractionWallFraction,
} from '../lib/fractionWallLogic'
import {
  DIVIDE_MAX_COUNT,
  DIVIDE_MAX_PERSONS,
  DIVIDE_MIN_COUNT,
  DIVIDE_MIN_PERSONS,
  divideMatches,
  divideSolutionAssignment,
  divideSolvableParts,
  type DivideShape,
} from '../lib/divideToolLogic'
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

interface FractionWallTaskBase {
  question: string
  /** Wall rows as numbers of tiles (row d has d tiles of width 1/d). Default: 1, 2, 3, 4, 5, 6, 8, 10, 12. */
  rows?: number[]
  solution: string
  explanation: string
  instruction?: string
  dedupeKey?: string
}

export type FractionWallTaskInput = FractionWallTaskBase &
  (
    | {
        /** Select, in every row where it fits, the run of tiles as long as `target`. The target's own row is shown shaded as reference. */
        mode: 'equivalent'
        target: FractionWallFraction
      }
    | {
        /** Select the run for the larger of two different fractions (in its own row). */
        mode: 'compare'
        a: FractionWallFraction
        b: FractionWallFraction
      }
  )

const assertWallFraction = (name: string, x: FractionWallFraction, rows: readonly number[]) => {
  if (!Number.isInteger(x.num) || !Number.isInteger(x.den) || x.num < 1 || x.num > x.den) {
    throw new Error(`fractionWallTask: ${name} must satisfy 1 <= num <= den, got ${x.num}/${x.den}`)
  }
  if (!rows.includes(x.den)) {
    throw new Error(`fractionWallTask: rows must contain the row ${x.den} of ${name}`)
  }
}

/** Fraction wall: tap tiles from the left edge; either find all equivalent fractions or the larger one of two. */
export const fractionWallTask = (input: FractionWallTaskInput): Task => {
  const rows = [...(input.rows ?? FRACTION_WALL_DEFAULT_ROWS)]
  if (
    rows.length < 2 ||
    rows.some(
      (r, i) => !Number.isInteger(r) || r < 1 || r > FRACTION_WALL_MAX_ROW || (i > 0 && r <= rows[i - 1]!),
    )
  ) {
    throw new Error(`fractionWallTask: rows must be ascending, unique integers 1..${FRACTION_WALL_MAX_ROW}`)
  }
  const common = {
    question: input.question,
    answerKind: 'fraction' as const,
    solution: input.solution,
    explanation: input.explanation,
    ...(input.dedupeKey?.trim() ? { dedupeKey: input.dedupeKey.trim() } : {}),
  }
  if (input.mode === 'equivalent') {
    const { target } = input
    assertWallFraction('target', target, rows)
    if (target.num >= target.den) {
      throw new Error(`fractionWallTask: target must be smaller than 1, got ${target.num}/${target.den}`)
    }
    const sample = equivalentWallSolution(rows, target)
    if (sample.length === 0) {
      throw new Error(`fractionWallTask: no other row shows ${target.num}/${target.den}; adjust rows`)
    }
    return {
      ...common,
      sampleAnswer: { kind: 'fractionWall', selected: sample },
      interactive: {
        type: 'fractionWall',
        props: {
          mode: 'equivalent',
          rows,
          target: { num: target.num, den: target.den },
          instruction:
            input.instruction ??
            'Die gefärbte Reihe ist vorgegeben. Tippe in den anderen Reihen auf das letzte Teil, das genauso lang ist:',
        },
      },
      check: (answer: UserInput) =>
        answer.kind === 'fractionWall' && wallEquivalentMatches(rows, answer.selected, target),
    }
  }
  const { a, b } = input
  assertWallFraction('a', a, rows)
  assertWallFraction('b', b, rows)
  if (wallFractionsEqual(a, b)) {
    throw new Error(`fractionWallTask: a and b must differ, got ${a.num}/${a.den} and ${b.num}/${b.den}`)
  }
  const larger = a.num * b.den > b.num * a.den ? a : b
  return {
    ...common,
    sampleAnswer: { kind: 'fractionWall', selected: [{ row: larger.den, count: larger.num }] },
    interactive: {
      type: 'fractionWall',
      props: {
        mode: 'compare',
        rows,
        a: { num: a.num, den: a.den },
        b: { num: b.num, den: b.den },
        instruction: input.instruction ?? 'Färbe in der Wand den größeren Bruch: Tippe auf sein letztes Teil.',
      },
    },
    check: (answer: UserInput) => answer.kind === 'fractionWall' && wallCompareMatches(rows, answer.selected, a, b),
  }
}

export interface DivideToolTaskInput {
  /** Must not name the number of parts: finding a fair division is the task. */
  question: string
  /** Chocolate bars (bar) or pizzas / cakes (circle). */
  shape: DivideShape
  /** Number of wholes, 1..4. */
  count: number
  /** Number of people sharing, 2..6. Drawn as "Kind 1" … "Kind n". */
  persons: number
  /** Singular noun for the worksheet ("Jedes Kind bekommt ___ Pizza"). Default: Schokoriegel (bar) / Pizza (circle). */
  objectName?: string
  solution: string
  explanation: string
  instruction?: string
  dedupeKey?: string
}

/** Dividing tool: cut every whole into equal parts (stepper) and hand all parts out so that everyone gets count/persons. */
export const divideToolTask = (input: DivideToolTaskInput): Task => {
  const { shape, count, persons } = input
  if (shape !== 'bar' && shape !== 'circle') {
    throw new Error(`divideToolTask: shape must be 'bar' or 'circle', got ${String(shape)}`)
  }
  if (!Number.isInteger(count) || count < DIVIDE_MIN_COUNT || count > DIVIDE_MAX_COUNT) {
    throw new Error(`divideToolTask: count must be ${DIVIDE_MIN_COUNT}..${DIVIDE_MAX_COUNT}, got ${count}`)
  }
  if (!Number.isInteger(persons) || persons < DIVIDE_MIN_PERSONS || persons > DIVIDE_MAX_PERSONS) {
    throw new Error(`divideToolTask: persons must be ${DIVIDE_MIN_PERSONS}..${DIVIDE_MAX_PERSONS}, got ${persons}`)
  }
  if (count % persons === 0) {
    throw new Error(`divideToolTask: ${count} wholes share among ${persons} without dividing; choose other numbers`)
  }
  const solvable = divideSolvableParts(count, persons)
  if (solvable.length === 0) {
    throw new Error(`divideToolTask: no number of parts (1..12) shares ${count} wholes among ${persons}`)
  }
  const parts = solvable[0]!
  const objectName = input.objectName?.trim() || (shape === 'bar' ? 'Schokoriegel' : 'Pizza')
  return {
    question: input.question,
    answerKind: 'fraction',
    solution: input.solution,
    explanation: input.explanation,
    ...(input.dedupeKey?.trim() ? { dedupeKey: input.dedupeKey.trim() } : {}),
    sampleAnswer: { kind: 'divideTool', partsPerWhole: parts, assignment: divideSolutionAssignment(count, persons, parts)! },
    interactive: {
      type: 'divideTool',
      props: {
        shape,
        count,
        persons,
        objectName,
        instruction:
          input.instruction ??
          'Teile jedes Ganze mit „+“ in gleich große Teile. Tippe dann ein Teil an und danach das Kind, das es bekommt. Alle Kinder sollen gleich viel bekommen.',
      },
    },
    check: (answer: UserInput) =>
      answer.kind === 'divideTool' && divideMatches(count, persons, answer.partsPerWhole, answer.assignment),
  }
}
