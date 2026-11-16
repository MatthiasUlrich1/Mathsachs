/**
 * JGS 11/12 Mathematik — zusätzliche Neu-(Prüfung)-Banken nach Bettermarks.
 * Sibling-IDs: `${parentId}__neu`, neu:true, released:false.
 * Bestehende `__grafik` bleiben parallel. Originale in math11_12.ts unberührt.
 * Händisch erstellt; keine Bulk-Skripte.
 */
import { pick, randInt, type Rng } from '../lib/rng'
import { formatDe, roundTo } from '../lib/num'
import {
  generateFunctionGraphSvg,
  generateSpinnerSvg,
  generateVectorArrowsSvg,
} from '../lib/geometrySvg'
import { shuffleChoices } from './biologieHelpers'
import {
  choicePickTask,
  coordinateClickTask,
  mixedVariants,
  paramSliderTask,
  valueTask,
  visualTask,
} from './taskHelpers'
import { asNeuTopic } from './neuTopic'
import type { Topic } from './types'

// ---------------------------------------------------------------------------
// Lokale Helfer (bewusst nicht aus math11_12.ts importiert — Zirkelimport-Gefahr,
// da math11_12.ts seinerseits math1112NeuLb1..Lb3 importiert).
// ---------------------------------------------------------------------------

const nonZero = (rng: Rng, min: number, max: number): number => {
  let v = 0
  while (v === 0) v = randInt(rng, min, max)
  return v
}

/** A single number with a real minus sign for negatives (for display). */
const minus = (n: number): string => (n < 0 ? `−${Math.abs(n)}` : `${n}`)

/** Format a vector tuple as "(x; y; z)" with real minus signs. */
const vec = (v: number[]): string => `(${v.map(minus).join('; ')})`

/** A squared value, wrapping negatives in parentheses: 7² or (−4)². */
const sq = (n: number): string => (n < 0 ? `(−${Math.abs(n)})²` : `${n}²`)

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

/** n über k (Binomialkoeffizient). */
const binom = (n: number, k: number): number => {
  let r = 1
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i
  return Math.round(r)
}

