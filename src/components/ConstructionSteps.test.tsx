import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { ConstructionSteps } from './ConstructionSteps'
import { hasCircle, hasSegment, type ConstructionStep } from '../curriculum/measureTaskHelpers'
import { emptyCoordinateScene } from '../lib/coordinateScene'

// No DOM env: step progression lives in advanceConstructionStep (tested in
// measureTaskHelpers.test.ts); here only the rendered structure per mode/step.
const scene = emptyCoordinateScene({
  objects: [{ id: 'A', kind: 'point', x: 0, y: 0, label: 'A', fixed: true }],
})
const steps: ConstructionStep[] = [
  { instruction: 'Zeichne die Seite c.', allowedTools: ['segment'], check: (s) => hasSegment(s, 'A', null, 5) },
  { instruction: 'Zeichne den Kreis um A.', allowedTools: ['circle'], check: (s) => hasCircle(s, 'A', 4) },
]
const render = (stepIndex: number, extra: { allAtOnce?: boolean; disabled?: boolean } = {}) =>
  renderToStaticMarkup(
    <ConstructionSteps
      planFigureSvg='<svg width="100" height="50"><text>c = 5 cm</text></svg>'
      steps={steps}
      value={{ kind: 'constructionSteps', scene, stepIndex }}
      onChange={() => {}}
      {...extra}
    />,
  )

describe('ConstructionSteps', () => {
  it('guided: Planfigur, "Schritt 1 von 2", only the current step and its tools', () => {
    const html = render(0)
    expect(html).toContain('Planfigur (nicht maßstabsgetreu)')
    expect(html).toContain('viewBox="0 0 100 50"')
    expect(html).toContain('Schritt 1 von 2')
    expect(html).toContain('Zeichne die Seite c.')
    expect(html).not.toContain('Zeichne den Kreis um A.')
    expect(html).toContain('Strecke')
    expect(html).not.toContain('Zirkel')
    expect(html).toContain('Schritt prüfen')
  })

  it('guided: second step shows its own task and tools', () => {
    const html = render(1)
    expect(html).toContain('Schritt 2 von 2')
    expect(html).toContain('Zeichne den Kreis um A.')
    expect(html).toContain('Zirkel')
    expect(html).not.toContain('>Strecke<')
  })

  it('guided: all done hides the check button', () => {
    const html = render(2)
    expect(html).toContain('Alle 2 Schritte geschafft')
    expect(html).not.toContain('Schritt prüfen')
  })

  it('exam (all at once): every step listed, tools of all steps, no step check', () => {
    const html = render(0, { allAtOnce: true })
    expect(html).toContain('data-testid="step-list"')
    expect(html).toContain('Zeichne die Seite c.')
    expect(html).toContain('Zeichne den Kreis um A.')
    expect(html).toContain('Zirkel')
    expect(html).toContain('Strecke')
    expect(html).not.toContain('Schritt prüfen')
    expect(html).not.toContain('Schritt 1 von')
  })

  it('disabled: no check button', () => {
    expect(render(0, { disabled: true })).not.toContain('Schritt prüfen')
  })
})
