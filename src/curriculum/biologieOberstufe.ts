/**
 * Biologie Oberstufe (Gk/Lk) — Lehrplan 522 JGS 11/12.
 * Schlaukopf Oberstufe (Zellbiologie, Genetik, Evolution, Stoffwechsel, Ökologie …)
 * → original formuliert, in offizielle LB-Themen einsortiert.
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

const zellen: BioBank = {
  quelle: 'Wikipedia: Zellbiologie',
  url: 'https://de.wikipedia.org/wiki/Zellbiologie',
  facts: [
    {
      prompt: 'Was bedeutet funktionsbezogene Differenzierung von Zellen?',
      answer: 'Zellen spezialisieren sich für bestimmte Aufgaben in Geweben/Organen',
      wrong: ['Alle Körperzellen bleiben identisch funktionslos', 'Nur Pflanzen haben nie Gewebe', 'Differenzierung löscht DNA immer vollständig'],
      explanation: 'Aus Stamm-/Vorläuferzellen entstehen spezialisierte Zelltypen.',
      wissen: 'LB: Zellen, Gewebe und Organe.',
      gap: 'Gewebe bestehen aus ähnlich ___ Zellen.',
      gapAccepted: ['differenzierten', 'spezialisierten', 'gebaut'],
    },
    {
      prompt: 'Kompartimentierung in Eukaryoten dient vor allem …',
      answer: 'der räumlichen Trennung von Stoffwechselwegen',
      wrong: ['nur der Fotosynthese in Knochen', 'nur der Impfung', 'nur dem Federkleid'],
      explanation: 'Organellen schaffen Reaktionsräume.',
      wissen: 'Zelluläre Organisation.',
    },
  ],
  pairs: [
    { term: 'Gewebe', meaning: 'Verband gleichartiger Zellen', wissen: 'z. B. Muskel-, Nervengewebe.' },
    { term: 'Organ', meaning: 'Funktionseinheit aus Geweben', wissen: 'z. B. Leber, Blatt.' },
    { term: 'Membran', meaning: 'Selektive Barriere', wissen: 'Stofftransport, Rezeptoren.' },
  ],
  trueFalse: [
    {
      statement: 'In differenzierten Zellen ist die DNA immer vollständig gelöscht.',
      correct: false,
      explanation: 'Meist gleiche DNA — unterschiedliche Genaktivität.',
      wissen: 'Genregulation.',
    },
  ],
  multis: [
    {
      question: 'Welche Strukturen sind eukaryotische Organellen?',
      correct: ['Mitochondrien', 'Zellkern'],
      wrong: ['Nur Chitinpanzer außen', 'Nur Federfahnen'],
      explanation: 'Organellen in Eukaryoten.',
      wissen: 'Zellbiologie.',
    },
  ],
}

const stoffwechsel: BioBank = {
  quelle: 'Wikipedia: Zellatmung',
  url: 'https://de.wikipedia.org/wiki/Zellatmung',
  facts: [
    {
      prompt: 'Assimilation bedeutet grob …',
      answer: 'Aufbau körpereigener Stoffe (z. B. Fotosynthese)',
      wrong: ['Nur Abbau zu CO₂ ohne Ausnahme', 'Nur Knochenbruch', 'Nur Impfung'],
      explanation: 'Assimilation vs. Dissimilation.',
      wissen: 'Redoxprozesse zellulärer Strukturen.',
      gap: 'Bei der Zellatmung wird Glucose oxidiert; Energie wird als ___ nutzbar.',
      gapAccepted: ['ATP', 'ATP-Energie', 'Adenosintriphosphat'],
    },
    {
      prompt: 'Dissimilation (z. B. Zellatmung) …',
      answer: 'baut energiereiche Stoffe ab und stellt ATP bereit',
      wrong: ['erzeugt Zucker nur aus Licht ohne Enzyme', 'löscht Gene', 'bildet nur Chlorophyll'],
      explanation: 'Katabolismus liefert ATP.',
      wissen: 'Vergleich Fotosynthese/Atmung.',
    },
    {
      prompt: 'Enzyme senken …',
      answer: 'die Aktivierungsenergie von Reaktionen',
      wrong: ['die Lichtgeschwindigkeit', 'die Chromosomenzahl immer auf null', 'den pH auf 14 fest'],
      explanation: 'Biokatalysatoren — Stoffwechsel.',
      wissen: 'Schlaukopf „Stoffwechsel und Enzyme“ → LB Stoffwechsel.',
    },
  ],
  pairs: [
    { term: 'ATP', meaning: 'universeller Energieträger der Zelle', wissen: 'Kopplung endergoner Prozesse.' },
    { term: 'Redoxreaktion', meaning: 'Elektronenübertragung', wissen: 'Atmungskette, Fotosynthese.' },
    { term: 'Glykolyse', meaning: 'Abbau von Glucose im Cytoplasma', wissen: 'Erster Schritt vieler Katabolismen.' },
  ],
  trueFalse: [
    {
      statement: 'Fotosynthese und Zellatmung sind stofflich/energetisch miteinander verknüpft.',
      correct: true,
      explanation: 'Produkte der einen sind Edukte der anderen (vereinfacht).',
      wissen: 'Vernetzung.',
    },
  ],
  sorts: [
    {
      question: 'Ordne grob Stationen der aeroben Dissimilation.',
      labels: ['Glykolyse', 'Citratzyklus', 'Atmungskette'],
      explanation: 'Klassische Abfolge im Schulmodell.',
      wissen: 'Dissimilation.',
    },
  ],
}

const oekologie: BioBank = {
  quelle: 'Wikipedia: Ökologie',
  url: 'https://de.wikipedia.org/wiki/%C3%96kologie',
  facts: [
    {
      prompt: 'Nachhaltigkeit meint im ökologischen Kontext grob …',
      answer: 'Ressourcen so nutzen, dass zukünftige Generationen nicht gefährdet werden',
      wrong: ['Sofortiger Totalverbrauch aller Vorräte', 'Nur Einweg ohne Recyclinggedanken', 'Ignorieren von Stoffkreisläufen'],
      explanation: 'Ökologie und Nachhaltigkeit — Lehrplan LB.',
      wissen: 'Handlungsoptionen und Systemdenken.',
    },
    {
      prompt: 'Ein begrenzender Faktor …',
      answer: 'schränkt Wachstum/Verbreitung einer Population ein',
      wrong: ['erhöht immer unbegrenzt die Population', 'löscht Physikgesetze', 'ist nur der Wochentag'],
      explanation: 'Liebig/Minimumfaktor-Ideen im Unterricht.',
      wissen: 'Populationsökologie.',
    },
  ],
  pairs: [
    { term: 'Tragfähigkeit', meaning: 'Maximale Population langfristig', wissen: 'K-Strategie-Kontext.' },
    { term: 'Biodiversität', meaning: 'Vielfalt der Arten/Gene/Ökosysteme', wissen: 'Schutzziel.' },
    { term: 'Anthropogener Einfluss', meaning: 'Menschliche Einwirkung', wissen: 'z. B. Emissionen, Landnutzung.' },
  ],
  trueFalse: [
    {
      statement: 'Ökosystemdienstleistungen (z. B. Bestäubung, Wasserfilter) haben gesellschaftlichen Wert.',
      correct: true,
      explanation: 'Naturleistungen stützen Wirtschaft und Gesundheit.',
      wissen: 'Nachhaltigkeitsdiskurs.',
    },
  ],
  multis: [
    {
      question: 'Welche Maßnahmen können Nachhaltigkeit fördern?',
      correct: ['Ressourcen schonen', 'Kreisläufe schließen', 'Vielfalt schützen'],
      wrong: ['Unbegrenzte Verschwendung', 'Lebensräume flächendeckend versiegeln'],
      explanation: 'Handlungsfelder.',
      wissen: 'LB Ökologie und Nachhaltigkeit.',
    },
  ],
}

const genetikOS: BioBank = {
  quelle: 'Wikipedia: Gentechnik',
  url: 'https://de.wikipedia.org/wiki/Gentechnik',
  facts: [
    {
      prompt: 'Was beschreibt PCR grob?',
      answer: 'Vervielfältigung von DNA-Abschnitten',
      wrong: ['Nur Knochenheilung', 'Nur Transpiration', 'Nur Impfung mit Bakterien immer'],
      explanation: 'Molekularbiologische Methode.',
      wissen: 'Anwendungen und Perspektiven der Genetik.',
      gap: 'Bei der Proteinbiosynthese wird die DNA-Information über ___ in Aminosäuresequenzen übersetzt.',
      gapAccepted: ['mRNA', 'RNA', 'Messenger-RNA'],
    },
    {
      prompt: 'Ein ethischer Aspekt der Gentechnik ist …',
      answer: 'Abwägung von Nutzen, Risiken und gesellschaftlichen Folgen',
      wrong: ['dass Ethik irrelevant sei', 'dass nur Farbe zählt', 'dass Physik entfällt'],
      explanation: 'Perspektiven der Genetik — Bewerten lernen.',
      wissen: 'Lehrplanziel Bewerten.',
    },
  ],
  pairs: [
    { term: 'Transkription', meaning: 'DNA → RNA', wissen: 'Genexpression.' },
    { term: 'Translation', meaning: 'RNA → Protein', wissen: 'Ribosom.' },
    { term: 'Vektor', meaning: 'Transportmittel für DNA (z. B. Plasmid)', wissen: 'Gentechnik.' },
  ],
  trueFalse: [
    {
      statement: 'Klassische Züchtung verändert ebenfalls die genetische Ausstattung von Populationen.',
      correct: true,
      explanation: 'Selektion durch Menschen — Vergleich zur Gentechnik.',
      wissen: 'Einordnung.',
    },
  ],
  sorts: [
    {
      question: 'Ordne die Genexpression.',
      labels: ['DNA', 'mRNA', 'Protein'],
      explanation: 'Zentrales Dogma (Schulmodell).',
      wissen: 'Molekulare Genetik.',
    },
  ],
}

const kommunikation: BioBank = {
  quelle: 'Wikipedia: Signaltransduktion',
  url: 'https://de.wikipedia.org/wiki/Signaltransduktion',
  facts: [
    {
      prompt: 'Zelluläre Kommunikation braucht typischerweise …',
      answer: 'Signal, Rezeptor und nachfolgende Antwort der Zelle',
      wrong: ['nur Zufall ohne Moleküle', 'nur Federkleid', 'nur Holzfasern'],
      explanation: 'Ligand–Rezeptor–Kaskade.',
      wissen: 'Kommunikation zwischen Zellen.',
      gap: 'Hormone und Neurotransmitter sind Beispiele für ___.',
      gapAccepted: ['Signale', 'Botenstoffe', 'Signalstoffe'],
    },
  ],
  pairs: [
    { term: 'Rezeptor', meaning: 'Bindungsstelle für Signalstoff', wissen: 'Spezifität.' },
    { term: 'Second Messenger', meaning: 'Intrazellulärer Botenstoff', wissen: 'Verstärkung.' },
    { term: 'Synapse', meaning: 'Kontaktstelle zwischen Nervenzellen', wissen: 'Chemische Übertragung oft.' },
  ],
  trueFalse: [
    {
      statement: 'Ohne passende Rezeptoren bleibt ein Signalstoff an der Zielzelle wirkungslos.',
      correct: true,
      explanation: 'Schlüssel-Schloss-Prinzip.',
      wissen: 'Spezifität.',
    },
  ],
}

const biodiversitaet: BioBank = {
  quelle: 'Wikipedia: Biodiversität',
  url: 'https://de.wikipedia.org/wiki/Biodiversit%C3%A4t',
  facts: [
    {
      prompt: 'Biodiversität umfasst …',
      answer: 'Vielfalt der Gene, Arten und Ökosysteme',
      wrong: ['nur eine einzelne Laborzelle', 'nur Schulnoten', 'nur Metalllegierungen'],
      explanation: 'Drei Ebenen der Vielfalt.',
      wissen: 'Biodiversität und ihre Entstehung.',
    },
  ],
  pairs: [
    { term: 'Artenschutz', meaning: 'Maßnahmen zum Erhalt von Arten', wissen: 'Praxisbezug.' },
    { term: 'Habitatverlust', meaning: 'Lebensraumzerstörung', wissen: 'Hauptgefährdung oft.' },
  ],
  trueFalse: [
    {
      statement: 'Höhere genetische Vielfalt kann Populationen robuster gegen Umweltänderungen machen.',
      correct: true,
      explanation: 'Anpassungspotenzial.',
      wissen: 'Evolutionärer Hintergrund.',
    },
  ],
  multis: [
    {
      question: 'Welche Prozesse fördern Biodiversität langfristig?',
      correct: ['Artbildung', 'Angepasste Nutzung/Schutz'],
      wrong: ['Flächendeckende Monokultur überall', 'Vollständige Lebensraumvernichtung'],
      explanation: 'Entstehung und Erhalt.',
      wissen: 'LB Biodiversität.',
    },
  ],
}

const verhalten: BioBank = {
  quelle: 'Wikipedia: Verhaltensbiologie',
  url: 'https://de.wikipedia.org/wiki/Verhaltensbiologie',
  facts: [
    {
      prompt: 'Angeborenes Verhalten …',
      answer: 'tritt ohne Lernen in typischer Form auf (Schulmodell)',
      wrong: ['existiert nie', 'ist immer nur Kultur', 'braucht immer Schrift'],
      explanation: 'Erbkoordination vs. Lernen — vereinfacht.',
      wissen: 'Verhalten von Tier und Mensch (Lk).',
    },
  ],
  pairs: [
    { term: 'Schlüsselreiz', meaning: 'Auslöser einer Erbkoordination', wissen: 'Klassische Ethologie.' },
    { term: 'Lernen', meaning: 'Verhaltensänderung durch Erfahrung', wissen: 'Konditionierung u. a.' },
  ],
  trueFalse: [
    {
      statement: 'Menschliches Verhalten ist rein genetisch und nie kulturell beeinflusst.',
      correct: false,
      explanation: 'Biologie und Kultur wirken zusammen.',
      wissen: 'Differenzierung.',
    },
  ],
}

const systematikOS: BioBank = {
  quelle: 'Wikipedia: Systematik (Biologie)',
  url: 'https://de.wikipedia.org/wiki/Systematik_(Biologie)',
  facts: [
    {
      prompt: 'Systematisierung und Vernetztheit betont …',
      answer: 'Zusammenhänge zwischen Teilgebieten der Biologie',
      wrong: ['nur isolierte Fakten ohne Bezug', 'nur Orthografie', 'nur Sportregeln'],
      explanation: 'Abschluss LB: Vernetzung der Konzepte.',
      wissen: 'Systematisierung und Vernetztheit.',
    },
  ],
  trueFalse: [
    {
      statement: 'Zellbiologie, Genetik und Ökologie lassen sich sinnvoll verknüpfen.',
      correct: true,
      explanation: 'z. B. Genetik der Anpassung in Populationen.',
      wissen: 'Vernetzung.',
    },
  ],
  sorts: [
    {
      question: 'Ordne Organisationsebenen vom Kleinen zum Großen.',
      labels: ['Molekül', 'Zelle', 'Organismus', 'Ökosystem'],
      explanation: 'Skalen der Biologie.',
      wissen: 'Systemdenken.',
    },
  ],
}

/** Shared compact banks for Wahlbereiche */
const wahl = (title: string, facts: BioBank['facts'], extra?: Partial<BioBank>): BioBank => ({
  quelle: `Wikipedia: ${title}`,
  url: 'https://de.wikipedia.org/wiki/Biologie',
  facts,
  ...extra,
})

