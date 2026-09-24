import { approxEqual, parseInteger, parseNumber } from '../lib/num'
import {
  equals as fracEquals,
  isReduced,
  type Fraction,
} from '../lib/fraction'
import type { AnswerKind, Fachwissen, Task, UserInput } from './types'

/** Spread optional per-task Fachwissen onto a Task. */
const withFw = (fw?: Fachwissen): { fachwissen?: Fachwissen } =>
  fw?.text?.trim() ? { fachwissen: fw } : {}

/** Spread optional round-dedupe key onto a Task. */
const withDedupe = (key?: string): { dedupeKey?: string } =>
  key?.trim() ? { dedupeKey: key.trim() } : {}
import type { Rng } from '../lib/rng'
import { createRng } from '../lib/rng'
import {
  emptyCoordinateScene,
  scenesMatch,
  type CoordinateScene,
  type SnapMode,
} from '../lib/coordinateScene'
import {
  applyOps as eqApplyOps,
  isSolved as eqIsSolved,
  opKey as eqOpKey,
  parseOpKey as eqParseOpKey,
  solutionX as eqSolutionX,
  type EqOp,
  type LinEq,
} from '../lib/equationSteps'

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
  visualContent?: string
  /** Question-specific Fachwissen (overrides topic-level in PracticeSession). */
  fachwissen?: Fachwissen
  /** Round-dedupe identity (same key → treated as duplicate in a round). */
  dedupeKey?: string
}

