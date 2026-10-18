/**
 * Gymnasium Sachsen · Geschichte — Lehrplan-Outline (lplanid=65).
 * K6 LB1–LB4 + Wahl (Mittelalter, Religionen/Kulturen, Bürger, Regional) freigegeben;
 * übrige Klassen: released:false (nur Entwickleransicht).
 * Quelle: https://www.schulportal.sachsen.de/lplandb/lehrplan/65
 */
import { ROM_YEAR_FACT_COUNT } from './geschichte6'
import type { PackArea, PackGrade, PackTopic } from './pack'
import { DEFAULT_TASKS_PER_ROUND } from './tasksPerRound'

const topic = (
  id: string,
  title: string,
  keywords?: string[],
  opts?: { tasksPerRound?: number; released?: boolean; neu?: boolean },
): PackTopic => ({
  id,
  title,
  pointsPerTask: 10,
  hint: 'Tippe oder gib die Antwort ein. Erklärung erscheint nach dem Prüfen.',
  released: opts?.released ?? false,
  tasksPerRound: opts?.tasksPerRound ?? DEFAULT_TASKS_PER_ROUND,
  ...(opts?.neu ? { neu: true } : {}),
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
          topic('ge-k5-lb1-orientierung', 'Orientierung – Überblick', [
            'Zeitstrahl',
            'Quellen',
          ]),
          topic('ge-k5-lb1-quellen', 'Quellen und Quellenkritik', [
            'Primärquelle',
            'Quellenkritik',
          ]),
          topic('ge-k5-lb1-zeitrechnung', 'Zeitrechnung und Chronologie', [
            'Zeitstrahl',
            'Epoche',
            'v. Chr.',
          ]),
          topic(
            'ge-k5-lb1-archaologie-sachsen',
            'Regionalgeschichte: Archäologische Funde in Sachsen',
            ['Archäologie', 'Sachsen', 'Funde', 'Regionalgeschichte'],
            { neu: true, released: false },
          ),
        ]),
        area('lb2', 'Von der Steinzeit zur Hochkultur – Menschen organisieren ihr Zusammenleben', 12, [
          topic('ge-k5-lb2-steinzeit-hochkultur', 'Steinzeit zur Hochkultur – Überblick', [
            'Steinzeit',
            'Hochkultur',
            'Zusammenleben',
          ]),
          topic('ge-k5-lb2-steinzeit', 'Steinzeit und Sesshaftigkeit', [
            'Altsteinzeit',
            'Jungsteinzeit',
            'Sesshaftigkeit',
          ]),
          topic('ge-k5-lb2-aegypten', 'Ägypten als Hochkultur', [
            'Nil',
            'Pharao',
            'Hieroglyphen',
          ]),
          topic('ge-k5-lb2-metallzeit', 'Metallzeit und frühe Hochkulturen', [
            'Bronze',
            'Mesopotamien',
            'Keilschrift',
          ]),
          topic(
            'ge-k5-lb2-jetztmensch',
            'Entwicklungsstufen zum Jetztmenschen',
            ['Evolution', 'Jetztmensch', 'Homo sapiens', 'Steinzeit'],
            { neu: true, released: false },
          ),
          topic(
            'ge-k5-lb2-gesellschaftspyramide',
            'Ägypten: Gesellschaftspyramide und Schriftlichkeit',
            ['Gesellschaftspyramide', 'Pharao', 'Beamte', 'Hieroglyphen', 'Pyramiden'],
            { neu: true, released: false },
          ),
        ]),
        area('lb3', 'Zusammenleben im antiken Griechenland', 8, [
          topic('ge-k5-lb3-griechenland', 'Antikes Griechenland – Überblick', [
            'Griechenland',
            'Antike',
            'Götterwelt',
          ]),
          // Lehrplan K5 LB3: „Polis, Volksversammlung, Scherbengericht“ — Neu bis Freigabe
          topic(
            'ge-k5-lb3-polis',
            'Die griechische Polis',
            ['Polis', 'Stadtstaat', 'Bürger', 'Agora', 'Autonomie'],
            { neu: true, released: false },
          ),
          topic('ge-k5-lb3-athen', 'Athen und attische Demokratie', [
            'Volksversammlung',
            'Scherbengericht',
            'Bürgerrecht',
          ]),
          topic('ge-k5-lb3-sparta', 'Sparta als Militärstaat', [
            'Spartiaten',
            'Heloten',
            'Militärstaat',
          ]),
          topic('ge-k5-lb3-kultur', 'Götterwelt, Spiele und Kultur', [
            'Götter',
            'Olympia',
            'Tempel',
          ]),
          topic(
            'ge-k5-lb3-ohne-mitbestimmung',
            'Attische Demokratie: Gruppen ohne Mitbestimmung',
            ['Sklaven', 'Frauen', 'Metöken', 'Bürgerrecht', 'Demokratie'],
            { neu: true, released: false },
          ),
        ]),
        area('lb4', 'Längsschnitt: Mensch und Natur', 2, [
          topic('ge-k5-lb4-mensch-natur', 'Längsschnitt: Mensch und Natur', ['Mensch', 'Natur']),
          topic(
            'ge-k5-lb4-ressourcen',
            'Ressourcen: Wasser, Boden, Ernährung',
            ['Wasser', 'Boden', 'Ressource'],
            { neu: true, released: false },
          ),
          topic(
            'ge-k5-lb4-landschaft',
            'Landschaftswandel: Rodung und Nutzung',
            ['Rodung', 'Erosion', 'Technik'],
            { neu: true, released: false },
          ),
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
            // Pool-limited: one attempt per year fact, but never more than 10.
            {
              tasksPerRound: Math.min(DEFAULT_TASKS_PER_ROUND, ROM_YEAR_FACT_COUNT),
              released: true,
            },
          ),
          topic(
            'ge-k6-lb1-chronologie',
            'Chronologie (Reihenfolge)',
            ['Zeitstrahl', 'Reihenfolge'],
            { tasksPerRound: 10, released: true },
          ),
          topic('ge-k6-lb1-anfaenge', 'Die Anfänge Roms', [
            'Romulus',
            'Etrusker',
            'Tiber',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb1-begriffe', 'Senat, Republik, Patrizier und Plebejer', [
            'Senat',
            'Patrizier',
            'Plebejer',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb1-aemter', 'Ämter und Institutionen der Republik', [
            'Konsuln',
            'Volkstribune',
            'Magistrate',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb1-punische-kriege', 'Punische Kriege – Rom und Karthago', [
            'Hannibal',
            'Karthago',
            'Scipio',
          ], { tasksPerRound: 10, released: true }),
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
          topic("ge-k6-lb1-caesar-augustus", "Vom Volk und Senat zur Alleinherrschaft: Caesar und Augustus", [
            "Caesar",
            "Augustus",
            "Republik",
            "Prinzipat",
            "Senat",
          ]),
          topic("ge-k6-lb1-kaiserzeit-gesellschaft", "Römische Gesellschaft in der Kaiserzeit", [
            "Sklaven",
            "Insula",
            "Alltag",
            "Wohlstand",
            "Gesellschaft",
          ]),
          topic("ge-k6-lb1-germanen", "Römer und Germanen: Konflikt und Prägung", [
            "Germanen",
            "Teutoburger Wald",
            "Limes",
            "Lehnwörter",
            "Kulturkontakt",
          ]),
        ]),
        area('lb2', 'Herrschaft und Lebensformen im Mittelalter', 20, [
          topic('ge-k6-lb2-mittelalter', 'Mittelalter – Überblick', [
            'Mittelalter',
            'Herrschaft',
            'Leben',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb2-frankenreich', 'Frankenreich und Karl der Große', [
            'Völkerwanderung',
            'Frankenreich',
            'Karl der Große',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb2-reichsbildung', 'Reichsteilung und Staatenbildung', [
            'Reichsteilung',
            'Nachfolgestaaten',
            'Karten',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb2-missionierung', 'Missionierung und Christianisierung', [
            'Mission',
            'Christentum',
            'Bekehrung',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb2-ostkolonisation', 'Ostkolonisation', [
            'Ostsiedlung',
            'Kolonisation',
            'Landesausbau',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb2-heiliges-reich', 'Heiliges Römisches Reich', [
            'HRR',
            'Kaiser',
            'Spätmittelalter',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb2-weltlich-geistlich', 'Weltliche und geistliche Macht', [
            'Kaiser',
            'Papst',
            'Investitur',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb2-lehnswesen', 'Lehnswesen und Vasallität', [
            'Lehen',
            'Vasall',
            'Treueeid',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb2-grundherrschaft', 'Grundherrschaft, Abgaben und Dienste', [
            'Grundherrschaft',
            'Frondienst',
            'Abgaben',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb2-alltag-staende', 'Ständeordnung und Alltag', [
            'Stände',
            'Bauern',
            'Adel',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb2-staedte', 'Stadt, Bürger, Zünfte und Hanse', [
            'Markt',
            'Zunft',
            'Hanse',
            'Patrizier',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb2-burg-ritter', 'Burg, Rittertum und höfische Kultur', [
            'Burg',
            'Ritter',
            'Minne',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb2-alltag-froemmigkeit', 'Christliche Durchdringung des Alltags', [
            'Pfarrkirche',
            'Festkalender',
            'Volksfrömmigkeit',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb2-kloester', 'Klöster: Lebensform und Ausstrahlung', [
            'Kloster',
            'Mönche',
            'Regel',
          ], { tasksPerRound: 10, released: true }),
        ]),
        area('lb3', 'Religionen und Kulturen im Mit- und Gegeneinander', 10, [
          topic('ge-k6-lb3-religionen', 'Religionen und Kulturen – Überblick', [
            'Religion',
            'Kultur',
            'Begegnung',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb3-juden', 'Juden als Minderheit und Mitgestalter', [
            'Juden',
            'Handel',
            'Bildung',
            'Medizin',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb3-juden-verfolgung', 'Duldung, Verfolgung und Pogrome', [
            'Ghetto',
            'Pogrom',
            'Schwarzer Tod',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb3-islam', 'Entstehung und Ausbreitung des Islams', [
            'Mekka',
            'Medina',
            'Koran',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb3-kreuzzuege', 'Kreuzzüge und „Heilige Kriege“', [
            'Kreuzzug',
            'Dschihad',
            'Jerusalem',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb3-al-andalus', 'Südspanien: Austausch und Duldung', [
            'Al-Andalus',
            'Córdoba',
            'Konvivenz',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb3-kulturtransfer', 'Medizin, Wissenschaft und Handel', [
            'Wissenschaft',
            'Medizin',
            'Handel',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb3-begegnung', 'Absolutheitsanspruch, Duldung und Austausch', [
            'Toleranz',
            'Konflikt',
            'Austausch',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lb3-toleranz-heute', 'Kulturelle Vielfalt und Toleranz heute', [
            'Vielfalt',
            'Toleranz',
            'Religionsfreiheit',
          ], { tasksPerRound: 10, released: true }),
        ]),
        area('lb4', 'Durch die Zeiten: Erziehung zum Bürger', 4, [
          topic('ge-k6-lb4-buerger', 'Durch die Zeiten: Erziehung zum Bürger', [
            'Bürger',
            'Erziehung',
          ], { tasksPerRound: 10, released: true }),
          // Neue Unterthemen gesperrt — User gibt frei (Lehrplan: Längsschnitt Polis/Rom/Stadt)
          topic('ge-k6-lb4-polis', 'Bürger in der griechischen Polis', [
            'Polis',
            'Bürgerrecht',
            'Pflichten',
          ]),
          topic('ge-k6-lb4-rom', 'Römisches Bürgerrecht', [
            'Rom',
            'Bürgerrecht',
            'Rechtsstatus',
          ]),
          topic('ge-k6-lb4-stadt', 'Bürger in der mittelalterlichen Stadt', [
            'Stadt',
            'Stadtluft',
            'Zunft',
          ]),
          topic('ge-k6-lb4-vergleich', 'Bürgerrechte im Epochenvergleich', [
            'Vergleich',
            'Wandel',
            'Ausschluss',
          ]),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('ge-k6-lbw-besiedlung', 'Regionalgeschichte – Besiedlung Sachsens', [
            'Sachsen',
            'Besiedlung',
          ], { tasksPerRound: 10, released: true }),
          topic('ge-k6-lbw-kurfuerstentum', 'Regionalgeschichte – Sachsens Weg zum Kurfürstentum', [
            'Sachsen',
            'Kurfürstentum',
          ], { tasksPerRound: 10, released: true }),
          topic(
            'ge-k6-lbw-selbstverstaendnis',
            'Regionalgeschichte – Ausdrucksformen sächsischen Selbstverständnisses',
            ['Sachsen', 'Identität'],
            { tasksPerRound: 10, released: true },
          ),
                  topic('ge-k6-lbw-regional', 'Regionalgeschichte Mittelalter in Sachsen', ['regional', 'lbw']),
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
          topic('ge-k7-lb1-neuzeit', 'Aufbruch in die Neuzeit – Überblick', ['Neuzeit', 'Menschenbild']),
          topic('ge-k7-lb1-renaissance', 'Renaissance und Humanismus', [
            'Renaissance',
            'Humanismus',
            'Buchdruck',
          ]),
          topic('ge-k7-lb1-entdeckungen', 'Entdeckungsfahrten und globale Verflechtung', [
            '1492',
            'Kolumbus',
            'Kolonialisierung',
          ]),
          topic('ge-k7-lb1-reformation-krieg', 'Reformation und Dreißigjähriger Krieg', [
            'Luther',
            'Glaubensspaltung',
            'Dreißigjähriger Krieg',
          ]),
          topic("ge-k7-lb1-amerika-hochkultur", "Kulturbegegnung in Amerika: Eroberung und Folgen", [
            "Konquista",
            "Hochkultur",
            "Indigene",
            "Europäisierung",
            "Kolonialismus",
          ]),
          topic("ge-k7-lb1-erfindungen-weltbild", "Erfindungen und neues Weltbild in der Frühen Neuzeit", [
            "Buchdruck",
            "Kompass",
            "Feuerwaffen",
            "Weltbild",
            "Entdeckungen",
          ]),
                  topic('ge-k7-lb1-humanismus', 'Humanismus und Bildung', ['humanismus', 'lb1']),
]),
        area('lb2', 'Staat und Gesellschaft im Zeitalter von Absolutismus und Aufklärung', 14, [
          topic('ge-k7-lb2-absolutismus', 'Absolutismus und Aufklärung – Überblick', [
            'Absolutismus',
            'Aufklärung',
          ]),
          topic('ge-k7-lb2-absolutismus-frankreich', 'Absolutismus in Frankreich (Ludwig XIV.)', [
            'Ludwig XIV.',
            'Versailles',
            'Merkantilismus',
          ]),
          topic('ge-k7-lb2-aufklaerung', 'Aufklärung: Vernunft und Kritik', [
            'Vernunft',
            'Gewaltenteilung',
            'Toleranz',
          ]),
          topic('ge-k7-lb2-preussen-sachsen', 'Preußen und Sachsen im Absolutismus', [
            'Friedrich II.',
            'August der Starke',
            'Barock',
          ]),
          topic("ge-k7-lb2-august-barock", "Sachsen unter August dem Starken: Barock und Herrschaft", [
            "August der Starke",
            "Barock",
            "Dresden",
            "Repräsentation",
            "Sachsen",
          ]),
                  topic('ge-k7-lb2-machtstuetzzen', 'Machtstützen absolutistischer Herrschaft', ['machtstuetzzen', 'lb2']),
]),
        area('lb3', 'Formen der Beschränkung der Alleinherrschaft', 18, [
          topic('ge-k7-lb3-alleinherrschaft', 'Beschränkung der Alleinherrschaft – Überblick', [
            'Herrschaft',
            'Verfassung',
          ]),
          topic('ge-k7-lb3-england', 'England: Parlament und Bill of Rights', [
            'Magna Carta',
            'Parlament',
            'Bill of Rights',
          ]),
          topic('ge-k7-lb3-usa', 'USA: Unabhängigkeit und Verfassung', [
            'Unabhängigkeitserklärung',
            'Verfassung',
            'Zustimmung',
          ]),
          topic('ge-k7-lb3-franzoesische-revolution', 'Französische Revolution', [
            '1789',
            'Volkssouveränität',
            'Bürgerrechte',
          ]),
          topic('ge-k7-lb3-napoleon', 'Napoleon und das Ende der Revolution', [
            'Napoleon',
            'Kaisertum',
            'Europa',
          ]),
          topic("ge-k7-lb3-karikatur", "Quellenart Karikatur", [
            "Karikatur",
            "Satire",
            "Quellenkritik",
            "Bildquelle",
            "Meinung",
          ]),
          topic("ge-k7-lb3-konstitutionelle-monarchie", "Konstitutionelle Monarchie", [
            "Konstitution",
            "Monarchie",
            "Verfassung",
            "Parlament",
            "Gewaltenteilung",
          ]),
                  topic('ge-k7-lb3-usa-mitwirkung', 'Mitwirkung des Volkes in der USA-Gründung', ['usa mitwirkung', 'lb3']),
]),
        area('lb4', 'Längsschnitt: Legitimation von Herrschaft in der Geschichte', 4, [
          topic('ge-k7-lb4-legitimation', 'Längsschnitt: Legitimation von Herrschaft', [
            'Herrschaft',
            'Legitimation',
          ]),
          topic('ge-k7-lb4-gottesgnade', 'Gottesgnadentum und religiöse Begründung', [
            'Gottesgnadentum',
            'Absolutismus',
          ]),
          topic('ge-k7-lb4-verfassung', 'Verfassung und Volkssouveränität', [
            'Verfassung',
            'Volkssouveränität',
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
          topic('ge-k8-lb1-einheit-freiheit', 'Einheit und Freiheit – Überblick', [
            'Bürgertum',
            'Einheit',
            'Freiheit',
          ]),
          topic('ge-k8-lb1-napoleon-wiener', 'Napoleon, Wiener Kongress und Deutscher Bund', [
            'Wiener Kongress',
            'Napoleon',
            'Deutscher Bund',
          ]),
          topic('ge-k8-lb1-vormaerz-1848', 'Vormärz und Revolution 1848/49', [
            'Vormärz',
            '1848',
            'Paulskirche',
          ]),
          topic('ge-k8-lb1-kaiserreich', 'Reichsgründung und Kaiserreich', [
            'Bismarck',
            '1871',
            'Verfassung',
          ]),
          topic("ge-k8-lb1-ideologien", "Nationalismus, Liberalismus, Konservatismus", [
            "Nationalismus",
            "Liberalismus",
            "Konservatismus",
            "Ideologie",
            "Vormärz",
          ]),
          topic("ge-k8-lb1-quellen-lied-denkmal", "Quellen: politisches Lied, Lyrik und Denkmal", [
            "politisches Lied",
            "Lyrik",
            "Denkmal",
            "Geschichtskultur",
            "Erinnerung",
          ]),
                  topic('ge-k8-lb1-reichseinigung', 'Reichseinigungskriege und Nationalstaat', ['reichseinigung', 'lb1']),
          topic('ge-k8-lb1-reichsfeinde', 'Umgang mit „Reichsfeinden“', ['reichsfeinde', 'lb1']),
]),
        area('lb2', 'Das Doppelgesicht des Fortschritts – Industrialisierung und die Folgen', 14, [
          topic('ge-k8-lb2-industrialisierung', 'Industrialisierung – Überblick', [
            'Industrialisierung',
            'Fortschritt',
          ]),
          topic('ge-k8-lb2-england', 'England als Pionier der Industriellen Revolution', [
            'England',
            'Dampfmaschine',
            'Fabrik',
          ]),
          topic('ge-k8-lb2-deutschland', 'Industrialisierung in Deutschland', [
            'Zollverein',
            'Eisenbahn',
            'Hochindustrialisierung',
          ]),
          topic('ge-k8-lb2-folgen', 'Soziale Folgen: Stadt, Arbeit, Umwelt', [
            'Verstädterung',
            'Migration',
            'Soziale Frage',
          ]),
          topic("ge-k8-lb2-vorindustrie", "Vorindustrieller Wandel: Handwerk und Merkantilismus", [
            "Handwerk",
            "Merkantilismus",
            "Zünfte",
            "Wirtschaft",
            "Industrialisierung",
          ]),
                  topic('ge-k8-lb2-soziale-frage', 'Soziale Frage und Lösungsansätze', ['soziale frage', 'lb2']),
]),
        area('lb3', 'Längsschnitt: Industrialisierung und Kinderarbeit', 6, [
          topic('ge-k8-lb3-kinderarbeit', 'Längsschnitt: Industrialisierung und Kinderarbeit', [
            'Kinderarbeit',
            'Industrialisierung',
          ]),
          topic('ge-k8-lb3-schutzgesetze', 'Kinderschutz und Fabrikgesetze', [
            'Fabrikgesetz',
            'Arbeitsschutz',
          ]),
          topic('ge-k8-lb3-schule', 'Schulpflicht und Ende der Kinderarbeit', [
            'Schulpflicht',
            'Bildung',
          ]),
        ]),
        area('lb4', 'Vom übersteigerten Nationalismus zum Ersten Weltkrieg', 14, [
          topic('ge-k8-lb4-nationalismus-wk1', 'Nationalismus und Erster Weltkrieg – Überblick', [
            'Nationalismus',
            'Erster Weltkrieg',
          ]),
          topic('ge-k8-lb4-imperialismus', 'Imperialismus und Kolonialpolitik', [
            'Imperialismus',
            'Kolonialismus',
            'Großmächte',
          ]),
          topic('ge-k8-lb4-buendnisse', 'Bündnispolitik und Wettrüsten', [
            'Bismarck',
            'Bündnisse',
            'Militarismus',
          ]),
          topic('ge-k8-lb4-ursachen-wk1', 'Ursachen und Kriegsschuldfrage 1914', [
            'Julikrise',
            'Kriegsschuld',
            '1914',
          ]),
          topic("ge-k8-lb4-kriegsverlauf-wk1", "Erster Weltkrieg: Verlauf 1914–1918", [
            "Weltkrieg",
            "Stellungskrieg",
            "Materialschlacht",
            "Heimatfront",
            "1918",
          ]),
                  topic('ge-k8-lb4-wettruesten', 'Wettrüsten und Militarismus vor 1914', ['wettruesten', 'lb4']),
]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic(
            'ge-k8-lbw-kriegstechnik',
            'Neue Dimension von Krieg – Kriegsführung und Kriegstechnik im Ersten Weltkrieg',
            ['Erster Weltkrieg', 'Kriegstechnik'],
          ),
          topic(
            'ge-k8-lbw-alltag',
            'Neue Dimension von Krieg – Alltag im Ersten Weltkrieg',
            ['Heimatfront', 'Feldpost', 'Alltag'],
          ),
          topic(
            'ge-k8-lbw-massenmedien',
            'Neue Dimension von Krieg – Moderne Massenmedien im Ersten Weltkrieg',
            ['Erster Weltkrieg', 'Medien', 'Propaganda'],
          ),
                  topic('ge-k8-lbw-alltag-industrie', 'Alltag in der Industriegesellschaft', ['alltag industrie', 'lbw']),
          topic('ge-k8-lbw-migration', 'Migration im 19. Jahrhundert', ['migration', 'lbw']),
          topic('ge-k8-lbw-technikfolgen', 'Technikfolgen und Fortschrittsdebatte', ['technikfolgen', 'lbw']),
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
          topic('ge-k9-lb1-nach-wk1', 'Nach dem Ersten Weltkrieg – Überblick', [
            'Versailles',
            'Zwischenkriegszeit',
          ]),
          topic('ge-k9-lb1-versailles', 'Versailler Vertrag und Nachkriegsordnung', [
            'Versailles',
            'Reparationen',
            'Völkerbund',
          ]),
          topic('ge-k9-lb1-europa-ordnung', 'Neue Staaten und gesellschaftliche Umbrüche', [
            'Selbstbestimmung',
            'Sowjetrussland',
            'Nachkriegsordnung',
          ]),
          topic("ge-k9-lb1-oktober-stalin", "Oktoberrevolution und Stalinismus", [
            "Oktoberrevolution",
            "Lenin",
            "Stalinismus",
            "Sowjetunion",
            "Diktatur",
          ]),
          topic("ge-k9-lb1-novemberrevolution", "Novemberrevolution und Weimarer Verfassung", [
            "Novemberrevolution",
            "Weimarer Verfassung",
            "Republik",
            "1918",
            "Räte",
          ]),
        ]),
        area('lb2', 'Deutschlands Weg von der Demokratie zur Diktatur', 22, [
          topic('ge-k9-lb2-demokratie-diktatur', 'Von der Demokratie zur Diktatur – Überblick', [
            'Weimar',
            'Diktatur',
          ]),
          topic('ge-k9-lb2-weimar', 'Weimarer Republik: Chancen und Krisen', [
            'Weimar',
            'Verfassung',
            'Inflation',
          ]),
          topic('ge-k9-lb2-aufstieg-ns', 'Aufstieg der Nationalsozialisten', [
            'NSDAP',
            'Weltwirtschaftskrise',
            'Machtübertragung',
          ]),
          topic("ge-k9-lb2-putsche-krisen", "Weimar: Putschversuche und Selbstbehauptung", [
            "Kapp-Putsch",
            "Hitler-Putsch",
            "Krise",
            "Republikschutz",
            "Weimar",
          ]),
                  topic('ge-k9-lb2-wahlverhalten', 'Wahlverhalten und Statistik in der Weimarer Zeit', ['wahlverhalten', 'lb2']),
          topic('ge-k9-lb2-praesidial', 'Präsidialkabinette und Machtverlagerung', ['praesidial', 'lb2']),
          topic('ge-k9-lb2-ernennung', 'Ernennung Hitlers und Ermächtigung', ['ernennung', 'lb2']),
          topic('ge-k9-lb2-gleichschaltung', 'Gleichschaltung der Gesellschaft', ['gleichschaltung', 'lb2']),
          topic('ge-k9-lb2-terror-beginn', 'Beginn von Terror und Ausgrenzung', ['terror beginn', 'lb2']),
]),
        area('lb3', 'Die nationalsozialistische Diktatur – ein System von Terror und Gewalt', 12, [
          topic('ge-k9-lb3-ns-diktatur', 'NS-Diktatur – Überblick', [
            'Nationalsozialismus',
            'Terror',
          ]),
          topic('ge-k9-lb3-terror', 'Gleichschaltung, Terror und Verfolgung', [
            'Gleichschaltung',
            'Gestapo',
            'Konzentrationslager',
          ]),
          topic('ge-k9-lb3-holocaust', 'Holocaust und Völkermord', [
            'Holocaust',
            'Shoah',
            'Erinnerung',
          ]),
          topic('ge-k9-lb3-widerstand', 'Widerstand in der Diktatur', [
            'Widerstand',
            'Opposition',
            'Zivilcourage',
          ]),
                  topic('ge-k9-lb3-volksgemeinschaft', 'Ideologie der „Volksgemeinschaft“', ['volksgemeinschaft', 'lb3']),
]),
        area('lb4', 'Längsschnitt: Deutsche Außenpolitik zwischen Ausgleich und Konfrontation', 8, [
          topic('ge-k9-lb4-aussenpolitik', 'Deutsche Außenpolitik – Überblick', [
            'Außenpolitik',
            'Längsschnitt',
          ]),
          topic('ge-k9-lb4-ausgleich', 'Ausgleichspolitik und Revision', [
            'Locarno',
            'Rapallo',
            'Revision',
          ]),
          topic('ge-k9-lb4-aggression', 'Aggressive Expansion der NS-Zeit', [
            'Appeasement',
            'Expansion',
            'Kriegsbeginn',
          ]),
                  topic('ge-k9-lb4-aussen-phasen', 'Phasen deutscher Außenpolitik', ['aussen phasen', 'lb4']),
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
                  topic('ge-k9-lbw-gedenkstaette', 'Gedenkstättenarbeit', ['gedenkstaette', 'lbw']),
          topic('ge-k9-lbw-widerstand-formen', 'Formen des Widerstands', ['widerstand formen', 'lbw']),
          topic('ge-k9-lbw-alltag-ns', 'Alltag im Nationalsozialismus', ['alltag ns', 'lbw']),
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
          topic('ge-k10-lb1-usa-udssr', 'USA und UdSSR – Überblick', [
            'USA',
            'UdSSR',
            'Kalter Krieg',
          ]),
          topic('ge-k10-lb1-allianz-bruch', 'Kriegsallianz und Bruch der Sieger', [
            'Allianz',
            'Jalta',
            'Potsdam',
          ]),
          topic('ge-k10-lb1-kaltkrieg-phasen', 'Phasen des Kalten Krieges', [
            'Eindämmung',
            'Kubakrise',
            'Entspannung',
          ]),
                  topic('ge-k10-lb1-feindbilder', 'Ideologische Feindbilder USA–UdSSR', ['feindbilder', 'lb1']),
          topic('ge-k10-lb1-potsdam', 'Potsdamer Konferenz und Nachkriegsordnung', ['potsdam', 'lb1']),
          topic('ge-k10-lb1-blockbildung', 'Blockbildung und Bündnisse', ['blockbildung', 'lb1']),
          topic('ge-k10-lb1-stellvertreter', 'Stellvertreterkonflikte im Kalten Krieg', ['stellvertreter', 'lb1']),
]),
        area('lb2', 'Der Ost-West-Konflikt – Ursachen und Auswirkungen für Deutschland', 22, [
          topic('ge-k10-lb2-ost-west', 'Ost-West-Konflikt und Deutschland – Überblick', [
            'Ost-West-Konflikt',
            'Teilung',
          ]),
          topic('ge-k10-lb2-teilung', 'Teilung Deutschlands und Berlins', [
            'Besatzungszonen',
            'Berlin-Blockade',
            'Mauerbau',
          ]),
          topic('ge-k10-lb2-zwei-staaten', 'Zwei deutsche Staaten im Systemkonflikt', [
            'BRD',
            'DDR',
            'Hallstein-Doktrin',
          ]),
          topic('ge-k10-lb2-deutsche-frage', 'Deutsche Frage und Ostpolitik', [
            'Ostpolitik',
            'Grundlagenvertrag',
            'Entspannung',
          ]),
          topic("ge-k10-lb2-nachkriegs-1945", "Nachkriegsordnung 1945–55: Entnazifizierung und Neubeginn", [
            "Entnazifizierung",
            "Bodenreform",
            "Speziallager",
            "Besatzung",
            "Neubeginn",
          ]),
                  topic('ge-k10-lb2-sachsen-sbz', 'Sachsen in der SBZ', ['sachsen sbz', 'lb2']),
          topic('ge-k10-lb2-doppelstaat', 'Gründung der beiden deutschen Staaten', ['doppelstaat', 'lb2']),
          topic('ge-k10-lb2-integration-west-ost', 'West- und Ostintegration', ['integration west ost', 'lb2']),
          topic('ge-k10-lb2-mauer', 'Mauerbau und deutsch-deutsche Grenze', ['mauer', 'lb2']),
]),
        area('lb3', 'Politische Wandlungsprozesse in Europa', 14, [
          topic('ge-k10-lb3-wandel-europa', 'Wandlungsprozesse in Europa – Überblick', [
            'Europa',
            'Revolution',
          ]),
          topic('ge-k10-lb3-osteuropa-1989', 'Umwälzungen in Mittel- und Osteuropa 1989/90', [
            '1989',
            'Systemwechsel',
            'Sowjetunion',
          ]),
          topic('ge-k10-lb3-einigung', 'Deutsche Einheit und europäische Integration', [
            'Wiedervereinigung',
            'EU',
            'Zwei-plus-Vier',
          ]),
          topic("ge-k10-lb3-glasnost-perestroika", "Glasnost und Perestroika", [
            "Glasnost",
            "Perestroika",
            "Gorbatschow",
            "Reform",
            "1989",
          ]),
          topic("ge-k10-lb3-europarat-einigung", "Europäische Einigung: Motive und Institutionen", [
            "Europarat",
            "EG",
            "EU",
            "Einigung",
            "Integration",
          ]),
                  topic('ge-k10-lb3-transformation', 'Transformation nach 1989/90', ['transformation', 'lb3']),
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
                  topic('ge-k10-lbw-alltag-ddr', 'Alltag in der DDR', ['alltag ddr', 'lbw']),
          topic('ge-k10-lbw-opposition', 'Opposition und Bürgerrecht', ['opposition', 'lbw']),
          topic('ge-k10-lbw-erinnerung-teilung', 'Erinnerung an die Teilung', ['erinnerung teilung', 'lbw']),
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
            topic('ge-gk-lb1-moderne-gesellschaft', 'Moderne Gesellschaft – Überblick', [
              'Gesellschaft',
              'Wirtschaft',
              'Politik',
            ]),
            topic('ge-gk-lb1-wirtschaft', 'Wirtschaftlicher Wandel und soziale Frage', [
              'Industrialisierung',
              'Soziale Frage',
              'Kapitalismus',
            ]),
            topic('ge-gk-lb1-politik-partizipation', 'Politische Partizipation und Verfassung', [
              'Verfassung',
              'Partizipation',
              'Rechtsstaat',
            ]),
                    topic('ge-gk-lb1-aufklaerung-staat', 'Staatsideen der Aufklärung', ['aufklaerung staat', 'lb1']),
          topic('ge-gk-lb1-revolutionen', 'Atlantische Revolutionen', ['revolutionen', 'lb1']),
          topic('ge-gk-lb1-buergertum', 'Bürgertum und Öffentlichkeit', ['buergertum', 'lb1']),
          topic('ge-gk-lb1-verfassungsstaat', 'Verfassungsstaatliche Ordnung', ['verfassungsstaat', 'lb1']),
          topic('ge-gk-lb1-wirtschaft-wandel', 'Wirtschaftlicher Wandel um 1800', ['wirtschaft wandel', 'lb1']),
          topic('ge-gk-lb1-sozialstruktur', 'Sozialstruktur im Umbau', ['sozialstruktur', 'lb1']),
          topic('ge-gk-lb1-geschlecht-recht', 'Rechte und Geschlechterordnungen', ['geschlecht recht', 'lb1']),
          topic('ge-gk-lb1-quellen-aufklaerung', 'Quellen der Aufklärungsepoche', ['quellen aufklaerung', 'lb1']),
],
        ),
        area(
          'lb2',
          'Demokratie und Diktatur – Anspruch und Wirklichkeit in der ersten Hälfte des 20. Jahrhunderts',
          26,
          [
            topic('ge-gk-lb2-demokratie-diktatur-1', 'Demokratie und Diktatur I – Überblick', [
              'Demokratie',
              'Diktatur',
            ]),
            topic('ge-gk-lb2-weimar-versagen', 'Weimar: Chancen, Krisen, Scheitern', [
              'Weimar',
              'Krise',
              'Machtübertragung',
            ]),
            topic('ge-gk-lb2-ns-herrschaft', 'NS-Herrschaft: Ideologie und Praxis', [
              'Nationalsozialismus',
              'Ideologie',
              'Terror',
            ]),
          topic("ge-gk-lb2-parteien-weimar", "Weimar: Parteien, Wählerschaft und antidemokratische Gesinnung", [
            "Parteien",
            "Wählerschaft",
            "Antidemokratisch",
            "Weimar",
            "Polarisierung",
          ]),
                    topic('ge-gk-lb2-demokratie-modelle', 'Demokratiemodelle im Vergleich', ['demokratie modelle', 'lb2']),
          topic('ge-gk-lb2-diktatur-merkmale', 'Merkmale moderner Diktaturen', ['diktatur merkmale', 'lb2']),
          topic('ge-gk-lb2-weimar-krisen', 'Krisen der Weimarer Demokratie', ['weimar krisen', 'lb2']),
          topic('ge-gk-lb2-widerstand-ethik', 'Widerstand und ethische Urteile', ['widerstand ethik', 'lb2']),
          topic('ge-gk-lb2-propaganda-medien', 'Propaganda und Medien', ['propaganda medien', 'lb2']),
          topic('ge-gk-lb2-opfergruppen', 'Verfolgte Gruppen', ['opfergruppen', 'lb2']),
          topic('ge-gk-lb2-justiz-unrecht', 'Justiz und Unrecht in Diktaturen', ['Justiz', 'Unrecht', 'Diktatur']),
],
        ),
        area(
          'lb3',
          'Demokratie und Diktatur – Anspruch und Wirklichkeit in der zweiten Hälfte des 20. Jahrhunderts',
          26,
          [
            topic('ge-gk-lb3-demokratie-diktatur-2', 'Demokratie und Diktatur II – Überblick', [
              'Demokratie',
              'Diktatur',
            ]),
            topic('ge-gk-lb3-brd-demokratie', 'Demokratieaufbau in der Bundesrepublik', [
              'Grundgesetz',
              'Parlamentarismus',
              'Rechtsstaat',
            ]),
            topic('ge-gk-lb3-ddr-diktatur', 'SED-Diktatur und deutsche Teilung', [
              'DDR',
              'SED',
              'Stasi',
            ]),
                    topic('ge-gk-lb3-sowjet-system', 'Sowjetisches Herrschaftssystem', ['sowjet system', 'lb3']),
          topic('ge-gk-lb3-ddr-staat', 'Herrschaft in der DDR', ['ddr staat', 'lb3']),
          topic('ge-gk-lb3-vergleich-diktaturen', 'Demokratie und Diktatur im Vergleich', ['vergleich diktaturen', 'lb3']),
          topic('ge-gk-lb3-alltag-unfreiheit', 'Alltag unter Unfreiheit', ['alltag unfreiheit', 'lb3']),
          topic('ge-gk-lb3-sicherheitsorgane', 'Sicherheitsorgane und Überwachung', ['sicherheitsorgane', 'lb3']),
          topic('ge-gk-lb3-wirtschaft-plan', 'Planwirtschaft und Mangel', ['wirtschaft plan', 'lb3']),
          topic('ge-gk-lb3-opposition-ost', 'Opposition im Osten', ['opposition ost', 'lb3']),
          topic('ge-gk-lb3-quellen-diktatur', 'Quellen zu Diktaturerfahrung', ['quellen diktatur', 'lb3']),
],
        ),
        area(
          'lb4',
          'Herausforderung „Frieden“ – Die Suche nach dauerhaft friedlichem Zusammenleben im 20. Jahrhundert',
          18,
          [
            topic('ge-gk-lb4-frieden', 'Herausforderung Frieden – Überblick', ['Frieden']),
            topic('ge-gk-lb4-kollektive-sicherheit', 'Kollektive Sicherheit und Institutionen', [
              'UNO',
              'Völkerbund',
              'Sicherheitsarchitektur',
            ]),
            topic('ge-gk-lb4-kaltkrieg-frieden', 'Friedenssicherung im Kalten Krieg', [
              'Abschreckung',
              'Entspannung',
              'Abrüstung',
            ]),
                    topic('ge-gk-lb4-kriegsursachen', 'Kriegsursachen analysieren', ['kriegsursachen', 'lb4']),
          topic('ge-gk-lb4-friedensordnungen', 'Friedensordnungen nach Kriegen', ['friedensordnungen', 'lb4']),
          topic('ge-gk-lb4-uno-system', 'UNO und kollektive Sicherheit', ['uno system', 'lb4']),
          topic('ge-gk-lb4-abrüstung', 'Abrüstung und Rüstungskontrolle', ['abrüstung', 'lb4']),
          topic('ge-gk-lb4-aktuelle-konflikte', 'Aktuelle Konfliktfelder', ['aktuelle konflikte', 'lb4']),
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
                  topic('ge-gk-lbw-regional-os', 'Regionalgeschichte Sachsen OS', ['regional os', 'lbw']),
          topic('ge-gk-lbw-biografie', 'Biografisches Arbeiten', ['biografie', 'lbw']),
          topic('ge-gk-lbw-medienprojekt', 'Geschichtsprojekt Medien', ['medienprojekt', 'lbw']),
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
          topic('ge-lk11-lb1-ordnung-partizipation', 'Ordnung und Partizipation – Überblick', [
            'Partizipation',
            'Ordnung',
          ]),
          topic('ge-lk11-lb1-ordnungen', 'Politische Ordnungsmodelle im Vergleich', [
            'Monarchie',
            'Republik',
            'Diktatur',
          ]),
          topic('ge-lk11-lb1-partizipation', 'Wege und Grenzen politischer Teilhabe', [
            'Wahlrecht',
            'Protest',
            'Zivilgesellschaft',
          ]),
          topic("ge-lk11-lb1-aufklaerung-ideen", "Aufklärungsphilosophie: Staatsideen und Revolution", [
            "Montesquieu",
            "Rousseau",
            "Menschenrechte",
            "Gewaltenteilung",
            "Aufklärung",
          ]),
                  topic('ge-lk11-lb1-theorie', 'Politische Ordnung/Partizipation: Theorien und Begriffe', ['theorie', 'lb1']),
          topic('ge-lk11-lb1-fallstudie-1', 'Politische Ordnung/Partizipation: Fallstudie I', ['fallstudie 1', 'lb1']),
          topic('ge-lk11-lb1-fallstudie-2', 'Politische Ordnung/Partizipation: Fallstudie II', ['fallstudie 2', 'lb1']),
          topic('ge-lk11-lb1-vergleich', 'Politische Ordnung/Partizipation: Historischer Vergleich', ['vergleich', 'lb1']),
          topic('ge-lk11-lb1-quellen', 'Politische Ordnung/Partizipation: Quellenarbeit', ['quellen', 'lb1']),
          topic('ge-lk11-lb1-akteure', 'Politische Ordnung/Partizipation: Akteure und Interessen', ['akteure', 'lb1']),
          topic('ge-lk11-lb1-strukturen', 'Politische Ordnung/Partizipation: Strukturen und Prozesse', ['strukturen', 'lb1']),
          topic('ge-lk11-lb1-alltag', 'Politische Ordnung/Partizipation: Alltag und Erfahrung', ['alltag', 'lb1']),
          topic('ge-lk11-lb1-ideen', 'Politische Ordnung/Partizipation: Ideen und Ideologien', ['ideen', 'lb1']),
          topic('ge-lk11-lb1-gewalt', 'Politische Ordnung/Partizipation: Gewalt und Konflikt', ['gewalt', 'lb1']),
          topic('ge-lk11-lb1-recht', 'Politische Ordnung/Partizipation: Recht und Verfassung', ['recht', 'lb1']),
          topic('ge-lk11-lb1-wirtschaft', 'Politische Ordnung/Partizipation: Wirtschaft und Gesellschaft', ['wirtschaft', 'lb1']),
          topic('ge-lk11-lb1-geschlecht', 'Politische Ordnung/Partizipation: Geschlecht und Teilhabe', ['geschlecht', 'lb1']),
          topic('ge-lk11-lb1-religion', 'Politische Ordnung/Partizipation: Religion und Weltbilder', ['religion', 'lb1']),
          topic('ge-lk11-lb1-medien', 'Politische Ordnung/Partizipation: Medien und Öffentlichkeit', ['medien', 'lb1']),
          topic('ge-lk11-lb1-erinnerung', 'Politische Ordnung/Partizipation: Erinnerung und Deutung', ['erinnerung', 'lb1']),
          topic('ge-lk11-lb1-international', 'Politische Ordnung/Partizipation: Internationale Bezüge', ['international', 'lb1']),
          topic('ge-lk11-lb1-regional', 'Politische Ordnung/Partizipation: Regionalgeschichte', ['regional', 'lb1']),
          topic('ge-lk11-lb1-methoden', 'Politische Ordnung/Partizipation: Methoden historischen Arbeitens', ['methoden', 'lb1']),
          topic('ge-lk11-lb1-urteil', 'Politische Ordnung/Partizipation: Historisches Urteilen', ['urteil', 'lb1']),
          topic('ge-lk11-lb1-kontinuitaet', 'Politische Ordnung/Partizipation: Kontinuität und Wandel', ['kontinuitaet', 'lb1']),
          topic('ge-lk11-lb1-zaesur', 'Politische Ordnung/Partizipation: Zäsuren und Periodisierung', ['zaesur', 'lb1']),
          topic('ge-lk11-lb1-macht', 'Politische Ordnung/Partizipation: Macht und Herrschaft', ['macht', 'lb1']),
          topic('ge-lk11-lb1-widerstand', 'Politische Ordnung/Partizipation: Widerstand und Anpassung', ['widerstand', 'lb1']),
          topic('ge-lk11-lb1-migration', 'Politische Ordnung/Partizipation: Migration und Mobilität', ['migration', 'lb1']),
          topic('ge-lk11-lb1-kultur', 'Politische Ordnung/Partizipation: Kultur und Symbolik', ['kultur', 'lb1']),
          topic('ge-lk11-lb1-technik', 'Politische Ordnung/Partizipation: Technik und Umwelt', ['technik', 'lb1']),
          topic('ge-lk11-lb1-bildung', 'Politische Ordnung/Partizipation: Bildung und Sozialisation', ['bildung', 'lb1']),
]),
        area(
          'lb2',
          'Von der vorindustriellen zur Industriegesellschaft – internationale Entwicklungen und ihre Folgen',
          50,
          [
            topic('ge-lk11-lb2-industriegesellschaft', 'Industriegesellschaft – Überblick', [
              'Industrialisierung',
              'International',
            ]),
            topic('ge-lk11-lb2-industrialisierung', 'Industrialisierung als globaler Prozess', [
              'Fabriksystem',
              'Technologie',
              'Weltmarkt',
            ]),
            topic('ge-lk11-lb2-folgen', 'Soziale und politische Folgen der Industrialisierung', [
              'Arbeiterbewegung',
              'Migration',
              'Imperialismus',
            ]),
          topic("ge-lk11-lb2-vorindustriell-merkmale", "Vorindustrielle Gesellschaft: Merkmale und Umbau", [
            "Gutswirtschaft",
            "Zünfte",
            "Feudallasten",
            "Vorindustriell",
            "Sozialstruktur",
          ]),
                    topic('ge-lk11-lb2-theorie', 'Industrialisierung international: Theorien und Begriffe', ['theorie', 'lb2']),
          topic('ge-lk11-lb2-fallstudie-1', 'Industrialisierung international: Fallstudie I', ['fallstudie 1', 'lb2']),
          topic('ge-lk11-lb2-fallstudie-2', 'Industrialisierung international: Fallstudie II', ['fallstudie 2', 'lb2']),
          topic('ge-lk11-lb2-vergleich', 'Industrialisierung international: Historischer Vergleich', ['vergleich', 'lb2']),
          topic('ge-lk11-lb2-quellen', 'Industrialisierung international: Quellenarbeit', ['quellen', 'lb2']),
          topic('ge-lk11-lb2-akteure', 'Industrialisierung international: Akteure und Interessen', ['akteure', 'lb2']),
          topic('ge-lk11-lb2-strukturen', 'Industrialisierung international: Strukturen und Prozesse', ['strukturen', 'lb2']),
          topic('ge-lk11-lb2-alltag', 'Industrialisierung international: Alltag und Erfahrung', ['alltag', 'lb2']),
          topic('ge-lk11-lb2-ideen', 'Industrialisierung international: Ideen und Ideologien', ['ideen', 'lb2']),
          topic('ge-lk11-lb2-gewalt', 'Industrialisierung international: Gewalt und Konflikt', ['gewalt', 'lb2']),
          topic('ge-lk11-lb2-recht', 'Industrialisierung international: Recht und Verfassung', ['recht', 'lb2']),
          topic('ge-lk11-lb2-wirtschaft', 'Industrialisierung international: Wirtschaft und Gesellschaft', ['wirtschaft', 'lb2']),
          topic('ge-lk11-lb2-geschlecht', 'Industrialisierung international: Geschlecht und Teilhabe', ['geschlecht', 'lb2']),
          topic('ge-lk11-lb2-religion', 'Industrialisierung international: Religion und Weltbilder', ['religion', 'lb2']),
          topic('ge-lk11-lb2-medien', 'Industrialisierung international: Medien und Öffentlichkeit', ['medien', 'lb2']),
          topic('ge-lk11-lb2-erinnerung', 'Industrialisierung international: Erinnerung und Deutung', ['erinnerung', 'lb2']),
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
                  topic('ge-lk11-lbw-projekt-partizipation', 'Projekt: Partizipation vor Ort', ['projekt partizipation', 'lbw']),
          topic('ge-lk11-lbw-debatte', 'Historische Debatte moderieren', ['debatte', 'lbw']),
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
            topic('ge-lk12-lb1-frieden', 'Herausforderung Frieden – Überblick', ['Frieden']),
            topic('ge-lk12-lb1-kriegsursachen', 'Kriegsursachen und Friedensordnungen', [
              'Kriegsursachen',
              'Friedensvertrag',
              'Sicherheit',
            ]),
            topic('ge-lk12-lb1-institutionen', 'Internationale Institutionen und Konfliktlösung', [
              'UNO',
              'Diplomatie',
              'Abrüstung',
            ]),
                    topic('ge-lk12-lb1-theorie', 'Herausforderung Frieden: Theorien und Begriffe', ['theorie', 'lb1']),
          topic('ge-lk12-lb1-fallstudie-1', 'Herausforderung Frieden: Fallstudie I', ['fallstudie 1', 'lb1']),
          topic('ge-lk12-lb1-fallstudie-2', 'Herausforderung Frieden: Fallstudie II', ['fallstudie 2', 'lb1']),
          topic('ge-lk12-lb1-vergleich', 'Herausforderung Frieden: Historischer Vergleich', ['vergleich', 'lb1']),
          topic('ge-lk12-lb1-quellen', 'Herausforderung Frieden: Quellenarbeit', ['quellen', 'lb1']),
          topic('ge-lk12-lb1-akteure', 'Herausforderung Frieden: Akteure und Interessen', ['akteure', 'lb1']),
          topic('ge-lk12-lb1-strukturen', 'Herausforderung Frieden: Strukturen und Prozesse', ['strukturen', 'lb1']),
          topic('ge-lk12-lb1-alltag', 'Herausforderung Frieden: Alltag und Erfahrung', ['alltag', 'lb1']),
          topic('ge-lk12-lb1-ideen', 'Herausforderung Frieden: Ideen und Ideologien', ['ideen', 'lb1']),
          topic('ge-lk12-lb1-gewalt', 'Herausforderung Frieden: Gewalt und Konflikt', ['gewalt', 'lb1']),
          topic('ge-lk12-lb1-recht', 'Herausforderung Frieden: Recht und Verfassung', ['recht', 'lb1']),
          topic('ge-lk12-lb1-wirtschaft', 'Herausforderung Frieden: Wirtschaft und Gesellschaft', ['wirtschaft', 'lb1']),
          topic('ge-lk12-lb1-geschlecht', 'Herausforderung Frieden: Geschlecht und Teilhabe', ['geschlecht', 'lb1']),
          topic('ge-lk12-lb1-religion', 'Herausforderung Frieden: Religion und Weltbilder', ['religion', 'lb1']),
          topic('ge-lk12-lb1-medien', 'Herausforderung Frieden: Medien und Öffentlichkeit', ['medien', 'lb1']),
          topic('ge-lk12-lb1-erinnerung', 'Herausforderung Frieden: Erinnerung und Deutung', ['erinnerung', 'lb1']),
          topic('ge-lk12-lb1-international', 'Herausforderung Frieden: Internationale Bezüge', ['international', 'lb1']),
          topic('ge-lk12-lb1-regional', 'Herausforderung Frieden: Regionalgeschichte', ['regional', 'lb1']),
          topic('ge-lk12-lb1-methoden', 'Herausforderung Frieden: Methoden historischen Arbeitens', ['methoden', 'lb1']),
          topic('ge-lk12-lb1-urteil', 'Herausforderung Frieden: Historisches Urteilen', ['urteil', 'lb1']),
          topic('ge-lk12-lb1-kontinuitaet', 'Herausforderung Frieden: Kontinuität und Wandel', ['kontinuitaet', 'lb1']),
          topic('ge-lk12-lb1-zaesur', 'Herausforderung Frieden: Zäsuren und Periodisierung', ['zaesur', 'lb1']),
          topic('ge-lk12-lb1-macht', 'Herausforderung Frieden: Macht und Herrschaft', ['macht', 'lb1']),
],
        ),
        area('lb2', 'Formen von Geschichtskultur und Identitätsbildung', 45, [
          topic('ge-lk12-lb2-geschichtskultur', 'Geschichtskultur – Überblick', [
            'Geschichtskultur',
            'Identität',
          ]),
          topic('ge-lk12-lb2-erinnerung', 'Erinnerungskultur und öffentliche Geschichte', [
            'Erinnerung',
            'Denkmal',
            'Gedenken',
          ]),
          topic('ge-lk12-lb2-identitaet', 'Historische Identitätsbildung', [
            'Identität',
            'Narrative',
            'Geschichtspolitik',
          ]),
          topic("ge-lk12-lb2-instrumentalisierung", "Instrumentalisierung von Geschichte", [
            "Instrumentalisierung",
            "Geschichtspolitik",
            "Deutung",
            "Mythos",
            "Rezeption",
          ]),
                  topic('ge-lk12-lb2-theorie', 'Geschichtskultur/Identität: Theorien und Begriffe', ['theorie', 'lb2']),
          topic('ge-lk12-lb2-fallstudie-1', 'Geschichtskultur/Identität: Fallstudie I', ['fallstudie 1', 'lb2']),
          topic('ge-lk12-lb2-fallstudie-2', 'Geschichtskultur/Identität: Fallstudie II', ['fallstudie 2', 'lb2']),
          topic('ge-lk12-lb2-vergleich', 'Geschichtskultur/Identität: Historischer Vergleich', ['vergleich', 'lb2']),
          topic('ge-lk12-lb2-quellen', 'Geschichtskultur/Identität: Quellenarbeit', ['quellen', 'lb2']),
          topic('ge-lk12-lb2-akteure', 'Geschichtskultur/Identität: Akteure und Interessen', ['akteure', 'lb2']),
          topic('ge-lk12-lb2-strukturen', 'Geschichtskultur/Identität: Strukturen und Prozesse', ['strukturen', 'lb2']),
          topic('ge-lk12-lb2-alltag', 'Geschichtskultur/Identität: Alltag und Erfahrung', ['alltag', 'lb2']),
          topic('ge-lk12-lb2-ideen', 'Geschichtskultur/Identität: Ideen und Ideologien', ['ideen', 'lb2']),
          topic('ge-lk12-lb2-gewalt', 'Geschichtskultur/Identität: Gewalt und Konflikt', ['gewalt', 'lb2']),
          topic('ge-lk12-lb2-recht', 'Geschichtskultur/Identität: Recht und Verfassung', ['recht', 'lb2']),
          topic('ge-lk12-lb2-wirtschaft', 'Geschichtskultur/Identität: Wirtschaft und Gesellschaft', ['wirtschaft', 'lb2']),
          topic('ge-lk12-lb2-geschlecht', 'Geschichtskultur/Identität: Geschlecht und Teilhabe', ['geschlecht', 'lb2']),
          topic('ge-lk12-lb2-religion', 'Geschichtskultur/Identität: Religion und Weltbilder', ['religion', 'lb2']),
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
