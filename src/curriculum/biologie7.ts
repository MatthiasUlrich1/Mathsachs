/**
 * Biologie Klasse 7 — Lehrplan 522 (Mikroben, Blut/Immun, Ernährung, Skelett).
 * Ideen aus Schulquiz-Themen (Immunsystem, Verdauung, Blutkreislauf, Knochen) —
 * original formuliert; Platzierung nach Lehrplan, nicht nach Schlaukopf-Baum.
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

const mikroben: BioBank = {
  quelle: 'Wikipedia: Bakterien',
  url: 'https://de.wikipedia.org/wiki/Bakterien',
  facts: [
    {
      prompt: 'Was sind Bakterien?',
      answer: 'Einzellige Mikroorganismen ohne echten Zellkern',
      wrong: ['Immer Viren mit Hülle', 'Nur vielzellige Tiere', 'Nur Pflanzenzellen mit Chloroplast'],
      explanation: 'Bakterien sind Prokaryoten — kein Zellkern wie bei Pflanzen/Tieren.',
      wissen: 'Unterscheidung Bakterien ↔ Viren ist zentral.',
      gap: 'Bakterien besitzen keinen echten ___.',
      gapAccepted: ['Zellkern', 'Kern'],
    },
    {
      prompt: 'Was sind Viren?',
      answer: 'Infektiöse Partikel aus Erbgut und oft Proteinhülle — keine Zellen',
      wrong: ['Vollständige Zellen mit Mitochondrien', 'Immer nützliche Darmbakterien', 'Nur Mineralien'],
      explanation: 'Viren brauchen Wirtszellen zur Vermehrung.',
      wissen: 'Viren sind keine klassischen Lebewesen im Unterrichtsmodell.',
      gap: 'Viren vermehren sich nur in ___.',
      gapAccepted: ['Wirtszellen', 'lebenden Zellen', 'Zellen'],
    },
    {
      prompt: 'Welche Hygienemaßnahme verringert die Übertragung vieler Keime?',
      answer: 'Hände waschen / Desinfektion wo nötig',
      wrong: ['Nie Lüften', 'Gemeinsame Zahnbürste', 'Offene Wunden ignorieren'],
      explanation: 'Hygiene unterbricht Infektionsketten.',
      wissen: 'Prävention gehört zum Lernbereich.',
    },
  ],
  pairs: [
    { term: 'Bakterium', meaning: 'Einzeller ohne Zellkern', wissen: 'Kann nützlich oder pathogen sein.' },
    { term: 'Virus', meaning: 'Erbgut + Hülle, parasitär', wissen: 'Braucht Wirtszelle.' },
    { term: 'Antibiotikum', meaning: 'Wirkt gegen Bakterien (nicht gegen Viren)', wissen: 'Falsche Nutzung fördert Resistenzen.' },
  ],
  trueFalse: [
    {
      statement: 'Antibiotika helfen zuverlässig gegen alle Virusinfektionen.',
      correct: false,
      explanation: 'Antibiotika zielen auf Bakterien, nicht auf Viren.',
      wissen: 'Häufiges Missverständnis in Quizzes.',
    },
    {
      statement: 'Manche Bakterien sind für den Menschen nützlich (z. B. Darmflora).',
      correct: true,
      explanation: 'Nicht alle Bakterien sind Krankheitserreger.',
      wissen: 'Wahlbereich Mikroben und ihre Bedeutung.',
    },
  ],
  multis: [
    {
      question: 'Was hilft, Ansteckungen zu verringern?',
      correct: ['Hände waschen', 'Impfungen wo empfohlen'],
      wrong: ['Offene Lebensmittel wochenlang ungekühlt', 'Nie Lüften im Krankenraum'],
      explanation: 'Hygiene und Impfungen sind zentrale Schutzmaßnahmen.',
      wissen: 'Infektionsbiologie alltagsnah.',
    },
  ],
}

const blut: BioBank = {
  quelle: 'Wikipedia: Blutkreislauf',
  url: 'https://de.wikipedia.org/wiki/Blutkreislauf',
  facts: [
    {
      prompt: 'Welche Aufgabe hat das Herz im Blutkreislauf?',
      answer: 'Pumpt Blut durch den Körper',
      wrong: ['Erzeugt Pollen', 'Speichert nur Galle', 'Bildet nur Knochenmark außen'],
      explanation: 'Das Herz ist die Pumpe des Kreislaufs.',
      wissen: 'Körper- und Lungenkreislauf (vereinfacht).',
      gap: 'Das ___ pumpt das Blut durch die Gefäße.',
      gapAccepted: ['Herz'],
    },
    {
      prompt: 'Wofür sind rote Blutkörperchen besonders wichtig?',
      answer: 'Sauerstofftransport (Hämoglobin)',
      wrong: ['Nur Antikörperbildung', 'Nur Fettverdauung', 'Nur Knochenwachstum'],
      explanation: 'Hämoglobin bindet Sauerstoff.',
      wissen: 'Blutbestandteile und ihre Funktionen.',
      gap: 'Rote Blutkörperchen transportieren vor allem ___.',
      gapAccepted: ['Sauerstoff', 'O2', 'O₂'],
    },
    {
      prompt: 'Was leisten weiße Blutkörperchen typischerweise?',
      answer: 'Abwehr von Krankheitserregern',
      wrong: ['Nur Sauerstoffbindung', 'Nur Puls erzeugen', 'Nur Speichel bilden'],
      explanation: 'Teil der Immunabwehr.',
      wissen: 'Immunbiologie im LB2.',
    },
    {
      prompt: 'Arterien führen Blut …',
      answer: 'vom Herzen weg',
      wrong: ['immer nur zum Herzen hin', 'nur in die Leber ohne Herz', 'nur in Pflanzen'],
      explanation: 'Arterien: vom Herzen; Venen: zum Herzen (Schulmodell).',
      wissen: 'Gefäßtypen unterscheiden.',
    },
  ],
  pairs: [
    { term: 'Arterie', meaning: 'Gefäß vom Herzen weg', wissen: 'Oft sauerstoffreich im Körperkreislauf.' },
    { term: 'Vene', meaning: 'Gefäß zum Herzen hin', wissen: 'Rückfluss zum Herzen.' },
    { term: 'Antikörper', meaning: 'Abwehrstoff gegen Erreger/Merkmale', wissen: 'Gehört zur spezifischen Abwehr.' },
    { term: 'Impfung', meaning: 'Trainiert das Immunsystem vorsorglich', wissen: 'Bildung von Gedächtniszellen.' },
  ],
  trueFalse: [
    {
      statement: 'Das Blut transportiert nur Sauerstoff, nie Nährstoffe oder Hormone.',
      correct: false,
      explanation: 'Blut transportiert u. a. Gase, Nährstoffe, Hormone, Abwehrzellen.',
      wissen: 'Transportfunktion des Blutes.',
    },
  ],
  sorts: [
    {
      question: 'Ordne den Weg des Blutes im Körperkreislauf vereinfacht (Start Herz).',
      labels: ['Herz (linke Kammer)', 'Arterien zum Körper', 'Kapillaren (Stoffaustausch)', 'Venen zurück zum Herzen'],
      explanation: 'Pumpe → Arterien → Kapillaren → Venen → Herz.',
      wissen: 'Kreislaufschema üben.',
    },
  ],
  multis: [
    {
      question: 'Welche Bestandteile gehören zum Blut?',
      correct: ['Rote Blutkörperchen', 'Blutplasma', 'Weiße Blutkörperchen'],
      wrong: ['Nur Blattgrün', 'Nur Holzfasern'],
      explanation: 'Blut = Zellen + Plasma (+ Blutplättchen).',
      wissen: 'Zusammensetzung des Blutes.',
    },
  ],
}

const ernaehrung: BioBank = {
  quelle: 'Wikipedia: Verdauung',
  url: 'https://de.wikipedia.org/wiki/Verdauung',
  facts: [
    {
      prompt: 'Wozu dienen Enzyme bei der Verdauung?',
      answer: 'Spalten Nährstoffe in aufnehmbare Bausteine',
      wrong: ['Erzeugen Knochenmark', 'Transportieren nur Sauerstoff', 'Bilden Antikörper allein'],
      explanation: 'Enzyme katalysieren die Zerlegung von Nährstoffen.',
      wissen: 'Verdauungsweg Mund → Magen → Darm.',
      gap: 'Im Dünndarm werden Nährstoffe vor allem in die ___ aufgenommen.',
      gapAccepted: ['Blutbahn', 'Blutbahn/Lymphe', 'Blut', 'Blutgefäße'],
    },
    {
      prompt: 'Welche Nährstoffgruppe liefert vor allem schnell verfügbare Energie?',
      answer: 'Kohlenhydrate',
      wrong: ['Nur Mineralstoffe ohne Energie', 'Nur Wasser', 'Nur Vitamine als Brennstoff'],
      explanation: 'Kohlenhydrate sind wichtige Energielieferanten.',
      wissen: 'Nährstoffe: KH, Fette, Proteine + Begleitstoffe.',
    },
    {
      prompt: 'Welche Aufgabe hat die Niere grob?',
      answer: 'Filtert Blut und bildet Harn (Ausscheidung)',
      wrong: ['Verdaut Fett im Mund', 'Erzeugt Magensäure dauerhaft', 'Pumpt Blut wie das Herz'],
      explanation: 'Ausscheidung harnpflichtiger Stoffe.',
      wissen: 'Ernährung, Verdauung und Ausscheidung hängen zusammen.',
    },
  ],
  pairs: [
    { term: 'Magen', meaning: 'Durchmischung und saure Vorverdauung', wissen: 'Magensäure und Enzyme.' },
    { term: 'Dünndarm', meaning: 'Hauptort der Nährstoffaufnahme', wissen: 'Große Oberfläche durch Zotten.' },
    { term: 'Dickdarm', meaning: 'Wasserentzug, Stuhlbildung', wissen: 'Auch Mikrobiom.' },
    { term: 'Eiweiße', meaning: 'Baustoffe (Aminosäuren)', wissen: 'Für Wachstum und Enzyme nötig.' },
  ],
  trueFalse: [
    {
      statement: 'Vitamine liefern die Hauptenergie wie Fette und Kohlenhydrate.',
      correct: false,
      explanation: 'Vitamine sind Wirkstoffe, keine klassischen Energielieferanten.',
      wissen: 'Nährstoffgruppen klar trennen.',
    },
  ],
  sorts: [
    {
      question: 'Ordne den Weg der Nahrung im Verdauungstrakt.',
      labels: ['Mund', 'Speiseröhre', 'Magen', 'Dünndarm', 'Dickdarm'],
      explanation: 'Klassische Reihenfolge der Passage.',
      wissen: 'Orientierung im Verdauungssystem.',
    },
  ],
  multis: [
    {
      question: 'Welche Aussagen zur gesunden Ernährung passen?',
      correct: ['Abwechslungsreich essen', 'Ausreichend trinken'],
      wrong: ['Nur Süßigkeiten', 'Nie Gemüse'],
      explanation: 'Balance und Flüssigkeit sind Grundlagen.',
      wissen: 'Alltagsbezug LB3 / Wahl Ernährung.',
    },
  ],
}

const skelett: BioBank = {
  quelle: 'Wikipedia: Skelett',
  url: 'https://de.wikipedia.org/wiki/Menschliches_Skelett',
  facts: [
    {
      prompt: 'Welche Aufgaben hat das Skelett?',
      answer: 'Stütze, Schutz und Ansatz für Muskeln',
      wrong: ['Nur Blut filtern wie die Niere', 'Nur Hormone erzeugen', 'Nur Fotosynthese'],
      explanation: 'Knochen schützen Organe und ermöglichen Bewegung mit Muskeln.',
      wissen: 'Stütz- und Bewegungssystem.',
      gap: 'Knochen und ___ arbeiten bei der Bewegung zusammen.',
      gapAccepted: ['Muskeln', 'Muskulatur', 'Sehnen'],
    },
    {
      prompt: 'Was verbindet Knochen beweglich miteinander?',
      answer: 'Gelenke',
      wrong: ['Nur Haare', 'Nur Schweißdrüsen', 'Nur Zahnschmelz'],
      explanation: 'Gelenke ermöglichen Bewegung.',
      wissen: 'Gelenkformen im Überblick.',
    },
    {
      prompt: 'Wozu dienen Sehnen?',
      answer: 'Verbinden Muskeln mit Knochen',
      wrong: ['Leiten nur Nervenimpulse zum Auge', 'Speichern nur Galle', 'Bilden Antikörper'],
      explanation: 'Sehnen übertragen Zugkraft.',
      wissen: 'Zusammenspiel Muskel–Sehne–Knochen.',
    },
  ],
  pairs: [
    { term: 'Scharniergelenk', meaning: 'Bewegung vorwiegend in einer Ebene (z. B. Ellbogen)', wissen: 'Beispiel Gelenktypen.' },
    { term: 'Kugelgelenk', meaning: 'Bewegung in vielen Richtungen (z. B. Schulter)', wissen: 'Hohe Beweglichkeit.' },
    { term: 'Muskel', meaning: 'Erzeugt Zug durch Zusammenziehen', wissen: 'Aktiver Teil der Bewegung.' },
  ],
  trueFalse: [
    {
      statement: 'Knochen sind völlig leblos und ohne Blutversorgung.',
      correct: false,
      explanation: 'Knochengewebe ist lebendig und gut durchblutet.',
      wissen: 'Knochenheilung möglich.',
    },
  ],
  multis: [
    {
      question: 'Was gehört zum Bewegungssystem?',
      correct: ['Knochen', 'Muskeln', 'Gelenke'],
      wrong: ['Nur Chloroplasten', 'Nur Blütenstaub'],
      explanation: 'Stütz- und Bewegungsapparat umfasst diese Teile.',
      wissen: 'Systemüberblick.',
    },
  ],
}

const wahlErnaehrung: BioBank = {
  quelle: 'Wikipedia: Ernährung',
  url: 'https://de.wikipedia.org/wiki/Ern%C3%A4hrung',
  facts: [
    {
      prompt: 'Warum beeinflusst Ernährung Wohlbefinden und Leistungsfähigkeit?',
      answer: 'Sie liefert Energie und Baustoffe für Körper und Gehirn',
      wrong: ['Sie ersetzt Schlaf vollständig', 'Sie macht Knochen überflüssig', 'Sie stoppt jede Atmung'],
      explanation: 'Nahrung und Gewohnheiten prägen Gesundheit.',
      wissen: 'Wahl: Ernährung und Persönlichkeit — reflektieren, nicht belehren.',
    },
  ],
  trueFalse: [
    {
      statement: 'Nur der Geschmack entscheidet über eine ausgewogene Ernährung.',
      correct: false,
      explanation: 'Nährstoffbedarf, Vielfalt und Maß zählen mit.',
      wissen: 'Kritische Auseinandersetzung mit Essgewohnheiten.',
    },
  ],
}

const wahlFitness: BioBank = {
  quelle: 'Wikipedia: Fitness',
  url: 'https://de.wikipedia.org/wiki/Fitness',
  facts: [
    {
      prompt: 'Was verbessert regelmäßige Bewegung typischerweise?',
      answer: 'Herz-Kreislauf-Leistung und Muskelkraft',
      wrong: ['Die Notwendigkeit zu atmen entfällt', 'Knochen verschwinden', 'Immunsystem wird nutzlos'],
      explanation: 'Training stärkt Herz, Kreislauf und Muskeln.',
      wissen: 'Wahl: Fitness und Gesundheit.',
    },
  ],
  trueFalse: [
    {
      statement: 'Aufwärmen vor Sport kann Verletzungsrisiko senken.',
      correct: true,
      explanation: 'Aufwärmen bereitet Muskeln und Kreislauf vor.',
      wissen: 'Sicherheitsaspekt.',
    },
  ],
}

const wahlMikroben: BioBank = {
  quelle: 'Wikipedia: Mikroorganismus',
  url: 'https://de.wikipedia.org/wiki/Mikroorganismus',
  facts: [
    {
      prompt: 'Welches Beispiel zeigt nützliche Mikroben?',
      answer: 'Joghurt-/Käsehefen und -bakterien bzw. Darmflora',
      wrong: ['Nur hochgiftige Viren ohne Ausnahme', 'Nur Rost an Eisen', 'Nur Plastik'],
      explanation: 'Mikroben in Lebensmitteln und im Darm können nützlich sein.',
      wissen: 'Wahl: Mikroben und ihre Bedeutung.',
    },
  ],
  pairs: [
    { term: 'Gärung', meaning: 'Stoffwechsel ohne Sauerstoff (z. B. Hefe)', wissen: 'Brot, Joghurt, Bier.' },
    { term: 'Hygiene', meaning: 'Maßnahmen gegen unerwünschte Keime', wissen: 'Schutz und Nutzen abwägen.' },
  ],
  trueFalse: [
    {
      statement: 'Alle Mikroorganismen sind Krankheitserreger.',
      correct: false,
      explanation: 'Viele sind harmlos oder nützlich.',
      wissen: 'Differenzierung üben.',
    },
  ],
}

export const BIOLOGIE_K7_GENERATORS: Record<string, Topic['generate']> = {
  'bi-k7-lb1-mikroben': bankGenerate(mikroben),
  'bi-k7-lb2-blut': bankGenerate(blut),
  'bi-k7-lb3-ernaehrung': bankGenerate(ernaehrung),
  'bi-k7-lb4-skelett': bankGenerate(skelett),
  'bi-k7-lbw-ernaehrung-persoenlichkeit': bankGenerate(wahlErnaehrung),
  'bi-k7-lbw-fitness': bankGenerate(wahlFitness),
  'bi-k7-lbw-mikroben': bankGenerate(wahlMikroben),
}