/** Fisher-Yates-Shuffle mit Rng (für Glücksrad-Sektoren). */
function shuffleArr<T>(rng: Rng, items: T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

/** Glücksrad-Sektoren für eine Trefferwahrscheinlichkeit p (10/5/4/2 gleich große Felder). */
function trialSpinnerPayoffs(rng: Rng, p: number): string[] {
  const denom = p === 0.1 ? 10 : p === 0.2 ? 5 : p === 0.25 ? 4 : 2
  const hits = Math.round(p * denom)
  const arr: string[] = []
  for (let i = 0; i < denom; i++) arr.push(i < hits ? 'Treffer' : 'Niete')
  return shuffleArr(rng, arr)
}

// ---------------------------------------------------------------------------
// Lernbereich 1 — Differential- und Integralrechnung
// ---------------------------------------------------------------------------

const ableitungStelleNeu: Topic = asNeuTopic('k1112-lb1-ableitung-stelle', {
  id: 'k1112-lb1-ableitung-stelle__neu',
  title: 'Ableitung: Extremstelle einer Parabel bestimmen',
  hint: "An der Extremstelle gilt f'(x) = 0: Löse 2ax + b = 0 nach x auf.",
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Ableitung', 'Extremstelle', 'notwendige Bedingung', 'Scheitelpunkt', "f'(x)=0"],
  fachwissen: {
    text: "An einer Extremstelle (Hoch- oder Tiefpunkt) ist die Steigung der Tangente null, es gilt also die notwendige Bedingung f'(x) = 0. Bei einer quadratischen Funktion f(x) = ax² + bx + c liefert das Lösen von 2ax + b = 0 die x-Koordinate des Scheitelpunkts: x = −b : (2a).",
    quelle: 'Wikipedia: Extremwert',
    url: 'https://de.wikipedia.org/wiki/Extremwert',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = pick(rng, [-1, 1, 2])
      const x0 = nonZero(rng, -2, 2)
      const b = -2 * a * x0
      const c = randInt(rng, -3, 3)
      const fStr = `f(x) = ${firstTerm(a, 'x²')}${term(b, 'x')}${term(c, '')}`
      return valueTask({
        question: `Gegeben ist ${fStr}. Bestimme die x-Koordinate der Extremstelle (dort, wo f'(x) = 0 ist).`,
        answerKind: 'integer',
        value: x0,
        solution: `x = ${x0}`,
        explanation: `f'(x) = ${firstTerm(2 * a, 'x')}${term(b, '')}. Setze f'(x) = 0: ${2 * a}x ${b < 0 ? `− ${Math.abs(b)}` : `+ ${b}`} = 0 ⇒ x = ${x0}.`,
        dedupeKey: `k1112neuablextr-tippen:${a}:${x0}:${c}`,
      })
    },
    (rng: Rng) => {
      const a = pick(rng, [-1, 1, 2])
      const x0 = nonZero(rng, -2, 2)
      const b = -2 * a * x0
      const c = randInt(rng, -3, 3)
      const fStr = `f(x) = ${firstTerm(a, 'x²')}${term(b, 'x')}${term(c, '')}`
      const correct = `${x0}`
      const wrong1 = `${-x0}` // Vorzeichenfehler beim Umstellen
      const wrong2 = `${2 * x0}` // Faktor 2 im Nenner vergessen (x = −b/a statt −b/(2a))
      const wrong3 = `${c}` // Funktionswert c statt x-Koordinate angegeben
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Gegeben ist ${fStr}. Welche x-Koordinate hat die Extremstelle?`,
        choices,
        correct,
        solution: `x = ${x0}`,
        explanation: `f'(x) = ${firstTerm(2 * a, 'x')}${term(b, '')} = 0 ⇒ x = ${x0}.`,
        dedupeKey: `k1112neuablextr-mc:${a}:${x0}:${c}`,
      })
    },
    (rng: Rng) => {
      const a = pick(rng, [-1, 1, 2])
      const x0 = nonZero(rng, -2, 2)
      const b = -2 * a * x0
      const c = randInt(rng, -3, 3)
      const y0 = a * x0 * x0 + b * x0 + c
      const yLo = Math.min(-7, y0 - 3, c - 3)
      const yHi = Math.max(7, y0 + 3, c + 3)
      return coordinateClickTask({
        question: `Der Graph von f(x) = ${firstTerm(a, 'x²')}${term(b, 'x')}${term(c, '')} ist gezeichnet. Tippe den Scheitelpunkt (die Extremstelle) an.`,
        x: x0,
        y: y0,
        solution: `(${x0}|${y0})`,
        explanation: `f'(x) = ${firstTerm(2 * a, 'x')}${term(b, '')} = 0 ⇒ x = ${x0}. Einsetzen: f(${x0}) = ${y0}. Der Scheitelpunkt liegt bei (${x0}|${y0}).`,
        xRange: [-5, 5],
        yRange: [yLo, yHi],
        instruction: 'Tippe den Scheitelpunkt des Graphen:',
        visualContent: generateFunctionGraphSvg({
          f: (x) => a * x * x + b * x + c,
          xRange: [-5, 5],
          yRange: [yLo, yHi],
        }),
      })
    },
  ),
})

