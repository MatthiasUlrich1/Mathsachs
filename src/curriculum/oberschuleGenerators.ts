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
import { blendGenerators } from './mergeNeu'
import {
  DEFAULT_DIFFICULTY,
  isQualifiedRef,
  normalizeMapping,
  qualifyRef,
  type PackTopicMapping,
  type SourceRef,
} from './packMapping'
import { ST_GENERATOR_MAP, ST_TOPIC_MAPPINGS } from './gymSachsenAnhaltPack'
import { SKS_GENERATOR_MAP, SKS_TOPIC_MAPPINGS } from './sekundarschuleSachsenAnhaltPack'
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
import { isNeuTopic, isPlaceholderNeuTopic } from './placeholderNeuIds'
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
const osPrismNetzWahl = (rng: Rng) => {
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

/** Prismen-Netz zählen: Flächen, Rechtecke (Mantel) oder Kanten eines n-seitigen Prismas. */
const osPrismNetzZaehlen = (rng: Rng) => {
  const n = randInt(rng, 3, 8)
  const kind = randInt(rng, 0, 2)
  const [what, value, how] =
    kind === 0
      ? ['Flächen hat das Netz insgesamt', n + 2, `${n} Rechtecke (Mantel) und 2 Grundflächen`]
      : kind === 1
        ? ['Rechtecke gehören zum Mantel im Netz', n, 'eine Mantelfläche je Seite der Grundfläche']
        : ['Kanten hat der gefaltete Körper', 3 * n, `${n} Kanten je Grundfläche und ${n} Seitenkanten`]
  return textTask({
    question: `Ein Prisma hat als Grundfläche ein ${n}-Eck. Wie viele ${what}?`,
    accepted: [String(value)],
    solution: String(value),
    explanation: `${how}: ${value}.`,
  })
}

/** Prismen-Netze: Netz erkennen oder Netz-Bestandteile zählen (Rundenpool > 10). */
const osPrismNetz: Topic['generate'] = mixedVariants(osPrismNetzWahl, osPrismNetzZaehlen, osPrismNetzZaehlen)

/**
 * OS-specific generators that adapt Gymnasium tasks (ranges / variants)
 * without changing the Gym curriculum.
 */
export const OS_CUSTOM_GENERATORS: Record<string, Topic['generate']> = {
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

/**
 * Oberschule: String-Map (1:1) ist durch `OS_TOPIC_MAPPINGS` abgelöst (E5b) und bleibt leer.
 * Themen ohne Eintrag dort laufen über `OS_CUSTOM_GENERATORS` oder sind Outline.
 */
export const OS_GENERATOR_MAP: Record<string, string> = {}

/** Metadaten eines Master-Themas im Katalog. */
export interface CatalogEntryMeta {
  /** Kanonischer Schlüssel `<moduleId>:<topicId>`. */
  key: string
  moduleId: string
  topicId: string
  difficulty?: 1 | 2 | 3
}

let catalog: Map<string, Topic['generate']> | null = null
const catalogMeta = new Map<string, CatalogEntryMeta>()
/** Einfache Master-ID → alle qualifizierten Schlüssel, nur bei Mehrfachvorkommen. */
const catalogAmbiguous = new Map<string, string[]>()

/**
 * Master-Katalog. Schlüssel: immer `<moduleId>:<topicId>` (eindeutig) und zusätzlich
 * die einfache `topicId` (bei Mehrfachvorkommen das ERSTE, wie bisher — Bestands-IDs
 * werden nicht umbenannt). Mehrdeutige einfache IDs: `ambiguousCatalogIds()`.
 */
export async function gymGeneratorCatalog(): Promise<Map<string, Topic['generate']>> {
  if (catalog) return catalog
  const next = new Map<string, Topic['generate']>()
  const seen = new Map<string, string[]>()
  for (const mod of bundledCurricula) {
    const grade = await mod.load()
    for (const area of grade.areas) {
      for (const topic of area.topics) {
        const key = qualifyRef(mod.id, topic.id)
        next.set(key, topic.generate)
        catalogMeta.set(key, {
          key,
          moduleId: mod.id,
          topicId: topic.id,
          difficulty: topic.difficulty,
        })
        if (!next.has(topic.id)) next.set(topic.id, topic.generate)
        const keys = seen.get(topic.id) ?? []
        keys.push(key)
        seen.set(topic.id, keys)
      }
    }
  }
  for (const [id, keys] of seen) if (keys.length > 1) catalogAmbiguous.set(id, keys)
  catalog = next
  return next
}

/** Einfache Master-IDs, die in mehreren Klassen existieren (Mapping muss qualifizieren). */
export function ambiguousCatalogIds(): ReadonlyMap<string, readonly string[]> {
  return catalogAmbiguous
}

/** Metadaten zu einer (einfachen oder qualifizierten) Quelle; nur nach `gymGeneratorCatalog()`. */
export function catalogEntryMeta(ref: SourceRef): CatalogEntryMeta | undefined {
  if (isQualifiedRef(ref)) return catalogMeta.get(ref)
  const keys = catalogAmbiguous.get(ref)
  if (keys) return catalogMeta.get(keys[0]!)
  for (const meta of catalogMeta.values()) if (meta.topicId === ref) return meta
  return undefined
}

/** Neue Mappings (1:n). Haben Vorrang vor den String-Maps; E5 füllt sie. */
export const OS_TOPIC_MAPPINGS: Record<string, PackTopicMapping> = {
  'os-k5-lb1-runden': {
    sources: ['lb1-runden-natuerlich'],
    maxDifficulty: 2,
    note: "1:1 Rundenübung natürlicher Zahlen",
  },
  'os-k5-lb1-potenz': {
    sources: ['lb1-potenzieren'],
    maxDifficulty: 2,
    note: "Quadrat- und Zehnerpotenzen; deckt os-k5-lb1-quadrat inhaltlich mit ab",
  },
  'os-k5-lb1-addition': {
    sources: ['lb1-addition'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k5-lb1-subtraktion': {
    sources: ['lb1-subtraktion'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k5-lb1-multiplikation': {
    sources: ['lb1-multiplikation', 'lb1-schriftliches-rechnen'],
    maxDifficulty: 2,
    note: "LP: mündlich/halbschriftlich/schriftlich multiplizieren; schriftliches Rechnen (Kästchenpapier) ergänzt (neu)",
  },
  'os-k5-lb1-division': {
    sources: ['lb1-schriftliche-division', 'lb1-division-rest'],
    maxDifficulty: 2,
    note: "LP: schriftliche Division durch einstelligen Divisor; Rest-Variante ergänzt (neu)",
  },
  'os-k5-lb1-gleichung': {
    sources: ['k7-lb2-gleichung-add'],
    maxDifficulty: 2,
    note: "K7-Master (x + a = b, difficulty 1) für inhaltliches Lösen einfacher Gleichungen; bleibt",
  },
  'os-k5-lb1-teilbarkeit': {
    sources: ['lb1-teilbarkeit'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k5-lb1-primzahl': {
    sources: ['lb1-primzahl'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k5-lb2-anteil': {
    sources: ['lb2-anteil-bruch', 'lb2-grafische-brueche'],
    maxDifficulty: 2,
    note: "LP: Erkennen und Darstellen gemeiner Brüche; lb2-anteil-bruch neu hier (war HS-K7, dort Dublette)",
  },
  'os-k5-lb2-kuerzen': {
    sources: ['lb2-kuerzen'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k5-lb2-erweitern': {
    sources: ['lb2-erweitern'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k5-lb2-runden-dez': {
    sources: ['lb2-runden-dezimal'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k5-lb2-dez-add-sub': {
    sources: ['lb2-dez-add-sub'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k5-lb2-dez-mult': {
    sources: ['lb2-dez-mult'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k5-lb2-dez-div': {
    sources: ['lb2-dez-div'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k5-lb2-mittelwert': {
    sources: ['lb2-mittelwert'],
    maxDifficulty: 2,
    note: "K5-Master; K6 nutzt den K7-Master k7-lb4-mittelwert (kein Doppelt im Pack)",
  },
  'os-k5-lb2-laenge': {
    sources: ['k5-umrechnen-laenge', 'lb2-ordnen-einheiten'],
    maxDifficulty: 2,
    note: "k5-umrechnen-laenge existiert nur als Neu-Aufgabenbank (Waise, siehe Coverage); Größen ordnen ergänzt",
  },
  'os-k5-lb2-masse': {
    sources: ['k5-umrechnen-masse'],
    maxDifficulty: 2,
    note: "Neu-Waise (kein Parent in math5.ts)",
  },
  'os-k5-lb2-zeit': {
    sources: ['k5-umrechnen-zeit'],
    maxDifficulty: 2,
    note: "Neu-Waise (kein Parent in math5.ts)",
  },
  'os-k5-lb3-lage': {
    sources: ['lb3-strecken-bezeichnung'],
    maxDifficulty: 2,
    note: "LP K5 LB3: parallel/senkrecht/schneiden; Strecke/Gerade/Halbgerade als nächste Quelle (neu)",
  },
  'os-k5-lb3-winkelarten': {
    sources: ['lb3-winkelarten'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k5-lb3-winkel-erg': {
    sources: ['lb3-winkel-ergaenzung'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k5-lb3-wuerfel': {
    sources: ['lb4-wuerfelnetz'],
    maxDifficulty: 2,
    note: "math6-ID, inhaltlich K5 (Würfelnetz); K6-Darstellen bleibt custom",
  },
  'os-k5-lb3-umfang': {
    sources: ['lb4-umfang-rechteck', 'lb4-umfang-zusammengesetzt'],
    maxDifficulty: 2,
    note: "LP K5 LB3: Umfang/Fläche an in Rechtecke zerlegbaren Figuren",
  },
  'os-k5-lb3-flaeche': {
    sources: ['lb4-flaeche-rechteck', 'lb4-flaeche-zusammengesetzt', 'lb5-sachaufgabe-flaeche'],
    maxDifficulty: 2,
    note: "LP K5 LB3: Zerlegen/Ergänzen; Sachaufgabe Fläche/Umfang ergänzt",
  },
  'os-k5-lb3-flaeche-eh': {
    sources: ['k5-umrechnen-flaeche'],
    maxDifficulty: 2,
    note: "Neu-Waise (kein Parent in math5.ts)",
  },
  'os-k5-lb3-oberflaeche': {
    sources: ['mathematik-klasse-5:lb4-oberflaeche-quader'],
    maxDifficulty: 2,
    note: "K5-Quelle klassenqualifiziert (ID-Kollision math5/math6, D24); K6 nutzt die K6-Quelle",
  },
  'os-k5-lb3-volumen-wuerfel': {
    sources: ['mathematik-klasse-5:lb4-volumen-quader'],
    maxDifficulty: 2,
    note: "K5-Quelle klassenqualifiziert (ID-Kollision math5/math6, D24); K6 nutzt die K6-Quelle",
  },
  'os-k5-lb3-volumen-eh': {
    sources: ['k5-umrechnen-volumen'],
    maxDifficulty: 2,
    note: "Neu-Waise (kein Parent in math5.ts)",
  },
  'os-k5-lb4-spiegelung': {
    sources: ['lb3-achsensymmetrie'],
    maxDifficulty: 2,
    note: "1:1 (Geradenspiegelung/Symmetrieachse)",
  },
  'os-k5-lb4-verschiebungsweite': {
    sources: ['lb3-verschiebung'],
    maxDifficulty: 2,
    note: "LP K5 LB4: Verschiebungsrichtung/-weite (neu)",
  },
  'os-k5-lbw3-angebote': {
    sources: ['lb5-gesamtpreis'],
    maxDifficulty: 2,
    note: "Wahlbereich Klassenfahrt: Gesamtpreis/Angebote (neu)",
  },
  'os-k5-lbw3-budget': {
    sources: ['lb5-mehrstufig', 'lb5-teilen'],
    maxDifficulty: 2,
    note: "Budget und Stückkosten (neu)",
  },
  'os-k6-lb1-zahlenstrahl': {
    sources: ['lb2-zahlenstrahl'],
    maxDifficulty: 2,
    note: "LP K6 LB1: Veranschaulichen am Zahlenstrahl (neu)",
  },
  'os-k6-lb1-kuerzen': {
    sources: ['lb1-kuerzen'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k6-lb1-erweitern': {
    sources: ['lb1-erweitern'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k6-lb1-bruch-dez': {
    sources: ['lb1-bruch-dezimal'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k6-lb1-vergleichen': {
    sources: ['lb1-vergleichen'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k6-lb1-add-sub': {
    sources: ['lb1-add-sub-brueche'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k6-lb1-mult': {
    sources: ['lb1-mult-brueche'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k6-lb1-div': {
    sources: ['lb1-div-brueche'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k6-lb1-dez-add-sub': {
    sources: ['lb1-dez-add-sub'],
    maxDifficulty: 2,
    note: "1:1 (math6-ID, distinkt von K5 lb2-dez-add-sub)",
  },
  'os-k6-lb1-dez-mult': {
    sources: ['lb1-dez-mult'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k6-lb1-dez-div': {
    sources: ['lb1-dez-div'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k6-lb1-runden': {
    sources: ['lb1-runden'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k6-lb1-mittelwert': {
    sources: ['k7-lb4-mittelwert'],
    maxDifficulty: 2,
    note: "LP K6 LB1: arithmetisches Mittel; K7-Master, damit lb2-mittelwert nur in K5 liegt",
  },
  'os-k6-lb2-prop': {
    sources: ['lb2-proportional'],
    maxDifficulty: 2,
    note: "1:1 Dreisatz direkt",
  },
  'os-k6-lb2-antiprop': {
    sources: ['lb2-antiproportional'],
    maxDifficulty: 2,
    note: "1:1 Dreisatz indirekt",
  },
  'os-k6-lb2-anteil': {
    sources: ['lb1-sachaufgabe-bruch'],
    maxDifficulty: 2,
    note: "Titel nicht im LP K6 LB2 (D6); Bruchteil-Sachaufgaben als Ersatzquelle, lb5-anteil-groesse geht nach K7",
  },
  'os-k6-lb3-nebenwinkel': {
    sources: ['k7-lb1-nebenwinkel'],
    maxDifficulty: 2,
    note: "LP K6 LB3: Nebenwinkelsatz (K7-Master)",
  },
  'os-k6-lb3-scheitel': {
    sources: ['k7-lb1-scheitelwinkel'],
    maxDifficulty: 2,
    note: "LP K6 LB3: Scheitel-/Stufen-/Wechselwinkel (K7-Master)",
  },
  'os-k6-lb3-innenwinkel': {
    sources: ['lb3-winkel-dreieck'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k6-lb3-einteilung': {
    sources: ['k7-lb1-basiswinkel'],
    maxDifficulty: 2,
    note: "Dreiecke nach Seiten und Winkeln; Basiswinkel gleichschenklig als Näherung (neu)",
  },
  'os-k6-lb3-kongruenz': {
    sources: ['lb3-kongruenzsatz'],
    maxDifficulty: 2,
    note: "1:1; RS-K8 Kongruenz bekommt keine zweite Quelle",
  },
  'os-k6-lb3-flaeche-dreieck': {
    sources: ['lb3-flaeche-dreieck'],
    maxDifficulty: 2,
    note: "1:1; K7/K10 ohne Doppelung",
  },
  'os-k6-lb3-umfang': {
    sources: ['lb3-umfang-rechteck', 'lb3-sachaufgabe-geometrie'],
    maxDifficulty: 2,
    note: "Umfang; Sachaufgabe Fläche/Umfang ergänzt (neu)",
  },
  'os-k6-lb3-flaeche-rechteck': {
    sources: ['lb3-flaeche-rechteck'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k6-lb3-winkelsumme-viereck': {
    sources: ['lb3-winkel-viereck'],
    maxDifficulty: 2,
    note: "1:1; im LP K6 LB3 nicht ausdrücklich genannt, Gym-Quelle belassen",
  },
  'os-k6-lb4-oberflaeche': {
    sources: ['mathematik-klasse-6:lb4-oberflaeche-quader', 'lb4-flaeche-kante-quader'],
    maxDifficulty: 2,
    note: "K6-Quelle klassenqualifiziert (D24 aufgelöst); lb4-flaeche-kante-quader bleibt als zweite Quelle (Fläche/Seitenlänge am Quader)",
  },
  'os-k6-lb4-volumen-prisma': {
    sources: ['lb4-volumen-prisma'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-k6-lb5-haeufigkeit': {
    sources: ['lb2-haeufigkeit'],
    maxDifficulty: 2,
    note: "LP K6 LB5: absolute/relative Häufigkeit",
  },
  'os-k6-lbw1-konstruktion': {
    sources: ['lb3-strecken-mittelpunkt'],
    maxDifficulty: 2,
    note: "Wahlbereich DGS: Streckenmittelpunkt/Grundkonstruktion (neu)",
  },
  'os-k6-lbw1-messen': {
    sources: ['lb3-strecken-laenge'],
    maxDifficulty: 2,
    note: "Wahlbereich DGS: Längen messen (neu)",
  },
  'os-hs-k7-lb1-flaeche': {
    sources: ['lb4-flaeche-zusammengesetzt'],
    maxDifficulty: 2,
    allowRepeat: true,
    note: "LP HS Kl. 7 LB 1 (Überarbeitung): Wiederholen und Vernetzen der Klassenstufen 5 und 6 -> dokumentierte Wiederholung von lb4-flaeche-zusammengesetzt (K5)",
  },
  'os-hs-k7-lb1-volumen': {
    sources: ['lb4-volumen-zusammengesetzt', 'mathematik-klasse-5:lb4-volumen-quader'],
    maxDifficulty: 2,
    allowRepeat: true,
    note: "LP HS Kl. 7 LB 1 (Überarbeitung): Wiederholen und Vernetzen der Klassenstufen 5 und 6 -> dokumentierte Wiederholung (Volumen von Quader und Würfel aus K5 als zweite Quelle, K9-Zusammengesetzt entfällt im HS-Pack)",
  },
  'os-hs-k7-lb2-anteil-bruch': {
    sources: ['lb1-prozent'],
    maxDifficulty: 2,
    note: "Anteile als Prozent (K6-Master \"In Prozent umwandeln\"); K5-Prozenteinblick bleibt ohne Master",
  },
  'os-hs-k7-lb2-anteil-groesse': {
    sources: ['lb5-anteil-groesse'],
    maxDifficulty: 2,
    note: "Anteil/Prozentwert einer Größe",
  },
  'os-hs-k7-lb2-prozent': {
    sources: ['lb5-anteil-prozent'],
    maxDifficulty: 2,
    note: "Grundaufgaben der Prozentrechnung (LP K7 LB2); aus K6 nach K7 verlagert (D5)",
  },
  'os-hs-k7-lb2-dreisatz': {
    sources: ['lb2-sachaufgabe-dreisatz'],
    maxDifficulty: 2,
    note: "Dreisatz in Sachaufgaben; lb2-proportional bleibt in K6",
  },
  'os-hs-k7-lb2-haeufigkeit': {
    sources: ['k7-lb4-rel-haeufigkeit'],
    maxDifficulty: 2,
    note: "K7-Master relative Häufigkeit; lb2-haeufigkeit bleibt in K6",
  },
  'os-hs-k7-lb2-chancen': {
    sources: ['k8-lb2-laplace-bruch'],
    maxDifficulty: 2,
    note: "LP HS K7 LB2: gleichwahrscheinliche Ergebnisse, Chancen abschätzen; nur einfache Laplace-Variante (neu, difficulty 1)",
  },
  'os-hs-k7-lb3-zahlengerade': {
    sources: ['k7-lb2-betrag'],
    maxDifficulty: 2,
    note: "Symmetrie zur Null auf der Zahlengeraden (Betrag); bleibt",
  },
  'os-hs-k7-lb3-add': {
    sources: ['k7-lb2-add-rational'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-hs-k7-lb3-sub': {
    sources: ['k7-lb2-sub-rational'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-hs-k7-lb3-mul': {
    sources: ['k7-lb2-mul-rational'],
    maxDifficulty: 1,
    note: "LP HS: Vervielfachen mit nat. Zahl; Multiplizieren rationaler Zahlen nur Differenzierung -> maxDifficulty 1 (D11)",
  },
  'os-hs-k7-lb3-div': {
    sources: ['k7-lb2-div-rational'],
    maxDifficulty: 1,
    note: "LP HS: Teilen durch nat. Zahl; allgemeines Dividieren nur Differenzierung -> maxDifficulty 1 (D11)",
  },
  'os-hs-k7-lb3-term': {
    sources: ['k7-lb2-term-vorrang'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-hs-k7-lb3-gleichung': {
    sources: ['k7-lb2-gleichung-mul', 'k8-lb5-zahlenraetsel'],
    maxDifficulty: 2,
    note: "LP: einfache Gleichungen und Zahlenrätsel; gleichung-add liegt in K5; Zahlenrätsel (diff 2) einbezogen",
  },
  'os-hs-k7-lb3-koordinaten': {
    sources: ['lb3-koordinaten-eintragen', 'lb3-koordinaten-ablesen'],
    maxDifficulty: 2,
    includeCustom: true,
    note: "Custom osQ1CoordinatePlace (nur 1. Quadrant) wird mit den Master-Themen (4 Quadranten) gemischt, weil der LP \"Verwenden von vier Quadranten\" verlangt (D10; HS Kl. 7 LB 3 S. 19-20, RS Kl. 7 LB 3 S. 29-30)",
  },
  'os-hs-k7-lb4-konstruieren': {
    sources: ['k7-lb1-mittelsenkrechte-schritte'],
    maxDifficulty: 2,
    note: "Konstruktionsschritte; bleibt",
  },
  'os-hs-k7-lb4-volumen-prisma': {
    sources: ['k7-lb3-volumen-prisma'],
    maxDifficulty: 2,
    note: "K7-Master (vorher K6-Quelle, Dublette)",
  },
  'os-hs-k7-lb4-mantel': {
    sources: ['k7-lb3-mantel-prisma'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-hs-k7-lb4-oberflaeche': {
    sources: ['k7-lb3-oberflaeche-quader'],
    maxDifficulty: 2,
    note: "K7-Master (vorher K5/K6-Quelle, Dublette)",
  },
  'os-hs-k8-lb1-zinsen': {
    sources: ['k10-lb1-zinsen'],
    maxDifficulty: 2,
    note: "Kapital/Zinssatz/Jahreszins (LP K8 LB1)",
  },
  'os-hs-k8-lb1-zinseszins': {
    sources: ['k10-lb1-zinseszins'],
    maxDifficulty: 2,
    note: "LP: Zinseszins nur Differenzierungshinweis (D14); difficulty 2 reicht",
  },
  'os-hs-k8-lb1-preisaenderung': {
    sources: ['k10-lb1-prozentuale-zunahme'],
    maxDifficulty: 2,
    note: "Preiserhöhung/-senkung",
  },
  'os-hs-k8-lb2-struktur': {
    sources: ['k8-lb5-rueckwaerts'],
    maxDifficulty: 2,
    note: "Umstellen von Formeln ~ Rückwärtsrechnen (neu)",
  },
  'os-hs-k8-lb2-term': {
    sources: ['k8-lb1-term-auswerten'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-hs-k8-lb2-zusammenfassen': {
    sources: ['k8-lb1-zusammenfassen'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-hs-k8-lb2-gleichung': {
    sources: ['k8-lb1-gleichung-linear'],
    maxDifficulty: 1,
    note: "LP HS: kalkülmäßiges Lösen nur Differenzierung -> maxDifficulty 1",
  },
  'os-hs-k8-lb3-vieleck': {
    sources: ['lb3-punktsymmetrie'],
    maxDifficulty: 2,
    note: "Drehsymmetrie regelmäßiger Vielecke ~ Punktsymmetrie (K5-Master, neu); vorher Dublette lb3-achsensymmetrie",
  },
  'os-hs-k8-lb3-winkelsumme': {
    sources: ['k7-lb1-winkelsumme-vieleck'],
    maxDifficulty: 2,
    note: "LP HS K8 LB3: Innenwinkelsumme regelmäßiger Vielecke (Heimat des Masters, K7 entfällt, D9)",
  },
  'os-hs-k8-lb3-kreis-umfang': {
    sources: ['k9-lb2-kreis-umfang'],
    maxDifficulty: 2,
    note: "1:1 (K9-Master, LP K8)",
  },
  'os-hs-k8-lb3-kreis-flaeche': {
    sources: ['k9-lb2-kreis-flaeche'],
    maxDifficulty: 2,
    note: "1:1 (K9-Master, LP K8)",
  },
  'os-hs-k8-lb4-zylinder': {
    sources: ['k9-lb2-zylinder-volumen'],
    maxDifficulty: 2,
    note: "Heimat des Masters ist HS K8 LB4; K9-Zylinder entfällt (D16)",
  },
  'os-hs-k8-lb5-zinsen': {
    sources: ['k10-lb5-kapital', 'k10-lb5-zinssatz'],
    maxDifficulty: 2,
    note: "Kapital/Zinssatz bestimmen (neu, vorher Dublette k10-lb1-zinsen)",
  },
  'os-hs-k8-lb5-streckfaktor': {
    sources: ['k8-lb4-streckfaktor'],
    maxDifficulty: 2,
    note: "Maßstäbliches Darstellen; Ähnlichkeit nur Differenzierung",
  },
  'os-hs-k8-lbw3-modell': {
    sources: ['k8-lb4-aehnliche-seite'],
    maxDifficulty: 2,
    note: "Maßstab/Modellbau (neu); Strahlensatz nicht HS",
  },
  'os-hs-k9-lb1-hyp': {
    sources: ['k9-lb3-pythagoras-hypotenuse'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-hs-k9-lb1-kathete': {
    sources: ['k9-lb3-pythagoras-kathete'],
    maxDifficulty: 2,
    note: "1:1",
  },
  'os-hs-k9-lb1-sinus': {
    sources: ['k9-lb3-trig-wert'],
    maxDifficulty: 2,
    note: "Bekannte Abweichung D12: LP HS Kl. 9 LB 1 verlangt nur Sinus; k9-lb3-trig-wert mischt Sinus/Kosinus/Tangens (kein reines Sinus-Master; Variantenfilter zurückgestellt)",
  },
  'os-hs-k9-lb1-sach': {
    sources: ['k9-lb5-leiter'],
    maxDifficulty: 2,
    note: "Sachaufgaben Pythagoras",
  },
  'os-hs-k9-lb2-pyramide': {
    sources: ['k7-lb3-volumen-pyramide', 'k7-lb3-oberflaeche-pyramide'],
    maxDifficulty: 2,
    note: "LP HS K9 LB2: Mantel-/Oberfläche und Volumen bei quadratischer Grundfläche (Oberfläche neu)",
  },
  'os-hs-k9-lb3-quadrat': {
    sources: ['k9-lb1-quadrat-wert'],
    maxDifficulty: 2,
    note: "LP: nur Einblick y=x² bzw. y=a·x²; difficulty 2, nur Variante ohne Scheitelform (D13)",
  },
  'os-hs-k9-lb4-mittelwert': {
    sources: ['k9-lb4-mittelwert'],
    maxDifficulty: 2,
    note: "Auswerten von Daten",
  },
  'os-hs-k9-lbw1-median': {
    sources: ['k9-lb4-median'],
    maxDifficulty: 2,
    note: "Wahlbereich Statistische Erhebungen",
  },
  'os-hs-k9-lbw1-modal': {
    sources: ['k9-lb4-modalwert'],
    maxDifficulty: 2,
    note: "Wahlbereich Statistische Erhebungen (K6-Modal entfällt)",
  },
  'os-hs-k9-lbw1-spannweite': {
    sources: ['k7-lb4-spannweite'],
    maxDifficulty: 2,
    note: "Wahlbereich Statistische Erhebungen",
  },
  'os-rs-k7-lb1-dreisatz': {
    sources: ['lb2-sachaufgabe-dreisatz', 'lb5-anteil-groesse'],
    maxDifficulty: 3,
    note: "LP RS K7 LB1: Dreisatz auf Grundaufgaben der Prozentrechnung",
  },
  'os-rs-k7-lb1-prozent': {
    sources: ['lb1-prozent', 'lb5-anteil-prozent'],
    maxDifficulty: 3,
    note: "Bequeme Prozentsätze, Grundaufgaben; aus K5/K6 verlagert (D5)",
  },
  'os-rs-k7-lb1-preisaenderung': {
    sources: ['k10-lb1-prozentuale-zunahme'],
    maxDifficulty: 3,
    note: "Preiserhöhung/-senkung",
  },
  'os-rs-k7-lb1-zinsen': {
    sources: ['k10-lb1-zinsen'],
    maxDifficulty: 3,
    note: "Zinssatz, Zinsen, Kapital",
  },
  'os-rs-k7-lb1-zinseszins': {
    sources: ['k10-lb1-zinseszins'],
    maxDifficulty: 3,
    note: "LP RS K7 LB1: Tageszins, Zinseszins ausdrücklich (Heimat; K10-Doppelung entfällt)",
  },
  'os-rs-k7-lb2-haeufigkeit': {
    sources: ['k7-lb4-rel-haeufigkeit'],
    maxDifficulty: 3,
    note: "Urliste, abs./rel. Häufigkeit",
  },
  'os-rs-k7-lb3-ordnen': {
    sources: ['k7-lb2-betrag'],
    maxDifficulty: 3,
    note: "bleibt",
  },
  'os-rs-k7-lb3-add': {
    sources: ['k7-lb2-add-rational'],
    maxDifficulty: 3,
    note: "1:1",
  },
  'os-rs-k7-lb3-sub': {
    sources: ['k7-lb2-sub-rational'],
    maxDifficulty: 3,
    note: "1:1",
  },
  'os-rs-k7-lb3-mul': {
    sources: ['k7-lb2-mul-rational'],
    maxDifficulty: 3,
    note: "1:1",
  },
  'os-rs-k7-lb3-div': {
    sources: ['k7-lb2-div-rational'],
    maxDifficulty: 3,
    note: "1:1",
  },
  'os-rs-k7-lb3-term': {
    sources: ['k7-lb2-term-vorrang'],
    maxDifficulty: 3,
    note: "1:1",
  },
  'os-rs-k7-lb3-gleichung': {
    sources: ['k7-lb2-gleichung-mul'],
    maxDifficulty: 3,
    note: "LP RS K7 LB3: Gleichungen kalkülmäßig (gleichung-add liegt in K5); vorher Dublette zu K8",
  },
  'os-rs-k7-lb3-gleichung-beid': {
    sources: ['k8-lb1-gleichung-beidseitig'],
    maxDifficulty: 3,
    note: "Form a·x+b=c·x+d (LP K7); K8 bekommt keine zweite Quelle",
  },
  'os-rs-k7-lb3-zahlenraetsel': {
    sources: ['k8-lb5-zahlenraetsel'],
    maxDifficulty: 3,
    note: "Aufstellen von Gleichungen",
  },
  'os-rs-k7-lb3-koordinaten': {
    sources: ['lb3-koordinaten-eintragen', 'lb3-koordinaten-ablesen'],
    maxDifficulty: 3,
    includeCustom: true,
    note: "Custom osQ1CoordinatePlace (nur 1. Quadrant) wird mit den Master-Themen (4 Quadranten) gemischt, weil der LP \"Verwenden von vier Quadranten\" verlangt (D10; HS Kl. 7 LB 3 S. 19-20, RS Kl. 7 LB 3 S. 29-30)",
  },
  'os-rs-k7-lb4-konstruieren': {
    sources: ['k7-lb1-mittelsenkrechte-schritte'],
    maxDifficulty: 3,
    note: "bleibt",
  },
  'os-rs-k7-lb4-volumen-prisma': {
    sources: ['k7-lb3-volumen-prisma'],
    maxDifficulty: 3,
    note: "K7-Master (vorher K6-Quelle, Dublette)",
  },
  'os-rs-k7-lb4-mantel': {
    sources: ['k7-lb3-mantel-prisma'],
    maxDifficulty: 3,
    note: "1:1",
  },
  'os-rs-k7-lb4-oberflaeche': {
    sources: ['k7-lb3-oberflaeche-quader'],
    maxDifficulty: 3,
    note: "K7-Master (vorher K5/K6-Dublette)",
  },
  'os-rs-k7-lbw3-symmetrie': {
    sources: ['lb3-punktsymmetrie'],
    maxDifficulty: 3,
    note: "Wahlbereich Parkettierungen: Symmetrie (neu, K5-Master)",
  },
  'os-rs-k8-lb1-term': {
    sources: ['k8-lb1-term-auswerten'],
    maxDifficulty: 3,
    note: "1:1",
  },
  'os-rs-k8-lb1-zusammenfassen': {
    sources: ['k8-lb1-zusammenfassen'],
    maxDifficulty: 3,
    note: "1:1",
  },
  'os-rs-k8-lb1-ausmult': {
    sources: ['k8-lb1-ausmultiplizieren'],
    maxDifficulty: 3,
    note: "1:1",
  },
  'os-rs-k8-lb1-gleichung': {
    sources: ['k8-lb1-gleichung-linear'],
    maxDifficulty: 3,
    note: "Heimat k8-lb1-gleichung-linear; K7 nutzt gleichung-mul/-beidseitig",
  },
  'os-rs-k8-lb1-formel': {
    sources: ['k8-lb5-rueckwaerts'],
    maxDifficulty: 3,
    note: "Umstellen von Formeln ~ Rückwärtsrechnen (neu)",
  },
  'os-rs-k8-lb2-funktionswert': {
    sources: ['k8-lb3-funktionswert'],
    maxDifficulty: 3,
    note: "1:1",
  },
  'os-rs-k8-lb2-steigung': {
    sources: ['k8-lb3-steigung'],
    maxDifficulty: 3,
    note: "1:1",
  },
  'os-rs-k8-lb2-achsen': {
    sources: ['k8-lb3-achsenabschnitt'],
    maxDifficulty: 3,
    note: "1:1",
  },
  'os-rs-k8-lb2-nullstelle': {
    sources: ['k1112-lb1-nullstelle-linear'],
    maxDifficulty: 3,
    note: "Nullstelle linearer Funktion (neu; Master stammt aus 11/12, Inhalt K8-tauglich, difficulty 2)",
  },
  'os-rs-k8-lb2-lgs': {
    sources: ['k8-lb3-lgs'],
    maxDifficulty: 3,
    note: "LP RS K8 LB2 verlangt LGS (difficulty 3 begründet)",
  },
  'os-rs-k8-lb3-kreis-umfang': {
    sources: ['k9-lb2-kreis-umfang'],
    maxDifficulty: 3,
    note: "1:1",
  },
  'os-rs-k8-lb3-kreis-flaeche': {
    sources: ['k9-lb2-kreis-flaeche'],
    maxDifficulty: 3,
    note: "1:1 (Kreisring ohne Master)",
  },
  'os-rs-k8-lb3-zylinder': {
    sources: ['k9-lb2-zylinder-volumen'],
    maxDifficulty: 3,
    note: "Heimat LP RS K8 LB3; K9-Zylinder entfällt (D16)",
  },
  'os-rs-k8-lb4-streckfaktor': {
    sources: ['k8-lb4-streckfaktor'],
    maxDifficulty: 3,
    note: "1:1",
  },
  'os-rs-k8-lb4-strahlensatz': {
    sources: ['k8-lb4-strahlensatz'],
    maxDifficulty: 3,
    note: "1:1",
  },
  'os-rs-k8-lb4-aehnlich': {
    sources: ['k8-lb4-aehnliche-seite'],
    maxDifficulty: 3,
    note: "1:1",
  },
  'os-rs-k8-lb5-laplace': {
    sources: ['k8-lb2-laplace-bruch'],
    maxDifficulty: 3,
    note: "Laplace/kombinatorisches Zählen (aus K7 hierher, D23)",
  },
  'os-rs-k8-lb5-gegen': {
    sources: ['k8-lb2-gegenwahrscheinlichkeit'],
    maxDifficulty: 3,
    note: "1:1",
  },
  'os-rs-k8-lb5-baum': {
    sources: ['k8-lb2-laplace-prozent'],
    maxDifficulty: 3,
    note: "Baumdiagramm-Aufgaben liegen nach Neu-Merge in den Laplace-Eltern; Verteilung in E1/E2 prüfen",
  },
  'os-rs-k8-lb6-zinsen': {
    sources: ['k10-lb5-kapital', 'k10-lb5-zinssatz'],
    maxDifficulty: 3,
    note: "Sparanlagen/Zinsen (neu, vorher Dublette)",
  },
  'os-rs-k9-lb1-hyp': {
    sources: ['k9-lb3-pythagoras-hypotenuse'],
    maxDifficulty: 3,
    note: "1:1; K10-Wiederholung entfällt",
  },
  'os-rs-k9-lb1-kathete': {
    sources: ['k9-lb3-pythagoras-kathete'],
    maxDifficulty: 3,
    note: "1:1",
  },
  'os-rs-k9-lb1-trig': {
    sources: ['k9-lb3-trig-wert'],
    maxDifficulty: 3,
    note: "Sinus/Kosinus/Tangens (LP RS K9 LB1)",
  },
  'os-rs-k9-lb1-sach': {
    sources: ['k9-lb5-leiter'],
    maxDifficulty: 3,
    note: "Sachaufgaben",
  },
  'os-rs-k9-lb2-pyramide': {
    sources: ['k7-lb3-volumen-pyramide', 'k7-lb3-oberflaeche-pyramide'],
    maxDifficulty: 3,
    note: "LP: Mantel/Oberfläche/Volumen von Pyramiden (Oberfläche neu)",
  },
  'os-rs-k9-lb2-kugel': {
    sources: ['k9-lb2-kugel-volumen'],
    maxDifficulty: 3,
    note: "LP RS K9 LB2: Kugel; K10-Doppelung entfällt",
  },
  'os-rs-k9-lb2-zusammengesetzt': {
    sources: ['lb4-volumen-zusammengesetzt'],
    maxDifficulty: 3,
    note: "LP RS K9 LB2: Anwenden auf zusammengesetzte Körper",
  },
  'os-rs-k9-lb3-quadrat': {
    sources: ['k9-lb1-quadrat-wert'],
    maxDifficulty: 3,
    note: "Funktionswert quadratischer Funktion",
  },
  'os-rs-k9-lb3-scheitel': {
    sources: ['k9-lb1-scheitel'],
    maxDifficulty: 3,
    note: "Scheitelpunkt (LP: y=(x-d)²+e)",
  },
  'os-rs-k9-lb3-gleichung': {
    sources: ['k10-lb4-reinquadratisch', 'k10-lb4-quadratische-gleichung'],
    maxDifficulty: 3,
    note: "LP: quadratische Gleichungen inkl. Lösungsformel -> difficulty 3 begründet",
  },
  'os-rs-k9-lb3-nullstellen': {
    sources: ['k10-lb3-quadrat-seite', 'k10-lb3-rechteck-breite', 'k10-lb3-rechteck-umfang'],
    maxDifficulty: 3,
    note: "nur Sachproblem-Variante (LP: Anwenden auf Sachprobleme); Nullstellen/Schnittpunkte rechnerisch ohne Master",
  },
  'os-rs-k9-lb4-mittelwert': {
    sources: ['k9-lb4-mittelwert'],
    maxDifficulty: 3,
    note: "1:1",
  },
  'os-rs-k9-lb4-median': {
    sources: ['k9-lb4-median'],
    maxDifficulty: 3,
    note: "1:1",
  },
  'os-rs-k9-lb4-modal': {
    sources: ['k9-lb4-modalwert'],
    maxDifficulty: 3,
    note: "1:1 (K6-Modal entfällt)",
  },
  'os-rs-k9-lb4-spannweite': {
    sources: ['k7-lb4-spannweite'],
    maxDifficulty: 3,
    note: "Max/Min/Spannweite",
  },
  'os-rs-k10-lb1-winkelsumme': {
    sources: ['k7-lb1-winkelsumme-vieleck'],
    maxDifficulty: 3,
    note: "LP RS K10 LB1: Winkelgrößen in Vielecken (Heimat; K7-Doppelung entfällt)",
  },
  'os-rs-k10-lb2-quadrat': {
    sources: ['k10-lb4-parabel-wert'],
    maxDifficulty: 3,
    note: "Potenzfunktion y=a·x² (LP K10 LB2); K9 nutzt quadrat-wert",
  },
  'os-rs-k10-lb2-exp': {
    sources: ['k10-lb1-exp-wachstum'],
    maxDifficulty: 3,
    note: "Exponentialfunktionen/Wachstum",
  },
  'os-rs-k10-lb3-erwartung': {
    sources: ['k10-lb2-erwartungswert'],
    maxDifficulty: 3,
    note: "LP K10 LB3: Erwartungswert",
  },
  'os-rs-k10-lb3-gewinnchance': {
    sources: ['k10-lb2-erwartungswert-wuerfel'],
    maxDifficulty: 3,
    note: "Gewinnerwartung beim Würfel (neu, vorher Dublette)",
  },
  'os-k6-lb4-volumen-quader': {
    sources: ['mathematik-klasse-6:lb4-volumen-quader'],
    maxDifficulty: 2,
    note: "K6-Quelle klassenqualifiziert (D24 aufgelöst); LP Kl. 6 LB 4: Volumen von Quader und Würfel",
  },
}

function explicitMapping(topicId: string): PackTopicMapping | undefined {
  return OS_TOPIC_MAPPINGS[topicId] ?? ST_TOPIC_MAPPINGS[topicId] ?? SKS_TOPIC_MAPPINGS[topicId]
}

export function generatorIdForTopic(topicId: string): string | undefined {
  return OS_GENERATOR_MAP[topicId] ?? ST_GENERATOR_MAP[topicId] ?? SKS_GENERATOR_MAP[topicId]
}

/** Effektives Mapping: explizites 1:n-Mapping, sonst String-Map (1:1). */
export function mappingForTopic(topicId: string): PackTopicMapping | undefined {
  const explicit = explicitMapping(topicId)
  if (explicit) return explicit
  const legacy = generatorIdForTopic(topicId)
  return legacy ? normalizeMapping(legacy) : undefined
}

export interface ResolvedSources {
  /** Aufgelöste Quellen nach `maxDifficulty`-Filter. */
  gens: Array<{ ref: SourceRef; gen: Topic['generate'] }>
  /** Wegen `maxDifficulty` ausgeschlossen. */
  filtered: SourceRef[]
  /** Nicht im Katalog gefunden. */
  missing: SourceRef[]
}

export function resolveSources(
  mapping: PackTopicMapping,
  gymCatalog: Map<string, Topic['generate']>,
): ResolvedSources {
  const out: ResolvedSources = { gens: [], filtered: [], missing: [] }
  for (const ref of mapping.sources) {
    const gen = gymCatalog.get(ref)
    if (!gen) {
      out.missing.push(ref)
      continue
    }
    const difficulty = catalogEntryMeta(ref)?.difficulty ?? DEFAULT_DIFFICULTY
    if (mapping.maxDifficulty && difficulty > mapping.maxDifficulty) {
      out.filtered.push(ref)
      continue
    }
    out.gens.push({ ref, gen })
  }
  return out
}

/**
 * Gemeinsame Auflösung für `resolveOsGenerate` und `isPlayableOfficialTopic`
 * (beide dürfen nie voneinander abweichen).
 *
 * - Kein explizites Mapping: Custom-Generator, sonst String-Map (1:1, ohne Filter).
 * - Explizites Mapping (`*_TOPIC_MAPPINGS`): ersetzt die String-Map. Custom gewinnt
 *   allein, außer `includeCustom: true` — dann wird Custom als eine Quelle beigemischt.
 *   Quellen werden nach `maxDifficulty` gefiltert (`difficulty` fehlt = 2).
 */
function resolveParts(
  topicId: string,
  gymCatalog: Map<string, Topic['generate']>,
): Array<Topic['generate']> {
  const custom = OS_CUSTOM_GENERATORS[topicId]
  const explicit = explicitMapping(topicId)
  if (!explicit) {
    if (custom) return [custom]
    const mapped = generatorIdForTopic(topicId)
    const gen = mapped ? gymCatalog.get(mapped) : undefined
    return gen ? [gen] : []
  }
  if (custom && !explicit.includeCustom) return [custom]
  const gens = resolveSources(explicit, gymCatalog).gens.map((s) => s.gen)
  return custom ? [custom, ...gens] : gens
}

/**
 * Resolve a playable OS/ST/SKS topic generator. Mehrere Teile: `blendGenerators`,
 * GLEICHE Gewichte je Quelle, deterministisch je Seed. Nichts übrig → `undefined`
 * (Outline).
 */
export function resolveOsGenerate(
  topicId: string,
  gymCatalog: Map<string, Topic['generate']>,
): Topic['generate'] | undefined {
  const parts = resolveParts(topicId, gymCatalog)
  if (parts.length === 0) return undefined
  return parts.length === 1 ? parts[0] : blendGenerators(parts.map((gen) => ({ gen, weight: 1 })))
}

/**
 * Spielbar = der Resolver liefert einen Generator. Ohne geladenen Katalog
 * (`gymGeneratorCatalog()` noch nicht aufgerufen) ist nur eine strukturelle
 * Aussage möglich (Quellen vorhanden); mit Katalog identisch zum Resolver.
 */
export function isPlayableOfficialTopic(
  topicId: string,
  gymCatalog: Map<string, Topic['generate']> | null = catalog,
): boolean {
  if (gymCatalog) return resolveParts(topicId, gymCatalog).length > 0
  const explicit = explicitMapping(topicId)
  if (!explicit) return Boolean(OS_CUSTOM_GENERATORS[topicId] || generatorIdForTopic(topicId))
  return Boolean(OS_CUSTOM_GENERATORS[topicId] || explicit.sources.length > 0)
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
  const isPlaceholder = isPlaceholderNeuTopic(topic.id)
  const isNeu = topic.neu === true || isNeuTopic(topic.id)
  // Neu-Badge bleibt bei gefüllten Banken; outlineOnly nur ohne echte Bank.
  const playable = Boolean(generate) && !isPlaceholder
  return ensureTopicFachwissen(
    {
      id: topic.id,
      title: topic.title,
      hint: topic.hint,
      pointsPerTask: topic.pointsPerTask,
      keywords: topic.keywords,
      source: 'official',
      outlineOnly: playable ? undefined : true,
      released: isNeu ? false : (topic.released ?? true),
      ...(isNeu ? { neu: true } : {}),
      contentId: topicContentId(topic.id),
      ...(topic.tasksPerRound ? { tasksPerRound: topic.tasksPerRound } : {}),
      ...(topic.excludeFachwissen ? { excludeFachwissen: true } : {}),
      generate: generate ?? outlineGenerate(topic.title),
    },
    { subject: opts?.subject },
  )
}
