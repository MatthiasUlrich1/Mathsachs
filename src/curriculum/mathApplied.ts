/**
 * Mathematik: themenreine Anwendungs- und Rechengeneratoren (konkrete Zahlen, keine Begriffsabfragen).
 * Antwortoptionen werden normalisiert dedupliziert (siehe `.cursor/rules/curriculum-aufgaben-qualitaet.mdc`).
 */
import { formatDe, roundTo } from '../lib/num'
import { gcd, makeFraction } from '../lib/fraction'
import { pick, randInt, type Rng } from '../lib/rng'
import { normalizeOptionText, numericOptionValue } from './contentAudit'
import { choicePickTask, fractionTask, mixedVariants, multiSelectTask, valueTask } from './taskHelpers'
import type { Fachwissen, Task, Topic } from './types'

// ---------------------------------------------------------------------------
// Hilfen
// ---------------------------------------------------------------------------

export const shuffleArr = <T,>(rng: Rng, arr: readonly T[]): T[] => {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

/** Gleichwertige Optionen (Schreibweise, Wert) bekommen denselben Schlüssel. */
export const optionKey = (s: string): string => {
  const v = numericOptionValue(s)
  return v === null ? `t:${normalizeOptionText(s)}` : `n:${roundTo(v, 9)}`
}

/** Entfernt Distraktoren, die (normalisiert) der Lösung oder einander gleichen. */
export const distinctDistractors = (correct: string, candidates: string[], max = 3): string[] => {
  const seen = new Set([optionKey(correct)])
  const out: string[] = []
  for (const c of candidates) {
    const k = optionKey(c)
    if (seen.has(k)) continue
    seen.add(k)
    out.push(c)
    if (out.length === max) break
  }
  return out
}

interface AppliedMc {
  question: string
  correct: string
  distractors: string[]
  explanation: string
  fachwissen: Fachwissen
  dedupeKey: string
  /** Zusätzliche Identitäten, z. B. „gleicher Sachverhalt höchstens einmal pro Runde“. */
  contentIds?: string[]
  visualContent?: string
  instruction?: string
}

export const appliedMc = (rng: Rng, o: AppliedMc): Task => {
  const wrong = distinctDistractors(o.correct, o.distractors)
  if (wrong.length < 2) throw new Error(`appliedMc: zu wenige verschiedene Distraktoren — ${o.question}`)
  return choicePickTask({
    question: o.question,
    choices: shuffleArr(rng, [o.correct, ...wrong]),
    correct: o.correct,
    solution: o.correct,
    explanation: o.explanation,
    fachwissen: o.fachwissen,
    dedupeKey: o.dedupeKey,
    contentIds: [o.dedupeKey, ...(o.contentIds ?? [])],
    visualContent: o.visualContent,
    instruction: o.instruction,
  })
}

const minus = (n: number): string => (n < 0 ? `−${formatDe(-n)}` : formatDe(n))
const pt = (x: number, y: number): string => `(${minus(x)}|${minus(y)})`
/** „+ 3“ / „− 3“ für Terme. */
const signed = (n: number): string => (n < 0 ? `− ${formatDe(-n)}` : `+ ${formatDe(n)}`)
const setStr = (xs: number[]): string => (xs.length ? `{${[...xs].sort((a, b) => a - b).join(', ')}}` : '{ } (leere Menge)')
const range = (a: number, b: number): number[] => Array.from({ length: b - a + 1 }, (_, i) => a + i)

const WIKI = (title: string, slug: string) => ({ quelle: `Wikipedia: ${title}`, url: `https://de.wikipedia.org/wiki/${slug}` })

// ---------------------------------------------------------------------------
// K5 LB3 — Drehung als Bewegung
// ---------------------------------------------------------------------------

const FW_DREHUNG: Fachwissen = {
  text: 'Bei einer Drehung um ein Zentrum Z bleibt jeder Punkt gleich weit von Z entfernt und wird um denselben Drehwinkel weitergedreht. Eine Vierteldrehung (90°) gegen den Uhrzeigersinn macht aus dem Weg „a nach rechts, b nach oben“ von Z aus den Weg „b nach links, a nach oben“. Bei 180° zeigt der Weg genau in die Gegenrichtung.',
  ...WIKI('Drehung (Mathematik)', 'Drehung_(Mathematik)'),
}
const FW_UHR: Fachwissen = {
  text: 'Der Minutenzeiger dreht sich in 60 Minuten einmal ganz herum, also um 360°; in einer Minute sind das 6°. Der Stundenzeiger braucht für eine volle Drehung 12 Stunden und dreht sich daher in einer Stunde um 30°.',
  ...WIKI('Uhr', 'Uhr'),
}
const FW_DREHSYM: Fachwissen = {
  text: 'Eine Figur ist drehsymmetrisch, wenn sie nach einer Drehung um ihren Mittelpunkt um einen Winkel kleiner als 360° wieder genau auf sich selbst fällt. Bei einem regelmäßigen n-Eck ist der kleinste solche Winkel 360° : n.',
  ...WIKI('Drehsymmetrie', 'Drehsymmetrie'),
}

const DREH_FIGUREN: Array<[string, number]> = [
  ['ein gleichseitiges Dreieck', 120],
  ['ein Quadrat', 90],
  ['ein Rechteck, das kein Quadrat ist,', 180],
  ['ein regelmäßiges Sechseck', 60],
  ['ein regelmäßiges Achteck', 45],
  ['ein regelmäßiges Fünfeck', 72],
]

export const generateDrehungK5 = mixedVariants(
  (rng) => {
    const cx = randInt(rng, 4, 6)
    const cy = randInt(rng, 4, 6)
    let dx = 0
    let dy = 0
    while (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) {
      dx = randInt(rng, -3, 3)
      dy = randInt(rng, -3, 3)
    }
    const kind = pick(rng, ['ccw', 'cw', '180'] as const)
    const ccw = pt(cx - dy, cy + dx)
    const cw = pt(cx + dy, cy - dx)
    const half = pt(cx - dx, cy - dy)
    const correct = kind === 'ccw' ? ccw : kind === 'cw' ? cw : half
    const desc = kind === 'ccw' ? 'um 90° gegen den Uhrzeigersinn' : kind === 'cw' ? 'um 90° im Uhrzeigersinn' : 'um 180°'
    const P = pt(cx + dx, cy + dy)
    return appliedMc(rng, {
      question: `Der Punkt P${P} wird ${desc} um das Zentrum Z${pt(cx, cy)} gedreht. Welche Koordinaten hat der Bildpunkt P′?`,
      correct,
      distractors: [ccw, cw, half, pt(cx + dx, cy - dy), pt(cx - dx, cy + dy)],
      explanation: `Von Z aus geht man zu P ${dx > 0 ? `${dx} nach rechts` : `${-dx} nach links`} und ${dy > 0 ? `${dy} nach oben` : `${-dy} nach unten`}. Nach der Drehung ${desc} liegt P′ bei ${correct}.`,
      fachwissen: FW_DREHUNG,
      dedupeKey: `ma:k5:dreh:pt:${cx},${cy}:${dx},${dy}:${kind}`,
    })
  },
  (rng) => {
    if (rng() < 0.5) {
      const min = 5 * randInt(rng, 1, 11)
      return valueTask({
        question: `Der Minutenzeiger einer Uhr läuft ${min} Minuten weiter. Um wie viel Grad hat er sich gedreht?`,
        unit: '°',
        answerKind: 'integer',
        value: 6 * min,
        solution: `${6 * min}°`,
        explanation: `In einer Minute dreht sich der Minutenzeiger um 360° : 60 = 6°. ${min} · 6° = ${6 * min}°.`,
        fachwissen: FW_UHR,
        dedupeKey: `ma:k5:dreh:min:${min}`,
      })
    }
    const from = randInt(rng, 1, 8)
    const to = randInt(rng, from + 1, Math.min(12, from + 8))
    const deg = 30 * (to - from)
    return valueTask({
      question: `Der Stundenzeiger einer Uhr zeigt zuerst auf ${from} Uhr, später auf ${to} Uhr. Um wie viel Grad hat er sich gedreht?`,
      unit: '°',
      answerKind: 'integer',
      value: deg,
      solution: `${deg}°`,
      explanation: `Zwischen zwei Stundenzahlen liegen 360° : 12 = 30°. Von ${from} bis ${to} Uhr sind es ${to - from} Stunden: ${to - from} · 30° = ${deg}°.`,
      fachwissen: FW_UHR,
      dedupeKey: `ma:k5:dreh:std:${from}:${to}`,
    })
  },
  (rng) => {
    const [fig, ang] = pick(rng, DREH_FIGUREN)
    return valueTask({
      question: `Um welchen kleinsten Winkel (größer als 0°) muss man ${fig} um seinen Mittelpunkt drehen, damit es wieder genau auf sich selbst fällt?`,
      unit: '°',
      answerKind: 'integer',
      value: ang,
      solution: `${ang}°`,
      explanation: `Die Figur fällt nach ${360 / ang} gleich großen Teildrehungen wieder auf ihre Ausgangslage; 360° : ${360 / ang} = ${ang}°.`,
      fachwissen: FW_DREHSYM,
      dedupeKey: `ma:k5:dreh:sym:${ang}`,
    })
  },
  (rng) => {
    const a = 15 * randInt(rng, 1, 10)
    const b = 15 * randInt(rng, 1, 10)
    const total = (a + b) % 360
    return valueTask({
      question: `Eine Figur wird um ${a}° und danach um weitere ${b}° gedreht (gleiches Zentrum, gleiche Richtung). Um welchen Winkel zwischen 0° und 360° hätte man sie auf einmal drehen können?`,
      unit: '°',
      answerKind: 'integer',
      value: total,
      solution: `${total}°`,
      explanation: `Zwei Drehungen um dasselbe Zentrum und in dieselbe Richtung ergeben zusammen ${a}° + ${b}° = ${a + b}°${a + b >= 360 ? `; eine volle Drehung (360°) ändert nichts, also ${total}°` : ''}.`,
      fachwissen: FW_DREHUNG,
      dedupeKey: `ma:k5:dreh:summe:${Math.min(a, b)}:${Math.max(a, b)}`,
    })
  },
)

// ---------------------------------------------------------------------------
// K5 LB4 — Quader: Ansichten und Netz
// ---------------------------------------------------------------------------

const FW_ANSICHT: Fachwissen = {
  text: 'Die Vorderansicht zeigt einen Quader von vorn: man sieht seine Länge und seine Höhe. Die Draufsicht (von oben) zeigt Länge und Breite, die Seitenansicht (von links oder rechts) Breite und Höhe. Jede Ansicht ist ein Rechteck aus zwei der drei Kantenlängen.',
  ...WIKI('Dreitafelprojektion', 'Dreitafelprojektion'),
}
const FW_NETZ: Fachwissen = {
  text: 'Ein Quadernetz besteht aus sechs Rechtecken, von denen je zwei gegenüberliegende gleich groß sind. Legt man Vorderseite, Grundfläche, Rückseite und Deckfläche in einer Reihe nebeneinander, so wechseln sich Höhe und Breite des Quaders ab.',
  ...WIKI('Quader', 'Quader'),
}

const threeDistinct = (rng: Rng, lo: number, hi: number): [number, number, number] => {
  const xs = shuffleArr(rng, range(lo, hi)).slice(0, 3)
  return [xs[0]!, xs[1]!, xs[2]!]
}

export const generateQuaderAnsichtenK5 = mixedVariants(
  (rng) => {
    const [l, b, h] = threeDistinct(rng, 2, 9)
    const view = pick(rng, ['Vorderansicht', 'Draufsicht', 'Seitenansicht'] as const)
    const r = (x: number, y: number) => `${x} cm × ${y} cm`
    const all = { Vorderansicht: r(l, h), Draufsicht: r(l, b), Seitenansicht: r(b, h) }
    return appliedMc(rng, {
      question: `Ein Quader ist ${l} cm lang, ${b} cm breit und ${h} cm hoch und steht auf dem Tisch. Welche Maße hat das Rechteck der ${view}?`,
      correct: all[view],
      distractors: [all.Vorderansicht, all.Draufsicht, all.Seitenansicht, r(l, l), r(h, h)],
      explanation: `${view === 'Vorderansicht' ? 'Von vorn sieht man Länge und Höhe' : view === 'Draufsicht' ? 'Von oben sieht man Länge und Breite' : 'Von der Seite sieht man Breite und Höhe'}: ${all[view]}.`,
      fachwissen: FW_ANSICHT,
      dedupeKey: `ma:k5:ansicht:${l}:${b}:${h}:${view}`,
    })
  },
  (rng) => {
    const [l, b, h] = threeDistinct(rng, 2, 9)
    const len = 2 * (h + b)
    return valueTask({
      question: `Für das Netz eines Quaders (Länge ${l} cm, Breite ${b} cm, Höhe ${h} cm) legst du Vorderseite, Grundfläche, Rückseite und Deckfläche in einer Reihe aneinander. Die Länge ${l} cm liegt quer. Wie lang ist diese Reihe?`,
      unit: 'cm',
      answerKind: 'integer',
      value: len,
      solution: `${len} cm`,
      explanation: `In der Reihe wechseln sich Höhe und Breite ab: ${h} + ${b} + ${h} + ${b} = ${len} cm.`,
      fachwissen: FW_NETZ,
      dedupeKey: `ma:k5:netzreihe:${l}:${b}:${h}`,
    })
  },
  (rng) => {
    const [l, b, h] = threeDistinct(rng, 2, 9)
    const v = l * b * h
    return valueTask({
      question: `Die Vorderansicht eines Quaders ist ein Rechteck ${l} cm × ${h} cm, die Draufsicht ein Rechteck ${l} cm × ${b} cm. Wie groß ist das Volumen des Quaders?`,
      unit: 'cm³',
      answerKind: 'integer',
      value: v,
      solution: `${v} cm³`,
      explanation: `Aus den Ansichten liest man Länge ${l} cm, Höhe ${h} cm und Breite ${b} cm ab. V = ${l} · ${b} · ${h} = ${v} cm³.`,
      fachwissen: FW_ANSICHT,
      dedupeKey: `ma:k5:ansicht-vol:${l}:${b}:${h}`,
    })
  },
)

// ---------------------------------------------------------------------------
// K6 LB1 — Element, Menge, Teilmenge
// ---------------------------------------------------------------------------

const divisors = (n: number) => range(1, n).filter((d) => n % d === 0)
const isPrimeN = (n: number) => n > 1 && range(2, Math.floor(Math.sqrt(n))).every((d) => n % d !== 0)

const FW_MENGE: Fachwissen = {
  text: 'Eine Menge fasst Objekte zusammen, die man ihre Elemente nennt; man schreibt sie in geschweiften Klammern, z. B. {1, 2, 3}. „a ∈ M“ heißt: a ist Element von M. Eine Menge A ist Teilmenge von B (A ⊆ B), wenn jedes Element von A auch in B liegt.',
  ...WIKI('Menge (Mathematik)', 'Menge_(Mathematik)'),
}

interface NumSet {
  name: string
  elems: number[]
}

const randomNumSet = (rng: Rng): NumSet => {
  const kind = pick(rng, ['teiler', 'vielfache', 'prim'] as const)
  if (kind === 'teiler') {
    const n = pick(rng, [12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48])
    return { name: `T${n} = {Teiler von ${n}}`, elems: divisors(n) }
  }
  if (kind === 'vielfache') {
    const k = randInt(rng, 3, 9)
    const m = k * randInt(rng, 5, 8) + randInt(rng, 1, k - 1)
    return { name: `V = {Vielfache von ${k}, die kleiner als ${m} sind}`, elems: range(1, m - 1).filter((x) => x % k === 0) }
  }
  const m = randInt(rng, 20, 40)
  return { name: `P = {Primzahlen kleiner als ${m}}`, elems: range(2, m - 1).filter(isPrimeN) }
}

export const generateMengenK6 = mixedVariants(
  (rng) => {
    const s = randomNumSet(rng)
    const max = Math.max(...s.elems)
    const non = shuffleArr(rng, range(2, max + 4).filter((x) => !s.elems.includes(x)))
    const asElem = rng() < 0.6
    const correct = asElem ? pick(rng, s.elems) : non[0]!
    const wrong = asElem ? non.slice(0, 6) : shuffleArr(rng, s.elems)
    return appliedMc(rng, {
      question: `Gegeben ist die Menge ${s.name}. Welche Zahl ist ${asElem ? '' : 'k'}ein Element dieser Menge?`,
      correct: String(correct),
      distractors: wrong.map(String),
      explanation: `${s.name.split(' = ')[0]} = ${setStr(s.elems)}. ${asElem ? `${correct} ∈ ${s.name.split(' = ')[0]}` : `${correct} ∉ ${s.name.split(' = ')[0]}`}.`,
      fachwissen: FW_MENGE,
      dedupeKey: `ma:k6:menge:elem:${s.name}:${correct}:${asElem}`,
    })
  },
  (rng) => {
    const s = randomNumSet(rng)
    return valueTask({
      question: `Wie viele Elemente hat die Menge ${s.name}?`,
      answerKind: 'integer',
      value: s.elems.length,
      solution: String(s.elems.length),
      explanation: `${s.name.split(' = ')[0]} = ${setStr(s.elems)} — das sind ${s.elems.length} Elemente.`,
      fachwissen: FW_MENGE,
      dedupeKey: `ma:k6:menge:anzahl:${s.name}`,
    })
  },
  (rng) => {
    const n = pick(rng, [12, 18, 20, 24, 30, 36])
    const t = divisors(n)
    const sub = shuffleArr(rng, t).slice(0, 3)
    const outside = shuffleArr(rng, range(2, n).filter((x) => !t.includes(x)))
    const wrong = [0, 1, 2, 3].map((i) => {
      const base = shuffleArr(rng, t).slice(0, 2)
      return setStr([...base, outside[i % outside.length]!])
    })
    return appliedMc(rng, {
      question: `Es ist T${n} = ${setStr(t)}. Welche Menge ist eine Teilmenge von T${n}?`,
      correct: setStr(sub),
      distractors: wrong,
      explanation: `Alle Elemente von ${setStr(sub)} sind Teiler von ${n}. In den anderen Mengen steckt jeweils eine Zahl, die kein Teiler von ${n} ist.`,
      fachwissen: FW_MENGE,
      dedupeKey: `ma:k6:menge:teilmenge:${n}:${setStr(sub)}`,
    })
  },
  (rng) => {
    const k = randInt(rng, 3, 9)
    const multiples = range(2, 12).map((i) => k * i)
    const good = shuffleArr(rng, multiples).slice(0, randInt(rng, 2, 3))
    const bad = shuffleArr(
      rng,
      range(k + 1, 12 * k).filter((x) => x % k !== 0),
    ).slice(0, 6 - good.length)
    const choices = [...good, ...bad].map(String)
    return multiSelectTask({
      question: `Tippe alle Zahlen an, die Element der Menge V${k} = {Vielfache von ${k}} sind.`,
      choices,
      correct: good.map(String),
      solution: setStr(good),
      explanation: `${good.join(', ')} sind durch ${k} teilbar; ${bad.join(', ')} nicht.`,
      instruction: 'Tippe alle zutreffenden Zahlen an:',
      fachwissen: FW_MENGE,
      dedupeKey: `ma:k6:menge:multi:${k}:${setStr(good)}:${setStr(bad)}`,
    })
  },
)

// ---------------------------------------------------------------------------
// K6 LB2 — Zuordnungen: Darstellen und Eindeutigkeit
// ---------------------------------------------------------------------------

const FW_EINDEUTIG: Fachwissen = {
  text: 'Eine Zuordnung heißt eindeutig, wenn jedem Ausgangswert x genau ein Wert y zugeordnet wird. In einer Wertetabelle darf dann kein x-Wert mit zwei verschiedenen y-Werten vorkommen; gleiche y-Werte für verschiedene x sind dagegen erlaubt.',
  ...WIKI('Zuordnung (Mathematik)', 'Zuordnung_(Mathematik)'),
}
const FW_REGEL: Fachwissen = {
  text: 'Wächst y bei jedem Schritt von x um 1 immer um denselben Betrag, so lässt sich die Zuordnung mit einer festen Regel beschreiben: y = Schrittweite · x + Startwert. Mit dieser Regel kann man fehlende Werte der Tabelle berechnen.',
  ...WIKI('Zuordnung (Mathematik)', 'Zuordnung_(Mathematik)'),
}

const pairsStr = (ps: Array<[number, number]>) => ps.map(([x, y]) => `(${x}|${y})`).join(', ')

export const generateZuordnungK6 = mixedVariants(
  (rng) => {
    const xs = shuffleArr(rng, range(1, 9)).slice(0, 4).sort((a, b) => a - b)
    const ys = () => xs.map(() => randInt(rng, 2, 20))
    const good = xs.map((x, i) => [x, ys()[i]!] as [number, number])
    const bads = [0, 1, 2, 3].map(() => {
      const yv = ys()
      const ps = xs.map((x, i) => [x, yv[i]!] as [number, number])
      const dup = randInt(rng, 0, 2)
      ps[dup + 1] = [ps[dup]![0], ps[dup]![1] + randInt(rng, 1, 5)]
      return pairsStr(ps)
    })
    return appliedMc(rng, {
      question: 'Welche Wertepaare (x|y) beschreiben eine eindeutige Zuordnung?',
      correct: pairsStr(good),
      distractors: bads,
      explanation: `Nur bei ${pairsStr(good)} kommt jeder x-Wert genau einmal vor. In den anderen Listen hat ein x-Wert zwei verschiedene y-Werte.`,
      fachwissen: FW_EINDEUTIG,
      dedupeKey: `ma:k6:zuord:eindeutig:${pairsStr(good)}`,
    })
  },
  (rng) => {
    const a = randInt(rng, 2, 7)
    const b = randInt(rng, 1, 9)
    const k = randInt(rng, 5, 12)
    const y = a * k + b
    return valueTask({
      question: `Die Wertepaare (1|${a + b}), (2|${2 * a + b}), (3|${3 * a + b}) gehören zu derselben Zuordnung, bei der y immer um denselben Betrag wächst. Welcher y-Wert gehört zu x = ${k}?`,
      answerKind: 'integer',
      value: y,
      solution: String(y),
      explanation: `y wächst je Schritt um ${a}; bei x = 0 wäre y = ${b}. Also y = ${a} · ${k} + ${b} = ${y}.`,
      fachwissen: FW_REGEL,
      dedupeKey: `ma:k6:zuord:regel:${a}:${b}:${k}`,
    })
  },
  (rng) => {
    const a = randInt(rng, 2, 6)
    const b = randInt(rng, 1, 8)
    const x = randInt(rng, 4, 12)
    const y = a * x + b
    return valueTask({
      question: `Ein Taxi kostet ${b} € Grundgebühr und ${a} € je Kilometer. Für eine Fahrt bezahlt man ${y} €. Wie viele Kilometer war die Fahrt lang?`,
      unit: 'km',
      answerKind: 'integer',
      value: x,
      solution: `${x} km`,
      explanation: `${y} € − ${b} € Grundgebühr = ${y - b} €; ${y - b} € : ${a} € je km = ${x} km.`,
      fachwissen: FW_REGEL,
      dedupeKey: `ma:k6:zuord:taxi:${a}:${b}:${x}`,
    })
  },
)

// ---------------------------------------------------------------------------
// K6 LB3 — Besondere Linien im Dreieck
// ---------------------------------------------------------------------------

const FW_HOEHE: Fachwissen = {
  text: 'Die Höhe eines Dreiecks ist die senkrechte Strecke von einer Ecke auf die gegenüberliegende Seite (oder deren Verlängerung). Mit Grundseite g und zugehöriger Höhe h gilt für den Flächeninhalt A = g · h : 2.',
  ...WIKI('Höhe (Geometrie)', 'Höhe_(Geometrie)'),
}
const FW_MS: Fachwissen = {
  text: 'Die Mittelsenkrechte einer Strecke AB steht senkrecht auf AB und geht durch deren Mittelpunkt. Jeder Punkt der Mittelsenkrechten ist von A und B gleich weit entfernt.',
  ...WIKI('Mittelsenkrechte', 'Mittelsenkrechte'),
}
const FW_WH: Fachwissen = {
  text: 'Die Winkelhalbierende teilt einen Winkel in zwei gleich große Teilwinkel. Jeder ihrer Punkte hat von den beiden Schenkeln den gleichen Abstand; die drei Winkelhalbierenden eines Dreiecks schneiden sich im Inkreismittelpunkt.',
  ...WIKI('Winkelhalbierende', 'Winkelhalbierende'),
}
const FW_SH: Fachwissen = {
  text: 'Eine Seitenhalbierende verbindet eine Ecke des Dreiecks mit dem Mittelpunkt der gegenüberliegenden Seite. Sie teilt diese Seite in zwei gleich lange Teile; die drei Seitenhalbierenden schneiden sich im Schwerpunkt.',
  ...WIKI('Seitenhalbierende', 'Seitenhalbierende'),
}

export const generateBesondereLinienK6 = mixedVariants(
  (rng) => {
    const g = randInt(rng, 4, 14)
    const h = randInt(rng, 3, 12)
    const A = (g * h) / 2
    return valueTask({
      question: `Ein Dreieck hat die Seite c = ${g} cm und den Flächeninhalt A = ${formatDe(A)} cm². Wie lang ist die Höhe h_c?`,
      unit: 'cm',
      answerKind: 'decimal',
      value: h,
      solution: `${h} cm`,
      explanation: `A = c · h_c : 2, also h_c = 2 · A : c = 2 · ${formatDe(A)} : ${g} = ${h} cm.`,
      fachwissen: FW_HOEHE,
      dedupeKey: `ma:k6:linien:hoehe:${g}:${h}`,
    })
  },
  (rng) => {
    const horizontal = rng() < 0.5
    const a = randInt(rng, 0, 6)
    const len = 2 * randInt(rng, 2, 5)
    const c = randInt(rng, 1, 8)
    const A = horizontal ? [a, c] : [c, a]
    const B = horizontal ? [a + len, c] : [c, a + len]
    const M = horizontal ? [a + len / 2, c] : [c, a + len / 2]
    const correct = pt(M[0]!, M[1]!)
    return appliedMc(rng, {
      question: `Gegeben sind A${pt(A[0]!, A[1]!)} und B${pt(B[0]!, B[1]!)}. In welchem Punkt schneidet die Mittelsenkrechte von AB die Strecke AB?`,
      correct,
      distractors: horizontal
        ? [pt(M[0]! + 1, c), pt(len, c), pt(M[0]!, c + len / 2), pt(M[0]! - 1, c)]
        : [pt(c, M[1]! + 1), pt(c, len), pt(c + len / 2, M[1]!), pt(c, M[1]! - 1)],
      explanation: `Die Mittelsenkrechte geht durch den Mittelpunkt von AB: ${correct}.`,
      fachwissen: FW_MS,
      dedupeKey: `ma:k6:linien:ms:${A.join(',')}:${B.join(',')}`,
    })
  },
  (rng) => {
    const alpha = 2 * randInt(rng, 13, 70)
    return valueTask({
      question: `Im Dreieck ABC ist α = ${alpha}°. Die Winkelhalbierende von α teilt den Winkel in zwei Teile. Wie groß ist einer dieser Teilwinkel?`,
      unit: '°',
      answerKind: 'integer',
      value: alpha / 2,
      solution: `${alpha / 2}°`,
      explanation: `${alpha}° : 2 = ${alpha / 2}°.`,
      fachwissen: FW_WH,
      dedupeKey: `ma:k6:linien:wh:${alpha}`,
    })
  },
  (rng) => {
    const a10 = randInt(rng, 41, 149)
    const a = a10 / 10
    const half = roundTo(a / 2, 2)
    return valueTask({
      question: `Im Dreieck ABC ist die Seite a = BC = ${formatDe(a)} cm lang. Die Seitenhalbierende s_a trifft BC im Punkt M. Wie lang ist die Strecke BM?`,
      unit: 'cm',
      answerKind: 'decimal',
      value: half,
      solution: `${formatDe(half)} cm`,
      explanation: `M ist der Mittelpunkt von BC: ${formatDe(a)} cm : 2 = ${formatDe(half)} cm.`,
      fachwissen: FW_SH,
      dedupeKey: `ma:k6:linien:sh:${a10}`,
    })
  },
  (rng) => {
    const d = randInt(rng, 3, 15)
    const ab = randInt(rng, 2, 2 * d - 1)
    return valueTask({
      question: `Die Strecke AB ist ${ab} cm lang. Der Punkt P liegt auf der Mittelsenkrechten von AB und ist ${d} cm von A entfernt. Wie weit ist P von B entfernt?`,
      unit: 'cm',
      answerKind: 'integer',
      value: d,
      solution: `${d} cm`,
      explanation: `Jeder Punkt der Mittelsenkrechten ist von A und B gleich weit entfernt, also PB = PA = ${d} cm (die Länge von AB spielt dafür keine Rolle).`,
      fachwissen: FW_MS,
      dedupeKey: `ma:k6:linien:ms-abstand:${ab}:${d}`,
    })
  },
)

// ---------------------------------------------------------------------------
// K6 LB4 — Prismen in Kavalierperspektive
// ---------------------------------------------------------------------------

const FW_KAVALIER: Fachwissen = {
  text: 'In der Kavalierperspektive werden alle Strecken der Vorderfläche in wahrer Größe gezeichnet. Die nach hinten verlaufenden Kanten zeichnet man unter 45° zur Waagerechten und auf die Hälfte verkürzt; verdeckte Kanten werden gestrichelt.',
  ...WIKI('Kavalierperspektive', 'Kavalierperspektive'),
}
const FW_PRISMA: Fachwissen = {
  text: 'Ein Prisma mit einem n-Eck als Grundfläche hat zwei deckungsgleiche n-Ecke (Grund- und Deckfläche) und n rechteckige Seitenflächen. Es hat 2n Ecken und 3n Kanten: n in der Grundfläche, n in der Deckfläche und n Seitenkanten.',
  ...WIKI('Prisma (Geometrie)', 'Prisma_(Geometrie)'),
}
const N_ECK: Record<number, string> = { 3: 'Dreieck', 4: 'Viereck', 5: 'Fünfeck', 6: 'Sechseck', 7: 'Siebeneck', 8: 'Achteck' }

export const generateKavalierK6 = mixedVariants(
  (rng) => {
    const t = randInt(rng, 3, 17)
    if (rng() < 0.5) {
      return valueTask({
        question: `Ein Prisma ist ${t} cm tief. Du zeichnest es in Kavalierperspektive mit der Grundfläche vorn. Wie lang zeichnest du die nach hinten verlaufenden Kanten?`,
        unit: 'cm',
        answerKind: 'decimal',
        value: t / 2,
        solution: `${formatDe(t / 2)} cm`,
        explanation: `Nach hinten verlaufende Kanten werden auf die Hälfte verkürzt: ${t} cm : 2 = ${formatDe(t / 2)} cm.`,
        fachwissen: FW_KAVALIER,
        dedupeKey: `ma:k6:kav:tiefe:${t}`,
      })
    }
    const z = t / 2
    return valueTask({
      question: `In einer Zeichnung in Kavalierperspektive ist eine nach hinten verlaufende Kante ${formatDe(z)} cm lang. Wie lang ist diese Kante am echten Körper?`,
      unit: 'cm',
      answerKind: 'decimal',
      value: t,
      solution: `${t} cm`,
      explanation: `Die Kante wurde auf die Hälfte verkürzt gezeichnet: ${formatDe(z)} cm · 2 = ${t} cm.`,
      fachwissen: FW_KAVALIER,
      dedupeKey: `ma:k6:kav:wahr:${t}`,
    })
  },
  (rng) => {
    const n = randInt(rng, 3, 8)
    const what = pick(rng, ['Kanten', 'Ecken', 'Flächen'] as const)
    const value = what === 'Kanten' ? 3 * n : what === 'Ecken' ? 2 * n : n + 2
    return valueTask({
      question: `Du zeichnest ein Prisma mit einem ${N_ECK[n]} als Grundfläche vollständig im Schrägbild (auch verdeckte Linien). Wie viele ${what} hat dein Bild?`,
      answerKind: 'integer',
      value,
      solution: String(value),
      explanation:
        what === 'Kanten'
          ? `${n} Kanten in der Grundfläche, ${n} in der Deckfläche und ${n} Seitenkanten: 3 · ${n} = ${value}.`
          : what === 'Ecken'
            ? `${n} Ecken unten und ${n} Ecken oben: 2 · ${n} = ${value}.`
            : `Grund- und Deckfläche sowie ${n} Seitenflächen: ${n} + 2 = ${value}.`,
      fachwissen: FW_PRISMA,
      dedupeKey: `ma:k6:kav:zaehl:${n}:${what}`,
    })
  },
  (rng) => {
    const [l, b, h] = threeDistinct(rng, 2, 12)
    const drawn = roundTo(b / 2, 1)
    const correct = `${l} cm, ${h} cm und ${formatDe(drawn)} cm`
    return appliedMc(rng, {
      question: `Ein Quader (Länge ${l} cm, Tiefe ${b} cm, Höhe ${h} cm) wird in Kavalierperspektive gezeichnet; die Vorderfläche ist ${l} cm × ${h} cm. Welche drei Kantenlängen kommen im Bild vor?`,
      correct,
      distractors: [
        `${l} cm, ${h} cm und ${b} cm`,
        `${formatDe(l / 2)} cm, ${h} cm und ${formatDe(drawn)} cm`,
        `${l} cm, ${formatDe(h / 2)} cm und ${formatDe(drawn)} cm`,
        `${l} cm, ${h} cm und ${b * 2} cm`,
      ],
      explanation: `Länge und Höhe der Vorderfläche bleiben unverändert; die Tiefe ${b} cm wird halbiert: ${formatDe(drawn)} cm.`,
      fachwissen: FW_KAVALIER,
      dedupeKey: `ma:k6:kav:quader:${l}:${b}:${h}`,
    })
  },
)

// ---------------------------------------------------------------------------
// K7 LB1 — Satz des Thales
// ---------------------------------------------------------------------------

const FW_THALES: Fachwissen = {
  text: 'Satz des Thales: Liegt der Punkt C auf dem Halbkreis über dem Durchmesser AB, so hat das Dreieck ABC bei C einen rechten Winkel. Der Mittelpunkt M von AB ist zugleich Kreismittelpunkt; deshalb sind MA, MB und MC gleich lang (Radius).',
  ...WIKI('Satz des Thales', 'Satz_des_Thales'),
}

const THALES_SETS: Array<{ A: [number, number]; B: [number, number]; on: Array<[number, number]>; off: Array<[number, number]> }> = [
  {
    A: [0, 0],
    B: [10, 0],
    on: [[1, 3], [1, -3], [2, 4], [2, -4], [8, 4], [8, -4], [9, 3], [9, -3], [5, 5], [5, -5]],
    off: [[3, 3], [4, 4], [6, 3], [2, 2], [7, 4], [3, 5], [8, 2], [1, 4], [6, -4], [4, -3]],
  },
  {
    A: [-5, 0],
    B: [5, 0],
    on: [[3, 4], [-3, 4], [4, 3], [-4, 3], [3, -4], [-3, -4], [4, -3], [-4, -3], [0, 5], [0, -5]],
    off: [[3, 3], [-4, 4], [2, 4], [-2, 3], [4, 2], [0, 4], [1, -4], [-3, -3], [5, 2], [2, -5]],
  },
]

export const generateThalesK7 = mixedVariants(
  (rng) => {
    const a = randInt(rng, 15, 75)
    return valueTask({
      question: `Der Punkt C liegt auf dem Halbkreis über der Strecke AB. Im Dreieck ABC ist α = ${a}°. Wie groß ist β?`,
      unit: '°',
      answerKind: 'integer',
      value: 90 - a,
      solution: `${90 - a}°`,
      explanation: `Nach dem Satz des Thales ist γ = 90°. Mit der Winkelsumme folgt β = 180° − 90° − ${a}° = ${90 - a}°.`,
      fachwissen: FW_THALES,
      dedupeKey: `ma:k7:thales:beta:${a}`,
    })
  },
  (rng) => {
    const a = randInt(rng, 20, 70)
    return valueTask({
      question: `C liegt auf dem Thaleskreis über AB mit Mittelpunkt M. Im Dreieck ABC ist α = ${a}°. Wie groß ist der Winkel ∠AMC?`,
      unit: '°',
      answerKind: 'integer',
      value: 180 - 2 * a,
      solution: `${180 - 2 * a}°`,
      explanation: `MA = MC (Radius), also ist das Dreieck AMC gleichschenklig mit ∠ACM = α = ${a}°. Damit ∠AMC = 180° − 2 · ${a}° = ${180 - 2 * a}°.`,
      fachwissen: FW_THALES,
      dedupeKey: `ma:k7:thales:amc:${a}`,
    })
  },
  (rng) => {
    const s = pick(rng, THALES_SETS)
    const c = pick(rng, s.on)
    return appliedMc(rng, {
      question: `Gegeben sind A${pt(...s.A)} und B${pt(...s.B)}. Für welchen Punkt C hat das Dreieck ABC bei C einen rechten Winkel?`,
      correct: pt(...c),
      distractors: shuffleArr(rng, s.off).map((p) => pt(...p)),
      explanation: `Der rechte Winkel bei C entsteht genau dann, wenn C auf dem Thaleskreis um M${pt((s.A[0] + s.B[0]) / 2, 0)} mit Radius 5 liegt. Für ${pt(...c)} ist der Abstand zu M genau 5.`,
      fachwissen: FW_THALES,
      dedupeKey: `ma:k7:thales:punkt:${s.A.join(',')}:${c.join(',')}`,
    })
  },
  (rng) => {
    const d10 = 2 * randInt(rng, 20, 75)
    const ab = d10 / 10
    if (rng() < 0.5) {
      return valueTask({
        question: `Ein rechtwinkliges Dreieck hat die Hypotenuse AB = ${formatDe(ab)} cm. Wie groß ist der Radius seines Umkreises?`,
        unit: 'cm',
        answerKind: 'decimal',
        value: ab / 2,
        solution: `${formatDe(ab / 2)} cm`,
        explanation: `Die Hypotenuse ist Durchmesser des Thaleskreises, der zugleich Umkreis ist: r = ${formatDe(ab)} : 2 = ${formatDe(ab / 2)} cm.`,
        fachwissen: FW_THALES,
        dedupeKey: `ma:k7:thales:umkreis:${d10}`,
      })
    }
    return valueTask({
      question: `Der Umkreis eines rechtwinkligen Dreiecks ABC (rechter Winkel bei C) hat den Radius ${formatDe(ab / 2)} cm. Wie lang ist die Hypotenuse AB?`,
      unit: 'cm',
      answerKind: 'decimal',
      value: ab,
      solution: `${formatDe(ab)} cm`,
      explanation: `Der Mittelpunkt des Umkreises ist der Mittelpunkt von AB; AB = 2 · ${formatDe(ab / 2)} cm = ${formatDe(ab)} cm.`,
      fachwissen: FW_THALES,
      dedupeKey: `ma:k7:thales:hyp:${d10}`,
    })
  },
)

// ---------------------------------------------------------------------------
// K7 LB2 — Zahlbereiche ℕ ⊂ ℤ ⊂ ℚ
// ---------------------------------------------------------------------------

const FW_ZAHLBEREICH: Fachwissen = {
  text: 'Die natürlichen Zahlen ℕ = {0, 1, 2, …} sind in den ganzen Zahlen ℤ = {…, −2, −1, 0, 1, 2, …} enthalten, diese in den rationalen Zahlen ℚ (alle Zahlen, die sich als Bruch ganzer Zahlen schreiben lassen). Es gilt also ℕ ⊂ ℤ ⊂ ℚ; endliche und periodische Dezimalzahlen sind rational.',
  ...WIKI('Rationale Zahl', 'Rationale_Zahl'),
}

type ZB = 'ℕ' | 'ℤ' | 'ℚ'
const zbNumber = (rng: Rng, target: ZB): { label: string; key: string } => {
  if (target === 'ℕ') {
    const n = randInt(rng, 1, 99)
    return pick(rng, [
      { label: String(n), key: `n${n}` },
      { label: `${2 * n}/2`, key: `n${n}h` },
    ])
  }
  if (target === 'ℤ') {
    const n = randInt(rng, 1, 99)
    return pick(rng, [
      { label: `−${n}`, key: `z${n}` },
      { label: `−${3 * n}/3`, key: `z${n}t` },
    ])
  }
  const d = pick(rng, [2, 3, 4, 5, 8, 10])
  let z = randInt(rng, 1, 3 * d)
  while (z % d === 0) z++
  const neg = rng() < 0.5
  const f = makeFraction(z, d)
  return pick(rng, [
    { label: `${neg ? '−' : ''}${f.n}/${f.d}`, key: `q${neg}${f.n}/${f.d}` },
    { label: `${neg ? '−' : ''}${formatDe(Math.floor((f.n / f.d) * 1000) / 1000)}${f.d % 3 === 0 ? '…' : ''}`, key: `qd${neg}${f.n}/${f.d}` },
  ])
}
const zbOf = (label: string): ZB => {
  const neg = label.startsWith('−')
  const raw = label.replace('−', '').replace('…', '')
  const v = raw.includes('/') ? Number(raw.split('/')[0]) / Number(raw.split('/')[1]) : Number(raw.replace(',', '.'))
  if (!Number.isInteger(roundTo(v, 9)) || label.endsWith('…')) return 'ℚ'
  return neg ? 'ℤ' : 'ℕ'
}

export const generateZahlbereicheK7 = mixedVariants(
  (rng) => {
    const target = pick(rng, ['ℕ', 'ℤ', 'ℚ'] as const)
    const x = zbNumber(rng, target)
    const shown = x.label
    return appliedMc(rng, {
      question: `Welches ist der kleinste der Zahlbereiche ℕ, ℤ und ℚ, der die Zahl ${shown} enthält?`,
      correct: target,
      distractors: ['ℕ', 'ℤ', 'ℚ'],
      explanation:
        target === 'ℕ'
          ? `${shown} ist gleich ${formatDe(Number(eval_(x.label)))}, also eine natürliche Zahl: ℕ.`
          : target === 'ℤ'
            ? `${shown} ist eine negative ganze Zahl: Sie liegt in ℤ, aber nicht in ℕ.`
            : `${shown} ist keine ganze Zahl, lässt sich aber als Bruch schreiben: ℚ.`,
      fachwissen: FW_ZAHLBEREICH,
      dedupeKey: `ma:k7:zb:kleinster:${x.key}`,
      instruction: 'Wähle den kleinsten Zahlbereich:',
    })
  },
  (rng) => {
    const target = pick(rng, ['ℕ', 'ℤ'] as const)
    const pool: string[] = []
    const keys = new Set<string>()
    const want = (t: ZB) => {
      for (let i = 0; i < 20; i++) {
        const x = zbNumber(rng, t)
        if (keys.has(optionKey(x.label))) continue
        keys.add(optionKey(x.label))
        pool.push(x.label)
        return
      }
    }
    const kinds: ZB[] = shuffleArr(rng, ['ℕ', 'ℕ', 'ℤ', 'ℤ', 'ℚ', 'ℚ'] as ZB[])
    kinds.forEach(want)
    const inT = (l: string) => (target === 'ℕ' ? zbOf(l) === 'ℕ' : zbOf(l) !== 'ℚ')
    const correct = pool.filter(inT)
    return multiSelectTask({
      question: `Tippe alle Zahlen an, die zu ${target} gehören.`,
      choices: pool,
      correct,
      solution: correct.join('; '),
      explanation: `Zu ${target} gehören: ${correct.join('; ')}. ${target === 'ℕ' ? 'Negative Zahlen und Brüche, die keine ganzen Zahlen sind, gehören nicht zu ℕ.' : 'Brüche und Dezimalzahlen, die keine ganzen Zahlen sind, gehören nicht zu ℤ.'}`,
      instruction: 'Tippe alle zutreffenden Zahlen an:',
      fachwissen: FW_ZAHLBEREICH,
      dedupeKey: `ma:k7:zb:multi:${target}:${[...pool].sort().join('|')}`,
    })
  },
)

/** Wertet einfache Bruch-/Dezimal-Labels aus (nur für Erklärungstexte). */
function eval_(label: string): number {
  const neg = label.startsWith('−')
  const raw = label.replace('−', '').replace('…', '')
  const v = raw.includes('/') ? Number(raw.split('/')[0]) / Number(raw.split('/')[1]) : Number(raw.replace(',', '.'))
  return neg ? -v : v
}

// ---------------------------------------------------------------------------
// K8 LB2 — Ereignisse: Vereinigung, Durchschnitt, Differenz
// ---------------------------------------------------------------------------

const FW_EREIGNIS: Fachwissen = {
  text: 'Ein Ereignis ist eine Teilmenge der Ergebnismenge Ω. A ∩ B („A und B“) enthält die Ergebnisse, die in beiden Ereignissen liegen, A ∪ B („A oder B“) die Ergebnisse aus mindestens einem der beiden. A \\ B enthält die Ergebnisse von A, die nicht in B liegen; das Gegenereignis Ā enthält alle Ergebnisse von Ω, die nicht in A liegen.',
  ...WIKI('Ereignis (Wahrscheinlichkeitstheorie)', 'Ereignis_(Wahrscheinlichkeitstheorie)'),
}

interface Ev {
  text: string
  pred: (x: number) => boolean
}
const eventPool = (n: number): Ev[] => {
  const k1 = Math.max(2, Math.floor(n / 3))
  const k2 = Math.max(3, Math.ceil((2 * n) / 3))
  return [
    { text: 'gerade Zahl', pred: (x) => x % 2 === 0 },
    { text: 'ungerade Zahl', pred: (x) => x % 2 === 1 },
    { text: 'Primzahl', pred: isPrimeN },
    { text: `Zahl größer als ${k1}`, pred: (x) => x > k1 },
    { text: `Zahl kleiner als ${k2}`, pred: (x) => x < k2 },
    { text: 'durch 3 teilbare Zahl', pred: (x) => x % 3 === 0 },
  ]
}
const OPS = ['∩', '∪', '\\'] as const
type Op = (typeof OPS)[number]
const applyOp = (op: Op, a: number[], b: number[]): number[] =>
  op === '∩' ? a.filter((x) => b.includes(x)) : op === '∪' ? [...new Set([...a, ...b])] : a.filter((x) => !b.includes(x))

const pickEvents = (rng: Rng) => {
  for (let i = 0; i < 40; i++) {
    const n = pick(rng, [6, 8, 10, 12])
    const omega = range(1, n)
    const op = pick(rng, OPS)
    let [ea, eb] = shuffleArr(rng, eventPool(n)).slice(0, 2) as [Ev, Ev]
    // ∩ und ∪ sind symmetrisch: feste Reihenfolge, damit A/B-Tausch keine zweite Aufgabe ergibt
    if (op !== '\\' && ea.text > eb.text) [ea, eb] = [eb, ea]
    const A = omega.filter(ea.pred)
    const B = omega.filter(eb.pred)
    if (setStr(A) === setStr(B)) continue
    const R = applyOp(op, A, B)
    if (R.length === 0 || setStr(R) === setStr(A) || setStr(R) === setStr(B)) continue
    return { n, omega, ea, eb, A, B, op, R }
  }
  const omega = range(1, 6)
  return { n: 6, omega, ea: eventPool(6)[0]!, eb: eventPool(6)[3]!, A: [2, 4, 6], B: [3, 4, 5, 6], op: '∩' as Op, R: [4, 6] }
}
const opName: Record<Op, string> = { '∩': 'A ∩ B', '∪': 'A ∪ B', '\\': 'A \\ B' }
const ctxOmega = (n: number) => (n === 6 ? 'Ein Würfel wird einmal geworfen' : `Ein Glücksrad mit den Feldern 1 bis ${n} wird einmal gedreht`)

export const generateEreignismengenK8 = mixedVariants(
  (rng) => {
    const e = pickEvents(rng)
    const others = OPS.filter((o) => o !== e.op).map((o) => setStr(applyOp(o, e.A, e.B)))
    return appliedMc(rng, {
      question: `${ctxOmega(e.n)}. A: „${e.ea.text}“, B: „${e.eb.text}“. Welche Menge beschreibt das Ereignis ${opName[e.op]}?`,
      correct: setStr(e.R),
      distractors: [...others, setStr(applyOp('\\', e.B, e.A)), setStr(e.A), setStr(e.B)],
      explanation: `A = ${setStr(e.A)}, B = ${setStr(e.B)}. Damit ist ${opName[e.op]} = ${setStr(e.R)}.`,
      fachwissen: FW_EREIGNIS,
      dedupeKey: `ma:k8:ereig:mc:${e.n}:${e.ea.text}:${e.eb.text}:${e.op}`,
    })
  },
  (rng) => {
    const e = pickEvents(rng)
    const p = makeFraction(e.R.length, e.n)
    return fractionTask({
      question: `${ctxOmega(e.n)}. A: „${e.ea.text}“, B: „${e.eb.text}“. Wie groß ist die Wahrscheinlichkeit P(${opName[e.op]})? Gib einen Bruch an.`,
      value: p,
      solution: `${p.n}/${p.d}`,
      explanation: `A = ${setStr(e.A)}, B = ${setStr(e.B)}, ${opName[e.op]} = ${setStr(e.R)}: ${e.R.length} von ${e.n} gleich wahrscheinlichen Ergebnissen, also ${e.R.length}/${e.n}${gcd(e.R.length, e.n) > 1 ? ` = ${p.n}/${p.d}` : ''}.`,
      dedupeKey: `ma:k8:ereig:p:${e.n}:${e.ea.text}:${e.eb.text}:${e.op}`,
    })
  },
  (rng) => {
    const n = pick(rng, [6, 8, 10, 12])
    const omega = range(1, n)
    const ev = pick(rng, eventPool(n))
    const A = omega.filter(ev.pred)
    const comp = omega.filter((x) => !ev.pred(x))
    return appliedMc(rng, {
      question: `${ctxOmega(n)}. A: „${ev.text}“. Welche Menge ist das Gegenereignis Ā?`,
      correct: setStr(comp),
      distractors: [setStr(A), setStr(comp.slice(1)), setStr([...comp, A[0]!]), setStr(omega)],
      explanation: `A = ${setStr(A)}. Ā enthält alle übrigen Ergebnisse von Ω = ${setStr(omega)}: ${setStr(comp)}.`,
      fachwissen: FW_EREIGNIS,
      dedupeKey: `ma:k8:ereig:gegen:${n}:${ev.text}`,
    })
  },
)

// ---------------------------------------------------------------------------
// K9 LB1 — Definitions- und Wertebereich
// ---------------------------------------------------------------------------

const FW_DEF_WURZEL: Fachwissen = {
  text: 'Der Definitionsbereich einer Funktion enthält alle x, für die sich der Funktionsterm berechnen lässt. Unter einer Quadratwurzel darf keine negative Zahl stehen; bei f(x) = √(x − a) muss also x − a ≥ 0, d. h. x ≥ a gelten.',
  ...WIKI('Definitionsmenge', 'Definitionsmenge'),
}
const FW_DEF_BRUCH: Fachwissen = {
  text: 'Durch null darf man nicht dividieren. Bei Funktionen mit einem Bruchterm wie f(x) = 1 : (x − a) muss man deshalb die Stelle ausschließen, an der der Nenner null wird.',
  ...WIKI('Definitionsmenge', 'Definitionsmenge'),
}
const FW_WERTE: Fachwissen = {
  text: 'Der Wertebereich enthält alle Funktionswerte, die eine Funktion annimmt. Bei f(x) = (x − d)² + e ist das Quadrat nie negativ; der kleinste Funktionswert ist daher e (im Scheitelpunkt). Bei f(x) = −(x − d)² + e ist e der größte Funktionswert.',
  ...WIKI('Wertemenge', 'Wertemenge'),
}

const lin = (a: number) => (a === 0 ? 'x' : a > 0 ? `x − ${a}` : `x + ${-a}`)

export const generateDefWerteK9 = mixedVariants(
  (rng) => {
    const a = randInt(rng, -9, 9) || 4
    return valueTask({
      question: `Welches ist die kleinste Zahl im Definitionsbereich von f(x) = √(${lin(a)})?`,
      answerKind: 'integer',
      value: a,
      solution: minus(a),
      explanation: `Es muss ${lin(a)} ≥ 0 gelten, also x ≥ ${minus(a)}. Die kleinste Zahl ist ${minus(a)}.`,
      fachwissen: FW_DEF_WURZEL,
      dedupeKey: `ma:k9:def:wurzel:${a}`,
    })
  },
  (rng) => {
    const a = randInt(rng, -9, 9) || -3
    const z = randInt(rng, 1, 9)
    return valueTask({
      question: `Welche Zahl gehört nicht zum Definitionsbereich von f(x) = ${z} / (${lin(a)})?`,
      answerKind: 'integer',
      value: a,
      solution: minus(a),
      explanation: `Für x = ${minus(a)} wird der Nenner ${lin(a)} null; diese Zahl muss ausgeschlossen werden.`,
      fachwissen: FW_DEF_BRUCH,
      dedupeKey: `ma:k9:def:bruch:${a}:${z}`,
    })
  },
  (rng) => {
    const d = randInt(rng, -6, 6)
    const e = randInt(rng, -9, 9) || 5
    const down = rng() < 0.5
    const term = `${down ? '−' : ''}(${lin(d)})² ${signed(e)}`.replace('(x)²', 'x²')
    return valueTask({
      question: `Welches ist die ${down ? 'größte' : 'kleinste'} Zahl im Wertebereich von f(x) = ${term}?`,
      answerKind: 'integer',
      value: e,
      solution: minus(e),
      explanation: `Das Quadrat ist nie negativ und wird bei x = ${minus(d)} null. Dort nimmt f seinen ${down ? 'größten' : 'kleinsten'} Wert ${minus(e)} an.`,
      fachwissen: FW_WERTE,
      dedupeKey: `ma:k9:werte:${d}:${e}:${down}`,
    })
  },
  (rng) => {
    const a = randInt(rng, 1, 9) * (rng() < 0.5 ? -1 : 1)
    const reversed = rng() < 0.4
    const b = Math.abs(a)
    const term = reversed ? `√(${b} − x)` : `√(${lin(a)})`
    const correct = reversed ? `x ≤ ${b}` : `x ≥ ${minus(a)}`
    return appliedMc(rng, {
      question: `Welche Bedingung beschreibt den Definitionsbereich von f(x) = ${term}?`,
      correct,
      distractors: reversed
        ? [`x ≥ ${b}`, `x ≤ −${b}`, `x < ${b}`, `x ≥ −${b}`]
        : [`x ≤ ${minus(a)}`, `x > ${minus(a)}`, `x ≥ ${minus(-a)}`, `x ≤ ${minus(-a)}`],
      explanation: reversed
        ? `${b} − x ≥ 0 ⇔ x ≤ ${b}.`
        : `${lin(a)} ≥ 0 ⇔ x ≥ ${minus(a)}.`,
      fachwissen: FW_DEF_WURZEL,
      dedupeKey: `ma:k9:def:mc:${a}:${reversed}`,
    })
  },
)

// ---------------------------------------------------------------------------
// K9 LB3 — Kathetensatz
// ---------------------------------------------------------------------------

const FW_KATHETE: Fachwissen = {
  text: 'Im rechtwinkligen Dreieck teilt die Höhe auf die Hypotenuse c diese in die Abschnitte p und q. Der Kathetensatz des Euklid besagt: a² = c · p und b² = c · q, wobei p der an a anliegende Hypotenusenabschnitt ist.',
  ...WIKI('Kathetensatz', 'Kathetensatz'),
}

export const generateKathetensatzK9 = mixedVariants(
  (rng) => {
    const c = randInt(rng, 6, 16)
    const p = randInt(rng, 1, c - 1)
    const a = Math.sqrt(c * p)
    const nice = Number.isInteger(a)
    const val = roundTo(a, 2)
    return valueTask({
      question: `In einem rechtwinkligen Dreieck ist die Hypotenuse c = ${c} cm lang; der an der Kathete a anliegende Hypotenusenabschnitt ist p = ${p} cm. Wie lang ist a?${nice ? '' : ' Runde auf zwei Nachkommastellen.'}`,
      unit: 'cm',
      answerKind: 'decimal',
      value: val,
      eps: nice ? 1e-6 : 0.006,
      solution: `${formatDe(val)} cm`,
      explanation: `a² = c · p = ${c} · ${p} = ${c * p}, also a = √${c * p} ${nice ? '=' : '≈'} ${formatDe(val)} cm.`,
      fachwissen: FW_KATHETE,
      dedupeKey: `ma:k9:kathete:a:${c}:${p}`,
    })
  },
  (rng) => {
    const c = randInt(rng, 5, 15)
    const a = randInt(rng, 2, c - 1)
    const p = roundTo((a * a) / c, 2)
    const nice = Number.isInteger((a * a * 100) / c)
    return valueTask({
      question: `Ein rechtwinkliges Dreieck hat die Hypotenuse c = ${c} cm und die Kathete a = ${a} cm. Wie lang ist der an a anliegende Hypotenusenabschnitt p?${nice ? '' : ' Runde auf zwei Nachkommastellen.'}`,
      unit: 'cm',
      answerKind: 'decimal',
      value: p,
      eps: nice ? 1e-6 : 0.006,
      solution: `${formatDe(p)} cm`,
      explanation: `a² = c · p ⇒ p = a² : c = ${a * a} : ${c} ${nice ? '=' : '≈'} ${formatDe(p)} cm.`,
      fachwissen: FW_KATHETE,
      dedupeKey: `ma:k9:kathete:p:${c}:${a}`,
    })
  },
  (rng) => {
    const p = randInt(rng, 2, 9)
    const q = randInt(rng, 2, 12)
    const c = p + q
    const b = Math.sqrt(c * q)
    const nice = Number.isInteger(b)
    const val = roundTo(b, 2)
    return valueTask({
      question: `Die Höhe auf die Hypotenuse teilt diese in p = ${p} cm und q = ${q} cm. Wie lang ist die Kathete b, an der q anliegt?${nice ? '' : ' Runde auf zwei Nachkommastellen.'}`,
      unit: 'cm',
      answerKind: 'decimal',
      value: val,
      eps: nice ? 1e-6 : 0.006,
      solution: `${formatDe(val)} cm`,
      explanation: `c = p + q = ${c} cm. b² = c · q = ${c} · ${q} = ${c * q}, also b = √${c * q} ${nice ? '=' : '≈'} ${formatDe(val)} cm.`,
      fachwissen: FW_KATHETE,
      dedupeKey: `ma:k9:kathete:b:${p}:${q}`,
    })
  },
  (rng) => {
    const p = randInt(rng, 2, 8)
    const a = randInt(rng, p + 1, p + 9)
    const c = roundTo((a * a) / p, 2)
    const nice = Number.isInteger((a * a * 100) / p)
    return valueTask({
      question: `In einem rechtwinkligen Dreieck ist die Kathete a = ${a} cm lang, der an ihr anliegende Hypotenusenabschnitt p = ${p} cm. Wie lang ist die Hypotenuse c?${nice ? '' : ' Runde auf zwei Nachkommastellen.'}`,
      unit: 'cm',
      answerKind: 'decimal',
      value: c,
      eps: nice ? 1e-6 : 0.006,
      solution: `${formatDe(c)} cm`,
      explanation: `a² = c · p ⇒ c = a² : p = ${a * a} : ${p} ${nice ? '=' : '≈'} ${formatDe(c)} cm.`,
      fachwissen: FW_KATHETE,
      dedupeKey: `ma:k9:kathete:c:${a}:${p}`,
    })
  },
)

// ---------------------------------------------------------------------------
// K10 LB2 — Verteilungsfunktion
// ---------------------------------------------------------------------------

const FW_VERTEILUNG: Fachwissen = {
  text: 'Die Verteilungsfunktion F einer Zufallsgröße X gibt an, mit welcher Wahrscheinlichkeit X höchstens den Wert k annimmt: F(k) = P(X ≤ k). Sie entsteht durch Aufsummieren der Einzelwahrscheinlichkeiten; es gilt P(X > k) = 1 − F(k) und P(X = k) = F(k) − F(k − 1).',
  ...WIKI('Verteilungsfunktion', 'Verteilungsfunktion'),
}

const randomDist = (rng: Rng, n: number): number[] => {
  for (;;) {
    const parts = range(1, n - 1).map(() => randInt(rng, 1, 20 - n))
    const rest = 20 - parts.reduce((s, x) => s + x, 0)
    if (rest >= 1) return [...parts, rest].map((x) => x * 5)
  }
}
const pct = (x: number) => formatDe(x / 100)
const distTable = (ps: number[]) => ps.map((p, k) => `P(X = ${k}) = ${pct(p)}`).join('; ')

export const generateVerteilungsfunktionK10 = mixedVariants(
  (rng) => {
    const ps = randomDist(rng, 4)
    const k = randInt(rng, 0, 2)
    const F = ps.slice(0, k + 1).reduce((s, x) => s + x, 0)
    return valueTask({
      question: `Eine Zufallsgröße X hat die Verteilung ${distTable(ps)}. Berechne F(${k}) = P(X ≤ ${k}).`,
      answerKind: 'decimal',
      value: F / 100,
      solution: pct(F),
      explanation: `F(${k}) = ${ps.slice(0, k + 1).map(pct).join(' + ')} = ${pct(F)}.`,
      fachwissen: FW_VERTEILUNG,
      dedupeKey: `ma:k10:vf:F:${ps.join(',')}:${k}`,
    })
  },
  (rng) => {
    const ps = randomDist(rng, 4)
    const k = randInt(rng, 0, 2)
    const F = ps.slice(0, k + 1).reduce((s, x) => s + x, 0)
    return valueTask({
      question: `Eine Zufallsgröße X hat die Verteilung ${distTable(ps)}. Wie groß ist P(X > ${k})?`,
      answerKind: 'decimal',
      value: (100 - F) / 100,
      solution: pct(100 - F),
      explanation: `P(X > ${k}) = 1 − F(${k}) = 1 − ${pct(F)} = ${pct(100 - F)}.`,
      fachwissen: FW_VERTEILUNG,
      dedupeKey: `ma:k10:vf:gt:${ps.join(',')}:${k}`,
    })
  },
  (rng) => {
    const ps = randomDist(rng, 4)
    const cum = ps.map((_, i) => ps.slice(0, i + 1).reduce((s, x) => s + x, 0))
    const k = randInt(rng, 1, 3)
    return valueTask({
      question: `Für eine Zufallsgröße X mit Werten 0 bis 3 gilt F(0) = ${pct(cum[0]!)}, F(1) = ${pct(cum[1]!)}, F(2) = ${pct(cum[2]!)} und F(3) = 1. Wie groß ist P(X = ${k})?`,
      answerKind: 'decimal',
      value: ps[k]! / 100,
      solution: pct(ps[k]!),
      explanation: `P(X = ${k}) = F(${k}) − F(${k - 1}) = ${pct(cum[k]!)} − ${pct(cum[k - 1]!)} = ${pct(ps[k]!)}.`,
      fachwissen: FW_VERTEILUNG,
      dedupeKey: `ma:k10:vf:diff:${ps.join(',')}:${k}`,
    })
  },
  (rng) => {
    const ps = randomDist(rng, 5)
    const a = randInt(rng, 1, 2)
    const b = randInt(rng, a + 1, 4)
    const s = ps.slice(a, b + 1).reduce((x, y) => x + y, 0)
    return valueTask({
      question: `Eine Zufallsgröße X hat die Verteilung ${distTable(ps)}. Wie groß ist P(${a} ≤ X ≤ ${b})?`,
      answerKind: 'decimal',
      value: s / 100,
      solution: pct(s),
      explanation: `P(${a} ≤ X ≤ ${b}) = F(${b}) − F(${a - 1}) = ${ps.slice(a, b + 1).map(pct).join(' + ')} = ${pct(s)}.`,
      fachwissen: FW_VERTEILUNG,
      dedupeKey: `ma:k10:vf:int:${ps.join(',')}:${a}:${b}`,
    })
  },
)

// ---------------------------------------------------------------------------
// K10 LB4 — Umkehrfunktion und Verkettung
// ---------------------------------------------------------------------------

const FW_VERKETTUNG: Fachwissen = {
  text: 'Bei der Verkettung f(g(x)) wird zuerst g auf x angewendet und dann f auf das Ergebnis. Die Reihenfolge ist wichtig: f(g(x)) und g(f(x)) sind im Allgemeinen verschieden.',
  ...WIKI('Komposition (Mathematik)', 'Komposition_(Mathematik)'),
}
const FW_UMKEHR: Fachwissen = {
  text: 'Die Umkehrfunktion f⁻¹ macht die Zuordnung von f rückgängig: Ist f(x) = y, dann ist f⁻¹(y) = x. Bei einer linearen Funktion f(x) = m·x + n löst man y = m·x + n nach x auf und erhält f⁻¹(x) = (x − n) : m.',
  ...WIKI('Umkehrfunktion', 'Umkehrfunktion'),
}

const linTerm = (m: number, n: number) => `${m === 1 ? '' : m === -1 ? '−' : minus(m)}x ${n === 0 ? '' : signed(n)}`.trim()

export const generateUmkehrVerkettungK10 = mixedVariants(
  (rng) => {
    const a = pick(rng, [-3, -2, 2, 3, 4, 5])
    const b = randInt(rng, -8, 8)
    const c = pick(rng, [-2, 2, 3])
    const d = randInt(rng, -6, 6)
    const x0 = randInt(rng, -4, 5)
    const fFirst = rng() < 0.5
    const g0 = c * x0 + d
    const f0 = a * x0 + b
    const value = fFirst ? a * g0 + b : c * f0 + d
    return valueTask({
      question: `Gegeben sind f(x) = ${linTerm(a, b)} und g(x) = ${linTerm(c, d)}. Berechne ${fFirst ? `f(g(${minus(x0)}))` : `g(f(${minus(x0)}))`}.`,
      answerKind: 'integer',
      value,
      solution: minus(value),
      explanation: fFirst
        ? `g(${minus(x0)}) = ${minus(g0)}; f(${minus(g0)}) = ${minus(value)}.`
        : `f(${minus(x0)}) = ${minus(f0)}; g(${minus(f0)}) = ${minus(value)}.`,
      fachwissen: FW_VERKETTUNG,
      dedupeKey: `ma:k10:verk:${a}:${b}:${c}:${d}:${x0}:${fFirst}`,
    })
  },
  (rng) => {
    const a = pick(rng, [-4, -3, -2, 2, 3, 4, 5])
    const b = randInt(rng, -9, 9)
    const x = randInt(rng, -6, 8)
    const y = a * x + b
    return valueTask({
      question: `Gegeben ist f(x) = ${linTerm(a, b)}. Berechne f⁻¹(${minus(y)}).`,
      answerKind: 'integer',
      value: x,
      solution: minus(x),
      explanation: `f⁻¹(${minus(y)}) ist die Zahl x mit ${linTerm(a, b)} = ${minus(y)}: x = (${minus(y)} ${signed(-b)}) : ${a < 0 ? `(${minus(a)})` : minus(a)} = ${minus(x)}.`,
      fachwissen: FW_UMKEHR,
      dedupeKey: `ma:k10:umk:wert:${a}:${b}:${y}`,
    })
  },
  (rng) => {
    const a = pick(rng, [2, 3, 4, 5])
    const b = pick(rng, [-9, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 9])
    const correct = `f⁻¹(x) = (x ${signed(-b)}) / ${a}`
    return appliedMc(rng, {
      question: `Wie lautet die Umkehrfunktion von f(x) = ${linTerm(a, b)}?`,
      correct,
      distractors: [
        `f⁻¹(x) = (x ${signed(b)}) / ${a}`,
        `f⁻¹(x) = ${a}x ${signed(-b)}`,
        `f⁻¹(x) = x / ${a} ${signed(-b)}`,
        `f⁻¹(x) = (${a} ${signed(-b)}) / x`,
      ],
      explanation: `y = ${linTerm(a, b)} ⇔ x = (y ${signed(-b)}) / ${a}. Variablen tauschen: ${correct}.`,
      fachwissen: FW_UMKEHR,
      dedupeKey: `ma:k10:umk:term:${a}:${b}`,
    })
  },
  (rng) => {
    const c = randInt(rng, -6, 6) || 3
    const x0 = randInt(rng, -5, 5)
    const inner = rng() < 0.5
    const value = inner ? (x0 + c) ** 2 : x0 * x0 + c
    return valueTask({
      question: `Gegeben sind f(x) = x² und g(x) = ${linTerm(1, c)}. Berechne ${inner ? `f(g(${minus(x0)}))` : `g(f(${minus(x0)}))`}.`,
      answerKind: 'integer',
      value,
      solution: minus(value),
      explanation: inner
        ? `g(${minus(x0)}) = ${minus(x0 + c)}; f(${minus(x0 + c)}) = ${minus(value)}.`
        : `f(${minus(x0)}) = ${x0 * x0}; g(${x0 * x0}) = ${minus(value)}.`,
      fachwissen: FW_VERKETTUNG,
      dedupeKey: `ma:k10:verk:quad:${c}:${x0}:${inner}`,
    })
  },
)

// ---------------------------------------------------------------------------
// K11/12 LK — Normalverteilung
// ---------------------------------------------------------------------------

const FW_SIGMA: Fachwissen = {
  text: 'Für eine normalverteilte Zufallsgröße mit Erwartungswert μ und Standardabweichung σ gelten die Sigma-Regeln: Etwa 68,3 % der Werte liegen zwischen μ − σ und μ + σ, etwa 95,4 % zwischen μ − 2σ und μ + 2σ und etwa 99,7 % zwischen μ − 3σ und μ + 3σ. Wegen der Symmetrie liegt die Hälfte der Werte unterhalb von μ.',
  ...WIKI('Normalverteilung', 'Normalverteilung'),
}
const FW_GAUSS: Fachwissen = {
  text: 'Die Dichtefunktion der Normalverteilung (Gauß’sche Glockenkurve) ist symmetrisch zu x = μ und hat dort ihr Maximum. Ihre Wendestellen liegen bei μ − σ und μ + σ. Mit z = (x − μ) : σ misst man, wie viele Standardabweichungen ein Wert von μ entfernt ist.',
  ...WIKI('Normalverteilung', 'Normalverteilung'),
}

const NV_CTX: Array<{ what: string; unit: string; mu: [number, number]; sigma: number[] }> = [
  { what: 'Die Körpergröße erwachsener Männer', unit: 'cm', mu: [174, 182], sigma: [5, 6, 7, 8] },
  { what: 'Die Füllmenge von Saftflaschen', unit: 'ml', mu: [498, 502], sigma: [2, 3, 4] },
  { what: 'Die Masse von Äpfeln einer Sorte', unit: 'g', mu: [140, 160], sigma: [10, 12, 15] },
  { what: 'Die Brenndauer von Kerzen', unit: 'min', mu: [230, 250], sigma: [10, 15, 20] },
]

export const generateNormalverteilungLK = mixedVariants(
  (rng) => {
    const c = pick(rng, NV_CTX)
    const mu = randInt(rng, c.mu[0], c.mu[1])
    const s = pick(rng, c.sigma)
    const k = randInt(rng, 1, 3)
    const correct = ['68,3 %', '95,4 %', '99,7 %'][k - 1]!
    return appliedMc(rng, {
      question: `${c.what} ist normalverteilt mit μ = ${mu} ${c.unit} und σ = ${s} ${c.unit}. Etwa wie viel Prozent der Werte liegen zwischen ${mu - k * s} ${c.unit} und ${mu + k * s} ${c.unit}?`,
      correct,
      distractors: ['68,3 %', '95,4 %', '99,7 %', '50 %'],
      explanation: `Das Intervall ist [μ − ${k}σ; μ + ${k}σ]; nach der ${k}σ-Regel liegen dort etwa ${correct} der Werte.`,
      fachwissen: FW_SIGMA,
      dedupeKey: `ma:lk:nv:sigma:${c.unit}:${mu}:${s}:${k}`,
    })
  },
  (rng) => {
    const c = pick(rng, NV_CTX)
    const mu = randInt(rng, c.mu[0], c.mu[1])
    const s = pick(rng, c.sigma)
    const kind = pick(rng, ['ueber1', 'unter2', 'unterMu'] as const)
    const q =
      kind === 'ueber1'
        ? { text: `größer als ${mu + s} ${c.unit}`, ans: '15,9 %', why: 'Außerhalb von μ ± σ liegen 100 % − 68,3 % = 31,7 %, davon die Hälfte oberhalb: etwa 15,9 %.' }
        : kind === 'unter2'
          ? { text: `kleiner als ${mu - 2 * s} ${c.unit}`, ans: '2,3 %', why: 'Außerhalb von μ ± 2σ liegen 100 % − 95,4 % = 4,6 %, davon die Hälfte unterhalb: etwa 2,3 %.' }
          : { text: `kleiner als ${mu} ${c.unit}`, ans: '50 %', why: 'Die Glockenkurve ist symmetrisch zu μ, deshalb liegt genau die Hälfte der Werte unterhalb von μ.' }
    return appliedMc(rng, {
      question: `${c.what} ist normalverteilt mit μ = ${mu} ${c.unit} und σ = ${s} ${c.unit}. Etwa wie viel Prozent der Werte sind ${q.text}?`,
      correct: q.ans,
      distractors: ['15,9 %', '2,3 %', '50 %', '34,1 %', '0,1 %'],
      explanation: q.why,
      fachwissen: FW_SIGMA,
      dedupeKey: `ma:lk:nv:rand:${c.unit}:${mu}:${s}:${kind}`,
    })
  },
  (rng) => {
    const c = pick(rng, NV_CTX)
    const mu = randInt(rng, c.mu[0], c.mu[1])
    const s = pick(rng, c.sigma)
    const z = pick(rng, [-2.5, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5])
    const x = mu + z * s
    return valueTask({
      question: `${c.what} ist normalverteilt mit μ = ${mu} ${c.unit} und σ = ${s} ${c.unit}. Berechne den standardisierten Wert z für x = ${formatDe(x)} ${c.unit}.`,
      answerKind: 'decimal',
      value: z,
      solution: formatDe(z),
      explanation: `z = (x − μ) : σ = (${formatDe(x)} − ${mu}) : ${s} = ${formatDe(z)}.`,
      fachwissen: FW_GAUSS,
      dedupeKey: `ma:lk:nv:z:${c.unit}:${mu}:${s}:${z}`,
    })
  },
  (rng) => {
    const c = pick(rng, NV_CTX)
    const mu = randInt(rng, c.mu[0], c.mu[1])
    const s = pick(rng, c.sigma)
    const right = rng() < 0.5
    const v = right ? mu + s : mu - s
    return valueTask({
      question: `${c.what} ist normalverteilt mit μ = ${mu} ${c.unit} und σ = ${s} ${c.unit}. An welcher Stelle ${right ? 'rechts' : 'links'} von μ hat die Dichtefunktion ihre Wendestelle?`,
      unit: c.unit,
      answerKind: 'integer',
      value: v,
      solution: `${v} ${c.unit}`,
      explanation: `Die Wendestellen der Glockenkurve liegen bei μ ± σ: ${mu} ${right ? '+' : '−'} ${s} = ${v} ${c.unit}.`,
      fachwissen: FW_GAUSS,
      dedupeKey: `ma:lk:nv:wende:${c.unit}:${mu}:${s}:${right}`,
    })
  },
)

/** Topic-Hilfe: Generator unter Topic-Typ. */
export type AppliedGenerate = Topic['generate']
