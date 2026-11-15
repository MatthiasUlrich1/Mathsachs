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

import { Clock, type ClockProps } from './Clock'
import { CK_HIT_R, CK_VIEWBOX, ckHandTip, ckPoint, type ClockTime } from '../lib/clockLogic'

type Value = Extract<UserInput, { kind: 'clock' }>
const blank: Value = { kind: 'clock', h: 0, m: 0, touched: false }
const at = (h: number, m: number): Value => ({ kind: 'clock', h, m, touched: true })
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

const base: ClockProps = { value: blank, onChange: () => {} }
const tree = (over: Partial<ClockProps> = {}) => collect(Clock({ ...base, ...over }) as ReactNode)
const handle = (els: El[], hand: 'hour' | 'minute') => els.find((e) => e.props['data-testid'] === 'ck-handle' && e.props['data-hand'] === hand)!
const svgOf = (els: El[]) => els.find((e) => e.type === 'svg')!
type Handler = (e: unknown) => void
/** A pointer event at the angle (degrees) on the given radius around the centre. */
const ptr = (angle: number, r = 80) => {
  const p = ckPoint(angle, r)
  return { clientX: p.x, clientY: p.y, pointerId: 1 }
}
const key = (k: string) => ({ key: k, preventDefault: vi.fn() })
const readCss = (): string => fs.readFileSync(new URL('./Clock.css', import.meta.url), 'utf8')
const lineOf = (els: El[], id: string) => els.find((e) => e.props['data-testid'] === id)!

