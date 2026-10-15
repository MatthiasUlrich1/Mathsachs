/**
 * Themenreine Mathe-Generatoren (Rechnung/MC) — K5/K6 altersgerecht.
 * Kein TF, keine Zuordnung, keine Lücken. Kein released:true.
 */
import type { Rng } from '../lib/rng'
import { choicePickTask, valueTask } from './taskHelpers'
import { shuffle } from './biologieHelpers'
import type { Topic } from './types'

const Q = 'Lehrplan Mathematik Gymnasium Sachsen'
const U = 'https://www.schulportal.sachsen.de/lplandb/lehrplan/461'
const fw = (text: string) => ({ text, quelle: Q, url: U })

function pick<T>(rng: Rng, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]!
}

/** K5: Rechengesetze und Rechenvorteile — Punkt vor Strich, Distributiv, Vorteile. */
export function generateRechengesetzeK5(rng: Rng): ReturnType<Topic['generate']> {
  const mode = Math.floor(rng() * 4)
  if (mode === 0) {
    const a = 2 + Math.floor(rng() * 8)
    const b = 2 + Math.floor(rng() * 8)
    const c = 2 + Math.floor(rng() * 6)
    const value = a + b * c
    return valueTask({
      question: `Berechne: ${a} + ${b} · ${c}`,
      answerKind: 'integer',
      value,
      solution: String(value),
      explanation: `Zuerst ${b} · ${c} = ${b * c}. Dann ${a} + ${b * c} = ${value}.`,
      fachwissen: fw(
        'Bei gemischten Termen gilt Punkt vor Strich: Multiplikation/Division vor Addition/Subtraktion. Klammern haben Vorrang.',
      ),
      dedupeKey: `ma:k5:gesetze:pvs:${a}:${b}:${c}`,
      contentIds: [`ma:k5:gesetze:pvs:${a}:${b}:${c}`],
    })
  }
  if (mode === 1) {
    const a = 2 + Math.floor(rng() * 7)
    const b = 2 + Math.floor(rng() * 8)
    const c = 1 + Math.floor(rng() * 6)
    const value = a * (b + c)
    return valueTask({
      question: `Berechne: ${a} · (${b} + ${c})`,
      answerKind: 'integer',
      value,
      solution: String(value),
      explanation: `${a}·${b} + ${a}·${c} = ${a * b} + ${a * c} = ${value}.`,
      fachwissen: fw('Distributivgesetz: a·(b+c) = a·b + a·c — hilfreich beim Kopfrechnen.'),
      dedupeKey: `ma:k5:gesetze:dist:${a}:${b}:${c}`,
      contentIds: [`ma:k5:gesetze:dist:${a}:${b}:${c}`],
    })
  }
  if (mode === 2) {
    const a = 3 + Math.floor(rng() * 6)
    const tens = 20 + Math.floor(rng() * 4) * 10 // 20,30,40,50
    const sub = 1 + Math.floor(rng() * 4)
    const value = a * (tens - sub)
    return valueTask({
      question: `Berechne: ${a} · (${tens} − ${sub})`,
      answerKind: 'integer',
      value,
      solution: String(value),
      explanation: `${a}·${tens} − ${a}·${sub} = ${a * tens} − ${a * sub} = ${value}.`,
      fachwissen: fw('Rechenvorteil durch Zerlegen und Distributivgesetz.'),
      dedupeKey: `ma:k5:gesetze:vor:${a}:${tens}:${sub}`,
      contentIds: [`ma:k5:gesetze:vor:${a}:${tens}:${sub}`],
    })
  }
  // mode 3: Klammerterm
  const a = 2 + Math.floor(rng() * 6)
  const b = 2 + Math.floor(rng() * 6)
  const c = 2 + Math.floor(rng() * 5)
  const value = (a + b) * c
  return valueTask({
    question: `Berechne: (${a} + ${b}) · ${c}`,
    answerKind: 'integer',
    value,
    solution: String(value),
    explanation: `Klammern zuerst: ${a}+${b}=${a + b}, dann ${a + b}·${c}=${value}.`,
    fachwissen: fw('Klammern haben Vorrang vor Punkt- und Strichrechnung.'),
    dedupeKey: `ma:k5:gesetze:kl:${a}:${b}:${c}`,
    contentIds: [`ma:k5:gesetze:kl:${a}:${b}:${c}`],
  })
}

