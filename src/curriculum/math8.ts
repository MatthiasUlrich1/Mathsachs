import { pick, randInt, type Rng } from '../lib/rng'
import {
  generateLinearFunctionSvg,
  generateValueTableSvg,
} from '../lib/geometrySvg'
import { makeFraction, subtract, format, type Fraction } from '../lib/fraction'
import { formatDe, roundTo } from '../lib/num'
import { addNum, linStr, parenNum, polyStr, signedNum } from '../lib/termFormat'
import { fractionTask, mixedVariants, valueTask, visualTask, paramSliderTask, choicePickTask, coordinateClickTask } from './taskHelpers'
import { math8GraphicReviews } from './graphicReviewTopics'
import { k8Baumdiagramm, k8BinomischeFormel, k8ProduktregelAnzahl } from './mathUpperDense'
import type { Grade, Topic } from './types'
import { MATH_LEHRPLAN_TEILASPEKTE_BY_GRADE } from './mathLehrplanTeilaspekte'

const nonZero = (rng: Rng, min: number, max: number): number => {
  let v = 0
  while (v === 0) v = randInt(rng, min, max)
  return v
}

// ---------------------------------------------------------------------------
// Lernbereich 1 — Arbeiten mit Termen und Gleichungen
// ---------------------------------------------------------------------------

const zusammenfassen: Topic = {
  id: 'k8-lb1-zusammenfassen',
  title: 'Terme zusammenfassen (Zahl vor x)',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Term', 'zusammenfassen', 'gleichartige Glieder', 'Variable', 'x'],
  fachwissen: {
    text: 'Gleichartige Glieder in einem Term (Glieder mit derselben Variable und demselben Exponenten) dürfen zusammengefasst (addiert oder subtrahiert) werden. Ungleiche Glieder (z. B. x-Glieder und Zahlen) können nicht zusammengefasst werden. Beispiel: 3x + 5 + 2x − 1 = 5x + 4.',
    quelle: 'Wikipedia: Algebraischer Term',
    url: 'https://de.wikipedia.org/wiki/Algebraischer_Term',
  },
  generate: (rng: Rng) => {
    const a = nonZero(rng, -9, 9)
    const c = nonZero(rng, -9, 9)
    const b = nonZero(rng, -9, 9)
    const d = nonZero(rng, -9, 9)
    const coeff = a + c
    return valueTask({
      question: `Fasse zusammen und gib die Zahl vor x an: ${polyStr([[a, 'x'], [b, ''], [c, 'x'], [d, '']])}`,
      answerKind: 'integer',
      value: coeff,
      solution: `${polyStr([[coeff, 'x']])} (Zahl vor x: ${signedNum(coeff)})`,
      explanation: `Fasse die x-Glieder zusammen: ${polyStr([[a, 'x'], [c, 'x']])} = ${polyStr([[coeff, 'x']])}. Die Zahl vor x ist ${signedNum(coeff)}; zusammen mit den Zahlen ergibt sich ${linStr(coeff, b + d)}.`,
    })
  },
}

const termAuswerten: Topic = {
  id: 'k8-lb1-term-auswerten',
  title: 'Term auswerten (x einsetzen)',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Term', 'einsetzen', 'auswerten', 'Wert', 'x'],
  fachwissen: {
    text: 'Ein Term ist ein mathematischer Ausdruck mit Variablen, Zahlen und Operationen. Einen Term auswerten bedeutet, die Variable durch einen konkreten Zahlenwert zu ersetzen (einzusetzen) und dann den Term zu berechnen. Die Variable steht als Platzhalter für beliebige Zahlen.',
    quelle: 'Wikipedia: Algebraischer Term',
    url: 'https://de.wikipedia.org/wiki/Algebraischer_Term',
  },
  generate: (rng: Rng) => {
    const a = nonZero(rng, -6, 6)
    const b = nonZero(rng, -12, 12)
    const x = nonZero(rng, -8, 8)
    const value = a * x + b
    return valueTask({
      question: `Berechne den Wert des Terms ${linStr(a, b)} für x = ${signedNum(x)}.`,
      answerKind: 'integer',
      value,
      solution: signedNum(value),
      explanation: `Setze x = ${signedNum(x)} ein: ${signedNum(a)} · ${parenNum(x)}${addNum(b)} = ${signedNum(a * x)}${addNum(b)} = ${signedNum(value)}.`,
    })
  },
}

const gleichungLinear: Topic = {
  id: 'k8-lb1-gleichung-linear',
  title: 'Lineare Gleichung a·x + b = c',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Gleichung', 'linear', 'lösen', 'x', 'Äquivalenzumformung'],
  fachwissen: {
    text: 'Eine lineare Gleichung der Form a·x + b = c wird durch zwei Äquivalenzumformungen gelöst: (1) Subtrahiere b auf beiden Seiten → a·x = c − b. (2) Dividiere durch a → x = (c − b) / a. Eine lineare Gleichung hat genau eine Lösung (wenn a ≠ 0).',
    quelle: 'Wikipedia: Lineare Gleichung',
    url: 'https://de.wikipedia.org/wiki/Lineare_Gleichung',
  },
  generate: (rng: Rng) => {
    const a = nonZero(rng, -9, 9)
    const x = nonZero(rng, -10, 10)
    const b = nonZero(rng, -15, 15)
    const c = a * x + b
    return valueTask({
      question: `Löse die Gleichung nach x: ${linStr(a, b)} = ${signedNum(c)}`,
      answerKind: 'integer',
      value: x,
      solution: `x = ${signedNum(x)}`,
      explanation: `${b < 0 ? `Addiere ${-b}` : `Subtrahiere ${b}`}: ${polyStr([[a, 'x']])} = ${signedNum(c)}${addNum(-b)} = ${signedNum(a * x)}. Teile durch ${parenNum(a)}: x = ${signedNum(a * x)} : ${parenNum(a)} = ${signedNum(x)}.`,
    })
  },
}

