import {
  generateLinearFunctionSvg,
  generatePieChartSvg,
  generatePointsOnGridSvg,
  generatePrismNetChoicesSvg,
} from '../lib/geometrySvg'
import { pick, randInt, type Rng } from '../lib/rng'
import { bundledCurricula } from './bundled'
import { topicContentId } from './contentId'
import { ensureTopicFachwissen } from './fachwissen'
import { ST_GENERATOR_MAP } from './gymSachsenAnhaltPack'
import { withMathGymThinFill } from './mathGymThinFill'
import { withMathOsThinFill } from './mathOsThinFill'
import { OS_ST_LEHRPLAN_TEILASPEKTE_GENERATORS } from './osStLehrplanTeilaspekte'
import { SKS_GENERATOR_MAP } from './sekundarschuleSachsenAnhaltPack'
import {
  choicePickTask,
  coordinateClickTask,
  mixedVariants,
  paramSliderTask,
  textTask,
  valueTask,
  visualTask,
} from './taskHelpers'
import type { PackTopic } from './pack'
import type { Topic } from './types'

/** Flexible accepted formats for a coordinate pair (a; b). */
const pairAnswerAccepted = (a: number, b: number): string[] => {
  const raw = [
    `${a}; ${b}`,
    `${a};${b}`,
    `${a}, ${b}`,
    `${a},${b}`,
    `${a} ; ${b}`,
    `${a}|${b}`,
    `${a} | ${b}`,
    `(${a}|${b})`,
    `(${a} | ${b})`,
    `(${a}; ${b})`,
    `(${a};${b})`,
    `(${a}, ${b})`,
    `(${a},${b})`,
  ]
  return [...new Set(raw)]
}

/** First-quadrant points only (Lehrplan K5: erster Quadrant). */
const q1Points = (rng: Rng, count: number, max = 6): Array<{ x: number; y: number }> => {
  const pts: Array<{ x: number; y: number }> = []
  const used = new Set<string>()
  let guard = 0
  while (pts.length < count && guard < 200) {
    guard++
    const x = randInt(rng, 0, max)
    const y = randInt(rng, 0, max)
    if (x === 0 && y === 0 && pts.length === 0) continue
    const key = `${x},${y}`
    if (used.has(key)) continue
    used.add(key)
    pts.push({ x, y })
  }
  return pts
}

const nonZero = (rng: Rng, min: number, max: number): number => {
  let v = 0
  while (v === 0) v = randInt(rng, min, max)
  return v
}

const num = (n: number): string => (n < 0 ? `(−${Math.abs(n)})` : `${n}`)

/** HS: smaller slope / intercept ranges (easier than Gym/RS). */
const hsLinearSteigung: Topic['generate'] = mixedVariants(
  (rng: Rng) => {
    const x1 = randInt(rng, 0, 4)
    let x2 = randInt(rng, 1, 5)
    while (x2 === x1) x2 = randInt(rng, 1, 5)
    const m = nonZero(rng, -3, 3)
    const y1 = randInt(rng, 0, 6)
    const y2 = y1 + m * (x2 - x1)
    return valueTask({
      question: `Eine Gerade verläuft durch P(${x1} | ${y1}) und Q(${x2} | ${y2}). Berechne die Steigung m.`,
      answerKind: 'integer',
      value: m,
      solution: `m = ${m}`,
      explanation: `m = (${y2} − ${y1}) : (${x2} − ${x1}) = ${m}.`,
    })
  },
  (rng: Rng) => {
    const m = nonZero(rng, -3, 3)
    const n = randInt(rng, 0, 4)
    return visualTask({
      question: 'Lies die Steigung m am Steigungsdreieck ab.',
      answerKind: 'integer',
      value: m,
      solution: `m = ${m}`,
      explanation: `m = Δy : Δx = ${m}.`,
      visualContent: generateLinearFunctionSvg({
        m,
        n,
        interceptLabel: false,
        slopeTriangle: { fromX: 0, run: 1, showLabels: true },
        xRange: [-1, 6],
        yRange: [-2, 8],
      }),
    })
  },
  (rng: Rng) => {
    const mTarget = nonZero(rng, -3, 3)
    let mOther = nonZero(rng, -3, 3)
    while (mOther === mTarget) mOther = nonZero(rng, -3, 3)
    const targetIsA = rng() < 0.5
    const mA = targetIsA ? mTarget : mOther
    const mB = targetIsA ? mOther : mTarget
    const correct = targetIsA ? 'A' : 'B'
    return choicePickTask({
      question: `Welche Gerade hat die Steigung m = ${mTarget}?`,
      choices: ['A', 'B'],
      correct,
      solution: correct,
      explanation: `A: m=${mA}, B: m=${mB} → ${correct}.`,
      visualContent: generateLinearFunctionSvg({
        m: mA,
        n: randInt(rng, 0, 3),
        lineLabel: 'A',
        interceptLabel: false,
        second: { m: mB, n: randInt(rng, 0, 3), stroke: '#c62828', label: 'B' },
        xRange: [-2, 5],
        yRange: [-3, 7],
      }),
      instruction: 'Tippe A oder B:',
    })
  },
)

const hsLinearAchsen: Topic['generate'] = mixedVariants(
  (rng: Rng) => {
    const m = nonZero(rng, -3, 3)
    const x = nonZero(rng, 1, 4)
    const n = randInt(rng, 0, 5)
    const y = m * x + n
    return valueTask({
      question: `Eine Gerade mit Steigung m = ${m} geht durch P(${x} | ${y}). Bestimme n.`,
      answerKind: 'integer',
      value: n,
      solution: `n = ${n}`,
      explanation: `n = y − m·x = ${y} − ${m}·${x} = ${n}.`,
    })
  },
  (rng: Rng) => {
    const m = nonZero(rng, -2, 2)
    const n = randInt(rng, 1, 5)
    return visualTask({
      question: `Die Gerade hat Steigung m = ${m}. Lies den y-Achsenabschnitt n ab.`,
      answerKind: 'integer',
      value: n,
      solution: `n = ${n}`,
      explanation: `Schnitt mit der y-Achse bei (0|${n}).`,
      visualContent: generateLinearFunctionSvg({
        m,
        n,
        interceptLabel: '?',
        xRange: [-1, 5],
        yRange: [-1, 7],
      }),
    })
  },
)