describe('Clock markup', () => {
  it('draws 60 ticks (12 longer), the numbers 1 to 12, two hands with knobs, and starts at 12:00', () => {
    const els = tree()
    const ticks = els.filter((e) => e.props['data-testid'] === 'ck-tick')
    expect(ticks).toHaveLength(60)
    expect(ticks.filter((t) => String(t.props.className).includes('major'))).toHaveLength(12)
    expect(els.filter((e) => e.props['data-testid'] === 'ck-number').map((e) => e.props.children)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    expect(els.filter((e) => e.props['data-testid'] === 'ck-handle')).toHaveLength(2)
    // untouched: both hands point up, the same for every task
    for (const id of ['ck-hour-line', 'ck-minute-line']) expect(Number(lineOf(els, id).props.x2)).toBeCloseTo(160, 6)
    expect(Number(lineOf(els, 'ck-hour-line').props.y2)).toBeLessThan(160)
  })

  it('an untouched clock ignores stored hand values (always 12:00)', () => {
    const els = tree({ value: { kind: 'clock', h: 7, m: 25, touched: false } })
    expect(Number(lineOf(els, 'ck-minute-line').props.x2)).toBeCloseTo(160, 6)
  })

  it('shows the hour hand moving along with the minutes (7:30 -> 225 degrees)', () => {
    const els = tree({ value: at(7, 30) })
    const tip = ckPoint(225, 58)
    expect(Number(lineOf(els, 'ck-hour-line').props.x2)).toBeCloseTo(tip.x, 6)
    expect(Number(lineOf(els, 'ck-hour-line').props.y2)).toBeCloseTo(tip.y, 6)
    const minuteTip = ckPoint(180, 90)
    expect(Number(lineOf(els, 'ck-minute-line').props.y2)).toBeCloseTo(minuteTip.y, 6)
  })

  it('the knobs sit at the hand tips', () => {
    const t: ClockTime = { h: 4, m: 40 }
    const els = tree({ value: at(4, 40) })
    for (const hand of ['hour', 'minute'] as const) {
      const knob = collect(handle(els, hand).props.children as ReactNode).find((e) => e.props.className === 'clock__knob')!
      const tip = ckHandTip(hand, t)
      expect(Number(knob.props.cx)).toBeCloseTo(tip.x, 6)
      expect(Number(knob.props.cy)).toBeCloseTo(tip.y, 6)
    }
  })

  it('renders as markup with a group role (not an image) and slider hands', () => {
    const html = renderToStaticMarkup(createElement(Clock, { ...base, instruction: 'Hinweis' }))
    expect(html).toContain('role="group"')
    expect(html).not.toContain('role="img"')
    expect(html).toContain('role="slider"')
    expect(html).toContain('viewBox="0 0 320 320"')
    expect(html).toContain('Hinweis')
  })

  it('only the knobs block touch scrolling (css); disabled is not focusable and shows a default cursor', () => {
    const css = readCss()
    expect(css).toMatch(/\.clock__handle\s*\{[^}]*touch-action:\s*none/)
    expect(css).not.toMatch(/\.clock__svg\s*\{[^}]*touch-action:\s*none/)
    expect(css).toMatch(/\[aria-disabled="true"\][^{]*handle\s*\{[^}]*cursor:\s*default/)
    expect(handle(tree(), 'hour').props.tabIndex).toBe(0)
    expect(handle(tree({ disabled: true }), 'minute').props.tabIndex).toBe(-1)
  })

  it('every hit area is at least 22 units and stays inside the viewBox at any time', () => {
    expect(CK_HIT_R).toBeGreaterThanOrEqual(22)
    for (let total = 0; total < 720; total += 5) {
      const els = tree({ value: at(Math.floor(total / 60), total % 60) })
      for (const c of els.filter((e) => e.props['data-testid'] === 'ck-hit')) {
        const r = Number(c.props.r)
        expect(r).toBeGreaterThanOrEqual(22)
        expect(Number(c.props.cx) - r).toBeGreaterThanOrEqual(0)
        expect(Number(c.props.cx) + r).toBeLessThanOrEqual(CK_VIEWBOX)
        expect(Number(c.props.cy) - r).toBeGreaterThanOrEqual(0)
        expect(Number(c.props.cy) + r).toBeLessThanOrEqual(CK_VIEWBOX)
      }
    }
  })

  it('the hands keep their DOM order whatever the time is; capture sits on the stable svg', () => {
    const order = (v: Value) =>
      tree({ value: v })
        .filter((e) => e.props['data-testid'] === 'ck-handle')
        .map((e) => e.props['data-hand'])
    expect(order(at(3, 15))).toEqual(['hour', 'minute'])
    expect(order(at(9, 45))).toEqual(['hour', 'minute'])
    const svg = svgOf(tree())
    expect(typeof svg.props.onLostPointerCapture).toBe('function')
    expect(typeof svg.props.onPointerCancel).toBe('function')
  })
})

describe('Clock dragging', () => {
  it('pressing a knob does not move it; dragging the minute hand snaps to 5 minutes and carries the hour hand', () => {
    const onChange = vi.fn()
    const els = tree({ onChange })
    ;(handle(els, 'minute').props.onPointerDown as Handler)(ptr(2, 90)) // 2 degrees beside the tip
    expect(onChange).not.toHaveBeenCalled()
    ;(svgOf(els).props.onPointerMove as Handler)(ptr(92, 90)) // a quarter turn on
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'clock', h: 0, m: 15, touched: true })
  })

  it('crossing 12 with the minute hand carries the hour in both directions', () => {
    const onChange = vi.fn()
    // 11:55 -> over the 12 -> 12:05
    const fwd = tree({ onChange, value: at(11, 55) })
    ;(handle(fwd, 'minute').props.onPointerDown as Handler)(ptr(330, 90))
    ;(svgOf(fwd).props.onPointerMove as Handler)(ptr(355, 90))
    ;(svgOf(fwd).props.onPointerMove as Handler)(ptr(30, 90))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'clock', h: 0, m: 5, touched: true })
    // 12:05 -> back over the 12 -> 11:55
    const back = tree({ onChange, value: at(0, 5) })
    ;(handle(back, 'minute').props.onPointerDown as Handler)(ptr(30, 90))
    ;(svgOf(back).props.onPointerMove as Handler)(ptr(5, 90))
    ;(svgOf(back).props.onPointerMove as Handler)(ptr(330, 90))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'clock', h: 11, m: 55, touched: true })
  })

  it('dragging the hour hand moves whole hours and keeps the minutes', () => {
    const onChange = vi.fn()
    const els = tree({ onChange, value: at(3, 40) })
    // the hour hand is at 3 * 30 + 20 = 110 degrees
    ;(handle(els, 'hour').props.onPointerDown as Handler)(ptr(110, 58))
    ;(svgOf(els).props.onPointerMove as Handler)(ptr(140, 58))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'clock', h: 4, m: 40, touched: true })
  })

  it('works with a one-minute snap', () => {
    const onChange = vi.fn()
    const els = tree({ onChange, minuteSnap: 1 })
    ;(handle(els, 'minute').props.onPointerDown as Handler)(ptr(0, 90))
    ;(svgOf(els).props.onPointerMove as Handler)(ptr(20, 90)) // 20 degrees = 3.33 minutes
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'clock', h: 0, m: 3, touched: true })
  })

  it('a press near both knobs picks the nearest one', () => {
    const onChange = vi.fn()
    const els = tree({ onChange }) // tips at 58 and 90 above the centre, hit areas overlap
    ;(handle(els, 'minute').props.onPointerDown as Handler)(ptr(0, 66)) // nearer to the hour knob
    ;(svgOf(els).props.onPointerMove as Handler)(ptr(90, 66))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'clock', h: 3, m: 0, touched: true })
  })

  it('does not report the same time twice, and a drag that ends where it began stays untouched', () => {
    const onChange = vi.fn()
    const els = tree({ onChange })
    ;(handle(els, 'minute').props.onPointerDown as Handler)(ptr(0, 90))
    ;(svgOf(els).props.onPointerMove as Handler)(ptr(2, 90))
    ;(svgOf(els).props.onPointerMove as Handler)(ptr(358, 90))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('moves nothing without a pointer-down, after pointer-up or capture loss, or when disabled', () => {
    const onChange = vi.fn()
    const els = tree({ onChange })
    const move = svgOf(els).props.onPointerMove as Handler
    move(ptr(90))
    expect(onChange).not.toHaveBeenCalled()
    ;(handle(els, 'minute').props.onPointerDown as Handler)(ptr(0, 90))
    ;(svgOf(els).props.onPointerUp as Handler)(ptr(0, 90))
    move(ptr(90, 90))
    expect(onChange).not.toHaveBeenCalled()
    ;(handle(els, 'minute').props.onPointerDown as Handler)(ptr(0, 90))
    ;(svgOf(els).props.onLostPointerCapture as Handler)(ptr(0, 90))
    move(ptr(90, 90))
    expect(onChange).not.toHaveBeenCalled()
    const off = tree({ onChange, disabled: true })
    ;(handle(off, 'minute').props.onPointerDown as Handler)(ptr(0, 90))
    ;(svgOf(off).props.onPointerMove as Handler)(ptr(90, 90))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('a second pointer can neither start nor drive nor end the drag', () => {
    const onChange = vi.fn()
    const els = tree({ onChange })
    ;(handle(els, 'minute').props.onPointerDown as Handler)(ptr(0, 90))
    ;(handle(els, 'minute').props.onPointerDown as Handler)({ ...ptr(180, 90), pointerId: 2 })
    ;(svgOf(els).props.onPointerMove as Handler)({ ...ptr(180, 90), pointerId: 2 })
    expect(onChange).not.toHaveBeenCalled()
    ;(svgOf(els).props.onPointerUp as Handler)({ ...ptr(180, 90), pointerId: 2 })
    ;(svgOf(els).props.onPointerMove as Handler)(ptr(90, 90))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'clock', h: 0, m: 15, touched: true })
  })

  it('survives a pointer without capture support', () => {
    expect(() => (handle(tree(), 'minute').props.onPointerDown as Handler)({ clientX: 1, clientY: 1, pointerId: 1 })).not.toThrow()
  })
})

