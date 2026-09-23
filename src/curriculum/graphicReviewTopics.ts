/**
 * Pending graphic/interactive topics (released:false) under existing parents.
 * After visual QA: merge into the parent topic and remove these entries.
 *
 * Worksheet patterns: Steigungsdreieck / Gerade zeichnen / Scheitel tippen /
 * Nullstelle tippen / Tangente-Steigung / Fläche unter Graph.
 */
import { pick, randInt, type Rng } from '../lib/rng'
import {
  generateFunctionGraphSvg,
  generateLinearFunctionSvg,
} from '../lib/geometrySvg'
import {
  coordinateClickTask,
  coordinateDrawTask,
  paramSliderTask,
  visualTask,
} from './taskHelpers'
import { asGraphicReview } from './graphicReview'
import { emptyCoordinateScene } from '../lib/coordinateScene'
import type { Topic } from './types'

const num = (n: number): string => (n < 0 ? `(−${Math.abs(n)})` : `${n}`)
const nonZero = (rng: Rng, min: number, max: number): number => {
  let v = 0
  while (v === 0) v = randInt(rng, min, max)
  return v
}

const scheitelForm = (a: number, d: number, e: number): string => {
  const aStr = a === 1 ? '' : a === -1 ? '−' : `${a}·`
  const inner = d < 0 ? `x + ${Math.abs(d)}` : `x − ${d}`
  return `f(x) = ${aStr}(${inner})² + ${num(e)}`
}

// ---------------------------------------------------------------------------
// Klasse 8 — lineare Funktionen
// ---------------------------------------------------------------------------

export const math8GraphicReviews: Topic[] = [
  asGraphicReview(
    'k8-lb3-steigung',
    {
      id: 'k8-lb3-steigung__grafik',
      title: 'Gerade einstellen (m und n)',
      hint: 'Stelle Steigung und Achsenabschnitt am Slider ein.',
      pointsPerTask: 10,
      difficulty: 2,
      keywords: ['Steigung', 'Achsenabschnitt', 'lineare Funktion', 'Gerade'],
      fachwissen: {
        text: 'f(x) = m·x + n: m ist die Steigung (Δy/Δx), n der Schnitt mit der y-Achse.',
        quelle: 'Wikipedia: Lineare Funktion',
        url: 'https://de.wikipedia.org/wiki/Lineare_Funktion',
      },
      generate: (rng: Rng) => {
        const m = nonZero(rng, -3, 3)
        const n = randInt(rng, -4, 4)
        return paramSliderTask({
          question: `Stelle die Gerade f(x) = ${num(m)}·x + ${num(n)} ein.`,
          params: [
            { id: 'm', label: 'm', min: -5, max: 5, step: 1, start: 0 },
            { id: 'n', label: 'n', min: -5, max: 5, step: 1, start: 0 },
          ],
          correct: { m, n },
          solution: `m = ${m}, n = ${n}`,
          explanation: `y = ${num(m)}x + ${num(n)} hat Steigung m = ${m} und Achsenabschnitt n = ${n}.`,
          preview: 'linear',
          instruction: 'Stelle m und n so ein, dass die Gerade passt:',
        })
      },
    },
    { released: true },
  ),

  asGraphicReview(
    'k8-lb3-achsenabschnitt',
    {
      id: 'k8-lb3-achsenabschnitt__grafik',
      title: 'Nullstelle einer Geraden tippen',
      hint: 'Schnittpunkt mit der x-Achse tippen.',
      pointsPerTask: 10,
      difficulty: 2,
      keywords: ['Nullstelle', 'x-Achse', 'lineare Funktion'],
      fachwissen: {
        text: 'Nullstelle von f(x) = m·x + n: x = −n/m (m ≠ 0) = Schnitt mit der x-Achse.',
        quelle: 'Wikipedia: Nullstelle',
        url: 'https://de.wikipedia.org/wiki/Nullstelle',
      },
      generate: (rng: Rng) => {
        const m = nonZero(rng, -3, 3)
        const x0 = nonZero(rng, -4, 4)
        const n = -m * x0
        return coordinateClickTask({
          question: `Die Gerade f(x) = ${num(m)}·x + ${num(n)} ist gezeichnet. Tippe die Nullstelle.`,
          x: x0,
          y: 0,
          solution: `(${x0}|0)`,
          explanation: `f(x) = 0 ⇒ x = ${x0}.`,
          xRange: [-6, 6],
          yRange: [-6, 6],
          instruction: 'Tippe den Schnitt mit der x-Achse:',
          visualContent: generateLinearFunctionSvg({
            m,
            n,
            xRange: [-6, 6],
            yRange: [-6, 6],
            interceptLabel: `n=${n}`,
          }),
        })
      },
    },
    { released: true },
  ),

  asGraphicReview(
    'k8-lb3-funktionswert',
    {
      id: 'k8-lb3-funktionswert__grafik',
      title: 'Gerade durch zwei Punkte zeichnen',
      hint: 'Werkzeug Gerade: zwei Punkte tippen.',
      pointsPerTask: 10,
      difficulty: 2,
      keywords: ['Gerade zeichnen', 'zwei Punkte', 'lineare Funktion'],
      fachwissen: {
        text: 'Durch zwei verschiedene Punkte verläuft genau eine Gerade.',
        quelle: 'Wikipedia: Gerade',
        url: 'https://de.wikipedia.org/wiki/Gerade',
      },
      generate: (rng: Rng) => {
        const x1 = randInt(rng, -4, -1)
        const y1 = randInt(rng, -3, 3)
        const x2 = randInt(rng, 1, 4)
        let y2 = randInt(rng, -3, 3)
        while (y2 === y1) y2 = randInt(rng, -3, 3)
        const solutionScene = emptyCoordinateScene({
          xRange: [-5, 5],
          yRange: [-5, 5],
          snap: 'integer',
          objects: [{ id: 'l', kind: 'line', x1, y1, x2, y2 }],
        })
        return coordinateDrawTask({
          question: `Zeichne die Gerade durch A(${x1}|${y1}) und B(${x2}|${y2}).`,
          solutionScene,
          solution: `Gerade durch (${x1}|${y1}) und (${x2}|${y2})`,
          explanation: `Richtung von A nach B: (${x2 - x1}|${y2 - y1}).`,
          allowedTools: ['select', 'line', 'delete'],
          instruction: 'Werkzeug Gerade: zwei Punkte der Geraden tippen.',
        })
      },
    },
    { released: true },
  ),
]