/** Build a task whose answer is a single integer or decimal value. */
export const valueTask = (input: ValueTaskInput): Task => ({
  question: input.question,
  unit: input.unit,
  answerKind: input.answerKind,
  solution: input.solution,
  explanation: input.explanation,
  visualContent: input.visualContent,
  ...withFw(input.fachwissen),
  ...withDedupe(input.dedupeKey),
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
  visualContent?: string
  fachwissen?: Fachwissen
}

/** Build a task whose answer is checked as free text (e.g. "<", ">", "="). */
export const textTask = (input: TextTaskInput): Task => {
  const accepted = input.accepted.map((a) => a.trim().toLowerCase())
  return {
    question: input.question,
    answerKind: 'text',
    solution: input.solution,
    explanation: input.explanation,
    visualContent: input.visualContent,
    ...withFw(input.fachwissen),
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
  /** Spacing between labeled ticks (defaults to step×5). */
  labelStep?: number
  /** Visual style: horizontal line or vertical thermometer. */
  variant?: 'line' | 'thermometer'
}

/** Build an interactive number line (or thermometer) task. */
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
      ...(input.labelStep != null ? { labelStep: input.labelStep } : {}),
      ...(input.variant ? { variant: input.variant } : {}),
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
  visualContent?: string
  fachwissen?: Fachwissen
  /**
   * Optional RNG for the initial display shuffle. When omitted, a seed is
   * derived from question + items so the result is deterministic but not the
   * solved order.
   */
  rng?: Rng
}

/** Stable 32-bit seed from a string (FNV-1a). */
export function hashStringSeed(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * Shuffle sort items so the initial display is not already the solution.
 * Remaps `correctOrder` to the new item indices.
 */
export function presentSortItemsShuffled(
  items: Array<{ label: string; value: number }>,
  correctOrder: number[],
  rng: Rng,
): { items: Array<{ label: string; value: number }>; correctOrder: number[] } {
  const n = items.length
  if (n <= 1) return { items: [...items], correctOrder: [...correctOrder] }

  const perm = Array.from({ length: n }, (_, i) => i)
  const isSolvedOrder = () =>
    correctOrder.length === n && correctOrder.every((itemIdx, pos) => perm[pos] === itemIdx)

  const fisherYates = () => {
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[perm[i], perm[j]] = [perm[j]!, perm[i]!]
    }
  }

  for (let attempt = 0; attempt < 32; attempt++) {
    fisherYates()
    if (!isSolvedOrder()) break
  }
  if (isSolvedOrder()) {
    ;[perm[0], perm[1]] = [perm[1]!, perm[0]!]
    if (isSolvedOrder() && n > 2) {
      const last = perm.pop()!
      perm.unshift(last)
    }
  }

  const newItems = perm.map((i) => items[i]!)
  const oldToNew = new Map(perm.map((oldIdx, newIdx) => [oldIdx, newIdx] as const))
  const newCorrectOrder = correctOrder.map((oldIdx) => oldToNew.get(oldIdx)!)
  return { items: newItems, correctOrder: newCorrectOrder }
}

/** Build a drag-drop sorting task (items are shuffled so they are not already sorted). */
export const dragDropSortTask = (input: DragDropSortTaskInput): Task => {
  const rng =
    input.rng ??
    createRng(
      hashStringSeed(
        `${input.question}\0${input.items.map((i) => `${i.value}:${i.label}`).join('\0')}\0${input.correctOrder.join(',')}`,
      ) ^ 0x50a7,
    )
  const presented = presentSortItemsShuffled(input.items, input.correctOrder, rng)
  return {
    question: input.question,
    answerKind: 'text', // Fallback for non-interactive mode
    solution: input.solution,
    explanation: input.explanation,
    visualContent: input.visualContent,
    ...withFw(input.fachwissen),
    sampleAnswer: { kind: 'dragDropSort', order: presented.correctOrder },
    interactive: {
      type: 'dragDropSort',
      props: {
        items: presented.items,
      },
    },
    check: (answer: UserInput) => {
      if (answer.kind === 'dragDropSort') {
        if (answer.order.length !== presented.correctOrder.length) return false
        return answer.order.every((idx, i) => idx === presented.correctOrder[i])
      }
      // Fallback: accept text answer (e.g., "1,5 m")
      if (answer.kind === 'value') {
        const expected = presented.items[presented.correctOrder[0]!]?.label
        return (
          expected !== undefined &&
          answer.value.trim().toLowerCase() === expected.trim().toLowerCase()
        )
      }
      return false
    },
  }
}

/** How formula slot answers are compared. */
export type DragDropSlotsCheckMode = 'strict' | 'commutativeFactors' | 'anyOrder' | 'endsSwap'

interface DragDropSlotsTaskInput {
  question: string
  /** All chips in the pool (may include unused distractors). */
  items: Array<{ label: string; value: number }>
  /** Correct item index for each formula slot. */
  correctSlots: number[]
  solution: string
  explanation: string
  instruction?: string
  visualContent?: string
  fachwissen?: Fachwissen
  /**
   * Labels for each slot (Begriff links → Erklärung rechts).
   * When set, the UI stacks terms on the left with drop targets on the right.
   */
  slotLabels?: string[]
  /**
   * `strict`: slots must match left→right (by label).
   * `commutativeFactors`: left of `=` stays fixed; multiplied factors after `=` may be any order.
   * `anyOrder`: all correct chips may appear in any order (e.g. `+ ↔ −` ≡ `− ↔ +`).
   * `endsSwap`: middle chip(s) fixed; first↔last may swap (e.g. `N →← S` ≡ `S →← N`).
   * When omitted, pure multiplication products after `=` are detected automatically.
   */
  checkMode?: DragDropSlotsCheckMode
  /** Worksheet: given equation + `|` + leading op slots, then remaining line slots. */
  worksheet?: {
    given: string
    opSlotCount: number
    lineHint?: string
  }
  /** Require typed numeric result (e.g. final x). */
  resultValue?: number
  resultLabel?: string
  /** Optional RNG for pool shuffle (otherwise seeded from question + chips). */
  rng?: Rng
}

/**
 * Shuffle formula-pool chips so the left-to-right order is not already the solution
 * (with distractors merely tacked on at the end). Remaps `correctSlots`.
 */
export function presentSlotItemsShuffled(
  items: Array<{ label: string; value: number }>,
  correctSlots: number[],
  rng: Rng,
): { items: Array<{ label: string; value: number }>; correctSlots: number[] } {
  const n = items.length
  if (n <= 1) return { items: [...items], correctSlots: [...correctSlots] }

  const perm = Array.from({ length: n }, (_, i) => i)
  /** Pool prefix mirrors the formula left→right (classic spoiler). */
  const isSpoilerPrefix = () =>
    correctSlots.length > 0 &&
    correctSlots.every((itemIdx, pos) => pos < n && perm[pos] === itemIdx)

  const fisherYates = () => {
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[perm[i], perm[j]] = [perm[j]!, perm[i]!]
    }
  }

  for (let attempt = 0; attempt < 32; attempt++) {
    fisherYates()
    if (!isSpoilerPrefix()) break
  }
  if (isSpoilerPrefix()) {
    ;[perm[0], perm[n - 1]] = [perm[n - 1]!, perm[0]!]
    if (isSpoilerPrefix() && n > 2) {
      const last = perm.pop()!
      perm.unshift(last)
    }
  }

  const newItems = perm.map((i) => items[i]!)
  const oldToNew = new Map(perm.map((oldIdx, newIdx) => [oldIdx, newIdx] as const))
  const newCorrectSlots = correctSlots.map((oldIdx) => oldToNew.get(oldIdx)!)
  return { items: newItems, correctSlots: newCorrectSlots }
}

