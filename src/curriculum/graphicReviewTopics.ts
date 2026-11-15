/**
 * Grafik-(Prüfung)-Themen — nur hier, getrennt von freigegebenen Hauptthemen.
 * `released: false` bis explizite User-Freigabe; danach in Parent mergen / freigeben.
 * IDs + reviewOf unverändert (Verdrahtung in math8–11_12).
 */
import { pick, randInt, type Rng } from '../lib/rng'
import { formatDe, roundTo } from '../lib/num'
import { shuffleChoices } from './biologieHelpers'
import {
  generateFunctionGraphSvg,
  generateLinearFunctionSvg,
} from '../lib/geometrySvg'
import {
  choicePickTask,
  coordinateClickTask,
  coordinateDrawTask,
  mixedVariants,
  paramSliderTask,
  visualTask,
} from './taskHelpers'
import { asGraphicReview } from './graphicReview'
import { emptyCoordinateScene, type CoordinateScene } from '../lib/coordinateScene'
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

const LOCKED = { released: false as const }

// ---------------------------------------------------------------------------
// Klasse 8 — lineare Funktionen (Parents: k8-lb3-*)
// ---------------------------------------------------------------------------

export const math8GraphicReviews: Topic[] = [
  asGraphicReview(
    'k8-lb3-steigung',
    {
      id: 'k8-lb3-steigung__grafik',
      title: 'Gerade einstellen (m und n)',
      hint: 'Stelle Steigung und Achsenabschnitt so ein, dass die Gerade zur Vorgabe passt.',
      pointsPerTask: 10,
      difficulty: 2,
      keywords: ['Steigung', 'Achsenabschnitt', 'lineare Funktion', 'Gerade', 'Slider'],
      fachwissen: {
        text: 'Bei f(x) = m·x + n ist m die Steigung: Steigt x um 1, ändert sich y um m. Der Parameter n ist der y-Achsenabschnitt — dort schneidet die Gerade die y-Achse (Punkt (0|n)). Beide Parameter zusammen legen die Gerade eindeutig fest.',
        quelle: 'Wikipedia: Lineare Funktion',
        url: 'https://de.wikipedia.org/wiki/Lineare_Funktion',
      },
      generate: mixedVariants(
        (rng: Rng) => {
          const m = nonZero(rng, -3, 3)
          const n = randInt(rng, -4, 4)
          return paramSliderTask({
            question: `Stelle die Gerade so ein, dass sie der Gleichung f(x) = ${num(m)}·x + ${num(n)} entspricht.`,
            params: [
              { id: 'm', label: 'm (Steigung)', min: -5, max: 5, step: 1, start: 0 },
              { id: 'n', label: 'n (y-Achsenabschnitt)', min: -5, max: 5, step: 1, start: 0 },
            ],
            correct: { m, n },
            solution: `m = ${m}, n = ${n}`,
            explanation: `Die Gerade y = ${num(m)}x + ${num(n)} hat Steigung m = ${m} und schneidet die y-Achse bei n = ${n}.`,
            preview: 'linear',
            instruction: 'Stelle m und n am Schieberegler ein:',
          })
        },
        (rng: Rng) => {
          const m = nonZero(rng, -3, 3)
          const n = randInt(rng, -3, 3)
          const wrongM = m === 1 ? -1 : 1
          const wrongN = n === 0 ? 2 : 0
          return choicePickTask({
            question: `Welche Parameter gehören zur Gerade f(x) = ${num(m)}·x + ${num(n)}?`,
            choices: shuffleChoices(
              rng,
              [
                `m = ${m}, n = ${n}`,
                `m = ${wrongM}, n = ${n}`,
                `m = ${m}, n = ${wrongN}`,
                `m = ${-m}, n = ${-n}`,
              ],
              `m = ${m}, n = ${n}`,
            ),
            correct: `m = ${m}, n = ${n}`,
            solution: `m = ${m}, n = ${n}`,
            explanation: `In f(x) = mx + n liest du m = ${m} und n = ${n} direkt ab.`,
            visualContent: generateLinearFunctionSvg({
              m,
              n,
              xRange: [-5, 5],
              yRange: [-6, 6],
              interceptLabel: false,
            }),
            instruction: 'Wähle die passende Parameterpaarung:',
          })
        },
      ),
    },
    LOCKED,
  ),

  asGraphicReview(
    'k8-lb3-achsenabschnitt',
    {
      id: 'k8-lb3-achsenabschnitt__grafik',
      title: 'Nullstelle einer Geraden tippen',
      hint: 'Tippe den Schnittpunkt der Geraden mit der x-Achse.',
      pointsPerTask: 10,
      difficulty: 2,
      keywords: ['Nullstelle', 'x-Achse', 'lineare Funktion', 'Graph'],
      fachwissen: {
        text: 'Die Nullstelle einer linearen Funktion f(x) = m·x + n ist der x-Wert mit f(x) = 0, also x = −n/m (m ≠ 0). Am Graphen ist das der Schnittpunkt mit der x-Achse. Der y-Wert dort ist immer 0.',
        quelle: 'Wikipedia: Nullstelle',
        url: 'https://de.wikipedia.org/wiki/Nullstelle',
      },
      generate: mixedVariants(
        (rng: Rng) => {
          const m = nonZero(rng, -3, 3)
          const x0 = nonZero(rng, -4, 4)
          const n = -m * x0
          return coordinateClickTask({
            question:
              'Die Gerade ist gezeichnet. Tippe ihren Schnittpunkt mit der x-Achse (Nullstelle).',
            x: x0,
            y: 0,
            solution: `(${x0}|0)`,
            explanation: `Die Gerade gehört zu f(x) = ${num(m)}·x + ${num(n)}. Aus f(x)=0 folgt x = ${x0}.`,
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
        (rng: Rng) => {
          const m = nonZero(rng, -3, 3)
          const x0 = nonZero(rng, -4, 4)
          const n = -m * x0
          const distractors = [x0 - 1, x0 + 1, -x0].filter((v) => v !== x0)
          return choicePickTask({
            question: `Die Gerade f(x) = ${num(m)}·x + ${num(n)} schneidet die x-Achse. Bei welchem x-Wert?`,
            choices: shuffleChoices(
              rng,
              [String(x0), ...distractors.slice(0, 3).map(String)],
              String(x0),
            ),
            correct: String(x0),
            solution: `x = ${x0}`,
            explanation: `0 = ${num(m)}·x + ${num(n)} ⇒ x = ${x0}.`,
            visualContent: generateLinearFunctionSvg({
              m,
              n,
              xRange: [-6, 6],
              yRange: [-6, 6],
              interceptLabel: false,
            }),
            instruction: 'Wähle den x-Wert der Nullstelle:',
          })
        },
      ),
    },
    LOCKED,
  ),

  asGraphicReview(
    'k8-lb3-funktionswert',
    {
      id: 'k8-lb3-funktionswert__grafik',
      title: 'Gerade durch zwei Punkte zeichnen',
      hint: 'Zeichne die Gerade durch die beiden gegebenen Punkte.',
      pointsPerTask: 10,
      difficulty: 2,
      keywords: ['Gerade zeichnen', 'zwei Punkte', 'lineare Funktion'],
      fachwissen: {
        text: 'Durch zwei verschiedene Punkte der Ebene verläuft genau eine Gerade. Zum Zeichnen genügt es, die beiden Punkte zu setzen und sie mit dem Geraden-Werkzeug zu verbinden; die Richtung ergibt sich aus dem Steigungsdreieck zwischen den Punkten.',
        quelle: 'Wikipedia: Gerade',
        url: 'https://de.wikipedia.org/wiki/Gerade',
      },
      generate: mixedVariants(
        (rng: Rng) => {
          const x1 = randInt(rng, -4, -1)
          const y1 = randInt(rng, -3, 3)
          const x2 = randInt(rng, 1, 4)
          let y2 = randInt(rng, -3, 3)
          while (y2 === y1) y2 = randInt(rng, -3, 3)
          const solutionScene: CoordinateScene = emptyCoordinateScene({
            xRange: [-5, 5],
            yRange: [-5, 5],
            snap: 'integer',
            objects: [{ id: 'l', kind: 'line', x1, y1, x2, y2 }],
          })
          return coordinateDrawTask({
            question: `Zeichne die Gerade durch A(${x1}|${y1}) und B(${x2}|${y2}).`,
            solutionScene,
            solution: `Gerade durch (${x1}|${y1}) und (${x2}|${y2})`,
            explanation: `Richtung A→B: (${x2 - x1}|${y2 - y1}). Genau eine Gerade verbindet A und B.`,
            allowedTools: ['select', 'line', 'delete'],
            instruction: 'Werkzeug Gerade: tippe zwei Punkte auf der gesuchten Geraden.',
          })
        },
        (rng: Rng) => {
          const x1 = randInt(rng, -3, -1)
          const y1 = randInt(rng, -2, 2)
          const x2 = randInt(rng, 1, 3)
          let y2 = randInt(rng, -2, 2)
          while (y2 === y1) y2 = randInt(rng, -2, 2)
          const m = (y2 - y1) / (x2 - x1)
          const mStr = Number.isInteger(m) ? String(m) : formatDe(roundTo(m, 2))
          return choicePickTask({
            question: `Punkte A(${x1}|${y1}) und B(${x2}|${y2}) liegen auf einer Geraden. Wie groß ist die Steigung m?`,
            choices: shuffleChoices(
              rng,
              [mStr, String(-m), String(y2 - y1), String(x2 - x1)],
              mStr,
            ),
            correct: mStr,
            solution: `m = ${mStr}`,
            explanation: `m = Δy/Δx = (${y2}−${y1})/(${x2}−${x1}) = ${mStr}.`,
            instruction: 'Wähle die Steigung:',
          })
        },
      ),
    },
    LOCKED,
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
        text: 'Der Scheitel ist der Extremalpunkt der Parabel (Minimum bei a>0, Maximum bei a<0). In der Scheitelform f(x)=a(x−d)²+e liegt er bei S(d|e). Am Graphen tippst du genau diesen tiefsten bzw. höchsten Punkt.',
        quelle: 'Wikipedia: Scheitelpunktform',
        url: 'https://de.wikipedia.org/wiki/Quadratische_Funktion#Scheitelpunktform',
      },
      generate: mixedVariants(
        (rng: Rng) => {
          const a = pick(rng, [-1, 1])
          const d = nonZero(rng, -3, 3)
          const e = randInt(rng, -3, 3)
          return coordinateClickTask({
            question:
              'Die Parabel ist gezeichnet. Tippe ihren Scheitelpunkt (tiefster bzw. höchster Punkt).',
            x: d,
            y: e,
            solution: `(${d}|${e})`,
            explanation: `Die Parabel gehört zu ${scheitelForm(a, d, e)}. Scheitel S(${d}|${e}).`,
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
        (rng: Rng) => {
          const a = pick(rng, [-1, 1])
          const d = nonZero(rng, -3, 3)
          const e = randInt(rng, -3, 3)
          const opening = a > 0 ? 'nach oben (Minimum)' : 'nach unten (Maximum)'
          return choicePickTask({
            question: `Die Parabel ${scheitelForm(a, d, e)} öffnet …`,
            choices: shuffleChoices(
              rng,
              [
                'nach oben (Minimum)',
                'nach unten (Maximum)',
                'nach links',
                'nach rechts',
              ],
              opening,
            ),
            correct: opening,
            solution: opening,
            explanation: `a = ${a} ${a > 0 ? '> 0 ⇒ Öffnung nach oben, Scheitel = Minimum' : '< 0 ⇒ Öffnung nach unten, Scheitel = Maximum'}.`,
            visualContent: generateFunctionGraphSvg({
              f: (x) => a * (x - d) * (x - d) + e,
              xRange: [-6, 6],
              yRange: [-6, 6],
            }),
            instruction: 'Wähle die Öffnungsrichtung:',
          })
        },
      ),
    },
    LOCKED,
  ),

  asGraphicReview(
    'k9-lb1-quadrat-wert',
    {
      id: 'k9-lb1-quadrat-wert__grafik',
      title: 'Nullstelle einer Parabel tippen',
      hint: 'Tippe einen Schnittpunkt der Parabel mit der x-Achse.',
      pointsPerTask: 10,
      difficulty: 2,
      keywords: ['Nullstelle', 'Parabel', 'x-Achse'],
      fachwissen: {
        text: 'Nullstellen einer Parabel sind die Schnittpunkte mit der x-Achse (f(x)=0). Es kann zwei, eine (Berührpunkt) oder keine reellen Nullstellen geben. Am Graphen tippst du einen solchen Schnittpunkt; der y-Wert ist 0.',
        quelle: 'Wikipedia: Nullstelle',
        url: 'https://de.wikipedia.org/wiki/Nullstelle',
      },
      generate: mixedVariants(
        (rng: Rng) => {
          const r = nonZero(rng, -3, 3)
          return coordinateClickTask({
            question:
              'Die Parabel berührt die x-Achse in genau einem Punkt. Tippe diese Nullstelle.',
            x: r,
            y: 0,
            solution: `(${r}|0)`,
            explanation: `Die Parabel hat die Form f(x) = (x − ${r})². Doppelte Nullstelle bei x = ${r}.`,
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
        (rng: Rng) => {
          const r1 = nonZero(rng, -3, 2)
          let r2 = nonZero(rng, -2, 3)
          while (r2 === r1) r2 = nonZero(rng, -2, 3)
          const [lo, hi] = r1 < r2 ? [r1, r2] : [r2, r1]
          // expanded form without spoiling roots in the prompt question focus
          const b = -(lo + hi)
          const c = lo * hi
          return coordinateClickTask({
            question: `Die Parabel f(x) = x² ${b >= 0 ? '+' : '−'} ${Math.abs(b)}·x ${c >= 0 ? '+' : '−'} ${Math.abs(c)} schneidet die x-Achse zweimal. Tippe eine der beiden Nullstellen.`,
            x: lo,
            y: 0,
            solution: `(${lo}|0) oder (${hi}|0)`,
            explanation: `Nullstellen bei x = ${lo} und x = ${hi}.`,
            xRange: [-6, 6],
            yRange: [-4, 8],
            instruction: 'Tippe eine Nullstelle (Schnitt mit der x-Achse):',
            visualContent: generateFunctionGraphSvg({
              f: (x) => (x - lo) * (x - hi),
              xRange: [-6, 6],
              yRange: [-4, 8],
            }),
          })
        },
        (rng: Rng) => {
          const a = pick(rng, [1, 2])
          const c = pick(rng, [1, 2, 3])
          return choicePickTask({
            question: `Wie viele reelle Nullstellen hat die Parabel f(x) = ${a}·x² + ${c}?`,
            choices: shuffleChoices(
              rng,
              ['Keine', 'Eine', 'Zwei', 'Unendlich viele'],
              'Keine',
            ),
            correct: 'Keine',
            solution: 'Keine',
            explanation: `f(x) = ${a}·x² + ${c} ≥ ${c} > 0 für alle x. Die Parabel liegt ganz über der x-Achse.`,
            visualContent: generateFunctionGraphSvg({
              f: (x) => a * x * x + c,
              xRange: [-4, 4],
              yRange: [-1, 10],
            }),
            instruction: 'Wähle die Anzahl reeller Nullstellen:',
          })
        },
      ),
    },
    LOCKED,
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
        text: 'Bei f(x) = a·x² + c (ohne lineares Glied) liegt der Scheitel auf der y-Achse bei S(0|c). Allgemein gilt für f(x)=a·x²+b·x+c die Formel xₛ = −b/(2a). Am Graphen tippst du den Extremalpunkt.',
        quelle: 'Wikipedia: Parabel (Mathematik)',
        url: 'https://de.wikipedia.org/wiki/Parabel_(Mathematik)',
      },
      generate: mixedVariants(
        (rng: Rng) => {
          const a = pick(rng, [-2, -1, 1, 2])
          const c = nonZero(rng, -3, 3)
          return coordinateClickTask({
            question: 'Die Parabel ist gezeichnet. Tippe ihren Scheitelpunkt.',
            x: 0,
            y: c,
            solution: `(0|${c})`,
            explanation: `f(x) = ${num(a)}·x² + ${num(c)} hat Scheitel S(0|${c}).`,
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
        (rng: Rng) => {
          const a = pick(rng, [-2, 2])
          const h = pick(rng, [-2, -1, 1, 2])
          const k = pick(rng, [-3, -1, 1, 3])
          return coordinateClickTask({
            question: 'Tippe den Scheitel der gezeichneten Parabel.',
            x: h,
            y: k,
            solution: `(${h}|${k})`,
            explanation: `Scheitelform mit S(${h}|${k}).`,
            xRange: [-5, 5],
            yRange: [-6, 8],
            instruction: 'Tippe den Scheitel:',
            visualContent: generateFunctionGraphSvg({
              f: (x) => a * (x - h) * (x - h) + k,
              xRange: [-5, 5],
              yRange: [-6, 8],
            }),
          })
        },
        (rng: Rng) => {
          const a = pick(rng, [-2, -1, 1, 2])
          const c = nonZero(rng, -3, 3)
          const opening = a > 0 ? 'Minimum bei x = 0' : 'Maximum bei x = 0'
          return choicePickTask({
            question: `Die Parabel f(x) = ${num(a)}·x² + ${num(c)} hat …`,
            choices: shuffleChoices(
              rng,
              [
                'Minimum bei x = 0',
                'Maximum bei x = 0',
                'Minimum bei x = 1',
                'keinen Extremwert',
              ],
              opening,
            ),
            correct: opening,
            solution: opening,
            explanation: `a = ${a} ${a > 0 ? '> 0 ⇒ Minimum' : '< 0 ⇒ Maximum'} auf der Achse x = 0.`,
            visualContent: generateFunctionGraphSvg({
              f: (x) => a * x * x + c,
              xRange: [-5, 5],
              yRange: [-6, 8],
            }),
            instruction: 'Wähle die passende Aussage:',
          })
        },
      ),
    },
    LOCKED,
  ),

  asGraphicReview(
    'k10-lb4-parabel-wert',
    {
      id: 'k10-lb4-parabel-wert__grafik-ablesen',
      title: 'Funktionswert am Parabelgraphen',
      hint: 'Lies den y-Wert am Graphen ab.',
      pointsPerTask: 10,
      difficulty: 2,
      keywords: ['Funktionswert', 'Parabel', 'ablesen'],
      fachwissen: {
        text: 'Einen Funktionswert am Graphen ablesen: vom gegebenen x-Wert senkrecht zum Graphen gehen und von dort waagerecht zur y-Achse. Der abgelesene y-Wert ist f(x).',
        quelle: 'Wikipedia: Funktionsgraph',
        url: 'https://de.wikipedia.org/wiki/Funktionsgraph',
      },
      generate: mixedVariants(
        (rng: Rng) => {
          const a = pick(rng, [-1, 1, 2])
          const c = randInt(rng, -2, 2)
          const x0 = nonZero(rng, -3, 3)
          const value = a * x0 * x0 + c
          return visualTask({
            question: `Am Graphen ist bei x = ${x0} ein Punkt markiert. Welchen y-Wert hat dieser Punkt?`,
            answerKind: 'integer',
            value,
            solution: `${value}`,
            explanation: `Ablesen bzw. nachrechnen: f(${x0}) = ${num(a)}·${x0}² + ${num(c)} = ${value}.`,
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
        (rng: Rng) => {
          const a = pick(rng, [1, 2])
          const c = randInt(rng, -1, 2)
          const x0 = nonZero(rng, -3, 3)
          const value = a * x0 * x0 + c
          const wrong = [value + 1, value - 1, a * x0 + c].filter((v) => v !== value)
          return choicePickTask({
            question: `Welcher y-Wert gehört am Graphen zu x = ${x0}?`,
            choices: shuffleChoices(
              rng,
              [String(value), ...wrong.slice(0, 3).map(String)],
              String(value),
            ),
            correct: String(value),
            solution: `${value}`,
            explanation: `Am Graphen bei x = ${x0} liegt y = ${value}.`,
            visualContent: generateFunctionGraphSvg({
              f: (x) => a * x * x + c,
              points: [{ x: x0, y: value, label: `(${x0}|?)` }],
              xRange: [-5, 5],
              yRange: [-4, 12],
            }),
            instruction: 'Lies y ab und wähle:',
          })
        },
      ),
    },
    LOCKED,
  ),
]

// ---------------------------------------------------------------------------
// Jgs. 11/12 — Analysis
// ---------------------------------------------------------------------------

export const math1112GraphicReviews: Topic[] = [
  asGraphicReview(
    'k1112-lb1-ableitung-stelle',
    {
      id: 'k1112-lb1-ableitung-stelle__grafik',
      title: 'Steigung der Tangente ablesen',
      hint: 'Lies die Steigung der eingezeichneten Tangente ab (ohne Beschriftung m=…).',
      pointsPerTask: 10,
      difficulty: 3,
      keywords: ['Ableitung', 'Tangente', 'Steigung', 'Graph'],
      fachwissen: {
        text: 'Die Ableitung f′(x₀) ist die Steigung der Tangente an den Graphen von f im Punkt mit Abszisse x₀. Am Graphen erkennst du die Steigung am Steigungsdreieck der Tangente (Δy/Δx) oder rechnest f′(x₀) aus der Ableitungsfunktion.',
        quelle: 'Wikipedia: Ableitung (Mathematik)',
        url: 'https://de.wikipedia.org/wiki/Ableitung_(Mathematik)',
      },
      generate: mixedVariants(
        (rng: Rng) => {
          const a = pick(rng, [-1, 1, 2])
          const b = nonZero(rng, -3, 3)
          const c = randInt(rng, -2, 2)
          const x0 = randInt(rng, -2, 2)
          const m = 2 * a * x0 + b
          const y0 = a * x0 * x0 + b * x0 + c
          return visualTask({
            question: `Die rote Gerade ist die Tangente an den Graphen bei x₀ = ${x0}. Wie groß ist die Steigung dieser Tangente (also f'(${x0}))?`,
            answerKind: 'integer',
            value: m,
            solution: `${m}`,
            explanation: `f(x) = ${num(a)}·x² + ${num(b)}·x + ${num(c)} ⇒ f'(x) = ${num(2 * a)}·x + ${num(b)}. f'(${x0}) = ${m}.`,
            visualContent: generateFunctionGraphSvg({
              f: (x) => a * x * x + b * x + c,
              tangent: { x0, m, label: 'Tangente' },
              points: [{ x: x0, y: y0, label: 'P' }],
              xRange: [-4, 4],
              yRange: [
                Math.min(-5, y0 - 3, c - 2),
                Math.max(6, y0 + 3, c + 4),
              ],
            }),
          })
        },
        (rng: Rng) => {
          const a = pick(rng, [1, 2])
          const b = nonZero(rng, -2, 2)
          const x0 = randInt(rng, -1, 2)
          const m = 2 * a * x0 + b
          const rising = m > 0
          const correct = rising ? 'steigend' : m < 0 ? 'fallend' : 'waagerecht'
          return choicePickTask({
            question: `Am Graphen von f(x) = ${num(a)}·x² + ${num(b)}·x ist bei x₀ = ${x0} die Tangente eingezeichnet. Die Tangente ist …`,
            choices: shuffleChoices(
              rng,
              ['steigend', 'fallend', 'waagerecht', 'senkrecht'],
              correct,
            ),
            correct,
            solution: correct,
            explanation: `f'(${x0}) = ${m} ⇒ Tangente ist ${correct}.`,
            visualContent: generateFunctionGraphSvg({
              f: (x) => a * x * x + b * x,
              tangent: { x0, m, label: 'Tangente' },
              points: [{ x: x0, y: a * x0 * x0 + b * x0, label: 'P' }],
              xRange: [-4, 4],
              yRange: [-6, 8],
            }),
            instruction: 'Beschreibe die Tangente:',
          })
        },
      ),
    },
    LOCKED,
  ),

  asGraphicReview(
    'k1112-lb1-bestimmtes-integral',
    {
      id: 'k1112-lb1-bestimmtes-integral__grafik',
      title: 'Fläche unter dem Graphen',
      hint: 'Berechne die markierte Rechteckfläche bzw. das bestimmte Integral.',
      pointsPerTask: 10,
      difficulty: 2,
      keywords: ['Integral', 'Fläche', 'Graph'],
      fachwissen: {
        text: 'Das bestimmte Integral ∫ₐᵇ f(x) dx misst die orientierte Fläche zwischen Graph und x-Achse. Für eine konstante Funktion f(x)=k ist ∫ₐᵇ k dx = k·(b−a) — die Rechteckfläche. Liegt der Graph unter der Achse, wird die Fläche negativ gezählt.',
        quelle: 'Wikipedia: Bestimmtes Integral',
        url: 'https://de.wikipedia.org/wiki/Integral#Bestimmtes_Integral',
      },
      generate: mixedVariants(
        (rng: Rng) => {
          const k = randInt(rng, 2, 5)
          const q = randInt(rng, 2, 5)
          const value = k * q
          return visualTask({
            question: `Die Fläche unter f(x) = ${k} von 0 bis ${q} ist markiert. Berechne ∫₀^${q} ${k} dx.`,
            answerKind: 'integer',
            value,
            solution: `${value}`,
            explanation: `∫₀^${q} ${k} dx = ${k}·${q} = ${value} (Rechteckfläche).`,
            visualContent: generateFunctionGraphSvg({
              f: () => k,
              shade: { a: 0, b: q },
              xRange: [-1, q + 2],
              yRange: [-1, k + 3],
            }),
          })
        },
        (rng: Rng) => {
          const k = randInt(rng, 2, 4)
          const q = randInt(rng, 2, 4)
          return choicePickTask({
            question: `Unter der konstanten Funktion f(x) = ${k} ist von 0 bis ${q} eine Fläche markiert. Welcher Wert ist ∫₀^${q} ${k} dx?`,
            choices: shuffleChoices(
              rng,
              [String(k * q), String(k + q), String(k), String(q)],
              String(k * q),
            ),
            correct: String(k * q),
            solution: `${k * q}`,
            explanation: `Rechteck: Breite ${q}, Höhe ${k} ⇒ Fläche ${k * q}.`,
            visualContent: generateFunctionGraphSvg({
              f: () => k,
              shade: { a: 0, b: q },
              xRange: [-1, q + 2],
              yRange: [-1, k + 3],
            }),
            instruction: 'Wähle den Integralwert:',
          })
        },
      ),
    },
    LOCKED,
  ),

  asGraphicReview(
    'k1112-lb1-nullstelle-linear',
    {
      id: 'k1112-lb1-nullstelle-linear__grafik',
      title: 'Nullstelle linearer Graph tippen',
      hint: 'Tippe den Schnitt mit der x-Achse.',
      pointsPerTask: 10,
      difficulty: 2,
      keywords: ['Nullstelle', 'lineare Funktion', 'Graph'],
      fachwissen: {
        text: 'Auch in der Kursstufe liest man Nullstellen linearer Funktionen am Graphen ab: Schnitt mit der x-Achse. Algebraisch löst man f(x)=0; grafisch tippst du den ganzzahligen Gitterpunkt auf der x-Achse.',
        quelle: 'Wikipedia: Nullstelle',
        url: 'https://de.wikipedia.org/wiki/Nullstelle',
      },
      generate: mixedVariants(
        (rng: Rng) => {
          const m = nonZero(rng, -3, 3)
          const x0 = nonZero(rng, -4, 4)
          const n = -m * x0
          return coordinateClickTask({
            question: 'Die Gerade ist gezeichnet. Tippe ihre Nullstelle.',
            x: x0,
            y: 0,
            solution: `(${x0}|0)`,
            explanation: `f(x) = ${num(m)}·x + ${num(n)} = 0 ⇒ x = ${x0}.`,
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
        (rng: Rng) => {
          const m = nonZero(rng, -3, 3)
          const x0 = nonZero(rng, -4, 4)
          const n = -m * x0
          return choicePickTask({
            question: `Wo schneidet f(x) = ${num(m)}·x + ${num(n)} die x-Achse?`,
            choices: shuffleChoices(
              rng,
              [`(${x0}|0)`, `(0|${n})`, `(${-x0}|0)`, `(${x0}|${n})`],
              `(${x0}|0)`,
            ),
            correct: `(${x0}|0)`,
            solution: `(${x0}|0)`,
            explanation: `Nullstelle: y = 0 und x = ${x0}. (0|${n}) wäre der y-Achsenabschnitt.`,
            visualContent: generateLinearFunctionSvg({
              m,
              n,
              xRange: [-6, 6],
              yRange: [-6, 6],
              interceptLabel: false,
            }),
            instruction: 'Wähle den Nullstellenpunkt:',
          })
        },
      ),
    },
    LOCKED,
  ),
]
