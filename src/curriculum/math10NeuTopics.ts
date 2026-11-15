/**
 * Klasse 10 Mathematik — zusätzliche Neu-(Prüfung)-Banken nach Bettermarks.
 * Sibling-IDs: `${parentId}__neu`, neu:true, released:false.
 * Bestehende `__grafik` (siehe graphicReviewTopics.ts) bleiben parallel.
 * Händisch; keine Bulk-Skripte. Originale in math10.ts unberührt.
 */
import { pick, randInt, type Rng } from '../lib/rng'
import { formatDe, roundTo } from '../lib/num'
import {
  generateGridRectSvg,
  generateParabolaSvg,
  generateSpinnerSvg,
} from '../lib/geometrySvg'
import { shuffleChoices } from './biologieHelpers'
import {
  choicePickTask,
  mixedVariants,
  numberLineTask,
  paramSliderTask,
  valueTask,
  visualTask,
} from './taskHelpers'
import { asNeuTopic } from './neuTopic'
import type { Topic } from './types'

// ---------------------------------------------------------------------------
// Lokaler Helfer (bewusst nicht aus math10.ts importiert — Zirkelimport-Gefahr,
// da math10.ts seinerseits math10NeuLb1..Lb5 importiert).
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Lernbereich 1 — Wachstumsvorgänge und periodische Vorgänge
// ---------------------------------------------------------------------------

const zinsenMonateNeu: Topic = asNeuTopic('k10-lb1-zinsen', {
  id: 'k10-lb1-zinsen__neu',
  title: 'Zinsen für mehrere Monate berechnen',
  hint: 'Rechne den Jahreszins anteilig auf die Monate um: Z = K · p · m : (100 · 12).',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Zinsen', 'Monatszinsen', 'anteilig', 'Zinsrechnung', 'Jahreszins'],
  fachwissen: {
    text: 'Wird ein Kapital nicht ein ganzes Jahr, sondern nur einen Teil des Jahres verzinst, berechnet man die Zinsen anteilig: Z = K · p · m : (100 · 12), wobei m die Anzahl der Monate ist. So lassen sich z. B. Zinsen für ein unterjährig eröffnetes oder aufgelöstes Sparkonto bestimmen.',
    quelle: 'Wikipedia: Zinsrechnung',
    url: 'https://de.wikipedia.org/wiki/Zinsrechnung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const k = randInt(rng, 2, 40) * 100
      const p = pick(rng, [2, 4, 5, 8, 10])
      const m = pick(rng, [3, 4, 6, 9])
      const value = roundTo((k * p * m) / 1200, 2)
      return valueTask({
        question: `Ein Kapital von ${formatDe(k)} € wird für ${m} Monate mit ${formatDe(p)} % Jahreszins verzinst. Wie viel Zinsen fallen an (zwei Nachkommastellen)?`,
        unit: '€',
        answerKind: 'decimal',
        value,
        eps: 0.02,
        solution: `${formatDe(value)} €`,
        explanation: `Z = K · p · m : (100 · 12) = ${formatDe(k)} € · ${p} · ${m} : 1200 = ${formatDe(value)} €.`,
        dedupeKey: `k10neuzinsmon-tippen:${k}:${p}:${m}`,
      })
    },
    (rng: Rng) => {
      const k = randInt(rng, 2, 40) * 100
      const p = pick(rng, [2, 4, 5, 8, 10])
      const m = pick(rng, [3, 4, 6, 9])
      const value = roundTo((k * p * m) / 1200, 2)
      const correct = `${formatDe(value)} €`
      const wrong1 = `${formatDe(roundTo((k * p) / 100, 2))} €` // ganzes Jahr statt Monate gerechnet
      const wrong2 = `${formatDe(roundTo((k * p * m) / 100, 2))} €` // Division durch 12 vergessen
      const wrong3 = `${formatDe(roundTo((k * p) / (100 * m), 2))} €` // durch m geteilt statt multipliziert
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Kapital von ${formatDe(k)} € wird für ${m} Monate mit ${formatDe(p)} % Jahreszins verzinst. Wie viel Zinsen fallen an?`,
        choices,
        correct,
        solution: correct,
        explanation: `Z = K · p · m : (100 · 12) = ${formatDe(k)} € · ${p} · ${m} : 1200 = ${formatDe(value)} €.`,
        dedupeKey: `k10neuzinsmon-mc:${k}:${p}:${m}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 2, 20)
      const k = a * 100
      const p = 10
      const m = 6
      const value = 5 * a
      return numberLineTask({
        question: `Ein Kapital von ${formatDe(k)} € wird für ${m} Monate mit ${formatDe(p)} % Jahreszins verzinst. Markiere die Zinsen (in €) auf dem Zahlenstrahl.`,
        min: 0,
        max: 100,
        step: 1,
        value,
        solution: `${formatDe(value)} €`,
        explanation: `Z = K · p · m : (100 · 12) = ${formatDe(k)} € · ${p} · ${m} : 1200 = ${formatDe(value)} €.`,
      })
    },
  ),
})

