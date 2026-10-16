/**
 * Lehrplan-Punkt → neue Topics (Themen-Vollständigkeit).
 * Kein thin-fill auf alten IDs — neue Topic-IDs, released:false über Pack-Default.
 * Auto: tmp/gen_lehrplan_gap_banks.py
 */
import { bankGenerate, type BioBank } from './biologieBank'
import { physikBankGenerate } from './physikBank'
import type { Topic } from './types'


const phK10Newton: BioBank = {
  quelle: "Lehrplan Physik Sachsen / Schulportal 523",
  url: "https://www.schulportal.sachsen.de/lplandb/lehrplan/523",
  conceptPrefix: "ph:k10:newton",
  facts: [

{
  concept: "ph:k10:newton:1",
  prompt: "Was besagt das Trägheitsgesetz (1. Newtonsche Gesetz) qualitativ?",
  answer: "Ein Körper behält seine Bewegung bei, wenn keine resultierende Kraft wirkt",
  wrong: [
    "Kraft und Beschleunigung sind immer entgegengesetzt",
    "Masse verschwindet ohne Kraft",
    "Nur im Weltall gibt es Trägheit",
  ],
  explanation: "Ohne resultierende Kraft: Ruhe oder gleichförmige Geradeausbewegung.",
  wissen: "Das 1. Newtonsche Gesetz (Trägheitsgesetz): Wirkt keine resultierende Kraft, bleibt die Geschwindigkeit nach Betrag und Richtung konstant — Ruhe oder gleichförmige Bewegung.",
  gap: "Ohne resultierende Kraft bleibt die ___ konstant.",
  gapAccepted: ["Geschwindigkeit"],
},

{
  concept: "ph:k10:newton:2",
  prompt: "Was besagt das Grundgesetz der Dynamik (2. Newtonsche Gesetz)?",
  answer: "F = m·a (resultierende Kraft = Masse × Beschleunigung)",
  wrong: [
    "F = m/a",
    "F = a/m immer",
    "Kraft ist unabhängig von der Masse",
  ],
  explanation: "Je größer die Kraft bei gegebener Masse, desto größer die Beschleunigung.",
  wissen: "Das 2. Newtonsche Gesetz: Die resultierende Kraft ist das Produkt aus Masse und Beschleunigung (F = m·a). Richtung von F und a stimmen überein.",
  gap: "F = m · ___.",
  gapAccepted: ["a", "Beschleunigung"],
},

{
  concept: "ph:k10:newton:3",
  prompt: "Was besagt das Wechselwirkungsgesetz (3. Newtonsche Gesetz)?",
  answer: "Kräfte treten paarweise auf: actio = reactio",
  wrong: [
    "Es gibt nur eine Kraft ohne Gegenkraft",
    "Gegenkräfte heben die Masse auf",
    "Nur Magnete haben Wechselwirkung",
  ],
  explanation: "Übt A auf B eine Kraft aus, übt B auf A eine gleich große, entgegengesetzte Kraft aus.",
  wissen: "Das 3. Newtonsche Gesetz: Kräfte treten immer paarweise auf. Kraft und Gegenkraft sind gleich groß, entgegengesetzt und greifen an verschiedenen Körpern an.",
  gap: "Actio = ___.",
  gapAccepted: ["Reactio", "Reaktion"],
},

{
  concept: "ph:k10:newton:2",
  prompt: "Was bedeutet Schwerelosigkeit im Raumschiff qualitativ?",
  answer: "Astronaut und Raumschiff fallen gemeinsam (gleiche Beschleunigung)",
  wrong: [
    "Es gibt im Orbit keine Gravitation der Erde",
    "Masse wird null",
    "Nur der Helm schwebt",
  ],
  explanation: "Im freien Fall wirkt keine Normal-/Bodenkraft — Gefühl der Schwerelosigkeit.",
  wissen: "Im Orbit fallen Raumschiff und Astronaut gemeinsam um die Erde. Relative zur Kabine wirkt keine Bodenkraft — daher Schwerelosigkeit, obwohl die Erdanziehung wirkt.",
  gap: "Schwerelosigkeit: gemeinsamer ___.",
  gapAccepted: ["freier Fall", "Fall"],
},

{
  concept: "ph:k10:newton:fma",
  prompt: "Welche Einheit hat die Kraft im SI-System?",
  answer: "Newton (N), wobei 1 N = 1 kg·m/s²",
  wrong: [
    "Nur Joule",
    "Nur Watt",
    "Nur Pascal",
  ],
  explanation: "Aus F = m·a folgt die Einheit kg·m/s² = N.",
  wissen: "Die SI-Einheit der Kraft ist das Newton: 1 N = 1 kg·m/s². Benannt nach Isaac Newton.",
  gap: "1 N = 1 kg·m/s² heißt ___.",
  gapAccepted: ["Newton", "N"],
},

{
  concept: "ph:k10:newton:brems",
  prompt: "Was verlängert den Bremsweg im Straßenverkehr typischerweise?",
  answer: "Höhere Geschwindigkeit und geringere Reibung (z. B. nass)",
  wrong: [
    "Nur eine hellere Wagenfarbe",
    "Nur ein voller Tank ohne Einfluss",
    "Immer nur die Sitzheizung",
  ],
  explanation: "Bremsweg wächst stark mit der Geschwindigkeit; Reibung beeinflusst die Verzögerung.",
  wissen: "Der Bremsweg hängt von Anfangsgeschwindigkeit und Bremsverzögerung ab. Nasse Fahrbahn verringert die Reibung — der Bremsweg wird länger. Reaktionsweg kommt hinzu.",
  gap: "Nasse Fahrbahn verringert die ___ und verlängert den Bremsweg.",
  gapAccepted: ["Reibung"],
},

{
  concept: "ph:k10:newton:gurt",
  prompt: "Wozu dienen Sicherheitsgurt und Knautschzone physikalisch?",
  answer: "Sie verlängern die Verzögerungszeit und verringern die Kraft auf den Körper",
  wrong: [
    "Sie erhöhen die Aufprallgeschwindigkeit",
    "Sie machen Masse null",
    "Sie erzeugen mehr Kraft bei gleichem Δv",
  ],
  explanation: "Gleiche Impulsänderung über längere Zeit → kleinere mittlere Kraft.",
  wissen: "Gurt und Knautschzone vergrößern die Zeit bzw. den Weg der Verzögerung. Bei gleicher Geschwindigkeitsänderung sinkt die mittlere Kraft auf Insassen (Impuls-/Kraftdenken).",
  gap: "Längere Verzögerungszeit bedeutet kleinere mittlere ___.",
  gapAccepted: ["Kraft"],
},

{
  concept: "ph:k10:newton:super",
  prompt: "Was bedeutet Superposition von Kräften?",
  answer: "Mehrere Kräfte an einem Punkt werden zu einer Resultierenden zusammengesetzt",
  wrong: [
    "Kräfte heben Masse immer auf",
    "Nur eine Kraft darf wirken",
    "Kräfte addieren sich nie",
  ],
  explanation: "Vektorielle Addition ergibt die resultierende Kraft.",
  wissen: "Kräfte sind Vektoren. Mehrere Kräfte an einem Körper werden zur Resultierenden zusammengesetzt (Superposition). Die Resultierende bestimmt die Beschleunigung.",
  gap: "Die vektorielle Summe der Kräfte heißt ___.",
  gapAccepted: ["Resultierende", "resultierende Kraft"],
},

{
  concept: "ph:k10:newton:ebene",
  prompt: "An einer geneigten Ebene: Welche Kraftkomponente beschleunigt den Körper hangabwärts?",
  answer: "Die Hangabtriebskraft (Komponente der Gewichtskraft parallel zur Ebene)",
  wrong: [
    "Nur die Normalkraft bergauf",
    "Nur die Luftfeuchtigkeit",
    "Nur die Farbe der Ebene",
  ],
  explanation: "Gewichtskraft zerlegt in parallel und senkrecht zur Ebene.",
  wissen: "An der schiefen Ebene zerlegt man die Gewichtskraft: parallel zur Ebene wirkt die Hangabtriebskraft, senkrecht die Normalkraftkomponente. Reibung wirkt der Bewegung entgegen.",
  gap: "Parallel zur Ebene wirkt die ___.",
  gapAccepted: ["Hangabtriebskraft", "Hangabtrieb"],
},

{
  concept: "ph:k10:newton:atwood",
  prompt: "Wozu dient eine Fallmaschine (z. B. nach Atwood) im Unterricht?",
  answer: "Zum Ermitteln von Beschleunigungen bei bekannter Kraft/Masse",
  wrong: [
    "Zum Messen nur der Lichtgeschwindigkeit",
    "Zum Erzeugen von Magnetfeldern allein",
    "Zum Wiegen von Sternen",
  ],
  explanation: "Zwei Massen über Rolle: Beschleunigung messbar.",
  wissen: "Bei der Atwood-Maschine hängen zwei Massen über eine Rolle. Aus den Massen und der gemessenen Beschleunigung lässt sich der Zusammenhang F = m·a experimentell untersuchen.",
  gap: "Atwood-Maschine: Experiment zu Kraft und ___.",
  gapAccepted: ["Beschleunigung"],
},

{
  concept: "ph:k10:newton:reakt",
  prompt: "Was ist der Reaktionsweg grob?",
  answer: "Weg, den das Fahrzeug während der Reaktionszeit zurücklegt",
  wrong: [
    "Nur der Weg nach dem Stillstand",
    "Nur die Tankfüllung",
    "Nur der Bremsbelagverschleiß ohne Zeit",
  ],
  explanation: "Während man noch nicht bremst, rollt das Auto weiter.",
  wissen: "Reaktionsweg = Geschwindigkeit × Reaktionszeit. Erst danach beginnt der eigentliche Bremsweg. Gesamter Anhalteweg = Reaktionsweg + Bremsweg.",
  gap: "Anhalteweg = Reaktionsweg + ___.",
  gapAccepted: ["Bremsweg"],
},

{
  concept: "ph:k10:newton:helm",
  prompt: "Warum schützt ein Sturzhelm den Kopf?",
  answer: "Er verlängert die Stoßdauer und verteilt die Kraft",
  wrong: [
    "Er erhöht die Aufprallgeschwindigkeit",
    "Er macht den Kopf masselos",
    "Er erzeugt mehr Energie",
  ],
  explanation: "Polsterung → kleinere mittlere Kraft bei Impulsänderung.",
  wissen: "Der Helm vergrößert die Zeit und Fläche des Impulsübertrags. Die mittlere Kraft auf den Schädel sinkt — Risiko schwerer Verletzungen nimmt ab.",
  gap: "Ein Helm verlängert die ___ des Stoßes.",
  gapAccepted: ["Dauer", "Stoßdauer", "Zeit"],
},
  ],
  pairs: [
    { concept: "ph:k10:newton:p:traegheit", term: "Trägheit", meaning: "Beharrungsvermögen der Masse", wissen: "Ohne Kraft keine Geschwindigkeitsänderung." },
    { concept: "ph:k10:newton:p:masse", term: "Masse", meaning: "Trägheits- und Schweremaß", wissen: "In F = m·a und G = m·g." },
    { concept: "ph:k10:newton:p:newton", term: "Newton", meaning: "SI-Einheit der Kraft", wissen: "1 N = 1 kg·m/s²." },
    { concept: "ph:k10:newton:p:resultierende", term: "Resultierende", meaning: "Vektorielle Summe der Kräfte", wissen: "Bestimmt a." },
    { concept: "ph:k10:newton:p:reib", term: "Reibung", meaning: "Kraft entgegen der Relativbewegung", wissen: "Beeinflusst Bremsen." },
    { concept: "ph:k10:newton:p:bremsweg", term: "Bremsweg", meaning: "Weg während der Bremsverzögerung", wissen: "Wächst stark mit v." },
    { concept: "ph:k10:newton:p:reakt", term: "Reaktionszeit", meaning: "Zeit bis Bremsbeginn", wissen: "Fahrschule/Faustregeln." },
    { concept: "ph:k10:newton:p:gurt", term: "Sicherheitsgurt", meaning: "Hält Körper zurück, verlängert Verzögerung", wissen: "Kleinere Kraft." },
    { concept: "ph:k10:newton:p:knautsch", term: "Knautschzone", meaning: "Verformungsbereich am Fahrzeug", wissen: "Energieabbau über Weg/Zeit." },
    { concept: "ph:k10:newton:p:hang", term: "Hangabtriebskraft", meaning: "Gewichtskomponente parallel zur Ebene", wissen: "Schiefe Ebene." },
  ],
}


