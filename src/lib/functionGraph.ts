/**
 * Function families + SVG for Aufgabengenerator / higher-grade graphs.
 * Safe expression compile (no eval) for custom formulas.
 */
import { generateCoordinateGridSvg, generateFunctionGraphSvg } from './geometrySvg'

export type FunctionKind =
  | 'linear'
  | 'quadratic'
  | 'cubic'
  | 'power'
  | 'abs'
  | 'reciprocal'
  | 'sqrt'
  | 'exp'
  | 'ln'
  | 'sin'
  | 'cos'
  | 'tan'
  | 'custom'

export type FunctionParamKey =
  | 'm'
  | 'n'
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'h'
  | 'k'
  | 'expr'

export type FunctionSpec = {
  kind: FunctionKind
  /** Numeric / expression params (keys depend on kind). */
  params: Partial<Record<FunctionParamKey, number | string>>
  label?: string
  stroke?: string
}

export type FunctionKindMeta = {
  id: FunctionKind
  label: string
  formula: string
  /** Ordered editable params (excl. expr for custom). */
  params: Array<{ key: FunctionParamKey; label: string; defaultValue: number | string }>
}

/** Catalog shown in the generator. */
export const FUNCTION_KIND_META: FunctionKindMeta[] = [
  {
    id: 'linear',
    label: 'Gerade (linear)',
    formula: 'f(x) = m·x + n',
    params: [
      { key: 'm', label: 'Steigung m', defaultValue: 1 },
      { key: 'n', label: 'Achsenabschnitt n', defaultValue: 0 },
    ],
  },
  {
    id: 'quadratic',
    label: 'Parabel (quadratisch)',
    formula: 'f(x) = a·x² + b·x + c',
    params: [
      { key: 'a', label: 'a', defaultValue: 1 },
      { key: 'b', label: 'b', defaultValue: 0 },
      { key: 'c', label: 'c', defaultValue: 0 },
    ],
  },
  {
    id: 'cubic',
    label: 'Kubisch',
    formula: 'f(x) = a·x³ + b·x² + c·x + d',
    params: [
      { key: 'a', label: 'a', defaultValue: 1 },
      { key: 'b', label: 'b', defaultValue: 0 },
      { key: 'c', label: 'c', defaultValue: 0 },
      { key: 'd', label: 'd', defaultValue: 0 },
    ],
  },
  {
    id: 'power',
    label: 'Potenz',
    formula: 'f(x) = a·xⁿ',
    params: [
      { key: 'a', label: 'a', defaultValue: 1 },
      { key: 'n', label: 'Exponent n', defaultValue: 2 },
    ],
  },
  {
    id: 'abs',
    label: 'Betrag',
    formula: 'f(x) = a·|x − h| + k',
    params: [
      { key: 'a', label: 'a', defaultValue: 1 },
      { key: 'h', label: 'h (Verschiebung x)', defaultValue: 0 },
      { key: 'k', label: 'k (Verschiebung y)', defaultValue: 0 },
    ],
  },
  {
    id: 'reciprocal',
    label: 'Hyperbel (1/x)',
    formula: 'f(x) = a/(x − h) + k',
    params: [
      { key: 'a', label: 'a', defaultValue: 1 },
      { key: 'h', label: 'h', defaultValue: 0 },
      { key: 'k', label: 'k', defaultValue: 0 },
    ],
  },
  {
    id: 'sqrt',
    label: 'Wurzel',
    formula: 'f(x) = a·√(x − h) + k',
    params: [
      { key: 'a', label: 'a', defaultValue: 1 },
      { key: 'h', label: 'h', defaultValue: 0 },
      { key: 'k', label: 'k', defaultValue: 0 },
    ],
  },
  {
    id: 'exp',
    label: 'Exponential',
    formula: 'f(x) = a·e^(b·x) + c',
    params: [
      { key: 'a', label: 'a', defaultValue: 1 },
      { key: 'b', label: 'b', defaultValue: 1 },
      { key: 'c', label: 'c', defaultValue: 0 },
    ],
  },
  {
    id: 'ln',
    label: 'Logarithmus',
    formula: 'f(x) = a·ln(x − h) + k',
    params: [
      { key: 'a', label: 'a', defaultValue: 1 },
      { key: 'h', label: 'h', defaultValue: 0 },
      { key: 'k', label: 'k', defaultValue: 0 },
    ],
  },
  {
    id: 'sin',
    label: 'Sinus',
    formula: 'f(x) = a·sin(b·(x − h)) + k',
    params: [
      { key: 'a', label: 'Amplitude a', defaultValue: 1 },
      { key: 'b', label: 'Frequenz b', defaultValue: 1 },
      { key: 'h', label: 'Phase h', defaultValue: 0 },
      { key: 'k', label: 'Verschiebung k', defaultValue: 0 },
    ],
  },
  {
    id: 'cos',
    label: 'Cosinus',
    formula: 'f(x) = a·cos(b·(x − h)) + k',
    params: [
      { key: 'a', label: 'Amplitude a', defaultValue: 1 },
      { key: 'b', label: 'Frequenz b', defaultValue: 1 },
      { key: 'h', label: 'Phase h', defaultValue: 0 },
      { key: 'k', label: 'Verschiebung k', defaultValue: 0 },
    ],
  },
  {
    id: 'tan',
    label: 'Tangens',
    formula: 'f(x) = a·tan(b·(x − h)) + k',
    params: [
      { key: 'a', label: 'a', defaultValue: 1 },
      { key: 'b', label: 'b', defaultValue: 1 },
      { key: 'h', label: 'h', defaultValue: 0 },
      { key: 'k', label: 'k', defaultValue: 0 },
    ],
  },
  {
    id: 'custom',
    label: 'Eigener Ausdruck',
    formula: 'z. B. sin(x)+x/2',
    params: [{ key: 'expr', label: 'f(x) =', defaultValue: 'sin(x)' }],
  },
]

