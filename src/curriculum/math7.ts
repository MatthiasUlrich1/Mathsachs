import { pick, randInt, type Rng } from '../lib/rng'
import {
  generateAnglePickSvg,
  generateCrossingLinesSvg,
  generateCuboidSvg,
  generateLabeledPrismNetSvg,
  generateParallelTransversalSvg,
  generatePrismVolumeSvg,
  generatePyramidSurfaceSvg,
  generatePyramidVolumeSvg,
  generateSpinnerSvg,
  generateTriangleAnglesSvg,
} from '../lib/geometrySvg'
import { formatDe, roundTo } from '../lib/num'
import {
  choicePickTask,
  dragDropSortTask,
  equationStepsTask,
  mixedVariants,
  multiSelectTask,
  numberLineTask,
  valueTask,
  visualTask,
} from './taskHelpers'
import type { Grade, Topic } from './types'
import {
  opKey,
  solveAddPath,
  solveMulPath,
  suggestOps,
} from '../lib/equationSteps'

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
  hint: 'Nebenwinkel ergänzen sich zu 180°.',
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
  hint: 'Scheitelwinkel und Stufenwinkel sind gleich groß.',
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
  hint: 'Die beiden Basiswinkel sind gleich groß.',
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
  hint: 'Achte auf die Vorzeichen.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['rationale Zahlen', 'Vorzeichen', 'negative Zahlen', 'addieren', 'Addition'],
  fachwissen: {
    text: 'Rationale Zahlen (ℚ) umfassen alle ganzen Zahlen und Brüche, auch negative. Beim Addieren zweier Zahlen mit gleichem Vorzeichen addiert man die Beträge und behält das Vorzeichen. Bei verschiedenen Vorzeichen subtrahiert man die kleineren Betrag vom größeren und übernimmt das Vorzeichen der betragsmäßig größeren Zahl.',
    quelle: 'Wikipedia: Rationale Zahl',
    url: 'https://de.wikipedia.org/wiki/Rationale_Zahl',
  },
  generate: (rng: Rng) => {
    const a = nonZero(rng, -20, 20)
    const b = nonZero(rng, -20, 20)
    const value = a + b
    return valueTask({
      question: `Berechne: ${num(a)} + ${num(b)}`,
      answerKind: 'integer',
      value,
      solution: formatDe(value),
      explanation: `Addiere die beiden Zahlen unter Beachtung der Vorzeichen: ${num(a)} + ${num(b)} = ${value}.`,
    })
  },
}

const subRational: Topic = {
  id: 'k7-lb2-sub-rational',
  title: 'Rationale Zahlen subtrahieren',
  hint: 'Minus einer negativen Zahl heißt plus.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['rationale Zahlen', 'Vorzeichen', 'negative Zahlen', 'subtrahieren', 'Subtraktion'],
  fachwissen: {
    text: 'Subtrahieren heißt die Gegenzahl addieren: a − b = a + (−b). Die Gegenzahl einer negativen Zahl ist positiv. Beispiel: 3 − (−5) = 3 + 5 = 8. Diese Umformung macht klar, warum „Minus mal Minus Plus ergibt" und erleichtert das Rechnen mit negativen Zahlen.',
    quelle: 'Wikipedia: Rationale Zahl',
    url: 'https://de.wikipedia.org/wiki/Rationale_Zahl',
  },
  generate: (rng: Rng) => {
    const a = nonZero(rng, -20, 20)
    const b = nonZero(rng, -20, 20)
    const value = a - b
    return valueTask({
      question: `Berechne: ${num(a)} − ${num(b)}`,
      answerKind: 'integer',
      value,
      solution: formatDe(value),
      explanation: `Subtrahieren heißt die Gegenzahl addieren: ${num(a)} − ${num(b)} = ${num(a)} + ${num(-b)} = ${value}.`,
    })
  },
}

