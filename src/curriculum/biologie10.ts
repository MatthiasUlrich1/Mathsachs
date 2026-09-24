/**
 * Biologie Klasse 10 — Genetik, Artenvielfalt, Stammesgeschichte des Menschen.
 * Fachwissen = reine Fakten zur jeweiligen Frage.
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

const genetik: BioBank = {
  quelle: 'Wikipedia: Genetik',
  url: 'https://de.wikipedia.org/wiki/Genetik',
  conceptPrefix: 'bio:k10:genetik',
  facts: [
    {
      concept: 'bio:k10:genetik:was-ist',
      prompt: 'Womit beschäftigt sich die Genetik im Überblick?',
      answer: 'Mit Vererbung und der Weitergabe von Erbinformation',
      wrong: ['Nur mit Jahresringen am Baum', 'Nur mit Magensäure', 'Nur mit Flugfedern'],
      explanation: 'Genetik = Lehre von der Vererbung.',
      wissen:
        'Genetik untersucht Vererbung und die Weitergabe von Erbinformation. DNA-Bau und Chromosomen → Spezial DNA; Kreuzungsregeln → Mendel.',
    },
    {
      concept: 'bio:k10:mutation-bedeutet',
      prompt: 'Mutation bedeutet …',
      answer: 'Veränderung der Erbinformation',
      wrong: ['Immer sofortige Heilung', 'Nur Verdauung', 'Nur Transpiration'],
      explanation: 'Mutationen erzeugen Variation.',
      wissen:
        'Eine Mutation ist eine Veränderung der Erbinformation. Sie erzeugt Variation — Grundlage für Selektion in der Evolution.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k10:genetik:paar-vererbung',
      term: 'Vererbung',
      meaning: 'Weitergabe von Merkmalen an Nachkommen',
      wissen: 'Zentrale Fragestellung der Genetik — Merkmale und Erbinformation an Nachkommen.',
    },
    {
      concept: 'bio:k10:genetik:paar-mutation',
      term: 'Mutation',
      meaning: 'Veränderung der Erbinformation',
      wissen: 'Quelle neuer Variation in Populationen und damit Ausgangspunkt der Evolution.',
    },
    {
      concept: 'bio:k10:genetik:paar-variation',
      term: 'Variation',
      meaning: 'Unterschiede zwischen Individuen',
      wissen: 'Unterschiede in Merkmalen und Allelen — Voraussetzung dafür, dass Selektion wirken kann.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k10:der-phaenotyp-wird-nur-von-genen-bestimm',
      statement: 'Der Phänotyp wird nur von Genen bestimmt, nie von der Umwelt.',
      correct: false,
      explanation: 'Umwelt und Gene wirken oft zusammen.',
      wissen:
        'Phänotyp entsteht aus Genotyp und Umwelt: Ernährung, Licht und Lernen beeinflussen das Erscheinungsbild mit.',
    },
  ],
  multis: [
    {
      concept: 'bio:k10:genetik:multi-ueberblick',
      question: 'Welche Themen gehören zur Genetik im Überblick?',
      correct: ['Vererbung', 'Mutation'],
      wrong: ['Nur Verkehrszeichen lesen', 'Nur Blattgrün messen'],
      explanation: 'Vererbung und Veränderung der Erbinformation.',
      wissen:
        'Zur Genetik gehören Vererbung und Mutation; DNA-Feinbau und Mendel-Regeln stehen in den Spezialthemen.',
    },
  ],
}

const artenvielfalt: BioBank = {
  quelle: 'Wikipedia: Evolution',
  url: 'https://de.wikipedia.org/wiki/Evolution',
  conceptPrefix: 'bio:k10:artenvielfalt',
  facts: [
    {
      concept: 'bio:k10:was-ist-eine-art-im-biologischen-konzept',
      prompt: 'Was ist eine Art im biologischen Konzept (vereinfacht)?',
      answer: 'Gruppe, die untereinander fruchtbare Nachkommen erzeugen kann',
      wrong: ['Nur Tiere gleicher Farbe', 'Nur Pflanzen gleicher Höhe', 'Nur Fossilien'],
      explanation: 'Biospezies-Konzept als Schulmodell.',
      wissen:
        'Biologisches Artkonzept: Individuen können untereinander fruchtbare Nachkommen erzeugen. Selektion → Spezial.',
    },
    {
      concept: 'bio:k10:fossilien-helfen',
      prompt: 'Fossilien helfen …',
      answer: 'vergangene Lebewesen und Veränderungen zu belegen',
      wrong: ['nur den pH-Wert zu messen', 'nur Hormone zu dosieren', 'nur Spaltöffnungen zu zählen'],
      explanation: 'Paläontologische Belege der Evolution.',
      wissen: 'Fossilien belegen frühere Lebewesen und Veränderungen.',
    },
    {
      concept: 'bio:k10:artenvielfalt:bedeutung',
      prompt: 'Warum ist Artenvielfalt wichtig?',
      answer: 'Stabilität und Leistungen von Ökosystemen hängen oft von Vielfalt ab',
      wrong: ['Weil nur eine Art übrig bleiben soll', 'Weil Mutation verboten ist', 'Weil Selektion nie wirkt'],
      explanation: 'Vielfalt stützt Ökosystemfunktionen.',
      wissen: 'Artenvielfalt trägt zur Stabilität und Nutzbarkeit von Ökosystemen bei.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k10:arten:paar-art',
      term: 'Art',
      meaning: 'Grundeinheit der biologischen Systematik',
      wissen: 'Biospezies-Konzept als Schulmodell.',
    },
    {
      concept: 'bio:k10:arten:paar-fossil',
      term: 'Fossil',
      meaning: 'Beleg früherer Lebewesen',
      wissen: 'Wichtige Evidenz der Evolution.',
    },
    {
      concept: 'bio:k10:arten:paar-vielfalt',
      term: 'Artenvielfalt',
      meaning: 'Viele verschiedene Arten in einem Gebiet',
      wissen: 'Biodiversität — Grundlage stabiler Ökosysteme.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k10:evolution-bedeutet-dass-einzeltiere-sich',
      statement: 'Evolution bedeutet, dass Einzeltiere sich zu Lebzeiten willentlich umbauen.',
      correct: false,
      explanation: 'Evolution wirkt über Generationen an Populationen.',
      wissen: 'Evolution wirkt an Populationen über Generationen.',
    },
  ],
  multis: [
    {
      concept: 'bio:k10:arten:multi',
      question: 'Welche Aussagen zur Artenvielfalt / Evolution passen im Überblick?',
      correct: ['Fossilien belegen Veränderungen', 'Arten können sich über Generationen wandeln'],
      wrong: ['Einzeltiere bauen sich willentlich um', 'Mutation ist unmöglich'],
      explanation: 'Überblick; Selektion und Anpassung → Spezial.',
      wissen: 'Selektion und Anpassung werden im Spezialthema vertieft.',
    },
  ],
}

const mensch: BioBank = {
  quelle: 'Wikipedia: Stammesgeschichte des Menschen',
  url: 'https://de.wikipedia.org/wiki/Stammesgeschichte_des_Menschen',
  facts: [
    {
      concept: 'bio:k10:was-bedeutet-homininen-grob-im-unterrich',
      prompt: 'Was bedeutet „Homininen“ grob im Unterricht?',
      answer: 'Gruppe der Menschenartigen in der Stammesgeschichte',
      wrong: ['Nur heutige Insekten', 'Nur Farne', 'Nur Fische ohne Ausnahme'],
      explanation: 'Fossilbelege zeichnen die Entwicklung des Menschen nach.',
      wissen:
        'Homininen bezeichnen die Gruppe der Menschenartigen in der Stammesgeschichte — Fossilien belegen Stationen der Entwicklung.',
    },
    {
      concept: 'bio:k10:welches-merkmal-wird-oft-mit-dem-aufrech',
      prompt: 'Welches Merkmal wird oft mit dem aufrechten Gang verbunden?',
      answer: 'Freie Hände / zweibeinige Fortbewegung',
      wrong: ['Kiemenatmung dauerhaft', 'Fotosynthese der Haut', 'Sechs Beine'],
      explanation: 'Bipedie ist ein zentrales Merkmal der Homininen-Linie.',
      wissen:
        'Bipedie (aufrechter zweibeiniger Gang) ist ein zentrales Merkmal der Homininen — die Hände werden für andere Tätigkeiten frei.',
      gap: 'Der Mensch bewegt sich typischerweise ___ fort.',
      gapAccepted: ['zweibeinig', 'aufrecht', 'biped'],
    },
    {
      concept: 'bio:k10:kultur-und-werkzeuggebrauch',
      prompt: 'Kultur und Werkzeuggebrauch …',
      answer: 'prägen die menschliche Entwicklung mit',
      wrong: ['spielen biologisch keine Rolle', 'ersetzen die DNA vollständig', 'löschen Fossilien'],
      explanation: 'Biologie und Kulturgeschichte hängen zusammen.',
      wissen:
        'Werkzeuggebrauch und Kultur prägen die menschliche Entwicklung mit — biologische und kulturelle Evolution greifen ineinander.',
    },
  ],
  pairs: [
    {
      term: 'Fossil',
      meaning: 'Erhaltene Reste früherer Lebewesen',
      wissen: 'Fossilien sind erhaltene Reste oder Spuren früherer Lebewesen und erlauben zeitliche Einordnung.',
    },
    {
      term: 'Bipedie',
      meaning: 'Aufrechter zweibeiniger Gang',
      wissen: 'Aufrechter Gang auf zwei Beinen — typisches Merkmal der Homininen-Linie.',
    },
    {
      term: 'Schädelkapazität',
      meaning: 'Hirnschädelvolumen',
      wissen: 'Volumen des Hirnschädels — vergleichbare Messgröße in der Stammesgeschichte.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k10:der-moderne-mensch-stammt-von-heute-lebe',
      statement: 'Der moderne Mensch stammt von heute lebenden Schimpansen ab.',
      correct: false,
      explanation: 'Menschen und Schimpansen teilen gemeinsame Vorfahren — keine direkte Abstammung „vom Schimpansen“.',
      wissen:
        'Mensch und Schimpanse teilen gemeinsame Vorfahren. Der moderne Mensch stammt nicht von heutigen Schimpansen ab.',
    },
  ],
  sorts: [
    {
      concept: 'bio:k10:ordne-grob-sehr-vereinfachtes-schulmodel',
      question: 'Ordne grob (sehr vereinfachtes Schulmodell) frühe → späte Stationen.',
      labels: ['Frühe Homininen', 'Werkzeugkulturen', 'Anatomisch moderner Mensch'],
      explanation: 'Stark vereinfachte Reihung für Orientierung — Details im Unterricht.',
      wissen:
        'Vereinfachte Reihung: frühe Homininen → Werkzeugkulturen → anatomisch moderner Mensch (Details sind komplexer).',
    },
  ],
}

const leben: BioBank = {
  quelle: 'Wikipedia: Chemische Evolution',
  url: 'https://de.wikipedia.org/wiki/Chemische_Evolution',
  facts: [
    {
      concept: 'bio:k10:was-meint-chemische-evolution-grob',
      prompt: 'Was meint „chemische Evolution“ grob?',
      answer: 'Entstehung komplexer Moleküle vor dem Leben',
      wrong: ['Sofortige Städtebildung', 'Nur heutige Vogelzüge', 'Nur Knochenbruch'],
      explanation: 'Hypothesen zur Entstehung des Lebens — Wahlbereich.',
      wissen:
        'Chemische Evolution meint die Entstehung immer komplexerer organischer Moleküle auf der frühen Erde — vor dem eigentlichen Leben.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k10:es-gibt-genau-ein-einziges-vollstaendig-',
      statement: 'Es gibt genau ein einziges, vollständig bewiesenes Rezept „Leben in 5 Minuten“.',
      correct: false,
      explanation: 'Es gibt Modelle und Experimente — offene Forschung.',
      wissen:
        'Zur Entstehung des Lebens gibt es Modelle und Experimente, aber kein einziges vollständig abgeschlossenes „Rezept“.',
    },
  ],
}

const lernen: BioBank = {
  quelle: 'Wikipedia: Gedächtnis',
  url: 'https://de.wikipedia.org/wiki/Ged%C3%A4chtnis',
  facts: [
    {
      concept: 'bio:k10:was-beschreibt-lernen-biologisch-grob',
      prompt: 'Was beschreibt Lernen biologisch grob?',
      answer: 'Veränderung von Verhalten/Verbindungen durch Erfahrung',
      wrong: ['Nur Fotosynthese', 'Nur Knochenwachstum ohne Nerven', 'Nur Gärung'],
      explanation: 'Nervensystem speichert und nutzt Erfahrungen.',
      wissen:
        'Lernen bedeutet biologisch: Verhalten und neuronale Verbindungen verändern sich durch Erfahrung — das Nervensystem speichert und nutzt das.',
    },
  ],
  pairs: [
    {
      term: 'Kurzzeitgedächtnis',
      meaning: 'Begrenzte, kurze Speicherung',
      wissen: 'Hält wenige Informationen kurzfristig bereit (Arbeitsgedächtnis) — Kapazität und Dauer sind begrenzt.',
    },
    {
      term: 'Langzeitgedächtnis',
      meaning: 'Längerfristige Speicherung',
      wissen: 'Speichert Informationen längerfristig; Wiederholung und Schlaf unterstützen die Konsolidierung.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k10:schlaf-kann-gedaechtnisprozesse-unterstu',
      statement: 'Schlaf kann Gedächtnisprozesse unterstützen.',
      correct: true,
      explanation: 'Konsolidierung oft während des Schlafs.',
      wissen:
        'Während des Schlafs werden Gedächtnisinhalte oft konsolidiert — Schlaf unterstützt Lernen und Erinnern.',
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