export function getFunctionKindMeta(kind: FunctionKind): FunctionKindMeta {
  return FUNCTION_KIND_META.find((m) => m.id === kind) ?? FUNCTION_KIND_META[0]!
}

export function defaultFunctionSpec(kind: FunctionKind): FunctionSpec {
  const meta = getFunctionKindMeta(kind)
  const params: FunctionSpec['params'] = {}
  for (const p of meta.params) params[p.key] = p.defaultValue
  return { kind, params }
}

function num(params: FunctionSpec['params'], key: FunctionParamKey, fallback: number): number {
  const v = params[key]
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string') {
    const n = Number(String(v).replace(',', '.'))
    if (Number.isFinite(n)) return n
  }
  return fallback
}

/** Compile a function spec to y = f(x). Returns null for undefined points. */
export function compileFunctionSpec(
  spec: FunctionSpec,
): (x: number) => number | null {
  const p = spec.params
  switch (spec.kind) {
    case 'linear': {
      const m = num(p, 'm', 1)
      const n = num(p, 'n', 0)
      return (x) => m * x + n
    }
    case 'quadratic': {
      const a = num(p, 'a', 1)
      const b = num(p, 'b', 0)
      const c = num(p, 'c', 0)
      return (x) => a * x * x + b * x + c
    }
    case 'cubic': {
      const a = num(p, 'a', 1)
      const b = num(p, 'b', 0)
      const c = num(p, 'c', 0)
      const d = num(p, 'd', 0)
      return (x) => a * x * x * x + b * x * x + c * x + d
    }
    case 'power': {
      const a = num(p, 'a', 1)
      const n = num(p, 'n', 2)
      return (x) => {
        if (x < 0 && !Number.isInteger(n) && Math.abs(n % 1) > 1e-12) return null
        const y = a * x ** n
        return Number.isFinite(y) ? y : null
      }
    }
    case 'abs': {
      const a = num(p, 'a', 1)
      const h = num(p, 'h', 0)
      const k = num(p, 'k', 0)
      return (x) => a * Math.abs(x - h) + k
    }
    case 'reciprocal': {
      const a = num(p, 'a', 1)
      const h = num(p, 'h', 0)
      const k = num(p, 'k', 0)
      return (x) => {
        if (Math.abs(x - h) < 1e-9) return null
        const y = a / (x - h) + k
        return Number.isFinite(y) ? y : null
      }
    }
    case 'sqrt': {
      const a = num(p, 'a', 1)
      const h = num(p, 'h', 0)
      const k = num(p, 'k', 0)
      return (x) => {
        if (x - h < 0) return null
        return a * Math.sqrt(x - h) + k
      }
    }
    case 'exp': {
      const a = num(p, 'a', 1)
      const b = num(p, 'b', 1)
      const c = num(p, 'c', 0)
      return (x) => {
        const y = a * Math.exp(b * x) + c
        return Number.isFinite(y) ? y : null
      }
    }
    case 'ln': {
      const a = num(p, 'a', 1)
      const h = num(p, 'h', 0)
      const k = num(p, 'k', 0)
      return (x) => {
        if (x - h <= 0) return null
        const y = a * Math.log(x - h) + k
        return Number.isFinite(y) ? y : null
      }
    }
    case 'sin': {
      const a = num(p, 'a', 1)
      const b = num(p, 'b', 1)
      const h = num(p, 'h', 0)
      const k = num(p, 'k', 0)
      return (x) => a * Math.sin(b * (x - h)) + k
    }
    case 'cos': {
      const a = num(p, 'a', 1)
      const b = num(p, 'b', 1)
      const h = num(p, 'h', 0)
      const k = num(p, 'k', 0)
      return (x) => a * Math.cos(b * (x - h)) + k
    }
    case 'tan': {
      const a = num(p, 'a', 1)
      const b = num(p, 'b', 1)
      const h = num(p, 'h', 0)
      const k = num(p, 'k', 0)
      return (x) => {
        const arg = b * (x - h)
        // Near odd multiples of π/2 the tan blows up — treat as gap.
        const mod = ((arg / Math.PI + 0.5) % 1 + 1) % 1
        if (Math.abs(mod - 0.5) < 0.02) return null
        const y = a * Math.tan(arg) + k
        return Number.isFinite(y) && Math.abs(y) < 1e6 ? y : null
      }
    }
    case 'custom': {
      const expr = String(p.expr ?? '0')
      const compiled = compileMathExpression(expr)
      if (!compiled.ok) return () => null
      return compiled.fn
    }
  }
}

