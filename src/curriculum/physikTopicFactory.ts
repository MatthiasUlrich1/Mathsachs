import { pick, randInt, type Rng } from '../lib/rng'
import {
  choicePickTask,
  dragDropSortTask,
  mixedVariants,
  multiSelectTask,
  valueTask,
} from './taskHelpers'
import type { Topic } from './types'

const shuffleChoices = (rng: Rng, choices: string[], correct: string): string[] => {
  const list = [...choices]
  for (let i = list.length - 1; i > 0; i--) {
    const j = randInt(rng, 0, i)
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  if (!list.includes(correct)) list[0] = correct
  return list
}

type Case = { q: string; correct: string; wrong: string[] }

/** Build a playable generator from a topic title — used for newly split Lernbereich themes. */
export function makePhysikTopicGenerate(topicId: string, title: string): Topic['generate'] {
  const lower = `${topicId} ${title}`.toLowerCase()

  if (/dichte|dichte/.test(lower) && /stoff|vergleich/.test(lower)) {
    return mixedVariants(
      (rng) => {
        const dens = pick(rng, [
          { s: 'Wasser', r: 1 },
          { s: 'Aluminium', r: 2.7 },
          { s: 'Eisen', r: 7.8 },
          { s: 'Holz (balsamähnlich)', r: 0.2 },
        ])
        const correct = dens.r < 1 ? 'schwimmt auf Wasser' : 'sinkt in Wasser'
        return choicePickTask({
          question: `Ein Körper aus ${dens.s} (ρ ≈ ${dens.r} g/cm³) in Wasser (1 g/cm³) …`,
          choices: shuffleChoices(rng, [correct, dens.r < 1 ? 'sinkt in Wasser' : 'schwimmt auf Wasser', 'verdampft sofort', 'wird zu Gas'], correct),
          correct,
          solution: correct,
          explanation: 'Vergleiche die Dichten: ρ_Körper < ρ_Flüssigkeit → schwimmen (vereinfacht).',
          instruction: 'Tippe die passende Aussage:',
        })
      },
      (rng) => {
        const m = pick(rng, [20, 40, 50, 80, 100])
        const v = pick(rng, [2, 4, 5, 10])
        const rho = m / v
        return valueTask({
          question: `m = ${m} g, V = ${v} cm³. Berechne ρ = m/V.`,
          answerKind: rho % 1 === 0 ? 'integer' : 'decimal',
          unit: 'g/cm³',
          value: rho,
          solution: `${rho} g/cm³`,
          explanation: `ρ = ${m}/${v} = ${rho} g/cm³.`,
        })
      },
    )
  }

  if (/ohm|widerstand|kennlinie/.test(lower)) {
    return mixedVariants(
      (rng) => {
        const u = pick(rng, [2, 4, 6, 8, 10, 12])
        const r = pick(rng, [2, 4, 5, 10])
        const i = u / r
        return valueTask({
          question: `U = ${u} V, R = ${r} Ω. Berechne I = U/R.`,
          answerKind: i % 1 === 0 ? 'integer' : 'decimal',
          unit: 'A',
          value: i,
          solution: `${i} A`,
          explanation: `I = U/R = ${u}/${r} = ${i} A.`,
        })
      },
      (rng) => {
        const correct = 'I = U / R'
        return choicePickTask({
          question: 'Welche Form des Ohmschen Gesetzes gilt für den Strom?',
          choices: shuffleChoices(rng, [correct, 'I = U · R', 'I = R / U', 'I = U + R'], correct),
          correct,
          solution: correct,
          explanation: 'Je größer R, desto kleiner I bei fester Spannung.',
          instruction: 'Tippe die Formel:',
        })
      },
      (_rng) =>
        multiSelectTask({
          question: 'Was gehört zu einem ohmschen Bauelement? (mehrere möglich)',
          choices: [
            'U und I sind proportional',
            'R ist (näherungsweise) konstant',
            'Kennlinie ist eine Gerade durch den Ursprung',
            'Strom fließt nur ohne Spannung',
            'Widerstand wächst immer mit der Zeit von allein',
          ],
          correct: [
            'U und I sind proportional',
            'R ist (näherungsweise) konstant',
            'Kennlinie ist eine Gerade durch den Ursprung',
          ],
          solution: 'Proportionalität U–I, konstantes R, lineare Kennlinie',
          explanation: 'Ohmsches Verhalten: I ~ U bei konstantem R.',
          instruction: 'Tippe alle zutreffenden Aussagen:',
        }),
    )
  }

  if (/wirkungsgrad|η|eta/.test(lower) || /wirkungsgrad/.test(title.toLowerCase())) {
    return mixedVariants(
      (rng) => {
        const en = pick(rng, [20, 30, 40, 50, 60])
        const ez = pick(rng, [50, 60, 80, 100])
        if (en >= ez) {
          const e2 = 100
          const e1 = 40
          return valueTask({
            question: `E_nutz = ${e1} J, E_zu = ${e2} J. Wirkungsgrad η = E_nutz/E_zu · 100 %.`,
            answerKind: 'integer',
            unit: '%',
            value: 40,
            solution: '40 %',
            explanation: `η = ${e1}/${e2}·100 % = 40 %.`,
          })
        }
        const eta = Math.round((en / ez) * 100)
        return valueTask({
          question: `E_nutz = ${en} J, E_zu = ${ez} J. Gib η in % an (ganzzahlig gerundet).`,
          answerKind: 'integer',
          unit: '%',
          value: eta,
          solution: `${eta} %`,
          explanation: `η = ${en}/${ez}·100 % ≈ ${eta} %.`,
        })
      },
      (rng) => {
        const correct = 'E_nutz / E_zu'
        return choicePickTask({
          question: 'Wirkungsgrad η ist das Verhältnis …',
          choices: shuffleChoices(rng, [correct, 'E_zu / E_nutz', 'E_nutz · E_zu', 'E_zu − E_nutz'], correct),
          correct,
          solution: correct,
          explanation: 'η = genutzte Energie / zugeführte Energie (oft in %).',
          instruction: 'Tippe das Verhältnis:',
        })
      },
    )
  }

  if (/halbwert/.test(lower)) {
    return mixedVariants(
      (rng) => {
        const n0 = pick(rng, [80, 100, 160, 200])
        const steps = pick(rng, [1, 2, 3])
        const n = n0 / 2 ** steps
        return valueTask({
          question: `Startmenge ${n0}. Nach ${steps} Halbwertszeiten: wie viele Einheiten bleiben?`,
          answerKind: 'integer',
          value: n,
          solution: String(n),
          explanation: `Jede Halbwertszeit halbiert: ${n0} → … → ${n}.`,
        })
      },
      (rng) => {
        const correct = 'die Zeit, in der die Hälfte zerfällt'
        return choicePickTask({
          question: 'Was beschreibt die Halbwertszeit?',
          choices: shuffleChoices(
            rng,
            [correct, 'die Zeit bis alles zerfallen ist', 'die Zeit bis nichts zerfällt', 'die doppelte Zerfallszeit'],
            correct,
          ),
          correct,
          solution: correct,
          explanation: 'Nach einer Halbwertszeit ist noch die Hälfte der Ausgangsmenge da.',
          instruction: 'Tippe die Definition:',
        })
      },
    )
  }

  if (/frequenz|periodendauer|f = 1/.test(lower) || title.includes('Frequenz')) {
    return mixedVariants(
      (rng) => {
        const t = pick(rng, [2, 4, 5, 10])
        const f = 1 / t
        return valueTask({
          question: `T = ${t} s. Berechne f = 1/T.`,
          answerKind: f % 1 === 0 ? 'integer' : 'decimal',
          unit: 'Hz',
          value: f,
          solution: `${f} Hz`,
          explanation: `f = 1/${t} = ${f} Hz.`,
        })
      },
      (rng) => {
        const f = pick(rng, [2, 4, 5, 10])
        const t = 1 / f
        return valueTask({
          question: `f = ${f} Hz. Berechne T = 1/f.`,
          answerKind: t % 1 === 0 ? 'integer' : 'decimal',
          unit: 's',
          value: t,
          solution: `${t} s`,
          explanation: `T = 1/${f} = ${t} s.`,
        })
      },
    )
  }

  if (/c =|wellenlänge|λ|lambda/.test(lower) || /c = λ/.test(title)) {
    return mixedVariants(
      (rng) => {
        const f = pick(rng, [2, 3, 4, 5]) // MHz-scale simplified as number
        const lambda = pick(rng, [2, 3, 4, 5])
        const c = f * lambda
        return valueTask({
          question: `λ = ${lambda} m, f = ${f} Hz. Berechne c = λ·f.`,
          answerKind: 'integer',
          unit: 'm/s',
          value: c,
          solution: `${c} m/s`,
          explanation: `c = ${lambda}·${f} = ${c} m/s.`,
        })
      },
      (rng) => {
        const correct = 'c = λ · f'
        return choicePickTask({
          question: 'Welche Beziehung gilt für Wellen?',
          choices: shuffleChoices(rng, [correct, 'c = λ / f', 'c = λ + f', 'c = f / λ'], correct),
          correct,
          solution: correct,
          explanation: 'Ausbreitungsgeschwindigkeit = Wellenlänge · Frequenz.',
          instruction: 'Tippe die Formel:',
        })
      },
    )
  }

  if (/gewichtskraft|f = m|f_g|newton.*kraft|kraftbegriff/.test(lower)) {
    return mixedVariants(
      (rng) => {
        const m = pick(rng, [2, 3, 4, 5, 6, 8, 10])
        const F = m * 10
        return valueTask({
          question: `m = ${m} kg, g ≈ 10 N/kg. Berechne F_G = m·g.`,
          answerKind: 'integer',
          unit: 'N',
          value: F,
          solution: `${F} N`,
          explanation: `F_G = ${m}·10 = ${F} N.`,
        })
      },
      (rng) => {
        const correct = 'Newton (N)'
        return choicePickTask({
          question: 'Welche Einheit hat die Kraft?',
          choices: shuffleChoices(rng, [correct, 'Joule (J)', 'Watt (W)', 'Pascal (Pa)'], correct),
          correct,
          solution: correct,
          explanation: 'Kraft wird in Newton gemessen.',
          instruction: 'Tippe die Einheit:',
        })
      },
    )
  }

  if (/druck|p = f/.test(lower)) {
    return mixedVariants(
      (rng) => {
        const f = pick(rng, [20, 40, 50, 100])
        const a = pick(rng, [2, 4, 5, 10])
        const p = f / a
        return valueTask({
          question: `F = ${f} N, A = ${a} m². Berechne p = F/A.`,
          answerKind: p % 1 === 0 ? 'integer' : 'decimal',
          unit: 'Pa',
          value: p,
          solution: `${p} Pa`,
          explanation: `p = ${f}/${a} = ${p} Pa.`,
        })
      },
      (rng) => {
        const correct = 'Pascal (Pa)'
        return choicePickTask({
          question: 'Einheit des Drucks?',
          choices: shuffleChoices(rng, [correct, 'Newton (N)', 'Joule (J)', 'Ampere (A)'], correct),
          correct,
          solution: correct,
          explanation: '1 Pa = 1 N/m².',
          instruction: 'Tippe die Einheit:',
        })
      },
    )
  }

  // Domain banks — echte Schulphysik, keine Meta-Fragen zu „Idee/Anwendung“.
  const bank = resolvePhysicsBank(topicId, title)
  return mixedVariants(
    (rng) => {
      const c = pick(rng, bank.cases)
      return choicePickTask({
        question: c.q,
        choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
        correct: c.correct,
        solution: c.correct,
        explanation: c.explanation ?? `Thema „${title}“: ${c.correct}`,
        instruction: 'Tippe die passende Aussage:',
      })
    },
    ...(bank.calc
      ? [
          (rng: Rng) => {
            const t = bank.calc!(rng)
            return valueTask({
              question: t.q,
              answerKind: t.answerKind,
              unit: t.unit,
              value: t.value,
              solution: t.solution,
              explanation: t.explanation,
            })
          },
        ]
      : []),
    (rng) => {
      const items = bank.sortItems
      const ordered = items.map((label, i) => ({ label, value: i + 1 }))
      const shuffled = [...ordered]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = randInt(rng, 0, i)
        ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
      }
      const correctOrder = ordered.map((row) => shuffled.findIndex((it) => it.value === row.value))
      return dragDropSortTask({
        question: bank.sortQuestion,
        items: shuffled,
        correctOrder,
        solution: ordered.map((r) => r.label).join(' → '),
        explanation: bank.sortExplanation,
      })
    },
  )
}

