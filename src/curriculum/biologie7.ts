/**
 * Biologie Klasse 7 — Lehrplan 522 (Mikroben, Blut/Immun, Ernährung, Skelett).
 * Ideen aus Schulquiz-Themen — original formuliert; Platzierung nach Lehrplan.
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

const mikroben: BioBank = {
  quelle: 'Wikipedia: Bakterien',
  url: 'https://de.wikipedia.org/wiki/Bakterien',
  conceptPrefix: 'bio:k7:mikroben',
  facts: [
    {
      concept: 'bio:k7:was-sind-bakterien',
      prompt: 'Was sind Bakterien?',
      answer: 'Einzellige Mikroorganismen ohne echten Zellkern',
      wrong: ['Immer Viren mit Hülle', 'Nur vielzellige Tiere', 'Nur Pflanzenzellen mit Chloroplast'],
      explanation: 'Bakterien sind Prokaryoten — kein Zellkern wie bei Pflanzen/Tieren.',
      wissen:
        'Bakterien sind einzellige Prokaryoten: ihr Erbgut liegt frei im Zytoplasma, ohne echten Zellkern.',
      gap: 'Bakterien besitzen keinen echten ___.',
      gapAccepted: ['Zellkern', 'Kern'],
    },
    {
      concept: 'bio:k7:was-sind-viren',
      prompt: 'Was sind Viren?',
      answer: 'Infektiöse Partikel aus Erbgut und oft Proteinhülle — keine Zellen',
      wrong: ['Vollständige Zellen mit Mitochondrien', 'Immer nützliche Darmbakterien', 'Nur Mineralien'],
      explanation: 'Viren brauchen Wirtszellen zur Vermehrung.',
      wissen:
        'Viren bestehen aus Erbgut und oft einer Proteinhülle — keine Zellen; Vermehrung nur in Wirtszellen.',
      gap: 'Viren vermehren sich nur in ___.',
      gapAccepted: ['Wirtszellen', 'lebenden Zellen', 'Zellen'],
    },
  ],
  pairs: [
    {
      concept: 'bio:k7:mikroben:paar-bak',
      term: 'Bakterium',
      meaning: 'Einzeller ohne Zellkern',
      wissen: 'Prokaryot — kann nützlich oder krankheitserregend sein.',
    },
    {
      concept: 'bio:k7:mikroben:paar-virus',
      term: 'Virus',
      meaning: 'Erbgut + Hülle, parasitär',
      wissen: 'Kein eigener Stoffwechsel; Vermehrung nur in einer Wirtszelle.',
    },
    {
      concept: 'bio:k7:mikroben:paar-ab',
      term: 'Antibiotikum',
      meaning: 'Wirkt gegen Bakterien (nicht gegen Viren)',
      wissen: 'Hemmt Bakterienwachstum; gegen Viren wirkungslos.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k7:antibiotika-helfen-zuverlaessig-gegen-al',
      statement: 'Antibiotika helfen zuverlässig gegen alle Virusinfektionen.',
      correct: false,
      explanation: 'Antibiotika zielen auf Bakterien, nicht auf Viren.',
      wissen:
        'Antibiotika greifen Bakterienzellen an. Viren haben keine solche Zelle — deshalb helfen sie nicht gegen Virusinfektionen.',
    },
    {
      concept: 'bio:k7:manche-bakterien-sind-fuer-den-menschen-',
      statement: 'Manche Bakterien sind für den Menschen nützlich (z. B. Darmflora).',
      correct: true,
      explanation: 'Nicht alle Bakterien sind Krankheitserreger.',
      wissen:
        'Viele Bakterien sind nützlich (Darmflora, Lebensmittelherstellung). Hygiene-Maßnahmen → Spezial Hygiene.',
    },
  ],
  multis: [
    {
      concept: 'bio:k7:mikroben:multi-gruppen',
      question: 'Welche Aussagen zu Mikroorganismen stimmen?',
      correct: ['Bakterien sind Zellen ohne echten Zellkern', 'Viren sind keine Zellen'],
      wrong: ['Viren haben Mitochondrien', 'Bakterien sind immer vielzellige Tiere'],
      explanation: 'Bakterien = Prokaryoten; Viren = infektiöse Partikel.',
      wissen:
        'Bakterien sind einzellige Prokaryoten; Viren sind keine Zellen und brauchen Wirte zur Vermehrung.',
    },
  ],
}

const blut: BioBank = {
  quelle: 'Wikipedia: Blutkreislauf',
  url: 'https://de.wikipedia.org/wiki/Blutkreislauf',
  conceptPrefix: 'bio:k7:blut',
  facts: [
    {
      concept: 'bio:k7:wofuer-sind-rote-blutkoerperchen-besonde',
      prompt: 'Wofür sind rote Blutkörperchen besonders wichtig?',
      answer: 'Sauerstofftransport (Hämoglobin)',
      wrong: ['Nur Antikörperbildung', 'Nur Fettverdauung', 'Nur Knochenwachstum'],
      explanation: 'Hämoglobin bindet Sauerstoff.',
      wissen:
        'Rote Blutkörperchen enthalten Hämoglobin und transportieren Sauerstoff. Herz/Gefäße und Immunabwehr → Spezialthemen.',
      gap: 'Rote Blutkörperchen transportieren vor allem ___.',
      gapAccepted: ['Sauerstoff', 'O2', 'O₂'],
    },
    {
      concept: 'bio:k7:blut:aufgabe',
      prompt: 'Welche Aufgabe hat das Blut im Körper grob?',
      answer: 'Transport von Stoffen und Zellen',
      wrong: ['Nur Pollenflug', 'Nur Jahresringe bilden', 'Nur Blattgrün speichern'],
      explanation: 'Blut transportiert Gase, Nährstoffe, Hormone und Abwehrzellen.',
      wissen:
        'Blut transportiert u. a. Sauerstoff, CO₂, Nährstoffe, Hormone und Abwehrzellen.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k7:blut:paar-ery',
      term: 'Erythrozyten',
      meaning: 'Rote Blutkörperchen / O₂-Transport',
      wissen: 'Enthalten Hämoglobin.',
    },
    {
      concept: 'bio:k7:blut:paar-plasma',
      term: 'Blutplasma',
      meaning: 'Flüssiger Anteil des Blutes',
      wissen: 'Transportiert gelöste Stoffe und enthält Gerinnungsfaktoren.',
    },
    {
      concept: 'bio:k7:blut:paar-kreislauf',
      term: 'Blutkreislauf',
      meaning: 'Geschlossenes Transportsystem mit Herz und Gefäßen',
      wissen: 'Überblick; Herz und Gefäße im Detail → Spezial Herz.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k7:das-blut-transportiert-nur-sauerstoff-ni',
      statement: 'Das Blut transportiert nur Sauerstoff, nie Nährstoffe oder Hormone.',
      correct: false,
      explanation: 'Blut transportiert u. a. Gase, Nährstoffe, Hormone, Abwehrzellen.',
      wissen:
        'Blut transportiert Sauerstoff und CO₂, Nährstoffe, Hormone und Abwehrzellen — nicht nur Sauerstoff.',
    },
  ],
  multis: [
    {
      concept: 'bio:k7:welche-bestandteile-gehoeren-zum-blut',
      question: 'Welche Bestandteile gehören zum Blut?',
      correct: ['Rote Blutkörperchen', 'Blutplasma', 'Weiße Blutkörperchen'],
      wrong: ['Nur Blattgrün', 'Nur Holzfasern'],
      explanation: 'Blut = Zellen + Plasma (+ Blutplättchen).',
      wissen:
        'Blut besteht aus Plasma und Zellen: Erythrozyten, Leukozyten und Thrombozyten.',
    },
  ],
}

const ernaehrung: BioBank = {
  quelle: 'Wikipedia: Verdauung',
  url: 'https://de.wikipedia.org/wiki/Verdauung',
  conceptPrefix: 'bio:k7:ernaehrung',
  facts: [
    {
      concept: 'bio:k7:ernaehrung:zweck',
      prompt: 'Wozu dient Ernährung und Verdauung grob?',
      answer: 'Energie und Baustoffe für den Körper bereitstellen',
      wrong: ['Nur Jahresringe zählen', 'Nur Pollen lagern', 'Nur Flugfedern bilden'],
      explanation: 'Nahrung liefert Energie und Baustoffe; Verdauung spaltet und nimmt auf.',
      wissen:
        'Ernährung liefert Energie und Baustoffe. Nährstoffgruppen und Organe → Spezialthemen.',
    },
    {
      concept: 'bio:k7:ernaehrung:aufnahme',
      prompt: 'Was passiert bei der Verdauung grob mit der Nahrung?',
      answer: 'Sie wird zerkleinert und in aufnehmbare Bestandteile zerlegt',
      wrong: ['Sie wird zu Jahresringen', 'Sie wird zu Federn', 'Sie wird zu Holz'],
      explanation: 'Mechanische und chemische Aufspaltung.',
      wissen:
        'Verdauung zerlegt Nahrung mechanisch und chemisch, damit Nährstoffe aufgenommen werden können. Enzyme und Organe → Spezial Verdauungsorgane.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k7:ernaehrung:paar-energie',
      term: 'Energie',
      meaning: 'Kommt vor allem aus Kohlenhydraten und Fetten',
      wissen: 'Details zu Nährstoffgruppen → Spezial Nährstoffe.',
    },
    {
      concept: 'bio:k7:ernaehrung:paar-baustoff',
      term: 'Baustoffe',
      meaning: 'Vor allem Eiweiße für Wachstum und Gewebe',
      wissen: 'Proteine liefern Aminosäuren.',
    },
    {
      concept: 'bio:k7:ernaehrung:paar-wasser',
      term: 'Trinken',
      meaning: 'Hält den Wasserhaushalt stabil',
      wissen: 'Ausreichend Flüssigkeit gehört zur gesunden Ernährung.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k7:ernaehrung:tf-nur-suess',
      statement: 'Gesunde Ernährung besteht nur aus Süßigkeiten.',
      correct: false,
      explanation: 'Abwechslung und Balance sind zentral.',
      wissen: 'Ausgewogene Ernährung nutzt verschiedene Lebensmittelgruppen.',
    },
  ],
  multis: [
    {
      concept: 'bio:k7:welche-aussagen-zur-gesunden-ernaehrung-',
      question: 'Welche Aussagen zur gesunden Ernährung passen?',
      correct: ['Abwechslungsreich essen', 'Ausreichend trinken'],
      wrong: ['Nur Süßigkeiten', 'Nie Gemüse'],
      explanation: 'Balance und Flüssigkeit sind Grundlagen.',
      wissen:
        'Ausgewogene Ernährung und ausreichendes Trinken sind Grundlagen — Organe und Nährstoffe in Spezialthemen.',
    },
  ],
}

/** Knochen/Skelett — Gelenke → bi-k7-lb4-gelenke, Muskeln/Sehnen → bi-k7-lb4-muskeln. */
const skelett: BioBank = {
  quelle: 'Wikipedia: Skelett',
  url: 'https://de.wikipedia.org/wiki/Menschliches_Skelett',
  conceptPrefix: 'bio:k7:skelett',
  facts: [
    {
      concept: 'bio:k7:skelett:aufgaben',
      prompt: 'Welche Aufgaben hat das Skelett?',
      answer: 'Stütze, Schutz und Calciumspeicher',
      wrong: ['Nur Blut filtern wie die Niere', 'Nur Hormone erzeugen', 'Nur Fotosynthese'],
      explanation: 'Knochen stützen, schützen Organe und speichern Mineralstoffe.',
      wissen:
        'Das Skelett stützt den Körper, schützt Organe (z. B. Schädel, Brustkorb) und speichert Calcium. Knochenmark ist an der Blutbildung beteiligt.',
      gap: 'Der ___ schützt das Gehirn.',
      gapAccepted: ['Schädel', 'Schädelknochen', 'Hirnschädel'],
    },
    {
      concept: 'bio:k7:skelett:wirbelsaeule',
      prompt: 'Welche Aufgabe hat die Wirbelsäule vor allem?',
      answer: 'Stützt den Rumpf und schützt das Rückenmark',
      wrong: ['Filtert nur das Blut', 'Erzeugt nur Hormone', 'Bildet nur Hautpigmente'],
      explanation: 'Wirbel bilden die Körperachse und schützen das Rückenmark.',
      wissen:
        'Die Wirbelsäule besteht aus Wirbeln: sie stützt den Rumpf und umschließt das Rückenmark im Wirbelkanal.',
    },
    {
      concept: 'bio:k7:skelett:brustkorb',
      prompt: 'Was schützt der Brustkorb vor allem?',
      answer: 'Herz und Lunge',
      wrong: ['Nur die Fußsohlen', 'Nur die Zahnwurzeln', 'Nur die Haarfollikel'],
      explanation: 'Rippen und Brustbein bilden den schützenden Brustkorb.',
      wissen:
        'Rippen, Brustbein und Wirbelsäule bilden den Brustkorb und schützen Herz und Lunge.',
      gap: 'Rippen und Brustbein gehören zum ___.',
      gapAccepted: ['Brustkorb', 'Thorax'],
    },
  ],
  pairs: [
    {
      concept: 'bio:k7:skelett:paar-schaedel',
      term: 'Schädel',
      meaning: 'Knöcherne Kapsel um das Gehirn',
      wissen: 'Der Schädel schützt Gehirn und viele Sinnesorgane.',
    },
    {
      concept: 'bio:k7:skelett:paar-achse',
      term: 'Achsenskelett',
      meaning: 'Schädel, Wirbelsäule und Brustkorb',
      wissen: 'Das Achsenskelett bildet die zentrale Körperachse.',
    },
    {
      concept: 'bio:k7:skelett:paar-glied',
      term: 'Gliedmaßenskelett',
      meaning: 'Knochen von Armen und Beinen (mit Gürteln)',
      wissen: 'Zum Gliedmaßenskelett gehören Schulter-/Beckengürtel sowie Arm- und Beinknochen.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k7:skelett:tf-leblos',
      statement: 'Knochen sind völlig leblos und ohne Blutversorgung.',
      correct: false,
      explanation: 'Knochengewebe ist lebendig und gut durchblutet.',
      wissen:
        'Knochen sind lebendiges Gewebe mit Blutversorgung und Knochenmark — deshalb können Brüche heilen.',
    },
  ],
  multis: [
    {
      concept: 'bio:k7:skelett:multi-achse',
      question: 'Was gehört zum Achsenskelett?',
      correct: ['Schädel', 'Wirbelsäule', 'Brustkorb'],
      wrong: ['Nur Fingerknochen allein', 'Nur die Kniescheibe allein'],
      explanation: 'Achsenskelett = zentrale Achse ohne freie Gliedmaßen.',
      wissen:
        'Zum Achsenskelett zählen Schädel, Wirbelsäule und Brustkorb — die Gliedmaßenknochen gehören zum Gliedmaßenskelett.',
    },
  ],
}

