/**
 * Biologie Oberstufe (Gk/Lk) — Lehrplan 522 JGS 11/12.
 * Fragebezogene Fachwissen-Texte; Prompt/Lücke/Lösung müssen zusammenpassen.
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

const zellen: BioBank = {
  quelle: 'Wikipedia: Zellbiologie',
  url: 'https://de.wikipedia.org/wiki/Zellbiologie',
  conceptPrefix: 'bio:kOberstufe:zellen',
  facts: [
    {
      concept: 'bio:kOberstufe:was-bedeutet-funktionsbezogene-differenz',
      prompt: 'Was bedeutet funktionsbezogene Differenzierung von Zellen?',
      answer: 'Zellen spezialisieren sich für bestimmte Aufgaben in Geweben/Organen',
      wrong: ['Alle Körperzellen bleiben identisch funktionslos', 'Nur Pflanzen haben nie Gewebe', 'Differenzierung löscht DNA immer vollständig'],
      explanation: 'Aus Stamm-/Vorläuferzellen entstehen spezialisierte Zelltypen.',
      wissen:
        'Bei der Differenzierung schalten Zellen Gene an oder ab und spezialisieren sich für Aufgaben in Geweben und Organen. Die DNA bleibt in der Regel erhalten — entscheidend ist die Genaktivität. So entstehen z. B. Muskel-, Nerven- oder Blattzellen aus gemeinsamen Vorläufern.',
      gap: 'Gewebe bestehen aus ähnlich ___ Zellen.',
      gapAccepted: ['differenzierten', 'spezialisierten'],
    },
    {
      concept: 'bio:kOberstufe:kompartimentierung-in-eukaryoten-dient-v',
      prompt: 'Kompartimentierung in Eukaryoten dient vor allem …',
      answer: 'der räumlichen Trennung von Stoffwechselwegen',
      wrong: ['nur der Fotosynthese in Knochen', 'nur der Impfung', 'nur dem Federkleid'],
      explanation: 'Organellen schaffen getrennte Reaktionsräume.',
      wissen:
        'Eukaryotische Zellen sind in Membrankompartimente gegliedert (z. B. Kern, Mitochondrien, ER). Dadurch laufen gegenläufige Stoffwechselwege räumlich getrennt und effizient ab. Transport zwischen Kompartimenten erfolgt über Membranen und Vesikel.',
    },
    {
      concept: 'bio:kOberstufe:mitochondrien-hauptaufgabe',
      prompt: 'Welche Hauptaufgabe haben Mitochondrien?',
      answer: 'ATP-Gewinnung durch Zellatmung',
      wrong: ['nur Speicherung von Stärke wie Amyloplasten', 'nur Photosynthese ohne Ausnahme', 'nur Bildung der Zellwand'],
      explanation: 'Kraftwerke der Zelle.',
      wissen:
        'Mitochondrien sind die Hauptorte der aeroben ATP-Gewinnung. In der inneren Membran läuft die Atmungskette; in der Matrix der Citratzyklus. Zellen mit hohem Energiebedarf (z. B. Muskel) sind mitochondrienreich.',
    },
    {
      concept: 'bio:kOberstufe:zellkern-enthaelt',
      prompt: 'Der Zellkern eukaryotischer Zellen enthält vor allem …',
      answer: 'die chromosomale DNA',
      wrong: ['nur Chlorophyllkristalle', 'nur Extrazellulärmatrix', 'nur Chitinpanzer'],
      explanation: 'Steuerzentrale mit Erbgut.',
      wissen:
        'Im Zellkern liegt die DNA in Chromosomen vor. Dort finden Transkription und Replikation statt. Durch Kernporen werden RNA und Proteine ausgetauscht.',
    },
    {
      concept: 'bio:kOberstufe:passiver-transport',
      prompt: 'Passiver Transport durch Membranen …',
      answer: 'verläuft ohne ATP entlang des Konzentrationsgefälles',
      wrong: ['braucht immer ATP gegen das Gefälle', 'löscht immer Gene', 'ist nur bei Pflanzen unmöglich'],
      explanation: 'Diffusion/erleichterte Diffusion.',
      wissen:
        'Passiver Transport folgt dem Konzentrationsgefälle und verbraucht kein ATP. Dazu gehören einfache Diffusion und erleichterte Diffusion über Kanäle/Carrier. Aktiver Transport dagegen pumpt Stoffe unter Energieeinsatz.',
    },
    {
      concept: 'bio:kOberstufe:stammzellen',
      prompt: 'Stammzellen zeichnen sich dadurch aus, dass sie …',
      answer: 'sich teilen und zu verschiedenen Zelltypen differenzieren können',
      wrong: ['nie teilen und sofort sterben', 'nur als Knochenzellen vorkommen', 'keine DNA besitzen'],
      explanation: 'Selbsterneuerung und Potenz.',
      wissen:
        'Stammzellen können sich erneuern und Tochterzellen bilden, die sich differenzieren. Embryonale Stammzellen sind pluripotent; adulte oft multipotent. In der Medizin und Ethik spielen sie eine große Rolle.',
    },
    {
      concept: 'bio:kOberstufe:er-funktion',
      prompt: 'Das endoplasmatische Retikulum (ER) dient vor allem …',
      answer: 'der Proteinsynthese und dem Stofftransport in der Zelle',
      wrong: ['nur der Photosynthese in Chloroplasten', 'nur dem Knochenwachstum', 'nur der Impfung'],
      explanation: 'Membrannetzwerk der Zelle.',
      wissen:
        'Das raue ER trägt Ribosomen und ist an der Proteinsynthese für den Export beteiligt; das glatte ER spielt u. a. beim Lipidstoffwechsel eine Rolle. Vesikel transportieren Produkte weiter zum Golgi-Apparat.',
    },
  ],
  pairs: [
    {
      term: 'Gewebe',
      meaning: 'Verband gleichartiger Zellen',
      wissen:
        'Ein Gewebe ist ein Verband ähnlich differenzierter Zellen mit gemeinsamer Funktion, z. B. Muskel- oder Nervengewebe. Mehrere Gewebe bilden Organe.',
    },
    {
      term: 'Organ',
      meaning: 'Funktionseinheit aus Geweben',
      wissen:
        'Ein Organ vereint mehrere Gewebe zu einer Funktionseinheit, z. B. Leber oder Blatt. Organe sind in Organsysteme eingebunden.',
    },
    {
      term: 'Membran',
      meaning: 'Selektive Barriere',
      wissen:
        'Biomembranen aus Lipid-Doppelschicht und Proteinen sind selektive Barrieren. Sie steuern Stofftransport und tragen Rezeptoren für Signale.',
    },
    {
      term: 'Golgi-Apparat',
      meaning: 'Verpackung und Modifikation von Proteinen',
      wissen:
        'Der Golgi-Apparat modifiziert, sortiert und verpackt Proteine und Lipide in Vesikel. Er arbeitet eng mit dem ER zusammen. Viele Sekrete verlassen die Zelle über den Golgi-Weg.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:kOberstufe:in-differenzierten-zellen-ist-die-dna-im',
      statement: 'In differenzierten Zellen ist die DNA immer vollständig gelöscht.',
      correct: false,
      explanation: 'Meist gleiche DNA — unterschiedliche Genaktivität.',
      wissen:
        'Differenzierte Körperzellen eines Individuums besitzen in der Regel denselben DNA-Bestand. Unterschiedliche Funktionen entstehen durch Genregulation (welche Gene abgelesen werden). Vollständiges Löschen der DNA ist nicht der Normalfall der Differenzierung.',
    },
    {
      concept: 'bio:kOberstufe:prokaryoten-ohne-echten-kern',
      statement: 'Prokaryoten besitzen keinen echten Zellkern.',
      correct: true,
      explanation: 'DNA liegt im Nucleoid, nicht kernmembranumschlossen.',
      wissen:
        'Bakterien und Archaeen sind Prokaryoten: ihre DNA liegt nicht in einem kernmembranumschlossenen Kern, sondern im Nucleoid. Eukaryoten haben dagegen einen echten Zellkern und weitere Organellen.',
    },
  ],
  multis: [
    {
      concept: 'bio:kOberstufe:welche-strukturen-sind-eukaryotische-org',
      question: 'Welche Strukturen sind eukaryotische Organellen?',
      correct: ['Mitochondrien', 'Zellkern'],
      wrong: ['Nur Chitinpanzer außen', 'Nur Federfahnen'],
      explanation: 'Organellen in Eukaryoten.',
      wissen:
        'Organellen sind membranumschlossene oder klar abgegrenzte Funktionsräume in Eukaryoten. Mitochondrien liefern ATP, der Zellkern enthält die Chromosomen-DNA. Viele Organellen ermöglichen so Kompartimentierung.',
    },
  ],
}

const stoffwechsel: BioBank = {
  quelle: 'Wikipedia: Zellatmung',
  url: 'https://de.wikipedia.org/wiki/Zellatmung',
  conceptPrefix: 'bio:kOberstufe:stoffwechsel',
  facts: [
    {
      concept: 'bio:kOberstufe:assimilation-bedeutet-grob',
      prompt: 'Assimilation bedeutet grob …',
      answer: 'Aufbau körpereigener Stoffe (z. B. Fotosynthese)',
      wrong: ['Nur Abbau zu CO₂ ohne Ausnahme', 'Nur Knochenbruch', 'Nur Impfung'],
      explanation: 'Assimilation vs. Dissimilation.',
      wissen:
        'Assimilation bezeichnet den Aufbau körpereigener Stoffe aus aufgenommenen oder selbst gebildeten Vorstufen. Ein Schulbeispiel ist die Fotosynthese: aus CO₂ und Wasser entstehen Zucker. Dissimilation ist der energetische Abbau; beide sind im Stoffwechsel verknüpft.',
      gap: 'Bei der Zellatmung wird Glucose oxidiert; Energie wird als ___ nutzbar.',
      gapAccepted: ['ATP', 'ATP-Energie', 'Adenosintriphosphat'],
    },
    {
      concept: 'bio:kOberstufe:dissimilation-z-b-zellatmung',
      prompt: 'Dissimilation (z. B. Zellatmung) …',
      answer: 'baut energiereiche Stoffe ab und stellt ATP bereit',
      wrong: ['erzeugt Zucker nur aus Licht ohne Enzyme', 'löscht Gene', 'bildet nur Chlorophyll'],
      explanation: 'Katabolismus liefert ATP.',
      wissen:
        'Dissimilation (Katabolismus) baut energiereiche organische Stoffe ab und stellt nutzbare Energie bereit, vor allem als ATP. Bei aerober Zellatmung wird Glucose oxidiert; CO₂ und H₂O entstehen. Die gewonnenen Reduktionsäquivalente treiben die Atmungskette.',
    },
    {
      concept: 'bio:kOberstufe:enzyme-senken',
      prompt: 'Enzyme senken …',
      answer: 'die Aktivierungsenergie von Reaktionen',
      wrong: ['die Lichtgeschwindigkeit', 'die Chromosomenzahl immer auf null', 'den pH auf 14 fest'],
      explanation: 'Biokatalysatoren — Stoffwechsel.',
      wissen:
        'Enzyme sind Biokatalysatoren: sie senken die Aktivierungsenergie und beschleunigen so Stoffwechselreaktionen, ohne selbst verbraucht zu werden. Substratspezifität und Regulation (z. B. Hemmung) steuern, welche Wege in der Zelle laufen. Ohne Enzyme wären viele Reaktionen bei Körpertemperatur zu langsam.',
    },
  ],
  pairs: [
    {
      term: 'ATP',
      meaning: 'universeller Energieträger der Zelle',
      wissen:
        'ATP (Adenosintriphosphat) speichert und überträgt Energie für endergone Prozesse. Bei Hydrolyse zu ADP+Pᵢ wird nutzbare Energie freigesetzt. Stoffwechselwege sind oft an ATP-Gewinn oder -Verbrauch gekoppelt.',
    },
    {
      term: 'Redoxreaktion',
      meaning: 'Elektronenübertragung',
      wissen:
        'Bei Redoxreaktionen werden Elektronen übertragen: Oxidation gibt ab, Reduktion nimmt auf. In Atmungskette und Fotosynthese treiben Redoxketten den Energieumsatz. NAD⁺/NADH und ähnliche Träger vermitteln viele Schritte.',
    },
    {
      term: 'Glykolyse',
      meaning: 'Abbau von Glucose im Cytoplasma',
      wissen:
        'Die Glykolyse spaltet Glucose im Cytoplasma zu Pyruvat und liefert ATP sowie NADH. Sie ist der Einstieg in aerobe und anaerobe Wege. Bei Sauerstoffmangel kann Gärung folgen.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:kOberstufe:fotosynthese-und-zellatmung-sind-stoffli',
      statement: 'Fotosynthese und Zellatmung sind stofflich/energetisch miteinander verknüpft.',
      correct: true,
      explanation: 'Produkte der einen sind Edukte der anderen (vereinfacht).',
      wissen:
        'Fotosynthese baut Zucker auf und setzt O₂ frei; Zellatmung oxidiert organische Stoffe und braucht oft O₂. CO₂, H₂O und energiereiche Moleküle verbinden beide Prozesse im globalen und zellulären Kreislauf. Schulmodell: Produkte der einen sind Edukte der anderen.',
    },
  ],
  sorts: [
    {
      concept: 'bio:kOberstufe:ordne-grob-stationen-der-aeroben-dissimi',
      question: 'Ordne grob Stationen der aeroben Dissimilation.',
      labels: ['Glykolyse', 'Citratzyklus', 'Atmungskette'],
      explanation: 'Klassische Abfolge im Schulmodell.',
      wissen:
        'Aerobe Dissimilation: Glykolyse im Cytoplasma, dann Citratzyklus in der Mitochondrien-Matrix, danach Atmungskette an der inneren Mitochondrienmembran. Dort entsteht der größte ATP-Gewinn. Pyruvat bzw. Acetyl-CoA verknüpft die Stationen.',
    },
  ],
}

const oekologie: BioBank = {
  quelle: 'Wikipedia: Ökologie',
  url: 'https://de.wikipedia.org/wiki/%C3%96kologie',
  conceptPrefix: 'bio:kOberstufe:oekologie',
  facts: [
    {
      concept: 'bio:kOberstufe:nachhaltigkeit-meint-im-oekologischen-ko',
      prompt: 'Nachhaltigkeit meint im ökologischen Kontext grob …',
      answer: 'Ressourcen so nutzen, dass zukünftige Generationen nicht gefährdet werden',
      wrong: ['Sofortiger Totalverbrauch aller Vorräte', 'Nur Einweg ohne Recyclinggedanken', 'Ignorieren von Stoffkreisläufen'],
      explanation: 'Ökologie und Nachhaltigkeit — Lehrplan LB.',
      wissen:
        'Nachhaltigkeit bedeutet, natürliche Ressourcen so zu nutzen, dass Ökosysteme und künftige Generationen nicht nachhaltig geschädigt werden. Dazu gehören Kreislaufdenken, schonender Verbrauch und Schutz der Biodiversität. Ökosystemdienstleistungen (z. B. Bestäubung, Wasserfilter) machen den gesellschaftlichen Wert deutlich.',
    },
    {
      concept: 'bio:kOberstufe:ein-begrenzender-faktor',
      prompt: 'Ein begrenzender Faktor …',
      answer: 'schränkt Wachstum/Verbreitung einer Population ein',
      wrong: ['erhöht immer unbegrenzt die Population', 'löscht Physikgesetze', 'ist nur der Wochentag'],
      explanation: 'Liebig/Minimumfaktor-Ideen im Unterricht.',
      wissen:
        'Begrenzende (limitierende) Faktoren wie Nahrung, Licht, Raum oder Temperatur drosseln Wachstum und Verbreitung einer Population. Das Minimumgesetz (Liebig) betont: der knappste Faktor bestimmt den Ertrag. In der Populationsökologie erklären solche Faktoren Tragfähigkeit und Dichteabhängigkeit.',
    },
    {
      concept: 'bio:kOberstufe:abiotische-faktoren',
      prompt: 'Abiotische Umweltfaktoren sind …',
      answer: 'unbelebte Einflüsse wie Temperatur, Licht, Wasser, pH',
      wrong: ['nur Konkurrenz zwischen Arten', 'nur Fressfeinde', 'nur Symbiosen'],
      explanation: 'Unbelebte vs. belebte Faktoren.',
      wissen:
        'Abiotische Faktoren sind unbelebte Umweltbedingungen (Temperatur, Licht, Wasser, Boden, pH). Biotische Faktoren entstehen durch andere Lebewesen (Konkurrenz, Räuber, Symbiose). Beide prägen Verbreitung und Ökosystemstrukturen.',
    },
    {
      concept: 'bio:kOberstufe:stoffkreislauf',
      prompt: 'Stoffkreisläufe in Ökosystemen …',
      answer: 'führen Stoffe zwischen belebter und unbelebter Natur hin und her',
      wrong: ['existieren nie', 'löschen immer alle Populationen', 'gelten nur im Weltraum'],
      explanation: 'z. B. Kohlenstoff- und Stickstoffkreislauf.',
      wissen:
        'In Stoffkreisläufen (z. B. C, N) werden Elemente zwischen Atmosphäre, Boden, Wasser und Organismen ausgetauscht. Produzenten, Konsumenten und Destruenten sind zentrale Stationen. Menschliche Eingriffe können Kreisläufe stören (z. B. CO₂-Anstieg).',
    },
    {
      concept: 'bio:kOberstufe:trockenpyramide',
      prompt: 'Warum nimmt die Biomasse in einer Nahrungskette oft nach oben ab?',
      answer: 'Weil auf jeder Stufe Energie verloren geht (z. B. als Wärme)',
      wrong: ['Weil Physikgesetze aussetzen', 'Weil Produzenten keine Photosynthese betreiben', 'Weil Destruenten fehlen immer'],
      explanation: 'Energiefluss und ökologische Pyramide.',
      wissen:
        'Entlang der Nahrungskette geht Energie verloren (Atmung, Wärme, unverwertete Reste). Deshalb sind Biomasse und verfügbare Energie auf höheren Trophieebenen geringer. Ökologische Pyramiden veranschaulichen das.',
    },
  ],
  pairs: [
    {
      term: 'Tragfähigkeit',
      meaning: 'Maximale Population langfristig',
      wissen:
        'Die Tragfähigkeit (K) ist die Individuenzahl, die ein Lebensraum langfristig tragen kann. Sie hängt von Ressourcen und abiotischen Bedingungen ab. Logistisches Wachstum nähert sich K an.',
    },
    {
      term: 'Biodiversität',
      meaning: 'Vielfalt der Arten/Gene/Ökosysteme',
      wissen:
        'Biodiversität umfasst genetische Vielfalt, Artenvielfalt und Vielfalt der Ökosysteme. Hohe Vielfalt kann Stabilität und Anpassungsfähigkeit fördern. Schutzziele richten sich oft auf alle drei Ebenen.',
    },
    {
      term: 'Anthropogener Einfluss',
      meaning: 'Menschliche Einwirkung',
      wissen:
        'Anthropogene Einflüsse sind menschliche Eingriffe: Emissionen, Landnutzung, Übernutzung, Versiegelung. Sie verändern Stoffkreisläufe und Lebensräume. Viele Nachhaltigkeitsmaßnahmen zielen darauf, diese Wirkungen zu verringern.',
    },
    {
      term: 'Produzent',
      meaning: 'Autotrophe Basis der Nahrungskette',
      wissen:
        'Produzenten (meist grüne Pflanzen oder Algen) bilden Biomasse aus anorganischen Stoffen, oft durch Fotosynthese. Sie sind die energetische Basis der meisten Ökosysteme.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:kOberstufe:oekosystemdienstleistungen-z-b-bestaeubu',
      statement: 'Ökosystemdienstleistungen (z. B. Bestäubung, Wasserfilter) haben gesellschaftlichen Wert.',
      correct: true,
      explanation: 'Naturleistungen stützen Wirtschaft und Gesundheit.',
      wissen:
        'Ökosystemdienstleistungen sind Nutzen der Natur für den Menschen, z. B. Bestäubung, Wasserreinigung, Klimaregulation. Sie stützen Landwirtschaft, Gesundheit und Wirtschaft. Ihr Verlust durch Lebensraumzerstörung hat messbare gesellschaftliche Kosten.',
    },
  ],
  multis: [
    {
      concept: 'bio:kOberstufe:welche-massnahmen-koennen-nachhaltigkeit',
      question: 'Welche Maßnahmen können Nachhaltigkeit fördern?',
      correct: ['Ressourcen schonen', 'Kreisläufe schließen', 'Vielfalt schützen'],
      wrong: ['Unbegrenzte Verschwendung', 'Lebensräume flächendeckend versiegeln'],
      explanation: 'Handlungsfelder.',
      wissen:
        'Nachhaltiges Handeln umfasst Ressourcenschonung, Schließen von Stoffkreisläufen und Schutz der biologischen Vielfalt. Versiegelung und unbegrenzte Verschwendung wirken dem entgegen. Systemdenken verknüpft lokale Maßnahmen mit globalen Folgen.',
    },
  ],
}

const genetikOS: BioBank = {
  quelle: 'Wikipedia: Polymerase-Kettenreaktion',
  url: 'https://de.wikipedia.org/wiki/Polymerase-Kettenreaktion',
  conceptPrefix: 'bio:kOberstufe:genetik',
  facts: [
    {
      concept: 'bio:kOberstufe:was-beschreibt-pcr-grob',
      prompt: 'Was beschreibt PCR grob?',
      answer: 'Vervielfältigung von DNA-Abschnitten',
      wrong: ['Nur Knochenheilung', 'Nur Transpiration', 'Nur Impfung mit Bakterien immer'],
      explanation: 'Molekularbiologische Amplifikation ausgewählter DNA-Abschnitte.',
      wissen:
        'Die Polymerase-Kettenreaktion (PCR) vervielfältigt gezielt ausgewählte DNA-Abschnitte in wiederholten Temperaturzyklen. Jeder Zyklus umfasst Denaturierung (Aufschmelzen bei ca. 95 °C), Anlagerung passender Primer und Elongation durch eine hitzeresistente DNA-Polymerase (z. B. Taq). Die Ziel-DNA wächst näherungsweise exponentiell; Anwendungen sind Diagnostik, Forensik und Gentechnik.',
      gap: 'PCR dient der gezielten ___ bestimmter DNA-Abschnitte.',
      gapAccepted: ['Vervielfältigung', 'Amplifikation', 'Vermehrung'],
    },
    {
      concept: 'bio:kOberstufe:proteinbiosynthese-ueber-mrna',
      prompt: 'Welche Rolle spielt mRNA bei der Proteinbiosynthese?',
      answer: 'Sie überträgt die genetische Information von der DNA zu den Ribosomen',
      wrong: ['Sie verdaut nur Stärke im Darm', 'Sie ist ausschließlich Zellwandstoff', 'Sie speichert nur Fettenergie'],
      explanation: 'mRNA ist die Boten-RNA der Translation.',
      wissen:
        'Bei der Proteinbiosynthese wird die DNA-Information zuerst in mRNA umgeschrieben (Transkription) und dann an Ribosomen in Aminosäuresequenzen übersetzt (Translation). mRNA trägt die Codons; tRNA bringt passende Aminosäuren. PCR vervielfältigt DNA — sie ist nicht derselbe Prozess wie die Proteinbiosynthese.',
      gap: 'Bei der Proteinbiosynthese wird die DNA-Information über ___ in Aminosäuresequenzen übersetzt.',
      gapAccepted: ['mRNA', 'Messenger-RNA', 'Boten-RNA'],
    },
    {
      concept: 'bio:kOberstufe:ein-ethischer-aspekt-der-gentechnik-ist',
      prompt: 'Ein ethischer Aspekt der Gentechnik ist …',
      answer: 'Abwägung von Nutzen, Risiken und gesellschaftlichen Folgen',
      wrong: ['dass Ethik irrelevant sei', 'dass nur Farbe zählt', 'dass Physik entfällt'],
      explanation: 'Perspektiven der Genetik — Bewerten lernen.',
      wissen:
        'Gentechnik wirft ethische Fragen zu Nutzen, Risiken, Gerechtigkeit und Eingriffstiefe auf (z. B. Landwirtschaft, Medizin, Keimbahn). Fachlich fundiertes Bewerten trennt machbare Technik von wünschenswerten Anwendungen. Transparenz und Risikoabschätzung gehören zur Urteilsbildung.',
    },
    {
      concept: 'bio:kOberstufe:transkription-bedeutet',
      prompt: 'Transkription bedeutet grob …',
      answer: 'Umschreiben von DNA in RNA',
      wrong: ['nur Translation am Ribosom', 'nur PCR-Amplifikation', 'nur Meiose ohne RNA'],
      explanation: 'Erster Schritt der Genexpression.',
      wissen:
        'Transkription ist das Umschreiben eines DNA-Abschnitts in RNA durch RNA-Polymerase. Bei Protein-codierenden Genen entsteht oft mRNA (nach Reifung). Die Basenfolge der RNA entspricht der Vorlage (mit U statt T).',
      gap: 'Bei der ___ wird DNA-Information in RNA umgeschrieben.',
      gapAccepted: ['Transkription', 'Transcription'],
    },
  ],
  pairs: [
    {
      term: 'Transkription',
      meaning: 'DNA → RNA',
      wissen:
        'Transkription schreibt DNA-Abschnitte in RNA um. Sie findet im Zellkern der Eukaryoten statt. Die RNA kann anschließend prozessiert und translatiert werden.',
    },
    {
      term: 'Translation',
      meaning: 'RNA → Protein',
      wissen:
        'Translation liest mRNA-Codons am Ribosom und verknüpft Aminosäuren zur Polypeptidkette. tRNA vermittelt die Zuordnung. Zusammen mit Transkription bildet das das zentrale Dogma im Schulmodell.',
    },
    {
      term: 'Vektor',
      meaning: 'Transportmittel für DNA (z. B. Plasmid)',
      wissen:
        'In der Gentechnik transportiert ein Vektor (z. B. Plasmid, Virusvektor) Fremd-DNA in Wirtszellen. Restriktionsenzyme und Ligase helfen beim Einbau. So können Gene kloniert oder exprimiert werden.',
    },
    {
      term: 'PCR',
      meaning: 'Enzymatische Amplifikation von DNA',
      wissen:
        'PCR amplifiziert DNA-Abschnitte zyklisch mit Primer und hitzeresistenter Polymerase. Sie braucht Template, dNTPs und definierte Temperaturen. Ergebnis sind viele Kopien der Zielsequenz.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:kOberstufe:klassische-zuechtung-veraendert-ebenfall',
      statement: 'Klassische Züchtung verändert ebenfalls die genetische Ausstattung von Populationen.',
      correct: true,
      explanation: 'Selektion durch Menschen — Vergleich zur Gentechnik.',
      wissen:
        'Klassische Züchtung selektiert gewünschte Merkmale über Generationen und verändert so Allelfrequenzen in Populationen. Gentechnik kann gezielt einzelne Gene einfügen oder verändern. Beide greifen in die genetische Ausstattung ein — mit unterschiedlicher Geschwindigkeit und Präzision.',
    },
  ],
  sorts: [
    {
      concept: 'bio:kOberstufe:ordne-die-genexpression',
      question: 'Ordne die Genexpression.',
      labels: ['DNA', 'mRNA', 'Protein'],
      explanation: 'Zentrales Dogma (Schulmodell).',
      wissen:
        'Im zentralen Dogma fließt Information von DNA über mRNA zum Protein: Transkription erzeugt mRNA, Translation baut das Polypeptid. DNA bleibt Speichermedium; Proteine übernehmen viele Zellfunktionen. Ausnahmen und Regulation werden in der Oberstufe vertieft.',
    },
  ],
}

const kommunikation: BioBank = {
  quelle: 'Wikipedia: Signaltransduktion',
  url: 'https://de.wikipedia.org/wiki/Signaltransduktion',
  conceptPrefix: 'bio:kOberstufe:kommunikation',
  facts: [
    {
      concept: 'bio:kOberstufe:zellulaere-kommunikation-braucht-typisch',
      prompt: 'Zelluläre Kommunikation braucht typischerweise …',
      answer: 'Signal, Rezeptor und nachfolgende Antwort der Zelle',
      wrong: ['nur Zufall ohne Moleküle', 'nur Federkleid', 'nur Holzfasern'],
      explanation: 'Ligand–Rezeptor–Kaskade.',
      wissen:
        'Zelluläre Kommunikation läuft typischerweise über Signalstoff (Ligand), spezifischen Rezeptor und eine zelluläre Antwort (z. B. Genexpression, Stoffwechseländerung). Second Messenger können das Signal verstärken. Hormone und Neurotransmitter sind wichtige Signalbeispiele.',
      gap: 'Hormone und Neurotransmitter sind Beispiele für ___.',
      gapAccepted: ['Signale', 'Botenstoffe', 'Signalstoffe'],
    },
    {
      concept: 'bio:kOberstufe:hormon-vs-nerv',
      prompt: 'Im Vergleich zur Nervenleitung wirken Hormone oft …',
      answer: 'langsamer, aber länger und über den Blutweg',
      wrong: ['immer nur lokal an einer Synapse in Millisekunden', 'nur in Pflanzenwurzeln', 'gar nicht auf Zellen'],
      explanation: 'Endokrines vs. neuronales System.',
      wissen:
        'Hormone werden meist über das Blut transportiert und wirken an Zellen mit passenden Rezeptoren — oft langsamer und nachhaltiger als synaptische Signalübertragung. Nervenimpulse sind schnell und lokal begrenzt. Beide Systeme kooperieren bei der Homöostase.',
    },
    {
      concept: 'bio:kOberstufe:neurotransmittter',
      prompt: 'Neurotransmitter …',
      answer: 'übertragen Signale an chemischen Synapsen',
      wrong: ['sind nur Zellwandstoffe', 'ersetzen immer DNA', 'sind nur Abfallprodukte ohne Wirkung'],
      explanation: 'Chemische Signalstoffe der Nervenzelle.',
      wissen:
        'Neurotransmitter werden aus Vesikeln in den synaptischen Spalt freigesetzt und binden an postsynaptische Rezeptoren. Beispiele im Schulkontext: Acetylcholin, Dopamin. Danach werden sie abgebaut oder wieder aufgenommen.',
    },
    {
      concept: 'bio:kOberstufe:signalverstaerkung',
      prompt: 'Eine Signaltransduktionskaskade kann …',
      answer: 'ein schwaches äußeres Signal stark verstärken',
      wrong: ['Signale immer abschalten und nie verstärken', 'nur Chromosomen verdoppeln', 'nur Zellwände abbauen'],
      explanation: 'Amplifikation in der Zelle.',
      wissen:
        'Enzymkaskaden und Second Messenger verstärken Signale: wenige aktivierte Rezeptoren können viele nachgeschaltete Moleküle beeinflussen. Das ermöglicht empfindliche und abgestufte Antworten. Fehlregulation spielt in Krankheiten eine Rolle.',
    },
  ],
  pairs: [
    {
      term: 'Rezeptor',
      meaning: 'Bindungsstelle für Signalstoff',
      wissen:
        'Rezeptoren binden Signalstoffe spezifisch (Schlüssel-Schloss). Ohne passenden Rezeptor bleibt ein Ligand an der Zielzelle wirkungslos. Rezeptoren können membranständig oder intrazellulär sein.',
    },
    {
      term: 'Second Messenger',
      meaning: 'Intrazellulärer Botenstoff',
      wissen:
        'Second Messenger (z. B. cAMP, Ca²⁺) verstärken und verteilen Signale innerhalb der Zelle. Sie entstehen nach Rezeptoraktivierung. So reicht ein äußeres Signal für eine starke Antwort.',
    },
    {
      term: 'Synapse',
      meaning: 'Kontaktstelle zwischen Nervenzellen',
      wissen:
        'An chemischen Synapsen setzen Nervenzellen Transmitter frei, die an postsynaptische Rezeptoren binden. Elektrische Synapsen koppeln Zellen direkter. Synapsen sind zentrale Orte neuronaler Kommunikation.',
    },
    {
      term: 'Hormon',
      meaning: 'Botenstoff des endokrinen Systems',
      wissen:
        'Hormone werden von Drüsen gebildet und steuern Zielzellen über Rezeptoren. Konzentration und Timing sind entscheidend. Störungen der Hormonachse haben systemische Folgen.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:kOberstufe:ohne-passende-rezeptoren-bleibt-ein-sign',
      statement: 'Ohne passende Rezeptoren bleibt ein Signalstoff an der Zielzelle wirkungslos.',
      correct: true,
      explanation: 'Schlüssel-Schloss-Prinzip.',
      wissen:
        'Die Spezifität der Signalwirkung beruht auf passenden Rezeptoren. Fehlt der Rezeptor, bindet der Signalstoff nicht und löst keine Kaskade aus. Dasselbe Molekül kann an anderen Zelltypen völlig anders wirken.',
    },
    {
      concept: 'bio:kOberstufe:alle-zellen-gleiche-rezeptoren',
      statement: 'Alle Körperzellen besitzen dieselben Rezeptoren für jedes Hormon.',
      correct: false,
      explanation: 'Rezeptorausstattung ist zelltypspezifisch.',
      wissen:
        'Nur Zellen mit passenden Rezeptoren reagieren auf ein bestimmtes Hormon. Deshalb wirken Hormone selektiv, obwohl sie oft im ganzen Körper verteilt werden.',
    },
  ],
}

const biodiversitaet: BioBank = {
  quelle: 'Wikipedia: Biodiversität',
  url: 'https://de.wikipedia.org/wiki/Biodiversit%C3%A4t',
  conceptPrefix: 'bio:kOberstufe:biodiversitaet',
  facts: [
    {
      concept: 'bio:kOberstufe:biodiversitaet-umfasst',
      prompt: 'Biodiversität umfasst …',
      answer: 'Vielfalt der Gene, Arten und Ökosysteme',
      wrong: ['nur eine einzelne Laborzelle', 'nur Schulnoten', 'nur Metalllegierungen'],
      explanation: 'Drei Ebenen der Vielfalt.',
      wissen:
        'Biodiversität meint genetische Vielfalt innerhalb von Arten, die Vielfalt der Arten selbst und die Vielfalt der Ökosysteme. Alle drei Ebenen hängen zusammen: ohne genetische Vielfalt fehlt Anpassungspotenzial. Artenschutz und Lebensraumschutz greifen oft ineinander.',
    },
    {
      concept: 'bio:kOberstufe:invasive-arten',
      prompt: 'Invasive Arten können Biodiversität gefährden, weil sie …',
      answer: 'heimische Arten verdrängen oder Lebensgemeinschaften verändern',
      wrong: ['immer die genetische Vielfalt erhöhen', 'nur Schulbücher betreffen', 'nie mit Nahrungsnetzen wechselwirken'],
      explanation: 'Neozoen/Neophyten im Ökosystem.',
      wissen:
        'Eingeschleppte Arten können Konkurrenz, Prädation oder Krankheitsdruck erhöhen und heimische Arten zurückdrängen. Nicht jede Neubürger-Art ist invasiv — problematisch wird sie bei starker Ausbreitung und ökologischen Schäden.',
    },
    {
      concept: 'bio:kOberstufe:endemiten',
      prompt: 'Endemische Arten …',
      answer: 'kommen nur in einem begrenzten Gebiet natürlich vor',
      wrong: ['leben überall auf der Erde gleich häufig', 'sind immer invasiv', 'haben keine ökologische Nische'],
      explanation: 'Räumlich begrenzte Verbreitung.',
      wissen:
        'Endemiten sind auf ein bestimmtes Gebiet beschränkt. Inseln und isolierte Lebensräume haben oft viele Endemiten. Habitatverlust trifft sie besonders hart, weil Ausweichräume fehlen.',
    },
    {
      concept: 'bio:kOberstufe:rote-liste',
      prompt: 'Rote Listen dienen vor allem dazu …',
      answer: 'den Gefährdungsgrad von Arten zu dokumentieren',
      wrong: ['nur Schulnoten festzulegen', 'invasive Arten zu züchten', 'Stoffwechselwege zu messen'],
      explanation: 'Gefährdungseinstufung.',
      wissen:
        'Rote Listen stufen Arten nach Gefährdung ein und helfen bei Schutzprioritäten. Sie basieren auf Bestandsdaten und Trendabschätzungen. Politische und praktische Schutzmaßnahmen können daran ansetzen.',
    },
  ],
  pairs: [
    {
      term: 'Artenschutz',
      meaning: 'Maßnahmen zum Erhalt von Arten',
      wissen:
        'Artenschutz umfasst rechtliche und praktische Maßnahmen, bedrohte Arten zu erhalten. Dazu gehören Schutzgebiete, Jagdregeln und Wiederansiedlung. Ohne Lebensraumschutz bleibt Artenschutz oft wirkungslos.',
    },
    {
      term: 'Habitatverlust',
      meaning: 'Lebensraumzerstörung',
      wissen:
        'Habitatverlust durch Rodung, Versiegelung oder Intensivlandwirtschaft ist eine Hauptgefährdung der Artenvielfalt. Fragmentierung isoliert Populationen. Wiederherstellung von Lebensräumen wirkt dem entgegen.',
    },
    {
      term: 'Genetische Vielfalt',
      meaning: 'Unterschiedliche Allele in Populationen',
      wissen:
        'Genetische Vielfalt innerhalb einer Population erhöht die Chance, auf Umweltänderungen zu reagieren. Engpässe und Inzucht verringern sie. Evolution und Artenschutz berücksichtigen deshalb auch Allelfrequenzen.',
    },
    {
      term: 'Hotspot',
      meaning: 'Region mit besonders hoher Artenvielfalt',
      wissen:
        'Biodiversitäts-Hotspots sind Regionen mit außergewöhnlich vielen Arten, oft mit hohem Endemitenanteil und starker Bedrohung. Schutz dort ist besonders wirksam pro Fläche.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:kOberstufe:hoehere-genetische-vielfalt-kann-populat',
      statement: 'Höhere genetische Vielfalt kann Populationen robuster gegen Umweltänderungen machen.',
      correct: true,
      explanation: 'Anpassungspotenzial.',
      wissen:
        'Mit mehr Allelkombinationen steigen die Chancen, dass Teile der Population neue Bedingungen überleben. Das ist evolutionäres Anpassungspotenzial. Sehr kleine, genetisch enge Populationen sind oft anfälliger.',
    },
    {
      concept: 'bio:kOberstufe:monokultur-foerdert-vielfalt',
      statement: 'Flächendeckende Monokulturen fördern in der Regel die Artenvielfalt.',
      correct: false,
      explanation: 'Monokulturen verringern Habitat- und Artenvielfalt.',
      wissen:
        'Monokulturen vereinheitlichen Lebensräume und reduzieren Nischen. Schädlingsanfälligkeit kann steigen. Vielfalt fördernde Nutzung belässt Strukturen und Randbiotope.',
    },
  ],
  multis: [
    {
      concept: 'bio:kOberstufe:welche-prozesse-foerdern-biodiversitaet-',
      question: 'Welche Prozesse fördern Biodiversität langfristig?',
      correct: ['Artbildung', 'Angepasste Nutzung/Schutz'],
      wrong: ['Flächendeckende Monokultur überall', 'Vollständige Lebensraumvernichtung'],
      explanation: 'Entstehung und Erhalt.',
      wissen:
        'Artbildung und der Erhalt vielfältiger Lebensräume fördern Biodiversität langfristig. Monokulturen und flächendeckende Lebensraumvernichtung verringern sie. Nachhaltige Nutzung kann Vielfalt stützen, wenn sie Lebensräume erhält.',
    },
  ],
}

const verhalten: BioBank = {
  quelle: 'Wikipedia: Verhaltensbiologie',
  url: 'https://de.wikipedia.org/wiki/Verhaltensbiologie',
  conceptPrefix: 'bio:kOberstufe:verhalten',
  facts: [
    {
      concept: 'bio:kOberstufe:angeborenes-verhalten',
      prompt: 'Angeborenes Verhalten …',
      answer: 'tritt ohne Lernen in typischer Form auf (Schulmodell)',
      wrong: ['existiert nie', 'ist immer nur Kultur', 'braucht immer Schrift'],
      explanation: 'Erbkoordination vs. Lernen — vereinfacht.',
      wissen:
        'Im ethologischen Schulmodell treten angeborene Verhaltensweisen in typischer Form ohne vorheriges Lernen auf (Erbkoordination). Schlüsselreize können sie auslösen. Lernen verändert Verhalten dagegen durch Erfahrung; beides wirkt oft zusammen.',
    },
    {
      concept: 'bio:kOberstufe:schluesselreiz',
      prompt: 'Ein Schlüsselreiz …',
      answer: 'löst eine erbkoordinierte Verhaltensweise aus',
      wrong: ['ist immer nur ein Schulbuch', 'löscht immer Gene', 'ist nur ATP'],
      explanation: 'Klassische Ethologie.',
      wissen:
        'Ein Schlüsselreiz ist ein spezifischer Reiz, der eine Erbkoordination auslöst. Die Reaktion folgt oft einem festen Muster. In der klassischen Ethologie erklärt das angeborene Verhaltensprogramme.',
    },
  ],
  pairs: [
    {
      term: 'Schlüsselreiz',
      meaning: 'Auslöser einer Erbkoordination',
      wissen:
        'Schlüsselreize starten angeborene Verhaltensabläufe. Sie sind oft artspezifisch und relativ einfach. Fehlende oder übertriebene Reize können Verhalten stören.',
    },
    {
      term: 'Lernen',
      meaning: 'Verhaltensänderung durch Erfahrung',
      wissen:
        'Lernen ändert Verhalten aufgrund von Erfahrung, z. B. durch Konditionierung oder Prägung. Es ergänzt angeborene Programme. Beim Menschen spielen Kultur und Biologie zusammen.',
    },
    {
      term: 'Prägung',
      meaning: 'Schnelles Lernen in sensiblen Phasen',
      wissen:
        'Prägung ist ein schnelles, oft irreversibles Lernen in sensiblen Phasen (z. B. Nachfolgeprägung). Sie verknüpft angeborene Bereitschaft mit Erfahrung. Timing der Phase ist entscheidend.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:kOberstufe:menschliches-verhalten-ist-rein-genetisc',
      statement: 'Menschliches Verhalten ist rein genetisch und nie kulturell beeinflusst.',
      correct: false,
      explanation: 'Biologie und Kultur wirken zusammen.',
      wissen:
        'Menschliches Verhalten entsteht aus Wechselwirkung von biologischen Voraussetzungen und kultureller Prägung. Gene setzen Rahmen; Lernen, Sprache und Normen formen Ausprägung. Rein genetische Erklärungen greifen zu kurz.',
    },
  ],
}

const systematikOS: BioBank = {
  quelle: 'Wikipedia: Systematik (Biologie)',
  url: 'https://de.wikipedia.org/wiki/Systematik_(Biologie)',
  conceptPrefix: 'bio:kOberstufe:systematik',
  facts: [
    {
      concept: 'bio:kOberstufe:systematisierung-und-vernetztheit-betont',
      prompt: 'Systematisierung und Vernetztheit betont …',
      answer: 'Zusammenhänge zwischen Teilgebieten der Biologie',
      wrong: ['nur isolierte Fakten ohne Bezug', 'nur Orthografie', 'nur Sportregeln'],
      explanation: 'Systematik und Vernetzung der biologischen Teilgebiete.',
      wissen:
        'Systematisierung ordnet biologisches Wissen; Vernetztheit betont Zusammenhänge zwischen Zellbiologie, Genetik, Stoffwechsel und Ökologie. Ein Beispiel: genetische Variation ermöglicht Anpassung in Populationen. Isolierte Fakten ohne Bezug reichen für Verständnis und Bewertung nicht.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:kOberstufe:zellbiologie-genetik-und-oekologie-lasse',
      statement: 'Zellbiologie, Genetik und Ökologie lassen sich sinnvoll verknüpfen.',
      correct: true,
      explanation: 'z. B. Genetik der Anpassung in Populationen.',
      wissen:
        'Zelluläre Prozesse (z. B. Photosynthese, Signalwege) wirken auf Organismen; genetische Variation und Selektion prägen Populationen; Ökologie beschreibt Wechselwirkungen mit der Umwelt. Vernetztes Denken erklärt z. B. Anpassung und Artenschutz. Die Oberstufe trainiert genau diese Brücken.',
    },
  ],
  sorts: [
    {
      concept: 'bio:kOberstufe:ordne-organisationsebenen-vom-kleinen-zu',
      question: 'Ordne Organisationsebenen vom Kleinen zum Großen.',
      labels: ['Molekül', 'Zelle', 'Organismus', 'Ökosystem'],
      explanation: 'Skalen der Biologie.',
      wissen:
        'Biologie betrachtet Skalen von Molekül über Zelle und Organismus bis zum Ökosystem. Jede Ebene hat eigene Strukturen und Wechselwirkungen. Prozesse einer Ebene bedingen oft die nächsthöhere.',
    },
  ],
}

/** Shared compact banks for Wahlbereiche — each fact carries real Fachwissen. */
const wahl = (title: string, wikiPath: string, facts: BioBank['facts'], extra?: Partial<BioBank>): BioBank => ({
  quelle: `Wikipedia: ${title}`,
  url: `https://de.wikipedia.org/wiki/${wikiPath}`,
  facts,
  ...extra,
})