const gleichungBeidseitig: Topic = {
  id: 'k8-lb1-gleichung-beidseitig',
  title: 'Gleichung mit x auf beiden Seiten',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Gleichung', 'beide Seiten', 'lösen', 'x', 'linear'],
  fachwissen: {
    text: 'Erscheint die Unbekannte x auf beiden Seiten der Gleichung, bringt man alle x-Glieder durch Äquivalenzumformung auf eine Seite und alle Zahlen auf die andere. Dann löst man wie bei einer Gleichung der Form a·x = b. Beispiel: 3x + 2 = x + 8 → 2x = 6 → x = 3.',
    quelle: 'Wikipedia: Lineare Gleichung',
    url: 'https://de.wikipedia.org/wiki/Lineare_Gleichung',
  },
  generate: (rng: Rng) => {
    const a = nonZero(rng, -8, 8)
    let c = nonZero(rng, -8, 8)
    while (a === c) c = nonZero(rng, -8, 8)
    const x = nonZero(rng, -9, 9)
    const b = nonZero(rng, -12, 12)
    const d = (a - c) * x + b
    // a·x + b = c·x + d
    return valueTask({
      question: `Löse die Gleichung nach x: ${linStr(a, b)} = ${linStr(c, d)}`,
      answerKind: 'integer',
      value: x,
      solution: `x = ${signedNum(x)}`,
      explanation: `Bringe die x-Glieder nach links, die Zahlen nach rechts: (${signedNum(a)} − ${parenNum(c)})·x = ${signedNum(d)} − ${parenNum(b)}, also ${polyStr([[a - c, 'x']])} = ${signedNum(d - b)}. Teile durch ${parenNum(a - c)}: x = ${signedNum(x)}.`,
    })
  },
}

