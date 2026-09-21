import { describe, expect, it } from 'vitest'
import {
  buildFunctionTemplateSvg,
  compileFunctionSpec,
  compileMathExpression,
  defaultFunctionSpec,
  formatFunctionSpec,
  FUNCTION_KIND_META,
  generateAuthoredFunctionGraphSvg,
  functionSpecFromSliderValues,
} from './functionGraph'
import { getSvgTemplate, SVG_TEMPLATES } from './svgTemplateRegistry'

describe('functionGraph', () => {
  it('compiles standard families', () => {
    expect(compileFunctionSpec(defaultFunctionSpec('linear'))(2)).toBe(2)
    expect(compileFunctionSpec({ kind: 'quadratic', params: { a: 1, b: 0, c: -1 } })(2)).toBe(3)
    expect(compileFunctionSpec({ kind: 'sin', params: { a: 1, b: 1, h: 0, k: 0 } })(0)).toBe(0)
    expect(compileFunctionSpec({ kind: 'reciprocal', params: { a: 1, h: 0, k: 0 } })(0)).toBeNull()
    expect(compileFunctionSpec({ kind: 'sqrt', params: { a: 1, h: 0, k: 0 } })(-1)).toBeNull()
  })

  it('compiles safe custom expressions', () => {
    const ok = compileMathExpression('2*x+1')
    expect(ok.ok).toBe(true)
    if (ok.ok) expect(ok.fn(3)).toBe(7)

    const trig = compileMathExpression('sin(x)^2+cos(x)^2')
    expect(trig.ok).toBe(true)
    if (trig.ok) expect(trig.fn(1.2)).toBeCloseTo(1, 5)

    const bad = compileMathExpression('alert(1)')
    expect(bad.ok).toBe(false)
  })

  it('formats formulas', () => {
    expect(formatFunctionSpec({ kind: 'linear', params: { m: 2, n: -1 } })).toContain('2')
    expect(formatFunctionSpec({ kind: 'custom', params: { expr: 'x^2' } })).toBe('f(x) = x^2')
  })

  it('renders authored SVG for each kind', () => {
    for (const meta of FUNCTION_KIND_META) {
      const svg = generateAuthoredFunctionGraphSvg({
        curves: [defaultFunctionSpec(meta.id)],
        xRange: [-4, 4],
        yRange: [-4, 4],
      })
      expect(svg).toContain('<svg')
      expect(svg).toContain('polyline')
    }
  })

  it('builds template SVG and registry templates', () => {
    const svg = buildFunctionTemplateSvg('quadratic', {
      a: '1',
      b: '0',
      c: '-2',
      xMin: '-5',
      xMax: '5',
      yMin: '-5',
      yMax: '5',
      points: '0,-2:S',
    })
    expect(svg).toContain('<svg')
    expect(svg).toContain('polyline')

    const fnTemplates = SVG_TEMPLATES.filter((t) => t.group === 'funktionen')
    expect(fnTemplates.length).toBeGreaterThan(10)
    for (const t of fnTemplates) {
      const params: Record<string, string> = {}
      for (const p of t.params) params[p.key] = p.defaultValue
      const built = getSvgTemplate(t.id)!.build(params)
      expect(built).toContain('<svg')
    }
  })

  it('maps slider preview values', () => {
    const spec = functionSpecFromSliderValues('sin', { a: 2, b: 1, h: 0, k: 0 })
    expect(spec.kind).toBe('sin')
    expect(compileFunctionSpec(spec)(Math.PI / 2)).toBeCloseTo(2, 5)
  })
})
