import { approxEqual, parseInteger, parseNumber } from '../lib/num'
import {
  equals as fracEquals,
  isReduced,
  type Fraction,
} from '../lib/fraction'
import type { AnswerKind, Task, UserInput } from './types'
import type { Rng } from '../lib/rng'

interface ValueTaskInput {
  question: string
  unit?: string
  answerKind: Exclude<AnswerKind, 'fraction'>
  /** The correct numeric value. */
  value: number
  solution: string
  explanation: string
  /** Tolerance for decimal comparisons. */
  eps?: number
}

/** Build a task whose answer is a single integer or decimal value. */
export const valueTask = (input: ValueTaskInput): Task => ({
  question: input.question,
  unit: input.unit,
  answerKind: input.answerKind,
  solution: input.solution,
  explanation: input.explanation,
  sampleAnswer: { kind: 'value', value: String(input.value) },
  check: (answer: UserInput) => {
    if (answer.kind !== 'value') return false
    if (input.answerKind === 'integer') {
      const parsed = parseInteger(answer.value)
      return parsed !== null && parsed === input.value
    }
    const parsed = parseNumber(answer.value)
    return parsed !== null && approxEqual(parsed, input.value, input.eps ?? 1e-6)
  },
})

interface TextTaskInput {
  question: string
  /** Accepted answers (case-insensitive, whitespace-trimmed). */
  accepted: string[]
  solution: string
  explanation: string
}

/** Build a task whose answer is checked as free text (e.g. "<", ">", "="). */
export const textTask = (input: TextTaskInput): Task => {
  const accepted = input.accepted.map((a) => a.trim().toLowerCase())
  return {
    question: input.question,
    answerKind: 'text',
    solution: input.solution,
    explanation: input.explanation,
    check: (answer: UserInput) =>
      answer.kind === 'value' &&
      accepted.includes(answer.value.trim().toLowerCase()),
    sampleAnswer: { kind: 'value', value: input.accepted[0] },
  }
}

interface FractionTaskInput {
  question: string
  unit?: string
  /** The correct fraction. */
  value: Fraction
  solution: string
  explanation: string
  /** Require the answer to be fully reduced (for "Kürzen"). */
  requireReduced?: boolean
}

/** Build a task whose answer is a fraction (two input fields). */
export const fractionTask = (input: FractionTaskInput): Task => ({
  question: input.question,
  unit: input.unit,
  answerKind: 'fraction',
  solution: input.solution,
  explanation: input.explanation,
  sampleAnswer: {
    kind: 'fraction',
    num: String(input.value.n),
    den: String(input.value.d),
  },
  check: (answer: UserInput) => {
    if (answer.kind !== 'fraction') return false
    const num = parseInteger(answer.num)
    const den = parseInteger(answer.den)
    if (num === null || den === null || den === 0) return false
    const given = { n: num, d: den }
    if (!fracEquals(given, input.value)) return false
    if (input.requireReduced) return isReduced(given)
    return true
  },
})

interface NumberLineTaskInput {
  question: string
  min: number
  max: number
  step: number
  /** The correct value on the number line. */
  value: number
  solution: string
  explanation: string
  /** Number of decimal places for display. */
  decimals?: number
  /** Tolerance for comparison. */
  eps?: number
}

/** Build an interactive number line task. */
export const numberLineTask = (input: NumberLineTaskInput): Task => ({
  question: input.question,
  answerKind: 'integer', // Fallback for non-interactive mode
  solution: input.solution,
  explanation: input.explanation,
  sampleAnswer: { kind: 'numberLine', value: input.value },
  interactive: {
    type: 'numberLine',
    props: {
      min: input.min,
      max: input.max,
      step: input.step,
      decimals: input.decimals ?? 0,
    },
  },
  check: (answer: UserInput) => {
    if (answer.kind === 'numberLine') {
      return approxEqual(answer.value, input.value, input.eps ?? input.step / 2)
    }
    if (answer.kind === 'value') {
      const parsed = parseNumber(answer.value)
      return parsed !== null && approxEqual(parsed, input.value, input.eps ?? input.step / 2)
    }
    return false
  },
})

interface DragDropSortTaskInput {
  question: string
  /** Items with labels and values. */
  items: Array<{ label: string; value: number }>
  /** Correct order (indices of items, sorted). */
  correctOrder: number[]
  solution: string
  explanation: string
}

/** Build a drag-drop sorting task. */
export const dragDropSortTask = (input: DragDropSortTaskInput): Task => ({
  question: input.question,
  answerKind: 'text', // Fallback for non-interactive mode
  solution: input.solution,
  explanation: input.explanation,
  sampleAnswer: { kind: 'dragDropSort', order: input.correctOrder },
  interactive: {
    type: 'dragDropSort',
    props: {
      items: input.items,
    },
  },
  check: (answer: UserInput) => {
    if (answer.kind === 'dragDropSort') {
      if (answer.order.length !== input.correctOrder.length) return false
      return answer.order.every((idx, i) => idx === input.correctOrder[i])
    }
    // Fallback: accept text answer (e.g., "1,5 m")
    if (answer.kind === 'value') {
      const expected = input.items[input.correctOrder[0]].label
      return answer.value.trim().toLowerCase() === expected.trim().toLowerCase()
    }
    return false
  },
})

interface VisualTaskInput {
  question: string
  unit?: string
  answerKind: Exclude<AnswerKind, 'fraction'>
  value: number
  solution: string
  explanation: string
  /** SVG visual content (e.g., geometry diagram). */
  visualContent: string
  eps?: number
}

/** Build a task with visual SVG content (e.g., geometry diagrams). */
export const visualTask = (input: VisualTaskInput): Task => ({
  question: input.question,
  unit: input.unit,
  answerKind: input.answerKind,
  solution: input.solution,
  explanation: input.explanation,
  visualContent: input.visualContent,
  sampleAnswer: { kind: 'value', value: String(input.value) },
  check: (answer: UserInput) => {
    if (answer.kind !== 'value') return false
    if (input.answerKind === 'integer') {
      const parsed = parseInteger(answer.value)
      return parsed !== null && parsed === input.value
    }
    const parsed = parseNumber(answer.value)
    return parsed !== null && approxEqual(parsed, input.value, input.eps ?? 1e-6)
  },
})

/**
 * Combine multiple task generators into one, randomly selecting a variant each time.
 * Use this to add variety to a topic (text, visual, interactive).
 */
export const mixedVariants = (...generators: Array<(rng: Rng) => Task>) => {
  return (rng: Rng): Task => {
    const pick = (arr: any[]) => arr[Math.floor(rng() * arr.length)]
    const generator = pick(generators)
    return generator(rng)
  }
}
