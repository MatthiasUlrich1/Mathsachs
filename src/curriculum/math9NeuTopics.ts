/**
 * Klasse 9 Mathematik — zusätzliche Neu-(Prüfung)-Banken nach Bettermarks.
 * Sibling-IDs: `${parentId}__neu`, neu:true, released:false.
 * Bestehende `__grafik` in graphicReviewTopics.ts bleiben parallel.
 * Händisch; keine Bulk-Skripte. Originale in math9.ts unberührt.
 */
import { pick, randInt, type Rng } from '../lib/rng'
import { formatDe, roundTo } from '../lib/num'
import { makeFraction, format } from '../lib/fraction'
import {
  generateCircleMeasureSvg,
  generateCylinderSvg,
  generateParabolaSvg,
  generateRightTriangleSvg,
} from '../lib/geometrySvg'
import { shuffleChoices } from './biologieHelpers'
import {
  choicePickTask,
  dragDropSortTask,
  fractionTask,
  mixedVariants,
  multiSelectTask,
  numberLineTask,
  paramSliderTask,
  valueTask,
  visualTask,
} from './taskHelpers'
import { asNeuTopic } from './neuTopic'
import type { Topic } from './types'

// ---------------------------------------------------------------------------
// Lokale Helfer (bewusst nicht aus math9.ts importiert — Zirkelimport-Gefahr,
// da math9.ts seinerseits math9NeuLb1..Lb5 importiert).
// ---------------------------------------------------------------------------

/** Format a signed integer, wrapping negatives in parentheses with a real minus. */
const num = (n: number): string => (n < 0 ? `(−${Math.abs(n)})` : `${n}`)

/** A non-zero integer in [min, max]. */
const nonZero = (rng: Rng, min: number, max: number): number => {
  let v = 0
  while (v === 0) v = randInt(rng, min, max)
  return v
}

/** 4 MC-Choice-Labels: korrekt + bis zu 3 verschiedene falsche Kandidaten. */
function fourChoices(correct: string, wrongCandidates: string[]): string[] {
  const out = [correct]
  const seen = new Set([correct])
  for (const w of wrongCandidates) {
    if (out.length >= 4) break
    if (!seen.has(w)) {
      seen.add(w)
      out.push(w)
    }
  }
  return out
}

/** Format a linear factor "x − p" / "x + |p|" for a nonzero p. */
const factorStr = (p: number): string => (p < 0 ? `x + ${-p}` : `x − ${p}`)

/**
 * Bump each candidate (in order) until it differs from the correct value and
 * from every previously accepted candidate. Needed for small-range integer
 * tasks (Potenzen) where hand-crafted "typical mistakes" can coincide.
 */
const uniqueWrongs = (correctValue: number, candidates: number[]): number[] => {
  const used = new Set<number>([correctValue])
  const out: number[] = []
  for (const c of candidates) {
    let v = c
    while (used.has(v)) v += 1
    used.add(v)
    out.push(v)
  }
  return out
}

const PI = Math.PI

// Pythagorean triples (a ≤ b < c), reused for several K9-Neu-Banken.
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

const potenzProduktNeu: Topic = asNeuTopic('k9-lb1-potenz-produkt', {
  id: 'k9-lb1-potenz-produkt__neu',
  title: 'Potenzgesetz: Produkt als Zahlenwert',
  hint: 'Addiere zuerst die Exponenten, rechne dann die Potenz aus.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Potenz', 'Potenzgesetze', 'Exponent', 'Produkt', 'Zahlenwert'],
  fachwissen: {
    text: 'Nach aᵐ · aⁿ = aᵐ⁺ⁿ lässt sich ein Produkt gleicher Basen zu einer Potenz zusammenfassen. Rechnet man diese Potenz anschließend aus, erhält man den konkreten Zahlenwert — die Probe gelingt, indem man die Exponenten addiert und danach die Potenz berechnet.',
    quelle: 'Wikipedia: Potenz (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Potenz_(Mathematik)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const base = randInt(rng, 2, 4)
      const m = randInt(rng, 1, 3)
      const n = randInt(rng, 1, 2)
      const value = base ** (m + n)
      return valueTask({
        question: `Berechne ${base}^${m} · ${base}^${n} als Zahl.`,
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `Exponenten addieren: ${base}^${m} · ${base}^${n} = ${base}^${m + n} = ${value}.`,
        dedupeKey: `k9neupotprod-tippen:${base}:${m}:${n}`,
      })
    },
    (rng: Rng) => {
      const base = randInt(rng, 2, 4)
      const m = randInt(rng, 1, 3)
      const n = randInt(rng, 1, 2)
      const value = base ** (m + n)
      const correct = formatDe(value)
      const [w1, w2, w3] = uniqueWrongs(value, [
        base ** (m * n), // Exponenten multipliziert statt addiert
        base ** m + base ** n, // Potenzen einzeln berechnet und addiert
        base ** (m + n + 1), // Exponent um eins verrechnet
      ])
      const wrong1 = formatDe(w1)
      const wrong2 = formatDe(w2)
      const wrong3 = formatDe(w3)
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Was ist ${base}^${m} · ${base}^${n}?`,
        choices,
        correct,
        solution: correct,
        explanation: `${base}^${m} · ${base}^${n} = ${base}^${m + n} = ${value}.`,
        dedupeKey: `k9neupotprod-mc:${base}:${m}:${n}`,
      })
    },
    (rng: Rng) => {
      const m = randInt(rng, 1, 3)
      const n = randInt(rng, 1, 3)
      const value = 2 ** (m + n)
      return numberLineTask({
        question: `Berechne 2^${m} · 2^${n} und markiere das Ergebnis auf dem Zahlenstrahl.`,
        min: 0,
        max: 100,
        step: 1,
        value,
        solution: formatDe(value),
        explanation: `2^${m} · 2^${n} = 2^${m + n} = ${value}.`,
      })
    },
  ),
})

const potenzQuotientNeu: Topic = asNeuTopic('k9-lb1-potenz-quotient', {
  id: 'k9-lb1-potenz-quotient__neu',
  title: 'Potenzgesetz: Quotient und Potenz einer Potenz als Zahlenwert',
  hint: 'Subtrahiere bzw. multipliziere zuerst die Exponenten, rechne dann aus.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Potenz', 'Potenzgesetze', 'Exponent', 'Quotient', 'Potenz einer Potenz', 'Zahlenwert'],
  fachwissen: {
    text: 'Beim Dividieren von Potenzen mit gleicher Basis werden die Exponenten subtrahiert (aᵐ : aⁿ = aᵐ⁻ⁿ), bei einer Potenz einer Potenz werden sie multipliziert ((aᵐ)ⁿ = aᵐ·ⁿ). Rechnet man das Ergebnis anschließend aus, erhält man den konkreten Zahlenwert.',
    quelle: 'Wikipedia: Potenz (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Potenz_(Mathematik)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const base = randInt(rng, 2, 4)
      if (rng() < 0.5) {
        const k = randInt(rng, 1, 3)
        const n = randInt(rng, 1, 2)
        const m = n + k
        const value = base ** k
        return valueTask({
          question: `Berechne ${base}^${m} : ${base}^${n} als Zahl.`,
          answerKind: 'integer',
          value,
          solution: formatDe(value),
          explanation: `Exponenten subtrahieren: ${base}^${m} : ${base}^${n} = ${base}^${k} = ${value}.`,
          dedupeKey: `k9neupotquot-tippenA:${base}:${m}:${n}`,
        })
      }
      const m = randInt(rng, 1, 2)
      const n = randInt(rng, 1, 2)
      const value = base ** (m * n)
      return valueTask({
        question: `Berechne (${base}^${m})^${n} als Zahl.`,
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `Exponenten multiplizieren: (${base}^${m})^${n} = ${base}^${m * n} = ${value}.`,
        dedupeKey: `k9neupotquot-tippenB:${base}:${m}:${n}`,
      })
    },
    (rng: Rng) => {
      const base = randInt(rng, 2, 4)
      if (rng() < 0.5) {
        const k = randInt(rng, 1, 3)
        const n = randInt(rng, 1, 2)
        const m = n + k
        const value = base ** k
        const correct = formatDe(value)
        const wrong1 = formatDe(base ** (m + n)) // addiert statt subtrahiert
        const wrong2 = formatDe(base ** (n - m)) // Reihenfolge der Subtraktion vertauscht (negativ)
        const wrong3 = formatDe(base ** m) // Division komplett vergessen
        const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
        return choicePickTask({
          question: `Was ist ${base}^${m} : ${base}^${n}?`,
          choices,
          correct,
          solution: correct,
          explanation: `${base}^${m} : ${base}^${n} = ${base}^${k} = ${value}.`,
          dedupeKey: `k9neupotquot-mcA:${base}:${m}:${n}`,
        })
      }
      const m = randInt(rng, 1, 2)
      let n = randInt(rng, 1, 2)
      if (m === 2 && n === 2) n = 1 // sonst m+n === m·n (keine eindeutige Ablenkung)
      const value = base ** (m * n)
      const correct = formatDe(value)
      const wrong1 = formatDe(base ** (m + n)) // Exponenten addiert statt multipliziert
      const wrong2 = formatDe(value + base) // eine Potenz zu viel verrechnet
      const wrong3 = formatDe(Math.max(1, value - base)) // eine Potenz zu wenig verrechnet
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Was ist (${base}^${m})^${n}?`,
        choices,
        correct,
        solution: correct,
        explanation: `(${base}^${m})^${n} = ${base}^${m * n} = ${value}.`,
        dedupeKey: `k9neupotquot-mcB:${base}:${m}:${n}`,
      })
    },
    (rng: Rng) => {
      const k = randInt(rng, 1, 6)
      const n = 1
      const m = n + k
      const value = 2 ** k
      return numberLineTask({
        question: `Berechne 2^${m} : 2^${n} und markiere das Ergebnis auf dem Zahlenstrahl.`,
        min: 0,
        max: 100,
        step: 1,
        value,
        solution: formatDe(value),
        explanation: `2^${m} : 2^${n} = 2^${k} = ${value}.`,
      })
    },
  ),
})

