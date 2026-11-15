/**
 * Klasse 7 Mathematik — zusätzliche Neu-(Prüfung)-Banken nach Bettermarks.
 * Sibling-IDs: `${parentId}__neu`, neu:true, released:false.
 * Händisch; keine Bulk-Skripte. Originale in math7.ts unberührt.
 */
import { pick, randInt, type Rng } from '../lib/rng'
import { formatDe, roundTo } from '../lib/num'
import {
  generateCuboidSvg,
  generatePrismVolumeSvg,
  generatePyramidSurfaceSvg,
  generatePyramidVolumeSvg,
  generateSpinnerSvg,
} from '../lib/geometrySvg'
import { shuffleChoices } from './biologieHelpers'
import {
  angleProtractorTask,
  choicePickTask,
  constructionStepsTask,
  dragDropSortTask,
  mixedVariants,
  multiSelectTask,
  numberLineTask,
  paramSliderTask,
  valueTask,
  numberLineMultiTask,
} from './taskHelpers'
import { compassArcTask, hasCircle, hasPointNear } from './measureTaskHelpers'
import { emptyCoordinateScene, sameLine, type CoordinateScene } from '../lib/coordinateScene'
import { asNeuTopic } from './neuTopic'
import type { Topic } from './types'

// ---------------------------------------------------------------------------
// Lokale Helfer (bewusst nicht aus math7.ts importiert — Zirkelimport-Gefahr,
// da math7.ts seinerseits math7NeuLb1/Lb2 importiert).
// ---------------------------------------------------------------------------

/** Format a signed integer, wrapping negatives in parentheses with a real minus (für Operanden in Termen). */
const num = (n: number): string => (n < 0 ? `(−${Math.abs(n)})` : `${n}`)

/** Format a signed integer ohne Klammern (für Koordinaten / Standalone-Werte). */
const signed = (n: number): string => (n < 0 ? `−${Math.abs(n)}` : `${n}`)

/** A non-zero integer in [min, max]. */
const nonZero = (rng: Rng, min: number, max: number): number => {
  let v = 0
  while (v === 0) v = randInt(rng, min, max)
  return v
}

/** `count` paarweise verschiedene, von 0 verschiedene Ganzzahlen in [min, max]. */
const distinctNonZero = (rng: Rng, count: number, min: number, max: number): number[] => {
  const out: number[] = []
  let guard = 0
  while (out.length < count && guard < 400) {
    guard++
    const v = randInt(rng, min, max)
    if (v === 0 || out.includes(v)) continue
    out.push(v)
  }
  return out
}

/** 4 MC-Choice-Labels: korrekt + bis zu 3 verschiedene falsche Kandidaten. */
function fourChoices(correct: string, wrongCandidates: string[]): string[] {
  const out = [correct]
  const seen = new Set([correct])
  for (const w of wrongCandidates) {
    if (out.length >= 4) break
    if (!seen.has(w)) {
      seen.add(w)
      out.push(w)
    }
  }
  return out
}

/** Startwinkel-Varianten, damit gleich große Winkel optisch unterschiedlich aussehen. */
const START_ANGLES = [0, 20, 45, 90, 135, 180, 225, 270] as const
/** Planfigur Mittelsenkrechte (Skizze, nicht maßstabsgetreu): AB, zwei Kreisbögen mit gleichem Radius, P, Q und die Gerade PQ. */
const mittelsenkrechtePlanSvg = (lenCm: number, radiusCm: number): string =>
  `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Skizze zur Konstruktion der Mittelsenkrechten">` +
  `<line x1="40" y1="100" x2="260" y2="100" stroke="#1d3557" stroke-width="2"/>` +
  `<path d="M138.3 168.8 A120 120 0 0 0 138.3 31.2" fill="none" stroke="#6b7280" stroke-width="1.4" stroke-dasharray="5 4"/>` +
  `<path d="M161.7 31.2 A120 120 0 0 0 161.7 168.8" fill="none" stroke="#6b7280" stroke-width="1.4" stroke-dasharray="5 4"/>` +
  `<line x1="150" y1="14" x2="150" y2="186" stroke="#c62828" stroke-width="1.6"/>` +
  `<circle cx="40" cy="100" r="3.5" fill="#1d3557"/><circle cx="260" cy="100" r="3.5" fill="#1d3557"/>` +
  `<circle cx="150" cy="52" r="3.5" fill="#c62828"/><circle cx="150" cy="148" r="3.5" fill="#c62828"/>` +
  `<g font-family="sans-serif" font-size="14" fill="#1f2937">` +
  `<text x="30" y="122">A</text><text x="256" y="122">B</text>` +
  `<text x="158" y="50">P</text><text x="158" y="160">Q</text>` +
  `<text x="85" y="124">AB = ${lenCm} cm</text>` +
  `<text x="52" y="46" font-size="12">r = ${radiusCm} cm</text><text x="206" y="46" font-size="12">r = ${radiusCm} cm</text>` +
  `</g></svg>`

// ---------------------------------------------------------------------------
// Lernbereich 1 — Geometrie in der Ebene
// ---------------------------------------------------------------------------

const nebenwinkelNeu: Topic = asNeuTopic('k7-lb1-nebenwinkel', {
  id: 'k7-lb1-nebenwinkel__neu',
  title: 'Nebenwinkel berechnen',
  hint: 'Nebenwinkel liegen an einer Geraden nebeneinander und ergänzen sich zu 180°.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Winkel', 'Nebenwinkel', 'Geraden', '180 Grad', 'supplementär', 'Winkelpaar'],
  fachwissen: {
    text: 'Zwei Winkel heißen Nebenwinkel, wenn sie an einer Geraden nebeneinanderliegen und einen gemeinsamen Schenkel haben: zusammen bilden sie einen gestreckten Winkel (180°). Kennt man einen der beiden Winkel, ergibt sich der andere sofort durch 180° minus den gegebenen Winkel.',
    quelle: 'Wikipedia: Winkel',
    url: 'https://de.wikipedia.org/wiki/Winkel',
  },
  generate: mixedVariants(
    // V1 Tippen — Sachaufgabe (Straße/Weg)
    (rng: Rng) => {
      const a = randInt(rng, 15, 165)
      const value = 180 - a
      return valueTask({
        question: `An einer geraden Straße trifft ein Weg so, dass der eine Winkel zur Straße ${a}° misst. Wie groß ist der Winkel auf der anderen Seite des Wegs (Nebenwinkel)?`,
        unit: '°',
        answerKind: 'integer',
        value,
        solution: `${value}°`,
        explanation: `Nebenwinkel ergänzen sich zu 180°: 180° − ${a}° = ${value}°.`,
        dedupeKey: `k7neben-tippen:${a}`,
      })
    },
    // V2 MC — typische Verwechslungen
    (rng: Rng) => {
      const a = randInt(rng, 20, 160)
      const value = 180 - a
      const correct = `${value}°`
      const wrong1 = `${a}°` // Verwechslung mit Scheitelwinkel (gleich groß statt ergänzend)
      const wrong2 = `${360 - a}°` // Vollwinkel statt gestreckter Winkel verwendet
      const wrong3 = `${Math.abs(90 - a)}°` // Verwechslung mit Komplementärwinkel
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Winkel an einer Geraden beträgt ${a}°. Wie groß ist der zugehörige Nebenwinkel?`,
        choices,
        correct,
        solution: correct,
        explanation: `Nebenwinkel ergänzen sich zu 180°: 180° − ${a}° = ${value}°.`,
        dedupeKey: `k7neben-mc:${a}`,
      })
    },
    // V3 Portfolio — Nebenwinkel berechnen und mit dem Geodreieck zeichnen
    (rng: Rng) => {
      const a = randInt(rng, 20, 160)
      const value = 180 - a
      const startAngle = pick(rng, START_ANGLES)
      return angleProtractorTask({
        question: `Zwei Winkel liegen als Nebenwinkel an einer Geraden. Der eine misst ${a}°. Zeichne mit dem Geodreieck den anderen Winkel.`,
        mode: 'draw',
        angle: value,
        startAngle,
        solution: `${value}°`,
        explanation: `Nebenwinkel ergänzen sich zu 180°: 180° − ${a}° = ${value}°. Stelle den zweiten Schenkel am Geodreieck auf ${value}° ein.`,
        instruction: 'Stelle den zweiten Schenkel am Geodreieck auf den gesuchten Winkel ein:',
        dedupeKey: `k7neben-zeichnen:${a}`,
      })
    },
    // V4 MC — Konzeptfrage
    (rng: Rng) => {
      const correct =
        'Nebenwinkel liegen an einer Geraden nebeneinander und ergänzen sich stets zu 180°.'
      const wrong1 = 'Nebenwinkel sind immer gleich groß wie der gegebene Winkel.'
      const wrong2 = 'Nebenwinkel ergänzen sich zu 360°, da sie einen Vollwinkel bilden.'
      const wrong3 = 'Nebenwinkel entstehen nur bei rechten Winkeln (90°).'
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: 'Welche Aussage über Nebenwinkel ist richtig?',
        choices,
        correct,
        solution: correct,
        explanation:
          'Nebenwinkel teilen sich einen Schenkel und liegen an einer Geraden — zusammen bilden sie den gestreckten Winkel von 180°.',
      })
    },
  ),
})

const scheitelwinkelNeu: Topic = asNeuTopic('k7-lb1-scheitelwinkel', {
  id: 'k7-lb1-scheitelwinkel__neu',
  title: 'Scheitel- und Stufenwinkel',
  hint: 'Scheitelwinkel und Stufenwinkel sind gleich groß.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Winkel', 'Scheitelwinkel', 'Stufenwinkel', 'Wechselwinkel', 'Parallelen'],
  fachwissen: {
    text: 'Beim Kreuzen zweier Geraden liegen sich Scheitelwinkel gegenüber und sind gleich groß. Schneidet eine Transversale zwei zueinander parallele Geraden, entstehen zusätzlich Stufenwinkel (gleiche Lage an beiden Parallelen) und Wechselwinkel (Z-Form) — beide ebenfalls jeweils gleich groß.',
    quelle: 'Wikipedia: Scheitelwinkel',
    url: 'https://de.wikipedia.org/wiki/Scheitelwinkel',
  },
  generate: mixedVariants(
    // V1 Tippen — Sachaufgabe (Parallelen/Transversale)
    (rng: Rng) => {
      const a = randInt(rng, 15, 165)
      const art = pick(rng, ['Stufenwinkel', 'Wechselwinkel'] as const)
      return valueTask({
        question: `Zwei parallele Gehwege werden von einem dritten Weg (Transversale) geschnitten. Ein ${art} dazu beträgt ${a}°. Wie groß ist der entsprechende ${art} an der anderen Parallele?`,
        unit: '°',
        answerKind: 'integer',
        value: a,
        solution: `${a}°`,
        explanation: `${art} an Parallelen sind gleich groß: ${a}°.`,
        dedupeKey: `k7scheitel-tippen:${a}:${art}`,
      })
    },
    // V2 MC — typische Verwechslungen
    (rng: Rng) => {
      const a = randInt(rng, 20, 160)
      const correct = `${a}°`
      const wrong1 = `${180 - a}°` // Verwechslung mit Nebenwinkel
      const wrong2 = `${360 - a}°`
      const wrong3 = `${Math.abs(90 - a)}°`
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Zwei Geraden schneiden sich. Ein Winkel beträgt ${a}°. Wie groß ist sein Scheitelwinkel?`,
        choices,
        correct,
        solution: correct,
        explanation: `Scheitelwinkel liegen sich gegenüber und sind gleich groß: ${a}°.`,
        dedupeKey: `k7scheitel-mc:${a}`,
      })
    },
    // V3 Portfolio — Scheitelwinkel über den Nebenwinkel bestimmen und zeichnen
    (rng: Rng) => {
      const a = randInt(rng, 20, 160)
      const neben = 180 - a
      const startAngle = pick(rng, START_ANGLES)
      return angleProtractorTask({
        question: `Zwei Geraden schneiden sich. Der Winkel α hat einen Nebenwinkel von ${neben}°. Zeichne mit dem Geodreieck den Scheitelwinkel von α.`,
        mode: 'draw',
        angle: a,
        startAngle,
        solution: `${a}°`,
        explanation: `α ergänzt seinen Nebenwinkel zu 180°: α = 180° − ${neben}° = ${a}°. Der Scheitelwinkel von α ist gleich groß, also ${a}°. Stelle den zweiten Schenkel am Geodreieck auf ${a}° ein.`,
        instruction: 'Stelle den zweiten Schenkel am Geodreieck auf den gesuchten Winkel ein:',
        dedupeKey: `k7scheitel-zeichnen:${a}`,
      })
    },
    // V4 MC — Konzeptfrage
    (rng: Rng) => {
      const correct =
        'Scheitelwinkel entstehen an sich kreuzenden Geraden, Stufen- und Wechselwinkel entstehen an einer Transversalen durch zwei Parallelen — alle sind jeweils paarweise gleich groß.'
      const wrong1 = 'Scheitelwinkel ergänzen sich zu 180°, genau wie Nebenwinkel.'
      const wrong2 = 'Stufenwinkel entstehen nur an sich kreuzenden Geraden, nicht an Parallelen.'
      const wrong3 = 'Wechselwinkel sind nur bei rechten Winkeln (90°) gleich groß.'
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: 'Welche Aussage ist richtig?',
        choices,
        correct,
        solution: correct,
        explanation:
          'Scheitelwinkel brauchen zwei sich kreuzende Geraden; Stufen- und Wechselwinkel brauchen zusätzlich eine Transversale durch zwei Parallelen. In beiden Fällen sind die jeweiligen Winkelpaare gleich groß.',
      })
    },
  ),
})

