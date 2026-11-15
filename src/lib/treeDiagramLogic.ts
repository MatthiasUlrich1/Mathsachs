/**
 * Tree diagram (Baumdiagramm) the learner fills in: pure logic, layout and print drawing.
 *
 * Edge ids are paths of outcome indexes: level-1 edges "0", "1"; level-2 edges "0.0", "0.1", "1.0" ...
 * A leaf has the id of its full path (with two levels "0.1", with one level the same id as the edge).
 * Probabilities are compared as exact fractions (3/10 = 0,3 = 30 %).
 */
import { add, equals, format, makeFraction, multiply, type Fraction } from './fraction'

export interface TreeLevel {
  outcomes: string[]
}

export const TREE_MIN_OUTCOMES = 2
export const TREE_MAX_OUTCOMES = 3
export const TREE_MAX_LEVELS = 2
export const TREE_MAX_LABEL_CHARS = 6

// ---- Layout constants shared by the component, the print drawing and the fit tests ----
/** Content width (px) the layout must hold at: a 375 px phone minus 2 x 16 px gutter. */
export const TREE_MIN_WIDTH_PX = 343
/** Vertical distance between two neighbouring leaves (px). */
export const TREE_ROW_PX = 76
/** Branch fields sit at this fraction of the edge, counted from the parent (keeps sibling fields 44+ px apart). */
export const TREE_EDGE_T = 0.6
export const TREE_INPUT_W_PX = 56
export const TREE_INPUT_H_PX = 44
export const TREE_CHIP_W_PCT = 15
export const TREE_CHIP_H_PX = 32
export const TREE_CHIP_FONT_PX = 13
export const TREE_ROOT_X = 1.5
export const TREE_LEAF_INPUT_X = 88

export const treeChipTextFits = (label: string, widthPx = TREE_MIN_WIDTH_PX): boolean =>
  label.length * TREE_CHIP_FONT_PX * 0.6 <= (TREE_CHIP_W_PCT / 100) * widthPx - 4

// ---- Parsing ----

const MAX_DIGITS = 9

/** "3/10", "0,3", "0.3", "30 %" -> exact fraction; anything else (negative, text, a/0) -> null. */
export const parseProbability = (raw: string): Fraction | null => {
  const s = raw.trim()
  const frac = /^(\d{1,9})\s*\/\s*(\d{1,9})$/.exec(s)
  if (frac) {
    const d = Number(frac[2])
    return d === 0 ? null : makeFraction(Number(frac[1]), d)
  }
  const dec = /^(\d*)[.,](\d+)\s*(%?)$/.exec(s) ?? /^(\d+)()\s*(%?)$/.exec(s)
  if (!dec) return null
  const whole = dec[1] ?? ''
  const part = dec[2] ?? ''
  if (whole === '' && part === '') return null
  if (whole.length + part.length > MAX_DIGITS) return null
  const n = Number(`${whole}${part}`)
  const d = 10 ** part.length * (dec[3] === '%' ? 100 : 1)
  return makeFraction(n, d)
}

export const formatProbability = (f: Fraction): string => format(f)

// ---- Structure ----

export const treeLevel1Ids = (levels: TreeLevel[]): string[] => levels[0]!.outcomes.map((_, i) => String(i))
export const treeLevel2Ids = (levels: TreeLevel[]): string[] =>
  levels.length < 2 ? [] : treeLevel1Ids(levels).flatMap((a) => levels[1]!.outcomes.map((_, j) => `${a}.${j}`))
/** Every edge id (level 1, then level 2). */
export const treeAllEdgeIds = (levels: TreeLevel[]): string[] => [...treeLevel1Ids(levels), ...treeLevel2Ids(levels)]
/** Leaf ids = full paths. */
export const treeLeafIds = (levels: TreeLevel[]): string[] => (levels.length < 2 ? treeLevel1Ids(levels) : treeLevel2Ids(levels))