const nullstelleLinearNeu: Topic = asNeuTopic('k1112-lb1-nullstelle-linear', {
  id: 'k1112-lb1-nullstelle-linear__neu',
  title: 'Nullstelle einer linearen Funktion: Parameter bestimmen',
  hint: 'Setze x = x₀ in f(x) = mx + n ein und löse nach n auf: n = −m·x₀.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Nullstelle', 'lineare Funktion', 'Parameter', 'Gleichung', 'y-Achsenabschnitt'],
  fachwissen: {
    text: 'Soll eine lineare Funktion f(x) = mx + n an einer vorgegebenen Stelle x₀ ihre Nullstelle haben, muss f(x₀) = 0 gelten. Setzt man x₀ ein und löst nach n auf, erhält man n = −m · x₀. So lässt sich der y-Achsenabschnitt passend zu einer gewünschten Nullstelle bestimmen — die Umkehrung des üblichen Nullstellen-Berechnens.',
    quelle: 'Wikipedia: Nullstelle',
    url: 'https://de.wikipedia.org/wiki/Nullstelle',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const m = nonZero(rng, -6, 6)
      const x0 = nonZero(rng, -6, 6)
      const n = -m * x0
      return valueTask({
        question: `Für welchen Wert von n ist x₀ = ${x0} die Nullstelle der Funktion f(x) = ${m}x + n?`,
        answerKind: 'integer',
        value: n,
        solution: `n = ${n}`,
        explanation: `Setze x₀ = ${x0} ein und f(x₀) = 0: ${m} · ${x0} + n = 0 ⇒ n = ${-(m * x0)} = ${n}.`,
        dedupeKey: `k1112neunullpar-tippen:${m}:${x0}`,
      })
    },
    (rng: Rng) => {
      const m = nonZero(rng, -6, 6)
      const x0 = nonZero(rng, -6, 6)
      const n = -m * x0
      const nStr = n < 0 ? `− ${Math.abs(n)}` : `+ ${n}`
      const correct = `${x0}`
      const wrong1 = formatDe(n / m) // Vorzeichen beim Umstellen vergessen: x = n/m statt −n/m
      const wrong2 = `${-m * n}` // multipliziert statt dividiert
      const wrong3 = formatDe(-m / n) // Zähler und Nenner vertauscht
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Bestimme die Nullstelle von f(x) = ${m}x ${nStr}.`,
        choices,
        correct,
        solution: `x = ${x0}`,
        explanation: `${m}x ${nStr} = 0 ⇒ x = ${-n} : ${m} = ${x0}.`,
        dedupeKey: `k1112neunullpar-mc:${m}:${x0}`,
      })
    },
    (rng: Rng) => {
      const m = nonZero(rng, -3, 3)
      const x0 = nonZero(rng, -4, 4)
      const n = -m * x0
      const nStr = n < 0 ? `− ${Math.abs(n)}` : `+ ${n}`
      return paramSliderTask({
        question: `Der Graph von f(x) = ${m}x ${nStr} ist gezeichnet. Stelle am Regler die Nullstelle x₀ ein.`,
        params: [{ id: 'x', label: 'x₀', min: -6, max: 6, step: 1, start: 0 }],
        correct: { x: x0 },
        solution: `x₀ = ${x0}`,
        explanation: `${m}x ${nStr} = 0 ⇒ x = ${x0}.`,
        instruction: 'Stelle die Nullstelle ein:',
        visualContent: generateFunctionGraphSvg({
          f: (x) => m * x + n,
          xRange: [-6, 6],
          yRange: [-14, 14],
        }),
      })
    },
  ),
})

const bestimmtesIntegralNeu: Topic = asNeuTopic('k1112-lb1-bestimmtes-integral', {
  id: 'k1112-lb1-bestimmtes-integral__neu',
  title: 'Bestimmtes Integral: Dreiecksfläche unter einer Geraden',
  hint: 'Die Fläche unter f(x) = mx von 0 bis q ist ein Dreieck: A = (m · q²) : 2.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Integral', 'Dreiecksfläche', 'lineare Funktion', 'Stammfunktion', 'Fläche'],
  fachwissen: {
    text: 'Für eine lineare Funktion f(x) = mx (durch den Ursprung) bildet die Fläche zwischen Graph und x-Achse von 0 bis q ein Dreieck mit den Schenkeln q und m·q. Ihr Flächeninhalt lässt sich sowohl geometrisch (A = ½ · Grundseite · Höhe) als auch über das Integral ∫₀^q mx dx = (m/2)·x² |₀^q berechnen — beide Wege führen zu A = (m · q²) : 2.',
    quelle: 'Wikipedia: Bestimmtes Integral',
    url: 'https://de.wikipedia.org/wiki/Integral#Bestimmtes_Integral',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const m = pick(rng, [2, 4, 6, 8])
      const q = randInt(rng, 3, 6)
      const value = (m * q * q) / 2
      return valueTask({
        question: `Berechne das bestimmte Integral ∫₀^${q} ${m}x dx.`,
        answerKind: 'integer',
        value,
        solution: `${value}`,
        explanation: `Stammfunktion: F(x) = ${m / 2}x². F(${q}) − F(0) = ${m / 2} · ${q}² = ${m / 2} · ${q * q} = ${value}.`,
        dedupeKey: `k1112neuintdreieck-tippen:${m}:${q}`,
      })
    },
    (rng: Rng) => {
      const m = pick(rng, [2, 4, 6, 8])
      const q = randInt(rng, 3, 6)
      const value = (m * q * q) / 2
      const correct = `${value}`
      const wrong1 = `${m * q}` // Rechteck statt Dreieck (Division durch 2 vergessen)
      const wrong2 = `${(m * q) / 2}` // q nicht quadriert
      const wrong3 = `${m * q * q}` // Division durch 2 komplett vergessen
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Welchen Wert hat das bestimmte Integral ∫₀^${q} ${m}x dx?`,
        choices,
        correct,
        solution: correct,
        explanation: `F(x) = ${m / 2}x²; F(${q}) − F(0) = ${m / 2} · ${q}² = ${value}.`,
        dedupeKey: `k1112neuintdreieck-mc:${m}:${q}`,
      })
    },
    (rng: Rng) => {
      const m = pick(rng, [2, 4, 6])
      const q = randInt(rng, 3, 5)
      const value = (m * q * q) / 2
      return paramSliderTask({
        question: `Die Fläche unter f(x) = ${m}x von 0 bis ${q} ist markiert. Stelle am Regler den Wert des Integrals ∫₀^${q} ${m}x dx ein.`,
        params: [{ id: 'a', label: 'Fläche', min: 0, max: 80, step: 1, start: 0 }],
        correct: { a: value },
        solution: `${value}`,
        explanation: `F(x) = ${m / 2}x²; F(${q}) − F(0) = ${m / 2} · ${q}² = ${value}.`,
        instruction: 'Stelle den Flächeninhalt ein:',
        visualContent: generateFunctionGraphSvg({
          f: (x) => m * x,
          shade: { a: 0, b: q },
          xRange: [-1, q + 2],
          yRange: [-1, m * q + 3],
        }),
      })
    },
  ),
})