const quadratWertNeu: Topic = asNeuTopic('k9-lb1-quadrat-wert', {
  id: 'k9-lb1-quadrat-wert__neu',
  title: 'Funktionswert einer Parabel in Nullstellenform',
  hint: 'Setze x ein und berechne beide Faktoren, dann multipliziere.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['quadratische Funktion', 'Nullstellenform', 'Funktionswert', 'Produktform', 'einsetzen'],
  fachwissen: {
    text: 'Eine quadratische Funktion lässt sich auch in Nullstellenform f(x) = (x − p)·(x − q) schreiben, wobei p und q die Nullstellen sind. Einen Funktionswert erhält man, indem man x einsetzt und zuerst beide Faktoren, dann deren Produkt berechnet.',
    quelle: 'Wikipedia: Quadratische Funktion',
    url: 'https://de.wikipedia.org/wiki/Quadratische_Funktion',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const p = nonZero(rng, -5, 5)
      let q = nonZero(rng, -5, 5)
      while (q === p) q = nonZero(rng, -5, 5)
      const x0 = nonZero(rng, -4, 4)
      const value = (x0 - p) * (x0 - q)
      return valueTask({
        question: `Gegeben ist f(x) = (${factorStr(p)})·(${factorStr(q)}). Berechne f(${x0}).`,
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `f(${x0}) = (${x0} − ${p})·(${x0} − ${q}) = ${num(x0 - p)} · ${num(x0 - q)} = ${value}.`,
        dedupeKey: `k9neuquadwert-tippen:${p}:${q}:${x0}`,
      })
    },
    (rng: Rng) => {
      const p = nonZero(rng, -5, 5)
      let q = nonZero(rng, -5, 5)
      while (q === p) q = nonZero(rng, -5, 5)
      const x0 = nonZero(rng, -4, 4)
      const value = (x0 - p) * (x0 - q)
      const correct = formatDe(value)
      const wrong1 = formatDe((x0 - p) + (x0 - q)) // addiert statt multipliziert
      const wrong2 = formatDe((x0 - p) * (x0 + q)) // Vorzeichen im zweiten Faktor vertauscht
      const wrong3 = formatDe((x0 + p) * (x0 - q)) // Vorzeichen im ersten Faktor vertauscht
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Berechne f(${x0}) für f(x) = (${factorStr(p)})·(${factorStr(q)}).`,
        choices,
        correct,
        solution: correct,
        explanation: `f(${x0}) = ${num(x0 - p)} · ${num(x0 - q)} = ${value}.`,
        dedupeKey: `k9neuquadwert-mc:${p}:${q}:${x0}`,
      })
    },
    (rng: Rng) => {
      const p = nonZero(rng, -3, 3)
      let q = nonZero(rng, -3, 3)
      while (q === p) q = nonZero(rng, -3, 3)
      const x0 = nonZero(rng, -4, 4)
      const value = (x0 - p) * (x0 - q)
      return numberLineTask({
        question: `Berechne f(${x0}) für f(x) = (${factorStr(p)})·(${factorStr(q)}) und markiere das Ergebnis auf dem Zahlenstrahl.`,
        min: -60,
        max: 60,
        step: 2,
        value,
        solution: formatDe(value),
        explanation: `f(${x0}) = ${num(x0 - p)} · ${num(x0 - q)} = ${value}.`,
      })
    },
  ),
})

const scheitelNeu: Topic = asNeuTopic('k9-lb1-scheitel', {
  id: 'k9-lb1-scheitel__neu',
  title: 'Scheitelpunkt: y-Koordinate bestimmen',
  hint: 'In f(x) = a(x − d)² + e ist S(d|e). Gefragt ist hier die y-Koordinate e.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Scheitelpunkt', 'Scheitelform', 'Parabel', 'y-Koordinate', 'Extrempunkt'],
  fachwissen: {
    text: 'In der Scheitelform f(x) = a(x − d)² + e liegt der Scheitelpunkt bei S(d|e). Während d die x-Koordinate ist, gibt e die y-Koordinate an — also die Höhe des Minimums bzw. Maximums der Parabel.',
    quelle: 'Wikipedia: Scheitelpunktform',
    url: 'https://de.wikipedia.org/wiki/Quadratische_Funktion#Scheitelpunktform',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const d = nonZero(rng, -8, 8)
      const e = nonZero(rng, -10, 10)
      const inner = d < 0 ? `x + ${Math.abs(d)}` : `x − ${d}`
      return valueTask({
        question: `Die Parabel f(x) = (${inner})² + ${num(e)} liegt in Scheitelform vor. Gib die y-Koordinate des Scheitelpunkts an.`,
        answerKind: 'integer',
        value: e,
        solution: `y = ${e}`,
        explanation: `In der Scheitelform f(x) = (x − d)² + e ist der Scheitel S(d|e). Hier ist e = ${e}, also y = ${e}.`,
        dedupeKey: `k9neuscheitel-tippen:${d}:${e}`,
      })
    },
    (rng: Rng) => {
      const d = nonZero(rng, -8, 8)
      const e = nonZero(rng, -10, 10)
      const inner = d < 0 ? `x + ${Math.abs(d)}` : `x − ${d}`
      const correct = formatDe(e)
      const wrong1 = formatDe(d) // x- mit y-Koordinate verwechselt
      const wrong2 = formatDe(-e) // Vorzeichen vertauscht
      const wrong3 = formatDe(d + e) // beide Koordinaten addiert
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Welche y-Koordinate hat der Scheitelpunkt der Parabel f(x) = (${inner})² + ${num(e)}?`,
        choices,
        correct,
        solution: correct,
        explanation: `Der Scheitel liegt bei S(${d}|${e}), die y-Koordinate ist also ${e}.`,
        dedupeKey: `k9neuscheitel-mc:${d}:${e}`,
      })
    },
    (rng: Rng) => {
      const a = pick(rng, [-1, 1] as const)
      const e = nonZero(rng, -6, 6)
      const term = a === 1 ? 'x²' : '−x²'
      return paramSliderTask({
        question: `Die Parabel f(x) = ${term} + ${num(e)} ist gezeichnet (ihr Scheitel liegt auf der y-Achse). Stelle die y-Koordinate des Scheitels am Regler ein.`,
        params: [{ id: 'e', label: 'y-Koordinate e', min: -10, max: 10, step: 1, start: 0 }],
        correct: { e },
        solution: `y = ${e}`,
        explanation: `Bei f(x) = a·x² + e liegt der Scheitel auf der y-Achse bei S(0|e). Hier ist e = ${e}.`,
        visualContent: generateParabolaSvg({
          a,
          c: e,
          xRange: [-6, 6],
          yRange: [Math.min(-8, e - 3), Math.max(8, e + 3)],
        }),
        instruction: 'Stelle die y-Koordinate des Scheitels ein:',
      })
    },
  ),
})

