/**
 * Neu-Themen Winkel/Strecken/Konstruktion: gesperrte __neu-Themen nutzen die Messinstrumente
 * (Geodreieck, Lineal, Zirkel, geführte Konstruktion) statt Schieberegler.
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { formatDe } from '../lib/num'
import { buildUniqueTaskRound } from './uniqueRound'
import { math5NeuTopics } from './math5NeuTopics'
import { math6NeuTopics } from './math6NeuTopics'
import { math7NeuTopics } from './math7NeuTopics'
import type { Task, Topic } from './types'

type InteractiveType = 'angleProtractor' | 'rulerMeasure' | 'coordinateDraw' | 'constructionSteps'

interface Switched {
  id: string
  /** Interaktionsarten, die das Thema nach der Umstellung enthalten muss. */
  expect: InteractiveType[]
  /** Aus diesem Thema muss der Winkel-Schieberegler verschwunden sein. */
  noSlider?: boolean
}

const SWITCHED: Switched[] = [
  { id: 'lb3-winkelarten__neu', expect: ['angleProtractor'], noSlider: true },
  { id: 'lb3-winkel-ergaenzung__neu', expect: ['angleProtractor'], noSlider: true },
  { id: 'lb3-winkel-dreieck__neu', expect: ['angleProtractor'], noSlider: true },
  { id: 'lb3-winkel-viereck__neu', expect: ['angleProtractor'], noSlider: true },
  { id: 'k7-lb1-nebenwinkel__neu', expect: ['angleProtractor'], noSlider: true },
  { id: 'k7-lb1-scheitelwinkel__neu', expect: ['angleProtractor'], noSlider: true },
  { id: 'k7-lb1-winkelsumme-vieleck__neu', expect: ['angleProtractor'], noSlider: true },
  { id: 'k7-lb1-basiswinkel__neu', expect: ['angleProtractor'], noSlider: true },
  { id: 'lb3-strecken-laenge__neu', expect: ['rulerMeasure'] },
  { id: 'lb3-strecken-mittelpunkt__neu', expect: ['rulerMeasure'] },
  { id: 'lb3-strecken-bezeichnung__neu', expect: ['rulerMeasure'] },
  { id: 'k7-lb1-mittelsenkrechte-schritte__neu', expect: ['coordinateDraw', 'constructionSteps'] },
  { id: 'lb3-kongruenzsatz__neu', expect: ['constructionSteps'] },
]

const ALL: Topic[] = [...math5NeuTopics, ...math6NeuTopics, ...math7NeuTopics]
const topicOf = (id: string): Topic => {
  const t = ALL.find((x) => x.id === id)
  if (!t) throw new Error(`Thema ${id} nicht gefunden`)
  return t
}

const SEEDS = Array.from({ length: 20 }, (_, i) => i * 7 + 3)
/** Mehr Ziehungen als Seeds, damit auch Themen mit vielen Varianten jede Interaktion zeigen. */
const DRAWS_PER_SEED = 6
const NEW_TYPES: InteractiveType[] = ['angleProtractor', 'rulerMeasure', 'coordinateDraw', 'constructionSteps']

const tasksOf = (topic: Topic): Task[] => {
  const out: Task[] = []
  for (const seed of SEEDS) {
    const rng = createRng(seed)
    for (let i = 0; i < DRAWS_PER_SEED; i++) out.push(topic.generate(rng))
  }
  return out
}

const isNew = (t: Task) => NEW_TYPES.includes(t.interactive?.type as InteractiveType)

