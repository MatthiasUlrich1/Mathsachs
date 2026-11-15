import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import {
  hasAngleAt,
  rayIntersection,
  type CoordinateScene,
  type GraphObject,
} from '../lib/coordinateScene'
import { SWS_SETS, WSW_SETS, swsConstructionTask, wswConstructionTask } from './angleConstructionTasks'
import { allConstructionStepsPass, type ConstructionStep } from './measureTaskHelpers'
import { math6NeuTopics } from './math6NeuTopics'
import type { Task } from './types'

const rad = (d: number) => (d * Math.PI) / 180
const onHalfGrid = (v: number) => Math.abs(v * 2 - Math.round(v * 2)) < 1e-9

describe('SWS / WSW parameter sets', () => {
  it('SWS: C lies at distance b and angle alpha from AB, sides 3-8 cm, C on the half grid', () => {
    expect(SWS_SETS.length).toBeGreaterThanOrEqual(3)
    for (const s of SWS_SETS) {
      expect(s.c).toBeGreaterThanOrEqual(3)
      expect(s.c).toBeLessThanOrEqual(8)
      expect(s.b).toBeGreaterThanOrEqual(3)
      expect(s.b).toBeLessThanOrEqual(8)
      expect(s.alpha).toBeGreaterThan(0)
      expect(s.alpha).toBeLessThan(180)
      expect(Math.abs(s.b * Math.cos(rad(s.alpha)) - s.C.x)).toBeLessThan(0.06)
      expect(Math.abs(s.b * Math.sin(rad(s.alpha)) - s.C.y)).toBeLessThan(0.06)
      expect(Math.hypot(s.C.x, s.C.y)).toBeCloseTo(s.b, 6)
      expect(onHalfGrid(s.C.x) && onHalfGrid(s.C.y)).toBe(true)
    }
  })

  it('WSW: alpha + beta < 180, the unique ray intersection equals C, C on the half grid', () => {
    expect(WSW_SETS.length).toBeGreaterThanOrEqual(3)
    for (const s of WSW_SETS) {
      expect(s.c).toBeGreaterThanOrEqual(3)
      expect(s.c).toBeLessThanOrEqual(8)
      expect(s.alpha + s.beta).toBeLessThan(180)
      const p = rayIntersection(
        { x1: 0, y1: 0, x2: Math.cos(rad(s.alpha)), y2: Math.sin(rad(s.alpha)) },
        { x1: s.c, y1: 0, x2: s.c - Math.cos(rad(s.beta)), y2: Math.sin(rad(s.beta)) },
      )
      expect(p).not.toBeNull()
      expect(Math.hypot(p!.x - s.C.x, p!.y - s.C.y)).toBeLessThan(0.06)
      for (const side of [Math.hypot(s.C.x, s.C.y), Math.hypot(s.C.x - s.c, s.C.y)]) {
        expect(side).toBeGreaterThanOrEqual(2.9)
        expect(side).toBeLessThanOrEqual(8.1)
      }
      expect(onHalfGrid(s.C.x) && onHalfGrid(s.C.y)).toBe(true)
    }
  })
})

type Props = { steps: ConstructionStep[]; blankScene: CoordinateScene; planFigureSvg: string }
const propsOf = (t: Task) => t.interactive!.props as unknown as Props
const solutionOf = (t: Task) => (t.sampleAnswer as { scene: CoordinateScene }).scene

const mirrorScene = (scene: CoordinateScene): CoordinateScene => ({
  ...scene,
  objects: scene.objects.map((o): GraphObject => {
    if (o.kind === 'point' && o.fixed) return o
    if (o.kind === 'point') return { ...o, y: -o.y }
    if (o.kind === 'segment' || o.kind === 'ray') return { ...o, y1: -o.y1, y2: -o.y2 }
    return o
  }),
})

describe.each([
  ['SWS', SWS_SETS.map((s) => swsConstructionTask(s))],
  ['WSW', WSW_SETS.map((s) => wswConstructionTask(s))],
])('%s construction tasks', (_name, tasks) => {
  it('solution passes every step; the blank scene passes none', () => {
    for (const t of tasks) {
      expect(t.check(t.sampleAnswer!)).toBe(true)
      const { steps, blankScene } = propsOf(t)
      expect(steps.length).toBeGreaterThanOrEqual(2)
      expect(steps.length).toBeLessThanOrEqual(5)
      expect(steps.filter((s) => s.check(blankScene)).length).toBe(0)
    }
  })

  it('the mirrored construction (below AB) also passes', () => {
    for (const t of tasks) {
      expect(allConstructionStepsPass(propsOf(t).steps, mirrorScene(solutionOf(t)))).toBe(true)
    }
  })

  it('without the angle ray(s) the construction fails', () => {
    for (const t of tasks) {
      const sol = solutionOf(t)
      const without = { ...sol, objects: sol.objects.filter((o) => o.kind !== 'ray') }
      expect(allConstructionStepsPass(propsOf(t).steps, without)).toBe(false)
    }
  })

  it('spoiler-free Planfigur with the given values; explanation states the 1 degree tolerance', () => {
    for (const t of tasks) {
      const svg = propsOf(t).planFigureSvg
      expect(svg).toContain('<svg')
      expect(svg).toContain('c = ')
      expect(svg).toContain('°')
      expect(svg).not.toContain('|')
      expect(t.explanation).toContain('1°')
    }
  })
})

describe('WSW wrong constructions', () => {
  const set = WSW_SETS[1]! // c = 7, alpha = 53, beta = 45
  const t = wswConstructionTask(set)
  const sol = solutionOf(t)
  const { steps } = propsOf(t)
  const edit = (id: string, patch: Record<string, number>): CoordinateScene => ({
    ...sol,
    objects: sol.objects.map((o) => (o.id === id ? ({ ...o, ...patch } as GraphObject) : o)),
  })

  it('alpha off by 2 degrees fails step 2', () => {
    const bad = edit('s-wa', {
      x2: 4 * Math.cos(rad(set.alpha + 2)),
      y2: 4 * Math.sin(rad(set.alpha + 2)),
    })
    expect(steps[1]!.check(bad)).toBe(false)
    expect(hasAngleAt(bad, 'A', { x: set.c, y: 0 }, set.alpha)).toBe(false)
  })

  it('legs on opposite sides never meet, so C cannot be marked', () => {
    const bad = edit('s-wb', { y2: -4 })
    expect(steps[2]!.check(bad)).toBe(true)
    expect(steps[3]!.check(bad)).toBe(false)
  })
})

describe('lb3-kongruenzsatz__neu', () => {
  it('draws SWS and WSW construction tasks that pass their own solution; SSS stays', () => {
    const topic = math6NeuTopics.find((x) => x.id === 'lb3-kongruenzsatz__neu')!
    const kinds = new Set<string>()
    for (let i = 0; i < 120; i++) {
      const task = topic.generate(createRng(1000 + i))
      if (task.interactive?.type !== 'constructionSteps') continue
      expect(task.check(task.sampleAnswer!)).toBe(true)
      kinds.add(task.dedupeKey!.split(':')[0]!)
    }
    expect([...kinds].sort()).toEqual([
      'lb3kong-konstruktion-sss',
      'lb3kong-konstruktion-sws',
      'lb3kong-konstruktion-wsw',
    ])
  })
})