const zinseszinsStartkapitalNeu: Topic = asNeuTopic('k10-lb1-zinseszins', {
  id: 'k10-lb1-zinseszins__neu',
  title: 'Zinseszins: Anfangskapital (Barwert) berechnen',
  hint: 'Stelle Kₙ = K₀ · (1 + p/100)ⁿ nach K₀ um: K₀ = Kₙ : (1 + p/100)ⁿ.',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Zinseszins', 'Barwert', 'Anfangskapital', 'Zinsrechnung', 'umstellen'],
  fachwissen: {
    text: 'Will man wissen, welches Anfangskapital man heute anlegen muss, um nach n Jahren ein bestimmtes Endkapital zu erreichen, stellt man die Zinseszinsformel um: K₀ = Kₙ : (1 + p/100)ⁿ. Diesen Vorgang nennt man Abzinsung oder Diskontierung; er ist Grundlage der Barwertberechnung.',
    quelle: 'Wikipedia: Zinseszins',
    url: 'https://de.wikipedia.org/wiki/Zinseszins',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const k0 = randInt(rng, 5, 50) * 100
      const p = pick(rng, [2, 3, 4, 5])
      const n = randInt(rng, 2, 4)
      const factor = 1 + p / 100
      const kn = roundTo(k0 * factor ** n, 2)
      return valueTask({
        question: `Ein Kapital soll in ${n} Jahren bei ${p} % Zinseszins auf ${formatDe(kn)} € anwachsen. Welches Anfangskapital K₀ muss angelegt werden?`,
        unit: '€',
        answerKind: 'decimal',
        value: k0,
        eps: 0.5,
        solution: `${formatDe(k0)} €`,
        explanation: `K₀ = Kₙ : (1 + p/100)ⁿ = ${formatDe(kn)} € : ${formatDe(factor)}^${n} ≈ ${formatDe(k0)} €.`,
        dedupeKey: `k10neuzzbarwert-tippen:${k0}:${p}:${n}`,
      })
    },
    (rng: Rng) => {
      const k0 = randInt(rng, 5, 50) * 100
      const p = pick(rng, [2, 3, 4, 5])
      const n = randInt(rng, 2, 4)
      const factor = 1 + p / 100
      const kn = roundTo(k0 * factor ** n, 2)
      const correct = `${formatDe(k0)} €`
      const wrong1 = `${formatDe(roundTo(kn * factor ** n, 2))} €` // mit dem Faktor multipliziert statt dividiert
      const wrong2 = `${formatDe(roundTo(kn - (kn * p * n) / 100, 2))} €` // lineare statt exponentielle Abzinsung
      const wrong3 = `${formatDe(roundTo(kn / (1 + (p * n) / 100), 2))} €` // Zinseszins mit einfacher Verzinsung verwechselt
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Kapital soll in ${n} Jahren bei ${p} % Zinseszins auf ${formatDe(kn)} € anwachsen. Wie groß muss das Anfangskapital K₀ sein?`,
        choices,
        correct,
        solution: correct,
        explanation: `K₀ = Kₙ : (1 + p/100)ⁿ ≈ ${formatDe(k0)} €.`,
        dedupeKey: `k10neuzzbarwert-mc:${k0}:${p}:${n}`,
      })
    },
    (rng: Rng) => {
      const k0 = randInt(rng, 5, 50) * 100
      const p = pick(rng, [2, 3, 4, 5])
      const n = randInt(rng, 2, 4)
      const factor = 1 + p / 100
      const kn = roundTo(k0 * factor ** n, 2)
      return numberLineTask({
        question: `Ein Kapital soll in ${n} Jahren bei ${p} % Zinseszins auf ${formatDe(kn)} € anwachsen. Markiere das nötige Anfangskapital K₀ (in €) auf dem Zahlenstrahl.`,
        min: 0,
        max: 5500,
        step: 100,
        labelStep: 500,
        value: k0,
        solution: `${formatDe(k0)} €`,
        explanation: `K₀ = Kₙ : (1 + p/100)ⁿ ≈ ${formatDe(k0)} €.`,
      })
    },
  ),
})

const prozentualeAbnahmeNeu: Topic = asNeuTopic('k10-lb1-prozentuale-zunahme', {
  id: 'k10-lb1-prozentuale-zunahme__neu',
  title: 'Prozentuale Abnahme',
  hint: 'Eine Abnahme um p % bedeutet: neuer Wert = alter Wert · (1 − p/100).',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['prozentuale Abnahme', 'Rabatt', 'Prozent', 'Minderung', 'Abnahme'],
  fachwissen: {
    text: 'Eine prozentuale Abnahme um p % bedeutet: neuer Wert = alter Wert · (1 − p/100). Anders als bei der Zunahme wird hier der Faktor (1 − p/100) statt (1 + p/100) verwendet. Beispiel: Rabattaktionen im Handel senken den Preis genau nach diesem Muster.',
    quelle: 'Wikipedia: Prozentrechnung',
    url: 'https://de.wikipedia.org/wiki/Prozentrechnung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const start = randInt(rng, 2, 40) * 50
      const p = pick(rng, [10, 20, 25, 50])
      const value = roundTo(start * (1 - p / 100), 2)
      return valueTask({
        question: `Ein Preis von ${formatDe(start)} € wird um ${p} % reduziert (Rabatt). Wie hoch ist der neue Preis?`,
        unit: '€',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} €`,
        explanation: `Neuer Wert = ${formatDe(start)} € · (1 − ${p}/100) = ${formatDe(start)} € · ${formatDe(1 - p / 100)} = ${formatDe(value)} €.`,
        dedupeKey: `k10neuprozabn-tippen:${start}:${p}`,
      })
    },
    (rng: Rng) => {
      const start = randInt(rng, 2, 40) * 50
      const p = pick(rng, [10, 20, 25, 50])
      const value = roundTo(start * (1 - p / 100), 2)
      const correct = `${formatDe(value)} €`
      const wrong1 = `${formatDe(roundTo(start * (1 + p / 100), 2))} €` // addiert statt subtrahiert (Zunahme verwechselt)
      const wrong2 = `${formatDe(start - p)} €` // Prozentsatz direkt als Euro-Betrag abgezogen
      const wrong3 = `${formatDe(roundTo((start * p) / 100, 2))} €` // nur den Rabattbetrag angegeben
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Preis von ${formatDe(start)} € wird um ${p} % reduziert. Wie hoch ist der neue Preis?`,
        choices,
        correct,
        solution: correct,
        explanation: `Neuer Wert = ${formatDe(start)} € · (1 − ${p}/100) = ${formatDe(value)} €.`,
        dedupeKey: `k10neuprozabn-mc:${start}:${p}`,
      })
    },
    (rng: Rng) => {
      const start = randInt(rng, 2, 40) * 50
      const p = pick(rng, [10, 20, 50])
      const value = roundTo(start * (1 - p / 100), 2)
      return numberLineTask({
        question: `Ein Preis von ${formatDe(start)} € wird um ${p} % reduziert. Markiere den neuen Preis (in €) auf dem Zahlenstrahl.`,
        min: 0,
        max: 2100,
        step: 50,
        labelStep: 200,
        value,
        solution: `${formatDe(value)} €`,
        explanation: `Neuer Wert = ${formatDe(start)} € · (1 − ${p}/100) = ${formatDe(value)} €.`,
      })
    },
  ),
})

const expZerfallNeu: Topic = asNeuTopic('k10-lb1-exp-wachstum', {
  id: 'k10-lb1-exp-wachstum__neu',
  title: 'Exponentieller Zerfall (Halbierung)',
  hint: 'Bei jeder Halbwertszeit wird die Menge halbiert: Restmenge = Start · (1/2)ⁿ.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['exponentieller Zerfall', 'Halbwertszeit', 'Abnahme', 'Wachstumsfaktor'],
  fachwissen: {
    text: 'Exponentieller Zerfall ist die Umkehrung des exponentiellen Wachstums: Eine Größe wird in gleichen Zeitabständen mit einem Faktor q < 1 multipliziert. Bei einer Halbwertszeit gilt q = 1/2, also Restmenge = Startmenge · (1/2)ⁿ. Beispiele: radioaktiver Zerfall, Medikamentenabbau im Körper.',
    quelle: 'Wikipedia: Exponentielles Wachstum',
    url: 'https://de.wikipedia.org/wiki/Exponentielles_Wachstum',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const basis = randInt(rng, 2, 25)
      const n = randInt(rng, 2, 5)
      const start = basis * 2 ** n
      return valueTask({
        question: `Eine Substanz mit anfänglich ${start} mg verringert sich durch Abbau in jedem Zeitabschnitt auf die Hälfte. Wie viele mg sind nach ${n} Zeitabschnitten noch vorhanden?`,
        unit: 'mg',
        answerKind: 'integer',
        value: basis,
        solution: `${basis} mg`,
        explanation: `Restmenge = ${start} · (1/2)^${n} = ${start} : ${2 ** n} = ${basis} mg.`,
        dedupeKey: `k10neuzerfall-tippen:${start}:${n}`,
      })
    },
    (rng: Rng) => {
      const basis = randInt(rng, 2, 25)
      const n = randInt(rng, 2, 5)
      const start = basis * 2 ** n
      const correct = formatDe(basis)
      const wrong1 = formatDe(basis * 2) // einen Halbierungsschritt vergessen
      const wrong2 = formatDe(Math.round(start / n)) // durch n geteilt statt potenziert
      const wrong3 = formatDe(Math.round(start / 2)) // nur einmal halbiert statt n-mal
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Eine Substanz mit anfänglich ${start} mg verringert sich pro Zeitabschnitt auf die Hälfte. Wie viele mg sind nach ${n} Zeitabschnitten noch da?`,
        choices,
        correct,
        solution: correct,
        explanation: `Restmenge = ${start} · (1/2)^${n} = ${basis} mg.`,
        dedupeKey: `k10neuzerfall-mc:${start}:${n}`,
      })
    },
    (rng: Rng) => {
      const basis = randInt(rng, 2, 20)
      const n = randInt(rng, 2, 4)
      const start = basis * 2 ** n
      return numberLineTask({
        question: `Eine Substanz mit anfänglich ${start} mg verringert sich pro Zeitabschnitt auf die Hälfte. Markiere die Restmenge nach ${n} Zeitabschnitten auf dem Zahlenstrahl.`,
        min: 0,
        max: 20,
        step: 1,
        value: basis,
        solution: `${basis} mg`,
        explanation: `Restmenge = ${start} · (1/2)^${n} = ${basis} mg.`,
      })
    },
  ),
})

