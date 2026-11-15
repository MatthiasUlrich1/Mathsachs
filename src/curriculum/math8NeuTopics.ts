/**
 * Klasse 8 Mathematik — zusätzliche Neu-(Prüfung)-Banken nach Bettermarks.
 * Sibling-IDs: `${parentId}__neu`, neu:true, released:false.
 * Bestehende `__grafik` in graphicReviewTopics.ts bleiben parallel.
 * Händisch; keine Bulk-Skripte. Originale in math8.ts unberührt.
 */
import { pick, randInt, type Rng } from '../lib/rng'
import { formatDe, roundTo } from '../lib/num'
import { makeFraction, format, multiply, subtract, type Fraction } from '../lib/fraction'
import { generateLinearFunctionSvg, generateSpinnerSvg } from '../lib/geometrySvg'
import { shuffleChoices } from './biologieHelpers'
import {
  choicePickTask,
  fractionTask,
  mixedVariants,
  numberLineTask,
  paramSliderTask,
  treeDiagramTask,
  valueTask,
} from './taskHelpers'
import { asNeuTopic } from './neuTopic'
import type { Topic } from './types'

// ---------------------------------------------------------------------------
// Lokale Helfer (bewusst nicht aus math8.ts importiert — Zirkelimport-Gefahr,
// da math8.ts seinerseits math8NeuLb1/Lb2/Lb3 importiert).
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

// ---------------------------------------------------------------------------
// Lernbereich 1 — Arbeiten mit Termen und Gleichungen
// ---------------------------------------------------------------------------

const zusammenfassenNeu: Topic = asNeuTopic('k8-lb1-zusammenfassen', {
  id: 'k8-lb1-zusammenfassen__neu',
  title: 'Terme zusammenfassen (zwei Pakete)',
  hint: 'Addiere die x-Glieder und die Zahlen getrennt.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Term', 'zusammenfassen', 'gleichartige Glieder', 'Variable', 'x'],
  fachwissen: {
    text: 'Beim Zusammenfassen von Termen werden nur gleichartige Glieder (gleiche Variable, gleicher Exponent) addiert oder subtrahiert. x-Glieder und reine Zahlen bleiben getrennt: Aus zwei Teiltermen a·x + b und c·x + d wird (a+c)·x + (b+d).',
    quelle: 'Wikipedia: Algebraischer Term',
    url: 'https://de.wikipedia.org/wiki/Algebraischer_Term',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = nonZero(rng, -9, 9)
      const b = nonZero(rng, -9, 9)
      const c = nonZero(rng, -9, 9)
      const d = nonZero(rng, -9, 9)
      const coeff = a + c
      return valueTask({
        question: `Paket A hat den Term ${num(a)}x + ${num(b)}, Paket B hat den Term ${num(c)}x + ${num(d)}. Fasse A + B zusammen und gib die Zahl vor x an.`,
        answerKind: 'integer',
        value: coeff,
        solution: `${coeff}x`,
        explanation: `Addiere die x-Glieder getrennt von den Zahlen: ${num(a)}x + ${num(c)}x = ${coeff}x. Die Zahl vor x ist ${coeff}.`,
        dedupeKey: `k8neuzus-tippen:${a}:${c}`,
      })
    },
    (rng: Rng) => {
      const a = nonZero(rng, -9, 9)
      const b = nonZero(rng, -9, 9)
      const c = nonZero(rng, -9, 9)
      const d = nonZero(rng, -9, 9)
      const coeff = a + c
      const correct = formatDe(coeff)
      const wrong1 = formatDe(a + b + c + d) // fasst auch die Zahlen mit ein
      const wrong2 = formatDe(a - c) // Vorzeichen falsch
      const wrong3 = formatDe(a) // c vergessen
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Welche Zahl steht vor x, wenn man ${num(a)}x + ${num(b)} und ${num(c)}x + ${num(d)} zusammenfasst?`,
        choices,
        correct,
        solution: correct,
        explanation: `Nur die x-Glieder zusammenfassen: ${num(a)}x + ${num(c)}x = ${coeff}x.`,
        dedupeKey: `k8neuzus-mc:${a}:${b}:${c}:${d}`,
      })
    },
    (rng: Rng) => {
      const a = nonZero(rng, -9, 9)
      const c = nonZero(rng, -9, 9)
      const coeff = a + c
      return numberLineTask({
        question: `Fasse ${num(a)}x + ${num(c)}x zusammen und markiere die Zahl vor x auf dem Zahlenstrahl.`,
        min: -20,
        max: 20,
        step: 1,
        value: coeff,
        solution: `${coeff}x`,
        explanation: `${num(a)}x + ${num(c)}x = ${coeff}x.`,
      })
    },
  ),
})

const termAuswertenNeu: Topic = asNeuTopic('k8-lb1-term-auswerten', {
  id: 'k8-lb1-term-auswerten__neu',
  title: 'Term auswerten (Handytarif)',
  hint: 'Setze den Wert für x ein und rechne aus.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Term', 'einsetzen', 'auswerten', 'Handytarif', 'Grundgebühr'],
  fachwissen: {
    text: 'Einen Term auswerten bedeutet, die Variable durch eine konkrete Zahl zu ersetzen und dann zu berechnen. Tarife mit Grundgebühr und Minutenpreis lassen sich als Term a·x + b modellieren, wobei x die genutzten Minuten sind.',
    quelle: 'Wikipedia: Algebraischer Term',
    url: 'https://de.wikipedia.org/wiki/Algebraischer_Term',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 1, 8)
      const b = randInt(rng, 0, 15)
      const x = randInt(rng, 1, 20)
      const value = a * x + b
      return valueTask({
        question: `Ein Tarif kostet eine Grundgebühr von ${b} € und ${a} € pro Online-Minute x. Wie viel kostet es bei x = ${x} Minuten?`,
        unit: '€',
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `Setze x = ${x} ein: ${a} · ${x} + ${b} = ${a * x} + ${b} = ${value}.`,
        dedupeKey: `k8neuterm-tippen:${a}:${b}:${x}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 1, 8)
      const b = randInt(rng, 0, 15)
      const x = randInt(rng, 1, 20)
      const value = a * x + b
      const correct = formatDe(value)
      const wrong1 = formatDe(a * x) // Grundgebühr vergessen
      const wrong2 = formatDe(a * (x + b)) // Klammer falsch gesetzt
      const wrong3 = formatDe(a + x + b) // addiert statt multipliziert
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Tarif kostet ${b} € Grundgebühr plus ${a} € pro Minute. Was kosten ${x} Minuten?`,
        choices,
        correct,
        solution: correct,
        explanation: `${a} · ${x} + ${b} = ${value}.`,
        dedupeKey: `k8neuterm-mc:${a}:${b}:${x}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 1, 4)
      const b = randInt(rng, 0, 8)
      const x = randInt(rng, 1, 8)
      const value = a * x + b
      return numberLineTask({
        question: `Berechne ${a} · x + ${b} für x = ${x} und markiere das Ergebnis auf dem Zahlenstrahl.`,
        min: 0,
        max: 50,
        step: 1,
        value,
        solution: formatDe(value),
        explanation: `${a} · ${x} + ${b} = ${value}.`,
      })
    },
  ),
})

