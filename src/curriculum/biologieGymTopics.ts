/**
 * Gymnasium Sachsen · Biologie — Lehrplan-Outline (lplanid=522).
 * Lehrplan structure is authoritative; denser PackTopics under each LB draw on
 * Schlaukopf Bio-Gym quiz themes (original German wording — no verbatim copy).
 * Surveyed: https://www.schlaukopf.de/gymnasium/klasse{5–10}/biologie/ + Oberstufe.
 * released:false → Entwickler.
 */
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
  hint: 'Tippe oder wähle die Antwort. Erklärung erscheint nach dem Prüfen.',
  released: opts?.released ?? false,
  tasksPerRound: opts?.tasksPerRound ?? DEFAULT_TASKS_PER_ROUND,
  ...(keywords?.length ? { keywords } : {})})

const area = (id: string, title: string, ustd: number | undefined, topics: PackTopic[]): PackArea => ({
  id,
  title,
  ...(ustd !== undefined ? { ustd } : {}),
  topics})

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
  areas})

/** Official Lernbereiche laut Lehrplan Gymnasium Biologie (Sachsen), denser topics. */
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
          topic('bi-k5-lb1-merkmale', 'Merkmale des Lebens – Überblick', [
            'Reizbarkeit',
            'Stoffwechsel',
            'Fortpflanzung',
            'Bewegung',
          ], { released: true }),
          topic('bi-k5-lb1-kennzeichen', 'Kennzeichen der Lebewesen', [
            'Kennzeichen',
            'Lebewesen',
            'Stoffwechsel',
          ], { released: true }),
          topic('bi-k5-lb1-arbeitsweisen', 'Arbeitsweisen der Biologen', [
            'Beobachten',
            'Untersuchen',
            'Vergleichen',
          ]),
        ]),
        area('lb2', 'Fische in ihren Lebensräumen', 8, [
          topic('bi-k5-lb2-fische', 'Fische – Überblick', [
            'Kiemen',
            'Flossen',
            'Stromlinienform',
          ], { released: true }),
          topic('bi-k5-lb2-fische-aufbau', 'Fische – Aufbau und Bestandteile', [
            'Körperbau',
            'Flossen',
            'Kiemendeckel',
            'Seitenlinie',
          ], { released: true }),
          topic('bi-k5-lb2-fische-merkmale', 'Fische – Merkmale und Angepasstheit', [
            'Kiemen',
            'Schuppen',
            'Seitenlinie',
          ], { released: true }),
          topic('bi-k5-lb2-fische-lebensraum', 'Fische – Lebensraum und Vielfalt', [
            'Süßwasser',
            'Salzwasser',
            'Gewässer',
            'Raubfisch',
            'Friedfisch',
          ], { released: true }),
          topic('bi-k5-lb2-fische-schutz', 'Fische – Fortpflanzung und Schutz', [
            'Laich',
            'Gewässerschutz',
            'Befruchtung',
            'Rogen',
          ], { released: true }),
        ]),
        area('lb3', 'Lurche in ihren Lebensräumen', 7, [
          topic('bi-k5-lb3-lurche', 'Lurche – Überblick', [
            'Amphibien',
            'Metamorphose',
            'Hautatmung',
          ], { released: true }),
          topic('bi-k5-lb3-lurche-merkmale', 'Lurche – Merkmale und Haut', [
            'Hautatmung',
            'Feuchte Haut',
          ], { released: true }),
          topic('bi-k5-lb3-lurche-meta', 'Lurche – Metamorphose', [
            'Kaulquappe',
            'Laich',
            'Metamorphose',
          ], { released: true }),
          topic('bi-k5-lb3-lurche-fortpflanzung', 'Lurche – Fortpflanzung', [
            'Laich',
            'Äußere Befruchtung',
            'Laichgewässer',
            'Kaulquappe',
          ], { released: true }),
          topic('bi-k5-lb3-lurche-schutz', 'Lurche – Lebensraum und Schutz', [
            'Amphibienschutz',
            'Wanderung',
          ], { released: true }),
        ]),
        area('lb4', 'Kriechtiere in ihren Lebensräumen', 7, [
          topic('bi-k5-lb4-kriechtiere', 'Kriechtiere – Überblick', [
            'Reptilien',
            'Hornschicht',
            'Lungen',
          ], { released: true }),
          topic('bi-k5-lb4-kriechtiere-merkmale', 'Kriechtiere – Merkmale und Landleben', [
            'Schuppen',
            'Eiablage',
            'Poikilotherm',
          ], { released: true }),
          topic('bi-k5-lb4-kriechtiere-arten', 'Kriechtiere – heimische Arten', [
            'Eidechse',
            'Schlange',
            'Schildkröte',
          ], { released: true }),
          topic('bi-k5-lb4-kriechtiere-fortpflanzung', 'Kriechtiere – Fortpflanzung', [
            'Innere Befruchtung',
            'Schalenei',
            'Dotter',
            'Eiablage',
          ], { released: true }),
          topic('bi-k5-lb4-kriechtiere-schutz', 'Kriechtiere – Schutz und Artenschutz', [
            'Artenschutz',
            'Lebensraum',
          ]),
        ]),
        area('lb5', 'Vögel in ihren Lebensräumen', 9, [
          topic('bi-k5-lb5-voegel', 'Vögel – Überblick', [
            'Federn',
            'Luftsäcke',
            'Schnabel',
          ], { released: true }),
          topic('bi-k5-lb5-voegel-aufbau', 'Angepasstheit der Vögel (Körperbau und Atmung)', [
            'Körperbau',
            'Kropf',
            'Muskelmagen',
            'Luftsäcke',
            'Stromlinienform',
            'Brustbeinkamm',
          ], { released: true }),
          topic('bi-k5-lb5-voegel-flug', 'Vögel – Flug und Federkleid', [
            'Flug',
            'Federn',
            'Knochen',
          ], { released: true }),
          topic('bi-k5-lb5-voegel-fortpflanzung', 'Vögel – Fortpflanzung und Brutpflege', [
            'Nest',
            'Nesthocker',
            'Nestflüchter',
          ], { released: true }),
          topic('bi-k5-lb5-voegel-schnabel', 'Vögel – Schnabelformen und Nahrung', [
            'Schnabel',
            'Nahrung',
            'Angepasstheit',
          ]),
          topic('bi-k5-lb5-voegel-verhalten', 'Vögel – Revier, Balz und Gesang', [
            'Revier',
            'Balz',
            'Vogelgesang',
          ]),
          topic('bi-k5-lb5-voegel-schutz', 'Vögel – Schutz und Artenschutz', [
            'Vogelschutz',
            'Artenschutz',
          ]),
        ]),
        area('lb6', 'Säugetiere in ihren Lebensräumen', 13, [
          topic('bi-k5-lb6-saeugetiere', 'Säugetiere – Überblick', [
            'Fell',
            'Säugen',
            'Gleichwarm',
          ], { released: true }),
          topic('bi-k5-lb6-saeuger-merkmale', 'Säugetiere – Merkmale und Gebiss', [
            'Gebiss',
            'Fell',
            'Säugen',
          ], { released: true }),
          topic('bi-k5-lb6-saeuger-skelett', 'Körpergliederung und Skelett', [
            'Skelett',
            'Schädel',
            'Wirbelsäule',
            'Gliedmaßen',
          ], { released: true }),
          topic('bi-k5-lb6-saeuger-angepasst', 'Säugetiere – Angepasstheit und Lebensräume', [
            'Angepasstheit',
            'Lebensraum',
          ], { released: true }),
          topic('bi-k5-lb6-saeuger-lunge', 'Säugetiere – Lunge und Gasaustausch', [
            'Lunge',
            'Lungenbläschen',
            'Oberflächenvergrößerung',
            'Gasaustausch',
          ]),
          topic('bi-k5-lb6-saeuger-verhalten', 'Säugetiere – Verhalten beobachten', [
            'Verhalten',
            'Beobachtung',
          ]),
          topic('bi-k5-lb6-saeuger-sinne', 'Säugetiere – Sinne und Kommunikation', [
            'Sinne',
            'Sender-Empfänger',
          ]),
          topic('bi-k5-lb6-saeuger-sozial', 'Säugetiere – Sozialverhalten', [
            'Rudel',
            'Rangordnung',
            'Revier',
          ]),
          topic('bi-k5-lb6-saeuger-schutz', 'Säugetiere – Schutz und Vielfalt', [
            'Artenschutz',
            'Vielfalt',
          ], { released: true }),
          topic('bi-k5-lb6-saeuger-fortpflanzung', 'Säugetiere – Fortpflanzung und Mensch', [
            'Geschlechtsorgane',
            'Pubertät',
            'Menstruation',
            'Pollution',
            'Eltern-Kind',
          ], { released: true }),
        ]),
        area('lb7', 'Systematisierung', 3, [
          topic('bi-k5-lb7-systematik', 'Wirbeltiere vergleichen', [
            'Systematik',
            'Vergleich',
            'Atmung',
          ], { released: true }),
          topic('bi-k5-lb7-zuordnung', 'Wirbeltiere zuordnen (Merkmale → Gruppe)', [
            'Zuordnung',
            'Merkmale',
          ], { released: true }),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('bi-k5-lbw-winter', 'Wirbeltiere im Winter', [
            'Winterschlaf',
            'Winterruhe',
            'Kältestarre',
            'Vogelzug',
          ], { released: true }),
          topic('bi-k5-lbw-saurier', 'Kriechtiere vergangener Zeiten', [
            'Saurier',
            'Fossilien',
          ], { tasksPerRound: 10, released: true }),
          topic('bi-k5-lbw-haltung', 'Artgerechte Tierhaltung', [
            'Aquarium',
            'Terrarium',
            'Tierschutz',
          ], { tasksPerRound: 10, released: true }),
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
          topic('bi-k6-lb1-samenpflanzen', 'Samenpflanzen – Überblick', [
            'Blüte',
            'Samen',
            'Frucht',
          ]),
          topic('bi-k6-lb1-organe', 'Spross, Blatt und Wurzel', [
            'Wurzel',
            'Blatt',
            'Spross',
          ]),
          topic('bi-k6-lb1-fotosynthese', 'Fotosynthese beim Laubblatt', [
            'Fotosynthese',
            'Chlorophyll',
            'CO₂',
          ]),
          topic('bi-k6-lb1-bluete', 'Blütenpflanzen – Blüte und Bestäubung', [
            'Blüte',
            'Bestäubung',
            'Narbe',
          ]),
          topic('bi-k6-lb1-familien', 'Kreuz-, Lippen- und Schmetterlingsblüten', [
            'Kreuzblütler',
            'Lippenblüte',
            'Schmetterlingsblüte',
          ]),
          topic('bi-k6-lb1-bestimmung', 'Bestimmen, Blütendiagramm und Herbarium', [
            'Bestimmungsschlüssel',
            'Herbarium',
            'Blütendiagramm',
          ]),
          topic('bi-k6-lb1-baeume', 'Bäume und Holzpflanzen', [
            'Baum',
            'Holz',
            'Jahresring',
          ]),
        ]),
        area('lb2', 'Wirbellose Tiere in ihren Lebensräumen', 16, [
          topic('bi-k6-lb2-wirbellose', 'Wirbellose – Überblick', [
            'Gliederfüßer',
            'Weichtiere',
            'Wirbellos',
          ], { released: true }),
          topic('bi-k6-lb2-insekten', 'Insekten – Bau und Metamorphose', [
            'Insekt',
            'Metamorphose',
            'Chitin',
          ], { released: true }),
          topic('bi-k6-lb2-spinnen', 'Spinnentiere', [
            'Spinne',
            'Acht Beine',
            'Milben',
          ], { released: true }),
          topic('bi-k6-lb2-krebstiere', 'Krebstiere', [
            'Flusskrebs',
            'Wasserfloh',
            'Kieme',
          ], { released: true }),
          topic('bi-k6-lb2-ringelwuermer', 'Ringelwürmer', [
            'Regenwurm',
            'Blutegel',
            'Segment',
          ], { released: true }),
          topic('bi-k6-lb2-rundwuermer', 'Rundwürmer', [
            'Nematoden',
            'Askaris',
            'Parasit',
          ], { released: true }),
          topic('bi-k6-lb2-nesseltiere', 'Hohltiere', [
            'Qualle',
            'Koralle',
            'Nesselzelle',
          ], { released: true }),
          topic('bi-k6-lb2-ordnungen', 'Insektenordnungen und Mundwerkzeuge', [
            'Käfer',
            'Hautflügler',
            'Mundwerkzeuge',
          ]),
          topic('bi-k6-lb2-honigbiene', 'Honigbiene und Tierstaat', [
            'Königin',
            'Arbeiterin',
            'Schwänzeltanz',
          ]),
          topic('bi-k6-lb2-parasiten', 'Parasitische Wirbellose', [
            'Parasit',
            'Zecke',
            'Spulwurm',
          ]),
          topic('bi-k6-lb2-insekten-atmung', 'Insekten – Tracheenatmung und Landleben', [
            'Tracheen',
            'Stigmen',
            'Trockenlufttier',
          ]),
        ]),
        area('lb3', 'Systematisierung', 4, [
          topic('bi-k6-lb3-systematik', 'Wirbellose und Wirbeltiere vergleichen', [
            'Vergleich',
            'Systematik',
          ]),
          topic('bi-k6-lb3-skelett-vergleich', 'Außen- und Innenskelett vergleichen', [
            'Exoskelett',
            'Endoskelett',
          ]),
          topic('bi-k6-lb3-atmung-vergleich', 'Atmungsorgane vergleichen', [
            'Kiemen',
            'Tracheen',
            'Lungen',
          ]),
          topic('bi-k6-lb3-fortpflanzung-formen', 'Fortpflanzungsformen vergleichen', [
            'ungeschlechtlich',
            'geschlechtlich',
            'Zwitter',
          ]),
        ]),
        area('lb4', 'Wald als Lebensgemeinschaft', 10, [
          topic('bi-k6-lb4-wald', 'Wald als Lebensgemeinschaft', [
            'Ökosystem',
            'Nahrungsnetz',
          ]),
          topic('bi-k6-lb4-nahrung', 'Nahrungsnetz und Stockwerke im Wald', [
            'Produzent',
            'Konsument',
            'Destruent',
          ]),
          topic('bi-k6-lb4-sporempflanzen', 'Moose, Farne und Pilze im Wald', [
            'Spore',
            'Moos',
            'Farn',
          ]),
          topic('bi-k6-lb4-waldschutz', 'Wald: Bedeutung, Gefährdung, Schutz', [
            'Waldschaden',
            'Nachhaltigkeit',
            'Mischwald',
          ]),
        ]),
        area('lb5', 'Pflanzliche und tierische Zellen', 10, [
          topic('bi-k6-lb5-zellen', 'Zellen im Vergleich', [
            'Zelle',
            'Zellkern',
            'Mikroskop',
          ]),
          topic('bi-k6-lb5-mikroskop', 'Mikroskop und Zellorganellen', [
            'Mikroskop',
            'Chloroplast',
            'Vakuole',
          ]),
          topic('bi-k6-lb5-zelltheorie', 'Zelltheorie und Geschichte', [
            'Zelltheorie',
            'Hooke',
            'Virchow',
          ]),
          topic('bi-k6-lb5-organellen-energie', 'Mitochondrien und Chloroplasten', [
            'Mitochondrium',
            'Chloroplast',
            'ATP',
          ]),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('bi-k6-lbw-spinnen', 'Spinnen', [
            'Netzbau',
            'Beutefang',
            'Spinnenseide',
          ], { tasksPerRound: 10, released: true }),
          topic('bi-k6-lbw-weichtiere', 'Weichtiere', [
            'Mantel',
            'Schnecke',
            'Muschel',
          ], { tasksPerRound: 10, released: true }),
          topic('bi-k6-lbw-schnecken', 'Schnecken', [
            'Kriechfuß',
            'Radula',
            'Gehäuse',
          ], { tasksPerRound: 10, released: true }),
          topic('bi-k6-lbw-muscheln', 'Muscheln', [
            'Schalenklappen',
            'Filtrierer',
          ], { tasksPerRound: 10, released: true }),
          topic('bi-k6-lbw-kopffuesser', 'Kopffüßer', [
            'Tintenfisch',
            'Fangarme',
            'Rückstoß',
          ], { tasksPerRound: 10, released: true }),
          topic('bi-k6-lbw-heilen', 'Pflanzen helfen heilen', ['Heilpflanze'], {
            tasksPerRound: 10,
            released: true,
          }),
          topic('bi-k6-lbw-pfuetze', 'Leben in der Pfütze', ['Kleinstlebewesen'], {
            tasksPerRound: 10,
            released: true,
          }),
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
          topic('bi-k7-lb1-mikroben', 'Bakterien und Viren – Überblick', [
            'Bakterien',
            'Viren',
            'Hygiene',
          ]),
          topic('bi-k7-lb1-bakterien-bau', 'Bakterien – Bau und Bedeutung', [
            'Prokaryot',
            'Zellwand',
            'Zweiteilung',
          ]),
          topic('bi-k7-lb1-viren', 'Viren – Bau, Vermehrung und Bedeutung', [
            'Virus',
            'Kapsid',
            'Wirt',
          ]),
          topic('bi-k7-lb1-hygiene', 'Hygiene und Infektionsschutz', [
            'Hygiene',
            'Infektion',
          ]),
        ]),
        area('lb2', 'Blutkreislauf des Menschen und Immunbiologie', 7, [
          topic('bi-k7-lb2-blut', 'Blutkreislauf – Überblick', [
            'Herz',
            'Blut',
            'Immunsystem',
          ]),
          topic('bi-k7-lb2-herz', 'Herz und Gefäße', ['Herz', 'Arterie', 'Vene']),
          topic('bi-k7-lb2-gefaesse', 'Arterien, Venen und Kapillaren', [
            'Arterie',
            'Vene',
            'Kapillare',
          ]),
          topic('bi-k7-lb2-immun', 'Immunbiologie – Abwehr', [
            'Antikörper',
            'Impfung',
          ]),
          topic('bi-k7-lb2-puls-blutdruck', 'Puls und Blutdruck', [
            'Puls',
            'Blutdruck',
            'Messung',
          ]),
          topic('bi-k7-lb2-kreislauf-gesundheit', 'Gesunderhaltung Herz-Kreislauf', [
            'Bewegung',
            'Prävention',
            'Risikofaktoren',
          ]),
        ]),
        area('lb3', 'Ernährung, Verdauung und Ausscheidung beim Menschen', 10, [
          topic('bi-k7-lb3-ernaehrung', 'Ernährung und Verdauung – Überblick', [
            'Verdauung',
            'Nährstoffe',
          ]),
          topic('bi-k7-lb3-naehrstoffe', 'Nährstoffe und ausgewogene Ernährung', [
            'Kohlenhydrate',
            'Eiweiß',
            'Fett',
          ]),
          topic('bi-k7-lb3-ernaehrungsformen', 'Ernährungsformen und Essstörungen', [
            'Ernährungsformen',
            'Essstörungen',
            'heterotroph',
          ]),
          topic('bi-k7-lb3-organe', 'Verdauungsorgane und Resorption', [
            'Magen',
            'Darm',
            'Enzyme',
          ]),
          topic('bi-k7-lb3-atmung', 'Atmungssystem – Überblick', [
            'Atmung',
            'Lunge',
            'Atemwege',
          ]),
          topic('bi-k7-lb3-lunge', 'Bau und Funktion der Lunge', [
            'Lunge',
            'Bronchien',
            'Atemgase',
          ]),
          topic('bi-k7-lb3-gasaustausch', 'Lungenbläschen und Gasaustausch', [
            'Alveolen',
            'Gasaustausch',
            'Diffusion',
          ]),
          topic('bi-k7-lb3-atemmechanik', 'Atemmechanik und Belastung', [
            'Zwerchfell',
            'Brustatmung',
            'Bauchatmung',
            'Atemfrequenz',
          ]),
          topic('bi-k7-lb3-haut-niere', 'Haut und Niere als Ausscheidungsorgane', [
            'Haut',
            'Niere',
            'Harn',
          ]),
          topic('bi-k7-lb3-organe-schutz', 'Gesunderhaltung von Atmung und Ausscheidung', [
            'Rauchen',
            'Hautkrebs',
            'Organspende',
          ]),
        ]),
        area('lb4', 'Stütz- und Bewegungssystem des Menschen', 4, [
          topic('bi-k7-lb4-skelett', 'Knochen, Muskeln und Gelenke', [
            'Knochen',
            'Muskeln',
            'Gelenke',
          ]),
          topic('bi-k7-lb4-muskeln', 'Muskeln und Sehnen', ['Muskel', 'Sehne', 'Antagonist']),
          topic('bi-k7-lb4-gelenke', 'Gelenkarten und Bewegung', [
            'Scharniergelenk',
            'Kugelgelenk',
          ]),
          topic('bi-k7-lb4-haltung', 'Haltung und Haltungsschäden', [
            'Haltung',
            'Wirbelsäule',
            'Prävention',
          ]),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('bi-k7-lbw-ernaehrung-persoenlichkeit', 'Ernährung und Persönlichkeit', [
            'Ernährung',
          ], { tasksPerRound: 10 }),
          topic('bi-k7-lbw-fitness', 'Fitness und Gesundheit', ['Fitness'], {
            tasksPerRound: 10}),
          topic('bi-k7-lbw-mikroben', 'Mikroben und ihre Bedeutung', ['Mikroben'], {
            tasksPerRound: 10}),
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
          topic('bi-k8-lb1-sinne', 'Sinne und Nervensystem – Überblick', [
            'Sinne',
            'Nerven',
            'Hormone',
          ]),
          topic('bi-k8-lb1-nerv-reflex', 'Nervenzelle und Reflex', [
            'Axon',
            'Synapse',
            'Reflexbogen',
          ]),
          topic('bi-k8-lb1-auge-ohr', 'Auge und Ohr', ['Auge', 'Ohr', 'Reiz']),
          topic('bi-k8-lb1-haut', 'Haut als Sinnesorgan', [
            'Tastsinn',
            'Schmerz',
            'Thermoregulation',
          ]),
          topic('bi-k8-lb1-hormone', 'Hormonsystem', ['Hormon', 'Drüse']),
          topic('bi-k8-lb1-blutzucker', 'Blutzuckerregulation und Regelkreis', [
            'Insulin',
            'Glucagon',
            'Homöostase',
          ]),
          topic('bi-k8-lb1-auge-akkommodation', 'Auge – Akkommodation und Adaptation', [
            'Akkommodation',
            'Adaptation',
            'Gesunderhaltung',
          ]),
          topic('bi-k8-lb1-gehirn', 'Gehirn, Gedächtnis und Reflexe', [
            'Gehirn',
            'Gedächtnis',
            'Reflex',
          ]),
          topic('bi-k8-lb1-nerv-gesundheit', 'Gesunderhaltung des Nervensystems', [
            'Schlaf',
            'Stress',
            'Reizüberflutung',
          ]),
          topic('bi-k8-lb1-sucht', 'Suchtgefahren', [
            'Sucht',
            'Suchtmittel',
            'Prävention',
          ]),
          topic('bi-k8-lb1-vegetativ', 'Vegetatives Nervensystem', [
            'Sympathikus',
            'Parasympathikus',
            'unwillkürlich',
          ]),
          topic('bi-k8-lb1-hypophyse', 'Hypophyse und Nerven-Hormon-Regulation', [
            'Hypophyse',
            'Hypothalamus',
            'Regelkreis',
          ]),
        ]),
        area('lb2', 'Sexualität des Menschen', 11, [
          topic('bi-k8-lb2-sexualitaet', 'Sexualität des Menschen – Überblick', [
            'Sexualität',
            'Verantwortung',
          ]),
          topic('bi-k8-lb2-geschlechtsorgane', 'Keimdrüsen und Fortpflanzung', [
            'Hoden',
            'Eierstock',
            'Befruchtung',
          ]),
          topic('bi-k8-lb2-entwicklung', 'Entwicklung und Verantwortung', [
            'Pubertät',
            'Verantwortung',
          ]),
          topic('bi-k8-lb2-verantwortung', 'Verhütung, Schutz und Konsens', [
            'Verhütung',
            'STI',
            'Konsens',
          ]),
          topic('bi-k8-lb2-zyklus', 'Menstruationszyklus und Hormone', [
            'Zyklus',
            'Eisprung',
            'Hormone',
          ]),
          topic('bi-k8-lb2-vielfalt', 'Sexuelle Vielfalt, Konsens und Schutz', [
            'Vielfalt',
            'Konsens',
            'Jugendschutz',
          ]),
          topic('bi-k8-lb2-schwangerschaft', 'Schwangerschaft, Geburt und Verantwortung', [
            'Schwangerschaft',
            'Plazenta',
            'Geburt',
          ]),
          topic('bi-k8-lb2-sti', 'Sexuell übertragbare Krankheiten', [
            'STI',
            'HIV',
            'Schutz',
          ]),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('bi-k8-lbw-stress', 'Stress und Stressbewältigung', ['Stress'], {
            tasksPerRound: 10}),
          topic('bi-k8-lbw-sinne', 'Erleben mit allen Sinnen', ['Wahrnehmung'], {
            tasksPerRound: 10}),
          topic('bi-k8-lbw-erste-hilfe', 'Erste Hilfe', ['Erste Hilfe'], {
            tasksPerRound: 10}),
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
          topic('bi-k9-lb1-pflanzen', 'Samenpflanzen – Physiologie Überblick', [
            'Fotosynthese',
            'Transpiration',
          ]),
          topic('bi-k9-lb1-fotosynthese', 'Fotosynthese und Blattbau', [
            'Fotosynthese',
            'Chlorophyll',
          ]),
          topic('bi-k9-lb1-blatt', 'Spaltöffnungen und Blattgewebe', [
            'Spaltöffnung',
            'Mesophyll',
            'Cuticula',
          ]),
          topic('bi-k9-lb1-wasser', 'Wassertransport und Transpiration', [
            'Transpiration',
            'Xylem',
          ]),
          topic('bi-k9-lb1-wurzel-spross', 'Wurzel, Spross und Leitgewebe', [
            'Wurzel',
            'Xylem',
            'Phloem',
          ]),
          topic('bi-k9-lb1-organisation', 'Organisationsstufen des Lebendigen', [
            'Zelle',
            'Gewebe',
            'Organ',
          ]),
          topic('bi-k9-lb1-bestimmung', 'Bestimmen, Herbarisieren, Pflanzenfamilien', [
            'Bestimmungsschlüssel',
            'Herbar',
            'Pflanzenfamilie',
          ]),
          topic('bi-k9-lb1-bluete', 'Blüte, Bestäubung und Samenverbreitung', [
            'Blüte',
            'Bestäubung',
            'Frucht',
          ]),
          topic('bi-k9-lb1-organellen', 'Chloroplasten und Mitochondrien', [
            'Chloroplast',
            'Mitochondrium',
            'Doppelmembran',
          ]),
          topic('bi-k9-lb1-zellatmung', 'Zellatmung als Dissimilation', [
            'Zellatmung',
            'Dissimilation',
            'ATP',
          ]),
          topic('bi-k9-lb1-stoffwechsel', 'Stoffwechsel: Assimilation und Dissimilation', [
            'Assimilation',
            'Autotrophie',
            'Heterotrophie',
          ]),
        ]),
        area('lb2', 'Zusammenhänge im Ökosystem', 25, [
          topic('bi-k9-lb2-oekosystem', 'Ökosystem – Überblick', [
            'Ökosystem',
            'Stoffkreislauf',
          ]),
          topic('bi-k9-lb2-wald-gewaesser', 'Wald und Gewässer als Ökosysteme', [
            'Wald',
            'Gewässer',
          ]),
          topic('bi-k9-lb2-stoffkreis', 'Stoffkreisläufe und Energiefluss', [
            'Kohlenstoffkreislauf',
            'Energie',
          ]),
          topic('bi-k9-lb2-stickstoff', 'Stickstoffkreislauf', [
            'Stickstofffixierung',
            'Nitrat',
            'Knöllchenbakterien',
          ]),
          topic('bi-k9-lb2-nahrungskette', 'Nahrungsketten und -netze', [
            'Produzent',
            'Konsument',
            'Destruent',
          ]),
          topic('bi-k9-lb2-population', 'Populationen und Tragfähigkeit', [
            'Population',
            'Tragfähigkeit',
            'Nische',
          ]),
          topic('bi-k9-lb2-gewaesser', 'See – Zonierung und Plankton', [
            'Zonierung',
            'Plankton',
            'Zirkulation',
          ]),
          topic('bi-k9-lb2-sukzession', 'Sukzession und Verlandung', [
            'Sukzession',
            'Verlandung',
            'Pionier',
          ]),
          topic('bi-k9-lb2-faktoren', 'Abio- und biotische Faktoren', [
            'Toleranz',
            'Konkurrenz',
            'Symbiose',
          ]),
          topic('bi-k9-lb2-klima', 'Treibhauseffekt und Klimawandel', [
            'Treibhauseffekt',
            'Klimawandel',
            'Nachhaltigkeit',
          ]),
          topic('bi-k9-lb2-gewaesser-mensch', 'Menschlicher Einfluss auf Gewässer', [
            'Eutrophierung',
            'Abwasser',
            'Naturschutz',
          ]),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('bi-k9-lbw-wiese', 'Mikrokosmos Wiese', ['Wiese'], { tasksPerRound: 10 }),
          topic('bi-k9-lbw-pilze', 'Mannigfaltigkeit der Pilze', ['Pilze'], {
            tasksPerRound: 10}),
          topic('bi-k9-lbw-bier', 'Von der Gerste zum Bier', ['Gärung'], {
            tasksPerRound: 10}),
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
          topic('bi-k10-lb1-genetik', 'Genetik – Überblick', [
            'Mendel',
            'DNA',
            'Vererbung',
          ]),
          topic('bi-k10-lb1-mendel', 'Mendel-Regeln und Kreuzungen', [
            'Mendel',
            'Dominant',
            'Rezessiv',
          ]),
          topic('bi-k10-lb1-dna', 'DNA, Gene und Chromosomen', [
            'DNA',
            'Gen',
            'Chromosom',
          ]),
          topic('bi-k10-lb1-mutation-meiose', 'Mutation, Mitose und Meiose', [
            'Mutation',
            'Meiose',
            'Allel',
          ]),
          topic('bi-k10-lb1-humangenetik', 'Humangenetik und Ethik', [
            'Stammbaum',
            'Erbkrankheit',
            'Ethik',
          ]),
          topic('bi-k10-lb1-replikation', 'Identische Replikation der DNA', [
            'Replikation',
            'Replikationsgabel',
            'Polymerase',
          ]),
          topic('bi-k10-lb1-proteinsynthese', 'Proteinsynthese: Transkription und Translation', [
            'Transkription',
            'Translation',
            'genetischer Code',
          ]),
          topic('bi-k10-lb1-dna-entdeckung', 'DNA-Struktur: Franklin, Watson und Crick', [
            'Franklin',
            'Watson',
            'Crick',
          ]),
          topic('bi-k10-lb1-blutgruppen', 'Vererbung der Blutgruppen', [
            'AB0',
            'Rhesus',
            'Allel',
          ]),
          topic('bi-k10-lb1-geschlecht', 'Vererbung des Geschlechts und Vielfalt', [
            'XX',
            'XY',
            'Vielfalt',
          ]),
          topic('bi-k10-lb1-erbkrankheiten', 'Erbkrankheiten des Menschen', [
            'Trisomie 21',
            'PKU',
            'Hämophilie',
          ]),
          topic('bi-k10-lb1-zuechtung', 'Klassische Züchtung und Gentechnik', [
            'Züchtung',
            'Gentechnik',
            'Auslese',
          ]),
        ]),
        area('lb2', 'Entstehung der Artenvielfalt', 16, [
          topic('bi-k10-lb2-artenvielfalt', 'Artenvielfalt und Evolution – Überblick', [
            'Evolution',
            'Selektion',
          ]),
          topic('bi-k10-lb2-selektion', 'Selektion und Anpassung', [
            'Selektion',
            'Mutation',
          ]),
          topic('bi-k10-lb2-artbildung', 'Artbildung und Isolation', [
            'Artbildung',
            'Isolation',
            'Selektion',
          ]),
          topic('bi-k10-lb2-evolutionsbelege', 'Belege für die Evolution', [
            'Fossil',
            'Homologie',
            'DNA-Vergleich',
          ]),
          topic('bi-k10-lb2-evolutionstheorie', 'Historische Evolutionstheorien', [
            'Darwin',
            'Lamarck',
            'Selektion',
          ]),
          topic('bi-k10-lb2-progression', 'Progression und Oberflächenvergrößerung', [
            'Progression',
            'Homologie',
            'Angepasstheit',
          ]),
          topic('bi-k10-lb2-spezialisierung', 'Spezialisierung und Angepasstheit', [
            'Spezialisierung',
            'Vogelschnabel',
            'Bestäubung',
          ]),
          topic('bi-k10-lb2-verhalten', 'Verhalten: Prägung, Lernen, Reproduktionserfolg', [
            'Prägung',
            'Nachahmung',
            'Reproduktionserfolg',
          ]),
        ]),
        area('lb3', 'Stammesgeschichte des Menschen', 9, [
          topic('bi-k10-lb3-mensch', 'Stammesgeschichte des Menschen', [
            'Hominiden',
            'Evolution',
          ]),
          topic('bi-k10-lb3-methoden', 'Methoden: Fossilien, Homologie, DNA', [
            'Fossil',
            'Homologie',
            'Bipedie',
          ]),
          topic('bi-k10-lb3-erdzeit', 'Organismen von der Erdfrühzeit bis zur Erdneuzeit', [
            'Erdzeitalter',
            'Fossil',
            'Zeit',
          ]),
          topic('bi-k10-lb3-menschenaffen', 'Mensch und Menschenaffen im Vergleich', [
            'Menschenaffe',
            'Bipedie',
            'Werkzeug',
          ]),
          topic('bi-k10-lb3-homininen', 'Homininen: Australopithecus bis Homo sapiens', [
            'Australopithecus',
            'Homo erectus',
            'Neandertaler',
          ]),
          topic('bi-k10-lb3-kultur', 'Biologische und kulturelle Evolution', [
            'Feuer',
            'Feldbau',
            'Antirassismus',
          ]),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('bi-k10-lbw-transgen', 'Transgene Organismen', ['Gentechnik'], {
            tasksPerRound: 10}),
          topic('bi-k10-lbw-leben', 'Entstehung des Lebens auf der Erde', ['Ursuppe'], {
            tasksPerRound: 10}),
          topic('bi-k10-lbw-lernen', 'Lernen und Gedächtnis', ['Gedächtnis'], {
            tasksPerRound: 10}),
        ]),
      ],
    ),
    grade(
      'biologie-jgs-11-gk',
      'Jahrgangsstufe 11 – Grundkurs',
      'Jahrgangsstufe 11 – Grundkurs',
      'Zellbiologie, Stoffwechsel sowie Ökologie und Nachhaltigkeit (Grundkurs).',
      ['Zelle', 'Dissimilation', 'Ökologie'],
      [
        area(
          'lb1',
          'Zellen, Gewebe und Organe und deren funktionsbezogene Differenzierung',
          24,
          [
            topic('bi-gk11-lb1-zellen', 'Zellen, Gewebe und Organe', [
              'Differenzierung',
              'Zelle',
            ]),
            topic('bi-gk11-lb1-organellen', 'Zellorganellen und Kompartimente', [
              'Organell',
              'Membran',
            ]),
            topic('bi-gk11-lb1-gewebe', 'Gewebe und Organbildung', ['Gewebe', 'Differenzierung']),
            topic('bi-gk11-lb1-osmose', 'Diffusion, Osmose und Plasmolyse', ['Osmose', 'Plasmolyse', 'Wasserpotenzial']),
            topic('bi-gk11-lb1-transport', 'Passiver und aktiver Membrantransport', ['Carrier', 'ATP', 'Endocytose']),
            topic('bi-gk11-lb1-wassertransport', 'Wassertransport der Pflanze', ['Transpiration', 'Xylem', 'Kohäsion']),
            topic('bi-gk11-lb1-mikroskop-praktikum', 'Mikroskopisches Praktikum Zelle–Gewebe–Organ', ['Mikroskop', 'Gewebe', 'Präparat']),
            topic('bi-gk11-lb1-genregulation', 'Genregulation bei Eukaryoten', ['Promotor', 'Epigenetik', 'Transkriptionsfaktor']),
            topic('bi-gk11-lb1-replikation', 'DNA-Replikation', ['Semikonservativ', 'Okazaki', 'Polymerase']),
            topic('bi-gk11-lb1-proteinbiosynthese', 'Proteinbiosynthese', ['Transkription', 'Translation', 'Ribosom']),
            topic('bi-gk11-lb1-enzyme', 'Enzyme – Spezifität und Hemmung', ['Enzym', 'Aktivierungsenergie', 'Hemmung']),
          ],
        ),
        area(
          'lb2',
          'Assimilation und Dissimilation – Redoxprozesse zellulärer Strukturen',
          15,
          [
            topic('bi-gk11-lb2-stoffwechsel', 'Assimilation und Dissimilation', [
              'Fotosynthese',
              'Zellatmung',
            ]),
            topic('bi-gk11-lb2-fotosynthese', 'Fotosynthese – Licht- und Calvin-Reaktionen', [
              'Chloroplast',
              'Calvin-Zyklus',
            ]),
            topic('bi-gk11-lb2-atmung', 'Zellatmung und Energiebilanz', ['ATP', 'Mitochondrium']),
                    topic('bi-gk11-lb2-redox', 'Redoxprozesse in der Zelle', ['redox', 'lb2']),
          topic('bi-gk11-lb2-energiebilanz', 'Energiebilanz Assimilation/Dissimilation', ['energiebilanz', 'lb2']),
          topic('bi-gk11-lb2-kompartimente', 'Kompartimente des Stoffwechsels', ['kompartimente', 'lb2']),
],
        ),
        area('lb3', 'Ökologie und Nachhaltigkeit', 13, [
          topic('bi-gk11-lb3-oekologie', 'Ökologie und Nachhaltigkeit', [
            'Nachhaltigkeit',
            'Ökologie',
          ]),
          topic('bi-gk11-lb3-populationen', 'Populationen und nachhaltige Nutzung', [
            'Population',
            'Tragfähigkeit',
            'Bioindikator',
          ]),
          topic('bi-gk11-lb3-kreislauf', 'Stoffkreisläufe und Energiefluss', [
            'Kohlenstoffkreislauf',
            'Energiefluss',
          ]),
          topic('bi-gk11-lb3-faktoren', 'Abio- und biotische Faktoren und Nische', ['Nische', 'Toleranz', 'Konkurrenz']),
          topic('bi-gk11-lb3-schaedlinge', 'Monokulturen, Schädlinge und Insektensterben', ['Monokultur', 'Nützling', 'Resistenz']),
          topic('bi-gk11-lb3-naturschutz', 'Naturschutz, Klima und Management', ['Naturschutz', 'Treibhauseffekt', 'Renaturierung']),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('bi-gk-lbw-wueste', 'Leben in der Wüste', ['Wüste'], { tasksPerRound: 10 }),
          topic('bi-gk-lbw-energie', 'Energiehaushalt von Mensch und Tier', ['Energie'], {
            tasksPerRound: 10}),
          topic('bi-gk-lbw-gaerung', 'Gärung', ['Gärung'], { tasksPerRound: 10 }),
          topic('bi-gk-lbw-fliesgewaesser', 'Fließgewässer', ['Fluss'], { tasksPerRound: 10 }),
        ]),
      ],
    ),
    grade(
      'biologie-jgs-12-gk',
      'Jahrgangsstufe 12 – Grundkurs',
      'Jahrgangsstufe 12 – Grundkurs',
      'Genetik, Zellkommunikation und Biodiversität (Grundkurs).',
      ['Genetik', 'Kommunikation', 'Biodiversität'],
      [
        area('lb1', 'Grundlagen, Anwendungen und Perspektiven der Genetik', 18, [
          topic('bi-gk12-lb1-genetik', 'Genetik – Grundlagen und Perspektiven', [
            'Gentechnik',
            'DNA',
          ]),
          topic('bi-gk12-lb1-dna', 'DNA, Gene und Proteinbiosynthese', ['DNA', 'Transkription']),
          topic('bi-gk12-lb1-anwendung', 'Anwendungen und ethische Perspektiven der Genetik', [
            'Gentechnik',
            'Ethik',
          ]),
          topic('bi-gk12-lb1-humangenetik', 'Humangenetik und molekularbiologische Methoden', ['Stammbaum', 'PCR', 'Sequenzierung']),
          topic('bi-gk12-lb1-gentherapie', 'Gentherapie, Stammzellen und PID', ['Gentherapie', 'Stammzellen', 'Ethik']),
                  topic('bi-gk12-lb1-mendel', 'Mendel-Regeln und Erbgänge', ['mendel', 'lb1']),
          topic('bi-gk12-lb1-molekular', 'Molekularbiologie der Vererbung', ['molekular', 'lb1']),
          topic('bi-gk12-lb1-ethik', 'Bioethik der Gentechnik', ['ethik', 'lb1']),
]),
        area('lb2', 'Kommunikation zwischen Zellen', 10, [
          topic('bi-gk12-lb2-kommunikation', 'Kommunikation zwischen Zellen', [
            'Signal',
            'Rezeptor',
          ]),
          topic('bi-gk12-lb2-signalwege', 'Signaltransduktion und Zielzellen', [
            'Signaltransduktion',
            'Ligand',
            'Second Messenger',
          ]),
          topic('bi-gk12-lb2-stoerung', 'Störungen der Zellkommunikation', ['Krankheit', 'Signal']),
          topic('bi-gk12-lb2-immun', 'Immunbiologie – unspezifisch und spezifisch', ['Antikörper', 'Impfung', 'Antigen']),
          topic('bi-gk12-lb2-neuro', 'Neurophysiologie – Potenziale und Synapsen', ['Aktionspotenzial', 'Synapse', 'Transmitter']),
        ]),
        area('lb3', 'Biodiversität und ihre Entstehung', 14, [
          topic('bi-gk12-lb3-biodiversitaet', 'Biodiversität und ihre Entstehung', [
            'Biodiversität',
            'Evolution',
          ]),
          topic('bi-gk12-lb3-artbildung', 'Artbildung und Selektion', ['Artbildung', 'Selektion']),
          topic('bi-gk12-lb3-schutz', 'Erhalt der Biodiversität', ['Naturschutz', 'Hotspot']),
          topic('bi-gk12-lb3-verhalten', 'Verhaltensursachen und adaptiver Wert', ['Proximately', 'Ultimat', 'Fitness']),
          topic('bi-gk12-lb3-abgrenzung', 'Abgrenzung nicht-naturwissenschaftlicher Auffassungen', ['Empirie', 'Falsifizierbar', 'Theorie']),
          topic('bi-gk12-lb3-molekular', 'Molekulare Homologien und Stammbäume', ['Sequenz', 'Phylogenie', 'Homologie']),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('bi-gk-lbw-allergien', 'Allergien', ['Allergie'], { tasksPerRound: 10 }),
          topic('bi-gk-lbw-krebs', 'Krebs', ['Tumor'], { tasksPerRound: 10 }),
          topic('bi-gk-lbw-nerven', 'Nervensysteme', ['Nerven'], { tasksPerRound: 10 }),
          topic('bi-gk-lbw-verhalten', 'Verhaltensbiologisches Praktikum', ['Verhalten'], {
            tasksPerRound: 10}),
          topic('bi-gk-lbw-gentechnik', 'Grüne Gentechnik', ['Gentechnik'], {
            tasksPerRound: 10}),
        ]),
      ],
    ),
    grade(
      'biologie-jgs-11-lk',
      'Jahrgangsstufe 11 – Leistungskurs',
      'Jahrgangsstufe 11 – Leistungskurs',
      'Vertiefte Zellbiologie, Stoffwechsel sowie Ökologie und Nachhaltigkeit.',
      ['Zelle', 'Stoffwechsel', 'Ökologie'],
      [
        area(
          'lb1',
          'Zellen, Gewebe und Organe und deren funktionsbezogene Differenzierung',
          55,
          [
            topic('bi-lk11-lb1-zellen', 'Zellen, Gewebe und Organe', [
              'Differenzierung',
              'Zelle',
            ]),
            topic('bi-lk11-lb1-organellen', 'Zellorganellen und Kompartimente', [
              'Organell',
              'Membran',
            ]),
            topic('bi-lk11-lb1-gewebe', 'Gewebe und Organbildung', ['Gewebe', 'Differenzierung']),
            topic('bi-lk11-lb1-procyte', 'Procyte und Eucyte', ['Prokaryot', 'Eukaryot', 'Endosymbiose']),
            topic('bi-lk11-lb1-gewebe-zyklus', 'Bildungsgewebe und Zellzyklus', ['Meristem', 'Mitose', 'Checkpoint']),
            topic('bi-lk11-lb1-membran', 'Biomembran detailliert', ['Fluid-Mosaik', 'ER', 'Golgi']),
            topic('bi-lk11-lb1-transport', 'Wasserpotenzial und Membrantransport', ['Turgor', 'Plasmolyse', 'Endocytose']),
            topic('bi-lk11-lb1-genregulation', 'Operon und eukaryotische Genregulation', ['Operon', 'Spleißen', 'Epigenetik']),
            topic('bi-lk11-lb1-enzyme', 'Enzymatik vertieft', ['Coenzym', 'Hemmung', 'Kinetik']),
                    topic('bi-lk11-lb1-kompartimente', 'Kompartimente und Membranfluss', ['kompartimente', 'lb1']),
          topic('bi-lk11-lb1-signal', 'Zelluläre Signalaufnahme', ['signal', 'lb1']),
          topic('bi-lk11-lb1-zyklus-kontrolle', 'Kontrolle des Zellzyklus', ['zyklus kontrolle', 'lb1']),
          topic('bi-lk11-lb1-apoptose', 'Programmierter Zelltod', ['apoptose', 'lb1']),
          topic('bi-lk11-lb1-stammzellen', 'Stammzellen und Potenz', ['stammzellen', 'lb1']),
          topic('bi-lk11-lb1-gewebearten', 'Gewebearten im Vergleich', ['gewebearten', 'lb1']),
          topic('bi-lk11-lb1-organ', 'Organbildung und Arbeitsteilung', ['organ', 'lb1']),
          topic('bi-lk11-lb1-mikroskopie', 'Licht- und Elektronenmikroskopie', ['mikroskopie', 'lb1']),
          topic('bi-lk11-lb1-wasser', 'Wasserhaushalt der Zelle', ['wasser', 'lb1']),
          topic('bi-lk11-lb1-ion', 'Ionengradienten und Potenziale', ['ion', 'lb1']),
          topic('bi-lk11-lb1-protein', 'Proteintrafficking', ['protein', 'lb1']),
          topic('bi-lk11-lb1-cytoskelett-bewegung', 'Zytoskelett und Zellbewegung', ['cytoskelett bewegung', 'lb1']),
          topic('bi-lk11-lb1-vergleich-pro-eu', 'Vergleich Pro- und Eucyte vertieft', ['vergleich pro eu', 'lb1']),
],
        ),
        area(
          'lb2',
          'Assimilation und Dissimilation – Redoxprozesse zellulärer Strukturen',
          40,
          [
            topic('bi-lk11-lb2-stoffwechsel', 'Assimilation und Dissimilation', [
              'Redox',
              'Stoffwechsel',
            ]),
            topic('bi-lk11-lb2-fotosynthese', 'Fotosynthese – Licht- und Calvin-Reaktionen', [
              'Chloroplast',
              'Calvin-Zyklus',
            ]),
            topic('bi-lk11-lb2-c3c4', 'C3-, C4- und CAM-Pflanzen', ['C4', 'Photorespiration', 'PEP-Carboxylase']),
            topic('bi-lk11-lb2-atmung', 'Zellatmung vertieft', ['Glykolyse', 'Citratzyklus', 'Atmungskette']),
            topic('bi-lk11-lb2-chemosynthese', 'Chemosynthese', ['Chemoautotroph', 'Nitrifikation', 'Redox']),
            topic('bi-lk11-lb2-gaerung', 'Gärung im Vergleich zur Atmung', ['Lactat', 'Ethanol', 'NAD+']),
            topic('bi-lk11-lb2-heterotroph', 'Heterotrophe Assimilation und Verdauung', ['Verdauung', 'Resorption', 'Enzyme']),
                    topic('bi-lk11-lb2-licht', 'Lichtreaktion detailliert', ['licht', 'lb2']),
          topic('bi-lk11-lb2-calvin', 'Calvin-Zyklus detailliert', ['calvin', 'lb2']),
          topic('bi-lk11-lb2-photorespiration', 'Photorespiration', ['photorespiration', 'lb2']),
          topic('bi-lk11-lb2-atmungskette', 'Atmungskette und Chemiosmose', ['atmungskette', 'lb2']),
          topic('bi-lk11-lb2-gaerung-vergleich', 'Gärung im Vergleich zur Atmung', ['gaerung vergleich', 'lb2']),
          topic('bi-lk11-lb2-c4-cam', 'C4 und CAM im Vergleich', ['c4 cam', 'lb2']),
          topic('bi-lk11-lb2-energiefluss-zelle', 'Energiefluss in der Zelle', ['energiefluss zelle', 'lb2']),
          topic('bi-lk11-lb2-redox-bilanz', 'Redoxbilanz von Stoffwechselwegen', ['redox bilanz', 'lb2']),
          topic('bi-lk11-lb2-enzyme-regulation', 'Enzymregulation im Stoffwechsel', ['enzyme regulation', 'lb2']),
],
        ),
        area('lb3', 'Ökologie und Nachhaltigkeit', 35, [
          topic('bi-lk11-lb3-oekologie', 'Ökologie und Nachhaltigkeit', [
            'Nachhaltigkeit',
          ]),
          topic('bi-lk11-lb3-populationen', 'Populationen und nachhaltige Nutzung', [
            'Population',
            'Tragfähigkeit',
          ]),
          topic('bi-lk11-lb3-population-modelle', 'Populationswachstum und Lotka-Volterra', ['Logistisch', 'r-Stratege', 'K-Stratege']),
          topic('bi-lk11-lb3-kreislauf', 'C- und N-Kreislauf', ['Fixierung', 'Nitrifikation', 'Denitrifikation']),
          topic('bi-lk11-lb3-landwirtschaft', 'Monokultur, Fußabdruck und Schädlinge', ['Monokultur', 'Fußabdruck', 'IPS']),
          topic('bi-lk11-lb3-naturschutz', 'Naturschutz, Klima und Renaturierung', ['Naturschutzgesetz', 'Renaturierung', 'Treibhauseffekt']),
                  topic('bi-lk11-lb3-population-wachstum', 'Populationswachstum und Modelle', ['population wachstum', 'lb3']),
          topic('bi-lk11-lb3-konkurrenz-experiment', 'Konkurrenz und Experimente', ['konkurrenz experiment', 'lb3']),
          topic('bi-lk11-lb3-stoffkreislaufe', 'Stoffkreisläufe C und N', ['stoffkreislaufe', 'lb3']),
          topic('bi-lk11-lb3-energiefluss-oeko', 'Energiefluss im Ökosystem', ['energiefluss oeko', 'lb3']),
          topic('bi-lk11-lb3-nachhaltige-nutzung', 'Nachhaltige Nutzung von Ressourcen', ['nachhaltige nutzung', 'lb3']),
          topic('bi-lk11-lb3-klimawandel', 'Klimawandel und Ökosysteme', ['klimawandel', 'lb3']),
          topic('bi-lk11-lb3-naturschutzstrategien', 'Naturschutzstrategien', ['naturschutzstrategien', 'lb3']),
          topic('bi-lk11-lb3-biodiversitaet-schutz', 'Biodiversität schützen und bewerten', ['Biodiversität', 'Naturschutz']),
]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('bi-lk11-lbw-wueste', 'Leben in der Wüste', ['Wüste'], {
            tasksPerRound: 10}),
          topic('bi-lk11-lbw-urban', 'Urbane Ökologie', ['Stadtökologie'], {
            tasksPerRound: 10}),
          topic('bi-lk11-lbw-bioindikation', 'Bioindikation', ['Bioindikator'], {
            tasksPerRound: 10}),
          topic(
            'bi-lk11-lbw-invasiv',
            'Invasive Arten und deren Einfluss auf Ökosysteme',
            ['Neobiota'],
            { tasksPerRound: 10 },
          ),
          topic('bi-lk11-lbw-rohstoffe', 'Nachwachsende Rohstoffe', ['Biomasse'], {
            tasksPerRound: 10}),
          topic('bi-lk11-lbw-energie', 'Energiehaushalt des Menschen', ['Energie'], {
            tasksPerRound: 10}),
        ]),
      ],
    ),
    grade(
      'biologie-jgs-12-lk',
      'Jahrgangsstufe 12 – Leistungskurs',
      'Jahrgangsstufe 12 – Leistungskurs',
      'Genetik, Zellkommunikation, Verhalten, Biodiversität und Systematisierung.',
      ['Genetik', 'Verhalten', 'Biodiversität'],
      [
        area('lb1', 'Grundlagen, Anwendungen und Perspektiven der Genetik', 34, [
          topic('bi-lk12-lb1-genetik', 'Genetik', ['Genetik', 'Gentechnik']),
          topic('bi-lk12-lb1-dna', 'DNA, Gene und Proteinbiosynthese', ['DNA', 'Translation']),
          topic('bi-lk12-lb1-anwendung', 'Anwendungen und ethische Perspektiven', [
            'Gentechnik',
            'Ethik',
          ]),
          topic('bi-lk12-lb1-vererbung', 'Kopplung, Blutgruppen und Rekombination', ['Kopplung', 'Crossing-over', 'Codominanz']),
          topic('bi-lk12-lb1-humangenetik', 'Humangenetik-Techniken und Erbkrankheiten', ['Stammbaum', 'Karyogramm', 'PCR']),
          topic('bi-lk12-lb1-krebs', 'Krebs – Onkogene und personalisierte Medizin', ['Onkogen', 'Suppressorgen', 'Metastase']),
          topic('bi-lk12-lb1-gentechnik', 'Gentechnik – Vektoren und Verfahren', ['Vektor', 'Transformation', 'CRISPR']),
                  topic('bi-lk12-lb1-epigenetik', 'Epigenetik und Genregulation', ['epigenetik', 'lb1']),
          topic('bi-lk12-lb1-entwicklungsgenetik', 'Entwicklungsgenetik', ['entwicklungsgenetik', 'lb1']),
          topic('bi-lk12-lb1-populationsgenetik', 'Populationsgenetik', ['populationsgenetik', 'lb1']),
          topic('bi-lk12-lb1-krebsgenetik', 'Krebs als Generkrankung', ['krebsgenetik', 'lb1']),
          topic('bi-lk12-lb1-genomeditierung', 'Genomeditierung Verfahren', ['genomeditierung', 'lb1']),
          topic('bi-lk12-lb1-diagnostik', 'Molekularbiologische Diagnostik', ['diagnostik', 'lb1']),
          topic('bi-lk12-lb1-ethik-lk', 'Ethik diskursiver Fallbeispiele', ['ethik lk', 'lb1']),
]),
        area('lb2', 'Kommunikation zwischen Zellen', 32, [
          topic('bi-lk12-lb2-kommunikation', 'Kommunikation zwischen Zellen', [
            'Signalwege',
          ]),
          topic('bi-lk12-lb2-signalwege', 'Signaltransduktion und Zielzellen', [
            'Signaltransduktion',
            'Ligand',
          ]),
          topic('bi-lk12-lb2-stoerung', 'Störungen der Zellkommunikation', ['Krankheit', 'Signal']),
          topic('bi-lk12-lb2-immun', 'Immunbiologie vertieft', ['HIV', 'Resistenz', 'Transplantation']),
          topic('bi-lk12-lb2-neuro', 'Neurophysiologie vertieft', ['EEG', 'Summation', 'Hypothalamus']),
                  topic('bi-lk12-lb2-signaltransduktion', 'Signaltransduktion Kaskaden', ['signaltransduktion', 'lb2']),
          topic('bi-lk12-lb2-hormonachsen', 'Hormonachsen und Feedback', ['hormonachsen', 'lb2']),
          topic('bi-lk12-lb2-immun-spezifisch', 'Spezifische Immunantwort vertieft', ['immun spezifisch', 'lb2']),
          topic('bi-lk12-lb2-immun-unspezifisch', 'Unspezifische Abwehr vertieft', ['immun unspezifisch', 'lb2']),
          topic('bi-lk12-lb2-synapse-integration', 'Synaptische Integration', ['synapse integration', 'lb2']),
          topic('bi-lk12-lb2-sinnesphysio', 'Sinnesphysiologie', ['sinnesphysio', 'lb2']),
          topic('bi-lk12-lb2-stoerungen', 'Pathophysiologie der Kommunikation', ['stoerungen', 'lb2']),
          topic('bi-lk12-lb2-pharmakologie', 'Angriffspunkte von Wirkstoffen', ['pharmakologie', 'lb2']),
]),
        area('lb3', 'Verhalten von Tier und Mensch', 10, [
          topic('bi-lk12-lb3-verhalten', 'Verhalten von Tier und Mensch', ['Ethologie']),
          topic('bi-lk12-lb3-lernen', 'Lernen und Verhaltensanpassung', ['Lernen', 'Konditionierung']),
          topic('bi-lk12-lb3-sozial', 'Sozialverhalten und Kommunikation', ['Sozialverhalten']),
                  topic('bi-lk12-lb3-ethologie-methoden', 'Methoden der Verhaltensbiologie', ['ethologie methoden', 'lb3']),
]),
        area('lb4', 'Biodiversität und ihre Entstehung', 20, [
          topic('bi-lk12-lb4-biodiversitaet', 'Biodiversität und ihre Entstehung', [
            'Biodiversität',
          ]),
          topic('bi-lk12-lb4-artbildung', 'Artbildung und Selektion', ['Artbildung', 'Selektion']),
          topic('bi-lk12-lb4-schutz', 'Erhalt der Biodiversität', ['Naturschutz']),
          topic('bi-lk12-lb4-gendrift', 'Gendrift, Migration und Radiation', ['Gendrift', 'Genfluss', 'Flaschenhals']),
          topic('bi-lk12-lb4-progression', 'Progression und Spezialisierung', ['Homologie', 'Landgang', 'Differenzierung']),
          topic('bi-lk12-lb4-abgrenzung', 'Sozialdarwinismus und Wissenschaftsabgrenzung', ['Sozialdarwinismus', 'Ethik', 'Rassismus']),
          topic('bi-lk12-lb4-phylogenie', 'Molekulare Homologien und Stammbäume', ['Clade', 'Phylogenie', 'Outgroup']),
          topic('bi-lk12-lb4-mensch', 'Stammesgeschichte und kulturelle Evolution', ['Bipedie', 'Hominini', 'Kultur']),
        ]),
        area('lb5', 'Systematisierung und Vernetztheit', 14, [
          topic('bi-lk12-lb5-systematik', 'Systematisierung und Vernetztheit', [
            'Vernetzung',
          ]),
          topic('bi-lk12-lb5-ebenen', 'Organisationsebenen des Lebendigen', [
            'Zelle',
            'Organismus',
            'Ökosystem',
          ]),
          topic('bi-lk12-lb5-vernetzung', 'Stoff- und Energiefluss vernetzen', [
            'Stoffkreislauf',
            'Energiefluss',
          ]),
          topic('bi-lk12-lb5-stoffwechsel-vergleich', 'Foto-/Chemosynthese, Atmung und Gärung vernetzen', ['Fotosynthese', 'Chemosynthese', 'Gärung']),
                  topic('bi-lk12-lb5-organisationsebenen', 'Organisationsebenen vernetzen', ['organisationsebenen', 'lb5']),
          topic('bi-lk12-lb5-systembiologie', 'Systembiologie und Modelle', ['systembiologie', 'lb5']),
]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('bi-lk12-lbw-allergie', 'Allergien und Autoimmunkrankheiten', ['Allergie'], {
            tasksPerRound: 10}),
          topic('bi-lk12-lbw-stoffwechsel', 'Evolution des Stoffwechsels', ['Stoffwechsel'], {
            tasksPerRound: 10}),
          topic('bi-lk12-lbw-gefaess', 'Praktikum Gefäßpflanzen', ['Pflanzen'], {
            tasksPerRound: 10}),
          topic('bi-lk12-lbw-verhalten', 'Verhaltensbiologisches Praktikum', ['Verhalten'], {
            tasksPerRound: 10}),
          topic('bi-lk12-lbw-gentechnik', 'Arbeitstechniken in der Genetik', ['Labor'], {
            tasksPerRound: 10}),
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

/** K6 LB2 Wirbellose — freigegeben (IDs 1434, 2689, 2495, 4496, 3666, 7502, 1467). */
export const BIOLOGIE_K6_WIRBELLOSE_RELEASED_IDS = [
  'bi-k6-lb2-wirbellose',
  'bi-k6-lb2-insekten',
  'bi-k6-lb2-spinnen',
  'bi-k6-lb2-krebstiere',
  'bi-k6-lb2-ringelwuermer',
  'bi-k6-lb2-rundwuermer',
  'bi-k6-lb2-nesseltiere',
] as const

/** K6 Wahlbereich — Weichtiere + Spinnen/Heilpflanzen/Pfütze freigegeben. */
export const BIOLOGIE_K6_WAHL_RELEASED_IDS = [
  'bi-k6-lbw-spinnen',
  'bi-k6-lbw-weichtiere',
  'bi-k6-lbw-schnecken',
  'bi-k6-lbw-muscheln',
  'bi-k6-lbw-kopffuesser',
  'bi-k6-lbw-heilen',
  'bi-k6-lbw-pfuetze',
] as const

/** K5 Themen laut Freigabeliste — vollständig freigegeben nach Verdichtung. */
/** K5 Freigabe — ohne die 9 Banken, die noch in der Prüfung sind. */
export const BIOLOGIE_K5_RELEASED_IDS = [
  'bi-k5-lb1-merkmale',
  'bi-k5-lb1-kennzeichen',
  'bi-k5-lb2-fische',
  'bi-k5-lb2-fische-aufbau',
  'bi-k5-lb2-fische-merkmale',
  'bi-k5-lb2-fische-lebensraum',
  'bi-k5-lb2-fische-schutz',
  'bi-k5-lb3-lurche',
  'bi-k5-lb3-lurche-merkmale',
  'bi-k5-lb3-lurche-meta',
  'bi-k5-lb3-lurche-fortpflanzung',
  'bi-k5-lb3-lurche-schutz',
  'bi-k5-lb4-kriechtiere',
  'bi-k5-lb4-kriechtiere-merkmale',
  'bi-k5-lb4-kriechtiere-arten',
  'bi-k5-lb4-kriechtiere-fortpflanzung',
  'bi-k5-lb5-voegel',
  'bi-k5-lb5-voegel-aufbau',
  'bi-k5-lb5-voegel-flug',
  'bi-k5-lb5-voegel-fortpflanzung',
  'bi-k5-lb6-saeugetiere',
  'bi-k5-lb6-saeuger-merkmale',
  'bi-k5-lb6-saeuger-skelett',
  'bi-k5-lb6-saeuger-angepasst',
  'bi-k5-lb6-saeuger-schutz',
  'bi-k5-lb6-saeuger-fortpflanzung',
  'bi-k5-lb7-systematik',
  'bi-k5-lb7-zuordnung',
  'bi-k5-lbw-winter',
  'bi-k5-lbw-saurier',
  'bi-k5-lbw-haltung',
] as const

/** Alle aktuell freigegebenen Bio-Themen (K5 + K6 Wirbellose + K6 Wahl). */
export const BIOLOGIE_RELEASED_IDS = [
  ...BIOLOGIE_K5_RELEASED_IDS,
  ...BIOLOGIE_K6_WIRBELLOSE_RELEASED_IDS,
  ...BIOLOGIE_K6_WAHL_RELEASED_IDS,
] as const

/** Playable K5 Wirbeltiere + Wahl topic ids (legacy + expanded). */
export const BIOLOGIE_K5_WIRBELTIERE_TOPIC_IDS = [
  'bi-k5-lb1-merkmale',
  'bi-k5-lb1-kennzeichen',
  'bi-k5-lb1-arbeitsweisen',
  'bi-k5-lb2-fische',
  'bi-k5-lb2-fische-aufbau',
  'bi-k5-lb2-fische-merkmale',
  'bi-k5-lb2-fische-lebensraum',
  'bi-k5-lb2-fische-schutz',
  'bi-k5-lb3-lurche',
  'bi-k5-lb3-lurche-merkmale',
  'bi-k5-lb3-lurche-meta',
  'bi-k5-lb3-lurche-fortpflanzung',
  'bi-k5-lb3-lurche-schutz',
  'bi-k5-lb4-kriechtiere',
  'bi-k5-lb4-kriechtiere-merkmale',
  'bi-k5-lb4-kriechtiere-arten',
  'bi-k5-lb4-kriechtiere-fortpflanzung',
  'bi-k5-lb4-kriechtiere-schutz',
  'bi-k5-lb5-voegel',
  'bi-k5-lb5-voegel-aufbau',
  'bi-k5-lb5-voegel-flug',
  'bi-k5-lb5-voegel-fortpflanzung',
  'bi-k5-lb5-voegel-schnabel',
  'bi-k5-lb5-voegel-verhalten',
  'bi-k5-lb5-voegel-schutz',
  'bi-k5-lb6-saeugetiere',
  'bi-k5-lb6-saeuger-merkmale',
  'bi-k5-lb6-saeuger-skelett',
  'bi-k5-lb6-saeuger-angepasst',
  'bi-k5-lb6-saeuger-lunge',
  'bi-k5-lb6-saeuger-verhalten',
  'bi-k5-lb6-saeuger-sinne',
  'bi-k5-lb6-saeuger-sozial',
  'bi-k5-lb6-saeuger-schutz',
  'bi-k5-lb6-saeuger-fortpflanzung',
  'bi-k5-lb7-systematik',
  'bi-k5-lb7-zuordnung',
  'bi-k5-lbw-winter',
  'bi-k5-lbw-saurier',
  'bi-k5-lbw-haltung',
] as const
