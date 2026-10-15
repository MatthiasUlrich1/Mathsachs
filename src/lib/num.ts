/** Typographic minus sign (U+2212) used in all displayed numbers. */
const MINUS = '\u2212'

/** Parse a user-entered number, accepting both "3,5" (German) and "3.5". */
export const parseNumber = (raw: string): number | null => {
  const cleaned = raw.trim().replace(/\s/g, '').replace(/[−–]/g, '-').replace(',', '.')
  if (cleaned === '' || !/^[-+]?\d*\.?\d+$/.test(cleaned)) return null
  const value = Number(cleaned)
  return Number.isFinite(value) ? value : null
}

/** Parse an integer, accepting a leading sign. */
export const parseInteger = (raw: string): number | null => {
  const cleaned = raw.trim().replace(/\s/g, '').replace(/[−–]/g, '-')
  if (!/^[-+]?\d+$/.test(cleaned)) return null
  return Number(cleaned)
}

/** Round to a number of decimal places, avoiding binary-float artefacts. */
export const roundTo = (value: number, places: number): number => {
  const factor = 10 ** places
  return Math.round((value + Number.EPSILON) * factor) / factor
}

/** Format a number with German decimal comma, trimming trailing zeros. */
export const formatDe = (value: number, maxPlaces = 4): string => {
  const rounded = roundTo(value, maxPlaces) || 0
  return rounded
    .toLocaleString('de-DE', { maximumFractionDigits: maxPlaces })
    .replace(/\u00a0/g, ' ')
    .replace(/^-/, MINUS)
}

/** Compare two numbers for equality within a small tolerance. */
export const approxEqual = (a: number, b: number, eps = 1e-9): boolean =>
  Math.abs(a - b) <= eps