/** K6: Endliche und periodische Dezimalzahlen — Umwandeln/Klassifizieren. */
export function generatePeriodischeDezimalK6(rng: Rng): ReturnType<Topic['generate']> {
  const finite = [
    { br: '1/2', dez: '0,5', why: 'Nenner 2' },
    { br: '1/4', dez: '0,25', why: 'Nenner 4 = 2²' },
    { br: '1/5', dez: '0,2', why: 'Nenner 5' },
    { br: '3/4', dez: '0,75', why: 'Nenner 4 = 2²' },
    { br: '2/5', dez: '0,4', why: 'Nenner 5' },
    { br: '1/8', dez: '0,125', why: 'Nenner 8 = 2³' },
    { br: '3/5', dez: '0,6', why: 'Nenner 5' },
    { br: '1/10', dez: '0,1', why: 'Nenner 10 = 2·5' },
  ]
  const period = [
    { br: '1/3', dez: '0,333…', why: 'Nenner 3' },
    { br: '2/3', dez: '0,666…', why: 'Nenner 3' },
    { br: '1/6', dez: '0,1666…', why: 'Nenner 6 = 2·3' },
    { br: '1/9', dez: '0,111…', why: 'Nenner 9 = 3²' },
    { br: '1/7', dez: '0,142857…', why: 'Nenner 7' },
    { br: '1/11', dez: '0,0909…', why: 'Nenner 11' },
    { br: '5/6', dez: '0,8333…', why: 'Nenner 6 = 2·3' },
    { br: '2/9', dez: '0,222…', why: 'Nenner 9' },
  ]

  const mode = Math.floor(rng() * 3)
  if (mode === 0) {
    const row = pick(rng, finite)
    return choicePickTask({
      question: `Welche Dezimalzahl entspricht ${row.br}? Ist sie endlich oder periodisch?`,
      choices: shuffle(rng, [
        `${row.dez} (endlich)`,
        '0,333… (periodisch)',
        '0,142857… (periodisch)',
        'keine Dezimaldarstellung',
      ]).slice(0, 4),
      correct: `${row.dez} (endlich)`,
      solution: `${row.dez} (endlich)`,
      explanation: `${row.br} = ${row.dez}. ${row.why} → nach Kürzen nur 2/5 → endlich.`,
      fachwissen: fw(
        'Endliche Dezimalzahl: Nachkommastellen brechen ab. Gekürzter Nenner nur Primfaktoren 2 und/oder 5.',
      ),
      dedupeKey: `ma:k6:period:fin:${row.br}`,
      contentIds: [`ma:k6:period:fin:${row.br}`],
    })
  }
  if (mode === 1) {
    const row = pick(rng, period)
    return choicePickTask({
      question: `Welche Aussage zu ${row.br} ist richtig?`,
      choices: shuffle(rng, [
        `periodische Dezimalzahl (${row.dez})`,
        'endliche Dezimalzahl 0,5',
        'endliche Dezimalzahl 0,25',
        'nur als gemischte Zahl darstellbar',
      ]).slice(0, 4),
      correct: `periodische Dezimalzahl (${row.dez})`,
      solution: `periodische Dezimalzahl (${row.dez})`,
      explanation: `${row.br} ≈ ${row.dez}. ${row.why} → andere Primfaktoren → periodisch.`,
      fachwissen: fw(
        'Periodische Dezimalzahl: eine Zifferngruppe wiederholt sich unendlich (Periodenstrich).',
      ),
      dedupeKey: `ma:k6:period:per:${row.br}`,
      contentIds: [`ma:k6:period:per:${row.br}`],
    })
  }
  // mode 2: Kriterium
  const askFinite = rng() < 0.5
  if (askFinite) {
    const row = pick(rng, finite)
    return choicePickTask({
      question: `Welcher Bruch ergibt eine endliche Dezimalzahl?`,
      choices: shuffle(rng, [row.br, '1/3', '1/7', '1/9']).slice(0, 4),
      correct: row.br,
      solution: row.br,
      explanation: `${row.br}: ${row.why} — nur 2/5 im Nenner → endlich (${row.dez}).`,
      fachwissen: fw('Kriterium: gekürzter Nenner nur 2 und/oder 5 → endlich.'),
      dedupeKey: `ma:k6:period:crit-f:${row.br}`,
      contentIds: [`ma:k6:period:crit-f:${row.br}`],
    })
  }
  const row = pick(rng, period)
  return choicePickTask({
    question: `Welcher Bruch ergibt eine periodische Dezimalzahl?`,
    choices: shuffle(rng, [row.br, '1/2', '1/4', '1/5']).slice(0, 4),
    correct: row.br,
    solution: row.br,
    explanation: `${row.br}: ${row.why} → periodisch (${row.dez}).`,
    fachwissen: fw('Andere Primfaktoren im Nenner (z. B. 3, 7, 11) → oft periodisch.'),
    dedupeKey: `ma:k6:period:crit-p:${row.br}`,
    contentIds: [`ma:k6:period:crit-p:${row.br}`],
  })
}

