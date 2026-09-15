import { pick, randInt, type Rng } from '../lib/rng'
import {
  generateLinearFunctionSvg,
  generateValueTableSvg,
} from '../lib/geometrySvg'
import { makeFraction, subtract, format, type Fraction } from '../lib/fraction'
import { formatDe, roundTo } from '../lib/num'
import { fractionTask, mixedVariants, valueTask, visualTask } from './taskHelpers'
import type { Grade, Topic } from './types'

const num = (n: number): string => (n < 0 ? `(−${Math.abs(n)})` : `${n}`)
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
  hint: 'Fasse nur die x-Glieder zusammen.',
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
      question: `Fasse zusammen und gib die Zahl vor x an: ${num(a)}x + ${num(b)} + ${num(c)}x + ${num(d)}`,
      answerKind: 'integer',
      value: coeff,
      solution: `${coeff}x`,
      explanation: `Fasse die x-Glieder zusammen: ${num(a)}x + ${num(c)}x = ${coeff}x. Die Zahl vor x ist ${coeff}.`,
    })
  },
}

const termAuswerten: Topic = {
  id: 'k8-lb1-term-auswerten',
  title: 'Term auswerten (x einsetzen)',
  hint: 'Setze den Wert für x ein und rechne aus.',
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
      question: `Berechne den Wert des Terms ${num(a)}·x + ${num(b)} für x = ${x}.`,
      answerKind: 'integer',
      value,
      solution: formatDe(value),
      explanation: `Setze x = ${x} ein: ${num(a)} · ${num(x)} + ${num(b)} = ${a * x} + ${num(b)} = ${value}.`,
    })
  },
}

const gleichungLinear: Topic = {
  id: 'k8-lb1-gleichung-linear',
  title: 'Lineare Gleichung a·x + b = c',
  hint: 'Erst b, dann den Faktor a beseitigen.',
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
      question: `Löse die Gleichung nach x: ${num(a)}·x + ${num(b)} = ${c}`,
      answerKind: 'integer',
      value: x,
      solution: `x = ${x}`,
      explanation: `Subtrahiere ${num(b)}: ${num(a)}·x = ${c} − ${num(b)} = ${a * x}. Teile durch ${num(a)}: x = ${a * x} : ${num(a)} = ${x}.`,
    })
  },
}

const gleichungBeidseitig: Topic = {
  id: 'k8-lb1-gleichung-beidseitig',
  title: 'Gleichung mit x auf beiden Seiten',
  hint: 'Bringe alle x auf eine Seite.',
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
      question: `Löse die Gleichung nach x: ${num(a)}·x + ${num(b)} = ${num(c)}·x + ${num(d)}`,
      answerKind: 'integer',
      value: x,
      solution: `x = ${x}`,
      explanation: `Bringe die x-Glieder nach links, die Zahlen nach rechts: (${a} − ${c})·x = ${d} − ${b}, also ${a - c}·x = ${d - b}. Teile durch ${a - c}: x = ${x}.`,
    })
  },
}

