/**
 * Biologie Klasse 9 — Pflanzenphysiologie & Ökosystem (Lehrplan 522).
 * Fachwissen = reine Fakten zur jeweiligen Frage.
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

const pflanzen: BioBank = {
  quelle: 'Wikipedia: Fotosynthese',
  url: 'https://de.wikipedia.org/wiki/Fotosynthese',
  conceptPrefix: 'bio:k9:pflanzen',
  facts: [
    {
      concept: 'bio:k9:pflanzen:ueberblick',
      prompt: 'Was leisten Samenpflanzen physiologisch im Überblick?',
      answer: 'Fotosynthese, Stofftransport und Gas-/Wasserhaushalt',
      wrong: ['Nur Knochenbildung', 'Nur Antikörperbildung', 'Nur Nervenleitung wie im Gehirn'],
      explanation: 'Pflanzen bauen Stoffe auf und transportieren Wasser/Assimilate.',
      wissen:
        'Physiologie der Samenpflanzen: Fotosynthese, Wassertransport, Transpiration. Details → Spezialthemen.',
    },
    {
      concept: 'bio:k9:pflanzen-brauchen-fuer-die-fotosynthese-',
      prompt: 'Welche Voraussetzungen brauchen Pflanzen für die Fotosynthese grob?',
      answer: 'Licht, CO₂ und Wasser',
      wrong: ['Nur Mondphase ohne Licht', 'Nur Verkehrsrauschen', 'Nur Knochenkalk'],
      explanation: 'Klassische Voraussetzungen im Überblick.',
      wissen:
        'Fotosynthese braucht Licht, Kohlenstoffdioxid und Wasser — Gleichung und Blattbau → Spezial Fotosynthese.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k9:pflanzen:paar-foto',
      term: 'Fotosynthese',
      meaning: 'Aufbau von Zucker mit Lichtenergie',
      wissen: 'Details und Gleichung → Spezial Fotosynthese.',
    },
    {
      concept: 'bio:k9:pflanzen:paar-transport',
      term: 'Stofftransport',
      meaning: 'Wasser/Mineralstoffe und Assimilate in Leitbahnen',
      wissen: 'Xylem/Phloem und Transpiration → Spezial Wassertransport.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k9:fotosynthese-findet-nur-in-den-wurzeln-s',
      statement: 'Fotosynthese findet nur in den Wurzeln statt.',
      correct: false,
      explanation: 'Vor allem in grünen Blättern (Chloroplasten).',
      wissen: 'Fotosynthese läuft vor allem in grünen Blättern ab.',
    },
    {
      concept: 'bio:k9:pflanzen-brauchen-fuer-die-fotosynthese-tf',
      statement: 'Pflanzen brauchen für die Fotosynthese Licht, CO₂ und Wasser.',
      correct: true,
      explanation: 'Das sind die klassischen Voraussetzungen.',
      wissen: 'Licht, CO₂ und Wasser sind Voraussetzungen der Fotosynthese.',
    },
  ],
  multis: [
    {
      concept: 'bio:k9:pflanzen:multi-ueberblick',
      question: 'Welche Prozesse gehören zur Pflanzenphysiologie im Überblick?',
      correct: ['Fotosynthese', 'Wassertransport'],
      wrong: ['Nur Knochenwachstum', 'Nur Antikörperbildung'],
      explanation: 'Aufbau und Transport sind zentrale Themen.',
      wissen: 'Vertiefung in den Spezialthemen Fotosynthese und Wassertransport.',
    },
  ],
}

const oekosystem: BioBank = {
  quelle: 'Wikipedia: Ökosystem',
  url: 'https://de.wikipedia.org/wiki/%C3%96kosystem',
  conceptPrefix: 'bio:k9:oekosystem',
  facts: [
    {
      concept: 'bio:k9:was-ist-ein-oekosystem',
      prompt: 'Was ist ein Ökosystem?',
      answer: 'Lebensgemeinschaft + Lebensraum in Wechselwirkung',
      wrong: ['Nur eine einzelne Zelle', 'Nur ein Mineral ohne Leben', 'Nur ein Knochen'],
      explanation: 'Biozönose und Biotop bilden das Ökosystem.',
      wissen:
        'Ökosystem = Biozönose + Biotop. Stoffkreisläufe und konkrete Ökosysteme → Spezialthemen.',
    },
    {
      concept: 'bio:k9:oekosystem:nische',
      prompt: 'Was meint die ökologische Nische grob?',
      answer: 'Rolle und Ansprüche einer Art im Ökosystem',
      wrong: ['Nur die Schuhgröße', 'Nur die Haarfarbe', 'Nur der Wochentag'],
      explanation: 'Mehr als nur der Aufenthaltsort.',
      wissen: 'Die Nische umfasst Ansprüche und Rolle einer Art.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k9:oeko:paar-biotop',
      term: 'Biotop',
      meaning: 'Lebensraum',
      wissen: 'Abiotische Bedingungen eines Ortes.',
    },
    {
      concept: 'bio:k9:oeko:paar-biozoenose',
      term: 'Biozönose',
      meaning: 'Lebensgemeinschaft',
      wissen: 'Alle miteinander wechselwirkenden Arten.',
    },
    {
      concept: 'bio:k9:oeko:paar-nische',
      term: 'Ökologische Nische',
      meaning: 'Rolle/Ansprüche einer Art',
      wissen: 'Mehr als nur der Aufenthaltsort.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k9:wenn-eine-art-ausfaellt-kann-das-folgen-',
      statement: 'Wenn eine Art ausfällt, kann das Folgen für andere Arten haben.',
      correct: true,
      explanation: 'Vernetzung: Nahrungsbeziehungen und Abhängigkeiten.',
      wissen: 'Arten sind vernetzt — Ausfall kann andere treffen.',
    },
  ],
  multis: [
    {
      concept: 'bio:k9:oeko:multi-teile',
      question: 'Was gehört zum Ökosystem-Begriff?',
      correct: ['Lebensgemeinschaft', 'Lebensraum'],
      wrong: ['Nur ein einzelnes Gen ohne Umwelt', 'Nur Verkehrszeichen'],
      explanation: 'Biozönose und Biotop gehören zusammen.',
      wissen: 'Wald/Gewässer und Stoffkreisläufe → Spezialthemen.',
    },
  ],
}

const wiese: BioBank = {
  quelle: 'Wikipedia: Wiese',
  url: 'https://de.wikipedia.org/wiki/Wiese',
  conceptPrefix: 'bio:k9:wiese',
  facts: [
    {
      concept: 'bio:k9:warum-ist-eine-wiese-artenreich',
      prompt: 'Warum ist eine Wiese artenreich?',
      answer: 'Viele Pflanzen- und Insektenarten teilen den Lebensraum',
      wrong: ['Weil dort nur eine Art lebt', 'Weil es kein Licht gibt', 'Weil es nur Beton gibt'],
      explanation: 'Struktur und Mahd/Beweidung prägen Vielfalt.',
      wissen:
        'Wiesen bieten vielen Pflanzen- und Insektenarten Lebensraum. Mahd und Beweidung prägen, welche Arten sich etablieren können.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k9:intensiv-geduengte-einheitsgrasflaechen-',
      statement: 'Intensiv gedüngte Einheitsgrasflächen sind oft artenärmer als Magerrasen.',
      correct: true,
      explanation: 'Nährstoffreichtum begünstigt wenige Dominanzarten.',
      wissen:
        'Starke Düngung begünstigt wenige wuchsstarke Gräser — Magerrasen mit weniger Nährstoffen sind oft artenreicher.',
    },
  ],
}

const pilze: BioBank = {
  quelle: 'Wikipedia: Pilze',
  url: 'https://de.wikipedia.org/wiki/Pilze',
  conceptPrefix: 'bio:k9:pilze',
  facts: [
    {
      concept: 'bio:k9:wie-ernaehren-sich-die-meisten-pilze',
      prompt: 'Wie ernähren sich die meisten Pilze?',
      answer: 'Heterotroph — zersetzen oder parasitieren/symbiotisch',
      wrong: ['Nur durch Fotosynthese mit Chlorophyll wie Blätter', 'Nur durch Lungenatmung', 'Nur durch Blutkreislauf'],
      explanation: 'Pilze sind eigene Gruppe — oft Destruenten oder Symbionten (Mykorrhiza).',
      wissen:
        'Pilze sind heterotroph (kein Chlorophyll): sie zersetzen organische Substanz, parasitieren oder leben in Symbiose (z. B. Mykorrhiza).',
      gap: 'Pilze haben typischerweise ___ statt Chlorophyll-Fotosynthese.',
      gapAccepted: ['kein Chlorophyll', 'kein Blattgrün', 'Heterotrophie'],
    },
  ],
  pairs: [
    {
      term: 'Myzel',
      meaning: 'Fadengeflecht im Boden/Substrat',
      wissen: 'Das Myzel ist das oft unsichtbare Fadengeflecht — der eigentliche Pilzkörper im Substrat.',
    },
    {
      term: 'Fruchtkörper',
      meaning: 'Sichtbarer „Pilz“ zur Sporenbildung',
      wissen: 'Fruchtkörper (z. B. Hutpilz) dienen der Sporenbildung und -ausbreitung.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k9:alle-wildpilze-sind-essbar',
      statement: 'Alle Wildpilze sind essbar.',
      correct: false,
      explanation: 'Viele sind giftig — nur bekannte Arten, Fachwissen.',
      wissen:
        'Viele Wildpilze sind giftig. Nur sicher bestimmte, bekannte Arten dürfen gesammelt und gegessen werden.',
    },
  ],
}

const bier: BioBank = {
  quelle: 'Wikipedia: Gärung',
  url: 'https://de.wikipedia.org/wiki/G%C3%A4rung',
  conceptPrefix: 'bio:k9:bier',
  facts: [
    {
      concept: 'bio:k9:welche-mikroorganismen-sind-bei-der-alko',
      prompt: 'Welche Mikroorganismen sind bei der alkoholischen Gärung zentral?',
      answer: 'Hefen',
      wrong: ['Nur Greifvögel', 'Nur Säugetiere', 'Nur Farne'],
      explanation: 'Hefe wandelt Zucker u. a. in Ethanol und CO₂ um.',
      wissen:
        'Hefen führen die alkoholische Gärung durch: Zucker wird anaerob zu Ethanol und Kohlenstoffdioxid umgewandelt.',
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
      wissen:
        'Gärung ist anaerob (ohne Sauerstoff). Zellatmung hingegen nutzt Sauerstoff und liefert deutlich mehr Energie.',
    },
  ],
  sorts: [
    {
      concept: 'bio:k9:ordne-grob-schritte-vom-getreide-zum-bie',
      question: 'Ordne grob Schritte vom Getreide zum Bier (vereinfacht).',
      labels: ['Malzbereitung', 'Maischen', 'Gärung', 'Reifung'],
      explanation: 'Schulmodell der Prozesskette.',
      wissen:
        'Vereinfachte Kette: Malzbereitung → Maischen (Zucker freisetzen) → Gärung durch Hefe → Reifung.',
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