/** Groups of sibling edges that must add up to 1. */
export const treeSiblingGroups = (levels: TreeLevel[]): string[][] => {
  const groups: string[][] = [treeLevel1Ids(levels)]
  if (levels.length > 1) for (const a of treeLevel1Ids(levels)) groups.push(levels[1]!.outcomes.map((_, j) => `${a}.${j}`))
  return groups
}

export interface TreeModel {
  levels: TreeLevel[]
  /** Exact value of every edge. */
  edges: Record<string, Fraction>
  /** Exact path probability of every leaf. */
  leaves: Record<string, Fraction>
}

/** Validates the tree and computes the exact edge and leaf values. Throws a descriptive Error. */
export const buildTreeModel = (levels: TreeLevel[], probabilities: Record<string, string>): TreeModel => {
  if (!Array.isArray(levels) || levels.length < 1 || levels.length > TREE_MAX_LEVELS) {
    throw new Error(`treeDiagram: need 1..${TREE_MAX_LEVELS} levels`)
  }
  for (const level of levels) {
    const o = level?.outcomes
    if (!Array.isArray(o) || o.length < TREE_MIN_OUTCOMES || o.length > TREE_MAX_OUTCOMES) {
      throw new Error(`treeDiagram: each level needs ${TREE_MIN_OUTCOMES}..${TREE_MAX_OUTCOMES} outcomes`)
    }
    for (const label of o) {
      if (typeof label !== 'string' || label.trim() === '' || label.length > TREE_MAX_LABEL_CHARS || !treeChipTextFits(label)) {
        throw new Error(`treeDiagram: outcome needs 1..${TREE_MAX_LABEL_CHARS} characters, got ${JSON.stringify(label)}`)
      }
    }
    if (new Set(o.map((l) => l.trim().toLowerCase())).size !== o.length) throw new Error('treeDiagram: outcomes of a level must differ')
  }
  const ids = treeAllEdgeIds(levels)
  const edges: Record<string, Fraction> = {}
  for (const id of ids) {
    const raw = probabilities[id]
    const f = typeof raw === 'string' ? parseProbability(raw) : null
    if (!f) throw new Error(`treeDiagram: edge "${id}" needs a probability as fraction or decimal, got ${JSON.stringify(raw)}`)
    if (f.n > f.d) throw new Error(`treeDiagram: edge "${id}" is larger than 1`)
    edges[id] = f
  }
  for (const key of Object.keys(probabilities)) {
    if (!ids.includes(key)) throw new Error(`treeDiagram: "${key}" is not an edge of this tree`)
  }
  for (const group of treeSiblingGroups(levels)) {
    const sum = group.reduce<Fraction>((acc, id) => add(acc, edges[id]!), { n: 0, d: 1 })
    if (!equals(sum, { n: 1, d: 1 })) throw new Error(`treeDiagram: the edges ${group.join(', ')} must add up to 1`)
  }
  const leaves: Record<string, Fraction> = {}
  for (const id of treeLeafIds(levels)) {
    const [a] = id.split('.')
    leaves[id] = levels.length < 2 ? edges[id]! : multiply(edges[a!]!, edges[id]!)
  }
  return { levels, edges, leaves }
}

export interface TreeBlanks {
  branches: string[]
  leaves: string[]
}

export const validateTreeBlanks = (levels: TreeLevel[], blanks: TreeBlanks): void => {
  const edgeIds = treeAllEdgeIds(levels)
  const leafIds = treeLeafIds(levels)
  const dup = (list: string[]) => new Set(list).size !== list.length
  if (!blanks || !Array.isArray(blanks.branches) || !Array.isArray(blanks.leaves)) throw new Error('treeDiagram: blanks needs branches and leaves')
  if (dup(blanks.branches) || dup(blanks.leaves)) throw new Error('treeDiagram: blanks must not repeat a field')
  for (const id of blanks.branches) if (!edgeIds.includes(id)) throw new Error(`treeDiagram: blank branch "${id}" does not exist`)
  for (const id of blanks.leaves) if (!leafIds.includes(id)) throw new Error(`treeDiagram: blank leaf "${id}" does not exist`)
  if (levels.length < 2 && blanks.leaves.length > 0) throw new Error('treeDiagram: a one-level tree has no separate leaf fields')
  if (blanks.branches.length + blanks.leaves.length === 0) throw new Error('treeDiagram: at least one blank field is needed')
}

