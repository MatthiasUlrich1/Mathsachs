/**
 * Dedicated Biologie topic banks — one theme per topic ID.
 * Overview topics stay high-level; specials own the detail (no aliases/shared banks).
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

const Q = {
  pflanzen: {
    quelle: 'Wikipedia: Samenpflanzen',
    url: 'https://de.wikipedia.org/wiki/Samenpflanzen',
  },
  baum: {
    quelle: 'Wikipedia: Baum',
    url: 'https://de.wikipedia.org/wiki/Baum',
  },
  wald: {
    quelle: 'Wikipedia: Wald',
    url: 'https://de.wikipedia.org/wiki/Wald',
  },
  zelle: {
    quelle: 'Wikipedia: Zelle (Biologie)',
    url: 'https://de.wikipedia.org/wiki/Zelle_(Biologie)',
  },
  mikroben: {
    quelle: 'Wikipedia: Bakterien',
    url: 'https://de.wikipedia.org/wiki/Bakterien',
  },
  blut: {
    quelle: 'Wikipedia: Blutkreislauf',
    url: 'https://de.wikipedia.org/wiki/Blutkreislauf',
  },
  verdauung: {
    quelle: 'Wikipedia: Verdauung',
    url: 'https://de.wikipedia.org/wiki/Verdauung',
  },
  sinne: {
    quelle: 'Wikipedia: Sinnesorgan',
    url: 'https://de.wikipedia.org/wiki/Sinnesorgan',
  },
  foto: {
    quelle: 'Wikipedia: Fotosynthese',
    url: 'https://de.wikipedia.org/wiki/Fotosynthese',
  },
  oeko: {
    quelle: 'Wikipedia: Ökosystem',
    url: 'https://de.wikipedia.org/wiki/%C3%96kosystem',
  },
  genetik: {
    quelle: 'Wikipedia: Genetik',
    url: 'https://de.wikipedia.org/wiki/Genetik',
  },
  evolution: {
    quelle: 'Wikipedia: Evolution',
    url: 'https://de.wikipedia.org/wiki/Evolution',
  },
} as const

/** Blüte / Bestäubung / Befruchtung — Spezial zu Samenpflanzen. */
const bluete: BioBank = {
  ...Q.pflanzen,
  conceptPrefix: 'bio:k6:bluete',
  facts: [
    {
      concept: 'bio:k6:bluete:pollen-staubblatt',
      prompt: 'Welcher Blütenteil erzeugt Pollen?',
      answer: 'Staubblatt (Anthere)',
      wrong: ['Fruchtknoten', 'Kelchblatt', 'Narbe'],
      explanation: 'In den Staubbeuteln (Antheren) reift der Pollen heran.',
      wissen:
        'In den Staubbeuteln (Antheren) der Staubblätter reift der Pollen — männliche Blütenteile.',
      gap: 'Der Pollen entsteht in den ___ der Staubblätter.',
      gapAccepted: ['Antheren', 'Staubbeuteln', 'Staubbeutel', 'Anthere'],
    },
    {
      concept: 'bio:k6:bluete:bestaeubung-narbe',
      prompt: 'Wohin gelangt der Pollen bei der Bestäubung zuerst?',
      answer: 'Auf die Narbe',
      wrong: ['In die Wurzel', 'Auf das Blattgrün', 'In die Holzzelle'],
      explanation: 'Bestäubung: Pollen landet auf der Narbe.',
      wissen:
        'Bestäubung = Pollenübertragung auf die Narbe. Befruchtung = Verschmelzung der Keimzellen danach.',
      gap: 'Bei der Bestäubung landet der Pollen auf der ___.',
      gapAccepted: ['Narbe'],
    },
    {
      concept: 'bio:k6:bluete:frucht-samen',
      prompt: 'Was entsteht aus dem Fruchtknoten nach erfolgreicher Befruchtung?',
      answer: 'Die Frucht mit Samen',
      wrong: ['Nur Blattgrün', 'Nur Holz', 'Eine Knospe ohne Samen'],
      explanation: 'Aus dem Fruchtknoten wird die Frucht; darin liegen die Samen.',
      wissen:
        'Nach der Befruchtung wird aus der Samenanlage der Samen, aus dem Fruchtknoten die Frucht.',
    },
    {
      concept: 'bio:k6:bluete:windbestaeuber',
      prompt: 'Woran erkennst du oft Windbestäuber?',
      answer: 'Unscheinbare Blüten und viel Pollen',
      wrong: ['Immer grellrote Kronblätter', 'Keine Narbe', 'Nur unterirdische Blüten'],
      explanation: 'Ohne Schauapparat setzen sie auf große Pollenmengen.',
      wissen:
        'Windbestäuber haben oft unscheinbare Blüten und große Pollenmengen; Insektenbestäuber oft auffällige Kronblätter.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k6:bluete:paar-kelch',
      term: 'Kelchblatt',
      meaning: 'Schutz der Knospe / äußere Blütenhülle',
      wissen: 'Kelchblätter schützen oft die junge Blüte.',
    },
    {
      concept: 'bio:k6:bluete:paar-krone',
      term: 'Kronblatt',
      meaning: 'Lockt Bestäuber oft durch Farbe/Form',
      wissen: 'Auffällige Kronblätter signalisieren Bestäubern Nektar und Pollen.',
    },
    {
      concept: 'bio:k6:bluete:paar-fruchtknoten',
      term: 'Fruchtknoten',
      meaning: 'Enthält die Samenanlagen',
      wissen: 'Im Fruchtknoten liegen die Samenanlagen mit der Eizelle.',
    },
    {
      concept: 'bio:k6:bluete:paar-narbe',
      term: 'Narbe',
      meaning: 'Nimmt den Pollen bei der Bestäubung auf',
      wissen: 'Die Narbe ist die Empfangsfläche für Pollen am Stempel.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:bluete:tf-bestaeubung',
      statement: 'Bestäubung und Befruchtung sind dasselbe.',
      correct: false,
      explanation: 'Bestäubung = Pollenübertragung; Befruchtung = Verschmelzung der Keimzellen.',
      wissen:
        'Bestäubung und Befruchtung sind zwei Schritte: erst Pollen auf die Narbe, dann Verschmelzung der Keimzellen.',
    },
  ],
  sorts: [
    {
      concept: 'bio:k6:bluete:sort-weg',
      question: 'Ordne den Weg vom Pollen zur Frucht (vereinfacht).',
      labels: ['Bestäubung', 'Pollenschlauch wächst', 'Befruchtung', 'Frucht-/Samenbildung'],
      explanation: 'Erst Bestäubung, dann Pollenschlauch, Befruchtung, danach Frucht mit Samen.',
      wissen:
        'Ablauf: Bestäubung → Pollenschlauch → Befruchtung → Frucht- und Samenbildung.',
    },
  ],
}