/** German-ish formula label for UI / export comments. */
export function formatFunctionSpec(spec: FunctionSpec): string {
  if (spec.label?.trim()) return spec.label.trim()
  const p = spec.params
  const f = (key: FunctionParamKey, fallback: number) => {
    const v = num(p, key, fallback)
    return String(v).replace('.', ',')
  }
  switch (spec.kind) {
    case 'linear':
      return `f(x) = ${f('m', 1)}·x + ${f('n', 0)}`
    case 'quadratic':
      return `f(x) = ${f('a', 1)}·x² + ${f('b', 0)}·x + ${f('c', 0)}`
    case 'cubic':
      return `f(x) = ${f('a', 1)}·x³ + ${f('b', 0)}·x² + ${f('c', 0)}·x + ${f('d', 0)}`
    case 'power':
      return `f(x) = ${f('a', 1)}·x^${f('n', 2)}`
    case 'abs':
      return `f(x) = ${f('a', 1)}·|x − ${f('h', 0)}| + ${f('k', 0)}`
    case 'reciprocal':
      return `f(x) = ${f('a', 1)}/(x − ${f('h', 0)}) + ${f('k', 0)}`
    case 'sqrt':
      return `f(x) = ${f('a', 1)}·√(x − ${f('h', 0)}) + ${f('k', 0)}`
    case 'exp':
      return `f(x) = ${f('a', 1)}·e^(${f('b', 1)}·x) + ${f('c', 0)}`
    case 'ln':
      return `f(x) = ${f('a', 1)}·ln(x − ${f('h', 0)}) + ${f('k', 0)}`
    case 'sin':
      return `f(x) = ${f('a', 1)}·sin(${f('b', 1)}·(x − ${f('h', 0)})) + ${f('k', 0)}`
    case 'cos':
      return `f(x) = ${f('a', 1)}·cos(${f('b', 1)}·(x − ${f('h', 0)})) + ${f('k', 0)}`
    case 'tan':
      return `f(x) = ${f('a', 1)}·tan(${f('b', 1)}·(x − ${f('h', 0)})) + ${f('k', 0)}`
    case 'custom':
      return `f(x) = ${String(p.expr ?? '…')}`
  }
}

