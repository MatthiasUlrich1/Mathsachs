/**
 * OS-Themen, die bisher denselben Gym-Generator teilten → jeweils eigener Pool
 * (Cross-Topic-Duplikate / Themenbindung).
 */
import { pick, randInt } from '../lib/rng'
import { appliedMc, distinctDistractors, generateDrehungK5 } from './mathApplied'
import { mixedVariants, valueTask } from './taskHelpers'
import type { Fachwissen, Topic } from './types'

const fw = (text: string): Fachwissen => ({
  text,
  quelle: 'Lehrplan Oberschule Mathematik Sachsen',
  url: 'https://www.schulportal.sachsen.de/lplandb/index.php?id=67',
})

/** Historische Zahlzeichen — Stellenwert-Idee, nicht Runden. */
export const genOsZahlzeichen: Topic['generate'] = mixedVariants(
  (rng) => {
    const n = randInt(rng, 12, 39)
    const roemisch = (() => {
      const map: [number, string][] = [
        [10, 'X'],
        [9, 'IX'],
        [5, 'V'],
        [4, 'IV'],
        [1, 'I'],
      ]
      let x = n
      let s = ''
      for (const [v, sym] of map) {
        while (x >= v) {
          s += sym
          x -= v
        }
      }
      return s
    })()
    return appliedMc(rng, {
      question: `Welche römische Schreibweise entspricht der Zahl ${n}?`,
      correct: roemisch,
      distractors: distinctDistractors(roemisch, [
        roemisch + 'I',
        'X'.repeat(Math.min(4, Math.floor(n / 10))) + 'I'.repeat(n % 5),
        String(n),
        'V' + 'I'.repeat(n % 5),
      ]),
      explanation: `${n} schreibt man römisch als ${roemisch}.`,
      fachwissen: fw(
        'Römische Zahlen nutzen Zeichen I, V, X, L, C … ohne Stellenwertsystem. Unser Dezimalsystem braucht die Null als Platzhalter.',
      ),
      dedupeKey: `os:zahlzeichen:${n}`,
    })
  },
  (rng) => {
    const h = randInt(rng, 1, 4)
    const z = randInt(rng, 0, 9)
    const e = randInt(rng, 0, 9)
    const n = 100 * h + 10 * z + e
    return valueTask({
      question: `Im Stellenwertsystem: ${h} Hunderter + ${z} Zehner + ${e} Einer. Welche Zahl ist das?`,
      answerKind: 'integer',
      value: n,
      solution: String(n),
      explanation: `${h}·100 + ${z}·10 + ${e} = ${n}.`,
      fachwissen: fw('Im Dezimalsystem bestimmt die Position den Stellenwert (Einer, Zehner, Hunderter, …).'),
      dedupeKey: `os:zahlzeichen:sw:${n}`,
      contentIds: [`os:zahlzeichen:sw:${n}`],
    })
  },
)

/** Abakus: Stellenwerte legen. */
export const genOsAbakus: Topic['generate'] = mixedVariants(
  (rng) => {
    const z = randInt(rng, 1, 8)
    const e = randInt(rng, 0, 9)
    const n = 10 * z + e
    return valueTask({
      question: `Auf dem Abakus liegen ${z} Kugeln auf der Zehnerstange und ${e} auf der Einerstange. Welche Zahl ist dargestellt?`,
      answerKind: 'integer',
      value: n,
      solution: String(n),
      explanation: `${z} Zehner und ${e} Einer ergeben ${n}.`,
      fachwissen: fw('Der Abakus stellt Zahlen über die Anzahl der Kugeln je Stellenwert dar — Vorläufer unseres Stellenwertsystems.'),
      dedupeKey: `os:abakus:${n}`,
      contentIds: [`os:abakus:${n}`],
    })
  },
  (rng) => {
    const n = randInt(rng, 25, 90)
    const z = Math.floor(n / 10)
    return valueTask({
      question: `Wie viele Zehner-Kugeln braucht man auf dem Abakus für die Zahl ${n}?`,
      answerKind: 'integer',
      value: z,
      solution: String(z),
      explanation: `${n} = ${z} Zehner + ${n % 10} Einer.`,
      fachwissen: fw('Zehnerstange und Einerstange trennen die Stellenwerte; Bündelung bei 10 Kugeln.'),
      dedupeKey: `os:abakus:z:${n}`,
      contentIds: [`os:abakus:z:${n}`],
    })
  },
)

