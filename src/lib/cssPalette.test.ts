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
  'rgba(99, 102, 241',
  'rgba(34, 211, 238',
]

describe('old palette is gone from CSS', () => {
  for (const file of CSS_FILES) {
    it(`${file} contains no old palette colours`, () => {
      const css = readFileSync(join(process.cwd(), file), 'utf8').toLowerCase()
      const found = OLD_PALETTE.filter((c) => css.includes(c.toLowerCase()))
      expect(found).toEqual([])
    })
  }

  it('App.css has no glass effect and only the highlighter gradient', () => {
    const css = readFileSync(join(process.cwd(), 'src/App.css'), 'utf8')
    expect(css).not.toContain('backdrop-filter')
    const gradients = css.match(/linear-gradient\([^;]*/g) ?? []
    expect(gradients.every((g) => g.includes('var(--marker)'))).toBe(true)
  })
})
