import { pick, randInt, type Rng } from '../lib/rng'
import { formatDe, roundTo } from '../lib/num'
import { valueTask } from './taskHelpers'
import type { Grade, Topic } from './types'

// ---------------------------------------------------------------------------
// Lernbereich 1 — Wachstumsvorgänge und periodische Vorgänge
// ---------------------------------------------------------------------------

const zinsen: Topic = {
  id: 'k10-lb1-zinsen',
  title: 'Jahreszinsen berechnen',
  hint: 'Z = K · p : 100.',
  pointsPerTask: 10,
  keywords: ['Zinsen', 'Zinsrechnung', 'Kapital', 'Prozent', 'Prozentsatz'],
  generate: (rng: Rng) => {
    const k = randInt(rng, 2, 40) * 100
    const p = pick(rng, [1, 2, 3, 4, 5, 8, 10])
    const value = roundTo((k * p) / 100, 2)
    return valueTask({
      question: `Ein Kapital von ${formatDe(k)} € wird mit ${formatDe(p)} % pro Jahr verzinst. Wie viel Zinsen fallen in einem Jahr an?`,
      unit: '€',
      answerKind: 'decimal',
      value,
      solution: `${formatDe(value)} €`,
      explanation: `Z = K · p : 100 = ${formatDe(k)} € · ${p} : 100 = ${formatDe(value)} €.`,
    })
  },
}

const zinseszins: Topic = {
  id: 'k10-lb1-zinseszins',
  title: 'Zinseszins: Endkapital',
  hint: 'Kₙ = K₀ · (1 + p/100)ⁿ.',
  pointsPerTask: 10,
  keywords: ['Zinseszins', 'Endkapital', 'Zinsrechnung', 'exponentiell', 'Kapital'],
  generate: (rng: Rng) => {
    const k0 = randInt(rng, 5, 50) * 100
    const p = pick(rng, [2, 3, 4, 5])
    const n = randInt(rng, 2, 4)
    const factor = 1 + p / 100
    const value = roundTo(k0 * factor ** n, 2)
    return valueTask({
      question: `Ein Kapital von ${formatDe(k0)} € wird ${n} Jahre mit ${p} % Zinseszins angelegt. Wie groß ist das Endkapital (auf zwei Nachkommastellen)?`,
      unit: '€',
      answerKind: 'decimal',
      value,
      eps: 0.05,
      solution: `${formatDe(value)} €`,
      explanation: `Kₙ = K₀ · (1 + p/100)ⁿ = ${formatDe(k0)} € · ${formatDe(factor)}^${n} ≈ ${formatDe(value)} €.`,
    })
  },
}

const prozentualeZunahme: Topic = {
  id: 'k10-lb1-prozentuale-zunahme',
  title: 'Prozentuale Zunahme',
  hint: 'Neuer Wert = alter Wert · (1 + p/100).',
  pointsPerTask: 10,
  keywords: ['prozentuale Zunahme', 'Wachstum', 'Prozent', 'Erhöhung', 'Zunahme'],
  generate: (rng: Rng) => {
    const start = randInt(rng, 2, 40) * 50
    const p = pick(rng, [10, 20, 25, 50])
    const value = roundTo(start * (1 + p / 100), 2)
    return valueTask({
      question: `Ein Preis von ${formatDe(start)} € steigt um ${p} %. Wie hoch ist der neue Preis?`,
      unit: '€',
      answerKind: 'decimal',
      value,
      solution: `${formatDe(value)} €`,
      explanation: `Neuer Wert = ${formatDe(start)} € · (1 + ${p}/100) = ${formatDe(start)} € · ${formatDe(1 + p / 100)} = ${formatDe(value)} €.`,
    })
  },
}

