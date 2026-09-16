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

interface DigitGridTaskInput {
  question: string
  /** First operand. */
  a: number
  /** Second operand. */
  b: number
  /** Operator shown on the second row. */
  operator: '+' | '−' | '·'
  /** Correct numeric result. */
  value: number
  solution: string
  explanation: string
}

/** Right-align digit strings into a fixed-width cell array. */
export const padDigits = (n: number, width: number): string[] => {
  const s = String(Math.abs(n))
  const cells = Array.from({ length: width }, () => '')
  const offset = width - s.length
  for (let i = 0; i < s.length; i++) cells[offset + i] = s[i]
  return cells
}

/** Parse digit-grid cells into an integer (leading empty cells ignored). */
export const parseDigitGrid = (digits: string[]): number | null => {
  const joined = digits.join('').replace(/\D/g, '')
  if (!joined) return null
  return parseInteger(joined)
}

const emptyCells = (width: number): string[] => Array.from({ length: width }, () => '')

/** Build a written-arithmetic task with a digit grid (Kästchenpapier) for + / −. */
export const digitGridTask = (input: DigitGridTaskInput): Task => {
  const width = Math.max(
    String(Math.abs(input.a)).length,
    String(Math.abs(input.b)).length,
    String(Math.abs(input.value)).length,
  )
  const sampleDigits = padDigits(input.value, width)
  return {
    question: input.question,
    answerKind: 'integer',
    solution: input.solution,
    explanation: input.explanation,
    sampleAnswer: { kind: 'digitGrid', digits: sampleDigits },
    interactive: {
      type: 'digitGrid',
      props: {
        rows: [
          { digits: padDigits(input.a, width) },
          { prefix: input.operator, digits: padDigits(input.b, width) },
          { rule: true, digits: emptyCells(width) },
          { editable: true, digits: emptyCells(width), tone: 'red' },
        ],
        answerLength: width,
        layout: 'stack',
      },
    },
    check: (answer: UserInput) => {
      if (answer.kind === 'digitGrid') {
        const parsed = parseDigitGrid(answer.digits)
        return parsed !== null && parsed === input.value
      }
      if (answer.kind === 'value') {
        const parsed = parseInteger(answer.value)
        return parsed !== null && parsed === input.value
      }
      return false
    },
  }
}

export { digitGridMultiplyTask, digitGridDivideTask } from './digitGridTasks'

interface ChoicePickTaskInput {
  question: string
  /** Visible choice labels (also used as answer ids unless `ids` is set). */
  choices: string[]
  /** Correct choice label (or id if `ids` provided). */
  correct: string
  solution: string
  explanation: string
  visualContent?: string
  /** Optional instruction above the buttons. */
  instruction?: string
}

/** Multiple-choice via tappable buttons (A/B/C, Winkelart, Kongruenzsatz, …). */
export const choicePickTask = (input: ChoicePickTaskInput): Task => {
  const accepted = [input.correct, input.correct.toLowerCase()]
  return {
    question: input.question,
    answerKind: 'text',
    solution: input.solution,
    explanation: input.explanation,
    visualContent: input.visualContent,
    sampleAnswer: { kind: 'choicePick', choice: input.correct },
    interactive: {
      type: 'choicePick',
      props: {
        choices: input.choices,
        instruction: input.instruction ?? 'Wähle die richtige Antwort:',
      },
    },
    check: (answer: UserInput) => {
      if (answer.kind === 'choicePick') {
        return accepted.includes(answer.choice.trim().toLowerCase()) ||
          answer.choice.trim() === input.correct
      }
      if (answer.kind === 'value') {
        return accepted.includes(answer.value.trim().toLowerCase())
      }
      return false
    },
  }
}

interface MultiSelectTaskInput {
  question: string
  choices: string[]
  /** Correct subset (order ignored). */
  correct: string[]
  solution: string
  explanation: string
  visualContent?: string
  instruction?: string
}

const sameSet = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false
  const want = new Set(b.map((x) => x.trim()))
  return a.every((x) => want.has(x.trim()))
}

/** Multi-select buttons (Mantel-Flächen, mehrere Sektoren, …). */
export const multiSelectTask = (input: MultiSelectTaskInput): Task => ({
  question: input.question,
  answerKind: 'text',
  solution: input.solution,
  explanation: input.explanation,
  visualContent: input.visualContent,
  sampleAnswer: { kind: 'multiSelect', selected: [...input.correct] },
  interactive: {
    type: 'multiSelect',
    props: {
      choices: input.choices,
      instruction: input.instruction ?? 'Tippe alle zutreffenden Flächen / Optionen:',
    },
  },
  check: (answer: UserInput) => {
    if (answer.kind === 'multiSelect') {
      return sameSet(answer.selected, input.correct)
    }
    if (answer.kind === 'value') {
      const parts = answer.value
        .split(/[,;+/]|und/i)
        .map((s) => s.trim())
        .filter(Boolean)
      return sameSet(parts, input.correct)
    }
    return false
  },
})

