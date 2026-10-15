/**
 * Expanded Gym Sachsen Physik topic titles (≈5–9 per Lernbereich),
 * aligned with Lehrplan + typical Aufgaben (LEIFI, Olympiade, Schulaufgaben).
 * Existing topic IDs are kept; new IDs extend each area.
 */
import type { PackArea, PackGrade, PackTopic } from './pack'
import { DEFAULT_TASKS_PER_ROUND } from './tasksPerRound'

const topic = (
  id: string,
  title: string,
  keywords?: string[],
  opts?: { released?: boolean; tasksPerRound?: number; excludeFachwissen?: boolean },
): PackTopic => ({
  id,
  title,
  pointsPerTask: 10,
  hint: 'Tippe oder gib die Antwort ein. Erklärung erscheint nach dem Prüfen.',
  released: opts?.released ?? false,
  tasksPerRound: opts?.tasksPerRound ?? DEFAULT_TASKS_PER_ROUND,
  ...(keywords?.length ? { keywords } : {}),
  // Wissen is the default for every curriculum topic (Issue #45); only pass
  // excludeFachwissen: true to opt out intentionally.
  ...(opts?.excludeFachwissen ? { excludeFachwissen: true } : {}),
})

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
  subjectTitle: 'Physik',
  gradeTitle,
  description,
  searchHints,
  areas,
})

