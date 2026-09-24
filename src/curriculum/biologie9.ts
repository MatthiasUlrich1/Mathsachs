/**
 * Biologie Klasse 9 — Pflanzenphysiologie & Ökosystem (Lehrplan 522).
 * Schlaukopf-Themen Fotosynthese / Ökosystem Wald·Gewässer → hier LB1/LB2.
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

const pflanzen: BioBank = {
  quelle: 'Wikipedia: Fotosynthese',
  url: 'https://de.wikipedia.org/wiki/Fotosynthese',
  facts: [
    {
      concept: 'bio:k9:was-ist-die-vereinfachte-wortgleichung-d',
      prompt: 'Was ist die vereinfachte Wortgleichung der Fotosynthese?',
      answer: 'Kohlenstoffdioxid + Wasser → Glucose + Sauerstoff (mit Licht)',
      wrong: ['Nur Stickstoff → Gold', 'Eiweiß → Licht', 'Knochen → Blut'],
      explanation: 'Lichtenergie wird in chemische Energie (Zucker) überführt; O₂ entsteht.',
      wissen: 'Kern der Pflanzenphysiologie in Klasse 9.',
      gap: 'Bei der Fotosynthese entsteht neben Zucker auch ___.',
      gapAccepted: ['Sauerstoff', 'O2', 'O₂'],
    },
    {
      concept: 'bio:k9:wo-findet-die-fotosynthese-in-der-zelle-',
      prompt: 'Wo findet die Fotosynthese in der Zelle statt?',
      answer: 'In den Chloroplasten',
      wrong: ['Nur in den Mitochondrien', 'Nur im Zellkern', 'Nur in den Knochen'],
      explanation: 'Chlorophyll in Chloroplasten fängt Licht.',
      wissen: 'Anatomie und Physiologie der Samenpflanzen.',
    },
    {
      concept: 'bio:k9:was-ist-transpiration',
      prompt: 'Was ist Transpiration?',
      answer: 'Abgabe von Wasserdampf über die Spaltöffnungen',
      wrong: ['Aufnahme von Knochenkalk', 'Bildung von Antikörpern', 'Nur Blutpumpung'],
      explanation: 'Transpiration treibt den Wasserstrom mit an.',
      wissen: 'Wasserhaushalt der Pflanze.',
      gap: 'Wasser steigt in Leitungsbahnen nach oben; Austritt oft als ___ an Blättern.',
      gapAccepted: ['Wasserdampf', 'Transpiration', 'Dampf'],
    },
    {
      concept: 'bio:k9:xylem-transportiert-vor-allem',
      prompt: 'Xylem transportiert vor allem …',
      answer: 'Wasser und Mineralstoffe nach oben',
      wrong: ['Nur Asssimilate abwärts ausschließlich als Knochen', 'Nur Nervensignale', 'Nur Hormone im Menschen'],
      explanation: 'Xylem = Holzteil; Phloem = Siebteil (Assimilattransport).',
      wissen: 'Leitgewebe der Samenpflanzen.',
    },
  ],
  pairs: [
    { term: 'Chlorophyll', meaning: 'Grüner Blattfarbstoff', wissen: 'Fängt Lichtenergie.' },
    { term: 'Phloem', meaning: 'Transport von Assimilaten', wissen: 'Siebteil.' },
    { term: 'Xylem', meaning: 'Wasserleitung', wissen: 'Holzteil.' },
    { term: 'Spaltöffnung', meaning: 'Reguliert Gasaustausch', wissen: 'Öffnen/Schließen steuerbar.' },
  ],
  trueFalse: [
    {
      concept: 'bio:k9:pflanzen-brauchen-fuer-die-fotosynthese-',
      statement: 'Pflanzen brauchen für die Fotosynthese Licht, CO₂ und Wasser.',
      correct: true,
      explanation: 'Das sind die klassischen Voraussetzungen.',
      wissen: 'Grundgleichung.',
    },
    {
      concept: 'bio:k9:fotosynthese-findet-nur-in-den-wurzeln-s',
      statement: 'Fotosynthese findet nur in den Wurzeln statt.',
      correct: false,
      explanation: 'Vor allem in grünen Blättern (Chloroplasten).',
      wissen: 'Ort der Fotosynthese.',
    },
  ],
  sorts: [
    {
      concept: 'bio:k9:ordne-den-weg-des-wassers-in-der-pflanze',
      question: 'Ordne den Weg des Wassers in der Pflanze grob.',
      labels: ['Aufnahme in der Wurzel', 'Transport im Spross', 'Verdunstung am Blatt'],
      explanation: 'Boden → Leitbahnen → Transpiration.',
      wissen: 'Wasserstrom.',
    },
  ],
  multis: [
    {
      concept: 'bio:k9:welche-faktoren-beeinflussen-die-fotosyn',
      question: 'Welche Faktoren beeinflussen die Fotosynthese?',
      correct: ['Licht', 'CO₂-Angebot', 'Temperatur'],
      wrong: ['Nur Mondphase ohne Licht', 'Nur Verkehrsrauschen'],
      explanation: 'Abiotische Faktoren limitieren die Rate.',
      wissen: 'Physiologie vertiefen.',
    },
  ],
}

const oekosystem: BioBank = {
  quelle: 'Wikipedia: Ökosystem',
  url: 'https://de.wikipedia.org/wiki/%C3%96kosystem',
  facts: [
    {
      concept: 'bio:k9:was-ist-ein-oekosystem',
      prompt: 'Was ist ein Ökosystem?',
      answer: 'Lebensgemeinschaft + Lebensraum in Wechselwirkung',
      wrong: ['Nur eine einzelne Zelle', 'Nur ein Mineral ohne Leben', 'Nur ein Knochen'],
      explanation: 'Biozönose und Biotop bilden das Ökosystem.',
      wissen: 'Zusammenhänge im Ökosystem — LB2.',
      gap: 'Produzenten, Konsumenten und ___ bilden Stoffkreisläufe.',
      gapAccepted: ['Destruenten', 'Zersetzer', 'Destruenten/Zersetzer'],
    },
    {
      concept: 'bio:k9:was-beschreibt-einen-stoffkreislauf-z-b-',
      prompt: 'Was beschreibt einen Stoffkreislauf (z. B. Kohlenstoff)?',
      answer: 'Stoffe werden zwischen Umwelt und Lebewesen umgewälzt',
      wrong: ['Stoffe verschwinden für immer spurlos', 'Nur einmalige Einbahn ohne Rückkehr', 'Nur Sternenlicht ohne Erde'],
      explanation: 'z. B. CO₂ ↔ Fotosynthese/Atmung.',
      wissen: 'Stoff- und Energiefluss unterscheiden.',
    },
    {
      concept: 'bio:k9:energie-fliesst-im-oekosystem',
      prompt: 'Energie fließt im Ökosystem …',
      answer: 'von der Sonne über Produzenten zu Konsumenten (und geht als Wärme verloren)',
      wrong: ['Nur von Raubtieren zu Pflanzen rückwärts vollständig', 'Ohne Sonne bei Pflanzen unnötig', 'Nur in Knochen'],
      explanation: 'Energie wird genutzt und dissipiert — kein geschlossener Energiekreislauf wie bei Stoffen.',
      wissen: 'Wichtiges Konzept.',
    },
  ],
  pairs: [
    { term: 'Biotop', meaning: 'Lebensraum', wissen: 'Abiotische Bedingungen.' },
    { term: 'Biozönose', meaning: 'Lebensgemeinschaft', wissen: 'Alle Arten am Ort.' },
    { term: 'Nahrungsnetz', meaning: 'Vernetzte Freßbeziehungen', wissen: 'Realistischer als eine Kette.' },
    { term: 'Ökologische Nische', meaning: 'Rolle/Ansprüche einer Art', wissen: 'Mehr als nur „Ort“.' },
  ],
  trueFalse: [
    {
      concept: 'bio:k9:wenn-eine-art-ausfaellt-kann-das-folgen-',
      statement: 'Wenn eine Art ausfällt, kann das Folgen für andere Arten haben.',
      correct: true,
      explanation: 'Vernetzung: Keystone-Effekte und Nahrungsbeziehungen.',
      wissen: 'Interdependenz.',
    },
  ],
  sorts: [
    {
      concept: 'bio:k9:ordne-eine-nahrungskette-im-gewaesser',
      question: 'Ordne eine Nahrungskette im Gewässer.',
      labels: ['Alge', 'Wasserfloh', 'Kleinfisch', 'Raubfisch'],
      explanation: 'Produzent → Konsumenten steigender Ordnung.',
      wissen: 'Schlaukopf „Ökosystem Gewässer“ → Lehrplan Ökosystem.',
    },
  ],
  multis: [
    {
      concept: 'bio:k9:welche-eingriffe-des-menschen-koennen-oe',
      question: 'Welche Eingriffe des Menschen können Ökosysteme belasten?',
      correct: ['Überdüngung', 'Schadstoffeintrag', 'Lebensraumzerstörung'],
      wrong: ['Nur das Beobachten mit Fernglas', 'Nur das Notieren von Artenlisten'],
      explanation: 'Anthropogene Störungen sind Teil des Lernbereichs.',
      wissen: 'Nachhaltigkeit anbahnen.',
    },
  ],
}

const wiese: BioBank = {
  quelle: 'Wikipedia: Wiese',
  url: 'https://de.wikipedia.org/wiki/Wiese',
  facts: [
    {
      concept: 'bio:k9:warum-ist-eine-wiese-artenreich',
      prompt: 'Warum ist eine Wiese artenreich?',
      answer: 'Viele Pflanzen- und Insektenarten teilen den Lebensraum',
      wrong: ['Weil dort nur eine Art lebt', 'Weil es kein Licht gibt', 'Weil es nur Beton gibt'],
      explanation: 'Struktur und Mahd/Beweidung prägen Vielfalt.',
      wissen: 'Wahl: Mikrokosmos Wiese.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k9:intensiv-geduengte-einheitsgrasflaechen-',
      statement: 'Intensiv gedüngte Einheitsgrasflächen sind oft artenärmer als Magerrasen.',
      correct: true,
      explanation: 'Nährstoffreichtum begünstigt wenige Dominanzarten.',
      wissen: 'Vergleich Nutzungsintensität.',
    },
  ],
}

const pilze: BioBank = {
  quelle: 'Wikipedia: Pilze',
  url: 'https://de.wikipedia.org/wiki/Pilze',
  facts: [
    {
      concept: 'bio:k9:wie-ernaehren-sich-die-meisten-pilze',
      prompt: 'Wie ernähren sich die meisten Pilze?',
      answer: 'Heterotroph — zersetzen oder parasitieren/symbiotisch',
      wrong: ['Nur durch Fotosynthese mit Chlorophyll wie Blätter', 'Nur durch Lungenatmung', 'Nur durch Blutkreislauf'],
      explanation: 'Pilze sind eigene Gruppe — oft Destruenten oder Symbionten (Mykorrhiza).',
      wissen: 'Wahl: Mannigfaltigkeit der Pilze.',
      gap: 'Pilze haben typischerweise ___ statt Chlorophyll-Fotosynthese.',
      gapAccepted: ['kein Chlorophyll', 'kein Blattgrün', 'Heterotrophie'],
    },
  ],
  pairs: [
    { term: 'Myzel', meaning: 'Fadengeflecht im Boden/Substrat', wissen: 'Eigentlicher Pilzkörper oft unsichtbar.' },
    { term: 'Fruchtkörper', meaning: 'Sichtbarer „Pilz“ zur Sporenbildung', wissen: 'Hutpilze.' },
  ],
  trueFalse: [
    {
      concept: 'bio:k9:alle-wildpilze-sind-essbar',
      statement: 'Alle Wildpilze sind essbar.',
      correct: false,
      explanation: 'Viele sind giftig — nur bekannte Arten, Fachwissen.',
      wissen: 'Sicherheit.',
    },
  ],
}

const bier: BioBank = {
  quelle: 'Wikipedia: Gärung',
  url: 'https://de.wikipedia.org/wiki/G%C3%A4rung',
  facts: [
    {
      concept: 'bio:k9:welche-mikroorganismen-sind-bei-der-alko',
      prompt: 'Welche Mikroorganismen sind bei der alkoholischen Gärung zentral?',
      answer: 'Hefen',
      wrong: ['Nur Greifvögel', 'Nur Säugetiere', 'Nur Farne'],
      explanation: 'Hefe wandelt Zucker u. a. in Ethanol und CO₂ um.',
      wissen: 'Wahl: Von der Gerste zum Bier — Stoffwechselbezug.',
      gap: 'Bei der alkoholischen Gärung entsteht u. a. ___.',
      gapAccepted: ['Ethanol', 'Alkohol', 'Ethanol/CO2', 'Alkohol und CO₂'],
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k9:gaerung-laeuft-ohne-sauerstoff-ab-anaero',
      statement: 'Gärung läuft ohne Sauerstoff ab (anaerob).',
      correct: true,
      explanation: 'Klassische alkoholische Gärung ist anaerob.',
      wissen: 'Vergleich Atmung/Gärung.',
    },
  ],
  sorts: [
    {
      concept: 'bio:k9:ordne-grob-schritte-vom-getreide-zum-bie',
      question: 'Ordne grob Schritte vom Getreide zum Bier (vereinfacht).',
      labels: ['Malzbereitung', 'Maischen', 'Gärung', 'Reifung'],
      explanation: 'Schulmodell der Prozesskette.',
      wissen: 'Anwendung von Stoffwechselwissen.',
    },
  ],
}

export const BIOLOGIE_K9_GENERATORS: Record<string, Topic['generate']> = {
  'bi-k9-lb1-pflanzen': bankGenerate(pflanzen),
  'bi-k9-lb2-oekosystem': bankGenerate(oekosystem),
  'bi-k9-lbw-wiese': bankGenerate(wiese),
  'bi-k9-lbw-pilze': bankGenerate(pilze),
  'bi-k9-lbw-bier': bankGenerate(bier),
}