export const BIOLOGIE_OBERSTUFE_GENERATORS: Record<string, Topic['generate']> = {
  'bi-gk11-lb1-zellen': bankGenerate(zellen),
  'bi-gk11-lb2-stoffwechsel': bankGenerate(stoffwechsel),
  'bi-gk11-lb3-oekologie': bankGenerate(oekologie),
  'bi-gk11-lb1-gewebe': bankGenerate(zellen),
  'bi-gk12-lb1-genetik': bankGenerate(genetikOS),
  'bi-gk12-lb1-dna': bankGenerate(genetikOS),
  'bi-gk12-lb1-anwendung': bankGenerate(genetikOS),
  'bi-gk12-lb2-kommunikation': bankGenerate(kommunikation),
  'bi-gk12-lb3-biodiversitaet': bankGenerate(biodiversitaet),
  'bi-gk12-lb3-artbildung': bankGenerate(biodiversitaet),
  'bi-gk12-lb3-schutz': bankGenerate(biodiversitaet),
  'bi-lk11-lb1-zellen': bankGenerate(zellen),
  'bi-lk11-lb1-gewebe': bankGenerate(zellen),
  'bi-lk11-lb2-stoffwechsel': bankGenerate(stoffwechsel),
  'bi-lk11-lb3-oekologie': bankGenerate(oekologie),
  'bi-lk12-lb1-genetik': bankGenerate(genetikOS),
  'bi-lk12-lb1-dna': bankGenerate(genetikOS),
  'bi-lk12-lb1-anwendung': bankGenerate(genetikOS),
  'bi-lk12-lb2-kommunikation': bankGenerate(kommunikation),
  'bi-lk12-lb3-verhalten': bankGenerate(verhalten),
  'bi-lk12-lb3-lernen': bankGenerate(verhalten),
  'bi-lk12-lb3-sozial': bankGenerate(verhalten),
  'bi-lk12-lb4-biodiversitaet': bankGenerate(biodiversitaet),
  'bi-lk12-lb4-artbildung': bankGenerate(biodiversitaet),
  'bi-lk12-lb4-schutz': bankGenerate(biodiversitaet),
  'bi-lk12-lb5-systematik': bankGenerate(systematikOS),
  'bi-lk12-lb5-ebenen': bankGenerate(systematikOS),
  'bi-lk12-lb5-vernetzung': bankGenerate(systematikOS),
  'bi-gk-lbw-wueste': bankGenerate(
    wahl(
      'Wüste',
      'W%C3%BCste',
      [
        {
          concept: 'bio:kOberstufe:welche-angepasstheit-hilft-wuestenpflanz',
          prompt: 'Welche Angepasstheit hilft Wüstenpflanzen oft?',
          answer: 'Wasserspeicherung / reduzierte Blätter / dicke Cuticula',
          wrong: ['Kiemenatmung', 'Federflug als Blatt', 'Blutkreislauf wie Säuger'],
          explanation: 'Wassersparen und -speichern sind typisch.',
          wissen:
            'Wüstenpflanzen speichern Wasser in Spross oder Blatt, reduzieren Verdunstungsfläche und schützen mit dicker Cuticula. Spaltöffnungen sind oft versenkt oder nachts geöffnet (CAM). So überstehen sie Trockenheit und hohe Einstrahlung.',
          gap: 'Viele Wüstenpflanzen speichern ___ in Spross oder Blatt.',
          gapAccepted: ['Wasser', 'Flüssigkeit'],
        },
      ],
      {
        conceptPrefix: 'bio:kOberstufe:wueste',
        pairs: [
          {
            term: 'CAM-Stoffwechsel',
            meaning: 'CO₂-Aufnahme vor allem nachts',
            wissen:
              'CAM-Pflanzen öffnen Spaltöffnungen nachts und speichern CO₂, um tagsüber Wasser zu sparen. Das ist eine typische Trockenheitsanpassung. Tagsüber läuft die Fotosynthese mit dem gespeicherten CO₂.',
          },
          {
            term: 'Sukkulenz',
            meaning: 'Wasserspeicherndes Gewebe',
            wissen:
              'Sukkulente Gewebe speichern große Wassermengen. Kakteen und viele Blattsukkulenten nutzen das. Zusammen mit reduzierter Oberfläche mindert das Trockenstress.',
          },
          {
            term: 'Cuticula',
            meaning: 'Wachsschicht gegen Verdunstung',
            wissen:
              'Eine dicke Cuticula verringert unkontrollierte Verdunstung. Sie liegt auf der Epidermis. In Wüsten ist sie oft besonders ausgeprägt.',
          },
        ],
      },
    ),
  ),
  'bi-gk-lbw-energie': bankGenerate(
    wahl('Grundumsatz', 'Grundumsatz', [
      {
        concept: 'bio:kOberstufe:grundumsatz-beschreibt-grob',
        prompt: 'Grundumsatz beschreibt grob …',
        answer: 'Energiebedarf in Ruhe',
        wrong: ['nur den Sprintrekord', 'nur die Blattfläche', 'nur die Chromosomenzahl'],
        explanation: 'Energiehaushalt von Mensch und Tier.',
        wissen:
          'Der Grundumsatz ist der Energiebedarf eines Organismus in völliger Ruhe zur Aufrechterhaltung lebenswichtiger Funktionen. Er hängt von Masse, Alter, Geschlecht und Temperatur ab. Aktivität erhöht den Umsatz darüber hinaus (Leistungsumsatz).',
        gap: 'Der ___ ist der Energiebedarf in Ruhe.',
        gapAccepted: ['Grundumsatz', 'Ruheumsatz'],
      },
    ], { conceptPrefix: 'bio:kOberstufe:energie' }),
  ),
  'bi-gk-lbw-gaerung': bankGenerate(
    wahl('Gärung', 'G%C3%A4rung', [
      {
        concept: 'bio:kOberstufe:gaerung-vs-atmung',
        prompt: 'Was unterscheidet Gärung grob von Zellatmung?',
        answer: 'Gärung liefert ATP ohne Sauerstoff / ohne Atmungskette',
        wrong: ['Gärung braucht immer Chloroplasten', 'Gärung ist nur Federbildung', 'Gärung ersetzt DNA'],
        explanation: 'Milchsäure- und alkoholische Gärung — anaerober Abbau.',
        wissen:
          'Bei der Gärung wird Glucose anaerob abgebaut; die Netto-ATP-Ausbeute ist geringer als bei Zellatmung. Milchsäuregärung und alkoholische Gärung sind zentrale Beispiele. Der Vergleich von Atmung und Gärung vertieft Dissimilation.',
        gap: 'Gärung läuft ___ ab und liefert weniger ATP als Atmung.',
        gapAccepted: ['anaerob', 'ohne Sauerstoff', 'sauerstofffrei'],
      },
      {
        concept: 'bio:kOberstufe:alkoholische-gaerung',
        prompt: 'Was entsteht typisch bei alkoholischer Gärung?',
        answer: 'Ethanol und CO₂',
        wrong: ['Nur Sauerstoff', 'Nur Proteine ohne Stoffwechsel', 'Nur Knochen'],
        explanation: 'Hefen: Zucker → Ethanol + CO₂.',
        wissen:
          'Alkoholische Gärung spaltet Zucker zu Ethanol und Kohlenstoffdioxid. Hefen nutzen sie bei Sauerstoffmangel. Im Unterricht wird sie mit Zellatmung und Milchsäuregärung verglichen.',
      },
    ], { conceptPrefix: 'bio:kOberstufe:gaerung' }),
  ),
  'bi-gk-lbw-fliesgewaesser': bankGenerate(
    wahl('Fließgewässer', 'Flie%C3%9Fgew%C3%A4sser', [
      {
        concept: 'bio:kOberstufe:was-praegt-fliessgewaesser-als-lebensrau',
        prompt: 'Was prägt Fließgewässer als Lebensraum stark?',
        answer: 'Strömung, Sauerstoffeintrag, Uferstruktur',
        wrong: ['Nur Mondstaub', 'Nur Schulklingeln', 'Nur Federfarbe'],
        explanation: 'Abiotische Faktoren im Bach/Fluss.',
        wissen:
          'In Fließgewässern prägen Strömung, Sauerstoffeintrag, Temperatur und Uferstruktur die Lebensgemeinschaft. Viele Organismen sind an Strömung angepasst (Haftorgane, robuste Körper). Veränderungen der Ufer und Verbauung ändern das Habitat stark.',
        gap: 'In Bächen ist die ___ ein prägender abiotischer Faktor.',
        gapAccepted: ['Strömung', 'Strömungsgeschwindigkeit'],
      },
    ], { conceptPrefix: 'bio:kOberstufe:fliesgewaesser' }),
  ),
  'bi-gk-lbw-allergien': bankGenerate(
    wahl('Allergie', 'Allergie', [
      {
        concept: 'bio:kOberstufe:gk-allergie',
        prompt: 'Eine Allergie ist grob …',
        answer: 'übersteigerte Immunreaktion gegen eigentlich harmlose Stoffe',
        wrong: ['immer eine Virusvermehrung', 'nur Knochenbruch', 'nur Fotosynthese'],
        explanation: 'Immunbiologie auf Allergien anwenden.',
        wissen:
          'Allergien sind übersteigerte Immunreaktionen gegen harmlose Antigene (Allergene). IgE und Mastzellen spielen beim Soforttyp eine Rolle. Der Wahlbereich übt die Anwendung immunbiologischer Kenntnisse.',
      },
    ], { conceptPrefix: 'bio:kOberstufe:allergien' }),
  ),
  'bi-gk-lbw-krebs': bankGenerate(
    wahl('Krebs (Medizin)', 'Krebs_(Medizin)', [
      {
        concept: 'bio:kOberstufe:krebszellen-kennzeichnet-oft',
        prompt: 'Krebszellen kennzeichnet oft …',
        answer: 'unkontrollierte Zellteilung',
        wrong: ['immer sofortige Heilung ohne Therapie', 'nur Fotosynthese', 'nur Kiemen'],
        explanation: 'Entartete Regulation des Zellzyklus.',
        wissen:
          'Krebszellen entziehen sich oft der normalen Zellzyklus-Kontrolle und teilen sich unkontrolliert. Mutationen in Protoonkogenen und Tumorsuppressorgenen spielen eine Rolle. Invasion und Metastasierung kennzeichnen bösartige Tumoren.',
        gap: 'Krebszellen zeigen oft unkontrollierte ___.',
        gapAccepted: ['Zellteilung', 'Proliferation', 'Vermehrung'],
      },
    ], { conceptPrefix: 'bio:kOberstufe:krebs' }),
  ),
  'bi-gk-lbw-nerven': bankGenerate(kommunikation),
  'bi-gk-lbw-verhalten': bankGenerate(verhalten),
  'bi-gk-lbw-gentechnik': bankGenerate(genetikOS),
  'bi-lk11-lbw-wueste': bankGenerate(
    wahl(
      'Wüste',
      'W%C3%BCste',
      [
        {
          concept: 'bio:kOberstufe:lk-wueste-angepasstheit',
          prompt: 'Welche Angepasstheit hilft Wüstenpflanzen oft?',
          answer: 'Wasserspeicherung / reduzierte Blätter / dicke Cuticula',
          wrong: ['Kiemenatmung', 'Federflug als Blatt', 'Blutkreislauf wie Säuger'],
          explanation: 'Wassersparen und -speichern sind typisch.',
          wissen:
            'Wüstenpflanzen speichern Wasser, reduzieren Verdunstungsfläche und schützen mit dicker Cuticula. CAM und Sukkulenz sind häufige Anpassungen an Trockenheit.',
        },
      ],
      { conceptPrefix: 'bio:kOberstufe:wueste' },
    ),
  ),
  'bi-lk11-lbw-urban': bankGenerate(
    wahl('Stadtökologie', 'Stadt%C3%B6kologie', [
      {
        concept: 'bio:kOberstufe:urbane-oekologie-untersucht',
        prompt: 'Urbane Ökologie untersucht …',
        answer: 'Wechselwirkungen von Arten und Umwelt in Städten',
        wrong: ['nur Meeresboden ohne Stadt', 'nur Sternkarten', 'nur Orthografie'],
        explanation: 'Stadt als Ökosystem.',
        wissen:
          'Urbane Ökologie untersucht Arten, Lebensräume und Stoffflüsse in Städten. Versiegelung, Wärmeinsel und Fragmentierung prägen die Lebensgemeinschaften. Grünflächen und Vernetzung fördern urbane Biodiversität.',
      },
    ], { conceptPrefix: 'bio:kOberstufe:urban' }),
  ),
  'bi-lk11-lbw-bioindikation': bankGenerate(
    wahl('Bioindikator', 'Bioindikator', [
      {
        concept: 'bio:kOberstufe:bioindikatoren',
        prompt: 'Bioindikatoren …',
        answer: 'zeigen Umweltzustände durch An-/Abwesenheit oder Zustand von Arten',
        wrong: ['ersetzen Messgeräte immer vollständig ohne Sinn', 'sind nur Steine', 'sind nur Zahlen ohne Biologie'],
        explanation: 'z. B. Flechten und Luftqualität.',
        wissen:
          'Bioindikatoren spiegeln Umweltzustände über Vorkommen, Häufigkeit oder Zustand von Arten wider. Flechten zeigen z. B. Luftqualität; bestimmte Wasserorganismen zeigen Gewässergüte. Sie ergänzen chemische Messungen um biologische Wirkung.',
      },
    ], { conceptPrefix: 'bio:kOberstufe:bioindikation' }),
  ),
  'bi-lk11-lbw-invasiv': bankGenerate(
    wahl('Neobiota', 'Neobiota', [
      {
        concept: 'bio:kOberstufe:invasive-arten-koennen',
        prompt: 'Invasive Arten können …',
        answer: 'heimische Arten und Ökosysteme verdrängen/verändern',
        wrong: ['nie ökologische Wirkung haben', 'nur Schulbücher fressen', 'nur DNA löschen weltweit'],
        explanation: 'Neobiota und Management.',
        wissen:
          'Invasive Arten (invasive Neobiota) können heimische Arten verdrängen, Nahrungsnetze umbauen und Lebensräume verändern. Einschleppung erfolgt oft durch Handel und Verkehr. Management reicht von Prävention bis Bekämpfung.',
      },
    ], { conceptPrefix: 'bio:kOberstufe:invasiv' }),
  ),
  'bi-lk11-lbw-rohstoffe': bankGenerate(
    wahl('Nachwachsende Rohstoffe', 'Nachwachsender_Rohstoff', [
      {
        concept: 'bio:kOberstufe:nachwachsende-rohstoffe',
        prompt: 'Nachwachsende Rohstoffe …',
        answer: 'stammen aus Biomasse und können erneut erzeugt werden',
        wrong: ['sind immer unbegrenzt ohne Fläche', 'sind nur Erdöl', 'sind nur Metall'],
        explanation: 'Chance und Flächenkonkurrenz.',
        wissen:
          'Nachwachsende Rohstoffe stammen aus Biomasse (Holz, Ölsaaten, Fasern) und können erneut erzeugt werden. Sie ersetzen teils fossile Rohstoffe, brauchen aber Fläche und können mit Nahrung konkurrieren. Nachhaltigkeit hängt von Anbau und Nutzung ab.',
      },
    ], { conceptPrefix: 'bio:kOberstufe:rohstoffe' }),
  ),
  'bi-lk11-lbw-energie': bankGenerate(
    wahl('Energieumsatz', 'Energieumsatz', [
      {
        concept: 'bio:kOberstufe:leistungsumsatz-ist',
        prompt: 'Leistungsumsatz ist …',
        answer: 'Energiebedarf bei Aktivität über dem Grundumsatz',
        wrong: ['nur die DNA-Länge', 'nur die Blattzahl', 'nur die Schuhgröße'],
        explanation: 'Energiehaushalt des Menschen.',
        wissen:
          'Leistungsumsatz ist der Energiebedarf bei körperlicher oder geistiger Aktivität über dem Grundumsatz. Sport, Arbeit und Thermoregulation erhöhen ihn. Gesamtenergiebedarf = Grundumsatz + Leistungsumsatz (vereinfacht).',
      },
    ], { conceptPrefix: 'bio:kOberstufe:energie' }),
  ),
  'bi-lk12-lbw-allergie': bankGenerate(
    wahl('Allergie', 'Allergie', [
      {
        concept: 'bio:kOberstufe:eine-allergie-ist-grob',
        prompt: 'Eine Allergie ist grob …',
        answer: 'übersteigerte Immunreaktion gegen eigentlich harmlose Stoffe',
        wrong: ['immer eine Virusvermehrung', 'nur Knochenbruch', 'nur Fotosynthese'],
        explanation: 'Allergien und Autoimmunität — Wahl.',
        wissen:
          'Eine Allergie ist eine übersteigerte Immunreaktion gegen eigentlich harmlose Antigene (Allergene). Mastzellen und IgE spielen bei Soforttyp-Reaktionen eine Rolle. Sie ist von Infektion und von Autoimmunität abzugrenzen.',
      },
    ], { conceptPrefix: 'bio:kOberstufe:allergien' }),
  ),
  'bi-lk12-lbw-stoffwechsel': bankGenerate(stoffwechsel),
  'bi-lk12-lbw-gefaess': bankGenerate(
    wahl('Gefäßpflanze', 'Gef%C3%A4%C3%9Fpflanzen', [
      {
        concept: 'bio:kOberstufe:gefaesspflanzen-besitzen',
        prompt: 'Gefäßpflanzen besitzen …',
        answer: 'Leitgewebe (Xylem/Phloem)',
        wrong: ['nie Wurzeln', 'nur Kiemen', 'nur Federn'],
        explanation: 'Praktikum Gefäßpflanzen.',
        wissen:
          'Gefäßpflanzen besitzen Leitgewebe: Xylem transportiert Wasser und Mineralstoffe, Phloem Assimilate. Das ermöglicht höheres Wachstum und Versorgung entfernter Organe. Moose fehlen echte Gefäße im gleichen Sinn.',
      },
    ], { conceptPrefix: 'bio:k9:blatt' }),
  ),
  'bi-lk12-lbw-verhalten': bankGenerate(verhalten),
  'bi-lk12-lbw-gentechnik': bankGenerate(genetikOS),
}
