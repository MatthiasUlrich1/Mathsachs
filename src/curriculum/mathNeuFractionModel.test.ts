/**
 * Neu-Themen Bruchrechnung: gesperrte __neu-Themen nutzen das interaktive Bruchmodell (fractionModelTask).
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { buildUniqueTaskRound } from './uniqueRound'
import { math5NeuTopics } from './math5NeuTopics'
import { math6NeuTopics } from './math6NeuTopics'
import type { Task, Topic } from './types'

const TOPIC_IDS = ['lb2-erweitern__neu', 'lb2-anteil-bruch__neu', 'lb1-kuerzen__neu']
const ALL: Topic[] = [...math5NeuTopics, ...math6NeuTopics]
const topicOf = (id: string): Topic => {
  const t = ALL.find((x) => x.id === id)
  if (!t) throw new Error(`Thema ${id} nicht gefunden`)
  return t
}

const SEEDS = Array.from({ length: 20 }, (_, i) => i * 7 + 3)
const DRAWS_PER_SEED = 6
const modelTasks = (topic: Topic): Task[] => {
  const out: Task[] = []
  for (const seed of SEEDS) {
    const rng = createRng(seed)
    for (let i = 0; i < DRAWS_PER_SEED; i++) {
      const t = topic.generate(rng)
      if (t.interactive?.type === 'fractionModel') out.push(t)
    }
  }
  return out
}

describe('Neu-Themen Bruchmodell', () => {
  it.each(TOPIC_IDS)('%s: bleibt gesperrt und neu', (id) => {
    const t = topicOf(id)
    expect(t.released).toBe(false)
    expect(t.neu).toBe(true)
  })

  it.each(TOPIC_IDS)('%s: liefert Bruchmodell-Aufgaben mit dedupeKey, Erklärung und lösbarer sampleAnswer', (id) => {
    const tasks = modelTasks(topicOf(id))
    expect(tasks.length, id).toBeGreaterThan(0)
    for (const t of tasks) {
      expect(t.check(t.sampleAnswer), t.question).toBe(true)
      expect(t.dedupeKey?.trim(), t.question).toBeTruthy()
      expect(t.explanation.trim().length).toBeGreaterThan(40)
      // Unberührtes Modell (nichts gefärbt) darf nie bestehen.
      const props = t.interactive!.props as { initialDen: number; target: { den: number } }
      expect(props.initialDen).not.toBe(props.target.den)
      expect(t.check({ kind: 'fractionModel', den: props.initialDen, shaded: [] }), t.question).toBe(false)
    }
  })

  it.each(TOPIC_IDS)('%s: Rundenlänge 10 bei genügend großem Pool', (id) => {
    for (const seed of [1, 42, 999]) {
      const round = buildUniqueTaskRound(topicOf(id).generate, createRng(seed), 10, 400)
      expect(round.length, `${id} seed=${seed}`).toBe(10)
    }
  })
})
