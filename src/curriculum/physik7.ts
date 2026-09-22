import { pick, randInt, type Rng } from '../lib/rng'
import {
  choicePickTask,
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

/** LB2 — Stromstärke und Spannung: Ohm, Reihe/Parallel, Einheiten */
const strom: Topic['generate'] = mixedVariants(
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
      question: `An einem Widerstand liegen U = ${U} V und R = ${R} Ω. Berechne die Stromstärke.`,
      answerKind: 'integer',
      unit: 'A',
      value: I,
      solution: `${I} A`,
      explanation: `I = U / R = ${U} / ${R} = ${I} A.`,
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'In welcher Einheit wird die Stromstärke angegeben?',
        correct: 'Ampere (A)',
        wrong: ['Volt (V)', 'Ohm (Ω)', 'Watt (W)'],
      },
      {
        q: 'In welcher Einheit wird die elektrische Spannung angegeben?',
        correct: 'Volt (V)',
        wrong: ['Ampere (A)', 'Ohm (Ω)', 'Newton (N)'],
      },
      {
        q: 'Was gilt näherungsweise für zwei gleiche Lampen in Reihe (eine Spannungsquelle)?',
        correct: 'Beide Lampen leuchten schwächer als einzeln',
        wrong: [
          'Beide Lampen leuchten heller als einzeln',
          'Nur eine Lampe kann leuchten',
          'Die Spannung verdoppelt sich an jeder Lampe',
        ],
      },
      {
        q: 'Was gilt für zwei gleiche Lampen parallel (eine Spannungsquelle)?',
        correct: 'Beide Lampen leuchten etwa so hell wie eine allein',
        wrong: [
          'Beide Lampen bleiben immer dunkel',
          'Die Spannung an beiden ist null',
          'Strom fließt nur durch eine Lampe',
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
        'Stromstärke in Ampere, Spannung in Volt. In Reihe teilen sich die Lampen die Spannung; parallel liegen sie an (nahezu) gleicher Spannung.',
      instruction: 'Tippe die richtige Aussage:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Aussagen zu Stromkreisen stimmen? (mehrere möglich)',
      choices: [
        'I = U / R (Ohmsches Gesetz)',
        'Stromstärke wird in Ampere gemessen',
        'Spannung wird in Volt gemessen',
        'Widerstand wird in Ampere gemessen',
        'Ohne geschlossenen Stromkreis fließt kein Strom',
      ],
      correct: [
        'I = U / R (Ohmsches Gesetz)',
        'Stromstärke wird in Ampere gemessen',
        'Spannung wird in Volt gemessen',
        'Ohne geschlossenen Stromkreis fließt kein Strom',
      ],
      solution: 'Ohmsches Gesetz; A und V als Einheiten; geschlossener Stromkreis nötig.',
      explanation:
        'Falsch ist „Widerstand in Ampere“ — der Widerstand hat die Einheit Ohm (Ω).',
      instruction: 'Tippe alle richtigen Aussagen:',
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

export const PHYSIK_K7_GENERATORS: Record<string, Topic['generate']> = {
  'ph-k7-lb1-kraftbegriff': kraftbegriff,
  'ph-k7-lb1-gewichtskraft': gewichtskraft,
  'ph-k7-lb1-kraefte': kraefte,
  'ph-k7-lb2-strom': strom,
  'ph-k7-lb3-energie': energie,
  'ph-k7-lbw-kraftwandler': kraftwandler,
  'ph-k7-lbw-schaltungen': schaltungen,
  'ph-k7-lbw-fliegen': fliegen,
}
