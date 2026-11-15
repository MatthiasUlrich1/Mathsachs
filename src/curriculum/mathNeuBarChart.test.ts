/**
 * Neu-Themen: gesperrte __neu-Themen nutzen das Säulendiagramm zum Selberbauen (barChartTask).
 * Klasse 5 Mittelwert (Geschwister-Umfrage), Klasse 6 Relative Häufigkeit (Strichliste, Tabelle).
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { worksheetPrintExtras } from '../lib/worksheetPrint'
import { bcExtentFits, bcSourceFits, bcTextExtents } from '../lib/barChartLogic'
import { buildUniqueTaskRound } from './uniqueRound'
import { math5NeuTopics } from './math5NeuTopics'
import { math6NeuTopics } from './math6NeuTopics'
import { SIBLING_SURVEYS, TABLE_SURVEYS, TALLY_SURVEYS, surveyBarChartTask } from './barChartSurveys'
import type { Task, Topic } from './types'

const CASES: Array<{ id: string; topics: Topic[]; min: number }> = [
  { id: 'lb2-mittelwert__neu', topics: math5NeuTopics, min: 1 },
  { id: 'lb2-haeufigkeit__neu', topics: math6NeuTopics, min: 2 },
]
const topicOf = (c: { id: string; topics: Topic[] }): Topic => {
  const t = c.topics.find((x) => x.id === c.id)
  if (!t) throw new Error(`Thema ${c.id} nicht gefunden`)
  return t
}

const SEEDS = Array.from({ length: 60 }, (_, i) => i * 3 + 1)
const chartTasks = (topic: Topic): Task[] => {
  const out: Task[] = []
  for (const seed of SEEDS) {
    const rng = createRng(seed)
    for (let i = 0; i < 12; i++) {
      const t = topic.generate(rng)
      if (t.interactive?.type === 'barChart') out.push(t)
    }
  }
  return out
}

const categoriesOf = (t: Task): string[] => t.interactive!.props.categories as string[]
const countsOf = (t: Task): number[] => (t.sampleAnswer as { values: number[] }).values

/** Spoiler: the question or the props give the heights away, or a screen-only hint stands in the question. */
const spoilers = (t: Task): string[] => {
  const hits: string[] = []
  const counts = countsOf(t)
  // class names like "6b" are no data
  const numbersInQuestion = t.question.replace(/Klasse \d+[a-z]/g, 'Klasse').match(/\d+/g) ?? []
  // each height must not be written next to its category in the question
  categoriesOf(t).forEach((cat, i) => {
    const esc = cat.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)
    if (new RegExp(`${esc}\\D{0,12}${counts[i]}\\b`).test(t.question)) hits.push(`Frage nennt Höhe von ${cat}`)
  })
  // the sum of the children or any other count must not be handed out either
  for (const n of numbersInQuestion) if (counts.includes(Number(n)) && Number(n) > 1) hits.push(`Frage enthält die Zahl ${n}`)
  if (/zieh|tippe|klick|pfeiltaste|griff/i.test(t.question)) hits.push('Bildschirm-Hinweis in der Frage')
  if (/"data"|"values"|"value"|"counts"/.test(JSON.stringify(t.interactive!.props))) hits.push('Lösung in den Props')
  if (!t.visualContent?.trim()) hits.push('keine Datenquelle')
  return hits
}

describe.each(CASES)('Neu-Thema Säulendiagramm $id', (c) => {
  const topic = topicOf(c)
  const tasks = chartTasks(topic)

  it('bleibt gesperrt und neu', () => {
    expect(topic.released).toBe(false)
    expect(topic.neu).toBe(true)
  })

  it('hat die Säulendiagramm-Variante mit dedupeKey, Erklärung, lösbarer sampleAnswer, Start besteht nicht, ohne Spoiler', () => {
    expect(tasks.length).toBeGreaterThan(0)
    const keys = new Set<string>()
    for (const t of tasks) {
      expect(t.check(t.sampleAnswer), t.question).toBe(true)
      expect(t.check({ kind: 'barChart', values: categoriesOf(t).map(() => null) }), t.question).toBe(false)
      // the start heights are not the answer for any bar
      const starts = t.interactive!.props.starts as number[]
      starts.forEach((s, i) => expect(s, `${t.question} ${i}`).not.toBe(countsOf(t)[i]))
      expect(t.dedupeKey?.trim(), t.question).toBeTruthy()
      keys.add(t.dedupeKey!)
      expect(t.explanation.trim().length).toBeGreaterThan(80)
      expect(t.question).toMatch(/Säulendiagramm/)
      expect(spoilers(t), t.question).toEqual([])
      // class sizes of a real class
      const total = countsOf(t).reduce((s, v) => s + v, 0)
      expect(total).toBeGreaterThanOrEqual(24)
      expect(total).toBeLessThanOrEqual(30)
    }
    expect(keys.size).toBeGreaterThanOrEqual(c.min)
  })

  it('Text passt: Achse, Beschriftungen, Datenquelle', () => {
    for (const t of tasks) {
      const p = t.interactive!.props
      for (const e of bcTextExtents(categoriesOf(t), Number(p.yMax), Number(p.step), String(p.yLabel ?? ''))) {
        expect(bcExtentFits(e), `${e.text} in ${t.question}`).toBe(true)
      }
    }
    for (const s of [...TALLY_SURVEYS, ...SIBLING_SURVEYS]) {
      expect(bcSourceFits(`Strichliste: ${s.head}`, s.categories, s.counts, 'tally')).toBe(true)
      expect(bcSourceFits(`Tabelle: ${s.head}`, s.categories, s.counts, 'table')).toBe(true)
    }
    for (const s of TABLE_SURVEYS) expect(bcSourceFits(`Tabelle: ${s.head}`, s.categories, s.counts, 'table')).toBe(true)
  })

  it('Papierform: Datenquelle zuerst, dann leeres Achsenkreuz ohne Balken', () => {
    for (const t of tasks) {
      const extras = worksheetPrintExtras(t)
      expect(extras.visualHtml!.startsWith(t.visualContent!)).toBe(true)
      expect(extras.visualHtml!.match(/<svg/g)).toHaveLength(2)
      for (const cat of categoriesOf(t)) expect(extras.visualHtml).toContain(cat)
      expect(extras.paperHint).toMatch(/Zeichne/)
    }
  })

  it('Rundenlänge 10 bei genügend großem Pool', () => {
    for (const seed of [1, 42, 999]) {
      const round = buildUniqueTaskRound(topic.generate, createRng(seed), 10, 400)
      expect(round.length, `${c.id} seed=${seed}`).toBe(10)
    }
  })
})

