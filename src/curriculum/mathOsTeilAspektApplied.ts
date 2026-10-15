/**
 * OS/ST Teilaspekt-Themen: echte Rechen-/Anwendungsaufgaben (kein Vokabel-MC).
 * Ersetzt mathBankGenerate-Vokabelbanken in osStLehrplanTeilaspekte.ts.
 */
import { formatDe, roundTo } from '../lib/num'
import { pick, randInt } from '../lib/rng'
import { appliedMc, distinctDistractors } from './mathApplied'
import { mixedVariants, valueTask } from './taskHelpers'
import type { Fachwissen, Topic } from './types'

const fw = (text: string, quelle = 'Lehrplan Oberschule Mathematik Sachsen'): Fachwissen => ({
  text,
  quelle,
  url: 'https://www.schulportal.sachsen.de/lplandb/index.php?id=67',
})

const minus = (n: number) => (n < 0 ? `−${formatDe(-n)}` : formatDe(n))

/** Null in Rechnungen (K5) — nicht „Was sagt der Lehrplan?“. */
export const genOsNull: Topic['generate'] = mixedVariants(
  (rng) => {
    const a = randInt(rng, 12, 80)
    return valueTask({
      question: `Berechne: ${a} + 0`,
      answerKind: 'integer',
      value: a,
      solution: String(a),
      explanation: `Addieren von 0 ändert die Zahl nicht: ${a} + 0 = ${a}.`,
      fachwissen: fw(
        '0 ist die kleinste natürliche Zahl im sächsischen Lehrplan und das neutrale Element der Addition: a + 0 = a. Beim Multiplizieren gilt a · 0 = 0.',
      ),
      dedupeKey: `os:null:add:${a}`,
      contentIds: [`os:null:add:${a}`],
    })
  },
  (rng) => {
    const a = randInt(rng, 3, 15)
    return valueTask({
      question: `Berechne: ${a} · 0`,
      answerKind: 'integer',
      value: 0,
      solution: '0',
      explanation: `Jedes Produkt mit dem Faktor 0 ist 0.`,
      fachwissen: fw('a · 0 = 0 für jede Zahl a. Division durch 0 ist nicht definiert.'),
      dedupeKey: `os:null:mult:${a}`,
      contentIds: [`os:null:mult:${a}`],
    })
  },
  (rng) => {
    const a = randInt(rng, 20, 90)
    return appliedMc(rng, {
      question: `Welche Zahl steht auf dem Zahlenstrahl direkt links von ${a}?`,
      correct: String(a - 1),
      distractors: [String(a + 1), String(a), String(a - 2), '0'],
      explanation: `Der Vorgänger von ${a} ist ${a - 1}. Die Null ist der Vorgänger von 1.`,
      fachwissen: fw('Auf dem Zahlenstrahl liegen die natürlichen Zahlen 0, 1, 2, … mit gleichen Abständen.'),
      dedupeKey: `os:null:vorg:${a}`,
    })
  },
  (rng) => {
    const a = randInt(rng, 5, 40)
    return appliedMc(rng, {
      question: `Wie groß ist ${a} − ${a}?`,
      correct: '0',
      distractors: [String(a), String(2 * a), '1', String(a - 1)],
      explanation: `${a} − ${a} = 0. Die Differenz gleicher Zahlen ist immer 0.`,
      fachwissen: fw('Die Differenz einer Zahl mit sich selbst ist 0 — das zeigt die Rolle der Null als Ergebnis einer Subtraktion.'),
      dedupeKey: `os:null:diff:${a}`,
    })
  },
)

/** Rechengesetze mit konkreten Zahlen (nicht Begriffsabfrage). */
export const genOsRechen: Topic['generate'] = mixedVariants(
  (rng) => {
    const a = randInt(rng, 2, 9)
    const b = randInt(rng, 2, 9)
    const c = randInt(rng, 2, 9)
    const left = a * (b + c)
    return valueTask({
      question: `Berechne: ${a} · (${b} + ${c})`,
      answerKind: 'integer',
      value: left,
      solution: String(left),
      explanation: `${a} · (${b} + ${c}) = ${a} · ${b} + ${a} · ${c} = ${a * b} + ${a * c} = ${left}.`,
      fachwissen: fw('Distributivgesetz: a · (b + c) = a · b + a · c. So kann man Klammern auflösen oder klammern.'),
      dedupeKey: `os:rechen:dist:${a}:${b}:${c}`,
      contentIds: [`os:rechen:dist:${a}:${b}:${c}`],
    })
  },
  (rng) => {
    const a = randInt(rng, 3, 12)
    const b = randInt(rng, 3, 12)
    return appliedMc(rng, {
      question: `Welcher Term hat denselben Wert wie ${a} + ${b}?`,
      correct: `${b} + ${a}`,
      distractors: [`${a} − ${b}`, `${a} · ${b}`, `${a} + ${a}`, `${b} − ${a}`],
      explanation: `Kommutativgesetz der Addition: ${a} + ${b} = ${b} + ${a} = ${a + b}.`,
      fachwissen: fw('Kommutativgesetz: Bei Addition und Multiplikation darf man die Reihenfolge der Summanden bzw. Faktoren vertauschen.'),
      dedupeKey: `os:rechen:komm:${a}:${b}`,
    })
  },
  (rng) => {
    const a = randInt(rng, 2, 6)
    const b = randInt(rng, 2, 6)
    const c = randInt(rng, 2, 6)
    const v = (a + b) + c
    return valueTask({
      question: `Berechne: (${a} + ${b}) + ${c}`,
      answerKind: 'integer',
      value: v,
      solution: String(v),
      explanation: `(${a} + ${b}) + ${c} = ${a + b} + ${c} = ${v}. Assoziativgesetz: Klammern bei reiner Addition darf man umsetzen.`,
      fachwissen: fw('Assoziativgesetz: (a + b) + c = a + (b + c). Dasselbe gilt für die Multiplikation.'),
      dedupeKey: `os:rechen:ass:${a}:${b}:${c}`,
      contentIds: [`os:rechen:ass:${a}:${b}:${c}`],
    })
  },
)

