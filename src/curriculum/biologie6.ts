/**
 * Biologie Klasse 6 — Lehrplan 522 LB1–5 + Wahl.
 * Themenideen angelehnt an Schlaukopf (Blütenpflanzen, Bäume, Zellen, Wirbellose, Wald),
 * Wortlaut original; Zuordnung nach sächsischem Lehrplan.
 */
import { bankGenerate, type BioBank } from './biologieBank'
import { BIOLOGIE_K6_WIRBELLOSE_SPECIAL_GENERATORS } from './biologie6Wirbellose'
import type { Topic } from './types'

const Q = {
  pflanzen: {
    quelle: 'Wikipedia: Samenpflanzen',
    url: 'https://de.wikipedia.org/wiki/Samenpflanzen',
  },
  wirbellose: {
    quelle: 'Wikipedia: Wirbellose',
    url: 'https://de.wikipedia.org/wiki/Wirbellose',
  },
  wald: {
    quelle: 'Wikipedia: Wald',
    url: 'https://de.wikipedia.org/wiki/Wald',
  },
  zelle: {
    quelle: 'Wikipedia: Zelle (Biologie)',
    url: 'https://de.wikipedia.org/wiki/Zelle_(Biologie)',
  },
} as const

/** Überblick: nur übergeordnet — Blüte/Bestäubung → bluete, Organe → organe, Holz → baeume. */
const samenpflanzen: BioBank = {
  ...Q.pflanzen,
  conceptPrefix: 'bio:k6:samenpflanzen',
  facts: [
    {
      concept: 'bio:k6:samenpflanzen:was-sind',
      prompt: 'Was kennzeichnet Samenpflanzen besonders?',
      answer: 'Sie bilden Samen (oft in Früchten oder Zapfen)',
      wrong: ['Sie haben nie Wurzeln', 'Sie atmen nur über Kiemen', 'Sie sind immer wirbellos'],
      explanation: 'Samenpflanzen vermehren sich über Samen.',
      wissen:
        'Samenpflanzen bilden Samen mit Embryo. Blütenpflanzen tragen Blüten; Nadelbäume oft Zapfen. Details zu Blüte, Organen und Holz gehören zu den Spezialthemen.',
      gap: 'Samenpflanzen bilden ___.',
      gapAccepted: ['Samen'],
    },
    {
      concept: 'bio:k6:samenpflanzen:organe-ueberblick',
      prompt: 'Welche drei Grundorgane hat eine typische Samenpflanze?',
      answer: 'Wurzel, Sprossachse und Blatt',
      wrong: ['Nur Flossen und Kiemen', 'Nur Federn und Schnabel', 'Nur Chitinpanzer'],
      explanation: 'Bauplan: Wurzel – Spross – Blatt.',
      wissen:
        'Der Bauplan der Samenpflanze umfasst Wurzel, Sprossachse und Blatt. Feinheiten (Spaltöffnungen, Holz, Blütenteile) stehen in den Spezialthemen.',
    },
    {
      concept: 'bio:k6:samenpflanzen:vs-sporen',
      prompt: 'Wodurch unterscheiden sich Samenpflanzen grob von vielen Farnen?',
      answer: 'Samenpflanzen bilden Samen, Farne oft Sporen',
      wrong: ['Farne haben immer Jahresringe aus Holz', 'Samenpflanzen haben nie Blätter', 'Farne atmen über Lungen'],
      explanation: 'Samen vs. Sporen ist der zentrale Unterschied im Überblick.',
      wissen:
        'Samenpflanzen bilden Samen; viele Farne und Moose verbreiten sich über Sporen — ein grober systematischer Unterschied.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k6:samenpflanzen:paar-samen',
      term: 'Samen',
      meaning: 'Ausbreitungs- und Überdauerungsstadium',
      wissen: 'Enthält den Embryo und oft Nährgewebe.',
    },
    {
      concept: 'bio:k6:samenpflanzen:paar-bluete',
      term: 'Blütenpflanze',
      meaning: 'Samenpflanze mit Blüten',
      wissen: 'Blüten dienen der sexuellen Fortpflanzung; Details im Spezialthema Blüte.',
    },
    {
      concept: 'bio:k6:samenpflanzen:paar-nadel',
      term: 'Nadelbaum',
      meaning: 'Samenpflanze, oft mit Zapfen',
      wissen: 'Nadelbäume gehören zu den Samenpflanzen; Holz und Jahresringe → Spezialthema Bäume.',
    },
    {
      concept: 'bio:k6:samenpflanzen:paar-frucht',
      term: 'Frucht',
      meaning: 'Enthält oft die Samen der Blütenpflanze',
      wissen: 'Entsteht nach Befruchtung aus dem Fruchtknoten — Ablauf im Spezialthema Blüte.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:samenpflanzen:tf-samen',
      statement: 'Samenpflanzen bilden typischerweise Samen.',
      correct: true,
      explanation: 'Das ist das namensgebende Merkmal.',
      wissen: 'Samenpflanzen heißen so, weil sie Samen bilden.',
    },
    {
      concept: 'bio:k6:samenpflanzen:tf-nur-baeume',
      statement: 'Alle Samenpflanzen sind große Bäume mit Jahresringen.',
      correct: false,
      explanation: 'Es gibt auch Kräuter und Sträucher; Jahresringe → Spezial Bäume.',
      wissen:
        'Samenpflanzen umfassen Kräuter, Sträucher und Bäume. Jahresringe und Holzbau gehören zum Spezialthema Bäume.',
    },
  ],
  multis: [
    {
      concept: 'bio:k6:welche-aussagen-zu-bluetenpflanzen-stimm',
      question: 'Welche Aussagen zu Blütenpflanzen stimmen?',
      correct: ['Sie bilden Samen', 'Viele werden von Insekten bestäubt'],
      wrong: ['Sie haben nie Wurzeln', 'Sie atmen nur über Kiemen'],
      explanation: 'Samenpflanzen bilden Samen; Bestäubung oft durch Tiere oder Wind.',
      wissen:
        'Samenpflanzen bilden Samen. Viele Blütenpflanzen werden von Insekten bestäubt; andere nutzen Wind.',
    },
  ],
}