describe('Umfragen', () => {
  const all = [...TALLY_SURVEYS, ...TABLE_SURVEYS, ...SIBLING_SURVEYS]

  it('jede Umfrage hat eine realistische Klassengröße, passende Achse und eindeutige Kennung', () => {
    expect(new Set(all.map((s) => s.id)).size).toBe(all.length)
    for (const s of all) {
      const total = s.counts.reduce((a, b) => a + b, 0)
      expect(total, s.id).toBeGreaterThanOrEqual(24)
      expect(total, s.id).toBeLessThanOrEqual(30)
      expect(s.categories).toHaveLength(s.counts.length)
      expect(Math.max(...s.counts), s.id).toBeLessThanOrEqual(s.yMax)
    }
  })

  it('eine Umfrage mit 0 hat einen Hinweis in der Erklärung und einen Balken, der nicht bei 0 startet', () => {
    const s = TABLE_SURVEYS.find((x) => x.counts.includes(0))!
    for (let seed = 1; seed < 8; seed++) {
      const t = surveyBarChartTask(createRng(seed), s, 'table')
      const zeroIndex = countsOf(t).indexOf(0)
      expect((t.interactive!.props.starts as number[])[zeroIndex]).toBe(1)
      expect(t.explanation).toContain('niemand abgestimmt')
      expect(t.check({ kind: 'barChart', values: countsOf(t).map((v, i) => (i === zeroIndex ? null : v)) })).toBe(false)
    }
  })

  it('Strichliste: Zahlen stehen nicht als Text in der Abbildung', () => {
    const t = surveyBarChartTask(createRng(3), TALLY_SURVEYS[0]!, 'tally')
    const written = (t.visualContent!.match(/<text [^>]*>([^<]*)</g) ?? []).map((m) => m.replace(/.*>/, '').replace('<', ''))
    for (const n of countsOf(t)) expect(written).not.toContain(String(n))
  })

  it('Grammatik: nie "1 Kinder"', () => {
    for (const s of all) {
      for (const mode of ['tally', 'table'] as const) {
        const t = surveyBarChartTask(createRng(5), s, mode)
        expect(`${t.question} ${t.explanation} ${t.solution}`).not.toMatch(/\b1 Kinder\b/)
      }
    }
  })
})

describe('Negativkontrollen', () => {
  const t = surveyBarChartTask(createRng(2), TALLY_SURVEYS[0]!, 'tally')
  it('die Spoiler-Prüfung erkennt Höhen in der Frage, Bildschirm-Hinweise, Lösungen in den Props und fehlende Quelle', () => {
    expect(spoilers(t)).toEqual([])
    const cat = categoriesOf(t)[0]!
    const n = countsOf(t)[0]!
    expect(spoilers({ ...t, question: `${t.question} ${cat} hat ${n} Stimmen.` }).join()).toMatch(/Höhe von/)
    expect(spoilers({ ...t, question: `${t.question} Ziehe die Balken.` })).toContain('Bildschirm-Hinweis in der Frage')
    const props = { ...t.interactive!.props, data: [1, 2] }
    expect(spoilers({ ...t, interactive: { ...t.interactive!, props } })).toContain('Lösung in den Props')
    expect(spoilers({ ...t, visualContent: '' })).toContain('keine Datenquelle')
  })
  it('der Grammatiktest erkennt "1 Kinder" und lässt "1 Kind" und "11 Kinder" durch', () => {
    expect('es sind 1 Kinder').toMatch(/\b1 Kinder\b/)
    expect('es ist 1 Kind').not.toMatch(/\b1 Kinder\b/)
    expect('es sind 11 Kinder').not.toMatch(/\b1 Kinder\b/)
  })
})
