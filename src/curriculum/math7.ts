import { pick, randInt, type Rng } from '../lib/rng'
import {
  generateAnglePickSvg,
  generateCrossingLinesSvg,
  generateParallelTransversalSvg,
  generatePyramidSurfaceSvg,
  generatePyramidVolumeSvg,
  generateTriangleAnglesSvg,
} from '../lib/geometrySvg'
import {
  generateBarChartSvg,
  generateCuboidWithPyramidSvg,
  generateLineChartSvg,
  generatePlainPieChartSvg,
} from '../lib/figureSvg'
import { formatDe, roundTo } from '../lib/num'
import { addNum, linStr, parenNum, polyStr, signedNum } from '../lib/termFormat'
import {
  choicePickTask,
  dragDropSortTask,
  equationStepsTask,
  mixedVariants,
  numberLineTask,
  valueTask,
  visualTask,
} from './taskHelpers'
import type { Grade, Topic } from './types'
import { MATH_LEHRPLAN_TEILASPEKTE_BY_GRADE } from './mathLehrplanTeilaspekte'
import { opKey, solveAddPath, solveMulPath, suggestOps } from '../lib/equationSteps'

/** Format a signed integer, wrapping negatives in parentheses with a real minus. */
const num = (n: number): string => (n < 0 ? `(−${Math.abs(n)})` : `${n}`)

/** A non-zero integer in [min, max]. */
const nonZero = (rng: Rng, min: number, max: number): number => {
  let v = 0
  while (v === 0) v = randInt(rng, min, max)
  return v
}

// ---------------------------------------------------------------------------
// Lernbereich 1 — Geometrie in der Ebene
// ---------------------------------------------------------------------------

const nebenwinkel: Topic = {
  id: 'k7-lb1-nebenwinkel',
  title: 'Nebenwinkel berechnen',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Winkel', 'Nebenwinkel', 'Geraden', '180 Grad', 'supplementär'],
  fachwissen: {
    text: 'Nebenwinkel liegen auf einer gemeinsamen Seite eines Schenkels und zusammen an einer Geraden: sie ergänzen sich stets zu 180°. Werden zwei Geraden von einer dritten (Transversalen) geschnitten, entstehen Neben-, Scheitel- und Stufenwinkel mit festen Größenbeziehungen.',
    quelle: 'Wikipedia: Winkel',
    url: 'https://de.wikipedia.org/wiki/Winkel',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 20, 160)
      const value = 180 - a
      return valueTask({
        question: `Ein Winkel misst ${a}°. Wie groß ist sein Nebenwinkel?`,
        unit: '°',
        answerKind: 'integer',
        value,
        solution: `${value}°`,
        explanation: `Nebenwinkel ergänzen sich zu 180°. Also: 180° − ${a}° = ${value}°.`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 25, 155)
      const value = 180 - a
      return visualTask({
        question: 'Wie groß ist der mit ? markierte Nebenwinkel?',
        unit: '°',
        answerKind: 'integer',
        value,
        solution: `${value}°`,
        explanation: `Nebenwinkel an einer Geraden: 180° − ${a}° = ${value}°.`,
        visualContent: generateCrossingLinesSvg({
          angleDeg: a,
          ask: 'neben',
          givenLabel: `${a}°`,
        }),
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 30, 140)
      return choicePickTask({
        question: `Der orangefarbene Winkel misst ${a}°. Welcher Winkel ist ein Nebenwinkel dazu?`,
        choices: ['A', 'B', 'C'],
        correct: 'A',
        solution: 'A',
        explanation:
          'Nebenwinkel liegen nebeneinander an einer Geraden. Winkel A grenzt direkt an den orangefarbenen Winkel. B ist der Scheitelwinkel; C ist der andere Nebenwinkel auf der gegenüberliegenden Geradenseite.',
        visualContent: generateAnglePickSvg({ angleDeg: a }),
        instruction: 'Tippe den Nebenwinkel A (neben dem orangefarbenen Winkel):',
      })
    },
  ),
}

const scheitelwinkel: Topic = {
  id: 'k7-lb1-scheitelwinkel',
  title: 'Scheitel- und Stufenwinkel',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Winkel', 'Scheitelwinkel', 'Stufenwinkel', 'Wechselwinkel', 'Parallelen'],
  fachwissen: {
    text: 'Scheitelwinkel entstehen, wenn zwei Geraden sich kreuzen: sie liegen sich gegenüber und sind gleich groß. Stufenwinkel (F-Winkel) und Wechselwinkel (Z-Winkel) entstehen, wenn eine Transversale zwei parallele Geraden schneidet – Stufen- und Wechselwinkel sind ebenfalls gleich groß.',
    quelle: 'Wikipedia: Scheitelwinkel',
    url: 'https://de.wikipedia.org/wiki/Scheitelwinkel',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 20, 160)
      const art = pick(rng, ['Scheitelwinkel', 'Stufenwinkel', 'Wechselwinkel'])
      const zusatz =
        art === 'Scheitelwinkel'
          ? 'Scheitelwinkel entstehen an sich kreuzenden Geraden'
          : `${art} entstehen an einer Geraden, die zwei Parallelen schneidet`
      return valueTask({
        question: `Zwei ${art} liegen vor. Der eine Winkel misst ${a}°. Wie groß ist der andere?`,
        unit: '°',
        answerKind: 'integer',
        value: a,
        solution: `${a}°`,
        explanation: `${zusatz} und sind gleich groß. Also beträgt der gesuchte Winkel ebenfalls ${a}°.`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 30, 150)
      return visualTask({
        question: 'Wie groß ist der mit ? markierte Scheitelwinkel?',
        unit: '°',
        answerKind: 'integer',
        value: a,
        solution: `${a}°`,
        explanation: `Scheitelwinkel sind gleich groß: ${a}°.`,
        visualContent: generateCrossingLinesSvg({
          angleDeg: a,
          ask: 'scheitel',
          givenLabel: `${a}°`,
        }),
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 35, 145)
      const kind = pick(rng, ['stufen', 'wechsel'] as const)
      const title = kind === 'stufen' ? 'Stufenwinkel' : 'Wechselwinkel'
      return visualTask({
        question: `Die Geraden g und h sind parallel. Wie groß ist der mit ? markierte ${title}?`,
        unit: '°',
        answerKind: 'integer',
        value: a,
        solution: `${a}°`,
        explanation: `${title} an Parallelen sind gleich groß: ${a}°.`,
        visualContent: generateParallelTransversalSvg({
          angleDeg: a,
          kind,
          givenLabel: `${a}°`,
        }),
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 30, 140)
      return choicePickTask({
        question: `Der orangefarbene Winkel misst ${a}°. Welcher Winkel ist der Scheitelwinkel dazu?`,
        choices: ['A', 'B', 'C'],
        correct: 'B',
        solution: 'B',
        explanation:
          'Scheitelwinkel liegen sich gegenüber. Winkel B liegt dem orangefarbenen Winkel gegenüber und ist gleich groß.',
        visualContent: generateAnglePickSvg({ angleDeg: a }),
        instruction: 'Tippe den Scheitelwinkel:',
      })
    },
  ),
}

const winkelsummeVieleck: Topic = {
  id: 'k7-lb1-winkelsumme-vieleck',
  title: 'Innenwinkelsumme im Vieleck',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Vieleck', 'Polygon', 'Innenwinkelsumme', 'Winkelsumme', 'n-Eck'],
  fachwissen: {
    text: 'Jedes konvexe n-Eck lässt sich durch Diagonalen von einem Eckpunkt aus in (n−2) Dreiecke zerlegen. Da jedes Dreieck eine Winkelsumme von 180° hat, ergibt sich für das n-Eck: Winkelsumme = (n−2) · 180°. Beispiele: Dreieck (n=3): 180°, Viereck: 360°, Fünfeck: 540°, Sechseck: 720°.',
    quelle: 'Wikipedia: Vieleck',
    url: 'https://de.wikipedia.org/wiki/Vieleck',
  },
  generate: (rng: Rng) => {
    const n = randInt(rng, 3, 12)
    const value = (n - 2) * 180
    return valueTask({
      question: `Wie groß ist die Summe der Innenwinkel in einem ${n}-Eck?`,
      unit: '°',
      answerKind: 'integer',
      value,
      solution: `${value}°`,
      explanation: `Die Innenwinkelsumme eines n-Ecks ist (n − 2) · 180°. Für n = ${n}: (${n} − 2) · 180° = ${n - 2} · 180° = ${value}°.`,
    })
  },
}

const basiswinkel: Topic = {
  id: 'k7-lb1-basiswinkel',
  title: 'Basiswinkel im gleichschenkligen Dreieck',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Dreieck', 'gleichschenklig', 'Basiswinkel', 'Winkel'],
  fachwissen: {
    text: 'In einem gleichschenkligen Dreieck sind die beiden Schenkel gleich lang. Die Winkel an der Basis (gegenüber den gleichen Schenkeln) sind deshalb gleich groß. Aus der Winkelsumme (180°) folgt: Jeder Basiswinkel = (180° − Spitzenwinkel) / 2.',
    quelle: 'Wikipedia: Gleichschenkliges Dreieck',
    url: 'https://de.wikipedia.org/wiki/Gleichschenkliges_Dreieck',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const spitze = randInt(rng, 20, 140) * 1
      const apex = spitze % 2 === 0 ? spitze : spitze + 1
      const value = (180 - apex) / 2
      return valueTask({
        question: `In einem gleichschenkligen Dreieck ist der Winkel an der Spitze ${apex}°. Wie groß ist jeder Basiswinkel?`,
        unit: '°',
        answerKind: 'integer',
        value,
        solution: `${value}°`,
        explanation: `Die Winkelsumme ist 180°. Die beiden gleich großen Basiswinkel teilen sich 180° − ${apex}° = ${180 - apex}° auf: (${180 - apex}°) : 2 = ${value}°.`,
      })
    },
    (rng: Rng) => {
      const apex = pick(rng, [40, 50, 60, 70, 80, 100, 120])
      const base = (180 - apex) / 2
      return visualTask({
        question: 'Gleichschenkliges Dreieck: Wie groß ist jeder Basiswinkel (markiert mit ?)?',
        unit: '°',
        answerKind: 'integer',
        value: base,
        solution: `${base}°`,
        explanation: `Basiswinkel = (180° − ${apex}°) : 2 = ${base}°.`,
        visualContent: generateTriangleAnglesSvg({
          aLabel: '?',
          bLabel: '?',
          cLabel: `${apex}°`,
          anglesDeg: [base, base, apex],
        }),
      })
    },
  ),
}