/** Spross, Blatt, Wurzel — Spezial. */
const organe: BioBank = {
  ...Q.pflanzen,
  conceptPrefix: 'bio:k6:organe',
  facts: [
    {
      concept: 'bio:k6:organe:wurzel',
      prompt: 'Welche Aufgabe hat die Wurzel typischerweise?',
      answer: 'Verankerung und Wasser-/Nährstoffaufnahme',
      wrong: ['Fotosynthese mit Chlorophyll', 'Pollenbildung', 'Nur Jahresringe bilden'],
      explanation: 'Wurzeln halten die Pflanze und nehmen Wasser sowie Mineralstoffe auf.',
      wissen:
        'Die Wurzel verankert die Pflanze und nimmt Wasser sowie Mineralstoffe aus dem Boden auf.',
      gap: 'Die ___ nimmt Wasser und Mineralstoffe aus dem Boden auf.',
      gapAccepted: ['Wurzel', 'Wurzelspitze'],
    },
    {
      concept: 'bio:k6:organe:blatt',
      prompt: 'Welche Hauptaufgabe hat das Blatt?',
      answer: 'Fotosynthese und Gasaustausch',
      wrong: ['Nur Pollen lagern', 'Nur Samen reifen lassen', 'Nur Holzringe bilden'],
      explanation: 'Im Blatt finden Fotosynthese und Gasaustausch statt.',
      wissen:
        'Im Blatt finden Fotosynthese (mit Chlorophyll) und Gasaustausch über Spaltöffnungen statt.',
    },
    {
      concept: 'bio:k6:organe:spaltoeffnung',
      prompt: 'Wozu dienen Spaltöffnungen in der Blattunterseite vor allem?',
      answer: 'Gasaustausch (CO₂, O₂, Wasserdampf)',
      wrong: ['Pollenlagerung', 'Samenreifung', 'Holzbildung'],
      explanation: 'Über Spaltöffnungen gelangt CO₂ hinein und Wasserdampf hinaus.',
      wissen:
        'Spaltöffnungen (Stomata) regulieren den Gasaustausch und die Transpiration.',
      gap: 'Über ___ tauschen Blätter Gase mit der Luft aus.',
      gapAccepted: ['Spaltöffnungen', 'Stomata', 'Spaltöffnung'],
    },
    {
      concept: 'bio:k6:organe:spross',
      prompt: 'Welche Aufgabe hat die Sprossachse vor allem?',
      answer: 'Stütze und Stofftransport zwischen Wurzel und Blatt',
      wrong: ['Nur Pollen bilden', 'Nur Laich ablegen', 'Nur Jahresringe zählen'],
      explanation: 'Die Sprossachse trägt Blätter und leitet Stoffe.',
      wissen:
        'Die Sprossachse stützt die Pflanze und transportiert Wasser (nach oben) sowie Assimilate.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k6:organe:paar-wurzel',
      term: 'Wurzel',
      meaning: 'Verankerung, Wasser- und Nährstoffaufnahme',
      wissen: 'Wurzeln halten die Pflanze und nehmen Bodenwasser auf.',
    },
    {
      concept: 'bio:k6:organe:paar-blatt',
      term: 'Blatt',
      meaning: 'Fotosynthese und Gasaustausch',
      wissen: 'Blätter betreiben Fotosynthese und tauschen Gase aus.',
    },
    {
      concept: 'bio:k6:organe:paar-spross',
      term: 'Sprossachse',
      meaning: 'Stütze und Transport',
      wissen: 'Die Sprossachse verbindet Wurzel und Blatt und leitet Stoffe.',
    },
    {
      concept: 'bio:k6:organe:paar-stomata',
      term: 'Spaltöffnung',
      meaning: 'Reguliert Gasaustausch am Blatt',
      wissen: 'Schließzellen steuern, wie weit die Spaltöffnung geöffnet ist.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:organe:tf-wurzel-foto',
      statement: 'Wurzeln betreiben typischerweise die Haupt-Fotosynthese der Pflanze.',
      correct: false,
      explanation: 'Fotosynthese findet vor allem in grünen Blättern statt.',
      wissen:
        'Fotosynthese läuft vor allem in grünen Blättern (Chloroplasten) — nicht in den Wurzeln.',
    },
  ],
}

/** Bäume und Holzpflanzen — Spezial (kein Blütenbau). */
const baeume: BioBank = {
  ...Q.baum,
  conceptPrefix: 'bio:k6:baeume',
  facts: [
    {
      concept: 'bio:k6:baeume:jahresring',
      prompt: 'Was zeigen Jahresringe im Stammquerschnitt vor allem?',
      answer: 'Das Alter / den jährlichen Dickenzuwachs',
      wrong: ['Die Anzahl der Blüten', 'Die Zahl der Wurzeln', 'Die Insektenart im Nest'],
      explanation: 'Pro Vegetationsperiode entsteht typisch ein Jahresring.',
      wissen:
        'Jahresringe entstehen durch Frühholz (hell, weitlumig) und Spätholz (dunkler) — daran lässt sich das Alter ablesen.',
      gap: 'Am Stammquerschnitt zählt man oft die ___, um das Alter zu schätzen.',
      gapAccepted: ['Jahresringe', 'Jahrringe', 'Ringe'],
    },
    {
      concept: 'bio:k6:baeume:laub-nadel',
      prompt: 'Worin unterscheiden sich Laub- und Nadelbäume oft?',
      answer: 'Blattform und oft der Blattverlust im Winter',
      wrong: ['Nur die Farbe der Knochen', 'Ob sie Samen bilden können', 'Ob sie Wurzeln haben'],
      explanation: 'Laubbäume oft breite Blätter und Laubfall; Nadelbäume oft Nadeln und immergrün.',
      wissen:
        'Laubbäume haben oft flächige Blätter und werfen sie im Herbst ab; viele Nadelbäume behalten Nadeln und bilden Zapfen.',
    },
    {
      concept: 'bio:k6:baeume:holz',
      prompt: 'Wozu dient Holz im Baumstamm vor allem?',
      answer: 'Festigung und Wasserleitung (Xylem)',
      wrong: ['Nur Pollenbildung', 'Nur Fotosynthese ohne Blatt', 'Nur Laich speichern'],
      explanation: 'Holzgewebe stützt und leitet Wasser nach oben.',
      wissen:
        'Holz (Xylem) leitet Wasser und Mineralstoffe nach oben und gibt dem Stamm Festigkeit; Bast (Phloem) leitet Assimilate.',
    },
    {
      concept: 'bio:k6:baeume:kambium',
      prompt: 'Welche Schicht ist für das Dickenwachstum des Stammes zentral?',
      answer: 'Das Kambium (unter der Rinde)',
      wrong: ['Nur die äußerste Borkenschuppe', 'Nur die Blattadern', 'Nur der Fruchtknoten'],
      explanation: 'Das Kambium bildet nach innen Holz, nach außen Bast.',
      wissen:
        'Das Kambium liegt unter der Rinde und bildet nach innen Holzzellen, nach außen Bastzellen — so wird der Stamm dicker.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k6:baeume:paar-ring',
      term: 'Jahresring',
      meaning: 'Jährlicher Zuwachs im Stamm',
      wissen: 'Frühholz + Spätholz eines Jahres bilden einen sichtbaren Ring.',
    },
    {
      concept: 'bio:k6:baeume:paar-laub',
      term: 'Laubbaum',
      meaning: 'Oft flächige Blätter, viele werfen Laub ab',
      wissen: 'Viele Laubbäume sind sommergrün und verlieren im Herbst die Blätter.',
    },
    {
      concept: 'bio:k6:baeume:paar-nadel',
      term: 'Nadelbaum',
      meaning: 'Oft Nadeln und Zapfen, viele immergrün',
      wissen: 'Nadelbäume haben nadelförmige Blätter; viele bleiben im Winter grün.',
    },
    {
      concept: 'bio:k6:baeume:paar-holz',
      term: 'Holz / Xylem',
      meaning: 'Wasserleitung und Festigung',
      wissen: 'Xylem transportiert Wasser nach oben und stützt den Stamm.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:baeume:tf-bluete',
      statement: 'Jahresringe entstehen durch die Anzahl der Blüten eines Jahres.',
      correct: false,
      explanation: 'Jahresringe entstehen durch Dickenzuwachs im Stamm, nicht durch Blütenzahl.',
      wissen:
        'Jahresringe spiegeln den jährlichen Dickenzuwachs wider — nicht die Zahl der Blüten.',
    },
  ],
  multis: [
    {
      concept: 'bio:k6:baeume:multi-merkmal',
      question: 'Welche Merkmale passen zu Bäumen / Holzpflanzen?',
      correct: ['Verholzter Stamm', 'Oft Jahresringe im Querschnitt'],
      wrong: ['Atmung nur über Kiemen', 'Keine Wurzeln jemals'],
      explanation: 'Bäume haben verholzte Sprossachsen und typisch Dickenwachstum.',
      wissen:
        'Bäume sind Holzpflanzen mit verholztem Stamm; im Querschnitt sind oft Jahresringe sichtbar.',
    },
  ],
}

