/**
 * Lehrplan-Lückenfüllung Mathe Gym Sachsen — Fokus Klasse 8–12.
 * Quelle: Lehrplan Gymnasium Mathematik Sachsen 2004/…/2021
 * (schulportal.sachsen.de/lplandb/lehrplan/461).
 *
 * Eigene Aufgabenformulierungen; keine Lehrwerks-Textübernahmen.
 */
import { pick, randInt, type Rng } from '../lib/rng'
import { formatDe, roundTo } from '../lib/num'
import { choicePickTask, valueTask } from './taskHelpers'
import type { Topic } from './types'

const num = (n: number): string => (n < 0 ? `(−${Math.abs(n)})` : `${n}`)
const nonZero = (rng: Rng, min: number, max: number): number => {
  let v = 0
  while (v === 0) v = randInt(rng, min, max)
  return v
}
const minus = (n: number): string => (n < 0 ? `−${Math.abs(n)}` : `${n}`)
const vec2 = (v: number[]): string => `(${v.map(minus).join('; ')})`
const vec3 = (v: number[]): string => `(${v.map(minus).join('; ')})`

const binom = (n: number, k: number): number => {
  let r = 1
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i
  return Math.round(r)
}

const term = (coeff: number, suffix: string): string => {
  if (coeff === 0) return ''
  const sign = coeff < 0 ? '− ' : '+ '
  const mag = Math.abs(coeff) === 1 && suffix ? '' : `${Math.abs(coeff)}`
  return ` ${sign}${mag}${suffix}`
}

const firstTerm = (coeff: number, suffix: string): string => {
  if (Math.abs(coeff) === 1 && suffix) return coeff < 0 ? `−${suffix}` : suffix
  return `${coeff < 0 ? `−${Math.abs(coeff)}` : coeff}${suffix}`
}

// =============================================================================
// Klasse 8 — Ergänzungen
// =============================================================================

export const k8BinomischeFormel: Topic = {
  id: 'k8-lb1-binomisch',
  title: 'Binomische Formel: (a±b)² auswerten',
  hint: '(a±b)² = a² ± 2ab + b².',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['binomische Formel', 'Quadrat', 'Term', 'ausmultiplizieren'],
  fachwissen: {
    text: 'Die ersten beiden binomischen Formeln lauten (a+b)² = a²+2ab+b² und (a−b)² = a²−2ab+b². Die dritte lautet (a+b)(a−b)=a²−b². Sie verkürzen das Ausmultiplizieren und treten oft in der Geometrie (Flächen) auf.',
    quelle: 'Wikipedia: Binomische Formeln',
    url: 'https://de.wikipedia.org/wiki/Binomische_Formeln',
  },
  generate: (rng: Rng) => {
    const a = randInt(rng, 2, 9)
    const b = randInt(rng, 1, 6)
    const plus = rng() < 0.5
    const value = plus ? (a + b) * (a + b) : (a - b) * (a - b)
    const expr = plus ? `(${a} + ${b})²` : `(${a} − ${b})²`
    const mid = plus ? `+ 2·${a}·${b}` : `− 2·${a}·${b}`
    return valueTask({
      question: `Berechne ${expr}.`,
      answerKind: 'integer',
      value,
      solution: `${value}`,
      explanation: `${expr} = ${a}² ${mid} + ${b}² = ${a * a} ${plus ? '+' : '−'} ${2 * a * b} + ${b * b} = ${value}.`,
    })
  },
}

export const k8Baumdiagramm: Topic = {
  id: 'k8-lb2-zweistufig',
  title: 'Zweistufiger Zufallsversuch (Pfadregel)',
  hint: 'Wahrscheinlichkeiten längs eines Pfades multiplizieren.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Baumdiagramm', 'Pfadregel', 'mehrstufig', 'Wahrscheinlichkeit'],
  fachwissen: {
    text: 'Bei unabhängigen Stufen multipliziert man die Wahrscheinlichkeiten entlang eines Pfades (Pfadregel). Für „entweder dieser oder jener Pfad“ addiert man die Pfadwahrscheinlichkeiten. Baumdiagramme machen mehrstufige Zufallsversuche übersichtlich.',
    quelle: 'Wikipedia: Baumdiagramm',
    url: 'https://de.wikipedia.org/wiki/Baumdiagramm',
  },
  generate: (rng: Rng) => {
    const p1 = pick(rng, [0.2, 0.25, 0.4, 0.5])
    const p2 = pick(rng, [0.2, 0.25, 0.4, 0.5])
    const value = roundTo(p1 * p2, 4)
    return valueTask({
      question: `In einem zweistufigen Zufallsversuch ist P(A) = ${formatDe(p1)} und unabhängig davon P(B) = ${formatDe(p2)}. Berechne P(A und B).`,
      answerKind: 'decimal',
      value,
      eps: 0.0005,
      solution: formatDe(value),
      explanation: `Pfadregel: P(A und B) = P(A)·P(B) = ${formatDe(p1)} · ${formatDe(p2)} = ${formatDe(value)}.`,
    })
  },
}

export const k8ProduktregelAnzahl: Topic = {
  id: 'k8-lb2-abzaehlen',
  title: 'Abzählen mit der Produktregel',
  hint: 'Anzahl der Möglichkeiten = Produkt der Stufen.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Produktregel', 'Abzählen', 'Kombinatorik', 'Möglichkeiten'],
  fachwissen: {
    text: 'Können Entscheidungen nacheinander unabhängig getroffen werden (z. B. Menü: Vorspeise, Hauptgericht, Dessert), ergibt das Produkt der Anzahlen die Gesamtzahl der Möglichkeiten. Das ist die Produktregel der Kombinatorik.',
    quelle: 'Wikipedia: Produktregel (Kombinatorik)',
    url: 'https://de.wikipedia.org/wiki/Kombinatorik',
  },
  generate: (rng: Rng) => {
    const a = randInt(rng, 2, 6)
    const b = randInt(rng, 2, 6)
    const c = randInt(rng, 2, 5)
    const value = a * b * c
    return valueTask({
      question: `Ein Menü bietet ${a} Vorspeisen, ${b} Hauptgerichte und ${c} Desserts. Wie viele verschiedene Menüs gibt es (je eine Wahl pro Gang)?`,
      answerKind: 'integer',
      value,
      solution: `${value}`,
      explanation: `Produktregel: ${a} · ${b} · ${c} = ${value} Menüs.`,
    })
  },
}

// =============================================================================
// Klasse 9 — Ergänzungen
// =============================================================================

export const k9Wurzelgleichung: Topic = {
  id: 'k9-lb1-wurzelgleichung',
  title: 'Einfache Wurzelgleichung',
  hint: 'Quadriere beide Seiten; prüfe die Lösung.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Wurzelgleichung', 'Quadratwurzel', 'lösen', 'Potenzen'],
  fachwissen: {
    text: 'Gleichungen der Form √x = a (a ≥ 0) werden durch Quadrieren gelöst: x = a². Nach dem Quadrieren muss man prüfen, ob die Lösung im Definitionsbereich liegt (Radikand ≥ 0) und die Ausgangsgleichung erfüllt.',
    quelle: 'Wikipedia: Wurzelgleichung',
    url: 'https://de.wikipedia.org/wiki/Wurzelgleichung',
  },
  generate: (rng: Rng) => {
    const a = randInt(rng, 2, 12)
    const value = a * a
    return valueTask({
      question: `Löse die Gleichung √x = ${a} (x ≥ 0).`,
      answerKind: 'integer',
      value,
      solution: `x = ${value}`,
      explanation: `Quadrieren: x = ${a}² = ${value}. Probe: √${value} = ${a}.`,
    })
  },
}

