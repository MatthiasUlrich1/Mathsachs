/**
 * Biologie K7 LB3 — Atmungssystem + Ausscheidungsorgane (Lehrplan 522).
 * Teilaspekte: Lunge, Atemweg, Alveolen/Gasaustausch, Atemmechanik,
 * Haut/Niere, Gesunderhaltung (Rauchen, Hautkrebs, Organspende).
 * released:false über Pack-Default.
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

const Q = {
  quelle: 'Wikipedia: Atmungssystem',
  url: 'https://de.wikipedia.org/wiki/Atmungssystem',
} as const

const fw = (s: string) => s

/** Überblick Atmungssystem — Abgrenzung zu Verdauung/Niere. */
const atmungUeberblick: BioBank = {
  ...Q,
  conceptPrefix: 'bio:k7:atmung',
  facts: [
    {
      concept: 'bio:k7:atmung:aufgabe',
      prompt: 'Welche Hauptaufgabe hat das Atmungssystem?',
      answer: 'Aufnahme von Sauerstoff und Abgabe von Kohlenstoffdioxid',
      wrong: [
        'Zerlegung von Eiweißen im Magen',
        'Filterung des Blutes in der Niere',
        'Bildung von Antikörpern',
      ],
      explanation: 'Gasaustausch zwischen Körper und Umwelt.',
      wissen: fw(
        'Das Atmungssystem nimmt Sauerstoff auf und gibt Kohlenstoffdioxid ab. Sauerstoff wird im Blut weitertransportiert; CO₂ entsteht im Zellstoffwechsel.',
      ),
      gap: 'Beim Atmen wird ___ aufgenommen und CO₂ abgegeben.',
      gapAccepted: ['Sauerstoff', 'O2', 'O₂'],
    },
    {
      concept: 'bio:k7:atmung:organe',
      prompt: 'Welche Organe gehören zum Atmungssystem des Menschen?',
      answer: 'Atemwege (Nase/Rachen/Luftröhre/Bronchien) und Lunge',
      wrong: [
        'Nur Magen und Dünndarm',
        'Nur Niere und Harnleiter',
        'Nur Knochen und Sehnen',
      ],
      explanation: 'Luftweg bis zu den Lungenbläschen.',
      wissen: fw(
        'Zum Atmungssystem zählen Nasenhöhle, Rachen, Kehlkopf, Luftröhre, Bronchien und die Lunge mit Lungenbläschen — dort findet der Gasaustausch statt.',
      ),
    },
    {
      concept: 'bio:k7:atmung:vs-verdauung',
      prompt: 'Worin unterscheidet sich Atmung von Verdauung?',
      answer: 'Atmung tauscht Atemgase aus; Verdauung zerlegt und nimmt Nährstoffe auf',
      wrong: [
        'Beide filtern nur Harnstoffe',
        'Beide erzeugen nur Antikörper',
        'Beide ersetzen das Skelett',
      ],
      explanation: 'Verschiedene Organsysteme, verschiedene Stoffe.',
      wissen: fw(
        'Atmung: O₂/CO₂ über Lunge. Verdauung: Nährstoffe über Magen-Darm. Ausscheidung über Niere/Haut ergänzt beides — nicht vermischen.',
      ),
    },
    {
      concept: 'bio:k7:atmung:zellbedarf',
      prompt: 'Warum brauchen Körperzellen Sauerstoff?',
      answer: 'Für die energieliefernde Zellatmung (ATP-Bildung)',
      wrong: [
        'Nur zum Verdauen von Zellulose im Mund',
        'Nur zum Bilden von Magensäure',
        'Nur als Ersatz für Wasser',
      ],
      explanation: 'Zellatmung in Mitochondrien.',
      wissen: fw(
        'In den Mitochondrien wird mit Sauerstoff Energie (ATP) freigesetzt. Ohne O₂ stockt die energieliefernde Zellatmung — deshalb atmen wir ständig.',
      ),
      gap: 'Sauerstoff wird in den Zellen vor allem zur ___ benötigt.',
      gapAccepted: ['Zellatmung', 'Energiegewinnung', 'ATP-Bildung'],
    },
    {
      concept: 'bio:k7:atmung:co2',
      prompt: 'Woher stammt das abgeatmete Kohlenstoffdioxid vor allem?',
      answer: 'Aus dem Zellstoffwechsel (Zellatmung)',
      wrong: [
        'Nur aus der Magensäure',
        'Nur aus den Knochen',
        'Nur aus dem Speichel',
      ],
      explanation: 'Stoffwechselprodukt der Zellen.',
      wissen: fw(
        'CO₂ entsteht bei der Zellatmung und wird über Blut zur Lunge transportiert, wo es abgeatmet wird.',
      ),
    },
    {
      concept: 'bio:k7:atmung:schutz',
      prompt: 'Wie schützt die Nase eingeatmete Luft grob?',
      answer: 'Sie wärmt, befeuchtet und reinigt die Luft (Härchen/Schleim)',
      wrong: [
        'Sie verdaut Eiweiße mit Pepsin',
        'Sie filtert Harnstoff wie die Niere',
        'Sie pumpt Blut wie das Herz',
      ],
      explanation: 'Erste Station der Atemwege.',
      wissen: fw(
        'Nasenhaare und Schleim fangen Partikel ab; die Schleimhaut wärmt und befeuchtet die Luft, bevor sie in die Lunge gelangt.',
      ),
    },
    {
      concept: 'bio:k7:atmung:kehlkopf',
      prompt: 'Welche doppelte Rolle hat der Kehlkopf?',
      answer: 'Stimmbildung und Schutz der Atemwege beim Schlucken',
      wrong: [
        'Nur Bildung von Galle',
        'Nur Filterung des Blutes',
        'Nur Speicherung von Glykogen',
      ],
      explanation: 'Stimmbänder und Kehldeckel.',
      wissen: fw(
        'Im Kehlkopf liegen die Stimmbänder. Der Kehldeckel verhindert beim Schlucken, dass Nahrung in die Luftröhre gerät.',
      ),
    },
    {
      concept: 'bio:k7:atmung:luftoehre',
      prompt: 'Wohin leitet die Luftröhre die Atemluft?',
      answer: 'In die beiden Hauptbronchien und weiter in die Lunge',
      wrong: [
        'Direkt in den Magen',
        'Direkt in die Nierenbecken',
        'Direkt in die Leberpforte',
      ],
      explanation: 'Verbindung Rachen–Lunge.',
      wissen: fw(
        'Die Luftröhre (Trachea) teilt sich in zwei Hauptbronchien, die sich in der Lunge weiter verzweigen bis zu den Lungenbläschen.',
      ),
      gap: 'Die ___ leitet Luft vom Kehlkopf zu den Bronchien.',
      gapAccepted: ['Luftröhre', 'Trachea'],
    },
    {
      concept: 'bio:k7:atmung:zwei-lungen',
      prompt: 'Warum hat der Mensch zwei Lungenflügel?',
      answer: 'Große Austauschfläche und Reserve bei einseitiger Beeinträchtigung',
      wrong: [
        'Weil nur eine Lunge verdauen könnte',
        'Weil Nieren immer paarig mitlungen',
        'Weil Knochen paarig atmen',
      ],
      explanation: 'Paariges Organ im Brustkorb.',
      wissen: fw(
        'Beide Lungenflügel liegen im Brustkorb und bieten gemeinsam eine große Oberfläche für den Gasaustausch. Der linke Flügel ist etwas kleiner wegen des Herzens.',
      ),
    },
    {
      concept: 'bio:k7:atmung:brustkorb',
      prompt: 'Welche Rolle spielt der Brustkorb beim Atmen?',
      answer: 'Er schützt die Lunge und verändert beim Atmen das Volumen',
      wrong: [
        'Er verdaut Fette',
        'Er bildet nur Harn',
        'Er speichert nur Antikörper',
      ],
      explanation: 'Rippen + Zwerchfell steuern Volumen.',
      wissen: fw(
        'Rippen und Brustbein schützen Herz und Lunge. Bewegungen von Rippen und Zwerchfell ändern das Brustkorbvolumen und ermöglichen Ein- und Ausatmen.',
      ),
    },
  ],
  pairs: [
    { concept: 'bio:k7:atmung:p:o2', term: 'Sauerstoff', meaning: 'Atemgas für die Zellatmung', wissen: 'Wird über Lunge ins Blut aufgenommen.' },
    { concept: 'bio:k7:atmung:p:co2', term: 'Kohlenstoffdioxid', meaning: 'Abgas der Zellatmung', wissen: 'Wird über Lunge abgegeben.' },
    { concept: 'bio:k7:atmung:p:lunge', term: 'Lunge', meaning: 'Organ des Gasaustauschs', wissen: 'Enthält Lungenbläschen.' },
    { concept: 'bio:k7:atmung:p:trachea', term: 'Luftröhre', meaning: 'Leitet Luft zu den Bronchien', wissen: 'Mit Knorpelspangen stabilisiert.' },
    { concept: 'bio:k7:atmung:p:bronchie', term: 'Bronchie', meaning: 'Luftwegverzweigung in der Lunge', wissen: 'Endet an den Lungenbläschen.' },
    { concept: 'bio:k7:atmung:p:kehlkopf', term: 'Kehlkopf', meaning: 'Stimmbildung und Atemwegschutz', wissen: 'Kehldeckel beim Schlucken.' },
    { concept: 'bio:k7:atmung:p:nase', term: 'Nase', meaning: 'Wärmt, befeuchtet, reinigt Luft', wissen: 'Erste Atemwegsstation.' },
    { concept: 'bio:k7:atmung:p:zwerchfell', term: 'Zwerchfell', meaning: 'Hauptatemmuskel', wissen: 'Senkt sich beim Einatmen.' },
    { concept: 'bio:k7:atmung:p:alveole', term: 'Lungenbläschen', meaning: 'Ort des Gasaustauschs', wissen: 'Große Oberfläche.' },
    { concept: 'bio:k7:atmung:p:atmung', term: 'Atmung', meaning: 'Gasaustausch Organismus–Umwelt', wissen: 'O₂ rein, CO₂ raus.' },
  ],
  trueFalse: [
    {
      concept: 'bio:k7:atmung:tf-verdauung',
      statement: 'Das Atmungssystem verdaut Nährstoffe im Dünndarm.',
      correct: false,
      explanation: 'Verdauung ist Aufgabe des Verdauungssystems.',
      wissen: fw(
        'Atmung tauscht Atemgase aus. Nährstoffverdauung und -aufnahme gehören zum Verdauungssystem — getrennte Lehrplan-Teilaspekte.',
      ),
    },
    {
      concept: 'bio:k7:atmung:tf-o2',
      statement: 'Beim Einatmen gelangt Sauerstoff über die Lunge ins Blut.',
      correct: true,
      explanation: 'Gasaustausch in den Lungenbläschen.',
      wissen: fw(
        'In den Lungenbläschen diffundiert Sauerstoff ins Blut und wird von den roten Blutkörperchen weitertransportiert.',
      ),
    },
  ],
  multis: [
    {
      concept: 'bio:k7:atmung:multi-weg',
      question: 'Was gehört zum Weg der Atemluft?',
      correct: ['Nase oder Mund', 'Luftröhre', 'Bronchien'],
      wrong: ['Nur der Dünndarm', 'Nur der Harnleiter'],
      explanation: 'Atemwege bis zur Lunge.',
      wissen: fw(
        'Atemluft: Nase/Mund → Rachen → Kehlkopf → Luftröhre → Bronchien → Lungenbläschen.',
      ),
    },
  ],
  sorts: [
    {
      concept: 'bio:k7:atmung:sort-weg',
      question: 'Ordne den Weg der Atemluft vereinfacht.',
      labels: ['Nase/Mund', 'Kehlkopf/Luftröhre', 'Bronchien', 'Lungenbläschen'],
      explanation: 'Von außen bis zum Gasaustauschort.',
      wissen: fw(
        'Luft gelangt über die oberen Atemwege in die Luftröhre, verzweigt sich in Bronchien und erreicht die Lungenbläschen.',
      ),
    },
  ],
}

