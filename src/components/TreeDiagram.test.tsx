import { isValidElement, type ReactElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import type { UserInput } from '../curriculum/types'
import { TreeDiagram, type TreeDiagramProps } from './TreeDiagram'
import { TREE_INPUT_H_PX } from '../lib/treeDiagramLogic'

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

const empty = { kind: 'treeDiagram' as const, branches: {}, leaves: {} }
const props = (over: Partial<TreeDiagramProps> = {}): TreeDiagramProps => ({
  levels: [{ outcomes: ['Rot', 'Blau'] }, { outcomes: ['Rot', 'Blau'] }],
  given: { '0': '3/5', '1': '2/5', '1.0': '3/4' },
  blankBranches: ['0.0', '0.1', '1.1'],
  blankLeaves: ['0.0'],
  rootLabel: 'Start',
  value: empty,
  onChange: () => {},
  ...over,
})
const tree = (p: TreeDiagramProps) => collect(TreeDiagram(p))
const byTestId = (els: El[], id: string) => els.find((e) => e.props['data-testid'] === id)

describe('TreeDiagram', () => {
  it('renders chips, given values, one input per blank (decimal keyboard, 44 px) and the lines', () => {
    const html = renderToStaticMarkup(<TreeDiagram {...props()} />)
    expect(html).toContain('Start')
    for (const id of ['0', '1', '0.0', '0.1', '1.0', '1.1']) expect(html).toContain(`data-testid="tree-chip-${id}"`)
    expect((html.match(/<input /g) ?? []).length).toBe(4)
    expect((html.match(/<line /g) ?? []).length).toBe(6)
    expect(html).toContain('inputMode="decimal"')
    expect(html).toContain(`height:${TREE_INPUT_H_PX}px`)
    expect(html).toContain('3/5')
    expect(html).toContain('3/4')
    expect(html).toContain('role="group"')
    expect(html).not.toContain('role="img"')
  })

  it('shows the given values with a decimal comma and does not render inputs for them', () => {
    const html = renderToStaticMarkup(<TreeDiagram {...props({ given: { '0': '0.4', '1': '0.6', '1.0': '1/2' }, blankBranches: ['0.0'], blankLeaves: [] })} />)
    expect(html).toContain('0,4')
    expect(html).not.toContain('0.4')
    expect((html.match(/<input /g) ?? []).length).toBe(1)
  })

  it('typing calls onChange with the new text and keeps the other fields', () => {
    const onChange = vi.fn()
    const value = { kind: 'treeDiagram' as const, branches: { '0.0': '1' }, leaves: { '0.0': '3' } }
    const els = tree(props({ onChange, value }))
    const branch = byTestId(els, 'tree-branch-0.1')!
    ;(branch.props.onChange as (e: { target: { value: string } }) => void)({ target: { value: '1/2' } })
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'treeDiagram', branches: { '0.0': '1', '0.1': '1/2' }, leaves: { '0.0': '3' } } satisfies UserInput)
    const leaf = byTestId(els, 'tree-leaf-0.0')!
    ;(leaf.props.onChange as (e: { target: { value: string } }) => void)({ target: { value: '3/10' } })
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'treeDiagram', branches: { '0.0': '1' }, leaves: { '0.0': '3/10' } })
  })

  it('inputs are controlled by value and never grab focus themselves', () => {
    const value = { kind: 'treeDiagram' as const, branches: { '0.0': '1/2' }, leaves: {} }
    const els = tree(props({ value }))
    expect(byTestId(els, 'tree-branch-0.0')!.props.value).toBe('1/2')
    expect(byTestId(els, 'tree-branch-0.1')!.props.value).toBe('')
    const html = renderToStaticMarkup(<TreeDiagram {...props({ value })} />)
    expect(html).not.toContain('autofocus')
    expect(html).not.toContain('autoFocus')
  })

  it('every input has a spoken name with its path; disabled disables them', () => {
    const html = renderToStaticMarkup(<TreeDiagram {...props({ disabled: true })} />)
    expect(html).toContain('aria-label="Wahrscheinlichkeit des Zweigs Rot, Blau"')
    expect(html).toContain('aria-label="Wahrscheinlichkeit des Pfads Rot, Rot"')
    expect((html.match(/disabled=""/g) ?? []).length).toBe(4)
  })

  it('a one-level tree has no leaf field and still renders', () => {
    const html = renderToStaticMarkup(
      <TreeDiagram {...props({ levels: [{ outcomes: ['A', 'B', 'C'] }], given: { '0': '1/2', '1': '3/10' }, blankBranches: ['2'], blankLeaves: [] })} />,
    )
    expect((html.match(/<input /g) ?? []).length).toBe(1)
    expect((html.match(/<line /g) ?? []).length).toBe(3)
  })
})