export const k9PotenzfunktionWert: Topic = {
  id: 'k9-lb1-potenzfunktion',
  title: 'Wert einer Potenzfunktion',
  hint: 'Setze x ein und potenziere.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Potenzfunktion', 'Funktionswert', 'Potenz', 'Graph'],
  fachwissen: {
    text: 'Potenzfunktionen haben die Form f(x) = a·xⁿ. Für gerade Exponenten ist der Graph symmetrisch zur y-Achse, für ungerade punktsymmetrisch zum Ursprung. Parameter a streckt bzw. spiegelt den Graphen.',
    quelle: 'Wikipedia: Potenzfunktion',
    url: 'https://de.wikipedia.org/wiki/Potenzfunktion',
  },
  generate: (rng: Rng) => {
    const n = pick(rng, [2, 3])
    const a = pick(rng, [-2, -1, 1, 2, 3])
    const x = nonZero(rng, -4, 4)
    const value = a * x ** n
    return valueTask({
      question: `Gegeben ist f(x) = ${a}·x${n === 2 ? '²' : '³'}. Berechne f(${x}).`,
      answerKind: 'integer',
      value,
      solution: `${value}`,
      explanation: `f(${x}) = ${a} · ${num(x)}${n === 2 ? '²' : '³'} = ${a} · ${x ** n} = ${value}.`,
    })
  },
}

export const k9Hoehensatz: Topic = {
  id: 'k9-lb3-hoehensatz',
  title: 'Höhensatz: Höhe im rechtwinkligen Dreieck',
  hint: 'h² = p · q (Abschnitte der Hypotenuse).',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Höhensatz', 'rechtwinkliges Dreieck', 'Pythagoras', 'Höhe'],
  fachwissen: {
    text: 'Im rechtwinkligen Dreieck gilt der Höhensatz: Das Quadrat der Höhe auf die Hypotenuse ist gleich dem Produkt der Hypotenusenabschnitte: h² = p·q. Zusammen mit Katheten- und Pythagorassatz bildet er die Satzgruppe des Pythagoras.',
    quelle: 'Wikipedia: Satzgruppe des Pythagoras',
    url: 'https://de.wikipedia.org/wiki/Satzgruppe_des_Pythagoras',
  },
  generate: (rng: Rng) => {
    const p = pick(rng, [4, 9, 16, 25])
    const q = pick(rng, [4, 9, 16, 25])
    const h2 = p * q
    const h = Math.round(Math.sqrt(h2))
    if (h * h !== h2) {
      // fallback integer pairs
      const pairs: Array<[number, number, number]> = [
        [4, 9, 6],
        [9, 16, 12],
        [4, 16, 8],
        [9, 4, 6],
      ]
      const [pp, qq, hh] = pick(rng, pairs)
      return valueTask({
        question: `In einem rechtwinkligen Dreieck teilt die Höhe die Hypotenuse in die Abschnitte p = ${pp} und q = ${qq}. Berechne die Höhe h.`,
        answerKind: 'integer',
        value: hh,
        solution: `h = ${hh}`,
        explanation: `h² = p·q = ${pp}·${qq} = ${pp * qq}, also h = √${pp * qq} = ${hh}.`,
      })
    }
    return valueTask({
      question: `In einem rechtwinkligen Dreieck teilt die Höhe die Hypotenuse in die Abschnitte p = ${p} und q = ${q}. Berechne die Höhe h.`,
      answerKind: 'integer',
      value: h,
      solution: `h = ${h}`,
      explanation: `h² = p·q = ${p}·${q} = ${h2}, also h = √${h2} = ${h}.`,
    })
  },
}

export const k9Spannweite: Topic = {
  id: 'k9-lb4-spannweite',
  title: 'Spannweite einer Datenreihe',
  hint: 'Spannweite = Maximum − Minimum.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Spannweite', 'Streuung', 'Daten', 'Maximum', 'Minimum'],
  fachwissen: {
    text: 'Die Spannweite ist ein einfaches Streuungsmaß: größter minus kleinster Wert. Sie ist leicht zu berechnen, aber stark ausreißeranfällig. Ergänzend betrachtet man Varianz und Standardabweichung.',
    quelle: 'Wikipedia: Spannweite (Statistik)',
    url: 'https://de.wikipedia.org/wiki/Spannweite_(Statistik)',
  },
  generate: (rng: Rng) => {
    const n = randInt(rng, 5, 7)
    const nums: number[] = []
    for (let i = 0; i < n; i++) nums.push(randInt(rng, 1, 40))
    const min = Math.min(...nums)
    const max = Math.max(...nums)
    const value = max - min
    return valueTask({
      question: `Berechne die Spannweite von ${nums.join(', ')}.`,
      answerKind: 'integer',
      value,
      solution: `${value}`,
      explanation: `Maximum ${max}, Minimum ${min}: Spannweite = ${max} − ${min} = ${value}.`,
    })
  },
}

export const k9Standardabweichung: Topic = {
  id: 'k9-lb4-standardabweichung',
  title: 'Standardabweichung (kleine Datenreihe)',
  hint: 'σ = √(Mittel der quadrierten Abweichungen vom Mittelwert).',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Standardabweichung', 'Varianz', 'Streuung', 'Daten'],
  fachwissen: {
    text: 'Die Varianz ist der Mittelwert der quadrierten Abweichungen vom arithmetischen Mittel; die Standardabweichung ist die positive Quadratwurzel daraus. Sie misst, wie stark die Werte um den Mittelwert streuen.',
    quelle: 'Wikipedia: Standardabweichung',
    url: 'https://de.wikipedia.org/wiki/Standardabweichung',
  },
  generate: (rng: Rng) => {
    const clean: Array<{ data: number[]; sigma: number }> = [
      { data: [2, 2, 4, 4], sigma: 1 },
      { data: [6, 6, 6, 6], sigma: 0 },
      { data: [1, 5], sigma: 2 },
      { data: [2, 8], sigma: 3 },
      { data: [4, 10], sigma: 3 },
      { data: [0, 8], sigma: 4 },
      { data: [5, 5, 5, 5], sigma: 0 },
      { data: [3, 9], sigma: 3 },
    ]
    const { data, sigma } = pick(rng, clean)
    const mean = data.reduce((a, b) => a + b, 0) / data.length
    return valueTask({
      question: `Berechne die (populationsbezogene) Standardabweichung von ${data.join(', ')}.`,
      answerKind: 'integer',
      value: sigma,
      solution: `${sigma}`,
      explanation: `Mittelwert μ = ${formatDe(mean)}. Varianz = Mittel der quadrierten Abweichungen; σ = √Varianz = ${sigma}.`,
    })
  },
}

// =============================================================================
// Klasse 10 — Ergänzungen
// =============================================================================

export const k10SinusWert: Topic = {
  id: 'k10-lb1-sinus-wert',
  title: 'Sinusfunktion: Funktionswert',
  hint: 'sin(0°)=0, sin(30°)=1/2, sin(90°)=1, …',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Sinus', 'periodisch', 'Trigonometrie', 'Funktionswert'],
  fachwissen: {
    text: 'Die Sinusfunktion beschreibt periodische Vorgänge (Schwingungen, Gezeiten). Im Gradmaß gilt sin(0°)=0, sin(30°)=1/2, sin(90°)=1. Parameter in a·sin(b(x−c))+d steuern Amplitude, Periode, Phasenverschiebung und Verschiebung.',
    quelle: 'Wikipedia: Sinus und Kosinus',
    url: 'https://de.wikipedia.org/wiki/Sinus_und_Kosinus',
  },
  generate: (rng: Rng) => {
    const table: Array<{ deg: number; val: number; label: string }> = [
      { deg: 0, val: 0, label: '0' },
      { deg: 30, val: 0.5, label: '0,5' },
      { deg: 90, val: 1, label: '1' },
      { deg: 180, val: 0, label: '0' },
      { deg: 270, val: -1, label: '−1' },
    ]
    const row = pick(rng, table)
    return valueTask({
      question: `Berechne sin(${row.deg}°).`,
      answerKind: 'decimal',
      value: row.val,
      eps: 0.01,
      solution: row.label,
      explanation: `Aus der Winkelfunktionstafel bzw. dem Einheitskreis: sin(${row.deg}°) = ${row.label}.`,
    })
  },
}