const bioK7Viren: BioBank = {
  quelle: "Lehrplan Biologie Sachsen / Schulportal 522",
  url: "https://www.schulportal.sachsen.de/lplandb/lehrplan/522",
  conceptPrefix: "bio:k7:viren",
  facts: [

{
  concept: "bio:k7:viren:1",
  prompt: "Was sind Viren im Unterschied zu Bakterien?",
  answer: "Sie haben keinen eigenen Stoffwechsel und brauchen Wirtszellen zur Vermehrung",
  wrong: [
    "Sie sind immer Vielzeller mit Organen",
    "Sie betreiben Fotosynthese mit Chloroplasten",
    "Sie haben immer eine Zellwand aus Cellulose",
  ],
  explanation: "Viren sind keine Zellen; Vermehrung nur in Wirtszellen.",
  wissen: "Viren bestehen typischerweise aus Erbgut und Proteinhülle. Sie besitzen keinen eigenen Stoffwechsel und vermehren sich nur in Wirtszellen — im Unterschied zu Bakterien.",
  gap: "Viren brauchen zur Vermehrung eine ___.",
  gapAccepted: ["Wirtszelle", "Zelle"],
},

{
  concept: "bio:k7:viren:2",
  prompt: "Woraus besteht ein Virus typischerweise?",
  answer: "Erbgut (DNA oder RNA) und eine Proteinhülle (Kapsid)",
  wrong: [
    "Nur aus Chloroplasten",
    "Nur aus Knochengewebe",
    "Nur aus Holzringen",
  ],
  explanation: "Kapsid umschließt das genetische Material.",
  wissen: "Ein Virion hat Erbgut (DNA oder RNA) und ein Kapsid aus Proteinen; manche haben zusätzlich eine Hülle aus Wirtsmembran.",
  gap: "Die Proteinhülle vieler Viren heißt ___.",
  gapAccepted: ["Kapsid"],
},

{
  concept: "bio:k7:viren:3",
  prompt: "Warum helfen Antibiotika nicht gegen Viren?",
  answer: "Antibiotika wirken gegen Bakterien, nicht gegen virale Vermehrung",
  wrong: [
    "Weil Viren immer größer als Bakterien sind",
    "Weil Antibiotika nur Pflanzen heilen",
    "Weil Viren aus Eisen bestehen",
  ],
  explanation: "Falsche Erwartung: Antibiotika ≠ Virostatika.",
  wissen: "Antibiotika treffen bakterielle Strukturen/Stoffwechsel. Viren nutzen Wirtsmaschinerie — dagegen braucht man Impfung, Hygiene oder spezielle Virostatika.",
  gap: "Antibiotika wirken typischerweise gegen ___, nicht gegen Viren.",
  gapAccepted: ["Bakterien"],
},

{
  concept: "bio:k7:viren:4",
  prompt: "Welche Bedeutung haben Impfungen gegenüber Viren?",
  answer: "Sie bereiten das Immunsystem auf Erreger vor",
  wrong: [
    "Sie ersetzen sofort jede Zellenlehre",
    "Sie bilden Jahresringe",
    "Sie erzeugen Fotosynthese",
  ],
  explanation: "Immunisierung ohne schwere Erkrankung.",
  wissen: "Impfungen präsentieren Antigene oder abgeschwächte Erreger. Das Immunsystem bildet Gedächtnis — bei späterem Kontakt schneller Schutz.",
  gap: "Impfung trainiert das ___.",
  gapAccepted: ["Immunsystem"],
},

{
  concept: "bio:k7:viren:5",
  prompt: "Wie gelangen Viren oft in den Körper?",
  answer: "Über Tröpfchen, Kontakt oder verunreinigte Oberflächen (je nach Virus)",
  wrong: [
    "Nur durch Fotosynthese",
    "Nur durch Jahresringe",
    "Nur durch reine Gedanken",
  ],
  explanation: "Übertragungswege je nach Erreger unterschiedlich.",
  wissen: "Viele Viren nutzen Tröpfchen- oder Kontaktinfektion. Hygiene, Abstand und Impfung verringern die Übertragung.",
  gap: "Hände waschen mindert die ___ vieler Erreger.",
  gapAccepted: ["Übertragung", "Ausbreitung"],
},

{
  concept: "bio:k7:viren:6",
  prompt: "Was bedeutet „Wirt“ bei Viren?",
  answer: "Der Organismus, in dessen Zellen sich das Virus vermehrt",
  wrong: [
    "Nur der Arzt",
    "Nur der Impfstoffhersteller",
    "Nur der Bodenpilz immer",
  ],
  explanation: "Wirt liefert Zellmaschinerie.",
  wissen: "Der Wirt ist der Organismus, dessen Zellen das Virus für die Vermehrung nutzt. Wirtswechsel und Spezifität erklären Krankheitsbilder.",
  gap: "Viren vermehren sich in der Zelle ihres ___.",
  gapAccepted: ["Wirts", "Wirtsorganismus"],
},

{
  concept: "bio:k7:viren:7",
  prompt: "Können Viren außerhalb von Zellen lange aktiv bleiben?",
  answer: "Oft nur begrenzt; sie sind auf Wirtszellen angewiesen",
  wrong: [
    "Immer unbegrenzt wie Steine",
    "Nie außerhalb von Zellen eine Sekunde",
    "Nur im Vakuum des Weltalls",
  ],
  explanation: "Umweltstabilität variiert stark.",
  wissen: "Viren sind keine selbstständigen Lebewesen mit Stoffwechsel. Außerhalb von Zellen sind sie unterschiedlich stabil — Desinfektion und Hygiene nutzen das.",
  gap: "Ohne Wirtszelle ist die Vermehrung von Viren ___.",
  gapAccepted: ["unmöglich", "nicht möglich"],
},

{
  concept: "bio:k7:viren:8",
  prompt: "Was ist ein typisches Ziel der Virusvermehrung in der Zelle?",
  answer: "Herstellung neuer Viren mit Wirtsressourcen",
  wrong: [
    "Aufbau von Blattgrün",
    "Bildung von Jahresringen",
    "Erzeugung von Kiemen",
  ],
  explanation: "Hijacking der Wirtszelle.",
  wissen: "Viren schleusen Erbgut ein und lassen die Zelle Virusbestandteile produzieren. Neue Viren werden freigesetzt und können weitere Zellen befallen.",
  gap: "Die Wirtszelle produziert neue ___.",
  gapAccepted: ["Viren", "Virionen"],
},

{
  concept: "bio:k7:viren:9",
  prompt: "Welche Aussage zu Bakterien und Viren ist richtig?",
  answer: "Bakterien sind Zellen; Viren sind keine vollständigen Zellen",
  wrong: [
    "Beide sind immer Vielzeller",
    "Beide betreiben immer Fotosynthese",
    "Beide haben immer Zellkerne wie Tiere",
  ],
  explanation: "Grundunterscheidung der Mikroben.",
  wissen: "Bakterien sind prokaryotische Zellen mit eigenem Stoffwechsel. Viren sind keine Zellen und brauchen Wirte — das ist ein Kernunterschied im Lehrplan Bakterien und Viren.",
  gap: "Bakterien sind ___; Viren nicht.",
  gapAccepted: ["Zellen"],
},

{
  concept: "bio:k7:viren:10",
  prompt: "Nenne eine Maßnahme zum Schutz vor Virusinfektionen.",
  answer: "Hygiene, Impfung und Vermeiden enger Kontakte bei Erkrankung",
  wrong: [
    "Nur mehr Zucker essen",
    "Nur Impfungen gegen Bakterien allein",
    "Nur Pflanzen gießen",
  ],
  explanation: "Prävention auf mehreren Ebenen.",
  wissen: "Schutz: Händehygiene, Impfung wo verfügbar, Abstand/Lüften bei Tröpfcheninfektionen, nicht mit kranken Menschen teilen.",
  gap: "Eine wichtige Schutzmaßnahme ist die ___.",
  gapAccepted: ["Hygiene", "Impfung"],
},
  ],
  pairs: [
    { concept: "bio:k7:viren:p:kapsid", term: "Kapsid", meaning: "Proteinhülle des Virus", wissen: "Schützt das Erbgut." },
    { concept: "bio:k7:viren:p:wirt", term: "Wirt", meaning: "Organismus mit Wirtszellen", wissen: "Vermehrung nur dort." },
    { concept: "bio:k7:viren:p:impfung", term: "Impfung", meaning: "Vorbereitung des Immunsystems", wissen: "Gedächtniszellen." },
    { concept: "bio:k7:viren:p:antibiotikum", term: "Antibiotikum", meaning: "Wirkt gegen Bakterien", wissen: "Nicht gegen Viren." },
    { concept: "bio:k7:viren:p:rna", term: "RNA-Virus", meaning: "Erbgut aus RNA", wissen: "z. B. viele Erkältungsviren." },
    { concept: "bio:k7:viren:p:dna", term: "DNA-Virus", meaning: "Erbgut aus DNA", wissen: "z. B. Herpesviren." },
    { concept: "bio:k7:viren:p:tropfen", term: "Tröpfcheninfektion", meaning: "Übertragung über Atemtröpfchen", wissen: "Abstand/Lüften helfen." },
    { concept: "bio:k7:viren:p:immun", term: "Immunantwort", meaning: "Abwehrreaktion des Körpers", wissen: "Antikörper/Gedächtnis." },
    { concept: "bio:k7:viren:p:virostatikum", term: "Virostatikum", meaning: "Arzneimittel gegen Viren", wissen: "Hemmt Vermehrung." },
    { concept: "bio:k7:viren:p:epidemie", term: "Epidemie", meaning: "Gehäuftes Auftreten einer Infektion", wissen: "Öffentliche Gesundheit." },
  ],
}