const winkelsummeVieleckNeu: Topic = asNeuTopic('k7-lb1-winkelsumme-vieleck', {
  id: 'k7-lb1-winkelsumme-vieleck__neu',
  title: 'Innenwinkelsumme im Vieleck',
  hint: 'Winkelsumme = (n − 2) · 180°.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Vieleck', 'Polygon', 'Innenwinkelsumme', 'Winkelsumme', 'n-Eck', 'regelmäßig'],
  fachwissen: {
    text: 'Ein konvexes n-Eck lässt sich von einer Ecke aus durch Diagonalen in (n − 2) Dreiecke zerlegen. Da jedes Dreieck 180° Winkelsumme hat, gilt für das gesamte n-Eck: Winkelsumme = (n − 2) · 180°. Bei einem regelmäßigen n-Eck sind zusätzlich alle n Innenwinkel gleich groß, also jeder Innenwinkel = (n − 2) · 180° : n.',
    quelle: 'Wikipedia: Vieleck',
    url: 'https://de.wikipedia.org/wiki/Vieleck',
  },
  generate: mixedVariants(
    // V1 Tippen — umgekehrte Richtung: aus der Summe die Eckenzahl bestimmen
    (rng: Rng) => {
      const n = randInt(rng, 3, 12)
      const sum = (n - 2) * 180
      return valueTask({
        question: `Die Innenwinkelsumme eines Vielecks beträgt ${sum}°. Wie viele Ecken (n) hat das Vieleck?`,
        answerKind: 'integer',
        value: n,
        solution: `n = ${n}`,
        explanation: `(n − 2) · 180° = ${sum}°  →  n − 2 = ${sum} : 180 = ${n - 2}  →  n = ${n}.`,
        dedupeKey: `k7vieleck-tippen:${n}`,
      })
    },
    // V2 MC — typische Formel-Fehler
    (rng: Rng) => {
      const n = randInt(rng, 3, 12)
      const sum = (n - 2) * 180
      const correct = `${sum}°`
      const candidates = [
        `${n * 180}°`, // −2 vergessen
        `${(n - 2) * 90}°`, // falscher Faktor (90 statt 180)
        `360°`, // immer Viereck-Wert angenommen
        `${(n - 3) * 180}°`, // falsche Dreieckszahl
      ]
      const choices = shuffleChoices(rng, fourChoices(correct, candidates), correct)
      return choicePickTask({
        question: `Wie groß ist die Innenwinkelsumme in einem ${n}-Eck?`,
        choices,
        correct,
        solution: correct,
        explanation: `Winkelsumme = (n − 2) · 180°. Für n = ${n}: (${n} − 2) · 180° = ${n - 2} · 180° = ${sum}°.`,
        dedupeKey: `k7vieleck-mc:${n}`,
      })
    },
    // V3 Portfolio — Innenwinkel eines regelmäßigen n-Ecks berechnen und mit dem Geodreieck zeichnen
    (rng: Rng) => {
      const regularPairs: Array<{ n: number; interior: number }> = [
        { n: 3, interior: 60 },
        { n: 4, interior: 90 },
        { n: 5, interior: 108 },
        { n: 6, interior: 120 },
        { n: 8, interior: 135 },
        { n: 9, interior: 140 },
        { n: 10, interior: 144 },
        { n: 12, interior: 150 },
        { n: 15, interior: 156 },
        { n: 18, interior: 160 },
        { n: 20, interior: 162 },
      ]
      const { n, interior } = pick(rng, regularPairs)
      const startAngle = pick(rng, START_ANGLES)
      return angleProtractorTask({
        question: `Zeichne mit dem Geodreieck einen Innenwinkel eines regelmäßigen ${n}-Ecks. Alle ${n} Innenwinkel sind gleich groß.`,
        mode: 'draw',
        angle: interior,
        startAngle,
        solution: `${interior}°`,
        explanation: `Innenwinkelsumme = (n − 2) · 180° = (${n} − 2) · 180° = ${(n - 2) * 180}°. Da alle ${n} Winkel gleich groß sind: ${(n - 2) * 180}° : ${n} = ${interior}°. Stelle den zweiten Schenkel am Geodreieck auf ${interior}° ein.`,
        instruction: 'Stelle den zweiten Schenkel am Geodreieck auf den gesuchten Winkel ein:',
        dedupeKey: `k7vieleck-zeichnen:${n}`,
      })
    },
    // V4 MC — Konzeptfrage (Begründung der Formel)
    (rng: Rng) => {
      const correct =
        'Weil sich ein konvexes n-Eck von einer Ecke aus durch Diagonalen in (n − 2) Dreiecke zerlegen lässt und jedes Dreieck 180° Winkelsumme hat.'
      const wrong1 = 'Weil jedes Vieleck aus genau zwei Dreiecken besteht.'
      const wrong2 = 'Weil jede Ecke eines Vielecks automatisch 180° misst.'
      const wrong3 = 'Weil man die Anzahl der Seiten einfach mit 180° multipliziert.'
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: 'Warum lässt sich die Innenwinkelsumme eines Vielecks mit der Formel (n − 2) · 180° berechnen?',
        choices,
        correct,
        solution: correct,
        explanation:
          'Die Zerlegung in (n − 2) Dreiecke von einer Ecke aus liefert direkt die Formel, da jedes Dreieck 180° beiträgt.',
      })
    },
  ),
})

const basiswinkelNeu: Topic = asNeuTopic('k7-lb1-basiswinkel', {
  id: 'k7-lb1-basiswinkel__neu',
  title: 'Basiswinkel im gleichschenkligen Dreieck',
  hint: 'Die beiden Basiswinkel sind gleich groß.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Dreieck', 'gleichschenklig', 'Basiswinkel', 'Spitzenwinkel', 'Winkel'],
  fachwissen: {
    text: 'In einem gleichschenkligen Dreieck sind zwei Seiten (die Schenkel) gleich lang. Die Winkel gegenüber diesen Schenkeln — die Basiswinkel — sind deshalb ebenfalls gleich groß. Mit der Winkelsumme 180° gilt: Basiswinkel = (180° − Spitzenwinkel) : 2, bzw. umgekehrt Spitzenwinkel = 180° − 2 · Basiswinkel.',
    quelle: 'Wikipedia: Gleichschenkliges Dreieck',
    url: 'https://de.wikipedia.org/wiki/Gleichschenkliges_Dreieck',
  },
  generate: mixedVariants(
    // V1 Tippen — umgekehrte Richtung: aus dem Basiswinkel den Spitzenwinkel bestimmen
    (rng: Rng) => {
      const basis = randInt(rng, 10, 80)
      const spitze = 180 - 2 * basis
      return valueTask({
        question: `In einem gleichschenkligen Dreieck sind beide Basiswinkel gleich groß und betragen je ${basis}°. Wie groß ist der Winkel an der Spitze?`,
        unit: '°',
        answerKind: 'integer',
        value: spitze,
        solution: `${spitze}°`,
        explanation: `Winkelsumme = 180°. Beide Basiswinkel zusammen: 2 · ${basis}° = ${2 * basis}°. Spitzenwinkel = 180° − ${2 * basis}° = ${spitze}°.`,
        dedupeKey: `k7basis-tippen:${basis}`,
      })
    },
    // V2 MC — typische Fehler
    (rng: Rng) => {
      const apex = randInt(rng, 10, 70) * 2
      const base = (180 - apex) / 2
      const correct = `${base}°`
      const wrong1 = `${apex / 2}°` // teilt den Spitzenwinkel statt (180° − Spitze)
      const wrong2 = `${180 - apex}°` // vergisst die Division durch 2
      const wrong3 = `${(360 - apex) / 2}°` // verwendet 360° statt 180°
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `In einem gleichschenkligen Dreieck ist der Winkel an der Spitze ${apex}°. Wie groß ist jeder Basiswinkel?`,
        choices,
        correct,
        solution: correct,
        explanation: `Basiswinkel = (180° − ${apex}°) : 2 = ${base}°.`,
        dedupeKey: `k7basis-mc:${apex}`,
      })
    },
    // V3 Portfolio — Basiswinkel berechnen und mit dem Geodreieck zeichnen
    (rng: Rng) => {
      const apex = randInt(rng, 10, 70) * 2
      const base = (180 - apex) / 2
      const startAngle = pick(rng, START_ANGLES)
      return angleProtractorTask({
        question: `Ein gleichschenkliges Dreieck hat an der Spitze einen Winkel von ${apex}°. Zeichne mit dem Geodreieck einen der beiden Basiswinkel.`,
        mode: 'draw',
        angle: base,
        startAngle,
        solution: `${base}°`,
        explanation: `Basiswinkel = (180° − ${apex}°) : 2 = ${base}°. Stelle den zweiten Schenkel am Geodreieck auf ${base}° ein.`,
        instruction: 'Stelle den zweiten Schenkel am Geodreieck auf den gesuchten Winkel ein:',
        dedupeKey: `k7basis-zeichnen:${apex}`,
      })
    },
    // V4 MC — Konzeptfrage
    (rng: Rng) => {
      const correct =
        'Die beiden Basiswinkel liegen gegenüber den gleich langen Schenkeln und sind deshalb stets gleich groß.'
      const wrong1 = 'Die Basiswinkel sind nur bei einem gleichseitigen Dreieck gleich groß.'
      const wrong2 = 'Ein Basiswinkel ist immer größer als der Winkel an der Spitze.'
      const wrong3 = 'Basiswinkel und Spitzenwinkel sind in jedem gleichschenkligen Dreieck gleich groß.'
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: 'Welche Aussage über die Basiswinkel im gleichschenkligen Dreieck ist richtig?',
        choices,
        correct,
        solution: correct,
        explanation:
          'Gleich lange Schenkel liegen stets gleich großen Basiswinkeln gegenüber — das gilt unabhängig von der Größe des Spitzenwinkels.',
      })
    },
  ),
})