/** Nahrungsnetz / Stockwerke — Spezial zum Wald-Überblick. */
const waldNahrung: BioBank = {
  ...Q.wald,
  conceptPrefix: 'bio:k6:nahrung',
  facts: [
    {
      concept: 'bio:k6:nahrung:netz',
      prompt: 'Was beschreibt ein Nahrungsnetz im Wald genauer als eine einzelne Kette?',
      answer: 'Viele vernetzte Nahrungsbeziehungen zwischen Arten',
      wrong: ['Nur die Baumhöhe', 'Nur den Jahresniederschlag', 'Nur eine Art ohne Beziehungen'],
      explanation: 'In der Natur sind Freßbeziehungen vernetzt.',
      wissen:
        'Ein Nahrungsnetz zeigt viele vernetzte Beziehungen — realistischer als eine einzelne Nahrungskette.',
    },
    {
      concept: 'bio:k6:nahrung:stockwerk',
      prompt: 'Was bedeuten Stockwerke im Wald?',
      answer: 'Schichtung (Krone, Strauch, Kraut, Boden) mit unterschiedlichen Arten',
      wrong: ['Nur Stockwerke eines Hauses', 'Nur die Anzahl der Jahresringe', 'Nur Blütenfarben'],
      explanation: 'Verschiedene Arten nutzen verschiedene Höhen.',
      wissen:
        'Waldstockwerke (Krone, Strauch, Kraut, Boden) bieten unterschiedlichen Arten Lebensraum und Licht.',
    },
    {
      concept: 'bio:k6:nahrung:konsument1',
      prompt: 'Ein Beispiel für einen Konsumenten 1. Ordnung im Wald?',
      answer: 'Pflanzenfresser (z. B. Reh, Raupe)',
      wrong: ['Nur der Baum selbst', 'Nur Sonnenlicht', 'Nur Gestein'],
      explanation: 'Pflanzenfresser fressen Produzenten.',
      wissen:
        'Konsumenten 1. Ordnung fressen Produzenten — im Wald z. B. Reh oder Raupe.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k6:nahrung:paar-prod',
      term: 'Produzent',
      meaning: 'Erzeugt Biomasse (meist Fotosynthese)',
      wissen: 'Bäume und Kräuter erzeugen Biomasse durch Fotosynthese.',
    },
    {
      concept: 'bio:k6:nahrung:paar-kons',
      term: 'Konsument',
      meaning: 'Ernährt sich von anderen Organismen',
      wissen: 'Pflanzen- und Fleischfresser sind Konsumenten.',
    },
    {
      concept: 'bio:k6:nahrung:paar-dest',
      term: 'Destruent',
      meaning: 'Zersetzt Totholz, Laub, Kadaver',
      wissen: 'Pilze und Bakterien setzen Nährstoffe wieder frei.',
    },
    {
      concept: 'bio:k6:nahrung:paar-stock',
      term: 'Stockwerk',
      meaning: 'Schichtung des Waldes',
      wissen: 'Unterschiedliche Höhen = unterschiedliche Licht- und Lebensbedingungen.',
    },
  ],
  sorts: [
    {
      concept: 'bio:k6:nahrung:sort-kette',
      question: 'Ordne eine einfache Nahrungskette im Wald.',
      labels: ['Eichenblatt', 'Raupe', 'Meise', 'Habicht'],
      explanation: 'Produzent → Pflanzenfresser → Insektenfresser → Greifvogel.',
      wissen:
        'Energie fließt vom Blatt über Raupe und Meise zum Habicht.',
    },
  ],
}

/** Mikroskop & Organellen — Spezial zu Zellen-Überblick. */
const mikroskop: BioBank = {
  ...Q.zelle,
  conceptPrefix: 'bio:k6:mikroskop',
  facts: [
    {
      concept: 'bio:k6:mikroskop:zweck',
      prompt: 'Wozu dient das Mikroskop im Biologieunterricht vor allem?',
      answer: 'Kleine Strukturen (Zellen) sichtbar machen',
      wrong: ['Nur den pH-Wert messen', 'Nur die Luftfeuchtigkeit', 'Nur DNA sequenzieren'],
      explanation: 'Präparate werden vergrößert betrachtet.',
      wissen:
        'Das Mikroskop vergrößert Präparate, sodass Zellen und Organellen sichtbar werden.',
    },
    {
      concept: 'bio:k6:mikroskop:chloroplast',
      prompt: 'Welches Organell betreibt Fotosynthese?',
      answer: 'Chloroplast',
      wrong: ['Nur Mitochondrium', 'Nur Zellkern', 'Nur Zellwand'],
      explanation: 'Chloroplasten enthalten Chlorophyll.',
      wissen:
        'Chloroplasten enthalten Chlorophyll und sind der Ort der Fotosynthese.',
      gap: 'Photosynthese findet in den ___ statt.',
      gapAccepted: ['Chloroplasten', 'Chloroplast'],
    },
    {
      concept: 'bio:k6:mikroskop:mitochondrium',
      prompt: 'Wofür sind Mitochondrien vor allem wichtig?',
      answer: 'Zellatmung / Energiebereitstellung',
      wrong: ['Nur Pollen lagern', 'Nur Jahresringe zählen', 'Nur Laich bilden'],
      explanation: 'Mitochondrien liefern ATP durch Zellatmung.',
      wissen:
        'Mitochondrien sind „Kraftwerke“ der Zelle: sie treiben die Zellatmung und liefern Energie.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k6:mikroskop:paar-chloro',
      term: 'Chloroplast',
      meaning: 'Ort der Fotosynthese',
      wissen: 'Enthält Chlorophyll — nur in Pflanzenzellen typisch.',
    },
    {
      concept: 'bio:k6:mikroskop:paar-mito',
      term: 'Mitochondrium',
      meaning: 'Zellatmung / Energie',
      wissen: 'Liegt in Pflanzen- und Tierzellen.',
    },
    {
      concept: 'bio:k6:mikroskop:paar-vakuole',
      term: 'Vakuole',
      meaning: 'Speicher und Turgor',
      wissen: 'Besonders groß in Pflanzenzellen.',
    },
    {
      concept: 'bio:k6:mikroskop:paar-objektiv',
      term: 'Objektiv',
      meaning: 'Vergrößerungslinse nahe am Präparat',
      wissen: 'Zusammen mit dem Okular ergibt sich die Gesamtvergrößerung.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:mikroskop:tf-nacktauge',
      statement: 'Zellorganellen sind mit bloßem Auge immer klar zu erkennen.',
      correct: false,
      explanation: 'Dazu braucht man in der Regel ein Mikroskop.',
      wissen:
        'Zellorganellen sind winzig — ohne Mikroskop sind sie in der Regel nicht erkennbar.',
    },
  ],
}

// ─── K7 Spezialen ────────────────────────────────────────────────────────────