/** Überblick Wirbellose: nur übergeordnete Gruppen / Abgrenzung — keine Spezialdetails. */
const wirbelloseOverview: BioBank = {
  ...Q.wirbellose,
  conceptPrefix: 'bio:k6:wirbellose',
  facts: [
    {
      concept: 'bio:k6:was-bedeutet-wirbellos',
      prompt: 'Was bedeutet „wirbellos“?',
      answer: 'Ohne Wirbelsäule',
      wrong: ['Mit Federkleid', 'Immer mit sechs Beinen', 'Nur im Meer lebend'],
      explanation: 'Wirbellose Tiere haben keine Wirbelsäule — z. B. Insekten, Spinnen, Würmer, Weichtiere.',
      wissen:
        '„Wirbellos“ bedeutet: ohne innere Wirbelsäule. Dazu gehören viele Stämme — u. a. Insekten, Spinnentiere, Weichtiere und Würmer.',
      gap: 'Wirbellose Tiere haben keine ___.',
      gapAccepted: ['Wirbelsäule', 'Wirbelsaeule'],
    },
    {
      concept: 'bio:k6:welche-aussage-zur-vielfalt-wirbelloser-',
      prompt: 'Welche Aussage zur Vielfalt wirbelloser Tiere stimmt?',
      answer: 'Dazu gehören u. a. Insekten, Spinnen, Würmer und Weichtiere',
      wrong: [
        'Nur Fische und Vögel',
        'Nur Säugetiere',
        'Nur Tiere mit Wirbelsäule',
      ],
      explanation: 'Wirbellose umfassen viele Gruppen mit unterschiedlichen Lebensräumen.',
      wissen:
        'Wirbellose sind artenreicher als Wirbeltiere und besiedeln Land, Süßwasser und Meer — von Insekten über Spinnen bis zu Schnecken und Regenwürmern.',
    },
  ],
  pairs: [
    {
      term: 'Wirbelloses Tier',
      meaning: 'Ohne Wirbelsäule',
      wissen: 'Kein inneres Skelett aus Wirbelsäule — z. B. Insekten, Spinnen, Würmer, Weichtiere.',
    },
    {
      term: 'Insekt',
      meaning: 'Gliederfüßer mit typisch sechs Beinen',
      wissen: 'Insekten: drei Körperabschnitte, sechs Beine, oft Flügel und Fühler — artenreichste Tiergruppe.',
    },
    {
      term: 'Spinne',
      meaning: 'Gliederfüßer mit acht Beinen',
      wissen: 'Spinnen haben acht Beine und gehören zu den Spinnentieren — sie sind keine Insekten.',
    },
    {
      term: 'Lebensraum',
      meaning: 'Ort, an den Tiere angepasst sind',
      wissen: 'Körperbau und Verhalten der Wirbellosen passen zu ihrem Lebensraum (Land, Wasser, Luft).',
    },
    {
      term: 'Weichtier',
      meaning: 'Weicher Körper, oft mit Schale/Gehäuse',
      wissen: 'Weichtiere (z. B. Schnecken, Muscheln) haben einen weichen Körper; viele tragen ein Kalkgehäuse.',
    },
    {
      term: 'Wurm',
      meaning: 'Langer Körper ohne echte Beine',
      wissen: 'Regenwürmer sind wirbellos: langer, segmentierter Körper ohne Beine, oft im Boden lebend.',
    },
    {
      term: 'Chitin',
      meaning: 'Stoff des äußeren Skeletts vieler Gliederfüßer',
      wissen: 'Chitin bildet den Panzer vieler Gliederfüßer — Schutz und Ansatzfläche für Muskeln.',
    },
    {
      term: 'Wirbeltier',
      meaning: 'Tier mit Wirbelsäule',
      wissen: 'Wirbeltiere (Fische, Lurche, Kriechtiere, Vögel, Säuger) besitzen eine innere Wirbelsäule.',
    },
    {
      term: 'Gliederfüßer',
      meaning: 'Gegliederte Beine und oft Panzer',
      wissen: 'Arthropoden: Chitinpanzer und gegliederte Beine — u. a. Insekten, Spinnen, Krebse und Tausendfüßer.',
    },
    {
      term: 'Krebstier',
      meaning: 'Gliederfüßer, oft mit Kiemen im Wasser',
      wissen: 'Krebse gehören zu den Gliederfüßern — Details zu Flusskrebs und Wasserfloh im Spezialthema.',
    },
    {
      term: 'Nesseltier',
      meaning: 'Wassertier mit Nesselzellen',
      wissen: 'Quallen und Korallen sind Nesseltiere — Vertiefung im Spezialthema.',
    },
    {
      term: 'Stachelhäuter',
      meaning: 'Meereswirbellose mit Kalk-Innenskelett',
      wissen: 'Seesterne und Seeigel leben nur im Meer — Bau und Ambulakralsystem im Spezialthema.',
    },
    {
      term: 'Angepasstheit',
      meaning: 'Merkmale passen zum Lebensraum',
      wissen: 'Angepasstheit: Bau und Verhalten ermöglichen das Überleben in einem bestimmten Lebensraum.',
    },
    {
      term: 'Vielfalt',
      meaning: 'Viele Stämme und Bauformen',
      wissen: 'Unter den Tieren stellen Wirbellose die größte Artenvielfalt — viele Stämme und Bauformen.',
    },
    {
      term: 'Panzer',
      meaning: 'Äußere Schutzhülle (oft Chitin)',
      wissen: 'Ein äußerer Panzer aus Chitin schützt den Körper und dient als Skelett für die Muskulatur.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:alle-wirbellosen-tiere-haben-sechs-beine',
      statement: 'Alle wirbellosen Tiere haben sechs Beine.',
      correct: false,
      explanation: 'Nur Insekten typischerweise sechs; Spinnen acht, Würmer keine Beine.',
      wissen:
        '„Wirbellos“ sagt nichts über die Beinzahl: Insekten haben typisch sechs, Spinnen acht, Würmer keine Beine.',
    },
    {
      concept: 'bio:k6:wirbellose-haben-keine-wirbelsaeule',
      statement: 'Wirbellose haben keine Wirbelsäule.',
      correct: true,
      explanation: 'Das ist das namensgebende Merkmal.',
      wissen:
        'Wirbellose haben keine Wirbelsäule; Wirbeltiere besitzen eine innere Stützstruktur aus Wirbeln.',
    },
  ],
  multis: [
    {
      concept: 'bio:k6:welche-tiere-sind-wirbellos',
      question: 'Welche Tiere sind wirbellos?',
      correct: ['Honigbiene', 'Kreuzspinne', 'Regenwurm'],
      wrong: ['Forelle', 'Amsel'],
      explanation: 'Fische und Vögel sind Wirbeltiere.',
      wissen:
        'Biene, Spinne und Regenwurm sind wirbellos. Forelle (Fisch) und Amsel (Vogel) haben eine Wirbelsäule.',
    },
  ],
  icons: [
    {
      concept: 'bio:wirbellose:icon-ohne-wirbelsaeule',
      question: 'Welches Lebewesen hat keine innere Wirbelsäule?',
      prompt: 'Wirbellos vs. Wirbeltier',
      options: [
        { id: 'biene', label: 'Honigbiene', icon: '🐝' },
        { id: 'forelle', label: 'Forelle', icon: '🐟' },
        { id: 'adler', label: 'Adler', icon: '🦅' },
        { id: 'hirsch', label: 'Reh', icon: '🦌' },
      ],
      correctId: 'biene',
      explanation: 'Die Biene ist wirbellos; Fische, Vögel und Säuger haben eine Wirbelsäule.',
      wissen:
        'Insekten wie die Honigbiene sind wirbellos. Fische, Vögel und Säugetiere gehören zu den Wirbeltieren mit innerer Wirbelsäule.',
    },
  ],
}