// ---------------------------------------------------------------------------
// Lernbereich 2 — Arbeiten mit rationalen Zahlen
// ---------------------------------------------------------------------------

const addRational: Topic = {
  id: 'k7-lb2-add-rational',
  title: 'Rationale Zahlen addieren',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['rationale Zahlen', 'Vorzeichen', 'negative Zahlen', 'addieren', 'Addition'],
  fachwissen: {
    text: 'Rationale Zahlen (ℚ) umfassen alle ganzen Zahlen und Brüche, auch negative. Beim Addieren zweier Zahlen mit gleichem Vorzeichen addiert man die Beträge und behält das Vorzeichen. Bei verschiedenen Vorzeichen subtrahiert man die kleineren Betrag vom größeren und übernimmt das Vorzeichen der betragsmäßig größeren Zahl.',
    quelle: 'Wikipedia: Rationale Zahl',
    url: 'https://de.wikipedia.org/wiki/Rationale_Zahl',
  },
  generate: (rng: Rng) => {
    // Mindestens eine negative Zahl — sonst Unterforderung (reine natürliche Addition).
    let a = nonZero(rng, -20, 20)
    let b = nonZero(rng, -20, 20)
    if (a > 0 && b > 0) b = -b
    const value = a + b
    return valueTask({
      question: `Berechne: ${signedNum(a)} + ${num(b)}`,
      answerKind: 'integer',
      value,
      solution: formatDe(value),
      explanation: `Addiere unter Beachtung der Vorzeichen: ${signedNum(a)} + ${num(b)} = ${signedNum(value)}.`,
    })
  },
}

const subRational: Topic = {
  id: 'k7-lb2-sub-rational',
  title: 'Rationale Zahlen subtrahieren',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['rationale Zahlen', 'Vorzeichen', 'negative Zahlen', 'subtrahieren', 'Subtraktion'],
  fachwissen: {
    text: 'Subtrahieren heißt die Gegenzahl addieren: a − b = a + (−b). Die Gegenzahl einer negativen Zahl ist positiv. Beispiel: 3 − (−5) = 3 + 5 = 8. Diese Umformung macht klar, warum „Minus mal Minus Plus ergibt" und erleichtert das Rechnen mit negativen Zahlen.',
    quelle: 'Wikipedia: Rationale Zahl',
    url: 'https://de.wikipedia.org/wiki/Rationale_Zahl',
  },
  generate: (rng: Rng) => {
    let a = nonZero(rng, -20, 20)
    let b = nonZero(rng, -20, 20)
    // Oft Minus einer negativen Zahl — Kerngedanke K7.
    if (rng() < 0.55) b = -Math.abs(b)
    else if (a > 0 && b > 0) a = -a
    const value = a - b
    return valueTask({
      question: `Berechne: ${signedNum(a)} − ${num(b)}`,
      answerKind: 'integer',
      value,
      solution: formatDe(value),
      explanation: `Subtrahieren heißt die Gegenzahl addieren: ${signedNum(a)} − ${num(b)} = ${signedNum(a)} + ${num(-b)} = ${signedNum(value)}.`,
    })
  },
}

const mulRational: Topic = {
  id: 'k7-lb2-mul-rational',
  title: 'Rationale Zahlen multiplizieren',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['rationale Zahlen', 'Vorzeichenregel', 'multiplizieren', 'Multiplikation', 'mal'],
  fachwissen: {
    text: 'Die Vorzeichenregel bei der Multiplikation: Gleiches Vorzeichen ergibt positives Ergebnis (+·+ = + und −·− = +), verschiedene Vorzeichen ergeben ein negatives Ergebnis (+·− = − und −·+ = −). Den Betrag des Produkts bestimmt man durch normale Multiplikation der Beträge.',
    quelle: 'Wikipedia: Vorzeichenregel',
    url: 'https://de.wikipedia.org/wiki/Vorzeichenregel',
  },
  generate: (rng: Rng) => {
    // Mindestens ein Faktor negativ — Vorzeichenregel üben (K7, nicht K5-Multiplikation).
    let a = nonZero(rng, -12, 12)
    let b = nonZero(rng, -12, 12)
    if (a > 0 && b > 0) a = -a
    const value = a * b
    const sign =
      a * b >= 0
        ? 'gleiche Vorzeichen ergeben ein positives'
        : 'verschiedene Vorzeichen ergeben ein negatives'
    return valueTask({
      question: `Berechne: ${signedNum(a)} · ${num(b)}`,
      answerKind: 'integer',
      value,
      solution: formatDe(value),
      explanation: `Vorzeichenregel: ${sign} Ergebnis. Der Betrag ist ${Math.abs(a)} · ${Math.abs(b)} = ${Math.abs(value)}. Also ${signedNum(a)} · ${num(b)} = ${signedNum(value)}.`,
    })
  },
}

const divRational: Topic = {
  id: 'k7-lb2-div-rational',
  title: 'Rationale Zahlen dividieren',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['rationale Zahlen', 'Vorzeichenregel', 'dividieren', 'Division', 'teilen'],
  fachwissen: {
    text: 'Bei der Division rationaler Zahlen gelten dieselben Vorzeichenregeln wie bei der Multiplikation: a : b = a · (1/b). Das Vorzeichen ergibt sich aus der Vorzeichenregel; der Betrag wird durch normale Division der Beträge berechnet. Division durch 0 ist nicht definiert.',
    quelle: 'Wikipedia: Vorzeichenregel',
    url: 'https://de.wikipedia.org/wiki/Vorzeichenregel',
  },
  generate: (rng: Rng) => {
    const b = nonZero(rng, -12, 12)
    const q = nonZero(rng, -12, 12)
    const a = b * q
    return valueTask({
      question: `Berechne: ${signedNum(a)} : ${num(b)}`,
      answerKind: 'integer',
      value: q,
      solution: formatDe(q),
      explanation: `Vorzeichenregel wie beim Multiplizieren. Der Betrag ist ${Math.abs(a)} : ${Math.abs(b)} = ${Math.abs(q)}. Also ${signedNum(a)} : ${num(b)} = ${signedNum(q)}.`,
    })
  },
}

