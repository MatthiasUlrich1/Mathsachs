import { createElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { UserInput } from '../curriculum/types'
import { FractionWall, FractionWallBoard } from './FractionWall'

type Value = Extract<UserInput, { kind: 'fractionWall' }>
type El = ReactElement<Record<string, unknown>>
type BoardProps = Parameters<typeof FractionWallBoard>[0]
const ROWS = [1, 2, 4, 8]
const blank: Value = { kind: 'fractionWall', selected: [] }

const collect = (node: ReactNode, out: El[] = []): El[] => {
  if (Array.isArray(node)) node.forEach((n) => collect(n, out))
  else if (isValidElement(node)) {
    const el = node as El
    out.push(el)
    collect(el.props.children as ReactNode, out)
  }
  return out
}

// No DOM environment: FractionWallBoard has no hooks, so calling it yields the element tree
// and the pointer handlers can be invoked directly.
const board = (props: Partial<BoardProps>, onChange: (v: UserInput) => void = () => {}) =>
  collect(
    FractionWallBoard({
      mode: 'equivalent',
      rows: ROWS,
      target: { num: 1, den: 2 },
      value: blank,
      onChange,
      linePos: 0,
      onLineChange: () => {},
      svgRef: { current: null },
      grabRef: { current: 0 },
      ...props,
    }),
  )

const tile = (els: El[], row: number, index: number) =>
  els.find(
    (e) => e.props['data-testid'] === 'wall-tile' && e.props['data-row'] === row && e.props['data-index'] === index,
  )!
const down = (el: El) => (el.props.onClick as () => void)()

describe('FractionWall markup', () => {
  it('renders a group svg with d tiles per row, labels, the line and a slider handle', () => {
    const html = renderToStaticMarkup(
      createElement(FractionWall, {
        mode: 'equivalent',
        rows: ROWS,
        target: { num: 1, den: 2 },
        value: blank,
        onChange: () => {},
        instruction: 'Tippe.',
      }),
    )
    expect(html).toContain('role="group"')
    expect(html).toContain('viewBox="0 0 362 ')
    expect(html.match(/data-testid="wall-tile"/g)).toHaveLength(1 + 2 + 4 + 8)
    expect(html).toContain('role="slider"')
    expect(html).toContain('data-testid="wall-line"')
    expect(html).toContain('Tippe.')
    expect(html).not.toContain('role="img"')
  })

  it('equivalent: only the reference row is shaded from the start', () => {
    const html = renderToStaticMarkup(
      createElement(FractionWall, {
        mode: 'equivalent',
        rows: ROWS,
        target: { num: 1, den: 2 },
        value: blank,
        onChange: () => {},
      }),
    )
    expect(html.match(/data-selected="true"/g)).toHaveLength(1)
    expect(html).toContain('fraction-wall__tile--ref')
  })

  it('compare: nothing is shaded at the start', () => {
    const html = renderToStaticMarkup(
      createElement(FractionWall, { mode: 'compare', rows: ROWS, value: blank, onChange: () => {} }),
    )
    expect(html).not.toContain('data-selected="true"')
  })
})

describe('FractionWall interaction', () => {
  it('tapping a tile selects the run up to it; tapping the run end again shrinks it by one tile', () => {
    const calls: UserInput[] = []
    down(tile(board({}, (v) => calls.push(v)), 8, 3))
    down(
      tile(
        board({ value: { kind: 'fractionWall', selected: [{ row: 8, count: 4 }] } }, (v) => calls.push(v)),
        8,
        3,
      ),
    )
    expect(calls).toEqual([
      { kind: 'fractionWall', selected: [{ row: 8, count: 4 }] },
      { kind: 'fractionWall', selected: [{ row: 8, count: 3 }] },
    ])
  })

  it('compare mode keeps a single run', () => {
    const calls: UserInput[] = []
    const els = board(
      { mode: 'compare', target: undefined, value: { kind: 'fractionWall', selected: [{ row: 4, count: 2 }] } },
      (v) => calls.push(v),
    )
    down(tile(els, 8, 2))
    expect(calls).toEqual([{ kind: 'fractionWall', selected: [{ row: 8, count: 3 }] }])
  })

  it('the reference row cannot be changed', () => {
    const calls: UserInput[] = []
    down(tile(board({}, (v) => calls.push(v)), 2, 1))
    expect(calls).toEqual([])
  })

  it('disabled: no onChange', () => {
    const calls: UserInput[] = []
    down(tile(board({ disabled: true }, (v) => calls.push(v)), 8, 3))
    expect(calls).toEqual([])
  })

  it('the handle moves the line by keyboard and never touches the answer', () => {
    const lines: number[] = []
    const calls: UserInput[] = []
    const els = board({ linePos: 0.5, onLineChange: (p) => lines.push(p) }, (v) => calls.push(v))
    const handle = els.find((e) => e.props['data-testid'] === 'wall-handle')!
    const key = handle.props.onKeyDown as (e: { key: string; preventDefault: () => void }) => void
    key({ key: 'ArrowRight', preventDefault() {} })
    key({ key: 'ArrowLeft', preventDefault() {} })
    key({ key: 'x', preventDefault() {} })
    expect(lines).toHaveLength(2)
    expect(lines[0]).toBeCloseTo(0.5 + 1 / 24, 5)
    expect(lines[1]).toBeCloseTo(0.5 - 1 / 24, 5)
    expect(calls).toEqual([])
  })

  it('dragging the handle moves the line in SVG units and keeps the grab offset', () => {
    const lines: number[] = []
    const rect = { left: 0, width: 362 } as DOMRect
    const svgRef = { current: { getBoundingClientRect: () => rect } as unknown as SVGSVGElement }
    const grabRef = { current: 0 }
    // Line at pos 0.5 = svg x 186 = client x 186; grab 5 px right of its centre.
    const els = board({ linePos: 0.5, svgRef, grabRef, onLineChange: (p) => lines.push(p) })
    const handle = els.find((e) => e.props['data-testid'] === 'wall-handle')!
    const target = { setPointerCapture() {}, hasPointerCapture: () => true, releasePointerCapture() {} }
    ;(handle.props.onPointerDown as (e: unknown) => void)({
      preventDefault() {},
      currentTarget: target,
      pointerId: 1,
      clientX: 191,
    })
    expect(grabRef.current).toBeCloseTo(5, 5)
    ;(handle.props.onPointerMove as (e: unknown) => void)({ currentTarget: target, pointerId: 1, clientX: 191 })
    expect(lines[0]).toBeCloseTo(0.5, 5)
    ;(handle.props.onPointerMove as (e: unknown) => void)({ currentTarget: target, pointerId: 1, clientX: 9999 })
    expect(lines[1]).toBe(1)
  })

  it('pointer move without capture does nothing', () => {
    const lines: number[] = []
    const els = board({ onLineChange: (p) => lines.push(p) })
    const handle = els.find((e) => e.props['data-testid'] === 'wall-handle')!
    ;(handle.props.onPointerMove as (e: unknown) => void)({
      currentTarget: { hasPointerCapture: () => false },
      pointerId: 1,
      clientX: 100,
    })
    expect(lines).toEqual([])
  })
})
