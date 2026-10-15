/**
 * Themenreine Mathe-Densify-Generatoren nach Klasse × Lernbereich.
 * Nur MC/Wert — kein TF, keine Zuordnung, keine Lücken.
 * Zahlenraum und Stoff an Klassenstufe gebunden.
 */
import type { Rng } from '../lib/rng'
import { choicePickTask, valueTask } from './taskHelpers'
import { shuffle } from './biologieHelpers'
import type { Topic } from './types'

const Q = 'Lehrplan Mathematik Sachsen'
const U = 'https://www.schulportal.sachsen.de/'
const fw = (text: string) => ({ text, quelle: Q, url: U })

function pick<T>(rng: Rng, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!
}

function irand(rng: Rng, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1))
}

/** K5 LB4 — Rechtecke und Quader */
export function densifyK5Lb4(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const mode = (Math.floor(rng() * 4) + salt) % 4
  if (mode === 0) {
    const a = irand(rng, 3, 12)
    const b = irand(rng, 3, 12)
    const u = 2 * (a + b)
    return valueTask({
      question: `Ein Rechteck hat die Seiten ${a} cm und ${b} cm. Wie groß ist der Umfang in cm?`,
      answerKind: 'integer',
      value: u,
      solution: String(u),
      explanation: `U = 2·(${a}+${b}) = ${u} cm.`,
      fachwissen: fw('Umfang Rechteck: U = 2·(a+b).'),
      dedupeKey: `ma:dens:k5lb4:u:${a}:${b}:${salt}`,
      contentIds: [`ma:dens:k5lb4:u:${a}:${b}`],
    })
  }
  if (mode === 1) {
    const a = irand(rng, 3, 14)
    const b = irand(rng, 3, 14)
    const A = a * b
    return valueTask({
      question: `Berechne die Fläche eines Rechtecks mit a = ${a} cm und b = ${b} cm (in cm²).`,
      answerKind: 'integer',
      value: A,
      solution: String(A),
      explanation: `A = a·b = ${a}·${b} = ${A} cm².`,
      fachwissen: fw('Flächeninhalt Rechteck: A = a·b.'),
      dedupeKey: `ma:dens:k5lb4:A:${a}:${b}:${salt}`,
      contentIds: [`ma:dens:k5lb4:A:${a}:${b}`],
    })
  }
  if (mode === 2) {
    const a = irand(rng, 2, 8)
    const b = irand(rng, 2, 8)
    const c = irand(rng, 2, 8)
    const V = a * b * c
    return valueTask({
      question: `Ein Quader hat die Kanten ${a} cm, ${b} cm und ${c} cm. Volumen in cm³?`,
      answerKind: 'integer',
      value: V,
      solution: String(V),
      explanation: `V = a·b·c = ${V} cm³.`,
      fachwissen: fw('Volumen Quader: V = a·b·c.'),
      dedupeKey: `ma:dens:k5lb4:V:${a}:${b}:${c}:${salt}`,
      contentIds: [`ma:dens:k5lb4:V:${a}:${b}:${c}`],
    })
  }
  const a = irand(rng, 2, 7)
  const b = irand(rng, 2, 7)
  const c = irand(rng, 2, 7)
  const O = 2 * (a * b + a * c + b * c)
  return valueTask({
    question: `Oberfläche eines Quaders mit Kanten ${a} cm, ${b} cm, ${c} cm (in cm²)?`,
    answerKind: 'integer',
    value: O,
    solution: String(O),
    explanation: `O = 2·(ab+ac+bc) = ${O} cm².`,
    fachwissen: fw('Oberfläche Quader: O = 2·(ab+ac+bc).'),
    dedupeKey: `ma:dens:k5lb4:O:${a}:${b}:${c}:${salt}`,
    contentIds: [`ma:dens:k5lb4:O:${a}:${b}:${c}`],
  })
}

/** K6 LB2 — Zuordnungen / Dreisatz / Häufigkeit */
export function densifyK6Lb2(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const mode = (Math.floor(rng() * 3) + salt) % 3
  if (mode === 0) {
    const unit = irand(rng, 2, 9)
    const n = irand(rng, 3, 8)
    const cost = unit * n
    return valueTask({
      question: `${n} Hefte kosten ${cost} €. Was kostet 1 Heft in €?`,
      answerKind: 'integer',
      value: unit,
      solution: String(unit),
      explanation: `${cost} ÷ ${n} = ${unit} €.`,
      fachwissen: fw('Direkte Proportionalität / Dreisatz: auf 1 zurückrechnen.'),
      dedupeKey: `ma:dens:k6lb2:prop:${unit}:${n}:${salt}`,
      contentIds: [`ma:dens:k6lb2:prop:${unit}:${n}`],
    })
  }
  if (mode === 1) {
    const k = irand(rng, 2, 6)
    const x = irand(rng, 2, 8)
    const y = k * x
    return valueTask({
      question: `y ist proportional zu x mit y = ${k}·x. Welchen y-Wert hat x = ${x}?`,
      answerKind: 'integer',
      value: y,
      solution: String(y),
      explanation: `y = ${k}·${x} = ${y}.`,
      fachwissen: fw('Proportionale Zuordnung: y = k·x (Ursprungsgerade).'),
      dedupeKey: `ma:dens:k6lb2:kx:${k}:${x}:${salt}`,
      contentIds: [`ma:dens:k6lb2:kx:${k}:${x}`],
    })
  }
  const hits = irand(rng, 3, 12)
  const trials = hits + irand(rng, 4, 16)
  const pct = Math.round((100 * hits) / trials)
  return choicePickTask({
    question: `Bei ${trials} Würfen gab es ${hits} Sechsen. Relative Häufigkeit (gerundet, in %)?`,
    choices: shuffle(rng, [
      `${pct} %`,
      `${Math.min(99, pct + 10)} %`,
      `${Math.max(1, pct - 8)} %`,
      '50 %',
    ]).slice(0, 4),
    correct: `${pct} %`,
    solution: `${pct} %`,
    explanation: `h = ${hits}/${trials} ≈ ${pct} %.`,
    fachwissen: fw('Relative Häufigkeit = Treffer / Versuche.'),
    dedupeKey: `ma:dens:k6lb2:h:${hits}:${trials}:${salt}`,
    contentIds: [`ma:dens:k6lb2:h:${hits}:${trials}`],
  })
}

