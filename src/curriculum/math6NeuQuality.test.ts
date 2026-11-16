/**
 * Regressionstests (Inhaltsprüfung Klasse 6, __neu): jede gefundene Fehlerklasse wird über viele Seeds geprüft,
 * damit sie für keinen Seed mehr auftreten kann.
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { buildUniqueTaskRound } from './uniqueRound'
import { math6NeuTopics } from './math6NeuTopics'
import { valueTask } from './taskHelpers'
import type { Task, Topic } from './types'

const SEEDS = 320
const DRAWS = 6

const topicOf = (id: string): Topic => {
  const t = math6NeuTopics.find((x) => x.id === `${id}__neu`)
  if (!t) throw new Error(`Thema ${id} nicht gefunden`)
  return t
}

const sweep = (id: string): Task[] => {
  const topic = topicOf(id)
  const out: Task[] = []
  for (let seed = 1; seed <= SEEDS; seed++) {
    const rng = createRng(seed)
    for (let i = 0; i < DRAWS; i++) out.push(topic.generate(rng))
  }
  return out
}

const cache = new Map<string, Task[]>()
const tasksOf = (id: string): Task[] => {
  if (!cache.has(id)) cache.set(id, sweep(id))
  return cache.get(id)!
}

const choicesOf = (t: Task): string[] | null =>
  t.interactive?.type === 'choicePick' ? (t.interactive.props.choices as string[]) : null

const FIXED_TOPICS = [
  'lb1-kuerzen',
  'lb1-erweitern',
  'lb1-vergleichen',
  'lb1-prozent',
  'lb1-sachaufgabe-bruch',
  'lb2-proportional',
  'lb2-haeufigkeit',
  'lb3-winkel-dreieck',
  'lb3-winkel-viereck',
  'lb3-kongruenzsatz',
  'lb5-anteil-groesse',
  'lb5-anteil-prozent',
]

/** Fragen in der Form "n/d" (echte Brüche) im Text. */
const fractionsIn = (text: string): Array<[number, number]> =>
  [...text.matchAll(/(?<![\d/])(\d+)\/(\d+)(?![\d/])/g)].map((m) => [Number(m[1]), Number(m[2])])

