/**
 * Lehrplan-Lückenfüllung Mathe Gym Sachsen — Fokus Klasse 8–12.
 * Quelle: Lehrplan Gymnasium Mathematik Sachsen 2004/…/2021
 * (schulportal.sachsen.de/lplandb/lehrplan/461).
 *
 * Eigene Aufgabenformulierungen; keine Lehrwerks-Textübernahmen.
 */
import { pick, randInt, type Rng } from '../lib/rng'
import { formatDe, roundTo } from '../lib/num'
import { addNum, linFactor, linStr, parenNum, polyStr, signedNum } from '../lib/termFormat'
import { makeFraction } from '../lib/fraction'
import { choicePickTask, fractionTask, mixedVariants, valueTask } from './taskHelpers'
import { appliedMc, shuffleArr } from './mathApplied'
import type { Topic } from './types'

const DEG = Math.PI / 180

const num = (n: number): string => (n < 0 ? `(−${Math.abs(n)})` : `${n}`)
const nonZero = (rng: Rng, min: number, max: number): number => {
  let v = 0
  while (v === 0) v = randInt(rng, min, max)
  return v
}
const minus = (n: number): string => (n < 0 ? `−${formatDe(-n)}` : formatDe(n))
const fmtSigned = (n: number): string => (n < 0 ? `−${formatDe(-n)}` : formatDe(n))
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
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['binomische Formel', 'Quadrat', 'Term', 'ausmultiplizieren'],
  fachwissen: {
    text: 'Die ersten beiden binomischen Formeln lauten (a+b)² = a²+2ab+b² und (a−b)² = a²−2ab+b². Die dritte lautet (a+b)(a−b)=a²−b². Sie verkürzen das Ausmultiplizieren und treten oft in der Geometrie (Flächen) auf.',
    quelle: 'Wikipedia: Binomische Formeln',
    url: 'https://de.wikipedia.org/wiki/Binomische_Formeln',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 2, 7)
      const b = randInt(rng, 1, 9)
      const plus = rng() < 0.5
      const s = plus ? '+' : '−'
      const correct = `${a * a}x² ${s} ${2 * a * b}x + ${b * b}`
      return appliedMc(rng, {
        question: `Multipliziere aus: (${a === 1 ? '' : a}x ${s} ${minus(b)})²`,
        correct,
        distractors: [
          `${a * a}x² + ${b * b}`,
          `${a * a}x² ${s} ${a * b}x + ${b * b}`,
          `${minus(a)}x² ${s} ${2 * a * b}x + ${b * b}`,
          `${a * a}x² ${plus ? '−' : '+'} ${2 * a * b}x + ${b * b}`,
          `${a * a}x² ${s} ${2 * a * b}x ${plus ? '+' : '−'} ${b * b}`,
        ],
        explanation: `(${minus(a)}x ${s} ${minus(b)})² = (${minus(a)}x)² ${s} 2·${minus(a)}x·${minus(b)} + ${minus(b)}² = ${correct}. Der gemischte Term 2ab darf nicht fehlen.`,
        fachwissen: {
          text: '1. und 2. binomische Formel: (a ± b)² = a² ± 2ab + b². Häufiger Fehler ist das Weglassen des gemischten Terms 2ab; das Quadrat einer Summe ist nicht die Summe der Quadrate.',
          quelle: 'Wikipedia: Binomische Formeln',
          url: 'https://de.wikipedia.org/wiki/Binomische_Formeln',
        },
        dedupeKey: `ma:k8:binom:aus:${a}:${b}:${plus}`,
      })
    },
    (rng: Rng) => {
      const base = 10 * randInt(rng, 2, 9)
      const d = randInt(rng, 1, 4)
      const plus = rng() < 0.5
      const n = plus ? base + d : base - d
      return valueTask({
        question: `Berechne ${n}² im Kopf, indem du ${n} als ${base} ${plus ? '+' : '−'} ${minus(d)} schreibst.`,
        answerKind: 'integer',
        value: n * n,
        solution: `${n * n}`,
        explanation: `${n}² = ${base}² ${plus ? '+' : '−'} 2·${base}·${minus(d)} + ${minus(d)}² = ${base * base} ${plus ? '+' : '−'} ${2 * base * d} + ${d * d} = ${n * n}.`,
        dedupeKey: `ma:k8:binom:kopf2:${n}`,
      })
    },
    (rng: Rng) => {
      const base = 10 * randInt(rng, 2, 9)
      const d = randInt(rng, 1, 5)
      return valueTask({
        question: `Berechne ${base + d} · ${base - d} mithilfe der 3. binomischen Formel.`,
        answerKind: 'integer',
        value: base * base - d * d,
        solution: `${base * base - d * d}`,
        explanation: `${base + d} · ${base - d} = (${base} + ${minus(d)})(${base} − ${minus(d)}) = ${base}² − ${minus(d)}² = ${base * base} − ${d * d} = ${base * base - d * d}.`,
        dedupeKey: `ma:k8:binom:kopf3:${base}:${d}`,
      })
    },
  ),
}

export const k8Baumdiagramm: Topic = {
  id: 'k8-lb2-zweistufig',
  title: 'Zweistufiger Zufallsversuch (Pfadregel)',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Baumdiagramm', 'Pfadregel', 'mehrstufig', 'Wahrscheinlichkeit'],
  fachwissen: {
    text: 'Bei unabhängigen Stufen multipliziert man die Wahrscheinlichkeiten entlang eines Pfades (Pfadregel). Für „entweder dieser oder jener Pfad“ addiert man die Pfadwahrscheinlichkeiten. Baumdiagramme machen mehrstufige Zufallsversuche übersichtlich.',
    quelle: 'Wikipedia: Baumdiagramm',
    url: 'https://de.wikipedia.org/wiki/Baumdiagramm',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const r = randInt(rng, 2, 7)
      const b = randInt(rng, 2, 7)
      const n = r + b
      const same = rng() < 0.5
      const num0 = same ? r * (r - 1) : 2 * r * b
      const p = makeFraction(num0, n * (n - 1))
      return fractionTask({
        question: `In einer Urne liegen ${minus(r)} rote und ${minus(b)} blaue Kugeln. Es werden nacheinander zwei Kugeln ohne Zurücklegen gezogen. Wie groß ist die Wahrscheinlichkeit, ${same ? 'zwei rote' : 'zwei verschiedenfarbige'} Kugeln zu ziehen? Gib einen gekürzten Bruch an.`,
        value: p,
        solution: `${p.n}/${p.d}`,
        requireReduced: true,
        explanation: same
          ? `Pfad rot–rot: ${minus(r)}/${n} · ${r - 1}/${n - 1} = ${num0}/${n * (n - 1)} = ${p.n}/${p.d}.`
          : `Pfade rot–blau und blau–rot: ${minus(r)}/${n} · ${minus(b)}/${n - 1} + ${minus(b)}/${n} · ${minus(r)}/${n - 1} = ${num0}/${n * (n - 1)} = ${p.n}/${p.d}.`,
        dedupeKey: `ma:k8:baum:urne:${r}:${b}:${same}`,
      })
    },
    (rng: Rng) => {
      const p = pick(rng, [0.1, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9])
      const k = pick(rng, [2, 3])
      const value = roundTo(1 - (1 - p) ** k, 4)
      const ctx = pick(rng, ['trifft ein Basketballspieler beim Freiwurf', 'geht ein ausgesäter Samen auf', 'zeigt eine Ampel bei Ankunft Grün'])
      return valueTask({
        question: `Mit der Wahrscheinlichkeit ${formatDe(p)} ${ctx}. Der Versuch wird ${k}-mal unabhängig wiederholt. Wie groß ist die Wahrscheinlichkeit für mindestens einen Erfolg?`,
        answerKind: 'decimal',
        value,
        eps: 0.0005,
        solution: formatDe(value),
        explanation: `Gegenereignis „kein Erfolg“: ${formatDe(roundTo(1 - p, 2))}^${k} = ${formatDe(roundTo((1 - p) ** k, 4))}. Also 1 − ${formatDe(roundTo((1 - p) ** k, 4))} = ${formatDe(value)}.`,
        dedupeKey: `ma:k8:baum:mind:${p}:${k}:${ctx}`,
      })
    },
    (rng: Rng) => {
      const p1 = pick(rng, [0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8])
      const p2 = pick(rng, [0.1, 0.2, 0.3, 0.5, 0.7, 0.9])
      const value = roundTo(p1 * (1 - p2) + (1 - p1) * p2, 4)
      return valueTask({
        question: `Lisa besteht die erste Prüfung mit der Wahrscheinlichkeit ${formatDe(p1)} und unabhängig davon die zweite mit ${formatDe(p2)}. Wie groß ist die Wahrscheinlichkeit, dass sie genau eine der beiden Prüfungen besteht?`,
        answerKind: 'decimal',
        value,
        eps: 0.0005,
        solution: formatDe(value),
        explanation: `Zwei Pfade: ${formatDe(p1)} · ${formatDe(roundTo(1 - p2, 2))} + ${formatDe(roundTo(1 - p1, 2))} · ${formatDe(p2)} = ${formatDe(value)}.`,
        dedupeKey: `ma:k8:baum:genau1:${p1}:${p2}`,
      })
    },
  ),
}

export const k8ProduktregelAnzahl: Topic = {
  id: 'k8-lb2-abzaehlen',
  title: 'Abzählen mit der Produktregel',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Produktregel', 'Abzählen', 'Kombinatorik', 'Möglichkeiten'],
  fachwissen: {
    text: 'Können Entscheidungen nacheinander unabhängig getroffen werden (z. B. Menü: Vorspeise, Hauptgericht, Dessert), ergibt das Produkt der Anzahlen die Gesamtzahl der Möglichkeiten. Das ist die Produktregel der Kombinatorik.',
    quelle: 'Wikipedia: Produktregel (Kombinatorik)',
    url: 'https://de.wikipedia.org/wiki/Kombinatorik',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 2, 6)
      const b = randInt(rng, 2, 6)
      const c = randInt(rng, 2, 5)
      const value = a * b * c
      return valueTask({
        question: `Ein Menü bietet ${minus(a)} Vorspeisen, ${minus(b)} Hauptgerichte und ${minus(c)} Desserts. Wie viele verschiedene Menüs gibt es (je eine Wahl pro Gang)?`,
        answerKind: 'integer',
        value,
        solution: `${minus(value)}`,
        explanation: `Produktregel: ${minus(a)} · ${minus(b)} · ${minus(c)} = ${minus(value)} Menüs.`,
        dedupeKey: `ma:k8:prod:menue:${a}:${b}:${c}`,
      })
    },
    (rng: Rng) => {
      const digits = pick(rng, [3, 4])
      const sym = pick(rng, [4, 5, 6, 10])
      const value = sym ** digits
      return valueTask({
        question: `Ein Zahlenschloss hat ${digits} Ringe mit jeweils ${sym} Ziffern. Wie viele verschiedene Einstellungen gibt es?`,
        answerKind: 'integer',
        value,
        solution: `${minus(value)}`,
        explanation: `Für jeden der ${digits} Ringe gibt es ${sym} Möglichkeiten: ${Array(digits).fill(sym).join(' · ')} = ${minus(value)}.`,
        dedupeKey: `ma:k8:prod:schloss:${digits}:${sym}`,
      })
    },
    (rng: Rng) => {
      const n = randInt(rng, 5, 10)
      const k = pick(rng, [2, 3])
      let value = 1
      for (let i = 0; i < k; i++) value *= n - i
      return valueTask({
        question: `${n} Läuferinnen starten in einem Rennen. Wie viele Möglichkeiten gibt es für die Belegung der ersten ${k} Plätze?`,
        answerKind: 'integer',
        value,
        solution: `${minus(value)}`,
        explanation: `Platz 1: ${n} Möglichkeiten, Platz 2: ${n - 1}${k === 3 ? `, Platz 3: ${n - 2}` : ''}. Produktregel: ${Array.from({ length: k }, (_, i) => n - i).join(' · ')} = ${minus(value)}.`,
        dedupeKey: `ma:k8:prod:rennen:${n}:${k}`,
      })
    },
  ),
}

// =============================================================================
// Klasse 9 — Ergänzungen
// =============================================================================

export const k9Wurzelgleichung: Topic = {
  id: 'k9-lb1-wurzelgleichung',
  title: 'Einfache Wurzelgleichung',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Wurzelgleichung', 'Quadratwurzel', 'lösen', 'Potenzen'],
  fachwissen: {
    text: 'Gleichungen der Form √x = a (a ≥ 0) werden durch Quadrieren gelöst: x = a². Nach dem Quadrieren muss man prüfen, ob die Lösung im Definitionsbereich liegt (Radikand ≥ 0) und die Ausgangsgleichung erfüllt.',
    quelle: 'Wikipedia: Wurzelgleichung',
    url: 'https://de.wikipedia.org/wiki/Wurzelgleichung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 2, 5)
      const x = randInt(rng, 1, 15)
      const c = randInt(rng, 2, 9)
      const b = c * c - a * x
      return valueTask({
        question: `Löse die Gleichung √(${minus(a)}x ${b < 0 ? `− ${-b}` : `+ ${minus(b)}`}) = ${minus(c)}.`,
        answerKind: 'integer',
        value: x,
        solution: `x = ${minus(x)}`,
        explanation: `Quadrieren: ${minus(a)}x ${b < 0 ? `− ${-b}` : `+ ${minus(b)}`} = ${c * c} ⇒ ${minus(a)}x = ${a * x} ⇒ x = ${minus(x)}. Probe: √${c * c} = ${minus(c)}.`,
        dedupeKey: `ma:k9:wurzelgl:lin:${a}:${b}:${c}`,
      })
    },
    (rng: Rng) => {
      const c = randInt(rng, 2, 8)
      const d = randInt(rng, 1, 9)
      const a = randInt(rng, 1, 20)
      const x = c * c - a
      return valueTask({
        question: `Löse die Gleichung √(x + ${minus(a)}) + ${minus(d)} = ${c + d}.`,
        answerKind: 'integer',
        value: x,
        solution: `x = ${minus(x)}`,
        explanation: `Wurzel isolieren: √(x + ${minus(a)}) = ${minus(c)}. Quadrieren: x + ${minus(a)} = ${c * c} ⇒ x = ${minus(x)}. Probe: √${c * c} + ${minus(d)} = ${c + d}.`,
        dedupeKey: `ma:k9:wurzelgl:iso:${a}:${c}:${d}`,
      })
    },
    (rng: Rng) => {
      const c = randInt(rng, 1, 9)
      const a = randInt(rng, 1, 30)
      return appliedMc(rng, {
        question: `Wie viele Lösungen hat die Gleichung √(x + ${minus(a)}) = −${minus(c)}?`,
        correct: 'keine Lösung',
        distractors: ['genau eine Lösung', 'zwei Lösungen', 'unendlich viele Lösungen'],
        explanation: `Eine Quadratwurzel ist nie negativ. Quadrieren würde x = ${minus(c * c - a)} liefern, aber die Probe ergibt √${c * c} = ${minus(c)} ≠ −${minus(c)}.`,
        fachwissen: {
          text: 'Quadrieren ist keine Äquivalenzumformung: Es können Scheinlösungen entstehen. Deshalb gehört zu jeder Wurzelgleichung die Probe in der Ausgangsgleichung. √a ist für a ≥ 0 immer ≥ 0.',
          quelle: 'Wikipedia: Wurzelgleichung',
          url: 'https://de.wikipedia.org/wiki/Wurzelgleichung',
        },
        dedupeKey: `ma:k9:wurzelgl:schein:${a}:${c}`,
      })
    },
  ),
}

