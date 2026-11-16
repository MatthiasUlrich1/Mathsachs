/** WCAG 2.x contrast helpers (pure). Used to verify the design tokens. */

const channel = (v: number): number => {
  const s = v / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

export function parseHex(hex: string): [number, number, number] {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) throw new Error(`Invalid hex colour: ${hex}`)
  const n = parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

/** CIE L*a*b* (D65) of a hex colour. */
export function labOf(hex: string): [number, number, number] {
  const [r, g, b] = parseHex(hex).map(channel)
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883
  const f = (t: number): number => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116)
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))]
}

/** CIE76 colour difference between two hex colours (about 2.3 = just noticeable, 15+ = clearly different). */
export function deltaE76(a: string, b: string): number {
  const [l1, a1, b1] = labOf(a)
  const [l2, a2, b2] = labOf(b)
  return Math.hypot(l1 - l2, a1 - a2, b1 - b2)
}

/** Smallest pairwise CIE76 distance of a list of colours. */
export function minPairwiseDeltaE(colours: readonly string[]): number {
  let min = Infinity
  for (let i = 0; i < colours.length; i++)
    for (let j = i + 1; j < colours.length; j++) min = Math.min(min, deltaE76(colours[i]!, colours[j]!))
  return min
}
