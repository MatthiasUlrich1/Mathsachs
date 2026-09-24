/**
 * Biologie Klasse 6 — Lehrplan 522 LB1–5 + Wahl.
 * Themenideen angelehnt an Schlaukopf (Blütenpflanzen, Bäume, Zellen, Wirbellose, Wald),
 * Wortlaut original; Zuordnung nach sächsischem Lehrplan.
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

const Q = {
  pflanzen: {
    quelle: 'Wikipedia: Samenpflanzen',
    url: 'https://de.wikipedia.org/wiki/Samenpflanzen',
  },
  wirbellose: {
    quelle: 'Wikipedia: Wirbellose',
    url: 'https://de.wikipedia.org/wiki/Wirbellose',
  },
  wald: {
    quelle: 'Wikipedia: Wald',
    url: 'https://de.wikipedia.org/wiki/Wald',
  },
  zelle: {
    quelle: 'Wikipedia: Zelle (Biologie)',
    url: 'https://de.wikipedia.org/wiki/Zelle_(Biologie)',
  },
} as const

const samenpflanzen: BioBank = {
  ...Q.pflanzen,
  facts: [
    {
      prompt: 'Welcher Blütenteil erzeugt Pollen?',
      answer: 'Staubblatt (Anthere)',
      wrong: ['Fruchtknoten', 'Kelchblatt', 'Narbe'],
      explanation: 'In den Staubbeuteln (Antheren) reift der Pollen heran.',
      wissen: 'Die Blüte dient der geschlechtlichen Fortpflanzung der Samenpflanzen.',
      gap: 'Der Pollen entsteht in den ___ der Staubblätter.',
      gapAccepted: ['Antheren', 'Staubbeuteln', 'Staubbeutel', 'Anthere'],
    },
    {
      prompt: 'Wohin gelangt der Pollen bei der Bestäubung zuerst?',
      answer: 'Auf die Narbe',
      wrong: ['In die Wurzel', 'Auf das Blattgrün', 'In die Holzzelle'],
      explanation: 'Bestäubung: Pollen landet auf der Narbe und keimt zum Fruchtknoten.',
      wissen: 'Bestäubung und Befruchtung sind aufeinanderfolgende Schritte.',
      gap: 'Bei der Bestäubung landet der Pollen auf der ___.',
      gapAccepted: ['Narbe'],
    },
    {
      prompt: 'Was entsteht aus dem Fruchtknoten nach erfolgreicher Befruchtung?',
      answer: 'Die Frucht mit Samen',
      wrong: ['Nur Blattgrün', 'Nur Holz', 'Eine Knospe ohne Samen'],
      explanation: 'Aus dem Fruchtknoten wird die Frucht; darin liegen die Samen.',
      wissen: 'Samen enthalten den Embryo und oft Nährgewebe.',
    },
    {
      prompt: 'Welche Aufgabe hat die Wurzel typischerweise?',
      answer: 'Verankerung und Wasser-/Nährstoffaufnahme',
      wrong: ['Fotosynthese mit Chlorophyll', 'Pollenbildung', 'Transpiration nur über Rinde'],
      explanation: 'Wurzeln halten die Pflanze und nehmen Wasser sowie Mineralstoffe auf.',
      wissen: 'Spross, Blatt und Wurzel bilden die Grundorgane der Samenpflanze.',
    },
    {
      prompt: 'Wozu dienen Spaltöffnungen in der Blattunterseite vor allem?',
      answer: 'Gasaustausch (CO₂, O₂, Wasserdampf)',
      wrong: ['Pollenlagerung', 'Samenreifung', 'Holzbildung'],
      explanation: 'Über Spaltöffnungen gelangt CO₂ hinein und Wasserdampf hinaus.',
      wissen: 'Transpiration und Fotosynthese hängen mit dem Gasaustausch zusammen.',
      gap: 'Über ___ tauschen Blätter Gase mit der Luft aus.',
      gapAccepted: ['Spaltöffnungen', 'Stomata', 'Spaltöffnung'],
    },
  ],
  pairs: [
    { term: 'Kelchblatt', meaning: 'Schutz der Knospe / äußere Blütenhülle', wissen: 'Kelchblätter schützen oft die junge Blüte.' },
    { term: 'Kronblatt', meaning: 'Lockt Bestäuber oft durch Farbe/Form', wissen: 'Auffällige Kronblätter unterstützen Bestäubung durch Tiere.' },
    { term: 'Fruchtknoten', meaning: 'Enthält die Samenanlagen', wissen: 'Hier findet die Befruchtung der Eizelle statt.' },
    { term: 'Samen', meaning: 'Ausbreitungs- und Überdauerungsstadium', wissen: 'Samen ermöglichen Ausbreitung und Überdauerung ungünstiger Zeiten.' },
  ],
  trueFalse: [
    {
      statement: 'Bestäubung und Befruchtung sind dasselbe.',
      correct: false,
      explanation: 'Bestäubung = Pollenübertragung; Befruchtung = Verschmelzung der Keimzellen.',
      wissen: 'Die Unterscheidung ist ein Klassiker in Klassenarbeiten.',
    },
    {
      statement: 'Windbestäuber haben oft unscheinbare Blüten und viel Pollen.',
      correct: true,
      explanation: 'Ohne „Schauapparat“ setzen sie auf große Pollenmengen.',
      wissen: 'Bestäubungsstrategien sind Angepasstheiten.',
    },
  ],
  sorts: [
    {
      question: 'Ordne den Weg vom Pollen zur Frucht (vereinfacht).',
      labels: ['Bestäubung', 'Pollenschlauch wächst', 'Befruchtung', 'Frucht-/Samenbildung'],
      explanation: 'Erst Bestäubung, dann Pollenschlauch, Befruchtung, danach Frucht mit Samen.',
      wissen: 'Die Reihenfolge hilft, Fortpflanzung der Samenpflanzen zu strukturieren.',
    },
  ],
  multis: [
    {
      question: 'Welche Aussagen zu Blütenpflanzen stimmen?',
      correct: ['Sie bilden Samen', 'Viele werden von Insekten bestäubt'],
      wrong: ['Sie haben nie Wurzeln', 'Sie atmen nur über Kiemen'],
      explanation: 'Samenpflanzen bilden Samen; Bestäubung oft durch Tiere oder Wind.',
      wissen: 'Kernmerkmale der Samenpflanzen im Unterricht.',
    },
  ],
}

/** Überblick Wirbellose: nur übergeordnete Gruppen / Abgrenzung — keine Spezialdetails. */
const wirbelloseOverview: BioBank = {
  ...Q.wirbellose,
  facts: [
    {
      prompt: 'Was bedeutet „wirbellos“?',
      answer: 'Ohne Wirbelsäule',
      wrong: ['Mit Federkleid', 'Immer mit sechs Beinen', 'Nur im Meer lebend'],
      explanation: 'Wirbellose Tiere haben keine Wirbelsäule — z. B. Insekten, Spinnen, Würmer, Weichtiere.',
      wissen: 'Überbegriff für viele Stämme ohne innere Wirbelsäule.',
      gap: 'Wirbellose Tiere haben keine ___.',
      gapAccepted: ['Wirbelsäule', 'Wirbelsaeule'],
    },
    {
      prompt: 'Welche Aussage zur Vielfalt wirbelloser Tiere stimmt?',
      answer: 'Dazu gehören u. a. Insekten, Spinnen, Würmer und Weichtiere',
      wrong: [
        'Nur Fische und Vögel',
        'Nur Säugetiere',
        'Nur Tiere mit Wirbelsäule',
      ],
      explanation: 'Wirbellose umfassen viele Gruppen mit unterschiedlichen Lebensräumen.',
      wissen: 'Überblick: Gruppennamen und Lebensräume, nicht Spezialbau.',
    },
  ],
  pairs: [
    { term: 'Wirbelloses Tier', meaning: 'Ohne Wirbelsäule', wissen: 'z. B. Insekten, Spinnen, Würmer, Weichtiere.' },
    { term: 'Insekt', meaning: 'Gliederfüßer mit typisch sechs Beinen', wissen: 'Überblick: Insekten als artenreiche Gruppe.' },
    { term: 'Spinne', meaning: 'Gliederfüßer mit acht Beinen', wissen: 'Überblick: Spinnen ≠ Insekten.' },
    { term: 'Lebensraum', meaning: 'Ort, an den Tiere angepasst sind', wissen: 'Wirbellose besiedeln Land, Wasser und Luft.' },
  ],
  trueFalse: [
    {
      statement: 'Alle wirbellosen Tiere haben sechs Beine.',
      correct: false,
      explanation: 'Nur Insekten typischerweise sechs; Spinnen acht, Würmer keine Beine.',
      wissen: '„Wirbellos“ fasst viele Stämme zusammen.',
    },
    {
      statement: 'Wirbellose haben keine Wirbelsäule.',
      correct: true,
      explanation: 'Das ist das namensgebende Merkmal.',
      wissen: 'Abgrenzung zu Wirbeltieren.',
    },
  ],
  multis: [
    {
      question: 'Welche Tiere sind wirbellos?',
      correct: ['Honigbiene', 'Kreuzspinne', 'Regenwurm'],
      wrong: ['Forelle', 'Amsel'],
      explanation: 'Fische und Vögel sind Wirbeltiere.',
      wissen: 'Überblick: Zuordnung wirbellos vs. Wirbeltier.',
    },
  ],
  icons: [
    {
      question: 'Welches Tier ist wirbellos?',
      prompt: 'Wirbellose – Überblick',
      options: [
        { id: 'biene', label: 'Biene', icon: '🐝' },
        { id: 'forelle', label: 'Forelle', icon: '🐟' },
        { id: 'adler', label: 'Adler', icon: '🦅' },
        { id: 'hirsch', label: 'Hirsch', icon: '🦌' },
      ],
      correctId: 'biene',
      explanation: 'Die Biene hat keine Wirbelsäule — Fische, Vögel und Säuger sind Wirbeltiere.',
      wissen: 'Überblick: wirbellos vs. Wirbeltier.',
    },
  ],
}

