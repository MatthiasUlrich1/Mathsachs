import { pick, randInt, type Rng } from '../lib/rng'
import {
  generateFunctionGraphSvg,
  generateVectorArrowsSvg,
} from '../lib/geometrySvg'
import { formatDe, roundTo } from '../lib/num'
import { linFactor, linStr, polyStr } from '../lib/termFormat'
import { mixedVariants, valueTask, visualTask } from './taskHelpers'
import { math1112GraphicReviews } from './graphicReviewTopics'
import {
  k1112AbleitungExp,
  k1112AbstandPunktGerade,
  k1112BinomKumuliert,
  k1112BinomSigma,
  k1112Differenzenquotient,
  k1112Extremum,
  k1112ExtremwertAnwendung,
  k1112FlaecheIntegral,
  k1112GeradePunkt,
  k1112Hypothesentest,
  k1112LageGeraden,
  k1112KonfidenzIdee,
  k1112MatrixAdd,
  k1112MatrixDet,
  k1112MatrixLgs,
  k1112MatrixMult,
  k1112Orthogonal,
  k1112SpiegelungEbene,
  k1112Stammfunktion,
  k1112Stichprobenmittel,
  k1112VektorAdd,
  k1112VolumenOptimierung,
  k1112WinkelVektoren,
} from './mathUpperDense'
import type { Grade, Topic } from './types'
import { MATH_LEHRPLAN_TEILASPEKTE_BY_GRADE } from './mathLehrplanTeilaspekte'

const num = (n: number): string => (n < 0 ? `(−${Math.abs(n)})` : `${n}`)
const nonZero = (rng: Rng, min: number, max: number): number => {
  let v = 0
  while (v === 0) v = randInt(rng, min, max)
  return v
}

/** A following polynomial term with its sign, e.g. " + 3x²" or " − 2x". */
const term = (coeff: number, suffix: string): string => {
  if (coeff === 0) return ''
  const sign = coeff < 0 ? '− ' : '+ '
  const mag = Math.abs(coeff) === 1 && suffix ? '' : `${Math.abs(coeff)}`
  return ` ${sign}${mag}${suffix}`
}

/** A leading polynomial term (no leading sign for positives), e.g. "x³", "−2x". */
const firstTerm = (coeff: number, suffix: string): string => {
  if (Math.abs(coeff) === 1 && suffix) return coeff < 0 ? `−${suffix}` : suffix
  return `${coeff < 0 ? `−${Math.abs(coeff)}` : coeff}${suffix}`
}

/** A squared value, wrapping negatives in parentheses: 7² or (−4)². */
const sq = (n: number): string => (n < 0 ? `(−${Math.abs(n)})²` : `${n}²`)

/** Join signed numbers into a readable sum, e.g. "3 + 4 − 3". */
const sumOf = (vals: number[]): string =>
  vals
    .map((v, i) => (i === 0 ? minus(v) : v < 0 ? `− ${Math.abs(v)}` : `+ ${v}`))
    .join(' ')

/** A single number with a real minus sign for negatives (for display). */
const minus = (n: number): string => (n < 0 ? `−${formatDe(-n)}` : formatDe(n))

/** Format a vector tuple as "(x; y; z)" with real minus signs. */
const vec = (v: number[]): string => `(${v.map(minus).join('; ')})`

// ---------------------------------------------------------------------------
// Lernbereich 1 — Differential- und Integralrechnung
// ---------------------------------------------------------------------------