/** Checks the learner's answer: every blank field equals its expected value as an exact fraction. */
export const treeMatches = (
  model: TreeModel,
  blanks: TreeBlanks,
  branches: Record<string, string> | undefined,
  leaves: Record<string, string> | undefined,
): boolean => {
  const same = (raw: string | undefined, expected: Fraction): boolean => {
    const f = typeof raw === 'string' ? parseProbability(raw) : null
    return f !== null && equals(f, expected)
  }
  return blanks.branches.every((id) => same(branches?.[id], model.edges[id]!)) && blanks.leaves.every((id) => same(leaves?.[id], model.leaves[id]!))
}

/** True when the learner typed anything into any field. */
export const treeAnyInput = (branches: Record<string, string> | undefined, leaves: Record<string, string> | undefined): boolean =>
  [...Object.values(branches ?? {}), ...Object.values(leaves ?? {})].some((v) => v.trim() !== '')

/** Display text of a given value: decimals with comma. */
export const treeDisplayValue = (raw: string): string => raw.trim().replace('.', ',')

/** Human label of a path id: "Rot, Blau". */
export const treePathLabel = (levels: TreeLevel[], id: string): string =>
  id
    .split('.')
    .map((k, level) => levels[level]?.outcomes[Number(k)] ?? k)
    .join(', ')

// ---- Layout (x in percent of the width, y in px) ----

export interface TreeNode {
  id: string
  level: number
  label: string
  x: number
  y: number
}
export interface TreeEdge {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  /** Centre of the branch field. */
  fx: number
  fy: number
}
export interface TreeLayout {
  height: number
  root: { x: number; y: number }
  nodes: TreeNode[]
  edges: TreeEdge[]
  /** Centres of the leaf fields (two-level trees only). */
  leafFields: Array<{ id: string; x: number; y: number }>
}

export const treeLayout = (levels: TreeLevel[], rowPx = TREE_ROW_PX): TreeLayout => {
  const two = levels.length > 1
  const c1 = two ? 32.5 : 60
  const c2 = 69.5
  const half = TREE_CHIP_W_PCT / 2
  const n1 = levels[0]!.outcomes.length
  const n2 = two ? levels[1]!.outcomes.length : 1
  const leafCount = n1 * n2
  const height = leafCount * rowPx
  const nodes: TreeNode[] = []
  const edges: TreeEdge[] = []
  const leafFields: TreeLayout['leafFields'] = []
  const mean = (ys: number[]) => ys.reduce((a, b) => a + b, 0) / ys.length
  const level1Y: number[] = []
  const addEdge = (id: string, x1: number, y1: number, x2: number, y2: number) =>
    edges.push({ id, x1, y1, x2, y2, fx: x1 + TREE_EDGE_T * (x2 - x1), fy: y1 + TREE_EDGE_T * (y2 - y1) })
  levels[0]!.outcomes.forEach((label, i) => {
    const childYs = two ? Array.from({ length: n2 }, (_, j) => (i * n2 + j + 0.5) * rowPx) : [(i + 0.5) * rowPx]
    level1Y.push(two ? mean(childYs) : childYs[0]!)
    if (two) {
      levels[1]!.outcomes.forEach((l2, j) => {
        const y = childYs[j]!
        nodes.push({ id: `${i}.${j}`, level: 2, label: l2, x: c2, y })
        leafFields.push({ id: `${i}.${j}`, x: TREE_LEAF_INPUT_X, y })
      })
    }
    nodes.push({ id: String(i), level: 1, label, x: c1, y: level1Y[i]! })
  })
  const rootY = mean(level1Y)
  level1Y.forEach((y, i) => addEdge(String(i), TREE_ROOT_X, rootY, c1 - half, y))
  if (two) {
    for (let i = 0; i < n1; i++) {
      for (let j = 0; j < n2; j++) addEdge(`${i}.${j}`, c1 + half, level1Y[i]!, c2 - half, (i * n2 + j + 0.5) * rowPx)
    }
  }
  return { height, root: { x: TREE_ROOT_X, y: rootY }, nodes, edges, leafFields }
}