export const math1112NeuLb1: Topic[] = [
  ableitungStelleNeu,
  nullstelleLinearNeu,
  bestimmtesIntegralNeu,
]

// ---------------------------------------------------------------------------
// Lernbereich 2 — Vektoren, Geraden und Ebenen
// ---------------------------------------------------------------------------

const skalarproduktNeu: Topic = asNeuTopic('k1112-lb2-skalarprodukt', {
  id: 'k1112-lb2-skalarprodukt__neu',
  title: 'Skalarprodukt: Orthogonalität von Vektoren',
  hint: 'Zwei Vektoren stehen senkrecht zueinander, wenn ihr Skalarprodukt null ist: a · b = 0.',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Skalarprodukt', 'Orthogonalität', 'senkrecht', 'Vektoren', 'analytische Geometrie'],
  fachwissen: {
    text: 'Zwei Vektoren a und b stehen genau dann senkrecht (orthogonal) zueinander, wenn ihr Skalarprodukt null ist: a · b = 0. Diese Orthogonalitätsbedingung lässt sich nutzen, um eine fehlende Vektorkomponente so zu bestimmen, dass zwei Vektoren senkrecht zueinander sind — eine häufige Fragestellung bei Geraden- und Ebenengleichungen.',
    quelle: 'Wikipedia: Skalarprodukt',
    url: 'https://de.wikipedia.org/wiki/Skalarprodukt',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const p = nonZero(rng, -5, 5)
      const q = nonZero(rng, -5, 5)
      const k = nonZero(rng, -3, 3)
      const x = q * k
      const t = -p * k
      return valueTask({
        question: `Die Vektoren a = ${vec([p, q])} und b = (${minus(x)}; t) sollen senkrecht zueinander stehen (a · b = 0). Bestimme t.`,
        answerKind: 'integer',
        value: t,
        solution: `t = ${t}`,
        explanation: `a · b = 0 ⇒ ${minus(p)}·${minus(x)} + ${minus(q)}·t = 0 ⇒ ${p * x} + ${q}t = 0 ⇒ t = ${-(p * x)} : ${q} = ${t}.`,
        dedupeKey: `k1112neuskalortho-tippen:${p}:${q}:${k}`,
      })
    },
    // V2 MC — Orthogonalität im Raum prüfen (Skalarprodukt gleich null?)
    (rng: Rng) => {
      const wantOrtho = rng() < 0.5
      for (let attempt = 0; attempt < 400; attempt++) {
        const a = [nonZero(rng, -5, 5), nonZero(rng, -5, 5), nonZero(rng, -5, 5)]
        const b1 = nonZero(rng, -5, 5)
        const b2 = nonZero(rng, -5, 5)
        const rest = -(a[0]! * b1 + a[1]! * b2)
        if (rest % a[2]! !== 0) continue
        let b3 = rest / a[2]!
        if (!wantOrtho) b3 += pick(rng, [-2, -1, 1, 2])
        if (b3 === 0 || Math.abs(b3) > 9) continue
        const b = [b1, b2, b3]
        const value = a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!
        if ((value === 0) !== wantOrtho) continue
        const correct = value === 0 ? 'Ja, senkrecht' : 'Nein, nicht senkrecht'
        return choicePickTask({
          question: `Stehen die Vektoren a = ${vec(a)} und b = ${vec(b)} senkrecht zueinander?`,
          choices: ['Ja, senkrecht', 'Nein, nicht senkrecht'],
          correct,
          solution: correct,
          explanation: `a · b = ${minus(a[0]!)}·${minus(b[0]!)} + ${minus(a[1]!)}·${minus(b[1]!)} + ${minus(a[2]!)}·${minus(b[2]!)} = ${value}. ${value === 0 ? 'Das Skalarprodukt ist 0, die Vektoren stehen also senkrecht zueinander.' : `Das Skalarprodukt ist ${value} und damit ungleich 0, die Vektoren stehen nicht senkrecht zueinander.`}`,
          dedupeKey: `k1112neuskalortho-ja:${a.join(',')}:${b.join(',')}`,
        })
      }
      throw new Error('skalarprodukt: keine passende Vektorpaarung')
    },
    (rng: Rng) => {
      const p = nonZero(rng, -4, 4)
      const q = nonZero(rng, -4, 4)
      const bx = -q
      const by = p
      return coordinateClickTask({
        question: `Der Vektor a = (${minus(p)}; ${minus(q)}) ist eingezeichnet (vom Ursprung aus). Tippe den Endpunkt eines Vektors b vom Ursprung aus, der senkrecht zu a steht (a · b = 0).`,
        x: bx,
        y: by,
        solution: `(${bx}|${by})`,
        explanation: `a · b = 0 ⇒ ${minus(p)}·b₁ + ${minus(q)}·b₂ = 0. Ein möglicher senkrechter Vektor ist b = (${minus(bx)}; ${minus(by)}) (Komponenten vertauscht, ein Vorzeichen gewechselt).`,
        xRange: [-6, 6],
        yRange: [-6, 6],
        instruction: 'Tippe den Endpunkt von b:',
        visualContent: generateVectorArrowsSvg({
          vectors: [{ x: p, y: q, label: 'a' }],
        }),
      })
    },
  ),
})

