import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8').replace(/\r\n/g, '\n')
const app = read('src/App.css')
const mark = read('src/components/CorrectionMark.css')

/** Body of the first rule whose selector line equals `selector`. */
const ruleBody = (css: string, selector: string): string => {
  const i = css.indexOf(`\n${selector} {`)
  expect(i, `rule ${selector}`).toBeGreaterThanOrEqual(0)
  const start = css.indexOf('{', i) + 1
  return css.slice(start, css.indexOf('}', start))
}
/** Content of the (last) @media print block, up to its closing brace at column 0. */
const printBlock = (css: string): string => {
  const i = css.lastIndexOf('@media print {')
  expect(i).toBeGreaterThanOrEqual(0)
  return css.slice(i, css.indexOf('\n}', i))
}

describe('sheet margin geometry is shared via custom properties', () => {
  it('div.sheet defines the properties and the grid uses the margin width', () => {
    const sheet = ruleBody(app, 'div.sheet')
    expect(sheet).toMatch(/--sheet-margin-w:\s*40px/)
    expect(sheet).toMatch(/--sheet-body-pad-left:\s*20px/)
    expect(sheet).toMatch(/grid-template-columns:\s*var\(--sheet-margin-w\)/)
  })
  it('mobile block overrides both properties', () => {
    const mobile = app.slice(app.indexOf('@media (max-width: 560px)'))
    expect(mobile).toMatch(/--sheet-margin-w:\s*28px/)
    expect(mobile).toMatch(/--sheet-body-pad-left:\s*12px/)
  })
  it('.sheet__body actually uses var(--sheet-body-pad-left) as left padding', () => {
    const body = ruleBody(app, '.sheet__body')
    expect(body).toMatch(/padding:[^;]*var\(--sheet-body-pad-left\)/)
  })
  it('CorrectionMark.css uses them and has no offset literals', () => {
    expect(mark).toContain('var(--sheet-margin-w)')
    expect(mark).toContain('var(--sheet-body-pad-left)')
    expect(mark).not.toMatch(/(?<![\w.-])(40|20|28|12)px/)
  })
  it('hides the mark inside the @media print block', () => {
    const print = printBlock(app)
    expect(print).toMatch(/\.correction-mark[^{]*\{[^}]*display:\s*none/)
    // negative control: the same selector outside print would not count
    expect(app.slice(0, app.lastIndexOf('@media print {'))).not.toMatch(
      /\.correction-mark[^{]*\{[^}]*display:\s*none\s*!important/,
    )
  })
})

describe('CorrectionMark.css comments', () => {
  it('the half-kind comment directly precedes the first --half rule (nothing but whitespace between)', () => {
    const m = /\/\*[^*]*tick in pencil parentheses[^*]*\*\/\s*(\.correction-mark--half)/.exec(mark)
    expect(m).not.toBeNull()
    // the match ends at the selector, so no other rule sits between comment and rule
    expect(m![0]).not.toContain('}')
    expect(mark.indexOf('.correction-mark--half')).toBe(m!.index + m![0].length - m![1].length)
  })
  it('negative control: a rule between comment and --half rule would not match', () => {
    const broken = mark.replace(/(tick in pencil parentheses[^]*?\/)\s*/, '$1\n.x { a: b }\n')
    expect(/tick in pencil parentheses[^*]*\*\/\s*\.correction-mark--half/.test(broken)).toBe(false)
  })
})

describe('flat sheet: no tinted boxes for purely visual panels', () => {
  it.each(['.area', '.result', '.exam-pool', '.curriculum-card'])('%s is ruled, not boxed', (sel) => {
    const body = ruleBody(app, sel)
    expect(body).toMatch(/border-radius:\s*0/)
    expect(body).toMatch(/border-top:\s*1px solid var\(--line\)/)
    expect(body).not.toMatch(/background:\s*color-mix/)
  })
  it('.prompt is left-aligned with a fluid size', () => {
    const p = ruleBody(app, '.prompt')
    expect(p).toMatch(/text-align:\s*left/)
    expect(p).toMatch(/font-size:\s*clamp\(/)
  })
})

describe('D5 round 2: left edges line up with the sheet content', () => {
  it('.hint is left-aligned under the left-aligned prompt', () => {
    expect(ruleBody(app, '.hint')).toMatch(/text-align:\s*left/)
  })
  it('.area__header has no horizontal padding (same left edge as the sheet content)', () => {
    expect(ruleBody(app, '.area__header')).toMatch(/padding:\s*\d+px 0;/)
  })
})