/** Verschiebungsweite in der Ebene. */
export const genOsVerschieb: Topic['generate'] = mixedVariants(
  (rng) => {
    const x = randInt(rng, 1, 6)
    const y = randInt(rng, 1, 6)
    const y2 = y - 2
    return valueTask({
      question: `Punkt A(${x}|${y}) wird um den Vektor (3|−2) verschoben. Wie lautet die x-Koordinate von A'?`,
      answerKind: 'integer',
      value: x + 3,
      solution: String(x + 3),
      explanation: `A'(${x + 3}|${minus(y2)}). Die x-Koordinate nimmt um 3 zu.`,
      fachwissen: fw(
        'Bei einer Verschiebung um den Vektor (a|b) gilt A(x|y) → A′(x + a|y + b). Die Verschiebungsweite ist die Länge des Vektors √(a² + b²).',
      ),
      dedupeKey: `os:versch:x:${x}:${y}`,
      contentIds: [`os:versch:x:${x}:${y}`],
    })
  },
  (rng) => {
    const a = randInt(rng, 3, 9)
    const b = randInt(rng, 3, 9)
    const len = roundTo(Math.sqrt(a * a + b * b), 1)
    return appliedMc(rng, {
      question: `Wie groß ist die Verschiebungsweite des Vektors (${a}|${b})? (auf eine Nachkommastelle)`,
      correct: formatDe(len),
      distractors: distinctDistractors(formatDe(len), [
        formatDe(roundTo(a + b, 1)),
        formatDe(roundTo(Math.abs(a - b), 1)),
        formatDe(roundTo(a * b / 10, 1)),
        formatDe(roundTo(Math.sqrt(a * a + b * b) + 1, 1)),
      ]),
      explanation: `Weite = √(${a}² + ${b}²) = √${a * a + b * b} ≈ ${formatDe(len)}.`,
      fachwissen: fw('Die Länge eines Vektors (a|b) ist √(a² + b²) — das ist die Verschiebungsweite.'),
      dedupeKey: `os:versch:len:${a}:${b}`,
    })
  },
)

/** Zahlenstrahl: Abstände und Positionen. */
export const genOsZahlenstrahl: Topic['generate'] = mixedVariants(
  (rng) => {
    const a = randInt(rng, -8, -1)
    const b = randInt(rng, 1, 8)
    return valueTask({
      question: `Welchen Abstand haben die Zahlen ${minus(a)} und ${minus(b)} auf dem Zahlenstrahl?`,
      answerKind: 'integer',
      value: b - a,
      solution: String(b - a),
      explanation: `Abstand = |${minus(b)} − (${minus(a)})| = ${b - a}.`,
      fachwissen: fw('Der Abstand zweier Zahlen auf dem Zahlenstrahl ist der Betrag ihrer Differenz.'),
      dedupeKey: `os:zs:dist:${a}:${b}`,
      contentIds: [`os:zs:dist:${a}:${b}`],
    })
  },
  (rng) => {
    const a = randInt(rng, 2, 9)
    return appliedMc(rng, {
      question: `Welche Zahl liegt genau in der Mitte zwischen ${minus(-a)} und ${a}?`,
      correct: '0',
      distractors: [String(a), String(-a), '1', String(a / 2)],
      explanation: `Die Mitte zwischen −${a} und ${a} ist 0.`,
      fachwissen: fw('Gegenzahl von a ist −a. Die Null liegt in der Mitte zwischen a und −a.'),
      dedupeKey: `os:zs:mitte:${a}`,
    })
  },
)