const ableitungStelle: Topic = {
  id: 'k1112-lb1-ableitung-stelle',
  title: 'Ableitung eines Polynoms an einer Stelle',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Ableitung', 'Differentialrechnung', 'Steigung', 'Polynom', "f'(x)", 'Potenzregel'],
  fachwissen: {
    text: 'Die Ableitung f\'(x₀) gibt die momentane Änderungsrate (Steigung der Tangente) an der Stelle x₀ an. Für Polynome gilt die Potenzregel: (xⁿ)\' = n·xⁿ⁻¹. Die Ableitung ist die Grundlage der Differentialrechnung und beschreibt z. B. Geschwindigkeiten, Wachstumsraten oder Optimierungsprobleme.',
    quelle: 'Wikipedia: Ableitung (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Ableitung_(Mathematik)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = nonZero(rng, -3, 3)
      const b = nonZero(rng, -4, 4)
      const c = nonZero(rng, -5, 5)
      const x0 = nonZero(rng, -3, 3)
      const value = 3 * a * x0 * x0 + 2 * b * x0 + c
      const fStr = `f(x) = ${firstTerm(a, 'x³')}${term(b, 'x²')}${term(c, 'x')} + d`
      const derivStr = `${firstTerm(3 * a, 'x²')}${term(2 * b, 'x')}${term(c, '')}`
      return valueTask({
        question: `Gegeben ist ${fStr}. Berechne die Ableitung an der Stelle x₀ = ${minus(x0)}, also f'(${minus(x0)}).`,
        answerKind: 'integer',
        value,
        solution: `f'(${minus(x0)}) = ${minus(value)}`,
        explanation: `Ableiten mit der Potenzregel: f'(x) = ${derivStr}. Einsetzen von x₀ = ${minus(x0)}: f'(${minus(x0)}) = ${sumOf([3 * a * x0 * x0, 2 * b * x0, c])} = ${minus(value)}.`,
      })
    },
    (rng: Rng) => {
      // Visual: quadratic f(x)=a x² + b x + c with readable tangent
      const a = pick(rng, [-1, 1, 2])
      const b = nonZero(rng, -3, 3)
      const c = randInt(rng, -2, 3)
      const x0 = randInt(rng, -2, 2)
      const m = 2 * a * x0 + b
      const y0 = a * x0 * x0 + b * x0 + c
      return visualTask({
        question: `Die rote Gerade ist die Tangente an f(x) = ${firstTerm(a, 'x²')}${term(b, 'x')}${term(c, '')} bei x₀ = ${minus(x0)}. Lies die Steigung f'(${minus(x0)}) ab bzw. berechne sie.`,
        answerKind: 'integer',
        value: m,
        solution: `f'(${minus(x0)}) = ${minus(m)}`,
        explanation: `f'(x) = ${firstTerm(2 * a, 'x')}${term(b, '')}. f'(${minus(x0)}) = ${minus(m)}. Die Tangente hat Steigung ${minus(m)}.`,
        visualContent: generateFunctionGraphSvg({
          f: (x) => a * x * x + b * x + c,
          tangent: { x0, m, label: `m=${minus(m)}` },
          points: [{ x: x0, y: y0, label: 'P' }],
          xRange: [-4, 4],
          yRange: [
            Math.min(-5, y0 - 3, c - 2),
            Math.max(6, y0 + 3, c + 4),
          ],
        }),
      })
    },
  ),
}