export const k9PotenzfunktionWert: Topic = {
  id: 'k9-lb1-potenzfunktion',
  title: 'Wert einer Potenzfunktion',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Potenzfunktion', 'Funktionswert', 'Potenz', 'Graph'],
  fachwissen: {
    text: 'Potenzfunktionen haben die Form f(x) = a·xⁿ. Für gerade Exponenten ist der Graph symmetrisch zur y-Achse, für ungerade punktsymmetrisch zum Ursprung. Parameter a streckt bzw. spiegelt den Graphen.',
    quelle: 'Wikipedia: Potenzfunktion',
    url: 'https://de.wikipedia.org/wiki/Potenzfunktion',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const n = pick(rng, [2, 3, 4])
      const a = pick(rng, [-3, -2, -1, 2, 3])
      const x = nonZero(rng, -3, 3)
      const value = a * x ** n
      const sup = ['', '', '²', '³', '⁴'][n]
      return valueTask({
        question: `Gegeben ist f(x) = ${firstTerm(a, `x${sup}`)}. Berechne f(${minus(x)}).`,
        answerKind: 'integer',
        value,
        solution: minus(value),
        explanation: `f(${minus(x)}) = ${minus(a)} · ${num(x)}${sup} = ${minus(a)} · ${num(x ** n)} = ${minus(value)}.`,
        dedupeKey: `ma:k9:potfkt:wert:${a}:${n}:${x}`,
      })
    },
    (rng: Rng) => {
      const n = pick(rng, [2, 3])
      const a = pick(rng, [-3, -2, -1, 2, 3, 4, 5])
      const x = pick(rng, [2, 3, -2])
      const y = a * x ** n
      const sup = n === 2 ? '²' : '³'
      return valueTask({
        question: `Der Graph von f(x) = a·x${sup} verläuft durch den Punkt P(${minus(x)}|${minus(y)}). Bestimme a.`,
        answerKind: 'integer',
        value: a,
        solution: `a = ${minus(a)}`,
        explanation: `${minus(y)} = a · ${num(x)}${sup} = a · ${num(x ** n)} ⇒ a = ${minus(a)}.`,
        dedupeKey: `ma:k9:potfkt:a:${a}:${n}:${x}`,
      })
    },
    (rng: Rng) => {
      const n = randInt(rng, 2, 7)
      const sup = ['', '', '²', '³', '⁴', '⁵', '⁶', '⁷'][n]
      const gerade = n % 2 === 0
      return appliedMc(rng, {
        question: `Welche Symmetrie hat der Graph von f(x) = x${sup}?`,
        correct: gerade ? 'achsensymmetrisch zur y-Achse' : 'punktsymmetrisch zum Ursprung',
        distractors: [gerade ? 'punktsymmetrisch zum Ursprung' : 'achsensymmetrisch zur y-Achse', 'achsensymmetrisch zur x-Achse', 'keine Symmetrie'],
        explanation: `Der Exponent ${n} ist ${gerade ? 'gerade: f(−x) = f(x)' : 'ungerade: f(−x) = −f(x)'}.`,
        fachwissen: {
          text: 'Potenzfunktionen f(x) = xⁿ mit geradem n sind achsensymmetrisch zur y-Achse (f(−x) = f(x)), mit ungeradem n punktsymmetrisch zum Ursprung (f(−x) = −f(x)).',
          quelle: 'Wikipedia: Potenzfunktion',
          url: 'https://de.wikipedia.org/wiki/Potenzfunktion',
        },
        dedupeKey: `ma:k9:potfkt:sym:${n}`,
      })
    },
  ),
}

export const k9Hoehensatz: Topic = {
  id: 'k9-lb3-hoehensatz',
  title: 'Höhensatz: Höhe im rechtwinkligen Dreieck',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Höhensatz', 'rechtwinkliges Dreieck', 'Pythagoras', 'Höhe'],
  fachwissen: {
    text: 'Im rechtwinkligen Dreieck gilt der Höhensatz: Das Quadrat der Höhe auf die Hypotenuse ist gleich dem Produkt der Hypotenusenabschnitte: h² = p·q. Zusammen mit Katheten- und Pythagorassatz bildet er die Satzgruppe des Pythagoras.',
    quelle: 'Wikipedia: Satzgruppe des Pythagoras',
    url: 'https://de.wikipedia.org/wiki/Satzgruppe_des_Pythagoras',
  },
  generate: (rng: Rng) => {
    for (;;) {
      const h = randInt(rng, 2, 15)
      const divs = Array.from({ length: h - 1 }, (_, i) => i + 1).filter((d) => (h * h) % d === 0 && d < h)
      const p = pick(rng, divs)
      const q = (h * h) / p
      if (q > 60) continue
      const kind = pick(rng, ['h', 'q', 'A'] as const)
      if (kind === 'h') {
        return valueTask({
          question: `In einem rechtwinkligen Dreieck teilt die Höhe die Hypotenuse in die Abschnitte p = ${p} cm und q = ${minus(q)} cm. Berechne die Höhe h.`,
          unit: 'cm',
          answerKind: 'integer',
          value: h,
          solution: `h = ${h} cm`,
          explanation: `h² = p·q = ${p}·${minus(q)} = ${h * h}, also h = ${h} cm.`,
          dedupeKey: `ma:k9:hoehe:h:${p}:${q}`,
        })
      }
      if (kind === 'q') {
        return valueTask({
          question: `In einem rechtwinkligen Dreieck ist die Höhe auf die Hypotenuse h = ${h} cm lang, ein Hypotenusenabschnitt ist p = ${p} cm. Wie lang ist der andere Abschnitt q?`,
          unit: 'cm',
          answerKind: 'integer',
          value: q,
          solution: `q = ${minus(q)} cm`,
          explanation: `h² = p·q ⇒ q = h²/p = ${h * h}/${p} = ${minus(q)} cm.`,
          dedupeKey: `ma:k9:hoehe:q:${h}:${p}`,
        })
      }
      const A = ((p + q) * h) / 2
      return valueTask({
        question: `Die Höhe eines rechtwinkligen Dreiecks teilt die Hypotenuse in p = ${p} cm und q = ${minus(q)} cm. Berechne den Flächeninhalt des Dreiecks.`,
        unit: 'cm²',
        answerKind: 'decimal',
        value: A,
        solution: `${formatDe(A)} cm²`,
        explanation: `h = √(p·q) = √${h * h} = ${h} cm, c = p + q = ${p + q} cm. A = c·h/2 = ${p + q}·${h}/2 = ${formatDe(A)} cm².`,
        dedupeKey: `ma:k9:hoehe:A:${p}:${q}`,
      })
    }
  },
}

