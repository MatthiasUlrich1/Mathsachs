/**
 * Neu-Themen: gesperrte __neu-Themen nutzen das Kreisdiagramm zum Selberbauen (pieChartTask).
 * Klasse 6: Relative Häufigkeit, In Prozent umwandeln, Prozent einer Größe berechnen.
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { worksheetPrintExtras } from '../lib/worksheetPrint'
import { pcExtentFits, pcSourceFits, pcStartPercents, pcTextExtents } from '../lib/pieChartLogic'
import { buildUniqueTaskRound } from './uniqueRound'
import { math6NeuTopics } from './math6NeuTopics'
import { TABLE_SURVEYS, TALLY_SURVEYS } from './barChartSurveys'
import { COUNT_SURVEYS, COUNT_SURVEYS_ANTEIL, COUNT_SURVEYS_HAEUFIGKEIT, PERCENT_SURVEYS, countPieChartTask, percentPieChartTask } from './pieChartSurveys'
import type { Task, Topic } from './types'

const CASES: Array<{ id: string; min: number }> = [
  { id: 'lb2-haeufigkeit__neu', min: 2 },
  { id: 'lb5-anteil-prozent__neu', min: 2 },
  { id: 'lb1-prozent__neu', min: 2 },
]
const topicOf = (id: string): Topic => {
  const t = math6NeuTopics.find((x) => x.id === id)
  if (!t) throw new Error(`Thema ${id} nicht gefunden`)
  return t
}

const SEEDS = Array.from({ length: 60 }, (_, i) => i * 3 + 1)
const chartTasks = (topic: Topic): Task[] => {
  const out: Task[] = []
  for (const seed of SEEDS) {
    const rng = createRng(seed)
    for (let i = 0; i < 14; i++) {
      const t = topic.generate(rng)
      if (t.interactive?.type === 'pieChart') out.push(t)
    }
  }
  return out
}

const categoriesOf = (t: Task): string[] => t.interactive!.props.categories as string[]
const percentsOf = (t: Task): number[] => (t.sampleAnswer as { percents: number[] }).percents
const isCountTask = (t: Task): boolean => t.dedupeKey!.startsWith('piechart-counts')

/** Written texts of an svg (attributes like width="100%" are no data). */
const textsOf = (svg: string): string[] => (svg.match(/<text[^>]*>([^<]*)</g) ?? []).map((m) => m.replace(/.*>/, '').replace('<', ''))

/** Spoiler: a count task names a share, or the props/question give the answer away, or a screen-only hint stands in the question. */
const spoilers = (t: Task): string[] => {
  const hits: string[] = []
  const percents = percentsOf(t)
  if (isCountTask(t)) {
    if (/%|Prozent/.test(t.question)) hits.push('Frage nennt Prozent')
    categoriesOf(t).forEach((cat, i) => {
      const esc = cat.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)
      if (new RegExp(`${esc}\\D{0,12}${percents[i]}\\b`).test(t.question)) hits.push(`Frage nennt Anteil von ${cat}`)
    })
    if (/Prozent|%/.test(textsOf(t.visualContent ?? '').join(' '))) hits.push('Tabelle nennt Prozent')
  }
  if (/zieh|tippe|klick|pfeiltaste|punkt/i.test(t.question)) hits.push('Bildschirm-Hinweis in der Frage')
  if (/"percents"|"data"|"values"|"value"|"targets"/.test(JSON.stringify(t.interactive!.props))) hits.push('Lösung in den Props')
  if (!t.visualContent?.trim()) hits.push('keine Datenquelle')
  return hits
}