const hsLinearFunktionswert: Topic['generate'] = mixedVariants(
  (rng: Rng) => {
    const m = nonZero(rng, -3, 3)
    const n = randInt(rng, 0, 5)
    const x = randInt(rng, 1, 5)
    const value = m * x + n
    return valueTask({
      question: `Gegeben ist f(x) = ${num(m)}·x + ${num(n)}. Berechne f(${x}).`,
      answerKind: 'integer',
      value,
      solution: String(value),
      explanation: `f(${x}) = ${num(m)}·${x} + ${num(n)} = ${value}.`,
    })
  },
  (rng: Rng) => {
    const m = nonZero(rng, -2, 2)
    const n = randInt(rng, 0, 4)
    return paramSliderTask({
      question: `Stelle m und n so ein, dass f(x) = ${num(m)}·x + ${num(n)} entsteht.`,
      params: [
        { id: 'm', label: 'Steigung m', min: -3, max: 3, step: 1, start: 0 },
        { id: 'n', label: 'Achsenabschnitt n', min: 0, max: 5, step: 1, start: 0 },
      ],
      correct: { m, n },
      solution: `m = ${m}, n = ${n}`,
      explanation: `m = ${m}, n = ${n}.`,
      preview: 'linear',
      instruction: 'Kleine Wertebereiche — stelle beide Regler ein:',
    })
  },
)

/** RS K7 / HS K7: Punkt setzen, aber nur 1. Quadrant (einfacher). */
const osQ1CoordinatePlace: Topic['generate'] = mixedVariants(
  (rng: Rng) => {
    const [p] = q1Points(rng, 1, 6)
    return coordinateClickTask({
      question: `Setze den Punkt P(${p.x}|${p.y}) (erster Quadrant).`,
      x: p.x,
      y: p.y,
      solution: `(${p.x}|${p.y})`,
      explanation: `P liegt bei (${p.x}|${p.y}) im ersten Quadranten.`,
      xRange: [0, 7],
      yRange: [0, 7],
      instruction: 'Tippe auf die richtige Gitterstelle:',
    })
  },
  (rng: Rng) => {
    const pts = q1Points(rng, 3, 6)
    const labels = ['A', 'B', 'C'] as const
    const labeled = pts.map((p, i) => ({ ...p, label: labels[i] }))
    const askIdx = randInt(rng, 0, 2)
    const target = labeled[askIdx]
    return choicePickTask({
      question: `Welcher Punkt liegt bei (${target.x}|${target.y})?`,
      choices: ['A', 'B', 'C'],
      correct: target.label,
      solution: target.label,
      explanation: `Punkt ${target.label} = (${target.x}|${target.y}).`,
      visualContent: generatePointsOnGridSvg({
        points: labeled,
        xRange: [0, 7],
        yRange: [0, 7],
      }),
      instruction: 'Tippe den richtigen Punkt:',
    })
  },
)

/** Kreisdiagramm mit echten Anteilen / Prozenten. */
const osPieAnteil: Topic['generate'] = (rng: Rng) => {
  const labels = pick(rng, [
    ['Sport', 'Musik', 'Lesen'],
    ['Bus', 'Bahn', 'Auto'],
    ['Rot', 'Blau', 'Grün'],
    ['A', 'B', 'C'],
  ])
  // Parts that sum to 100
  const p1 = pick(rng, [20, 25, 30, 40])
  const p2 = pick(rng, [20, 25, 30, 40])
  let p3 = 100 - p1 - p2
  if (p3 <= 0) {
    p3 = 20
  }
  // renormalize if needed
  const raw = [p1, p2, Math.max(10, p3)]
  const sum = raw.reduce((s, x) => s + x, 0)
  const parts = raw.map((x) => Math.round((x / sum) * 100))
  // fix rounding drift
  parts[2] = 100 - parts[0] - parts[1]
  const askIdx = randInt(rng, 0, 2)
  const value = parts[askIdx]
  return visualTask({
    question: `Im Kreisdiagramm: Wie groß ist der Anteil von „${labels[askIdx]}“ in Prozent?`,
    unit: '%',
    answerKind: 'integer',
    value,
    solution: `${value} %`,
    explanation: `Die Anteile sind ${labels.map((l, i) => `${l}=${parts[i]}%`).join(', ')}.`,
    visualContent: generatePieChartSvg({
      slices: labels.map((label, i) => ({ value: parts[i], label })),
    }),
  })
}

/** Prisma-Netz erkennen (gültig vs. ungültig). */
const osPrismNetz: Topic['generate'] = (rng: Rng) => {
  const options: Array<{ kind: 'valid' | 'invalid'; label: string }> = [
    { kind: 'valid', label: 'A' },
    { kind: 'invalid', label: 'B' },
    { kind: 'invalid', label: 'C' },
  ]
  for (let i = options.length - 1; i > 0; i--) {
    const j = randInt(rng, 0, i)
    ;[options[i], options[j]] = [options[j], options[i]]
  }
  options.forEach((o, i) => {
    o.label = String.fromCharCode(65 + i)
  })
  const correct = options.find((o) => o.kind === 'valid')!.label
  return choicePickTask({
    question: 'Welches Netz lässt sich zu einem dreiseitigen Prisma falten?',
    choices: ['A', 'B', 'C'],
    correct,
    solution: correct,
    explanation: `Nur Netz ${correct} ist ein gültiges Prisma-Netz.`,
    visualContent: generatePrismNetChoicesSvg(options),
    instruction: 'Tippe den Buchstaben des faltbaren Netzes:',
  })
}

/**
 * OS-specific generators that adapt Gymnasium tasks (ranges / variants)
 * without changing the Gym curriculum.
 */