/** Official outline with Math-like topic density (5–9 practice topics per Lernbereich). */
export function buildPhysikGymOfficialGrades(): PackGrade[] {
  return [
    grade(
      'physik-klasse-6',
      'Klasse 6',
      'Klasse 6',
      'Licht, Körper und Bewegung, Temperatur, einfache Stromkreise.',
      ['Licht', 'Körper', 'Temperatur', 'Stromkreis', 'Wärme'],
      [
        area('lb1', 'Licht und seine Eigenschaften', 17, [
          topic('ph-k6-lb1-lichtquellen', 'Lichtquellen und beleuchtete Körper', ['Lichtquelle'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic('ph-k6-lb1-lichtverschmutzung', 'Lichtverschmutzung und intelligentes Licht', [
            'Lichtverschmutzung',
            'Kunstlicht',
          ]),
          topic('ph-k6-lb1-lichtdurchlaessigkeit', 'Lichtdurchlässige und lichtundurchlässige Körper', [
            'Lichtdurchlässig',
            'Transparent',
          ]),
          topic('ph-k6-lb1-ausbreitung', 'Geradlinige Ausbreitung', ['Licht', 'Strahl'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic('ph-k6-lb1-schatten', 'Schatten und Lichtquelle', ['Licht', 'Schatten'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic('ph-k6-lb1-kernschatten', 'Kern- und Halbschatten', ['Kernschatten', 'Halbschatten'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic('ph-k6-lb1-lampenposition', 'Lampenposition einstellen', ['Schatten', 'Schieberegler'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic('ph-k6-lb1-lichtstrahl', 'Lichtstrahl tippen', ['Strahl', 'Gitter'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic('ph-k6-lb1-spiegel', 'Spiegelung am ebenen Spiegel', ['Spiegel', 'Reflexion'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic('ph-k6-lb1-winkelspiegel', 'Winkelspiegel, Periskop und Kaleidoskop', [
            'Winkelspiegel',
            'Periskop',
            'Kaleidoskop',
          ]),
          topic('ph-k6-lb1-brechung', 'Brechung und Prisma', ['Brechung', 'Prisma'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic('ph-k6-lb1-sammellinse', 'Sammellinsen: Brennpunkt und Brennweite', [
            'Sammellinse',
            'Brennweite',
            'Brennpunkt',
          ]),
          topic('ph-k6-lb1-optische-geraete', 'Einfache optische Geräte', [
            'Lupe',
            'Brille',
            'Projektor',
            'Fotoapparat',
          ]),
          topic('ph-k6-lb1-digitalbild', 'Digitale Bildentstehung', ['Bildsensor', 'Pixel', 'Digital']),
          topic('ph-k6-lb1-sonne-mond-erde', 'Sonne, Mond und Erde', ['Sonne', 'Mond', 'Finsternis'], {
            released: true,
            tasksPerRound: 10,
          }),
        ]),
        area('lb2', 'Eigenschaften und Bewegungen von Körpern', 14, [
          topic('ph-k6-lb2-teilchenmodell', 'Teilchenmodell: Atome und Moleküle', [
            'Teilchenmodell',
            'Kohäsion',
            'Adhäsion',
          ]),
          topic('ph-k6-lb2-diffusion', 'Diffusion und Brown’sche Bewegung', ['Diffusion', 'Brown']),
          topic('ph-k6-lb2-volumen', 'Volumen bestimmen', ['Volumen'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic('ph-k6-lb2-dichte', 'Dichte berechnen', ['Dichte', 'Masse', 'Volumen'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic('ph-k6-lb2-dichtestoffe', 'Dichte von Stoffen vergleichen', ['Dichte', 'Stoff'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic('ph-k6-lb2-masse', 'Masse', ['Masse', 'Einheit', 'Körper', 'Gramm', 'Kilogramm'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic(
            'ph-k6-lb2-geschwindigkeit',
            'Gleichförmige Bewegung',
            ['Geschwindigkeit', 'Strecke'],
            { released: true, tasksPerRound: 10 },
          ),
          topic('ph-k6-lb2-bewegungsarten', 'Bewegungsarten: Gerade, Kreis, Schwingung', [
            'Kreisbewegung',
            'Schwingung',
            'Bewegungsart',
          ]),
          topic('ph-k6-lb2-wegzeit', 'Weg-Zeit-Diagramm', ['Diagramm', 'Bewegung'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic(
            'ph-k6-lb2-einheiten',
            'Einheiten von v, s und t',
            ['Einheit', 'Geschwindigkeit'],
            { released: true, tasksPerRound: 10 },
          ),
          topic('ph-k6-lb2-lichtgeschwindigkeit', 'Lichtgeschwindigkeit und astronomische Entfernungen', [
            'Lichtgeschwindigkeit',
            'Lichtjahr',
          ]),
        ]),
        area('lb3', 'Temperatur und Zustand von Körpern', 14, [
          topic('ph-k6-lb3-thermometer', 'Temperatur ablesen', ['Temperatur', 'Thermometer'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic('ph-k6-lb3-teilchenbewegung', 'Temperatur und Teilchenbewegung', [
            'Teilchenbewegung',
            'Temperatur',
          ]),
          topic('ph-k6-lb3-kelvin', 'Celsius und Kelvin', ['Kelvin', 'Celsius'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic('ph-k6-lb3-ausdehnung', 'Wärmeausdehnung', ['Ausdehnung', 'Wärme'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic('ph-k6-lb3-anomalie', 'Anomalie des Wassers', ['Anomalie', 'Dichtemaximum']),
          topic('ph-k6-lb3-aggregate', 'Aggregatzustände', ['Aggregatzustand', 'Schmelzen'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic('ph-k6-lb3-schmelzen', 'Schmelzen und Sieden', ['Schmelzen', 'Sieden'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic('ph-k6-lb3-messreihe', 'Temperatur-Messreihe', ['Messreihe', 'Temperatur'], {
            released: true,
            tasksPerRound: 10,
          }),
        ]),
        area('lb4', 'Elektrische Stromkreise', 5, [
          topic('ph-k6-lb4-stromkreis', 'Offener und geschlossener Stromkreis', ['Stromkreis', 'Schalter'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic('ph-k6-lb4-leiter', 'Leiter und Nichtleiter', ['Leiter', 'Isolator'], {
            released: true,
          }),
          topic('ph-k6-lb4-symbole', 'Schaltsymbole', ['Schaltbild'], { released: true }),
          topic('ph-k6-lb4-widerstand', 'Elektrischer Widerstand', ['Widerstand', 'Ohm'], {
            released: true,
          }),
          topic('ph-k6-lb4-reiheparallel', 'Reihe und Parallel (einfach)', ['Reihe', 'Parallel'], {
            released: true,
          }),
          topic('ph-k6-lb4-und-oder', 'UND- und ODER-Schaltung', ['UND-Schaltung', 'ODER-Schaltung']),
          topic('ph-k6-lb4-gefahren', 'Gefahren und Kurzschluss', ['Kurzschluss', 'Sicherheit'], {
            released: true,
          }),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('ph-k6-lbw-sehen', 'Sehen und Fotografieren', ['Sehen', 'Fotografie'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic('ph-k6-lbw-lochkamera', 'Lochkamera', ['Lochkamera', 'Bild'], {
            released: true,
          }),
          topic('ph-k6-lbw-auge', 'Auge und Sehvorgang', ['Auge'], {
            released: true,
          }),
          topic('ph-k6-lbw-daemmung', 'Wärmedämmung', ['Wärmedämmung'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic('ph-k6-lbw-daemmstoff', 'Dämmstoffe vergleichen', ['Dämmstoff'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic('ph-k6-lbw-farben', 'Farben', ['Farben'], {
            released: true,
            tasksPerRound: 10,
          }),
          topic('ph-k6-lbw-filter', 'Farbfilter', ['Filter', 'Spektrum'], {
            released: true,
          }),
          topic('ph-k6-lbw-spektrum', 'Spektrum und Prisma', ['Spektrum', 'Prisma'], {
            released: true,
            tasksPerRound: 10,
          }),
        ]),
      ],
    ),
    grade(
      'physik-klasse-7',
      'Klasse 7',
      'Klasse 7',
      'Kräfte, Stromstärke und Spannung, Energiewandler.',
      ['Kraft', 'Stromstärke', 'Spannung', 'Energie'],
      [
        area('lb1', 'Kräfte', 22, [
          topic('ph-k7-lb1-kraftbegriff', 'Kraft als physikalische Größe', ['Kraft', 'Newton'], {
            released: true,
          }),
          topic('ph-k7-lb1-gewichtskraft', 'Gewichtskraft F = m·g', ['Gewichtskraft'], {
            released: true,
          }),
          topic('ph-k7-lb1-kraefte', 'Kräfte vergleichen und addieren', ['Kraft', 'Gewichtskraft'], {
            released: true,
          }),
          topic('ph-k7-lb1-feder', 'Federkraft und Hooke', ['Feder', 'Hooke'], { released: true }),
          topic('ph-k7-lb1-hebel', 'Hebelgesetz', ['Hebel', 'Hebelgesetz']),
          topic('ph-k7-lb1-reibung', 'Reibung', ['Reibung'], { released: true }),
          topic('ph-k7-lb1-magnet', 'Magnetische Kräfte', ['Magnet'], { released: true }),
          topic('ph-k7-lb1-elektrostatik', 'Elektrostatische Kräfte', ['Elektrostatik'], {
            released: true,
          }),
          topic('ph-k7-lb1-feldlinien', 'Feldlinienbilder magnetisch und elektrisch', [
            'Feldlinien',
            'Feldlinienbild',
          ]),
        ]),
        area('lb2', 'Stromstärke und Spannung in Stromkreisen', 18, [
          topic('ph-k7-lb2-leitung', 'Leitung in Metallen, Flüssigkeiten und Gasen', [
            'Ionenleitung',
            'Elektrolyt',
            'Metallleitung',
          ]),
          topic('ph-k7-lb2-stromstaerke', 'Stromstärke I', ['Stromstärke', 'Ampere'], {
            released: true,
          }),
          topic('ph-k7-lb2-spannung', 'Spannung U', ['Spannung', 'Volt'], { released: true }),
          topic('ph-k7-lb2-strom', 'Stromstärke und Spannung in Stromkreisen', ['Stromstärke', 'Spannung'], {
            released: true,
          }),
          topic('ph-k7-lb2-ohm', 'Ohmsches Gesetz', ['Ohm', 'Widerstand'], { released: true }),
          topic('ph-k7-lb2-reihe', 'Reihenschaltung', ['Reihe'], { released: true }),
          topic('ph-k7-lb2-parallel', 'Parallelschaltung', ['Parallel'], { released: true }),
          topic('ph-k7-lb2-messen', 'Strom und Spannung messen', ['Amperemeter', 'Voltmeter'], {
            released: true,
          }),
        ]),
        area('lb3', 'Energiewandler', 10, [
          topic('ph-k7-lb3-energieformen', 'Energieformen', ['Energie'], { released: true }),
          topic('ph-k7-lb3-energie', 'Energiewandler', ['Energie', 'Wandler'], { released: true }),
          topic('ph-k7-lb3-umwandlung', 'Energieumwandlungsketten', ['Umwandlung'], {
            released: true,
          }),
          topic('ph-k7-lb3-wirkungsgrad', 'Wirkungsgrad', ['Wirkungsgrad'], { released: true }),
          topic('ph-k7-lb3-leistung', 'Leistung P = E/t', ['Leistung'], { released: true }),
          topic('ph-k7-lb3-sparen', 'Energie sparen', ['Energieeinsparung'], { released: true }),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('ph-k7-lbw-kraftwandler', 'Kraftwandler – früher und heute', ['Kraftwandler'], {
            released: true,
          }),
          topic('ph-k7-lbw-hebel', 'Hebelgesetz', ['Hebel'], { released: true }),
          topic('ph-k7-lbw-flasche', 'Flaschenzug', ['Flaschenzug'], { released: true }),
          topic('ph-k7-lbw-schaltungen', 'Elektrische Schaltungen', ['Schaltung'], {
            released: true,
          }),
          topic('ph-k7-lbw-klingel', 'Klingel und Wechselschaltung', ['Klingel'], {
            released: true,
          }),
          topic('ph-k7-lbw-fliegen', 'Vom Fliegen', ['Fliegen'], { released: true }),
          topic('ph-k7-lbw-auftrieb-dyn', 'Dynamischer Auftrieb', ['Auftrieb', 'Tragfläche'], {
            released: true,
          }),
        ]),
      ],
    ),
    grade(
      'physik-klasse-8',
      'Klasse 8',
      'Klasse 8',
      'Mechanik der Fluide, thermische Energie, elektrische Bauelemente, Experimentieren.',
      ['Druck', 'Wärme', 'Widerstand', 'Experiment'],
      [
        area('lb1', 'Mechanik der Flüssigkeiten und Gase', 12, [
          topic('ph-k8-lb1-druck', 'Druck p = F/A', ['Druck']),
          topic('ph-k8-lb1-hydraulik', 'Hydraulik und Pascal’sches Prinzip', [
            'Hydraulik',
            'Pascal',
            'Presse',
          ]),
          topic('ph-k8-lb1-schweredruck', 'Schweredruck in Flüssigkeiten', ['Schweredruck']),
          topic('ph-k8-lb1-fluide', 'Mechanik der Flüssigkeiten und Gase', ['Druck', 'Auftrieb']),
          topic('ph-k8-lb1-auftrieb', 'Statischer Auftrieb', ['Auftrieb', 'Archimedes']),
          topic('ph-k8-lb1-schwimmen', 'Sinken, Schweben, Schwimmen', ['Schwimmen']),
          topic('ph-k8-lb1-luftdruck', 'Luftdruck', ['Luftdruck']),
          topic('ph-k8-lb1-gasdruck', 'Druck in Gasen', ['Gasdruck', 'Kolbendruck']),
        ]),
        area('lb2', 'Thermische Energie', 15, [
          topic('ph-k8-lb2-waerme', 'Wärme und thermische Energie', ['Wärme']),
          topic('ph-k8-lb2-thermisch', 'Thermische Energie', ['Wärme', 'thermische Energie']),
          topic('ph-k8-lb2-spezwaerme', 'Spezifische Wärmekapazität', ['Wärmekapazität']),
          topic('ph-k8-lb2-umwandlungswaerme', 'Umwandlungswärme', [
            'Umwandlungswärme',
            'Schmelzwärme',
          ]),
          topic('ph-k8-lb2-leitung', 'Wärmeleitung, Strömung, Strahlung', ['Wärmeleitung']),
          topic('ph-k8-lb2-mischen', 'Mischungstemperatur', ['Mischung']),
          topic('ph-k8-lb2-klima', 'Wärme und Klima (Einblick)', ['Klima']),
          topic('ph-k8-lb2-treibhaus', 'Klimaphysik und Treibhauseffekt', [
            'Treibhauseffekt',
            'Albedo',
            'Kippelement',
          ]),
        ]),
        area('lb3', 'Eigenschaften elektrischer Bauelemente', 15, [
          topic('ph-k8-lb3-widerstand', 'Elektrischer Widerstand', ['Widerstand']),
          topic('ph-k8-lb3-widerstandgesetz', 'Widerstandsgesetz R = ρ·l/A', [
            'Widerstandsgesetz',
            'spezifischer Widerstand',
          ]),
          topic('ph-k8-lb3-bauelemente', 'Eigenschaften elektrischer Bauelemente', ['Widerstand', 'Bauelemente']),
          topic('ph-k8-lb3-kennlinie', 'U-I-Kennlinie', ['Kennlinie']),
          topic('ph-k8-lb3-ntc-ptc', 'NTC und PTC', ['NTC', 'PTC', 'Thermistor']),
          topic('ph-k8-lb3-ohmgesetz', 'Ohmsches Gesetz anwenden', ['Ohm']),
          topic('ph-k8-lb3-reihenschaltung', 'Widerstände in Reihe', ['Reihe', 'Widerstand']),
          topic('ph-k8-lb3-parallelschaltung', 'Widerstände parallel', ['Parallel', 'Widerstand']),
        ]),
        area('lb4', 'Selbstständiges Experimentieren', 8, [
          topic('ph-k8-lb4-frage', 'Forschungsfrage und Hypothese', ['Hypothese']),
          topic('ph-k8-lb4-experiment', 'Selbstständiges Experimentieren', ['Experiment', 'Praktikum']),
          topic('ph-k8-lb4-variablen', 'Unabhängige und abhängige Variable', ['Variable']),
          topic('ph-k8-lb4-messreihe', 'Messreihe auswerten', ['Messreihe']),
          topic('ph-k8-lb4-fehler', 'Messunsicherheit', ['Messfehler']),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('ph-k8-lbw-ballon', 'Vom Ballonfahren', ['Ballon']),
          topic('ph-k8-lbw-ballondichte', 'Dichte von heißer Luft', ['Dichte', 'Ballon']),
          topic('ph-k8-lbw-kuehlschrank', 'Kühlschrank und Wärmepumpe', ['Wärmepumpe']),
          topic('ph-k8-lbw-kaeltemaschine', 'Wärmefluss und Arbeit', ['Wärmepumpe']),
          topic('ph-k8-lbw-messen', 'Elektrisches Messen nichtelektrischer Größen', ['Messen']),
          topic('ph-k8-lbw-sensor', 'Sensoren', ['Sensor']),
        ]),
      ],
    ),
    grade(
      'physik-klasse-9',
      'Klasse 9',
      'Klasse 9',
      'Elektronik, Energieversorgung, Bewegungsgesetze, Praktikum.',
      ['Elektronik', 'Energieversorgung', 'Bewegung', 'Praktikum'],
      [
        area('lb1', 'Grundlagen der Elektronik', 9, [
          topic('ph-k9-lb1-diode', 'Diode', ['Diode']),
          topic('ph-k9-lb1-elektronik', 'Grundlagen der Elektronik', ['Elektronik', 'Diode']),
          topic('ph-k9-lb1-transistor', 'Transistor (Einblick)', ['Transistor']),
          topic('ph-k9-lb1-led', 'LED', ['LED']),
          topic('ph-k9-lb1-digital', 'Digitale Grundschaltungen', ['Digital']),
          topic('ph-k9-lb1-halbleiter', 'Halbleiter: Dotierung und pn-Übergang', [
            'Halbleiter',
            'Dotierung',
            'pn-Übergang',
          ]),
        ]),
        area('lb2', 'Energieversorgung', 18, [
          topic('ph-k9-lb2-kraftwerk', 'Kraftwerkskette', ['Kraftwerk']),
          topic('ph-k9-lb2-versorgung', 'Energieversorgung', ['Energieversorgung', 'Kraftwerk']),
          topic('ph-k9-lb2-wirkungsgrad', 'Wirkungsgrad von Anlagen', ['Wirkungsgrad']),
          topic('ph-k9-lb2-generator', 'Generatorprinzip', ['Generator']),
          topic('ph-k9-lb2-induktion', 'Elektromagnetische Induktion', [
            'Induktion',
            'Faraday',
            'Spule',
          ]),
          topic('ph-k9-lb2-transformator', 'Transformator und Hochspannung', [
            'Transformator',
            'Übersetzungsverhältnis',
            'Hochspannung',
          ]),
          topic('ph-k9-lb2-kernenergie', 'Kernenergie und Kernspaltung', [
            'Kernspaltung',
            'Radioaktivität',
            'Reaktor',
          ]),
          topic('ph-k9-lb2-netz', 'Energieverteilung', ['Netz']),
          topic('ph-k9-lb2-erneuerbar', 'Erneuerbare Energien', ['Erneuerbar']),
        ]),
        area('lb3', 'Bewegungsgesetze', 16, [
          topic('ph-k9-lb3-gleichfoermig', 'Gleichförmige Bewegung', ['Geschwindigkeit']),
          topic('ph-k9-lb3-bewegung', 'Bewegungsgesetze', ['Geschwindigkeit', 'Beschleunigung']),
          topic('ph-k9-lb3-beschleunigung', 'Beschleunigung', ['Beschleunigung']),
          topic('ph-k9-lb3-freiefall', 'Freier Fall', ['Fall']),
          topic('ph-k9-lb3-diagramme', 's-t- und v-t-Diagramme', ['Diagramm']),
          topic('ph-k9-lb3-newton', 'Kraft und Bewegung (Einblick)', ['Newton']),
        ]),
        area('lb4', 'Physikalisches Praktikum', 7, [
          topic('ph-k9-lb4-planung', 'Versuch planen', ['Versuch']),
          topic('ph-k9-lb4-praktikum', 'Physikalisches Praktikum', ['Praktikum']),
          topic('ph-k9-lb4-protokoll', 'Protokollieren', ['Protokoll']),
          topic('ph-k9-lb4-auswertung', 'Auswertung und Fehler', ['Auswertung']),
          topic('ph-k9-lb4-diagramm', 'Diagramm aus Messwerten', ['Diagramm']),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('ph-k9-lbw-radioaktivitaet', 'Natürliche Radioaktivität', ['Radioaktivität']),
          topic('ph-k9-lbw-strahlung', 'Alpha, Beta, Gamma', ['Strahlung']),
          topic('ph-k9-lbw-wind-sonne', 'Energie von Wind und Sonne', ['Wind', 'Sonne']),
          topic('ph-k9-lbw-solar', 'Solarzelle und Windrad', ['Solar', 'Wind']),
          topic('ph-k9-lbw-kurven', 'Bewegungen auf gekrümmten Bahnen', ['Kreisbewegung']),
          topic('ph-k9-lbw-zentrifugal', 'Zentripetalkraft', ['Zentripetalkraft']),
        ]),
      ],
    ),
    grade(
      'physik-klasse-10',
      'Klasse 10',
      'Klasse 10',
      'Schwingungen und Wellen, Kosmos, Optik, Hertzsche Wellen, Praktikum.',
      ['Schwingung', 'Welle', 'Astronomie', 'Licht', 'Hertz'],
      [
        area('lb1n', 'Newton’sche Gesetze und deren Anwendung', 7, [
          topic('ph-k10-lb1n-newton', 'Newton’sche Gesetze – Überblick', [
            'Newton',
            'Trägheit',
            'F=ma',
          ]),
          topic('ph-k10-lb1n-traegheit', 'Trägheit und Masse', ['Trägheit', 'Masse']),
          topic('ph-k10-lb1n-fma', 'Kraft und Beschleunigung F = m·a', ['Kraft', 'Beschleunigung']),
          topic('ph-k10-lb1n-verkehr', 'Bremsen und Sicherheit im Straßenverkehr', [
            'Bremsweg',
            'Gurt',
            'Knautschzone',
          ]),
          topic('ph-k10-lb1n-superposition', 'Kräftezusammensetzung und schiefe Ebene', [
            'Resultierende',
            'Hangabtrieb',
          ]),
        ]),
        area('lb1', 'Mechanische Schwingungen und Wellen', 10, [
          topic('ph-k10-lb1-amplitude', 'Amplitude und Periodendauer', ['Amplitude', 'Periode']),
          topic('ph-k10-lb1-schwingung', 'Mechanische Schwingungen und Wellen', ['Schwingung', 'Welle']),
          topic('ph-k10-lb1-frequenz', 'Frequenz f = 1/T', ['Frequenz']),
          topic('ph-k10-lb1-pendel', 'Fadenpendel', ['Pendel']),
          topic('ph-k10-lb1-feder', 'Federschwinger', ['Feder']),
          topic('ph-k10-lb1-welle', 'Wellengeschwindigkeit', ['Welle']),
        ]),
        area('lb2', 'Kosmos, Erde und Mensch', 18, [
          topic('ph-k10-lb2-sonnensystem', 'Sonnensystem', ['Planet', 'Sonne']),
          topic('ph-k10-lb2-kosmos', 'Kosmos, Erde und Mensch', ['Astronomie', 'Kosmos']),
          topic('ph-k10-lb2-mond', 'Mond und Finsternisse', ['Mond', 'Finsternis']),
          topic('ph-k10-lb2-jahreszeiten', 'Jahreszeiten', ['Jahreszeiten']),
          topic('ph-k10-lb2-lichtjahr', 'Entfernungen und Lichtjahr', ['Lichtjahr']),
          topic('ph-k10-lb2-beobachtung', 'Astronomische Beobachtung', ['Beobachtung']),
          topic('ph-k10-lb2-gravitation', 'Gravitationsgesetz', [
            'Gravitation',
            'Newton',
            'Anziehung',
          ]),
          topic('ph-k10-lb2-kepler', 'Kepler’sche Gesetze', ['Kepler', 'Planetenbahn']),
          topic('ph-k10-lb2-weltbild', 'Geo- und heliozentrisches Weltbild', [
            'Kopernikus',
            'Galilei',
            'Weltbild',
          ]),
          topic('ph-k10-lb2-hrd', 'Hertzsprung-Russell-Diagramm', [
            'HRD',
            'Hauptreihe',
            'Sternentwicklung',
          ]),
        ]),
        area('lb3', 'Licht als Strahl und Welle', 9, [
          topic('ph-k10-lb3-strahl', 'Licht als Strahl', ['Strahloptik']),
          topic('ph-k10-lb3-licht', 'Licht als Strahl und Welle', ['Optik', 'Licht']),
          topic('ph-k10-lb3-brechung', 'Brechung', ['Brechung']),
          topic('ph-k10-lb3-totalreflexion', 'Totalreflexion und Lichtleitkabel', [
            'Totalreflexion',
            'Lichtleitkabel',
            'Grenzwinkel',
          ]),
          topic('ph-k10-lb3-linse', 'Sammellinse', ['Linse']),
          topic('ph-k10-lb3-interferenz', 'Interferenz (Einblick)', ['Interferenz']),
          topic('ph-k10-lb3-beugung', 'Beugung am Spalt und Gitter', [
            'Beugung',
            'Doppelspalt',
            'Gitter',
          ]),
          topic('ph-k10-lb3-dispersion', 'Dispersion und Spektrum', [
            'Dispersion',
            'Spektrum',
            'Farbzerlegung',
          ]),
          topic('ph-k10-lb3-cf', 'c = λ·f', ['Wellenlänge', 'Frequenz']),
          topic('ph-k10-lb3-em-spektrum', 'Elektromagnetisches Spektrum', [
            'EM-Spektrum',
            'Infrarot',
            'Röntgen',
            'Mobilfunk',
          ]),
        ]),
        area('lb4', 'Hertzsche Wellen', 7, [
          topic('ph-k10-lb4-em', 'Elektromagnetische Wellen', ['EM-Welle']),
          topic('ph-k10-lb4-hertz', 'Hertzsche Wellen', ['Elektromagnetische Wellen']),
          topic('ph-k10-lb4-spektrum', 'EM-Spektrum', ['Spektrum']),
          topic('ph-k10-lb4-radio', 'Radio und Modulation (Einblick)', ['Radio']),
          topic('ph-k10-lb4-antennen', 'Sender und Empfänger', ['Antenne']),
        ]),
        area('lb5', 'Physikalisches Praktikum', 6, [
          topic('ph-k10-lb5-planung', 'Versuch planen', ['Versuch']),
          topic('ph-k10-lb5-praktikum', 'Physikalisches Praktikum', ['Praktikum']),
          topic('ph-k10-lb5-messung', 'Messen und protokollieren', ['Messung']),
          topic('ph-k10-lb5-auswertung', 'Auswertung', ['Auswertung']),
          topic('ph-k10-lb5-fehler', 'Fehlerabschätzung', ['Fehler']),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('ph-k10-lbw-fernrohr', 'Fernrohre', ['Fernrohr']),
          topic('ph-k10-lbw-teleskop', 'Fernrohrtypen', ['Teleskop']),
          topic('ph-k10-lbw-medien', 'Kommunikation mit elektronischen Medien', ['Medien']),
          topic('ph-k10-lbw-digital', 'Analog und digital', ['Digital']),
          topic('ph-k10-lbw-fernsehen', 'Fernsehbildtechnik', ['Fernsehen']),
          topic('ph-k10-lbw-pixel', 'Bildpunkte und Auflösung', ['Pixel']),
        ]),
      ],
    ),
  ]
}
