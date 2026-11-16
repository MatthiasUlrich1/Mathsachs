/** Parse a user-entered number, accepting both "3,5" (German) and "3.5". */
export const parseNumber = (raw: string): number | null => {
  let text = raw.trim().replace(/\s/g, '')
  // Deutsche Schreibweise mit Tausenderpunkt und Komma, z. B. "3.000,00" -> "3000,00".
  if (/^[-+]?\d{1,3}(\.\d{3})+,\d+$/.test(text)) text = text.replace(/\./g, '')
  const cleaned = text.replace(',', '.')
  if (cleaned === '' || !/^[-+]?\d*\.?\d+$/.test(cleaned)) return null
  const value = Number(cleaned)
  return Number.isFinite(value) ? value : null
}

/** Parse an integer, accepting a leading sign. */
export const parseInteger = (raw: string): number | null => {
  let cleaned = raw.trim().replace(/\s/g, '')
  // Tausenderpunkte (z. B. "3.000") sind bei ganzen Zahlen eindeutig.
  if (/^[-+]?\d{1,3}(\.\d{3})+$/.test(cleaned)) cleaned = cleaned.replace(/\./g, '')
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
  const rounded = roundTo(value, maxPlaces)
  return rounded
    .toLocaleString('de-DE', { maximumFractionDigits: maxPlaces })
    .replace(/\u00a0/g, ' ')
}

/** Compare two numbers for equality within a small tolerance. */
export const approxEqual = (a: number, b: number, eps = 1e-9): boolean =>
  Math.abs(a - b) <= eps