export const math10NeuLb1: Topic[] = [
  zinsenMonateNeu,
  zinseszinsStartkapitalNeu,
  prozentualeAbnahmeNeu,
  expZerfallNeu,
]

// ---------------------------------------------------------------------------
// Lernbereich 2 — Diskrete Zufallsgrößen
// ---------------------------------------------------------------------------

const erwartungswertProzentNeu: Topic = asNeuTopic('k10-lb2-erwartungswert', {
  id: 'k10-lb2-erwartungswert__neu',
  title: 'Erwartungswert bei unterschiedlichen Wahrscheinlichkeiten',
  hint: 'Multipliziere jede Auszahlung mit ihrer Wahrscheinlichkeit (in %) und addiere, dann durch 100 teilen.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Erwartungswert', 'Wahrscheinlichkeit', 'Prozent', 'gewichteter Mittelwert', 'Glücksspiel'],
  fachwissen: {
    text: 'Sind die Wahrscheinlichkeiten der möglichen Ergebnisse nicht gleich groß, berechnet man den Erwartungswert als gewichteten Mittelwert: E(X) = Σ xᵢ · P(X=xᵢ), wobei die Wahrscheinlichkeiten hier als Prozentsätze gegeben sind und durch 100 geteilt werden. Anders als beim Glücksrad mit gleich großen Feldern geht hier jede Auszahlung mit ihrem eigenen Gewicht ein.',
    quelle: 'Wikipedia: Erwartungswert',
    url: 'https://de.wikipedia.org/wiki/Erwartungswert',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const [p1, p2, p3] = pick(rng, [
        [50, 30, 20],
        [60, 25, 15],
        [40, 35, 25],
        [45, 35, 20],
        [55, 25, 20],
        [35, 35, 30],
      ] as const)
      const x1 = randInt(rng, 0, 25)
      const x2 = randInt(rng, 0, 25)
      const x3 = randInt(rng, 0, 25)
      const value = roundTo((x1 * p1 + x2 * p2 + x3 * p3) / 100, 2)
      return valueTask({
        question: `Bei einem Glücksspiel gewinnt man mit ${p1} % Wahrscheinlichkeit ${x1} €, mit ${p2} % ${x2} € und mit ${p3} % ${x3} €. Berechne den Erwartungswert.`,
        unit: '€',
        answerKind: 'decimal',
        value,
        eps: 0.02,
        solution: `${formatDe(value)} €`,
        explanation: `E(X) = (${x1}·${p1} + ${x2}·${p2} + ${x3}·${p3}) : 100 = (${x1 * p1}+${x2 * p2}+${x3 * p3}) : 100 = ${formatDe(value)} €.`,
        dedupeKey: `k10neuewprozent-tippen:${x1}:${x2}:${x3}:${p1}:${p2}:${p3}`,
      })
    },
    (rng: Rng) => {
      const [p1, p2, p3] = pick(rng, [
        [50, 30, 20],
        [60, 25, 15],
        [40, 35, 25],
        [45, 35, 20],
        [55, 25, 20],
        [35, 35, 30],
      ] as const)
      const x1 = randInt(rng, 0, 25)
      const x2 = randInt(rng, 0, 25)
      const x3 = randInt(rng, 0, 25)
      const value = roundTo((x1 * p1 + x2 * p2 + x3 * p3) / 100, 2)
      const correct = `${formatDe(value)} €`
      const wrong1 = `${formatDe(roundTo((x1 + x2 + x3) / 3, 2))} €` // ungewichteter Mittelwert, Wahrscheinlichkeiten ignoriert
      const wrong2 = `${formatDe(x1 * p1 + x2 * p2 + x3 * p3)} €` // Division durch 100 (Prozent→Dezimal) vergessen
      const wrong3 = `${formatDe(roundTo((x1 * p1) / 100, 2))} €` // nur die erste Auszahlung gewichtet, Rest vergessen
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Bei einem Glücksspiel gewinnt man mit ${p1} % ${x1} €, mit ${p2} % ${x2} € und mit ${p3} % ${x3} €. Wie groß ist der Erwartungswert?`,
        choices,
        correct,
        solution: correct,
        explanation: `E(X) = (${x1}·${p1} + ${x2}·${p2} + ${x3}·${p3}) : 100 = ${formatDe(value)} €.`,
        dedupeKey: `k10neuewprozent-mc:${x1}:${x2}:${x3}:${p1}:${p2}:${p3}`,
      })
    },
    (rng: Rng) => {
      const p1 = 40
      const p2 = 30
      const p3 = 30
      let x1 = 0
      let x2 = 0
      let x3 = 0
      let guard = 0
      do {
        x1 = randInt(rng, 0, 20)
        x2 = randInt(rng, 0, 20)
        x3 = randInt(rng, 0, 20)
        guard++
      } while ((x1 * p1 + x2 * p2 + x3 * p3) % 100 !== 0 && guard < 50)
      const value = (x1 * p1 + x2 * p2 + x3 * p3) / 100
      return numberLineTask({
        question: `Bei einem Glücksspiel gewinnt man mit ${p1} % ${x1} €, mit ${p2} % ${x2} € und mit ${p3} % ${x3} €. Markiere den Erwartungswert (in €) auf dem Zahlenstrahl.`,
        min: 0,
        max: 20,
        step: 1,
        value,
        solution: `${formatDe(value)} €`,
        explanation: `E(X) = (${x1}·${p1} + ${x2}·${p2} + ${x3}·${p3}) : 100 = ${formatDe(value)} €.`,
      })
    },
  ),
})

const erwartungswertWuerfelPariNeu: Topic = asNeuTopic('k10-lb2-erwartungswert-wuerfel', {
  id: 'k10-lb2-erwartungswert-wuerfel__neu',
  title: 'Erwartungswert: gerade oder ungerade Augenzahl',
  hint: 'Drei Augenzahlen sind gerade, drei ungerade — jeweils mit Wahrscheinlichkeit 1/2.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Erwartungswert', 'Würfel', 'gerade', 'ungerade', 'Wahrscheinlichkeit'],
  fachwissen: {
    text: 'Von den sechs Augenzahlen eines Würfels sind drei gerade (2, 4, 6) und drei ungerade (1, 3, 5) — beide Ereignisse haben also die Wahrscheinlichkeit 1/2. Hängt die Auszahlung nur davon ab, ob die Augenzahl gerade oder ungerade ist, berechnet sich der Erwartungswert als E(X) = (3·a + 3·b) : 6 = (a + b) : 2, wobei a die Auszahlung bei gerade und b die Auszahlung bei ungerade ist.',
    quelle: 'Wikipedia: Erwartungswert',
    url: 'https://de.wikipedia.org/wiki/Erwartungswert',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 1, 20)
      const b = randInt(rng, 1, 20)
      const value = roundTo((a + b) / 2, 2)
      return valueTask({
        question: `Bei einem Würfelspiel gewinnt man bei einer geraden Augenzahl ${a} € und bei einer ungeraden Augenzahl ${b} €. Berechne den Erwartungswert des Gewinns.`,
        unit: '€',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} €`,
        explanation: `Drei Zahlen sind gerade, drei ungerade (je Wahrscheinlichkeit 1/2). E(X) = (3·${a} + 3·${b}) : 6 = (${a} + ${b}) : 2 = ${formatDe(value)} €.`,
        dedupeKey: `k10neuewpari-tippen:${a}:${b}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 1, 20)
      const b = randInt(rng, 1, 20)
      const value = roundTo((a + b) / 2, 2)
      const correct = `${formatDe(value)} €`
      const wrong1 = `${formatDe(a)} €` // nur die gerade Auszahlung betrachtet
      const wrong2 = `${formatDe(b)} €` // nur die ungerade Auszahlung betrachtet
      const wrong3 = `${formatDe(a + b)} €` // Division durch 2 vergessen
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Bei einem Würfelspiel gewinnt man bei gerader Augenzahl ${a} € und bei ungerader Augenzahl ${b} €. Wie groß ist der Erwartungswert?`,
        choices,
        correct,
        solution: correct,
        explanation: `E(X) = (${a} + ${b}) : 2 = ${formatDe(value)} €.`,
        dedupeKey: `k10neuewpari-mc:${a}:${b}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 2, 20)
      let b = randInt(rng, 2, 20)
      if ((a + b) % 2 !== 0) b += 1
      const value = (a + b) / 2
      return visualTask({
        question: `Bei einem Würfelspiel gewinnt man bei gerader Augenzahl ${a} € und bei ungerader Augenzahl ${b} €. Das Glücksrad veranschaulicht die sechs gleich wahrscheinlichen Würfelergebnisse (abwechselnd gerade/ungerade). Berechne den Erwartungswert.`,
        unit: '€',
        answerKind: 'decimal',
        value,
        eps: 0.1,
        solution: `${formatDe(value)} €`,
        explanation: `E(X) = (3·${a} + 3·${b}) : 6 = (${a} + ${b}) : 2 = ${formatDe(value)} €.`,
        visualContent: generateSpinnerSvg({
          payoffs: [`${a}€`, `${b}€`, `${a}€`, `${b}€`, `${a}€`, `${b}€`],
        }),
      })
    },
  ),
})

export const math10NeuLb2: Topic[] = [erwartungswertProzentNeu, erwartungswertWuerfelPariNeu]

// ---------------------------------------------------------------------------
// Lernbereich 3 — Algebraisches Lösen geometrischer Probleme
// ---------------------------------------------------------------------------

const rechteckLaengeNeu: Topic = asNeuTopic('k10-lb3-rechteck-breite', {
  id: 'k10-lb3-rechteck-breite__neu',
  title: 'Rechteck: Länge aus Fläche und Breite',
  hint: 'Stelle A = a · b nach a um: a = A : b.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Rechteck', 'Flächeninhalt', 'algebraisch', 'Gleichung', 'Länge'],
  fachwissen: {
    text: 'Aus der Flächenformel A = a · b lässt sich auch die Länge a bestimmen, wenn Fläche und Breite bekannt sind: a = A : b. Dieses Umstellen einer Formel nach einer anderen Variablen ist ein zentrales algebraisches Grundmuster bei geometrischen Sachaufgaben.',
    quelle: 'Wikipedia: Flächeninhalt',
    url: 'https://de.wikipedia.org/wiki/Fl%C3%A4cheninhalt',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 3, 20)
      const b = randInt(rng, 3, 20)
      const area = a * b
      return valueTask({
        question: `Ein Rechteck hat den Flächeninhalt ${area} cm² und die Breite b = ${b} cm. Berechne die Länge a.`,
        unit: 'cm',
        answerKind: 'integer',
        value: a,
        solution: `${a} cm`,
        explanation: `Aus A = a · b folgt a = A : b = ${area} cm² : ${b} cm = ${a} cm.`,
        dedupeKey: `k10neureclaenge-tippen:${a}:${b}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 3, 20)
      const b = randInt(rng, 3, 20)
      const area = a * b
      const correct = `${a} cm`
      const wrong1 = `${area - b} cm` // Subtraktion statt Division
      const wrong2 = `${b} cm` // Länge mit Breite verwechselt
      const wrong3 = `${area * b} cm` // multipliziert statt dividiert
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Rechteck hat den Flächeninhalt ${area} cm² und die Breite b = ${b} cm. Wie lang ist die Seite a?`,
        choices,
        correct,
        solution: correct,
        explanation: `a = A : b = ${area} cm² : ${b} cm = ${a} cm.`,
        dedupeKey: `k10neureclaenge-mc:${a}:${b}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 3, 8)
      const b = randInt(rng, 2, 6)
      const area = a * b
      return visualTask({
        question: `Das Rechteck im Koordinatensystem hat die Breite b = ${b}. Der Flächeninhalt ist ${area}. Berechne die Länge a.`,
        unit: '',
        answerKind: 'integer',
        value: a,
        solution: `${a}`,
        explanation: `a = A : b = ${area} : ${b} = ${a}.`,
        visualContent: generateGridRectSvg({
          x: 1,
          y: 1,
          width: a,
          height: b,
          widthLabel: 'a=?',
          heightLabel: `b=${b}`,
          xRange: [-1, Math.max(10, a + 2)],
          yRange: [-1, Math.max(8, b + 2)],
          cellSize: 26,
        }),
      })
    },
  ),
})