/** Insekten – Bau und Metamorphose (Spezialthema). */
const insekten: BioBank = {
  quelle: 'Wikipedia: Insekten',
  url: 'https://de.wikipedia.org/wiki/Insekten',
  conceptPrefix: 'bio:k6:insekten',
  facts: [
    {
      concept: 'bio:k6:was-unterscheidet-insekten-aeusserlich-t',
      prompt: 'Was unterscheidet Insekten äußerlich typischerweise?',
      answer: 'Sechs Beine und oft ein Chitinpanzer',
      wrong: ['Acht Beine und Federn', 'Wirbelsäule und Fell', 'Kiemen und Flossen'],
      explanation: 'Insekten: drei Körperabschnitte, sechs Beine, äußeres Skelett aus Chitin.',
      wissen:
        'Insekten: drei Körperabschnitte (Kopf, Brust, Hinterleib), sechs Beine und äußeres Skelett aus Chitin — die artenreichste Wirbellosen-Gruppe.',
      gap: 'Insekten haben typischerweise ___ Beine.',
      gapAccepted: ['sechs', '6', 'Sechs'],
    },
    {
      concept: 'bio:k6:was-ist-eine-vollstaendige-metamorphose-',
      prompt: 'Was ist eine vollständige Metamorphose bei Insekten?',
      answer: 'Ei → Larve → Puppe → Imago',
      wrong: ['Nur Ei → erwachsenes Tier', 'Samen → Keimling → Baum', 'Kaulquappe → Frosch ohne Puppe'],
      explanation: 'Bei Schmetterlingen u. a.: Larve, Puppe, dann fertiges Insekt (Imago).',
      wissen:
        'Vollständige Metamorphose: Ei → Larve → Puppe (Ruhestadium mit Umbau) → Imago (erwachsenes Insekt). Unvollständig: ohne Puppe, z. B. bei Heuschrecken.',
    },
  ],
  pairs: [
    {
      term: 'Chitinpanzer',
      meaning: 'Äußeres Skelett vieler Gliederfüßer',
      wissen: 'Chitinpanzer schützt und dient als Ansatz für die Muskulatur — äußeres Skelett.',
    },
    {
      term: 'Imago',
      meaning: 'Erwachsenes Insekt nach der Metamorphose',
      wissen: 'Das Imago ist das fortpflanzungsfähige Endstadium nach der Verwandlung.',
    },
    {
      term: 'Puppe',
      meaning: 'Ruhestadium mit Umbau',
      wissen: 'In der Puppe wird die Larve zum Imago umgebaut — typisch für vollständige Metamorphose.',
    },
    {
      term: 'Fühler',
      meaning: 'Sinnesorgane am Kopf vieler Insekten',
      wissen: 'Antennen am Kopf dienen vor allem dem Riechen und Tasten.',
    },
    {
      term: 'Larve',
      meaning: 'Jugendstadium, oft anders als das Imago',
      wissen: 'Larven (z. B. Raupen) sehen oft ganz anders aus als das erwachsene Insekt und fressen intensiv.',
    },
    {
      term: 'Metamorphose',
      meaning: 'Gestaltwechsel in der Entwicklung',
      wissen: 'Gestaltwechsel vom Jugend- zum Adultstadium — vollständig (mit Puppe) oder unvollständig.',
    },
    {
      term: 'Thorax',
      meaning: 'Brustabschnitt mit Beinen (und oft Flügeln)',
      wissen: 'Am Thorax sitzen die drei Beinpaare und oft die Flügel — mittlerer Körperabschnitt.',
    },
    {
      term: 'Hinterleib',
      meaning: 'Abdomen — hinterer Körperabschnitt',
      wissen: 'Im Abdomen liegen oft Verdauungs- und Fortpflanzungsorgane.',
    },
    {
      term: 'Flügel',
      meaning: 'Flugorgane vieler Insekten',
      wissen: 'Viele Insekten fliegen mit ein oder zwei Flügelpaaren; manche Arten sind flügellos.',
    },
    {
      term: 'Ei',
      meaning: 'Erstes Stadium vieler Insektenentwicklungen',
      wissen: 'Aus dem Ei schlüpft die Larve — Start der Metamorphose.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:viele-insekten-durchlaufen-eine-metamorp',
      statement: 'Viele Insekten durchlaufen eine Metamorphose.',
      correct: true,
      explanation: 'Vollständige oder unvollständige Verwandlung ist weit verbreitet.',
      wissen:
        'Metamorphose = Gestaltwechsel in der Entwicklung. Viele Insekten haben eine vollständige oder unvollständige Verwandlung.',
    },
    {
      concept: 'bio:k6:insekten-haben-typischerweise-acht-beine',
      statement: 'Insekten haben typischerweise acht Beine.',
      correct: false,
      explanation: 'Insekten: sechs Beine; Spinnen: acht.',
      wissen:
        'Insekten haben sechs Beine (drei Paare). Spinnentiere haben acht Beine — wichtiges Unterscheidungsmerkmal.',
    },
  ],
  sorts: [
    {
      concept: 'bio:k6:ordne-die-vollstaendige-insektenmetamorp',
      question: 'Ordne die vollständige Insektenmetamorphose.',
      labels: ['Ei', 'Larve', 'Puppe', 'Imago'],
      explanation: 'Klassische Reihenfolge bei Schmetterling, Käfer u. a.',
      wissen:
        'Vollständige Metamorphose: Ei → Larve → Puppe (Umbau) → Imago. So bei Schmetterling, Käfer, Biene u. a.',
    },
  ],
  icons: [
    {
      concept: 'bio:insekten:icon-metamorphose-tier',
      question: 'Welches Tier durchläuft typischerweise Ei → Larve → Puppe → Imago?',
      prompt: 'Vollständige Metamorphose',
      options: [
        { id: 'biene', label: 'Honigbiene', icon: '🐝' },
        { id: 'spinne', label: 'Kreuzspinne', icon: '🕷️' },
        { id: 'regenwurm', label: 'Regenwurm', icon: '🪱' },
        { id: 'schnecke', label: 'Schnecke', icon: '🐌' },
      ],
      correctId: 'biene',
      explanation: 'Viele Insekten (z. B. Bienen, Schmetterlinge) haben eine vollständige Metamorphose; Spinnen nicht.',
      wissen:
        'Vollständige Metamorphose mit Puppe ist typisch für viele Insekten (Biene, Schmetterling). Spinnen, Würmer und Schnecken haben diesen Ablauf nicht.',
    },
  ],
}

