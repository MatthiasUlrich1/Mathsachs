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

  // Generic conceptual bank from title keywords
  const cases = buildConceptCases(title, topicId)
  return mixedVariants(
    (rng) => {
      const c = pick(rng, cases)
      return choicePickTask({
        question: c.q,
        choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
        correct: c.correct,
        solution: c.correct,
        explanation: `Thema „${title}“: ${c.correct}`,
        instruction: 'Tippe die passende Aussage:',
      })
    },
    (rng) => {
      const c = pick(rng, cases)
      const extras = cases.filter((x) => x.correct !== c.correct).slice(0, 2)
      const correctList = [c.correct, ...extras.map((e) => e.correct)].slice(0, 3)
      const wrongList = c.wrong.slice(0, 2)
      return multiSelectTask({
        question: `Welche Aussagen passen zu „${title}?“ (mehrere möglich)`,
        choices: [...correctList, ...wrongList],
        correct: correctList,
        solution: correctList.join('; '),
        explanation: `Kernaussagen zu „${title}“.`,
        instruction: 'Tippe alle zutreffenden Aussagen:',
      })
    },
    (rng) => {
      const items = [
        { label: `${title}: Grundidee`, value: 1 },
        { label: `${title}: Anwendung`, value: 2 },
        { label: `${title}: Kontrolle/Messung`, value: 3 },
      ]
      const ordered = [...items]
      for (let i = items.length - 1; i > 0; i--) {
        const j = randInt(rng, 0, i)
        ;[items[i], items[j]] = [items[j]!, items[i]!]
      }
      const correctOrder = ordered.map((row) => items.findIndex((it) => it.value === row.value))
      return dragDropSortTask({
        question: `Ordne die Schritte zu „${title}“ (Idee → Anwendung → Kontrolle).`,
        items,
        correctOrder,
        solution: ordered.map((r) => r.label).join(' → '),
        explanation: 'Zuerst Konzept, dann Anwendung, dann Kontrolle.',
      })
    },
  )
}

function buildConceptCases(title: string, _topicId: string): Case[] {
  const t = title
  return [
    {
      q: `Was ist der zentrale Inhalt von „${t}“?`,
      correct: `physikalische Zusammenhänge zu ${t}`,
      wrong: ['nur historische Daten ohne Physik', 'reine Mathematik ohne Größen', 'Chemie der Kunststoffe'],
    },
    {
      q: `Welche Herangehensweise passt zu „${t}“?`,
      correct: 'Beobachten, Messen, Schlussfolgern',
      wrong: ['raten ohne Messung', 'nur auswendig ohne Verständnis', 'Ergebnisse verwerfen'],
    },
    {
      q: `Wozu übt man „${t}“?`,
      correct: 'Alltags- und Technikphänomene erklären',
      wrong: ['Physik vermeiden', 'nur Kunst betrachten', 'ohne Größen arbeiten'],
    },
    {
      q: `Welche Aussage zu „${t}“ ist sinnvoll?`,
      correct: 'Fachbegriffe und Einheiten sorgfältig verwenden',
      wrong: ['Einheiten sind egal', 'Fachsprache stört nur', 'Messwerte braucht man nie'],
    },
    {
      q: `Beim Thema „${t}“ sollte man …`,
      correct: 'Größen, Einheiten und Zusammenhänge prüfen',
      wrong: ['Zahlen ohne Einheit nennen', 'Diagramme ignorieren', 'Hypothesen nie testen'],
    },
    {
      q: `„${t}“ gehört im Lehrplan vor allem zu …`,
      correct: 'Physik Gymnasium Sachsen',
      wrong: ['nur Sporttheorie', 'nur Kunstgeschichte', 'nur Latein'],
    },
  ]
}