export const math9NeuLb1: Topic[] = [
  potenzProduktNeu,
  potenzQuotientNeu,
  quadratWertNeu,
  scheitelNeu,
]

// ---------------------------------------------------------------------------
// Lernbereich 2 — Kreise, Kreiszylinder und Kugeln
// ---------------------------------------------------------------------------

const kreisUmfangNeu: Topic = asNeuTopic('k9-lb2-kreis-umfang', {
  id: 'k9-lb2-kreis-umfang__neu',
  title: 'Radius aus dem Umfang berechnen',
  hint: 'Stelle U = 2πr nach r um: r = U : (2π).',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Kreis', 'Umfang', 'Pi', 'Radius', 'umstellen'],
  fachwissen: {
    text: 'Die Umfangsformel U = 2πr lässt sich nach dem Radius umstellen: r = U : (2π). So kann man aus einem gemessenen Umfang (z. B. mit einem Maßband um einen runden Gegenstand) den Radius berechnen, ohne ihn direkt zu messen.',
    quelle: 'Wikipedia: Kreisumfang',
    url: 'https://de.wikipedia.org/wiki/Kreisumfang',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const r = randInt(rng, 2, 20)
      const U = roundTo(2 * PI * r, 2)
      return valueTask({
        question: `Ein Kreis hat den Umfang U = ${formatDe(U)} cm. Berechne den Radius r (zwei Nachkommastellen, π ≈ 3,14159).`,
        unit: 'cm',
        answerKind: 'decimal',
        value: r,
        eps: 0.05,
        solution: `${formatDe(r)} cm`,
        explanation: `r = U : (2π) = ${formatDe(U)} : (2·π) ≈ ${formatDe(r)} cm.`,
        dedupeKey: `k9neukreisu-tippen:${r}`,
      })
    },
    (rng: Rng) => {
      const r = randInt(rng, 2, 20)
      const U = roundTo(2 * PI * r, 2)
      const correct = `${formatDe(r)} cm`
      const wrong1 = `${formatDe(roundTo(U / PI, 2))} cm` // den Faktor 2 vergessen
      const wrong2 = `${formatDe(roundTo(U * 2 * PI, 2))} cm` // multipliziert statt dividiert
      const wrong3 = `${formatDe(roundTo(Math.sqrt(U / PI), 2))} cm` // Flächenformel verwendet
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Kreis hat den Umfang U = ${formatDe(U)} cm. Wie groß ist der Radius r?`,
        choices,
        correct,
        solution: correct,
        explanation: `r = U : (2π) = ${formatDe(U)} : (2·π) ≈ ${formatDe(r)} cm.`,
        dedupeKey: `k9neukreisu-mc:${r}`,
      })
    },
    (rng: Rng) => {
      const r = randInt(rng, 2, 20)
      const U = roundTo(2 * PI * r, 2)
      return numberLineTask({
        question: `Ein Kreis hat den Umfang U = ${formatDe(U)} cm. Markiere den Radius r auf dem Zahlenstrahl.`,
        min: 0,
        max: 22,
        step: 1,
        value: r,
        solution: `${formatDe(r)} cm`,
        explanation: `r = U : (2π) ≈ ${formatDe(r)} cm.`,
      })
    },
  ),
})

const kreisFlaecheNeu: Topic = asNeuTopic('k9-lb2-kreis-flaeche', {
  id: 'k9-lb2-kreis-flaeche__neu',
  title: 'Radius aus dem Flächeninhalt berechnen',
  hint: 'Stelle A = πr² nach r um: r = √(A : π).',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Kreis', 'Flächeninhalt', 'Pi', 'Radius', 'umstellen', 'Wurzel'],
  fachwissen: {
    text: 'Die Flächenformel A = πr² lässt sich nach dem Radius umstellen: r = √(A : π). Dabei muss zuerst durch π geteilt und erst danach die Quadratwurzel gezogen werden.',
    quelle: 'Wikipedia: Kreisfläche',
    url: 'https://de.wikipedia.org/wiki/Kreisfl%C3%A4che',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const r = randInt(rng, 2, 20)
      const A = roundTo(PI * r * r, 2)
      return valueTask({
        question: `Ein Kreis hat den Flächeninhalt A = ${formatDe(A)} cm². Berechne den Radius r (zwei Nachkommastellen, π ≈ 3,14159).`,
        unit: 'cm',
        answerKind: 'decimal',
        value: r,
        eps: 0.05,
        solution: `${formatDe(r)} cm`,
        explanation: `r = √(A : π) = √(${formatDe(A)} : π) ≈ ${formatDe(r)} cm.`,
        dedupeKey: `k9neukreisa-tippen:${r}`,
      })
    },
    (rng: Rng) => {
      const r = randInt(rng, 2, 20)
      const A = roundTo(PI * r * r, 2)
      const correct = `${formatDe(r)} cm`
      const wrong1 = `${formatDe(roundTo(A / PI, 2))} cm` // Wurzel vergessen
      const wrong2 = `${formatDe(roundTo(A / (2 * PI), 2))} cm` // Umfangsformel verwendet
      const wrong3 = `${formatDe(roundTo(Math.sqrt(A), 2))} cm` // π beim Wurzelziehen vergessen
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Kreis hat den Flächeninhalt A = ${formatDe(A)} cm². Wie groß ist der Radius r?`,
        choices,
        correct,
        solution: correct,
        explanation: `r = √(A : π) ≈ ${formatDe(r)} cm.`,
        dedupeKey: `k9neukreisa-mc:${r}`,
      })
    },
    (rng: Rng) => {
      const r = randInt(rng, 2, 20)
      const A = roundTo(PI * r * r, 2)
      return numberLineTask({
        question: `Ein Kreis hat den Flächeninhalt A = ${formatDe(A)} cm². Markiere den Radius r auf dem Zahlenstrahl.`,
        min: 0,
        max: 22,
        step: 1,
        value: r,
        solution: `${formatDe(r)} cm`,
        explanation: `r = √(A : π) ≈ ${formatDe(r)} cm.`,
      })
    },
  ),
})