/** K6 LB3 — Dreiecke und Vierecke */
export function densifyK6Lb3(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const mode = (Math.floor(rng() * 3) + salt) % 3
  if (mode === 0) {
    const a = irand(rng, 30, 80)
    const b = irand(rng, 30, 80)
    const c = 180 - a - b
    if (c <= 0 || c >= 180) return densifyK6Lb3(rng, salt + 1)
    return valueTask({
      question: `In einem Dreieck sind zwei Winkel ${a}° und ${b}°. Wie groß ist der dritte Winkel?`,
      answerKind: 'integer',
      value: c,
      solution: String(c),
      explanation: `180° − ${a}° − ${b}° = ${c}°.`,
      fachwissen: fw('Innenwinkelsumme im Dreieck: 180°.'),
      dedupeKey: `ma:dens:k6lb3:w:${a}:${b}:${salt}`,
      contentIds: [`ma:dens:k6lb3:w:${a}:${b}`],
    })
  }
  if (mode === 1) {
    const a = irand(rng, 4, 16)
    const h = irand(rng, 3, 12)
    const A = (a * h) / 2
    const isInt = Number.isInteger(A)
    if (!isInt) {
      return valueTask({
        question: `Dreieck: Grundseite a = ${a} cm, Höhe h = ${h} cm. Fläche in cm²?`,
        answerKind: 'decimal',
        value: A,
        solution: String(A).replace('.', ','),
        explanation: `A = a·h/2 = ${a}·${h}/2 = ${A}.`,
        fachwissen: fw('Dreiecksfläche: A = (a·h)/2.'),
        dedupeKey: `ma:dens:k6lb3:A:${a}:${h}:${salt}`,
        contentIds: [`ma:dens:k6lb3:A:${a}:${h}`],
      })
    }
    return valueTask({
      question: `Dreieck: Grundseite a = ${a} cm, Höhe h = ${h} cm. Fläche in cm²?`,
      answerKind: 'integer',
      value: A,
      solution: String(A),
      explanation: `A = a·h/2 = ${A} cm².`,
      fachwissen: fw('Dreiecksfläche: A = (a·h)/2.'),
      dedupeKey: `ma:dens:k6lb3:A:${a}:${h}:${salt}`,
      contentIds: [`ma:dens:k6lb3:A:${a}:${h}`],
    })
  }
  const a = irand(rng, 50, 120)
  const b = irand(rng, 50, 120)
  const c = irand(rng, 50, 120)
  const d = 360 - a - b - c
  if (d <= 0 || d >= 360) return densifyK6Lb3(rng, salt + 2)
  return valueTask({
    question: `In einem Viereck sind drei Innenwinkel ${a}°, ${b}° und ${c}°. Vierter Winkel?`,
    answerKind: 'integer',
    value: d,
    solution: String(d),
    explanation: `360° − (${a}+${b}+${c}) = ${d}°.`,
    fachwissen: fw('Innenwinkelsumme im Viereck: 360°.'),
    dedupeKey: `ma:dens:k6lb3:vier:${a}:${b}:${c}:${salt}`,
    contentIds: [`ma:dens:k6lb3:vier:${a}:${b}:${c}`],
  })
}

/** K7 LB1 — Geometrie in der Ebene */
export function densifyK7Lb1(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const mode = (Math.floor(rng() * 3) + salt) % 3
  if (mode === 0) {
    const a = irand(rng, 20, 160)
    const n = 180 - a
    return valueTask({
      question: `Zwei Nebenwinkel. Einer misst ${a}°. Wie groß ist der andere?`,
      answerKind: 'integer',
      value: n,
      solution: String(n),
      explanation: `Nebenwinkel ergänzen sich zu 180°: ${n}°.`,
      fachwissen: fw('Nebenwinkel: Summe 180°.'),
      dedupeKey: `ma:dens:k7lb1:neb:${a}:${salt}`,
      contentIds: [`ma:dens:k7lb1:neb:${a}`],
    })
  }
  if (mode === 1) {
    const a = irand(rng, 15, 165)
    return valueTask({
      question: `Ein Scheitelwinkel zu ${a}° misst …?`,
      answerKind: 'integer',
      value: a,
      solution: String(a),
      explanation: 'Scheitelwinkel sind gleich groß.',
      fachwissen: fw('Scheitelwinkel sind kongruent (gleich groß).'),
      dedupeKey: `ma:dens:k7lb1:sch:${a}:${salt}`,
      contentIds: [`ma:dens:k7lb1:sch:${a}`],
    })
  }
  const n = pick(rng, [5, 6, 8, 10])
  const s = (n - 2) * 180
  return valueTask({
    question: `Innenwinkelsumme eines ${n}-Ecks in Grad?`,
    answerKind: 'integer',
    value: s,
    solution: String(s),
    explanation: `(${n}−2)·180° = ${s}°.`,
    fachwissen: fw('Innenwinkelsumme n-Eck: (n−2)·180°.'),
    dedupeKey: `ma:dens:k7lb1:sum:${n}:${salt}`,
    contentIds: [`ma:dens:k7lb1:sum:${n}`],
  })
}

