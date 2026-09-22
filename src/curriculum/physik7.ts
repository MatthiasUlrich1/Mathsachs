import { pick, randInt, type Rng } from '../lib/rng'
import {
  airfoilSvg,
  chargeForceSvg,
  circuitSvg,
  energyFlowSvg,
  flightForcesSvg,
  frictionForceSvg,
  inclinedPlaneSvg,
  leverBalanceSvg,
  magnetPolesSvg,
  meterGapCircuitSvg,
  meterWiredCircuitSvg,
  pulleySvg,
  seriesParallelSvg,
  wechselCircuitSvg,
} from '../lib/physikSvg'
import {
  choicePickTask,
  dragDropSlotsTask,
  dragDropSortTask,
  mixedVariants,
  multiSelectTask,
  numberLineTask,
  paramSliderTask,
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

/** LB1 — Kraft als physikalische Größe (ohne F_G-Rechnung) */
const kraftbegriff: Topic['generate'] = mixedVariants(
  // choicePick twice → häufiger Begriffsfragen als nur MultiSelect
  (rng) => {
    const cases = [
      {
        q: 'Was beschreibt eine Kraft in der Physik?',
        correct: 'eine Einwirkung, die einen Körper beschleunigen oder verformen kann',
        wrong: [
          'nur die Masse eines Körpers',
          'nur die Temperatur',
          'die Farbe einer Oberfläche',
        ],
      },
      {
        q: 'In welcher Einheit wird die Kraft angegeben?',
        correct: 'Newton (N)',
        wrong: ['Joule (J)', 'Watt (W)', 'Pascal (Pa)'],
      },
      {
        q: 'Welche Angabe gehört zu einer Kraft?',
        correct: 'Betrag und Richtung (Kraft ist gerichtet)',
        wrong: [
          'nur die Masse in kg',
          'nur die Zeit in Sekunden',
          'nur die Temperatur in °C',
        ],
      },
      {
        q: 'Womit misst man Kräfte im Schülerversuch typischerweise?',
        correct: 'mit einem Kraftmesser (Federkraftmesser)',
        wrong: ['mit einem Thermometer', 'mit einem Lineal allein', 'mit einer Stoppuhr allein'],
      },
      {
        q: 'Was bewirkt eine Kraft an einem ruhenden Körper (wenn andere Kräfte sie nicht aufheben)?',
        correct: 'sie kann ihn in Bewegung setzen (beschleunigen)',
        wrong: [
          'sie ändert immer nur die Farbe',
          'sie erzeugt immer Strom',
          'sie lässt die Masse verschwinden',
        ],
      },
      {
        q: 'Eine Kraft kann einen Körper auch …',
        correct: 'verformen (z. B. Feder dehnen, Knete drücken)',
        wrong: [
          'in Joule umrechnen ohne Wirkung',
          'ohne jede Wechselwirkung entstehen',
          'nur im Vakuum existieren',
        ],
      },
      {
        q: 'Wie stellt man Kräfte in Skizzen oft dar?',
        correct: 'als Pfeile (Länge ≈ Betrag, Richtung = Wirkrichtung)',
        wrong: [
          'nur als Kreise ohne Richtung',
          'nur als Temperaturstriche',
          'nur als Schaltzeichen für Lampen',
        ],
      },
      {
        q: '1 N ist definiert über …',
        correct: 'die Kraft, die 1 kg um 1 m/s² beschleunigt (F = m·a)',
        wrong: [
          '1 Liter Wasser bei 0 °C',
          '1 Volt an 1 Ohm',
          '1 Joule pro Sekunde ohne Kraftbezug',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Kraft ist eine gerichtete Größe in Newton; sie kann beschleunigen oder verformen und wird z. B. mit dem Kraftmesser gemessen.',
      instruction: 'Tippe die passende Aussage zur Kraft:',
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Welche Aussage zur Kraft stimmt?',
        correct: 'Kraft hat Betrag und Richtung',
        wrong: ['Kraft ist dasselbe wie Masse', 'Kraft wird in °C gemessen', 'Kraft braucht keine Einheit'],
      },
      {
        q: 'Welche Wirkung kann eine Kraft haben?',
        correct: 'Formänderung oder Bewegungsänderung',
        wrong: ['nur die Farbe ändern', 'Masse vernichten', 'Zeit anhalten'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Kraft: gerichtet, Einheit N, Wirkung auf Form oder Bewegung.',
      instruction: 'Tippe die passende Aussage zur Kraft:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Was gehört zum physikalischen Kraftbegriff? (mehrere möglich)',
      choices: [
        'Einheit Newton (N)',
        'Betrag und Richtung',
        'kann Körper beschleunigen',
        'kann Körper verformen',
        'ist dasselbe wie die Masse in kg',
        'wird nur in °C gemessen',
      ],
      correct: [
        'Einheit Newton (N)',
        'Betrag und Richtung',
        'kann Körper beschleunigen',
        'kann Körper verformen',
      ],
      solution: 'Kraft: N, gerichtet, Wirkung auf Bewegung/Form — nicht Masse oder Temperatur.',
      explanation: 'Masse (kg) und Temperatur (°C) sind andere Größen.',
      instruction: 'Tippe alle zutreffenden Aussagen:',
    }),
)

/** LB1 — Gewichtskraft F_G = m·g */
const gewichtskraft: Topic['generate'] = mixedVariants(
  (rng) => {
    const m = pick(rng, [2, 3, 4, 5, 6, 8, 10])
    const g = 10
    const F = m * g
    return valueTask({
      question: `Ein Körper hat die Masse m = ${m} kg. Berechne die Gewichtskraft (g ≈ ${g} N/kg).`,
      answerKind: 'integer',
      unit: 'N',
      value: F,
      solution: `${F} N`,
      explanation: `F_G = m · g = ${m} · ${g} = ${F} N.`,
    })
  },
  (rng) => {
    const m = pick(rng, [2, 3, 4, 5, 6, 8, 10])
    const F = m * 10
    return valueTask({
      question: `m = ${m} kg, g ≈ 10 N/kg. Berechne die Gewichtskraft F_G.`,
      answerKind: 'integer',
      unit: 'N',
      value: F,
      solution: `${F} N`,
      explanation: `F_G = ${m} · 10 = ${F} N.`,
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Was ist die Gewichtskraft?',
        correct: 'die Anziehungskraft der Erde auf den Körper (≈ m·g)',
        wrong: [
          'die Masse des Körpers in kg',
          'die Temperatur des Körpers',
          'der elektrische Widerstand',
        ],
      },
      {
        q: 'In welche Richtung wirkt die Gewichtskraft (nahe der Erdoberfläche)?',
        correct: 'zum Erdmittelpunkt / nach unten',
        wrong: ['immer nach oben', 'immer horizontal', 'zufällig in alle Richtungen'],
      },
      {
        q: 'Welche Formel gilt näherungsweise für die Gewichtskraft?',
        correct: 'F_G = m · g',
        wrong: ['F_G = m / g', 'F_G = m + g', 'F_G = U / I'],
      },
      {
        q: 'Welche Einheit hat g in F_G = m·g (Schulnäherung)?',
        correct: 'N/kg (bzw. m/s²)',
        wrong: ['nur Volt', 'nur Ohm', 'nur °C'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Gewichtskraft F_G ≈ m·g mit g ≈ 10 N/kg, Richtung zur Erde.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const m = pick(rng, [2, 4, 5, 8, 10])
    const F = m * 10
    return paramSliderTask({
      question: `Stelle die Masse so ein, dass die Gewichtskraft ${F} N gilt (g ≈ 10 N/kg).`,
      params: [
        {
          id: 'm',
          label: 'Masse m (kg)',
          min: 1,
          max: 12,
          step: 1,
          start: m === 5 ? 2 : 5,
        },
      ],
      correct: { m },
      solution: `m = ${m} kg → F_G = ${F} N`,
      explanation: `F_G = m · 10 = ${m} · 10 = ${F} N.`,
      instruction: 'Schieberegler auf die passende Masse:',
    })
  },
  (rng) => {
    const m = pick(rng, [2, 3, 4, 5, 6, 8])
    const F = m * 10
    return numberLineTask({
      question: `Ein Körper hat m = ${m} kg. Markiere die Gewichtskraft auf dem Zahlenstrahl (in N).`,
      min: 0,
      max: 100,
      step: 5,
      value: F,
      solution: `${F} N`,
      explanation: `F_G = ${m} · 10 = ${F} N.`,
    })
  },
)

/** LB1 — Kräfte vergleichen und addieren (nicht F_G-Rechnung) */
const kraefte: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Zwei Kräfte gleicher Richtung (gleichsinnig) werden …',
        correct: 'addiert: F_ges = F₁ + F₂',
        wrong: [
          'immer subtrahiert',
          'multipliziert zu F₁·F₂',
          'ignoriert, weil Kräfte sich aufheben',
        ],
      },
      {
        q: 'Zwei Kräfte gleicher Beträge, aber entgegengesetzter Richtung …',
        correct: 'heben sich auf (Resultierende 0)',
        wrong: [
          'verdoppeln sich immer',
          'wirken nur als Temperatur',
          'erzeugen immer Strom',
        ],
      },
      {
        q: 'F₁ = 3 N nach rechts, F₂ = 5 N nach rechts. Resultierende?',
        correct: '8 N nach rechts',
        wrong: ['2 N nach links', '15 N nach oben', '0 N'],
      },
      {
        q: 'F₁ = 6 N nach rechts, F₂ = 2 N nach links. Resultierende?',
        correct: '4 N nach rechts',
        wrong: ['8 N nach rechts', '12 N nach links', '0 N'],
      },
      {
        q: 'Welche Kraft zieht einen Apfel nach unten zur Erde?',
        correct: 'Gewichtskraft',
        wrong: ['Reibungskraft', 'Spannkraft', 'Magnetkraft'],
      },
      {
        q: 'Welche Kraft bremst einen Rutschwagen auf dem Boden?',
        correct: 'Reibungskraft',
        wrong: ['Gewichtskraft', 'Spannkraft der Sonne', 'Magnetkraft'],
      },
      {
        q: 'Welche Kraft wirkt zwischen Magnet und Nägeln?',
        correct: 'Magnetkraft',
        wrong: ['Gewichtskraft', 'Luftwiderstand', 'Federkraft'],
      },
      {
        q: 'Welche Kraft spannt eine gedehnte Feder?',
        correct: 'Federkraft',
        wrong: ['Gewichtskraft', 'Luftwiderstand', 'Magnetkraft'],
      },
      {
        q: 'Beim Vergleich zweier Kräfte schaust du vor allem auf …',
        correct: 'Betrag und Richtung',
        wrong: ['nur die Farbe der Pfeile', 'nur die Uhrzeit', 'nur die Temperatur'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Kräfte vergleichen/addieren: Richtung beachten — gleichsinnig addieren, entgegengesetzt subtrahieren.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const a = pick(rng, [2, 3, 4, 5])
    const b = pick(rng, [1, 2, 3, 4].filter((x) => x !== a))
    const same = pick(rng, [true, false])
    if (same) {
      const F = a + b
      return valueTask({
        question: `Zwei Kräfte ${a} N und ${b} N wirken gleichsinnig in dieselbe Richtung. Wie groß ist die Resultierende?`,
        answerKind: 'integer',
        unit: 'N',
        value: F,
        solution: `${F} N`,
        explanation: `Gleichsinnig: F_ges = ${a} + ${b} = ${F} N.`,
      })
    }
    const big = Math.max(a, b)
    const small = Math.min(a, b)
    const F = big - small
    return valueTask({
      question: `Zwei Kräfte ${big} N und ${small} N wirken entgegengesetzt. Wie groß ist der Betrag der Resultierenden?`,
      answerKind: 'integer',
      unit: 'N',
      value: F,
      solution: `${F} N`,
      explanation: `Entgegengesetzt: |F_ges| = ${big} − ${small} = ${F} N.`,
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Was gilt beim Addieren von Kräften? (mehrere möglich)',
      choices: [
        'Richtung muss beachtet werden',
        'gleichsinnige Kräfte: Beträge addieren',
        'entgegengesetzte Kräfte: Beträge subtrahieren',
        'Kräfte ohne Richtung addieren wie skalare Massen',
        'Resultierende hat wieder Betrag und Richtung',
      ],
      correct: [
        'Richtung muss beachtet werden',
        'gleichsinnige Kräfte: Beträge addieren',
        'entgegengesetzte Kräfte: Beträge subtrahieren',
        'Resultierende hat wieder Betrag und Richtung',
      ],
      solution: 'Kräfte sind gerichtet — gleichsinnig +, entgegengesetzt −.',
      explanation: 'Kräfte sind keine richtungsfreien Skalare wie reine Massenangaben.',
      instruction: 'Tippe alle zutreffenden Aussagen:',
    }),
)

/** LB2 — Stromstärke I (ohne Ohmsches Gesetz) */
const stromstaerke: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'In welcher Einheit wird die Stromstärke angegeben?',
        correct: 'Ampere (A)',
        wrong: ['Volt (V)', 'Ohm (Ω)', 'Watt (W)'],
      },
      {
        q: 'Stromstärke beschreibt …',
        correct: 'wie viel Ladung pro Zeit durch den Leiter fließt',
        wrong: ['nur die Temperatur der Leitung', 'nur die Masse der Batterie', 'die Farbe der Isolierung'],
      },
      {
        q: 'Womit misst man die Stromstärke?',
        correct: 'mit dem Amperemeter (in Reihe)',
        wrong: ['mit dem Voltmeter parallel als einzige Option', 'nur mit dem Lineal', 'nur mit der Waage'],
        visual: 'ammeter' as const,
      },
      {
        q: 'Ohne geschlossenen Stromkreis ist die Stromstärke …',
        correct: 'null (kein Stromfluss)',
        wrong: ['immer maximal', 'unendlich', 'gleich der Spannung in Volt'],
        visual: 'open' as const,
      },
      {
        q: 'Welche Formel verbindet Stromstärke I, Ladung Q und Zeit t?',
        correct: 'I = Q / t',
        wrong: ['I = Q · t', 'I = t / Q', 'I = Q + t'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Stromstärke I in Ampere: I = Q/t. Messung mit Amperemeter in Reihe.',
      instruction: 'Tippe die passende Aussage:',
      ...('visual' in c && c.visual === 'open'
        ? { visualContent: circuitSvg(false, 'Lampe') }
        : 'visual' in c && c.visual === 'ammeter'
          ? { visualContent: meterWiredCircuitSvg({ meter: 'A' }) }
          : {}),
    })
  },
  (rng) => {
    const Q = pick(rng, [10, 12, 20, 24, 30])
    const t = pick(rng, [2, 4, 5, 6, 10])
    if (Q % t !== 0) {
      const t2 = 2
      const I = Q / t2
      return valueTask({
        question: `Durch einen Leiter fließt die Ladung Q = ${Q} C in t = ${t2} s. Berechne die Stromstärke I.`,
        answerKind: 'integer',
        unit: 'A',
        value: I,
        solution: `${I} A`,
        explanation: `I = Q / t = ${Q}/${t2} = ${I} A.`,
      })
    }
    const I = Q / t
    return valueTask({
      question: `Durch einen Leiter fließt die Ladung Q = ${Q} C in t = ${t} s. Berechne die Stromstärke I.`,
      answerKind: 'integer',
      unit: 'A',
      value: I,
      solution: `${I} A`,
      explanation: `I = Q / t = ${Q}/${t} = ${I} A.`,
    })
  },
  (_rng) =>
    dragDropSlotsTask({
      question: 'Baue die Formel für die Stromstärke. Einen Block brauchst du nicht.',
      items: [
        { label: 'I', value: 0 },
        { label: '=', value: 1 },
        { label: 'Q', value: 2 },
        { label: '/', value: 3 },
        { label: 't', value: 4 },
        { label: '· U', value: 5 },
      ],
      correctSlots: [0, 1, 2, 3, 4],
      solution: 'I = Q / t',
      explanation: 'Stromstärke = Ladung geteilt durch Zeit.',
    }),
  (_rng) =>
    multiSelectTask({
      question: 'Was gehört zur Stromstärke? (mehrere möglich)',
      choices: [
        'Einheit Ampere (A)',
        'Formel I = Q / t',
        'Messung mit Amperemeter',
        'Einheit Volt (V)',
        'Messung nur mit Voltmeter parallel',
      ],
      correct: ['Einheit Ampere (A)', 'Formel I = Q / t', 'Messung mit Amperemeter'],
      solution: 'A, I = Q/t, Amperemeter.',
      explanation: 'Volt ist die Einheit der Spannung.',
      instruction: 'Tippe alle zutreffenden Aussagen:',
    }),
)

/** LB2 — Spannung U (ohne Ohmsches Gesetz) */
const spannung: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'In welcher Einheit wird die elektrische Spannung angegeben?',
        correct: 'Volt (V)',
        wrong: ['Ampere (A)', 'Ohm (Ω)', 'Newton (N)'],
      },
      {
        q: 'Spannung treibt …',
        correct: 'Ladungen durch den Stromkreis (Ursache für Strom)',
        wrong: ['nur die Masse der Leitung', 'nur die Farbe der Isolierung', 'die Temperatur auf 0 K'],
      },
      {
        q: 'Womit misst man die Spannung?',
        correct: 'mit dem Voltmeter (parallel zum Bauteil)',
        wrong: ['nur mit dem Amperemeter in Reihe als Kurzschluss', 'nur mit dem Lineal', 'nur mit der Waage'],
        visual: 'voltmeter' as const,
      },
      {
        q: 'An den Polen einer Batterie misst man …',
        correct: 'die Quellenspannung (näherungsweise)',
        wrong: ['nur die Masse in kg', 'nur den Kurzschlussstrom ohne Gerät', 'die Temperatur der Luft'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Spannung U in Volt; Messung parallel mit Voltmeter.',
      instruction: 'Tippe die passende Aussage:',
      ...('visual' in c && c.visual === 'voltmeter'
        ? { visualContent: meterWiredCircuitSvg({ meter: 'V' }) }
        : {}),
    })
  },
  (rng) => {
    const R = pick(rng, [2, 3, 4, 5, 6])
    const I = pick(rng, [2, 3, 4])
    const U = R * I
    return valueTask({
      question: `An einem Widerstand gelten R = ${R} Ω und I = ${I} A. Berechne die Spannung U.`,
      answerKind: 'integer',
      unit: 'V',
      value: U,
      solution: `${U} V`,
      explanation: `U = R · I = ${R}·${I} = ${U} V.`,
    })
  },
  (_rng) =>
    dragDropSlotsTask({
      question: 'Baue die Formel für die Spannung am Widerstand. Einen Block brauchst du nicht.',
      items: [
        { label: 'U', value: 0 },
        { label: '=', value: 1 },
        { label: 'R', value: 2 },
        { label: '· I', value: 3 },
        { label: '/ t', value: 4 },
      ],
      correctSlots: [0, 1, 2, 3],
      solution: 'U = R · I',
      explanation: 'Spannung = Widerstand mal Stromstärke.',
      checkMode: 'commutativeFactors',
    }),
  (_rng) =>
    multiSelectTask({
      question: 'Was gehört zur Spannung? (mehrere möglich)',
      choices: [
        'Einheit Volt (V)',
        'Messung mit Voltmeter parallel',
        'treibt Ladungen durch den Kreis',
        'Einheit Ampere (A)',
        'wird nur mit dem Amperemeter in Reihe gemessen',
      ],
      correct: [
        'Einheit Volt (V)',
        'Messung mit Voltmeter parallel',
        'treibt Ladungen durch den Kreis',
      ],
      solution: 'V, Voltmeter parallel, treibt den Strom.',
      explanation: 'Ampere ist die Einheit der Stromstärke.',
      instruction: 'Tippe alle zutreffenden Aussagen:',
    }),
)

/** LB2 — Zusammenhang Stromstärke/Spannung in Kreisen (ohne Ohm-Rechnung) */
const strom: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Wenn die Spannung an einem ohmschen Verbraucher steigt (R gleich), wird die Stromstärke …',
        correct: 'größer',
        wrong: ['immer kleiner', 'immer null', 'unabhängig von U immer gleich'],
      },
      {
        q: 'Was gilt qualitativ: höhere Spannung bei gleichem Widerstand → …',
        correct: 'größere Stromstärke',
        wrong: ['kleinere Stromstärke', 'keine Wirkung', 'nur mehr Masse'],
      },
      {
        q: 'Stromstärke und Spannung sind …',
        correct: 'verschiedene Größen (A bzw. V) mit unterschiedlichem Messgerät',
        wrong: ['dieselbe Größe mit derselben Einheit', 'nur Temperaturen', 'nur Massen'],
      },
      {
        q: 'Kleine Spannung bei gleichem Widerstand bedeutet typischerweise …',
        correct: 'kleine Stromstärke',
        wrong: ['immer große Stromstärke', 'keinen Zusammenhang', 'nur mehr Wärme ohne Strom'],
      },
      {
        q: 'Einheit der Stromstärke und der Spannung?',
        correct: 'Ampere (A) und Volt (V)',
        wrong: ['beide Ampere', 'beide Volt', 'Watt und Ohm'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Spannung treibt; Strom fließt. Qualitativ: bei gleichem R steigt I mit U. Zahlen mit R = U/I gehören zum Ohmschen Gesetz.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const closed = pick(rng, [true, false])
    const correct = closed ? 'Strom kann fließen (Kreis geschlossen)' : 'kein Strom (Kreis offen)'
    return choicePickTask({
      question: 'Was gilt für den gezeigten Stromkreis?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          closed ? 'kein Strom (Kreis offen)' : 'Strom kann fließen (Kreis geschlossen)',
          'nur Magnetkraft ohne Batterie',
          'Spannung ist immer null',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation: closed
        ? 'Geschlossener Schalter → Leiterweg durchgängig → Strom möglich.'
        : 'Offener Schalter → Unterbrechung → kein Strom.',
      instruction: 'Tippe die passende Aussage:',
      visualContent: circuitSvg(closed, 'Lampe'),
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Aussagen zu Spannung und Stromstärke stimmen? (mehrere möglich)',
      choices: [
        'Stromstärke wird in Ampere gemessen',
        'Spannung wird in Volt gemessen',
        'Bei gleichem Widerstand wächst I typischerweise mit U',
        'Widerstand wird in Ampere gemessen',
        'Spannung und Stromstärke sind dieselbe Größe',
      ],
      correct: [
        'Stromstärke wird in Ampere gemessen',
        'Spannung wird in Volt gemessen',
        'Bei gleichem Widerstand wächst I typischerweise mit U',
      ],
      solution: 'A und V; qualitativ I wächst mit U (bei festem R).',
      explanation: 'Widerstand hat die Einheit Ohm — Rechnungen gehören zum Thema Ohmsches Gesetz.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
  (rng) => {
    const U1 = pick(rng, [3, 4, 6])
    const U2 = U1 * 2
    return choicePickTask({
      question: `An gleichem Widerstand: zuerst U = ${U1} V, dann U = ${U2} V. Was passiert mit der Stromstärke?`,
      choices: shuffleChoices(
        rng,
        [
          'Sie wird etwa doppelt so groß',
          'Sie wird halb so groß',
          'Sie bleibt immer gleich',
          'Sie wird null',
        ],
        'Sie wird etwa doppelt so groß',
      ),
      correct: 'Sie wird etwa doppelt so groß',
      solution: 'Sie wird etwa doppelt so groß',
      explanation: `Bei ohmschem Verhalten ist I proportional zu U — verdoppelte Spannung → etwa verdoppelte Stromstärke.`,
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** LB2 — Ohmsches Gesetz */
const ohm: Topic['generate'] = mixedVariants(
  (rng) => {
    const pairs = [
      { U: 12, R: 4 },
      { U: 6, R: 2 },
      { U: 9, R: 3 },
      { U: 10, R: 5 },
      { U: 8, R: 4 },
      { U: 15, R: 5 },
    ] as const
    const { U, R } = pick(rng, [...pairs])
    const I = U / R
    return valueTask({
      question: `An einem ohmschen Widerstand liegen U = ${U} V und R = ${R} Ω. Berechne die Stromstärke I.`,
      answerKind: 'integer',
      unit: 'A',
      value: I,
      solution: `${I} A`,
      explanation: `I = U / R = ${U} / ${R} = ${I} A.`,
    })
  },
  (rng) => {
    const I = pick(rng, [2, 3, 4, 5])
    const R = pick(rng, [2, 3, 4, 5, 6])
    const U = I * R
    return valueTask({
      question: `I = ${I} A, R = ${R} Ω. Berechne die Spannung U.`,
      answerKind: 'integer',
      unit: 'V',
      value: U,
      solution: `${U} V`,
      explanation: `U = R · I = ${R}·${I} = ${U} V.`,
    })
  },
  (rng) => {
    const pairs = [
      [6, 2],
      [9, 3],
      [12, 2],
      [12, 3],
      [12, 4],
      [15, 3],
      [15, 5],
    ] as const
    const [U, I] = pick(rng, [...pairs])
    const R = U / I
    return valueTask({
      question: `U = ${U} V, I = ${I} A. Berechne den Widerstand R.`,
      answerKind: 'integer',
      unit: 'Ω',
      value: R,
      solution: `${R} Ω`,
      explanation: `R = U / I = ${U}/${I} = ${R} Ω.`,
    })
  },
  (_rng) =>
    dragDropSlotsTask({
      question: 'Baue das Ohmsche Gesetz. Einen Block brauchst du nicht.',
      items: [
        { label: 'R', value: 0 },
        { label: '=', value: 1 },
        { label: 'U', value: 2 },
        { label: '/', value: 3 },
        { label: 'I', value: 4 },
        { label: '· t', value: 5 },
      ],
      correctSlots: [0, 1, 2, 3, 4],
      solution: 'R = U / I',
      explanation: 'Widerstand = Spannung geteilt durch Stromstärke.',
    }),
  (rng) => {
    const cases = [
      {
        q: 'Was gilt für einen ohmschen Widerstand (Kennlinie)?',
        correct: 'U und I sind proportional (Gerade durch Ursprung)',
        wrong: ['U und I sind unabhängig', 'I ist immer null', 'nur Magnetkraft zählt'],
      },
      {
        q: 'Einheit des elektrischen Widerstands?',
        correct: 'Ohm (Ω)',
        wrong: ['Ampere (A)', 'Volt (V)', 'Newton (N)'],
      },
      {
        q: 'Ohmsches Gesetz lautet …',
        correct: 'R = U / I (bzw. U = R·I)',
        wrong: ['R = U · I', 'R = I / U ohne Bezug', 'R = U + I'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Ohmsches Gesetz: R = U/I, Einheit Ohm.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** LB2 — Reihenschaltung */
const reihe: Topic['generate'] = mixedVariants(
  (_rng) =>
    dragDropSlotsTask({
      question:
        'Baue eine Formel für den Gesamtwiderstand von in Reihe geschalteten Widerständen! Einen Block brauchst du nicht.',
      items: [
        { label: 'R', value: 0 },
        { label: '=', value: 1 },
        { label: 'R₁', value: 2 },
        { label: '+', value: 3 },
        { label: 'R₂', value: 4 },
        { label: '· U', value: 5 },
      ],
      correctSlots: [0, 1, 2, 3, 4],
      solution: 'R = R₁ + R₂',
      explanation: 'In Reihe addieren sich die Widerstände.',
      visualContent: seriesParallelSvg('series', { load: 'resistor' }),
    }),
  (rng) => {
    const r1 = pick(rng, [2, 3, 4, 5, 6])
    const r2 = pick(rng, [2, 3, 4, 5, 6])
    const r = r1 + r2
    return valueTask({
      question: `Zwei Widerstände in Reihe: R₁ = ${r1} Ω, R₂ = ${r2} Ω. Berechne den Gesamtwiderstand.`,
      answerKind: 'integer',
      unit: 'Ω',
      value: r,
      solution: `${r} Ω`,
      explanation: `R = R₁ + R₂ = ${r1} + ${r2} = ${r} Ω.`,
      visualContent: seriesParallelSvg('series', { load: 'resistor' }),
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'In einer Reihenschaltung ist der Strom …',
        correct: 'überall gleich groß',
        wrong: ['an jedem Widerstand anders', 'immer null', 'nur an der Batterie messbar'],
      },
      {
        q: 'Zwei gleiche Widerstände in Reihe: einer fällt aus (Unterbrechung). Was passiert?',
        correct: 'Der Stromkreis ist unterbrochen',
        wrong: ['Nur der andere leitet weiter', 'Der Strom verdoppelt sich', 'Die Batterie wird zum Isolator'],
      },
      {
        q: 'Woran erkennst du eine Reihenschaltung zweier Widerstände?',
        correct: 'Der Strom muss nacheinander durch beide',
        wrong: ['Jeder Widerstand hat einen eigenen Zweig', 'Es gibt keinen gemeinsamen Weg', 'Widerstände brauchen keine Drähte'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Reihe: ein Stromweg, Widerstände addieren sich.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'Reihenschaltung'
    return choicePickTask({
      question: 'Welche Schaltung zeigt die Skizze?',
      choices: shuffleChoices(rng, [correct, 'Parallelschaltung', 'Kurzschluss ohne Widerstände', 'kein Kreis'], correct),
      correct,
      solution: correct,
      explanation: 'Gemeinsamer Weg durch beide Widerstände = Reihe.',
      instruction: 'Tippe die Schaltungsart:',
      visualContent: seriesParallelSvg('series', { load: 'resistor' }),
    })
  },
)

/** LB2 — Parallelschaltung */
const parallel: Topic['generate'] = mixedVariants(
  (_rng) =>
    dragDropSlotsTask({
      question:
        'Baue eine Formel für den Gesamtwiderstand von parallel geschalteten Widerständen! Einen Block brauchst du nicht.',
      items: [
        { label: '1/R', value: 0 },
        { label: '=', value: 1 },
        { label: '1/R₁', value: 2 },
        { label: '+', value: 3 },
        { label: '1/R₂', value: 4 },
        { label: '· U', value: 5 },
      ],
      correctSlots: [0, 1, 2, 3, 4],
      solution: '1/R = 1/R₁ + 1/R₂',
      explanation: 'Parallel: Kehrwerte der Widerstände addieren.',
      visualContent: seriesParallelSvg('parallel', { load: 'resistor' }),
    }),
  (rng) => {
    const pairs = [
      [2, 2, 1],
      [3, 6, 2],
      [4, 4, 2],
      [6, 3, 2],
    ] as const
    const [a, b, req] = pick(rng, [...pairs])
    return valueTask({
      question: `Zwei Widerstände parallel: R₁ = ${a} Ω, R₂ = ${b} Ω. Gesamtwiderstand?`,
      answerKind: 'integer',
      unit: 'Ω',
      value: req,
      solution: `${req} Ω`,
      explanation: `1/R = 1/${a} + 1/${b} → R = ${req} Ω.`,
      visualContent: seriesParallelSvg('parallel', { load: 'resistor' }),
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'In einer Parallelschaltung ist die Spannung an den Zweigen …',
        correct: 'näherungsweise gleich groß',
        wrong: ['immer null', 'nur am ersten Zweig', 'immer völlig verschieden ohne Quelle'],
      },
      {
        q: 'Zwei gleiche Widerstände parallel: einer fällt aus. Was passiert typischerweise?',
        correct: 'Der andere Zweig kann weiter Strom führen',
        wrong: ['Beide Zweige müssen ausfallen', 'Die Spannung wird immer null', 'Es gibt keinen Strom mehr'],
      },
      {
        q: 'Woran erkennst du eine Parallelschaltung zweier Widerstände?',
        correct: 'Jeder Widerstand hat einen eigenen Zweig',
        wrong: [
          'Der Strom muss nacheinander durch beide',
          'Es gibt nur einen Weg ohne Verzweigung',
          'Widerstände dürfen keine Drähte haben',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Parallel: eigene Zweige, gleiche Spannung, 1/R = 1/R₁ + 1/R₂.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'Parallelschaltung'
    return choicePickTask({
      question: 'Welche Schaltung zeigt die Skizze?',
      choices: shuffleChoices(rng, [correct, 'Reihenschaltung', 'Kurzschluss ohne Widerstände', 'kein Kreis'], correct),
      correct,
      solution: correct,
      explanation: 'Eigene Zweige für jeden Widerstand = Parallel.',
      instruction: 'Tippe die Schaltungsart:',
      visualContent: seriesParallelSvg('parallel', { load: 'resistor' }),
    })
  },
)

/** LB2 — Strom und Spannung messen */
const messen: Topic['generate'] = mixedVariants(
  (rng) => {
    const series = pick(rng, [true, false])
    const correct = series ? 'Amperemeter (A)' : 'Voltmeter (V)'
    return choicePickTask({
      question: series
        ? 'In die gelbe Lücke im Stromweg gehört welches Messgerät?'
        : 'In die gelbe Lücke parallel zur Lampe gehört welches Messgerät?',
      choices: shuffleChoices(rng, ['Amperemeter (A)', 'Voltmeter (V)', 'kein Messgerät', 'nur ein Schalter'], correct),
      correct,
      solution: correct,
      explanation: series
        ? 'Lücke im Stromweg (Reihe) → Amperemeter.'
        : 'Lücke parallel zum Bauteil → Voltmeter.',
      instruction: 'Tippe das passende Messgerät:',
      visualContent: meterGapCircuitSvg({ mode: series ? 'seriesGap' : 'parallelGap' }),
    })
  },
  (rng) => {
    const meter = pick(rng, ['A', 'V'] as const)
    const correct =
      meter === 'A'
        ? 'Amperemeter misst die Stromstärke (in Reihe)'
        : 'Voltmeter misst die Spannung (parallel)'
    return choicePickTask({
      question: 'Was zeigt die Skizze richtig?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          meter === 'A'
            ? 'Voltmeter misst die Spannung (parallel)'
            : 'Amperemeter misst die Stromstärke (in Reihe)',
          'Messgeräte brauchen keinen Anschluss',
          'A und V sind immer parallel und in Reihe zugleich',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        meter === 'A'
          ? 'Amperemeter: Kreisstrom, Einbau in Reihe.'
          : 'Voltmeter: Spannungsabfall, Einbau parallel.',
      instruction: 'Tippe die passende Aussage:',
      visualContent: meterWiredCircuitSvg({ meter }),
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Amperemeter wird typischerweise … geschaltet.',
        correct: 'in Reihe in den Stromkreis',
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
      {
        q: 'Was misst das Voltmeter?',
        correct: 'die Spannung',
        wrong: ['die Stromstärke', 'die Masse', 'nur den Widerstand ohne Spannung'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'A in Reihe (Strom), V parallel (Spannung).',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (_rng) =>
    dragDropSlotsTask({
      question:
        'Ordne: Amperemeter wird … geschaltet. Einen Block brauchst du nicht.',
      items: [
        { label: 'Amperemeter', value: 0 },
        { label: '→', value: 1 },
        { label: 'in Reihe', value: 2 },
        { label: 'als Kurzschluss', value: 3 },
      ],
      correctSlots: [0, 1, 2],
      solution: 'Amperemeter → in Reihe',
      explanation: 'Amperemeter immer in den Stromweg (Reihe), nie als Kurzschluss parallel zur Quelle.',
      visualContent: meterWiredCircuitSvg({ meter: 'A' }),
    }),
  (_rng) =>
    dragDropSlotsTask({
      question:
        'Ordne: Voltmeter wird … geschaltet. Einen Block brauchst du nicht.',
      items: [
        { label: 'Voltmeter', value: 0 },
        { label: '→', value: 1 },
        { label: 'parallel', value: 2 },
        { label: 'als Kurzschluss', value: 3 },
      ],
      correctSlots: [0, 1, 2],
      solution: 'Voltmeter → parallel',
      explanation: 'Voltmeter parallel zum Bauteil, an dem U gemessen werden soll.',
      visualContent: meterWiredCircuitSvg({ meter: 'V' }),
    }),
  (_rng) =>
    multiSelectTask({
      question: 'Was gilt beim Messen? (mehrere möglich)',
      choices: [
        'Amperemeter in Reihe',
        'Voltmeter parallel',
        'Amperemeter parallel zur Batterie als Kurzschluss',
        'Voltmeter misst Spannung',
        'Amperemeter misst Stromstärke',
      ],
      correct: [
        'Amperemeter in Reihe',
        'Voltmeter parallel',
        'Voltmeter misst Spannung',
        'Amperemeter misst Stromstärke',
      ],
      solution: 'A Reihe/Strom, V parallel/Spannung — nie A als Kurzschluss.',
      explanation: 'Falsch ist Amperemeter parallel zur Quelle (Kurzschlussgefahr).',
      instruction: 'Tippe alle zutreffenden Aussagen:',
    }),
)

/** LB3 — Energieformen (kein Leistungs-Thema) */
const energieformen: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Welche Energieform hat ein fliegender Tennisball vor allem?',
        correct: 'kinetische Energie (Bewegungsenergie)',
        wrong: ['nur chemische Energie', 'nur elektrische Energie', 'Ampere'],
      },
      {
        q: 'Welche Energieform hat ein Buch auf dem Tisch vor allem?',
        correct: 'Lageenergie (potenzielle Energie)',
        wrong: ['nur kinetische Energie', 'nur Strahlungsenergie', 'Newton als Energieform'],
      },
      {
        q: 'Welche Energieform speichert eine Batterie vor allem?',
        correct: 'chemische Energie',
        wrong: ['nur kinetische Energie', 'nur Lageenergie der Erde', 'Ampere'],
      },
      {
        q: 'Welche Energieform liefert die Steckdose?',
        correct: 'elektrische Energie',
        wrong: ['nur Lageenergie', 'nur chemische Energie der Luft', 'Pascal'],
      },
      {
        q: 'Welche Energieform hat warmes Wasser vor allem?',
        correct: 'thermische Energie (Wärmeenergie)',
        wrong: ['nur elektrische Energie', 'nur Ampère', 'nur Newton'],
      },
      {
        q: 'Welche Energieform hat Sonnenlicht vor allem?',
        correct: 'Strahlungsenergie (Lichtenergie)',
        wrong: ['nur Lageenergie', 'nur Ampere', 'nur Masse'],
      },
      {
        q: 'Ein gespannter Gummi (Flitzebogen) speichert vor allem …',
        correct: 'Lageenergie / Spannenergie (potenzielle Energie)',
        wrong: ['nur elektrische Energie', 'nur Ampere', 'nur Temperatur ohne Energie'],
      },
      {
        q: 'Einheit der Energie?',
        correct: 'Joule (J)',
        wrong: ['Watt (W)', 'Ampere (A)', 'Newton (N)'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Wichtige Energieformen: kinetisch, Lage/potenziell, chemisch, elektrisch, thermisch, Strahlung. Einheit: Joule.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const sets = [
      {
        q: 'Welche der folgenden sind Energieformen? (mehrere möglich)',
        choices: [
          'kinetische Energie (Bewegungsenergie)',
          'Lageenergie (potenzielle Energie)',
          'chemische Energie',
          'elektrische Energie',
          'ein Newtonmeter als Kraftart',
          'Ampere als Energieform',
        ],
        correct: [
          'kinetische Energie (Bewegungsenergie)',
          'Lageenergie (potenzielle Energie)',
          'chemische Energie',
          'elektrische Energie',
        ],
        solution: 'Bewegungs-, Lage-, chemische und elektrische Energie.',
        explanation: 'Newton/Ampere sind keine Energieformen.',
      },
      {
        q: 'Welche gehören zu den Energieformen? (mehrere möglich)',
        choices: [
          'thermische Energie',
          'Strahlungsenergie (Licht)',
          'Spannenergie in einer Feder',
          'Watt als Energieform',
          'Volt als Energieform',
          'chemische Energie in Nahrung',
        ],
        correct: [
          'thermische Energie',
          'Strahlungsenergie (Licht)',
          'Spannenergie in einer Feder',
          'chemische Energie in Nahrung',
        ],
        solution: 'thermisch, Strahlung, Spannenergie, chemisch.',
        explanation: 'Watt und Volt sind Einheiten anderer Größen, keine Energieformen.',
      },
      {
        q: 'Was sind Energieformen? (mehrere möglich)',
        choices: [
          'Bewegungsenergie',
          'Lageenergie',
          'elektrische Energie',
          'thermische Energie',
          'Kilogramm als Energieform',
          'Sekunde als Energieform',
        ],
        correct: ['Bewegungsenergie', 'Lageenergie', 'elektrische Energie', 'thermische Energie'],
        solution: 'Bewegung, Lage, elektrisch, thermisch.',
        explanation: 'kg und s sind keine Energieformen.',
      },
    ] as const
    const s = pick(rng, [...sets])
    return multiSelectTask({
      question: s.q,
      choices: [...s.choices],
      correct: [...s.correct],
      solution: s.solution,
      explanation: s.explanation,
      instruction: 'Tippe alle Energieformen:',
    })
  },
  (rng) => {
    const pairs = [
      { sit: 'brennendes Lagerfeuer', forms: 'chemische → thermische + Strahlungsenergie' },
      { sit: 'Bergsteiger auf dem Gipfel', forms: 'Lageenergie (potenziell)' },
      { sit: 'fahrendes Auto', forms: 'kinetische Energie' },
      { sit: 'Akku eines Handys', forms: 'chemische Energie' },
    ] as const
    const p = pick(rng, [...pairs])
    return choicePickTask({
      question: `Situation: ${p.sit}. Welche Energieform(en) passen am besten?`,
      choices: shuffleChoices(
        rng,
        [p.forms, 'nur Ampere', 'nur Watt als Energieform', 'nur die Masse in kg'],
        p.forms,
      ),
      correct: p.forms,
      solution: p.forms,
      explanation: 'Energieformen beschreiben, in welcher „Art“ Energie vorliegt — nicht Masse oder Stromstärke.',
      instruction: 'Tippe die passende Zuordnung:',
    })
  },
  (_rng) =>
    dragDropSlotsTask({
      question: 'Baue: Energie wird in … gemessen. Einen Block brauchst du nicht.',
      items: [
        { label: 'Energie', value: 0 },
        { label: '→', value: 1 },
        { label: 'Joule (J)', value: 2 },
        { label: 'Watt (W)', value: 3 },
      ],
      correctSlots: [0, 1, 2],
      solution: 'Energie → Joule (J)',
      explanation: 'Energie: Joule. Watt ist die Einheit der Leistung (kommt im Leistungsthema).',
    }),
  (_rng) =>
    multiSelectTask({
      question: 'Was gilt für Energie? (mehrere möglich)',
      choices: [
        'Energie kann Formen wechseln (Umwandlung)',
        'Einheit oft Joule (J)',
        'Lageenergie hängt von der Höhe ab',
        'Ampere ist eine Energieform',
        'Leistung und Energie sind dieselbe Größe',
      ],
      correct: [
        'Energie kann Formen wechseln (Umwandlung)',
        'Einheit oft Joule (J)',
        'Lageenergie hängt von der Höhe ab',
      ],
      solution: 'Umwandlung, Joule, Lageenergie/Höhe.',
      explanation: 'Ampere ≠ Energieform. Leistung (Watt) ist ein anderes Thema.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
)

/** LB3 — Energiewandler (Geräte / Umwandlung im Gerät) */
const energie: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Was macht ein Energiewandler?',
        correct: 'wandelt eine Energieform in eine andere um',
        wrong: [
          'erzeugt Energie aus dem Nichts',
          'misst nur die Temperatur',
          'ändert die Masse eines Körpers dauerhaft',
        ],
      },
      {
        q: 'Generator im Wasserkraftwerk wandelt ungefähr …',
        correct: 'Bewegungsenergie → elektrische Energie',
        wrong: [
          'chemische Energie → Wärmeenergie',
          'Lichtenergie → chemische Energie',
          'elektrische Energie → chemische Energie',
        ],
      },
      {
        q: 'Taschenlampenbatterie beim Entladen: …',
        correct: 'chemische Energie → elektrische Energie',
        wrong: [
          'elektrische Energie → chemische Energie',
          'Wärmeenergie → Bewegungsenergie',
          'Lichtenergie → Lageenergie',
        ],
      },
      {
        q: 'Glühlampe wandelt ungefähr …',
        correct: 'elektrische Energie → Licht- und Wärmeenergie',
        wrong: [
          'Lichtenergie → elektrische Energie',
          'chemische Energie → Lageenergie',
          'Bewegungsenergie → chemische Energie',
        ],
      },
      {
        q: 'Solarmodul wandelt ungefähr …',
        correct: 'Strahlungsenergie (Licht) → elektrische Energie',
        wrong: [
          'elektrische Energie → Lichtenergie',
          'chemische Energie → Bewegungsenergie',
          'Wärmeenergie → chemische Energie',
        ],
      },
      {
        q: 'Elektromotor wandelt ungefähr …',
        correct: 'elektrische Energie → Bewegungsenergie',
        wrong: [
          'Bewegungsenergie → chemische Energie',
          'Lageenergie → Lichtenergie',
          'Ampere → Newton',
        ],
      },
      {
        q: 'Windkraftanlage: Ausgangsenergieform am Rotor?',
        correct: 'Bewegungsenergie (Wind)',
        wrong: ['nur chemische Energie', 'nur Lageenergie im See', 'nur Ampere'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Energiewandler ändern die Energieform — die Energie verschwindet nicht einfach.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const devices = [
      { d: 'Föhn', ok: 'elektrische → thermische (+ Bewegungs-)Energie' },
      { d: 'Lautsprecher', ok: 'elektrische → Schall-/Bewegungsenergie' },
      { d: 'Muskel (Mensch)', ok: 'chemische → Bewegungs-/Lageenergie' },
      { d: 'Kohlekraftwerk (vereinfacht)', ok: 'chemische → thermische → … → elektrische Energie' },
    ] as const
    const x = pick(rng, [...devices])
    return choicePickTask({
      question: `Welcher Energieweg passt zu: ${x.d}?`,
      choices: shuffleChoices(
        rng,
        [x.ok, 'Energie wird vernichtet', 'nur Ampere ohne Wandlung', 'Masse wird zu Watt'],
        x.ok,
      ),
      correct: x.ok,
      solution: x.ok,
      explanation: 'Immer Ausgangsform → gewünschte Form(en) benennen.',
      instruction: 'Tippe die passende Wandlung:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Geräte sind typische Energiewandler? (mehrere möglich)',
      choices: [
        'Elektromotor',
        'Solarzelle',
        'Glühlampe',
        'Lineal (nur Länge messen)',
        'Generator',
        'Thermometer (nur Temperatur anzeigen)',
      ],
      correct: ['Elektromotor', 'Solarzelle', 'Glühlampe', 'Generator'],
      solution: 'Motor, Solarzelle, Lampe, Generator.',
      explanation: 'Lineal und Thermometer wandeln keine Energieformen um — sie messen.',
      instruction: 'Tippe alle passenden Geräte:',
    }),
  (_rng) =>
    dragDropSlotsTask({
      question: 'Ordne: Energiewandler … Energieformen. Einen Block brauchst du nicht.',
      items: [
        { label: 'wandelt', value: 0 },
        { label: '→', value: 1 },
        { label: 'andere Form', value: 2 },
        { label: 'vernichtet Energie', value: 3 },
      ],
      correctSlots: [0, 1, 2],
      solution: 'wandelt → andere Form',
      explanation: 'Wandeln ≠ vernichten. (Verluste heißen oft Wärmeentwertung.)',
    }),
)

/** LB3 — Energieumwandlungsketten */
const umwandlung: Topic['generate'] = mixedVariants(
  (rng) => {
    const chains = [
      {
        q: 'Wasserkraftwerk: Ordne die Kette (Start → Ende).',
        items: [
          { label: 'Lageenergie (Wasser im See)', value: 0 },
          { label: 'kinetische Energie (fließendes Wasser)', value: 1 },
          { label: 'kinetische Energie (Turbine)', value: 2 },
          { label: 'elektrische Energie', value: 3 },
        ],
        order: [0, 1, 2, 3],
        solution: 'Lage → kinetisch (Wasser) → kinetisch (Turbine) → elektrisch',
        explanation: 'Höhe → Fluss → Turbine → Generatorstrom.',
      },
      {
        q: 'Fahrrad mit Dynamo: Ordne die Kette (Start → Ende).',
        items: [
          { label: 'chemische Energie (Nahrung)', value: 0 },
          { label: 'kinetische Energie (Pedale)', value: 1 },
          { label: 'elektrische Energie (Dynamo)', value: 2 },
          { label: 'Strahlungsenergie (Lampe)', value: 3 },
        ],
        order: [0, 1, 2, 3],
        solution: 'chemisch → kinetisch → elektrisch → Strahlung',
        explanation: 'Nahrung → Treten → Dynamo → Licht.',
      },
      {
        q: 'Taschenlampe: Ordne die Kette (Start → Ende).',
        items: [
          { label: 'chemische Energie (Batterie)', value: 0 },
          { label: 'elektrische Energie', value: 1 },
          { label: 'Strahlungs- + thermische Energie', value: 2 },
        ],
        order: [0, 1, 2],
        solution: 'chemisch → elektrisch → Licht/Wärme',
        explanation: 'Batterie → Strom → Licht und Erwärmung.',
      },
    ] as const
    const c = pick(rng, [...chains])
    return dragDropSortTask({
      question: c.q,
      items: [...c.items],
      correctOrder: [...c.order],
      solution: c.solution,
      explanation: c.explanation,
      rng,
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Bei realen Umwandlungen entsteht oft unerwünschte …',
        correct: 'thermische Energie (Wärme / Entwertung)',
        wrong: ['zusätzliche Masse', 'Ampere aus dem Nichts', 'verlorene Zeit als Energieform'],
      },
      {
        q: 'Reibung an Reifen „entwertet“ Energie vor allem als …',
        correct: 'thermische Energie (Wärme)',
        wrong: ['reine Lageenergie ohne Verlust', 'nur chemische Energie', 'Ampere'],
      },
      {
        q: 'Was beschreibt eine Energieumwandlungskette?',
        correct: 'nacheinander folgende Energieformen (oft mit →)',
        wrong: ['nur eine einzige Einheit Watt', 'nur die Masse', 'nur Ampere und Volt'],
      },
      {
        q: 'Wasserkraftwerk: erste Energieform im Stausee?',
        correct: 'Lageenergie (potenzielle Energie)',
        wrong: ['nur elektrische Energie', 'nur Ampere', 'nur chemische Energie der Luft'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Ketten: Form₁ → Form₂ → … ; Verluste oft als Wärme.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (_rng) =>
    dragDropSlotsTask({
      question: 'Baue die Taschenlampen-Kette. Einen Block brauchst du nicht.',
      items: [
        { label: 'chemisch', value: 0 },
        { label: '→', value: 1 },
        { label: 'elektrisch', value: 2 },
        { label: '→', value: 3 },
        { label: 'Licht/Wärme', value: 4 },
        { label: 'Ampere', value: 5 },
      ],
      correctSlots: [0, 1, 2, 3, 4],
      solution: 'chemisch → elektrisch → Licht/Wärme',
      explanation: 'Klassische Schulkette der Taschenlampe.',
    }),
  (_rng) =>
    multiSelectTask({
      question: 'Was gehört zu Energieumwandlungsketten? (mehrere möglich)',
      choices: [
        'Pfeile → für Umwandlungsschritte',
        'Beteiligte Energieformen nennen',
        'Wärme als mögliche Entwertung',
        'Leistung P = E/t berechnen (eigenes Thema)',
        'Ampere als Energieform in der Kette',
      ],
      correct: [
        'Pfeile → für Umwandlungsschritte',
        'Beteiligte Energieformen nennen',
        'Wärme als mögliche Entwertung',
      ],
      solution: 'Formen + Pfeile; Wärme oft Verlust.',
      explanation: 'Leistungsrechnung gehört zum Thema Leistung — hier geht es um Ketten.',
      instruction: 'Tippe alle zutreffenden Aussagen:',
    }),
  (rng) => {
    const miss = pick(rng, [
      {
        q: 'Fahrrad bergab mit Dynamo und LED: Welche Form fehlt oft am Ende der Kette?',
        correct: 'Strahlungsenergie (Licht der LED)',
        wrong: ['nur Ampere', 'nur Newton', 'nur Kilogramm'],
      },
      {
        q: 'Nach der Turbine im Wasserkraftwerk folgt typischerweise …',
        correct: 'elektrische Energie (Generator)',
        wrong: ['nur chemische Energie der Kohle', 'nur Ampère ohne Gerät', 'nur Licht der Sonne'],
      },
    ] as const)
    return choicePickTask({
      question: miss.q,
      choices: shuffleChoices(rng, [miss.correct, ...miss.wrong], miss.correct),
      correct: miss.correct,
      solution: miss.correct,
      explanation: 'Kette zu Ende denken: welche Form kommt als Nächstes?',
      instruction: 'Tippe die passende Form:',
    })
  },
)

/** LB3 — Wirkungsgrad */
const wirkungsgrad: Topic['generate'] = mixedVariants(
  (rng) => {
    const pairs = [
      [2, 10, 20],
      [4, 10, 40],
      [5, 20, 25],
      [15, 50, 30],
      [40, 100, 40],
      [170, 200, 85],
    ] as const
    const [en, ez, eta] = pick(rng, [...pairs])
    return valueTask({
      question: `Ein Gerät nimmt ${ez} J auf und nutzt ${en} J. Berechne den Wirkungsgrad η in %.`,
      answerKind: 'integer',
      unit: '%',
      value: eta,
      solution: `${eta} %`,
      explanation: `η = E_nutz / E_zu · 100 % = ${en}/${ez}·100 % = ${eta} %.`,
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Wirkungsgrad η ist …',
        correct: 'genutzte Energie / zugeführte Energie (oft in %)',
        wrong: ['zugeführte / genutzte Energie', 'E_nutz · E_zu', 'E_zu − E_nutz ohne Bezug'],
      },
      {
        q: 'Der Wirkungsgrad ist in der Realität …',
        correct: 'immer kleiner als 100 %',
        wrong: ['immer genau 100 %', 'immer größer als 100 %', 'immer 0 %'],
      },
      {
        q: 'Alte Glühlampe: typischer Wirkungsgrad für Licht?',
        correct: 'sehr klein (viel Wärme statt Licht)',
        wrong: ['nahe 100 % nur Licht', 'größer als 100 %', 'ohne Energieumwandlung'],
      },
      {
        q: 'LED gegenüber Glühlampe: Wirkungsgrad für Licht ist …',
        correct: 'deutlich höher (weniger ungenutzte Wärme)',
        wrong: ['immer kleiner', 'immer 0 %', 'größer als 100 %'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'η = E_nutz/E_zu < 1; Rest oft Wärme (Entwertung).',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (_rng) =>
    dragDropSlotsTask({
      question: 'Baue die Wirkungsgrad-Formel. Einen Block brauchst du nicht.',
      items: [
        { label: 'η', value: 0 },
        { label: '=', value: 1 },
        { label: 'E_nutz', value: 2 },
        { label: '/', value: 3 },
        { label: 'E_zu', value: 4 },
        { label: '· t', value: 5 },
      ],
      correctSlots: [0, 1, 2, 3, 4],
      solution: 'η = E_nutz / E_zu',
      explanation: 'Genutzte durch zugeführte Energie — oft ·100 % für Prozent.',
    }),
  (rng) => {
    const ez = pick(rng, [100, 200, 50])
    const en = pick(rng, [ez === 100 ? 40 : ez === 200 ? 170 : 20, ez === 100 ? 30 : ez === 200 ? 150 : 10])
    const waste = ez - en
    return valueTask({
      question: `Zugeführt ${ez} J, genutzt ${en} J. Wie viel Energie wird entwertet (in J)?`,
      answerKind: 'integer',
      unit: 'J',
      value: waste,
      solution: `${waste} J`,
      explanation: `E_verlust = E_zu − E_nutz = ${ez} − ${en} = ${waste} J.`,
    })
  },
  (rng) => {
    const eta = pick(rng, [5, 20, 40, 85])
    return choicePickTask({
      question: 'Was zeigt das Energieflussdiagramm? (Nutzanteil siehe Skizze)',
      choices: shuffleChoices(
        rng,
        [
          `etwa ${eta} % der Energie werden genutzt, der Rest oft als Wärme abgegeben`,
          'Energie wird vollständig vernichtet',
          'Wirkungsgrad ist immer über 100 %',
          'nur Ampere wird umgewandelt',
        ],
        `etwa ${eta} % der Energie werden genutzt, der Rest oft als Wärme abgegeben`,
      ),
      correct: `etwa ${eta} % der Energie werden genutzt, der Rest oft als Wärme abgegeben`,
      solution: `genutzt ≈ ${eta} %`,
      explanation: 'Breiter Eingangspfeil, schmalerer Nutzpfeil, Abzweig = Verlust/Wärme.',
      instruction: 'Tippe die passende Deutung:',
      visualContent: energyFlowSvg({
        inputLabel: 'E_zu',
        usefulLabel: 'Nutzen',
        wasteLabel: 'Wärme',
        usefulPct: eta,
      }),
    })
  },
)

/** LB3 — Leistung P = E/t */
const leistung: Topic['generate'] = mixedVariants(
  (rng) => {
    const e = pick(rng, [20, 40, 60, 100, 3000])
    const t = pick(rng, [2, 4, 5, 6, 10])
    if (e % t !== 0) {
      const t2 = 5
      const e2 = 100
      return valueTask({
        question: `E = ${e2} J, t = ${t2} s. Berechne die Leistung P.`,
        answerKind: 'integer',
        unit: 'W',
        value: 20,
        solution: '20 W',
        explanation: `P = E / t = ${e2}/${t2} = 20 W.`,
      })
    }
    const p = e / t
    return valueTask({
      question: `E = ${e} J, t = ${t} s. Berechne die Leistung P.`,
      answerKind: 'integer',
      unit: 'W',
      value: p,
      solution: `${p} W`,
      explanation: `P = E / t = ${e}/${t} = ${p} W.`,
    })
  },
  (rng) => {
    const p = pick(rng, [10, 20, 50, 2000])
    const t = pick(rng, [2, 5, 10, 60])
    const e = p * t
    return valueTask({
      question: `P = ${p} W, t = ${t} s. Berechne die umgewandelte Energie E.`,
      answerKind: 'integer',
      unit: 'J',
      value: e,
      solution: `${e} J`,
      explanation: `E = P · t = ${p}·${t} = ${e} J.`,
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Leistung beschreibt …',
        correct: 'wie schnell Energie umgewandelt/übertragen wird',
        wrong: [
          'nur die Gesamtmenge Energie im Tank',
          'nur die Masse',
          'nur die Temperatur',
        ],
      },
      {
        q: 'Unterschied Energie und Leistung?',
        correct: 'Energie = „wie viel“, Leistung = „wie schnell“',
        wrong: [
          'beides dieselbe Größe mit derselben Einheit',
          'Leistung ist immer Joule',
          'Energie wird in Watt gemessen',
        ],
      },
      {
        q: 'Einheit der Leistung?',
        correct: 'Watt (W)',
        wrong: ['Joule (J)', 'Ampere (A)', 'Newton (N)'],
      },
      {
        q: '1 kW sind …',
        correct: '1000 W',
        wrong: ['100 W', '10 W', '1 000 000 W'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'P = E/t in Watt. Energie in Joule — nicht verwechseln.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (_rng) =>
    dragDropSlotsTask({
      question: 'Baue die Leistungsformel. Einen Block brauchst du nicht.',
      items: [
        { label: 'P', value: 0 },
        { label: '=', value: 1 },
        { label: 'E', value: 2 },
        { label: '/', value: 3 },
        { label: 't', value: 4 },
        { label: '· m', value: 5 },
      ],
      correctSlots: [0, 1, 2, 3, 4],
      solution: 'P = E / t',
      explanation: 'Leistung = umgewandelte Energie geteilt durch Zeit.',
    }),
  (rng) => {
    const e = 3000
    const tMax = 6
    const tBen = 10
    const who = pick(rng, ['Max', 'Ben'] as const)
    const p = who === 'Max' ? e / tMax : e / tBen
    return valueTask({
      question: `Max und Ben wandeln je ${e} J Lageenergie an der Treppe um. Max: ${tMax} s, Ben: ${tBen} s. Leistung von ${who}?`,
      answerKind: 'integer',
      unit: 'W',
      value: p,
      solution: `${p} W`,
      explanation:
        who === 'Max'
          ? `P_Max = ${e}/${tMax} = ${p} W (kürzere Zeit → größere Leistung).`
          : `P_Ben = ${e}/${tBen} = ${p} W.`,
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Was gilt zur Leistung? (mehrere möglich)',
      choices: [
        'P = E / t',
        'Einheit Watt (W)',
        'gleiche Energie in kürzerer Zeit → größere Leistung',
        'Energie und Leistung haben dieselbe Einheit',
        '1 W = 1 J / 1 s',
      ],
      correct: [
        'P = E / t',
        'Einheit Watt (W)',
        'gleiche Energie in kürzerer Zeit → größere Leistung',
        '1 W = 1 J / 1 s',
      ],
      solution: 'P=E/t, Watt, Zeitbezug, 1 W = 1 J/s.',
      explanation: 'Energie: Joule — Leistung: Watt.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
)

/** LB3 — Energie sparen (anwendungsnah, Lehrplan: Aufwand/Reibung verringern) */
const energiesparen: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Energie sparen heißt oft …',
        correct: 'weniger Energie zuführen oder Verluste (z. B. Reibung/Wärme) verringern',
        wrong: ['Wirkungsgrad über 100 % erzwingen', 'Energie vernichten', 'nur Ampere erhöhen'],
      },
      {
        q: 'LED statt Glühlampe spart Energie, weil …',
        correct: 'bei gleichem Nutzen weniger Verlustwärme entsteht (besserer Wirkungsgrad)',
        wrong: ['die LED Energie aus dem Nichts erzeugt', 'Watt und Joule gleich sind', 'Reibung zunimmt'],
      },
      {
        q: 'Reibung verringern kann …',
        correct: 'den Energieaufwand für denselben Nutzen senken',
        wrong: ['den Wirkungsgrad über 100 % treiben', 'Energie verdoppeln ohne Ursache', 'nur die Masse ändern'],
      },
      {
        q: 'Warum verbraucht ein Gerät im Standby weiter Energie?',
        correct: 'Es nimmt weiterhin (wenig) elektrische Energie auf',
        wrong: ['Standby erzeugt Energie', 'Standby hat Wirkungsgrad über 100 %', 'Standby speichert nur Newton'],
      },
      {
        q: 'Wärmedämmung an Gebäuden spart Energie, weil …',
        correct: 'weniger Wärme ungewollt nach draußen entweicht',
        wrong: ['die Temperatur immer 0 °C wird', 'Reibung im Haus zunimmt', 'Ampere zur Energieform wird'],
      },
      {
        q: 'Öl im Fahrradlager (weniger Reibung) hilft beim Energiesparen, weil …',
        correct: 'weniger Bewegungsenergie in unerwünschte Wärme umgewandelt wird',
        wrong: ['die Masse des Rads verdoppelt wird', 'η über 100 % steigt', 'elektrische Energie entsteht aus dem Nichts'],
      },
      {
        q: 'Gerät A: η = 80 %, Gerät B: η = 40 % (gleicher Nutzen). Welches spart eher Energie?',
        correct: 'Gerät A (höherer Wirkungsgrad → weniger Zufuhr nötig)',
        wrong: ['Gerät B', 'beide gleich, η egal', 'keines, η > 100 % nötig'],
      },
      {
        q: 'Kurz duschen statt lange heiß baden spart vor allem …',
        correct: 'thermische Energie (weniger Warmwasser = weniger Energieaufwand)',
        wrong: ['Ampere als Energieform', 'nur Newton', 'Wirkungsgrad über 100 %'],
      },
      {
        q: 'Kühlschranktür zügig schließen spart Energie, weil …',
        correct: 'weniger warme Luft eindringt → weniger Kühlaufwand',
        wrong: ['der Kühlschrank Energie vernichtet', 'η über 100 % wird', 'nur die Farbe der Tür zählt'],
      },
      {
        q: 'Was ist keine sinnvolle Sparmaßnahme?',
        correct: 'Wirkungsgrad über 100 % fordern',
        wrong: [
          'LED statt alter Glühlampe',
          'unnötige Standby-Geräte ausschalten',
          'Reibung/Wärmeverluste verringern',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Sparen = gleichen Nutzen mit weniger Aufwand bzw. weniger Entwertung (Wärme/Reibung).',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const sets = [
      {
        q: 'Was hilft beim Energiesparen? (mehrere möglich)',
        choices: [
          'Geräte mit besserem Wirkungsgrad wählen',
          'unnötige Verluste (Wärme/Reibung) vermeiden',
          'Standby vermeiden, wenn sinnvoll',
          'Wirkungsgrad über 100 % erwarten',
          'Energieformen mit Ampere verwechseln',
        ],
        correct: [
          'Geräte mit besserem Wirkungsgrad wählen',
          'unnötige Verluste (Wärme/Reibung) vermeiden',
          'Standby vermeiden, wenn sinnvoll',
        ],
        solution: 'besserer η, weniger Verluste, sinnvoller Betrieb.',
        explanation: 'η > 100 % gibt es nicht.',
      },
      {
        q: 'Welche Maßnahmen verringern typischerweise den Energieaufwand? (mehrere möglich)',
        choices: [
          'Lager ölen (weniger Reibung)',
          'Raum isolieren / Fenster schließen im Winter',
          'LED statt Glühlampe',
          'Gerät unnötig auf höchster Stufe laufen lassen',
          'Kühlschrank lange offen stehen lassen',
        ],
        correct: [
          'Lager ölen (weniger Reibung)',
          'Raum isolieren / Fenster schließen im Winter',
          'LED statt Glühlampe',
        ],
        solution: 'Reibung↓, Dämmung, bessere Lampen.',
        explanation: 'Offener Kühlschrank und Dauer-Volllast erhöhen den Aufwand.',
      },
      {
        q: 'Was gehört zum Energiesparen im Alltag? (mehrere möglich)',
        choices: [
          'Licht ausschalten, wenn niemand im Raum ist',
          'Waschmaschine möglichst voll beladen (sinnvoll)',
          'Deckel auf den Topf beim Kochen',
          'Heizung aufdrehen und Fenster dauerhaft kippen',
          'η = 150 % als Ziel setzen',
        ],
        correct: [
          'Licht ausschalten, wenn niemand im Raum ist',
          'Waschmaschine möglichst voll beladen (sinnvoll)',
          'Deckel auf den Topf beim Kochen',
        ],
        solution: 'unnötigen Verbrauch vermeiden, effizient kochen/waschen.',
        explanation: 'Heizen bei gekipptem Fenster und η > 100 % sind unsinnig.',
      },
    ] as const
    const s = pick(rng, [...sets])
    return multiSelectTask({
      question: s.q,
      choices: [...s.choices],
      correct: [...s.correct],
      solution: s.solution,
      explanation: s.explanation,
      instruction: 'Tippe alle sinnvollen Maßnahmen:',
    })
  },
  (rng) => {
    // Einfacher Vergleich: gleiche Nutzenergie, unterschiedlicher Wirkungsgrad → Zufuhr
    const en = pick(rng, [20, 40, 50])
    const eta = pick(rng, [20, 25, 40, 50]) // %
    const ez = Math.round((en * 100) / eta)
    return valueTask({
      question: `Gewünschte Nutzenergie ${en} J, Wirkungsgrad ${eta} %. Wie groß ist die nötige Zufuhr E_zu (ganzzahlig)?`,
      answerKind: 'integer',
      unit: 'J',
      value: ez,
      solution: `${ez} J`,
      explanation: `E_zu = E_nutz / (η/100) = ${en} / ${eta / 100} = ${ez} J. Besserer η → kleinere Zufuhr.`,
    })
  },
  (rng) => {
    const pAlt = pick(rng, [40, 60, 100])
    const pLed = pick(rng, [5, 8, 10])
    const t = pick(rng, [2, 5, 10]) // Stunden → Energie in Wh: P*t
    const eAlt = pAlt * t
    const eLed = pLed * t
    const save = eAlt - eLed
    return valueTask({
      question: `Glühlampe ${pAlt} W vs. LED ${pLed} W, jeweils ${t} h. Wie viel Energie sparst du mit der LED (in Wh)?`,
      answerKind: 'integer',
      unit: 'Wh',
      value: save,
      solution: `${save} Wh`,
      explanation: `E = P·t → Glühlampe ${eAlt} Wh, LED ${eLed} Wh, Differenz ${save} Wh.`,
    })
  },
  (_rng) =>
    dragDropSlotsTask({
      question: 'Baue den Spar-Gedanken: gleicher Nutzen → … Einen Block brauchst du nicht.',
      items: [
        { label: 'weniger', value: 0 },
        { label: 'Zufuhr', value: 1 },
        { label: '/', value: 2 },
        { label: 'besserer η', value: 3 },
      ],
      correctSlots: [0, 1],
      solution: 'weniger Zufuhr',
      explanation: 'Sparen: Nutzen halten, Aufwand (Zufuhr) und Verluste senken — oft über besseren Wirkungsgrad.',
    }),
  (_rng) =>
    dragDropSlotsTask({
      question: 'Ordne: Reibung verringern → … Einen Block brauchst du nicht.',
      items: [
        { label: 'weniger', value: 0 },
        { label: 'Wärmeentwertung', value: 1 },
        { label: 'η > 100 %', value: 2 },
        { label: 'Ampere', value: 3 },
      ],
      correctSlots: [0, 1],
      solution: 'weniger Wärmeentwertung',
      explanation: 'Lehrplan: Energieaufwand durch weniger Reibung verringern.',
    }),
  (rng) => {
    const ranking = pick(rng, [
      {
        q: 'Was spart typischerweise am meisten elektrische Energie für Licht?',
        correct: 'LED statt alter Glühlampe',
        wrong: ['Glühlampe statt LED', 'mehr Standby-Geräte', 'Kühlschranktür offen lassen'],
      },
      {
        q: 'Welches Verhalten spart Heizenergie?',
        correct: 'Fenster schließen und sinnvoll heizen',
        wrong: ['Fenster dauerhaft kippen und heizen', 'Heizung aus und alle Fenster auf bei Frost ohne Plan', 'η über 100 % einstellen'],
      },
    ] as const)
    return choicePickTask({
      question: ranking.q,
      choices: shuffleChoices(rng, [ranking.correct, ...ranking.wrong], ranking.correct),
      correct: ranking.correct,
      solution: ranking.correct,
      explanation: 'Vergleiche Nutzen und Verluste — die Maßnahme mit weniger Entwertung/Zufuhr gewinnt.',
      instruction: 'Tippe die beste Sparmaßnahme:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Warum ist Energiesparen physikalisch sinnvoll? (mehrere möglich)',
      choices: [
        'Weniger zugeführte Energie bei gleichem Nutzen',
        'Weniger unerwünschte Wärme / Reibungsverluste',
        'Ressourcen und Umwelt entlasten',
        'Weil Wirkungsgrad über 100 % möglich wird',
        'Weil Energie und Leistung dieselbe Einheit haben',
      ],
      correct: [
        'Weniger zugeführte Energie bei gleichem Nutzen',
        'Weniger unerwünschte Wärme / Reibungsverluste',
        'Ressourcen und Umwelt entlasten',
      ],
      solution: 'weniger Zufuhr, weniger Verluste, Umwelt.',
      explanation: 'η bleibt unter 100 % — Sparen heißt effizienter nutzen, nicht Physik aushebeln.',
      instruction: 'Tippe alle zutreffenden Gründe:',
    }),
)

/** Wahlbereich — Kraftwandler früher und heute (Goldene Regel, schiefe Ebene) */
const kraftwandler: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Ein Arbeiter zieht einen schweren Stein über eine Rampe nach oben. Welches Prinzip nutzt er?',
        correct: 'Die Rampe verringert die nötige Zugkraft, verlängert aber den Weg.',
        wrong: [
          'Die Rampe verringert den zurückzulegenden Weg nach oben.',
          'Die Rampe vernichtet einen Teil der Gewichtskraft.',
          'Die Rampe spart sowohl Kraft als auch Weg.',
        ],
      },
      {
        q: 'Goldene Regel der Mechanik: Was gilt für Kraftwandler?',
        correct: 'Was man an Kraft spart, muss man an Weg (oder Zeit) zusetzen.',
        wrong: [
          'Man spart immer Kraft und Weg gleichzeitig.',
          'Kräfte werden vernichtet.',
          'Hebelarme spielen keine Rolle.',
        ],
      },
      {
        q: 'Welche Geräte sind typische Kraftwandler?',
        correct: 'Hebel, Flaschenzug, schiefe Ebene / Rampe',
        wrong: ['nur Thermometer', 'nur Amperemeter', 'nur Lineal ohne Hebelwirkung'],
      },
      {
        q: 'Warum baut man Pyramidenrampen / schiefe Ebenen?',
        correct: 'kleinere Kraft auf längerem Weg statt steil hochheben',
        wrong: [
          'weil der Weg kürzer wird',
          'weil die Masse des Steins abnimmt',
          'weil g sich ändert',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    const withRamp = /Rampe|schiefe|Pyramide/i.test(c.q)
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Kraftwandler: kleinere Kraft ↔ längerer Weg. Kräfte werden nicht vernichtet.',
      instruction: 'Tippe die passende Aussage:',
      ...(withRamp ? { visualContent: inclinedPlaneSvg() } : {}),
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Was gehört zur Goldenen Regel / zu Kraftwandlern? (mehrere möglich)',
      choices: [
        'Kraft sparen ↔ Weg zusetzen',
        'Hebel, Flaschenzug, schiefe Ebene',
        'Kräfte können vernichtet werden',
        'Gleichzeitig Kraft und Weg sparen ist unmöglich',
        'Nur die Farbe des Geräts zählt',
      ],
      correct: [
        'Kraft sparen ↔ Weg zusetzen',
        'Hebel, Flaschenzug, schiefe Ebene',
        'Gleichzeitig Kraft und Weg sparen ist unmöglich',
      ],
      solution: 'Kraft gegen Weg tauschen; Beispiele Hebel/Flaschenzug/Rampe.',
      explanation: 'Kräfte vernichten oder beides sparen — falsch.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
  (_rng) =>
    dragDropSlotsTask({
      question: 'Baue die Goldene Regel (kurz). Einen Block brauchst du nicht.',
      items: [
        { label: 'Kraft sparen', value: 0 },
        { label: '→', value: 1 },
        { label: 'Weg zusetzen', value: 2 },
        { label: 'η > 100 %', value: 3 },
      ],
      correctSlots: [0, 1, 2],
      solution: 'Kraft sparen → Weg zusetzen',
      explanation: 'Klassische Formulierung der Goldenen Regel der Mechanik.',
    }),
)

/** Wahlbereich — Hebelgesetz */
const hebel: Topic['generate'] = mixedVariants(
  (rng) => {
    const pairs = [
      [400, 2, 4, 200],
      [300, 1, 3, 100],
      [200, 2, 4, 100],
      [500, 2, 5, 200],
    ] as const
    const [f1, l1, l2, f2] = pick(rng, [...pairs])
    return valueTask({
      question: `Wippe im Gleichgewicht: links F₁ = ${f1} N, l₁ = ${l1} m; rechts l₂ = ${l2} m. Wie groß ist F₂ (in N)?`,
      answerKind: 'integer',
      unit: 'N',
      value: f2,
      solution: `${f2} N`,
      explanation: `Hebelgesetz: F₁·l₁ = F₂·l₂ → F₂ = (${f1}·${l1})/${l2} = ${f2} N.`,
      visualContent: leverBalanceSvg({ f1, l1, f2Label: '?', l2 }),
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Hebelgesetz im Gleichgewicht?',
        correct: 'F₁ · l₁ = F₂ · l₂',
        wrong: ['F₁ = F₂ immer', 'l₁ = l₂ immer ohne Kräfte', 'F₁ + l₁ = F₂ + l₂'],
      },
      {
        q: 'Längerer Kraftarm bei gleicher Last bedeutet …',
        correct: 'kleinere nötige Kraft',
        wrong: ['größere nötige Kraft', 'keine Wirkung', 'Last wird leichter (Masse sinkt)'],
      },
      {
        q: 'Wo greift man an Schere/Zange, um Kraft zu sparen?',
        correct: 'weiter vom Drehpunkt (langer Hebelarm)',
        wrong: ['möglichst nah am Drehpunkt', 'nur an der Schneide', 'ohne Hebelarm'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Gleichgewicht: Drehmomente gleich — F·l links = F·l rechts.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (_rng) =>
    dragDropSlotsTask({
      question: 'Baue das Hebelgesetz. Einen Block brauchst du nicht.',
      items: [
        { label: 'F₁', value: 0 },
        { label: '· l₁', value: 1 },
        { label: '=', value: 2 },
        { label: 'F₂', value: 3 },
        { label: '· l₂', value: 4 },
        { label: '+ m', value: 5 },
      ],
      correctSlots: [0, 1, 2, 3, 4],
      solution: 'F₁ · l₁ = F₂ · l₂',
      explanation: 'Kraft mal Kraftarm = Last mal Lastarm.',
      checkMode: 'strict',
    }),
  (_rng) =>
    multiSelectTask({
      question: 'Was gilt am Hebel? (mehrere möglich)',
      choices: [
        'Drehpunkt / Drehachse',
        'Kraftarm und Lastarm',
        'Im Gleichgewicht: F₁·l₁ = F₂·l₂',
        'Kräfte werden vernichtet',
        'Nur die Farbe der Wippe zählt',
      ],
      correct: ['Drehpunkt / Drehachse', 'Kraftarm und Lastarm', 'Im Gleichgewicht: F₁·l₁ = F₂·l₂'],
      solution: 'Drehpunkt, Arme, F·l = F·l.',
      explanation: 'Kräfte vernichten oder Farbe — keine Physik.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
)

/** Wahlbereich — Flaschenzug */
const flasche: Topic['generate'] = mixedVariants(
  (rng) => {
    const strands = pick(rng, [2, 4, 3, 5])
    const fg = pick(rng, [200, 400, 600, 800])
    if (fg % strands !== 0) {
      const fg2 = 600
      const n = 4
      return valueTask({
        question: `Idealer Flaschenzug: F_G = ${fg2} N, ${n} tragende Seilstücke. Wie groß ist die Zugkraft F?`,
        answerKind: 'integer',
        unit: 'N',
        value: fg2 / n,
        solution: `${fg2 / n} N`,
        explanation: `F = F_G / n = ${fg2}/${n} = ${fg2 / n} N (ohne Reibung).`,
        visualContent: pulleySvg(n),
      })
    }
    return valueTask({
      question: `Idealer Flaschenzug: F_G = ${fg} N, ${strands} tragende Seilstücke. Zugkraft F?`,
      answerKind: 'integer',
      unit: 'N',
      value: fg / strands,
      solution: `${fg / strands} N`,
      explanation: `F = F_G / n = ${fg}/${strands} = ${fg / strands} N.`,
      visualContent: pulleySvg(strands),
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Was leistet ein Flaschenzug (ideal, ohne Reibung)?',
        correct: 'verringert die nötige Zugkraft — dafür zieht man einen längeren Seilweg',
        wrong: [
          'löscht die Gewichtskraft aus',
          'spart Kraft und Weg gleichzeitig ohne Nachteil',
          'erhöht g',
        ],
      },
      {
        q: 'Mehr tragende Seilstücke bedeuten typischerweise …',
        correct: 'kleinere Zugkraft (Last verteilt sich)',
        wrong: ['größere Zugkraft', 'keine Wirkung', 'kürzeren Seilweg bei gleicher Kraft'],
      },
      {
        q: '600 N Last, 4 tragende Seile: ideale Zugkraft?',
        correct: '150 N',
        wrong: ['300 N', '600 N', '75 N'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'F ≈ F_G / n; Goldene Regel: Kraft↓ → Weg↑.',
      instruction: 'Tippe die passende Aussage:',
      visualContent: pulleySvg(4),
    })
  },
  (_rng) =>
    dragDropSlotsTask({
      question: 'Baue: ideale Zugkraft am Flaschenzug. Einen Block brauchst du nicht.',
      items: [
        { label: 'F', value: 0 },
        { label: '=', value: 1 },
        { label: 'F_G', value: 2 },
        { label: '/', value: 3 },
        { label: 'n', value: 4 },
        { label: '· g', value: 5 },
      ],
      correctSlots: [0, 1, 2, 3, 4],
      solution: 'F = F_G / n',
      explanation: 'n = Anzahl der tragenden Seilstücke.',
    }),
)

/** Wahlbereich — elektrische Schaltungen */
const schaltungen: Topic['generate'] = mixedVariants(
  (rng) => {
    const series = pick(rng, [true, false])
    if (series) {
      return choicePickTask({
        question:
          'Zwei Glühlampen in Reihe an einer Batterie. Du drehst eine Lampe heraus (Unterbrechung). Was passiert?',
        choices: shuffleChoices(
          rng,
          [
            'Die andere Lampe geht ebenfalls aus.',
            'Die andere Lampe leuchtet unverändert weiter.',
            'Die andere Lampe leuchtet plötzlich doppelt so hell.',
            'Die Batterie erleidet sofort einen Kurzschluss.',
          ],
          'Die andere Lampe geht ebenfalls aus.',
        ),
        correct: 'Die andere Lampe geht ebenfalls aus.',
        solution: 'Die andere Lampe geht ebenfalls aus.',
        explanation:
          'Reihe: ein Strompfad — Unterbrechung → kein Strom mehr im ganzen Kreis.',
        instruction: 'Tippe die passende Aussage:',
        visualContent: seriesParallelSvg('series', { load: 'lamp', switchClosed: false }),
      })
    }
    return choicePickTask({
      question: 'Zwei gleiche Lampen parallel. Eine fällt aus. Was passiert typischerweise?',
      choices: shuffleChoices(
        rng,
        [
          'Die andere Lampe kann weiter leuchten.',
          'Beide müssen ausgehen.',
          'Die Spannung wird immer null.',
          'Es gibt keinen Strom mehr im ganzen Haus.',
        ],
        'Die andere Lampe kann weiter leuchten.',
      ),
      correct: 'Die andere Lampe kann weiter leuchten.',
      solution: 'Die andere Lampe kann weiter leuchten.',
      explanation: 'Parallel: eigene Zweige — ein Zweig kann weiter Strom führen.',
      instruction: 'Tippe die passende Aussage:',
      visualContent: seriesParallelSvg('parallel', { load: 'lamp' }),
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Woran erkennst du eine Reihenschaltung zweier Lampen?',
        correct: 'Der Strom muss nacheinander durch beide',
        wrong: ['Jede Lampe hat einen eigenen Zweig', 'Es gibt keinen gemeinsamen Weg', 'Lampen brauchen keine Drähte'],
      },
      {
        q: 'Woran erkennst du eine Parallelschaltung?',
        correct: 'Jede Lampe hat einen eigenen Zweig',
        wrong: [
          'Der Strom muss nacheinander durch beide',
          'Es gibt nur einen Weg ohne Verzweigung',
          'Unterbrechung löscht immer beide',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Reihe = hintereinander; Parallel = eigene Zweige.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Aussagen zur Reihenschaltung stimmen? (mehrere möglich)',
      choices: [
        'Der Strom fließt nacheinander durch die Bauteile',
        'Fällt ein Bauteil aus, ist der Kreis oft unterbrochen',
        'Jedes Bauteil hat immer einen eigenen Zweig',
        'Die Spannungen teilen sich oft auf die Bauteile auf',
      ],
      correct: [
        'Der Strom fließt nacheinander durch die Bauteile',
        'Fällt ein Bauteil aus, ist der Kreis oft unterbrochen',
        'Die Spannungen teilen sich oft auf die Bauteile auf',
      ],
      solution: 'ein Stromweg, Unterbrechung löscht oft alles, Spannung teilt sich.',
      explanation: 'Eigene Zweige = Parallel.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
  (rng) =>
    dragDropSortTask({
      question: 'Ordne: zuerst typisch für Reihenschaltung, dann für Parallelschaltung.',
      items: [
        { label: 'ein gemeinsamer Stromweg durch beide Lampen', value: 0 },
        { label: 'zwei Zweige — jede Lampe für sich', value: 1 },
      ],
      correctOrder: [0, 1],
      solution: 'Reihe → Parallel',
      explanation: 'Reihe = hintereinander; Parallel = nebeneinander.',
      rng,
    }),
)

/** Wahlbereich — Klingel und Wechselschaltung */
const klingel: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Welche Funktion hat die gezeigte Schaltung im Alltag?',
        correct:
          'Wechselschaltung: eine Lampe von zwei Schaltern (z. B. Flur) ein-/ausschalten',
        wrong: [
          'elektrische Klingel (Wagnerscher Hammer) mit Selbstunterbrechung',
          'reine Parallelschaltung von zwei Lampen',
          'Schutzschaltung gegen Kurzschlüsse',
        ],
        visual: true as const,
      },
      {
        q: 'Wozu dient eine Wechselschaltung?',
        correct: 'Verbraucher von zwei Orten aus schalten',
        wrong: [
          'nur Kurzschluss erzeugen',
          'Stromstärke in Ampere verdoppeln ohne Gerät',
          'Masse der Lampe ändern',
        ],
      },
      {
        q: 'Woran erkennst du eher eine Klingel (Wagnerscher Hammer) als eine Wechselschaltung?',
        correct: 'Elektromagnet + federnder Unterbrecherkontakt (Selbstunterbrechung)',
        wrong: [
          'zwei Umschalter und eine Lampe im Flur',
          'nur eine Batterie ohne Schalter',
          'Parallelschaltung zweier Glühlampen',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Wechselschaltung: zwei Umschalter steuern eine Lampe. Klingel: Elektromagnet mit Selbstunterbrechung.',
      instruction: 'Tippe die passende Aussage:',
      ...('visual' in c && c.visual ? { visualContent: wechselCircuitSvg() } : {}),
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Was gehört zur Wechselschaltung? (mehrere möglich)',
      choices: [
        'zwei Umschalter (Wechselschalter)',
        'oft eine Lampe / ein Verbraucher',
        'Schalten von zwei Orten aus',
        'immer genau zwei Lampen parallel',
        'Wirkungsgrad über 100 %',
      ],
      correct: [
        'zwei Umschalter (Wechselschalter)',
        'oft eine Lampe / ein Verbraucher',
        'Schalten von zwei Orten aus',
      ],
      solution: 'zwei Umschalter, ein Verbraucher, zwei Orte.',
      explanation: 'Nicht zwingend zwei Lampen; η > 100 % falsch.',
      instruction: 'Tippe alle zutreffenden Aussagen:',
    }),
  (_rng) =>
    dragDropSlotsTask({
      question: 'Ordne: Wechselschaltung → … Einen Block brauchst du nicht.',
      items: [
        { label: 'Lampe', value: 0 },
        { label: 'von 2 Orten', value: 1 },
        { label: 'schalten', value: 2 },
        { label: 'Kurzschluss', value: 3 },
      ],
      correctSlots: [0, 1, 2],
      solution: 'Lampe von 2 Orten schalten',
      explanation: 'Alltagsnutzen der Wechselschaltung (z. B. Treppenhaus).',
    }),
)

/** Wahlbereich — Vom Fliegen (vier Kräfte) */
const fliegen: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Welcher Pfeil im Bild ist der Auftrieb?',
        correct: 'Pfeil A (nach oben)',
        wrong: ['Pfeil B (nach unten)', 'Pfeil C (nach vorne)', 'Pfeil D (nach hinten)'],
      },
      {
        q: 'Welcher Pfeil ist die Gewichtskraft?',
        correct: 'Pfeil B (nach unten)',
        wrong: ['Pfeil A (nach oben)', 'Pfeil C (nach vorne)', 'Pfeil D (nach hinten)'],
      },
      {
        q: 'Welcher Pfeil ist die Schubkraft (Vortrieb)?',
        correct: 'Pfeil C (nach vorne)',
        wrong: ['Pfeil A (nach oben)', 'Pfeil B (nach unten)', 'Pfeil D (nach hinten)'],
      },
      {
        q: 'Welcher Pfeil ist der Luftwiderstand?',
        correct: 'Pfeil D (nach hinten)',
        wrong: ['Pfeil A (nach oben)', 'Pfeil B (nach unten)', 'Pfeil C (nach vorne)'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'A Auftrieb ↑, B Gewicht ↓, C Schub →, D Widerstand ←.',
      instruction: 'Tippe den passenden Pfeil:',
      visualContent: flightForcesSvg(),
    })
  },
  (rng) =>
    dragDropSortTask({
      question: 'Ordne die Kräfte zu den Pfeilen: A (↑), B (↓), C (→), D (←).',
      items: [
        { label: 'Auftrieb', value: 0 },
        { label: 'Gewichtskraft', value: 1 },
        { label: 'Schubkraft', value: 2 },
        { label: 'Luftwiderstand', value: 3 },
      ],
      correctOrder: [0, 1, 2, 3],
      solution: 'A Auftrieb, B Gewicht, C Schub, D Widerstand',
      explanation: 'Stabiler Vorwärtsflug: vier Kräfte im Gleichgewicht der Paare.',
      visualContent: flightForcesSvg(),
      rng,
    }),
  (_rng) =>
    multiSelectTask({
      question: 'Welche Kräfte spielen beim Fliegen eine wichtige Rolle? (mehrere möglich)',
      choices: [
        'Gewichtskraft',
        'Auftrieb',
        'Luftwiderstand',
        'Vortrieb (Schub)',
        'chemische Farbe der Tragfläche als Kraft',
      ],
      correct: ['Gewichtskraft', 'Auftrieb', 'Luftwiderstand', 'Vortrieb (Schub)'],
      solution: 'Gewicht, Auftrieb, Widerstand, Vortrieb.',
      explanation: 'Farbe ist keine Kraft.',
      instruction: 'Tippe alle relevanten Kräfte:',
    }),
  (rng) => {
    const cases = [
      {
        q: 'Was braucht ein Flugzeug zum Fliegen neben Vortrieb typischerweise?',
        correct: 'Auftrieb an den Tragflächen',
        wrong: ['nur Gewichtskraft nach oben', 'keinen Luftwiderstand je', 'nur Magnetkraft'],
      },
      {
        q: 'Was wirkt dem Vorwärtsfliegen entgegen?',
        correct: 'Luftwiderstand',
        wrong: ['Auftrieb allein', 'nur die Masse in kg', 'Lichtgeschwindigkeit'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Auftrieb gegen Gewicht; Schub gegen Widerstand.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** Wahlbereich — Dynamischer Auftrieb */
const auftriebDyn: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Warum entsteht an einer gewölbten Tragfläche dynamischer Auftrieb?',
        correct:
          'Oben strömt die Luft schneller → Unterdruck (Sog); unten höherer Druck → Kraft nach oben.',
        wrong: [
          'Die Tragfläche saugt Luft und stößt sie wie eine Rakete aus.',
          'Durch die Wölbung wird die Tragfläche leichter als Luft.',
          'Nur warme Triebwerksluft unter den Flügeln erzeugt den Auftrieb.',
        ],
      },
      {
        q: 'Dynamischer Auftrieb an einer Tragfläche entsteht vor allem durch …',
        correct: 'Luftströmung und Form (Druckunterschied)',
        wrong: ['nur die Farbe der Tragfläche', 'nur F_G = m·g ohne Strömung', 'Kurzschluss im Cockpit'],
      },
      {
        q: 'Ohne ausreichende Anströmung …',
        correct: 'fehlt typischerweise der dynamische Auftrieb',
        wrong: ['ist der Auftrieb am größten', 'verschwindet die Gewichtskraft', 'entsteht nur Magnetkraft'],
      },
      {
        q: 'Mehr Geschwindigkeit / bessere Anströmung bedeutet oft …',
        correct: 'größeren dynamischen Auftrieb',
        wrong: ['keinen Einfluss', 'Auftrieb immer nach unten', 'kleinere Strömungsgeschwindigkeit oben'],
      },
    ] as const
    const c = pick(rng, [...cases])
    const withFoil = /Tragfläche|gewölbt|Anströmung|Geschwindigkeit/i.test(c.q)
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Schnellere Strömung oben → geringerer Druck; Druckdifferenz → Auftrieb (Bernoulli/Impuls, Schulniveau).',
      instruction: 'Tippe die passende Aussage:',
      ...(withFoil ? { visualContent: airfoilSvg() } : {}),
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Was gehört zum dynamischen Auftrieb? (mehrere möglich)',
      choices: [
        'Anströmung der Tragfläche',
        'Form / Wölbung des Profils',
        'Druckunterschied oben/unten',
        'Farbe der Tragfläche als Kraft',
        'F_G = m·g allein ohne Luft',
      ],
      correct: ['Anströmung der Tragfläche', 'Form / Wölbung des Profils', 'Druckunterschied oben/unten'],
      solution: 'Anströmung, Profil, Druckdifferenz.',
      explanation: 'Ohne Strömung kein dynamischer Auftrieb — Gewichtskraft allein reicht nicht.',
      instruction: 'Tippe alle zutreffenden Aussagen:',
    }),
  (_rng) =>
    dragDropSlotsTask({
      question: 'Baue den Merksatz. Einen Block brauchst du nicht.',
      items: [
        { label: 'Anströmung', value: 0 },
        { label: '→', value: 1 },
        { label: 'Auftrieb', value: 2 },
        { label: 'F_G = m·g allein', value: 3 },
      ],
      correctSlots: [0, 1, 2],
      solution: 'Anströmung → Auftrieb',
      explanation: 'Ohne Anströmung fehlt typischerweise der dynamische Auftrieb.',
    }),
)

/** LB1 — Reibung */
const reibung: Topic['generate'] = mixedVariants(
  (rng) => {
    const moveRight = pick(rng, [true, false])
    const dir = moveRight ? 'nach rechts' : 'nach links'
    const correct = moveRight ? 'nach links' : 'nach rechts'
    return choicePickTask({
      question: `Der Klotz bewegt sich ${dir}. In welche Richtung wirkt die Reibungskraft?`,
      choices: shuffleChoices(
        rng,
        [correct, moveRight ? 'nach rechts' : 'nach links', 'immer nach oben', 'immer nach unten'],
        correct,
      ),
      correct,
      solution: correct,
      explanation: `Bewegung ${dir} → Reibungskraft ${correct} (entgegen der Bewegung).`,
      instruction: 'Tippe die Richtung der Reibungskraft:',
      visualContent: frictionForceSvg({ moveRight }),
    })
  },
  (rng) => {
    const moveRight = pick(rng, [true, false])
    const correct = 'entgegen der Bewegungsrichtung'
    return choicePickTask({
      question: 'In welche Richtung wirkt die Reibungskraft am gleitenden Klotz?',
      choices: shuffleChoices(
        rng,
        [correct, 'in Bewegungsrichtung', 'immer senkrecht nach oben', 'ohne Richtung'],
        correct,
      ),
      correct,
      solution: correct,
      explanation: 'Gleitreibung wirkt der Relativbewegung an der Kontaktfläche entgegen.',
      instruction: 'Tippe die passende Richtung:',
      visualContent: frictionForceSvg({ moveRight }),
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Haftreibung greift …',
        correct: 'bevor der Körper gleitet (hält in Ruhe)',
        wrong: ['nur im Vakuum', 'nur bei Licht', 'nur ohne Kontakt'],
      },
      {
        q: 'Gleitreibung wirkt …',
        correct: 'beim Gleiten entlang der Kontaktfläche',
        wrong: ['nur ohne Kontakt', 'nur ohne Kraft', 'nur magnetisch'],
      },
      {
        q: 'Reibung …',
        correct: 'wirkt der Relativbewegung entgegen (oder verhindert Losbrechen)',
        wrong: ['zieht immer nach oben wie Auftrieb', 'löscht Masse aus', 'ist nur eine Einheit'],
      },
      {
        q: 'Auf glatterem Untergrund ist die Reibung typischerweise …',
        correct: 'kleiner (leichter gleiten)',
        wrong: ['immer größer', 'unabhängig von der Oberfläche', 'nur Temperatur'],
      },
      {
        q: 'Welche Kraft bremst einen Rutschwagen auf dem Boden?',
        correct: 'Reibungskraft',
        wrong: ['Gewichtskraft allein ohne Reibung', 'Magnetkraft der Sonne', 'Spannkraft ohne Seil'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Haftreibung hält; Gleitreibung bremst beim Rutschen — immer entgegen der Bewegung.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Was gilt zur Reibung? (mehrere möglich)',
      choices: [
        'wirkt der Bewegung entgegen',
        'Haftreibung hält in Ruhe',
        'Gleitreibung wirkt beim Rutschen',
        'ist dasselbe wie Gewichtskraft',
        'Brauch keine Kontaktfläche',
      ],
      correct: [
        'wirkt der Bewegung entgegen',
        'Haftreibung hält in Ruhe',
        'Gleitreibung wirkt beim Rutschen',
      ],
      solution: 'Richtung entgegen Bewegung; Haft- vs. Gleitreibung.',
      explanation: 'Reibung ≠ Gewichtskraft; braucht Kontakt.',
      instruction: 'Tippe alle zutreffenden Aussagen:',
    }),
)

const ATTRACT_ARROW = '→ ←'
const REPEL_ARROW = '← →'

/** LB1 — Magnetische Kräfte */
const magnet: Topic['generate'] = mixedVariants(
  (rng) => {
    const left = pick(rng, ['N', 'S'] as const)
    const same = pick(rng, [true, false])
    const right = same ? left : left === 'N' ? 'S' : 'N'
    const attract = !same
    const correct = attract ? ATTRACT_ARROW : REPEL_ARROW
    return choicePickTask({
      question: `Was passiert zwischen den gezeigten Magnetpolen (${left} und ${right})?`,
      choices: shuffleChoices(rng, [ATTRACT_ARROW, REPEL_ARROW], correct),
      correct,
      solution: attract ? 'Anziehen (→ ←)' : 'Abstoßen (← →)',
      explanation: attract
        ? 'Ungleichnamige Pole ziehen sich an — Pfeile aufeinander zu.'
        : 'Gleichnamige Pole stoßen sich ab — Pfeile voneinander weg.',
      instruction: 'Tippe die Wirkung (Pfeile):',
      visualContent: magnetPolesSvg({ left, right }),
      largeSymbols: true,
    })
  },
  (rng) => {
    const cases = [
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
      {
        q: 'Ein Magnet hat typischerweise …',
        correct: 'einen Nord- und einen Südpol',
        wrong: ['nur einen Pol', 'keine Pole', 'nur elektrische Ladung'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'N und S: ungleichnamig anziehen, gleichnamig abstoßen.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Was gilt für Magnete? (mehrere möglich)',
      choices: [
        'N und S ziehen sich an',
        'N und N stoßen sich ab',
        'S und S stoßen sich ab',
        'N und S stoßen sich immer ab',
        'Magnete haben keine Pole',
      ],
      correct: ['N und S ziehen sich an', 'N und N stoßen sich ab', 'S und S stoßen sich ab'],
      solution: 'Ungleichnamig anziehen, gleichnamig abstoßen.',
      explanation: 'N–S anziehen; N–N und S–S abstoßen.',
      instruction: 'Tippe alle zutreffenden Aussagen:',
    }),
  (_rng) =>
    dragDropSlotsTask({
      question:
        'Baue die Zuordnung für die Anziehung ungleichnamiger Pole. Einen Block brauchst du nicht.',
      items: [
        { label: 'N', value: 0 },
        { label: '→ ←', value: 1 },
        { label: 'S', value: 2 },
        { label: '← →', value: 3 },
      ],
      correctSlots: [0, 1, 2],
      solution: 'N → ← S (anziehen)',
      explanation:
        'Anziehung: Pfeile aufeinander zu (→ ←). N und S dürfen vertauscht sein (S → ← N).',
      checkMode: 'endsSwap',
    }),
  (rng) => {
    const left = pick(rng, ['N', 'S'] as const)
    const right = left
    return choicePickTask({
      question: `Gleichnamige Pole (${left} und ${right}): Welche Wirkung?`,
      choices: shuffleChoices(rng, [ATTRACT_ARROW, REPEL_ARROW], REPEL_ARROW),
      correct: REPEL_ARROW,
      solution: 'Abstoßen (← →)',
      explanation: 'Gleichnamige Pole stoßen sich ab — Pfeile voneinander weg.',
      instruction: 'Tippe die Wirkung (Pfeile):',
      visualContent: magnetPolesSvg({ left, right }),
      largeSymbols: true,
    })
  },
)

/** LB1 — Elektrostatische Kräfte */
const elektrostatik: Topic['generate'] = mixedVariants(
  (rng) => {
    const left = pick(rng, ['+', '−'] as const)
    const same = pick(rng, [true, false])
    const right = same ? left : left === '+' ? '−' : '+'
    const attract = !same
    const correct = attract ? ATTRACT_ARROW : REPEL_ARROW
    return choicePickTask({
      question: `Was passiert zwischen den gezeigten Ladungen (${left} und ${right})?`,
      choices: shuffleChoices(rng, [ATTRACT_ARROW, REPEL_ARROW], correct),
      correct,
      solution: attract ? 'Anziehen (→ ←)' : 'Abstoßen (← →)',
      explanation: attract
        ? 'Ungleichnamige Ladungen ziehen sich an — Pfeile aufeinander zu.'
        : 'Gleichnamige Ladungen stoßen sich ab — Pfeile voneinander weg.',
      instruction: 'Tippe die Wirkung (Pfeile):',
      visualContent: chargeForceSvg({ left, right }),
      largeSymbols: true,
    })
  },
  (rng) => {
    const cases = [
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
      {
        q: 'Welche Aussage zur Elektrostatik stimmt?',
        correct: 'Ladungen üben Kräfte aufeinander aus (anziehen/abstoßen)',
        wrong: ['Ladungen haben keine Wirkung', 'nur Gewichtskraft zählt', 'nur Ohm ohne Ladung'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Gleichnamig abstoßen, ungleichnamig anziehen — analog zu Magnetpolen.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Was gilt für elektrische Ladungen? (mehrere möglich)',
      choices: [
        '+ und − ziehen sich an',
        '+ und + stoßen sich ab',
        '− und − stoßen sich ab',
        '+ und − stoßen sich immer ab',
        'Ladungen wirken nur bei Magneten',
      ],
      correct: ['+ und − ziehen sich an', '+ und + stoßen sich ab', '− und − stoßen sich ab'],
      solution: 'Ungleichnamig anziehen, gleichnamig abstoßen.',
      explanation: 'Wie bei Magnetpolen: gleich abstoßen, ungleich anziehen.',
      instruction: 'Tippe alle zutreffenden Aussagen:',
    }),
  (_rng) =>
    dragDropSlotsTask({
      question:
        'Baue die Zuordnung für die Anziehung ungleichnamiger Ladungen. Einen Block brauchst du nicht.',
      items: [
        { label: '+', value: 0 },
        { label: '→ ←', value: 1 },
        { label: '−', value: 2 },
        { label: '← →', value: 3 },
      ],
      correctSlots: [0, 1, 2],
      solution: '+ → ← − (anziehen)',
      explanation:
        'Anziehung: Pfeile aufeinander zu (→ ←). + und − dürfen vertauscht sein (− → ← +).',
      checkMode: 'endsSwap',
    }),
  (rng) => {
    const left = pick(rng, ['+', '−'] as const)
    const right = left
    return choicePickTask({
      question: `Gleichnamige Ladungen (${left} und ${right}): Welche Wirkung?`,
      choices: shuffleChoices(rng, [ATTRACT_ARROW, REPEL_ARROW], REPEL_ARROW),
      correct: REPEL_ARROW,
      solution: 'Abstoßen (← →)',
      explanation: 'Gleichnamige Ladungen stoßen sich ab — Pfeile voneinander weg.',
      instruction: 'Tippe die Wirkung (Pfeile):',
      visualContent: chargeForceSvg({ left, right }),
      largeSymbols: true,
    })
  },
)

export const PHYSIK_K7_GENERATORS: Record<string, Topic['generate']> = {
  'ph-k7-lb1-kraftbegriff': kraftbegriff,
  'ph-k7-lb1-gewichtskraft': gewichtskraft,
  'ph-k7-lb1-kraefte': kraefte,
  'ph-k7-lb1-reibung': reibung,
  'ph-k7-lb1-magnet': magnet,
  'ph-k7-lb1-elektrostatik': elektrostatik,
  'ph-k7-lb2-stromstaerke': stromstaerke,
  'ph-k7-lb2-spannung': spannung,
  'ph-k7-lb2-strom': strom,
  'ph-k7-lb2-ohm': ohm,
  'ph-k7-lb2-reihe': reihe,
  'ph-k7-lb2-parallel': parallel,
  'ph-k7-lb2-messen': messen,
  'ph-k7-lb3-energieformen': energieformen,
  'ph-k7-lb3-energie': energie,
  'ph-k7-lb3-umwandlung': umwandlung,
  'ph-k7-lb3-wirkungsgrad': wirkungsgrad,
  'ph-k7-lb3-leistung': leistung,
  'ph-k7-lb3-sparen': energiesparen,
  'ph-k7-lbw-kraftwandler': kraftwandler,
  'ph-k7-lbw-hebel': hebel,
  'ph-k7-lbw-flasche': flasche,
  'ph-k7-lbw-schaltungen': schaltungen,
  'ph-k7-lbw-klingel': klingel,
  'ph-k7-lbw-fliegen': fliegen,
  'ph-k7-lbw-auftrieb-dyn': auftriebDyn,
}
