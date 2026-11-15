import { createElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { UserInput } from '../curriculum/types'
import { SymmetryDraw, type SymmetryDrawProps } from './SymmetryDraw'

type Value = Extract<UserInput, { kind: 'symmetryDraw' }>
const blank: Value = { kind: 'symmetryDraw', cells: [] }

type El = ReactElement<Record<string, unknown>>
const collect = (node: ReactNode, out: El[] = []): El[] => {
  if (Array.isArray(node)) node.forEach((n) => collect(n, out))
  else if (isValidElement(node)) {
    const el = node as El
    out.push(el)
    collect(el.props.children as ReactNode, out)
  }
  return out
}

const base: SymmetryDrawProps = {
  cols: 8,
  rows: 6,
  given: ['3,1', '2,2', '3,2'],
  axis: { kind: 'vertical', at: 4 },
  value: blank,
  onChange: () => {},
}
// SymmetryDraw has no hooks, so calling it yields the element tree and the handlers can be invoked directly.
const tree = (over: Partial<SymmetryDrawProps>) => collect(SymmetryDraw({ ...base, ...over }))
const cellEl = (els: El[], key: string) => els.find((e) => e.props['data-cell'] === key)!

describe('SymmetryDraw', () => {
  it('renders a group svg with the grid, the given cells and a dashed axis, no learner cell at the start', () => {
    const html = renderToStaticMarkup(createElement(SymmetryDraw, { ...base, instruction: 'Färbe.' }))
    expect(html).toContain('role="group"')
    expect(html).not.toContain('role="img"')
    expect(html).toMatch(/viewBox="0 0 268 208"/)
    expect(html.match(/data-testid="sym-cell"/g)).toHaveLength(48)
    expect(html.match(/data-state="given"/g)).toHaveLength(3)
    expect(html.match(/data-state="on"/g)).toBeNull()
    expect(html).toContain('stroke-dasharray')
    expect(html).not.toContain('sym-centre')
    expect(html).toContain('Färbe.')
  })

  it('point symmetry shows a centre dot and no axis', () => {
    const html = renderToStaticMarkup(
      createElement(SymmetryDraw, { ...base, cols: 8, rows: 8, given: ['1,1'], axis: undefined, point: { x: 4, y: 4 } }),
    )
    expect(html).toContain('sym-centre')
    expect(html).not.toContain('sym-axis')
    expect(html).toContain('Symmetriepunkt')
  })

  it('tap-only: click handlers on the free cells, no pointer handlers, no touch-action none', () => {
    const els = tree({})
    for (const e of els.filter((x) => x.props['data-testid'] === 'sym-cell')) {
      expect(e.props.onPointerDown).toBeUndefined()
    }
    expect(typeof cellEl(els, '5,2').props.onClick).toBe('function')
    expect(cellEl(els, '5,2').props.role).toBe('button')
    expect(renderToStaticMarkup(createElement(SymmetryDraw, base))).not.toContain('touch-action: none')
  })

  it('given cells and cells on the figure side are not buttons and not tappable', () => {
    const els = tree({})
    for (const key of ['3,1', '0,0', '2,5']) {
      expect(cellEl(els, key).props.onClick).toBeUndefined()
      expect(cellEl(els, key).props.role).toBeUndefined()
    }
    expect(cellEl(els, '3,1').props['aria-label']).toContain('vorgegeben')
    expect(cellEl(els, '3,1').props['data-state']).toBe('given')
  })

  it('a tap toggles the cell, keeps the others and reports a sorted list', () => {
    const calls: UserInput[] = []
    const onChange = (v: UserInput) => calls.push(v)
    ;(cellEl(tree({ onChange }), '5,2').props.onClick as () => void)()
    expect(calls[0]).toEqual({ kind: 'symmetryDraw', cells: ['5,2'] })
    const withOne: Value = { kind: 'symmetryDraw', cells: ['5,2'] }
    ;(cellEl(tree({ onChange, value: withOne }), '4,1').props.onClick as () => void)()
    expect(calls[1]).toEqual({ kind: 'symmetryDraw', cells: ['4,1', '5,2'] })
    ;(cellEl(tree({ onChange, value: withOne }), '5,2').props.onClick as () => void)()
    expect(calls[2]).toEqual({ kind: 'symmetryDraw', cells: [] })
  })

  it('disabled: taps do nothing, cells are not focusable', () => {
    const calls: UserInput[] = []
    const els = tree({ onChange: (v) => calls.push(v), disabled: true })
    ;(cellEl(els, '5,2').props.onClick as () => void)()
    expect(calls).toHaveLength(0)
    expect(cellEl(els, '5,2').props.tabIndex).toBeUndefined()
    expect(cellEl(els, '5,2').props['aria-disabled']).toBe(true)
  })

  it('keyboard: Enter and Space toggle a cell, other keys do not', () => {
    const calls: UserInput[] = []
    const key = cellEl(tree({ onChange: (v) => calls.push(v) }), '5,2').props.onKeyDown as (e: { key: string; preventDefault: () => void }) => void
    key({ key: 'Enter', preventDefault: () => {} })
    key({ key: ' ', preventDefault: () => {} })
    key({ key: 'a', preventDefault: () => {} })
    expect(calls).toHaveLength(2)
  })

  it('malformed props render an empty inert grid instead of crashing', () => {
    const bad: Array<Partial<SymmetryDrawProps>> = [
      { given: undefined as never },
      { given: null as never },
      { given: [] },
      { given: [5, 'x', null] as never },
      { given: ['99,99'] },
      { cols: Number.NaN },
      { rows: 99 },
      { axis: { kind: 'vertical' } },
      { axis: undefined, point: undefined },
    ]
    for (const over of bad) {
      expect(() => renderToStaticMarkup(createElement(SymmetryDraw, { ...base, ...over })), JSON.stringify(over)).not.toThrow()
      const html = renderToStaticMarkup(createElement(SymmetryDraw, { ...base, ...over }))
      expect(html).toContain('role="group"')
      expect(html).not.toContain('data-state="given"')
      expect(html).not.toContain('role="button"')
      expect(html).not.toContain('sym-axis')
      const els = tree(over)
      expect(els.some((e) => typeof e.props.onClick === 'function')).toBe(false)
    }
  })

  it('keyboard focus is shown by stroke, not by an outline', async () => {
    const css = (await import('node:fs')).readFileSync(new URL('./SymmetryDraw.css', import.meta.url), 'utf8')
    const block = /focus-visible {([^}]*)}/.exec(css)![1]!
    expect(block).toMatch(/stroke:/)
    expect(block).not.toMatch(/outline:\s*\d/)
  })

  it('shows the drawn cells and says so in the labels', () => {
    const html = renderToStaticMarkup(createElement(SymmetryDraw, { ...base, value: { kind: 'symmetryDraw', cells: ['4,1', '5,2'] } }))
    expect(html.match(/data-state="on"/g)).toHaveLength(2)
    expect(html).toContain('2 Felder gefärbt')
    expect(html).toContain('Spalte 5, Zeile 2, gefärbt')
  })
})
