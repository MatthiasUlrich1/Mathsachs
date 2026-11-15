import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { DigitGrid } from './DigitGrid'

describe('DigitGrid', () => {
  it('documents RTL written-calc entry (rightmost cell is ones place)', () => {
    // Cells are indexed left→right; entry advances to lower index after a digit.
    // See DigitGrid onChange: focusCell(eIdx, i - 1) when digit entered.
    const width = 4
    const onesIndex = width - 1
    expect(onesIndex).toBe(3)
    // After typing at ones (3), next focus is tens (2), then hundreds (1), then thousands (0).
    const advance = (i: number) => (i > 0 ? i - 1 : i)
    expect(advance(3)).toBe(2)
    expect(advance(2)).toBe(1)
    expect(advance(0)).toBe(0)
  })

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
