/**
 * Linear equation step solver (Äquivalenzumformungen) for Klasse 7+.
 * State: ax + b = cx + d
 */

export type LinEq = {
  ax: number
  b: number
  cx: number
  d: number
}

export type EqOp =
  | { kind: 'add'; n: number }
  | { kind: 'sub'; n: number }
  | { kind: 'mul'; n: number }
  | { kind: 'div'; n: number }
  | { kind: 'addX'; n: number }
  | { kind: 'subX'; n: number }

export type EqLine = {
  /** Full equation text, e.g. "4x − 8 = 2x" */
  eq: string
  /** Optional right-column operation, e.g. "| + 8" */
  opLabel?: string
  /** Terms highlighted as newly added (substring match in eq) */
  highlights?: string[]
}

const MINUS = '−'
const TIMES = '·'
const DIV = ':'

export function formatInt(n: number): string {
  if (n < 0) return `(${MINUS}${Math.abs(n)})`
  return String(n)
}

function coeffX(c: number): string {
  if (c === 1) return 'x'
  if (c === -1) return `${MINUS}x`
  return `${formatInt(c)}${TIMES}x`
}

/** Format one side ax + b */
export function formatSide(ax: number, b: number): string {
  if (ax === 0 && b === 0) return '0'
  if (ax === 0) return formatInt(b)
  if (b === 0) return coeffX(ax)
  if (b > 0) return `${coeffX(ax)} + ${b}`
  return `${coeffX(ax)} ${MINUS} ${Math.abs(b)}`
}

export function formatEq(eq: LinEq): string {
  return `${formatSide(eq.ax, eq.b)} = ${formatSide(eq.cx, eq.d)}`
}

export function formatOp(op: EqOp): string {
  switch (op.kind) {
    case 'add':
      return `| + ${formatInt(op.n)}`
    case 'sub':
      return `| ${MINUS} ${formatInt(op.n)}`
    case 'mul':
      return `| ${TIMES} ${formatInt(op.n)}`
    case 'div':
      return `| ${DIV} ${formatInt(op.n)}`
    case 'addX':
      return `| + ${coeffX(op.n)}`
    case 'subX':
      return `| ${MINUS} ${coeffX(op.n)}`
  }
}

export function applyOp(eq: LinEq, op: EqOp): LinEq {
  switch (op.kind) {
    case 'add':
      return { ...eq, b: eq.b + op.n, d: eq.d + op.n }
    case 'sub':
      return { ...eq, b: eq.b - op.n, d: eq.d - op.n }
    case 'mul':
      return {
        ax: eq.ax * op.n,
        b: eq.b * op.n,
        cx: eq.cx * op.n,
        d: eq.d * op.n,
      }
    case 'div':
      if (op.n === 0) return eq
      return {
        ax: eq.ax / op.n,
        b: eq.b / op.n,
        cx: eq.cx / op.n,
        d: eq.d / op.n,
      }
    case 'addX':
      return { ...eq, ax: eq.ax + op.n, cx: eq.cx + op.n }
    case 'subX':
      return { ...eq, ax: eq.ax - op.n, cx: eq.cx - op.n }
  }
}

/** Cancel like terms that appear on both sides (e.g. +5 both sides → drop). */
export function simplify(eq: LinEq): LinEq {
  // Move all to left conceptually then normalize? Better: cancel common additive constants
  // and common x-coeffs that appear identically on both sides.
  let { ax, b, cx, d } = eq
  // Cancel identical constant on both sides
  if (b !== 0 && b === d) {
    b = 0
    d = 0
  }
  // Cancel identical x coeff on both sides
  if (ax !== 0 && ax === cx) {
    ax = 0
    cx = 0
  }
  // Prefer x on left: if ax===0 && cx!==0, swap sides (multiply by -1 conceptually by swapping)
  if (ax === 0 && cx !== 0) {
    return { ax: cx, b: d, cx: ax, d: b }
  }
  return { ax, b, cx, d }
}

