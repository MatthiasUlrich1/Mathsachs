import { gcd } from '../lib/fraction'
import { formatDe, roundTo } from '../lib/num'
import { randInt, type Rng } from '../lib/rng'
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

export const conversionTopic = (idPrefix: string, q: Quantity): Topic => ({
  id: `${idPrefix}-umrechnen-${slug[q.label] ?? q.label.toLowerCase()}`,
  title: `Einheiten umrechnen: ${q.label}`,
  hint: `Nutze den Umrechnungsfaktor zwischen den ${q.label === 'Zeit' ? 'Zeiteinheiten' : 'Einheiten'}.`,
  pointsPerTask: 10,
  keywords: keywordsFor[q.label] ?? [...commonKeywords, q.label],
  generate: (rng: Rng) => generateConversion(rng, q),
})