/** Spinnen und andere Gliederfüßer (Spezialthema). */
const spinnen: BioBank = {
  quelle: 'Wikipedia: Spinnentiere',
  url: 'https://de.wikipedia.org/wiki/Spinnentiere',
  conceptPrefix: 'bio:spinnen',
  facts: [
    {
      concept: 'bio:spinnen:beinzahl',
      prompt: 'Woran unterscheidest du Spinnentiere von Insekten am Beinbau?',
      answer: 'Spinnen haben typischerweise acht Beine, Insekten sechs',
      wrong: [
        'Beide haben immer genau sechs Beine',
        'Spinnen haben Flügelpaare wie Insekten',
        'Insekten haben acht Beine, Spinnen sechs',
      ],
      explanation: 'Beinzahl ist ein zentrales Unterscheidungsmerkmal — ohne Spoiler in der Frage selbst.',
      wissen:
        'Spinnentiere (Arachnida) haben am Vorderkörper in der Regel vier Laufbeinpaare, also acht Beine. Insekten haben drei Beinpaare (sechs Beine) und oft Fühler. Der Spinnenkörper gliedert sich typisch in Prosoma (Vorderkörper) und Opisthosoma (Hinterleib).',
    },
    {
      concept: 'bio:spinnen:netz-funktion',
      prompt: 'Welche Hauptfunktion hat ein Spinnennetz bei vielen Arten?',
      answer: 'Beutefang und oft auch Orientierung / Wohnraum',
      wrong: ['Fotosynthese', 'Knochenbildung', 'Milchproduktion für Junge'],
      explanation: 'Spinnenseide dient u. a. dem Fang von Beute.',
      wissen:
        'Viele Webspinnen erzeugen in Spinndrüsen Seidenfäden und spinnen daraus Fangnetze. Das Netz hält Beute fest; Seide dient außerdem Abseilfäden, Wohnröhren und dem Einwickeln der Beute.',
    },
    {
      concept: 'bio:spinnen:kieferklaue',
      prompt: 'Wozu dienen die Kieferklauen vieler Spinnentiere?',
      answer: 'Mundwerkzeug — oft mit Gift zum Beutefang',
      wrong: ['Atmung unter Wasser', 'Photosynthese', 'Federn bilden'],
      explanation: 'Kieferklauen greifen und können Gift einbringen.',
      wissen:
        'Cheliceren (Kieferklauen) sind das erste Extremitätenpaar der Spinnentiere. Bei vielen Spinnen münden Giftdrüsen darin: Beute wird gebissen, gelähmt und oft vorverdaut, bevor die Spinne die Nahrung aufsaugt.',
    },
    {
      concept: 'bio:spinnen:keine-fuehler',
      prompt: 'Welches Merkmal fehlt Spinnen im Vergleich zu Insekten typischerweise?',
      answer: 'Fühler (Antennen) wie bei Insekten',
      wrong: ['Beine', 'Mundwerkzeuge', 'äußeres Skelett aus Chitin'],
      explanation: 'Spinnen haben keine Insekten-Fühler; sie tasten u. a. mit Beinen/Pedipalpen.',
      wissen:
        'Spinnentiere besitzen keine Antennen. Stattdessen nutzen sie Pedipalpen und Sinneshaare an den Beinen zum Tasten, Riechen und Wahrnehmen von Vibrationen — ein klarer Unterschied zu Insekten.',
    },
    {
      concept: 'bio:spinnen:ernaehrung',
      prompt: 'Wie ernähren sich die meisten Spinnen?',
      answer: 'Als Räuber — oft Flüssignahrung nach Vorverdauung',
      wrong: ['Nur durch Fotosynthese', 'Ausschließlich als Pflanzenfresser', 'Nur durch Filtrieren von Plankton an Land'],
      explanation: 'Viele Spinnen jagen oder fangen Beute und verdauen sie vor.',
      wissen:
        'Die meisten Spinnen sind Räuber. Sie können nicht kauen: Gift und Verdauungssekret verflüssigen die Beute, die anschließend aufgesaugt wird (extraintestinale Verdauung).',
    },
    {
      concept: 'bio:spinnen:lebensraum',
      prompt: 'Wo leben Spinnen typischerweise?',
      answer: 'In sehr unterschiedlichen Lebensräumen an Land (z. B. Wiese, Wald, Gebäude)',
      wrong: ['Nur im offenen Ozean als Fische', 'Nur in der Antarktis ohne Ausnahme', 'Nur innerhalb von Baumstämmen als Larve'],
      explanation: 'Spinnen besiedeln viele terrestrische Lebensräume.',
      wissen:
        'Spinnentiere sind vor allem Landbewohner. Man findet sie in Wäldern, Wiesen, Gärten und Gebäuden; die Arten sind an Feuchtigkeit, Temperatur und Beuteangebot ihres Lebensraums angepasst.',
    },
    {
      concept: 'bio:spinnen:seide',
      prompt: 'Was ist Spinnenseide?',
      answer: 'Hochfeste Proteinfäden aus Spinndrüsen',
      wrong: ['Holzfasern der Bäume', 'Knochengewebe', 'Chlorophyllfäden'],
      explanation: 'Seide wird in Drüsen gebildet und für Netz, Fangfaden oder Kokon genutzt.',
      wissen:
        'Spinnenseide besteht aus Strukturproteinen (Spidroinen). Sie wird im Hinterleib in Spinndrüsen gebildet und über Spinnwarzen abgegeben — je nach Drüse für Rahmenfäden, Fangspirale, Kokon oder Sicherungsfäden.',
    },
    {
      concept: 'bio:spinnen:gliederfueszer',
      prompt: 'Zu welcher großen Gruppe gehören Spinnen und Insekten gemeinsam?',
      answer: 'Gliederfüßer (Arthropoden)',
      wrong: ['Wirbeltiere', 'Samenpflanzen', 'Bakterien'],
      explanation: 'Beide haben gegliederte Beine und oft einen Chitinpanzer — gehören aber zu verschiedenen Untergruppen.',
      wissen:
        'Spinnen und Insekten sind Gliederfüßer (Arthropoda) mit Chitin-Außenskelett und gegliederten Extremitäten. Spinnen gehören zu den Kieferklauenträgern (Chelicerata), Insekten zu den Tracheentieren — gemeinsame Obergruppe, unterschiedliche Klassen.',
    },
  ],
  pairs: [
    {
      concept: 'bio:spinnen:paar-spinne',
      term: 'Spinne',
      meaning: 'Spinnentier mit typisch acht Beinen',
      wissen:
        'Webspinnen haben acht Laufbeine, keinen Insekten-Körperbau mit drei Abschnitten und keine Antennen.',
    },
    {
      concept: 'bio:spinnen:paar-seide',
      term: 'Spinnenseide',
      meaning: 'Festhalten von Beute / Netzbau',
      wissen:
        'Seide aus Spinndrüsen ist extrem zugfest und dehnbar — Grundlage für Netze, Abseilfäden und Kokons.',
    },
    {
      concept: 'bio:spinnen:paar-kiefer',
      term: 'Kieferklaue',
      meaning: 'Mundwerkzeug vieler Spinnentiere',
      wissen:
        'Cheliceren greifen die Beute; bei vielen Arten führen sie Giftkanäle.',
    },
    {
      concept: 'bio:spinnen:paar-glieder',
      term: 'Gliederfüßer',
      meaning: 'Chitinpanzer und gegliederte Beine',
      wissen:
        'Arthropoden umfassen u. a. Insekten, Spinnentiere und Krebse — äußeres Skelett und Segmentierung der Beine.',
    },
    {
      concept: 'bio:spinnen:paar-netz',
      term: 'Fangnetz',
      meaning: 'Struktur zum Beutefang aus Seide',
      wissen:
        'Radnetze und andere Netzformen halten Beute mechanisch fest und melden Vibrationen an die Spinne.',
    },
    {
      concept: 'bio:spinnen:paar-pedipalpus',
      term: 'Pedipalpen',
      meaning: 'Tast- und Hilfswerkzeuge am Vorderkörper',
      wissen:
        'Pedipalpen sitzen hinter den Cheliceren und dienen Tasten, Nahrungsaufnahme oder Fortpflanzung — nicht als Laufbeine.',
    },
    {
      concept: 'bio:spinnen:paar-gift',
      term: 'Gift',
      meaning: 'Dient dem Beutefang / der Verteidigung',
      wissen:
        'Viele Spinnen lähmen Beute mit Gift aus den Cheliceren; einheimische Arten sind für Menschen in der Regel ungefährlich.',
    },
    {
      concept: 'bio:spinnen:paar-kokon',
      term: 'Eikokon',
      meaning: 'Schutzhülle für Eier aus Seide',
      wissen:
        'Weibchen spinnen oft einen Kokon aus spezieller Seide, der Eier vor Austrocknung und Feinden schützt.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:spinnen:tf-kein-insekt',
      statement: 'Spinnen sind Insekten.',
      correct: false,
      explanation: 'Spinnen gehören zu den Spinnentieren, nicht zu den Insekten.',
      wissen:
        'Insekten: drei Beinpaare, oft Flügel und Fühler. Spinnentiere: meist vier Beinpaare, Cheliceren, keine Antennen.',
    },
    {
      concept: 'bio:spinnen:tf-netz',
      statement: 'Viele Spinnen nutzen Netze zum Beutefang.',
      correct: true,
      explanation: 'Spinnenseide dient u. a. dem Fang von Beute.',
      wissen:
        'Nicht alle Spinnen bauen Netze (manche jagen aktiv), aber Webspinnen nutzen Seidennetze gezielt zum Beutefang.',
    },
    {
      concept: 'bio:spinnen:tf-wirbelsaeule',
      statement: 'Spinnen besitzen eine Wirbelsäule.',
      correct: false,
      explanation: 'Spinnen sind wirbellos.',
      wissen:
        'Spinnen sind Wirbellose: Stützfunktion übernimmt das Außenskelett aus Chitin, nicht eine innere Wirbelsäule.',
    },
  ],
  icons: [
    {
      concept: 'bio:spinnen:icon-seidennetz',
      question: 'Welches Lebewesen nutzt oft selbst erzeugte Seidenfäden zum Beutefang?',
      prompt: 'Angepasstheit',
      options: [
        { id: 'spinne', label: 'Kreuzspinne', icon: '🕷️' },
        { id: 'biene', label: 'Honigbiene', icon: '🐝' },
        { id: 'schnecke', label: 'Schnecke', icon: '🐌' },
        { id: 'regenwurm', label: 'Regenwurm', icon: '🪱' },
      ],
      correctId: 'spinne',
      explanation: 'Viele Spinnen bauen Netze aus Spinnenseide; Bienen bauen Waben aus Wachs.',
      wissen:
        'Viele Spinnen erzeugen in Spinndrüsen Protein-Seide und spinnen Fangnetze. Bienen bauen Waben aus Wachs — andere Angepasstheit, anderes Material.',
    },
  ],
}