const gleichungLinearNeu: Topic = asNeuTopic('k8-lb1-gleichung-linear', {
  id: 'k8-lb1-gleichung-linear__neu',
  title: 'Lineare Gleichung lösen (Zahlenrätsel)',
  hint: 'Erst die Zahl, dann den Faktor beseitigen.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Gleichung', 'Zahlenrätsel', 'lösen', 'x', 'Äquivalenzumformung'],
  fachwissen: {
    text: 'Zahlenrätsel der Form „Multipliziere x mit a und addiere b, das Ergebnis ist c" führen auf die Gleichung a·x + b = c. Man löst sie durch zwei Äquivalenzumformungen: zuerst b subtrahieren, dann durch a teilen.',
    quelle: 'Wikipedia: Lineare Gleichung',
    url: 'https://de.wikipedia.org/wiki/Lineare_Gleichung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = nonZero(rng, -9, 9)
      const x = nonZero(rng, -10, 10)
      const b = nonZero(rng, -15, 15)
      const c = a * x + b
      return valueTask({
        question: `Denke an eine Zahl x. Multipliziere sie mit ${num(a)} und addiere ${num(b)}. Das Ergebnis ist ${c}. Welche Zahl x hast du dir gedacht?`,
        answerKind: 'integer',
        value: x,
        solution: `x = ${x}`,
        explanation: `Gleichung: ${num(a)}·x + ${num(b)} = ${c}. Subtrahiere ${num(b)}: ${num(a)}·x = ${c - b}. Teile durch ${num(a)}: x = ${x}.`,
        dedupeKey: `k8neuglin-tippen:${a}:${b}:${c}`,
      })
    },
    (rng: Rng) => {
      const a = nonZero(rng, -9, 9)
      const x = nonZero(rng, -10, 10)
      const b = nonZero(rng, -15, 15)
      const c = a * x + b
      const correct = formatDe(x)
      const wrong1 = formatDe((c + b) / a) // addiert statt subtrahiert
      const wrong2 = formatDe((c - b) * a) // multipliziert statt dividiert
      const wrong3 = formatDe(-x) // Vorzeichen vertauscht
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Löse die Gleichung nach x: ${num(a)}·x + ${num(b)} = ${c}`,
        choices,
        correct,
        solution: correct,
        explanation: `x = (${c} − ${num(b)}) : ${num(a)} = ${x}.`,
        dedupeKey: `k8neuglin-mc:${a}:${b}:${c}`,
      })
    },
    (rng: Rng) => {
      const a = nonZero(rng, -9, 9)
      const x = nonZero(rng, -10, 10)
      const b = nonZero(rng, -15, 15)
      const c = a * x + b
      return numberLineTask({
        question: `Löse die Gleichung ${num(a)}·x + ${num(b)} = ${c} und markiere x auf dem Zahlenstrahl.`,
        min: -20,
        max: 20,
        step: 1,
        value: x,
        solution: `x = ${x}`,
        explanation: `x = (${c} − ${num(b)}) : ${num(a)} = ${x}.`,
      })
    },
  ),
})

const gleichungBeidseitigNeu: Topic = asNeuTopic('k8-lb1-gleichung-beidseitig', {
  id: 'k8-lb1-gleichung-beidseitig__neu',
  title: 'Gleichung mit x auf beiden Seiten (Vergleich)',
  hint: 'Bringe alle x auf eine Seite.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Gleichung', 'beide Seiten', 'lösen', 'x', 'Vergleich'],
  fachwissen: {
    text: 'Zwei Terme mit x sind für genau einen x-Wert gleich groß (sofern die Koeffizienten von x verschieden sind). Man bringt alle x-Glieder durch Äquivalenzumformung auf eine Seite, alle Zahlen auf die andere, und löst dann nach x.',
    quelle: 'Wikipedia: Lineare Gleichung',
    url: 'https://de.wikipedia.org/wiki/Lineare_Gleichung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = nonZero(rng, -8, 8)
      let c = nonZero(rng, -8, 8)
      while (a === c) c = nonZero(rng, -8, 8)
      const x = nonZero(rng, -9, 9)
      const b = nonZero(rng, -12, 12)
      const d = (a - c) * x + b
      return valueTask({
        question: `Für welchen Wert von x sind die Terme ${num(a)}·x + ${num(b)} und ${num(c)}·x + ${num(d)} gleich groß?`,
        answerKind: 'integer',
        value: x,
        solution: `x = ${x}`,
        explanation: `${num(a)}·x + ${num(b)} = ${num(c)}·x + ${num(d)} ⇒ (${a} − ${c})·x = ${d} − ${b} ⇒ ${a - c}·x = ${d - b} ⇒ x = ${x}.`,
        dedupeKey: `k8neuglbeid-tippen:${a}:${b}:${c}:${d}`,
      })
    },
    (rng: Rng) => {
      const a = nonZero(rng, -8, 8)
      let c = nonZero(rng, -8, 8)
      while (a === c) c = nonZero(rng, -8, 8)
      const x = nonZero(rng, -9, 9)
      const b = nonZero(rng, -12, 12)
      const d = (a - c) * x + b
      const correct = formatDe(x)
      const wrong1 = formatDe((d + b) / (a - c)) // Vorzeichen bei b falsch
      const wrong2 = formatDe((d - b) / (a + c)) // x-Koeffizienten addiert statt subtrahiert
      const wrong3 = formatDe(-x) // Gesamtvorzeichen vertauscht
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Löse die Gleichung nach x: ${num(a)}·x + ${num(b)} = ${num(c)}·x + ${num(d)}`,
        choices,
        correct,
        solution: correct,
        explanation: `(${a} − ${c})·x = ${d} − ${b} ⇒ x = ${x}.`,
        dedupeKey: `k8neuglbeid-mc:${a}:${b}:${c}:${d}`,
      })
    },
    (rng: Rng) => {
      const a = nonZero(rng, -8, 8)
      let c = nonZero(rng, -8, 8)
      while (a === c) c = nonZero(rng, -8, 8)
      const x = nonZero(rng, -9, 9)
      const b = nonZero(rng, -12, 12)
      const d = (a - c) * x + b
      return numberLineTask({
        question: `Löse die Gleichung ${num(a)}·x + ${num(b)} = ${num(c)}·x + ${num(d)} und markiere x auf dem Zahlenstrahl.`,
        min: -20,
        max: 20,
        step: 1,
        value: x,
        solution: `x = ${x}`,
        explanation: `(${a} − ${c})·x = ${d} − ${b} ⇒ x = ${x}.`,
      })
    },
  ),
})