/** K7 LB2 — Rationale Zahlen */
export function densifyK7Lb2(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const mode = (Math.floor(rng() * 3) + salt) % 3
  if (mode === 0) {
    const a = irand(rng, -12, 12)
    const b = irand(rng, -12, 12)
    if (a === 0 && b === 0) return densifyK7Lb2(rng, salt + 1)
    const v = a + b
    return valueTask({
      question: `Berechne: (${a}) + (${b})`,
      answerKind: 'integer',
      value: v,
      solution: String(v),
      explanation: `${a} + ${b} = ${v}.`,
      fachwissen: fw('Addition rationaler Zahlen: Vorzeichenregeln beachten.'),
      dedupeKey: `ma:dens:k7lb2:add:${a}:${b}:${salt}`,
      contentIds: [`ma:dens:k7lb2:add:${a}:${b}`],
    })
  }
  if (mode === 1) {
    const a = irand(rng, -9, 9)
    const b = irand(rng, -9, 9)
    if (a === 0 || b === 0) return densifyK7Lb2(rng, salt + 2)
    const v = a * b
    return valueTask({
      question: `Berechne: (${a}) · (${b})`,
      answerKind: 'integer',
      value: v,
      solution: String(v),
      explanation: `${a} · ${b} = ${v}.`,
      fachwissen: fw('Gleichnamige Vorzeichen → positiv; ungleichnamig → negativ.'),
      dedupeKey: `ma:dens:k7lb2:mul:${a}:${b}:${salt}`,
      contentIds: [`ma:dens:k7lb2:mul:${a}:${b}`],
    })
  }
  const a = irand(rng, -15, 15)
  const b = irand(rng, -15, 15)
  const v = a - b
  return valueTask({
    question: `Berechne: (${a}) − (${b})`,
    answerKind: 'integer',
    value: v,
    solution: String(v),
    explanation: `${a} − ${b} = ${a} + (${-b}) = ${v}.`,
    fachwissen: fw('Subtraktion: Addieren der Gegenzahl.'),
    dedupeKey: `ma:dens:k7lb2:sub:${a}:${b}:${salt}`,
    contentIds: [`ma:dens:k7lb2:sub:${a}:${b}`],
  })
}

/** K7 LB3 — Prismen und Pyramiden */
export function densifyK7Lb3(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const mode = (Math.floor(rng() * 2) + salt) % 2
  if (mode === 0) {
    const G = irand(rng, 6, 40)
    const h = irand(rng, 3, 15)
    const V = G * h
    return valueTask({
      question: `Prisma mit Grundfläche G = ${G} cm² und Höhe h = ${h} cm. Volumen in cm³?`,
      answerKind: 'integer',
      value: V,
      solution: String(V),
      explanation: `V = G·h = ${V} cm³.`,
      fachwissen: fw('Prisma: V = G·h.'),
      dedupeKey: `ma:dens:k7lb3:pr:${G}:${h}:${salt}`,
      contentIds: [`ma:dens:k7lb3:pr:${G}:${h}`],
    })
  }
  const G = irand(rng, 6, 36)
  const h = irand(rng, 3, 18)
  const V = (G * h) / 3
  if (!Number.isInteger(V)) {
    return valueTask({
      question: `Pyramide: G = ${G} cm², h = ${h} cm. Volumen in cm³?`,
      answerKind: 'decimal',
      value: V,
      solution: String(V).replace('.', ','),
      explanation: `V = (1/3)·G·h = ${V}.`,
      fachwissen: fw('Pyramide: V = (1/3)·G·h.'),
      dedupeKey: `ma:dens:k7lb3:py:${G}:${h}:${salt}`,
      contentIds: [`ma:dens:k7lb3:py:${G}:${h}`],
    })
  }
  return valueTask({
    question: `Pyramide: G = ${G} cm², h = ${h} cm. Volumen in cm³?`,
    answerKind: 'integer',
    value: V,
    solution: String(V),
    explanation: `V = (1/3)·G·h = ${V} cm³.`,
    fachwissen: fw('Pyramide: V = (1/3)·G·h.'),
    dedupeKey: `ma:dens:k7lb3:py:${G}:${h}:${salt}`,
    contentIds: [`ma:dens:k7lb3:py:${G}:${h}`],
  })
}

/** K8 LB1 — Terme und Gleichungen */
export function densifyK8Lb1(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const mode = (Math.floor(rng() * 3) + salt) % 3
  if (mode === 0) {
    const a = irand(rng, 2, 9)
    const b = irand(rng, 1, 20)
    const x = irand(rng, 1, 12)
    const c = a * x + b
    return valueTask({
      question: `Löse: ${a}x + ${b} = ${c}. x = ?`,
      answerKind: 'integer',
      value: x,
      solution: String(x),
      explanation: `${a}x = ${c - b}, x = ${x}.`,
      fachwissen: fw('Lineare Gleichung: äquivalent umformen.'),
      dedupeKey: `ma:dens:k8lb1:lin:${a}:${b}:${x}:${salt}`,
      contentIds: [`ma:dens:k8lb1:lin:${a}:${b}:${x}`],
    })
  }
  if (mode === 1) {
    const a = irand(rng, 2, 6)
    const b = irand(rng, 2, 8)
    const x = irand(rng, 2, 5)
    const v = a * x + b * x
    return valueTask({
      question: `Vereinfache und berechne für x = ${x}: ${a}x + ${b}x`,
      answerKind: 'integer',
      value: v,
      solution: String(v),
      explanation: `(${a}+${b})x = ${a + b}·${x} = ${v}.`,
      fachwissen: fw('Gleichartige Terme zusammenfassen.'),
      dedupeKey: `ma:dens:k8lb1:term:${a}:${b}:${x}:${salt}`,
      contentIds: [`ma:dens:k8lb1:term:${a}:${b}:${x}`],
    })
  }
  const a = irand(rng, 2, 8)
  const b = irand(rng, 3, 15)
  const x = b - a
  return valueTask({
    question: `Löse: x + ${a} = ${b}. x = ?`,
    answerKind: 'integer',
    value: x,
    solution: String(x),
    explanation: `x = ${b} − ${a} = ${x}.`,
    fachwissen: fw('Äquivalenzumformung: beidseitig dieselbe Operation.'),
    dedupeKey: `ma:dens:k8lb1:einf:${a}:${b}:${salt}`,
    contentIds: [`ma:dens:k8lb1:einf:${a}:${b}`],
  })
}

/** K8 LB2 — Zufallsversuche */
export function densifyK8Lb2(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const mode = (Math.floor(rng() * 2) + salt) % 2
  if (mode === 0) {
    const n = pick(rng, [2, 3, 4, 5, 6])
    const correct = `1/${n}`
    return choicePickTask({
      question: `Laplace-Würfel mit ${n} gleichwahrscheinlichen Seiten. P(eine bestimmte Seite)?`,
      choices: shuffle(rng, [correct, `1/${n + 1}`, `${n}/1`, '1/2']).slice(0, 4),
      correct,
      solution: correct,
      explanation: `P = 1/${n} (Laplace).`,
      fachwissen: fw('Laplace: P(E) = günstige / mögliche Ergebnisse.'),
      dedupeKey: `ma:dens:k8lb2:lap:${n}:${salt}`,
      contentIds: [`ma:dens:k8lb2:lap:${n}`],
    })
  }
  const g = irand(rng, 1, 3)
  const correct = `${g}/6`
  return choicePickTask({
    question: `Fairer Würfel: P(Augenzahl ≤ ${g})?`,
    choices: shuffle(rng, [correct, `${g}/5`, `${g + 1}/6`, '1/2']).slice(0, 4),
    correct,
    solution: correct,
    explanation: `${g} günstige von 6 → ${correct}.`,
    fachwissen: fw('Günstige durch mögliche Ergebnisse.'),
    dedupeKey: `ma:dens:k8lb2:w:${g}:${salt}`,
    contentIds: [`ma:dens:k8lb2:w:${g}`],
  })
}