/** Negative Zahlen: Rechnen, nicht nur „Ausblick“. */
export const genOsNegAusblick: Topic['generate'] = mixedVariants(
  (rng) => {
    const a = randInt(rng, 2, 12)
    const b = randInt(rng, 2, 12)
    return valueTask({
      question: `Berechne: ${minus(-a)} + ${minus(-b)}`,
      answerKind: 'integer',
      value: -(a + b),
      solution: minus(-(a + b)),
      explanation: `(−${a}) + (−${b}) = −${a + b}.`,
      fachwissen: fw('Zwei negative Summanden ergeben eine negative Summe. Vorzeichenregeln gelten auch auf dem Zahlenstrahl.'),
      dedupeKey: `os:neg:add:${a}:${b}`,
      contentIds: [`os:neg:add:${a}:${b}`],
    })
  },
  (rng) => {
    const a = randInt(rng, 3, 15)
    const b = randInt(rng, 1, a - 1)
    return valueTask({
      question: `Berechne: ${minus(-a)} + ${b}`,
      answerKind: 'integer',
      value: -a + b,
      solution: minus(-a + b),
      explanation: `(−${a}) + ${b} = ${minus(-a + b)}.`,
      fachwissen: fw('Beim Addieren einer positiven Zahl zu einer negativen Zahl bewegt man sich auf dem Zahlenstrahl nach rechts.'),
      dedupeKey: `os:neg:mix:${a}:${b}`,
      contentIds: [`os:neg:mix:${a}:${b}`],
    })
  },
)

/** Chance / relative Häufigkeit. */
export const genOsHsChancen: Topic['generate'] = mixedVariants(
  (rng) => {
    const gunstig = randInt(rng, 1, 5)
    const total = randInt(rng, gunstig + 2, 12)
    const p = roundTo(gunstig / total, 3)
    return appliedMc(rng, {
      question: `In einer Urne liegen ${gunstig} rote und ${total - gunstig} blaue Kugeln. Wie groß ist die Wahrscheinlichkeit, zufällig eine rote zu ziehen?`,
      correct: `${gunstig}/${total}`,
      distractors: [`${total - gunstig}/${total}`, `${gunstig}/${total - gunstig}`, `${total}/${gunstig}`, formatDe(p)],
      explanation: `P(rot) = Anzahl rot : Gesamt = ${gunstig}/${total}.`,
      fachwissen: fw('Laplace-Wahrscheinlichkeit: P = Anzahl günstiger Ergebnisse : Anzahl aller gleichmöglichen Ergebnisse.'),
      dedupeKey: `os:chance:${gunstig}:${total}`,
    })
  },
  (rng) => {
    const n = randInt(rng, 20, 80)
    const k = randInt(rng, 4, Math.floor(n / 2))
    const pct = roundTo((100 * k) / n, 0)
    return valueTask({
      question: `Bei ${n} Würfen erschien die Sechs ${k}-mal. Wie groß ist die relative Häufigkeit in Prozent (ganze Zahl)?`,
      answerKind: 'integer',
      value: pct,
      solution: String(pct),
      unit: '%',
      explanation: `h = ${k}/${n} ≈ ${formatDe(pct)} %.`,
      fachwissen: fw('Relative Häufigkeit = absolute Häufigkeit : Anzahl der Versuche. In Prozent: mit 100 multiplizieren.'),
      dedupeKey: `os:chance:h:${n}:${k}`,
      contentIds: [`os:chance:h:${n}:${k}`],
    })
  },
)

/** Zahlbereichserweiterung: Betrag, Gegenzahl. */
export const genOsHsErweit: Topic['generate'] = mixedVariants(
  (rng) => {
    const a = -randInt(rng, 5, 25)
    return valueTask({
      question: `Berechne den Betrag |${minus(a)}|.`,
      answerKind: 'integer',
      value: Math.abs(a),
      solution: String(Math.abs(a)),
      explanation: `|${minus(a)}| = ${Math.abs(a)}.`,
      fachwissen: fw('Der Betrag |a| ist der Abstand von a zur 0 auf dem Zahlenstrahl — immer ≥ 0.'),
      dedupeKey: `os:erweit:abs:${a}`,
      contentIds: [`os:erweit:abs:${a}`],
    })
  },
  (rng) => {
    let a = randInt(rng, -20, 20)
    while (a === 0) a = randInt(rng, -20, 20)
    return valueTask({
      question: `Wie lautet die Gegenzahl zu ${minus(a)}?`,
      answerKind: 'integer',
      value: -a,
      solution: minus(-a),
      explanation: `Gegenzahl von ${minus(a)} ist ${minus(-a)}, denn ${minus(a)} + (${minus(-a)}) = 0.`,
      fachwissen: fw('Die Gegenzahl −a erfüllt a + (−a) = 0. Für positive a ist −a negativ und umgekehrt.'),
      dedupeKey: `os:erweit:geg:${a}`,
      contentIds: [`os:erweit:geg:${a}`],
    })
  },
)