const mulRational: Topic = {
  id: 'k7-lb2-mul-rational',
  title: 'Rationale Zahlen multiplizieren',
  hint: 'Gleiche Vorzeichen → plus, verschiedene → minus.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['rationale Zahlen', 'Vorzeichenregel', 'multiplizieren', 'Multiplikation', 'mal'],
  fachwissen: {
    text: 'Die Vorzeichenregel bei der Multiplikation: Gleiches Vorzeichen ergibt positives Ergebnis (+·+ = + und −·− = +), verschiedene Vorzeichen ergeben ein negatives Ergebnis (+·− = − und −·+ = −). Den Betrag des Produkts bestimmt man durch normale Multiplikation der Beträge.',
    quelle: 'Wikipedia: Vorzeichenregel',
    url: 'https://de.wikipedia.org/wiki/Vorzeichenregel',
  },
  generate: (rng: Rng) => {
    const a = nonZero(rng, -12, 12)
    const b = nonZero(rng, -12, 12)
    const value = a * b
    const sign = a * b >= 0 ? 'gleiche Vorzeichen ergeben ein positives' : 'verschiedene Vorzeichen ergeben ein negatives'
    return valueTask({
      question: `Berechne: ${num(a)} · ${num(b)}`,
      answerKind: 'integer',
      value,
      solution: formatDe(value),
      explanation: `Vorzeichenregel: ${sign} Ergebnis. Der Betrag ist ${Math.abs(a)} · ${Math.abs(b)} = ${Math.abs(value)}. Also ${value}.`,
    })
  },
}

const divRational: Topic = {
  id: 'k7-lb2-div-rational',
  title: 'Rationale Zahlen dividieren',
  hint: 'Gleiche Vorzeichen → plus, verschiedene → minus.',
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
      question: `Berechne: ${num(a)} : ${num(b)}`,
      answerKind: 'integer',
      value: q,
      solution: formatDe(q),
      explanation: `Vorzeichenregel wie beim Multiplizieren. Der Betrag ist ${Math.abs(a)} : ${Math.abs(b)} = ${Math.abs(q)}. Also ${num(a)} : ${num(b)} = ${q}.`,
    })
  },
}

const betrag: Topic = {
  id: 'k7-lb2-betrag',
  title: 'Betrag einer Zahl',
  hint: 'Der Betrag ist immer nicht negativ.',
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
        question: `Berechne den Betrag: |${a}|`,
        answerKind: 'integer',
        value,
        solution: `${value}`,
        explanation: `Der Betrag ist der Abstand der Zahl von 0 auf dem Zahlenstrahl und daher nie negativ: |${a}| = ${value}.`,
      })
    },
    (rng: Rng) => {
      const a = nonZero(rng, -8, 8)
      const value = Math.abs(a)
      return numberLineTask({
        question: `Markiere den Betrag |${a}| auf dem Zahlenstrahl.`,
        min: 0,
        max: 10,
        step: 1,
        value,
        solution: `${value}`,
        explanation: `|${a}| = ${value} (Abstand von 0).`,
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
      const items = nums.map((n) => ({ label: String(n), value: n }))
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
  hint: 'Punkt- vor Strichrechnung, Klammern zuerst.',
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
      question: `Berechne: ${num(a)} + ${num(b)} · ${num(c)}`,
      answerKind: 'integer',
      value,
      solution: formatDe(value),
      explanation: `Punkt vor Strich: zuerst ${num(b)} · ${num(c)} = ${b * c}. Dann ${num(a)} + ${num(b * c)} = ${value}.`,
    })
  },
}

const gleichungAdd: Topic = {
  id: 'k7-lb2-gleichung-add',
  title: 'Gleichung umstellen: x + a = b',
  hint: 'Nutze die Buttons für Äquivalenzumformungen (beide Seiten gleich ändern).',
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
      question: `Stelle die Gleichung Schritt für Schritt um und löse nach x: x + ${num(a)} = ${b}`,
      start,
      buttons: buttons.slice(0, 6),
      solutionOps,
      solution: x,
      explanation: `Subtrahiere ${num(a)} auf beiden Seiten: x = ${b} − ${num(a)} = ${x}.`,
      instruction: 'Tippe die passende Umformung (gilt für beide Seiten), bis x allein steht:',
    })
  },
}

