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
import {
  RATIO_MAX_LABEL_CHARS,
  RATIO_MAX_SEGMENTS,
  RATIO_MIN_SEGMENTS,
  ratioColourMatches,
  ratioColourSolution,
  ratioSplitAmounts,
  ratioSplitExact,
  ratioSplitMatches,
  formatRatioAmount,
  type RatioBarMode,
} from '../lib/ratioBarLogic'
import {
  NLM_MAX_ITEMS,
  NLM_MAX_LABEL_CHARS,
  NLM_MAX_TICKS,
  NLM_MIN_ITEMS,
  nlmChipTextFits,
  nlmDefaultLabelEvery,
  nlmLabelledTicks,
  nlmMatches,
  nlmSolution,
  nlmTickValues,
  nlmTrayOrder,
  type NlmItem,
} from '../lib/numberLineMultiLogic'
import { hashStringSeed } from '../lib/seed'
import {
  buildTreeModel,
  formatProbability,
  treeAllEdgeIds,
  treeMatches,
  validateRootLabel,
  validateTreeBlanks,
  type TreeBlanks,
  type TreeLevel,
} from '../lib/treeDiagramLogic'
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

export interface RatioBarTaskInput {
  /** May state the ratio in words or as "a : b" — representing it is the task. Do not name the field counts. */
  question: string
  /** colour (default): colour the fields of a bar. split: the divided bar is given, type the two shares of `total`. */
  mode?: RatioBarMode
  /** colour mode: number of fields, 4..12, a multiple of ratio[0] + ratio[1]. Ignored in split mode. */
  segments?: number
  /** Ratio A : B, positive integers, ratio[0] + ratio[1] <= 12. */
  ratio: [number, number]
  /** Names of the two parts for the legend, e.g. ['Saft', 'Wasser'] (at most 12 characters each). */
  labels?: [string, string]
  /** split mode: the total amount (at most two decimals; both shares must be exact with two decimals). */
  total?: number
  /** split mode: unit of the amounts, e.g. 'ml'. */
  unit?: string
  solution: string
  explanation: string
  instruction?: string
  dedupeKey?: string
}

/** Ratio bar: colour a bar so that its fields have the ratio A : B, or split a total by the ratio. */
export const ratioBarTask = (input: RatioBarTaskInput): Task => {
  const mode: RatioBarMode = input.mode ?? 'colour'
  if (mode !== 'colour' && mode !== 'split') {
    throw new Error(`ratioBarTask: mode must be 'colour' or 'split', got ${String(mode)}`)
  }
  const ratio = input.ratio
  if (!Array.isArray(ratio) || ratio.length !== 2 || !ratio.every((n) => Number.isInteger(n) && n >= 1)) {
    throw new Error(`ratioBarTask: ratio must be two positive integers, got ${JSON.stringify(ratio)}`)
  }
  const sum = ratio[0] + ratio[1]
  if (sum > RATIO_MAX_SEGMENTS) {
    throw new Error(`ratioBarTask: ratio parts must add up to at most ${RATIO_MAX_SEGMENTS}, got ${sum}`)
  }
  const labels: [string, string] = input.labels ?? ['erster Teil', 'zweiter Teil']
  for (const l of labels) {
    if (typeof l !== 'string' || l.trim() === '' || l.length > RATIO_MAX_LABEL_CHARS) {
      throw new Error(`ratioBarTask: each label needs 1..${RATIO_MAX_LABEL_CHARS} characters, got ${JSON.stringify(l)}`)
    }
  }
  const common = {
    question: input.question,
    answerKind: 'text' as const,
    solution: input.solution,
    explanation: input.explanation,
    ...(input.dedupeKey?.trim() ? { dedupeKey: input.dedupeKey.trim() } : {}),
  }
  const instruction = input.instruction

  if (mode === 'colour') {
    const segments = input.segments
    if (!Number.isInteger(segments) || segments! < RATIO_MIN_SEGMENTS || segments! > RATIO_MAX_SEGMENTS) {
      throw new Error(`ratioBarTask: segments must be ${RATIO_MIN_SEGMENTS}..${RATIO_MAX_SEGMENTS}, got ${String(segments)}`)
    }
    if (segments! % sum !== 0) {
      throw new Error(`ratioBarTask: segments (${segments}) must be a multiple of ${ratio[0]} + ${ratio[1]} = ${sum}`)
    }
    const n = segments!
    return {
      ...common,
      sampleAnswer: { kind: 'ratioBar', parts: ratioColourSolution(n, ratio) },
      interactive: {
        type: 'ratioBar',
        props: {
          mode,
          segments: n,
          ratio: [ratio[0], ratio[1]],
          labels,
          instruction:
            instruction ??
            'Tippe ein Feld an, um es zu färben: einmal für A, zweimal für B, dreimal macht es wieder leer. Färbe alle Felder.',
        },
      },
      check: (answer: UserInput) => answer.kind === 'ratioBar' && ratioColourMatches(n, ratio, answer.parts),
    }
  }

  const total = input.total
  if (typeof total !== 'number' || !Number.isFinite(total) || total <= 0 || total > 100000) {
    throw new Error(`ratioBarTask: total must be a positive number (at most 100000), got ${String(total)}`)
  }
  if (!ratioSplitExact(total, ratio)) {
    throw new Error(`ratioBarTask: ${total} split ${ratio[0]} : ${ratio[1]} is not exact with two decimals`)
  }
  const unit = input.unit?.trim() ?? ''
  const [ea, eb] = ratioSplitAmounts(total, ratio)
  return {
    ...common,
    sampleAnswer: { kind: 'ratioBar', parts: [], amounts: [formatRatioAmount(ea, unit), formatRatioAmount(eb, unit)] },
    interactive: {
      type: 'ratioBar',
      props: {
        mode,
        segments: sum,
        ratio: [ratio[0], ratio[1]],
        labels,
        total,
        unit,
        instruction: instruction ?? 'Schreibe in die beiden Felder, wie viel zu A und wie viel zu B gehört.',
      },
    },
    check: (answer: UserInput) => answer.kind === 'ratioBar' && ratioSplitMatches(total, ratio, answer.amounts),
  }
}

