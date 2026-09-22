import { pick, randInt, type Rng } from '../lib/rng'
import {
  chargeForceSvg,
  circuitSvg,
  frictionForceSvg,
  magnetPolesSvg,
  meterGapCircuitSvg,
  meterWiredCircuitSvg,
  seriesParallelSvg,
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

/** LB3 — Energiewandler und Energieformen */
const energie: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Welche Wandlung beschreibt ein Generator in einem Wasserkraftwerk ungefähr?',
        correct: 'Bewegungsenergie → elektrische Energie',
        wrong: [
          'chemische Energie → Wärmeenergie',
          'Lichtenergie → chemische Energie',
          'elektrische Energie → chemische Energie',
        ],
      },
      {
        q: 'Welche Wandlung beschreibt eine Taschenlampenbatterie beim Entladen ungefähr?',
        correct: 'chemische Energie → elektrische Energie',
        wrong: [
          'elektrische Energie → chemische Energie',
          'Wärmeenergie → Bewegungsenergie',
          'Lichtenergie → Lageenergie',
        ],
      },
      {
        q: 'Welche Wandlung beschreibt eine Glühlampe ungefähr?',
        correct: 'elektrische Energie → Licht- und Wärmeenergie',
        wrong: [
          'Lichtenergie → elektrische Energie',
          'chemische Energie → Lageenergie',
          'Bewegungsenergie → chemische Energie',
        ],
      },
      {
        q: 'Welche Wandlung beschreibt ein Solarmodul ungefähr?',
        correct: 'Lichtenergie → elektrische Energie',
        wrong: [
          'elektrische Energie → Lichtenergie',
          'chemische Energie → Bewegungsenergie',
          'Wärmeenergie → chemische Energie',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Energiewandler wandeln eine Energieform in eine andere um — die Gesamtenergie bleibt erhalten.',
      instruction: 'Tippe die passende Wandlung:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche der folgenden sind Energieformen? (mehrere möglich)',
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
      solution: 'Bewegungs-, Lage-, chemische und elektrische Energie sind Energieformen.',
      explanation:
        'Newton ist eine Krafteinheit, Ampere eine Stromstärke — beides keine Energieformen.',
      instruction: 'Tippe alle Energieformen:',
    }),
  () =>
    dragDropSortTask({
      question: 'Ordne die typische Energiekette einer Taschenlampe (Start → Ende).',
      items: [
        { label: 'chemische Energie in der Batterie', value: 0 },
        { label: 'elektrische Energie im Stromkreis', value: 1 },
        { label: 'Licht- und Wärmeenergie an der Lampe', value: 2 },
      ],
      correctOrder: [0, 1, 2],
      solution: 'chemisch → elektrisch → Licht/Wärme',
      explanation:
        'Die Batterie speichert chemische Energie; im Stromkreis fließt elektrische Energie; die Lampe gibt Licht und Wärme ab.',
    }),
)