export const k9Spannweite: Topic = {
  id: 'k9-lb4-spannweite',
  title: 'Spannweite einer Datenreihe',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Spannweite', 'Streuung', 'Daten', 'Maximum', 'Minimum'],
  fachwissen: {
    text: 'Die Spannweite ist ein einfaches Streuungsmaß: größter minus kleinster Wert. Sie ist leicht zu berechnen, aber stark ausreißeranfällig. Ergänzend betrachtet man Varianz und Standardabweichung.',
    quelle: 'Wikipedia: Spannweite (Statistik)',
    url: 'https://de.wikipedia.org/wiki/Spannweite_(Statistik)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const n = randInt(rng, 6, 8)
      const nums: number[] = []
      for (let i = 0; i < n; i++) nums.push(roundTo(randInt(rng, -80, 300) / 10, 1))
      const min = Math.min(...nums)
      const max = Math.max(...nums)
      const value = roundTo(max - min, 1)
      return valueTask({
        question: `Tagestiefsttemperaturen einer Woche in °C: ${nums.map(fmtSigned).join('; ')}. Berechne die Spannweite.`,
        unit: '°C',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} °C`,
        explanation: `Maximum ${fmtSigned(max)} °C, Minimum ${fmtSigned(min)} °C: Spannweite = ${fmtSigned(max)} − ${min < 0 ? `(${fmtSigned(min)})` : fmtSigned(min)} = ${formatDe(value)} °C.`,
        dedupeKey: `ma:k9:spann:temp:${nums.join(',')}`,
      })
    },
    (rng: Rng) => {
      const mk = () => Array.from({ length: 6 }, () => randInt(rng, 1, 6))
      let a = mk()
      let b = mk()
      while (Math.max(...a) - Math.min(...a) === Math.max(...b) - Math.min(...b)) {
        a = mk()
        b = mk()
      }
      const ra = Math.max(...a) - Math.min(...a)
      const rb = Math.max(...b) - Math.min(...b)
      return appliedMc(rng, {
        question: `Noten Gruppe A: ${a.join(', ')}. Noten Gruppe B: ${b.join(', ')}. Welche Aussage über die Spannweiten stimmt?`,
        correct: ra > rb ? 'Gruppe A hat die größere Spannweite.' : 'Gruppe B hat die größere Spannweite.',
        distractors: [ra > rb ? 'Gruppe B hat die größere Spannweite.' : 'Gruppe A hat die größere Spannweite.', 'Beide Gruppen haben dieselbe Spannweite.'],
        explanation: `Spannweite A = ${Math.max(...a)} − ${Math.min(...a)} = ${ra}, Spannweite B = ${Math.max(...b)} − ${Math.min(...b)} = ${rb}.`,
        fachwissen: {
          text: 'Die Spannweite (größter minus kleinster Wert) ist das einfachste Streuungsmaß. Sie hängt nur von den beiden Extremwerten ab und reagiert daher stark auf Ausreißer.',
          quelle: 'Wikipedia: Spannweite (Statistik)',
          url: 'https://de.wikipedia.org/wiki/Spannweite_(Statistik)',
        },
        dedupeKey: `ma:k9:spann:vgl:${a.join('')}:${b.join('')}`,
      })
    },
    (rng: Rng) => {
      const min = randInt(rng, 140, 160)
      const R = randInt(rng, 15, 40)
      const n = randInt(rng, 18, 28)
      return valueTask({
        question: `In einer Klasse mit ${n} Kindern ist das kleinste Kind ${min} cm groß. Die Spannweite der Körpergrößen beträgt ${R} cm. Wie groß ist das größte Kind?`,
        unit: 'cm',
        answerKind: 'integer',
        value: min + R,
        solution: `${min + R} cm`,
        explanation: `Spannweite = Maximum − Minimum ⇒ Maximum = ${min} + ${R} = ${min + R} cm.`,
        dedupeKey: `ma:k9:spann:max:${min}:${R}`,
      })
    },
  ),
}

export const k9Standardabweichung: Topic = {
  id: 'k9-lb4-standardabweichung',
  title: 'Standardabweichung (kleine Datenreihe)',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Standardabweichung', 'Varianz', 'Streuung', 'Daten'],
  fachwissen: {
    text: 'Die Varianz ist der Mittelwert der quadrierten Abweichungen vom arithmetischen Mittel; die Standardabweichung ist die positive Quadratwurzel daraus. Sie misst, wie stark die Werte um den Mittelwert streuen.',
    quelle: 'Wikipedia: Standardabweichung',
    url: 'https://de.wikipedia.org/wiki/Standardabweichung',
  },
  generate: (rng: Rng) => {
    // Vier Werte mit ganzzahligem Mittelwert; σ wird gerundet.
    const n = pick(rng, [4, 5])
    const data = Array.from({ length: n }, () => randInt(rng, 2, 20))
    const rest = data.reduce((a, b) => a + b, 0) % n
    if (rest !== 0) data[n - 1] = data[n - 1]! + (n - rest)
    const mean = data.reduce((a, b) => a + b, 0) / n
    const sq = data.map((x) => (x - mean) ** 2)
    const variance = sq.reduce((a, b) => a + b, 0) / n
    const askVar = rng() < 0.4
    const sigma = roundTo(Math.sqrt(variance), 2)
    return valueTask({
      question: askVar
        ? `Berechne die Varianz der Datenreihe ${data.join(', ')} (Division durch die Anzahl der Werte).`
        : `Berechne die Standardabweichung der Datenreihe ${data.join(', ')} (Division durch die Anzahl der Werte). Runde auf zwei Nachkommastellen.`,
      answerKind: 'decimal',
      value: askVar ? roundTo(variance, 4) : sigma,
      eps: askVar ? 1e-6 : 0.006,
      solution: askVar ? formatDe(roundTo(variance, 4)) : formatDe(sigma),
      explanation: `Mittelwert ${formatDe(mean)}. Quadrierte Abweichungen: ${sq.map((s) => formatDe(s)).join(' + ')} = ${formatDe(sq.reduce((a, b) => a + b, 0))}; geteilt durch ${n}: Varianz ${formatDe(roundTo(variance, 4))}.${askVar ? '' : ` σ = √${formatDe(roundTo(variance, 4))} ≈ ${formatDe(sigma)}.`}`,
      dedupeKey: `ma:k9:sigma:${[...data].sort((a, b) => a - b).join(',')}:${askVar}`,
    })
  },
}

// =============================================================================
// Klasse 10 — Ergänzungen
// =============================================================================

export const k10SinusWert: Topic = {
  id: 'k10-lb1-sinus-wert',
  title: 'Sinusfunktion: Funktionswert',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Sinus', 'periodisch', 'Trigonometrie', 'Funktionswert'],
  fachwissen: {
    text: 'Die Sinusfunktion beschreibt periodische Vorgänge (Schwingungen, Gezeiten). Im Gradmaß gilt sin(0°)=0, sin(30°)=1/2, sin(90°)=1. Parameter in a·sin(b(x−c))+d steuern Amplitude, Periode, Phasenverschiebung und Verschiebung.',
    quelle: 'Wikipedia: Sinus und Kosinus',
    url: 'https://de.wikipedia.org/wiki/Sinus_und_Kosinus',
  },
  generate: (rng: Rng) => {
    const exact: Record<number, string> = {
      0: '0',
      30: '1/2',
      45: '√2/2',
      60: '√3/2',
      90: '1',
    }
    const sinExact = (deg: number): string => {
      const d = ((deg % 360) + 360) % 360
      const ref = d <= 90 ? d : d <= 180 ? 180 - d : d <= 270 ? d - 180 : 360 - d
      const v = exact[ref]!
      return d > 180 && v !== '0' ? `−${v}` : v
    }
    if (rng() < 0.6) {
      const base = pick(rng, [30, 45, 60, 90])
      const quadrant = randInt(rng, 0, 3)
      const turns = pick(rng, [0, 0, 1, -1])
      const ref = [base, 180 - base, 180 + base, 360 - base][quadrant]!
      const deg = ref + 360 * turns
      const correct = sinExact(deg)
      return choicePickTask({
        question: `Welchen exakten Wert hat sin(${deg < 0 ? `−${-deg}` : deg}°)?`,
        choices: shuffleArr(rng, [
          correct,
          ...shuffleArr(
            rng,
            ['1/2', '−1/2', '√2/2', '−√2/2', '√3/2', '−√3/2', '1', '−1', '0'].filter((x) => x !== correct),
          ).slice(0, 3),
        ]),
        correct,
        solution: correct,
        explanation: `Bezugswinkel ${base}° mit sin(${base}°) = ${exact[base]}. Zwischen 180° und 360° ist der Sinus negativ, zwischen 0° und 180° positiv${turns ? `; volle Umdrehungen (${minus(360 * turns)}°) ändern den Wert nicht` : ''}. Also sin(${deg < 0 ? `−${-deg}` : deg}°) = ${correct}.`,
        dedupeKey: `ma:k10:sin:exakt:${deg}`,
      })
    }
    const alpha = randInt(rng, 5, 85)
    const variant = pick(rng, ['supp', 'neg'] as const)
    return valueTask({
      question:
        variant === 'supp'
          ? `Es gilt sin(${alpha}°) ≈ ${formatDe(roundTo(Math.sin((alpha * Math.PI) / 180), 4))}. Welcher zweite Winkel zwischen 90° und 180° hat denselben Sinuswert?`
          : `Es gilt sin(${alpha}°) ≈ ${formatDe(roundTo(Math.sin((alpha * Math.PI) / 180), 4))}. Welcher Winkel zwischen 270° und 360° hat den Sinuswert −${formatDe(roundTo(Math.sin((alpha * Math.PI) / 180), 4))}?`,
      unit: '°',
      answerKind: 'integer',
      value: variant === 'supp' ? 180 - alpha : 360 - alpha,
      solution: `${variant === 'supp' ? 180 - alpha : 360 - alpha}°`,
      explanation:
        variant === 'supp'
          ? `Am Einheitskreis gilt sin(180° − α) = sin(α): 180° − ${alpha}° = ${180 - alpha}°.`
          : `Am Einheitskreis gilt sin(360° − α) = −sin(α): 360° − ${alpha}° = ${360 - alpha}°.`,
      dedupeKey: `ma:k10:sin:winkel:${alpha}:${variant}`,
    })
  },
}

export const k10ExpGleichung: Topic = {
  id: 'k10-lb4-exp-gleichung',
  title: 'Exponentialgleichung aˣ = b',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Exponentialgleichung', 'Logarithmus', 'Potenz', 'lösen'],
  fachwissen: {
    text: 'Gleichungen der Form aˣ = b löst man durch Logarithmen: x = log_a(b) = ln(b)/ln(a), oder indem man b als Potenz derselben Basis schreibt. Die Logarithmusfunktion ist die Umkehrfunktion der Exponentialfunktion.',
    quelle: 'Wikipedia: Exponentialgleichung',
    url: 'https://de.wikipedia.org/wiki/Exponentialgleichung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      for (;;) {
        const a = pick(rng, [2, 3, 5, 1.5, 1.05])
        const b = randInt(rng, 3, 60)
        if (Number.isInteger(Math.log(b) / Math.log(a))) continue
        const x = roundTo(Math.log(b) / Math.log(a), 2)
        return valueTask({
          question: `Löse die Gleichung ${formatDe(a)}ˣ = ${minus(b)}. Runde auf zwei Nachkommastellen.`,
          answerKind: 'decimal',
          value: x,
          eps: 0.006,
          solution: `x ≈ ${formatDe(x)}`,
          explanation: `Logarithmieren: x = ln(${minus(b)}) / ln(${formatDe(a)}) ≈ ${formatDe(x)}.`,
          dedupeKey: `ma:k10:expgl:log:${a}:${b}`,
        })
      }
    },
    (rng: Rng) => {
      const K0 = pick(rng, [500, 1000, 2000, 5000])
      const pct = pick(rng, [2, 3, 4, 5])
      const factor = pick(rng, [1.5, 2])
      const n = roundTo(Math.log(factor) / Math.log(1 + pct / 100), 1)
      return valueTask({
        question: `Ein Kapital von ${K0} € wird jährlich mit ${pct} % verzinst (Zinseszins). Nach wie vielen Jahren hat es sich ${factor === 2 ? 'verdoppelt' : 'auf das 1,5-Fache erhöht'}? Runde auf eine Nachkommastelle.`,
        unit: 'Jahre',
        answerKind: 'decimal',
        value: n,
        eps: 0.06,
        solution: `≈ ${formatDe(n)} Jahre`,
        explanation: `${K0} · ${formatDe(1 + pct / 100)}ⁿ = ${formatDe(factor * K0)} ⇒ ${formatDe(1 + pct / 100)}ⁿ = ${formatDe(factor)} ⇒ n = ln(${formatDe(factor)}) / ln(${formatDe(1 + pct / 100)}) ≈ ${formatDe(n)}.`,
        dedupeKey: `ma:k10:expgl:zins:${pct}:${factor}`,
      })
    },
    (rng: Rng) => {
      const a = pick(rng, [2, 3, 5])
      const k = randInt(rng, 2, 5)
      const x = randInt(rng, 1, 4)
      const c = nonZero(rng, -3, 3)
      const rhs = k * a ** (x + c)
      if (!Number.isInteger(rhs) || rhs > 5000) return k10ExpGleichung.generate(rng)
      return valueTask({
        question: `Löse die Gleichung ${k} · ${minus(a)}^(x ${c < 0 ? `− ${-c}` : `+ ${minus(c)}`}) = ${rhs}.`,
        answerKind: 'integer',
        value: x,
        solution: `x = ${minus(x)}`,
        explanation: `Durch ${k} teilen: ${minus(a)}^(x ${c < 0 ? `− ${-c}` : `+ ${minus(c)}`}) = ${formatDe(rhs / k)} = ${minus(a)}^${x + c < 0 ? `(${minus(x + c)})` : x + c}. Exponentenvergleich: x ${c < 0 ? `− ${-c}` : `+ ${minus(c)}`} = ${minus(x + c)} ⇒ x = ${minus(x)}.`,
        dedupeKey: `ma:k10:expgl:vgl:${a}:${k}:${c}:${x}`,
      })
    },
  ),
}

export const k10Logarithmus: Topic = {
  id: 'k10-lb4-logarithmus',
  title: 'Logarithmus berechnen',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Logarithmus', 'Umkehrfunktion', 'Exponentialfunktion'],
  fachwissen: {
    text: 'Der Logarithmus logₐ(b) beantwortet: „Mit welchem Exponenten muss man a potenzieren, um b zu erhalten?“ Es gilt a^(logₐ b) = b und logₐ(aˣ) = x. Häufige Basen: 10 (Zehnerlogarithmus) und e (natürlicher Logarithmus ln).',
    quelle: 'Wikipedia: Logarithmus',
    url: 'https://de.wikipedia.org/wiki/Logarithmus',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = pick(rng, [2, 3, 5, 10])
      const x = pick(rng, [-3, -2, -1])
      const d = a ** -x
      return valueTask({
        question: `Berechne log_${minus(a)}(1/${minus(d)}).`,
        answerKind: 'integer',
        value: x,
        solution: minus(x),
        explanation: `1/${minus(d)} = ${minus(a)}^(${minus(x)}), daher log_${minus(a)}(1/${minus(d)}) = ${minus(x)}.`,
        dedupeKey: `ma:k10:log:neg:${a}:${x}`,
      })
    },
    (rng: Rng) => {
      const [base, arg, val] = pick(rng, [
        [4, 2, 0.5],
        [9, 3, 0.5],
        [16, 4, 0.5],
        [8, 2, 1 / 3],
        [27, 3, 1 / 3],
        [16, 8, 0.75],
        [4, 8, 1.5],
        [9, 27, 1.5],
        [25, 125, 1.5],
      ] as Array<[number, number, number]>)
      const shown = roundTo(val, 2)
      return valueTask({
        question: `Berechne log_${base}(${arg}). Runde gegebenenfalls auf zwei Nachkommastellen.`,
        answerKind: 'decimal',
        value: shown,
        eps: 0.006,
        solution: formatDe(shown),
        explanation: `${arg} = ${base}^${val === 1 / 3 ? '(1/3)' : formatDe(val)}, denn ${val === 0.5 ? `√${base} = ${arg}` : val === 1 / 3 ? `∛${base} = ${arg}` : `${base}^${formatDe(val)} = ${arg}`}. Also log_${base}(${arg}) ≈ ${formatDe(shown)}.`,
        dedupeKey: `ma:k10:log:bruch:${base}:${arg}`,
      })
    },
    (rng: Rng) => {
      const [u, v] = pick(rng, [
        [20, 5],
        [25, 4],
        [50, 2],
        [200, 5],
        [250, 4],
        [125, 8],
        [40, 25],
      ] as Array<[number, number]>)
      const value = Math.round(Math.log10(u * v))
      return valueTask({
        question: `Berechne ohne Taschenrechner: lg(${u}) + lg(${v}).`,
        answerKind: 'integer',
        value,
        solution: `${minus(value)}`,
        explanation: `Logarithmengesetz: lg(${u}) + lg(${v}) = lg(${u}·${v}) = lg(${u * v}) = ${minus(value)}.`,
        dedupeKey: `ma:k10:log:gesetz:${u}:${v}`,
      })
    },
  ),
}

export const k10FolgeExplizit: Topic = {
  id: 'k10-lb4-folge',
  title: 'Glied einer Zahlenfolge',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Zahlenfolge', 'explizit', 'Bildungsvorschrift', 'Glied'],
  fachwissen: {
    text: 'Eine Zahlenfolge ordnet jeder natürlichen Zahl n einen Wert aₙ zu. Explizite Vorschriften geben aₙ direkt an (z. B. aₙ = 2n+1); rekursive Vorschriften bestimmen aₙ aus vorherigen Gliedern. Folgen sind spezielle Funktionen ℕ→ℝ und bereiten den Grenzwertbegriff vor.',
    quelle: 'Wikipedia: Folge (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Folge_(Mathematik)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a1 = randInt(rng, -10, 20)
      const d = nonZero(rng, -6, 9)
      const n = randInt(rng, 8, 40)
      const value = a1 + (n - 1) * d
      const seq = [0, 1, 2, 3].map((i) => minus(a1 + i * d)).join('; ')
      return valueTask({
        question: `Die Zahlenfolge ${seq}; … wächst immer um denselben Wert. Berechne das ${n}. Glied a_${n}.`,
        answerKind: 'integer',
        value,
        solution: minus(value),
        explanation: `Differenz d = ${minus(d)}, a₁ = ${minus(a1)}. aₙ = a₁ + (n − 1)·d ⇒ a_${n} = ${minus(a1)} + ${n - 1}·${num(d)} = ${minus(value)}.`,
        dedupeKey: `ma:k10:folge:arith:${a1}:${d}:${n}`,
      })
    },
    (rng: Rng) => {
      const a1 = pick(rng, [1, 2, 3, 5])
      const q = pick(rng, [2, 3, -2])
      const n = randInt(rng, 5, 8)
      const value = a1 * q ** (n - 1)
      const seq = [0, 1, 2].map((i) => minus(a1 * q ** i)).join('; ')
      return valueTask({
        question: `Bei der Folge ${seq}; … wird jedes Glied mit demselben Faktor multipliziert. Berechne a_${n}.`,
        answerKind: 'integer',
        value,
        solution: minus(value),
        explanation: `Quotient q = ${minus(q)}, a₁ = ${a1}. aₙ = a₁ · qⁿ⁻¹ ⇒ a_${n} = ${a1} · ${num(q)}^${n - 1} = ${minus(value)}.`,
        dedupeKey: `ma:k10:folge:geo:${a1}:${q}:${n}`,
      })
    },
    (rng: Rng) => {
      const a1 = randInt(rng, 1, 5)
      const m = pick(rng, [2, 3])
      const c = nonZero(rng, -3, 4)
      const vals = [a1]
      for (let i = 1; i < 4; i++) vals.push(m * vals[i - 1]! + c)
      return valueTask({
        question: `Eine Folge ist rekursiv gegeben: a₁ = ${a1}, aₙ₊₁ = ${m}·aₙ ${c < 0 ? `− ${-c}` : `+ ${minus(c)}`}. Berechne a₄.`,
        answerKind: 'integer',
        value: vals[3]!,
        solution: minus(vals[3]!),
        explanation: `a₂ = ${minus(vals[1]!)}, a₃ = ${minus(vals[2]!)}, a₄ = ${m}·${num(vals[2]!)} ${c < 0 ? `− ${-c}` : `+ ${minus(c)}`} = ${minus(vals[3]!)}.`,
        dedupeKey: `ma:k10:folge:rek:${a1}:${m}:${c}`,
      })
    },
  ),
}

export const k10Sinussatz: Topic = {
  id: 'k10-lb3-sinussatz',
  title: 'Sinussatz: Seiten und Winkel berechnen',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Sinussatz', 'Dreieck', 'Trigonometrie', 'Seite'],
  fachwissen: {
    text: 'Der Sinussatz lautet a/sin(α) = b/sin(β) = c/sin(γ) = 2R. Er ermöglicht Berechnungen in allgemeinen (nicht notwendig rechtwinkligen) Dreiecken, wenn Winkel und gegenüberliegende Seiten bekannt sind.',
    quelle: 'Wikipedia: Sinussatz',
    url: 'https://de.wikipedia.org/wiki/Sinussatz',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const alpha = randInt(rng, 25, 80)
      const beta = randInt(rng, 20, 150 - alpha)
      const a = randInt(rng, 4, 15)
      const b = roundTo((a * Math.sin(beta * DEG)) / Math.sin(alpha * DEG), 2)
      return valueTask({
        question: `In einem Dreieck ABC sind a = ${minus(a)} cm, α = ${alpha}° und β = ${beta}°. Berechne die Seite b. Runde auf zwei Nachkommastellen.`,
        unit: 'cm',
        answerKind: 'decimal',
        value: b,
        eps: 0.011,
        solution: `${formatDe(b)} cm`,
        explanation: `b/sin(β) = a/sin(α) ⇒ b = ${minus(a)} · sin(${beta}°) / sin(${alpha}°) ≈ ${formatDe(b)} cm.`,
        dedupeKey: `ma:k10:sinussatz:b:${a}:${alpha}:${beta}`,
      })
    },
    (rng: Rng) => {
      const alpha = randInt(rng, 40, 100)
      const a = randInt(rng, 8, 16)
      const b = randInt(rng, 3, a - 1)
      const beta = roundTo(Math.asin((b * Math.sin(alpha * DEG)) / a) / DEG, 1)
      return valueTask({
        question: `In einem Dreieck ABC sind a = ${minus(a)} cm, b = ${minus(b)} cm und α = ${alpha}°. Berechne den Winkel β in Grad. Runde auf eine Nachkommastelle.`,
        unit: '°',
        answerKind: 'decimal',
        value: beta,
        eps: 0.11,
        solution: `${formatDe(beta)}°`,
        explanation: `sin(β) = b · sin(α) / a = ${minus(b)} · sin(${alpha}°) / ${minus(a)} ≈ ${formatDe(roundTo((b * Math.sin(alpha * DEG)) / a, 4))}. Da b < a, ist β spitz: β ≈ ${formatDe(beta)}°.`,
        dedupeKey: `ma:k10:sinussatz:beta:${a}:${b}:${alpha}`,
      })
    },
    (rng: Rng) => {
      const alpha = randInt(rng, 30, 70)
      const gamma = randInt(rng, 30, 110)
      const beta = 180 - alpha - gamma
      if (beta < 15) return k10Sinussatz.generate(rng)
      const c = randInt(rng, 5, 20)
      const a = roundTo((c * Math.sin(alpha * DEG)) / Math.sin(gamma * DEG), 2)
      return valueTask({
        question: `Von einem Dreieck ABC kennt man c = ${minus(c)} m, α = ${alpha}° und β = ${beta}°. Wie lang ist die Seite a? Runde auf zwei Nachkommastellen.`,
        unit: 'm',
        answerKind: 'decimal',
        value: a,
        eps: 0.011,
        solution: `${formatDe(a)} m`,
        explanation: `γ = 180° − ${alpha}° − ${beta}° = ${gamma}°. a = c · sin(α) / sin(γ) = ${minus(c)} · sin(${alpha}°) / sin(${gamma}°) ≈ ${formatDe(a)} m.`,
        dedupeKey: `ma:k10:sinussatz:a:${c}:${alpha}:${beta}`,
      })
    },
  ),
}

export const k10Kosinussatz: Topic = {
  id: 'k10-lb3-kosinussatz',
  title: 'Kosinussatz: Seite berechnen',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Kosinussatz', 'Dreieck', 'Trigonometrie', 'Seite'],
  fachwissen: {
    text: 'Der Kosinussatz verallgemeinert den Satz des Pythagoras: c² = a² + b² − 2ab·cos(γ). Für γ = 90° ist cos(γ)=0 und man erhält c² = a² + b². Er eignet sich, wenn zwei Seiten und der eingeschlossene Winkel bekannt sind.',
    quelle: 'Wikipedia: Kosinussatz',
    url: 'https://de.wikipedia.org/wiki/Kosinussatz',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 3, 14)
      const b = randInt(rng, 3, 14)
      const gamma = pick(rng, [35, 40, 50, 55, 65, 70, 75, 80, 100, 110, 115, 120, 130, 140])
      const c = roundTo(Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(gamma * DEG)), 2)
      return valueTask({
        question: `In einem Dreieck ABC sind a = ${minus(a)} cm, b = ${minus(b)} cm und der eingeschlossene Winkel γ = ${gamma}°. Berechne die Seite c. Runde auf zwei Nachkommastellen.`,
        unit: 'cm',
        answerKind: 'decimal',
        value: c,
        eps: 0.011,
        solution: `${formatDe(c)} cm`,
        explanation: `c² = a² + b² − 2ab · cos(γ) = ${a * a} + ${b * b} − ${2 * a * b} · cos(${gamma}°) ≈ ${formatDe(roundTo(c * c, 2))}, also c ≈ ${formatDe(c)} cm.`,
        dedupeKey: `ma:k10:kosinussatz:c:${Math.min(a, b)}:${Math.max(a, b)}:${gamma}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 5, 12)
      let b = randInt(rng, 3, 10)
      while (b === a) b = randInt(rng, 3, 10)
      const alpha = pick(rng, [40, 50, 60, 70, 75])
      const lang = rng() < 0.5
      const w = lang ? 180 - alpha : alpha
      const e = roundTo(Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(w * DEG)), 2)
      return valueTask({
        question: `Ein Parallelogramm hat die Seiten a = ${a} cm und b = ${b} cm; sie schließen den Winkel α = ${alpha}° ein. Berechne die ${lang ? 'längere' : 'kürzere'} Diagonale. Runde auf zwei Nachkommastellen.`,
        unit: 'cm',
        answerKind: 'decimal',
        value: e,
        eps: 0.011,
        solution: `${formatDe(e)} cm`,
        explanation: `Die ${lang ? 'längere' : 'kürzere'} Diagonale liegt im Teildreieck dem Winkel ${w}° gegenüber${lang ? ` (Nachbarwinkel 180° − ${alpha}°)` : ''}: e² = ${a}² + ${b}² − 2 · ${a} · ${b} · cos(${w}°) ≈ ${formatDe(roundTo(e * e, 2))}, also e ≈ ${formatDe(e)} cm.`,
        dedupeKey: `ma:k10:kosinussatz:diag:${a}:${b}:${alpha}:${lang}`,
      })
    },
    (rng: Rng) => {
      const s1 = randInt(rng, 20, 90)
      const s2 = randInt(rng, 20, 90)
      const w = pick(rng, [40, 55, 65, 75, 95, 105, 120])
      const d = roundTo(Math.sqrt(s1 * s1 + s2 * s2 - 2 * s1 * s2 * Math.cos(w * DEG)), 1)
      return valueTask({
        question: `Von einem Aussichtspunkt sind zwei Bojen ${s1} m und ${s2} m entfernt. Die Sichtlinien zu den Bojen schließen einen Winkel von ${w}° ein. Wie weit sind die Bojen voneinander entfernt? Runde auf eine Nachkommastelle.`,
        unit: 'm',
        answerKind: 'decimal',
        value: d,
        eps: 0.11,
        solution: `${formatDe(d)} m`,
        explanation: `d² = ${s1}² + ${s2}² − 2 · ${s1} · ${s2} · cos(${w}°) ⇒ d ≈ ${formatDe(d)} m.`,
        dedupeKey: `ma:k10:kosinussatz:bojen:${s1}:${s2}:${w}`,
      })
    },
  ),
}