export const OS_CUSTOM_GENERATORS: Record<string, Topic['generate']> = {
  ...OS_ST_LEHRPLAN_TEILASPEKTE_GENERATORS,
  // Alias: RS-Tarif nutzt dieselbe Bank wie HS-Tarif
  'os-rs-k8-lb2-tarif': OS_ST_LEHRPLAN_TEILASPEKTE_GENERATORS['os-hs-k9-lb3-tarif']!,
  /** Klasse 5: Koordinaten nur im 1. Quadranten (lesen + tippen + setzen). */
  'os-k5-lb3-koordinaten': mixedVariants(
    (rng: Rng) => {
      const labels = ['A', 'B', 'C'] as const
      const n = rng() < 0.55 ? 1 : randInt(rng, 2, 3)
      const pts = q1Points(rng, n, 6)
      const labeled = pts.map((p, i) => ({ ...p, label: labels[i] }))
      const askIdx = randInt(rng, 0, labeled.length - 1)
      const target = labeled[askIdx]
      return {
        ...textTask({
          question:
            labeled.length === 1
              ? 'Lies die Koordinaten von Punkt A ab (erster Quadrant). Gib x; y an.'
              : `Lies die Koordinaten von Punkt ${target.label} ab (erster Quadrant). Gib x; y an.`,
          accepted: pairAnswerAccepted(target.x, target.y),
          solution: `${target.x}; ${target.y}`,
          explanation: `Punkt ${target.label} liegt bei (${target.x}|${target.y}) im ersten Quadranten.`,
        }),
        visualContent: generatePointsOnGridSvg({
          points: labeled,
          xRange: [0, 7],
          yRange: [0, 7],
        }),
      }
    },
    (rng: Rng) => {
      const [p] = q1Points(rng, 1, 6)
      return coordinateClickTask({
        question: `Setze den Punkt P(${p.x}|${p.y}) im ersten Quadranten.`,
        x: p.x,
        y: p.y,
        solution: `(${p.x}|${p.y})`,
        explanation: `P(${p.x}|${p.y}) liegt im ersten Quadranten.`,
        xRange: [0, 7],
        yRange: [0, 7],
      })
    },
    (rng: Rng) => {
      const pts = q1Points(rng, 3, 6)
      const labels = ['A', 'B', 'C'] as const
      const labeled = pts.map((p, i) => ({ ...p, label: labels[i] }))
      const askIdx = randInt(rng, 0, 2)
      const target = labeled[askIdx]
      return choicePickTask({
        question: `Welcher Punkt liegt bei (${target.x}|${target.y}) (erster Quadrant)?`,
        choices: ['A', 'B', 'C'],
        correct: target.label,
        solution: target.label,
        explanation: `Punkt ${target.label} = (${target.x}|${target.y}).`,
        visualContent: generatePointsOnGridSvg({
          points: labeled,
          xRange: [0, 7],
          yRange: [0, 7],
        }),
      })
    },
  ),

  // HS: Funktionen mit kleinerem Zahlenraum
  'os-hs-k9-lb3-funktionswert': hsLinearFunktionswert,
  'os-hs-k9-lb3-steigung': hsLinearSteigung,
  'os-hs-k9-lb3-achsen': hsLinearAchsen,

  // HS/RS K7 Koordinaten: 1. Quadrant + Tippen/Setzen (leichter als Gym 4Q)
  'os-hs-k7-lb3-koordinaten': osQ1CoordinatePlace,
  'os-rs-k7-lb3-koordinaten': osQ1CoordinatePlace,

  /** Echte Kreisdiagramme mit Anteilen (nicht Bruch-Torten). */
  'os-hs-k7-lb2-kreisdiagramm': osPieAnteil,
  'os-rs-k7-lb1-kreisdiagramm': osPieAnteil,

  /** Prismen-Netze (nicht nur Würfel). */
  'os-hs-k7-lb1-netze': osPrismNetz,
  'os-hs-k7-lb4-netze': osPrismNetz,
  'os-rs-k7-lb4-darstellen': osPrismNetz,
  'os-k6-lb4-darstellen': osPrismNetz,
}