const ausmultiplizierenNeu: Topic = asNeuTopic('k8-lb1-ausmultiplizieren', {
  id: 'k8-lb1-ausmultiplizieren__neu',
  title: 'Klammer ausmultiplizieren (Materialkosten)',
  hint: 'Wende das Distributivgesetz an: a·(b+c) = a·b + a·c.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Distributivgesetz', 'ausmultiplizieren', 'Klammer', 'Materialkosten'],
  fachwissen: {
    text: 'Das Distributivgesetz a · (b + c) = a · b + a · c erlaubt das Auflösen von Klammern. Steht vor der Klammer ein negativer Faktor, drehen sich dabei alle Vorzeichen innerhalb der Klammer um. So lassen sich z. B. Kostenformeln mit gestaffeltem Rabatt vereinfachen.',
    quelle: 'Wikipedia: Distributivgesetz',
    url: 'https://de.wikipedia.org/wiki/Distributivgesetz',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = nonZero(rng, -6, 6)
      const b = nonZero(rng, -6, 6)
      const c = nonZero(rng, -8, 8)
      const x = nonZero(rng, -6, 6)
      const value = a * (b * x + c)
      return valueTask({
        question: `Eine Werkstatt berechnet die Materialkosten mit ${num(a)}·(${num(b)}x + ${num(c)}), wobei x die Anzahl der Teile ist. Multipliziere aus und berechne die Kosten für x = ${x}.`,
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `Ausmultiplizieren: ${num(a)}·(${num(b)}x + ${num(c)}) = ${a * b}x + ${num(a * c)}. Für x = ${x}: ${a * b} · ${num(x)} + ${num(a * c)} = ${value}.`,
        dedupeKey: `k8neuausmul-tippen:${a}:${b}:${c}:${x}`,
      })
    },
    (rng: Rng) => {
      const a = nonZero(rng, -6, 6)
      const b = nonZero(rng, -6, 6)
      const c = nonZero(rng, -8, 8)
      const x = nonZero(rng, -6, 6)
      const value = a * (b * x + c)
      const correct = formatDe(value)
      const wrong1 = formatDe(a * b * x + c) // c nicht mit a multipliziert
      const wrong2 = formatDe(a * b * x - a * c) // Vorzeichen bei c falsch verteilt
      const wrong3 = formatDe(a + b * x + c) // a nicht verteilt, nur addiert
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Multipliziere aus und berechne für x = ${x}: ${num(a)}·(${num(b)}x + ${num(c)})`,
        choices,
        correct,
        solution: correct,
        explanation: `${num(a)}·(${num(b)}x + ${num(c)}) = ${a * b}x + ${num(a * c)}. Für x = ${x}: ${value}.`,
        dedupeKey: `k8neuausmul-mc:${a}:${b}:${c}:${x}`,
      })
    },
    (rng: Rng) => {
      const a = nonZero(rng, -2, 2)
      const b = nonZero(rng, -2, 2)
      const c = nonZero(rng, -3, 3)
      const x = nonZero(rng, -2, 2)
      const value = a * (b * x + c)
      return numberLineTask({
        question: `Multipliziere aus und berechne für x = ${x}: ${num(a)}·(${num(b)}x + ${num(c)}). Markiere das Ergebnis auf dem Zahlenstrahl.`,
        min: -20,
        max: 20,
        step: 1,
        value,
        solution: formatDe(value),
        explanation: `${num(a)}·(${num(b)}x + ${num(c)}) = ${a * b}x + ${num(a * c)}. Für x = ${x}: ${value}.`,
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// Lernbereich 2 — Zufallsversuche
// ---------------------------------------------------------------------------

const laplaceBruchNeu: Topic = asNeuTopic('k8-lb2-laplace-bruch', {
  id: 'k8-lb2-laplace-bruch__neu',
  title: 'Laplace-Wahrscheinlichkeit als Bruch (Kartenstapel)',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Wahrscheinlichkeit', 'Laplace', 'Bruch', 'Kartenstapel', 'günstige Ergebnisse'],
  fachwissen: {
    text: 'Bei einem Laplace-Experiment sind alle Ergebnisse gleich wahrscheinlich. Die Wahrscheinlichkeit eines Ereignisses A ist P(A) = (Anzahl günstiger Ergebnisse) / (Anzahl aller möglichen Ergebnisse). Bei einem Kartenstapel entspricht die Gesamtzahl aller Karten der Anzahl aller möglichen Ergebnisse.',
    quelle: 'Wikipedia: Laplace-Experiment',
    url: 'https://de.wikipedia.org/wiki/Laplace-Experiment',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const rot = randInt(rng, 1, 8)
      const gelb = randInt(rng, 1, 8)
      const blau = randInt(rng, 1, 8)
      const total = rot + gelb + blau
      const farbe = pick(rng, [
        ['rote', rot],
        ['gelbe', gelb],
        ['blaue', blau],
      ] as const)
      const value = makeFraction(farbe[1], total)
      return fractionTask({
        question: `Ein Stapel enthält ${rot} rote, ${gelb} gelbe und ${blau} blaue Karten. Du ziehst verdeckt eine Karte. Wie groß ist die Wahrscheinlichkeit, eine ${farbe[0]} Karte zu ziehen? Gib den gekürzten Bruch an.`,
        value,
        requireReduced: true,
        solution: format(value),
        explanation: `Es gibt ${farbe[1]} günstige von ${total} möglichen Karten: P = ${farbe[1]}/${total} = ${format(value)}.`,
      })
    },
    (rng: Rng) => {
      const rot = randInt(rng, 1, 8)
      const gelb = randInt(rng, 1, 8)
      const blau = randInt(rng, 1, 8)
      const total = rot + gelb + blau
      const farbe = pick(rng, [
        ['rote', rot],
        ['gelbe', gelb],
        ['blaue', blau],
      ] as const)
      const value = makeFraction(farbe[1], total)
      const correct = format(value)
      const wrong1 = `${farbe[1]}/${total}` // ungekürzt angegeben
      const wrong2 = format(makeFraction(total - farbe[1], total)) // Gegenwahrscheinlichkeit statt gesuchter Farbe
      const wrong3 = format(makeFraction(farbe[1], farbe[1])) // Nenner mit Zähler verwechselt
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `${total} Karten liegen auf einem Stapel, davon sind ${farbe[1]} ${farbe[0]}. Wie groß ist die Wahrscheinlichkeit, beim verdeckten Ziehen eine ${farbe[0]} Karte zu erhalten?`,
        choices,
        correct,
        solution: correct,
        explanation: `P = ${farbe[1]}/${total} = ${format(value)}.`,
        dedupeKey: `k8neulapbr-mc:${rot}:${gelb}:${blau}:${farbe[1]}`,
      })
    },
    (rng: Rng) => {
      const total = 20
      const k = randInt(rng, 1, 19)
      const value = k / total
      return numberLineTask({
        question: `Ein Kartenstapel hat ${total} Karten, davon sind ${k} blau. Markiere die Wahrscheinlichkeit, verdeckt eine blaue Karte zu ziehen, als Dezimalzahl auf dem Zahlenstrahl.`,
        min: 0,
        max: 1,
        step: 0.05,
        decimals: 2,
        value,
        solution: formatDe(value),
        explanation: `P = ${k}/${total} = ${formatDe(value)}.`,
      })
    },
    // V4 Baumdiagramm — Urne, zweimal ziehen ohne Zurücklegen: Zweige der zweiten Stufe eintragen
    (rng: Rng) => {
      const [rot, blau] = pick(rng, [
        [3, 2],
        [4, 2],
        [5, 3],
        [3, 4],
        [4, 3],
        [5, 2],
      ] as const)
      const n = rot + blau
      return treeDiagramTask({
        question: `In einer Urne liegen ${rot} rote und ${blau} blaue Kugeln. Du ziehst zweimal nacheinander eine Kugel, ohne die erste zurückzulegen. Trage die fehlenden Wahrscheinlichkeiten an den Zweigen der zweiten Stufe ein.`,
        levels: [{ outcomes: ['Rot', 'Blau'] }, { outcomes: ['Rot', 'Blau'] }],
        probabilities: {
          '0': `${rot}/${n}`,
          '1': `${blau}/${n}`,
          '0.0': `${rot - 1}/${n - 1}`,
          '0.1': `${blau}/${n - 1}`,
          '1.0': `${rot}/${n - 1}`,
          '1.1': `${blau - 1}/${n - 1}`,
        },
        blanks: { branches: ['0.0', '0.1', '1.0', '1.1'], leaves: [] },
        rootLabel: 'Start',
        solution: `Rot, Rot: ${format(makeFraction(rot - 1, n - 1))}; Rot, Blau: ${format(makeFraction(blau, n - 1))}; Blau, Rot: ${format(makeFraction(rot, n - 1))}; Blau, Blau: ${format(makeFraction(blau - 1, n - 1))}`,
        explanation: `Nach dem ersten Zug liegen nur noch ${n - 1} Kugeln in der Urne, weil nicht zurückgelegt wird. War die erste Kugel rot, bleiben ${rot - 1} rote und ${blau} blaue: ${rot - 1}/${n - 1} und ${blau}/${n - 1}. War sie blau, bleiben ${rot} rote und ${blau - 1} blaue: ${rot}/${n - 1} und ${blau - 1}/${n - 1}. Probe: Die Zweige, die von einem Punkt ausgehen, ergeben zusammen 1 (Summenregel).`,
        dedupeKey: `k8neu-tree-urne-zweige:${rot}:${blau}`,
      })
    },
    // V5 Baumdiagramm — Urne ohne Zurücklegen: Pfadwahrscheinlichkeit am Ende des Pfades
    (rng: Rng) => {
      const [rot, blau] = pick(rng, [
        [3, 2],
        [4, 2],
        [5, 3],
        [3, 4],
        [4, 3],
        [5, 2],
      ] as const)
      const n = rot + blau
      const erste = pick(rng, ['rot', 'blau'] as const)
      const zweite = erste === 'rot' ? 'blau' : 'rot'
      const [a, b] = erste === 'rot' ? [rot, blau] : [blau, rot]
      const value = multiply(makeFraction(a, n), makeFraction(b, n - 1))
      const leaf = erste === 'rot' ? '0.1' : '1.0'
      return treeDiagramTask({
        question: `In einer Urne liegen ${rot} rote und ${blau} blaue Kugeln. Du ziehst zweimal nacheinander eine Kugel, ohne die erste zurückzulegen. Wie groß ist die Wahrscheinlichkeit, dass die erste Kugel ${erste} und die zweite ${zweite} ist? Trage sie am Ende des passenden Pfades ein.`,
        levels: [{ outcomes: ['Rot', 'Blau'] }, { outcomes: ['Rot', 'Blau'] }],
        probabilities: {
          '0': `${rot}/${n}`,
          '1': `${blau}/${n}`,
          '0.0': `${rot - 1}/${n - 1}`,
          '0.1': `${blau}/${n - 1}`,
          '1.0': `${rot}/${n - 1}`,
          '1.1': `${blau - 1}/${n - 1}`,
        },
        blanks: { branches: [], leaves: [leaf] },
        rootLabel: 'Start',
        solution: format(value),
        explanation: `Pfadregel: Die Wahrscheinlichkeit eines Pfades ist das Produkt der Wahrscheinlichkeiten entlang des Pfades. P = ${a}/${n} · ${b}/${n - 1} = ${a * b}/${n * (n - 1)} = ${format(value)}.`,
        dedupeKey: `k8neu-tree-urne-pfad:${rot}:${blau}:${erste}`,
      })
    },
  ),
})

const laplaceProzentNeu: Topic = asNeuTopic('k8-lb2-laplace-prozent', {
  id: 'k8-lb2-laplace-prozent__neu',
  title: 'Laplace-Wahrscheinlichkeit in Prozent (Glücksrad)',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Wahrscheinlichkeit', 'Laplace', 'Prozent', 'Glücksrad'],
  fachwissen: {
    text: 'Die Laplace-Wahrscheinlichkeit lässt sich als Bruch, Dezimalzahl oder Prozentzahl angeben: P in Prozent = (günstige Ergebnisse / alle Ergebnisse) · 100. Bei einem Glücksrad mit gleich großen Feldern ist jedes Feld gleich wahrscheinlich.',
    quelle: 'Wikipedia: Wahrscheinlichkeit',
    url: 'https://de.wikipedia.org/wiki/Wahrscheinlichkeit',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const total = pick(rng, [4, 5, 8, 10, 20, 25])
      const k = randInt(rng, 1, total - 1)
      const value = roundTo((k / total) * 100, 2)
      return valueTask({
        question: `Ein Glücksrad hat ${total} gleich große Felder, davon sind ${k} mit einem Gewinnsymbol markiert. Wie groß ist die Gewinnwahrscheinlichkeit in Prozent?`,
        unit: '%',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} %`,
        explanation: `P = ${k} : ${total} = ${formatDe(k / total)}. In Prozent: ${formatDe(value)} %.`,
        dedupeKey: `k8neulapproz-tippen:${total}:${k}`,
      })
    },
    (rng: Rng) => {
      const total = pick(rng, [4, 5, 8, 10, 20, 25])
      const k = randInt(rng, 1, total - 1)
      const value = roundTo((k / total) * 100, 2)
      const correct = `${formatDe(value)} %`
      const wrong1 = `${formatDe(roundTo(k / total, 2))} %` // ×100 vergessen
      const wrong2 = `${formatDe(roundTo(((total - k) / total) * 100, 2))} %` // Gegenwahrscheinlichkeit
      const wrong3 = `${formatDe(roundTo((total / k) * 100, 2))} %` // Bruch verdreht
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Von ${total} gleich großen Feldern eines Glücksrads sind ${k} Gewinnfelder. Wie groß ist die Gewinnwahrscheinlichkeit in Prozent?`,
        choices,
        correct,
        solution: correct,
        explanation: `P = ${k} : ${total} = ${formatDe(k / total)}. In Prozent: ${formatDe(value)} %.`,
        dedupeKey: `k8neulapproz-mc:${total}:${k}`,
      })
    },
    (rng: Rng) => {
      const totalOptions = [
        { total: 4, ks: [1, 2, 3] },
        { total: 5, ks: [1, 2, 3, 4] },
        { total: 8, ks: [2, 4, 6] },
      ] as const
      const opt = pick(rng, totalOptions)
      const total = opt.total
      const k = pick(rng, opt.ks)
      const value = roundTo((k / total) * 100, 2)
      const sectors = [
        ...Array.from({ length: k }, () => 'Gewinn'),
        ...Array.from({ length: total - k }, () => 'Leer'),
      ]
      return paramSliderTask({
        question: `Das Glücksrad hat ${total} gleich große Felder, davon sind ${k} Gewinnfelder. Schätze die Gewinnwahrscheinlichkeit in Prozent und stelle sie am Regler ein.`,
        params: [{ id: 'prozent', label: 'Prozent (%)', min: 0, max: 100, step: 5, start: 50 }],
        correct: { prozent: value },
        solution: `${formatDe(value)} %`,
        explanation: `P = ${k} : ${total} = ${formatDe(k / total)}. In Prozent: ${formatDe(value)} %.`,
        visualContent: generateSpinnerSvg({ payoffs: sectors }),
        instruction: 'Stelle die geschätzte Gewinnwahrscheinlichkeit ein:',
      })
    },
    // V4 Baumdiagramm — Münze und Würfel: Wahrscheinlichkeit jedes Pfades
    (rng: Rng) => {
      const wurf = pick(rng, [
        { wort: 'Sechs', rest: 'andere', k: 1 },
        { wort: 'Fünf', rest: 'andere', k: 1 },
      ])
      const w = makeFraction(wurf.k, 6)
      const rest = subtract({ n: 1, d: 1 }, w)
      const half = { n: 1, d: 2 }
      const pfad = (f: Fraction): string => format(multiply(half, f))
      return treeDiagramTask({
        question: `Du wirfst eine Münze und danach einen Würfel. Beim Würfel unterscheidest du: ${wurf.wort} oder eine andere Zahl. Trage die Wahrscheinlichkeit jedes Pfades am Ende ein.`,
        levels: [{ outcomes: ['Kopf', 'Zahl'] }, { outcomes: [wurf.wort, wurf.rest] }],
        probabilities: { '0': '1/2', '1': '1/2', '0.0': format(w), '0.1': format(rest), '1.0': format(w), '1.1': format(rest) },
        blanks: { branches: [], leaves: ['0.0', '0.1', '1.0', '1.1'] },
        rootLabel: 'Start',
        solution: `Kopf, ${wurf.wort}: ${pfad(w)}; Kopf, andere: ${pfad(rest)}; Zahl, ${wurf.wort}: ${pfad(w)}; Zahl, andere: ${pfad(rest)}`,
        explanation: `Pfadregel: Die Wahrscheinlichkeit eines Pfades ist das Produkt entlang des Pfades. Kopf und ${wurf.wort}: 1/2 · ${format(w)} = ${pfad(w)}. Kopf und andere: 1/2 · ${format(rest)} = ${pfad(rest)}. Für Zahl sind die Werte genauso. Probe (Summenregel): Alle vier Pfade zusammen ergeben 1.`,
        dedupeKey: `k8neu-tree-muenze-wuerfel:${wurf.wort}`,
      })
    },
    // V5 Baumdiagramm — zweistufiges Glücksrad, Pfade zu den Gewinnen
    (rng: Rng) => {
      const [n1, k1, n2, k2] = pick(rng, [
        [5, 2, 4, 1],
        [4, 1, 5, 2],
        [10, 3, 4, 1],
        [5, 3, 10, 3],
        [4, 3, 5, 1],
        [10, 7, 5, 2],
      ] as const)
      const p1 = makeFraction(k1, n1)
      const q1 = subtract({ n: 1, d: 1 }, p1)
      const p2 = makeFraction(k2, n2)
      const q2 = subtract({ n: 1, d: 1 }, p2)
      const beide = multiply(p1, p2)
      return treeDiagramTask({
        question: `Ein Glücksrad hat ${n1} gleich große Felder, davon sind ${k1} rot. Dreht es sich auf Rot, darfst du ein zweites Rad mit ${n2} gleich großen Feldern drehen, davon sind ${k2} Gewinne. Auch bei Grün darfst du das zweite Rad drehen. Wie groß ist die Wahrscheinlichkeit für Rot und Gewinn? Trage sie am Ende des passenden Pfades ein.`,
        levels: [{ outcomes: ['Rot', 'Grün'] }, { outcomes: ['Gewinn', 'Niete'] }],
        probabilities: {
          '0': format(p1),
          '1': format(q1),
          '0.0': format(p2),
          '0.1': format(q2),
          '1.0': format(p2),
          '1.1': format(q2),
        },
        blanks: { branches: [], leaves: ['0.0'] },
        rootLabel: 'Start',
        solution: `${format(beide)} (${formatDe(roundTo(beide.n / beide.d * 100, 2))} %)`,
        explanation: `Pfadregel: Die Wahrscheinlichkeit eines Pfades ist das Produkt entlang des Pfades. P(Rot und Gewinn) = ${format(p1)} · ${format(p2)} = ${format(beide)}. Das sind ${formatDe(roundTo(beide.n / beide.d * 100, 2))} %.`,
        dedupeKey: `k8neu-tree-rad:${n1}:${k1}:${n2}:${k2}`,
      })
    },
  ),
})

const gegenwahrscheinlichkeitNeu: Topic = asNeuTopic('k8-lb2-gegenwahrscheinlichkeit', {
  id: 'k8-lb2-gegenwahrscheinlichkeit__neu',
  title: 'Gegenwahrscheinlichkeit (Wettervorhersage)',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Gegenwahrscheinlichkeit', 'Gegenereignis', 'Komplement', 'Wettervorhersage'],
  fachwissen: {
    text: 'Zu jedem Ereignis A gehört ein Gegenereignis Ā, das alle nicht zu A gehörenden Ergebnisse umfasst. Es gilt P(A) + P(Ā) = 1, also P(Ā) = 1 − P(A). Das ist nützlich, wenn z. B. „kein Regen" leichter zu berechnen ist als „Regen".',
    quelle: 'Wikipedia: Gegenereignis',
    url: 'https://de.wikipedia.org/wiki/Gegenereignis',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const total = pick(rng, [4, 5, 6, 8, 10, 12])
      const k = randInt(rng, 1, total - 1)
      const p: Fraction = makeFraction(k, total)
      const value = subtract({ n: 1, d: 1 }, p)
      return fractionTask({
        question: `Die Regenwahrscheinlichkeit für morgen beträgt ${format(p)}. Wie groß ist die Wahrscheinlichkeit, dass es nicht regnet? Gib den gekürzten Bruch an.`,
        value,
        requireReduced: true,
        solution: format(value),
        explanation: `P(kein Regen) = 1 − P(Regen) = 1 − ${format(p)} = ${format(value)}.`,
      })
    },
    (rng: Rng) => {
      const total = pick(rng, [4, 5, 6, 8, 10, 12])
      const k = randInt(rng, 1, total - 1)
      const p: Fraction = makeFraction(k, total)
      const value = subtract({ n: 1, d: 1 }, p)
      const correct = format(value)
      const wrong1 = format(p) // Gegenwahrscheinlichkeit mit Ausgangswahrscheinlichkeit verwechselt
      const wrong2 = `${total - k}/${total}` // ungekürzt angegeben
      const wrong3 = format(makeFraction(k, total - k)) // falscher Nenner gebildet
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Ereignis hat die Wahrscheinlichkeit ${format(p)}. Wie groß ist die Gegenwahrscheinlichkeit?`,
        choices,
        correct,
        solution: correct,
        explanation: `P(Ā) = 1 − P(A) = 1 − ${format(p)} = ${format(value)}.`,
        dedupeKey: `k8neugegen-mc:${k}:${total}`,
      })
    },
    (rng: Rng) => {
      const total = 20
      const k = randInt(rng, 1, 19)
      const p = k / total
      const value = 1 - p
      return numberLineTask({
        question: `Ein Ereignis hat die Wahrscheinlichkeit ${formatDe(p)}. Markiere die Gegenwahrscheinlichkeit als Dezimalzahl auf dem Zahlenstrahl.`,
        min: 0,
        max: 1,
        step: 0.05,
        decimals: 2,
        value,
        solution: formatDe(value),
        explanation: `1 − ${formatDe(p)} = ${formatDe(value)}.`,
      })
    },
    // V4 Baumdiagramm — Regen an zwei Tagen: Gegenwahrscheinlichkeiten (Summenregel) und Pfad
    (rng: Rng) => {
      const sa = pick(rng, [30, 20, 60, 40, 10, 70])
      const so = pick(rng, [10, 15, 25])
      const de = (prozent: number): string => formatDe(prozent / 100)
      const keinBeide = ((100 - sa) * (100 - so)) / 10000
      return treeDiagramTask({
        question: `Die Regenwahrscheinlichkeit beträgt am Samstag ${de(sa)} und am Sonntag ${de(so)}. An jedem Tag gibt es Regen oder Sonne (also keinen Regen). Die beiden Tage hängen nicht voneinander ab. Trage die fehlenden Wahrscheinlichkeiten ein, auch für den Pfad, bei dem an beiden Tagen die Sonne scheint.`,
        levels: [{ outcomes: ['Regen', 'Sonne'] }, { outcomes: ['Regen', 'Sonne'] }],
        probabilities: {
          '0': de(sa),
          '1': de(100 - sa),
          '0.0': de(so),
          '0.1': de(100 - so),
          '1.0': de(so),
          '1.1': de(100 - so),
        },
        blanks: { branches: ['1', '0.1', '1.1'], leaves: ['1.1'] },
        rootLabel: 'Samstag',
        solution: `${de(100 - sa)}; ${de(100 - so)}; ${de(100 - so)}; Pfad Sonne, Sonne: ${formatDe(keinBeide)}`,
        explanation: `Die Zweige, die von einem Punkt ausgehen, ergeben zusammen 1 (Summenregel): 1 − ${de(sa)} = ${de(100 - sa)} und 1 − ${de(so)} = ${de(100 - so)}. Weil die Tage nicht voneinander abhängen, gelten am Sonntag nach jedem Samstag dieselben Werte. Pfadregel: ${de(100 - sa)} · ${de(100 - so)} = ${formatDe(keinBeide)}.`,
        dedupeKey: `k8neu-tree-regen:${sa}:${so}`,
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// Lernbereich 3 — Funktionen und lineare Gleichungssysteme
// ---------------------------------------------------------------------------

const funktionswertNeu: Topic = asNeuTopic('k8-lb3-funktionswert', {
  id: 'k8-lb3-funktionswert__neu',
  title: 'Funktionswert einsetzen (Fahrradverleih)',
  hint: 'Setze den gegebenen x-Wert in die Funktion ein.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['lineare Funktion', 'Funktionswert', 'Fahrradverleih', 'Grundgebühr'],
  fachwissen: {
    text: 'Verleihpreise mit Grundgebühr und Stundenpreis lassen sich als lineare Funktion f(x) = m·x + n modellieren: m ist der Preis pro Stunde, n die Grundgebühr, x die Anzahl der Stunden. Der Funktionswert f(x₀) ergibt sich durch Einsetzen von x₀.',
    quelle: 'Wikipedia: Lineare Funktion',
    url: 'https://de.wikipedia.org/wiki/Lineare_Funktion',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const m = randInt(rng, 1, 6)
      const n = randInt(rng, 0, 10)
      const x = randInt(rng, 1, 8)
      const value = m * x + n
      return valueTask({
        question: `Ein Fahrradverleih berechnet die Kosten mit f(x) = ${m}·x + ${n}, wobei x die Anzahl der Stunden ist. Wie viel kosten x = ${x} Stunden?`,
        unit: '€',
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `f(${x}) = ${m} · ${x} + ${n} = ${m * x} + ${n} = ${value}.`,
        dedupeKey: `k8neufunkw-tippen:${m}:${n}:${x}`,
      })
    },
    (rng: Rng) => {
      const m = randInt(rng, 1, 6)
      const n = randInt(rng, 0, 10)
      const x = randInt(rng, 1, 8)
      const value = m * x + n
      const correct = formatDe(value)
      const wrong1 = formatDe(m * x) // Grundgebühr vergessen
      const wrong2 = formatDe(m * (x + n)) // Klammer falsch gesetzt
      const wrong3 = formatDe(m + x + n) // nur addiert statt multipliziert
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Fahrradverleih berechnet die Kosten mit f(x) = ${m}·x + ${n}. Was kosten x = ${x} Stunden?`,
        choices,
        correct,
        solution: correct,
        explanation: `f(${x}) = ${m} · ${x} + ${n} = ${value}.`,
        dedupeKey: `k8neufunkw-mc:${m}:${n}:${x}`,
      })
    },
    (rng: Rng) => {
      const m = randInt(rng, 1, 5)
      const n = randInt(rng, 0, 8)
      const x = randInt(rng, 1, 6)
      const value = m * x + n
      return paramSliderTask({
        question: `Ein Fahrradverleih berechnet die Kosten mit f(x) = ${m}·x + ${n}. Berechne die Kosten für x = ${x} Stunden und stelle sie am Regler ein.`,
        params: [{ id: 'kosten', label: 'Kosten (€)', min: 0, max: 40, step: 1, start: 20 }],
        correct: { kosten: value },
        solution: `${value} €`,
        explanation: `f(${x}) = ${m} · ${x} + ${n} = ${value}.`,
        visualContent: generateLinearFunctionSvg({
          m,
          n,
          points: [{ x, y: value, label: `(${x}|?)` }],
          interceptLabel: false,
          slopeTriangle: { fromX: 0, run: 1, showLabels: false },
        }),
        instruction: 'Stelle die berechneten Kosten ein:',
      })
    },
  ),
})

const steigungNeu: Topic = asNeuTopic('k8-lb3-steigung', {
  id: 'k8-lb3-steigung__neu',
  title: 'Steigung bestimmen (Höhenprofil)',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Steigung', 'Höhenprofil', 'Differenzenquotient', 'Wanderweg'],
  fachwissen: {
    text: 'Die Steigung m = Δy : Δx beschreibt, wie stark eine Größe pro Einheit zunimmt oder abnimmt. Bei einem Höhenprofil ist m die Höhenänderung pro Kilometer: m = (Höhe₂ − Höhe₁) : (km₂ − km₁).',
    quelle: 'Wikipedia: Steigung (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Steigung_(Mathematik)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const x1 = randInt(rng, 0, 4)
      const x2 = randInt(rng, 5, 10)
      const m = nonZero(rng, -5, 5)
      const y1 = randInt(rng, 80, 250)
      const y2 = y1 + m * (x2 - x1)
      return valueTask({
        question: `Ein Wanderweg liegt bei km ${x1} auf ${y1} m Höhe und bei km ${x2} auf ${y2} m Höhe. Berechne die Steigung m (Höhenänderung in m pro km).`,
        answerKind: 'integer',
        value: m,
        solution: `m = ${m}`,
        explanation: `m = (${y2} − ${y1}) : (${x2} − ${x1}) = ${y2 - y1} : ${x2 - x1} = ${m}.`,
        dedupeKey: `k8neusteig-tippen:${x1}:${y1}:${x2}:${y2}`,
      })
    },
    (rng: Rng) => {
      const x1 = randInt(rng, 0, 4)
      const x2 = randInt(rng, 5, 10)
      const m = nonZero(rng, -5, 5)
      const y1 = randInt(rng, 80, 250)
      const y2 = y1 + m * (x2 - x1)
      const correct = formatDe(m)
      const wrong1 = formatDe((x2 - x1) / (y2 - y1)) // Δx und Δy vertauscht
      const wrong2 = formatDe(-m) // Vorzeichen falsch
      const wrong3 = formatDe(y2 - y1) // Division vergessen
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Wanderweg liegt bei km ${x1} auf ${y1} m Höhe und bei km ${x2} auf ${y2} m Höhe. Wie groß ist die Steigung?`,
        choices,
        correct,
        solution: correct,
        explanation: `m = (${y2} − ${y1}) : (${x2} − ${x1}) = ${m}.`,
        dedupeKey: `k8neusteig-mc:${x1}:${y1}:${x2}:${y2}`,
      })
    },
    (rng: Rng) => {
      const m = nonZero(rng, -4, 4)
      const n = randInt(rng, -3, 3)
      const fromX = randInt(rng, -3, 2)
      const run = pick(rng, [1, 2] as const)
      const y0 = m * fromX + n
      const y1 = m * (fromX + run) + n
      return paramSliderTask({
        question: 'Lies die Steigung m am Steigungsdreieck ab und stelle sie am Regler ein (m = Δy : Δx).',
        params: [{ id: 'm', label: 'Steigung m', min: -5, max: 5, step: 1, start: 0 }],
        correct: { m },
        solution: `m = ${m}`,
        explanation: `m = Δy : Δx = (${y1} − ${y0}) : ${run} = ${y1 - y0} : ${run} = ${m}.`,
        visualContent: generateLinearFunctionSvg({
          m,
          n,
          interceptLabel: false,
          points: [
            { x: fromX, y: y0, label: 'P' },
            { x: fromX + run, y: y1, label: 'Q' },
          ],
          slopeTriangle: {
            fromX,
            run,
            dxLabel: `Δx=${run}`,
            dyLabel: `Δy=${y1 - y0}`,
          },
        }),
        instruction: 'Stelle die abgelesene Steigung ein:',
      })
    },
  ),
})