const hygiene: BioBank = {
  ...Q.mikroben,
  conceptPrefix: 'bio:k7:hygiene',
  facts: [
    {
      concept: 'bio:k7:hygiene:haende',
      prompt: 'Welche Hygienemaßnahme verringert die Übertragung vieler Keime?',
      answer: 'Hände waschen / Desinfektion wo nötig',
      wrong: ['Nie Lüften', 'Gemeinsame Zahnbürste', 'Offene Wunden ignorieren'],
      explanation: 'Hygiene unterbricht Infektionsketten.',
      wissen:
        'Keime werden oft über Hände und Oberflächen übertragen — Händewaschen unterbricht Infektionsketten.',
    },
    {
      concept: 'bio:k7:hygiene:impfung',
      prompt: 'Was leistet eine Impfung im Infektionsschutz?',
      answer: 'Trainiert das Immunsystem vorsorglich',
      wrong: ['Ersetzt Händewaschen vollständig', 'Tötet alle Bakterien der Umwelt', 'Stoppt jede Atmung'],
      explanation: 'Impfungen bilden oft Gedächtniszellen.',
      wissen:
        'Impfungen bringen das Immunsystem mit Antigenen in Kontakt und fördern Gedächtniszellen — ohne die schwere Krankheit.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k7:hygiene:tf-lueften',
      statement: 'Lüften kann helfen, Tröpfchen/Aerosole in Innenräumen zu verdünnen.',
      correct: true,
      explanation: 'Frischluft verdünnt erregerhaltige Luft.',
      wissen:
        'Regelmäßiges Lüften verdünnt Tröpfchen und Aerosole in Innenräumen und senkt so Übertragungsrisiko.',
    },
  ],
  multis: [
    {
      concept: 'bio:k7:hygiene:multi',
      question: 'Was hilft, Ansteckungen zu verringern?',
      correct: ['Hände waschen', 'Impfungen wo empfohlen'],
      wrong: ['Offene Lebensmittel wochenlang ungekühlt', 'Nie Lüften im Krankenraum'],
      explanation: 'Hygiene und Impfungen sind zentrale Schutzmaßnahmen.',
      wissen:
        'Hygiene unterbricht Übertragung; Impfungen trainieren die Abwehr vorsorglich.',
    },
  ],
}

const herz: BioBank = {
  ...Q.blut,
  conceptPrefix: 'bio:k7:herz',
  facts: [
    {
      concept: 'bio:k7:herz:pumpe',
      prompt: 'Welche Aufgabe hat das Herz im Blutkreislauf?',
      answer: 'Pumpt Blut durch den Körper',
      wrong: ['Erzeugt Pollen', 'Speichert nur Galle', 'Bildet nur Knochenmark außen'],
      explanation: 'Das Herz ist die Pumpe des Kreislaufs.',
      wissen:
        'Das Herz pumpt Blut durch Körper- und Lungenkreislauf.',
      gap: 'Das ___ pumpt das Blut durch die Gefäße.',
      gapAccepted: ['Herz'],
    },
    {
      concept: 'bio:k7:herz:arterie',
      prompt: 'Arterien führen Blut …',
      answer: 'vom Herzen weg',
      wrong: ['immer nur zum Herzen hin', 'nur in die Leber ohne Herz', 'nur in Pflanzen'],
      explanation: 'Arterien: vom Herzen; Venen: zum Herzen.',
      wissen:
        'Arterien führen Blut vom Herzen weg; Venen führen es zum Herzen zurück.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k7:herz:paar-arterie',
      term: 'Arterie',
      meaning: 'Gefäß vom Herzen weg',
      wissen: 'Im Körperkreislauf oft sauerstoffreich.',
    },
    {
      concept: 'bio:k7:herz:paar-vene',
      term: 'Vene',
      meaning: 'Gefäß zum Herzen hin',
      wissen: 'Rückfluss zum Herzen, oft mit Klappen.',
    },
    {
      concept: 'bio:k7:herz:paar-kammer',
      term: 'Herzkammer',
      meaning: 'Pumpt Blut in die großen Gefäße',
      wissen: 'Linke Kammer → Körper; rechte Kammer → Lunge (Schulmodell).',
    },
  ],
  sorts: [
    {
      concept: 'bio:k7:herz:sort-kreis',
      question: 'Ordne den Weg des Blutes im Körperkreislauf vereinfacht (Start Herz).',
      labels: ['Herz (linke Kammer)', 'Arterien zum Körper', 'Kapillaren (Stoffaustausch)', 'Venen zurück zum Herzen'],
      explanation: 'Pumpe → Arterien → Kapillaren → Venen → Herz.',
      wissen:
        'Körperkreislauf: linke Kammer → Arterien → Kapillaren → Venen → Herz.',
    },
  ],
}

const immun: BioBank = {
  ...Q.blut,
  conceptPrefix: 'bio:k7:immun',
  facts: [
    {
      concept: 'bio:k7:immun:leuko',
      prompt: 'Was leisten weiße Blutkörperchen typischerweise?',
      answer: 'Abwehr von Krankheitserregern',
      wrong: ['Nur Sauerstoffbindung', 'Nur Puls erzeugen', 'Nur Speichel bilden'],
      explanation: 'Teil der Immunabwehr.',
      wissen:
        'Weiße Blutkörperchen erkennen und bekämpfen Erreger — zentral für die Immunabwehr.',
    },
    {
      concept: 'bio:k7:immun:antikoerper',
      prompt: 'Was sind Antikörper?',
      answer: 'Abwehrstoffe, die gezielt an Erregermerkmale binden',
      wrong: ['Nur Zucker im Blut', 'Nur Jahresringe', 'Nur Blattgrün'],
      explanation: 'Spezifische Abwehr.',
      wissen:
        'Antikörper sind Proteine der spezifischen Abwehr, die an Antigene binden.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k7:immun:paar-ak',
      term: 'Antikörper',
      meaning: 'Abwehrstoff gegen Erreger/Merkmale',
      wissen: 'Gehört zur spezifischen Abwehr.',
    },
    {
      concept: 'bio:k7:immun:paar-impfung',
      term: 'Impfung',
      meaning: 'Trainiert das Immunsystem vorsorglich',
      wissen: 'Fördert Bildung von Gedächtniszellen.',
    },
    {
      concept: 'bio:k7:immun:paar-leuko',
      term: 'Leukozyten',
      meaning: 'Weiße Blutkörperchen / Abwehrzellen',
      wissen: 'Verschiedene Typen bekämpfen Erreger.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k7:immun:tf-antibiotika-viren',
      statement: 'Antibiotika helfen zuverlässig gegen alle Virusinfektionen.',
      correct: false,
      explanation: 'Antibiotika zielen auf Bakterien, nicht auf Viren.',
      wissen:
        'Antibiotika wirken gegen Bakterien — gegen Viren sind sie wirkungslos.',
    },
  ],
}

const naehrstoffe: BioBank = {
  ...Q.verdauung,
  conceptPrefix: 'bio:k7:naehrstoffe',
  facts: [
    {
      concept: 'bio:k7:naehrstoffe:kh',
      prompt: 'Welche Nährstoffgruppe liefert vor allem schnell verfügbare Energie?',
      answer: 'Kohlenhydrate',
      wrong: ['Nur Mineralstoffe ohne Energie', 'Nur Wasser', 'Nur Vitamine als Brennstoff'],
      explanation: 'Kohlenhydrate sind wichtige Energielieferanten.',
      wissen:
        'Kohlenhydrate liefern schnell verfügbare Energie; Fette speichern Energie; Eiweiße sind Baustoffe.',
    },
    {
      concept: 'bio:k7:naehrstoffe:vitamine',
      prompt: 'Welche Aussage zu Vitaminen stimmt?',
      answer: 'Sie sind Wirkstoffe in geringen Mengen — keine Hauptenergielieferanten',
      wrong: ['Sie ersetzen Fette und Kohlenhydrate als Brennstoff', 'Sie sind identisch mit Ballaststoffen', 'Sie sind nur in Knochen'],
      explanation: 'Vitamine ≠ Energielieferanten.',
      wissen:
        'Vitamine sind Wirkstoffe in kleinen Mengen — Energie liefern vor allem Kohlenhydrate und Fette.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k7:naehrstoffe:paar-kh',
      term: 'Kohlenhydrate',
      meaning: 'Energielieferanten (z. B. Stärke, Zucker)',
      wissen: 'Schnelle Energie für Zellen und Gehirn.',
    },
    {
      concept: 'bio:k7:naehrstoffe:paar-eiweiss',
      term: 'Eiweiße',
      meaning: 'Baustoffe (Aminosäuren)',
      wissen: 'Für Wachstum, Enzyme und Gewebe nötig.',
    },
    {
      concept: 'bio:k7:naehrstoffe:paar-fett',
      term: 'Fette',
      meaning: 'Energiespeicher und Zellbestandteile',
      wissen: 'Hoher Energiegehalt; Baustein von Membranen.',
    },
  ],
  multis: [
    {
      concept: 'bio:k7:naehrstoffe:multi',
      question: 'Welche Aussagen zur gesunden Ernährung passen?',
      correct: ['Abwechslungsreich essen', 'Ausreichend trinken'],
      wrong: ['Nur Süßigkeiten', 'Nie Gemüse'],
      explanation: 'Balance und Flüssigkeit sind Grundlagen.',
      wissen:
        'Ausgewogene Ernährung liefert Energie und Baustoffe aus verschiedenen Lebensmittelgruppen.',
    },
  ],
}