const wahlErnaehrung: BioBank = {
  quelle: 'Wikipedia: Ernährung',
  url: 'https://de.wikipedia.org/wiki/Ern%C3%A4hrung',
  conceptPrefix: 'bio:k7:wahl-ern',
  facts: [
    {
      concept: 'bio:k7:wahl-ern:energie',
      prompt: 'Warum beeinflusst Ernährung Wohlbefinden und Leistungsfähigkeit?',
      answer: 'Sie liefert Energie und Baustoffe für Körper und Gehirn',
      wrong: ['Sie ersetzt Schlaf vollständig', 'Sie macht Knochen überflüssig', 'Sie stoppt jede Atmung'],
      explanation: 'Nahrung und Gewohnheiten prägen Gesundheit.',
      wissen:
        'Nahrung liefert Energie (Kohlenhydrate, Fette) und Baustoffe (Eiweiße, Mineralstoffe). Gehirn und Muskeln brauchen stetige Versorgung für Leistung und Wohlbefinden.',
    },
    {
      concept: 'bio:k7:wahl-ern:vielfalt',
      prompt: 'Was kennzeichnet eine ausgewogene Ernährung?',
      answer: 'Vielfalt an Nährstoffen in passender Menge',
      wrong: ['Nur eine einzige Süßigkeit den ganzen Tag', 'Vollständiger Verzicht auf Wasser', 'Nur Salz ohne andere Stoffe'],
      explanation: 'Energie, Baustoffe und Schutzstoffe im Maß.',
      wissen:
        'Ausgewogen heißt: Kohlenhydrate, Fette, Eiweiße, Vitamine, Mineralstoffe und Wasser in sinnvollen Anteilen — nicht nur Kalorien zählen.',
    },
    {
      concept: 'bio:k7:wahl-ern:wasser',
      prompt: 'Warum ist ausreichendes Trinken wichtig?',
      answer: 'Wasser ist Transport- und Lösungsmittel im Körper',
      wrong: ['Wasser ersetzt vollständig alle Eiweiße', 'Wasser stoppt die Atmung', 'Wasser bildet die Wirbelsäule'],
      explanation: 'Ohne Wasser stocken Stoffwechselprozesse.',
      wissen:
        'Blutplasma und Zellen brauchen Wasser. Bei Bewegung und Hitze steigt der Bedarf — Durst ernst nehmen.',
    },
    {
      concept: 'bio:k7:wahl-ern:zucker',
      prompt: 'Was passiert bei dauerhaft sehr zuckerreicher Ernährung oft?',
      answer: 'Übergewicht und Kariesrisiko können steigen',
      wrong: ['Knochen verschwinden sofort', 'Atmung wird überflüssig', 'Immunsystem braucht nie Nährstoffe'],
      explanation: 'Maß und Zahnpflege zählen.',
      wissen:
        'Häufige Zuckerzufuhr liefert schnell Energie, kann aber Übergewicht und Zahnschäden fördern. Vollwertige Alternativen und Zahnpflege helfen.',
    },
    {
      concept: 'bio:k7:wahl-ern:eiweiss',
      prompt: 'Wozu braucht der Körper Eiweiße?',
      answer: 'Als Baustoffe für Muskeln, Enzyme und viele Körperstrukturen',
      wrong: ['Nur als Ersatz für Sauerstoff', 'Nur zum Bilden von Jahresringen', 'Nur als Chitinpanzer außen'],
      explanation: 'Proteine sind Bau- und Wirkstoffe.',
      wissen:
        'Aminosäuren aus Eiweißen bauen Muskelproteine, Enzyme und Hormone auf. Quellen: Fleisch, Fisch, Hülsenfrüchte, Milchprodukte, Eier.',
    },
    {
      concept: 'bio:k7:wahl-ern:mahlzeiten',
      prompt: 'Warum sind regelmäßige Mahlzeiten oft hilfreich?',
      answer: 'Sie stabilisieren Energieversorgung und Essrhythmus',
      wrong: ['Sie ersetzen Schlaf komplett', 'Sie machen Sport unnötig', 'Sie stoppen jede Verdauung'],
      explanation: 'Gleichmäßige Versorgung statt Heißhunger.',
      wissen:
        'Regelmäßige, ausgewogene Mahlzeiten halten Blutzucker und Konzentration stabiler als extremes Hungern mit anschließendem Überessen.',
    },
    {
      concept: 'bio:k7:wahl-ern:medien',
      prompt: 'Worauf solltest du bei Ernährungstipps in Medien achten?',
      answer: 'Auf seriöse Quellen und keine Heilsversprechen',
      wrong: ['Immer jedem Werbespruch blind folgen', 'Nur auf Farbe der Verpackung', 'Nie Inhaltsstoffe lesen'],
      explanation: 'Kritisch prüfen statt Mythos glauben.',
      wissen:
        'Seriöse Tipps nennen Nährstoffbedarf und Maß. Extreme „Wunderdiäten“ ohne Belege sind oft irreführend.',
    },
    {
      concept: 'bio:k7:wahl-ern:bewegung',
      prompt: 'Wie hängen Ernährung und Bewegung zusammen?',
      answer: 'Beide beeinflussen Energiebilanz und Gesundheit',
      wrong: ['Nur Ernährung zählt, Bewegung nie', 'Nur Bewegung zählt, Essen nie', 'Beide ersetzen die Atmung'],
      explanation: 'Zusammenspiel von Zufuhr und Verbrauch.',
      wissen:
        'Energiezufuhr durch Essen und Verbrauch durch Grundumsatz plus Aktivität bestimmen die Energiebilanz. Beides prägt Fitness und Körpergewicht.',
    },
  ],
  pairs: [
    { term: 'Kohlenhydrat', meaning: 'Wichtiger Energielieferant', wissen: 'Brot, Nudeln, Obst — schnell verfügbare Energie.' },
    { term: 'Eiweiß', meaning: 'Baustoff für Körperstrukturen', wissen: 'Muskeln, Enzyme, viele Hormone.' },
    { term: 'Fett', meaning: 'Energiespeicher und Zellbestandteil', wissen: 'In Maßen nötig; Qualität beachten.' },
    { term: 'Vitamin', meaning: 'Essentieller Wirkstoff in kleiner Menge', wissen: 'z. B. aus Obst und Gemüse.' },
    { term: 'Mineralstoff', meaning: 'Anorganischer Baustein (z. B. Calcium)', wissen: 'Für Knochen, Nerven, Blut u. a.' },
    { term: 'Ballaststoff', meaning: 'Fördert die Verdauung', wissen: 'In Vollkorn, Obst, Gemüse.' },
    { term: 'Energiebilanz', meaning: 'Zufuhr minus Verbrauch', wissen: 'Bestimmt langfristig das Körpergewicht.' },
    { term: 'Ausgewogenheit', meaning: 'Vielfalt und maßvolle Mengen', wissen: 'Nicht nur eine Nährstoffgruppe.' },
    { term: 'Flüssigkeit', meaning: 'Wasserversorgung des Körpers', wissen: 'Transport und Temperaturregulation.' },
    { term: 'Vollwertig', meaning: 'Wenig stark verarbeitet, nährstoffreich', wissen: 'Oft mehr Ballaststoffe und Vitamine.' },
  ],
  trueFalse: [
    {
      concept: 'bio:k7:wahl-ern:tf-geschmack',
      statement: 'Nur der Geschmack entscheidet über eine ausgewogene Ernährung.',
      correct: false,
      explanation: 'Nährstoffbedarf, Vielfalt und Maß zählen mit.',
      wissen:
        'Geschmack allein reicht nicht: ausgewogene Ernährung berücksichtigt Energiebedarf, Nährstoffvielfalt und Maß — nicht nur Vorlieben.',
    },
    {
      concept: 'bio:k7:wahl-ern:tf-wasser',
      statement: 'Wasser ist für den Stoffwechsel entbehrlich.',
      correct: false,
      explanation: 'Ohne Wasser kein funktionierender Transport im Körper.',
      wissen: 'Wasser ist Lösungsmittel und Transportmedium — unverzichtbar.',
    },
  ],
}

