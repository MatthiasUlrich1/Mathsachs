import { createElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import fs from 'node:fs'
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

import { PieChart, type PieChartProps } from './PieChart'
import { PC_HIT_R, PC_R, PC_VIEWBOX_H, PC_VIEWBOX_W, pcPoint } from '../lib/pieChartLogic'

type Value = Extract<UserInput, { kind: 'pieChart' }>
const blank: Value = { kind: 'pieChart', percents: null }
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

const base: PieChartProps = {
  categories: ['Obst', 'Brötchen', 'Riegel', 'Nichts'],
  value: blank,
  onChange: () => {},
}
const tree = (over: Partial<PieChartProps> = {}) => collect(PieChart({ ...base, ...over }) as ReactNode)
const handle = (els: El[], i: number) => els.find((e) => e.props['data-testid'] === 'pc-handle' && e.props['data-index'] === i)!
const svgOf = (els: El[]) => els.find((e) => e.type === 'svg')!
type Handler = (e: unknown) => void
const at = (percent: number, r = PC_R) => {
  const p = pcPoint(percent, r)
  return { clientX: p.x, clientY: p.y, pointerId: 1 }
}
const key = (k: string) => ({ key: k, preventDefault: vi.fn() })
const readCss = (): string => fs.readFileSync(new URL('./PieChart.css', import.meta.url), 'utf8')

describe('PieChart markup', () => {
  it('renders a group svg with k-1 sliders, sectors and legend, no role=img', () => {
    const html = renderToStaticMarkup(createElement(PieChart, { ...base, instruction: 'Ziehe.' }))
    expect(html).toContain('role="group"')
    expect(html).not.toContain('role="img"')
    expect(html).toMatch(/viewBox="0 0 600 340"/)
    expect(html.match(/role="slider"/g)).toHaveLength(3)
    expect(html.match(/pie-chart__sector/g)).toHaveLength(4)
    for (const t of ['Obst', 'Brötchen', 'Riegel', 'Nichts', 'Ziehe.']) expect(html).toContain(t)
  })

  it('shows the equal start shares (25 each) with percents inside the sectors, identical for every task of this size', () => {
    const els = tree()
    const sectors = els.filter((e) => e.props['data-testid'] === 'pc-sector')
    expect(sectors.map((s) => s.props['data-percent'])).toEqual([25, 25, 25, 25])
    expect(els.filter((e) => e.props['data-testid'] === 'pc-label')).toHaveLength(4)
    expect(els.filter((e) => e.props['data-testid'] === 'pc-legend-value')).toHaveLength(0)
  })

  it('a sector too small for its text shows the percent in the legend instead', () => {
    const els = tree({ value: { kind: 'pieChart', percents: [5, 45, 25, 25] } })
    const labels = els.filter((e) => e.props['data-testid'] === 'pc-label')
    expect(labels).toHaveLength(3)
    const legendValues = els.filter((e) => e.props['data-testid'] === 'pc-legend-value')
    expect(legendValues).toHaveLength(1)
    expect(legendValues[0]!.props.children).toBe('5 %')
    expect(renderToStaticMarkup(createElement(PieChart, { ...base, value: { kind: 'pieChart', percents: [5, 45, 25, 25] } }))).toContain('5 %')
  })

  it('handles sit on the circle edge at the boundaries', () => {
    const els = tree({ value: { kind: 'pieChart', percents: [40, 30, 20, 10] } })
    const expected = [40, 70, 90]
    expected.forEach((b, k) => {
      const g = handle(els, k + 1)
      expect(g.props['data-boundary']).toBe(b)
      const knob = collect(g.props.children as ReactNode).find((e) => e.props.className === 'pie-chart__knob')!
      const pt = pcPoint(b, PC_R)
      expect(Number(knob.props.cx)).toBeCloseTo(pt.x, 6)
      expect(Number(knob.props.cy)).toBeCloseTo(pt.y, 6)
    })
  })

  it('only the knobs block touch scrolling (css); disabled is not focusable and shows a default cursor', () => {
    const css = readCss()
    expect(css).toMatch(/\.pie-chart__handle\s*\{[^}]*touch-action:\s*none/)
    expect(css).not.toMatch(/\.pie-chart__svg\s*\{[^}]*touch-action:\s*none/)
    expect(css).toMatch(/\[aria-disabled="true"\][^{]*handle\s*\{[^}]*cursor:\s*default/)
    expect(handle(tree(), 1).props.tabIndex).toBe(0)
    expect(handle(tree({ disabled: true }), 1).props.tabIndex).toBe(-1)
  })

  it('every hit area is at least 22 units and stays inside the viewBox for all boundary positions', () => {
    expect(PC_HIT_R).toBeGreaterThanOrEqual(22)
    for (let b = 5; b <= 95; b += 5) {
      const els = tree({ categories: ['A', 'B'], value: { kind: 'pieChart', percents: [b, 100 - b] } })
      for (const c of els.filter((e) => e.props['data-testid'] === 'pc-hit')) {
        expect(Number(c.props.r)).toBeGreaterThanOrEqual(22)
        expect(Number(c.props.cx) - Number(c.props.r)).toBeGreaterThanOrEqual(0)
        expect(Number(c.props.cx) + Number(c.props.r)).toBeLessThanOrEqual(PC_VIEWBOX_W)
        expect(Number(c.props.cy) - Number(c.props.r)).toBeGreaterThanOrEqual(0)
        expect(Number(c.props.cy) + Number(c.props.r)).toBeLessThanOrEqual(PC_VIEWBOX_H)
      }
    }
  })

  it('the pie, its start line and the legend lie inside the viewBox', () => {
    const els = tree()
    for (const e of els.filter((x) => x.type === 'rect' || x.type === 'line')) {
      for (const k of ['x', 'x1', 'x2']) if (e.props[k] !== undefined) expect(Number(e.props[k])).toBeGreaterThanOrEqual(0)
      for (const k of ['y', 'y1', 'y2']) if (e.props[k] !== undefined) expect(Number(e.props[k])).toBeGreaterThanOrEqual(0)
      for (const k of ['x1', 'x2']) if (e.props[k] !== undefined) expect(Number(e.props[k])).toBeLessThanOrEqual(PC_VIEWBOX_W)
      for (const k of ['y1', 'y2']) if (e.props[k] !== undefined) expect(Number(e.props[k])).toBeLessThanOrEqual(PC_VIEWBOX_H)
    }
  })

  it('the handles keep their DOM order whatever the shares are (pointer capture sits on the stable svg)', () => {
    const order = (percents: number[] | null) =>
      tree({ value: { kind: 'pieChart', percents } })
        .filter((e) => e.props['data-testid'] === 'pc-handle')
        .map((e) => e.props['data-index'])
    expect(order([45, 5, 5, 45])).toEqual([1, 2, 3])
    expect(order(null)).toEqual([1, 2, 3])
    const svg = svgOf(tree())
    expect(typeof svg.props.onLostPointerCapture).toBe('function')
    expect(typeof svg.props.onPointerCancel).toBe('function')
  })
})

describe('PieChart dragging', () => {
  it('pressing a knob does not move it; dragging snaps to 5 % and keeps the grab offset', () => {
    const onChange = vi.fn()
    const els = tree({ onChange })
    // knob 1 is at 25 %: press 2 % beside it
    ;(handle(els, 1).props.onPointerDown as Handler)(at(27))
    expect(onChange).not.toHaveBeenCalled()
    const move = svgOf(els).props.onPointerMove as Handler
    move(at(42)) // 42 - 2 = 40
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'pieChart', percents: [40, 10, 25, 25] })
  })

  it('a knob cannot pass its neighbours', () => {
    const onChange = vi.fn()
    const els = tree({ onChange })
    ;(handle(els, 1).props.onPointerDown as Handler)(at(25))
    ;(svgOf(els).props.onPointerMove as Handler)(at(60))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'pieChart', percents: [45, 5, 25, 25] })
    const els2 = tree({ onChange })
    ;(handle(els2, 3).props.onPointerDown as Handler)(at(75))
    ;(svgOf(els2).props.onPointerMove as Handler)(at(40))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'pieChart', percents: [25, 25, 5, 45] })
  })

  it('crossing 12 o-clock does not make the knob jump to the other end', () => {
    const onChange = vi.fn()
    const els = tree({ onChange, value: { kind: 'pieChart', percents: [10, 40, 25, 25] } })
    ;(handle(els, 1).props.onPointerDown as Handler)(at(10))
    ;(svgOf(els).props.onPointerMove as Handler)(at(98)) // beyond the fixed 0 boundary: stops at the first step
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'pieChart', percents: [5, 45, 25, 25] })
    for (const call of onChange.mock.calls) expect((call[0] as Value).percents![0]).toBeLessThanOrEqual(10)
  })

  it('does not report the same shares twice, and a drag that ends where it began stays untouched', () => {
    const onChange = vi.fn()
    const els = tree({ onChange })
    ;(handle(els, 2).props.onPointerDown as Handler)(at(50))
    ;(svgOf(els).props.onPointerMove as Handler)(at(51))
    ;(svgOf(els).props.onPointerMove as Handler)(at(52))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('a press near two knobs picks the nearest one', () => {
    const onChange = vi.fn()
    const els = tree({ onChange, value: { kind: 'pieChart', percents: [45, 5, 25, 25] } })
    // knobs at 45 and 50: press at 49.5 through the hit area of knob 1 -> knob 2 is nearer
    ;(handle(els, 1).props.onPointerDown as Handler)(at(49.6))
    ;(svgOf(els).props.onPointerMove as Handler)(at(70))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'pieChart', percents: [45, 25, 5, 25] })
  })

  it('moves nothing without a pointer-down, after pointer-up, or when disabled', () => {
    const onChange = vi.fn()
    const els = tree({ onChange })
    const move = svgOf(els).props.onPointerMove as Handler
    move(at(40))
    expect(onChange).not.toHaveBeenCalled()
    ;(handle(els, 1).props.onPointerDown as Handler)(at(25))
    ;(svgOf(els).props.onPointerUp as Handler)(at(25))
    move(at(40))
    expect(onChange).not.toHaveBeenCalled()
    ;(handle(els, 1).props.onPointerDown as Handler)(at(25))
    ;(svgOf(els).props.onLostPointerCapture as Handler)(at(25))
    move(at(40))
    expect(onChange).not.toHaveBeenCalled()
    const off = tree({ onChange, disabled: true })
    ;(handle(off, 1).props.onPointerDown as Handler)(at(25))
    ;(svgOf(off).props.onPointerMove as Handler)(at(40))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('survives a pointer without capture support', () => {
    const els = tree()
    expect(() => (handle(els, 1).props.onPointerDown as Handler)({ clientX: 1, clientY: 1, pointerId: 1 })).not.toThrow()
  })

  it('works with a finer snap step', () => {
    const onChange = vi.fn()
    const els = tree({ onChange, snapPercent: 1, categories: ['A', 'B'] })
    ;(handle(els, 1).props.onPointerDown as Handler)(at(50))
    ;(svgOf(els).props.onPointerMove as Handler)(at(53.2))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'pieChart', percents: [53, 47] })
  })
})