/** Bau und Funktion der Lunge, Weg der Atemgase. */
const lungeBau: BioBank = {
  ...Q,
  url: 'https://de.wikipedia.org/wiki/Lunge',
  conceptPrefix: 'bio:k7:lunge',
  facts: [
    {
      concept: 'bio:k7:lunge:bau',
      prompt: 'Wie ist die Lunge grob aufgebaut?',
      answer: 'Lungenflügel mit immer feineren Bronchien bis zu den Lungenbläschen',
      wrong: [
        'Als einzelner langer Darm ohne Verzweigung',
        'Als paarige Niere mit Harnleitern',
        'Als knöcherner Schädel ohne Hohlräume',
      ],
      explanation: 'Verzweigtes Röhrensystem + Alveolen.',
      wissen: fw(
        'Jeder Lungenflügel enthält einen Bronchialbaum: Bronchien → Bronchiolen → Lungenbläschen. So entsteht eine enorme innere Oberfläche.',
      ),
    },
    {
      concept: 'bio:k7:lunge:funktion',
      prompt: 'Welche Funktion hat die Lunge vor allem?',
      answer: 'Gasaustausch zwischen Atemluft und Blut',
      wrong: [
        'Bildung von Magensaft',
        'Filterung von Harnstoff zu Harn',
        'Produktion von Insulin',
      ],
      explanation: 'O₂ ins Blut, CO₂ heraus.',
      wissen: fw(
        'In der Lunge treten Sauerstoff und Kohlenstoffdioxid zwischen Luft und Blut über. Transport im Körper übernimmt dann der Blutkreislauf.',
      ),
      gap: 'In der Lunge findet der ___ zwischen Luft und Blut statt.',
      gapAccepted: ['Gasaustausch', 'Gasaustausch'],
    },
    {
      concept: 'bio:k7:lunge:weg-ein',
      prompt: 'Wohin gelangt eingeatmete Luft zuletzt für den Gasaustausch?',
      answer: 'In die Lungenbläschen (Alveolen)',
      wrong: [
        'In den Magen',
        'In die Harnblase',
        'In die Gallenblase',
      ],
      explanation: 'Endstation der Atemwege.',
      wissen: fw(
        'Nach Nase, Rachen, Kehlkopf, Luftröhre und Bronchien erreicht die Luft die Lungenbläschen — dort ist die Wand dünn genug für Diffusion.',
      ),
    },
    {
      concept: 'bio:k7:lunge:pleura',
      prompt: 'Was umgibt die Lunge im Brustkorb?',
      answer: 'Ein dünnes Lungenfell (Pleura), das gleitende Bewegungen erlaubt',
      wrong: [
        'Eine Knochenschale ohne Bewegung',
        'Nur Magenschleimhaut',
        'Nur Knorpel wie am Ohr allein',
      ],
      explanation: 'Gleiten bei Atembewegungen.',
      wissen: fw(
        'Das Lungenfell ermöglicht, dass die Lunge den Brustkorbbewegungen folgen kann, ohne an der Brustwand zu reiben.',
      ),
    },
    {
      concept: 'bio:k7:lunge:knorpel',
      prompt: 'Wozu dienen Knorpelspangen in der Luftröhre?',
      answer: 'Sie halten die Luftröhre offen',
      wrong: [
        'Sie verdauen Fette',
        'Sie bilden Antikörper',
        'Sie speichern Harn',
      ],
      explanation: 'Stabilität des Atemwegs.',
      wissen: fw(
        'Knorpelspangen stützen die Luftröhre, damit sie beim Einatmen nicht kollabiert und Luft frei strömen kann.',
      ),
    },
    {
      concept: 'bio:k7:lunge:linke-rechte',
      prompt: 'Warum ist der linke Lungenflügel etwas kleiner?',
      answer: 'Weil das Herz links Platz braucht',
      wrong: [
        'Weil links keine Bronchien existieren',
        'Weil links nur die Niere liegt',
        'Weil links keine Alveolen nötig sind',
      ],
      explanation: 'Anatomische Anpassung an das Herz.',
      wissen: fw(
        'Das Herz liegt leicht nach links; der linke Lungenflügel hat deshalb weniger Raum und meist eine andere Lappenanzahl als der rechte.',
      ),
    },
    {
      concept: 'bio:k7:lunge:kapillaren',
      prompt: 'Wie ist die Lunge mit dem Blutkreislauf verbunden?',
      answer: 'Dichte Kapillarnetze um die Lungenbläschen ermöglichen den Gasaustausch',
      wrong: [
        'Nur über den Dünndarm',
        'Nur über Schweißdrüsen',
        'Nur über Knochenmark außen',
      ],
      explanation: 'Lungenkreislauf.',
      wissen: fw(
        'Die rechte Herzkammer pumpt Blut zur Lunge. Um die Alveolen liegen Kapillaren: O₂ geht ins Blut, CO₂ in die Alveolarluft.',
      ),
    },
    {
      concept: 'bio:k7:lunge:flimmern',
      prompt: 'Welche Aufgabe hat das Flimmerepithel in den Atemwegen?',
      answer: 'Transportiert Schleim mit Partikeln Richtung Rachen',
      wrong: [
        'Verdaut Eiweiß im Magen',
        'Filtert Blut in der Niere',
        'Bildet Knochenkalk',
      ],
      explanation: 'Reinigung der Atemwege.',
      wissen: fw(
        'Flimmerhärchen bewegen Schleim mit Staub und Keimen aufwärts zum Rachen — ein wichtiger Selbstreinigungsmechanismus der Atemwege.',
      ),
    },
    {
      concept: 'bio:k7:lunge:tote-raum',
      prompt: 'Was bedeutet „Totraum“ der Atmung grob?',
      answer: 'Luftwege, in denen kein Gasaustausch stattfindet',
      wrong: [
        'Nur der Dünndarm ohne Zotten',
        'Nur die Harnblase',
        'Nur das Knochenmark',
      ],
      explanation: 'Luftröhre/Bronchien ohne Alveolen.',
      wissen: fw(
        'In Nase, Rachen, Luftröhre und größeren Bronchien findet kein Gasaustausch statt — erst in den Lungenbläschen.',
      ),
    },
    {
      concept: 'bio:k7:lunge:schutz-rippen',
      prompt: 'Was schützt die Lunge mechanisch?',
      answer: 'Der knöcherne Brustkorb (Rippen und Brustbein)',
      wrong: [
        'Nur die Hornhaut des Auges',
        'Nur der Zahnschmelz',
        'Nur die Fußsohle',
      ],
      explanation: 'Brustkorb als Schutzkäfig.',
      wissen: fw(
        'Rippen, Brustbein und Wirbelsäule bilden den Brustkorb und schützen Herz und Lunge vor Stößen.',
      ),
    },
  ],
  pairs: [
    { concept: 'bio:k7:lunge:p:fluegel', term: 'Lungenflügel', meaning: 'Linke und rechte Lunge', wissen: 'Paariges Organ im Brustkorb.' },
    { concept: 'bio:k7:lunge:p:bronchie', term: 'Bronchie', meaning: 'Verzweigter Luftweg in der Lunge', wissen: 'Leitet zur Alveole.' },
    { concept: 'bio:k7:lunge:p:alveole', term: 'Alveole', meaning: 'Lungenbläschen', wissen: 'Gasaustauschort.' },
    { concept: 'bio:k7:lunge:p:pleura', term: 'Lungenfell', meaning: 'Gleithülle um die Lunge', wissen: 'Folgt Brustkorbbewegung.' },
    { concept: 'bio:k7:lunge:p:flimmer', term: 'Flimmerepithel', meaning: 'Reinigt Atemwege mit Schleimtransport', wissen: 'Selbstreinigung.' },
    { concept: 'bio:k7:lunge:p:knorpel', term: 'Knorpelspange', meaning: 'Hält Luftröhre offen', wissen: 'Stabilität.' },
    { concept: 'bio:k7:lunge:p:kapillare', term: 'Lungenkapillare', meaning: 'Feinstes Blutgefäß an der Alveole', wissen: 'Diffusion.' },
    { concept: 'bio:k7:lunge:p:lappen', term: 'Lungenlappen', meaning: 'Abschnitt eines Lungenflügels', wissen: 'Rechts meist drei, links zwei.' },
    { concept: 'bio:k7:lunge:p:totraum', term: 'Totraum', meaning: 'Atemwege ohne Gasaustausch', wissen: 'Bis zu den Alveolen.' },
    { concept: 'bio:k7:lunge:p:diffusion', term: 'Diffusion', meaning: 'Stoffübergang entlang des Konzentrationsgefälles', wissen: 'O₂ und CO₂ an der Alveole.' },
  ],
  trueFalse: [
    {
      concept: 'bio:k7:lunge:tf-magen',
      statement: 'Die Lunge verdaut Fette mit Gallensäuren.',
      correct: false,
      explanation: 'Fettverdauung ist Aufgabe von Leber/Galle und Darm.',
      wissen: fw(
        'Die Lunge dient dem Gasaustausch. Fettverdauung gehört zum Verdauungssystem — anderer Teilaspekt desselben Lernbereichs.',
      ),
    },
  ],
  sorts: [
    {
      concept: 'bio:k7:lunge:sort-verzweigung',
      question: 'Ordne die Verzweigung der Atemwege von grob nach fein.',
      labels: ['Luftröhre', 'Hauptbronchie', 'kleinere Bronchien', 'Lungenbläschen'],
      explanation: 'Bronchialbaum bis zur Alveole.',
      wissen: fw(
        'Die Luftröhre teilt sich in Hauptbronchien; diese verzweigen sich weiter bis zu den Lungenbläschen.',
      ),
    },
  ],
}