const wahlFitness: BioBank = {
  quelle: 'Wikipedia: Fitness',
  url: 'https://de.wikipedia.org/wiki/Fitness',
  conceptPrefix: 'bio:k7:wahl-fit',
  facts: [
    {
      concept: 'bio:k7:wahl-fit:training',
      prompt: 'Was verbessert regelmäßige Bewegung typischerweise?',
      answer: 'Herz-Kreislauf-Leistung und Muskelkraft',
      wrong: ['Die Notwendigkeit zu atmen entfällt', 'Knochen verschwinden', 'Immunsystem wird nutzlos'],
      explanation: 'Training stärkt Herz, Kreislauf und Muskeln.',
      wissen:
        'Regelmäßiges Training stärkt Herz und Kreislauf, erhöht die Ausdauer und baut Muskelkraft auf — positiv für Stoffwechsel und Gesundheit.',
    },
    {
      concept: 'bio:k7:wahl-fit:aufwaermen',
      prompt: 'Warum ist Aufwärmen vor Sport sinnvoll?',
      answer: 'Es steigert Durchblutung und senkt Verletzungsrisiko',
      wrong: ['Es ersetzt das Training vollständig', 'Es stoppt die Atmung', 'Es macht Dehnen überflüssig immer'],
      explanation: 'Muskeln und Kreislauf werden vorbereitet.',
      wissen:
        'Aufwärmen steigert Durchblutung und Beweglichkeit von Muskeln und Gelenken und senkt so das Verletzungsrisiko.',
    },
    {
      concept: 'bio:k7:wahl-fit:ausdauer',
      prompt: 'Was trainiert Ausdauersport besonders?',
      answer: 'Herz, Kreislauf und Sauerstoffversorgung',
      wrong: ['Nur die Zahnfarbe', 'Nur die Anzahl der Kelchblätter', 'Nur die Beinzahl von Spinnen'],
      explanation: 'Laufen, Schwimmen, Radfahren u. a.',
      wissen:
        'Ausdauertraining verbessert die Fähigkeit, Sauerstoff aufzunehmen und zu den Muskeln zu transportieren — Herz schlägt effizienter.',
    },
    {
      concept: 'bio:k7:wahl-fit:kraft',
      prompt: 'Was bewirkt Krafttraining?',
      answer: 'Muskeln werden stärker und oft größer',
      wrong: ['Knochen lösen sich auf', 'Lungen verschwinden', 'Nerven werden überflüssig'],
      explanation: 'Widerstand reizt Muskelwachstum.',
      wissen:
        'Gegen Widerstand arbeitende Muskeln passen sich an: mehr Kraft, bessere Haltung, stärkerer Stoffwechsel.',
    },
    {
      concept: 'bio:k7:wahl-fit:pause',
      prompt: 'Warum braucht der Körper Erholung nach Belastung?',
      answer: 'Anpassung und Reparatur geschehen in Ruhephasen',
      wrong: ['Weil Training ohne Pause immer besser ist', 'Weil Schlaf nutzlos ist', 'Weil Muskeln nie ermüden'],
      explanation: 'Übertraining schadet.',
      wissen:
        'Mikroschäden und Ermüdung heilen in Pausen. Schlaf und ruhige Tage sind Teil eines sinnvollen Trainingsplans.',
    },
    {
      concept: 'bio:k7:wahl-fit:haltung',
      prompt: 'Wie hilft Bewegung dem Bewegungsapparat?',
      answer: 'Muskeln stützen Wirbelsäule und Gelenke',
      wrong: ['Bewegung ersetzt das Skelett vollständig', 'Gelenke brauchen nie Knorpel', 'Knochen wachsen nur ohne Belastung'],
      explanation: 'Aktive Stabilisierung.',
      wissen:
        'Kräftige Rumpf- und Beinmuskulatur entlastet Wirbelsäule und Gelenke und fördert eine gesunde Haltung.',
    },
    {
      concept: 'bio:k7:wahl-fit:alltag',
      prompt: 'Was zählt neben Sport noch zur Bewegung?',
      answer: 'Alltagsaktivität wie Gehen, Treppensteigen, Radeln zur Schule',
      wrong: ['Nur das Liegen ohne Ausnahme', 'Nur das Tippen ohne Aufstehen je', 'Nur der Schlaf'],
      explanation: 'Jede Aktivität zählt.',
      wissen:
        'Nicht nur Vereinstraining: aktive Alltagswege erhöhen den Energieverbrauch und die Fitness spürbar.',
    },
    {
      concept: 'bio:k7:wahl-fit:ueberlastung',
      prompt: 'Was ist ein Zeichen möglicher Überlastung?',
      answer: 'Anhaltende Schmerzen, extreme Erschöpfung oder Leistungsabfall',
      wrong: ['Leichtes Schwitzen beim Laufen immer gefährlich', 'Durst nach Sport ist immer Krankheit', 'Atemfrequenz steigt nie bei Belastung'],
      explanation: 'Körpersignale ernst nehmen.',
      wissen:
        'Warnsignale: starke Schmerzen, Schwindel, anhaltende Müdigkeit. Dann Pause und ggf. fachlichen Rat einholen.',
    },
  ],
  pairs: [
    { term: 'Ausdauer', meaning: 'Länger belastbar bleiben', wissen: 'Herz-Kreislauf-Training.' },
    { term: 'Kraft', meaning: 'Widerstand überwinden', wissen: 'Muskeltraining.' },
    { term: 'Aufwärmen', meaning: 'Vorbereitung vor Belastung', wissen: 'Senkt Verletzungsrisiko.' },
    { term: 'Erholung', meaning: 'Pause zur Anpassung', wissen: 'Schlaf und Ruhetage.' },
    { term: 'Puls', meaning: 'Herzschläge pro Zeit', wissen: 'Steigt bei Belastung.' },
    { term: 'Koordination', meaning: 'Zusammenspiel von Nerv und Muskel', wissen: 'Wichtig für sichere Bewegung.' },
    { term: 'Dehnen', meaning: 'Fördert Beweglichkeit', wissen: 'Ergänzt Kraft und Ausdauer.' },
    { term: 'Belastung', meaning: 'Trainingsreiz auf den Körper', wissen: 'Muss dosiert sein.' },
    { term: 'Haltung', meaning: 'Stellung von Rumpf und Wirbelsäule', wissen: 'Muskeln stützen aktiv.' },
    { term: 'Alltagsbewegung', meaning: 'Aktivität außerhalb vom Sporttraining', wissen: 'Gehen, Radeln, Treppen.' },
  ],
  trueFalse: [
    {
      concept: 'bio:k7:wahl-fit:tf-aufwaermen',
      statement: 'Aufwärmen vor Sport kann Verletzungsrisiko senken.',
      correct: true,
      explanation: 'Aufwärmen bereitet Muskeln und Kreislauf vor.',
      wissen:
        'Aufwärmen steigert Durchblutung und Beweglichkeit von Muskeln und Gelenken und senkt so das Verletzungsrisiko.',
    },
    {
      concept: 'bio:k7:wahl-fit:tf-pause',
      statement: 'Erholungspausen sind für Fitness überflüssig.',
      correct: false,
      explanation: 'Anpassung braucht Ruhe.',
      wissen: 'Ohne Pause steigt das Risiko für Überlastung und Leistungsabfall.',
    },
  ],
}