describe('Clock keyboard', () => {
  it('arrow keys move the minute hand by one snap step (carrying the hour) and the hour hand by one hour', () => {
    const onChange = vi.fn()
    const els = tree({ onChange, value: at(3, 55) })
    ;(handle(els, 'minute').props.onKeyDown as Handler)(key('ArrowRight'))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'clock', h: 4, m: 0, touched: true })
    ;(handle(els, 'minute').props.onKeyDown as Handler)(key('ArrowLeft'))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'clock', h: 3, m: 50, touched: true })
    ;(handle(els, 'hour').props.onKeyDown as Handler)(key('ArrowUp'))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'clock', h: 4, m: 55, touched: true })
    const start = tree({ onChange })
    ;(handle(start, 'hour').props.onKeyDown as Handler)(key('ArrowDown'))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'clock', h: 11, m: 0, touched: true })
    const fine = tree({ onChange, minuteSnap: 1 })
    ;(handle(fine, 'minute').props.onKeyDown as Handler)(key('ArrowRight'))
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'clock', h: 0, m: 1, touched: true })
  })

  it('ignores other keys and does nothing when disabled', () => {
    const onChange = vi.fn()
    const k = key('a')
    ;(handle(tree({ onChange }), 'minute').props.onKeyDown as Handler)(k)
    expect(onChange).not.toHaveBeenCalled()
    expect(k.preventDefault).not.toHaveBeenCalled()
    ;(handle(tree({ onChange, disabled: true }), 'minute').props.onKeyDown as Handler)(key('ArrowRight'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('slider values describe the time', () => {
    const g = handle(tree({ value: at(7, 25) }), 'minute')
    expect(g.props['aria-valuenow']).toBe(25)
    expect(g.props['aria-valuetext']).toBe('7 Uhr 25')
    expect(handle(tree({ value: at(7, 25) }), 'hour').props['aria-valuenow']).toBe(7)
  })
})