const gleichungMul: Topic = {
  id: 'k7-lb2-gleichung-mul',
  title: 'Gleichung umstellen: a · x = b',
  hint: 'Teile beide Seiten durch den Faktor vor x (Button „| : a“).',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Gleichung', 'lösen', 'x', 'Faktor', 'Division', 'Multiplikation'],
  fachwissen: {
    text: 'Gleichungen der Form a · x = b löst du, indem du beide Seiten durch a dividierst (a ≠ 0): x = b / a. Auch hier: jeden Schritt untereinander notieren und rechts die Umformung vermerken („| : a“). Das ist eine andere Umformungsart als bei x + a = b.',
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
      question: `Stelle die Gleichung Schritt für Schritt um und löse nach x: ${num(a)} · x = ${b}`,
      start,
      buttons: buttons.slice(0, 6),
      solutionOps,
      solution: x,
      explanation: `Teile beide Seiten durch ${num(a)}: x = ${b} : ${num(a)} = ${x}.`,
      instruction: 'Tippe die passende Umformung (Division/Multiplikation), bis x allein steht:',
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 3 — Darstellen und Berechnen von Prismen und Pyramiden
// ---------------------------------------------------------------------------

const volumenPrisma: Topic = {
  id: 'k7-lb3-volumen-prisma',
  title: 'Volumen gerader Prismen',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Prisma', 'Volumen', 'Grundfläche', 'Körper'],
  fachwissen: {
    text: 'Das Volumen eines geraden Prismas berechnet sich als V = G · h, wobei G der Flächeninhalt der Grundfläche und h die Höhe des Prismas ist. Diese Formel gilt unabhängig von der Form der Grundfläche (Dreieck, Rechteck, Sechseck …). Ein Zylinder kann als Prisma mit kreisförmiger Grundfläche verstanden werden.',
    quelle: 'Wikipedia: Prisma (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Prisma_(Geometrie)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const g = randInt(rng, 6, 60)
      const h = randInt(rng, 2, 20)
      const value = g * h
      return valueTask({
        question: `Ein gerades Prisma hat die Grundfläche ${g} cm² und die Höhe ${h} cm. Berechne sein Volumen.`,
        unit: 'cm³',
        answerKind: 'integer',
        value,
        solution: `${value} cm³`,
        explanation: `Volumen eines Prismas = Grundfläche · Höhe = ${g} cm² · ${h} cm = ${value} cm³.`,
      })
    },
    (rng: Rng) => {
      const g = randInt(rng, 12, 72)
      const h = randInt(rng, 4, 22)
      const value = g * h
      return visualTask({
        question: 'Berechne das Volumen des abgebildeten Prismas (Grundfläche gegeben):',
        unit: 'cm³',
        answerKind: 'integer',
        value,
        solution: `${value} cm³`,
        explanation: `V = G · h = ${g} · ${h} = ${value} cm³.`,
        visualContent: generatePrismVolumeSvg({
          baseAreaLabel: `${g} cm²`,
          heightLabel: `${h} cm`,
        }),
      })
    },
  ),
}

const mantelPrisma: Topic = {
  id: 'k7-lb3-mantel-prisma',
  title: 'Mantelfläche eines Prismas',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Prisma', 'Mantelfläche', 'Mantel', 'Oberfläche', 'Umfang'],
  fachwissen: {
    text: 'Die Mantelfläche eines geraden Prismas ist die Summe aller Seitenflächen (ohne Grundflächen). Da jede Seitenfläche ein Rechteck mit der Breite einer Grundkante und der Höhe h ist, ergibt sich: Mantelfläche M = Umfang der Grundfläche × Höhe. Die Oberfläche = Mantelfläche + 2 × Grundfläche.',
    quelle: 'Wikipedia: Prisma (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Prisma_(Geometrie)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const u = randInt(rng, 8, 40)
      const h = randInt(rng, 2, 20)
      const value = u * h
      return valueTask({
        question: `Ein Prisma hat eine Grundfläche mit dem Umfang ${u} cm und die Höhe ${h} cm. Berechne die Mantelfläche.`,
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `Die Mantelfläche ist Umfang der Grundfläche · Höhe = ${u} cm · ${h} cm = ${value} cm².`,
      })
    },
    (_rng: Rng) => {
      const labels = ['A', 'B', 'C', 'D', 'E']
      // Fixed layout: A top base, B/C/D mantel, E bottom base
      const mantel = ['B', 'C', 'D']
      return multiSelectTask({
        question:
          'Welches Netz zeigt ein dreiseitiges Prisma. Welche Flächen gehören zum Mantel (Seitenflächen, ohne Deckel/Boden)?',
        choices: labels,
        correct: mantel,
        solution: mantel.join(', '),
        explanation:
          'Beim Prisma sind die drei seitlichen Rechtecke der Mantel (B, C, D). A und E sind die beiden Grundflächen.',
        visualContent: generateLabeledPrismNetSvg({ faceLabels: labels }),
        instruction: 'Tippe alle Mantelflächen (Mehrfachauswahl):',
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
  title: 'Oberfläche eines Quaders',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Quader', 'Oberfläche', 'Oberflächeninhalt', 'Prisma'],
  fachwissen: {
    text: 'Die Oberfläche eines Quaders ist die Summe aller sechs Seitenflächen. Da ein Quader drei Paare gleicher Flächen hat, gilt: O = 2 · (a·b + a·c + b·c). Im Alltag wird die Oberfläche benötigt, wenn man wissen will, wie viel Material für eine Verpackung oder eine Holzkiste gebraucht wird.',
    quelle: 'Wikipedia: Quader',
    url: 'https://de.wikipedia.org/wiki/Quader',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 2, 14)
      const b = randInt(rng, 2, 14)
      const c = randInt(rng, 2, 14)
      const value = 2 * (a * b + a * c + b * c)
      return valueTask({
        question: `Ein Quader ist ${a} cm, ${b} cm und ${c} cm groß. Berechne seinen Oberflächeninhalt.`,
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `Oberfläche = 2 · (a·b + a·c + b·c) = 2 · (${a * b} + ${a * c} + ${b * c}) cm² = ${value} cm².`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 3, 12)
      const b = randInt(rng, 3, 12)
      const c = randInt(rng, 3, 12)
      const value = 2 * (a * b + a * c + b * c)
      return visualTask({
        question: 'Berechne die Oberfläche des abgebildeten Quaders:',
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `O = 2 · (${a * b} + ${a * c} + ${b * c}) = ${value} cm².`,
        visualContent: generateCuboidSvg({
          lengthLabel: `${a} cm`,
          widthLabel: `${b} cm`,
          heightLabel: `${c} cm`,
        }),
      })
    },
  ),
}

/** Oberfläche einer (quadratischen) Pyramide: O = G + M */
const oberflaechePyramide: Topic = {
  id: 'k7-lb3-oberflaeche-pyramide',
  title: 'Oberfläche einer Pyramide',
  hint: 'O = G + M. Bei quadratischer Grundfläche: G = a², M = 2 · a · hₛ.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Pyramide', 'Oberfläche', 'Mantelfläche', 'Grundfläche', 'Seitenfläche'],
  fachwissen: {
    text: 'Die Oberfläche einer Pyramide ist die Summe aus Grundfläche G und Mantelfläche M: O = G + M. Die Mantelfläche besteht aus den Seitendreiecken. Bei einer quadratischen Pyramide mit Grundkante a und Seitenflächenhöhe hₛ gilt G = a² und M = 4 · (½ · a · hₛ) = 2 · a · hₛ, also O = a² + 2 · a · hₛ. Achtung: hₛ ist die Höhe im Seitendreieck — nicht die Körperhöhe h der Pyramide.',
    quelle: 'Wikipedia: Pyramide (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Pyramide_(Geometrie)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const g = randInt(rng, 12, 80)
      const m = randInt(rng, 20, 120)
      const value = g + m
      return valueTask({
        question: `Eine Pyramide hat die Grundfläche G = ${g} cm² und die Mantelfläche M = ${m} cm². Berechne die Oberfläche O.`,
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `O = G + M = ${g} + ${m} = ${value} cm².`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 4, 12)
      const hs = randInt(rng, 3, 14)
      const value = a * a + 2 * a * hs
      return visualTask({
        question:
          'Berechne die Oberfläche der abgebildeten quadratischen Pyramide (O = a² + 2 · a · hₛ):',
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `G = a² = ${a}² = ${a * a} cm²; M = 2 · a · hₛ = 2 · ${a} · ${hs} = ${2 * a * hs} cm²; O = ${a * a} + ${2 * a * hs} = ${value} cm².`,
        visualContent: generatePyramidSurfaceSvg({
          edgeLabel: `${a} cm`,
          slantHeightLabel: `${hs} cm`,
        }),
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 3, 10)
      const hs = randInt(rng, 4, 12)
      const value = a * a + 2 * a * hs
      return valueTask({
        question: `Quadratische Pyramide: a = ${a} cm, Seitenflächenhöhe hₛ = ${hs} cm. Berechne O = a² + 2 · a · hₛ.`,
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `O = ${a}² + 2 · ${a} · ${hs} = ${a * a} + ${2 * a * hs} = ${value} cm².`,
        visualContent: generatePyramidSurfaceSvg({
          edgeLabel: `${a} cm`,
          slantHeightLabel: `${hs} cm`,
        }),
      })
    },
    (rng: Rng) => {
      const pools = [
        {
          question: 'Was gehört zur Oberfläche einer Pyramide? (mehrere möglich)',
          choices: [
            'Grundfläche G',
            'Mantelfläche M (Seitendreiecke)',
            'O = G + M',
            'nur die Körperhöhe h ohne Flächen',
            'Volumen V = (1/3)·G·h als Oberflächenformel',
          ],
          correct: ['Grundfläche G', 'Mantelfläche M (Seitendreiecke)', 'O = G + M'],
        },
        {
          question: 'Quadratische Pyramide — welche Aussagen stimmen? (mehrere möglich)',
          choices: [
            'G = a²',
            'M = 2 · a · hₛ',
            'hₛ ist die Höhe im Seitendreieck',
            'hₛ ist immer gleich der Körperhöhe h',
            'O = a² + 2 · a · hₛ',
          ],
          correct: [
            'G = a²',
            'M = 2 · a · hₛ',
            'hₛ ist die Höhe im Seitendreieck',
            'O = a² + 2 · a · hₛ',
          ],
        },
      ] as const
      const p = pick(rng, [...pools])
      return multiSelectTask({
        question: p.question,
        choices: [...p.choices],
        correct: [...p.correct],
        solution: p.correct.join('; '),
        explanation: 'Oberfläche = Grundfläche + Mantel; bei Quadrat: O = a² + 2·a·hₛ.',
        visualContent: generatePyramidSurfaceSvg({
          edgeLabel: 'a',
          slantHeightLabel: 'hₛ',
        }),
        instruction: 'Tippe alle zutreffenden Aussagen:',
      })
    },
  ),
}

// ---------------------------------------------------------------------------
// Lernbereich 4 — Vernetzung: Darstellen von Daten
// ---------------------------------------------------------------------------

const mittelwert: Topic = {
  id: 'k7-lb4-mittelwert',
  title: 'Arithmetisches Mittel',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Mittelwert', 'arithmetisches Mittel', 'Durchschnitt', 'Daten', 'Statistik'],
  fachwissen: {
    text: 'Das arithmetische Mittel (Durchschnitt) x̄ = (x₁ + … + xₙ) / n ist ein Lagemaß in der Statistik. Es beschreibt die typische Mitte eines Datensatzes, ist aber anfällig für Ausreißer. In Ergänzung zum Mittelwert werden Median und Spannweite für eine vollständigere Datenanalyse eingesetzt.',
    quelle: 'Wikipedia: Arithmetisches Mittel',
    url: 'https://de.wikipedia.org/wiki/Arithmetisches_Mittel',
  },
  generate: (rng: Rng) => {
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
      question: `Berechne das arithmetische Mittel von ${numbers.join(', ')}.`,
      answerKind: 'integer',
      value: mean,
      solution: formatDe(mean),
      explanation: `Summe: ${numbers.join(' + ')} = ${sum}. Teile durch die Anzahl ${count}: ${sum} : ${count} = ${formatDe(mean)}.`,
    })
  },
}

const median: Topic = {
  id: 'k7-lb4-median',
  title: 'Median (Zentralwert)',
  hint: 'Ordne die Werte und nimm den mittleren.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Median', 'Zentralwert', 'Daten', 'Statistik', 'ordnen'],
  fachwissen: {
    text: 'Der Median (Zentralwert) ist der mittlere Wert einer geordneten Datenreihe. Bei ungerader Anzahl n ist er der Wert an Position (n+1)/2. Bei gerader Anzahl ist er der Durchschnitt der beiden mittleren Werte. Der Median reagiert im Gegensatz zum Mittelwert weniger empfindlich auf Ausreißer.',
    quelle: 'Wikipedia: Median',
    url: 'https://de.wikipedia.org/wiki/Median',
  },
  generate: (rng: Rng) => {
    const count = pick(rng, [5, 7])
    const set = new Set<number>()
    while (set.size < count) set.add(randInt(rng, 1, 50))
    const numbers = [...set]
    const sorted = [...numbers].sort((a, b) => a - b)
    const value = sorted[(count - 1) / 2]
    return valueTask({
      question: `Bestimme den Median von ${numbers.join(', ')}.`,
      answerKind: 'integer',
      value,
      solution: `${value}`,
      explanation: `Sortiert: ${sorted.join(', ')}. Bei ${count} Werten ist der mittlere Wert (an Position ${(count + 1) / 2}) der Median: ${value}.`,
    })
  },
}