/** Stellenwertsysteme vergleichen. */
export const genOsStellenwert: Topic['generate'] = mixedVariants(
  (rng) => {
    const h = randInt(rng, 1, 5)
    const z = randInt(rng, 0, 9)
    const e = randInt(rng, 1, 9)
    return appliedMc(rng, {
      question: `In der Zahl ${h}${z}${e} hat die Ziffer ${h} welchen Stellenwert?`,
      correct: `${h} Hunderter`,
      distractors: [`${h} Zehner`, `${h} Einer`, `${h} Tausender`, `${z} Hunderter`],
      explanation: `Die vordere Ziffer steht in der Hunderterstelle.`,
      fachwissen: fw('Stellenwert = Ziffer · 10^Position. Dieselbe Ziffer bedeutet je nach Position etwas anderes.'),
      dedupeKey: `os:sw:h:${h}${z}${e}`,
    })
  },
  (rng) => {
    const n = randInt(rng, 3, 9)
    return valueTask({
      question: `Wie groß ist der Stellenwert der Ziffer ${n} in der Zahl ${n}04?`,
      answerKind: 'integer',
      value: n * 100,
      solution: String(n * 100),
      explanation: `${n} steht in der Hunderterstelle → ${n}·100 = ${n * 100}. Die 0 ist Platzhalter.`,
      fachwissen: fw('Die Null als Platzhalter hält Stellen frei — ohne sie wären 304 und 34 nicht unterscheidbar.'),
      dedupeKey: `os:sw:val:${n}`,
      contentIds: [`os:sw:val:${n}`],
    })
  },
)

/** Achsensymmetrie erkennen (nicht dieselbe Spiegelungs-Aufgabe wie Geschwisterthemen). */
export const genOsAchsen: Topic['generate'] = mixedVariants(
  (rng) => {
    const fig = pick(rng, [
      ['Quadrat', 4],
      ['gleichseitiges Dreieck', 3],
      ['Rechteck (kein Quadrat)', 2],
      ['gleichschenkliges Dreieck (nicht gleichseitig)', 1],
      ['regelmäßiges Sechseck', 6],
      ['regelmäßiges Achteck', 8],
      ['Parallelogramm (kein Rechteck)', 0],
      ['Kreis', 999],
    ] as const)
    if (fig[1] === 999) {
      return appliedMc(rng, {
        question: 'Wie viele Symmetrieachsen hat ein Kreis?',
        correct: 'unendlich viele',
        distractors: ['1', '2', '4', '0'],
        explanation: 'Jeder Durchmesser ist Symmetrieachse — unendlich viele.',
        fachwissen: fw('Eine Figur ist achsensymmetrisch, wenn sie durch Spiegelung an einer Geraden auf sich selbst abgebildet wird.'),
        dedupeKey: 'os:achsen:kreis',
      })
    }
    return valueTask({
      question: `Wie viele Symmetrieachsen hat ein ${fig[0]}?`,
      answerKind: 'integer',
      value: fig[1],
      solution: String(fig[1]),
      explanation: `Ein ${fig[0]} hat ${fig[1]} Symmetrieachsen.`,
      fachwissen: fw('Regelmäßige n-Ecke haben n Symmetrieachsen. Rechtecke (kein Quadrat) haben 2.'),
      dedupeKey: `os:achsen:${fig[0]}`,
      contentIds: [`os:achsen:${fig[0]}`],
    })
  },
  (rng) => {
    const n = pick(rng, [3, 4, 5, 6, 8])
    return valueTask({
      question: `Ein regelmäßiges ${n}-Eck: Wie viele Symmetrieachsen hat es?`,
      answerKind: 'integer',
      value: n,
      solution: String(n),
      explanation: `Regelmäßiges ${n}-Eck → ${n} Symmetrieachsen.`,
      fachwissen: fw('Bei regelmäßigen n-Ecken gibt es genau n Achsen der Symmetrie.'),
      dedupeKey: `os:achsen:n:${n}`,
      contentIds: [`os:achsen:n:${n}`],
    })
  },
)