/** Oberschule topic id → existing Gymnasium generator topic id. */
export const OS_GENERATOR_MAP: Record<string, string> = {
  // Klasse 5 (gemeinsam)
  'os-k5-lb1-runden': 'lb1-runden-natuerlich',
  'os-k5-lb1-addition': 'lb1-addition',
  'os-k5-lb1-subtraktion': 'lb1-subtraktion',
  'os-k5-lb1-multiplikation': 'lb1-multiplikation',
  'os-k5-lb1-division': 'lb1-schriftliche-division',
  'os-k5-lb1-potenz': 'lb1-potenzieren',
  'os-k5-lb1-gleichung': 'k7-lb2-gleichung-add',
  'os-k5-lb1-teilbarkeit': 'lb1-teilbarkeit',
  'os-k5-lb1-primzahl': 'lb1-primzahl',
  'os-k5-lb2-anteil': 'lb2-grafische-brueche',
  'os-k5-lb2-kuerzen': 'lb2-kuerzen',
  'os-k5-lb2-erweitern': 'lb2-erweitern',
  'os-k5-lb2-runden-dez': 'lb2-runden-dezimal',
  'os-k5-lb2-dez-add-sub': 'lb2-dez-add-sub',
  'os-k5-lb2-dez-mult': 'lb2-dez-mult',
  'os-k5-lb2-dez-div': 'lb2-dez-div',
  'os-k5-lb2-mittelwert': 'lb2-mittelwert',
  'os-k5-lb2-laenge': 'k5-umrechnen-laenge',
  'os-k5-lb2-masse': 'k5-umrechnen-masse',
  'os-k5-lb2-zeit': 'k5-umrechnen-zeit',
  'os-k5-lb3-winkelarten': 'lb3-winkelarten',
  'os-k5-lb3-winkel-erg': 'lb3-winkel-ergaenzung',
  'os-k5-lb3-umfang': 'lb4-umfang-rechteck',
  'os-k5-lb3-flaeche': 'lb4-flaeche-rechteck',
  'os-k5-lb3-volumen-wuerfel': 'lb4-volumen-quader',
  'os-k5-lb3-wuerfel': 'lb4-wuerfelnetz',
  'os-k5-lb3-oberflaeche': 'lb4-oberflaeche-quader',
  'os-k5-lb3-flaeche-eh': 'k5-umrechnen-flaeche',
  'os-k5-lb3-volumen-eh': 'k5-umrechnen-volumen',
  'os-k5-lb4-spiegelung': 'lb3-achsensymmetrie',
  'os-k5-lb4-deckung': 'lb3-achsensymmetrie',
  'os-k5-lb4-drehung': 'lb3-achsensymmetrie',
  'os-k5-lb4-achsen': 'lb3-achsensymmetrie',
  'os-k5-lbw1-zahlzeichen': 'lb1-runden-natuerlich',
  'os-k5-lbw1-abakus': 'lb1-addition',
  'os-k5-lbw1-stellenwert': 'lb1-schriftliches-rechnen',
  'os-k5-lbw2-daten': 'lb2-mittelwert',
  'os-k5-lbw2-kombinatorik': 'lb1-multiplikation',
  'os-k5-lbw2-mittel': 'lb2-mittelwert',
  'os-k5-lbw3-angebote': 'lb5-gesamtpreis',
  'os-k5-lbw3-budget': 'lb5-gesamtpreis',
  'os-k5-lbw3-zeit': 'k5-umrechnen-zeit',

  // Klasse 6 (gemeinsam)
  'os-k6-lb1-kuerzen': 'lb1-kuerzen',
  'os-k6-lb1-erweitern': 'lb1-erweitern',
  'os-k6-lb1-vergleichen': 'lb1-vergleichen',
  'os-k6-lb1-bruch-dez': 'lb1-bruch-dezimal',
  'os-k6-lb1-add-sub': 'lb1-add-sub-brueche',
  'os-k6-lb1-mult': 'lb1-mult-brueche',
  'os-k6-lb1-div': 'lb1-div-brueche',
  'os-k6-lb1-dez-add-sub': 'lb1-dez-add-sub',
  'os-k6-lb1-dez-mult': 'lb1-dez-mult',
  'os-k6-lb1-dez-div': 'lb1-dez-div',
  'os-k6-lb1-runden': 'lb1-runden',
  'os-k6-lb1-mittelwert': 'lb2-mittelwert',
  'os-k6-lb2-prop': 'lb2-proportional',
  'os-k6-lb2-antiprop': 'lb2-antiproportional',
  'os-k6-lb2-anteil': 'lb5-anteil-groesse',
  'os-k6-lb3-nebenwinkel': 'k7-lb1-nebenwinkel',
  'os-k6-lb3-scheitel': 'k7-lb1-scheitelwinkel',
  'os-k6-lb3-innenwinkel': 'lb3-winkel-dreieck',
  'os-k6-lb3-kongruenz': 'lb3-kongruenzsatz',
  'os-k6-lb3-winkelsumme-viereck': 'lb3-winkel-viereck',
  'os-k6-lb3-flaeche-dreieck': 'lb3-flaeche-dreieck',
  'os-k6-lb3-umfang': 'lb4-umfang-rechteck',
  'os-k6-lb3-flaeche-rechteck': 'lb4-flaeche-rechteck',
  'os-k6-lb4-volumen-quader': 'lb4-volumen-quader',
  'os-k6-lb4-oberflaeche': 'lb4-oberflaeche-quader',
  'os-k6-lb4-volumen-prisma': 'lb4-volumen-prisma',
  'os-k6-lb4-darstellen': 'lb4-wuerfelnetz',
  'os-k6-lb5-haeufigkeit': 'lb2-haeufigkeit',
  'os-k6-lb5-anteil-prozent': 'lb5-anteil-prozent',
  'os-k6-lbw3-mittelwert': 'lb2-mittelwert',
  'os-k6-lbw3-modal': 'k9-lb4-modalwert',

  // HS Klasse 7
  'os-hs-k7-lb1-flaeche': 'lb4-flaeche-zusammengesetzt',
  'os-hs-k7-lb1-volumen': 'lb4-volumen-zusammengesetzt',
  'os-hs-k7-lb1-netze': 'lb4-wuerfelnetz',
  'os-hs-k7-lb2-anteil-bruch': 'lb2-anteil-bruch',
  'os-hs-k7-lb2-anteil-groesse': 'lb5-anteil-groesse',
  'os-hs-k7-lb2-prozent': 'lb5-anteil-prozent',
  'os-hs-k7-lb2-dreisatz': 'lb2-proportional',
  'os-hs-k7-lb2-haeufigkeit': 'lb2-haeufigkeit',
  'os-hs-k7-lb2-kreisdiagramm': 'lb2-grafische-brueche',
  'os-hs-k7-lb3-add': 'k7-lb2-add-rational',
  'os-hs-k7-lb3-sub': 'k7-lb2-sub-rational',
  'os-hs-k7-lb3-mul': 'k7-lb2-mul-rational',
  'os-hs-k7-lb3-div': 'k7-lb2-div-rational',
  'os-hs-k7-lb3-term': 'k7-lb2-term-vorrang',
  'os-hs-k7-lb3-gleichung': 'k7-lb2-gleichung-add',
  'os-hs-k7-lb3-koordinaten': 'lb3-koordinaten-eintragen',
  'os-hs-k7-lb4-flaeche-dreieck': 'lb3-flaeche-dreieck',
  'os-hs-k7-lb4-umfang': 'lb4-umfang-rechteck',
  'os-hs-k7-lb4-winkelsumme': 'k7-lb1-winkelsumme-vieleck',
  'os-hs-k7-lb4-volumen-prisma': 'lb4-volumen-prisma',
  'os-hs-k7-lb4-mantel': 'k7-lb3-mantel-prisma',
  'os-hs-k7-lb4-oberflaeche': 'lb4-oberflaeche-quader',
  'os-hs-k7-lb4-zerlegen': 'lb4-flaeche-zusammengesetzt',
  'os-hs-k7-lb4-netze': 'lb4-wuerfelnetz',

  // HS Klasse 7 — interactive remaps
  'os-hs-k7-lb3-zahlengerade': 'k7-lb2-betrag',
  'os-hs-k7-lb4-konstruieren': 'k7-lb1-mittelsenkrechte-schritte',

  // HS Klasse 8
  'os-hs-k8-lb1-prozent': 'lb5-anteil-prozent',
  'os-hs-k8-lb1-zinsen': 'k10-lb1-zinsen',
  'os-hs-k8-lb1-zinseszins': 'k10-lb1-zinseszins',
  'os-hs-k8-lb1-preisaenderung': 'k10-lb1-prozentuale-zunahme',
  'os-hs-k8-lb2-term': 'k8-lb1-term-auswerten',
  'os-hs-k8-lb2-gleichung': 'k8-lb1-gleichung-linear',
  'os-hs-k8-lb2-zusammenfassen': 'k8-lb1-zusammenfassen',
  'os-hs-k8-lb3-kreis-umfang': 'k9-lb2-kreis-umfang',
  'os-hs-k8-lb3-kreis-flaeche': 'k9-lb2-kreis-flaeche',
  'os-hs-k8-lb3-winkelsumme': 'k7-lb1-winkelsumme-vieleck',
  'os-hs-k8-lb3-vieleck': 'lb3-achsensymmetrie',
  'os-hs-k8-lb4-zylinder': 'k9-lb2-zylinder-volumen',
  'os-hs-k8-lb5-zinsen': 'k10-lb1-zinsen',
  'os-hs-k8-lb5-streckfaktor': 'k8-lb4-streckfaktor',

  // HS Klasse 9
  'os-hs-k9-lb1-hyp': 'k9-lb3-pythagoras-hypotenuse',
  'os-hs-k9-lb1-kathete': 'k9-lb3-pythagoras-kathete',
  'os-hs-k9-lb1-sinus': 'k9-lb3-trig-wert',
  'os-hs-k9-lb1-sach': 'k9-lb5-leiter',
  'os-hs-k9-lb2-pyramide': 'k7-lb3-volumen-pyramide',
  'os-hs-k9-lb2-zylinder': 'k9-lb2-zylinder-volumen',
  'os-hs-k9-lb2-zusammengesetzt': 'lb4-volumen-zusammengesetzt',
  'os-hs-k9-lb3-funktionswert': 'k8-lb3-funktionswert',
  'os-hs-k9-lb3-steigung': 'k8-lb3-steigung',
  'os-hs-k9-lb3-achsen': 'k8-lb3-achsenabschnitt',
  'os-hs-k9-lb3-quadrat': 'k9-lb1-quadrat-wert',
  'os-hs-k9-lb4-mittelwert': 'k9-lb4-mittelwert',
  'os-hs-k9-lbw1-median': 'k9-lb4-median',
  'os-hs-k9-lbw1-modal': 'k9-lb4-modalwert',
  'os-hs-k9-lbw1-spannweite': 'k7-lb4-spannweite',

  // RS Klasse 7
  'os-rs-k7-lb1-prozent': 'lb5-anteil-prozent',
  'os-rs-k7-lb1-dreisatz': 'lb2-proportional',
  'os-rs-k7-lb1-zinsen': 'k10-lb1-zinsen',
  'os-rs-k7-lb1-zinseszins': 'k10-lb1-zinseszins',
  'os-rs-k7-lb1-preisaenderung': 'k10-lb1-prozentuale-zunahme',
  'os-rs-k7-lb1-kreisdiagramm': 'lb2-grafische-brueche',
  'os-rs-k7-lb2-haeufigkeit': 'lb2-haeufigkeit',
  'os-rs-k7-lb2-laplace': 'k8-lb2-laplace-bruch',
  'os-rs-k7-lb2-laplace-pct': 'k8-lb2-laplace-prozent',
  'os-rs-k7-lb3-add': 'k7-lb2-add-rational',
  'os-rs-k7-lb3-sub': 'k7-lb2-sub-rational',
  'os-rs-k7-lb3-mul': 'k7-lb2-mul-rational',
  'os-rs-k7-lb3-div': 'k7-lb2-div-rational',
  'os-rs-k7-lb3-term': 'k7-lb2-term-vorrang',
  'os-rs-k7-lb3-gleichung': 'k8-lb1-gleichung-linear',
  'os-rs-k7-lb3-gleichung-beid': 'k8-lb1-gleichung-beidseitig',
  'os-rs-k7-lb3-zahlenraetsel': 'k8-lb5-zahlenraetsel',
  'os-rs-k7-lb3-koordinaten': 'lb3-koordinaten-eintragen',
  'os-rs-k7-lb4-flaeche-dreieck': 'lb3-flaeche-dreieck',
  'os-rs-k7-lb4-umfang': 'lb4-umfang-rechteck',
  'os-rs-k7-lb4-winkelsumme': 'k7-lb1-winkelsumme-vieleck',
  'os-rs-k7-lb4-volumen-prisma': 'lb4-volumen-prisma',
  'os-rs-k7-lb4-mantel': 'k7-lb3-mantel-prisma',
  'os-rs-k7-lb4-oberflaeche': 'lb4-oberflaeche-quader',
  'os-rs-k7-lb4-vieleck-flaeche': 'lb4-flaeche-zusammengesetzt',
  'os-rs-k7-lb4-darstellen': 'lb4-wuerfelnetz',
  'os-rs-k7-lb3-ordnen': 'k7-lb2-betrag',
  'os-rs-k7-lb4-konstruieren': 'k7-lb1-mittelsenkrechte-schritte',

  // RS Klasse 8
  'os-rs-k8-lb1-term': 'k8-lb1-term-auswerten',
  'os-rs-k8-lb1-zusammenfassen': 'k8-lb1-zusammenfassen',
  'os-rs-k8-lb1-ausmult': 'k8-lb1-ausmultiplizieren',
  'os-rs-k8-lb1-gleichung': 'k8-lb1-gleichung-linear',
  'os-rs-k8-lb1-gleichung-beid': 'k8-lb1-gleichung-beidseitig',
  'os-rs-k8-lb2-funktionswert': 'k8-lb3-funktionswert',
  'os-rs-k8-lb2-steigung': 'k8-lb3-steigung',
  'os-rs-k8-lb2-achsen': 'k8-lb3-achsenabschnitt',
  'os-rs-k8-lb4-kongruenz': 'lb3-kongruenzsatz',
  'os-rs-k8-lb2-lgs': 'k8-lb3-lgs',
  'os-rs-k8-lb3-kreis-umfang': 'k9-lb2-kreis-umfang',
  'os-rs-k8-lb3-kreis-flaeche': 'k9-lb2-kreis-flaeche',
  'os-rs-k8-lb3-zylinder': 'k9-lb2-zylinder-volumen',
  'os-rs-k8-lb4-streckfaktor': 'k8-lb4-streckfaktor',
  'os-rs-k8-lb4-strahlensatz': 'k8-lb4-strahlensatz',
  'os-rs-k8-lb4-aehnlich': 'k8-lb4-aehnliche-seite',
  'os-rs-k8-lb5-laplace': 'k8-lb2-laplace-bruch',
  'os-rs-k8-lb5-gegen': 'k8-lb2-gegenwahrscheinlichkeit',
  'os-rs-k8-lb6-zinsen': 'k10-lb1-zinsen',
  'os-rs-k8-lb6-prozent': 'lb5-anteil-prozent',

  // RS Klasse 9
  'os-rs-k9-lb1-hyp': 'k9-lb3-pythagoras-hypotenuse',
  'os-rs-k9-lb1-kathete': 'k9-lb3-pythagoras-kathete',
  'os-rs-k9-lb1-trig': 'k9-lb3-trig-wert',
  'os-rs-k9-lb1-sach': 'k9-lb5-leiter',
  'os-rs-k9-lb2-pyramide': 'k7-lb3-volumen-pyramide',
  'os-rs-k9-lb2-zylinder': 'k9-lb2-zylinder-volumen',
  'os-rs-k9-lb2-kugel': 'k9-lb2-kugel-volumen',
  'os-rs-k9-lb2-zusammengesetzt': 'lb4-volumen-zusammengesetzt',
  'os-rs-k9-lb3-quadrat': 'k9-lb1-quadrat-wert',
  'os-rs-k9-lb3-scheitel': 'k9-lb1-scheitel',
  'os-rs-k9-lb3-gleichung': 'k10-lb4-quadratische-gleichung',
  'os-rs-k9-lb3-potenz-prod': 'k9-lb1-potenz-produkt',
  'os-rs-k9-lb3-potenz-quot': 'k9-lb1-potenz-quotient',
  'os-rs-k9-lb4-mittelwert': 'k9-lb4-mittelwert',
  'os-rs-k9-lb4-median': 'k9-lb4-median',
  'os-rs-k9-lb4-modal': 'k9-lb4-modalwert',
  'os-rs-k9-lb4-spannweite': 'k7-lb4-spannweite',

  // RS Klasse 10
  'os-rs-k10-lb1-hyp': 'k9-lb3-pythagoras-hypotenuse',
  'os-rs-k10-lb1-trig': 'k9-lb3-trig-wert',
  'os-rs-k10-lb1-winkelsumme': 'k7-lb1-winkelsumme-vieleck',
  'os-rs-k10-lb1-flaeche-dreieck': 'lb3-flaeche-dreieck',
  'os-rs-k10-lb2-quadrat': 'k9-lb1-quadrat-wert',
  'os-rs-k10-lb2-exp': 'k10-lb1-exp-wachstum',
  'os-rs-k10-lb2-zinseszins': 'k10-lb1-zinseszins',
  'os-rs-k10-lb2-zunahme': 'k10-lb1-prozentuale-zunahme',
  'os-rs-k10-lb3-erwartung': 'k10-lb2-erwartungswert',
  'os-rs-k10-lb3-laplace': 'k8-lb2-laplace-bruch',
  'os-rs-k10-lb4-zinsen': 'k10-lb1-zinsen',
  'os-rs-k10-lb4-pyramide': 'k7-lb3-volumen-pyramide',
  'os-rs-k10-lb4-kugel': 'k9-lb2-kugel-volumen',
  'os-rs-k10-lbw3-pythagoras': 'k9-lb3-pythagoras-hypotenuse',
  'os-rs-k10-lbw3-strahlensatz': 'k8-lb4-strahlensatz',
  'os-rs-k10-lbw3-trig': 'k9-lb3-trig-wert',

  // ——— Wahlbereiche verdichtet (K6–10) ———
  'os-k6-lbw1-dgs': 'lb3-achsensymmetrie',
  'os-k6-lbw1-konstruktion': 'lb3-achsensymmetrie',
  'os-k6-lbw1-messen': 'lb3-winkelarten',
  'os-k6-lbw2-spiele': 'lb1-multiplikation',
  'os-k6-lbw2-strategie': 'k8-lb5-probieren',
  'os-k6-lbw2-wuerfel': 'lb2-haeufigkeit',
  'os-k6-lbw3-diagramm': 'lb2-mittelwert',
  'os-hs-k7-lbw1-parkett': 'lb3-achsensymmetrie',
  'os-hs-k7-lbw1-spiegel': 'lb3-achsensymmetrie',
  'os-hs-k7-lbw1-verschieb': 'lb3-verschiebung',
  'os-hs-k7-lbw2-taeuschung': 'lb3-achsensymmetrie',
  'os-hs-k7-lbw2-perspektive': 'lb4-wuerfelnetz',
  'os-hs-k7-lbw2-messen': 'lb3-strecken-laenge',
  'os-hs-k7-lbw3-knobel': 'k8-lb5-zahlenraetsel',
  'os-hs-k7-lbw3-zahlen': 'k8-lb5-zahlenraetsel',
  'os-hs-k7-lbw3-logik': 'k8-lb5-probieren',
  'os-hs-k8-lbw1-fahrrad': 'k9-lb2-kreis-umfang',
  'os-hs-k8-lbw1-umfang': 'k9-lb2-kreis-umfang',
  'os-hs-k8-lbw1-tempo': 'k8-lb3-funktionswert',
  'os-hs-k8-lbw2-kredit': 'k10-lb1-zinsen',
  'os-hs-k8-lbw2-zinsen': 'k10-lb1-zinsen',
  'os-hs-k8-lbw2-raten': 'k10-lb1-zinseszins',
  'os-hs-k8-lbw3-modell': 'k8-lb4-streckfaktor',
  'os-hs-k8-lbw3-massstab': 'k8-lb4-streckfaktor',
  'os-hs-k8-lbw3-volumen': 'lb4-volumen-quader',
  'os-hs-k9-lb4-prozent': 'lb5-anteil-prozent',
  'os-hs-k9-lb4-vergleich': 'lb5-gesamtpreis',
  'os-hs-k9-lbw2-opt': 'k1112-lb8-extremwert',
  'os-hs-k9-lbw2-flaeche': 'k1112-lb8-extremwert',
  'os-hs-k9-lbw2-kosten': 'lb5-gesamtpreis',
  'os-hs-k9-lbw3-zeichnen': 'lb4-wuerfelnetz',
  'os-hs-k9-lbw3-mass': 'k8-lb4-streckfaktor',
  'os-hs-k9-lbw3-schnitt': 'lb4-wuerfelnetz',
  'os-rs-k7-lbw1-zeichnen': 'lb4-wuerfelnetz',
  'os-rs-k7-lbw1-schnitt': 'lb4-wuerfelnetz',
  'os-rs-k7-lbw1-mass': 'k8-lb4-streckfaktor',
  'os-rs-k7-lbw2-knobel': 'k8-lb5-zahlenraetsel',
  'os-rs-k7-lbw2-zahlen': 'k8-lb5-zahlenraetsel',
  'os-rs-k7-lbw2-logik': 'k8-lb5-probieren',
  'os-rs-k7-lbw3-parkett': 'lb3-achsensymmetrie',
  'os-rs-k7-lbw3-symmetrie': 'lb3-achsensymmetrie',
  'os-rs-k7-lbw3-fliese': 'lb4-flaeche-rechteck',
  'os-rs-k8-lbw1-fahrrad': 'k9-lb2-kreis-umfang',
  'os-rs-k8-lbw1-umfang': 'k9-lb2-kreis-umfang',
  'os-rs-k8-lbw1-tempo': 'k8-lb3-funktionswert',
  'os-rs-k8-lbw2-modell': 'k8-lb4-streckfaktor',
  'os-rs-k8-lbw2-massstab': 'k8-lb4-streckfaktor',
  'os-rs-k8-lbw2-volumen': 'lb4-volumen-quader',
  'os-rs-k8-lbw3-polyeder': 'lb4-wuerfelnetz',
  'os-rs-k8-lbw3-netz': 'lb4-wuerfelnetz',
  'os-rs-k8-lbw3-euler': 'lb4-wuerfelnetz',
  'os-rs-k9-lbw1-gold': 'k8-lb4-streckfaktor',
  'os-rs-k9-lbw1-rechteck': 'lb4-flaeche-rechteck',
  'os-rs-k9-lbw1-natur': 'k8-lb4-streckfaktor',
  'os-rs-k9-lbw2-laenge': 'k9-lb3-pythagoras-hypotenuse',
  'os-rs-k9-lbw2-schnitt': 'lb4-wuerfelnetz',
  'os-rs-k9-lbw2-netz': 'lb4-wuerfelnetz',
  'os-rs-k9-lbw3-sport': 'k9-lb4-mittelwert',
  'os-rs-k9-lbw3-tabelle': 'k9-lb4-median',
  'os-rs-k9-lbw3-statistik': 'k9-lb4-mittelwert',
  'os-rs-k10-lbw1-dgs': 'lb3-achsensymmetrie',
  'os-rs-k10-lbw1-ort': 'lb3-achsensymmetrie',
  'os-rs-k10-lbw1-makro': 'lb3-achsensymmetrie',
  'os-rs-k10-lbw2-opt': 'k1112-lb8-extremwert',
  'os-rs-k10-lbw2-flaeche': 'k1112-lb8-extremwert',
  'os-rs-k10-lbw2-kosten': 'lb5-gesamtpreis',

  // ——— Ehemals outline-only: Lehrplan-Themen → nächster Gym-Generator (+ Thin-Fill) ———
  'os-k5-lb1-quadrat': 'lb1-potenzieren',
  'os-k5-lb2-vergleichen': 'lb1-vergleichen',
  'os-k5-lb2-prozent': 'lb1-prozent',
  'os-k5-lb3-lage': 'lb3-koordinaten-ablesen',
  'os-k6-lb1-erweiterung': 'lb1-erweitern',
  'os-k6-lb1-verhaeltnis': 'lb2-proportional',
  'os-k6-lb2-arten': 'lb2-proportional',
  'os-k6-lb2-darstellung': 'lb2-grafische-brueche',
  'os-k6-lb3-einteilung': 'lb3-winkelarten',
  'os-k6-lb3-parallelogramm': 'lb3-flaeche-dreieck',
  'os-k6-lb5-probieren': 'k8-lb5-probieren',
  'os-k6-lb5-praesentation': 'lb2-mittelwert',
  'os-hs-k7-lb1-modelle': 'lb4-volumen-zusammengesetzt',
  'os-hs-k7-lb2-vergleich': 'lb5-anteil-prozent',
  'os-hs-k7-lb2-begriffe': 'lb5-anteil-prozent',
  'os-hs-k8-lb1-skonto': 'k10-lb1-prozentuale-zunahme',
  'os-hs-k8-lb1-diagramme': 'lb2-grafische-brueche',
  'os-hs-k8-lb2-struktur': 'k8-lb1-zusammenfassen',
  'os-hs-k8-lb2-formelsammlung': 'k8-lb1-term-auswerten',
  'os-hs-k8-lb3-kreisring': 'k9-lb2-kreis-flaeche',
  'os-hs-k8-lb3-lage': 'lb3-koordinaten-ablesen',
  'os-hs-k8-lb4-darstellen': 'lb4-wuerfelnetz',
  'os-hs-k8-lb4-oberflaeche': 'lb4-oberflaeche-quader',
  'os-hs-k8-lb5-haushalt': 'lb5-gesamtpreis',
  'os-hs-k9-lb1-umkehrung': 'k9-lb3-pythagoras-kathete',
  'os-hs-k9-lb2-darstellen': 'lb4-wuerfelnetz',
  'os-hs-k9-lb2-kegel': 'k7-lb3-volumen-pyramide',
  'os-hs-k9-lb2-masse': 'k5-umrechnen-masse',
  'os-hs-k9-lb3-funktion': 'k8-lb3-funktionswert',
  'os-hs-k9-lb3-schnitt': 'k8-lb3-achsenabschnitt',
  'os-hs-k9-lb4-kalkulation': 'lb5-gesamtpreis',
  'os-rs-k7-lb2-versuch': 'lb2-haeufigkeit',
  'os-rs-k7-lb4-masse': 'k5-umrechnen-masse',
  'os-rs-k8-lb1-ausklammern': 'k8-lb1-zusammenfassen',
  'os-rs-k8-lb1-formel': 'k8-lb1-term-auswerten',
  'os-rs-k8-lb2-funktion': 'k8-lb3-funktionswert',
  'os-rs-k8-lb2-nullstelle': 'k1112-lb1-nullstelle-linear',
  'os-rs-k8-lb3-lage': 'lb3-koordinaten-ablesen',
  'os-rs-k8-lb3-darstellen': 'lb4-wuerfelnetz',
  'os-rs-k8-lb5-simulation': 'k8-lb2-laplace-bruch',
  'os-rs-k8-lb5-baum': 'k8-lb2-laplace-bruch',
  'os-rs-k8-lb6-kosten': 'lb5-gesamtpreis',
  'os-rs-k9-lb1-umkehrung': 'k9-lb3-pythagoras-kathete',
  'os-rs-k9-lb2-darstellen': 'lb4-wuerfelnetz',
  'os-rs-k9-lb2-kegel': 'k7-lb3-volumen-pyramide',
  'os-rs-k9-lb3-nullstellen': 'k10-lb4-quadratische-gleichung',
  'os-rs-k9-lb3-fall': 'k10-lb4-parabel-wert',
  'os-rs-k9-lb4-medien': 'k9-lb4-mittelwert',
  'os-rs-k10-lb1-system': 'k8-lb3-lgs',
  'os-rs-k10-lb2-potenz': 'k9-lb1-potenz-produkt',
  'os-rs-k10-lb2-sinus': 'k10-lb1-sinus-wert',
  'os-rs-k10-lb3-zufall': 'k8-lb2-laplace-bruch',
  'os-rs-k10-lb3-simulation': 'k10-lb2-erwartungswert',
  'os-rs-k10-lb4-wirtschaft': 'k10-lb1-zinsen',
  'os-rs-k10-lb4-erwartung': 'k10-lb2-erwartungswert',
}

