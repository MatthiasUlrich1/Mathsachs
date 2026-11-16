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

  it('has dropped the deprecated aliases (components use the real tokens)', () => {
    for (const alias of ['text', 'accent', 'accent-2', 'good', 'bad', 'muted', 'bg-0', 'bg-1'])
      expect(css).not.toMatch(new RegExp(`--${alias}:`))
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

/* ---- D3: semantic SVG tokens, component pairs, Heft scope ---- */

const SVG_TOKENS = ['svg-line', 'svg-fill-a', 'svg-fill-b', 'svg-highlight'] as const

describe('semantic SVG tokens', () => {
  const themes = { Heft: heft, Tafel: tafel }
  it.each(SVG_TOKENS)('--%s is defined in Heft and both Tafel blocks, identical in the Tafel pair', (t) => {
    expect(() => valueOf(heft, t)).not.toThrow()
    expect(valueOf(tafelAuto, t)).toBe(valueOf(tafel, t))
  })
  for (const [name, body] of Object.entries(themes)) {
    const c = (t: string) => valueOf(body, t)
    for (const base of ['paper', 'surface']) {
      it.each(SVG_TOKENS)(`${name}: --%s on --${base} >= 3:1 (non-text)`, (t) => {
        expect(contrastRatio(c(t), c(base))).toBeGreaterThanOrEqual(3)
      })
    }
    it.each(['svg-fill-a', 'svg-fill-b'])(`${name}: --on-marker text on --%s >= 4.5`, (t) => {
      expect(contrastRatio(c('on-marker'), c(t))).toBeGreaterThanOrEqual(4.5)
    })
    it(`${name}: --svg-fill-a and --svg-fill-b are clearly different colours`, () => {
      const [a, b] = [c('svg-fill-a'), c('svg-fill-b')].map(toRgb)
      const dist = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
      expect(dist).toBeGreaterThanOrEqual(60)
    })
  }
  it('negative control: a pale tint would fail the 3:1 rule', () => {
    expect(contrastRatio('#d2d9ee', valueOf(heft, 'surface'))).toBeLessThan(3)
  })
  it('print block and .heft-scope carry the Heft values of every SVG token', () => {
    const scope = block(/^:where\(\.heft-scope\)\s*\{/m)
    const i = css.indexOf('@media print')
    const printCss = css.slice(i)
    for (const t of [...SVG_TOKENS, ...TOKENS, 'on-marker']) {
      const re = new RegExp(`--${t}:\\s*(#[0-9a-fA-F]{6})\\s*;`)
      expect(re.exec(scope)?.[1].toLowerCase(), `scope --${t}`).toBe(re.exec(heft)![1].toLowerCase())
      expect(re.exec(printCss)?.[1].toLowerCase(), `print --${t}`).toBe(re.exec(heft)![1].toLowerCase())
    }
  })
})

describe('component pairs (mixed over paper and surface)', () => {
  const themes = { Heft: heft, Tafel: tafel }
  for (const [name, body] of Object.entries(themes)) {
    const c = (t: string) => valueOf(body, t)
    for (const base of ['paper', 'surface']) {
      it(`${name}: --graphite on instrument body (--ink 25%) over --${base}`, () => {
        expect(contrastRatio(c('graphite'), mixHex(c('ink'), 0.25, c(base)))).toBeGreaterThanOrEqual(4.5)
      })
      it(`${name}: --graphite on selected/hover chips (--ink 14%) over --${base}`, () => {
        expect(contrastRatio(c('graphite'), mixHex(c('ink'), 0.14, c(base)))).toBeGreaterThanOrEqual(4.5)
      })
      it(`${name}: --ink input text on its 10% tint over --${base} (DigitGrid)`, () => {
        expect(contrastRatio(c('ink'), mixHex(c('ink'), 0.1, c(base)))).toBeGreaterThanOrEqual(4.5)
      })
      for (const x of ['tick', 'correction']) {
        it(`${name}: --${x} 55% with graphite (check/cross mark) on 14% tint over --${base} (PairMatch)`, () => {
          const mark = mixHex(c(x), 0.55, c('graphite'))
          expect(contrastRatio(mark, mixHex(c(x), 0.14, c(base)))).toBeGreaterThanOrEqual(4.5)
        })
      }
      it(`${name}: --graphite on ${base} with surface halo`, () => {
        expect(contrastRatio(c('graphite'), c('surface'))).toBeGreaterThanOrEqual(4.5)
      })
    }
  }
})

/* ---- D3 fix round 1: six-shade series, --on-fill, every text/fill pair ---- */

import { minPairwiseDeltaE, deltaE76 } from './contrast'
import { SVG_SERIES } from './svgTokens'

const tokenOfVar = (v: string): string => v.slice(4, -1)
const readRule = (file: string, selector: string): string => {
  const src = readFileSync(new URL(`../components/${file}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n')
  const at = src.indexOf(`${selector} {`)
  if (at < 0) throw new Error(`rule not found: ${selector}`)
  return src.slice(at, src.indexOf('}', at))
}

describe('SVG_SERIES: six clearly different shades per theme', () => {
  const themes = { Heft: heft, Tafel: tafel }
  for (const [name, body] of Object.entries(themes)) {
    const series = SVG_SERIES.map((v) => valueOf(body, tokenOfVar(v).slice(2)))
    it(`${name}: six distinct entries, pairwise CIE76 dE >= 15`, () => {
      expect(series).toHaveLength(6)
      expect(new Set(series).size).toBe(6)
      expect(minPairwiseDeltaE(series)).toBeGreaterThanOrEqual(15)
    })
    it(`${name}: no series shade is (nearly) the unfilled --surface`, () => {
      for (const c of series) expect(deltaE76(c, valueOf(body, 'surface'))).toBeGreaterThanOrEqual(10)
    })
    it(`${name}: --on-fill text >= 4.5 on every series shade`, () => {
      for (const c of series) expect(contrastRatio(valueOf(body, 'on-fill'), c)).toBeGreaterThanOrEqual(4.5)
    })
  }
  it('negative control: the old mixes (a 55% b, b 55% a) were not distinguishable', () => {
    for (const body of [heft, tafel]) {
      const a = valueOf(body, 'svg-fill-a')
      const b = valueOf(body, 'svg-fill-b')
      expect(deltaE76(mixHex(a, 0.55, b), mixHex(b, 0.55, a))).toBeLessThan(15)
    }
  })
})

describe('every text drawn on a fill uses --on-fill (and passes 4.5 on all fills it can meet)', () => {
  const PAIRS: Array<[string, string]> = [
    ['PieChart.css', '.pie-chart__label'],
    ['RatioBar.css', '.ratio-bar__letter'],
    ['DivideTool.css', '.divide-tool__owner,\n.divide-tool__name,\n.divide-tool__count'],
  ]
  it.each(PAIRS)('%s %s sets fill: var(--on-fill)', (file, selector) => {
    const rule = readRule(file, selector)
    expect(rule).toContain('fill: var(--on-fill)')
    expect(rule).not.toContain('paint-order')
  })
  const fills = ['svg-fill-a', 'svg-fill-b', 'svg-fill-c', 'svg-fill-d', 'svg-fill-e', 'svg-fill-f']
  for (const [name, body] of Object.entries({ Heft: heft, Tafel: tafel })) {
    it.each(fills)(`${name}: --on-fill on --%s >= 4.5`, (f) => {
      expect(contrastRatio(valueOf(body, 'on-fill'), valueOf(body, f))).toBeGreaterThanOrEqual(4.5)
    })
  }
  it('the old halo approach would have failed: --graphite on fill-a in Tafel < 4.5', () => {
    expect(contrastRatio(valueOf(tafel, 'graphite'), valueOf(tafel, 'svg-fill-a'))).toBeLessThan(4.5)
  })
  it('print block also carries --on-fill and the series tokens', () => {
    const printCss = css.slice(css.indexOf('@media print'))
    for (const t of ['on-fill', 'svg-fill-c', 'svg-fill-d', 'svg-fill-e', 'svg-fill-f'])
      expect(printCss).toContain(`--${t}: ${valueOf(heft, t)};`)
  })
})

describe("D5: .chip-btn--info:hover is a solid ink pill with paper text", () => {
  const app = readFileSync(new URL("../App.css", import.meta.url), "utf8").replace(/\r\n/g, "\n")
  const rule = app.slice(app.indexOf(".chip-btn--info:hover {"), app.indexOf("}", app.indexOf(".chip-btn--info:hover {")))
  it("sets background var(--ink) and color var(--paper)", () => {
    expect(rule).toMatch(/background:\s*var\(--ink\)/)
    expect(rule).toMatch(/color:\s*var\(--paper\)/)
  })
  it.each([["Heft", heft], ["Tafel", tafel], ["Tafel auto", tafelAuto]] as const)("%s: paper on ink >= 4.5", (_n, body) => {
    expect(contrastRatio(valueOf(body, "paper"), valueOf(body, "ink"))).toBeGreaterThanOrEqual(4.5)
  })
  it("negative control: paper text on a faint 10 % ink tint is unreadable (the old hover)", () => {
    for (const body of [heft, tafel]) {
      const faint = mixHex(valueOf(body, "ink"), 0.1, valueOf(body, "paper"))
      expect(contrastRatio(valueOf(body, "paper"), faint)).toBeLessThan(1.5)
    }
  })
})