const systematikK6: BioBank = {
  quelle: 'Wikipedia: Systematik (Biologie)',
  url: 'https://de.wikipedia.org/wiki/Systematik_(Biologie)',
  facts: [
    {
      concept: 'bio:k6:woran-erkennst-du-wirbeltiere-grundsaetz',
      prompt: 'Woran erkennst du Wirbeltiere grundsätzlich?',
      answer: 'Sie besitzen eine Wirbelsäule (bzw. Chorda/Wirbel)',
      wrong: ['Sie haben immer sechs Beine', 'Sie haben nie Augen', 'Sie leben nur im Meer'],
      explanation: 'Wirbeltiere: innere Stützstruktur aus Wirbelsäule.',
      wissen:
        'Wirbeltiere besitzen eine innere Wirbelsäule (bzw. Chorda/Wirbel). Dazu gehören Fische, Lurche, Kriechtiere, Vögel und Säugetiere.',
    },
    {
      concept: 'bio:k6:welche-gruppe-ist-wirbellos',
      prompt: 'Welche Gruppe ist wirbellos?',
      answer: 'Insekten',
      wrong: ['Säugetiere', 'Vögel', 'Knochenfische'],
      explanation: 'Insekten haben keine Wirbelsäule.',
      wissen:
        'Insekten sind wirbellos (kein inneres Skelett aus Wirbelsäule). Säugetiere, Vögel und Knochenfische sind Wirbeltiere.',
    },
  ],
  pairs: [
    {
      term: 'Wirbeltier',
      meaning: 'Tier mit Wirbelsäule',
      wissen: 'Innere Wirbelsäule — Fische, Lurche, Kriechtiere, Vögel, Säuger.',
    },
    {
      term: 'Wirbelloses Tier',
      meaning: 'Ohne Wirbelsäule',
      wissen: 'Ohne Wirbelsäule — z. B. Insekten, Spinnen, Würmer, Weichtiere.',
    },
    {
      term: 'Gliederfüßer',
      meaning: 'Chitinpanzer und gegliederte Beine',
      wissen: 'Chitinpanzer und gegliederte Beine — Insekten und Spinnen gehören dazu.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:spinnen-sind-insekten',
      statement: 'Spinnen sind Insekten.',
      correct: false,
      explanation: 'Spinnen haben acht Beine und gehören zu den Spinnentieren.',
      wissen:
        'Spinnen sind Spinnentiere (acht Beine, keine Antennen). Insekten haben sechs Beine und oft Fühler — verschiedene Klassen.',
    },
  ],
  multis: [
    {
      concept: 'bio:k6:welche-merkmale-passen-zu-wirbeltieren',
      question: 'Welche Merkmale passen zu Wirbeltieren?',
      correct: ['Innere Wirbelsäule', 'Oft Schädel'],
      wrong: ['Immer genau sechs Beine', 'Nie Lungen oder Kiemen'],
      explanation: 'Wirbeltiere haben innere Stütze; Beinzahl variiert stark.',
      wissen:
        'Wirbeltiere: innere Wirbelsäule, oft Schädel. Beinzahl und Atmungsorgane (Kiemen/Lungen) variieren je nach Gruppe.',
    },
  ],
}

