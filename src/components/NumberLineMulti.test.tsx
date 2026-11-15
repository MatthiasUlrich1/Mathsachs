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

import { NumberLineMulti, type NumberLineMultiProps } from './NumberLineMulti'
import {
  NLM_CHIP_H,
  NLM_CHIP_W,
  NLM_LINE_Y,
  NLM_ROW_Y,
  NLM_TRAY_Y,
  NLM_VIEWBOX_H,
  NLM_VIEWBOX_W,
  nlmSlotX,
  nlmXFromValue,
} from '../lib/numberLineMultiLogic'

type Value = Extract<UserInput, { kind: 'numberLineMulti' }>
const blank: Value = { kind: 'numberLineMulti', positions: {} }
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

const base: NumberLineMultiProps = {
  items: [
    { id: 'a', label: '1/4' },
    { id: 'b', label: '3/4' },
    { id: 'c', label: '3/2' },
  ],
  order: ['c', 'a', 'b'],
  min: 0,
  max: 2,
  step: 0.25,
  labelEvery: 4,
  value: blank,
  onChange: () => {},
}
const tree = (over: Partial<NumberLineMultiProps> = {}) => collect(NumberLineMulti({ ...base, ...over }) as ReactNode)
const chip = (els: El[], id: string) => els.find((e) => e.props['data-testid'] === 'nlm-chip' && e.props['data-id'] === id)!
const svgOf = (els: El[]) => els.find((e) => e.type === 'svg')!
type Handler = (e: unknown) => void
const ptr = (clientX: number, clientY: number) => ({ clientX, clientY, pointerId: 1, currentTarget: {} })