const MULT_OP = /^[×·*]$/
const NONCOMM_OP = /^[+\-/÷]$/
/** Chip like `× b`, `· g`, `/ V`, `+ 273` (operator glued to the factor). */
const LEADING_OP = /^([×·*+\-/÷])\s+/

/** Index of the first RHS slot (after a chip that is or ends with `=`). */
export function formulaEqualsRhsStart(
  items: Array<{ label: string }>,
  slots: number[],
): number {
  for (let i = 0; i < slots.length; i++) {
    const label = items[slots[i]!]?.label?.trim() ?? ''
    if (label === '=' || /=\s*$/.test(label)) return i + 1
  }
  return 0
}

function rhsChipKind(
  label: string,
): 'factor' | 'multOp' | 'noncommOp' | 'multPrefixed' | 'noncommPrefixed' {
  const t = label.trim()
  if (MULT_OP.test(t)) return 'multOp'
  if (NONCOMM_OP.test(t)) return 'noncommOp'
  const m = LEADING_OP.exec(t)
  if (m) {
    return MULT_OP.test(m[1]!) ? 'multPrefixed' : 'noncommPrefixed'
  }
  return 'factor'
}

/**
 * True when slots after `=` form a multiplication-only product
 * (factors may be reordered without changing meaning).
 */
export function isCommutativeProductFormula(
  items: Array<{ label: string }>,
  correctSlots: number[],
): boolean {
  const rhsStart = formulaEqualsRhsStart(items, correctSlots)
  const rhs = correctSlots.slice(rhsStart)
  if (rhs.length < 2) return false

  let sawMult = false
  for (let i = 0; i < rhs.length; i++) {
    const kind = rhsChipKind(items[rhs[i]!]?.label ?? '')
    if (kind === 'noncommOp' || kind === 'noncommPrefixed') return false
    if (kind === 'multOp' || kind === 'multPrefixed') sawMult = true
    // Standalone mult op must not be last and must precede a bare factor.
    if (kind === 'multOp') {
      if (i === rhs.length - 1) return false
      const next = rhsChipKind(items[rhs[i + 1]!]?.label ?? '')
      if (next !== 'factor') return false
    }
  }
  // Need an actual ×/· product, not juxtaposition like `1000` `g`.
  return sawMult
}

function sameIndexMultiset(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false
  const sa = [...a].sort((x, y) => x - y)
  const sb = [...b].sort((x, y) => x - y)
  return sa.every((v, i) => v === sb[i])
}

function sameLabelMultiset(
  items: Array<{ label: string }>,
  a: number[],
  b: number[],
): boolean {
  if (a.length !== b.length) return false
  const la = a.map((i) => items[i]?.label ?? '').sort()
  const lb = b.map((i) => items[i]?.label ?? '').sort()
  return la.every((v, i) => v === lb[i])
}

function slotLabel(items: Array<{ label: string }>, idx: number): string {
  return items[idx]?.label ?? ''
}

/**
 * Compare slot answers by label (identical chips are interchangeable).
 * Optionally allow any order of multiplied factors after `=`.
 */