const nullstelleLinear: Topic = {
  id: 'k1112-lb1-nullstelle-linear',
  title: 'Nullstellen ganzrationaler Funktionen',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Nullstelle', 'ganzrationale Funktion', 'Ausklammern', 'Substitution', 'Satz vom Nullprodukt'],
  fachwissen: {
    text: 'Nullstellen ganzrationaler Funktionen findet man durch Ausklammern und den Satz vom Nullprodukt (ein Produkt ist null, wenn ein Faktor null ist) oder bei biquadratischen Gleichungen x⁴ + px² + q = 0 durch Substitution z = x². Eine Funktion n-ten Grades hat höchstens n Nullstellen.',
    quelle: 'Wikipedia: Nullstelle',
    url: 'https://de.wikipedia.org/wiki/Nullstelle',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      // f(x) = a·x³ − a·k²·x = a·x(x − k)(x + k)
      const a = pick(rng, [1, 2, -1, 3])
      const k = randInt(rng, 1, 6)
      const askMax = rng() < 0.5
      return valueTask({
        question: `Bestimme die ${askMax ? 'größte' : 'kleinste'} Nullstelle von f(x) = ${firstTerm(a, 'x³')}${term(-a * k * k, 'x')}.`,
        answerKind: 'integer',
        value: askMax ? k : -k,
        solution: `x = ${minus(askMax ? k : -k)}`,
        explanation: `Ausklammern: f(x) = ${firstTerm(a, 'x')}(x² − ${k * k}) = 0 ⇒ x = 0 oder x² = ${k * k}, also x = ±${k}. ${askMax ? 'Größte' : 'Kleinste'} Nullstelle: ${minus(askMax ? k : -k)}.`,
        dedupeKey: `ma:k1112:nst:aus:${a}:${k}:${askMax}`,
      })
    },
    (rng: Rng) => {
      // biquadratisch: (x² − p²)(x² − q²)
      const p = randInt(rng, 1, 3)
      const q = randInt(rng, p + 1, 5)
      const b = p * p + q * q
      const c = p * p * q * q
      return valueTask({
        question: `Bestimme die größte Nullstelle von f(x) = x⁴ − ${minus(b)}x² + ${minus(c)}.`,
        answerKind: 'integer',
        value: q,
        solution: `x = ${minus(q)}`,
        explanation: `Substitution z = x²: z² − ${minus(b)}z + ${minus(c)} = 0 ⇒ z = ${p * p} oder z = ${q * q}. Rücksubstitution: x = ±${p} oder x = ±${minus(q)}. Größte Nullstelle: ${minus(q)}.`,
        dedupeKey: `ma:k1112:nst:biquad:${p}:${q}`,
      })
    },
    (rng: Rng) => {
      // Anzahl verschiedener Nullstellen von (x − r)·(x² + s) bzw. (x − r)·(x² − s²)
      const r = randInt(rng, -4, 4)
      const s = randInt(rng, 1, 4)
      const kind = pick(rng, ['plus', 'minus', 'doppelt'] as const)
      const second = kind === 'plus' ? `x² + ${s * s}` : kind === 'minus' ? `x² − ${s * s}` : `x² − ${r * r}`
      if (kind === 'doppelt' && r === 0) return nullstelleLinear.generate(rng)
      const count = kind === 'plus' ? 1 : kind === 'minus' ? (Math.abs(r) === s ? 2 : 3) : 2
      return valueTask({
        question: `Wie viele verschiedene Nullstellen hat f(x) = ${linFactor(r)}·(${second})?`,
        answerKind: 'integer',
        value: count,
        solution: `${count}`,
        explanation:
          kind === 'plus'
            ? `Satz vom Nullprodukt: x = ${minus(r)} aus dem ersten Faktor; x² + ${s * s} = 0 hat keine reelle Lösung. Also 1 Nullstelle.`
            : `Satz vom Nullprodukt: x = ${minus(r)} aus dem ersten Faktor, dazu x = ±${kind === 'minus' ? s : Math.abs(r)} aus dem zweiten. ${count === 2 ? `x = ${minus(r)} kommt doppelt vor, also 2 verschiedene Nullstellen.` : 'Also 3 verschiedene Nullstellen.'}`,
        dedupeKey: `ma:k1112:nst:anzahl:${r}:${s}:${kind}`,
      })
    },
  ),
}

const bestimmtesIntegral: Topic = {
  id: 'k1112-lb1-bestimmtes-integral',
  title: 'Bestimmtes Integral eines Polynoms',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Integral', 'bestimmtes Integral', 'Stammfunktion', 'Integralrechnung', 'Fläche'],
  fachwissen: {
    text: 'Das bestimmte Integral ∫ₐᵇ f(x) dx gibt den orientierten Flächeninhalt zwischen dem Graphen von f und der x-Achse von a bis b an. Es berechnet sich mit dem Hauptsatz der Differential- und Integralrechnung: ∫ₐᵇ f(x) dx = F(b) − F(a), wobei F die Stammfunktion von f ist.',
    quelle: 'Wikipedia: Bestimmtes Integral',
    url: 'https://de.wikipedia.org/wiki/Integral#Bestimmtes_Integral',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = pick(rng, [-3, 3, 6])
      const b = pick(rng, [-4, -2, 2, 4])
      const c = nonZero(rng, -3, 3)
      const q = randInt(rng, 2, 5)
      const value = Math.round((a / 3) * q ** 3 + (b / 2) * q ** 2 + c * q)
      const fStr = `${firstTerm(a, 'x²')}${term(b, 'x')}${term(c, '')}`
      const fatF = `${firstTerm(a / 3, 'x³')}${term(b / 2, 'x²')}${term(c, 'x')}`
      return valueTask({
        question: `Berechne das bestimmte Integral ∫₀^${minus(q)} (${fStr}) dx.`,
        answerKind: 'integer',
        value,
        solution: `${minus(value)}`,
        explanation: `Stammfunktion: F(x) = ${fatF}. F(${minus(q)}) − F(0) = ${sumOf([(a / 3) * q ** 3, (b / 2) * q ** 2, c * q])} = ${minus(value)}.`,
      })
    },
    (rng: Rng) => {
      // Lineare Funktion über [a; b], Graph oberhalb der x-Achse
      const m = pick(rng, [0.5, 1, 2])
      const c = randInt(rng, 0, 3)
      const a = randInt(rng, 0, 2)
      const b = a + randInt(rng, 1, 3)
      const F = (x: number) => (m / 2) * x * x + c * x
      const value = F(b) - F(a)
      const fStr = linStr(m, c)
      return visualTask({
        question: `Die Fläche unter dem Graphen von f(x) = ${fStr} über dem Intervall [${minus(a)}; ${minus(b)}] ist markiert. Berechne ∫ von ${minus(a)} bis ${minus(b)} f(x) dx.`,
        answerKind: 'decimal',
        value,
        solution: formatDe(value),
        explanation: `F(x) = ${polyStr([[m / 2, 'x²'], [c, 'x']])}. F(${minus(b)}) − F(${minus(a)}) = ${formatDe(F(b))} − ${formatDe(F(a))} = ${formatDe(value)}.`,
        dedupeKey: `ma:k1112:integral:linear:${m}:${c}:${a}:${b}`,
        visualContent: generateFunctionGraphSvg({
          f: (x) => m * x + c,
          shade: { a, b },
          xRange: [-1, b + 2],
          yRange: [-1, m * b + c + 2],
          points: [
            { x: a, y: 0, label: minus(a) },
            { x: b, y: 0, label: minus(b) },
          ],
        }),
      })
    },
  ),
}

