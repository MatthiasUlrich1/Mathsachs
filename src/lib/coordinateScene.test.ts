import { describe, expect, it } from 'vitest'
import {
  emptyCoordinateScene,
  generateCoordinateSceneSvg,
  sameLine,
  scenesMatch,
  snapCoord,
} from './coordinateScene'
import { coordinateDrawTask } from '../curriculum/taskHelpers'

describe('coordinateScene', () => {
  it('snaps coords', () => {
    expect(snapCoord(1.24, 'half')).toBe(1)
    expect(snapCoord(1.26, 'half')).toBe(1.5)
    expect(snapCoord(1.4, 'integer')).toBe(1)
    expect(snapCoord(1.4, 'off')).toBe(1.4)
  })

  it('matches identical lines regardless of direction', () => {
    expect(
      sameLine(
        { x1: 0, y1: 0, x2: 2, y2: 2 },
        { x1: 1, y1: 1, x2: -1, y2: -1 },
      ),
    ).toBe(true)
    expect(
      sameLine(
        { x1: 0, y1: 0, x2: 2, y2: 2 },
        { x1: 0, y1: 0, x2: 2, y2: 1 },
      ),
    ).toBe(false)
  })

  it('renders scene SVG with a line', () => {
    const scene = emptyCoordinateScene({
      objects: [{ id: '1', kind: 'line', x1: -2, y1: -1, x2: 3, y2: 2 }],
    })
    const svg = generateCoordinateSceneSvg(scene)
    expect(svg).toContain('<svg')
    expect(svg).toContain('<line')
  })

  it('coordinateDrawTask accepts matching student scene', () => {
    const solutionScene = emptyCoordinateScene({
      objects: [
        { id: 'l', kind: 'line', x1: 0, y1: 1, x2: 2, y2: 3 },
        { id: 'p', kind: 'point', x: 1, y: 2 },
      ],
    })
    const task = coordinateDrawTask({
      question: 'Zeichne…',
      solutionScene,
      solution: 'Gerade und Punkt',
      explanation: 'passt',
    })
    expect(task.check(task.sampleAnswer)).toBe(true)
    expect(
      task.check({
        kind: 'coordinateDraw',
        scene: emptyCoordinateScene({
          objects: [
            { id: 'a', kind: 'line', x1: -1, y1: 0, x2: 1, y2: 2 },
            { id: 'b', kind: 'point', x: 1, y: 2 },
          ],
        }),
      }),
    ).toBe(true)
    expect(
      scenesMatch(
        emptyCoordinateScene({ objects: [] }),
        solutionScene,
      ),
    ).toBe(false)
  })
})
