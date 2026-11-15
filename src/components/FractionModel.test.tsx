import { createElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { UserInput } from '../curriculum/types'
import { FractionModel } from './FractionModel'

const blank: Extract<UserInput, { kind: 'fractionModel' }> = { kind: 'fractionModel', den: 4, shaded: [] }

type El = ReactElement<Record<string, unknown>>

/** Collect all elements (depth first) from an unrendered element tree. */
const collect = (node: ReactNode, out: El[] = []): El[] => {
  if (Array.isArray(node)) node.forEach((n) => collect(n, out))
  else if (isValidElement(node)) {
    const el = node as El
    out.push(el)
    collect(el.props.children as ReactNode, out)
  }
  return out
}

// No DOM environment: FractionModel has no hooks, so calling it yields the element
// tree and the pointer handlers can be invoked directly.
const tree = (value: Extract<UserInput, { kind: 'fractionModel' }>, onChange: (v: UserInput) => void, disabled = false) =>
  collect(FractionModel({ shape: 'bar', value, onChange, disabled }))

const down = (el: El) => (el.props.onPointerDown as (e: { preventDefault: () => void }) => void)({ preventDefault() {} })

describe('FractionModel', () => {
  it('renders a group svg with one part per den, shaded state and the stepper (bar)', () => {
    const html = renderToStaticMarkup(
      createElement(FractionModel, {
        shape: 'bar',
        value: { kind: 'fractionModel', den: 6, shaded: [1, 2] },
        onChange: () => {},
        instruction: 'Färbe.',
      }),
    )
    expect(html).toContain('role="group"')
    expect(html).toContain('viewBox="0 0 320 90"')
    expect(html.match(/data-testid="fraction-part"/g)).toHaveLength(6)
    expect(html.match(/data-shaded="true"/g)).toHaveLength(2)
    expect(html).toContain('6 Teile')
    expect(html).toContain('Ein Teil weniger')
    expect(html).toContain('Ein Teil mehr')
    expect(html).toContain('Färbe.')
  })

  it('renders the circle model', () => {
    const html = renderToStaticMarkup(
      createElement(FractionModel, { shape: 'circle', value: blank, onChange: () => {} }),
    )
    expect(html).toContain('viewBox="0 0 220 220"')
    expect(html.match(/data-testid="fraction-part"/g)).toHaveLength(4)
    expect(html).not.toContain('data-shaded="true"')
  })

  it('stepper buttons are disabled at 2 and 12 parts only', () => {
    const at = (den: number) =>
      renderToStaticMarkup(
        createElement(FractionModel, { shape: 'bar', value: { kind: 'fractionModel', den, shaded: [] }, onChange: () => {} }),
      )
    expect(at(2)).toMatch(/aria-label="Ein Teil weniger" disabled/)
    expect(at(12)).toMatch(/aria-label="Ein Teil mehr" disabled/)
    expect(at(5)).not.toContain('disabled')
  })

  it('pointer down on a part toggles it via onChange', () => {
    const calls: UserInput[] = []
    const parts = tree({ kind: 'fractionModel', den: 4, shaded: [1] }, (v) => calls.push(v)).filter(
      (e) => e.props['data-testid'] === 'fraction-part',
    )
    down(parts[3]!)
    down(parts[1]!)
    expect(calls).toEqual([
      { kind: 'fractionModel', den: 4, shaded: [1, 3] },
      { kind: 'fractionModel', den: 4, shaded: [] },
    ])
  })

  it('stepper changes den and drops shading beyond the new range', () => {
    const calls: UserInput[] = []
    const els = tree({ kind: 'fractionModel', den: 6, shaded: [0, 5] }, (v) => calls.push(v))
    const less = els.find((e) => e.props['aria-label'] === 'Ein Teil weniger')!
    const more = els.find((e) => e.props['aria-label'] === 'Ein Teil mehr')!
    ;(less.props.onClick as () => void)()
    ;(more.props.onClick as () => void)()
    expect(calls).toEqual([
      { kind: 'fractionModel', den: 5, shaded: [0] },
      { kind: 'fractionModel', den: 7, shaded: [0, 5] },
    ])
  })

  it('disabled: no onChange', () => {
    const calls: UserInput[] = []
    const els = tree(blank, (v) => calls.push(v), true)
    down(els.find((e) => e.props['data-testid'] === 'fraction-part')!)
    ;(els.find((e) => e.props['aria-label'] === 'Ein Teil mehr')!.props.onClick as () => void)()
    expect(calls).toEqual([])
  })
})
