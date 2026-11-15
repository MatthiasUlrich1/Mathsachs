/**
 * Neu-Themen: gesperrte __neu-Themen nutzen die interaktive Bruchwand (fractionWallTask).
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { buildUniqueTaskRound } from './uniqueRound'
import { math5NeuTopics } from './math5NeuTopics'
import { math6NeuTopics } from './math6NeuTopics'
import type { Task, Topic } from './types'

const TOPIC_IDS = ['lb2-erweitern__neu', 'lb1-erweitern__neu', 'lb1-vergleichen__neu']
const ALL: Topic[] = [...math5NeuTopics, ...math6NeuTopics]
const topicOf = (id: string): Topic => {
  const t = ALL.find((x) => x.id === id)
  if (!t) throw new Error(`Thema ${id} nicht gefunden`)
  return t
}

/** Gesuchte Brüche (equivalent-Lösung "2/4, 4/8") und ihre Lauflängen dürfen nirgends vorab stehen. */
const spoilers = (task: Task): string[] => {
  const fractions = task.solution.split(', ').map((s) => s.trim())
  const props = JSON.stringify(task.interactive!.props)
  const hits = fractions.filter((f) => task.question.includes(f) || props.includes(f))
  // Keine Lösungs-Lauflängen in den Props: weder "count" noch "selected".
  if (/"(count|selected)"/.test(props)) hits.push('props enthalten Lösungs-Lauf')
  return hits
}

const SEEDS = Array.from({ length: 20 }, (_, i) => i * 7 + 3)
const wallTasks = (topic: Topic): Task[] => {
  const out: Task[] = []
  for (const seed of SEEDS) {
    const rng = createRng(seed)
    for (let i = 0; i < 8; i++) {
      const t = topic.generate(rng)
      if (t.interactive?.type === 'fractionWall') out.push(t)
    }
  }
  return out
}

describe('Neu-Themen Bruchwand', () => {
  it.each(TOPIC_IDS)('%s: bleibt gesperrt und neu', (id) => {
    expect(topicOf(id).released).toBe(false)
    expect(topicOf(id).neu).toBe(true)
  })

  it.each(TOPIC_IDS)('%s: Bruchwand-Aufgaben mit dedupeKey, Erklärung und lösbarer sampleAnswer', (id) => {
    const tasks = wallTasks(topicOf(id))
    expect(tasks.length, id).toBeGreaterThan(0)
    for (const t of tasks) {
      expect(t.check(t.sampleAnswer), t.question).toBe(true)
      expect(t.check({ kind: 'fractionWall', selected: [] }), t.question).toBe(false)
      expect(t.dedupeKey?.trim(), t.question).toBeTruthy()
      expect(t.explanation.trim().length).toBeGreaterThan(40)
      // Kein Spoiler (equivalent): die gesuchten Brüche stehen weder in der Frage noch in der Konfiguration.
      // Bei compare nennt die Frage beide Brüche zwangsläufig; die Entscheidung bleibt offen.
      if (t.interactive!.props.mode !== 'equivalent') continue
      expect(spoilers(t), t.question).toEqual([])
    }
  })

  it('lb1-vergleichen__neu: Modus compare; lb2/lb1-erweitern__neu: Modus equivalent', () => {
    for (const t of wallTasks(topicOf('lb1-vergleichen__neu'))) expect(t.interactive!.props.mode).toBe('compare')
    for (const id of ['lb2-erweitern__neu', 'lb1-erweitern__neu']) {
      for (const t of wallTasks(topicOf(id))) expect(t.interactive!.props.mode).toBe('equivalent')
    }
  })

  it.each(TOPIC_IDS)('%s: Rundenlänge 10 bei genügend großem Pool', (id) => {
    for (const seed of [1, 42, 999]) {
      const round = buildUniqueTaskRound(topicOf(id).generate, createRng(seed), 10, 400)
      expect(round.length, `${id} seed=${seed}`).toBe(10)
    }
  })
})

describe('Spoiler-Prüfung Negativkontrolle', () => {
  const sample = wallTasks(topicOf('lb2-erweitern__neu'))[0]!
  it('erkennt eine verratene Lösung in Frage und Props', () => {
    const first = sample.solution.split(', ')[0]!
    expect(spoilers(sample)).toEqual([])
    expect(spoilers({ ...sample, question: `${sample.question} Tipp: ${first}` })).toContain(first)
    const props = { ...sample.interactive!.props, hint: first }
    expect(spoilers({ ...sample, interactive: { ...sample.interactive!, props } })).toContain(first)
    const leaked = { ...sample.interactive!.props, selected: [{ row: 4, count: 2 }] }
    expect(spoilers({ ...sample, interactive: { ...sample.interactive!, props: leaked } }).length).toBeGreaterThan(0)
  })
})
