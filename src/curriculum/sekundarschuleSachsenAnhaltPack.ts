import {
  SKS_SACHSEN_ANHALT_HS_PACK_ID,
  SKS_SACHSEN_ANHALT_RS_PACK_ID,
  packContentHash,
  type CurriculumPack,
  type PackArea,
  type PackGrade,
  type PackTopic,
} from './pack'
import type { PackTopicMapping } from './packMapping'
import { DEFAULT_TASKS_PER_ROUND } from './tasksPerRound'

/**
 * Sekundarschule Sachsen-Anhalt · Mathematik (Fachlehrplan 01.08.2019).
 * Outline = Kompetenzschwerpunkte; playable topics alias Gym-Sachsen generators.
 * Source: https://www.bildung-lsa.de/…/lp_sks_mathe_01_08_2019.pdf
 */

const topic = (
  id: string,
  title: string,
  hintOrKeywords?: string | string[],
  keywords?: string[],
): PackTopic => {
  const hint = typeof hintOrKeywords === 'string' ? hintOrKeywords : undefined
  const keys = Array.isArray(hintOrKeywords) ? hintOrKeywords : keywords
  return {
    id,
    title,
    hint,
    pointsPerTask: 10,
    tasksPerRound: DEFAULT_TASKS_PER_ROUND,
    ...(keys?.length ? { keywords: keys } : {}),
  }
}

const area = (id: string, title: string, topics: PackTopic[]): PackArea => ({
  id,
  title,
  topics,
})

const grade = (
  id: string,
  title: string,
  gradeTitle: string,
  description: string,
  searchHints: string[],
  areas: PackArea[],
): PackGrade => ({
  id,
  title,
  subjectTitle: 'Mathematik',
  gradeTitle,
  description,
  searchHints,
  areas,
})

/**
 * 1:n-Mapping der SKS-Pack-Themen auf Gym-Sachsen-Master (Vorrang vor SKS_GENERATOR_MAP).
 * Herleitung und Lehrplan-Belege: docs/lehrplan-mapping/sekundarschule-sachsen-anhalt.md.
 * HS und RS teilen die Themen-IDs sks-k5..k8; dort gilt maxDifficulty 2 (HSA). RS-eigene Themen
 * (sks-rs-*) sind nicht eingeschränkt.
 */
