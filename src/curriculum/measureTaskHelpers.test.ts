import { describe, expect, it } from 'vitest'
import {
  advanceConstructionStep,
  allConstructionStepsPass,
  angleProtractorTask,
  compassArcTask,
  constructionStepsTask,
  hasCircle,
  hasPointNear,
  hasSegment,
  rulerMeasureTask,
  type ConstructionStep,
} from './measureTaskHelpers'
import { emptyCoordinateScene, type CoordinateScene, type GraphObject } from '../lib/coordinateScene'
import { examAnswerAttempted } from '../exam/examAnswerAttempted'
import { emptyInput, type UserInput } from './types'
import { drawStartDegrees } from '../lib/protractorGeometry'
import { drawStartLength } from '../lib/rulerGeometry'

const measure = () =>
  angleProtractorTask({
    question: 'Miss den Winkel.',
    mode: 'measure',
    angle: 47,
    solution: '47°',
    explanation: 'Ablesen an der Skala.',
  })

describe('angleProtractorTask', () => {
  it('accepts the angle within the default tolerance of 1 degree', () => {
    const t = measure()
    expect(t.check({ kind: 'angleProtractor', degrees: 47, touched: true })).toBe(true)
    expect(t.check({ kind: 'angleProtractor', degrees: 48, touched: true })).toBe(true)
    expect(t.check({ kind: 'angleProtractor', degrees: 46, touched: true })).toBe(true)
    expect(t.check({ kind: 'angleProtractor', degrees: 49, touched: true })).toBe(false)
  })

  it('honours a custom tolerance', () => {
    const t = angleProtractorTask({
      question: 'q',
      mode: 'measure',
      angle: 47,
      tolerance: 3,
      solution: 's',
      explanation: 'e',
    })
    expect(t.check({ kind: 'angleProtractor', degrees: 50, touched: true })).toBe(true)
    expect(t.check({ kind: 'angleProtractor', degrees: 51, touched: true })).toBe(false)
  })

  it('rejects an untouched instrument and missing degrees', () => {
    const t = measure()
    expect(t.check({ kind: 'angleProtractor', degrees: 47, touched: false })).toBe(false)
    expect(t.check({ kind: 'angleProtractor', degrees: null, touched: true })).toBe(false)
  })

  it('accepts a typed value (exam/worksheet) with the same tolerance', () => {
    const t = measure()
    expect(t.check({ kind: 'value', value: '47' })).toBe(true)
    expect(t.check({ kind: 'value', value: '48,0' })).toBe(true)
    expect(t.check({ kind: 'value', value: '50' })).toBe(false)
    expect(t.check({ kind: 'value', value: '' })).toBe(false)
    expect(t.check({ kind: 'value', value: 'abc' })).toBe(false)
  })

  it('has a sampleAnswer that passes check', () => {
    for (const mode of ['measure', 'draw'] as const) {
      const t = angleProtractorTask({ question: 'q', mode, angle: 120, solution: 's', explanation: 'e' })
      expect(t.check(t.sampleAnswer)).toBe(true)
    }
  })

  it('does not spoil the angle in the visual or the question', () => {
    const t = measure()
    expect(t.visualContent ?? '').not.toContain('47°')
    expect(t.question).not.toContain('47')
  })

  it('configures the interactive and a spoiler-free draw start', () => {
    const t = measure()
    expect(t.interactive?.type).toBe('angleProtractor')
    expect(t.interactive?.props).toMatchObject({ mode: 'measure', angle: 47, startAngle: 0 })
    for (let angle = 1; angle <= 179; angle++) {
      const start = drawStartDegrees(angle)
      expect(Math.abs(start - angle)).toBeGreaterThanOrEqual(20)
      expect(start).toBeGreaterThanOrEqual(1)
      expect(start).toBeLessThanOrEqual(179)
    }
    const draw = angleProtractorTask({ question: 'q', mode: 'draw', angle: 47, solution: 's', explanation: 'e' })
    expect(draw.interactive?.props.initialDegrees).not.toBe(47)
  })

  it('rejects angles outside 1..179', () => {
    const bad = (angle: number) =>
      angleProtractorTask({ question: 'q', mode: 'measure', angle, solution: 's', explanation: 'e' })
    expect(() => bad(0)).toThrow()
    expect(() => bad(180)).toThrow()
    expect(() => bad(47.5)).toThrow()
  })

  it('counts only a touched instrument as attempted in an exam', () => {
    const t = measure()
    expect(examAnswerAttempted(t, emptyInput('angleProtractor'))).toBe(false)
    expect(examAnswerAttempted(t, { kind: 'angleProtractor', degrees: 47, touched: false })).toBe(false)
    expect(examAnswerAttempted(t, { kind: 'angleProtractor', degrees: null, touched: true })).toBe(false)
    expect(examAnswerAttempted(t, { kind: 'angleProtractor', degrees: 47, touched: true })).toBe(true)
  })
})