export type MathCompileResult =
  | { ok: true; fn: (x: number) => number | null }
  | { ok: false; error: string }

/**
 * Compile a restricted math expression in x.
 * Allowed: + - * / ^, (), numbers, x, pi, e,
 * sin cos tan asin acos atan sinh cosh tanh ln log log10 exp sqrt abs floor ceil.
 */
export function compileMathExpression(raw: string): MathCompileResult {
  const src = raw.trim().replace(/,/g, '.').replace(/\s+/g, '')
  if (!src) return { ok: false, error: 'Leerer Ausdruck.' }
  if (src.length > 120) return { ok: false, error: 'Ausdruck zu lang.' }
  if (!/^[0-9xX+\-*/^().a-zA-Z]+$/.test(src)) {
    return { ok: false, error: 'Ungültige Zeichen im Ausdruck.' }
  }

  let i = 0
  const peek = () => src[i] ?? ''
  const next = () => src[i++] ?? ''

  type Node = (x: number) => number

  const parseExpression = (): Node => {
    let left = parseTerm()
    while (peek() === '+' || peek() === '-') {
      const op = next()
      const right = parseTerm()
      const L = left
      left =
        op === '+'
          ? (x) => L(x) + right(x)
          : (x) => L(x) - right(x)
    }
    return left
  }

  const parseTerm = (): Node => {
    let left = parsePower()
    while (peek() === '*' || peek() === '/') {
      const op = next()
      const right = parsePower()
      const L = left
      left =
        op === '*'
          ? (x) => L(x) * right(x)
          : (x) => L(x) / right(x)
    }
    return left
  }

  const parsePower = (): Node => {
    const base = parseUnary()
    if (peek() === '^') {
      next()
      const exp = parseUnary()
      return (x) => base(x) ** exp(x)
    }
    return base
  }

  const parseUnary = (): Node => {
    if (peek() === '+') {
      next()
      return parseUnary()
    }
    if (peek() === '-') {
      next()
      const inner = parseUnary()
      return (x) => -inner(x)
    }
    return parsePrimary()
  }

  const FN: Record<string, (v: number) => number> = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    sinh: Math.sinh,
    cosh: Math.cosh,
    tanh: Math.tanh,
    ln: Math.log,
    log: Math.log,
    log10: Math.log10,
    exp: Math.exp,
    sqrt: Math.sqrt,
    abs: Math.abs,
    floor: Math.floor,
    ceil: Math.ceil,
  }

  const parsePrimary = (): Node => {
    if (peek() === '(') {
      next()
      const inner = parseExpression()
      if (peek() !== ')') throw new Error('Klammer fehlt.')
      next()
      return inner
    }
    if (/[0-9.]/.test(peek())) {
      let numStr = ''
      while (/[0-9.]/.test(peek())) numStr += next()
      const v = Number(numStr)
      if (!Number.isFinite(v)) throw new Error('Zahl ungültig.')
      return () => v
    }
    if (/[a-zA-Z]/.test(peek())) {
      let name = ''
      while (/[a-zA-Z0-9]/.test(peek())) name += next()
      const lower = name.toLowerCase()
      if (lower === 'x') return (x) => x
      if (lower === 'pi') return () => Math.PI
      if (lower === 'e') return () => Math.E
      if (FN[lower]) {
        if (peek() !== '(') throw new Error(`Funktion ${lower} braucht (.`)
        next()
        const arg = parseExpression()
        if (peek() !== ')') throw new Error('Klammer fehlt.')
        next()
        const fn = FN[lower]!
        return (x) => fn(arg(x))
      }
      throw new Error(`Unbekannt: ${name}`)
    }
    throw new Error('Unerwartetes Zeichen.')
  }

  try {
    const root = parseExpression()
    if (i !== src.length) return { ok: false, error: 'Ausdruck unvollständig geparst.' }
    return {
      ok: true,
      fn: (x) => {
        try {
          const y = root(x)
          return Number.isFinite(y) ? y : null
        } catch {
          return null
        }
      },
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Parse-Fehler.' }
  }
}