describe.each(CASES)('Neu-Thema Kreisdiagramm $id', (c) => {
  const topic = topicOf(c.id)
  const tasks = chartTasks(topic)

  it('bleibt gesperrt und neu', () => {
    expect(topic.released).toBe(false)
    expect(topic.neu).toBe(true)
  })

  it('hat die Kreisdiagramm-Variante mit dedupeKey, Erklärung, lösbarer sampleAnswer, Start besteht nicht, ohne Spoiler', () => {
    expect(tasks.length).toBeGreaterThan(0)
    const keys = new Set<string>()
    for (const t of tasks) {
      expect(t.check(t.sampleAnswer), t.question).toBe(true)
      expect(t.check({ kind: 'pieChart', percents: null }), t.question).toBe(false)
      expect(t.check({ kind: 'pieChart', percents: pcStartPercents(categoriesOf(t).length, 5) }), t.question).toBe(false)
      expect(percentsOf(t).reduce((s, v) => s + v, 0)).toBe(100)
      expect(t.dedupeKey?.trim(), t.question).toBeTruthy()
      keys.add(t.dedupeKey!)
      expect(t.explanation.trim().length).toBeGreaterThan(80)
      expect(t.question).toMatch(/Kreisdiagramm/)
      expect(spoilers(t), t.question).toEqual([])
    }
    expect(keys.size).toBeGreaterThanOrEqual(c.min)
  })

  it('Papierform: Datenquelle zuerst, dann leerer Kreis mit Legende ohne Sektoren', () => {
    for (const t of tasks) {
      const extras = worksheetPrintExtras(t)
      expect(extras.visualHtml!.startsWith(t.visualContent!)).toBe(true)
      expect(extras.visualHtml!.match(/<svg/g)).toHaveLength(2)
      for (const cat of categoriesOf(t)) expect(extras.visualHtml).toContain(cat)
      expect(extras.visualHtml).not.toContain('<path')
      expect(extras.paperHint).toMatch(/Zeichne/)
    }
  })

  it('Text passt in die Abbildung', () => {
    for (const t of tasks) for (const e of pcTextExtents(categoriesOf(t))) expect(pcExtentFits(e), `${e.text} in ${t.question}`).toBe(true)
  })

  it('Rundenlänge 10 bei genügend großem Pool', () => {
    for (const seed of [1, 42, 999]) {
      const round = buildUniqueTaskRound(topic.generate, createRng(seed), 10, 400)
      expect(round.length, `${c.id} seed=${seed}`).toBe(10)
    }
  })
})

describe('Szenarien', () => {
  it('Anzahl-Szenarien: Gesamtzahl 20/25/40/50, alle Anteile Vielfache von 5 und größer 0, keine Anteile in der Frage, Summe der Anzahlen stimmt zur Frage', () => {
    expect(new Set(COUNT_SURVEYS.map((s) => s.id)).size).toBe(COUNT_SURVEYS.length)
    for (const s of COUNT_SURVEYS) {
      const total = s.counts.reduce((a, b) => a + b, 0)
      expect([20, 25, 40, 50], s.id).toContain(total)
      expect(s.context, s.id).toContain(`${total} Kinder`)
      expect(s.context).not.toMatch(/%|Prozent/)
      expect(s.categories).toHaveLength(s.counts.length)
      for (const n of s.counts) {
        expect(n).toBeGreaterThan(1)
        expect(((n / total) * 100) % 5, s.id).toBeCloseTo(0, 9)
      }
      // the total is not one of the shares, so the question cannot be mistaken for a share
      expect(s.counts.map((n) => (n / total) * 100), s.id).not.toContain(total)
      expect(pcSourceFits(`Umfrage: ${s.head}`, s.head, 'Anzahl Kinder', s.categories, s.counts.map(String)), s.id).toBe(true)
    }
  })

  it('Prozent-Szenarien: Summe 100, Vielfache von 5, Taschengeld mit zwei Nachkommastellen', () => {
    for (const s of PERCENT_SURVEYS) {
      expect(s.percents.reduce((a, b) => a + b, 0), s.id).toBe(100)
      for (const p of s.percents) expect(p % 5).toBe(0)
      expect(pcSourceFits(s.head, s.colLeft, 'Anteil', s.categories, s.percents.map((p) => `${p} %`)), s.id).toBe(true)
    }
    const t = percentPieChartTask(createRng(1), PERCENT_SURVEYS.find((s) => s.euro)!)
    expect(t.explanation).toContain('20,00 €')
    expect(t.explanation).toMatch(/\b8,00 €/)
    expect(t.explanation).not.toMatch(/\b\d+,\d €/)
  })

  it('die Erklärung rechnet jede Anzahl vor und nennt die Gesamtzahl', () => {
    const t = countPieChartTask(createRng(2), COUNT_SURVEYS[0]!)
    expect(t.explanation).toContain('20 Kinder')
    expect(t.explanation).toMatch(/9 : 20 = 0,45 = 45 %/)
    expect(t.explanation).toMatch(/100 %/)
  })

  it('Tabelle zeigt die Anzahlen, aber keine Prozentwerte', () => {
    const t = countPieChartTask(createRng(3), COUNT_SURVEYS[1]!)
    const written = textsOf(t.visualContent!)
    for (const n of COUNT_SURVEYS[1]!.counts) expect(written).toContain(String(n))
    expect(written.join(' ')).not.toMatch(/%/)
  })

  it('Grammatik: nie "1 Kinder"', () => {
    for (const s of COUNT_SURVEYS) {
      const t = countPieChartTask(createRng(5), s)
      expect(`${t.question} ${t.explanation} ${t.solution}`).not.toMatch(/\b1 Kinder\b/)
    }
  })
})