/** Insekten – Bau und Metamorphose (Spezialthema). */
const insekten: BioBank = {
  quelle: 'Wikipedia: Insekten',
  url: 'https://de.wikipedia.org/wiki/Insekten',
  facts: [
    {
      prompt: 'Was unterscheidet Insekten äußerlich typischerweise?',
      answer: 'Sechs Beine und oft ein Chitinpanzer',
      wrong: ['Acht Beine und Federn', 'Wirbelsäule und Fell', 'Kiemen und Flossen'],
      explanation: 'Insekten: drei Körperabschnitte, sechs Beine, äußeres Skelett aus Chitin.',
      wissen: 'Insekten sind die artenreichste Wirbellosen-Gruppe.',
      gap: 'Insekten haben typischerweise ___ Beine.',
      gapAccepted: ['sechs', '6', 'Sechs'],
    },
    {
      prompt: 'Was ist eine vollständige Metamorphose bei Insekten?',
      answer: 'Ei → Larve → Puppe → Imago',
      wrong: ['Nur Ei → erwachsenes Tier', 'Samen → Keimling → Baum', 'Kaulquappe → Frosch ohne Puppe'],
      explanation: 'Bei Schmetterlingen u. a.: Larve, Puppe, dann fertiges Insekt (Imago).',
      wissen: 'Entwicklungstypen der Insekten sind ein zentrales Lernziel.',
    },
  ],
  pairs: [
    { term: 'Chitinpanzer', meaning: 'Äußeres Skelett vieler Gliederfüßer', wissen: 'Schutz und Ansatz für Muskeln.' },
    { term: 'Imago', meaning: 'Erwachsenes Insekt nach der Metamorphose', wissen: 'Endstadium der Entwicklung.' },
    { term: 'Puppe', meaning: 'Ruhestadium mit Umbau', wissen: 'Bei vollständiger Verwandlung.' },
    { term: 'Fühler', meaning: 'Sinnesorgane am Kopf vieler Insekten', wissen: 'Riechen und Tasten.' },
  ],
  trueFalse: [
    {
      statement: 'Viele Insekten durchlaufen eine Metamorphose.',
      correct: true,
      explanation: 'Vollständige oder unvollständige Verwandlung ist weit verbreitet.',
      wissen: 'Metamorphose = Gestaltwechsel in der Entwicklung.',
    },
    {
      statement: 'Insekten haben typischerweise acht Beine.',
      correct: false,
      explanation: 'Insekten: sechs Beine; Spinnen: acht.',
      wissen: 'Unterscheidung Insekt / Spinne.',
    },
  ],
  sorts: [
    {
      question: 'Ordne die vollständige Insektenmetamorphose.',
      labels: ['Ei', 'Larve', 'Puppe', 'Imago'],
      explanation: 'Klassische Reihenfolge bei Schmetterling, Käfer u. a.',
      wissen: 'Puppe = Ruhestadium mit Umbau.',
    },
  ],
  icons: [
    {
      question: 'Welches Tier ist ein Insekt (6 Beine)?',
      prompt: 'Insekten',
      options: [
        { id: 'biene', label: 'Biene', icon: '🐝' },
        { id: 'spinne', label: 'Kreuzspinne', icon: '🕷️' },
        { id: 'regenwurm', label: 'Regenwurm', icon: '🪱' },
        { id: 'schnecke', label: 'Schnecke', icon: '🐌' },
      ],
      correctId: 'biene',
      explanation: 'Insekten haben sechs Beine; Spinnen acht.',
      wissen: 'Gliederfüßer unterscheiden.',
    },
  ],
}

