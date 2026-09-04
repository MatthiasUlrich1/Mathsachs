/** A fraction with an integer numerator and a non-zero integer denominator. */
export interface Fraction {
  n: number
  d: number
}

export const gcd = (a: number, b: number): number => {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a || 1
}

export const lcm = (a: number, b: number): number =>
  Math.abs(a * b) / gcd(a, b)

/** Reduce a fraction to lowest terms, keeping the sign on the numerator. */
export const reduce = (f: Fraction): Fraction => {
  if (f.d === 0) throw new Error('denominator must not be zero')
  const sign = f.d < 0 ? -1 : 1
  const n = f.n * sign
  const d = f.d * sign
  const g = gcd(n, d)
  return { n: n / g, d: d / g }
}

export const makeFraction = (n: number, d: number): Fraction => reduce({ n, d })

export const add = (a: Fraction, b: Fraction): Fraction =>
  reduce({ n: a.n * b.d + b.n * a.d, d: a.d * b.d })

export const subtract = (a: Fraction, b: Fraction): Fraction =>
  reduce({ n: a.n * b.d - b.n * a.d, d: a.d * b.d })

export const multiply = (a: Fraction, b: Fraction): Fraction =>
  reduce({ n: a.n * b.n, d: a.d * b.d })

export const divide = (a: Fraction, b: Fraction): Fraction => {
  if (b.n === 0) throw new Error('cannot divide by zero')
  return reduce({ n: a.n * b.d, d: a.d * b.n })
}

export const toDecimal = (f: Fraction): number => f.n / f.d

/** Compare two fractions: negative if a < b, 0 if equal, positive if a > b. */
export const compare = (a: Fraction, b: Fraction): number =>
  a.n * b.d - b.n * a.d

export const equals = (a: Fraction, b: Fraction): boolean =>
  compare(a, b) === 0

/** True when the fraction is already in lowest terms. */
export const isReduced = (f: Fraction): boolean => {
  const r = reduce(f)
  return r.n === f.n && r.d === f.d
}

/** Whether a fraction has an exact (terminating) decimal representation. */
export const isTerminating = (f: Fraction): boolean => {
  let d = reduce(f).d
  while (d % 2 === 0) d /= 2
  while (d % 5 === 0) d /= 5
  return d === 1
}

/** Format as "n/d", or just "n" when the denominator is 1. */
export const format = (f: Fraction): string =>
  f.d === 1 ? `${f.n}` : `${f.n}/${f.d}`

/** Format as a mixed number, e.g. 7/2 → "3 1/2". */
export const formatMixed = (f: Fraction): string => {
  const r = reduce(f)
  if (r.d === 1) return `${r.n}`
  const whole = Math.trunc(r.n / r.d)
  const rem = Math.abs(r.n % r.d)
  if (whole === 0) return `${r.n}/${r.d}`
  return `${whole} ${rem}/${r.d}`
}