describe('rulerMeasureTask', () => {
  const ruler = () =>
    rulerMeasureTask({
      question: 'Miss die Strecke.',
      mode: 'measure',
      lengthCm: 4.3,
      solution: '4,3 cm',
      explanation: 'Am Lineal ablesen.',
    })

  it('accepts the length within the default tolerance of 0.1 cm', () => {
    const t = ruler()
    expect(t.check({ kind: 'rulerMeasure', length: 4.3, touched: true })).toBe(true)
    expect(t.check({ kind: 'rulerMeasure', length: 4.4, touched: true })).toBe(true)
    expect(t.check({ kind: 'rulerMeasure', length: 4.2, touched: true })).toBe(true)
    expect(t.check({ kind: 'rulerMeasure', length: 4.5, touched: true })).toBe(false)
    expect(t.check({ kind: 'rulerMeasure', length: 4.1, touched: true })).toBe(false)
  })

  it('honours a custom tolerance', () => {
    const t = rulerMeasureTask({
      question: 'q',
      mode: 'measure',
      lengthCm: 4.3,
      tolerance: 0.3,
      solution: 's',
      explanation: 'e',
    })
    expect(t.check({ kind: 'rulerMeasure', length: 4.6, touched: true })).toBe(true)
    expect(t.check({ kind: 'rulerMeasure', length: 4.7, touched: true })).toBe(false)
  })

  it('rejects an untouched instrument and missing length', () => {
    const t = ruler()
    expect(t.check({ kind: 'rulerMeasure', length: 4.3, touched: false })).toBe(false)
    expect(t.check({ kind: 'rulerMeasure', length: null, touched: true })).toBe(false)
  })

  it('accepts a typed value with a decimal comma (exam/worksheet)', () => {
    const t = ruler()
    expect(t.check({ kind: 'value', value: '4,3' })).toBe(true)
    expect(t.check({ kind: 'value', value: '4.3' })).toBe(true)
    expect(t.check({ kind: 'value', value: '4,4' })).toBe(true)
    expect(t.check({ kind: 'value', value: '4,6' })).toBe(false)
    expect(t.check({ kind: 'value', value: '' })).toBe(false)
    expect(t.check({ kind: 'value', value: 'abc' })).toBe(false)
  })

  it('has a sampleAnswer that passes check', () => {
    for (const mode of ['measure', 'draw'] as const) {
      const t = rulerMeasureTask({ question: 'q', mode, lengthCm: 7.8, angle: -10, solution: 's', explanation: 'e' })
      expect(t.check(t.sampleAnswer)).toBe(true)
    }
  })

  it('does not spoil the length in the visual or the question', () => {
    const t = ruler()
    expect(t.visualContent ?? '').not.toContain('4,3')
    expect(t.visualContent ?? '').not.toContain('4.3')
    expect(t.question).not.toContain('4')
  })

  it('configures the interactive and a spoiler-free draw start', () => {
    const t = ruler()
    expect(t.interactive?.type).toBe('rulerMeasure')
    expect(t.interactive?.props).toMatchObject({ mode: 'measure', lengthCm: 4.3, angle: 0, unitPx: 40 })
    const draw = rulerMeasureTask({ question: 'q', mode: 'draw', lengthCm: 4.3, solution: 's', explanation: 'e' })
    expect(draw.interactive?.props.initialLength).toBe(drawStartLength(4.3))
    expect(draw.interactive?.props.initialLength).not.toBe(4.3)
  })

  it('rejects lengths, angles and scales outside the allowed range', () => {
    const make = (extra: object) => () =>
      rulerMeasureTask({ question: 'q', mode: 'measure', lengthCm: 4.3, solution: 's', explanation: 'e', ...extra })
    expect(make({ lengthCm: 0.4 })).toThrow()
    expect(make({ lengthCm: 12.1 })).toThrow()
    expect(make({ lengthCm: 4.33 })).toThrow()
    expect(make({ angle: 20 })).toThrow()
    expect(make({ unitPx: 60 })).toThrow()
    expect(make({ lengthCm: 0.5 })).not.toThrow()
    expect(make({ lengthCm: 12, angle: -15, unitPx: 40 })).not.toThrow()
  })

  it('counts only a touched instrument as attempted in an exam', () => {
    const t = ruler()
    expect(examAnswerAttempted(t, emptyInput('rulerMeasure'))).toBe(false)
    expect(examAnswerAttempted(t, { kind: 'rulerMeasure', length: 4.3, touched: false })).toBe(false)
    expect(examAnswerAttempted(t, { kind: 'rulerMeasure', length: null, touched: true })).toBe(false)
    expect(examAnswerAttempted(t, { kind: 'rulerMeasure', length: 4.3, touched: true })).toBe(true)
  })
})