const zylinderVolumenNeu: Topic = asNeuTopic('k9-lb2-zylinder-volumen', {
  id: 'k9-lb2-zylinder-volumen__neu',
  title: 'Höhe eines Zylinders aus dem Volumen berechnen',
  hint: 'Stelle V = πr²h nach h um: h = V : (πr²).',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Zylinder', 'Volumen', 'Höhe', 'Pi', 'umstellen'],
  fachwissen: {
    text: 'Die Volumenformel V = πr²h lässt sich nach der Höhe umstellen: h = V : (πr²). So lässt sich z. B. berechnen, wie hoch ein zylindrischer Behälter mit bekanntem Radius sein muss, um ein bestimmtes Volumen zu fassen.',
    quelle: 'Wikipedia: Zylinder (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Zylinder_(Geometrie)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const r = randInt(rng, 2, 10)
      const h = randInt(rng, 2, 15)
      const V = roundTo(PI * r * r * h, 2)
      return valueTask({
        question: `Ein Kreiszylinder mit Radius r = ${r} cm hat das Volumen V = ${formatDe(V)} cm³. Berechne die Höhe h (ganze Zahl, π ≈ 3,14159).`,
        unit: 'cm',
        answerKind: 'decimal',
        value: h,
        eps: 0.1,
        solution: `${h} cm`,
        explanation: `h = V : (π·r²) = ${formatDe(V)} : (π·${r}²) ≈ ${h} cm.`,
        dedupeKey: `k9neuzylh-tippen:${r}:${h}`,
      })
    },
    (rng: Rng) => {
      const r = randInt(rng, 2, 10)
      const h = randInt(rng, 2, 15)
      const V = roundTo(PI * r * r * h, 2)
      const correct = `${h} cm`
      const wrong1 = `${formatDe(roundTo(V / (PI * r), 2))} cm` // r nicht quadriert
      const wrong2 = `${formatDe(roundTo(V / (2 * PI * r), 2))} cm` // Mantelformel statt Volumenformel
      const wrong3 = `${formatDe(roundTo(Math.sqrt(V / PI), 2))} cm` // Kugelformel-Denkfehler
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Kreiszylinder mit Radius r = ${r} cm hat das Volumen V = ${formatDe(V)} cm³. Wie hoch ist er?`,
        choices,
        correct,
        solution: correct,
        explanation: `h = V : (π·r²) ≈ ${h} cm.`,
        dedupeKey: `k9neuzylh-mc:${r}:${h}`,
      })
    },
    (rng: Rng) => {
      const r = randInt(rng, 2, 8)
      const h = randInt(rng, 2, 12)
      const V = roundTo(PI * r * r * h, 2)
      return paramSliderTask({
        question: `Der Zylinder hat den Radius r = ${r} cm. Sein Volumen beträgt V = ${formatDe(V)} cm³. Berechne die Höhe h und stelle sie am Regler ein.`,
        params: [{ id: 'h', label: 'Höhe h (cm)', min: 0, max: 20, step: 1, start: 5 }],
        correct: { h },
        solution: `${h} cm`,
        explanation: `h = V : (π·r²) = ${formatDe(V)} : (π·${r}²) ≈ ${h} cm.`,
        visualContent: generateCylinderSvg({ radiusLabel: `${r} cm`, heightLabel: '?' }),
        instruction: 'Stelle die berechnete Höhe ein:',
      })
    },
  ),
})

const kugelOberflaecheNeu: Topic = asNeuTopic('k9-lb2-kugel-volumen', {
  id: 'k9-lb2-kugel-volumen__neu',
  title: 'Oberfläche einer Kugel berechnen',
  hint: 'O = 4πr² — vier Großkreisflächen.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Kugel', 'Oberfläche', 'Pi', 'Radius', 'Großkreis'],
  fachwissen: {
    text: 'Die Oberfläche einer Kugel mit Radius r beträgt O = 4πr². Anschaulich entspricht sie genau der vierfachen Fläche eines Großkreises (des größten Kreises, den man durch die Kugel legen kann) — ein Ergebnis, das ebenfalls auf Archimedes zurückgeht.',
    quelle: 'Wikipedia: Kugel (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Kugel_(Geometrie)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const r = randInt(rng, 2, 12)
      const O = roundTo(4 * PI * r * r, 2)
      return valueTask({
        question: `Eine Kugel hat den Radius r = ${r} cm. Berechne ihre Oberfläche (zwei Nachkommastellen, π ≈ 3,14159).`,
        unit: 'cm²',
        answerKind: 'decimal',
        value: O,
        eps: 0.1,
        solution: `${formatDe(O)} cm²`,
        explanation: `O = 4·π·r² = 4·π·${r}² cm² = 4·π·${r * r} cm² ≈ ${formatDe(O)} cm².`,
        dedupeKey: `k9neukugelo-tippen:${r}`,
      })
    },
    (rng: Rng) => {
      const r = randInt(rng, 2, 12)
      const O = roundTo(4 * PI * r * r, 2)
      const correct = `${formatDe(O)} cm²`
      const wrong1 = `${formatDe(roundTo(PI * r * r, 2))} cm²` // Faktor 4 vergessen
      const wrong2 = `${formatDe(roundTo(2 * PI * r * r, 2))} cm²` // nur Faktor 2 verwendet
      const wrong3 = `${formatDe(roundTo((4 / 3) * PI * r * r * r, 2))} cm²` // Volumenformel verwendet
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Eine Kugel hat den Radius r = ${r} cm. Wie groß ist ihre Oberfläche?`,
        choices,
        correct,
        solution: correct,
        explanation: `O = 4·π·r² = 4·π·${r}² ≈ ${formatDe(O)} cm².`,
        dedupeKey: `k9neukugelo-mc:${r}`,
      })
    },
    (rng: Rng) => {
      const r = randInt(rng, 2, 10)
      const O = roundTo(4 * PI * r * r, 2)
      return visualTask({
        question: 'Die Skizze zeigt den Großkreis einer Kugel. Berechne die Oberfläche der Kugel (zwei Nachkommastellen, π ≈ 3,14159).',
        unit: 'cm²',
        answerKind: 'decimal',
        value: O,
        eps: 0.5,
        solution: `${formatDe(O)} cm²`,
        explanation: `O = 4·π·r² = 4·π·${r}² ≈ ${formatDe(O)} cm².`,
        visualContent: generateCircleMeasureSvg({
          radiusLabel: `r = ${r} cm`,
          fill: '#fff3e0',
          stroke: '#ef6c00',
        }),
      })
    },
  ),
})