const wald: BioBank = {
  ...Q.wald,
  conceptPrefix: 'bio:k6:wald',
  facts: [
    {
      concept: 'bio:k6:wald:lebensgemeinschaft',
      prompt: 'Was ist der Wald als Lebensgemeinschaft grob?',
      answer: 'Viele Arten und abiotische Faktoren in Wechselwirkung',
      wrong: ['Nur ein einzelner Baum ohne Umgebung', 'Nur Asphalt ohne Leben', 'Nur eine Knochenzelle'],
      explanation: 'Wald = Biozönose + Biotop im Überblick.',
      wissen:
        'Im Wald wirken Pflanzen, Tiere, Pilze und Faktoren wie Licht und Boden zusammen. Nahrungsnetz und Stockwerke → Spezialthema.',
    },
    {
      concept: 'bio:k6:wald:faktoren',
      prompt: 'Welche abiotischen Faktoren prägen den Lebensraum Wald besonders?',
      answer: 'Licht, Feuchtigkeit und Boden',
      wrong: ['Nur Mondphasen', 'Nur Verkehrszeichen', 'Nur Schulklingeln'],
      explanation: 'Abiotische Faktoren steuern Artenzusammensetzung.',
      wissen:
        'Licht, Feuchtigkeit und Boden bestimmen mit, welche Arten im Wald vorkommen.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k6:wald:paar-biotop',
      term: 'Lebensraum Wald',
      meaning: 'Ort mit Licht, Wasser, Boden und vielen Arten',
      wissen: 'Abiotische und biotische Faktoren bilden den Waldlebensraum.',
    },
    {
      concept: 'bio:k6:wald:paar-vielfalt',
      term: 'Artenvielfalt',
      meaning: 'Viele verschiedene Organismen im Wald',
      wissen: 'Vom Baum bis zum Bodenbesiedler — Vielfalt ist typisch.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:wald:tf-einzeln',
      statement: 'Im Wald leben Arten völlig unabhängig voneinander.',
      correct: false,
      explanation: 'Arten sind über Nahrung, Lebensraum und Stoffkreisläufe vernetzt.',
      wissen:
        'Waldarten sind vernetzt — Details zu Nahrungsnetz und Stockwerken im Spezialthema.',
    },
  ],
  multis: [
    {
      concept: 'bio:k6:welche-faktoren-praegen-den-lebensraum-w',
      question: 'Welche Faktoren prägen den Lebensraum Wald?',
      correct: ['Licht', 'Feuchtigkeit', 'Boden'],
      wrong: ['Nur Mondphasen', 'Nur Verkehrszeichen'],
      explanation: 'Abiotische Faktoren steuern Artenzusammensetzung.',
      wissen:
        'Licht, Feuchtigkeit und Boden sind abiotische Faktoren, die bestimmen, welche Arten im Wald vorkommen.',
    },
  ],
}

