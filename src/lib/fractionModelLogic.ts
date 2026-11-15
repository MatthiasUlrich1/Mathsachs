/**
 * Pure logic for the interactive fraction model (FractionModel).
 * Geometry is in SVG units (viewBox), never screen pixels.
 */
export const FRACTION_MODEL_MIN_DEN = 2
export const FRACTION_MODEL_MAX_DEN = 12

export type FractionModelShape = 'bar' | 'circle'

export interface FractionTarget {
  num: number
  den: number
}

export const FRACTION_BAR_VIEWBOX = { w: 320, h: 90 } as const
const BAR = { x: 10, y: 20, w: 300, h: 50 } as const
export const FRACTION_CIRCLE_VIEWBOX = { w: 220, h: 220 } as const
const CIRCLE = { cx: 110, cy: 110, r: 95 } as const

export const clampDen = (den: number): number =>
  Math.min(FRACTION_MODEL_MAX_DEN, Math.max(FRACTION_MODEL_MIN_DEN, Math.round(den)))

/** Start number of parts: never the target's own, so the start does not spoil. */
export const fractionModelStartDen = (targetDen: number): number => (targetDen === 4 ? 6 : 4)

/** Valid, de-duplicated, sorted part indices (0..den-1). */
export const normalizeShaded = (den: number, shaded: readonly number[]): number[] =>
  [...new Set(shaded.filter((i) => Number.isInteger(i) && i >= 0 && i < den))].sort((a, b) => a - b)

export const toggleShaded = (den: number, shaded: readonly number[], index: number): number[] => {
  const cur = normalizeShaded(den, shaded)
  return cur.includes(index) ? cur.filter((i) => i !== index) : normalizeShaded(den, [...cur, index])
}

/** New number of parts; shading beyond the new range is dropped. */
export const resizeFractionModel = (
  shaded: readonly number[],
  nextDen: number,
): { den: number; shaded: number[] } => {
  const d = clampDen(nextDen)
  return { den: d, shaded: normalizeShaded(d, shaded) }
}

export const shadedCount = (den: number, shaded: readonly number[]): number =>
  normalizeShaded(den, shaded).length

/** True when the shading shows the target fraction (optionally only with the same number of parts). */
export const fractionModelMatches = (
  den: number,
  shaded: readonly number[],
  target: FractionTarget,
  allowEquivalent: boolean,
): boolean => {
  if (!Number.isInteger(den) || den < FRACTION_MODEL_MIN_DEN || den > FRACTION_MODEL_MAX_DEN) return false
  if (!allowEquivalent && den !== target.den) return false
  // count / den === num / target.den, compared without floating point.
  return shadedCount(den, shaded) * target.den === target.num * den
}

/** Whether some number of parts (2..12) can show the target at all. */
export const fractionModelReachable = (target: FractionTarget): boolean => {
  for (let d = FRACTION_MODEL_MIN_DEN; d <= FRACTION_MODEL_MAX_DEN; d++) {
    const count = (target.num * d) / target.den
    if (Number.isInteger(count) && count >= 0 && count <= d) return true
  }
  return false
}

export interface FractionPartShape {
  index: number
  /** SVG path of the part. */
  d: string
}

const f = (n: number) => Math.round(n * 100) / 100

/** Path of every part of a bar or circle divided into `den` equal parts. */
export const fractionPartShapes = (shape: FractionModelShape, den: number): FractionPartShape[] => {
  const parts: FractionPartShape[] = []
  for (let i = 0; i < den; i++) {
    if (shape === 'bar') {
      const w = BAR.w / den
      const x0 = BAR.x + i * w
      const x1 = BAR.x + (i + 1) * w
      parts.push({
        index: i,
        d: `M${f(x0)} ${BAR.y}H${f(x1)}V${BAR.y + BAR.h}H${f(x0)}Z`,
      })
    } else {
      const a0 = (i / den) * 2 * Math.PI - Math.PI / 2
      const a1 = ((i + 1) / den) * 2 * Math.PI - Math.PI / 2
      const p = (a: number) => `${f(CIRCLE.cx + CIRCLE.r * Math.cos(a))} ${f(CIRCLE.cy + CIRCLE.r * Math.sin(a))}`
      const large = a1 - a0 > Math.PI ? 1 : 0
      parts.push({
        index: i,
        d: `M${CIRCLE.cx} ${CIRCLE.cy}L${p(a0)}A${CIRCLE.r} ${CIRCLE.r} 0 ${large} 1 ${p(a1)}Z`,
      })
    }
  }
  return parts
}

/** Bounding box of the drawn model in SVG units (for viewBox containment tests). */
export const fractionModelBounds = (
  shape: FractionModelShape,
): { x: number; y: number; w: number; h: number } =>
  shape === 'bar'
    ? { x: BAR.x, y: BAR.y, w: BAR.w, h: BAR.h }
    : { x: CIRCLE.cx - CIRCLE.r, y: CIRCLE.cy - CIRCLE.r, w: 2 * CIRCLE.r, h: 2 * CIRCLE.r }
