/**
 * K6 Wirbellose Spezialbanken — Gliederfüßer-Gruppen, Weichtiere, Ringelwürmer,
 * Stachelhäuter, Nesseltiere. Überblick bleibt in biologie6.ts schlank.
 * Originalwortlaut; fragebezogenes Fachwissen; released:false via Gym-Topics.
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

export const krebstiere: BioBank = {
  quelle: 'Wikipedia: Krebstiere',
  url: 'https://de.wikipedia.org/wiki/Krebstiere',
  conceptPrefix: 'bio:k6:krebstiere',
  facts: [
    {
      concept: 'bio:k6:krebstiere:zwei-antennen',
      prompt: 'Welches Merkmal unterscheidet Krebstiere oft klar von Insekten?',
      answer: 'Zwei Antennenpaare (statt eines)',
      wrong: ['Immer genau sechs Beine', 'Federkleid', 'Wirbelsäule aus Knochen'],
      explanation: 'Krebstiere tragen typischerweise zwei Fühlerpaare am Kopf.',
      wissen:
        'Krebstiere sind Gliederfüßer mit Chitinpanzer. Am Kopf sitzen meist zwei Antennenpaare — Insekten haben nur ein Paar. Viele Krebse atmen mit Kiemen und leben im Wasser.',
      gap: 'Krebstiere haben typischerweise ___ Antennenpaare.',
      gapAccepted: ['zwei', '2', 'Zwei'],
    },
    {
      concept: 'bio:k6:krebstiere:flusskrebs-bau',
      prompt: 'Wie ist der Körper des Flusskrebses äußerlich grob gegliedert?',
      answer: 'Kopfbruststück und gegliederter Hinterleib',
      wrong: ['Nur Kopf und Flügel', 'Drei gleiche Flossen', 'Nur ein weicher Fuß ohne Panzer'],
      explanation: 'Kopf und Brust sind zum Cephalothorax verwachsen; der Hinterleib ist segmentiert.',
      wissen:
        'Beim Flusskrebs sind Kopf und Brust zu einem starren Kopfbruststück verwachsen. Am Hinterleib sitzen Schwimmbeine und ein Schwanzfächer. Der Panzer besteht aus Chitin und oft Kalk.',
    },
    {
      concept: 'bio:k6:krebstiere:kiemen',
      prompt: 'Womit atmen Flusskrebse typischerweise?',
      answer: 'Mit Kiemen unter dem Panzer',
      wrong: ['Nur mit Tracheen wie Landinsekten', 'Nur mit Lungen wie Säuger', 'Durch Fotosynthese'],
      explanation: 'Kiemenbüschel nehmen Sauerstoff aus dem Wasser auf.',
      wissen:
        'Flusskrebse atmen über Kiemen an der Basis der Laufbeine unter dem Kopfbrustpanzer. Frisches Wasser muss die Kiemen umspülen — deshalb brauchen sie sauerstoffreiches Wasser.',
      gap: 'Flusskrebse atmen mit ___.',
      gapAccepted: ['Kiemen', 'Kiemenbüscheln'],
    },
    {
      concept: 'bio:k6:krebstiere:haeutung',
      prompt: 'Warum müssen Flusskrebse sich häuten?',
      answer: 'Der harte Panzer wächst nicht mit',
      wrong: ['Weil sie Federn wechseln', 'Weil sie Knochen erneuern', 'Nur zur Fotosynthese'],
      explanation: 'Nach der Häutung ist der neue Panzer zunächst weich.',
      wissen:
        'Das Außenskelett aus Chitin und Kalk wächst nicht mit. Der Krebs streift den alten Panzer ab und bildet einen größeren, zunächst weichen Panzer. In dieser Zeit ist er wehrlos und versteckt sich.',
    },
    {
      concept: 'bio:k6:krebstiere:wasserfloh',
      prompt: 'Was sind Wasserflöhe biologisch?',
      answer: 'Kleine Krebstiere im Plankton von Stillgewässern',
      wrong: ['Insekten mit sechs Beinen', 'Spinnentiere mit acht Beinen', 'Fische mit Wirbelsäule'],
      explanation: 'Daphnien sind Kiemenfußkrebse — winzige Gliederfüßer im Wasser.',
      wissen:
        'Wasserflöhe sind winzige Krebstiere. Sie schwimmen hüpfend mit großen Antennen, filtrieren Algen und sind wichtige Nahrung für Fische. Trotz des Namens sind sie keine Insekten.',
    },
    {
      concept: 'bio:k6:krebstiere:beinzahl',
      prompt: 'Wie viele Laufbeinpaare hat ein Flusskrebs am Kopfbruststück typischerweise?',
      answer: 'Fünf Paare (davon oft eines mit Scheren)',
      wrong: ['Genau drei Paare wie Insekten', 'Genau vier Paare wie Spinnen', 'Keine Beine'],
      explanation: 'Zehnfüßer: fünf Beinpaare am Cephalothorax; das erste oft als Scheren.',
      wissen:
        'Höhere Krebse tragen am Kopfbruststück fünf Laufbeinpaare. Beim Flusskrebs ist das vordere Paar zu großen Scheren umgebildet — Greifen, Verteidigung und Nahrungsaufnahme.',
    },
    {
      concept: 'bio:k6:krebstiere:zwerggarnele',
      prompt: 'Welches Merkmal teilen Zwerggarnelen mit Flusskrebsen?',
      answer: 'Chitinpanzer, gegliederte Beine und Kiemenatmung',
      wrong: ['Innere Wirbelsäule', 'Federflügel', 'Milchdrüsen'],
      explanation: 'Beide sind Krebstiere mit Außenskelett und Kiemen.',
      wissen:
        'Zwerggarnelen sind Krebstiere wie Flusskrebse: Chitinpanzer, gegliederte Extremitäten, Antennen und Kiemen. Sie sind kleiner und schlanker, leben oft in Süßwasser.',
    },
    {
      concept: 'bio:k6:krebstiere:gliederfuesser',
      prompt: 'Zu welcher großen Tiergruppe gehören Krebstiere zusammen mit Insekten und Spinnen?',
      answer: 'Gliederfüßer (Arthropoden)',
      wrong: ['Wirbeltiere', 'Samenpflanzen', 'Bakterien'],
      explanation: 'Gemeinsam: Chitin-Außenskelett und gegliederte Beine.',
      wissen:
        'Krebstiere, Insekten und Spinnentiere sind Gliederfüßer. Sie teilen Außenskelett und segmentierte Extremitäten, unterscheiden sich aber in Antennenzahl, Beinzahl und Atmung.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k6:krebstiere:paar-kieme',
      term: 'Kieme',
      meaning: 'Atemorgan im Wasser',
      wissen: 'Kiemen nehmen Sauerstoff aus dem Wasser auf — typisch für viele Krebstiere und entscheidend für den Gaswechsel.',
    },
    {
      concept: 'bio:k6:krebstiere:paar-carapax',
      term: 'Kopfbruststück',
      meaning: 'Verwachsener Kopf-Brust-Panzer',
      wissen: 'Beim Flusskrebs deckt der Carapax Kopf und Brust als starre Einheit ab und schützt die Organe darunter.',
    },
    {
      concept: 'bio:k6:krebstiere:paar-schere',
      term: 'Schere',
      meaning: 'Umbildetes vorderes Laufbeinpaar',
      wissen: 'Scheren greifen Beute und dienen der Verteidigung — ein typisches Merkmal vieler Zehnfüßer.',
    },
    {
      concept: 'bio:k6:krebstiere:paar-haeutung',
      term: 'Häutung',
      meaning: 'Abstreifen des alten Panzers',
      wissen: 'Weil der Panzer nicht mitwächst, müssen Krebse sich periodisch häuten, um größer zu werden.',
    },
    {
      concept: 'bio:k6:krebstiere:paar-antennen',
      term: 'Zwei Antennenpaare',
      meaning: 'Typisches Krebstier-Merkmal am Kopf',
      wissen: 'Zwei Fühlerpaare unterscheiden Krebse oft von Insekten, die nur ein Antennenpaar tragen.',
    },
    {
      concept: 'bio:k6:krebstiere:paar-wasserfloh',
      term: 'Wasserfloh',
      meaning: 'Winziger Planktonkrebs',
      wissen: 'Daphnien filtrieren Algen und hüpfen mit großen Antennen durchs Wasser — wichtige Nahrungsbasis.',
    },
    {
      concept: 'bio:k6:krebstiere:paar-chitin',
      term: 'Chitinpanzer',
      meaning: 'Äußeres Skelett aus Chitin (oft mit Kalk)',
      wissen: 'Der Panzer schützt und stützt den Körper; bei Krebsen ist er oft zusätzlich verkalkt.',
    },
    {
      concept: 'bio:k6:krebstiere:paar-schwanz',
      term: 'Schwanzfächer',
      meaning: 'Ruder am Hinterende zum Rückwärtsschwimmen',
      wissen: 'Mit kräftigem Schlag des Schwanzfächers flieht der Flusskrebs oft blitzschnell rückwärts.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:krebstiere:tf-insekt',
      statement: 'Wasserflöhe sind Insekten.',
      correct: false,
      explanation: 'Wasserflöhe sind Krebstiere, keine Insekten.',
      wissen:
        'Trotz des Namens „Floh“ gehören Wasserflöhe zu den Krebstieren. Sie haben zwei Antennenpaare und leben als Planktonkrebse — nicht als sechsbeinige Insekten.',
    },
    {
      concept: 'bio:k6:krebstiere:tf-kiemen',
      statement: 'Flusskrebse atmen typischerweise mit Kiemen.',
      correct: true,
      explanation: 'Kiemen liegen unter dem Kopfbrustpanzer.',
      wissen:
        'Flusskrebse nehmen Sauerstoff über Kiemen aus dem Wasser auf. Ohne ausreichend gelösten Sauerstoff können sie nicht dauerhaft leben.',
    },
    {
      concept: 'bio:k6:krebstiere:tf-wirbelsaeule',
      statement: 'Krebstiere besitzen eine innere Wirbelsäule.',
      correct: false,
      explanation: 'Sie sind wirbellos und haben ein Außenskelett.',
      wissen:
        'Krebstiere sind Wirbellose: Stütze und Schutz übernimmt das äußere Chitin-/Kalkskelett, nicht eine Wirbelsäule wie bei Fischen.',
    },
    {
      concept: 'bio:k6:krebstiere:tf-haeutung',
      statement: 'Der Chitinpanzer des Flusskrebses wächst lebenslang elastisch mit.',
      correct: false,
      explanation: 'Der Panzer muss gehäutet werden.',
      wissen:
        'Der harte Panzer wächst nicht mit. Wachstum erfolgt über Häutungen, bei denen ein neuer, zunächst weicher Panzer gebildet wird.',
    },
  ],
  multis: [
    {
      concept: 'bio:k6:krebstiere:multi-merkmale',
      question: 'Welche Merkmale passen zu Krebstieren?',
      correct: ['Oft zwei Antennenpaare', 'Häufig Kiemenatmung'],
      wrong: ['Immer genau sechs Beine', 'Innere Wirbelsäule'],
      explanation: 'Krebse: zwei Antennenpaare, oft Kiemen — nicht Insektenbeinzahl.',
      wissen:
        'Krebstiere haben typisch zwei Antennenpaare und atmen oft mit Kiemen. Sechs Beine sind Insektenmerkmal; eine Wirbelsäule haben sie nicht.',
    },
  ],
  icons: [
    {
      concept: 'bio:k6:krebstiere:icon-wasser',
      question: 'Welches Lebewesen atmet typischerweise mit Kiemen unter einem Chitinpanzer?',
      prompt: 'Krebstiere',
      options: [
        { id: 'krebs', label: 'Flusskrebs', icon: '🦞' },
        { id: 'biene', label: 'Honigbiene', icon: '🐝' },
        { id: 'spinne', label: 'Kreuzspinne', icon: '🕷️' },
        { id: 'amsel', label: 'Amsel', icon: '🐦' },
      ],
      correctId: 'krebs',
      explanation: 'Flusskrebse atmen mit Kiemen; Bienen mit Tracheen, Vögel mit Lungen.',
      wissen:
        'Flusskrebse sind Krebstiere mit Kiemenatmung unter dem Panzer. Landinsekten nutzen Tracheen, Vögel Lungen — andere Atmungsorgane.',
    },
  ],
}

export const tausendfuesser: BioBank = {
  quelle: 'Wikipedia: Tausendfüßer',
  url: 'https://de.wikipedia.org/wiki/Tausendf%C3%BC%C3%9Fer',
  conceptPrefix: 'bio:k6:tausendfuesser',
  facts: [
    {
      concept: 'bio:k6:tausendfuesser:myriapoda',
      prompt: 'Was sind Tausendfüßer biologisch?',
      answer: 'Landlebende Gliederfüßer mit vielen Beinpaaren',
      wrong: ['Wirbeltiere mit Wirbelsäule', 'Weichtiere mit Kalkgehäuse', 'Nur freischwimmende Quallen'],
      explanation: 'Myriapoden: segmentierter Körper, zahlreiche Beine, Chitinpanzer.',
      wissen:
        'Tausendfüßer (Myriapoda) sind Gliederfüßer an Land. Ihr Körper besteht aus vielen ähnlichen Segmenten mit Beinen. Dazu gehören u. a. Schnurfüßer (Doppelfüßer) und Hundertfüßer.',
    },
    {
      concept: 'bio:k6:tausendfuesser:doppelfuesser',
      prompt: 'Woran erkennst du Doppelfüßer / Schnurfüßer oft?',
      answer: 'Meist zwei Beinpaare je Körperring und zylindrischer Körper',
      wrong: ['Genau sechs Beine und Flügel', 'Acht Beine und Spinnenseide', 'Zwei Schalenklappen'],
      explanation: 'Diplopoden: zwei Beinpaare pro Diplosegment; oft Detritusfresser.',
      wissen:
        'Schnurfüßer gehören zu den Doppelfüßern: Die meisten Rumpfsegmente tragen zwei Beinpaare. Der Körper ist oft zylindrisch; viele fressen abgestorbenes Pflanzenmaterial und rollen sich bei Gefahr ein.',
      gap: 'Doppelfüßer haben meist ___ Beinpaare je Körperring.',
      gapAccepted: ['zwei', '2', 'Zwei'],
    },
    {
      concept: 'bio:k6:tausendfuesser:hundertfuesser',
      prompt: 'Was unterscheidet Hundertfüßer von Schnurfüßern besonders?',
      answer: 'Ein Beinpaar je Segment und oft Giftklauen als Räuber',
      wrong: ['Sie haben immer Flügel', 'Sie filtrieren nur Plankton', 'Sie bilden Samen'],
      explanation: 'Chilopoden: ein Beinpaar/Segment, Forcipulen mit Gift, abgeflacht.',
      wissen:
        'Hundertfüßer haben ein Beinpaar je Rumpfsegment und sind meist abgeflacht. Das erste Beinpaar ist zu Giftklauen (Forcipulen) umgebildet — sie jagen andere Wirbellose.',
    },
    {
      concept: 'bio:k6:tausendfuesser:ernaehrung',
      prompt: 'Wie ernähren sich Schnurfüßer typischerweise?',
      answer: 'Als Zersetzer von abgestorbenem Pflanzenmaterial',
      wrong: ['Nur als aktive Jäger mit Giftbiss', 'Nur durch Fotosynthese', 'Nur als Blutsauger an Säugern'],
      explanation: 'Viele Diplopoden fressen Detritus und Totholz.',
      wissen:
        'Schnurfüßer und viele andere Doppelfüßer ernähren sich von Laubstreu, Totholz und Detritus. Damit tragen sie zur Zersetzung und zum Stoffkreislauf im Boden bei — anders als räuberische Hundertfüßer.',
    },
    {
      concept: 'bio:k6:tausendfuesser:gift',
      prompt: 'Wozu dienen die Giftklauen der Hundertfüßer?',
      answer: 'Beute ergreifen und lähmen',
      wrong: ['Wasser aus der Luft filtrieren', 'Photosynthese starten', 'Milch erzeugen'],
      explanation: 'Forcipulen injizieren Gift in die Beute.',
      wissen:
        'Bei Hundertfüßern ist das erste Beinpaar zu Kieferfüßen mit Giftdrüsen umgebildet. Damit greifen und lähmen sie Beute. Doppelfüßer beißen nicht so; manche sondern Abwehrsekrete ab.',
    },
    {
      concept: 'bio:k6:tausendfuesser:lebensraum',
      prompt: 'Wo leben Tausendfüßer typischerweise?',
      answer: 'In feuchter Bodenstreu, unter Steinen oder Totholz',
      wrong: ['Nur im offenen Ozean als Fische', 'Nur in der Antarktis ohne Ausnahme', 'Nur in Baumkronen als Vögel'],
      explanation: 'Feuchtigkeitsliebende Bodenbewohner.',
      wissen:
        'Tausendfüßer brauchen Feuchtigkeit und leben oft in der Laubstreu, unter Steinen oder in Totholz. Sie sind nachtaktiv und empfindlich gegen Austrocknung.',
    },
    {
      concept: 'bio:k6:tausendfuesser:kein-insekt',
      prompt: 'Warum sind Tausendfüßer keine Insekten?',
      answer: 'Sie haben weit mehr als drei Beinpaare und keinen typischen Insektenbau',
      wrong: ['Weil sie eine Wirbelsäule haben', 'Weil sie immer Flügel tragen', 'Weil sie Samen bilden'],
      explanation: 'Insekten: drei Beinpaare; Myriapoden: viele Beinpaare.',
      wissen:
        'Insekten haben drei Beinpaare und oft Flügel. Tausendfüßer besitzen zahlreiche Beinpaare an vielen Segmenten und keinen klassischen Kopf-Brust-Hinterleib-Bau der Insekten.',
    },
    {
      concept: 'bio:k6:tausendfuesser:abwehr',
      prompt: 'Wie wehren sich viele Schnurfüßer bei Gefahr?',
      answer: 'Einrollen und oft chemische Abwehrsekrete',
      wrong: ['Spinnennetz bauen', 'Rückstoßschwimmen wie Tintenfische', 'Fliegen mit Flügelpaaren'],
      explanation: 'Einrollen schützt die Weichteile; Chinone u. a. schrecken Feinde ab.',
      wissen:
        'Viele Doppelfüßer rollen sich bei Störung ein. Zusätzlich können sie übel riechende oder reizende Sekrete abgeben. Hundertfüßer setzen eher auf Flucht und Giftbiss.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k6:tausendfuesser:paar-doppelfuesser',
      term: 'Doppelfüßer',
      meaning: 'Meist zwei Beinpaare je Ring, oft Detritusfresser',
      wissen: 'Schnurfüßer sind typische Doppelfüßer mit zylindrischem Körper und vielen Beinen.',
    },
    {
      concept: 'bio:k6:tausendfuesser:paar-hundertfuesser',
      term: 'Hundertfüßer',
      meaning: 'Ein Beinpaar je Segment, räuberisch',
      wissen: 'Hundertfüßer jagen mit Giftklauen und bewegen sich oft schnell in der Streu.',
    },
    {
      concept: 'bio:k6:tausendfuesser:paar-forcipulen',
      term: 'Giftklauen',
      meaning: 'Umbildetes erstes Beinpaar der Hundertfüßer',
      wissen: 'Forcipulen ergreifen und lähmen Beute — wichtiges Merkmal der Chilopoden.',
    },
    {
      concept: 'bio:k6:tausendfuesser:paar-schnurfueszer',
      term: 'Schnurfüßer',
      meaning: 'Wurmförmige Doppelfüßer im Boden',
      wissen: 'Schnurfüßer graben sich durch Streu und fressen abgestorbene Pflanzenteile.',
    },
    {
      concept: 'bio:k6:tausendfuesser:paar-segment',
      term: 'Körperring',
      meaning: 'Segment mit Beinansatz',
      wissen: 'Die vielen gleichartigen Segmente prägen den langgestreckten Körper der Myriapoden.',
    },
    {
      concept: 'bio:k6:tausendfuesser:paar-detritus',
      term: 'Detritus',
      meaning: 'Abgestorbenes organisches Material als Nahrung',
      wissen: 'Viele Doppelfüßer zersetzen Detritus und fördern so den Stoffkreislauf im Boden.',
    },
    {
      concept: 'bio:k6:tausendfuesser:paar-glieder',
      term: 'Gliederfüßer',
      meaning: 'Chitinpanzer und gegliederte Beine',
      wissen: 'Tausendfüßer gehören wie Insekten und Krebse zu den Gliederfüßern.',
    },
    {
      concept: 'bio:k6:tausendfuesser:paar-feucht',
      term: 'Feuchtigkeit',
      meaning: 'Wichtig für das Überleben an Land',
      wissen: 'Ohne Feuchtigkeit trocknen Tausendfüßer leicht aus — deshalb Streu und Verstecke.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:tausendfuesser:tf-insekt',
      statement: 'Tausendfüßer sind Insekten mit genau sechs Beinen.',
      correct: false,
      explanation: 'Sie haben viele Beinpaare und gehören zu den Myriapoden.',
      wissen:
        'Tausendfüßer sind eigene Gliederfüßer-Gruppen mit zahlreichen Beinen. Insekten haben typisch drei Beinpaare — das reicht zur Abgrenzung.',
    },
    {
      concept: 'bio:k6:tausendfuesser:tf-raeuber',
      statement: 'Hundertfüßer sind überwiegend Räuber.',
      correct: true,
      explanation: 'Sie jagen mit Giftklauen andere Wirbellose.',
      wissen:
        'Hundertfüßer ernähren sich räuberisch. Mit den Giftklauen lähmen sie Beute wie Insektenlarven oder Würmer.',
    },
    {
      concept: 'bio:k6:tausendfuesser:tf-zwei',
      statement: 'Schnurfüßer haben meist zwei Beinpaare je Körperring.',
      correct: true,
      explanation: 'Das ist das Kennzeichen der Doppelfüßer.',
      wissen:
        'Bei Doppelfüßern tragen die meisten Rumpfsegmente zwei Beinpaare. Hundertfüßer haben dagegen nur ein Beinpaar je Segment.',
    },
    {
      concept: 'bio:k6:tausendfuesser:tf-meer',
      statement: 'Tausendfüßer leben ausschließlich im offenen Meer.',
      correct: false,
      explanation: 'Sie sind typische Landbewohner feuchter Böden.',
      wissen:
        'Tausendfüßer besiedeln vor allem feuchte Lebensräume an Land. Offenes Meer ist nicht ihr typischer Lebensraum.',
    },
  ],
  multis: [
    {
      concept: 'bio:k6:tausendfuesser:multi',
      question: 'Welche Aussagen zu Tausendfüßern stimmen?',
      correct: ['Sie sind Gliederfüßer', 'Hundertfüßer jagen oft mit Giftklauen'],
      wrong: ['Sie haben immer Flügel', 'Sie besitzen eine Wirbelsäule'],
      explanation: 'Myriapoden: Gliederfüßer; Chilopoden räuberisch.',
      wissen:
        'Tausendfüßer sind wirbellose Gliederfüßer. Hundertfüßer jagen mit Giftklauen; Flügel und Wirbelsäule gehören nicht zu ihrem Bauplan.',
    },
  ],
}

export const weichtiereOverview: BioBank = {
  quelle: 'Wikipedia: Weichtiere',
  url: 'https://de.wikipedia.org/wiki/Weichtiere',
  conceptPrefix: 'bio:k6:weichtiere',
  facts: [
    {
      concept: 'bio:k6:weichtiere:gruppe',
      prompt: 'Was kennzeichnet Weichtiere als Gruppe grob?',
      answer: 'Weicher Körper, oft mit Mantel und Kalkgehäuse/Schale',
      wrong: ['Chitinpanzer mit sechs Beinen', 'Innere Wirbelsäule', 'Nur Federn und Flügel'],
      explanation: 'Mollusken: Fuß, Mantel, Eingeweidesack — viele mit Schale.',
      wissen:
        'Weichtiere (Mollusca) haben einen weichen Körper ohne Wirbelsäule. Typisch sind Fuß, Mantel und Eingeweidesack; der Mantel bildet oft eine Kalkschale. Zu ihnen gehören Schnecken, Muscheln und Kopffüßer.',
    },
    {
      concept: 'bio:k6:weichtiere:gruppen',
      prompt: 'Welche Gruppen gehören zu den Weichtieren?',
      answer: 'Schnecken, Muscheln und Kopffüßer',
      wrong: ['Nur Insekten und Spinnen', 'Nur Fische und Vögel', 'Nur Bakterien und Viren'],
      explanation: 'Drei große Klassen im Unterricht: Gastropoda, Bivalvia, Cephalopoda.',
      wissen:
        'Im Überblick umfassen Weichtiere vor allem Schnecken, Muscheln und Kopffüßer (Tintenfische). Details zu Bau und Lebensweise liegen in den Spezialthemen.',
    },
    {
      concept: 'bio:k6:weichtiere:mantel',
      prompt: 'Welche Rolle hat der Mantel bei vielen Weichtieren?',
      answer: 'Hautfalte, die oft die Kalkschale bildet',
      wrong: ['Nur Flügelantrieb', 'Nur Knochenmark', 'Nur Federbildung'],
      explanation: 'Der Mantel umhüllt den Eingeweidesack und scheidet Kalk ab.',
      wissen:
        'Der Mantel ist eine Hautfalte über dem Eingeweidesack. Bei vielen Arten bildet er die äußere Kalkschale und begrenzt die Mantelhöhle mit Atmungsorganen.',
      gap: 'Viele Weichtiere bilden mit dem ___ eine Kalkschale.',
      gapAccepted: ['Mantel'],
    },
    {
      concept: 'bio:k6:weichtiere:wirbellos',
      prompt: 'Sind Weichtiere Wirbeltiere oder Wirbellose?',
      answer: 'Wirbellose — ohne Wirbelsäule',
      wrong: ['Wirbeltiere mit Knochen', 'Immer Pflanzen', 'Nur Einzeller'],
      explanation: 'Keine innere Wirbelsäule; oft äußere Schale statt Panzer.',
      wissen:
        'Weichtiere sind wirbellos. Statt einer Wirbelsäule schützen viele Arten ein Kalkgehäuse oder Schalenklappen — ein anderer Bauplan als bei Gliederfüßern.',
    },
    {
      concept: 'bio:k6:weichtiere:fuss',
      prompt: 'Wozu dient der muskulöse Fuß bei Weichtieren allgemein?',
      answer: 'Fortbewegung (Kriechen, Graben oder umgebildet zu Armen)',
      wrong: ['Photosynthese', 'Knochenbildung', 'Milchproduktion'],
      explanation: 'Der Fuß ist das Bewegungsorgan — je nach Gruppe abgewandelt.',
      wissen:
        'Der Weichtier-Fuß ist muskulös: bei Schnecken Kriechsohle, bei Muscheln oft Grabfuß, bei Kopffüßern zu Fangarmen umgebildet. So passt sich der Bauplan dem Lebensraum an.',
    },
    {
      concept: 'bio:k6:weichtiere:lebensraum',
      prompt: 'Wo leben Weichtiere?',
      answer: 'In Meer, Süßwasser und zum Teil an Land',
      wrong: ['Nur in der Luft als Vögel', 'Nur in trockenen Wüsten ohne Wasser', 'Nur im Erdinneren als Gestein'],
      explanation: 'Vielfältige Lebensräume — Kopffüßer nur Meer, Schnecken auch Land.',
      wissen:
        'Die meisten Weichtiere leben im Meer, viele Muscheln und Schnecken auch im Süßwasser. Nur Schnecken haben das Land in größerem Umfang besiedelt.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k6:weichtiere:paar-mantel',
      term: 'Mantel',
      meaning: 'Hautfalte, oft Schalenbildner',
      wissen: 'Der Mantel umgibt den Eingeweidesack und bildet bei vielen Arten die Kalkschale.',
    },
    {
      concept: 'bio:k6:weichtiere:paar-fuss',
      term: 'Fuß',
      meaning: 'Muskulöses Bewegungsorgan',
      wissen: 'Je nach Gruppe: Kriechfuß, Grabfuß oder Fangarme — immer Abwandlung des Fußes.',
    },
    {
      concept: 'bio:k6:weichtiere:paar-schale',
      term: 'Kalkschale',
      meaning: 'Äußerer Schutz vieler Weichtiere',
      wissen: 'Schneckengehäuse und Muschelklappen bestehen aus Kalk und schützen den Weichkörper.',
    },
    {
      concept: 'bio:k6:weichtiere:paar-schnecke',
      term: 'Schnecke',
      meaning: 'Weichtier mit Kriechfuß, oft Gehäuse',
      wissen: 'Schnecken sind Weichtiere — Details zu Fühlern und Radula im Spezialthema.',
    },
    {
      concept: 'bio:k6:weichtiere:paar-muschel',
      term: 'Muschel',
      meaning: 'Weichtier mit zwei Schalenklappen',
      wissen: 'Muscheln haben zwei Klappen — Filtrieren und Bau im Spezialthema.',
    },
    {
      concept: 'bio:k6:weichtiere:paar-kopffuesser',
      term: 'Kopffüßer',
      meaning: 'Tintenfische und Verwandte im Meer',
      wissen: 'Kopffüßer sind Weichtiere mit Fangarmen — Vertiefung im Spezialthema.',
    },
    {
      concept: 'bio:k6:weichtiere:paar-eingeweide',
      term: 'Eingeweidesack',
      meaning: 'Enthält innere Organe',
      wissen: 'Im Eingeweidesack liegen Verdauung, Herz und weitere Organe unter dem Mantel.',
    },
    {
      concept: 'bio:k6:weichtiere:paar-mollusca',
      term: 'Weichtier',
      meaning: 'Weicher Körper, oft mit Schale',
      wissen: 'Mollusken sind wirbellos und artenreich — von Landschnecke bis Tintenfisch.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:weichtiere:tf-wirbelsaeule',
      statement: 'Weichtiere besitzen eine Wirbelsäule.',
      correct: false,
      explanation: 'Weichtiere sind wirbellos.',
      wissen:
        'Weichtiere haben keine Wirbelsäule. Viele schützen sich mit einer Kalkschale, die der Mantel bildet — ein anderer Bauplan als bei Wirbeltieren.',
    },
    {
      concept: 'bio:k6:weichtiere:tf-gruppen',
      statement: 'Schnecken und Muscheln gehören zu den Weichtieren.',
      correct: true,
      explanation: 'Beide sind Mollusken-Klassen.',
      wissen:
        'Schnecken und Muscheln sind klassische Weichtiere. Zusammen mit den Kopffüßern bilden sie die im Unterricht zentralen Gruppen.',
    },
    {
      concept: 'bio:k6:weichtiere:tf-insekt',
      statement: 'Weichtiere sind Gliederfüßer mit Chitinpanzer.',
      correct: false,
      explanation: 'Weichtiere haben weichen Körper, oft Kalkschale — kein Chitinpanzer wie Arthropoden.',
      wissen:
        'Gliederfüßer tragen ein Chitin-Außenskelett. Weichtiere haben einen weichen Körper; Schutz kommt oft von Kalkgehäuse oder Schalen.',
    },
  ],
  multis: [
    {
      concept: 'bio:k6:weichtiere:multi',
      question: 'Welche Tiere sind Weichtiere?',
      correct: ['Weinbergschnecke', 'Miesmuschel'],
      wrong: ['Honigbiene', 'Forelle'],
      explanation: 'Schnecke und Muschel = Mollusken; Biene = Insekt; Forelle = Wirbeltier.',
      wissen:
        'Schnecken und Muscheln sind Weichtiere. Bienen sind Insekten, Forellen Wirbeltiere — andere Baupläne.',
    },
  ],
}

export const schnecken: BioBank = {
  quelle: 'Wikipedia: Schnecken',
  url: 'https://de.wikipedia.org/wiki/Schnecken',
  conceptPrefix: 'bio:k6:schnecken',
  facts: [
    {
      concept: 'bio:k6:schnecken:kriechfuss',
      prompt: 'Womit bewegen sich Schnecken fort?',
      answer: 'Mit dem muskulösen Kriechfuß',
      wrong: ['Mit Flügeln', 'Mit Scherenbeinen', 'Mit Ambulakralfüßchen'],
      explanation: 'Die Kriechsohle gleitet auf einem Schleimfilm.',
      wissen:
        'Schnecken kriechen auf dem muskulösen Fuß. Drüsen erzeugen Schleim, der die Reibung mindert und vor Verletzungen schützt. Viele Arten tragen ein spiraliges Gehäuse.',
      gap: 'Schnecken bewegen sich mit dem ___.',
      gapAccepted: ['Kriechfuß', 'Fuß', 'Kriechfuss'],
    },
    {
      concept: 'bio:k6:schnecken:radula',
      prompt: 'Wozu dient die Radula bei Schnecken?',
      answer: 'Als Raspelzunge zur Nahrungsaufnahme',
      wrong: ['Als Flügel', 'Als Wirbelsäule', 'Als Spinnenseide'],
      explanation: 'Chitinzähnchen raspeln Algen oder Pflanzenmaterial ab.',
      wissen:
        'Die Radula ist eine mit Zähnchen besetzte Raspelzunge. Schnecken raspeln damit Nahrung ab — z. B. Algen von Steinen. Muscheln besitzen keine Radula.',
    },
    {
      concept: 'bio:k6:schnecken:gehaeuse',
      prompt: 'Welche Funktion hat das Gehäuse vieler Schnecken?',
      answer: 'Schutz vor Feinden und Austrocknung',
      wrong: ['Photosynthese', 'Knochenmarkspeicher', 'Flugantrieb'],
      explanation: 'Das Kalkgehäuse wird vom Mantel gebildet.',
      wissen:
        'Viele Schnecken tragen ein spiraliges Kalkgehäuse, das der Mantel absondert. Bei Gefahr ziehen sie sich hinein; es schützt auch vor Austrocknung. Nacktschnecken haben das Gehäuse weitgehend reduziert.',
    },
    {
      concept: 'bio:k6:schnecken:fuehler',
      prompt: 'Wozu dienen die Fühler der Weinbergschnecke?',
      answer: 'Tasten und Sehen (Augen an den hinteren Fühlern)',
      wrong: ['Atmen unter Wasser mit Kiemen ausschließlich', 'Milch erzeugen', 'Federn bilden'],
      explanation: 'Zwei Fühlerpaare: vordere zum Tasten, hintere mit Augen.',
      wissen:
        'Landschnecken wie die Weinbergschnecke haben zwei Fühlerpaare. An den längeren hinteren Fühlern sitzen die Augen. So nehmen sie Licht und Berührung wahr.',
    },
    {
      concept: 'bio:k6:schnecken:atmung',
      prompt: 'Womit atmen viele Landschnecken?',
      answer: 'Über eine lungenähnliche Atemhöhle im Mantel',
      wrong: ['Nur über Tracheen wie Insekten', 'Nur über Kiemen wie alle Fische', 'Durch Fotosynthese'],
      explanation: 'Atemloch am Mantelrand führt in die Mantelhöhle.',
      wissen:
        'Viele Landschnecken atmen über eine stark durchblutete Atemhöhle im Mantel (Lungenatmung). Zusätzlich kann Hautatmung eine Rolle spielen — die Haut muss feucht bleiben.',
    },
    {
      concept: 'bio:k6:schnecken:lebensraum',
      prompt: 'Wo kommen Schnecken vor?',
      answer: 'Im Meer, Süßwasser und an Land',
      wrong: ['Nur im antarktischen Eis ohne Ausnahme', 'Nur als freifliegende Insekten', 'Nur in Knochenmark'],
      explanation: 'Als einzige Weichtiergruppe haben sie das Land breit besiedelt.',
      wissen:
        'Schnecken leben im Meer, im Süßwasser und an Land. Landarten brauchen feuchte Lebensräume; Wasserschnecken atmen oft mit Kiemen oder angepassten Atemhöhlen.',
    },
    {
      concept: 'bio:k6:schnecken:weichtier',
      prompt: 'Zu welcher großen Gruppe gehören Schnecken?',
      answer: 'Weichtiere (Mollusken)',
      wrong: ['Insekten', 'Krebstiere', 'Stachelhäuter'],
      explanation: 'Gastropoda = Schnecken innerhalb der Mollusca.',
      wissen:
        'Schnecken sind Weichtiere mit Kopf, Kriechfuß und oft Gehäuse. Sie unterscheiden sich klar von Gliederfüßern mit Chitinpanzer.',
    },
    {
      concept: 'bio:k6:schnecken:schleim',
      prompt: 'Welche Rolle spielt Schleim bei Landschnecken?',
      answer: 'Gleiten und Schutz der Kriechsohle',
      wrong: ['Bildung von Federn', 'Ersatz der DNA', 'Photosynthese'],
      explanation: 'Schleim verringert Reibung und schützt vor Verletzung.',
      wissen:
        'Schleimdrüsen am Fuß erzeugen einen Film, auf dem die Schnecke gleitet. Der Schleim schützt die Kriechsohle und kann Spuren hinterlassen.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k6:schnecken:paar-radula',
      term: 'Radula',
      meaning: 'Raspelzunge mit Chitinzähnchen',
      wissen: 'Mit der Radula raspeln Schnecken Nahrung ab — ein typisches Weichtier-Organ.',
    },
    {
      concept: 'bio:k6:schnecken:paar-kriech',
      term: 'Kriechfuß',
      meaning: 'Muskulöse Sohle zur Fortbewegung',
      wissen: 'Auf dem Kriechfuß gleitet die Schnecke langsam über den Untergrund.',
    },
    {
      concept: 'bio:k6:schnecken:paar-gehaeuse',
      term: 'Gehäuse',
      meaning: 'Spiraliges Kalkgehäuse vieler Arten',
      wissen: 'Das Gehäuse schützt vor Feinden und Austrocknung und wird vom Mantel gebildet.',
    },
    {
      concept: 'bio:k6:schnecken:paar-fuehler',
      term: 'Fühler',
      meaning: 'Tast- und Sehorgane am Kopf',
      wissen: 'Bei Landschnecken tragen die hinteren Fühler oft die Augen.',
    },
    {
      concept: 'bio:k6:schnecken:paar-mantel',
      term: 'Mantel',
      meaning: 'Bildet Gehäuse und Atemhöhle',
      wissen: 'Der Mantel sondert Kalk ab und umschließt die Atemhöhle vieler Landschnecken.',
    },
    {
      concept: 'bio:k6:schnecken:paar-nackt',
      term: 'Nacktschnecke',
      meaning: 'Schnecke mit stark reduziertem Gehäuse',
      wissen: 'Nacktschnecken haben kein äußeres Gehäuse mehr — der Weichkörper bleibt ungeschützt sichtbar.',
    },
    {
      concept: 'bio:k6:schnecken:paar-weinberg',
      term: 'Weinbergschnecke',
      meaning: 'Große Landschnecke mit Gehäuse',
      wissen: 'Die Weinbergschnecke ist ein bekanntes Beispiel für gehäusetragende Landschnecken.',
    },
    {
      concept: 'bio:k6:schnecken:paar-schleim',
      term: 'Schleim',
      meaning: 'Gleiten und Schutz auf dem Fuß',
      wissen: 'Schleim ermöglicht gleitendes Kriechen und schützt die empfindliche Sohle.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:schnecken:tf-radula',
      statement: 'Viele Schnecken besitzen eine Radula zur Nahrungsaufnahme.',
      correct: true,
      explanation: 'Die Raspelzunge ist typisch für Schnecken.',
      wissen:
        'Die Radula raspelt Nahrung ab. Muscheln fehlen Radula und ausgeprägter Kopf — sie filtrieren.',
    },
    {
      concept: 'bio:k6:schnecken:tf-bein',
      statement: 'Schnecken haben typischerweise sechs gegliederte Beine wie Insekten.',
      correct: false,
      explanation: 'Sie kriechen auf einem Fuß, ohne Insektenbeine.',
      wissen:
        'Schnecken bewegen sich mit dem Kriechfuß. Gegliederte Beinpaare wie bei Insekten fehlen.',
    },
    {
      concept: 'bio:k6:schnecken:tf-land',
      statement: 'Schnecken kommen auch an Land vor.',
      correct: true,
      explanation: 'Landschnecken sind weit verbreitet.',
      wissen:
        'Im Gegensatz zu Kopffüßern und den meisten Muscheln haben Schnecken das Land besiedelt — oft in feuchten Lebensräumen.',
    },
    {
      concept: 'bio:k6:schnecken:tf-wirbeltier',
      statement: 'Schnecken sind Wirbeltiere.',
      correct: false,
      explanation: 'Sie sind wirbellose Weichtiere.',
      wissen:
        'Schnecken gehören zu den Weichtieren und haben keine Wirbelsäule.',
    },
  ],
  icons: [
    {
      concept: 'bio:k6:schnecken:icon',
      question: 'Welches Lebewesen kriecht typischerweise auf einem Schleimfuß und trägt oft ein Kalkgehäuse?',
      prompt: 'Schnecken',
      options: [
        { id: 'schnecke', label: 'Weinbergschnecke', icon: '🐌' },
        { id: 'biene', label: 'Honigbiene', icon: '🐝' },
        { id: 'krebs', label: 'Flusskrebs', icon: '🦞' },
        { id: 'seestern', label: 'Seestern', icon: '⭐' },
      ],
      correctId: 'schnecke',
      explanation: 'Schnecken: Kriechfuß und oft Gehäuse.',
      wissen:
        'Weinbergschnecken sind Weichtiere mit Kriechfuß und Kalkgehäuse. Bienen und Krebse sind Gliederfüßer; Seesterne Stachelhäuter.',
    },
  ],
}

export const muscheln: BioBank = {
  quelle: 'Wikipedia: Muscheln',
  url: 'https://de.wikipedia.org/wiki/Muscheln',
  conceptPrefix: 'bio:k6:muscheln',
  facts: [
    {
      concept: 'bio:k6:muscheln:zwei-klappen',
      prompt: 'Woran erkennst du Muscheln äußerlich typischerweise?',
      answer: 'Zwei Schalenklappen aus Kalk',
      wrong: ['Sechs Beine und Flügel', 'Ein spiraliges Gehäuse wie bei allen Schnecken', 'Federkleid'],
      explanation: 'Bivalvia: zwei Klappen, durch Schloss und Band verbunden.',
      wissen:
        'Muscheln besitzen zwei Kalkschalenklappen. Die Klappen werden von Muskeln geschlossen und durch ein elastisches Band geöffnet. Ein ausgeprägter Kopf fehlt.',
      gap: 'Muscheln haben typischerweise ___ Schalenklappen.',
      gapAccepted: ['zwei', '2', 'Zwei'],
    },
    {
      concept: 'bio:k6:muscheln:filter',
      prompt: 'Wie ernähren sich viele Muscheln?',
      answer: 'Als Filtrierer — Nahrungspartikel aus dem Wasser',
      wrong: ['Mit Radula wie Schnecken', 'Nur durch Jagd mit Giftklauen', 'Durch Fotosynthese allein'],
      explanation: 'Kiemen dienen oft Atmung und Filterung zugleich.',
      wissen:
        'Viele Muscheln filtrieren Kleinorganismen und Partikel aus dem Wasser. Die Kiemen transportieren Nahrung zum Mund — eine Radula fehlt.',
    },
    {
      concept: 'bio:k6:muscheln:kein-kopf',
      prompt: 'Welches Merkmal fehlt Muscheln im Vergleich zu Schnecken typischerweise?',
      answer: 'Ein ausgeprägter Kopf mit Radula',
      wrong: ['Jede Form von Schale', 'Jeder Weichkörper', 'Jede Verbindung zum Wasser'],
      explanation: 'Muscheln haben keinen Kopf; Sinnesorgane oft am Mantelrand.',
      wissen:
        'Im Gegensatz zu Schnecken fehlt Muscheln ein deutlicher Kopf und die Radula. Der Fuß dient oft dem Graben oder der Verankerung.',
    },
    {
      concept: 'bio:k6:muscheln:fuss',
      prompt: 'Wozu dient der Fuß vieler Muscheln?',
      answer: 'Graben im Sediment oder Festhalten',
      wrong: ['Fliegen', 'Spinnennetze bauen', 'Milch geben'],
      explanation: 'Grabfuß oder Byssusfäden bei manchen Arten.',
      wissen:
        'Viele Muscheln graben sich mit dem muskulösen Fuß in Sand oder Schlamm. Manche heften sich mit Byssusfäden an Steinen fest (z. B. Miesmuscheln).',
    },
    {
      concept: 'bio:k6:muscheln:lebensraum',
      prompt: 'Wo leben Muscheln vor allem?',
      answer: 'Im Meer und im Süßwasser',
      wrong: ['Nur an trockener Luft wie Landschnecken', 'Nur in Baumkronen', 'Nur in der Atmosphäre'],
      explanation: 'Kein Landleben wie bei Schnecken; Wasser ist nötig.',
      wissen:
        'Muscheln leben im Meer und im Süßwasser. Anders als Schnecken haben sie das Land nicht besiedelt — Filtrieren und Kiemen brauchen Wasser.',
    },
    {
      concept: 'bio:k6:muscheln:kiemen',
      prompt: 'Welche doppelte Aufgabe haben die Kiemen vieler Muscheln?',
      answer: 'Atmung und Nahrungfilterung',
      wrong: ['Nur Federbildung', 'Nur Knochenwachstum', 'Nur Spinnenseide'],
      explanation: 'Wasserstrom bringt Sauerstoff und Nahrungspartikel.',
      wissen:
        'Über die Kiemen nehmen Muscheln Sauerstoff auf und filtrieren zugleich Nahrung. Wimpern erzeugen einen Wasserstrom durch die Mantelhöhle.',
    },
    {
      concept: 'bio:k6:muscheln:weichtier',
      prompt: 'Zu welcher Gruppe gehören Muscheln?',
      answer: 'Weichtiere',
      wrong: ['Insekten', 'Krebstiere', 'Nesseltiere'],
      explanation: 'Bivalvia innerhalb der Mollusca.',
      wissen:
        'Muscheln sind Weichtiere mit zwei Schalen. Sie teilen Mantel und Fuß mit anderen Mollusken, weichen aber im fehlenden Kopf stark ab.',
    },
    {
      concept: 'bio:k6:muscheln:schliessmuskel',
      prompt: 'Wozu dienen die Schließmuskeln der Muschel?',
      answer: 'Die beiden Klappen fest zusammenpressen',
      wrong: ['Flügel schlagen', 'Gift injizieren', 'Jahresringe im Holz bilden'],
      explanation: 'Starke Muskeln halten die Schale geschlossen gegen Feinde.',
      wissen:
        'Schließmuskeln ziehen die Klappen zusammen. So schützt sich die Muschel vor Austrocknung (bei Gezeiten) und vor Fressfeinden.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k6:muscheln:paar-klappen',
      term: 'Schalenklappen',
      meaning: 'Zwei Kalkschalen zum Schutz',
      wissen: 'Die beiden Klappen umschließen den Weichkörper und können fest geschlossen werden.',
    },
    {
      concept: 'bio:k6:muscheln:paar-filter',
      term: 'Filtrierer',
      meaning: 'Nahrung aus dem Wasserstrom',
      wissen: 'Viele Muscheln filtrieren Plankton und Partikel — wichtige Ökosystemleistung.',
    },
    {
      concept: 'bio:k6:muscheln:paar-kieme',
      term: 'Kieme',
      meaning: 'Atmung und oft Filterung',
      wissen: 'Bei Muscheln dienen Kiemen häufig doppelt: Gaswechsel und Nahrungsfang.',
    },
    {
      concept: 'bio:k6:muscheln:paar-fuss',
      term: 'Grabfuß',
      meaning: 'Eingraben im Sediment',
      wissen: 'Der muskulöse Fuß gräbt die Muschel in Sand oder Schlamm ein.',
    },
    {
      concept: 'bio:k6:muscheln:paar-byssus',
      term: 'Byssusfäden',
      meaning: 'Haftfäden mancher Muscheln',
      wissen: 'Miesmuscheln heften sich mit Byssus an Steinen und Pfählen fest.',
    },
    {
      concept: 'bio:k6:muscheln:paar-mantel',
      term: 'Mantel',
      meaning: 'Bildet die Schalenklappen',
      wissen: 'Der Mantel scheidet die Kalkschalen ab und begrenzt die Mantelhöhle.',
    },
    {
      concept: 'bio:k6:muscheln:paar-mies',
      term: 'Miesmuschel',
      meaning: 'Bekannte Meeresmuschel mit Byssus',
      wissen: 'Miesmuscheln filtrieren im Meer und bilden oft dichte Bänke an Küsten.',
    },
    {
      concept: 'bio:k6:muscheln:paar-kein-kopf',
      term: 'Kein Kopf',
      meaning: 'Typisch für Muscheln im Vergleich zu Schnecken',
      wissen: 'Ohne ausgeprägten Kopf und ohne Radula — Ernährung über Filterung.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:muscheln:tf-radula',
      statement: 'Muscheln raspeln Nahrung typischerweise mit einer Radula ab.',
      correct: false,
      explanation: 'Muscheln filtrieren; die Radula fehlt.',
      wissen:
        'Anders als Schnecken besitzen Muscheln keine Radula. Sie filtrieren Nahrungspartikel aus dem Wasser über die Kiemen.',
    },
    {
      concept: 'bio:k6:muscheln:tf-klappen',
      statement: 'Muscheln haben typischerweise zwei Schalenklappen.',
      correct: true,
      explanation: 'Das namensgebende Merkmal der Bivalvia.',
      wissen:
        'Zwei Klappen aus Kalk schützen den Weichkörper. Schnecken haben oft ein einzelnes spiraliges Gehäuse.',
    },
    {
      concept: 'bio:k6:muscheln:tf-land',
      statement: 'Muscheln leben typischerweise als Landtiere ohne Wasserbezug.',
      correct: false,
      explanation: 'Sie brauchen Wasser zum Filtrieren und Atmen.',
      wissen:
        'Muscheln sind Wasserbewohner (Meer oder Süßwasser). Dauerhaftes Landleben wie bei Schnecken gibt es bei ihnen nicht.',
    },
    {
      concept: 'bio:k6:muscheln:tf-weichtier',
      statement: 'Muscheln gehören zu den Weichtieren.',
      correct: true,
      explanation: 'Sie sind Mollusken.',
      wissen:
        'Muscheln sind Weichtiere mit Mantel und Fuß — trotz des stark abgewandelten Bauplans ohne Kopf.',
    },
  ],
  multis: [
    {
      concept: 'bio:k6:muscheln:multi',
      question: 'Welche Merkmale passen zu Muscheln?',
      correct: ['Zwei Schalenklappen', 'Oft Filtrierer'],
      wrong: ['Genau sechs Beine', 'Spiralgehäuse und Radula wie typische Schnecken'],
      explanation: 'Muscheln: zwei Klappen, Filterung — nicht Insektenbeine oder Schnecken-Radula.',
      wissen:
        'Muscheln haben zwei Klappen und filtrieren oft. Sechs Beine sind Insektenmerkmal; Radula und Spiralgehäuse typisch für viele Schnecken.',
    },
  ],
}

export const kopffuesser: BioBank = {
  quelle: 'Wikipedia: Kopffüßer',
  url: 'https://de.wikipedia.org/wiki/Kopff%C3%BC%C3%9Fer',
  conceptPrefix: 'bio:k6:kopffuesser',
  facts: [
    {
      concept: 'bio:k6:kopffuesser:arme',
      prompt: 'Was ist aus dem Fuß der Kopffüßer geworden?',
      answer: 'Fangarme / Tentakel am Kopf',
      wrong: ['Flügelpaare', 'Laufbeine mit Scheren wie beim Krebs', 'Ein spiraliges Landgehäuse'],
      explanation: 'Cephalopoda: Fuß zu Armen umgebildet — Name „Kopffüßer“.',
      wissen:
        'Bei Tintenfischen, Kalmaren und Kraken ist der Fuß zu Fangarmen mit Saugnäpfen umgebildet. Daher der Name Kopffüßer: Arme sitzen am Kopf.',
      gap: 'Bei Kopffüßern ist der Fuß zu ___ umgebildet.',
      gapAccepted: ['Fangarmen', 'Tentakeln', 'Armen', 'Fangarme'],
    },
    {
      concept: 'bio:k6:kopffuesser:rueckstoss',
      prompt: 'Wie schwimmen viele Tintenfische schnell?',
      answer: 'Durch Rückstoß — Wasser aus der Mantelhöhle pressen',
      wrong: ['Nur mit Flügeln wie Vögel', 'Nur kriechend auf Schleim', 'Nur mit Ambulakralfüßchen'],
      explanation: 'Wasserstrahl aus dem Trichter treibt sie an.',
      wissen:
        'Kopffüßer können Wasser aus der Mantelhöhle durch einen Trichter ausstoßen. Nach dem Rückstoßprinzip beschleunigen sie schnell — wichtig zur Flucht.',
    },
    {
      concept: 'bio:k6:kopffuesser:tinte',
      prompt: 'Wozu dient die Tinte vieler Tintenfische?',
      answer: 'Feinde verwirren und Flucht ermöglichen',
      wrong: ['Photosynthese', 'Knochenhärten', 'Milch für Junge'],
      explanation: 'Tintenwolke tarnt die Flucht.',
      wissen:
        'Viele Kopffüßer stoßen bei Gefahr eine Tintenwolke aus. Sie verdunkelt das Wasser und verwirrt Fressfeinde, während das Tier entkommt.',
    },
    {
      concept: 'bio:k6:kopffuesser:schale',
      prompt: 'Wie ist die Schale bei den meisten Tintenfischen abgewandelt?',
      answer: 'Zurückgebildet oder innen (z. B. Schulp)',
      wrong: ['Immer ein großes äußeres Spiralgehäuse wie bei allen Landschnecken', 'Immer zwei Muschelklappen', 'Immer ein Chitinpanzer mit Häutung'],
      explanation: 'Nautilus hat Außenschale; Sepia hat inneren Schulp.',
      wissen:
        'Bei den meisten heutigen Kopffüßern ist die Schale innen (Schulp) oder stark reduziert. Nur Nautilus trägt noch eine äußere Kammerschale. Kraken haben kaum noch Schalenreste.',
    },
    {
      concept: 'bio:k6:kopffuesser:augen',
      prompt: 'Was ist an den Augen vieler Tintenfische besonders?',
      answer: 'Hoch entwickelte Linsenaugen',
      wrong: ['Sie fehlen völlig bei allen Arten', 'Sie dienen nur der Fotosynthese', 'Sie sind immer gestielte Facettenaugen wie beim Krebs'],
      explanation: 'Kameraaugen ähneln funktional Wirbeltieraugen.',
      wissen:
        'Kopffüßer besitzen leistungsfähige Linsenaugen. Damit jagen sie aktiv im Meer — ein Zeichen für ihr hoch entwickeltes Nervensystem unter den Weichtieren.',
    },
    {
      concept: 'bio:k6:kopffuesser:meer',
      prompt: 'Wo leben Kopffüßer?',
      answer: 'Ausschließlich im Meer',
      wrong: ['Auch als Landschnecken in Gärten', 'Nur in Süßwasserpfützen', 'Nur in Baumkronen'],
      explanation: 'Keine Land- oder Süßwasser-Tintenfische.',
      wissen:
        'Alle Kopffüßer sind Meeresbewohner. Anders als Schnecken haben sie weder Land noch Süßwasser dauerhaft besiedelt.',
    },
    {
      concept: 'bio:k6:kopffuesser:weichtier',
      prompt: 'Zu welcher Gruppe gehören Tintenfische?',
      answer: 'Weichtiere (Kopffüßer)',
      wrong: ['Fische mit Wirbelsäule', 'Insekten', 'Stachelhäuter'],
      explanation: 'Trotz „Fisch“ im Namen: Mollusken.',
      wissen:
        'Tintenfische sind Weichtiere, keine Fische. Sie haben keinen Wirbelsäulen-Bauplan, sondern Mantel, Arme und oft innere Schalenreste.',
    },
    {
      concept: 'bio:k6:kopffuesser:tarnung',
      prompt: 'Wozu dient der schnelle Farbwechsel vieler Kopffüßer?',
      answer: 'Tarnung und Kommunikation',
      wrong: ['Knochenbildung', 'Photosynthese', 'Milchproduktion'],
      explanation: 'Farbzellen in der Haut werden nervös gesteuert.',
      wissen:
        'Chromatophoren in der Haut ermöglichen blitzschnellen Farbwechsel. So tarnen sich Tintenfische und signalisieren Artgenossen — eine beeindruckende Angepasstheit.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k6:kopffuesser:paar-arme',
      term: 'Fangarme',
      meaning: 'Umbildeter Fuß mit Saugnäpfen',
      wissen: 'Die Arme greifen Beute und sitzen am Kopf — deshalb „Kopffüßer“.',
    },
    {
      concept: 'bio:k6:kopffuesser:paar-tinte',
      term: 'Tinte',
      meaning: 'Abwehrwolke bei Gefahr',
      wissen: 'Die Tintenwolke tarnt die Flucht vor Fressfeinden im Meer.',
    },
    {
      concept: 'bio:k6:kopffuesser:paar-schulp',
      term: 'Schulp',
      meaning: 'Innere Schalenstütze mancher Tintenfische',
      wissen: 'Beim Sepia liegt der Schulp innen und stützt den Körper.',
    },
    {
      concept: 'bio:k6:kopffuesser:paar-trichter',
      term: 'Trichter',
      meaning: 'Öffnung für den Wasserstrahl beim Rückstoß',
      wissen: 'Durch den Trichter wird Wasser ausgestoßen — Antrieb nach Rückstoßprinzip.',
    },
    {
      concept: 'bio:k6:kopffuesser:paar-saug',
      term: 'Saugnäpfe',
      meaning: 'Haftorgane an den Armen',
      wissen: 'Saugnäpfe halten Beute fest und helfen beim Klettern und Greifen.',
    },
    {
      concept: 'bio:k6:kopffuesser:paar-krake',
      term: 'Krake',
      meaning: 'Kopffüßer mit acht Armen',
      wissen: 'Kraken haben acht Arme und leben als geschickte Jäger am Meeresboden.',
    },
    {
      concept: 'bio:k6:kopffuesser:paar-mantel',
      term: 'Mantelhöhle',
      meaning: 'Raum für Atmung und Rückstoßwasser',
      wissen: 'In der Mantelhöhle liegen Kiemen; ausgestoßenes Wasser treibt das Tier an.',
    },
    {
      concept: 'bio:k6:kopffuesser:paar-nerv',
      term: 'Nervensystem',
      meaning: 'Hoch entwickelt unter den Weichtieren',
      wissen: 'Großes Gehirn und leistungsfähige Augen ermöglichen aktives Jagen.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:kopffuesser:tf-fisch',
      statement: 'Tintenfische sind Fische mit Wirbelsäule.',
      correct: false,
      explanation: 'Sie sind Weichtiere.',
      wissen:
        'Trotz des Namens sind Tintenfische keine Fische. Sie gehören zu den Kopffüßern innerhalb der Weichtiere und haben keine Wirbelsäule.',
    },
    {
      concept: 'bio:k6:kopffuesser:tf-meer',
      statement: 'Kopffüßer leben ausschließlich im Meer.',
      correct: true,
      explanation: 'Keine Land- oder Süßwasserarten.',
      wissen:
        'Alle bekannten Kopffüßer sind Meeresbewohner — anders als Schnecken, die auch an Land vorkommen.',
    },
    {
      concept: 'bio:k6:kopffuesser:tf-arme',
      statement: 'Bei Kopffüßern ist der Fuß zu Fangarmen umgebildet.',
      correct: true,
      explanation: 'Das erklärt den Namen.',
      wissen:
        'Der Weichtier-Fuß wurde zu Armen mit Saugnäpfen. Deshalb sitzen die Fangorgane am Kopf.',
    },
    {
      concept: 'bio:k6:kopffuesser:tf-land',
      statement: 'Tintenfische leben typischerweise in Gärten wie Weinbergschnecken.',
      correct: false,
      explanation: 'Sie sind Meeresweichtiere.',
      wissen:
        'Tintenfische brauchen Meerwasser. Landleben wie bei Weinbergschnecken gibt es bei Kopffüßern nicht.',
    },
  ],
  icons: [
    {
      concept: 'bio:k6:kopffuesser:icon',
      question: 'Welches Lebewesen nutzt oft Rückstoßschwimmen und eine Tintenwolke zur Flucht?',
      prompt: 'Kopffüßer',
      options: [
        { id: 'tinte', label: 'Tintenfisch', icon: '🦑' },
        { id: 'schnecke', label: 'Weinbergschnecke', icon: '🐌' },
        { id: 'biene', label: 'Honigbiene', icon: '🐝' },
        { id: 'regenwurm', label: 'Regenwurm', icon: '🪱' },
      ],
      correctId: 'tinte',
      explanation: 'Kopffüßer: Rückstoß und Tinte.',
      wissen:
        'Tintenfische pressen Wasser aus der Mantelhöhle und können Tinte ausstoßen. Schnecken kriechen; Bienen fliegen; Regenwürmer graben.',
    },
  ],
}

export const ringelwuermer: BioBank = {
  quelle: 'Wikipedia: Ringelwürmer',
  url: 'https://de.wikipedia.org/wiki/Ringelw%C3%BCrmer',
  conceptPrefix: 'bio:k6:ringelwuermer',
  facts: [
    {
      concept: 'bio:k6:ringelwuermer:segmente',
      prompt: 'Was kennzeichnet Ringelwürmer äußerlich besonders?',
      answer: 'Ein in viele Segmente (Ringel) gegliederter Körper',
      wrong: ['Chitinpanzer mit sechs Beinen', 'Zwei Muschelklappen', 'Federkleid'],
      explanation: 'Metamerie: gleichartige Körperabschnitte hintereinander.',
      wissen:
        'Ringelwürmer (Annelida) haben einen segmentierten Körper. Die äußeren Ringel entsprechen inneren Abschnitten mit wiederkehrenden Organen. Beispiele: Regenwurm und Blutegel.',
      gap: 'Ringelwürmer haben einen in ___ gegliederten Körper.',
      gapAccepted: ['Segmente', 'Ringel', 'Körperringe'],
    },
    {
      concept: 'bio:k6:ringelwuermer:regenwurm',
      prompt: 'Welche ökologische Rolle hat der Regenwurm im Boden?',
      answer: 'Lockert den Boden und fördert Humusbildung',
      wrong: ['Baut Spinnennetze', 'Photosynthese in Blättern', 'Bildet Korallenriffe'],
      explanation: 'Graben, Durchmischen und Zersetzen organischen Materials.',
      wissen:
        'Regenwürmer fressen Boden und Pflanzenreste, lockern den Boden durch Gänge und tragen zur Humusbildung bei. Sie sind wichtige Bodenverbesserer.',
    },
    {
      concept: 'bio:k6:ringelwuermer:hautatmung',
      prompt: 'Womit atmet der Regenwurm?',
      answer: 'Über die feuchte Haut',
      wrong: ['Mit Tracheen wie Insekten', 'Mit Kiemen wie Flusskrebse ausschließlich', 'Mit Lungen wie Säuger'],
      explanation: 'Die Haut muss feucht bleiben — sonst erstickt er.',
      wissen:
        'Regenwürmer atmen über die Körperoberfläche. Sauerstoff diffundiert durch die feuchte Haut ins Blut. Bei Trockenheit ziehen sie sich tiefer in den Boden zurück.',
    },
    {
      concept: 'bio:k6:ringelwuermer:borsten',
      prompt: 'Wozu dienen die Borsten des Regenwurms?',
      answer: 'Halt beim Kriechen im Boden',
      wrong: ['Fliegen', 'Gift injizieren wie Hundertfüßer', 'Schalenklappen schließen'],
      explanation: 'Wenige Chitinborsten pro Segment verhaken sich im Substrat.',
      wissen:
        'Regenwürmer haben wenige Borsten je Segment. Sie verhindern das Zurückrutschen, wenn Ring- und Längsmuskeln den Körper vorwärts bewegen (Hautmuskelschlauch).',
    },
    {
      concept: 'bio:k6:ringelwuermer:blutegel',
      prompt: 'Was kennzeichnet Blutegel im Vergleich zum Regenwurm oft?',
      answer: 'Saugnäpfe und oft parasitische oder räuberische Ernährung',
      wrong: ['Sechs Beine und Flügel', 'Zwei Antennenpaare wie Krebse', 'Kalkgehäuse'],
      explanation: 'Egel: Saugnäpfe, keine Borsten, abgeflachter Körper.',
      wissen:
        'Blutegel gehören zu den Ringelwürmern. Viele haben vordere und hintere Saugnäpfe; Borsten fehlen. Manche saugen Blut, andere jagen kleine Tiere.',
    },
    {
      concept: 'bio:k6:ringelwuermer:clitellum',
      prompt: 'Wozu dient der Gürtel (Clitellum) bei Regenwürmern?',
      answer: 'Bildung des Schleimkokons bei der Fortpflanzung',
      wrong: ['Flügelantrieb', 'Photosynthese', 'Netzbau'],
      explanation: 'Drüsenreicher Ring bildet den Eikokon.',
      wissen:
        'Das Clitellum ist ein drüsenreicher Gürtel geschlechtsreifer Regenwürmer. Es erzeugt den Schleimkokon, in dem sich die Eier entwickeln.',
    },
    {
      concept: 'bio:k6:ringelwuermer:kein-bein',
      prompt: 'Haben Regenwürmer echte gegliederte Beine wie Gliederfüßer?',
      answer: 'Nein — Fortbewegung über Hautmuskelschlauch und Borsten',
      wrong: ['Ja, genau sechs Beinpaare', 'Ja, acht Beine wie Spinnen', 'Ja, fünf Scherenbeinpaare'],
      explanation: 'Keine Arthropoden-Beine.',
      wissen:
        'Regenwürmer sind keine Gliederfüßer. Sie bewegen sich mit Ring- und Längsmuskeln und Borsten fort — ohne gegliederte Beine.',
    },
    {
      concept: 'bio:k6:ringelwuermer:kreislauf',
      prompt: 'Welches Blutgefäßsystem hat der Regenwurm?',
      answer: 'Ein geschlossenes Blutgefäßsystem',
      wrong: ['Gar keines', 'Nur offene Hämolymphe wie alle Insekten ohne Ausnahme', 'Nur Luftsäcke'],
      explanation: 'Rücken- und Bauchgefäß mit ringförmigen Verbindungen.',
      wissen:
        'Ringelwürmer wie der Regenwurm haben ein geschlossenes Blutgefäßsystem. Das unterscheidet sie von vielen Gliederfüßern mit offenem Kreislauf.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k6:ringelwuermer:paar-segment',
      term: 'Segment',
      meaning: 'Körperring mit wiederkehrendem Bau',
      wissen: 'Die Segmentierung prägt den Ringelwurm äußerlich und innerlich.',
    },
    {
      concept: 'bio:k6:ringelwuermer:paar-borste',
      term: 'Borste',
      meaning: 'Halt beim Kriechen',
      wissen: 'Chitinborsten verhaken sich im Boden und stützen die Fortbewegung.',
    },
    {
      concept: 'bio:k6:ringelwuermer:paar-haut',
      term: 'Hautatmung',
      meaning: 'Gaswechsel über die feuchte Oberfläche',
      wissen: 'Ohne feuchte Haut kann der Regenwurm nicht atmen.',
    },
    {
      concept: 'bio:k6:ringelwuermer:paar-clitellum',
      term: 'Clitellum',
      meaning: 'Gürtel zur Kokonbildung',
      wissen: 'Der Gürtel erzeugt den Schleimkokon für die Eier.',
    },
    {
      concept: 'bio:k6:ringelwuermer:paar-egel',
      term: 'Blutegel',
      meaning: 'Ringelwurm mit Saugnäpfen',
      wissen: 'Egel haben Saugnäpfe und oft eine andere Ernährung als Regenwürmer.',
    },
    {
      concept: 'bio:k6:ringelwuermer:paar-humus',
      term: 'Humusbildung',
      meaning: 'Bodenverbesserung durch Regenwürmer',
      wissen: 'Durchmischen und Zersetzen fördern fruchtbaren Boden.',
    },
    {
      concept: 'bio:k6:ringelwuermer:paar-hautmuskel',
      term: 'Hautmuskelschlauch',
      meaning: 'Ring- und Längsmuskeln unter der Haut',
      wissen: 'Abwechselndes Verkürzen und Strecken bewegt den Wurm vorwärts.',
    },
    {
      concept: 'bio:k6:ringelwuermer:paar-annelida',
      term: 'Ringelwurm',
      meaning: 'Segmentierter Wurm ohne echte Beine',
      wissen: 'Anneliden sind wirbellos und deutlich beringt — z. B. Regenwurm und Egel.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:ringelwuermer:tf-bein',
      statement: 'Regenwürmer haben typischerweise sechs gegliederte Beine.',
      correct: false,
      explanation: 'Sie kriechen ohne Arthropoden-Beine.',
      wissen:
        'Regenwürmer bewegen sich mit Hautmuskelschlauch und Borsten. Gegliederte Beine wie bei Insekten fehlen.',
    },
    {
      concept: 'bio:k6:ringelwuermer:tf-boden',
      statement: 'Regenwürmer können den Boden lockern und die Humusbildung fördern.',
      correct: true,
      explanation: 'Wichtige ökologische Rolle.',
      wissen:
        'Durch Gänge und Zersetzen organischen Materials verbessern Regenwürmer Bodenstruktur und Fruchtbarkeit.',
    },
    {
      concept: 'bio:k6:ringelwuermer:tf-egel',
      statement: 'Blutegel gehören zu den Ringelwürmern.',
      correct: true,
      explanation: 'Egel sind Anneliden.',
      wissen:
        'Blutegel sind ringelwurmartige Tiere mit Saugnäpfen. Sie teilen die Segmentierung mit dem Regenwurm, unterscheiden sich aber im Detailbau.',
    },
    {
      concept: 'bio:k6:ringelwuermer:tf-trocken',
      statement: 'Regenwürmer atmen am besten auf völlig trockener, rissiger Haut.',
      correct: false,
      explanation: 'Die Haut muss feucht sein.',
      wissen:
        'Hautatmung funktioniert nur bei feuchter Oberfläche. Trockene Haut verhindert den Gaswechsel.',
    },
  ],
  sorts: [
    {
      concept: 'bio:k6:ringelwuermer:sort-bewegung',
      question: 'Ordne den vereinfachten Ablauf der Regenwurm-Fortbewegung.',
      labels: ['Ringmuskeln verkürzen (dünn/lang)', 'Vorderende vorschieben', 'Borsten verankern', 'Längsmuskeln nachziehen'],
      explanation: 'Peristaltik mit Borstenhalt.',
      wissen:
        'Zuerst wird ein Abschnitt dünn und lang vorgeschoben, Borsten halten, dann ziehen Längsmuskeln den Rest nach.',
    },
  ],
  icons: [
    {
      concept: 'bio:k6:ringelwuermer:icon',
      question: 'Welches Lebewesen lockert den Boden mit segmentiertem Körper ohne echte Beine?',
      prompt: 'Ringelwürmer',
      options: [
        { id: 'wurm', label: 'Regenwurm', icon: '🪱' },
        { id: 'biene', label: 'Honigbiene', icon: '🐝' },
        { id: 'spinne', label: 'Kreuzspinne', icon: '🕷️' },
        { id: 'muschel', label: 'Miesmuschel', icon: '🐚' },
      ],
      correctId: 'wurm',
      explanation: 'Regenwurm = Ringelwurm im Boden.',
      wissen:
        'Regenwürmer sind segmentierte Ringelwürmer und wichtige Bodenlocker. Bienen und Spinnen sind Gliederfüßer; Muscheln Weichtiere.',
    },
  ],
}

export const stachelhaeuter: BioBank = {
  quelle: 'Wikipedia: Stachelhäuter',
  url: 'https://de.wikipedia.org/wiki/Stachelh%C3%A4uter',
  conceptPrefix: 'bio:k6:stachelhaeuter',
  facts: [
    {
      concept: 'bio:k6:stachelhaeuter:meer',
      prompt: 'Wo leben Stachelhäuter?',
      answer: 'Ausschließlich im Meer',
      wrong: ['Auch in Gärten als Landschnecken', 'Nur in Süßwasserpfützen', 'Nur in der Luft'],
      explanation: 'Echinodermen sind rein marin.',
      wissen:
        'Stachelhäuter wie Seesterne und Seeigel leben nur im Meer. Süßwasser- oder Landformen gibt es nicht — ihr Wassergefäßsystem hängt mit dem Meerwasser zusammen.',
    },
    {
      concept: 'bio:k6:stachelhaeuter:symmetrie',
      prompt: 'Welche Körpersymmetrie zeigen erwachsene Seesterne typischerweise?',
      answer: 'Fünfstrahlig (pentaradial)',
      wrong: ['Nur zweiseitig wie alle Insekten ohne Ausnahme', 'Würfelform ohne Arme', 'Spiralgehäuse wie Schnecken'],
      explanation: 'Fünf Arme bzw. fünf Radiärachsen.',
      wissen:
        'Erwachsene Stachelhäuter sind oft fünfstrahlig gebaut. Seesterne haben typisch fünf Arme; Seeigel zeigen fünf Ambulakralfelder. Larven sind dagegen zweiseitig symmetrisch.',
      gap: 'Erwachsene Seesterne sind oft ___ symmetrisch.',
      gapAccepted: ['fünfstrahlig', 'pentaradial', 'radiär', 'radiärsymmetrisch'],
    },
    {
      concept: 'bio:k6:stachelhaeuter:innenskelett',
      prompt: 'Welches Skelett haben Stachelhäuter?',
      answer: 'Kalkiges Innenskelett unter der Haut',
      wrong: ['Nur Chitinpanzer außen wie Insekten', 'Nur Wirbelsäule wie Säuger', 'Gar kein Skelett'],
      explanation: 'Mesodermale Kalkplatten — innen, anders als Muschelschalen.',
      wissen:
        'Stachelhäuter besitzen ein Innenskelett aus Kalkplatten unter der Epidermis. Bei Seeigeln sind die Platten fest zum Gehäuse verbunden; bei Seesternen beweglicher.',
    },
    {
      concept: 'bio:k6:stachelhaeuter:ambulakral',
      prompt: 'Wozu dient das Ambulakralsystem?',
      answer: 'Wassergefülltes Röhrensystem für Fortbewegung (Saugfüßchen)',
      wrong: ['Photosynthese', 'Milchproduktion', 'Spinnenseide'],
      explanation: 'Flüssigkeitdruck streckt die Ambulakralfüßchen.',
      wissen:
        'Das Ambulakralsystem ist ein flüssigkeitsgefülltes Kanalsystem mit Saugfüßchen. Durch Druckänderungen strecken und ziehen sich die Füßchen — Fortbewegung, Haftung und teils Atmung.',
    },
    {
      concept: 'bio:k6:stachelhaeuter:seestern',
      prompt: 'Womit bewegen sich Seesterne vorwärts?',
      answer: 'Mit Ambulakralfüßchen (Saugfüßchen)',
      wrong: ['Mit Flügeln', 'Mit Scherenbeinen', 'Mit Kriechschleim wie Landschnecken'],
      explanation: 'Hunderte Saugfüßchen an der Unterseite der Arme.',
      wissen:
        'An der Unterseite der Seesternarme liegen Reihen von Saugfüßchen. Sie halten am Untergrund und erzeugen langsame, koordinierte Bewegung.',
    },
    {
      concept: 'bio:k6:stachelhaeuter:seeigel',
      prompt: 'Wozu dienen die Stacheln der Seeigel vor allem?',
      answer: 'Schutz und teils Fortbewegung / Nahrungssuche',
      wrong: ['Fliegen', 'Netzbau', 'Photosynthese'],
      explanation: 'Bewegliche Stacheln und Pedicellarien schützen den Körper.',
      wissen:
        'Seeigel tragen bewegliche Stacheln auf dem Kalkgehäuse. Sie schützen vor Feinden und helfen manchen Arten bei der Fortbewegung. Zusätzlich raspeln Zähne Algen ab.',
    },
    {
      concept: 'bio:k6:stachelhaeuter:kein-arthropode',
      prompt: 'Sind Seesterne Gliederfüßer?',
      answer: 'Nein — sie gehören zu den Stachelhäutern',
      wrong: ['Ja, sie haben Chitinpanzer und Antennen', 'Ja, sie sind Insekten', 'Ja, sie sind Krebstiere'],
      explanation: 'Anderer Stamm: Echinodermata, nicht Arthropoda.',
      wissen:
        'Seesterne haben kein Chitin-Außenskelett und keine gegliederten Beine. Ihr kalkiges Innenskelett und Ambulakralsystem kennzeichnen die Stachelhäuter.',
    },
    {
      concept: 'bio:k6:stachelhaeuter:madrepor',
      prompt: 'Welche Rolle hat die Siebplatte (Madreporenplatte) grob?',
      answer: 'Verbindung des Ambulakralsystems mit dem Meerwasser',
      wrong: ['Photosynthese', 'Eierlegen an Land', 'Flugsteuerung'],
      explanation: 'Über den Steinkanal steht das System mit dem Meer in Verbindung.',
      wissen:
        'Die Madreporenplatte ist eine siebartige Öffnung. Über sie steht das Ambulakralsystem mit dem umgebenden Meerwasser in Verbindung und reguliert den Flüssigkeitsaustausch.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k6:stachelhaeuter:paar-ambulakral',
      term: 'Ambulakralsystem',
      meaning: 'Wassergefäßsystem mit Saugfüßchen',
      wissen: 'Flüssigkeitsdruck bewegt die Füßchen — typisch nur für Stachelhäuter.',
    },
    {
      concept: 'bio:k6:stachelhaeuter:paar-saug',
      term: 'Saugfüßchen',
      meaning: 'Fortbewegung und Haftung',
      wissen: 'Ambulakralfüßchen halten am Untergrund und bewegen Seestern und Seeigel.',
    },
    {
      concept: 'bio:k6:stachelhaeuter:paar-kalk',
      term: 'Kalk-Innenskelett',
      meaning: 'Platten unter der Haut',
      wissen: 'Anders als äußere Mollusken-Schalen liegt das Skelett unter der Epidermis.',
    },
    {
      concept: 'bio:k6:stachelhaeuter:paar-seestern',
      term: 'Seestern',
      meaning: 'Fünfarmiger Stachelhäuter',
      wissen: 'Seesterne bewegen sich mit Saugfüßchen und leben räuberisch oder als Allesfresser.',
    },
    {
      concept: 'bio:k6:stachelhaeuter:paar-seeigel',
      term: 'Seeigel',
      meaning: 'Stacheliger Stachelhäuter mit Gehäuse',
      wissen: 'Seeigel haben fest verbundene Kalkplatten und bewegliche Stacheln.',
    },
    {
      concept: 'bio:k6:stachelhaeuter:paar-pentamer',
      term: 'Fünfstrahligkeit',
      meaning: 'Körperbau mit fünf Radiärachsen',
      wissen: 'Erwachsene Formen zeigen oft fünf Arme oder fünf Ambulakralfelder.',
    },
    {
      concept: 'bio:k6:stachelhaeuter:paar-stachel',
      term: 'Stacheln',
      meaning: 'Schutz am Kalkskelett',
      wissen: 'Besonders bei Seeigeln schützen Stacheln vor Feinden.',
    },
    {
      concept: 'bio:k6:stachelhaeuter:paar-meer',
      term: 'Meer',
      meaning: 'Einziger Lebensraum der Stachelhäuter',
      wissen: 'Ohne Meerwasser funktioniert ihr Bauplan mit Ambulakralsystem nicht dauerhaft.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:stachelhaeuter:tf-land',
      statement: 'Seesterne leben typischerweise in Gärten an Land.',
      correct: false,
      explanation: 'Stachelhäuter sind Meeresbewohner.',
      wissen:
        'Seesterne brauchen Meerwasser und Ambulakralsystem. Landleben wie bei Schnecken gibt es nicht.',
    },
    {
      concept: 'bio:k6:stachelhaeuter:tf-fuesschen',
      statement: 'Seesterne bewegen sich mit Ambulakralfüßchen.',
      correct: true,
      explanation: 'Saugfüßchen an den Armen.',
      wissen:
        'Das Wassergefäßsystem steuert die Saugfüßchen. Damit krabbeln Seesterne langsam über den Meeresboden.',
    },
    {
      concept: 'bio:k6:stachelhaeuter:tf-chitin',
      statement: 'Stachelhäuter haben ein äußeres Chitinpanzer-Skelett wie Insekten.',
      correct: false,
      explanation: 'Sie haben ein kalkiges Innenskelett.',
      wissen:
        'Stachelhäuter besitzen Kalkplatten unter der Haut. Chitin-Außenskelette sind typisch für Gliederfüßer.',
    },
    {
      concept: 'bio:k6:stachelhaeuter:tf-fuenf',
      statement: 'Erwachsene Seesterne sind oft fünfstrahlig gebaut.',
      correct: true,
      explanation: 'Pentaradiale Symmetrie.',
      wissen:
        'Typisch sind fünf Arme bzw. fünf Radiärachsen — ein Kennzeichen vieler Stachelhäuter.',
    },
  ],
  multis: [
    {
      concept: 'bio:k6:stachelhaeuter:multi',
      question: 'Welche Merkmale passen zu Stachelhäutern?',
      correct: ['Kalkiges Innenskelett', 'Ambulakralsystem'],
      wrong: ['Leben nur an Land', 'Genau sechs Insektenbeine'],
      explanation: 'Meer, Kalk innen, Wassergefäßsystem.',
      wissen:
        'Stachelhäuter haben Kalk-Innenskelett und Ambulakralsystem und leben im Meer — nicht als Landinsekten.',
    },
  ],
  icons: [
    {
      concept: 'bio:k6:stachelhaeuter:icon',
      question: 'Welches Lebewesen bewegt sich im Meer mit Saugfüßchen und ist oft fünfstrahlig?',
      prompt: 'Stachelhäuter',
      options: [
        { id: 'stern', label: 'Seestern', icon: '⭐' },
        { id: 'biene', label: 'Honigbiene', icon: '🐝' },
        { id: 'schnecke', label: 'Schnecke', icon: '🐌' },
        { id: 'regenwurm', label: 'Regenwurm', icon: '🪱' },
      ],
      correctId: 'stern',
      explanation: 'Seesterne: Ambulakralfüßchen, Meer.',
      wissen:
        'Seesterne sind Stachelhäuter mit Saugfüßchen. Bienen sind Insekten, Schnecken Weichtiere, Regenwürmer Ringelwürmer.',
    },
  ],
}

export const nesseltiere: BioBank = {
  quelle: 'Wikipedia: Nesseltiere',
  url: 'https://de.wikipedia.org/wiki/Nesseltiere',
  conceptPrefix: 'bio:k6:nesseltiere',
  facts: [
    {
      concept: 'bio:k6:nesseltiere:nesselzellen',
      prompt: 'Was ist das namensgebende Merkmal der Nesseltiere?',
      answer: 'Nesselzellen (Nesselkapseln) zum Beutefang und zur Abwehr',
      wrong: ['Chitinpanzer mit Häutung', 'Wirbelsäule', 'Kalkgehäuse wie alle Schnecken'],
      explanation: 'Cnidocyten schleudern bei Berührung einen Nesselfaden mit Gift ab.',
      wissen:
        'Nesseltiere besitzen spezialisierte Nesselzellen. Bei Berührung entlädt sich die Nesselkapsel blitzschnell und injiziert Gift — Beute wird gelähmt, Feinde abgewehrt.',
      gap: 'Nesseltiere fangen Beute mit ___.',
      gapAccepted: ['Nesselzellen', 'Nesselkapseln', 'Nesselfäden'],
    },
    {
      concept: 'bio:k6:nesseltiere:polyp-meduse',
      prompt: 'Welche beiden Lebensformen treten bei vielen Nesseltieren auf?',
      answer: 'Polyp (festsitzend) und Meduse (frei schwimmend)',
      wrong: ['Nur Imago und Puppe wie Insekten', 'Nur Larve mit sechs Beinen', 'Nur Samen und Frucht'],
      explanation: 'Oft Generationswechsel zwischen Polyp und Qualle.',
      wissen:
        'Viele Nesseltiere wechseln zwischen Polyp und Meduse (Qualle). Der Polyp sitzt fest und knospt; die Meduse schwimmt frei und pflanzt sich oft geschlechtlich fort.',
    },
    {
      concept: 'bio:k6:nesseltiere:qualle',
      prompt: 'Was ist eine Qualle biologisch?',
      answer: 'Die frei schwimmende Medusenform eines Nesseltieres',
      wrong: ['Ein Fisch mit Wirbelsäule', 'Ein Insekt mit Flügeln', 'Ein Ringelwurm im Boden'],
      explanation: 'Glocken- oder schirmförmig mit Tentakeln.',
      wissen:
        'Quallen sind Medusen: weicher, oft glockenartiger Körper mit Tentakeln. Die Tentakel tragen Nesselzellen. Quallen treiben oder schwimmen im Wasser — meist im Meer.',
    },
    {
      concept: 'bio:k6:nesseltiere:koralle',
      prompt: 'Was sind Korallen?',
      answer: 'Meist festsitzende Polypen, oft in Kolonien mit Kalkskelett',
      wrong: ['Landpflanzen ohne Zellen', 'Insektenstaaten an Land', 'Spinnentiere mit acht Beinen'],
      explanation: 'Steinkorallen bilden Riffe aus Kalk.',
      wissen:
        'Korallen sind Nesseltiere in der Polypenform. Viele bilden Kolonien; Steinkorallen scheiden Kalk ab und bauen so Korallenriffe — artenreiche Meereslebensräume.',
    },
    {
      concept: 'bio:k6:nesseltiere:bau',
      prompt: 'Wie ist der Körper der Nesseltiere grob gebaut?',
      answer: 'Zwei Gewebeschichten um einen Gastralraum mit einer Öffnung',
      wrong: ['Drei Körperabschnitte mit sechs Beinen', 'Segmentierter Ringelwurm ohne Tentakel', 'Zwei Muschelklappen'],
      explanation: 'Radiärsymmetrisch; Mund = After.',
      wissen:
        'Nesseltiere haben Epidermis und Gastrodermis um einen zentralen Gastralraum. Eine Öffnung dient als Mund und After. Tentakel mit Nesselzellen umgeben die Öffnung.',
    },
    {
      concept: 'bio:k6:nesseltiere:lebensraum',
      prompt: 'Wo leben Nesseltiere vor allem?',
      answer: 'Im Wasser — meist im Meer, wenige im Süßwasser',
      wrong: ['Nur in trockenen Wüsten', 'Nur in Baumkronen als Vögel', 'Nur im Erdinneren als Gestein'],
      explanation: 'Quallen und Korallen: Meer; Hydra: Süßwasser.',
      wissen:
        'Die meisten Nesseltiere leben im Meer (Quallen, Korallen). Der Süßwasserpolyp Hydra zeigt, dass es auch Süßwasserformen gibt — Landformen fehlen.',
    },
    {
      concept: 'bio:k6:nesseltiere:symbiose',
      prompt: 'Womit leben viele Korallen in Symbiose?',
      answer: 'Mit einzelligen Algen (Zooxanthellen)',
      wrong: ['Mit Landinsektenstaaten', 'Mit Regenwürmern im Boden', 'Mit Säugetierknochen'],
      explanation: 'Algen liefern Fotosyntheseprodukte; Korallen bieten Schutz.',
      wissen:
        'Viele Steinkorallen beherbergen Algen in ihren Zellen. Die Algen liefern Zucker aus der Fotosynthese; die Koralle bietet Standort und Nährstoffe. Hitze kann zur Korallenbleiche führen.',
    },
    {
      concept: 'bio:k6:nesseltiere:kein-wirbeltier',
      prompt: 'Sind Quallen Fische?',
      answer: 'Nein — sie sind wirbellose Nesseltiere',
      wrong: ['Ja, sie haben immer eine Wirbelsäule', 'Ja, sie atmen mit Lungen an Land', 'Ja, sie sind Insekten'],
      explanation: 'Trotz Wasserleben: kein Wirbeltier-Bauplan.',
      wissen:
        'Quallen haben keine Wirbelsäule und keinen Fisch-Bauplan. Sie gehören zu den Nesseltieren mit Nesselzellen und oft Medusenform.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k6:nesseltiere:paar-nessel',
      term: 'Nesselzelle',
      meaning: 'Fang- und Abwehrzelle mit Kapsel',
      wissen: 'Bei Berührung schießt ein Nesselfaden aus und kann Gift injizieren.',
    },
    {
      concept: 'bio:k6:nesseltiere:paar-polyp',
      term: 'Polyp',
      meaning: 'Festsitzende Lebensform',
      wissen: 'Korallen und Seeanemonen sind Polypen; viele knospen ungeschlechtlich.',
    },
    {
      concept: 'bio:k6:nesseltiere:paar-meduse',
      term: 'Meduse',
      meaning: 'Frei schwimmende Qualle',
      wissen: 'Die Meduse ist die bewegliche Form vieler Nesseltiere.',
    },
    {
      concept: 'bio:k6:nesseltiere:paar-koralle',
      term: 'Koralle',
      meaning: 'Polyp, oft riffbildend',
      wissen: 'Steinkorallen bilden Kalkskelette und damit Korallenriffe.',
    },
    {
      concept: 'bio:k6:nesseltiere:paar-tentakel',
      term: 'Tentakel',
      meaning: 'Fangarme mit Nesselzellen',
      wissen: 'Tentakel führen gelähmte Beute zum Mund.',
    },
    {
      concept: 'bio:k6:nesseltiere:paar-gastral',
      term: 'Gastralraum',
      meaning: 'Verdauungshöhle mit einer Öffnung',
      wissen: 'Nahrung wird im Gastralraum verdaut; Mund und After sind dieselbe Öffnung.',
    },
    {
      concept: 'bio:k6:nesseltiere:paar-qualle',
      term: 'Qualle',
      meaning: 'Medusenform im Wasser',
      wissen: 'Quallen treiben oder schwimmen und tragen Nesseltentakel.',
    },
    {
      concept: 'bio:k6:nesseltiere:paar-riff',
      term: 'Korallenriff',
      meaning: 'Kalkbauwerk aus Korallenkolonien',
      wissen: 'Riffe entstehen über lange Zeit aus den Kalkskeletten unzähliger Polypen.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:nesseltiere:tf-fisch',
      statement: 'Quallen sind Fische mit Wirbelsäule.',
      correct: false,
      explanation: 'Quallen sind Nesseltiere.',
      wissen:
        'Quallen haben keine Wirbelsäule. Sie sind Medusen der Nesseltiere und fangen Beute mit Nesselzellen.',
    },
    {
      concept: 'bio:k6:nesseltiere:tf-nessel',
      statement: 'Nesselzellen dienen dem Beutefang und der Abwehr.',
      correct: true,
      explanation: 'Namensgebendes Merkmal.',
      wissen:
        'Die Nesselkapsel entlädt sich bei Berührung und kann Gift abgeben — zentral für Ernährung und Schutz.',
    },
    {
      concept: 'bio:k6:nesseltiere:tf-koralle',
      statement: 'Korallen sind Pflanzen.',
      correct: false,
      explanation: 'Korallen sind tierische Polypen (Nesseltiere).',
      wissen:
        'Obwohl Korallen festsitzen und oft bunt sind, sind sie Tiere. Viele leben aber mit Algen in Symbiose.',
    },
    {
      concept: 'bio:k6:nesseltiere:tf-polyp',
      statement: 'Polypen sind die festsitzende Form vieler Nesseltiere.',
      correct: true,
      explanation: 'Gegensatz zur frei schwimmenden Meduse.',
      wissen:
        'Polypen sitzen fest und können knospen. Bei vielen Arten entsteht daraus später die Medusengeneration.',
    },
  ],
  multis: [
    {
      concept: 'bio:k6:nesseltiere:multi',
      question: 'Welche Lebewesen gehören zu den Nesseltieren?',
      correct: ['Qualle', 'Koralle'],
      wrong: ['Regenwurm', 'Honigbiene'],
      explanation: 'Quallen und Korallen = Cnidaria.',
      wissen:
        'Quallen und Korallen sind Nesseltiere. Regenwürmer sind Ringelwürmer, Bienen Insekten.',
    },
  ],
  icons: [
    {
      concept: 'bio:k6:nesseltiere:icon',
      question: 'Welches Lebewesen fängt Beute typischerweise mit Nesselzellen an Tentakeln?',
      prompt: 'Nesseltiere',
      options: [
        { id: 'qualle', label: 'Qualle', icon: '🪼' },
        { id: 'biene', label: 'Honigbiene', icon: '🐝' },
        { id: 'spinne', label: 'Kreuzspinne', icon: '🕷️' },
        { id: 'regenwurm', label: 'Regenwurm', icon: '🪱' },
      ],
      correctId: 'qualle',
      explanation: 'Quallen: Nesselzellen an Tentakeln.',
      wissen:
        'Quallen sind Nesseltiere mit Nesselkapseln. Bienen stechen anders (Giftstachel), Spinnen beißen, Regenwürmer haben keine Nesselzellen.',
    },
  ],
}

export const BIOLOGIE_K6_WIRBELLOSE_SPECIAL_GENERATORS: Record<string, Topic['generate']> = {
  'bi-k6-lb2-krebstiere': bankGenerate(krebstiere),
  'bi-k6-lb2-tausendfuesser': bankGenerate(tausendfuesser),
  'bi-k6-lb2-ringelwuermer': bankGenerate(ringelwuermer),
  'bi-k6-lb2-stachelhaeuter': bankGenerate(stachelhaeuter),
  'bi-k6-lb2-nesseltiere': bankGenerate(nesseltiere),
  'bi-k6-lbw-weichtiere': bankGenerate(weichtiereOverview),
  'bi-k6-lbw-schnecken': bankGenerate(schnecken),
  'bi-k6-lbw-muscheln': bankGenerate(muscheln),
  'bi-k6-lbw-kopffuesser': bankGenerate(kopffuesser),
}
