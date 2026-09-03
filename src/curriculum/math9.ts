import { pick, randInt, type Rng } from '../lib/rng'
import { formatDe, roundTo } from '../lib/num'
import { valueTask } from './taskHelpers'
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
  hint: 'aᵐ · aⁿ = aᵐ⁺ⁿ — die Exponenten werden addiert.',
  pointsPerTask: 10,
  keywords: ['Potenz', 'Potenzgesetze', 'Exponent', 'multiplizieren', 'Basis'],
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
  hint: 'aᵐ : aⁿ = aᵐ⁻ⁿ und (aᵐ)ⁿ = aᵐ·ⁿ.',
  pointsPerTask: 10,
  keywords: ['Potenz', 'Potenzgesetze', 'Exponent', 'dividieren', 'Potenz einer Potenz'],
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
  hint: 'Setze x in f(x) = x² + b·x + c ein.',
  pointsPerTask: 10,
  keywords: ['quadratische Funktion', 'Parabel', 'Funktionswert', 'einsetzen'],
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
  hint: 'f(x) = (x − d)² + e hat den Scheitel S(d | e).',
  pointsPerTask: 10,
  keywords: ['Scheitelpunkt', 'Scheitelform', 'Parabel', 'quadratische Funktion', 'Extrempunkt'],
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
  hint: 'U = 2 · π · r.',
  pointsPerTask: 10,
  keywords: ['Kreis', 'Umfang', 'Pi', 'Radius', 'Kreisumfang'],
  generate: (rng: Rng) => {
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
}

const kreisFlaeche: Topic = {
  id: 'k9-lb2-kreis-flaeche',
  title: 'Flächeninhalt eines Kreises',
  hint: 'A = π · r².',
  pointsPerTask: 10,
  keywords: ['Kreis', 'Flächeninhalt', 'Fläche', 'Pi', 'Radius', 'Kreisfläche'],
  generate: (rng: Rng) => {
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
}

const zylinderVolumen: Topic = {
  id: 'k9-lb2-zylinder-volumen',
  title: 'Volumen eines Kreiszylinders',
  hint: 'V = π · r² · h.',
  pointsPerTask: 10,
  keywords: ['Zylinder', 'Kreiszylinder', 'Volumen', 'Pi', 'Radius', 'Höhe'],
  generate: (rng: Rng) => {
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
}

const kugelVolumen: Topic = {
  id: 'k9-lb2-kugel-volumen',
  title: 'Volumen einer Kugel',
  hint: 'V = (4/3) · π · r³.',
  pointsPerTask: 10,
  keywords: ['Kugel', 'Volumen', 'Pi', 'Radius', 'Kugelvolumen'],
  generate: (rng: Rng) => {
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
}

// ---------------------------------------------------------------------------
// Lernbereich 3 — Rechtwinklige Dreiecke
// ---------------------------------------------------------------------------

const pythagorasHypotenuse: Topic = {
  id: 'k9-lb3-pythagoras-hypotenuse',
  title: 'Satz des Pythagoras: Hypotenuse',
  hint: 'c = √(a² + b²).',
  pointsPerTask: 10,
  keywords: ['Pythagoras', 'Hypotenuse', 'rechtwinkliges Dreieck', 'Kathete'],
  generate: (rng: Rng) => {
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
}

const pythagorasKathete: Topic = {
  id: 'k9-lb3-pythagoras-kathete',
  title: 'Satz des Pythagoras: fehlende Kathete',
  hint: 'a = √(c² − b²).',
  pointsPerTask: 10,
  keywords: ['Pythagoras', 'Kathete', 'rechtwinkliges Dreieck', 'Hypotenuse'],
  generate: (rng: Rng) => {
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
}

const trigWert: Topic = {
  id: 'k9-lb3-trig-wert',
  title: 'Werte von Sinus, Kosinus, Tangens',
  hint: 'Nutze den Taschenrechner und runde auf vier Nachkommastellen.',
  pointsPerTask: 10,
  keywords: ['Sinus', 'Kosinus', 'Tangens', 'Trigonometrie', 'sin', 'cos', 'tan', 'Winkel'],
  generate: (rng: Rng) => {
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
}

// ---------------------------------------------------------------------------
// Lernbereich 4 — Auswerten von Daten
// ---------------------------------------------------------------------------

const mittelwert: Topic = {
  id: 'k9-lb4-mittelwert',
  title: 'Arithmetisches Mittel',
  hint: 'Mittelwert = Summe : Anzahl.',
  pointsPerTask: 10,
  keywords: ['Mittelwert', 'Durchschnitt', 'arithmetisches Mittel', 'Kennwert', 'Daten'],
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
  keywords: ['Median', 'Zentralwert', 'Kennwert', 'Daten', 'ordnen'],
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
  keywords: ['Modalwert', 'Modus', 'häufigster Wert', 'Kennwert', 'Daten'],
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
  keywords: ['Pythagoras', 'Sachaufgabe', 'Leiter', 'Anwendung', 'Vernetzung'],
  generate: (rng: Rng) => {
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
      topics: [potenzProdukt, potenzQuotient, quadratWert, scheitel],
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