/** Lungenbläschen und Gasaustausch. */
const gasaustausch: BioBank = {
  ...Q,
  url: 'https://de.wikipedia.org/wiki/Gasaustausch',
  conceptPrefix: 'bio:k7:gas',
  facts: [
    {
      concept: 'bio:k7:gas:alveole',
      prompt: 'Warum sind Lungenbläschen für den Gasaustausch geeignet?',
      answer: 'Dünne Wände und sehr große Gesamtoberfläche',
      wrong: [
        'Dicke Knochenwände ohne Blut',
        'Nur Speicherung von Galle',
        'Nur Bildung von Harnsteinen',
      ],
      explanation: 'Oberflächenvergrößerung + kurze Diffusionsstrecke.',
      wissen: fw(
        'Viele kleine Lungenbläschen vergrößern die Oberfläche enorm. Die dünne Alveolarwand und angrenzende Kapillaren ermöglichen schnelle Diffusion von O₂ und CO₂.',
      ),
      gap: 'Lungenbläschen haben eine sehr große ___.',
      gapAccepted: ['Oberfläche', 'Austauschfläche'],
    },
    {
      concept: 'bio:k7:gas:o2-richtung',
      prompt: 'In welche Richtung wandert Sauerstoff beim Gasaustausch in der Lunge?',
      answer: 'Aus der Alveolarluft ins Blut',
      wrong: [
        'Aus dem Harn in den Magen',
        'Aus dem Dickdarm in die Knochen',
        'Aus Antikörpern in den Speichel',
      ],
      explanation: 'Konzentrationsgefälle Luft → Blut.',
      wissen: fw(
        'In frischer Atemluft ist der O₂-Partialdruck höher als im sauerstoffarmen Blut der Lungenkapillaren — Sauerstoff diffundiert ins Blut.',
      ),
    },
    {
      concept: 'bio:k7:gas:co2-richtung',
      prompt: 'In welche Richtung wandert Kohlenstoffdioxid in der Lunge?',
      answer: 'Aus dem Blut in die Alveolarluft',
      wrong: [
        'Aus der Knochenrinde in den Zahn',
        'Aus dem Speichel in den Magen allein',
        'Aus dem Harnleiter in die Leber',
      ],
      explanation: 'CO₂ wird abgeatmet.',
      wissen: fw(
        'Im venösen Blut ist CO₂ angereichert. Es diffundiert in die Alveolen und wird ausgeatmet.',
      ),
    },
    {
      concept: 'bio:k7:gas:haemoglobin',
      prompt: 'Wie wird der meiste Sauerstoff im Blut transportiert?',
      answer: 'Gebunden an Hämoglobin in roten Blutkörperchen',
      wrong: [
        'Nur als feste Kristalle im Knochen',
        'Nur gelöst in der Galle',
        'Nur in den Schweißdrüsen',
      ],
      explanation: 'Hämoglobin bindet O₂.',
      wissen: fw(
        'Hämoglobin in Erythrozyten bindet Sauerstoff und transportiert ihn zu den Geweben. Ohne diesen Transport wäre Diffusion allein unzureichend.',
      ),
      gap: 'Sauerstoff wird vor allem an ___ gebunden transportiert.',
      gapAccepted: ['Hämoglobin', 'Hb'],
    },
    {
      concept: 'bio:k7:gas:oberflaeche',
      prompt: 'Warum ist Oberflächenvergrößerung in der Lunge wichtig?',
      answer: 'Mehr Fläche ermöglicht mehr Gasaustausch pro Zeit',
      wrong: [
        'Sie verkleinert die Diffusionsfläche absichtlich',
        'Sie stoppt den Blutfluss dauerhaft',
        'Sie ersetzt die Atmung durch Verdauung',
      ],
      explanation: 'Viele kleine Bläschen statt eines großen Hohlraums.',
      wissen: fw(
        'Je größer die Austauschfläche, desto mehr O₂ und CO₂ können gleichzeitig übertreten — Prinzip der Oberflächenvergrößerung.',
      ),
    },
    {
      concept: 'bio:k7:gas:diffusion',
      prompt: 'Welcher Vorgang treibt den Gasaustausch an der Alveole?',
      answer: 'Diffusion entlang von Konzentrationsunterschieden',
      wrong: [
        'Aktives Pumpen durch Magensäure',
        'Nur Filtration wie in der Niere',
        'Nur Nervenimpulse ohne Blut',
      ],
      explanation: 'Passive Diffusion.',
      wissen: fw(
        'Stoffe wandern von Orten höherer zu niedrigerer Konzentration. An der Alveole reicht die dünne Schranke für schnelle Diffusion.',
      ),
    },
    {
      concept: 'bio:k7:gas:feucht',
      prompt: 'Warum sind die Innenflächen der Alveolen feucht?',
      answer: 'Gase lösen sich in der Feuchtigkeit und diffundieren leichter',
      wrong: [
        'Damit Harn dort gespeichert wird',
        'Damit Galle dort verdaut',
        'Damit Knochen dort wachsen',
      ],
      explanation: 'Feuchte Diffusionsbarriere.',
      wissen: fw(
        'Eine dünne Feuchtigkeitsschicht auf der Alveolarwand hilft, Gase zu lösen und den Übergang ins Blut zu erleichtern.',
      ),
    },
    {
      concept: 'bio:k7:gas:surfaktant',
      prompt: 'Wozu dient Surfactant in den Lungenbläschen grob?',
      answer: 'Verringert die Oberflächenspannung und hält Alveolen offen',
      wrong: [
        'Verdaut Eiweiß im Magen',
        'Bildet Antikörper im Blut',
        'Filtert Harnstoff',
      ],
      explanation: 'Verhindert Kollaps der Bläschen.',
      wissen: fw(
        'Surfactant (Grenzflächenfilme) senkt die Oberflächenspannung in Alveolen, sodass sie beim Ausatmen nicht zusammenfallen.',
      ),
    },
    {
      concept: 'bio:k7:gas:gewebe',
      prompt: 'Was passiert beim Gasaustausch in den Körpergeweben?',
      answer: 'Zellen nehmen O₂ auf und geben CO₂ ab',
      wrong: [
        'Zellen verdauen nur Zellulose außen',
        'Zellen speichern nur Harnsteine',
        'Zellen bilden nur Pollen',
      ],
      explanation: 'Umgekehrte Richtung zur Lunge.',
      wissen: fw(
        'In Gewebekapillaren ist O₂-Druck höher im Blut als in den Zellen — O₂ geht zu den Zellen, CO₂ zurück ins Blut Richtung Lunge.',
      ),
    },
    {
      concept: 'bio:k7:gas:rauch',
      prompt: 'Warum beeinträchtigt Rauchen den Gasaustausch langfristig?',
      answer: 'Schädigt Atemwege und verringert oft die wirksame Austauschfläche',
      wrong: [
        'Es verbessert Alveolen immer',
        'Es ersetzt Hämoglobin durch Chlorophyll',
        'Es macht Diffusion überflüssig',
      ],
      explanation: 'Schadstoffe und Entzündungen.',
      wissen: fw(
        'Rauch schädigt Flimmerepithel und Lungengewebe. Chronische Schäden können die für den Gasaustausch verfügbare Fläche verringern.',
      ),
    },
  ],
  pairs: [
    { concept: 'bio:k7:gas:p:alveole', term: 'Lungenbläschen', meaning: 'Ort des Gasaustauschs', wissen: 'Dünne Wand, große Fläche.' },
    { concept: 'bio:k7:gas:p:diffusion', term: 'Diffusion', meaning: 'Ausgleich von Konzentrationsunterschieden', wissen: 'O₂ und CO₂.' },
    { concept: 'bio:k7:gas:p:hb', term: 'Hämoglobin', meaning: 'Sauerstoffbinder in Erythrozyten', wissen: 'Transport im Blut.' },
    { concept: 'bio:k7:gas:p:o2', term: 'O₂-Aufnahme', meaning: 'Sauerstoff aus Luft ins Blut', wissen: 'An der Alveole.' },
    { concept: 'bio:k7:gas:p:co2', term: 'CO₂-Abgabe', meaning: 'Kohlenstoffdioxid aus Blut in Luft', wissen: 'Abatmen.' },
    { concept: 'bio:k7:gas:p:flaeche', term: 'Oberflächenvergrößerung', meaning: 'Viele kleine Bläschen statt eines großen Hohlraums', wissen: 'Mehr Austausch.' },
    { concept: 'bio:k7:gas:p:kapillare', term: 'Kapillarnetz', meaning: 'Blutgefäße um Alveolen', wissen: 'Kurze Diffusionsstrecke.' },
    { concept: 'bio:k7:gas:p:partial', term: 'Partialdruck', meaning: 'Druckanteil eines Gases im Gemisch', wissen: 'Treibt Diffusion.' },
    { concept: 'bio:k7:gas:p:ery', term: 'Erythrozyt', meaning: 'Rotes Blutkörperchen', wissen: 'Trägt Hämoglobin.' },
    { concept: 'bio:k7:gas:p:barriere', term: 'Blut-Luft-Schranke', meaning: 'Dünne Trennschicht Alveole–Kapillare', wissen: 'Ermöglicht schnelle Diffusion.' },
  ],
  trueFalse: [
    {
      concept: 'bio:k7:gas:tf-dicke',
      statement: 'Dicke Alveolarwände beschleunigen den Gasaustausch.',
      correct: false,
      explanation: 'Kurze Diffusionsstrecken sind vorteilhaft.',
      wissen: fw(
        'Je dünner die Trennschicht zwischen Luft und Blut, desto schneller die Diffusion. Dicke Wände würden den Gasaustausch behindern.',
      ),
    },
  ],
  multis: [
    {
      concept: 'bio:k7:gas:multi',
      question: 'Was fördert effizienten Gasaustausch in der Lunge?',
      correct: ['Große Oberfläche', 'Dünne Alveolarwände', 'Dichte Kapillarversorgung'],
      wrong: ['Dicke Knochenwände um jede Alveole', 'Vollständiges Fehlen von Blutgefäßen'],
      explanation: 'Fläche, kurze Strecke, Durchblutung.',
      wissen: fw(
        'Effizienter Gasaustausch braucht große Fläche, kurze Diffusionswege und gute Durchblutung der Kapillaren.',
      ),
    },
  ],
}