const mittelsenkrechteSchritteNeu: Topic = asNeuTopic('k7-lb1-mittelsenkrechte-schritte', {
  id: 'k7-lb1-mittelsenkrechte-schritte__neu',
  title: 'Mittelsenkrechte: Konstruktionsschritte',
  hint: 'Jeder Punkt auf der Mittelsenkrechten ist von A und B gleich weit entfernt.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Mittelsenkrechte', 'Konstruktion', 'Zirkel', 'Lot', 'Mittelpunkt', 'gleich weit entfernt'],
  fachwissen: {
    text: 'Die Mittelsenkrechte einer Strecke AB steht senkrecht auf AB und geht durch ihren Mittelpunkt. Jeder Punkt auf der Mittelsenkrechten ist von A und B gleich weit entfernt. Konstruktion: Kreisbögen mit gleichem Radius (> ½|AB|) um A und um B schlagen; die Gerade durch die beiden Schnittpunkte ist die Mittelsenkrechte.',
    quelle: 'Wikipedia: Mittelsenkrechte',
    url: 'https://de.wikipedia.org/wiki/Mittelsenkrechte',
  },
  generate: mixedVariants(
    // V1 dragDropSort — echte Konstruktionsreihenfolge (feiner gegliedert als im Hauptthema)
    (rng: Rng) => {
      const steps = [
        { label: 'Strecke AB zeichnen', value: 0 },
        { label: 'Zirkel auf Radius > ½ · AB einstellen', value: 1 },
        { label: 'Kreisbogen um A schlagen', value: 2 },
        { label: 'Mit gleichem Radius Kreisbogen um B schlagen', value: 3 },
        { label: 'Beide Schnittpunkte der Bögen markieren (P und Q)', value: 4 },
        { label: 'Gerade durch P und Q zeichnen — das ist die Mittelsenkrechte', value: 5 },
      ]
      const correctOrder = steps.map((_, i) => i)
      return dragDropSortTask({
        question: 'Ordne die Konstruktionsschritte der Mittelsenkrechten von AB in der richtigen Reihenfolge.',
        items: steps,
        correctOrder,
        solution: steps.map((s) => s.label).join(' → '),
        explanation:
          'Zuerst AB zeichnen, dann mit gleichem (ausreichend großem) Radius Kreisbögen um A und B schlagen, die Schnittpunkte markieren und verbinden — das ist die Mittelsenkrechte.',
        rng,
      })
    },
    // V2 Tippen — Mittelpunkt auf der Zahlengeraden berechnen
    (rng: Rng) => {
      const a = randInt(rng, -12, 12)
      const b = a + 2 * randInt(rng, 1, 10)
      const mid = (a + b) / 2
      return valueTask({
        question: `Die Punkte A und B liegen auf einer Zahlengeraden bei x = ${signed(a)} und x = ${signed(b)}. Bei welchem x-Wert schneidet die Mittelsenkrechte von AB die Strecke AB?`,
        answerKind: 'integer',
        value: mid,
        solution: `x = ${signed(mid)}`,
        explanation: `Die Mittelsenkrechte schneidet AB immer im Mittelpunkt: x = (${a} + ${b}) : 2 = ${mid}.`,
        dedupeKey: `k7mittel-tippen:${a}:${b}`,
      })
    },
    // V3 Portfolio — Mittelpunkt auf dem Zahlenstrahl markieren
    (rng: Rng) => {
      const a = randInt(rng, -8, 8)
      const b = a + 2 * randInt(rng, 1, 6)
      const mid = (a + b) / 2
      const min = Math.min(a, b) - 3
      const max = Math.max(a, b) + 3
      return numberLineTask({
        question: `A liegt bei x = ${signed(a)}, B liegt bei x = ${signed(b)}. Markiere den Punkt, in dem die Mittelsenkrechte die Strecke AB schneidet.`,
        min,
        max,
        step: 1,
        value: mid,
        solution: `x = ${signed(mid)}`,
        explanation: `Der Schnittpunkt mit der Mittelsenkrechten ist der Mittelpunkt: (${a} + ${b}) : 2 = ${mid}.`,
      })
    },
    // V4 MC — Konzeptfrage
    (rng: Rng) => {
      const correct = 'Er ist von A und von B gleich weit entfernt.'
      const wrong1 = 'Er liegt immer auf der Strecke AB.'
      const wrong2 = 'Er liegt immer näher an A als an B.'
      const wrong3 = 'Er halbiert immer den Winkel bei A.'
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: 'Welche Eigenschaft hat jeder Punkt auf der Mittelsenkrechten von AB?',
        choices,
        correct,
        solution: correct,
        explanation:
          'Das ist die definierende Eigenschaft der Mittelsenkrechten: gleicher Abstand zu A und zu B — nur der Mittelpunkt selbst liegt dabei auch auf AB.',
      })
    },
    // V5 Zirkel — zwei Kreisbögen mit gleichem Radius um A und B schlagen
    (rng: Rng) => {
      const len = pick(rng, [4, 6, 8])
      const ax = randInt(rng, 0, 3)
      const ay = randInt(rng, 0, 3)
      const half = len / 2
      const r = half + 2
      return compassArcTask({
        question: `Die Punkte A und B sind ${len} cm voneinander entfernt. Schlage mit dem Zirkel um A und um B je einen Kreisbogen mit demselben Radius, damit sich die Bögen schneiden. Der Radius ist frei wählbar, muss aber größer als ${half} cm sein.`,
        points: [
          { id: 'A', x: ax, y: ay, label: 'A' },
          { id: 'B', x: ax + len, y: ay, label: 'B' },
        ],
        targets: [
          { centerId: 'A', radius: r },
          { centerId: 'B', radius: r },
        ],
        sameRadius: true,
        minRadius: half,
        solution: `Zwei Kreisbögen mit gleichem Radius (größer als ${half} cm) um A und um B`,
        explanation: `Die Punkte der Mittelsenkrechten sind von A und B gleich weit entfernt. Darum brauchst du um A und um B Kreisbögen mit demselben Radius. Ist der Radius kleiner als ${half} cm (die Hälfte von AB), erreichen sich die Bögen nicht und schneiden sich nicht. Zum Beispiel passt r = ${r} cm.`,
        dedupeKey: `k7mittel-zirkel:${len}:${ax}:${ay}`,
      })
    },
    // V6 Geführte Konstruktion — Bögen, Schnittpunkte, Mittelsenkrechte
    (rng: Rng) => {
      const setup = pick(rng, [
        { len: 4, r: 2.5, h: 1.5 },
        { len: 6, r: 5, h: 4 },
        { len: 8, r: 5, h: 3 },
      ])
      const { len, r, h } = setup
      const A = { x: 0, y: 0 }
      const B = { x: len, y: 0 }
      const P = { x: len / 2, y: h }
      const Q = { x: len / 2, y: -h }
      const fmt = (v: number) => formatDe(v)
      const startScene = emptyCoordinateScene({
        xRange: [-3, len + 3],
        yRange: [-5, 5],
        snap: 'half',
        objects: [
          { id: 'A', kind: 'point', x: A.x, y: A.y, label: 'A', fixed: true },
          { id: 'B', kind: 'point', x: B.x, y: B.y, label: 'B', fixed: true },
        ],
      })
      const throughPQ = (scene: CoordinateScene) =>
        scene.objects.some((o) => {
          if (o.kind === 'line') return sameLine(o, { x1: P.x, y1: P.y, x2: Q.x, y2: Q.y })
          if (o.kind !== 'segment') return false
          const length = Math.hypot(o.x2 - o.x1, o.y2 - o.y1)
          return length >= 2 * h - 0.3 && sameLine(o, { x1: P.x, y1: P.y, x2: Q.x, y2: Q.y })
        })
      return constructionStepsTask({
        question: `Konstruiere die Mittelsenkrechte der Strecke AB mit AB = ${len} cm. Die Planfigur zeigt den Aufbau.`,
        planFigureSvg: mittelsenkrechtePlanSvg(len, r),
        startScene,
        steps: [
          {
            instruction: `Schlage mit dem Zirkel einen Kreisbogen um A mit dem Radius r = ${fmt(r)} cm.`,
            allowedTools: ['circle', 'select', 'delete'],
            check: (s) => hasCircle(s, 'A', r),
          },
          {
            instruction: `Schlage mit demselben Radius r = ${fmt(r)} cm einen Kreisbogen um B.`,
            allowedTools: ['circle', 'select', 'delete'],
            check: (s) => hasCircle(s, 'B', r),
          },
          {
            instruction: 'Markiere die beiden Schnittpunkte der Kreisbögen.',
            allowedTools: ['point', 'select', 'delete'],
            check: (s) => hasPointNear(s, P.x, P.y) && hasPointNear(s, Q.x, Q.y),
          },
          {
            instruction: 'Zeichne die Gerade durch die beiden Schnittpunkte.',
            allowedTools: ['line', 'segment', 'select', 'delete'],
            check: throughPQ,
          },
        ],
        solutionScene: {
          ...startScene,
          objects: [
            ...startScene.objects,
            { id: 's-ka', kind: 'circle', cx: A.x, cy: A.y, r },
            { id: 's-kb', kind: 'circle', cx: B.x, cy: B.y, r },
            { id: 's-p', kind: 'point', x: P.x, y: P.y },
            { id: 's-q', kind: 'point', x: Q.x, y: Q.y },
            { id: 's-m', kind: 'line', x1: P.x, y1: P.y, x2: Q.x, y2: Q.y },
          ],
        },
        solution: `Mittelsenkrechte durch P(${fmt(P.x)}|${fmt(P.y)}) und Q(${fmt(Q.x)}|${fmt(Q.y)})`,
        explanation: `Beide Kreisbögen haben den Radius ${fmt(r)} cm, der größer ist als die halbe Strecke (${fmt(len / 2)} cm). Deshalb schneiden sie sich in zwei Punkten, die von A und B gleich weit entfernt sind. Die Gerade durch diese Punkte ist die Mittelsenkrechte von AB.`,
        dedupeKey: `k7mittel-konstruktion:${len}:${fmt(r)}`,
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// Lernbereich 2 — Arbeiten mit rationalen Zahlen
// ---------------------------------------------------------------------------

const addRationalNeu: Topic = asNeuTopic('k7-lb2-add-rational', {
  id: 'k7-lb2-add-rational__neu',
  title: 'Rationale Zahlen addieren',
  hint: 'Achte auf die Vorzeichen.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['rationale Zahlen', 'Vorzeichen', 'negative Zahlen', 'addieren', 'Addition', 'Zahlenstrahl'],
  fachwissen: {
    text: 'Beim Addieren rationaler Zahlen mit gleichem Vorzeichen werden die Beträge addiert und das gemeinsame Vorzeichen übernommen. Bei unterschiedlichen Vorzeichen wird der kleinere Betrag vom größeren subtrahiert; das Ergebnis trägt das Vorzeichen der betragsmäßig größeren Zahl. Auf dem Zahlenstrahl entspricht die Addition einem Sprung nach rechts (positiv) oder links (negativ).',
    quelle: 'Wikipedia: Rationale Zahl',
    url: 'https://de.wikipedia.org/wiki/Rationale_Zahl',
  },
  generate: mixedVariants(
    // V1 Tippen — Sachaufgabe (Temperatur)
    (rng: Rng) => {
      const a = randInt(rng, -15, 15)
      const change = nonZero(rng, -15, 15)
      const changeText = change >= 0 ? `steigt um ${change} °C` : `sinkt um ${Math.abs(change)} °C`
      const value = a + change
      return valueTask({
        question: `Die Temperatur beträgt ${a} °C. Sie ${changeText}. Wie viele Grad Celsius sind es danach?`,
        unit: '°C',
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `${num(a)} + ${num(change)} = ${value}. Die Temperatur beträgt danach ${value} °C.`,
        dedupeKey: `k7add-temp:${a}:${change}`,
      })
    },
    // V2 MC — typische Vorzeichenfehler
    (rng: Rng) => {
      const a = nonZero(rng, -20, 20)
      const b = nonZero(rng, -20, 20)
      const value = a + b
      const correct = formatDe(value)
      const wrong1 = formatDe(Math.abs(a) + Math.abs(b)) // Vorzeichen ignoriert
      const wrong2 = formatDe(a - b) // Vorzeichen von b falsch übernommen
      const wrong3 = formatDe(-value) // Gesamtvorzeichen vertauscht
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Berechne: ${num(a)} + ${num(b)}`,
        choices,
        correct,
        solution: correct,
        explanation: `Addiere unter Beachtung der Vorzeichen: ${num(a)} + ${num(b)} = ${value}.`,
        dedupeKey: `k7add-mc:${a}:${b}`,
      })
    },
    // V3 Portfolio — Addition als Sprung auf dem Zahlenstrahl
    (rng: Rng) => {
      const a = randInt(rng, -10, 10)
      const change = nonZero(rng, -8, 8)
      const value = a + change
      const jumpText =
        change >= 0 ? `${change} Schritte nach rechts` : `${Math.abs(change)} Schritte nach links`
      return numberLineTask({
        question: `Starte bei ${signed(a)} und springe ${jumpText} (${num(change)}). Wo landest du auf dem Zahlenstrahl?`,
        min: -20,
        max: 20,
        step: 1,
        value,
        solution: formatDe(value),
        explanation: `${num(a)} + ${num(change)} = ${value}.`,
      })
    },
  ),
})

const subRationalNeu: Topic = asNeuTopic('k7-lb2-sub-rational', {
  id: 'k7-lb2-sub-rational__neu',
  title: 'Rationale Zahlen subtrahieren',
  hint: 'Minus einer negativen Zahl heißt plus.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['rationale Zahlen', 'Vorzeichen', 'negative Zahlen', 'subtrahieren', 'Subtraktion', 'Kontostand'],
  fachwissen: {
    text: 'Subtrahieren bedeutet, die Gegenzahl zu addieren: a − b = a + (−b). Ist b selbst negativ, wird daraus eine Addition, da die Gegenzahl einer negativen Zahl positiv ist. Auf dem Zahlenstrahl entspricht das Subtrahieren einem Sprung in die entgegengesetzte Richtung wie bei der Addition derselben Zahl.',
    quelle: 'Wikipedia: Rationale Zahl',
    url: 'https://de.wikipedia.org/wiki/Rationale_Zahl',
  },
  generate: mixedVariants(
    // V1 Tippen — Sachaufgabe (Kontostand)
    (rng: Rng) => {
      const a = randInt(rng, -30, 30)
      const b = randInt(rng, 1, 30)
      const value = a - b
      return valueTask({
        question: `Ein Konto hat einen Stand von ${a} €. Es werden ${b} € abgehoben. Wie hoch ist der neue Kontostand?`,
        unit: '€',
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `${num(a)} − ${num(b)} = ${value}. Der neue Kontostand beträgt ${value} €.`,
        dedupeKey: `k7sub-konto:${a}:${b}`,
      })
    },
    // V2 MC — typische Vorzeichenfehler
    (rng: Rng) => {
      const a = nonZero(rng, -20, 20)
      const b = nonZero(rng, -20, 20)
      const value = a - b
      const correct = formatDe(value)
      const wrong1 = formatDe(a + b) // Minus einer negativen Zahl nicht erkannt
      const wrong2 = formatDe(-(a - b)) // Gesamtvorzeichen vertauscht
      const wrong3 = formatDe(Math.abs(a) - Math.abs(b)) // Vorzeichen ignoriert
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Berechne: ${num(a)} − ${num(b)}`,
        choices,
        correct,
        solution: correct,
        explanation: `Subtrahieren heißt die Gegenzahl addieren: ${num(a)} − ${num(b)} = ${num(a)} + ${num(-b)} = ${value}.`,
        dedupeKey: `k7sub-mc:${a}:${b}`,
      })
    },
    // V3 Portfolio — Subtraktion als Sprung auf dem Zahlenstrahl
    (rng: Rng) => {
      const a = randInt(rng, -10, 10)
      const b = nonZero(rng, -8, 8)
      const value = a - b
      const jumpText = b >= 0 ? `${b} Schritte nach links` : `${Math.abs(b)} Schritte nach rechts`
      return numberLineTask({
        question: `Starte bei ${signed(a)} und ziehe ${num(b)} ab (springe ${jumpText}). Wo landest du auf dem Zahlenstrahl?`,
        min: -20,
        max: 20,
        step: 1,
        value,
        solution: formatDe(value),
        explanation: `${num(a)} − ${num(b)} = ${num(a)} + ${num(-b)} = ${value}.`,
      })
    },
  ),
})

const mulRationalNeu: Topic = asNeuTopic('k7-lb2-mul-rational', {
  id: 'k7-lb2-mul-rational__neu',
  title: 'Rationale Zahlen multiplizieren',
  hint: 'Gleiche Vorzeichen → plus, verschiedene → minus.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['rationale Zahlen', 'Vorzeichenregel', 'multiplizieren', 'Multiplikation', 'mal', 'Schulden'],
  fachwissen: {
    text: 'Bei der Multiplikation rationaler Zahlen gilt die Vorzeichenregel: Gleiches Vorzeichen (+·+ oder −·−) ergibt ein positives Produkt, unterschiedliche Vorzeichen (+·− oder −·+) ergeben ein negatives Produkt. Der Betrag des Produkts ist stets das Produkt der Beträge.',
    quelle: 'Wikipedia: Vorzeichenregel',
    url: 'https://de.wikipedia.org/wiki/Vorzeichenregel',
  },
  generate: mixedVariants(
    // V1 Tippen — Sachaufgabe (Schulden mehrfach)
    (rng: Rng) => {
      const n = randInt(rng, 2, 8)
      const proBetrag = -randInt(rng, 1, 15)
      const value = n * proBetrag
      return valueTask({
        question: `Du zahlst ${n}-mal Schulden von je ${Math.abs(proBetrag)} € (als negative Zahl: ${num(proBetrag)} €). Wie hoch ist der Gesamtbetrag?`,
        unit: '€',
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `${n} · ${num(proBetrag)} = ${value}. Der Gesamtbetrag beträgt ${value} €.`,
        dedupeKey: `k7mul-schulden:${n}:${proBetrag}`,
      })
    },
    // V2 MC — typische Vorzeichenfehler
    (rng: Rng) => {
      const a = nonZero(rng, -12, 12)
      const b = nonZero(rng, -12, 12)
      const value = a * b
      const correct = formatDe(value)
      const wrong1 = formatDe(-value) // Vorzeichenregel verwechselt
      const wrong2 = formatDe(a + b) // Multiplikation mit Addition verwechselt
      const wrong3 = formatDe(Math.abs(a) * Math.abs(b)) // Vorzeichen generell ignoriert
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Berechne: ${num(a)} · ${num(b)}`,
        choices,
        correct,
        solution: correct,
        explanation: `Vorzeichenregel: ${a * b >= 0 ? 'gleiche Vorzeichen ergeben ein positives' : 'verschiedene Vorzeichen ergeben ein negatives'} Ergebnis. Betrag: ${Math.abs(a)} · ${Math.abs(b)} = ${Math.abs(value)}. Also ${value}.`,
        dedupeKey: `k7mul-mc:${a}:${b}`,
      })
    },
    // V3 Portfolio — Vorzeichen von Produkten erkennen
    (rng: Rng) => {
      const p1 = [randInt(rng, 1, 9), randInt(rng, 1, 9)] as const // + · + = +
      const p2 = [-randInt(rng, 1, 9), -randInt(rng, 1, 9)] as const // − · − = +
      const p3 = [randInt(rng, 1, 9), -randInt(rng, 1, 9)] as const // + · − = −
      const p4 = [-randInt(rng, 1, 9), randInt(rng, 1, 9)] as const // − · + = −
      const label = (p: readonly [number, number]) => `${num(p[0])} · ${num(p[1])}`
      const l1 = label(p1)
      const l2 = label(p2)
      const l3 = label(p3)
      const l4 = label(p4)
      return multiSelectTask({
        question: 'Welche der folgenden Produkte ergeben ein positives Ergebnis?',
        choices: [l1, l2, l3, l4],
        correct: [l1, l2],
        solution: `${l1} und ${l2}`,
        explanation:
          'Gleiche Vorzeichen (+·+ oder −·−) ergeben ein positives Produkt; unterschiedliche Vorzeichen (+·− oder −·+) ergeben ein negatives Produkt.',
        instruction: 'Tippe alle Produkte mit positivem Ergebnis:',
      })
    },
  ),
})

const divRationalNeu: Topic = asNeuTopic('k7-lb2-div-rational', {
  id: 'k7-lb2-div-rational__neu',
  title: 'Rationale Zahlen dividieren',
  hint: 'Gleiche Vorzeichen → plus, verschiedene → minus.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['rationale Zahlen', 'Vorzeichenregel', 'dividieren', 'Division', 'teilen', 'Schulden'],
  fachwissen: {
    text: 'Bei der Division rationaler Zahlen gilt dieselbe Vorzeichenregel wie bei der Multiplikation: gleiches Vorzeichen ergibt ein positives, unterschiedliches Vorzeichen ein negatives Ergebnis. Der Betrag des Quotienten ergibt sich aus der Division der Beträge. Division durch 0 ist nicht definiert.',
    quelle: 'Wikipedia: Vorzeichenregel',
    url: 'https://de.wikipedia.org/wiki/Vorzeichenregel',
  },
  generate: mixedVariants(
    // V1 Tippen — Sachaufgabe (Schulden gleichmäßig verteilen)
    (rng: Rng) => {
      const n = randInt(rng, 2, 8)
      const proPerson = -randInt(rng, 1, 15)
      const a = proPerson * n
      return valueTask({
        question: `Schulden in Höhe von ${num(a)} € werden gleichmäßig auf ${n} Personen aufgeteilt. Wie viel Schulden (als negative Zahl) entfallen auf jede Person?`,
        unit: '€',
        answerKind: 'integer',
        value: proPerson,
        solution: formatDe(proPerson),
        explanation: `${num(a)} : ${n} = ${proPerson}. Jede Person übernimmt ${proPerson} €.`,
        dedupeKey: `k7div-schulden:${a}:${n}`,
      })
    },
    // V2 MC — typische Vorzeichenfehler
    (rng: Rng) => {
      const b = nonZero(rng, -12, 12)
      const q = nonZero(rng, -12, 12)
      const a = b * q
      const correct = formatDe(q)
      const wrong1 = formatDe(-q) // Vorzeichenregel verwechselt
      const wrong2 = formatDe(b) // Divisor statt Ergebnis genannt
      const wrong3 = formatDe(Math.abs(q)) // Vorzeichen generell ignoriert
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Berechne: ${num(a)} : ${num(b)}`,
        choices,
        correct,
        solution: correct,
        explanation: `Vorzeichenregel wie beim Multiplizieren. Betrag: ${Math.abs(a)} : ${Math.abs(b)} = ${Math.abs(q)}. Also ${num(a)} : ${num(b)} = ${q}.`,
        dedupeKey: `k7div-mc:${a}:${b}`,
      })
    },
    // V3 Portfolio — Quotienten der Größe nach ordnen (echte Reihenfolge)
    (rng: Rng) => {
      const qs = distinctNonZero(rng, 4, -8, 8)
      const bs = qs.map(() => nonZero(rng, -9, 9))
      const as = qs.map((q, i) => bs[i]! * q)
      const items = qs.map((q, i) => ({ label: `${num(as[i]!)} : ${num(bs[i]!)}`, value: q }))
      const correctOrder = items
        .map((_, i) => i)
        .sort((i, j) => items[i]!.value - items[j]!.value)
      return dragDropSortTask({
        question: 'Berechne die Quotienten und ordne sie der Größe nach (kleinster zuerst).',
        items,
        correctOrder,
        solution: correctOrder.map((i) => `${items[i]!.label} = ${items[i]!.value}`).join(' < '),
        explanation: 'Berechne jeden Quotienten einzeln (Vorzeichenregel beachten) und ordne die Ergebnisse der Größe nach.',
        rng,
      })
    },
  ),
})