const verdauungsorgane: BioBank = {
  ...Q.verdauung,
  conceptPrefix: 'bio:k7:verdauung',
  facts: [
    {
      concept: 'bio:k7:verdauung:enzyme',
      prompt: 'Wozu dienen Enzyme bei der Verdauung?',
      answer: 'Spalten Nährstoffe in aufnehmbare Bausteine',
      wrong: ['Erzeugen Knochenmark', 'Transportieren nur Sauerstoff', 'Bilden Antikörper allein'],
      explanation: 'Enzyme katalysieren die Zerlegung von Nährstoffen.',
      wissen:
        'Verdauungsenzyme spalten Nährstoffe in Bausteine, die im Dünndarm aufgenommen werden.',
    },
    {
      concept: 'bio:k7:verdauung:niere',
      prompt: 'Welche Aufgabe hat die Niere grob?',
      answer: 'Filtert Blut und bildet Harn (Ausscheidung)',
      wrong: ['Verdaut Fett im Mund', 'Erzeugt Magensäure dauerhaft', 'Pumpt Blut wie das Herz'],
      explanation: 'Ausscheidung harnpflichtiger Stoffe.',
      wissen:
        'Nieren filtrieren Blut und scheiden harnpflichtige Stoffe aus — Ausscheidung ergänzt die Verdauung.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k7:verdauung:paar-magen',
      term: 'Magen',
      meaning: 'Durchmischung und saure Vorverdauung',
      wissen: 'Magensäure und Enzyme beginnen die Eiweißverdauung.',
    },
    {
      concept: 'bio:k7:verdauung:paar-duenndarm',
      term: 'Dünndarm',
      meaning: 'Hauptort der Nährstoffaufnahme',
      wissen: 'Zotten vergrößern die Oberfläche.',
    },
    {
      concept: 'bio:k7:verdauung:paar-dickdarm',
      term: 'Dickdarm',
      meaning: 'Wasserentzug, Stuhlbildung',
      wissen: 'Auch Mikrobiom beteiligt.',
    },
  ],
  sorts: [
    {
      concept: 'bio:k7:verdauung:sort-weg',
      question: 'Ordne den Weg der Nahrung im Verdauungstrakt.',
      labels: ['Mund', 'Speiseröhre', 'Magen', 'Dünndarm', 'Dickdarm'],
      explanation: 'Klassische Reihenfolge der Passage.',
      wissen:
        'Mund → Speiseröhre → Magen → Dünndarm → Dickdarm.',
    },
  ],
}

// ─── K8 Spezialen ────────────────────────────────────────────────────────────

const augeOhr: BioBank = {
  ...Q.sinne,
  conceptPrefix: 'bio:k8:auge-ohr',
  facts: [
    {
      concept: 'bio:k8:auge:netzhaut',
      prompt: 'Welche Schicht im Auge wandelt Licht in Nervensignale um?',
      answer: 'Die Netzhaut (mit Zapfen und Stäbchen)',
      wrong: ['Nur die Hornhaut allein', 'Nur der Trommelfell', 'Nur die Speiseröhre'],
      explanation: 'Rezeptoren in der Netzhaut.',
      wissen:
        'In der Netzhaut liegen Zapfen (Farbe) und Stäbchen (Dämmerung) — sie wandeln Licht in Nervensignale um.',
      gap: 'Lichtreize werden im ___ verarbeitet (Sehsinn).',
      gapAccepted: ['Auge', 'Auge/Retina', 'Auge (Netzhaut)', 'Netzhaut'],
    },
    {
      concept: 'bio:k8:ohr:schnecke',
      prompt: 'Wo werden Schallwellen im Ohr in Nervenimpulse umgewandelt?',
      answer: 'In der Hörschnecke (Innenohr)',
      wrong: ['Nur in der Netzhaut', 'Nur in der Leber', 'Nur im Fruchtknoten'],
      explanation: 'Cochlea im Innenohr.',
      wissen:
        'In der Hörschnecke (Cochlea) werden Schallwellen in Nervenimpulse für das Gehirn umgewandelt.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k8:auge:paar-netz',
      term: 'Netzhaut',
      meaning: 'Lichtempfindliche Schicht im Auge',
      wissen:
        'In der Netzhaut wandeln Zapfen und Stäbchen Lichtreize in Nervensignale um.',
    },
    {
      concept: 'bio:k8:ohr:paar-schnecke',
      term: 'Hörschnecke',
      meaning: 'Wandelt Schall im Innenohr um',
      wissen:
        'Die Hörschnecke (Cochlea) im Innenohr wandelt Schall in Nervenimpulse um.',
    },
  ],
  sorts: [
    {
      concept: 'bio:k8:auge:sort-licht',
      question: 'Ordne den vereinfachten Weg eines Lichtreizes.',
      labels: ['Licht trifft Auge', 'Rezeptoren in der Netzhaut', 'Sehnerv leitet', 'Gehirn verarbeitet'],
      explanation: 'Reiz → Rezeptor → Leitung → Verarbeitung.',
      wissen:
        'Licht trifft das Auge, Netzhaut-Rezeptoren wandeln es um, der Sehnerv leitet zum Gehirn (Sehrinde).',
    },
  ],
}

const hormone: BioBank = {
  ...Q.sinne,
  conceptPrefix: 'bio:k8:hormone',
  facts: [
    {
      concept: 'bio:k8:hormone:boten',
      prompt: 'Was transportieren Hormone typischerweise?',
      answer: 'Botenstoffe über das Blut zu Zielorganen',
      wrong: ['Nur festen Knochenkalk', 'Nur Luft in die Lungenbläschen', 'Nur Chitin'],
      explanation: 'Hormonsystem steuert längerfristig.',
      wissen:
        'Hormone gelangen über das Blut zu Zielzellen mit passenden Rezeptoren.',
      gap: 'Hormone gelangen über das ___ zu ihren Zielzellen.',
      gapAccepted: ['Blut', 'Blutbahn', 'Blutgefäßsystem'],
    },
    {
      concept: 'bio:k8:hormone:ziel',
      prompt: 'Warum wirken Hormone nicht an jeder Zelle gleich?',
      answer: 'Nur Zielzellen mit passenden Rezeptoren reagieren',
      wrong: ['Weil Blut nie Hormone trägt', 'Weil Nerven Hormone fressen', 'Weil DNA verschwindet'],
      explanation: 'Rezeptor-Spezifität.',
      wissen:
        'Nur Zellen mit dem passenden Rezeptor reagieren auf ein bestimmtes Hormon.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k8:hormone:paar-hormon',
      term: 'Hormon',
      meaning: 'Chemischer Botenstoff',
      wissen: 'Wirkt an Zielzellen mit Rezeptoren.',
    },
    {
      concept: 'bio:k8:hormone:paar-druese',
      term: 'Hormondrüse',
      meaning: 'Bildet und gibt Hormone ab',
      wissen: 'z. B. Schilddrüse, Nebenniere (Schulbeispiele).',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k8:hormone:tf-ort',
      statement: 'Hormone wirken immer nur an der Stelle, an der sie gebildet werden.',
      correct: false,
      explanation: 'Viele Hormone wirken entfernt über die Blutbahn.',
      wissen:
        'Viele Hormone wirken an entfernten Zielorganen über die Blutbahn.',
    },
  ],
}

