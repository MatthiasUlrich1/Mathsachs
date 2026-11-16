/**
 * Colours for on-screen inline SVG, as CSS custom properties (design tokens in
 * index.css). Never hex: they follow the theme (Heft / Tafel).
 * Print and task-illustration strings keep fixed colours (see svgColorLiterals.test.ts).
 */
export const SVG_COLOR = {
  ink: 'var(--ink)',
  graphite: 'var(--graphite)',
  pencil: 'var(--pencil)',
  paper: 'var(--paper)',
  surface: 'var(--surface)',
  grid: 'var(--grid)',
  line: 'var(--line)',
  tick: 'var(--tick)',
  correction: 'var(--correction)',
  svgLine: 'var(--svg-line)',
  fillA: 'var(--svg-fill-a)',
  fillB: 'var(--svg-fill-b)',
  highlight: 'var(--svg-highlight)',
  onMarker: 'var(--on-marker)',
} as const

/**
 * Shading colours for up to six categories (pie sectors, people in DivideTool).
 * The first two are the semantic fills; the rest are mixes of them. Identity is
 * never carried by colour alone (labels, numbers, legend names are always shown).
 */
export const SVG_SERIES: readonly string[] = [
  'var(--svg-fill-a)',
  'var(--svg-fill-b)',
  'color-mix(in srgb, var(--svg-fill-a) 55%, var(--svg-fill-b))',
  'color-mix(in srgb, var(--svg-fill-a) 60%, var(--surface))',
  'color-mix(in srgb, var(--svg-fill-b) 60%, var(--surface))',
  'color-mix(in srgb, var(--svg-fill-b) 55%, var(--svg-fill-a))',
]

export const seriesColor = (i: number): string => SVG_SERIES[((i % SVG_SERIES.length) + SVG_SERIES.length) % SVG_SERIES.length]!

/**
 * Legacy colours that released curriculum data still passes to graph objects and
 * markers (`color: '#...'`). They are mapped to tokens at render time so the data
 * stays unchanged and the drawing follows the theme.
 */
const LEGACY_DATA_COLOR: Record<string, string> = {
  '#c62828': SVG_COLOR.correction,
  '#dc2626': SVG_COLOR.correction,
  '#f59e0b': SVG_COLOR.highlight,
  '#64748b': SVG_COLOR.svgLine,
  '#1565c0': SVG_COLOR.ink,
  '#64b5f6': SVG_COLOR.fillA,
}

/** Maps a data colour (legacy hex or already a CSS value) to a themed colour. */
export const dataColor = (c: string | undefined, fallback: string): string =>
  c === undefined ? fallback : (LEGACY_DATA_COLOR[c.toLowerCase()] ?? c)