export const k10ExpGleichung: Topic = {
  id: 'k10-lb4-exp-gleichung',
  title: 'Exponentialgleichung aˣ = b',
  hint: 'Schreibe b als Potenz von a oder nutze den Logarithmus.',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Exponentialgleichung', 'Logarithmus', 'Potenz', 'lösen'],
  fachwissen: {
    text: 'Gleichungen der Form aˣ = b löst man durch Logarithmen: x = log_a(b) = ln(b)/ln(a), oder indem man b als Potenz derselben Basis schreibt. Die Logarithmusfunktion ist die Umkehrfunktion der Exponentialfunktion.',
    quelle: 'Wikipedia: Exponentialgleichung',
    url: 'https://de.wikipedia.org/wiki/Exponentialgleichung',
  },
  generate: (rng: Rng) => {
    const a = pick(rng, [2, 3, 4, 5, 10])
    const x = randInt(rng, 1, 4)
    const b = a ** x
    return valueTask({
      question: `Löse die Gleichung ${a}ˣ = ${b}.`,
      answerKind: 'integer',
      value: x,
      solution: `x = ${x}`,
      explanation: `${a}^${x} = ${b}, also x = ${x}. (Probe: ${a}ˣ mit x=${x}.)`,
    })
  },
}

export const k10Logarithmus: Topic = {
  id: 'k10-lb4-logarithmus',
  title: 'Logarithmus berechnen',
  hint: 'logₐ(b) ist der Exponent, mit dem a die Zahl b ergibt.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Logarithmus', 'Umkehrfunktion', 'Exponentialfunktion'],
  fachwissen: {
    text: 'Der Logarithmus logₐ(b) beantwortet: „Mit welchem Exponenten muss man a potenzieren, um b zu erhalten?“ Es gilt a^(logₐ b) = b und logₐ(aˣ) = x. Häufige Basen: 10 (Zehnerlogarithmus) und e (natürlicher Logarithmus ln).',
    quelle: 'Wikipedia: Logarithmus',
    url: 'https://de.wikipedia.org/wiki/Logarithmus',
  },
  generate: (rng: Rng) => {
    const a = pick(rng, [2, 3, 4, 5, 10])
    const x = randInt(rng, 1, 4)
    const b = a ** x
    return valueTask({
      question: `Berechne log_${a}(${b}).`,
      answerKind: 'integer',
      value: x,
      solution: `${x}`,
      explanation: `${a}^${x} = ${b}, daher log_${a}(${b}) = ${x}.`,
    })
  },
}

export const k10FolgeExplizit: Topic = {
  id: 'k10-lb4-folge',
  title: 'Glied einer Zahlenfolge',
  hint: 'Setze n in die explizite Bildungsvorschrift ein.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Zahlenfolge', 'explizit', 'Bildungsvorschrift', 'Glied'],
  fachwissen: {
    text: 'Eine Zahlenfolge ordnet jeder natürlichen Zahl n einen Wert aₙ zu. Explizite Vorschriften geben aₙ direkt an (z. B. aₙ = 2n+1); rekursive Vorschriften bestimmen aₙ aus vorherigen Gliedern. Folgen sind spezielle Funktionen ℕ→ℝ und bereiten den Grenzwertbegriff vor.',
    quelle: 'Wikipedia: Folge (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Folge_(Mathematik)',
  },
  generate: (rng: Rng) => {
    const a = nonZero(rng, -5, 5)
    const b = randInt(rng, -8, 8)
    const n = randInt(rng, 2, 10)
    const value = a * n + b
    const bStr = b < 0 ? `− ${Math.abs(b)}` : `+ ${b}`
    return valueTask({
      question: `Gegeben ist die Folge aₙ = ${a}·n ${bStr}. Berechne a_${n}.`,
      answerKind: 'integer',
      value,
      solution: `${value}`,
      explanation: `a_${n} = ${a}·${n} ${bStr} = ${a * n} ${bStr} = ${value}.`,
    })
  },
}

export const k10Sinussatz: Topic = {
  id: 'k10-lb3-sinussatz',
  title: 'Sinussatz: Seite berechnen',
  hint: 'a/sin(α) = b/sin(β).',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Sinussatz', 'Dreieck', 'Trigonometrie', 'Seite'],
  fachwissen: {
    text: 'Der Sinussatz lautet a/sin(α) = b/sin(β) = c/sin(γ) = 2R. Er ermöglicht Berechnungen in allgemeinen (nicht notwendig rechtwinkligen) Dreiecken, wenn Winkel und gegenüberliegende Seiten bekannt sind.',
    quelle: 'Wikipedia: Sinussatz',
    url: 'https://de.wikipedia.org/wiki/Sinussatz',
  },
  generate: (rng: Rng) => {
    // Choose angles with known sines so answer is integer
    const cases: Array<{ a: number; alpha: number; beta: number; b: number }> = [
      { a: 10, alpha: 30, beta: 90, b: 20 }, // sin30=0.5, sin90=1 → b=a*1/0.5=20
      { a: 8, alpha: 30, beta: 90, b: 16 },
      { a: 6, alpha: 30, beta: 150, b: 6 }, // sin150=0.5
      { a: 12, alpha: 30, beta: 90, b: 24 },
      { a: 5, alpha: 30, beta: 90, b: 10 },
    ]
    const c = pick(rng, cases)
    return valueTask({
      question: `In einem Dreieck gilt a = ${c.a}, α = ${c.alpha}°, β = ${c.beta}°. Berechne b mit dem Sinussatz.`,
      answerKind: 'integer',
      value: c.b,
      solution: `b = ${c.b}`,
      explanation: `b = a · sin(β)/sin(α) = ${c.a} · sin(${c.beta}°)/sin(${c.alpha}°) = ${c.b}.`,
    })
  },
}

export const k10Kosinussatz: Topic = {
  id: 'k10-lb3-kosinussatz',
  title: 'Kosinussatz: Seite berechnen',
  hint: 'c² = a² + b² − 2ab·cos(γ).',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Kosinussatz', 'Dreieck', 'Trigonometrie', 'Seite'],
  fachwissen: {
    text: 'Der Kosinussatz verallgemeinert den Satz des Pythagoras: c² = a² + b² − 2ab·cos(γ). Für γ = 90° ist cos(γ)=0 und man erhält c² = a² + b². Er eignet sich, wenn zwei Seiten und der eingeschlossene Winkel bekannt sind.',
    quelle: 'Wikipedia: Kosinussatz',
    url: 'https://de.wikipedia.org/wiki/Kosinussatz',
  },
  generate: (rng: Rng) => {
    // Right angle → Pythagoras for clean integers
    const triples: Array<[number, number, number]> = [
      [3, 4, 5],
      [5, 12, 13],
      [6, 8, 10],
      [8, 15, 17],
    ]
    const [a, b, c] = pick(rng, triples)
    return valueTask({
      question: `In einem Dreieck sind a = ${a}, b = ${b} und γ = 90°. Berechne c (Kosinussatz bzw. Pythagoras).`,
      answerKind: 'integer',
      value: c,
      solution: `c = ${c}`,
      explanation: `Bei γ = 90°: c² = a² + b² = ${a * a} + ${b * b} = ${a * a + b * b}, c = ${c}.`,
    })
  },
}