/** Spinnen und andere Gliederfüßer (Spezialthema). */
const spinnen: BioBank = {
  quelle: 'Wikipedia: Spinnentiere',
  url: 'https://de.wikipedia.org/wiki/Spinnentiere',
  facts: [
    {
      prompt: 'Wie viele Beine haben Spinnen typischerweise?',
      answer: 'Acht',
      wrong: ['Sechs', 'Vier', 'Zehn'],
      explanation: 'Spinnentiere haben acht Beine; Insekten sechs.',
      wissen: 'Spinnen ≠ Insekten — wichtiges Unterscheidungsmerkmal.',
      gap: 'Spinnen haben ___ Beine.',
      gapAccepted: ['acht', '8', 'Acht'],
    },
    {
      prompt: 'Wozu dient das Spinnennetz vor allem?',
      answer: 'Beutefang (und Orientierung)',
      wrong: ['Fotosynthese', 'Knochenbildung', 'Säugen der Jungen'],
      explanation: 'Viele Spinnen fangen Beute mit Netzen aus Spinnenseide.',
      wissen: 'Angepasstheit der Spinnen an räuberische Lebensweise.',
    },
  ],
  pairs: [
    { term: 'Spinne', meaning: 'Acht Beine, keine Fühler wie Insekten', wissen: 'Spinnentiere gehören zu den Kieferklauenträgern.' },
    { term: 'Spinnenseide', meaning: 'Festhalten von Beute / Netzbau', wissen: 'Hochfeste Fäden aus Drüsen.' },
    { term: 'Kieferklaue', meaning: 'Mundwerkzeug vieler Spinnentiere', wissen: 'Oft mit Giftdrüse.' },
    { term: 'Gliederfüßer', meaning: 'Chitinpanzer und gegliederte Beine', wissen: 'Insekten und Spinnen gehören dazu.' },
  ],
  trueFalse: [
    {
      statement: 'Spinnen sind Insekten.',
      correct: false,
      explanation: 'Spinnen haben acht Beine und gehören zu den Spinnentieren.',
      wissen: 'Häufige Verwechslung in Quizzes.',
    },
    {
      statement: 'Viele Spinnen nutzen Netze zum Beutefang.',
      correct: true,
      explanation: 'Spinnenseide dient u. a. dem Fang von Beute.',
      wissen: 'Angepasstheit.',
    },
  ],
  icons: [
    {
      question: 'Welches Tier ist eine Spinne (8 Beine)?',
      prompt: 'Spinnen',
      options: [
        { id: 'spinne', label: 'Kreuzspinne', icon: '🕷️' },
        { id: 'biene', label: 'Biene', icon: '🐝' },
        { id: 'schnecke', label: 'Schnecke', icon: '🐌' },
        { id: 'regenwurm', label: 'Regenwurm', icon: '🪱' },
      ],
      correctId: 'spinne',
      explanation: 'Spinnen haben acht Beine; Insekten sechs.',
      wissen: 'Spinnentiere vs. Insekten.',
    },
  ],
}