describe('Neu-Themen Messinstrumente', () => {
  it.each(SWITCHED)('$id: bleibt gesperrt und neu', ({ id }) => {
    const t = topicOf(id)
    expect(t.released).toBe(false)
    expect(t.neu).toBe(true)
  })

  it.each(SWITCHED)('$id: 20 Seeds liefern die neuen Interaktionsarten', ({ id, expect: wanted }) => {
    const types = new Set(tasksOf(topicOf(id)).map((t) => t.interactive?.type))
    for (const type of wanted) expect(types.has(type), `${id}: ${type} fehlt`).toBe(true)
  })

  it.each(SWITCHED.filter((s) => s.noSlider))('$id: kein Gradzahl-Schieberegler mehr', ({ id }) => {
    for (const t of tasksOf(topicOf(id))) expect(t.interactive?.type).not.toBe('paramSlider')
  })

  it.each(SWITCHED)('$id: jede neue Aufgabe hat eine eigene Erklärung, dedupeKey und eine lösbare sampleAnswer', ({ id }) => {
    const tasks = tasksOf(topicOf(id)).filter(isNew)
    expect(tasks.length).toBeGreaterThan(0)
    for (const t of tasks) {
      expect(t.check(t.sampleAnswer), `${id}: sampleAnswer besteht check nicht: ${t.question}`).toBe(true)
      expect(t.dedupeKey?.trim(), `${id}: dedupeKey fehlt: ${t.question}`).toBeTruthy()
      expect(t.explanation.trim().length).toBeGreaterThan(40)
    }
  })

  it.each(SWITCHED)('$id: Rundenlänge 10 bei genügend großem Pool', ({ id }) => {
    const t = topicOf(id)
    for (const seed of [1, 42, 999]) {
      const round = buildUniqueTaskRound(t.generate, createRng(seed), 10, 400)
      expect(round.length, `${id} seed=${seed}`).toBe(10)
    }
  })

  it('Mess-Aufgaben verraten den Zielwert nicht in Figur oder Frage', () => {
    let measured = 0
    for (const { id } of SWITCHED) {
      for (const t of tasksOf(topicOf(id))) {
        const props = t.interactive?.props as { mode?: string; angle?: number; lengthCm?: number } | undefined
        if (!props || props.mode !== 'measure') continue
        measured++
        if (t.interactive?.type === 'angleProtractor') {
          expect(t.visualContent ?? '', id).not.toContain(`${props.angle}°`)
        }
        if (t.interactive?.type === 'rulerMeasure') {
          expect(t.visualContent ?? '', id).not.toContain(`${props.lengthCm} cm`)
          expect(t.question, id).not.toContain(`${formatDe(props.lengthCm!)} cm`)
        }
      }
    }
    expect(measured).toBeGreaterThan(0)
  })

  it('Zeichen-Aufgaben starten mit einem Winkel/einer Länge, die nicht der Zielwert ist', () => {
    let drawn = 0
    for (const { id } of SWITCHED) {
      for (const t of tasksOf(topicOf(id))) {
        const props = t.interactive?.props as
          | { mode?: string; angle?: number; initialDegrees?: number | null; lengthCm?: number; initialLength?: number | null }
          | undefined
        if (!props || props.mode !== 'draw') continue
        drawn++
        if (t.interactive?.type === 'angleProtractor') expect(props.initialDegrees).not.toBe(props.angle)
        if (t.interactive?.type === 'rulerMeasure') expect(props.initialLength).not.toBe(props.lengthCm)
      }
    }
    expect(drawn).toBeGreaterThan(0)
  })

  it('falsche oder unberührte Antworten bestehen nicht', () => {
    for (const { id } of SWITCHED) {
      for (const t of tasksOf(topicOf(id)).filter(isNew)) {
        const props = t.interactive!.props as Record<string, unknown>
        if (t.interactive!.type === 'angleProtractor') {
          const angle = props.angle as number
          const off = angle > 100 ? angle - 10 : angle + 10
          expect(t.check({ kind: 'angleProtractor', degrees: off, touched: true }), id).toBe(false)
          expect(t.check({ kind: 'angleProtractor', degrees: angle, touched: false }), id).toBe(false)
        }
        if (t.interactive!.type === 'rulerMeasure') {
          const len = props.lengthCm as number
          expect(t.check({ kind: 'rulerMeasure', length: len + 1 > 12 ? len - 1 : len + 1, touched: true }), id).toBe(false)
          expect(t.check({ kind: 'rulerMeasure', length: len, touched: false }), id).toBe(false)
        }
        if (t.interactive!.type === 'coordinateDraw') {
          expect(t.check({ kind: 'coordinateDraw', scene: props.blankScene as never }), id).toBe(false)
        }
        if (t.interactive!.type === 'constructionSteps') {
          expect(t.check({ kind: 'constructionSteps', scene: props.blankScene as never, stepIndex: 0 }), id).toBe(false)
        }
      }
    }
  })

  it('Konstruktions-Aufgaben: Planfigur ohne Maßstab-Anspruch, alle Schritte der Lösung bestehen', () => {
    for (const id of ['k7-lb1-mittelsenkrechte-schritte__neu', 'lb3-kongruenzsatz__neu']) {
      const steps = tasksOf(topicOf(id)).filter((t) => t.interactive?.type === 'constructionSteps')
      expect(steps.length).toBeGreaterThan(0)
      for (const t of steps) {
        const props = t.interactive!.props as { planFigureSvg: string; steps: unknown[] }
        expect(props.planFigureSvg).toContain('<svg')
        expect(props.steps.length).toBeGreaterThanOrEqual(2)
        expect(props.steps.length).toBeLessThanOrEqual(5)
        expect(t.check(t.sampleAnswer)).toBe(true)
      }
    }
  })
})
