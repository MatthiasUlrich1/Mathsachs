import { pick, randInt, type Rng } from '../lib/rng'
import {
  circuitSvg,
  lightRayHintSvg,
  lightShadowSvg,
  mirrorAngleSvg,
  thermometerSvg,
} from '../lib/physikSvg'
import {
  choicePickTask,
  coordinateClickTask,
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

/** LB1 — Licht und Schatten */
const schatten: Topic['generate'] = mixedVariants(
  (rng) => {
    const lampLeft = pick(rng, [true, false])
    const shadowSide: 'left' | 'right' = lampLeft ? 'right' : 'left'
    const correct = shadowSide === 'left' ? 'links vom Körper' : 'rechts vom Körper'
    const wrong = shadowSide === 'left' ? 'rechts vom Körper' : 'links vom Körper'
    return choicePickTask({
      question:
        'Wo liegt der Schatten des Körpers, wenn die Lampe wie in der Abbildung steht?',
      choices: shuffleChoices(rng, [correct, wrong, 'unter dem Körper', 'über dem Körper'], correct),
      correct,
      solution: correct,
      explanation:
        'Licht breitet sich geradlinig aus. Der Schatten liegt auf der dem Licht abgewandten Seite des Körpers.',
      visualContent: lightShadowSvg({ lampLeft, shadowSide }),
      instruction: 'Tippe die Schattenseite:',
    })
  },
  (rng) => {
    const wantRight = pick(rng, [true, false])
    const lamp = wantRight ? pick(rng, [-5, -4, -3, -2, -1]) : pick(rng, [1, 2, 3, 4, 5])
    const side = wantRight ? 'rechts' : 'links'
    const start = wantRight ? 3 : -3
    return paramSliderTask({
      question: `Der Körper steht bei x = 0. Stelle die Lampe auf x = ${lamp}, damit der Schatten ${side} liegt.`,
      params: [
        {
          id: 'lamp',
          label: 'Lampenposition x',
          min: -5,
          max: 5,
          step: 1,
          start,
        },
      ],
      correct: { lamp },
      solution: `x = ${lamp}`,
      explanation:
        'Lampe und Schatten liegen auf gegenüberliegenden Seiten des Körpers (geradlinige Ausbreitung).',
      preview: 'shadow',
      instruction: 'Schieberegler auf den geforderten Wert:',
    })
  },
)

const spiegel: Topic['generate'] = mixedVariants(
  (rng) => {
    const alpha = pick(rng, [20, 30, 35, 40, 45, 50, 55, 60])
    return choicePickTask({
      question: `Am ebenen Spiegel beträgt der Einfallswinkel ${alpha}°. Wie groß ist der Ausfallswinkel?`,
      choices: shuffleChoices(
        rng,
        [`${alpha}°`, `${90 - alpha}°`, `${180 - alpha}°`, `${alpha + 10}°`],
        `${alpha}°`,
      ),
      correct: `${alpha}°`,
      solution: `${alpha}°`,
      explanation:
        'Reflexionsgesetz: Einfallswinkel = Ausfallswinkel (beide gegen das Lot gemessen).',
      visualContent: mirrorAngleSvg(alpha),
      instruction: 'Tippe den Ausfallswinkel:',
    })
  },
  (rng) => {
    const alpha = randInt(rng, 15, 70)
    return valueTask({
      question: `Einfallswinkel am ebenen Spiegel: ${alpha}°. Gib den Ausfallswinkel in Grad an.`,
      answerKind: 'integer',
      unit: '°',
      value: alpha,
      solution: `${alpha}°`,
      explanation: 'Einfallswinkel = Ausfallswinkel.',
    })
  },
)

const ausbreitung: Topic['generate'] = mixedVariants(
  (rng) => {
    const correct = 'geradlinig'
    return choicePickTask({
      question: 'Wie breitet sich Licht in Luft (ohne Spiegel/Linse) aus?',
      choices: shuffleChoices(rng, [correct, 'kreisrund', 'nur nach oben', 'zufällig'], correct),
      correct,
      solution: correct,
      explanation:
        'In homogenen Medien breitet sich Licht geradlinig aus — deshalb entstehen scharfe Schatten.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Aussagen zum Licht stimmen? (mehrere möglich)',
      choices: [
        'Licht breitet sich geradlinig aus',
        'Schatten entsteht hinter dem Körper',
        'Zum Sehen braucht es Licht vom Gegenstand zum Auge',
        'Licht läuft nur nach oben',
        'Ohne Lichtquelle gibt es trotzdem Schatten',
      ],
      correct: [
        'Licht breitet sich geradlinig aus',
        'Schatten entsteht hinter dem Körper',
        'Zum Sehen braucht es Licht vom Gegenstand zum Auge',
      ],
      solution:
        'Geradlinige Ausbreitung; Schatten hinter dem Körper; Sehen braucht Licht zum Auge.',
      explanation:
        'Falsch sind „nur nach oben“ und „Schatten ohne Lichtquelle“. Schatten setzt eine Lichtquelle voraus.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
)

const lampenposition: Topic['generate'] = (rng) => {
  const lamp = pick(rng, [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5])
  const start = lamp > 0 ? -2 : 2
  return paramSliderTask({
    question: `Stelle die Lampe genau auf x = ${lamp} (Körper bei x = 0). Beobachte, wohin der Schatten wandert.`,
    params: [{ id: 'lamp', label: 'Lampenposition x', min: -5, max: 5, step: 1, start }],
    correct: { lamp },
    solution: `x = ${lamp}`,
    explanation:
      lamp < 0
        ? 'Lampe links vom Körper → Schatten rechts.'
        : 'Lampe rechts vom Körper → Schatten links.',
    preview: 'shadow',
    instruction: 'Schieberegler auf den geforderten Wert:',
  })
}

const lichtstrahl: Topic['generate'] = mixedVariants(
  (rng) => {
    const ax = randInt(rng, 0, 2)
    const ay = randInt(rng, 0, 2)
    const dx = pick(rng, [1, 2])
    const dy = pick(rng, [0, 1])
    const bx = ax + dx
    const by = ay + dy
    let cx = bx + dx
    let cy = by + dy
    if (cx > 6 || cy > 5) {
      cx = bx
      cy = by + 1
      if (cy > 5) {
        cx = bx + 1
        cy = by
      }
    }
    return coordinateClickTask({
      question: `Licht geht von (${ax}|${ay}) durch den Spalt (${bx}|${by}). Tippe den Punkt (${cx}|${cy}) auf dem verlängerten Strahl.`,
      x: cx,
      y: cy,
      xRange: [0, 6],
      yRange: [0, 5],
      solution: `(${cx}|${cy})`,
      explanation: `Geradlinige Ausbreitung: verlängere den Weg von (${ax}|${ay}) über (${bx}|${by}) nach (${cx}|${cy}).`,
      visualContent: lightRayHintSvg({
        from: { x: ax, y: ay },
        through: { x: bx, y: by },
      }),
      instruction: 'Tippe einen Punkt auf dem Lichtstrahl:',
    })
  },
  (rng) => {
    const x = randInt(rng, 1, 5)
    return coordinateClickTask({
      question: `Ein Lichtstrahl kommt von (${x}|5) senkrecht auf den Spiegel in der x-Achse. Tippe den Auftreffpunkt.`,
      x,
      y: 0,
      xRange: [0, 6],
      yRange: [0, 5],
      solution: `(${x}|0)`,
      explanation: `Senkrecht nach unten: Auftreffpunkt (${x}|0) auf dem Spiegel.`,
      instruction: 'Tippe den Punkt auf dem Spiegel:',
    })
  },
)

/** LB2 — Körper, Masse, Bewegung */
const dichte: Topic['generate'] = (rng) => {
  const m = pick(rng, [20, 40, 50, 60, 80, 100])
  const v = pick(rng, [2, 4, 5, 8, 10])
  const rho = m / v
  return valueTask({
    question: `Ein Körper hat die Masse m = ${m} g und das Volumen V = ${v} cm³. Berechne die Dichte ρ = m / V.`,
    answerKind: rho % 1 === 0 ? 'integer' : 'decimal',
    unit: 'g/cm³',
    value: rho,
    solution: `${rho} g/cm³`,
    explanation: `ρ = m / V = ${m} / ${v} = ${rho} g/cm³.`,
  })
}

const geschwindigkeit: Topic['generate'] = (rng) => {
  const v = pick(rng, [2, 3, 4, 5, 6, 8, 10])
  const t = pick(rng, [2, 3, 4, 5, 6])
  const s = v * t
  return mixedVariants(
    () =>
      valueTask({
        question: `Ein Körper bewegt sich gleichförmig mit v = ${v} m/s für t = ${t} s. Welche Strecke s legt er zurück? (s = v · t)`,
        answerKind: 'integer',
        unit: 'm',
        value: s,
        solution: `${s} m`,
        explanation: `s = v · t = ${v} · ${t} = ${s} m.`,
      }),
    () =>
      valueTask({
        question: `Ein Körper legt s = ${s} m in t = ${t} s gleichförmig zurück. Berechne die Geschwindigkeit v = s / t.`,
        answerKind: 'integer',
        unit: 'm/s',
        value: v,
        solution: `${v} m/s`,
        explanation: `v = s / t = ${s} / ${t} = ${v} m/s.`,
      }),
  )(rng)
}

const masseVergleich: Topic['generate'] = (rng) => {
  const a = randInt(rng, 2, 9)
  const b = randInt(rng, 2, 9)
  if (a === b) {
    return choicePickTask({
      question: `Zwei Körper haben jeweils die Masse ${a} kg. Was gilt?`,
      choices: ['A ist schwerer', 'B ist schwerer', 'beide gleich schwer'],
      correct: 'beide gleich schwer',
      solution: 'beide gleich schwer',
      explanation: 'Gleiche Masse → gleiche Schwere (am selben Ort).',
      instruction: 'Tippe den Vergleich:',
    })
  }
  const correct = a > b ? 'A ist schwerer' : 'B ist schwerer'
  return choicePickTask({
    question: `Körper A hat die Masse ${a} kg, Körper B ${b} kg. Was gilt?`,
    choices: shuffleChoices(rng, ['A ist schwerer', 'B ist schwerer', 'beide gleich schwer'], correct),
    correct,
    solution: correct,
    explanation: `Vergleiche die Massen: ${a} kg ${a > b ? '>' : '<'} ${b} kg.`,
    instruction: 'Tippe den Vergleich:',
  })
}

/** LB3 — Temperatur */
const thermometer: Topic['generate'] = mixedVariants(
  (rng) => {
    const c = pick(rng, [-10, 0, 20, 37, 40, 60, 80, 100])
    return numberLineTask({
      question: 'Stelle die Temperatur auf dem Zahlenstrahl ein (in °C).',
      min: -20,
      max: 100,
      step: 1,
      value: c,
      solution: `${c} °C`,
      explanation: `Die Markierung liegt bei ${c} °C.`,
    })
  },
  (rng) => {
    const c = pick(rng, [0, 20, 37, 50, 80, 100])
    return choicePickTask({
      question: 'Welche Temperatur zeigt das Thermometer ungefähr?',
      choices: shuffleChoices(
        rng,
        [`${c} °C`, `${c + 20} °C`, `${c - 20} °C`, `${c + 40} °C`].map(String),
        `${c} °C`,
      ),
      correct: `${c} °C`,
      solution: `${c} °C`,
      explanation: `Ablesen an der Skala: etwa ${c} °C.`,
      visualContent: thermometerSvg(c),
      instruction: 'Tippe den passenden Wert:',
    })
  },
)

const kelvin: Topic['generate'] = (rng) => {
  const c = pick(rng, [-20, -10, 0, 20, 27, 37, 100])
  const k = c + 273
  return valueTask({
    question: `Wandle ${c} °C in Kelvin um (T/K = ϑ/°C + 273).`,
    answerKind: 'integer',
    unit: 'K',
    value: k,
    solution: `${k} K`,
    explanation: `T = ${c} + 273 = ${k} K.`,
  })
}

const aggregate: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Wasser bei 20 °C und Normaldruck ist …',
        correct: 'flüssig',
        choices: ['fest', 'flüssig', 'gasförmig'],
      },
      {
        q: 'Eis bei −5 °C ist …',
        correct: 'fest',
        choices: ['fest', 'flüssig', 'gasförmig'],
      },
      {
        q: 'Wasserdampf über kochendem Wasser ist …',
        correct: 'gasförmig',
        choices: ['fest', 'flüssig', 'gasförmig'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [...c.choices], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Aggregatzustand hängt von Stoff und Temperatur (sowie Druck) ab.',
      instruction: 'Tippe den Aggregatzustand:',
    })
  },
  () =>
    dragDropSortTask({
      question: 'Ordne die Vorgänge nach steigender Temperatur (kalt → heiß) für Wasser.',
      items: [
        { label: 'Eis schmilzt (0 °C)', value: 0 },
        { label: 'Wasser kocht (100 °C)', value: 100 },
        { label: 'Raumtemperatur (~20 °C)', value: 20 },
      ],
      correctOrder: [0, 2, 1],
      solution: 'Eis schmilzt → Raumtemperatur → Wasser kocht',
      explanation: '0 °C (Schmelzen) < ~20 °C < 100 °C (Sieden).',
    }),
)

/** LB4 — Stromkreis */
const stromkreis: Topic['generate'] = (rng) => {
  const closed = pick(rng, [true, false])
  const correct = closed ? 'Die Lampe leuchtet.' : 'Die Lampe leuchtet nicht.'
  const wrong = closed ? 'Die Lampe leuchtet nicht.' : 'Die Lampe leuchtet.'
  return choicePickTask({
    question: 'Was passiert in diesem einfachen Stromkreis?',
    choices: shuffleChoices(
      rng,
      [correct, wrong, 'Die Batterie verschwindet.', 'Nur der Schalter leuchtet.'],
      correct,
    ),
    correct,
    solution: correct,
    explanation: closed
      ? 'Geschlossener Stromkreis: Ladung fließt, die Lampe leuchtet.'
      : 'Offener Stromkreis: kein geschlossener Weg, die Lampe bleibt aus.',
    visualContent: circuitSvg(closed),
    instruction: 'Tippe die richtige Aussage:',
  })
}

const leiter: Topic['generate'] = (rng) => {
  const cases = [
    { material: 'Kupferdraht', correct: 'Leiter' },
    { material: 'Silberblech', correct: 'Leiter' },
    { material: 'Gummi', correct: 'Nichtleiter' },
    { material: 'Kunststoffhülle', correct: 'Nichtleiter' },
    { material: 'Holz (trocken)', correct: 'Nichtleiter' },
    { material: 'Eisennagel', correct: 'Leiter' },
  ] as const
  const c = pick(rng, [...cases])
  return choicePickTask({
    question: `Ist „${c.material}“ eher ein elektrischer Leiter oder ein Nichtleiter?`,
    choices: ['Leiter', 'Nichtleiter'],
    correct: c.correct,
    solution: c.correct,
    explanation:
      'Metalle leiten den Strom gut; Gummi, Kunststoff und trockenes Holz isolieren.',
    instruction: 'Tippe die Einordnung:',
  })
}

/** Wahlbereiche */
const sehen: Topic['generate'] = (rng) => {
  const correct = 'Gegenstand → Auge (über Licht)'
  return choicePickTask({
    question: 'Damit wir einen Gegenstand sehen, muss Licht …',
    choices: shuffleChoices(
      rng,
      [
        correct,
        'vom Auge zum Gegenstand und zurück ohne Lichtquelle',
        'nur im Dunkeln wirken',
        'nur durch den Schatten gehen',
      ],
      correct,
    ),
    correct,
    solution: correct,
    explanation:
      'Sehen erfordert Licht: Es kommt von einer Quelle, trifft den Gegenstand und gelangt (reflektiert) ins Auge.',
    instruction: 'Tippe die passende Aussage:',
  })
}

const daemmung: Topic['generate'] = (rng) => {
  const correct = 'Luftschicht / Dämmstoff'
  return choicePickTask({
    question: 'Was verringert die Wärmeleitung durch eine Wand besonders gut?',
    choices: shuffleChoices(
      rng,
      [correct, 'dünnes Kupferblech', 'eine große Öffnung', 'feuchter Putz ohne Luft'],
      correct,
    ),
    correct,
    solution: correct,
    explanation: 'Stillstehende Luft und Dämmstoffe leiten Wärme schlecht — deshalb dämmen sie.',
    instruction: 'Tippe die beste Antwort:',
  })
}

const farben: Topic['generate'] = (rng) => {
  const correct = 'weißes Licht enthält viele Farben'
  return choicePickTask({
    question: 'Was stimmt für weißes Licht (z. B. Sonnenlicht)?',
    choices: shuffleChoices(
      rng,
      [
        correct,
        'weißes Licht hat keine Farbe und kann nicht zerlegt werden',
        'weißes Licht ist nur rot',
        'Farben entstehen nur ohne Licht',
      ],
      correct,
    ),
    correct,
    solution: correct,
    explanation: 'Weißes Licht lässt sich (z. B. am Prisma) in Spektralfarben zerlegen.',
    instruction: 'Tippe die passende Aussage:',
  })
}

export const PHYSIK_K6_GENERATORS: Record<string, Topic['generate']> = {
  'ph-k6-lb1-schatten': schatten,
  'ph-k6-lb1-lampenposition': lampenposition,
  'ph-k6-lb1-lichtstrahl': lichtstrahl,
  'ph-k6-lb1-spiegel': spiegel,
  'ph-k6-lb1-ausbreitung': ausbreitung,
  'ph-k6-lb2-dichte': dichte,
  'ph-k6-lb2-geschwindigkeit': geschwindigkeit,
  'ph-k6-lb2-masse': masseVergleich,
  'ph-k6-lb3-thermometer': thermometer,
  'ph-k6-lb3-kelvin': kelvin,
  'ph-k6-lb3-aggregate': aggregate,
  'ph-k6-lb4-stromkreis': stromkreis,
  'ph-k6-lb4-leiter': leiter,
  'ph-k6-lbw-sehen': sehen,
  'ph-k6-lbw-daemmung': daemmung,
  'ph-k6-lbw-farben': farben,
}
