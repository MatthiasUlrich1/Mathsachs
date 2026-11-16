import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ClozeMulti } from './ClozeMulti'
import { ImageLabelSlots } from './ImageLabelSlots'
import { DivideToolBoard } from './DivideTool'
import { SymmetryDraw } from './SymmetryDraw'
import { pcSectorTags, pcExtentFits, pcTextExtents } from '../lib/pieChartLogic'

/* Right/wrong and ownership must not depend on colour alone: text for screen readers / marks. */

const cloze = (partResults?: boolean[]) =>
  renderToStaticMarkup(
    createElement(ClozeMulti, {
      segments: ['Ein ', ' und ein ', '.'],
      blanks: ['a', 'b'],
      onChange: () => {},
      partResults,
    }),
  )

describe('ClozeMulti result marks', () => {
  it('shows a visible mark and a visually hidden "richtig" / "falsch" per blank', () => {
    const html = cloze([true, false])
    expect(html).toContain('cloze-multi__mark--ok')
    expect(html).toContain('cloze-multi__mark--bad')
    expect(html).toContain('>✓<')
    expect(html).toContain('>✗<')
    expect(html).toContain('<span class="visually-hidden">Lücke 1: richtig</span>')
    expect(html).toContain('<span class="visually-hidden">Lücke 2: falsch</span>')
  })
  it('adds nothing before the check', () => {
    const html = cloze(undefined)
    expect(html).not.toContain('visually-hidden')
    expect(html).not.toContain('cloze-multi__mark')
  })
  it('only the evaluated blanks get a hidden result', () => {
    const html = cloze([true])
    expect(html).toContain('Lücke 1: richtig')
    expect(html).not.toContain('Lücke 2: ')
  })
})

describe('ImageLabelSlots accessible result', () => {
  const slots = [
    { id: 's1', x: 20, y: 20, targetX: 10, targetY: 10 },
    { id: 's2', x: 60, y: 60, targetX: 50, targetY: 50 },
    { id: 's3', x: 80, y: 20, targetX: 70, targetY: 10 },
  ]
  const html = renderToStaticMarkup(
    createElement(ImageLabelSlots, {
      imageSrc: 'x.png',
      attribution: 'test',
      items: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
      slots,
      value: [0, 1, 2],
      onChange: () => {},
      partResults: [true, false],
    }),
  )
  it('puts the result into the accessible name of the slot', () => {
    expect(html).toContain('aria-label="Beschriftungsfeld 1: richtig"')
    expect(html).toContain('aria-label="Beschriftungsfeld 2: falsch"')
  })
  it('keeps the plain name where there is no result', () => {
    expect(html).toContain('aria-label="Beschriftungsfeld 3"')
  })
  it('keeps the result class that draws the check / cross badge', () => {
    expect(html).toContain('image-label-slots__slot--ok')
    expect(html).toContain('image-label-slots__slot--bad')
  })
})

describe('DivideTool ownership by number', () => {
  const board = (assignment: Array<number | null>) =>
    renderToStaticMarkup(
      DivideToolBoard({
        shape: 'circle',
        count: 3,
        persons: 3,
        value: { kind: 'divideTool', partsPerWhole: 1, assignment },
        onChange: () => {},
        selected: null,
        onSelect: () => {},
      }),
    )
  it('prints the owner number on every part that is owned, so ownership is not only a fill', () => {
    const html = board([0, 1, 2])
    const owners = [...html.matchAll(/class="divide-tool__owner"[^>]*>(\d)</g)].map((m) => m[1])
    expect(owners).toEqual(['1', '2', '3'])
  })
  it('prints no number on unowned parts', () => {
    expect(board([null, null, null])).not.toContain('divide-tool__owner')
  })
})

describe('SymmetryDraw given cells are hatched, not only coloured', () => {
  const html = renderToStaticMarkup(
    createElement(SymmetryDraw, {
      cols: 8,
      rows: 6,
      given: ['3,1', '2,2'],
      axis: { kind: 'vertical', at: 4 },
      value: { kind: 'symmetryDraw', cells: [] } as never,
      onChange: () => {},
    }),
  )
  it('defines a hatch pattern and uses it for given cells only', () => {
    expect(html).toContain('<pattern id="sym-given-hatch"')
    expect(html.match(/fill="url\(#sym-given-hatch\)"/g)).toHaveLength(2)
  })
})

describe('PieChart category tags', () => {
  it('uses the shortest unique prefix, at most three characters', () => {
    expect(pcSectorTags(['Obst', 'Brötchen', 'Riegel', 'Nichts'])).toEqual(['O', 'B', 'R', 'N'])
    expect(pcSectorTags(['Obst', 'Ohne', 'Orange'])).toEqual(['Ob', 'Oh', 'Or'])
    expect(pcSectorTags(['Sport', 'Sportplatz'])).toEqual(['S1', 'S2'])
  })
  it('falls back to initial + number when no short prefix is unique', () => {
    expect(pcSectorTags(['Sportplatz', 'Sportplatz'])).toEqual(['S1', 'S2'])
  })
  it('every tag position (tags sit outside the circle at any angle) stays inside the viewBox', () => {
    const names = ['Obst', 'Ohne', 'Orange', 'Sportplatz', 'Nichts']
    for (const e of pcTextExtents(names)) expect(pcExtentFits(e), e.text).toBe(true)
  })
})