const systematikK6: BioBank = {
  quelle: 'Wikipedia: Systematik (Biologie)',
  url: 'https://de.wikipedia.org/wiki/Systematik_(Biologie)',
  facts: [
    {
      prompt: 'Woran erkennst du Wirbeltiere grundsätzlich?',
      answer: 'Sie besitzen eine Wirbelsäule (bzw. Chorda/Wirbel)',
      wrong: ['Sie haben immer sechs Beine', 'Sie haben nie Augen', 'Sie leben nur im Meer'],
      explanation: 'Wirbeltiere: innere Stützstruktur aus Wirbelsäule.',
      wissen: 'Vergleich Wirbellose/Wirbeltiere ist LB3-Kern.',
    },
    {
      prompt: 'Welche Gruppe ist wirbellos?',
      answer: 'Insekten',
      wrong: ['Säugetiere', 'Vögel', 'Knochenfische'],
      explanation: 'Insekten haben keine Wirbelsäule.',
      wissen: 'Einfache Zuordnung im System.',
    },
  ],
  pairs: [
    { term: 'Wirbeltier', meaning: 'Tier mit Wirbelsäule', wissen: 'Fische, Lurche, Kriechtiere, Vögel, Säuger.' },
    { term: 'Wirbelloses Tier', meaning: 'Ohne Wirbelsäule', wissen: 'z. B. Insekten, Spinnen, Würmer, Weichtiere.' },
    { term: 'Gliederfüßer', meaning: 'Chitinpanzer und gegliederte Beine', wissen: 'Insekten und Spinnen gehören dazu.' },
  ],
  trueFalse: [
    {
      statement: 'Spinnen sind Insekten.',
      correct: false,
      explanation: 'Spinnen haben acht Beine und gehören zu den Spinnentieren.',
      wissen: 'Häufige Verwechslung in Quizzes.',
    },
  ],
  multis: [
    {
      question: 'Welche Merkmale passen zu Wirbeltieren?',
      correct: ['Innere Wirbelsäule', 'Oft Schädel'],
      wrong: ['Immer genau sechs Beine', 'Nie Lungen oder Kiemen'],
      explanation: 'Wirbeltiere haben innere Stütze; Beinzahl variiert stark.',
      wissen: 'Vergleichende Merkmale.',
    },
  ],
}