export const BIOLOGIE_OBERSTUFE_GENERATORS: Record<string, Topic['generate']> = {
  'bi-gk11-lb1-zellen': bankGenerate(zellen),
  'bi-gk11-lb2-stoffwechsel': bankGenerate(stoffwechsel),
  'bi-gk11-lb3-oekologie': bankGenerate(oekologie),
  'bi-gk12-lb1-genetik': bankGenerate(genetikOS),
  'bi-gk12-lb2-kommunikation': bankGenerate(kommunikation),
  'bi-gk12-lb3-biodiversitaet': bankGenerate(biodiversitaet),
  'bi-lk11-lb1-zellen': bankGenerate(zellen),
  'bi-lk11-lb2-stoffwechsel': bankGenerate(stoffwechsel),
  'bi-lk11-lb3-oekologie': bankGenerate(oekologie),
  'bi-lk12-lb1-genetik': bankGenerate(genetikOS),
  'bi-lk12-lb2-kommunikation': bankGenerate(kommunikation),
  'bi-lk12-lb3-verhalten': bankGenerate(verhalten),
  'bi-lk12-lb4-biodiversitaet': bankGenerate(biodiversitaet),
  'bi-lk12-lb5-systematik': bankGenerate(systematikOS),
  'bi-gk-lbw-wueste': bankGenerate(
    wahl('Wüste', [
      {
        prompt: 'Welche Angepasstheit hilft Wüstenpflanzen oft?',
        answer: 'Wasserspeicherung / reduzierte Blätter / dicke Cuticula',
        wrong: ['Kiemenatmung', 'Federflug als Blatt', 'Blutkreislauf wie Säuger'],
        explanation: 'Wassersparen und -speichern sind typisch.',
        wissen: 'Leben in der Wüste.',
      },
    ]),
  ),
  'bi-gk-lbw-energie': bankGenerate(
    wahl('Energieumsatz', [
      {
        prompt: 'Grundumsatz beschreibt grob …',
        answer: 'Energiebedarf in Ruhe',
        wrong: ['nur den Sprintrekord', 'nur die Blattfläche', 'nur die Chromosomenzahl'],
        explanation: 'Energiehaushalt von Mensch und Tier.',
        wissen: 'Wahl Energiehaushalt.',
      },
    ]),
  ),
  'bi-gk-lbw-fliesgewaesser': bankGenerate(
    wahl('Fließgewässer', [
      {
        prompt: 'Was prägt Fließgewässer als Lebensraum stark?',
        answer: 'Strömung, Sauerstoffeintrag, Uferstruktur',
        wrong: ['Nur Mondstaub', 'Nur Schulklingeln', 'Nur Federfarbe'],
        explanation: 'Abiotische Faktoren im Bach/Fluss.',
        wissen: 'Wahl Fließgewässer.',
      },
    ]),
  ),
  'bi-gk-lbw-krebs': bankGenerate(
    wahl('Krebs (Medizin)', [
      {
        prompt: 'Krebszellen kennzeichnet oft …',
        answer: 'unkontrollierte Zellteilung',
        wrong: ['immer sofortige Heilung ohne Therapie', 'nur Fotosynthese', 'nur Kiemen'],
        explanation: 'Entartete Regulation des Zellzyklus.',
        wissen: 'Wahl Krebs — sachlich.',
      },
    ]),
  ),
  'bi-gk-lbw-nerven': bankGenerate(kommunikation),
  'bi-gk-lbw-verhalten': bankGenerate(verhalten),
  'bi-gk-lbw-gentechnik': bankGenerate(genetikOS),
  'bi-lk11-lbw-urban': bankGenerate(
    wahl('Stadtökologie', [
      {
        prompt: 'Urbane Ökologie untersucht …',
        answer: 'Wechselwirkungen von Arten und Umwelt in Städten',
        wrong: ['nur Meeresboden ohne Stadt', 'nur Sternkarten', 'nur Orthografie'],
        explanation: 'Stadt als Ökosystem.',
        wissen: 'Wahl urbane Ökologie.',
      },
    ]),
  ),
  'bi-lk11-lbw-bioindikation': bankGenerate(
    wahl('Bioindikator', [
      {
        prompt: 'Bioindikatoren …',
        answer: 'zeigen Umweltzustände durch An-/Abwesenheit oder Zustand von Arten',
        wrong: ['ersetzen Messgeräte immer vollständig ohne Sinn', 'sind nur Steine', 'sind nur Zahlen ohne Biologie'],
        explanation: 'z. B. Flechten und Luftqualität.',
        wissen: 'Wahl Bioindikation.',
      },
    ]),
  ),
  'bi-lk11-lbw-invasiv': bankGenerate(
    wahl('Neobiota', [
      {
        prompt: 'Invasive Arten können …',
        answer: 'heimische Arten und Ökosysteme verdrängen/verändern',
        wrong: ['nie ökologische Wirkung haben', 'nur Schulbücher fressen', 'nur DNA löschen weltweit'],
        explanation: 'Neobiota und Management.',
        wissen: 'Wahl invasive Arten.',
      },
    ]),
  ),
  'bi-lk11-lbw-rohstoffe': bankGenerate(
    wahl('Nachwachsende Rohstoffe', [
      {
        prompt: 'Nachwachsende Rohstoffe …',
        answer: 'stammen aus Biomasse und können erneut erzeugt werden',
        wrong: ['sind immer unbegrenzt ohne Fläche', 'sind nur Erdöl', 'sind nur Metall'],
        explanation: 'Chance und Flächenkonkurrenz.',
        wissen: 'Wahl nachwachsende Rohstoffe.',
      },
    ]),
  ),
  'bi-lk11-lbw-energie': bankGenerate(
    wahl('Energiehaushalt', [
      {
        prompt: 'Leistungsumsatz ist …',
        answer: 'Energiebedarf bei Aktivität über dem Grundumsatz',
        wrong: ['nur die DNA-Länge', 'nur die Blattzahl', 'nur die Schuhgröße'],
        explanation: 'Energiehaushalt des Menschen.',
        wissen: 'Wahl.',
      },
    ]),
  ),
  'bi-lk12-lbw-allergie': bankGenerate(
    wahl('Allergie', [
      {
        prompt: 'Eine Allergie ist grob …',
        answer: 'übersteigerte Immunreaktion gegen eigentlich harmlose Stoffe',
        wrong: ['immer eine Virusvermehrung', 'nur Knochenbruch', 'nur Fotosynthese'],
        explanation: 'Allergien und Autoimmunität — Wahl.',
        wissen: 'Immunologie.',
      },
    ]),
  ),
  'bi-lk12-lbw-stoffwechsel': bankGenerate(stoffwechsel),
  'bi-lk12-lbw-gefaess': bankGenerate(
    wahl('Gefäßpflanzen', [
      {
        prompt: 'Gefäßpflanzen besitzen …',
        answer: 'Leitgewebe (Xylem/Phloem)',
        wrong: ['nie Wurzeln', 'nur Kiemen', 'nur Federn'],
        explanation: 'Praktikum Gefäßpflanzen.',
        wissen: 'Wahl.',
      },
    ]),
  ),
  'bi-lk12-lbw-verhalten': bankGenerate(verhalten),
  'bi-lk12-lbw-gentechnik': bankGenerate(genetikOS),
}