const zellen: BioBank = {
  ...Q.zelle,
  conceptPrefix: 'bio:k6:zellen',
  facts: [
    {
      concept: 'bio:k6:welches-organell-enthaelt-bei-pflanzen-u',
      prompt: 'Welches Organell enthält bei Pflanzen und Tieren die Erbinformation?',
      answer: 'Zellkern',
      wrong: ['Zellwand', 'Vakuole allein', 'Nur der Zellsaft'],
      explanation: 'Im Zellkern liegt die DNA (Chromosomen).',
      wissen:
        'Im Zellkern liegt die DNA (Chromosomen). Er steuert viele Zellvorgänge bei Pflanzen- und Tierzellen.',
      gap: 'Die Erbinformation liegt im ___.',
      gapAccepted: ['Zellkern', 'Kern'],
    },
    {
      concept: 'bio:k6:was-besitzen-pflanzliche-zellen-typische',
      prompt: 'Was besitzen pflanzliche Zellen typischerweise zusätzlich zu tierischen?',
      answer: 'Zellwand und oft Chloroplasten sowie große Vakuole',
      wrong: ['Nur Mitochondrien und sonst nichts', 'Federn', 'Kiemen'],
      explanation: 'Zellwand (Cellulose), Chloroplasten, Zentralvakuole sind Pflanzenmerkmale.',
      wissen:
        'Pflanzenzellen haben typischerweise Zellwand (Cellulose), Chloroplasten und eine große Vakuole — Tierzellen nicht.',
    },
    {
      concept: 'bio:k6:welche-struktur-begrenzt-tierische-zelle',
      prompt: 'Welche Struktur begrenzt tierische Zellen nach außen?',
      answer: 'Zellmembran',
      wrong: ['Dicke Holz-Zellwand aus Cellulose', 'Federkleid', 'Chitinpanzer außen immer'],
      explanation: 'Tiere: Zellmembran; Pflanzen zusätzlich Zellwand.',
      wissen:
        'Tierische Zellen werden von der Zellmembran begrenzt; Pflanzen haben zusätzlich eine Zellwand.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k6:zellen:paar-kern',
      term: 'Zellkern',
      meaning: 'Enthält die Erbinformation',
      wissen: 'Steuert viele Zellvorgänge; DNA liegt hier.',
    },
    {
      concept: 'bio:k6:zellen:paar-membran',
      term: 'Zellmembran',
      meaning: 'Äußere Begrenzung tierischer Zellen',
      wissen: 'Steuert den Stoffaustausch; Pflanzen haben zusätzlich Zellwand.',
    },
    {
      concept: 'bio:k6:zellen:paar-wand',
      term: 'Zellwand',
      meaning: 'Feste Hülle aus Cellulose (Pflanzen)',
      wissen: 'Gibt Form und Schutz zusätzlich zur Membran.',
    },
    {
      concept: 'bio:k6:zellen:paar-vergleich',
      term: 'Pflanzenzelle',
      meaning: 'Typisch mit Wand, oft Chloroplasten und großer Vakuole',
      wissen: 'Unterscheidet sich strukturell von der Tierzelle — Organellen-Details im Mikroskop-Spezial.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:tierische-zellen-besitzen-immer-eine-cel',
      statement: 'Tierische Zellen besitzen immer eine Cellulose-Zellwand.',
      correct: false,
      explanation: 'Zellwände aus Cellulose sind typisch für Pflanzenzellen.',
      wissen:
        'Cellulose-Zellwände sind typisch für Pflanzenzellen — Tierzellen haben nur eine Zellmembran.',
    },
    {
      concept: 'bio:k6:beide-zelltypen-koennen-mitochondrien-be',
      statement: 'Beide Zelltypen können Mitochondrien besitzen.',
      correct: true,
      explanation: 'Mitochondrien kommen in Pflanzen- und Tierzellen vor.',
      wissen:
        'Mitochondrien liefern Energie in Pflanzen- und Tierzellen — Feinheiten zu Organellen → Mikroskop-Spezial.',
    },
  ],
  multis: [
    {
      concept: 'bio:k6:was-gehoert-typischerweise-zur-pflanzenz',
      question: 'Was gehört typischerweise zur Pflanzenzelle?',
      correct: ['Zellwand', 'Chloroplasten'],
      wrong: ['Nur Federn', 'Nur Kiemen'],
      explanation: 'Zellwand und Chloroplasten sind Pflanzenmerkmale.',
      wissen: 'Zur Pflanzenzelle gehören typischerweise Zellwand und Chloroplasten.',
    },
  ],
}