const quadratUmfangNeu: Topic = asNeuTopic('k10-lb3-quadrat-seite', {
  id: 'k10-lb3-quadrat-seite__neu',
  title: 'Quadrat: Umfang aus Flächeninhalt berechnen',
  hint: 'Berechne zuerst die Seite a = √A, dann den Umfang U = 4 · a.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Quadrat', 'Flächeninhalt', 'Umfang', 'Wurzel', 'algebraisch'],
  fachwissen: {
    text: 'Um aus dem Flächeninhalt eines Quadrats den Umfang zu berechnen, braucht man zwei Schritte: Erst die Seitenlänge über a = √A bestimmen, dann den Umfang über U = 4 · a berechnen. Dieses zweistufige Vorgehen (Wurzel ziehen, dann mit der Umfangsformel weiterrechnen) kommt in vielen geometrischen Sachaufgaben vor.',
    quelle: 'Wikipedia: Quadratwurzel',
    url: 'https://de.wikipedia.org/wiki/Quadratwurzel',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 2, 25)
      const area = a * a
      const u = 4 * a
      return valueTask({
        question: `Ein Quadrat hat den Flächeninhalt ${area} cm². Berechne seinen Umfang.`,
        unit: 'cm',
        answerKind: 'integer',
        value: u,
        solution: `${u} cm`,
        explanation: `Seite: a = √A = √${area} cm² = ${a} cm. Umfang: U = 4 · a = 4 · ${a} cm = ${u} cm.`,
        dedupeKey: `k10neuquadumfang-tippen:${a}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 2, 25)
      const area = a * a
      const u = 4 * a
      const correct = `${u} cm`
      const wrong1 = `${a} cm` // nur die Seite angegeben, Umfang vergessen
      const wrong2 = `${area} cm` // Fläche mit Umfang verwechselt
      const wrong3 = `${2 * a} cm` // Faktor 2 statt 4 verwendet (wie beim Rechteck)
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Quadrat hat den Flächeninhalt ${area} cm². Wie groß ist sein Umfang?`,
        choices,
        correct,
        solution: correct,
        explanation: `a = √${area} cm² = ${a} cm; U = 4 · ${a} cm = ${u} cm.`,
        dedupeKey: `k10neuquadumfang-mc:${a}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 2, 6)
      const area = a * a
      const u = 4 * a
      return visualTask({
        question: `Das Quadrat im Koordinatensystem hat den Flächeninhalt ${area}. Berechne seinen Umfang.`,
        unit: '',
        answerKind: 'integer',
        value: u,
        solution: `${u}`,
        explanation: `a = √${area} = ${a}; U = 4 · ${a} = ${u}.`,
        visualContent: generateGridRectSvg({
          x: 1,
          y: 1,
          width: a,
          height: a,
          widthLabel: 'a',
          heightLabel: 'a',
          xRange: [-1, Math.max(8, a + 2)],
          yRange: [-1, Math.max(8, a + 2)],
          cellSize: 28,
        }),
      })
    },
  ),
})

const rechteckLaengeAusUmfangNeu: Topic = asNeuTopic('k10-lb3-rechteck-umfang', {
  id: 'k10-lb3-rechteck-umfang__neu',
  title: 'Rechteck: Länge aus Umfang bestimmen',
  hint: 'Stelle U = 2 · (a + b) nach a um: a = U : 2 − b.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Rechteck', 'Umfang', 'algebraisch', 'Gleichung', 'Länge'],
  fachwissen: {
    text: 'Aus der Umfangsformel U = 2 · (a + b) lässt sich auch die Länge a bestimmen, wenn Umfang und Breite bekannt sind: a = U : 2 − b. Wie bei der Breitenberechnung muss die Formel zuerst umgestellt werden, bevor die bekannten Werte eingesetzt werden.',
    quelle: 'Wikipedia: Umfang (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Umfang_(Geometrie)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 3, 20)
      const b = randInt(rng, 3, 20)
      const u = 2 * (a + b)
      return valueTask({
        question: `Ein Rechteck hat den Umfang ${u} cm und die Breite b = ${b} cm. Berechne die Länge a.`,
        unit: 'cm',
        answerKind: 'integer',
        value: a,
        solution: `${a} cm`,
        explanation: `Aus U = 2 · (a + b) folgt a = U : 2 − b = ${u} : 2 − ${b} = ${u / 2} − ${b} = ${a} cm.`,
        dedupeKey: `k10neureclaengeu-tippen:${a}:${b}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 3, 20)
      const b = randInt(rng, 3, 20)
      const u = 2 * (a + b)
      const correct = `${a} cm`
      const wrong1 = `${u / 2 + b} cm` // addiert statt subtrahiert
      const wrong2 = `${u - b} cm` // Division durch 2 vergessen
      const wrong3 = `${u / 4} cm` // wie bei einem Quadrat einfach durch 4 geteilt
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Rechteck hat den Umfang ${u} cm und die Breite b = ${b} cm. Wie lang ist die Seite a?`,
        choices,
        correct,
        solution: correct,
        explanation: `a = U : 2 − b = ${u / 2} − ${b} = ${a} cm.`,
        dedupeKey: `k10neureclaengeu-mc:${a}:${b}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 3, 8)
      const b = randInt(rng, 2, 6)
      const u = 2 * (a + b)
      return visualTask({
        question: `Das Rechteck im Koordinatensystem hat die Breite b = ${b}. Der Umfang ist ${u}. Berechne die Länge a.`,
        unit: '',
        answerKind: 'integer',
        value: a,
        solution: `${a}`,
        explanation: `a = U : 2 − b = ${u / 2} − ${b} = ${a}.`,
        visualContent: generateGridRectSvg({
          x: 1,
          y: 1,
          width: a,
          height: b,
          widthLabel: 'a=?',
          heightLabel: `b=${b}`,
          xRange: [-1, Math.max(10, a + 2)],
          yRange: [-1, Math.max(8, b + 2)],
          cellSize: 26,
        }),
      })
    },
  ),
})