describe('Themen und Szenarien sind getrennt', () => {
  it('Häufigkeit und Anteil-Prozent erzeugen keine gleichen Aufgaben (dedupeKey und Frage)', () => {
    const a = chartTasks(topicOf('lb2-haeufigkeit__neu')).filter(isCountTask)
    const b = chartTasks(topicOf('lb5-anteil-prozent__neu')).filter(isCountTask)
    expect(a.length).toBeGreaterThan(0)
    expect(b.length).toBeGreaterThan(0)
    const keysA = new Set(a.map((t) => t.dedupeKey))
    const qA = new Set(a.map((t) => t.question))
    for (const t of b) {
      expect(keysA.has(t.dedupeKey), t.dedupeKey).toBe(false)
      expect(qA.has(t.question), t.question).toBe(false)
    }
    expect(COUNT_SURVEYS_HAEUFIGKEIT.length + COUNT_SURVEYS_ANTEIL.length).toBe(COUNT_SURVEYS.length)
  })

  it('kein Prozentvektor kommt in zwei Szenarien vor, und kein Szenario startet gleich aufgeteilt', () => {
    const vectors = [
      ...COUNT_SURVEYS.map((s) => s.counts.map((n) => (n / s.counts.reduce((x, y) => x + y, 0)) * 100)),
      ...PERCENT_SURVEYS.map((s) => s.percents),
    ].map((v) => v.join(','))
    expect(new Set(vectors).size).toBe(vectors.length)
    for (const s of COUNT_SURVEYS) expect(s.counts.every((n) => n === s.counts[0])).toBe(false)
  })

  it('Häufigkeit: Kreisdiagramm-Themen wiederholen kein Thema der Säulendiagramm-Umfragen', () => {
    const barHeads = new Set([...TALLY_SURVEYS, ...TABLE_SURVEYS].map((s) => s.head))
    expect(barHeads.has('Haustier')).toBe(true) // control: the comparison can see overlaps
    for (const s of COUNT_SURVEYS_HAEUFIGKEIT) expect(barHeads.has(s.head), s.head).toBe(false)
  })

  it('Verein-Szenario: nicht alle Kinder sind im Verein', () => {
    const v = COUNT_SURVEYS.find((s) => s.id === 'verein50')!
    expect(v.categories).toContain('Kein Verein')
  })
})

describe('Negativkontrollen', () => {
  const t = countPieChartTask(createRng(2), COUNT_SURVEYS[1]!)
  it('die Spoiler-Prüfung erkennt Anteile in der Frage, Bildschirm-Hinweise, Lösungen in den Props und fehlende Quelle', () => {
    expect(spoilers(t)).toEqual([])
    const cat = categoriesOf(t)[0]!
    const p = percentsOf(t)[0]!
    expect(spoilers({ ...t, question: `${t.question} ${cat} hat ${p} Prozent.` }).join()).toMatch(/Prozent|Anteil/)
    expect(spoilers({ ...t, question: `${t.question} ${cat}: ${p}` }).join()).toMatch(/Anteil von/)
    expect(spoilers({ ...t, question: `${t.question} Ziehe die Punkte.` })).toContain('Bildschirm-Hinweis in der Frage')
    const props = { ...t.interactive!.props, percents: [1, 2] }
    expect(spoilers({ ...t, interactive: { ...t.interactive!, props } })).toContain('Lösung in den Props')
    expect(spoilers({ ...t, visualContent: '' })).toContain('keine Datenquelle')
    expect(spoilers({ ...t, visualContent: '<svg><text>40 %</text></svg>' })).toContain('Tabelle nennt Prozent')
  })
  it('der Grammatiktest erkennt "1 Kinder" und lässt "1 Kind" und "11 Kinder" durch', () => {
    expect('es sind 1 Kinder').toMatch(/\b1 Kinder\b/)
    expect('es ist 1 Kind').not.toMatch(/\b1 Kinder\b/)
    expect('es sind 11 Kinder').not.toMatch(/\b1 Kinder\b/)
  })
})
