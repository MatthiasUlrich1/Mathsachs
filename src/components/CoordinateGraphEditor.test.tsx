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
