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

  if (/ohm|widerstand|kennlinie/.test(lower) && !/reihe|parallel|schaltsymbol/.test(lower)) {
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

  // --- Spezifische Themen zuerst (vor breiten Keyword-Buckets) ---
  if (/schaltsymbol|schaltbild/.test(lower) || (/symbole/.test(lower) && /schalt|lb4-symbole/.test(lower))) {
    return {
      cases: [
        {
          q: 'Wozu dienen Schaltsymbole?',
          correct: 'Bauteile in Schaltplänen genormt darzustellen',
          wrong: ['Fotos der Bauteile zu ersetzen', 'nur die Farbe zu speichern', 'die Masse zu messen'],
        },
        {
          q: 'Ein Rechteck zwischen zwei Leitungen steht oft für …',
          correct: 'einen Widerstand',
          wrong: ['eine Batterie', 'nur Luft', 'einen Magneten ohne Symbol'],
        },
        {
          q: 'Ein Kreis mit X (oder gekreuzten Linien) steht typischerweise für …',
          correct: 'eine Lampe',
          wrong: ['ein Amperemeter', 'nur einen Schalter', 'einen Isolator'],
        },
      ],
      ...formulaSort(
        ['Symbol', '=', 'Bauteil'],
        'die Zuordnung Symbol ↔ Bauteil',
        'Symbol = Bauteil (im Schaltplan)',
        'Foto',
      ),
    }
  }

  if (/gefahr|kurzschluss|sicherheit/.test(lower)) {
    return {
      cases: [
        {
          q: 'Was ist ein Kurzschluss?',
          correct: 'ein sehr niederohmiger Nebenweg an der Spannungsquelle',
          wrong: ['ein geöffneter Schalter', 'eine Lampe mit großem R', 'nur ein Schaltsymbol'],
        },
        {
          q: 'Warum ist ein Kurzschluss gefährlich?',
          correct: 'Es kann ein sehr großer Strom fließen (Hitze/Brand)',
          wrong: ['Der Strom wird immer null', 'Isolatoren leiten besser', 'Die Batterie verschwindet'],
        },
        {
          q: 'Wozu dient eine Sicherung?',
          correct: 'Sie unterbricht bei zu großem Strom den Kreis',
          wrong: ['Sie erhöht dauerhaft die Spannung', 'Sie speichert chemische Energie', 'Sie ersetzt die Batterie'],
        },
      ],
      ...formulaSort(
        ['Sicherung', '→', 'Unterbrechung'],
        'den Schutz bei Überstrom',
        'Sicherung → Unterbrechung',
        'Kurzschluss verstärken',
      ),
    }
  }

  if (
    /reihenschaltung|parallelschaltung|reiheparallel|reihe und parallel|widerstände in reihe|widerstände parallel/.test(
      lower,
    )
  ) {
    const parallel = /parallel/.test(lower) && !/reihe und parallel|reiheparallel/.test(lower)
    return {
      cases: [
        {
          q: 'In einer Reihenschaltung ist der Strom …',
          correct: 'überall gleich groß',
          wrong: ['an jedem Widerstand anders', 'immer null', 'nur an der Batterie messbar'],
        },
        {
          q: 'In einer Parallelschaltung ist die Spannung an den Zweigen …',
          correct: 'näherungsweise gleich groß',
          wrong: ['immer null', 'nur am ersten Zweig', 'unabhängig von der Quelle immer verschieden'],
        },
        {
          q: parallel
            ? 'Zwei gleiche Lampen parallel: eine fällt aus. Was passiert typischerweise?'
            : 'Zwei gleiche Lampen in Reihe: eine fällt aus (Unterbrechung). Was passiert?',
          correct: parallel
            ? 'Die andere Lampe kann weiter leuchten'
            : 'Beide Lampen gehen aus',
          wrong: parallel
            ? ['Beide müssen ausgehen', 'Die Spannung wird immer null', 'Es gibt keinen Strom mehr']
            : ['Nur die andere leuchtet weiter', 'Der Strom verdoppelt sich', 'Die Batterie wird zum Isolator'],
        },
      ],
      calc: (rng) => {
        if (parallel || /parallel/.test(lower)) {
          // 1/R = 1/R1 + 1/R2 → R = R1*R2/(R1+R2); keep integer when possible
          const pairs = [
            [2, 2, 1],
            [3, 6, 2],
            [4, 4, 2],
            [6, 3, 2],
          ] as const
          const [a, b, req] = pick(rng, [...pairs])
          return {
            q: `Zwei Widerstände parallel: R₁ = ${a} Ω, R₂ = ${b} Ω. Gesamtwiderstand?`,
            answerKind: 'integer',
            unit: 'Ω',
            value: req,
            solution: `${req} Ω`,
            explanation: `1/R = 1/${a} + 1/${b} → R = ${req} Ω.`,
          }
        }
        const r1 = pick(rng, [2, 3, 4, 5, 6])
        const r2 = pick(rng, [2, 3, 4, 5, 6])
        const r = r1 + r2
        return {
          q: `Zwei Widerstände in Reihe: R₁ = ${r1} Ω, R₂ = ${r2} Ω. Gesamtwiderstand?`,
          answerKind: 'integer',
          unit: 'Ω',
          value: r,
          solution: `${r} Ω`,
          explanation: `R = R₁ + R₂ = ${r1} + ${r2} = ${r} Ω.`,
        }
      },
      ...formulaSort(
        parallel || /parallel/.test(lower)
          ? ['1/R', '=', '1/R₁', '+', '1/R₂']
          : ['R', '=', 'R₁', '+', 'R₂'],
        parallel || /parallel/.test(lower) ? 'den Parallelwiderstand' : 'den Reihenwiderstand',
        parallel || /parallel/.test(lower) ? '1/R = 1/R₁ + 1/R₂' : 'R = R₁ + R₂',
        '· U',
      ),
    }
  }

  if (/magnet/.test(lower) && !/induktion|welle|hertz|elektromagnetische welle/.test(lower)) {
    return {
      cases: [
        {
          q: 'Gleichnamige Magnetpole …',
          correct: 'stoßen sich ab',
          wrong: ['ziehen sich an', 'löschen sich immer aus', 'erzeugen nur Wärme ohne Kraft'],
        },
        {
          q: 'Ungleichnamige Magnetpole …',
          correct: 'ziehen sich an',
          wrong: ['stoßen sich immer ab', 'wirken nur im Vakuum', 'haben keine Kraft'],
        },
        {
          q: 'Woraus bestehen typische Permanentmagnete oft?',
          correct: 'aus magnetisierbaren Stoffen (z. B. Eisenverbindungen)',
          wrong: ['nur aus Gummi', 'nur aus Wasser', 'nur aus Glas'],
        },
      ],
      ...formulaSort(
        ['N', '↔', 'S'],
        'die Anziehung ungleichnamiger Pole',
        'N ↔ S (anziehen)',
        'N ↔ N',
      ),
    }
  }

  if (/elektrostatik|reibungselektr|statische.?elektr/.test(lower)) {
    return {
      cases: [
        {
          q: 'Gleichnamige Ladungen …',
          correct: 'stoßen sich ab',
          wrong: ['ziehen sich an', 'löschen Masse aus', 'fließen nur ohne Luft'],
        },
        {
          q: 'Ungleichnamige Ladungen …',
          correct: 'ziehen sich an',
          wrong: ['stoßen sich ab', 'sind immer neutral', 'existieren nur bei Magneten'],
        },
        {
          q: 'Reibungselektrizität entsteht z. B. durch …',
          correct: 'Reiben geeigneter Stoffe (Ladungstrennung)',
          wrong: ['nur durch Kurzschluss', 'nur durch Schmelzen', 'nur durch Schall'],
        },
      ],
      ...formulaSort(
        ['+', '↔', '−'],
        'die Anziehung ungleichnamiger Ladungen',
        '+ ↔ − (anziehen)',
        '+ ↔ +',
      ),
    }
  }

  if (/stromstärke/.test(lower) && !/spannung in stromkreisen|ohm/.test(lower)) {
    return {
      cases: [
        {
          q: 'Einheit der Stromstärke?',
          correct: 'Ampere (A)',
          wrong: ['Volt (V)', 'Ohm (Ω)', 'Watt (W)'],
        },
        {
          q: 'Womit misst man die Stromstärke?',
          correct: 'mit dem Amperemeter (in Reihe)',
          wrong: ['mit dem Voltmeter parallel ohne Sinn', 'nur mit dem Lineal', 'nur mit der Waage'],
        },
        {
          q: 'Stromstärke beschreibt …',
          correct: 'wie „stark“ die Ladung pro Zeit fließt',
          wrong: ['nur die Temperatur', 'nur die Masse', 'nur die Farbe der Leitung'],
        },
      ],
      calc: (rng) => {
        const q = pick(rng, [2, 4, 6, 10])
        const t = pick(rng, [1, 2, 5])
        const i = q / t
        return {
          q: `Ladung Q = ${q} C fließt in t = ${t} s. Berechne die Stromstärke I = Q/t.`,
          answerKind: i % 1 === 0 ? 'integer' : 'decimal',
          unit: 'A',
          value: i,
          solution: `${i} A`,
          explanation: `I = ${q}/${t} = ${i} A.`,
        }
      },
      ...formulaSort(['I', '=', 'Q', '/', 't'], 'die Stromstärke', 'I = Q / t', '· R'),
    }
  }

  if ((/^spannung|\bspannung u\b|lb2-spannung/.test(lower) || /spannung u/.test(lower)) && !/stromstärke und spannung|ohm|widerstand/.test(lower)) {
    return {
      cases: [
        {
          q: 'Einheit der elektrischen Spannung?',
          correct: 'Volt (V)',
          wrong: ['Ampere (A)', 'Ohm (Ω)', 'Joule (J)'],
        },
        {
          q: 'Womit misst man die Spannung?',
          correct: 'mit dem Voltmeter (parallel)',
          wrong: ['mit dem Amperemeter in Reihe als einzige Option', 'nur mit dem Thermometer', 'nur mit dem Geodreieck'],
        },
        {
          q: 'Spannung treibt …',
          correct: 'Ladungen durch den Stromkreis',
          wrong: ['nur die Masse der Erde', 'nur den Schall', 'nur die Temperatur ohne Batterie'],
        },
      ],
      calc: (rng) => {
        const i = pick(rng, [1, 2, 3, 4])
        const r = pick(rng, [2, 3, 4, 5])
        const u = i * r
        return {
          q: `I = ${i} A, R = ${r} Ω. Berechne die Spannung U = R·I.`,
          answerKind: 'integer',
          unit: 'V',
          value: u,
          solution: `${u} V`,
          explanation: `U = ${r}·${i} = ${u} V.`,
        }
      },
      ...formulaSort(['U', '=', 'R', '· I'], 'die Spannung', 'U = R · I', '/ t', 'commutativeFactors'),
    }
  }

  if (/messen/.test(lower) && /strom|spannung|ampere|volt/.test(lower)) {
    return {
      cases: [
        {
          q: 'Amperemeter wird typischerweise … geschaltet.',
          correct: 'in Reihe',
          wrong: ['nur parallel zur Batterie als Kurzschluss', 'ohne Leiter', 'nur an Isolatoren'],
        },
        {
          q: 'Voltmeter wird typischerweise … geschaltet.',
          correct: 'parallel zum Bauteil',
          wrong: ['immer in Reihe als Kurzschluss', 'ohne Anschlüsse', 'nur an den Isolator'],
        },
        {
          q: 'Was misst das Amperemeter?',
          correct: 'die Stromstärke',
          wrong: ['die Spannung', 'die Masse', 'die Temperatur'],
        },
      ],
      ...formulaSort(
        ['A', '→', 'Reihe'],
        'den Einbau des Amperemeters',
        'Amperemeter → Reihe',
        'Kurzschluss',
      ),
    }
  }

  if (/klingel|wechselschaltung/.test(lower)) {
    return {
      cases: [
        {
          q: 'Eine Klingel braucht typischerweise …',
          correct: 'Spannungsquelle, Taster/Schalter und Summer',
          wrong: ['nur einen Isolator', 'nur Licht ohne Strom', 'keine Leitung'],
        },
        {
          q: 'Wechselschaltung ermöglicht …',
          correct: 'eine Lampe von zwei Stellen aus zu schalten',
          wrong: ['Strom ohne Spannungsquelle', 'nur Kurzschluss', 'Messung der Masse'],
        },
        {
          q: 'Ein Taster für die Klingel ist oft …',
          correct: 'ein Schalter, der nur beim Drücken schließt',
          wrong: ['eine Batterie', 'ein Isolator ohne Kontakt', 'ein Voltmeter'],
        },
      ],
      ...formulaSort(
        ['Taster', '→', 'Summer'],
        'den Klingelstromkreis',
        'Taster → Summer (bei geschlossener Quelle)',
        'Kurzschluss',
      ),
    }
  }

  if (/leiter|nichtleiter|isolator/.test(lower) && !/wärmeleitung/.test(lower)) {
    return {
      cases: [
        {
          q: 'Kupfer ist typischerweise ein …',
          correct: 'elektrischer Leiter',
          wrong: ['Nichtleiter', 'Isolator aus Gummi', 'nur ein Magnet ohne Leitung'],
        },
        {
          q: 'Gummi ist typischerweise ein …',
          correct: 'Nichtleiter (Isolator)',
          wrong: ['sehr guter Metallleiter', 'Supraleiter bei Raumtemperatur', 'nur eine Batterie'],
        },
        {
          q: 'Wozu dienen Isolatoren an Kabeln?',
          correct: 'Schutz vor Berührung und unerwünschten Stromwegen',
          wrong: ['die Spannung zu erhöhen', 'die Masse zu messen', 'Licht zu speichern'],
        },
      ],
      ...formulaSort(
        ['Metall', '→', 'Leiter'],
        'die typische Leitung',
        'Metall → Leiter',
        'Gummi → Leiter',
      ),
    }
  }

  if (/dämm/.test(lower)) {
    return {
      cases: [
        {
          q: 'Gute Wärmedämmung …',
          correct: 'verringert den Wärmefluss nach außen',
          wrong: ['erhöht immer den Strom', 'löscht die Temperatur aus', 'braucht Kurzschluss'],
        },
        {
          q: 'Welche Stoffe dämmen oft gut?',
          correct: 'Luftporen / Schaumstoffe / Wolle (je nach Aufbau)',
          wrong: ['nur blankes Kupferblech allein', 'nur fließendes Wasser', 'nur Kurzschlussdrähte'],
        },
        {
          q: 'Warum hilft Dämmung am Haus?',
          correct: 'weniger Heizenergie geht verloren',
          wrong: ['die Erde wird schwerer', 'Strom wird zu Licht ohne Gerät', 'Masse verschwindet'],
        },
      ],
      ...formulaSort(
        ['Dämmung', '→', 'weniger Wärmeverlust'],
        'die Wirkung der Dämmung',
        'Dämmung → weniger Wärmeverlust',
        'mehr Verlust',
      ),
    }
  }

  if (/hebelgesetz|hebel(?!kraft)|flaschenzug|kraftwandler/.test(lower)) {
    return {
      cases: [
        {
          q: 'Hebelgesetz (Gleichgewicht): …',
          correct: 'Kraft · Kraftarm = Last · Lastarm',
          wrong: ['Kraft = Last immer', 'Arme spielen keine Rolle', 'nur die Farbe zählt'],
        },
        {
          q: 'Ein Flaschenzug …',
          correct: 'verringert die nötige Zugkraft (bei mehr Weg)',
          wrong: ['löscht die Gewichtskraft aus', 'erhöht g', 'braucht keinen Seilzug'],
        },
        {
          q: 'Längerer Kraftarm bei gleicher Last bedeutet …',
          correct: 'kleinere nötige Kraft (qualitativ)',
          wrong: ['immer größere Kraft', 'keine Wirkung', 'nur mehr Masse der Erde'],
        },
      ],
      calc: (rng) => {
        const F2 = pick(rng, [10, 20, 30, 40])
        const a2 = pick(rng, [1, 2])
        const a1 = pick(rng, [2, 4, 5])
        const F1 = (F2 * a2) / a1
        if (F1 % 1 !== 0) {
          return {
            q: 'Last 20 N an 1 m, Kraftarm 2 m. Welche Kraft hält im Gleichgewicht?',
            answerKind: 'integer',
            unit: 'N',
            value: 10,
            solution: '10 N',
            explanation: 'F₁·2 = 20·1 → F₁ = 10 N.',
          }
        }
        return {
          q: `Last F₂ = ${F2} N, Lastarm ${a2} m, Kraftarm ${a1} m. Kraft F₁ im Gleichgewicht?`,
          answerKind: 'integer',
          unit: 'N',
          value: F1,
          solution: `${F1} N`,
          explanation: `F₁·${a1} = ${F2}·${a2} → F₁ = ${F1} N.`,
        }
      },
      ...formulaSort(
        ['F₁', '· a₁', '=', 'F₂', '· a₂'],
        'das Hebelgesetz',
        'F₁·a₁ = F₂·a₂',
        '+ m',
      ),
    }
  }

  if (/auftrieb|schwimmen|schweben|sinken/.test(lower) && !/fliegen|dynamisch/.test(lower)) {
    return {
      cases: [
        {
          q: 'Statischer Auftrieb entsteht, weil …',
          correct: 'der Druck mit der Tiefe zunimmt (Druckunterschied)',
          wrong: ['Magnete im Wasser wirken', 'Licht den Körper hebt', 'Masse verschwindet'],
        },
        {
          q: 'Ein Körper schwimmt, wenn …',
          correct: 'Auftrieb ≈ Gewichtskraft (und Dichte passende Bedingung)',
          wrong: ['Auftrieb immer null ist', 'nur im Vakuum', 'ohne Flüssigkeit'],
        },
        {
          q: 'Archimedes: Auftrieb entspricht …',
          correct: 'der Gewichtskraft der verdrängten Flüssigkeit',
          wrong: ['der Masse der Luft allein', 'nur der Farbe', 'der Stromstärke'],
        },
      ],
      ...formulaSort(
        ['F_A', '↔', 'F_G'],
        'Schweben (Auftrieb und Gewicht)',
        'F_A ≈ F_G beim Schweben',
        'F_A = 0',
      ),
    }
  }

  if (/spez.*wärm|wärmekapazität|mischungstemperatur/.test(lower)) {
    return {
      cases: [
        {
          q: 'Spezifische Wärmekapazität c steckt in …',
          correct: 'Q = c · m · ΔT',
          wrong: ['Q = c / m', 'nur F = m·g', 'nur R = U/I'],
        },
        {
          q: 'Große c bedeutet …',
          correct: 'viel Energie für dieselbe Temperaturänderung',
          wrong: ['keine Energie nötig', 'Temperatur ändert sich ohne Wärme', 'nur magnetische Wirkung'],
        },
        {
          q: 'Beim Mischen (idealisert) bleibt …',
          correct: 'die Energiebilanz maßgeblich (Wärmeabgabe/-aufnahme)',
          wrong: ['die Masse der Erde', 'nur die Farbe', 'der Kurzschluss'],
        },
      ],
      calc: (rng) => {
        const c = pick(rng, [1, 2])
        const m = pick(rng, [2, 4, 5])
        const dT = pick(rng, [10, 20])
        const Q = c * m * dT
        return {
          q: `c = ${c} J/(g·K), m = ${m} g, ΔT = ${dT} K. Berechne Q = c·m·ΔT.`,
          answerKind: 'integer',
          unit: 'J',
          value: Q,
          solution: `${Q} J`,
          explanation: `Q = ${c}·${m}·${dT} = ${Q} J.`,
        }
      },
      ...formulaSort(['Q', '=', 'c', '· m', '· ΔT'], 'die Wärmemenge', 'Q = c · m · ΔT', '+ U', 'commutativeFactors'),
    }
  }

  if (/feder|hooke/.test(lower)) {
    return {
      cases: [
        {
          q: 'Hooke (ideal): F = …',
          correct: 'D · s (Federhärte · Auslenkung)',
          wrong: ['m / g', 'nur U / I', 's / D ohne Kraft'],
        },
        {
          q: 'Härtere Feder (größeres D) bedeutet bei gleicher Auslenkung …',
          correct: 'größere Federkraft',
          wrong: ['immer kleinere Kraft', 'keine Kraft', 'nur mehr Masse'],
        },
        {
          q: 'Einheit der Federhärte D?',
          correct: 'N/m',
          wrong: ['nur kg', 'nur V', 'nur °C'],
        },
      ],
      calc: (rng) => {
        const D = pick(rng, [10, 20, 25, 50])
        const s = pick(rng, [0.1, 0.2, 0.4, 0.5])
        const F = D * s
        return {
          q: `D = ${D} N/m, s = ${s} m. Berechne die Federkraft.`,
          answerKind: F % 1 === 0 ? 'integer' : 'decimal',
          unit: 'N',
          value: F,
          solution: `${F} N`,
          explanation: `F = ${D}·${s} = ${F} N.`,
        }
      },
      ...formulaSort(['F', '=', 'D', '· s'], 'das Hookesche Gesetz', 'F = D · s', '+ g', 'commutativeFactors'),
    }
  }

  if (/reibung/.test(lower) && !/reibungselektr/.test(lower)) {
    return {
      cases: [
        {
          q: 'Reibung …',
          correct: 'wirkt der Bewegung entgegen (oder verhindert Losbrechen)',
          wrong: ['zieht immer nach oben wie Auftrieb', 'löscht Masse aus', 'ist nur eine Einheit'],
        },
        {
          q: 'Haftreibung greift …',
          correct: 'bevor der Körper gleitet',
          wrong: ['nur im Vakuum', 'nur bei Licht', 'nur bei Strom'],
        },
        {
          q: 'Gleitreibung wirkt …',
          correct: 'beim Gleiten entlang der Kontaktfläche',
          wrong: ['nur ohne Kontakt', 'nur ohne Kraft', 'nur magnetisch'],
        },
      ],
      ...formulaSort(
        ['F_R', '↔', 'Bewegung'],
        'die Richtung der Reibung',
        'F_R entgegen der Bewegung',
        'F_R = 0 immer',
      ),
    }
  }

  if (/beschleunigung|freier.?fall|senkrechter.?wurf|wurf/.test(lower)) {
    return {
      cases: [
        {
          q: 'Beschleunigung a beschreibt …',
          correct: 'wie schnell sich die Geschwindigkeit ändert',
          wrong: ['nur die Masse', 'nur die Farbe', 'nur die Temperatur'],
        },
        {
          q: 'Freier Fall (ohne Luftwiderstand): alle Körper …',
          correct: 'fallen mit derselben Erdbeschleunigung g',
          wrong: ['fallen nur wenn sie schwerer sind immer schneller unabhängig von g', 'schweben ohne Kraft', 'brauchen Strom'],
        },
        {
          q: 'Einheit der Beschleunigung?',
          correct: 'm/s²',
          wrong: ['nur m', 'nur s', 'N·m'],
        },
      ],
      calc: (rng) => {
        const v = pick(rng, [10, 20, 30])
        const t = pick(rng, [2, 4, 5])
        const a = v / t
        return {
          q: `Geschwindigkeit nimmt um Δv = ${v} m/s in t = ${t} s zu. Berechne a = Δv/t.`,
          answerKind: a % 1 === 0 ? 'integer' : 'decimal',
          unit: 'm/s²',
          value: a,
          solution: `${a} m/s²`,
          explanation: `a = ${v}/${t} = ${a} m/s².`,
        }
      },
      ...formulaSort(['a', '=', 'Δv', '/', 't'], 'die Beschleunigung', 'a = Δv / t', '· m'),
    }
  }

  if (/s-t|v-t|weg.?zeit|diagramm/.test(lower) && /bewegung|kinematik|lb3-diagramme|diagramm/.test(lower)) {
    return {
      cases: [
        {
          q: 'Im s-t-Diagramm bedeutet eine steilere Gerade …',
          correct: 'größere Geschwindigkeit (gleichförmig)',
          wrong: ['immer Stillstand', 'nur Beschleunigung null und s = 0', 'nur Masse'],
        },
        {
          q: 'Im v-t-Diagramm ist die Fläche unter dem Graphen …',
          correct: 'die zurückgelegte Strecke (näherungsweise)',
          wrong: ['die Masse', 'die Temperatur', 'nur die Farbe'],
        },
        {
          q: 'Konstante Geschwindigkeit im s-t-Diagramm sieht aus wie …',
          correct: 'eine Gerade mit Steigung ≠ 0',
          wrong: ['eine Senkrechte durch s = ∞', 'nur ein Punkt ohne Zeit', 'eine Sinuskurve der Temperatur'],
        },
      ],
      ...formulaSort(['s', '=', 'v', '· t'], 'gleichförmige Bewegung', 's = v · t', '+ a', 'commutativeFactors'),
    }
  }

  if (/generator|induktion|spule/.test(lower) && !/schwing/.test(lower)) {
    return {
      cases: [
        {
          q: 'Generatorprinzip: Induktionsspannung entsteht bei …',
          correct: 'Änderung des magnetischen Flusses / Bewegung im Magnetfeld',
          wrong: ['nur konstanter Temperatur', 'nur ohne Magnetfeld', 'nur Kurzschluss ohne Spule'],
        },
        {
          q: 'Eine Spule speichert Energie vor allem im …',
          correct: 'Magnetfeld',
          wrong: ['nur im Schall', 'nur in der Farbe', 'nur in der Masse der Erde'],
        },
        {
          q: 'Lenzsche Regel sagt qualitativ …',
          correct: 'Induktionsstrom wirkt der Ursache entgegen',
          wrong: ['Induktion löscht Masse aus', 'es gibt nie Induktion', 'nur Ohm ohne Feld'],
        },
      ],
      ...formulaSort(
        ['ΔΦ', '→', 'U_ind'],
        'das Generator-/Induktionsprinzip',
        'ΔΦ → U_ind',
        'nur R = U/I',
      ),
    }
  }

  if (/transistor|diode|led|digital|elektronik/.test(lower)) {
    return {
      cases: [
        {
          q: 'Eine Diode lässt Strom …',
          correct: 'vorwiegend in einer Richtung durch',
          wrong: ['immer gleich in beiden Richtungen wie ein idealer Draht', 'nur ohne Spannung', 'nur als Isolator aus Gummi'],
        },
        {
          q: 'Eine LED leuchtet, wenn …',
          correct: 'sie in Durchlassrichtung betrieben wird',
          wrong: ['sie immer ohne Strom leuchtet', 'nur Kurzschluss vorliegt', 'keine Spannungsquelle da ist'],
        },
        {
          q: 'Ein Transistor kann …',
          correct: 'Ströme steuern / verstärken (Schalterfunktion)',
          wrong: ['nur die Masse messen', 'nur Temperatur speichern', 'g der Erde ändern'],
        },
      ],
      ...formulaSort(
        ['Diode', '→', 'eine Richtung'],
        'das Diodenverhalten',
        'Diode → Strom vorwiegend eine Richtung',
        'R = U/I allein',
      ),
    }
  }

  if (/sensor/.test(lower)) {
    return {
      cases: [
        {
          q: 'Ein Sensor wandelt typischerweise …',
          correct: 'eine nichtelektrische Größe in eine elektrische',
          wrong: ['Masse in Farbe ohne Messung', 'nur Schall in Schatten', 'g in Jahreszahlen'],
        },
        {
          q: 'Beispiele für Sensorgrößen?',
          correct: 'Temperatur, Helligkeit, Druck, …',
          wrong: ['nur Fantasiewerte ohne Sensor', 'nur die Gerätefarbe', 'nur die Seriennummer'],
        },
        {
          q: 'Warum Sensoren in der Technik?',
          correct: 'Zustände messen und steuern',
          wrong: ['Kurzschluss erzeugen', 'Sicherungen überbrücken', 'Dämmung entfernen'],
        },
      ],
      ...formulaSort(
        ['Messgröße', '→', 'elektr. Signal'],
        'die Sensorwirkung',
        'Messgröße → elektrisches Signal',
        'ohne Messung',
      ),
    }
  }

  if (/sonnen|mond|jahreszeit|astronom|kosmos|teleskop|fernrohr/.test(lower)) {
    return {
      cases: [
        {
          q: 'Jahreszeiten entstehen vor allem durch …',
          correct: 'die Neigung der Erdachse und den Umlauf um die Sonne',
          wrong: ['nur den Mondschatten jeden Tag', 'nur Kurzschluss', 'nur die Masse eines Apfels'],
        },
        {
          q: 'Mondfinsternis: der Mond steht im …',
          correct: 'Schatten der Erde',
          wrong: ['Schatten der Venus immer', 'Inneren der Sonne', 'Kurzschlusskreis'],
        },
        {
          q: 'Ein Fernrohr dient dazu …',
          correct: 'schwache/weit entfernte Objekte besser zu sehen',
          wrong: ['Strom zu speichern', 'g zu messen', 'nur Wärme zu dämmen'],
        },
      ],
      ...formulaSort(
        ['Erde', '↻', 'Sonne'],
        'den Umlauf Erde–Sonne',
        'Erde umkreist die Sonne',
        'Mond = Sonne',
      ),
    }
  }

  if (/interferenz|beugung|welle/.test(lower) && /licht|opt|lb1-interferenz|lb1-beugung|lb3-interferenz/.test(lower)) {
    return {
      cases: [
        {
          q: 'Interferenz bedeutet …',
          correct: 'Überlagerung von Wellen (Verstärkung/Auslöschung)',
          wrong: ['nur Reflexion am Spiegel ohne Welle', 'nur Gleichstrom', 'nur Masseänderung'],
        },
        {
          q: 'Beugung tritt auf, wenn Wellen …',
          correct: 'an Kanten/Öffnungen „um die Ecke“ gehen',
          wrong: ['nur im Vakuum verschwinden', 'nur bei Kurzschluss', 'nur ohne Medium und ohne Licht'],
        },
        {
          q: 'Licht zeigt Welleneigenschaften z. B. bei …',
          correct: 'Interferenz und Beugung',
          wrong: ['nur bei F = m·g', 'nur bei R = U/I ohne Optik', 'nur bei Jahreszahlen'],
        },
      ],
      ...formulaSort(
        ['Welle', '+', 'Welle'],
        'die Interferenz',
        'Welle + Welle → Interferenz',
        'nur Teilchen ohne Welle',
      ),
    }
  }

  if (/em-spektrum|hertzsche|radio|antenne|modulation|elektromagnetische welle/.test(lower) || (/spektrum/.test(lower) && /em|hertz|welle|radio/.test(lower))) {
    return {
      cases: [
        {
          q: 'Elektromagnetische Wellen brauchen …',
          correct: 'kein Medium (ausbreitungsfähig auch im Vakuum)',
          wrong: ['immer Wasser', 'immer eine Schallmauer', 'immer Kurzschluss'],
        },
        {
          q: 'Radio nutzt typischerweise …',
          correct: 'elektromagnetische Wellen / Modulation',
          wrong: ['nur Seilwellen im Klassenzimmer', 'nur Gleichstrom ohne Feld', 'nur Reibung'],
        },
        {
          q: 'Im EM-Spektrum unterscheiden sich Bereiche vor allem durch …',
          correct: 'Frequenz bzw. Wellenlänge',
          wrong: ['nur die Masse', 'nur die Farbe der Isolierung', 'nur den Ortsnamen'],
        },
      ],
      calc: (rng) => {
        const f = pick(rng, [2, 4, 5, 10])
        const T = 1 / f
        return {
          q: `Frequenz f = ${f} Hz. Periodendauer T = 1/f?`,
          answerKind: T % 1 === 0 ? 'integer' : 'decimal',
          unit: 's',
          value: T,
          solution: `${T} s`,
          explanation: `T = 1/${f} = ${T} s.`,
        }
      },
      ...formulaSort(['c', '=', 'λ', '· f'], 'EM-Wellen', 'c = λ · f', '+ R', 'commutativeFactors'),
    }
  }

  if (/photoeffekt|photon|quant|spektrallinie/.test(lower)) {
    return {
      cases: [
        {
          q: 'Photoeffekt: Licht kann …',
          correct: 'Elektronen aus Metall lösen (ab einer Grenzfrequenz)',
          wrong: ['Masse der Erde verdoppeln', 'g abschalten', 'nur Schall erzeugen'],
        },
        {
          q: 'Photonenenergie hängt ab von …',
          correct: 'der Frequenz (E = h·f)',
          wrong: ['nur der Masse des Tisches', 'nur der Länge in cm ohne f', 'nur dem Ortsnamen'],
        },
        {
          q: 'Klassische Welle allein erklärt den Photoeffekt …',
          correct: 'nicht vollständig (Quantenbild nötig)',
          wrong: ['perfekt ohne h', 'nur mit F = m·g', 'nur mit R = U/I'],
        },
      ],
      ...formulaSort(['E', '=', 'h', '· f'], 'die Photonenenergie', 'E = h · f', '+ m', 'commutativeFactors'),
    }
  }

  if (/brennweite|reelle|virtuelle|linse/.test(lower) && /optik|bild|brenn/.test(lower)) {
    return {
      cases: [
        {
          q: 'Brennweite f einer Sammellinse ist …',
          correct: 'der Abstand Brennpunkt–Linsenmitte',
          wrong: ['die Masse der Linse', 'nur die Temperatur', 'nur die Stromstärke'],
        },
        {
          q: 'Ein reelles Bild kann man …',
          correct: 'auf einem Schirm auffangen',
          wrong: ['nie sehen', 'nur im Kurzschluss', 'nur ohne Licht'],
        },
        {
          q: 'Ein virtuelles Bild …',
          correct: 'scheint hinter dem Spiegel/der Linse zu liegen (nicht auf Schirm)',
          wrong: ['ist immer heißer', 'braucht Kurzschluss', 'hat keine Strahlen'],
        },
      ],
      ...formulaSort(['1/f', '=', '1/g', '+', '1/b'], 'die Linsengleichung', '1/f = 1/g + 1/b', '· R'),
    }
  }

  if (/elementarladung|ladung e\b|millikan|ladung und feld|lb7-ladung/.test(lower)) {
    return {
      cases: [
        {
          q: 'Die Elementarladung e ist …',
          correct: 'die kleinste freie Ladungsmenge (Betrag)',
          wrong: ['eine Masseinheit', 'eine Temperatur', 'eine Frequenz'],
        },
        {
          q: 'Ladungen sind gequantelt in Vielfachen von …',
          correct: 'e',
          wrong: ['nur kg', 'nur °C', 'nur m/s'],
        },
        {
          q: 'Elektron und Proton haben …',
          correct: 'entgegengesetzte Ladung vom Betrag e',
          wrong: ['dieselbe Ladung und Farbe', 'keine Ladung', 'nur magnetische Masse'],
        },
      ],
      ...formulaSort(['Q', '=', 'n', '· e'], 'die gequantelte Ladung', 'Q = n · e', '/ t', 'commutativeFactors'),
    }
  }

  if (/solar|windrad|energieversorgung/.test(lower)) {
    return {
      cases: [
        {
          q: 'Eine Solarzelle wandelt …',
          correct: 'Lichtenergie in elektrische Energie',
          wrong: ['nur Masse in Schall', 'nur g in Temperatur ohne Licht', 'Kurzschluss in Dämmung'],
        },
        {
          q: 'Ein Windrad nutzt …',
          correct: 'kinetische Energie der Luft',
          wrong: ['nur Kernspaltung im Rotor', 'nur Photoeffekt ohne Wind', 'nur Reibungselektrizität ohne Luft'],
        },
        {
          q: 'Erneuerbare Energien …',
          correct: 'stehen langfristig nach / werden nachgeliefert',
          wrong: ['sind immer ohne Wirkungsgrad', 'brauchen Kurzschluss', 'löschen SI-Einheiten'],
        },
      ],
      ...formulaSort(
        ['Licht', '→', 'elektr. Energie'],
        'die Solarzelle',
        'Licht → elektrische Energie',
        'Kurzschluss',
      ),
    }
  }

  if (/laden|entladen|kondensator/.test(lower)) {
    return {
      cases: [
        {
          q: 'Ein Kondensator speichert Energie vor allem im …',
          correct: 'elektrischen Feld',
          wrong: ['nur im Schall', 'nur in der Feder ohne Feld', 'nur in der Masse'],
        },
        {
          q: 'Beim Entladen fließt …',
          correct: 'kurzzeitig Strom, bis die Spannung sinkt',
          wrong: ['nie Strom', 'nur Masse', 'nur Licht ohne Spannung'],
        },
        {
          q: 'Kapazität C hängt zusammen mit …',
          correct: 'Q = C · U',
          wrong: ['nur F = m·g', 'nur s = v·t ohne Q', 'nur Farbe'],
        },
      ],
      calc: (rng) => {
        const C = pick(rng, [2, 4, 5])
        const U = pick(rng, [2, 3, 4, 6])
        const Q = C * U
        return {
          q: `C = ${C} F (Modellzahl), U = ${U} V. Berechne Q = C·U.`,
          answerKind: 'integer',
          unit: 'C',
          value: Q,
          solution: `${Q} C`,
          explanation: `Q = ${C}·${U} = ${Q} C.`,
        }
      },
      ...formulaSort(['Q', '=', 'C', '· U'], 'die Kondensatorladung', 'Q = C · U', '/ t', 'commutativeFactors'),
    }
  }

  if (/pixel|auflösung|analog und digital|bildpunkt/.test(lower)) {
    return {
      cases: [
        {
          q: 'Digital bedeutet hier typischerweise …',
          correct: 'diskrete Werte / Stufen (z. B. Bits)',
          wrong: ['nur unendlich viele Farben ohne Raster', 'nur Kurzschluss', 'nur Masse'],
        },
        {
          q: 'Mehr Pixel bei gleicher Sensorfläche bedeuten oft …',
          correct: 'höhere räumliche Auflösung (feinere Abtastung)',
          wrong: ['immer weniger Information', 'keine Bildpunkte', 'nur Wärme ohne Licht'],
        },
        {
          q: 'Analogsignale sind …',
          correct: 'kontinuierlich (idealisert)',
          wrong: ['immer nur 0 und 1', 'ohne physikalische Größe', 'nur Jahreszahlen'],
        },
      ],
      ...formulaSort(
        ['Bild', '=', 'viele', 'Pixel'],
        'ein Rasterbild',
        'Bild ≈ viele Pixel',
        'ohne Abtastung',
      ),
    }
  }

  if (/pendel|schwingung/.test(lower) && !/welle/.test(lower)) {
    return {
      cases: [
        {
          q: 'Beim Fadenpendel (kleine Winkel) hängt T vor allem von …',
          correct: 'Länge und g',
          wrong: ['nur der Farbe des Fadens', 'nur der Stromstärke', 'nur dem Ortsnamen'],
        },
        {
          q: 'Eine Periode ist …',
          correct: 'eine volle Hin- und Herbewegung',
          wrong: ['nur die Masse', 'nur ein Kurzschluss', 'nur die Temperatur'],
        },
        {
          q: 'Frequenz und Periodendauer: …',
          correct: 'f = 1 / T',
          wrong: ['f = T', 'f = T²', 'f = m · g'],
        },
      ],
      calc: (rng) => {
        const T = pick(rng, [2, 4, 5])
        const f = 1 / T
        return {
          q: `Periodendauer T = ${T} s. Frequenz f = 1/T?`,
          answerKind: f % 1 === 0 ? 'integer' : 'decimal',
          unit: 'Hz',
          value: f,
          solution: `${f} Hz`,
          explanation: `f = 1/${T} = ${f} Hz.`,
        }
      },
      ...formulaSort(['f', '=', '1', '/', 'T'], 'Frequenz und Periodendauer', 'f = 1 / T', '· m'),
    }
  }

  if (/energie sparen|sparen/.test(lower) && /energie|lb3-sparen/.test(lower)) {
    return {
      cases: [
        {
          q: 'Energie sparen heißt z. B. …',
          correct: 'weniger unnötige Umwandlungsverluste / Standby vermeiden',
          wrong: ['Sicherungen überbrücken', 'Kurzschluss erzeugen', 'Dämmung entfernen'],
        },
        {
          q: 'LED statt Glühlampe spart oft, weil …',
          correct: 'weniger Energie als Wärme verloren geht (höherer Wirkungsgrad)',
          wrong: ['Strom ohne Spannung fließt', 'Masse verschwindet', 'g sich ändert'],
        },
        {
          q: 'Welche Maßnahme spart Heizenergie?',
          correct: 'gute Wärmedämmung',
          wrong: ['Fenster dauerhaft weit offen im Winter ohne Sinn', 'Kurzschluss', 'Isolation entfernen'],
        },
      ],
      ...formulaSort(
        ['η', '↑', 'Verlust ↓'],
        'den Zusammenhang Sparen ↔ Wirkungsgrad',
        'höherer Wirkungsgrad → weniger Verlust',
        'Kurzschluss',
      ),
    }
  }

  if (/impuls|stoß|stoss|drehimpuls|erhaltungssatz|trägheit|wechselwirkung/.test(lower)) {
    return {
      cases: [
        {
          q: 'Impuls p = …',
          correct: 'm · v',
          wrong: ['m / v', 'm + v', 'nur F ohne v'],
        },
        {
          q: 'Bei einem elastischen Stoß (ideal) …',
          correct: 'bleiben Impuls und kinetische Energie erhalten',
          wrong: ['verschwindet die Masse', 'gilt nie Impulserhaltung', 'wird g verdoppelt'],
        },
        {
          q: 'Newtons 1. Gesetz (Trägheit): Ohne Kraft …',
          correct: 'bleibt der Bewegungszustand erhalten',
          wrong: ['beschleunigt jeder Körper von allein', 'fällt die Masse auf null', 'fließt immer Strom'],
        },
      ],
      calc: (rng) => {
        const m = pick(rng, [2, 3, 4, 5])
        const v = pick(rng, [2, 3, 4, 5, 10])
        const p = m * v
        return {
          q: `m = ${m} kg, v = ${v} m/s. Berechne den Impuls p = m·v.`,
          answerKind: 'integer',
          unit: 'kg·m/s',
          value: p,
          solution: `${p} kg·m/s`,
          explanation: `p = ${m}·${v} = ${p} kg·m/s.`,
        }
      },
      ...formulaSort(['p', '=', 'm', '· v'], 'den Impuls', 'p = m · v', '+ g', 'commutativeFactors'),
    }
  }

  if (/strahlung|atomhülle|atomkern|zerfall|radioaktiv/.test(lower) && !/wärmestrahlung|sonnenstrahlung/.test(lower)) {
    return {
      cases: [
        {
          q: 'Alpha-, Beta-, Gamma-Strahlung unterscheiden sich u. a. in …',
          correct: 'Teilchenart / Durchdringungsvermögen',
          wrong: ['nur der Gerätefarbe', 'nur dem Ortsnamen', 'nur der Schuhgröße'],
        },
        {
          q: 'Strahlung aus der Atomhülle hängt mit … zusammen.',
          correct: 'Übergängen von Elektronen / Photonen',
          wrong: ['nur mit F = m·g', 'nur mit Kurzschluss', 'nur mit Reibung am Boden'],
        },
        {
          q: 'In der Medizin wird ionisierende Strahlung z. B. …',
          correct: 'zur Bildgebung oder Therapie (kontrolliert) genutzt',
          wrong: ['immer ohne Schutz verwendet', 'nur zum Kurzschließen', 'nur zum Dämmen'],
        },
      ],
      ...formulaSort(
        ['Kern', '→', 'Strahlung'],
        'radioaktive Strahlung',
        'Kernprozesse → Strahlung',
        'nur Spiegelung',
      ),
    }
  }

  if (/regenbogen|dispersion/.test(lower)) {
    return {
      cases: [
        {
          q: 'Ein Regenbogen entsteht durch …',
          correct: 'Brechung und Dispersion an Wassertropfen',
          wrong: ['nur Kurzschluss', 'nur Magnetismus ohne Licht', 'nur Impuls ohne Optik'],
        },
        {
          q: 'Dispersion bedeutet …',
          correct: 'Zerlegung von Licht in Spektralfarben (unterschiedliche Brechung)',
          wrong: ['nur Mischen von Massen', 'nur Ohmsches Gesetz', 'nur freien Fall'],
        },
        {
          q: 'Weißes Licht enthält …',
          correct: 'viele Wellenlängen / Farben',
          wrong: ['nur eine einzige Frequenz immer', 'keine Photonen je', 'nur Schall'],
        },
      ],
      ...formulaSort(
        ['weißes Licht', '→', 'Spektrum'],
        'die Dispersion',
        'weißes Licht → Spektrum',
        'ohne Brechung',
      ),
    }
  }

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

  if (/licht|optik|schatten|spiegel|strahl|auge|farbe|spektrum|filter|lochkamera|sehen/.test(lower) && !/em-spektrum|hertzsche|elektromagnetisch|radio|antenne|strahlung|atom|kern|medizin|spektrallinie/.test(lower)) {
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

  if (/strom|elektr|spannung|widerstand|ladung|induktion|spule|kondensator|leiter|kurzschluss|schalt(?!symbol)/.test(lower) && !/schaltsymbol|schaltbild|magnetische|elektrostatik|gefahr|transistor|diode|led\b|generator|photoeffekt|elementarladung|sensor|solar|ladung und feld|lb7-ladung/.test(lower)) {
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

  if (/kraft|druck|impuls|newton|reibung|hebel|auftrieb|feder|hooke/.test(lower) && !/magnet|elektrostatik|fliegen|drehimpuls|stoß|stoss|erhaltung/.test(lower)) {
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

  // Generischer, aber fachlicher Fallback aus dem Titel — keine themenfremde Gewichtskraft.
  return {
    cases: [
      {
        q: `Was ist ein zentraler Inhalt bei „${title}“?`,
        correct: 'physikalische Größen, Zusammenhänge und passende Einheiten',
        wrong: ['nur Farben ohne Messung', 'nur Ortsnamen', 'nur Jahreszahlen'],
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
      const values = pick(rng, [
        [2, 4, 6],
        [3, 5, 7],
        [10, 12, 14],
      ])
      const mean = (values[0]! + values[1]! + values[2]!) / 3
      return {
        q: `Messwerte ${values.join(' · ')} (Thema „${title}“). Berechne den Mittelwert.`,
        answerKind: mean % 1 === 0 ? 'integer' : 'decimal',
        unit: '',
        value: mean,
        solution: String(mean),
        explanation: `Mittelwert = (${values.join(' + ')}) / 3 = ${mean}.`,
      }
    },
    ...formulaSort(
      ['Mittelwert', '=', 'Summe', '/', 'Anzahl'],
      'den Mittelwert einer Messreihe',
      'Mittelwert = Summe / Anzahl',
      '· Farbe',
    ),
  }
}