// ---------------------------------------------------------------------------
// Klasse 9 — Parabel
// ---------------------------------------------------------------------------

export const math9GraphicReviews: Topic[] = [
  asGraphicReview(
    'k9-lb1-scheitel',
    {
      id: 'k9-lb1-scheitel__grafik',
      title: 'Scheitelpunkt am Graphen tippen',
      hint: 'Tippe den tiefsten bzw. höchsten Punkt der Parabel.',
      pointsPerTask: 10,
      difficulty: 2,
      keywords: ['Scheitelpunkt', 'Parabel', 'Graph'],
      fachwissen: {
        text: 'Scheitel = Extremum der Parabel. In f(x)=a(x−d)²+e liegt er bei S(d|e).',
        quelle: 'Wikipedia: Scheitelpunktform',
        url: 'https://de.wikipedia.org/wiki/Quadratische_Funktion#Scheitelpunktform',
      },
      generate: (rng: Rng) => {
        const a = pick(rng, [-1, 1])
        const d = nonZero(rng, -3, 3)
        const e = randInt(rng, -3, 3)
        return coordinateClickTask({
          question: `Tippe den Scheitelpunkt von ${scheitelForm(a, d, e)}.`,
          x: d,
          y: e,
          solution: `(${d}|${e})`,
          explanation: `Scheitel S(${d}|${e}).`,
          xRange: [-6, 6],
          yRange: [-6, 6],
          instruction: 'Tippe den Scheitel S:',
          visualContent: generateFunctionGraphSvg({
            f: (x) => a * (x - d) * (x - d) + e,
            xRange: [-6, 6],
            yRange: [-6, 6],
          }),
        })
      },
    },
    { released: true },
  ),

  asGraphicReview(
    'k9-lb1-quadrat-wert',
    {
      id: 'k9-lb1-quadrat-wert__grafik',
      title: 'Nullstelle einer Parabel tippen',
      hint: 'Tippe einen Schnittpunkt mit der x-Achse.',
      pointsPerTask: 10,
      difficulty: 2,
      keywords: ['Nullstelle', 'Parabel', 'x-Achse'],
      fachwissen: {
        text: 'Nullstellen: Schnittpunkte der Parabel mit der x-Achse (f(x)=0).',
        quelle: 'Wikipedia: Nullstelle',
        url: 'https://de.wikipedia.org/wiki/Nullstelle',
      },
      generate: (rng: Rng) => {
        // Eine klare Nullstelle (Berührpunkt): f(x) = (x − r)²
        const r = nonZero(rng, -3, 3)
        return coordinateClickTask({
          question: `Die Parabel f(x) = (x − ${num(r)})² berührt die x-Achse. Tippe die Nullstelle.`,
          x: r,
          y: 0,
          solution: `(${r}|0)`,
          explanation: `f(x) = 0 ⇒ x = ${r} (doppelte Nullstelle / Scheitel auf der x-Achse).`,
          xRange: [-6, 6],
          yRange: [-1, 8],
          instruction: 'Tippe den Berührpunkt mit der x-Achse:',
          visualContent: generateFunctionGraphSvg({
            f: (x) => (x - r) * (x - r),
            xRange: [-6, 6],
            yRange: [-1, 8],
          }),
        })
      },
    },
    { released: true },
  ),
]

