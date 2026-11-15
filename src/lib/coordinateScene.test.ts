import { describe, expect, it } from 'vitest'
import {
  emptyCoordinateScene,
  circleArcPath,
  generateCoordinateSceneSvg,
  hasCircle,
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

describe('circle objects', () => {
  const scene = emptyCoordinateScene({
    xRange: [-6, 6],
    yRange: [-6, 6],
    objects: [
      { id: 'A', kind: 'point', x: -2, y: 0, label: 'A', fixed: true },
      { id: 'c1', kind: 'circle', cx: -2, cy: 0, r: 3 },
    ],
  })

  it('hasCircle finds a circle by point id or coordinates within tolerance', () => {
    expect(hasCircle(scene, 'A', 3)).toBe(true)
    expect(hasCircle(scene, 'A', 3.1)).toBe(true)
    expect(hasCircle(scene, 'A', 3.4)).toBe(false)
    expect(hasCircle(scene, { x: -2, y: 0 }, 3)).toBe(true)
    expect(hasCircle(scene, { x: 2, y: 0 }, 3)).toBe(false)
    expect(hasCircle(scene, 'unknown', 3)).toBe(false)
  })

  it('renders full circles and arcs as SVG paths', () => {
    const svg = generateCoordinateSceneSvg({
      ...scene,
      objects: [
        ...scene.objects,
        { id: 'a1', kind: 'circle', cx: 0, cy: 0, r: 2, arc: [0, 90] },
      ],
    })
    expect(svg.match(/<path d="M/g)?.length).toBe(2)
    expect(svg).toContain(' A ')
  })

  it('circleArcPath: arc over 180 degrees uses the large-arc flag', () => {
    const toSvg = (x: number, y: number): [number, number] => [x * 10, -y * 10]
    expect(circleArcPath({ cx: 0, cy: 0, r: 1, arc: [0, 90] }, toSvg, 10)).toBe(
      'M 10 0 A 10 10 0 0 0 0 -10',
    )
    expect(circleArcPath({ cx: 0, cy: 0, r: 1, arc: [0, 270] }, toSvg, 10)).toContain('10 10 0 1 0')
  })

  it('scenesMatch compares circles by center and radius', () => {
    const mk = (r: number, cx = 0) =>
      emptyCoordinateScene({ objects: [{ id: 'c', kind: 'circle', cx, cy: 0, r }] })
    expect(scenesMatch(mk(3), mk(3.1))).toBe(true)
    expect(scenesMatch(mk(3), mk(4))).toBe(false)
    expect(scenesMatch(mk(3, 2), mk(3))).toBe(false)
    expect(scenesMatch(emptyCoordinateScene(), mk(3))).toBe(false)
  })
})