export const math10NeuLb3: Topic[] = [
  rechteckLaengeNeu,
  quadratUmfangNeu,
  rechteckLaengeAusUmfangNeu,
]

// ---------------------------------------------------------------------------
// Lernbereich 4 — Funktionale Zusammenhänge
// ---------------------------------------------------------------------------

const reinquadratischKoeffNeu: Topic = asNeuTopic('k10-lb4-reinquadratisch', {
  id: 'k10-lb4-reinquadratisch__neu',
  title: 'Quadratische Gleichung mit Faktor: a·x² = b',
  hint: 'Teile zuerst durch a, ziehe dann die Wurzel: x = √(b : a).',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['quadratische Gleichung', 'Wurzel', 'Koeffizient', 'lösen', 'reinquadratisch'],
  fachwissen: {
    text: 'Eine reinquadratische Gleichung kann auch einen Koeffizienten vor x² haben: a·x² = b. Vor dem Wurzelziehen muss zuerst durch a geteilt werden: x² = b : a, danach x = √(b : a) (positive Lösung). Wer die Division durch a vergisst, erhält ein falsches Ergebnis.',
    quelle: 'Wikipedia: Quadratische Gleichung',
    url: 'https://de.wikipedia.org/wiki/Quadratische_Gleichung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = pick(rng, [2, 3, 4, 5])
      const x = randInt(rng, 2, 10)
      const b = a * x * x
      return valueTask({
        question: `Bestimme die positive Lösung der Gleichung ${a}x² = ${b}.`,
        answerKind: 'integer',
        value: x,
        solution: `x = ${x}`,
        explanation: `x² = ${b} : ${a} = ${x * x}; x = √${x * x} = ${x} (positive Lösung).`,
        dedupeKey: `k10neureinquadkoeff-tippen:${a}:${x}`,
      })
    },
    (rng: Rng) => {
      const a = pick(rng, [2, 3, 4, 5])
      const x = randInt(rng, 2, 10)
      const b = a * x * x
      const correct = formatDe(x)
      const wrong1 = formatDe(x * x) // Division durch a und Wurzel vergessen (x² als Lösung genommen)
      const wrong2 = formatDe(Math.round(Math.sqrt(b))) // Division durch a vor der Wurzel vergessen
      const wrong3 = formatDe(Math.round(b / (a * a))) // a quadratisch statt linear geteilt
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Welche positive Lösung hat die Gleichung ${a}x² = ${b}?`,
        choices,
        correct,
        solution: correct,
        explanation: `x² = ${b} : ${a} = ${x * x}; x = ${x}.`,
        dedupeKey: `k10neureinquadkoeff-mc:${a}:${x}`,
      })
    },
    (rng: Rng) => {
      const a = pick(rng, [2, 3, 4])
      const x = randInt(rng, 2, 10)
      const b = a * x * x
      return numberLineTask({
        question: `Bestimme die positive Lösung von ${a}x² = ${b} und markiere sie auf dem Zahlenstrahl.`,
        min: 0,
        max: 12,
        step: 1,
        value: x,
        solution: `x = ${x}`,
        explanation: `x² = ${b} : ${a} = ${x * x}; x = ${x}.`,
      })
    },
  ),
})

const quadratischGleichungVietaNeu: Topic = asNeuTopic('k10-lb4-quadratische-gleichung', {
  id: 'k10-lb4-quadratische-gleichung__neu',
  title: 'Quadratische Gleichung: kleinere Lösung und Satz von Vieta',
  hint: 'x² + px + q = 0: Summe der Lösungen = −p, Produkt der Lösungen = q.',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['quadratische Gleichung', 'Satz von Vieta', 'Lösungen', 'Summe', 'Produkt'],
  fachwissen: {
    text: 'Nach dem Satz von Vieta gilt für die Lösungen x₁, x₂ einer Gleichung x² + px + q = 0: x₁ + x₂ = −p und x₁ · x₂ = q. Diese Beziehungen erlauben es, Summe und Produkt der Lösungen direkt aus den Koeffizienten abzulesen, ohne die Gleichung vollständig zu lösen.',
    quelle: 'Wikipedia: Satz von Vieta',
    url: 'https://de.wikipedia.org/wiki/Satz_von_Vieta',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      let r1 = randInt(rng, -8, 8)
      let r2 = randInt(rng, -8, 8)
      while (r1 === r2) r2 = randInt(rng, -8, 8)
      if (r1 < r2) [r1, r2] = [r2, r1] // r1 ist die größere Lösung
      const p = -(r1 + r2)
      const q = r1 * r2
      const pStr = p < 0 ? `− ${Math.abs(p)}x` : `+ ${p}x`
      const qStr = q < 0 ? `− ${Math.abs(q)}` : `+ ${q}`
      return valueTask({
        question: `Bestimme die kleinere Lösung der Gleichung x² ${pStr} ${qStr} = 0.`,
        answerKind: 'integer',
        value: r2,
        solution: `x = ${r2}`,
        explanation: `Die Gleichung lässt sich als (x − ${r1})(x − ${r2}) = 0 schreiben. Die Lösungen sind x₁ = ${r1} und x₂ = ${r2}; die kleinere ist ${r2}.`,
        dedupeKey: `k10neuvieta-tippen:${r1}:${r2}`,
      })
    },
    (rng: Rng) => {
      let r1 = randInt(rng, -8, 8)
      let r2 = randInt(rng, -8, 8)
      while (r1 === r2) r2 = randInt(rng, -8, 8)
      if (r1 < r2) [r1, r2] = [r2, r1]
      const p = -(r1 + r2)
      const q = r1 * r2
      const pStr = p < 0 ? `− ${Math.abs(p)}x` : `+ ${p}x`
      const qStr = q < 0 ? `− ${Math.abs(q)}` : `+ ${q}`
      const correct = formatDe(q)
      const wrong1 = formatDe(-q) // Vorzeichen des Produkts vertauscht
      const wrong2 = formatDe(p) // Produkt mit p verwechselt
      const wrong3 = formatDe(-p) // Produkt mit der Summe (−p) verwechselt
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Welches Produkt haben die beiden Lösungen der Gleichung x² ${pStr} ${qStr} = 0? (Satz von Vieta)`,
        choices,
        correct,
        solution: correct,
        explanation: `Nach Vieta gilt x₁ · x₂ = q = ${q}.`,
        dedupeKey: `k10neuvieta-mc:${r1}:${r2}`,
      })
    },
    (rng: Rng) => {
      let r1 = randInt(rng, -8, 8)
      let r2 = randInt(rng, -8, 8)
      while (r1 === r2) r2 = randInt(rng, -8, 8)
      if (r1 < r2) [r1, r2] = [r2, r1]
      const p = -(r1 + r2)
      const q = r1 * r2
      const pStr = p < 0 ? `− ${Math.abs(p)}x` : `+ ${p}x`
      const qStr = q < 0 ? `− ${Math.abs(q)}` : `+ ${q}`
      const sum = r1 + r2
      return numberLineTask({
        question: `Markiere die Summe der beiden Lösungen der Gleichung x² ${pStr} ${qStr} = 0 auf dem Zahlenstrahl (Satz von Vieta: x₁ + x₂ = −p).`,
        min: -16,
        max: 16,
        step: 1,
        value: sum,
        solution: `${sum}`,
        explanation: `Nach Vieta gilt x₁ + x₂ = −p = ${sum}.`,
      })
    },
  ),
})