interface CoordinateClickTaskInput {
  question: string
  x: number
  y: number
  solution: string
  explanation: string
  xRange?: [number, number]
  yRange?: [number, number]
  cellSize?: number
  /** Optional instruction above the grid. */
  instruction?: string
  visualContent?: string
  /** Fixed markers on the grid (e.g. Taschenlampe, Spalt). */
  markers?: Array<{ x: number; y: number; label?: string; color?: string }>
  /** Guide segment shown while answering (e.g. Lampe → Spalt). */
  guide?: { from: { x: number; y: number }; to: { x: number; y: number } }
  /** Ray drawn after checking (Auflösung). */
  solutionRay?: { from: { x: number; y: number }; to: { x: number; y: number } }
}

/** Place a point on a coordinate grid by clicking (snaps to lattice). */
export const coordinateClickTask = (input: CoordinateClickTaskInput): Task => {
  const xRange = input.xRange ?? [-5, 8]
  const yRange = input.yRange ?? [-5, 8]
  return {
    question: input.question,
    answerKind: 'text',
    solution: input.solution,
    explanation: input.explanation,
    visualContent: input.visualContent,
    sampleAnswer: { kind: 'coordinateClick', x: input.x, y: input.y },
    interactive: {
      type: 'coordinateClick',
      props: {
        xRange,
        yRange,
        cellSize: input.cellSize ?? 32,
        instruction: input.instruction ?? 'Tippe auf den gesuchten Punkt im Koordinatensystem:',
        markers: input.markers,
        guide: input.guide,
        solutionRay: input.solutionRay,
      },
    },
    check: (answer: UserInput) => {
      if (answer.kind === 'coordinateClick') {
        return answer.x === input.x && answer.y === input.y
      }
      if (answer.kind === 'value') {
        const raw = answer.value.trim().toLowerCase()
        const m = raw.match(/(-?\d+)\s*[;|,]\s*(-?\d+)/) ||
          raw.match(/\(\s*(-?\d+)\s*[|;,]\s*(-?\d+)\s*\)/)
        if (!m) return false
        return +m[1] === input.x && +m[2] === input.y
      }
      return false
    },
  }
}

export interface ParamSliderSpec {
  id: string
  label: string
  min: number
  max: number
  step?: number
  /** Starting value before the learner moves the slider. */
  start?: number
  /** Hide the live numeric readout (e.g. Schatten: Lampe ohne x-Anzeige). */
  hideValue?: boolean
}

interface ParamSliderTaskInput {
  question: string
  params: ParamSliderSpec[]
  /** Correct values keyed by param id. */
  correct: Record<string, number>
  solution: string
  explanation: string
  visualContent?: string
  /** Optional live preview: 'linear' or Physik 'shadow' (lamp x). */
  preview?: 'linear' | 'shadow'
  /** With preview=shadow: keep this shadow side fixed while the lamp moves. */
  fixedShadowSide?: 'left' | 'right'
  /**
   * 'exact' (default): each param must match.
   * 'sign': for each param, any non-zero value with the same sign as correct passes
   * (used for Schatten: Lampe auf die passende Seite stellen).
   */
  match?: 'exact' | 'sign'
  instruction?: string
}

/** One or more numeric sliders (e.g. Steigung m, Achsenabschnitt n). */
export const paramSliderTask = (input: ParamSliderTaskInput): Task => ({
  question: input.question,
  answerKind: 'integer',
  solution: input.solution,
  explanation: input.explanation,
  visualContent: input.visualContent,
  sampleAnswer: { kind: 'paramSlider', values: { ...input.correct } },
  interactive: {
    type: 'paramSlider',
    props: {
      params: input.params,
      preview: input.preview,
      fixedShadowSide: input.fixedShadowSide,
      instruction: input.instruction ?? 'Stelle die Parameter ein:',
    },
  },
  check: (answer: UserInput) => {
    const match = input.match ?? 'exact'
    if (answer.kind === 'paramSlider') {
      return input.params.every((p) => {
        const got = answer.values[p.id]
        const want = input.correct[p.id]
        if (got === undefined || want === undefined) return false
        if (match === 'sign') {
          if (got === 0 || want === 0) return false
          return Math.sign(got) === Math.sign(want)
        }
        const tol = (p.step ?? 1) / 2
        return Math.abs(got - want) <= tol + 1e-9
      })
    }
    if (answer.kind === 'value' && input.params.length === 1) {
      const id = input.params[0]!.id
      const want = input.correct[id]
      const got = Number(String(answer.value).replace(',', '.'))
      if (!Number.isFinite(got) || want === undefined) return false
      if (match === 'sign') {
        if (got === 0 || want === 0) return false
        return Math.sign(got) === Math.sign(want)
      }
      const tol = (input.params[0]!.step ?? 1) / 2
      return Math.abs(got - want) <= tol + 1e-9
    }
    return false
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
