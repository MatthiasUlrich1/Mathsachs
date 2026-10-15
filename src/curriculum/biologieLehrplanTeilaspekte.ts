/**
 * Weitere Lehrplan-522-Teilaspekte als eigene Topics (Themen-Vollständigkeit).
 * released:false über Pack-Default.
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

const fw = (s: string) => s

/** K5 LB6 — Lungen / Alveolen / Gasaustausch (Säugetiere, Landleben). */
const k5SaeugerLunge: BioBank = {
  quelle: 'Wikipedia: Lunge',
  url: 'https://de.wikipedia.org/wiki/Lunge',
  conceptPrefix: 'bio:k5:saeuger:lunge',
  facts: [
    {
      concept: 'bio:k5:saeuger:lunge:land',
      prompt: 'Warum brauchen Säugetiere an Land Lungen?',
      answer: 'Zum Gasaustausch mit der Luft (Sauerstoff aufnehmen, CO₂ abgeben)',
      wrong: [
        'Nur zum Verdauen von Zellulose im Magen',
        'Nur zum Filtern von Harn',
        'Nur zum Bilden von Antikörpern',
      ],
      explanation: 'Landleben → Luftatmung.',
      wissen: fw(
        'Säugetiere leben an Land oder atmen Luft: Lungen nehmen Sauerstoff aus der Atemluft auf und geben Kohlenstoffdioxid ab — angepasst an das Landleben.',
      ),
    },
    {
      concept: 'bio:k5:saeuger:lunge:alveolen',
      prompt: 'Was sind Lungenbläschen?',
      answer: 'Viele kleine Aussackungen in der Lunge, an denen Gase ausgetauscht werden',
      wrong: [
        'Zähne im Gebiss',
        'Schuppen der Kriechtiere',
        'Flossenstrahlen der Fische',
      ],
      explanation: 'Ort des Gasaustauschs.',
      wissen: fw(
        'Lungenbläschen (Alveolen) sind winzige Luftsäckchen. An ihrer dünnen Wand tritt Sauerstoff ins Blut und CO₂ hinaus.',
      ),
      gap: 'Der Gasaustausch findet in den ___ statt.',
      gapAccepted: ['Lungenbläschen', 'Alveolen'],
    },
    {
      concept: 'bio:k5:saeuger:lunge:flaeche',
      prompt: 'Warum helfen viele kleine Lungenbläschen besser als ein großer Hohlraum?',
      answer: 'Sie vergrößern die Oberfläche für den Gasaustausch',
      wrong: [
        'Sie verkleinern die Oberfläche absichtlich',
        'Sie ersetzen das Herz',
        'Sie verdauen Fette',
      ],
      explanation: 'Oberflächenvergrößerung.',
      wissen: fw(
        'Viele kleine Bläschen ergeben zusammen eine riesige Fläche. Je größer die Oberfläche, desto mehr Sauerstoff kann pro Zeit aufgenommen werden.',
      ),
      gap: 'Viele Lungenbläschen bewirken eine ___.',
      gapAccepted: ['Oberflächenvergrößerung', 'größere Oberfläche'],
    },
    {
      concept: 'bio:k5:saeuger:lunge:gas',
      prompt: 'Was bedeutet Gasaustausch in der Säugetierlunge?',
      answer: 'O₂ geht ins Blut, CO₂ geht in die Atemluft',
      wrong: [
        'Nur Wasser wird aufgenommen',
        'Nur Harnstoff wird abgeatmet',
        'Nur Magensäure wird gebildet',
      ],
      explanation: 'Zwei Gase, zwei Richtungen.',
      wissen: fw(
        'Beim Gasaustausch diffundiert Sauerstoff aus der Luft ins Blut und Kohlenstoffdioxid aus dem Blut in die Luft, die ausgeatmet wird.',
      ),
    },
    {
      concept: 'bio:k5:saeuger:lunge:blut',
      prompt: 'Wie kommt der aufgenommene Sauerstoff zu den Körperzellen?',
      answer: 'Über das Blut (mit den roten Blutkörperchen)',
      wrong: [
        'Nur über die Haare',
        'Nur über den Speichel',
        'Nur über die Fußsohlen',
      ],
      explanation: 'Blutkreislauf transportiert.',
      wissen: fw(
        'Nach dem Gasaustausch in der Lunge transportiert das Blut den Sauerstoff zu den Organen und Muskeln.',
      ),
    },
    {
      concept: 'bio:k5:saeuger:lunge:vs-kiemen',
      prompt: 'Worin unterscheiden sich Säugetierlungen von Fischkiemen?',
      answer: 'Lungen tauschen Gase mit Luft; Kiemen mit Wasser',
      wrong: [
        'Beide verdauen nur Pflanzen',
        'Beide sind nur Hautfalten ohne Blut',
        'Beide erzeugen nur Federn',
      ],
      explanation: 'Lebensraum entscheidet das Atmungsorgan.',
      wissen: fw(
        'Fische nutzen Kiemen im Wasser. Säugetiere atmen mit Lungen Luft — eine Angepasstheit an das Landleben (bzw. Luftatmung).',
      ),
    },
    {
      concept: 'bio:k5:saeuger:lunge:duenn',
      prompt: 'Warum müssen die Wände der Lungenbläschen dünn sein?',
      answer: 'Damit Gase schnell zwischen Luft und Blut übertreten können',
      wrong: [
        'Damit Knochen darin wachsen',
        'Damit Harn dort gespeichert wird',
        'Damit Federn entstehen',
      ],
      explanation: 'Kurze Diffusionsstrecke.',
      wissen: fw(
        'Je dünner die Wand zwischen Luft und Blut, desto leichter und schneller gelangen Sauerstoff und CO₂ hindurch.',
      ),
    },
    {
      concept: 'bio:k5:saeuger:lunge:gleichwarm',
      prompt: 'Warum brauchen gleichwarme Säugetiere oft eine leistungsfähige Atmung?',
      answer: 'Hoher Energieumsatz erfordert viel Sauerstoff',
      wrong: [
        'Weil sie keine Lungen brauchen',
        'Weil sie nur Kiemen haben',
        'Weil sie keine Zellen haben',
      ],
      explanation: 'Stoffwechsel und Atmung hängen zusammen.',
      wissen: fw(
        'Gleichwarme Tiere halten ihre Temperatur und haben oft einen hohen Energiebedarf — dafür brauchen sie ausreichend Sauerstoff über die Lunge.',
      ),
    },
    {
      concept: 'bio:k5:saeuger:lunge:schutz',
      prompt: 'Was schützt die Lungen der Säugetiere im Körper?',
      answer: 'Der Brustkorb aus Rippen',
      wrong: [
        'Nur die Flossen',
        'Nur der Schnabel',
        'Nur die Schuppenhaut allein',
      ],
      explanation: 'Knöcherner Schutz.',
      wissen: fw(
        'Rippen und Brustbein bilden den Brustkorb und schützen Herz und Lunge.',
      ),
    },
    {
      concept: 'bio:k5:saeuger:lunge:mensch',
      prompt: 'Warum ist die Säugetierlunge auch für den Menschen relevant?',
      answer: 'Der Mensch ist ein Säugetier und atmet ebenfalls mit Lungen',
      wrong: [
        'Menschen haben nur Kiemen',
        'Menschen atmen nur durch die Haut wie Regenwürmer',
        'Menschen brauchen keinen Sauerstoff',
      ],
      explanation: 'Vergleich Säugetier–Mensch.',
      wissen: fw(
        'Beim Menschen funktionieren Lungenbläschen und Gasaustausch nach demselben Prinzip wie bei anderen Säugetieren — Grundlage späterer Humanbiologie.',
      ),
    },
  ],
  pairs: [
    { concept: 'bio:k5:saeuger:lunge:p:lunge', term: 'Lunge', meaning: 'Atmungsorgan der Säugetiere', wissen: 'Gasaustausch mit Luft.' },
    { concept: 'bio:k5:saeuger:lunge:p:alveole', term: 'Lungenbläschen', meaning: 'Ort des Gasaustauschs', wissen: 'Viele kleine Aussackungen.' },
    { concept: 'bio:k5:saeuger:lunge:p:flaeche', term: 'Oberflächenvergrößerung', meaning: 'Mehr Fläche durch viele kleine Bläschen', wissen: 'Mehr Gasaustausch.' },
    { concept: 'bio:k5:saeuger:lunge:p:gas', term: 'Gasaustausch', meaning: 'O₂ rein, CO₂ raus', wissen: 'Zwischen Luft und Blut.' },
    { concept: 'bio:k5:saeuger:lunge:p:o2', term: 'Sauerstoff', meaning: 'Atemgas für den Stoffwechsel', wissen: 'Wird ins Blut aufgenommen.' },
    { concept: 'bio:k5:saeuger:lunge:p:co2', term: 'Kohlenstoffdioxid', meaning: 'Abgas der Zellen', wissen: 'Wird abgeatmet.' },
    { concept: 'bio:k5:saeuger:lunge:p:brust', term: 'Brustkorb', meaning: 'Schützt Herz und Lunge', wissen: 'Rippen und Brustbein.' },
    { concept: 'bio:k5:saeuger:lunge:p:land', term: 'Landleben', meaning: 'Leben an Land mit Luftatmung', wissen: 'Lungen statt Kiemen.' },
    { concept: 'bio:k5:saeuger:lunge:p:blut', term: 'Bluttransport', meaning: 'Bringt O₂ zu den Zellen', wissen: 'Nach dem Gasaustausch.' },
    { concept: 'bio:k5:saeuger:lunge:p:wand', term: 'Dünne Alveolarwand', meaning: 'Ermöglicht schnellen Gasübertritt', wissen: 'Kurze Strecke.' },
  ],
  trueFalse: [
    {
      concept: 'bio:k5:saeuger:lunge:tf-kiemen',
      statement: 'Säugetiere atmen typischerweise mit Kiemen wie Fische.',
      correct: false,
      explanation: 'Säugetiere haben Lungen für Luftatmung.',
      wissen: fw(
        'Kiemen gehören zu Wassertieren wie Fischen. Säugetiere nutzen Lungen — Angepasstheit an Luft bzw. Landleben.',
      ),
    },
  ],
  multis: [
    {
      concept: 'bio:k5:saeuger:lunge:multi',
      question: 'Was gehört zur Atmung der Säugetiere?',
      correct: ['Lungen', 'Lungenbläschen', 'Gasaustausch mit Luft'],
      wrong: ['Nur Kiemen wie beim Fisch', 'Nur Fotosynthese im Blatt'],
      explanation: 'Luftatmung mit Alveolen.',
      wissen: fw(
        'Säugetiere atmen mit Lungen. Lungenbläschen vergrößern die Oberfläche für den Gasaustausch mit der Luft.',
      ),
    },
  ],
}