export const SKS_TOPIC_MAPPINGS: Record<string, PackTopicMapping> = {
  'sks-k5-nat-runden': {
    sources: ['lb1-runden-natuerlich'],
    maxDifficulty: 2,
    note: 'Runden: Rundungsregeln.',
  },
  'sks-k5-nat-add': {
    sources: ['lb1-addition'],
    maxDifficulty: 2,
    note: 'Addition.',
  },
  'sks-k5-nat-sub': {
    sources: ['lb1-subtraktion'],
    maxDifficulty: 2,
    note: 'Subtraktion.',
  },
  'sks-k5-nat-mul': {
    sources: ['lb1-multiplikation'],
    maxDifficulty: 2,
    note: 'Multiplikation.',
  },
  'sks-k5-nat-schriftlich': {
    sources: ['lb1-schriftliches-rechnen'],
    maxDifficulty: 2,
    note: '„schriftliche Rechenverfahren verstehen und ausführen“.',
  },
  'sks-k5-nat-div-rest': {
    sources: ['lb1-division-rest'],
    maxDifficulty: 2,
    note: 'Division/Umkehroperation.',
  },
  'sks-k5-nat-div': {
    sources: ['lb1-schriftliche-division'],
    maxDifficulty: 2,
    note: 'Schriftliche Division.',
  },
  'sks-k5-nat-potenz': {
    sources: ['lb1-potenzieren'],
    maxDifficulty: 2,
    note: '„Potenzen berechnen“; Quadrat-/Kubik-/Zehnerpotenz.',
  },
  'sks-k5-nat-teilbarkeit': {
    sources: ['lb1-teilbarkeit'],
    maxDifficulty: 2,
    note: 'Teilbarkeitsregeln 2, 3, 5, 10.',
  },
  'sks-k5-nat-prim': {
    sources: ['lb1-primzahl'],
    maxDifficulty: 2,
    note: '„gerade, ungerade Zahlen, Primzahlen“.',
  },
  'sks-k5-sachaufgaben': {
    sources: ['lb5-gesamtpreis', 'lb5-teilen', 'lb5-mehrstufig', 'lb3-sachaufgabe-geometrie', 'lb5-sachaufgabe-flaeche'],
    maxDifficulty: 2,
    note: 'Neues Pack-Thema vorgeschlagen: „inner- und außermathematische Anwendungsaufgaben lösen“. Nutzt ungenutzte Gym-K5-LB5-Themen. E5-Ergänzung: Geometrie-Sachaufgaben (Umfang/Fläche).',
  },
  'sks-k5-gleichung-add': {
    sources: ['k7-lb2-gleichung-add'],
    maxDifficulty: 2,
    note: 'Gleichungstyp ax+b=c; Master-Quelle liegt in Gym-K7, Inhalt K5-Niveau.',
  },
  'sks-k5-gleichung-mul': {
    sources: ['k7-lb2-gleichung-mul'],
    maxDifficulty: 2,
    note: 'Gleichungstyp ax=b.',
  },
  'sks-k5-bruch-anteil': {
    sources: ['lb2-anteil-bruch'],
    maxDifficulty: 2,
    note: '„Brüche als Teile von Ganzen angeben“.',
  },
  'sks-k5-bruch-kuerzen': {
    sources: ['lb2-kuerzen'],
    maxDifficulty: 2,
    note: 'Brüche kürzen/erweitern.',
  },
  'sks-k5-bruch-erweitern': {
    sources: ['lb2-erweitern'],
    maxDifficulty: 2,
    note: 'Brüche erweitern.',
  },
  'sks-k5-bruch-grafik': {
    sources: ['lb2-grafische-brueche'],
    maxDifficulty: 2,
    note: 'Brüche veranschaulichen.',
  },
  'sks-k5-dez-add': {
    sources: ['lb2-dez-add-sub'],
    maxDifficulty: 2,
    note: 'Dezimalbrüche addieren/subtrahieren.',
  },
  'sks-k5-dez-mul': {
    sources: ['lb2-dez-mult'],
    maxDifficulty: 2,
    note: 'Dezimalbrüche multiplizieren.',
  },
  'sks-k5-dez-div': {
    sources: ['lb2-dez-div'],
    maxDifficulty: 2,
    note: 'Division steht im 5/6-Block unter Gebrochene Zahlen (Jg.-6-Niveau); der Block ist nicht in 5 und 6 aufgeteilt.',
  },
  'sks-k5-dez-runden': {
    sources: ['lb2-runden-dezimal'],
    maxDifficulty: 2,
    note: '„Dezimalbrüche runden“.',
  },
  'sks-k5-dez-zahlenstrahl': {
    sources: ['lb2-zahlenstrahl'],
    maxDifficulty: 2,
    note: '„auf dem Zahlenstrahl ablesen und eintragen“.',
  },
  'sks-k5-groessen-ordnen': {
    sources: ['lb2-ordnen-einheiten'],
    maxDifficulty: 2,
    note: '„Größenangaben umrechnen, vergleichen und ordnen“.',
  },
  'sks-k5-umr-laenge': {
    sources: ['k5-umrechnen-laenge', 'k6-umrechnen-laenge'],
    maxDifficulty: 2,
    note: 'Größenarten/Einheiten Länge. E5-Ergänzung: zweiter Master aus Gym-K6 (ein KS Größen für 5/6).',
  },
  'sks-k5-umr-masse': {
    sources: ['k5-umrechnen-masse'],
    maxDifficulty: 2,
    note: 'Größenarten/Einheiten Masse.',
  },
  'sks-k5-umr-zeit': {
    sources: ['k5-umrechnen-zeit'],
    maxDifficulty: 2,
    note: 'Größenarten/Einheiten Zeit.',
  },
  'sks-k5-umr-flaeche': {
    sources: ['k5-umrechnen-flaeche', 'k6-umrechnen-flaeche'],
    maxDifficulty: 2,
    note: 'Größenarten/Einheiten Flächeninhalt. E5-Ergänzung: zweiter Master aus Gym-K6 (ein KS Größen für 5/6).',
  },
  'sks-k5-umr-volumen': {
    sources: ['k5-umrechnen-volumen'],
    maxDifficulty: 2,
    note: 'Größenarten/Einheiten Volumen.',
  },
  'sks-k5-geo-strecken': {
    sources: ['lb3-strecken-bezeichnung'],
    maxDifficulty: 2,
    note: 'Punkt, Gerade, Strahl, Strecke bezeichnen.',
  },
  'sks-k5-geo-laenge': {
    sources: ['lb3-strecken-laenge'],
    maxDifficulty: 2,
    note: 'Messen von Längen.',
  },
  'sks-k5-geo-mittelpunkt': {
    sources: ['lb3-strecken-mittelpunkt'],
    maxDifficulty: 2,
    note: 'Nur indirekt (Konstruktion/Koordinaten); d2.',
  },
  'sks-k5-geo-koord-ablesen': {
    sources: ['lb3-koordinaten-ablesen'],
    maxDifficulty: 2,
    note: 'Koordinatensystem, I. Quadrant.',
  },
  'sks-k5-geo-koord-eintragen': {
    sources: ['lb3-koordinaten-eintragen'],
    maxDifficulty: 2,
    note: 'Koordinatensystem, I. Quadrant.',
  },
  'sks-k5-geo-abstand': {
    sources: ['lb3-koordinaten-abstand'],
    maxDifficulty: 2,
    note: 'Abstand im Koordinatensystem.',
  },
  'sks-k5-geo-winkelarten': {
    sources: ['lb3-winkelarten'],
    maxDifficulty: 2,
    note: 'spitz/recht/stumpf/gestreckt/überstumpf.',
  },
  'sks-k5-geo-winkel-erg': {
    sources: ['lb3-winkel-ergaenzung'],
    maxDifficulty: 2,
    note: 'Winkelgrößen bestimmen.',
  },
  'sks-k5-geo-verschiebung': {
    sources: ['lb3-verschiebung'],
    maxDifficulty: 2,
    note: '„Merkmale von Verschiebung und Spiegelung“.',
  },
  'sks-k5-geo-achse': {
    sources: ['lb3-achsensymmetrie'],
    maxDifficulty: 2,
    note: 'Achsensymmetrie/Geradenspiegelung.',
  },
  'sks-k5-umfang-rechteck': {
    sources: ['lb4-umfang-rechteck', 'lb3-umfang-rechteck', 'lb4-umfang-zusammengesetzt'],
    maxDifficulty: 2,
    note: 'Zweite Quelle (Gym-K6) vergrößert den Pool; 5/6-Block ohne Klassenaufteilung. E5-Ergänzung: Umfang rechteckig zusammengesetzter Figuren.',
  },
  'sks-k5-flaeche-rechteck': {
    sources: ['lb4-flaeche-rechteck', 'lb3-flaeche-rechteck', 'lb4-flaeche-zusammengesetzt'],
    maxDifficulty: 2,
    note: 'Wie oben. E5-Ergänzung: Flächeninhalt rechteckig zusammengesetzter Figuren.',
  },
  'sks-k5-volumen-quader': {
    sources: ['mathematik-klasse-5:lb4-volumen-quader', 'mathematik-klasse-6:lb4-volumen-quader'],
    maxDifficulty: 2,
    note: 'K5- und K6-Master (gleiche ID in beiden Klassen, daher klassenqualifiziert); Volumen von Quader und Würfel, 5/6-Block ohne Klassenaufteilung.',
  },
  'sks-k5-oberflaeche-quader': {
    sources: ['mathematik-klasse-5:lb4-oberflaeche-quader', 'mathematik-klasse-6:lb4-oberflaeche-quader'],
    maxDifficulty: 2,
    note: 'K5- und K6-Master (gleiche ID in beiden Klassen, daher klassenqualifiziert); Oberflächeninhalt, 5/6-Block ohne Klassenaufteilung.',
  },
  'sks-k5-mittelwert': {
    sources: ['lb2-mittelwert'],
    maxDifficulty: 2,
    note: 'Der KS gilt für den gesamten 5/6-Block.',
  },
  'sks-k6-bruch-kuerzen': {
    sources: ['lb1-kuerzen'],
    maxDifficulty: 2,
    note: 'Selbes Konzept wie sks-k5-bruch-kuerzen, aber anderes Master-Thema (Gym-K6).',
  },
  'sks-k6-bruch-erweitern': {
    sources: ['lb1-erweitern'],
    maxDifficulty: 2,
    note: 'Wie oben.',
  },
  'sks-k6-bruch-vergleichen': {
    sources: ['lb1-vergleichen'],
    maxDifficulty: 2,
    note: '„gebrochene Zahlen vergleichen und ordnen“.',
  },
  'sks-k6-bruch-add': {
    sources: ['lb1-add-sub-brueche', 'lb1-sachaufgabe-bruch'],
    maxDifficulty: 2,
    note: 'Zusätzlich Sachaufgabe Bruchrechnung (Anwendungsaufgaben).',
  },
  'sks-k6-bruch-mul': {
    sources: ['lb1-mult-brueche'],
    maxDifficulty: 2,
    note: 'Grundrechenarten mit gebrochenen Zahlen.',
  },
  'sks-k6-bruch-div': {
    sources: ['lb1-div-brueche'],
    maxDifficulty: 2,
    note: 'Kehrwert.',
  },
  'sks-k6-bruch-dez': {
    sources: ['lb1-bruch-dezimal'],
    maxDifficulty: 2,
    note: '„gemeine Brüche und Dezimalbrüche ineinander umwandeln“.',
  },
  'sks-k6-prozent': {
    sources: ['lb1-prozent'],
    maxDifficulty: 2,
    note: 'Nur „spezielle Brüche … prozentualen Angaben zuordnen“; Prozentrechnung erst 7/8.',
  },
  'sks-k6-dez-add': {
    sources: ['lb1-dez-add-sub'],
    maxDifficulty: 2,
    note: 'Master Gym-K6; Konzeptdopplung zu sks-k5-dez-add (anderes Master-Thema).',
  },
  'sks-k6-dez-mul': {
    sources: ['lb1-dez-mult'],
    maxDifficulty: 2,
    note: 'Wie oben.',
  },
  'sks-k6-dez-div': {
    sources: ['lb1-dez-div'],
    maxDifficulty: 2,
    note: 'Wie oben.',
  },
  'sks-k6-dez-runden': {
    sources: ['lb1-runden'],
    maxDifficulty: 2,
    note: 'Wie oben.',
  },
  'sks-k6-nebenwinkel': {
    sources: ['k7-lb1-nebenwinkel'],
    maxDifficulty: 2,
    note: 'Master in Gym-K7, Jg.-6-Niveau; Nebenwinkelsatz im 5/6-Block.',
  },
  'sks-k6-scheitelwinkel': {
    sources: ['k7-lb1-scheitelwinkel'],
    maxDifficulty: 2,
    note: 'Scheitel-/Stufenwinkelsatz.',
  },
  'sks-k6-winkel-dreieck': {
    sources: ['lb3-winkel-dreieck', 'k7-lb1-basiswinkel'],
    maxDifficulty: 2,
    note: 'Zusätzlich Basiswinkel im gleichschenkligen Dreieck.',
  },
  'sks-k6-flaeche-dreieck': {
    sources: ['lb3-flaeche-dreieck'],
    maxDifficulty: 2,
    note: 'Formel Fläche Dreieck.',
  },
  'sks-k6-kongruenz': {
    sources: ['lb3-kongruenzsatz'],
    maxDifficulty: 2,
    note: 'Kongruenzsätze.',
  },
  'sks-k6-umkreis': {
    sources: ['k7-lb1-mittelsenkrechte-schritte'],
    maxDifficulty: 2,
    note: 'Mittelsenkrechte/Umkreis; Konstruktionsschritte. Neu zugeordnet (bisher Outline).',
  },
  'sks-k6-proportional': {
    sources: ['lb2-proportional'],
    maxDifficulty: 2,
    note: 'Direkte Proportionalität/Dreisatz.',
  },
  'sks-k6-antiproportional': {
    sources: ['lb2-antiproportional'],
    maxDifficulty: 2,
    note: 'Indirekte Proportionalität.',
  },
  'sks-k6-dreisatz': {
    sources: ['lb2-sachaufgabe-dreisatz'],
    maxDifficulty: 2,
    note: 'Dreisatz.',
  },
  'sks-k6-anteil-prozent': {
    sources: ['lb5-anteil-groesse'],
    maxDifficulty: 2,
    note: 'ABWEICHUNG D5: „Prozent einer Größe“ ist 7/8-Stoff; in 5/6 „Anteile von Zahlen und Größen ermitteln“. Titel anpassen; lb5-anteil-prozent geht nach sks-k7-prozent.',
  },
  'sks-k6-mittelwert': {
    sources: ['k7-lb4-mittelwert'],
    maxDifficulty: 2,
    note: 'ABWEICHUNG D2: ein KS für den 5/6-Block, schon durch sks-k5-mittelwert abgedeckt. K6-Fassung nur als Vertiefung über das andere Master-Thema; Alternative: entfernen.',
  },
  'sks-k7-rat-add': {
    sources: ['k7-lb2-add-rational'],
    maxDifficulty: 2,
    note: 'Grundrechenoperationen mit rationalen Zahlen.',
  },
  'sks-k7-rat-sub': {
    sources: ['k7-lb2-sub-rational'],
    maxDifficulty: 2,
    note: 'Grundrechenoperationen mit rationalen Zahlen.',
  },
  'sks-k7-rat-mul': {
    sources: ['k7-lb2-mul-rational'],
    maxDifficulty: 2,
    note: 'Grundrechenoperationen mit rationalen Zahlen.',
  },
  'sks-k7-rat-div': {
    sources: ['k7-lb2-div-rational'],
    maxDifficulty: 2,
    note: 'Grundrechenoperationen mit rationalen Zahlen.',
  },
  'sks-k7-betrag': {
    sources: ['k7-lb2-betrag'],
    maxDifficulty: 2,
    note: 'Betrag/entgegengesetzte Zahl.',
  },
  'sks-k7-prozent': {
    sources: ['lb5-anteil-prozent'],
    maxDifficulty: 2,
    note: 'Prozentwert/Grundwert/Prozentsatz (Pool ggf. nur Prozentwert).',
  },
  'sks-k7-zinsen': {
    sources: ['k10-lb1-zinsen'],
    maxDifficulty: 2,
    note: 'Zinsrechnung; HSA: Jahreszinsen.',
  },
  'sks-hs-k7-kapital': {
    sources: ['k10-lb5-kapital'],
    maxDifficulty: 2,
    note: 'Grundwert aus Prozentwert/Prozentsatz (Kapital, Zinsen, Zinssatz sind im HSA 7/8 benannt).',
  },
  'sks-hs-k7-zinssatz': {
    sources: ['k10-lb5-zinssatz'],
    maxDifficulty: 2,
    note: 'Prozentsatz aus Zinsen/Kapital.',
  },
  'sks-k7-haeufigkeit': {
    sources: ['lb2-haeufigkeit', 'k7-lb4-rel-haeufigkeit'],
    maxDifficulty: 2,
    note: 'Neues Pack-Thema; „absolute/relative Häufigkeit, auch in Prozent“.',
  },
  'sks-k7-gleichung': {
    sources: ['k8-lb1-gleichung-linear', 'k8-lb5-zahlenraetsel', 'k8-lb5-rueckwaerts'],
    maxDifficulty: 2,
    note: 'Zusätzlich Anwendungsaufgaben/Gleichung aufstellen, Rückwärtsrechnen („Probe am Text“).',
  },
  'sks-k7-gleichung-beid': {
    sources: ['k8-lb1-gleichung-beidseitig'],
    maxDifficulty: 2,
    note: 'Typ ax+b=cx+d.',
  },
  'sks-k7-term': {
    sources: ['k7-lb2-term-vorrang'],
    maxDifficulty: 2,
    note: 'Termwerte berechnen/Rechenvorteile.',
  },
  'sks-k7-term-auswerten': {
    sources: ['k8-lb1-term-auswerten'],
    maxDifficulty: 2,
    note: '„Termwerte … berechnen“.',
  },
  'sks-k7-zusammenfassen': {
    sources: ['k8-lb1-zusammenfassen'],
    maxDifficulty: 2,
    note: 'Zusammenfassen gleichartiger Summanden.',
  },
  'sks-k7-ausmult': {
    sources: ['k8-lb1-ausmultiplizieren'],
    maxDifficulty: 2,
    note: 'Ausmultiplizieren.',
  },
  'sks-k7-winkel-viereck': {
    sources: ['lb3-winkel-viereck'],
    maxDifficulty: 2,
    note: 'Innenwinkelsatz Viereck.',
  },
  'sks-k7-volumen-prisma': {
    sources: ['k7-lb3-volumen-prisma', 'lb4-volumen-prisma', 'lb4-flaeche-kante-quader'],
    maxDifficulty: 2,
    note: 'Prisma (Grundfläche Dreieck/Viereck); „Bestimmungsstücke bei gegebenem Volumen“ über lb4-flaeche-kante-quader.',
  },
  'sks-k7-mantel-prisma': {
    sources: ['k7-lb3-mantel-prisma'],
    maxDifficulty: 2,
    note: 'Oberflächeninhalt Prisma (Mantel als Teil).',
  },
  'sks-k7-oberflaeche-quader': {
    sources: ['k7-lb3-oberflaeche-quader'],
    maxDifficulty: 2,
    note: 'Quader als Prisma; Konzeptnähe zu sks-k5-oberflaeche-quader, anderes Master-Thema. Titel „Oberflächeninhalt von Prismen“ empfohlen.',
  },
  'sks-k7-zylinder': {
    sources: ['k9-lb2-zylinder-volumen'],
    maxDifficulty: 2,
    note: 'Einzige Zylinder-Platzierung (sks-k8-zylinder entfällt).',
  },
  'sks-k7-netz': {
    sources: ['lb4-wuerfelnetz'],
    maxDifficulty: 2,
    note: 'Netz (Würfelnetz); Schrägbild ohne Master.',
  },
  'sks-k8-kreis-umfang': {
    sources: ['k9-lb2-kreis-umfang'],
    maxDifficulty: 2,
    note: 'Umfang Kreis.',
  },
  'sks-k8-kreis-flaeche': {
    sources: ['k9-lb2-kreis-flaeche'],
    maxDifficulty: 2,
    note: 'Fläche Kreis.',
  },
  'sks-k8-pythagoras-hyp': {
    sources: ['k9-lb3-pythagoras-hypotenuse'],
    maxDifficulty: 2,
    note: 'Satz des Pythagoras.',
  },
  'sks-k8-pythagoras-kat': {
    sources: ['k9-lb3-pythagoras-kathete'],
    maxDifficulty: 2,
    note: 'Dreiecksstücke berechnen.',
  },
  'sks-k8-leiter': {
    sources: ['k9-lb5-leiter'],
    maxDifficulty: 2,
    note: 'Anwendungsaufgaben.',
  },
  'sks-k8-funktionswert': {
    sources: ['k8-lb3-funktionswert'],
    maxDifficulty: 2,
    note: 'Funktionswert.',
  },
  'sks-k8-steigung': {
    sources: ['k8-lb3-steigung'],
    maxDifficulty: 2,
    note: 'Parameter m.',
  },
  'sks-k8-achsen': {
    sources: ['k8-lb3-achsenabschnitt'],
    maxDifficulty: 2,
    note: 'Parameter n / Nullstelle.',
  },
  'sks-k8-laplace': {
    sources: ['k8-lb2-laplace-bruch'],
    maxDifficulty: 2,
    note: 'Einstufige Zufallsversuche.',
  },
  'sks-k8-laplace-pct': {
    sources: ['k8-lb2-laplace-prozent'],
    maxDifficulty: 2,
    note: 'Wahrscheinlichkeit P(A).',
  },
  'sks-k8-gegen': {
    sources: ['k8-lb2-gegenwahrscheinlichkeit'],
    maxDifficulty: 2,
    note: 'P(A)+P(Ā)=1.',
  },
  'sks-hs-k9-formeln': {
    sources: ['k10-lb3-quadrat-seite', 'k10-lb3-rechteck-breite', 'k10-lb3-rechteck-umfang'],
    maxDifficulty: 2,
    note: '„Gleichungen und Formeln nach verschiedenen Variablen umstellen“; ungenutzte Gym-K10-LB3-Themen (d1/d2/d2).',
  },
  'sks-hs-k9-pyramide': {
    sources: ['k7-lb3-volumen-pyramide'],
    maxDifficulty: 2,
    note: 'HSA: Pyramiden mit quadratischer Grundfläche; Master-Aufgaben darauf prüfen.',
  },
  'sks-hs-k9-oberflaeche-pyramide': {
    sources: ['k7-lb3-oberflaeche-pyramide'],
    maxDifficulty: 2,
    note: 'Wie oben.',
  },
  'sks-hs-k9-volumen-zus': {
    sources: ['lb4-volumen-zusammengesetzt'],
    maxDifficulty: 2,
    note: '„Berechnungen an zusammengesetzten Körpern“.',
  },
  'sks-hs-k9-lgs': {
    sources: ['k8-lb3-lgs'],
    maxDifficulty: 3,
    difficultyReason:
      'Fachlehrplan Sekundarschule Mathematik (Stand 01.08.2019) §3.4.2 KS Lineare Gleichungssysteme, S. 59: LGS (Einsetzungsverfahren) ist HSA-Pflichtinhalt; der einzige LGS-Master k8-lb3-lgs hat difficulty 3.',
    note: 'Einziger LGS-Master (Gleichungssysteme lösen).',
  },
  'sks-hs-k9-exp': {
    sources: ['k10-lb1-exp-wachstum'],
    maxDifficulty: 2,
    note: 'ABWEICHUNG D17: HSA nennt nichtlineares Wachstum, nicht Exponentialfunktionen; Titel „Exponentielles Wachstum“ anpassen.',
  },
  'sks-hs-k9-zunahme': {
    sources: ['k10-lb1-prozentuale-zunahme'],
    maxDifficulty: 2,
    note: '„Steigerung bzw. Senkung um bzw. auf; vermehrter/verminderter Grundwert“.',
  },
  'sks-hs-k9-zinseszins': {
    sources: ['k10-lb1-zinseszins'],
    maxDifficulty: 2,
    note: '„Zinseszinsen“ im HSA 9; aus K7 hierher verschoben.',
  },
  'sks-hs-k9-mittelwert': {
    sources: ['k9-lb4-mittelwert'],
    maxDifficulty: 2,
    note: 'Kenngröße.',
  },
  'sks-hs-k9-spannweite': {
    sources: ['k7-lb4-spannweite'],
    maxDifficulty: 2,
    note: 'Kenngröße Spannweite.',
  },
  'sks-rs-k9-potenz-prod': {
    sources: ['k9-lb1-potenz-produkt'],
    note: '„Potenzgesetze anwenden“.',
  },
  'sks-rs-k9-potenz-quot': {
    sources: ['k9-lb1-potenz-quotient'],
    note: 'Potenzgesetze.',
  },
  'sks-rs-k9-formeln': {
    sources: ['k10-lb3-quadrat-seite', 'k10-lb3-rechteck-breite', 'k10-lb3-rechteck-umfang'],
    note: '„Gleichungen und Formeln nach verschiedenen Variablen umstellen“.',
  },
  'sks-rs-k9-pyramide': {
    sources: ['k7-lb3-volumen-pyramide'],
    note: 'Volumen Pyramide.',
  },
  'sks-rs-k9-oberflaeche-pyramide': {
    sources: ['k7-lb3-oberflaeche-pyramide'],
    note: 'Im RS-Pack fehlt die Pyramidenoberfläche (HS-Pack hat sie).',
  },
  'sks-rs-k9-kugel': {
    sources: ['k9-lb2-kugel-volumen'],
    note: 'Kugel (RSA).',
  },
  'sks-rs-k9-volumen-zus': {
    sources: ['lb4-volumen-zusammengesetzt'],
    note: 'Zusammengesetzte Körper.',
  },
  'sks-rs-k9-streckfaktor': {
    sources: ['k8-lb4-streckfaktor'],
    note: 'Zentrische Streckung.',
  },
  'sks-rs-k9-strahlensatz': {
    sources: ['k8-lb4-strahlensatz'],
    note: 'Streckenverhältnisse.',
  },
  'sks-rs-k9-aehnlich': {
    sources: ['k8-lb4-aehnliche-seite'],
    note: 'Ähnlichkeit.',
  },
  'sks-rs-k9-trig': {
    sources: ['k9-lb3-trig-wert'],
    note: 'Trigonometrie am rechtwinkligen Dreieck.',
  },
  'sks-rs-k9-lgs': {
    sources: ['k8-lb3-lgs'],
    note: 'Master difficulty 3; für RS ohne Einschränkung.',
  },
  'sks-rs-k9-exp': {
    sources: ['k10-lb1-exp-wachstum'],
    note: 'Exponentialfunktion y=2^x, Wachstumsprozesse.',
  },
  'sks-rs-k9-zunahme': {
    sources: ['k10-lb1-prozentuale-zunahme'],
    note: '„Prozentrechnung bei Wachstumsprozessen“.',
  },
  'sks-rs-k9-mittelwert': {
    sources: ['k9-lb4-mittelwert'],
    note: 'Kenngrößen.',
  },
  'sks-rs-k9-median': {
    sources: ['k9-lb4-median', 'k7-lb4-median'],
    note: 'Median nur RSA; zweite Quelle aus entfernter K7-Platzierung.',
  },
  'sks-rs-k10-quadrat-wert': {
    sources: ['k9-lb1-quadrat-wert'],
    note: 'Quadratische Funktion.',
  },
  'sks-rs-k10-scheitel': {
    sources: ['k9-lb1-scheitel'],
    note: 'Scheitelpunkt.',
  },
  'sks-rs-k10-reinquadratisch': {
    sources: ['k10-lb4-reinquadratisch'],
    note: 'Spezialfall quadratische Gleichung.',
  },
  'sks-rs-k10-gleichung': {
    sources: ['k10-lb4-quadratische-gleichung'],
    note: 'Lösungsformel/Diskriminante.',
  },
  'sks-rs-k10-parabel': {
    sources: ['k10-lb4-parabel-wert'],
    note: 'Parabel.',
  },
  'sks-rs-k10-kapital': {
    sources: ['k10-lb5-kapital'],
    note: 'Bleibt in K10 (Prozentrechnung ist 7/8-Stoff; Verschiebung nach K7 optional).',
  },
  'sks-rs-k10-zinssatz': {
    sources: ['k10-lb5-zinssatz'],
    note: 'Wie oben.',
  },
  'sks-rs-k10-spannweite': {
    sources: ['k7-lb4-spannweite'],
    note: 'Kenngröße (9/10-Block).',
  },
  'sks-k7-zinseszins': {
    sources: ['k10-lb1-zinseszins'],
    note: 'RSA 7/8 nennt Zinseszins ausdrücklich. Einzige RS-Platzierung (rs-k9/k10-zinseszins entfallen, D20).',
  },
  // ——— Entfernte Pack-Themen: Alias auf den Master bzw. das übernehmende Thema (gespeicherte IDs bleiben auflösbar) ———
  'sks-k5-geo-punkt': {
    sources: ['lb3-punktsymmetrie'],
    note: 'Entferntes Pack-Thema (Fachlehrplan-Abweichung, siehe Mapping-Doc); nur Alias für gespeicherte IDs, nicht im Outline.',
  },
  'sks-k6-haeufigkeit': {
    sources: ['lb2-haeufigkeit', 'k7-lb4-rel-haeufigkeit'],
    maxDifficulty: 2,
    note: 'Entferntes Pack-Thema (Fachlehrplan-Abweichung, siehe Mapping-Doc); nur Alias für gespeicherte IDs, nicht im Outline.',
  },
  'sks-k7-winkelsumme': {
    sources: ['k7-lb1-winkelsumme-vieleck'],
    note: 'Entferntes Pack-Thema (Fachlehrplan-Abweichung, siehe Mapping-Doc); nur Alias für gespeicherte IDs, nicht im Outline.',
  },
  'sks-k7-mittelwert': {
    sources: ['k7-lb4-mittelwert'],
    maxDifficulty: 2,
    note: 'Entferntes Pack-Thema (Fachlehrplan-Abweichung, siehe Mapping-Doc); nur Alias für gespeicherte IDs, nicht im Outline.',
  },
  'sks-k7-median': {
    sources: ['k7-lb4-median'],
    note: 'Entferntes Pack-Thema (Fachlehrplan-Abweichung, siehe Mapping-Doc); nur Alias für gespeicherte IDs, nicht im Outline.',
  },
  'sks-k7-spannweite': {
    sources: ['k7-lb4-spannweite'],
    note: 'Entferntes Pack-Thema (Fachlehrplan-Abweichung, siehe Mapping-Doc); nur Alias für gespeicherte IDs, nicht im Outline.',
  },
  'sks-k8-zylinder': {
    sources: ['k9-lb2-zylinder-volumen'],
    maxDifficulty: 2,
    note: 'Entferntes Pack-Thema (Fachlehrplan-Abweichung, siehe Mapping-Doc); nur Alias für gespeicherte IDs, nicht im Outline.',
  },
  'sks-hs-k9-potenz-prod': {
    sources: ['k9-lb1-potenz-produkt'],
    note: 'Entferntes Pack-Thema (Fachlehrplan-Abweichung, siehe Mapping-Doc); nur Alias für gespeicherte IDs, nicht im Outline.',
  },
  'sks-hs-k9-potenz-quot': {
    sources: ['k9-lb1-potenz-quotient'],
    note: 'Entferntes Pack-Thema (Fachlehrplan-Abweichung, siehe Mapping-Doc); nur Alias für gespeicherte IDs, nicht im Outline.',
  },
  'sks-hs-k9-median': {
    sources: ['k9-lb4-median'],
    note: 'Entferntes Pack-Thema (Fachlehrplan-Abweichung, siehe Mapping-Doc); nur Alias für gespeicherte IDs, nicht im Outline.',
  },
  'sks-hs-k9-modal': {
    sources: ['k9-lb4-modalwert'],
    note: 'Entferntes Pack-Thema (Fachlehrplan-Abweichung, siehe Mapping-Doc); nur Alias für gespeicherte IDs, nicht im Outline.',
  },
  'sks-rs-k9-modal': {
    sources: ['k9-lb4-modalwert'],
    note: 'Entferntes Pack-Thema (Fachlehrplan-Abweichung, siehe Mapping-Doc); nur Alias für gespeicherte IDs, nicht im Outline.',
  },
  'sks-rs-k9-laplace': {
    sources: ['k8-lb2-laplace-bruch'],
    maxDifficulty: 2,
    note: 'Entferntes Pack-Thema (Fachlehrplan-Abweichung, siehe Mapping-Doc); nur Alias für gespeicherte IDs, nicht im Outline.',
  },
  'sks-rs-k10-zinsen': {
    sources: ['k10-lb1-zinsen'],
    maxDifficulty: 2,
    note: 'Entferntes Pack-Thema (Fachlehrplan-Abweichung, siehe Mapping-Doc); nur Alias für gespeicherte IDs, nicht im Outline.',
  },
  'sks-rs-k10-zinseszins': {
    sources: ['k10-lb1-zinseszins'],
    note: 'Entferntes Pack-Thema (Fachlehrplan-Abweichung, siehe Mapping-Doc); nur Alias für gespeicherte IDs, nicht im Outline.',
  },
  'sks-rs-k10-erwartung': {
    sources: ['k10-lb2-erwartungswert'],
    note: 'Entferntes Pack-Thema (Fachlehrplan-Abweichung, siehe Mapping-Doc); nur Alias für gespeicherte IDs, nicht im Outline.',
  },
  'sks-rs-k10-erwartung-wuerfel': {
    sources: ['k10-lb2-erwartungswert-wuerfel'],
    note: 'Entferntes Pack-Thema (Fachlehrplan-Abweichung, siehe Mapping-Doc); nur Alias für gespeicherte IDs, nicht im Outline.',
  },
}