export const k10VarianzZufall: Topic = {
  id: 'k10-lb2-varianz',
  title: 'Varianz einer Zufallsgröße',
  hint: 'Var(X) = E(X²) − [E(X)]² bzw. Mittel der quadrierten Abweichungen.',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Varianz', 'Zufallsgröße', 'Streuung', 'Erwartungswert'],
  fachwissen: {
    text: 'Die Varianz misst die Streuung einer Zufallsgröße um ihren Erwartungswert. Für eine diskrete Zufallsgröße mit Werten xᵢ und Wahrscheinlichkeiten pᵢ gilt Var(X) = Σ pᵢ(xᵢ−μ)². Die Standardabweichung ist σ = √Var(X).',
    quelle: 'Wikipedia: Varianz',
    url: 'https://de.wikipedia.org/wiki/Varianz',
  },
  generate: (rng: Rng) => {
    // Fair coin: X=0 or 1 each 1/2 → μ=0.5, Var=0.25
    // Fair die mapped: curated
    const cases: Array<{ q: string; v: number; expl: string }> = [
      {
        q: 'Eine faire Münze liefert X=0 (Zahl) oder X=1 (Kopf) je mit P=1/2. Berechne Var(X).',
        v: 0.25,
        expl: 'E(X)=1/2. Var(X)=½(0−½)²+½(1−½)²=2·½·¼=¼=0,25.',
      },
      {
        q: 'X nimmt die Werte 2 und 8 je mit Wahrscheinlichkeit 1/2 an. Berechne Var(X).',
        v: 9,
        expl: 'μ=5. Var=½(2−5)²+½(8−5)²=½·9+½·9=9.',
      },
      {
        q: 'X nimmt die Werte 0 und 4 je mit Wahrscheinlichkeit 1/2 an. Berechne Var(X).',
        v: 4,
        expl: 'μ=2. Var=½(0−2)²+½(4−2)²=½·4+½·4=4.',
      },
    ]
    const c = pick(rng, cases)
    return valueTask({
      question: c.q,
      answerKind: 'decimal',
      value: c.v,
      eps: 0.01,
      solution: formatDe(c.v),
      explanation: c.expl,
    })
  },
}

// =============================================================================
// Klasse 11/12 GK — Ergänzungen (Lehrplan-Lernbereiche)
// =============================================================================

export const k1112Extremum: Topic = {
  id: 'k1112-lb1-extremum',
  title: 'Extremstelle einer Parabel',
  hint: 'Setze f′(x)=0 und löse.',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Extremum', 'Ableitung', 'Hochpunkt', 'Tiefpunkt', 'Differentialrechnung'],
  fachwissen: {
    text: 'Lokale Extrema findet man oft über notwendige Bedingungen: f′(x₀)=0 (stationäre Stelle). Bei einer nach oben geöffneten Parabel a>0 liegt ein Tiefpunkt vor, bei a<0 ein Hochpunkt. Hinreichend hilft das Vorzeichen von f″ bzw. die Monotoniebetrachtung.',
    quelle: 'Wikipedia: Extremwert',
    url: 'https://de.wikipedia.org/wiki/Extremwert',
  },
  generate: (rng: Rng) => {
    const a = pick(rng, [-2, -1, 1, 2])
    const xs = nonZero(rng, -4, 4)
    const b = -2 * a * xs // so that f'=2ax+b=0 at xs
    const c = randInt(rng, -5, 5)
    const fStr = `f(x) = ${firstTerm(a, 'x²')}${term(b, 'x')}${term(c, '')}`
    return valueTask({
      question: `Gegeben ist ${fStr}. Bestimme die x-Koordinate der Extremstelle.`,
      answerKind: 'integer',
      value: xs,
      solution: `x = ${xs}`,
      explanation: `f'(x) = ${firstTerm(2 * a, 'x')}${term(b, '')}. f'(x)=0 ⇒ x = ${xs}.`,
    })
  },
}

export const k1112AbleitungExp: Topic = {
  id: 'k1112-lb1-ableitung-exp',
  title: 'Ableitung von eˣ und ln an einer Stelle',
  hint: '(eˣ)′=eˣ, (ln x)′=1/x.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Ableitung', 'Exponentialfunktion', 'Logarithmus', 'e', 'ln'],
  fachwissen: {
    text: 'Die Ableitung von f(x)=eˣ ist wieder eˣ. Die Ableitung von ln(x) (x>0) ist 1/x. Beide Funktionen gehören zum hilfsmittelfreien Repertoire der Differentialrechnung in der Kursstufe.',
    quelle: 'Wikipedia: Natürlicher Logarithmus',
    url: 'https://de.wikipedia.org/wiki/Nat%C3%BCrlicher_Logarithmus',
  },
  generate: (rng: Rng) => {
    if (rng() < 0.5) {
      const x0 = pick(rng, [0, 1])
      const value = x0 === 0 ? 1 : roundTo(Math.E, 3)
      return valueTask({
        question: `Berechne die Ableitung von f(x) = eˣ an der Stelle x₀ = ${x0}. Gib f'(${x0}) als Dezimalzahl an (e ≈ 2,718; bei x₀=0 ist der Wert exakt 1).`,
        answerKind: 'decimal',
        value,
        eps: 0.01,
        solution: formatDe(value),
        explanation: `f'(x)=eˣ, also f'(${x0}) = e^${x0} = ${x0 === 0 ? 1 : 'e ≈ 2,718'}.`,
      })
    }
    const x0 = pick(rng, [1, 2, 4, 5])
    const value = roundTo(1 / x0, 4)
    return valueTask({
      question: `Berechne die Ableitung von f(x) = ln(x) an der Stelle x₀ = ${x0}.`,
      answerKind: 'decimal',
      value,
      eps: 0.001,
      solution: formatDe(value),
      explanation: `f'(x)=1/x, also f'(${x0}) = 1/${x0} = ${formatDe(value)}.`,
    })
  },
}

export const k1112Differenzenquotient: Topic = {
  id: 'k1112-lb1-differenzenquotient',
  title: 'Differenzenquotient zweier Punkte',
  hint: 'm = (f(x₂)−f(x₁))/(x₂−x₁).',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Differenzenquotient', 'mittlere Änderungsrate', 'Sekante', 'Steigung'],
  fachwissen: {
    text: 'Der Differenzenquotient (f(x₂)−f(x₁))/(x₂−x₁) ist die mittlere Änderungsrate und die Steigung der Sekante. Grenzübergang x₂→x₁ liefert den Differentialquotienten f′(x₁), die Steigung der Tangente.',
    quelle: 'Wikipedia: Differenzenquotient',
    url: 'https://de.wikipedia.org/wiki/Differenzenquotient',
  },
  generate: (rng: Rng) => {
    const x1 = randInt(rng, -4, 2)
    const x2 = x1 + randInt(rng, 1, 4)
    const a = nonZero(rng, -3, 3)
    const b = randInt(rng, -5, 5)
    const y1 = a * x1 + b
    const y2 = a * x2 + b
    const value = a // linear → constant slope
    return valueTask({
      question: `Für f(x) = ${a}x ${b < 0 ? `− ${Math.abs(b)}` : `+ ${b}`} berechne den Differenzenquotienten zwischen x₁ = ${x1} und x₂ = ${x2}.`,
      answerKind: 'integer',
      value,
      solution: `${value}`,
      explanation: `(f(${x2})−f(${x1}))/(${x2}−${x1}) = (${y2}−${y1})/${x2 - x1} = ${value}.`,
    })
  },
}

