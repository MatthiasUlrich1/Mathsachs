/**
 * Gymnasium Sachsen · Geschichte — Lehrplan-Outline (lplanid=65).
 * K6 LB1 (Römische Zivilisation) freigegeben; übrige Themen: released:false
 * (nur Entwickleransicht). Quelle: https://www.schulportal.sachsen.de/lplandb/lehrplan/65
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
  hint: 'Tippe oder gib die Antwort ein. Erklärung erscheint nach dem Prüfen.',
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
  subjectTitle: 'Geschichte',
  gradeTitle,
  description,
  searchHints,
  areas,
})

/** Official Lernbereiche + Wahlbereiche laut Lehrplan Gymnasium Geschichte (Sachsen). */
export function buildGeschichteGymOfficialGrades(): PackGrade[] {
  return [
    grade(
      'geschichte-klasse-5',
      'Klasse 5',
      'Klasse 5',
      'Orientierung in der Vergangenheit, Steinzeit und Hochkulturen, antikes Griechenland.',
      ['Steinzeit', 'Hochkultur', 'Griechenland', 'Hellenismus', 'Orientierung'],
      [
        area('lb1', 'Orientierung in der Vergangenheit', 4, [
          topic('ge-k5-lb1-orientierung', 'Orientierung in der Vergangenheit', [
            'Zeitstrahl',
            'Quellen',
          ]),
        ]),
        area('lb2', 'Von der Steinzeit zur Hochkultur – Menschen organisieren ihr Zusammenleben', 12, [
          topic('ge-k5-lb2-steinzeit-hochkultur', 'Von der Steinzeit zur Hochkultur', [
            'Steinzeit',
            'Hochkultur',
            'Zusammenleben',
          ]),
        ]),
        area('lb3', 'Zusammenleben im antiken Griechenland', 8, [
          topic('ge-k5-lb3-griechenland', 'Zusammenleben im antiken Griechenland', [
            'Griechenland',
            'Polis',
            'Antike',
          ]),
        ]),
        area('lb4', 'Längsschnitt: Mensch und Natur', 2, [
          topic('ge-k5-lb4-mensch-natur', 'Längsschnitt: Mensch und Natur', ['Mensch', 'Natur']),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('ge-k5-lbw-hellenismus-alexander', 'Hellenismus – Alexander „der Große“?', [
            'Hellenismus',
            'Alexander',
          ]),
          topic('ge-k5-lbw-hellenismus-alexandria', 'Hellenismus – Alexandria als Begegnungsstätte', [
            'Hellenismus',
            'Alexandria',
          ]),
          topic('ge-k5-lbw-hellenismus-geschichten', 'Hellenismus – Geschichten und Geschichte um Alexander', [
            'Hellenismus',
            'Alexander',
          ]),
        ]),
      ],
    ),
    grade(
      'geschichte-klasse-6',
      'Klasse 6',
      'Klasse 6',
      'Römische Zivilisation, Mittelalter, Religionen und Kulturen, Regionalgeschichte Sachsen.',
      ['Rom', 'Mittelalter', 'Religion', 'Sachsen', 'Bürger'],
      [
        area('lb1', 'Die römische Zivilisation und ihre prägende Wirkung für Europa', 18, [
          topic(
            'ge-k6-lb1-jahreszahlen',
            'Jahreszahlen (nur LB1)',
            ['753', '500', '264', '146'],
            { tasksPerRound: 20, released: true },
          ),
          topic(
            'ge-k6-lb1-chronologie',
            'Chronologie (Reihenfolge)',
            ['Zeitstrahl', 'Reihenfolge'],
            { tasksPerRound: 12, released: true },
          ),
          topic('ge-k6-lb1-anfaenge', 'Die Anfänge Roms', [
            'Romulus',
            'Etrusker',
            'Tiber',
          ], { tasksPerRound: 12, released: true }),
          topic('ge-k6-lb1-begriffe', 'Senat, Republik, Patrizier und Plebejer', [
            'Senat',
            'Patrizier',
            'Plebejer',
          ], { tasksPerRound: 12, released: true }),
          topic('ge-k6-lb1-aemter', 'Ämter und Institutionen der Republik', [
            'Konsuln',
            'Volkstribune',
            'Magistrate',
          ], { tasksPerRound: 12, released: true }),
          topic('ge-k6-lb1-punische-kriege', 'Punische Kriege – Rom und Karthago', [
            'Hannibal',
            'Karthago',
            'Scipio',
          ], { tasksPerRound: 12, released: true }),
          topic('ge-k6-lb1-weltreich', 'Vom Stadtstaat zum Weltreich (Mare Nostrum)', [
            'Weltreich',
            'Mittelmeer',
            'Karte',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb1-buergerrecht', 'Was bringt das Bürgerrecht?', [
            'Bürgerrecht',
            'Rechte',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb1-rom', 'Prägende Wirkung für Europa', [
            'Latein',
            'Recht',
            'Straßen',
          ], { tasksPerRound: 10, released: true }),
        ]),
        area('lb2', 'Herrschaft und Lebensformen im Mittelalter', 20, [
          topic('ge-k6-lb2-mittelalter', 'Herrschaft und Lebensformen im Mittelalter', [
            'Mittelalter',
            'Herrschaft',
            'Leben',
          ]),
        ]),
        area('lb3', 'Religionen und Kulturen im Mit- und Gegeneinander', 10, [
          topic('ge-k6-lb3-religionen', 'Religionen und Kulturen im Mit- und Gegeneinander', [
            'Religion',
            'Kultur',
          ]),
        ]),
        area('lb4', 'Längsschnitt: Erziehung zum Bürger', 4, [
          topic('ge-k6-lb4-buerger', 'Längsschnitt: Erziehung zum Bürger', ['Bürger', 'Erziehung']),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('ge-k6-lbw-besiedlung', 'Regionalgeschichte – Besiedlung Sachsens', [
            'Sachsen',
            'Besiedlung',
          ]),
          topic('ge-k6-lbw-kurfuerstentum', 'Regionalgeschichte – Sachsens Weg zum Kurfürstentum', [
            'Sachsen',
            'Kurfürstentum',
          ]),
          topic(
            'ge-k6-lbw-selbstverstaendnis',
            'Regionalgeschichte – Ausdrucksformen sächsischen Selbstverständnisses',
            ['Sachsen', 'Identität'],
          ),
        ]),
      ],
    ),
    grade(
      'geschichte-klasse-7',
      'Klasse 7',
      'Klasse 7',
      'Aufbruch in die Neuzeit, Absolutismus und Aufklärung, Reformation.',
      ['Neuzeit', 'Absolutismus', 'Aufklärung', 'Reformation', 'Herrschaft'],
      [
        area('lb1', 'Aufbruch in die Neuzeit – Das Welt- und Menschenbild verändert sich', 16, [
          topic('ge-k7-lb1-neuzeit', 'Aufbruch in die Neuzeit', ['Neuzeit', 'Menschenbild']),
        ]),
        area('lb2', 'Staat und Gesellschaft im Zeitalter von Absolutismus und Aufklärung', 14, [
          topic('ge-k7-lb2-absolutismus', 'Absolutismus und Aufklärung', [
            'Absolutismus',
            'Aufklärung',
          ]),
        ]),
        area('lb3', 'Formen der Beschränkung der Alleinherrschaft', 18, [
          topic('ge-k7-lb3-alleinherrschaft', 'Formen der Beschränkung der Alleinherrschaft', [
            'Herrschaft',
            'Verfassung',
          ]),
        ]),
        area('lb4', 'Längsschnitt: Legitimation von Herrschaft in der Geschichte', 4, [
          topic('ge-k7-lb4-legitimation', 'Längsschnitt: Legitimation von Herrschaft', [
            'Herrschaft',
            'Legitimation',
          ]),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('ge-k7-lbw-reformation-gerechtigkeit', 'Reformation und Anspruch auf soziale Gerechtigkeit', [
            'Reformation',
          ]),
          topic('ge-k7-lbw-reformation-sachsen', 'Sachsen – ein Kernland der Reformation', [
            'Reformation',
            'Sachsen',
          ]),
          topic('ge-k7-lbw-reformation-katholisch', 'Reformation und katholische Reform', [
            'Reformation',
            'katholisch',
          ]),
        ]),
      ],
    ),
    grade(
      'geschichte-klasse-8',
      'Klasse 8',
      'Klasse 8',
      'Einheit und Freiheit, Industrialisierung, Nationalismus und Erster Weltkrieg.',
      ['Industrialisierung', 'Nationalismus', 'Weltkrieg', 'Bürgertum', 'Kinderarbeit'],
      [
        area('lb1', 'Die Vorstellungen des deutschen Bürgertums von Einheit und Freiheit', 18, [
          topic('ge-k8-lb1-einheit-freiheit', 'Einheit und Freiheit – Vorstellungen des Bürgertums', [
            'Bürgertum',
            'Einheit',
            'Freiheit',
          ]),
        ]),
        area('lb2', 'Das Doppelgesicht des Fortschritts – Industrialisierung und die Folgen', 14, [
          topic('ge-k8-lb2-industrialisierung', 'Industrialisierung und die Folgen', [
            'Industrialisierung',
            'Fortschritt',
          ]),
        ]),
        area('lb3', 'Längsschnitt: Industrialisierung und Kinderarbeit', 6, [
          topic('ge-k8-lb3-kinderarbeit', 'Längsschnitt: Industrialisierung und Kinderarbeit', [
            'Kinderarbeit',
            'Industrialisierung',
          ]),
        ]),
        area('lb4', 'Vom übersteigerten Nationalismus zum Ersten Weltkrieg', 14, [
          topic('ge-k8-lb4-nationalismus-wk1', 'Vom Nationalismus zum Ersten Weltkrieg', [
            'Nationalismus',
            'Erster Weltkrieg',
          ]),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic(
            'ge-k8-lbw-kriegstechnik',
            'Neue Dimension von Krieg – Kriegsführung und Kriegstechnik im Ersten Weltkrieg',
            ['Erster Weltkrieg', 'Kriegstechnik'],
          ),
          topic(
            'ge-k8-lbw-massenmedien',
            'Neue Dimension von Krieg – Moderne Massenmedien im Ersten Weltkrieg',
            ['Erster Weltkrieg', 'Medien'],
          ),
        ]),
      ],
    ),
    grade(
      'geschichte-klasse-9',
      'Klasse 9',
      'Klasse 9',
      'Zwischenkriegszeit, Weimarer Republik, Nationalsozialismus.',
      ['Weimar', 'Nationalsozialismus', 'Diktatur', 'Demokratie', 'Außenpolitik'],
      [
        area('lb1', 'Versuche der Zukunftsgestaltung in Europa nach dem Ersten Weltkrieg', 10, [
          topic('ge-k9-lb1-nach-wk1', 'Zukunftsgestaltung in Europa nach dem Ersten Weltkrieg', [
            'Versailles',
            'Zwischenkriegszeit',
          ]),
        ]),
        area('lb2', 'Deutschlands Weg von der Demokratie zur Diktatur', 22, [
          topic('ge-k9-lb2-demokratie-diktatur', 'Von der Demokratie zur Diktatur', [
            'Weimar',
            'Diktatur',
          ]),
        ]),
        area('lb3', 'Die nationalsozialistische Diktatur – ein System von Terror und Gewalt', 12, [
          topic('ge-k9-lb3-ns-diktatur', 'Die nationalsozialistische Diktatur', [
            'Nationalsozialismus',
            'Terror',
          ]),
        ]),
        area('lb4', 'Längsschnitt: Deutsche Außenpolitik zwischen Ausgleich und Konfrontation', 8, [
          topic('ge-k9-lb4-aussenpolitik', 'Längsschnitt: Deutsche Außenpolitik', [
            'Außenpolitik',
          ]),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic(
            'ge-k9-lbw-justiz',
            'Justiz und Rechtsprechung in der Weimarer Republik und im Nationalsozialismus',
            ['Justiz', 'Weimar', 'NS'],
          ),
          topic(
            'ge-k9-lbw-frauen',
            'Gesellschaftliche Situation von Frauen in der Weimarer Republik und im Nationalsozialismus',
            ['Frauen', 'Weimar', 'NS'],
          ),
          topic(
            'ge-k9-lbw-kultur',
            'Kunst und Kultur in der Weimarer Republik und im Nationalsozialismus',
            ['Kultur', 'Weimar', 'NS'],
          ),
        ]),
      ],
    ),
    grade(
      'geschichte-klasse-10',
      'Klasse 10',
      'Klasse 10',
      'Ost-West-Konflikt, deutsche Teilung und politische Wandlungsprozesse in Europa.',
      ['Kalter Krieg', 'DDR', 'BRD', 'Europa', 'Wiedervereinigung'],
      [
        area('lb1', 'Längsschnitt: Beziehungen zwischen USA und UdSSR im 20. Jahrhundert', 16, [
          topic('ge-k10-lb1-usa-udssr', 'Beziehungen zwischen USA und UdSSR', [
            'USA',
            'UdSSR',
            'Kalter Krieg',
          ]),
        ]),
        area('lb2', 'Der Ost-West-Konflikt – Ursachen und Auswirkungen für Deutschland', 22, [
          topic('ge-k10-lb2-ost-west', 'Der Ost-West-Konflikt und Deutschland', [
            'Ost-West-Konflikt',
            'Teilung',
          ]),
        ]),
        area('lb3', 'Politische Wandlungsprozesse in Europa', 14, [
          topic('ge-k10-lb3-wandel-europa', 'Politische Wandlungsprozesse in Europa', [
            'Europa',
            'Revolution',
          ]),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic(
            'ge-k10-lbw-50er',
            'Alltagserfahrungen und Mentalitäten in beiden deutschen Staaten in den 50er Jahren',
            ['Alltag', '50er'],
          ),
          topic(
            'ge-k10-lbw-70er',
            'Alltagserfahrungen und Mentalitäten in beiden deutschen Staaten in den 70er Jahren',
            ['Alltag', '70er'],
          ),
          topic(
            'ge-k10-lbw-friedliche-revolution',
            'Alltagserfahrungen zur Zeit der Friedlichen Revolution und im geeinten Deutschland',
            ['Friedliche Revolution', 'Wiedervereinigung'],
          ),
        ]),
      ],
    ),
    grade(
      'geschichte-jgs-11-12-gk',
      'Jahrgangsstufen 11/12 · Grundkurs',
      'Jahrgangsstufen 11/12 · Grundkurs',
      'Moderne Gesellschaft, Demokratie und Diktatur, Herausforderung Frieden.',
      ['Demokratie', 'Diktatur', 'Frieden', 'Gesellschaft', 'Geschichtskultur'],
      [
        area(
          'lb1',
          'Die Grundlegung einer modernen Gesellschaft in Wirtschaft und Politik in Deutschland',
          26,
          [
            topic('ge-gk-lb1-moderne-gesellschaft', 'Grundlegung einer modernen Gesellschaft', [
              'Gesellschaft',
              'Wirtschaft',
              'Politik',
            ]),
          ],
        ),
        area(
          'lb2',
          'Demokratie und Diktatur – Anspruch und Wirklichkeit in der ersten Hälfte des 20. Jahrhunderts',
          26,
          [
            topic('ge-gk-lb2-demokratie-diktatur-1', 'Demokratie und Diktatur (1. Hälfte 20. Jh.)', [
              'Demokratie',
              'Diktatur',
            ]),
          ],
        ),
        area(
          'lb3',
          'Demokratie und Diktatur – Anspruch und Wirklichkeit in der zweiten Hälfte des 20. Jahrhunderts',
          26,
          [
            topic('ge-gk-lb3-demokratie-diktatur-2', 'Demokratie und Diktatur (2. Hälfte 20. Jh.)', [
              'Demokratie',
              'Diktatur',
            ]),
          ],
        ),
        area(
          'lb4',
          'Herausforderung „Frieden“ – Die Suche nach dauerhaft friedlichem Zusammenleben im 20. Jahrhundert',
          18,
          [
            topic('ge-gk-lb4-frieden', 'Herausforderung Frieden im 20. Jahrhundert', ['Frieden']),
          ],
        ),
        area('lbw', 'Wahlbereiche', undefined, [
          topic(
            'ge-gk-lbw-rezeptions-person',
            'Geschichtskultur – Rezeptionsgeschichte einer Person oder eines Ereignisses',
            ['Geschichtskultur', 'Rezeption'],
          ),
          topic(
            'ge-gk-lbw-rezeptions-wk1',
            'Geschichtskultur – Rezeptionsgeschichte am Beispiel des Ersten Weltkrieges',
            ['Geschichtskultur', 'Erster Weltkrieg'],
          ),
          topic(
            'ge-gk-lbw-rezeptions-wk2',
            'Geschichtskultur – Rezeptionsgeschichte am Beispiel des Zweiten Weltkrieges',
            ['Geschichtskultur', 'Zweiter Weltkrieg'],
          ),
          topic(
            'ge-gk-lbw-nation',
            'Nationales Selbstverständnis – Die Frage nach der Nation',
            ['Nation', 'Identität'],
          ),
          topic(
            'ge-gk-lbw-mythen',
            'Nationales Selbstverständnis – Die Wirkung von Mythen',
            ['Mythos', 'Nation'],
          ),
          topic(
            'ge-gk-lbw-feindbilder',
            'Nationales Selbstverständnis – Die Bedeutung von Feindbildern',
            ['Feindbild', 'Nation'],
          ),
        ]),
      ],
    ),
    grade(
      'geschichte-jgs-11-lk',
      'Jahrgangsstufe 11 · Leistungskurs',
      'Jahrgangsstufe 11 · Leistungskurs',
      'Politische Ordnungsvorstellungen und Partizipation; Industrialisierung international.',
      ['Partizipation', 'Ordnung', 'Industrialisierung', 'International'],
      [
        area('lb1', 'Politische Ordnungsvorstellungen und politische Partizipation', 80, [
          topic('ge-lk11-lb1-ordnung-partizipation', 'Politische Ordnungsvorstellungen und Partizipation', [
            'Partizipation',
            'Ordnung',
          ]),
        ]),
        area(
          'lb2',
          'Von der vorindustriellen zur Industriegesellschaft – internationale Entwicklungen und ihre Folgen',
          50,
          [
            topic('ge-lk11-lb2-industriegesellschaft', 'Von der vorindustriellen zur Industriegesellschaft', [
              'Industrialisierung',
              'International',
            ]),
          ],
        ),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('ge-lk11-lbw-frauen', 'Politische Partizipation von Frauen', [
            'Frauen',
            'Partizipation',
          ]),
          topic(
            'ge-lk11-lbw-juden',
            'Politische Partizipation von Juden zwischen Ausgrenzung und Integration',
            ['Juden', 'Partizipation'],
          ),
        ]),
      ],
    ),
    grade(
      'geschichte-jgs-12-lk',
      'Jahrgangsstufe 12 · Leistungskurs',
      'Jahrgangsstufe 12 · Leistungskurs',
      'Herausforderung Frieden; Geschichtskultur und Identitätsbildung.',
      ['Frieden', 'Geschichtskultur', 'Identität'],
      [
        area(
          'lb1',
          'Herausforderung „Frieden“ – Die Suche nach dauerhaft friedlichem Zusammenleben',
          65,
          [
            topic('ge-lk12-lb1-frieden', 'Herausforderung Frieden', ['Frieden']),
          ],
        ),
        area('lb2', 'Formen von Geschichtskultur und Identitätsbildung', 45, [
          topic('ge-lk12-lb2-geschichtskultur', 'Geschichtskultur und Identitätsbildung', [
            'Geschichtskultur',
            'Identität',
          ]),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('ge-lk12-lbw-voelkerrecht', 'Völkerrecht und Kriegsführung', [
            'Völkerrecht',
            'Krieg',
          ]),
          topic('ge-lk12-lbw-entkolonialisierung', 'Entkolonialisierung und Folgekonflikte', [
            'Entkolonialisierung',
          ]),
          topic('ge-lk12-lbw-terror', 'Gewaltanwendung terroristischer Gruppen', [
            'Terrorismus',
          ]),
        ]),
      ],
    ),
  ]
}

export function allGeschichteTopicIds(): string[] {
  return buildGeschichteGymOfficialGrades().flatMap((g) =>
    g.areas.flatMap((a) => a.topics.map((t) => t.id)),
  )
}