export const math9NeuLb2: Topic[] = [
  kreisUmfangNeu,
  kreisFlaecheNeu,
  zylinderVolumenNeu,
  kugelOberflaecheNeu,
]

// ---------------------------------------------------------------------------
// Lernbereich 3 — Rechtwinklige Dreiecke
// ---------------------------------------------------------------------------

const pythagorasDiagonaleNeu: Topic = asNeuTopic('k9-lb3-pythagoras-hypotenuse', {
  id: 'k9-lb3-pythagoras-hypotenuse__neu',
  title: 'Pythagoras: Diagonale eines Rechtecks',
  hint: 'Die Diagonale ist die Hypotenuse des Dreiecks aus Länge und Breite.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Pythagoras', 'Rechteck', 'Diagonale', 'Länge', 'Breite'],
  fachwissen: {
    text: 'Die Diagonale eines Rechtecks teilt es in zwei rechtwinklige Dreiecke. Länge l und Breite b sind die Katheten, die Diagonale d die Hypotenuse: d = √(l² + b²). So lässt sich z. B. prüfen, ob ein Bild diagonal durch eine Tür passt.',
    quelle: 'Wikipedia: Satz des Pythagoras',
    url: 'https://de.wikipedia.org/wiki/Satz_des_Pythagoras',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const [a, b, c] = pick(rng, TRIPLES)
      const k = randInt(rng, 1, 3)
      const l = a * k
      const br = b * k
      const d = c * k
      return valueTask({
        question: `Ein Rechteck ist ${l} cm lang und ${br} cm breit. Berechne die Länge der Diagonale d.`,
        unit: 'cm',
        answerKind: 'integer',
        value: d,
        solution: `${d} cm`,
        explanation: `d = √(l² + b²) = √(${l}² + ${br}²) = √(${l * l} + ${br * br}) = √${l * l + br * br} = ${d} cm.`,
        dedupeKey: `k9neudiag-tippen:${l}:${br}`,
      })
    },
    (rng: Rng) => {
      const [a, b, c] = pick(rng, TRIPLES)
      const k = randInt(rng, 1, 3)
      const l = a * k
      const br = b * k
      const d = c * k
      const correct = `${d} cm`
      const wrong1 = `${l + br} cm` // Summe statt Pythagoras
      const wrong2 = `${Math.round(Math.sqrt(l * br))} cm` // geometrisches Mittel statt Pythagoras
      const wrong3 = `${Math.round((l + br) / 2)} cm` // Mittelwert statt Pythagoras
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Rechteck ist ${l} cm lang und ${br} cm breit. Wie lang ist seine Diagonale?`,
        choices,
        correct,
        solution: correct,
        explanation: `d = √(${l}² + ${br}²) = ${d} cm.`,
        dedupeKey: `k9neudiag-mc:${l}:${br}`,
      })
    },
    (rng: Rng) => {
      const [a, b, c] = pick(rng, TRIPLES)
      const k = randInt(rng, 1, 2)
      const l = a * k
      const br = b * k
      const d = c * k
      return numberLineTask({
        question: `Ein Rechteck ist ${l} cm lang und ${br} cm breit. Markiere die Länge der Diagonale d auf dem Zahlenstrahl.`,
        min: 0,
        max: 60,
        step: 1,
        value: d,
        solution: `${d} cm`,
        explanation: `d = √(${l}² + ${br}²) = ${d} cm.`,
      })
    },
  ),
})

const quadratSeiteAusDiagonaleNeu: Topic = asNeuTopic('k9-lb3-pythagoras-kathete', {
  id: 'k9-lb3-pythagoras-kathete__neu',
  title: 'Quadratseite aus der Diagonale berechnen',
  hint: 'Bei einem Quadrat gilt d = a·√2, also a = d : √2.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Pythagoras', 'Quadrat', 'Diagonale', 'Seitenlänge', 'Wurzel 2'],
  fachwissen: {
    text: 'Bei einem Quadrat mit Seitenlänge a sind beide Katheten im rechtwinkligen Dreieck gleich lang (a = b), sodass gilt: d = √(a² + a²) = a·√2. Kennt man die Diagonale, berechnet man die Seite durch a = d : √2.',
    quelle: 'Wikipedia: Satz des Pythagoras',
    url: 'https://de.wikipedia.org/wiki/Satz_des_Pythagoras',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const side = randInt(rng, 2, 12)
      const d = roundTo(side * Math.sqrt(2), 2)
      return valueTask({
        question: `Ein Quadrat hat die Diagonale d = ${formatDe(d)} cm. Berechne die Seitenlänge a (zwei Nachkommastellen).`,
        unit: 'cm',
        answerKind: 'decimal',
        value: side,
        eps: 0.05,
        solution: `${formatDe(side)} cm`,
        explanation: `a = d : √2 = ${formatDe(d)} : √2 ≈ ${formatDe(side)} cm.`,
        dedupeKey: `k9neuquadside-tippen:${side}`,
      })
    },
    (rng: Rng) => {
      const side = randInt(rng, 2, 12)
      const d = roundTo(side * Math.sqrt(2), 2)
      const correct = `${formatDe(side)} cm`
      const wrong1 = `${formatDe(roundTo(d / 2, 2))} cm` // durch 2 statt √2 geteilt
      const wrong2 = `${formatDe(roundTo(d * Math.sqrt(2), 2))} cm` // multipliziert statt dividiert
      const wrong3 = `${formatDe(d)} cm` // Diagonale als Seite übernommen
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Quadrat hat die Diagonale d = ${formatDe(d)} cm. Wie lang ist eine Seite a?`,
        choices,
        correct,
        solution: correct,
        explanation: `a = d : √2 ≈ ${formatDe(side)} cm.`,
        dedupeKey: `k9neuquadside-mc:${side}`,
      })
    },
    (rng: Rng) => {
      const side = randInt(rng, 2, 10)
      const d = roundTo(side * Math.sqrt(2), 2)
      return numberLineTask({
        question: `Ein Quadrat hat die Diagonale d = ${formatDe(d)} cm. Markiere die Seitenlänge a auf dem Zahlenstrahl.`,
        min: 0,
        max: 15,
        step: 0.5,
        decimals: 1,
        value: side,
        solution: `${formatDe(side)} cm`,
        explanation: `a = d : √2 ≈ ${formatDe(side)} cm.`,
      })
    },
  ),
})

