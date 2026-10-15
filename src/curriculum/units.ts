import { gcd } from '../lib/fraction'
import { formatDe, roundTo } from '../lib/num'
import { randInt, type Rng } from '../lib/rng'
import { conversionFachwissen } from './fachwissen'
import { valueTask } from './taskHelpers'
import type { Task, Topic } from './types'

/**
 * A single measuring unit within a quantity, described by an integer `scale`
 * relative to the quantity's smallest base unit. Using integer scales keeps all
 * conversions exact (no binary-float surprises) and lets us reason about clean,
 * uniquely checkable answers.
 */
interface Unit {
  sym: string
  scale: number
}

/** A physical quantity with an ordered list of units (ascending by scale). */
export interface Quantity {
  /** Human label, e.g. "Länge". */
  label: string
  units: Unit[]
  /** Reject unit pairs whose size ratio exceeds this (keeps answers typeable). */
  maxRatio: number
}

// Base unit = smallest listed unit; all scales are exact integers.
export const LAENGE: Quantity = {
  label: 'Länge',
  units: [
    { sym: 'mm', scale: 1 },
    { sym: 'cm', scale: 10 },
    { sym: 'dm', scale: 100 },
    { sym: 'm', scale: 1000 },
    { sym: 'km', scale: 1_000_000 },
  ],
  maxRatio: 1000,
}

export const FLAECHE: Quantity = {
  label: 'Flächeninhalt',
  units: [
    { sym: 'mm²', scale: 1 },
    { sym: 'cm²', scale: 100 },
    { sym: 'dm²', scale: 10_000 },
    { sym: 'm²', scale: 1_000_000 },
    { sym: 'a', scale: 100_000_000 },
    { sym: 'ha', scale: 10_000_000_000 },
    { sym: 'km²', scale: 1_000_000_000_000 },
  ],
  maxRatio: 10_000,
}

export const VOLUMEN: Quantity = {
  label: 'Volumen',
  units: [
    { sym: 'mm³', scale: 1 },
    { sym: 'ml', scale: 1000 },
    { sym: 'cm³', scale: 1000 },
    { sym: 'l', scale: 1_000_000 },
    { sym: 'dm³', scale: 1_000_000 },
    { sym: 'm³', scale: 1_000_000_000 },
  ],
  maxRatio: 1000,
}

export const MASSE: Quantity = {
  label: 'Masse',
  units: [
    { sym: 'mg', scale: 1 },
    { sym: 'g', scale: 1000 },
    { sym: 'kg', scale: 1_000_000 },
    { sym: 't', scale: 1_000_000_000 },
  ],
  maxRatio: 1000,
}

export const ZEIT: Quantity = {
  label: 'Zeit',
  units: [
    { sym: 's', scale: 1 },
    { sym: 'min', scale: 60 },
    { sym: 'h', scale: 3600 },
  ],
  maxRatio: 3600,
}

/**
 * Number of decimal places of the exact fraction n/d, or null when the value
 * does not terminate or needs more than `maxDecimals` places.
 */
const decimalPlaces = (n: number, d: number, maxDecimals: number): number | null => {
  const g = gcd(n, d)
  let den = d / g
  let twos = 0
  let fives = 0
  while (den % 2 === 0) {
    den /= 2
    twos++
  }
  while (den % 5 === 0) {
    den /= 5
    fives++
  }
  if (den !== 1) return null // non-terminating decimal
  const decimals = Math.max(twos, fives)
  return decimals > maxDecimals ? null : decimals
}

/** Exact value and its decimal length, or null when it is not clean enough. */
const cleanValue = (
  n: number,
  d: number,
  maxDecimals: number,
): { value: number; decimals: number } | null => {
  const decimals = decimalPlaces(n, d, maxDecimals)
  if (decimals === null) return null
  return { value: roundTo(n / d, decimals), decimals }
}

/** Build a single "Rechne um" task for the given quantity. */
export const generateConversion = (rng: Rng, q: Quantity): Task => {
  const n = q.units.length
  // Try random unit pairs/amounts until we get a clean, uniquely checkable
  // answer. The rng is deterministic, so this stays reproducible per seed.
  for (let attempt = 0; attempt < 60; attempt++) {
    const i = randInt(rng, 0, n - 1)
    const j = randInt(rng, 0, n - 1)
    if (i === j) continue
    const from = q.units[i]
    const to = q.units[j]
    if (from.scale === to.scale) continue // e.g. l vs dm³ — skip trivial pairs
    const ratio = Math.max(from.scale, to.scale) / Math.min(from.scale, to.scale)
    if (ratio > q.maxRatio) continue
    const amount = randInt(rng, 2, 99)
    const maxDec = q.label === 'Flächeninhalt' ? 4 : 3
    const res = cleanValue(amount * from.scale, to.scale, maxDec)
    if (!res) continue
    if (res.value > 1_000_000) continue // keep answers reasonable to type
    return buildTask(from, to, amount, res.value, res.decimals)
  }
  // Fallback: a big→small conversion is always an exact integer.
  const hi = q.units[n - 1]
  const lo = q.units[0]
  const amount = randInt(rng, 2, 9)
  const value = (amount * hi.scale) / lo.scale
  return buildTask(hi, lo, amount, value, 0)
}