export type AuthoredFunctionGraphOptions = {
  curves: FunctionSpec[]
  xRange?: [number, number]
  yRange?: [number, number]
  cellSize?: number
  points?: Array<{ x: number; y: number; label?: string }>
  /** Vertical dashed asymptotes (x = …). */
  asymptotesX?: number[]
  /** Optional tangent on the first curve. */
  tangent?: { x0: number; label?: string }
  shade?: { a: number; b: number; fill?: string }
}

const CURVE_COLORS = ['#1565c0', '#c62828', '#2e7d32', '#6a1b9a', '#ef6c00']

/** Multi-curve coordinate graph for authoring previews / templates. */
export function generateAuthoredFunctionGraphSvg(
  options: AuthoredFunctionGraphOptions,
): string {
  const xRange = options.xRange ?? [-6, 6]
  const yRange = options.yRange ?? [-6, 6]
  const cellSize = options.cellSize ?? 28
  const curves = options.curves.length
    ? options.curves
    : [defaultFunctionSpec('linear')]

  const primary = curves[0]!
  const f0 = compileFunctionSpec(primary)
  const wrap0 = (x: number) => {
    const y = f0(x)
    return y == null ? Number.NaN : y
  }

  let tangent:
    | { x0: number; m: number; label?: string }
    | undefined
  if (options.tangent) {
    const x0 = options.tangent.x0
    const y0 = f0(x0)
    const y1 = f0(x0 + 1e-4)
    if (y0 != null && y1 != null) {
      tangent = {
        x0,
        m: (y1 - y0) / 1e-4,
        label: options.tangent.label,
      }
    }
  }

  let svg = generateFunctionGraphSvg({
    f: wrap0,
    xRange,
    yRange,
    cellSize,
    stroke: primary.stroke ?? CURVE_COLORS[0],
    tangent,
    shade: options.shade,
    points: options.points ?? [],
  })

  // Extra curves
  for (let ci = 1; ci < curves.length; ci++) {
    const spec = curves[ci]!
    const fn = compileFunctionSpec(spec)
    const stroke = spec.stroke ?? CURVE_COLORS[ci % CURVE_COLORS.length]!
    const polys = samplePolylines(fn, xRange, yRange, cellSize)
    if (polys.length) {
      const markup = polys
        .map(
          (poly) =>
            `<polyline points="${poly}" fill="none" stroke="${stroke}" stroke-width="2.5"/>`,
        )
        .join('\n  ')
      svg = svg.replace('</svg>', `  ${markup}\n</svg>`)
    }
  }

  // Asymptotes
  if (options.asymptotesX?.length) {
    const [xMin, xMax] = xRange[0] <= xRange[1] ? xRange : [xRange[1], xRange[0]]
    const [yMin, yMax] = yRange[0] <= yRange[1] ? yRange : [yRange[1], yRange[0]]
    const padL = 36
    const padT = 28
    const lines = options.asymptotesX
      .filter((x) => x >= xMin && x <= xMax)
      .map((x) => {
        const sx = padL + (x - xMin) * cellSize
        const y1 = padT
        const y2 = padT + (yMax - yMin) * cellSize
        return `<line x1="${sx}" y1="${y1}" x2="${sx}" y2="${y2}" stroke="#9e9e9e" stroke-width="1.5" stroke-dasharray="5 4"/>`
      })
    if (lines.length) {
      svg = svg.replace('</svg>', `  ${lines.join('\n  ')}\n</svg>`)
    }
  }

  // Formula caption
  const caption = curves.map((c) => formatFunctionSpec(c)).join('  ·  ')
  if (caption) {
    svg = svg.replace(
      '</svg>',
      `  <text x="36" y="18" font-size="12" fill="#37474f">${escapeXml(caption)}</text>\n</svg>`,
    )
  }

  return svg
}