export function checkDragDropSlotsAnswer(
  answerSlots: Array<number | null>,
  correctSlots: number[],
  items: Array<{ label: string }>,
  checkMode: DragDropSlotsCheckMode,
): boolean {
  if (answerSlots.length !== correctSlots.length) return false
  if (answerSlots.some((idx) => idx === null || !Number.isInteger(idx))) return false
  const filled = answerSlots as number[]

  if (checkMode === 'strict') {
    // Content match: same label sequence — duplicate chips (two „(−4)“) are equivalent
    return filled.every(
      (idx, i) => slotLabel(items, idx) === slotLabel(items, correctSlots[i]!),
    )
  }

  if (checkMode === 'anyOrder') {
    // Same chips (by label), any order — e.g. + ↔ − same as − ↔ +
    return sameLabelMultiset(items, filled, correctSlots)
  }

  if (checkMode === 'endsSwap') {
    // Middle fixed; outer ends may swap — e.g. N →← S same as S →← N
    if (filled.length < 3 || filled.length !== correctSlots.length) return false
    const midStart = 1
    const midEnd = filled.length - 1
    for (let i = midStart; i < midEnd; i++) {
      if (slotLabel(items, filled[i]!) !== slotLabel(items, correctSlots[i]!)) return false
    }
    return sameLabelMultiset(
      items,
      [filled[0]!, filled[filled.length - 1]!],
      [correctSlots[0]!, correctSlots[correctSlots.length - 1]!],
    )
  }

  const rhsStart = formulaEqualsRhsStart(items, correctSlots)
  for (let i = 0; i < rhsStart; i++) {
    if (slotLabel(items, filled[i]!) !== slotLabel(items, correctSlots[i]!)) return false
  }
  // Prefer label multiset so identical factor chips may swap; fall back to indices
  // when labels alone would be ambiguous (shouldn't happen for unique product chips).
  return (
    sameLabelMultiset(items, filled.slice(rhsStart), correctSlots.slice(rhsStart)) ||
    sameIndexMultiset(filled.slice(rhsStart), correctSlots.slice(rhsStart))
  )
}

function resolveSlotsCheckMode(
  input: DragDropSlotsTaskInput,
): DragDropSlotsCheckMode {
  if (input.checkMode) return input.checkMode
  return isCommutativeProductFormula(input.items, input.correctSlots)
    ? 'commutativeFactors'
    : 'strict'
}

