import { pick, randInt, type Rng } from '../lib/rng'
import { formatDe, roundTo } from '../lib/num'
import { valueTask } from './taskHelpers'
import type { Grade, Topic } from './types'

const num = (n: number): string => (n < 0 ? `(−${Math.abs(n)})` : `${n}`)
const nonZero = (rng: Rng, min: number, max: number): number => {
  let v = 0
  while (v === 0) v = randInt(rng, min, max)
  return v
}

/** A following polynomial term with its sign, e.g. " + 3x²" or " − 2x". */
const term = (coeff: number, suffix: string): string => {
  if (coeff === 0) return ''
  const sign = coeff < 0 ? '− ' : '+ '
  const mag = Math.abs(coeff) === 1 && suffix ? '' : `${Math.abs(coeff)}`
  return ` ${sign}${mag}${suffix}`
}

/** A leading polynomial term (no leading sign for positives), e.g. "x³", "−2x". */
const firstTerm = (coeff: number, suffix: string): string => {
  if (Math.abs(coeff) === 1 && suffix) return coeff < 0 ? `−${suffix}` : suffix
  return `${coeff < 0 ? `−${Math.abs(coeff)}` : coeff}${suffix}`
}

/** A squared value, wrapping negatives in parentheses: 7² or (−4)². */
const sq = (n: number): string => (n < 0 ? `(−${Math.abs(n)})²` : `${n}²`)

/** Join signed numbers into a readable sum, e.g. "3 + 4 − 3". */
const sumOf = (vals: number[]): string =>
  vals
    .map((v, i) => (i === 0 ? `${v}` : v < 0 ? `− ${Math.abs(v)}` : `+ ${v}`))
    .join(' ')

/** A single number with a real minus sign for negatives (for display). */
const minus = (n: number): string => (n < 0 ? `−${Math.abs(n)}` : `${n}`)

/** Format a vector tuple as "(x; y; z)" with real minus signs. */
const vec = (v: number[]): string => `(${v.map(minus).join('; ')})`

// ---------------------------------------------------------------------------
// Lernbereich 1 — Differential- und Integralrechnung
// ---------------------------------------------------------------------------

const ableitungStelle: Topic = {
  id: 'k1112-lb1-ableitung-stelle',
  title: 'Ableitung eines Polynoms an einer Stelle',
  hint: "Leite mit der Potenzregel ab und setze x₀ ein.",
  pointsPerTask: 10,
  keywords: ['Ableitung', 'Differentialrechnung', 'Steigung', 'Polynom', "f'(x)", 'Potenzregel'],
  generate: (rng: Rng) => {
    const a = nonZero(rng, -3, 3)
    const b = nonZero(rng, -4, 4)
    const c = nonZero(rng, -5, 5)
    const x0 = nonZero(rng, -3, 3)
    // f(x) = a x³ + b x² + c x + d  →  f'(x) = 3a x² + 2b x + c
    const value = 3 * a * x0 * x0 + 2 * b * x0 + c
    const fStr = `f(x) = ${firstTerm(a, 'x³')}${term(b, 'x²')}${term(c, 'x')} + d`
    const derivStr = `${firstTerm(3 * a, 'x²')}${term(2 * b, 'x')}${term(c, '')}`
    return valueTask({
      question: `Gegeben ist ${fStr}. Berechne die Ableitung an der Stelle x₀ = ${x0}, also f'(${x0}).`,
      answerKind: 'integer',
      value,
      solution: `f'(${x0}) = ${value}`,
      explanation: `Ableiten mit der Potenzregel: f'(x) = ${derivStr}. Einsetzen von x₀ = ${x0}: f'(${x0}) = ${sumOf([3 * a * x0 * x0, 2 * b * x0, c])} = ${value}.`,
    })
  },
}