export interface NumberLineMultiTaskInput {
  /** Do not list the values on the line or give the order; screen-only hints belong in `instruction`. */
  question: string
  min: number
  max: number
  /** Distance between tick marks. */
  step: number
  /** Labels to place. `value` is the target; `label` the display text, e.g. '3/4' or '-1,5' (at most 7 characters). */
  items: Array<{ id: string; label: string; value: number }>
  /** Positions snap to this grid (default step / 2). `step / snap` must be a whole number and every value must lie on the grid. */
  snap?: number
  /** Allowed distance to the target value (default snap / 2). */
  tolerance?: number
  /** Numbers are written at min, max and every labelEvery-th tick (default: every tick up to 10 ticks, else every 2nd). */
  labelEvery?: number
  solution: string
  explanation: string
  instruction?: string
  dedupeKey?: string
}

const isMultipleOf = (value: number, unit: number): boolean => {
  const k = value / unit
  return Math.abs(k - Math.round(k)) < 1e-6
}

/** Several labels are dragged onto a number line (ordering fractions, decimals and negative numbers). */
export const numberLineMultiTask = (input: NumberLineMultiTaskInput): Task => {
  const { min, max, step, items } = input
  if (![min, max, step].every(Number.isFinite) || !(max > min) || !(step > 0)) {
    throw new Error(`numberLineMultiTask: need finite min < max and step > 0, got ${min}, ${max}, ${step}`)
  }
  if (!isMultipleOf(max - min, step)) {
    throw new Error(`numberLineMultiTask: max - min (${max - min}) must be a multiple of step (${step})`)
  }
  const tickCount = nlmTickValues(min, max, step).length
  if (tickCount > NLM_MAX_TICKS) {
    throw new Error(`numberLineMultiTask: at most ${NLM_MAX_TICKS} ticks, got ${tickCount}`)
  }
  const snap = input.snap ?? step / 2
  if (!(snap > 0) || snap > step || !isMultipleOf(step, snap)) {
    throw new Error(`numberLineMultiTask: step (${step}) must be a multiple of snap (${snap})`)
  }
  const tolerance = input.tolerance ?? snap / 2
  if (!(tolerance >= 0) || !Number.isFinite(tolerance)) {
    throw new Error(`numberLineMultiTask: tolerance must be >= 0, got ${tolerance}`)
  }
  const labelEvery = input.labelEvery ?? nlmDefaultLabelEvery(min, max, step)
  if (!Number.isInteger(labelEvery) || labelEvery < 1) {
    throw new Error(`numberLineMultiTask: labelEvery must be a whole number >= 1, got ${labelEvery}`)
  }
  if (!Array.isArray(items) || items.length < NLM_MIN_ITEMS || items.length > NLM_MAX_ITEMS) {
    throw new Error(`numberLineMultiTask: need ${NLM_MIN_ITEMS}..${NLM_MAX_ITEMS} items`)
  }
  const written = nlmLabelledTicks(min, max, step, labelEvery)
  const ids = new Set<string>()
  for (const it of items) {
    if (!it.id || ids.has(it.id)) throw new Error(`numberLineMultiTask: item ids must be unique and non-empty, got ${JSON.stringify(it.id)}`)
    ids.add(it.id)
    if (typeof it.label !== 'string' || it.label.trim() === '' || it.label.length > NLM_MAX_LABEL_CHARS || !nlmChipTextFits(it.label)) {
      throw new Error(`numberLineMultiTask: label needs 1..${NLM_MAX_LABEL_CHARS} characters, got ${JSON.stringify(it.label)}`)
    }
    if (!Number.isFinite(it.value) || it.value < min - 1e-9 || it.value > max + 1e-9) {
      throw new Error(`numberLineMultiTask: value ${it.value} of "${it.label}" is outside ${min}..${max}`)
    }
    if (!isMultipleOf(it.value - min, snap)) {
      throw new Error(`numberLineMultiTask: value ${it.value} of "${it.label}" is not on the snap grid (${snap})`)
    }
    if (written.some((w) => Math.abs(w - it.value) < 1e-9)) {
      throw new Error(`numberLineMultiTask: value ${it.value} of "${it.label}" is already written on the line`)
    }
  }
  const values = items.map((i) => Math.round(i.value * 1e9))
  if (new Set(values).size !== values.length) throw new Error('numberLineMultiTask: item values must differ')

  const nlmItems: NlmItem[] = items.map((i) => ({ id: i.id, label: i.label, value: i.value }))
  const order = nlmTrayOrder(nlmItems, hashStringSeed(`${input.question}|${items.map((i) => i.id).join(',')}`))
  return {
    question: input.question,
    answerKind: 'text',
    solution: input.solution,
    explanation: input.explanation,
    ...(input.dedupeKey?.trim() ? { dedupeKey: input.dedupeKey.trim() } : {}),
    sampleAnswer: { kind: 'numberLineMulti', positions: nlmSolution(nlmItems) },
    interactive: {
      type: 'numberLineMulti',
      props: {
        min,
        max,
        step,
        snap,
        labelEvery,
        // The target values stay in `check`; the props only carry what the widget needs to draw.
        items: items.map((i) => ({ id: i.id, label: i.label })),
        order,
        instruction:
          input.instruction ??
          'Ziehe jede Zahl aus dem Feld oben an ihre Stelle auf der Zahlengeraden. Zurück ins Feld ziehen nimmt sie wieder weg.',
      },
    },
    check: (answer: UserInput) => answer.kind === 'numberLineMulti' && nlmMatches(nlmItems, answer.positions, tolerance),
  }
}

