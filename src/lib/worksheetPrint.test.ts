import { describe, expect, it } from 'vitest'
import { createRng } from './rng'
import {
  choicePickTask,
  coordinateClickTask,
  coordinateDrawTask,
  paramSliderTask,
  visualTask,
} from '../curriculum/taskHelpers'
import { emptyCoordinateScene } from './coordinateScene'
import { generateLinearFunctionSvg } from './geometrySvg'
import { worksheetPrintExtras } from './worksheetPrint'
import { math8GraphicReviews } from '../curriculum/graphicReviewTopics'

describe('worksheetPrintExtras', () => {
  it('passes through visualContent for static diagram tasks', () => {
    const svg = '<svg aria-label="fig"><circle r="2"/></svg>'
    const extras = worksheetPrintExtras(
      visualTask({
        question: 'Fläche?',
        answerKind: 'integer',
        value: 12,
        solution: '12',
        explanation: 'a·b',
        visualContent: svg,
        unit: 'cm²',
      }),
    )
    expect(extras.visualHtml).toBe(svg)
    expect(extras.answerBlank).toContain('__________')
    expect(extras.answerBlank).toContain('cm²')
  })

  it('keeps coordinateClick visualContent and adds coordinate blank', () => {
    const svg = generateLinearFunctionSvg({ m: 2, n: -4 })
    const extras = worksheetPrintExtras(
      coordinateClickTask({
        question: 'Tippe die Nullstelle.',
        x: 2,
        y: 0,
        solution: '(2|0)',
        explanation: 'x=2',
        visualContent: svg,
      }),
    )
    expect(extras.visualHtml).toContain('<svg')
    expect(extras.visualHtml).toBe(svg)
    expect(extras.answerBlank).toBe('(______|______)')
    expect(extras.paperHint).toMatch(/Koordinatensystem|Koordinaten|Markiere/i)
  })

  it('renders a blank grid for coordinateDraw without visualContent', () => {
    const extras = worksheetPrintExtras(
      coordinateDrawTask({
        question: 'Zeichne die Gerade durch A und B.',
        solutionScene: emptyCoordinateScene({
          xRange: [-5, 5],
          yRange: [-5, 5],
          objects: [{ id: 'l', kind: 'line', x1: -2, y1: -1, x2: 3, y2: 2 }],
        }),
        solution: 'Gerade',
        explanation: 'zwei Punkte',
        instruction: 'Werkzeug Gerade: zwei Punkte tippen.',
      }),
    )
    expect(extras.visualHtml).toMatch(/<svg[\s>]/i)
    expect(extras.visualHtml).not.toMatch(/stroke-width="2\.5"/) // blank: no drawn line
    expect(extras.paperHint).toContain('Gerade')
    expect(extras.answerBlank).toBeUndefined()
  })

  it('shows empty axes for paramSlider linear preview (no solution curve)', () => {
    const extras = worksheetPrintExtras(
      paramSliderTask({
        question: 'Stelle die Gerade f(x) = 2·x + (−1) ein.',
        params: [
          { id: 'm', label: 'm', min: -5, max: 5, step: 1, start: 0 },
          { id: 'n', label: 'n', min: -5, max: 5, step: 1, start: 0 },
        ],
        correct: { m: 2, n: -1 },
        solution: 'm = 2, n = −1',
        explanation: 'Steigung und Achsenabschnitt',
        preview: 'linear',
      }),
    )
    expect(extras.visualHtml).toMatch(/<svg[\s>]/i)
    expect(extras.answerBlank).toContain('m = ______')
    expect(extras.answerBlank).toContain('n = ______')
    expect(extras.paperHint).toBeTruthy()
  })

  it('lists choicePick options with paper checkboxes', () => {
    const extras = worksheetPrintExtras(
      choicePickTask({
        question: 'Welche Winkelart?',
        choices: ['spitz', 'stumpf', 'recht'],
        correct: 'spitz',
        solution: 'spitz',
        explanation: '< 90°',
      }),
    )
    expect(extras.options).toEqual(['spitz', 'stumpf', 'recht'])
    expect(extras.visualHtml).toBeUndefined()
  })

  it('covers freigegebene K8 grafik topics with printable visuals', () => {
    const ids = [
      'k8-lb3-steigung__grafik',
      'k8-lb3-achsenabschnitt__grafik',
      'k8-lb3-funktionswert__grafik',
    ]
    for (const id of ids) {
      const topic = math8GraphicReviews.find((t) => t.id === id)
      expect(topic, id).toBeTruthy()
      const task = topic!.generate(createRng(42))
      const extras = worksheetPrintExtras(task)
      expect(extras.visualHtml, id).toMatch(/<svg[\s>]/i)
      expect(extras.paperHint || extras.answerBlank, id).toBeTruthy()
    }
  })
})
