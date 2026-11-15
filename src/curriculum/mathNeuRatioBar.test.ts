/**
 * Neu-Themen: gesperrte __neu-Themen nutzen die interaktive Verhältnisleiste (ratioBarTask).
 * Es gibt kein eigenes Verhältnis-Thema in __neu; passende Themen: Zuordnungen (proportional) und Anteil einer Größe.
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { worksheetPrintExtras } from '../lib/worksheetPrint'
import { buildUniqueTaskRound } from './uniqueRound'
import { math6NeuTopics } from './math6NeuTopics'
import type { Task, Topic } from './types'

const TOPIC_IDS = ['lb2-proportional__neu', 'lb5-anteil-groesse__neu']
const topicOf = (id: string): Topic => {
  const t = math6NeuTopics.find((x) => x.id === id)
  if (!t) throw new Error(`Thema ${id} nicht gefunden`)
  return t
}

/** Die gesuchten Mengen / Feldzahlen dürfen nicht vorab in Frage oder Props stehen. */
const spoilers = (task: Task): string[] => {
  const hits: string[] = []
  const props = task.interactive!.props
  if (props.mode === 'split') {
    // every number of the solution text that is not the total or part of the ratio must be absent from the question
    const nums = (task.solution.match(/\d+(?:,\d+)?/g) ?? []).filter((n) => n !== String(props.total).replace('.', ','))
    for (const n of nums) {
      const re = new RegExp(String.raw`(?<![\d,])${n.replace(',', String.raw`,`)}(?![\d,])`)
      const ratio = props.ratio as number[]
      if (ratio.map(String).includes(n)) continue
      if (re.test(task.question)) hits.push(`Ergebnis ${n} in der Frage`)
    }
  } else if (/\b\d+\s+(Feld\w*|Kästchen)\b/.test(task.question)) {
    hits.push('Feldzahl in der Frage')
  }
  if (/"(parts|amounts)"/.test(JSON.stringify(props))) hits.push('Lösung in den Props')
  if (/tippe|klick|knopf|regler/i.test(task.question)) hits.push('Bildschirm-Hinweis in der Frage')
  return hits
}

const SEEDS = Array.from({ length: 30 }, (_, i) => i * 7 + 3)
const barTasks = (topic: Topic): Task[] => {
  const out: Task[] = []
  for (const seed of SEEDS) {
    const rng = createRng(seed)
    for (let i = 0; i < 12; i++) {
      const t = topic.generate(rng)
      if (t.interactive?.type === 'ratioBar') out.push(t)
    }
  }
  return out
}