const wald: BioBank = {
  ...Q.wald,
  facts: [
    {
      prompt: 'Was beschreibt ein Nahrungsnetz im Wald?',
      answer: 'Viele vernetzte Nahrungsbeziehungen zwischen Arten',
      wrong: ['Nur die Baumhöhe', 'Nur die Bodentemperatur', 'Nur den Jahresniederschlag'],
      explanation: 'Produzenten, Konsumenten und Destruenten sind vernetzt.',
      wissen: 'Wald als Lebensgemeinschaft: Stoff- und Energieflüsse.',
      gap: 'Grüne Pflanzen sind im Wald typische ___.',
      gapAccepted: ['Produzenten', 'Produzenten (Erzeuger)', 'Erzeuger'],
    },
    {
      prompt: 'Welche Rolle haben Destruenten (z. B. Pilze, Bakterien)?',
      answer: 'Abbau toter organischer Substanz',
      wrong: ['Nur Jagd auf Hirsche', 'Nur Fotosynthese', 'Nur Nestbau'],
      explanation: 'Zersetzer schließen Stoffkreisläufe.',
      wissen: 'Ohne Destruenten blieben Nährstoffe gebunden.',
    },
    {
      prompt: 'Ein Beispiel für einen Konsumenten 1. Ordnung im Wald?',
      answer: 'Pflanzenfresser (z. B. Reh, Raupe)',
      wrong: ['Nur der Baum selbst', 'Nur Sonnenlicht', 'Nur Gestein'],
      explanation: 'Pflanzenfresser fressen Produzenten.',
      wissen: 'Trophieebenen im Ökosystem Wald.',
    },
  ],
  pairs: [
    { term: 'Produzent', meaning: 'Erzeugt Biomasse (meist Fotosynthese)', wissen: 'Bäume und Kräuter.' },
    { term: 'Konsument', meaning: 'Ernährt sich von anderen Organismen', wissen: 'Pflanzen- und Fleischfresser.' },
    { term: 'Destruent', meaning: 'Zersetzt Totholz, Laub, Kadaver', wissen: 'Pilze und Bakterien sind zentral.' },
    { term: 'Stockwerk', meaning: 'Schichtung des Waldes (Kronen-, Strauch- …)', wissen: 'Verschiedene Arten nutzen verschiedene Höhen.' },
  ],
  trueFalse: [
    {
      statement: 'Im Wald gibt es nur eine Nahrungskette, nie ein Netz.',
      correct: false,
      explanation: 'In der Natur sind Beziehungen vernetzt (Nahrungsnetz).',
      wissen: 'Modell: Kette vs. Netz.',
    },
  ],
  sorts: [
    {
      question: 'Ordne eine einfache Nahrungskette im Wald.',
      labels: ['Eichenblatt', 'Raupe', 'Meise', 'Habicht'],
      explanation: 'Produzent → Pflanzenfresser → Insektenfresser → Greifvogel.',
      wissen: 'Energie fließt von den Produzenten zu höheren Konsumenten.',
    },
  ],
  multis: [
    {
      question: 'Welche Faktoren prägen den Lebensraum Wald?',
      correct: ['Licht', 'Feuchtigkeit', 'Boden'],
      wrong: ['Nur Mondphasen', 'Nur Verkehrszeichen'],
      explanation: 'Abiotische Faktoren steuern Artenzusammensetzung.',
      wissen: 'Ökosystem: Wechselwirkung Organismen ↔ Umwelt.',
    },
  ],
}

