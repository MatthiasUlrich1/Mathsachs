import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { contrastRatio } from './contrast'

const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8')

/** Returns the declaration body of the first rule whose selector line matches. */
const block = (selector: RegExp): string => {
  const m = selector.exec(css)
  if (!m) throw new Error(`block not found: ${selector}`)
  const open = css.indexOf('{', m.index)
  let depth = 0
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++
    else if (css[i] === '}' && --depth === 0) return css.slice(open + 1, i)
  }
  throw new Error('unbalanced css')
}

const heft = block(/^:root\s*\{/m)
const tafel = block(/^:root\[data-theme='tafel'\]\s*\{/m)
const tafelAuto = block(/:root:not\(\[data-theme='heft'\]\)\s*\{/m)

const TOKENS = [
  'paper', 'surface', 'grid', 'line', 'ink', 'graphite',
  'pencil', 'correction', 'tick', 'marker',
] as const

const valueOf = (body: string, token: string): string => {
  const m = new RegExp(`--${token}:\\s*(#[0-9a-fA-F]{6})\\s*;`).exec(body)
  if (!m) throw new Error(`--${token} not defined as hex`)
  return m[1]
}

describe('design tokens', () => {
  it.each(TOKENS)('--%s is defined in Heft and both Tafel blocks', (t) => {
    expect(() => valueOf(heft, t)).not.toThrow()
    expect(() => valueOf(tafel, t)).not.toThrow()
    expect(() => valueOf(tafelAuto, t)).not.toThrow()
  })

  it('--focus is defined (= --ink)', () => {
    expect(heft).toMatch(/--focus:\s*var\(--ink\)/)
  })

  it('Tafel via toggle and via media query are identical', () => {
    for (const t of TOKENS) expect(valueOf(tafelAuto, t)).toBe(valueOf(tafel, t))
  })

  it('sets color-scheme per theme', () => {
    expect(heft).toMatch(/color-scheme:\s*light/)
    expect(tafel).toMatch(/color-scheme:\s*dark/)
    expect(tafelAuto).toMatch(/color-scheme:\s*dark/)
  })

  it('keeps deprecated aliases mapped to the new tokens', () => {
    expect(heft).toMatch(/--text:\s*var\(--graphite\)/)
    expect(heft).toMatch(/--accent:\s*var\(--ink\)/)
    expect(heft).toMatch(/--good:\s*var\(--tick\)/)
    expect(heft).toMatch(/--bad:\s*var\(--correction\)/)
    expect(heft).toMatch(/--muted:\s*var\(--pencil\)/)
  })

  it('has no leftovers of the old palette', () => {
    for (const old of ['#0f172a', '#1e293b', '#6366f1', '#22d3ee', 'radial-gradient'])
      expect(css.toLowerCase()).not.toContain(old)
  })
})

describe('WCAG contrast >= 4.5 (text pairs)', () => {
  const themes = { Heft: heft, Tafel: tafel }
  for (const [name, body] of Object.entries(themes)) {
    const c = (t: string) => valueOf(body, t)
    const textTokens = ['graphite', 'pencil', 'ink', 'correction', 'tick']
    for (const bg of ['paper', 'surface']) {
      it.each(textTokens)(`${name}: --%s on --${bg}`, (fg) => {
        expect(contrastRatio(c(fg), c(bg))).toBeGreaterThanOrEqual(4.5)
      })
    }
    it.each(['pencil', 'ink'])(`${name}: --%s on --grid`, (fg) => {
      expect(contrastRatio(c(fg), c('grid'))).toBeGreaterThanOrEqual(4.5)
    })
    it(`${name}: --paper on --ink (primary button)`, () => {
      expect(contrastRatio(c('paper'), c('ink'))).toBeGreaterThanOrEqual(4.5)
    })
    it(`${name}: text on --marker (highlighter)`, () => {
      // Heft: dark graphite text; Tafel: board-coloured --paper text.
      const fg = name === 'Heft' ? c('graphite') : c('paper')
      expect(contrastRatio(fg, c('marker'))).toBeGreaterThanOrEqual(4.5)
    })
  }
})
