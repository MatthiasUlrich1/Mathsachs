import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { namedColoursInCss } from './colourScan'

/*
 * Guards the "Schulheft & Tafel" redesign across EVERY src/**\/*.css file
 * (App.css, index.css and all component stylesheets): the old dark
 * slate/indigo/cyan palette must not come back, colours come from tokens.
 */
const listCss = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    return statSync(p).isDirectory() ? listCss(p) : p.endsWith('.css') ? [p] : []
  })

const ROOT = process.cwd()
const CSS_FILES = listCss(join(ROOT, 'src'))
  .map((p) => p.slice(ROOT.length + 1).replace(/\\/g, '/'))
  .sort()

const OLD_PALETTE = [
  '#0f172a',
  '#1e293b',
  '#6366f1',
  '#22d3ee',
  '#0b1120',
  'rgba(99,102,241',
  'rgba(34,211,238',
]

const read = (f: string) => readFileSync(join(ROOT, f), 'utf8')
const squash = (css: string) => css.toLowerCase().replace(/\s+/g, '')

/** Returns the old-palette entries found in the css (whitespace-insensitive). */
export const findOldPalette = (css: string): string[] =>
  OLD_PALETTE.filter((c) => squash(css).includes(c))
export const hasBackdropFilter = (css: string): boolean => /backdrop-filter/i.test(css)
/** Gradients other than the highlighter stripe (--marker) and squared-paper lines (--grid). */
export const foreignGradients = (css: string): string[] =>
  (css.match(/linear-gradient\([^;]*/g) ?? []).filter(
    (g) => !g.includes('var(--marker)') && !g.includes('var(--grid)'),
  )
/** Literal colours (hex / rgb / rgba / hsl) outside `@media print`. */
export const literalColours = (css: string): string[] => {
  const noPrint = css.replace(/@media print\s*\{[\s\S]*?\n\}/, '')
  return noPrint.match(/#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(/g) ?? []
}
/** Radius values that are not a token, 999px, 50% or 0. */
export const strayRadii = (css: string): string[] =>
  [...css.matchAll(/border(?:-[a-z]+)*-radius:\s*([^;]+);/g)]
    .map((m) => m[1].trim())
    .filter((v) => !/^(var\(--radius-(sheet|control|chip)\)|999px|50%|0)$/.test(v))
/** Deprecated D1 aliases that were removed from index.css. */
export const aliasUses = (css: string): string[] =>
  css.match(/var\(--(?:text|text-muted|accent|accent-2|good|bad|muted|bg-0|bg-1|border)\b/g) ?? []

/**
 * Literal colours that are allowed to stay, per file, with the reason.
 * Everything not listed here must be a token (var(--...)).
 */
const LITERAL_ALLOW: Record<string, { literals: string[]; why: string }> = {
  'src/App.css': {
    literals: ['#0a0a0a', '#0a0a0a', '#fff'],
    why: '#0a0a0a x2: supporter logos are designed for a dark background in both themes; #fff: QR code needs a white quiet zone.',
  },
}
/** index.css is the single source of the token values: literals only inside `--token:` declarations. */
const TOKEN_SOURCE = 'src/index.css'

describe('every src/**/*.css file is covered', () => {
  it('finds App.css, index.css and all 31 component stylesheets', () => {
    expect(CSS_FILES).toContain('src/App.css')
    expect(CSS_FILES).toContain('src/index.css')
    expect(CSS_FILES.filter((f) => f.startsWith('src/components/')).length).toBe(31)
  })
})

describe('old palette is gone from CSS', () => {
  for (const file of CSS_FILES) {
    it(`${file} contains no old palette colours`, () => {
      expect(findOldPalette(read(file))).toEqual([])
    })
  }

  it('negative control: detects old palette, also with odd whitespace', () => {
    expect(findOldPalette('a{color:#6366F1}')).toEqual(['#6366f1'])
    expect(findOldPalette('a{background: rgba(\n 99 ,102,  241, .1)}')).toEqual(['rgba(99,102,241'])
    expect(findOldPalette('a{color:var(--ink)}')).toEqual([])
  })
})

describe('no glass, foreign gradients, uppercase labels or removed aliases in any CSS file', () => {
  for (const file of CSS_FILES) {
    const css = read(file)
    it(`${file}: no backdrop-filter, gradients only marker/grid, no uppercase, no aliases`, () => {
      expect(hasBackdropFilter(css)).toBe(false)
      expect(foreignGradients(css)).toEqual([])
      expect(css).not.toMatch(/text-transform:\s*uppercase/)
      expect(aliasUses(css)).toEqual([])
    })
  }

  it('negative controls', () => {
    expect(hasBackdropFilter('a{-webkit-backdrop-filter:blur(4px)}')).toBe(true)
    expect(hasBackdropFilter('a{backdrop-filter:blur(4px)}')).toBe(true)
    expect(foreignGradients('a{background:linear-gradient(135deg,red,blue)}')).toHaveLength(1)
    expect(foreignGradients('a{background:linear-gradient(135deg,var(--ink),var(--ink))}')).toHaveLength(1)
    expect(foreignGradients('a{background:linear-gradient(transparent,var(--marker))}')).toEqual([])
    expect(foreignGradients('a{background:linear-gradient(var(--grid) 1px,transparent 1px)}')).toEqual([])
    expect(aliasUses('a{color:var(--muted, #64748b)}')).toEqual(['var(--muted'])
    expect(aliasUses('a{color:var(--pencil)}')).toEqual([])
  })
})

describe('literal colours: tokens everywhere except a minimal allow-list', () => {
  for (const file of CSS_FILES.filter((f) => f !== TOKEN_SOURCE)) {
    it(`${file}: ${LITERAL_ALLOW[file] ? 'only the allow-listed literals' : 'no literal colours'}`, () => {
      const lits = literalColours(read(file)).map((l) => l.toLowerCase())
      expect(lits.sort()).toEqual(LITERAL_ALLOW[file]?.literals ?? [])
    })
  }

  it('index.css: literal colours only appear in --token declarations (the token source)', () => {
    const lines = read(TOKEN_SOURCE)
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/@media print\s*\{[\s\S]*?\n\}/, '')
      .split(/\r?\n/)
      .filter((l) => literalColours(l).length > 0)
    expect(lines.length).toBeGreaterThan(20)
    for (const l of lines) expect(l).toMatch(/^\s*--[a-z-]+:/)
  })

  it('the allow-list has no stale entries and every entry has a reason', () => {
    for (const [file, { literals, why }] of Object.entries(LITERAL_ALLOW)) {
      expect(CSS_FILES).toContain(file)
      expect(literals.length).toBeGreaterThan(0)
      expect(why.length).toBeGreaterThan(10)
    }
  })

  it('negative control: detects literals, ignores print blocks', () => {
    expect(literalColours('a{color:#abc;b:rgb(1,2,3)}')).toHaveLength(2)
    expect(literalColours('@media print {\n a{color:#fff}\n}\n')).toEqual([])
    expect(literalColours('a{color:var(--ink);b:color-mix(in srgb, var(--tick) 10%, transparent)}')).toEqual([])
  })
})

describe('named colours (white, black, red, ...) are not used in CSS either', () => {
  for (const file of CSS_FILES) {
    it(`${file}: no named colours`, () => {
      expect(namedColoursInCss(read(file))).toEqual([])
    })
  }

  it('negative control: the real predicate finds names, also inside color-mix, and ignores keywords and tokens', () => {
    expect(namedColoursInCss('a{color:white;border:1px solid Red}')).toEqual(['white', 'red'])
    expect(namedColoursInCss('a{background:color-mix(in srgb, var(--tick) 12%, white)}')).toEqual(['white'])
    expect(namedColoursInCss('a{fill:currentColor;stroke:transparent;color:inherit;background:none}')).toEqual([])
    expect(namedColoursInCss('a{color:var(--green-ish);background:var(--surface)}')).toEqual([])
  })
})

describe('component and app radii', () => {
  it('radii in EVERY stylesheet only use tokens, 999px, 50% or 0', () => {
    for (const f of CSS_FILES) expect({ f, stray: strayRadii(read(f)) }).toEqual({ f, stray: [] })
    expect(strayRadii('a{border-radius: 12px;}')).toEqual(['12px'])
    expect(strayRadii('a{border-radius: var(--radius-control);}b{border-radius:999px;}c{border-radius:50%;}d{border-radius:0;}')).toEqual([])
  })
})