/** Alte 1:1-String-Map: vollständig durch SKS_TOPIC_MAPPINGS ersetzt (bleibt als leerer Export). */
export const SKS_GENERATOR_MAP: Record<string, string> = {}

function grades56(prefix: 'sks-hs' | 'sks-rs', track: string): PackGrade[] {
  return [
    grade(
      `${prefix}-klasse-5`,
      `Klasse 5 · ${track}`,
      `Klasse 5 · ${track}`,
      'Natürliche Zahlen, Gleichungen, Brüche und Dezimalbrüche, Größen, geometrische Grundbegriffe sowie Umfang, Flächeninhalt und Volumen (ST Schuljahrgänge 5/6).',
      [
        'natürliche Zahlen', 'Brüche', 'Dezimalzahlen', 'Winkel', 'Rechteck', 'Quader',
        'Umfang', 'Fläche', 'Volumen', 'Koordinaten', 'Symmetrie',
      ],
      [
        area('zg-nat', 'Natürliche Zahlen', [
          topic('sks-k5-nat-runden', 'Natürliche Zahlen runden'),
          topic('sks-k5-nat-add', 'Addieren natürlicher Zahlen'),
          topic('sks-k5-nat-sub', 'Subtrahieren natürlicher Zahlen'),
          topic('sks-k5-nat-mul', 'Multiplizieren natürlicher Zahlen'),
          topic('sks-k5-nat-schriftlich', 'Schriftliche Rechenverfahren'),
          topic('sks-k5-nat-div-rest', 'Division mit Rest'),
          topic('sks-k5-nat-div', 'Schriftliche Division'),
          topic('sks-k5-nat-potenz', 'Potenzen (Quadrat- und Zehnerpotenzen)'),
          topic('sks-k5-nat-teilbarkeit', 'Teilbarkeit prüfen'),
          topic('sks-k5-nat-prim', 'Primzahlen erkennen'),
          topic('sks-k5-sachaufgaben', 'Sachaufgaben mit natürlichen Zahlen und Größen'),
        ]),
        area('zg-gleichung', 'Gleichungen', [
          topic('sks-k5-gleichung-add', 'Gleichung umstellen: x + a = b'),
          topic('sks-k5-gleichung-mul', 'Gleichung umstellen: a · x = b'),
          topic('sks-k5-gleichung-probe', 'Lineare Gleichung und Probe'),
        ]),
        area('zg-bruch', 'Brüche und Dezimalbrüche', [
          topic('sks-k5-bruch-anteil', 'Anteil als Bruch'),
          topic('sks-k5-bruch-kuerzen', 'Brüche kürzen'),
          topic('sks-k5-bruch-erweitern', 'Brüche erweitern'),
          topic('sks-k5-bruch-grafik', 'Brüche grafisch ablesen'),
          topic('sks-k5-dez-add', 'Dezimalzahlen addieren und subtrahieren'),
          topic('sks-k5-dez-mul', 'Dezimalzahlen multiplizieren'),
          topic('sks-k5-dez-div', 'Dezimalzahlen dividieren'),
          topic('sks-k5-dez-runden', 'Dezimalzahlen runden'),
          topic('sks-k5-dez-zahlenstrahl', 'Dezimalzahlen auf dem Zahlenstrahl'),
        ]),
        area('zg-groessen', 'Größen', [
          topic('sks-k5-groessen-ordnen', 'Größen mit verschiedenen Einheiten ordnen'),
          topic('sks-k5-umr-laenge', 'Einheiten umrechnen: Länge'),
          topic('sks-k5-umr-masse', 'Einheiten umrechnen: Masse'),
          topic('sks-k5-umr-zeit', 'Einheiten umrechnen: Zeit'),
          topic('sks-k5-umr-flaeche', 'Einheiten umrechnen: Flächeninhalt'),
          topic('sks-k5-umr-volumen', 'Einheiten umrechnen: Volumen'),
        ]),
        area('rf-grund', 'Geometrische Grundbegriffe und Symmetrie', [
          topic('sks-k5-geo-strecken', 'Strecke, Gerade und Halbgerade'),
          topic('sks-k5-geo-laenge', 'Länge von Strecken'),
          topic('sks-k5-geo-mittelpunkt', 'Mittelpunkt einer Strecke'),
          topic('sks-k5-geo-koord-ablesen', 'Koordinaten ablesen'),
          topic('sks-k5-geo-koord-eintragen', 'Punkte im Koordinatensystem zuordnen'),
          topic('sks-k5-geo-abstand', 'Abstand zwischen Punkten'),
          topic('sks-k5-geo-winkelarten', 'Winkelarten erkennen'),
          topic('sks-k5-geo-winkel-erg', 'Winkel zu 90° oder 180° ergänzen'),
          topic('sks-k5-geo-verschiebung', 'Verschiebung von Figuren'),
          topic('sks-k5-geo-achse', 'Achsensymmetrie erkennen'),
        ]),
        area('rf-umfang', 'Umfang, Flächeninhalt und Volumen', [
          topic('sks-k5-umfang-rechteck', 'Umfang von Rechteck und Quadrat'),
          topic('sks-k5-flaeche-rechteck', 'Flächeninhalt von Rechteck und Quadrat'),
          topic('sks-k5-volumen-quader', 'Volumen von Quader und Würfel'),
          topic('sks-k5-oberflaeche-quader', 'Oberflächeninhalt von Quadern'),
        ]),
        area('dz-mittel', 'Arithmetisches Mittel', [
          topic('sks-k5-mittelwert', 'Arithmetisches Mittel'),
        ]),
      ],
    ),
    grade(
      `${prefix}-klasse-6`,
      `Klasse 6 · ${track}`,
      `Klasse 6 · ${track}`,
      'Gebrochene Zahlen, Winkelbeziehungen, Dreiecke, Proportionalität sowie Daten (ST Schuljahrgänge 5/6).',
      [
        'Brüche', 'Dezimalzahlen', 'Proportionalität', 'Dreisatz', 'Dreieck', 'Winkel',
        'Prozent', 'Häufigkeit',
      ],
      [
        area('zg-gebrochen', 'Gebrochene Zahlen', [
          topic('sks-k6-bruch-kuerzen', 'Brüche kürzen'),
          topic('sks-k6-bruch-erweitern', 'Brüche erweitern'),
          topic('sks-k6-bruch-vergleichen', 'Brüche vergleichen'),
          topic('sks-k6-bruch-add', 'Brüche addieren und subtrahieren'),
          topic('sks-k6-bruch-mul', 'Brüche multiplizieren'),
          topic('sks-k6-bruch-div', 'Brüche dividieren'),
          topic('sks-k6-bruch-dez', 'Brüche in Dezimalzahlen umwandeln'),
          topic('sks-k6-prozent', 'In Prozent umwandeln'),
          topic('sks-k6-dez-add', 'Dezimalzahlen addieren und subtrahieren'),
          topic('sks-k6-dez-mul', 'Dezimalzahlen multiplizieren'),
          topic('sks-k6-dez-div', 'Dezimalzahlen dividieren'),
          topic('sks-k6-dez-runden', 'Dezimalzahlen runden'),
        ]),
        area('rf-winkel', 'Winkelbeziehungen', [
          topic('sks-k6-nebenwinkel', 'Nebenwinkel berechnen'),
          topic('sks-k6-scheitelwinkel', 'Scheitel- und Stufenwinkel'),
          topic('sks-k6-wechselwinkel', 'Wechselwinkel an Parallelen'),
          topic('sks-k6-gestreckter', 'Winkel am gestreckten Winkel'),
        ]),
        area('rf-dreieck', 'Dreiecke', [
          topic('sks-k6-winkel-dreieck', 'Innenwinkelsatz im Dreieck'),
          topic('sks-k6-flaeche-dreieck', 'Flächeninhalt von Dreiecken'),
          topic('sks-k6-kongruenz', 'Kongruenzsatz wählen'),
          topic('sks-k6-umkreis', 'Umkreis eines Dreiecks', ['Umkreis', 'Mittelsenkrechte']),
        ]),
        area('zf-prop', 'Direkte und indirekte Proportionalität', [
          topic('sks-k6-proportional', 'Proportionale Zuordnung (Dreisatz)'),
          topic('sks-k6-antiproportional', 'Antiproportionale Zuordnung'),
          topic('sks-k6-dreisatz', 'Sachaufgabe: Dreisatz mit Einheiten'),
          topic('sks-k6-anteil-prozent', 'Anteil einer Größe berechnen'),
        ]),
        area('dz-daten', 'Erfassen, Darstellen und Auswerten von Daten', [
          topic('sks-k6-mittelwert', 'Arithmetisches Mittel'),
        ]),
      ],
    ),
  ]
}