const achsenabschnittNeu: Topic = asNeuTopic('k8-lb3-achsenabschnitt', {
  id: 'k8-lb3-achsenabschnitt__neu',
  title: 'y-Achsenabschnitt bestimmen (Sparplan)',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['y-Achsenabschnitt', 'Sparplan', 'Startbetrag', 'lineare Funktion'],
  fachwissen: {
    text: 'Bei einem Sparplan mit monatlich konstanter Rate m beschreibt y = m·x + n den Kontostand nach x Monaten, wobei n der Startbetrag (y-Achsenabschnitt) ist. Kennt man m, x und y, lässt sich n berechnen: n = y − m·x.',
    quelle: 'Wikipedia: Lineare Funktion',
    url: 'https://de.wikipedia.org/wiki/Lineare_Funktion',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const m = nonZero(rng, -15, 15)
      const x = randInt(rng, 1, 12)
      const n = randInt(rng, 0, 100)
      const y = m * x + n
      return valueTask({
        question: `Ein Sparplan ändert sich um ${num(m)} € pro Monat und erreicht nach x = ${x} Monaten einen Stand von ${y} €. Wie hoch war der Startbetrag n?`,
        unit: '€',
        answerKind: 'integer',
        value: n,
        solution: `n = ${n} €`,
        explanation: `n = y − m·x = ${y} − ${num(m)} · ${x} = ${y} − ${m * x} = ${n}.`,
        dedupeKey: `k8neuachs-tippen:${m}:${x}:${y}`,
      })
    },
    (rng: Rng) => {
      const m = nonZero(rng, -15, 15)
      const x = randInt(rng, 1, 12)
      const n = randInt(rng, 0, 100)
      const y = m * x + n
      const correct = formatDe(n)
      const wrong1 = formatDe(y + m * x) // addiert statt subtrahiert
      const wrong2 = formatDe(y - m) // x vergessen
      const wrong3 = formatDe(-n) // Vorzeichen vertauscht
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Sparplan ändert sich um ${num(m)} € pro Monat und erreicht nach x = ${x} Monaten ${y} €. Wie hoch war der Startbetrag?`,
        choices,
        correct,
        solution: correct,
        explanation: `n = ${y} − ${num(m)} · ${x} = ${n}.`,
        dedupeKey: `k8neuachs-mc:${m}:${x}:${y}`,
      })
    },
    (rng: Rng) => {
      const m = nonZero(rng, -5, 5)
      const n = nonZero(rng, -5, 5)
      const x = nonZero(rng, -3, 3)
      const y = m * x + n
      return paramSliderTask({
        question: `Ein Sparplan mit monatlicher Änderung m = ${m} € steht nach x = ${x} Monaten bei ${y} €. Berechne den Startbetrag n und stelle ihn am Regler ein.`,
        params: [
          { id: 'm', label: 'Steigung m', min: -5, max: 5, step: 1, start: m },
          { id: 'n', label: 'Startbetrag n', min: -10, max: 10, step: 1, start: 0 },
        ],
        correct: { m, n },
        solution: `n = ${n}`,
        explanation: `n = ${y} − ${num(m)} · ${x} = ${n}.`,
        visualContent: generateLinearFunctionSvg({
          m,
          n,
          points: [{ x, y, label: 'P' }],
          interceptLabel: '?',
          slopeTriangle: { fromX: 0, run: m >= 0 ? 1 : -1, showLabels: false },
        }),
        instruction: 'm ist schon richtig eingestellt — stelle n ein:',
      })
    },
  ),
})

const lgsNeu: Topic = asNeuTopic('k8-lb3-lgs', {
  id: 'k8-lb3-lgs__neu',
  title: 'Lineares Gleichungssystem (Kinokarten)',
  hint: 'Additions- oder Einsetzungsverfahren.',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['LGS', 'Gleichungssystem', 'Kinokarten', 'zwei Unbekannte'],
  fachwissen: {
    text: 'Sachaufgaben mit zwei unterschiedlichen Preisen (z. B. Erwachsene und Kinder) führen auf ein lineares Gleichungssystem mit zwei Unbekannten. Zwei unabhängige Gleichungen reichen, um beide Preise eindeutig zu bestimmen (Einsetzungs- oder Additionsverfahren).',
    quelle: 'Wikipedia: Lineares Gleichungssystem',
    url: 'https://de.wikipedia.org/wiki/Lineares_Gleichungssystem',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const x = randInt(rng, 4, 15) // Preis Erwachsenenkarte
      const y = randInt(rng, 2, 10) // Preis Kinderkarte
      const a = randInt(rng, 1, 4)
      const b = randInt(rng, 1, 4)
      const c = randInt(rng, 1, 4)
      let d = randInt(rng, 1, 4)
      let guard = 0
      while (a * d - b * c === 0 && guard < 20) {
        d = randInt(rng, 1, 4)
        guard++
      }
      const e = a * x + b * y
      const f = c * x + d * y
      return valueTask({
        question: `Für ${a} Erwachsenenkarte(n) und ${b} Kinderkarte(n) zahlt eine Familie ${e} €. Für ${c} Erwachsenenkarte(n) und ${d} Kinderkarte(n) zahlt eine andere Familie ${f} €. Berechne den Preis x einer Erwachsenenkarte.`,
        unit: '€',
        answerKind: 'integer',
        value: x,
        solution: `x = ${x} €`,
        explanation: `Mit dem Additionsverfahren erhält man die eindeutige Lösung x = ${x} € (und y = ${y} €), da ${a}·${d} − ${b}·${c} = ${a * d - b * c} ≠ 0 ist.`,
        dedupeKey: `k8neulgs-tippen:${a}:${b}:${c}:${d}:${x}:${y}`,
      })
    },
    (rng: Rng) => {
      const x = randInt(rng, 4, 15)
      const y = randInt(rng, 2, 10)
      const a = randInt(rng, 1, 4)
      const b = randInt(rng, 1, 4)
      const c = randInt(rng, 1, 4)
      let d = randInt(rng, 1, 4)
      let guard = 0
      while (a * d - b * c === 0 && guard < 20) {
        d = randInt(rng, 1, 4)
        guard++
      }
      const e = a * x + b * y
      const f = c * x + d * y
      const correct = formatDe(x)
      const wrong1 = formatDe(y) // Erwachsenen- mit Kinderpreis verwechselt
      const wrong2 = formatDe((e + f) / (a + c)) // beide Gleichungen naiv gemittelt
      const wrong3 = formatDe(e / a) // zweite Gleichung/Variable b ignoriert
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `${a} Erwachsenenkarte(n) und ${b} Kinderkarte(n) kosten zusammen ${e} €, ${c} Erwachsenenkarte(n) und ${d} Kinderkarte(n) kosten ${f} €. Wie viel kostet eine Erwachsenenkarte?`,
        choices,
        correct,
        solution: correct,
        explanation: `Lösung des Gleichungssystems: x = ${x} €, y = ${y} €.`,
        dedupeKey: `k8neulgs-mc:${a}:${b}:${c}:${d}:${x}:${y}`,
      })
    },
    (rng: Rng) => {
      const x = nonZero(rng, -4, 4)
      const y = nonZero(rng, -4, 4)
      const m1 = nonZero(rng, -3, 3)
      let m2 = nonZero(rng, -3, 3)
      while (m2 === m1) m2 = nonZero(rng, -3, 3)
      const n1 = y - m1 * x
      const n2 = y - m2 * x
      return paramSliderTask({
        question: `Die Geraden g: y = ${num(m1)}x + ${num(n1)} und h: y = ${num(m2)}x + ${num(n2)} schneiden sich. Berechne die x-Koordinate des Schnittpunkts und stelle sie am Regler ein.`,
        params: [{ id: 'x', label: 'x-Koordinate', min: -6, max: 6, step: 1, start: 0 }],
        correct: { x },
        solution: `x = ${x}`,
        explanation: `Setze ${num(m1)}x + ${num(n1)} = ${num(m2)}x + ${num(n2)} → x = ${x}.`,
        visualContent: generateLinearFunctionSvg({
          m: m1,
          n: n1,
          interceptLabel: false,
          points: [{ x, y, label: '?' }],
          second: { m: m2, n: n2 },
          xRange: [-6, 6],
          yRange: [-6, 6],
        }),
        instruction: 'Stelle die berechnete x-Koordinate ein:',
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// Lernbereich 4 — Ähnlichkeit
// ---------------------------------------------------------------------------

const streckfaktorNeu: Topic = asNeuTopic('k8-lb4-streckfaktor', {
  id: 'k8-lb4-streckfaktor__neu',
  title: 'Streckfaktor bestimmen (Modell & Karte)',
  hint: 'k = Bildlänge : Originallänge.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Ähnlichkeit', 'Streckfaktor', 'zentrische Streckung', 'Maßstab', 'Verkleinerung'],
  fachwissen: {
    text: 'Bei der zentrischen Streckung wird jede Strecke mit dem Streckfaktor k multipliziert: k = Bildlänge : Originallänge. Bei k > 1 entsteht eine Vergrößerung, bei 0 < k < 1 eine Verkleinerung. Modellautos, Fotos und Landkarten sind alltägliche Beispiele für Verkleinerungen mit einem festen Faktor.',
    quelle: 'Wikipedia: Zentrische Streckung',
    url: 'https://de.wikipedia.org/wiki/Zentrische_Streckung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const d = pick(rng, [2, 4, 5, 10] as const)
      const orig = randInt(rng, 1, 20) * d
      const k = 1 / d
      const bild = orig * k
      return valueTask({
        question: `Ein Modellauto ist eine verkleinerte Nachbildung. Das Original ist ${orig} cm lang, das Modell ${bild} cm. Bestimme den Streckfaktor k (als Dezimalzahl).`,
        answerKind: 'decimal',
        value: k,
        solution: `k = ${formatDe(k)}`,
        explanation: `k = Bildlänge : Originallänge = ${bild} cm : ${orig} cm = ${formatDe(k)}.`,
        dedupeKey: `k8neustreck-tippen:${orig}:${d}`,
      })
    },
    (rng: Rng) => {
      const orig = randInt(rng, 2, 12)
      const k = randInt(rng, 2, 6)
      const bild = orig * k
      const correct = formatDe(k)
      const wrong1 = formatDe(orig / bild) // Verhältnis invertiert
      const wrong2 = formatDe(bild - orig) // Differenz statt Verhältnis
      const wrong3 = formatDe(bild) // Bildlänge direkt als Faktor übernommen
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Eine Strecke von ${orig} cm wird vergrößert auf ${bild} cm. Welcher Streckfaktor k wurde verwendet?`,
        choices,
        correct,
        solution: correct,
        explanation: `k = ${bild} cm : ${orig} cm = ${k}.`,
        dedupeKey: `k8neustreck-mc:${orig}:${k}`,
      })
    },
    (rng: Rng) => {
      const d = pick(rng, [2, 4, 5, 10] as const)
      const orig = randInt(rng, 1, 20) * d
      const k = 1 / d
      const bild = orig * k
      return numberLineTask({
        question: `Eine Strecke von ${orig} cm wird auf ${bild} cm verkleinert (Streckfaktor k < 1). Markiere k auf dem Zahlenstrahl.`,
        min: 0,
        max: 1,
        step: 0.05,
        decimals: 2,
        value: k,
        solution: `k = ${formatDe(k)}`,
        explanation: `k = ${bild} cm : ${orig} cm = ${formatDe(k)}.`,
      })
    },
  ),
})