const VEC3_NEU: ReadonlyArray<readonly [number, number, number, number]> = [
  [1, 2, 2, 3],
  [2, 3, 6, 7],
  [1, 4, 8, 9],
  [2, 6, 9, 11],
  [4, 4, 7, 9],
  [3, 4, 12, 13],
]

const betragVektorNeu: Topic = asNeuTopic('k1112-lb2-betrag-vektor', {
  id: 'k1112-lb2-betrag-vektor__neu',
  title: 'Vektor: fehlende Komponente aus dem Betrag bestimmen',
  hint: 'Stelle |v|² = x² + y² + z² nach z um: z = √(|v|² − x² − y²).',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Betrag', 'Vektor', 'fehlende Komponente', 'Umstellen', 'Pythagoras'],
  fachwissen: {
    text: 'Ist der Betrag |v| eines Vektors sowie zwei seiner drei Komponenten bekannt, lässt sich die fehlende Komponente über die umgestellte Formel |v|² = x² + y² + z² bestimmen: z = √(|v|² − x² − y²). Dies ist die räumliche Verallgemeinerung des Satzes des Pythagoras, angewendet in umgekehrter Richtung.',
    quelle: 'Wikipedia: Euklidische Norm',
    url: 'https://de.wikipedia.org/wiki/Euklidische_Norm',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const [x, y, z, mag] = pick(rng, VEC3_NEU)
      const sx = rng() < 0.5 ? -x : x
      const sy = rng() < 0.5 ? -y : y
      return valueTask({
        question: `Ein Vektor v = (${minus(sx)}; ${minus(sy)}; z) hat den Betrag |v| = ${mag} (z > 0). Bestimme z.`,
        answerKind: 'integer',
        value: z,
        solution: `z = ${z}`,
        explanation: `z² = |v|² − x² − y² = ${mag}² − ${sq(sx)} − ${sq(sy)} = ${mag * mag} − ${sx * sx} − ${sy * sy} = ${z * z} ⇒ z = ${z}.`,
        dedupeKey: `k1112neubetragfehl-tippen:${x}:${y}:${z}:${mag}:${sx}:${sy}`,
      })
    },
    (rng: Rng) => {
      const [x, y, z, mag] = pick(rng, VEC3_NEU)
      const sx = rng() < 0.5 ? -x : x
      const sy = rng() < 0.5 ? -y : y
      const sz = rng() < 0.5 ? -z : z
      const correct = `${mag}`
      const wrong1 = `${sx * sx + sy * sy + sz * sz}` // Wurzel vergessen
      const wrong2 = `${Math.abs(sx) + Math.abs(sy) + Math.abs(sz)}` // Beträge addiert statt Quadratsumme-Wurzel
      const wrong3 = `${Math.round(Math.sqrt(sx * sx + sy * sy))}` // eine Komponente vergessen
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Berechne den Betrag des Vektors v = ${vec([sx, sy, sz])}.`,
        choices,
        correct,
        solution: correct,
        explanation: `|v| = √(${sq(sx)} + ${sq(sy)} + ${sq(sz)}) = √${sx * sx + sy * sy + sz * sz} = ${mag}.`,
        dedupeKey: `k1112neubetragfehl-mc:${x}:${y}:${z}:${sx}:${sy}:${sz}`,
      })
    },
    (rng: Rng) => {
      const triples: Array<[number, number, number]> = [
        [3, 4, 5],
        [5, 12, 13],
        [6, 8, 10],
        [8, 15, 17],
      ]
      const [vx, vy, r0] = pick(rng, triples)
      const k0 = randInt(rng, 1, 4)
      const target = r0 * k0
      return paramSliderTask({
        question: `Der Vektor v = (${vx}; ${vy}) mit |v| = ${r0} ist eingezeichnet. Stelle am Regler den Streckfaktor k ein, sodass der gestreckte Vektor k·v den Betrag ${target} hat.`,
        params: [{ id: 'k', label: 'k', min: 1, max: 6, step: 1, start: 1 }],
        correct: { k: k0 },
        solution: `k = ${k0}`,
        explanation: `|k·v| = k·|v| = k·${r0} = ${target} ⇒ k = ${target} : ${r0} = ${k0}.`,
        instruction: 'Stelle den Streckfaktor k ein:',
        visualContent: generateVectorArrowsSvg({
          vectors: [{ x: vx, y: vy, label: 'v' }],
        }),
      })
    },
  ),
})

export const math1112NeuLb2: Topic[] = [skalarproduktNeu, betragVektorNeu]

// ---------------------------------------------------------------------------
// Lernbereich 3 — Binomialverteilte Zufallsgrößen
// ---------------------------------------------------------------------------

const binomialverteilungNeu: Topic = asNeuTopic('k1112-lb3-binomialverteilung', {
  id: 'k1112-lb3-binomialverteilung__neu',
  title: 'Binomialverteilung: Gegenereignisse und Einzelfall',
  hint: 'P(X=0) = (1−p)ⁿ (kein Treffer); P(X=n) = pⁿ (nur Treffer); P(X=1) = n·p·(1−p)ⁿ⁻¹.',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Binomialverteilung', 'Gegenereignis', 'Wahrscheinlichkeit', 'Bernoulli', 'Stochastik'],
  fachwissen: {
    text: 'Bei einer binomialverteilten Zufallsgröße lassen sich die Randfälle besonders einfach berechnen: Die Wahrscheinlichkeit, dass bei n Versuchen kein einziger Treffer auftritt, ist P(X=0) = (1−p)ⁿ. Die Wahrscheinlichkeit, dass alle n Versuche treffen, ist P(X=n) = pⁿ. In beiden Fällen ist der Binomialkoeffizient C(n,0) = C(n,n) = 1, sodass er in der Formel keine Rolle spielt.',
    quelle: 'Wikipedia: Binomialverteilung',
    url: 'https://de.wikipedia.org/wiki/Binomialverteilung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const n = pick(rng, [4, 5, 6])
      const p = pick(rng, [0.1, 0.2, 0.25, 0.5])
      const value = roundTo((1 - p) ** n, 4)
      return valueTask({
        question: `Eine Zufallsgröße ist binomialverteilt mit n = ${n} und p = ${formatDe(p)}. Berechne die Wahrscheinlichkeit, dass kein einziger Treffer auftritt: P(X = 0) (auf vier Nachkommastellen).`,
        answerKind: 'decimal',
        value,
        eps: 0.0005,
        solution: formatDe(value),
        explanation: `P(X = 0) = (1 − p)ⁿ = ${formatDe(1 - p)}^${n} ≈ ${formatDe(value)} (der Binomialkoeffizient C(${n}, 0) = 1 entfällt).`,
        dedupeKey: `k1112neubinomrand-tippen:${n}:${p}`,
      })
    },
    (rng: Rng) => {
      const n = pick(rng, [4, 5, 6])
      const p = pick(rng, [0.1, 0.2, 0.25, 0.5])
      const value = roundTo(p ** n, 4)
      const correct = formatDe(value)
      const wrong1 = formatDe(roundTo((1 - p) ** n, 4)) // mit P(X=0) verwechselt
      const wrong2 = formatDe(roundTo(n * p, 4)) // mit dem Erwartungswert verwechselt
      const wrong3 = formatDe(roundTo(binom(n, n - 1) * p ** (n - 1) * (1 - p), 4)) // P(X=n−1) statt P(X=n)
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Eine Zufallsgröße ist binomialverteilt mit n = ${n} und p = ${formatDe(p)}. Wie groß ist die Wahrscheinlichkeit, dass alle ${n} Versuche treffen: P(X = ${n})?`,
        choices,
        correct,
        solution: correct,
        explanation: `P(X = ${n}) = pⁿ = ${formatDe(p)}^${n} ≈ ${formatDe(value)} (C(${n}, ${n}) = 1).`,
        dedupeKey: `k1112neubinomrand-mc:${n}:${p}`,
      })
    },
    (rng: Rng) => {
      const n = pick(rng, [3, 4, 5])
      const p = pick(rng, [0.1, 0.2, 0.25, 0.5])
      const c = binom(n, 1)
      const value = roundTo(c * p * (1 - p) ** (n - 1), 4)
      return visualTask({
        question: `Das Glücksrad zeigt einen einzelnen Versuch mit Trefferwahrscheinlichkeit p = ${formatDe(p)}. Bei n = ${n} unabhängigen Versuchen: Berechne P(X = 1) (genau ein Treffer).`,
        answerKind: 'decimal',
        value,
        eps: 0.0005,
        solution: formatDe(value),
        explanation: `P(X = 1) = C(${n}, 1) · p¹ · (1−p)^${n - 1} = ${n} · ${formatDe(p)} · ${formatDe(1 - p)}^${n - 1} ≈ ${formatDe(value)}.`,
        visualContent: generateSpinnerSvg({
          payoffs: trialSpinnerPayoffs(rng, p),
        }),
      })
    },
  ),
})

