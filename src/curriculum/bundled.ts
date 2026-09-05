import type { Grade } from './types'
import { GYM_SACHSEN_PACK_ID } from './pack'

export interface CurriculumModule {
  id: string
  packId: string
  subjectTitle: string
  gradeTitle: string
  description: string
  searchHints?: string[]
  load: () => Promise<Grade>
}

export const bundledCurricula: CurriculumModule[] = [
  {
    id: 'mathematik-klasse-5',
    packId: GYM_SACHSEN_PACK_ID,
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
    packId: GYM_SACHSEN_PACK_ID,
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
    packId: GYM_SACHSEN_PACK_ID,
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
    packId: GYM_SACHSEN_PACK_ID,
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
    packId: GYM_SACHSEN_PACK_ID,
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
    packId: GYM_SACHSEN_PACK_ID,
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
    packId: GYM_SACHSEN_PACK_ID,
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

export const getBundledModule = (id: string): CurriculumModule | undefined =>
  bundledCurricula.find((m) => m.id === id)

export const bundledPackIdForGrade = (gradeId: string): string | undefined =>
  getBundledModule(gradeId)?.packId