describe('PieChart keyboard', () => {
  it('arrow keys move the focused knob by one snap step and stop at the limits', () => {
    const onChange = vi.fn()
    const els = tree({ onChange })
    ;(handle(els, 1).props.onKeyDown as Handler)(key('ArrowRight'))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'pieChart', percents: [30, 20, 25, 25] })
    ;(handle(els, 1).props.onKeyDown as Handler)(key('ArrowLeft'))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'pieChart', percents: [20, 30, 25, 25] })
    onChange.mockClear()
    const edge = tree({ onChange, value: { kind: 'pieChart', percents: [5, 45, 25, 25] } })
    ;(handle(edge, 1).props.onKeyDown as Handler)(key('ArrowDown'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('ignores other keys and does nothing when disabled', () => {
    const onChange = vi.fn()
    const els = tree({ onChange })
    const k = key('a')
    ;(handle(els, 1).props.onKeyDown as Handler)(k)
    expect(onChange).not.toHaveBeenCalled()
    expect(k.preventDefault).not.toHaveBeenCalled()
    ;(handle(tree({ onChange, disabled: true }), 1).props.onKeyDown as Handler)(key('ArrowRight'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('slider values describe the boundary and its allowed range', () => {
    const g = handle(tree({ value: { kind: 'pieChart', percents: [40, 30, 20, 10] } }), 2)
    expect(g.props['aria-valuenow']).toBe(70)
    expect(g.props['aria-valuemin']).toBe(45)
    expect(g.props['aria-valuemax']).toBe(85)
    expect(String(g.props['aria-label'])).toContain('Brötchen')
  })
})
