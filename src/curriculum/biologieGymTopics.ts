/**
 * Gymnasium Sachsen · Biologie — Lehrplan-Outline (lplanid=522).
 * Lehrplan structure is authoritative; denser PackTopics under each LB draw on
 * Schlaukopf Bio-Gym quiz themes (original German wording — no verbatim copy).
 * Surveyed: https://www.schlaukopf.de/gymnasium/klasse{5–10}/biologie/ + Oberstufe.
 * released:false → Entwickler.
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
  tasksPerRound: opts?.tasksPerRound ?? 10,
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
          ]),
          topic('bi-k5-lb1-kennzeichen', 'Kennzeichen der Lebewesen', [
            'Kennzeichen',
            'Lebewesen',
            'Stoffwechsel',
          ]),
        ]),
        area('lb2', 'Fische in ihren Lebensräumen', 8, [
          topic('bi-k5-lb2-fische', 'Fische – Überblick', [
            'Kiemen',
            'Flossen',
            'Stromlinienform',
          ]),
          topic('bi-k5-lb2-fische-merkmale', 'Fische – Merkmale und Angepasstheit', [
            'Kiemen',
            'Schuppen',
            'Seitenlinie',
          ]),
          topic('bi-k5-lb2-fische-lebensraum', 'Fische – Lebensraum und Vielfalt', [
            'Süßwasser',
            'Salzwasser',
            'Gewässer',
          ]),
          topic('bi-k5-lb2-fische-schutz', 'Fische – Fortpflanzung und Schutz', [
            'Laich',
            'Gewässerschutz',
          ]),
        ]),
        area('lb3', 'Lurche in ihren Lebensräumen', 7, [
          topic('bi-k5-lb3-lurche', 'Lurche – Überblick', [
            'Amphibien',
            'Metamorphose',
            'Hautatmung',
          ]),
          topic('bi-k5-lb3-lurche-merkmale', 'Lurche – Merkmale und Haut', [
            'Hautatmung',
            'Feuchte Haut',
          ]),
          topic('bi-k5-lb3-lurche-meta', 'Lurche – Metamorphose', [
            'Kaulquappe',
            'Laich',
            'Metamorphose',
          ]),
          topic('bi-k5-lb3-lurche-schutz', 'Lurche – Lebensraum und Schutz', [
            'Amphibienschutz',
            'Wanderung',
          ]),
        ]),
        area('lb4', 'Kriechtiere in ihren Lebensräumen', 7, [
          topic('bi-k5-lb4-kriechtiere', 'Kriechtiere – Überblick', [
            'Reptilien',
            'Hornschicht',
            'Lungen',
          ]),
          topic('bi-k5-lb4-kriechtiere-merkmale', 'Kriechtiere – Merkmale und Landleben', [
            'Schuppen',
            'Eiablage',
            'Poikilotherm',
          ]),
          topic('bi-k5-lb4-kriechtiere-arten', 'Kriechtiere – heimische Arten', [
            'Eidechse',
            'Schlange',
            'Schildkröte',
          ]),
        ]),
        area('lb5', 'Vögel in ihren Lebensräumen', 9, [
          topic('bi-k5-lb5-voegel', 'Vögel – Überblick', [
            'Federn',
            'Luftsäcke',
            'Schnabel',
          ]),
          topic('bi-k5-lb5-voegel-flug', 'Vögel – Flug und Federkleid', [
            'Flug',
            'Federn',
            'Knochen',
          ]),
          topic('bi-k5-lb5-voegel-fortpflanzung', 'Vögel – Fortpflanzung und Brutpflege', [
            'Nest',
            'Nesthocker',
            'Nestflüchter',
          ]),
        ]),
        area('lb6', 'Säugetiere in ihren Lebensräumen', 13, [
          topic('bi-k5-lb6-saeugetiere', 'Säugetiere – Überblick', [
            'Fell',
            'Säugen',
            'Gleichwarm',
          ]),
          topic('bi-k5-lb6-saeuger-merkmale', 'Säugetiere – Merkmale und Gebiss', [
            'Gebiss',
            'Fell',
            'Säugen',
          ]),
          topic('bi-k5-lb6-saeuger-angepasst', 'Säugetiere – Angepasstheit und Lebensräume', [
            'Angepasstheit',
            'Lebensraum',
          ]),
          topic('bi-k5-lb6-saeuger-schutz', 'Säugetiere – Schutz und Vielfalt', [
            'Artenschutz',
            'Vielfalt',
          ]),
        ]),
        area('lb7', 'Systematisierung', 3, [
          topic('bi-k5-lb7-systematik', 'Wirbeltiere vergleichen', [
            'Systematik',
            'Vergleich',
            'Atmung',
          ]),
          topic('bi-k5-lb7-zuordnung', 'Wirbeltiere zuordnen (Merkmale → Gruppe)', [
            'Zuordnung',
            'Merkmale',
          ]),
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('bi-k5-lbw-winter', 'Wirbeltiere im Winter', [
            'Winterschlaf',
            'Winterruhe',
            'Kältestarre',
            'Vogelzug',
          ]),
          topic('bi-k5-lbw-saurier', 'Kriechtiere vergangener Zeiten', [
            'Saurier',
            'Fossilien',
          ], { tasksPerRound: 10 }),
          topic('bi-k5-lbw-haltung', 'Artgerechte Tierhaltung', [
            'Aquarium',
            'Terrarium',
            'Tierschutz',
          ], { tasksPerRound: 10 }),
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
          topic('bi-k6-lb1-bluete', 'Blütenpflanzen – Blüte und Bestäubung', [
            'Blüte',
            'Bestäubung',
            'Narbe',
          ]),
          topic('bi-k6-lb1-baeume', 'Bäume und Holzpflanzen', [
            'Baum',
            'Holz',
            'Jahresring',
          ]),
          topic('bi-k6-lb1-organe', 'Spross, Blatt und Wurzel', [
            'Wurzel',
            'Blatt',
            'Spross',
          ]),
        ]),
        area('lb2', 'Wirbellose Tiere in ihren Lebensräumen', 16, [
          topic('bi-k6-lb2-wirbellose', 'Wirbellose – Überblick', [
            'Gliederfüßer',
            'Weichtiere',
            'Wirbellos',
          ]),
          topic('bi-k6-lb2-insekten', 'Insekten – Bau und Metamorphose', [
            'Insekt',
            'Metamorphose',
            'Chitin',
          ]),
          topic('bi-k6-lb2-spinnen', 'Spinnentiere', [
            'Spinne',
            'Acht Beine',
            'Milben',
          ]),
          topic('bi-k6-lb2-krebstiere', 'Krebstiere', [
            'Flusskrebs',
            'Wasserfloh',
            'Kieme',
          ]),
          topic('bi-k6-lb2-ringelwuermer', 'Ringelwürmer', [
            'Regenwurm',
            'Blutegel',
            'Segment',
          ]),
          topic('bi-k6-lb2-rundwuermer', 'Rundwürmer', [
            'Nematoden',
            'Askaris',
            'Parasit',
          ]),
          topic('bi-k6-lb2-nesseltiere', 'Hohltiere', [
            'Qualle',
            'Koralle',
            'Nesselzelle',
          ]),
        ]),
        area('lb3', 'Systematisierung', 4, [
          topic('bi-k6-lb3-systematik', 'Wirbellose und Wirbeltiere vergleichen', [
            'Vergleich',
            'Systematik',
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
        ]),
        area('lbw', 'Wahlbereiche', undefined, [
          topic('bi-k6-lbw-spinnen', 'Spinnen', [
            'Netzbau',
            'Beutefang',
            'Spinnenseide',
          ], { tasksPerRound: 10 }),
          topic('bi-k6-lbw-weichtiere', 'Weichtiere', [
            'Mantel',
            'Schnecke',
            'Muschel',
          ], { tasksPerRound: 10 }),
          topic('bi-k6-lbw-schnecken', 'Schnecken', [
            'Kriechfuß',
            'Radula',
            'Gehäuse',
          ], { tasksPerRound: 10 }),
          topic('bi-k6-lbw-muscheln', 'Muscheln', [
            'Schalenklappen',
            'Filtrierer',
          ], { tasksPerRound: 10 }),
          topic('bi-k6-lbw-kopffuesser', 'Kopffüßer', [
            'Tintenfisch',
            'Fangarme',
            'Rückstoß',
          ], { tasksPerRound: 10 }),
          topic('bi-k6-lbw-heilen', 'Pflanzen helfen heilen', ['Heilpflanze'], {
            tasksPerRound: 10}),
          topic('bi-k6-lbw-pfuetze', 'Leben in der Pfütze', ['Kleinstlebewesen'], {
            tasksPerRound: 10}),
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
          topic('bi-k7-lb2-immun', 'Immunbiologie – Abwehr', [
            'Antikörper',
            'Impfung',
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
          topic('bi-k7-lb3-organe', 'Verdauungsorgane und Ausscheidung', [
            'Magen',
            'Darm',
            'Niere',
          ]),
        ]),
        area('lb4', 'Stütz- und Bewegungssystem des Menschen', 4, [
          topic('bi-k7-lb4-skelett', 'Knochen, Muskeln und Gelenke', [
            'Knochen',
            'Muskeln',
            'Gelenke',
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
        ]),
        area('lb2', 'Sexualität des Menschen', 11, [
          topic('bi-k8-lb2-sexualitaet', 'Sexualität des Menschen – Überblick', [
            'Sexualität',
            'Verantwortung',
          ]),
          topic('bi-k8-lb2-entwicklung', 'Entwicklung und Verantwortung', [
            'Pubertät',
            'Verantwortung',
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
        ]),
        area('lb3', 'Stammesgeschichte des Menschen', 9, [
          topic('bi-k10-lb3-mensch', 'Stammesgeschichte des Menschen', [
            'Hominiden',
            'Evolution',
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
          ],
        ),
        area('lb3', 'Ökologie und Nachhaltigkeit', 13, [
          topic('bi-gk11-lb3-oekologie', 'Ökologie und Nachhaltigkeit', [
            'Nachhaltigkeit',
            'Ökologie',
          ]),
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
        ]),
        area('lb2', 'Kommunikation zwischen Zellen', 10, [
          topic('bi-gk12-lb2-kommunikation', 'Kommunikation zwischen Zellen', [
            'Signal',
            'Rezeptor',
          ]),
        ]),
        area('lb3', 'Biodiversität und ihre Entstehung', 14, [
          topic('bi-gk12-lb3-biodiversitaet', 'Biodiversität und ihre Entstehung', [
            'Biodiversität',
            'Evolution',
          ]),
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
          ],
        ),
        area('lb3', 'Ökologie und Nachhaltigkeit', 35, [
          topic('bi-lk11-lb3-oekologie', 'Ökologie und Nachhaltigkeit', [
            'Nachhaltigkeit',
          ]),
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
        ]),
        area('lb2', 'Kommunikation zwischen Zellen', 32, [
          topic('bi-lk12-lb2-kommunikation', 'Kommunikation zwischen Zellen', [
            'Signalwege',
          ]),
        ]),
        area('lb3', 'Verhalten von Tier und Mensch', 10, [
          topic('bi-lk12-lb3-verhalten', 'Verhalten von Tier und Mensch', ['Ethologie']),
        ]),
        area('lb4', 'Biodiversität und ihre Entstehung', 20, [
          topic('bi-lk12-lb4-biodiversitaet', 'Biodiversität und ihre Entstehung', [
            'Biodiversität',
          ]),
        ]),
        area('lb5', 'Systematisierung und Vernetztheit', 14, [
          topic('bi-lk12-lb5-systematik', 'Systematisierung und Vernetztheit', [
            'Vernetzung',
          ]),
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

/** Playable K5 Wirbeltiere + Wahl topic ids (legacy + expanded). */
export const BIOLOGIE_K5_WIRBELTIERE_TOPIC_IDS = [
  'bi-k5-lb1-merkmale',
  'bi-k5-lb1-kennzeichen',
  'bi-k5-lb2-fische',
  'bi-k5-lb2-fische-merkmale',
  'bi-k5-lb2-fische-lebensraum',
  'bi-k5-lb2-fische-schutz',
  'bi-k5-lb3-lurche',
  'bi-k5-lb3-lurche-merkmale',
  'bi-k5-lb3-lurche-meta',
  'bi-k5-lb3-lurche-schutz',
  'bi-k5-lb4-kriechtiere',
  'bi-k5-lb4-kriechtiere-merkmale',
  'bi-k5-lb4-kriechtiere-arten',
  'bi-k5-lb5-voegel',
  'bi-k5-lb5-voegel-flug',
  'bi-k5-lb5-voegel-fortpflanzung',
  'bi-k5-lb6-saeugetiere',
  'bi-k5-lb6-saeuger-merkmale',
  'bi-k5-lb6-saeuger-angepasst',
  'bi-k5-lb6-saeuger-schutz',
  'bi-k5-lb7-systematik',
  'bi-k5-lb7-zuordnung',
  'bi-k5-lbw-winter',
  'bi-k5-lbw-saurier',
  'bi-k5-lbw-haltung',
] as const
