import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { CheckAnnouncement, CorrectionMark } from './CorrectionMark'
import { announcementForPhase, markStateForPhase } from '../lib/correctionMarkState'

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
    expect(markStateForPhase('partial')).toEqual({
      kind: 'half',
      label: 'Teilweise richtig',
    })
  })
  it('shows nothing while answering', () => {
    expect(markStateForPhase('answering')).toBeNull()
  })
})

describe('announcementForPhase + CheckAnnouncement', () => {
  it('is empty while answering and texts the result afterwards', () => {
    expect(announcementForPhase('answering', 5, true)).toBe('')
    expect(announcementForPhase('correct', 5, true)).toBe('Richtig! Plus 5 Punkte.')
    expect(announcementForPhase('correct', 5, false)).toBe('Richtig!')
    expect(announcementForPhase('partial', 0, true)).toBe('Teilweise richtig.')
    expect(announcementForPhase('wrong', 0, true)).toBe('Leider falsch.')
  })
  it('partial announces how many parts were right', () => {
    expect(announcementForPhase('partial', 0, true, [true, false, true])).toBe('Teilweise richtig (2 von 3).')
    expect(announcementForPhase('partial', 2, true, [true, false])).toBe('Teilweise richtig (1 von 2). Plus 2 Punkte.')
    expect(announcementForPhase('partial', 0, true, [])).toBe('Teilweise richtig.')
  })
  it('live region exists in the answering phase and holds the text after checking', () => {
    const before = renderToStaticMarkup(createElement(CheckAnnouncement, { text: '' }))
    expect(before).toContain('role="status"')
    expect(before).toContain('aria-live="polite"')
    const after = renderToStaticMarkup(
      createElement(CheckAnnouncement, {
        text: announcementForPhase('wrong', 0, true),
      }),
    )
    expect(after).toContain('role="status"')
    expect(after).toContain('Leider falsch.')
  })
})

describe('CorrectionMark', () => {
  it('renders half as tick in parentheses', () => {
    const html = renderToStaticMarkup(
      createElement(CorrectionMark, { kind: 'half', label: 'Teilweise richtig' }),
    )
    expect(html).toContain('correction-mark--half')
    expect(html).toContain('correction-mark__parens')
    expect(html).toContain('correction-mark__tick')
  })
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