// ---------------------------------------------------------------------------
// Lernbereich 2 — Vektoren, Geraden und Ebenen
// ---------------------------------------------------------------------------

const skalarprodukt: Topic = {
  id: 'k1112-lb2-skalarprodukt',
  title: 'Skalarprodukt zweier Vektoren',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Skalarprodukt', 'Vektoren', 'Vektor', 'komponentenweise', 'analytische Geometrie'],
  fachwissen: {
    text: 'Das Skalarprodukt zweier Vektoren a und b ergibt eine Zahl: a · b = a₁b₁ + a₂b₂ + a₃b₃ = |a|·|b|·cos(α). Es ist null, genau dann wenn die Vektoren senkrecht zueinander stehen (Orthogonalitätsbedingung). Das Skalarprodukt ist zentral in Physik (Arbeit = Kraft · Weg) und Informatik (z. B. Empfehlungsalgorithmen).',
    quelle: 'Wikipedia: Skalarprodukt',
    url: 'https://de.wikipedia.org/wiki/Skalarprodukt',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = [nonZero(rng, -6, 6), nonZero(rng, -6, 6), nonZero(rng, -6, 6)]
      const b = [nonZero(rng, -6, 6), nonZero(rng, -6, 6), nonZero(rng, -6, 6)]
      const value = a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
      const products = [a[0] * b[0], a[1] * b[1], a[2] * b[2]]
      return valueTask({
        question: `Berechne das Skalarprodukt der Vektoren a = ${vec(a)} und b = ${vec(b)}.`,
        answerKind: 'integer',
        value,
        solution: `${minus(value)}`,
        explanation: `a · b = ${num(a[0])}·${num(b[0])} + ${num(a[1])}·${num(b[1])} + ${num(a[2])}·${num(b[2])} = ${sumOf(products)} = ${minus(value)}.`,
      })
    },
    (rng: Rng) => {
      // 2D sketch: a·b = a1 b1 + a2 b2
      const a = [nonZero(rng, -4, 4), nonZero(rng, -4, 4)]
      const b = [nonZero(rng, -4, 4), nonZero(rng, -4, 4)]
      const value = a[0] * b[0] + a[1] * b[1]
      return visualTask({
        question: `Die Vektoren a = (${minus(a[0])}; ${minus(a[1])}) und b = (${minus(b[0])}; ${minus(b[1])}) sind skizziert. Berechne a · b.`,
        answerKind: 'integer',
        value,
        solution: `${minus(value)}`,
        explanation: `a · b = ${num(a[0])}·${num(b[0])} + ${num(a[1])}·${num(b[1])} = ${minus(value)}.`,
        visualContent: generateVectorArrowsSvg({
          vectors: [
            { x: a[0], y: a[1], label: 'a' },
            { x: b[0], y: b[1], label: 'b' },
          ],
        }),
      })
    },
  ),
}

// 3D vectors with integer magnitude, to keep the answer exact.
const VEC3: ReadonlyArray<readonly [number, number, number, number]> = [
  [1, 2, 2, 3],
  [2, 3, 6, 7],
  [1, 4, 8, 9],
  [2, 6, 9, 11],
  [4, 4, 7, 9],
  [3, 4, 12, 13],
]

