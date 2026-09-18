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

/** LB1 — Fluide: p = F/A, hydrostatischer Druck, Auftrieb */
const fluide: Topic['generate'] = mixedVariants(
  (rng) => {
    const pairs = [
      { F: 100, A: 2 },
      { F: 200, A: 4 },
      { F: 50, A: 2 },
      { F: 120, A: 3 },
      { F: 80, A: 4 },
      { F: 150, A: 5 },
    ] as const
    const { F, A } = pick(rng, [...pairs])
    const p = F / A
    return valueTask({
      question: `Auf eine Fläche A = ${A} m² wirkt die Kraft F = ${F} N. Berechne den Druck.`,
      answerKind: 'integer',
      unit: 'Pa',
      value: p,
      solution: `${p} Pa`,
      explanation: `p = F / A = ${F} / ${A} = ${p} Pa.`,
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Was gilt für den hydrostatischen Druck in einer Flüssigkeit (gleiche Flüssigkeit)?',
        correct: 'Je tiefer, desto größer der Druck',
        wrong: [
          'Je tiefer, desto kleiner der Druck',
          'Der Druck hängt nur von der Farbe ab',
          'Druck gibt es nur an der Oberfläche',
        ],
      },
      {
        q: 'Wann erfährt ein Körper in Wasser Auftrieb?',
        correct: 'wenn er Flüssigkeit verdrängt',
        wrong: [
          'nur wenn er magnetisch ist',
          'nur im Vakuum',
          'nie, Auftrieb gibt es nur in Luft',
        ],
      },
      {
        q: 'Was passiert qualitativ, wenn die gleiche Kraft auf eine kleinere Fläche wirkt?',
        correct: 'Der Druck wird größer',
        wrong: [
          'Der Druck wird kleiner',
          'Der Druck bleibt immer gleich',
          'Druck und Kraft sind dasselbe',
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
        'p = F/A; hydrostatischer Druck wächst mit der Tiefe; Auftrieb entsteht durch verdrängte Flüssigkeit.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const F = pick(rng, [40, 60, 80, 100, 120])
    const A = pick(rng, [2, 4, 5])
    const p = F / A
    if (p % 1 !== 0) {
      const A2 = 2
      const p2 = F / A2
      return valueTask({
        question: `F = ${F} N wirkt auf A = ${A2} m². Berechne den Druck.`,
        answerKind: 'integer',
        unit: 'Pa',
        value: p2,
        solution: `${p2} Pa`,
        explanation: `p = ${F} / ${A2} = ${p2} Pa.`,
      })
    }
    return paramSliderTask({
      question: `Stelle Fläche und Kraft so ein, dass der Druck ${p} Pa beträgt.`,
      params: [
        { id: 'F', label: 'Kraft F (N)', min: 20, max: 160, step: 20, start: F === 80 ? 40 : 80 },
        { id: 'A', label: 'Fläche A (m²)', min: 1, max: 8, step: 1, start: A === 2 ? 4 : 2 },
      ],
      correct: { F, A },
      solution: `F = ${F} N, A = ${A} m² → p = ${p} Pa`,
      explanation: `p = F / A = ${F} / ${A} = ${p} Pa.`,
      instruction: 'Schieberegler auf die geforderten Werte:',
    })
  },
)

/** LB2 — Thermische Energie: Q = c·m·ΔT, Wärmeleitung vs Strahlung */
const thermisch: Topic['generate'] = mixedVariants(
  (rng) => {
    const triples = [
      { c: 2, m: 5, dT: 10 },
      { c: 4, m: 5, dT: 5 },
      { c: 1, m: 8, dT: 10 },
      { c: 2, m: 10, dT: 4 },
      { c: 5, m: 4, dT: 2 },
      { c: 3, m: 6, dT: 5 },
    ] as const
    const { c, m, dT } = pick(rng, [...triples])
    const Q = c * m * dT
    return valueTask({
      question: `Berechne die Wärmemenge mit c = ${c} J/(g·K), m = ${m} g und ΔT = ${dT} K.`,
      answerKind: 'integer',
      unit: 'J',
      value: Q,
      solution: `${Q} J`,
      explanation: `Q = c · m · ΔT = ${c} · ${m} · ${dT} = ${Q} J.`,
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Wie wird Wärme vor allem durch eine Metallstange von heiß nach kalt transportiert?',
        correct: 'Wärmeleitung',
        wrong: ['Wärmestrahlung nur im Vakuum', 'nur Konvektion in Festkörpern', 'elektrischer Strom'],
      },
      {
        q: 'Wie gelangt die Wärme der Sonne zur Erde (durch den Weltraum)?',
        correct: 'Wärmestrahlung',
        wrong: ['Wärmeleitung durch Luft im Vakuum', 'nur Konvektion im Vakuum', 'Reibung'],
      },
      {
        q: 'Was beschreibt ΔT in Q = c · m · ΔT?',
        correct: 'Temperaturänderung',
        wrong: ['nur die Masse', 'nur die Dichte', 'die Stromstärke'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Leitung: Stoff zu Stoff (z. B. Metall). Strahlung: auch durch Vakuum. ΔT ist die Temperaturdifferenz.',
      instruction: 'Tippe die passende Antwort:',
    })
  },
  (rng) => {
    const dT = pick(rng, [10, 20, 30, 40, 50])
    return numberLineTask({
      question: `Ein Körper erwärmt sich um ΔT = ${dT} K. Markiere ΔT auf dem Zahlenstrahl.`,
      min: 0,
      max: 60,
      step: 5,
      value: dT,
      solution: `${dT} K`,
      explanation: `Die Temperaturänderung beträgt ${dT} K.`,
    })
  },
)

/** LB3 — Elektrische Bauelemente: Ohm R = U/I, Kennlinie */
const bauelemente: Topic['generate'] = mixedVariants(
  (rng) => {
    const pairs = [
      { U: 12, I: 3 },
      { U: 6, I: 2 },
      { U: 10, I: 2 },
      { U: 9, I: 3 },
      { U: 8, I: 4 },
      { U: 15, I: 5 },
    ] as const
    const { U, I } = pick(rng, [...pairs])
    const R = U / I
    return valueTask({
      question: `An einem ohmschen Widerstand liegen U = ${U} V und I = ${I} A. Berechne den Widerstand.`,
      answerKind: 'integer',
      unit: 'Ω',
      value: R,
      solution: `${R} Ω`,
      explanation: `R = U / I = ${U} / ${I} = ${R} Ω.`,
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Wie sieht die U-I-Kennlinie eines ohmschen Widerstands (idealer Fall) aus?',
        correct: 'Gerade durch den Ursprung (U proportional zu I)',
        wrong: [
          'Kreis um den Ursprung',
          'nur eine waagerechte Linie bei U = 0',
          'zufällige Punkte ohne Zusammenhang',
        ],
      },
      {
        q: 'Was bedeutet ein größerer Widerstand R bei gleicher Spannung U?',
        correct: 'kleinere Stromstärke I',
        wrong: [
          'größere Stromstärke I',
          'Spannung wird negativ',
          'Widerstand hat keine Wirkung',
        ],
      },
      {
        q: 'Welche Einheit hat der elektrische Widerstand?',
        correct: 'Ohm (Ω)',
        wrong: ['Ampere (A)', 'Volt (V)', 'Pascal (Pa)'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Ohmsch: U ∼ I, R = U/I in Ohm. Größeres R → kleineres I bei gleichem U.',
      instruction: 'Tippe die richtige Aussage:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Aussagen zu ohmschen Widerständen stimmen? (mehrere möglich)',
      choices: [
        'R = U / I',
        'U und I sind proportional (Kennlinie gerade)',
        'Widerstand wird in Ohm gemessen',
        'Widerstand wird in Ampere gemessen',
        'Bei U = 0 fließt ideal kein Strom',
      ],
      correct: [
        'R = U / I',
        'U und I sind proportional (Kennlinie gerade)',
        'Widerstand wird in Ohm gemessen',
        'Bei U = 0 fließt ideal kein Strom',
      ],
      solution: 'R = U/I, lineare Kennlinie, Einheit Ohm; bei U = 0 ist I = 0.',
      explanation: 'Ampere ist die Einheit der Stromstärke, nicht des Widerstands.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
)

/** LB4 — Experimentieren: Messreihe, Variablen */
const experiment: Topic['generate'] = mixedVariants(
  (rng) => {
    const ordered = pick(rng, [
      [
        { label: 't = 0 s: 0 cm', value: 0 },
        { label: 't = 2 s: 4 cm', value: 2 },
        { label: 't = 4 s: 8 cm', value: 4 },
      ],
      [
        { label: 'U = 2 V: I = 0,4 A', value: 2 },
        { label: 'U = 4 V: I = 0,8 A', value: 4 },
        { label: 'U = 6 V: I = 1,2 A', value: 6 },
      ],
      [
        { label: 'm = 100 g: ΔT = 5 K', value: 100 },
        { label: 'm = 200 g: ΔT = 5 K', value: 200 },
        { label: 'm = 300 g: ΔT = 5 K', value: 300 },
      ],
    ])
    const items = [...ordered]
    for (let i = items.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[items[i], items[j]] = [items[j]!, items[i]!]
    }
    const correctOrder = ordered.map((row) => items.findIndex((it) => it.value === row.value))
    return dragDropSortTask({
      question: 'Ordne die Messreihe sinnvoll (klein → groß / früh → spät).',
      items,
      correctOrder,
      solution: ordered.map((row) => row.label).join(' → '),
      explanation: 'Messwerte sortiert man nach der unabhängigen Größe (Zeit, Spannung, Masse, …).',
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Du änderst die Spannung und misst die Stromstärke. Was ist die unabhängige Variable?',
        correct: 'Spannung',
        wrong: ['Stromstärke', 'nur die Farbe der Drähte', 'die Uhrzeit im Labor'],
      },
      {
        q: 'Du änderst die Spannung und misst die Stromstärke. Was ist die abhängige Variable?',
        correct: 'Stromstärke',
        wrong: ['Spannung', 'der Widerstand als Einstellung allein', 'das Klassenzimmer'],
      },
      {
        q: 'Beim Erwärmen änderst du die Heizzeit und misst die Temperatur. Unabhängige Variable?',
        correct: 'Heizzeit',
        wrong: ['Temperatur', 'nur die Masse der Luft draußen', 'der Schulname'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Unabhängig: was du einstellst. Abhängig: was du daraufhin misst.',
      instruction: 'Tippe die passende Variable:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Was gehört zu einem sauberen Experiment? (mehrere möglich)',
      choices: [
        'Messreihe aufschreiben',
        'unabhängige und abhängige Variable kennen',
        'nur einmal messen und raten',
        'Bedingungen möglichst vergleichbar halten',
        'Ergebnisse ohne Werte erfinden',
      ],
      correct: [
        'Messreihe aufschreiben',
        'unabhängige und abhängige Variable kennen',
        'Bedingungen möglichst vergleichbar halten',
      ],
      solution: 'Messreihe, klare Variablen, vergleichbare Bedingungen.',
      explanation: 'Raten und erfundene Werte gehören nicht zum Experimentieren.',
      instruction: 'Tippe alle richtigen Punkte:',
    }),
)

/** Wahlbereich — Ballonfahren: warme Luft, Auftrieb */
const ballon: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Warum steigt ein Heißluftballon, wenn die Luft im Ballon erwärmt wird?',
        correct: 'Warme Luft ist weniger dicht → Auftrieb',
        wrong: [
          'Warme Luft ist dichter und sinkt',
          'Die Masse der Gondel verschwindet',
          'Es wirkt keine Gewichtskraft mehr',
        ],
      },
      {
        q: 'Was passiert qualitativ, wenn die Ballonluft abkühlt?',
        correct: 'Der Auftrieb wird kleiner — der Ballon sinkt eher',
        wrong: [
          'Der Auftrieb wird automatisch größer',
          'Der Ballon wird magnetisch',
          'Die Außenluft verschwindet',
        ],
      },
      {
        q: 'Welche Kraft hält dem Gewicht des Ballons entgegen?',
        correct: 'Auftrieb',
        wrong: ['nur Reibung am Boden', 'Lichtkraft', 'Ampere'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Erwärmte Luft dehnt sich aus und wird weniger dicht — der Ballon erfährt Auftrieb in der kälteren Außenluft.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Aussagen zum Heißluftballon stimmen? (mehrere möglich)',
      choices: [
        'Warme Luft im Ballon ist weniger dicht als kalte Außenluft',
        'Auftrieb wirkt dem Gewicht entgegen',
        'Ohne Temperaturunterschied kein typischer Heißluftauftrieb',
        'Der Ballon steigt, weil warme Luft immer schwerer ist',
        'Abkühlen verringert den Auftrieb',
      ],
      correct: [
        'Warme Luft im Ballon ist weniger dicht als kalte Außenluft',
        'Auftrieb wirkt dem Gewicht entgegen',
        'Ohne Temperaturunterschied kein typischer Heißluftauftrieb',
        'Abkühlen verringert den Auftrieb',
      ],
      solution: 'Weniger Dichte → Auftrieb; Abkühlen verringert den Auftrieb.',
      explanation: 'Falsch: warme Luft ist nicht schwerer — sie ist weniger dicht.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
  () =>
    dragDropSortTask({
      question: 'Ordne den typischen Ablauf (Start → Steigen).',
      items: [
        { label: 'Luft im Ballon erwärmen', value: 0 },
        { label: 'Dichte der Ballonluft nimmt ab', value: 1 },
        { label: 'Auftrieb größer als Gewicht → Steigen', value: 2 },
      ],
      correctOrder: [0, 1, 2],
      solution: 'Erwärmen → Dichte sinkt → Auftrieb überwiegt',
      explanation: 'Heizen verringert die Dichte; dann übersteigt der Auftrieb das Gewicht.',
    }),
)

/** Wahlbereich — Kühlschrank / Wärmepumpe */
const kuehlschrank: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Wohin wird die Wärme beim Kühlschrank „gepumpt“?',
        correct: 'von innen (kalt) nach außen (wärmer)',
        wrong: [
          'von außen nach innen ohne Arbeit',
          'Wärme verschwindet spurlos',
          'nur von warm nach kalt von allein im Gerät',
        ],
      },
      {
        q: 'Warum braucht eine Wärmepumpe / ein Kühlschrank elektrische Arbeit?',
        correct: 'Wärme von kalt nach warm geht nicht von allein',
        wrong: [
          'Wärme fließt immer von allein von kalt nach warm',
          'Arbeit ist nur Dekoration',
          'Ohne Arbeit wird es innen heißer',
        ],
      },
      {
        q: 'Wo ist es am Kühlschrank typischerweise wärmer (Abwärme)?',
        correct: 'an der Rückseite / außen',
        wrong: [
          'nur tief im Inneren des Kühlraums',
          'nirgends, Wärme verschwindet',
          'nur am Lichtschalter',
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
        'Von allein fließt Wärme von warm nach kalt. Von kalt nach warm braucht es Arbeit (Wärmepumpe).',
      instruction: 'Tippe die richtige Aussage:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Aussagen zu Kühlschrank und Wärmepumpe stimmen? (mehrere möglich)',
      choices: [
        'Wärme wird von kalt nach warm transportiert',
        'Dafür ist Arbeit nötig',
        'Wärme fließt von allein immer von kalt nach warm',
        'Außen wird Abwärme abgegeben',
        'Innen wird Wärme entzogen',
      ],
      correct: [
        'Wärme wird von kalt nach warm transportiert',
        'Dafür ist Arbeit nötig',
        'Außen wird Abwärme abgegeben',
        'Innen wird Wärme entzogen',
      ],
      solution: 'Pumpen von kalt→warm braucht Arbeit; innen kälter, außen Abwärme.',
      explanation: 'Von allein geht Wärme von warm nach kalt — nicht umgekehrt.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
  (rng) => {
    const correct = 'kalt → warm (mit Arbeit)'
    return choicePickTask({
      question: 'In welche Richtung „pumpt“ der Kühlschrank Wärme?',
      choices: shuffleChoices(
        rng,
        [correct, 'warm → kalt (ohne Arbeit nötig)', 'Wärme bleibt immer innen', 'nur Licht → Schall'],
        correct,
      ),
      correct,
      solution: correct,
      explanation: 'Der Kühlschrank entzieht innen Wärme und gibt sie außen ab — das braucht Arbeit.',
      instruction: 'Tippe die Richtung:',
    })
  },
)

/** Wahlbereich — Elektrisches Messen nichtelektrischer Größen */
const messen: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Ein Temperatursensor liefert oft …',
        correct: 'eine elektrische Größe (z. B. Widerstand oder Spannung)',
        wrong: [
          'direkt die Masse in Kilogramm ohne Umwandlung',
          'nur eine Farbe ohne Messwert',
          'Ampere als Temperatur selbst',
        ],
      },
      {
        q: 'Was macht ein Sensor beim elektrischen Messen nichtelektrischer Größen?',
        correct: 'wandelt die Messgröße in eine elektrische Größe um',
        wrong: [
          'löscht die Messgröße',
          'ersetzt die Batterie',
          'misst nur Schulnoten',
        ],
      },
      {
        q: 'Welche Kette beschreibt typisches elektrisches Messen?',
        correct: 'Messgröße → Sensor → elektrische Größe → Anzeige',
        wrong: [
          'Anzeige → Sensor → Messgröße ohne Sensor',
          'nur Anzeige ohne Sensor',
          'elektrische Größe → Messgröße ohne Wandlung',
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
        'Sensoren wandeln z. B. Temperatur, Druck oder Helligkeit in Spannung, Strom oder Widerstand um.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Paare „Messgröße → typische elektrische Größe“ passen? (mehrere möglich)',
      choices: [
        'Temperatur → Widerstand / Spannung',
        'Helligkeit → Fotowiderstand / Spannung',
        'Druck → Sensor-Spannung',
        'Temperatur → Newton als Stromstärke',
        'Farbe der Wand allein → Ampere ohne Sensor',
      ],
      correct: [
        'Temperatur → Widerstand / Spannung',
        'Helligkeit → Fotowiderstand / Spannung',
        'Druck → Sensor-Spannung',
      ],
      solution: 'Temperatur, Helligkeit und Druck können über Sensoren elektrisch erfasst werden.',
      explanation: 'Newton ist keine Stromstärke; ohne Sensor keine sinnvolle elektrische Messkette.',
      instruction: 'Tippe alle passenden Paare:',
    }),
  () =>
    dragDropSortTask({
      question: 'Ordne die Messkette (Beginn → Ende).',
      items: [
        { label: 'nichtelektrische Messgröße (z. B. Temperatur)', value: 0 },
        { label: 'Sensor wandelt um', value: 1 },
        { label: 'elektrische Größe (U, I oder R)', value: 2 },
        { label: 'Anzeige / Auswertung', value: 3 },
      ],
      correctOrder: [0, 1, 2, 3],
      solution: 'Messgröße → Sensor → elektrische Größe → Anzeige',
      explanation: 'Ohne Sensor bleibt die nichtelektrische Größe nicht direkt am Multimeter lesbar.',
    }),
)

export const PHYSIK_K8_GENERATORS: Record<string, Topic['generate']> = {
  'ph-k8-lb1-fluide': fluide,
  'ph-k8-lb2-thermisch': thermisch,
  'ph-k8-lb3-bauelemente': bauelemente,
  'ph-k8-lb4-experiment': experiment,
  'ph-k8-lbw-ballon': ballon,
  'ph-k8-lbw-kuehlschrank': kuehlschrank,
  'ph-k8-lbw-messen': messen,
}