describe('Neu-Themen Verhältnisleiste', () => {
  it.each(TOPIC_IDS)('%s: bleibt gesperrt und neu', (id) => {
    expect(topicOf(id).released).toBe(false)
    expect(topicOf(id).neu).toBe(true)
  })

  it.each(TOPIC_IDS)('%s: dedupeKey, Erklärung, lösbare sampleAnswer, Start besteht nicht, ohne Spoiler', (id) => {
    const tasks = barTasks(topicOf(id))
    expect(tasks.length, id).toBeGreaterThan(0)
    const keys = new Set<string>()
    for (const t of tasks) {
      expect(t.check(t.sampleAnswer), t.question).toBe(true)
      expect(t.check({ kind: 'ratioBar', parts: [] }), t.question).toBe(false)
      expect(t.dedupeKey?.trim(), t.question).toBeTruthy()
      keys.add(t.dedupeKey!)
      expect(t.explanation.trim().length).toBeGreaterThan(80)
      expect(t.question).toMatch(/Verhältnis|:/)
      expect(spoilers(t), t.question).toEqual([])
    }
    expect(keys.size, id).toBeGreaterThanOrEqual(3)
  })

  it('beide Modi kommen vor und die Legende passt in die Leiste (Namen höchstens 12 Zeichen)', () => {
    const all = TOPIC_IDS.flatMap((id) => barTasks(topicOf(id)))
    expect(new Set(all.map((t) => t.interactive!.props.mode))).toEqual(new Set(['colour', 'split']))
    for (const t of all) for (const l of t.interactive!.props.labels as string[]) expect(l.length).toBeLessThanOrEqual(12)
  })

  it('Papierform: Färben-Aufgaben sind farbig lösbar, Aufteilen-Aufgaben nennen die Summe nur als Gesamt', () => {
    for (const t of TOPIC_IDS.flatMap((id) => barTasks(topicOf(id)))) {
      if (t.interactive!.props.mode === 'colour') expect(t.question).toMatch(/Färbe/)
      else expect(t.question).toMatch(/Wie viel/)
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
  const split = barTasks(topicOf('lb5-anteil-groesse__neu'))[0]!
  const colour = barTasks(topicOf('lb2-proportional__neu')).find((t) => t.interactive!.props.mode === 'colour')!
  it('erkennt verratene Ergebnisse, Feldzahlen, Props-Lösung und Bildschirm-Hinweise', () => {
    expect(spoilers(split)).toEqual([])
    expect(spoilers(colour)).toEqual([])
    const result = /\d+(?:,\d+)?/.exec(split.solution.replace(/^[^:]*:\s*/, ''))![0]
    expect(spoilers({ ...split, question: `${split.question} Es sind ${result} €.` }).length).toBeGreaterThan(0)
    expect(spoilers({ ...colour, question: `${colour.question} Nimm 10 Felder.` })).toContain('Feldzahl in der Frage')
    expect(spoilers({ ...colour, question: `${colour.question} Verteile sie auf 10 Feldern.` })).toContain('Feldzahl in der Frage')
    expect(spoilers({ ...colour, question: `${colour.question} Tippe die Felder an.` })).toContain(
      'Bildschirm-Hinweis in der Frage',
    )
    const leaked = { ...colour.interactive!.props, parts: ['A'] }
    expect(spoilers({ ...colour, interactive: { ...colour.interactive!, props: leaked } })).toContain('Lösung in den Props')
  })
})

describe('Inhaltliche Qualität', () => {
  it('Geldbeträge haben immer zwei Nachkommastellen (Frage, Lösung, Erklärung, Druck) und die Eingabe nimmt 37,5 / 37,50 / 37.5', () => {
    const money = barTasks(topicOf('lb5-anteil-groesse__neu')).filter((t) => t.interactive!.props.unit === '€')
    expect(money.length).toBeGreaterThan(0)
    let sawHalf = false
    for (const t of money) {
      for (const text of [t.question, t.solution, t.explanation]) {
        expect(text, text).not.toMatch(/\d,\d (€|\u20ac)/) // one decimal
        expect(text, text).not.toMatch(/(^|[^\d,])\d+ €/) // none
      }
      const svg = worksheetPrintExtras(t).visualHtml!
      expect(svg).toMatch(/Gesamt: [\d.]+,\d\d €/)
      const [ea, eb] = (t.sampleAnswer as { amounts: [string, string] }).amounts
      expect(ea).toMatch(/,\d\d$/)
      for (const variant of [(s: string) => s, (s: string) => s.replace(/0$/, ''), (s: string) => s.replace(',', '.').replace(/0$/, '')]) {
        expect(t.check({ kind: 'ratioBar', parts: [], amounts: [variant(ea), variant(eb)] }), `${ea}/${eb}`).toBe(true)
      }
      if (/,50 €/.test(t.solution)) sawHalf = true
    }
    expect(sawHalf).toBe(true)
  })

  it('Rezepte nutzen nur realistische Verhältnisse (Tee < Apfelsaft, Wasser < Mehl, Essig < Öl)', () => {
    const tasks = barTasks(topicOf('lb2-proportional__neu')).filter((t) => t.interactive!.props.mode === 'split')
    expect(tasks.length).toBeGreaterThan(0)
    const seen = new Set<string>()
    for (const t of tasks) {
      const [x, y] = t.interactive!.props.labels as string[]
      const [a, b] = t.interactive!.props.ratio as number[]
      seen.add(x!)
      if (['Apfelsaft', 'Mehl', 'Öl'].includes(x!)) expect(a, `${x}:${y} ${a}:${b}`).toBeGreaterThan(b!)
      if (x === 'Apfelsaft') expect(y).toBe('Tee')
    }
    expect(seen.size).toBeGreaterThanOrEqual(3)
  })
})