describe('Klasse 6 Inhaltsprüfung: Textfehler in allen betroffenen Themen', () => {
  it.each(FIXED_TOPICS)('%s: kein "1 Teile/Felder", keine Mehrfach-Vorzeichen, Erklärung beginnt groß, Euro mit zwei Stellen', (id) => {
    for (const t of tasksOf(id)) {
      const all = `${t.question} ${t.explanation} ${t.solution}`
      expect(all, t.question).not.toMatch(/\b1 (Teile|Felder|Stücke|Stunden)\b/)
      expect(all, t.question).not.toMatch(/NaN|undefined|\[object/)
      expect(all, t.question).not.toMatch(/[−-]\s*[−-]\d|\+\s*[−-]\d|·\s*[−-]\d/)
      expect(t.explanation.trim(), t.question).not.toMatch(/^[a-zäöüß]{3,}\s/)
      expect(all, t.question).not.toMatch(/\d,\d(?!\d)\s*€/)
    }
  })

  it.each(FIXED_TOPICS)('%s: Mehrfachauswahl hat nie doppelte Optionen und enthält genau die richtige Antwort', (id) => {
    for (const t of tasksOf(id)) {
      const choices = choicesOf(t)
      if (!choices) continue
      expect(new Set(choices).size, t.question).toBe(choices.length)
      expect(choices.filter((c) => c === t.solution).length, t.question).toBe(1)
    }
  })

  it.each(['lb5-anteil-groesse', 'lb5-anteil-prozent', 'lb3-winkel-viereck', 'lb3-winkel-dreieck', 'lb1-sachaufgabe-bruch', 'lb1-kuerzen', 'lb1-erweitern', 'lb2-haeufigkeit'])(
    '%s: Auswahlfragen haben mindestens 4 Optionen (außer Ja/Nein), die richtige steht nicht immer an derselben Stelle',
    (id) => {
      const positions = new Set<number>()
      for (const t of tasksOf(id)) {
        const choices = choicesOf(t)
        if (!choices) continue
        if (choices.every((c) => c === 'Ja' || c === 'Nein')) continue
        expect(choices.length, t.question).toBeGreaterThanOrEqual(4)
        positions.add(choices.indexOf(t.solution))
      }
      expect(positions.size, id).toBeGreaterThanOrEqual(3)
    },
  )

  it.each(FIXED_TOPICS)('%s: Rundenlänge 10', (id) => {
    for (const seed of [1, 42, 999]) {
      expect(buildUniqueTaskRound(topicOf(id).generate, createRng(seed), 10, 400).length, `${id} seed=${seed}`).toBe(10)
    }
  })
})

describe('lb1-kuerzen', () => {
  it('V3: Distraktoren sind echte, gekürzte Brüche (nie "1", nie n/n, nie unecht)', () => {
    let seen = 0
    for (const t of tasksOf('lb1-kuerzen')) {
      if (!/NICHT vollständig gekürzt/.test(t.question)) continue
      seen++
      for (const c of choicesOf(t)!) {
        const m = /^(\d+)\/(\d+)$/.exec(c)
        expect(m, c).not.toBeNull()
        expect(Number(m![1]), c).toBeLessThan(Number(m![2]))
      }
    }
    expect(seen).toBeGreaterThan(30)
  })
})

describe('lb1-erweitern', () => {
  it('V2: genau eine Option ist wertgleich zum Ausgangsbruch, Ausgangsbruch ist echt', () => {
    let seen = 0
    for (const t of tasksOf('lb1-erweitern')) {
      const m = /gleichwertig zu (\d+)\/(\d+)/.exec(t.question)
      if (!m) continue
      seen++
      const [n, d] = [Number(m[1]), Number(m[2])]
      expect(n).toBeLessThan(d)
      const equal = choicesOf(t)!.filter((c) => {
        const [cn, cd] = c.split('/').map(Number)
        return cn! * d === n * cd!
      })
      expect(equal.length, t.question).toBe(1)
    }
    expect(seen).toBeGreaterThan(30)
  })
})

describe('lb1-vergleichen', () => {
  it('nur echte Brüche im Stamm (keine ganzen Zahlen, keine unechten Brüche)', () => {
    for (const t of tasksOf('lb1-vergleichen')) {
      if (!/^(Vergleiche|Welcher Bruch ist größer)/.test(t.question)) continue
      expect(t.question, t.question).not.toMatch(/\b(\d+) (oder|und) \d+\b(?!\/)/)
      for (const [n, d] of fractionsIn(t.question)) expect(n, t.question).toBeLessThan(d)
    }
  })

  it('Zahlenstrahl: Lösung liegt im Bereich des Zahlenstrahls', () => {
    let seen = 0
    for (const t of tasksOf('lb1-vergleichen')) {
      if (t.interactive?.type !== 'numberLine') continue
      seen++
      const p = t.interactive.props as { min: number; max: number }
      const v = (t.sampleAnswer as { value: number }).value
      expect(v, t.question).toBeGreaterThanOrEqual(p.min)
      expect(v, t.question).toBeLessThanOrEqual(p.max)
      const [a, b] = fractionsIn(t.question)
      expect(a![0] * b![1] === b![0] * a![1], t.question).toBe(false)
    }
    expect(seen).toBeGreaterThan(20)
  })

  it('Schlüssel unabhängig von der Reihenfolge des Paares (vertauschtes Paar ist dasselbe Paar)', () => {
    for (const t of tasksOf('lb1-vergleichen')) {
      const m = /^(vgl-(?:mc|tippen|wand)):(\d+\/\d+)\|(\d+\/\d+)$/.exec(t.dedupeKey ?? '')
      if (!t.dedupeKey || !t.dedupeKey.startsWith('vgl-')) continue
      expect(m, t.dedupeKey).not.toBeNull()
      expect([m![2], m![3]], t.dedupeKey).toEqual([m![2], m![3]].sort())
    }
  })
})

describe('lb1-sachaufgabe-bruch', () => {
  it('realistische Größen, Geld mit zwei Stellen, Gesamtmenge mit n >= 2 Teilen', () => {
    for (const t of tasksOf('lb1-sachaufgabe-bruch')) {
      const buch = /Ein Buch hat (\d+) Seiten/.exec(t.question)
      if (buch) expect(Number(buch[1]), t.question).toBeGreaterThanOrEqual(100)
      const mehl = /braucht (\d+) g Mehl/.exec(t.question)
      if (mehl) expect(Number(mehl[1]), t.question).toBeGreaterThanOrEqual(100)
      const halle = /Tribüne hat (\d+) Sitzplätze|(\d+) Karten gedruckt/.exec(t.question)
      if (halle) expect(Number(halle[1] ?? halle[2]), t.question).toBeGreaterThanOrEqual(60)
      expect(t.question, t.question).not.toMatch(/Sporthalle|Menge sind/)
      if (/Wie viel Geld spart/.test(t.question)) expect(t.solution, t.question).toMatch(/,\d\d €$/)
      if (/^(Von den Büchern|\d+\/\d+ der Kinder)/.test(t.question)) {
        const m = /(\d+)\/(\d+)/.exec(t.question)!
        expect(Number(m[1]), t.question).toBeGreaterThanOrEqual(2)
      }
    }
  })

  it('Auswahlfrage: Anteil und Rest sind nie gleich (kein 1/2)', () => {
    for (const t of tasksOf('lb1-sachaufgabe-bruch')) {
      if (!/Sitzplätze|Karten gedruckt/.test(t.question)) continue
      const [n, d] = fractionsIn(t.question)[0]!
      expect(2 * n, t.question).not.toBe(d)
    }
  })

  it('Verteil-Aufgaben überschneiden sich nicht mit den Zahlenpaaren aus Klasse 5 (3/4, 3/5, 2/3)', () => {
    for (const t of tasksOf('lb1-sachaufgabe-bruch')) {
      const m = /^(\d+) .* werden gerecht an (\d+) Kinder verteilt/.exec(t.question)
      if (!m) continue
      const [count, persons] = [Number(m[1]), Number(m[2])]
      expect([[3, 4], [3, 5], [2, 3]].some(([c, p]) => c === count && p === persons), `${count}/${persons}`).toBe(false)
    }
  })
})

describe('lb2-proportional', () => {
  it('Verhältnisleiste: Singular bei 1 und richtiger Kasus', () => {
    for (const t of tasksOf('lb2-proportional')) {
      const all = `${t.question} ${t.explanation} ${t.solution}`
      expect(all).not.toMatch(/zu (blaue|weiße|Nüsse|Haferflocken|Apfelsaft|Wasser|Zement|Sand)\b/)
      expect(all).not.toMatch(/\b1 (Felder|Teile)\b/)
    }
  })

  it('Konzeptfrage wechselt (mindestens 3 verschiedene Fragen) und die Lösung steht nicht immer an derselben Stelle', () => {
    const qs = new Set<string>()
    const pos = new Set<number>()
    for (const t of tasksOf('lb2-proportional')) {
      if (!t.dedupeKey?.startsWith('lb2prop-konzept')) continue
      qs.add(t.question)
      pos.add(choicesOf(t)!.indexOf(t.solution))
    }
    expect(qs.size).toBe(3)
    expect(pos.size).toBeGreaterThanOrEqual(3)
  })

  it('Rezepte: Gesamtmenge bei Saft/Kinderpunsch mindestens 240 ml und unter 1000 ml', () => {
    for (const t of tasksOf('lb2-proportional')) {
      const m = /(Saftschorle|Kinderpunsch).* insgesamt ([\d.]+) ml/.exec(t.question)
      if (m) {
        expect(m[2], t.question).not.toContain('.')
        expect(Number(m[2]), t.question).toBeGreaterThanOrEqual(240)
      }
    }
  })
})

describe('lb2-haeufigkeit', () => {
  it('V1: Ergebnis hat höchstens zwei Nachkommastellen (keine ungenannte Rundung), Gesamtzahl passt zu einer Schule', () => {
    let seen = 0
    for (const t of tasksOf('lb2-haeufigkeit')) {
      const m = /wurden (\d+) Kinder gefragt\. (\d+) davon/.exec(t.question)
      if (!m) continue
      seen++
      const [total, k] = [Number(m[1]), Number(m[2])]
      expect(Math.abs(((k * 10000) / total) - Math.round((k * 10000) / total)), t.question).toBeLessThan(1e-9)
      expect(t.question).toMatch(/an einer Schule/)
    }
    expect(seen).toBeGreaterThan(20)
  })

  it('V2: absolute Häufigkeit ist immer eine ganze Zahl (total · Prozent / 100)', () => {
    let seen = 0
    for (const t of tasksOf('lb2-haeufigkeit')) {
      const m = /Glücksrad wurde (\d+)-mal gedreht.* in (\d+) % der Fälle/.exec(t.question)
      if (!m) continue
      seen++
      const [total, p] = [Number(m[1]), Number(m[2])]
      expect((total * p) % 100, t.question).toBe(0)
      expect(Number(t.solution), t.question).toBe((total * p) / 100)
    }
    expect(seen).toBeGreaterThan(20)
  })

  it('V3: Anzahl entspricht einem ganzzahligen Anteil der Versuche', () => {
    let seen = 0
    for (const t of tasksOf('lb2-haeufigkeit')) {
      const m = /Es wurden insgesamt (\d+) Versuche gemacht/.exec(t.question)
      if (!m) continue
      seen++
      const f = /ist (\d+)\/(\d+) =/.exec(t.explanation)!
      expect((Number(m[1]) * Number(f[1])) % Number(f[2]), t.question).toBe(0)
      expect(Number.isInteger(Number(t.solution))).toBe(true)
    }
    expect(seen).toBeGreaterThan(20)
  })

  it('Thema: mindestens ein Drittel der Aufgaben fragt nach relativer Häufigkeit oder Prozent', () => {
    const tasks = tasksOf('lb2-haeufigkeit')
    const fit = tasks.filter((t) => /Prozent|%|relative|Anteil/.test(`${t.question} ${t.explanation}`))
    expect(fit.length / tasks.length).toBeGreaterThan(0.45)
  })

  it('Tabellen-Aufgaben: Prozentwert ist ganzzahlig und stimmt', () => {
    let seen = 0
    for (const t of tasksOf('lb2-haeufigkeit')) {
      if (!t.dedupeKey?.startsWith('lb2haeuf-tabelle-prozent')) continue
      seen++
      expect(Number.isInteger(Number(t.solution.replace(' %', '').replace(',', '.'))), t.solution).toBe(true)
    }
    expect(seen).toBeGreaterThan(20)
  })
})

describe('lb3-winkel-dreieck', () => {
  it('gesuchter Winkel steht nicht in der Frage (kein Spoiler), Winkel realistisch', () => {
    let seen = 0
    for (const t of tasksOf('lb3-winkel-dreieck')) {
      const sol = Number(t.solution.replace('°', ''))
      const given = [...t.question.matchAll(/(\d+)°/g)].map((m) => Number(m[1]))
      if (/zwei Winkel|α =/.test(t.question)) {
        seen++
        expect(given, t.question).not.toContain(sol)
        expect(sol, t.question).toBeGreaterThanOrEqual(30)
        expect(sol, t.question).toBeLessThan(180)
        expect(sol + given[0]! + given[1]!, t.question).toBe(180)
      }
      if (/gleichschenkligen/.test(t.question)) {
        seen++
        expect(given, t.question).not.toContain(sol)
      }
    }
    expect(seen).toBeGreaterThan(100)
  })

  it('Konzeptfrage: richtige Antwort nicht immer die längste und Fragen wechseln', () => {
    let longest = 0
    let n = 0
    const qs = new Set<string>()
    for (const t of tasksOf('lb3-winkel-dreieck')) {
      if (!t.dedupeKey?.startsWith('lb3dreieck-konzept')) continue
      n++
      qs.add(t.question)
      const choices = choicesOf(t)!
      if (t.solution.length === Math.max(...choices.map((c) => c.length))) longest++
    }
    expect(qs.size).toBe(3)
    expect(longest / n).toBeLessThan(0.7)
  })
})

describe('lb3-winkel-viereck', () => {
  it('vierter Winkel liegt in (0°, 180°), ist realistisch (50°–140°) und steht nicht in der Frage', () => {
    let seen = 0
    for (const t of tasksOf('lb3-winkel-viereck')) {
      const m = /α = (\d+)°, β = (\d+)° und γ = (\d+)°|drei Winkel (\d+)°, (\d+)° und (\d+)°/.exec(t.question)
      if (!m) continue
      seen++
      const [a, b, c] = (m[1] ? [m[1], m[2], m[3]] : [m[4], m[5], m[6]]).map(Number)
      const d = 360 - a! - b! - c!
      expect(d, t.question).toBeGreaterThanOrEqual(50)
      expect(d, t.question).toBeLessThanOrEqual(140)
      expect([a, b, c], t.question).not.toContain(d)
      expect(Number(t.solution.replace('°', '')), t.question).toBe(d)
      const choices = choicesOf(t)
      if (choices) for (const x of choices) expect(Number(x.replace('°', '')), t.question).toBeGreaterThan(0), expect(Number(x.replace('°', '')), t.question).toBeLessThan(180)
    }
    expect(seen).toBeGreaterThan(150)
  })

  it('kein Klasse-7-Stoff (kein Fünfeck, keine Formel (n − 2))', () => {
    for (const t of tasksOf('lb3-winkel-viereck')) {
      expect(`${t.question} ${t.explanation}`).not.toMatch(/Fünfeck|\(n − 2\)|n-Eck/)
    }
  })
})

describe('lb3-kongruenzsatz', () => {
  it('SSS-Aufgaben erfüllen die Dreiecksungleichung', () => {
    let seen = 0
    for (const t of tasksOf('lb3-kongruenzsatz')) {
      const m = /a = (\d+) cm, b = (\d+) cm, c = (\d+) cm\. Welcher Kongruenzsatz/.exec(t.question)
      if (!m) continue
      seen++
      const [a, b, c] = [Number(m[1]), Number(m[2]), Number(m[3])]
      expect(a + b, t.question).toBeGreaterThan(c)
      expect(a + c, t.question).toBeGreaterThan(b)
      expect(b + c, t.question).toBeGreaterThan(a)
    }
    expect(seen).toBeGreaterThan(30)
  })

  it('Texteingabe-Aufgaben decken SSS, SWS und WSW ab', () => {
    const sols = new Set(tasksOf('lb3-kongruenzsatz').filter((t) => t.dedupeKey?.startsWith('lb3kong-text')).map((t) => t.solution))
    expect(sols).toEqual(new Set(['SSS', 'SWS', 'WSW']))
  })

  it('SsW steht in den Auswahlaufgaben nicht immer an letzter Stelle', () => {
    const pos = new Set<number>()
    for (const t of tasksOf('lb3-kongruenzsatz')) {
      const choices = choicesOf(t)
      if (!choices || !choices.includes('SsW')) continue
      pos.add(choices.indexOf('SsW'))
    }
    expect(pos.size).toBe(4)
  })

  it('Ja/Nein-Aufgaben: beide Antworten kommen vor', () => {
    const sols = new Set(tasksOf('lb3-kongruenzsatz').filter((t) => t.dedupeKey?.startsWith('lb3kong-ja-nein')).map((t) => t.solution))
    expect(sols).toEqual(new Set(['Ja', 'Nein']))
  })
})

describe('lb5-anteil-groesse', () => {
  it('Auswahlaufgaben haben immer vier verschiedene Optionen und Euro mit zwei Stellen', () => {
    let seen = 0
    for (const t of tasksOf('lb5-anteil-groesse')) {
      if (!/^Berechne \d+\/\d+ von/.test(t.question)) continue
      seen++
      expect(choicesOf(t)!.length, t.question).toBe(4)
      if (/€/.test(t.question)) for (const c of choicesOf(t)!) expect(c).toMatch(/,\d\d €$/)
    }
    expect(seen).toBeGreaterThan(30)
  })

  it('Hauptfall "n/d von G" kommt vor und ist richtig gerechnet', () => {
    let seen = 0
    for (const t of tasksOf('lb5-anteil-groesse')) {
      if (!t.dedupeKey?.startsWith('lb5anteilgroesse-von')) continue
      seen++
      const [n, d] = fractionsIn(t.question)[0]!
      const g = /(\d+)(?:,\d\d)? (g|km|€)/.exec(t.question)!
      const sol = Number(t.solution.replace(/[^\d,]/g, '').replace(',', '.'))
      expect(sol, t.question).toBeCloseTo((n / d) * Number(g[1]), 6)
    }
    expect(seen).toBeGreaterThan(30)
  })
})

describe('lb5-anteil-prozent', () => {
  it('Hauptfall "x % von G" kommt vor, Euro immer mit zwei Nachkommastellen', () => {
    let hauptfall = 0
    for (const t of tasksOf('lb5-anteil-prozent')) {
      if (t.dedupeKey?.startsWith('lb5anteilprozent-wert') || t.dedupeKey?.startsWith('lb5anteilprozent-von')) hauptfall++
      const all = `${t.question} ${t.explanation} ${t.solution}`
      expect(all, t.question).not.toMatch(/\d,\d(?!\d)\s*€/)
    }
    expect(hauptfall).toBeGreaterThan(100)
  })

  it('Prozentwert-Aufgaben: Lösung = Grundwert · Prozentsatz : 100', () => {
    for (const t of tasksOf('lb5-anteil-prozent')) {
      const m = /Wie viel sind (\d+) % von (\d+)(?:,\d\d)? /.exec(t.question)
      if (!m) continue
      const sol = Number(t.solution.replace(/[^\d,]/g, '').replace(',', '.'))
      expect(sol, t.question).toBeCloseTo((Number(m[1]) * Number(m[2])) / 100, 6)
    }
  })
})

describe('Klasse 6 Politur (Gesamtcheck C, N1/N2/N4/N6/N8/N10/N11/N13)', () => {
  const ALL_IDS = math6NeuTopics.map((t) => t.id.replace(/__neu$/, ''))

  it('N1: lb2-haeufigkeit nennt nie "1 Kinder" (Singular wird korrekt gebildet)', () => {
    const bad = /\b1 Kinder\b/
    expect(bad.test('sind 1 Kinder')).toBe(true) // Negativkontrolle
    let ones = 0
    for (const t of tasksOf('lb2-haeufigkeit')) {
      const all = `${t.question} ${t.explanation} ${t.solution} ${(choicesOf(t) ?? []).join(' ')}`
      expect(all, t.question).not.toMatch(bad)
      if (/\b1 Kind\b/.test(all)) ones++
    }
    expect(ones).toBeGreaterThan(0) // der Singular-Fall kommt tatsächlich vor
  })

  it('N2: Umkehraufgaben stehen im Dativ ("entsprechen 98 Kindern")', () => {
    const nominative = /entsprechen \d+ (Kinder|Bücher|Sitzplätze|Karten|Plätze)\b/
    expect(nominative.test('2 Teile entsprechen 98 Kinder')).toBe(true) // Negativkontrolle
    let dative = 0
    for (const id of ALL_IDS) {
      for (const t of tasksOf(id)) {
        expect(t.explanation, t.question).not.toMatch(nominative)
        if (/entsprechen \d+ (Kindern|Büchern)\b/.test(t.explanation)) dative++
      }
    }
    expect(dative).toBeGreaterThan(50)
  })

  it('N4: vergleichen zeigt nie zwei identisch aussehende Brüche; "=" bleibt über erweiterte Formen erhalten', () => {
    const identical = (q: string): boolean => {
      const m = /Vergleiche: (\d+)\/(\d+) ___ (\d+)\/(\d+)/.exec(q)
      return !!m && m[1] === m[3] && m[2] === m[4]
    }
    expect(identical('Vergleiche: 1/2 ___ 1/2')).toBe(true) // Negativkontrolle
    let equalSign = 0
    let typed = 0
    for (const t of tasksOf('lb1-vergleichen')) {
      expect(identical(t.question), t.question).toBe(false)
      if (/^Vergleiche: /.test(t.question)) {
        typed++
        if (t.solution === '=') equalSign++
      }
    }
    expect(typed).toBeGreaterThan(100)
    expect(equalSign).toBeGreaterThan(0)
  })

  it('N6: kürzen-MC hat nur echte Brüche, vier verschiedene Optionen, höchstens eine wertgleiche falsche Option', () => {
    const proper = (c: string): boolean => {
      const m = /^(\d+)\/(\d+)$/.exec(c)
      return !!m && Number(m[1]) < Number(m[2])
    }
    expect(['2/1', '4/3', '3/2'].every(proper)).toBe(false) // Negativkontrolle
    let mc = 0
    for (const t of tasksOf('lb1-kuerzen')) {
      const choices = choicesOf(t)
      if (!choices) continue
      mc++
      expect(new Set(choices).size, t.question).toBe(4)
      for (const c of choices) expect(proper(c), `${t.question} ${c}`).toBe(true)
      const value = (c: string) => {
        const [n, d] = c.split('/').map(Number)
        return n! / d!
      }
      const correct = (t.sampleAnswer as { choice: string }).choice
      const equalWrong = choices.filter((c) => c !== correct && Math.abs(value(c) - value(correct)) < 1e-9)
      // nur bei "vollständig gekürzt" darf die ungekürzte Ausgangsform als Distraktor stehen
      expect(equalWrong.length, t.question).toBeLessThanOrEqual(1)
    }
    expect(mc).toBeGreaterThan(300)
  })

  it('N8: Lösungs-, Frage- und Erklärungstexte der Konstruktionsaufgaben enthalten kein ASCII-Minus vor Ziffern', () => {
    const ascii = /(?:\(|\||\s)-\d/
    expect(ascii.test('Dreieck ABC mit C(-3|4)')).toBe(true) // Negativkontrolle
    for (const t of tasksOf('lb3-kongruenzsatz')) {
      expect(`${t.question} ${t.solution} ${t.explanation}`, t.question).not.toMatch(ascii)
    }
  })

  it('N10: Geldbeträge und große Zahlen mit Tausenderpunkt; Eingaben "3000", "3000,00" und "3.000,00" gelten', () => {
    const missingSeparator = /(?<![\d.,])\d{4,}(,\d+)?\s*(€|EUR|Euro)/
    expect(missingSeparator.test('3000,00 €')).toBe(true) // Negativkontrolle
    expect(missingSeparator.test('3.000,00 €')).toBe(false)
    for (const id of ALL_IDS) {
      for (const t of tasksOf(id)) {
        const all = `${t.question} ${t.explanation} ${t.solution} ${(choicesOf(t) ?? []).join(' ')}`
        expect(all, t.question).not.toMatch(missingSeparator)
      }
    }
    const task = valueTask({ question: '?', answerKind: 'decimal', value: 3000, solution: '3.000,00 €', explanation: 'x' })
    for (const input of ['3000', '3000,00', '3.000,00', '3000.00']) {
      expect(task.check({ kind: 'value', value: input }), input).toBe(true)
    }
    expect(task.check({ kind: 'value', value: '300,00' })).toBe(false)
  })

  it('N10: lb5-anteil-prozent-MC hat 4 verschiedene, plausible Optionen (unter dem Grundwert, mindestens 1)', () => {
    let mc = 0
    for (const t of tasksOf('lb5-anteil-prozent')) {
      const m = /^Wie viel sind (\d+) % von ([\d.]+(?:,\d+)?) /.exec(t.question)
      const choices = choicesOf(t)
      if (!m || !choices) continue
      mc++
      const whole = Number(m[2]!.replace(/\./g, '').replace(',', '.'))
      expect(new Set(choices).size, t.question).toBe(4)
      for (const c of choices) {
        const v = Number(c.replace(/[^\d,]/g, '').replace(',', '.'))
        expect(v, `${t.question} ${c}`).toBeGreaterThanOrEqual(1)
        expect(v, `${t.question} ${c}`).toBeLessThan(whole)
      }
    }
    expect(mc).toBeGreaterThan(50)
  })

  it('N11: Anteil-Sachaufgaben ohne unrealistischen Käseanteil im Pizzateig', () => {
    expect(/Pizzateig/.test('Ein Pizzateig wiegt 360 g. 5/8 davon ist Käse.')).toBe(true) // Negativkontrolle
    let obstsalat = 0
    for (const t of tasksOf('lb5-anteil-groesse')) {
      expect(t.question).not.toMatch(/Pizzateig|davon ist /)
      if (/Obstsalat/.test(t.question)) obstsalat++
    }
    expect(obstsalat).toBeGreaterThan(10)
  })

  it('N13: lb1-prozent-MC hat immer vier verschiedene Optionen mit der richtigen Antwort', () => {
    let mc = 0
    for (const t of tasksOf('lb1-prozent')) {
      const choices = choicesOf(t)
      if (!choices) continue
      mc++
      expect(new Set(choices).size, t.question).toBe(4)
      expect(choices).toContain((t.sampleAnswer as { choice: string }).choice)
      for (const c of choices) {
        const v = Number(c.replace(/[^\d,]/g, '').replace(',', '.'))
        expect(v, `${t.question} ${c}`).toBeLessThanOrEqual(100)
      }
    }
    expect(mc).toBeGreaterThan(100)
    expect(new Set(['9/10', '3/5', '1/2']).size).not.toBe(4) // Negativkontrolle
  })
})
