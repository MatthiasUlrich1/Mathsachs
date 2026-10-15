/**
 * Unique-Runden-Boost für Mathe (Gym + OS/ST/SKS).
 * Nur Rechnung / MC / Zahlen — keine Zuordnung, keine Lückentexte.
 * Kein released:true.
 */
import {
  choicePickTask,
  mixedVariants,
  valueTask,
} from './taskHelpers'
import { shuffle } from './biologieHelpers'
import type { Topic } from './types'
import type { Rng } from '../lib/rng'

const Q = 'Lehrplan Mathematik'
const U = 'https://www.schulportal.sachsen.de/lplandb/'
const fw = (text: string) => ({ text, quelle: Q, url: U })

function hashId(id: string): number {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function nums(id: string, n: number, min: number, max: number): number[] {
  const h = hashId(id)
  const out: number[] = []
  for (let i = 0; i < n; i++) out.push(min + ((h + i * 89) % (max - min + 1)))
  return out
}

function makeMathBoost(topicId: string): Topic['generate'] {
  const id = topicId
  const L = id.toLowerCase()
  const variants: Array<(rng: Rng) => ReturnType<Topic['generate']>> = []

  const addMc = (i: number, q: string, correct: string, wrong: string[], wissen: string) => {
    variants.push((rng) => {
      const cid = `ma:boost:${id}:mc${i}`
      return choicePickTask({
        question: q,
        choices: shuffle(rng, [correct, ...wrong]).slice(0, 4),
        correct,
        solution: correct,
        explanation: wissen,
        fachwissen: fw(wissen),
        dedupeKey: cid,
        contentIds: [cid],
      })
    })
  }

  // Arithmetic core (always) — 6 unique products/sums
  const as_ = nums(id, 6, 6, 48)
  const bs = nums(id + 'b', 6, 2, 12)
  as_.forEach((a, i) => {
    const b = bs[i]!
    const sum = a + b
    const prod = a * b
    variants.push((_rng) =>
      valueTask({
        question: `Berechne: ${a} + ${b}`,
        answerKind: 'integer',
        value: sum,
        solution: String(sum),
        explanation: `${a} + ${b} = ${sum}.`,
        fachwissen: fw('Addition natürlicher/ganzer Zahlen.'),
        dedupeKey: `ma:boost:${id}:add${i}`,
      }),
    )
    variants.push((_rng) =>
      valueTask({
        question: `Berechne: ${a} · ${b}`,
        answerKind: 'integer',
        value: prod,
        solution: String(prod),
        explanation: `${a} · ${b} = ${prod}.`,
        fachwissen: fw('Multiplikation.'),
        dedupeKey: `ma:boost:${id}:mul${i}`,
      }),
    )
  })

  if (/bruch|kuerz|erweit|anteil|prozent|dez/.test(L)) {
    addMc(1, 'Welcher Bruch ist gleich 1/2?', '2/4', ['1/3', '2/5', '3/7'], 'Erweitern/Kürzen ändert den Wert nicht.')
    addMc(2, '25 % als Dezimalzahl?', '0,25', ['2,5', '0,025', '25'], 'Prozent: /100.')
    const ns = nums(id + 'p', 3, 10, 80)
    ns.forEach((n, i) => {
      const p = 10 + (i + 1) * 5
      const val = (n * p) / 100
      variants.push((_rng) =>
        valueTask({
          question: `${p} % von ${n}?`,
          answerKind: val % 1 === 0 ? 'integer' : 'decimal',
          value: val,
          eps: 0.01,
          solution: String(val),
          explanation: `${p}/100 · ${n} = ${val}.`,
          fachwissen: fw('Prozentwert = Prozent / 100 · Grundwert.'),
          dedupeKey: `ma:boost:${id}:pct${i}`,
        }),
      )
    })
  }

  if (/winkel|dreieck|vieleck|geo|umfang|flaeche|volumen|quader|wuerfel|kreis/.test(L)) {
    addMc(3, 'Winkelsumme im Dreieck?', '180°', ['90°', '360°', '270°'], 'Innenwinkelsumme Dreieck = 180°.')
    const ls = nums(id + 'l', 4, 3, 12)
    const ws = nums(id + 'w', 4, 2, 9)
    ls.forEach((l, i) => {
      const w = ws[i]!
      variants.push((_rng) =>
        valueTask({
          question: `Rechteck: Länge ${l} cm, Breite ${w} cm. Umfang in cm?`,
          answerKind: 'integer',
          value: 2 * (l + w),
          solution: String(2 * (l + w)),
          explanation: `U = 2·(${l}+${w}) = ${2 * (l + w)} cm.`,
          fachwissen: fw('Umfang Rechteck U = 2(a+b).'),
          dedupeKey: `ma:boost:${id}:umf${i}`,
        }),
      )
      variants.push((_rng) =>
        valueTask({
          question: `Rechteck: a = ${l} cm, b = ${w} cm. Flächeninhalt in cm²?`,
          answerKind: 'integer',
          value: l * w,
          solution: String(l * w),
          explanation: `A = ${l}·${w} = ${l * w} cm².`,
          fachwissen: fw('Flächeninhalt Rechteck A = a·b.'),
          dedupeKey: `ma:boost:${id}:fl${i}`,
        }),
      )
    })
  }

  if (/gleichung|term|variable|linear|quadrat|wurzel|funktion|ableitung|integral/.test(L)) {
    const xs = nums(id + 'x', 4, 2, 9)
    xs.forEach((x, i) => {
      const a = 2 + (i % 3)
      const b = 3 + i
      const c = a * x + b
      variants.push((_rng) =>
        valueTask({
          question: `Löse: ${a}x + ${b} = ${c}. x = ?`,
          answerKind: 'integer',
          value: x,
          solution: String(x),
          explanation: `${a}x = ${c - b} ⇒ x = ${x}.`,
          fachwissen: fw('Äquivalenzumformung linearer Gleichungen.'),
          dedupeKey: `ma:boost:${id}:eq${i}`,
        }),
      )
    })
    addMc(4, 'Äquivalenzumformung erlaubt u. a. …', 'beide Seiten mit derselben Zahl ≠ 0 multiplizieren', ['nur eine Seite verdoppeln', 'Gleichheitszeichen löschen', 'Variablen streichen'], 'Gleichungen bleiben äquivalent bei beidseitigen Operationen.')
  }

  if (/wahrsch|daten|mittel|median|spannweite|varianz|binom|statistik/.test(L)) {
    addMc(5, 'Mittelwert von 2, 4, 6?', '4', ['3', '6', '12'], '(2+4+6)/3 = 4.')
    const triples = [0, 1, 2, 3].map((i) => nums(id + 'm' + i, 3, 1, 20))
    triples.forEach((t, i) => {
      const mean = (t[0]! + t[1]! + t[2]!) / 3
      variants.push((_rng) =>
        valueTask({
          question: `Mittelwert von ${t.join(', ')}?`,
          answerKind: mean % 1 === 0 ? 'integer' : 'decimal',
          value: mean,
          eps: 0.01,
          solution: String(mean),
          explanation: `(${t.join('+')})/3 = ${mean}.`,
          fachwissen: fw('Arithmetisches Mittel.'),
          dedupeKey: `ma:boost:${id}:mean${i}`,
        }),
      )
    })
  }

  if (/koordinate|graph|funktion|sinus|kosinus|vektor|gerade/.test(L)) {
    addMc(6, 'Punkt (3|−2): x-Koordinate?', '3', ['−2', '0', '5'], 'Erster Wert = x.')
    const xs = nums(id + 'g', 3, -5, 8).map((v) => (v === 0 ? 1 : v))
    xs.forEach((x, i) => {
      const m = 2
      const b = 1
      const y = m * x + b
      variants.push((_rng) =>
        valueTask({
          question: `Gerade y = ${m}x + ${b}. Welches y bei x = ${x}?`,
          answerKind: 'integer',
          value: y,
          solution: String(y),
          explanation: `y = ${m}·${x} + ${b} = ${y}.`,
          fachwissen: fw('Lineare Funktion y = mx + b.'),
          dedupeKey: `ma:boost:${id}:lin${i}`,
        }),
      )
    })
  }

  // Universal MC
  addMc(90, '1 km in m?', '1000', ['100', '10', '10000'], 'Kilo- = 1000.')
  addMc(91, 'Welche Aussage zur Reihenfolge der Operationen stimmt?', 'Punkt vor Strich', ['Strich vor Punkt immer', 'Klammern sind optional wirkungslos', 'Potenzen kommen zuletzt nach Addition'], 'Regel: Klammern → Potenzen → Punkt → Strich.')

  return mixedVariants(...variants)
}

/** Apply calc/MC boost so unique rounds reach 10. */
export function withMathRoundBoost(
  topicId: string,
  base: Topic['generate'] | undefined,
): Topic['generate'] | undefined {
  const boost = makeMathBoost(topicId)
  if (!base) return boost
  return mixedVariants(base, boost, boost)
}
