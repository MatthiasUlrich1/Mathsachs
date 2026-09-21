import { pick, randInt, type Rng } from '../lib/rng'
import {
  generateCircleMeasureSvg,
  generateCylinderSvg,
  generateRightTriangleSvg,
} from '../lib/geometrySvg'
import { formatDe, roundTo } from '../lib/num'
import { mixedVariants, valueTask, visualTask } from './taskHelpers'
import { math9GraphicReviews } from './graphicReviewTopics'
import type { Grade, Topic } from './types'

const num = (n: number): string => (n < 0 ? `(−${Math.abs(n)})` : `${n}`)
const nonZero = (rng: Rng, min: number, max: number): number => {
  let v = 0
  while (v === 0) v = randInt(rng, min, max)
  return v
}

const PI = Math.PI

// Pythagorean triples (a ≤ b < c) used to keep results exact where wanted.
const TRIPLES: ReadonlyArray<readonly [number, number, number]> = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
  [9, 40, 41],
]

// ---------------------------------------------------------------------------
// Lernbereich 1 — Funktionen und Potenzen
// ---------------------------------------------------------------------------

const potenzProdukt: Topic = {
  id: 'k9-lb1-potenz-produkt',
  title: 'Potenzgesetz: Produkt gleicher Basis',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Potenz', 'Potenzgesetze', 'Exponent', 'multiplizieren', 'Basis'],
  fachwissen: {
    text: 'Die Potenzgesetze erlauben das Vereinfachen von Ausdrücken mit gleicher Basis: aᵐ · aⁿ = aᵐ⁺ⁿ (Produkt: Exponenten addieren), aᵐ : aⁿ = aᵐ⁻ⁿ (Quotient: Exponenten subtrahieren), (aᵐ)ⁿ = aᵐ·ⁿ (Potenz einer Potenz: Exponenten multiplizieren). Diese Gesetze gelten für a ≠ 0.',
    quelle: 'Wikipedia: Potenz (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Potenz_(Mathematik)',
  },
  generate: (rng: Rng) => {
    const base = randInt(rng, 2, 9)
    const m = randInt(rng, 2, 8)
    const n = randInt(rng, 2, 8)
    const value = m + n
    return valueTask({
      question: `Vereinfache zu einer Potenz mit Basis ${base}: ${base}^${m} · ${base}^${n} = ${base}^? (gib den Exponenten an)`,
      answerKind: 'integer',
      value,
      solution: `${base}^${value}`,
      explanation: `Bei gleicher Basis werden die Exponenten addiert: ${base}^${m} · ${base}^${n} = ${base}^(${m}+${n}) = ${base}^${value}.`,
    })
  },
}

const potenzQuotient: Topic = {
  id: 'k9-lb1-potenz-quotient',
  title: 'Potenzgesetz: Quotient und Potenz einer Potenz',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Potenz', 'Potenzgesetze', 'Exponent', 'dividieren', 'Potenz einer Potenz'],
  fachwissen: {
    text: 'Beim Dividieren von Potenzen mit gleicher Basis werden die Exponenten subtrahiert: aᵐ / aⁿ = aᵐ⁻ⁿ. Eine Potenz einer Potenz entsteht durch doppeltes Potenzieren: (aᵐ)ⁿ = aᵐ·ⁿ. Sonderfall: a⁰ = 1 für a ≠ 0, da aⁿ / aⁿ = aⁿ⁻ⁿ = a⁰ = 1.',
    quelle: 'Wikipedia: Potenz (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Potenz_(Mathematik)',
  },
  generate: (rng: Rng) => {
    const base = randInt(rng, 2, 9)
    if (rng() < 0.5) {
      const n = randInt(rng, 1, 6)
      const m = n + randInt(rng, 1, 6)
      const value = m - n
      return valueTask({
        question: `Vereinfache zu einer Potenz mit Basis ${base}: ${base}^${m} : ${base}^${n} = ${base}^? (gib den Exponenten an)`,
        answerKind: 'integer',
        value,
        solution: `${base}^${value}`,
        explanation: `Bei der Division gleicher Basen werden die Exponenten subtrahiert: ${base}^${m} : ${base}^${n} = ${base}^(${m}−${n}) = ${base}^${value}.`,
      })
    }
    const m = randInt(rng, 2, 6)
    const n = randInt(rng, 2, 6)
    const value = m * n
    return valueTask({
      question: `Vereinfache zu einer Potenz mit Basis ${base}: (${base}^${m})^${n} = ${base}^? (gib den Exponenten an)`,
      answerKind: 'integer',
      value,
      solution: `${base}^${value}`,
      explanation: `Eine Potenz wird potenziert, indem man die Exponenten multipliziert: (${base}^${m})^${n} = ${base}^(${m}·${n}) = ${base}^${value}.`,
    })
  },
}