describe('NumberLineMulti markup', () => {
  it('renders a group svg with the line, ticks, three tray labels and no solution', () => {
    const html = renderToStaticMarkup(createElement(NumberLineMulti, { ...base, instruction: 'Ziehe.' }))
    expect(html).toContain('role="group"')
    expect(html).not.toContain('role="img"')
    expect(html).toMatch(/viewBox="0 0 600 240"/)
    expect(html.match(/data-testid="nlm-chip"/g)).toHaveLength(3)
    expect(html).not.toContain('data-pos')
    expect(html.match(/number-line-multi__tick/g)).toHaveLength(9)
    // numbers only at 0, 1 and 2 - not at the targets
    expect(html.match(/number-line-multi__num/g)).toHaveLength(3)
    expect(html).not.toContain('0,75')
    expect(html).toContain('Ziehe.')
  })

  it('only the labels block touch scrolling (touch-action in the css), the svg itself does not', () => {
    const css = readCss()
    expect(css).toMatch(/\.number-line-multi__chip\s*\{[^}]*touch-action:\s*none/)
    expect(css).not.toMatch(/\.number-line-multi__svg\s*\{[^}]*touch-action:\s*none/)
    expect(css).toMatch(/\[aria-disabled="true"\][^{]*chip\s*\{[^}]*cursor:\s*default/)
  })

  it('every label sits in the tray in the given order at the start', () => {
    const els = tree()
    const rects = (id: string) => collect(chip(els, id).props.children as ReactNode).find((e) => e.type === 'rect')!
    const x = (id: string) => Number(rects(id).props.x) + NLM_CHIP_W / 2
    expect(x('c')).toBeCloseTo(nlmSlotX(0, 3), 1)
    expect(x('a')).toBeCloseTo(nlmSlotX(1, 3), 1)
    expect(x('b')).toBeCloseTo(nlmSlotX(2, 3), 1)
    expect(Number(rects('c').props.y) + NLM_CHIP_H / 2).toBe(NLM_TRAY_Y)
  })

  it('placed labels sit above their position with a stem and dot on the line, inside the viewBox (both ends)', () => {
    const els = tree({ value: { kind: 'numberLineMulti', positions: { a: 0, b: 2, c: 1 } } })
    const stems = els.filter((e) => e.props.className === 'number-line-multi__stem')
    expect(stems).toHaveLength(3)
    for (const id of ['a', 'b', 'c']) {
      const c = chip(els, id)
      expect(c.props['data-pos']).not.toBeUndefined()
      const r = collect(c.props.children as ReactNode).find((e) => e.type === 'rect')!
      expect(Number(r.props.x)).toBeGreaterThanOrEqual(0)
      expect(Number(r.props.x) + NLM_CHIP_W).toBeLessThanOrEqual(NLM_VIEWBOX_W)
      expect(Number(r.props.y) + NLM_CHIP_H).toBeLessThan(NLM_LINE_Y)
      expect(Number(r.props.y) + NLM_CHIP_H / 2).toBe(NLM_ROW_Y[['a', 'b', 'c'].indexOf(id) % 2])
    }
    const dots = els.filter((e) => e.props.className === 'number-line-multi__dot')
    expect(dots.map((d) => d.props.cx).sort()).toEqual([nlmXFromValue(0, 0, 2), nlmXFromValue(1, 0, 2), nlmXFromValue(2, 0, 2)].sort())
  })

  it('nothing is drawn outside the viewBox', () => {
    const els = tree({ value: { kind: 'numberLineMulti', positions: { a: 0, b: 2, c: 1 } } })
    for (const e of els.filter((x) => x.type === 'rect' || x.type === 'line' || x.type === 'circle')) {
      for (const k of ['x', 'x1', 'x2', 'cx']) if (e.props[k] !== undefined) expect(Number(e.props[k])).toBeGreaterThanOrEqual(0)
      for (const k of ['x1', 'x2', 'cx']) if (e.props[k] !== undefined) expect(Number(e.props[k])).toBeLessThanOrEqual(NLM_VIEWBOX_W)
      for (const k of ['y', 'y1', 'y2', 'cy']) if (e.props[k] !== undefined) expect(Number(e.props[k])).toBeLessThanOrEqual(NLM_VIEWBOX_H)
    }
  })

  it('has a hit area of at least 22 units (the chip itself) and is focusable; disabled is not', () => {
    expect(NLM_CHIP_H).toBeGreaterThanOrEqual(22)
    expect(NLM_CHIP_W).toBeGreaterThanOrEqual(22)
    expect(chip(tree(), 'a').props.tabIndex).toBe(0)
    expect(chip(tree({ disabled: true }), 'a').props.tabIndex).toBe(-1)
  })
})

describe('NumberLineMulti dragging', () => {
  it('drags a label from the tray onto the line, snapped to the grid, keeping the grab offset', () => {
    const onChange = vi.fn()
    const els = tree({ onChange })
    const startX = nlmSlotX(1, 3) // label a
    // grab 20 units right of the centre: the label must not jump
    ;(chip(els, 'a').props.onPointerDown as Handler)(ptr(startX + 20, NLM_TRAY_Y))
    const move = svgOf(els).props.onPointerMove as Handler
    const target = nlmXFromValue(0.75, 0, 2)
    move(ptr(target + 20, NLM_ROW_Y[0]))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'numberLineMulti', positions: { a: 0.75 } })
    // a little off still snaps to the 0.125 grid
    move(ptr(target + 20 + 4, NLM_ROW_Y[0]))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'numberLineMulti', positions: { a: 0.75 } })
    move(ptr(nlmXFromValue(1.1, 0, 2) + 20, NLM_ROW_Y[0]))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'numberLineMulti', positions: { a: 1.125 } })
  })

  it('does not report the same position twice', () => {
    const onChange = vi.fn()
    const els = tree({ onChange, value: { kind: 'numberLineMulti', positions: { a: 0.75 } } })
    ;(chip(els, 'a').props.onPointerDown as Handler)(ptr(nlmXFromValue(0.75, 0, 2), NLM_ROW_Y[0]))
    ;(svgOf(els).props.onPointerMove as Handler)(ptr(nlmXFromValue(0.75, 0, 2), NLM_ROW_Y[0]))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('clamps to the ends of the line', () => {
    const onChange = vi.fn()
    const els = tree({ onChange })
    ;(chip(els, 'b').props.onPointerDown as Handler)(ptr(nlmSlotX(2, 3), NLM_TRAY_Y))
    const move = svgOf(els).props.onPointerMove as Handler
    move(ptr(-500, 120))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'numberLineMulti', positions: { b: 0 } })
    move(ptr(5000, 120))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'numberLineMulti', positions: { b: 2 } })
  })

  it('keeps the other labels when one is moved, and dragging back into the tray removes only that one', () => {
    const onChange = vi.fn()
    const value: Value = { kind: 'numberLineMulti', positions: { a: 0.25, b: 0.75 } }
    const els = tree({ onChange, value })
    ;(chip(els, 'b').props.onPointerDown as Handler)(ptr(nlmXFromValue(0.75, 0, 2), NLM_ROW_Y[1]))
    const move = svgOf(els).props.onPointerMove as Handler
    move(ptr(nlmXFromValue(1.5, 0, 2), NLM_ROW_Y[1]))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'numberLineMulti', positions: { a: 0.25, b: 1.5 } })
    move(ptr(300, NLM_TRAY_Y))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'numberLineMulti', positions: { a: 0.25 } })
  })

  it('moves nothing without a pointer-down, after pointer-up, or when disabled', () => {
    const onChange = vi.fn()
    const els = tree({ onChange })
    const move = svgOf(els).props.onPointerMove as Handler
    move(ptr(300, 120))
    expect(onChange).not.toHaveBeenCalled()
    ;(chip(els, 'a').props.onPointerDown as Handler)(ptr(nlmSlotX(1, 3), NLM_TRAY_Y))
    ;(svgOf(els).props.onPointerUp as Handler)(ptr(0, 0))
    move(ptr(300, 120))
    expect(onChange).not.toHaveBeenCalled()
    const off = tree({ onChange, disabled: true })
    ;(chip(off, 'a').props.onPointerDown as Handler)(ptr(nlmSlotX(1, 3), NLM_TRAY_Y))
    ;(svgOf(off).props.onPointerMove as Handler)(ptr(300, 120))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('survives a pointer without capture support', () => {
    const els = tree()
    const down = chip(els, 'a').props.onPointerDown as Handler
    expect(() => down({ clientX: 1, clientY: 1, pointerId: 1, currentTarget: { setPointerCapture: () => { throw new Error('x') } } })).not.toThrow()
  })
})

