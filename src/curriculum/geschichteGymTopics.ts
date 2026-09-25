/**
 * Gymnasium Sachsen · Geschichte — Lehrplan-Outline (lplanid=65).
 * K6 LB1 (Römische Zivilisation) freigegeben; übrige Themen: released:false
 * (nur Entwickleransicht). Quelle: https://www.schulportal.sachsen.de/lplandb/lehrplan/65
 */
import { ROM_YEAR_FACT_COUNT } from './geschichte6'
import type { PackArea, PackGrade, PackTopic } from './pack'
import { DEFAULT_TASKS_PER_ROUND } from './tasksPerRound'

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
  tasksPerRound: opts?.tasksPerRound ?? DEFAULT_TASKS_PER_ROUND,
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
        ]),
        area('lb3', 'Zusammenleben im antiken Griechenland', 8, [
          topic('ge-k5-lb3-griechenland', 'Antikes Griechenland – Überblick', [
            'Griechenland',
            'Polis',
            'Antike',
          ]),
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
        ]),
        area('lb2', 'Herrschaft und Lebensformen im Mittelalter', 20, [
          topic('ge-k6-lb2-mittelalter', 'Mittelalter – Überblick', [
            'Mittelalter',
            'Herrschaft',
            'Leben',
          ]),
          topic('ge-k6-lb2-lehnswesen', 'Lehnswesen und Vasallität', [
            'Lehen',
            'Vasall',
            'Treueeid',
          ]),
          topic('ge-k6-lb2-alltag-staende', 'Ständeordnung und Alltag', [
            'Stände',
            'Grundherrschaft',
            'Bauern',
          ]),
          topic('ge-k6-lb2-staedte', 'Städtisches Leben und Zünfte', [
            'Markt',
            'Zunft',
            'Stadtluft',
          ]),
        ]),
        area('lb3', 'Religionen und Kulturen im Mit- und Gegeneinander', 10, [
          topic('ge-k6-lb3-religionen', 'Religionen und Kulturen – Überblick', [
            'Religion',
            'Kultur',
          ]),
          topic('ge-k6-lb3-christentum', 'Christentum im Mittelalter', [
            'Kirche',
            'Kloster',
            'Papst',
          ]),
          topic('ge-k6-lb3-islam', 'Entstehung und Ausbreitung des Islams', [
            'Islam',
            'Koran',
            'Mekka',
          ]),
          topic('ge-k6-lb3-begegnung', 'Begegnung, Konflikte und Kreuzzüge', [
            'Kreuzzug',
            'Jerusalem',
            'Toleranz',
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
        ]),
        area('lb3', 'Längsschnitt: Industrialisierung und Kinderarbeit', 6, [
          topic('ge-k8-lb3-kinderarbeit', 'Längsschnitt: Industrialisierung und Kinderarbeit', [
            'Kinderarbeit',
            'Industrialisierung',
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