const quadratWert: Topic = {
  id: 'k9-lb1-quadrat-wert',
  title: 'Wert einer quadratischen Funktion',
  hint: 'Setze den gegebenen x-Wert in die Funktion ein.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['quadratische Funktion', 'Parabel', 'Funktionswert', 'einsetzen'],
  fachwissen: {
    text: 'Eine quadratische Funktion hat die Form f(x) = ax² + bx + c. Ihr Graph ist eine Parabel. Den Scheitelpunkt (Extrempunkt) findet man durch quadratische Ergänzung oder mit der Formel x_S = −b / (2a). Für a > 0 liegt der Scheitelpunkt unten (Minimum), für a < 0 oben (Maximum).',
    quelle: 'Wikipedia: Quadratische Funktion',
    url: 'https://de.wikipedia.org/wiki/Quadratische_Funktion',
  },
  generate: (rng: Rng) => {
    const b = nonZero(rng, -6, 6)
    const c = nonZero(rng, -10, 10)
    const x = nonZero(rng, -6, 6)
    const value = x * x + b * x + c
    return valueTask({
      question: `Gegeben ist f(x) = x² + ${num(b)}·x + ${num(c)}. Berechne f(${x}).`,
      answerKind: 'integer',
      value,
      solution: formatDe(value),
      explanation: `Setze x = ${x} ein: ${num(x)}² + ${num(b)} · ${num(x)} + ${num(c)} = ${x * x} + ${num(b * x)} + ${num(c)} = ${value}.`,
    })
  },
}