/** Atemmechanik: Brust-/Bauchatmung, Frequenz, Belastung. */
const atemmechanik: BioBank = {
  ...Q,
  url: 'https://de.wikipedia.org/wiki/Atemmechanik',
  conceptPrefix: 'bio:k7:atemmech',
  facts: [
    {
      concept: 'bio:k7:atemmech:einatmen',
      prompt: 'Was passiert beim Einatmen mit dem Brustkorbvolumen?',
      answer: 'Es vergrößert sich; Luft strömt hinein',
      wrong: [
        'Es verschwindet vollständig',
        'Die Lunge wird zum Magen',
        'Harn fließt in die Bronchien',
      ],
      explanation: 'Unterdruck saugt Luft an.',
      wissen: fw(
        'Zwerchfell senkt sich, Rippen heben sich: Brustkorbvolumen steigt, Druck sinkt, Außenluft strömt in die Lunge.',
      ),
      gap: 'Beim Einatmen ___ sich das Brustkorbvolumen.',
      gapAccepted: ['vergrößert', 'vergrößert sich', 'steigt'],
    },
    {
      concept: 'bio:k7:atemmech:ausatmen',
      prompt: 'Was passiert beim ruhigen Ausatmen typischerweise?',
      answer: 'Brustkorbvolumen nimmt ab; Luft strömt hinaus',
      wrong: [
        'Das Herz stoppt dauerhaft',
        'Die Niere atmet mit',
        'Knochen verdauen Luft',
      ],
      explanation: 'Druck steigt, Luft entweicht.',
      wissen: fw(
        'Zwerchfell und Atemmuskeln entspannen sich (ruhiges Ausatmen oft weitgehend passiv): Volumen sinkt, Luft wird hinausgepresst.',
      ),
    },
    {
      concept: 'bio:k7:atemmech:zwerchfell',
      prompt: 'Welche Rolle hat das Zwerchfell beim Atmen?',
      answer: 'Hauptatemmuskel: senkt sich beim Einatmen',
      wrong: [
        'Es verdaut Fette im Darm',
        'Es filtert Blut zu Harn',
        'Es bildet Insulin',
      ],
      explanation: 'Trennt Brust- und Bauchhöhle.',
      wissen: fw(
        'Das Zwerchfell ist der wichtigste Atemmuskel. Beim Einatmen wölbt es sich nach unten und vergrößert den Brustraum.',
      ),
    },
    {
      concept: 'bio:k7:atemmech:bauch',
      prompt: 'Was kennzeichnet Bauchatmung?',
      answer: 'Vor allem Zwerchfellbewegung; Bauchdecke hebt und senkt sich',
      wrong: [
        'Nur Bewegung der Fingerknochen',
        'Nur Filtration in der Niere',
        'Nur Verdauung im Dickdarm',
      ],
      explanation: 'Zwerchfellatmung.',
      wissen: fw(
        'Bei der Bauchatmung arbeitet vor allem das Zwerchfell: der Bauch wölbt sich beim Einatmen vor, weil Bauchorgane nach unten gedrückt werden.',
      ),
      gap: 'Bauchatmung nutzt vor allem das ___.',
      gapAccepted: ['Zwerchfell'],
    },
    {
      concept: 'bio:k7:atemmech:brust',
      prompt: 'Was kennzeichnet Brustatmung?',
      answer: 'Vor allem Heben und Senken des Brustkorbs durch Rippenmuskeln',
      wrong: [
        'Nur Schwitzen über die Haut',
        'Nur Harnbildung',
        'Nur Speichelfluss',
      ],
      explanation: 'Rippenatmung.',
      wissen: fw(
        'Bei der Brustatmung heben Zwischenrippenmuskeln den Brustkorb. Oft kombinieren wir Brust- und Bauchatmung.',
      ),
    },
    {
      concept: 'bio:k7:atemmech:frequenz',
      prompt: 'Was bedeutet Atemfrequenz?',
      answer: 'Anzahl der Atemzüge pro Zeiteinheit',
      wrong: [
        'Nur die Anzahl der Zähne',
        'Nur der Blutzuckerwert',
        'Nur die Körpergröße in Metern',
      ],
      explanation: 'Atemzüge/Minute.',
      wissen: fw(
        'Die Atemfrequenz gibt an, wie oft man pro Minute ein- und ausatmet. In Ruhe ist sie niedriger als bei Anstrengung.',
      ),
    },
    {
      concept: 'bio:k7:atemmech:belastung',
      prompt: 'Warum steigt die Atemfrequenz bei körperlicher Belastung?',
      answer: 'Muskeln brauchen mehr Sauerstoff und produzieren mehr CO₂',
      wrong: [
        'Weil Verdauung dann stoppt dauerhaft',
        'Weil Knochen dann Luft speichern',
        'Weil Haare dann atmen',
      ],
      explanation: 'Erhöhter Gasbedarf.',
      wissen: fw(
        'Bei Sport steigt der Energiebedarf: mehr O₂ nötig, mehr CO₂ entsteht. Atmung und Kreislauf passen Frequenz und Tiefe an.',
      ),
    },
    {
      concept: 'bio:k7:atemmech:tiefe',
      prompt: 'Was ändert sich bei Belastung außer der Frequenz oft?',
      answer: 'Die Atemtiefe (größeres Atemzugvolumen)',
      wrong: [
        'Die Anzahl der Nieren verdoppelt sich sofort',
        'Die Magensäure wird zu Sauerstoff',
        'Das Skelett verschwindet',
      ],
      explanation: 'Tiefer und/oder schneller atmen.',
      wissen: fw(
        'Neben mehr Atemzügen wird oft tiefer geatmet, sodass pro Zug mehr Luft die Alveolen erreicht.',
      ),
    },
    {
      concept: 'bio:k7:atemmech:messung',
      prompt: 'Wie kann man Atemfrequenz einfach beobachten?',
      answer: 'Atemzüge (Brust/Bauchbewegung) pro Minute zählen',
      wrong: [
        'Nur Zahnfarbe messen',
        'Nur Schuhgröße notieren',
        'Nur Haarlänge wiegen',
      ],
      explanation: 'Einfache Messung im Unterricht.',
      wissen: fw(
        'Ruhe vs. nach Belastung: Atemzüge eine Minute lang zählen — typisches Schülerexperiment zur Atemmechanik.',
      ),
    },
    {
      concept: 'bio:k7:atemmech:steuerung',
      prompt: 'Wonach richtet sich die Atmungssteuerung grob?',
      answer: 'Unter anderem nach CO₂-Gehalt und Bedarf der Muskeln',
      wrong: [
        'Nur nach der Schuhfarbe',
        'Nur nach der Zahnanzahl',
        'Nur nach der Haarfarbe',
      ],
      explanation: 'Körperliche Regelung.',
      wissen: fw(
        'Atemzentrum und Sensoren reagieren auf Gase im Blut und auf Belastung — deshalb atmen wir unwillkürlich schneller beim Sport.',
      ),
    },
  ],
  pairs: [
    { concept: 'bio:k7:atemmech:p:zwerch', term: 'Zwerchfell', meaning: 'Hauptatemmuskel', wissen: 'Senkt sich beim Einatmen.' },
    { concept: 'bio:k7:atemmech:p:bauch', term: 'Bauchatmung', meaning: 'Vorwiegend Zwerchfellatmung', wissen: 'Bauchdecke bewegt sich.' },
    { concept: 'bio:k7:atemmech:p:brust', term: 'Brustatmung', meaning: 'Vorwiegend Rippen-/Brustkorbbewegung', wissen: 'Zwischenrippenmuskeln.' },
    { concept: 'bio:k7:atemmech:p:freq', term: 'Atemfrequenz', meaning: 'Atemzüge pro Zeit', wissen: 'Steigt bei Belastung.' },
    { concept: 'bio:k7:atemmech:p:volumen', term: 'Atemzugvolumen', meaning: 'Luftmenge pro Atemzug', wissen: 'Kann tiefer werden.' },
    { concept: 'bio:k7:atemmech:p:ein', term: 'Einatmen', meaning: 'Volumen ↑, Luft hinein', wissen: 'Aktive Muskelarbeit.' },
    { concept: 'bio:k7:atemmech:p:aus', term: 'Ausatmen', meaning: 'Volumen ↓, Luft hinaus', wissen: 'In Ruhe oft weitgehend passiv.' },
    { concept: 'bio:k7:atemmech:p:rippen', term: 'Zwischenrippenmuskeln', meaning: 'Heben/senken den Brustkorb', wissen: 'Brustatmung.' },
    { concept: 'bio:k7:atemmech:p:belast', term: 'Belastungsatmung', meaning: 'Schneller und/oder tiefer', wissen: 'Mehr O₂-Bedarf.' },
    { concept: 'bio:k7:atemmech:p:ruhe', term: 'Ruheatmung', meaning: 'Niedrigere Frequenz und Tiefe', wissen: 'Grundbedarf.' },
  ],
  trueFalse: [
    {
      concept: 'bio:k7:atemmech:tf-sport',
      statement: 'Bei körperlicher Belastung bleibt die Atemfrequenz immer unverändert.',
      correct: false,
      explanation: 'Belastung erhöht typischerweise Frequenz und/oder Tiefe.',
      wissen: fw(
        'Muskeln brauchen mehr Sauerstoff und produzieren mehr CO₂ — Atmung passt sich mit höherer Frequenz und oft größerer Tiefe an.',
      ),
    },
    {
      concept: 'bio:k7:atemmech:tf-zwerch',
      statement: 'Das Zwerchfell ist ein wichtiger Atemmuskel.',
      correct: true,
      explanation: 'Hauptmuskel der Bauch-/Zwerchfellatmung.',
      wissen: fw(
        'Ohne Zwerchfellbewegung wäre effiziente Ruheatmung kaum möglich — es vergrößert den Brustraum beim Einatmen.',
      ),
    },
  ],
  multis: [
    {
      concept: 'bio:k7:atemmech:multi',
      question: 'Welche Aussagen zur Atemmechanik stimmen?',
      correct: [
        'Einatmen vergrößert das Brustkorbvolumen',
        'Belastung erhöht oft die Atemfrequenz',
        'Bauchatmung nutzt vor allem das Zwerchfell',
      ],
      wrong: ['Ausatmen vergrößert immer das Volumen dauerhaft', 'Atemfrequenz ist die Anzahl der Nieren'],
      explanation: 'Volumen, Frequenz, Zwerchfell.',
      wissen: fw(
        'Atemmechanik: Volumenänderung durch Zwerchfell/Rippen; Frequenz und Tiefe passen sich dem Bedarf an.',
      ),
    },
  ],
}