export const k1112MatrixMult: Topic = {
  id: 'k1112-lb2-matrix-mult',
  title: 'Matrizen multiplizieren (2×2)',
  hint: 'Zeile · Spalte; Ergebnis ist eine Zahl je Eintrag.',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Matrix', 'Matrizenmultiplikation', 'lineares Gleichungssystem'],
  fachwissen: {
    text: 'Zwei verkettete Matrizen A (m×n) und B (n×k) ergeben C = A·B vom Typ (m×k). Der Eintrag cᵢⱼ ist das Skalarprodukt der i-ten Zeile von A mit der j-ten Spalte von B. Matrizenmultiplikation ist i. A. nicht kommutativ.',
    quelle: 'Wikipedia: Matrizenmultiplikation',
    url: 'https://de.wikipedia.org/wiki/Matrizenmultiplikation',
  },
  generate: (rng: Rng) => {
    const a11 = randInt(rng, -3, 3)
    const a12 = randInt(rng, -3, 3)
    const a21 = randInt(rng, -3, 3)
    const a22 = randInt(rng, -3, 3)
    const b11 = randInt(rng, -3, 3)
    const b21 = randInt(rng, -3, 3)
    // Ask for (1,1)-entry of A·B with B as 2×1 → result is 2×1; or full 2×2 ask c11
    const b12 = randInt(rng, -3, 3)
    const b22 = randInt(rng, -3, 3)
    const c11 = a11 * b11 + a12 * b21
    return valueTask({
      question: `Gegeben A = [[${a11}, ${a12}], [${a21}, ${a22}]] und B = [[${b11}, ${b12}], [${b21}, ${b22}]]. Berechne den Eintrag c₁₁ von C = A·B.`,
      answerKind: 'integer',
      value: c11,
      solution: `${c11}`,
      explanation: `c₁₁ = ${a11}·${b11} + ${a12}·${b21} = ${a11 * b11} + ${a12 * b21} = ${c11}.`,
    })
  },
}

export const k1112MatrixLgs: Topic = {
  id: 'k1112-lb2-matrix-lgs',
  title: 'LGS in Matrizenschreibweise lösen',
  hint: 'Löse das 2×2-System; gesucht ist x.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Matrix', 'Gleichungssystem', 'Gauß', 'Matrizenschreibweise'],
  fachwissen: {
    text: 'Lineare Gleichungssysteme schreibt man kompakt als A·x = b. In der Kursstufe werden 2×2- und 3×3-Systeme u. a. mit dem Gauß-Jordan-Verfahren gelöst. Matrizen visualisieren Struktur und Lösbarkeit.',
    quelle: 'Wikipedia: Lineares Gleichungssystem',
    url: 'https://de.wikipedia.org/wiki/Lineares_Gleichungssystem',
  },
  generate: (rng: Rng) => {
    const x = nonZero(rng, -6, 6)
    const y = nonZero(rng, -6, 6)
    const a = nonZero(rng, -4, 4)
    const b = nonZero(rng, -4, 4)
    let c = nonZero(rng, -4, 4)
    let d = nonZero(rng, -4, 4)
    while (a * d - b * c === 0) {
      c = nonZero(rng, -4, 4)
      d = nonZero(rng, -4, 4)
    }
    const e = a * x + b * y
    const f = c * x + d * y
    return valueTask({
      question: `Löse das System ${a}x ${b < 0 ? `− ${Math.abs(b)}` : `+ ${b}`}y = ${e}, ${c}x ${d < 0 ? `− ${Math.abs(d)}` : `+ ${d}`}y = ${f}. Gib den Wert von x an.`,
      answerKind: 'integer',
      value: x,
      solution: `x = ${x}`,
      explanation: `Eine Lösung ist x = ${x}, y = ${y} (Probe in beide Gleichungen einsetzen).`,
    })
  },
}

export const k1112VektorAdd: Topic = {
  id: 'k1112-lb3-vektor-add',
  title: 'Vektoren addieren',
  hint: 'Komponentenweise addieren.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Vektor', 'Addition', 'analytische Geometrie'],
  fachwissen: {
    text: 'Vektoren werden komponentenweise addiert: (a₁;a₂;a₃)+(b₁;b₂;b₃)=(a₁+b₁;a₂+b₂;a₃+b₃). Geometrisch entspricht das dem Aneinanderhängen von Pfeilen (Parallelogrammregel).',
    quelle: 'Wikipedia: Vektor',
    url: 'https://de.wikipedia.org/wiki/Vektor',
  },
  generate: (rng: Rng) => {
    const a = [nonZero(rng, -6, 6), nonZero(rng, -6, 6), nonZero(rng, -6, 6)]
    const b = [nonZero(rng, -6, 6), nonZero(rng, -6, 6), nonZero(rng, -6, 6)]
    const s = [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
    // Ask for first component to keep single-number answer
    return valueTask({
      question: `Berechne die erste Komponente von a + b mit a = ${vec3(a)} und b = ${vec3(b)}.`,
      answerKind: 'integer',
      value: s[0],
      solution: `${s[0]}`,
      explanation: `a + b = ${vec3(s)}. Die erste Komponente ist ${s[0]}.`,
    })
  },
}

export const k1112GeradePunkt: Topic = {
  id: 'k1112-lb3-gerade-punkt',
  title: 'Punkt auf einer Geraden (Parameter)',
  hint: 'Setze den Parameter t in die Parametergleichung ein.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Gerade', 'Parameterform', 'Vektor', 'Punkt'],
  fachwissen: {
    text: 'Eine Gerade im Raum lautet X = A + t·u (Parameterform). Jeder reelle Parameter t liefert einen Punkt der Geraden. Richtung u darf nicht der Nullvektor sein.',
    quelle: 'Wikipedia: Gerade',
    url: 'https://de.wikipedia.org/wiki/Gerade',
  },
  generate: (rng: Rng) => {
    const ax = randInt(rng, -5, 5)
    const ay = randInt(rng, -5, 5)
    const ux = nonZero(rng, -4, 4)
    const uy = nonZero(rng, -4, 4)
    const t = randInt(rng, -3, 3)
    const px = ax + t * ux
    return valueTask({
      question: `Gegeben ist die Gerade X = (${ax}; ${ay}) + t·(${ux}; ${uy}). Berechne die x-Koordinate des Punktes für t = ${t}.`,
      answerKind: 'integer',
      value: px,
      solution: `${px}`,
      explanation: `X(${t}) = (${ax}; ${ay}) + ${t}·(${ux}; ${uy}) = (${px}; ${ay + t * uy}). Die x-Koordinate ist ${px}.`,
    })
  },
}

export const k1112LageGeraden: Topic = {
  id: 'k1112-lb3-lage-geraden',
  title: 'Lagebeziehung zweier Geraden in der Ebene',
  hint: 'Vergleiche Richtungsvektoren und einen Punkt.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Lagebeziehung', 'Gerade', 'parallel', 'identisch', 'schneidend'],
  fachwissen: {
    text: 'Zwei Geraden in der Ebene sind parallel (gleiche Richtung, verschiedene Träger), identisch (gleiche Richtung und gemeinsamer Punkt) oder schneidend (verschiedene Richtungen). Im Raum gibt es zusätzlich windschiefe Geraden.',
    quelle: 'Wikipedia: Lagebeziehung',
    url: 'https://de.wikipedia.org/wiki/Lagebeziehung',
  },
  generate: (rng: Rng) => {
    const kind = pick(rng, ['parallel', 'identisch', 'schneidend'] as const)
    let correct: string
    let q: string
    let expl: string
    if (kind === 'parallel') {
      q =
        'g: X = (0; 0) + t·(2; 1), h: X = (0; 3) + s·(4; 2). Wie liegen g und h zueinander?'
      correct = 'parallel'
      expl = 'Richtungen (2;1) und (4;2)=2·(2;1) sind parallel; (0;3) liegt nicht auf g → echt parallel.'
    } else if (kind === 'identisch') {
      q =
        'g: X = (1; 1) + t·(2; 2), h: X = (3; 3) + s·(1; 1). Wie liegen g und h zueinander?'
      correct = 'identisch'
      expl = 'Richtungen parallel und (3;3) liegt auf g (t=1) → identisch.'
    } else {
      q =
        'g: X = (0; 0) + t·(1; 0), h: X = (0; 0) + s·(0; 1). Wie liegen g und h zueinander?'
      correct = 'schneidend'
      expl = 'Verschiedene Richtungen, gemeinsamer Punkt (0;0) → schneidend.'
    }
    return choicePickTask({
      question: q,
      choices: ['parallel', 'identisch', 'schneidend', 'windschief'],
      correct,
      solution: correct,
      explanation: expl,
      instruction: 'Wähle die passende Lagebeziehung:',
    })
  },
}