const ausmultiplizieren: Topic = {
  id: 'k8-lb1-ausmultiplizieren',
  title: 'Klammer ausmultiplizieren (Wert bei x)',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Distributivgesetz', 'ausmultiplizieren', 'Klammer', 'Term'],
  fachwissen: {
    text: 'Das Distributivgesetz erlaubt das Ausmultiplizieren von Klammern: a · (b + c) = a · b + a · c. Beim Ausmultiplizieren mit negativen Faktoren ändern sich alle Vorzeichen innerhalb der Klammer. Umgekehrt können gemeinsame Faktoren ausgeklammert (faktorisiert) werden.',
    quelle: 'Wikipedia: Distributivgesetz',
    url: 'https://de.wikipedia.org/wiki/Distributivgesetz',
  },
  generate: (rng: Rng) => {
    const a = nonZero(rng, -6, 6)
    const b = nonZero(rng, -6, 6)
    const c = nonZero(rng, -8, 8)
    const x = nonZero(rng, -6, 6)
    const value = a * (b * x + c)
    return valueTask({
      question: `Multipliziere aus und berechne für x = ${signedNum(x)}: ${parenNum(a)}·(${linStr(b, c)})`,
      answerKind: 'integer',
      value,
      solution: signedNum(value),
      explanation: `Ausmultiplizieren: ${parenNum(a)}·(${linStr(b, c)}) = ${linStr(a * b, a * c)}. Für x = ${signedNum(x)}: ${signedNum(a * b)} · ${parenNum(x)}${addNum(a * c)} = ${signedNum(a * b * x)}${addNum(a * c)} = ${signedNum(value)}.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 2 — Zufallsversuche
// ---------------------------------------------------------------------------

const laplaceBruch: Topic = {
  id: 'k8-lb2-laplace-bruch',
  title: 'Laplace-Wahrscheinlichkeit als Bruch',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Wahrscheinlichkeit', 'Laplace', 'Zufall', 'Bruch', 'günstige Ergebnisse'],
  fachwissen: {
    text: 'Bei einem Laplace-Zufallsexperiment sind alle möglichen Ergebnisse gleich wahrscheinlich. Die Wahrscheinlichkeit eines Ereignisses A ergibt sich dann als P(A) = (Anzahl günstiger Ergebnisse) / (Anzahl aller möglichen Ergebnisse). Dieser Ansatz geht auf Pierre-Simon Laplace zurück.',
    quelle: 'Wikipedia: Laplace-Experiment',
    url: 'https://de.wikipedia.org/wiki/Laplace-Experiment',
  },
  generate: (rng: Rng) => {
    const rot = randInt(rng, 1, 6)
    const blau = randInt(rng, 1, 6)
    const gruen = randInt(rng, 1, 6)
    const total = rot + blau + gruen
    const farbe = pick(rng, [
      ['rote', rot],
      ['blaue', blau],
      ['grüne', gruen],
    ] as const)
    const value = makeFraction(farbe[1], total)
    return fractionTask({
      question: `In einer Urne liegen ${rot} rote, ${blau} blaue und ${gruen} grüne Kugeln. Wie groß ist die Wahrscheinlichkeit, eine ${farbe[0]} Kugel zu ziehen? Gib den gekürzten Bruch an.`,
      value,
      requireReduced: true,
      solution: format(value),
      explanation: `Es gibt ${farbe[1]} günstige und ${total} mögliche Ergebnisse: P = ${farbe[1]}/${total} = ${format(value)}.`,
    })
  },
}

const laplaceProzent: Topic = {
  id: 'k8-lb2-laplace-prozent',
  title: 'Laplace-Wahrscheinlichkeit in Prozent',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Wahrscheinlichkeit', 'Laplace', 'Prozent', 'Zufall', 'Würfel'],
  fachwissen: {
    text: 'Die Laplace-Wahrscheinlichkeit kann als Dezimalzahl (zwischen 0 und 1) oder als Prozentzahl (P · 100) ausgedrückt werden. P = 0 bedeutet unmögliches Ereignis, P = 1 (100 %) sicheres Ereignis. Im Alltag ist die Prozentdarstellung oft anschaulicher (z. B. „30 % Regenwahrscheinlichkeit").',
    quelle: 'Wikipedia: Wahrscheinlichkeit',
    url: 'https://de.wikipedia.org/wiki/Wahrscheinlichkeit',
  },
  generate: (rng: Rng) => {
    const total = pick(rng, [4, 5, 8, 10, 20, 25])
    const k = randInt(rng, 1, total - 1)
    const value = roundTo((k / total) * 100, 2)
    return valueTask({
      question: `Ein Glücksrad hat ${total} gleich große Felder, davon sind ${k} gewinnbringend. Wie groß ist die Gewinnwahrscheinlichkeit in Prozent?`,
      unit: '%',
      answerKind: 'decimal',
      value,
      solution: `${formatDe(value)} %`,
      explanation: `P = ${k} : ${total} = ${formatDe(k / total)}. In Prozent: · 100 = ${formatDe(value)} %.`,
    })
  },
}

const gegenwahrscheinlichkeit: Topic = {
  id: 'k8-lb2-gegenwahrscheinlichkeit',
  title: 'Gegenwahrscheinlichkeit',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Gegenwahrscheinlichkeit', 'Gegenereignis', 'Wahrscheinlichkeit', 'Komplement'],
  fachwissen: {
    text: 'Das Gegenereignis Ā zu A umfasst alle Ergebnisse, die nicht zu A gehören. Die Summe der Wahrscheinlichkeiten von A und Ā beträgt immer 1: P(A) + P(Ā) = 1. Daraus folgt: P(Ā) = 1 − P(A). Diese Beziehung ist nützlich, wenn die Wahrscheinlichkeit des Gegenereignisses einfacher zu berechnen ist.',
    quelle: 'Wikipedia: Gegenereignis',
    url: 'https://de.wikipedia.org/wiki/Gegenereignis',
  },
  generate: (rng: Rng) => {
    const total = pick(rng, [4, 5, 6, 8, 10, 12])
    const k = randInt(rng, 1, total - 1)
    const p: Fraction = makeFraction(k, total)
    const value = subtract({ n: 1, d: 1 }, p)
    return fractionTask({
      question: `Ein Ereignis hat die Wahrscheinlichkeit ${format(p)}. Wie groß ist die Gegenwahrscheinlichkeit? Gib den gekürzten Bruch an.`,
      value,
      requireReduced: true,
      solution: format(value),
      explanation: `Die Gegenwahrscheinlichkeit ist 1 − P = 1 − ${format(p)} = ${format(value)}.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 3 — Funktionen und lineare Gleichungssysteme
// ---------------------------------------------------------------------------

const funktionswert: Topic = {
  id: 'k8-lb3-funktionswert',
  title: 'Funktionswert einer linearen Funktion',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['lineare Funktion', 'Funktionswert', 'einsetzen', 'Gerade', 'f(x)'],
  fachwissen: {
    text: 'Eine lineare Funktion hat die Form f(x) = m·x + n, wobei m die Steigung und n der y-Achsenabschnitt ist. Ihr Graph ist eine Gerade. Den Funktionswert f(x₀) berechnet man, indem man x₀ für x einsetzt. Lineare Funktionen sind in der Natur und Technik häufig als einfache Modelle (proportionale/lineare Zusammenhänge) anzutreffen.',
    quelle: 'Wikipedia: Lineare Funktion',
    url: 'https://de.wikipedia.org/wiki/Lineare_Funktion',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const m = nonZero(rng, -6, 6)
      const n = nonZero(rng, -10, 10)
      const x = nonZero(rng, -8, 8)
      const value = m * x + n
      return valueTask({
        question: `Gegeben ist f(x) = ${linStr(m, n)}. Berechne f(${signedNum(x)}).`,
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `Setze x = ${signedNum(x)} ein: f(${signedNum(x)}) = ${signedNum(m)} · ${parenNum(x)}${addNum(n)} = ${signedNum(m * x)}${addNum(n)} = ${signedNum(value)}.`,
      })
    },
    (rng: Rng) => {
      const m = nonZero(rng, -4, 4)
      const n = nonZero(rng, -6, 6)
      const x = nonZero(rng, -4, 4)
      const value = m * x + n
      return visualTask({
        question: `Am Graphen von f(x) = ${linStr(m, n)}: Lies f(${signedNum(x)}) ab bzw. berechne den Funktionswert.`,
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `f(${signedNum(x)}) = ${signedNum(m)} · ${parenNum(x)}${addNum(n)} = ${signedNum(value)}. Am Graphen liegt der Punkt (${signedNum(x)} | ${signedNum(value)}).`,
        visualContent: generateLinearFunctionSvg({
          m,
          n,
          points: [{ x, y: value, label: `(${signedNum(x)}|?)` }],
          interceptLabel: false,
          slopeTriangle: { fromX: 0, run: m >= 0 ? 1 : -1, showLabels: false },
        }),
      })
    },
    (rng: Rng) => {
      const m = nonZero(rng, -5, 5)
      const n = nonZero(rng, -8, 8)
      const xs = [-2, -1, 0, 1, 2].map((x) => ({ x, y: m * x + n as number | null }))
      const hideIdx = pick(rng, [0, 1, 3, 4] as const)
      const value = xs[hideIdx].y as number
      const cells = xs.map((c, i) => ({
        x: c.x,
        y: i === hideIdx ? null : c.y,
      }))
      return visualTask({
        question: `Zur linearen Funktion f(x) = ${linStr(m, n)} fehlt ein Wert in der Tabelle. Welcher y-Wert gehört in die Zelle mit ?`,
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `f(${signedNum(xs[hideIdx].x)}) = ${signedNum(m)} · ${parenNum(xs[hideIdx].x)}${addNum(n)} = ${signedNum(value)}.`,
        visualContent: generateValueTableSvg({
          cells,
          xLabel: 'x',
          yLabel: 'f(x)',
        }),
      })
    },
    (rng: Rng) => {
      const m = nonZero(rng, -3, 3)
      const n = randInt(rng, -4, 4)
      return paramSliderTask({
        question: `Stelle m und n so ein, dass f(x) = ${linStr(m, n)} entsteht.`,
        params: [
          { id: 'm', label: 'Steigung m', min: -4, max: 4, step: 1, start: 0 },
          { id: 'n', label: 'Achsenabschnitt n', min: -5, max: 5, step: 1, start: 0 },
        ],
        correct: { m, n },
        solution: `m = ${signedNum(m)}, n = ${signedNum(n)}`,
        explanation: `f(x) = ${linStr(m, n)}.`,
        preview: 'linear',
        instruction: 'Stelle beide Parameter am Schieberegler ein:',
      })
    },
  ),
}

const steigung: Topic = {
  id: 'k8-lb3-steigung',
  title: 'Steigung aus zwei Punkten',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Steigung', 'lineare Funktion', 'Gerade', 'Punkte', 'Differenzenquotient'],
  fachwissen: {
    text: 'Die Steigung m einer Geraden durch P₁(x₁|y₁) und P₂(x₂|y₂) berechnet sich als m = (y₂ − y₁) / (x₂ − x₁). Sie gibt an, um wie viele Einheiten y steigt (positiv) oder fällt (negativ), wenn x um 1 zunimmt. Eine Steigung von 0 bedeutet eine waagerechte Gerade.',
    quelle: 'Wikipedia: Steigung (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Steigung_(Mathematik)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const x1 = nonZero(rng, -8, 8)
      let x2 = nonZero(rng, -8, 8)
      while (x2 === x1) x2 = nonZero(rng, -8, 8)
      const m = nonZero(rng, -5, 5)
      const y1 = randInt(rng, -10, 10)
      const y2 = y1 + m * (x2 - x1)
      return valueTask({
        question: `Eine Gerade verläuft durch P(${signedNum(x1)} | ${signedNum(y1)}) und Q(${signedNum(x2)} | ${signedNum(y2)}). Berechne die Steigung m.`,
        answerKind: 'integer',
        value: m,
        solution: `m = ${signedNum(m)}`,
        explanation: `m = (y₂ − y₁) : (x₂ − x₁) = (${signedNum(y2)} − ${parenNum(y1)}) : (${signedNum(x2)} − ${parenNum(x1)}) = ${signedNum(y2 - y1)} : ${parenNum(x2 - x1)} = ${signedNum(m)}.`,
      })
    },
    (rng: Rng) => {
      const m = nonZero(rng, -4, 4)
      const n = nonZero(rng, -5, 5)
      const fromX = randInt(rng, -3, 2)
      const run = pick(rng, [1, 2] as const)
      const y0 = m * fromX + n
      const y1 = m * (fromX + run) + n
      return visualTask({
        question: 'Lies die Steigung m am Steigungsdreieck ab (m = Δy : Δx).',
        answerKind: 'integer',
        value: m,
        solution: `m = ${signedNum(m)}`,
        explanation: `m = Δy : Δx = (${signedNum(y1)} − ${parenNum(y0)}) : ${run} = ${signedNum(y1 - y0)} : ${run} = ${signedNum(m)}.`,
        visualContent: generateLinearFunctionSvg({
          m,
          n,
          interceptLabel: false,
          points: [
            { x: fromX, y: y0, label: 'P' },
            { x: fromX + run, y: y1, label: 'Q' },
          ],
          slopeTriangle: {
            fromX,
            run,
            dxLabel: `Δx=${run}`,
            dyLabel: `Δy=${signedNum(y1 - y0)}`,
          },
        }),
      })
    },
    (rng: Rng) => {
      const m = nonZero(rng, -3, 3)
      const n = randInt(rng, -4, 4)
      const x1 = -2
      const x2 = 2
      const y1 = m * x1 + n
      const y2 = m * x2 + n
      return visualTask({
        question: `Die Gerade geht durch P(${signedNum(x1)} | ${signedNum(y1)}) und Q(${signedNum(x2)} | ${signedNum(y2)}). Bestimme m.`,
        answerKind: 'integer',
        value: m,
        solution: `m = ${signedNum(m)}`,
        explanation: `m = (${signedNum(y2)} − ${parenNum(y1)}) : (${signedNum(x2)} − ${parenNum(x1)}) = ${signedNum(y2 - y1)} : ${x2 - x1} = ${signedNum(m)}.`,
        visualContent: generateLinearFunctionSvg({
          m,
          n,
          interceptLabel: false,
          points: [
            { x: x1, y: y1, label: 'P' },
            { x: x2, y: y2, label: 'Q' },
          ],
          slopeTriangle: { fromX: x1, run: x2 - x1, showLabels: true },
        }),
      })
    },
    (rng: Rng) => {
      const m = nonZero(rng, -4, 4)
      const n = randInt(rng, -3, 3)
      return paramSliderTask({
        question: `Stelle m und n so ein, dass f(x) = ${linStr(m, n)} entsteht.`,
        params: [
          { id: 'm', label: 'Steigung m', min: -5, max: 5, step: 1, start: 0 },
          { id: 'n', label: 'Achsenabschnitt n', min: -5, max: 5, step: 1, start: 0 },
        ],
        correct: { m, n },
        solution: `m = ${signedNum(m)}, n = ${signedNum(n)}`,
        explanation: `Die Gerade y = ${linStr(m, n)} hat Steigung m = ${signedNum(m)} und Achsenabschnitt n = ${signedNum(n)}.`,
        preview: 'linear',
        instruction: 'Stelle beide Parameter am Schieberegler ein:',
      })
    },
    (rng: Rng) => {
      const mTarget = nonZero(rng, -3, 3)
      let mOther = nonZero(rng, -3, 3)
      while (mOther === mTarget) mOther = nonZero(rng, -3, 3)
      const nA = randInt(rng, -2, 3)
      const nB = randInt(rng, -2, 3)
      const targetIsA = rng() < 0.5
      const mA = targetIsA ? mTarget : mOther
      const mB = targetIsA ? mOther : mTarget
      const correct = targetIsA ? 'A' : 'B'
      return choicePickTask({
        question: `Welche Gerade hat die Steigung m = ${signedNum(mTarget)}?`,
        choices: ['A', 'B'],
        correct,
        solution: correct,
        explanation: `Gerade A: m = ${signedNum(mA)}, Gerade B: m = ${signedNum(mB)}. Gesucht war m = ${signedNum(mTarget)} → ${correct}.`,
        visualContent: generateLinearFunctionSvg({
          m: mA,
          n: nA,
          lineLabel: 'A',
          interceptLabel: false,
          second: { m: mB, n: nB, stroke: '#c62828', label: 'B' },
          xRange: [-5, 5],
          yRange: [-6, 6],
        }),
        instruction: 'Tippe die Gerade mit der gesuchten Steigung:',
      })
    },
  ),
}

const achsenabschnitt: Topic = {
  id: 'k8-lb3-achsenabschnitt',
  title: 'y-Achsenabschnitt bestimmen',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['y-Achsenabschnitt', 'lineare Funktion', 'Gerade', 'n'],
  fachwissen: {
    text: 'Der y-Achsenabschnitt n einer linearen Funktion f(x) = m·x + n ist der y-Wert, bei dem die Gerade die y-Achse schneidet (d. h. bei x = 0). Kennt man die Steigung m und einen Punkt P(x₀|y₀), berechnet man n = y₀ − m·x₀.',
    quelle: 'Wikipedia: Lineare Funktion',
    url: 'https://de.wikipedia.org/wiki/Lineare_Funktion',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const m = nonZero(rng, -5, 5)
      const x = nonZero(rng, -6, 6)
      const n = nonZero(rng, -10, 10)
      const y = m * x + n
      return valueTask({
        question: `Eine Gerade mit der Steigung m = ${signedNum(m)} geht durch den Punkt P(${signedNum(x)} | ${signedNum(y)}). Bestimme den y-Achsenabschnitt n.`,
        answerKind: 'integer',
        value: n,
        solution: `n = ${signedNum(n)}`,
        explanation: `Aus y = m·x + n folgt n = y − m·x = ${signedNum(y)} − ${parenNum(m)} · ${parenNum(x)} = ${signedNum(y)} − ${parenNum(m * x)} = ${signedNum(n)}.`,
      })
    },
    (rng: Rng) => {
      const m = nonZero(rng, -3, 3)
      const n = nonZero(rng, -5, 5)
      const x = nonZero(rng, -3, 3)
      const y = m * x + n
      return visualTask({
        question: `Die Gerade mit Steigung m = ${signedNum(m)} geht durch P(${signedNum(x)} | ${signedNum(y)}). Lies den y-Achsenabschnitt n am Graphen ab.`,
        answerKind: 'integer',
        value: n,
        solution: `n = ${signedNum(n)}`,
        explanation: `Schnittpunkt mit der y-Achse: (0 | ${signedNum(n)}), also n = ${signedNum(n)}. Rechnung: n = ${signedNum(y)} − ${parenNum(m)} · ${parenNum(x)} = ${signedNum(n)}.`,
        visualContent: generateLinearFunctionSvg({
          m,
          n,
          points: [{ x, y, label: 'P' }],
          interceptLabel: '?',
          slopeTriangle: { fromX: 0, run: m >= 0 ? 1 : -1, showLabels: false },
        }),
      })
    },
    (rng: Rng) => {
      const m = nonZero(rng, -3, 3)
      const n = nonZero(rng, -4, 4)
      return paramSliderTask({
        question: `Stelle n so ein, dass die Gerade Steigung m = ${signedNum(m)} und Achsenabschnitt n = ${signedNum(n)} hat.`,
        params: [
          { id: 'm', label: 'Steigung m', min: -4, max: 4, step: 1, start: m },
          { id: 'n', label: 'Achsenabschnitt n', min: -5, max: 5, step: 1, start: 0 },
        ],
        correct: { m, n },
        solution: `n = ${signedNum(n)}`,
        explanation: `y-Achsenabschnitt n = ${signedNum(n)} (Schnitt bei (0|${signedNum(n)})).`,
        preview: 'linear',
        instruction: 'm ist schon richtig — stelle n ein:',
      })
    },
    (rng: Rng) => {
      // Nullstelle: click the x-intercept of y = m x + n
      const m = nonZero(rng, -3, 3)
      const x0 = nonZero(rng, -4, 4)
      const n = -m * x0
      return coordinateClickTask({
        question: `Die Gerade f(x) = ${linStr(m, n)} ist gegeben. Setze den Punkt der Nullstelle (Schnitt mit der x-Achse).`,
        x: x0,
        y: 0,
        solution: `(${signedNum(x0)}|0)`,
        explanation: `Nullstelle: ${linStr(m, n)} = 0 ⇒ x = ${signedNum(x0)}. Punkt (${signedNum(x0)}|0).`,
        xRange: [-6, 6],
        yRange: [-6, 6],
        instruction: 'Tippe die Nullstelle auf der x-Achse:',
      })
    },
  ),
}

const lgs: Topic = {
  id: 'k8-lb3-lgs',
  title: 'Lineares Gleichungssystem (x bestimmen)',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['LGS', 'Gleichungssystem', 'zwei Gleichungen', 'lösen', 'x und y'],
  fachwissen: {
    text: 'Ein lineares Gleichungssystem (LGS) mit zwei Unbekannten x und y hat im Regelfall genau eine Lösung. Lösungsverfahren: Einsetzungsverfahren (eine Variable aus einer Gleichung ausdrücken, einsetzen), Additionsverfahren (Gleichungen so addieren, dass eine Variable wegfällt), Graphisches Verfahren (Schnittpunkt zweier Geraden).',
    quelle: 'Wikipedia: Lineares Gleichungssystem',
    url: 'https://de.wikipedia.org/wiki/Lineares_Gleichungssystem',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const x = nonZero(rng, -6, 6)
      const y = nonZero(rng, -6, 6)
      const a = nonZero(rng, -4, 4)
      const b = nonZero(rng, -4, 4)
      const c = nonZero(rng, -4, 4)
      let d = nonZero(rng, -4, 4)
      while (a * d - b * c === 0) d = nonZero(rng, -4, 4)
      const e = a * x + b * y
      const f = c * x + d * y
      return valueTask({
        question: `Löse das Gleichungssystem und gib x an:  (I) ${polyStr([[a, 'x'], [b, 'y']])} = ${signedNum(e)}  und  (II) ${polyStr([[c, 'x'], [d, 'y']])} = ${signedNum(f)}.`,
        answerKind: 'integer',
        value: x,
        solution: `x = ${signedNum(x)}`,
        explanation: `Additionsverfahren: ${parenNum(d)}·(I) − ${parenNum(b)}·(II) lässt y wegfallen: ${polyStr([[a * d - b * c, 'x']])} = ${signedNum(e * d - f * b)}, also x = ${signedNum(x)}. Einsetzen in (I) liefert y = ${signedNum(y)}.`,
      })
    },
    (rng: Rng) => {
      // Slope-intercept form for a clean graph: y = m1 x + n1, y = m2 x + n2
      const x = nonZero(rng, -4, 4)
      const y = nonZero(rng, -4, 4)
      const m1 = nonZero(rng, -3, 3)
      let m2 = nonZero(rng, -3, 3)
      while (m2 === m1) m2 = nonZero(rng, -3, 3)
      const n1 = y - m1 * x
      const n2 = y - m2 * x
      return visualTask({
        question: `Die Geraden g: y = ${linStr(m1, n1)} und h: y = ${linStr(m2, n2)} schneiden sich. Gib die x-Koordinate des Schnittpunkts an.`,
        answerKind: 'integer',
        value: x,
        solution: `x = ${signedNum(x)}`,
        explanation: `Gleichsetzen: ${linStr(m1, n1)} = ${linStr(m2, n2)} ⇒ ${polyStr([[m1 - m2, 'x']])} = ${signedNum(n2 - n1)} ⇒ x = ${signedNum(x)}. Schnittpunkt S(${signedNum(x)} | ${signedNum(y)}).`,
        visualContent: generateLinearFunctionSvg({
          m: m1,
          n: n1,
          interceptLabel: false,
          points: [{ x, y, label: 'S' }],
          second: { m: m2, n: n2 },
          xRange: [-6, 6],
          yRange: [-6, 6],
        }),
      })
    },
  ),
}