describe('compassArcTask', () => {
  const A = { id: 'A', x: -2, y: 0, label: 'A' }
  const B = { id: 'B', x: 2, y: 0, label: 'B' }
  const scene = (circles: Array<[number, number, number]>) =>
    emptyCoordinateScene({
      objects: [
        { id: 'A', kind: 'point', x: -2, y: 0, fixed: true },
        { id: 'B', kind: 'point', x: 2, y: 0, fixed: true },
        ...circles.map(([cx, cy, r], i): GraphObject => ({ id: `c${i}`, kind: 'circle', cx, cy, r })),
      ],
    })
  const answer = (circles: Array<[number, number, number]>): UserInput => ({
    kind: 'coordinateDraw',
    scene: scene(circles),
  })

  const bisector = () =>
    compassArcTask({
      question: 'Konstruiere die Mittelsenkrechte.',
      points: [A, B],
      targets: [
        { centerId: 'A', radius: 3 },
        { centerId: 'B', radius: 3 },
      ],
      sameRadius: true,
      minRadius: 2,
      solution: 'Zwei Bögen mit gleichem Radius > |AB|/2.',
      explanation: 'Die Bögen schneiden sich auf der Mittelsenkrechten.',
    })

  it('perpendicular bisector: two arcs with the same radius above minRadius', () => {
    const t = bisector()
    expect(t.check(answer([[-2, 0, 3], [2, 0, 3]]))).toBe(true)
    expect(t.check(answer([[-2, 0, 2.5], [2, 0, 2.6]]))).toBe(true)
  })

  it('perpendicular bisector: radius too small, different radii, single arc, empty', () => {
    const t = bisector()
    expect(t.check(answer([[-2, 0, 1.9], [2, 0, 1.9]]))).toBe(false)
    expect(t.check(answer([[-2, 0, 3], [2, 0, 2]]))).toBe(false)
    expect(t.check(answer([[-2, 0, 3]]))).toBe(false)
    expect(t.check(answer([]))).toBe(false)
    expect(t.check({ kind: 'value', value: '3' })).toBe(false)
  })

  it('rejects arcs around points that are not targets', () => {
    const t = bisector()
    expect(t.check(answer([[-2, 0, 3], [2, 0, 3], [0, 4, 3]]))).toBe(false)
  })

  it('sample answer satisfies its own check and given points do not count as an attempt', () => {
    const t = bisector()
    expect(t.check(t.sampleAnswer)).toBe(true)
    const props = t.interactive!.props as { blankScene: CoordinateScene; allowedTools: string[] }
    expect(props.allowedTools).toEqual(['select', 'point', 'segment', 'circle', 'label', 'delete'])
    expect(examAnswerAttempted(t, { kind: 'coordinateDraw', scene: props.blankScene })).toBe(false)
    expect(examAnswerAttempted(t, answer([[-2, 0, 3]]))).toBe(true)
  })

  it('triangle SSS: two fixed radii around two points', () => {
    const t = compassArcTask({
      question: 'Konstruiere C mit b = 4 cm und a = 5 cm.',
      points: [A, B],
      targets: [
        { centerId: 'A', radius: 4 },
        { centerId: 'B', radius: 5 },
      ],
      solution: 'C ist der Schnittpunkt.',
      explanation: 'Kreise um A (4 cm) und B (5 cm).',
    })
    expect(t.check(answer([[-2, 0, 4], [2, 0, 5]]))).toBe(true)
    expect(t.check(answer([[-2, 0, 4.1], [2, 0, 4.9]]))).toBe(true)
    expect(t.check(answer([[-2, 0, 5], [2, 0, 4]]))).toBe(false)
    expect(t.check(answer([[-2, 0, 4]]))).toBe(false)
    expect(t.check(answer([[-2, 0, 4], [2, 0, 5], [0, 4, 1]]))).toBe(false)
    expect(t.check(t.sampleAnswer)).toBe(true)
  })

  it('same center twice needs two distinct arcs', () => {
    const t = compassArcTask({
      question: 'Zwei Kreise um A.',
      points: [A],
      targets: [
        { centerId: 'A', radius: 2 },
        { centerId: 'A', radius: 3 },
      ],
      solution: 's',
      explanation: 'e',
    })
    expect(t.check(answer([[-2, 0, 2]]))).toBe(false)
    expect(t.check(answer([[-2, 0, 2], [-2, 0, 3]]))).toBe(true)
  })

  it('throws on unknown center or inconsistent sameRadius', () => {
    expect(() =>
      compassArcTask({ question: 'q', points: [A], targets: [{ centerId: 'X', radius: 1 }], solution: 's', explanation: 'e' }),
    ).toThrow()
    expect(() =>
      compassArcTask({ question: 'q', points: [A], targets: [{ centerId: 'A', radius: 1 }], sameRadius: true, minRadius: 2, solution: 's', explanation: 'e' }),
    ).toThrow()
  })
})