/** K8 LB3 — Lineare Funktionen / GLS */
export function densifyK8Lb3(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const m = irand(rng, 1, 6)
  const b = irand(rng, -5, 8)
  const x = irand(rng, -3, 6)
  const y = m * x + b
  return valueTask({
    question: `f(x) = ${m}x ${b >= 0 ? `+ ${b}` : `− ${-b}`}. Berechne f(${x}).`,
    answerKind: 'integer',
    value: y,
    solution: String(y),
    explanation: `f(${x}) = ${m}·${x} + (${b}) = ${y}.`,
    fachwissen: fw('Lineare Funktion: f(x) = mx + b.'),
    dedupeKey: `ma:dens:k8lb3:f:${m}:${b}:${x}:${salt}`,
    contentIds: [`ma:dens:k8lb3:f:${m}:${b}:${x}`],
  })
}

/** K8 LB4 — Ähnlichkeit */
export function densifyK8Lb4(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const k = pick(rng, [2, 3, 4, 5])
  const a = irand(rng, 2, 9)
  const A = a * k
  return valueTask({
    question: `Ähnliche Dreiecke, Streckfaktor k = ${k}. Eine Seite misst ${a} cm. Entsprechende Seite?`,
    answerKind: 'integer',
    value: A,
    solution: String(A),
    explanation: `${a} · ${k} = ${A} cm.`,
    fachwissen: fw('Ähnlichkeit: entsprechende Seiten im konstanten Verhältnis k.'),
    dedupeKey: `ma:dens:k8lb4:k:${k}:${a}:${salt}`,
    contentIds: [`ma:dens:k8lb4:k:${k}:${a}`],
  })
}

/** K9 LB1 — Funktionen und Potenzen */
export function densifyK9Lb1(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const mode = (Math.floor(rng() * 2) + salt) % 2
  if (mode === 0) {
    const a = irand(rng, 2, 5)
    const n = irand(rng, 2, 4)
    const v = a ** n
    return valueTask({
      question: `Berechne: ${a}^${n}`,
      answerKind: 'integer',
      value: v,
      solution: String(v),
      explanation: `${a}^${n} = ${v}.`,
      fachwissen: fw('Potenz: aⁿ = a·a·…·a (n Faktoren).'),
      dedupeKey: `ma:dens:k9lb1:pow:${a}:${n}:${salt}`,
      contentIds: [`ma:dens:k9lb1:pow:${a}:${n}`],
    })
  }
  const a = irand(rng, 1, 4)
  const b = irand(rng, 1, 5)
  const x = irand(rng, 1, 4)
  const y = a * x * x + b
  return valueTask({
    question: `f(x) = ${a}x² + ${b}. Berechne f(${x}).`,
    answerKind: 'integer',
    value: y,
    solution: String(y),
    explanation: `f(${x}) = ${a}·${x}² + ${b} = ${y}.`,
    fachwissen: fw('Quadratische Funktion: Term mit x² auswerten.'),
    dedupeKey: `ma:dens:k9lb1:q:${a}:${b}:${x}:${salt}`,
    contentIds: [`ma:dens:k9lb1:q:${a}:${b}:${x}`],
  })
}

/** K9 LB3 — Rechtwinklige Dreiecke */
export function densifyK9Lb3(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const triples = [
    [3, 4, 5],
    [5, 12, 13],
    [6, 8, 10],
    [9, 12, 15],
    [8, 15, 17],
  ] as const
  const [a, b, c] = pick(rng, triples)
  const mode = (Math.floor(rng() * 2) + salt) % 2
  if (mode === 0) {
    return valueTask({
      question: `Rechtwinkliges Dreieck: Katheten ${a} und ${b}. Hypotenuse?`,
      answerKind: 'integer',
      value: c,
      solution: String(c),
      explanation: `c² = ${a}²+${b}² = ${c}² → c = ${c}.`,
      fachwissen: fw('Satz des Pythagoras: a²+b²=c².'),
      dedupeKey: `ma:dens:k9lb3:hyp:${a}:${b}:${salt}`,
      contentIds: [`ma:dens:k9lb3:hyp:${a}:${b}`],
    })
  }
  return valueTask({
    question: `Rechtwinkliges Dreieck: Hypotenuse ${c}, eine Kathete ${a}. Andere Kathete?`,
    answerKind: 'integer',
    value: b,
    solution: String(b),
    explanation: `b² = ${c}²−${a}² → b = ${b}.`,
    fachwissen: fw('Pythagoras umgestellt: b = √(c²−a²).'),
    dedupeKey: `ma:dens:k9lb3:kat:${c}:${a}:${salt}`,
    contentIds: [`ma:dens:k9lb3:kat:${c}:${a}`],
  })
}

/** K10 LB1 — Wachstum / periodisch */
export function densifyK10Lb1(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const B = irand(rng, 100, 400)
  const p = pick(rng, [2, 5, 10, 20])
  const years = irand(rng, 1, 3)
  let v = B
  for (let i = 0; i < years; i++) v = Math.round(v * (1 + p / 100))
  return valueTask({
    question: `Startwert ${B}, jährliches Wachstum ${p} %, nach ${years} Jahr(en). Endwert (ganzzahlig gerundet)?`,
    answerKind: 'integer',
    value: v,
    solution: String(v),
    explanation: `Jedes Jahr ·(1+${p}/100). Ergebnis ≈ ${v}.`,
    fachwissen: fw('Exponentielles Wachstum: B·(1+p)ⁿ.'),
    dedupeKey: `ma:dens:k10lb1:w:${B}:${p}:${years}:${salt}`,
    contentIds: [`ma:dens:k10lb1:w:${B}:${p}:${years}`],
  })
}

