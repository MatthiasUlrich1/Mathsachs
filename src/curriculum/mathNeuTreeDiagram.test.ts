/**
 * Neu-Themen: gesperrte __neu-Themen nutzen das Baumdiagramm (treeDiagramTask).
 * Klasse 8: Urne ohne Zurücklegen, Münze und Würfel, zweistufiges Glücksrad, Regen an zwei Tagen.
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { parseProbability } from '../lib/treeDiagramLogic'
import { worksheetPrintExtras } from '../lib/worksheetPrint'
import { buildUniqueTaskRound } from './uniqueRound'
import { math8NeuTopics } from './math8NeuTopics'
import type { Task, Topic } from './types'

const IDS = ['k8-lb2-laplace-bruch__neu', 'k8-lb2-laplace-prozent__neu', 'k8-lb2-gegenwahrscheinlichkeit__neu']
const topicOf = (id: string): Topic => {
  const t = math8NeuTopics.find((x) => x.id === id)
  if (!t) throw new Error(`Thema ${id} nicht gefunden`)
  return t
}

const SEEDS = Array.from({ length: 60 }, (_, i) => i * 7 + 1)
const treeTasks = (topic: Topic): Task[] => {
  const out: Task[] = []
  for (const seed of SEEDS) {
    const rng = createRng(seed)
    for (let i = 0; i < 12; i++) {
      const t = topic.generate(rng)
      if (t.interactive?.type === 'treeDiagram') out.push(t)
    }
  }
  return out
}

/** Zahlen in einem Text, die als Bruch, Dezimalzahl oder Prozent geschrieben sind (ganze Zahlen zählen nicht). */
const probabilityTokens = (text: string): string[] => text.match(/\d+\s*\/\s*\d+|\d*[.,]\d+\s*%?|\d+\s*%/g) ?? []

/** Werte der Lösung (alle Felder der sampleAnswer), die im Text als Zahl stehen. */
const spoilerHits = (t: Task, text: string): string[] => {
  const answer = t.sampleAnswer as { branches: Record<string, string>; leaves: Record<string, string> }
  const expected = [...Object.values(answer.branches), ...Object.values(answer.leaves)].map((v) => parseProbability(v)!)
  return probabilityTokens(text).filter((tok) => {
    const f = parseProbability(tok.replace(/\s+/g, ' ').trim())
    return f !== null && expected.some((e) => e.n * f.d === f.n * e.d)
  })
}

describe.each(IDS)('Neu-Thema Baumdiagramm %s', (id) => {
  const topic = topicOf(id)
  const tasks = treeTasks(topic)

  it('bleibt gesperrt und neu', () => {
    expect(topic.released).toBe(false)
    expect(topic.neu).toBe(true)
  })

  it('hat Baumdiagramm-Varianten mit dedupeKey, Erklärung mit Regel, lösbarer sampleAnswer, Start besteht nicht', () => {
    expect(tasks.length).toBeGreaterThan(0)
    const keys = new Set<string>()
    for (const t of tasks) {
      expect(t.check(t.sampleAnswer), t.question).toBe(true)
      expect(t.check({ kind: 'treeDiagram', branches: {}, leaves: {} }), t.question).toBe(false)
      expect(t.dedupeKey?.trim(), t.question).toBeTruthy()
      keys.add(t.dedupeKey!)
      expect(t.explanation.trim().length).toBeGreaterThan(80)
      expect(t.explanation, t.question).toMatch(/Pfadregel|Summenregel/)
    }
    expect(keys.size).toBeGreaterThanOrEqual(2)
  })

  it('kein Spoiler: weder Frage noch Zeichnung nennen einen gesuchten Wert; keine Bildschirm-Wörter in der Frage', () => {
    for (const t of tasks) {
      expect(spoilerHits(t, t.question), t.question).toEqual([])
      const given = JSON.stringify(t.interactive!.props.given)
      expect(spoilerHits(t, given.replace(/"[\d.]+":/g, ' ')), t.question).toEqual([])
      const p = t.interactive!.props
      const blanks = [...(p.blankBranches as string[]), ...(p.blankLeaves as string[])]
      expect(blanks.length, t.question).toBeGreaterThan(0)
      for (const b of p.blankBranches as string[]) expect((p.given as Record<string, string>)[b]).toBeUndefined()
      expect(t.question, t.question).not.toMatch(/tippe|klick|feld(er)? (unten|oben)|eingabe/i)
      expect(t.question).not.toMatch(/Pfadregel|Summenregel/)
    }
  })

  it('Papierform: Baum mit ___ an jedem gesuchten Feld und den vorgegebenen Werten', () => {
    for (const t of tasks) {
      const p = t.interactive!.props
      const blanks = (p.blankBranches as string[]).length + (p.blankLeaves as string[]).length
      const extras = worksheetPrintExtras(t)
      expect(extras.visualHtml, t.question).toContain('<svg')
      expect((extras.visualHtml!.match(/___/g) ?? []).length, t.question).toBe(blanks)
      expect(spoilerHits(t, extras.visualHtml!.replace(/<[^>]*>/g, ' ')), t.question).toEqual([])
    }
  })

  it('Rundenlänge 10 bei genügend großem Pool', () => {
    for (const seed of [1, 42, 999]) {
      const round = buildUniqueTaskRound(topic.generate, createRng(seed), 10, 400)
      expect(round.length, `${id} seed=${seed}`).toBe(10)
    }
  })
})

describe('Spoiler-Prüfung Negativkontrolle', () => {
  const sample = treeTasks(topicOf('k8-lb2-laplace-bruch__neu'))[0]!
  const answer = sample.sampleAnswer as { branches: Record<string, string>; leaves: Record<string, string> }
  const secret = Object.values({ ...answer.branches, ...answer.leaves })[0]!

  it('der Test erkennt einen genannten Wert (auch in anderer Schreibweise) und lässt Ganzzahlen durch', () => {
    expect(spoilerHits(sample, `Die Wahrscheinlichkeit ist ${secret}.`)).toHaveLength(1)
    expect(spoilerHits(sample, 'Es liegen 4 rote und 2 blaue Kugeln in der Urne.')).toEqual([])
    const f = parseProbability(secret)!
    expect(spoilerHits(sample, `also ${(f.n / f.d).toString().replace('.', ',')} insgesamt`).length).toBe(f.d === 1 || [2, 4, 5, 8, 10, 20, 25].includes(f.d) ? 1 : 0)
  })
})
