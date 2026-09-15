import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { DigitGrid } from './DigitGrid'

describe('DigitGrid', () => {
  it('renders operand rows and answer inputs', () => {
    const html = renderToStaticMarkup(
      createElement(DigitGrid, {
        rows: [
          { digits: ['', '1', '2', '3'] },
          { prefix: '+', digits: ['', '4', '5', '6'] },
          { editable: true, digits: ['', '', '', ''] },
        ],
        digits: ['', '', '', ''],
        onChange: () => {},
        instruction: 'Trage das Ergebnis ziffernweise ein:',
      }),
    )
    expect(html).toContain('Schriftliches Rechnen')
    expect(html).toContain('Trage das Ergebnis')
    expect(html).toContain('1')
    expect(html).toContain('+')
    expect(html).toContain('input')
  })

  it('shows existing answer digits', () => {
    const html = renderToStaticMarkup(
      createElement(DigitGrid, {
        rows: [{ editable: true, digits: ['', '', ''] }],
        digits: ['5', '7', '9'],
        onChange: () => {},
      }),
    )
    expect(html).toContain('value="5"')
    expect(html).toContain('value="7"')
    expect(html).toContain('value="9"')
  })

  it('renders multi-row multiplication with labels and cell tones', () => {
    const html = renderToStaticMarkup(
      createElement(DigitGrid, {
        rows: [
          {
            digits: ['2', '3', '·', '3', '6'],
            cellTones: ['green', 'green', 'default', 'blue', 'blue'],
          },
          { rule: true, digits: ['', '', ''] },
          { editable: true, digits: ['', '', '', '', ''], label: '= 23 · 30' },
          { editable: true, digits: ['', '', '', '', ''], label: '= 23 · 6' },
          { rule: true, digits: ['', '', ''] },
          { editable: true, digits: ['', '', '', '', ''], tone: 'red' },
        ],
        digits: [],
        answerRows: [
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
        ],
        onChange: () => {},
        onChangeRows: () => {},
      }),
    )
    expect(html).toContain('digit-grid__cell--green')
    expect(html).toContain('digit-grid__cell--blue')
    expect(html).toContain('= 23 · 30')
    expect(html).toContain('digit-grid__rule')
    expect(html.match(/data-edit-row="/g)?.length).toBe(15) // 3 rows × 5 cells
  })
})