/** K10 LB2 — Diskrete Zufallsgrößen */
export function densifyK10Lb2(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const vals = [1, 2, 3, 4]
  // Vier Wahrscheinlichkeiten, Summe 1 (Zehntel).
  const pools: number[][] = [
    [0.1, 0.2, 0.3, 0.4],
    [0.4, 0.3, 0.2, 0.1],
    [0.25, 0.25, 0.25, 0.25],
    [0.1, 0.1, 0.2, 0.6],
    [0.5, 0.2, 0.2, 0.1],
    [0.2, 0.2, 0.2, 0.4],
    [0.05, 0.15, 0.3, 0.5],
    [0.3, 0.1, 0.4, 0.2],
    [0.15, 0.35, 0.25, 0.25],
    [0.4, 0.1, 0.1, 0.4],
    [0.2, 0.3, 0.3, 0.2],
    [0.1, 0.4, 0.4, 0.1],
  ]
  const ps = pools[(irand(rng, 0, pools.length - 1) + salt) % pools.length]!
  const E = vals.reduce((s, x, i) => s + x * ps[i]!, 0)
  const eStr = String(Math.round(E * 100) / 100).replace('.', ',')
  const pStr = ps.map((p) => String(p).replace('.', ',')).join('; ')
  const wrong = shuffle(rng, [
    eStr,
    String(Math.round((E + 0.5) * 10) / 10).replace('.', ','),
    String(Math.round((E - 0.5) * 10) / 10).replace('.', ','),
    '2',
    '4',
  ]).filter((x, i, a) => a.indexOf(x) === i)
  return choicePickTask({
    question: `X ∈ {1,2,3,4} mit P = (${pStr}). Erwartungswert E(X)?`,
    choices: wrong.slice(0, 4),
    correct: eStr,
    solution: eStr,
    explanation: `E(X) = 1·${ps[0]}+2·${ps[1]}+3·${ps[2]}+4·${ps[3]} = ${eStr}.`,
    fachwissen: fw('E(X) = Σ x·P(X=x).'),
    dedupeKey: `ma:dens:k10lb2:E:${pStr}:${salt}`,
    contentIds: [`ma:dens:k10lb2:E:${pStr}`],
  })
}

/** K10 LB3 — Algebraische Geometrie */
export function densifyK10Lb3(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const a = irand(rng, 2, 9)
  const b = irand(rng, 2, 9)
  const c2 = a * a + b * b
  return choicePickTask({
    question: `Im Koordinatensystem: A(0|0), B(${a}|0), C(0|${b}). Länge BC²?`,
    choices: shuffle(rng, [String(c2), String(a * a), String(b * b), String(a + b)]).slice(0, 4),
    correct: String(c2),
    solution: String(c2),
    explanation: `BC² = ${a}²+${b}² = ${c2}.`,
    fachwissen: fw('Abstand/Pythagoras in der Ebene.'),
    dedupeKey: `ma:dens:k10lb3:bc:${a}:${b}:${salt}`,
    contentIds: [`ma:dens:k10lb3:bc:${a}:${b}`],
  })
}

/** K10 LB4 — Funktionale Zusammenhänge */
export function densifyK10Lb4(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const a = irand(rng, 1, 4)
  const b = irand(rng, -3, 5)
  const c = irand(rng, -4, 6)
  const x = irand(rng, -2, 4)
  const y = a * x * x + b * x + c
  return valueTask({
    question: `f(x) = ${a}x² ${b >= 0 ? `+ ${b}` : `− ${-b}`}x ${c >= 0 ? `+ ${c}` : `− ${-c}`}. f(${x}) = ?`,
    answerKind: 'integer',
    value: y,
    solution: String(y),
    explanation: `Einsetzen liefert ${y}.`,
    fachwissen: fw('Funktionswert durch Einsetzen berechnen.'),
    dedupeKey: `ma:dens:k10lb4:f:${a}:${b}:${c}:${x}:${salt}`,
    contentIds: [`ma:dens:k10lb4:f:${a}:${b}:${c}:${x}`],
  })
}

/** OS K5 LB1 — Vergleichen/Ordnen + Rechenvorteile (kein bare a·b). */
export function densifyOsK5Lb1(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const mode = (Math.floor(rng() * 3) + salt) % 3
  if (mode === 0) {
    const a = irand(rng, 10, 90)
    let b = irand(rng, 10, 90)
    if (b === a) b = a + 1 + irand(rng, 1, 5)
    const op = a < b ? '<' : '>'
    const correct = `${a} ${op} ${b}`
    return choicePickTask({
      question: `Vergleiche die natürlichen Zahlen: Welche Aussage ist richtig?`,
      choices: shuffle(rng, [correct, `${a} ${op === '<' ? '>' : '<'} ${b}`, `${a} = ${b}`, `${b} ${op} ${a}`]).slice(
        0,
        4,
      ),
      correct,
      solution: correct,
      explanation: op === '<' ? `${a} < ${b}.` : `${a} > ${b}.`,
      fachwissen: fw('Natürliche Zahlen vergleicht man über Stellenwerte oder den Zahlenstrahl.'),
      dedupeKey: `os:dens:k5lb1:vgl:${a}:${b}:${salt}`,
      contentIds: [`os:dens:k5lb1:vgl:${a}:${b}`],
    })
  }
  if (mode === 1) {
    const a = 2 + irand(rng, 0, 7)
    const b = 2 + irand(rng, 0, 7)
    const c = 2 + irand(rng, 0, 5)
    const value = a + b * c
    return valueTask({
      question: `Berechne: ${a} + ${b} · ${c}`,
      answerKind: 'integer',
      value,
      solution: String(value),
      explanation: `Zuerst ${b}·${c}=${b * c}, dann ${a}+${b * c}=${value}.`,
      fachwissen: fw('Punkt vor Strich: Multiplikation vor Addition.'),
      dedupeKey: `os:dens:k5lb1:pvs:${a}:${b}:${c}:${salt}`,
      contentIds: [`os:dens:k5lb1:pvs:${a}:${b}:${c}`],
    })
  }
  const a = 2 + irand(rng, 0, 6)
  const b = 2 + irand(rng, 0, 7)
  const c = 1 + irand(rng, 0, 5)
  const value = a * (b + c)
  return valueTask({
    question: `Berechne: ${a} · (${b} + ${c})`,
    answerKind: 'integer',
    value,
    solution: String(value),
    explanation: `${a}·${b}+${a}·${c}=${value}.`,
    fachwissen: fw('Distributivgesetz: a·(b+c)=a·b+a·c.'),
    dedupeKey: `os:dens:k5lb1:dist:${a}:${b}:${c}:${salt}`,
    contentIds: [`os:dens:k5lb1:dist:${a}:${b}:${c}`],
  })
}