const erwartungswertBinomNeu: Topic = asNeuTopic('k1112-lb3-erwartungswert-binom', {
  id: 'k1112-lb3-erwartungswert-binom__neu',
  title: 'Erwartungswert der Binomialverteilung: n bestimmen',
  hint: 'Stelle E(X) = n · p nach n um: n = E(X) : p.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Erwartungswert', 'Binomialverteilung', 'umstellen', 'n bestimmen', 'Stochastik'],
  fachwissen: {
    text: 'Sind der Erwartungswert E(X) und die Trefferwahrscheinlichkeit p einer binomialverteilten Zufallsgröße bekannt, lässt sich die Anzahl der Versuche n bestimmen, indem die Formel E(X) = n · p nach n umgestellt wird: n = E(X) : p. So lässt sich z. B. aus einer erwarteten Trefferzahl auf die nötige Versuchsanzahl schließen.',
    quelle: 'Wikipedia: Binomialverteilung',
    url: 'https://de.wikipedia.org/wiki/Binomialverteilung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const p = pick(rng, [0.1, 0.2, 0.25, 0.5])
      const mult = p === 0.1 ? 10 : p === 0.2 ? 5 : p === 0.25 ? 4 : 2
      const k = randInt(rng, 1, 5)
      const n = mult * k
      const value = n * p
      return valueTask({
        question: `Eine binomialverteilte Zufallsgröße hat die Trefferwahrscheinlichkeit p = ${formatDe(p)} und den Erwartungswert E(X) = ${formatDe(value)}. Wie groß ist n?`,
        answerKind: 'integer',
        value: n,
        solution: `n = ${n}`,
        explanation: `E(X) = n · p ⇒ n = E(X) : p = ${formatDe(value)} : ${formatDe(p)} = ${n}.`,
        dedupeKey: `k1112neuewbinomn-tippen:${p}:${n}`,
      })
    },
    (rng: Rng) => {
      const n = randInt(rng, 5, 50)
      const p = pick(rng, [0.1, 0.2, 0.25, 0.5])
      const value = roundTo(n * p, 2)
      const correct = formatDe(value)
      const wrong1 = formatDe(roundTo(n + p, 2)) // addiert statt multipliziert
      const wrong2 = formatDe(roundTo(n * p * (1 - p), 2)) // mit der Varianz verwechselt
      const wrong3 = formatDe(n) // p vergessen (nur n angegeben)
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Eine Zufallsgröße ist binomialverteilt mit n = ${n} und p = ${formatDe(p)}. Wie groß ist der Erwartungswert E(X)?`,
        choices,
        correct,
        solution: correct,
        explanation: `E(X) = n · p = ${n} · ${formatDe(p)} = ${formatDe(value)}.`,
        dedupeKey: `k1112neuewbinomn-mc:${n}:${p}`,
      })
    },
    (rng: Rng) => {
      const p = pick(rng, [0.1, 0.2, 0.25, 0.5])
      const mult = p === 0.1 ? 10 : p === 0.2 ? 5 : p === 0.25 ? 4 : 2
      const k = randInt(rng, 1, 5)
      const n = mult * k
      const value = k
      return paramSliderTask({
        question: `Das Glücksrad zeigt einen einzelnen Versuch mit Trefferwahrscheinlichkeit p = ${formatDe(p)}. Bei n = ${n} Versuchen: Stelle am Regler den Erwartungswert E(X) ein.`,
        params: [{ id: 'e', label: 'E(X)', min: 0, max: 10, step: 1, start: 0 }],
        correct: { e: value },
        solution: `E(X) = ${value}`,
        explanation: `E(X) = n · p = ${n} · ${formatDe(p)} = ${value}.`,
        instruction: 'Stelle E(X) ein:',
        visualContent: generateSpinnerSvg({
          payoffs: trialSpinnerPayoffs(rng, p),
        }),
      })
    },
  ),
})

export const math1112NeuLb3: Topic[] = [binomialverteilungNeu, erwartungswertBinomNeu]

export const math1112NeuTopics: Topic[] = [
  ...math1112NeuLb1,
  ...math1112NeuLb2,
  ...math1112NeuLb3,
]