const parabelWertReglerNeu: Topic = asNeuTopic('k10-lb4-parabel-wert', {
  id: 'k10-lb4-parabel-wert__neu',
  title: 'Funktionswert einer Parabel am Regler einstellen',
  hint: 'Berechne f(x) = a·x² + c und stelle den Wert am Regler ein.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Parabel', 'quadratische Funktion', 'Funktionswert', 'Regler', 'einsetzen'],
  fachwissen: {
    text: 'Der Funktionswert f(x) einer Parabel f(x) = a·x² + c ergibt sich durch Einsetzen von x: zuerst quadrieren, dann mit a multiplizieren, zuletzt c addieren. Am Graphen lässt sich dieser Wert anschließend als y-Koordinate überprüfen.',
    quelle: 'Wikipedia: Parabel (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Parabel_(Mathematik)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
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
        dedupeKey: `k10neuparabelregler-tippen:${a}:${c}:${x}`,
      })
    },
    (rng: Rng) => {
      const a = pick(rng, [-2, -1, 1, 2, 3])
      const c = randInt(rng, -8, 8)
      const x = randInt(rng, -6, 6)
      const value = a * x * x + c
      const cStr = c < 0 ? `− ${Math.abs(c)}` : `+ ${c}`
      const correct = formatDe(value)
      const wrong1 = formatDe(a * x + c) // vergisst x zu quadrieren
      const wrong2 = formatDe(a * x * x) // c vergessen
      const wrong3 = formatDe(-value) // Vorzeichenfehler
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Gegeben ist f(x) = ${a}·x² ${cStr}. Was ist f(${x})?`,
        choices,
        correct,
        solution: correct,
        explanation: `f(${x}) = ${a} · ${x}² ${cStr} = ${value}.`,
        dedupeKey: `k10neuparabelregler-mc:${a}:${c}:${x}`,
      })
    },
    (rng: Rng) => {
      const a = pick(rng, [-2, -1, 1, 2])
      const c = randInt(rng, -6, 6)
      const x = randInt(rng, -4, 4)
      const value = a * x * x + c
      return paramSliderTask({
        question: `Die Parabel f(x) = a·x² + c mit a = ${a} und c = ${c} ist gezeichnet. Berechne f(${x}) und stelle den Wert am Regler ein.`,
        params: [{ id: 'y', label: `f(${x})`, min: -40, max: 40, step: 1, start: 0 }],
        correct: { y: value },
        solution: formatDe(value),
        explanation: `f(${x}) = ${a} · ${x}² + ${c} = ${a * x * x} + ${c} = ${value}.`,
        visualContent: generateParabolaSvg({
          a,
          c,
          points: [{ x, y: value, label: `(${x}|?)` }],
          xRange: [-6, 6],
          yRange: [Math.min(-8, value - 3, c - 3), Math.max(8, value + 3, c + 3)],
        }),
        instruction: `Stelle f(${x}) ein:`,
      })
    },
  ),
})

export const math10NeuLb4: Topic[] = [
  reinquadratischKoeffNeu,
  quadratischGleichungVietaNeu,
  parabelWertReglerNeu,
]

// ---------------------------------------------------------------------------
// Lernbereich 5 — Vernetzung: Zinsrechnung
// ---------------------------------------------------------------------------

const kapitalMehrereJahreNeu: Topic = asNeuTopic('k10-lb5-kapital', {
  id: 'k10-lb5-kapital__neu',
  title: 'Kapital aus Zinsen über mehrere Jahre bestimmen',
  hint: 'Ohne Zinseszins gilt: Z(gesamt) = K · p · n : 100, also K = Z(gesamt) · 100 : (p · n).',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Zinsrechnung', 'Kapital', 'mehrere Jahre', 'Grundwert', 'Prozentsatz'],
  fachwissen: {
    text: 'Ohne Zinseszins bleiben die jährlichen Zinsen über mehrere Jahre konstant, die Gesamtzinsen summieren sich linear: Z(gesamt) = K · p · n : 100, wobei n die Anzahl der Jahre ist. Umgestellt ergibt sich das Kapital: K = Z(gesamt) · 100 : (p · n).',
    quelle: 'Wikipedia: Zinsrechnung',
    url: 'https://de.wikipedia.org/wiki/Zinsrechnung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const k = randInt(rng, 2, 40) * 100
      const p = pick(rng, [1, 2, 4, 5, 10])
      const n = randInt(rng, 2, 5)
      const z = (k * p * n) / 100
      return valueTask({
        question: `Bei einem Zinssatz von ${p} % pro Jahr wurden nach ${n} Jahren insgesamt ${formatDe(z)} € Zinsen gezahlt (ohne Zinseszins). Wie groß war das Kapital?`,
        unit: '€',
        answerKind: 'decimal',
        value: k,
        solution: `${formatDe(k)} €`,
        explanation: `K = Z(gesamt) · 100 : (p · n) = ${formatDe(z)} € · 100 : (${p} · ${n}) = ${formatDe(k)} €.`,
        dedupeKey: `k10neukapmehrj-tippen:${k}:${p}:${n}`,
      })
    },
    (rng: Rng) => {
      const k = randInt(rng, 2, 40) * 100
      const p = pick(rng, [1, 2, 4, 5, 10])
      const n = randInt(rng, 2, 5)
      const z = (k * p * n) / 100
      const correct = `${formatDe(k)} €`
      const wrong1 = `${formatDe((z * 100) / p)} €` // n (Anzahl der Jahre) vergessen
      const wrong2 = `${formatDe((z * 100) / (p * n * n))} €` // n quadriert statt einfach multipliziert
      const wrong3 = `${formatDe(z / n)} €` // Prozentrechnung komplett vergessen
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Bei ${p} % Zinssatz pro Jahr wurden nach ${n} Jahren insgesamt ${formatDe(z)} € Zinsen gezahlt (ohne Zinseszins). Wie groß war das Kapital?`,
        choices,
        correct,
        solution: correct,
        explanation: `K = ${formatDe(z)} € · 100 : (${p} · ${n}) = ${formatDe(k)} €.`,
        dedupeKey: `k10neukapmehrj-mc:${k}:${p}:${n}`,
      })
    },
    (rng: Rng) => {
      const k = randInt(rng, 2, 20) * 100
      const p = pick(rng, [2, 4, 5, 10])
      const n = randInt(rng, 2, 4)
      const z = (k * p * n) / 100
      return numberLineTask({
        question: `Bei ${p} % Zinssatz pro Jahr wurden nach ${n} Jahren insgesamt ${formatDe(z)} € Zinsen gezahlt (ohne Zinseszins). Markiere das Kapital (in €) auf dem Zahlenstrahl.`,
        min: 0,
        max: 2500,
        step: 100,
        labelStep: 500,
        value: k,
        solution: `${formatDe(k)} €`,
        explanation: `K = ${formatDe(z)} € · 100 : (${p} · ${n}) = ${formatDe(k)} €.`,
      })
    },
  ),
})