/** OS K5 LB2 — Brüche einfach */
export function densifyOsK5Lb2(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const d = pick(rng, [2, 4, 5, 10])
  const n = irand(rng, 1, d - 1)
  const correct = `${n}/${d}`
  return choicePickTask({
    question: `Welcher Bruch beschreibt ${n} von ${d} gleichen Teilen?`,
    choices: shuffle(rng, [correct, `${d}/${n}`, `${n}/${d + 1}`, '1/1']).slice(0, 4),
    correct,
    solution: correct,
    explanation: `${n} Teile von ${d} → ${correct}.`,
    fachwissen: fw('Bruch: Zähler/Nenner = Anteil.'),
    dedupeKey: `os:dens:k5lb2:br:${n}:${d}:${salt}`,
    contentIds: [`os:dens:k5lb2:br:${n}:${d}`],
  })
}

/** OS K6 LB4 — Prismen / Körper */
export function densifyOsK6Lb4(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  return densifyK5Lb4(rng, salt + 3)
}

/** OS K6 LB5 — Anteile */
export function densifyOsK6Lb5(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const G = pick(rng, [100, 200, 50, 80])
  const p = pick(rng, [10, 20, 25, 50])
  const v = (G * p) / 100
  return valueTask({
    question: `${p} % von ${G} = ?`,
    answerKind: 'integer',
    value: v,
    solution: String(v),
    explanation: `${p}/100 · ${G} = ${v}.`,
    fachwissen: fw('Prozentwert = p/100 · Grundwert.'),
    dedupeKey: `os:dens:k6lb5:p:${p}:${G}:${salt}`,
    contentIds: [`os:dens:k6lb5:p:${p}:${G}`],
  })
}

/** K11/12 LB1 — Differentialrechnung */
export function densifyK1112Lb1(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const a = irand(rng, 1, 6)
  const b = irand(rng, 1, 8)
  const x = irand(rng, 1, 5)
  // f(x)=a x^2 + b x → f'(x)=2a x + b
  const fp = 2 * a * x + b
  return valueTask({
    question: `f(x) = ${a}x² + ${b}x. Berechne f'(${x}).`,
    answerKind: 'integer',
    value: fp,
    solution: String(fp),
    explanation: `f'(x) = ${2 * a}x + ${b}, f'(${x}) = ${fp}.`,
    fachwissen: fw('Potenzregel: (xⁿ)′ = n·xⁿ⁻¹.'),
    dedupeKey: `ma:dens:k1112lb1:d:${a}:${b}:${x}:${salt}`,
    contentIds: [`ma:dens:k1112lb1:d:${a}:${b}:${x}`],
  })
}

/** K11/12 LB3 — Vektoren */
export function densifyK1112Lb3(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const a1 = irand(rng, -5, 5)
  const a2 = irand(rng, -5, 5)
  const b1 = irand(rng, -5, 5)
  const b2 = irand(rng, -5, 5)
  const s = a1 * b1 + a2 * b2
  return valueTask({
    question: `Skalarprodukt: a⃗=(${a1}|${a2}), b⃗=(${b1}|${b2}). a⃗·b⃗ = ?`,
    answerKind: 'integer',
    value: s,
    solution: String(s),
    explanation: `${a1}·${b1}+${a2}·${b2}=${s}.`,
    fachwissen: fw('Skalarprodukt in ℝ²: a₁b₁+a₂b₂.'),
    dedupeKey: `ma:dens:k1112lb3:s:${a1}:${a2}:${b1}:${b2}:${salt}`,
    contentIds: [`ma:dens:k1112lb3:s:${a1}:${a2}:${b1}:${b2}`],
  })
}

/** K11/12 LB4 — Binomial */
export function densifyK1112Lb4(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const n = pick(rng, [5, 8, 10, 20])
  const p = pick(rng, [0.2, 0.25, 0.5])
  const E = n * p
  return valueTask({
    question: `X ~ Bin(${n}; ${String(p).replace('.', ',')}). E(X) = ?`,
    answerKind: 'decimal',
    value: E,
    solution: String(E).replace('.', ','),
    explanation: `E(X)=n·p=${n}·${p}=${E}.`,
    fachwissen: fw('Binomial: E(X)=n·p.'),
    dedupeKey: `ma:dens:k1112lb4:E:${n}:${p}:${salt}`,
    contentIds: [`ma:dens:k1112lb4:E:${n}:${p}`],
  })
}

/** K11/12 LB5 — Integral */
export function densifyK1112Lb5(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const a = irand(rng, 1, 5)
  // ∫_0^a 2x dx = a²
  const v = a * a
  return valueTask({
    question: `Berechne ∫ von 0 bis ${a} von 2x dx.`,
    answerKind: 'integer',
    value: v,
    solution: String(v),
    explanation: `[x²]_0^${a} = ${v}.`,
    fachwissen: fw('Hauptsatz: Stammfunktion auswerten.'),
    dedupeKey: `ma:dens:k1112lb5:I:${a}:${salt}`,
    contentIds: [`ma:dens:k1112lb5:I:${a}`],
  })
}

