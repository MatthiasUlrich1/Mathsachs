import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { CoordinateGraphEditor } from './CoordinateGraphEditor'
import { emptyCoordinateScene } from '../lib/coordinateScene'

const scene = emptyCoordinateScene({
  objects: [
    { id: 'A', kind: 'point', x: 0, y: 0, label: 'A', fixed: true },
    { id: 'c', kind: 'circle', cx: 0, cy: 0, r: 2 },
  ],
})

describe('CoordinateGraphEditor circle tool', () => {
  it('shows Zirkel and Rückgängig only when circle is allowed', () => {
    const withCircle = renderToStaticMarkup(
      <CoordinateGraphEditor scene={scene} onChange={() => {}} allowedTools={['select', 'circle']} />,
    )
    expect(withCircle).toContain('Zirkel')
    expect(withCircle).toContain('Rückgängig')
    const legacy = renderToStaticMarkup(
      <CoordinateGraphEditor scene={scene} onChange={() => {}} allowedTools={['select', 'line']} />,
    )
    expect(legacy).not.toContain('Zirkel')
    expect(legacy).not.toContain('Rückgängig')
    const defaults = renderToStaticMarkup(<CoordinateGraphEditor scene={scene} onChange={() => {}} />)
    expect(defaults).not.toContain('Zirkel')
  })

  it('renders circles in the scene and scales with the viewBox', () => {
    const html = renderToStaticMarkup(
      <CoordinateGraphEditor scene={scene} onChange={() => {}} allowedTools={['circle']} />,
    )
    expect(html).toMatch(/<path d="M [^"]+" fill="none"/)
    expect(html).toContain('viewBox=')
  })
})

describe('CoordinateGraphEditor angle tool', () => {
  it('shows Winkel and Rückgängig only when angle is allowed (opt-in)', () => {
    const withAngle = renderToStaticMarkup(
      <CoordinateGraphEditor scene={scene} onChange={() => {}} allowedTools={['select', 'angle']} />,
    )
    expect(withAngle).toContain('Winkel')
    expect(withAngle).toContain('Rückgängig')
    const legacy = renderToStaticMarkup(
      <CoordinateGraphEditor scene={scene} onChange={() => {}} allowedTools={['select', 'line']} />,
    )
    expect(legacy).not.toContain('Winkel')
    const defaults = renderToStaticMarkup(<CoordinateGraphEditor scene={scene} onChange={() => {}} />)
    expect(defaults).not.toContain('Winkel')
  })

  it('renders drawn angle rays with the existing ray markup', () => {
    const withRay = {
      ...scene,
      objects: [...scene.objects, { id: 'r', kind: 'ray' as const, x1: 0, y1: 0, x2: 3, y2: 2 }],
    }
    const html = renderToStaticMarkup(
      <CoordinateGraphEditor scene={withRay} onChange={() => {}} allowedTools={['angle']} />,
    )
    expect(html).toContain('marker-end')
  })
})

describe('CoordinateGraphEditor angle tool hint', () => {
  it('explains the three steps when the angle tool is active', () => {
    const html = renderToStaticMarkup(
      <CoordinateGraphEditor scene={scene} onChange={() => {}} allowedTools={['angle']} />,
    )
    expect(html).toContain('Scheitelpunkt antippen')
  })
})