export const k1112BinomKumuliert: Topic = {
  id: 'k1112-lb4-binom-kumuliert',
  title: 'Binomialverteilung: P(X ≤ k)',
  hint: 'Summe der Einzelwahrscheinlichkeiten von 0 bis k.',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Binomialverteilung', 'kumuliert', 'höchstens', 'Stochastik'],
  fachwissen: {
    text: 'Kumulierte Wahrscheinlichkeiten P(X≤k) = Σᵢ₌₀ᵏ P(X=i) beschreiben Ereignisse wie „höchstens k Treffer“. Tabellen und CAS erleichtern die Auswertung; inhaltlich bleibt die Binomialformel zentral.',
    quelle: 'Wikipedia: Binomialverteilung',
    url: 'https://de.wikipedia.org/wiki/Binomialverteilung',
  },
  generate: (rng: Rng) => {
    const n = pick(rng, [3, 4, 5])
    const p = 0.5
    const k = randInt(rng, 0, Math.min(2, n))
    let raw = 0
    for (let i = 0; i <= k; i++) raw += binom(n, i) * p ** i * (1 - p) ** (n - i)
    const value = roundTo(raw, 4)
    return valueTask({
      question: `X ~ B(n=${n}, p=0,5). Berechne P(X ≤ ${k}) (vier Nachkommastellen).`,
      answerKind: 'decimal',
      value,
      eps: 0.0005,
      solution: formatDe(value),
      explanation: `P(X≤${k}) = Σᵢ₌₀^${k} C(${n},i)·(1/2)^${n} ≈ ${formatDe(value)}.`,
    })
  },
}

export const k1112BinomSigma: Topic = {
  id: 'k1112-lb4-binom-sigma',
  title: 'Standardabweichung der Binomialverteilung',
  hint: 'σ = √(n·p·(1−p)).',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Binomialverteilung', 'Standardabweichung', 'Varianz', 'Stochastik'],
  fachwissen: {
    text: 'Für X ~ B(n,p) gilt E(X)=n·p, Var(X)=n·p·(1−p) und σ=√(n·p·(1−p)). Die Standardabweichung misst die typische Abweichung der Trefferzahl vom Erwartungswert.',
    quelle: 'Wikipedia: Binomialverteilung',
    url: 'https://de.wikipedia.org/wiki/Binomialverteilung',
  },
  generate: (rng: Rng) => {
    const cases: Array<{ n: number; p: number; sigma: number }> = [
      { n: 100, p: 0.5, sigma: 5 },
      { n: 16, p: 0.5, sigma: 2 },
      { n: 36, p: 0.5, sigma: 3 },
      { n: 64, p: 0.5, sigma: 4 },
      { n: 25, p: 0.2, sigma: 2 }, // √(25*0.2*0.8)=√4=2
    ]
    const c = pick(rng, cases)
    return valueTask({
      question: `X ~ B(n=${c.n}, p=${formatDe(c.p)}). Berechne die Standardabweichung σ.`,
      answerKind: 'integer',
      value: c.sigma,
      solution: `${c.sigma}`,
      explanation: `σ = √(n·p·(1−p)) = √(${c.n}·${formatDe(c.p)}·${formatDe(1 - c.p)}) = ${c.sigma}.`,
    })
  },
}

export const k1112Stammfunktion: Topic = {
  id: 'k1112-lb5-stammfunktion',
  title: 'Stammfunktion eines Polynoms',
  hint: 'Potenzregel rückwärts: xⁿ → xⁿ⁺¹/(n+1).',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Stammfunktion', 'Integral', 'unbestimmtes Integral'],
  fachwissen: {
    text: 'Eine Stammfunktion F von f erfüllt F′=f. Für Potenzen gilt ∫ xⁿ dx = xⁿ⁺¹/(n+1)+C (n≠−1). Das unbestimmte Integral fasst alle Stammfunktionen zusammen.',
    quelle: 'Wikipedia: Stammfunktion',
    url: 'https://de.wikipedia.org/wiki/Stammfunktion',
  },
  generate: (rng: Rng) => {
    const n = pick(rng, [1, 2, 3])
    const intval = nonZero(rng, -5, 5)
    const aa = intval * (n + 1)
    const pow = n === 1 ? '' : n === 2 ? '²' : '³'
    const fpow = n + 1 === 2 ? '²' : n + 1 === 3 ? '³' : '⁴'
    return valueTask({
      question: `Sei f(x) = ${aa}·x${pow}. Eine Stammfunktion mit F(0)=0 ist F(x)=${intval}·x${fpow}. Berechne F(1).`,
      answerKind: 'integer',
      value: intval,
      solution: `${intval}`,
      explanation: `F(1) = ${intval}·1 = ${intval}. (Probe: Ableitung liefert wieder f(x)=${aa}·x${pow}.)`,
    })
  },
}

export const k1112FlaecheIntegral: Topic = {
  id: 'k1112-lb5-flaeche',
  title: 'Fläche zwischen Graph und x-Achse',
  hint: 'Berechne |∫ₐᵇ f| wenn f das Vorzeichen nicht wechselt.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Integral', 'Flächeninhalt', 'Graph', 'x-Achse'],
  fachwissen: {
    text: 'Liegt der Graph von f zwischen a und b oberhalb der x-Achse, so ist der Flächeninhalt gleich dem bestimmten Integral. Wechselt f das Vorzeichen, muss man Teilintervalle getrennt betrachten und Beträge addieren.',
    quelle: 'Wikipedia: Bestimmtes Integral',
    url: 'https://de.wikipedia.org/wiki/Integral#Bestimmtes_Integral',
  },
  generate: (rng: Rng) => {
    const m = randInt(rng, 1, 5)
    const b = randInt(rng, 2, 6)
    // f(x)=m (constant) from 0 to b
    const value = m * b
    return valueTask({
      question: `Berechne den Flächeninhalt zwischen dem Graphen von f(x) = ${m} und der x-Achse von x=0 bis x=${b}.`,
      answerKind: 'integer',
      value,
      solution: `${value}`,
      explanation: `Fläche = ∫₀^${b} ${m} dx = ${m}·${b} = ${value}.`,
    })
  },
}