/** K11/12 LB6 — Statistik */
export function densifyK1112Lb6(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const n = 5
  const base = irand(rng, 1, 8) + (salt % 3)
  const vals = Array.from({ length: n }, (_, i) => base + i * irand(rng, 1, 3))
  const sum = vals.reduce((a, b) => a + b, 0)
  const mean = sum / n
  const meanStr =
    Number.isInteger(mean) ? String(mean) : String(Math.round(mean * 10) / 10).replace('.', ',')
  return choicePickTask({
    question: `Arithmetisches Mittel von ${vals.join('; ')}?`,
    choices: shuffle(rng, [
      meanStr,
      String(vals[0]),
      String(sum),
      String(Math.round(mean) + 1),
    ]).slice(0, 4),
    correct: meanStr,
    solution: meanStr,
    explanation: `Summe ${sum} / ${n} = ${meanStr}.`,
    fachwissen: fw('Mittelwert = Summe / Anzahl.'),
    dedupeKey: `ma:dens:k1112lb6:m:${vals.join('-')}:${salt}`,
    contentIds: [`ma:dens:k1112lb6:m:${vals.join('-')}`],
  })
}

/** K11/12 LB7 — Abstände / Winkel */
export function densifyK1112Lb7(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const a1 = irand(rng, 1, 6)
  const a2 = 0
  const b1 = 0
  const b2 = irand(rng, 1, 6)
  return choicePickTask({
    question: `a⃗=(${a1}|${a2}), b⃗=(${b1}|${b2}). Welcher Winkel zwischen a⃗ und b⃗?`,
    choices: shuffle(rng, ['90°', '0°', '45°', '180°']).slice(0, 4),
    correct: '90°',
    solution: '90°',
    explanation: `a⃗·b⃗ = 0 → orthogonal → 90°.`,
    fachwissen: fw('Orthogonalität: Skalarprodukt 0.'),
    dedupeKey: `ma:dens:k1112lb7:o:${a1}:${b2}:${salt}`,
    contentIds: [`ma:dens:k1112lb7:o:${a1}:${b2}`],
  })
}

/** K11/12 LB8 — Anwendungen */
export function densifyK1112Lb8(rng: Rng, salt: number): ReturnType<Topic['generate']> {
  const mode = (irand(rng, 0, 2) + salt) % 3
  if (mode === 0) {
    const a = irand(rng, 2, 8)
    const b = irand(rng, 10, 40)
    const x = b / (2 * a)
    const xs = String(Math.round(x * 100) / 100).replace('.', ',')
    return choicePickTask({
      question: `f(x) = −${a}x² + ${b}x hat ein Maximum. An welcher Stelle x?`,
      choices: shuffle(rng, [xs, String(x + 1).replace('.', ','), String(b), '0']).slice(0, 4),
      correct: xs,
      solution: xs,
      explanation: `Scheitel bei x = ${b}/(2·${a}) = ${xs} (Parabel öffnet nach unten).`,
      fachwissen: fw('Extremstelle: f′(x)=0 (hier Scheitel).'),
      dedupeKey: `ma:dens:k1112lb8:ex:${a}:${b}:${salt}`,
      contentIds: [`ma:dens:k1112lb8:ex:${a}:${b}`],
    })
  }
  if (mode === 1) {
    const a = irand(rng, 2, 6)
    const b = irand(rng, 8, 30)
    const x = b / (2 * a)
    const fmax = -a * x * x + b * x
    const fs = String(Math.round(fmax * 100) / 100).replace('.', ',')
    return choicePickTask({
      question: `f(x) = −${a}x² + ${b}x. Wie groß ist der Maximalwert f(x_max)?`,
      choices: shuffle(rng, [fs, String(b), String(a * b), '0']).slice(0, 4),
      correct: fs,
      solution: fs,
      explanation: `x_max = ${b}/(2·${a}) = ${x}; f(x_max) = ${fs}.`,
      fachwissen: fw('Maximalwert in den Scheitel einsetzen.'),
      dedupeKey: `ma:dens:k1112lb8:fmax:${a}:${b}:${salt}`,
      contentIds: [`ma:dens:k1112lb8:fmax:${a}:${b}`],
    })
  }
  const u = irand(rng, 4, 12)
  const v = irand(rng, 6, 20)
  // Rechteck mit Umfang 2(u+v) — hier: Seiten x und (u-x), Fläche A=x(u-x)
  const xmax = u / 2
  const xs = String(xmax).replace('.', ',')
  return choicePickTask({
    question: `Aus einem Draht der Länge ${u + v} cm wird ein Rechteck gebogen (eine Seite x cm). Wann ist die Fläche maximal? (vereinfacht: x = ?)`,
    choices: shuffle(rng, [xs, String(u), String(v), String(u + v)]).slice(0, 4),
    correct: xs,
    solution: xs,
    explanation: `Bei festem Umfang ist das Quadrat flächenmaximal; hier x = ${xs} cm.`,
    fachwissen: fw('Optimierung: Extremwert der Zielfunktion.'),
    dedupeKey: `ma:dens:k1112lb8:opt:${u}:${v}:${salt}`,
    contentIds: [`ma:dens:k1112lb8:opt:${u}:${v}`],
  })
}

type Gen = (rng: Rng, salt: number) => ReturnType<Topic['generate']>

const GYM: Record<string, Gen> = {
  '5:lb4': densifyK5Lb4,
  '6:lb2': densifyK6Lb2,
  '6:lb3': densifyK6Lb3,
  '7:lb1': densifyK7Lb1,
  '7:lb2': densifyK7Lb2,
  '7:lb3': densifyK7Lb3,
  '8:lb1': densifyK8Lb1,
  '8:lb2': densifyK8Lb2,
  '8:lb3': densifyK8Lb3,
  '8:lb4': densifyK8Lb4,
  '9:lb1': densifyK9Lb1,
  '9:lb3': densifyK9Lb3,
  '10:lb1': densifyK10Lb1,
  '10:lb2': densifyK10Lb2,
  '10:lb3': densifyK10Lb3,
  '10:lb4': densifyK10Lb4,
  '11:lb1': densifyK1112Lb1,
  '11:lb3': densifyK1112Lb3,
  '11:lb4': densifyK1112Lb4,
  '11:lb5': densifyK1112Lb5,
  '11:lb6': densifyK1112Lb6,
  '11:lb7': densifyK1112Lb7,
  '11:lb8': densifyK1112Lb8,
}