const spannweite: Topic = {
  id: 'k7-lb4-spannweite',
  title: 'Spannweite berechnen',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Spannweite', 'Maximum', 'Minimum', 'Daten', 'Statistik'],
  fachwissen: {
    text: 'Die Spannweite R = x_max − x_min ist ein einfaches Streuungsmaß: Sie gibt den Abstand zwischen dem größten und dem kleinsten Wert einer Datenreihe an. Eine große Spannweite zeigt eine große Streuung der Daten. Nachteil: Ein einziger Ausreißer kann die Spannweite stark vergrößern.',
    quelle: 'Wikipedia: Spannweite (Statistik)',
    url: 'https://de.wikipedia.org/wiki/Spannweite_(Statistik)',
  },
  generate: (rng: Rng) => {
    const count = randInt(rng, 4, 6)
    const numbers: number[] = []
    for (let i = 0; i < count; i++) numbers.push(randInt(rng, 1, 80))
    const max = Math.max(...numbers)
    const min = Math.min(...numbers)
    const value = max - min
    return valueTask({
      question: `Bestimme die Spannweite von ${numbers.join(', ')}.`,
      answerKind: 'integer',
      value,
      solution: `${value}`,
      explanation: `Größter Wert ${max}, kleinster Wert ${min}. Spannweite = ${max} − ${min} = ${value}.`,
    })
  },
}

