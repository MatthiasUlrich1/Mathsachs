import {
  GYM_SACHSEN_ANHALT_PACK_ID,
  packContentHash,
  type CurriculumPack,
  type PackArea,
  type PackGrade,
  type PackTopic,
} from './pack'

/**
 * Gymnasium Sachsen-Anhalt · Mathematik (Fachlehrplan 01.08.2022).
 * Outline follows Kompetenzschwerpunkte; playable topics alias Gym-Sachsen generators.
 * Source: https://lisa.sachsen-anhalt.de/…/FLP_Mathe_Gym_010822_swd.pdf (CC BY-SA 3.0)
 */

const SOURCE =
  'Fachlehrplan Gymnasium Mathematik Sachsen-Anhalt, Anpassung 01.08.2022 (LISA), CC BY-SA 3.0.'

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

/** ST topic id → Gym Sachsen generator topic id. */
export const ST_GENERATOR_MAP: Record<string, string> = {
  // ——— Klasse 5 (ST 5/6: Zahlen, Größen, Grundgeometrie) ———
  'st-k5-nat-runden': 'lb1-runden-natuerlich',
  'st-k5-nat-add': 'lb1-addition',
  'st-k5-nat-sub': 'lb1-subtraktion',
  'st-k5-nat-mul': 'lb1-multiplikation',
  'st-k5-nat-schriftlich': 'lb1-schriftliches-rechnen',
  'st-k5-nat-div-rest': 'lb1-division-rest',
  'st-k5-nat-div': 'lb1-schriftliche-division',
  'st-k5-nat-potenz': 'lb1-potenzieren',
  'st-k5-nat-teilbarkeit': 'lb1-teilbarkeit',
  'st-k5-nat-prim': 'lb1-primzahl',
  'st-k5-bruch-anteil': 'lb2-anteil-bruch',
  'st-k5-bruch-kuerzen': 'lb2-kuerzen',
  'st-k5-bruch-erweitern': 'lb2-erweitern',
  'st-k5-bruch-grafik': 'lb2-grafische-brueche',
  'st-k5-dez-add': 'lb2-dez-add-sub',
  'st-k5-dez-mul': 'lb2-dez-mult',
  'st-k5-dez-div': 'lb2-dez-div',
  'st-k5-dez-runden': 'lb2-runden-dezimal',
  'st-k5-dez-zahlenstrahl': 'lb2-zahlenstrahl',
  'st-k5-groessen-ordnen': 'lb2-ordnen-einheiten',
  'st-k5-umr-laenge': 'k5-umrechnen-laenge',
  'st-k5-umr-masse': 'k5-umrechnen-masse',
  'st-k5-umr-zeit': 'k5-umrechnen-zeit',
  'st-k5-umr-flaeche': 'k5-umrechnen-flaeche',
  'st-k5-umr-volumen': 'k5-umrechnen-volumen',
  'st-k5-geo-strecken': 'lb3-strecken-bezeichnung',
  'st-k5-geo-laenge': 'lb3-strecken-laenge',
  'st-k5-geo-mittelpunkt': 'lb3-strecken-mittelpunkt',
  'st-k5-geo-koord-ablesen': 'lb3-koordinaten-ablesen',
  'st-k5-geo-koord-eintragen': 'lb3-koordinaten-eintragen',
  'st-k5-geo-abstand': 'lb3-koordinaten-abstand',
  'st-k5-geo-winkelarten': 'lb3-winkelarten',
  'st-k5-geo-winkel-erg': 'lb3-winkel-ergaenzung',
  'st-k5-geo-verschiebung': 'lb3-verschiebung',
  'st-k5-geo-achse': 'lb3-achsensymmetrie',
  'st-k5-geo-punkt': 'lb3-punktsymmetrie',
  'st-k5-umfang-rechteck': 'lb4-umfang-rechteck',
  'st-k5-flaeche-rechteck': 'lb4-flaeche-rechteck',
  'st-k5-volumen-quader': 'lb4-volumen-quader',
  'st-k5-oberflaeche-quader': 'lb4-oberflaeche-quader',
  'st-k5-flaeche-zus': 'lb4-flaeche-zusammengesetzt',
  'st-k5-volumen-zus': 'lb4-volumen-zusammengesetzt',
  'st-k5-mittelwert': 'lb2-mittelwert',
  'st-k5-sach-preis': 'lb5-gesamtpreis',
  'st-k5-sach-teilen': 'lb5-teilen',
  'st-k5-sach-mehr': 'lb5-mehrstufig',

  // ——— Klasse 6 (ST 5/6: gebrochene Zahlen, Zuordnungen, Dreiecke/Vierecke, Daten) ———
  'st-k6-bruch-kuerzen': 'lb1-kuerzen',
  'st-k6-bruch-erweitern': 'lb1-erweitern',
  'st-k6-bruch-vergleichen': 'lb1-vergleichen',
  'st-k6-bruch-add': 'lb1-add-sub-brueche',
  'st-k6-bruch-mul': 'lb1-mult-brueche',
  'st-k6-bruch-div': 'lb1-div-brueche',
  'st-k6-bruch-dez': 'lb1-bruch-dezimal',
  'st-k6-prozent': 'lb1-prozent',
  'st-k6-dez-add': 'lb1-dez-add-sub',
  'st-k6-dez-mul': 'lb1-dez-mult',
  'st-k6-dez-div': 'lb1-dez-div',
  'st-k6-dez-runden': 'lb1-runden',
  'st-k6-gleichung-add': 'k7-lb2-gleichung-add',
  'st-k6-gleichung-mul': 'k7-lb2-gleichung-mul',
  'st-k6-proportional': 'lb2-proportional',
  'st-k6-antiproportional': 'lb2-antiproportional',
  'st-k6-dreisatz': 'lb2-sachaufgabe-dreisatz',
  'st-k6-haeufigkeit': 'lb2-haeufigkeit',
  'st-k6-winkel-dreieck': 'lb3-winkel-dreieck',
  'st-k6-winkel-viereck': 'lb3-winkel-viereck',
  'st-k6-flaeche-dreieck': 'lb3-flaeche-dreieck',
  'st-k6-kongruenz': 'lb3-kongruenzsatz',
  'st-k6-volumen-prisma': 'lb4-volumen-prisma',
  'st-k6-wuerfelnetz': 'lb4-wuerfelnetz',
  'st-k6-anteil': 'lb5-anteil-groesse',
  'st-k6-anteil-prozent': 'lb5-anteil-prozent',
  'st-k6-nebenwinkel': 'k7-lb1-nebenwinkel',
  'st-k6-scheitelwinkel': 'k7-lb1-scheitelwinkel',

  // ——— Klasse 7 (ST 7/8 früh: Prozent, rationale Zahlen, Terme, Körper) ———
  'st-k7-prozent': 'lb5-anteil-prozent',
  'st-k7-zinsen': 'k10-lb1-zinsen',
  'st-k7-zinseszins': 'k10-lb1-zinseszins',
  'st-k7-preisaenderung': 'k10-lb1-prozentuale-zunahme',
  'st-k7-rat-add': 'k7-lb2-add-rational',
  'st-k7-rat-sub': 'k7-lb2-sub-rational',
  'st-k7-rat-mul': 'k7-lb2-mul-rational',
  'st-k7-rat-div': 'k7-lb2-div-rational',
  'st-k7-betrag': 'k7-lb2-betrag',
  'st-k7-term': 'k7-lb2-term-vorrang',
  'st-k7-gleichung': 'k8-lb1-gleichung-linear',
  'st-k7-gleichung-beid': 'k8-lb1-gleichung-beidseitig',
  'st-k7-term-auswerten': 'k8-lb1-term-auswerten',
  'st-k7-zusammenfassen': 'k8-lb1-zusammenfassen',
  'st-k7-ausmult': 'k8-lb1-ausmultiplizieren',
  'st-k7-volumen-prisma': 'k7-lb3-volumen-prisma',
  'st-k7-mantel-prisma': 'k7-lb3-mantel-prisma',
  'st-k7-volumen-pyramide': 'k7-lb3-volumen-pyramide',
  'st-k7-oberflaeche-quader': 'k7-lb3-oberflaeche-quader',
  'st-k7-oberflaeche-pyramide': 'k7-lb3-oberflaeche-pyramide',
  'st-k7-winkelsumme': 'k7-lb1-winkelsumme-vieleck',
  'st-k7-basiswinkel': 'k7-lb1-basiswinkel',
  'st-k7-mittelsenkrechte': 'k7-lb1-mittelsenkrechte-schritte',
  'st-k7-mittelwert': 'k7-lb4-mittelwert',
  'st-k7-median': 'k7-lb4-median',
  'st-k7-spannweite': 'k7-lb4-spannweite',

  // ——— Klasse 8 (ST 7/8 spät: Kreise, Pythagoras, Ähnlichkeit, lineare Fkt., Stochastik) ———
  'st-k8-kreis-umfang': 'k9-lb2-kreis-umfang',
  'st-k8-kreis-flaeche': 'k9-lb2-kreis-flaeche',
  'st-k8-zylinder': 'k9-lb2-zylinder-volumen',
  'st-k8-kugel': 'k9-lb2-kugel-volumen',
  'st-k8-pythagoras-hyp': 'k9-lb3-pythagoras-hypotenuse',
  'st-k8-pythagoras-kat': 'k9-lb3-pythagoras-kathete',
  'st-k8-streckfaktor': 'k8-lb4-streckfaktor',
  'st-k8-strahlensatz': 'k8-lb4-strahlensatz',
  'st-k8-aehnlich': 'k8-lb4-aehnliche-seite',
  'st-k8-funktionswert': 'k8-lb3-funktionswert',
  'st-k8-steigung': 'k8-lb3-steigung',
  'st-k8-achsen': 'k8-lb3-achsenabschnitt',
  'st-k8-lgs': 'k8-lb3-lgs',
  'st-k8-laplace': 'k8-lb2-laplace-bruch',
  'st-k8-laplace-pct': 'k8-lb2-laplace-prozent',
  'st-k8-gegen': 'k8-lb2-gegenwahrscheinlichkeit',
  'st-k8-leiter': 'k9-lb5-leiter',
  'st-k8-zahlenraetsel': 'k8-lb5-zahlenraetsel',

  // ——— Klasse 9 ———
  'st-k9-potenz-prod': 'k9-lb1-potenz-produkt',
  'st-k9-potenz-quot': 'k9-lb1-potenz-quotient',
  'st-k9-quadrat-wert': 'k9-lb1-quadrat-wert',
  'st-k9-scheitel': 'k9-lb1-scheitel',
  'st-k9-trig': 'k9-lb3-trig-wert',
  'st-k9-gleichung': 'k10-lb4-quadratische-gleichung',
  'st-k9-reinquadratisch': 'k10-lb4-reinquadratisch',
  'st-k9-parabel': 'k10-lb4-parabel-wert',
  'st-k9-mittelwert': 'k9-lb4-mittelwert',
  'st-k9-median': 'k9-lb4-median',
  'st-k9-modal': 'k9-lb4-modalwert',
  'st-k9-spannweite': 'k7-lb4-spannweite',

  // ——— Klasse 10 (Einführungsphase) ———
  'st-k10-zinsen': 'k10-lb1-zinsen',
  'st-k10-zinseszins': 'k10-lb1-zinseszins',
  'st-k10-zunahme': 'k10-lb1-prozentuale-zunahme',
  'st-k10-exp': 'k10-lb1-exp-wachstum',
  'st-k10-erwartung': 'k10-lb2-erwartungswert',
  'st-k10-erwartung-wuerfel': 'k10-lb2-erwartungswert-wuerfel',
  'st-k10-vektor-skalar': 'k1112-lb2-skalarprodukt',
  'st-k10-vektor-betrag': 'k1112-lb2-betrag-vektor',
  'st-k10-kapital': 'k10-lb5-kapital',
  'st-k10-zinssatz': 'k10-lb5-zinssatz',
  'st-k10-rechteck': 'k10-lb3-rechteck-breite',
  'st-k10-quadrat-seite': 'k10-lb3-quadrat-seite',

  // ——— 11/12 gA ———
  'st-k1112-ableitung': 'k1112-lb1-ableitung-stelle',
  'st-k1112-nullstelle': 'k1112-lb1-nullstelle-linear',
  'st-k1112-integral': 'k1112-lb1-bestimmtes-integral',
  'st-k1112-skalar': 'k1112-lb2-skalarprodukt',
  'st-k1112-betrag': 'k1112-lb2-betrag-vektor',
  'st-k1112-binomial': 'k1112-lb3-binomialverteilung',
  'st-k1112-erwartung-binom': 'k1112-lb3-erwartungswert-binom',
}