const betragNeu: Topic = asNeuTopic('k7-lb2-betrag', {
  id: 'k7-lb2-betrag__neu',
  title: 'Betrag einer Zahl',
  hint: 'Der Betrag ist immer nicht negativ.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Betrag', 'Absolutbetrag', 'Betragsstriche', 'Abstand', 'Abweichung'],
  fachwissen: {
    text: 'Der Betrag |a| einer Zahl a ist ihr Abstand von 0 auf dem Zahlenstrahl und deshalb nie negativ: |a| = a für a ≥ 0 und |a| = −a für a < 0. Zwei Zahlen mit demselben Betrag unterscheiden sich nur im Vorzeichen (z. B. |5| = |−5| = 5). Beträge werden u. a. zur Beschreibung von Abweichungen vom Sollwert verwendet.',
    quelle: 'Wikipedia: Betrag (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Betrag_(Mathematik)',
  },
  generate: mixedVariants(
    // V1 Tippen — Sachaufgabe (Abweichung vom Sollwert)
    (rng: Rng) => {
      const soll = randInt(rng, -20, 20)
      const ist = soll + nonZero(rng, -15, 15)
      const value = Math.abs(ist - soll)
      return valueTask({
        question: `Der Sollwert ist ${soll}, der gemessene Istwert ${ist}. Wie groß ist die Abweichung |Istwert − Sollwert|?`,
        answerKind: 'integer',
        value,
        solution: `${value}`,
        explanation: `|${num(ist)} − ${num(soll)}| = |${ist - soll}| = ${value}.`,
        dedupeKey: `k7betrag-tippen:${soll}:${ist}`,
      })
    },
    // V2 MC — typischer Fehler: Betrag wird nicht gebildet
    (rng: Rng) => {
      const a = nonZero(rng, -30, 30)
      const value = Math.abs(a)
      const correct = `${value}`
      const wrong1 = `${a}` // kein Betrag gebildet
      const wrong2 = `${-value}` // Vorzeichen falsch gesetzt
      const wrong3 = `${value - 1}` // Rechenfehler
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Berechne den Betrag: |${a}|`,
        choices,
        correct,
        solution: correct,
        explanation: `Der Betrag ist der Abstand von 0 auf dem Zahlenstrahl und daher nie negativ: |${a}| = ${value}.`,
        dedupeKey: `k7betrag-mc:${a}`,
      })
    },
    // V3 Portfolio — Zahlen mit gegebenem Betrag erkennen
    (rng: Rng) => {
      const target = randInt(rng, 3, 14)
      const distractors: number[] = []
      while (distractors.length < 3) {
        const v = randInt(rng, -18, 18)
        if (v === 0 || Math.abs(v) === target || distractors.includes(v)) continue
        distractors.push(v)
      }
      const correctLabels = [`${target}`, `${-target}`]
      return multiSelectTask({
        question: `Welche der folgenden Zahlen haben den Betrag ${target}?`,
        choices: [...correctLabels, ...distractors.map(String)],
        correct: correctLabels,
        solution: `${target} und ${-target}`,
        explanation: `|${target}| = ${target} und |${-target}| = ${target}. Die anderen Zahlen haben einen anderen Betrag.`,
        instruction: 'Tippe alle Zahlen mit diesem Betrag:',
      })
    },
    // V4 Zahlengerade — negative und positive Zahlen einordnen (Betrag = Abstand von 0)
    (rng: Rng) => {
      const labels = pick(rng, [
        ['-2,5', '-0,5', '1,5', '2,5'],
        ['-2,5', '-1,5', '0,5', '1,5'],
        ['-1,5', '-0,5', '1,5', '2,5'],
      ])
      const items = labels.map((label, i) => ({ id: String.fromCharCode(97 + i), label, value: Number(label.replace(',', '.')) }))
      const hinweis = items
        .map((it) => {
          const k = Math.round(Math.abs(it.value) * 2)
          return `${it.label}: ${k} Striche ${it.value < 0 ? 'links' : 'rechts'} von der 0`
        })
        .join('; ')
      return numberLineMultiTask({
        question: `Ordne die Zahlen ${[labels[2], labels[0], labels[3]].join('; ')} und ${labels[1]} auf der Zahlengeraden ein. Zwischen zwei beschrifteten Strichen liegen zwei gleich große Abschnitte.`,
        min: -3,
        max: 3,
        step: 0.5,
        labelEvery: 2,
        items,
        solution: `${labels.join(' < ')} (von links nach rechts)`,
        explanation: `Ein Abschnitt ist 0,5 lang. Negative Zahlen liegen links von der 0, positive rechts. ${hinweis}. Zahlen mit gleichem Betrag haben den gleichen Abstand zur 0 und liegen spiegelbildlich zur 0.`,
        dedupeKey: `k7-nlmulti-betrag:${labels.join(',')}`,
      })
    },
  ),
})

const termVorrangNeu: Topic = asNeuTopic('k7-lb2-term-vorrang', {
  id: 'k7-lb2-term-vorrang__neu',
  title: 'Term mit Rechengesetzen auswerten',
  hint: 'Klammer vor Punkt vor Strich.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Term', 'Rechengesetze', 'Punkt vor Strich', 'Klammer', 'auswerten'],
  fachwissen: {
    text: 'Die Operatorrangfolge beim Auswerten von Termen: zuerst Klammern, dann Potenzen, dann Punktrechnung (Multiplikation/Division), zuletzt Strichrechnung (Addition/Subtraktion). Bei gleichrangigen Operationen wird von links nach rechts gerechnet. Diese Reihenfolge ist verbindlich, damit jeder Term eindeutig ausgewertet wird.',
    quelle: 'Wikipedia: Rechenregeln',
    url: 'https://de.wikipedia.org/wiki/Punkt-vor-Strich-Rechnung',
  },
  generate: mixedVariants(
    // V1 Tippen — Term mit Klammer
    (rng: Rng) => {
      const a = nonZero(rng, -9, 9)
      const b = nonZero(rng, -9, 9)
      const c = nonZero(rng, -9, 9)
      const sum = a + b
      const value = sum * c
      return valueTask({
        question: `Berechne: (${num(a)} + ${num(b)}) · ${num(c)}`,
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `Klammer zuerst: ${num(a)} + ${num(b)} = ${sum}. Dann ${sum} · ${num(c)} = ${value}.`,
        dedupeKey: `k7vorrang-tippen:${a}:${b}:${c}`,
      })
    },
    // V2 MC — typischer Reihenfolge-Fehler
    (rng: Rng) => {
      const a = nonZero(rng, -9, 9)
      const b = nonZero(rng, -9, 9)
      const c = nonZero(rng, -9, 9)
      const value = a + b * c
      const correct = formatDe(value)
      const wrong1 = formatDe((a + b) * c) // von links nach rechts statt Punkt vor Strich
      const wrong2 = formatDe(a * b + c) // Malpunkt falsch zugeordnet
      const wrong3 = formatDe(a + b + c) // Malpunkt übersehen
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Berechne: ${num(a)} + ${num(b)} · ${num(c)}`,
        choices,
        correct,
        solution: correct,
        explanation: `Punkt vor Strich: zuerst ${num(b)} · ${num(c)} = ${b * c}. Dann ${num(a)} + ${num(b * c)} = ${value}.`,
        dedupeKey: `k7vorrang-mc:${a}:${b}:${c}`,
      })
    },
    // V3 Portfolio — Rechenschritte in der richtigen Reihenfolge ordnen
    (rng: Rng) => {
      const a = nonZero(rng, -9, 9)
      const b = nonZero(rng, -9, 9)
      const c = nonZero(rng, -9, 9)
      const d = nonZero(rng, -9, 9)
      const sum1 = a + b
      const prod = sum1 * c
      const result = prod - d
      const term = `(${num(a)} + ${num(b)}) · ${num(c)} − ${num(d)}`
      const steps = [
        { label: `Klammer zuerst: ${num(a)} + ${num(b)} = ${sum1}`, value: 0 },
        { label: `Dann Punktrechnung: ${sum1} · ${num(c)} = ${prod}`, value: 1 },
        { label: `Zuletzt Strichrechnung: ${prod} − ${num(d)} = ${result}`, value: 2 },
      ]
      const correctOrder = [0, 1, 2]
      return dragDropSortTask({
        question: `Ordne die Rechenschritte zur Auswertung von ${term} in der richtigen Reihenfolge.`,
        items: steps,
        correctOrder,
        solution: steps.map((s) => s.label).join(' → '),
        explanation: 'Klammer vor Punkt vor Strich: zuerst die Klammer auflösen, dann multiplizieren, zuletzt subtrahieren.',
        rng,
      })
    },
  ),
})