const zinssatzMehrereJahreNeu: Topic = asNeuTopic('k10-lb5-zinssatz', {
  id: 'k10-lb5-zinssatz__neu',
  title: 'Zinssatz aus Zinsen über mehrere Jahre bestimmen',
  hint: 'Ohne Zinseszins gilt: p = Z(gesamt) · 100 : (K · n).',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Zinsrechnung', 'Zinssatz', 'mehrere Jahre', 'Prozentsatz', 'Kapital'],
  fachwissen: {
    text: 'Sind Kapital, Gesamtzinsen über mehrere Jahre und die Laufzeit bekannt, lässt sich der Zinssatz bestimmen: p = Z(gesamt) · 100 : (K · n), wobei n die Anzahl der Jahre ist (ohne Zinseszins). Das Ergebnis erlaubt den Vergleich verschiedener Geldanlagen über unterschiedliche Laufzeiten.',
    quelle: 'Wikipedia: Zinsrechnung',
    url: 'https://de.wikipedia.org/wiki/Zinsrechnung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const k = randInt(rng, 2, 40) * 100
      const p = pick(rng, [1, 2, 3, 4, 5, 8, 10])
      const n = randInt(rng, 2, 5)
      const z = (k * p * n) / 100
      return valueTask({
        question: `Für ein Kapital von ${formatDe(k)} € wurden nach ${n} Jahren insgesamt ${formatDe(z)} € Zinsen gezahlt (ohne Zinseszins). Wie hoch war der Zinssatz in Prozent?`,
        unit: '%',
        answerKind: 'decimal',
        value: p,
        solution: `${formatDe(p)} %`,
        explanation: `p = Z(gesamt) · 100 : (K · n) = ${formatDe(z)} € · 100 : (${formatDe(k)} € · ${n}) = ${formatDe(p)} %.`,
        dedupeKey: `k10neuzsmehrj-tippen:${k}:${p}:${n}`,
      })
    },
    (rng: Rng) => {
      const k = randInt(rng, 2, 40) * 100
      const p = pick(rng, [1, 2, 3, 4, 5, 8, 10])
      const n = randInt(rng, 2, 5)
      const z = (k * p * n) / 100
      const correct = `${formatDe(p)} %`
      const wrong1 = `${formatDe((z * 100) / k)} %` // n (Anzahl der Jahre) vergessen
      const wrong2 = `${formatDe((z * 100) / (k * n * n))} %` // n quadriert statt einfach multipliziert
      const wrong3 = `${formatDe(z / (k * n))} %` // Multiplikation mit 100 vergessen
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Für ${formatDe(k)} € Kapital wurden nach ${n} Jahren insgesamt ${formatDe(z)} € Zinsen gezahlt (ohne Zinseszins). Wie hoch war der Zinssatz?`,
        choices,
        correct,
        solution: correct,
        explanation: `p = ${formatDe(z)} € · 100 : (${formatDe(k)} € · ${n}) = ${formatDe(p)} %.`,
        dedupeKey: `k10neuzsmehrj-mc:${k}:${p}:${n}`,
      })
    },
    (rng: Rng) => {
      const k = randInt(rng, 2, 20) * 100
      const p = pick(rng, [1, 2, 4, 5, 8, 10])
      const n = randInt(rng, 2, 4)
      const z = (k * p * n) / 100
      return numberLineTask({
        question: `Für ${formatDe(k)} € Kapital wurden nach ${n} Jahren insgesamt ${formatDe(z)} € Zinsen gezahlt (ohne Zinseszins). Markiere den Zinssatz (in %) auf dem Zahlenstrahl.`,
        min: 0,
        max: 12,
        step: 1,
        value: p,
        solution: `${formatDe(p)} %`,
        explanation: `p = ${formatDe(z)} € · 100 : (${formatDe(k)} € · ${n}) = ${formatDe(p)} %.`,
      })
    },
  ),
})

export const math10NeuLb5: Topic[] = [kapitalMehrereJahreNeu, zinssatzMehrereJahreNeu]

export const math10NeuTopics: Topic[] = [
  ...math10NeuLb1,
  ...math10NeuLb2,
  ...math10NeuLb3,
  ...math10NeuLb4,
  ...math10NeuLb5,
]
