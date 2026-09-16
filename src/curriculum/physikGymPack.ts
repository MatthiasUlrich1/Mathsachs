import {
  GYM_SACHSEN_PHYSIK_PACK_ID,
  packContentHash,
  type CurriculumPack,
  type PackArea,
  type PackGrade,
  type PackTopic,
} from './pack'

const topic = (id: string, title: string, keywords?: string[]): PackTopic => ({
  id,
  title,
  pointsPerTask: 10,
  hint: 'Tippe oder gib die Antwort ein. Erklärung erscheint nach dem Prüfen.',
  ...(keywords?.length ? { keywords } : {}),
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

/** Official Gymnasium Sachsen Physik outline (Klassen 6–10, JGS 11/12 Gk/Lk). */
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
          topic('ph-k6-lb1-schatten', 'Schatten und Lichtquelle', ['Licht', 'Schatten']),
          topic('ph-k6-lb1-lampenposition', 'Lampenposition einstellen', [
            'Schatten',
            'Schieberegler',
          ]),
          topic('ph-k6-lb1-lichtstrahl', 'Lichtstrahl tippen', ['Strahl', 'Gitter']),
          topic('ph-k6-lb1-spiegel', 'Spiegelung am ebenen Spiegel', ['Spiegel', 'Reflexion']),
          topic('ph-k6-lb1-ausbreitung', 'Geradlinige Ausbreitung', ['Licht', 'Strahl']),
        ]),
        area('lb2', 'Eigenschaften und Bewegungen von Körpern', 14, [
          topic('ph-k6-lb2-masse', 'Masse vergleichen', ['Masse', 'Körper']),
          topic('ph-k6-lb2-dichte', 'Dichte berechnen', ['Dichte', 'Masse', 'Volumen']),
          topic('ph-k6-lb2-geschwindigkeit', 'Gleichförmige Bewegung', ['Geschwindigkeit', 'Strecke']),
        ]),
        area('lb3', 'Temperatur und Zustand von Körpern', 14, [
          topic('ph-k6-lb3-thermometer', 'Temperatur ablesen', ['Temperatur', 'Thermometer']),
          topic('ph-k6-lb3-kelvin', 'Celsius und Kelvin', ['Kelvin', 'Celsius']),
          topic('ph-k6-lb3-aggregate', 'Aggregatzustände', ['Aggregatzustand', 'Schmelzen']),
        ]),
        area('lb4', 'Elektrische Stromkreise', 5, [
          topic('ph-k6-lb4-stromkreis', 'Offener und geschlossener Stromkreis', ['Stromkreis', 'Schalter']),
          topic('ph-k6-lb4-leiter', 'Leiter und Nichtleiter', ['Leiter', 'Isolator']),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('ph-k6-lbw-sehen', 'Sehen und Fotografieren', ['Sehen', 'Fotografie']),
          topic('ph-k6-lbw-daemmung', 'Wärmedämmung', ['Wärmedämmung']),
          topic('ph-k6-lbw-farben', 'Farben', ['Farben']),
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
          topic('ph-k7-lb1-kraefte', 'Kräfte', ['Kraft', 'Gewichtskraft']),
        ]),
        area('lb2', 'Stromstärke und Spannung in Stromkreisen', 18, [
          topic('ph-k7-lb2-strom', 'Stromstärke und Spannung in Stromkreisen', ['Stromstärke', 'Spannung']),
        ]),
        area('lb3', 'Energiewandler', 10, [
          topic('ph-k7-lb3-energie', 'Energiewandler', ['Energie', 'Wandler']),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('ph-k7-lbw-kraftwandler', 'Kraftwandler – früher und heute', ['Kraftwandler']),
          topic('ph-k7-lbw-schaltungen', 'Elektrische Schaltungen', ['Schaltung']),
          topic('ph-k7-lbw-fliegen', 'Vom Fliegen', ['Fliegen']),
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
          topic('ph-k8-lb1-fluide', 'Mechanik der Flüssigkeiten und Gase', ['Druck', 'Auftrieb']),
        ]),
        area('lb2', 'Thermische Energie', 15, [
          topic('ph-k8-lb2-thermisch', 'Thermische Energie', ['Wärme', 'thermische Energie']),
        ]),
        area('lb3', 'Eigenschaften elektrischer Bauelemente', 15, [
          topic('ph-k8-lb3-bauelemente', 'Eigenschaften elektrischer Bauelemente', ['Widerstand', 'Bauelemente']),
        ]),
        area('lb4', 'Selbstständiges Experimentieren', 8, [
          topic('ph-k8-lb4-experiment', 'Selbstständiges Experimentieren', ['Experiment', 'Praktikum']),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('ph-k8-lbw-ballon', 'Vom Ballonfahren', ['Ballon']),
          topic('ph-k8-lbw-kuehlschrank', 'Kühlschrank und Wärmepumpe', ['Wärmepumpe']),
          topic('ph-k8-lbw-messen', 'Elektrisches Messen nichtelektrischer Größen', ['Messen']),
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
          topic('ph-k9-lb1-elektronik', 'Grundlagen der Elektronik', ['Elektronik', 'Diode']),
        ]),
        area('lb2', 'Energieversorgung', 18, [
          topic('ph-k9-lb2-versorgung', 'Energieversorgung', ['Energieversorgung', 'Kraftwerk']),
        ]),
        area('lb3', 'Bewegungsgesetze', 16, [
          topic('ph-k9-lb3-bewegung', 'Bewegungsgesetze', ['Geschwindigkeit', 'Beschleunigung']),
        ]),
        area('lb4', 'Physikalisches Praktikum', 7, [
          topic('ph-k9-lb4-praktikum', 'Physikalisches Praktikum', ['Praktikum']),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('ph-k9-lbw-radioaktivitaet', 'Natürliche Radioaktivität', ['Radioaktivität']),
          topic('ph-k9-lbw-wind-sonne', 'Energie von Wind und Sonne', ['Wind', 'Sonne']),
          topic('ph-k9-lbw-kurven', 'Bewegungen auf gekrümmten Bahnen', ['Kreisbewegung']),
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
        area('lb1', 'Mechanische Schwingungen und Wellen', 10, [
          topic('ph-k10-lb1-schwingung', 'Mechanische Schwingungen und Wellen', ['Schwingung', 'Welle']),
        ]),
        area('lb2', 'Kosmos, Erde und Mensch', 18, [
          topic('ph-k10-lb2-kosmos', 'Kosmos, Erde und Mensch', ['Astronomie', 'Kosmos']),
        ]),
        area('lb3', 'Licht als Strahl und Welle', 9, [
          topic('ph-k10-lb3-licht', 'Licht als Strahl und Welle', ['Optik', 'Licht']),
        ]),
        area('lb4', 'Hertzsche Wellen', 7, [
          topic('ph-k10-lb4-hertz', 'Hertzsche Wellen', ['Elektromagnetische Wellen']),
        ]),
        area('lb5', 'Physikalisches Praktikum', 6, [
          topic('ph-k10-lb5-praktikum', 'Physikalisches Praktikum', ['Praktikum']),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('ph-k10-lbw-fernrohr', 'Fernrohre', ['Fernrohr']),
          topic('ph-k10-lbw-medien', 'Kommunikation mit elektronischen Medien', ['Medien']),
          topic('ph-k10-lbw-fernsehen', 'Fernsehbildtechnik', ['Fernsehen']),
        ]),
      ],
    ),
    grade(
      'physik-jgs-11-gk',
      'Jahrgangsstufe 11 · Grundkurs',
      'JGS 11 · Grundkurs',
      'Energieerhaltung, Kinematik/Dynamik, Kondensator und Spule, geladene Teilchen in Feldern.',
      ['Energie', 'Kinematik', 'Kondensator', 'Feld'],
      [
        area('lb1', 'Erhaltung der Energie', 10, [
          topic('ph-j11gk-lb1-energie', 'Erhaltung der Energie', ['Energieerhaltung']),
        ]),
        area('lb2', 'Anwendung der Kinematik und Dynamik', 14, [
          topic('ph-j11gk-lb2-mechanik', 'Anwendung der Kinematik und Dynamik', ['Kinematik', 'Dynamik']),
        ]),
        area('lb3', 'Kondensator und Spule – Praktikum', 10, [
          topic('ph-j11gk-lb3-praktikum', 'Kondensator und Spule – Praktikum', ['Kondensator', 'Spule']),
        ]),
        area('lb4', 'Geladene Teilchen in elektrischen und magnetischen Feldern', 18, [
          topic('ph-j11gk-lb4-felder', 'Geladene Teilchen in Feldern', ['Feld', 'Ladung']),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('ph-j11gk-lbw-konstanten', 'Bestimmung elementarer Naturkonstanten', ['Naturkonstante']),
          topic('ph-j11gk-lbw-exkursion', 'Physikalisch-technische Exkursion', ['Exkursion']),
          topic('ph-j11gk-lbw-anwendungen', 'Technische Anwendungen von Spulen und Kondensatoren', ['Anwendung']),
          topic('ph-j11gk-lbw-relativitaet', 'Relativität von Zeit und Raum', ['Relativität']),
        ]),
      ],
    ),
    grade(
      'physik-jgs-12-gk',
      'Jahrgangsstufe 12 · Grundkurs',
      'JGS 12 · Grundkurs',
      'Optik, Quantenphysik, Strahlung aus Atomhülle und Atomkern.',
      ['Optik', 'Quantenphysik', 'Atom', 'Strahlung'],
      [
        area('lb1', 'Welleneigenschaften des Lichts', 8, [
          topic('ph-j12gk-lb1-licht', 'Welleneigenschaften des Lichts', ['Lichtwelle']),
        ]),
        area('lb2', 'Praktikum Optik', 6, [
          topic('ph-j12gk-lb2-optik', 'Praktikum Optik', ['Optik', 'Praktikum']),
        ]),
        area('lb3', 'Grundlagen der Quantenphysik', 10, [
          topic('ph-j12gk-lb3-quanten', 'Grundlagen der Quantenphysik', ['Quantenphysik']),
        ]),
        area('lb4', 'Strahlung aus Atomhülle und Atomkern', 20, [
          topic('ph-j12gk-lb4-strahlung', 'Strahlung aus Atomhülle und Atomkern', ['Atom', 'Kernstrahlung']),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('ph-j12gk-lbw-anwendungen', 'Anwendungen der Physik', ['Anwendung']),
          topic('ph-j12gk-lbw-optik', 'Optische Phänomene', ['Optik']),
          topic('ph-j12gk-lbw-akustik', 'Akustik', ['Akustik']),
        ]),
      ],
    ),
    grade(
      'physik-jgs-11-lk',
      'Jahrgangsstufe 11 · Leistungskurs',
      'JGS 11 · Leistungskurs',
      'Erhaltungssätze, Mechanik, Felder, Induktion, Praktikum.',
      ['Erhaltungssatz', 'Newton', 'Feld', 'Induktion'],
      [
        area('lb1', 'Erhaltungssätze und ihre Anwendungen', 20, [
          topic('ph-j11lk-lb1-erhaltung', 'Erhaltungssätze und ihre Anwendungen', ['Impuls', 'Energie']),
        ]),
        area('lb2', 'Kinematik geradliniger Bewegungen', 12, [
          topic('ph-j11lk-lb2-kinematik', 'Kinematik geradliniger Bewegungen', ['Kinematik']),
        ]),
        area('lb3', 'Newtonsche Gesetze und deren Anwendungen', 8, [
          topic('ph-j11lk-lb3-newton', 'Newtonsche Gesetze und deren Anwendungen', ['Newton']),
        ]),
        area('lb4', 'Modellbildung und Simulation', 8, [
          topic('ph-j11lk-lb4-modell', 'Modellbildung und Simulation', ['Modell', 'Simulation']),
        ]),
        area('lb5', 'Krummlinige Bewegungen', 10, [
          topic('ph-j11lk-lb5-kurven', 'Krummlinige Bewegungen', ['Kreisbewegung']),
        ]),
        area('lb6', 'Einblick in die Relativitätstheorie', 8, [
          topic('ph-j11lk-lb6-relativitaet', 'Einblick in die Relativitätstheorie', ['Relativität']),
        ]),
        area('lb7', 'Elektrisches Feld', 14, [
          topic('ph-j11lk-lb7-efeld', 'Elektrisches Feld', ['Elektrisches Feld']),
        ]),
        area('lb8', 'Magnetisches Feld', 10, [
          topic('ph-j11lk-lb8-mfeld', 'Magnetisches Feld', ['Magnetisches Feld']),
        ]),
        area('lb9', 'Geladene Teilchen in Feldern', 12, [
          topic('ph-j11lk-lb9-teilchen', 'Geladene Teilchen in Feldern', ['Lorentzkraft']),
        ]),
        area('lb10', 'Elektromagnetische Induktion', 15, [
          topic('ph-j11lk-lb10-induktion', 'Elektromagnetische Induktion', ['Induktion']),
        ]),
        area('lb11', 'Physikalisches Praktikum', 13, [
          topic('ph-j11lk-lb11-praktikum', 'Physikalisches Praktikum', ['Praktikum']),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('ph-j11lk-lbw-fahren', 'Physik des Fahrens', ['Fahren']),
          topic('ph-j11lk-lbw-halbleiter', 'Leitungsvorgänge in Halbleitern', ['Halbleiter']),
          topic('ph-j11lk-lbw-messen', 'Messen und Modellieren', ['Messen']),
        ]),
      ],
    ),
    grade(
      'physik-jgs-12-lk',
      'Jahrgangsstufe 12 · Leistungskurs',
      'JGS 12 · Leistungskurs',
      'Schwingungen und Wellen, Quanten- und Atomphysik, Thermodynamik.',
      ['Schwingung', 'Welle', 'Quanten', 'Atomkern', 'Thermodynamik'],
      [
        area('lb1', 'Mechanische und elektromagnetische Schwingungen', 22, [
          topic('ph-j12lk-lb1-schwingung', 'Mechanische und elektromagnetische Schwingungen', ['Schwingung']),
        ]),
        area('lb2', 'Wellen als vielschichtige Naturerscheinung', 15, [
          topic('ph-j12lk-lb2-wellen', 'Wellen als vielschichtige Naturerscheinung', ['Welle']),
        ]),
        area('lb4', 'Grundlagen der Quantenphysik', 15, [
          topic('ph-j12lk-lb4-quanten', 'Grundlagen der Quantenphysik', ['Quantenphysik']),
        ]),
        area('lb5', 'Grundlagen der Atomphysik', 18, [
          topic('ph-j12lk-lb5-atom', 'Grundlagen der Atomphysik', ['Atomphysik']),
        ]),
        area('lb6', 'Eigenschaften der Atomkerne', 17, [
          topic('ph-j12lk-lb6-kerne', 'Eigenschaften der Atomkerne', ['Kernphysik']),
        ]),
        area('lb7', 'Thermodynamik', 15, [
          topic('ph-j12lk-lb7-thermo', 'Thermodynamik', ['Thermodynamik']),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('ph-j12lk-lbw-chaos', 'Deterministisches Chaos', ['Chaos']),
          topic('ph-j12lk-lbw-gas', 'Kinetische Gastheorie', ['Gastheorie']),
          topic('ph-j12lk-lbw-anwendungen', 'Anwendungen der Physik', ['Anwendung']),
        ]),
      ],
    ),
  ]
}

export function buildGymSachsenPhysikPack(): CurriculumPack {
  const official = buildPhysikGymOfficialGrades()
  const pack: Omit<CurriculumPack, 'contentHash'> = {
    id: GYM_SACHSEN_PHYSIK_PACK_ID,
    title: 'Gymnasium Sachsen · Physik',
    region: 'Sachsen',
    school: 'Gymnasium',
    subject: 'Physik',
    version: '1.3.0',
    changelog:
      'Klasse 6: Spiegelweg tippen, Messreihe sortieren, Dichte-Slider, Stromkreis-/Farbfilter-Mehrfachauswahl, Licht interaktiv.',
    official,
    extras: [],
  }
  return { ...pack, contentHash: packContentHash(official, []) }
}