let catalog: Map<string, Topic['generate']> | null = null

export async function gymGeneratorCatalog(): Promise<Map<string, Topic['generate']>> {
  if (catalog) return catalog
  const next = new Map<string, Topic['generate']>()
  for (const mod of bundledCurricula) {
    const grade = await mod.load()
    for (const area of grade.areas) {
      for (const topic of area.topics) {
        if (!next.has(topic.id)) {
          next.set(topic.id, withMathGymThinFill(topic.id, topic.generate) ?? topic.generate)
        }
      }
    }
  }
  catalog = next
  return next
}

export function generatorIdForTopic(topicId: string): string | undefined {
  return OS_GENERATOR_MAP[topicId] ?? ST_GENERATOR_MAP[topicId] ?? SKS_GENERATOR_MAP[topicId]
}

/** Resolve a playable OS/ST/SKS topic generator (custom wrapper or Gymnasium map). */
export function resolveOsGenerate(
  topicId: string,
  gymCatalog: Map<string, Topic['generate']>,
): Topic['generate'] | undefined {
  const custom = OS_CUSTOM_GENERATORS[topicId]
  if (custom) return withMathOsThinFill(topicId, custom)
  const mapped =
    OS_GENERATOR_MAP[topicId] ?? ST_GENERATOR_MAP[topicId] ?? SKS_GENERATOR_MAP[topicId]
  const base = mapped ? gymCatalog.get(mapped) : undefined
  return withMathOsThinFill(topicId, base)
}

