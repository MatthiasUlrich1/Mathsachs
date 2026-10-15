/**
 * Unique-Runden-Boost für Mathe — NUR themenreine Varianten.
 * Kein universelles „Berechne a+b / a·b“ über alle Topics.
 * Kein TF, keine Zuordnung, keine Lücken. Kein released:true.
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

/** Grade band from topic id — keep numbers age-appropriate. */
function gradeBand(id: string): 'k5k6' | 'k7k10' | 'os' {
  const L = id.toLowerCase()
  if (/k11|k12|jgs|lk|gk|os-k1[01]|st-k1[01]|sks-k1[01]/.test(L)) return 'os'
  if (/k[789]|k10|os-k[789]|st-k[789]|sks-k[789]/.test(L)) return 'k7k10'
  return 'k5k6'
}

function makeMathBoost(topicId: string): Topic['generate'] | undefined {
  const id = topicId
  const L = id.toLowerCase()
  const band = gradeBand(id)
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

  // --- Rechengesetze / Punkt vor Strich / Distributiv (K5+) ---
  if (/rechengesetz|rechenvorteil|term-vorrang|punkt|distribut|kommutativ|assoziativ/.test(L)) {
    const aMax = band === 'k5k6' ? 9 : 12
    const as_ = nums(id, 5, 2, aMax)
    const bs = nums(id + 'b', 5, 2, aMax)
    const cs = nums(id + 'c', 5, 2, 8)
    as_.forEach((a, i) => {
      const b = bs[i]!
      const c = cs[i]!
      const val = a + b * c
      variants.push((_rng) =>
        valueTask({
          question: `Berechne (Punkt vor Strich): ${a} + ${b} · ${c}`,
          answerKind: 'integer',
          value: val,
          solution: String(val),
          explanation: `Zuerst ${b}·${c} = ${b * c}, dann ${a} + ${b * c} = ${val}.`,
          fachwissen: fw('Punktrechnung vor Strichrechnung; Klammern zuerst.'),
          dedupeKey: `ma:boost:${id}:pvs${i}`,
        }),
      )
      const dist = a * (b + c)
      variants.push((_rng) =>
        valueTask({
          question: `Berechne mit Distributivgesetz: ${a} · (${b} + ${c})`,
          answerKind: 'integer',
          value: dist,
          solution: String(dist),
          explanation: `${a}·${b} + ${a}·${c} = ${a * b} + ${a * c} = ${dist}.`,
          fachwissen: fw('Distributivgesetz: a·(b+c) = a·b + a·c.'),
          dedupeKey: `ma:boost:${id}:dist${i}`,
        }),
      )
    })
    addMc(
      1,
      'Welcher Rechenweg nutzt einen Rechenvorteil richtig?',
      '4 · 25 · 7 = (4 · 25) · 7 = 100 · 7',
      ['4 + 25 + 7 ohne Klammern als Vorteil', '7 − 25 · 4', 'Nur 4 + 11 berechnen'],
      'Assoziativ-/Kommutativgesetz: günstige Teilprodukte zuerst.',
    )
  }

  // --- Endliche / periodische Dezimalzahlen ---
  if (/periodisch|period|endlich.*dez|dezimal.*endlich|dezimal.*period/.test(L) || /periodische-dezimal/.test(L)) {
    const finite = [
      { br: '1/2', dez: '0,5' },
      { br: '1/4', dez: '0,25' },
      { br: '1/5', dez: '0,2' },
      { br: '3/4', dez: '0,75' },
      { br: '2/5', dez: '0,4' },
      { br: '1/8', dez: '0,125' },
    ]
    const period = [
      { br: '1/3', dez: '0,333…' },
      { br: '1/6', dez: '0,1666…' },
      { br: '1/9', dez: '0,111…' },
      { br: '2/3', dez: '0,666…' },
      { br: '1/11', dez: '0,0909…' },
    ]
    finite.forEach((row, i) => {
      addMc(
        10 + i,
        `Ist die Dezimalzahl zu ${row.br} endlich oder periodisch?`,
        `endlich (${row.dez})`,
        ['periodisch mit Periode 3', 'weder endlich noch periodisch', 'nur als gemischte Zahl'],
        `Nenner nach Kürzen nur 2 und/oder 5 → endliche Dezimalzahl ${row.dez}.`,
      )
    })
    period.forEach((row, i) => {
      addMc(
        20 + i,
        `Ist die Dezimalzahl zu ${row.br} endlich oder periodisch?`,
        `periodisch (${row.dez})`,
        ['endlich abbrechend', 'keine Dezimaldarstellung', 'nur ganze Zahl'],
        `Andere Primfaktoren im Nenner → periodische Dezimalzahl, z. B. ${row.dez}.`,
      )
    })
    addMc(
      30,
      'Wann entsteht (gekürzt) eine endliche Dezimalzahl?',
      'Wenn der Nenner nur die Primfaktoren 2 und/oder 5 hat',
      [
        'Wenn der Nenner 3 ist',
        'Wenn der Zähler gerade ist',
        'Immer bei unechten Brüchen',
      ],
      'Kriterium für endliche Dezimalbrüche.',
    )
  }

  // --- Brüche / Prozent (nicht periodisch-dezimal) ---
  else if (/bruch|kuerz|erweit|anteil|prozent|mult-brueche|bruch-mul/.test(L) && !/period/.test(L)) {
    addMc(1, 'Welcher Bruch ist gleich 1/2?', '2/4', ['1/3', '2/5', '3/7'], 'Erweitern/Kürzen ändert den Wert nicht.')
    // Bruch·Bruch — nie Bare-Integer „a · b“
    const fracs = [
      [1, 3, 1, 4],
      [2, 5, 1, 3],
      [3, 4, 1, 2],
      [1, 5, 2, 3],
    ] as const
    fracs.forEach(([n1, d1, n2, d2], i) => {
      const num = n1 * n2
      const den = d1 * d2
      addMc(
        40 + i,
        `Berechne das Produkt der Brüche: ${n1}/${d1} · ${n2}/${d2}`,
        `${num}/${den}`,
        [`${n1 + n2}/${d1 + d2}`, `${num}/${d1}`, `${n1}/${den}`],
        `Zähler·Zähler und Nenner·Nenner: ${n1}·${n2}/${d1}·${d2} = ${num}/${den}.`,
      )
    })
    if (!/k5|os-k5|st-k5|sks-k5/.test(L) || /prozent|anteil/.test(L)) {
      addMc(2, '25 % als Dezimalzahl?', '0,25', ['2,5', '0,025', '25'], 'Prozent: Teilen durch 100.')
      const ns = nums(id + 'p', 3, band === 'k5k6' ? 10 : 20, band === 'k5k6' ? 40 : 80)
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
  }

  // --- Geometrie ---
  if (/winkel|dreieck|vieleck|geo|umfang|flaeche|volumen|quader|wuerfel|kreis/.test(L)) {
    addMc(3, 'Winkelsumme im Dreieck?', '180°', ['90°', '360°', '270°'], 'Innenwinkelsumme Dreieck = 180°.')
    const lMax = band === 'k5k6' ? 10 : 14
    const ls = nums(id + 'l', 4, 3, lMax)
    const ws = nums(id + 'w', 4, 2, band === 'k5k6' ? 8 : 10)
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

  // --- Gleichungen / Terme (nicht reine Rechengesetze-K5) ---
  if (
    /gleichung|variable|linear|quadrat|wurzel|funktion|ableitung|integral/.test(L) &&
    !/rechengesetz|rechenvorteil/.test(L)
  ) {
    if (band === 'k5k6' && /ableitung|integral|quadrat/.test(L)) {
      // keine OS-Analysis in Sek-I-IDs
    } else {
      const xMax = band === 'os' ? 12 : 9
      const xs = nums(id + 'x', 4, 2, xMax)
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
    }
  }

  // --- Statistik ---
  if (/wahrsch|daten|mittel|median|spannweite|varianz|binom|statistik/.test(L)) {
    addMc(5, 'Mittelwert von 2, 4, 6?', '4', ['3', '6', '12'], '(2+4+6)/3 = 4.')
    const hi = band === 'k5k6' ? 12 : 20
    const triples = [0, 1, 2, 3].map((i) => nums(id + 'm' + i, 3, 1, hi))
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

  // --- Koordinaten / lineare Graphen ---
  if (/koordinate|graph|sinus|kosinus|vektor|gerade/.test(L) || (/funktion/.test(L) && band !== 'k5k6')) {
    addMc(6, 'Punkt (3|−2): x-Koordinate?', '3', ['−2', '0', '5'], 'Erster Wert = x.')
    if (band !== 'k5k6') {
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
  }

  // --- Nur echte Natürliche-Zahlen-Themen: einfache + / · ---
  // Nicht: gebrochen/rational/spiele/dezimal/prozent (sonst Themenfremd).
  // Nur echte Natürliche-Zahlen-IDs (Ende der ID) — nie Teilstring in os-k6-lb1-add-sub.
  const naturalArithId =
    /(?:^|-)lb1-(?:addition|subtraktion|multiplikation|schriftliches-rechnen)$/.test(L) ||
    /(?:^|-)(?:os|st|sks)-k5-lb1-(?:add|sub|mul)$/.test(L) ||
    /schriftliches-rechnen$|kopfrechnen$/.test(L)
  if (naturalArithId) {
    const aMax = band === 'k5k6' ? 40 : 60
    const as_ = nums(id, 4, 6, aMax)
    const bs = nums(id + 'b', 4, 2, 12)
    as_.forEach((a, i) => {
      const b = bs[i]!
      variants.push((_rng) =>
        valueTask({
          question: `Berechne: ${a} + ${b}`,
          answerKind: 'integer',
          value: a + b,
          solution: String(a + b),
          explanation: `${a} + ${b} = ${a + b}.`,
          fachwissen: fw('Addition natürlicher Zahlen.'),
          dedupeKey: `ma:boost:${id}:add${i}`,
        }),
      )
      variants.push((_rng) =>
        valueTask({
          question: `Berechne: ${a} · ${b}`,
          answerKind: 'integer',
          value: a * b,
          solution: String(a * b),
          explanation: `${a} · ${b} = ${a * b}.`,
          fachwissen: fw('Multiplikation natürlicher Zahlen.'),
          dedupeKey: `ma:boost:${id}:mul${i}`,
        }),
      )
    })
  }

  if (variants.length === 0) return undefined
  return mixedVariants(...variants)
}

/**
 * Boost nur bei themenpassender Familie.
 * Kein Boost → Base unverändert (kein themenfremdes Auffüllen).
 */
export function withMathRoundBoost(
  topicId: string,
  base: Topic['generate'] | undefined,
): Topic['generate'] | undefined {
  const boost = makeMathBoost(topicId)
  if (!boost) return base
  if (!base) return boost
  // Base dominiert — Boost nur zur Pool-Erweiterung, nicht 2/3 der Runde.
  return mixedVariants(base, base, base, boost)
}