export const k10VarianzZufall: Topic = {
  id: 'k10-lb2-varianz',
  title: 'Varianz einer Zufallsgröße',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Varianz', 'Zufallsgröße', 'Streuung', 'Erwartungswert'],
  fachwissen: {
    text: 'Die Varianz misst die Streuung einer Zufallsgröße um ihren Erwartungswert. Für eine diskrete Zufallsgröße mit Werten xᵢ und Wahrscheinlichkeiten pᵢ gilt Var(X) = Σ pᵢ(xᵢ−μ)². Die Standardabweichung ist σ = √Var(X).',
    quelle: 'Wikipedia: Varianz',
    url: 'https://de.wikipedia.org/wiki/Varianz',
  },
  generate: (rng: Rng) => {
    const xs = shuffleArr(rng, [-2, -1, 0, 1, 2, 3, 4, 5, 6, 8, 10]).slice(0, 3).sort((a, b) => a - b)
    const p1 = randInt(rng, 1, 7)
    const p2 = randInt(rng, 1, 9 - p1)
    const ps = [p1, p2, 10 - p1 - p2].map((p) => p / 10)
    const mu = roundTo(xs.reduce((s, x, i) => s + x * ps[i]!, 0), 6)
    const variance = roundTo(xs.reduce((s, x, i) => s + ps[i]! * (x - mu) ** 2, 0), 4)
    const askSigma = rng() < 0.35
    const sigma = roundTo(Math.sqrt(variance), 2)
    const table = xs.map((x, i) => `P(X = ${x < 0 ? `−${-x}` : x}) = ${formatDe(ps[i]!)}`).join('; ')
    return valueTask({
      question: askSigma
        ? `Eine Zufallsgröße X hat die Verteilung ${table}. Berechne die Standardabweichung σ. Runde auf zwei Nachkommastellen.`
        : `Eine Zufallsgröße X hat die Verteilung ${table}. Berechne die Varianz Var(X).`,
      answerKind: 'decimal',
      value: askSigma ? sigma : variance,
      eps: askSigma ? 0.006 : 1e-4,
      solution: formatDe(askSigma ? sigma : variance),
      explanation: `E(X) = ${signedNum(mu)}. Var(X) = ${xs.map((x, i) => `${formatDe(ps[i]!)} · (${signedNum(x)} − ${parenNum(mu)})²`).join(' + ')} = ${formatDe(variance)}.${askSigma ? ` σ = √${formatDe(variance)} ≈ ${formatDe(sigma)}.` : ''}`,
      dedupeKey: `ma:k10:varianz:${xs.join(',')}:${ps.join(',')}:${askSigma}`,
    })
  },
}

// =============================================================================
// Klasse 11/12 GK — Ergänzungen (Lehrplan-Lernbereiche)
// =============================================================================

export const k1112Extremum: Topic = {
  id: 'k1112-lb1-extremum',
  title: 'Extremstellen ganzrationaler Funktionen',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Extremum', 'Ableitung', 'Hochpunkt', 'Tiefpunkt', 'Differentialrechnung'],
  fachwissen: {
    text: 'Notwendige Bedingung für eine lokale Extremstelle x₀: f′(x₀) = 0. Hinreichend ist zusätzlich f″(x₀) ≠ 0: f″(x₀) < 0 ergibt einen Hochpunkt, f″(x₀) > 0 einen Tiefpunkt. Den y-Wert des Extrempunkts erhält man durch Einsetzen von x₀ in f.',
    quelle: 'Wikipedia: Extremwert',
    url: 'https://de.wikipedia.org/wiki/Extremwert',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      // f(x) = −x³ + 3k²x + c: Hochpunkt bei x = k
      const k = randInt(rng, 1, 3)
      const c = randInt(rng, -6, 6)
      const ys = 2 * k ** 3 + c
      return valueTask({
        question: `Gegeben ist f(x) = −x³ + ${3 * k * k}x${term(c, '')}. Berechne die y-Koordinate des Hochpunkts.`,
        answerKind: 'integer',
        value: ys,
        solution: `y = ${minus(ys)}`,
        explanation: `f′(x) = −3x² + ${3 * k * k} = 0 ⇒ x = ±${k}. f″(x) = −6x: f″(${k}) = ${minus(-6 * k)} < 0 ⇒ Hochpunkt bei x = ${k}. f(${k}) = −${k ** 3} + ${3 * k ** 3}${term(c, '')} = ${minus(ys)}.`,
        dedupeKey: `ma:k1112:extr:hochwert:${k}:${c}`,
      })
    },
    (rng: Rng) => {
      // f(x) = x³ − 3k²x + c: Extremstellen ±k
      const k = randInt(rng, 1, 4)
      const c = randInt(rng, -6, 6)
      const hoch = rng() < 0.5
      const xs = hoch ? -k : k
      return valueTask({
        question: `Gegeben ist f(x) = x³ − ${3 * k * k}x${term(c, '')}. An welcher Stelle x hat der Graph seinen ${hoch ? 'Hochpunkt' : 'Tiefpunkt'}?`,
        answerKind: 'integer',
        value: xs,
        solution: `x = ${minus(xs)}`,
        explanation: `f′(x) = 3x² − ${3 * k * k} = 0 ⇒ x = ±${k}. f″(x) = 6x: f″(${minus(xs)}) = ${minus(6 * xs)} ${hoch ? '< 0 ⇒ Hochpunkt' : '> 0 ⇒ Tiefpunkt'} bei x = ${minus(xs)}.`,
        dedupeKey: `ma:k1112:extr:kubisch:${k}:${c}:${hoch}`,
      })
    },
    (rng: Rng) => {
      // f(x) = −x³ + 3(p+q)/2·x² − 3pq·x mit Extremstellen p und q
      const p = randInt(rng, -3, 1)
      const q = p + 2 * randInt(rng, 1, 2)
      const b = (3 * (p + q)) / 2
      const cc = -3 * p * q
      return valueTask({
        question: `Gegeben ist f(x) = −x³${term(b, 'x²')}${term(cc, 'x')}. An welcher Stelle x hat der Graph seinen Hochpunkt?`,
        answerKind: 'integer',
        value: q,
        solution: `x = ${minus(q)}`,
        explanation: `f′(x) = −3x²${term(2 * b, 'x')}${term(cc, '')} = −3${q === 0 ? `x${linFactor(p)}` : `${linFactor(p)}${linFactor(q)}`} = 0 ⇒ x = ${minus(p)} oder x = ${minus(q)}. f″(x) = −6x${term(2 * b, '')}; f″(${minus(q)}) = ${minus(-6 * q + 2 * b)} < 0 ⇒ Hochpunkt bei x = ${minus(q)}.`,
        dedupeKey: `ma:k1112:extr:kubisch2:${p}:${q}`,
      })
    },
  ),
}