function officialGrades(): PackGrade[] {
  return [
    grade(
      'st-gym-klasse-5',
      'Klasse 5',
      'Klasse 5',
      'Natürliche Zahlen, Brüche und Dezimalzahlen, Größen, geometrische Grundbegriffe sowie Umfang, Flächeninhalt und Volumen (ST Schuljahrgänge 5/6).',
      [
        'natürliche Zahlen', 'runden', 'Addition', 'Brüche', 'Dezimalzahlen', 'Winkel',
        'Rechteck', 'Quader', 'Umfang', 'Fläche', 'Volumen', 'Koordinaten', 'Symmetrie',
      ],
      [
        area('zg-nat', 'Natürliche Zahlen', [
          topic('st-k5-nat-runden', 'Natürliche Zahlen runden', ['runden']),
          topic('st-k5-nat-add', 'Addieren natürlicher Zahlen', ['Addition']),
          topic('st-k5-nat-sub', 'Subtrahieren natürlicher Zahlen', ['Subtraktion']),
          topic('st-k5-nat-mul', 'Multiplizieren natürlicher Zahlen', ['Multiplikation']),
          topic('st-k5-nat-schriftlich', 'Schriftliche Rechenverfahren', ['schriftlich']),
          topic('st-k5-nat-div-rest', 'Division mit Rest', ['Division']),
          topic('st-k5-nat-div', 'Schriftliche Division', ['Division']),
          topic('st-k5-nat-potenz', 'Potenzen (Quadrat- und Zehnerpotenzen)', ['Potenz']),
          topic('st-k5-nat-teilbarkeit', 'Teilbarkeit prüfen', ['Teiler']),
          topic('st-k5-nat-prim', 'Primzahlen erkennen', ['Primzahl']),
        ]),
        area('zg-bruch', 'Brüche und Dezimalzahlen', [
          topic('st-k5-bruch-anteil', 'Anteil als Bruch', ['Bruch']),
          topic('st-k5-bruch-kuerzen', 'Brüche kürzen', ['kürzen']),
          topic('st-k5-bruch-erweitern', 'Brüche erweitern', ['erweitern']),
          topic('st-k5-bruch-grafik', 'Brüche grafisch ablesen', ['Bruch']),
          topic('st-k5-dez-add', 'Dezimalzahlen addieren und subtrahieren', ['Dezimalzahl']),
          topic('st-k5-dez-mul', 'Dezimalzahlen multiplizieren', ['Dezimalzahl']),
          topic('st-k5-dez-div', 'Dezimalzahlen dividieren', ['Dezimalzahl']),
          topic('st-k5-dez-runden', 'Dezimalzahlen runden', ['runden']),
          topic('st-k5-dez-zahlenstrahl', 'Dezimalzahlen auf dem Zahlenstrahl', ['Zahlenstrahl']),
        ]),
        area('zg-groessen', 'Größen', [
          topic('st-k5-groessen-ordnen', 'Größen mit verschiedenen Einheiten ordnen'),
          topic('st-k5-umr-laenge', 'Einheiten umrechnen: Länge', ['cm', 'm']),
          topic('st-k5-umr-masse', 'Einheiten umrechnen: Masse', ['g', 'kg']),
          topic('st-k5-umr-zeit', 'Einheiten umrechnen: Zeit', ['min', 'h']),
          topic('st-k5-umr-flaeche', 'Einheiten umrechnen: Flächeninhalt', ['cm²', 'm²']),
          topic('st-k5-umr-volumen', 'Einheiten umrechnen: Volumen', ['cm³', 'l']),
        ]),
        area('rf-grund', 'Geometrische Grundbegriffe und Abbildungen', [
          topic('st-k5-geo-strecken', 'Strecke, Gerade und Halbgerade'),
          topic('st-k5-geo-laenge', 'Länge von Strecken'),
          topic('st-k5-geo-mittelpunkt', 'Mittelpunkt einer Strecke'),
          topic('st-k5-geo-koord-ablesen', 'Koordinaten ablesen'),
          topic('st-k5-geo-koord-eintragen', 'Punkte im Koordinatensystem zuordnen'),
          topic('st-k5-geo-abstand', 'Abstand zwischen Punkten'),
          topic('st-k5-geo-winkelarten', 'Winkelarten erkennen', ['Winkel']),
          topic('st-k5-geo-winkel-erg', 'Winkel zu 90° oder 180° ergänzen'),
          topic('st-k5-geo-verschiebung', 'Verschiebung von Figuren'),
          topic('st-k5-geo-achse', 'Achsensymmetrie erkennen'),
          topic('st-k5-geo-punkt', 'Punktsymmetrie / Punktspiegelung'),
        ]),
        area('rf-umfang', 'Umfang, Flächeninhalt und Volumen', [
          topic('st-k5-umfang-rechteck', 'Umfang von Rechteck und Quadrat'),
          topic('st-k5-flaeche-rechteck', 'Flächeninhalt von Rechteck und Quadrat'),
          topic('st-k5-volumen-quader', 'Volumen von Quader und Würfel'),
          topic('st-k5-oberflaeche-quader', 'Oberflächeninhalt von Quadern'),
          topic('st-k5-flaeche-zus', 'Zusammengesetzte Flächen'),
          topic('st-k5-volumen-zus', 'Zusammengesetzte Quader: Volumen'),
        ]),
        area('dz-daten', 'Daten erfassen und auswerten', [
          topic('st-k5-mittelwert', 'Arithmetisches Mittel', ['Mittelwert']),
          topic('st-k5-sach-preis', 'Sachaufgabe: Gesamtpreis'),
          topic('st-k5-sach-teilen', 'Sachaufgabe: Gerecht aufteilen'),
          topic('st-k5-sach-mehr', 'Sachaufgabe: Mehrstufige Alltagsrechnung'),
        ]),
      ],
    ),
    grade(
      'st-gym-klasse-6',
      'Klasse 6',
      'Klasse 6',
      'Gebrochene Zahlen, Gleichungen, Winkelbeziehungen, Dreiecke und Vierecke, Zuordnungen sowie Daten (ST Schuljahrgänge 5/6).',
      [
        'Brüche', 'Dezimalzahlen', 'Gleichung', 'Proportionalität', 'Dreisatz', 'Dreieck',
        'Viereck', 'Winkel', 'Prisma', 'Prozent', 'Häufigkeit',
      ],
      [
        area('zg-gebrochen', 'Gebrochene Zahlen', [
          topic('st-k6-bruch-kuerzen', 'Brüche kürzen'),
          topic('st-k6-bruch-erweitern', 'Brüche erweitern'),
          topic('st-k6-bruch-vergleichen', 'Brüche vergleichen'),
          topic('st-k6-bruch-add', 'Brüche addieren und subtrahieren'),
          topic('st-k6-bruch-mul', 'Brüche multiplizieren'),
          topic('st-k6-bruch-div', 'Brüche dividieren'),
          topic('st-k6-bruch-dez', 'Brüche in Dezimalzahlen umwandeln'),
          topic('st-k6-prozent', 'In Prozent umwandeln'),
          topic('st-k6-dez-add', 'Dezimalzahlen addieren und subtrahieren'),
          topic('st-k6-dez-mul', 'Dezimalzahlen multiplizieren'),
          topic('st-k6-dez-div', 'Dezimalzahlen dividieren'),
          topic('st-k6-dez-runden', 'Dezimalzahlen runden'),
        ]),
        area('zg-gleichung', 'Gleichungen und Ungleichungen', [
          topic('st-k6-gleichung-add', 'Gleichung umstellen: x + a = b'),
          topic('st-k6-gleichung-mul', 'Gleichung umstellen: a · x = b'),
        ]),
        area('rf-winkel', 'Winkelbeziehungen', [
          topic('st-k6-nebenwinkel', 'Nebenwinkel berechnen'),
          topic('st-k6-scheitelwinkel', 'Scheitel- und Stufenwinkel'),
        ]),
        area('rf-dreieck', 'Dreiecke und Vierecke', [
          topic('st-k6-winkel-dreieck', 'Innenwinkelsatz im Dreieck'),
          topic('st-k6-winkel-viereck', 'Winkelsumme im Viereck'),
          topic('st-k6-flaeche-dreieck', 'Flächeninhalt von Dreiecken'),
          topic('st-k6-kongruenz', 'Kongruenzsatz wählen'),
          topic('st-k6-volumen-prisma', 'Volumen gerader Prismen'),
          topic('st-k6-wuerfelnetz', 'Würfelnetz erkennen'),
        ]),
        area('zf-zuordnung', 'Zuordnungen, direkte und indirekte Proportionalität', [
          topic('st-k6-proportional', 'Proportionale Zuordnung (Dreisatz)'),
          topic('st-k6-antiproportional', 'Antiproportionale Zuordnung'),
          topic('st-k6-dreisatz', 'Sachaufgabe: Dreisatz mit Einheiten'),
          topic('st-k6-anteil', 'Anteil einer Größe berechnen'),
          topic('st-k6-anteil-prozent', 'Prozent einer Größe berechnen'),
        ]),
        area('dz-kenngroessen', 'Erfassen, Darstellen und Auswerten von Daten', [
          topic('st-k6-haeufigkeit', 'Relative Häufigkeit in Prozent'),
        ]),
      ],
    ),
    grade(
      'st-gym-klasse-7',
      'Klasse 7',
      'Klasse 7',
      'Prozentrechnung, rationale Zahlen, Gleichungen und Terme sowie Körperdarstellung und -berechnung (ST Schuljahrgänge 7/8).',
      [
        'Prozent', 'Zinsen', 'rationale Zahlen', 'Terme', 'Gleichungen', 'Prisma', 'Pyramide',
        'Winkel', 'Mittelwert', 'Median',
      ],
      [
        area('zg-prozent', 'Prozentrechnung', [
          topic('st-k7-prozent', 'Prozent einer Größe berechnen'),
          topic('st-k7-zinsen', 'Jahreszinsen berechnen'),
          topic('st-k7-zinseszins', 'Zinseszins: Endkapital'),
          topic('st-k7-preisaenderung', 'Prozentuale Zunahme'),
        ]),
        area('zg-rational', 'Rationale Zahlen und Wurzeln', [
          topic('st-k7-rat-add', 'Rationale Zahlen addieren'),
          topic('st-k7-rat-sub', 'Rationale Zahlen subtrahieren'),
          topic('st-k7-rat-mul', 'Rationale Zahlen multiplizieren'),
          topic('st-k7-rat-div', 'Rationale Zahlen dividieren'),
          topic('st-k7-betrag', 'Betrag einer Zahl'),
          topic('st-k7-wurzeln', 'Wurzeln und Näherungswerte', [
            'Wurzel',
            'Näherungswert',
          ]),
        ]),
        area('zg-gleichung', 'Gleichungen und Ungleichungen', [
          topic('st-k7-gleichung', 'Lineare Gleichung a·x + b = c'),
          topic('st-k7-gleichung-beid', 'Gleichung mit x auf beiden Seiten'),
        ]),
        area('zg-variablen', 'Arbeiten mit Variablen', [
          topic('st-k7-term', 'Term mit Rechengesetzen auswerten'),
          topic('st-k7-term-auswerten', 'Term auswerten (x einsetzen)'),
          topic('st-k7-zusammenfassen', 'Terme zusammenfassen'),
          topic('st-k7-ausmult', 'Klammer ausmultiplizieren'),
        ]),
        area('rf-koerper', 'Körperdarstellung und Körperberechnung', [
          topic('st-k7-volumen-prisma', 'Volumen gerader Prismen'),
          topic('st-k7-mantel-prisma', 'Mantelfläche eines Prismas'),
          topic('st-k7-volumen-pyramide', 'Volumen einer Pyramide'),
          topic('st-k7-oberflaeche-quader', 'Oberfläche eines Quaders'),
          topic('st-k7-oberflaeche-pyramide', 'Oberfläche einer Pyramide'),
          topic('st-k7-winkelsumme', 'Innenwinkelsumme im Vieleck'),
          topic('st-k7-basiswinkel', 'Basiswinkel im gleichschenkligen Dreieck'),
          topic('st-k7-mittelsenkrechte', 'Mittelsenkrechte: Konstruktionsschritte'),
        ]),
        area('dz-daten', 'Daten und Kenngrößen', [
          topic('st-k7-mittelwert', 'Arithmetisches Mittel'),
          topic('st-k7-median', 'Median (Zentralwert)'),
          topic('st-k7-spannweite', 'Spannweite berechnen'),
        ]),
      ],
    ),
    grade(
      'st-gym-klasse-8',
      'Klasse 8',
      'Klasse 8',
      'Kreise, Ähnlichkeit, Satzgruppe des Pythagoras, lineare Funktionen sowie Zufallsversuche (ST Schuljahrgänge 7/8).',
      [
        'Kreis', 'Zylinder', 'Kugel', 'Pythagoras', 'Ähnlichkeit', 'Strahlensatz',
        'lineare Funktion', 'Steigung', 'LGS', 'Wahrscheinlichkeit', 'Laplace',
      ],
      [
        area('rf-kreis', 'Kreise', [
          topic('st-k8-kreis-umfang', 'Umfang eines Kreises'),
          topic('st-k8-kreis-flaeche', 'Flächeninhalt eines Kreises'),
          topic('st-k8-zylinder', 'Volumen eines Kreiszylinders'),
          topic('st-k8-kugel', 'Volumen einer Kugel'),
        ]),
        area('rf-aehnlich', 'Ähnlichkeit', [
          topic('st-k8-streckfaktor', 'Streckfaktor bestimmen'),
          topic('st-k8-strahlensatz', 'Strahlensatz: fehlende Länge'),
          topic('st-k8-aehnlich', 'Ähnliche Figuren: Seitenlänge'),
        ]),
        area('rf-pythagoras', 'Satzgruppe des Pythagoras', [
          topic('st-k8-pythagoras-hyp', 'Satz des Pythagoras: Hypotenuse'),
          topic('st-k8-pythagoras-kat', 'Satz des Pythagoras: fehlende Kathete'),
          topic('st-k8-leiter', 'Pythagoras im Sachkontext'),
        ]),
        area('zf-linear', 'Lineare Funktionen', [
          topic('st-k8-funktionswert', 'Funktionswert einer linearen Funktion'),
          topic('st-k8-steigung', 'Steigung aus zwei Punkten'),
          topic('st-k8-achsen', 'y-Achsenabschnitt bestimmen'),
          topic('st-k8-lgs', 'Lineares Gleichungssystem (x bestimmen)'),
        ]),
        area('dz-zufall', 'Zufällige Ereignisse und Wahrscheinlichkeiten', [
          topic('st-k8-laplace', 'Laplace-Wahrscheinlichkeit als Bruch'),
          topic('st-k8-laplace-pct', 'Laplace-Wahrscheinlichkeit in Prozent'),
          topic('st-k8-gegen', 'Gegenwahrscheinlichkeit'),
          topic('st-k8-mehrstufig', 'Mehrstufige Zufallsversuche / Pfadregeln', [
            'Baumdiagramm',
            'Pfadregel',
          ]),
        ]),
        area('vernetzung', 'Vernetzung', [
          topic('st-k8-zahlenraetsel', 'Zahlenrätsel (Gleichung aufstellen)'),
        ]),
      ],
    ),
    grade(
      'st-gym-klasse-9',
      'Klasse 9',
      'Klasse 9',
      'Potenzen und Logarithmen, Trigonometrie, quadratische Gleichungen und Funktionen sowie Häufigkeitsverteilungen.',
      [
        'Potenzen', 'quadratische Funktion', 'Parabel', 'Scheitelpunkt', 'Trigonometrie',
        'Sinus', 'quadratische Gleichung', 'Median', 'Modalwert', 'Logarithmen',
      ],
      [
        area('zg-potenz', 'Potenzen und Logarithmen', [
          topic('st-k9-potenz-prod', 'Potenzgesetz: Produkt gleicher Basis'),
          topic('st-k9-potenz-quot', 'Potenzgesetz: Quotient und Potenz einer Potenz'),
          topic('st-k9-logarithmen', 'Logarithmen und Logarithmusgleichungen', ['Logarithmus']),
        ]),
        area('rf-trig', 'Trigonometrie', [
          topic('st-k9-trig', 'Werte von Sinus, Kosinus, Tangens'),
        ]),
        area('zf-quadrat', 'Quadratische Gleichungen und quadratische Funktionen', [
          topic('st-k9-quadrat-wert', 'Wert einer quadratischen Funktion'),
          topic('st-k9-scheitel', 'Scheitelpunkt aus der Scheitelform'),
          topic('st-k9-reinquadratisch', 'Reinquadratische Gleichung x² = a'),
          topic('st-k9-gleichung', 'Quadratische Gleichung (größere Lösung)'),
          topic('st-k9-parabel', 'Funktionswert einer Parabel'),
        ]),
        area('dz-haeufigkeit', 'Häufigkeitsverteilungen', [
          topic('st-k9-mittelwert', 'Arithmetisches Mittel'),
          topic('st-k9-median', 'Median (Zentralwert)'),
          topic('st-k9-modal', 'Modalwert (häufigster Wert)'),
          topic('st-k9-spannweite', 'Spannweite berechnen'),
          topic('st-k9-boxplot', 'Histogramm und Boxplot', ['Boxplot', 'Histogramm']),
        ]),
      ],
    ),
    grade(
      'st-gym-klasse-10',
      'Klasse 10 (Einführungsphase)',
      'Klasse 10 (Einführungsphase)',
      'Funktionsklassen und Wachstum, Vektoren sowie Zufallsgrößen (Einführungsphase).',
      [
        'Zinsen', 'exponentiell', 'Wachstum', 'Erwartungswert', 'Vektor', 'Skalarprodukt',
        'Funktionsklassen',
      ],
      [
        area('an-funktionen', 'Funktionsklassen', [
          topic('st-k10-exp', 'Exponentielles Wachstum'),
          topic('st-k10-zunahme', 'Prozentuale Zunahme'),
          topic('st-k10-zinsen', 'Jahreszinsen berechnen'),
          topic('st-k10-zinseszins', 'Zinseszins: Endkapital'),
          topic('st-k10-kapital', 'Kapital aus Zinsen bestimmen'),
          topic('st-k10-zinssatz', 'Zinssatz bestimmen'),
          topic('st-k10-funk-sin', 'Sinus- und Kosinusfunktionen (Funktionsklassen)', [
            'Sinus',
            'Periodizität',
          ]),
        ]),
        area('ag-vektoren', 'Vektoren', [
          topic('st-k10-vektor-skalar', 'Skalarprodukt zweier Vektoren'),
          topic('st-k10-vektor-betrag', 'Betrag eines Vektors'),
          topic('st-k10-lgs3', 'Lineare Gleichungssysteme mit drei Variablen', ['LGS']),
        ]),
        area('dz-zufall', 'Zufallsgrößen', [
          topic('st-k10-erwartung', 'Erwartungswert eines Glücksrads'),
          topic('st-k10-erwartung-wuerfel', 'Erwartungswert beim Würfel'),
        ]),
        area('geo-algebra', 'Algebraisches Lösen geometrischer Probleme', [
          topic('st-k10-rechteck', 'Rechteck: Breite aus Fläche'),
          topic('st-k10-quadrat-seite', 'Quadrat: Seitenlänge aus Fläche'),
        ]),
      ],
    ),
    grade(
      'st-gym-jgs-11-12-ga',
      'Jahrgangsstufen 11/12 (grundlegendes Anforderungsniveau)',
      'Jahrgangsstufen 11/12 (gA)',
      'Differential- und Integralrechnung, analytische Geometrie sowie Binomialverteilung (grundlegendes Anforderungsniveau).',
      [
        'Ableitung', 'Integral', 'Vektoren', 'Skalarprodukt', 'Binomialverteilung',
        'Erwartungswert', 'Stochastik',
      ],
      [
        area('an-analysis', 'Grundlagen der Infinitesimalrechnung / Differential- und Integralrechnung', [
          topic('st-k1112-ableitung', 'Ableitung eines Polynoms an einer Stelle'),
          topic('st-k1112-nullstelle', 'Nullstelle einer linearen Funktion'),
          topic('st-k1112-integral', 'Bestimmtes Integral eines Polynoms'),
        ]),
        area('ag-raum', 'Geraden und Ebenen / Vektoren', [
          topic('st-k1112-skalar', 'Skalarprodukt zweier Vektoren'),
          topic('st-k1112-betrag', 'Betrag eines Vektors'),
          topic('st-k1112-kreise-ag', 'Kreise in der analytischen Geometrie', ['Kreis', 'AG']),
        ]),
        area('dz-stochastik', 'Bedingte Wahrscheinlichkeit / Binomialverteilung', [
          topic('st-k1112-binomial', 'Binomialverteilung: P(X = k)'),
          topic('st-k1112-erwartung-binom', 'Erwartungswert der Binomialverteilung'),
          topic('st-k1112-bedingte', 'Bedingte Wahrscheinlichkeit', ['Vierfeldertafel']),
          topic('st-k1112-normal', 'Normalverteilung', ['Normalverteilung']),
          topic('st-k1112-statistik', 'Beurteilende Statistik', ['Hypothese']),
        ]),
      ],
    ),
  ]
}

export function allOfficialStTopics(): PackTopic[] {
  return officialGrades().flatMap((g) => g.areas.flatMap((a) => a.topics))
}

export function buildGymSachsenAnhaltPack(): CurriculumPack {
  const official = officialGrades()
  const pack: Omit<CurriculumPack, 'contentHash'> = {
    id: GYM_SACHSEN_ANHALT_PACK_ID,
    title: 'Gymnasium Sachsen-Anhalt · Mathematik',
    region: 'Sachsen-Anhalt',
    school: 'Gymnasium',
    subject: 'Mathematik',
    version: '1.0.0',
    changelog: `Erstfassung Klassen 5–10 und 11/12 gA nach Kompetenzschwerpunkten. Aufgaben aus dem Sachsen-Gym-Katalog eingeordnet; Lücken als Outline. ${SOURCE}`,
    official,
    extras: [],
  }
  return { ...pack, contentHash: packContentHash(official, []) }
}