const TITLES: Record<string, string> = {
  '5:lb4': 'Rechteck und Quader vertiefen',
  '6:lb2': 'Zuordnungen und Dreisatz vertiefen',
  '6:lb3': 'Dreiecke und Vierecke vertiefen',
  '7:lb1': 'Winkel und Vielecke vertiefen',
  '7:lb2': 'Rationale Zahlen vertiefen',
  '7:lb3': 'Prisma und Pyramide vertiefen',
  '8:lb1': 'Terme und Gleichungen vertiefen',
  '8:lb2': 'Zufallsversuche vertiefen',
  '8:lb3': 'Lineare Funktionen vertiefen',
  '8:lb4': 'Ähnlichkeit vertiefen',
  '9:lb1': 'Potenzen und Funktionen vertiefen',
  '9:lb3': 'Rechtwinklige Dreiecke vertiefen',
  '10:lb1': 'Wachstum vertiefen',
  '10:lb2': 'Zufallsgrößen vertiefen',
  '10:lb3': 'Geometrie algebraisch vertiefen',
  '10:lb4': 'Funktionen vertiefen',
  '11:lb1': 'Ableitungen vertiefen',
  '11:lb3': 'Vektoren vertiefen',
  '11:lb4': 'Binomialverteilung vertiefen',
  '11:lb5': 'Integrale vertiefen',
  '11:lb6': 'Statistik vertiefen',
  '11:lb7': 'Orthogonalität vertiefen',
  '11:lb8': 'Extremwertaufgaben vertiefen',
}

export function densifyTitle(grade: number, lb: string): string {
  const g = grade >= 11 ? 11 : grade
  return TITLES[`${g}:${lb}`] ?? `Vertiefung ${lb.toUpperCase()}`
}

/** OS HS/RS: Lernbereiche ≠ Gym — Stoff nach Pack-Titeln. */
function osHsRsGen(track: 'hs' | 'rs', grade: number, lb: string): Gen {
  if (track === 'hs') {
    if (grade === 7) {
      if (lb === 'lb1') return densifyK7Lb3 // Flächen/Körper
      if (lb === 'lb2') return densifyOsK6Lb5 // Anteile/Prozent
      if (lb === 'lb4') return densifyK7Lb1 // Vielecke/Prismen (Winkel+Fläche)
      return densifyK7Lb3
    }
    if (grade === 8) {
      if (lb === 'lb1') return densifyOsK6Lb5 // wirtschaftliches Rechnen
      if (lb === 'lb2') return densifyK8Lb1 // Formeln/Gleichungen
      if (lb === 'lb3') return densifyK6Lb3 // Vieleck→Kreis
      if (lb === 'lb4') return densifyK7Lb3 // Zylinder
      if (lb === 'lb5') return densifyK6Lb2 // Alltag / Zuordnung
      return densifyK8Lb1
    }
    // HS 9
    if (lb === 'lb1') return densifyK9Lb3 // rechtwinklige Dreiecke
    if (lb === 'lb2') return densifyK7Lb3 // Körper
    if (lb === 'lb3') return densifyK8Lb3 // funktionale Zusammenhänge
    if (lb === 'lb4') return densifyOsK6Lb5 // Alltag
    return densifyK9Lb3
  }
  // RS
  if (grade === 7) {
    if (lb === 'lb1') return densifyOsK6Lb5 // Prozent/Zins
    if (lb === 'lb2') return densifyK8Lb2 // Stochastik
    if (lb === 'lb3') return densifyK7Lb2 // rationale Zahlen
    if (lb === 'lb4') return densifyK7Lb3 // Vielecke/Prismen
    return densifyK7Lb2
  }
  if (grade === 8) {
    if (lb === 'lb1') return densifyK8Lb1 // lineare Gleichungen
    if (lb === 'lb2') return densifyK8Lb3 // lineare Funktionen/GLS
    if (lb === 'lb3') return densifyK7Lb3 // Kreis/Zylinder
    if (lb === 'lb4') return densifyK8Lb4 // Ähnlichkeit
    if (lb === 'lb5') return densifyK8Lb2 // Zufall
    if (lb === 'lb6') return densifyOsK6Lb5 // Alltag
    return densifyK8Lb1
  }
  // RS 9
  if (lb === 'lb1') return densifyK7Lb1 // Dreiecke/Vielecke (Titel-LB1)
  if (lb === 'lb2') return densifyK7Lb3 // Pyramide/Kegel/Kugel
  if (lb === 'lb3') return densifyK9Lb1 // quadratische Funktionen
  if (lb === 'lb4') return densifyK1112Lb6 // beschreibende Statistik
  return densifyK9Lb1
}

export function densifyGenerator(grade: number, lb: string, variantIndex: number): Topic['generate'] {
  const g = grade >= 11 ? 11 : grade
  const key = `${g}:${lb}`
  let gen = GYM[key]
  if (!gen) {
    if (grade === 5 && lb === 'lb1') gen = densifyOsK5Lb1
    else if (grade === 5 && lb === 'lb2') gen = densifyOsK5Lb2
    else if (grade === 6 && lb === 'lb4') gen = densifyOsK6Lb4
    else if (grade === 6 && lb === 'lb5') gen = densifyOsK6Lb5
    else if (grade === 6 && lb === 'lb1') gen = densifyK6Lb2
    else if (grade >= 7 && grade <= 9) gen = osHsRsGen('hs', grade, lb)
    else gen = densifyK7Lb2
  }
  const salt = variantIndex * 17 + grade * 3
  return (rng: Rng) => gen!(rng, salt)
}

/** OS-Dichte: K5/K6 gemeinsam; ab K7 getrennte HS/RS-LB-Map. */
export function densifyOsGenerator(topicId: string): Topic['generate'] {
  const m = topicId.match(/os-(?:hs-|rs-)?k(\d+)-(lb\w+)-d(\d+)/)
  if (!m) return densifyGenerator(7, 'lb1', 1)
  const grade = Number(m[1])
  const lb = m[2]!
  const variant = Number(m[3])
  const track: 'hs' | 'rs' | null = topicId.includes('-hs-')
    ? 'hs'
    : topicId.includes('-rs-')
      ? 'rs'
      : null
  if (track && grade >= 7) {
    const gen = osHsRsGen(track, grade, lb)
    const salt = variant * 17 + grade * 3
    return (rng: Rng) => gen(rng, salt)
  }
  return densifyGenerator(grade, lb, variant)
}