/** Formula builder: drag chips into slots; extra blocks stay unused. Pool is shuffled. */
export const dragDropSlotsTask = (input: DragDropSlotsTaskInput): Task => {
  const rng =
    input.rng ??
    createRng(
      hashStringSeed(
        `${input.question}\0${input.items.map((i) => `${i.value}:${i.label}`).join('\0')}\0${input.correctSlots.join(',')}`,
      ) ^ 0x5107,
    )
  const presented = presentSlotItemsShuffled(input.items, input.correctSlots, rng)
  const checkMode = resolveSlotsCheckMode({
    ...input,
    items: presented.items,
    correctSlots: presented.correctSlots,
  })
  const askResult = input.resultValue !== undefined
  return {
    question: input.question,
    answerKind: 'text',
    solution: input.solution,
    explanation: input.explanation,
    visualContent: input.visualContent,
    ...withFw(input.fachwissen),
    sampleAnswer: {
      kind: 'dragDropSlots',
      slots: presented.correctSlots,
      ...(askResult ? { result: String(input.resultValue) } : {}),
    },
    interactive: {
      type: 'dragDropSlots',
      props: {
        items: presented.items,
        slotCount: presented.correctSlots.length,
        instruction:
          input.instruction ??
          'Ziehe die richtigen Blöcke in die Formelplätze (einen brauchst du ggf. nicht):',
        ...(input.slotLabels?.length
          ? { slotLabels: input.slotLabels }
          : {}),
        ...(input.worksheet ? { worksheet: input.worksheet } : {}),
        ...(askResult
          ? {
              askResult: true,
              resultLabel: input.resultLabel ?? 'x =',
              resultValue: input.resultValue,
            }
          : {}),
      },
    },
    check: (answer: UserInput) => {
      if (answer.kind === 'dragDropSlots') {
        const slotsOk = checkDragDropSlotsAnswer(
          answer.slots,
          presented.correctSlots,
          presented.items,
          checkMode,
        )
        if (!slotsOk) return false
        if (!askResult) return true
        const n = Number(String(answer.result ?? '').replace(',', '.').trim())
        return Number.isFinite(n) && n === input.resultValue
      }
      if (answer.kind === 'value') {
        return (
          answer.value.trim().toLowerCase() === input.solution.trim().toLowerCase()
        )
      }
      return false
    },
  }
}

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
  /** SVG for the Auflösung (after Prüfen), if different from visualContent. */
  solutionVisualContent?: string
  /** Optional instruction above the buttons. */
  instruction?: string
  /** Larger symbol buttons (e.g. force attract/repel arrows). */
  largeSymbols?: boolean
  fachwissen?: Fachwissen
  /** Round-dedupe identity (same key → treated as duplicate in a round). */
  dedupeKey?: string
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
    solutionVisualContent: input.solutionVisualContent,
    ...withFw(input.fachwissen),
    ...withDedupe(input.dedupeKey),
    sampleAnswer: { kind: 'choicePick', choice: input.correct },
    interactive: {
      type: 'choicePick',
      props: {
        choices: input.choices,
        instruction: input.instruction ?? 'Wähle die richtige Antwort:',
        ...(input.largeSymbols ? { largeSymbols: true } : {}),
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
  fachwissen?: Fachwissen
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
  ...withFw(input.fachwissen),
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
  /** Optional multi-point solution (order irrelevant). Defaults to [{x,y}]. */
  points?: Array<{ x: number; y: number }>
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
  /**
   * If set, any lattice point on the forward ray from→through (t ≥ 1) is correct,
   * not only the sample point (x|y). Ignored when `points` has length > 1.
   */
  acceptForwardRay?: { from: { x: number; y: number }; through: { x: number; y: number } }
}

/** True if p lies on the half-line starting at through, in direction from→through (incl. through). */
export function isOnForwardRay(
  from: { x: number; y: number },
  through: { x: number; y: number },
  p: { x: number; y: number },
): boolean {
  const dx = through.x - from.x
  const dy = through.y - from.y
  if (dx === 0 && dy === 0) return p.x === from.x && p.y === from.y
  const px = p.x - from.x
  const py = p.y - from.y
  if (dx * py - dy * px !== 0) return false
  const t = Math.abs(dx) >= Math.abs(dy) ? px / dx : py / dy
  return Number.isFinite(t) && t >= 1 - 1e-9
}

function samePointSet(
  a: Array<{ x: number; y: number }>,
  b: Array<{ x: number; y: number }>,
): boolean {
  if (a.length !== b.length) return false
  const used = new Set<number>()
  for (const p of a) {
    const idx = b.findIndex(
      (q, i) => !used.has(i) && q.x === p.x && q.y === p.y,
    )
    if (idx < 0) return false
    used.add(idx)
  }
  return true
}

function answerPoints(answer: UserInput): Array<{ x: number; y: number }> | null {
  if (answer.kind === 'coordinateClick') {
    if (answer.points && answer.points.length > 0) return answer.points
    if (Number.isFinite(answer.x) && Number.isFinite(answer.y)) {
      return [{ x: answer.x, y: answer.y }]
    }
    return null
  }
  if (answer.kind === 'value') {
    const raw = answer.value.trim().toLowerCase()
    const matches = [
      ...raw.matchAll(/\(\s*(-?\d+)\s*[|;,]\s*(-?\d+)\s*\)/g),
      ...raw.matchAll(/(-?\d+)\s*[;|,]\s*(-?\d+)/g),
    ]
    if (!matches.length) return null
    return matches.map((m) => ({ x: +m[1]!, y: +m[2]! }))
  }
  return null
}

/** Place one or more points on a coordinate grid by clicking (snaps to lattice). */
export const coordinateClickTask = (input: CoordinateClickTaskInput): Task => {
  const xRange = input.xRange ?? [-5, 8]
  const yRange = input.yRange ?? [-5, 8]
  const want =
    input.points && input.points.length > 0
      ? input.points
      : [{ x: input.x, y: input.y }]
  const maxPoints = want.length
  const multi = maxPoints > 1
  return {
    question: input.question,
    answerKind: 'text',
    solution: input.solution,
    explanation: input.explanation,
    visualContent: input.visualContent,
    sampleAnswer: {
      kind: 'coordinateClick',
      x: want[0]!.x,
      y: want[0]!.y,
      ...(multi ? { points: want } : {}),
    },
    interactive: {
      type: 'coordinateClick',
      props: {
        xRange,
        yRange,
        cellSize: input.cellSize ?? 32,
        maxPoints,
        instruction:
          input.instruction ??
          (multi
            ? `Tippe die ${maxPoints} gesuchten Punkte im Koordinatensystem:`
            : 'Tippe auf den gesuchten Punkt im Koordinatensystem:'),
        markers: input.markers,
        guide: input.guide,
        solutionRay: input.solutionRay,
        solutionPoints: want,
      },
    },
    check: (answer: UserInput) => {
      const got = answerPoints(answer)
      if (!got) return false
      if (!multi && input.acceptForwardRay && got.length === 1) {
        return isOnForwardRay(
          input.acceptForwardRay.from,
          input.acceptForwardRay.through,
          got[0]!,
        )
      }
      return samePointSet(got, want)
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
  /** Optional live preview: function family or Physik 'shadow' (lamp x). */
  preview?:
    | 'linear'
    | 'quadratic'
    | 'cubic'
    | 'sin'
    | 'cos'
    | 'tan'
    | 'exp'
    | 'ln'
    | 'abs'
    | 'reciprocal'
    | 'sqrt'
    | 'power'
    | 'shadow'
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

interface CoordinateDrawTaskInput {
  question: string
  solutionScene: CoordinateScene
  solution: string
  explanation: string
  /** Tools the learner may use. Default: line + segment + point + select + delete. */
  allowedTools?: Array<
    'select' | 'point' | 'segment' | 'ray' | 'line' | 'label' | 'delete'
  >
  instruction?: string
  visualContent?: string
  snap?: SnapMode
  xRange?: [number, number]
  yRange?: [number, number]
  tol?: number
}

/** Draw lines / place objects on a coordinate grid; match against a solution scene. */
export const coordinateDrawTask = (input: CoordinateDrawTaskInput): Task => {
  const blank = emptyCoordinateScene({
    xRange: input.xRange ?? input.solutionScene.xRange,
    yRange: input.yRange ?? input.solutionScene.yRange,
    snap: input.snap ?? input.solutionScene.snap ?? 'half',
    objects: [],
  })
  return {
    question: input.question,
    answerKind: 'text',
    solution: input.solution,
    explanation: input.explanation,
    visualContent: input.visualContent,
    sampleAnswer: { kind: 'coordinateDraw', scene: input.solutionScene },
    interactive: {
      type: 'coordinateDraw',
      props: {
        instruction:
          input.instruction ??
          'Zeichne die gesuchte Gerade bzw. setze die Objekte im Koordinatensystem:',
        allowedTools: input.allowedTools ?? [
          'select',
          'point',
          'segment',
          'ray',
          'line',
          'delete',
        ],
        blankScene: blank,
        solutionScene: input.solutionScene,
      },
    },
    check: (answer: UserInput) => {
      if (answer.kind !== 'coordinateDraw') return false
      return scenesMatch(answer.scene, input.solutionScene, input.tol ?? 0.35)
    },
  }
}

interface EquationStepsTaskInput {
  question: string
  start: LinEq
  buttons: EqOp[]
  /** Canonical ops for sampleAnswer / key. */
  solutionOps: EqOp[]
  solution: number
  explanation: string
  instruction?: string
  visualContent?: string
}

/** Multi-line Äquivalenzumformung with operation buttons. */
export const equationStepsTask = (input: EquationStepsTaskInput): Task => ({
  question: input.question,
  answerKind: 'text',
  solution: `x = ${input.solution}`,
  explanation: input.explanation,
  visualContent: input.visualContent,
  sampleAnswer: {
    kind: 'equationSteps',
    ops: input.solutionOps.map(eqOpKey),
  },
  interactive: {
    type: 'equationSteps',
    props: {
      start: input.start,
      buttons: input.buttons,
      solution: input.solution,
      instruction:
        input.instruction ??
        'Stelle die Gleichung Schritt für Schritt um (Tippe die Umformungen):',
    },
  },
  check: (answer: UserInput) => {
    if (answer.kind === 'equationSteps') {
      const ops = answer.ops
        .map(eqParseOpKey)
        .filter((o): o is EqOp => o !== null)
      const end = eqApplyOps(input.start, ops)
      return eqIsSolved(end) && eqSolutionX(end) === input.solution
    }
    if (answer.kind === 'value') {
      const n = Number(String(answer.value).replace(',', '.').trim())
      return Number.isFinite(n) && n === input.solution
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