const betragVektor: Topic = {
  id: 'k1112-lb2-betrag-vektor',
  title: 'Betrag eines Vektors',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Betrag', 'Länge', 'Vektor', 'Vektoren', 'Norm', 'analytische Geometrie'],
  fachwissen: {
    text: 'Der Betrag |v| eines Vektors gibt seine Länge an: |v| = √(v₁² + v₂² + v₃²). Dies ist die Verallgemeinerung des Satzes des Pythagoras auf den Raum. In der Physik entspricht der Betrag z. B. der Geschwindigkeit bei einem Geschwindigkeitsvektor oder der Kraft bei einem Kraftvektor.',
    quelle: 'Wikipedia: Euklidische Norm',
    url: 'https://de.wikipedia.org/wiki/Euklidische_Norm',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const [x, y, z, mag] = pick(rng, VEC3)
      const sx = rng() < 0.5 ? -x : x
      const sy = rng() < 0.5 ? -y : y
      const sz = rng() < 0.5 ? -z : z
      return valueTask({
        question: `Berechne den Betrag (die Länge) des Vektors v = ${vec([sx, sy, sz])}.`,
        answerKind: 'integer',
        value: mag,
        solution: `${mag}`,
        explanation: `|v| = √(${sq(sx)} + ${sq(sy)} + ${sq(sz)}) = √(${sx * sx} + ${sy * sy} + ${sz * sz}) = √${sx * sx + sy * sy + sz * sz} = ${mag}.`,
      })
    },
    (rng: Rng) => {
      // 2D Pythagorean triples for a clear arrow sketch
      const triples: Array<[number, number, number]> = [
        [3, 4, 5],
        [5, 12, 13],
        [6, 8, 10],
        [8, 15, 17],
      ]
      const [x, y, mag] = pick(rng, triples)
      const sx = rng() < 0.5 ? -x : x
      const sy = rng() < 0.5 ? -y : y
      return visualTask({
        question: `Der Vektor v = (${minus(sx)}; ${minus(sy)}) ist skizziert. Berechne |v|.`,
        answerKind: 'integer',
        value: mag,
        solution: `${mag}`,
        explanation: `|v| = √(${sq(sx)} + ${sq(sy)}) = ${mag}.`,
        visualContent: generateVectorArrowsSvg({
          vectors: [{ x: sx, y: sy, label: 'v' }],
        }),
      })
    },
  ),
}

// ---------------------------------------------------------------------------
// Lernbereich 3 — Binomialverteilte Zufallsgrößen
// ---------------------------------------------------------------------------

const binom = (n: number, k: number): number => {
  let r = 1
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i
  return Math.round(r)
}

const binomialverteilung: Topic = {
  id: 'k1112-lb3-binomialverteilung',
  title: 'Binomialverteilung: P(X = k)',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Binomialverteilung', 'Wahrscheinlichkeit', 'Bernoulli', 'P(X=k)', 'Stochastik'],
  fachwissen: {
    text: 'Die Binomialverteilung B(n, p) beschreibt die Wahrscheinlichkeit, bei n unabhängigen Versuchen (mit je Trefferwahrscheinlichkeit p) genau k Treffer zu erzielen: P(X=k) = C(n,k)·pᵏ·(1−p)ⁿ⁻ᵏ. Voraussetzung: Die Versuche sind unabhängig und die Trefferwahrscheinlichkeit bleibt konstant. Der Erwartungswert ist E(X) = n·p.',
    quelle: 'Wikipedia: Binomialverteilung',
    url: 'https://de.wikipedia.org/wiki/Binomialverteilung',
  },
  generate: (rng: Rng) => {
    const n = pick(rng, [4, 5, 6])
    const p = pick(rng, [0.1, 0.2, 0.25, 0.5])
    const mean = Math.round(n * p)
    const k = Math.max(0, Math.min(n, mean + randInt(rng, -1, 1)))
    const c = binom(n, k)
    const raw = c * p ** k * (1 - p) ** (n - k)
    const value = roundTo(raw, 4)
    return valueTask({
      question: `Eine Zufallsgröße ist binomialverteilt mit n = ${n} und p = ${formatDe(p)}. Berechne P(X = ${k}) (auf vier Nachkommastellen).`,
      answerKind: 'decimal',
      value,
      eps: 0.0005,
      solution: formatDe(value),
      explanation: `P(X = ${k}) = C(${n}, ${k}) · ${formatDe(p)}^${k} · ${formatDe(1 - p)}^${n - k} = ${c} · ${formatDe(p ** k)} · ${formatDe((1 - p) ** (n - k))} ≈ ${formatDe(value)}.`,
    })
  },
}

