/**
 * Pending graphic/interactive topics (released:false) under existing parents.
 * After visual QA: merge into the parent topic and remove these entries.
 *
 * Worksheet patterns: Steigungsdreieck / Gerade zeichnen / Scheitel tippen /
 * Nullstelle tippen / Tangente-Steigung / Fläche unter Graph.
 */
import { pick, randInt, type Rng } from '../lib/rng'
import { formatDe, roundTo } from '../lib/num'
import { addNum, linFactor, linStr, parenNum, polyStr, signedNum } from '../lib/termFormat'
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

const nonZero = (rng: Rng, min: number, max: number): number => {
  let v = 0
  while (v === 0) v = randInt(rng, min, max)
  return v
}

const scheitelForm = (a: number, d: number, e: number): string => {
  const aStr = a === 1 ? '' : a === -1 ? '−' : `${signedNum(a)}·`
  const inner = d < 0 ? `x + ${Math.abs(d)}` : `x − ${signedNum(d)}`
  return `f(x) = ${aStr}(${inner})²${e === 0 ? '' : addNum(e)}`
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
          question: `Stelle die Gerade f(x) = ${linStr(m, n)} ein.`,
          params: [
            { id: 'm', label: 'm', min: -5, max: 5, step: 1, start: 0 },
            { id: 'n', label: 'n', min: -5, max: 5, step: 1, start: 0 },
          ],
          correct: { m, n },
          solution: `m = ${signedNum(m)}, n = ${signedNum(n)}`,
          explanation: `y = ${linStr(m, n)} hat Steigung m = ${signedNum(m)} und Achsenabschnitt n = ${signedNum(n)}.`,
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
      hint: 'Tippe den Schnittpunkt mit der x-Achse.',
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
          question: `Die Gerade f(x) = ${linStr(m, n)} ist gezeichnet. Tippe die Nullstelle.`,
          x: x0,
          y: 0,
          solution: `(${signedNum(x0)}|0)`,
          explanation:
            m === 1
              ? `f(x) = 0 ⇒ x = ${signedNum(-n)}.`
              : `f(x) = 0 ⇒ ${polyStr([[m, 'x']])} = ${signedNum(-n)} ⇒ x = ${signedNum(x0)}.`,
          xRange: [-6, 6],
          yRange: [-6, 6],
          instruction: 'Tippe den Schnitt mit der x-Achse:',
          visualContent: generateLinearFunctionSvg({
            m,
            n,
            xRange: [-6, 6],
            yRange: [-6, 6],
            interceptLabel: `n=${signedNum(n)}`,
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
          question: `Zeichne die Gerade durch A(${signedNum(x1)}|${signedNum(y1)}) und B(${signedNum(x2)}|${signedNum(y2)}).`,
          solutionScene,
          solution: `Gerade durch (${signedNum(x1)}|${signedNum(y1)}) und (${signedNum(x2)}|${signedNum(y2)})`,
          explanation: `Richtung von A nach B: (${signedNum(x2 - x1)}|${signedNum(y2 - y1)}).`,
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
          solution: `(${signedNum(d)}|${signedNum(e)})`,
          explanation: `Scheitel S(${signedNum(d)}|${signedNum(e)}).`,
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
      hint: 'Tippe den gesuchten Punkt im Koordinatensystem an.',
      pointsPerTask: 10,
      difficulty: 2,
      keywords: ['Nullstelle', 'Parabel', 'x-Achse'],
      fachwissen: {
        text: 'Die Nullstellen von f(x) = x² + px + q sind die Lösungen von f(x) = 0, also die Schnittstellen des Graphen mit der x-Achse. Man berechnet sie mit der p-q-Formel x = −p/2 ± √((p/2)² − q) oder durch Zerlegen in Linearfaktoren.',
        quelle: 'Wikipedia: Quadratische Gleichung',
        url: 'https://de.wikipedia.org/wiki/Quadratische_Gleichung',
      },
      generate: (rng: Rng) => {
        const r1 = randInt(rng, -5, 4)
        const r2 = randInt(rng, r1 + 1, 5)
        const p = -(r1 + r2)
        const q = r1 * r2
        const right = rng() < 0.5
        const x0 = right ? r2 : r1
        const vy = -((r2 - r1) ** 2) / 4
        const yMin = Math.floor(Math.min(-1, vy - 1))
        const term = `x²${p === 0 ? '' : p > 0 ? ` + ${p === 1 ? '' : p}x` : ` − ${p === -1 ? '' : -p}x`}${q === 0 ? '' : q > 0 ? ` + ${q}` : ` − ${-q}`}`
        return coordinateClickTask({
          question: `Tippe die ${right ? 'größere' : 'kleinere'} Nullstelle von f(x) = ${term} an.`,
          x: x0,
          y: 0,
          solution: `(${signedNum(x0)}|0)`,
          explanation: `f(x) = 0: p-q-Formel oder Zerlegen: f(x) = ${r2 === 0 ? `x${linFactor(r1)}` : `${linFactor(r1)}${linFactor(r2)}`}. Nullstellen x = ${signedNum(r1)} und x = ${signedNum(r2)}; gesucht ist x = ${signedNum(x0)}.`,
          xRange: [-6, 6],
          yRange: [yMin, 8],
          instruction: 'Tippe die Nullstelle auf der x-Achse:',
          visualContent: generateFunctionGraphSvg({
            f: (x) => (x - r1) * (x - r2),
            xRange: [-6, 6],
            yRange: [yMin, 8],
          }),
          dedupeKey: `ma:k9:nullstelle:${r1}:${r2}:${right}`,
        })
      },
    },
    { released: true },
  ),
]