const nervReflex: BioBank = {
  ...Q.sinne,
  conceptPrefix: 'bio:k8:nerv-reflex',
  facts: [
    {
      concept: 'bio:k8:nerv:axon',
      prompt: 'Welche Aufgabe hat das Axon einer Nervenzelle?',
      answer: 'Leitet Erregung vom Zellkörper weiter',
      wrong: ['Bildet nur Blüten', 'Speichert nur Fett im Knochen', 'Ersetzt die Atmung'],
      explanation: 'Axon = Leitungsfortsatz.',
      wissen:
        'Das Axon leitet elektrische Erregung vom Zellkörper zu Synapsen. Dendriten nehmen Signale auf. So entsteht die gerichtete Informationsübertragung.',
      gap: 'Das ___ leitet das Signal der Nervenzelle weiter.',
      gapAccepted: ['Axon', 'Neurit'],
    },
    {
      concept: 'bio:k8:nerv:reflexbogen',
      prompt: 'Was beschreibt einen Reflexbogen grob?',
      answer: 'Reiz → Rezeptor → Nerven → Effektor (oft ohne bewusste Planung)',
      wrong: ['Nur Fotosynthese im Blatt', 'Nur Gärung in Hefe', 'Nur Jahresringe'],
      explanation: 'Schnelle Schutzreaktionen.',
      wissen:
        'Beim Reflexbogen nimmt ein Rezeptor den Reiz auf, Nerven leiten, oft schaltet das Rückenmark, und ein Muskel oder eine Drüse reagiert — schnell und oft unwillkürlich.',
    },
  ],
}

const hautSinn: BioBank = {
  ...Q.sinne,
  conceptPrefix: 'bio:k8:haut',
  facts: [
    {
      concept: 'bio:k8:haut:sinne',
      prompt: 'Welche Reize nimmt die Haut u. a. wahr?',
      answer: 'Druck, Temperatur und Schmerz',
      wrong: ['Nur Licht wie die Netzhaut allein', 'Nur Schall wie die Hörschnecke', 'Nur Blütenfarbe'],
      explanation: 'Haut = großes Sinnesorgan.',
      wissen:
        'In der Haut liegen Rezeptoren für Druck, Temperatur und Schmerz. Die Haut schützt außerdem, reguliert Wärme und ist Barriere gegen Keime.',
      gap: 'Die Haut nimmt u. a. ___ und Temperatur wahr.',
      gapAccepted: ['Druck', 'Berührung', 'Schmerz'],
    },
  ],
}

const blattGewebe: BioBank = {
  ...Q.foto,
  conceptPrefix: 'bio:k9:blatt',
  facts: [
    {
      concept: 'bio:k9:blatt:spaltoeffnung',
      prompt: 'Wozu dienen Spaltöffnungen am Blatt?',
      answer: 'Gasaustausch (CO₂ hinein, Wasserdampf hinaus)',
      wrong: ['Nur Knochenbildung', 'Nur Antikörperbildung', 'Nur Federwachstum'],
      explanation: 'Reguliert von Schließzellen.',
      wissen:
        'Spaltöffnungen ermöglichen den Gasaustausch: CO₂ für die Fotosynthese hinein, O₂ und Wasserdampf hinaus. Schließzellen regulieren die Weite.',
      gap: 'CO₂ gelangt über ___ ins Blatt.',
      gapAccepted: ['Spaltöffnungen', 'Stomata', 'Spaltöffnung'],
    },
  ],
}

const stickstoffKreis: BioBank = {
  ...Q.oeko,
  conceptPrefix: 'bio:k9:stickstoff',
  facts: [
    {
      concept: 'bio:k9:n:fixierung',
      prompt: 'Was leisten Knöllchenbakterien an Leguminosen grob?',
      answer: 'Binden Luftstickstoff für die Pflanze',
      wrong: ['Betreiben nur Fotosynthese im Knochen', 'Bilden nur Federn', 'Ersetzen die Atmung'],
      explanation: 'Stickstofffixierung in Symbiose.',
      wissen:
        'Knöllchenbakterien an Wurzeln von Leguminosen fixieren Luftstickstoff und machen ihn für die Pflanze nutzbar. Das ist ein Schlüsselprozess im Stickstoffkreislauf.',
      gap: '___ binden Luftstickstoff in Wurzelknöllchen.',
      gapAccepted: ['Knöllchenbakterien', 'Rhizobien', 'Stickstofffixierer'],
    },
  ],
}

const entwicklung: BioBank = {
  quelle: 'Wikipedia: Menschliche Sexualität',
  url: 'https://de.wikipedia.org/wiki/Menschliche_Sexualit%C3%A4t',
  conceptPrefix: 'bio:k8:entwicklung',
  facts: [
    {
      concept: 'bio:k8:entwicklung:pubertaet',
      prompt: 'Wozu dienen Geschlechtshormone u. a. in der Pubertät?',
      answer: 'Steuerung der Geschlechtsentwicklung und -funktionen',
      wrong: ['Nur der Zahnschmelzhärtung', 'Nur der Blattbildung', 'Nur der Knochenmarklosigkeit'],
      explanation: 'Hormone beeinflussen Pubertät und Fortpflanzungsfunktionen.',
      wissen:
        'Geschlechtshormone steuern Pubertät, Geschlechtsmerkmale und Fortpflanzungsfunktionen.',
      gap: 'In der Pubertät steigen die ___ und lösen körperliche Veränderungen aus.',
      gapAccepted: ['Geschlechtshormone', 'Hormone', 'Sexualhormone'],
    },
    {
      concept: 'bio:k8:entwicklung:verantwortung',
      prompt: 'Was gehört zu verantwortlicher Sexualität?',
      answer: 'Einvernehmen und Schutz vor Infektionen / ungewollter Schwangerschaft',
      wrong: ['Druck ausüben', 'Informationen absichtlich verfälschen', 'Nur Gewinnmaximierung'],
      explanation: 'Respekt und Schutz sind zentral.',
      wissen:
        'Verantwortung heißt: Einvernehmen, Rücksicht und Schutz vor STI und ungewollter Schwangerschaft.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k8:entwicklung:paar-pub',
      term: 'Pubertät',
      meaning: 'Phase der Geschlechtsreifung',
      wissen: 'Hormone lösen körperliche und oft emotionale Veränderungen aus.',
    },
    {
      concept: 'bio:k8:entwicklung:paar-einvernehmen',
      term: 'Einvernehmen',
      meaning: 'Gegenseitige Zustimmung',
      wissen: 'Voraussetzung für respektvolle Sexualität.',
    },
  ],
}

// ─── K9 Spezialen ────────────────────────────────────────────────────────────

const fotosynthese: BioBank = {
  ...Q.foto,
  conceptPrefix: 'bio:k9:foto',
  facts: [
    {
      concept: 'bio:k9:foto:gleichung',
      prompt: 'Was ist die vereinfachte Wortgleichung der Fotosynthese?',
      answer: 'Kohlenstoffdioxid + Wasser → Glucose + Sauerstoff (mit Licht)',
      wrong: ['Nur Stickstoff → Gold', 'Eiweiß → Licht', 'Knochen → Blut'],
      explanation: 'Lichtenergie wird in chemische Energie überführt.',
      wissen:
        'Fotosynthese: CO₂ + Wasser → Glucose + Sauerstoff, angetrieben durch Licht.',
      gap: 'Bei der Fotosynthese entsteht neben Zucker auch ___.',
      gapAccepted: ['Sauerstoff', 'O2', 'O₂'],
    },
    {
      concept: 'bio:k9:foto:chloroplast',
      prompt: 'Wo findet die Fotosynthese in der Zelle statt?',
      answer: 'In den Chloroplasten',
      wrong: ['Nur in den Mitochondrien', 'Nur im Zellkern', 'Nur in den Knochen'],
      explanation: 'Chlorophyll in Chloroplasten fängt Licht.',
      wissen:
        'Fotosynthese läuft in den Chloroplasten ab — Chlorophyll fängt Lichtenergie.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k9:foto:paar-chloro',
      term: 'Chlorophyll',
      meaning: 'Grüner Blattfarbstoff',
      wissen: 'Fängt Lichtenergie für die Fotosynthese.',
    },
    {
      concept: 'bio:k9:foto:paar-stomata',
      term: 'Spaltöffnung',
      meaning: 'Reguliert Gasaustausch',
      wissen: 'CO₂ hinein, O₂ und Wasserdampf hinaus.',
    },
  ],
  multis: [
    {
      concept: 'bio:k9:foto:multi-faktoren',
      question: 'Welche Faktoren beeinflussen die Fotosynthese?',
      correct: ['Licht', 'CO₂-Angebot', 'Temperatur'],
      wrong: ['Nur Mondphase ohne Licht', 'Nur Verkehrsrauschen'],
      explanation: 'Abiotische Faktoren limitieren die Rate.',
      wissen:
        'Licht, CO₂ und Temperatur begrenzen die Fotosyntheserate.',
    },
  ],
}