const erwartungswertBinom: Topic = {
  id: 'k1112-lb3-erwartungswert-binom',
  title: 'Erwartungswert der Binomialverteilung',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Binomialverteilung', 'Erwartungswert', 'E(X)', 'Stochastik', 'n mal p'],
  fachwissen: {
    text: 'Der Erwartungswert der Binomialverteilung B(n, p) ist E(X) = n·p. Er gibt an, wie viele Treffer man im Mittel erwartet. Beispiel: Wirft man einen fairen Würfel 60-mal, erwartet man E = 60·(1/6) = 10 Sechsen. Die Standardabweichung beträgt σ = √(n·p·(1−p)).',
    quelle: 'Wikipedia: Binomialverteilung',
    url: 'https://de.wikipedia.org/wiki/Binomialverteilung',
  },
  generate: (rng: Rng) => {
    const n = randInt(rng, 5, 50)
    const p = pick(rng, [0.1, 0.2, 0.25, 0.5])
    const value = roundTo(n * p, 2)
    return valueTask({
      question: `Eine Zufallsgröße ist binomialverteilt mit n = ${n} und p = ${formatDe(p)}. Berechne den Erwartungswert E(X).`,
      answerKind: 'decimal',
      value,
      solution: formatDe(value),
      explanation: `E(X) = n · p = ${n} · ${formatDe(p)} = ${formatDe(value)}.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Grade — Jahrgangsstufe 11/12, Grundkurs (Gymnasium Mathematik, Sachsen)
// ---------------------------------------------------------------------------

export const klasse11_12: Grade = {
  id: 'jgs-11-12',
  title: 'Jahrgangsstufe 11/12 (Grundkurs)',
  areas: [
    {
      id: 'lb1',
      title: 'Differentialrechnung',
      ustd: 52,
      topics: [
        ableitungStelle,
        nullstelleLinear,
        k1112Extremum,
        k1112AbleitungExp,
        k1112Differenzenquotient,
        ...math1112GraphicReviews.filter((t) => !t.id.includes('integral')),
      ],
    },
    {
      id: 'lb2',
      title: 'Matrizen',
      ustd: 6,
      topics: [k1112MatrixMult, k1112MatrixLgs, k1112MatrixAdd, k1112MatrixDet],
    },
    {
      id: 'lb3',
      title: 'Vektoren, Geraden und Ebenen',
      ustd: 32,
      topics: [
        skalarprodukt,
        betragVektor,
        k1112VektorAdd,
        k1112GeradePunkt,
        k1112LageGeraden,
      ],
    },
    {
      id: 'lb4',
      title: 'Binomialverteilte Zufallsgrößen',
      ustd: 18,
      topics: [
        binomialverteilung,
        erwartungswertBinom,
        k1112BinomKumuliert,
        k1112BinomSigma,
      ],
    },
    {
      id: 'lb5',
      title: 'Integralrechnung',
      ustd: 28,
      topics: [
        bestimmtesIntegral,
        k1112Stammfunktion,
        k1112FlaecheIntegral,
        ...math1112GraphicReviews.filter((t) => t.id.includes('integral')),
      ],
    },
    {
      id: 'lb6',
      title: 'Beurteilende Statistik',
      ustd: 12,
      topics: [k1112Stichprobenmittel, k1112Hypothesentest, k1112KonfidenzIdee,
        ...MATH_LEHRPLAN_TEILASPEKTE_BY_GRADE["math11_12"].filter((x) => x.areaId === "lb6").map((x) => x.topic),
      ],
    },
    {
      id: 'lb7',
      title: 'Abstände und Winkel',
      ustd: 24,
      topics: [
        k1112Orthogonal,
        k1112WinkelVektoren,
        k1112AbstandPunktGerade,
      ],
    },
    {
      id: 'lb8',
      title: 'Weitere Anwendungen',
      ustd: 20,
      topics: [
        k1112ExtremwertAnwendung,
        k1112SpiegelungEbene,
        k1112VolumenOptimierung,
      ],
    },
  ],
}