/** Oberfläche Verpackung (Quader). */
export const genOsHsVerpackung: Topic['generate'] = mixedVariants(
  (rng) => {
    const l = randInt(rng, 4, 12)
    const b = randInt(rng, 3, 10)
    const h = randInt(rng, 2, 8)
    const o = 2 * (l * b + l * h + b * h)
    return valueTask({
      question: `Eine quaderförmige Schachtel misst ${l} cm × ${b} cm × ${h} cm. Wie groß ist die Oberfläche in cm²?`,
      answerKind: 'integer',
      value: o,
      solution: String(o),
      unit: 'cm²',
      explanation: `O = 2·(${l}·${b} + ${l}·${h} + ${b}·${h}) = ${o} cm².`,
      fachwissen: fw('Oberfläche eines Quaders: O = 2(ab + ac + bc). Das ist die benötigte Verpackungsfläche ohne Überlappung.'),
      dedupeKey: `os:verp:o:${l}:${b}:${h}`,
      contentIds: [`os:verp:o:${l}:${b}:${h}`],
    })
  },
)

/** Kredit: Zinsen. */
export const genOsHsKredit: Topic['generate'] = mixedVariants(
  (rng) => {
    const K = randInt(rng, 5, 20) * 100
    const p = pick(rng, [2, 3, 4, 5, 6])
    const z = roundTo((K * p) / 100, 2)
    return valueTask({
      question: `Ein Kredit von ${K} € wird ein Jahr mit ${p} % verzinst. Wie hoch sind die Zinsen in €?`,
      answerKind: 'decimal',
      value: z,
      solution: formatDe(z),
      unit: '€',
      explanation: `Z = K · p / 100 = ${K} · ${p} / 100 = ${formatDe(z)} €.`,
      fachwissen: fw('Jahreszinsen: Z = K · p / 100 mit Kapital K und Zinssatz p in Prozent.'),
      dedupeKey: `os:kredit:z:${K}:${p}`,
      contentIds: [`os:kredit:z:${K}:${p}`],
    })
  },
  (rng) => {
    const K = randInt(rng, 8, 25) * 100
    const p = pick(rng, [3, 4, 5])
    const jahre = randInt(rng, 2, 4)
    const end = roundTo(K * (1 + p / 100) ** jahre, 2)
    return appliedMc(rng, {
      question: `${K} € werden ${jahre} Jahre zu ${p} % Zinseszins angelegt. Welcher Endwert ist richtig (auf Cent)?`,
      correct: formatDe(end),
      distractors: distinctDistractors(formatDe(end), [
        formatDe(roundTo(K + (K * p * jahre) / 100, 2)),
        formatDe(roundTo(K * (1 + (p * jahre) / 100), 2)),
        formatDe(roundTo(K * (1 + p / 100), 2)),
        formatDe(roundTo(end + 50, 2)),
      ]),
      explanation: `Kₙ = K · (1 + p/100)ⁿ = ${K} · (1 + ${p}/100)^${jahre} ≈ ${formatDe(end)} €.`,
      fachwissen: fw('Zinseszins: Kₙ = K · (1 + p/100)ⁿ. Jedes Jahr wird das Kapital inklusive bisheriger Zinsen verzinst.'),
      dedupeKey: `os:kredit:zz:${K}:${p}:${jahre}`,
    })
  },
)

/** Formel umstellen. */
export const genOsHsFormel: Topic['generate'] = mixedVariants(
  (rng) => {
    const a = randInt(rng, 2, 9)
    const b = randInt(rng, 3, 12)
    // s = v · t  →  t = s / v
    const s = a * b
    return valueTask({
      question: `Aus s = v · t folgt bei s = ${s} und v = ${a}: Wie groß ist t?`,
      answerKind: 'integer',
      value: b,
      solution: String(b),
      explanation: `t = s : v = ${s} : ${a} = ${b}.`,
      fachwissen: fw('Formeln umstellen heißt, die gesuchte Größe durch Äquivalenzumformungen allein auf eine Seite zu bringen.'),
      dedupeKey: `os:formel:t:${s}:${a}`,
      contentIds: [`os:formel:t:${s}:${a}`],
    })
  },
  (rng) => {
    const u = randInt(rng, 2, 8)
    const a = randInt(rng, 3, 10)
    // A = u · a / 2  (Dreieck) → a = 2A / u
    const A = (u * a) / 2
    return valueTask({
      question: `Ein Dreieck hat Flächeninhalt A = ${formatDe(A)} und Grundseite u = ${u}. Wie groß ist die Höhe a? (A = u · a : 2)`,
      answerKind: 'integer',
      value: a,
      solution: String(a),
      explanation: `a = 2A : u = ${formatDe(2 * A)} : ${u} = ${a}.`,
      fachwissen: fw('Aus A = (u · a) / 2 folgt a = 2A / u — zuerst mit 2 multiplizieren, dann durch u dividieren.'),
      dedupeKey: `os:formel:a:${A}:${u}`,
      contentIds: [`os:formel:a:${A}:${u}`],
    })
  },
)