// ---------------------------------------------------------------------------
// Lernbereich 4 — Ähnlichkeit
// ---------------------------------------------------------------------------

const streckfaktor: Topic = {
  id: 'k8-lb4-streckfaktor',
  title: 'Streckfaktor bestimmen',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Ähnlichkeit', 'Streckfaktor', 'zentrische Streckung', 'Maßstab'],
  fachwissen: {
    text: 'Bei der zentrischen Streckung wird jede Strecke mit dem Streckfaktor k multipliziert. Der Streckfaktor k = Bildlänge / Originallänge. Bei k > 1 entsteht eine Vergrößerung, bei 0 < k < 1 eine Verkleinerung, bei k < 0 eine Streckung mit Richtungsumkehr. Maßstäbe in Karten sind ein alltägliches Beispiel.',
    quelle: 'Wikipedia: Zentrische Streckung',
    url: 'https://de.wikipedia.org/wiki/Zentrische_Streckung',
  },
  generate: (rng: Rng) => {
    const orig = randInt(rng, 2, 12)
    const k = randInt(rng, 2, 6)
    const bild = orig * k
    return valueTask({
      question: `Eine Strecke der Länge ${orig} cm wird auf ${bild} cm gestreckt. Bestimme den Streckfaktor k.`,
      answerKind: 'integer',
      value: k,
      solution: `k = ${k}`,
      explanation: `k = Bildlänge : Originallänge = ${bild} cm : ${orig} cm = ${k}.`,
    })
  },
}

