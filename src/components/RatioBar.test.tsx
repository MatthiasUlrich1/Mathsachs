import { createElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { UserInput } from '../curriculum/types'
import { RatioBar, type RatioBarProps } from './RatioBar'
import { RATIO_VIEWBOX_W, ratioBarLayout } from '../lib/ratioBarLogic'

type Value = Extract<UserInput, { kind: 'ratioBar' }>
const blank: Value = { kind: 'ratioBar', parts: [] }

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

const base: RatioBarProps = {
  mode: 'colour',
  segments: 10,
  ratio: [2, 3],
  labels: ['Saft', 'Wasser'],
  value: blank,
  onChange: () => {},
}
// RatioBar has no hooks, so calling it yields the element tree and the handlers can be invoked directly.
const tree = (over: Partial<RatioBarProps>) => collect(RatioBar({ ...base, ...over }))
const byId = (els: El[], id: string) => els.filter((e) => e.props['data-testid'] === id)

describe('RatioBar colour mode', () => {
  it('renders a group svg with an empty bar and the legend (no solution in the start state)', () => {
    const html = renderToStaticMarkup(createElement(RatioBar, { ...base, instruction: 'Färbe.' }))
    expect(html).toContain('role="group"')
    expect(html).not.toContain('role="img"')
    expect(html).toMatch(/viewBox="0 0 380 \d+"/)
    expect(html.match(/data-testid="ratio-cell"/g)).toHaveLength(10)
    expect(html.match(/data-part=""/g)).toHaveLength(10)
    expect(html).toContain('A = Saft')
    expect(html).toContain('B = Wasser')
    expect(html).toContain('Färbe.')
    expect(html).not.toContain('<input')
  })

  it('tap-only widget: click handlers on the cells, no pointer handlers', () => {
    for (const e of byId(tree({}), 'ratio-cell')) {
      expect(e.props.onPointerDown).toBeUndefined()
      expect(typeof e.props.onClick).toBe('function')
    }
    expect(renderToStaticMarkup(createElement(RatioBar, base))).not.toContain('touch-action: none')
  })

  it('a tap cycles the field: empty -> A -> B -> empty and keeps the other fields', () => {
    const calls: UserInput[] = []
    const onChange = (v: UserInput) => calls.push(v)
    ;(byId(tree({ onChange }), 'ratio-cell')[2]!.props.onClick as () => void)()
    expect(calls[0]).toEqual({ kind: 'ratioBar', parts: [null, null, 'A', null, null, null, null, null, null, null] })
    const withA: Value = { kind: 'ratioBar', parts: [null, null, 'A'] }
    ;(byId(tree({ onChange, value: withA }), 'ratio-cell')[2]!.props.onClick as () => void)()
    expect((calls[1] as Value).parts[2]).toBe('B')
    ;(byId(tree({ onChange, value: { kind: 'ratioBar', parts: [null, null, 'B'] } }), 'ratio-cell')[2]!.props.onClick as () => void)()
    expect((calls[2] as Value).parts[2]).toBeNull()
  })

  it('keyboard: Enter and Space activate a cell', () => {
    const calls: UserInput[] = []
    const cell = byId(tree({ onChange: (v) => calls.push(v) }), 'ratio-cell')[0]!
    const key = cell.props.onKeyDown as (e: { key: string; preventDefault: () => void }) => void
    key({ key: 'Enter', preventDefault: () => {} })
    key({ key: ' ', preventDefault: () => {} })
    key({ key: 'a', preventDefault: () => {} })
    expect(calls).toHaveLength(2)
  })

  it('shows the letters and fills of coloured fields and says so in the labels', () => {
    const html = renderToStaticMarkup(
      createElement(RatioBar, { ...base, value: { kind: 'ratioBar', parts: ['A', 'B', null] } }),
    )
    expect(html.match(/data-part="A"/g)).toHaveLength(1)
    expect(html.match(/data-part="B"/g)).toHaveLength(1)
    expect(html).toContain('Feld 1 von 10, A = Saft')
    expect(html).toContain('Feld 3 von 10, nicht gefärbt')
    expect(html).toContain('2 gefärbt')
  })

  it('disabled: no change on tap, default cursor marker', () => {
    const calls: UserInput[] = []
    const els = tree({ disabled: true, onChange: (v) => calls.push(v) })
    ;(byId(els, 'ratio-cell')[0]!.props.onClick as () => void)()
    expect(calls).toEqual([])
    const html = renderToStaticMarkup(createElement(RatioBar, { ...base, disabled: true }))
    expect(html).toContain('aria-disabled="true"')
    expect(html).not.toContain('tabindex')
  })

  it('every field of the largest bar is inside the viewBox', () => {
    const l = ratioBarLayout('colour', 12)
    expect(l.cells[11]!.x + l.cells[11]!.w).toBeLessThanOrEqual(RATIO_VIEWBOX_W)
  })
})

describe('RatioBar split mode', () => {
  const split: Partial<RatioBarProps> = { mode: 'split', segments: 5, total: 600, unit: 'ml' }

  it('renders the divided, already coloured bar, the total above it and two inputs with the unit', () => {
    const html = renderToStaticMarkup(createElement(RatioBar, { ...base, ...split }))
    expect(html.match(/data-testid="ratio-cell"/g)).toHaveLength(5)
    expect(html.match(/data-part="A"/g)).toHaveLength(2)
    expect(html.match(/data-part="B"/g)).toHaveLength(3)
    expect(html).toContain('Gesamt: 600 ml')
    expect(html.match(/<input/g)).toHaveLength(2)
    expect(html).toContain('inputMode="decimal"')
    expect(html).toContain('<span>ml</span>')
    // cells are not buttons here
    expect(html).not.toContain('role="button"')
  })

  it('typing keeps the other amount; parts stay empty', () => {
    const calls: UserInput[] = []
    const onChange = (v: UserInput) => calls.push(v)
    const inputs = byId(tree({ ...split, onChange }), 'ratio-amount-0')
    ;(inputs[0]!.props.onChange as (e: { target: { value: string } }) => void)({ target: { value: '2,5' } })
    expect(calls[0]).toEqual({ kind: 'ratioBar', parts: [], amounts: ['2,5', ''] })
    const second = byId(tree({ ...split, onChange, value: { kind: 'ratioBar', parts: [], amounts: ['2,5', ''] } }), 'ratio-amount-1')
    ;(second[0]!.props.onChange as (e: { target: { value: string } }) => void)({ target: { value: '7' } })
    expect(calls[1]).toEqual({ kind: 'ratioBar', parts: [], amounts: ['2,5', '7'] })
  })

  it('disabled inputs do not emit', () => {
    const calls: UserInput[] = []
    const inputs = byId(tree({ ...split, disabled: true, onChange: (v) => calls.push(v) }), 'ratio-amount-0')
    ;(inputs[0]!.props.onChange as (e: { target: { value: string } }) => void)({ target: { value: '1' } })
    expect(calls).toEqual([])
    expect(renderToStaticMarkup(createElement(RatioBar, { ...base, ...split, disabled: true }))).toContain('disabled=""')
  })
})