const trigWertSeitenNeu: Topic = asNeuTopic('k9-lb3-trig-wert', {
  id: 'k9-lb3-trig-wert__neu',
  title: 'Sinus, Kosinus, Tangens aus den Dreiecksseiten',
  hint: 'sin = Gegenkathete/Hypotenuse, cos = Ankathete/Hypotenuse, tan = Gegenkathete/Ankathete.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Sinus', 'Kosinus', 'Tangens', 'Trigonometrie', 'Seitenverhältnis', 'Kathete'],
  fachwissen: {
    text: 'Statt mit dem Taschenrechner lassen sich sin, cos und tan auch direkt aus den Seitenlängen eines rechtwinkligen Dreiecks bestimmen: sin(α) = Gegenkathete : Hypotenuse, cos(α) = Ankathete : Hypotenuse, tan(α) = Gegenkathete : Ankathete. Bei pythagoreischen Tripeln ergeben sich dabei exakte Bruchwerte.',
    quelle: 'Wikipedia: Trigonometrie',
    url: 'https://de.wikipedia.org/wiki/Trigonometrie',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const [a, b, c] = pick(rng, TRIPLES)
      const k = randInt(rng, 1, 2)
      const ca = a * k
      const cb = b * k
      const cc = c * k
      const fn = pick(rng, ['sin', 'cos', 'tan'] as const)
      const value =
        fn === 'sin' ? makeFraction(ca, cc) : fn === 'cos' ? makeFraction(cb, cc) : makeFraction(ca, cb)
      return fractionTask({
        question: `In einem rechtwinkligen Dreieck sind die Katheten a = ${ca} cm (Gegenkathete von α) und b = ${cb} cm (Ankathete von α), die Hypotenuse ist c = ${cc} cm. Gib ${fn}(α) als gekürzten Bruch an.`,
        value,
        requireReduced: true,
        solution: format(value),
        explanation:
          fn === 'sin'
            ? `sin(α) = Gegenkathete : Hypotenuse = a : c = ${ca}/${cc} = ${format(value)}.`
            : fn === 'cos'
              ? `cos(α) = Ankathete : Hypotenuse = b : c = ${cb}/${cc} = ${format(value)}.`
              : `tan(α) = Gegenkathete : Ankathete = a : b = ${ca}/${cb} = ${format(value)}.`,
      })
    },
    (rng: Rng) => {
      const [a, b, c] = pick(rng, TRIPLES)
      const k = randInt(rng, 1, 2)
      const ca = a * k
      const cb = b * k
      const cc = c * k
      const fn = pick(rng, ['sin', 'cos', 'tan'] as const)
      const value =
        fn === 'sin' ? makeFraction(ca, cc) : fn === 'cos' ? makeFraction(cb, cc) : makeFraction(ca, cb)
      const correct = format(value)
      const wrong1 = format(makeFraction(cb, cc)) // Gegen- mit Ankathete verwechselt
      const wrong2 = format(makeFraction(cc, ca)) // Bruch verdreht
      const wrong3 = format(makeFraction(ca, cb)) // falsches Seitenpaar (z. B. tan statt sin/cos)
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein rechtwinkliges Dreieck hat die Katheten a = ${ca} cm, b = ${cb} cm und die Hypotenuse c = ${cc} cm. α liegt gegenüber a. Wie groß ist ${fn}(α)?`,
        choices,
        correct,
        solution: correct,
        explanation: `${fn}(α) = ${format(value)}.`,
        dedupeKey: `k9neutrigseite-mc:${ca}:${cb}:${cc}:${fn}`,
      })
    },
    (rng: Rng) => {
      const [a, b, c] = pick(rng, TRIPLES)
      const k = randInt(rng, 1, 2)
      const ca = a * k
      const cb = b * k
      const cc = c * k
      const value = roundTo(ca / cb, 4)
      return visualTask({
        question: `Im rechtwinkligen Dreieck sind die Katheten a = ${ca} cm (Gegenkathete von α) und b = ${cb} cm (Ankathete von α), die Hypotenuse ist c = ${cc} cm. Berechne tan(α) auf vier Nachkommastellen.`,
        answerKind: 'decimal',
        value,
        eps: 0.001,
        solution: formatDe(value),
        explanation: `tan(α) = Gegenkathete : Ankathete = a : b = ${ca} : ${cb} ≈ ${formatDe(value)}.`,
        visualContent: generateRightTriangleSvg({
          aLabel: `a=${ca}`,
          bLabel: `b=${cb}`,
          cLabel: `c=${cc}`,
          ask: 'angle',
        }),
      })
    },
  ),
})

export const math9NeuLb3: Topic[] = [
  pythagorasDiagonaleNeu,
  quadratSeiteAusDiagonaleNeu,
  trigWertSeitenNeu,
]

// ---------------------------------------------------------------------------
// Lernbereich 4 — Auswerten von Daten
// ---------------------------------------------------------------------------

const mittelwertFehlenderWertNeu: Topic = asNeuTopic('k9-lb4-mittelwert', {
  id: 'k9-lb4-mittelwert__neu',
  title: 'Fehlenden Wert zum Zielmittelwert finden',
  hint: 'Gesamtsumme = Mittelwert · Anzahl. Ziehe die bekannten Werte ab.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Mittelwert', 'Durchschnitt', 'fehlender Wert', 'Zielwert', 'Daten'],
  fachwissen: {
    text: 'Ist der gewünschte Mittelwert bekannt, lässt sich die nötige Gesamtsumme berechnen: Summe = Mittelwert · Anzahl der Werte. Zieht man davon die Summe der bereits bekannten Werte ab, erhält man den fehlenden Wert.',
    quelle: 'Wikipedia: Arithmetisches Mittel',
    url: 'https://de.wikipedia.org/wiki/Arithmetisches_Mittel',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const count = randInt(rng, 4, 6)
      const knownCount = count - 1
      let known: number[] = []
      let mean = 0
      let missing = 0
      let guard = 0
      do {
        known = []
        for (let i = 0; i < knownCount; i++) known.push(randInt(rng, 2, 40))
        mean = randInt(rng, 10, 35)
        missing = mean * count - known.reduce((s, x) => s + x, 0)
        guard++
      } while ((missing < 1 || missing > 60) && guard < 30)
      return valueTask({
        question: `${count} Messwerte sollen im Mittel ${mean} ergeben. ${knownCount} Werte sind bekannt: ${known.join(', ')}. Welchen ${knownCount + 1}. Wert braucht man dafür?`,
        answerKind: 'integer',
        value: missing,
        solution: formatDe(missing),
        explanation: `Gesamtsumme muss ${mean} · ${count} = ${mean * count} sein. Bekannte Summe: ${known.join(' + ')} = ${known.reduce((s, x) => s + x, 0)}. Fehlender Wert: ${mean * count} − ${known.reduce((s, x) => s + x, 0)} = ${missing}.`,
        dedupeKey: `k9neumwfehlend-tippen:${count}:${mean}:${known.join('-')}`,
      })
    },
    (rng: Rng) => {
      const count = randInt(rng, 4, 6)
      const knownCount = count - 1
      let known: number[] = []
      let mean = 0
      let missing = 0
      let guard = 0
      do {
        known = []
        for (let i = 0; i < knownCount; i++) known.push(randInt(rng, 2, 40))
        mean = randInt(rng, 10, 35)
        missing = mean * count - known.reduce((s, x) => s + x, 0)
        guard++
      } while ((missing < 1 || missing > 60) && guard < 30)
      const sum = known.reduce((s, x) => s + x, 0)
      const correct = formatDe(missing)
      const wrong1 = formatDe(mean * knownCount - sum) // n−1 statt n verwendet
      const wrong2 = formatDe(Math.abs(mean - Math.round(sum / knownCount))) // mit Mittelwert der bekannten Werte verwechselt
      const wrong3 = formatDe(mean * count) // Subtraktion der bekannten Summe vergessen
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `${count} Messwerte sollen im Mittel ${mean} ergeben. ${knownCount} Werte sind bekannt: ${known.join(', ')}. Welchen ${knownCount + 1}. Wert braucht man dafür?`,
        choices,
        correct,
        solution: correct,
        explanation: `Gesamtsumme: ${mean} · ${count} = ${mean * count}. Fehlender Wert: ${mean * count} − ${sum} = ${missing}.`,
        dedupeKey: `k9neumwfehlend-mc:${count}:${mean}:${known.join('-')}`,
      })
    },
    (rng: Rng) => {
      const count = 4
      const knownCount = 3
      let known: number[] = []
      let mean = 0
      let missing = 0
      let guard = 0
      do {
        known = []
        for (let i = 0; i < knownCount; i++) known.push(randInt(rng, 2, 20))
        mean = randInt(rng, 5, 20)
        missing = mean * count - known.reduce((s, x) => s + x, 0)
        guard++
      } while ((missing < 1 || missing > 40) && guard < 30)
      return numberLineTask({
        question: `${count} Messwerte sollen im Mittel ${mean} ergeben. 3 Werte sind bekannt: ${known.join(', ')}. Markiere den fehlenden 4. Wert auf dem Zahlenstrahl.`,
        min: 0,
        max: 50,
        step: 1,
        value: missing,
        solution: formatDe(missing),
        explanation: `Gesamtsumme: ${mean} · ${count} = ${mean * count}. Fehlender Wert: ${mean * count} − ${known.reduce((s, x) => s + x, 0)} = ${missing}.`,
      })
    },
  ),
})

const medianGeradeAnzahlNeu: Topic = asNeuTopic('k9-lb4-median', {
  id: 'k9-lb4-median__neu',
  title: 'Median bei gerader Anzahl von Werten',
  hint: 'Bei gerader Anzahl ist der Median der Mittelwert der beiden mittleren Zahlen.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Median', 'Zentralwert', 'gerade Anzahl', 'ordnen', 'Daten'],
  fachwissen: {
    text: 'Bei einer geraden Anzahl von Werten gibt es keinen einzelnen mittleren Wert. Der Median ist dann das arithmetische Mittel der beiden mittleren Werte der sortierten Datenreihe.',
    quelle: 'Wikipedia: Median',
    url: 'https://de.wikipedia.org/wiki/Median',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const count = pick(rng, [4, 6, 8] as const)
      const set = new Set<number>()
      while (set.size < count) set.add(randInt(rng, 1, 60))
      const numbers = [...set]
      const sorted = [...numbers].sort((a, b) => a - b)
      const idx1 = count / 2 - 1
      const idx2 = count / 2
      const value = roundTo((sorted[idx1]! + sorted[idx2]!) / 2, 2)
      return valueTask({
        question: `Bestimme den Median von ${numbers.join(', ')}.`,
        answerKind: 'decimal',
        value,
        eps: 0.05,
        solution: formatDe(value),
        explanation: `Sortiert: ${sorted.join(', ')}. Bei ${count} Zahlen (gerade Anzahl) ist der Median der Mittelwert der beiden mittleren Zahlen: (${sorted[idx1]} + ${sorted[idx2]}) : 2 = ${formatDe(value)}.`,
        dedupeKey: `k9neumediangerade-tippen:${numbers.join('-')}`,
      })
    },
    (rng: Rng) => {
      const count = pick(rng, [4, 6, 8] as const)
      const set = new Set<number>()
      while (set.size < count) set.add(randInt(rng, 1, 60))
      const numbers = [...set]
      const sorted = [...numbers].sort((a, b) => a - b)
      const idx1 = count / 2 - 1
      const idx2 = count / 2
      const value = roundTo((sorted[idx1]! + sorted[idx2]!) / 2, 2)
      const correct = formatDe(value)
      const wrong1 = formatDe(sorted[idx1]!) // nur die untere mittlere Zahl
      const wrong2 = formatDe(sorted[idx2]!) // nur die obere mittlere Zahl
      const wrong3 = formatDe(roundTo(numbers.reduce((s, x) => s + x, 0) / count, 2)) // Mittelwert statt Median
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Bestimme den Median von ${numbers.join(', ')}.`,
        choices,
        correct,
        solution: correct,
        explanation: `Sortiert: ${sorted.join(', ')}. Median = (${sorted[idx1]} + ${sorted[idx2]}) : 2 = ${formatDe(value)}.`,
        dedupeKey: `k9neumediangerade-mc:${numbers.join('-')}`,
      })
    },
    (rng: Rng) => {
      const count = pick(rng, [4, 6] as const)
      const set = new Set<number>()
      while (set.size < count) set.add(randInt(rng, 1, 50))
      const numbers = [...set]
      const sorted = [...numbers].sort((a, b) => a - b)
      const idx1 = count / 2 - 1
      const idx2 = count / 2
      const value = roundTo((sorted[idx1]! + sorted[idx2]!) / 2, 2)
      const order = numbers.map((_, i) => i).sort((i, j) => numbers[i]! - numbers[j]!)
      return dragDropSortTask({
        question: 'Sortiere die Zahlen der Größe nach (aufsteigend). Der Median ist dann der Mittelwert der beiden mittleren Zahlen.',
        items: numbers.map((n) => ({ label: String(n), value: n })),
        correctOrder: order,
        solution: `${sorted.join(', ')} (Median: ${formatDe(value)})`,
        explanation: `Sortiert: ${sorted.join(', ')}. Median = (${sorted[idx1]} + ${sorted[idx2]}) : 2 = ${formatDe(value)}.`,
      })
    },
  ),
})

