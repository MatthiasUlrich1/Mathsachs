/**
 * Biologie Klasse 10 — Genetik, Artenvielfalt, Stammesgeschichte des Menschen.
 * Schlaukopf: Vererbung / Evolution → Lehrplan LB1–3.
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

const genetik: BioBank = {
  quelle: 'Wikipedia: Genetik',
  url: 'https://de.wikipedia.org/wiki/Genetik',
  facts: [
    {
      prompt: 'Was ist ein Gen vereinfacht?',
      answer: 'Abschnitt der DNA mit Information für ein Merkmal/Protein',
      wrong: ['Ein Knochenstück', 'Ein Blatt ohne Zellkern', 'Nur ein Hormon ohne DNA'],
      explanation: 'Gene sind Erbeinheiten auf der DNA.',
      wissen: 'Grundlagen der Genetik.',
      gap: 'Die Erbinformation ist in der ___ gespeichert.',
      gapAccepted: ['DNA', 'DNS', 'DNA/DNS'],
    },
    {
      prompt: 'Was besagt Mendels Spaltungsregel grob?',
      answer: 'Bei Heterozygoten spalten Nachkommen in bestimmten Zahlenverhältnissen auf',
      wrong: ['Alle Nachkommen sind immer identisch ohne Ausnahme', 'DNA existiert nicht', 'Nur Umwelt erbt'],
      explanation: 'Klassische Mendelsche Regeln — Schulmodell.',
      wissen: 'Vererbung quantitativ betrachten.',
    },
    {
      prompt: 'Chromosomen sind …',
      answer: 'Strukturen, in denen DNA im Zellkern organisiert ist',
      wrong: ['Nur Fetttröpfchen im Blut', 'Nur Spaltöffnungen', 'Nur Federn'],
      explanation: 'Mensch: 46 Chromosomen in Körperzellen (Schulwissen).',
      wissen: 'Zelluläre Grundlagen der Vererbung.',
      gap: 'Der Mensch hat in Körperzellen typischerweise ___ Chromosomen.',
      gapAccepted: ['46', '46 Chromosomen'],
    },
    {
      prompt: 'Mutation bedeutet …',
      answer: 'Veränderung der Erbinformation',
      wrong: ['Immer sofortige Heilung', 'Nur Verdauung', 'Nur Transpiration'],
      explanation: 'Mutationen können neutral, schädlich oder (selten) vorteilhaft sein.',
      wissen: 'Variation als Basis der Evolution.',
    },
  ],
  pairs: [
    { term: 'Allel', meaning: 'Ausprägungsform eines Gens', wissen: 'z. B. dominant/rezessiv im Schulmodell.' },
    { term: 'Genotyp', meaning: 'Genetische Ausstattung', wissen: 'Was in den Genen steht.' },
    { term: 'Phänotyp', meaning: 'Erscheinungsbild', wissen: 'Was man sieht / messen kann.' },
    { term: 'DNA', meaning: 'Träger der Erbinformation', wissen: 'Doppelhelix.' },
  ],
  trueFalse: [
    {
      statement: 'Der Phänotyp wird nur von Genen bestimmt, nie von der Umwelt.',
      correct: false,
      explanation: 'Umwelt und Gene wirken oft zusammen.',
      wissen: 'Anlage und Umwelt.',
    },
  ],
  sorts: [
    {
      question: 'Ordne vom großen zum kleinen Informationspaket (vereinfacht).',
      labels: ['Zellkern', 'Chromosom', 'Gen', 'Basenpaar-Information'],
      explanation: 'Hierarchie der Erbinformation.',
      wissen: 'Strukturverständnis.',
    },
  ],
  multis: [
    {
      question: 'Welche Aussagen zur DNA stimmen?',
      correct: ['Sie trägt Erbinformation', 'Sie liegt vor allem im Zellkern'],
      wrong: ['Sie ist identisch mit Magensäure', 'Sie ist nur in den Wurzeln von Tieren'],
      explanation: 'DNA im Kern (plus etwas in Mitochondrien — hier Schulkern).',
      wissen: 'Basiswissen.',
    },
  ],
}

const artenvielfalt: BioBank = {
  quelle: 'Wikipedia: Evolution',
  url: 'https://de.wikipedia.org/wiki/Evolution',
  facts: [
    {
      prompt: 'Was bedeutet natürliche Selektion?',
      answer: 'Individuen mit vorteilhaften Merkmalen hinterlassen im Mittel mehr Nachkommen',
      wrong: ['Alle Individuen überleben immer gleich', 'Merkmale entstehen durch Wunsch allein', 'Evolution stoppt bei Pflanzen'],
      explanation: 'Variation + Selektion → Anpassung über Generationen.',
      wissen: 'Entstehung der Artenvielfalt.',
      gap: 'Darwin erklärte Anpassung u. a. durch natürliche ___.',
      gapAccepted: ['Selektion', 'Auslese'],
    },
    {
      prompt: 'Was ist eine Art im biologischen Konzept (vereinfacht)?',
      answer: 'Gruppe, die untereinander fruchtbare Nachkommen erzeugen kann',
      wrong: ['Nur Tiere gleicher Farbe', 'Nur Pflanzen gleicher Höhe', 'Nur Fossilien'],
      explanation: 'Biospezies-Konzept als Schulmodell.',
      wissen: 'Artbegriff und Vielfalt.',
    },
    {
      prompt: 'Fossilien helfen …',
      answer: 'vergangene Lebewesen und Veränderungen zu belegen',
      wrong: ['nur den pH-Wert zu messen', 'nur Hormone zu dosieren', 'nur Spaltöffnungen zu zählen'],
      explanation: 'Paläontologische Belege der Evolution.',
      wissen: 'Evidenzen der Evolutionstheorie.',
    },
  ],
  pairs: [
    { term: 'Variation', meaning: 'Unterschiede zwischen Individuen', wissen: 'Voraussetzung für Selektion.' },
    { term: 'Anpassung', meaning: 'Merkmal, das Überleben/Fortpflanzung begünstigt', wissen: 'Ergebnis langfristiger Selektion.' },
    { term: 'Isolation', meaning: 'Unterbindet Genfluss zwischen Populationen', wissen: 'Kann Artbildung fördern.' },
  ],
  trueFalse: [
    {
      statement: 'Evolution bedeutet, dass Einzeltiere sich zu Lebzeiten willentlich umbauen.',
      correct: false,
      explanation: 'Evolution wirkt über Generationen an Populationen.',
      wissen: 'Häufiges Missverständnis.',
    },
  ],
  sorts: [
    {
      question: 'Ordne den vereinfachten Ablauf der Anpassung durch Selektion.',
      labels: ['Variation in der Population', 'Unterschiedlicher Fortpflanzungserfolg', 'Häufigere vorteilhafte Allele', 'Angepasstheit der Population'],
      explanation: 'Variation → Selektion → genetischer Wandel.',
      wissen: 'Prozessverständnis.',
    },
  ],
  multis: [
    {
      question: 'Welche Faktoren können Evolution beeinflussen?',
      correct: ['Mutation', 'Selektion', 'Gendrift'],
      wrong: ['Nur der Wochentag', 'Nur die Schulklingel'],
      explanation: 'Evolutionsfaktoren im Überblick.',
      wissen: 'Theorie der Artenvielfalt.',
    },
  ],
}

const mensch: BioBank = {
  quelle: 'Wikipedia: Stammesgeschichte des Menschen',
  url: 'https://de.wikipedia.org/wiki/Stammesgeschichte_des_Menschen',
  facts: [
    {
      prompt: 'Was bedeutet „Homininen“ grob im Unterricht?',
      answer: 'Gruppe der Menschenartigen in der Stammesgeschichte',
      wrong: ['Nur heutige Insekten', 'Nur Farne', 'Nur Fische ohne Ausnahme'],
      explanation: 'Fossilbelege zeichnen die Entwicklung des Menschen nach.',
      wissen: 'Stammesgeschichte des Menschen.',
    },
    {
      prompt: 'Welches Merkmal wird oft mit dem aufrechten Gang verbunden?',
      answer: 'Freie Hände / zweibeinige Fortbewegung',
      wrong: ['Kiemenatmung dauerhaft', 'Fotosynthese der Haut', 'Sechs Beine'],
      explanation: 'Bipedie ist ein zentrales Merkmal der Homininen-Linie.',
      wissen: 'Vergleichende Anatomie.',
      gap: 'Der Mensch bewegt sich typischerweise ___ fort.',
      gapAccepted: ['zweibeinig', 'aufrecht', 'biped'],
    },
    {
      prompt: 'Kultur und Werkzeuggebrauch …',
      answer: 'prägen die menschliche Entwicklung mit',
      wrong: ['spielen biologisch keine Rolle', 'ersetzen die DNA vollständig', 'löschen Fossilien'],
      explanation: 'Biologie und Kulturgeschichte hängen zusammen.',
      wissen: 'Mensch als bio-kulturelles Wesen.',
    },
  ],
  pairs: [
    { term: 'Fossil', meaning: 'Erhaltene Reste früherer Lebewesen', wissen: 'Zeitliche Einordnung.' },
    { term: 'Bipedie', meaning: 'Aufrechter zweibeiniger Gang', wissen: 'Merkmal der Homininen.' },
    { term: 'Schädelkapazität', meaning: 'Hirnschädelvolumen', wissen: 'Vergleichbare Messgröße.' },
  ],
  trueFalse: [
    {
      statement: 'Der moderne Mensch stammt von heute lebenden Schimpansen ab.',
      correct: false,
      explanation: 'Menschen und Schimpansen teilen gemeinsame Vorfahren — keine direkte Abstammung „vom Schimpansen“.',
      wissen: 'Korrektes Evolutionsverständnis.',
    },
  ],
  sorts: [
    {
      question: 'Ordne grob (sehr vereinfachtes Schulmodell) frühe → späte Stationen.',
      labels: ['Frühe Homininen', 'Werkzeugkulturen', 'Anatomisch moderner Mensch'],
      explanation: 'Stark vereinfachte Reihung für Orientierung — Details im Unterricht.',
      wissen: 'Zeitleiste als Modell.',
    },
  ],
}

const leben: BioBank = {
  quelle: 'Wikipedia: Chemische Evolution',
  url: 'https://de.wikipedia.org/wiki/Chemische_Evolution',
  facts: [
    {
      prompt: 'Was meint „chemische Evolution“ grob?',
      answer: 'Entstehung komplexer Moleküle vor dem Leben',
      wrong: ['Sofortige Städtebildung', 'Nur heutige Vogelzüge', 'Nur Knochenbruch'],
      explanation: 'Hypothesen zur Entstehung des Lebens — Wahlbereich.',
      wissen: 'Entstehung des Lebens auf der Erde.',
    },
  ],
  trueFalse: [
    {
      statement: 'Es gibt genau ein einziges, vollständig bewiesenes Rezept „Leben in 5 Minuten“.',
      correct: false,
      explanation: 'Es gibt Modelle und Experimente — offene Forschung.',
      wissen: 'Wissenschaftliches Denken.',
    },
  ],
}

const lernen: BioBank = {
  quelle: 'Wikipedia: Gedächtnis',
  url: 'https://de.wikipedia.org/wiki/Ged%C3%A4chtnis',
  facts: [
    {
      prompt: 'Was beschreibt Lernen biologisch grob?',
      answer: 'Veränderung von Verhalten/Verbindungen durch Erfahrung',
      wrong: ['Nur Fotosynthese', 'Nur Knochenwachstum ohne Nerven', 'Nur Gärung'],
      explanation: 'Nervensystem speichert und nutzt Erfahrungen.',
      wissen: 'Wahl: Lernen und Gedächtnis.',
    },
  ],
  pairs: [
    { term: 'Kurzzeitgedächtnis', meaning: 'Begrenzte, kurze Speicherung', wissen: 'Arbeitsgedächtnis.' },
    { term: 'Langzeitgedächtnis', meaning: 'Längerfristige Speicherung', wissen: 'Durch Wiederholung gestützt.' },
  ],
  trueFalse: [
    {
      statement: 'Schlaf kann Gedächtnisprozesse unterstützen.',
      correct: true,
      explanation: 'Konsolidierung oft während des Schlafs.',
      wissen: 'Alltagsbezug.',
    },
  ],
}

export const BIOLOGIE_K10_GENERATORS: Record<string, Topic['generate']> = {
  'bi-k10-lb1-genetik': bankGenerate(genetik),
  'bi-k10-lb2-artenvielfalt': bankGenerate(artenvielfalt),
  'bi-k10-lb3-mensch': bankGenerate(mensch),
  'bi-k10-lbw-leben': bankGenerate(leben),
  'bi-k10-lbw-lernen': bankGenerate(lernen),
}