export interface TreeDiagramTaskInput {
  /** Do not state the blank values; screen-only hints belong in `instruction`. */
  question: string
  /** 1-2 levels with 2-3 outcomes each (labels at most 6 characters). Level 2 repeats for every outcome of level 1. */
  levels: TreeLevel[]
  /** A fraction or decimal for EVERY edge ("0", "1", "0.0", "0.1" ...). Siblings must add up to 1. Different level-2 values per parent are fine (drawing without replacement). */
  probabilities: Record<string, string>
  /** Fields the learner fills: branch ids and leaf (path) ids. All other branches are shown; other leaves stay empty. */
  blanks: TreeBlanks
  /** Label of the start of the tree (default: none). */
  rootLabel?: string
  solution: string
  explanation: string
  instruction?: string
  dedupeKey?: string
}

/** A tree diagram whose branch probabilities and/or path probabilities (product along the path) are typed in. */
export const treeDiagramTask = (input: TreeDiagramTaskInput): Task => {
  const { levels, probabilities, blanks } = input
  const model = buildTreeModel(levels, probabilities)
  validateTreeBlanks(levels, blanks)
  validateRootLabel(input.rootLabel?.trim())
  const given: Record<string, string> = {}
  for (const id of treeAllEdgeIds(levels)) {
    if (!blanks.branches.includes(id)) given[id] = probabilities[id]!.trim()
  }
  const sampleBranches: Record<string, string> = {}
  for (const id of blanks.branches) sampleBranches[id] = probabilities[id]!.trim()
  const sampleLeaves: Record<string, string> = {}
  for (const id of blanks.leaves) sampleLeaves[id] = formatProbability(model.leaves[id]!)
  const asksLeaves = blanks.leaves.length > 0
  const asksBranches = blanks.branches.length > 0
  return {
    question: input.question,
    answerKind: 'text',
    solution: input.solution,
    explanation: input.explanation,
    ...(input.dedupeKey?.trim() ? { dedupeKey: input.dedupeKey.trim() } : {}),
    sampleAnswer: { kind: 'treeDiagram', branches: sampleBranches, leaves: sampleLeaves },
    interactive: {
      type: 'treeDiagram',
      props: {
        levels: levels.map((l) => ({ outcomes: [...l.outcomes] })),
        // Only the shown values; the expected values of the blanks stay in `check`.
        given,
        blankBranches: [...blanks.branches],
        blankLeaves: [...blanks.leaves],
        ...(input.rootLabel?.trim() ? { rootLabel: input.rootLabel.trim() } : {}),
        instruction:
          input.instruction ??
          `Trage ${asksBranches && asksLeaves ? 'die Wahrscheinlichkeiten an den Zweigen und am Ende der Pfade' : asksLeaves ? 'die Wahrscheinlichkeiten am Ende der Pfade' : 'die fehlenden Wahrscheinlichkeiten an den Zweigen'} in die Felder ein. Brüche (3/10), Dezimalzahlen (0,3) und Prozent (30 %) sind erlaubt.`,
      },
    },
    check: (answer: UserInput) => answer.kind === 'treeDiagram' && treeMatches(model, blanks, answer.branches, answer.leaves),
  }
}
