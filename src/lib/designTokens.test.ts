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

/** Removes balanced :where(...) groups (they contribute no specificity). */
const stripWhere = (sel: string): string => {
  let out = ''
  for (let i = 0; i < sel.length; ) {
    if (sel.startsWith(':where(', i)) {
      let depth = 0
      let j = i + ':where'.length
      for (; j < sel.length; j++) {
        if (sel[j] === '(') depth++
        else if (sel[j] === ')' && --depth === 0) break
      }
      i = j + 1
    } else out += sel[i++]
  }
  return out
}

const splitTopLevel = (list: string): string[] => {
  const parts: string[] = []
  let depth = 0
  let cur = ''
  for (const ch of list) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === ',' && depth === 0) {
      parts.push(cur.trim())
      cur = ''
    } else cur += ch
  }
  parts.push(cur.trim())
  return parts
}

describe('CSS cascade order and specificity', () => {
  it('main.tsx imports index.css before App', () => {
    const main = readFileSync(new URL('../main.tsx', import.meta.url), 'utf8')
    const iCss = main.indexOf("import './index.css'")
    const iApp = main.indexOf('import App from')
    expect(iCss).toBeGreaterThan(-1)
    expect(iApp).toBeGreaterThan(iCss)
  })

  it('every base selector outside the token blocks has specificity 0', () => {
    const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '')
    const preludes = [...stripped.matchAll(/([^{}]+)\{/g)].map((m) => m[1].trim())
    const tokenBlocks = [
      ':root[data-theme]',
      ':root',
      ":root[data-theme='tafel']",
      ":root:not([data-theme='heft'])",
    ]
    const offenders: string[] = []
    for (const prelude of preludes) {
      if (prelude.startsWith('@')) continue
      for (const sel of splitTopLevel(prelude)) {
        if (tokenBlocks.includes(sel) || sel === 'body' || sel === '*') continue
        // Only pseudo-elements (::x), universal and whitespace may remain once :where() is removed.
        const rest = stripWhere(sel).replace(/::[a-z-]+/g, '').replace(/[\s*]/g, '')
        if (rest !== '') offenders.push(sel)
      }
    }
    expect(offenders).toEqual([])
  })
})

/* ---- D2 fix round: --on-marker, tinted badges, print = Heft ---- */

const toRgb = (h: string): number[] => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
/** sRGB color-mix(a pa%, b) as hex (what the browser computes for opaque b). */
const mixHex = (a: string, pa: number, b: string): string =>
  '#' +
  toRgb(a)
    .map((v, i) => Math.round(v * pa + toRgb(b)[i] * (1 - pa)))
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')

describe('--on-marker and tinted badges', () => {
  const themes = { Heft: heft, Tafel: tafel }
  for (const [name, body] of Object.entries(themes)) {
    const c = (t: string) => valueOf(body, t)
    it(`${name}: --on-marker on solid --marker >= 4.5`, () => {
      expect(contrastRatio(c('on-marker'), c('marker'))).toBeGreaterThanOrEqual(4.5)
    })
    for (const x of ['tick', 'correction', 'ink']) {
      for (const base of ['paper', 'surface']) {
        it(`${name}: --${x} mixed 55% with graphite on its 10% tint over --${base}`, () => {
          const text = mixHex(c(x), 0.55, c('graphite'))
          const bg = mixHex(c(x), 0.1, c(base))
          expect(contrastRatio(text, bg)).toBeGreaterThanOrEqual(4.5)
        })
      }
    }
    for (const base of ['paper', 'surface']) {
      it(`${name}: --graphite on 20% --marker tint over --${base}`, () => {
        expect(
          contrastRatio(c('graphite'), mixHex(c('marker'), 0.2, c(base))),
        ).toBeGreaterThanOrEqual(4.5)
      })
    }
  }
  it('mix helper negative control: raw --tick on its 20% tint fails in Heft', () => {
    const t = valueOf(heft, 'tick')
    expect(contrastRatio(t, mixHex(t, 0.2, valueOf(heft, 'paper')))).toBeLessThan(4.5)
  })
  it('--scrim is defined in all theme blocks', () => {
    for (const b of [heft, tafel, tafelAuto]) expect(b).toMatch(/--scrim:/)
  })
})

describe('print is always Heft', () => {
  const printCss = (() => {
    const i = css.indexOf('@media print')
    if (i < 0) throw new Error('no @media print in index.css')
    const open = css.indexOf('{', i)
    let depth = 0
    for (let j = open; j < css.length; j++) {
      if (css[j] === '{') depth++
      else if (css[j] === '}' && --depth === 0) return css.slice(open + 1, j)
    }
    throw new Error('unbalanced')
  })()

  it('overrides :root and :root[data-theme]', () => {
    expect(printCss).toMatch(/:root,\s*:root\[data-theme\]\s*\{/)
  })
  it.each([...TOKENS, 'on-marker'])('--%s equals its Heft value in print', (t) => {
    const re = new RegExp(`--${t}:\\s*(#[0-9a-fA-F]{6})\\s*;`)
    const printed = re.exec(printCss)?.[1]
    expect(printed).toBeDefined()
    expect(printed!.toLowerCase()).toBe(re.exec(heft)![1].toLowerCase())
  })
  it('forces color-scheme light in print', () => {
    expect(printCss).toMatch(/color-scheme:\s*light/)
  })
  it('print block comes after the Tafel blocks (cascade order)', () => {
    expect(css.indexOf('@media print')).toBeGreaterThan(css.lastIndexOf("--marker: #f6e27a"))
  })
})