/** K5: Natürliche Zahlen vergleichen und ordnen. */
export function generateVergleichenOrdnenK5(rng: Rng): ReturnType<Topic['generate']> {
  const a = 10 + Math.floor(rng() * 80)
  let b = 10 + Math.floor(rng() * 80)
  if (b === a) b = a + 1 + Math.floor(rng() * 5)
  const op = a < b ? '<' : '>'
  const correct = `${a} ${op} ${b}`
  const wrong = [`${a} ${op === '<' ? '>' : '<'} ${b}`, `${a} = ${b}`, `${b} ${op} ${a}`]
  return choicePickTask({
    question: `Vergleiche: Welche Aussage zu ${a} und ${b} ist richtig?`,
    choices: shuffle(rng, [correct, ...wrong]).slice(0, 4),
    correct,
    solution: correct,
    explanation:
      op === '<'
        ? `${a} liegt auf dem Zahlenstrahl links von ${b}.`
        : `${a} liegt rechts von ${b}.`,
    fachwissen: fw(
      'Natürliche Zahlen vergleicht man über Stellenwerte oder den Zahlenstrahl: weiter rechts = größer.',
    ),
    dedupeKey: `ma:k5:vgl:${a}:${b}`,
    contentIds: [`ma:k5:vgl:${a}:${b}`],
  })
}

/** K5: Primfaktorzerlegung — kleine Zahlen. */
export function generatePrimfaktorK5(rng: Rng): ReturnType<Topic['generate']> {
  const pool = [
    { n: 12, z: '2·2·3' },
    { n: 18, z: '2·3·3' },
    { n: 20, z: '2·2·5' },
    { n: 24, z: '2·2·2·3' },
    { n: 28, z: '2·2·7' },
    { n: 30, z: '2·3·5' },
    { n: 36, z: '2·2·3·3' },
    { n: 40, z: '2·2·2·5' },
    { n: 42, z: '2·3·7' },
    { n: 45, z: '3·3·5' },
    { n: 48, z: '2·2·2·2·3' },
    { n: 54, z: '2·3·3·3' },
    { n: 56, z: '2·2·2·7' },
    { n: 60, z: '2·2·3·5' },
  ]
  const row = pick(rng, pool)
  return choicePickTask({
    question: `Wie lautet die Primfaktorzerlegung von ${row.n}?`,
    choices: shuffle(rng, [row.z, '2·9', `${row.n}·1`, '3·3·3']).slice(0, 4),
    correct: row.z,
    solution: row.z,
    explanation: `${row.n} = ${row.z} (nur Primfaktoren).`,
    fachwissen: fw(
      'Primfaktorzerlegung: Produkt aus Primzahlen. Jede natürliche Zahl > 1 hat eine eindeutige Zerlegung.',
    ),
    dedupeKey: `ma:k5:prim:${row.n}`,
    contentIds: [`ma:k5:prim:${row.n}`],
  })
}

