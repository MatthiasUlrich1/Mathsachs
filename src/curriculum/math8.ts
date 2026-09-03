import { pick, randInt, type Rng } from '../lib/rng'
import { makeFraction, subtract, format, type Fraction } from '../lib/fraction'
import { formatDe, roundTo } from '../lib/num'
import { fractionTask, valueTask } from './taskHelpers'
import type { Grade, Topic } from './types'

const num = (n: number): string => (n < 0 ? `(−${Math.abs(n)})` : `${n}`)
const nonZero = (rng: Rng, min: number, max: number): number => {
  let v = 0
  while (v === 0) v = randInt(rng, min, max)
  return v
}

// ---------------------------------------------------------------------------
// Lernbereich 1 — Arbeiten mit Termen und Gleichungen
// ---------------------------------------------------------------------------

const zusammenfassen: Topic = {
  id: 'k8-lb1-zusammenfassen',
  title: 'Terme zusammenfassen (Zahl vor x)',
  hint: 'Fasse nur die x-Glieder zusammen.',
  pointsPerTask: 10,
  keywords: ['Term', 'zusammenfassen', 'gleichartige Glieder', 'Variable', 'x'],
  generate: (rng: Rng) => {
    const a = nonZero(rng, -9, 9)
    const c = nonZero(rng, -9, 9)
    const b = nonZero(rng, -9, 9)
    const d = nonZero(rng, -9, 9)
    const coeff = a + c
    return valueTask({
      question: `Fasse zusammen und gib die Zahl vor x an: ${num(a)}x + ${num(b)} + ${num(c)}x + ${num(d)}`,
      answerKind: 'integer',
      value: coeff,
      solution: `${coeff}x`,
      explanation: `Fasse die x-Glieder zusammen: ${num(a)}x + ${num(c)}x = ${coeff}x. Die Zahl vor x ist ${coeff}.`,
    })
  },
}

const termAuswerten: Topic = {
  id: 'k8-lb1-term-auswerten',
  title: 'Term auswerten (x einsetzen)',
  hint: 'Setze den Wert für x ein und rechne aus.',
  pointsPerTask: 10,
  keywords: ['Term', 'einsetzen', 'auswerten', 'Wert', 'x'],
  generate: (rng: Rng) => {
    const a = nonZero(rng, -6, 6)
    const b = nonZero(rng, -12, 12)
    const x = nonZero(rng, -8, 8)
    const value = a * x + b
    return valueTask({
      question: `Berechne den Wert des Terms ${num(a)}·x + ${num(b)} für x = ${x}.`,
      answerKind: 'integer',
      value,
      solution: formatDe(value),
      explanation: `Setze x = ${x} ein: ${num(a)} · ${num(x)} + ${num(b)} = ${a * x} + ${num(b)} = ${value}.`,
    })
  },
}

const gleichungLinear: Topic = {
  id: 'k8-lb1-gleichung-linear',
  title: 'Lineare Gleichung a·x + b = c',
  hint: 'Erst b, dann den Faktor a beseitigen.',
  pointsPerTask: 10,
  keywords: ['Gleichung', 'linear', 'lösen', 'x', 'Äquivalenzumformung'],
  generate: (rng: Rng) => {
    const a = nonZero(rng, -9, 9)
    const x = nonZero(rng, -10, 10)
    const b = nonZero(rng, -15, 15)
    const c = a * x + b
    return valueTask({
      question: `Löse die Gleichung nach x: ${num(a)}·x + ${num(b)} = ${c}`,
      answerKind: 'integer',
      value: x,
      solution: `x = ${x}`,
      explanation: `Subtrahiere ${num(b)}: ${num(a)}·x = ${c} − ${num(b)} = ${a * x}. Teile durch ${num(a)}: x = ${a * x} : ${num(a)} = ${x}.`,
    })
  },
}