// ---------------------------------------------------------------------------
// Klasse 10 — Umkehrfunktion, Exponential- und Logarithmusfunktion
// ---------------------------------------------------------------------------

export const math10GraphicReviews: Topic[] = [
  asGraphicReview(
    'k10-lb4-parabel-wert',
    {
      id: 'k10-lb4-parabel-wert__grafik',
      title: 'Punkt am Graphen der Umkehrfunktion tippen',
      hint: 'Tippe den gesuchten Punkt im Koordinatensystem an.',
      pointsPerTask: 10,
      difficulty: 3,
      keywords: ['Umkehrfunktion', 'Spiegelung', 'y = x', 'Graph', 'Exponentialfunktion', 'Wurzelfunktion'],
      fachwissen: {
        text: 'Der Graph der Umkehrfunktion f⁻¹ entsteht durch Spiegelung des Graphen von f an der Geraden y = x. Liegt P(a|b) auf dem Graphen von f, so liegt P′(b|a) auf dem Graphen von f⁻¹: x- und y-Koordinate werden vertauscht. So ist log₂ x die Umkehrfunktion von 2ˣ und √x die von x² (für x ≥ 0).',
        quelle: 'Wikipedia: Umkehrfunktion',
        url: 'https://de.wikipedia.org/wiki/Umkehrfunktion',
      },
      generate: (rng: Rng) => {
        const cases = [
          { term: 'f(x) = 2ˣ', inv: 'log₂ x', f: (x: number) => 2 ** x, xs: [0, 1, 2] },
          { term: 'f(x) = 3ˣ', inv: 'log₃ x', f: (x: number) => 3 ** x, xs: [0, 1] },
          { term: 'f(x) = √x', inv: 'x² (x ≥ 0)', f: (x: number) => (x < 0 ? NaN : Math.sqrt(x)), xs: [4, 9] },
          { term: 'f(x) = x² (x ≥ 0)', inv: '√x', f: (x: number) => (x < 0 ? NaN : x * x), xs: [2, 3] },
          { term: 'f(x) = 0,5x + 1', inv: '2x − 2', f: (x: number) => 0.5 * x + 1, xs: [-2, 4, 6] },
          { term: 'f(x) = 2x − 3', inv: '0,5x + 1,5', f: (x: number) => 2 * x - 3, xs: [1, 2, 4] },
        ]
        const c = pick(rng, cases)
        const a = pick(rng, c.xs)
        const b = c.f(a)
        return coordinateClickTask({
          question: `Der Punkt P(${signedNum(a)}|${signedNum(b)}) liegt auf dem Graphen von ${c.term}. Tippe den zugehörigen Punkt auf dem Graphen der Umkehrfunktion f⁻¹.`,
          x: b,
          y: a,
          solution: `(${signedNum(b)}|${signedNum(a)})`,
          explanation: `Spiegelung an y = x vertauscht die Koordinaten: Aus P(${signedNum(a)}|${signedNum(b)}) wird P′(${signedNum(b)}|${signedNum(a)}). Probe: f⁻¹(x) = ${c.inv} liefert f⁻¹(${signedNum(b)}) = ${signedNum(a)}.`,
          xRange: [-5, 10],
          yRange: [-5, 10],
          instruction: 'Tippe den Punkt P′ auf dem Graphen von f⁻¹:',
          visualContent: generateFunctionGraphSvg({
            f: c.f,
            xRange: [-5, 10],
            yRange: [-5, 10],
            points: [{ x: a, y: b, label: 'P' }],
          }),
          dedupeKey: `ma:k10:umkehr:grafik:${c.term}:${a}`,
        })
      },
    },
    { released: true },
  ),

  asGraphicReview(
    'k10-lb4-parabel-wert',
    {
      id: 'k10-lb4-parabel-wert__grafik-ablesen',
      title: 'Exponential- und Logarithmusgraphen ablesen',
      pointsPerTask: 10,
      difficulty: 2,
      keywords: ['Exponentialfunktion', 'Logarithmusfunktion', 'Graph', 'ablesen', 'Funktionswert'],
      fachwissen: {
        text: 'Am Graphen liest man zu einem x-Wert den Funktionswert ab, indem man senkrecht bis zum Graphen und dann waagerecht zur y-Achse geht. Umgekehrt findet man zu einem y-Wert das passende x. Beim Graphen von aˣ entspricht das Ablesen eines x-Werts zu gegebenem y dem Logarithmus: aˣ = b ⇔ x = logₐ b.',
        quelle: 'Wikipedia: Exponentialfunktion',
        url: 'https://de.wikipedia.org/wiki/Exponentialfunktion',
      },
      generate: (rng: Rng) => {
        const cases = [
          { term: 'f(x) = 2ˣ', f: (x: number) => 2 ** x, pts: [[1, 2], [2, 4], [3, 8]] },
          { term: 'f(x) = 2ˣ − 3', f: (x: number) => 2 ** x - 3, pts: [[0, -2], [1, -1], [2, 1], [3, 5]] },
          { term: 'f(x) = 3ˣ', f: (x: number) => 3 ** x, pts: [[1, 3], [2, 9]] },
          { term: 'f(x) = log₂ x', f: (x: number) => (x <= 0 ? NaN : Math.log2(x)), pts: [[1, 0], [2, 1], [4, 2], [8, 3]] },
          { term: 'f(x) = log₂ x + 1', f: (x: number) => (x <= 0 ? NaN : Math.log2(x) + 1), pts: [[1, 1], [2, 2], [4, 3], [8, 4]] },
          { term: 'f(x) = 0,5ˣ', f: (x: number) => 0.5 ** x, pts: [[-1, 2], [-2, 4], [-3, 8]] },
        ]
        const c = pick(rng, cases)
        const [x0, y0] = pick(rng, c.pts) as [number, number]
        const askX = rng() < 0.5
        return visualTask({
          question: askX
            ? `Am Graphen von ${c.term}: Für welches x gilt f(x) = ${signedNum(y0)}? Der Punkt ist markiert.`
            : `Am Graphen von ${c.term}: Welchen Funktionswert hat der markierte Punkt bei x = ${signedNum(x0)}?`,
          answerKind: 'integer',
          value: askX ? x0 : y0,
          solution: askX ? `x = ${signedNum(x0)}` : `f(${signedNum(x0)}) = ${signedNum(y0)}`,
          explanation: askX
            ? `Von y = ${signedNum(y0)} waagerecht zum Graphen und senkrecht zur x-Achse: x = ${signedNum(x0)}. Probe: f(${signedNum(x0)}) = ${signedNum(y0)}.`
            : `Von x = ${signedNum(x0)} senkrecht zum Graphen und waagerecht zur y-Achse: f(${signedNum(x0)}) = ${signedNum(y0)}.`,
          visualContent: generateFunctionGraphSvg({
            f: c.f,
            points: [{ x: x0, y: y0, label: askX ? `(?|${signedNum(y0)})` : `(${signedNum(x0)}|?)` }],
            xRange: [-4, 10],
            yRange: [-4, 10],
          }),
          dedupeKey: `ma:k10:expgraph:${c.term}:${x0}:${askX}`,
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
        question: `Die rote Gerade ist die Tangente an f(x) = ${polyStr([[a, 'x²'], [b, 'x'], [c, '']])} bei x₀ = ${signedNum(x0)}. Wie groß ist f′(${signedNum(x0)})?`,
        answerKind: 'integer',
        value: m,
        solution: signedNum(m),
        explanation: `f′(x) = ${linStr(2 * a, b)}. f′(${signedNum(x0)}) = ${signedNum(2 * a)}·${parenNum(x0)}${addNum(b)} = ${signedNum(m)}.`,
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
  }, { released: true }),

  asGraphicReview('k1112-lb1-bestimmtes-integral', {
    id: 'k1112-lb1-bestimmtes-integral__grafik',
    title: 'Fläche unter dem Graphen',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Integral', 'Fläche', 'Graph'],
    fachwissen: {
      text: 'Liegt der Graph von f über [a; b] oberhalb der x-Achse, ist der Inhalt der markierten Fläche ∫ₐᵇ f(x) dx = F(b) − F(a). Für f(x) = x² + c ist F(x) = x³/3 + c·x eine Stammfunktion.',
      quelle: 'Wikipedia: Bestimmtes Integral',
      url: 'https://de.wikipedia.org/wiki/Integral#Bestimmtes_Integral',
    },
    generate: (rng: Rng) => {
      const c = randInt(rng, 0, 4)
      const a = randInt(rng, 0, 1)
      const b = a + randInt(rng, 1, 2)
      const F = (x: number) => x ** 3 / 3 + c * x
      const value = roundTo(F(b) - F(a), 2)
      return visualTask({
        question: `Die Fläche unter dem Graphen von f(x) = x²${c ? ` + ${signedNum(c)}` : ''} über [${signedNum(a)}; ${signedNum(b)}] ist markiert. Berechne ihren Inhalt. Runde auf zwei Nachkommastellen.`,
        unit: 'FE',
        answerKind: 'decimal',
        value,
        eps: 0.006,
        solution: `${formatDe(value)} FE`,
        explanation: `F(x) = ${polyStr([[1, 'x³/3'], [c, 'x']])}. A = F(${signedNum(b)}) − F(${signedNum(a)}) ≈ ${formatDe(roundTo(F(b), 3))} − ${formatDe(roundTo(F(a), 3))} ≈ ${formatDe(value)} FE.`,
        dedupeKey: `ma:k1112:integral:grafik:${c}:${a}:${b}`,
        visualContent: generateFunctionGraphSvg({
          f: (x) => x * x + c,
          shade: { a, b },
          xRange: [-1, b + 1],
          yRange: [-1, b * b + c + 2],
        }),
      })
    },
  }, { released: true }),

  asGraphicReview('k1112-lb1-nullstelle-linear', {
    id: 'k1112-lb1-nullstelle-linear__grafik',
    title: 'Nullstelle am Graphen tippen',
    hint: 'Tippe den gesuchten Punkt im Koordinatensystem an.',
    pointsPerTask: 10,
    difficulty: 3,
    keywords: ['Nullstelle', 'ganzrationale Funktion', 'Graph'],
    fachwissen: {
      text: 'Liegt eine ganzrationale Funktion in Linearfaktoren vor, f(x) = a(x − x₁)(x − x₂)(x − x₃), liest man die Nullstellen direkt ab (Satz vom Nullprodukt). Am Graphen sind es die Schnitt- oder Berührpunkte mit der x-Achse.',
      quelle: 'Wikipedia: Nullstelle',
      url: 'https://de.wikipedia.org/wiki/Nullstelle',
    },
    generate: (rng: Rng) => {
      const r1 = randInt(rng, -4, 0)
      const r2 = randInt(rng, r1 + 1, 2)
      const r3 = randInt(rng, r2 + 1, 4)
      const target = pick(rng, ['kleinste', 'mittlere', 'größte'] as const)
      const x0 = target === 'kleinste' ? r1 : target === 'mittlere' ? r2 : r3
      const lin = (r: number) => (r === 0 ? 'x' : `(x ${r < 0 ? `+ ${-r}` : `− ${r}`})`)
      const f = (x: number) => 0.25 * (x - r1) * (x - r2) * (x - r3)
      return coordinateClickTask({
        question: `Tippe die ${target} Nullstelle von f(x) = 0,25 · ${lin(r1)} · ${lin(r2)} · ${lin(r3)} an.`,
        x: x0,
        y: 0,
        solution: `(${signedNum(x0)}|0)`,
        explanation: `Satz vom Nullprodukt: f(x) = 0 für x = ${signedNum(r1)}, x = ${signedNum(r2)} und x = ${signedNum(r3)}. Die ${target} ist x = ${signedNum(x0)}.`,
        xRange: [-6, 6],
        yRange: [-6, 6],
        instruction: 'Tippe die Nullstelle auf der x-Achse:',
        visualContent: generateFunctionGraphSvg({
          f,
          xRange: [-6, 6],
          yRange: [-6, 6],
        }),
        dedupeKey: `ma:k1112:nst:grafik:${r1}:${r2}:${r3}:${target}`,
      })
    },
  }, { released: true }),
]