/**
 * After an op, produce intermediate (with highlights) then simplified line.
 */
export function linesAfterOp(before: LinEq, op: EqOp): { lines: EqLine[]; after: LinEq } {
  const mid = applyOp(before, op)
  const highlights: string[] = []
  const opLabel = formatOp(op)

  // Build intermediate display by showing the applied terms
  let midEq = formatEq(mid)
  switch (op.kind) {
    case 'add':
      highlights.push(`+ ${formatInt(op.n)}`)
      break
    case 'sub':
      highlights.push(`${MINUS} ${formatInt(op.n)}`)
      break
    case 'mul':
      highlights.push(`${TIMES} ${formatInt(op.n)}`)
      break
    case 'div':
      highlights.push(`${DIV} ${formatInt(op.n)}`)
      break
    case 'addX':
      highlights.push(`+ ${coeffX(op.n)}`)
      break
    case 'subX':
      highlights.push(`${MINUS} ${coeffX(op.n)}`)
      break
  }

  // For add/sub of constants, show explicit mid like "x + 5 − 5 = 12 − 5"
  if (op.kind === 'add' || op.kind === 'sub') {
    const sign = op.kind === 'add' ? '+' : MINUS
    const t = formatInt(op.n)
    const left = `${formatSide(before.ax, before.b)} ${sign} ${t}`
    const right = `${formatSide(before.cx, before.d)} ${sign} ${t}`
    midEq = `${left} = ${right}`
  } else if (op.kind === 'addX' || op.kind === 'subX') {
    const sign = op.kind === 'addX' ? '+' : MINUS
    const t = coeffX(op.n)
    const left = `${formatSide(before.ax, before.b)} ${sign} ${t}`
    const right = `${formatSide(before.cx, before.d)} ${sign} ${t}`
    midEq = `${left} = ${right}`
  } else if (op.kind === 'mul' || op.kind === 'div') {
    const sym = op.kind === 'mul' ? TIMES : DIV
    const t = formatInt(op.n)
    midEq = `(${formatSide(before.ax, before.b)}) ${sym} ${t} = (${formatSide(before.cx, before.d)}) ${sym} ${t}`
  }

  const after = simplify(mid)
  // Keep dividing until integers if possible for clean display
  const clean = normalizeIntegers(after)

  const lines: EqLine[] = [
    { eq: formatEq(before), opLabel },
    { eq: midEq, highlights },
  ]
  if (formatEq(clean) !== midEq) {
    lines.push({ eq: formatEq(clean) })
  }
  return { lines, after: clean }
}

/** If all coeffs are integers (or near), round; if divisible by gcd, reduce for div results. */
function normalizeIntegers(eq: LinEq): LinEq {
  const vals = [eq.ax, eq.b, eq.cx, eq.d]
  if (vals.every((v) => Number.isInteger(v))) return eq
  // Round near-integers (float div)
  const rounded = vals.map((v) => Math.round(v * 1e9) / 1e9)
  if (rounded.every((v) => Math.abs(v - Math.round(v)) < 1e-8)) {
    return {
      ax: Math.round(rounded[0]!),
      b: Math.round(rounded[1]!),
      cx: Math.round(rounded[2]!),
      d: Math.round(rounded[3]!),
    }
  }
  return eq
}

export function isSolved(eq: LinEq): boolean {
  const e = simplify(normalizeIntegers(eq))
  // x = k  or  −x = k (then x = −k) — accept ax=±1, b=0, cx=0
  return e.b === 0 && e.cx === 0 && (e.ax === 1 || e.ax === -1)
}

export function solutionX(eq: LinEq): number | null {
  const e = simplify(normalizeIntegers(eq))
  if (!isSolved(e)) return null
  return e.ax === 1 ? e.d : -e.d
}

export function opKey(op: EqOp): string {
  return `${op.kind}:${op.n}`
}

