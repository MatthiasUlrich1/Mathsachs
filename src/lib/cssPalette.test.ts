import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/*
 * Guards the "Schulheft & Tafel" redesign: the old dark slate/indigo/cyan
 * palette must not come back. Scope for now: App.css and index.css (done in D1/D2).
 * D3 migrates the component CSS files; it must widen CSS_FILES to every
 * src/**\/*.css file (glob) once those are migrated.
 */
const CSS_FILES = ['src/App.css', 'src/index.css']

const OLD_PALETTE = [
  '#0f172a',
  '#1e293b',
  '#6366f1',
  '#22d3ee',
  '#0b1120',
  'rgba(99,102,241',
  'rgba(34,211,238',
]

const read = (f: string) => readFileSync(join(process.cwd(), f), 'utf8')
const squash = (css: string) => css.toLowerCase().replace(/\s+/g, '')

/** Returns the old-palette entries found in the css (whitespace-insensitive). */
export const findOldPalette = (css: string): string[] =>
  OLD_PALETTE.filter((c) => squash(css).includes(c))
export const hasBackdropFilter = (css: string): boolean => /backdrop-filter/i.test(css)
export const foreignGradients = (css: string): string[] =>
  (css.match(/linear-gradient\([^;]*/g) ?? []).filter((g) => !g.includes('var(--marker)'))
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

describe('App.css has no glass, gradients or stray literals', () => {
  const app = read('src/App.css')

  it('no backdrop-filter (also -webkit-)', () => {
    expect(hasBackdropFilter(app)).toBe(false)
    expect(hasBackdropFilter('a{-webkit-backdrop-filter:blur(4px)}')).toBe(true)
    expect(hasBackdropFilter('a{backdrop-filter:blur(4px)}')).toBe(true)
  })

  it('only the highlighter gradient remains', () => {
    expect(foreignGradients(app)).toEqual([])
    expect(foreignGradients('a{background:linear-gradient(135deg,red,blue)}')).toHaveLength(1)
    expect(foreignGradients('a{background:linear-gradient(transparent,var(--marker))}')).toEqual([])
  })

  it('no literal colours except the accepted logo/QR backgrounds (print excluded)', () => {
    // Accepted: #0a0a0a x2 (on-dark supporter logos), #fff (QR quiet zone).
    const lits = literalColours(app).map((l) => l.toLowerCase())
    expect(lits.sort()).toEqual(['#0a0a0a', '#0a0a0a', '#fff'])
    expect(literalColours('a{color:#abc;b:rgb(1,2,3)}')).toHaveLength(2)
    expect(literalColours('@media print {\n a{color:#fff}\n}\n')).toEqual([])
  })

  it('radii only use tokens, 999px, 50% or 0', () => {
    expect(strayRadii(app)).toEqual([])
    expect(strayRadii('a{border-radius: 12px;}')).toEqual(['12px'])
    expect(strayRadii('a{border-radius: var(--radius-control);}b{border-radius:999px;}c{border-radius:50%;}d{border-radius:0;}')).toEqual([])
  })
})