function samplePolylines(
  fn: (x: number) => number | null,
  xRange: [number, number],
  yRange: [number, number],
  cellSize: number,
): string[] {
  const xMin = Math.min(xRange[0], xRange[1])
  const xMax = Math.max(xRange[0], xRange[1])
  const yMin = Math.min(yRange[0], yRange[1])
  const yMax = Math.max(yRange[0], yRange[1])
  const padL = 36
  const padT = 28
  const toSvg = (mx: number, my: number): [number, number] => [
    padL + (mx - xMin) * cellSize,
    padT + (yMax - my) * cellSize,
  ]
  const parts: string[] = []
  let run: string[] = []
  const steps = Math.max(64, (xMax - xMin) * 12)
  const flush = () => {
    if (run.length >= 2) parts.push(run.join(' '))
    run = []
  }
  for (let i = 0; i <= steps; i++) {
    const x = xMin + (i / steps) * (xMax - xMin)
    const y = fn(x)
    if (y == null || y < yMin - 1 || y > yMax + 1) {
      flush()
      continue
    }
    const [sx, sy] = toSvg(x, Math.max(yMin, Math.min(yMax, y)))
    run.push(`${sx},${sy}`)
  }
  flush()
  return parts
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Parse "x,y,label; …" point list from template forms. */
export function parsePointList(
  raw: string,
): Array<{ x: number; y: number; label?: string }> {
  return raw
    .split(/[;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [xy, label] = s.split(':').map((x) => x.trim())
      const [xs, ys] = (xy ?? '').split(/[,|]/).map((t) => t.trim())
      const x = Number(String(xs ?? '').replace(',', '.'))
      const y = Number(String(ys ?? '').replace(',', '.'))
      if (!Number.isFinite(x) || !Number.isFinite(y)) return null
      return { x, y, ...(label ? { label } : {}) }
    })
    .filter((p): p is { x: number; y: number; label?: string } => p != null)
}

/** Build SVG from flat template string params (registry). */
export function buildFunctionTemplateSvg(
  kind: FunctionKind,
  params: Record<string, string>,
): string {
  const meta = getFunctionKindMeta(kind)
  const specParams: FunctionSpec['params'] = {}
  for (const p of meta.params) {
    const raw = params[p.key]
    if (p.key === 'expr') {
      specParams.expr = (raw ?? String(p.defaultValue)).trim() || 'sin(x)'
    } else {
      const n = Number(String(raw ?? p.defaultValue).replace(',', '.'))
      specParams[p.key] = Number.isFinite(n) ? n : Number(p.defaultValue)
    }
  }
  const xMin = Number(String(params.xMin ?? '-6').replace(',', '.'))
  const xMax = Number(String(params.xMax ?? '6').replace(',', '.'))
  const yMin = Number(String(params.yMin ?? '-6').replace(',', '.'))
  const yMax = Number(String(params.yMax ?? '6').replace(',', '.'))
  const points = parsePointList(params.points ?? '')
  const asymptotesX =
    kind === 'reciprocal'
      ? [num(specParams, 'h', 0)]
      : kind === 'tan'
        ? tanAsymptotes(
            num(specParams, 'b', 1),
            num(specParams, 'h', 0),
            Number.isFinite(xMin) ? xMin : -6,
            Number.isFinite(xMax) ? xMax : 6,
          )
        : kind === 'ln'
          ? [num(specParams, 'h', 0)]
          : []

  const secondKind = (params.secondKind ?? '').trim() as FunctionKind | ''
  const curves: FunctionSpec[] = [{ kind, params: specParams }]
  if (secondKind && FUNCTION_KIND_META.some((m) => m.id === secondKind)) {
    const sm = getFunctionKindMeta(secondKind)
    const sp: FunctionSpec['params'] = {}
    for (const p of sm.params) {
      const key = `g_${p.key}`
      const raw = params[key]
      if (p.key === 'expr') {
        sp.expr = (raw ?? String(p.defaultValue)).trim() || 'x'
      } else {
        const n = Number(String(raw ?? p.defaultValue).replace(',', '.'))
        sp[p.key] = Number.isFinite(n) ? n : Number(p.defaultValue)
      }
    }
    curves.push({ kind: secondKind, params: sp, stroke: '#c62828' })
  }

  return generateAuthoredFunctionGraphSvg({
    curves,
    xRange: [
      Number.isFinite(xMin) ? xMin : -6,
      Number.isFinite(xMax) ? xMax : 6,
    ],
    yRange: [
      Number.isFinite(yMin) ? yMin : -6,
      Number.isFinite(yMax) ? yMax : 6,
    ],
    points,
    asymptotesX,
  })
}

function tanAsymptotes(b: number, h: number, xMin: number, xMax: number): number[] {
  if (Math.abs(b) < 1e-9) return []
  const out: number[] = []
  // b(x-h) = π/2 + kπ  ⇒  x = h + (π/2 + kπ)/b
  for (let k = -20; k <= 20; k++) {
    const x = h + (Math.PI / 2 + k * Math.PI) / b
    if (x >= xMin && x <= xMax) out.push(x)
  }
  return out
}

/** Empty grid only (fallback). */
export function emptyCoordinateSvg(
  xRange: [number, number] = [-5, 5],
  yRange: [number, number] = [-5, 5],
): string {
  return generateCoordinateGridSvg({ xRange, yRange })
}

/** Preview kinds for ParamSlider live graph. */
export type FunctionPreviewKind =
  | 'linear'
  | 'quadratic'
  | 'sin'
  | 'cos'
  | 'tan'
  | 'exp'
  | 'abs'
  | 'reciprocal'
  | 'cubic'
  | 'ln'
  | 'sqrt'
  | 'power'

export const FUNCTION_PREVIEW_OPTIONS: Array<{
  id: FunctionPreviewKind
  label: string
}> = [
  { id: 'linear', label: 'Gerade y = mx+n' },
  { id: 'quadratic', label: 'Parabel y = ax²+bx+c' },
  { id: 'cubic', label: 'Kubisch' },
  { id: 'sin', label: 'Sinus' },
  { id: 'cos', label: 'Cosinus' },
  { id: 'tan', label: 'Tangens' },
  { id: 'exp', label: 'Exponential' },
  { id: 'ln', label: 'Logarithmus' },
  { id: 'abs', label: 'Betrag' },
  { id: 'reciprocal', label: '1/x' },
  { id: 'sqrt', label: 'Wurzel' },
  { id: 'power', label: 'Potenz' },
]

/** Map slider values → FunctionSpec for live preview. */
export function functionSpecFromSliderValues(
  preview: FunctionPreviewKind,
  values: Record<string, number>,
): FunctionSpec {
  switch (preview) {
    case 'linear':
      return { kind: 'linear', params: { m: values.m ?? 1, n: values.n ?? 0 } }
    case 'quadratic':
      return {
        kind: 'quadratic',
        params: { a: values.a ?? 1, b: values.b ?? 0, c: values.c ?? 0 },
      }
    case 'cubic':
      return {
        kind: 'cubic',
        params: {
          a: values.a ?? 1,
          b: values.b ?? 0,
          c: values.c ?? 0,
          d: values.d ?? 0,
        },
      }
    case 'sin':
      return {
        kind: 'sin',
        params: {
          a: values.a ?? 1,
          b: values.b ?? 1,
          h: values.h ?? 0,
          k: values.k ?? 0,
        },
      }
    case 'cos':
      return {
        kind: 'cos',
        params: {
          a: values.a ?? 1,
          b: values.b ?? 1,
          h: values.h ?? 0,
          k: values.k ?? 0,
        },
      }
    case 'tan':
      return {
        kind: 'tan',
        params: {
          a: values.a ?? 1,
          b: values.b ?? 1,
          h: values.h ?? 0,
          k: values.k ?? 0,
        },
      }
    case 'exp':
      return {
        kind: 'exp',
        params: { a: values.a ?? 1, b: values.b ?? 1, c: values.c ?? 0 },
      }
    case 'ln':
      return {
        kind: 'ln',
        params: { a: values.a ?? 1, h: values.h ?? 0, k: values.k ?? 0 },
      }
    case 'abs':
      return {
        kind: 'abs',
        params: { a: values.a ?? 1, h: values.h ?? 0, k: values.k ?? 0 },
      }
    case 'reciprocal':
      return {
        kind: 'reciprocal',
        params: { a: values.a ?? 1, h: values.h ?? 0, k: values.k ?? 0 },
      }
    case 'sqrt':
      return {
        kind: 'sqrt',
        params: { a: values.a ?? 1, h: values.h ?? 0, k: values.k ?? 0 },
      }
    case 'power':
      return {
        kind: 'power',
        params: { a: values.a ?? 1, n: values.n ?? 2 },
      }
  }
}

/** Default slider param definitions for a preview kind (authoring). */
export function defaultSliderParamsForPreview(
  preview: FunctionPreviewKind,
): Array<{ id: string; label: string; min: number; max: number; step: number; correct: number }> {
  const row = (
    id: string,
    label: string,
    min: number,
    max: number,
    correct: number,
    step = 1,
  ) => ({ id, label, min, max, step, correct })
  switch (preview) {
    case 'linear':
      return [row('m', 'm', -5, 5, 1), row('n', 'n', -5, 5, 0)]
    case 'quadratic':
      return [row('a', 'a', -3, 3, 1), row('b', 'b', -5, 5, 0), row('c', 'c', -5, 5, 0)]
    case 'cubic':
      return [
        row('a', 'a', -2, 2, 1),
        row('b', 'b', -3, 3, 0),
        row('c', 'c', -3, 3, 0),
        row('d', 'd', -3, 3, 0),
      ]
    case 'sin':
    case 'cos':
    case 'tan':
      return [
        row('a', 'a', -3, 3, 1),
        row('b', 'b', -3, 3, 1),
        row('h', 'h', -3, 3, 0),
        row('k', 'k', -3, 3, 0),
      ]
    case 'exp':
      return [row('a', 'a', -3, 3, 1), row('b', 'b', -2, 2, 1), row('c', 'c', -3, 3, 0)]
    case 'ln':
    case 'abs':
    case 'reciprocal':
    case 'sqrt':
      return [row('a', 'a', -3, 3, 1), row('h', 'h', -3, 3, 0), row('k', 'k', -3, 3, 0)]
    case 'power':
      return [row('a', 'a', -3, 3, 1), row('n', 'n', -3, 4, 2)]
  }
}