export function parseOpKey(key: string): EqOp | null {
  const [kind, nStr] = key.split(':')
  const n = Number(nStr)
  if (!Number.isFinite(n)) return null
  if (
    kind === 'add' ||
    kind === 'sub' ||
    kind === 'mul' ||
    kind === 'div' ||
    kind === 'addX' ||
    kind === 'subX'
  ) {
    return { kind, n }
  }
  return null
}

/** Suggest useful + distractor ops for the current equation. */
export function suggestOps(eq: LinEq, rng?: () => number): EqOp[] {
  const useful: EqOp[] = []
  const distractors: EqOp[] = []

  // Constants on left — prefer school-friendly add/sub of positives
  if (eq.b > 0) {
    useful.push({ kind: 'sub', n: eq.b })
    distractors.push({ kind: 'add', n: eq.b })
  } else if (eq.b < 0) {
    useful.push({ kind: 'add', n: -eq.b })
    distractors.push({ kind: 'sub', n: -eq.b })
  }
  if (eq.d > 0 && eq.d !== eq.b) {
    useful.push({ kind: 'sub', n: eq.d })
    distractors.push({ kind: 'add', n: eq.d })
  } else if (eq.d < 0 && eq.d !== eq.b) {
    useful.push({ kind: 'add', n: -eq.d })
  }
  // x terms on right
  if (eq.cx !== 0) {
    useful.push({ kind: 'subX', n: eq.cx })
    distractors.push({ kind: 'addX', n: eq.cx })
  }
  // scale
  if (eq.ax !== 0 && eq.ax !== 1 && eq.cx === 0 && eq.b === 0) {
    useful.push({ kind: 'div', n: eq.ax })
    distractors.push({ kind: 'mul', n: eq.ax })
    if (eq.ax !== -1) distractors.push({ kind: 'div', n: -eq.ax })
  }
  if (eq.ax === -1 && eq.b === 0 && eq.cx === 0) {
    useful.push({ kind: 'mul', n: -1 })
  }

  // Generic distractors
  distractors.push({ kind: 'add', n: 1 }, { kind: 'sub', n: 1 }, { kind: 'mul', n: 2 })

  const seen = new Set<string>()
  const out: EqOp[] = []
  for (const op of [...useful, ...distractors]) {
    if (op.kind === 'div' && op.n === 0) continue
    if (op.kind === 'mul' && op.n === 0) continue
    const k = opKey(op)
    if (seen.has(k)) continue
    seen.add(k)
    out.push(op)
  }

  // Shuffle lightly
  const rand = rng ?? Math.random
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  // Cap buttons
  return out.slice(0, 6)
}

/** Canonical one-step solve for x + a = b */
export function solveAddPath(a: number, _b: number): EqOp[] {
  if (a >= 0) return [{ kind: 'sub', n: a }]
  return [{ kind: 'add', n: -a }]
}

/** Canonical one-step solve for a·x = b */
export function solveMulPath(a: number, _b: number): EqOp[] {
  return [{ kind: 'div', n: a }]
}

export function applyOps(start: LinEq, ops: EqOp[]): LinEq {
  return ops.reduce((eq, op) => simplify(normalizeIntegers(applyOp(eq, op))), start)
}

export function buildTranscript(start: LinEq, ops: EqOp[]): EqLine[] {
  const lines: EqLine[] = [{ eq: formatEq(start) }]
  let cur = start
  for (const op of ops) {
    const { lines: stepLines, after } = linesAfterOp(cur, op)
    // stepLines[0] repeats current with opLabel — merge into previous line's opLabel
    if (lines.length > 0 && stepLines[0]) {
      lines[lines.length - 1] = {
        ...lines[lines.length - 1]!,
        opLabel: stepLines[0].opLabel,
      }
    }
    for (let i = 1; i < stepLines.length; i++) {
      lines.push(stepLines[i]!)
    }
    cur = after
  }
  return lines
}