/** Tarif: lineare Kosten. */
export const genOsHsTarif: Topic['generate'] = mixedVariants(
  (rng) => {
    const g = randInt(rng, 5, 15)
    const p = randInt(rng, 2, 8)
    const x = randInt(rng, 3, 12)
    const k = g + p * x
    return valueTask({
      question: `Ein Tarif kostet ${g} € Grundgebühr plus ${p} € pro Einheit. Was kostet die Nutzung von ${x} Einheiten?`,
      answerKind: 'integer',
      value: k,
      solution: String(k),
      unit: '€',
      explanation: `K = ${g} + ${p} · ${x} = ${k} €.`,
      fachwissen: fw('Linearer Tarif: K(x) = g + p · x mit Grundgebühr g und Preis pro Einheit p.'),
      dedupeKey: `os:tarif:${g}:${p}:${x}`,
      contentIds: [`os:tarif:${g}:${p}:${x}`],
    })
  },
)

/** Venn: Anzahlen. */
export const genOsRsVenn: Topic['generate'] = mixedVariants(
  (rng) => {
    const onlyA = randInt(rng, 3, 10)
    const onlyB = randInt(rng, 3, 10)
    const both = randInt(rng, 1, 6)
    const union = onlyA + onlyB + both
    return valueTask({
      question: `${onlyA} Schüler mögen nur Mathe, ${onlyB} nur Sport, ${both} beide Fächer. Wie viele mögen mindestens eines der beiden Fächer?`,
      answerKind: 'integer',
      value: union,
      solution: String(union),
      explanation: `|A ∪ B| = nur A + nur B + beide = ${union}.`,
      fachwissen: fw('|A ∪ B| = |A| + |B| − |A ∩ B|. Hier sind die Teile „nur A“, „nur B“ und „beide“ schon getrennt.'),
      dedupeKey: `os:venn:${onlyA}:${onlyB}:${both}`,
      contentIds: [`os:venn:${onlyA}:${onlyB}:${both}`],
    })
  },
)

/** Zweitafel: Koordinaten. */
export const genOsRsZweitafel: Topic['generate'] = mixedVariants(
  (rng) => {
    let x = randInt(rng, 1, 6)
    let y = randInt(rng, 1, 6)
    let z = randInt(rng, 1, 5)
    // Koordinaten paarweise verschieden → Distraktoren bleiben unterscheidbar
    while (y === x) y = randInt(rng, 1, 6)
    while (z === x || z === y) z = randInt(rng, 1, 6)
    return appliedMc(rng, {
      question: `Im Zweitafelbild liegt der Grundriss bei (${x}|${y}) und die Höhe ist ${z}. Welche Raumkoordinate hat der Punkt?`,
      correct: `(${x}|${y}|${z})`,
      distractors: [`(${x}|${z}|${y})`, `(${y}|${x}|${z})`, `(${x}|${y}|0)`, `(${z}|${y}|${x})`],
      explanation: `Raumkoordinaten = (Grundriss-x | Grundriss-y | Höhe) = (${x}|${y}|${z}).`,
      fachwissen: fw('Im Zweitafelbild liest man aus dem Grundriss x und y, aus dem Aufriss die Höhe z.'),
      dedupeKey: `os:zweitafel:${x}:${y}:${z}`,
    })
  },
)

/** Definitionsbereich linear/gebrochen. */
export const genOsRsDef: Topic['generate'] = mixedVariants(
  (rng) => {
    const a = randInt(rng, 2, 9)
    return appliedMc(rng, {
      question: `Für welche x ist f(x) = 1 / (x − ${a}) definiert?`,
      correct: `alle x außer ${a}`,
      distractors: [`nur x = ${a}`, `alle x außer 0`, `nur x > ${a}`, `alle ganzen x`],
      explanation: `Nenner ≠ 0 ⇒ x − ${a} ≠ 0 ⇒ x ≠ ${a}.`,
      fachwissen: fw('Bei gebrochenrationalen Funktionen gehören alle x, die einen Nenner 0 erzeugen, nicht zum Definitionsbereich.'),
      dedupeKey: `os:def:${a}`,
    })
  },
  (rng) => {
    const a = randInt(rng, 1, 6)
    const b = a + randInt(rng, 1, 4)
    return appliedMc(rng, {
      question: `f(x) = 1 / ((x − ${a})(x − ${b})). Welche x gehören nicht zu D?`,
      correct: `x = ${a} und x = ${b}`,
      distractors: [`nur x = ${a}`, `nur x = ${b}`, `x = 0`, `keine Einschränkung`],
      explanation: `Beide Linearfaktoren im Nenner dürfen nicht 0 sein.`,
      fachwissen: fw('Jede Nullstelle des Nenners ist eine Definitionslücke (sofern nicht kürzbar).'),
      dedupeKey: `os:def:2:${a}:${b}`,
    })
  },
  (rng) => {
    return appliedMc(rng, {
      question: 'Für welche x ist f(x) = √(x − 3) in den reellen Zahlen definiert?',
      correct: 'x ≥ 3',
      distractors: ['x > 3', 'x ≤ 3', 'alle reellen x', 'x ≠ 3'],
      explanation: 'Radikand ≥ 0 ⇒ x − 3 ≥ 0 ⇒ x ≥ 3.',
      fachwissen: fw('Bei Wurzelfunktionen muss der Radikand ≥ 0 sein (reelle Zahlen).'),
      dedupeKey: 'os:def:sqrt3',
    })
  },
)