const strahlensatz: Topic = {
  id: 'k8-lb4-strahlensatz',
  title: 'Strahlensatz: fehlende Länge',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Strahlensatz', 'Ähnlichkeit', 'Verhältnis', 'Streckenlänge'],
  fachwissen: {
    text: 'Der Strahlensatz beschreibt die Verhältnisse paralleler Strecken beim Schnitt zweier Strahlen: Geht man von einem Punkt S aus, und schneidet eine Gerade parallel zu einer anderen beiden Strahlen, so teilen die Schnittpunkte die Strahlen im gleichen Verhältnis. Damit lassen sich unbekannte Längen berechnen.',
    quelle: 'Wikipedia: Strahlensatz',
    url: 'https://de.wikipedia.org/wiki/Strahlensatz',
  },
  generate: (rng: Rng) => {
    const a = randInt(rng, 2, 8)
    const k = randInt(rng, 2, 6)
    const b = a * k
    const c = randInt(rng, 2, 9)
    const x = c * k
    return valueTask({
      question: `Beim Strahlensatz gilt ${a} : ${b} = ${c} : x. Berechne x.`,
      unit: 'cm',
      answerKind: 'integer',
      value: x,
      solution: `x = ${x} cm`,
      explanation: `Aus ${a} : ${b} = ${c} : x folgt x = ${c} · ${b} : ${a} = ${c} · ${k} = ${x}.`,
    })
  },
}