const heilen: BioBank = {
  quelle: 'Wikipedia: Heilpflanze',
  url: 'https://de.wikipedia.org/wiki/Heilpflanze',
  facts: [
    {
      concept: 'bio:k6:warum-gelten-manche-pflanzen-als-heilpfl',
      prompt: 'Warum gelten manche Pflanzen als Heilpflanzen?',
      answer: 'Sie enthalten Wirkstoffe, die medizinisch genutzt werden',
      wrong: ['Sie haben immer Giftzähne', 'Sie sind immer ungenießbar', 'Sie erzeugen Strom'],
      explanation: 'Wirkstoffe können heilen — Dosierung und Fachkenntnis sind nötig.',
      wissen:
        'Heilpflanzen enthalten Wirkstoffe, die medizinisch genutzt werden können — Dosis und sichere Bestimmung sind entscheidend.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:jede-wildpflanze-darf-bedenkenlos-in-gro',
      statement: 'Jede Wildpflanze darf bedenkenlos in großer Menge eingenommen werden.',
      correct: false,
      explanation: 'Viele Pflanzen sind giftig oder nur in richtiger Dosis wirksam.',
      wissen:
        'Viele Wildpflanzen sind giftig oder nur in richtiger Dosis wirksam — nie bedenkenlos große Mengen einnehmen.',
    },
  ],
  pairs: [
    {
      term: 'Wirkstoff',
      meaning: 'Chemische Verbindung mit biologischer Wirkung',
      wissen: 'Wirkstoffe aus Pflanzen sind die Grundlage vieler Arzneimittel — chemisch wirksam am Organismus.',
    },
    {
      term: 'Teeaufguss',
      meaning: 'Auszug wasserlöslicher Stoffe mit heißem Wasser',
      wissen: 'Beim Teeaufguss lösen heißes Wasser wasserlösliche Stoffe aus der Pflanze heraus.',
    },
  ],
}

const pfuetze: BioBank = {
  quelle: 'Wikipedia: Kleinstlebewesen',
  url: 'https://de.wikipedia.org/wiki/Mikroorganismus',
  facts: [
    {
      concept: 'bio:k6:warum-lohnt-der-blick-ins-mikroskop-bei-',
      prompt: 'Warum lohnt der Blick ins Mikroskop bei einer Pfütze?',
      answer: 'Dort leben viele Kleinstlebewesen',
      wrong: ['Dort gibt es nur Steine', 'Wasser ist immer steril', 'Nur Säugetiere schwimmen dort'],
      explanation: 'Einzeller und Kleinkrebse u. a. besiedeln Kleingewässer.',
      wissen:
        'In Pfützen leben oft Einzeller und Kleinkrebse — ein kleiner Lebensraum mit großer Vielfalt unter dem Mikroskop.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:in-jeder-pfuetze-leben-ausschliesslich-f',
      statement: 'In jeder Pfütze leben ausschließlich Fische.',
      correct: false,
      explanation: 'Oft Mikroorganismen und Kleinstkrebse — selten Fische.',
      wissen:
        'Pfützen beherbergen vor allem Mikroorganismen und Kleinstkrebse — Fische brauchen größere, dauerhafte Gewässer.',
    },
  ],
}

export const BIOLOGIE_K6_GENERATORS: Record<string, Topic['generate']> = {
  'bi-k6-lb1-samenpflanzen': bankGenerate(samenpflanzen),
  'bi-k6-lb2-wirbellose': bankGenerate(wirbelloseOverview),
  'bi-k6-lb2-insekten': bankGenerate(insekten),
  'bi-k6-lb2-spinnen': bankGenerate(spinnen),
  'bi-k6-lb3-systematik': bankGenerate(systematikK6),
  'bi-k6-lb4-wald': bankGenerate(wald),
  'bi-k6-lb5-zellen': bankGenerate(zellen),
  'bi-k6-lbw-heilen': bankGenerate(heilen),
  'bi-k6-lbw-pfuetze': bankGenerate(pfuetze),
  ...BIOLOGIE_K6_WIRBELLOSE_SPECIAL_GENERATORS,
}
