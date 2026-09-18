import { pick, randInt, type Rng } from '../lib/rng'
import {
  choicePickTask,
  dragDropSlotsTask,
  type DragDropSlotsCheckMode,
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

  if (/dichte/.test(lower) && /stoff|vergleich/.test(lower)) {
    return mixedVariants(
      (rng) => {
        const dens = pick(rng, [
          { s: 'Aluminium', r: 2.7 },
          { s: 'Eisen', r: 7.8 },
          { s: 'Holz (balsamähnlich)', r: 0.2 },
          { s: 'Kork', r: 0.25 },
          { s: 'Blei', r: 11.3 },
        ])
        const floats = dens.r < 1
        const correct = floats ? 'schwimmt' : 'sinkt zu Boden'
        const wrong = floats ? 'sinkt zu Boden' : 'schwimmt'
        return choicePickTask({
          question: `Ein Körper aus ${dens.s} (ρ ≈ ${dens.r} g/cm³) wird in Wasser (ρ ≈ 1 g/cm³) gelegt. Was passiert?`,
          choices: shuffleChoices(rng, [correct, wrong], correct),
          correct,
          solution: correct,
          explanation: floats
            ? `ρ_${dens.s} < ρ_Wasser → der Körper schwimmt.`
            : `ρ_${dens.s} > ρ_Wasser → der Körper sinkt zu Boden.`,
          instruction: 'Tippe die passende Aussage:',
        })
      },
      (rng) => {
        const a = pick(rng, [
          { s: 'Holz', r: 0.7 },
          { s: 'Wasser', r: 1 },
          { s: 'Aluminium', r: 2.7 },
          { s: 'Eisen', r: 7.8 },
          { s: 'Blei', r: 11.3 },
        ])
        let b = pick(rng, [
          { s: 'Holz', r: 0.7 },
          { s: 'Wasser', r: 1 },
          { s: 'Aluminium', r: 2.7 },
          { s: 'Eisen', r: 7.8 },
          { s: 'Blei', r: 11.3 },
        ])
        while (b.s === a.s) {
          b = pick(rng, [
            { s: 'Holz', r: 0.7 },
            { s: 'Wasser', r: 1 },
            { s: 'Aluminium', r: 2.7 },
            { s: 'Eisen', r: 7.8 },
            { s: 'Blei', r: 11.3 },
          ])
        }
        const correct = a.r > b.r ? a.s : b.s
        return choicePickTask({
          question: `Welche Dichte ist größer: ${a.s} (ρ ≈ ${a.r} g/cm³) oder ${b.s} (ρ ≈ ${b.r} g/cm³)?`,
          choices: shuffleChoices(rng, [a.s, b.s], correct),
          correct,
          solution: correct,
          explanation: `${correct} hat die höhere Dichte (${Math.max(a.r, b.r)} g/cm³ > ${Math.min(a.r, b.r)} g/cm³).`,
          instruction: 'Tippe den Stoff mit der höheren Dichte:',
        })
      },
      (rng) => {
        const correct = 'ρ_Körper > ρ_Wasser'
        return choicePickTask({
          question: 'Wann sinkt ein Körper in Wasser zu Boden?',
          choices: shuffleChoices(
            rng,
            [correct, 'ρ_Körper < ρ_Wasser', 'ρ_Körper = 0', 'nur wenn er heiß ist'],
            correct,
          ),
          correct,
          solution: correct,
          explanation: 'Ist die Dichte des Körpers größer als die von Wasser, sinkt er zu Boden.',
          instruction: 'Tippe die passende Bedingung:',
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
          question: `U = ${u} V, R = ${r} Ω. Berechne die Stromstärke.`,
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
            question: `E_nutz = ${e1} J, E_zu = ${e2} J. Gib den Wirkungsgrad in % an.`,
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
          question: `T = ${t} s. Berechne die Frequenz.`,
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
          question: `f = ${f} Hz. Berechne die Periodendauer.`,
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
          question: `λ = ${lambda} m, f = ${f} Hz. Berechne die Ausbreitungsgeschwindigkeit.`,
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
          question: `m = ${m} kg, g ≈ 10 N/kg. Berechne die Gewichtskraft.`,
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
          question: `F = ${f} N, A = ${a} m². Berechne den Druck.`,
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
      const parts = bank.formulaParts
      const distractor = bank.formulaDistractor
      const labels = distractor ? [...parts, distractor] : [...parts]
      const items = labels.map((label, i) => ({ label, value: i + 1 }))
      const shuffled = [...items]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = randInt(rng, 0, i)
        ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
      }
      const correctSlots = parts.map((label) => shuffled.findIndex((it) => it.label === label))
      return dragDropSlotsTask({
        question: bank.sortQuestion,
        items: shuffled,
        correctSlots,
        solution: parts.join(' '),
        explanation: bank.sortExplanation,
        instruction: distractor
          ? 'Ziehe die richtigen Blöcke in die Formelplätze. Einen Block brauchst du nicht.'
          : 'Ziehe die Blöcke in die Formelplätze (von links nach rechts).',
        ...(bank.formulaCheckMode ? { checkMode: bank.formulaCheckMode } : {}),
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
  /** Correct formula blocks left→right (fill these slots). */
  formulaParts: string[]
  /** Optional wrong block that must stay unused in the pool. */
  formulaDistractor?: string
  /** Pure products (V = l×b×h) allow any factor order after `=`. */
  formulaCheckMode?: DragDropSlotsCheckMode
  sortQuestion: string
  sortExplanation: string
}

/** Formula blocks for slot drag&drop; optional distractor stays unused. */
function formulaSort(
  parts: string[],
  /** What to build, without writing the formula (e.g. „das Quader-Volumen“). */
  what: string,
  /** Full formula only for explanation. */
  formula: string,
  distractor?: string,
  checkMode?: DragDropSlotsCheckMode,
): Pick<
  PhysicsBank,
  | 'formulaParts'
  | 'formulaDistractor'
  | 'formulaCheckMode'
  | 'sortQuestion'
  | 'sortExplanation'
> {
  return {
    formulaParts: parts,
    ...(distractor ? { formulaDistractor: distractor } : {}),
    ...(checkMode ? { formulaCheckMode: checkMode } : {}),
    sortQuestion: distractor
      ? `Baue die Formel für ${what}. Einen Block brauchst du nicht.`
      : `Baue die Formel für ${what} aus den Blöcken.`,
    sortExplanation: distractor
      ? `Richtige Formel: ${formula}. „${distractor}“ gehört nicht dazu.`
      : `Die Formel lautet ${formula}.`,
  }
}

function resolvePhysicsBank(topicId: string, title: string): PhysicsBank {
  const lower = `${topicId} ${title}`.toLowerCase()

  // --- Volumen (Klasse 6 u. a.) ---
  if (/volumen/.test(lower) && !/dichte/.test(lower)) {
    return {
      cases: [
        {
          q: 'Formel für das Volumen eines Quaders?',
          correct: 'V = l · b · h',
          wrong: ['V = l + b + h', 'V = l · b', 'V = m / ρ'],
        },
        {
          q: 'Welche Einheit passt zum Volumen?',
          correct: 'cm³ (oder m³, Liter)',
          wrong: ['cm²', 'm/s', 'Newton (N)'],
        },
        {
          q: 'Welche Größen braucht man für das Quader-Volumen?',
          correct: 'Länge, Breite und Höhe',
          wrong: ['nur die Masse', 'nur die Zeit', 'Spannung und Strom'],
        },
        {
          q: '1 Liter entspricht …',
          correct: '1 dm³',
          wrong: ['1 cm³', '1 m³', '1 mm³'],
        },
      ],
      calc: (rng) => {
        const l = pick(rng, [2, 3, 4, 5, 6])
        const b = pick(rng, [2, 3, 4, 5])
        const h = pick(rng, [2, 3, 4, 5])
        const V = l * b * h
        return {
          q: `Quader: l = ${l} cm, b = ${b} cm, h = ${h} cm. Berechne das Volumen.`,
          answerKind: 'integer',
          unit: 'cm³',
          value: V,
          solution: `${V} cm³`,
          explanation: `V = ${l}·${b}·${h} = ${V} cm³.`,
        }
      },
      ...formulaSort(
        ['V =', 'l', '× b', '× h'],
        'das Quader-Volumen',
        'V = l × b × h',
        '× m',
        'commutativeFactors',
      ),
    }
  }

  // --- Masse ---
  if (/masse/.test(lower) && !/dichte|gewichtskraft|energie/.test(lower)) {
    return {
      cases: [
        {
          q: 'Welche Einheit hat die Masse?',
          correct: 'Kilogramm (kg) bzw. Gramm (g)',
          wrong: ['Newton (N)', 'Meter (m)', 'Sekunde (s)'],
        },
        {
          q: 'Womit misst man die Masse?',
          correct: 'mit einer Waage',
          wrong: ['mit dem Lineal', 'mit dem Thermometer', 'mit dem Amperemeter'],
        },
        {
          q: '1 kg entspricht …',
          correct: '1000 g',
          wrong: ['100 g', '10 g', '1 g'],
        },
      ],
      calc: (rng) => {
        const kg = pick(rng, [1, 2, 3, 4, 5])
        const g = kg * 1000
        return {
          q: `${kg} kg in Gramm umrechnen.`,
          answerKind: 'integer',
          unit: 'g',
          value: g,
          solution: `${g} g`,
          explanation: `1 kg = 1000 g → ${kg} kg = ${g} g.`,
        }
      },
      ...formulaSort(['1 kg', '=', '1000', 'g'], 'die Umrechnung Kilogramm ↔ Gramm', '1 kg = 1000 g', 'N'),
    }
  }

  // --- Dichte (ohne „Stoffe vergleichen“, das hat eigenen Generator oben) ---
  if (/dichte/.test(lower)) {
    return {
      cases: [
        {
          q: 'Dichte ρ = …',
          correct: 'm / V',
          wrong: ['m · V', 'V / m', 'm + V'],
        },
        {
          q: 'Einheit der Dichte (Beispiel)?',
          correct: 'g/cm³ oder kg/m³',
          wrong: ['nur cm', 'nur N', 'nur s'],
        },
        {
          q: 'Wasser hat näherungsweise die Dichte …',
          correct: '1 g/cm³',
          wrong: ['0 g/cm³', '10 g/cm³', '100 g/cm³'],
        },
      ],
      calc: (rng) => {
        const m = pick(rng, [20, 40, 50, 80, 100])
        const v = pick(rng, [2, 4, 5, 10])
        const rho = m / v
        return {
          q: `m = ${m} g, V = ${v} cm³. Berechne die Dichte.`,
          answerKind: rho % 1 === 0 ? 'integer' : 'decimal',
          unit: 'g/cm³',
          value: rho,
          solution: `${rho} g/cm³`,
          explanation: `ρ = ${m}/${v} = ${rho} g/cm³.`,
        }
      },
      ...formulaSort(['ρ', '=', 'm', '/', 'V'], 'die Dichte', 'ρ = m / V', '+ t'),
    }
  }

  // --- Bewegung / Geschwindigkeit (nicht Weg-Zeit-Diagramm / reine Einheiten) ---
  if (
    /geschwindigkeit|gleichförmig/.test(lower) ||
    (/bewegung/.test(lower) && !/weg.?zeit|einheiten/.test(lower))
  ) {
    return {
      cases: [
        {
          q: 'Formel für gleichförmige Bewegung?',
          correct: 's = v · t',
          wrong: ['s = v / t', 's = v + t', 's = t / v'],
        },
        {
          q: 'Einheit der Geschwindigkeit?',
          correct: 'm/s (oder km/h)',
          wrong: ['nur m', 'nur s', 'Newton (N)'],
        },
        {
          q: 'v = s / t. Welche Größe ist t?',
          correct: 'Zeit',
          wrong: ['Strecke', 'Masse', 'Volumen'],
        },
      ],
      calc: (rng) => {
        const v = pick(rng, [2, 3, 4, 5, 6])
        const t = pick(rng, [2, 3, 4, 5])
        const s = v * t
        return {
          q: `Gleichförmige Bewegung: v = ${v} m/s, t = ${t} s. Berechne die Strecke.`,
          answerKind: 'integer',
          unit: 'm',
          value: s,
          solution: `${s} m`,
          explanation: `s = ${v}·${t} = ${s} m.`,
        }
      },
      ...formulaSort(
        ['s', '=', 'v', '× t'],
        'die gleichförmige Bewegung (Strecke)',
        's = v × t',
        '× m',
        'commutativeFactors',
      ),
    }
  }

  // --- Temperatur / Wärme / Aggregate ---
  if (/temperatur|thermometer|kelvin|celsius|wärme|aggregat|schmelzen|sieden|ausdehnung/.test(lower)) {
    return {
      cases: [
        {
          q: 'Umwandlung Celsius → Kelvin?',
          correct: 'T(K) = ϑ(°C) + 273',
          wrong: ['T(K) = ϑ(°C) − 273', 'T(K) = ϑ(°C) · 273', 'T(K) = 273 / ϑ'],
        },
        {
          q: 'Einheit der Temperatur (SI)?',
          correct: 'Kelvin (K)',
          wrong: ['Newton (N)', 'Ampere (A)', 'Ohm (Ω)'],
        },
        {
          q: 'Beim Schmelzen ändert sich der Aggregatzustand von …',
          correct: 'fest → flüssig',
          wrong: ['flüssig → fest', 'flüssig → gasförmig', 'gasförmig → fest'],
        },
      ],
      calc: (rng) => {
        const c = pick(rng, [0, 20, 27, 100])
        const k = c + 273
        return {
          q: `${c} °C in Kelvin: T = ϑ + 273.`,
          answerKind: 'integer',
          unit: 'K',
          value: k,
          solution: `${k} K`,
          explanation: `T = ${c} + 273 = ${k} K.`,
        }
      },
      ...formulaSort(['T', '=', 'ϑ', '+ 273'], 'Celsius → Kelvin', 'T = ϑ + 273', '× 273'),
    }
  }

  if (/brechung|prisma|linse|optische.?dichte|snell/.test(lower)) {
    return {
      cases: [
        {
          q: 'Luft → Glas: Der Lichtstrahl wird …',
          correct: 'zum Lot hin gebrochen',
          wrong: ['vom Lot weg gebrochen', 'nie gebrochen', 'nur reflektiert wie am Spiegel'],
        },
        {
          q: 'Glas → Luft: Der Lichtstrahl wird …',
          correct: 'vom Lot weg gebrochen',
          wrong: ['immer zum Lot hin gebrochen', 'immer total absorbiert', 'zu Schall'],
        },
        {
          q: 'Ein Prisma kann weißes Licht …',
          correct: 'in Spektralfarben zerlegen (Dispersion)',
          wrong: ['nur spiegeln wie ein ebener Spiegel', 'löschen', 'in Strom umwandeln'],
        },
      ],
      ...formulaSort(['n₁', '· sin α₁', '=', 'n₂', '· sin α₂'], 'das Brechungsgesetz', 'n₁·sin α₁ = n₂·sin α₂', '+ c'),
    }
  }

  if (/licht|optik|schatten|spiegel|strahl|auge|farbe|spektrum|filter|lochkamera|sehen/.test(lower)) {
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
      ...formulaSort(['αₑ', '=', 'αₐ'], 'das Reflexionsgesetz', 'αₑ = αₐ', 'αₑ + αₐ'),
    }
  }

  if (/strom|elektr|spannung|widerstand|ladung|magnet|induktion|spule|kondensator|leiter|kurzschluss|schalt|diode|led|transistor/.test(lower)) {
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
          q: `U = ${u} V, R = ${r} Ω. Berechne die Stromstärke.`,
          answerKind: i % 1 === 0 ? 'integer' : 'decimal',
          unit: 'A',
          value: i,
          solution: `${i} A`,
          explanation: `I = ${u}/${r} = ${i} A.`,
        }
      },
      ...formulaSort(['R', '=', 'U', '/', 'I'], 'den ohmschen Widerstand', 'R = U / I', '· I'),
    }
  }

  if (/leistung|arbeit|energie/.test(lower) && !/dichte|volumen/.test(lower)) {
    return {
      cases: [
        {
          q: 'Leistung P = …',
          correct: 'E / t',
          wrong: ['E · t', 't / E', 'E + t'],
        },
        {
          q: 'Einheit der Energie?',
          correct: 'Joule (J)',
          wrong: ['Newton (N)', 'Ampere (A)', 'Pascal (Pa)'],
        },
        {
          q: 'Einheit der Leistung?',
          correct: 'Watt (W)',
          wrong: ['Joule (J)', 'Volt (V)', 'Ohm (Ω)'],
        },
      ],
      calc: (rng) => {
        const e = pick(rng, [20, 40, 60, 100])
        const t = pick(rng, [2, 4, 5, 10])
        const p = e / t
        return {
          q: `E = ${e} J, t = ${t} s. Berechne die Leistung.`,
          answerKind: p % 1 === 0 ? 'integer' : 'decimal',
          unit: 'W',
          value: p,
          solution: `${p} W`,
          explanation: `P = ${e}/${t} = ${p} W.`,
        }
      },
      ...formulaSort(['P', '=', 'E', '/', 't'], 'die Leistung', 'P = E / t', '· t'),
    }
  }

  if (/kraft|druck|impuls|newton|reibung|hebel|auftrieb|feder|hooke/.test(lower)) {
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
      ],
      calc: (rng) => {
        if (/druck/.test(lower)) {
          const f = pick(rng, [20, 40, 50, 100])
          const a = pick(rng, [2, 4, 5, 10])
          const p = f / a
          return {
            q: `F = ${f} N, A = ${a} m². Berechne den Druck.`,
            answerKind: p % 1 === 0 ? 'integer' : 'decimal',
            unit: 'Pa',
            value: p,
            solution: `${p} Pa`,
            explanation: `p = ${f}/${a} = ${p} Pa.`,
          }
        }
        const m = pick(rng, [2, 3, 5, 8, 10])
        const F = m * 10
        return {
          q: `m = ${m} kg, g ≈ 10 N/kg. Berechne die Gewichtskraft.`,
          answerKind: 'integer',
          unit: 'N',
          value: F,
          solution: `${F} N`,
          explanation: `F_G = ${m}·10 = ${F} N.`,
        }
      },
      ...(/druck/.test(lower)
        ? formulaSort(['p', '=', 'F', '/', 'A'], 'den Druck', 'p = F / A', '· A')
        : formulaSort(
            ['F_G', '=', 'm', '· g'],
            'die Gewichtskraft',
            'F_G = m · g',
            '/ g',
            'commutativeFactors',
          )),
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
          q: `Periodendauer T = ${T} s. Berechne die Frequenz.`,
          answerKind: f % 1 === 0 ? 'integer' : 'decimal',
          unit: 'Hz',
          value: f,
          solution: `${f} Hz`,
          explanation: `f = 1/${T} = ${f} Hz.`,
        }
      },
      ...formulaSort(['f', '=', '1', '/', 'T'], 'Frequenz und Periodendauer', 'f = 1 / T', '· T'),
    }
  }

  // Fallback: themennahe Formel/Rechnung — nie Philosophie, nie themenfremde s=v·t
  return topicAwareFallback(title, lower)
}