export const k1112Hypothesentest: Topic = {
  id: 'k1112-lb6-hypothesentest',
  title: 'Signifikanztest: Entscheidung',
  hint: 'Vergleiche die Testgröße mit dem kritischen Wert.',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Hypothesentest', 'Signifikanz', 'Nullhypothese', 'kritischer Wert'],
  fachwissen: {
    text: 'Beim Signifikanztest prüft man eine Nullhypothese H₀ anhand einer Testgröße. Überschreitet (bzw. unterschreitet) die Testgröße den kritischen Wert zum gewählten Signifikanzniveau, lehnt man H₀ ab. Sonst behält man H₀ bei — ohne sie „zu beweisen“.',
    quelle: 'Wikipedia: Statistischer Test',
    url: 'https://de.wikipedia.org/wiki/Statistischer_Test',
  },
  generate: (rng: Rng) => {
    const krit = randInt(rng, 8, 15)
    const observed = krit + pick(rng, [-3, -2, -1, 0, 1, 2, 3])
    const reject = observed > krit
    const correct = reject ? 'ablehnen' : 'beibehalten'
    return choicePickTask({
      question: `Einseitiger Test: H₀ ablehnen, wenn die Testgröße > ${krit} ist. Beobachtet wurde ${observed}. Wie entscheidest du über H₀?`,
      choices: ['ablehnen', 'beibehalten'],
      correct,
      solution: correct,
      explanation: reject
        ? `${observed} > ${krit} → H₀ wird abgelehnt.`
        : `${observed} ≤ ${krit} → H₀ wird beibehalten.`,
      instruction: 'Wähle die Entscheidung:',
    })
  },
}

export const k1112Stichprobenmittel: Topic = {
  id: 'k1112-lb6-stichprobenmittel',
  title: 'Stichprobenmittel berechnen',
  hint: 'Mittelwert der Stichprobenwerte.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Stichprobe', 'Mittelwert', 'beurteilende Statistik'],
  fachwissen: {
    text: 'Das Stichprobenmittel schätzt den Erwartungswert einer Grundgesamtheit. In der beurteilenden Statistik dienen Stichprobenmittel und Stichprobenvarianz als Ausgangspunkt für Konfidenzintervalle und Hypothesentests.',
    quelle: 'Wikipedia: Stichprobenmittel',
    url: 'https://de.wikipedia.org/wiki/Arithmetisches_Mittel',
  },
  generate: (rng: Rng) => {
    const n = randInt(rng, 4, 6)
    const data: number[] = []
    for (let i = 0; i < n; i++) data.push(randInt(rng, 2, 20))
    let sum = data.reduce((s, x) => s + x, 0)
    const rem = sum % n
    if (rem !== 0) {
      data[n - 1] += n - rem
      sum += n - rem
    }
    const value = sum / n
    return valueTask({
      question: `Berechne das Stichprobenmittel von ${data.join(', ')}.`,
      answerKind: 'integer',
      value,
      solution: `${value}`,
      explanation: `Summe ${sum}, geteilt durch ${n}: Mittel = ${value}.`,
    })
  },
}

export const k1112Orthogonal: Topic = {
  id: 'k1112-lb7-orthogonal',
  title: 'Orthogonalität zweier Vektoren',
  hint: 'Senkrecht ⇔ Skalarprodukt = 0.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['orthogonal', 'Skalarprodukt', 'senkrecht', 'Vektor'],
  fachwissen: {
    text: 'Zwei Vektoren sind orthogonal (senkrecht), genau dann wenn ihr Skalarprodukt null ist. Normalenvektoren von Geraden/Ebenen nutzen diese Bedingung zentral bei Abstands- und Winkelberechnungen.',
    quelle: 'Wikipedia: Orthogonalität',
    url: 'https://de.wikipedia.org/wiki/Orthogonalit%C3%A4t',
  },
  generate: (rng: Rng) => {
    const a = [nonZero(rng, -5, 5), nonZero(rng, -5, 5)]
    // Construct orthogonal b: (-a2, a1) or not
    const makeOrtho = rng() < 0.55
    const b = makeOrtho
      ? [-a[1], a[0]]
      : [nonZero(rng, -5, 5), nonZero(rng, -5, 5)]
    const dot = a[0] * b[0] + a[1] * b[1]
    const ortho = dot === 0
    // If accidental ortho when not intended, flip
    const bb = !makeOrtho && ortho ? [b[0], b[1] + 1] : b
    const dot2 = a[0] * bb[0] + a[1] * bb[1]
    const correct = dot2 === 0 ? 'ja' : 'nein'
    return choicePickTask({
      question: `Sind die Vektoren a = ${vec2(a)} und b = ${vec2(bb)} orthogonal?`,
      choices: ['ja', 'nein'],
      correct,
      solution: correct,
      explanation: `a · b = ${dot2}. Orthogonalität gilt genau bei Skalarprodukt 0 → ${correct}.`,
      instruction: 'Wähle:',
    })
  },
}

export const k1112WinkelVektoren: Topic = {
  id: 'k1112-lb7-winkel',
  title: 'Winkel zwischen Vektoren (Kosinus)',
  hint: 'cos(φ) = (a·b)/(|a|·|b|).',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Winkel', 'Skalarprodukt', 'Vektor', 'Kosinus'],
  fachwissen: {
    text: 'Aus a·b = |a|·|b|·cos(φ) folgt der Winkel zwischen zwei Vektoren. Orthogonale Vektoren haben φ=90° (cos=0), parallele gleiche Richtung φ=0° (cos=1).',
    quelle: 'Wikipedia: Skalarprodukt',
    url: 'https://de.wikipedia.org/wiki/Skalarprodukt',
  },
  generate: (rng: Rng) => {
    // Use orthogonal → cos=0; or parallel → cos=1
    if (rng() < 0.5) {
      return valueTask({
        question:
          'Gegeben a = (1; 0) und b = (0; 1). Berechne cos(φ) für den Winkel φ zwischen a und b.',
        answerKind: 'integer',
        value: 0,
        solution: '0',
        explanation: 'a·b=0, |a|=|b|=1 ⇒ cos(φ)=0 (rechter Winkel).',
      })
    }
    return valueTask({
      question:
        'Gegeben a = (2; 0) und b = (4; 0). Berechne cos(φ) für den Winkel φ zwischen a und b.',
      answerKind: 'integer',
      value: 1,
      solution: '1',
      explanation: 'a·b=8, |a|=2, |b|=4 ⇒ cos(φ)=8/8=1 (gleiche Richtung).',
    })
  },
}

export const k1112AbstandPunktGerade: Topic = {
  id: 'k1112-lb7-abstand-gerade',
  title: 'Abstand Punkt–Gerade in der Ebene',
  hint: 'd = |ax₀+by₀+c|/√(a²+b²) für Gerade ax+by+c=0.',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Abstand', 'Gerade', 'Punkt', 'analytische Geometrie'],
  fachwissen: {
    text: 'Der Abstand eines Punktes P₀ von der Geraden ax+by+c=0 ist |ax₀+by₀+c|/√(a²+b²). Im Raum nutzt man Normalenvektoren bzw. das Vektorprodukt für Abstände Punkt–Gerade und Punkt–Ebene.',
    quelle: 'Wikipedia: Hessesche Normalform',
    url: 'https://de.wikipedia.org/wiki/Hessesche_Normalform',
  },
  generate: (rng: Rng) => {
    // Line x=0 (y-axis): a=1,b=0,c=0 → distance = |x0|
    const x0 = randInt(rng, 2, 9)
    const y0 = randInt(rng, -5, 5)
    return valueTask({
      question: `Berechne den Abstand des Punktes P(${x0}|${y0}) von der Geraden x = 0 (y-Achse).`,
      answerKind: 'integer',
      value: x0,
      solution: `${x0}`,
      explanation: `Abstand zur y-Achse ist der Betrag der x-Koordinate: |${x0}| = ${x0}.`,
    })
  },
}

