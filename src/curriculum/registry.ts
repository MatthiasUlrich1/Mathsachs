import type { Grade } from './types'

/**
 * Version of the curriculum content model. It is embedded into every exam code
 * (see `src/exam`) so a decoder can warn when a shared code was produced against
 * a different curriculum revision — seed-based tasks might then differ.
 *
 * Bump this whenever a change to a topic's `generate()` would alter the tasks
 * produced for an existing seed (renaming/removing topics, reordering RNG draws
 * within a generator, etc.).
 */
export const CURRICULUM_VERSION = 1

/**
 * Metadata for a single, on-demand loadable grade curriculum.
 *
 * `load()` uses a dynamic `import(...)` so the actual topic definitions are
 * only fetched (as a separate code-split chunk) once a grade is activated in
 * the Lehrpläne section under Einstellungen — that is the "Nachladen" mechanism.
 */
export interface CurriculumModule {
  id: string
  subjectTitle: string
  gradeTitle: string
  description: string
  /**
   * Broad, static keywords describing this grade's topics. They let the topic
   * search hint "In Klasse X verfügbar" even for grades that are not loaded,
   * without having to eagerly import the (code-split) topic definitions.
   */
  searchHints?: string[]
  load: () => Promise<Grade>
}

export const availableCurricula: CurriculumModule[] = [
  {
    id: 'mathematik-klasse-5',
    subjectTitle: 'Mathematik',
    gradeTitle: 'Klasse 5',
    description:
      'Natürliche Zahlen, gemeine Brüche und Dezimalzahlen, Lagebeziehungen, Rechtecke und Quader sowie Sachaufgaben aus dem Alltag.',
    searchHints: [
      'natürliche Zahlen', 'runden', 'Addition', 'Subtraktion', 'Multiplikation', 'Division',
      'Teilbarkeit', 'Primzahlen', 'Brüche', 'kürzen', 'Dezimalzahlen', 'Mittelwert',
      'Winkel', 'Rechteck', 'Quadrat', 'Quader', 'Umfang', 'Fläche', 'Volumen',
      'Einheiten umrechnen', 'Länge', 'Masse', 'Zeit', 'Flächeninhalt',
    ],
    load: () => import('./math5').then((m) => m.klasse5),
  },
  {
    id: 'mathematik-klasse-6',
    subjectTitle: 'Mathematik',
    gradeTitle: 'Klasse 6',
    description:
      'Arbeiten mit gebrochenen Zahlen, Zuordnungen, Dreiecke und Vierecke, Prismen und das Rechnen mit Anteilen.',
    searchHints: [
      'Brüche', 'erweitern', 'kürzen', 'vergleichen', 'Dezimalzahlen', 'Prozent',
      'Dreisatz', 'proportional', 'antiproportional', 'Häufigkeit', 'Dreieck', 'Viereck',
      'Winkelsumme', 'Umfang', 'Flächeninhalt', 'Prisma', 'Volumen', 'Anteil',
      'Einheiten umrechnen', 'Fläche',
    ],
    load: () => import('./math6').then((m) => m.klasse6),
  },
  {
    id: 'mathematik-klasse-7',
    subjectTitle: 'Mathematik',
    gradeTitle: 'Klasse 7',
    description:
      'Geometrie in der Ebene, Rechnen mit rationalen Zahlen, Prismen und Pyramiden sowie das Darstellen und Auswerten von Daten.',
    searchHints: [
      'rationale Zahlen', 'negative Zahlen', 'Vorzeichen', 'Betrag', 'Gleichungen',
      'Term', 'Nebenwinkel', 'Scheitelwinkel', 'Vieleck', 'Prisma', 'Pyramide',
      'Volumen', 'Oberfläche', 'Mittelwert', 'Median', 'Spannweite', 'Daten',
    ],
    load: () => import('./math7').then((m) => m.klasse7),
  },
  {
    id: 'mathematik-klasse-8',
    subjectTitle: 'Mathematik',
    gradeTitle: 'Klasse 8',
    description:
      'Terme und Gleichungen, Zufallsversuche, lineare Funktionen und Gleichungssysteme, Ähnlichkeit und heuristische Strategien.',
    searchHints: [
      'Terme', 'zusammenfassen', 'Gleichungen', 'lineare Funktion', 'Steigung',
      'y-Achsenabschnitt', 'Gleichungssystem', 'LGS', 'Wahrscheinlichkeit', 'Laplace',
      'Ähnlichkeit', 'Streckfaktor', 'Strahlensatz', 'Zahlenrätsel',
    ],
    load: () => import('./math8').then((m) => m.klasse8),
  },
  {
    id: 'mathematik-klasse-9',
    subjectTitle: 'Mathematik',
    gradeTitle: 'Klasse 9',
    description:
      'Funktionen und Potenzen, Kreise, Kreiszylinder und Kugeln, rechtwinklige Dreiecke mit Pythagoras und Trigonometrie sowie Datenauswertung.',
    searchHints: [
      'Potenzen', 'Potenzgesetze', 'quadratische Funktion', 'Parabel', 'Scheitelpunkt',
      'Kreis', 'Umfang', 'Flächeninhalt', 'Zylinder', 'Kugel', 'Pi', 'Pythagoras',
      'Hypotenuse', 'Sinus', 'Kosinus', 'Tangens', 'Trigonometrie', 'Median', 'Modalwert',
    ],
    load: () => import('./math9').then((m) => m.klasse9),
  },
  {
    id: 'mathematik-klasse-10',
    subjectTitle: 'Mathematik',
    gradeTitle: 'Klasse 10',
    description:
      'Wachstumsvorgänge und Zinsrechnung, diskrete Zufallsgrößen, algebraisches Lösen geometrischer Probleme und quadratische Gleichungen.',
    searchHints: [
      'Zinsen', 'Zinseszins', 'Zinsrechnung', 'Wachstum', 'exponentiell', 'Prozent',
      'Erwartungswert', 'Zufallsgröße', 'quadratische Gleichung', 'Wurzel', 'Parabel',
      'Rechteck', 'Quadrat', 'Flächeninhalt',
    ],
    load: () => import('./math10').then((m) => m.klasse10),
  },
  {
    id: 'mathematik-jgs-11-12',
    subjectTitle: 'Mathematik',
    gradeTitle: 'Jahrgangsstufe 11/12 (Grundkurs)',
    description:
      'Grundkurs-Themen der Kursstufe: Differential- und Integralrechnung, Vektoren im Raum sowie binomialverteilte Zufallsgrößen.',
    searchHints: [
      'Ableitung', 'Differentialrechnung', 'Nullstellen', 'Integral', 'Stammfunktion',
      'Vektoren', 'Skalarprodukt', 'Betrag', 'Binomialverteilung', 'Erwartungswert',
      'Wahrscheinlichkeit', 'Stochastik',
    ],
    load: () => import('./math11_12').then((m) => m.klasse11_12),
  },
]

export const getCurriculumModule = (id: string): CurriculumModule | undefined =>
  availableCurricula.find((m) => m.id === id)

const LOADED_KEY = 'mathsachs.loadedGrades.v1'

/** The grade that is always available when nothing has been persisted yet. */
export const DEFAULT_LOADED_IDS = ['mathematik-klasse-6']

const canStore = (): boolean => {
  try {
    return typeof localStorage !== 'undefined'
  } catch {
    return false
  }
}

/** The ids of the curricula the user has chosen to load, in registry order. */
export const getLoadedIds = (): string[] => {
  if (!canStore()) return [...DEFAULT_LOADED_IDS]
  let stored: string[] | null = null
  try {
    const raw = localStorage.getItem(LOADED_KEY)
    if (raw) stored = JSON.parse(raw) as string[]
  } catch {
    stored = null
  }
  if (stored === null) return [...DEFAULT_LOADED_IDS]
  // Keep only ids that still exist, preserving the registry's order.
  return availableCurricula
    .map((m) => m.id)
    .filter((id) => stored!.includes(id))
}

export const setLoadedIds = (ids: string[]): void => {
  if (!canStore()) return
  localStorage.setItem(LOADED_KEY, JSON.stringify(ids))
}
