import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { PieChart } from './PieChart'

const cats = ['Sparen', 'Kino', 'Spiele', 'Essen', 'Buecher']

describe('PieChart: every non-zero sector has a tag in the svg and in the legend', () => {
  it.each([
    [2, [2, 4, 94]],
    [4, [4, 4, 92]],
    [5, [5, 5, 5, 5, 80]],
    [10, [10, 10, 10, 10, 60]],
  ] as const)('snap %i, shares %j', (snap, shares) => {
    const names = cats.slice(0, shares.length)
    const html = renderToStaticMarkup(
      createElement(PieChart, {
        categories: names,
        snapPercent: snap,
        value: { kind: 'pieChart', percents: [...shares] },
        onChange: () => {},
      }),
    )
    expect((html.match(/data-testid="pc-tag"/g) ?? []).length).toBe(shares.length)
    expect((html.match(/data-testid="pc-legend-tag"/g) ?? []).length).toBe(shares.length)
  })
})