const relativeHaeufigkeit: Topic = {
  id: 'k7-lb4-rel-haeufigkeit',
  title: 'Relative Häufigkeit in Prozent',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['relative Häufigkeit', 'Häufigkeit', 'Prozent', 'Daten', 'Statistik'],
  fachwissen: {
    text: 'Die relative Häufigkeit h(A) eines Ereignisses A ist der Quotient aus der absoluten Häufigkeit (Anzahl der Eintritte) und der Gesamtanzahl der Versuche. Sie liegt immer zwischen 0 und 1. Als Prozentzahl: h(A) · 100. Mit wachsender Versuchsanzahl nähert sich h(A) der theoretischen Wahrscheinlichkeit P(A) an.',
    quelle: 'Wikipedia: Relative Häufigkeit',
    url: 'https://de.wikipedia.org/wiki/Relative_H%C3%A4ufigkeit',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const total = pick(rng, [10, 20, 25, 40, 50, 100])
      const k = randInt(rng, 1, total - 1)
      const value = roundTo((k / total) * 100, 2)
      return valueTask({
        question: `Von ${total} befragten Personen antworteten ${k} mit „ja". Wie groß ist die relative Häufigkeit in Prozent?`,
        unit: '%',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} %`,
        explanation: `Relative Häufigkeit = ${k} : ${total} = ${formatDe(k / total)}. In Prozent: · 100 = ${formatDe(value)} %.`,
      })
    },
    (rng: Rng) => {
      const n = pick(rng, [4, 5, 6])
      const colors = ['Rot', 'Blau', 'Grün', 'Gelb', 'Lila', 'Orange']
      const sectors = colors.slice(0, n)
      const askIdx = randInt(rng, 0, n - 1)
      const pct = roundTo((1 / n) * 100, 2)
      return choicePickTask({
        question: `Das Glücksrad hat ${n} gleich große Sektoren. Tippe den Sektor „${sectors[askIdx]}“ — relative Häufigkeit = ${formatDe(pct)} %.`,
        choices: sectors,
        correct: sectors[askIdx],
        solution: `${sectors[askIdx]} (${formatDe(pct)} %)`,
        explanation: `Sektor „${sectors[askIdx]}“ hat bei gleichen Feldern die relative Häufigkeit 1/${n} = ${formatDe(pct)} %.`,
        visualContent: generateSpinnerSvg({
          payoffs: sectors,
          highlightIndex: askIdx,
        }),
        instruction: 'Tippe den gesuchten Sektor:',
      })
    },
  ),
}

const mittelsenkrechteSchritte: Topic = {
  id: 'k7-lb1-mittelsenkrechte-schritte',
  title: 'Mittelsenkrechte: Konstruktionsschritte',
  hint: 'Ordne die Schritte einer Mittelsenkrechten.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Mittelsenkrechte', 'Konstruktion', 'Zirkel', 'Lot', 'Mittelpunkt'],
  fachwissen: {
    text: 'Die Mittelsenkrechte einer Strecke AB ist die Gerade durch den Mittelpunkt von AB, die senkrecht auf AB steht. Konstruktion: Kreise um A und B mit gleichem Radius (>½|AB|); die beiden Schnittpunkte verbinden — das ist die Mittelsenkrechte.',
    quelle: 'Wikipedia: Mittelsenkrechte',
    url: 'https://de.wikipedia.org/wiki/Mittelsenkrechte',
  },
  generate: (rng: Rng) => {
    const steps = [
      { label: 'Strecke AB zeichnen', value: 1 },
      { label: 'Kreis um A (Radius > ½|AB|)', value: 2 },
      { label: 'Gleicher Kreis um B', value: 3 },
      { label: 'Schnittpunkte P und Q markieren', value: 4 },
      { label: 'Gerade durch P und Q zeichnen', value: 5 },
    ]
    // Shuffle display order
    const order = steps.map((_, i) => i)
    for (let i = order.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    const items = order.map((i) => steps[i])
    const correctOrder = items
      .map((_, i) => i)
      .sort((i, j) => items[i].value - items[j].value)
    return dragDropSortTask({
      question: 'Ordne die Konstruktionsschritte der Mittelsenkrechten von AB.',
      items,
      correctOrder,
      solution: steps.map((s) => s.label).join(' → '),
      explanation:
        'Zuerst AB, dann gleiche Kreise um A und B, Schnittpunkte verbinden: das ist die Mittelsenkrechte.',
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
      topics: [nebenwinkel, scheitelwinkel, winkelsummeVieleck, basiswinkel, mittelsenkrechteSchritte],
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
      ],
    },
    {
      id: 'lb3',
      title: 'Darstellen und Berechnen von Prismen und Pyramiden',
      ustd: 20,
      topics: [volumenPrisma, mantelPrisma, volumenPyramide, oberflaechePrisma, oberflaechePyramide],
    },
    {
      id: 'lb4',
      title: 'Vernetzung: Darstellen von Daten',
      ustd: 4,
      topics: [mittelwert, median, spannweite, relativeHaeufigkeit],
    },
  ],
}