const betrag: Topic = {
  id: 'k7-lb2-betrag',
  title: 'Betrag einer Zahl',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Betrag', 'Absolutbetrag', 'Betragsstriche', 'Abstand'],
  fachwissen: {
    text: 'Der Betrag (Absolutbetrag) |a| einer Zahl a ist ihr Abstand von 0 auf dem Zahlenstrahl. Er ist stets nicht negativ: |a| = a wenn a ≥ 0, und |a| = −a wenn a < 0. Der Betrag ermöglicht den Vergleich von Zahlen unabhängig vom Vorzeichen und ist wichtig für Abstands- und Fehlerberechnungen.',
    quelle: 'Wikipedia: Betrag (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Betrag_(Mathematik)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = nonZero(rng, -99, 99)
      const value = Math.abs(a)
      return valueTask({
        question: `Berechne den Betrag: |${signedNum(a)}|`,
        answerKind: 'integer',
        value,
        solution: `${value}`,
        explanation: `Der Betrag ist der Abstand der Zahl von 0 auf dem Zahlenstrahl und daher nie negativ: |${signedNum(a)}| = ${value}.`,
      })
    },
    (rng: Rng) => {
      const a = nonZero(rng, -8, 8)
      const value = Math.abs(a)
      return numberLineTask({
        question: `Markiere den Betrag |${signedNum(a)}| auf dem Zahlenstrahl.`,
        min: 0,
        max: 10,
        step: 1,
        value,
        solution: `${value}`,
        explanation: `|${signedNum(a)}| = ${value} (Abstand von 0).`,
      })
    },
    (rng: Rng) => {
      const used = new Set<number>()
      const nums: number[] = []
      while (nums.length < 4) {
        const n = nonZero(rng, -9, 9)
        if (used.has(n)) continue
        used.add(n)
        nums.push(n)
      }
      const items = nums.map((n) => ({ label: signedNum(n), value: n }))
      const correctOrder = items
        .map((_, i) => i)
        .sort((i, j) => items[i].value - items[j].value)
      return dragDropSortTask({
        question: 'Ordne die Zahlen der Größe nach (kleinste zuerst).',
        items,
        correctOrder,
        solution: correctOrder.map((i) => items[i].label).join(' < '),
        explanation: `Auf dem Zahlenstrahl von links nach rechts: ${correctOrder.map((i) => items[i].label).join(' < ')}.`,
      })
    },
  ),
}

const termVorrang: Topic = {
  id: 'k7-lb2-term-vorrang',
  title: 'Term mit Rechengesetzen auswerten',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Term', 'Rechengesetze', 'Punkt vor Strich', 'Klammer', 'auswerten'],
  fachwissen: {
    text: 'Beim Auswerten von Termen gilt die Operatorrangfolge: Klammern zuerst, dann Potenzierung, dann Multiplikation/Division (Punktrechnung), zuletzt Addition/Subtraktion (Strichrechnung). Diese Regeln sind verbindlich und müssen bei gemischten Termen streng eingehalten werden, um eindeutige Ergebnisse zu sichern.',
    quelle: 'Wikipedia: Rechenregeln',
    url: 'https://de.wikipedia.org/wiki/Punkt-vor-Strich-Rechnung',
  },
  generate: (rng: Rng) => {
    const a = nonZero(rng, -9, 9)
    const b = nonZero(rng, -9, 9)
    const c = nonZero(rng, -9, 9)
    const value = a + b * c
    return valueTask({
      question: `Berechne: ${signedNum(a)} + ${num(b)} · ${num(c)}`,
      answerKind: 'integer',
      value,
      solution: formatDe(value),
      explanation: `Punkt vor Strich: zuerst ${num(b)} · ${num(c)} = ${signedNum(b * c)}. Dann ${signedNum(a)} + ${num(b * c)} = ${signedNum(value)}.`,
    })
  },
}

const gleichungAdd: Topic = {
  id: 'k7-lb2-gleichung-add',
  title: 'Gleichung umstellen: x + a = b',
  hint: 'Tippe die Umformungsschritte über die Buttons an.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Gleichung', 'lösen', 'x', 'Äquivalenzumformung', 'Addition', 'Subtraktion'],
  fachwissen: {
    text: 'Gleichungen der Form x + a = b löst du durch Äquivalenzumformung: Subtrahiere a auf beiden Seiten (bzw. addiere −a). Schreibe jeden Schritt untereinander — so wie im Heft mit „| − a“ rechts. Am Ende steht x = b − a.',
    quelle: 'Wikipedia: Gleichung',
    url: 'https://de.wikipedia.org/wiki/Gleichung',
  },
  generate: (rng: Rng) => {
    const x = nonZero(rng, -15, 15)
    const a = nonZero(rng, -15, 15)
    const b = x + a
    const start = { ax: 1, b: a, cx: 0, d: b }
    const solutionOps = solveAddPath(a, b)
    const buttons = suggestOps(start, rng)
    // Ensure the correct op is always among buttons
    const keys = new Set(buttons.map(opKey))
    for (const op of solutionOps) {
      if (!keys.has(opKey(op))) buttons.unshift(op)
    }
    return equationStepsTask({
      question: `Stelle die Gleichung Schritt für Schritt um und löse nach x: ${linStr(1, a)} = ${signedNum(b)}`,
      start,
      buttons: buttons.slice(0, 6),
      solutionOps,
      solution: x,
      explanation: `${a < 0 ? `Addiere ${-a}` : `Subtrahiere ${a}`} auf beiden Seiten: x = ${signedNum(b)}${addNum(-a)} = ${signedNum(x)}.`,
      instruction: 'Tippe die passende Umformung (gilt für beide Seiten), bis x allein steht:',
    })
  },
}

