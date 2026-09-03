import { pick, randInt, type Rng } from '../lib/rng'
import { formatDe, roundTo } from '../lib/num'
import { valueTask } from './taskHelpers'
import type { Grade, Topic } from './types'

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
  keywords: ['Winkel', 'Nebenwinkel', 'Geraden', '180 Grad', 'supplementär'],
  generate: (rng: Rng) => {
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
}

const scheitelwinkel: Topic = {
  id: 'k7-lb1-scheitelwinkel',
  title: 'Scheitel- und Stufenwinkel',
  hint: 'Scheitelwinkel und Stufenwinkel sind gleich groß.',
  pointsPerTask: 10,
  keywords: ['Winkel', 'Scheitelwinkel', 'Stufenwinkel', 'Wechselwinkel', 'Parallelen'],
  generate: (rng: Rng) => {
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
}

const winkelsummeVieleck: Topic = {
  id: 'k7-lb1-winkelsumme-vieleck',
  title: 'Innenwinkelsumme im Vieleck',
  hint: 'Winkelsumme = (n − 2) · 180°.',
  pointsPerTask: 10,
  keywords: ['Vieleck', 'Polygon', 'Innenwinkelsumme', 'Winkelsumme', 'n-Eck'],
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
  keywords: ['Dreieck', 'gleichschenklig', 'Basiswinkel', 'Winkel'],
  generate: (rng: Rng) => {
    const spitze = randInt(rng, 20, 140) * 1
    // Ensure the apex angle keeps base angles positive and integer.
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
}

// ---------------------------------------------------------------------------
// Lernbereich 2 — Arbeiten mit rationalen Zahlen
// ---------------------------------------------------------------------------

const addRational: Topic = {
  id: 'k7-lb2-add-rational',
  title: 'Rationale Zahlen addieren',
  hint: 'Achte auf die Vorzeichen.',
  pointsPerTask: 10,
  keywords: ['rationale Zahlen', 'Vorzeichen', 'negative Zahlen', 'addieren', 'Addition'],
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
  keywords: ['rationale Zahlen', 'Vorzeichen', 'negative Zahlen', 'subtrahieren', 'Subtraktion'],
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
  keywords: ['rationale Zahlen', 'Vorzeichenregel', 'multiplizieren', 'Multiplikation', 'mal'],
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
  keywords: ['rationale Zahlen', 'Vorzeichenregel', 'dividieren', 'Division', 'teilen'],
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
  keywords: ['Betrag', 'Absolutbetrag', 'Betragsstriche', 'Abstand'],
  generate: (rng: Rng) => {
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
}

const termVorrang: Topic = {
  id: 'k7-lb2-term-vorrang',
  title: 'Term mit Rechengesetzen auswerten',
  hint: 'Punkt- vor Strichrechnung, Klammern zuerst.',
  pointsPerTask: 10,
  keywords: ['Term', 'Rechengesetze', 'Punkt vor Strich', 'Klammer', 'auswerten'],
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
  title: 'Einfache Gleichung: x + a = b',
  hint: 'Bringe die Zahl auf die andere Seite.',
  pointsPerTask: 10,
  keywords: ['Gleichung', 'lösen', 'x', 'Äquivalenzumformung'],
  generate: (rng: Rng) => {
    const x = nonZero(rng, -15, 15)
    const a = nonZero(rng, -15, 15)
    const b = x + a
    return valueTask({
      question: `Löse die Gleichung nach x: x + ${num(a)} = ${b}`,
      answerKind: 'integer',
      value: x,
      solution: `x = ${x}`,
      explanation: `Subtrahiere ${num(a)} auf beiden Seiten: x = ${b} − ${num(a)} = ${x}.`,
    })
  },
}

const gleichungMul: Topic = {
  id: 'k7-lb2-gleichung-mul',
  title: 'Einfache Gleichung: a · x = b',
  hint: 'Teile durch den Faktor vor x.',
  pointsPerTask: 10,
  keywords: ['Gleichung', 'lösen', 'x', 'Faktor', 'Division'],
  generate: (rng: Rng) => {
    const a = nonZero(rng, -9, 9)
    const x = nonZero(rng, -12, 12)
    const b = a * x
    return valueTask({
      question: `Löse die Gleichung nach x: ${num(a)} · x = ${b}`,
      answerKind: 'integer',
      value: x,
      solution: `x = ${x}`,
      explanation: `Teile beide Seiten durch ${num(a)}: x = ${b} : ${num(a)} = ${x}.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 3 — Darstellen und Berechnen von Prismen und Pyramiden
// ---------------------------------------------------------------------------

const volumenPrisma: Topic = {
  id: 'k7-lb3-volumen-prisma',
  title: 'Volumen gerader Prismen',
  hint: 'V = Grundfläche · Höhe.',
  pointsPerTask: 10,
  keywords: ['Prisma', 'Volumen', 'Grundfläche', 'Körper'],
  generate: (rng: Rng) => {
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
}

const mantelPrisma: Topic = {
  id: 'k7-lb3-mantel-prisma',
  title: 'Mantelfläche eines Prismas',
  hint: 'M = Umfang der Grundfläche · Höhe.',
  pointsPerTask: 10,
  keywords: ['Prisma', 'Mantelfläche', 'Mantel', 'Oberfläche', 'Umfang'],
  generate: (rng: Rng) => {
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
}

const volumenPyramide: Topic = {
  id: 'k7-lb3-volumen-pyramide',
  title: 'Volumen einer Pyramide',
  hint: 'V = (1/3) · Grundfläche · Höhe.',
  pointsPerTask: 10,
  keywords: ['Pyramide', 'Volumen', 'Grundfläche', 'ein Drittel'],
  generate: (rng: Rng) => {
    // Keep the base area a multiple of 3 so the volume stays an integer.
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
}

const oberflaechePrisma: Topic = {
  id: 'k7-lb3-oberflaeche-quader',
  title: 'Oberfläche eines Quaders',
  hint: 'O = 2 · (a·b + a·c + b·c).',
  pointsPerTask: 10,
  keywords: ['Quader', 'Oberfläche', 'Oberflächeninhalt', 'Prisma'],
  generate: (rng: Rng) => {
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
}

// ---------------------------------------------------------------------------
// Lernbereich 4 — Vernetzung: Darstellen von Daten
// ---------------------------------------------------------------------------

const mittelwert: Topic = {
  id: 'k7-lb4-mittelwert',
  title: 'Arithmetisches Mittel',
  hint: 'Mittelwert = Summe : Anzahl.',
  pointsPerTask: 10,
  keywords: ['Mittelwert', 'arithmetisches Mittel', 'Durchschnitt', 'Daten', 'Statistik'],
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
  keywords: ['Median', 'Zentralwert', 'Daten', 'Statistik', 'ordnen'],
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
  hint: 'Spannweite = größter − kleinster Wert.',
  pointsPerTask: 10,
  keywords: ['Spannweite', 'Maximum', 'Minimum', 'Daten', 'Statistik'],
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
  hint: 'Relative Häufigkeit = Anzahl : Gesamt.',
  pointsPerTask: 10,
  keywords: ['relative Häufigkeit', 'Häufigkeit', 'Prozent', 'Daten', 'Statistik'],
  generate: (rng: Rng) => {
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
      topics: [nebenwinkel, scheitelwinkel, winkelsummeVieleck, basiswinkel],
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
      topics: [volumenPrisma, mantelPrisma, volumenPyramide, oberflaechePrisma],
    },
    {
      id: 'lb4',
      title: 'Vernetzung: Darstellen von Daten',
      ustd: 4,
      topics: [mittelwert, median, spannweite, relativeHaeufigkeit],
    },
  ],
}