/** Haut und Niere als Ausscheidungsorgane (Lehrplan neben Atmung). */
const hautNiere: BioBank = {
  quelle: 'Wikipedia: Ausscheidung',
  url: 'https://de.wikipedia.org/wiki/Ausscheidung',
  conceptPrefix: 'bio:k7:hautniere',
  facts: [
    {
      concept: 'bio:k7:hautniere:niere-aufgabe',
      prompt: 'Welche Aufgabe haben die Nieren vor allem?',
      answer: 'Filtern Blut und bilden Harn zur Ausscheidung',
      wrong: [
        'Verdauen Fette im Mund',
        'Bilden Magensäure dauerhaft',
        'Pumpen Blut wie das Herz',
      ],
      explanation: 'Harnpflichtige Stoffe entfernen.',
      wissen: fw(
        'Nieren filtrieren Blut, behalten Nützliches zurück und scheiden überschüssige Salze, Wasser und harnpflichtige Stoffe als Harn aus.',
      ),
      gap: 'Nieren bilden ___, um Stoffe auszuscheiden.',
      gapAccepted: ['Harn', 'Urin'],
    },
    {
      concept: 'bio:k7:hautniere:harnweg',
      prompt: 'Wohin gelangt der Harn nach den Nieren?',
      answer: 'Über Harnleiter in die Harnblase, dann über die Harnröhre nach außen',
      wrong: [
        'Direkt in die Lungenbläschen',
        'Direkt in den Dünndarm zur Verdauung',
        'Direkt in die Speiseröhre',
      ],
      explanation: 'Harnableitende Organe.',
      wissen: fw(
        'Harnleiter transportieren Harn zur Blase; die Harnröhre leitet ihn nach außen — harnableitende Organe laut Lehrplan.',
      ),
    },
    {
      concept: 'bio:k7:hautniere:haut',
      prompt: 'Welche Ausscheidungsfunktion hat die äußere Haut?',
      answer: 'Gibt über Schweiß Wasser, Salze und Stoffwechselprodukte ab',
      wrong: [
        'Filtert Blut zu Harn in der Blase',
        'Verdaut Eiweiß mit Pepsin',
        'Bildet nur Knochenmark',
      ],
      explanation: 'Schweiß als Ausscheidung.',
      wissen: fw(
        'Schweißdrüsen scheiden Wasser und Salze aus und helfen bei der Temperaturregulation. Die Haut ist damit ein Ausscheidungsorgan neben Niere und Lunge (CO₂).',
      ),
    },
    {
      concept: 'bio:k7:hautniere:vs-atmung',
      prompt: 'Wie ergänzen sich Lunge und Niere bei der Ausscheidung?',
      answer: 'Lunge gibt CO₂ ab; Niere scheidet harnpflichtige Stoffe aus',
      wrong: [
        'Beide verdauen nur Stärke im Mund',
        'Beide bilden nur Antikörper',
        'Beide ersetzen das Skelett',
      ],
      explanation: 'Verschiedene Stoffklassen.',
      wissen: fw(
        'CO₂ verlässt den Körper über die Lunge. Wasserlösliche Abbauprodukte (z. B. Harnstoff) gehen über die Niere. Haut ergänzt über Schweiß.',
      ),
    },
    {
      concept: 'bio:k7:hautniere:nephron',
      prompt: 'Was ist grob die Funktionseinheit der Niere?',
      answer: 'Das Nephron (Filter- und Rückresorptionseinheit)',
      wrong: [
        'Das Lungenbläschen',
        'Das Staubblatt',
        'Das Axon allein',
      ],
      explanation: 'Filtration und Rückgewinnung.',
      wissen: fw(
        'Nephrone filtrieren Blutplasma und holen wertvolle Stoffe zurück; Rest wird zu Harn konzentriert.',
      ),
    },
    {
      concept: 'bio:k7:hautniere:wasser',
      prompt: 'Warum ist Wasserhaushalt für Niere und Haut wichtig?',
      answer: 'Beide beeinflussen, wie viel Wasser der Körper abgibt',
      wrong: [
        'Wasser ist für Ausscheidung irrelevant',
        'Nur Knochen speichern allen Harn',
        'Nur Zähne regulieren Wasser',
      ],
      explanation: 'Bilanz aus Zufuhr und Abgabe.',
      wissen: fw(
        'Trinken, Atmung, Schweiß und Harn bestimmen den Wasserhaushalt. Nieren stellen die Harnmenge fein ein.',
      ),
    },
    {
      concept: 'bio:k7:hautniere:schutz-haut',
      prompt: 'Welche Schutzaufgabe hat die Haut außer Ausscheidung?',
      answer: 'Barriere gegen Keime, Austrocknung und Verletzungen',
      wrong: [
        'Bildung von Magensaft',
        'Pumpen des Blutes',
        'Filterung zu Harn allein',
      ],
      explanation: 'Äußere Barriere.',
      wissen: fw(
        'Die Haut schützt vor Infektionen und Flüssigkeitsverlust und ist Sinnesorgan — Ausscheidung ist nur eine ihrer Aufgaben.',
      ),
    },
    {
      concept: 'bio:k7:hautniere:blase',
      prompt: 'Welche Aufgabe hat die Harnblase?',
      answer: 'Speichert Harn bis zur willkürlichen Entleerung',
      wrong: [
        'Verdaut Fette',
        'Tauscht Atemgase aus',
        'Bildet rote Blutkörperchen',
      ],
      explanation: 'Speicherorgan.',
      wissen: fw(
        'Die Harnblase sammelt Harn aus den Harnleitern und ermöglicht kontrollierte Entleerung über die Harnröhre.',
      ),
    },
    {
      concept: 'bio:k7:hautniere:harnstoff',
      prompt: 'Was ist Harnstoff grob?',
      answer: 'Ein stickstoffhaltiges Abbauprodukt, das über den Harn ausgeschieden wird',
      wrong: [
        'Ein Atemgas wie Sauerstoff',
        'Ein Knochenbaustein allein',
        'Ein Blattgrünfarbstoff',
      ],
      explanation: 'Proteinabbau → Harnstoff.',
      wissen: fw(
        'Beim Abbau von Aminosäuren entsteht Ammoniak, der in der Leber zu Harnstoff umgewandelt und über die Niere ausgeschieden wird.',
      ),
    },
    {
      concept: 'bio:k7:hautniere:zwei-nieren',
      prompt: 'Warum hat der Mensch zwei Nieren?',
      answer: 'Reserve und hohe Filterleistung; eine kann oft ausreichen',
      wrong: [
        'Weil jede Niere eine Lunge ersetzt',
        'Weil Nieren paarig verdauen müssen',
        'Weil Haut keine Barriere braucht',
      ],
      explanation: 'Paariges Organ.',
      wissen: fw(
        'Zwei Nieren bieten hohe Filtrationskapazität. Deshalb ist unter ärztlicher Prüfung auch Organspende einer Niere möglich.',
      ),
    },
  ],
  pairs: [
    { concept: 'bio:k7:hautniere:p:niere', term: 'Niere', meaning: 'Filtert Blut, bildet Harn', wissen: 'Ausscheidungsorgan.' },
    { concept: 'bio:k7:hautniere:p:leiter', term: 'Harnleiter', meaning: 'Leitet Harn zur Blase', wissen: 'Ableitendes Organ.' },
    { concept: 'bio:k7:hautniere:p:blase', term: 'Harnblase', meaning: 'Speichert Harn', wissen: 'Entleerung über Harnröhre.' },
    { concept: 'bio:k7:hautniere:p:roehre', term: 'Harnröhre', meaning: 'Leitet Harn nach außen', wissen: 'Letzte Station.' },
    { concept: 'bio:k7:hautniere:p:schweiss', term: 'Schweiß', meaning: 'Ausscheidung über die Haut', wissen: 'Wasser, Salze, Thermoregulation.' },
    { concept: 'bio:k7:hautniere:p:haut', term: 'Äußere Haut', meaning: 'Barriere und Ausscheidungsorgan', wissen: 'Schweiß und Schutzbarriere.' },
    { concept: 'bio:k7:hautniere:p:nephron', term: 'Nephron', meaning: 'Funktionseinheit der Niere', wissen: 'Filtration + Rückresorption.' },
    { concept: 'bio:k7:hautniere:p:harnstoff', term: 'Harnstoff', meaning: 'Stickstoffhaltiges Abbauprodukt', wissen: 'Im Harn.' },
    { concept: 'bio:k7:hautniere:p:filtration', term: 'Filtration', meaning: 'Abpressen von Primärharn', wissen: 'In den Nierenkörperchen.' },
    { concept: 'bio:k7:hautniere:p:rueck', term: 'Rückresorption', meaning: 'Rückgewinnung wertvoller Stoffe', wissen: 'Wasser, Glucose, Salze.' },
  ],
  trueFalse: [
    {
      concept: 'bio:k7:hautniere:tf-lunge',
      statement: 'Die Niere tauscht Sauerstoff und CO₂ wie die Lungenbläschen aus.',
      correct: false,
      explanation: 'Gasaustausch ist Aufgabe der Lunge.',
      wissen: fw(
        'Niere: Harnbildung. Lunge: Gasaustausch. Beide gehören zu Organen mit Ausscheidungsfunktion, aber mit unterschiedlichen Stoffen.',
      ),
    },
  ],
  sorts: [
    {
      concept: 'bio:k7:hautniere:sort-harn',
      question: 'Ordne den Weg des Harns.',
      labels: ['Niere', 'Harnleiter', 'Harnblase', 'Harnröhre'],
      explanation: 'Bildung → Ableitung → Speicherung → Ausscheidung.',
      wissen: fw(
        'Harn entsteht in der Niere, fließt durch Harnleiter in die Blase und verlässt den Körper über die Harnröhre.',
      ),
    },
  ],
}