const strahlensatzNeu: Topic = asNeuTopic('k8-lb4-strahlensatz', {
  id: 'k8-lb4-strahlensatz__neu',
  title: 'Strahlensatz: Schattenaufgabe',
  hint: 'Stelle die Proportion auf: Höhe : Schatten = Höhe : Schatten.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Strahlensatz', 'Ähnlichkeit', 'Verhältnis', 'Schatten', 'Streckenlänge'],
  fachwissen: {
    text: 'Der Strahlensatz beschreibt die Verhältnisse paralleler Strecken beim Schnitt zweier Strahlen von einem Punkt S aus: Schnittpunkte auf parallelen Geraden teilen die Strahlen im gleichen Verhältnis. Bei gleichzeitigem Sonnenstand verlaufen die Lichtstrahlen parallel, sodass sich aus der Schattenlänge eines bekannten Gegenstands die Höhe eines anderen berechnen lässt.',
    quelle: 'Wikipedia: Strahlensatz',
    url: 'https://de.wikipedia.org/wiki/Strahlensatz',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const stab = randInt(rng, 1, 3)
      const schattenStab = randInt(rng, 1, 5)
      const k = randInt(rng, 2, 8)
      const schattenBaum = schattenStab * k
      const baumHoehe = stab * k
      return valueTask({
        question: `Ein ${stab} m hoher Stab wirft einen ${schattenStab} m langen Schatten. Zur gleichen Zeit wirft ein Baum einen ${schattenBaum} m langen Schatten. Wie hoch ist der Baum?`,
        unit: 'm',
        answerKind: 'integer',
        value: baumHoehe,
        solution: `${baumHoehe} m`,
        explanation: `${stab} : ${schattenStab} = x : ${schattenBaum} ⇒ x = ${stab} · ${schattenBaum} : ${schattenStab} = ${stab} · ${k} = ${baumHoehe} m.`,
        dedupeKey: `k8neustrahl-tippen:${stab}:${schattenStab}:${k}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 2, 8)
      const k = randInt(rng, 2, 6)
      const b = a * k
      const c = randInt(rng, 2, 9)
      const x = c * k
      const correct = `${formatDe(x)} cm`
      const wrong1 = `${formatDe((c * a) / b)} cm` // Verhältnis invertiert
      const wrong2 = `${formatDe(c + (b - a))} cm` // Differenz statt Verhältnis addiert
      const wrong3 = `${formatDe(c * k - a)} cm` // zusätzlicher Rechenfehler
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Zwei Strahlen gehen von einem Punkt S aus und werden von zwei Parallelen geschnitten. Es gilt ${a} : ${b} = ${c} : x (in cm). Berechne x.`,
        choices,
        correct,
        solution: correct,
        explanation: `x = ${c} · ${b} : ${a} = ${c} · ${k} = ${x} cm.`,
        dedupeKey: `k8neustrahl-mc:${a}:${b}:${c}`,
      })
    },
    (rng: Rng) => {
      const stab = randInt(rng, 1, 3)
      const schattenStab = randInt(rng, 1, 4)
      const k = randInt(rng, 2, 5)
      const schattenBaum = schattenStab * k
      const baumHoehe = stab * k
      return numberLineTask({
        question: `Ein ${stab} m hoher Zaunpfosten wirft einen ${schattenStab} m langen Schatten. Ein Baum daneben wirft gleichzeitig einen ${schattenBaum} m langen Schatten. Markiere die Baumhöhe auf dem Zahlenstrahl.`,
        min: 0,
        max: 20,
        step: 1,
        value: baumHoehe,
        solution: `${baumHoehe} m`,
        explanation: `${stab} : ${schattenStab} = x : ${schattenBaum} ⇒ x = ${stab} · ${k} = ${baumHoehe} m.`,
      })
    },
  ),
})

