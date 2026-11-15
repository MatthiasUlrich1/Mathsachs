/**
 * Hand-written classroom surveys for the bar chart interaction (barChartTask), shared by the
 * Neu-Themen (Klasse 5 Daten, Klasse 6 Häufigkeit). Every survey has a realistic class size (24-30 children).
 * The learner reads the numbers from a tally sheet or a table and builds the bar chart.
 */
import { randInt, type Rng } from '../lib/rng'
import { barChartTableSvg, barChartTallySvg } from '../lib/barChartLogic'
import { barChartTask } from './interactionTaskHelpers'
import type { Task } from './types'

export interface Survey {
  id: string
  /** First sentence of the question: who was asked what (one answer per child). */
  context: string
  /** Heading of the figure and (table only) the name of the first column. */
  head: string
  categories: string[]
  counts: number[]
  yMax: number
  /** Whether the categories may be shown in a different order (not for ordered categories like 0, 1, 2 ...). */
  rotatable: boolean
}

export const TALLY_SURVEYS: Survey[] = [
  {
    id: 'sport6b',
    context: 'In der Klasse 6b wurde jedes Kind nach seiner Lieblingssportart gefragt.',
    head: 'Lieblingssportart',
    categories: ['Fußball', 'Schwimmen', 'Tanzen', 'Turnen', 'Reiten'],
    counts: [9, 6, 5, 4, 2],
    yMax: 10,
    rotatable: true,
  },
  {
    id: 'schulweg6c',
    context: 'Die Klasse 6c hat gezählt, wie jedes Kind morgens zur Schule kommt.',
    head: 'Weg zur Schule',
    categories: ['Zu Fuß', 'Fahrrad', 'Bus', 'Auto'],
    counts: [8, 7, 9, 3],
    yMax: 10,
    rotatable: true,
  },
  {
    id: 'haustier6a',
    context: 'In der Klasse 6a wurde gefragt, welches Haustier jedes Kind hat (ein Tier pro Kind oder keins).',
    head: 'Haustier',
    categories: ['Hund', 'Katze', 'Fisch', 'Kaninchen', 'Kein Tier'],
    counts: [8, 7, 3, 4, 5],
    yMax: 10,
    rotatable: true,
  },
]

export const TABLE_SURVEYS: Survey[] = [
  {
    id: 'fach5c',
    context: 'In der Klasse 5c wurde jedes Kind nach seinem Lieblingsfach gefragt.',
    head: 'Lieblingsfach',
    categories: ['Mathe', 'Sport', 'Kunst', 'Deutsch', 'Musik'],
    counts: [7, 9, 4, 3, 2],
    yMax: 10,
    rotatable: true,
  },
  {
    id: 'eis6b',
    context: 'Beim Klassenfest hat die Klasse 6b abgestimmt, welche Eissorte jedes Kind am liebsten mag.',
    head: 'Lieblingseissorte',
    categories: ['Schoko', 'Vanille', 'Erdbeere', 'Zitrone'],
    counts: [10, 6, 7, 2],
    yMax: 12,
    rotatable: true,
  },
  {
    id: 'haustier6d',
    context: 'In der Klasse 6d wurde gefragt, welches Haustier jedes Kind hat (ein Tier pro Kind oder keins).',
    head: 'Haustier',
    categories: ['Hund', 'Katze', 'Vogel', 'Pferd', 'Kein Tier'],
    counts: [9, 7, 1, 0, 8],
    yMax: 10,
    rotatable: true,
  },
]

/** Klasse 5: wie viele Geschwister haben die Kinder (geordnete Kategorien, deshalb nicht umsortiert). */
export const SIBLING_SURVEYS: Survey[] = [
  [6, 12, 5, 2],
  [4, 11, 7, 3],
  [5, 13, 6, 2],
].map((counts, i) => ({
  id: `geschwister5a-${i}`,
  context: 'In der Klasse 5a wurde gefragt, wie viele Geschwister jedes Kind hat.',
  head: 'Geschwister',
  categories: ['keine', '1', '2', '3 oder mehr'],
  counts,
  yMax: 14,
  rotatable: false,
}))

const rotate = <T>(list: readonly T[], by: number): T[] => [...list.slice(by), ...list.slice(0, by)]

const orderedPairs = (categories: readonly string[], counts: readonly number[]): string =>
  categories.map((c, i) => `${c} ${counts[i]}`).join(', ')

const zeroNote = (categories: readonly string[], counts: readonly number[]): string => {
  const zero = categories.filter((_, i) => counts[i] === 0)
  return zero.length
    ? ` Bei ${zero.join(', ')} hat niemand abgestimmt: Der Balken muss genau auf 0 stehen, er darf nicht eine Gitterlinie höher stehen.`
    : ''
}

/** A survey as a bar chart task. `mode` decides whether the learner counts tally marks or reads a table. */
export const surveyBarChartTask = (rng: Rng, survey: Survey, mode: 'tally' | 'table'): Task => {
  const rot = survey.rotatable ? randInt(rng, 0, survey.categories.length - 1) : 0
  const categories = rotate(survey.categories, rot)
  const counts = rotate(survey.counts, rot)
  const total = counts.reduce((s, c) => s + c, 0)
  const top = categories[counts.indexOf(Math.max(...counts))]!
  const tally = mode === 'tally'
  const figure = tally
    ? barChartTallySvg(`Strichliste: ${survey.head}`, categories, counts)
    : barChartTableSvg(`Tabelle: ${survey.head}`, survey.head, 'Anzahl Kinder', categories, counts)
  const how = tally
    ? 'Zähle in jeder Zeile die Striche: Ein Bündel mit Querstrich steht für 5, die einzelnen Striche kommen dazu.'
    : 'Lies für jede Zeile der Tabelle die Anzahl ab.'
  return barChartTask({
    question: `${survey.context} ${tally ? 'Die Antworten stehen in der Strichliste.' : 'Die Ergebnisse stehen in der Tabelle.'} Stelle sie in einem Säulendiagramm dar.`,
    categories,
    data: counts,
    yMax: survey.yMax,
    step: 1,
    yLabel: 'Anzahl Kinder',
    visualContent: figure,
    solution: `Höhe der Balken: ${orderedPairs(categories, counts)}`,
    explanation: `${how} Das ergibt: ${orderedPairs(categories, counts)}. Zusammen sind das ${total} Kinder. Jede Säule reicht bis zu ihrer Zahl auf der y-Achse; bei „${top}“ ist sie am höchsten, weil dort die meisten Kinder gezählt wurden.${zeroNote(categories, counts)}`,
    dedupeKey: `barchart-${mode}:${survey.id}:${rot}`,
  })
}