/** Sekante / Steigung. */
export const genOsRsSekante: Topic['generate'] = mixedVariants(
  (rng) => {
    const x1 = randInt(rng, 0, 3)
    const x2 = x1 + randInt(rng, 2, 5)
    const y1 = randInt(rng, 0, 6)
    const m = pick(rng, [-2, -1, 1, 2, 3])
    const y2 = y1 + m * (x2 - x1)
    return valueTask({
      question: `Die Sekante durch P(${x1}|${y1}) und Q(${x2}|${y2}) hat welche Steigung m?`,
      answerKind: 'integer',
      value: m,
      solution: String(m),
      explanation: `m = (${y2} − ${y1}) : (${x2} − ${x1}) = ${m}.`,
      fachwissen: fw('Sekantensteigung m = Δy / Δx. Die Tangente ist der Grenzfall, wenn Q gegen P rückt.'),
      dedupeKey: `os:sek:${x1}:${y1}:${x2}:${y2}`,
      contentIds: [`os:sek:${x1}:${y1}:${x2}:${y2}`],
    })
  },
)

/** Abhängige / unabhängige Größe. */
export const genOsRsAbhaengig: Topic['generate'] = mixedVariants(
  (rng) => {
    const m = randInt(rng, 2, 6)
    const x = randInt(rng, 3, 10)
    const y = m * x
    return valueTask({
      question: `y hängt linear von x ab: y = ${m} · x. Welchen y-Wert erhält man für x = ${x}?`,
      answerKind: 'integer',
      value: y,
      solution: String(y),
      explanation: `y = ${m} · ${x} = ${y}. x ist unabhängig, y abhängig.`,
      fachwissen: fw('Die unabhängige Größe wählt man frei (oft x); die abhängige Größe y wird dadurch bestimmt.'),
      dedupeKey: `os:abh:${m}:${x}`,
      contentIds: [`os:abh:${m}:${x}`],
    })
  },
)

/** Lebenshaltungskosten / Prozent. */
export const genOsRsLeben: Topic['generate'] = mixedVariants(
  (rng) => {
    const basis = randInt(rng, 8, 20) * 50
    const p = pick(rng, [5, 8, 10, 12, 15])
    const neu = roundTo(basis * (1 + p / 100), 2)
    return valueTask({
      question: `Die monatlichen Kosten steigen von ${basis} € um ${p} %. Wie hoch sind sie danach?`,
      answerKind: 'decimal',
      value: neu,
      solution: formatDe(neu),
      unit: '€',
      explanation: `Neu = ${basis} · (1 + ${p}/100) = ${formatDe(neu)} €.`,
      fachwissen: fw('Prozentuale Änderung: neuer Wert = alter Wert · (1 ± p/100).'),
      dedupeKey: `os:leben:${basis}:${p}`,
      contentIds: [`os:leben:${basis}:${p}`],
    })
  },
)