describe('NumberLineMulti keyboard', () => {
  const key = (k: string) => ({ key: k, preventDefault: vi.fn() })

  it('Enter and Space put a tray label on the line at min', () => {
    for (const k of ['Enter', ' ']) {
      const onChange = vi.fn()
      const els = tree({ onChange, min: -3, max: 3, step: 0.5, labelEvery: 2 })
      ;(chip(els, 'a').props.onKeyDown as Handler)(key(k))
      expect(onChange).toHaveBeenCalledWith({ kind: 'numberLineMulti', positions: { a: -3 } })
    }
  })

  it('arrow keys move a placed label by snap and stop at the ends', () => {
    const onChange = vi.fn()
    const els = tree({ onChange, value: { kind: 'numberLineMulti', positions: { a: 0.25 } } })
    const down = chip(els, 'a').props.onKeyDown as Handler
    down(key('ArrowRight'))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'numberLineMulti', positions: { a: 0.375 } })
    down(key('ArrowLeft'))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'numberLineMulti', positions: { a: 0.125 } })
    const atMin = tree({ onChange, value: { kind: 'numberLineMulti', positions: { a: 0 } } })
    onChange.mockClear()
    ;(chip(atMin, 'a').props.onKeyDown as Handler)(key('ArrowLeft'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('arrow keys do nothing on a tray label, and Delete returns a placed label to the tray', () => {
    const onChange = vi.fn()
    ;(chip(tree({ onChange }), 'a').props.onKeyDown as Handler)(key('ArrowRight'))
    expect(onChange).not.toHaveBeenCalled()
    const els = tree({ onChange, value: { kind: 'numberLineMulti', positions: { a: 0.25, b: 1 } } })
    ;(chip(els, 'a').props.onKeyDown as Handler)(key('Delete'))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'numberLineMulti', positions: { b: 1 } })
  })

  it('does nothing when disabled', () => {
    const onChange = vi.fn()
    ;(chip(tree({ onChange, disabled: true }), 'a').props.onKeyDown as Handler)(key('Enter'))
    expect(onChange).not.toHaveBeenCalled()
  })
})

function readCss(): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require('node:fs') as typeof import('node:fs')
  return fs.readFileSync(new URL('./NumberLineMulti.css', import.meta.url), 'utf8')
}