const gleichungAddNeu: Topic = asNeuTopic('k7-lb2-gleichung-add', {
  id: 'k7-lb2-gleichung-add__neu',
  title: 'Gleichung umstellen: x + a = b',
  hint: 'Subtrahiere a auf beiden Seiten.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Gleichung', 'lösen', 'x', 'Äquivalenzumformung', 'Addition', 'Subtraktion'],
  fachwissen: {
    text: 'Gleichungen der Form x + a = b löst du, indem du auf beiden Seiten a subtrahierst (Äquivalenzumformung): x = b − a. Dieses Prinzip — auf beiden Seiten dasselbe tun — gilt für jede Gleichung und sichert, dass die Lösungsmenge erhalten bleibt.',
    quelle: 'Wikipedia: Gleichung',
    url: 'https://de.wikipedia.org/wiki/Gleichung',
  },
  generate: mixedVariants(
    // V1 Tippen — Sachaufgabe (Punktestand)
    (rng: Rng) => {
      const a = nonZero(rng, -15, 15)
      const x = randInt(rng, -15, 15)
      const b = x + a
      const changeText = a >= 0 ? `bekommt ${a} Punkte dazu` : `verliert ${Math.abs(a)} Punkte`
      return valueTask({
        question: `Ein Spieler hatte x Punkte. Er ${changeText} und hat danach ${b} Punkte. Wie viele Punkte x hatte er vorher?`,
        answerKind: 'integer',
        value: x,
        solution: `x = ${x}`,
        explanation: `Gleichung: x + ${num(a)} = ${b}. Löse nach x: x = ${b} − ${num(a)} = ${x}.`,
        dedupeKey: `k7gladd-tippen:${a}:${b}`,
      })
    },
    // V2 MC — typischer Vorzeichenfehler
    (rng: Rng) => {
      const a = nonZero(rng, -15, 15)
      const x = nonZero(rng, -15, 15)
      const b = x + a
      const correct = formatDe(x)
      const wrong1 = formatDe(b + a) // addiert statt subtrahiert
      const wrong2 = formatDe(-x) // Gesamtvorzeichen vertauscht
      const wrong3 = formatDe(b) // a vergessen abzuziehen
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Löse die Gleichung nach x: x + ${num(a)} = ${b}`,
        choices,
        correct,
        solution: correct,
        explanation: `Subtrahiere ${num(a)} auf beiden Seiten: x = ${b} − ${num(a)} = ${x}.`,
        dedupeKey: `k7gladd-mc:${a}:${b}`,
      })
    },
    // V3 Portfolio — Lösung auf dem Zahlenstrahl markieren
    (rng: Rng) => {
      const a = nonZero(rng, -10, 10)
      const x = randInt(rng, -10, 10)
      const b = x + a
      return numberLineTask({
        question: `Löse die Gleichung x + ${num(a)} = ${b} und markiere x auf dem Zahlenstrahl.`,
        min: -20,
        max: 20,
        step: 1,
        value: x,
        solution: `x = ${x}`,
        explanation: `x = ${b} − ${num(a)} = ${x}.`,
      })
    },
  ),
})

const gleichungMulNeu: Topic = asNeuTopic('k7-lb2-gleichung-mul', {
  id: 'k7-lb2-gleichung-mul__neu',
  title: 'Gleichung umstellen: a · x = b',
  hint: 'Dividiere beide Seiten durch a.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Gleichung', 'lösen', 'x', 'Faktor', 'Division', 'Multiplikation'],
  fachwissen: {
    text: 'Gleichungen der Form a · x = b löst du, indem du beide Seiten durch a dividierst (a ≠ 0): x = b : a. Wie bei x + a = b gilt das Prinzip der Äquivalenzumformung — was auf der einen Seite gemacht wird, muss auch auf der anderen Seite gemacht werden.',
    quelle: 'Wikipedia: Lineare Gleichung',
    url: 'https://de.wikipedia.org/wiki/Lineare_Gleichung',
  },
  generate: mixedVariants(
    // V1 Tippen
    (rng: Rng) => {
      const a = nonZero(rng, -9, 9)
      const x = nonZero(rng, -12, 12)
      const b = a * x
      return valueTask({
        question: `Löse die Gleichung nach x: ${num(a)} · x = ${num(b)}`,
        answerKind: 'integer',
        value: x,
        solution: `x = ${x}`,
        explanation: `Beide Seiten durch ${num(a)} teilen: x = ${num(b)} : ${num(a)} = ${x}.`,
        dedupeKey: `k7glmul-tippen:${a}:${b}`,
      })
    },
    // V2 MC — typischer Fehler: multipliziert statt dividiert
    (rng: Rng) => {
      const a = nonZero(rng, -9, 9)
      const x = nonZero(rng, -12, 12)
      const b = a * x
      const correct = formatDe(x)
      const wrong1 = formatDe(a * b) // multipliziert statt dividiert
      const wrong2 = formatDe(-x) // Vorzeichen vertauscht
      const wrong3 = formatDe(b) // a vergessen
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Löse die Gleichung nach x: ${num(a)} · x = ${num(b)}`,
        choices,
        correct,
        solution: correct,
        explanation: `Beide Seiten durch ${num(a)} teilen: x = ${num(b)} : ${num(a)} = ${x}.`,
        dedupeKey: `k7glmul-mc:${a}:${b}`,
      })
    },
    // V3 Portfolio — Lösung auf dem Zahlenstrahl markieren
    (rng: Rng) => {
      const a = nonZero(rng, -6, 6)
      const x = randInt(rng, -10, 10)
      const b = a * x
      return numberLineTask({
        question: `Löse die Gleichung ${num(a)} · x = ${num(b)} und markiere x auf dem Zahlenstrahl.`,
        min: -20,
        max: 20,
        step: 1,
        value: x,
        solution: `x = ${x}`,
        explanation: `x = ${num(b)} : ${num(a)} = ${x}.`,
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// Lernbereich 3 — Darstellen und Berechnen von Prismen und Pyramiden
// ---------------------------------------------------------------------------

const volumenPrismaNeu: Topic = asNeuTopic('k7-lb3-volumen-prisma', {
  id: 'k7-lb3-volumen-prisma__neu',
  title: 'Volumen von Prismen: rückwärts rechnen',
  hint: 'V = G · h → G = V : h bzw. h = V : G.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Prisma', 'Volumen', 'Grundfläche', 'Höhe', 'rückwärts rechnen'],
  fachwissen: {
    text: 'Die Volumenformel V = G · h lässt sich auch nach der Grundfläche oder der Höhe umstellen: G = V : h bzw. h = V : G. Das ist hilfreich, wenn man z. B. weiß, wie viel ein Behälter fassen soll, und daraus seine Maße bestimmen will.',
    quelle: 'Wikipedia: Prisma (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Prisma_(Geometrie)',
  },
  generate: mixedVariants(
    // V1 Tippen — rückwärts: Grundfläche aus Volumen und Höhe
    (rng: Rng) => {
      const g = randInt(rng, 3, 50)
      const h = randInt(rng, 2, 15)
      const v = g * h
      return valueTask({
        question: `Ein gerader Wassertank hat die Form eines Prismas. Er fasst ${v} cm³ und ist ${h} cm hoch. Wie groß ist seine Grundfläche G?`,
        unit: 'cm²',
        answerKind: 'integer',
        value: g,
        solution: `${g} cm²`,
        explanation: `G = V : h = ${v} cm³ : ${h} cm = ${g} cm².`,
        dedupeKey: `k7neuvolprisma-tippen:${v}:${h}`,
      })
    },
    // V2 MC — Vorwärtsrechnung mit typischen Formelfehlern
    (rng: Rng) => {
      const g = randInt(rng, 4, 40)
      const h = randInt(rng, 3, 18)
      const value = g * h
      const correct = formatDe(value)
      const wrong1 = formatDe(Math.round(value / 3)) // Pyramiden-Formel (1/3) fälschlich angewendet
      const wrong2 = formatDe(g + h) // addiert statt multipliziert
      const wrong3 = formatDe(value * 2) // wie bei der Oberfläche verdoppelt
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein gerades Prisma hat die Grundfläche ${g} cm² und die Höhe ${h} cm. Welches Volumen hat es?`,
        choices,
        correct,
        solution: correct,
        explanation: `V = G · h = ${g} cm² · ${h} cm = ${value} cm³.`,
        dedupeKey: `k7neuvolprisma-mc:${g}:${h}`,
      })
    },
    // V3 Portfolio — Volumen am Regler berechnen und einstellen
    (rng: Rng) => {
      const g = randInt(rng, 4, 30)
      const h = randInt(rng, 2, 12)
      const value = g * h
      const svg = generatePrismVolumeSvg({ baseAreaLabel: `${g} cm²`, heightLabel: `${h} cm` })
      return paramSliderTask({
        question:
          'Berechne das Volumen des abgebildeten Prismas aus Grundfläche und Höhe und stelle es am Regler ein.',
        params: [{ id: 'volumen', label: 'Volumen (cm³)', min: 0, max: 400, step: 10, start: 200 }],
        correct: { volumen: value },
        solution: `${value} cm³`,
        explanation: `V = G · h = ${g} · ${h} = ${value} cm³.`,
        visualContent: svg,
        instruction: 'Stelle das berechnete Volumen ein:',
      })
    },
  ),
})

const mantelPrismaNeu: Topic = asNeuTopic('k7-lb3-mantel-prisma', {
  id: 'k7-lb3-mantel-prisma__neu',
  title: 'Mantelfläche & Oberfläche von Prismen',
  hint: 'O = M + 2 · G; M = U · h.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Prisma', 'Mantelfläche', 'Oberfläche', 'Umfang', 'Grundfläche'],
  fachwissen: {
    text: 'Die Oberfläche eines Prismas setzt sich aus der Mantelfläche M und den beiden Grundflächen G zusammen: O = M + 2 · G. Wer die Mantelfläche kennt, kann daraus bei bekannter Höhe auch den Umfang der Grundfläche zurückrechnen: U = M : h.',
    quelle: 'Wikipedia: Prisma (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Prisma_(Geometrie)',
  },
  generate: mixedVariants(
    // V1 Tippen — rückwärts: Umfang der Grundfläche aus Mantelfläche und Höhe
    (rng: Rng) => {
      const h = randInt(rng, 2, 15)
      const u = randInt(rng, 6, 30)
      const m = u * h
      return valueTask({
        question: `Ein Prisma hat die Mantelfläche M = ${m} cm² und die Höhe ${h} cm. Welchen Umfang hat seine Grundfläche?`,
        unit: 'cm',
        answerKind: 'integer',
        value: u,
        solution: `${u} cm`,
        explanation: `U = M : h = ${m} cm² : ${h} cm = ${u} cm.`,
        dedupeKey: `k7neumantel-tippen:${m}:${h}`,
      })
    },
    // V2 MC — Oberfläche aus Mantel- und Grundflächen (typische Fehler)
    (rng: Rng) => {
      const m = randInt(rng, 20, 150)
      const g = randInt(rng, 5, 60)
      const value = m + 2 * g
      const correct = formatDe(value)
      const wrong1 = formatDe(m + g) // Faktor 2 bei den Grundflächen vergessen
      const wrong2 = formatDe(2 * m + g) // Mantel statt Grundfläche verdoppelt
      const wrong3 = formatDe(2 * (m + g)) // alles verdoppelt
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Prisma hat die Mantelfläche M = ${m} cm² und zwei gleich große Grundflächen mit je G = ${g} cm². Berechne die Oberfläche O = M + 2 · G.`,
        choices,
        correct,
        solution: correct,
        explanation: `O = M + 2 · G = ${m} + 2 · ${g} = ${value} cm².`,
        dedupeKey: `k7neumantel-mc:${m}:${g}`,
      })
    },
    // V3 Portfolio — Mantelfläche eines Quaders (Spezialfall des Prismas) am Regler
    (rng: Rng) => {
      const a = randInt(rng, 3, 12)
      const b = randInt(rng, 3, 12)
      const c = randInt(rng, 2, 15)
      const value = 2 * (a + b) * c
      const svg = generateCuboidSvg({ lengthLabel: `${a} cm`, widthLabel: `${b} cm`, heightLabel: `${c} cm` })
      return paramSliderTask({
        question:
          'Der abgebildete Quader ist ein spezielles Prisma. Berechne seine Mantelfläche (alle Seitenflächen ohne Deckel/Boden) und stelle sie am Regler ein.',
        params: [{ id: 'mantel', label: 'Mantelfläche (cm²)', min: 0, max: 750, step: 10, start: 375 }],
        correct: { mantel: value },
        solution: `${value} cm²`,
        explanation: `Umfang der Grundfläche U = 2 · (a + b) = 2 · (${a} + ${b}) = ${2 * (a + b)} cm. Mantelfläche M = U · c = ${2 * (a + b)} · ${c} = ${value} cm².`,
        visualContent: svg,
        instruction: 'Stelle die berechnete Mantelfläche ein:',
      })
    },
  ),
})