const aehnlicheSeite: Topic = {
  id: 'k8-lb4-aehnliche-seite',
  title: 'Ähnliche Figuren: Seitenlänge',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Ähnlichkeit', 'ähnliche Dreiecke', 'Seitenverhältnis', 'Faktor'],
  fachwissen: {
    text: 'Zwei Figuren sind ähnlich, wenn sie die gleiche Form, aber unterschiedliche Größe haben. Entsprechende Seiten stehen im gleichen Verhältnis k (Ähnlichkeitsfaktor). Entsprechende Winkel sind gleich groß. Ähnliche Dreiecke entstehen z. B. durch zentrische Streckung, Spiegelung oder Schatten in der Sonne.',
    quelle: 'Wikipedia: Ähnlichkeit (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/%C3%84hnlichkeit_(Geometrie)',
  },
  generate: (rng: Rng) => {
    const seite = randInt(rng, 3, 12)
    const k = randInt(rng, 2, 5)
    const value = seite * k
    return valueTask({
      question: `Zwei Dreiecke sind ähnlich mit dem Faktor k = ${k}. Eine Seite des kleinen Dreiecks ist ${seite} cm lang. Wie lang ist die entsprechende Seite des großen Dreiecks?`,
      unit: 'cm',
      answerKind: 'integer',
      value,
      solution: `${value} cm`,
      explanation: `Bei ähnlichen Figuren werden entsprechende Seiten mit k multipliziert: ${seite} cm · ${k} = ${value} cm.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 5 — Vernetzung: Heuristische Strategien
// ---------------------------------------------------------------------------

const zahlenraetsel: Topic = {
  id: 'k8-lb5-zahlenraetsel',
  title: 'Zahlenrätsel (Gleichung aufstellen)',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Zahlenrätsel', 'Gleichung', 'heuristisch', 'Textaufgabe', 'Rückwärtsrechnen'],
  fachwissen: {
    text: 'Beim Lösen von Zahlenrätseln wird der Sachtext in eine mathematische Gleichung übersetzt. Schlüssel: unbekannte Zahl = x, dann die beschriebenen Operationen in Gleichungsform bringen. Diese heuristische Strategie – Übersetzen in Algebra – ist eine der wichtigsten Problemlösemethoden in der Mathematik.',
    quelle: 'Wikipedia: Gleichung',
    url: 'https://de.wikipedia.org/wiki/Gleichung',
  },
  generate: (rng: Rng) => {
    const a = randInt(rng, 2, 6)
    const b = nonZero(rng, -12, 12)
    const x = randInt(rng, 2, 15)
    const c = a * x + b
    const op = b >= 0 ? `addiere ${b}` : `subtrahiere ${Math.abs(b)}`
    return valueTask({
      question: `Ich denke mir eine Zahl, multipliziere sie mit ${a} und ${op}. Das Ergebnis ist ${signedNum(c)}. Wie lautet die Zahl?`,
      answerKind: 'integer',
      value: x,
      solution: `${x}`,
      explanation: `Gleichung: ${linStr(a, b)} = ${signedNum(c)}. Umstellen: ${a}x = ${signedNum(c)}${addNum(-b)} = ${a * x}, also x = ${a * x} : ${a} = ${x}.`,
    })
  },
}

const rueckwaerts: Topic = {
  id: 'k8-lb5-rueckwaerts',
  title: 'Rückwärtsrechnen',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Rückwärtsrechnen', 'Umkehroperation', 'heuristisch', 'Strategie'],
  fachwissen: {
    text: 'Rückwärtsrechnen (auch: Vorwärtsstrategie umkehren) ist eine heuristische Problemlösestrategie: Man beginnt beim bekannten Endwert und kehrt alle Rechenschritte in umgekehrter Reihenfolge und mit der jeweils inversen Operation um. Diese Strategie eignet sich besonders, wenn der Ausgangswert gesucht ist.',
    quelle: 'Wikipedia: Heuristik',
    url: 'https://de.wikipedia.org/wiki/Heuristik',
  },
  generate: (rng: Rng) => {
    const start = randInt(rng, 2, 20)
    const add = randInt(rng, 1, 15)
    const mal = randInt(rng, 2, 5)
    const end = (start + add) * mal
    return valueTask({
      question: `Zu einer Zahl wird ${add} addiert, das Ergebnis mit ${mal} multipliziert. Man erhält ${end}. Wie lautet die Ausgangszahl?`,
      answerKind: 'integer',
      value: start,
      solution: `${start}`,
      explanation: `Rückwärts: ${end} : ${mal} = ${end / mal}, dann − ${add} = ${start}.`,
    })
  },
}

const systematischProbieren: Topic = {
  id: 'k8-lb5-probieren',
  title: 'Systematisches Probieren',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Probieren', 'heuristisch', 'systematisch', 'Vernetzung'],
  fachwissen: {
    text: 'Systematisches Probieren bedeutet, mögliche Werte geordnet zu testen und Ergebnisse festzuhalten, statt wahllos zu raten. So findet man Lösungen bei Gleichungen, Zahlenrätseln und Sachaufgaben zuverlässiger und kann Fehler leichter erkennen.',
    quelle: 'Wikipedia: Heuristik',
    url: 'https://de.wikipedia.org/wiki/Heuristik',
  },
  generate: (rng: Rng) => {
    const a = randInt(rng, 3, 9)
    const b = randInt(rng, 2, 8)
    const target = a * b + randInt(rng, 1, 5)
    // Find x such that a*x is just below target
    const x = Math.floor((target - 1) / a)
    return valueTask({
      question: `Welche größte ganze Zahl x erfüllt ${a}·x < ${target}?`,
      answerKind: 'integer',
      value: x,
      solution: `${x}`,
      explanation: `${a}·${x} = ${a * x} < ${target}, aber ${a}·${x + 1} = ${a * (x + 1)} ist nicht kleiner als ${target}.`,
    })
  },
}

const skizzeNutzen: Topic = {
  id: 'k8-lb5-skizze',
  title: 'Skizze und Hilfsfigur',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Skizze', 'Hilfsfigur', 'heuristisch', 'Geometrie', 'Vernetzung'],
  fachwissen: {
    text: 'Eine Skizze oder Hilfsfigur macht Beziehungen sichtbar: Längen, Winkel und Teilschritte. In der Heuristik gilt: Visualisieren reduziert Komplexität und hilft, passende Sätze (z. B. Pythagoras, Ähnlichkeit) zu wählen.',
    quelle: 'Wikipedia: Heuristik',
    url: 'https://de.wikipedia.org/wiki/Heuristik',
  },
  generate: (rng: Rng) => {
    const a = randInt(rng, 3, 12)
    const b = randInt(rng, 3, 12)
    const c2 = a * a + b * b
    return valueTask({
      question: `Rechtwinkliges Dreieck mit Katheten ${a} und ${b}. Wie groß ist das Quadrat der Hypotenuse (c²)?`,
      answerKind: 'integer',
      value: c2,
      solution: `${c2}`,
      explanation: `Pythagoras: c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${c2}. Eine Skizze zeigt, welche Seiten Katheten sind.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Grade — Klasse 8 (Gymnasium Mathematik, Sachsen)
// ---------------------------------------------------------------------------

export const klasse8: Grade = {
  id: 'klasse-8',
  title: 'Klasse 8',
  areas: [
    {
      id: 'lb1',
      title: 'Arbeiten mit Termen und Gleichungen',
      ustd: 24,
      topics: [
        zusammenfassen,
        termAuswerten,
        gleichungLinear,
        gleichungBeidseitig,
        ausmultiplizieren,
        k8BinomischeFormel,
      ],
    },
    {
      id: 'lb2',
      title: 'Zufallsversuche',
      ustd: 24,
      topics: [laplaceBruch, laplaceProzent, gegenwahrscheinlichkeit, k8Baumdiagramm, k8ProduktregelAnzahl,
        ...MATH_LEHRPLAN_TEILASPEKTE_BY_GRADE["math8"].filter((x) => x.areaId === "lb2").map((x) => x.topic),
      ],
    },
    {
      id: 'lb3',
      title: 'Funktionen und lineare Gleichungssysteme',
      ustd: 32,
      topics: [
        funktionswert,
        steigung,
        achsenabschnitt,
        lgs,
        ...math8GraphicReviews,
      ],
    },
    {
      id: 'lb4',
      title: 'Ähnlichkeit',
      ustd: 20,
      topics: [
        streckfaktor,
        strahlensatz,
        aehnlicheSeite,
      ],
    },
    {
      id: 'lb5',
      title: 'Vernetzung: Heuristische Strategien',
      ustd: 4,
      topics: [zahlenraetsel, rueckwaerts, systematischProbieren, skizzeNutzen],
    },
  ],
}
