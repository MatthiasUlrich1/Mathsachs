import { createElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { UserInput } from '../curriculum/types'
import { DivideTool, DivideToolBoard } from './DivideTool'

type Value = Extract<UserInput, { kind: 'divideTool' }>
const blank: Value = { kind: 'divideTool', partsPerWhole: 1, assignment: [null, null, null] }

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

// No DOM environment: DivideToolBoard has no hooks, so calling it yields the element tree
// and the handlers can be invoked directly.
const tree = (
  value: Value,
  onChange: (v: UserInput) => void,
  opts: { selected?: number | null; onSelect?: (p: number | null) => void; disabled?: boolean } = {},
) =>
  collect(
    DivideToolBoard({
      shape: 'circle',
      count: 3,
      persons: 4,
      value,
      onChange,
      selected: opts.selected ?? null,
      onSelect: opts.onSelect ?? (() => {}),
      disabled: opts.disabled,
    }),
  )
const byId = (els: El[], id: string) => els.filter((e) => e.props['data-testid'] === id)
const click = (el: El) => (el.props.onClick as () => void)()

describe('DivideTool', () => {
  it('renders a group svg with the stepper, one part per whole and one box per person', () => {
    const html = renderToStaticMarkup(
      createElement(DivideTool, { shape: 'circle', count: 3, persons: 4, value: blank, onChange: () => {}, instruction: 'Teile.' }),
    )
    expect(html).toContain('role="group"')
    expect(html).not.toContain('role="img"')
    expect(html).toMatch(/viewBox="0 0 380 \d+"/)
    expect(html.match(/data-testid="divide-part"/g)).toHaveLength(3)
    expect(html.match(/data-testid="divide-person"/g)).toHaveLength(4)
    for (let i = 1; i <= 4; i++) expect(html).toContain(`Kind ${i}`)
    expect(html).toContain('Ungeteilt')
    expect(html).toContain('Teile pro Ganzes')
    expect(html).toContain('Teile.')
    // nothing handed out at the start
    expect(html).not.toContain('data-selected="true"')
    expect(html.match(/data-owner=""/g)).toHaveLength(3)
  })

  it('renders bars, divided parts and owners', () => {
    const html = renderToStaticMarkup(
      createElement(DivideToolBoard, {
        shape: 'bar',
        count: 2,
        persons: 3,
        value: { kind: 'divideTool', partsPerWhole: 3, assignment: [0, 1, 2, null, null, 2] },
        onChange: () => {},
        selected: 3,
        onSelect: () => {},
      }),
    )
    expect(html.match(/data-testid="divide-part"/g)).toHaveLength(6)
    expect(html).toContain('3 Teile pro Ganzes')
    expect(html.match(/data-selected="true"/g)).toHaveLength(1)
    expect(html).toContain('Kind 3, 2 Teile')
    expect(html).toContain('Kind 1, 1 Teil')
  })

  it('tap-only widget: click handlers, no pointer handlers', () => {
    const els = tree(blank, () => {})
    for (const e of [...byId(els, 'divide-part'), ...byId(els, 'divide-person')]) {
      expect(e.props.onPointerDown).toBeUndefined()
      expect(typeof e.props.onClick).toBe('function')
    }
  })

  it('tapping a part only selects it; a person then receives it and selection is cleared', () => {
    const calls: UserInput[] = []
    const sel: Array<number | null> = []
    const onSelect = (p: number | null) => sel.push(p)
    click(byId(tree(blank, (v) => calls.push(v), { onSelect }), 'divide-part')[1]!)
    expect(calls).toEqual([])
    expect(sel).toEqual([1])
    // a person without a picked part does nothing
    click(byId(tree(blank, (v) => calls.push(v), { onSelect }), 'divide-person')[2]!)
    expect(calls).toEqual([])
    // a person with a picked part
    click(byId(tree(blank, (v) => calls.push(v), { selected: 1, onSelect }), 'divide-person')[2]!)
    expect(calls).toEqual([{ kind: 'divideTool', partsPerWhole: 1, assignment: [null, 2, null] }])
    expect(sel).toEqual([1, null])
  })

  it('tapping the picked part again deselects it; re-assigning changes the owner; same person takes it back', () => {
    const sel: Array<number | null> = []
    click(byId(tree(blank, () => {}, { selected: 2, onSelect: (p) => sel.push(p) }), 'divide-part')[2]!)
    expect(sel).toEqual([null])
    const calls: UserInput[] = []
    const withOwner: Value = { kind: 'divideTool', partsPerWhole: 1, assignment: [0, null, null] }
    click(byId(tree(withOwner, (v) => calls.push(v), { selected: 0 }), 'divide-person')[3]!)
    click(byId(tree(withOwner, (v) => calls.push(v), { selected: 0 }), 'divide-person')[0]!)
    expect(calls).toEqual([
      { kind: 'divideTool', partsPerWhole: 1, assignment: [3, null, null] },
      { kind: 'divideTool', partsPerWhole: 1, assignment: [null, null, null] },
    ])
  })

  it('stepper resets all assignments and the selection; limits are 1 and 12', () => {
    const calls: UserInput[] = []
    const sel: Array<number | null> = []
    const value: Value = { kind: 'divideTool', partsPerWhole: 2, assignment: [0, 1, 2, 3, 0, 1] }
    const els = tree(value, (v) => calls.push(v), { selected: 4, onSelect: (p) => sel.push(p) })
    click(els.find((e) => e.props['aria-label'] === 'Ein Teil pro Ganzes mehr')!)
    click(els.find((e) => e.props['aria-label'] === 'Ein Teil pro Ganzes weniger')!)
    expect(calls).toEqual([
      { kind: 'divideTool', partsPerWhole: 3, assignment: new Array(9).fill(null) },
      { kind: 'divideTool', partsPerWhole: 1, assignment: [null, null, null] },
    ])
    expect(sel).toEqual([null, null])
    const at = (n: number) =>
      renderToStaticMarkup(
        createElement(DivideToolBoard, {
          shape: 'bar',
          count: 1,
          persons: 2,
          value: { kind: 'divideTool', partsPerWhole: n, assignment: [] },
          onChange: () => {},
          selected: null,
          onSelect: () => {},
        }),
      )
    expect(at(1)).toMatch(/aria-label="Ein Teil pro Ganzes weniger" disabled/)
    expect(at(12)).toMatch(/aria-label="Ein Teil pro Ganzes mehr" disabled/)
    expect(at(5)).not.toMatch(/<button[^>]* disabled/)
  })

  it('a stale assignment of the wrong length is normalised', () => {
    const html = renderToStaticMarkup(
      createElement(DivideToolBoard, {
        shape: 'circle',
        count: 2,
        persons: 3,
        value: { kind: 'divideTool', partsPerWhole: 2, assignment: [0] },
        onChange: () => {},
        selected: null,
        onSelect: () => {},
      }),
    )
    expect(html.match(/data-testid="divide-part"/g)).toHaveLength(4)
  })

  it('disabled: no onChange, no selection', () => {
    const calls: UserInput[] = []
    const sel: Array<number | null> = []
    const els = tree(blank, (v) => calls.push(v), { selected: 0, onSelect: (p) => sel.push(p), disabled: true })
    click(byId(els, 'divide-part')[0]!)
    click(byId(els, 'divide-person')[0]!)
    click(els.find((e) => e.props['aria-label'] === 'Ein Teil pro Ganzes mehr')!)
    expect(calls).toEqual([])
    expect(sel).toEqual([])
  })

  it('keyboard: Enter on a part selects it', () => {
    const sel: Array<number | null> = []
    const part = byId(tree(blank, () => {}, { onSelect: (p) => sel.push(p) }), 'divide-part')[0]!
    ;(part.props.onKeyDown as (e: { key: string; preventDefault: () => void }) => void)({ key: 'Enter', preventDefault() {} })
    expect(sel).toEqual([0])
  })
})

describe("owner numbers only appear on distributed (filled) parts", () => {
  const owners = (v: Value) => tree(v, () => {}).filter((e) => e.props.className === "divide-tool__owner").length
  it("none while nothing is distributed, one per owned part afterwards", () => {
    expect(owners(blank)).toBe(0)
    expect(owners({ kind: "divideTool", partsPerWhole: 1, assignment: [0, null, 1] })).toBe(2)
  })
})