const buildTask = (
  from: Unit,
  to: Unit,
  amount: number,
  value: number,
  decimals: number,
): Task => {
  const bigger = from.scale > to.scale
  const factor = bigger ? from.scale / to.scale : to.scale / from.scale
  const explanation = bigger
    ? `1 ${from.sym} = ${formatDe(factor)} ${to.sym}. Also ${formatDe(amount)} ${from.sym} = ${formatDe(amount)} · ${formatDe(factor)} ${to.sym} = ${formatDe(value)} ${to.sym}.`
    : `1 ${to.sym} = ${formatDe(factor)} ${from.sym}. Also ${formatDe(amount)} ${from.sym} = ${formatDe(amount)} : ${formatDe(factor)} ${to.sym} = ${formatDe(value)} ${to.sym}.`
  return valueTask({
    question: `Rechne um: ${formatDe(amount)} ${from.sym} = ? ${to.sym}`,
    unit: to.sym,
    answerKind: decimals === 0 ? 'integer' : 'decimal',
    value,
    eps: decimals === 0 ? undefined : 1e-6,
    solution: `${formatDe(value)} ${to.sym}`,
    explanation,
  })
}

/** Keyword sets so unit-conversion topics are easy to find via search. */
const commonKeywords = ['Einheiten', 'umrechnen', 'Einheiten umrechnen', 'Umrechnung']

const keywordsFor: Record<string, string[]> = {
  Länge: [...commonKeywords, 'Länge', 'Längeneinheiten', 'mm', 'cm', 'dm', 'm', 'km', 'Meter', 'Zentimeter', 'Kilometer'],
  Flächeninhalt: [
    ...commonKeywords,
    'Fläche',
    'Flächeninhalt',
    'Flächeneinheiten',
    'mm²',
    'cm²',
    'dm²',
    'm²',
    'm2',
    'Quadratmeter',
    'a',
    'Ar',
    'ha',
    'Hektar',
    'km²',
  ],
  Volumen: [...commonKeywords, 'Volumen', 'Rauminhalt', 'Hohlmaße', 'mm³', 'cm³', 'dm³', 'm³', 'Liter', 'l', 'ml', 'Milliliter'],
  Masse: [...commonKeywords, 'Masse', 'Gewicht', 'Masseneinheiten', 'mg', 'g', 'kg', 't', 'Gramm', 'Kilogramm', 'Tonne'],
  Zeit: [...commonKeywords, 'Zeit', 'Zeiteinheiten', 'Sekunden', 'Minuten', 'Stunden', 's', 'min', 'h'],
}

/**
 * Create a ready-to-use unit-conversion Topic for a quantity, with a
 * class-specific id prefix so ids stay unique across grades.
 */
const slug: Record<string, string> = {
  Länge: 'laenge',
  Flächeninhalt: 'flaeche',
  Volumen: 'volumen',
  Masse: 'masse',
  Zeit: 'zeit',
}

/**
 * Klasse 6: Größen in Kommaschreibweise (3,45 m → cm) und gemischte Angaben
 * (3 m 45 cm → m) — bewusst ein anderer Aufgabenpool als die ganzzahligen K5-Umrechnungen.
 */
export const generateConversionDecimal = (rng: Rng, q: Quantity): Task => {
  const n = q.units.length
  for (let attempt = 0; attempt < 80; attempt++) {
    const i = randInt(rng, 1, n - 1)
    const big = q.units[i]
    if (rng() < 0.4) {
      const small = q.units[i - 1]
      if (small.scale === big.scale) continue
      const factor = big.scale / small.scale
      if (factor > q.maxRatio || factor < 10) continue
      const whole = randInt(rng, 1, 19)
      const rest = randInt(rng, 1, factor - 1)
      const res = cleanValue(whole * factor + rest, factor, 4)
      if (!res) continue
      return valueTask({
        question: `Schreibe in ${big.sym}: ${formatDe(whole)} ${big.sym} ${formatDe(rest)} ${small.sym} = ? ${big.sym}`,
        unit: big.sym,
        answerKind: 'decimal',
        value: res.value,
        eps: 1e-6,
        solution: `${formatDe(res.value)} ${big.sym}`,
        explanation: `1 ${big.sym} = ${formatDe(factor)} ${small.sym}, also sind ${formatDe(rest)} ${small.sym} = ${formatDe(roundTo(rest / factor, 4))} ${big.sym}. Zusammen: ${formatDe(whole)} + ${formatDe(roundTo(rest / factor, 4))} = ${formatDe(res.value)} ${big.sym}.`,
        dedupeKey: `units:k6:mixed:${q.label}:${whole}:${rest}:${big.sym}`,
      })
    }
    const j = randInt(rng, 0, n - 1)
    const from = big
    const to = q.units[j]
    if (from.scale === to.scale) continue
    const ratio = Math.max(from.scale, to.scale) / Math.min(from.scale, to.scale)
    if (ratio > q.maxRatio) continue
    const hundredths = randInt(rng, 101, 999)
    if (hundredths % 10 === 0) continue
    const amount = hundredths / 100
    const res = cleanValue(hundredths * from.scale, 100 * to.scale, 4)
    if (!res || res.value > 1_000_000) continue
    return { ...buildTask(from, to, amount, res.value, res.decimals), dedupeKey: `units:k6:dec:${q.label}:${hundredths}:${from.sym}:${to.sym}` }
  }
  return generateConversion(rng, q)
}

export const conversionTopic = (idPrefix: string, q: Quantity, opts?: { decimalAmounts?: boolean }): Topic => ({
  id: `${idPrefix}-umrechnen-${slug[q.label] ?? q.label.toLowerCase()}`,
  title: opts?.decimalAmounts ? `Größen in Kommaschreibweise umrechnen: ${q.label}` : `Einheiten umrechnen: ${q.label}`,
  pointsPerTask: 10,
  keywords: keywordsFor[q.label] ?? [...commonKeywords, q.label],
  fachwissen: conversionFachwissen(q.label),
  generate: opts?.decimalAmounts
    ? (rng: Rng) => generateConversionDecimal(rng, q)
    : (rng: Rng) => generateConversion(rng, q),
})