const aehnlicheSeiteNeu: Topic = asNeuTopic('k8-lb4-aehnliche-seite', {
  id: 'k8-lb4-aehnliche-seite__neu',
  title: 'Ähnliche Figuren: Seitenlänge (Rechtecke & Dreiecke)',
  hint: 'Multipliziere mit dem Ähnlichkeitsfaktor k.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Ähnlichkeit', 'ähnliche Dreiecke', 'Seitenverhältnis', 'Faktor', 'Rechteck'],
  fachwissen: {
    text: 'Zwei Figuren sind ähnlich, wenn sie die gleiche Form, aber unterschiedliche Größe haben. Entsprechende Seiten stehen im gleichen Verhältnis k (Ähnlichkeitsfaktor), entsprechende Winkel sind gleich groß. Ist k < 1, ist die zweite Figur eine verkleinerte, ist k > 1, eine vergrößerte Kopie der ersten.',
    quelle: 'Wikipedia: Ähnlichkeit (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/%C3%84hnlichkeit_(Geometrie)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const d = pick(rng, [2, 4, 5] as const)
      const seiteGross = randInt(rng, 1, 8) * d
      const k = 1 / d
      const seiteKlein = seiteGross * k
      return valueTask({
        question: `Zwei Rechtecke sind ähnlich mit dem Ähnlichkeitsfaktor k = ${formatDe(k)}. Eine Seite des großen Rechtecks ist ${seiteGross} cm lang. Wie lang ist die entsprechende Seite des kleinen Rechtecks?`,
        unit: 'cm',
        answerKind: 'integer',
        value: seiteKlein,
        solution: `${seiteKlein} cm`,
        explanation: `${seiteGross} cm · ${formatDe(k)} = ${seiteKlein} cm.`,
        dedupeKey: `k8neuaseite-tippen:${seiteGross}:${d}`,
      })
    },
    (rng: Rng) => {
      const seite = randInt(rng, 3, 12)
      const k = randInt(rng, 2, 5)
      const value = seite * k
      const correct = `${formatDe(value)} cm`
      const wrong1 = `${formatDe(seite)} cm` // Faktor vergessen
      const wrong2 = `${formatDe(seite + k)} cm` // addiert statt multipliziert
      const wrong3 = `${formatDe(seite / k)} cm` // reziproken Faktor verwendet
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Zwei Fünfecke sind ähnlich mit dem Faktor k = ${k}. Eine Seite des kleinen Fünfecks ist ${seite} cm lang. Wie lang ist die entsprechende Seite des großen Fünfecks?`,
        choices,
        correct,
        solution: correct,
        explanation: `${seite} cm · ${k} = ${value} cm.`,
        dedupeKey: `k8neuaseite-mc:${seite}:${k}`,
      })
    },
    (rng: Rng) => {
      const seite = randInt(rng, 2, 6)
      const k = randInt(rng, 2, 4)
      const value = seite * k
      return paramSliderTask({
        question: `Zwei Dreiecke sind ähnlich mit dem Faktor k = ${k}. Eine Seite des kleinen Dreiecks ist ${seite} cm lang. Berechne die entsprechende Seite des großen Dreiecks und stelle sie am Regler ein.`,
        params: [{ id: 'seite', label: 'Seitenlänge (cm)', min: 0, max: 30, step: 1, start: 10 }],
        correct: { seite: value },
        solution: `${value} cm`,
        explanation: `${seite} cm · ${k} = ${value} cm.`,
        instruction: 'Stelle die berechnete Seitenlänge ein:',
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// Lernbereich 5 — Vernetzung: Heuristische Strategien
// ---------------------------------------------------------------------------

const zahlenraetselNeu: Topic = asNeuTopic('k8-lb5-zahlenraetsel', {
  id: 'k8-lb5-zahlenraetsel__neu',
  title: 'Zahlenrätsel (Gleichung aufstellen) — Rätselrunde',
  hint: 'Übersetze den Text in eine Gleichung a·x + b = c und löse.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Zahlenrätsel', 'Gleichung', 'heuristisch', 'Textaufgabe', 'Übersetzen'],
  fachwissen: {
    text: 'Beim Lösen von Zahlenrätseln wird der Sachtext in eine mathematische Gleichung übersetzt: die gesuchte Zahl wird x genannt, dann werden die beschriebenen Rechenschritte als Gleichung notiert. Diese heuristische Strategie — Übersetzen in Algebra — ist eine der wichtigsten Problemlösemethoden der Mathematik.',
    quelle: 'Wikipedia: Gleichung',
    url: 'https://de.wikipedia.org/wiki/Gleichung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 2, 6)
      const b = nonZero(rng, -12, 12)
      const x = randInt(rng, 2, 15)
      const c = a * x + b
      const op = b >= 0 ? `addiere ${b}` : `subtrahiere ${Math.abs(b)}`
      return valueTask({
        question: `Bei einer Rätselrunde denkt sich jemand eine Zahl aus, multipliziert sie mit ${a} und ${op}. Heraus kommt ${c}. Welche Zahl wurde gedacht?`,
        answerKind: 'integer',
        value: x,
        solution: `${x}`,
        explanation: `Gleichung: ${a}·x + ${num(b)} = ${c}. Umstellen: ${a}·x = ${c} − ${num(b)} = ${a * x}, also x = ${x}.`,
        dedupeKey: `k8neuzahlr-tippen:${a}:${b}:${x}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 2, 6)
      const b = nonZero(rng, -12, 12)
      const x = randInt(rng, 2, 15)
      const c = a * x + b
      const correct = formatDe(x)
      const wrong1 = formatDe((c + b) / a) // Vorzeichen von b falsch umgekehrt
      const wrong2 = formatDe((c - b) * a) // multipliziert statt dividiert
      const wrong3 = formatDe(c - b) // Division vergessen
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Zahlenrätsel lautet: „Multipliziere eine Zahl mit ${a} und ${b >= 0 ? `addiere ${b}` : `subtrahiere ${Math.abs(b)}`}, das Ergebnis ist ${c}." Wie lautet die gesuchte Zahl?`,
        choices,
        correct,
        solution: correct,
        explanation: `${a}·x = ${c} − ${num(b)} = ${a * x}, also x = ${x}.`,
        dedupeKey: `k8neuzahlr-mc:${a}:${b}:${x}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 2, 5)
      const b = nonZero(rng, -10, 10)
      const x = randInt(rng, 2, 10)
      const c = a * x + b
      return numberLineTask({
        question: `Ein Zahlenrätsel lautet: Eine Zahl wird mit ${a} multipliziert, dann wird ${b >= 0 ? `${b} addiert` : `${Math.abs(b)} subtrahiert`}. Das Ergebnis ist ${c}. Markiere die gesuchte Zahl auf dem Zahlenstrahl.`,
        min: 0,
        max: 20,
        step: 1,
        value: x,
        solution: `${x}`,
        explanation: `${a}·x = ${c} − ${num(b)} = ${a * x}, also x = ${x}.`,
      })
    },
  ),
})

const rueckwaertsNeu: Topic = asNeuTopic('k8-lb5-rueckwaerts', {
  id: 'k8-lb5-rueckwaerts__neu',
  title: 'Rückwärtsrechnen — Umkehroperationen',
  hint: 'Kehre jeden Rechenschritt mit der Umkehroperation um.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Rückwärtsrechnen', 'Umkehroperation', 'heuristisch', 'Strategie'],
  fachwissen: {
    text: 'Rückwärtsrechnen ist eine heuristische Problemlösestrategie: Man beginnt beim bekannten Endwert und kehrt alle Rechenschritte in umgekehrter Reihenfolge mit der jeweils inversen Operation um (Addition ↔ Subtraktion, Multiplikation ↔ Division). Diese Strategie eignet sich besonders, wenn der Ausgangswert einer Rechenkette gesucht ist.',
    quelle: 'Wikipedia: Heuristik',
    url: 'https://de.wikipedia.org/wiki/Heuristik',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const mal = randInt(rng, 2, 5)
      const start = randInt(rng, 2, 20)
      const sub = randInt(rng, 1, 15)
      const end = start * mal - sub
      return valueTask({
        question: `Eine Zahl wird mit ${mal} multipliziert, danach werden ${sub} abgezogen. Das Ergebnis ist ${end}. Wie lautet die ursprüngliche Zahl?`,
        answerKind: 'integer',
        value: start,
        solution: `${start}`,
        explanation: `Rückwärts: ${end} + ${sub} = ${end + sub}, dann : ${mal} = ${start}.`,
        dedupeKey: `k8neurueck-tippen:${mal}:${start}:${sub}`,
      })
    },
    (rng: Rng) => {
      const start = randInt(rng, 2, 20)
      const add = randInt(rng, 1, 15)
      const mal = randInt(rng, 2, 5)
      const end = (start + add) * mal
      const correct = formatDe(start)
      const wrong1 = formatDe(end / mal) // Addition rückgängig zu machen vergessen
      const wrong2 = formatDe(end * mal - add) // multipliziert statt dividiert
      const wrong3 = formatDe(end - add) // Division komplett vergessen
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Zu einer Zahl wird ${add} addiert, das Ergebnis mit ${mal} multipliziert. Man erhält ${end}. Welche Zahl war es ursprünglich?`,
        choices,
        correct,
        solution: correct,
        explanation: `Rückwärts: ${end} : ${mal} = ${end / mal}, dann − ${add} = ${start}.`,
        dedupeKey: `k8neurueck-mc:${start}:${add}:${mal}`,
      })
    },
    (rng: Rng) => {
      const start = randInt(rng, 2, 15)
      const add = randInt(rng, 1, 10)
      const mal = randInt(rng, 2, 4)
      const end = (start + add) * mal
      return numberLineTask({
        question: `Zu einer Zahl wird ${add} addiert und das Ergebnis mit ${mal} multipliziert. Heraus kommt ${end}. Markiere die ursprüngliche Zahl auf dem Zahlenstrahl.`,
        min: 0,
        max: 40,
        step: 1,
        value: start,
        solution: `${start}`,
        explanation: `Rückwärts: ${end} : ${mal} = ${end / mal}, dann − ${add} = ${start}.`,
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const math8NeuLb1: Topic[] = [
  zusammenfassenNeu,
  termAuswertenNeu,
  gleichungLinearNeu,
  gleichungBeidseitigNeu,
  ausmultiplizierenNeu,
]
export const math8NeuLb2: Topic[] = [laplaceBruchNeu, laplaceProzentNeu, gegenwahrscheinlichkeitNeu]
export const math8NeuLb3: Topic[] = [funktionswertNeu, steigungNeu, achsenabschnittNeu, lgsNeu]
export const math8NeuLb4: Topic[] = [streckfaktorNeu, strahlensatzNeu, aehnlicheSeiteNeu]
export const math8NeuLb5: Topic[] = [zahlenraetselNeu, rueckwaertsNeu]

export const math8NeuTopics: Topic[] = [
  ...math8NeuLb1,
  ...math8NeuLb2,
  ...math8NeuLb3,
  ...math8NeuLb4,
  ...math8NeuLb5,
]