const zellen: BioBank = {
  ...Q.zelle,
  facts: [
    {
      prompt: 'Welches Organell enthält bei Pflanzen und Tieren die Erbinformation?',
      answer: 'Zellkern',
      wrong: ['Zellwand', 'Vakuole allein', 'Nur der Zellsaft'],
      explanation: 'Im Zellkern liegt die DNA (Chromosomen).',
      wissen: 'Zellkern steuert viele Zellvorgänge.',
      gap: 'Die Erbinformation liegt im ___.',
      gapAccepted: ['Zellkern', 'Kern'],
    },
    {
      prompt: 'Was besitzen pflanzliche Zellen typischerweise zusätzlich zu tierischen?',
      answer: 'Zellwand und oft Chloroplasten sowie große Vakuole',
      wrong: ['Nur Mitochondrien und sonst nichts', 'Federn', 'Kiemen'],
      explanation: 'Zellwand (Cellulose), Chloroplasten, Zentralvakuole sind Pflanzenmerkmale.',
      wissen: 'Vergleich tierische/pflanzliche Zelle — Klassiker (auch Schlaukopf „Mikroskop und Zellen“).',
      gap: 'Photosynthese findet in den ___ statt.',
      gapAccepted: ['Chloroplasten', 'Chloroplast'],
    },
    {
      prompt: 'Wozu dient das Mikroskop im Biologieunterricht vor allem?',
      answer: 'Kleine Strukturen (Zellen) sichtbar machen',
      wrong: ['Nur den pH-Wert messen', 'Nur die Luftfeuchtigkeit', 'Nur DNA sequenzieren'],
      explanation: 'Präparate werden vergrößert betrachtet.',
      wissen: 'Umgang mit Mikroskop: Vergrößerung, Schärfe, Präparat.',
    },
    {
      prompt: 'Welche Struktur begrenzt tierische Zellen nach außen?',
      answer: 'Zellmembran',
      wrong: ['Dicke Holz-Zellwand aus Cellulose', 'Federkleid', 'Chitinpanzer außen immer'],
      explanation: 'Tiere: Zellmembran; Pflanzen zusätzlich Zellwand.',
      wissen: 'Membran steuert Stoffaustausch.',
    },
  ],
  pairs: [
    { term: 'Chloroplast', meaning: 'Ort der Fotosynthese', wissen: 'Enthält Chlorophyll.' },
    { term: 'Mitochondrium', meaning: 'Zellatmung / Energieübertragung', wissen: '„Kraftwerk“ der Zelle.' },
    { term: 'Vakuole', meaning: 'Speicher und Innendruck (Turgor)', wissen: 'Besonders groß in Pflanzenzellen.' },
    { term: 'Zellwand', meaning: 'Feste Hülle aus Cellulose (Pflanzen)', wissen: 'Gibt Form und Schutz.' },
  ],
  trueFalse: [
    {
      statement: 'Tierische Zellen besitzen immer eine Cellulose-Zellwand.',
      correct: false,
      explanation: 'Zellwände aus Cellulose sind typisch für Pflanzenzellen.',
      wissen: 'Vergleich Pflanzen-/Tierzelle.',
    },
    {
      statement: 'Beide Zelltypen können Mitochondrien besitzen.',
      correct: true,
      explanation: 'Energieumwandlung in Mitochondrien ist weit verbreitet.',
      wissen: 'Gemeinsamkeiten betonen.',
    },
  ],
  multis: [
    {
      question: 'Was gehört typischerweise zur Pflanzenzelle?',
      correct: ['Zellwand', 'Chloroplasten'],
      wrong: ['Nur Federn', 'Nur Kiemen'],
      explanation: 'Zellwand und Chloroplasten sind Pflanzenmerkmale.',
      wissen: 'Mikroskopierkenntnisse sichern.',
    },
  ],
}

