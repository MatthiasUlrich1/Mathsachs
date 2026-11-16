import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { CorrectionMark } from './CorrectionMark'
import { markStateForPhase } from '../lib/correctionMarkState'

const css = readFileSync(
  join(process.cwd(), 'src/components/CorrectionMark.css'),
  'utf8',
)

describe('markStateForPhase', () => {
  it('maps check results to a mark', () => {
    expect(markStateForPhase('correct')).toEqual({ kind: 'tick', label: 'Richtig' })
    expect(markStateForPhase('wrong')).toEqual({
      kind: 'cross',
      label: 'Leider falsch',
    })
    expect(markStateForPhase('partial')?.kind).toBe('cross')
  })
  it('shows nothing while answering', () => {
    expect(markStateForPhase('answering')).toBeNull()
  })
})

describe('CorrectionMark', () => {
  it('renders a tick with accessible text', () => {
    const html = renderToStaticMarkup(
      createElement(CorrectionMark, { kind: 'tick', label: 'Richtig' }),
    )
    expect(html).toContain('correction-mark--tick')
    expect(html).toContain('role="img"')
    expect(html).toContain('aria-label="Richtig"')
    expect(html).toContain('<path')
  })
  it('renders a cross with accessible text', () => {
    const html = renderToStaticMarkup(
      createElement(CorrectionMark, { kind: 'cross', label: 'Leider falsch' }),
    )
    expect(html).toContain('correction-mark--cross')
    expect(html).toContain('aria-label="Leider falsch"')
  })
  it('is decorative (not announced) when announce=false', () => {
    const html = renderToStaticMarkup(
      createElement(CorrectionMark, {
        kind: 'tick',
        label: 'Richtig',
        announce: false,
      }),
    )
    expect(html).toContain('aria-hidden="true"')
    expect(html).not.toContain('aria-label')
    expect(html).not.toContain('role=')
  })
})

describe('CorrectionMark.css', () => {
  it('draws with stroke-dashoffset in 250ms using tokens', () => {
    expect(css).toMatch(/stroke-dashoffset/)
    expect(css).toMatch(/animation:\s*correction-draw 250ms/)
    expect(css).toContain('var(--tick)')
    expect(css).toContain('var(--correction)')
  })
  it('disables the animation under prefers-reduced-motion', () => {
    const m = /@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*?animation:\s*none/.exec(css)
    expect(m).not.toBeNull()
  })
})
