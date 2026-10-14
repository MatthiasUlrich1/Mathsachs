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
  facts: [
    {
      concept: 'bio:k7:warum-beeinflusst-ernaehrung-wohlbefinde',
      prompt: 'Warum beeinflusst Ernährung Wohlbefinden und Leistungsfähigkeit?',
      answer: 'Sie liefert Energie und Baustoffe für Körper und Gehirn',
      wrong: ['Sie ersetzt Schlaf vollständig', 'Sie macht Knochen überflüssig', 'Sie stoppt jede Atmung'],
      explanation: 'Nahrung und Gewohnheiten prägen Gesundheit.',
      wissen:
        'Nahrung liefert Energie (Kohlenhydrate, Fette) und Baustoffe (Eiweiße, Mineralstoffe). Gehirn und Muskeln brauchen stetige Versorgung für Leistung und Wohlbefinden.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k7:nur-der-geschmack-entscheidet-ueber-eine',
      statement: 'Nur der Geschmack entscheidet über eine ausgewogene Ernährung.',
      correct: false,
      explanation: 'Nährstoffbedarf, Vielfalt und Maß zählen mit.',
      wissen:
        'Geschmack allein reicht nicht: ausgewogene Ernährung berücksichtigt Energiebedarf, Nährstoffvielfalt und Maß — nicht nur Vorlieben.',
    },
  ],
}

const wahlFitness: BioBank = {
  quelle: 'Wikipedia: Fitness',
  url: 'https://de.wikipedia.org/wiki/Fitness',
  facts: [
    {
      concept: 'bio:k7:was-verbessert-regelmaessige-bewegung-ty',
      prompt: 'Was verbessert regelmäßige Bewegung typischerweise?',
      answer: 'Herz-Kreislauf-Leistung und Muskelkraft',
      wrong: ['Die Notwendigkeit zu atmen entfällt', 'Knochen verschwinden', 'Immunsystem wird nutzlos'],
      explanation: 'Training stärkt Herz, Kreislauf und Muskeln.',
      wissen:
        'Regelmäßiges Training stärkt Herz und Kreislauf, erhöht die Ausdauer und baut Muskelkraft auf — positiv für Stoffwechsel und Gesundheit.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k7:aufwaermen-vor-sport-kann-verletzungsris',
      statement: 'Aufwärmen vor Sport kann Verletzungsrisiko senken.',
      correct: true,
      explanation: 'Aufwärmen bereitet Muskeln und Kreislauf vor.',
      wissen:
        'Aufwärmen steigert Durchblutung und Beweglichkeit von Muskeln und Gelenken und senkt so das Verletzungsrisiko.',
    },
  ],
}

const wahlMikroben: BioBank = {
  quelle: 'Wikipedia: Mikroorganismus',
  url: 'https://de.wikipedia.org/wiki/Mikroorganismus',
  facts: [
    {
      concept: 'bio:k7:welches-beispiel-zeigt-nuetzliche-mikrob',
      prompt: 'Welches Beispiel zeigt nützliche Mikroben?',
      answer: 'Joghurt-/Käsehefen und -bakterien bzw. Darmflora',
      wrong: ['Nur hochgiftige Viren ohne Ausnahme', 'Nur Rost an Eisen', 'Nur Plastik'],
      explanation: 'Mikroben in Lebensmitteln und im Darm können nützlich sein.',
      wissen:
        'Nützliche Mikroben: Milchbakterien bei Joghurt/Käse, Hefe beim Backen, Darmflora bei der Verdauung — nicht alle Mikroorganismen sind Erreger.',
    },
  ],
  pairs: [
    {
      term: 'Gärung',
      meaning: 'Stoffwechsel ohne Sauerstoff (z. B. Hefe)',
      wissen: 'Ohne Sauerstoff: Hefe bildet z. B. CO₂ und Alkohol — Grundlage für Brot, Bier und Wein.',
    },
    {
      term: 'Hygiene',
      meaning: 'Maßnahmen gegen unerwünschte Keime',
      wissen: 'Hygiene begrenzt unerwünschte Keime, ohne nützliche Mikroben pauschal zu vernichten.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k7:alle-mikroorganismen-sind-krankheitserre',
      statement: 'Alle Mikroorganismen sind Krankheitserreger.',
      correct: false,
      explanation: 'Viele sind harmlos oder nützlich.',
      wissen:
        'Nur ein Teil der Mikroorganismen ist pathogen. Viele sind harmlos oder nützlich (Nahrungsmittel, Darmflora, Stoffkreisläufe).',
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
