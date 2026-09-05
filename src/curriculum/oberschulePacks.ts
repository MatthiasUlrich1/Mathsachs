import {
  OS_HS_PACK_ID,
  OS_RS_PACK_ID,
  packContentHash,
  type CurriculumPack,
  type PackArea,
  type PackGrade,
  type PackTopic,
} from './pack'

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

const area = (id: string, title: string, ustd: number | undefined, topics: PackTopic[]): PackArea => ({
  id,
  title,
  ...(ustd !== undefined ? { ustd } : {}),
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

/** Klassen 5–6 laut Lehrplan Oberschule Mathematik — gemeinsam, in beiden Paketen. */
export function officialGrades56(prefix: 'os-hs' | 'os-rs'): PackGrade[] {
  const track = prefix === 'os-hs' ? 'Hauptschulbildungsgang' : 'Realschulbildungsgang'
  return [
    grade(
      `${prefix}-klasse-5`,
      `Klasse 5 · ${track}`,
      `Klasse 5 · ${track}`,
      'Natürliche Zahlen, gemeine Brüche, Dezimalzahlen und Größen, geometrische Grundformen sowie Symmetrie.',
      [
        'natürliche Zahlen', 'runden', 'Addition', 'Subtraktion', 'Multiplikation', 'Division',
        'Teilbarkeit', 'Primzahlen', 'Brüche', 'Dezimalzahlen', 'Winkel', 'Rechteck', 'Würfel',
        'Umfang', 'Fläche', 'Volumen', 'Einheiten', 'Länge', 'Masse', 'Zeit',
      ],
      [
        area('lb1', 'Natürliche Zahlen', 34, [
          topic('os-k5-lb1-runden', 'Veranschaulichen, Schätzen, Runden, Vergleichen und Ordnen natürlicher Zahlen', 'Schau auf die Ziffer rechts von der Rundungsstelle.', ['runden', 'Zahlenstrahl']),
          topic('os-k5-lb1-potenz', 'Potenzschreibweise und Zehnerpotenzen', 'a² = a · a; 10ⁿ ist eine 1 mit n Nullen.', ['Potenz', 'Zehnerpotenz']),
          topic('os-k5-lb1-addition', 'Addieren natürlicher Zahlen', 'Rechne Stelle für Stelle.', ['Addition']),
          topic('os-k5-lb1-subtraktion', 'Subtrahieren natürlicher Zahlen', 'Der Minuend (vorne) ist immer größer.', ['Subtraktion']),
          topic('os-k5-lb1-multiplikation', 'Multiplizieren natürlicher Zahlen', 'Zerlege den zweiten Faktor in Zehner und Einer.', ['Multiplikation']),
          topic('os-k5-lb1-division', 'Schriftliche Division durch einstelligen Divisor', 'Antwortformat: „q R r“ (Quotient, dann Rest).', ['Division']),
          topic('os-k5-lb1-quadrat', 'Quadratzahl und Quadratwurzel', 'Die Quadratwurzel ist die Umkehrung des Quadrierens.'),
          topic('os-k5-lb1-gleichung', 'Einfache Gleichungen und Ungleichungen inhaltlich lösen', 'Nutze die Umkehroperation oder systematisches Probieren.', ['Gleichung']),
          topic('os-k5-lb1-teilbarkeit', 'Teilbarkeit, Vielfache und Teiler', 'Antworte mit „ja“ oder „nein“.', ['Teiler', 'Vielfache']),
          topic('os-k5-lb1-primzahl', 'Teilbarkeitsregeln und Primzahlen', 'Eine Primzahl hat genau zwei Teiler: 1 und sich selbst.', ['Primzahl', 'Sieb des Eratosthenes']),
        ]),
        area('lb2', 'Gemeine Brüche, Dezimalzahlen und Größen', 34, [
          topic('os-k5-lb2-anteil', 'Erkennen und Darstellen gemeiner Brüche und Dezimalzahlen', 'Gib den vollständig gekürzten Bruch ein.', ['Bruch', 'Anteil']),
          topic('os-k5-lb2-kuerzen', 'Echte und unechte Brüche, Kürzen', 'Gib den vollständig gekürzten Bruch ein.', ['kürzen']),
          topic('os-k5-lb2-erweitern', 'Erweitern und Umwandeln von Zehnerbrüchen und Dezimalzahlen', 'Gib den gesuchten Zähler ein.', ['erweitern', 'Zehnerbruch']),
          topic('os-k5-lb2-vergleichen', 'Vergleichen, Ordnen und Abschätzen gemeiner Brüche'),
          topic('os-k5-lb2-runden-dez', 'Runden von Dezimalzahlen', 'Ist die nächste Ziffer 5 oder größer, wird aufgerundet.', ['runden']),
          topic('os-k5-lb2-dez-add-sub', 'Dezimalzahlen addieren und subtrahieren', 'Achte auf die Ausrichtung des Kommas.', ['Dezimalzahl']),
          topic('os-k5-lb2-dez-mult', 'Vervielfachen mit einstelligen natürlichen Zahlen und Zehnerpotenzen', 'Mit einstelliger Zahl oder Zehnerpotenz.', ['Dezimalzahl']),
          topic('os-k5-lb2-dez-div', 'Teilen durch einstellige natürliche Zahlen und Zehnerpotenzen', 'Durch einstellige Zahl oder Zehnerpotenz.', ['Dezimalzahl']),
          topic('os-k5-lb2-prozent', 'Prozentschreibweise für bequeme Anteile'),
          topic('os-k5-lb2-mittelwert', 'Arithmetisches Mittel', 'Mittelwert = Summe : Anzahl.', ['Mittelwert', 'Durchschnitt']),
          topic('os-k5-lb2-laenge', 'Einheiten umrechnen: Länge', 'Vorsätze Dezi, Zenti, Milli.', ['cm', 'm', 'km']),
          topic('os-k5-lb2-masse', 'Einheiten umrechnen: Masse', ['g', 'kg', 't']),
          topic('os-k5-lb2-zeit', 'Einheiten umrechnen: Zeit', ['min', 'h', 's']),
        ]),
        area('lb3', 'Geometrische Grundformen', 20, [
          topic('os-k5-lb3-koordinaten', 'Koordinaten und Koordinatensystem (erster Quadrant)'),
          topic('os-k5-lb3-lage', 'Lagebeziehungen: parallel, senkrecht, schneiden einander'),
          topic('os-k5-lb3-winkelarten', 'Messen und Zeichnen von Winkeln, Winkelarten', 'spitz, recht, stumpf, gestreckt oder überstumpf.', ['Winkel']),
          topic('os-k5-lb3-winkel-erg', 'Winkel zu 90° oder 180° ergänzen', 'Ziehe den gegebenen Winkel von 90° bzw. 180° ab.'),
          topic('os-k5-lb3-wuerfel', 'Würfel skizzieren, Körpernetze und Schrägbild'),
          topic('os-k5-lb3-umfang', 'Umfang als Summe von Seitenlängen', ['Umfang', 'Rechteck']),
          topic('os-k5-lb3-flaeche', 'Flächeninhaltsformel für das Rechteck', ['Fläche', 'Quadrat']),
          topic('os-k5-lb3-flaeche-eh', 'Einheiten umrechnen: Flächeninhalt', ['cm²', 'm²', 'Hektar']),
          topic('os-k5-lb3-oberflaeche', 'Oberfläche als zusammengesetzte Fläche', ['Oberfläche', 'Würfel']),
          topic('os-k5-lb3-volumen-wuerfel', 'Volumenformel für den Würfel', ['Volumen', 'Würfel']),
          topic('os-k5-lb3-volumen-eh', 'Einheiten umrechnen: Volumen', ['cm³', 'dm³', 'l']),
        ]),
        area('lb4', 'Symmetrie und deckungsgleiche Figuren', 12, [
          topic('os-k5-lb4-spiegelung', 'Spiegelungen und Verschiebungen, Symmetrieachse'),
          topic('os-k5-lb4-deckung', 'Zeichnen und Analysieren symmetrischer sowie deckungsgleicher Figuren'),
        ]),
        area('lbw1', 'Wahlbereich 1: Wie die Menschen Zählen und Rechnen lernten', undefined, [
          topic('os-k5-lbw1-zahlzeichen', 'Zahlzeichen verschiedener Epochen und Kulturkreise'),
          topic('os-k5-lbw1-abakus', 'Darstellung und Rechnen mit Abakus oder Rechenpfennigen'),
        ]),
        area('lbw2', 'Wahlbereich 2: Meine neue Klasse', undefined, [
          topic('os-k5-lbw2-daten', 'Erfassen und Darstellen von Daten (Urliste, Tabelle, Säulendiagramm)'),
          topic('os-k5-lbw2-kombinatorik', 'Einfache kombinatorische Zählstrategien'),
        ]),
        area('lbw3', 'Wahlbereich 3: Planen einer Klassenfahrt', undefined, [
          topic('os-k5-lbw3-angebote', 'Angebote vergleichen, Zeitpläne und Fahrtkosten'),
        ]),
      ],
    ),
    grade(
      `${prefix}-klasse-6`,
      `Klasse 6 · ${track}`,
      `Klasse 6 · ${track}`,
      'Gebrochene Zahlen, Zuordnungen in der Umwelt, Geometrie in der Ebene, geometrische Körper und Mathematik im Alltag.',
      [
        'Brüche', 'erweitern', 'kürzen', 'Dezimalzahlen', 'Dreisatz', 'proportional',
        'Dreieck', 'Viereck', 'Winkelsumme', 'Prisma', 'Volumen', 'Häufigkeit', 'Anteil',
      ],
      [
        area('lb1', 'Gebrochene Zahlen', 35, [
          topic('os-k6-lb1-erweiterung', 'Notwendigkeit einer Zahlenbereichserweiterung, Mengenbegriff'),
          topic('os-k6-lb1-kuerzen', 'Erweitern und Kürzen', 'Gib den vollständig gekürzten Bruch ein.', ['kürzen']),
          topic('os-k6-lb1-erweitern', 'Erweitern gemeiner Brüche', ['erweitern']),
          topic('os-k6-lb1-bruch-dez', 'Umwandeln gemeiner Brüche in Dezimalzahlen und umgekehrt', ['Dezimalzahl', 'periodisch']),
          topic('os-k6-lb1-vergleichen', 'Vergleichen und Ordnen gebrochener Zahlen', ['vergleichen']),
          topic('os-k6-lb1-add-sub', 'Addieren und Subtrahieren gebrochener Zahlen', ['Brüche']),
          topic('os-k6-lb1-mult', 'Multiplizieren gebrochener Zahlen', ['Brüche']),
          topic('os-k6-lb1-div', 'Dividieren gebrochener Zahlen', ['Brüche']),
          topic('os-k6-lb1-dez-add-sub', 'Dezimalzahlen addieren und subtrahieren'),
          topic('os-k6-lb1-dez-mult', 'Dezimalzahlen multiplizieren'),
          topic('os-k6-lb1-dez-div', 'Dezimalzahlen dividieren'),
          topic('os-k6-lb1-runden', 'Überschlagen, Abschätzen und Runden'),
          topic('os-k6-lb1-mittelwert', 'Arithmetisches Mittel', ['Mittelwert']),
          topic('os-k6-lb1-verhaeltnis', 'Verhältnisgleichungen'),
        ]),
        area('lb2', 'Zuordnungen in der Umwelt', 25, [
          topic('os-k6-lb2-arten', 'Eindeutige, eineindeutige und mehrdeutige Zuordnungen'),
          topic('os-k6-lb2-prop', 'Direkt proportionale Zuordnung (Dreisatz)', ['Dreisatz', 'proportional']),
          topic('os-k6-lb2-antiprop', 'Indirekt proportionale Zuordnung', ['antiproportional', 'Dreisatz']),
          topic('os-k6-lb2-anteil', 'Anteil einer Größe berechnen', ['Anteil']),
          topic('os-k6-lb2-darstellung', 'Darstellung in Wort, Tabelle, Koordinatensystem und Gleichung'),
        ]),
        area('lb3', 'Geometrie in der Ebene', 30, [
          topic('os-k6-lb3-nebenwinkel', 'Nebenwinkelsatz', ['Nebenwinkel']),
          topic('os-k6-lb3-scheitel', 'Scheitelwinkelsatz und Stufen- bzw. Wechselwinkel', ['Scheitelwinkel', 'Stufenwinkel']),
          topic('os-k6-lb3-innenwinkel', 'Innenwinkelsatz für Dreiecke', ['Dreieck', 'Winkelsumme']),
          topic('os-k6-lb3-einteilung', 'Einteilung der Dreiecke nach Seiten und Winkeln'),
          topic('os-k6-lb3-kongruenz', 'Kongruenzsätze, Seiten-Winkel-Relation und Dreiecksungleichung'),
          topic('os-k6-lb3-flaeche-dreieck', 'Flächeninhalt von Dreiecken (Grundseite und Höhe)', ['Dreieck']),
          topic('os-k6-lb3-parallelogramm', 'Flächeninhalt von Parallelogramm, Drachenviereck und Trapez'),
          topic('os-k6-lb3-umfang', 'Umfangsberechnung', ['Umfang']),
          topic('os-k6-lb3-flaeche-rechteck', 'Flächeninhalt von Rechteck und Quadrat'),
          topic('os-k6-lb3-winkelsumme-viereck', 'Winkelsumme im Viereck'),
        ]),
        area('lb4', 'Geometrische Körper', 20, [
          topic('os-k6-lb4-darstellen', 'Grundriss, Seitenansichten, Schrägbild und Körpernetz'),
          topic('os-k6-lb4-volumen-quader', 'Volumen von Quader und Würfel', ['Volumen']),
          topic('os-k6-lb4-oberflaeche', 'Oberfläche als zusammengesetzte Fläche', ['Oberfläche']),
          topic('os-k6-lb4-volumen-prisma', 'Volumen gerader Prismen', ['Prisma']),
        ]),
        area('lb5', 'Mathematik im Alltag', 15, [
          topic('os-k6-lb5-probieren', 'Problemlösestrategien: systematisches Probieren, Zurückführen auf Bekanntes'),
          topic('os-k6-lb5-haeufigkeit', 'Zufallsversuche: absolute und relative Häufigkeit', ['Häufigkeit', 'Zufall']),
          topic('os-k6-lb5-anteil-prozent', 'Anteile in Prozent', ['Prozent']),
          topic('os-k6-lb5-praesentation', 'Präsentation zu geometrischen Figuren und Körpern in der Umwelt'),
        ]),
        area('lbw1', 'Wahlbereich 1: Dynamisieren geometrischer Objekte', undefined, [
          topic('os-k6-lbw1-dgs', 'Geometrische Objekte mit dynamischer Geometriesoftware'),
        ]),
        area('lbw2', 'Wahlbereich 2: Mathematische Spiele', undefined, [
          topic('os-k6-lbw2-spiele', 'Spiele zur Problemlösefähigkeit, Raumanschauung und Stochastik'),
        ]),
        area('lbw3', 'Wahlbereich 3: Erfassen und Auswerten von Daten', undefined, [
          topic('os-k6-lbw3-mittelwert', 'Arithmetisches Mittel bei Datenerhebungen', ['Mittelwert']),
          topic('os-k6-lbw3-modal', 'Modalwert, Maximum und Minimum', ['Modalwert']),
        ]),
      ],
    ),
  ]
}

function officialGradesHs79(): PackGrade[] {
  return [
    grade(
      'os-hs-klasse-7',
      'Klasse 7 · Hauptschulbildungsgang',
      'Klasse 7 · Hauptschulbildungsgang',
      'Zusammengesetzte Flächen und Körper, Anteile und Prozente, rationale Zahlen sowie Vielecke und Prismen.',
      [
        'Prozent', 'Anteil', 'Dreisatz', 'rationale Zahlen', 'negative Zahlen',
        'Prisma', 'Dreieck', 'Vieleck', 'Häufigkeit',
      ],
      [
        area('lb1', 'Zusammengesetzte Flächen und Körper', 20, [
          topic('os-hs-k7-lb1-netze', 'Netze, Seitenansichten und Schrägbilder zeichnen'),
          topic('os-hs-k7-lb1-modelle', 'Herstellen von Modellen'),
          topic('os-hs-k7-lb1-flaeche', 'Flächeninhalte zusammengesetzter Figuren', ['Fläche']),
          topic('os-hs-k7-lb1-volumen', 'Volumen zusammengesetzter Körper', ['Volumen']),
        ]),
        area('lb2', 'Anteile und Prozente', 32, [
          topic('os-hs-k7-lb2-anteil-bruch', 'Anteile als gemeine Brüche, Dezimalzahlen und Prozente', ['Bruch', 'Prozent']),
          topic('os-hs-k7-lb2-vergleich', 'Vergleichen von Anteilen'),
          topic('os-hs-k7-lb2-kreisdiagramm', 'Grafisches Darstellen von Anteilen im Kreisdiagramm'),
          topic('os-hs-k7-lb2-anteil-groesse', 'Anteil einer Größe berechnen', ['Anteil']),
          topic('os-hs-k7-lb2-begriffe', 'Prozent, Prozentwert, Prozentsatz und Grundwert'),
          topic('os-hs-k7-lb2-prozent', 'Grundaufgaben der Prozentrechnung', ['Prozent', 'Prozentsatz']),
          topic('os-hs-k7-lb2-dreisatz', 'Dreisatz bei Aufgaben mit Umweltbezug', ['Dreisatz']),
          topic('os-hs-k7-lb2-haeufigkeit', 'Zufallsversuche: Urliste, absolute und relative Häufigkeit', ['Häufigkeit']),
        ]),
        area('lb3', 'Rationale Zahlen', 20, [
          topic('os-hs-k7-lb3-zahlengerade', 'Veranschaulichen auf der Zahlengeraden, Vergleichen und Ordnen'),
          topic('os-hs-k7-lb3-add', 'Rationale Zahlen addieren', ['negative Zahlen']),
          topic('os-hs-k7-lb3-sub', 'Rationale Zahlen subtrahieren'),
          topic('os-hs-k7-lb3-mul', 'Rationale Zahlen vervielfachen'),
          topic('os-hs-k7-lb3-div', 'Rationale Zahlen durch eine natürliche Zahl teilen'),
          topic('os-hs-k7-lb3-term', 'Termwerte berechnen', ['Term']),
          topic('os-hs-k7-lb3-gleichung', 'Einfache Gleichungen und Zahlenrätsel inhaltlich lösen', ['Gleichung']),
          topic('os-hs-k7-lb3-koordinaten', 'Punktkoordinaten in vier Quadranten'),
        ]),
        area('lb4', 'Vielecke und Prismen', 28, [
          topic('os-hs-k7-lb4-konstruieren', 'Konstruieren von Dreiecken, Parallelogrammen und Drachenvierecken'),
          topic('os-hs-k7-lb4-flaeche-dreieck', 'Flächeninhalt von Dreiecken', ['Dreieck']),
          topic('os-hs-k7-lb4-umfang', 'Umfang von Dreiecken und Vierecken', ['Umfang']),
          topic('os-hs-k7-lb4-winkelsumme', 'Innenwinkelsumme im Vieleck', ['Vieleck']),
          topic('os-hs-k7-lb4-zerlegen', 'Flächeninhalte von Vielecken durch Zerlegen'),
          topic('os-hs-k7-lb4-netze', 'Körpernetze, Schrägbilder und Seitenansichten von Prismen'),
          topic('os-hs-k7-lb4-volumen-prisma', 'Volumen gerader Prismen', ['Prisma', 'Volumen']),
          topic('os-hs-k7-lb4-mantel', 'Grund-, Mantel- und Oberfläche von Prismen', ['Mantelfläche']),
          topic('os-hs-k7-lb4-oberflaeche', 'Oberfläche eines Quaders', ['Oberfläche']),
        ]),
        area('lbw1', 'Wahlbereich 1: Bandornamente und Parkettierungen', undefined, [
          topic('os-hs-k7-lbw1-parkett', 'Bandornamente und Parkettierungen'),
        ]),
        area('lbw2', 'Wahlbereich 2: Optische Täuschungen', undefined, [
          topic('os-hs-k7-lbw2-taeuschung', 'Räumliche Illusionen und optische Täuschungen'),
        ]),
        area('lbw3', 'Wahlbereich 3: Unterhaltungsmathematik', undefined, [
          topic('os-hs-k7-lbw3-knobel', 'Probleme der Unterhaltungsmathematik'),
        ]),
      ],
    ),
    grade(
      'os-hs-klasse-8',
      'Klasse 8 · Hauptschulbildungsgang',
      'Klasse 8 · Hauptschulbildungsgang',
      'Wirtschaftliches Rechnen, Formeln und Gleichungen, Kreis, Kreiszylinder und Mathematik im Alltag.',
      [
        'Zinsen', 'Prozent', 'Skonto', 'Rabatt', 'Gleichung', 'Formel',
        'Kreis', 'Pi', 'Kreiszylinder', 'Maßstab',
      ],
      [
        area('lb1', 'Wirtschaftliches Rechnen', 24, [
          topic('os-hs-k8-lb1-prozent', 'Prozentrechnung in wirtschaftlichen Problemen', ['Prozent']),
          topic('os-hs-k8-lb1-zinsen', 'Kapital, Zinssatz, Jahreszins', ['Zinsen', 'Kapital']),
          topic('os-hs-k8-lb1-zinseszins', 'Zinseszins', ['Zinseszins']),
          topic('os-hs-k8-lb1-preisaenderung', 'Preiserhöhung und Preissenkung', ['Prozent']),
          topic('os-hs-k8-lb1-skonto', 'Skonto, Rabatt und Mehrwertsteuer'),
          topic('os-hs-k8-lb1-diagramme', 'Erstellen und Deuten von Säulen-, Linien- und Kreisdiagrammen'),
        ]),
        area('lb2', 'Formeln und Gleichungen', 16, [
          topic('os-hs-k8-lb2-struktur', 'Struktur von Formeln erkennen und Formeln umstellen'),
          topic('os-hs-k8-lb2-term', 'Term auswerten (Werte berechnen)', ['Term']),
          topic('os-hs-k8-lb2-zusammenfassen', 'Terme zusammenfassen', ['Term']),
          topic('os-hs-k8-lb2-gleichung', 'Lineare Gleichung', ['Gleichung']),
          topic('os-hs-k8-lb2-formelsammlung', 'Umgang mit der Formelsammlung'),
        ]),
        area('lb3', 'Vom Vieleck zum Kreis', 16, [
          topic('os-hs-k8-lb3-vieleck', 'Eigenschaften regelmäßiger Vielecke, Achsen- und Drehsymmetrie'),
          topic('os-hs-k8-lb3-winkelsumme', 'Innenwinkel und Innenwinkelsumme', ['Vieleck']),
          topic('os-hs-k8-lb3-kreis-umfang', 'Umfang eines Kreises', ['Kreis', 'Pi']),
          topic('os-hs-k8-lb3-kreis-flaeche', 'Flächeninhalt eines Kreises', ['Kreis', 'Pi']),
          topic('os-hs-k8-lb3-kreisring', 'Flächeninhalt am Kreisring'),
          topic('os-hs-k8-lb3-lage', 'Lagebeziehungen von Kreis und Gerade: Sehne, Sekante, Tangente'),
        ]),
        area('lb4', 'Kreiszylinder und Hohlzylinder', 16, [
          topic('os-hs-k8-lb4-darstellen', 'Netze, Ansichten und Schrägbild des Kreiszylinders'),
          topic('os-hs-k8-lb4-zylinder', 'Volumen von Kreis- und Hohlzylindern', ['Zylinder', 'Volumen']),
          topic('os-hs-k8-lb4-oberflaeche', 'Grund-, Mantel- und Oberfläche des Kreiszylinders'),
        ]),
        area('lb5', 'Mathematik im Alltag', 28, [
          topic('os-hs-k8-lb5-haushalt', 'Haushaltsbuch, Rechnungen, Wohn- und Baukosten'),
          topic('os-hs-k8-lb5-zinsen', 'Verzinsungsmöglichkeiten und Vergleich von Angeboten', ['Zinsen']),
          topic('os-hs-k8-lb5-streckfaktor', 'Maßstäbliches Darstellen ebener Figuren und Körper', ['Maßstab', 'Streckfaktor']),
        ]),
        area('lbw1', 'Wahlbereich 1: Das Fahrrad', undefined, [
          topic('os-hs-k8-lbw1-fahrrad', 'Kenndaten, Wegstrecken und Geschwindigkeiten am Fahrrad'),
        ]),
        area('lbw2', 'Wahlbereich 2: Achtung Schuldenfalle', undefined, [
          topic('os-hs-k8-lbw2-kredit', 'Kredit, Tilgung und Kreditangebote'),
        ]),
        area('lbw3', 'Wahlbereich 3: Modellbau', undefined, [
          topic('os-hs-k8-lbw3-modell', 'Maßstäbliches Vergrößern und Verkleinern im Modellbau'),
        ]),
      ],
    ),
    grade(
      'os-hs-klasse-9',
      'Klasse 9 · Hauptschulbildungsgang',
      'Klasse 9 · Hauptschulbildungsgang',
      'Rechtwinklige Dreiecke, Körperdarstellung und -berechnung, funktionale Zusammenhänge und Mathematik im Alltag.',
      [
        'Pythagoras', 'Sinus', 'Pyramide', 'Kreiskegel', 'lineare Funktion',
        'Steigung', 'Mittelwert',
      ],
      [
        area('lb1', 'Rechtwinklige Dreiecke', 28, [
          topic('os-hs-k9-lb1-hyp', 'Satz des Pythagoras: Hypotenuse', ['Pythagoras']),
          topic('os-hs-k9-lb1-kathete', 'Satz des Pythagoras: fehlende Kathete', ['Pythagoras']),
          topic('os-hs-k9-lb1-sinus', 'Sinus eines Winkels im rechtwinkligen Dreieck', ['Sinus', 'Trigonometrie']),
          topic('os-hs-k9-lb1-umkehrung', 'Umkehrung des Satzes des Pythagoras'),
          topic('os-hs-k9-lb1-sach', 'Seitenlängen und Winkel in Sachaufgaben', ['Dachstuhl', 'Fachwerk']),
        ]),
        area('lb2', 'Körperdarstellung und Körperberechnung', 28, [
          topic('os-hs-k9-lb2-darstellen', 'Schrägbild, Netz und Ansichten von Pyramide und Kreiskegel'),
          topic('os-hs-k9-lb2-pyramide', 'Volumen einer Pyramide mit quadratischer Grundfläche', ['Pyramide']),
          topic('os-hs-k9-lb2-kegel', 'Volumen von Kreiskegeln'),
          topic('os-hs-k9-lb2-zylinder', 'Volumen eines Kreiszylinders', ['Zylinder']),
          topic('os-hs-k9-lb2-masse', 'Masse unter Einbeziehung der Dichte'),
          topic('os-hs-k9-lb2-zusammengesetzt', 'Zusammengesetzte Körper'),
        ]),
        area('lb3', 'Funktionale Zusammenhänge', 24, [
          topic('os-hs-k9-lb3-funktion', 'Funktion als eindeutige Zuordnung'),
          topic('os-hs-k9-lb3-funktionswert', 'Funktionswert einer linearen Funktion y = m·x+n', ['lineare Funktion']),
          topic('os-hs-k9-lb3-steigung', 'Steigung aus zwei Punkten', ['Steigung']),
          topic('os-hs-k9-lb3-achsen', 'y-Achsenabschnitt bestimmen', ['Achsenabschnitt']),
          topic('os-hs-k9-lb3-schnitt', 'Schnittpunktkoordinaten zweier Graphen'),
          topic('os-hs-k9-lb3-quadrat', 'Einblick: y = x² und y = a·x²', ['Parabel']),
        ]),
        area('lb4', 'Mathematik im Alltag', 20, [
          topic('os-hs-k9-lb4-kalkulation', 'Kalkulationen, Materialbedarf und funktionale Zusammenhänge'),
          topic('os-hs-k9-lb4-mittelwert', 'Darstellen und Auswerten von Daten', ['Mittelwert']),
        ]),
        area('lbw1', 'Wahlbereich 1: Statistische Erhebungen', undefined, [
          topic('os-hs-k9-lbw1-median', 'Zentralwert (Median)', ['Median']),
          topic('os-hs-k9-lbw1-modal', 'Modalwert', ['Modalwert']),
          topic('os-hs-k9-lbw1-spannweite', 'Spannweite', ['Spannweite']),
        ]),
        area('lbw2', 'Wahlbereich 2: Optimierung', undefined, [
          topic('os-hs-k9-lbw2-opt', 'Optimierungsprobleme aus Alltag und Wirtschaft'),
        ]),
        area('lbw3', 'Wahlbereich 3: Technisches Zeichnen', undefined, [
          topic('os-hs-k9-lbw3-zeichnen', 'Technische Zeichnungen und mehrere Ansichten'),
        ]),
      ],
    ),
  ]
}

function officialGradesRs710(): PackGrade[] {
  return [
    grade(
      'os-rs-klasse-7',
      'Klasse 7 · Realschulbildungsgang',
      'Klasse 7 · Realschulbildungsgang',
      'Prozent- und Zinsrechnung, Elemente der Stochastik, rationale Zahlen und Gleichungen sowie Vielecke und Prismen.',
      [
        'Prozent', 'Zinsen', 'Zinseszins', 'Wahrscheinlichkeit', 'Häufigkeit',
        'rationale Zahlen', 'Gleichung', 'Prisma', 'Vieleck',
      ],
      [
        area('lb1', 'Prozent- und Zinsrechnung', 28, [
          topic('os-rs-k7-lb1-dreisatz', 'Dreisatz auf Grundaufgaben der Prozentrechnung', ['Dreisatz']),
          topic('os-rs-k7-lb1-prozent', 'Bequeme Prozentsätze, Prozentwert, Prozentsatz, Grundwert', ['Prozent']),
          topic('os-rs-k7-lb1-kreisdiagramm', 'Darstellung im Kreisdiagramm'),
          topic('os-rs-k7-lb1-preisaenderung', 'Preiserhöhung und Preissenkung', ['Prozent']),
          topic('os-rs-k7-lb1-zinsen', 'Zinssatz, Zinsen, Kapital', ['Zinsen']),
          topic('os-rs-k7-lb1-zinseszins', 'Tageszins und Zinseszins', ['Zinseszins']),
        ]),
        area('lb2', 'Elemente der Stochastik', 12, [
          topic('os-rs-k7-lb2-versuch', 'Zufallsversuche: Ergebnis, Ergebnismenge, Ereignis'),
          topic('os-rs-k7-lb2-haeufigkeit', 'Urliste, absolute und relative Häufigkeit', ['Häufigkeit']),
          topic('os-rs-k7-lb2-laplace', 'Wahrscheinlichkeit als Bruch', ['Laplace', 'Wahrscheinlichkeit']),
          topic('os-rs-k7-lb2-laplace-pct', 'Wahrscheinlichkeit in Prozent', ['Wahrscheinlichkeit']),
        ]),
        area('lb3', 'Rationale Zahlen und Gleichungen', 28, [
          topic('os-rs-k7-lb3-ordnen', 'Veranschaulichen, Vergleichen und Ordnen rationaler Zahlen'),
          topic('os-rs-k7-lb3-add', 'Rationale Zahlen addieren', ['negative Zahlen']),
          topic('os-rs-k7-lb3-sub', 'Rationale Zahlen subtrahieren'),
          topic('os-rs-k7-lb3-mul', 'Rationale Zahlen multiplizieren und potenzieren'),
          topic('os-rs-k7-lb3-div', 'Rationale Zahlen dividieren'),
          topic('os-rs-k7-lb3-term', 'Rechengesetze und Termwerte', ['Term']),
          topic('os-rs-k7-lb3-gleichung', 'Gleichungen der Form a·x+b = c', ['Gleichung']),
          topic('os-rs-k7-lb3-gleichung-beid', 'Gleichungen der Form a·x+b = c·x+d', ['Gleichung']),
          topic('os-rs-k7-lb3-zahlenraetsel', 'Aufstellen von Gleichungen, Zahlenrätsel', ['Zahlenrätsel']),
          topic('os-rs-k7-lb3-koordinaten', 'Punktkoordinaten in vier Quadranten'),
        ]),
        area('lb4', 'Vielecke und Prismen', 32, [
          topic('os-rs-k7-lb4-konstruieren', 'Konstruktion von Parallelogramm, Drachenviereck und Trapez'),
          topic('os-rs-k7-lb4-flaeche-dreieck', 'Flächeninhalt von Dreiecken', ['Dreieck']),
          topic('os-rs-k7-lb4-umfang', 'Umfang von Dreiecken und Vierecken'),
          topic('os-rs-k7-lb4-winkelsumme', 'Innenwinkelsumme im Vieleck', ['Vieleck']),
          topic('os-rs-k7-lb4-vieleck-flaeche', 'Flächeninhalt und Umfang von Vielecken'),
          topic('os-rs-k7-lb4-darstellen', 'Körpernetze, Schrägbilder und senkrechte Zweitafelbilder'),
          topic('os-rs-k7-lb4-volumen-prisma', 'Volumen gerader Prismen', ['Prisma']),
          topic('os-rs-k7-lb4-mantel', 'Mantelfläche eines Prismas'),
          topic('os-rs-k7-lb4-oberflaeche', 'Oberflächeninhalt von Prismen und Quadern', ['Oberfläche']),
          topic('os-rs-k7-lb4-masse', 'Masse unter Einbeziehung der Dichte'),
        ]),
        area('lbw1', 'Wahlbereich 1: Technisches Zeichnen', undefined, [
          topic('os-rs-k7-lbw1-zeichnen', 'Lesen technischer Zeichnungen, Schnitte und Bemaßung'),
        ]),
        area('lbw2', 'Wahlbereich 2: Unterhaltungsmathematik und Rechenverfahren', undefined, [
          topic('os-rs-k7-lbw2-knobel', 'Andere Rechenverfahren und Unterhaltungsmathematik'),
        ]),
        area('lbw3', 'Wahlbereich 3: Parkettierungen', undefined, [
          topic('os-rs-k7-lbw3-parkett', 'Parkettierung der Ebene'),
        ]),
      ],
    ),
    grade(
      'os-rs-klasse-8',
      'Klasse 8 · Realschulbildungsgang',
      'Klasse 8 · Realschulbildungsgang',
      'Lineare Gleichungen, lineare Funktionen und Gleichungssysteme, Kreis und Kreiszylinder, Ähnlichkeit, zufällige Ereignisse.',
      [
        'Terme', 'lineare Gleichung', 'lineare Funktion', 'LGS', 'Steigung',
        'Kreis', 'Zylinder', 'Ähnlichkeit', 'Strahlensatz', 'Wahrscheinlichkeit',
      ],
      [
        area('lb1', 'Lineare Gleichungen', 16, [
          topic('os-rs-k8-lb1-term', 'Termwertberechnung', ['Term']),
          topic('os-rs-k8-lb1-zusammenfassen', 'Addition und Subtraktion von Summen', ['Term']),
          topic('os-rs-k8-lb1-ausmult', 'Multiplikation eines Faktors mit einer Summe', ['ausmultiplizieren']),
          topic('os-rs-k8-lb1-ausklammern', 'Ausklammern eines Faktors'),
          topic('os-rs-k8-lb1-gleichung', 'Kalkülmäßiges Lösen linearer Gleichungen', ['Gleichung']),
          topic('os-rs-k8-lb1-gleichung-beid', 'Gleichung mit x auf beiden Seiten', ['Gleichung']),
          topic('os-rs-k8-lb1-formel', 'Umstellen von Formeln'),
        ]),
        area('lb2', 'Lineare Funktionen und Gleichungssysteme', 26, [
          topic('os-rs-k8-lb2-funktion', 'Funktion als eindeutige Zuordnung'),
          topic('os-rs-k8-lb2-funktionswert', 'Funktionswert einer linearen Funktion', ['lineare Funktion']),
          topic('os-rs-k8-lb2-steigung', 'Steigung aus zwei Punkten', ['Steigung']),
          topic('os-rs-k8-lb2-achsen', 'y-Achsenabschnitt bestimmen'),
          topic('os-rs-k8-lb2-nullstelle', 'Zeichnerisches und rechnerisches Ermitteln von Nullstellen'),
          topic('os-rs-k8-lb2-lgs', 'Lineares Gleichungssystem', ['LGS', 'Gleichungssystem']),
        ]),
        area('lb3', 'Kreis und Kreiszylinder', 18, [
          topic('os-rs-k8-lb3-lage', 'Lagebeziehungen von Kreis und Gerade, Satz des Thales'),
          topic('os-rs-k8-lb3-kreis-umfang', 'Umfang eines Kreises', ['Kreis', 'Pi']),
          topic('os-rs-k8-lb3-kreis-flaeche', 'Flächeninhalt eines Kreises und Kreisrings', ['Kreis']),
          topic('os-rs-k8-lb3-darstellen', 'Netz, Ansichten und Schrägbild von Kreis- und Hohlzylinder'),
          topic('os-rs-k8-lb3-zylinder', 'Volumen von Kreis- und Hohlzylindern', ['Zylinder']),
        ]),
        area('lb4', 'Ähnlichkeit', 14, [
          topic('os-rs-k8-lb4-streckfaktor', 'Zentrische Streckung, Streckfaktor', ['Streckfaktor', 'Maßstab']),
          topic('os-rs-k8-lb4-strahlensatz', 'Strahlensatz: fehlende Länge', ['Strahlensatz']),
          topic('os-rs-k8-lb4-aehnlich', 'Ähnliche Figuren: Seitenlänge, Flächen und Volumen', ['Ähnlichkeit']),
          topic('os-rs-k8-lb4-kongruenz', 'Kongruenz als Spezialfall der Ähnlichkeit'),
        ]),
        area('lb5', 'Zufällige Ereignisse', 14, [
          topic('os-rs-k8-lb5-simulation', 'Simulation von Zufallsversuchen'),
          topic('os-rs-k8-lb5-laplace', 'Wahrscheinlichkeiten und kombinatorisches Zählen', ['Wahrscheinlichkeit']),
          topic('os-rs-k8-lb5-gegen', 'Gegenwahrscheinlichkeit', ['Gegenwahrscheinlichkeit']),
          topic('os-rs-k8-lb5-baum', 'Mehrstufige Zufallsversuche, Baumdiagramm und Pfadregeln'),
        ]),
        area('lb6', 'Mathematik im Alltag', 12, [
          topic('os-rs-k8-lb6-kosten', 'Lebenshaltungs- und Baukosten'),
          topic('os-rs-k8-lb6-zinsen', 'Vergleich von Angeboten, Sparanlagen und Ratenzahlungen', ['Zinsen']),
          topic('os-rs-k8-lb6-prozent', 'Prozentrechnung in Alltagsbezügen', ['Prozent']),
        ]),
        area('lbw1', 'Wahlbereich 1: Das Fahrrad', undefined, [
          topic('os-rs-k8-lbw1-fahrrad', 'Kenndaten, Wegstrecken und Geschwindigkeiten am Fahrrad'),
        ]),
        area('lbw2', 'Wahlbereich 2: Modellbau', undefined, [
          topic('os-rs-k8-lbw2-modell', 'Maßstäbliches Vergrößern und Verkleinern im Modellbau'),
        ]),
        area('lbw3', 'Wahlbereich 3: Polyeder', undefined, [
          topic('os-rs-k8-lbw3-polyeder', 'Reguläre und halbreguläre Polyeder'),
        ]),
      ],
    ),
    grade(
      'os-rs-klasse-9',
      'Klasse 9 · Realschulbildungsgang',
      'Klasse 9 · Realschulbildungsgang',
      'Rechtwinklige Dreiecke, Pyramide, Kreiskegel und Kugel, quadratische Funktionen und Gleichungen, beschreibende Statistik.',
      [
        'Pythagoras', 'Sinus', 'Kosinus', 'Tangens', 'Pyramide', 'Kugel',
        'quadratische Funktion', 'Scheitelpunkt', 'Median', 'Modalwert',
      ],
      [
        area('lb1', 'Rechtwinklige Dreiecke', 28, [
          topic('os-rs-k9-lb1-hyp', 'Satz des Pythagoras: Hypotenuse', ['Pythagoras']),
          topic('os-rs-k9-lb1-kathete', 'Satz des Pythagoras: fehlende Kathete', ['Pythagoras']),
          topic('os-rs-k9-lb1-trig', 'Sinus, Kosinus und Tangens im rechtwinkligen Dreieck', ['Sinus', 'Kosinus', 'Tangens']),
          topic('os-rs-k9-lb1-umkehrung', 'Umkehrung des Satzes des Pythagoras'),
          topic('os-rs-k9-lb1-sach', 'Seitenlängen, Höhen und Winkel in Sachaufgaben', ['Dachstuhl']),
        ]),
        area('lb2', 'Pyramide, Kreiskegel, Kugel', 28, [
          topic('os-rs-k9-lb2-darstellen', 'Schrägbild, Netz und Zweitafelbild von Pyramide und Kreiskegel'),
          topic('os-rs-k9-lb2-pyramide', 'Volumen und Oberfläche von Pyramiden', ['Pyramide']),
          topic('os-rs-k9-lb2-kegel', 'Mantellinie, Mantel und Volumen von Kreiskegeln'),
          topic('os-rs-k9-lb2-zylinder', 'Volumen eines Kreiszylinders', ['Zylinder']),
          topic('os-rs-k9-lb2-kugel', 'Oberflächeninhalt und Volumen der Kugel', ['Kugel']),
          topic('os-rs-k9-lb2-zusammengesetzt', 'Zusammengesetzte Körper'),
        ]),
        area('lb3', 'Quadratische Funktionen und quadratische Gleichungen', 28, [
          topic('os-rs-k9-lb3-quadrat', 'Wert einer quadratischen Funktion', ['Parabel']),
          topic('os-rs-k9-lb3-scheitel', 'Scheitelpunkt aus der Scheitelform', ['Scheitelpunkt']),
          topic('os-rs-k9-lb3-gleichung', 'Quadratische Gleichungen lösen', ['quadratische Gleichung']),
          topic('os-rs-k9-lb3-potenz-prod', 'Potenzgesetz: Produkt gleicher Basis', ['Potenz']),
          topic('os-rs-k9-lb3-potenz-quot', 'Potenzgesetz: Quotient und Potenz einer Potenz'),
          topic('os-rs-k9-lb3-nullstellen', 'Nullstellen und Schnittpunktkoordinaten'),
          topic('os-rs-k9-lb3-fall', 'Prinzip der Fallunterscheidung'),
        ]),
        area('lb4', 'Beschreibende Statistik', 16, [
          topic('os-rs-k9-lb4-medien', 'Darstellungen und Inhalte von Datenerhebungen beurteilen'),
          topic('os-rs-k9-lb4-mittelwert', 'Arithmetisches Mittel', ['Mittelwert']),
          topic('os-rs-k9-lb4-median', 'Zentralwert (Median)', ['Median']),
          topic('os-rs-k9-lb4-modal', 'Modalwert', ['Modalwert']),
          topic('os-rs-k9-lb4-spannweite', 'Maximum, Minimum und Spannweite', ['Spannweite']),
        ]),
        area('lbw1', 'Wahlbereich 1: Goldener Schnitt', undefined, [
          topic('os-rs-k9-lbw1-gold', 'Goldener Schnitt als Streckenverhältnis'),
        ]),
        area('lbw2', 'Wahlbereich 2: Wahre Größe und Gestalt', undefined, [
          topic('os-rs-k9-lbw2-laenge', 'Wahre Länge von Kanten und wahre Gestalt von Schnittflächen'),
        ]),
        area('lbw3', 'Wahlbereich 3: Sportfest', undefined, [
          topic('os-rs-k9-lbw3-sport', 'Wettkampfsysteme und Auswertung eines Sportfestes'),
        ]),
      ],
    ),
    grade(
      'os-rs-klasse-10',
      'Klasse 10 · Realschulbildungsgang',
      'Klasse 10 · Realschulbildungsgang',
      'Dreiecke und Vielecke, funktionale Zusammenhänge und Wachstum, Zufallsgrößen sowie Mathematik im Alltag.',
      [
        'Sinussatz', 'Kosinussatz', 'Exponentialfunktion', 'Wachstum', 'Zinseszins',
        'Erwartungswert', 'Zufallsgröße', 'Pyramide', 'Kugel',
      ],
      [
        area('lb1', 'Dreiecke und Vielecke', 20, [
          topic('os-rs-k10-lb1-system', 'Systematisieren der Dreiecke und Vierecke'),
          topic('os-rs-k10-lb1-trig', 'Trigonometrische Beziehungen in beliebigen Dreiecken', ['Sinussatz', 'Kosinussatz']),
          topic('os-rs-k10-lb1-hyp', 'Seitenlängen mit dem Satz des Pythagoras', ['Pythagoras']),
          topic('os-rs-k10-lb1-winkelsumme', 'Winkelgrößen in Vielecken', ['Vieleck']),
          topic('os-rs-k10-lb1-flaeche-dreieck', 'Flächeninhalte in Dreiecken und Vielecken', ['Fläche']),
        ]),
        area('lb2', 'Funktionale Zusammenhänge', 20, [
          topic('os-rs-k10-lb2-potenz', 'Potenzfunktionen y = a·xⁿ'),
          topic('os-rs-k10-lb2-quadrat', 'Quadratische Zusammenhänge', ['Parabel']),
          topic('os-rs-k10-lb2-exp', 'Exponentialfunktionen und Wachstumsvorgänge', ['exponentiell', 'Wachstum']),
          topic('os-rs-k10-lb2-zinseszins', 'Zinseszins: Endkapital', ['Zinseszins']),
          topic('os-rs-k10-lb2-zunahme', 'Prozentuale Zunahme', ['Prozent']),
          topic('os-rs-k10-lb2-sinus', 'Sinusfunktion, Periodizität, Grad- und Bogenmaß'),
        ]),
        area('lb3', 'Zufallsgrößen', 12, [
          topic('os-rs-k10-lb3-zufall', 'Verwenden von Zufallsgrößen'),
          topic('os-rs-k10-lb3-erwartung', 'Erwartungswert einer Zufallsgröße', ['Erwartungswert']),
          topic('os-rs-k10-lb3-laplace', 'Wahrscheinlichkeiten bei Zufallsversuchen', ['Wahrscheinlichkeit']),
          topic('os-rs-k10-lb3-simulation', 'Simulation von Zufallsversuchen'),
        ]),
        area('lb4', 'Mathematik im Alltag', 28, [
          topic('os-rs-k10-lb4-wirtschaft', 'Probleme aus Umwelt und Wirtschaft, Sparen und Kredit'),
          topic('os-rs-k10-lb4-zinsen', 'Zinsen und Kapital', ['Zinsen']),
          topic('os-rs-k10-lb4-pyramide', 'Körper einschließlich Pyramiden- und Kegelstumpf', ['Pyramide']),
          topic('os-rs-k10-lb4-kugel', 'Volumen der Kugel', ['Kugel']),
          topic('os-rs-k10-lb4-erwartung', 'Wahrscheinlichkeiten und Erwartungswerte'),
        ]),
        area('lbw1', 'Wahlbereich 1: Dynamisieren geometrischer Objekte', undefined, [
          topic('os-rs-k10-lbw1-dgs', 'Zentralperspektive, Ortskurven und Makros'),
        ]),
        area('lbw2', 'Wahlbereich 2: Optimierung', undefined, [
          topic('os-rs-k10-lbw2-opt', 'Optimierungsprobleme und lineare Ungleichungen'),
        ]),
        area('lbw3', 'Wahlbereich 3: Vermessungsprobleme', undefined, [
          topic('os-rs-k10-lbw3-pythagoras', 'Vermessung mit dem Satz des Pythagoras', ['Pythagoras']),
          topic('os-rs-k10-lbw3-strahlensatz', 'Vermessung mit Strahlensätzen und ähnlichen Figuren', ['Strahlensatz']),
        ]),
      ],
    ),
  ]
}

const SOURCE =
  'Lehrplan Oberschule Mathematik (Sachsen) 2004/2009/2019, lplanid=67, https://www.schulportal.sachsen.de/lplandb/'

const wrap = (
  id: string,
  title: string,
  changelog: string,
  official: PackGrade[],
): CurriculumPack => ({
  id,
  title,
  region: 'Sachsen',
  school: 'Oberschule',
  subject: 'Mathematik',
  version: '1.0.0',
  changelog,
  contentHash: packContentHash(official, []),
  official,
  extras: [],
})

export function buildOberschuleHsPack(): CurriculumPack {
  const official = [...officialGrades56('os-hs'), ...officialGradesHs79()]
  return wrap(
    OS_HS_PACK_ID,
    'Oberschule Sachsen · Mathematik · Hauptschulbildungsgang',
    `Erstfassung Klassen 5–9 (Hauptschulbildungsgang). Pflicht-Lernbereiche und Wahlbereiche nach dem offiziellen Lehrplan. ${SOURCE}`,
    official,
  )
}

export function buildOberschuleRsPack(): CurriculumPack {
  const official = [...officialGrades56('os-rs'), ...officialGradesRs710()]
  return wrap(
    OS_RS_PACK_ID,
    'Oberschule Sachsen · Mathematik · Realschulbildungsgang',
    `Erstfassung Klassen 5–10 (Realschulbildungsgang). Pflicht-Lernbereiche und Wahlbereiche nach dem offiziellen Lehrplan. ${SOURCE}`,
    official,
  )
}

export function allOfficialTopics(pack: CurriculumPack): PackTopic[] {
  return pack.official.flatMap((g) => g.areas.flatMap((a) => a.topics))
}