function grades78(prefix: 'sks-hs' | 'sks-rs', track: string): PackGrade[] {
  return [
    grade(
      `${prefix}-klasse-7`,
      `Klasse 7 · ${track}`,
      `Klasse 7 · ${track}`,
      'Rationale Zahlen, Prozentrechnung, lineare Gleichungen, Terme, Vierecke und Körper (ST 7/8).',
      [
        'rationale Zahlen', 'Prozent', 'Zinsen', 'Gleichungen', 'Terme', 'Viereck', 'Prisma',
        'Mittelwert',
      ],
      [
        area('zg-rational', 'Rationale Zahlen', [
          topic('sks-k7-rat-add', 'Rationale Zahlen addieren'),
          topic('sks-k7-rat-sub', 'Rationale Zahlen subtrahieren'),
          topic('sks-k7-rat-mul', 'Rationale Zahlen multiplizieren'),
          topic('sks-k7-rat-div', 'Rationale Zahlen dividieren'),
          topic('sks-k7-betrag', 'Betrag einer Zahl'),
        ]),
        area('zg-prozent', 'Prozentrechnung', [
          topic('sks-k7-prozent', 'Prozent einer Größe berechnen'),
          topic('sks-k7-zinsen', 'Jahreszinsen berechnen'),
          ...(prefix === 'sks-rs'
            ? [topic('sks-k7-zinseszins', 'Zinseszins: Endkapital')]
            : [
                topic('sks-hs-k7-kapital', 'Kapital aus Zinsen bestimmen'),
                topic('sks-hs-k7-zinssatz', 'Zinssatz bestimmen'),
              ]),
        ]),
        area('zg-gleichung', 'Lineare Gleichungen', [
          topic('sks-k7-gleichung', 'Lineare Gleichung a·x + b = c'),
          topic('sks-k7-gleichung-beid', 'Gleichung mit x auf beiden Seiten'),
          topic('sks-k7-gleichung-klammer', 'Gleichung mit Klammern vorbereiten'),
        ]),
        area('zg-variablen', 'Arbeiten mit Variablen, Gleichungen und Formeln', [
          topic('sks-k7-term', 'Term mit Rechengesetzen auswerten'),
          topic('sks-k7-term-auswerten', 'Term auswerten (x einsetzen)'),
          topic('sks-k7-zusammenfassen', 'Terme zusammenfassen'),
          topic('sks-k7-ausmult', 'Klammer ausmultiplizieren'),
        ]),
        area('rf-viereck', 'Vierecke', [
          topic('sks-k7-winkel-viereck', 'Winkelsumme im Viereck'),
          topic('sks-k7-parallelogramm', 'Flächeninhalt von Dreieck/Parallelogramm (Idee)'),
        ]),
        area('rf-koerper', 'Körperdarstellung und Körperberechnung (Prismen und Kreiszylinder)', [
          topic('sks-k7-volumen-prisma', 'Volumen gerader Prismen'),
          topic('sks-k7-mantel-prisma', 'Mantelfläche eines Prismas'),
          topic('sks-k7-oberflaeche-quader', 'Oberflächeninhalt von Prismen'),
          topic('sks-k7-zylinder', 'Volumen eines Kreiszylinders', ['Zylinder']),
          topic('sks-k7-netz', 'Körpernetze und Schrägbilder', ['Netz', 'Schrägbild']),
        ]),
        area('dz-daten', 'Erfassen, Darstellen und Auswerten von Daten', [
          topic('sks-k7-haeufigkeit', 'Absolute und relative Häufigkeit'),
        ]),
      ],
    ),
    grade(
      `${prefix}-klasse-8`,
      `Klasse 8 · ${track}`,
      `Klasse 8 · ${track}`,
      'Kreise, rechtwinklige Dreiecke, lineare Funktionen sowie Häufigkeiten und Wahrscheinlichkeiten (ST 7/8).',
      [
        'Kreis', 'Zylinder', 'Pythagoras', 'lineare Funktion', 'Steigung', 'Wahrscheinlichkeit',
        'Laplace',
      ],
      [
        area('rf-kreis', 'Kreise', [
          topic('sks-k8-kreis-umfang', 'Umfang eines Kreises'),
          topic('sks-k8-kreis-flaeche', 'Flächeninhalt eines Kreises'),
          ...(prefix === 'sks-rs'
            ? [topic('sks-k8-thales', 'Satz des Thales', ['Thales'])]
            : []),
        ]),
        area('rf-rechtwinklig', 'Rechtwinklige Dreiecke', [
          topic('sks-k8-pythagoras-hyp', 'Satz des Pythagoras: Hypotenuse'),
          topic('sks-k8-pythagoras-kat', 'Satz des Pythagoras: fehlende Kathete'),
          topic('sks-k8-leiter', 'Pythagoras im Sachkontext'),
        ]),
        area('zf-linear', 'Lineare Funktionen', [
          topic('sks-k8-funktionswert', 'Funktionswert einer linearen Funktion'),
          topic('sks-k8-steigung', 'Steigung aus zwei Punkten'),
          topic('sks-k8-achsen', 'y-Achsenabschnitt bestimmen'),
        ]),
        area('dz-zufall', 'Häufigkeiten und Wahrscheinlichkeiten', [
          topic('sks-k8-laplace', 'Laplace-Wahrscheinlichkeit als Bruch'),
          topic('sks-k8-laplace-pct', 'Laplace-Wahrscheinlichkeit in Prozent'),
          topic('sks-k8-gegen', 'Gegenwahrscheinlichkeit'),
        ]),
      ],
    ),
  ]
}