const wasserTransport: BioBank = {
  ...Q.foto,
  conceptPrefix: 'bio:k9:wasser',
  facts: [
    {
      concept: 'bio:k9:wasser:transpiration',
      prompt: 'Was ist Transpiration?',
      answer: 'Abgabe von Wasserdampf über die Spaltöffnungen',
      wrong: ['Aufnahme von Knochenkalk', 'Bildung von Antikörpern', 'Nur Blutpumpung'],
      explanation: 'Transpiration treibt den Wasserstrom mit an.',
      wissen:
        'Transpiration: Wasserdampfabgabe über Stomata — treibt den Transpirationssog mit an.',
    },
    {
      concept: 'bio:k9:wasser:xylem',
      prompt: 'Xylem transportiert vor allem …',
      answer: 'Wasser und Mineralstoffe nach oben',
      wrong: ['Nur Nervensignale', 'Nur Hormone im Menschen', 'Nur Asssimilate abwärts ausschließlich'],
      explanation: 'Xylem = Holzteil; Phloem = Siebteil.',
      wissen:
        'Xylem leitet Wasser und Mineralstoffe nach oben; Phloem leitet Assimilate.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k9:wasser:paar-xylem',
      term: 'Xylem',
      meaning: 'Wasserleitung',
      wissen: 'Holzteil: Wasser und Mineralstoffe von der Wurzel nach oben.',
    },
    {
      concept: 'bio:k9:wasser:paar-phloem',
      term: 'Phloem',
      meaning: 'Transport von Assimilaten',
      wissen: 'Siebteil: Zucker zu Verbrauchsorten.',
    },
  ],
  sorts: [
    {
      concept: 'bio:k9:wasser:sort-weg',
      question: 'Ordne den Weg des Wassers in der Pflanze grob.',
      labels: ['Aufnahme in der Wurzel', 'Transport im Spross', 'Verdunstung am Blatt'],
      explanation: 'Boden → Leitbahnen → Transpiration.',
      wissen:
        'Wurzel → Xylem im Spross → Transpiration am Blatt.',
    },
  ],
}

const waldGewaesser: BioBank = {
  ...Q.oeko,
  conceptPrefix: 'bio:k9:wald-gewaesser',
  facts: [
    {
      concept: 'bio:k9:wald-gewaesser:kette',
      prompt: 'Ordne gedanklich: Was steht am Anfang einer Nahrungskette im Gewässer?',
      answer: 'Produzenten (z. B. Algen)',
      wrong: ['Nur Raubfische', 'Nur Steine', 'Nur Luft ohne Licht'],
      explanation: 'Produzenten erzeugen Biomasse.',
      wissen:
        'Im Gewässer starten Nahrungsketten oft bei Algen (Produzenten), dann Zooplankton, Fische …',
    },
  ],
  sorts: [
    {
      concept: 'bio:k9:wald-gewaesser:sort',
      question: 'Ordne eine Nahrungskette im Gewässer.',
      labels: ['Alge', 'Wasserfloh', 'Kleinfisch', 'Raubfisch'],
      explanation: 'Produzent → Konsumenten steigender Ordnung.',
      wissen:
        'Beispielkette: Alge (Produzent) → Wasserfloh → Kleinfisch → Raubfisch (Konsumenten).',
    },
  ],
  multis: [
    {
      concept: 'bio:k9:wald-gewaesser:multi',
      question: 'Welche Eingriffe des Menschen können Ökosysteme belasten?',
      correct: ['Überdüngung', 'Schadstoffeintrag', 'Lebensraumzerstörung'],
      wrong: ['Nur das Beobachten mit Fernglas', 'Nur das Notieren von Artenlisten'],
      explanation: 'Anthropogene Störungen.',
      wissen:
        'Überdüngung, Schadstoffe und Lebensraumzerstörung belasten Wald und Gewässer.',
    },
  ],
}

const stoffkreis: BioBank = {
  ...Q.oeko,
  conceptPrefix: 'bio:k9:stoffkreis',
  facts: [
    {
      concept: 'bio:k9:stoffkreis:def',
      prompt: 'Was beschreibt einen Stoffkreislauf (z. B. Kohlenstoff)?',
      answer: 'Stoffe werden zwischen Umwelt und Lebewesen umgewälzt',
      wrong: ['Stoffe verschwinden für immer spurlos', 'Nur einmalige Einbahn ohne Rückkehr', 'Nur Sternenlicht ohne Erde'],
      explanation: 'z. B. CO₂ ↔ Fotosynthese/Atmung.',
      wissen:
        'Im Stoffkreislauf wandern Stoffe zwischen Umwelt und Lebewesen — anders als Energie, die als Wärme verloren geht.',
    },
    {
      concept: 'bio:k9:stoffkreis:energie',
      prompt: 'Energie fließt im Ökosystem …',
      answer: 'von der Sonne über Produzenten zu Konsumenten (und geht als Wärme verloren)',
      wrong: ['Nur von Raubtieren zu Pflanzen rückwärts vollständig', 'Ohne Sonne bei Pflanzen unnötig', 'Nur in Knochen'],
      explanation: 'Kein geschlossener Energiekreislauf wie bei Stoffen.',
      wissen:
        'Energie fließt von der Sonne über Produzenten zu Konsumenten und geht als Wärme verloren.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k9:stoffkreis:paar-prod',
      term: 'Produzent',
      meaning: 'Erzeugt Biomasse (Fotosynthese)',
      wissen: 'Start des Energieflusses im Ökosystem.',
    },
    {
      concept: 'bio:k9:stoffkreis:paar-destruent',
      term: 'Destruent',
      meaning: 'Schließt Stoffkreisläufe',
      wissen: 'Setzt Nährstoffe wieder frei.',
    },
  ],
}

// ─── K10 Spezialen ───────────────────────────────────────────────────────────

const mendel: BioBank = {
  ...Q.genetik,
  conceptPrefix: 'bio:k10:mendel',
  facts: [
    {
      concept: 'bio:k10:mendel:spaltung',
      prompt: 'Was besagt Mendels Spaltungsregel grob?',
      answer: 'Bei Heterozygoten spalten Nachkommen in bestimmten Zahlenverhältnissen auf',
      wrong: ['Alle Nachkommen sind immer identisch ohne Ausnahme', 'DNA existiert nicht', 'Nur Umwelt erbt'],
      explanation: 'Klassische Mendelsche Regeln — Schulmodell.',
      wissen:
        'Spaltungsregel: bei Kreuzung Heterozygoter treten bestimmte Zahlenverhältnisse in der Nachkommenschaft auf.',
    },
  ],
  pairs: [
    {
      concept: 'bio:k10:mendel:paar-allel',
      term: 'Allel',
      meaning: 'Ausprägungsform eines Gens',
      wissen: 'Im Schulmodell oft dominant oder rezessiv.',
    },
    {
      concept: 'bio:k10:mendel:paar-genotyp',
      term: 'Genotyp',
      meaning: 'Genetische Ausstattung',
      wissen: 'Welche Allele vorliegen.',
    },
    {
      concept: 'bio:k10:mendel:paar-phaenotyp',
      term: 'Phänotyp',
      meaning: 'Erscheinungsbild',
      wissen: 'Sichtbar/messbar — Gen + Umwelt.',
    },
  ],
}

