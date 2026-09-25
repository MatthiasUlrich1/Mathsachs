import {
  SKS_SACHSEN_ANHALT_HS_PACK_ID,
  SKS_SACHSEN_ANHALT_RS_PACK_ID,
  packContentHash,
  type CurriculumPack,
  type PackArea,
  type PackGrade,
  type PackTopic,
} from './pack'
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

/** SKS topic id → Gym Sachsen generator topic id. */
export const SKS_GENERATOR_MAP: Record<string, string> = {
  // ——— 5/6 gemeinsam ———
  'sks-k5-nat-runden': 'lb1-runden-natuerlich',
  'sks-k5-nat-add': 'lb1-addition',
  'sks-k5-nat-sub': 'lb1-subtraktion',
  'sks-k5-nat-mul': 'lb1-multiplikation',
  'sks-k5-nat-schriftlich': 'lb1-schriftliches-rechnen',
  'sks-k5-nat-div-rest': 'lb1-division-rest',
  'sks-k5-nat-div': 'lb1-schriftliche-division',
  'sks-k5-nat-potenz': 'lb1-potenzieren',
  'sks-k5-nat-teilbarkeit': 'lb1-teilbarkeit',
  'sks-k5-nat-prim': 'lb1-primzahl',
  'sks-k5-gleichung-add': 'k7-lb2-gleichung-add',
  'sks-k5-gleichung-mul': 'k7-lb2-gleichung-mul',
  'sks-k5-bruch-anteil': 'lb2-anteil-bruch',
  'sks-k5-bruch-kuerzen': 'lb2-kuerzen',
  'sks-k5-bruch-erweitern': 'lb2-erweitern',
  'sks-k5-bruch-grafik': 'lb2-grafische-brueche',
  'sks-k5-dez-add': 'lb2-dez-add-sub',
  'sks-k5-dez-mul': 'lb2-dez-mult',
  'sks-k5-dez-div': 'lb2-dez-div',
  'sks-k5-dez-runden': 'lb2-runden-dezimal',
  'sks-k5-dez-zahlenstrahl': 'lb2-zahlenstrahl',
  'sks-k5-groessen-ordnen': 'lb2-ordnen-einheiten',
  'sks-k5-umr-laenge': 'k5-umrechnen-laenge',
  'sks-k5-umr-masse': 'k5-umrechnen-masse',
  'sks-k5-umr-zeit': 'k5-umrechnen-zeit',
  'sks-k5-umr-flaeche': 'k5-umrechnen-flaeche',
  'sks-k5-umr-volumen': 'k5-umrechnen-volumen',
  'sks-k5-geo-strecken': 'lb3-strecken-bezeichnung',
  'sks-k5-geo-laenge': 'lb3-strecken-laenge',
  'sks-k5-geo-mittelpunkt': 'lb3-strecken-mittelpunkt',
  'sks-k5-geo-koord-ablesen': 'lb3-koordinaten-ablesen',
  'sks-k5-geo-koord-eintragen': 'lb3-koordinaten-eintragen',
  'sks-k5-geo-abstand': 'lb3-koordinaten-abstand',
  'sks-k5-geo-winkelarten': 'lb3-winkelarten',
  'sks-k5-geo-winkel-erg': 'lb3-winkel-ergaenzung',
  'sks-k5-geo-verschiebung': 'lb3-verschiebung',
  'sks-k5-geo-achse': 'lb3-achsensymmetrie',
  'sks-k5-geo-punkt': 'lb3-punktsymmetrie',
  'sks-k5-umfang-rechteck': 'lb4-umfang-rechteck',
  'sks-k5-flaeche-rechteck': 'lb4-flaeche-rechteck',
  'sks-k5-volumen-quader': 'lb4-volumen-quader',
  'sks-k5-oberflaeche-quader': 'lb4-oberflaeche-quader',
  'sks-k5-mittelwert': 'lb2-mittelwert',

  'sks-k6-bruch-kuerzen': 'lb1-kuerzen',
  'sks-k6-bruch-erweitern': 'lb1-erweitern',
  'sks-k6-bruch-vergleichen': 'lb1-vergleichen',
  'sks-k6-bruch-add': 'lb1-add-sub-brueche',
  'sks-k6-bruch-mul': 'lb1-mult-brueche',
  'sks-k6-bruch-div': 'lb1-div-brueche',
  'sks-k6-bruch-dez': 'lb1-bruch-dezimal',
  'sks-k6-prozent': 'lb1-prozent',
  'sks-k6-dez-add': 'lb1-dez-add-sub',
  'sks-k6-dez-mul': 'lb1-dez-mult',
  'sks-k6-dez-div': 'lb1-dez-div',
  'sks-k6-dez-runden': 'lb1-runden',
  'sks-k6-nebenwinkel': 'k7-lb1-nebenwinkel',
  'sks-k6-scheitelwinkel': 'k7-lb1-scheitelwinkel',
  'sks-k6-winkel-dreieck': 'lb3-winkel-dreieck',
  'sks-k6-flaeche-dreieck': 'lb3-flaeche-dreieck',
  'sks-k6-kongruenz': 'lb3-kongruenzsatz',
  'sks-k6-proportional': 'lb2-proportional',
  'sks-k6-antiproportional': 'lb2-antiproportional',
  'sks-k6-dreisatz': 'lb2-sachaufgabe-dreisatz',
  'sks-k6-haeufigkeit': 'lb2-haeufigkeit',
  'sks-k6-anteil-prozent': 'lb5-anteil-prozent',

  // ——— 7/8 (HS + RS gemeinsam) ———
  'sks-k7-rat-add': 'k7-lb2-add-rational',
  'sks-k7-rat-sub': 'k7-lb2-sub-rational',
  'sks-k7-rat-mul': 'k7-lb2-mul-rational',
  'sks-k7-rat-div': 'k7-lb2-div-rational',
  'sks-k7-betrag': 'k7-lb2-betrag',
  'sks-k7-prozent': 'lb5-anteil-prozent',
  'sks-k7-zinsen': 'k10-lb1-zinsen',
  'sks-k7-zinseszins': 'k10-lb1-zinseszins',
  'sks-k7-gleichung': 'k8-lb1-gleichung-linear',
  'sks-k7-gleichung-beid': 'k8-lb1-gleichung-beidseitig',
  'sks-k7-term': 'k7-lb2-term-vorrang',
  'sks-k7-term-auswerten': 'k8-lb1-term-auswerten',
  'sks-k7-zusammenfassen': 'k8-lb1-zusammenfassen',
  'sks-k7-ausmult': 'k8-lb1-ausmultiplizieren',
  'sks-k7-winkel-viereck': 'lb3-winkel-viereck',
  'sks-k7-winkelsumme': 'k7-lb1-winkelsumme-vieleck',
  'sks-k7-volumen-prisma': 'k7-lb3-volumen-prisma',
  'sks-k7-mantel-prisma': 'k7-lb3-mantel-prisma',
  'sks-k7-oberflaeche-quader': 'k7-lb3-oberflaeche-quader',
  'sks-k7-zylinder': 'k9-lb2-zylinder-volumen',
  'sks-k7-netz': 'lb4-wuerfelnetz',
  'sks-k7-mittelwert': 'k7-lb4-mittelwert',
  'sks-k7-median': 'k7-lb4-median',
  'sks-k7-spannweite': 'k7-lb4-spannweite',

  'sks-k8-kreis-umfang': 'k9-lb2-kreis-umfang',
  'sks-k8-kreis-flaeche': 'k9-lb2-kreis-flaeche',
  'sks-k8-zylinder': 'k9-lb2-zylinder-volumen',
  'sks-k8-pythagoras-hyp': 'k9-lb3-pythagoras-hypotenuse',
  'sks-k8-pythagoras-kat': 'k9-lb3-pythagoras-kathete',
  'sks-k8-leiter': 'k9-lb5-leiter',
  'sks-k8-funktionswert': 'k8-lb3-funktionswert',
  'sks-k8-steigung': 'k8-lb3-steigung',
  'sks-k8-achsen': 'k8-lb3-achsenabschnitt',
  'sks-k8-laplace': 'k8-lb2-laplace-bruch',
  'sks-k8-laplace-pct': 'k8-lb2-laplace-prozent',
  'sks-k8-gegen': 'k8-lb2-gegenwahrscheinlichkeit',

  // ——— HS Klasse 9 ———
  'sks-hs-k9-potenz-prod': 'k9-lb1-potenz-produkt',
  'sks-hs-k9-potenz-quot': 'k9-lb1-potenz-quotient',
  'sks-hs-k9-pyramide': 'k7-lb3-volumen-pyramide',
  'sks-hs-k9-oberflaeche-pyramide': 'k7-lb3-oberflaeche-pyramide',
  'sks-hs-k9-volumen-zus': 'lb4-volumen-zusammengesetzt',
  'sks-hs-k9-lgs': 'k8-lb3-lgs',
  'sks-hs-k9-exp': 'k10-lb1-exp-wachstum',
  'sks-hs-k9-zunahme': 'k10-lb1-prozentuale-zunahme',
  'sks-hs-k9-mittelwert': 'k9-lb4-mittelwert',
  'sks-hs-k9-median': 'k9-lb4-median',
  'sks-hs-k9-modal': 'k9-lb4-modalwert',
  'sks-hs-k9-spannweite': 'k7-lb4-spannweite',

  // ——— RS Klasse 9 ———
  'sks-rs-k9-potenz-prod': 'k9-lb1-potenz-produkt',
  'sks-rs-k9-potenz-quot': 'k9-lb1-potenz-quotient',
  'sks-rs-k9-pyramide': 'k7-lb3-volumen-pyramide',
  'sks-rs-k9-kugel': 'k9-lb2-kugel-volumen',
  'sks-rs-k9-volumen-zus': 'lb4-volumen-zusammengesetzt',
  'sks-rs-k9-streckfaktor': 'k8-lb4-streckfaktor',
  'sks-rs-k9-strahlensatz': 'k8-lb4-strahlensatz',
  'sks-rs-k9-aehnlich': 'k8-lb4-aehnliche-seite',
  'sks-rs-k9-trig': 'k9-lb3-trig-wert',
  'sks-rs-k9-lgs': 'k8-lb3-lgs',
  'sks-rs-k9-exp': 'k10-lb1-exp-wachstum',
  'sks-rs-k9-zunahme': 'k10-lb1-prozentuale-zunahme',
  'sks-rs-k9-mittelwert': 'k9-lb4-mittelwert',
  'sks-rs-k9-median': 'k9-lb4-median',
  'sks-rs-k9-modal': 'k9-lb4-modalwert',
  'sks-rs-k9-laplace': 'k8-lb2-laplace-bruch',

  // ——— RS Klasse 10 ———
  'sks-rs-k10-quadrat-wert': 'k9-lb1-quadrat-wert',
  'sks-rs-k10-scheitel': 'k9-lb1-scheitel',
  'sks-rs-k10-reinquadratisch': 'k10-lb4-reinquadratisch',
  'sks-rs-k10-gleichung': 'k10-lb4-quadratische-gleichung',
  'sks-rs-k10-parabel': 'k10-lb4-parabel-wert',
  'sks-rs-k10-zinsen': 'k10-lb1-zinsen',
  'sks-rs-k10-zinseszins': 'k10-lb1-zinseszins',
  'sks-rs-k10-erwartung': 'k10-lb2-erwartungswert',
  'sks-rs-k10-erwartung-wuerfel': 'k10-lb2-erwartungswert-wuerfel',
  'sks-rs-k10-spannweite': 'k7-lb4-spannweite',
}

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
        ]),
        area('zg-gleichung', 'Gleichungen', [
          topic('sks-k5-gleichung-add', 'Gleichung umstellen: x + a = b'),
          topic('sks-k5-gleichung-mul', 'Gleichung umstellen: a · x = b'),
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
          topic('sks-k5-geo-punkt', 'Punktsymmetrie / Punktspiegelung'),
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
          topic('sks-k6-anteil-prozent', 'Prozent einer Größe berechnen'),
        ]),
        area('dz-daten', 'Erfassen, Darstellen und Auswerten von Daten', [
          topic('sks-k6-haeufigkeit', 'Relative Häufigkeit in Prozent'),
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
          topic('sks-k7-zinseszins', 'Zinseszins: Endkapital'),
        ]),
        area('zg-gleichung', 'Lineare Gleichungen', [
          topic('sks-k7-gleichung', 'Lineare Gleichung a·x + b = c'),
          topic('sks-k7-gleichung-beid', 'Gleichung mit x auf beiden Seiten'),
        ]),
        area('zg-variablen', 'Arbeiten mit Variablen, Gleichungen und Formeln', [
          topic('sks-k7-term', 'Term mit Rechengesetzen auswerten'),
          topic('sks-k7-term-auswerten', 'Term auswerten (x einsetzen)'),
          topic('sks-k7-zusammenfassen', 'Terme zusammenfassen'),
          topic('sks-k7-ausmult', 'Klammer ausmultiplizieren'),
        ]),
        area('rf-viereck', 'Vierecke', [
          topic('sks-k7-winkel-viereck', 'Winkelsumme im Viereck'),
          topic('sks-k7-winkelsumme', 'Innenwinkelsumme im Vieleck'),
        ]),
        area('rf-koerper', 'Körperdarstellung und Körperberechnung (Prismen und Kreiszylinder)', [
          topic('sks-k7-volumen-prisma', 'Volumen gerader Prismen'),
          topic('sks-k7-mantel-prisma', 'Mantelfläche eines Prismas'),
          topic('sks-k7-oberflaeche-quader', 'Oberfläche eines Quaders'),
          topic('sks-k7-zylinder', 'Volumen eines Kreiszylinders', ['Zylinder']),
          topic('sks-k7-netz', 'Körpernetze und Schrägbilder', ['Netz', 'Schrägbild']),
        ]),
        area('dz-daten', 'Erfassen, Darstellen und Auswerten von Daten', [
          topic('sks-k7-mittelwert', 'Arithmetisches Mittel'),
          topic('sks-k7-median', 'Median (Zentralwert)'),
          topic('sks-k7-spannweite', 'Spannweite berechnen'),
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
          topic('sks-k8-zylinder', 'Volumen eines Kreiszylinders'),
          topic('sks-k8-thales', 'Satz des Thales', ['Thales']),
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
        topic('sks-hs-k9-potenz-prod', 'Potenzgesetz: Produkt gleicher Basis'),
        topic('sks-hs-k9-potenz-quot', 'Potenzgesetz: Quotient und Potenz einer Potenz'),
      ]),
      area('rf-pyramide', 'Pyramide, zusammengesetzte Körper', [
        topic('sks-hs-k9-pyramide', 'Volumen einer Pyramide'),
        topic('sks-hs-k9-oberflaeche-pyramide', 'Oberfläche einer Pyramide'),
        topic('sks-hs-k9-volumen-zus', 'Zusammengesetzte Körper: Volumen'),
        topic('sks-hs-k9-kegel', 'Kegel (Volumen / Oberfläche)', ['Kegel']),
      ]),
      area('zf-lgs', 'Lineare Gleichungssysteme', [
        topic('sks-hs-k9-lgs', 'Lineares Gleichungssystem (x bestimmen)'),
      ]),
      area('zf-wachstum', 'Potenzfunktionen, Wachstumsprozesse', [
        topic('sks-hs-k9-exp', 'Exponentielles Wachstum'),
        topic('sks-hs-k9-zunahme', 'Prozentuale Zunahme'),
      ]),
      area('dz-haeufigkeit', 'Häufigkeitsverteilungen', [
        topic('sks-hs-k9-mittelwert', 'Arithmetisches Mittel'),
        topic('sks-hs-k9-median', 'Median (Zentralwert)'),
        topic('sks-hs-k9-modal', 'Modalwert (häufigster Wert)'),
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
        ]),
        area('rf-koerper', 'Pyramide, Kegel, Kugel, zusammengesetzte Körper', [
          topic('sks-rs-k9-pyramide', 'Volumen einer Pyramide'),
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
        ]),
        area('zf-lgs', 'Lineare Gleichungssysteme', [
          topic('sks-rs-k9-lgs', 'Lineares Gleichungssystem (x bestimmen)'),
        ]),
        area('zf-wachstum', 'Potenzfunktionen, Wachstumsprozesse', [
          topic('sks-rs-k9-exp', 'Exponentielles Wachstum'),
          topic('sks-rs-k9-zunahme', 'Prozentuale Zunahme'),
        ]),
        area('dz-zufall', 'Häufigkeitsverteilungen und zweistufige Zufallsversuche', [
          topic('sks-rs-k9-mittelwert', 'Arithmetisches Mittel'),
          topic('sks-rs-k9-median', 'Median (Zentralwert)'),
          topic('sks-rs-k9-modal', 'Modalwert (häufigster Wert)'),
          topic('sks-rs-k9-laplace', 'Laplace-Wahrscheinlichkeit als Bruch'),
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
          topic('sks-rs-k10-zinsen', 'Jahreszinsen berechnen'),
          topic('sks-rs-k10-zinseszins', 'Zinseszins: Endkapital'),
        ]),
        area('dz-zufall', 'Zufallsgrößen und Kenngrößen', [
          topic('sks-rs-k10-erwartung', 'Erwartungswert eines Glücksrads'),
          topic('sks-rs-k10-erwartung-wuerfel', 'Erwartungswert beim Würfel'),
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
    version: '1.0.1',
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
    'Klassen 5–9 (HSA) nach ST-Fachlehrplan. tasksPerRound Standard 10. Ohne Netz lokale Fassung.',
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
    'Klassen 5–10 (RSA) nach ST-Fachlehrplan. tasksPerRound Standard 10. Ohne Netz lokale Fassung.',
    official,
  )
}