function gradeHs9(): PackGrade {
  return grade(
    'sks-hs-klasse-9',
    'Klasse 9 · Hauptschulabschluss',
    'Klasse 9 · Hauptschulabschluss',
    'Potenzen, Pyramide und zusammengesetzte Körper, lineare Gleichungssysteme, Wachstumsprozesse sowie Häufigkeitsverteilungen (HSA).',
    [
      'Potenzen', 'Pyramide', 'LGS', 'Wachstum', 'exponentiell', 'Mittelwert', 'Median',
    ],
    [
      area('zg-potenz', 'Arbeiten mit Variablen, Potenzen', [
        topic('sks-hs-k9-formeln', 'Formeln umstellen'),
        topic('sks-hs-k9-potenz-wert', 'Potenz- und Quadratwerte berechnen'),
        topic('sks-hs-k9-wurzel', 'Wurzeln und Betrag (Näherung)'),
      ]),
      area('rf-pyramide', 'Pyramide, zusammengesetzte Körper', [
        topic('sks-hs-k9-pyramide', 'Volumen einer Pyramide'),
        topic('sks-hs-k9-oberflaeche-pyramide', 'Oberfläche einer Pyramide'),
        topic('sks-hs-k9-volumen-zus', 'Zusammengesetzte Körper: Volumen'),
      ]),
      area('zf-lgs', 'Lineare Gleichungssysteme', [
        topic('sks-hs-k9-lgs', 'Lineares Gleichungssystem (x bestimmen)'),
        topic('sks-hs-k9-lgs-grafik', 'LGS grafisch deuten (Idee)'),
      ]),
      area('zf-wachstum', 'Potenzfunktionen, Wachstumsprozesse', [
        topic('sks-hs-k9-exp', 'Exponentielles Wachstum'),
        topic('sks-hs-k9-zunahme', 'Prozentuale Zunahme'),
        topic('sks-hs-k9-zinseszins', 'Zinseszins: Endkapital'),
      ]),
      area('dz-haeufigkeit', 'Häufigkeitsverteilungen', [
        topic('sks-hs-k9-mittelwert', 'Arithmetisches Mittel'),
        topic('sks-hs-k9-spannweite', 'Spannweite berechnen'),
      ]),
    ],
  )
}