function topicAwareFallback(title: string, lower: string): PhysicsBank {
  if (/hypothese|forschungsfrage|experiment|variable|messunsicherheit|messreihe|praktikum/.test(lower)) {
    return {
      cases: [
        {
          q: 'Was ist eine Hypothese im Physikunterricht?',
          correct: 'eine begründete Vermutung, die man prüfen kann',
          wrong: ['das fertige Messergebnis', 'eine Rechenformel ohne Größen', 'ein Zufallswert'],
        },
        {
          q: 'Unabhängige Variable bedeutet …',
          correct: 'die Größe, die man bewusst verändert',
          wrong: ['die Größe, die man nur abliest', 'immer die Zeit', 'immer die Temperatur'],
        },
        {
          q: 'Messunsicherheit beschreibt …',
          correct: 'wie genau ein Messwert bestimmt ist',
          wrong: ['nur die Farbe des Messgeräts', 'ob die Formel stimmt', 'nur den Mittelwert'],
        },
      ],
      calc: (rng) => {
        const values = pick(rng, [
          [2, 4, 6],
          [3, 5, 7],
          [10, 12, 14],
        ])
        const mean = (values[0]! + values[1]! + values[2]!) / 3
        return {
          q: `Messwerte ${values.join(' · ')}. Berechne den Mittelwert.`,
          answerKind: mean % 1 === 0 ? 'integer' : 'decimal',
          unit: '',
          value: mean,
          solution: String(mean),
          explanation: `Mittelwert = (${values.join(' + ')}) / 3 = ${mean}.`,
        }
      },
      ...formulaSort(['Mittelwert', '=', 'Summe', '/', 'Anzahl'], 'den Mittelwert', 'Mittelwert = Summe / Anzahl', '· Anzahl'),
    }
  }

  // Generischer, aber fachlicher Fallback aus dem Titel
  return {
    cases: [
      {
        q: `Welche Einheit passt typischerweise zu physikalischen Messungen bei „${title}“?`,
        correct: 'eine SI-Einheit (z. B. m, s, kg, N, J)',
        wrong: ['nur eine Farbe', 'nur ein Ortsname', 'nur eine Jahreszahl'],
      },
      {
        q: 'Ein physikalisches Ergebnis sollte …',
        correct: 'Zahl und passende Einheit enthalten',
        wrong: ['nur eine Zahl ohne Einheit', 'nur eine Einheit ohne Zahl', 'ohne Begründung geraten werden'],
      },
      {
        q: 'Formeln in der Physik verknüpfen …',
        correct: 'physikalische Größen',
        wrong: ['nur Farben', 'nur Jahreszahlen', 'nur Ortsnamen'],
      },
    ],
    calc: (rng) => {
      const m = pick(rng, [2, 3, 4, 5, 6])
      const F = m * 10
      return {
        q: `m = ${m} kg, g ≈ 10 N/kg. Berechne die Gewichtskraft.`,
        answerKind: 'integer',
        unit: 'N',
        value: F,
        solution: `${F} N`,
        explanation: `F_G = ${m}·10 = ${F} N.`,
      }
    },
    ...formulaSort(
      ['F_G', '=', 'm', '· g'],
      'die Gewichtskraft',
      'F_G = m · g',
      '/ g',
      'commutativeFactors',
    ),
  }
}