/** K5: Echte/unechte Brüche. */
export function generateEchteUnechteBruecheK5(rng: Rng): ReturnType<Topic['generate']> {
  const d = 2 + Math.floor(rng() * 8)
  const n = 1 + Math.floor(rng() * (d + 4))
  const echt = n < d
  const label = echt ? 'echt' : n === d ? 'unecht (Wert 1)' : 'unecht'
  return choicePickTask({
    question: `Ist der Bruch ${n}/${d} echt oder unecht?`,
    choices: shuffle(rng, [
      label,
      echt ? 'unecht' : 'echt',
      'weder echt noch unecht',
      'nur als Dezimalzahl',
    ]).slice(0, 4),
    correct: label,
    solution: label,
    explanation: echt
      ? `Zähler ${n} < Nenner ${d} → echter Bruch (Wert < 1).`
      : `Zähler ${n} ≥ Nenner ${d} → unechter Bruch.`,
    fachwissen: fw(
      'Echter Bruch: Zähler < Nenner. Unechter Bruch: Zähler ≥ Nenner (Wert ≥ 1).',
    ),
    dedupeKey: `ma:k5:echt:${n}/${d}`,
    contentIds: [`ma:k5:echt:${n}/${d}`],
  })
}

/** K5: Bruch ↔ Dezimal ↔ Prozent (einfache Nenner). */
export function generateBruchDezimalProzentK5(rng: Rng): ReturnType<Topic['generate']> {
  const rows = [
    { br: '1/2', dez: '0,5', pct: '50 %' },
    { br: '1/4', dez: '0,25', pct: '25 %' },
    { br: '3/4', dez: '0,75', pct: '75 %' },
    { br: '1/5', dez: '0,2', pct: '20 %' },
    { br: '1/10', dez: '0,1', pct: '10 %' },
    { br: '1/5', dez: '0,2', pct: '20 %' },
  ]
  const row = pick(rng, rows)
  const mode = Math.floor(rng() * 3)
  if (mode === 0) {
    return choicePickTask({
      question: `Welche Dezimalzahl entspricht ${row.br}?`,
      choices: shuffle(rng, [row.dez, '0,3', '1,5', '0,05']).slice(0, 4),
      correct: row.dez,
      solution: row.dez,
      explanation: `${row.br} = ${row.dez}.`,
      fachwissen: fw('Bruch in Dezimalzahl: Zähler durch Nenner teilen.'),
      dedupeKey: `ma:k5:bdp:dez:${row.br}`,
      contentIds: [`ma:k5:bdp:dez:${row.br}`],
    })
  }
  if (mode === 1) {
    return choicePickTask({
      question: `Wie viel Prozent sind ${row.br}?`,
      choices: shuffle(rng, [row.pct, '10 %', '40 %', '80 %']).slice(0, 4),
      correct: row.pct,
      solution: row.pct,
      explanation: `${row.br} = ${row.pct}.`,
      fachwissen: fw('Prozent: Anteil von 100. 1/2 = 50/100 = 50 %.'),
      dedupeKey: `ma:k5:bdp:pct:${row.br}`,
      contentIds: [`ma:k5:bdp:pct:${row.br}`],
    })
  }
  return choicePickTask({
    question: `Welcher Bruch entspricht ${row.pct}?`,
    choices: shuffle(rng, [row.br, '1/3', '2/5', '3/5']).slice(0, 4),
    correct: row.br,
    solution: row.br,
    explanation: `${row.pct} = ${row.br} = ${row.dez}.`,
    fachwissen: fw('Prozent ↔ Bruch ↔ Dezimalzahl sind drei Darstellungen desselben Anteils.'),
    dedupeKey: `ma:k5:bdp:br:${row.pct}`,
    contentIds: [`ma:k5:bdp:br:${row.pct}`],
  })
}

export const MATH_QUALITY_GENERATORS: Record<string, Topic['generate']> = {
  'lb1-rechengesetze': generateRechengesetzeK5,
  'k6-lb1-periodische-dezimal': generatePeriodischeDezimalK6,
  'lb1-vergleichen-ordnen': generateVergleichenOrdnenK5,
  'lb1-primfaktorzerlegung': generatePrimfaktorK5,
  'lb2-echte-unechte-brueche': generateEchteUnechteBruecheK5,
  'lb2-bruch-dezimal-prozent': generateBruchDezimalProzentK5,
}