const nullstelleLinear: Topic = {
  id: 'k1112-lb1-nullstelle-linear',
  title: 'Nullstelle einer linearen Funktion',
  hint: 'Setze f(x) = 0 und löse nach x.',
  pointsPerTask: 10,
  keywords: ['Nullstelle', 'lineare Funktion', 'Gleichung', 'x-Achse', 'Schnittpunkt'],
  generate: (rng: Rng) => {
    const m = nonZero(rng, -6, 6)
    const x0 = nonZero(rng, -8, 8)
    const n = -m * x0 // ensures the zero is the integer x0
    return valueTask({
      question: `Bestimme die Nullstelle der Funktion f(x) = ${m}x ${n < 0 ? `− ${Math.abs(n)}` : `+ ${n}`}.`,
      answerKind: 'integer',
      value: x0,
      solution: `x = ${x0}`,
      explanation: `Setze f(x) = 0: ${m}x ${n < 0 ? `− ${Math.abs(n)}` : `+ ${n}`} = 0, also ${m}x = ${-n}, x = ${-n} : ${m} = ${x0}.`,
    })
  },
}

const bestimmtesIntegral: Topic = {
  id: 'k1112-lb1-bestimmtes-integral',
  title: 'Bestimmtes Integral eines Polynoms',
  hint: 'Bilde die Stammfunktion und setze die Grenzen ein.',
  pointsPerTask: 10,
  keywords: ['Integral', 'bestimmtes Integral', 'Stammfunktion', 'Integralrechnung', 'Fläche'],
  generate: (rng: Rng) => {
    // f(x) = a x² + b x + c with a multiple of 3 and b even → integer result.
    const a = pick(rng, [-3, 3, 6])
    const b = pick(rng, [-4, -2, 2, 4])
    const c = nonZero(rng, -3, 3)
    const q = randInt(rng, 2, 5)
    // ∫₀^q f dx = a/3 q³ + b/2 q² + c q
    const value = Math.round((a / 3) * q ** 3 + (b / 2) * q ** 2 + c * q)
    const fStr = `${firstTerm(a, 'x²')}${term(b, 'x')}${term(c, '')}`
    const fatF = `${firstTerm(a / 3, 'x³')}${term(b / 2, 'x²')}${term(c, 'x')}`
    return valueTask({
      question: `Berechne das bestimmte Integral ∫₀^${q} (${fStr}) dx.`,
      answerKind: 'integer',
      value,
      solution: `${value}`,
      explanation: `Stammfunktion: F(x) = ${fatF}. F(${q}) − F(0) = ${sumOf([(a / 3) * q ** 3, (b / 2) * q ** 2, c * q])} = ${value}.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 2 — Vektoren, Geraden und Ebenen
// ---------------------------------------------------------------------------

const skalarprodukt: Topic = {
  id: 'k1112-lb2-skalarprodukt',
  title: 'Skalarprodukt zweier Vektoren',
  hint: 'Multipliziere komponentenweise und addiere.',
  pointsPerTask: 10,
  keywords: ['Skalarprodukt', 'Vektoren', 'Vektor', 'komponentenweise', 'analytische Geometrie'],
  generate: (rng: Rng) => {
    const a = [nonZero(rng, -6, 6), nonZero(rng, -6, 6), nonZero(rng, -6, 6)]
    const b = [nonZero(rng, -6, 6), nonZero(rng, -6, 6), nonZero(rng, -6, 6)]
    const value = a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
    const products = [a[0] * b[0], a[1] * b[1], a[2] * b[2]]
    return valueTask({
      question: `Berechne das Skalarprodukt der Vektoren a = ${vec(a)} und b = ${vec(b)}.`,
      answerKind: 'integer',
      value,
      solution: `${value}`,
      explanation: `a · b = ${num(a[0])}·${num(b[0])} + ${num(a[1])}·${num(b[1])} + ${num(a[2])}·${num(b[2])} = ${sumOf(products)} = ${value}.`,
    })
  },
}

// 3D vectors with integer magnitude, to keep the answer exact.
const VEC3: ReadonlyArray<readonly [number, number, number, number]> = [
  [1, 2, 2, 3],
  [2, 3, 6, 7],
  [1, 4, 8, 9],
  [2, 6, 9, 11],
  [4, 4, 7, 9],
  [3, 4, 12, 13],
]

const betragVektor: Topic = {
  id: 'k1112-lb2-betrag-vektor',
  title: 'Betrag eines Vektors',
  hint: '|v| = √(x² + y² + z²).',
  pointsPerTask: 10,
  keywords: ['Betrag', 'Länge', 'Vektor', 'Vektoren', 'Norm', 'analytische Geometrie'],
  generate: (rng: Rng) => {
    const [x, y, z, mag] = pick(rng, VEC3)
    const sx = rng() < 0.5 ? -x : x
    const sy = rng() < 0.5 ? -y : y
    const sz = rng() < 0.5 ? -z : z
    return valueTask({
      question: `Berechne den Betrag (die Länge) des Vektors v = ${vec([sx, sy, sz])}.`,
      answerKind: 'integer',
      value: mag,
      solution: `${mag}`,
      explanation: `|v| = √(${sq(sx)} + ${sq(sy)} + ${sq(sz)}) = √(${sx * sx} + ${sy * sy} + ${sz * sz}) = √${sx * sx + sy * sy + sz * sz} = ${mag}.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 3 — Binomialverteilte Zufallsgrößen
// ---------------------------------------------------------------------------

const binom = (n: number, k: number): number => {
  let r = 1
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i
  return Math.round(r)
}

const binomialverteilung: Topic = {
  id: 'k1112-lb3-binomialverteilung',
  title: 'Binomialverteilung: P(X = k)',
  hint: 'P(X = k) = C(n, k) · pᵏ · (1 − p)ⁿ⁻ᵏ.',
  pointsPerTask: 10,
  keywords: ['Binomialverteilung', 'Wahrscheinlichkeit', 'Bernoulli', 'P(X=k)', 'Stochastik'],
  generate: (rng: Rng) => {
    const n = pick(rng, [4, 5, 6])
    const p = pick(rng, [0.1, 0.2, 0.25, 0.5])
    const mean = Math.round(n * p)
    const k = Math.max(0, Math.min(n, mean + randInt(rng, -1, 1)))
    const c = binom(n, k)
    const raw = c * p ** k * (1 - p) ** (n - k)
    const value = roundTo(raw, 4)
    return valueTask({
      question: `Eine Zufallsgröße ist binomialverteilt mit n = ${n} und p = ${formatDe(p)}. Berechne P(X = ${k}) (auf vier Nachkommastellen).`,
      answerKind: 'decimal',
      value,
      eps: 0.0005,
      solution: formatDe(value),
      explanation: `P(X = ${k}) = C(${n}, ${k}) · ${formatDe(p)}^${k} · ${formatDe(1 - p)}^${n - k} = ${c} · ${formatDe(p ** k)} · ${formatDe((1 - p) ** (n - k))} ≈ ${formatDe(value)}.`,
    })
  },
}

const erwartungswertBinom: Topic = {
  id: 'k1112-lb3-erwartungswert-binom',
  title: 'Erwartungswert der Binomialverteilung',
  hint: 'E(X) = n · p.',
  pointsPerTask: 10,
  keywords: ['Binomialverteilung', 'Erwartungswert', 'E(X)', 'Stochastik', 'n mal p'],
  generate: (rng: Rng) => {
    const n = randInt(rng, 5, 50)
    const p = pick(rng, [0.1, 0.2, 0.25, 0.5])
    const value = roundTo(n * p, 2)
    return valueTask({
      question: `Eine Zufallsgröße ist binomialverteilt mit n = ${n} und p = ${formatDe(p)}. Berechne den Erwartungswert E(X).`,
      answerKind: 'decimal',
      value,
      solution: formatDe(value),
      explanation: `E(X) = n · p = ${n} · ${formatDe(p)} = ${formatDe(value)}.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Grade — Jahrgangsstufe 11/12, Grundkurs (Gymnasium Mathematik, Sachsen)
// ---------------------------------------------------------------------------

export const klasse11_12: Grade = {
  id: 'jgs-11-12',
  title: 'Jahrgangsstufe 11/12 (Grundkurs)',
  areas: [
    {
      id: 'lb1',
      title: 'Differential- und Integralrechnung',
      ustd: 52,
      topics: [ableitungStelle, nullstelleLinear, bestimmtesIntegral],
    },
    {
      id: 'lb2',
      title: 'Vektoren, Geraden und Ebenen',
      ustd: 32,
      topics: [skalarprodukt, betragVektor],
    },
    {
      id: 'lb3',
      title: 'Binomialverteilte Zufallsgrößen',
      ustd: 18,
      topics: [binomialverteilung, erwartungswertBinom],
    },
  ],
}