/** K7 LB3 — Ernährungsformen und Essstörungen (Sich positionieren). */
const k7Ernaehrungsformen: BioBank = {
  quelle: 'Wikipedia: Ernährung',
  url: 'https://de.wikipedia.org/wiki/Ern%C3%A4hrung',
  conceptPrefix: 'bio:k7:ernform',
  facts: [
    {
      concept: 'bio:k7:ernform:heterotroph',
      prompt: 'Was bedeutet heterotrophe Ernährungsweise beim Menschen?',
      answer: 'Nahrung aus organischen Stoffen anderer Lebewesen (keine Fotosynthese)',
      wrong: [
        'Selbst Zucker aus Licht wie grüne Pflanzen',
        'Nur Atmung ohne Essen',
        'Nur Aufnahme von Mineralien aus Gestein allein',
      ],
      explanation: 'Mensch = heterotroph.',
      wissen: fw(
        'Menschen sind heterotroph: sie müssen organische Nährstoffe mit der Nahrung aufnehmen und betreiben keine Fotosynthese.',
      ),
      gap: 'Der Mensch ernährt sich ___.',
      gapAccepted: ['heterotroph', 'heterotroph'],
    },
    {
      concept: 'bio:k7:ernform:formen',
      prompt: 'Was sind Ernährungsformen?',
      answer: 'Unterschiedliche Muster der Lebensmittelauswahl (z. B. Mischkost, vegetarisch)',
      wrong: [
        'Nur die Anzahl der Zähne',
        'Nur die Atemfrequenz',
        'Nur die Knochenlänge',
      ],
      explanation: 'Vielfalt der Kostformen.',
      wissen: fw(
        'Ernährungsformen beschreiben, welche Lebensmittelgruppen jemand bevorzugt oder meidet — z. B. Mischkost, vegetarisch, vegan — mit unterschiedlichen Vor- und Nachteilen.',
      ),
    },
    {
      concept: 'bio:k7:ernform:mischkost',
      prompt: 'Was kennzeichnet eine ausgewogene Mischkost grob?',
      answer: 'Vielfalt aus pflanzlichen und ggf. tierischen Lebensmitteln in passenden Mengen',
      wrong: [
        'Nur Süßigkeiten den ganzen Tag',
        'Vollständiger Verzicht auf Flüssigkeit',
        'Nur Salz ohne andere Stoffe',
      ],
      explanation: 'Vielfalt und Maß.',
      wissen: fw(
        'Ausgewogene Mischkost liefert Energie, Baustoffe und Schutzstoffe aus verschiedenen Gruppen — Obst, Gemüse, Getreide, Eiweißquellen, Fette in Maßen.',
      ),
    },
    {
      concept: 'bio:k7:ernform:vegetarisch',
      prompt: 'Worauf achten vegetarische Ernährungsformen besonders?',
      answer: 'Auf ausreichende Versorgung mit Eiweiß, Eisen, Vitamin B12 u. a. je nach Variante',
      wrong: [
        'Dass Pflanzen Fotosynthese für den Menschen ersetzen',
        'Dass Atmung überflüssig wird',
        'Dass Knochen ohne Calcium wachsen immer',
      ],
      explanation: 'Planung statt Zufall.',
      wissen: fw(
        'Vegetarische Kost kann gesund sein, braucht aber Planung: Eiweißquellen, Eisen, je nach Form auch Vitamin B12 (besonders vegan).',
      ),
    },
    {
      concept: 'bio:k7:ernform:essstoerung',
      prompt: 'Was sind Essstörungen?',
      answer: 'Schwere Störungen des Essverhaltens mit gesundheitlichen und psychischen Folgen',
      wrong: [
        'Nur einmaliges Auslassen einer Mahlzeit',
        'Nur Vorliebe für ein Gemüse',
        'Nur die normale Hungerregulation',
      ],
      explanation: 'Ernste Erkrankungen, keine „Diät-Mode“.',
      wissen: fw(
        'Essstörungen (z. B. Anorexie, Bulimie, Binge Eating) belasten Körper und Psyche. Fachliche Hilfe ist wichtig — kein Thema zum Selbstexperimentieren.',
      ),
    },
    {
      concept: 'bio:k7:ernform:warn',
      prompt: 'Welches Verhalten kann auf ein gestörtes Essverhalten hinweisen?',
      answer: 'Starkes Vermeiden von Essen, Heißhungerattacken mit Kontrollverlust oder Zwangsgedanken um Gewicht',
      wrong: [
        'Gelegentliches Trinken von Wasser',
        'Abwechslungsreiches Essen mit Freude',
        'Regelmäßige Mahlzeiten ohne Angst',
      ],
      explanation: 'Warnsignale ernst nehmen.',
      wissen: fw(
        'Anhaltende Angst vor Gewicht, extremes Vermeiden, heimliches Essen oder Erbrechen nach Mahlzeiten sind Warnsignale — vertrauensvolle Personen oder Fachstellen einbeziehen.',
      ),
    },
    {
      concept: 'bio:k7:ernform:deskriptiv',
      prompt: 'Was ist eine deskriptive Aussage zur Ernährung?',
      answer: 'Eine beschreibende Feststellung (z. B. „Vollkorn enthält Ballaststoffe“)',
      wrong: [
        'Ein reiner Befehl ohne Inhalt',
        'Nur eine Atemübung',
        'Nur eine Knochenmessung',
      ],
      explanation: 'Beschreiben vs. bewerten.',
      wissen: fw(
        'Deskriptiv heißt beschreibend: Fakten über Nährstoffe oder Lebensmittel. Normativ sagt, was man „sollte“ — beides unterscheiden lernen.',
      ),
    },
    {
      concept: 'bio:k7:ernform:normativ',
      prompt: 'Was ist eine normative Aussage zur Ernährung?',
      answer: 'Eine Soll-Aussage (z. B. „Man sollte mehr Gemüse essen“)',
      wrong: [
        'Nur die chemische Formel von Wasser',
        'Nur die Anzahl der Lungenflügel',
        'Nur der Puls in Ruhe',
      ],
      explanation: 'Wertende Empfehlung.',
      wissen: fw(
        'Normative Aussagen enthalten Wertungen oder Vorschriften. Sie können sinnvoll sein, sind aber keine reinen Messdaten — kritisch prüfen.',
      ),
    },
    {
      concept: 'bio:k7:ernform:medien',
      prompt: 'Worauf solltest du bei Ernährungstipps im Internet achten?',
      answer: 'Seriöse Quellen, keine Heilsversprechen, passende Alters-/Gesundheitslage',
      wrong: [
        'Jedem Werbespruch blind folgen',
        'Nur auf die Farbe der Verpackung',
        'Nie Inhaltsstoffe lesen',
      ],
      explanation: 'Medienkompetenz.',
      wissen: fw(
        'Im Netz mischen sich Fakten, Werbung und Mythen. Seriöse Tipps nennen Belege und Maß — extreme „Wunderdiäten“ sind oft unseriös.',
      ),
    },
    {
      concept: 'bio:k7:ernform:position',
      prompt: 'Was heißt „sich zur Ernährung positionieren“ fachlich?',
      answer: 'Eigene Entscheidungen begründet an Fakten und Gesundheit ausrichten',
      wrong: [
        'Jede Werbung ungeprüft übernehmen',
        'Nur nach Zufall essen ohne Wissen',
        'Atmung durch Essen ersetzen',
      ],
      explanation: 'Begründete Haltung.',
      wissen: fw(
        'Positionieren heißt: Wissen über Nährstoffe und Risiken nutzen, um begründete Essentscheidungen zu treffen — ohne Mythen oder Peer-Druck allein.',
      ),
    },
  ],
  pairs: [
    { concept: 'bio:k7:ernform:p:hetero', term: 'Heterotroph', meaning: 'Ernährung aus organischen Stoffen', wissen: 'Mensch, Tiere, Pilze.' },
    { concept: 'bio:k7:ernform:p:misch', term: 'Mischkost', meaning: 'Vielseitige Lebensmittelauswahl', wissen: 'Pflanzen + ggf. tierische Produkte.' },
    { concept: 'bio:k7:ernform:p:veg', term: 'Vegetarisch', meaning: 'Ohne Fleisch (Varianten unterschiedlich)', wissen: 'Planung der Nährstoffe.' },
    { concept: 'bio:k7:ernform:p:ess', term: 'Essstörung', meaning: 'Schwere Störung des Essverhaltens', wissen: 'Fachhilfe nötig.' },
    { concept: 'bio:k7:ernform:p:desk', term: 'Deskriptiv', meaning: 'Beschreibende Aussage', wissen: 'Fakten ohne Soll.' },
    { concept: 'bio:k7:ernform:p:norm', term: 'Normativ', meaning: 'Soll-/Wertaussage', wissen: 'Empfehlung oder Vorschrift.' },
    { concept: 'bio:k7:ernform:p:ballast', term: 'Ballaststoffe', meaning: 'Fördern die Verdauung', wissen: 'Vollkorn, Obst, Gemüse.' },
    { concept: 'bio:k7:ernform:p:energie', term: 'Energiebilanz', meaning: 'Zufuhr und Verbrauch', wissen: 'Langfristig Gewicht.' },
    { concept: 'bio:k7:ernform:p:vielfalt', term: 'Lebensmittelvielfalt', meaning: 'Viele Gruppen abdecken', wissen: 'Nährstoffversorgung.' },
    { concept: 'bio:k7:ernform:p:hilfe', term: 'Hilfesuchen', meaning: 'Bei Essproblemen Unterstützung holen', wissen: 'Vertrauensperson/Fachstelle.' },
  ],
  trueFalse: [
    {
      concept: 'bio:k7:ernform:tf-ess',
      statement: 'Essstörungen sind nur eine harmlose Modeerscheinung.',
      correct: false,
      explanation: 'Es sind ernsthafte Gesundheitsprobleme.',
      wissen: fw(
        'Essstörungen können Organe, Wachstum und Psyche schwer belasten. Frühzeitige professionelle Hilfe verbessert die Chancen.',
      ),
    },
  ],
  multis: [
    {
      concept: 'bio:k7:ernform:multi',
      question: 'Was gehört zu einer reflektierten Haltung zur Ernährung?',
      correct: [
        'Fakten zu Nährstoffen kennen',
        'Deskriptive und normative Aussagen unterscheiden',
        'Medienkritisch prüfen',
      ],
      wrong: ['Jeder Heilsversprechen blind folgen', 'Essstörungen verharmlosen'],
      explanation: 'Wissen + Kritik + Verantwortung.',
      wissen: fw(
        'Gesunde Ernährung verbindet Nährstoffwissen mit kritischer Medienprüfung und dem Ernstnehmen von Essstörungen.',
      ),
    },
  ],
}

export const BIOLOGIE_LEHRPLAN_TEILASPEKTE_GENERATORS: Record<string, Topic['generate']> = {
  'bi-k5-lb6-saeuger-lunge': bankGenerate(k5SaeugerLunge),
  'bi-k7-lb3-ernaehrungsformen': bankGenerate(k7Ernaehrungsformen),
}