type CalcTask = {
  q: string
  answerKind: 'integer' | 'decimal'
  unit: string
  value: number
  solution: string
  explanation: string
}

type PhysicsBank = {
  cases: Array<Case & { explanation?: string }>
  calc?: (rng: Rng) => CalcTask
  sortItems: string[]
  sortQuestion: string
  sortExplanation: string
}

function resolvePhysicsBank(topicId: string, title: string): PhysicsBank {
  const lower = `${topicId} ${title}`.toLowerCase()

  if (/licht|optik|schatten|spiegel|strahl|auge|farbe|linse|brechung/.test(lower)) {
    return {
      cases: [
        {
          q: 'Wie breitet sich Licht in Luft aus?',
          correct: 'geradlinig und nach allen Seiten',
          wrong: ['nur im Kreis', 'nur nach oben', 'gar nicht'],
          explanation: 'Licht breitet sich geradlinig und allseitig aus.',
        },
        {
          q: 'Was ist eine Lichtquelle?',
          correct: 'ein Körper, der selbst Licht aussendet',
          wrong: [
            'jeder Körper, den man sieht',
            'nur der Mond',
            'nur undurchsichtige Körper',
          ],
          explanation: 'Lichtquellen senden selbst Licht aus (Sonne, Kerze, Lampe).',
        },
        {
          q: 'Warum sehen wir den Mond?',
          correct: 'Er reflektiert Sonnenlicht',
          wrong: ['Er leuchtet selbst wie die Sonne', 'Er ist eine Wärmequelle', 'Er ist durchsichtig'],
          explanation: 'Der Mond ist ein beleuchteter Körper.',
        },
        {
          q: 'Kernschatten bedeutet:',
          correct: 'Bereich, in den von keiner Lampe Licht gelangt',
          wrong: [
            'Bereich mit Licht von allen Lampen',
            'nur der Schatten bei einer Kerze',
            'der hellste Bereich hinter dem Körper',
          ],
        },
        {
          q: 'Einfallswinkel = Ausfallswinkel gilt für …',
          correct: 'Reflexion am ebenen Spiegel',
          wrong: ['nur für Linsen', 'nur im Vakuum', 'nur bei Faraday'],
        },
      ],
      calc: (rng) => {
        const a = pick(rng, [20, 30, 40, 45, 50, 60])
        return {
          q: `Einfallswinkel am ebenen Spiegel: ${a}°. Wie groß ist der Ausfallswinkel?`,
          answerKind: 'integer',
          unit: '°',
          value: a,
          solution: `${a}°`,
          explanation: 'Reflexionsgesetz: Einfallswinkel = Ausfallswinkel.',
        }
      },
      sortItems: ['Lichtquelle', 'Gegenstand', 'Schirm/Schatten'],
      sortQuestion: 'Ordne den Weg des Lichts bei der Schattenentstehung.',
      sortExplanation: 'Licht kommt von der Quelle, trifft den Gegenstand, Schatten erscheint am Schirm.',
    }
  }

  if (/strom|elektr|spannung|widerstand|ladung|magnet|induktion|spule|kondensator/.test(lower)) {
    return {
      cases: [
        {
          q: 'Welche Formel gilt für den ohmschen Widerstand?',
          correct: 'R = U / I',
          wrong: ['R = U · I', 'R = I / U', 'R = U + I'],
        },
        {
          q: 'Einheit der elektrischen Spannung?',
          correct: 'Volt (V)',
          wrong: ['Ampere (A)', 'Ohm (Ω)', 'Watt (W)'],
        },
        {
          q: 'In einer Reihenschaltung ist der Strom …',
          correct: 'überall gleich groß',
          wrong: ['an jedem Widerstand anders', 'immer null', 'nur an der Batterie messbar'],
        },
        {
          q: 'Ein geschlossener Stromkreis braucht …',
          correct: 'Spannungsquelle und durchgehenden Leiterweg',
          wrong: ['nur eine Lampe ohne Batterie', 'nur Luft als Leiter', 'keinen Schalterweg'],
        },
      ],
      calc: (rng) => {
        const u = pick(rng, [3, 6, 9, 12])
        const r = pick(rng, [2, 3, 4, 6])
        const i = u / r
        return {
          q: `U = ${u} V, R = ${r} Ω. Berechne I = U/R.`,
          answerKind: i % 1 === 0 ? 'integer' : 'decimal',
          unit: 'A',
          value: i,
          solution: `${i} A`,
          explanation: `I = ${u}/${r} = ${i} A.`,
        }
      },
      sortItems: ['Batterie', 'Schalter', 'Verbraucher (Lampe)'],
      sortQuestion: 'Ordne typische Bauteile eines einfachen Stromkreises (Quelle → Schalter → Verbraucher).',
      sortExplanation: 'Spannung kommt von der Quelle; der Schalter unterbricht; die Lampe ist Verbraucher.',
    }
  }

  if (/kraft|druck|energie|arbeit|leistung|impuls|newton|reibung|hebel|dichte|masse|bewegung|geschwindigkeit|beschleunigung|fall|wärme|temperatur|aggregat/.test(lower)) {
    return {
      cases: [
        {
          q: 'Welche Einheit hat die Kraft?',
          correct: 'Newton (N)',
          wrong: ['Joule (J)', 'Watt (W)', 'Pascal (Pa)'],
        },
        {
          q: 'Druck p = F/A. Einheit?',
          correct: 'Pascal (Pa)',
          wrong: ['Newton (N)', 'Joule (J)', 'Ampere (A)'],
        },
        {
          q: 'Gewichtskraft näherungsweise (g ≈ 10 N/kg): F_G = …',
          correct: 'm · g',
          wrong: ['m / g', 'm + g', 'g / m'],
        },
        {
          q: 'Dichte ρ = …',
          correct: 'm / V',
          wrong: ['m · V', 'V / m', 'm + V'],
        },
      ],
      calc: (rng) => {
        const kind = pick(rng, ['dichte', 'kraft', 'druck'] as const)
        if (kind === 'dichte') {
          const m = pick(rng, [20, 40, 50, 80, 100])
          const v = pick(rng, [2, 4, 5, 10])
          const rho = m / v
          return {
            q: `m = ${m} g, V = ${v} cm³. Berechne ρ = m/V.`,
            answerKind: rho % 1 === 0 ? 'integer' : 'decimal',
            unit: 'g/cm³',
            value: rho,
            solution: `${rho} g/cm³`,
            explanation: `ρ = ${m}/${v} = ${rho} g/cm³.`,
          }
        }
        if (kind === 'kraft') {
          const m = pick(rng, [2, 3, 5, 8, 10])
          const F = m * 10
          return {
            q: `m = ${m} kg, g ≈ 10 N/kg. Berechne F_G = m·g.`,
            answerKind: 'integer',
            unit: 'N',
            value: F,
            solution: `${F} N`,
            explanation: `F_G = ${m}·10 = ${F} N.`,
          }
        }
        const f = pick(rng, [20, 40, 50, 100])
        const a = pick(rng, [2, 4, 5, 10])
        const p = f / a
        return {
          q: `F = ${f} N, A = ${a} m². Berechne p = F/A.`,
          answerKind: p % 1 === 0 ? 'integer' : 'decimal',
          unit: 'Pa',
          value: p,
          solution: `${p} Pa`,
          explanation: `p = ${f}/${a} = ${p} Pa.`,
        }
      },
      sortItems: ['Masse m', 'Volumen V', 'Dichte ρ = m/V'],
      sortQuestion: 'Ordne die Größen zur Dichtebestimmung.',
      sortExplanation: 'Zuerst Masse und Volumen messen, dann ρ = m/V berechnen.',
    }
  }

  if (/welle|schall|frequenz|periode|atom|kern|radioaktiv|photon|quant|feld|relativ/.test(lower)) {
    return {
      cases: [
        {
          q: 'Schall braucht zum Ausbreiten …',
          correct: 'ein Medium (z. B. Luft)',
          wrong: ['kein Medium', 'nur Vakuum', 'nur Licht'],
        },
        {
          q: 'Frequenz f und Periodendauer T hängen zusammen durch …',
          correct: 'f = 1 / T',
          wrong: ['f = T', 'f = T²', 'f = 1 · T'],
        },
        {
          q: 'Lichtgeschwindigkeit im Vakuum (Näherung)?',
          correct: '3·10⁸ m/s',
          wrong: ['3 m/s', '340 m/s', '3·10⁶ m/s'],
        },
      ],
      calc: (rng) => {
        const T = pick(rng, [0.2, 0.5, 1, 2])
        const f = 1 / T
        return {
          q: `Periodendauer T = ${T} s. Berechne f = 1/T.`,
          answerKind: f % 1 === 0 ? 'integer' : 'decimal',
          unit: 'Hz',
          value: f,
          solution: `${f} Hz`,
          explanation: `f = 1/${T} = ${f} Hz.`,
        }
      },
      sortItems: ['Schwingung anregen', 'Welle ausbreiten', 'Frequenz messen'],
      sortQuestion: 'Ordne einen typischen Versuchsablauf zur Frequenzmessung.',
      sortExplanation: 'Erst anregen, dann Ausbreitung beobachten, dann Frequenz bestimmen.',
    }
  }

  // Fallback: Rechen-/Formelaufgaben statt Philosophie
  return {
    cases: [
      {
        q: `Welche physikalische Größe gehört typischerweise zum Thema „${title}“?`,
        correct: pickDomainQuantity(lower),
        wrong: ['Kunststil', 'Lateinische Deklination', 'Musiktempo'],
        explanation: 'Physik-Themen arbeiten mit messbaren Größen und Einheiten.',
      },
      {
        q: 'Was gehört zu einer sinnvollen physikalischen Messung?',
        correct: 'Messwert mit Einheit angeben',
        wrong: ['nur raten', 'Einheit weglassen', 'Messgerät ignorieren'],
      },
      {
        q: 'Eine Formel in der Physik verknüpft …',
        correct: 'physikalische Größen miteinander',
        wrong: ['nur Wörter ohne Zahlen', 'nur Farben', 'nur historische Daten'],
      },
    ],
    calc: (rng) => {
      const v = pick(rng, [2, 3, 4, 5])
      const t = pick(rng, [2, 3, 4, 5])
      const s = v * t
      return {
        q: `Gleichförmige Bewegung: v = ${v} m/s, t = ${t} s. Berechne s = v·t.`,
        answerKind: 'integer',
        unit: 'm',
        value: s,
        solution: `${s} m`,
        explanation: `s = ${v}·${t} = ${s} m.`,
      }
    },
    sortItems: ['Größe messen', 'Formel anwenden', 'Ergebnis mit Einheit prüfen'],
    sortQuestion: 'Ordne die Schritte beim Lösen einer Rechenaufgabe in der Physik.',
    sortExplanation: 'Messen bzw. gegebene Werte nutzen, Formel anwenden, Einheit prüfen.',
  }
}

function pickDomainQuantity(lower: string): string {
  if (/licht|optik/.test(lower)) return 'Winkel / Weg des Lichts'
  if (/strom|elektr/.test(lower)) return 'Spannung / Stromstärke'
  if (/wärme|temperatur/.test(lower)) return 'Temperatur / Wärmeenergie'
  if (/kraft|druck/.test(lower)) return 'Kraft / Druck'
  return 'messbare Größen mit Einheiten'
}
