/**
 * Mathematik Gym Sachsen — Lehrplan-Teilaspekte (Themen-Vollständigkeit).
 * Neue Topics: released:false. Nur Rechen-/Anwendungsaufgaben (siehe `mathApplied.ts`, `mathQualityBanks.ts`).
 */
import {
  generateBesondereLinienK6,
  generateDefWerteK9,
  generateDrehungK5,
  generateEreignismengenK8,
  generateKathetensatzK9,
  generateKavalierK6,
  generateMengenK6,
  generateNormalverteilungLK,
  generateQuaderAnsichtenK5,
  generateThalesK7,
  generateUmkehrVerkettungK10,
  generateVerteilungsfunktionK10,
  generateZahlbereicheK7,
  generateZuordnungK6,
} from './mathApplied'
import {
  generateBruchDezimalProzentK5,
  generateEchteUnechteBruecheK5,
  generatePeriodischeDezimalK6,
  generatePrimfaktorK5,
  generateRechengesetzeK5,
  generateVergleichenOrdnenK5,
} from './mathQualityBanks'
import type { Topic } from './types'
import { DEFAULT_TASKS_PER_ROUND } from './tasksPerRound'

const base = {
  hint: 'Tippe oder wähle die Antwort. Erklärung erscheint nach dem Prüfen.',
  pointsPerTask: 10,
  difficulty: 2,
  released: false,
  tasksPerRound: DEFAULT_TASKS_PER_ROUND,
} as const

const wiki = (title: string, slug: string) => ({ quelle: `Wikipedia: ${title}`, url: `https://de.wikipedia.org/wiki/${slug}` })