const expWachstum: Topic = {
  id: 'k10-lb1-exp-wachstum',
  title: 'Exponentielles Wachstum',
  hint: 'Bestand = Anfang · Faktorⁿ.',
  pointsPerTask: 10,
  keywords: ['exponentielles Wachstum', 'Verdopplung', 'Wachstumsfaktor', 'Bakterien'],
  generate: (rng: Rng) => {
    const start = randInt(rng, 2, 20)
    const factor = pick(rng, [2, 3])
    const n = randInt(rng, 2, 5)
    const value = start * factor ** n
    return valueTask({
      question: `Eine Bakterienkultur beginnt mit ${start} Bakterien und ${factor === 2 ? 'verdoppelt' : 'verdreifacht'} sich stündlich. Wie viele Bakterien sind es nach ${n} Stunden?`,
      answerKind: 'integer',
      value,
      solution: `${formatDe(value)}`,
      explanation: `Bestand = ${start} · ${factor}^${n} = ${start} · ${factor ** n} = ${formatDe(value)}.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 2 — Diskrete Zufallsgrößen
// ---------------------------------------------------------------------------

const erwartungswert: Topic = {
  id: 'k10-lb2-erwartungswert',
  title: 'Erwartungswert eines Glücksrads',
  hint: 'E(X) = Σ Auszahlung · Wahrscheinlichkeit.',
  pointsPerTask: 10,
  keywords: ['Erwartungswert', 'Zufallsgröße', 'Glücksrad', 'Wahrscheinlichkeit', 'E(X)'],
  generate: (rng: Rng) => {
    const n = pick(rng, [4, 5, 8, 10])
    const payoffs: number[] = []
    for (let i = 0; i < n; i++) payoffs.push(randInt(rng, 0, 10))
    let sum = payoffs.reduce((s, x) => s + x, 0)
    const rem = sum % n
    if (rem !== 0) {
      payoffs[n - 1] += n - rem
      sum += n - rem
    }
    const value = sum / n
    return valueTask({
      question: `Ein Glücksrad hat ${n} gleich große Felder mit den Auszahlungen ${payoffs.join(', ')} €. Berechne den Erwartungswert.`,
      unit: '€',
      answerKind: 'decimal',
      value,
      solution: `${formatDe(value)} €`,
      explanation: `Jedes Feld hat die Wahrscheinlichkeit 1/${n}. E(X) = (${payoffs.join(' + ')}) : ${n} = ${sum} : ${n} = ${formatDe(value)} €.`,
    })
  },
}

const erwartungswertWuerfel: Topic = {
  id: 'k10-lb2-erwartungswert-wuerfel',
  title: 'Erwartungswert beim Würfel',
  hint: 'Multipliziere jede Augenzahl mit 1/6 und addiere.',
  pointsPerTask: 10,
  keywords: ['Erwartungswert', 'Würfel', 'Zufallsgröße', 'Gewinn', 'Wahrscheinlichkeit'],
  generate: (rng: Rng) => {
    // Payoff = augenzahl · faktor; E = faktor · 3,5 → keep clean by faktor even.
    const faktor = pick(rng, [2, 4, 6])
    const value = roundTo(faktor * 3.5, 2)
    return valueTask({
      question: `Bei einem Würfelspiel erhält man das ${faktor}-fache der gewürfelten Augenzahl (in €) ausgezahlt. Berechne den Erwartungswert des Gewinns.`,
      unit: '€',
      answerKind: 'decimal',
      value,
      solution: `${formatDe(value)} €`,
      explanation: `Der Erwartungswert der Augenzahl ist (1+2+3+4+5+6) : 6 = 3,5. Mit dem Faktor ${faktor}: ${faktor} · 3,5 = ${formatDe(value)} €.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 3 — Algebraisches Lösen geometrischer Probleme
// ---------------------------------------------------------------------------

const rechteckBreite: Topic = {
  id: 'k10-lb3-rechteck-breite',
  title: 'Rechteck: Breite aus Fläche',
  hint: 'b = A : a.',
  pointsPerTask: 10,
  keywords: ['Rechteck', 'Flächeninhalt', 'algebraisch', 'Gleichung', 'Seite'],
  generate: (rng: Rng) => {
    const a = randInt(rng, 3, 20)
    const b = randInt(rng, 3, 20)
    const area = a * b
    return valueTask({
      question: `Ein Rechteck hat den Flächeninhalt ${area} cm² und die Länge a = ${a} cm. Berechne die Breite b.`,
      unit: 'cm',
      answerKind: 'integer',
      value: b,
      solution: `${b} cm`,
      explanation: `Aus A = a · b folgt b = A : a = ${area} cm² : ${a} cm = ${b} cm.`,
    })
  },
}

const quadratSeite: Topic = {
  id: 'k10-lb3-quadrat-seite',
  title: 'Quadrat: Seitenlänge aus Fläche',
  hint: 'a = √A.',
  pointsPerTask: 10,
  keywords: ['Quadrat', 'Flächeninhalt', 'Wurzel', 'Seitenlänge', 'algebraisch'],
  generate: (rng: Rng) => {
    const a = randInt(rng, 2, 25)
    const area = a * a
    return valueTask({
      question: `Ein Quadrat hat den Flächeninhalt ${area} cm². Berechne seine Seitenlänge.`,
      unit: 'cm',
      answerKind: 'integer',
      value: a,
      solution: `${a} cm`,
      explanation: `Aus A = a² folgt a = √A = √${area} cm² = ${a} cm.`,
    })
  },
}

const rechteckBreiteUmfang: Topic = {
  id: 'k10-lb3-rechteck-umfang',
  title: 'Rechteck: Breite aus Umfang',
  hint: 'b = U : 2 − a.',
  pointsPerTask: 10,
  keywords: ['Rechteck', 'Umfang', 'algebraisch', 'Gleichung', 'Seite'],
  generate: (rng: Rng) => {
    const a = randInt(rng, 3, 20)
    const b = randInt(rng, 3, 20)
    const u = 2 * (a + b)
    return valueTask({
      question: `Ein Rechteck hat den Umfang ${u} cm und die Länge a = ${a} cm. Berechne die Breite b.`,
      unit: 'cm',
      answerKind: 'integer',
      value: b,
      solution: `${b} cm`,
      explanation: `Aus U = 2 · (a + b) folgt b = U : 2 − a = ${u} : 2 − ${a} = ${u / 2} − ${a} = ${b} cm.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 4 — Funktionale Zusammenhänge
// ---------------------------------------------------------------------------

const reinquadratisch: Topic = {
  id: 'k10-lb4-reinquadratisch',
  title: 'Reinquadratische Gleichung x² = a',
  hint: 'Positive Lösung: x = √a.',
  pointsPerTask: 10,
  keywords: ['quadratische Gleichung', 'Wurzel', 'x²', 'lösen', 'reinquadratisch'],
  generate: (rng: Rng) => {
    const x = randInt(rng, 2, 20)
    const a = x * x
    return valueTask({
      question: `Bestimme die positive Lösung der Gleichung x² = ${a}.`,
      answerKind: 'integer',
      value: x,
      solution: `x = ${x}`,
      explanation: `x² = ${a} bedeutet x = √${a} = ${x} (die positive Lösung).`,
    })
  },
}

const quadratischGleichung: Topic = {
  id: 'k10-lb4-quadratische-gleichung',
  title: 'Quadratische Gleichung (größere Lösung)',
  hint: 'Faktorisiere: (x − x₁)(x − x₂) = 0.',
  pointsPerTask: 10,
  keywords: ['quadratische Gleichung', 'Nullstellen', 'faktorisieren', 'Satz von Vieta', 'lösen'],
  generate: (rng: Rng) => {
    let r1 = randInt(rng, -8, 8)
    let r2 = randInt(rng, -8, 8)
    while (r1 === r2) r2 = randInt(rng, -8, 8)
    if (r1 < r2) [r1, r2] = [r2, r1] // r1 is the larger root
    const p = -(r1 + r2)
    const q = r1 * r2
    const pStr = p < 0 ? `− ${Math.abs(p)}x` : `+ ${p}x`
    const qStr = q < 0 ? `− ${Math.abs(q)}` : `+ ${q}`
    return valueTask({
      question: `Bestimme die größere Lösung der Gleichung x² ${pStr} ${qStr} = 0.`,
      answerKind: 'integer',
      value: r1,
      solution: `x = ${r1}`,
      explanation: `Die Gleichung lässt sich als (x − ${r1})(x − ${r2}) = 0 schreiben. Die Lösungen sind x₁ = ${r1} und x₂ = ${r2}; die größere ist ${r1}.`,
    })
  },
}

const parabelWert: Topic = {
  id: 'k10-lb4-parabel-wert',
  title: 'Funktionswert einer Parabel',
  hint: 'Setze x in f(x) = a·x² + c ein.',
  pointsPerTask: 10,
  keywords: ['Parabel', 'quadratische Funktion', 'Funktionswert', 'einsetzen'],
  generate: (rng: Rng) => {
    const a = pick(rng, [-2, -1, 1, 2, 3])
    const c = randInt(rng, -8, 8)
    const x = randInt(rng, -6, 6)
    const value = a * x * x + c
    const cStr = c < 0 ? `− ${Math.abs(c)}` : `+ ${c}`
    return valueTask({
      question: `Gegeben ist f(x) = ${a}·x² ${cStr}. Berechne f(${x}).`,
      answerKind: 'integer',
      value,
      solution: formatDe(value),
      explanation: `Setze x = ${x} ein: ${a} · ${x}² ${cStr} = ${a} · ${x * x} ${cStr} = ${a * x * x} ${cStr} = ${value}.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 5 — Vernetzung: Zinsrechnung
// ---------------------------------------------------------------------------

const kapitalAusZinsen: Topic = {
  id: 'k10-lb5-kapital',
  title: 'Kapital aus Zinsen bestimmen',
  hint: 'K = Z · 100 : p.',
  pointsPerTask: 10,
  keywords: ['Zinsrechnung', 'Kapital', 'Zinsen', 'Prozentsatz', 'Grundwert'],
  generate: (rng: Rng) => {
    const k = randInt(rng, 2, 40) * 100
    const p = pick(rng, [1, 2, 4, 5, 10])
    const z = (k * p) / 100
    return valueTask({
      question: `Bei einem Zinssatz von ${p} % pro Jahr wurden ${formatDe(z)} € Zinsen gezahlt. Wie groß war das Kapital?`,
      unit: '€',
      answerKind: 'decimal',
      value: k,
      solution: `${formatDe(k)} €`,
      explanation: `Aus Z = K · p : 100 folgt K = Z · 100 : p = ${formatDe(z)} € · 100 : ${p} = ${formatDe(k)} €.`,
    })
  },
}

const zinssatz: Topic = {
  id: 'k10-lb5-zinssatz',
  title: 'Zinssatz bestimmen',
  hint: 'p = Z · 100 : K.',
  pointsPerTask: 10,
  keywords: ['Zinsrechnung', 'Zinssatz', 'Prozentsatz', 'Zinsen', 'Kapital'],
  generate: (rng: Rng) => {
    const k = randInt(rng, 2, 40) * 100
    const p = pick(rng, [1, 2, 3, 4, 5, 8, 10])
    const z = (k * p) / 100
    return valueTask({
      question: `Für ein Kapital von ${formatDe(k)} € wurden ${formatDe(z)} € Zinsen in einem Jahr gezahlt. Wie hoch war der Zinssatz in Prozent?`,
      unit: '%',
      answerKind: 'decimal',
      value: p,
      solution: `${formatDe(p)} %`,
      explanation: `p = Z · 100 : K = ${formatDe(z)} € · 100 : ${formatDe(k)} € = ${formatDe(p)} %.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Grade — Klasse 10 (Gymnasium Mathematik, Sachsen)
// ---------------------------------------------------------------------------

export const klasse10: Grade = {
  id: 'klasse-10',
  title: 'Klasse 10',
  areas: [
    {
      id: 'lb1',
      title: 'Wachstumsvorgänge und periodische Vorgänge',
      ustd: 22,
      topics: [zinsen, zinseszins, prozentualeZunahme, expWachstum],
    },
    {
      id: 'lb2',
      title: 'Diskrete Zufallsgrößen',
      ustd: 16,
      topics: [erwartungswert, erwartungswertWuerfel],
    },
    {
      id: 'lb3',
      title: 'Algebraisches Lösen geometrischer Probleme',
      ustd: 20,
      topics: [rechteckBreite, quadratSeite, rechteckBreiteUmfang],
    },
    {
      id: 'lb4',
      title: 'Funktionale Zusammenhänge',
      ustd: 42,
      topics: [reinquadratisch, quadratischGleichung, parabelWert],
    },
    {
      id: 'lb5',
      title: 'Vernetzung: Zinsrechnung',
      ustd: 4,
      topics: [kapitalAusZinsen, zinssatz],
    },
  ],
}