export const k1112AbleitungExp: Topic = {
  id: 'k1112-lb1-ableitung-exp',
  title: 'Ableitung von eˣ und ln an einer Stelle',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Ableitung', 'Exponentialfunktion', 'Logarithmus', 'e', 'ln'],
  fachwissen: {
    text: 'Die Ableitung von f(x)=eˣ ist wieder eˣ. Die Ableitung von ln(x) (x>0) ist 1/x. Beide Funktionen gehören zum hilfsmittelfreien Repertoire der Differentialrechnung in der Kursstufe.',
    quelle: 'Wikipedia: Natürlicher Logarithmus',
    url: 'https://de.wikipedia.org/wiki/Nat%C3%BCrlicher_Logarithmus',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = nonZero(rng, -5, 5)
      const k = nonZero(rng, -4, 4)
      const c = randInt(rng, -6, 6)
      const value = a * k + c
      const exp = k === 1 ? 'x' : k === -1 ? '−x' : `${minus(k)}x`
      return valueTask({
        question: `Gegeben ist f(x) = ${a === 1 ? '' : a === -1 ? '−' : minus(a)}e^(${exp})${c === 0 ? '' : term(c, 'x')}. Berechne f′(0).`,
        answerKind: 'integer',
        value,
        solution: minus(value),
        explanation: `f′(x) = ${minus(a * k)}e^(${exp})${c === 0 ? '' : term(c, '')}; mit e⁰ = 1 folgt f′(0) = ${minus(a * k)}${c === 0 ? '' : ` ${c < 0 ? '−' : '+'} ${Math.abs(c)}`} = ${minus(value)}.`,
        dedupeKey: `ma:k1112:abl-exp:${a}:${k}:${c}`,
      })
    },
    (rng: Rng) => {
      const a = nonZero(rng, -6, 6)
      const x0 = pick(rng, [2, 4, 5, 8, 10])
      const value = roundTo(a / x0, 4)
      return valueTask({
        question: `Gegeben ist f(x) = ${a === 1 ? '' : a === -1 ? '−' : minus(a)}ln(x) für x > 0. Berechne die Steigung des Graphen an der Stelle x₀ = ${minus(x0)}.`,
        answerKind: 'decimal',
        value,
        eps: 0.0011,
        solution: formatDe(value),
        explanation: `f′(x) = ${minus(a)}/x, also f′(${minus(x0)}) = ${minus(a)}/${minus(x0)} = ${formatDe(value)}.`,
        dedupeKey: `ma:k1112:abl-ln:${a}:${x0}`,
      })
    },
    (rng: Rng) => {
      const b = randInt(rng, 2, 6)
      const x0 = pick(rng, [1, 2, 3, 5])
      const value = roundTo(1 / x0, 4)
      return valueTask({
        question: `Berechne f′(${minus(x0)}) für f(x) = ln(${minus(b)}x), x > 0.`,
        answerKind: 'decimal',
        value,
        eps: 0.0011,
        solution: formatDe(value),
        explanation: `Kettenregel: f′(x) = ${minus(b)} · 1/(${minus(b)}x) = 1/x. Damit f′(${minus(x0)}) = ${formatDe(value)}.`,
        dedupeKey: `ma:k1112:abl-lnbx:${b}:${x0}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 2, 5)
      const x0 = pick(rng, [1, 2])
      const value = roundTo(a * Math.E ** x0, 2)
      return valueTask({
        question: `Wie groß ist die Steigung der Tangente an den Graphen von f(x) = ${minus(a)}eˣ im Punkt mit x₀ = ${minus(x0)}? Runde auf zwei Nachkommastellen.`,
        answerKind: 'decimal',
        value,
        eps: 0.011,
        solution: formatDe(value),
        explanation: `f′(x) = ${minus(a)}eˣ, also f′(${minus(x0)}) = ${minus(a)}e${x0 === 2 ? '²' : ''} ≈ ${formatDe(value)}.`,
        dedupeKey: `ma:k1112:abl-tangente:${a}:${x0}`,
      })
    },
  ),
}

export const k1112Differenzenquotient: Topic = {
  id: 'k1112-lb1-differenzenquotient',
  title: 'Differenzenquotient zweier Punkte',
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
    const f = (x: number) => a * x * x + b * x
    const y1 = f(x1)
    const y2 = f(x2)
    const value = (y2 - y1) / (x2 - x1)
    return valueTask({
      question: `Für f(x) = ${firstTerm(a, 'x²')}${term(b, 'x')} berechne den Differenzenquotienten zwischen x₁ = ${minus(x1)} und x₂ = ${minus(x2)}.`,
      answerKind: 'integer',
      value,
      solution: `${minus(value)}`,
      explanation: `f(${minus(x2)}) = ${minus(y2)}, f(${minus(x1)}) = ${minus(y1)}. (${minus(y2)} − ${num(y1)}) / (${minus(x2)} − ${num(x1)}) = ${minus(y2 - y1)} / ${x2 - x1} = ${minus(value)}.`,
      dedupeKey: `ma:k1112:dq:${a}:${b}:${x1}:${x2}`,
    })
  },
}

export const k1112MatrixMult: Topic = {
  id: 'k1112-lb2-matrix-mult',
  title: 'Matrizen multiplizieren (2×2)',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Matrix', 'Matrizenmultiplikation', 'lineares Gleichungssystem'],
  fachwissen: {
    text: 'Zwei verkettete Matrizen A (m×n) und B (n×k) ergeben C = A·B vom Typ (m×k). Der Eintrag cᵢⱼ ist das Skalarprodukt der i-ten Zeile von A mit der j-ten Spalte von B. Matrizenmultiplikation ist i. A. nicht kommutativ.',
    quelle: 'Wikipedia: Matrizenmultiplikation',
    url: 'https://de.wikipedia.org/wiki/Matrizenmultiplikation',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const A = [0, 1, 2, 3].map(() => randInt(rng, -4, 5))
      const B = [0, 1, 2, 3].map(() => randInt(rng, -4, 5))
      const i = randInt(rng, 0, 1)
      const j = randInt(rng, 0, 1)
      const value = A[2 * i]! * B[j]! + A[2 * i + 1]! * B[2 + j]!
      const name = ['c₁₁', 'c₁₂', 'c₂₁', 'c₂₂'][2 * i + j]!
      const m = (x: number[]) => `[[${minus(x[0])}, ${minus(x[1])}], [${minus(x[2])}, ${minus(x[3])}]]`
      return valueTask({
        question: `Gegeben sind A = ${m(A)} und B = ${m(B)}. Berechne den Eintrag ${name} von C = A·B.`,
        answerKind: 'integer',
        value,
        solution: minus(value),
        explanation: `${name} = (Zeile ${i + 1} von A) · (Spalte ${j + 1} von B) = ${minus(A[2 * i]!)}·${num(B[j]!)} + ${num(A[2 * i + 1]!)}·${num(B[2 + j]!)} = ${minus(value)}.`,
        dedupeKey: `ma:k1112:matmul:${A.join(',')}:${B.join(',')}:${i}${j}`,
      })
    },
    (rng: Rng) => {
      const pa = randInt(rng, 2, 6)
      const pb = randInt(rng, 2, 6)
      const M = [randInt(rng, 1, 4), randInt(rng, 1, 4), randInt(rng, 1, 4), randInt(rng, 1, 4)]
      const row = randInt(rng, 0, 1)
      const value = M[2 * row]! * pa + M[2 * row + 1]! * pb
      return valueTask({
        question: `Ein Betrieb stellt die Produkte P₁ und P₂ aus den Bauteilen A und B her. Bedarfsmatrix (Zeilen P₁, P₂; Spalten A, B): [[${minus(M[0])}, ${minus(M[1])}], [${minus(M[2])}, ${minus(M[3])}]]. Bauteil A kostet ${pa} €, Bauteil B ${pb} €. Wie hoch sind die Bauteilkosten für ein Stück P${row + 1}?`,
        unit: '€',
        answerKind: 'integer',
        value,
        solution: `${minus(value)} €`,
        explanation: `Zeile P${row + 1} mal Preisvektor: ${M[2 * row]}·${pa} + ${M[2 * row + 1]}·${pb} = ${minus(value)} €.`,
        dedupeKey: `ma:k1112:matmul:bedarf:${M.join(',')}:${pa}:${pb}:${row}`,
      })
    },
  ),
}

export const k1112MatrixLgs: Topic = {
  id: 'k1112-lb2-matrix-lgs',
  title: 'LGS in Matrizenschreibweise lösen',
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
    const askY = rng() < 0.5
    return valueTask({
      question: `Löse A·(x; y) = (${minus(e)}; ${minus(f)}) mit der Koeffizientenmatrix A = [[${minus(a)}, ${minus(b)}], [${minus(c)}, ${minus(d)}]]. Gib ${askY ? 'y' : 'x'} an.`,
      answerKind: 'integer',
      value: askY ? y : x,
      solution: askY ? `y = ${minus(y)}` : `x = ${minus(x)}`,
      explanation: `Das System lautet ${firstTerm(a, 'x')}${term(b, 'y')} = ${minus(e)} und ${firstTerm(c, 'x')}${term(d, 'y')} = ${minus(f)}. det A = ${minus(a * d - b * c)} ≠ 0, also eindeutig lösbar: x = ${minus(x)}, y = ${minus(y)}.`,
      dedupeKey: `ma:k1112:matlgs:${a}:${b}:${c}:${d}:${x}:${y}:${askY}`,
    })
  },
}

export const k1112VektorAdd: Topic = {
  id: 'k1112-lb3-vektor-add',
  title: 'Vektoren addieren',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Vektor', 'Addition', 'analytische Geometrie'],
  fachwissen: {
    text: 'Vektoren werden komponentenweise addiert: (a₁;a₂;a₃)+(b₁;b₂;b₃)=(a₁+b₁;a₂+b₂;a₃+b₃). Geometrisch entspricht das dem Aneinanderhängen von Pfeilen (Parallelogrammregel).',
    quelle: 'Wikipedia: Vektor',
    url: 'https://de.wikipedia.org/wiki/Vektor',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = [nonZero(rng, -6, 6), nonZero(rng, -6, 6), nonZero(rng, -6, 6)]
      const b = [nonZero(rng, -6, 6), nonZero(rng, -6, 6), nonZero(rng, -6, 6)]
      const r = pick(rng, [2, 3, -1])
      const s = pick(rng, [2, -2, -3])
      const res = a.map((x, i) => r * x + s * b[i]!)
      const comb = `${r === -1 ? '−' : r}a ${s < 0 ? '−' : '+'} ${Math.abs(s)}b`
      return appliedMc(rng, {
        question: `Gegeben sind a = ${vec3(a)} und b = ${vec3(b)}. Welcher Vektor ist ${comb}?`,
        correct: vec3(res),
        distractors: [
          vec3(a.map((x, i) => r * x - s * b[i]!)),
          vec3(a.map((x, i) => x + b[i]!)),
          vec3(a.map((x, i) => r * x + s * b[i]! + (i === 1 ? 2 : 0))),
          vec3(a.map((x, i) => s * x + r * b[i]!)),
        ],
        explanation: `Komponentenweise: ${comb} = (${res.map(minus).join('; ')}).`,
        fachwissen: {
          text: 'Vektoren werden komponentenweise vervielfacht und addiert: r·a + s·b = (r·a₁ + s·b₁; r·a₂ + s·b₂; r·a₃ + s·b₃). Ein negativer Faktor kehrt die Richtung um.',
          quelle: 'Wikipedia: Vektor',
          url: 'https://de.wikipedia.org/wiki/Vektor',
        },
        dedupeKey: `ma:k1112:vadd:lk:${a.join(',')}:${b.join(',')}:${r}:${s}`,
      })
    },
    (rng: Rng) => {
      const A = [randInt(rng, -6, 6), randInt(rng, -6, 6), randInt(rng, -6, 6)]
      const B = [randInt(rng, -6, 6), randInt(rng, -6, 6), randInt(rng, -6, 6)]
      const AB = B.map((x, i) => x - A[i]!)
      const k = randInt(rng, 0, 2)
      const D = [randInt(rng, -6, 6), randInt(rng, -6, 6), randInt(rng, -6, 6)]
      const C = D.map((x, i) => x + AB[i]!)
      return valueTask({
        question: `ABCD ist ein Parallelogramm mit A(${A.map(minus).join('|')}), B(${B.map(minus).join('|')}) und D(${D.map(minus).join('|')}). Berechne die ${'xyz'[k]}-Koordinate von C.`,
        answerKind: 'integer',
        value: C[k]!,
        solution: minus(C[k]!),
        explanation: `Im Parallelogramm gilt DC = AB = ${vec3(AB)}. Also C = D + AB = (${C.map(minus).join('|')}).`,
        dedupeKey: `ma:k1112:vadd:para:${A.join(',')}:${B.join(',')}:${D.join(',')}:${k}`,
      })
    },
  ),
}

export const k1112GeradePunkt: Topic = {
  id: 'k1112-lb3-gerade-punkt',
  title: 'Punkt auf einer Geraden (Parameter)',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Gerade', 'Parameterform', 'Vektor', 'Punkt'],
  fachwissen: {
    text: 'Eine Gerade im Raum lautet X = A + t·u (Parameterform). Jeder reelle Parameter t liefert einen Punkt der Geraden. Richtung u darf nicht der Nullvektor sein.',
    quelle: 'Wikipedia: Gerade',
    url: 'https://de.wikipedia.org/wiki/Gerade',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const A = [randInt(rng, -5, 5), randInt(rng, -5, 5), randInt(rng, -5, 5)]
      const u = [nonZero(rng, -4, 4), nonZero(rng, -4, 4), nonZero(rng, -4, 4)]
      const t = nonZero(rng, -4, 4)
      const P = A.map((x, i) => x + t * u[i]!)
      return valueTask({
        question: `Für welchen Parameter t liegt der Punkt P(${P.map(minus).join('|')}) auf der Geraden g: X = ${vec3(A)} + t·${vec3(u)}?`,
        answerKind: 'integer',
        value: t,
        solution: `t = ${minus(t)}`,
        explanation: `Erste Koordinate: ${minus(A[0]!)} + t·${num(u[0]!)} = ${minus(P[0]!)} ⇒ t = ${minus(t)}. Die anderen Koordinaten liefern dasselbe t, also liegt P auf g.`,
        dedupeKey: `ma:k1112:gpunkt:t:${A.join(',')}:${u.join(',')}:${t}`,
      })
    },
    (rng: Rng) => {
      const A = [randInt(rng, -5, 5), randInt(rng, -5, 5), randInt(rng, -5, 5)]
      const u = [nonZero(rng, -4, 4), nonZero(rng, -4, 4), nonZero(rng, -4, 4)]
      const t = nonZero(rng, -3, 3)
      const P = A.map((x, i) => x + t * u[i]!)
      return valueTask({
        question: `Der Punkt Q(${minus(P[0]!)}|${minus(P[1]!)}|z) soll auf der Geraden g: X = ${vec3(A)} + t·${vec3(u)} liegen. Bestimme z.`,
        answerKind: 'integer',
        value: P[2]!,
        solution: `z = ${minus(P[2]!)}`,
        explanation: `Aus der x-Koordinate folgt t = ${minus(t)}; die y-Koordinate bestätigt das. Dann z = ${minus(A[2]!)} + ${num(t)}·${num(u[2]!)} = ${minus(P[2]!)}.`,
        dedupeKey: `ma:k1112:gpunkt:z:${A.join(',')}:${u.join(',')}:${t}`,
      })
    },
  ),
}

export const k1112LageGeraden: Topic = {
  id: 'k1112-lb3-lage-geraden',
  title: 'Lagebeziehung zweier Geraden in der Ebene',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Lagebeziehung', 'Gerade', 'parallel', 'identisch', 'schneidend'],
  fachwissen: {
    text: 'Zwei Geraden in der Ebene sind parallel (gleiche Richtung, verschiedene Träger), identisch (gleiche Richtung und gemeinsamer Punkt) oder schneidend (verschiedene Richtungen). Im Raum gibt es zusätzlich windschiefe Geraden.',
    quelle: 'Wikipedia: Lagebeziehung',
    url: 'https://de.wikipedia.org/wiki/Lagebeziehung',
  },
  generate: mixedVariants(
    (rng: Rng) => lageGeradenMc(rng),
    (rng: Rng) => {
      // Schnittpunkt mit ganzzahligen Parametern
      for (;;) {
        const A = [randInt(rng, -4, 4), randInt(rng, -4, 4)]
        const u = [nonZero(rng, -3, 3), nonZero(rng, -3, 3)]
        const v = [nonZero(rng, -3, 3), nonZero(rng, -3, 3)]
        if (u[0]! * v[1]! - u[1]! * v[0]! === 0) continue
        const t = nonZero(rng, -3, 3)
        const s = nonZero(rng, -3, 3)
        const S = [A[0]! + t * u[0]!, A[1]! + t * u[1]!]
        const B = [S[0]! - s * v[0]!, S[1]! - s * v[1]!]
        const askX = rng() < 0.5
        return valueTask({
          question: `Die Geraden g: X = ${vec2(A)} + t·${vec2(u)} und h: X = ${vec2(B)} + s·${vec2(v)} schneiden sich im Punkt S. Berechne die ${askX ? 'x' : 'y'}-Koordinate von S.`,
          answerKind: 'integer',
          value: askX ? S[0]! : S[1]!,
          solution: `S(${minus(S[0]!)}|${minus(S[1]!)})`,
          explanation: `Gleichsetzen liefert das System ${polyStr([[A[0]!, ''], [u[0]!, 't']])} = ${polyStr([[B[0]!, ''], [v[0]!, 's']])} und ${polyStr([[A[1]!, ''], [u[1]!, 't']])} = ${polyStr([[B[1]!, ''], [v[1]!, 's']])} mit t = ${minus(t)}, s = ${minus(s)}. Einsetzen in g: S(${minus(S[0]!)}|${minus(S[1]!)}).`,
          dedupeKey: `ma:k1112:lage:schnitt:${A.join(',')}:${u.join(',')}:${B.join(',')}:${v.join(',')}:${askX}`,
        })
      }
    },
    (rng: Rng) => {
      for (;;) {
        const u = [nonZero(rng, -4, 4), nonZero(rng, -4, 4)]
        const k = pick(rng, [-3, -2, 2, 3])
        const v1 = k * u[1]!
        const a = k * u[0]!
        const A = [randInt(rng, -4, 4), randInt(rng, -4, 4)]
        const B = [A[0]! + u[1]!, A[1]! - u[0]!]
        if (Math.abs(a) > 12) continue
        return valueTask({
          question: `Für welchen Wert von a ist die Gerade h: X = ${vec2(B)} + s·(a; ${minus(v1)}) parallel zu g: X = ${vec2(A)} + t·${vec2(u)}?`,
          answerKind: 'integer',
          value: a,
          solution: `a = ${minus(a)}`,
          explanation: `Parallel heißt: (a; ${minus(v1)}) = k · ${vec2(u)}. Aus der zweiten Komponente folgt k = ${minus(v1)} / ${num(u[1]!)} = ${minus(k)}, also a = ${minus(k)} · ${num(u[0]!)} = ${minus(a)}.`,
          dedupeKey: `ma:k1112:lage:param:${A.join(',')}:${u.join(',')}:${k}`,
        })
      }
    },
  ),
}

function lageGeradenMc(rng: Rng) {
    const kind = pick(rng, ['parallel', 'identisch', 'schneidend'] as const)
    const A = [randInt(rng, -4, 4), randInt(rng, -4, 4)]
    let u = [nonZero(rng, -3, 3), nonZero(rng, -3, 3)]
    if (Math.abs(u[0]!) === Math.abs(u[1]!) && rng() < 0.5) u = [u[0]!, u[1]! + (u[1]! > 0 ? 1 : -1)]
    const k = pick(rng, [-2, 2, 3])
    let B: number[]
    let v: number[]
    let expl: string
    if (kind === 'identisch') {
      const t = nonZero(rng, -2, 2)
      B = [A[0]! + t * u[0]!, A[1]! + t * u[1]!]
      v = [k * u[0]!, k * u[1]!]
      expl = `Die Richtungsvektoren sind Vielfache (${vec2(v)} = ${minus(k)} · ${vec2(u)}), und ${vec2(B)} liegt auf g (t = ${minus(t)}). Also sind g und h identisch.`
    } else if (kind === 'parallel') {
      B = [A[0]! + u[1]!, A[1]! - u[0]!]
      v = [k * u[0]!, k * u[1]!]
      expl = `Die Richtungsvektoren sind Vielfache (${vec2(v)} = ${minus(k)} · ${vec2(u)}), aber ${vec2(B)} liegt nicht auf g. Also sind g und h echt parallel.`
    } else {
      B = [A[0]! + randInt(rng, -3, 3), A[1]! + randInt(rng, -3, 3)]
      v = [u[1]! + nonZero(rng, -2, 2), -u[0]!]
      if (u[0]! * v[1]! - u[1]! * v[0]! === 0) v = [v[0]! + 1, v[1]!]
      expl = `${vec2(v)} ist kein Vielfaches von ${vec2(u)}; zwei nicht parallele Geraden in der Ebene schneiden sich in genau einem Punkt.`
    }
    const labels = {
      parallel: 'echt parallel',
      identisch: 'identisch',
      schneidend: 'schneiden sich in genau einem Punkt',
    }
    return appliedMc(rng, {
      question: `In der Ebene sind g: X = ${vec2(A)} + t·${vec2(u)} und h: X = ${vec2(B)} + s·${vec2(v)} gegeben. Wie liegen g und h zueinander?`,
      correct: labels[kind],
      distractors: Object.values(labels),
      explanation: expl,
      fachwissen: {
        text: 'Zwei Geraden in der Ebene sind parallel oder identisch, wenn ihre Richtungsvektoren Vielfache voneinander sind; liegt zusätzlich ein Punkt der einen Geraden auf der anderen, sind sie identisch. Sind die Richtungsvektoren keine Vielfachen, schneiden sich die Geraden in genau einem Punkt.',
        quelle: 'Wikipedia: Gerade',
        url: 'https://de.wikipedia.org/wiki/Gerade',
      },
      dedupeKey: `ma:k1112:lage:${A.join(',')}:${u.join(',')}:${B.join(',')}:${v.join(',')}`,
      contentIds: [`ma:k1112:lage:art:${kind}`],
      instruction: 'Wähle die passende Lagebeziehung:',
    })
}

export const k1112BinomKumuliert: Topic = {
  id: 'k1112-lb4-binom-kumuliert',
  title: 'Binomialverteilung: P(X ≤ k)',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Binomialverteilung', 'kumuliert', 'höchstens', 'Stochastik'],
  fachwissen: {
    text: 'Kumulierte Wahrscheinlichkeiten P(X≤k) = Σᵢ₌₀ᵏ P(X=i) beschreiben Ereignisse wie „höchstens k Treffer“. Tabellen und CAS erleichtern die Auswertung; inhaltlich bleibt die Binomialformel zentral.',
    quelle: 'Wikipedia: Binomialverteilung',
    url: 'https://de.wikipedia.org/wiki/Binomialverteilung',
  },
  generate: (rng: Rng) => {
    const n = randInt(rng, 4, 12)
    const p = pick(rng, [0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6])
    const k = randInt(rng, 1, Math.min(4, n - 1))
    const strict = rng() < 0.35
    const upTo = strict ? k - 1 : k
    let raw = 0
    for (let i = 0; i <= upTo; i++) raw += binom(n, i) * p ** i * (1 - p) ** (n - i)
    const value = roundTo(raw, 4)
    const ctx = pick(rng, [
      `Ein Glücksrad zeigt mit der Wahrscheinlichkeit ${formatDe(p)} „Gewinn“. Es wird ${n}-mal gedreht.`,
      `Ein Bauteil ist mit der Wahrscheinlichkeit ${formatDe(p)} fehlerhaft. Es werden ${n} Bauteile zufällig geprüft.`,
      `Ein Basketballspieler trifft mit der Wahrscheinlichkeit ${formatDe(p)}. Er wirft ${n}-mal.`,
    ])
    return valueTask({
      question: `${ctx} X sei die Anzahl der Treffer. Berechne P(X ${strict ? '<' : '≤'} ${k}). Runde auf vier Nachkommastellen.`,
      answerKind: 'decimal',
      value,
      eps: 0.0006,
      solution: formatDe(value),
      explanation: `P(X ${strict ? '<' : '≤'} ${k}) = ${range0(upTo).map((i) => `P(X = ${i})`).join(' + ')} ≈ ${formatDe(value)} (n = ${n}, p = ${formatDe(p)}).`,
      dedupeKey: `ma:k1112:binomcum:${n}:${p}:${upTo}`,
    })
  },
}

const range0 = (k: number): number[] => Array.from({ length: k + 1 }, (_, i) => i)

export const k1112BinomSigma: Topic = {
  id: 'k1112-lb4-binom-sigma',
  title: 'Standardabweichung der Binomialverteilung',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Binomialverteilung', 'Standardabweichung', 'Varianz', 'Stochastik'],
  fachwissen: {
    text: 'Für X ~ B(n,p) gilt E(X)=n·p, Var(X)=n·p·(1−p) und σ=√(n·p·(1−p)). Die Standardabweichung misst die typische Abweichung der Trefferzahl vom Erwartungswert.',
    quelle: 'Wikipedia: Binomialverteilung',
    url: 'https://de.wikipedia.org/wiki/Binomialverteilung',
  },
  generate: (rng: Rng) => {
    const n = pick(rng, [20, 25, 40, 50, 60, 80, 100, 120, 150, 200])
    const p = pick(rng, [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.75, 0.8])
    const variance = roundTo(n * p * (1 - p), 4)
    const sigma = roundTo(Math.sqrt(variance), 2)
    const kind = pick(rng, ['sigma', 'var', 'grenze'] as const)
    const mu = roundTo(n * p, 4)
    if (kind === 'grenze') {
      const upper = roundTo(mu + sigma, 2)
      return valueTask({
        question: `X ist binomialverteilt mit n = ${n} und p = ${formatDe(p)}. Berechne die obere Grenze des Intervalls [μ − σ; μ + σ]. Runde auf zwei Nachkommastellen.`,
        answerKind: 'decimal',
        value: upper,
        eps: 0.011,
        solution: formatDe(upper),
        explanation: `μ = n · p = ${formatDe(mu)}, σ = √(n · p · (1 − p)) = √${formatDe(variance)} ≈ ${formatDe(sigma)}. μ + σ ≈ ${formatDe(upper)}.`,
        dedupeKey: `ma:k1112:binomsigma:grenze:${n}:${p}`,
      })
    }
    return valueTask({
      question:
        kind === 'var'
          ? `X ist binomialverteilt mit n = ${n} und p = ${formatDe(p)}. Berechne die Varianz Var(X).`
          : `X ist binomialverteilt mit n = ${n} und p = ${formatDe(p)}. Berechne die Standardabweichung σ. Runde auf zwei Nachkommastellen.`,
      answerKind: 'decimal',
      value: kind === 'var' ? variance : sigma,
      eps: kind === 'var' ? 1e-4 : 0.006,
      solution: formatDe(kind === 'var' ? variance : sigma),
      explanation: `Var(X) = n · p · (1 − p) = ${n} · ${formatDe(p)} · ${formatDe(roundTo(1 - p, 2))} = ${formatDe(variance)}${kind === 'var' ? '' : `; σ = √${formatDe(variance)} ≈ ${formatDe(sigma)}`}.`,
      dedupeKey: `ma:k1112:binomsigma:${kind}:${n}:${p}`,
    })
  },
}

export const k1112Stammfunktion: Topic = {
  id: 'k1112-lb5-stammfunktion',
  title: 'Stammfunktion eines Polynoms',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Stammfunktion', 'Integral', 'unbestimmtes Integral'],
  fachwissen: {
    text: 'Eine Stammfunktion F von f erfüllt F′=f. Für Potenzen gilt ∫ xⁿ dx = xⁿ⁺¹/(n+1)+C (n≠−1). Das unbestimmte Integral fasst alle Stammfunktionen zusammen.',
    quelle: 'Wikipedia: Stammfunktion',
    url: 'https://de.wikipedia.org/wiki/Stammfunktion',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      // f(x) = 3a·x² + 2b·x + c  ⇒  F(x) = a·x³ + b·x² + c·x (+C)
      const a = nonZero(rng, -2, 3)
      const b = randInt(rng, -3, 3)
      const c = randInt(rng, -5, 5)
      const x0 = pick(rng, [1, 2, -1, 3])
      const C = randInt(rng, -6, 6)
      const F = (x: number) => a * x ** 3 + b * x * x + c * x
      const value = F(x0) + C
      return valueTask({
        question: `F ist die Stammfunktion von f(x) = ${firstTerm(3 * a, 'x²')}${term(2 * b, 'x')}${term(c, '')} mit F(0) = ${minus(C)}. Berechne F(${minus(x0)}).`,
        answerKind: 'integer',
        value,
        solution: minus(value),
        explanation: `F(x) = ${firstTerm(a, 'x³')}${term(b, 'x²')}${term(c, 'x')}${term(C, '')} (Konstante aus F(0) = ${minus(C)}). F(${minus(x0)}) = ${minus(value)}.`,
        dedupeKey: `ma:k1112:stamm:poly:${a}:${b}:${c}:${C}:${x0}`,
      })
    },
    (rng: Rng) => {
      const a = nonZero(rng, -3, 4)
      const n = pick(rng, [2, 3, 4])
      const sup = ['', '', '²', '³', '⁴', '⁵'][n]
      const coef = a * (n + 1)
      const correct = `F(x) = ${firstTerm(a, `x${['', '', '²', '³', '⁴', '⁵'][n + 1]}`)}`
      return appliedMc(rng, {
        question: `Welche Funktion ist eine Stammfunktion von f(x) = ${firstTerm(coef, `x${sup}`)}?`,
        correct,
        distractors: [
          `F(x) = ${firstTerm(coef * n, `x${['', '', '²', '³', '⁴'][n - 1] ?? ''}`)}`,
          `F(x) = ${firstTerm(coef, `x${['', '', '²', '³', '⁴', '⁵'][n + 1]}`)}`,
          `F(x) = ${firstTerm(a * n, `x${['', '', '²', '³', '⁴', '⁵'][n + 1]}`)}`,
          `F(x) = ${firstTerm(a, `x${sup}`)}`,
        ],
        explanation: `Potenzregel rückwärts: Exponent um 1 erhöhen und durch den neuen Exponenten teilen: ${minus(coef)}/${n + 1} = ${minus(a)}. Probe: F′(x) = ${firstTerm(coef, `x${sup}`)}.`,
        fachwissen: {
          text: 'Für n ≠ −1 ist F(x) = xⁿ⁺¹/(n + 1) eine Stammfunktion von f(x) = xⁿ. Ob F richtig ist, prüft man durch Ableiten: F′ muss wieder f ergeben.',
          quelle: 'Wikipedia: Stammfunktion',
          url: 'https://de.wikipedia.org/wiki/Stammfunktion',
        },
        dedupeKey: `ma:k1112:stamm:mc:${a}:${n}`,
      })
    },
    (rng: Rng) => {
      const k = pick(rng, [2, 3, 4, 6])
      const yP = randInt(rng, -5, 8)
      const x1 = pick(rng, [2, 3, 5])
      const value = roundTo(k * Math.log(x1) + yP, 2)
      return valueTask({
        question: `F ist eine Stammfunktion von f(x) = ${k}/x (x > 0), deren Graph durch den Punkt (1|${minus(yP)}) geht. Berechne F(${x1}). Runde auf zwei Nachkommastellen.`,
        answerKind: 'decimal',
        value,
        eps: 0.006,
        solution: formatDe(value),
        explanation: `F(x) = ${k}·ln x + C; F(1) = C = ${minus(yP)}. F(${x1}) = ${k}·ln ${x1}${yP === 0 ? '' : addNum(yP)} ≈ ${formatDe(value)}.`,
        dedupeKey: `ma:k1112:stamm:ln:${k}:${yP}:${x1}`,
      })
    },
  ),
}

export const k1112FlaecheIntegral: Topic = {
  id: 'k1112-lb5-flaeche',
  title: 'Fläche zwischen Graph und x-Achse',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Integral', 'Flächeninhalt', 'Graph', 'x-Achse'],
  fachwissen: {
    text: 'Liegt der Graph von f zwischen a und b oberhalb der x-Achse, so ist der Flächeninhalt gleich dem bestimmten Integral. Wechselt f das Vorzeichen, muss man Teilintervalle getrennt betrachten und Beträge addieren.',
    quelle: 'Wikipedia: Bestimmtes Integral',
    url: 'https://de.wikipedia.org/wiki/Integral#Bestimmtes_Integral',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 1, 3)
      const c = randInt(rng, 0, 4)
      const lo = randInt(rng, 0, 2)
      const hi = lo + randInt(rng, 1, 3)
      const F = (x: number) => a * x ** 3 + c * x
      const value = F(hi) - F(lo)
      return valueTask({
        question: `Berechne den Inhalt der Fläche zwischen dem Graphen von f(x) = ${3 * a}x²${term(c, '')} und der x-Achse über dem Intervall [${lo}; ${hi}].`,
        unit: 'FE',
        answerKind: 'integer',
        value,
        solution: `${minus(value)} FE`,
        explanation: `f ist auf [${lo}; ${hi}] positiv. F(x) = ${firstTerm(a, 'x³')}${term(c, 'x')}; A = F(${hi}) − F(${lo}) = ${F(hi)} − ${F(lo)} = ${minus(value)} FE.`,
        dedupeKey: `ma:k1112:flaeche:quad:${a}:${c}:${lo}:${hi}`,
      })
    },
    (rng: Rng) => {
      // Parabel f(x) = −k(x − p)(x − q) zwischen den Nullstellen
      const p = randInt(rng, -3, 1)
      const q = p + pick(rng, [3, 6])
      const k = pick(rng, [1, 2])
      const value = (k * (q - p) ** 3) / 6
      const b = k * (p + q)
      const c = -k * p * q
      return valueTask({
        question: `Der Graph von f(x) = ${firstTerm(-k, 'x²')}${term(b, 'x')}${term(c, '')} schließt mit der x-Achse eine Fläche ein. Berechne ihren Inhalt.`,
        unit: 'FE',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} FE`,
        explanation: `Nullstellen: x = ${minus(p)} und x = ${minus(q)}. A = ∫ von ${minus(p)} bis ${minus(q)} f(x) dx = ${formatDe(value)} FE.`,
        dedupeKey: `ma:k1112:flaeche:nullst:${p}:${q}:${k}`,
      })
    },
    (rng: Rng) => {
      // f(x) = x − r wechselt in [0; 2r] das Vorzeichen → Fläche ≠ Integral
      const r = randInt(rng, 1, 4)
      const hi = r + randInt(rng, 1, 4)
      const value = (r * r) / 2 + ((hi - r) * (hi - r)) / 2
      return valueTask({
        question: `Berechne den Gesamtinhalt der Flächen, die der Graph von f(x) = x − ${minus(r)} über dem Intervall [0; ${hi}] mit der x-Achse einschließt.`,
        unit: 'FE',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} FE`,
        explanation: `f wechselt bei x = ${minus(r)} das Vorzeichen. A = |∫₀^${minus(r)} f dx| + ∫_${minus(r)}^${hi} f dx = ${formatDe((r * r) / 2)} + ${formatDe(((hi - r) * (hi - r)) / 2)} = ${formatDe(value)} FE.`,
        dedupeKey: `ma:k1112:flaeche:vz:${r}:${hi}`,
      })
    },
  ),
}

export const k1112Hypothesentest: Topic = {
  id: 'k1112-lb6-hypothesentest',
  title: 'Signifikanztest: Entscheidung',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Hypothesentest', 'Signifikanz', 'Nullhypothese', 'kritischer Wert'],
  fachwissen: {
    text: 'Beim Signifikanztest prüft man eine Nullhypothese H₀ anhand einer Testgröße. Überschreitet (bzw. unterschreitet) die Testgröße den kritischen Wert zum gewählten Signifikanzniveau, lehnt man H₀ ab. Sonst behält man H₀ bei — ohne sie „zu beweisen“.',
    quelle: 'Wikipedia: Statistischer Test',
    url: 'https://de.wikipedia.org/wiki/Statistischer_Test',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const n = pick(rng, [20, 25, 30, 40, 50])
      const p0 = pick(rng, [0.2, 0.25, 0.3, 0.4, 0.5])
      const alpha = pick(rng, [0.05, 0.1])
      const k = criticalRight(n, p0, alpha)
      return valueTask({
        question: `Ein Hersteller behauptet, höchstens ${formatDe(p0 * 100)} % seiner Lose seien Nieten (H₀: p = ${formatDe(p0)}). Getestet werden ${n} Lose auf dem Signifikanzniveau ${formatDe(alpha * 100)} %; H₀ soll bei auffällig vielen Nieten verworfen werden. Ab welcher Nietenanzahl k beginnt der Ablehnungsbereich {k; …; ${n}}?`,
        answerKind: 'integer',
        value: k,
        solution: String(k),
        explanation: `Gesucht ist das kleinste k mit P(X ≥ k) ≤ ${formatDe(alpha)} für X ~ B(${n}; ${formatDe(p0)}): P(X ≥ ${k}) ≈ ${formatDe(roundTo(tailGe(n, p0, k), 4))}, aber P(X ≥ ${k - 1}) ≈ ${formatDe(roundTo(tailGe(n, p0, k - 1), 4))}.`,
        dedupeKey: `ma:k1112:test:krit:${n}:${p0}:${alpha}`,
      })
    },
    (rng: Rng) => {
      const n = pick(rng, [20, 25, 30, 40, 50])
      const p0 = pick(rng, [0.2, 0.25, 0.3, 0.4, 0.5])
      const k = criticalRight(n, p0, 0.05) + pick(rng, [-1, 0, 1])
      const err = roundTo(tailGe(n, p0, k), 4)
      return valueTask({
        question: `H₀: p = ${formatDe(p0)} wird mit einer Stichprobe vom Umfang ${n} getestet und verworfen, wenn mindestens ${k} Treffer auftreten. Wie groß ist die Wahrscheinlichkeit für den Fehler 1. Art? Runde auf vier Nachkommastellen.`,
        answerKind: 'decimal',
        value: err,
        eps: 0.0006,
        solution: formatDe(err),
        explanation: `Fehler 1. Art: H₀ ist wahr, wird aber verworfen. P(X ≥ ${k}) für X ~ B(${n}; ${formatDe(p0)}) ≈ ${formatDe(err)}.`,
        dedupeKey: `ma:k1112:test:alpha:${n}:${p0}:${k}`,
      })
    },
    (rng: Rng) => {
      const n = pick(rng, [50, 80, 100, 200])
      const k = randInt(rng, Math.round(n * 0.45), Math.round(n * 0.75))
      const x = k + pick(rng, [-4, -2, -1, 1, 2, 5])
      const reject = x >= k
      const correct = reject ? 'H₀ wird verworfen.' : 'H₀ wird nicht verworfen.'
      return appliedMc(rng, {
        question: `Der Ablehnungsbereich eines rechtsseitigen Tests ist {${k}; …; ${n}}. In der Stichprobe vom Umfang ${n} treten ${minus(x)} Treffer auf. Welche Entscheidung folgt daraus?`,
        correct,
        distractors: ['H₀ wird verworfen.', 'H₀ wird nicht verworfen.', 'H₀ ist damit bewiesen.'],
        explanation: reject
          ? `${minus(x)} liegt im Ablehnungsbereich (${minus(x)} ≥ ${k}): H₀ wird verworfen.`
          : `${minus(x)} liegt nicht im Ablehnungsbereich (${minus(x)} < ${k}): H₀ wird nicht verworfen — bewiesen ist H₀ dadurch aber nicht.`,
        fachwissen: {
          text: 'Beim Signifikanztest wird H₀ verworfen, wenn das Stichprobenergebnis im Ablehnungsbereich liegt. Liegt es außerhalb, behält man H₀ bei; das ist keine Bestätigung von H₀, sondern nur das Fehlen eines signifikanten Widerspruchs.',
          quelle: 'Wikipedia: Statistischer Test',
          url: 'https://de.wikipedia.org/wiki/Statistischer_Test',
        },
        dedupeKey: `ma:k1112:test:entscheid:${n}:${k}:${x}`,
      })
    },
  ),
}

const binomPmf = (n: number, p: number, i: number): number => binom(n, i) * p ** i * (1 - p) ** (n - i)
const tailGe = (n: number, p: number, k: number): number => {
  let s = 0
  for (let i = Math.max(0, k); i <= n; i++) s += binomPmf(n, p, i)
  return s
}
const criticalRight = (n: number, p: number, alpha: number): number => {
  for (let k = 0; k <= n; k++) if (tailGe(n, p, k) <= alpha) return k
  return n
}

export const k1112Stichprobenmittel: Topic = {
  id: 'k1112-lb6-stichprobenmittel',
  title: 'Stichprobenmittel berechnen',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Stichprobe', 'Mittelwert', 'beurteilende Statistik'],
  fachwissen: {
    text: 'Das Stichprobenmittel schätzt den Erwartungswert einer Grundgesamtheit. In der beurteilenden Statistik dienen Stichprobenmittel und Stichprobenvarianz als Ausgangspunkt für Konfidenzintervalle und Hypothesentests.',
    quelle: 'Wikipedia: Stichprobenmittel',
    url: 'https://de.wikipedia.org/wiki/Arithmetisches_Mittel',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const vals = [0, 1, 2, 3, 4]
      const h = vals.map(() => randInt(rng, 1, 12))
      const n = h.reduce((s, x) => s + x, 0)
      const mean = roundTo(vals.reduce((s, v, i) => s + v * h[i]!, 0) / n, 2)
      return valueTask({
        question: `Bei einer Stichprobe von ${n} Familien wurde die Anzahl der Fahrräder erfasst: 0 Räder: ${h[0]}-mal, 1: ${h[1]}-mal, 2: ${h[2]}-mal, 3: ${h[3]}-mal, 4: ${h[4]}-mal. Berechne das Stichprobenmittel. Runde auf zwei Nachkommastellen.`,
        answerKind: 'decimal',
        value: mean,
        eps: 0.006,
        solution: formatDe(mean),
        explanation: `x̄ = (0·${h[0]} + 1·${h[1]} + 2·${h[2]} + 3·${h[3]} + 4·${h[4]}) / ${n} ≈ ${formatDe(mean)}.`,
        dedupeKey: `ma:k1112:stichm:tab:${h.join(',')}`,
      })
    },
    (rng: Rng) => {
      const w = Array.from({ length: 5 }, () => randInt(rng, 140, 230))
      const mean = w.reduce((s, x) => s + x, 0) / 5
      const N = pick(rng, [2000, 5000, 8000])
      const value = roundTo((mean * N) / 1000, 1)
      return valueTask({
        question: `Ein Obstbauer wiegt fünf zufällig ausgewählte Äpfel seiner Ernte: ${w.join(' g, ')} g. Schätze mit dem Stichprobenmittel die Gesamtmasse von ${N} Äpfeln in kg. Runde auf eine Nachkommastelle.`,
        unit: 'kg',
        answerKind: 'decimal',
        value,
        eps: 0.06,
        solution: `${formatDe(value)} kg`,
        explanation: `x̄ = (${w.join(' + ')}) / 5 = ${formatDe(mean)} g. Hochrechnung: ${N} · ${formatDe(mean)} g = ${formatDe(mean * N)} g ≈ ${formatDe(value)} kg.`,
        dedupeKey: `ma:k1112:stichm:hoch:${w.join(',')}:${N}`,
      })
    },
  ),
}

export const k1112Orthogonal: Topic = {
  id: 'k1112-lb7-orthogonal',
  title: 'Orthogonalität zweier Vektoren',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['orthogonal', 'Skalarprodukt', 'senkrecht', 'Vektor'],
  fachwissen: {
    text: 'Zwei Vektoren sind orthogonal (senkrecht), genau dann wenn ihr Skalarprodukt null ist. Normalenvektoren von Geraden/Ebenen nutzen diese Bedingung zentral bei Abstands- und Winkelberechnungen.',
    quelle: 'Wikipedia: Orthogonalität',
    url: 'https://de.wikipedia.org/wiki/Orthogonalit%C3%A4t',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      // a = (a1; a2; a3), b = (t; b2; b3) mit ganzzahligem t
      for (;;) {
        const a = [nonZero(rng, -4, 4), nonZero(rng, -5, 5), nonZero(rng, -5, 5)]
        const t = nonZero(rng, -6, 6)
        const b2 = nonZero(rng, -5, 5)
        const rest = -(a[0]! * t + a[1]! * b2)
        if (rest % a[2]! !== 0) continue
        const b3 = rest / a[2]!
        if (b3 === 0 || Math.abs(b3) > 12) continue
        return valueTask({
          question: `Für welchen Wert von t sind a = ${vec3(a)} und b = (t; ${minus(b2)}; ${minus(b3)}) orthogonal?`,
          answerKind: 'integer',
          value: t,
          solution: `t = ${minus(t)}`,
          explanation: `a · b = ${minus(a[0]!)}·t + ${num(a[1]!)}·${num(b2)} + ${num(a[2]!)}·${num(b3)} = ${polyStr([[a[0]!, 't'], [a[1]! * b2 + a[2]! * b3, '']])} = 0 ⇒ ${a[0] === 1 ? `t = ${minus(t)}` : `${polyStr([[a[0]!, 't']])} = ${minus(-(a[1]! * b2 + a[2]! * b3))} ⇒ t = ${minus(t)}`}.`,
          dedupeKey: `ma:k1112:ortho:t:${a.join(',')}:${b2}:${b3}`,
        })
      }
    },
    (rng: Rng) => {
      const a = [nonZero(rng, -5, 5), nonZero(rng, -5, 5), randInt(rng, -4, 4)]
      const k = pick(rng, [1, 2, -1])
      const ortho = [k * -a[1]!, k * a[0]!, 0]
      const dot = (v: number[]) => v[0]! * a[0]! + v[1]! * a[1]! + v[2]! * a[2]!
      const wrongs: number[][] = []
      for (let i = 0; i < 40 && wrongs.length < 5; i++) {
        const v = [randInt(rng, -5, 5), randInt(rng, -5, 5), randInt(rng, -4, 4)]
        if (dot(v) !== 0 && v.some((x) => x !== 0)) wrongs.push(v)
      }
      wrongs.unshift([ortho[0]!, ortho[1]! + 1, ortho[2]!])
      return appliedMc(rng, {
        question: `Welcher der Vektoren ist orthogonal zu a = ${vec3(a)}?`,
        correct: vec3(ortho),
        distractors: wrongs.filter((v) => dot(v) !== 0).map(vec3),
        explanation: `${vec3(ortho)} · ${vec3(a)} = ${minus(ortho[0]! * a[0]!)} + ${num(ortho[1]! * a[1]!)} + 0 = 0. Für die anderen Vektoren ist das Skalarprodukt nicht null.`,
        fachwissen: {
          text: 'Zwei Vektoren sind genau dann orthogonal, wenn ihr Skalarprodukt null ist: a · b = a₁b₁ + a₂b₂ + a₃b₃ = 0. Einen orthogonalen Vektor zu (a₁; a₂; a₃) erhält man z. B. als (−a₂; a₁; 0).',
          quelle: 'Wikipedia: Orthogonalität',
          url: 'https://de.wikipedia.org/wiki/Orthogonalit%C3%A4t',
        },
        dedupeKey: `ma:k1112:ortho:mc:${a.join(',')}:${k}`,
      })
    },
    (rng: Rng) => {
      // Dreieck mit rechtem Winkel bei B prüfen: fehlende Koordinate von C
      for (;;) {
        const A = [randInt(rng, -3, 3), randInt(rng, -3, 3), randInt(rng, -3, 3)]
        const B = [A[0]! + nonZero(rng, -3, 3), A[1]! + nonZero(rng, -3, 3), A[2]! + randInt(rng, -2, 2)]
        const BA = [A[0]! - B[0]!, A[1]! - B[1]!, A[2]! - B[2]!]
        const c1 = B[1]! + nonZero(rng, -3, 3)
        const c2 = B[2]! + randInt(rng, -3, 3)
        const rest = -(BA[1]! * (c1 - B[1]!) + BA[2]! * (c2 - B[2]!))
        if (rest % BA[0]! !== 0) continue
        const c0 = B[0]! + rest / BA[0]!
        if (Math.abs(c0) > 12) continue
        return valueTask({
          question: `Gegeben sind A(${A.map(minus).join('|')}), B(${B.map(minus).join('|')}) und C(x|${minus(c1)}|${minus(c2)}). Für welches x hat das Dreieck ABC bei B einen rechten Winkel?`,
          answerKind: 'integer',
          value: c0,
          solution: `x = ${minus(c0)}`,
          explanation: `Rechter Winkel bei B ⇔ BA · BC = 0 mit BA = ${vec3(BA)} und BC = (${linStr(1, -B[0]!)}; ${minus(c1 - B[1]!)}; ${minus(c2 - B[2]!)}). ${B[0] === 0 ? polyStr([[BA[0]!, 'x']]) : `${num(BA[0]!)}·(${linStr(1, -B[0]!)})`}${rest === 0 ? '' : addNum(-rest)} = 0 ⇒ x = ${minus(c0)}.`,
          dedupeKey: `ma:k1112:ortho:dreieck:${A.join(',')}:${B.join(',')}:${c1}:${c2}`,
        })
      }
    },
  ),
}

export const k1112WinkelVektoren: Topic = {
  id: 'k1112-lb7-winkel',
  title: 'Winkel zwischen Vektoren (Kosinus)',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Winkel', 'Skalarprodukt', 'Vektor', 'Kosinus'],
  fachwissen: {
    text: 'Aus a·b = |a|·|b|·cos(φ) folgt der Winkel zwischen zwei Vektoren. Orthogonale Vektoren haben φ=90° (cos=0), parallele gleiche Richtung φ=0° (cos=1).',
    quelle: 'Wikipedia: Skalarprodukt',
    url: 'https://de.wikipedia.org/wiki/Skalarprodukt',
  },
  generate: (rng: Rng) => {
    for (;;) {
      const dim = pick(rng, [2, 3])
      const a = Array.from({ length: dim }, () => randInt(rng, -5, 5))
      const b = Array.from({ length: dim }, () => randInt(rng, -5, 5))
      if (a.every((x) => x === 0) || b.every((x) => x === 0)) continue
      const dot = a.reduce((s, x, i) => s + x * b[i]!, 0)
      const la = Math.sqrt(a.reduce((s, x) => s + x * x, 0))
      const lb = Math.sqrt(b.reduce((s, x) => s + x * x, 0))
      const cos = dot / (la * lb)
      if (Math.abs(cos) > 0.999) continue
      const phi = roundTo(Math.acos(cos) / DEG, 1)
      const show = dim === 2 ? vec2 : vec3
      return valueTask({
        question: `Berechne den Winkel φ zwischen a = ${show(a)} und b = ${show(b)} in Grad. Runde auf eine Nachkommastelle.`,
        unit: '°',
        answerKind: 'decimal',
        value: phi,
        eps: 0.11,
        solution: `${formatDe(phi)}°`,
        explanation: `a · b = ${minus(dot)}, |a| = √${a.reduce((s, x) => s + x * x, 0)}, |b| = √${b.reduce((s, x) => s + x * x, 0)}. cos(φ) = ${minus(dot)} / (|a| · |b|) ≈ ${fmtSigned(roundTo(cos, 4))}, also φ ≈ ${formatDe(phi)}°.`,
        dedupeKey: `ma:k1112:winkel:${a.join(',')}:${b.join(',')}`,
      })
    }
  },
}

export const k1112AbstandPunktGerade: Topic = {
  id: 'k1112-lb7-abstand-gerade',
  title: 'Abstand Punkt–Gerade in der Ebene',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Abstand', 'Gerade', 'Punkt', 'analytische Geometrie'],
  fachwissen: {
    text: 'Der Abstand eines Punktes P₀ von der Geraden ax+by+c=0 ist |ax₀+by₀+c|/√(a²+b²). Im Raum nutzt man Normalenvektoren bzw. das Vektorprodukt für Abstände Punkt–Gerade und Punkt–Ebene.',
    quelle: 'Wikipedia: Hessesche Normalform',
    url: 'https://de.wikipedia.org/wiki/Hessesche_Normalform',
  },
  generate: (rng: Rng) => {
    const [a0, b0] = pick(rng, [
      [3, 4],
      [4, 3],
      [5, 12],
      [12, 5],
      [6, 8],
      [1, 1],
      [1, 2],
      [2, -1],
    ] as Array<[number, number]>)
    const s = pick(rng, [1, -1])
    const a = s * a0
    const b = b0
    const c = randInt(rng, -12, 12)
    const x0 = randInt(rng, -6, 6)
    const y0 = randInt(rng, -6, 6)
    const num0 = Math.abs(a * x0 + b * y0 + c)
    if (num0 === 0) return k1112AbstandPunktGerade.generate(rng)
    const d = roundTo(num0 / Math.sqrt(a * a + b * b), 2)
    const line = `${firstTerm(a, 'x')}${term(b, 'y')}${term(c, '')} = 0`
    return valueTask({
      question: `Berechne den Abstand des Punktes P(${minus(x0)}|${minus(y0)}) von der Geraden g: ${line}. Runde auf zwei Nachkommastellen.`,
      answerKind: 'decimal',
      value: d,
      eps: 0.006,
      solution: formatDe(d),
      explanation: `d = |${minus(a)}·${num(x0)} + ${num(b)}·${num(y0)} + ${num(c)}| / √(${a * a} + ${b * b}) = ${num0} / √${a * a + b * b} ≈ ${formatDe(d)}.`,
      dedupeKey: `ma:k1112:abstand:${a}:${b}:${c}:${x0}:${y0}`,
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
  generate: mixedVariants(
    (rng: Rng) => {
      const U = 4 * randInt(rng, 5, 40)
      const xMax = U / 4
      const askA = rng() < 0.5
      return valueTask({
        question: askA
          ? `Für ein rechteckiges Beet stehen ${U} m Einfassung zur Verfügung. Wie groß kann die Fläche des Beets höchstens werden?`
          : `Für ein rechteckiges Beet stehen ${U} m Einfassung zur Verfügung. Wie lang muss eine Seite x sein, damit die Fläche maximal wird?`,
        unit: askA ? 'm²' : 'm',
        answerKind: 'integer',
        value: askA ? xMax * xMax : xMax,
        solution: askA ? `${xMax * xMax} m²` : `x = ${xMax} m`,
        explanation: `A(x) = x·(${U / 2} − x), A′(x) = ${U / 2} − 2x = 0 ⇒ x = ${xMax} m (Quadrat).${askA ? ` A = ${xMax}² = ${xMax * xMax} m².` : ''}`,
        dedupeKey: `ma:k1112:extrem:rect:${U}:${askA}`,
      })
    },
    (rng: Rng) => {
      const L = 4 * randInt(rng, 5, 30)
      const x = L / 4
      const askA = rng() < 0.5
      const A = x * (L - 2 * x)
      return valueTask({
        question: askA
          ? `Mit ${L} m Zaun soll an einer langen Hauswand eine rechteckige Weide abgegrenzt werden (die Wand ersetzt eine Seite). Wie groß ist die größtmögliche Weidefläche?`
          : `Mit ${L} m Zaun soll an einer langen Hauswand eine rechteckige Weide abgegrenzt werden (die Wand ersetzt eine Seite). Wie lang müssen die beiden Seiten x senkrecht zur Wand sein, damit die Fläche maximal wird?`,
        unit: askA ? 'm²' : 'm',
        answerKind: 'integer',
        value: askA ? A : x,
        solution: askA ? `${A} m²` : `x = ${minus(x)} m`,
        explanation: `A(x) = x·(${L} − 2x), A′(x) = ${L} − 4x = 0 ⇒ x = ${minus(x)} m, parallele Seite ${L - 2 * x} m.${askA ? ` A = ${minus(x)}·${L - 2 * x} = ${A} m².` : ''}`,
        dedupeKey: `ma:k1112:extrem:wand:${L}:${askA}`,
      })
    },
  ),
}

export const k1112SpiegelungEbene: Topic = {
  id: 'k1112-lb8-spiegelung',
  title: 'Spiegelung eines Punktes an einer Koordinatenebene',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Spiegelung', 'Ebene', 'Punkt', 'Anwendung'],
  fachwissen: {
    text: 'Die Spiegelung eines Punktes an einer Ebene erzeugt den Punkt, dessen Verbindungsstrecke zur Ausgangslage von der Ebene mittig und senkrecht geschnitten wird. An Koordinatenebenen kehren sich die entsprechenden Koordinaten um.',
    quelle: 'Wikipedia: Spiegelung (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Spiegelung_(Geometrie)',
  },
  generate: (rng: Rng) => {
    const P = [nonZero(rng, -8, 8), nonZero(rng, -8, 8), nonZero(rng, -8, 8)]
    const plane = pick(rng, ['xy', 'xz', 'yz'] as const)
    const axis = plane === 'xy' ? 2 : plane === 'xz' ? 1 : 0
    const img = P.map((v, i) => (i === axis ? -v : v))
    const ptS = (v: number[]) => `(${v.map(minus).join('|')})`
    const wrong = [
      [P[0]!, P[1]!, -P[2]!],
      [P[0]!, -P[1]!, P[2]!],
      [-P[0]!, P[1]!, P[2]!],
      P.map((v) => -v),
      [P[1]!, P[0]!, P[2]!],
    ]
    return appliedMc(rng, {
      question: `Der Punkt P${ptS(P)} wird an der ${plane}-Ebene gespiegelt. Welche Koordinaten hat der Bildpunkt P′?`,
      correct: ptS(img),
      distractors: wrong.map(ptS),
      explanation: `Bei der Spiegelung an der ${plane}-Ebene wechselt nur die ${'xyz'[axis]}-Koordinate das Vorzeichen, weil sie den Abstand zur Ebene angibt: P′${ptS(img)}.`,
      fachwissen: {
        text: 'Bei der Spiegelung an einer Koordinatenebene bleibt der Abstand zur Ebene gleich, nur die Seite wechselt; deshalb ändert sich nur das Vorzeichen der Koordinate senkrecht zur Ebene.',
        quelle: 'Wikipedia: Spiegelung (Geometrie)',
        url: 'https://de.wikipedia.org/wiki/Spiegelung_(Geometrie)',
      },
      dedupeKey: `ma:k1112:spiegel:${P.join(',')}:${plane}`,
    })
  },
}

export const k1112MatrixAdd: Topic = {
  id: 'k1112-lb2-matrix-add',
  title: 'Matrizen addieren (2×2)',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Matrix', 'Addition', 'Matrizen'],
  fachwissen: {
    text: 'Gleichgroße Matrizen werden komponentenweise addiert. Die Nullmatrix ist neutrales Element. Matrizenaddition ist kommutativ und assoziativ.',
    quelle: 'Wikipedia: Matrix (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Matrix_(Mathematik)',
  },
  generate: (rng: Rng) => {
    const A = [0, 1, 2, 3].map(() => randInt(rng, -6, 6))
    const B = [0, 1, 2, 3].map(() => randInt(rng, -6, 6))
    const r = pick(rng, [2, 3, -1])
    const idx = randInt(rng, 0, 3)
    const name = ['c₁₁', 'c₁₂', 'c₂₁', 'c₂₂'][idx]!
    const value = A[idx]! + r * B[idx]!
    const m = (x: number[]) => `[[${minus(x[0])}, ${minus(x[1])}], [${minus(x[2])}, ${minus(x[3])}]]`
    return valueTask({
      question: `Gegeben sind A = ${m(A)} und B = ${m(B)}. Berechne den Eintrag ${name} von C = A ${r < 0 ? '−' : '+'} ${Math.abs(r) === 1 ? '' : `${Math.abs(r)}·`}B.`,
      answerKind: 'integer',
      value,
      solution: minus(value),
      explanation: `${name} = ${minus(A[idx]!)} ${r < 0 ? '−' : '+'} ${Math.abs(r) === 1 ? '' : `${Math.abs(r)}·`}${num(B[idx]!)} = ${minus(value)}.`,
      dedupeKey: `ma:k1112:matadd:${A.join(',')}:${B.join(',')}:${r}:${idx}`,
    })
  },
}

export const k1112MatrixDet: Topic = {
  id: 'k1112-lb2-matrix-det',
  title: 'Determinante 2×2',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Determinante', 'Matrix', '2×2'],
  fachwissen: {
    text: 'Die Determinante einer 2×2-Matrix A = [[a,b],[c,d]] ist ad−bc. det≠0 bedeutet Invertierbarkeit und eindeutige Lösbarkeit zugehöriger LGS.',
    quelle: 'Wikipedia: Determinante',
    url: 'https://de.wikipedia.org/wiki/Determinante',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = nonZero(rng, -6, 6)
      const b = randInt(rng, -6, 6)
      const c = randInt(rng, -6, 6)
      const d = nonZero(rng, -6, 6)
      const det = a * d - b * c
      return valueTask({
        question: `Berechne det([[${minus(a)}, ${minus(b)}], [${minus(c)}, ${minus(d)}]]).`,
        answerKind: 'integer',
        value: det,
        solution: minus(det),
        explanation: `det = ${minus(a)}·${num(d)} − ${num(b)}·${num(c)} = ${minus(a * d)} − ${num(b * c)} = ${minus(det)}.`,
        dedupeKey: `ma:k1112:det:wert:${a}:${b}:${c}:${d}`,
      })
    },
    (rng: Rng) => {
      for (;;) {
        const b = nonZero(rng, -6, 6)
        const c = nonZero(rng, -6, 6)
        const d = nonZero(rng, -6, 6)
        if ((b * c) % d !== 0) continue
        const t = (b * c) / d
        if (Math.abs(t) > 20) continue
        return valueTask({
          question: `Für welchen Wert von t ist die Matrix [[t, ${minus(b)}], [${minus(c)}, ${minus(d)}]] nicht invertierbar?`,
          answerKind: 'integer',
          value: t,
          solution: `t = ${minus(t)}`,
          explanation: `Nicht invertierbar ⇔ det = 0: t·${num(d)} − ${num(b)}·${num(c)} = 0 ⇒ t = ${minus(b * c)}/${num(d)} = ${minus(t)}.`,
          dedupeKey: `ma:k1112:det:t:${b}:${c}:${d}`,
        })
      }
    },
    (rng: Rng) => {
      const u = [nonZero(rng, 1, 6), randInt(rng, -3, 3)]
      const v = [randInt(rng, -3, 3), nonZero(rng, 1, 6)]
      const area = Math.abs(u[0]! * v[1]! - u[1]! * v[0]!)
      if (area === 0) return k1112MatrixDet.generate(rng)
      return valueTask({
        question: `Die Vektoren u = ${vec2(u)} und v = ${vec2(v)} spannen ein Parallelogramm auf. Berechne seinen Flächeninhalt mithilfe der Determinante.`,
        unit: 'FE',
        answerKind: 'integer',
        value: area,
        solution: `${area} FE`,
        explanation: `A = |det([[${minus(u[0])}, ${minus(v[0])}], [${minus(u[1])}, ${minus(v[1])}]])| = |${minus(u[0])}·${num(v[1]!)} − ${num(v[0]!)}·${num(u[1]!)}| = ${area} FE.`,
        dedupeKey: `ma:k1112:det:flaeche:${u.join(',')}:${v.join(',')}`,
      })
    },
  ),
}

export const k1112KonfidenzIdee: Topic = {
  id: 'k1112-lb6-konfidenz',
  title: 'Konfidenzintervall (Idee)',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Konfidenzintervall', 'Statistik', 'Anteil'],
  fachwissen: {
    text: 'Ein Konfidenzintervall gibt einen Bereich an, in dem der unbekannte Parameter der Grundgesamtheit mit vorgegebener Sicherheit vermutet wird. In der Kursstufe genügt oft die Idee und einfache Anteilsschätzungen.',
    quelle: 'Wikipedia: Konfidenzintervall',
    url: 'https://de.wikipedia.org/wiki/Konfidenzintervall',
  },
  generate: (rng: Rng) => {
    const n = pick(rng, [100, 200, 400, 500, 1000])
    const k = randInt(rng, Math.floor(n * 0.15), Math.floor(n * 0.7))
    const pHat = k / n
    const lower = rng() < 0.5
    const half = 1.96 * Math.sqrt((pHat * (1 - pHat)) / n)
    const value = roundTo(lower ? pHat - half : pHat + half, 3)
    return valueTask({
      question: `In einer Umfrage unter ${n} zufällig ausgewählten Personen sagen ${k} „ja“. Berechne die ${lower ? 'untere' : 'obere'} Grenze des 95-%-Konfidenzintervalls für den Anteil p mit p̂ ± 1,96 · √(p̂(1 − p̂)/n). Runde auf drei Nachkommastellen.`,
      answerKind: 'decimal',
      value,
      eps: 0.0015,
      solution: formatDe(value),
      explanation: `p̂ = ${k}/${n} = ${formatDe(pHat)}. 1,96 · √(${formatDe(pHat)} · ${formatDe(roundTo(1 - pHat, 4))} / ${n}) ≈ ${formatDe(roundTo(half, 4))}. ${lower ? 'Untere' : 'Obere'} Grenze ≈ ${formatDe(value)}.`,
      dedupeKey: `ma:k1112:konfidenz:${n}:${k}:${lower}`,
    })
  },
}

export const k1112VolumenOptimierung: Topic = {
  id: 'k1112-lb8-volumen',
  title: 'Extremwert: offener Quader',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Extremwert', 'Volumen', 'Optimierung'],
  fachwissen: {
    text: 'Aus Zuschnitten (z. B. Quadrate aus Ecken einer Pappe) entstehen offene Quader. Das Volumen als Funktion der Schnittlänge wird maximiert — klassische Vernetzung Analysis/Raumgeometrie.',
    quelle: 'Wikipedia: Extremwertaufgabe',
    url: 'https://de.wikipedia.org/wiki/Extremwertaufgabe',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const S = 6 * randInt(rng, 2, 10)
      const x = S / 6
      const askV = rng() < 0.4
      const V = x * (S - 2 * x) ** 2
      return valueTask({
        question: askV
          ? `Aus einer quadratischen Pappe mit ${S} cm Seitenlänge werden an den Ecken gleich große Quadrate ausgeschnitten; der Rest wird zu einer oben offenen Schachtel gefaltet. Wie groß ist das größtmögliche Volumen der Schachtel?`
          : `Aus einer quadratischen Pappe mit ${S} cm Seitenlänge werden an den Ecken Quadrate der Seitenlänge x ausgeschnitten; der Rest wird zu einer oben offenen Schachtel gefaltet. Für welches x wird das Volumen maximal?`,
        unit: askV ? 'cm³' : 'cm',
        answerKind: 'integer',
        value: askV ? V : x,
        solution: askV ? `${V} cm³` : `${minus(x)} cm`,
        explanation: `V(x) = x · (${S} − 2x)², V′(x) = (${S} − 2x)(${S} − 6x) = 0 ⇒ x = ${minus(x)} (x = ${S / 2} ergibt V = 0). ${askV ? `V(${minus(x)}) = ${minus(x)} · ${S - 2 * x}² = ${V} cm³.` : ''}`.trim(),
        dedupeKey: `ma:k1112:schachtel:quadrat:${S}:${askV}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 10, 40)
      const b = randInt(rng, a + 4, a + 30)
      const x = roundTo((a + b - Math.sqrt(a * a - a * b + b * b)) / 6, 2)
      return valueTask({
        question: `Aus einem rechteckigen Blech (${minus(a)} cm × ${minus(b)} cm) werden an den Ecken Quadrate der Seitenlänge x ausgeschnitten; der Rest wird zu einer oben offenen Wanne gebogen. Für welches x wird das Volumen maximal? Runde auf zwei Nachkommastellen.`,
        unit: 'cm',
        answerKind: 'decimal',
        value: x,
        eps: 0.011,
        solution: `${formatDe(x)} cm`,
        explanation: `V(x) = x(${minus(a)} − 2x)(${minus(b)} − 2x) = 4x³ − ${2 * (a + b)}x² + ${a * b}x. V′(x) = 12x² − ${4 * (a + b)}x + ${a * b} = 0 liefert im zulässigen Bereich 0 < x < ${formatDe(a / 2)} die Lösung x ≈ ${formatDe(x)} cm.`,
        dedupeKey: `ma:k1112:schachtel:rechteck:${a}:${b}`,
      })
    },
  ),
}