const volumenPyramideNeu: Topic = asNeuTopic('k7-lb3-volumen-pyramide', {
  id: 'k7-lb3-volumen-pyramide__neu',
  title: 'Volumen von Pyramiden: Vergleich mit dem Prisma',
  hint: 'V_Pyramide = V_Prisma : 3 (gleiche Grundfläche und Höhe).',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Pyramide', 'Volumen', 'Prisma', 'ein Drittel', 'Vergleich'],
  fachwissen: {
    text: 'Da eine Pyramide bei gleicher Grundfläche und Höhe genau ein Drittel des Volumens des entsprechenden Prismas hat, lässt sich ihr Volumen auch direkt aus dem Prismenvolumen ablesen: V_Pyramide = V_Prisma : 3. Umgekehrt gilt V_Prisma = 3 · V_Pyramide.',
    quelle: 'Wikipedia: Pyramide (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Pyramide_(Geometrie)',
  },
  generate: mixedVariants(
    // V1 Tippen — Vergleich mit dem Volumen des entsprechenden Prismas
    (rng: Rng) => {
      const vp = 3 * randInt(rng, 2, 100)
      const value = vp / 3
      return valueTask({
        question: `Eine Pyramide hat dieselbe Grundfläche und Höhe wie ein Prisma mit dem Volumen ${vp} cm³. Welches Volumen hat die Pyramide?`,
        unit: 'cm³',
        answerKind: 'integer',
        value,
        solution: `${value} cm³`,
        explanation: `Bei gleicher Grundfläche und Höhe ist das Pyramidenvolumen ein Drittel des Prismenvolumens: ${vp} cm³ : 3 = ${value} cm³.`,
        dedupeKey: `k7neuvolpyr-tippen:${vp}`,
      })
    },
    // V2 MC — Vorwärtsrechnung mit typischen Formelfehlern
    (rng: Rng) => {
      const g = 3 * randInt(rng, 2, 30)
      const h = randInt(rng, 2, 16)
      const value = (g * h) / 3
      const correct = formatDe(value)
      const wrong1 = formatDe(g * h) // 1/3 vergessen (Prisma-Formel)
      const wrong2 = formatDe((g * h) / 2) // falscher Faktor 1/2 statt 1/3
      const wrong3 = formatDe(g * h * 3) // mit 3 multipliziert statt dividiert
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Eine Pyramide hat die Grundfläche ${g} cm² und die Höhe ${h} cm. Berechne ihr Volumen.`,
        choices,
        correct,
        solution: correct,
        explanation: `V = (1/3) · G · h = (1/3) · ${g} · ${h} = ${value} cm³.`,
        dedupeKey: `k7neuvolpyr-mc:${g}:${h}`,
      })
    },
    // V3 Portfolio — Volumen am Regler berechnen und einstellen
    (rng: Rng) => {
      const g = 3 * randInt(rng, 2, 20)
      const h = randInt(rng, 2, 12)
      const value = (g * h) / 3
      const svg = generatePyramidVolumeSvg({ baseAreaLabel: `${g} cm²`, heightLabel: `${h} cm` })
      return paramSliderTask({
        question:
          'Berechne das Volumen der abgebildeten Pyramide aus Grundfläche und Höhe und stelle es am Regler ein.',
        params: [{ id: 'volumen', label: 'Volumen (cm³)', min: 0, max: 260, step: 10, start: 130 }],
        correct: { volumen: value },
        solution: `${value} cm³`,
        explanation: `V = (1/3) · G · h = (1/3) · ${g} · ${h} = ${value} cm³.`,
        visualContent: svg,
        instruction: 'Stelle das berechnete Volumen ein:',
      })
    },
  ),
})

const oberflaechePrismaNeu: Topic = asNeuTopic('k7-lb3-oberflaeche-quader', {
  id: 'k7-lb3-oberflaeche-quader__neu',
  title: 'Oberfläche des Quaders in Sachaufgaben',
  hint: 'O = 2 · (a·b + a·c + b·c).',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Quader', 'Oberfläche', 'Verpackung', 'Material', 'Flächenpaare'],
  fachwissen: {
    text: 'Beim Verpacken oder Bekleben eines Quaders zählt jede der sechs Flächen einmal: zwei gleich große Grund-/Deckflächen, zwei Seitenflächen und zwei Vorder-/Rückflächen. Deshalb addiert man bei O = 2 · (a·b + a·c + b·c) jedes der drei Flächenpaare genau einmal und verdoppelt die Summe.',
    quelle: 'Wikipedia: Quader',
    url: 'https://de.wikipedia.org/wiki/Quader',
  },
  generate: mixedVariants(
    // V1 Tippen — Sachaufgabe (Geschenkbox bekleben)
    (rng: Rng) => {
      const a = randInt(rng, 3, 16)
      const b = randInt(rng, 3, 16)
      const c = randInt(rng, 3, 16)
      const value = 2 * (a * b + a * c + b * c)
      return valueTask({
        question: `Eine Geschenkbox in Quaderform ist ${a} cm lang, ${b} cm breit und ${c} cm hoch. Wie viel Geschenkpapier brauchst du mindestens, um die ganze Box lückenlos zu bekleben?`,
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `O = 2 · (a·b + a·c + b·c) = 2 · (${a * b} + ${a * c} + ${b * c}) cm² = ${value} cm².`,
        dedupeKey: `k7neuoberquader-tippen:${a}:${b}:${c}`,
      })
    },
    // V2 MC — typische Fehler
    (rng: Rng) => {
      const a = randInt(rng, 2, 14)
      const b = randInt(rng, 2, 14)
      const c = randInt(rng, 2, 14)
      const value = 2 * (a * b + a * c + b * c)
      const correct = formatDe(value)
      const wrong1 = formatDe(a * b + a * c + b * c) // Faktor 2 vergessen
      const wrong2 = formatDe(2 * (a * b + a * c)) // ein Flächenpaar (b·c) vergessen
      const wrong3 = formatDe(a * b * c) // Volumen statt Oberfläche berechnet
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Quader ist ${a} cm, ${b} cm und ${c} cm groß. Berechne seinen Oberflächeninhalt.`,
        choices,
        correct,
        solution: correct,
        explanation: `O = 2 · (${a * b} + ${a * c} + ${b * c}) = ${value} cm².`,
        dedupeKey: `k7neuoberquader-mc:${a}:${b}:${c}`,
      })
    },
    // V3 Portfolio — Oberfläche am Regler berechnen und einstellen
    (rng: Rng) => {
      const a = randInt(rng, 2, 10)
      const b = randInt(rng, 2, 10)
      const c = randInt(rng, 2, 10)
      const value = 2 * (a * b + a * c + b * c)
      const svg = generateCuboidSvg({ lengthLabel: `${a} cm`, widthLabel: `${b} cm`, heightLabel: `${c} cm` })
      return paramSliderTask({
        question: 'Berechne die Oberfläche des abgebildeten Quaders und stelle sie am Regler ein.',
        params: [{ id: 'oberflaeche', label: 'Oberfläche (cm²)', min: 0, max: 650, step: 10, start: 325 }],
        correct: { oberflaeche: value },
        solution: `${value} cm²`,
        explanation: `O = 2 · (${a * b} + ${a * c} + ${b * c}) = ${value} cm².`,
        visualContent: svg,
        instruction: 'Stelle die berechnete Oberfläche ein:',
      })
    },
  ),
})