/** Monotonie linear. */
export const genOsRsMono: Topic['generate'] = mixedVariants(
  (rng) => {
    const m = pick(rng, [-3, -2, -1, 1, 2, 3])
    const n = randInt(rng, -4, 4)
    return appliedMc(rng, {
      question: `Die Funktion f(x) = ${m}x ${n >= 0 ? '+' : '−'} ${Math.abs(n)} ist …`,
      correct: m > 0 ? 'streng monoton steigend' : 'streng monoton fallend',
      distractors: [
        m > 0 ? 'streng monoton fallend' : 'streng monoton steigend',
        'weder steigend noch fallend',
        'nur für x > 0 definiert',
        'konstant',
      ],
      explanation: `Steigung m = ${m} ${m > 0 ? '> 0 ⇒ streng monoton steigend' : '< 0 ⇒ streng monoton fallend'}.`,
      fachwissen: fw('Bei linearen Funktionen f(x) = mx + n entscheidet das Vorzeichen von m über die Monotonie.'),
      dedupeKey: `os:mono:${m}:${n}`,
    })
  },
  (rng) => {
    const m = pick(rng, [2, 3, 4, 5])
    return valueTask({
      question: `f(x) = ${m}x − 1. Um wie viel steigt f, wenn x um 1 wächst?`,
      answerKind: 'integer',
      value: m,
      solution: String(m),
      explanation: `Die Steigung ist ${m}; bei Δx = 1 steigt f um ${m}.`,
      fachwissen: fw('Bei streng monoton steigenden linearen Funktionen ist m > 0; der Zuwachs pro Einheit ist genau m.'),
      dedupeKey: `os:mono:delta:${m}`,
      contentIds: [`os:mono:delta:${m}`],
    })
  },
  (rng) => {
    const x1 = randInt(rng, 1, 4)
    const x2 = x1 + randInt(rng, 2, 5)
    const y1 = randInt(rng, 0, 6)
    const m = pick(rng, [1, 2, 3, -1, -2])
    const y2 = y1 + m * (x2 - x1)
    return appliedMc(rng, {
      question: `Die Werte (x|y) = (${x1}|${y1}) und (${x2}|${y2}) liegen auf einer Geraden. Ist f dort streng monoton steigend oder fallend?`,
      correct: m > 0 ? 'streng monoton steigend' : 'streng monoton fallend',
      distractors: [
        m > 0 ? 'streng monoton fallend' : 'streng monoton steigend',
        'konstant',
        'weder noch',
        'nur im Ursprung definiert',
      ],
      explanation: `Δy/Δx = ${m} ${m > 0 ? '> 0 (steigend)' : '< 0 (fallend)'}.`,
      fachwissen: fw('Monotonie linearer Funktionen liest man an der Steigung m = Δy/Δx ab.'),
      dedupeKey: `os:mono:pts:${x1}:${y1}:${x2}:${y2}`,
    })
  },
  (rng) => {
    return appliedMc(rng, {
      question: 'Welche Funktion ist streng monoton fallend?',
      correct: 'f(x) = −2x + 5',
      distractors: ['f(x) = 2x + 5', 'f(x) = 0 · x + 3', 'f(x) = x²', 'f(x) = |x|'],
      explanation: 'Negatives m = −2 ⇒ streng monoton fallend.',
      fachwissen: fw('f(x) = mx + n ist streng monoton fallend genau dann, wenn m < 0.'),
      dedupeKey: 'os:mono:which-fall',
    })
  },
)

/** Sinus-Parameter: Periode. */
export const genOsRsSinus: Topic['generate'] = mixedVariants(
  (rng) => {
    const b = pick(rng, [2, 3, 4, 5, 6])
    const periode = roundTo(360 / b, 1)
    return valueTask({
      question: `f(x) = sin(${b}x) mit x in Grad. Wie groß ist die Periode in Grad?`,
      answerKind: 'decimal',
      value: periode,
      solution: formatDe(periode),
      unit: '°',
      explanation: `Periode = 360° / |b| = 360 / ${b} = ${formatDe(periode)}°.`,
      fachwissen: fw('Bei f(x) = a · sin(b(x − c)) + d ist die Periode 360°/|b| (Gradmaß) bzw. 2π/|b| (Bogenmaß).'),
      dedupeKey: `os:sinus:p:${b}`,
      contentIds: [`os:sinus:p:${b}`],
    })
  },
  (rng) => {
    const a = pick(rng, [2, 3, 4])
    return valueTask({
      question: `f(x) = ${a} · sin(x). Wie groß ist die Amplitude?`,
      answerKind: 'integer',
      value: a,
      solution: String(a),
      explanation: `Amplitude = |a| = ${a}.`,
      fachwissen: fw('Die Amplitude |a| gibt die maximale Auslenkung der Sinusfunktion an.'),
      dedupeKey: `os:sinus:amp:${a}`,
      contentIds: [`os:sinus:amp:${a}`],
    })
  },
  (rng) => {
    const c = pick(rng, [30, 45, 60, 90])
    return appliedMc(rng, {
      question: `g(x) = sin(x − ${c}°) entsteht aus sin(x) durch …`,
      correct: `Verschiebung um ${c}° nach rechts`,
      distractors: [
        `Verschiebung um ${c}° nach links`,
        `Streckung mit Faktor ${c}`,
        `Verschiebung um ${c}° nach oben`,
        'Spiegelung an der x-Achse',
      ],
      explanation: `f(x − c) verschiebt den Graphen um c nach rechts.`,
      fachwissen: fw('Phase: sin(x − c) ist gegenüber sin(x) um c nach rechts verschoben (c > 0).'),
      dedupeKey: `os:sinus:phase:${c}`,
    })
  },
)

/** Gewinnchance. */
export const genOsRsGewinn: Topic['generate'] = mixedVariants(
  (rng) => {
    const win = randInt(rng, 1, 4)
    const total = randInt(rng, win + 3, 12)
    return appliedMc(rng, {
      question: `Ein Glücksrad hat ${total} gleiche Felder, davon ${win} Gewinnfelder. Wie groß ist die Gewinnwahrscheinlichkeit?`,
      correct: `${win}/${total}`,
      distractors: [`${total}/${win}`, `${win}/${total - win}`, `${total - win}/${total}`, '1'],
      explanation: `P(Gewinn) = ${win}/${total}.`,
      fachwissen: fw('Gewinnwahrscheinlichkeit = Anzahl der Gewinnfelder : Anzahl aller gleichgroßen Felder.'),
      dedupeKey: `os:gewinn:${win}:${total}`,
    })
  },
)

