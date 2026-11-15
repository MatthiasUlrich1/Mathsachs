import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { AnswerInput } from './AnswerInput'

describe('AnswerInput', () => {
  it('renders fraction fields for Zähler and Nenner', () => {
    const html = renderToStaticMarkup(
      createElement(AnswerInput, {
        answerKind: 'fraction',
        value: { kind: 'fraction', num: '3', den: '4' },
        onChange: () => {},
        onSubmit: () => {},
        focusKey: 't1',
      }),
    )
    expect(html).toContain('aria-label="Zähler"')
    expect(html).toContain('aria-label="Nenner"')
    expect(html).toContain('value="3"')
    expect(html).toContain('value="4"')
  })

  it('accepts focusKey so parents can re-focus per task without tying to value', () => {
    // Contract: focusKey is a supported prop (used by PracticeSession / ExamRunner).
    // Autofocus must NOT depend on `value` — that caused Nenner→Zähler jumps.
    expect(
      createElement(AnswerInput, {
        answerKind: 'fraction',
        value: { kind: 'fraction', num: '', den: '5' },
        onChange: () => {},
        onSubmit: () => {},
        focusKey: 'seed-9',
      }),
    ).toBeTruthy()
  })
})