export interface TreeBox {
  kind: 'branch' | 'leaf' | 'chip'
  id: string
  left: number
  top: number
  right: number
  bottom: number
}

/** All rectangles the tree occupies at a content width (px): branch fields, leaf fields and outcome chips. */
export const treeBoxes = (levels: TreeLevel[], widthPx = TREE_MIN_WIDTH_PX): TreeBox[] => {
  const lay = treeLayout(levels)
  const box = (kind: TreeBox['kind'], id: string, xPct: number, y: number, w: number, h: number): TreeBox => {
    const cx = (xPct / 100) * widthPx
    return { kind, id, left: cx - w / 2, right: cx + w / 2, top: y - h / 2, bottom: y + h / 2 }
  }
  return [
    ...lay.edges.map((e) => box('branch', e.id, e.fx, e.fy, TREE_INPUT_W_PX, TREE_INPUT_H_PX)),
    ...lay.leafFields.map((f) => box('leaf', f.id, f.x, f.y, TREE_INPUT_W_PX, TREE_INPUT_H_PX)),
    ...lay.nodes.map((n) => box('chip', `${n.level}:${n.id}`, n.x, n.y, (TREE_CHIP_W_PCT / 100) * widthPx, TREE_CHIP_H_PX)),
  ]
}

// ---- Print drawing ----

export const TREE_PRINT_W = 600
export const TREE_PRINT_ROW = 60
export const TREE_PRINT_FONT = 15
const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Static tree for paper: given values printed, "___" at every blank field. */
export const treePrintSvg = (levels: TreeLevel[], given: Record<string, string>, blanks: TreeBlanks): string => {
  const lay = treeLayout(levels, TREE_PRINT_ROW)
  const px = (pct: number) => Math.round((pct / 100) * TREE_PRINT_W * 10) / 10
  const parts: string[] = []
  parts.push(`<circle cx="${px(lay.root.x)}" cy="${lay.root.y}" r="4" fill="#0f172a"/>`)
  for (const e of lay.edges) {
    parts.push(`<line x1="${px(e.x1)}" y1="${e.y1}" x2="${px(e.x2)}" y2="${e.y2}" stroke="#334155" stroke-width="1.6"/>`)
  }
  const text = (xPct: number, y: number, s: string, extra = '') =>
    `<text x="${px(xPct)}" y="${y + 5}" text-anchor="middle" font-size="${TREE_PRINT_FONT}" fill="#0f172a"${extra}>${esc(s)}</text>`
  for (const e of lay.edges) {
    const isBlank = blanks.branches.includes(e.id)
    const value = isBlank ? '___' : treeDisplayValue(given[e.id] ?? '')
    if (value) parts.push(`<rect x="${px(e.fx) - 26}" y="${e.fy - 12}" width="52" height="24" fill="#ffffff"/>${text(e.fx, e.fy, value)}`)
  }
  for (const n of lay.nodes) parts.push(text(n.x, n.y, n.label, ' font-weight="600"'))
  for (const f of lay.leafFields) {
    if (blanks.leaves.includes(f.id)) parts.push(text(f.x, f.y, '___'))
  }
  return `<svg viewBox="0 0 ${TREE_PRINT_W} ${lay.height}" width="100%" style="max-width:${TREE_PRINT_W}px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Baumdiagramm">${parts.join('')}</svg>`
}