const wahlMikroben: BioBank = {
  quelle: 'Wikipedia: Mikroorganismus',
  url: 'https://de.wikipedia.org/wiki/Mikroorganismus',
  conceptPrefix: 'bio:k7:wahl-mik',
  facts: [
    {
      concept: 'bio:k7:wahl-mik:nuetzlich',
      prompt: 'Welches Beispiel zeigt nützliche Mikroben?',
      answer: 'Joghurt-/Käsebakterien bzw. Darmflora',
      wrong: ['Nur hochgiftige Viren ohne Ausnahme', 'Nur Rost an Eisen', 'Nur Plastik'],
      explanation: 'Mikroben in Lebensmitteln und im Darm können nützlich sein.',
      wissen:
        'Nützliche Mikroben: Milchbakterien bei Joghurt/Käse, Hefe beim Backen, Darmflora bei der Verdauung — nicht alle Mikroorganismen sind Erreger.',
    },
    {
      concept: 'bio:k7:wahl-mik:gaerung',
      prompt: 'Was ist Gärung grob?',
      answer: 'Stoffwechsel ohne Sauerstoff (z. B. bei Hefe)',
      wrong: ['Nur Fotosynthese im Blatt', 'Nur Knochenwachstum', 'Nur Nervenleitung'],
      explanation: 'Hefe bildet u. a. CO₂ und Alkohol.',
      wissen:
        'Bei der alkoholischen Gärung wandelt Hefe Zucker ohne Sauerstoff um — Grundlage für Brot (CO₂) sowie Bier und Wein.',
    },
    {
      concept: 'bio:k7:wahl-mik:hygiene',
      prompt: 'Wozu dient Hygiene gegenüber Mikroben?',
      answer: 'Unerwünschte Keime begrenzen, ohne alles Leben zu vernichten',
      wrong: ['Alle Bakterien der Erde auslöschen', 'Nur Jahresringe waschen', 'Nur Viren züchten'],
      explanation: 'Gezielter Schutz.',
      wissen:
        'Hände waschen, Lebensmittel kühlen und Oberflächen reinigen reduzieren Erreger — nützliche Mikroben im Joghurt bleiben erwünscht.',
    },
    {
      concept: 'bio:k7:wahl-mik:pathogen',
      prompt: 'Was sind pathogene Mikroorganismen?',
      answer: 'Krankheitserreger',
      wrong: ['Immer nur Joghurtbakterien', 'Immer nur Chloroplasten', 'Immer nur Jahresringe'],
      explanation: 'Nicht alle Mikroben sind pathogen.',
      wissen:
        'Pathogene Bakterien, Viren oder Pilze können Infektionen auslösen. Die meisten Mikroorganismen sind jedoch harmlos oder nützlich.',
    },
    {
      concept: 'bio:k7:wahl-mik:darm',
      prompt: 'Welche Rolle hat die Darmflora?',
      answer: 'Unterstützt Verdauung und verdrängt teils schädliche Keime',
      wrong: ['Ersetzt die Lunge vollständig', 'Bildet die Wirbelsäule', 'Erzeugt Pollen in Blüten'],
      explanation: 'Mikrobiom im Darm.',
      wissen:
        'Darmbakterien helfen beim Aufschluss von Nahrungsstoffen und besetzen Nischen, sodass sich manche Erreger schwerer ansiedeln.',
    },
    {
      concept: 'bio:k7:wahl-mik:antibiotika',
      prompt: 'Wogegen wirken Antibiotika typischerweise?',
      answer: 'Gegen Bakterien (nicht gegen Viren)',
      wrong: ['Gegen alle Viren zuverlässig', 'Gegen Lichtmangel', 'Gegen Jahresringe'],
      explanation: 'Falscher Einsatz fördert Resistenzen.',
      wissen:
        'Antibiotika hemmen Bakterien. Gegen Viren wirken sie nicht. Unnötiger Einsatz fördert resistente Keime.',
    },
    {
      concept: 'bio:k7:wahl-mik:konservierung',
      prompt: 'Wie helfen Mikroben oder ihre Vermeidung bei Lebensmitteln?',
      answer: 'Gärung erzeugt Produkte; Kühlen/Erhitzen bremst Verderbniskeime',
      wrong: [
        'Lebensmittel brauchen nie Hygiene',
        'Nur Plastikgeschmack zählt',
        'Mikroben sind bei Lebensmitteln immer irrelevant',
      ],
      explanation: 'Nützliche vs. verderbliche Keime.',
      wissen:
        'Joghurt und Sauerkraut entstehen durch gewünschte Mikroben. Kühlen, Erhitzen und Sauberkeit verhindern Verderb und Lebensmittelinfektionen.',
    },
    {
      concept: 'bio:k7:wahl-mik:vielfalt',
      prompt: 'Welche Gruppen zählen zu Mikroorganismen?',
      answer: 'u. a. Bakterien, viele Pilze und Viren (als infektiöse Partikel)',
      wrong: ['Nur Säugetiere', 'Nur Bäume mit Zapfen', 'Nur Insekten mit Flügeln'],
      explanation: 'Winzige Lebewesen bzw. Erreger.',
      wissen:
        'Mikroorganismen sind meist einzellig oder sehr klein. Viren sind keine Zellen, werden aber im Kontext von Infektionen mitbesprochen.',
    },
  ],
  pairs: [
    { term: 'Gärung', meaning: 'Stoffwechsel ohne Sauerstoff (z. B. Hefe)', wissen: 'Brot, Bier, Wein.' },
    { term: 'Hygiene', meaning: 'Maßnahmen gegen unerwünschte Keime', wissen: 'Hände, Lebensmittel, Oberflächen.' },
    { term: 'Darmflora', meaning: 'Mikrobengemeinschaft im Darm', wissen: 'Hilft bei Verdauung.' },
    { term: 'Pathogen', meaning: 'Krankheitserregend', wissen: 'Nur ein Teil der Mikroben.' },
    { term: 'Antibiotikum', meaning: 'Hemmt Bakterien', wissen: 'Wirkt nicht gegen Viren.' },
    { term: 'Hefe', meaning: 'Einzelliger Pilz, oft bei Gärung', wissen: 'CO₂ lässt Teig aufgehen.' },
    { term: 'Milchbakterien', meaning: 'Säuren Milch zu Joghurt/Käse', wissen: 'Nützliche Lebensmittelmikroben.' },
    { term: 'Resistenz', meaning: 'Unempfindlichkeit von Bakterien gegen Antibiotika', wissen: 'Durch falschen Einsatz gefördert.' },
    { term: 'Konservierung', meaning: 'Haltbarmachen von Lebensmitteln', wissen: 'Kühlen, Erhitzen, Trocknen, Gären.' },
    { term: 'Infektion', meaning: 'Eindringen und Vermehren von Erregern', wissen: 'Hygiene senkt das Risiko.' },
  ],
  trueFalse: [
    {
      concept: 'bio:k7:wahl-mik:tf-alle',
      statement: 'Alle Mikroorganismen sind Krankheitserreger.',
      correct: false,
      explanation: 'Viele sind harmlos oder nützlich.',
      wissen:
        'Nur ein Teil der Mikroorganismen ist pathogen. Viele sind harmlos oder nützlich (Nahrungsmittel, Darmflora, Stoffkreisläufe).',
    },
    {
      concept: 'bio:k7:wahl-mik:tf-antibiotika',
      statement: 'Antibiotika wirken zuverlässig gegen Viren.',
      correct: false,
      explanation: 'Antibiotika zielen auf Bakterien.',
      wissen: 'Viruserkrankungen brauchen andere Strategien; Antibiotika helfen dort nicht.',
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