const dna: BioBank = {
  ...Q.genetik,
  conceptPrefix: 'bio:k10:dna',
  facts: [
    {
      concept: 'bio:k10:dna:gen',
      prompt: 'Was ist ein Gen vereinfacht?',
      answer: 'Abschnitt der DNA mit Information für ein Merkmal/Protein',
      wrong: ['Ein Knochenstück', 'Ein Blatt ohne Zellkern', 'Nur ein Hormon ohne DNA'],
      explanation: 'Gene sind Erbeinheiten auf der DNA.',
      wissen:
        'Ein Gen ist ein DNA-Abschnitt mit Information für ein Merkmal bzw. Protein.',
      gap: 'Die Erbinformation ist in der ___ gespeichert.',
      gapAccepted: ['DNA', 'DNS', 'DNA/DNS'],
    },
    {
      concept: 'bio:k10:dna:chromosom',
      prompt: 'Chromosomen sind …',
      answer: 'Strukturen, in denen DNA im Zellkern organisiert ist',
      wrong: ['Nur Fetttröpfchen im Blut', 'Nur Spaltöffnungen', 'Nur Federn'],
      explanation: 'Mensch: 46 Chromosomen in Körperzellen.',
      wissen:
        'Chromosomen organisieren die DNA im Zellkern — Mensch typisch 46 in Körperzellen.',
      gap: 'Der Mensch hat in Körperzellen typischerweise ___ Chromosomen.',
      gapAccepted: ['46', '46 Chromosomen'],
    },
  ],
  pairs: [
    {
      concept: 'bio:k10:dna:paar-dna',
      term: 'DNA',
      meaning: 'Träger der Erbinformation',
      wissen: 'Doppelhelix mit Basensequenz.',
    },
    {
      concept: 'bio:k10:dna:paar-chromosom',
      term: 'Chromosom',
      meaning: 'DNA-Paket im Zellkern',
      wissen: 'Träger der Gene.',
    },
  ],
  sorts: [
    {
      concept: 'bio:k10:dna:sort',
      question: 'Ordne vom großen zum kleinen Informationspaket (vereinfacht).',
      labels: ['Zellkern', 'Chromosom', 'Gen', 'Basenpaar-Information'],
      explanation: 'Hierarchie der Erbinformation.',
      wissen:
        'Im Zellkern liegen Chromosomen; Abschnitte davon sind Gene mit Basenpaar-Information.',
    },
  ],
  multis: [
    {
      concept: 'bio:k10:dna:multi',
      question: 'Welche Aussagen zur DNA stimmen?',
      correct: ['Sie trägt Erbinformation', 'Sie liegt vor allem im Zellkern'],
      wrong: ['Sie ist identisch mit Magensäure', 'Sie ist nur in den Wurzeln von Tieren'],
      explanation: 'DNA im Kern.',
      wissen:
        'DNA trägt Erbinformation und liegt vor allem im Zellkern.',
    },
  ],
}

const selektion: BioBank = {
  ...Q.evolution,
  conceptPrefix: 'bio:k10:selektion',
  facts: [
    {
      concept: 'bio:k10:selektion:def',
      prompt: 'Was bedeutet natürliche Selektion?',
      answer: 'Individuen mit vorteilhaften Merkmalen hinterlassen im Mittel mehr Nachkommen',
      wrong: ['Alle Individuen überleben immer gleich', 'Merkmale entstehen durch Wunsch allein', 'Evolution stoppt bei Pflanzen'],
      explanation: 'Variation + Selektion → Anpassung über Generationen.',
      wissen:
        'Natürliche Selektion: vorteilhafte Merkmale werden über Generationen häufiger.',
      gap: 'Darwin erklärte Anpassung u. a. durch natürliche ___.',
      gapAccepted: ['Selektion', 'Auslese'],
    },
  ],
  pairs: [
    {
      concept: 'bio:k10:selektion:paar-var',
      term: 'Variation',
      meaning: 'Unterschiede zwischen Individuen',
      wissen: 'Voraussetzung für Selektion.',
    },
    {
      concept: 'bio:k10:selektion:paar-anp',
      term: 'Anpassung',
      meaning: 'Merkmal, das Überleben/Fortpflanzung begünstigt',
      wissen: 'Oft Ergebnis langfristiger Selektion.',
    },
    {
      concept: 'bio:k10:selektion:paar-iso',
      term: 'Isolation',
      meaning: 'Unterbindet Genfluss zwischen Populationen',
      wissen: 'Kann Artbildung fördern.',
    },
  ],
  sorts: [
    {
      concept: 'bio:k10:selektion:sort',
      question: 'Ordne den vereinfachten Ablauf der Anpassung durch Selektion.',
      labels: ['Variation in der Population', 'Unterschiedlicher Fortpflanzungserfolg', 'Häufigere vorteilhafte Allele', 'Angepasstheit der Population'],
      explanation: 'Variation → Selektion → genetischer Wandel.',
      wissen:
        'Variation → unterschiedlicher Fortpflanzungserfolg → vorteilhafte Allele häufiger → Angepasstheit.',
    },
  ],
  multis: [
    {
      concept: 'bio:k10:selektion:multi',
      question: 'Welche Faktoren können Evolution beeinflussen?',
      correct: ['Mutation', 'Selektion', 'Gendrift'],
      wrong: ['Nur der Wochentag', 'Nur die Schulklingel'],
      explanation: 'Evolutionsfaktoren.',
      wissen:
        'Mutation, Selektion, Gendrift und Genfluss beeinflussen Evolution.',
    },
  ],
}

/** All dedicated special-topic generators (no overview aliases). */
export const BIOLOGIE_SPECIAL_GENERATORS: Record<string, Topic['generate']> = {
  'bi-k6-lb1-bluete': bankGenerate(bluete),
  'bi-k6-lb1-baeume': bankGenerate(baeume),
  'bi-k6-lb1-organe': bankGenerate(organe),
  'bi-k6-lb4-nahrung': bankGenerate(waldNahrung),
  'bi-k6-lb5-mikroskop': bankGenerate(mikroskop),
  'bi-k7-lb1-hygiene': bankGenerate(hygiene),
  'bi-k7-lb2-herz': bankGenerate(herz),
  'bi-k7-lb2-immun': bankGenerate(immun),
  'bi-k7-lb3-naehrstoffe': bankGenerate(naehrstoffe),
  'bi-k7-lb3-organe': bankGenerate(verdauungsorgane),
  'bi-k8-lb1-auge-ohr': bankGenerate(augeOhr),
  'bi-k8-lb1-hormone': bankGenerate(hormone),
  'bi-k8-lb1-nerv-reflex': bankGenerate(nervReflex),
  'bi-k8-lb1-haut': bankGenerate(hautSinn),
  'bi-k8-lb2-entwicklung': bankGenerate(entwicklung),
  'bi-k9-lb1-fotosynthese': bankGenerate(fotosynthese),
  'bi-k9-lb1-wasser': bankGenerate(wasserTransport),
  'bi-k9-lb1-blatt': bankGenerate(blattGewebe),
  'bi-k9-lb2-wald-gewaesser': bankGenerate(waldGewaesser),
  'bi-k9-lb2-stoffkreis': bankGenerate(stoffkreis),
  'bi-k9-lb2-stickstoff': bankGenerate(stickstoffKreis),
  'bi-k10-lb1-mendel': bankGenerate(mendel),
  'bi-k10-lb1-dna': bankGenerate(dna),
  'bi-k10-lb2-selektion': bankGenerate(selektion),
}