const gleichungBeidseitig: Topic = {
  id: 'k8-lb1-gleichung-beidseitig',
  title: 'Gleichung mit x auf beiden Seiten',
  hint: 'Bringe alle x auf eine Seite.',
  pointsPerTask: 10,
  keywords: ['Gleichung', 'beide Seiten', 'lösen', 'x', 'linear'],
  generate: (rng: Rng) => {
    const a = nonZero(rng, -8, 8)
    let c = nonZero(rng, -8, 8)
    while (a === c) c = nonZero(rng, -8, 8)
    const x = nonZero(rng, -9, 9)
    const b = nonZero(rng, -12, 12)
    const d = (a - c) * x + b
    // a·x + b = c·x + d
    return valueTask({
      question: `Löse die Gleichung nach x: ${num(a)}·x + ${num(b)} = ${num(c)}·x + ${num(d)}`,
      answerKind: 'integer',
      value: x,
      solution: `x = ${x}`,
      explanation: `Bringe die x-Glieder nach links, die Zahlen nach rechts: (${a} − ${c})·x = ${d} − ${b}, also ${a - c}·x = ${d - b}. Teile durch ${a - c}: x = ${x}.`,
    })
  },
}

const ausmultiplizieren: Topic = {
  id: 'k8-lb1-ausmultiplizieren',
  title: 'Klammer ausmultiplizieren (Wert bei x)',
  hint: 'Distributivgesetz: a·(bx + c) = ab·x + ac.',
  pointsPerTask: 10,
  keywords: ['Distributivgesetz', 'ausmultiplizieren', 'Klammer', 'Term'],
  generate: (rng: Rng) => {
    const a = nonZero(rng, -6, 6)
    const b = nonZero(rng, -6, 6)
    const c = nonZero(rng, -8, 8)
    const x = nonZero(rng, -6, 6)
    const value = a * (b * x + c)
    return valueTask({
      question: `Multipliziere aus und berechne für x = ${x}: ${num(a)}·(${num(b)}x + ${num(c)})`,
      answerKind: 'integer',
      value,
      solution: formatDe(value),
      explanation: `Ausmultiplizieren: ${num(a)}·(${num(b)}x + ${num(c)}) = ${a * b}x + ${num(a * c)}. Für x = ${x}: ${a * b} · ${num(x)} + ${num(a * c)} = ${a * b * x} + ${num(a * c)} = ${value}.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 2 — Zufallsversuche
// ---------------------------------------------------------------------------

const laplaceBruch: Topic = {
  id: 'k8-lb2-laplace-bruch',
  title: 'Laplace-Wahrscheinlichkeit als Bruch',
  hint: 'P = günstige : mögliche Ergebnisse.',
  pointsPerTask: 10,
  keywords: ['Wahrscheinlichkeit', 'Laplace', 'Zufall', 'Bruch', 'günstige Ergebnisse'],
  generate: (rng: Rng) => {
    const rot = randInt(rng, 1, 6)
    const blau = randInt(rng, 1, 6)
    const gruen = randInt(rng, 1, 6)
    const total = rot + blau + gruen
    const farbe = pick(rng, [
      ['rote', rot],
      ['blaue', blau],
      ['grüne', gruen],
    ] as const)
    const value = makeFraction(farbe[1], total)
    return fractionTask({
      question: `In einer Urne liegen ${rot} rote, ${blau} blaue und ${gruen} grüne Kugeln. Wie groß ist die Wahrscheinlichkeit, eine ${farbe[0]} Kugel zu ziehen? Gib den gekürzten Bruch an.`,
      value,
      requireReduced: true,
      solution: format(value),
      explanation: `Es gibt ${farbe[1]} günstige und ${total} mögliche Ergebnisse: P = ${farbe[1]}/${total} = ${format(value)}.`,
    })
  },
}

const laplaceProzent: Topic = {
  id: 'k8-lb2-laplace-prozent',
  title: 'Laplace-Wahrscheinlichkeit in Prozent',
  hint: 'P = günstige : mögliche, dann · 100.',
  pointsPerTask: 10,
  keywords: ['Wahrscheinlichkeit', 'Laplace', 'Prozent', 'Zufall', 'Würfel'],
  generate: (rng: Rng) => {
    const total = pick(rng, [4, 5, 8, 10, 20, 25])
    const k = randInt(rng, 1, total - 1)
    const value = roundTo((k / total) * 100, 2)
    return valueTask({
      question: `Ein Glücksrad hat ${total} gleich große Felder, davon sind ${k} gewinnbringend. Wie groß ist die Gewinnwahrscheinlichkeit in Prozent?`,
      unit: '%',
      answerKind: 'decimal',
      value,
      solution: `${formatDe(value)} %`,
      explanation: `P = ${k} : ${total} = ${formatDe(k / total)}. In Prozent: · 100 = ${formatDe(value)} %.`,
    })
  },
}

const gegenwahrscheinlichkeit: Topic = {
  id: 'k8-lb2-gegenwahrscheinlichkeit',
  title: 'Gegenwahrscheinlichkeit',
  hint: 'P(nicht A) = 1 − P(A).',
  pointsPerTask: 10,
  keywords: ['Gegenwahrscheinlichkeit', 'Gegenereignis', 'Wahrscheinlichkeit', 'Komplement'],
  generate: (rng: Rng) => {
    const total = pick(rng, [4, 5, 6, 8, 10, 12])
    const k = randInt(rng, 1, total - 1)
    const p: Fraction = makeFraction(k, total)
    const value = subtract({ n: 1, d: 1 }, p)
    return fractionTask({
      question: `Ein Ereignis hat die Wahrscheinlichkeit ${format(p)}. Wie groß ist die Gegenwahrscheinlichkeit? Gib den gekürzten Bruch an.`,
      value,
      requireReduced: true,
      solution: format(value),
      explanation: `Die Gegenwahrscheinlichkeit ist 1 − P = 1 − ${format(p)} = ${format(value)}.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 3 — Funktionen und lineare Gleichungssysteme
// ---------------------------------------------------------------------------

const funktionswert: Topic = {
  id: 'k8-lb3-funktionswert',
  title: 'Funktionswert einer linearen Funktion',
  hint: 'Setze x in f(x) = m·x + n ein.',
  pointsPerTask: 10,
  keywords: ['lineare Funktion', 'Funktionswert', 'einsetzen', 'Gerade', 'f(x)'],
  generate: (rng: Rng) => {
    const m = nonZero(rng, -6, 6)
    const n = nonZero(rng, -10, 10)
    const x = nonZero(rng, -8, 8)
    const value = m * x + n
    return valueTask({
      question: `Gegeben ist f(x) = ${num(m)}·x + ${num(n)}. Berechne f(${x}).`,
      answerKind: 'integer',
      value,
      solution: formatDe(value),
      explanation: `Setze x = ${x} ein: f(${x}) = ${num(m)} · ${num(x)} + ${num(n)} = ${m * x} + ${num(n)} = ${value}.`,
    })
  },
}

const steigung: Topic = {
  id: 'k8-lb3-steigung',
  title: 'Steigung aus zwei Punkten',
  hint: 'm = (y₂ − y₁) : (x₂ − x₁).',
  pointsPerTask: 10,
  keywords: ['Steigung', 'lineare Funktion', 'Gerade', 'Punkte', 'Differenzenquotient'],
  generate: (rng: Rng) => {
    const x1 = nonZero(rng, -8, 8)
    let x2 = nonZero(rng, -8, 8)
    while (x2 === x1) x2 = nonZero(rng, -8, 8)
    const m = nonZero(rng, -5, 5)
    const y1 = randInt(rng, -10, 10)
    const y2 = y1 + m * (x2 - x1)
    return valueTask({
      question: `Eine Gerade verläuft durch P(${x1} | ${y1}) und Q(${x2} | ${y2}). Berechne die Steigung m.`,
      answerKind: 'integer',
      value: m,
      solution: `m = ${m}`,
      explanation: `m = (y₂ − y₁) : (x₂ − x₁) = (${y2} − ${y1}) : (${x2} − ${x1}) = ${y2 - y1} : ${x2 - x1} = ${m}.`,
    })
  },
}

const achsenabschnitt: Topic = {
  id: 'k8-lb3-achsenabschnitt',
  title: 'y-Achsenabschnitt bestimmen',
  hint: 'n = y − m·x.',
  pointsPerTask: 10,
  keywords: ['y-Achsenabschnitt', 'lineare Funktion', 'Gerade', 'n'],
  generate: (rng: Rng) => {
    const m = nonZero(rng, -5, 5)
    const x = nonZero(rng, -6, 6)
    const n = nonZero(rng, -10, 10)
    const y = m * x + n
    return valueTask({
      question: `Eine Gerade mit der Steigung m = ${m} geht durch den Punkt P(${x} | ${y}). Bestimme den y-Achsenabschnitt n.`,
      answerKind: 'integer',
      value: n,
      solution: `n = ${n}`,
      explanation: `Aus y = m·x + n folgt n = y − m·x = ${y} − ${m} · ${num(x)} = ${y} − ${m * x} = ${n}.`,
    })
  },
}

const lgs: Topic = {
  id: 'k8-lb3-lgs',
  title: 'Lineares Gleichungssystem (x bestimmen)',
  hint: 'Additions- oder Einsetzungsverfahren.',
  pointsPerTask: 10,
  keywords: ['LGS', 'Gleichungssystem', 'zwei Gleichungen', 'lösen', 'x und y'],
  generate: (rng: Rng) => {
    const x = nonZero(rng, -6, 6)
    const y = nonZero(rng, -6, 6)
    const a = nonZero(rng, -4, 4)
    const b = nonZero(rng, -4, 4)
    const c = nonZero(rng, -4, 4)
    let d = nonZero(rng, -4, 4)
    // Ensure a unique solution: determinant a*d - b*c != 0.
    while (a * d - b * c === 0) d = nonZero(rng, -4, 4)
    const e = a * x + b * y
    const f = c * x + d * y
    return valueTask({
      question: `Löse das Gleichungssystem und gib x an:  ${num(a)}x + ${num(b)}y = ${e}  und  ${num(c)}x + ${num(d)}y = ${f}.`,
      answerKind: 'integer',
      value: x,
      solution: `x = ${x}`,
      explanation: `Mit dem Additionsverfahren erhält man die eindeutige Lösung x = ${x} (und y = ${y}), da die Determinante ${a}·${d} − ${b}·${c} = ${a * d - b * c} ≠ 0 ist.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 4 — Ähnlichkeit
// ---------------------------------------------------------------------------

const streckfaktor: Topic = {
  id: 'k8-lb4-streckfaktor',
  title: 'Streckfaktor bestimmen',
  hint: 'k = Bildlänge : Originallänge.',
  pointsPerTask: 10,
  keywords: ['Ähnlichkeit', 'Streckfaktor', 'zentrische Streckung', 'Maßstab'],
  generate: (rng: Rng) => {
    const orig = randInt(rng, 2, 12)
    const k = randInt(rng, 2, 6)
    const bild = orig * k
    return valueTask({
      question: `Eine Strecke der Länge ${orig} cm wird auf ${bild} cm gestreckt. Bestimme den Streckfaktor k.`,
      answerKind: 'integer',
      value: k,
      solution: `k = ${k}`,
      explanation: `k = Bildlänge : Originallänge = ${bild} cm : ${orig} cm = ${k}.`,
    })
  },
}

const strahlensatz: Topic = {
  id: 'k8-lb4-strahlensatz',
  title: 'Strahlensatz: fehlende Länge',
  hint: 'Gleiche Verhältnisse: a : b = c : x.',
  pointsPerTask: 10,
  keywords: ['Strahlensatz', 'Ähnlichkeit', 'Verhältnis', 'Streckenlänge'],
  generate: (rng: Rng) => {
    const a = randInt(rng, 2, 8)
    const k = randInt(rng, 2, 6)
    const b = a * k
    const c = randInt(rng, 2, 9)
    const x = c * k
    return valueTask({
      question: `Beim Strahlensatz gilt ${a} : ${b} = ${c} : x. Berechne x.`,
      unit: 'cm',
      answerKind: 'integer',
      value: x,
      solution: `x = ${x} cm`,
      explanation: `Aus ${a} : ${b} = ${c} : x folgt x = ${c} · ${b} : ${a} = ${c} · ${k} = ${x}.`,
    })
  },
}

const aehnlicheSeite: Topic = {
  id: 'k8-lb4-aehnliche-seite',
  title: 'Ähnliche Figuren: Seitenlänge',
  hint: 'Multipliziere mit dem Ähnlichkeitsfaktor.',
  pointsPerTask: 10,
  keywords: ['Ähnlichkeit', 'ähnliche Dreiecke', 'Seitenverhältnis', 'Faktor'],
  generate: (rng: Rng) => {
    const seite = randInt(rng, 3, 12)
    const k = randInt(rng, 2, 5)
    const value = seite * k
    return valueTask({
      question: `Zwei Dreiecke sind ähnlich mit dem Faktor k = ${k}. Eine Seite des kleinen Dreiecks ist ${seite} cm lang. Wie lang ist die entsprechende Seite des großen Dreiecks?`,
      unit: 'cm',
      answerKind: 'integer',
      value,
      solution: `${value} cm`,
      explanation: `Bei ähnlichen Figuren werden entsprechende Seiten mit k multipliziert: ${seite} cm · ${k} = ${value} cm.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 5 — Vernetzung: Heuristische Strategien
// ---------------------------------------------------------------------------

const zahlenraetsel: Topic = {
  id: 'k8-lb5-zahlenraetsel',
  title: 'Zahlenrätsel (Gleichung aufstellen)',
  hint: 'Übersetze in eine Gleichung und löse.',
  pointsPerTask: 10,
  keywords: ['Zahlenrätsel', 'Gleichung', 'heuristisch', 'Textaufgabe', 'Rückwärtsrechnen'],
  generate: (rng: Rng) => {
    const a = randInt(rng, 2, 6)
    const b = nonZero(rng, -12, 12)
    const x = randInt(rng, 2, 15)
    const c = a * x + b
    const op = b >= 0 ? `addiere ${b}` : `subtrahiere ${Math.abs(b)}`
    return valueTask({
      question: `Ich denke mir eine Zahl, multipliziere sie mit ${a} und ${op}. Das Ergebnis ist ${c}. Wie lautet die Zahl?`,
      answerKind: 'integer',
      value: x,
      solution: `${x}`,
      explanation: `Gleichung: ${a}·x + ${num(b)} = ${c}. Umstellen: ${a}·x = ${c} − ${num(b)} = ${a * x}, also x = ${x}.`,
    })
  },
}

const rueckwaerts: Topic = {
  id: 'k8-lb5-rueckwaerts',
  title: 'Rückwärtsrechnen',
  hint: 'Kehre die Rechenschritte um.',
  pointsPerTask: 10,
  keywords: ['Rückwärtsrechnen', 'Umkehroperation', 'heuristisch', 'Strategie'],
  generate: (rng: Rng) => {
    const start = randInt(rng, 2, 20)
    const add = randInt(rng, 1, 15)
    const mal = randInt(rng, 2, 5)
    const end = (start + add) * mal
    return valueTask({
      question: `Zu einer Zahl wird ${add} addiert, das Ergebnis mit ${mal} multipliziert. Man erhält ${end}. Wie lautet die Ausgangszahl?`,
      answerKind: 'integer',
      value: start,
      solution: `${start}`,
      explanation: `Rückwärts: ${end} : ${mal} = ${end / mal}, dann − ${add} = ${start}.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Grade — Klasse 8 (Gymnasium Mathematik, Sachsen)
// ---------------------------------------------------------------------------

export const klasse8: Grade = {
  id: 'klasse-8',
  title: 'Klasse 8',
  areas: [
    {
      id: 'lb1',
      title: 'Arbeiten mit Termen und Gleichungen',
      ustd: 24,
      topics: [zusammenfassen, termAuswerten, gleichungLinear, gleichungBeidseitig, ausmultiplizieren],
    },
    {
      id: 'lb2',
      title: 'Zufallsversuche',
      ustd: 24,
      topics: [laplaceBruch, laplaceProzent, gegenwahrscheinlichkeit],
    },
    {
      id: 'lb3',
      title: 'Funktionen und lineare Gleichungssysteme',
      ustd: 32,
      topics: [funktionswert, steigung, achsenabschnitt, lgs],
    },
    {
      id: 'lb4',
      title: 'Ähnlichkeit',
      ustd: 20,
      topics: [streckfaktor, strahlensatz, aehnlicheSeite],
    },
    {
      id: 'lb5',
      title: 'Vernetzung: Heuristische Strategien',
      ustd: 4,
      topics: [zahlenraetsel, rueckwaerts],
    },
  ],
}
