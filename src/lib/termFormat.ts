import { formatDe } from './num'

const MINUS = '−'

/** Zahl mit echtem Minuszeichen und deutschem Dezimalkomma: −3, 2,5. */
export const signedNum = (n: number): string => (n < 0 ? `${MINUS}${formatDe(-n)}` : formatDe(n))

/** Zahl als Faktor/Summand: negative in Klammern, z. B. (−3). */
export const parenNum = (n: number): string => (n < 0 ? `(${signedNum(n)})` : signedNum(n))

/** Angehängter Summand mit Rechenzeichen: „ + 3“, „ − 3“ (auch in Zahlenrechnungen). */
export const addNum = (n: number): string => (n < 0 ? ` ${MINUS} ${formatDe(-n)}` : ` + ${formatDe(n)}`)

/**
 * Term in üblicher Schreibweise aus [Koeffizient, Variable]-Paaren, z. B.
 * polyStr([[-3, 'x²'], [1, 'x'], [-4, '']]) → „−3x² + x − 4“. Nullglieder entfallen.
 */
export function polyStr(terms: [number, string][]): string {
  const parts: string[] = []
  for (const [coef, sym] of terms) {
    if (coef === 0) continue
    const abs = Math.abs(coef)
    const mag = abs === 1 && sym ? '' : formatDe(abs)
    if (parts.length === 0) parts.push(`${coef < 0 ? MINUS : ''}${mag}${sym}`)
    else parts.push(`${coef < 0 ? MINUS : '+'} ${mag}${sym}`)
  }
  return parts.length ? parts.join(' ') : '0'
}

/** Lineare Funktion m·x + n in üblicher Schreibweise: „−3x − 4“, „x“, „5“. */
export const linStr = (m: number, n: number, v = 'x'): string => polyStr([[m, v], [n, '']])

/** Eingesetztes a·x²: „(−3)²“, „−(−3)²“, „2 · (−3)²“. */
export const aTimesSq = (a: number, x: number): string =>
  `${a === 1 ? '' : a === -1 ? MINUS : `${signedNum(a)} · `}${parenNum(x)}²`

/** Linearfaktor (x − r): „(x − 3)“, „(x + 2)“, „x“ für r = 0. */
export const linFactor = (r: number, v = 'x'): string =>
  r === 0 ? v : `(${v} ${r < 0 ? '+' : MINUS} ${formatDe(Math.abs(r))})`