describe('constructionStepsTask (SSS triangle c=5, b=4, a=3)', () => {
  const A = { x: 0, y: 0 }
  const B = { x: 5, y: 0 }
  const C = { x: 3.2, y: 2.4 } // |AC| = 4, |BC| = 3
  const start = emptyCoordinateScene({
    xRange: [-1, 7],
    yRange: [-1, 5],
    objects: [{ id: 'A', kind: 'point', x: 0, y: 0, label: 'A', fixed: true }],
  })
  const steps: ConstructionStep[] = [
    { instruction: 'Zeichne c = 5 cm von A aus.', allowedTools: ['segment', 'select'], check: (s) => hasSegment(s, 'A', B, 5) },
    { instruction: 'Kreis um A mit b = 4 cm.', allowedTools: ['circle', 'select'], check: (s) => hasCircle(s, 'A', 4) },
    { instruction: 'Kreis um B mit a = 3 cm.', allowedTools: ['circle', 'select'], check: (s) => hasCircle(s, B, 3) },
    {
      instruction: 'Markiere C und verbinde.',
      allowedTools: ['point', 'segment'],
      check: (s) => hasPointNear(s, C.x, C.y) && hasSegment(s, 'A', C, 4) && hasSegment(s, B, C, 3),
    },
  ]
  const seg = (id: string, p: { x: number; y: number }, q: { x: number; y: number }): GraphObject => ({
    id, kind: 'segment', x1: p.x, y1: p.y, x2: q.x, y2: q.y,
  })
  const circ = (id: string, c: { x: number; y: number }, r: number): GraphObject => ({
    id, kind: 'circle', cx: c.x, cy: c.y, r,
  })
  const withObjs = (...objs: GraphObject[]): CoordinateScene => ({ ...start, objects: [...start.objects, ...objs] })
  const s1 = withObjs(seg('s1', A, B))
  const s2 = withObjs(seg('s1', A, B), circ('k1', A, 4))
  const s3 = withObjs(seg('s1', A, B), circ('k1', A, 4), circ('k2', B, 3))
  const s4 = withObjs(
    seg('s1', A, B), circ('k1', A, 4), circ('k2', B, 3),
    { id: 'pc', kind: 'point', x: C.x, y: C.y }, seg('s2', A, C), seg('s3', B, C),
  )
  const task = constructionStepsTask({
    question: 'Konstruiere das Dreieck.',
    planFigureSvg: '<svg viewBox="0 0 10 10"/>',
    startScene: start,
    steps,
    solutionScene: s4,
    solution: 'Dreieck ABC',
    explanation: 'SSS',
  })

  it('correct scene passes each step in turn and advances one step at a time', () => {
    expect(steps[0]!.check(s1)).toBe(true)
    expect(steps[1]!.check(s2)).toBe(true)
    expect(steps[2]!.check(s3)).toBe(true)
    expect(steps[3]!.check(s4)).toBe(true)
    expect(advanceConstructionStep(steps, s1, 0)).toBe(1)
    expect(advanceConstructionStep(steps, s2, 1)).toBe(2)
    expect(advanceConstructionStep(steps, s3, 2)).toBe(3)
    expect(advanceConstructionStep(steps, s4, 3)).toBe(4)
    expect(advanceConstructionStep(steps, s4, 4)).toBe(4)
  })

  it('wrong length in step 1 fails and does not advance', () => {
    const wrong = withObjs(seg('s1', A, { x: 4.5, y: 0 }))
    expect(steps[0]!.check(wrong)).toBe(false)
    expect(advanceConstructionStep(steps, wrong, 0)).toBe(0)
    expect(advanceConstructionStep(steps, start, 0)).toBe(0)
  })

  it('steps cannot be skipped: a later step done early does not advance past an open step', () => {
    const skipped = withObjs(seg('s1', A, B), circ('k2', B, 3)) // step 2 (circle around A) missing
    expect(steps[2]!.check(skipped)).toBe(true)
    expect(advanceConstructionStep(steps, skipped, 1)).toBe(1)
    expect(allConstructionStepsPass(steps, skipped)).toBe(false)
  })

  it('task check needs all step checks on the final scene; sampleAnswer passes', () => {
    expect(task.check(task.sampleAnswer)).toBe(true)
    expect(task.check({ kind: 'constructionSteps', scene: s3, stepIndex: 3 })).toBe(false)
    expect(task.check({ kind: 'coordinateDraw', scene: s4 })).toBe(false)
    expect(task.interactive?.type).toBe('constructionSteps')
  })

  it('exam: only given points = not attempted; any added object = attempted', () => {
    expect(examAnswerAttempted(task, emptyInput('constructionSteps'))).toBe(false)
    expect(examAnswerAttempted(task, { kind: 'constructionSteps', scene: start, stepIndex: 0 })).toBe(false)
    expect(examAnswerAttempted(task, { kind: 'constructionSteps', scene: s1, stepIndex: 0 })).toBe(true)
  })

  it('rejects fewer than 2 or more than 5 steps', () => {
    const make = (n: number) =>
      constructionStepsTask({
        question: 'q', planFigureSvg: '<svg/>', startScene: start,
        steps: Array.from({ length: n }, () => steps[0]!), solution: 's', explanation: 'e',
      })
    expect(() => make(1)).toThrow()
    expect(() => make(6)).toThrow()
    expect(() => make(2)).not.toThrow()
  })
})