/** Deckungsgleichheit: Seiten vergleichen. */
export const genOsDeckung: Topic['generate'] = mixedVariants(
  (rng) => {
    const a = randInt(rng, 3, 9)
    const b = randInt(rng, 3, 9)
    const c = randInt(rng, 3, 9)
    return appliedMc(rng, {
      question: `Dreieck ABC mit Seiten ${a}, ${b}, ${c} und Dreieck DEF mit Seiten ${b}, ${c}, ${a}. Sind sie deckungsgleich?`,
      correct: 'Ja, SSS (gleiche Seitenlängen)',
      distractors: [
        'Nein, Reihenfolge der Seiten ist anders',
        'Nur wenn zusätzlich ein Winkel gleich ist',
        'Nur bei rechtwinkligen Dreiecken',
        'Nein, Flächeninhalte fehlen',
      ],
      explanation: 'SSS: Drei Paare gleicher Seiten ⇒ deckungsgleich (kongruent).',
      fachwissen: fw('Deckungsgleiche (kongruente) Figuren stimmen in allen entsprechenden Seiten und Winkeln überein; SSS ist ein Kongruenzsatz.'),
      dedupeKey: `os:deckung:sss:${a}:${b}:${c}`,
    })
  },
  (rng) => {
    const a = randInt(rng, 4, 10)
    const b = randInt(rng, 4, 10)
    const w = randInt(rng, 30, 80)
    return appliedMc(rng, {
      question: `Zwei Dreiecke haben je zwei Seiten ${a} cm und ${b} cm sowie den eingeschlossenen Winkel ${w}°. Welcher Kongruenzsatz greift?`,
      correct: 'SWS',
      distractors: ['SSS', 'WSW', 'SsW', 'WWW'],
      explanation: `Zwei Seiten und der eingeschlossene Winkel → SWS.`,
      fachwissen: fw('Kongruenzsätze: SSS, SWS, WSW, SsW (mit dem größeren Gegenwinkel zur längeren Seite).'),
      dedupeKey: `os:deckung:sws:${a}:${b}:${w}`,
    })
  },
  (rng) => {
    const u = randInt(rng, 5, 12)
    return valueTask({
      question: `Ein Rechteck 3 cm × 5 cm und ein dazu kongruentes Rechteck: Wie groß ist der Umfang des zweiten in cm?`,
      answerKind: 'integer',
      value: 16,
      solution: '16',
      unit: 'cm',
      explanation: 'Kongruente Figuren haben gleichen Umfang: 2·(3+5) = 16 cm.',
      fachwissen: fw('Deckungsgleiche Figuren stimmen in allen Längenmaßen überein — also auch im Umfang.'),
      dedupeKey: `os:deckung:umfang:${u}`,
      contentIds: [`os:deckung:umfang:16`],
    })
  },
)

/** Spiegelung: Bildpunkt (eigene Zahlen als Spiegelungs-Thema). */
export const genOsSpiegelung: Topic['generate'] = mixedVariants(
  (rng) => {
    const x = randInt(rng, 1, 6)
    const y = randInt(rng, 1, 6)
    return appliedMc(rng, {
      question: `Punkt A(${x}|${y}) wird an der y-Achse gespiegelt. Wohin fällt A'?`,
      correct: `(−${x}|${y})`,
      distractors: [`(${x}|−${y})`, `(−${x}|−${y})`, `(${y}|${x})`, `(${x}|${y})`],
      explanation: `Spiegelung an der y-Achse: (x|y) → (−x|y) = (−${x}|${y}).`,
      fachwissen: fw('Bei Spiegelung an der y-Achse bleibt y gleich, x wechselt das Vorzeichen. An der x-Achse umgekehrt.'),
      dedupeKey: `os:spiegel:y:${x}:${y}`,
    })
  },
  (rng) => {
    const x = randInt(rng, 1, 5)
    const y = randInt(rng, 2, 6)
    return appliedMc(rng, {
      question: `Punkt B(${x}|${y}) wird an der x-Achse gespiegelt. Wohin fällt B'?`,
      correct: `(${x}|−${y})`,
      distractors: [`(−${x}|${y})`, `(−${x}|−${y})`, `(${y}|${x})`, `(0|${y})`],
      explanation: `Spiegelung an der x-Achse: (x|y) → (x|−y).`,
      fachwissen: fw('Die Spiegelungsachse ist die Mittelsenkrechte der Strecke von Punkt zu Bildpunkt.'),
      dedupeKey: `os:spiegel:x:${x}:${y}`,
    })
  },
)

/** Brüche vergleichen K5 — eigene Formulierung gegenüber K6. */
export const genOsBruchVergleichK5: Topic['generate'] = mixedVariants(
  (rng) => {
    const n1 = randInt(rng, 1, 4)
    const n2 = n1 + randInt(rng, 1, 3)
    const d = randInt(rng, n2 + 1, 12)
    return appliedMc(rng, {
      question: `Welcher Bruch ist größer: ${n1}/${d} oder ${n2}/${d}?`,
      correct: `${n2}/${d}`,
      distractors: [`${n1}/${d}`, `${d}/${n1}`, `${d}/${n2}`, 'gleich groß'],
      explanation: `Gleicher Nenner: größerer Zähler ⇒ größerer Bruch. ${n2}/${d} > ${n1}/${d}.`,
      fachwissen: fw('Bei gleichem Nenner entscheidet der Zähler. Bei gleichem Zähler ist der Bruch mit kleinerem Nenner größer.'),
      dedupeKey: `os:k5:bruchvgl:${n1}:${n2}:${d}`,
    })
  },
)