export const maTopic0: Topic = {
  ...base,
  id: 'lb1-vergleichen-ordnen',
  title: 'Natürliche Zahlen vergleichen und ordnen',
  keywords: ['vergleichen', 'ordnen', 'Zahlenstrahl', 'Stellenwert'],
  generate: generateVergleichenOrdnenK5,
}
export const maTopic1: Topic = {
  ...base,
  id: 'lb1-primfaktorzerlegung',
  title: 'Primfaktorzerlegung',
  keywords: ['Primfaktor', 'Zerlegung', 'Primzahl', 'Teilbarkeit'],
  generate: generatePrimfaktorK5,
}
export const maTopic2: Topic = {
  ...base,
  id: 'lb1-rechengesetze',
  title: 'Rechengesetze und Rechenvorteile',
  keywords: ['Kommutativ', 'Assoziativ', 'Distributiv', 'Rechenvorteil'],
  generate: generateRechengesetzeK5,
}
export const maTopic3: Topic = {
  ...base,
  id: 'lb2-echte-unechte-brueche',
  title: 'Echte und unechte Brüche',
  keywords: ['echter Bruch', 'unechter Bruch', 'gemischte Zahl', 'Zähler', 'Nenner'],
  generate: generateEchteUnechteBruecheK5,
}
export const maTopic4: Topic = {
  ...base,
  id: 'lb2-bruch-dezimal-prozent',
  title: 'Umwandeln: Bruch, Dezimalzahl, Prozent',
  keywords: ['Prozent', 'Dezimalzahl', 'Umwandeln', 'Zehnerbruch'],
  generate: generateBruchDezimalProzentK5,
}
export const maTopic5: Topic = {
  ...base,
  id: 'lb3-drehung',
  title: 'Drehung als Bewegung',
  keywords: ['Drehung', 'Drehwinkel', 'Drehzentrum', 'Bewegung'],
  fachwissen: {
    text: 'Eine Drehung ist durch ein Drehzentrum, einen Drehwinkel und eine Drehrichtung festgelegt. Jeder Punkt bleibt dabei gleich weit vom Zentrum entfernt; Bild und Original sind deckungsgleich.',
    ...wiki('Drehung (Mathematik)', 'Drehung_(Mathematik)'),
  },
  generate: generateDrehungK5,
}
export const maTopic6: Topic = {
  ...base,
  id: 'lb4-schraegbild-netz',
  title: 'Quader darstellen: Schrägbild, Netz, Ansichten',
  keywords: ['Schrägbild', 'Körpernetz', 'Grundriss', 'Ansicht', 'Quader'],
  fachwissen: {
    text: 'Einen Quader kann man durch Ansichten (vorn, oben, seitlich), durch ein Netz aus sechs Rechtecken oder durch ein Schrägbild darstellen. Jede Ansicht zeigt zwei der drei Kantenlängen Länge, Breite und Höhe.',
    ...wiki('Quader', 'Quader'),
  },
  generate: generateQuaderAnsichtenK5,
}
export const maTopic7: Topic = {
  ...base,
  id: 'k6-lb1-periodische-dezimal',
  title: 'Endliche und periodische Dezimalzahlen',
  keywords: ['periodisch', 'endlich', 'Dezimalzahl', 'Umwandeln'],
  generate: generatePeriodischeDezimalK6,
}
export const maTopic8: Topic = {
  ...base,
  id: 'k6-lb1-mengen',
  title: 'Element, Menge, Teilmenge',
  keywords: ['Menge', 'Element', 'Teilmenge', 'Mengendiagramm'],
  fachwissen: {
    text: 'Eine Menge wird durch Aufzählen ihrer Elemente in geschweiften Klammern oder durch eine Eigenschaft beschrieben, z. B. T12 = {Teiler von 12} = {1, 2, 3, 4, 6, 12}. A ist Teilmenge von B, wenn jedes Element von A auch Element von B ist.',
    ...wiki('Menge (Mathematik)', 'Menge_(Mathematik)'),
  },
  generate: generateMengenK6,
}
export const maTopic9: Topic = {
  ...base,
  id: 'k6-lb2-zuordnung-darstellung',
  title: 'Zuordnungen: Darstellen und Eindeutigkeit',
  keywords: ['Zuordnung', 'Tabelle', 'Diagramm', 'eindeutig', 'Pfeildarstellung'],
  fachwissen: {
    text: 'Zuordnungen lassen sich als Wertetabelle, Pfeilbild, Graph oder mit einer Regel darstellen. Eindeutig ist eine Zuordnung, wenn jedem Ausgangswert genau ein zugeordneter Wert gehört.',
    ...wiki('Zuordnung (Mathematik)', 'Zuordnung_(Mathematik)'),
  },
  generate: generateZuordnungK6,
}
export const maTopic10: Topic = {
  ...base,
  id: 'k6-lb3-besondere-linien',
  title: 'Besondere Linien im Dreieck',
  keywords: ['Höhe', 'Mittelsenkrechte', 'Seitenhalbierende', 'Winkelhalbierende', 'Lot'],
  fachwissen: {
    text: 'Besondere Linien im Dreieck sind Höhen, Mittelsenkrechten, Winkelhalbierende und Seitenhalbierende. Die Mittelsenkrechten schneiden sich im Umkreismittelpunkt, die Winkelhalbierenden im Inkreismittelpunkt und die Seitenhalbierenden im Schwerpunkt.',
    ...wiki('Dreieck', 'Dreieck'),
  },
  generate: generateBesondereLinienK6,
}
export const maTopic11: Topic = {
  ...base,
  id: 'k6-lb4-kavalierperspektive',
  title: 'Prismen in Kavalierperspektive darstellen',
  keywords: ['Kavalierperspektive', 'Prisma', 'Schrägbild', 'Darstellung'],
  fachwissen: {
    text: 'In der Kavalierperspektive wird die Vorderfläche in wahrer Größe gezeichnet. Nach hinten verlaufende Kanten zeichnet man unter 45° und auf die Hälfte verkürzt; verdeckte Kanten werden gestrichelt.',
    ...wiki('Kavalierperspektive', 'Kavalierperspektive'),
  },
  generate: generateKavalierK6,
}
export const maTopic12: Topic = {
  ...base,
  id: 'k7-lb1-thales',
  title: 'Satz des Thales',
  keywords: ['Thales', 'Halbkreis', 'Rechtwinklig', 'Umkreis'],
  fachwissen: {
    text: 'Satz des Thales: Liegt C auf dem Halbkreis über AB, so ist der Winkel bei C ein rechter Winkel. Umgekehrt liegt bei jedem rechtwinkligen Dreieck der Mittelpunkt des Umkreises in der Mitte der Hypotenuse.',
    ...wiki('Satz des Thales', 'Satz_des_Thales'),
  },
  generate: generateThalesK7,
}
export const maTopic13: Topic = {
  ...base,
  id: 'k7-lb2-zahlbereiche-mengen',
  title: 'Zahlbereiche im Mengendiagramm',
  keywords: ['natürliche', 'ganze', 'rationale', 'Mengendiagramm', 'Teilmenge'],
  fachwissen: {
    text: 'Die Zahlbereiche sind ineinander geschachtelt: ℕ ⊂ ℤ ⊂ ℚ. Im Mengendiagramm liegt der Kreis für ℕ innerhalb des Kreises für ℤ und dieser innerhalb des Kreises für ℚ.',
    ...wiki('Zahlbereich', 'Zahlbereich'),
  },
  generate: generateZahlbereicheK7,
}
export const maTopic14: Topic = {
  ...base,
  id: 'k8-lb2-ereignismengen',
  title: 'Ereignisse: Vereinigung, Durchschnitt, Differenz',
  keywords: ['Ereignis', 'Vereinigung', 'Durchschnitt', 'Differenz', 'Ergebnismenge'],
  fachwissen: {
    text: 'Ereignisse sind Teilmengen der Ergebnismenge Ω. Mit Durchschnitt (∩), Vereinigung (∪), Differenz (\\) und Gegenereignis lassen sich aus Ereignissen neue Ereignisse bilden; bei gleich wahrscheinlichen Ergebnissen gilt P(E) = Anzahl der Ergebnisse in E : Anzahl der Ergebnisse in Ω.',
    ...wiki('Ereignis (Wahrscheinlichkeitstheorie)', 'Ereignis_(Wahrscheinlichkeitstheorie)'),
  },
  generate: generateEreignismengenK8,
}
export const maTopic15: Topic = {
  ...base,
  id: 'k9-lb1-definitions-wertebereich',
  title: 'Definitions- und Wertebereich von Funktionen',
  keywords: ['Definitionsbereich', 'Wertebereich', 'Funktion', 'Potenz'],
  fachwissen: {
    text: 'Der Definitionsbereich enthält alle zulässigen x-Werte einer Funktion, der Wertebereich alle Funktionswerte, die dabei entstehen. Einschränkungen entstehen vor allem durch Wurzeln (kein negativer Radikand) und Brüche (Nenner nicht null).',
    ...wiki('Definitionsmenge', 'Definitionsmenge'),
  },
  generate: generateDefWerteK9,
}
export const maTopic16: Topic = {
  ...base,
  id: 'k9-lb3-kathetensatz',
  title: 'Kathetensatz',
  keywords: ['Kathetensatz', 'Höhe', 'rechtwinklig', 'Projektion'],
  fachwissen: {
    text: 'Kathetensatz des Euklid: Im rechtwinkligen Dreieck ist das Quadrat über einer Kathete flächengleich zum Rechteck aus Hypotenuse und anliegendem Hypotenusenabschnitt, also a² = c · p und b² = c · q.',
    ...wiki('Kathetensatz', 'Kathetensatz'),
  },
  generate: generateKathetensatzK9,
}
export const maTopic17: Topic = {
  ...base,
  id: 'k10-lb2-verteilungsfunktion',
  title: 'Verteilungsfunktion diskreter Zufallsgrößen',
  keywords: ['Verteilungsfunktion', 'kumuliert', 'Zufallsgröße', 'Wahrscheinlichkeit'],
  fachwissen: {
    text: 'Die Verteilungsfunktion F(k) = P(X ≤ k) summiert die Wahrscheinlichkeiten aller Werte bis einschließlich k. Sie steigt treppenförmig von 0 auf 1; die Sprunghöhe an der Stelle k ist P(X = k).',
    ...wiki('Verteilungsfunktion', 'Verteilungsfunktion'),
  },
  generate: generateVerteilungsfunktionK10,
}
export const maTopic18: Topic = {
  ...base,
  id: 'k10-lb4-umkehr-verkettung',
  title: 'Umkehrfunktionen und Verkettung',
  keywords: ['Umkehrfunktion', 'Verkettung', 'Verknüpfung', 'Funktion'],
  fachwissen: {
    text: 'Bei der Verkettung f(g(x)) wird zuerst g, dann f angewendet. Die Umkehrfunktion f⁻¹ kehrt die Zuordnung um: Aus f(a) = b folgt f⁻¹(b) = a; ihr Graph ist das Spiegelbild des Graphen von f an der Geraden y = x.',
    ...wiki('Umkehrfunktion', 'Umkehrfunktion'),
  },
  generate: generateUmkehrVerkettungK10,
}
export const maTopic19: Topic = {
  ...base,
  id: 'k1112-lk-normalverteilung',
  title: 'Normalverteilte Zufallsgrößen (Leistungskurs)',
  keywords: ['Normalverteilung', 'Gauß', 'σ', 'Dichte', 'LK'],
  fachwissen: {
    text: 'Eine normalverteilte Zufallsgröße wird durch Erwartungswert μ und Standardabweichung σ beschrieben. Ihre Dichte ist die symmetrische Gauß’sche Glockenkurve mit Maximum bei μ und Wendestellen bei μ ± σ; die Sigma-Regeln geben an, welcher Anteil der Werte in μ ± kσ liegt.',
    ...wiki('Normalverteilung', 'Normalverteilung'),
  },
  generate: generateNormalverteilungLK,
}