function gradesRs910(): PackGrade[] {
  return [
    grade(
      'sks-rs-klasse-9',
      'Klasse 9 · Realschulabschluss',
      'Klasse 9 · Realschulabschluss',
      'Potenzen, Körper, Ähnlichkeit, Trigonometrie, LGS, Wachstum und Zufallsversuche (RSA 9/10).',
      [
        'Potenzen', 'Pyramide', 'Kugel', 'Ähnlichkeit', 'Trigonometrie', 'LGS', 'Wachstum',
        'Laplace',
      ],
      [
        area('zg-potenz', 'Arbeiten mit Variablen, Potenzen', [
          topic('sks-rs-k9-potenz-prod', 'Potenzgesetz: Produkt gleicher Basis'),
          topic('sks-rs-k9-potenz-quot', 'Potenzgesetz: Quotient und Potenz einer Potenz'),
          topic('sks-rs-k9-formeln', 'Formeln umstellen'),
          topic('sks-rs-k9-potenz-wert', 'Potenz- und Quadratwerte berechnen'),
          topic('sks-rs-k9-wurzel', 'Wurzeln und Betrag (Näherung)'),
        ]),
        area('rf-koerper', 'Pyramide, Kegel, Kugel, zusammengesetzte Körper', [
          topic('sks-rs-k9-pyramide', 'Volumen einer Pyramide'),
          topic('sks-rs-k9-oberflaeche-pyramide', 'Oberfläche einer Pyramide'),
          topic('sks-rs-k9-kugel', 'Volumen einer Kugel'),
          topic('sks-rs-k9-volumen-zus', 'Zusammengesetzte Körper: Volumen'),
          topic('sks-rs-k9-kegel', 'Kegel (Volumen / Oberfläche)', ['Kegel']),
        ]),
        area('rf-aehnlich', 'Ähnlichkeit', [
          topic('sks-rs-k9-streckfaktor', 'Streckfaktor bestimmen'),
          topic('sks-rs-k9-strahlensatz', 'Strahlensatz: fehlende Länge'),
          topic('sks-rs-k9-aehnlich', 'Ähnliche Figuren: Seitenlänge'),
        ]),
        area('rf-trig', 'Trigonometrie', [
          topic('sks-rs-k9-trig', 'Werte von Sinus, Kosinus, Tangens'),
          topic('sks-rs-k9-trig-hoehe', 'Höhe mit Sinus berechnen'),
          topic('sks-rs-k9-trig-seite', 'Seite mit Trigonometrie'),
        ]),
        area('zf-lgs', 'Lineare Gleichungssysteme', [
          topic('sks-rs-k9-lgs', 'Lineares Gleichungssystem (x bestimmen)'),
          topic('sks-rs-k9-lgs-grafik', 'LGS grafisch deuten (Idee)'),
        ]),
        area('zf-wachstum', 'Potenzfunktionen, Wachstumsprozesse', [
          topic('sks-rs-k9-exp', 'Exponentielles Wachstum'),
          topic('sks-rs-k9-zunahme', 'Prozentuale Zunahme'),
        ]),
        area('dz-zufall', 'Häufigkeitsverteilungen und zweistufige Zufallsversuche', [
          topic('sks-rs-k9-mittelwert', 'Arithmetisches Mittel'),
          topic('sks-rs-k9-median', 'Median (Zentralwert)'),
          topic('sks-rs-k9-pfad', 'Zweistufige Zufallsversuche / Pfadregeln', [
            'Baumdiagramm',
            'Pfadregel',
          ]),
        ]),
      ],
    ),
    grade(
      'sks-rs-klasse-10',
      'Klasse 10 · Realschulabschluss',
      'Klasse 10 · Realschulabschluss',
      'Quadratische Gleichungen und Funktionen, Sinusfunktion sowie vertiefte Stochastik (RSA 9/10).',
      [
        'quadratische Funktion', 'Parabel', 'Scheitelpunkt', 'Sinus', 'Zinsen', 'Erwartungswert',
      ],
      [
        area('zf-quadrat', 'Quadratische Gleichungen, quadratische Funktionen und Sinusfunktion', [
          topic('sks-rs-k10-quadrat-wert', 'Wert einer quadratischen Funktion'),
          topic('sks-rs-k10-scheitel', 'Scheitelpunkt aus der Scheitelform'),
          topic('sks-rs-k10-reinquadratisch', 'Reinquadratische Gleichung x² = a'),
          topic('sks-rs-k10-gleichung', 'Quadratische Gleichung (größere Lösung)'),
          topic('sks-rs-k10-parabel', 'Funktionswert einer Parabel'),
          topic('sks-rs-k10-sinus', 'Sinusfunktion (periodische Vorgänge)', [
            'Sinus',
            'Periodizität',
          ]),
        ]),
        area('zf-wachstum', 'Wachstum und Zinsrechnung', [
          topic('sks-rs-k10-kapital', 'Kapital aus Zinsen bestimmen'),
          topic('sks-rs-k10-zinssatz', 'Zinssatz bestimmen'),
        ]),
        area('dz-zufall', 'Häufigkeitsverteilungen', [
          topic('sks-rs-k10-spannweite', 'Spannweite berechnen'),
        ]),
      ],
    ),
  ]
}