const oberflaechePyramideNeu: Topic = asNeuTopic('k7-lb3-oberflaeche-pyramide', {
  id: 'k7-lb3-oberflaeche-pyramide__neu',
  title: 'Oberfläche der Pyramide: rückwärts rechnen',
  hint: 'M = O − a²; hₛ = M : (2 · a).',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Pyramide', 'Oberfläche', 'Seitenflächenhöhe', 'rückwärts rechnen'],
  fachwissen: {
    text: 'Oberfläche und Mantelfläche einer quadratischen Pyramide lassen sich auch rückwärts erschließen: Ist die Oberfläche O und die Grundkante a bekannt, ergibt sich zunächst die Mantelfläche M = O − a², und daraus die Seitenflächenhöhe hₛ = M : (2 · a).',
    quelle: 'Wikipedia: Pyramide (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Pyramide_(Geometrie)',
  },
  generate: mixedVariants(
    // V1 Tippen — rückwärts: Seitenflächenhöhe aus Oberfläche und Grundkante
    (rng: Rng) => {
      const a = randInt(rng, 3, 12)
      const hs = randInt(rng, 3, 14)
      const o = a * a + 2 * a * hs
      return valueTask({
        question: `Eine quadratische Pyramide hat die Grundkante a = ${a} cm und die Oberfläche O = ${o} cm². Wie groß ist die Seitenflächenhöhe hₛ?`,
        unit: 'cm',
        answerKind: 'integer',
        value: hs,
        solution: `${hs} cm`,
        explanation: `G = a² = ${a}² = ${a * a} cm². M = O − G = ${o} − ${a * a} = ${o - a * a} cm². hₛ = M : (2 · a) = ${o - a * a} : ${2 * a} = ${hs} cm.`,
        dedupeKey: `k7neuoberpyr-tippen:${a}:${o}`,
      })
    },
    // V2 MC — Vorwärtsrechnung mit typischen Fehlern
    (rng: Rng) => {
      const a = randInt(rng, 3, 12)
      const hs = randInt(rng, 3, 14)
      const value = a * a + 2 * a * hs
      const correct = formatDe(value)
      const wrong1 = formatDe(a + 2 * a * hs) // a statt a² (Grundfläche falsch)
      const wrong2 = formatDe(a * a + a * hs) // Faktor 2 beim Mantel vergessen
      const wrong3 = formatDe(2 * a * hs) // Grundfläche vergessen (nur Mantel)
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Quadratische Pyramide: a = ${a} cm, Seitenflächenhöhe hₛ = ${hs} cm. Berechne die Oberfläche O = a² + 2 · a · hₛ.`,
        choices,
        correct,
        solution: correct,
        explanation: `O = ${a}² + 2 · ${a} · ${hs} = ${a * a} + ${2 * a * hs} = ${value} cm².`,
        dedupeKey: `k7neuoberpyr-mc:${a}:${hs}`,
      })
    },
    // V3 Portfolio — Oberfläche am Regler berechnen und einstellen
    (rng: Rng) => {
      const a = randInt(rng, 3, 10)
      const hs = randInt(rng, 3, 12)
      const value = a * a + 2 * a * hs
      const svg = generatePyramidSurfaceSvg({ edgeLabel: `${a} cm`, slantHeightLabel: `${hs} cm` })
      return paramSliderTask({
        question:
          'Berechne die Oberfläche der abgebildeten quadratischen Pyramide (O = a² + 2 · a · hₛ) und stelle sie am Regler ein.',
        params: [{ id: 'oberflaeche', label: 'Oberfläche (cm²)', min: 0, max: 350, step: 10, start: 175 }],
        correct: { oberflaeche: value },
        solution: `${value} cm²`,
        explanation: `O = ${a}² + 2 · ${a} · ${hs} = ${value} cm².`,
        visualContent: svg,
        instruction: 'Stelle die berechnete Oberfläche ein:',
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// Lernbereich 4 — Vernetzung: Darstellen von Daten
// ---------------------------------------------------------------------------

const mittelwertNeu: Topic = asNeuTopic('k7-lb4-mittelwert', {
  id: 'k7-lb4-mittelwert__neu',
  title: 'Arithmetisches Mittel: fehlenden Wert finden',
  hint: 'Summe aller Werte = Mittelwert · Anzahl.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Mittelwert', 'arithmetisches Mittel', 'Durchschnitt', 'fehlender Wert', 'Statistik'],
  fachwissen: {
    text: 'Ist der Mittelwert mehrerer Werte sowie alle Werte außer einem bekannt, lässt sich der fehlende Wert zurückrechnen: Summe aller Werte = Mittelwert · Anzahl; der fehlende Wert ist diese Summe minus die Summe der bekannten Werte. Diese Rückwärtsrechnung wird z. B. verwendet, wenn eine fehlende Messung ergänzt werden soll.',
    quelle: 'Wikipedia: Arithmetisches Mittel',
    url: 'https://de.wikipedia.org/wiki/Arithmetisches_Mittel',
  },
  generate: mixedVariants(
    // V1 Tippen — Sachaufgabe (Punktzahlen)
    (rng: Rng) => {
      const count = randInt(rng, 4, 6)
      const numbers: number[] = []
      for (let i = 0; i < count; i++) numbers.push(randInt(rng, 2, 30))
      let sum = numbers.reduce((s, x) => s + x, 0)
      const rem = sum % count
      if (rem !== 0) {
        numbers[count - 1] += count - rem
        sum += count - rem
      }
      const mean = sum / count
      return valueTask({
        question: `Mia hat in ${count} Tests folgende Punktzahlen erreicht: ${numbers.join(', ')}. Berechne ihren Durchschnitt (arithmetisches Mittel).`,
        answerKind: 'integer',
        value: mean,
        solution: formatDe(mean),
        explanation: `Summe: ${numbers.join(' + ')} = ${sum}. Teile durch die Anzahl ${count}: ${sum} : ${count} = ${formatDe(mean)}.`,
        dedupeKey: `k7neumittel-tippen:${numbers.join('.')}`,
      })
    },
    // V2 MC — fehlenden Wert finden (Temperaturen, mit Vorzeichen)
    (rng: Rng) => {
      const n = randInt(rng, 4, 5)
      const mean = randInt(rng, -5, 15)
      const deltas = Array.from({ length: n - 1 }, () => nonZero(rng, -6, 6))
      const others = deltas.map((d) => mean + d)
      const sumOthers = others.reduce((s, x) => s + x, 0)
      const x = mean * n - sumOthers
      const correct = formatDe(x)
      const wrong1 = formatDe(mean) // verwechselt fehlenden Wert mit dem Mittelwert
      const wrong2 = formatDe(mean * (n - 1) - sumOthers) // nutzt n − 1 statt n Werte
      const wrong3 = formatDe(-x) // Vorzeichenfehler
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `An ${n} Tagen wurden diese Temperaturen gemessen (ein Tag fehlt): ${others.join(', ')} °C. Der Durchschnitt aller ${n} Tage beträgt ${mean} °C. Welche Temperatur wurde am fehlenden Tag gemessen?`,
        choices,
        correct,
        solution: correct,
        explanation: `Summe aller ${n} Werte = Mittelwert · Anzahl = ${mean} · ${n} = ${mean * n}. Bekannte Summe: ${others.map((v) => num(v)).join(' + ')} = ${sumOthers}. Fehlender Wert = ${mean * n} − ${sumOthers} = ${x}.`,
        dedupeKey: `k7neumittel-mc:${mean}:${others.join('.')}`,
      })
    },
    // V3 Portfolio — Mittelwert auf dem Zahlenstrahl markieren
    (rng: Rng) => {
      const count = randInt(rng, 4, 5)
      const numbers: number[] = []
      for (let i = 0; i < count; i++) numbers.push(randInt(rng, -12, 12))
      let sum = numbers.reduce((s, x) => s + x, 0)
      const rem = ((sum % count) + count) % count
      if (rem !== 0) {
        numbers[count - 1] += count - rem
        sum += count - rem
      }
      const mean = sum / count
      return numberLineTask({
        question: `Messwerte: ${numbers.join(', ')}. Markiere das arithmetische Mittel (Durchschnitt) auf dem Zahlenstrahl.`,
        min: -20,
        max: 20,
        step: 1,
        value: mean,
        solution: formatDe(mean),
        explanation: `Summe: ${numbers.map((v) => num(v)).join(' + ')} = ${sum}. ${sum} : ${count} = ${formatDe(mean)}.`,
      })
    },
  ),
})

const medianNeu: Topic = asNeuTopic('k7-lb4-median', {
  id: 'k7-lb4-median__neu',
  title: 'Median bei gerader Anzahl',
  hint: 'Gerade Anzahl: Mittel der beiden mittleren Werte.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Median', 'Zentralwert', 'gerade Anzahl', 'sortieren', 'Statistik'],
  fachwissen: {
    text: 'Bei einer geraden Anzahl von Werten gibt es keinen einzelnen mittleren Wert: Der Median ist dann das arithmetische Mittel der beiden mittleren Werte der sortierten Reihe. Bei ungerader Anzahl ist er dagegen genau der mittlere Wert. In beiden Fällen muss zuerst sortiert werden.',
    quelle: 'Wikipedia: Median',
    url: 'https://de.wikipedia.org/wiki/Median',
  },
  generate: mixedVariants(
    // V1 Tippen — gerade Anzahl (Median = Mittel der beiden mittleren Werte)
    (rng: Rng) => {
      const count = pick(rng, [4, 6])
      const set = new Set<number>()
      while (set.size < count) set.add(randInt(rng, 1, 50))
      const numbers = [...set]
      const sorted = [...numbers].sort((a, b) => a - b)
      const mid1 = sorted[count / 2 - 1]!
      const mid2 = sorted[count / 2]!
      const value = (mid1 + mid2) / 2
      return valueTask({
        question: `Bestimme den Median von ${numbers.join(', ')}.`,
        answerKind: 'decimal',
        value,
        solution: formatDe(value),
        explanation: `Sortiert: ${sorted.join(', ')}. Bei ${count} Werten (gerade Anzahl) gibt es zwei mittlere Werte: ${mid1} und ${mid2}. Median = (${mid1} + ${mid2}) : 2 = ${formatDe(value)}.`,
        dedupeKey: `k7neumedian-tippen:${numbers.join('.')}`,
      })
    },
    // V2 MC — typischer Fehler: nicht sortieren / falsche Mitte
    (rng: Rng) => {
      const count = pick(rng, [5, 7])
      const set = new Set<number>()
      while (set.size < count) set.add(randInt(rng, 1, 60))
      const numbers = [...set]
      const sorted = [...numbers].sort((a, b) => a - b)
      const midIdx = (count - 1) / 2
      const value = sorted[midIdx]!
      const correct = `${value}`
      const wrong1 = `${numbers[midIdx]}` // Mitte der UNsortierten Liste (nicht sortiert!)
      const meanVal = Math.round(numbers.reduce((s, x) => s + x, 0) / count)
      const wrong2 = `${meanVal}` // verwechselt mit dem arithmetischen Mittel
      const wrong3 = `${sorted[midIdx + 1]!}` // falsche Position (Verrutscher)
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Bestimme den Median von ${numbers.join(', ')}.`,
        choices,
        correct,
        solution: correct,
        explanation: `Zuerst sortieren: ${sorted.join(', ')}. Bei ${count} Werten (ungerade Anzahl) ist der mittlere Wert (Position ${midIdx + 1}) der Median: ${value}.`,
        dedupeKey: `k7neumedian-mc:${numbers.join('.')}`,
      })
    },
    // V3 Portfolio — Median auf dem Zahlenstrahl markieren
    (rng: Rng) => {
      const count = pick(rng, [4, 5, 6, 7])
      const set = new Set<number>()
      while (set.size < count) set.add(randInt(rng, 1, 35))
      const numbers = [...set]
      const sorted = [...numbers].sort((a, b) => a - b)
      const isEven = count % 2 === 0
      const value = isEven ? (sorted[count / 2 - 1]! + sorted[count / 2]!) / 2 : sorted[(count - 1) / 2]!
      return numberLineTask({
        question: `Werte: ${numbers.join(', ')}. Sortiere gedanklich und markiere den Median auf dem Zahlenstrahl.`,
        min: 0,
        max: 40,
        step: isEven ? 0.5 : 1,
        decimals: isEven ? 1 : 0,
        value,
        solution: formatDe(value),
        explanation: isEven
          ? `Sortiert: ${sorted.join(', ')}. Zwei mittlere Werte: ${sorted[count / 2 - 1]} und ${sorted[count / 2]}. Median = (${sorted[count / 2 - 1]} + ${sorted[count / 2]}) : 2 = ${formatDe(value)}.`
          : `Sortiert: ${sorted.join(', ')}. Mittlerer Wert: ${value}.`,
      })
    },
  ),
})

