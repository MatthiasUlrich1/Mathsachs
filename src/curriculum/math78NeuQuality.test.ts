/**
 * Regressions-Sweeps für die Neu-Themen Klasse 7/8 (Gesamtcheck B2 + A):
 * Mittelsenkrechte, Betrag, Winkel, Laplace, Gegenwahrscheinlichkeit.
 * Jeder Sweep läuft über >= 300 Seeds.
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { parseProbability } from '../lib/treeDiagramLogic'
import { buildUniqueTaskRound } from './uniqueRound'
import { math7NeuTopics, eckName } from './math7NeuTopics'
import { math8NeuTopics } from './math8NeuTopics'
import type { Task, Topic } from './types'

const SEEDS = Array.from({ length: 320 }, (_, i) => i * 3 + 1)

const topicOf = (list: Topic[], id: string): Topic => {
  const t = list.find((x) => x.id === id)
  if (!t) throw new Error(`Thema ${id} nicht gefunden`)
  return t
}

const sweep = (topic: Topic, perSeed = 8): Task[] => {
  const out: Task[] = []
  for (const seed of SEEDS) {
    const rng = createRng(seed)
    for (let i = 0; i < perSeed; i++) out.push(topic.generate(rng))
  }
  return out
}

const choicesOf = (t: Task): string[] | null =>
  t.interactive?.type === 'choicePick' ? (t.interactive.props.choices as string[]) : null
const correctOf = (t: Task): string => (t.sampleAnswer as { choice: string }).choice
const numbersIn = (s: string): number[] => (s.match(/\d+/g) ?? []).map(Number)

const IDS7 = [
  'k7-lb1-nebenwinkel__neu',
  'k7-lb1-scheitelwinkel__neu',
  'k7-lb1-winkelsumme-vieleck__neu',
  'k7-lb1-basiswinkel__neu',
  'k7-lb1-mittelsenkrechte-schritte__neu',
  'k7-lb2-betrag__neu',
]
const IDS8 = ['k8-lb2-laplace-bruch__neu', 'k8-lb2-laplace-prozent__neu', 'k8-lb2-gegenwahrscheinlichkeit__neu']
const ALL = [
  ...IDS7.map((id) => ({ id, topic: topicOf(math7NeuTopics, id) })),
  ...IDS8.map((id) => ({ id, topic: topicOf(math8NeuTopics, id) })),
]

/** Alle ASCII-Minuszeichen vor einer Ziffer (echtes Minus "−" ist erlaubt). */
const ASCII_MINUS = /(^|[\s(|;])-\d/

describe.each(ALL)('MC-Qualität $id', ({ topic }) => {
  const tasks = sweep(topic)
  const mcs = tasks.filter((t) => choicesOf(t))

  it('hat MC-Aufgaben mit genau 4 verschiedenen Optionen, die richtige ist enthalten', () => {
    for (const t of mcs) {
      const ch = choicesOf(t)!
      expect(new Set(ch).size, t.question).toBe(ch.length)
      expect(ch.length, `${t.question} -> ${ch.join(' | ')}`).toBe(4)
      expect(ch, t.question).toContain(correctOf(t))
    }
  })

  it('die richtige Antwort steht nicht immer an derselben Stelle', () => {
    if (mcs.length === 0) return
    const positions = new Set(mcs.map((t) => choicesOf(t)!.indexOf(correctOf(t))))
    expect(positions.size).toBeGreaterThanOrEqual(3)
  })

  it('Erklärungen beginnen mit Großbuchstaben bzw. Ziffer/Betrag und haben keine Doppelpunkt-Leerzeichen-Fehler', () => {
    for (const t of tasks) {
      expect(t.explanation.trim()[0], t.question).toMatch(/[A-ZÄÖÜ0-9|(αβγ]/)
      expect(t.explanation, t.question).not.toMatch(/\s{2,}/)
      expect(t.question + t.explanation).not.toMatch(/undefined|NaN|\[object/)
    }
  })
})

describe('Mittelsenkrechte', () => {
  const topic = topicOf(math7NeuTopics, 'k7-lb1-mittelsenkrechte-schritte__neu')
  const tasks = sweep(topic, 10)
  const lines = tasks.filter((t) => t.interactive?.type === 'numberLine')

  it('V3: die Mitte der Zahlengeraden ist nie der gesuchte Mittelpunkt', () => {
    expect(lines.length).toBeGreaterThan(50)
    for (const t of lines) {
      const { min, max } = t.interactive!.props as { min: number; max: number }
      const mid = Number(t.solution.replace('x = ', '').replace('−', '-'))
      expect(Number.isFinite(mid), t.solution).toBe(true)
      expect((min + max) / 2, t.question).not.toBe(mid)
      expect(mid).toBeGreaterThan(min)
      expect(mid).toBeLessThan(max)
    }
  })

  it('V2/V3: Erklärungen zeigen negative Werte mit echtem Minus und Klammern (kein "+ -")', () => {
    const calc = tasks.filter((t) => /Mittelpunkt|Mittelsenkrechte/.test(t.explanation) && /: 2 =/.test(t.explanation))
    expect(calc.length).toBeGreaterThan(100)
    for (const t of calc) {
      expect(t.explanation, t.explanation).not.toMatch(/\+ -/)
      expect(t.explanation, t.explanation).not.toMatch(ASCII_MINUS)
    }
    expect(calc.some((t) => t.explanation.includes('(−'))).toBe(true)
  })

  it('V6: alle Kreise der Lösung liegen im sichtbaren Bereich', () => {
    const cons = tasks.filter((t) => t.interactive?.type === 'constructionSteps')
    expect(cons.length).toBeGreaterThan(20)
    for (const t of cons) {
      const props = t.interactive!.props as { blankScene: { xRange: [number, number]; yRange: [number, number] } }
      const { xRange, yRange } = props.blankScene
      const scene = (t.sampleAnswer as { scene: { objects: Array<{ kind: string; cx?: number; cy?: number; r?: number }> } }).scene
      let circles = 0
      for (const o of scene.objects) {
        if (o.kind !== 'circle') continue
        circles++
        expect(o.cx! - o.r!).toBeGreaterThanOrEqual(xRange[0])
        expect(o.cx! + o.r!).toBeLessThanOrEqual(xRange[1])
        expect(o.cy! - o.r!).toBeGreaterThanOrEqual(yRange[0])
        expect(o.cy! + o.r!).toBeLessThanOrEqual(yRange[1])
      }
      expect(circles).toBe(2)
    }
  })
})

describe('Betrag', () => {
  const topic = topicOf(math7NeuTopics, 'k7-lb2-betrag__neu')
  const tasks = sweep(topic, 10)

  it('Minuszeichen sind überall echte Minuszeichen', () => {
    for (const t of tasks) {
      const all = [t.question, t.solution, t.explanation, ...(choicesOf(t) ?? [])]
      if (t.interactive?.type === 'multiSelect') all.push(...(t.interactive.props.choices as string[]))
      for (const s of all) expect(s, t.question).not.toMatch(ASCII_MINUS)
    }
  })

  it('V4 fragt nach dem Betrag (Abstand zur 0), nennt keine Zahlen als Beschriftung und hat >= 6 verschiedene Aufgaben', () => {
    const lines = tasks.filter((t) => t.interactive?.type === 'numberLineMulti')
    expect(lines.length).toBeGreaterThan(50)
    const keys = new Set<string>()
    for (const t of lines) {
      expect(t.question).toMatch(/Betrag/)
      expect(t.question).toMatch(/Abstand/)
      keys.add(t.dedupeKey!)
    }
    expect(keys.size).toBeGreaterThanOrEqual(6)
  })

  it('V2 (MC): Betrag einer negativen Zahl mit vier verschiedenen Optionen', () => {
    const mc = tasks.filter((t) => t.question.startsWith('Berechne den Betrag'))
    expect(mc.length).toBeGreaterThan(50)
    for (const t of mc) expect(choicesOf(t)!.length).toBe(4)
  })
})

describe('Winkelthemen: Lösung steht nicht (zufällig) in der Frage', () => {
  it.each([
    'k7-lb1-nebenwinkel__neu',
    'k7-lb1-scheitelwinkel__neu',
    'k7-lb1-basiswinkel__neu',
  ])('%s', (id) => {
    const topic = topicOf(math7NeuTopics, id)
    for (const t of sweep(topic)) {
      if (t.interactive?.type === 'choicePick' && choicesOf(t)!.every((c) => !/°/.test(c))) continue
      if (t.interactive?.type === 'choicePick' && !/°/.test(correctOf(t))) continue
      const sol = numbersIn(t.solution)[0]
      if (sol === undefined) continue
      expect(numbersIn(t.question), `${t.question} -> ${t.solution}`).not.toContain(sol)
    }
  })

  it('Basiswinkel: Spitze 60° / Basiswinkel 60° kommt nie vor', () => {
    const topic = topicOf(math7NeuTopics, 'k7-lb1-basiswinkel__neu')
    for (const t of sweep(topic)) {
      if (!/Spitze|Basiswinkel/.test(t.question)) continue
      if (t.question.startsWith('Welche Aussage')) continue
      expect(t.question).not.toMatch(/\b60°/)
      expect(t.solution).not.toBe('60°')
    }
  })

  it('Nebenwinkel-MC: bei 90° keine Duplikate, nie nur 3 Optionen', () => {
    const topic = topicOf(math7NeuTopics, 'k7-lb1-nebenwinkel__neu')
    for (const t of sweep(topic)) {
      const ch = choicesOf(t)
      if (ch) expect(ch.length).toBe(4)
    }
  })

  it('Scheitel- und Stufenwinkel: echte Stufen-, Wechsel- und Nachbarwinkel-Aufgaben kommen vor', () => {
    const topic = topicOf(math7NeuTopics, 'k7-lb1-scheitelwinkel__neu')
    const text = sweep(topic).map((t) => t.question).join('\n')
    expect(text).toMatch(/Stufenwinkel\)/)
    expect(text).toMatch(/Wechselwinkel, Z-Form\)/)
    expect(text).toMatch(/Nachbarwinkel/)
    expect(text).toMatch(/Welche Winkel sind Stufenwinkel\?/)
  })
})

describe('Winkelsumme im Vieleck', () => {
  const topic = topicOf(math7NeuTopics, 'k7-lb1-winkelsumme-vieleck__neu')
  const tasks = sweep(topic)

  it('kein "3-Eck"/"4-Eck", Dreieck und Viereck heißen richtig', () => {
    for (const t of tasks) expect(t.question, t.question).not.toMatch(/\b[34]-Eck/)
    expect(eckName(3)).toBe('Dreieck')
    expect(eckName(4)).toBe('Viereck')
    expect(eckName(5)).toBe('Fünfeck')
    expect(tasks.some((t) => /einem Dreieck\?/.test(t.question))).toBe(true)
  })

  it('regelmäßiges Dreieck/Viereck (60°/90°) kommt als Zeichenaufgabe nicht vor', () => {
    for (const t of tasks) {
      if (t.interactive?.type === 'angleProtractor') expect(t.solution).not.toMatch(/^(60|90)°$/)
    }
  })

  it('MC bei jedem n hat 4 Optionen', () => {
    for (const t of tasks) {
      const ch = choicesOf(t)
      if (ch) expect(ch.length).toBe(4)
    }
  })
})

describe('Laplace-Bruch', () => {
  const topic = topicOf(math8NeuTopics, 'k8-lb2-laplace-bruch__neu')
  const tasks = sweep(topic)

  it('keine Option ist wertgleich mit einer anderen (auch nicht ungekürzt)', () => {
    const mc = tasks.filter((t) => choicesOf(t))
    expect(mc.length).toBeGreaterThan(100)
    for (const t of mc) {
      const vals = choicesOf(t)!.map((c) => parseProbabilityLoose(c))
      for (let i = 0; i < vals.length; i++)
        for (let j = i + 1; j < vals.length; j++) expect(vals[i]! * 1e9, t.question).not.toBe(vals[j]! * 1e9)
    }
  })

  it('Erklärung sagt nie "P = x = x" und nennt Kürzen nur wenn gekürzt wird', () => {
    for (const t of tasks) {
      expect(t.explanation, t.explanation).not.toMatch(/(\d+\/\d+) = \1(?!\d)/)
      if (/Der Bruch lässt sich nicht kürzen/.test(t.explanation)) expect(/Kürzen mit/.test(t.explanation)).toBe(false)
    }
    expect(tasks.some((t) => /Der Bruch lässt sich nicht kürzen/.test(t.explanation))).toBe(true)
    expect(tasks.some((t) => /Kürzen mit \d+ ergibt/.test(t.explanation))).toBe(true)
  })

  it('Grammatik: "davon ist 1", nie "davon sind 1"', () => {
    for (const t of tasks) expect(t.question).not.toMatch(/davon sind 1 /)
    expect(tasks.some((t) => /davon ist 1 /.test(t.question))).toBe(true)
  })
})

/** Wert eines Bruchs/einer Zahl als Dezimalzahl (nur für den Vergleich). */
function parseProbabilityLoose(s: string): number {
  const f = parseProbability(s.trim())
  return f ? f.n / f.d : Number(s.replace(',', '.').replace('%', ''))
}

describe('Gegenwahrscheinlichkeit', () => {
  const topic = topicOf(math8NeuTopics, 'k8-lb2-gegenwahrscheinlichkeit__neu')
  const tasks = sweep(topic)

  it('keine wertgleichen Optionen', () => {
    const mc = tasks.filter((t) => choicesOf(t))
    expect(mc.length).toBeGreaterThan(100)
    for (const t of mc) {
      const vals = choicesOf(t)!.map((c) => parseProbabilityLoose(c))
      for (let i = 0; i < vals.length; i++)
        for (let j = i + 1; j < vals.length; j++) expect(vals[i]!, t.question).not.toBeCloseTo(vals[j]!, 9)
    }
  })

  it('gleicher Fragetext hat denselben dedupeKey (3/4 und 6/8 sind ein Duplikat)', () => {
    const byQuestion = new Map<string, Set<string>>()
    for (const t of tasks) {
      if (!t.dedupeKey) continue
      const set = byQuestion.get(t.question) ?? new Set<string>()
      set.add(t.dedupeKey)
      byQuestion.set(t.question, set)
    }
    for (const [q, keys] of byQuestion) expect(keys.size, q).toBe(1)
    // und in einer Runde kommt kein Fragetext doppelt vor
    for (const seed of SEEDS.slice(0, 120)) {
      const round = buildUniqueTaskRound(topic.generate, createRng(seed), 10, 400)
      expect(round.length).toBe(10)
      expect(new Set(round.map((t) => t.question)).size, `seed ${seed}`).toBe(10)
    }
  })

  it('Wettertexte nennen Prozent, keine Brüche oder Dezimalzahlen', () => {
    const regen = tasks.filter((t) => /Regenwahrscheinlichkeit/.test(t.question))
    expect(regen.length).toBeGreaterThan(100)
    for (const t of regen) {
      expect(t.question, t.question).toMatch(/\d+ %/)
      expect(t.question, t.question).not.toMatch(/\d+\/\d+|\d,\d/)
    }
    for (const t of tasks) if (t.interactive?.type === 'treeDiagram') expect(t.interactive.props.rootLabel ?? '').not.toBe('Samstag')
  })
})

describe('Laplace-Prozent', () => {
  const topic = topicOf(math8NeuTopics, 'k8-lb2-laplace-prozent__neu')
  const tasks = sweep(topic)

  it('Wortlaut: nie "Egal ob" / "Schätze"; Rad hat höchstens 20 Felder', () => {
    for (const t of tasks) {
      expect(t.question).not.toMatch(/Egal ob|Schätze/)
      const m = /Glücksrad hat (\d+) gleich große Felder/.exec(t.question)
      if (m) expect(Number(m[1])).toBeLessThanOrEqual(20)
    }
    expect(tasks.some((t) => /Unabhängig vom ersten Ergebnis/.test(t.question))).toBe(true)
  })

  it('Regler: Startwert ist nie die Lösung', () => {
    const sliders = tasks.filter((t) => t.interactive?.type === 'paramSlider')
    expect(sliders.length).toBeGreaterThan(50)
    for (const t of sliders) {
      const p = (t.interactive!.props.params as Array<{ id: string; start: number }>)[0]!
      const want = (t.sampleAnswer as { values: Record<string, number> }).values[p.id]
      expect(p.start, t.question).not.toBe(want)
    }
  })

  it('MC: 4 Optionen, keine Option über 100 %', () => {
    for (const t of tasks.filter((x) => choicesOf(x))) {
      for (const c of choicesOf(t)!) expect(parseProbabilityLoose(c), t.question).toBeLessThanOrEqual(100)
    }
  })
})

describe('Politur (Gesamtcheck C, N5/N8/N9/N10)', () => {
  const percentValue = (c: string): number => Number(c.replace(/[^\d,]/g, '').replace(',', '.'))

  it('N5: laplace-prozent hat nie eine Prozent-Option über 100 % und immer 4 verschiedene Optionen', () => {
    expect(percentValue('300 %')).toBeGreaterThan(100) // Negativkontrolle für den Parser
    let mc = 0
    for (const t of sweep(topicOf(math8NeuTopics, 'k8-lb2-laplace-prozent__neu'), 12)) {
      const ch = choicesOf(t)
      if (!ch) continue
      mc++
      expect(new Set(ch).size, t.question).toBe(ch.length)
      if (ch.every((c) => /%$/.test(c))) {
        expect(ch.length, t.question).toBe(4)
        for (const c of ch) expect(percentValue(c), `${t.question} ${c}`).toBeLessThanOrEqual(100)
      }
    }
    expect(mc).toBeGreaterThan(300)
  })

  it('N8: Mittelsenkrechten-Lösungen (P, Q) benutzen das echte Minus "−", nie ASCII-"-" vor Ziffern', () => {
    const ascii = /(?:\(|\||\s)-\d/
    expect(ascii.test('Q(4|-3)')).toBe(true) // Negativkontrolle
    let negatives = 0
    for (const t of sweep(topicOf(math7NeuTopics, 'k7-lb1-mittelsenkrechte-schritte__neu'), 12)) {
      expect(`${t.question} ${t.solution} ${t.explanation}`, t.question).not.toMatch(ascii)
      if (/\|−\d|\(−\d/.test(t.solution)) negatives++
    }
    expect(negatives).toBeGreaterThan(10)
  })

  it('N9: Konzept-MC (Scheitel-/Basiswinkel): richtige Option ist nicht deutlich die längste', () => {
    const tooLong = (correct: string, wrongs: string[]): boolean =>
      correct.length > 1.2 * Math.max(...wrongs.map((w) => w.length))
    // Negativkontrolle mit dem früheren Wortlaut
    expect(
      tooLong(
        'Die beiden Basiswinkel liegen gegenüber den gleich langen Schenkeln und sind deshalb stets gleich groß.',
        ['Die Basiswinkel sind nur bei einem gleichseitigen Dreieck gleich groß.', 'Ein Basiswinkel ist immer größer als der Winkel an der Spitze.'],
      ),
    ).toBe(true)
    for (const id of ['k7-lb1-scheitelwinkel__neu', 'k7-lb1-basiswinkel__neu']) {
      let concept = 0
      for (const t of sweep(topicOf(math7NeuTopics, id), 12)) {
        if (!/^Welche Aussage( über die Basiswinkel im gleichschenkligen Dreieck)? ist richtig\?$/.test(t.question)) continue
        concept++
        const ch = choicesOf(t)!
        const correct = correctOf(t)
        expect(ch.length, t.question).toBe(4)
        expect(tooLong(correct, ch.filter((c) => c !== correct)), `${id}: ${correct}`).toBe(false)
      }
      expect(concept, id).toBeGreaterThan(30)
    }
  })

  it('N10: keine Geldbeträge mit 4+ Ziffern ohne Tausenderpunkt (K7/K8)', () => {
    const missingSeparator = /(?<![\d.,])\d{4,}(,\d+)?\s*(€|EUR|Euro)/
    expect(missingSeparator.test('3000,00 €')).toBe(true) // Negativkontrolle
    for (const topic of [...math7NeuTopics, ...math8NeuTopics]) {
      for (const t of sweep(topic, 4)) {
        const all = `${t.question} ${t.explanation} ${t.solution} ${(choicesOf(t) ?? []).join(' ')}`
        expect(all, t.question).not.toMatch(missingSeparator)
      }
    }
  })
})
