import { createElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import type { UserInput } from '../curriculum/types'

// The component only needs a ref and one piece of state: make the hooks plain so the element tree
// can be inspected and the handlers called directly (no DOM environment in this project).
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>()
  return {
    ...actual,
    useRef: <T,>(v: T) => ({ current: v }),
    useState: <T,>(v: T | (() => T)) => [typeof v === 'function' ? (v as () => T)() : v, () => {}],
  }
})

import { BarChart, type BarChartProps } from './BarChart'
import { BC_HIT_R, BC_VIEWBOX_H, BC_VIEWBOX_W, BC_Y_BASE, bcBarCentreX, bcYFromValue } from '../lib/barChartLogic'

type Value = Extract<UserInput, { kind: 'barChart' }>
const blank: Value = { kind: 'barChart', values: [null, null, null] }
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

const base: BarChartProps = {
  categories: ['Hund', 'Katze', 'Fisch'],
  yMax: 10,
  step: 1,
  starts: [0, 0, 0],
  yLabel: 'Anzahl Kinder',
  value: blank,
  onChange: () => {},
}
const tree = (over: Partial<BarChartProps> = {}) => collect(BarChart({ ...base, ...over }) as ReactNode)
const bar = (els: El[], i: number) => els.find((e) => e.props['data-testid'] === 'bc-bar' && e.props['data-index'] === i)!
const svgOf = (els: El[]) => els.find((e) => e.type === 'svg')!
type Handler = (e: unknown) => void
const ptr = (clientY: number) => ({ clientX: 100, clientY, pointerId: 1 })
const key = (k: string) => ({ key: k, preventDefault: vi.fn() })