/** Abgaben / Prozent vom Brutto. */
export const genOsRsAbgaben: Topic['generate'] = mixedVariants(
  (rng) => {
    const brutto = randInt(rng, 20, 40) * 50
    const p = pick(rng, [15, 20, 25, 30])
    const ab = roundTo((brutto * p) / 100, 2)
    return valueTask({
      question: `Vom Brutto ${brutto} € werden ${p} % Abgaben einbehalten. Wie viel € sind das?`,
      answerKind: 'decimal',
      value: ab,
      solution: formatDe(ab),
      unit: '€',
      explanation: `Abgaben = ${brutto} · ${p} / 100 = ${formatDe(ab)} €.`,
      fachwissen: fw('Prozentwert = Grundwert · Prozentsatz / 100. Netto = Brutto − Abgaben.'),
      dedupeKey: `os:abgaben:${brutto}:${p}`,
      contentIds: [`os:abgaben:${brutto}:${p}`],
    })
  },
)

/** Differentialrechnung ST: Ableitung polynomial. */
export const genOsStDiff: Topic['generate'] = mixedVariants(
  (rng) => {
    const a = randInt(rng, 2, 6)
    const b = randInt(rng, 1, 8)
    // f(x) = a x² + b x  → f' = 2a x + b; Wert bei x0
    const x0 = randInt(rng, 1, 4)
    const fp = 2 * a * x0 + b
    return valueTask({
      question: `f(x) = ${a}x² + ${b}x. Berechne f'(${x0}).`,
      answerKind: 'integer',
      value: fp,
      solution: String(fp),
      explanation: `f'(x) = ${2 * a}x + ${b}, also f'(${x0}) = ${2 * a}·${x0} + ${b} = ${fp}.`,
      fachwissen: fw(
        'Ableitung: Potenzregel (xⁿ)′ = n·xⁿ⁻¹. f′(x₀) ist die Steigung der Tangente an den Graphen im Punkt x₀.',
        'Lehrplan Gymnasium Sachsen-Anhalt',
      ),
      dedupeKey: `st:diff:${a}:${b}:${x0}`,
      contentIds: [`st:diff:${a}:${b}:${x0}`],
    })
  },
  (rng) => {
    let m = randInt(rng, -5, 5)
    while (m === 0) m = randInt(rng, -5, 5)
    return appliedMc(rng, {
      question: `Die Tangente an f im Punkt x₀ hat die Steigung ${m}. Welcher Wert ist f'(x₀)?`,
      correct: String(m),
      distractors: distinctDistractors(String(m), [String(-m), String(m + 1), String(m - 1), '0', String(2 * m)]),
      explanation: `Nach Definition ist f'(x₀) genau die Tangentensteigung, also ${m}.`,
      fachwissen: fw(
        'Geometrisch ist f′(x₀) die Steigung der Tangente an y = f(x) im Punkt (x₀|f(x₀)).',
        'Lehrplan Gymnasium Sachsen-Anhalt',
      ),
      dedupeKey: `st:diff:tang:${m}`,
    })
  },
)

export const OS_TEILASPEKT_APPLIED_GENERATORS: Record<string, Topic['generate']> = {
  'os-k5-lb1-null': genOsNull,
  'os-k5-lb1-rechengesetze': genOsRechen,
  'os-k5-lb4-verschiebungsweite': genOsVerschieb,
  'os-k6-lb1-zahlenstrahl': genOsZahlenstrahl,
  'os-k6-lb1-negative-ausblick': genOsNegAusblick,
  'os-hs-k7-lb2-chancen': genOsHsChancen,
  'os-hs-k7-lb3-zahlerweiterung': genOsHsErweit,
  'os-hs-k7-lb4-verpackung': genOsHsVerpackung,
  'os-hs-k8-lb1-kredit': genOsHsKredit,
  'os-hs-k9-lb2-formel-umstellen': genOsHsFormel,
  'os-hs-k9-lb3-tarif': genOsHsTarif,
  'os-rs-k7-lb3-venn': genOsRsVenn,
  'os-rs-k7-lb4-zweitafel': genOsRsZweitafel,
  'os-rs-k8-lb2-definitionsbereich': genOsRsDef,
  'os-rs-k8-lb3-sekante-tangente': genOsRsSekante,
  'os-rs-k8-lb5-abhaengig': genOsRsAbhaengig,
  'os-rs-k8-lb6-lebenshaltung': genOsRsLeben,
  'os-rs-k9-lb3-monotonie': genOsRsMono,
  'os-rs-k10-lb2-sinus-parameter': genOsRsSinus,
  'os-rs-k10-lb3-gewinnchance': genOsRsGewinn,
  'os-rs-k10-lb4-abgaben': genOsRsAbgaben,
  'st-k1112-differential': genOsStDiff,
  // Alias RS-Tarif
  'os-rs-k8-lb2-tarif': genOsHsTarif,
}