const bioK5Arbeitsweisen: BioBank = {
  quelle: "Lehrplan Biologie Sachsen / Schulportal 522",
  url: "https://www.schulportal.sachsen.de/lplandb/lehrplan/522",
  conceptPrefix: "bio:k5:arbeitsweisen",
  facts: [
    {
      concept: "bio:k5:arbeitsweisen:beob1",
      prompt: "Was unterscheidet sorgfältiges biologisches Beobachten vom bloßen Hinschauen?",
      answer: "Man erfasst Merkmale gezielt und beschreibt sie möglichst genau",
      wrong: [
        "Man ändert sofort die Natur",
        "Man rät ohne Blick auf das Objekt",
        "Man misst nur Temperaturen ohne Blick",
      ],
      explanation: "Beobachten und Beschreiben sind erste Erkenntnismethoden.",
      wissen:
        "Beim Beobachten richtet man die Aufmerksamkeit bewusst auf Merkmale und Vorgänge. Das Beschreiben hält Wahrnehmungen in Worten oder Skizzen fest, damit andere sie nachvollziehen können.",
      gap: "Genaues Festhalten von Wahrnehmungen heißt ___.",
      gapAccepted: ["Beschreiben", "Beobachten und Beschreiben"],
    },
    {
      concept: "bio:k5:arbeitsweisen:beob2",
      prompt: "Wozu dient eine Lupe beim Beobachten in Klasse 5?",
      answer: "Sie vergrößert Feinheiten, die man mit bloßem Auge kaum sieht",
      wrong: [
        "Sie ersetzt ein Experiment vollständig",
        "Sie misst die Körpertemperatur",
        "Sie erzeugt künstliches Licht wie eine Sonne",
      ],
      explanation: "Optisches Hilfsmittel für genaueres Untersuchen.",
      wissen:
        "Mit der Lupe erkennt man z. B. Schuppen, Feinstrukturen von Federn oder Blütenteile genauer. So wird Beobachten zu einem gezielten Untersuchen.",
    },
    {
      concept: "bio:k5:arbeitsweisen:vergl1",
      prompt: "Warum vergleichen und ordnen Biologen Lebewesen oder Teile davon?",
      answer: "Um Gemeinsamkeiten und Unterschiede zu finden und Gruppen zu bilden",
      wrong: [
        "Um nur Farben auswendig zu lernen",
        "Um Experimente überflüssig zu machen",
        "Um Modelle zu verbieten",
      ],
      explanation: "Vergleichen und Ordnen strukturieren Beobachtungen.",
      wissen:
        "Vergleichen zeigt, was gleich und was verschieden ist. Ordnen bringt Merkmale in übersichtliche Gruppen — Grundlage für Bestimmung und Systematik.",
      gap: "Gemeinsamkeiten und Unterschiede findet man durch ___.",
      gapAccepted: ["Vergleichen"],
    },
    {
      concept: "bio:k5:arbeitsweisen:vergl2",
      prompt: "Du sortierst Blätter nach Form und Rand. Welche Arbeitsweise übst du vor allem?",
      answer: "Vergleichen und Ordnen",
      wrong: ["Nur Nachweisreaktionen ohne Kriterien", "Nur Modellbau ohne Blick", "Nur Auswendiglernen von Jahreszahlen"],
      explanation: "Kriterienbasiertes Sortieren.",
      wissen:
        "Beim Ordnen legst du Kriterien fest (z. B. Form, Rand, Aderung) und sortierst danach. Das schult systematisches Denken.",
    },
    {
      concept: "bio:k5:arbeitsweisen:exp1",
      prompt: "Was kennzeichnet ein Experiment gegenüber dem zufälligen Ausprobieren?",
      answer: "Eine klare Frage, geplante Durchführung und auswertbare Beobachtung",
      wrong: [
        "Beliebiges Tun ohne Frage",
        "Nur Zeichnen ohne Ergebnis",
        "Nur Lesen ohne Handlung",
      ],
      explanation: "Experimentieren als Erkenntnismethode.",
      wissen:
        "Im Experiment prüft man eine Vermutung unter möglichst klaren Bedingungen. Beobachtungen werden notiert und mit der Ausgangsfrage verglichen.",
      gap: "Eine prüfbare Vermutung vor dem Versuch nennt man oft ___.",
      gapAccepted: ["Hypothese", "Vermutung"],
    },
    {
      concept: "bio:k5:arbeitsweisen:exp2",
      prompt: "Warum gehört ein Protokoll zum Experimentieren?",
      answer: "Damit Aufbau, Durchführung und Ergebnis nachvollziehbar bleiben",
      wrong: [
        "Damit man den Versuch geheim hält",
        "Damit man keine Beobachtung braucht",
        "Damit Modelle unnötig werden",
      ],
      explanation: "Dokumentation der Untersuchung.",
      wissen:
        "Ein einfaches Protokoll enthält Frage/Ziel, Material, Durchführung, Beobachtung und kurze Deutung. So können andere den Versuch verstehen und wiederholen.",
    },
    {
      concept: "bio:k5:arbeitsweisen:mod1",
      prompt: "Wozu dienen Modelle in der Biologie?",
      answer: "Sie vereinfachen und veranschaulichen Sachverhalte, die am Original schwer erkennbar sind",
      wrong: [
        "Sie ersetzen jede Beobachtung in der Natur",
        "Sie sind immer exakt wie das Original",
        "Sie dienen nur zur Dekoration",
      ],
      explanation: "Modelle als Erkenntnishilfe.",
      wissen:
        "Modelle (z. B. Flugmodell, Fischmodell) heben Wesentliches hervor und lassen Nebensächliches weg. Man vergleicht Modell und Original und prüft Grenzen.",
      gap: "Ein vereinfachtes Abbild zur Erklärung heißt ___.",
      gapAccepted: ["Modell"],
    },
    {
      concept: "bio:k5:arbeitsweisen:mod2",
      prompt: "Was muss man bei der Arbeit mit Modellen kritisch prüfen?",
      answer: "Welche Merkmale dem Original entsprechen und welche weggelassen oder verändert sind",
      wrong: [
        "Ob das Modell teurer als ein Lehrbuch ist",
        "Ob man nie beobachten darf",
        "Ob Protokolle verboten sind",
      ],
      explanation: "Grenzen von Modellen reflektieren.",
      wissen:
        "Modelle sind nie das Original. Größe, Material oder fehlende Teile können täuschen — deshalb vergleicht man bewusst Modell und Wirklichkeit.",
    },
    {
      concept: "bio:k5:arbeitsweisen:nach1",
      prompt: "Woran erkennst du Stärke mit Lugolscher Lösung (Iod-Kaliumiodid)?",
      answer: "An einer blau-violetten bis schwarz-blauen Färbung",
      wrong: [
        "An einem dauerhaft durchscheinenden Fettfleck",
        "An einer Grünfärbung wie bei Chlorophyll allein",
        "An einem metallischen Glanz ohne Farbumschlag",
      ],
      explanation: "Klassischer Stärkenachweis.",
      wissen:
        "Lugolsche Lösung färbt stärkehaltige Proben blau-violett bis schwarz-blau. Eine Blindprobe mit bekannter Stärke hilft beim Vergleich.",
      gap: "Stärke färbt mit Lugolscher Lösung ___.",
      gapAccepted: ["blau-violett", "schwarz-blau", "blauviolett"],
    },
    {
      concept: "bio:k5:arbeitsweisen:nach2",
      prompt: "Wie weist man Fett mit der Fettfleckprobe nach?",
      answer: "Ein durchscheinender Fleck bleibt auch nach dem Trocknen sichtbar",
      wrong: [
        "Die Probe wird blau-violett wie bei Stärke",
        "Es entsteht sofort ein Eiskristall",
        "Die Probe muss metallisch glänzen",
      ],
      explanation: "Einfache Labortechnik in Klasse 5.",
      wissen:
        "Fett oder Öl hinterlässt auf Papier einen durchscheinenden Fleck, der nach dem Trocknen bleibt. Wasserflecken verschwinden eher wieder.",
    },
    {
      concept: "bio:k5:arbeitsweisen:lab1",
      prompt: "Warum gelten im Biolabor Sicherheitsregeln (z. B. Pipette, Schutzbrille, kein Verkosten)?",
      answer: "Damit Chemikalien und Geräte niemanden gefährden und Ergebnisse zuverlässig bleiben",
      wrong: [
        "Nur damit der Raum leerer wirkt",
        "Nur damit man schneller raten kann",
        "Nur weil Modelle verboten sind",
      ],
      explanation: "Labortechnik und Sicherheit.",
      wissen:
        "Nachweisreaktionen und Experimente brauchen sauberes, vorsichtiges Arbeiten. Regeln schützen Gesundheit und verhindern verfälschte Ergebnisse.",
    },
    {
      concept: "bio:k5:arbeitsweisen:mix1",
      prompt: "Ein Team beobachtet Schuppen mit der Lupe, sortiert Fischarten und baut ein Schwimmmodell. Welche Arbeitsweisen stecken darin?",
      answer: "Beobachten, Vergleichen/Ordnen und Arbeiten mit Modellen",
      wrong: [
        "Nur Merkmale des Lebens auswendig lernen",
        "Nur Physik der Geschwindigkeit berechnen",
        "Nur Jahreszahlen der Steinzeit lernen",
      ],
      explanation: "Methodenmix im Einstieg.",
      wissen:
        "Biologische Arbeitsweisen greifen ineinander: Beobachten liefert Daten, Vergleichen ordnet sie, Modelle erklären Angepasstheiten — getrennt von den Merkmalen des Lebens selbst.",
    },
  ],
  pairs: [
    {
      concept: "bio:k5:arbeitsweisen:p:beob",
      term: "Beobachten",
      meaning: "Merkmale gezielt wahrnehmen",
      wissen: "Erste Methode der Erkenntnisgewinnung.",
    },
    {
      concept: "bio:k5:arbeitsweisen:p:beschr",
      term: "Beschreiben",
      meaning: "Wahrnehmungen verständlich festhalten",
      wissen: "Macht Beobachtungen nachvollziehbar.",
    },
    {
      concept: "bio:k5:arbeitsweisen:p:vergl",
      term: "Vergleichen",
      meaning: "Gemeinsamkeiten und Unterschiede finden",
      wissen: "Grundlage für Ordnen und Bestimmen.",
    },
    {
      concept: "bio:k5:arbeitsweisen:p:ordn",
      term: "Ordnen",
      meaning: "Nach Kriterien in Gruppen bringen",
      wissen: "Strukturiert Beobachtungsdaten.",
    },
    {
      concept: "bio:k5:arbeitsweisen:p:exp",
      term: "Experiment",
      meaning: "Vermutung unter geplanten Bedingungen prüfen",
      wissen: "Zentrale Untersuchungsmethode.",
    },
    {
      concept: "bio:k5:arbeitsweisen:p:mod",
      term: "Modell",
      meaning: "Vereinfachtes Abbild zum Verstehen",
      wissen: "Grenzen zum Original prüfen.",
    },
    {
      concept: "bio:k5:arbeitsweisen:p:iodo",
      term: "Stärkenachweis",
      meaning: "Blau-violette Färbung mit Lugolscher Lösung",
      wissen: "Typische Nachweisreaktion.",
    },
    {
      concept: "bio:k5:arbeitsweisen:p:fett",
      term: "Fettfleckprobe",
      meaning: "Dauerhaft durchscheinender Fleck auf Papier",
      wissen: "Einfacher Fettnachweis.",
    },
  ],
  trueFalse: [
    {
      concept: "bio:k5:arbeitsweisen:tf1",
      statement: "Ein Modell muss in allen Eigenschaften exakt dem Original gleichen.",
      correct: false,
      explanation: "Modelle vereinfachen bewusst.",
      wissen: "Modelle lassen Nebensächliches weg und können Größe oder Material verändern — deshalb prüft man ihre Grenzen.",
    },
    {
      concept: "bio:k5:arbeitsweisen:tf2",
      statement: "Beim Experimentieren gehören Frage, Durchführung und Beobachtung zusammen.",
      correct: true,
      explanation: "Strukturiertes Untersuchen.",
      wissen: "Ohne Frage und Auswertung bleibt ein Versuch bloßes Ausprobieren.",
    },
    {
      concept: "bio:k5:arbeitsweisen:tf3",
      statement: "Lugolsche Lösung färbt Stärke typischerweise blau-violett.",
      correct: true,
      explanation: "Klassischer Nachweis.",
      wissen: "Der Farbumschlag zeigt Stärke an; Blindproben sichern den Vergleich.",
    },
  ],
  sorts: [
    {
      concept: "bio:k5:arbeitsweisen:sort1",
      question: "Ordne die Schritte eines einfachen Experiments zeitlich.",
      labels: ["Frage stellen", "Versuch durchführen", "Beobachtung notieren", "Ergebnis deuten"],
      explanation: "Vom Ziel zur Deutung.",
      wissen: "So bleibt die Untersuchung nachvollziehbar und auswertbar.",
    },
    {
      concept: "bio:k5:arbeitsweisen:sort2",
      question: "Ordne die Teile eines einfachen Versuchsprotokolls.",
      labels: ["Fragestellung", "Durchführung", "Beobachtung", "Deutung"],
      explanation: "Beobachtung und Deutung strikt trennen.",
      wissen: "Im Protokoll steht zuerst, was man sieht — danach, was es bedeuten könnte.",
    },
    {
      concept: "bio:k5:arbeitsweisen:sort3",
      question: "Ordne die Schritte beim Stärkenachweis.",
      labels: ["Probe vorbereiten", "Lugolsche Lösung zugeben", "Farbumschlag beobachten", "Mit Blindprobe vergleichen"],
      explanation: "Nachweis mit Vergleich.",
      wissen: "Ohne Blindprobe bleibt unklar, ob die Farbe wirklich von Stärke kommt.",
    },
  ],
  multis: [
    {
      concept: "bio:k5:arbeitsweisen:ms1",
      question: "Welche Tätigkeiten gehören zu biologischen Arbeitsweisen (mehrere richtig)?",
      correct: ["Beobachten und Beschreiben", "Vergleichen und Ordnen", "Experimentieren"],
      wrong: ["Nur Jahreszahlen auswendig lernen", "Nur Fantasiewesen malen ohne Bezug"],
      explanation: "Methoden der Erkenntnisgewinnung.",
      wissen: "Lehrplan Sachsen: Beobachten, Untersuchen/Vergleichen, Experimentieren; ergänzend Modelle und Nachweisreaktionen.",
    },
    {
      concept: "bio:k5:arbeitsweisen:ms2",
      question: "Was gehört in ein einfaches Versuchsprotokoll (mehrere richtig)?",
      correct: ["Fragestellung", "Beobachtung", "kurze Deutung"],
      wrong: ["Nur Fantasiezeichnung ohne Bezug", "Nur die Lieblingsfarbe der Gruppe"],
      explanation: "Dokumentation macht Versuche nachvollziehbar.",
      wissen: "Protokollieren trennt Wahrnehmung und Erklärung und erlaubt Wiederholung.",
    },
  ],
  compares: [
    {
      concept: "bio:k5:arbeitsweisen:cmp1",
      question: "Beobachtung oder Deutung — was ist die reine Beobachtung?",
      cardA: { title: "A", body: "Die Lösung färbt sich blau-violett." },
      cardB: { title: "B", body: "Also muss Stärke enthalten sein." },
      correct: "A",
      explanation: "Farbe sehen = beobachten; Stärke folgern = deuten.",
      wissen: "Genaues Trennen von Beobachtung und Deutung ist eine Kernkompetenz beim Experimentieren.",
    },
    {
      concept: "bio:k5:arbeitsweisen:cmp2",
      question: "Welches Vorgehen ist ein geplantes Experiment?",
      cardA: { title: "A", body: "Frage stellen, Versuch planen, beobachten, auswerten" },
      cardB: { title: "B", body: "Beliebig mischen und hoffen, dass etwas passiert" },
      correct: "A",
      explanation: "Experimentieren folgt einer prüfbaren Frage.",
      wissen: "Ohne Frage und Auswertung bleibt es bloßes Ausprobieren.",
    },
    {
      concept: "bio:k5:arbeitsweisen:cmp3",
      question: "Welcher Nachweis passt zur Stärke?",
      cardA: { title: "A", body: "Lugolsche Lösung → blau-violett" },
      cardB: { title: "B", body: "Dauerhaft durchscheinender Fettfleck" },
      correct: "A",
      explanation: "Fettfleckprobe weist Fett nach, nicht Stärke.",
      wissen: "Iod-Kaliumiodid (Lugol) ist der klassische Stärkenachweis in Klasse 5.",
    },
  ],
  findErrors: [
    {
      concept: "bio:k5:arbeitsweisen:fe1",
      question: "Welche Aussage zu Modellen ist fachlich falsch?",
      statements: [
        "Beim Beobachten erfasst man Merkmale gezielt.",
        "Ein Modell muss in allen Eigenschaften exakt dem Original gleichen.",
        "Ein Protokoll hält Durchführung und Beobachtung fest.",
      ],
      faultyIndex: 1,
      explanation: "Modelle vereinfachen bewusst — sie sind nie das Original.",
      wissen: "Grenzen von Modellen (Größe, Material, fehlende Teile) muss man prüfen.",
    },
    {
      concept: "bio:k5:arbeitsweisen:fe2",
      question: "Welche Aussage zu Beobachtung und Nachweis ist falsch?",
      statements: [
        "Lugolsche Lösung färbt Stärke typischerweise blau-violett.",
        "Die Fettfleckprobe zeigt einen dauerhaft durchscheinenden Fleck.",
        "Beobachten und Deuten sind dasselbe und müssen nicht getrennt werden.",
      ],
      faultyIndex: 2,
      explanation: "Beobachtung und Deutung werden bewusst getrennt formuliert.",
      wissen: "„Ich beobachte …“ versus „Daraus folgt …“ schult fachliches Denken.",
    },
  ],
  causeEffects: [
    {
      concept: "bio:k5:arbeitsweisen:ce1",
      cause: "Sorgfältiges Beobachten mit der Lupe",
      effect: "Feinheiten werden erkennbar, die mit bloßem Auge fehlen",
      wissen: "Optische Hilfsmittel erweitern die Wahrnehmung.",
    },
    {
      concept: "bio:k5:arbeitsweisen:ce2",
      cause: "Kriterien festlegen und sortieren",
      effect: "Gemeinsamkeiten und Gruppen werden sichtbar",
      wissen: "Vergleichen und Ordnen strukturieren Beobachtungsdaten.",
    },
    {
      concept: "bio:k5:arbeitsweisen:ce3",
      cause: "Lugolsche Lösung auf stärkehaltige Probe",
      effect: "Blau-violetter bis schwarz-blauer Farbumschlag",
      wissen: "Klassischer Stärkenachweis.",
    },
    {
      concept: "bio:k5:arbeitsweisen:ce4",
      cause: "Modell baut nur Wesentliches nach",
      effect: "Zusammenhänge werden verständlicher, Details fehlen bewusst",
      wissen: "Modelle sind Erkenntnishilfen mit Grenzen.",
    },
  ],
  sources: [
    {
      concept: "bio:k5:arbeitsweisen:src1",
      question: "Was beschreibt der Textabschnitt als ersten Schritt?",
      sourceText:
        "Biologen beobachten gezielt und beschreiben, was sie wahrnehmen. Danach vergleichen sie Merkmale und prüfen Vermutungen im Experiment.",
      sourceLabel: "Methoden-Kurztext",
      sourceKind: "Schulbuch-Stil",
      correct: "Gezieltes Beobachten und Beschreiben",
      wrong: [
        "Sofort Modelle bauen ohne Blick",
        "Nur Jahreszahlen lernen",
        "Nur Fantasiewesen malen",
      ],
      explanation: "Der Einstieg ist Wahrnehmung, nicht Deutung.",
      wissen: "Arbeitsweisen greifen ineinander, beginnen aber oft beim genauen Hinschauen.",
    },
  ],
  icons: [
    {
      concept: "bio:k5:arbeitsweisen:ic1",
      question: "Welches Symbol steht für die Arbeitsweise Experimentieren?",
      prompt: "Arbeitsweise wählen",
      options: [
        { id: "exp", label: "Experiment", icon: "🔬" },
        { id: "sort", label: "Ordnen", icon: "🗂️" },
        { id: "mod", label: "Modell", icon: "🧩" },
        { id: "eye", label: "Nur raten", icon: "🎲" },
      ],
      correctId: "exp",
      explanation: "Das Mikroskop/Labor steht hier für geplantes Untersuchen.",
      wissen: "Experimentieren prüft Vermutungen unter möglichst klaren Bedingungen.",
    },
  ],
  hotspots: [
    {
      concept: "bio:k5:arbeitsweisen:hs1",
      question: "Tippe auf den Schritt „Beobachtung notieren“ im Versuchsablauf.",
      imageSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220" role="img" aria-label="Versuchsablauf">
        <rect width="400" height="220" fill="#0f172a"/>
        <rect x="20" y="70" width="80" height="50" rx="8" fill="#1e293b" stroke="#94a3b8"/>
        <text x="60" y="100" text-anchor="middle" fill="#e2e8f0" font-size="12">Frage</text>
        <rect x="120" y="70" width="80" height="50" rx="8" fill="#1e293b" stroke="#94a3b8"/>
        <text x="160" y="100" text-anchor="middle" fill="#e2e8f0" font-size="12">Versuch</text>
        <rect x="220" y="70" width="80" height="50" rx="8" fill="#1e293b" stroke="#94a3b8"/>
        <text x="260" y="100" text-anchor="middle" fill="#e2e8f0" font-size="12">Beobachtung</text>
        <rect x="320" y="70" width="60" height="50" rx="8" fill="#1e293b" stroke="#94a3b8"/>
        <text x="350" y="100" text-anchor="middle" fill="#e2e8f0" font-size="12">Deutung</text>
        <path d="M100 95 H120 M200 95 H220 M300 95 H320" stroke="#5eead4" stroke-width="2" marker-end="url(#a)"/>
      </svg>`,
      regions: [
        { id: "q", label: "Frage", x: 5, y: 28, w: 20, h: 28 },
        { id: "v", label: "Versuch", x: 30, y: 28, w: 20, h: 28 },
        { id: "b", label: "Beobachtung", x: 55, y: 28, w: 20, h: 28 },
        { id: "d", label: "Deutung", x: 80, y: 28, w: 15, h: 28 },
      ],
      correctRegionId: "b",
      explanation: "Beobachtung kommt nach dem Versuch und vor der Deutung.",
      wissen: "Die Reihenfolge sichert, dass Wahrnehmungen nicht mit Erklärungen vermischt werden.",
    },
  ],
}


const phJ12Schwingungen: BioBank = {
  quelle: "Lehrplan Physik Sachsen / Schulportal 523",
  url: "https://www.schulportal.sachsen.de/lplandb/lehrplan/523",
  conceptPrefix: "ph:j12:schwing",
  facts: [

{
  concept: "ph:j12:schwing:ampl",
  prompt: "Was ist die Amplitude einer Schwingung?",
  answer: "Maximale Auslenkung aus der Ruhelage",
  wrong: [
    "Nur die Periodendauer",
    "Nur die Masse in kg",
    "Nur die Temperatur",
  ],
  explanation: "Größte Entfernung von der Gleichgewichtslage.",
  wissen: "Die Amplitude ist die maximale Auslenkung aus der Ruhelage.",
  gap: "Maximale Auslenkung heißt ___.",
  gapAccepted: ["Amplitude"],
},

{
  concept: "ph:j12:schwing:T",
  prompt: "Was ist die Periodendauer T?",
  answer: "Zeit für eine volle Schwingung",
  wrong: [
    "Nur die Amplitude",
    "Nur die Wellenlänge im Vakuum",
    "Nur die Ladung",
  ],
  explanation: "Dauer einer Periode.",
  wissen: "Die Periodendauer T ist die Zeit für eine vollständige Schwingung.",
  gap: "Zeit für eine Periode heißt ___.",
  gapAccepted: ["Periodendauer", "T"],
},

{
  concept: "ph:j12:schwing:f",
  prompt: "Wie hängen Frequenz f und Periodendauer T zusammen?",
  answer: "f = 1/T",
  wrong: [
    "f = T",
    "f = T²",
    "f = 2T",
  ],
  explanation: "Kehrwert.",
  wissen: "Frequenz und Periodendauer sind Kehrwerte: f = 1/T.",
  gap: "f = 1/___.",
  gapAccepted: ["T", "Periodendauer"],
},

{
  concept: "ph:j12:schwing:em",
  prompt: "Was beschreibt einen elektromagnetischen Schwingkreis?",
  answer: "Energiewechsel zwischen Kondensator und Spule",
  wrong: [
    "Nur Gleichstrom ohne Feld",
    "Nur Gravitation",
    "Nur Temperaturstrahlung allein",
  ],
  explanation: "LC-Schwingung.",
  wissen: "Im Schwingkreis oszilliert Energie zwischen elektrischem Feld (Kondensator) und magnetischem Feld (Spule).",
  gap: "LC-Kreis: Kondensator und ___.",
  gapAccepted: ["Spule"],
},

{
  concept: "ph:j12:schwing:trans",
  prompt: "Was kennzeichnet Transversalwellen?",
  answer: "Schwingung senkrecht zur Ausbreitungsrichtung",
  wrong: [
    "Immer nur parallel zur Ausbreitung",
    "Keine Ausbreitung",
    "Nur Teilchen ohne Welle",
  ],
  explanation: "⊥ Ausbreitung.",
  wissen: "Bei Transversalwellen schwingt das Medium senkrecht zur Ausbreitungsrichtung — Licht ist elektromagnetisch transversal.",
  gap: "Licht verhält sich wie eine ___ Welle.",
  gapAccepted: ["transversale", "Transversal"],
},

{
  concept: "ph:j12:schwing:long",
  prompt: "Was kennzeichnet Longitudinalwellen?",
  answer: "Schwingung parallel zur Ausbreitungsrichtung",
  wrong: [
    "Immer senkrecht zur Ausbreitung",
    "Keine Dichteänderung",
    "Nur Licht im Vakuum",
  ],
  explanation: "|| Ausbreitung.",
  wissen: "Longitudinalwellen: Schwingung parallel zur Ausbreitung, z. B. Schall in Luft.",
  gap: "Schall in Luft ist eine ___ Welle.",
  gapAccepted: ["Longitudinal", "longitudinale"],
},

{
  concept: "ph:j12:schwing:inter",
  prompt: "Was ist Interferenz?",
  answer: "Überlagerung von Wellen mit Verstärkung oder Auslöschung",
  wrong: [
    "Nur Absorption von Wärme",
    "Nur Massevernichtung",
    "Nur Gleichstrom",
  ],
  explanation: "Superposition.",
  wissen: "Interferenz ist die Überlagerung von Wellen — konstruktiv oder destruktiv.",
  gap: "Überlagerung von Wellen heißt ___.",
  gapAccepted: ["Interferenz"],
},

{
  concept: "ph:j12:schwing:beug",
  prompt: "Was ist Beugung?",
  answer: "Wellenausbreitung hinter Hindernissen und Öffnungen",
  wrong: [
    "Nur geradlinige Strahlen ohne Welle",
    "Nur Masseänderung",
    "Nur Temperatur",
  ],
  explanation: "Wellenphänomen.",
  wissen: "Beugung zeigt Wellencharakter: Ausbreitung hinter Kanten und Spalten.",
  gap: "Hinter einem Spalt beobachtet man ___.",
  gapAccepted: ["Beugung"],
},

{
  concept: "ph:j12:schwing:vlf",
  prompt: "Welche Beziehung gilt für Wellen?",
  answer: "v = λ·f",
  wrong: [
    "v = λ/f²",
    "v = f/λ²",
    "v = λ+f",
  ],
  explanation: "Phasengeschwindigkeit.",
  wissen: "Ausbreitungsgeschwindigkeit = Wellenlänge × Frequenz (v = λ·f).",
  gap: "v = λ · ___.",
  gapAccepted: ["f", "Frequenz"],
},

{
  concept: "ph:j12:schwing:feder",
  prompt: "Wovon hängt T beim idealen Federpendel ab?",
  answer: "Von Masse und Federkonstante",
  wrong: [
    "Nur von der Farbe",
    "Nur von der Amplitude groß",
    "Nur vom Ort auf dem Mond ohne m",
  ],
  explanation: "T=2π√(m/D).",
  wissen: "Für kleine Schwingungen: T = 2π√(m/D). Härtere Feder (größeres D) → kleinere Periodendauer.",
  gap: "T hängt von m und ___ ab.",
  gapAccepted: ["D", "Federkonstante"],
},

{
  concept: "ph:j12:schwing:polar",
  prompt: "Was folgt aus der Polarisierbarkeit von Licht?",
  answer: "Licht ist eine Transversalwelle",
  wrong: [
    "Licht ist nur Longitudinalwelle in Luft immer",
    "Licht hat keine Wellenlänge",
    "Licht ist nur Teilchen ohne Welle immer",
  ],
  explanation: "Polarisationsfilter.",
  wissen: "Polarisation ist mit transversalen Wellen vereinbar. Licht als EM-Welle kann linear polarisiert werden.",
  gap: "Polarisation stützt den ___ Charakter von Licht.",
  gapAccepted: ["transversalen", "Wellen"],
},

{
  concept: "ph:j12:schwing:stehend",
  prompt: "Was sind Bäuche und Knoten bei stehenden Wellen?",
  answer: "Orte maximaler bzw. verschwindender Auslenkung",
  wrong: [
    "Nur Temperaturmaxima",
    "Nur Gleichspannungen",
    "Nur Massenpunkte ohne Welle",
  ],
  explanation: "Interferenz gegenläufiger Wellen.",
  wissen: "Stehende Wellen: Knoten (keine Auslenkung) und Bäuche (maximale Amplitude) durch Überlagerung.",
  gap: "Orte ohne Auslenkung heißen ___.",
  gapAccepted: ["Knoten"],
},
  ],
  pairs: [
    { concept: "ph:j12:schwing:p:A", term: "Amplitude", meaning: "Maximale Auslenkung", wissen: "Kennzeichnet Stärke." },
    { concept: "ph:j12:schwing:p:T", term: "Periodendauer", meaning: "Zeit einer Periode", wissen: "Symbol T." },
    { concept: "ph:j12:schwing:p:f", term: "Frequenz", meaning: "Schwingungen pro Zeit", wissen: "f=1/T." },
    { concept: "ph:j12:schwing:p:LC", term: "Schwingkreis", meaning: "LC-Kreis mit C und L", wissen: "EM-Schwingung." },
    { concept: "ph:j12:schwing:p:trans", term: "Transversalwelle", meaning: "Schwingung ⊥ Ausbreitung", wissen: "Licht." },
    { concept: "ph:j12:schwing:p:long", term: "Longitudinalwelle", meaning: "Schwingung || Ausbreitung", wissen: "Schall." },
    { concept: "ph:j12:schwing:p:inter", term: "Interferenz", meaning: "Überlagerung", wissen: "Maxima/Minima." },
    { concept: "ph:j12:schwing:p:beug", term: "Beugung", meaning: "Ausbreitung hinter Hindernis", wissen: "Wellenmerkmal." },
    { concept: "ph:j12:schwing:p:polar", term: "Polarisation", meaning: "Schwingungsrichtung filtern", wissen: "Transversal." },
    { concept: "ph:j12:schwing:p:lambda", term: "Wellenlänge", meaning: "Abstand gleicher Phase", wissen: "λ in v=λf." },
  ],
}


const phJ12Atomvorstellungen: BioBank = {
  quelle: "Lehrplan Physik Sachsen / Schulportal 523",
  url: "https://www.schulportal.sachsen.de/lplandb/lehrplan/523",
  conceptPrefix: "ph:j12:atom",
  facts: [

{
  concept: "ph:j12:atom:bohr",
  prompt: "Was beschreibt das Bohrsche Atommodell grob?",
  answer: "Elektronen auf bestimmten Bahnen/Energieniveaus",
  wrong: [
    "Elektronen beliebig mit jeder Energie",
    "Kein Kern vorhanden",
    "Nur Protonen ohne Elektronen",
  ],
  explanation: "Quantisierte Bahnen.",
  wissen: "Im Bohrschen Modell bewegen sich Elektronen auf erlaubten Bahnen mit diskreten Energien — Erklärung von Linienspektren.",
  gap: "Bohr: Elektronen auf erlaubten ___.",
  gapAccepted: ["Bahnen", "Niveaus"],
},

{
  concept: "ph:j12:atom:spek",
  prompt: "Warum entstehen Linienspektren?",
  answer: "Übergänge zwischen Energieniveaus mit ΔE = h·f",
  wrong: [
    "Nur durch Reibung am Glas",
    "Nur durch Gravitation",
    "Nur durch Gleichstrom ohne Atom",
  ],
  explanation: "Emission/Absorption.",
  wissen: "Beim Übergang zwischen Niveaus wird ein Photon mit E = h·f aufgenommen oder abgegeben — Linienspektrum.",
  gap: "ΔE = h · ___.",
  gapAccepted: ["f", "Frequenz"],
},

{
  concept: "ph:j12:atom:kern",
  prompt: "Was enthält der Atomkern?",
  answer: "Protonen und Neutronen",
  wrong: [
    "Nur Elektronen",
    "Nur Photonen",
    "Nur Neutrinos allein",
  ],
  explanation: "Nukleonen.",
  wissen: "Der Kern besteht aus Protonen und Neutronen; Elektronen bilden die Hülle.",
  gap: "Protonen und Neutronen heißen ___.",
  gapAccepted: ["Nukleonen"],
},

{
  concept: "ph:j12:atom:ruther",
  prompt: "Was zeigte Rutherfords Streuversuch?",
  answer: "Atome haben einen kleinen, schweren Kern",
  wrong: [
    "Atome sind homogener Pudding ohne Kern",
    "Elektronen sitzen im Kernzentrum immer",
    "Es gibt keine Ladung",
  ],
  explanation: "Kern-Atom.",
  wissen: "Alphateilchen wurden stark abgelenkt — Beweis für kompakten, positiv geladenen Kern.",
  gap: "Rutherford folgerte einen kleinen ___.",
  gapAccepted: ["Kern", "Atomkern"],
},

{
  concept: "ph:j12:atom:photo",
  prompt: "Was ist ein Photon im Atomkontext?",
  answer: "Energiequant der EM-Strahlung E = h·f",
  wrong: [
    "Ein Proton im Kern",
    "Ein Neutron ohne Masse immer",
    "Ein Molekül Wasser",
  ],
  explanation: "Lichtquant.",
  wissen: "Photonen sind Quanten der elektromagnetischen Strahlung mit E = h·f.",
  gap: "E = h · ___.",
  gapAccepted: ["f"],
},

{
  concept: "ph:j12:atom:ion",
  prompt: "Wann ist ein Atom ionisiert?",
  answer: "Wenn es Elektronen abgegeben oder aufgenommen hat",
  wrong: [
    "Wenn es nur Neutronen hat",
    "Wenn es keine Masse hat",
    "Wenn es nur Photonen speichert",
  ],
  explanation: "Ladung ≠ 0.",
  wissen: "Ionisation: Elektron entfernt oder hinzugefügt — Ion mit Nettoladung.",
  gap: "Ein geladenes Atom heißt ___.",
  gapAccepted: ["Ion"],
},

{
  concept: "ph:j12:atom:orbit",
  prompt: "Was ersetzt das Bohrsche Bahnmodell modern grob?",
  answer: "Orbitale / Aufenthaltswahrscheinlichkeiten",
  wrong: [
    "Feste Planetenbahnen ohne Quantelung",
    "Nur billardartige Bahnen klassisch",
    "Keine Elektronen mehr",
  ],
  explanation: "Quantenmechanik.",
  wissen: "Moderne Atommodelle beschreiben Elektronen durch Orbitale (Wahrscheinlichkeiten), nicht klassische Planetenbahnen.",
  gap: "Aufenthaltsbereiche der Elektronen heißen ___.",
  gapAccepted: ["Orbitale"],
},

{
  concept: "ph:j12:atom:em",
  prompt: "Was passiert bei Emission eines Photons?",
  answer: "Elektron wechselt auf niedrigeres Niveau",
  wrong: [
    "Kern verschwindet",
    "Masse wird negativ",
    "Nur die Temperaturfarbe ändert sich ohne Energie",
  ],
  explanation: "Energieabgabe.",
  wissen: "Emission: Übergang auf niedrigeres Niveau, Photon trägt ΔE weg.",
  gap: "Abgabe eines Photons heißt ___.",
  gapAccepted: ["Emission"],
},

{
  concept: "ph:j12:atom:abs",
  prompt: "Was passiert bei Absorption eines Photons?",
  answer: "Elektron wechselt auf höheres Niveau (passende Energie)",
  wrong: [
    "Kern verdoppelt sich immer",
    "Neutronen werden zu Photonen",
    "Nur die Raumtemperatur sinkt ohne Atom",
  ],
  explanation: "Energieaufnahme.",
  wissen: "Absorption: Photonenergie hebt das Elektron auf ein höheres Niveau, wenn ΔE passt.",
  gap: "Aufnahme eines Photons heißt ___.",
  gapAccepted: ["Absorption"],
},

{
  concept: "ph:j12:atom:grenze",
  prompt: "Warum versagt das klassische Atommodell?",
  answer: "Beschleunigte Elektronen würden abstrahlen und spiralförmig in den Kern stürzen",
  wrong: [
    "Weil Masse negativ wäre",
    "Weil Licht keine Geschwindigkeit hat",
    "Weil es keine Protonen gibt",
  ],
  explanation: "Stabilitätsproblem.",
  wissen: "Klassisch müssten kreisende Elektronen strahlen und in den Kern fallen — Quantelung erklärt Stabilität.",
  gap: "Klassisch wären Atome nicht ___.",
  gapAccepted: ["stabil"],
},

{
  concept: "ph:j12:atom:nukleon",
  prompt: "Was ist die Massenzahl A grob?",
  answer: "Anzahl der Nukleonen (Protonen + Neutronen)",
  wrong: [
    "Nur die Elektronenzahl immer",
    "Nur die Photonenzahl",
    "Nur die Temperatur",
  ],
  explanation: "A = Z + N.",
  wissen: "Massenzahl A = Protonenzahl + Neutronenzahl.",
  gap: "A = Z + ___.",
  gapAccepted: ["N", "Neutronenzahl"],
},

{
  concept: "ph:j12:atom:isotope",
  prompt: "Was sind Isotope?",
  answer: "Atome mit gleicher Protonenzahl, unterschiedlicher Neutronenzahl",
  wrong: [
    "Atome mit unterschiedlicher Protonenzahl gleicher Chemie nie",
    "Nur Moleküle ohne Kern",
    "Nur Ionen ohne Neutronen",
  ],
  explanation: "Gleiches Element, anderes A.",
  wissen: "Isotope: gleiches Z, verschiedenes N (und A).",
  gap: "Gleiches Z, anderes N: ___.",
  gapAccepted: ["Isotope"],
},
  ],
  pairs: [
    { concept: "ph:j12:atom:p:bohr", term: "Bohrmodell", meaning: "Diskrete Elektronenbahnen", wissen: "Linienspektren." },
    { concept: "ph:j12:atom:p:photon", term: "Photon", meaning: "Lichtquant E=hf", wissen: "Emission/Absorption." },
    { concept: "ph:j12:atom:p:kern", term: "Atomkern", meaning: "Protonen+Neutronen", wissen: "Rutherford." },
    { concept: "ph:j12:atom:p:orbital", term: "Orbital", meaning: "Aufenthaltsbereich", wissen: "Moderne QM." },
    { concept: "ph:j12:atom:p:ion", term: "Ion", meaning: "Geladenes Atom", wissen: "Elektronenzahl ≠ Z." },
    { concept: "ph:j12:atom:p:spektrum", term: "Linienspektrum", meaning: "Diskrete Frequenzen", wissen: "Niveaus." },
    { concept: "ph:j12:atom:p:isotope", term: "Isotop", meaning: "Gleiches Z, anderes N", wissen: "Massenzahl." },
    { concept: "ph:j12:atom:p:emission", term: "Emission", meaning: "Photonabgabe", wissen: "Niveauabstieg." },
    { concept: "ph:j12:atom:p:absorption", term: "Absorption", meaning: "Photonaufnahme", wissen: "Niveauanstieg." },
    { concept: "ph:j12:atom:p:nukleon", term: "Nukleon", meaning: "Proton oder Neutron", wissen: "Im Kern." },
  ],
}


const bioK8Blutzucker: BioBank = {
  quelle: "Lehrplan Biologie Sachsen / Schulportal 522",
  url: "https://www.schulportal.sachsen.de/lplandb/lehrplan/522",
  conceptPrefix: "bio:k8:blutz",
  facts: [

{
  concept: "bio:k8:blutz:1",
  prompt: "Was reguliert den Blutzuckerspiegel maßgeblich?",
  answer: "Hormone wie Insulin und Glucagon",
  wrong: [
    "Nur die Hautfarbe",
    "Nur die Federlänge",
    "Nur Jahresringe",
  ],
  explanation: "Regelkreis.",
  wissen: "Insulin senkt, Glucagon erhöht den Blutzucker — antagonistisches Hormonsystem.",
  gap: "Insulin senkt den ___.",
  gapAccepted: ["Blutzucker", "Blutzuckerspiegel"],
},

{
  concept: "bio:k8:blutz:2",
  prompt: "Was ist ein biologischer Regelkreis grob?",
  answer: "Messung, Vergleich mit Sollwert, Gegensteuerung",
  wrong: [
    "Nur einmalige Reaktion ohne Rückkopplung",
    "Nur Zufall ohne Sensor",
    "Nur Wachstum ohne Kontrolle",
  ],
  explanation: "Negative Rückkopplung oft.",
  wissen: "Regelkreise halten Größen (z. B. Blutzucker) nahe am Sollwert durch Sensor, Vergleicher und Effektor.",
  gap: "Abweichung vom Sollwert löst eine ___ aus.",
  gapAccepted: ["Gegenregulation", "Reaktion"],
},

{
  concept: "bio:k8:blutz:3",
  prompt: "Wo wird Insulin vor allem gebildet?",
  answer: "In der Bauchspeicheldrüse",
  wrong: [
    "Nur in der Leberhaut",
    "Nur im Knochenmark immer",
    "Nur in den Haaren",
  ],
  explanation: "Pankreas.",
  wissen: "Die Langerhans-Inseln der Bauchspeicheldrüse bilden Insulin.",
  gap: "Insulin kommt aus der ___.",
  gapAccepted: ["Bauchspeicheldrüse", "Pankreas"],
},

{
  concept: "bio:k8:blutz:4",
  prompt: "Was bewirkt Insulin an den Zellen?",
  answer: "Erhöhte Glucoseaufnahme aus dem Blut",
  wrong: [
    "Sofortige Erhöhung des Blutzuckers immer",
    "Abbau aller Hormone",
    "Stopp der Atmung",
  ],
  explanation: "Senkung des Spiegels.",
  wissen: "Insulin fördert die Aufnahme von Glucose in Zellen und die Speicherung als Glykogen.",
  gap: "Insulin fördert die ___ von Glucose.",
  gapAccepted: ["Aufnahme"],
},

{
  concept: "bio:k8:blutz:5",
  prompt: "Was bewirkt Glucagon?",
  answer: "Freisetzung von Glucose aus Speichern, Blutzucker steigt",
  wrong: [
    "Sofortige Senkung unter null",
    "Bildung von Chlorophyll",
    "Stopp des Herzschlags",
  ],
  explanation: "Gegenspieler von Insulin.",
  wissen: "Glucagon mobilisiert Glykogenreserven — Blutzucker steigt.",
  gap: "Gegenspieler von Insulin ist ___.",
  gapAccepted: ["Glucagon"],
},

{
  concept: "bio:k8:blutz:6",
  prompt: "Warum ist die Regulation des Blutzuckers wichtig?",
  answer: "Zellen brauchen stabile Glucoseversorgung; Extreme schaden",
  wrong: [
    "Nur für die Haarfarbe",
    "Nur für Jahresringe",
    "Nur für Fischschuppen",
  ],
  explanation: "Homöostase.",
  wissen: "Zu hoher oder zu niedriger Blutzucker gefährdet Organe — Regulation hält Homöostase.",
  gap: "Stabile innere Bedingungen heißen ___.",
  gapAccepted: ["Homöostase"],
},

{
  concept: "bio:k8:blutz:7",
  prompt: "Was ist negative Rückkopplung?",
  answer: "Die Wirkung dämpft die Ursache der Abweichung",
  wrong: [
    "Die Wirkung verstärkt die Abweichung immer",
    "Es gibt keinen Sensor",
    "Nur Zufallsprozesse",
  ],
  explanation: "Stabilisierung.",
  wissen: "Negative Rückkopplung wirkt der Abweichung entgegen — typisch für Blutzuckerregulation.",
  gap: "Stabilisierende Rückkopplung heißt ___ Rückkopplung.",
  gapAccepted: ["negative"],
},

{
  concept: "bio:k8:blutz:8",
  prompt: "Welche Rolle hat die Leber im Zuckerstoffwechsel?",
  answer: "Speichert und gibt Glucose frei (Glykogen)",
  wrong: [
    "Nur Bildung von Insulin allein",
    "Nur Bildung von Glucagon allein",
    "Keine Rolle",
  ],
  explanation: "Speicherorgan.",
  wissen: "Die Leber speichert Glucose als Glykogen und gibt sie bei Bedarf ab.",
  gap: "Speicherform von Glucose in der Leber: ___.",
  gapAccepted: ["Glykogen"],
},

{
  concept: "bio:k8:blutz:9",
  prompt: "Was misst der Körper beim Blutzucker grob?",
  answer: "Glucosekonzentration im Blut",
  wrong: [
    "Nur den Sauerstoff im Knochen",
    "Nur den Blutdruck der Haare",
    "Nur die Hauttemperatur allein",
  ],
  explanation: "Sensorik im Regelkreis.",
  wissen: "Sensoren erfassen die Glucosekonzentration; Hormone steuern nach.",
  gap: "Reguliert wird die ___ im Blut.",
  gapAccepted: ["Glucosekonzentration", "Glucose", "Zuckerkonzentration"],
},

{
  concept: "bio:k8:blutz:10",
  prompt: "Diabetes mellitus hängt eng zusammen mit …",
  answer: "Störungen der Insulinwirkung oder -produktion",
  wrong: [
    "Nur mit Federbruch",
    "Nur mit Kiemenatmung",
    "Nur mit Fotosynthese",
  ],
  explanation: "Beispielfall Regulation.",
  wissen: "Bei Diabetes ist die Regulation des Blutzuckers gestört — Insulinmangel oder Resistenz.",
  gap: "Diabetes betrifft die ___-Regulation.",
  gapAccepted: ["Blutzucker", "Glucose"],
},
  ],
  pairs: [
    { concept: "bio:k8:blutz:p:insulin", term: "Insulin", meaning: "Senkt Blutzucker", wissen: "Pankreas." },
    { concept: "bio:k8:blutz:p:glucagon", term: "Glucagon", meaning: "Erhöht Blutzucker", wissen: "Gegenspieler." },
    { concept: "bio:k8:blutz:p:soll", term: "Sollwert", meaning: "Zielgröße der Regelung", wissen: "Homöostase." },
    { concept: "bio:k8:blutz:p:sensor", term: "Sensor", meaning: "Misst Istwert", wissen: "Regelkreis." },
    { concept: "bio:k8:blutz:p:effektor", term: "Effektor", meaning: "Stellt nach", wissen: "Drüse/Organ." },
    { concept: "bio:k8:blutz:p:glykogen", term: "Glykogen", meaning: "Speicherform von Glucose", wissen: "Leber/Muskel." },
    { concept: "bio:k8:blutz:p:homoeo", term: "Homöostase", meaning: "Stabiles Innenmilieu", wissen: "Regulation." },
    { concept: "bio:k8:blutz:p:neg", term: "Negative Rückkopplung", meaning: "Dämpft Abweichung", wissen: "Stabil." },
    { concept: "bio:k8:blutz:p:pankreas", term: "Bauchspeicheldrüse", meaning: "Bildet Insulin/Glucagon", wissen: "Hormone." },
    { concept: "bio:k8:blutz:p:glucose", term: "Glucose", meaning: "Blutzucker", wissen: "Zellbrennstoff." },
  ],
}


const bioK10Evolutionsbelege: BioBank = {
  quelle: "Lehrplan Biologie Sachsen / Schulportal 522",
  url: "https://www.schulportal.sachsen.de/lplandb/lehrplan/522",
  conceptPrefix: "bio:k10:evo",
  facts: [

{
  concept: "bio:k10:evo:1",
  prompt: "Was sind Fossilien als Evolutionsbeleg?",
  answer: "Versteinerte Reste oder Spuren früherer Lebewesen",
  wrong: [
    "Nur moderne Fotos",
    "Nur Wetterdaten",
    "Nur Stadtpläne",
  ],
  explanation: "Belege.",
  wissen: "Fossilien dokumentieren ausgestorbene Formen und Übergänge in der Erdgeschichte.",
  gap: "Versteinerte Reste heißen ___.",
  gapAccepted: ["Fossilien"],
},

{
  concept: "bio:k10:evo:2",
  prompt: "Was zeigt Homologie?",
  answer: "Ähnlichkeit durch gemeinsame Abstammung",
  wrong: [
    "Ähnlichkeit nur durch Zufall immer",
    "Nur gleiche Farbe ohne Bau",
    "Nur gleiche Ernährung immer",
  ],
  explanation: "Vergleichende Anatomie.",
  wissen: "Homologe Organe haben gemeinsamen Ursprung, auch bei unterschiedlicher Funktion.",
  gap: "Gemeinsame Abstammung erklärt ___.",
  gapAccepted: ["Homologie"],
},

{
  concept: "bio:k10:evo:3",
  prompt: "Was ist Analogie?",
  answer: "Ähnliche Funktion bei unterschiedlicher Herkunft",
  wrong: [
    "Immer gleiche Gene",
    "Immer homologe Knochen",
    "Immer Fossilien",
  ],
  explanation: "Konvergenz.",
  wissen: "Analoge Strukturen entstehen unabhängig bei ähnlichem Selektionsdruck.",
  gap: "Ähnliche Funktion, anderer Ursprung: ___.",
  gapAccepted: ["Analogie"],
},

{
  concept: "bio:k10:evo:4",
  prompt: "Was belegen DNA-Vergleiche?",
  answer: "Verwandtschaftsgrade zwischen Arten",
  wrong: [
    "Nur die Haarfarbe ohne Verwandtschaft",
    "Nur das Wetter",
    "Nur die Schwerkraft",
  ],
  explanation: "Molekularbiologie.",
  wissen: "Je ähnlicher Sequenzen, desto näher oft die Verwandtschaft — molekularer Evolutionsbeleg.",
  gap: "Sequenzähnlichkeit deutet auf ___.",
  gapAccepted: ["Verwandtschaft"],
},

{
  concept: "bio:k10:evo:5",
  prompt: "Was ist Selektion?",
  answer: "Unterschiedlicher Fortpflanzungserfolg je nach Merkmalen",
  wrong: [
    "Zufällige Namensgebung",
    "Nur Mutation ohne Umwelt",
    "Nur Fossillücken",
  ],
  explanation: "Evolutionsfaktor.",
  wissen: "Selektion bevorzugt Merkmale, die unter den Bedingungen höhere Fitness haben.",
  gap: "Unterschiedlicher Fortpflanzungserfolg heißt ___.",
  gapAccepted: ["Selektion"],
},

{
  concept: "bio:k10:evo:6",
  prompt: "Was ist eine Mutation im Evolutionskontext?",
  answer: "Veränderung des Erbguts als Variationsquelle",
  wrong: [
    "Immer sofortige Anpassung zielgerichtet",
    "Nur Wetteränderung",
    "Nur Lernverhalten",
  ],
  explanation: "Rohmaterial.",
  wissen: "Mutationen erzeugen Variation; Selektion filtert.",
  gap: "Neue Allele entstehen durch ___.",
  gapAccepted: ["Mutation", "Mutationen"],
},

{
  concept: "bio:k10:evo:7",
  prompt: "Was beschreibt Artbildung grob?",
  answer: "Entstehung neuer Arten oft durch Isolation und Selektion",
  wrong: [
    "Nur Umfärbung ohne Fortpflanzungsbarriere",
    "Nur Domestikation immer",
    "Nur Fossilverlust",
  ],
  explanation: "Speziation.",
  wissen: "Geographische oder andere Isolation kann zu neuer Artbildung führen.",
  gap: "Trennung von Populationen heißt oft ___.",
  gapAccepted: ["Isolation"],
},

{
  concept: "bio:k10:evo:8",
  prompt: "Was sind Rudimente?",
  answer: "Zurückgebildete Organe als Abstammungshinweis",
  wrong: [
    "Immer neu erfundene Organe ohne Geschichte",
    "Nur Pflanzenzellen",
    "Nur Viren",
  ],
  explanation: "Beleg.",
  wissen: "Rudimentäre Organe deuten auf Vorfahren mit funktionstüchtigem Organ hin.",
  gap: "Zurückgebildete Organe heißen ___.",
  gapAccepted: ["Rudimente", "Rudiment"],
},

{
  concept: "bio:k10:evo:9",
  prompt: "Was ist ein Übergangsform-Fossil?",
  answer: "Fossil mit Merkmalen zweier Großgruppen",
  wrong: [
    "Nur ein modernes Haustier",
    "Nur ein Stein ohne Leben",
    "Nur eine Wolke",
  ],
  explanation: "Brücke.",
  wissen: "Übergangsformen verbinden Baupläne und stützen kontinuierliche Veränderung.",
  gap: "Fossilien mit Zwischenmerkmalen heißen ___formen.",
  gapAccepted: ["Übergangs"],
},

{
  concept: "bio:k10:evo:10",
  prompt: "Was besagt die synthetische Evolutionstheorie grob?",
  answer: "Mutation, Rekombination, Selektion, Drift erklären Artwandel",
  wrong: [
    "Nur zielgerichtete Anpassung ohne Gene",
    "Nur Katastrophen ohne Variation",
    "Nur Lamarck allein",
  ],
  explanation: "Modernes Gerüst.",
  wissen: "Die moderne Synthese verknüpft Genetik und Selektion als Evolutionsfaktoren.",
  gap: "Wichtige Evolutionsfaktoren sind Mutation und ___.",
  gapAccepted: ["Selektion"],
},
  ],
  pairs: [
    { concept: "bio:k10:evo:p:fossil", term: "Fossil", meaning: "Versteinerte Spur/Rest", wissen: "Erdgeschichte." },
    { concept: "bio:k10:evo:p:homolog", term: "Homologie", meaning: "Gemeinsame Abstammung", wissen: "Anatomie." },
    { concept: "bio:k10:evo:p:analog", term: "Analogie", meaning: "Konvergente Ähnlichkeit", wissen: "Funktion." },
    { concept: "bio:k10:evo:p:selektion", term: "Selektion", meaning: "Fitnessunterschiede", wissen: "Umweltfilter." },
    { concept: "bio:k10:evo:p:mutation", term: "Mutation", meaning: "Erbgutänderung", wissen: "Variation." },
    { concept: "bio:k10:evo:p:isolation", term: "Isolation", meaning: "Trennung von Populationen", wissen: "Artbildung." },
    { concept: "bio:k10:evo:p:rudiment", term: "Rudiment", meaning: "Zurückgebildetes Organ", wissen: "Abstammung." },
    { concept: "bio:k10:evo:p:dna", term: "DNA-Vergleich", meaning: "Molekularer Verwandtschaftstest", wissen: "Sequenzen." },
    { concept: "bio:k10:evo:p:art", term: "Artbildung", meaning: "Entstehung neuer Arten", wissen: "Speziation." },
    { concept: "bio:k10:evo:p:drift", term: "Gendrift", meaning: "Zufällige Allelfrequenzänderung", wissen: "Kleiner Bestand." },
  ],
}

export const LEHRPLAN_TOPIC_GAP_GENERATORS: Record<string, Topic['generate']> = {
  // Physik K10 — Newtonsche Gesetze (fehlender Pflicht-LB)
  'ph-k10-lb1n-newton': physikBankGenerate(phK10Newton),
  'ph-k10-lb1n-traegheit': physikBankGenerate(phK10Newton),
  'ph-k10-lb1n-fma': physikBankGenerate(phK10Newton),
  'ph-k10-lb1n-verkehr': physikBankGenerate(phK10Newton),
  'ph-k10-lb1n-superposition': physikBankGenerate(phK10Newton),
  // Physik JGS12 GK — mechanische/EM Schwingungen & Atomvorstellungen
  'ph-j12gk-lb1-mech-schwing': physikBankGenerate(phJ12Schwingungen),
  'ph-j12gk-lb1-em-schwing': physikBankGenerate(phJ12Schwingungen),
  'ph-j12gk-lb1-wellen': physikBankGenerate(phJ12Schwingungen),
  'ph-j12gk-lb4-atommodell': physikBankGenerate(phJ12Atomvorstellungen),
  'ph-j12gk-lb4-spektrum': physikBankGenerate(phJ12Atomvorstellungen),
  'ph-j12gk-lb4-kernhuelle': physikBankGenerate(phJ12Atomvorstellungen),
  // Bio — fehlende benannte Teilaspekte
  'bi-k5-lb1-arbeitsweisen': bankGenerate(bioK5Arbeitsweisen),
  'bi-k7-lb1-viren': bankGenerate(bioK7Viren),
  'bi-k8-lb1-blutzucker': bankGenerate(bioK8Blutzucker),
  'bi-k10-lb2-evolutionsbelege': bankGenerate(bioK10Evolutionsbelege),
}