const scheitel: Topic = {
  id: 'k9-lb1-scheitel',
  title: 'Scheitelpunkt aus der Scheitelform',
  hint: 'Lies den Scheitel aus der Scheitelform ab.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Scheitelpunkt', 'Scheitelform', 'Parabel', 'quadratische Funktion', 'Extrempunkt'],
  fachwissen: {
    text: 'Die Scheitelform einer Parabel f(x) = a(x − d)² + e zeigt direkt den Scheitelpunkt S(d|e). Der Wert d verschiebt die Parabel horizontal, e vertikal. Durch quadratische Ergänzung lässt sich jede quadratische Funktion von der Normalform in die Scheitelform umwandeln.',
    quelle: 'Wikipedia: Scheitelpunktform',
    url: 'https://de.wikipedia.org/wiki/Quadratische_Funktion#Scheitelpunktform',
  },
  generate: (rng: Rng) => {
    const d = nonZero(rng, -8, 8)
    const e = nonZero(rng, -10, 10)
    const inner = d < 0 ? `x + ${Math.abs(d)}` : `x − ${d}`
    return valueTask({
      question: `Die Parabel f(x) = (${inner})² + ${num(e)} liegt in Scheitelform vor. Gib die x-Koordinate des Scheitelpunkts an.`,
      answerKind: 'integer',
      value: d,
      solution: `x = ${d}`,
      explanation: `In der Scheitelform f(x) = (x − d)² + e ist der Scheitel S(d | e). Hier ist d = ${d}, also x = ${d}.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 2 — Kreise, Kreiszylinder und Kugeln
// ---------------------------------------------------------------------------

const kreisUmfang: Topic = {
  id: 'k9-lb2-kreis-umfang',
  title: 'Umfang eines Kreises',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Kreis', 'Umfang', 'Pi', 'Radius', 'Kreisumfang'],
  fachwissen: {
    text: 'Der Umfang eines Kreises mit Radius r berechnet sich als U = 2πr = πd (d = Durchmesser). Die Kreiszahl π ≈ 3,14159… ist irrational und transzendent. Historisch war die Bestimmung von π eine der wichtigsten mathematischen Aufgaben; heute kennt man π auf Billionen von Dezimalstellen.',
    quelle: 'Wikipedia: Kreisumfang',
    url: 'https://de.wikipedia.org/wiki/Kreisumfang',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const r = randInt(rng, 2, 20)
      const value = roundTo(2 * PI * r, 2)
      return valueTask({
        question: `Ein Kreis hat den Radius r = ${r} cm. Berechne den Umfang (auf zwei Nachkommastellen, π ≈ 3,14159).`,
        unit: 'cm',
        answerKind: 'decimal',
        value,
        eps: 0.05,
        solution: `${formatDe(value)} cm`,
        explanation: `U = 2 · π · r = 2 · π · ${r} cm ≈ ${formatDe(value)} cm.`,
      })
    },
    (rng: Rng) => {
      const r = randInt(rng, 3, 15)
      const value = roundTo(2 * PI * r, 2)
      return visualTask({
        question: 'Berechne den Umfang dieses Kreises (zwei Nachkommastellen, π ≈ 3,14159).',
        unit: 'cm',
        answerKind: 'decimal',
        value,
        eps: 0.05,
        solution: `${formatDe(value)} cm`,
        explanation: `U = 2 · π · r = 2 · π · ${r} cm ≈ ${formatDe(value)} cm.`,
        visualContent: generateCircleMeasureSvg({
          radiusLabel: `r = ${r} cm`,
          showDiameter: true,
          diameterLabel: `d = ${2 * r} cm`,
        }),
      })
    },
  ),
}

const kreisFlaeche: Topic = {
  id: 'k9-lb2-kreis-flaeche',
  title: 'Flächeninhalt eines Kreises',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Kreis', 'Flächeninhalt', 'Fläche', 'Pi', 'Radius', 'Kreisfläche'],
  fachwissen: {
    text: 'Der Flächeninhalt eines Kreises mit Radius r berechnet sich als A = πr². Dieser Zusammenhang lässt sich durch Zerlegen des Kreises in viele schmale Dreiecke oder durch Integration zeigen. Für einen Sektor (Kreisausschnitt) mit Winkel α gilt: A_Sektor = (α/360°) · πr².',
    quelle: 'Wikipedia: Kreisfläche',
    url: 'https://de.wikipedia.org/wiki/Kreisfl%C3%A4che',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const r = randInt(rng, 2, 20)
      const value = roundTo(PI * r * r, 2)
      return valueTask({
        question: `Ein Kreis hat den Radius r = ${r} cm. Berechne den Flächeninhalt (auf zwei Nachkommastellen, π ≈ 3,14159).`,
        unit: 'cm²',
        answerKind: 'decimal',
        value,
        eps: 0.05,
        solution: `${formatDe(value)} cm²`,
        explanation: `A = π · r² = π · ${r}² cm² = π · ${r * r} cm² ≈ ${formatDe(value)} cm².`,
      })
    },
    (rng: Rng) => {
      const r = randInt(rng, 3, 14)
      const value = roundTo(PI * r * r, 2)
      return visualTask({
        question: 'Berechne den Flächeninhalt dieses Kreises (zwei Nachkommastellen, π ≈ 3,14159).',
        unit: 'cm²',
        answerKind: 'decimal',
        value,
        eps: 0.05,
        solution: `${formatDe(value)} cm²`,
        explanation: `A = π · r² = π · ${r}² ≈ ${formatDe(value)} cm².`,
        visualContent: generateCircleMeasureSvg({ radiusLabel: `r = ${r} cm` }),
      })
    },
  ),
}

const zylinderVolumen: Topic = {
  id: 'k9-lb2-zylinder-volumen',
  title: 'Volumen eines Kreiszylinders',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Zylinder', 'Kreiszylinder', 'Volumen', 'Pi', 'Radius', 'Höhe'],
  fachwissen: {
    text: 'Ein Kreiszylinder ist ein gerades Prisma mit kreisförmiger Grundfläche. Sein Volumen berechnet sich als V = πr²·h (Grundfläche × Höhe). Die Mantelfläche ist M = 2πrh (aufgerollt ist sie ein Rechteck mit Breite = Umfang und Höhe h). Die Oberfläche ist O = M + 2·πr².',
    quelle: 'Wikipedia: Zylinder (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Zylinder_(Geometrie)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const r = randInt(rng, 2, 12)
      const h = randInt(rng, 2, 20)
      const value = roundTo(PI * r * r * h, 2)
      return valueTask({
        question: `Ein Kreiszylinder hat den Radius r = ${r} cm und die Höhe h = ${h} cm. Berechne sein Volumen (auf zwei Nachkommastellen, π ≈ 3,14159).`,
        unit: 'cm³',
        answerKind: 'decimal',
        value,
        eps: 0.1,
        solution: `${formatDe(value)} cm³`,
        explanation: `V = π · r² · h = π · ${r}² · ${h} cm³ = π · ${r * r * h} cm³ ≈ ${formatDe(value)} cm³.`,
      })
    },
    (rng: Rng) => {
      const r = randInt(rng, 2, 10)
      const h = randInt(rng, 3, 16)
      const value = roundTo(PI * r * r * h, 2)
      return visualTask({
        question: 'Berechne das Volumen dieses Kreiszylinders (zwei Nachkommastellen, π ≈ 3,14159).',
        unit: 'cm³',
        answerKind: 'decimal',
        value,
        eps: 0.1,
        solution: `${formatDe(value)} cm³`,
        explanation: `V = π · r² · h = π · ${r}² · ${h} ≈ ${formatDe(value)} cm³.`,
        visualContent: generateCylinderSvg({
          radiusLabel: `${r} cm`,
          heightLabel: `${h} cm`,
        }),
      })
    },
  ),
}

const kugelVolumen: Topic = {
  id: 'k9-lb2-kugel-volumen',
  title: 'Volumen einer Kugel',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Kugel', 'Volumen', 'Pi', 'Radius', 'Kugelvolumen'],
  fachwissen: {
    text: 'Das Volumen einer Kugel mit Radius r beträgt V = (4/3)πr³. Dieser Satz geht auf Archimedes zurück, der zeigte, dass der Zylinder mit einbeschriebener Kugel das anderthalbfache Volumen der Kugel hat. Die Oberfläche einer Kugel berechnet sich als O = 4πr².',
    quelle: 'Wikipedia: Kugel (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Kugel_(Geometrie)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const r = randInt(rng, 2, 12)
      const value = roundTo((4 / 3) * PI * r * r * r, 2)
      return valueTask({
        question: `Eine Kugel hat den Radius r = ${r} cm. Berechne ihr Volumen (auf zwei Nachkommastellen, π ≈ 3,14159).`,
        unit: 'cm³',
        answerKind: 'decimal',
        value,
        eps: 0.1,
        solution: `${formatDe(value)} cm³`,
        explanation: `V = (4/3) · π · r³ = (4/3) · π · ${r}³ cm³ = (4/3) · π · ${r * r * r} cm³ ≈ ${formatDe(value)} cm³.`,
      })
    },
    (rng: Rng) => {
      const r = randInt(rng, 2, 10)
      const value = roundTo((4 / 3) * PI * r * r * r, 2)
      return visualTask({
        question: 'Die Skizze zeigt den Querschnitt (Großkreis) einer Kugel. Berechne das Kugelvolumen (zwei Nachkommastellen, π ≈ 3,14159).',
        unit: 'cm³',
        answerKind: 'decimal',
        value,
        eps: 0.1,
        solution: `${formatDe(value)} cm³`,
        explanation: `V = (4/3) · π · r³ = (4/3) · π · ${r}³ ≈ ${formatDe(value)} cm³.`,
        visualContent: generateCircleMeasureSvg({
          radiusLabel: `r = ${r} cm`,
          fill: '#e3f2fd',
          stroke: '#1565c0',
        }),
      })
    },
  ),
}

// ---------------------------------------------------------------------------
// Lernbereich 3 — Rechtwinklige Dreiecke
// ---------------------------------------------------------------------------

const pythagorasHypotenuse: Topic = {
  id: 'k9-lb3-pythagoras-hypotenuse',
  title: 'Satz des Pythagoras: Hypotenuse',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Pythagoras', 'Hypotenuse', 'rechtwinkliges Dreieck', 'Kathete'],
  fachwissen: {
    text: 'Der Satz des Pythagoras: In jedem rechtwinkligen Dreieck gilt a² + b² = c², wobei c die Hypotenuse (gegenüber dem rechten Winkel) und a, b die Katheten sind. Der Satz ist schon seit der Antike bekannt und hat hunderte Beweise. Er gilt nur für rechtwinklige Dreiecke.',
    quelle: 'Wikipedia: Satz des Pythagoras',
    url: 'https://de.wikipedia.org/wiki/Satz_des_Pythagoras',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const [a, b, c] = pick(rng, TRIPLES)
      const k = randInt(rng, 1, 3)
      const ca = a * k
      const cb = b * k
      const cc = c * k
      return valueTask({
        question: `In einem rechtwinkligen Dreieck sind die Katheten a = ${ca} cm und b = ${cb} cm. Berechne die Hypotenuse c.`,
        unit: 'cm',
        answerKind: 'integer',
        value: cc,
        solution: `${cc} cm`,
        explanation: `c = √(a² + b²) = √(${ca}² + ${cb}²) = √(${ca * ca} + ${cb * cb}) = √${ca * ca + cb * cb} = ${cc} cm.`,
      })
    },
    (rng: Rng) => {
      const [a, b, c] = pick(rng, TRIPLES)
      const k = randInt(rng, 1, 3)
      const ca = a * k
      const cb = b * k
      const cc = c * k
      return visualTask({
        question: 'Berechne die mit ? markierte Hypotenuse c.',
        unit: 'cm',
        answerKind: 'integer',
        value: cc,
        solution: `${cc} cm`,
        explanation: `c = √(a² + b²) = √(${ca}² + ${cb}²) = ${cc} cm.`,
        visualContent: generateRightTriangleSvg({
          aLabel: `a=${ca}`,
          bLabel: `b=${cb}`,
          cLabel: 'c=?',
          ask: 'c',
        }),
      })
    },
  ),
}

const pythagorasKathete: Topic = {
  id: 'k9-lb3-pythagoras-kathete',
  title: 'Satz des Pythagoras: fehlende Kathete',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Pythagoras', 'Kathete', 'rechtwinkliges Dreieck', 'Hypotenuse'],
  fachwissen: {
    text: 'Sind Hypotenuse c und eine Kathete b bekannt, lässt sich die andere Kathete mit dem umgeformten Satz des Pythagoras berechnen: a = √(c² − b²). Diese Berechnung kommt häufig in technischen Anwendungen vor, z. B. bei der Bestimmung von Höhen oder Abständen.',
    quelle: 'Wikipedia: Satz des Pythagoras',
    url: 'https://de.wikipedia.org/wiki/Satz_des_Pythagoras',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const [a, b, c] = pick(rng, TRIPLES)
      const k = randInt(rng, 1, 3)
      const ca = a * k
      const cb = b * k
      const cc = c * k
      return valueTask({
        question: `In einem rechtwinkligen Dreieck ist die Hypotenuse c = ${cc} cm und eine Kathete b = ${cb} cm. Berechne die andere Kathete a.`,
        unit: 'cm',
        answerKind: 'integer',
        value: ca,
        solution: `${ca} cm`,
        explanation: `a = √(c² − b²) = √(${cc}² − ${cb}²) = √(${cc * cc} − ${cb * cb}) = √${cc * cc - cb * cb} = ${ca} cm.`,
      })
    },
    (rng: Rng) => {
      const [a, b, c] = pick(rng, TRIPLES)
      const k = randInt(rng, 1, 3)
      const ca = a * k
      const cb = b * k
      const cc = c * k
      const askA = rng() < 0.5
      return visualTask({
        question: askA
          ? 'Berechne die mit ? markierte Kathete a.'
          : 'Berechne die mit ? markierte Kathete b.',
        unit: 'cm',
        answerKind: 'integer',
        value: askA ? ca : cb,
        solution: `${askA ? ca : cb} cm`,
        explanation: askA
          ? `a = √(c² − b²) = √(${cc}² − ${cb}²) = ${ca} cm.`
          : `b = √(c² − a²) = √(${cc}² − ${ca}²) = ${cb} cm.`,
        visualContent: generateRightTriangleSvg({
          aLabel: askA ? 'a=?' : `a=${ca}`,
          bLabel: askA ? `b=${cb}` : 'b=?',
          cLabel: `c=${cc}`,
          ask: askA ? 'a' : 'b',
        }),
      })
    },
  ),
}

const trigWert: Topic = {
  id: 'k9-lb3-trig-wert',
  title: 'Werte von Sinus, Kosinus, Tangens',
  hint: 'Nutze den Taschenrechner und runde auf vier Nachkommastellen.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Sinus', 'Kosinus', 'Tangens', 'Trigonometrie', 'sin', 'cos', 'tan', 'Winkel'],
  fachwissen: {
    text: 'Im rechtwinkligen Dreieck gilt: sin(α) = Gegenkathete / Hypotenuse, cos(α) = Ankathete / Hypotenuse, tan(α) = Gegenkathete / Ankathete. Bekannte exakte Werte: sin(30°) = 1/2, sin(45°) = √2/2, sin(60°) = √3/2. Die Trigonometrie verbindet Winkel und Seitenverhältnisse und ist Grundlage vieler technischer Anwendungen.',
    quelle: 'Wikipedia: Trigonometrie',
    url: 'https://de.wikipedia.org/wiki/Trigonometrie',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const winkel = pick(rng, [30, 45, 60])
      const fn = pick(rng, ['sin', 'cos', 'tan'] as const)
      const rad = (winkel * PI) / 180
      const raw = fn === 'sin' ? Math.sin(rad) : fn === 'cos' ? Math.cos(rad) : Math.tan(rad)
      const value = roundTo(raw, 4)
      return valueTask({
        question: `Berechne ${fn}(${winkel}°) und runde auf vier Nachkommastellen.`,
        answerKind: 'decimal',
        value,
        eps: 0.001,
        solution: formatDe(value),
        explanation: `${fn}(${winkel}°) ≈ ${formatDe(value)} (mit dem Taschenrechner bestimmt, auf vier Nachkommastellen gerundet).`,
      })
    },
    (rng: Rng) => {
      const winkel = pick(rng, [30, 35, 40, 45, 50, 55, 60])
      const fn = pick(rng, ['sin', 'cos', 'tan'] as const)
      const rad = (winkel * PI) / 180
      const raw = fn === 'sin' ? Math.sin(rad) : fn === 'cos' ? Math.cos(rad) : Math.tan(rad)
      const value = roundTo(raw, 4)
      const sideHint =
        fn === 'sin'
          ? 'sin(α) = Gegenkathete / Hypotenuse'
          : fn === 'cos'
            ? 'cos(α) = Ankathete / Hypotenuse'
            : 'tan(α) = Gegenkathete / Ankathete'
      return visualTask({
        question: `Im rechtwinkligen Dreieck ist α = ${winkel}°. Berechne ${fn}(α) auf vier Nachkommastellen.`,
        answerKind: 'decimal',
        value,
        eps: 0.001,
        solution: formatDe(value),
        explanation: `${sideHint}. ${fn}(${winkel}°) ≈ ${formatDe(value)}.`,
        visualContent: generateRightTriangleSvg({
          aLabel: 'Ank.',
          bLabel: 'Geg.',
          cLabel: 'Hyp.',
          angleDeg: winkel,
          angleLabel: `α=${winkel}°`,
        }),
      })
    },
  ),
}

// ---------------------------------------------------------------------------
// Lernbereich 4 — Auswerten von Daten
// ---------------------------------------------------------------------------

const mittelwert: Topic = {
  id: 'k9-lb4-mittelwert',
  title: 'Arithmetisches Mittel',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Mittelwert', 'Durchschnitt', 'arithmetisches Mittel', 'Kennwert', 'Daten'],
  fachwissen: {
    text: 'Das arithmetische Mittel ist das bekannteste Lagemaß. Es ist allerdings anfällig für Ausreißer. Neben dem Mittelwert werden in der Statistik Median (robuster gegen Ausreißer) und Modalwert (häufigster Wert) verwendet, um verschiedene Aspekte einer Datenmenge zu beschreiben.',
    quelle: 'Wikipedia: Arithmetisches Mittel',
    url: 'https://de.wikipedia.org/wiki/Arithmetisches_Mittel',
  },
  generate: (rng: Rng) => {
    const count = randInt(rng, 4, 6)
    const numbers: number[] = []
    for (let i = 0; i < count; i++) numbers.push(randInt(rng, 2, 40))
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
      explanation: `Summe: ${numbers.join(' + ')} = ${sum}. Teile durch ${count}: ${sum} : ${count} = ${formatDe(mean)}.`,
    })
  },
}

const median: Topic = {
  id: 'k9-lb4-median',
  title: 'Median (Zentralwert)',
  hint: 'Ordne die Werte und nimm den mittleren.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Median', 'Zentralwert', 'Kennwert', 'Daten', 'ordnen'],
  fachwissen: {
    text: 'Der Median teilt eine geordnete Datenreihe in zwei gleich große Hälften. Er ist robuster gegenüber Ausreißern als der Mittelwert. Beispiel: Beim Einkommen ist der Median aussagekräftiger als der Mittelwert, da wenige sehr hohe Einkommen den Mittelwert stark anheben, den Median kaum.',
    quelle: 'Wikipedia: Median',
    url: 'https://de.wikipedia.org/wiki/Median',
  },
  generate: (rng: Rng) => {
    const count = pick(rng, [5, 7])
    const set = new Set<number>()
    while (set.size < count) set.add(randInt(rng, 1, 60))
    const numbers = [...set]
    const sorted = [...numbers].sort((a, b) => a - b)
    const value = sorted[(count - 1) / 2]
    return valueTask({
      question: `Bestimme den Median von ${numbers.join(', ')}.`,
      answerKind: 'integer',
      value,
      solution: `${value}`,
      explanation: `Sortiert: ${sorted.join(', ')}. Der mittlere Wert bei ${count} Zahlen ist ${value}.`,
    })
  },
}

const modalwert: Topic = {
  id: 'k9-lb4-modalwert',
  title: 'Modalwert (häufigster Wert)',
  hint: 'Der Modalwert kommt am häufigsten vor.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Modalwert', 'Modus', 'häufigster Wert', 'Kennwert', 'Daten'],
  fachwissen: {
    text: 'Der Modalwert (Modus) ist der am häufigsten vorkommende Wert einer Datenreihe. Er ist das einzige Lagemaß, das auch für nominale Daten (z. B. Lieblingsfarbe) sinnvoll ist. Eine Datenreihe kann mehrere Modi haben (bimodal, multimodal), wenn mehrere Werte gleich häufig vorkommen.',
    quelle: 'Wikipedia: Modus (Statistik)',
    url: 'https://de.wikipedia.org/wiki/Modus_(Statistik)',
  },
  generate: (rng: Rng) => {
    const mode = randInt(rng, 1, 9)
    const others = new Set<number>()
    while (others.size < 3) {
      const v = randInt(rng, 1, 9)
      if (v !== mode) others.add(v)
    }
    const list = [mode, mode, mode, ...others]
    // Deterministic shuffle using the rng.
    for (let i = list.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[list[i], list[j]] = [list[j], list[i]]
    }
    return valueTask({
      question: `Bestimme den Modalwert von ${list.join(', ')}.`,
      answerKind: 'integer',
      value: mode,
      solution: `${mode}`,
      explanation: `Der Wert ${mode} kommt dreimal vor und damit häufiger als jeder andere. Der Modalwert ist ${mode}.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 5 — Vernetzung
// ---------------------------------------------------------------------------

const leiterProblem: Topic = {
  id: 'k9-lb5-leiter',
  title: 'Vernetzung: Pythagoras im Sachkontext',
  hint: 'Leiter, Wand und Boden bilden ein rechtwinkliges Dreieck.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Pythagoras', 'Sachaufgabe', 'Leiter', 'Anwendung', 'Vernetzung'],
  fachwissen: {
    text: 'Der Satz des Pythagoras ist in vielen Alltagssituationen anwendbar, in denen rechtwinklige Dreiecke vorkommen: Leiterhöhe an einer Wand, Diagonale eines Rechtecks, Abstandsberechnung auf einer Karte. Der erste Schritt ist immer, das rechtwinklige Dreieck im Problem zu identifizieren.',
    quelle: 'Wikipedia: Satz des Pythagoras',
    url: 'https://de.wikipedia.org/wiki/Satz_des_Pythagoras',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const [a, b, c] = pick(rng, TRIPLES)
      const k = randInt(rng, 1, 2)
      const boden = a * k
      const laenge = c * k
      const value = b * k
      return valueTask({
        question: `Eine ${laenge} m lange Leiter steht ${boden} m von einer Wand entfernt. Wie hoch reicht sie an der Wand (rechtwinklig zum Boden)?`,
        unit: 'm',
        answerKind: 'integer',
        value,
        solution: `${value} m`,
        explanation: `Die Wandhöhe ist eine Kathete: h = √(${laenge}² − ${boden}²) = √(${laenge * laenge} − ${boden * boden}) = √${laenge * laenge - boden * boden} = ${value} m.`,
      })
    },
    (rng: Rng) => {
      const [a, b, c] = pick(rng, TRIPLES)
      const k = randInt(rng, 1, 2)
      const boden = a * k
      const laenge = c * k
      const value = b * k
      return visualTask({
        question: `Skizze: Leiter (= Hypotenuse) ${laenge} m, Abstand zur Wand ${boden} m. Wie hoch reicht die Leiter?`,
        unit: 'm',
        answerKind: 'integer',
        value,
        solution: `${value} m`,
        explanation: `h = √(${laenge}² − ${boden}²) = ${value} m.`,
        visualContent: generateRightTriangleSvg({
          aLabel: `${boden} m`,
          bLabel: 'h=?',
          cLabel: `${laenge} m`,
          ask: 'b',
        }),
      })
    },
  ),
}

// ---------------------------------------------------------------------------
// Grade — Klasse 9 (Gymnasium Mathematik, Sachsen)
// ---------------------------------------------------------------------------

export const klasse9: Grade = {
  id: 'klasse-9',
  title: 'Klasse 9',
  areas: [
    {
      id: 'lb1',
      title: 'Funktionen und Potenzen',
      ustd: 48,
      topics: [potenzProdukt, potenzQuotient, quadratWert, scheitel, ...math9GraphicReviews],
    },
    {
      id: 'lb2',
      title: 'Kreise, Kreiszylinder und Kugeln',
      ustd: 8,
      topics: [kreisUmfang, kreisFlaeche, zylinderVolumen, kugelVolumen],
    },
    {
      id: 'lb3',
      title: 'Rechtwinklige Dreiecke',
      ustd: 32,
      topics: [pythagorasHypotenuse, pythagorasKathete, trigWert],
    },
    {
      id: 'lb4',
      title: 'Auswerten von Daten',
      ustd: 12,
      topics: [mittelwert, median, modalwert],
    },
    {
      id: 'lb5',
      title: 'Vernetzung',
      ustd: 4,
      topics: [leiterProblem],
    },
  ],
}
