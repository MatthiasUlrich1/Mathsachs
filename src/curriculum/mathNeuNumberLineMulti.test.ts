/**
 * Neu-Themen: ehemalige __neu-Themen (seit E1 in ihre Parents gemergt; geprüft wird der Neu-Generator) nutzen die Zahlengerade mit mehreren Zahlen (numberLineMultiTask).
 * Klasse 5 Dezimalzahlen, Klasse 6 Brüche, Klasse 7 negative Zahlen.
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { worksheetPrintExtras } from '../lib/worksheetPrint'
import { buildUniqueTaskRound } from './uniqueRound'
import { math5NeuTopics } from './math5NeuTopics'
import { math6NeuTopics } from './math6NeuTopics'
import { math7NeuTopics } from './math7NeuTopics'
import type { Task, Topic } from './types'

const CASES: Array<{ id: string; topics: Topic[] }> = [
  { id: 'lb2-zahlenstrahl__neu', topics: math5NeuTopics },
  { id: 'lb1-vergleichen__neu', topics: math6NeuTopics },
  { id: 'k7-lb2-betrag__neu', topics: math7NeuTopics },
]
const topicOf = (c: { id: string; topics: Topic[] }): Topic => {
  const t = c.topics.find((x) => x.id === c.id)
  if (!t) throw new Error(`Thema ${c.id} nicht gefunden`)
  return t
}

const SEEDS = Array.from({ length: 40 }, (_, i) => i * 5 + 1)
const multiTasks = (topic: Topic): Task[] => {
  const out: Task[] = []
  for (const seed of SEEDS) {
    const rng = createRng(seed)
    for (let i = 0; i < 12; i++) {
      const t = topic.generate(rng)
      if (t.interactive?.type === 'numberLineMulti') out.push(t)
    }
  }
  return out
}

const labelsOf = (t: Task): string[] => (t.interactive!.props.items as Array<{ label: string }>).map((i) => i.label)

/** Reihenfolge der Antwort darf in Frage und Tablett nicht aufsteigend/absteigend vorgegeben sein. */
const spoilers = (t: Task): string[] => {
  const hits: string[] = []
  const labels = labelsOf(t)
  const values = labels.map((l) => Number(l.replace(',', '.')))
  void values
  const order = (t.interactive!.props.order as string[]).join('')
  if (order === 'abcd' || order === 'dcba') hits.push('Ablage sortiert')
  // the labels in the question: not in the solution order
  const positions = labels.map((l) => t.question.indexOf(l)).filter((p) => p >= 0)
  const sorted = [...positions].sort((a, b) => a - b)
  if (positions.length === labels.length && positions.every((p, i) => p === sorted[i])) hits.push('Frage nennt die Zahlen in Lösungsreihenfolge')
  if (/zieh|tippe|klick|knopf/i.test(t.question)) hits.push('Bildschirm-Hinweis in der Frage')
  if (/"value"/.test(JSON.stringify(t.interactive!.props))) hits.push('Lösung in den Props')
  return hits
}

describe.each(CASES)('Neu-Thema Zahlengerade $id', (c) => {
  const topic = topicOf(c)
  const tasks = multiTasks(topic)

  it('Neu-Quelle ist als Neu markiert (Thema selbst lebt im Parent, siehe mergeNeu.test)', () => {
    expect(topic.released).toBe(false)
    expect(topic.neu).toBe(true)
  })

  it('hat die Zahlengeraden-Variante mit dedupeKey, Erklärung, lösbarer sampleAnswer, Start besteht nicht, ohne Spoiler', () => {
    expect(tasks.length).toBeGreaterThan(0)
    const keys = new Set<string>()
    for (const t of tasks) {
      expect(t.check(t.sampleAnswer), t.question).toBe(true)
      expect(t.check({ kind: 'numberLineMulti', positions: {} }), t.question).toBe(false)
      expect(t.dedupeKey?.trim(), t.question).toBeTruthy()
      keys.add(t.dedupeKey!)
      expect(t.explanation.trim().length).toBeGreaterThan(80)
      expect(t.question).toMatch(/^Ordne /)
      expect(spoilers(t), t.question).toEqual([])
      // every label can be dragged: chip text fits
      for (const l of labelsOf(t)) expect(l.length).toBeLessThanOrEqual(7)
    }
    expect(keys.size).toBeGreaterThanOrEqual(2)
  })

  it('Grammatik: nie "1 Striche"', () => {
    for (const t of tasks) expect(t.explanation, t.question).not.toMatch(/\b1 Striche\b/)
  })

  it('Papierform: Zahlengerade mit Strichen und Liste der Zahlen, ohne die Zielwerte als Beschriftung', () => {
    for (const t of tasks) {
      const extras = worksheetPrintExtras(t)
      expect(extras.visualHtml).toContain('<svg')
      for (const l of labelsOf(t)) expect(extras.paperHint).toContain(l)
      const written = (extras.visualHtml!.match(/<text [^>]*>([^<]*)</g) ?? []).map((m) => m.replace(/.*>/, '').replace('<', ''))
      for (const l of labelsOf(t)) expect(written, t.question).not.toContain(l)
    }
  })

  it('Rundenlänge 10 bei genügend großem Pool', () => {
    for (const seed of [1, 42, 999]) {
      const round = buildUniqueTaskRound(topic.generate, createRng(seed), 10, 400)
      expect(round.length, `${c.id} seed=${seed}`).toBe(10)
    }
  })
})

describe('Grammatik-Negativkontrolle', () => {
  it('der Test erkennt "1 Striche" und lässt "1 Strich" durch', () => {
    expect('also 1 Striche rechts').toMatch(/\b1 Striche\b/)
    expect('also 1 Strich rechts').not.toMatch(/\b1 Striche\b/)
    expect('also 11 Striche rechts').not.toMatch(/\b1 Striche\b/)
  })
})

describe('Spoiler-Prüfung Negativkontrolle', () => {
  const t = multiTasks(topicOf(CASES[0]!))[0]!
  it('erkennt sortierte Ablage, sortierte Frage, Bildschirm-Hinweise und Werte in den Props', () => {
    expect(spoilers(t)).toEqual([])
    const sortedQuestion = `Ordne ${labelsOf(t).join('; ')} ein.`
    expect(spoilers({ ...t, question: sortedQuestion })).toContain('Frage nennt die Zahlen in Lösungsreihenfolge')
    expect(spoilers({ ...t, question: `${t.question} Ziehe die Zahlen.` })).toContain('Bildschirm-Hinweis in der Frage')
    const props = { ...t.interactive!.props, order: ['a', 'b', 'c', 'd'] }
    expect(spoilers({ ...t, interactive: { ...t.interactive!, props } })).toContain('Ablage sortiert')
    const leaked = { ...t.interactive!.props, items: [{ id: 'a', label: '1', value: 1 }] }
    expect(spoilers({ ...t, interactive: { ...t.interactive!, props: leaked } })).toContain('Lösung in den Props')
  })
})