describe('BarChart markup', () => {
  it('renders a group svg with a slider per bar, the grid, numbers and categories, and no heights', () => {
    const html = renderToStaticMarkup(createElement(BarChart, { ...base, instruction: 'Ziehe.' }))
    expect(html).toContain('role="group"')
    expect(html).not.toContain('role="img"')
    expect(html).toMatch(/viewBox="0 0 600 300"/)
    expect(html.match(/role="slider"/g)).toHaveLength(3)
    expect(html).not.toContain('data-value')
    // untouched bars show no number inside the handle
    expect(html).not.toContain('bar-chart__value')
    expect(html).toContain('noch nicht eingestellt')
    for (const t of ['Hund', 'Katze', 'Fisch', 'Anzahl Kinder', 'Ziehe.']) expect(html).toContain(t)
    // 11 ticks -> numbers at every 2nd tick: 0, 2, ..., 10
    expect(html.match(/bar-chart__num/g)).toHaveLength(6)
    expect(html.match(/bar-chart__grid/g)).toHaveLength(10)
  })

  it('touched bars show their value, untouched ones still start flat on the axis', () => {
    const html = renderToStaticMarkup(createElement(BarChart, { ...base, value: { kind: 'barChart', values: [4, null, null] } }))
    expect(html.match(/bar-chart__value/g)).toHaveLength(1)
    expect(html).toContain('data-value="4"')
    const els = tree({ value: { kind: 'barChart', values: [4, null, null] } })
    const fill = (i: number) => collect(bar(els, i).props.children as ReactNode).find((e) => e.props.className === 'bar-chart__fill')!
    expect(Number(fill(0).props.y)).toBeCloseTo(bcYFromValue(4, 10), 6)
    expect(Number(fill(1).props.height)).toBe(0)
  })

  it('an untouched bar whose answer is 0 starts one step up (from starts)', () => {
    const els = tree({ starts: [0, 1, 0] })
    const fill = collect(bar(els, 1).props.children as ReactNode).find((e) => e.props.className === 'bar-chart__fill')!
    expect(Number(fill.props.y)).toBeCloseTo(bcYFromValue(1, 10), 6)
    expect(bar(els, 1).props['aria-valuenow']).toBe(1)
    expect(bar(els, 1).props['data-value']).toBeUndefined()
  })

  it('only the bars block touch scrolling (css), the svg does not; disabled is not focusable and shows a default cursor', () => {
    const css = readCss()
    expect(css).toMatch(/\.bar-chart__bar\s*\{[^}]*touch-action:\s*none/)
    expect(css).not.toMatch(/\.bar-chart__svg\s*\{[^}]*touch-action:\s*none/)
    expect(css).toMatch(/\[aria-disabled="true"\][^{]*bar\s*\{[^}]*cursor:\s*default/)
    expect(bar(tree(), 0).props.tabIndex).toBe(0)
    expect(bar(tree({ disabled: true }), 0).props.tabIndex).toBe(-1)
  })

  it('every hit area has a radius of at least 22 and the handles stay inside the viewBox at both ends', () => {
    expect(BC_HIT_R).toBeGreaterThanOrEqual(22)
    for (const v of [0, 10]) {
      const els = tree({ value: { kind: 'barChart', values: [v, v, v] } })
      for (const c of els.filter((e) => e.props['data-testid'] === 'bc-hit')) {
        expect(Number(c.props.r)).toBeGreaterThanOrEqual(22)
        expect(Number(c.props.cx) - Number(c.props.r)).toBeGreaterThanOrEqual(0)
        expect(Number(c.props.cx) + Number(c.props.r)).toBeLessThanOrEqual(BC_VIEWBOX_W)
        expect(Number(c.props.cy) - Number(c.props.r)).toBeGreaterThanOrEqual(0)
        expect(Number(c.props.cy) + Number(c.props.r)).toBeLessThanOrEqual(BC_VIEWBOX_H)
      }
    }
  })

  it('no rect, line or circle leaves the viewBox', () => {
    const els = tree({ value: { kind: 'barChart', values: [0, 5, 10] }, categories: ['A', 'B', 'C'] })
    for (const e of els.filter((x) => x.type === 'rect' || x.type === 'line')) {
      for (const k of ['x', 'x1', 'x2']) if (e.props[k] !== undefined) expect(Number(e.props[k])).toBeGreaterThanOrEqual(0)
      for (const k of ['x1', 'x2']) if (e.props[k] !== undefined) expect(Number(e.props[k])).toBeLessThanOrEqual(BC_VIEWBOX_W)
      for (const k of ['y', 'y1', 'y2']) if (e.props[k] !== undefined) expect(Number(e.props[k])).toBeGreaterThanOrEqual(0)
      for (const k of ['y1', 'y2']) if (e.props[k] !== undefined) expect(Number(e.props[k])).toBeLessThanOrEqual(BC_VIEWBOX_H)
    }
    const handles = els.filter((e) => e.props.className === 'bar-chart__handle')
    for (const h of handles) {
      expect(Number(h.props.y)).toBeGreaterThanOrEqual(0)
      expect(Number(h.props.y) + Number(h.props.height)).toBeLessThanOrEqual(BC_VIEWBOX_H)
    }
  })

  it('the bars keep their DOM order whatever the values are (pointer capture sits on the stable svg)', () => {
    const order = (values: Array<number | null>) =>
      tree({ value: { kind: 'barChart', values } })
        .filter((e) => e.props['data-testid'] === 'bc-bar')
        .map((e) => e.props['data-index'])
    expect(order([9, 1, 5])).toEqual([0, 1, 2])
    expect(order([null, null, null])).toEqual([0, 1, 2])
    const svg = svgOf(tree())
    expect(typeof svg.props.onLostPointerCapture).toBe('function')
    expect(typeof svg.props.onPointerCancel).toBe('function')
  })
})

describe('BarChart dragging', () => {
  it('grabbing the handle keeps the offset; moving snaps to the grid', () => {
    const onChange = vi.fn()
    const els = tree({ onChange })
    // handle of bar 0 is at the axis; grab 10 units below its centre
    ;(bar(els, 0).props.onPointerDown as Handler)(ptr(BC_Y_BASE + 10))
    expect(onChange).not.toHaveBeenCalled() // no jump on press
    const move = svgOf(els).props.onPointerMove as Handler
    move(ptr(bcYFromValue(6, 10) + 10))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'barChart', values: [6, null, null] })
    move(ptr(bcYFromValue(6, 10) + 10 + 4)) // a bit off still snaps
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'barChart', values: [6, null, null] })
    move(ptr(bcYFromValue(7, 10) + 10))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'barChart', values: [7, null, null] })
  })

  it('pressing inside the column but away from the handle puts the bar top there', () => {
    const onChange = vi.fn()
    const els = tree({ onChange })
    ;(bar(els, 2).props.onPointerDown as Handler)(ptr(bcYFromValue(8, 10)))
    expect(onChange).toHaveBeenCalledWith({ kind: 'barChart', values: [null, null, 8] })
  })

  it('does not report the same value twice and keeps the other bars', () => {
    const onChange = vi.fn()
    const value: Value = { kind: 'barChart', values: [3, null, 5] }
    const els = tree({ onChange, value })
    ;(bar(els, 0).props.onPointerDown as Handler)(ptr(bcYFromValue(3, 10)))
    ;(svgOf(els).props.onPointerMove as Handler)(ptr(bcYFromValue(3, 10)))
    expect(onChange).not.toHaveBeenCalled()
    ;(svgOf(els).props.onPointerMove as Handler)(ptr(bcYFromValue(9, 10)))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'barChart', values: [9, null, 5] })
  })

  it('clamps to 0 and yMax', () => {
    const onChange = vi.fn()
    const els = tree({ onChange })
    ;(bar(els, 1).props.onPointerDown as Handler)(ptr(BC_Y_BASE))
    const move = svgOf(els).props.onPointerMove as Handler
    move(ptr(-900))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'barChart', values: [null, 10, null] })
    move(ptr(900))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'barChart', values: [null, 0, null] })
  })

  it('moves nothing without a pointer-down, after pointer-up, or when disabled', () => {
    const onChange = vi.fn()
    const els = tree({ onChange })
    const move = svgOf(els).props.onPointerMove as Handler
    move(ptr(100))
    expect(onChange).not.toHaveBeenCalled()
    ;(bar(els, 0).props.onPointerDown as Handler)(ptr(BC_Y_BASE))
    ;(svgOf(els).props.onPointerUp as Handler)(ptr(0))
    move(ptr(100))
    expect(onChange).not.toHaveBeenCalled()
    const off = tree({ onChange, disabled: true })
    ;(bar(off, 0).props.onPointerDown as Handler)(ptr(BC_Y_BASE))
    ;(svgOf(off).props.onPointerMove as Handler)(ptr(100))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('survives a pointer without capture support', () => {
    const els = tree()
    expect(() => (bar(els, 0).props.onPointerDown as Handler)({ clientX: 1, clientY: 1, pointerId: 1 })).not.toThrow()
  })

  it('bar centres line up with the category labels', () => {
    const labels = tree().filter((e) => e.props.className === 'bar-chart__category')
    labels.forEach((l, i) => expect(Number(l.props.x)).toBe(bcBarCentreX(i, 3)))
  })
})

