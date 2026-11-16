/**
 * Regressionen aus dem Gesamtcheck (Klasse 5, __neu-Themen): doppelte MC-Optionen, Grammatik,
 * Schreibweise negativer Zahlen, unrealistische Szenarien. Jeder Test läuft über >= 300 Seeds.
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { math5NeuTopics } from './math5NeuTopics'
import type { Task, Topic } from './types'

const SEEDS = Array.from({ length: 320 }, (_, i) => i * 7 + 3)
const PER_SEED = 12

const topicOf = (id: string): Topic => {
  const t = math5NeuTopics.find((x) => x.id === id)
  if (!t) throw new Error(`Thema ${id} nicht gefunden`)
  return t
}

const tasksOf = (id: string): Task[] => {
  const topic = topicOf(id)
  const out: Task[] = []
  for (const seed of SEEDS) {
    const rng = createRng(seed)
    for (let i = 0; i < PER_SEED; i++) out.push(topic.generate(rng))
  }
  return out
}

const choicesOf = (t: Task): string[] | null => {
  if (t.interactive?.type !== 'choicePick') return null
  return (t.interactive.props as { choices: string[] }).choices
}

const correctOf = (t: Task): string => (t.sampleAnswer as { choice: string }).choice

const TOUCHED = [
  'lb2-erweitern__neu',
  'lb2-anteil-bruch__neu',
  'lb2-mittelwert__neu',
  'lb2-zahlenstrahl__neu',
  'lb3-winkelarten__neu',
  'lb3-winkel-ergaenzung__neu',
  'lb3-achsensymmetrie__neu',
  'lb3-punktsymmetrie__neu',
  'lb3-strecken-laenge__neu',
  'lb3-strecken-mittelpunkt__neu',
  'lb3-strecken-bezeichnung__neu',
  'k5-umrechnen-zeit__neu',
]

const NEG_COORD_VALUE = (s: string): number | null => {
  const m = /^\((−?\d+)\|(−?\d+)\)$/.exec(s)
  return m ? Number(m[1]!.replace('−', '-')) : null
}

describe('math5 Neu: Qualitaets-Sweeps', () => {
  for (const id of TOUCHED) {
    describe(id, () => {
      const tasks = tasksOf(id)

      it('Multiple Choice hat nie doppelte Optionen und die richtige Antwort ist enthalten', () => {
        for (const t of tasks) {
          const c = choicesOf(t)
          if (!c) continue
          expect(new Set(c).size, `${t.question} -> ${c.join(' | ')}`).toBe(c.length)
          expect(c).toContain(correctOf(t))
        }
      })

      it('kein "1 <Plural>", keine ASCII-Anfuehrungszeichen um Buchstaben, kein "−-"/"+-"/"·-"', () => {
        for (const t of tasks) {
          const text = `${t.question} ${t.explanation}`
          expect(text).not.toMatch(/\b1 (Stunden|Teile|Felder|Striche|Minuten|Stücke|Kinder|Fische)\b/)
          expect(text).not.toMatch(/„[^“”"]{1,3}"/)
          expect(text).not.toMatch(/[−+·] ?-\d/)
          expect(text).not.toMatch(/[−+·]\s?−\d/)
          expect(text).not.toMatch(/undefined|NaN|\[object/)
          expect(t.explanation.charAt(0)).toBe(t.explanation.charAt(0).toUpperCase())
        }
      })
    })
  }

  it('Position der richtigen Antwort ist nicht fest (Mittelwert, Ergaenzung, Strecken, Punktsymmetrie)', () => {
    for (const id of ['lb2-mittelwert__neu', 'lb3-winkel-ergaenzung__neu', 'lb3-strecken-laenge__neu', 'lb3-punktsymmetrie__neu']) {
      const positions = new Set<number>()
      for (const t of tasksOf(id)) {
        const c = choicesOf(t)
        if (c && c.length === 4) positions.add(c.indexOf(correctOf(t)))
      }
      expect(positions.size, id).toBeGreaterThanOrEqual(3)
    }
  })

  it('erweitern: V1 hat immer Zaehler < Nenner (kein 3/3)', () => {
    for (const t of tasksOf('lb2-erweitern__neu')) {
      const m = /^Der Bruch (\d+)\/(\d+) wird erweitert/.exec(t.question)
      if (m) expect(Number(m[1])).toBeLessThan(Number(m[2]))
    }
  })

  it('anteil-bruch: Satzbau ohne "Gruppe von", ohne Genderstern, "Fischen" nur im Dativ-Zusammenhang; Teilen mit echten Bruechen', () => {
    for (const t of tasksOf('lb2-anteil-bruch__neu')) {
      expect(t.question).not.toMatch(/Gruppe von|:innen|der Fischen|NICHT\?/)
      const m = /Jedes Kind bekommt (\d+)\/(\d+) /.exec(t.solution)
      if (m) expect(Number(m[1])).toBeLessThan(Number(m[2]))
    }
  })

  it('mittelwert: Dezimal-Listen mit Semikolon, Mittel steht nicht in der MC-Liste, vier verschiedene Optionen', () => {
    let mc = 0
    for (const t of tasksOf('lb2-mittelwert__neu')) {
      if (/dieser (Temperaturen|Laufzeiten|Gewichte)/.test(t.question)) {
        expect(t.question).toMatch(/: \d+,\d; /)
        expect(t.question).not.toMatch(/\d, \d/)
      }
      const m = /^Wie groß ist das arithmetische Mittel von ([\d, ]+) und (\d+)\?$/.exec(t.question)
      if (m) {
        mc++
        const nums = [...m[1]!.split(', '), m[2]!]
        expect(nums).not.toContain(correctOf(t))
        expect(choicesOf(t)!.length).toBe(4)
      }
    }
    expect(mc).toBeGreaterThan(100)
  })

  it('zahlenstrahl: Zahlenfolge mit Semikolon als Trenner', () => {
    for (const t of tasksOf('lb2-zahlenstrahl__neu')) {
      if (t.question.startsWith('Die Zahlen')) expect(t.question).toMatch(/^Die Zahlen [\d,]+; [\d,]+; [\d,]+ folgen/)
    }
  })

  it('winkelarten: keine Rutsche mit 140 Grad, Stamm "Welche Winkelart hat"', () => {
    for (const t of tasksOf('lb3-winkelarten__neu')) {
      expect(t.question).not.toMatch(/passt am besten zu/)
      expect(t.question).not.toMatch(/Kinderrutsche[^?]*140/)
    }
  })

  it('winkel-ergaenzung: Nebenwinkel-MC hat immer vier verschiedene Optionen (x != 90, |180 - 2x| >= 40)', () => {
    let n = 0
    for (const t of tasksOf('lb3-winkel-ergaenzung__neu')) {
      const m = /Ein Winkel an der Kreuzung beträgt (\d+)°/.exec(t.question)
      if (!m) continue
      n++
      const x = Number(m[1])
      expect(x).not.toBe(90)
      expect(Math.abs(180 - 2 * x)).toBeGreaterThanOrEqual(40)
      expect(choicesOf(t)!.length).toBe(4)
    }
    expect(n).toBeGreaterThan(50)
  })

  it('achsensymmetrie: Dativ, keine Koordinatenachsen als "Gerade x = 0", kein K, Punkt A im Stamm', () => {
    for (const t of tasksOf('lb3-achsensymmetrie__neu')) {
      const text = `${t.question} ${t.explanation}`
      expect(text).not.toMatch(/an die (x-Achse|y-Achse|Gerade)/)
      expect(text).not.toMatch(/Gerade (x|y) = 0/)
      expect(t.question).not.toContain('„K“')
      if (t.question.startsWith('Spiegle')) expect(t.question).toMatch(/^Spiegle den Punkt A\(\d+\|\d+\) an der /)
    }
  })

  it('punktsymmetrie: MC-Optionen eindeutig, Zentrum nie im Ursprung, Rechnung mit Klammern', () => {
    let n = 0
    for (const t of tasksOf('lb3-punktsymmetrie__neu')) {
      const m = /^A\((−?\d+)\|(−?\d+)\) wird am Punkt S\((−?\d+)\|(−?\d+)\) punktgespiegelt/.exec(t.question)
      if (!m) continue
      n++
      expect(m[3] === '0' && m[4] === '0').toBe(false)
      expect(new Set(choicesOf(t)!).size).toBe(4)
      for (const c of choicesOf(t)!) expect(NEG_COORD_VALUE(c)).not.toBeNull()
    }
    expect(n).toBeGreaterThan(100)
  })

  it('strecken-laenge: AB != BC, nie 0 cm als Option, vier verschiedene Werte', () => {
    for (const t of tasksOf('lb3-strecken-laenge__neu')) {
      const c = choicesOf(t)
      if (!c) continue
      expect(c).not.toContain('0')
      expect(new Set(c).size).toBe(4)
      const m = /AB = (\d+) cm, BC = (\d+) cm/.exec(t.question)
      if (m) expect(m[1]).not.toBe(m[2])
    }
  })

  it('strecken-mittelpunkt: Optionen eindeutig, Koordinaten im Stamm, negative Zahlen in Klammern', () => {
    for (const t of tasksOf('lb3-strecken-mittelpunkt__neu')) {
      const c = choicesOf(t)
      if (c) expect(new Set(c).size).toBe(4)
      if (t.question.includes('Setze ihren Mittelpunkt')) expect(t.question).toMatch(/A\(−?\d+\|−?\d+\) und B\(−?\d+\|−?\d+\)/)
      expect(t.explanation).not.toMatch(/\+-|\+ -|·-/)
      expect(t.explanation).not.toMatch(/-\d/)
    }
  })

  it('strecken-mittelpunkt: der Mittelpunkt liegt nicht fast immer waagerecht', () => {
    let click = 0
    let horizontal = 0
    for (const t of tasksOf('lb3-strecken-mittelpunkt__neu')) {
      const m = /A\((−?\d+)\|(−?\d+)\) und B\((−?\d+)\|(−?\d+)\)\. Setze ihren/.exec(t.question)
      if (!m) continue
      click++
      if (m[2] === m[4]) horizontal++
    }
    expect(click).toBeGreaterThan(50)
    expect(horizontal / click).toBeLessThan(0.4)
  })

  it('strecken-bezeichnung: Erklaerung beginnt gross, Stamm im Nominativ nach Doppelpunkt', () => {
    for (const t of tasksOf('lb3-strecken-bezeichnung__neu')) {
      expect(t.explanation).not.toMatch(/^[a-zäöü]/)
      expect(t.question).not.toMatch(/beschreibt am besten/)
    }
  })

  it('zeit: nie "1 Stunden", Uhrzeit-Aufgaben nennen die Tageszeit, Zeiger-Beschreibung stimmt', () => {
    for (const t of tasksOf('k5-umrechnen-zeit__neu')) {
      expect(`${t.question} ${t.explanation} ${choicesOf(t)?.join(' ') ?? ''}`).not.toMatch(/\b1 Stunden\b/)
      if (/Zeige an der Uhr/.test(t.question)) expect(t.question).toMatch(/morgens|nachmittags|abends/)
      expect(t.question).not.toMatch(/Serienmarathon/)
      const m = /Minutenzeiger dann auf die (\d+), der Stundenzeiger steht kurz vor/.exec(t.explanation)
      if (m) expect(Number(m[1])).toBeGreaterThanOrEqual(9)
    }
  })
})