const spannweiteNeu: Topic = asNeuTopic('k7-lb4-spannweite', {
  id: 'k7-lb4-spannweite__neu',
  title: 'Spannweite: Maximum und Minimum verknüpfen',
  hint: 'Maximum = Minimum + Spannweite.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Spannweite', 'Maximum', 'Minimum', 'negative Zahlen', 'Statistik'],
  fachwissen: {
    text: 'Die Spannweite lässt sich auch rückwärts nutzen: Kennt man die Spannweite R und den kleinsten Wert einer Datenreihe, ergibt sich der größte Wert durch Maximum = Minimum + R. Negative Werte (z. B. Temperaturen) werden dabei wie gewohnt auf dem Zahlenstrahl behandelt.',
    quelle: 'Wikipedia: Spannweite (Statistik)',
    url: 'https://de.wikipedia.org/wiki/Spannweite_(Statistik)',
  },
  generate: mixedVariants(
    // V1 Tippen — Sachaufgabe mit negativen Werten (Temperaturen)
    (rng: Rng) => {
      const count = randInt(rng, 4, 6)
      const numbers: number[] = []
      for (let i = 0; i < count; i++) numbers.push(randInt(rng, -15, 20))
      const max = Math.max(...numbers)
      const min = Math.min(...numbers)
      const value = max - min
      return valueTask({
        question: `An ${count} Tagen wurden diese Tiefsttemperaturen gemessen: ${numbers.join(', ')} °C. Bestimme die Spannweite.`,
        unit: '°C',
        answerKind: 'integer',
        value,
        solution: `${value}`,
        explanation: `Größter Wert ${max}, kleinster Wert ${min}. Spannweite = ${num(max)} − ${num(min)} = ${value}.`,
        dedupeKey: `k7neuspann-tippen:${numbers.join('.')}`,
      })
    },
    // V2 MC — rückwärts: größter Wert aus Spannweite und kleinstem Wert
    (rng: Rng) => {
      const r = randInt(rng, 5, 40)
      const minV = randInt(rng, -10, 30)
      const maxV = minV + r
      const correct = `${maxV}`
      const wrong1 = `${minV - r}` // subtrahiert statt addiert
      const wrong2 = `${r}` // verwechselt Spannweite mit dem größten Wert
      const wrong3 = `${minV + 2 * r}` // Rechenfehler (Faktor 2)
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Eine Datenreihe hat die Spannweite R = ${r} und den kleinsten Wert ${minV}. Wie groß ist der größte Wert?`,
        choices,
        correct,
        solution: correct,
        explanation: `Maximum = Minimum + R = ${num(minV)} + ${r} = ${maxV}.`,
        dedupeKey: `k7neuspann-mc:${r}:${minV}`,
      })
    },
    // V3 Portfolio — Spannweite auf dem Zahlenstrahl markieren
    (rng: Rng) => {
      const count = randInt(rng, 4, 6)
      const numbers: number[] = []
      for (let i = 0; i < count; i++) numbers.push(randInt(rng, -15, 15))
      const max = Math.max(...numbers)
      const min = Math.min(...numbers)
      const value = max - min
      return numberLineTask({
        question: `Werte: ${numbers.join(', ')}. Markiere die Spannweite (R = größter − kleinster Wert) auf dem Zahlenstrahl.`,
        min: 0,
        max: 40,
        step: 1,
        value,
        solution: `${value}`,
        explanation: `Größter Wert ${max}, kleinster Wert ${min}. R = ${num(max)} − ${num(min)} = ${value}.`,
      })
    },
  ),
})

const relativeHaeufigkeitNeu: Topic = asNeuTopic('k7-lb4-rel-haeufigkeit', {
  id: 'k7-lb4-rel-haeufigkeit__neu',
  title: 'Relative Häufigkeit: absolute Anzahl finden',
  hint: 'Anzahl = relative Häufigkeit (%) · Gesamtanzahl : 100.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['relative Häufigkeit', 'Prozent', 'absolute Häufigkeit', 'Statistik'],
  fachwissen: {
    text: 'Kennt man die relative Häufigkeit in Prozent und die Gesamtanzahl der Versuche, lässt sich die absolute Häufigkeit zurückrechnen: Anzahl = relative Häufigkeit (%) · Gesamtanzahl : 100. So lässt sich z. B. aus einem in einer Grafik abgelesenen Prozentwert die tatsächliche Personenzahl bestimmen.',
    quelle: 'Wikipedia: Relative Häufigkeit',
    url: 'https://de.wikipedia.org/wiki/Relative_H%C3%A4ufigkeit',
  },
  generate: mixedVariants(
    // V1 Tippen — rückwärts: absolute Häufigkeit aus Prozent und Gesamtanzahl
    (rng: Rng) => {
      const total = pick(rng, [10, 20, 25, 40, 50, 100])
      const k = randInt(rng, 1, total - 1)
      const pct = roundTo((k / total) * 100, 2)
      return valueTask({
        question: `Bei einer Umfrage unter ${total} Personen betrug die relative Häufigkeit der Antwort „ja" ${formatDe(pct)} %. Wie viele Personen haben mit „ja" geantwortet?`,
        answerKind: 'integer',
        value: k,
        solution: `${k}`,
        explanation: `Absolute Häufigkeit = relative Häufigkeit · Gesamtanzahl : 100 = ${formatDe(pct)} % · ${total} : 100 = ${k}.`,
        dedupeKey: `k7neurel-tippen:${total}:${k}`,
      })
    },
    // V2 MC — typische Fehler bei der Prozentumrechnung
    (rng: Rng) => {
      const total = pick(rng, [10, 20, 25, 40, 50, 100])
      const k = randInt(rng, Math.max(1, Math.round(total / 10)), total - Math.max(1, Math.round(total / 10)))
      const pct = roundTo((k / total) * 100, 2)
      const correct = `${formatDe(pct)} %`
      const wrong1 = `${formatDe(roundTo(k / total, 2))} %` // vergisst ×100 (Dezimalzahl statt Prozent)
      const wrong2 = `${formatDe(roundTo(((total - k) / total) * 100, 2))} %` // verwechselt mit Gegenereignis
      const wrong3 = `${formatDe(roundTo((total / k) * 100, 2))} %` // Bruch verdreht (total/k statt k/total)
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Von ${total} befragten Personen antworteten ${k} mit „ja". Wie groß ist die relative Häufigkeit in Prozent?`,
        choices,
        correct,
        solution: correct,
        explanation: `Relative Häufigkeit = ${k} : ${total} = ${formatDe(k / total)}. In Prozent: · 100 = ${formatDe(pct)} %.`,
        dedupeKey: `k7neurel-mc:${total}:${k}`,
      })
    },
    // V3 Portfolio — Glücksrad: relative Häufigkeit am Regler schätzen
    (rng: Rng) => {
      const n = pick(rng, [4, 5, 6, 8])
      const colors = ['Rot', 'Blau', 'Grün', 'Gelb', 'Lila', 'Orange', 'Türkis', 'Pink']
      const sectors = colors.slice(0, n)
      const askIdx = randInt(rng, 0, n - 1)
      const pct = roundTo((1 / n) * 100, 2)
      return paramSliderTask({
        question: `Das Glücksrad hat ${n} gleich große Sektoren. Wie groß ist die relative Häufigkeit (in %) für den markierten Sektor „${sectors[askIdx]}"? Stelle sie am Regler ein.`,
        params: [{ id: 'prozent', label: 'Prozent (%)', min: 0, max: 100, step: 5, start: 50 }],
        correct: { prozent: pct },
        solution: `${formatDe(pct)} %`,
        explanation: `Bei ${n} gleich großen Sektoren ist jede relative Häufigkeit 1 : ${n} = ${formatDe(pct)} %.`,
        visualContent: generateSpinnerSvg({ payoffs: sectors, highlightIndex: askIdx }),
        instruction: 'Stelle die geschätzte relative Häufigkeit ein:',
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const math7NeuLb1: Topic[] = [
  nebenwinkelNeu,
  scheitelwinkelNeu,
  winkelsummeVieleckNeu,
  basiswinkelNeu,
  mittelsenkrechteSchritteNeu,
]
export const math7NeuLb2: Topic[] = [
  addRationalNeu,
  subRationalNeu,
  mulRationalNeu,
  divRationalNeu,
  betragNeu,
  termVorrangNeu,
  gleichungAddNeu,
  gleichungMulNeu,
]
export const math7NeuLb3: Topic[] = [
  volumenPrismaNeu,
  mantelPrismaNeu,
  volumenPyramideNeu,
  oberflaechePrismaNeu,
  oberflaechePyramideNeu,
]
export const math7NeuLb4: Topic[] = [mittelwertNeu, medianNeu, spannweiteNeu, relativeHaeufigkeitNeu]

export const math7NeuTopics: Topic[] = [
  ...math7NeuLb1,
  ...math7NeuLb2,
  ...math7NeuLb3,
  ...math7NeuLb4,
]