describe('BarChart keyboard', () => {
  it('arrow keys change a bar by one step and stop at the ends', () => {
    const onChange = vi.fn()
    const els = tree({ onChange, value: { kind: 'barChart', values: [4, null, 10] } })
    ;(bar(els, 0).props.onKeyDown as Handler)(key('ArrowUp'))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'barChart', values: [5, null, 10] })
    ;(bar(els, 0).props.onKeyDown as Handler)(key('ArrowDown'))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'barChart', values: [3, null, 10] })
    onChange.mockClear()
    ;(bar(els, 2).props.onKeyDown as Handler)(key('ArrowUp'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('an untouched bar starts from its shown start height', () => {
    const onChange = vi.fn()
    const els = tree({ onChange, starts: [0, 2, 0], step: 2, yMax: 10 })
    ;(bar(els, 1).props.onKeyDown as Handler)(key('ArrowUp'))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'barChart', values: [null, 4, null] })
    ;(bar(els, 1).props.onKeyDown as Handler)(key('ArrowDown'))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'barChart', values: [null, 0, null] })
  })

  it('ignores other keys and does nothing when disabled', () => {
    const onChange = vi.fn()
    ;(bar(tree({ onChange }), 0).props.onKeyDown as Handler)(key('a'))
    ;(bar(tree({ onChange, disabled: true }), 0).props.onKeyDown as Handler)(key('ArrowUp'))
    expect(onChange).not.toHaveBeenCalled()
  })
})

function readCss(): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require('node:fs') as typeof import('node:fs')
  return fs.readFileSync(new URL('./BarChart.css', import.meta.url), 'utf8')
}