// ---------------------------------------------------------------------------
// Klasse 10 — Parabel / Funktionswert
// ---------------------------------------------------------------------------

export const math10GraphicReviews: Topic[] = [
  asGraphicReview(
    'k10-lb4-parabel-wert',
    {
      id: 'k10-lb4-parabel-wert__grafik',
      title: 'Scheitel einer Parabel tippen',
      hint: 'Tippe den Scheitel der gezeichneten Parabel.',
      pointsPerTask: 10,
      difficulty: 2,
      keywords: ['Scheitel', 'Parabel', 'Graph'],
      fachwissen: {
        text: 'Bei f(x)=a·x² + c liegt der Scheitel bei S(0|c).',
        quelle: 'Wikipedia: Parabel (Mathematik)',
        url: 'https://de.wikipedia.org/wiki/Parabel_(Mathematik)',
      },
      generate: (rng: Rng) => {
        const a = pick(rng, [-2, -1, 1, 2])
        const c = nonZero(rng, -3, 3)
        return coordinateClickTask({
          question: `Tippe den Scheitelpunkt von f(x) = ${num(a)}·x² + ${num(c)}.`,
          x: 0,
          y: c,
          solution: `(0|${c})`,
          explanation: `Ohne x-Term: Scheitel S(0|${c}).`,
          xRange: [-5, 5],
          yRange: [-6, 8],
          instruction: 'Tippe den Scheitel:',
          visualContent: generateFunctionGraphSvg({
            f: (x) => a * x * x + c,
            xRange: [-5, 5],
            yRange: [-6, 8],
          }),
        })
      },
    },
    { released: true },
  ),

  asGraphicReview(
    'k10-lb4-parabel-wert',
    {
      id: 'k10-lb4-parabel-wert__grafik-ablesen',
      title: 'Funktionswert am Parabelgraphen',
      hint: 'Lies f(x₀) am Graphen ab (oder rechne nach).',
      pointsPerTask: 10,
      difficulty: 2,
      keywords: ['Funktionswert', 'Parabel', 'ablesen'],
      fachwissen: {
        text: 'Am Graphen: vom x-Wert senkrecht zum Graphen, dann zur y-Achse.',
        quelle: 'Wikipedia: Funktionsgraph',
        url: 'https://de.wikipedia.org/wiki/Funktionsgraph',
      },
      generate: (rng: Rng) => {
        const a = pick(rng, [-1, 1, 2])
        const c = randInt(rng, -2, 2)
        const x0 = nonZero(rng, -3, 3)
        const value = a * x0 * x0 + c
        return visualTask({
          question: `Am Graphen von f(x) = ${num(a)}·x² + ${num(c)}: Welchen y-Wert hat der markierte Punkt bei x = ${x0}?`,
          answerKind: 'integer',
          value,
          solution: `${value}`,
          explanation: `f(${x0}) = ${num(a)}·${x0}² + ${num(c)} = ${value}.`,
          visualContent: generateFunctionGraphSvg({
            f: (x) => a * x * x + c,
            points: [{ x: x0, y: value, label: `(${x0}|?)` }],
            xRange: [-5, 5],
            yRange: [
              Math.min(-6, value - 2, c - 2),
              Math.max(8, value + 2, c + 2),
            ],
          }),
        })
      },
    },
    { released: true },
  ),
]

// ---------------------------------------------------------------------------
// Jgs. 11/12 — Analysis
// ---------------------------------------------------------------------------