const weichtiere: BioBank = {
  quelle: 'Wikipedia: Weichtiere',
  url: 'https://de.wikipedia.org/wiki/Weichtiere',
  facts: [
    {
      prompt: 'Welche Gruppe sind Schnecken und Muscheln?',
      answer: 'Weichtiere',
      wrong: ['Insekten', 'Säugetiere', 'Knochenfische'],
      explanation: 'Weichtiere: u. a. Schnecken, Muscheln, Tintenfische.',
      wissen: 'Wahlbereich: Weichtiere.',
    },
  ],
  pairs: [
    { term: 'Schnecke', meaning: 'Kriechfuß, oft Gehäuse', wissen: 'Land- und Wasserschnecken.' },
    { term: 'Muschel', meaning: 'Zwei Schalen, filtriert oft Wasser', wissen: 'Viele Muscheln sind Filtrierer.' },
  ],
  trueFalse: [
    {
      statement: 'Schnecken besitzen eine Wirbelsäule.',
      correct: false,
      explanation: 'Weichtiere sind wirbellos.',
      wissen: 'Abgrenzung zu Wirbeltieren.',
    },
  ],
}

const heilen: BioBank = {
  quelle: 'Wikipedia: Heilpflanze',
  url: 'https://de.wikipedia.org/wiki/Heilpflanze',
  facts: [
    {
      prompt: 'Warum gelten manche Pflanzen als Heilpflanzen?',
      answer: 'Sie enthalten Wirkstoffe, die medizinisch genutzt werden',
      wrong: ['Sie haben immer Giftzähne', 'Sie sind immer ungenießbar', 'Sie erzeugen Strom'],
      explanation: 'Wirkstoffe können heilen — Dosierung und Fachkenntnis sind nötig.',
      wissen: 'Wahl: Pflanzen helfen heilen — verantwortungsvoller Umgang.',
    },
  ],
  trueFalse: [
    {
      statement: 'Jede Wildpflanze darf bedenkenlos in großer Menge eingenommen werden.',
      correct: false,
      explanation: 'Viele Pflanzen sind giftig oder nur in richtiger Dosis wirksam.',
      wissen: 'Sicherheit und Fachberatung.',
    },
  ],
  pairs: [
    { term: 'Wirkstoff', meaning: 'Chemische Verbindung mit biologischer Wirkung', wissen: 'Basis vieler Arzneimittel aus Pflanzen.' },
    { term: 'Teeaufguss', meaning: 'Auszug wasserlöslicher Stoffe mit heißem Wasser', wissen: 'Klassische Zubereitung.' },
  ],
}

const pfuetze: BioBank = {
  quelle: 'Wikipedia: Kleinstlebewesen',
  url: 'https://de.wikipedia.org/wiki/Mikroorganismus',
  facts: [
    {
      prompt: 'Warum lohnt der Blick ins Mikroskop bei einer Pfütze?',
      answer: 'Dort leben viele Kleinstlebewesen',
      wrong: ['Dort gibt es nur Steine', 'Wasser ist immer steril', 'Nur Säugetiere schwimmen dort'],
      explanation: 'Einzeller und Kleinkrebse u. a. besiedeln Kleingewässer.',
      wissen: 'Wahl: Leben in der Pfütze — Lebensraum im Kleinen.',
    },
  ],
  trueFalse: [
    {
      statement: 'In jeder Pfütze leben ausschließlich Fische.',
      correct: false,
      explanation: 'Oft Mikroorganismen und Kleinstkrebse — selten Fische.',
      wissen: 'Maßstab des Lebensraums beachten.',
    },
  ],
}

export const BIOLOGIE_K6_GENERATORS: Record<string, Topic['generate']> = {
  'bi-k6-lb1-samenpflanzen': bankGenerate(samenpflanzen),
  'bi-k6-lb2-wirbellose': bankGenerate(wirbelloseOverview),
  'bi-k6-lb2-insekten': bankGenerate(insekten),
  'bi-k6-lb2-spinnen': bankGenerate(spinnen),
  'bi-k6-lb3-systematik': bankGenerate(systematikK6),
  'bi-k6-lb4-wald': bankGenerate(wald),
  'bi-k6-lb5-zellen': bankGenerate(zellen),
  'bi-k6-lbw-weichtiere': bankGenerate(weichtiere),
  'bi-k6-lbw-heilen': bankGenerate(heilen),
  'bi-k6-lbw-pfuetze': bankGenerate(pfuetze),
}