/** Gesunderhaltung: Rauchen, Hautkrebs, Organspende. */
const organeSchutz: BioBank = {
  quelle: 'Wikipedia: Rauchen',
  url: 'https://de.wikipedia.org/wiki/Rauchen',
  conceptPrefix: 'bio:k7:orgschutz',
  facts: [
    {
      concept: 'bio:k7:orgschutz:rauchen',
      prompt: 'Warum ist Rauchen schädlich für die Atmungsorgane?',
      answer: 'Schadstoffe schädigen Atemwege und Lungengewebe',
      wrong: [
        'Rauch verbessert Flimmerepithel immer',
        'Rauch ersetzt Sauerstoff vollständig',
        'Rauch heilt Alveolen zuverlässig',
      ],
      explanation: 'Schadstoffe belasten Atemwege und Lunge.',
      wissen: fw(
        'Tabakrauch enthält Schadstoffe, die Schleimhaut und Flimmerepithel schädigen und das Risiko für chronische Lungenerkrankungen und Krebs erhöhen.',
      ),
    },
    {
      concept: 'bio:k7:orgschutz:flimmer',
      prompt: 'Wie beeinträchtigt Rauch die Selbstreinigung der Atemwege?',
      answer: 'Flimmerhärchen werden gestört; Schleim und Partikel bleiben eher liegen',
      wrong: [
        'Flimmerhärchen verdauen dann Fette besser',
        'Nieren übernehmen die Atmung',
        'Knochen reinigen die Bronchien',
      ],
      explanation: 'Gestörte Mukoziliäre Clearance.',
      wissen: fw(
        'Rauch lähmt und schädigt Flimmerhärchen. Reinigung der Atemwege verschlechtert sich — anfälliger für Infekte und chronische Reizung.',
      ),
    },
    {
      concept: 'bio:k7:orgschutz:hautkrebs',
      prompt: 'Was erhöht das Hautkrebsrisiko besonders?',
      answer: 'Übermäßige UV-Strahlung (Sonne/Solarium) ohne Schutz',
      wrong: [
        'Nur das Trinken von Wasser',
        'Nur das Zähneputzen',
        'Nur das Tragen von Schuhen',
      ],
      explanation: 'UV kann Hautzellen schädigen.',
      wissen: fw(
        'UV-Strahlung kann Erbgut in Hautzellen schädigen. Sonnenschutz, Schatten und Vermeiden von Solarien senken das Risiko.',
      ),
      gap: 'Starkes ___ ohne Schutz erhöht das Hautkrebsrisiko.',
      gapAccepted: ['UV', 'UV-Strahlung', 'Sonnenbaden', 'Sonnenlicht'],
    },
    {
      concept: 'bio:k7:orgschutz:sonnenschutz',
      prompt: 'Welche Maßnahme schützt die Haut vor UV?',
      answer: 'Kleidung, Schatten und Sonnencreme mit ausreichendem Schutz',
      wrong: [
        'Absichtliches Verbrennen der Haut',
        'Rauchen als Hautschutz',
        'Verzicht auf jede Flüssigkeit',
      ],
      explanation: 'Prävention.',
      wissen: fw(
        'Physikalischer Schutz (Kleidung, Schatten) und Cremes mit Lichtschutzfaktor reduzieren UV-Schäden der Haut.',
      ),
    },
    {
      concept: 'bio:k7:orgschutz:organspende',
      prompt: 'Was ist bei Organspende ethisch zentral?',
      answer: 'Freiwilligkeit, Aufklärung und klare Regeln zum Schutz der Beteiligten',
      wrong: [
        'Zwang ohne Information',
        'Verkauf von Organen als Alltagspflicht',
        'Ignorieren jeder Einwilligung',
      ],
      explanation: 'Organspende braucht informierte Zustimmung.',
      wissen: fw(
        'Organspende kann Leben retten (z. B. Niere, Lunge). Ethik verlangt informierte Entscheidung, Fairness und Schutz vor Ausbeutung.',
      ),
    },
    {
      concept: 'bio:k7:orgschutz:niere-spende',
      prompt: 'Warum ist Nierenspende besonders diskutiert?',
      answer: 'Menschen können mit einer Niere leben; Spende rettet Empfänger',
      wrong: [
        'Nieren sind überflüssig',
        'Atemgase ersetzen Nieren immer',
        'Haut ersetzt Nieren vollständig',
      ],
      explanation: 'Lebend- und postmortale Spende.',
      wissen: fw(
        'Weil zwei Nieren Reserve bieten, ist Lebendspende einer Niere unter strenger Prüfung möglich. Entscheidung bleibt ethisch und persönlich.',
      ),
    },
    {
      concept: 'bio:k7:orgschutz:lunge-pflege',
      prompt: 'Was unterstützt die Gesunderhaltung der Lunge?',
      answer: 'Nicht rauchen, frische Luft, Bewegung, Infekte ernst nehmen',
      wrong: [
        'Tägliches Einatmen von Tabakrauch',
        'Vermeiden jeder Bewegung dauerhaft',
        'Ignorieren von Atemnot immer',
      ],
      explanation: 'Prävention.',
      wissen: fw(
        'Rauchverzicht, Bewegung und Vermeiden starker Schadstoffbelastung schützen die Atmungsorgane — analog zur Gesunderhaltung von Haut und Niere.',
      ),
    },
    {
      concept: 'bio:k7:orgschutz:passiv',
      prompt: 'Warum ist Passivrauchen problematisch?',
      answer: 'Auch Mitreisende atmen Schadstoffe ein',
      wrong: [
        'Passivrauch enthält nur Sauerstoff',
        'Passivrauch heilt Alveolen',
        'Nur aktive Raucher sind betroffen jemals',
      ],
      explanation: 'Fremdgefährdung.',
      wissen: fw(
        'Nebenstromrauch belastet die Raumluft. Besonders Kinder und Menschen mit Vorerkrankungen sind durch Passivrauchen gefährdet.',
      ),
    },
    {
      concept: 'bio:k7:orgschutz:frueherkennung',
      prompt: 'Warum ist Veränderung an Hautmalen relevant?',
      answer: 'Manche Veränderungen können auf Hautkrebs hinweisen',
      wrong: [
        'Hautmale atmen Sauerstoff',
        'Hautmale ersetzen die Niere',
        'Hautmale verdauen Fette',
      ],
      explanation: 'Beobachten und ärztlich abklären.',
      wissen: fw(
        'Asymmetrie, unregelmäßige Ränder, Farbwechsel oder Wachstum eines Mals sind Warnsignale — frühzeitige Untersuchung verbessert Chancen.',
      ),
    },
    {
      concept: 'bio:k7:orgschutz:verantwortung',
      prompt: 'Was meint „Gesunderhaltung der Ausscheidungsorgane“ im Alltag?',
      answer: 'Risiken meiden (Rauch, UV) und den Körper pfleglich behandeln',
      wrong: [
        'Organe absichtlich schädigen',
        'Nur auf Zufall hoffen ohne Wissen',
        'Lehrplan-Inhalte ignorieren als Strategie',
      ],
      explanation: 'Verantwortungsbereitschaft.',
      wissen: fw(
        'Kenntnisse über Rauchen, UV und Organspende sollen zu begründeten Entscheidungen für die eigene und fremde Gesundheit führen.',
      ),
    },
  ],
  pairs: [
    { concept: 'bio:k7:orgschutz:p:rauch', term: 'Rauchen', meaning: 'Schädigt Atemwege und Lunge', wissen: 'Schadstoffe, Krebsrisiko.' },
    { concept: 'bio:k7:orgschutz:p:passiv', term: 'Passivrauchen', meaning: 'Schadstoffaufnahme ohne selbst zu rauchen', wissen: 'Fremdgefährdung.' },
    { concept: 'bio:k7:orgschutz:p:uv', term: 'UV-Strahlung', meaning: 'Risikofaktor für Hautkrebs', wissen: 'Sonne/Solarium.' },
    { concept: 'bio:k7:orgschutz:p:schutz', term: 'Sonnenschutz', meaning: 'Kleidung, Schatten, Creme', wissen: 'Prävention.' },
    { concept: 'bio:k7:orgschutz:p:spende', term: 'Organspende', meaning: 'Spende von Organen zur Transplantation', wissen: 'Ethisch geregelt.' },
    { concept: 'bio:k7:orgschutz:p:einwill', term: 'Einwilligung', meaning: 'Informierte Zustimmung', wissen: 'Zentral für Ethik.' },
    { concept: 'bio:k7:orgschutz:p:flimmer', term: 'Flimmerhärchen', meaning: 'Reinigen Atemwege', wissen: 'Durch Rauch gestört.' },
    { concept: 'bio:k7:orgschutz:p:mal', term: 'Hautmal-Kontrolle', meaning: 'Veränderungen beobachten', wissen: 'Früherkennung.' },
    { concept: 'bio:k7:orgschutz:p:bewegung', term: 'Bewegung', meaning: 'Unterstützt Herz, Kreislauf und Atmung', wissen: 'Gesunderhaltung.' },
    { concept: 'bio:k7:orgschutz:p:praevention', term: 'Prävention', meaning: 'Vorbeugung von Schäden', wissen: 'Risiken meiden.' },
  ],
  trueFalse: [
    {
      concept: 'bio:k7:orgschutz:tf-rauch',
      statement: 'Rauchen ist für die Lunge unbedenklich.',
      correct: false,
      explanation: 'Rauch schädigt Atemwege und erhöht Krankheitsrisiken.',
      wissen: fw(
        'Tabakrauch enthält gesundheitsschädliche Stoffe. Langfristig steigen Risiken für chronische Lungenerkrankungen und Krebs.',
      ),
    },
    {
      concept: 'bio:k7:orgschutz:tf-uv',
      statement: 'Übermäßige UV-Belastung ohne Schutz kann Hautkrebsrisiko erhöhen.',
      correct: true,
      explanation: 'UV schädigt Erbgut in Hautzellen.',
      wissen: fw(
        'UV-Strahlung kann DNA in Hautzellen verändern. Schutzmaßnahmen senken das Hautkrebsrisiko.',
      ),
    },
  ],
  multis: [
    {
      concept: 'bio:k7:orgschutz:multi',
      question: 'Was gehört zur Gesunderhaltung der Ausscheidungs-/Atmungsorgane?',
      correct: ['Rauchverzicht', 'UV-Schutz der Haut', 'Informierte Haltung zur Organspende'],
      wrong: ['Absichtliches Einatmen von Schadstoffen', 'Ignorieren jeder Sonnenschutzempfehlung'],
      explanation: 'Prävention und ethische Abwägung.',
      wissen: fw(
        'Gesunderhaltung umfasst Rauchverzicht, UV-Schutz der Haut und eine informierte, ethisch begründete Haltung zur Organspende.',
      ),
    },
  ],
}

export const BIOLOGIE_K7_ATMUNG_GENERATORS: Record<string, Topic['generate']> = {
  'bi-k7-lb3-atmung': bankGenerate(atmungUeberblick),
  'bi-k7-lb3-lunge': bankGenerate(lungeBau),
  'bi-k7-lb3-gasaustausch': bankGenerate(gasaustausch),
  'bi-k7-lb3-atemmechanik': bankGenerate(atemmechanik),
  'bi-k7-lb3-haut-niere': bankGenerate(hautNiere),
  'bi-k7-lb3-organe-schutz': bankGenerate(organeSchutz),
}
