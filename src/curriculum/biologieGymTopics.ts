/**
 * Gymnasium Sachsen · Biologie — Lehrplan-Outline (lplanid=522).
 * K5 Wirbeltiere mit Spielbaren Themen (released:false → Entwickler);
 * übrige Klassen: Outline/Stub. Quelle:
 * https://www.schulportal.sachsen.de/lplandb/lehrplan/522
 */
import type { PackArea, PackGrade, PackTopic } from './pack'

const topic = (
  id: string,
  title: string,
  keywords?: string[],
  opts?: { tasksPerRound?: number; released?: boolean },
): PackTopic => ({
  id,
  title,
  pointsPerTask: 10,
  hint: 'Tippe oder wähle die Antwort. Erklärung erscheint nach dem Prüfen.',
  released: opts?.released ?? false,
  tasksPerRound: opts?.tasksPerRound ?? 8,
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
  subjectTitle: 'Biologie',
  gradeTitle,
  description,
  searchHints,
  areas,
})

/** Official Lernbereiche laut Lehrplan Gymnasium Biologie (Sachsen). */
export function buildBiologieGymOfficialGrades(): PackGrade[] {
  return [
    grade(
      'biologie-klasse-5',
      'Klasse 5',
      'Klasse 5',
      'Wirbeltiere in ihren Lebensräumen: Merkmale, Vielfalt, Angepasstheit und Schutz.',
      [
        'Wirbeltiere',
        'Fische',
        'Lurche',
        'Kriechtiere',
        'Vögel',
        'Säugetiere',
        'Merkmale des Lebens',
      ],
      [
        area('lb1', 'Merkmale des Lebens', 3, [
          topic(
            'bi-k5-lb1-merkmale',
            'Merkmale des Lebens',
            ['Reizbarkeit', 'Stoffwechsel', 'Fortpflanzung', 'Bewegung'],
            { tasksPerRound: 10 },
          ),
        ]),
        area('lb2', 'Fische in ihren Lebensräumen', 8, [
          topic(
            'bi-k5-lb2-fische',
            'Fische – Merkmale, Lebensraum und Schutz',
            ['Kiemen', 'Flossen', 'Stromlinienform', 'Süßwasser'],
            { tasksPerRound: 12 },
          ),
        ]),
        area('lb3', 'Lurche in ihren Lebensräumen', 7, [
          topic(
            'bi-k5-lb3-lurche',
            'Lurche – Merkmale, Metamorphose und Schutz',
            ['Amphibien', 'Metamorphose', 'Hautatmung', 'Laich'],
            { tasksPerRound: 12 },
          ),
        ]),
        area('lb4', 'Kriechtiere in ihren Lebensräumen', 7, [
          topic(
            'bi-k5-lb4-kriechtiere',
            'Kriechtiere – Merkmale und Landleben',
            ['Reptilien', 'Hornschicht', 'Lungen', 'Eiablage'],
            { tasksPerRound: 12 },
          ),
        ]),
        area('lb5', 'Vögel in ihren Lebensräumen', 9, [
          topic(
            'bi-k5-lb5-voegel',
            'Vögel – Flug, Federkleid und Fortpflanzung',
            ['Federn', 'Luftsäcke', 'Schnabel', 'Nesthocker'],
            { tasksPerRound: 12 },
          ),
        ]),
        area('lb6', 'Säugetiere in ihren Lebensräumen', 13, [
          topic(
            'bi-k5-lb6-saeugetiere',
            'Säugetiere – Merkmale, Angepasstheit und Schutz',
            ['Fell', 'Säugen', 'Gebiss', 'Gleichwarm'],
            { tasksPerRound: 12 },
          ),
        ]),
        area('lb7', 'Systematisierung', 3, [
          topic(
            'bi-k5-lb7-systematik',
            'Wirbeltiere vergleichen – Struktur, Funktion, Angepasstheit',
            ['Systematik', 'Vergleich', 'Atmung', 'Körperbedeckung'],
            { tasksPerRound: 12 },
          ),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic(
            'bi-k5-lbw-winter',
            'Wirbeltiere im Winter',
            ['Winterschlaf', 'Winterruhe', 'Kältestarre', 'Vogelzug'],
            { tasksPerRound: 10 },
          ),
          topic('bi-k5-lbw-saurier', 'Kriechtiere vergangener Zeiten', [
            'Saurier',
            'Fossilien',
            'Paläontologie',
          ]),
          topic('bi-k5-lbw-haltung', 'Artgerechte Tierhaltung', [
            'Aquarium',
            'Terrarium',
            'Tierschutz',
          ]),
        ]),
      ],
    ),
    grade(
      'biologie-klasse-6',
      'Klasse 6',
      'Klasse 6',
      'Samenpflanzen, wirbellose Tiere, Wald als Lebensgemeinschaft und Zellen.',
      ['Samenpflanzen', 'Wirbellose', 'Wald', 'Zelle'],
      [
        area('lb1', 'Samenpflanzen', 10, [
          topic('bi-k6-lb1-samenpflanzen', 'Samenpflanzen', ['Blüte', 'Samen', 'Frucht']),
        ]),
        area('lb2', 'Wirbellose Tiere in ihren Lebensräumen', 16, [
          topic('bi-k6-lb2-wirbellose', 'Wirbellose Tiere in ihren Lebensräumen', [
            'Insekten',
            'Spinnen',
            'Wirbellose',
          ]),
        ]),
        area('lb3', 'Systematisierung', 4, [
          topic('bi-k6-lb3-systematik', 'Systematisierung wirbelloser Tiere und Wirbeltiere', [
            'Vergleich',
            'Systematik',
          ]),
        ]),
        area('lb4', 'Wald als Lebensgemeinschaft', 10, [
          topic('bi-k6-lb4-wald', 'Wald als Lebensgemeinschaft', ['Ökosystem', 'Wald', 'Nahrungsnetz']),
        ]),
        area('lb5', 'Pflanzliche und tierische Zellen', 10, [
          topic('bi-k6-lb5-zellen', 'Pflanzliche und tierische Zellen', [
            'Zelle',
            'Zellkern',
            'Mikroskop',
          ]),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('bi-k6-lbw-weichtiere', 'Weichtiere', ['Schnecke', 'Muschel']),
          topic('bi-k6-lbw-heilen', 'Pflanzen helfen heilen', ['Heilpflanze']),
          topic('bi-k6-lbw-pfuetze', 'Leben in der Pfütze', ['Kleinstlebewesen']),
        ]),
      ],
    ),
    grade(
      'biologie-klasse-7',
      'Klasse 7',
      'Klasse 7',
      'Bakterien und Viren, Blutkreislauf, Ernährung und Bewegungssystem des Menschen.',
      ['Immunbiologie', 'Verdauung', 'Skelett', 'Bakterien'],
      [
        area('lb1', 'Bakterien und Viren', 4, [
          topic('bi-k7-lb1-mikroben', 'Bakterien und Viren', ['Bakterien', 'Viren', 'Hygiene']),
        ]),
        area('lb2', 'Blutkreislauf des Menschen und Immunbiologie', 7, [
          topic('bi-k7-lb2-blut', 'Blutkreislauf und Immunbiologie', [
            'Herz',
            'Blut',
            'Immunsystem',
          ]),
        ]),
        area('lb3', 'Ernährung, Verdauung und Ausscheidung beim Menschen', 10, [
          topic('bi-k7-lb3-ernaehrung', 'Ernährung, Verdauung und Ausscheidung', [
            'Verdauung',
            'Nährstoffe',
          ]),
        ]),
        area('lb4', 'Stütz- und Bewegungssystem des Menschen', 4, [
          topic('bi-k7-lb4-skelett', 'Stütz- und Bewegungssystem', ['Knochen', 'Muskeln', 'Gelenke']),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('bi-k7-lbw-ernaehrung-persoenlichkeit', 'Ernährung und Persönlichkeit', [
            'Ernährung',
          ]),
          topic('bi-k7-lbw-fitness', 'Fitness und Gesundheit', ['Fitness']),
          topic('bi-k7-lbw-mikroben', 'Mikroben und ihre Bedeutung', ['Mikroben']),
        ]),
      ],
    ),
    grade(
      'biologie-klasse-8',
      'Klasse 8',
      'Klasse 8',
      'Sinnesorgane, Nerven- und Hormonsystem sowie Sexualität des Menschen.',
      ['Sinne', 'Hormone', 'Nervensystem', 'Sexualität'],
      [
        area('lb1', 'Sinnesorgane, Nerven- und Hormonsystem des Menschen', 14, [
          topic('bi-k8-lb1-sinne', 'Sinnesorgane, Nerven- und Hormonsystem', [
            'Sinne',
            'Nerven',
            'Hormone',
          ]),
        ]),
        area('lb2', 'Sexualität des Menschen', 11, [
          topic('bi-k8-lb2-sexualitaet', 'Sexualität des Menschen', [
            'Sexualität',
            'Verantwortung',
          ]),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('bi-k8-lbw-stress', 'Stress und Stressbewältigung', ['Stress']),
          topic('bi-k8-lbw-sinne', 'Erleben mit allen Sinnen', ['Wahrnehmung']),
          topic('bi-k8-lbw-erste-hilfe', 'Erste Hilfe', ['Erste Hilfe']),
        ]),
      ],
    ),
    grade(
      'biologie-klasse-9',
      'Klasse 9',
      'Klasse 9',
      'Anatomie und Physiologie der Samenpflanzen sowie Zusammenhänge im Ökosystem.',
      ['Pflanzenphysiologie', 'Ökosystem', 'Fotosynthese'],
      [
        area('lb1', 'Anatomie und Physiologie der Samenpflanzen', 25, [
          topic('bi-k9-lb1-pflanzen', 'Anatomie und Physiologie der Samenpflanzen', [
            'Fotosynthese',
            'Transpiration',
          ]),
        ]),
        area('lb2', 'Zusammenhänge im Ökosystem', 25, [
          topic('bi-k9-lb2-oekosystem', 'Zusammenhänge im Ökosystem', [
            'Ökosystem',
            'Stoffkreislauf',
          ]),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('bi-k9-lbw-wiese', 'Mikrokosmos Wiese', ['Wiese']),
          topic('bi-k9-lbw-pilze', 'Mannigfaltigkeit der Pilze', ['Pilze']),
          topic('bi-k9-lbw-bier', 'Von der Gerste zum Bier', ['Gärung']),
        ]),
      ],
    ),
    grade(
      'biologie-klasse-10',
      'Klasse 10',
      'Klasse 10',
      'Genetik, Entstehung der Artenvielfalt und Stammesgeschichte des Menschen.',
      ['Genetik', 'Evolution', 'Artenvielfalt', 'Mensch'],
      [
        area('lb1', 'Genetik', 25, [
          topic('bi-k10-lb1-genetik', 'Genetik', ['Mendel', 'DNA', 'Vererbung']),
        ]),
        area('lb2', 'Entstehung der Artenvielfalt', 16, [
          topic('bi-k10-lb2-artenvielfalt', 'Entstehung der Artenvielfalt', [
            'Evolution',
            'Selektion',
          ]),
        ]),
        area('lb3', 'Stammesgeschichte des Menschen', 9, [
          topic('bi-k10-lb3-mensch', 'Stammesgeschichte des Menschen', [
            'Hominiden',
            'Evolution',
          ]),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('bi-k10-lbw-leben', 'Entstehung des Lebens auf der Erde', ['Ursuppe']),
          topic('bi-k10-lbw-lernen', 'Lernen und Gedächtnis', ['Gedächtnis']),
        ]),
      ],
    ),
    grade(
      'biologie-jgs-11-12-gk',
      'Jahrgangsstufe 11/12 (Grundkurs)',
      'Jahrgangsstufe 11/12 (Grundkurs)',
      'Zellbiologie, Stoffwechsel, Ökologie, Genetik und Biodiversität (Grundkurs).',
      ['Zelle', 'Dissimilation', 'Ökologie', 'Genetik', 'Biodiversität'],
      [
        area('lb1', 'Zellen, Gewebe und Organe', 24, [
          topic('bi-gk11-lb1-zellen', 'Zellen, Gewebe und Organe', ['Differenzierung', 'Zelle']),
        ]),
        area('lb2', 'Assimilation und Dissimilation', 15, [
          topic('bi-gk11-lb2-stoffwechsel', 'Assimilation und Dissimilation', [
            'Fotosynthese',
            'Zellatmung',
          ]),
        ]),
        area('lb3', 'Ökologie und Nachhaltigkeit', 13, [
          topic('bi-gk11-lb3-oekologie', 'Ökologie und Nachhaltigkeit', [
            'Nachhaltigkeit',
            'Ökologie',
          ]),
        ]),
        area('lb4', 'Grundlagen, Anwendungen und Perspektiven der Genetik', 18, [
          topic('bi-gk12-lb1-genetik', 'Genetik – Grundlagen und Perspektiven', [
            'Gentechnik',
            'DNA',
          ]),
        ]),
        area('lb5', 'Kommunikation zwischen Zellen', 10, [
          topic('bi-gk12-lb2-kommunikation', 'Kommunikation zwischen Zellen', [
            'Signal',
            'Rezeptor',
          ]),
        ]),
        area('lb6', 'Biodiversität und ihre Entstehung', 14, [
          topic('bi-gk12-lb3-biodiversitaet', 'Biodiversität und ihre Entstehung', [
            'Biodiversität',
            'Evolution',
          ]),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('bi-gk-lbw-wueste', 'Leben in der Wüste', ['Wüste']),
          topic('bi-gk-lbw-energie', 'Energiehaushalt von Mensch und Tier', ['Energie']),
          topic('bi-gk-lbw-fliesgewaesser', 'Fließgewässer', ['Fluss']),
          topic('bi-gk-lbw-krebs', 'Krebs', ['Tumor']),
          topic('bi-gk-lbw-nerven', 'Nervensysteme', ['Nerven']),
          topic('bi-gk-lbw-verhalten', 'Verhaltensbiologisches Praktikum', ['Verhalten']),
          topic('bi-gk-lbw-gentechnik', 'Grüne Gentechnik', ['Gentechnik']),
        ]),
      ],
    ),
    grade(
      'biologie-jgs-11-lk',
      'Jahrgangsstufe 11 (Leistungskurs)',
      'Jahrgangsstufe 11 (Leistungskurs)',
      'Vertiefte Zellbiologie, Stoffwechsel sowie Ökologie und Nachhaltigkeit.',
      ['Zelle', 'Stoffwechsel', 'Ökologie'],
      [
        area('lb1', 'Zellen, Gewebe und Organe', 55, [
          topic('bi-lk11-lb1-zellen', 'Zellen, Gewebe und Organe (Lk)', [
            'Differenzierung',
            'Zelle',
          ]),
        ]),
        area('lb2', 'Assimilation und Dissimilation', 40, [
          topic('bi-lk11-lb2-stoffwechsel', 'Assimilation und Dissimilation (Lk)', [
            'Redox',
            'Stoffwechsel',
          ]),
        ]),
        area('lb3', 'Ökologie und Nachhaltigkeit', 35, [
          topic('bi-lk11-lb3-oekologie', 'Ökologie und Nachhaltigkeit (Lk)', [
            'Nachhaltigkeit',
          ]),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('bi-lk11-lbw-urban', 'Urbane Ökologie', ['Stadtökologie']),
          topic('bi-lk11-lbw-bioindikation', 'Bioindikation', ['Bioindikator']),
          topic('bi-lk11-lbw-invasiv', 'Invasive Arten', ['Neobiota']),
          topic('bi-lk11-lbw-rohstoffe', 'Nachwachsende Rohstoffe', ['Biomasse']),
          topic('bi-lk11-lbw-energie', 'Energiehaushalt des Menschen', ['Energie']),
        ]),
      ],
    ),
    grade(
      'biologie-jgs-12-lk',
      'Jahrgangsstufe 12 (Leistungskurs)',
      'Jahrgangsstufe 12 (Leistungskurs)',
      'Genetik, Zellkommunikation, Verhalten, Biodiversität und Systematisierung.',
      ['Genetik', 'Verhalten', 'Biodiversität'],
      [
        area('lb1', 'Grundlagen, Anwendungen und Perspektiven der Genetik', 34, [
          topic('bi-lk12-lb1-genetik', 'Genetik (Lk)', ['Genetik', 'Gentechnik']),
        ]),
        area('lb2', 'Kommunikation zwischen Zellen', 32, [
          topic('bi-lk12-lb2-kommunikation', 'Kommunikation zwischen Zellen (Lk)', [
            'Signalwege',
          ]),
        ]),
        area('lb3', 'Verhalten von Tier und Mensch', 10, [
          topic('bi-lk12-lb3-verhalten', 'Verhalten von Tier und Mensch', ['Ethologie']),
        ]),
        area('lb4', 'Biodiversität und ihre Entstehung', 20, [
          topic('bi-lk12-lb4-biodiversitaet', 'Biodiversität und ihre Entstehung (Lk)', [
            'Biodiversität',
          ]),
        ]),
        area('lb5', 'Systematisierung und Vernetztheit', 14, [
          topic('bi-lk12-lb5-systematik', 'Systematisierung und Vernetztheit', [
            'Vernetzung',
          ]),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('bi-lk12-lbw-allergie', 'Allergien und Autoimmunkrankheiten', ['Allergie']),
          topic('bi-lk12-lbw-stoffwechsel', 'Evolution des Stoffwechsels', ['Stoffwechsel']),
          topic('bi-lk12-lbw-gefaess', 'Praktikum Gefäßpflanzen', ['Pflanzen']),
          topic('bi-lk12-lbw-verhalten', 'Verhaltensbiologisches Praktikum', ['Verhalten']),
          topic('bi-lk12-lbw-gentechnik', 'Arbeitstechniken in der Genetik', ['Labor']),
        ]),
      ],
    ),
  ]
}

export function allBiologieTopicIds(): string[] {
  return buildBiologieGymOfficialGrades().flatMap((g) =>
    g.areas.flatMap((a) => a.topics.map((t) => t.id)),
  )
}

/** Playable K5 Wirbeltiere + Wahl topic ids (generators in biologie5.ts). */
export const BIOLOGIE_K5_WIRBELTIERE_TOPIC_IDS = [
  'bi-k5-lb1-merkmale',
  'bi-k5-lb2-fische',
  'bi-k5-lb3-lurche',
  'bi-k5-lb4-kriechtiere',
  'bi-k5-lb5-voegel',
  'bi-k5-lb6-saeugetiere',
  'bi-k5-lb7-systematik',
  'bi-k5-lbw-winter',
  'bi-k5-lbw-saurier',
  'bi-k5-lbw-haltung',
] as const
