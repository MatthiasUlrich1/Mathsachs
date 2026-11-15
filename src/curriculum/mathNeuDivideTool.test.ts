/**
 * Neu-Themen: gesperrte __neu-Themen nutzen das interaktive Teilwerkzeug (divideToolTask).
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { buildUniqueTaskRound } from './uniqueRound'
import { math5NeuTopics } from './math5NeuTopics'
import { math6NeuTopics } from './math6NeuTopics'
import type { Task, Topic } from './types'

const TOPIC_IDS = ['lb2-anteil-bruch__neu', 'lb1-sachaufgabe-bruch__neu']
const ALL: Topic[] = [...math5NeuTopics, ...math6NeuTopics]
const topicOf = (id: string): Topic => {
  const t = ALL.find((x) => x.id === id)
  if (!t) throw new Error(`Thema ${id} nicht gefunden`)
  return t
}

/** Anzahl der Teile (Lösungsweg) und Anteil pro Kind dürfen nirgends vorab stehen. */
const spoilers = (task: Task): string[] => {
  const hits: string[] = []
  if (/\b\d+\s+(gleich\s+große\s+)?(Teile|Stücke)\b/i.test(task.question)) hits.push('Anzahl der Teile in der Frage')
  if (/(Viertel|Achtel|Drittel|Fünftel|Sechstel|Zehntel|Zwölftel)/.test(task.question)) hits.push('Bruchname in der Frage')
  const share = /(\d+\/\d+)/.exec(task.solution)?.[1]
  if (share && task.question.includes(share)) hits.push(`Anteil ${share} in der Frage`)
  if (/"(partsPerWhole|assignment|selected)"/.test(JSON.stringify(task.interactive!.props))) hits.push('Lösung in den Props')
  return hits
}

const SEEDS = Array.from({ length: 25 }, (_, i) => i * 7 + 3)
const divideTasks = (topic: Topic): Task[] => {
  const out: Task[] = []
  for (const seed of SEEDS) {
    const rng = createRng(seed)
    for (let i = 0; i < 10; i++) {
      const t = topic.generate(rng)
      if (t.interactive?.type === 'divideTool') out.push(t)
    }
  }
  return out
}

describe('Neu-Themen Teilwerkzeug', () => {
  it.each(TOPIC_IDS)('%s: bleibt gesperrt und neu', (id) => {
    expect(topicOf(id).released).toBe(false)
    expect(topicOf(id).neu).toBe(true)
  })

  it.each(TOPIC_IDS)('%s: Aufgaben mit dedupeKey, Erklärung, lösbarer sampleAnswer und ohne Spoiler', (id) => {
    const tasks = divideTasks(topicOf(id))
    expect(tasks.length, id).toBeGreaterThan(0)
    const keys = new Set<string>()
    for (const t of tasks) {
      const { count, persons } = t.interactive!.props
      expect(t.check(t.sampleAnswer), t.question).toBe(true)
      expect(t.check({ kind: 'divideTool', partsPerWhole: 1, assignment: new Array(count).fill(null) }), t.question).toBe(false)
      expect(t.dedupeKey?.trim(), t.question).toBeTruthy()
      keys.add(t.dedupeKey!)
      expect(t.explanation.trim().length).toBeGreaterThan(80)
      expect(t.question).toContain(`${persons} Kinder`)
      expect(spoilers(t), t.question).toEqual([])
    }
    expect(keys.size, id).toBeGreaterThanOrEqual(3)
  })

  it('Fragen sind in Papierform sinnvoll: kein Bildschirm-Hinweis (Tippen, Knopf, Regler)', () => {
    for (const id of TOPIC_IDS) {
      for (const t of divideTasks(topicOf(id))) expect(t.question, t.question).not.toMatch(/tippe|klick|knopf|\+|−|regler/i)
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
  const sample = divideTasks(topicOf('lb2-anteil-bruch__neu'))[0]!
  it('erkennt verratene Teile-Anzahl, Anteil und Lösung in den Props', () => {
    expect(spoilers(sample)).toEqual([])
    const persons = sample.interactive!.props.persons
    expect(spoilers({ ...sample, question: `${sample.question} Schneide in ${persons} gleich große Teile.` })).toContain(
      'Anzahl der Teile in der Frage',
    )
    expect(spoilers({ ...sample, question: `${sample.question} Dabei sind 8 Stücke nötig.` })).toContain(
      'Anzahl der Teile in der Frage',
    )
    expect(spoilers({ ...sample, question: `${sample.question} Du brauchst Achtel.` })).toContain('Bruchname in der Frage')
    const share = /(\d+\/\d+)/.exec(sample.solution)![1]!
    expect(spoilers({ ...sample, question: `${sample.question} Ergebnis ${share}.` }).length).toBeGreaterThan(0)
    const leaked = { ...sample.interactive!.props, partsPerWhole: 4 }
    expect(spoilers({ ...sample, interactive: { ...sample.interactive!, props: leaked } }).length).toBeGreaterThan(0)
  })
})
