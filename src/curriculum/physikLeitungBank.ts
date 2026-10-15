/**
 * K7 LB2 — Leitung in Metallen/Flüssigkeiten/Gasen (Qualitätsbank).
 * Ersetzt Slogan-Stubs („Sicherheit: Wasser und Strom.“) durch prüfbare Aufgaben.
 * Kein released:true.
 */
import { type BioBank } from './biologieBank'
import {
  choicePickTask,
  mixedVariants,
  multiSelectTask,
  valueTask,
} from './taskHelpers'
import { pick, shuffle } from './biologieHelpers'
import type { Rng } from '../lib/rng'
import type { Topic } from './types'

const Q = 'Lehrplan Physik Sachsen — elektrische Leitung'
const U = 'https://www.schulportal.sachsen.de/lplandb/'

function shuffleChoices(rng: Rng, choices: string[], correct: string): string[] {
  const rest = choices.filter((c) => c !== correct)
  const pool = [correct, ...shuffle(rng, rest).slice(0, 3)]
  return shuffle(rng, pool)
}

const fw = (text: string) => ({ text, quelle: Q, url: U })

/** Anwendungs-/Sicherheits-/Modell-Mix — kein Stichwort-TF. */
export const k7LeitungGenerate: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Warum ist der Umgang mit Elektrogeräten mit nassen Händen besonders gefährlich?',
        correct:
          'Feuchtigkeit und gelöste Ionen senken den Widerstand der Haut — Strom kann leichter durch den Körper fließen.',
        wrong: [
          'Wasser speichert elektrische Energie wie ein Akku',
          'Nasse Hände erhöhen den Widerstand und schützen vor Strom',
          'Strom fließt nur durch trockene Metalle, nie durch den Körper',
        ],
        wissen:
          'Leitungswasser und Schweiß enthalten Ionen. Nasse Haut leitet deutlich besser als trockene — deshalb gilt: Elektrogeräte nie mit nassen Händen bedienen.',
      },
      {
        q: 'Welche Aussage zu Leitungswasser und destilliertem Wasser stimmt?',
        correct: 'Leitungswasser leitet wegen gelöster Ionen; reines H₂O leitet kaum.',
        wrong: [
          'Beide leiten gleich gut wie Kupfer',
          'Destilliertes Wasser leitet besser als Salzwasser',
          'Wasser leitet nie, unabhängig von gelösten Stoffen',
        ],
        wissen:
          'Reine Wasser-Moleküle tragen kaum freie Ladungsträger. Ionen aus Salzen/Mineralien machen Leitungswasser leitfähig.',
      },
      {
        q: 'Woran liegt die gute elektrische Leitung in Metallen (Schulmodell)?',
        correct: 'bewegliche freie Elektronen im Metallgitter',
        wrong: [
          'nur an Protonen im Atomkern',
          'nur an Neutrinostrahlung',
          'an ruhenden Neutronen ohne Ladung',
        ],
        wissen:
          'Im Metallgitter können Valenzelektronen sich gerichtet bewegen — das ist das Modell der Elektronenleitung.',
      },
      {
        q: 'Was beschreibt eine Gasentladung (z. B. Blitz) physikalisch am besten?',
        correct: 'Bei hoher Feldstärke werden Luftmoleküle ionisiert — Ladungsträger machen die Luft leitfähig.',
        wrong: [
          'Luft leitet Strom immer so gut wie Kupfer',
          'Blitz entsteht nur durch Magnetismus ohne Ladungen',
          'Gasentladung braucht gar keine Spannung',
        ],
        wissen:
          'Trockene Luft ist ein Isolator. Erst bei Durchschlag (Ionisation) fließt ein Stromstoß — Blitz oder Funken.',
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: c.wissen,
      instruction: 'Wähle die fachlich passende Aussage:',
      fachwissen: fw(c.wissen),
      dedupeKey: `ph:leitung:mc:${c.q.slice(0, 40)}`,
      contentIds: [`ph:leitung:mc:${c.q.slice(0, 40)}`],
    })
  },
  (rng) => {
    const statements = [
      {
        statement:
          'Mit nassen Händen steigen Leitfähigkeit der Haut und Stromgefahr an Elektrogeräten.',
        correct: true,
        wissen:
          'Ionenhaltige Feuchtigkeit verringert den Hautwiderstand — Strom kann gefährlich durch den Körper fließen.',
      },
      {
        statement:
          'Kunststoffisolierung an Leitungen hält Ladungsträger vom Körper fern und schützt vor Stromschlag.',
        correct: true,
        wissen:
          'Isolatoren haben kaum freie Ladungsträger; die Isolierschicht unterbricht den Stromweg.',
      },
      {
        statement: 'Destilliertes Wasser leitet elektrischen Strom genauso gut wie eine Kupferschiene.',
        correct: false,
        wissen:
          'Reines Wasser hat kaum Ionen und leitet schlecht; Metalle leiten über freie Elektronen sehr gut.',
      },
      {
        statement:
          'In Salzlösungen tragen bewegliche Ionen (nicht freie Metallelektronen) den Strom.',
        correct: true,
        wissen:
          'Elektrolytische Leitung: positive und negative Ionen wandern zu den Elektroden.',
      },
    ] as const
    const s = pick(rng, [...statements])
    const label = s.correct ? 'Richtig' : 'Falsch'
    return choicePickTask({
      question: `Stimmt die Aussage?\n\n„${s.statement}“`,
      choices: shuffleChoices(rng, ['Richtig', 'Falsch'], label),
      correct: label,
      solution: label,
      explanation: s.wissen,
      instruction: 'Richtig oder falsch?',
      fachwissen: fw(s.wissen),
      dedupeKey: `ph:leitung:tf:${s.statement.slice(0, 48)}`,
      contentIds: [`ph:leitung:tf:${s.statement.slice(0, 48)}`],
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Stoffe/Situationen gelten im Schulversuch typischerweise als gut leitend? (mehrere möglich)',
      choices: [
        'Kupferdraht',
        'Salzwasser',
        'trockenes Holz',
        'Kunststoffgriff einer Schere',
        'Graphitmine (Bleistift)',
      ],
      correct: ['Kupferdraht', 'Salzwasser', 'Graphitmine (Bleistift)'],
      solution: 'Kupferdraht; Salzwasser; Graphitmine — nicht trockenes Holz/Kunststoff.',
      explanation:
        'Metalle und Graphit leiten über Elektronen; Salzwasser über Ionen. Trockenes Holz und Kunststoff isolieren.',
      instruction: 'Tippe alle zutreffenden Antworten:',
      fachwissen: fw(
        'Leitfähigkeit hängt von freien Ladungsträgern ab: Elektronen in Metallen/Graphit, Ionen in Elektrolyten.',
      ),
      contentIds: ['ph:leitung:multi:stoffe'],
      dedupeKey: 'ph:leitung:multi:stoffe',
    }),
  (rng) => {
    // Einfache Widerstands-/Gefahr-Rechnung: I = U/R mit nasser vs. trockener Haut (Modellwerte).
    const Uvolt = pick(rng, [12, 24, 230])
    const Rdry = pick(rng, [50_000, 100_000, 200_000])
    const Rwet = Math.round(Rdry / pick(rng, [50, 100, 200]))
    const Iwet_mA = Math.round((Uvolt / Rwet) * 1000)
    return valueTask({
      question: `Modellrechnung: Spannung U = ${Uvolt} V, Hautwiderstand nass R = ${Rwet} Ω. Wie groß ist der Strom I in mA? (I = U/R, ganzzahlig runden)`,
      answerKind: 'integer',
      value: Iwet_mA,
      solution: `${Iwet_mA}`,
      explanation: `I = U/R = ${Uvolt}/${Rwet} A ≈ ${Iwet_mA} mA. Zum Vergleich: trocken mit R ≈ ${Rdry} Ω wäre der Strom viel kleiner.`,
      fachwissen: fw(
        `Ohmsches Gesetz I = U/R. Nasse Haut (kleiner R) → größerer Strom bei gleicher Spannung — deshalb Gefahr bei Wasser und Strom.`,
      ),
      dedupeKey: `ph:leitung:calc:${Uvolt}:${Rwet}`,
    })
  },
)

/** Export für Generator-Map (überschreibt Gap-/Thin-Fill). */
export const PHYSIK_LEITUNG_GENERATORS: Record<string, Topic['generate']> = {
  'ph-k7-lb2-leitung': k7LeitungGenerate,
}

/** Referenz-Bank (Tests / spätere Erweiterungen). */
export const k7LeitungBank: BioBank = {
  quelle: Q,
  url: U,
  conceptPrefix: 'ph:leitung',
  trueFalse: [
    {
      concept: 'nass',
      statement:
        'Mit nassen Händen steigen Leitfähigkeit der Haut und Stromgefahr an Elektrogeräten.',
      correct: true,
      explanation: 'Ionenhaltige Feuchtigkeit verringert den Hautwiderstand.',
      wissen:
        'Leitungswasser und Schweiß enthalten Ionen — nasse Haut leitet deutlich besser als trockene.',
    },
  ],
}