export const MATH_LEHRPLAN_TEILASPEKTE_BY_GRADE: Record<string, { areaId: string; topic: Topic }[]> = {
  math5: [
    { areaId: 'lb1', topic: maTopic0 },
    { areaId: 'lb1', topic: maTopic1 },
    { areaId: 'lb1', topic: maTopic2 },
    { areaId: 'lb2', topic: maTopic3 },
    { areaId: 'lb2', topic: maTopic4 },
    { areaId: 'lb3', topic: maTopic5 },
    { areaId: 'lb4', topic: maTopic6 },
  ],
  math6: [
    { areaId: 'lb1', topic: maTopic7 },
    { areaId: 'lb1', topic: maTopic8 },
    { areaId: 'lb2', topic: maTopic9 },
    { areaId: 'lb3', topic: maTopic10 },
    { areaId: 'lb4', topic: maTopic11 },
  ],
  math7: [
    { areaId: 'lb1', topic: maTopic12 },
    { areaId: 'lb2', topic: maTopic13 },
  ],
  math8: [{ areaId: 'lb2', topic: maTopic14 }],
  math9: [
    { areaId: 'lb1', topic: maTopic15 },
    { areaId: 'lb3', topic: maTopic16 },
  ],
  math10: [
    { areaId: 'lb2', topic: maTopic17 },
    { areaId: 'lb4', topic: maTopic18 },
  ],
  math11_12: [{ areaId: 'lb6', topic: maTopic19 }],
}