function wrap(
  id: string,
  title: string,
  changelog: string,
  official: PackGrade[],
): CurriculumPack {
  return {
    id,
    title,
    region: 'Sachsen-Anhalt',
    school: 'Sekundarschule',
    subject: 'Mathematik',
    version: '1.2.0',
    changelog,
    contentHash: packContentHash(official, []),
    official,
    extras: [],
  }
}

export function allOfficialSksTopics(): PackTopic[] {
  const hs = [
    ...grades56('sks-hs', 'Hauptschulabschluss'),
    ...grades78('sks-hs', 'Hauptschulabschluss'),
    gradeHs9(),
  ]
  const rs = [
    ...grades56('sks-rs', 'Realschulabschluss'),
    ...grades78('sks-rs', 'Realschulabschluss'),
    ...gradesRs910(),
  ]
  const seen = new Set<string>()
  const out: PackTopic[] = []
  for (const g of [...hs, ...rs]) {
    for (const a of g.areas) {
      for (const t of a.topics) {
        if (seen.has(t.id)) continue
        seen.add(t.id)
        out.push(t)
      }
    }
  }
  return out
}

export function buildSekundarschuleSachsenAnhaltHsPack(): CurriculumPack {
  const official = [
    ...grades56('sks-hs', 'Hauptschulabschluss'),
    ...grades78('sks-hs', 'Hauptschulabschluss'),
    gradeHs9(),
  ]
  return wrap(
    SKS_SACHSEN_ANHALT_HS_PACK_ID,
    'Sekundarschule Sachsen-Anhalt · Mathematik · Hauptschulabschluss',
    '1.2.0: Dublettenfreies 1:n-Mapping auf den Gym-Sachsen-Master-Pool nach Fachlehrplan 2019; nicht lehrplankonforme Themen entfernt (Median/Modalwert, Potenzgesetze, Kegel, Zinsdubletten u. a.); neu: Sachaufgaben, Kapital, Zinssatz, Häufigkeit, Formeln umstellen.',
    official,
  )
}

export function buildSekundarschuleSachsenAnhaltRsPack(): CurriculumPack {
  const official = [
    ...grades56('sks-rs', 'Realschulabschluss'),
    ...grades78('sks-rs', 'Realschulabschluss'),
    ...gradesRs910(),
  ]
  return wrap(
    SKS_SACHSEN_ANHALT_RS_PACK_ID,
    'Sekundarschule Sachsen-Anhalt · Mathematik · Realschulabschluss',
    '1.2.0: Dublettenfreies 1:n-Mapping auf den Gym-Sachsen-Master-Pool nach Fachlehrplan 2019; nicht lehrplankonforme Themen entfernt (Modalwert, Erwartungswert, Zins- und Laplace-Dubletten u. a.); neu: Sachaufgaben, Häufigkeit, Formeln umstellen, Pyramidenoberfläche.',
    official,
  )
}