export const k1112ExtremwertAnwendung: Topic = {
  id: 'k1112-lb8-extremwert',
  title: 'Extremwert: Rechteck mit festem Umfang',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Extremwertaufgabe', 'Optimierung', 'Ableitung', 'Anwendung'],
  fachwissen: {
    text: 'Extremwertaufgaben modellieren Optimierungsprobleme (maximale Fläche, minimale Kosten). Typisch: Zielfunktion aufstellen, Ableitung null setzen, Rand und zweite Ableitung prüfen. In Sachsen vernetzt LB „Weitere Anwendungen“ Analysis und Geometrie.',
    quelle: 'Wikipedia: Extremwertaufgabe',
    url: 'https://de.wikipedia.org/wiki/Extremwertaufgabe',
  },
  generate: (rng: Rng) => {
    // Perimeter U=2(x+y) fixed → y=U/2-x; max area at square x=U/4
    const half = pick(rng, [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36])
    const xMax = half / 2
    const U = 2 * half
    return valueTask({
      question: `Ein Rechteck hat den Umfang ${U}. Für welche Seitenlänge x (in Längeneinheiten) wird die Fläche maximal?`,
      answerKind: 'integer',
      value: xMax,
      solution: `x = ${xMax}`,
      explanation: `Mit y = ${half} − x ist A(x)=x·(${half}−x). A'(x)=${half}−2x=0 ⇒ x=${xMax} (Quadrat).`,
      dedupeKey: `ma:k1112:extrem:rect:${U}`,
      contentIds: [`ma:k1112:extrem:rect:${U}`],
    })
  },
}

export const k1112SpiegelungEbene: Topic = {
  id: 'k1112-lb8-spiegelung',
  title: 'Spiegelung eines Punktes an einer Koordinatenebene',
  hint: 'An der xy-Ebene ändert sich das Vorzeichen von z.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Spiegelung', 'Ebene', 'Punkt', 'Anwendung'],
  fachwissen: {
    text: 'Die Spiegelung eines Punktes an einer Ebene erzeugt den Punkt, dessen Verbindungsstrecke zur Ausgangslage von der Ebene mittig und senkrecht geschnitten wird. An Koordinatenebenen kehren sich die entsprechenden Koordinaten um.',
    quelle: 'Wikipedia: Spiegelung (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Spiegelung_(Geometrie)',
  },
  generate: (rng: Rng) => {
    const x = nonZero(rng, -8, 8)
    const y = nonZero(rng, -8, 8)
    const z = nonZero(rng, -8, 8)
    // Ask for z' after reflection in xy-plane → -z
    return valueTask({
      question: `Spiegele den Punkt P(${x}|${y}|${z}) an der xy-Ebene. Wie lautet die z-Koordinate des Bildpunktes?`,
      answerKind: 'integer',
      value: -z,
      solution: `${-z}`,
      explanation: `Spiegelung an der xy-Ebene: (x|y|z) ↦ (x|y|−z). Neue z-Koordinate: ${-z}.`,
    })
  },
}

export const k1112MatrixAdd: Topic = {
  id: 'k1112-lb2-matrix-add',
  title: 'Matrizen addieren (2×2)',
  hint: 'Einträge jeweils addieren.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Matrix', 'Addition', 'Matrizen'],
  fachwissen: {
    text: 'Gleichgroße Matrizen werden komponentenweise addiert. Die Nullmatrix ist neutrales Element. Matrizenaddition ist kommutativ und assoziativ.',
    quelle: 'Wikipedia: Matrix (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Matrix_(Mathematik)',
  },
  generate: (rng: Rng) => {
    const a11 = randInt(rng, -5, 5)
    const b11 = randInt(rng, -5, 5)
    return valueTask({
      question: `A = [[${a11}, 1], [0, 2]], B = [[${b11}, 3], [4, 5]]. Wie lautet der Eintrag c₁₁ von C = A+B?`,
      answerKind: 'integer',
      value: a11 + b11,
      solution: `${a11 + b11}`,
      explanation: `c₁₁ = ${a11} + ${b11} = ${a11 + b11}.`,
    })
  },
}

export const k1112MatrixDet: Topic = {
  id: 'k1112-lb2-matrix-det',
  title: 'Determinante 2×2',
  hint: 'det = a₁₁a₂₂ − a₁₂a₂₁.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Determinante', 'Matrix', '2×2'],
  fachwissen: {
    text: 'Die Determinante einer 2×2-Matrix A = [[a,b],[c,d]] ist ad−bc. det≠0 bedeutet Invertierbarkeit und eindeutige Lösbarkeit zugehöriger LGS.',
    quelle: 'Wikipedia: Determinante',
    url: 'https://de.wikipedia.org/wiki/Determinante',
  },
  generate: (rng: Rng) => {
    const a = randInt(rng, -4, 4)
    const b = randInt(rng, -4, 4)
    const c = randInt(rng, -4, 4)
    const d = randInt(rng, -4, 4)
    const det = a * d - b * c
    return valueTask({
      question: `Berechne det([[${a}, ${b}], [${c}, ${d}]]).`,
      answerKind: 'integer',
      value: det,
      solution: `${det}`,
      explanation: `det = ${a}·${d} − ${b}·${c} = ${a * d} − ${b * c} = ${det}.`,
    })
  },
}

export const k1112KonfidenzIdee: Topic = {
  id: 'k1112-lb6-konfidenz',
  title: 'Konfidenzintervall (Idee)',
  hint: 'Schätzintervall um den Stichprobenanteil.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Konfidenzintervall', 'Statistik', 'Anteil'],
  fachwissen: {
    text: 'Ein Konfidenzintervall gibt einen Bereich an, in dem der unbekannte Parameter der Grundgesamtheit mit vorgegebener Sicherheit vermutet wird. In der Kursstufe genügt oft die Idee und einfache Anteilsschätzungen.',
    quelle: 'Wikipedia: Konfidenzintervall',
    url: 'https://de.wikipedia.org/wiki/Konfidenzintervall',
  },
  generate: (rng: Rng) => {
    const n = pick(rng, [100, 200, 400])
    const k = randInt(rng, 20, Math.floor(n * 0.6))
    const pHat = k / n
    return valueTask({
      question: `In einer Stichprobe von ${n} Personen antworten ${k} mit „ja“. Wie groß ist der relative Anteil (als Dezimalzahl, z. B. 0,25)?`,
      answerKind: 'decimal',
      value: pHat,
      solution: `${pHat}`,
      explanation: `p̂ = ${k}/${n} = ${pHat}. Um p̂ werden Konfidenzintervalle gebaut.`,
    })
  },
}

export const k1112VolumenOptimierung: Topic = {
  id: 'k1112-lb8-volumen',
  title: 'Extremwert: offener Quader',
  hint: 'Volumen V(x) aufstellen und ableiten.',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Extremwert', 'Volumen', 'Optimierung'],
  fachwissen: {
    text: 'Aus Zuschnitten (z. B. Quadrate aus Ecken einer Pappe) entstehen offene Quader. Das Volumen als Funktion der Schnittlänge wird maximiert — klassische Vernetzung Analysis/Raumgeometrie.',
    quelle: 'Wikipedia: Extremwertaufgabe',
    url: 'https://de.wikipedia.org/wiki/Extremwertaufgabe',
  },
  generate: (rng: Rng) => {
    // Square sheet side S; cut x from corners; V = x(S-2x)^2; V'=0 → x=S/6
    const S = pick(rng, [12, 18, 24, 30])
    const x = S / 6
    return valueTask({
      question: `Aus einem Quadrat der Seitenlänge ${S} werden an den Ecken Quadrate der Seitenlänge x ausgeschnitten und zu einem offenen Quader gefaltet. Für welches x wird das Volumen maximal? (x = S/6)`,
      answerKind: 'integer',
      value: x,
      solution: `${x}`,
      explanation: `Aus V(x)=x·(${S}−2x)² folgt mit V'=0 die innere Extremstelle x=${S}/6=${x}.`,
    })
  },
}