export const math1112GraphicReviews: Topic[] = [
  asGraphicReview('k1112-lb1-ableitung-stelle', {
    id: 'k1112-lb1-ableitung-stelle__grafik',
    title: 'Steigung der Tangente ablesen',
    hint: 'Lies die Steigung der eingezeichneten Tangente ab.',
    pointsPerTask: 10,
    difficulty: 3,
    keywords: ['Ableitung', 'Tangente', 'Steigung', 'Graph'],
    fachwissen: {
      text: 'f\'(x₀) ist die Steigung der Tangente am Graphen von f in x₀.',
      quelle: 'Wikipedia: Ableitung (Mathematik)',
      url: 'https://de.wikipedia.org/wiki/Ableitung_(Mathematik)',
    },
    generate: (rng: Rng) => {
      const a = pick(rng, [-1, 1, 2])
      const b = nonZero(rng, -3, 3)
      const c = randInt(rng, -2, 2)
      const x0 = randInt(rng, -2, 2)
      const m = 2 * a * x0 + b
      const y0 = a * x0 * x0 + b * x0 + c
      return visualTask({
        question: `Die rote Gerade ist die Tangente an f(x) = ${num(a)}·x² + ${num(b)}·x + ${num(c)} bei x₀ = ${x0}. Wie groß ist f'(${x0})?`,
        answerKind: 'integer',
        value: m,
        solution: `${m}`,
        explanation: `f'(x) = ${num(2 * a)}·x + ${num(b)}. f'(${x0}) = ${m}.`,
        visualContent: generateFunctionGraphSvg({
          f: (x) => a * x * x + b * x + c,
          tangent: { x0, m, label: `m=?` },
          points: [{ x: x0, y: y0, label: 'P' }],
          xRange: [-4, 4],
          yRange: [
            Math.min(-5, y0 - 3, c - 2),
            Math.max(6, y0 + 3, c + 4),
          ],
        }),
      })
    },
  }),

  asGraphicReview('k1112-lb1-bestimmtes-integral', {
    id: 'k1112-lb1-bestimmtes-integral__grafik',
    title: 'Fläche unter dem Graphen',
    hint: 'Rechteckfläche bzw. Integral berechnen.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Integral', 'Fläche', 'Graph'],
    fachwissen: {
      text: '∫ₐᵇ k dx = k·(b−a) ist die Rechteckfläche unter der konstanten Funktion.',
      quelle: 'Wikipedia: Bestimmtes Integral',
      url: 'https://de.wikipedia.org/wiki/Integral#Bestimmtes_Integral',
    },
    generate: (rng: Rng) => {
      const k = randInt(rng, 2, 5)
      const q = randInt(rng, 2, 5)
      const value = k * q
      return visualTask({
        question: `Die Fläche unter f(x) = ${k} von 0 bis ${q} ist markiert. Berechne ∫₀^${q} ${k} dx.`,
        answerKind: 'integer',
        value,
        solution: `${value}`,
        explanation: `∫₀^${q} ${k} dx = ${k}·${q} = ${value}.`,
        visualContent: generateFunctionGraphSvg({
          f: () => k,
          shade: { a: 0, b: q },
          xRange: [-1, q + 2],
          yRange: [-1, k + 3],
        }),
      })
    },
  }),

  asGraphicReview('k1112-lb1-nullstelle-linear', {
    id: 'k1112-lb1-nullstelle-linear__grafik',
    title: 'Nullstelle linearer Graph tippen',
    hint: 'Tippe den Schnitt mit der x-Achse.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Nullstelle', 'lineare Funktion', 'Graph'],
    fachwissen: {
      text: 'Nullstelle: f(x)=0, Schnitt des Graphen mit der x-Achse.',
      quelle: 'Wikipedia: Nullstelle',
      url: 'https://de.wikipedia.org/wiki/Nullstelle',
    },
    generate: (rng: Rng) => {
      const m = nonZero(rng, -3, 3)
      const x0 = nonZero(rng, -4, 4)
      const n = -m * x0
      return coordinateClickTask({
        question: `Tippe die Nullstelle von f(x) = ${num(m)}·x + ${num(n)}.`,
        x: x0,
        y: 0,
        solution: `(${x0}|0)`,
        explanation: `f(x)=0 ⇒ x = ${x0}.`,
        xRange: [-6, 6],
        yRange: [-6, 6],
        instruction: 'Tippe den Schnitt mit der x-Achse:',
        visualContent: generateLinearFunctionSvg({
          m,
          n,
          xRange: [-6, 6],
          yRange: [-6, 6],
          interceptLabel: false,
        }),
      })
    },
  }),
]