const modalwertHaeufigkeitNeu: Topic = asNeuTopic('k9-lb4-modalwert', {
  id: 'k9-lb4-modalwert__neu',
  title: 'Modalwert aus einer Häufigkeitstabelle (auch bimodal)',
  hint: 'Der Modalwert ist der Wert mit der größten Häufigkeit.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Modalwert', 'Modus', 'Häufigkeitstabelle', 'bimodal', 'Noten'],
  fachwissen: {
    text: 'In einer Häufigkeitstabelle steht neben jedem Wert, wie oft er vorkommt. Der Modalwert ist der Wert mit der größten Häufigkeit. Kommen zwei Werte gleich oft am häufigsten vor, heißt die Datenreihe bimodal — es gibt dann zwei Modalwerte.',
    quelle: 'Wikipedia: Modus (Statistik)',
    url: 'https://de.wikipedia.org/wiki/Modus_(Statistik)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const notes = [1, 2, 3, 4, 5, 6]
      const counts = notes.map(() => randInt(rng, 1, 8))
      let maxIdx = 0
      for (let i = 1; i < counts.length; i++) if (counts[i]! > counts[maxIdx]!) maxIdx = i
      for (let i = 0; i < counts.length; i++) {
        if (i !== maxIdx && counts[i] === counts[maxIdx]) counts[i] = counts[i]! - 1
      }
      const mode = notes[maxIdx]!
      const listing = notes.map((n, i) => `Note ${n}: ${counts[i]}×`).join(', ')
      return valueTask({
        question: `In einer Klassenarbeit wurden folgende Noten vergeben: ${listing}. Welche Note ist der Modalwert (am häufigsten vergeben)?`,
        answerKind: 'integer',
        value: mode,
        solution: `${mode}`,
        explanation: `Note ${mode} kommt ${counts[maxIdx]}-mal vor — häufiger als jede andere Note. Modalwert ist ${mode}.`,
        dedupeKey: `k9neumodaltab-tippen:${counts.join('-')}`,
      })
    },
    (rng: Rng) => {
      const notes = [1, 2, 3, 4, 5, 6]
      const counts = notes.map(() => randInt(rng, 1, 8))
      let maxIdx = 0
      for (let i = 1; i < counts.length; i++) if (counts[i]! > counts[maxIdx]!) maxIdx = i
      for (let i = 0; i < counts.length; i++) {
        if (i !== maxIdx && counts[i] === counts[maxIdx]) counts[i] = counts[i]! - 1
      }
      const mode = notes[maxIdx]!
      const listing = notes.map((n, i) => `Note ${n}: ${counts[i]}×`).join(', ')
      const correct = `${mode}`
      const choices = shuffleChoices(rng, notes.map(String), correct)
      return choicePickTask({
        question: `In einer Klassenarbeit wurden folgende Noten vergeben: ${listing}. Welche Note ist der Modalwert?`,
        choices,
        correct,
        solution: correct,
        explanation: `Note ${mode} kommt ${counts[maxIdx]}-mal vor — am häufigsten. Modalwert ist ${mode}.`,
        dedupeKey: `k9neumodaltab-mc:${counts.join('-')}`,
      })
    },
    (rng: Rng) => {
      const notes = [1, 2, 3, 4, 5, 6]
      const counts = notes.map(() => randInt(rng, 1, 5))
      const i1 = randInt(rng, 0, 5)
      let i2 = randInt(rng, 0, 5)
      while (i2 === i1) i2 = randInt(rng, 0, 5)
      const topCount = Math.max(...counts) + 2
      counts[i1] = topCount
      counts[i2] = topCount
      for (let i = 0; i < counts.length; i++) {
        if (i !== i1 && i !== i2 && counts[i]! >= topCount) counts[i] = topCount - 1
      }
      const correct = [String(notes[i1]), String(notes[i2])].sort()
      const listing = notes.map((n, i) => `Note ${n}: ${counts[i]}×`).join(', ')
      return multiSelectTask({
        question: `In einer Klassenarbeit wurden folgende Noten vergeben: ${listing}. Zwei Noten kommen gleich häufig am häufigsten vor (bimodal). Wähle beide Modalwerte aus.`,
        choices: notes.map(String),
        correct,
        solution: correct.join(' und '),
        explanation: `Note ${notes[i1]} und Note ${notes[i2]} kommen je ${topCount}-mal vor — häufiger als jede andere Note. Die Datenreihe ist bimodal mit den Modalwerten ${correct.join(' und ')}.`,
        instruction: 'Wähle beide Modalwerte aus:',
      })
    },
  ),
})