const ausmultiplizieren: Topic = {
  id: 'k8-lb1-ausmultiplizieren',
  title: 'Klammer ausmultiplizieren (Wert bei x)',
  hint: 'Distributivgesetz: a·(bx + c) = ab·x + ac.',
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
      question: `Multipliziere aus und berechne für x = ${x}: ${num(a)}·(${num(b)}x + ${num(c)})`,
      answerKind: 'integer',
      value,
      solution: formatDe(value),
      explanation: `Ausmultiplizieren: ${num(a)}·(${num(b)}x + ${num(c)}) = ${a * b}x + ${num(a * c)}. Für x = ${x}: ${a * b} · ${num(x)} + ${num(a * c)} = ${a * b * x} + ${num(a * c)} = ${value}.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 2 — Zufallsversuche
// ---------------------------------------------------------------------------

const laplaceBruch: Topic = {
  id: 'k8-lb2-laplace-bruch',
  title: 'Laplace-Wahrscheinlichkeit als Bruch',
  hint: 'P = günstige : mögliche Ergebnisse.',
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
  hint: 'P = günstige : mögliche, dann · 100.',
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
  hint: 'P(nicht A) = 1 − P(A).',
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
  hint: 'Setze x in f(x) = m·x + n ein.',
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
        question: `Gegeben ist f(x) = ${num(m)}·x + ${num(n)}. Berechne f(${x}).`,
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `Setze x = ${x} ein: f(${x}) = ${num(m)} · ${num(x)} + ${num(n)} = ${m * x} + ${num(n)} = ${value}.`,
      })
    },
    (rng: Rng) => {
      const m = nonZero(rng, -4, 4)
      const n = nonZero(rng, -6, 6)
      const x = nonZero(rng, -4, 4)
      const value = m * x + n
      return visualTask({
        question: `Am Graphen von f(x) = ${num(m)}·x + ${num(n)}: Lies f(${x}) ab bzw. berechne den Funktionswert.`,
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `f(${x}) = ${num(m)} · ${num(x)} + ${num(n)} = ${value}. Am Graphen liegt der Punkt (${x} | ${value}).`,
        visualContent: generateLinearFunctionSvg({
          m,
          n,
          points: [{ x, y: value, label: `(${x}|?)` }],
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
        question: `Zur linearen Funktion f(x) = ${num(m)}·x + ${num(n)} fehlt ein Wert in der Tabelle. Welcher y-Wert gehört in die Zelle mit ?`,
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `f(${xs[hideIdx].x}) = ${num(m)} · ${num(xs[hideIdx].x)} + ${num(n)} = ${value}.`,
        visualContent: generateValueTableSvg({
          cells,
          xLabel: 'x',
          yLabel: 'f(x)',
        }),
      })
    },
  ),
}

const steigung: Topic = {
  id: 'k8-lb3-steigung',
  title: 'Steigung aus zwei Punkten',
  hint: 'm = (y₂ − y₁) : (x₂ − x₁).',
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
        question: `Eine Gerade verläuft durch P(${x1} | ${y1}) und Q(${x2} | ${y2}). Berechne die Steigung m.`,
        answerKind: 'integer',
        value: m,
        solution: `m = ${m}`,
        explanation: `m = (y₂ − y₁) : (x₂ − x₁) = (${y2} − ${y1}) : (${x2} − ${x1}) = ${y2 - y1} : ${x2 - x1} = ${m}.`,
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
        solution: `m = ${m}`,
        explanation: `m = Δy : Δx = (${y1} − ${y0}) : ${run} = ${y1 - y0} : ${run} = ${m}.`,
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
            dyLabel: `Δy=${y1 - y0}`,
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
        question: `Die Gerade geht durch P(${x1} | ${y1}) und Q(${x2} | ${y2}). Bestimme m.`,
        answerKind: 'integer',
        value: m,
        solution: `m = ${m}`,
        explanation: `m = (${y2} − ${y1}) : (${x2} − ${x1}) = ${y2 - y1} : ${x2 - x1} = ${m}.`,
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
  ),
}

const achsenabschnitt: Topic = {
  id: 'k8-lb3-achsenabschnitt',
  title: 'y-Achsenabschnitt bestimmen',
  hint: 'n = y − m·x.',
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
        question: `Eine Gerade mit der Steigung m = ${m} geht durch den Punkt P(${x} | ${y}). Bestimme den y-Achsenabschnitt n.`,
        answerKind: 'integer',
        value: n,
        solution: `n = ${n}`,
        explanation: `Aus y = m·x + n folgt n = y − m·x = ${y} − ${m} · ${num(x)} = ${y} − ${m * x} = ${n}.`,
      })
    },
    (rng: Rng) => {
      const m = nonZero(rng, -3, 3)
      const n = nonZero(rng, -5, 5)
      const x = nonZero(rng, -3, 3)
      const y = m * x + n
      return visualTask({
        question: `Die Gerade mit Steigung m = ${m} geht durch P(${x} | ${y}). Lies den y-Achsenabschnitt n am Graphen ab.`,
        answerKind: 'integer',
        value: n,
        solution: `n = ${n}`,
        explanation: `Schnittpunkt mit der y-Achse: (0 | ${n}), also n = ${n}. Rechnung: n = ${y} − ${m} · ${num(x)} = ${n}.`,
        visualContent: generateLinearFunctionSvg({
          m,
          n,
          points: [{ x, y, label: 'P' }],
          interceptLabel: '?',
          slopeTriangle: { fromX: 0, run: m >= 0 ? 1 : -1, showLabels: false },
        }),
      })
    },
  ),
}

const lgs: Topic = {
  id: 'k8-lb3-lgs',
  title: 'Lineares Gleichungssystem (x bestimmen)',
  hint: 'Additions- oder Einsetzungsverfahren.',
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
        question: `Löse das Gleichungssystem und gib x an:  ${num(a)}x + ${num(b)}y = ${e}  und  ${num(c)}x + ${num(d)}y = ${f}.`,
        answerKind: 'integer',
        value: x,
        solution: `x = ${x}`,
        explanation: `Mit dem Additionsverfahren erhält man die eindeutige Lösung x = ${x} (und y = ${y}), da die Determinante ${a}·${d} − ${b}·${c} = ${a * d - b * c} ≠ 0 ist.`,
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
        question: `Die Geraden g: y = ${num(m1)}x + ${num(n1)} und h: y = ${num(m2)}x + ${num(n2)} schneiden sich. Gib die x-Koordinate des Schnittpunkts an.`,
        answerKind: 'integer',
        value: x,
        solution: `x = ${x}`,
        explanation: `Schnittpunkt S(${x} | ${y}): setze ${num(m1)}x + ${num(n1)} = ${num(m2)}x + ${num(n2)} → x = ${x}.`,
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
  hint: 'k = Bildlänge : Originallänge.',
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
  hint: 'Gleiche Verhältnisse: a : b = c : x.',
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
  hint: 'Multipliziere mit dem Ähnlichkeitsfaktor.',
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
  hint: 'Übersetze in eine Gleichung und löse.',
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
      question: `Ich denke mir eine Zahl, multipliziere sie mit ${a} und ${op}. Das Ergebnis ist ${c}. Wie lautet die Zahl?`,
      answerKind: 'integer',
      value: x,
      solution: `${x}`,
      explanation: `Gleichung: ${a}·x + ${num(b)} = ${c}. Umstellen: ${a}·x = ${c} − ${num(b)} = ${a * x}, also x = ${x}.`,
    })
  },
}

const rueckwaerts: Topic = {
  id: 'k8-lb5-rueckwaerts',
  title: 'Rückwärtsrechnen',
  hint: 'Kehre die Rechenschritte um.',
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
      topics: [zusammenfassen, termAuswerten, gleichungLinear, gleichungBeidseitig, ausmultiplizieren],
    },
    {
      id: 'lb2',
      title: 'Zufallsversuche',
      ustd: 24,
      topics: [laplaceBruch, laplaceProzent, gegenwahrscheinlichkeit],
    },
    {
      id: 'lb3',
      title: 'Funktionen und lineare Gleichungssysteme',
      ustd: 32,
      topics: [funktionswert, steigung, achsenabschnitt, lgs],
    },
    {
      id: 'lb4',
      title: 'Ähnlichkeit',
      ustd: 20,
      topics: [streckfaktor, strahlensatz, aehnlicheSeite],
    },
    {
      id: 'lb5',
      title: 'Vernetzung: Heuristische Strategien',
      ustd: 4,
      topics: [zahlenraetsel, rueckwaerts],
    },
  ],
}