/** Wahlbereich — Kraftwandler: Hebel, Flaschenzug */
const kraftwandler: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Wozu dient ein Hebel oft?',
        correct: 'kleine Kraft auf langem Arm → große Kraft auf kurzem Arm',
        wrong: [
          'Kraft und Weg bleiben immer gleich',
          'Masse des Körpers wird kleiner',
          'Gewichtskraft verschwindet',
        ],
      },
      {
        q: 'Was trifft auf einen Flaschenzug zu?',
        correct: 'Man zieht mit kleinerer Kraft, aber über einen längeren Weg',
        wrong: [
          'Man spart Kraft und Weg gleichzeitig ohne Nachteil',
          'Die Last wird leichter (Masse nimmt ab)',
          'Es wirkt keine Gewichtskraft mehr',
        ],
      },
      {
        q: 'Wo greift man bei einer Schere oder Zange oft an, um Kraft zu sparen?',
        correct: 'weiter vom Drehpunkt entfernt (langer Hebelarm)',
        wrong: [
          'möglichst nah am Drehpunkt',
          'nur an der Schneide',
          'ohne Hebelarm',
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
        'Kraftwandler tauschen Kraft gegen Weg: kleinere Kraft bedeutet meist längeren Weg.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Geräte nutzen typischerweise Hebel oder Flaschenzug? (mehrere möglich)',
      choices: [
        'Schubkarre',
        'Flaschenzug am Baukran',
        'Nussknacker',
        'einfache Glühlampe ohne Hebel',
        'Batterie allein',
      ],
      correct: ['Schubkarre', 'Flaschenzug am Baukran', 'Nussknacker'],
      solution: 'Schubkarre, Flaschenzug und Nussknacker sind Kraftwandler.',
      explanation: 'Lampe und Batterie wandeln Energie, sind aber keine Hebel/Flaschenzüge.',
      instruction: 'Tippe alle passenden Geräte:',
    }),
  (rng) => {
    const correct = 'längerer Kraftarm → kleinere nötige Kraft'
    return choicePickTask({
      question: `Ein Kind hebt mit einem Hebel eine Last. Was hilft, die nötige Kraft zu verringern?`,
      choices: shuffleChoices(
        rng,
        [
          correct,
          'kürzerer Kraftarm → kleinere nötige Kraft',
          'Hebelarm spielt keine Rolle',
          'nur die Farbe des Hebels zählt',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation: 'Je länger der Kraftarm (bei gleicher Last und gleichem Lastarm), desto kleiner die nötige Kraft.',
      instruction: 'Tippe die richtige Aussage:',
    })
  },
)

/** Wahlbereich — elektrische Schaltungen: Reihe vs Parallel */
const schaltungen: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Zwei gleiche Lampen sind in Reihe geschaltet. Eine Lampe fällt aus (Unterbrechung). Was passiert?',
        correct: 'Beide Lampen erlöschen',
        wrong: [
          'Nur die kaputte bleibt aus, die andere leuchtet weiter',
          'Beide werden heller',
          'Die Spannung verdoppelt sich',
        ],
      },
      {
        q: 'Zwei gleiche Lampen sind parallel geschaltet. Eine Lampe fällt aus. Was passiert typischerweise?',
        correct: 'Die andere Lampe leuchtet weiter',
        wrong: [
          'Beide erlöschen immer',
          'Die andere wird automatisch doppelt so hell',
          'Strom kann nie fließen',
        ],
      },
      {
        q: 'Woran erkennst du eine Parallelschaltung zweier Lampen?',
        correct: 'Jede Lampe hat einen eigenen Zweig',
        wrong: [
          'Der Strom muss nacheinander durch beide Lampen',
          'Es gibt nur einen einzigen Weg ohne Verzweigung',
          'Lampen dürfen keine Drähte haben',
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
        'Reihe: ein Weg — Unterbrechung löscht alles. Parallel: eigene Zweige — ein Zweig kann weiter leuchten.',
      instruction: 'Tippe die richtige Aussage:',
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
      solution: 'In Reihe: ein Stromweg, Aufteilung der Spannung, Ausfall unterbricht oft alles.',
      explanation: 'Eigene Zweige gehören zur Parallelschaltung, nicht zur Reihe.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
  () =>
    dragDropSortTask({
      question: 'Ordne: zuerst typisch für Reihenschaltung, dann für Parallelschaltung.',
      items: [
        { label: 'ein gemeinsamer Stromweg durch beide Lampen', value: 0 },
        { label: 'zwei Zweige — jede Lampe für sich', value: 1 },
      ],
      correctOrder: [0, 1],
      solution: 'Reihe (gemeinsamer Weg) → Parallel (eigene Zweige)',
      explanation: 'Reihe = hintereinander; Parallel = nebeneinander in Zweigen.',
    }),
)

/** Wahlbereich — Vom Fliegen: Auftrieb / Luftwiderstand */
const fliegen: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Was braucht ein Flugzeug zum Fliegen neben Vortrieb typischerweise?',
        correct: 'Auftrieb an den Tragflächen',
        wrong: ['nur Gewichtskraft nach oben', 'keinen Luftwiderstand je', 'nur Magnetkraft'],
      },
      {
        q: 'Was wirkt dem Vorwärtsfliegen entgegen und muss überwunden werden?',
        correct: 'Luftwiderstand',
        wrong: ['Auftrieb allein', 'nur die Masse in kg', 'Lichtgeschwindigkeit'],
      },
      {
        q: 'Was gilt qualitativ für den Auftrieb an einer Tragfläche?',
        correct: 'Luftströmung und Form erzeugen eine Kraft nach oben',
        wrong: [
          'Auftrieb entsteht nur im Vakuum',
          'Auftrieb ist immer gleich der Magnetkraft',
          'Ohne Luft gibt es mehr Auftrieb',
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
        'Fliegen: Auftrieb hält gegen die Gewichtskraft; Vortrieb muss den Luftwiderstand überwinden.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
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
      solution: 'Gewicht, Auftrieb, Widerstand und Vortrieb — die „vier Kräfte“ beim Fliegen.',
      explanation: 'Die Farbe der Tragfläche ist keine Kraft.',
      instruction: 'Tippe alle relevanten Kräfte:',
    }),
  (rng) => {
    const correct = 'mehr Geschwindigkeit / bessere Strömung → oft mehr Auftrieb'
    return choicePickTask({
      question: 'Was gilt qualitativ für den Auftrieb einer Tragfläche?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'Auftrieb hängt nie von der Geschwindigkeit ab',
          'Auftrieb wirkt immer nach unten',
          'Ohne Vorwärtsbewegung ist Auftrieb am größten',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Mit ausreichender Anströmung entsteht Auftrieb; ohne Vorwärtsbewegung fehlt typischerweise der Auftrieb.',
      instruction: 'Tippe die richtige Aussage:',
    })
  },
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
  'ph-k7-lb3-energie': energie,
  'ph-k7-lbw-kraftwandler': kraftwandler,
  'ph-k7-lbw-hebel': kraftwandler,
  'ph-k7-lbw-flasche': kraftwandler,
  'ph-k7-lbw-schaltungen': schaltungen,
  'ph-k7-lbw-fliegen': fliegen,
  'ph-k7-lbw-auftrieb-dyn': fliegen,
}
