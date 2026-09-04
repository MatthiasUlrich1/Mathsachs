/** A deterministic pseudo-random number generator returning values in [0, 1). */
export type Rng = () => number

/** mulberry32 — small, fast, seedable PRNG. Same seed → same sequence. */
export const createRng = (seed: number): Rng => {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Random integer in [min, max] (inclusive). */
export const randInt = (rng: Rng, min: number, max: number): number =>
  Math.floor(rng() * (max - min + 1)) + min

/** Pick a random element from a non-empty array. */
export const pick = <T>(rng: Rng, items: readonly T[]): T =>
  items[randInt(rng, 0, items.length - 1)]

/** A seed derived from the current time, for non-reproducible sessions. */
export const timeSeed = (): number => (Date.now() ^ (Math.random() * 1e9)) >>> 0