const gleichungMul: Topic = {
  id: 'k7-lb2-gleichung-mul',
  title: 'Gleichung umstellen: a · x = b',
  hint: 'Tippe die Umformungsschritte über die Buttons an.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Gleichung', 'lösen', 'x', 'Faktor', 'Division', 'Multiplikation', 'Terme'],
  fachwissen: {
    text: 'Gleichungen der Form a · x = b löst du, indem du beide Seiten durch a dividierst (a ≠ 0). Schreibe die Umformung „| : a“ und berechne x = b : a.',
    quelle: 'Wikipedia: Lineare Gleichung',
    url: 'https://de.wikipedia.org/wiki/Lineare_Gleichung',
  },
  generate: (rng: Rng) => {
    const a = nonZero(rng, -9, 9)
    const x = nonZero(rng, -12, 12)
    const b = a * x
    const start = { ax: a, b: 0, cx: 0, d: b }
    const solutionOps = solveMulPath(a, b)
    const buttons = suggestOps(start, rng)
    const keys = new Set(buttons.map(opKey))
    for (const op of solutionOps) {
      if (!keys.has(opKey(op))) buttons.unshift(op)
    }
    return equationStepsTask({
      question: `Stelle die Gleichung Schritt für Schritt um und löse nach x: ${polyStr([[a, 'x']])} = ${signedNum(b)}`,
      start,
      buttons: buttons.slice(0, 6),
      solutionOps,
      solution: x,
      explanation: `Beide Seiten durch ${parenNum(a)} teilen: x = ${signedNum(b)} : ${parenNum(a)} = ${signedNum(x)}.`,
      instruction: 'Tippe die passende Umformung (gilt für beide Seiten), bis x allein steht:',
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 3 — Darstellen und Berechnen von Prismen und Pyramiden
// ---------------------------------------------------------------------------

const volumenPrisma: Topic = {
  id: 'k7-lb3-volumen-prisma',
  title: 'Volumen zusammengesetzter Körper mit Pyramiden',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['zusammengesetzter Körper', 'Pyramide', 'Quader', 'Volumen', 'Rückführprinzip'],
  fachwissen: {
    text: 'Zusammengesetzte Körper zerlegt man in Teilkörper, deren Volumen man kennt (Rückführprinzip): Quader und Prisma V = G · h, Pyramide V = 1/3 · G · h. Aufgesetzte Teile addiert man, herausgeschnittene subtrahiert man. Wichtig ist, für jeden Teilkörper die richtige Höhe zu verwenden.',
    quelle: 'Wikipedia: Pyramide (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Pyramide_(Geometrie)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = pick(rng, [3, 6, 9, 12])
      const hq = randInt(rng, 4, 15)
      const hp = randInt(rng, 2, 10)
      const vq = a * a * hq
      const vp = (a * a * hp) / 3
      const value = vq + vp
      return visualTask({
        question: `Ein Turm besteht aus einem Quader mit quadratischer Grundfläche (a = ${a} cm, Höhe ${hq} cm) und einer aufgesetzten Pyramide mit der Höhe ${hp} cm. Berechne das Volumen des Turms.`,
        unit: 'cm³',
        answerKind: 'integer',
        value,
        solution: `${value} cm³`,
        explanation: `Quader: ${a} · ${a} · ${hq} = ${vq} cm³. Pyramide: 1/3 · ${a * a} · ${hp} = ${vp} cm³. Turm: ${vq} + ${vp} = ${value} cm³.`,
        visualContent: generateCuboidWithPyramidSvg({
          edgeLabel: `${a} cm`,
          cuboidHeightLabel: `${hq} cm`,
          pyramidHeightLabel: `${hp} cm`,
        }),
        dedupeKey: `ma:k7:zus:turm:${a}:${hq}:${hp}`,
      })
    },
    (rng: Rng) => {
      const a = pick(rng, [3, 6, 9, 12])
      const value = (2 * a * a * a) / 3
      return valueTask({
        question: `Aus einem Holzwürfel mit der Kantenlänge ${a} cm wird eine Pyramide herausgefräst: Ihre Grundfläche ist die Deckfläche des Würfels, ihre Spitze liegt in der Mitte der Bodenfläche. Wie groß ist das Restvolumen?`,
        unit: 'cm³',
        answerKind: 'integer',
        value,
        solution: `${value} cm³`,
        explanation: `Würfel: ${a}³ = ${a ** 3} cm³. Die Pyramide hat dieselbe Grundfläche und Höhe: 1/3 · ${a * a} · ${a} = ${a ** 3 / 3} cm³. Rest: ${a ** 3} − ${a ** 3 / 3} = ${value} cm³.`,
        dedupeKey: `ma:k7:zus:fraese:${a}`,
      })
    },
    (rng: Rng) => {
      const a = pick(rng, [4, 6, 8])
      const b = pick(rng, [3, 6, 9])
      const hq = randInt(rng, 3, 9)
      const hp = pick(rng, [3, 6])
      const vq = a * b * hq
      const vp = (a * b * hp) / 3
      const value = vq + vp
      return valueTask({
        question: `Ein Kerzenständer hat einen Sockel (Quader ${a} cm × ${b} cm × ${hq} cm) und darauf eine Pyramide mit derselben rechteckigen Grundfläche und der Höhe ${hp} cm. Wie viel cm³ Material braucht man?`,
        unit: 'cm³',
        answerKind: 'integer',
        value,
        solution: `${value} cm³`,
        explanation: `Sockel: ${a} · ${b} · ${hq} = ${vq} cm³. Pyramide: 1/3 · ${a} · ${b} · ${hp} = ${vp} cm³. Zusammen: ${value} cm³.`,
        dedupeKey: `ma:k7:zus:kerze:${a}:${b}:${hq}:${hp}`,
      })
    },
  ),
}

const DICHTEN = [
  { stoff: 'Granit', rho: 2.7 },
  { stoff: 'Eichenholz', rho: 0.8 },
  { stoff: 'Messing', rho: 8.5 },
  { stoff: 'Glas', rho: 2.5 },
  { stoff: 'Aluminium', rho: 2.7 },
] as const

const mantelPrisma: Topic = {
  id: 'k7-lb3-mantel-prisma',
  title: 'Masse von Pyramiden und Prismen',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Masse', 'Dichte', 'Volumen', 'Pyramide', 'Prisma'],
  fachwissen: {
    text: 'Die Masse eines Körpers erhält man aus Volumen und Dichte: m = ρ · V. Ist die Dichte in g/cm³ angegeben, setzt man das Volumen in cm³ ein und erhält die Masse in Gramm; 1000 g = 1 kg. Das Volumen berechnet man vorher mit der passenden Formel, z. B. Pyramide V = 1/3 · G · h.',
    quelle: 'Wikipedia: Dichte',
    url: 'https://de.wikipedia.org/wiki/Dichte',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const { stoff, rho } = pick(rng, DICHTEN)
      const a = pick(rng, [3, 6, 9])
      const h = randInt(rng, 4, 12)
      const V = (a * a * h) / 3
      const value = roundTo(V * rho, 1)
      return valueTask({
        question: `Ein Briefbeschwerer aus ${stoff} (ρ = ${formatDe(rho)} g/cm³) hat die Form einer quadratischen Pyramide mit a = ${a} cm und h = ${h} cm. Wie schwer ist er?`,
        unit: 'g',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} g`,
        explanation: `V = 1/3 · ${a}² · ${h} = ${formatDe(V)} cm³. m = ρ · V = ${formatDe(rho)} g/cm³ · ${formatDe(V)} cm³ = ${formatDe(value)} g.`,
        dedupeKey: `ma:k7:masse:pyr:${stoff}:${a}:${h}`,
      })
    },
    (rng: Rng) => {
      const { stoff, rho } = pick(rng, DICHTEN)
      const g = pick(rng, [4, 6, 8, 10])
      const hg = randInt(rng, 3, 8)
      const l = pick(rng, [20, 25, 40, 50])
      const V = (g * hg * l) / 2
      const value = roundTo((V * rho) / 1000, 3)
      return valueTask({
        question: `Ein Keil aus ${stoff} (ρ = ${formatDe(rho)} g/cm³) ist ein dreiseitiges Prisma: Das Querschnittsdreieck hat g = ${g} cm und h_g = ${hg} cm, der Keil ist ${l} cm lang. Wie viel kg wiegt er?`,
        unit: 'kg',
        answerKind: 'decimal',
        value,
        eps: 0.0006,
        solution: `${formatDe(value)} kg`,
        explanation: `V = ${g} · ${hg} : 2 · ${l} = ${formatDe(V)} cm³. m = ${formatDe(rho)} · ${formatDe(V)} = ${formatDe(roundTo(V * rho, 1))} g = ${formatDe(value)} kg.`,
        dedupeKey: `ma:k7:masse:keil:${stoff}:${g}:${hg}:${l}`,
      })
    },
    (rng: Rng) => {
      const { stoff, rho } = pick(rng, DICHTEN)
      const a = pick(rng, [3, 6])
      const h = pick(rng, [5, 10, 20])
      const V = (a * a * h) / 3
      const m = roundTo(V * rho, 1)
      return valueTask({
        question: `Eine massive Pyramide mit quadratischer Grundfläche (a = ${a} cm, h = ${h} cm) wiegt ${formatDe(m)} g. Welche Dichte hat das Material in g/cm³?`,
        unit: 'g/cm³',
        answerKind: 'decimal',
        value: rho,
        eps: 0.01,
        solution: `${formatDe(rho)} g/cm³ (z. B. ${stoff})`,
        explanation: `V = 1/3 · ${a}² · ${h} = ${formatDe(V)} cm³. ρ = m : V = ${formatDe(m)} g : ${formatDe(V)} cm³ = ${formatDe(rho)} g/cm³.`,
        dedupeKey: `ma:k7:masse:dichte:${stoff}:${a}:${h}`,
      })
    },
  ),
}

const volumenPyramide: Topic = {
  id: 'k7-lb3-volumen-pyramide',
  title: 'Volumen einer Pyramide',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Pyramide', 'Volumen', 'Grundfläche', 'ein Drittel'],
  fachwissen: {
    text: 'Das Volumen einer Pyramide beträgt ein Drittel des zugehörigen Prismas gleicher Grundfläche und Höhe: V = (1/3) · G · h. Diese Formel gilt für alle Pyramiden, unabhängig von der Form der Grundfläche. Anschaulich lassen sich drei Pyramiden zu einem Prisma zusammensetzen.',
    quelle: 'Wikipedia: Pyramide (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Pyramide_(Geometrie)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const g = 3 * randInt(rng, 2, 40)
      const h = randInt(rng, 2, 18)
      const value = (g * h) / 3
      return valueTask({
        question: `Eine Pyramide hat die Grundfläche ${g} cm² und die Höhe ${h} cm. Berechne ihr Volumen.`,
        unit: 'cm³',
        answerKind: 'integer',
        value,
        solution: `${value} cm³`,
        explanation: `Volumen einer Pyramide = (1/3) · Grundfläche · Höhe = (1/3) · ${g} cm² · ${h} cm = ${g / 3} · ${h} cm³ = ${value} cm³.`,
      })
    },
    (rng: Rng) => {
      const g = 3 * randInt(rng, 4, 30)
      const h = randInt(rng, 3, 18)
      const value = (g * h) / 3
      return visualTask({
        question: 'Berechne das Volumen der abgebildeten Pyramide:',
        unit: 'cm³',
        answerKind: 'integer',
        value,
        solution: `${value} cm³`,
        explanation: `V = (1/3) · ${g} · ${h} = ${value} cm³.`,
        visualContent: generatePyramidVolumeSvg({
          baseAreaLabel: `${g} cm²`,
          heightLabel: `${h} cm`,
        }),
      })
    },
  ),
}

const oberflaechePrisma: Topic = {
  id: 'k7-lb3-oberflaeche-quader',
  title: 'Oberflächeninhalt zusammengesetzter Körper',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['zusammengesetzter Körper', 'Oberfläche', 'Pyramide', 'Quader', 'Mantel'],
  fachwissen: {
    text: 'Beim Oberflächeninhalt eines zusammengesetzten Körpers zählen nur die Flächen, die man von außen sieht. Die Berührfläche zweier Teilkörper liegt innen und wird nicht mitgerechnet. Für einen Quader mit aufgesetzter quadratischer Pyramide gilt: Bodenfläche a² + vier Seitenrechtecke 4 · a · h_Q + Pyramidenmantel 4 · (a · hₛ : 2).',
    quelle: 'Wikipedia: Oberflächeninhalt',
    url: 'https://de.wikipedia.org/wiki/Oberfl%C3%A4cheninhalt',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 4, 12)
      const hq = randInt(rng, 3, 12)
      const hs = randInt(rng, 3, 10)
      const boden = a * a
      const seiten = 4 * a * hq
      const mantel = 2 * a * hs
      const value = boden + seiten + mantel
      return visualTask({
        question: `Ein Turm besteht aus einem Quader mit quadratischer Grundfläche (a = ${a} cm, Höhe ${hq} cm) und einer aufgesetzten Pyramide mit der Seitenflächenhöhe hₛ = ${hs} cm. Berechne den Oberflächeninhalt des Turms.`,
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `Boden: ${a}² = ${boden} cm². Seitenrechtecke: 4 · ${a} · ${hq} = ${seiten} cm². Pyramidenmantel: 4 · ${a} · ${hs} : 2 = ${mantel} cm². Die Deckfläche des Quaders liegt innen und zählt nicht. O = ${boden} + ${seiten} + ${mantel} = ${value} cm².`,
        visualContent: generateCuboidWithPyramidSvg({
          edgeLabel: `${a} cm`,
          cuboidHeightLabel: `${hq} cm`,
          slantHeightLabel: `${hs} cm`,
        }),
        dedupeKey: `ma:k7:ozus:turm:${a}:${hq}:${hs}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 4, 10)
      const hs = randInt(rng, 3, 9)
      const value = 4 * a * a + 2 * a * hs
      return valueTask({
        question: `Auf einen Würfel mit der Kantenlänge ${a} cm wird eine quadratische Pyramide mit gleicher Grundkante gesetzt; ihre Seitenflächenhöhe beträgt ${hs} cm. Der Körper steht auf dem Tisch. Wie viel cm² müssen lackiert werden, wenn die Standfläche unlackiert bleibt?`,
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `Sichtbar sind vier Würfelseiten: 4 · ${a}² = ${4 * a * a} cm², und der Pyramidenmantel: 4 · ${a} · ${hs} : 2 = ${2 * a * hs} cm². Boden und Berührfläche fallen weg: ${value} cm².`,
        dedupeKey: `ma:k7:ozus:lack:${a}:${hs}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 5, 12)
      const hq = randInt(rng, 4, 10)
      const hs = randInt(rng, 3, 8)
      const getrennt = 2 * a * a + 4 * a * hq + a * a + 2 * a * hs
      const zusammen = a * a + 4 * a * hq + 2 * a * hs
      const value = getrennt - zusammen
      return valueTask({
        question: `Ein Quader (Grundkante a = ${a} cm, Höhe ${hq} cm) und eine Pyramide mit derselben quadratischen Grundfläche werden aufeinandergeklebt. Um wie viel cm² ist der Oberflächeninhalt des zusammengeklebten Körpers kleiner als die Summe der beiden einzelnen Oberflächen?`,
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `Beim Zusammenkleben verschwinden die Deckfläche des Quaders und die Grundfläche der Pyramide, also zweimal a² = 2 · ${a * a} = ${value} cm².`,
        dedupeKey: `ma:k7:ozus:kleben:${a}:${hq}:${hs}`,
      })
    },
  ),
}

/** Oberfläche einer Pyramide: O = G + M */
const oberflaechePyramide: Topic = {
  id: 'k7-lb3-oberflaeche-pyramide',
  title: 'Oberfläche einer Pyramide',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Pyramide', 'Oberfläche', 'Mantelfläche', 'Grundfläche', 'Seitenfläche'],
  fachwissen: {
    text: 'Die Oberfläche einer Pyramide ist die Summe aus Grundfläche G und Mantelfläche M: O = G + M. Die Mantelfläche besteht aus den Seitendreiecken. Bei einer quadratischen Pyramide mit Grundkante a und Seitenflächenhöhe hₛ gilt G = a² und M = 4 · (½ · a · hₛ) = 2 · a · hₛ. Achtung: hₛ ist die Höhe im Seitendreieck — nicht die Körperhöhe h der Pyramide.',
    quelle: 'Wikipedia: Pyramide (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Pyramide_(Geometrie)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 4, 12)
      const hs = randInt(rng, 3, 14)
      const value = a * a + 2 * a * hs
      return visualTask({
        question: 'Berechne den Oberflächeninhalt der abgebildeten quadratischen Pyramide.',
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `G = a² = ${a}² = ${a * a} cm²; M = 4 · a · hₛ : 2 = 2 · ${a} · ${hs} = ${2 * a * hs} cm²; O = ${a * a} + ${2 * a * hs} = ${value} cm².`,
        visualContent: generatePyramidSurfaceSvg({
          edgeLabel: `${a} cm`,
          slantHeightLabel: `${hs} cm`,
        }),
        dedupeKey: `ma:k7:opyr:bild:${a}:${hs}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 4, 12)
      let b = randInt(rng, 4, 12)
      while (b === a) b = randInt(rng, 4, 12)
      const ha = randInt(rng, 4, 12)
      const hb = randInt(rng, 4, 12)
      const G = a * b
      const M = a * ha + b * hb
      const value = G + M
      return valueTask({
        question: `Eine Pyramide hat eine rechteckige Grundfläche mit a = ${a} cm und b = ${b} cm. Die Seitendreiecke über a haben die Höhe ${ha} cm, die über b die Höhe ${hb} cm. Berechne den Oberflächeninhalt.`,
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `G = ${a} · ${b} = ${G} cm². Je zwei gleiche Seitendreiecke: 2 · (${a} · ${ha} : 2) + 2 · (${b} · ${hb} : 2) = ${a * ha} + ${b * hb} = ${M} cm². O = ${G} + ${M} = ${value} cm².`,
        dedupeKey: `ma:k7:opyr:rechteck:${a}:${b}:${ha}:${hb}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 3, 10)
      const hs = randInt(rng, 4, 12)
      const O = a * a + 2 * a * hs
      return valueTask({
        question: `Eine quadratische Pyramide mit der Grundkante a = ${a} cm hat den Oberflächeninhalt ${O} cm². Wie groß ist die Seitenflächenhöhe hₛ?`,
        unit: 'cm',
        answerKind: 'integer',
        value: hs,
        solution: `${hs} cm`,
        explanation: `M = O − G = ${O} − ${a * a} = ${O - a * a} cm². Aus M = 2 · a · hₛ folgt hₛ = ${O - a * a} : (2 · ${a}) = ${hs} cm.`,
        dedupeKey: `ma:k7:opyr:rueck:${a}:${hs}`,
      })
    },
    (rng: Rng) => {
      const a = pick(rng, [2, 3, 4, 5, 6])
      const hs = pick(rng, [3, 4, 5, 6, 8])
      const n = pick(rng, [10, 15, 20])
      const dach = 2 * a * hs
      const value = dach * n
      return valueTask({
        question: `Das Dach eines Turms ist eine quadratische Pyramide (Grundkante ${a} m, Seitenflächenhöhe ${hs} m). Für 1 m² Dachfläche braucht man ${n} Schieferplatten. Wie viele Platten werden für das ganze Dach gebraucht?`,
        answerKind: 'integer',
        value,
        solution: `${value} Platten`,
        explanation: `Gedeckt wird nur der Mantel: M = 2 · ${a} · ${hs} = ${dach} m². Platten: ${dach} · ${n} = ${value}.`,
        dedupeKey: `ma:k7:opyr:dach:${a}:${hs}:${n}`,
      })
    },
  ),
}

// ---------------------------------------------------------------------------
// Lernbereich 4 — Vernetzung: Darstellen von Daten
// ---------------------------------------------------------------------------

const SAEULEN_THEMEN = [
  { titel: 'Lieblingssportarten der Klasse 7b', kategorien: ['Fußball', 'Schwimmen', 'Turnen', 'Tennis', 'Reiten'], einheit: 'Kinder', step: 2, max: 14 },
  { titel: 'Verkaufte Eiskugeln einer Eisdiele', kategorien: ['Mo', 'Di', 'Mi', 'Do', 'Fr'], einheit: 'Kugeln', step: 20, max: 160 },
  { titel: 'Ausgeliehene Bücher der Schulbibliothek', kategorien: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai'], einheit: 'Bücher', step: 10, max: 90 },
] as const

function saeulenDaten(rng: Rng): { thema: (typeof SAEULEN_THEMEN)[number]; values: number[] } {
  const thema = pick(rng, SAEULEN_THEMEN)
  for (;;) {
    const values = thema.kategorien.map(() => thema.step * randInt(rng, 1, thema.max / thema.step))
    if (new Set(values).size === values.length) return { thema, values }
  }
}

const mittelwert: Topic = {
  id: 'k7-lb4-mittelwert',
  title: 'Säulendiagramme lesen und auswerten',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Säulendiagramm', 'Diagramm', 'Daten', 'ablesen', 'Statistik'],
  fachwissen: {
    text: 'Im Säulendiagramm gibt die Höhe einer Säule die Anzahl an. Man liest am Ende der Säule waagerecht zur Hochachse ab und beachtet die Skala (z. B. ein Kästchen = 2 Kinder). Unterschiede, Summen und Vielfache rechnet man mit den abgelesenen Werten aus.',
    quelle: 'Wikipedia: Säulendiagramm',
    url: 'https://de.wikipedia.org/wiki/S%C3%A4ulendiagramm',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const { thema, values } = saeulenDaten(rng)
      const [i, j] = shuffleIdx(rng, values.length).slice(0, 2) as [number, number]
      const hi = values[i]! > values[j]! ? i : j
      const lo = hi === i ? j : i
      const value = values[hi]! - values[lo]!
      return visualTask({
        question: `${thema.titel}: Wie viele ${thema.einheit} mehr entfallen auf „${thema.kategorien[hi]}“ als auf „${thema.kategorien[lo]}“?`,
        answerKind: 'integer',
        value,
        solution: `${value} ${thema.einheit}`,
        explanation: `Abgelesen: ${thema.kategorien[hi]} = ${values[hi]}, ${thema.kategorien[lo]} = ${values[lo]}. Unterschied: ${values[hi]} − ${values[lo]} = ${value}.`,
        visualContent: generateBarChartSvg({ data: thema.kategorien.map((label, k) => ({ label, value: values[k]! })), yMax: thema.max, yStep: thema.step, yTitle: thema.einheit }),
        dedupeKey: `ma:k7:saeule:diff:${thema.titel}:${values.join(',')}:${hi}:${lo}`,
      })
    },
    (rng: Rng) => {
      const { thema, values } = saeulenDaten(rng)
      const value = values.reduce((s, v) => s + v, 0)
      return visualTask({
        question: `${thema.titel}: Wie viele ${thema.einheit} sind es insgesamt?`,
        answerKind: 'integer',
        value,
        solution: `${value} ${thema.einheit}`,
        explanation: `Alle Säulen ablesen und addieren: ${values.join(' + ')} = ${value}.`,
        visualContent: generateBarChartSvg({ data: thema.kategorien.map((label, k) => ({ label, value: values[k]! })), yMax: thema.max, yStep: thema.step, yTitle: thema.einheit }),
        dedupeKey: `ma:k7:saeule:summe:${thema.titel}:${values.join(',')}`,
      })
    },
    (rng: Rng) => {
      for (;;) {
        const { thema, values } = saeulenDaten(rng)
        const base = randInt(rng, 0, values.length - 1)
        const t = randInt(rng, 0, values.length - 1)
        if (t === base || 2 * values[base]! > thema.max) continue
        values[t] = 2 * values[base]!
        if (new Set(values).size !== values.length) continue
        return choicePickTask({
          question: `${thema.titel}: Bei welcher Kategorie ist der Wert doppelt so groß wie bei „${thema.kategorien[base]}“?`,
          choices: [...thema.kategorien].filter((_, k) => k !== base),
          correct: thema.kategorien[t]!,
          solution: thema.kategorien[t]!,
          explanation: `${thema.kategorien[base]} = ${values[base]}; doppelt so viel sind ${2 * values[base]!}. Diesen Wert hat „${thema.kategorien[t]}“.`,
          visualContent: generateBarChartSvg({ data: thema.kategorien.map((label, k) => ({ label, value: values[k]! })), yMax: thema.max, yStep: thema.step, yTitle: thema.einheit }),
          dedupeKey: `ma:k7:saeule:doppelt:${thema.titel}:${values.join(',')}:${base}`,
        })
      }
    },
  ),
}

function shuffleIdx(rng: Rng, n: number): number[] {
  const idx = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[idx[i], idx[j]] = [idx[j]!, idx[i]!]
  }
  return idx
}

const MONATE = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul']

function temperaturReihe(rng: Rng): number[] {
  for (;;) {
    let t = 2 * randInt(rng, -3, 0)
    const values = [t]
    for (let i = 1; i < MONATE.length; i++) {
      t += 2 * randInt(rng, 0, 3)
      values.push(Math.min(t, 24))
    }
    const steps = values.slice(1).map((v, i) => v - values[i]!)
    const maxStep = Math.max(...steps)
    if (maxStep > 0 && steps.filter((s) => s === maxStep).length === 1 && values[values.length - 1]! > values[0]!) return values
  }
}

const median: Topic = {
  id: 'k7-lb4-median',
  title: 'Liniendiagramme lesen und auswerten',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Liniendiagramm', 'Diagramm', 'Temperatur', 'Veränderung', 'Statistik'],
  fachwissen: {
    text: 'Liniendiagramme zeigen, wie sich eine Größe im Lauf der Zeit verändert. Je steiler die Linie zwischen zwei Punkten ansteigt, desto größer ist die Zunahme in diesem Zeitraum. Werte unter null liegen unterhalb der Null-Linie; Unterschiede berechnet man mit rationalen Zahlen, z. B. 6 − (−4) = 10.',
    quelle: 'Wikipedia: Liniendiagramm',
    url: 'https://de.wikipedia.org/wiki/Liniendiagramm',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const values = temperaturReihe(rng)
      let i = randInt(rng, 0, 3)
      let j = randInt(rng, i + 2, MONATE.length - 1)
      while (values[j] === values[i]) {
        i = randInt(rng, 0, 3)
        j = randInt(rng, i + 2, MONATE.length - 1)
      }
      const value = values[j]! - values[i]!
      return visualTask({
        question: `Das Diagramm zeigt die mittlere Monatstemperatur in Grad Celsius. Um wie viel Grad ist es von ${MONATE[i]} bis ${MONATE[j]} wärmer geworden?`,
        unit: '°C',
        answerKind: 'integer',
        value,
        solution: `${value} °C`,
        explanation: `${MONATE[i]}: ${signedNum(values[i]!)} °C, ${MONATE[j]}: ${signedNum(values[j]!)} °C. Zunahme: ${signedNum(values[j]!)} − ${parenNum(values[i]!)} = ${value} °C.`,
        visualContent: generateLineChartSvg({ data: MONATE.map((label, k) => ({ label, value: values[k]! })), yMin: -6, yMax: 24, yStep: 2, yTitle: '°C' }),
        dedupeKey: `ma:k7:linie:diff:${values.join(',')}:${i}:${j}`,
      })
    },
    (rng: Rng) => {
      const values = temperaturReihe(rng)
      const steps = values.slice(1).map((v, i) => v - values[i]!)
      const k = steps.indexOf(Math.max(...steps))
      const choices = MONATE.slice(0, -1).map((m, i) => `${m} → ${MONATE[i + 1]}`)
      const correct = choices[k]!
      return choicePickTask({
        question: 'Das Diagramm zeigt die mittlere Monatstemperatur. Zwischen welchen beiden Monaten ist die Temperatur am stärksten gestiegen?',
        choices,
        correct,
        solution: correct,
        explanation: `Der steilste Anstieg liegt zwischen ${MONATE[k]} (${signedNum(values[k]!)} °C) und ${MONATE[k + 1]} (${signedNum(values[k + 1]!)} °C): +${steps[k]} °C. Alle anderen Anstiege sind kleiner.`,
        visualContent: generateLineChartSvg({ data: MONATE.map((label, i) => ({ label, value: values[i]! })), yMin: -6, yMax: 24, yStep: 2, yTitle: '°C' }),
        dedupeKey: `ma:k7:linie:steil:${values.join(',')}`,
      })
    },
    (rng: Rng) => {
      const values = temperaturReihe(rng)
      const k = randInt(rng, 0, MONATE.length - 1)
      return visualTask({
        question: `Das Diagramm zeigt die mittlere Monatstemperatur. Welche Temperatur hatte der markierte Monat ${MONATE[k]}?`,
        unit: '°C',
        answerKind: 'integer',
        value: values[k]!,
        solution: `${signedNum(values[k]!)} °C`,
        explanation: `Vom markierten Punkt waagerecht zur Hochachse: ${signedNum(values[k]!)} °C.${values[k]! < 0 ? ' Der Punkt liegt unter der Null-Linie, also ist der Wert negativ.' : ''}`,
        visualContent: generateLineChartSvg({ data: MONATE.map((label, i) => ({ label, value: values[i]! })), yMin: -6, yMax: 24, yStep: 2, yTitle: '°C', highlight: k }),
        dedupeKey: `ma:k7:linie:wert:${values.join(',')}:${k}`,
      })
    },
  ),
}

const KREIS_THEMEN = [
  { frage: 'Schulweg der Klasse', kategorien: ['Fahrrad', 'Bus', 'zu Fuß', 'Auto'] },
  { frage: 'Lieblingsobst', kategorien: ['Äpfel', 'Bananen', 'Erdbeeren', 'Trauben'] },
  { frage: 'Haustiere', kategorien: ['Hund', 'Katze', 'Kaninchen', 'kein Tier'] },
] as const

function kreisDaten(rng: Rng): { thema: (typeof KREIS_THEMEN)[number]; total: number; counts: number[] } {
  const thema = pick(rng, KREIS_THEMEN)
  const total = pick(rng, [20, 24, 30, 36, 40])
  for (;;) {
    const cuts = new Set<number>()
    while (cuts.size < 3) cuts.add(randInt(rng, 1, total - 1))
    const sorted = [...cuts].sort((a, b) => a - b)
    const counts = [sorted[0]!, sorted[1]! - sorted[0]!, sorted[2]! - sorted[1]!, total - sorted[2]!]
    if (new Set(counts).size === 4) return { thema, total, counts }
  }
}

const spannweite: Topic = {
  id: 'k7-lb4-spannweite',
  title: 'Kreisdiagramme: Mittelpunktswinkel berechnen',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Kreisdiagramm', 'Mittelpunktswinkel', 'Anteil', 'Diagramm', 'Statistik'],
  fachwissen: {
    text: 'Im Kreisdiagramm entspricht das Ganze dem Vollwinkel 360°. Ein Anteil k von n bekommt den Mittelpunktswinkel k/n · 360°. Umgekehrt erhält man aus einem Winkel α die Anzahl: α : 360° · n.',
    quelle: 'Wikipedia: Kreisdiagramm',
    url: 'https://de.wikipedia.org/wiki/Kreisdiagramm',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const { thema, total, counts } = kreisDaten(rng)
      const k = randInt(rng, 0, 3)
      const value = (counts[k]! * 360) / total
      return visualTask({
        question: `Umfrage „${thema.frage}“ mit ${total} Kindern: ${thema.kategorien.map((c, i) => `${c} ${counts[i]}`).join(', ')}. Wie groß ist der Mittelpunktswinkel für „${thema.kategorien[k]}“ im Kreisdiagramm?`,
        unit: '°',
        answerKind: 'integer',
        value,
        solution: `${value}°`,
        explanation: `Ein Kind entspricht 360° : ${total} = ${360 / total}°. ${counts[k]} Kinder: ${counts[k]} · ${360 / total}° = ${value}°.`,
        visualContent: generatePlainPieChartSvg(thema.kategorien.map((label, i) => ({ label, value: counts[i]! }))),
        dedupeKey: `ma:k7:kreis:winkel:${thema.frage}:${total}:${counts.join(',')}:${k}`,
      })
    },
    (rng: Rng) => {
      const { thema, total, counts } = kreisDaten(rng)
      const k = randInt(rng, 0, 3)
      const winkel = (counts[k]! * 360) / total
      return visualTask({
        question: `Bei der Umfrage „${thema.frage}“ wurden ${total} Kinder befragt. Im Kreisdiagramm hat „${thema.kategorien[k]}“ einen Mittelpunktswinkel von ${winkel}°. Wie viele Kinder haben „${thema.kategorien[k]}“ gewählt?`,
        answerKind: 'integer',
        value: counts[k]!,
        solution: `${counts[k]} Kinder`,
        explanation: `${winkel}° von 360° sind ${winkel}/360 des Ganzen. ${winkel} : 360 · ${total} = ${counts[k]} Kinder.`,
        visualContent: generatePlainPieChartSvg(thema.kategorien.map((label, i) => ({ label, value: counts[i]! }))),
        dedupeKey: `ma:k7:kreis:anzahl:${thema.frage}:${total}:${counts.join(',')}:${k}`,
      })
    },
  ),
}

const KRIT_ZEITREIHEN = [
  { was: 'die Besucherzahlen eines Museums', yTitle: 'Besucher' },
  { was: 'die Schülerzahlen einer Schule', yTitle: 'Schüler' },
  { was: 'die Mitgliederzahlen eines Sportvereins', yTitle: 'Mitglieder' },
  { was: 'die Fahrgastzahlen einer Buslinie pro Tag', yTitle: 'Fahrgäste' },
  { was: 'die verkauften Eintrittskarten eines Freibads', yTitle: 'Karten' },
]
const KRIT_JAHRE: Array<[string, string]> = [['2022', '2023'], ['2023', '2024'], ['2024', '2025']]
const KRIT_VERGLEICHE = [
  { a: 'Laden A', b: 'Laden B', groesse: 'der Umsatz', yTitle: 'Tsd. €' },
  { a: 'Klasse 7a', b: 'Klasse 7b', groesse: 'die gesammelte Spendensumme', yTitle: '€' },
  { a: 'Partei X', b: 'Partei Y', groesse: 'die Stimmenzahl', yTitle: 'Stimmen' },
  { a: 'Modell A', b: 'Modell B', groesse: 'die Zahl verkaufter Räder', yTitle: 'Stück' },
]

const relativeHaeufigkeit: Topic = {
  id: 'k7-lb4-rel-haeufigkeit',
  title: 'Diagramme kritisch lesen (abgeschnittene Achse)',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Diagramm', 'abgeschnittene Achse', 'Manipulation', 'Säulendiagramm', 'Interpretation'],
  fachwissen: {
    text: 'Beginnt die Hochachse eines Säulendiagramms nicht bei 0, wirken Unterschiede viel größer, als sie sind. Für einen fairen Vergleich liest man die echten Werte ab und rechnet: Verhältnis = Wert B : Wert A, prozentuale Zunahme = (B − A) : A · 100 %.',
    quelle: 'Wikipedia: Diagramm',
    url: 'https://de.wikipedia.org/wiki/Diagramm',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const r = pick(rng, KRIT_ZEITREIHEN)
      const [j1, j2] = pick(rng, KRIT_JAHRE)
      const a = pick(rng, [100, 200, 400, 500])
      const p = pick(rng, [5, 10, 20, 25])
      const b = a + (a * p) / 100
      const yMin = a - (b - a)
      const step = (b - a) / 2
      return visualTask({
        question: `Das Diagramm zeigt ${r.was} in den Jahren ${j1} und ${j2}. Um wie viel Prozent ist die Zahl von ${j1} auf ${j2} wirklich gestiegen?`,
        unit: '%',
        answerKind: 'integer',
        value: p,
        solution: `${p} %`,
        explanation: `Abgelesen: ${j1} = ${a}, ${j2} = ${b}. Zunahme ${b - a} von ${a}: ${b - a} : ${a} · 100 % = ${p} %. Die Säule wirkt doppelt so hoch, weil die Achse erst bei ${yMin} beginnt.`,
        visualContent: generateBarChartSvg({ data: [{ label: j1, value: a }, { label: j2, value: b }], yMin, yMax: b + step, yStep: step, yTitle: r.yTitle }),
        dedupeKey: `ma:k7:krit:proz:${a}:${p}`,
      })
    },
    (rng: Rng) => {
      const v = pick(rng, KRIT_VERGLEICHE)
      const a = pick(rng, [40, 50, 60, 80])
      const d = pick(rng, [10, 20].filter((x) => x <= a / 2))
      const b = a + d
      const yMin = a - d
      const value = roundTo(b / a, 2)
      return visualTask({
        question: `Im Diagramm wirkt die Säule „${v.b}“ doppelt so hoch wie „${v.a}“. Wievielmal so groß ist ${v.groesse} von ${v.b} wirklich? Runde auf zwei Nachkommastellen.`,
        answerKind: 'decimal',
        value,
        eps: 0.006,
        solution: `${formatDe(value)}-mal`,
        explanation: `Die Achse beginnt bei ${yMin}. Echte Werte: ${v.a} = ${a}, ${v.b} = ${b}. Verhältnis: ${b} : ${a} ≈ ${formatDe(value)}. Sichtbar sind nur die Abschnitte über ${yMin}: ${a - yMin} und ${b - yMin}, deshalb wirkt ${v.b} doppelt so hoch.`,
        visualContent: generateBarChartSvg({ data: [{ label: v.a, value: a }, { label: v.b, value: b }], yMin, yMax: b + d / 2, yStep: d / 2, yTitle: v.yTitle }),
        dedupeKey: `ma:k7:krit:faktor:${a}:${d}`,
      })
    },
    (rng: Rng) => {
      const v = pick(rng, KRIT_VERGLEICHE)
      const yMin = pick(rng, [50, 100, 200])
      const ha = pick(rng, [10, 20])
      const k = pick(rng, [3, 4, 5])
      const a = yMin + ha
      const b = yMin + k * ha
      return visualTask({
        question: `Die Hochachse dieses Diagramms beginnt bei ${yMin}. Wievielmal so hoch wie die Säule „${v.a}“ wirkt die Säule „${v.b}“ im Bild?`,
        answerKind: 'integer',
        value: k,
        solution: `${k}-mal`,
        explanation: `Sichtbar sind nur die Teile über ${yMin}: ${v.a} ${a} − ${yMin} = ${ha}, ${v.b} ${b} − ${yMin} = ${k * ha}. ${k * ha} : ${ha} = ${k}. Tatsächlich ist ${v.b} nur ${formatDe(roundTo(b / a, 2))}-mal so groß.`,
        visualContent: generateBarChartSvg({ data: [{ label: v.a, value: a }, { label: v.b, value: b }], yMin, yMax: b + ha, yStep: ha, yTitle: v.yTitle }),
        dedupeKey: `ma:k7:krit:wirkt:${yMin}:${ha}:${k}`,
      })
    },
  ),
}

const mittelsenkrechteSchritte: Topic = {
  id: 'k7-lb1-mittelsenkrechte-schritte',
  title: 'Mittelsenkrechte: Konstruktionsschritte',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Mittelsenkrechte', 'Konstruktion', 'Zirkel', 'Lot', 'Mittelpunkt'],
  fachwissen: {
    text: 'Die Mittelsenkrechte einer Strecke AB ist die Gerade durch den Mittelpunkt von AB, die senkrecht auf AB steht. Konstruktion: Kreise um A und B mit gleichem Radius (>½|AB|); die beiden Schnittpunkte verbinden — das ist die Mittelsenkrechte.',
    quelle: 'Wikipedia: Mittelsenkrechte',
    url: 'https://de.wikipedia.org/wiki/Mittelsenkrechte',
  },
  generate: (rng: Rng) => {
    const variants = [
      [
        { label: 'Strecke AB zeichnen', value: 1 },
        { label: 'Kreis um A (Radius > ½|AB|)', value: 2 },
        { label: 'Gleicher Kreis um B', value: 3 },
        { label: 'Schnittpunkte P und Q markieren', value: 4 },
        { label: 'Gerade durch P und Q zeichnen', value: 5 },
      ],
      [
        { label: 'AB als Strecke einzeichnen', value: 1 },
        { label: 'Zirkel in A, Radius größer als Hälfte von AB', value: 2 },
        { label: 'Gleichen Radius in B ansetzen', value: 3 },
        { label: 'Beide Schnittpunkte der Kreise markieren', value: 4 },
        { label: 'Mittelsenkrechte als Gerade durch die Schnittpunkte', value: 5 },
      ],
      [
        { label: 'Punkte A und B verbinden', value: 1 },
        { label: 'Kreisbogen um A zeichnen', value: 2 },
        { label: 'Kreisbogen um B mit gleichem Radius', value: 3 },
        { label: 'Schnittpunkte der Bögen bestimmen', value: 4 },
        { label: 'Gerade durch die Schnittpunkte legen', value: 5 },
      ],
      [
        { label: 'Strecke festlegen', value: 1 },
        { label: 'Ersten Kreis um einen Endpunkt', value: 2 },
        { label: 'Zweiten Kreis um den anderen Endpunkt', value: 3 },
        { label: 'Schnittpunkte notieren', value: 4 },
        { label: 'Verbindung der Schnittpunkte = Mittelsenkrechte', value: 5 },
      ],
      [
        { label: 'AB zeichnen', value: 1 },
        { label: 'Kreis um A', value: 2 },
        { label: 'Kreis um B (gleicher Radius)', value: 3 },
        { label: 'P und Q als Schnittpunkte', value: 4 },
        { label: 'Gerade PQ zeichnen', value: 5 },
      ],
      [
        { label: 'Endpunkte A, B markieren und verbinden', value: 1 },
        { label: 'Radius wählen (> ½ der Strecke)', value: 2 },
        { label: 'Kreise um A und B mit diesem Radius', value: 3 },
        { label: 'Obere und untere Schnittpunkte finden', value: 4 },
        { label: 'Mittelsenkrechte durch beide Schnittpunkte', value: 5 },
      ],
      [
        { label: 'Strecke AB vorbereiten', value: 1 },
        { label: 'Bogen um A', value: 2 },
        { label: 'Bogen um B', value: 3 },
        { label: 'Schnittpunkte verbinden vorbereiten', value: 4 },
        { label: 'Lotgerade durch die Schnittpunkte ziehen', value: 5 },
      ],
      [
        { label: 'AB als Ausgangsstrecke', value: 1 },
        { label: 'Kreis 1: Mittelpunkt A', value: 2 },
        { label: 'Kreis 2: Mittelpunkt B, gleicher Radius', value: 3 },
        { label: 'Schnittmenge der Kreise markieren', value: 4 },
        { label: 'Gerade der Mittelsenkrechten zeichnen', value: 5 },
      ],
      [
        { label: 'Strecke zeichnen', value: 1 },
        { label: 'Ersten Zirkelschlag um A', value: 2 },
        { label: 'Zweiten Zirkelschlag um B', value: 3 },
        { label: 'Beide Schnittpunkte kennzeichnen', value: 4 },
        { label: 'Verbindungslinie = Mittelsenkrechte', value: 5 },
      ],
      [
        { label: 'AB festlegen', value: 1 },
        { label: 'Kreis um A mit ausreichendem Radius', value: 2 },
        { label: 'Kreis um B unverändertem Radius', value: 3 },
        { label: 'Schnittpunkte P, Q', value: 4 },
        { label: 'Gerade PQ als Mittelsenkrechte', value: 5 },
      ],
      [
        { label: 'Punkte verbinden', value: 1 },
        { label: 'Kreis um linken Punkt', value: 2 },
        { label: 'Kreis um rechten Punkt', value: 3 },
        { label: 'Schnittpunkte der Kreise', value: 4 },
        { label: 'Mittelsenkrechte einzeichnen', value: 5 },
      ],
      [
        { label: 'Strecke AB', value: 1 },
        { label: 'Radius > Hälfte AB wählen', value: 2 },
        { label: 'Beide Kreise zeichnen', value: 3 },
        { label: 'Schnittpunkte finden', value: 4 },
        { label: 'Gerade durch Schnittpunkte', value: 5 },
      ],
    ]
    const steps = pick(rng, variants)
    const order = steps.map((_, i) => i)
    for (let i = order.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    const items = order.map((i) => steps[i])
    const correctOrder = items
      .map((_, i) => i)
      .sort((i, j) => items[i].value - items[j].value)
    const idKey = steps.map((s) => s.label).join('|')
    return dragDropSortTask({
      question: 'Ordne die Konstruktionsschritte der Mittelsenkrechten von AB.',
      items,
      correctOrder,
      solution: steps.map((s) => s.label).join(' → '),
      explanation:
        'Zuerst AB, dann gleiche Kreise um A und B, Schnittpunkte verbinden: das ist die Mittelsenkrechte.',
      dedupeKey: `ma:k7:mittelsenk:${idKey.slice(0, 80)}`,
      contentIds: [`ma:k7:mittelsenk:${idKey.slice(0, 80)}`],
      rng,
    })
  },
}

// ---------------------------------------------------------------------------
// Grade — Klasse 7 (Gymnasium Mathematik, Sachsen)
// ---------------------------------------------------------------------------

export const klasse7: Grade = {
  id: 'klasse-7',
  title: 'Klasse 7',
  areas: [
    {
      id: 'lb1',
      title: 'Geometrie in der Ebene',
      ustd: 24,
      topics: [nebenwinkel, scheitelwinkel, winkelsummeVieleck, basiswinkel, mittelsenkrechteSchritte,
        ...MATH_LEHRPLAN_TEILASPEKTE_BY_GRADE["math7"].filter((x) => x.areaId === "lb1").map((x) => x.topic),
      ],
    },
    {
      id: 'lb2',
      title: 'Arbeiten mit rationalen Zahlen',
      ustd: 56,
      topics: [
        addRational,
        subRational,
        mulRational,
        divRational,
        betrag,
        termVorrang,
        gleichungAdd,
        gleichungMul,
        ...MATH_LEHRPLAN_TEILASPEKTE_BY_GRADE["math7"].filter((x) => x.areaId === "lb2").map((x) => x.topic),
      ],
    },
    {
      id: 'lb3',
      title: 'Darstellen und Berechnen von Prismen und Pyramiden',
      ustd: 20,
      topics: [
        volumenPrisma,
        mantelPrisma,
        volumenPyramide,
        oberflaechePrisma,
        oberflaechePyramide,
      ],
    },
    {
      id: 'lb4',
      title: 'Vernetzung: Darstellen von Daten',
      ustd: 4,
      topics: [mittelwert, median, spannweite, relativeHaeufigkeit],
    },
  ],
}