export function isPlayableOfficialTopic(topicId: string): boolean {
  return Boolean(
    OS_CUSTOM_GENERATORS[topicId] ||
      OS_GENERATOR_MAP[topicId] ||
      ST_GENERATOR_MAP[topicId] ||
      SKS_GENERATOR_MAP[topicId] ||
      withMathOsThinFill(topicId, undefined),
  )
}

export function outlineGenerate(title: string): Topic['generate'] {
  return () =>
    textTask({
      question: `Für „${title}“ gibt es noch keine Übungsaufgaben.`,
      accepted: ['ok', '—', '-'],
      solution: 'ok',
      explanation:
        'Dieses Thema steht im offiziellen Lehrplan, ist aber noch nicht als Aufgabengenerator hinterlegt.',
    })
}

export function topicFromPack(
  topic: PackTopic,
  generate: Topic['generate'] | undefined,
  opts?: { subject?: string },
): Topic {
  const playable = Boolean(generate)
  return ensureTopicFachwissen(
    {
      id: topic.id,
      title: topic.title,
      hint: topic.hint,
      pointsPerTask: topic.pointsPerTask,
      keywords: topic.keywords,
      source: 'official',
      outlineOnly: playable ? undefined : true,
      released: topic.released ?? true,
      contentId: topicContentId(topic.id),
      ...(topic.tasksPerRound ? { tasksPerRound: topic.tasksPerRound } : {}),
      ...(topic.excludeFachwissen ? { excludeFachwissen: true } : {}),
      generate: generate ?? outlineGenerate(topic.title),
    },
    { subject: opts?.subject },
  )
}