/** Brüche vergleichen K6 — Hauptnenner. */
export const genOsBruchVergleichK6: Topic['generate'] = mixedVariants(
  (rng) => {
    const a = pick(rng, [1, 2, 3])
    const b = pick(rng, [1, 2, 3, 4])
    // compare a/4 vs b/6 over Hauptnenner 12
    const left = a * 3
    const right = b * 2
    const bigger = left === right ? 'gleich groß' : left > right ? `${a}/4` : `${b}/6`
    return appliedMc(rng, {
      question: `Vergleiche ${a}/4 und ${b}/6 (Hauptnenner 12). Welcher Bruch ist größer — oder sind sie gleich?`,
      correct: bigger,
      distractors: distinctDistractors(bigger, [`${a}/4`, `${b}/6`, 'gleich groß', `${a}/6`, `${b}/4`]),
      explanation: `${a}/4 = ${left}/12, ${b}/6 = ${right}/12 ⇒ ${bigger}.`,
      fachwissen: fw('Ungleichnamige Brüche vergleicht man über einen gemeinsamen Nenner (Hauptnenner) oder als Dezimalzahl.'),
      dedupeKey: `os:k6:bruchvgl:${a}:${b}`,
    })
  },
)

/** Parkett: Innenwinkel regelmäßiges n-Eck. */
export const genOsParkett: Topic['generate'] = mixedVariants(
  (rng) => {
    const n = pick(rng, [3, 4, 6])
    const w = ((n - 2) * 180) / n
    return valueTask({
      question: `Welchen Innenwinkel hat ein regelmäßiges ${n}-Eck (für Parkettierung wichtig)?`,
      answerKind: 'integer',
      value: w,
      solution: String(w),
      unit: '°',
      explanation: `Innenwinkel = ((${n} − 2) · 180°) : ${n} = ${w}°.`,
      fachwissen: fw('Parkettierung mit regelmäßigen n-Ecken gelingt, wenn sich Innenwinkel an einer Ecke zu 360° ergänzen.'),
      dedupeKey: `os:parkett:${n}`,
      contentIds: [`os:parkett:${n}`],
    })
  },
  (rng) => {
    const w = pick(rng, [60, 90, 120])
    const count = 360 / w
    return valueTask({
      question: `An einer Ecke eines Parketts stoßen Innenwinkel von je ${w}° zusammen. Wie viele solche Winkel passen um die Ecke?`,
      answerKind: 'integer',
      value: count,
      solution: String(count),
      explanation: `360° : ${w}° = ${count}.`,
      fachwissen: fw('Vollständige Parkettierung: Summe der Innenwinkel um einen Punkt muss 360° ergeben.'),
      dedupeKey: `os:parkett:um:${w}`,
      contentIds: [`os:parkett:um:${w}`],
    })
  },
  (rng) => {
    return appliedMc(rng, {
      question: 'Mit welchem regelmäßigen n-Eck allein kann man die Ebene parkettieren?',
      correct: 'regelmäßiges Sechseck',
      distractors: ['regelmäßiges Fünfeck', 'regelmäßiges Achteck', 'regelmäßiges Siebeneck', 'regelmäßiges Neuneck'],
      explanation: 'Nur Dreieck, Quadrat und regelmäßiges Sechseck parkettieren die Ebene allein.',
      fachwissen: fw('Einfache Parkette: gleichseitiges Dreieck (60°), Quadrat (90°), regelmäßiges Sechseck (120°).'),
      dedupeKey: 'os:parkett:welche',
    })
  },
)

export const OS_CROSS_UNIQUE_GENERATORS: Record<string, Topic['generate']> = {
  'os-k5-lbw1-zahlzeichen': genOsZahlzeichen,
  'os-k5-lbw1-abakus': genOsAbakus,
  'os-k5-lbw1-stellenwert': genOsStellenwert,
  'os-k5-lb4-achsen': genOsAchsen,
  'os-k5-lb4-deckung': genOsDeckung,
  'os-k5-lb4-spiegelung': genOsSpiegelung,
  'os-k5-lb4-drehung': generateDrehungK5,
  'os-k5-lb2-vergleichen': genOsBruchVergleichK5,
  'os-k6-lb1-vergleichen': genOsBruchVergleichK6,
  'os-hs-k7-lbw1-parkett': genOsParkett,
  'os-rs-k7-lbw3-parkett': genOsParkett,
  'os-hs-k7-lbw1-spiegel': genOsSpiegelung,
  'os-rs-k7-lbw3-symmetrie': genOsAchsen,
}
