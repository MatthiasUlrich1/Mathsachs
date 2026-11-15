/**
 * Hand-written scenarios for the pie chart interaction (pieChartTask), used by the Neu-Themen
 * "Relative Häufigkeit in Prozent", "In Prozent umwandeln" and "Prozent einer Größe berechnen" (Klasse 6).
 * Count scenarios give absolute numbers (the learner converts them to percent: totals 20, 25, 40 and 50 make
 * every share a multiple of 5 %); percent scenarios give the shares directly.
 */
import { randInt, type Rng } from '../lib/rng'
import { bcFormatNumber } from '../lib/barChartLogic'
import { pieChartTableSvg } from '../lib/pieChartLogic'
import { pieChartTask } from './interactionTaskHelpers'
import type { Task } from './types'

export interface CountSurvey {
  id: string
  /** Who was asked what; states the total, but never a percent. */
  context: string
  /** Heading of the table and name of its first column. */
  head: string
  categories: string[]
  counts: number[]
}

export interface PercentSurvey {
  id: string
  /** What is shared out; the shares themselves stand in the table. */
  context: string
  head: string
  /** Header of the first column. */
  colLeft: string
  categories: string[]
  percents: number[]
  /** Optional amount (in euro) that is shared; the explanation then names the amount of every part. */
  euro?: number
}

export const COUNT_SURVEYS: CountSurvey[] = [
  {
    id: 'pause6a',
    context: 'In der Klasse 6a wurden 20 Kinder gefragt, was sie in der großen Pause am liebsten essen.',
    head: 'Pausenessen',
    categories: ['Obst', 'Brötchen', 'Müsliriegel', 'Nichts'],
    counts: [9, 6, 3, 2],
  },
  {
    id: 'schulweg6b',
    context: 'Bei einer Umfrage in der Jahrgangsstufe 6 wurden 40 Kinder gefragt, wie sie morgens zur Schule kommen.',
    head: 'Weg zur Schule',
    categories: ['Zu Fuß', 'Fahrrad', 'Bus', 'Auto'],
    counts: [14, 10, 12, 4],
  },
  {
    id: 'tier6c',
    context: 'In der Klasse 6c wurden 25 Kinder gefragt, welches Haustier sie haben (ein Tier pro Kind oder keins).',
    head: 'Haustier',
    categories: ['Hund', 'Katze', 'Fisch', 'Kein Tier'],
    counts: [10, 5, 5, 5],
  },
  {
    id: 'verein50',
    context: 'Beim Sportfest wurden 50 Kinder gefragt, in welchem Verein sie spielen (ein Verein pro Kind).',
    head: 'Sportverein',
    categories: ['Fußball', 'Handball', 'Schwimmen', 'Turnen'],
    counts: [20, 10, 15, 5],
  },
  {
    id: 'eis6d',
    context: 'Beim Klassenfest der 6d wurden 20 Kinder gefragt, welche Eissorte sie am liebsten mögen.',
    head: 'Lieblingseis',
    categories: ['Schoko', 'Vanille', 'Erdbeere', 'Zitrone'],
    counts: [7, 5, 6, 2],
  },
]

export const PERCENT_SURVEYS: PercentSurvey[] = [
  {
    id: 'taschengeld',
    context: 'Mia teilt ihr Taschengeld von 20,00 € im Monat auf.',
    head: 'Mias Taschengeld',
    colLeft: 'Wofür',
    categories: ['Sparen', 'Süßigkeiten', 'Kino', 'Sonstiges'],
    percents: [40, 25, 20, 15],
    euro: 20,
  },
  {
    id: 'sprecherwahl',
    context: 'Bei der Wahl zum Klassensprecher haben alle Kinder der Klasse 6a genau eine Stimme abgegeben.',
    head: 'Ergebnis der Wahl',
    colLeft: 'Kandidat',
    categories: ['Lena', 'Jonas', 'Aylin'],
    percents: [45, 35, 20],
  },
]

const rotate = <T>(list: readonly T[], by: number): T[] => [...list.slice(by), ...list.slice(0, by)]

const kinder = (n: number): string => (n === 1 ? '1 Kind' : `${n} Kinder`)

const percentList = (categories: readonly string[], percents: readonly number[]): string =>
  categories.map((c, i) => `${c} ${percents[i]} %`).join(', ')

const euroText = (value: number): string => `${value.toFixed(2).replace('.', ',')} €`

const SCALE_HINT =
  'Im Kreis entspricht 1 % genau 3,6 Grad; ein Viertel des Kreises sind 25 %, die Hälfte 50 %. Die Sektoren liegen nacheinander im Uhrzeigersinn ab 12 Uhr.'

/** A count survey as a pie chart task: the table gives counts, the learner converts them to percent. */
export const countPieChartTask = (rng: Rng, survey: CountSurvey): Task => {
  const rot = randInt(rng, 0, survey.categories.length - 1)
  const categories = rotate(survey.categories, rot)
  const counts = rotate(survey.counts, rot)
  const total = counts.reduce((s, c) => s + c, 0)
  const percents = counts.map((c) => (c / total) * 100)
  const lines = categories.map((cat, i) => `${cat}: ${counts[i]} : ${total} = ${bcFormatNumber(counts[i]! / total)} = ${percents[i]} %`)
  return pieChartTask({
    question: `${survey.context} Die Tabelle zeigt, wie viele Kinder jede Antwort gewählt haben. Stelle die Verteilung in einem Kreisdiagramm dar.`,
    categories,
    percents,
    visualContent: pieChartTableSvg(`Umfrage: ${survey.head}`, survey.head, 'Anzahl Kinder', categories, counts.map((c) => String(c))),
    solution: percentList(categories, percents),
    explanation: `Der Kreis steht für alle ${kinder(total)} (100 %). Den Anteil jeder Antwort erhältst du mit Anzahl : Gesamtzahl: ${lines.join('; ')}. Zusammen ergibt das 100 %. ${SCALE_HINT}`,
    dedupeKey: `piechart-counts:${survey.id}:${rot}`,
  })
}

/** A percent survey as a pie chart task: the table gives the shares, the learner draws them. */
export const percentPieChartTask = (rng: Rng, survey: PercentSurvey): Task => {
  const rot = randInt(rng, 0, survey.categories.length - 1)
  const categories = rotate(survey.categories, rot)
  const percents = rotate(survey.percents, rot)
  const degrees = categories.map((cat, i) => `${cat}: ${percents[i]} % · 3,6° = ${bcFormatNumber(percents[i]! * 3.6)}°`)
  const euro = survey.euro
  const amounts = euro
    ? ` Bei ${euroText(euro)} sind das ${categories.map((cat, i) => `${cat} ${euroText((euro * percents[i]!) / 100)}`).join(', ')}.`
    : ''
  return pieChartTask({
    question: `${survey.context} Die Tabelle zeigt die Anteile in Prozent. Stelle sie in einem Kreisdiagramm dar.`,
    categories,
    percents,
    visualContent: pieChartTableSvg(survey.head, survey.colLeft, 'Anteil', categories, percents.map((p) => `${p} %`)),
    solution: percentList(categories, percents),
    explanation: `Der ganze Kreis sind 100 %, jeder Sektor ist so groß wie sein Anteil. Als Winkel: ${degrees.join('; ')}.${amounts} ${SCALE_HINT}`,
    dedupeKey: `piechart-percent:${survey.id}:${rot}`,
  })
}