export const math9NeuLb4: Topic[] = [
  mittelwertFehlenderWertNeu,
  medianGeradeAnzahlNeu,
  modalwertHaeufigkeitNeu,
]

// ---------------------------------------------------------------------------
// Lernbereich 5 — Vernetzung
// ---------------------------------------------------------------------------

const abstandKarteNeu: Topic = asNeuTopic('k9-lb5-leiter', {
  id: 'k9-lb5-leiter__neu',
  title: 'Vernetzung: Abstand zweier Orte auf einer Karte',
  hint: 'Ost-/Nord-Abstand und Luftlinie bilden ein rechtwinkliges Dreieck.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Pythagoras', 'Sachaufgabe', 'Karte', 'Luftlinie', 'Vernetzung'],
  fachwissen: {
    text: 'Liegen zwei Orte auf einer Karte mit einem Ost-West- und einem Nord-Süd-Abstand zueinander, bilden diese beiden Abstände zusammen mit der direkten Entfernung (Luftlinie) ein rechtwinkliges Dreieck. Die Luftlinie lässt sich dann mit dem Satz des Pythagoras berechnen.',
    quelle: 'Wikipedia: Satz des Pythagoras',
    url: 'https://de.wikipedia.org/wiki/Satz_des_Pythagoras',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const [a, b, c] = pick(rng, TRIPLES)
      const k = randInt(rng, 1, 2)
      const dx = a * k
      const dy = b * k
      const value = c * k
      return valueTask({
        question: `Auf einer Karte liegt Ort B ${dx} km östlich und ${dy} km nördlich von Ort A. Wie groß ist die direkte Entfernung (Luftlinie) zwischen A und B?`,
        unit: 'km',
        answerKind: 'integer',
        value,
        solution: `${value} km`,
        explanation: `Die Luftlinie ist die Hypotenuse: d = √(${dx}² + ${dy}²) = √(${dx * dx} + ${dy * dy}) = √${dx * dx + dy * dy} = ${value} km.`,
        dedupeKey: `k9neuabstkarte-tippen:${dx}:${dy}`,
      })
    },
    (rng: Rng) => {
      const [a, b, c] = pick(rng, TRIPLES)
      const k = randInt(rng, 1, 2)
      const dx = a * k
      const dy = b * k
      const value = c * k
      const correct = `${value} km`
      const wrong1 = `${dx + dy} km` // Summe statt Pythagoras
      const wrong2 = `${Math.round(Math.sqrt(dx * dy))} km` // geometrisches Mittel
      const wrong3 = `${Math.round((dx + dy) / 2)} km` // Mittelwert statt Pythagoras
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ort B liegt ${dx} km östlich und ${dy} km nördlich von Ort A. Wie groß ist die Luftlinie zwischen A und B?`,
        choices,
        correct,
        solution: correct,
        explanation: `d = √(${dx}² + ${dy}²) = ${value} km.`,
        dedupeKey: `k9neuabstkarte-mc:${dx}:${dy}`,
      })
    },
    (rng: Rng) => {
      const [a, b, c] = pick(rng, TRIPLES)
      const k = randInt(rng, 1, 2)
      const dx = a * k
      const dy = b * k
      const value = c * k
      return numberLineTask({
        question: `Ort B liegt ${dx} km östlich und ${dy} km nördlich von Ort A. Markiere die Luftlinie zwischen A und B auf dem Zahlenstrahl.`,
        min: 0,
        max: 60,
        step: 1,
        value,
        solution: `${value} km`,
        explanation: `d = √(${dx}² + ${dy}²) = ${value} km.`,
      })
    },
  ),
})

export const math9NeuLb5: Topic[] = [abstandKarteNeu]

export const math9NeuTopics: Topic[] = [
  ...math9NeuLb1,
  ...math9NeuLb2,
  ...math9NeuLb3,
  ...math9NeuLb4,
  ...math9NeuLb5,
]
