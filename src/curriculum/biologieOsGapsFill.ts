/**
 * Bio OS GK/LK Lehrplan-Teilaspekt-Lücken — dense banks.
 * AUTO: tmp/gen_bio_os_gaps.py
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

const gk11Osmose: BioBank = {
  quelle: "Wikipedia: Osmose",
  url: "https://de.wikipedia.org/wiki/Osmose",
  conceptPrefix: "bio:gk11:osmose",
  facts: [
    {
      concept: "bio:gk11:osmose:1",
      prompt: "Was ist Diffusion?",
      answer: "Es kennzeichnet die Nettobewegung von Teilchen entlang des Konzentrationsgefälles.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Was ist Diffusion.",
      wissen: "Nettobewegung von Teilchen entlang des Konzentrationsgefälles. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:osmose:2",
      prompt: "Wozu dient Außen?",
      answer: "Es bezeichnet die Diffusion von Wasser durch eine semipermeable Membran.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Was ist Osmose.",
      wissen: "Diffusion von Wasser durch eine semipermeable Membran. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:osmose:3",
      prompt: "Wozu dient Außen?",
      answer: "Es bezeichnet den Außen niedrigere Osmolarität; Wasser strömt oft hinein.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Hypoton bedeutet für die Zelle.",
      wissen: "Außen niedrigere Osmolarität; Wasser strömt oft hinein. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:osmose:4",
      prompt: "Was bewirkt Außen?",
      answer: "Es steht für den Außen höhere Osmolarität; Wasser strömt oft hinaus.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Hyperton bedeutet.",
      wissen: "Außen höhere Osmolarität; Wasser strömt oft hinaus. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Außen"],
    },
    {
      concept: "bio:gk11:osmose:5",
      prompt: "Wozu dient Lässt?",
      answer: "Es beschreibt die Gleiche effektive Osmolarität innen und außen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Isoton bedeutet.",
      wissen: "Gleiche effektive Osmolarität innen und außen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:osmose:6",
      prompt: "Wozu dient Lässt?",
      answer: "Es ist das Protoplast löst sich bei Wasserverlust von der Zellwand.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Plasmolyse.",
      wissen: "Protoplast löst sich bei Wasserverlust von der Zellwand. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:osmose:7",
      prompt: "Wozu dient Lässt?",
      answer: "Es bezeichnet das Rückkehr des Protoplasten nach Wasseraufnahme.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Deplasmolyse.",
      wissen: "Rückkehr des Protoplasten nach Wasseraufnahme. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:osmose:8",
      prompt: "Warum semipermeabel wichtig?",
      answer: "Es lässt Wasser, aber nicht alle gelösten Stoffe passieren.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum semipermeabel wichtig.",
      wissen: "Lässt Wasser, aber nicht alle gelösten Stoffe passieren. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Lässt"],
    },
    {
      concept: "bio:gk11:osmose:9",
      prompt: "Wasserpotenzial grob?",
      answer: "Es ist das Maß für die Tendenz von Wasser zu strömen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Wasserpotenzial grob.",
      wissen: "Maß für die Tendenz von Wasser zu strömen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:osmose:10",
      prompt: "Woran erkennt man 10?",
      answer: "Es steht für das Zwiebel/Elodea in Zucker-/Salzlösungen beobachten.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Experimenteller Bezug.",
      wissen: "Zwiebel/Elodea in Zucker-/Salzlösungen beobachten. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:gk11:osmose:p:1", term: "Diffusion", meaning: "Ist der Konzentrationsausgleich durch ungeordnete Teilchenbewegung", wissen: "Passiv. Diffusion bedeutet: Ist der Konzentrationsausgleich durch ungeordnete Teilchenbewegung." },
    { concept: "bio:gk11:osmose:p:2", term: "Osmose", meaning: "Ist die Diffusion von Wasser durch eine semipermeable Membran", wissen: "Semipermeabel. Osmose bedeutet: Ist die Diffusion von Wasser durch eine semipermeable Membran." },
    { concept: "bio:gk11:osmose:p:3", term: "Hypoton", meaning: "Kennzeichnet den Außen verdünnter", wissen: "Wasser hinein. Hypoton bedeutet: Kennzeichnet den Außen verdünnter." },
    { concept: "bio:gk11:osmose:p:4", term: "Hyperton", meaning: "Kennzeichnet den Außen konzentrierter", wissen: "Wasser hinaus. Hyperton bedeutet: Kennzeichnet den Außen konzentrierter." },
    { concept: "bio:gk11:osmose:p:5", term: "Isoton", meaning: "Beschreibt das Ausgeglichen", wissen: "Kein Nettofluss. Isoton bedeutet: Beschreibt das Ausgeglichen." },
    { concept: "bio:gk11:osmose:p:6", term: "Plasmolyse", meaning: "Steht für den Ablösen des Protoplasten", wissen: "Wasserverlust. Plasmolyse bedeutet: Beschreibt die Wasserverlust." },
    { concept: "bio:gk11:osmose:p:7", term: "Deplasmolyse", meaning: "Kennzeichnet die Rückkehr", wissen: "Wasseraufnahme. Deplasmolyse bedeutet: Kennzeichnet die Rückkehr." },
    { concept: "bio:gk11:osmose:p:8", term: "Semipermeabel", meaning: "Steht für das selektiv durchlässig", wissen: "Membran. Semipermeabel bedeutet: Steht für das selektiv durchlässig." },
    { concept: "bio:gk11:osmose:p:9", term: "Wasserpotenzial", meaning: "Kennzeichnet das Wasserströmungsmaß", wissen: "Pflanzen. Wasserpotenzial bedeutet: Beschreibt das Strommaß." },
    { concept: "bio:gk11:osmose:p:10", term: "Protoplast", meaning: "Beschreibt das Zellinhalt ohne Wand", wissen: "Pflanzenzelle. Protoplast bedeutet: Beschreibt das Zellinhalt ohne Wand." },
  ],
}

const gk11Transport: BioBank = {
  quelle: "Wikipedia: Membrantransport",
  url: "https://de.wikipedia.org/wiki/Membrantransport",
  conceptPrefix: "bio:gk11:transport",
  facts: [
    {
      concept: "bio:gk11:transport:1",
      prompt: "Passiver Transport?",
      answer: "1 gilt Ohne ATP entlang des Gefälles (Diffusion/erleichterte Diffusion).",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Passiver Transport.",
      wissen: "Ohne ATP entlang des Gefälles (Diffusion/erleichterte Diffusion). Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:transport:2",
      prompt: "Wozu dient Aktiver?",
      answer: "Er ist der Gegen das Gefälle unter Energieverbrauch (ATP).",
      wrong: [
        "Er betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Aktiver Transport.",
      wissen: "Gegen das Gefälle unter Energieverbrauch (ATP). Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:transport:3",
      prompt: "Was bewirkt Aktiver?",
      answer: "Er kennzeichnet den passiv über Carrier/Kanäle.",
      wrong: [
        "Er betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Erleichterte Diffusion.",
      wissen: "Passiv über Carrier/Kanäle. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:transport:4",
      prompt: "Was bewirkt Aktiver?",
      answer: "Er steht für den aktiven Antiport von Na+/K+ unter ATP-Verbrauch.",
      wrong: [
        "Er betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Natrium-Kalium-Pumpe.",
      wissen: "Aktiver Antiport von Na+/K+ unter ATP-Verbrauch. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Aktiver"],
    },
    {
      concept: "bio:gk11:transport:5",
      prompt: "Wozu dient Bestimmt?",
      answer: "Es ist die Aufnahme in Vesikeln in die Zelle.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Endocytose.",
      wissen: "Aufnahme in Vesikeln in die Zelle. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:transport:6",
      prompt: "Wozu dient Bestimmt?",
      answer: "Es beschreibt die Abgabe von Vesikelinhalt nach außen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Exocytose.",
      wissen: "Abgabe von Vesikelinhalt nach außen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:transport:7",
      prompt: "Wozu dient Bestimmt?",
      answer: "Es bezeichnet die Wasserkanäle in Membranen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Aquaporine.",
      wissen: "Wasserkanäle in Membranen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:transport:8",
      prompt: "Was bewirkt Bestimmt?",
      answer: "Es steht für das Bestimmt und welche Stoffe passieren.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Selektivität der Membran.",
      wissen: "Bestimmt, welche Stoffe passieren. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Bestimmt"],
    },
    {
      concept: "bio:gk11:transport:9",
      prompt: "Woran erkennt man 9?",
      answer: "Es kennzeichnet das Bindet Stoff und erleichtert/aktiviert Transport.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Carrier-Protein.",
      wissen: "Bindet Stoff und erleichtert/aktiviert Transport. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:transport:10",
      prompt: "Was kennzeichnet 10?",
      answer: "Es beschreibt die Getrennte Räume ermöglichen unterschiedliche Bedingungen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum Kompartimentierung.",
      wissen: "Getrennte Räume ermöglichen unterschiedliche Bedingungen. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:gk11:transport:p:1", term: "Passiv", meaning: "Steht für die ohne ATP mit Gefälle", wissen: "Diffusion. Passiv bedeutet: Steht für das fertige AK." },
    { concept: "bio:gk11:transport:p:2", term: "Aktiv", meaning: "Beschreibt das Mit ATP gegen Gefälle", wissen: "Pumpe. Aktiv bedeutet: Steht für die eigene AK." },
    { concept: "bio:gk11:transport:p:3", term: "Carrier", meaning: "Beschreibt den Transportprotein", wissen: "Bindung. Carrier bedeutet: Beschreibt den Binder." },
    { concept: "bio:gk11:transport:p:4", term: "Kanal", meaning: "Kennzeichnet das Porenprotein", wissen: "Selektiv. Kanal bedeutet: Bezeichnet die Pore." },
    { concept: "bio:gk11:transport:p:5", term: "Endocytose", meaning: "Bezeichnet den Vesikel rein", wissen: "Aufnahme. Endocytose bedeutet: Beschreibt die Rein." },
    { concept: "bio:gk11:transport:p:6", term: "Exocytose", meaning: "Steht für den Vesikel raus", wissen: "Abgabe. Exocytose bedeutet: Kennzeichnet die Raus." },
    { concept: "bio:gk11:transport:p:7", term: "Aquaporin", meaning: "Kennzeichnet das Wasserkanal", wissen: "Osmose. Aquaporin bedeutet: Kennzeichnet das Wasserkanal." },
    { concept: "bio:gk11:transport:p:8", term: "ATP", meaning: "Steht für das Energie", wissen: "Aktiver Transport. ATP bedeutet: Steht für die Währung." },
    { concept: "bio:gk11:transport:p:9", term: "Antiport", meaning: "Beschreibt den gegengerichteten Transport", wissen: "Pumpe. Antiport bedeutet: Beschreibt den gegengerichteten Transport." },
    { concept: "bio:gk11:transport:p:10", term: "Kompartiment", meaning: "Kennzeichnet das Reaktionsraum", wissen: "Organell. Kompartiment bedeutet: Kennzeichnet das Raum." },
  ],
}

const gk11Wasser: BioBank = {
  quelle: "Wikipedia: Transpiration",
  url: "https://de.wikipedia.org/wiki/Transpiration",
  conceptPrefix: "bio:gk11:wasser",
  facts: [
    {
      concept: "bio:gk11:wasser:1",
      prompt: "Wozu dient die Anziehung?",
      answer: "Sie beschreibt die Verdunstung an Blättern zieht Wasser nach oben.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Transpirationssog.",
      wissen: "Verdunstung an Blättern zieht Wasser nach oben. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:wasser:2",
      prompt: "Wozu dient die Anziehung?",
      answer: "Sie bezeichnet die Steighöhe in engen Röhren durch Kohäsion/Adhäsion.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Kapillarität.",
      wissen: "Steighöhe in engen Röhren durch Kohäsion/Adhäsion. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:wasser:3",
      prompt: "Wozu dient die Anziehung?",
      answer: "Sie beschreibt die Anziehung zwischen Wassermolekülen.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Kohäsion des Wassers.",
      wissen: "Anziehung zwischen Wassermolekülen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:wasser:4",
      prompt: "Wozu dient die Anziehung?",
      answer: "Sie beschreibt die Anziehung Wasser–Zellwand.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Adhäsion.",
      wissen: "Anziehung Wasser–Zellwand. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Anziehung"],
    },
    {
      concept: "bio:gk11:wasser:5",
      prompt: "Wozu dienen Kühlt oder treibt?",
      answer: "Es ist das aktiver Beitrag der Wurzel zum Wasserstrom.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Wurzeldruck.",
      wissen: "Aktiver Beitrag der Wurzel zum Wasserstrom. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:wasser:6",
      prompt: "Wozu dienen Kühlt oder treibt?",
      answer: "Es bezeichnet den Wassen und Mineralstoffe aufwärts.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Xylem transportiert.",
      wissen: "Wasser und Mineralstoffe aufwärts. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:wasser:7",
      prompt: "Was bewirkt Kühlt oder treibt?",
      answer: "Sie kennzeichnet die Transpiration und CO2-Aufnahme.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Spaltöffnungen steuern.",
      wissen: "Transpiration und CO2-Aufnahme. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:wasser:8",
      prompt: "Warum Transpiration nötig/riskant?",
      answer: "Sie steht für die Kühlt/treibt Strom und Kostet aber Wasser.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum Transpiration nötig/riskant.",
      wissen: "Kühlt/treibt Strom, kostet aber Wasser. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Kühlt/treibt"],
    },
    {
      concept: "bio:gk11:wasser:9",
      prompt: "Was kennzeichnet 9?",
      answer: "Es beschreibt die Gase und Wasserdampf im Interzellularraum.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Diffusion im Mesophyll.",
      wissen: "Gase und Wasserdampf im Interzellularraum. Fachlich themenspezifisch einordnen.",
    },
    { concept: "bio:gk11:wasser:10", prompt: "Angepasstheit Trockenheit?", answer: "Es steht für das weniger Spaltenöffnung, dickere Cuticula u. a.", wrong: ["Es handelt sich um der Immer maximale Transpiration.", "Das ist der Immer offene Spalten Tag und Nacht.", "Es steht für die Keine Anpassungen möglich."],
      explanation: "Angepasstheit Trockenheit.",
      wissen: "Weniger Spaltenöffnung, dickere Cuticula u. a. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:gk11:wasser:p:1", term: "Transpiration", meaning: "Kennzeichnet die Verdunstung Blatt", wissen: "Sog. Transpiration bedeutet: Kennzeichnet die Verdunstung Blatt." },
    { concept: "bio:gk11:wasser:p:2", term: "Xylem", meaning: "Kennzeichnet die Wasserleitung", wissen: "Aufwärts. Xylem bedeutet: Kennzeichnet die Wasserleitung." },
    { concept: "bio:gk11:wasser:p:3", term: "Kohäsion", meaning: "Beschreibt den Wasser–Wasser", wissen: "Säule. Kohäsion bedeutet: Beschreibt den Wasser–Wasser." },
    { concept: "bio:gk11:wasser:p:4", term: "Adhäsion", meaning: "Steht für die Wasser–Wand", wissen: "Steighilfe. Adhäsion bedeutet: Steht für die Wasser–Wand." },
    { concept: "bio:gk11:wasser:p:5", term: "Kapillarität", meaning: "Steht für die steigen in Röhren", wissen: "Eng. Kapillarität bedeutet: Steht für die steigen in Röhren." },
    { concept: "bio:gk11:wasser:p:6", term: "Wurzeldruck", meaning: "Steht für das Druck von unten", wissen: "Aktiv. Wurzeldruck bedeutet: Steht für das Druck von unten." },
    { concept: "bio:gk11:wasser:p:7", term: "Stoma", meaning: "Steht für die Spaltöffnung", wissen: "Regelung. Stoma bedeutet: Steht für die Spaltöffnung." },
    { concept: "bio:gk11:wasser:p:8", term: "Cuticula", meaning: "Dient als Wachsschicht", wissen: "Schutz. Cuticula bedeutet: Dient als Wachsschicht." },
    { concept: "bio:gk11:wasser:p:9", term: "Mesophyll", meaning: "Bezeichnet die Blattgewebe", wissen: "Gasaustausch. Mesophyll bedeutet: Bezeichnet die Blattgewebe." },
    { concept: "bio:gk11:wasser:p:10", term: "Transpirationssog", meaning: "Kennzeichnet das Zug nach oben", wissen: "Haupttrieb. Transpirationssog bedeutet: Kennzeichnet das Zug nach oben." },
  ],
}

const gk11Enzyme: BioBank = {
  quelle: "Wikipedia: Enzym",
  url: "https://de.wikipedia.org/wiki/Enzym",
  conceptPrefix: "bio:gk11:enzyme",
  facts: [
    { concept: "bio:gk11:enzyme:1", prompt: "Was leistet ein Enzym?", answer: "Es beschreibt das Senkt die Aktivierungsenergie und beschleunigt Reaktionen.", wrong: ["Es wird als Substrat verbraucht immer.", "Es erhöht Aktivierungsenergie.", "Das ist das Ersetzt ATP vollständig."],
      explanation: "Was leistet ein Enzym.",
      wissen: "Senkt die Aktivierungsenergie und beschleunigt Reaktionen. Fachlich themenspezifisch einordnen.",
    },
    { concept: "bio:gk11:enzyme:2", prompt: "Wozu dient Jedes?", answer: "Es beschreibt das Passendes Substrat (Schlüssel-Schloss / induced fit).", wrong: ["Es beschreibt das Jedes Enzym spaltet alles.", "Es handelt sich um die Keine Bindung nötig.", "Das ist die Nur Temperatur zählt."],
      explanation: "Spezifität.",
      wissen: "Passendes Substrat (Schlüssel-Schloss / induced fit). Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:enzyme:3",
      prompt: "Was bewirkt Jedes?",
      answer: "Es bezeichnet das Bis Optimum schneller und Danach Denaturierung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Einfluss Temperatur.",
      wissen: "Bis Optimum schneller, danach Denaturierung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:enzyme:4",
      prompt: "Wozu dient Jedes?",
      answer: "Es beschreibt das Jedes Enzym hat einen Optimalen pH-Bereich.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Einfluss pH.",
      wissen: "Jedes Enzym hat einen optimalen pH-Bereich. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Jedes"],
    },
    {
      concept: "bio:gk11:enzyme:5",
      prompt: "Was bewirkt Stoffwechselwege?",
      answer: "Sie kennzeichnet die Hemmstoff konkurriert um aktives Zentrum.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Kompetitive Hemmung.",
      wissen: "Hemmstoff konkurriert um aktives Zentrum. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:enzyme:6",
      prompt: "Was bewirkt Stoffwechselwege?",
      answer: "Sie steht für die Bindung außerhalb; verändert Aktivität.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Nichtkompetitive Hemmung.",
      wissen: "Bindung außerhalb; verändert Aktivität. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:enzyme:7",
      prompt: "Was bewirkt Stoffwechselwege?",
      answer: "Sie kennzeichnet die Hilfsmolekül für viele Enzyme.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Coenzym/Cofaktor.",
      wissen: "Hilfsmolekül für viele Enzyme. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:enzyme:8",
      prompt: "Warum Enzyme regulieren?",
      answer: "Sie steht für die Stoffwechselwege steuern und Überproduktion vermeiden.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum Enzyme regulieren.",
      wissen: "Stoffwechselwege steuern und Überproduktion vermeiden. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Stoffwechselwege"],
    },
    { concept: "bio:gk11:enzyme:9", prompt: "Was beschreibt 9?", answer: "Es steht für das Vmax wenn alle Zentren belegt.", wrong: ["Es steht für die unendlich steigende Geschwindigkeit.", "Es steht für die Keine Maximalrate.", "Es steht für die Nur bei 0 Substrat max."],
      explanation: "Substratsättigung.",
      wissen: "Vmax wenn alle Zentren belegt. Fachlich themenspezifisch einordnen.",
    },
    { concept: "bio:gk11:enzyme:10", prompt: "Was kennzeichnet 10?", answer: "Es beschreibt den Zusammenhang Zusammenhang Raumstruktur zerstört → Funktionsverlust.", wrong: ["Das ist der Immer reversibel hilfreich.", "Es erhöht Spezifität.", "Es bildet neue Gene."],
      explanation: "Denaturierung.",
      wissen: "Raumstruktur zerstört → Funktionsverlust. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:gk11:enzyme:p:1", term: "Enzym", meaning: "Kennzeichnet das Biokatalysator", wissen: "Protein oft. Enzym bedeutet: Kennzeichnet das Biokatalysator." },
    { concept: "bio:gk11:enzyme:p:2", term: "Aktivierungsenergie", meaning: "Beschreibt die Startbarriere", wissen: "Senkung. Aktivierungsenergie bedeutet: Beschreibt die Startbarriere." },
    { concept: "bio:gk11:enzyme:p:3", term: "Aktives Zentrum", meaning: "Bezeichnet das Bindungsort", wissen: "Spezifisch. Aktives Zentrum bedeutet: Bezeichnet das Bindungsort." },
    { concept: "bio:gk11:enzyme:p:4", term: "Substrat", meaning: "Bezeichnet das Ausgangsstoff", wissen: "Umsetzung. Substrat bedeutet: Bezeichnet das Ausgangsstoff." },
    { concept: "bio:gk11:enzyme:p:5", term: "Vmax", meaning: "Beschreibt die Maximalrate", wissen: "Sättigung. Vmax bedeutet: Kennzeichnet die Sättigungsrate." },
    { concept: "bio:gk11:enzyme:p:6", term: "Kompetitiv", meaning: "Kennzeichnet die Konkurrenz am Zentrum", wissen: "Hemmung. Kompetitiv bedeutet: Beschreibt die Zentrumskonkurrenz." },
    { concept: "bio:gk11:enzyme:p:7", term: "Allosterisch", meaning: "Beschreibt die andere Bindungsstelle", wissen: "Regulation. Allosterisch bedeutet: Beschreibt die andere Bindungsstelle." },
    { concept: "bio:gk11:enzyme:p:8", term: "Cofaktor", meaning: "Bezeichnet den Hilfsfaktor", wissen: "Oft Metall/Vitamin. Cofaktor bedeutet: Bezeichnet den Hilfsfaktor." },
    { concept: "bio:gk11:enzyme:p:9", term: "Optimum", meaning: "Beschreibt die beste Bedingung", wissen: "T/pH. Optimum bedeutet: Beschreibt die beste Bedingung." },
    { concept: "bio:gk11:enzyme:p:10", term: "Denaturierung", meaning: "Steht für die Strukturverlust", wissen: "Hitze/pH. Denaturierung bedeutet: Steht für die Strukturverlust." },
  ],
}

const gk11Replikation: BioBank = {
  quelle: "Wikipedia: DNA-Replikation",
  url: "https://de.wikipedia.org/wiki/DNA-Replikation",
  conceptPrefix: "bio:gk11:repl",
  facts: [
    {
      concept: "bio:gk11:repl:1",
      prompt: "Wozu dient Synthetisiert?",
      answer: "Es bezeichnet den Jeden Tochterstrang behält einen Elternstrang.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Semikonservativ bedeutet.",
      wissen: "Jeder Tochterstrang behält einen Elternstrang. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:repl:2",
      prompt: "Wozu dient Synthetisiert?",
      answer: "Es beschreibt die Kurze Stücke am lagging strand.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Okazaki-Fragmente.",
      wissen: "Kurze Stücke am lagging strand. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:repl:3",
      prompt: "Was bewirkt Synthetisiert?",
      answer: "Es kennzeichnet das Öffnet die Doppelhelix.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Helicase.",
      wissen: "Öffnet die Doppelhelix. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:repl:4",
      prompt: "Wozu dient Synthetisiert?",
      answer: "Es bezeichnet das Synthetisiert DNA-Strang.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "DNA-Polymerase.",
      wissen: "Synthetisiert DNA-Strang. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Synthetisiert"],
    },
    {
      concept: "bio:gk11:repl:5",
      prompt: "Wozu dient Diskontinuierlich?",
      answer: "Es beschreibt das Setzt RNA-Primer.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Primase.",
      wissen: "Setzt RNA-Primer. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:repl:6",
      prompt: "Wozu dient Diskontinuierlich?",
      answer: "Es beschreibt das Verknüpft DNA-Fragmente.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Ligase.",
      wissen: "Verknüpft DNA-Fragmente. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:repl:7",
      prompt: "Was bewirkt Diskontinuierlich?",
      answer: "Es kennzeichnet das kontinuierlich in Gabelrichtung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Leading strand.",
      wissen: "Kontinuierlich in Gabelrichtung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:repl:8",
      prompt: "Was bewirkt Diskontinuierlich?",
      answer: "Es kennzeichnet das diskontinuierlich mit Okazaki-Fragmenten.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Lagging strand.",
      wissen: "Diskontinuierlich mit Okazaki-Fragmenten. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Diskontinuierlich"],
    },
    {
      concept: "bio:gk11:repl:9",
      prompt: "Was kennzeichnet 9?",
      answer: "Es kennzeichnet den Tochterzellen brauchen vollständiges Erbgut.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum Replikation vor Mitose.",
      wissen: "Tochterzellen brauchen vollständiges Erbgut. Fachlich themenspezifisch einordnen.",
    },
    { concept: "bio:gk11:repl:10", prompt: "Was kennzeichnet 10?", answer: "Das ist die Korrektur falsch eingebauter Basen.", wrong: ["Es erhöht Mutationsrate absichtlich.", "Es steht für das Löscht Gene gezielt immer.", "Es beschreibt die Nur Translation."],
      explanation: "Proofreading grob.",
      wissen: "Korrektur falsch eingebauter Basen. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:gk11:repl:p:1", term: "Semikonservativ", meaning: "Steht für das Alt- + ein Neustrang", wissen: "Prinzip. Semikonservativ bedeutet: Steht für das Alt- + ein Neustrang." },
    { concept: "bio:gk11:repl:p:2", term: "Okazaki", meaning: "Steht für die Lagging-Stücke", wissen: "Diskontinuierlich. Okazaki bedeutet: Steht für die Lagging-Stücke." },
    { concept: "bio:gk11:repl:p:3", term: "Helicase", meaning: "Steht für die Öffnet DNA", wissen: "Gabel. Helicase bedeutet: Steht für die Öffnet DNA." },
    { concept: "bio:gk11:repl:p:4", term: "Polymerase", meaning: "Kennzeichnet die Synthese", wissen: "DNA. Polymerase bedeutet: Kennzeichnet die Synthese." },
    { concept: "bio:gk11:repl:p:5", term: "Primase", meaning: "Beschreibt den RNA-Primer", wissen: "Start. Primase bedeutet: Beschreibt den RNA-Primer." },
    { concept: "bio:gk11:repl:p:6", term: "Ligase", meaning: "Bezeichnet die Verknüpfung", wissen: "Fragmente. Ligase bedeutet: Bezeichnet die Verknüpfung." },
    { concept: "bio:gk11:repl:p:7", term: "Leading", meaning: "Kennzeichnet das Kontinuierlich", wissen: "Vorwärts. Leading bedeutet: Kennzeichnet das Kontinuierlich." },
    { concept: "bio:gk11:repl:p:8", term: "Lagging", meaning: "Beschreibt die Stückweise", wissen: "Okazaki. Lagging bedeutet: Beschreibt die Stückweise." },
    { concept: "bio:gk11:repl:p:9", term: "Replikationsgabel", meaning: "Kennzeichnet die Öffnungsstelle", wissen: "Bidirektional oft. Replikationsgabel bedeutet: Kennzeichnet die Öffnungsstelle." },
    { concept: "bio:gk11:repl:p:10", term: "Proofreading", meaning: "Bezeichnet die Korrektur", wissen: "Genauigkeit. Proofreading bedeutet: Bezeichnet die Korrektur." },
  ],
}

const gk11Protein: BioBank = {
  quelle: "Wikipedia: Proteinbiosynthese",
  url: "https://de.wikipedia.org/wiki/Proteinbiosynthese",
  conceptPrefix: "bio:gk11:pbs",
  facts: [
    {
      concept: "bio:gk11:pbs:1",
      prompt: "Wozu dient Bringt?",
      answer: "Es beschreibt den Vorgang Vorgang Vorgang DNA → mRNA.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Transkription.",
      wissen: "DNA → mRNA. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:pbs:2",
      prompt: "Wozu dient Bringt?",
      answer: "Es beschreibt den Vorgang Vorgang Vorgang mRNA → Protein an Ribosomen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Translation.",
      wissen: "mRNA → Protein an Ribosomen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:pbs:3",
      prompt: "Was bewirkt Bringt?",
      answer: "Es steht für das Basentriplett der MRNA.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Codon.",
      wissen: "Basentriplett der mRNA. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:pbs:4",
      prompt: "Was bewirkt Bringt?",
      answer: "Es kennzeichnet das Bringt Aminosäure passend zum Codon.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "tRNA Aufgabe.",
      wissen: "Bringt Aminosäure passend zum Codon. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Bringt"],
    },
    {
      concept: "bio:gk11:pbs:5",
      prompt: "Was bewirkt Wann oder wie?",
      answer: "Sie kennzeichnet die Ort der Translation.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Ribosom.",
      wissen: "Ort der Translation. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:pbs:6",
      prompt: "Wozu dienen Wann oder wie?",
      answer: "Es bezeichnet das AUG (Methionin/Formylmethionin je nach System).",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Startcodon typisch.",
      wissen: "AUG (Methionin/Formylmethionin je nach System). Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:pbs:7",
      prompt: "Wozu dienen Wann oder wie?",
      answer: "Es bezeichnet den Beenden Translation ohne Aminosäure.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Stoppcodons.",
      wissen: "Beenden Translation ohne Aminosäure. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:pbs:8",
      prompt: "Was bewirkt Wann oder wie?",
      answer: "Sie kennzeichnet die Wann/wie stark ein Gen abgelesen wird.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Genregulation grob.",
      wissen: "Wann/wie stark ein Gen abgelesen wird. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Wann/wie"],
    },
    {
      concept: "bio:gk11:pbs:9",
      prompt: "Woran erkennt man 9?",
      answer: "Es bezeichnet das Protein und Das Transkription beeinflusst.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Transkriptionsfaktor.",
      wissen: "Protein, das Transkription beeinflusst. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:pbs:10",
      prompt: "Zentrale Dogma grob?",
      answer: "Es beschreibt den Vorgang Zusammenhang DNA → RNA → Protein (mit Ausnahmen).",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Zentrale Dogma grob.",
      wissen: "DNA → RNA → Protein (mit Ausnahmen). Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:gk11:pbs:p:1", term: "Transkription", meaning: "Kennzeichnet die DNA zu mRNA", wissen: "Kern oft. Transkription bedeutet: Kennzeichnet die DNA zu mRNA." },
    { concept: "bio:gk11:pbs:p:2", term: "Translation", meaning: "Bezeichnet die MRNA zu Protein", wissen: "Ribosom. Translation bedeutet: Bezeichnet die MRNA zu Protein." },
    { concept: "bio:gk11:pbs:p:3", term: "Codon", meaning: "Beschreibt das Triplett", wissen: "Code. Codon bedeutet: Beschreibt das Triplett." },
    { concept: "bio:gk11:pbs:p:4", term: "Antikodon", meaning: "Steht für das TRNAPassungg", wissen: "Basen. Antikodon bedeutet: Steht für das TRNAPassungg." },
    { concept: "bio:gk11:pbs:p:5", term: "tRNA", meaning: "Beschreibt den Aminosäureträger", wissen: "Adapter. tRNA bedeutet: Beschreibt den Aminosäureträger." },
    { concept: "bio:gk11:pbs:p:6", term: "mRNA", meaning: "Kennzeichnet das Boten-RNA", wissen: "Vorlage. mRNA bedeutet: Kennzeichnet das Boten-RNA." },
    { concept: "bio:gk11:pbs:p:7", term: "Ribosom", meaning: "Steht für die Proteinmaschine", wissen: "rRNA+Protein. Ribosom bedeutet: Kennzeichnet die Translation." },
    { concept: "bio:gk11:pbs:p:8", term: "Startcodon", meaning: "Kennzeichnet das AUG", wissen: "Start. Startcodon bedeutet: Kennzeichnet das AUG." },
    { concept: "bio:gk11:pbs:p:9", term: "Stoppcodon", meaning: "Beschreibt die Ende", wissen: "Release. Stoppcodon bedeutet: Beschreibt die Ende." },
    { concept: "bio:gk11:pbs:p:10", term: "Genregulation", meaning: "Kennzeichnet die Steuerung", wissen: "Expression. Genregulation bedeutet: Kennzeichnet die Steuerung." },
  ],
}

const gk11Genreg: BioBank = {
  quelle: "Wikipedia: Genregulation",
  url: "https://de.wikipedia.org/wiki/Genregulation",
  conceptPrefix: "bio:gk11:genreg",
  facts: [
    { concept: "bio:gk11:genreg:1", prompt: "Warum Genregulation?", answer: "Es steht für den Zellen nutzen nur benötigte Gene.", wrong: ["Es steht für die Alle Gene immer maximal an.", "Es steht für die Keine Transkription je.", "Es handelt sich um die Nur bei Bakterien unnötig."],
      explanation: "Warum Genregulation.",
      wissen: "Zellen nutzen nur benötigte Gene. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:genreg:2",
      prompt: "Wozu dient Kann?",
      answer: "Es beschreibt das Promotorelement für Transkriptionsstart (Eukaryoten).",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "TATA-Box grob.",
      wissen: "Promotorelement für Transkriptionsstart (Eukaryoten). Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:genreg:3",
      prompt: "Wozu dient Kann?",
      answer: "Es reguliert Ablesen von Genen; es handelt sich um das Es reguliert Ablesen von Genen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Transkriptionsfaktor.",
      wissen: "Reguliert Ablesen von Genen. Fachlich themenspezifisch einordnen.",
    },
    { concept: "bio:gk11:genreg:4", prompt: "Was bewirkt Kann?", answer: "Es steht für das Kann Gene epigenetisch stilllegen.", wrong: ["Es steht für das Löscht immer Chromosomen.", "Es erhöht immer Expression zwingend.", "Es handelt sich um die Nur bei RNA."],
      explanation: "Methylierung DNA.",
      wissen: "Kann Gene epigenetisch stilllegen. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Kann"],
    },
    {
      concept: "bio:gk11:genreg:5",
      prompt: "Was bewirkt Gemeinsam?",
      answer: "Es steht für den vererbbare Expressionsmuster ohne DNA-Sequenzänderung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Epigenetik.",
      wissen: "Vererbbare Expressionsmuster ohne DNA-Sequenzänderung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:genreg:6",
      prompt: "Wozu dient Gemeinsam?",
      answer: "Es ist die DNA-Elemente und die Transkription verstärken können.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Enhancer.",
      wissen: "DNA-Elemente, die Transkription verstärken können. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:genreg:7",
      prompt: "Was bewirkt Gemeinsam?",
      answer: "Es bezeichnet das Introns entfernen und Exons verbinden.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Spleißen.",
      wissen: "Introns entfernen, Exons verbinden. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:genreg:8",
      prompt: "Wozu dient Gemeinsam?",
      answer: "Es beschreibt die gemeinsam regulierte Gene.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Operon (Prokaryoten).",
      wissen: "Gemeinsam regulierte Gene. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Gemeinsam"],
    },
    {
      concept: "bio:gk11:genreg:9",
      prompt: "Was beschreibt 9?",
      answer: "Es steht für die unterschiedliche Genprogramme in Zelltypen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Differenzierung.",
      wissen: "Unterschiedliche Genprogramme in Zelltypen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:genreg:10",
      prompt: "Was kennzeichnet 10?",
      answer: "Es ist die Zugänglichkeit der DNA beeinflusst Expression.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Chromatinstruktur.",
      wissen: "Zugänglichkeit der DNA beeinflusst Expression. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:gk11:genreg:p:1", term: "Promotor", meaning: "Kennzeichnet die Startregion", wissen: "Transkription. Promotor bedeutet: Beschreibt die RNA-Pol-Bindung." },
    { concept: "bio:gk11:genreg:p:2", term: "TATA-Box", meaning: "Kennzeichnet das Promotorelement", wissen: "Eukaryoten. TATA-Box bedeutet: Kennzeichnet das Promotorelement." },
    { concept: "bio:gk11:genreg:p:3", term: "Transkriptionsfaktor", meaning: "Beschreibt den Regulatorprotein", wissen: "Bindung. Transkriptionsfaktor bedeutet: Beschreibt den Regulatorprotein." },
    { concept: "bio:gk11:genreg:p:4", term: "Methylierung", meaning: "Steht für die Epigenetik", wissen: "Stummschaltung oft. Methylierung bedeutet: Steht für die Epigenetik." },
    { concept: "bio:gk11:genreg:p:5", term: "Epigenom", meaning: "Steht für den Regulationsmuster", wissen: "Ohne Sequenzwechsel. Epigenom bedeutet: Steht für den Regulationsmuster." },
    { concept: "bio:gk11:genreg:p:6", term: "Enhancer", meaning: "Beschreibt den Verstärker", wissen: "DNA-Element. Enhancer bedeutet: Beschreibt den Verstärker." },
    { concept: "bio:gk11:genreg:p:7", term: "Spleißen", meaning: "Steht für die Intron-Entfernung", wissen: "mRNA-Reifung. Spleißen bedeutet: Kennzeichnet das MRNAReifungg." },
    { concept: "bio:gk11:genreg:p:8", term: "Operon", meaning: "Steht für den Gencluster", wissen: "Prokaryoten. Operon bedeutet: Steht für den Gencluster." },
    { concept: "bio:gk11:genreg:p:9", term: "Differenzierung", meaning: "Steht für die Zellspezialisierung", wissen: "Genprogramm. Differenzierung bedeutet: Steht für die Gewebe." },
    { concept: "bio:gk11:genreg:p:10", term: "Chromatin", meaning: "Steht für das DNA+Protein", wissen: "Zugänglichkeit. Chromatin bedeutet: Steht für die Packung." },
  ],
}

const gk11Mikroskop: BioBank = {
  quelle: "Wikipedia: Lichtmikroskop",
  url: "https://de.wikipedia.org/wiki/Lichtmikroskop",
  conceptPrefix: "bio:gk11:mikro",
  facts: [
    {
      concept: "bio:gk11:mikro:1",
      prompt: "Wozu dient Licht?",
      answer: "Es dient als Zellen/Gewebe/Organe strukturell untersuchen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Ziel mikroskopisches Praktikum.",
      wissen: "Zellen/Gewebe/Organe strukturell untersuchen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:mikro:2",
      prompt: "Was bewirkt Licht?",
      answer: "Es kennzeichnet den Kleinsten noch trennbarer Abstand.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Auflösung grob.",
      wissen: "Kleinster noch trennbarer Abstand. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:mikro:3",
      prompt: "Was bewirkt Licht?",
      answer: "Es steht für das Verhältnis scheinbare/reale Größe.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Vergrößerung.",
      wissen: "Verhältnis scheinbare/reale Größe. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:mikro:4",
      prompt: "Was bewirkt Licht?",
      answer: "Es kennzeichnet das Licht muss durchtreten; Strukturen erkennbar.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Präparat dünn warum.",
      wissen: "Licht muss durchtreten; Strukturen erkennbar. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Licht"],
    },
    {
      concept: "bio:gk11:mikro:5",
      prompt: "Was bewirkt Verschiedene?",
      answer: "Sie steht für die Kontrast bestimmter Strukturen.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Färbung hilft.",
      wissen: "Kontrast bestimmter Strukturen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:mikro:6",
      prompt: "Was bewirkt Verschiedene?",
      answer: "Sie kennzeichnet die Gewebe = Verband gleicher/ähnlicher Zellen.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Zelle vs. Gewebe.",
      wissen: "Gewebe = Verband gleicher/ähnlicher Zellen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:mikro:7",
      prompt: "Was bewirkt Verschiedene?",
      answer: "Sie kennzeichnet den mehreren Geweben mit gemeinsamer Funktion.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Organ aus.",
      wissen: "Mehreren Geweben mit gemeinsamer Funktion. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:mikro:8",
      prompt: "Wozu dient die Verschiedene?",
      answer: "Sie bezeichnet die Verschiedene Ebenen zeigen verschiedene Ansichten.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Schnittebene beachten.",
      wissen: "Verschiedene Ebenen zeigen verschiedene Ansichten. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Verschiedene"],
    },
    {
      concept: "bio:gk11:mikro:9",
      prompt: "Woran erkennt man 9?",
      answer: "Es beschreibt die Herstellungsbedingte Täuschung im Bild.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Artefakt.",
      wissen: "Herstellungsbedingte Täuschung im Bild. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:mikro:10",
      prompt: "Woran erkennt man 10?",
      answer: "Es beschreibt das Zeichnung/Foto mit Maßstab und Beschriftung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Dokumentation.",
      wissen: "Zeichnung/Foto mit Maßstab und Beschriftung. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:gk11:mikro:p:1", term: "Auflösung", meaning: "Bezeichnet die Trennschärfe", wissen: "Limit. Auflösung bedeutet: Bezeichnet die Trennschärfe." },
    { concept: "bio:gk11:mikro:p:2", term: "Vergrößerung", meaning: "Steht für die Größenverhältnis", wissen: "Objektiv×Okular. Vergrößerung bedeutet: Steht für die Größenverhältnis." },
    { concept: "bio:gk11:mikro:p:3", term: "Präparat", meaning: "Bezeichnet das Untersuchungsobjekt", wissen: "Dünn. Präparat bedeutet: Bezeichnet das Untersuchungsobjekt." },
    { concept: "bio:gk11:mikro:p:4", term: "Färbung", meaning: "Kennzeichnet die Kontrast", wissen: "Selektiv. Färbung bedeutet: Kennzeichnet die Kontrast." },
    { concept: "bio:gk11:mikro:p:5", term: "Gewebe", meaning: "Steht für die Zellverband", wissen: "Funktion. Gewebe bedeutet: Steht für die Zellverband." },
    { concept: "bio:gk11:mikro:p:6", term: "Organ", meaning: "Bezeichnet den Gewebeverbund", wissen: "Aufgabe. Organ bedeutet: Bezeichnet den Gewebeverbund." },
    { concept: "bio:gk11:mikro:p:7", term: "Schnittebene", meaning: "Steht für die Ansicht", wissen: "3D-Rekonstruktion. Schnittebene bedeutet: Steht für die Ansicht." },
    { concept: "bio:gk11:mikro:p:8", term: "Artefakt", meaning: "Beschreibt die Täuschung", wissen: "Vorsicht. Artefakt bedeutet: Beschreibt die Täuschung." },
    { concept: "bio:gk11:mikro:p:9", term: "Maßstab", meaning: "Bezeichnet das Größenbezug", wissen: "Dokumentation. Maßstab bedeutet: Bezeichnet das Größenbezug." },
    { concept: "bio:gk11:mikro:p:10", term: "Okular", meaning: "Beschreibt die Sehlinse", wissen: "Vergrößerung. Okular bedeutet: Beschreibt die Sehlinse." },
  ],
}

const gk11Faktoren: BioBank = {
  quelle: "Wikipedia: Umweltfaktor",
  url: "https://de.wikipedia.org/wiki/Umweltfaktor",
  conceptPrefix: "bio:gk11:fak",
  facts: [
    {
      concept: "bio:gk11:fak:1",
      prompt: "Was bewirkt Beziehungen?",
      answer: "Es umfasst Unbelebte Umwelteinflüsse (Licht und T und Wasser und PH…).",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Abiotische Faktoren.",
      wissen: "Unbelebte Umwelteinflüsse (Licht, T, Wasser, pH…). Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:fak:2",
      prompt: "Wozu dient Beziehungen?",
      answer: "Es bezeichnet die Einflüsse durch Lebewesen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Biotische Faktoren.",
      wissen: "Einflüsse durch Lebewesen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:fak:3",
      prompt: "Wozu dient Beziehungen?",
      answer: "Es bezeichnet die Ansprüche und Rolle einer Art.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Ökologische Nische.",
      wissen: "Ansprüche und Rolle einer Art. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:fak:4",
      prompt: "Was bewirkt Beziehungen?",
      answer: "Es steht für den Beziehungen innerhalb einer Art.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Intraspezifisch.",
      wissen: "Beziehungen innerhalb einer Art. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Beziehungen"],
    },
    {
      concept: "bio:gk11:fak:5",
      prompt: "Woran erkennt man 5?",
      answer: "Es bezeichnet den Beziehungen zwischen Arten.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Interspezifisch.",
      wissen: "Beziehungen zwischen Arten. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:fak:6",
      prompt: "Wozu dient Begrenzender?",
      answer: "Er beschreibt den Vorgang Vorgang Vorgang Ähnliche Nischen → eine Art verdrängt oft.",
      wrong: [
        "Er betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Konkurrenzausschluss grob.",
      wissen: "Ähnliche Nischen → eine Art verdrängt oft. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:fak:7",
      prompt: "Wozu dient Begrenzender?",
      answer: "Er bezeichnet den Leistungs-/Überlebensbereich entlang eines Faktors.",
      wrong: [
        "Er betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Toleranzkurve.",
      wissen: "Leistungs-/Überlebensbereich entlang eines Faktors. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:fak:8",
      prompt: "Wozu dient Begrenzender?",
      answer: "Er beschreibt den Begrenzenden Faktor limitiert.",
      wrong: [
        "Er betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Minimumgesetz grob.",
      wissen: "Begrenzender Faktor limitiert. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Begrenzender"],
    },
    {
      concept: "bio:gk11:fak:9",
      prompt: "Bioindikator?",
      answer: "Es beschreibt das Art zeigt Umweltzustand an.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Bioindikator.",
      wissen: "Art zeigt Umweltzustand an. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:fak:10",
      prompt: "Welche Rolle hat 10?",
      answer: "Es kennzeichnet das Ort vs. funktionelle Ansprüche/Rolle.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Habitat vs. Nische.",
      wissen: "Ort vs. funktionelle Ansprüche/Rolle. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:gk11:fak:p:1", term: "Abiotisch", meaning: "Beschreibt das Unbelebt", wissen: "Faktor. Abiotisch bedeutet: Beschreibt das Unbelebt." },
    { concept: "bio:gk11:fak:p:2", term: "Biotisch", meaning: "Dient als Durch Organismen", wissen: "Beziehung. Biotisch bedeutet: Dient als Durch Organismen." },
    { concept: "bio:gk11:fak:p:3", term: "Nische", meaning: "Beschreibt die Rolle/Ansprüche", wissen: "Ökologie. Nische bedeutet: Beschreibt die Rolle/Ansprüche." },
    { concept: "bio:gk11:fak:p:4", term: "Habitat", meaning: "Beschreibt das Lebensort", wissen: "Raum. Habitat bedeutet: Bezeichnet das z. B. Quellen. B. Quellen." },
    { concept: "bio:gk11:fak:p:5", term: "Konkurrenz", meaning: "Beschreibt die Ressourcenstreit", wissen: "Intra/Inter. Konkurrenz bedeutet: Beschreibt die Ressourcenstreit." },
    { concept: "bio:gk11:fak:p:6", term: "Toleranz", meaning: "Kennzeichnet die Erträglichkeit", wissen: "Kurve. Toleranz bedeutet: Kennzeichnet die Erträglichkeit." },
    { concept: "bio:gk11:fak:p:7", term: "Minimumfaktor", meaning: "Begrenzt", wissen: "Liebig. Minimumfaktor bedeutet: Begrenzt." },
    { concept: "bio:gk11:fak:p:8", term: "Bioindikator", meaning: "Steht für den Anzeigeart", wissen: "Umwelt. Bioindikator bedeutet: Steht für den Anzeigeart." },
    { concept: "bio:gk11:fak:p:9", term: "Prädation", meaning: "Bezeichnet die Räuber-Beute", wissen: "Inter. Prädation bedeutet: Bezeichnet die Räuber-Beute." },
    { concept: "bio:gk11:fak:p:10", term: "Symbiose", meaning: "Bezeichnet die enges Zusammenleben", wissen: "Vorteil oft. Symbiose bedeutet: Kennzeichnet das Knöllchen." },
  ],
}

const gk11Schaedlinge: BioBank = {
  quelle: "Wikipedia: Schädlingsbekämpfung",
  url: "https://de.wikipedia.org/wiki/Sch%C3%A4dlingsbek%C3%A4mpfung",
  conceptPrefix: "bio:gk11:schaed",
  facts: [
    {
      concept: "bio:gk11:schaed:1",
      prompt: "Was kennzeichnet 1?",
      answer: "Es steht für die Geringe Vielfalt; anfälliger für Schädlinge/Krankheiten.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Problem Monokultur.",
      wissen: "Geringe Vielfalt; anfälliger für Schädlinge/Krankheiten. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:schaed:2",
      prompt: "Wozu dient die Kombinierte?",
      answer: "Sie dient als Resistenz, Nichtzielorganismen, Rückstände.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Chemische Bekämpfung Risiko.",
      wissen: "Resistenz, Nichtzielorganismen, Rückstände. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:schaed:3",
      prompt: "Was bewirkt Kombinierte?",
      answer: "Sie steht für den Nützlinge/Antagonisten einsetzen.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Biologische Bekämpfung.",
      wissen: "Nützlinge/Antagonisten einsetzen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:schaed:4",
      prompt: "Was bewirkt Kombinierte?",
      answer: "Sie kennzeichnet die Kombinierte und schwellenorientierte Maßnahmen.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Integrierter Pflanzenschutz.",
      wissen: "Kombinierte, schwellenorientierte Maßnahmen. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Kombinierte"],
    },
    {
      concept: "bio:gk11:schaed:5",
      prompt: "Woran erkennt man 5?",
      answer: "Es steht für das Habitatverlust und Pestizide und Intensivierung u. a.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Insektensterben Ursachen grob.",
      wissen: "Habitatverlust, Pestizide, Intensivierung u. a. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:schaed:6",
      prompt: "Warum Vielfalt hilft?",
      answer: "Es steht für den Puffen gegen Ausfälle und Schädlinge.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum Vielfalt hilft.",
      wissen: "Puffer gegen Ausfälle und Schädlinge. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:schaed:7",
      prompt: "Wozu dient die Bekämpfung?",
      answer: "Sie beschreibt die Unterbricht Schädlings- und Krankheitszyklen.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Fruchtfolge Vorteil.",
      wissen: "Unterbricht Schädlings- und Krankheitszyklen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:schaed:8",
      prompt: "Was bewirkt Bekämpfung?",
      answer: "Sie kennzeichnet die Bekämpfung erst ab wirtschaftlichem Schaden.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Schwellenwert.",
      wissen: "Bekämpfung erst ab wirtschaftlichem Schaden. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Bekämpfung"],
    },
    {
      concept: "bio:gk11:schaed:9",
      prompt: "Was kennzeichnet 9?",
      answer: "Es beschreibt die Wirkstoffe wechseln/reduzieren und Nicht überdosieren.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Resistenzmanagement.",
      wissen: "Wirkstoffe wechseln/reduzieren, nicht überdosieren. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:schaed:10",
      prompt: "Woran erkennt man 10?",
      answer: "Es steht für die Bestäubung und Gegenspieler und Zersetzer.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Ökosystemdienst Insekten.",
      wissen: "Bestäubung, Gegenspieler, Zersetzer. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:gk11:schaed:p:1", term: "Monokultur", meaning: "Bezeichnet die Art großflächig", wissen: "Risiko. Monokultur bedeutet: Beschreibt die Kultur." },
    { concept: "bio:gk11:schaed:p:2", term: "Nützling", meaning: "Bezeichnet den Gegenspieler", wissen: "Biologisch. Nützling bedeutet: Bezeichnet den Gegenspieler." },
    { concept: "bio:gk11:schaed:p:3", term: "Pestizid", meaning: "Steht für die chemische Bekämpfung", wissen: "Nebenwirkungen. Pestizid bedeutet: Steht für die chemische Bekämpfung." },
    { concept: "bio:gk11:schaed:p:4", term: "Resistenz", meaning: "Kennzeichnet die Unempfindlichkeit", wissen: "Selektion. Resistenz bedeutet: Beschreibt die Unempfindlich." },
    { concept: "bio:gk11:schaed:p:5", term: "Fruchtfolge", meaning: "Bezeichnet die wechselnde Kulturen", wissen: "Unterbruch. Fruchtfolge bedeutet: Bezeichnet den Wechsel." },
    { concept: "bio:gk11:schaed:p:6", term: "Schwelle", meaning: "Beschreibt die Eingriffsgrenze", wissen: "IPS. Schwelle bedeutet: Kennzeichnet die Auslösewert." },
    { concept: "bio:gk11:schaed:p:7", term: "Bestäubung", meaning: "Beschreibt die Ökosystemdienst", wissen: "Ertrag. Bestäubung bedeutet: Beschreibt die Ökosystemdienst." },
    { concept: "bio:gk11:schaed:p:8", term: "Habitatverlust", meaning: "Steht für das Lebensraumschwund", wissen: "Insekten. Habitatverlust bedeutet: Steht für das Lebensraumschwund." },
    { concept: "bio:gk11:schaed:p:9", term: "IPS", meaning: "Steht für den integrierten Schutz", wissen: "Kombiniert. IPS bedeutet: Beschreibt das Integriert." },
    { concept: "bio:gk11:schaed:p:10", term: "Biodiversität", meaning: "Beschreibt die Vielfalt", wissen: "Stabilität. Biodiversität bedeutet: Beschreibt die Vielfalt." },
  ],
}

const gk11Naturschutz: BioBank = {
  quelle: "Wikipedia: Naturschutz",
  url: "https://de.wikipedia.org/wiki/Naturschutz",
  conceptPrefix: "bio:gk11:naturschutz",
  facts: [
    {
      concept: "bio:gk11:naturschutz:1",
      prompt: "Was beschreibt 1?",
      answer: "Es steht für den Arten und Lebensräume und Prozesse erhalten.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Ziel Naturschutz.",
      wissen: "Arten, Lebensräume und Prozesse erhalten. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:naturschutz:2",
      prompt: "Wozu dient die Wiederherstellung?",
      answer: "Sie beschreibt den Vorgang Vorgang Vorgang Mehr Treibhausgase → mehr Wärmerückhaltung.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Treibhauseffekt verstärkt.",
      wissen: "Mehr Treibhausgase → mehr Wärmerückhaltung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:naturschutz:3",
      prompt: "Was bewirkt Wiederherstellung?",
      answer: "Sie steht für die Gezielte Steuerung für Erhalt/Nutzung.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Ökosystemmanagement.",
      wissen: "Gezielte Steuerung für Erhalt/Nutzung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:naturschutz:4",
      prompt: "Wozu dient die Wiederherstellung?",
      answer: "Sie bezeichnet die Wiederherstellung naturnäherer Zustände.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Renaturierung.",
      wissen: "Wiederherstellung naturnäherer Zustände. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Wiederherstellung"],
    },
    {
      concept: "bio:gk11:naturschutz:5",
      prompt: "Woran erkennt man 5?",
      answer: "Es beschreibt das Rückzugsraum und Prozessschutz.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Schutzgebiet Zweck.",
      wissen: "Rückzugsraum und Prozessschutz. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:naturschutz:6",
      prompt: "Was bewirkt Abwägung?",
      answer: "Sie steht für die Nutzung vs. Schutz.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Nachhaltige Nutzung.",
      wissen: "Nutzung ohne Substanzverlust langfristig. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:naturschutz:7",
      prompt: "Was bewirkt Abwägung?",
      answer: "Sie steht für die Nutzung vs. Schutz.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Gesetzlicher Rahmen grob.",
      wissen: "Regeln zu Schutz und Eingriffen (u. a. landesspezifisch). Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:naturschutz:8",
      prompt: "Was bewirkt Abwägung?",
      answer: "Sie steht für die Nutzung vs. Schutz.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Konflikt Nutzung–Schutz.",
      wissen: "Abwägung ökonomischer und ökologischer Ziele. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Abwägung"],
    },
    {
      concept: "bio:gk11:naturschutz:9",
      prompt: "Woran erkennt man 9?",
      answer: "Es bezeichnet den Beobachten von Beständen und Zuständen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Monitoring.",
      wissen: "Beobachten von Beständen und Zuständen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk11:naturschutz:10",
      prompt: "Warum lokal handeln?",
      answer: "Es beschreibt die Viele Maßnahmen wirken vor Ort (Biotop und Arten).",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum lokal handeln.",
      wissen: "Viele Maßnahmen wirken vor Ort (Biotop, Arten). Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:gk11:naturschutz:p:1", term: "Naturschutz", meaning: "Kennzeichnet das Erhalt der Natur", wissen: "Ziel. Naturschutz bedeutet: Kennzeichnet das Erhalt der Natur." },
    { concept: "bio:gk11:naturschutz:p:2", term: "Schutzgebiet", meaning: "Kennzeichnet den geschützten Raum", wissen: "Rückzug. Schutzgebiet bedeutet: Bezeichnet das Reservat." },
    { concept: "bio:gk11:naturschutz:p:3", term: "Renaturierung", meaning: "Steht für die Wiederherstellung", wissen: "Maßnahmen. Renaturierung bedeutet: Steht für die Wiederherstellung." },
    { concept: "bio:gk11:naturschutz:p:4", term: "Treibhauseffekt", meaning: "Kennzeichnet die Wärmerückhaltung", wissen: "Klima. Treibhauseffekt bedeutet: Kennzeichnet die Wärmerückhaltung." },
    { concept: "bio:gk11:naturschutz:p:5", term: "Management", meaning: "Bezeichnet die Steuerung", wissen: "Ökosystem. Management bedeutet: Bezeichnet die Steuerung." },
    { concept: "bio:gk11:naturschutz:p:6", term: "Nachhaltigkeit", meaning: "Bezeichnet die Langfristigkeit", wissen: "Nutzung. Nachhaltigkeit bedeutet: Bezeichnet die Langfristigkeit." },
    { concept: "bio:gk11:naturschutz:p:7", term: "Monitoring", meaning: "Steht für die Überwachung", wissen: "Daten. Monitoring bedeutet: Kennzeichnet die Kontrolle." },
    { concept: "bio:gk11:naturschutz:p:8", term: "Biotopschutz", meaning: "Beschreibt das Lebensraumschutz", wissen: "Lokal. Biotopschutz bedeutet: Beschreibt das Lebensraumschutz." },
    { concept: "bio:gk11:naturschutz:p:9", term: "Artenschutz", meaning: "Bezeichnet den Arten erhalten", wissen: "Maßnahmen. Artenschutz bedeutet: Bezeichnet den Arten erhalten." },
    { concept: "bio:gk11:naturschutz:p:10", term: "Abwägung", meaning: "Steht für die Nutzung vs. Schutz", wissen: "Politik/Ethik. Abwägung bedeutet: Steht für die Nutzung vs. Schutz. Schutz. Schutz. Schutz. Schutz." },
  ],
}

const gk12Human: BioBank = {
  quelle: "Wikipedia: Humangenetik",
  url: "https://de.wikipedia.org/wiki/Humangenetik",
  conceptPrefix: "bio:gk12:human",
  facts: [
    {
      concept: "bio:gk12:human:1",
      prompt: "Was bewirkt Basenfolge?",
      answer: "Sie steht für den Vererbungsmusten in Familien rekonstruieren.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Stammbaumanalyse.",
      wissen: "Vererbungsmuster in Familien rekonstruieren. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:human:2",
      prompt: "Wozu dient die Basenfolge?",
      answer: "Sie bezeichnet die DNA-Abschnitte vervielfältigen.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "PCR Zweck.",
      wissen: "DNA-Abschnitte vervielfältigen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:human:3",
      prompt: "Was bewirkt Basenfolge?",
      answer: "Sie kennzeichnet die DNA-Fragmente nach Größe trennen.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Gelelektrophorese.",
      wissen: "DNA-Fragmente nach Größe trennen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:human:4",
      prompt: "Was bewirkt Basenfolge?",
      answer: "Sie kennzeichnet die Basenfolge bestimmen.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Sequenzierung.",
      wissen: "Basenfolge bestimmen. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Basenfolge"],
    },
    {
      concept: "bio:gk12:human:5",
      prompt: "Was beschreibt 5?",
      answer: "Es ist die Untersuchung vor der Geburt.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Pränatale Diagnostik.",
      wissen: "Untersuchung vor der Geburt. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:human:6",
      prompt: "Was bewirkt Erkrankung?",
      answer: "Sie kennzeichnet die Chromosomensatz bildlich dargestellt.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Karyogramm.",
      wissen: "Chromosomensatz bildlich dargestellt. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:human:7",
      prompt: "Wozu dient die Erkrankung?",
      answer: "Sie bezeichnet die Informierte Entscheidung und Nicht-Bevormundung.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Ethikfrage.",
      wissen: "Informierte Entscheidung und Nicht-Bevormundung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:human:8",
      prompt: "Was bewirkt Erkrankung?",
      answer: "Sie steht für die Erkrankung mit genetischer Ursache.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Erbkrankheit.",
      wissen: "Erkrankung mit genetischer Ursache. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Erkrankung"],
    },
    {
      concept: "bio:gk12:human:9",
      prompt: "Woran erkennt man 9?",
      answer: "Es steht für den Allelträgen ohne eigenen Phänotyp oft.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Carrier-Status.",
      wissen: "Allelträger ohne eigenen Phänotyp oft. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:human:10",
      prompt: "Was kennzeichnet 10?",
      answer: "Es kennzeichnet den Methodengrenzen und Aussagekraft einschätzen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum Technikkenntnis.",
      wissen: "Methodengrenzen und Aussagekraft einschätzen. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:gk12:human:p:1", term: "Stammbaum", meaning: "Beschreibt die Familienanalyse", wissen: "Vererbung. Stammbaum bedeutet: Beschreibt die Verwandtschaftshypothese." },
    { concept: "bio:gk12:human:p:2", term: "PCR", meaning: "Kennzeichnet die Vervielfältigung", wissen: "DNA. PCR bedeutet: Beschreibt die Amplifikation." },
    { concept: "bio:gk12:human:p:3", term: "Elektrophorese", meaning: "Bezeichnet die Trennung", wissen: "Größe. Elektrophorese bedeutet: Bezeichnet die Trennung." },
    { concept: "bio:gk12:human:p:4", term: "Sequenzierung", meaning: "Beschreibt die Basenfolge", wissen: "Lesung. Sequenzierung bedeutet: Beschreibt die Basenfolge." },
    { concept: "bio:gk12:human:p:5", term: "Karyogramm", meaning: "Bezeichnet das Chromosomenbild", wissen: "Anzahl/Struktur. Karyogramm bedeutet: Bezeichnet den Chromosomen." },
    { concept: "bio:gk12:human:p:6", term: "Diagnostik", meaning: "Steht für die Untersuchung", wissen: "Info. Diagnostik bedeutet: Beschreibt die Nachweis." },
    { concept: "bio:gk12:human:p:7", term: "Carrier", meaning: "Beschreibt den Träger", wissen: "Oft unauffällig. Carrier bedeutet: Beschreibt den Binder." },
    { concept: "bio:gk12:human:p:8", term: "Ethik", meaning: "Steht für den Wertefragen", wissen: "Aufklärung. Ethik bedeutet: Steht für den Wertefragen." },
    { concept: "bio:gk12:human:p:9", term: "Mutation", meaning: "Bezeichnet die Sequenzänderung", wissen: "Ursache möglich. Mutation bedeutet: Steht für die Erbgut." },
    { concept: "bio:gk12:human:p:10", term: "Beratung", meaning: "Dient als Entscheidungshilfe", wissen: "Nicht Zwang. Beratung bedeutet: Beschreibt die Aufklärung." },
  ],
}

const gk12Gentherapie: BioBank = {
  quelle: "Wikipedia: Gentherapie",
  url: "https://de.wikipedia.org/wiki/Gentherapie",
  conceptPrefix: "bio:gk12:genther",
  facts: [
    {
      concept: "bio:gk12:genther:1",
      prompt: "Was beschreibt 1?",
      answer: "Es kennzeichnet das Eingriff in Körperzellen und Nicht Keimbahn.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Somatische Gentherapie.",
      wissen: "Eingriff in Körperzellen, nicht Keimbahn. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:genther:2",
      prompt: "Was bewirkt Rechtliche oder ethische?",
      answer: "Sie kennzeichnet die vererbbare Änderungen; ethisch hochproblematisch.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Keimbahntherapie Problem.",
      wissen: "Vererbbare Änderungen; ethisch hochproblematisch. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:genther:3",
      prompt: "Was bewirkt Rechtliche oder ethische?",
      answer: "Sie kennzeichnet den Können sich differenzieren; therapeutisches Potenzial/Risiken.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Stammzellen.",
      wissen: "Können sich differenzieren; therapeutisches Potenzial/Risiken. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:genther:4",
      prompt: "Wozu dienen Rechtliche oder ethische?",
      answer: "Sie bezeichnet den rechtliche/ethische Grenzen früher Embryonen.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Embryonenschutz.",
      wissen: "Rechtliche/ethische Grenzen früher Embryonen. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Rechtliche/ethische"],
    },
    {
      concept: "bio:gk12:genther:5",
      prompt: "Was beschreibt 5?",
      answer: "Es beschreibt die Präimplantationsdiagnostik an Embryonen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "PID grob.",
      wissen: "Präimplantationsdiagnostik an Embryonen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:genther:6",
      prompt: "Was bewirkt Therapie?",
      answer: "Sie kennzeichnet den Trägen zum Einschleusen von Genen (Virus/Plasmid).",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Vektor.",
      wissen: "Träger zum Einschleusen von Genen (Virus/Plasmid). Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:genther:7",
      prompt: "Was bewirkt Therapie?",
      answer: "Sie kennzeichnet die Fehlinsertion und Immunreaktion und Off-Target.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Risiko Gentherapie.",
      wissen: "Fehlinsertion, Immunreaktion, Off-Target. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:genther:8",
      prompt: "Wozu dient die Therapie?",
      answer: "Sie bezeichnet die Therapie angepasst an genetisches Profil.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Personalisierte Medizin.",
      wissen: "Therapie angepasst an genetisches Profil. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Therapie"],
    },
    {
      concept: "bio:gk12:genther:9",
      prompt: "Was beschreibt 9?",
      answer: "Es beschreibt den Nutzen und Risiken und Alternativen erklären.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Aufklärungspflicht.",
      wissen: "Nutzen, Risiken, Alternativen erklären. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:genther:10",
      prompt: "Woran erkennt man 10?",
      answer: "Es kennzeichnet den Chancen vs. Diskriminierung/Selektion.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Gesellschaftliche Debatte.",
      wissen: "Chancen vs. Diskriminierung/Selektion. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:gk12:genther:p:1", term: "Gentherapie", meaning: "Kennzeichnet die Genkorrektur/-ersatz", wissen: "Therapie. Gentherapie bedeutet: Beschreibt die Heilansatz." },
    { concept: "bio:gk12:genther:p:2", term: "Somatisch", meaning: "Kennzeichnet den Körperzellen", wissen: "Nicht vererbt. Somatisch bedeutet: Kennzeichnet den Körperzellen." },
    { concept: "bio:gk12:genther:p:3", term: "Keimbahn", meaning: "Kennzeichnet den Keimzellen", wissen: "Vererbbar. Keimbahn bedeutet: Kennzeichnet den Keimzellen." },
    { concept: "bio:gk12:genther:p:4", term: "Vektor", meaning: "Kennzeichnet den Genträger", wissen: "Virus/Plasmid. Vektor bedeutet: Kennzeichnet den Träger." },
    { concept: "bio:gk12:genther:p:5", term: "Stammzelle", meaning: "Kennzeichnet die Differenzierbar", wissen: "Potenzial. Stammzelle bedeutet: Kennzeichnet die Potenzial." },
    { concept: "bio:gk12:genther:p:6", term: "PID", meaning: "Bezeichnet die Präimplantation", wissen: "Diagnostik. PID bedeutet: Bezeichnet die Präimplantation." },
    { concept: "bio:gk12:genther:p:7", term: "Embryonenschutz", meaning: "Bezeichnet den Rechtsrahmen", wissen: "Ethik. Embryonenschutz bedeutet: Bezeichnet den Rechtsrahmen." },
    { concept: "bio:gk12:genther:p:8", term: "Off-Target", meaning: "Bezeichnet die Fehlwirkung", wissen: "Risiko. Off-Target bedeutet: Bezeichnet die Fehlwirkung." },
    { concept: "bio:gk12:genther:p:9", term: "Aufklärung", meaning: "Stellt Vernunft und Kritik als Leitideen der Gesellschaft in den Mittelpunkt", wissen: "Pflicht. Aufklärung bedeutet: Stellt Vernunft und Kritik als Leitideen der Gesellschaft in den Mittelpunkt." },
    { concept: "bio:gk12:genther:p:10", term: "Selektion", meaning: "Beschreibt die Auswahl", wissen: "Debatte. Selektion bedeutet: Beschreibt die Gerichtet." },
  ],
}

const gk12Immun: BioBank = {
  quelle: "Wikipedia: Immunsystem",
  url: "https://de.wikipedia.org/wiki/Immunsystem",
  conceptPrefix: "bio:gk12:immun",
  facts: [
    {
      concept: "bio:gk12:immun:1",
      prompt: "Woran erkennt man 1?",
      answer: "Es umfasst Sofort und Breit (Barriere und Phagozytose und Entzündung).",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Unspezifische Abwehr.",
      wissen: "Sofort, breit (Barriere, Phagozytose, Entzündung). Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:immun:2",
      prompt: "Wozu dient Gedächtnis?",
      answer: "Es beschreibt das Antigengerichtet mit Gedächtnis.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Spezifische Abwehr.",
      wissen: "Antigengerichtet mit Gedächtnis. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:immun:3",
      prompt: "Wozu dient Gedächtnis?",
      answer: "Es ist die Proteine und die Antigene binden.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Antikörper.",
      wissen: "Proteine, die Antigene binden. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:immun:4",
      prompt: "Was bewirkt Gedächtnis?",
      answer: "Es steht für das Gedächtnis ohne schwere Erkrankung aufbauen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Impfung Prinzip.",
      wissen: "Gedächtnis ohne schwere Erkrankung aufbauen. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Gedächtnis"],
    },
    {
      concept: "bio:gk12:immun:5",
      prompt: "Wozu dient Durch?",
      answer: "Es ist die Struktur und die Abwehr auslöst/bindet.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Antigen.",
      wissen: "Struktur, die Abwehr auslöst/bindet. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:immun:6",
      prompt: "Was bewirkt Durch?",
      answer: "Es kennzeichnet die erste Begegnung; langsamer.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Primärantwort.",
      wissen: "Erste Begegnung; langsamer. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:immun:7",
      prompt: "Wozu dient Durch?",
      answer: "Es bezeichnet die Erneute Begegnung; schneller/stärker.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Sekundärantwort.",
      wissen: "Erneute Begegnung; schneller/stärker. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:immun:8",
      prompt: "Wozu dient Durch?",
      answer: "Es bezeichnet das Durch Erreger verursacht.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Infektionskrankheit.",
      wissen: "Durch Erreger verursacht. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Durch"],
    },
    {
      concept: "bio:gk12:immun:9",
      prompt: "Was kennzeichnet 9?",
      answer: "Es beschreibt das Abwehr richtet sich gegen Körperstrukturen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Autoimmun grob.",
      wissen: "Abwehr richtet sich gegen Körperstrukturen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:immun:10",
      prompt: "Warum Hygiene + Impfung?",
      answer: "Es kennzeichnet die Übertragung senken und spezifische Abwehr trainieren.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum Hygiene + Impfung.",
      wissen: "Übertragung senken und spezifische Abwehr trainieren. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:gk12:immun:p:1", term: "Unspezifisch", meaning: "Beschreibt das Angeboren/breit", wissen: "Sofort. Unspezifisch bedeutet: Beschreibt das Angeboren/breit." },
    { concept: "bio:gk12:immun:p:2", term: "Spezifisch", meaning: "Bezeichnet den Erworben", wissen: "Gedächtnis. Spezifisch bedeutet: Bezeichnet den Erworben." },
    { concept: "bio:gk12:immun:p:3", term: "Antikörper", meaning: "Bezeichnet den Immunglobulin", wissen: "Bindung. Antikörper bedeutet: Bezeichnet den Immunglobulin." },
    { concept: "bio:gk12:immun:p:4", term: "Antigen", meaning: "Steht für die Erkennungsstruktur", wissen: "Auslöser. Antigen bedeutet: Steht für die Erkennungsstruktur." },
    { concept: "bio:gk12:immun:p:5", term: "Impfung", meaning: "Steht für die Immunisierung", wissen: "Prävention. Impfung bedeutet: Steht für die Immunisierung." },
    { concept: "bio:gk12:immun:p:6", term: "Phagozytose", meaning: "Kennzeichnet den Auffressen", wissen: "Zellen. Phagozytose bedeutet: Kennzeichnet den Auffressen." },
    { concept: "bio:gk12:immun:p:7", term: "Gedächtniszelle", meaning: "Beschreibt die Langzeit", wissen: "Sekundär. Gedächtniszelle bedeutet: Beschreibt die Langzeit." },
    { concept: "bio:gk12:immun:p:8", term: "Erreger", meaning: "Beschreibt den Pathogen", wissen: "Infektion. Erreger bedeutet: Beschreibt den Pathogen." },
    { concept: "bio:gk12:immun:p:9", term: "Entzündung", meaning: "Bezeichnet die Abwehrreaktion", wissen: "Lokal. Entzündung bedeutet: Bezeichnet die Abwehrreaktion." },
    { concept: "bio:gk12:immun:p:10", term: "Autoimmun", meaning: "Bezeichnet die Selbstreaktion", wissen: "Pathologie. Autoimmun bedeutet: Bezeichnet die Selbstreaktion." },
  ],
}

const gk12Neuro: BioBank = {
  quelle: "Wikipedia: Aktionspotenzial",
  url: "https://de.wikipedia.org/wiki/Aktionspotenzial",
  conceptPrefix: "bio:gk12:neuro",
  facts: [
    {
      concept: "bio:gk12:neuro:1",
      prompt: "Was beschreibt 1?",
      answer: "Es ist die Ladungsdifferenz der Membran in Ruhe.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Ruhepotenzial grob.",
      wissen: "Ladungsdifferenz der Membran in Ruhe. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:neuro:2",
      prompt: "Was bewirkt Übergang?",
      answer: "Es kennzeichnet die kurze Umkehr/Depolarisation als Signal.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Aktionspotenzial.",
      wissen: "Kurze Umkehr/Depolarisation als Signal. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:neuro:3",
      prompt: "Wozu dient Übergang?",
      answer: "Es beschreibt die Weitergabe entlang des Axons.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Erregungsleitung.",
      wissen: "Weitergabe entlang des Axons. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:neuro:4",
      prompt: "Wozu dient Übergang?",
      answer: "Es bezeichnet das Übergang mit Transmitter.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Synapse.",
      wissen: "Übergang mit Transmitter. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Übergang"],
    },
    {
      concept: "bio:gk12:neuro:5",
      prompt: "Was bewirkt ein Transmitter an der Synapse?",
      answer: "Sie beschreibt die chemischer Botenstoff.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Transmitter.",
      wissen: "Chemischer Botenstoff. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:neuro:6",
      prompt: "Was bewirkt AP?",
      answer: "Es steht für den Können Transmitterwirkung verändern.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Drogen an Synapsen.",
      wissen: "Können Transmitterwirkung verändern. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:neuro:7",
      prompt: "Was bewirkt AP?",
      answer: "Es steht für die Reizstärke für AP-Auslösung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Schwellenwert.",
      wissen: "Reizstärke für AP-Auslösung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:neuro:8",
      prompt: "Was bewirkt AP?",
      answer: "Es steht für das AP entsteht voll oder nicht.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Alles-oder-nichts.",
      wissen: "AP entsteht voll oder nicht. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["AP"],
    },
    {
      concept: "bio:gk12:neuro:9",
      prompt: "Was beschreibt 9?",
      answer: "Es steht für das Beschleunigt saltatorische Leitung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Myelin grob.",
      wissen: "Beschleunigt saltatorische Leitung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:neuro:10",
      prompt: "Was beschreibt 10?",
      answer: "Es dient als lokale Potenzial am Sensor.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Rezeptorpotenzial.",
      wissen: "Lokales Potenzial am Sensor. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:gk12:neuro:p:1", term: "Ruhepotenzial", meaning: "Kennzeichnet die Ruhespannung", wissen: "Membran. Ruhepotenzial bedeutet: Kennzeichnet die Ruhespannung." },
    { concept: "bio:gk12:neuro:p:2", term: "Aktionspotenzial", meaning: "Bezeichnet das Nervensignal", wissen: "Spike. Aktionspotenzial bedeutet: Bezeichnet das Nervensignal." },
    { concept: "bio:gk12:neuro:p:3", term: "Depolarisation", meaning: "Kennzeichnet die Spannungsänderung", wissen: "AP. Depolarisation bedeutet: Kennzeichnet die Spannungsänderung." },
    { concept: "bio:gk12:neuro:p:4", term: "Synapse", meaning: "Beschreibt die Übergang", wissen: "Spalt. Synapse bedeutet: Beschreibt die Übergang." },
    { concept: "bio:gk12:neuro:p:5", term: "Transmitter", meaning: "Steht für den Botenstoff", wissen: "Chemisch. Transmitter bedeutet: Steht für den Botenstoff." },
    { concept: "bio:gk12:neuro:p:6", term: "Schwelle", meaning: "Kennzeichnet die Auslösewert", wissen: "AP. Schwelle bedeutet: Kennzeichnet die Auslösewert." },
    { concept: "bio:gk12:neuro:p:7", term: "Myelin", meaning: "Bezeichnet die Isolierung", wissen: "Schnell. Myelin bedeutet: Bezeichnet die Isolierung." },
    { concept: "bio:gk12:neuro:p:8", term: "Axon", meaning: "Beschreibt die Fortleitung", wissen: "Neurit. Axon bedeutet: Beschreibt die Fortleitung." },
    { concept: "bio:gk12:neuro:p:9", term: "Rezeptor", meaning: "Dient als Sensor", wissen: "Reiz. Rezeptor bedeutet: Dient als Sensor." },
    { concept: "bio:gk12:neuro:p:10", term: "Summation", meaning: "Beschreibt die Addition", wissen: "Eingänge. Summation bedeutet: Beschreibt die Addition." },
  ],
}

const gk12Verhalten: BioBank = {
  quelle: "Wikipedia: Verhaltensbiologie",
  url: "https://de.wikipedia.org/wiki/Verhaltensbiologie",
  conceptPrefix: "bio:gk12:verhalten",
  facts: [
    {
      concept: "bio:gk12:verhalten:1",
      prompt: "Was bewirkt Feste?",
      answer: "Sie steht für die Wie-Mechanismus vs. Warum-Fitnessnutzen.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Proximat vs. ultimat.",
      wissen: "Wie-Mechanismus vs. Warum-Fitnessnutzen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:verhalten:2",
      prompt: "Was bewirkt Feste?",
      answer: "Sie kennzeichnet die Beitrag zur Fitness.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Adaptiver Wert.",
      wissen: "Beitrag zur Fitness. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:verhalten:3",
      prompt: "Was bewirkt Feste?",
      answer: "Sie steht für die Abwägung Aufwand vs. Vorteil.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Kosten-Nutzen.",
      wissen: "Abwägung Aufwand vs. Vorteil. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:verhalten:4",
      prompt: "Wozu dient die Feste?",
      answer: "Sie beschreibt die Feste vs. erfahrungsabhängige Anteile.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Angeboren vs. gelernt.",
      wissen: "Feste vs. erfahrungsabhängige Anteile. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Feste"],
    },
    {
      concept: "bio:gk12:verhalten:5",
      prompt: "Wozu dient die Signalübertragung?",
      answer: "Sie beschreibt den Auslösen für feste Handlung.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Schlüsselreiz grob.",
      wissen: "Auslöser für feste Handlung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:verhalten:6",
      prompt: "Was bewirkt Signalübertragung?",
      answer: "Sie kennzeichnet die Biologie + Kultur/Lernen.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Menschliches Verhalten.",
      wissen: "Biologie + Kultur/Lernen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:verhalten:7",
      prompt: "Wozu dient die Signalübertragung?",
      answer: "Sie bezeichnet die Inventar beobachtbarer Verhaltensweisen.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Ethogramm.",
      wissen: "Inventar beobachtbarer Verhaltensweisen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:verhalten:8",
      prompt: "Was bewirkt Signalübertragung?",
      answer: "Sie steht für die Signalübertragung Sender–Empfänger.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Kommunikation.",
      wissen: "Signalübertragung Sender–Empfänger. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Signalübertragung"],
    },
    {
      concept: "bio:gk12:verhalten:9",
      prompt: "Was kennzeichnet 9?",
      answer: "Es bezeichnet den Verhaltensvarianten mit Fitnessunterschieden.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Selektion auf Verhalten.",
      wissen: "Verhaltensvarianten mit Fitnessunterschieden. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:verhalten:10",
      prompt: "Welche Rolle hat 10?",
      answer: "Es kennzeichnet das Ursachen und Funktionen trennen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum experimentell prüfen.",
      wissen: "Ursachen und Funktionen trennen. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:gk12:verhalten:p:1", term: "Proximately", meaning: "Beschreibt die Mechanismus/Ursache", wissen: "Wie. Proximately bedeutet: Beschreibt die Mechanismus/Ursache." },
    { concept: "bio:gk12:verhalten:p:2", term: "Ultimat", meaning: "Bezeichnet den Fitnessnutzen", wissen: "Warum. Ultimat bedeutet: Bezeichnet den Fitnessnutzen." },
    { concept: "bio:gk12:verhalten:p:3", term: "Adaptiv", meaning: "Kennzeichnet das Fitnessfördernd", wissen: "Selektion. Adaptiv bedeutet: Kennzeichnet das Fitnessfördernd." },
    { concept: "bio:gk12:verhalten:p:4", term: "Ethogramm", meaning: "Bezeichnet das Verhaltensinventar", wissen: "Beobachtung. Ethogramm bedeutet: Bezeichnet das Verhaltensinventar." },
    { concept: "bio:gk12:verhalten:p:5", term: "Schlüsselreiz", meaning: "Bezeichnet den Auslöser", wissen: "Angeboren oft. Schlüsselreiz bedeutet: Bezeichnet den Auslöser." },
    { concept: "bio:gk12:verhalten:p:6", term: "Lernen", meaning: "Kennzeichnet die Erfahrung", wissen: "Änderung. Lernen bedeutet: Kennzeichnet die Erfahrung." },
    { concept: "bio:gk12:verhalten:p:7", term: "Signal", meaning: "Steht für die Information", wissen: "Kommunikation. Signal bedeutet: Steht für die Information." },
    { concept: "bio:gk12:verhalten:p:8", term: "Fitness", meaning: "Beschreibt das reproduktiver Erfolg", wissen: "Selektion. Fitness bedeutet: Beschreibt das reproduktiver Erfolg." },
    { concept: "bio:gk12:verhalten:p:9", term: "Kosten", meaning: "Kennzeichnet das Aufwand", wissen: "Trade-off. Kosten bedeutet: Kennzeichnet das Aufwand." },
    { concept: "bio:gk12:verhalten:p:10", term: "Nutzen", meaning: "Beschreibt das Vorteil", wissen: "Trade-off. Nutzen bedeutet: Beschreibt das Vorteil." },
  ],
}

const gk12Abgrenzung: BioBank = {
  quelle: "Wikipedia: Evolutionstheorie",
  url: "https://de.wikipedia.org/wiki/Evolutionstheorie",
  conceptPrefix: "bio:gk12:abgrenz",
  facts: [
    {
      concept: "bio:gk12:abgrenz:1",
      prompt: "Was beschreibt 1?",
      answer: "Es beschreibt das prüfbar und Widerlegbar und Empirisch gestützt.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Naturwissenschaftliche Aussage.",
      wissen: "Prüfbar, widerlegbar, empirisch gestützt. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:abgrenz:2",
      prompt: "Wozu dient Bewährtes?",
      answer: "Es bezeichnet das Nicht empirisch prüfbare Deutungen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Nicht-naturwissenschaftlich.",
      wissen: "Nicht empirisch prüfbare Deutungen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:abgrenz:3",
      prompt: "Warum Abgrenzung nötig?",
      answer: "Es beschreibt die Klarheit über Geltungsanspruch.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum Abgrenzung nötig.",
      wissen: "Klarheit über Geltungsanspruch. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:abgrenz:4",
      prompt: "Was bewirkt Bewährtes?",
      answer: "Es steht für das Bewährtes Erklärungsgerüst und Nicht „Vermutung“.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Theorie in der Biologie.",
      wissen: "Bewährtes Erklärungsgerüst, nicht „Vermutung“. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Bewährtes"],
    },
    {
      concept: "bio:gk12:abgrenz:5",
      prompt: "Was kennzeichnet 5?",
      answer: "Es bezeichnet das Erklärt Vielfalt mit Variation+Selektion+Zeit.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Fazit Evolution.",
      wissen: "Erklärt Vielfalt mit Variation+Selektion+Zeit. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:abgrenz:6",
      prompt: "Wozu dient die Breite?",
      answer: "Sie bezeichnet die Komplexität allein beweist keinen Designer wissenschaftlich.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Fehlschluss Design-Argument.",
      wissen: "Komplexität allein beweist keinen Designer wissenschaftlich. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:abgrenz:7",
      prompt: "Was bewirkt Breite?",
      answer: "Sie kennzeichnet die Beobachtung und Hypothese und Test und Revision.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Wissenschaftliche Methode.",
      wissen: "Beobachtung, Hypothese, Test, Revision. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:abgrenz:8",
      prompt: "Wozu dient die Breite?",
      answer: "Sie bezeichnet die Breite fachliche Übereinstimmung aufgrund Evidenz.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Konsens bedeutet.",
      wissen: "Breite fachliche Übereinstimmung aufgrund Evidenz. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Breite"],
    },
    {
      concept: "bio:gk12:abgrenz:9",
      prompt: "Was kennzeichnet 9?",
      answer: "Es steht für den unprüfbare Behauptungen als Wissenschaft verkaufen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Pseudowissenschaft Risiko.",
      wissen: "Unprüfbare Behauptungen als Wissenschaft verkaufen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:abgrenz:10",
      prompt: "Was beschreibt 10?",
      answer: "Es kennzeichnet das Evidenzbasiert argumentieren können.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Unterrichtsziel.",
      wissen: "Evidenzbasiert argumentieren können. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:gk12:abgrenz:p:1", term: "Empirie", meaning: "Bezeichnet den Erfahrung/Daten", wissen: "Prüfung. Empirie bedeutet: Bezeichnet den Erfahrung/Daten." },
    { concept: "bio:gk12:abgrenz:p:2", term: "Falsifizierbar", meaning: "Bezeichnet das Widerlegbar", wissen: "Kriterium. Falsifizierbar bedeutet: Bezeichnet das Widerlegbar." },
    { concept: "bio:gk12:abgrenz:p:3", term: "Theorie", meaning: "Kennzeichnet die Erklärungsgerüst", wissen: "Bewährt. Theorie bedeutet: Kennzeichnet die Erklärungsgerüst." },
    { concept: "bio:gk12:abgrenz:p:4", term: "Hypothese", meaning: "Beschreibt die testbare Annahme", wissen: "Vorstufe. Hypothese bedeutet: Beschreibt die testbare Annahme." },
    { concept: "bio:gk12:abgrenz:p:5", term: "Evidenz", meaning: "Beschreibt die Belege", wissen: "Daten. Evidenz bedeutet: Beschreibt die Belege." },
    { concept: "bio:gk12:abgrenz:p:6", term: "Konsens", meaning: "Kennzeichnet die Fachübereinstimmung", wissen: "Evidenzbasiert. Konsens bedeutet: Kennzeichnet die Fachübereinstimmung." },
    { concept: "bio:gk12:abgrenz:p:7", term: "Pseudowissenschaft", meaning: "Kennzeichnet die Unprüfbar", wissen: "Abgrenzung. Pseudowissenschaft bedeutet: Kennzeichnet die Unprüfbar." },
    { concept: "bio:gk12:abgrenz:p:8", term: "Selektion", meaning: "Kennzeichnet die Naturprozess", wissen: "Evolution. Selektion bedeutet: Beschreibt die Gerichtet." },
    { concept: "bio:gk12:abgrenz:p:9", term: "Argumentation", meaning: "Bezeichnet die Begründet", wissen: "Unterricht. Argumentation bedeutet: Bezeichnet die Begründet." },
    { concept: "bio:gk12:abgrenz:p:10", term: "Geltungsanspruch", meaning: "Beschreibt das Was gilt wie", wissen: "Klarheit. Geltungsanspruch bedeutet: Beschreibt das Was gilt wie." },
  ],
}

const gk12Molekular: BioBank = {
  quelle: "Wikipedia: Molekulare Phylogenetik",
  url: "https://de.wikipedia.org/wiki/Molekulare_Phylogenetik",
  conceptPrefix: "bio:gk12:mol",
  facts: [
    {
      concept: "bio:gk12:mol:1",
      prompt: "Molekulare Homologie?",
      answer: "Es beschreibt die Ähnlichkeit durch gemeinsame Abstammung in Sequenzen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Molekulare Homologie.",
      wissen: "Ähnlichkeit durch gemeinsame Abstammung in Sequenzen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:mol:2",
      prompt: "Was bewirkt Abgeleitetes?",
      answer: "Es steht für die Verwandtschaft aus Sequenzunterschieden schätzen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Stammbaum aus DNA.",
      wissen: "Verwandtschaft aus Sequenzunterschieden schätzen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:mol:3",
      prompt: "Was bewirkt Abgeleitetes?",
      answer: "Es kennzeichnet die externe Vergleichsart zur Wurzelung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Outgroup.",
      wissen: "Externe Vergleichsart zur Wurzelung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:mol:4",
      prompt: "Wozu dient Abgeleitetes?",
      answer: "Es bezeichnet das Abgeleitetes gemeinsames Merkmal.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Synapomorphie grob.",
      wissen: "Abgeleitetes gemeinsames Merkmal. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Abgeleitetes"],
    },
    {
      concept: "bio:gk12:mol:5",
      prompt: "Konvergenz molekular?",
      answer: "Es steht für den ähnliche Sequenzen ohne enge Verwandtschaft möglich.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Konvergenz molekular.",
      wissen: "Ähnliche Sequenzen ohne enge Verwandtschaft möglich. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:mol:6",
      prompt: "Was bewirkt Mutationsrate?",
      answer: "Sie kennzeichnet das Maß für Zweigstützung.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Bootstrap/Support grob.",
      wissen: "Maß für Zweigstützung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:mol:7",
      prompt: "Warum mehrere Gene?",
      answer: "Es beschreibt die Einzelgene können täuschen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum mehrere Gene.",
      wissen: "Einzelgene können täuschen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:mol:8",
      prompt: "Was bewirkt Mutationsrate?",
      answer: "Sie steht für die Mutationsrate als Zeitmaß (mit Vorsicht).",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Uhr-Idee grob.",
      wissen: "Mutationsrate als Zeitmaß (mit Vorsicht). Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Mutationsrate"],
    },
    {
      concept: "bio:gk12:mol:9",
      prompt: "Woran erkennt man 9?",
      answer: "Es bezeichnet die Genflussabnahme sichtbar in Sequenzen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Artbildung molekular.",
      wissen: "Genflussabnahme sichtbar in Sequenzen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:gk12:mol:10",
      prompt: "Was beschreibt 10?",
      answer: "Es steht für den Homologie/Alignment/Modellannahmen kritisch.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Grenze der Methode.",
      wissen: "Homologie/Alignment/Modellannahmen kritisch. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:gk12:mol:p:1", term: "Sequenz", meaning: "Steht für die Basen-/AS-Folge", wissen: "Vergleich. Sequenz bedeutet: Steht für die Basen-/AS-Folge." },
    { concept: "bio:gk12:mol:p:2", term: "Phylogenie", meaning: "Beschreibt das Stammbaum", wissen: "Verwandtschaft. Phylogenie bedeutet: Beschreibt das Stammbaum." },
    { concept: "bio:gk12:mol:p:3", term: "Homologie", meaning: "Bezeichnet die gemeinsame Herkunft", wissen: "Merkmal. Homologie bedeutet: Kennzeichnet die Herkunft." },
    { concept: "bio:gk12:mol:p:4", term: "Outgroup", meaning: "Steht für die Außengruppe", wissen: "Wurzel. Outgroup bedeutet: Kennzeichnet den Außen." },
    { concept: "bio:gk12:mol:p:5", term: "Alignment", meaning: "Bezeichnet die Sequenzausrichtung", wissen: "Vergleich. Alignment bedeutet: Bezeichnet die Sequenzausrichtung." },
    { concept: "bio:gk12:mol:p:6", term: "Synapomorphie", meaning: "Kennzeichnet die Abgeleitet gemeinsam", wissen: "Clade. Synapomorphie bedeutet: Kennzeichnet die Abgeleitet gemeinsam." },
    { concept: "bio:gk12:mol:p:7", term: "Konvergenz", meaning: "Steht für die unabhängige Ähnlichkeit", wissen: "Vorsicht. Konvergenz bedeutet: Kennzeichnet die Unabhängig." },
    { concept: "bio:gk12:mol:p:8", term: "Genfluss", meaning: "Steht für das Austausch", wissen: "Population. Genfluss bedeutet: Beschreibt die Migration." },
    { concept: "bio:gk12:mol:p:9", term: "Support", meaning: "Kennzeichnet die Zweigstützung", wissen: "Statistik. Support bedeutet: Kennzeichnet die Stützung." },
    { concept: "bio:gk12:mol:p:10", term: "Modell", meaning: "Kennzeichnet den Annahmen", wissen: "Schätzung. Modell bedeutet: Kennzeichnet die Vereinfachung." },
  ],
}

const lk11Procyte: BioBank = {
  quelle: "Wikipedia: Prokaryoten",
  url: "https://de.wikipedia.org/wiki/Prokaryoten",
  conceptPrefix: "bio:lk11:procyte",
  facts: [
    {
      concept: "bio:lk11:procyte:1",
      prompt: "Woran erkennt man 1?",
      answer: "Es bezeichnet das Kein kernmembranumschlossener Kern.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Procyte Kennzeichen.",
      wissen: "Kein kernmembranumschlossener Kern. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:procyte:2",
      prompt: "Wozu dient Oft?",
      answer: "Es dient als Echter Zellkern und oft Organellen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Eucyte Kennzeichen.",
      wissen: "Echter Zellkern und oft Organellen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:procyte:3",
      prompt: "Was bewirkt Oft?",
      answer: "Es steht für das Cyanobacteria photosynthetisch; beide prokaryotisch.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Bakterien vs. Cyanobacteria.",
      wissen: "Cyanobacteria photosynthetisch; beide prokaryotisch. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:procyte:4",
      prompt: "Was bewirkt Oft?",
      answer: "Es kennzeichnet das Oft Peptidoglycan; Form/Schutz.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Zellwand Bakterien.",
      wissen: "Oft Peptidoglycan; Form/Schutz. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Oft"],
    },
    {
      concept: "bio:lk11:procyte:5",
      prompt: "Was beschreibt 5?",
      answer: "Es kennzeichnet das zusätzliche DNA und Oft mobil.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Plasmid.",
      wissen: "Zusätzliche DNA, oft mobil. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:procyte:6",
      prompt: "Was beschreibt 6?",
      answer: "Es beschreibt die Proteinbiosynthese im Cytoplasma.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Ribosomen Prokaryoten.",
      wissen: "Proteinbiosynthese im Cytoplasma. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:procyte:7",
      prompt: "Was kennzeichnet 7?",
      answer: "Es steht für den Prokaryoten typisch kleiner.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Unterschied Größe.",
      wissen: "Prokaryoten typisch kleiner. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:procyte:8",
      prompt: "Was beschreibt 8?",
      answer: "Es beschreibt den Mitochondrien/Chloroplasten aus Bakterien.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Endosymbiontentheorie grob.",
      wissen: "Mitochondrien/Chloroplasten aus Bakterien. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:procyte:9",
      prompt: "Was kennzeichnet 9?",
      answer: "Es bezeichnet die prokaryotenspezifische Strukturen/Prozesse.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Antibiotika-Ziel oft.",
      wissen: "Prokaryotenspezifische Strukturen/Prozesse. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:procyte:10",
      prompt: "Wozu dient 10?",
      answer: "Es dient als Organisationsebenen und Evolution verstehen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum vergleichen.",
      wissen: "Organisationsebenen und Evolution verstehen. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk11:procyte:p:1", term: "Procyte", meaning: "Bezeichnet die Prokaryot", wissen: "Kein Kern. Procyte bedeutet: Bezeichnet die Prokaryot." },
    { concept: "bio:lk11:procyte:p:2", term: "Eucyte", meaning: "Bezeichnet die Eukaryot", wissen: "Kern. Eucyte bedeutet: Bezeichnet die Eukaryot." },
    { concept: "bio:lk11:procyte:p:3", term: "Peptidoglycan", meaning: "Kennzeichnet das Bakterienwand", wissen: "Schutz. Peptidoglycan bedeutet: Kennzeichnet das Bakterienwand." },
    { concept: "bio:lk11:procyte:p:4", term: "Plasmid", meaning: "Steht für das Extrachromosomal", wissen: "Genetik. Plasmid bedeutet: Steht für das Extrachromosomal." },
    { concept: "bio:lk11:procyte:p:5", term: "Cyanobacteria", meaning: "Kennzeichnet die Photosynthese", wissen: "Prokaryot. Cyanobacteria bedeutet: Kennzeichnet die Photosynthese." },
    { concept: "bio:lk11:procyte:p:6", term: "Endosymbiose", meaning: "Dient als Herkunft Organellen", wissen: "Theorie. Endosymbiose bedeutet: Dient als Herkunft Organellen." },
    { concept: "bio:lk11:procyte:p:7", term: "Nucleoid", meaning: "Beschreibt die DNA-Region", wissen: "Prokaryot. Nucleoid bedeutet: Beschreibt die DNA-Region." },
    { concept: "bio:lk11:procyte:p:8", term: "Organell", meaning: "Beschreibt das Kompartiment", wissen: "Eukaryot. Organell bedeutet: Beschreibt das Kompartiment." },
    { concept: "bio:lk11:procyte:p:9", term: "Ribosom", meaning: "Kennzeichnet die Translation", wissen: "Beiden. Ribosom bedeutet: Kennzeichnet die Translation." },
    { concept: "bio:lk11:procyte:p:10", term: "Vergleich", meaning: "Beschreibt die Methode", wissen: "Systematik. Vergleich bedeutet: Beschreibt die Methode." },
  ],
}

const lk11GewebeZyklus: BioBank = {
  quelle: "Wikipedia: Zellzyklus",
  url: "https://de.wikipedia.org/wiki/Zellzyklus",
  conceptPrefix: "bio:lk11:gewebe",
  facts: [
    {
      concept: "bio:lk11:gewebe:1",
      prompt: "Was bewirkt G1?",
      answer: "Es steht für das Wachstum.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Bildungsgewebe.",
      wissen: "Teilungsfähig (Meristem). Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:gewebe:2",
      prompt: "Was bewirkt G1?",
      answer: "Es steht für das Wachstum.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Dauergewebe.",
      wissen: "Differenziert, wenig Teilung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:gewebe:3",
      prompt: "Was bewirkt G1?",
      answer: "Es steht für das Wachstum.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Vegetationskegel.",
      wissen: "Spross-/Wurzelmeristemspitze. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:gewebe:4",
      prompt: "Was bewirkt G1?",
      answer: "Es steht für das Wachstum.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Zellzyklus Phasen grob.",
      wissen: "G1, S, G2, M. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["G1"],
    },
    {
      concept: "bio:lk11:gewebe:5",
      prompt: "Wozu dient Spitzenwachstum?",
      answer: "Es beschreibt die DNA-Replikation.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "S-Phase.",
      wissen: "DNA-Replikation. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:gewebe:6",
      prompt: "Wozu dient Spitzenwachstum?",
      answer: "Es bezeichnet die identische Tochterkerne.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Mitose Zweck.",
      wissen: "Identische Tochterkerne. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:gewebe:7",
      prompt: "Wozu dient Spitzenwachstum?",
      answer: "Es bezeichnet die Spezialisierung nach Teilung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Differenzierung.",
      wissen: "Spezialisierung nach Teilung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:gewebe:8",
      prompt: "Was bewirkt Spitzenwachstum?",
      answer: "Es steht für das Spitzenwachstum.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Apikalmeristem.",
      wissen: "Spitzenwachstum. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Spitzenwachstum"],
    },
    {
      concept: "bio:lk11:gewebe:9",
      prompt: "Was kennzeichnet 9?",
      answer: "Es bezeichnet die seitliche Bildungsgewebe (Dickenwachstum).",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Kambium grob.",
      wissen: "Seitliches Bildungsgewebe (Dickenwachstum). Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:gewebe:10",
      prompt: "Was beschreibt 10?",
      answer: "Es kennzeichnet das Checkpoints gegen Fehler.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Kontrolle Zellzyklus.",
      wissen: "Checkpoints gegen Fehler. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk11:gewebe:p:1", term: "Meristem", meaning: "Bezeichnet die Bildungsgewebe", wissen: "Teilung. Meristem bedeutet: Bezeichnet die Bildungsgewebe." },
    { concept: "bio:lk11:gewebe:p:2", term: "Dauergewebe", meaning: "Beschreibt die Differenziert", wissen: "Funktion. Dauergewebe bedeutet: Beschreibt die Differenziert." },
    { concept: "bio:lk11:gewebe:p:3", term: "Vegetationskegel", meaning: "Steht für die Spitze", wissen: "Wachstum. Vegetationskegel bedeutet: Steht für die Spitze." },
    { concept: "bio:lk11:gewebe:p:4", term: "G1", meaning: "Steht für das Wachstum", wissen: "Vorbereitung. G1 bedeutet: Steht für das Wachstum." },
    { concept: "bio:lk11:gewebe:p:5", term: "S", meaning: "Bezeichnet die Replikation", wissen: "DNA. S bedeutet: Bezeichnet die Replikation." },
    { concept: "bio:lk11:gewebe:p:6", term: "G2", meaning: "Steht für die Vorbereitung Mitose", wissen: "Kontrolle. G2 bedeutet: Steht für die Vorbereitung Mitose." },
    { concept: "bio:lk11:gewebe:p:7", term: "Mitose", meaning: "Beschreibt die Kernteilung", wissen: "Gleich. Mitose bedeutet: Beschreibt die Kernteilung." },
    { concept: "bio:lk11:gewebe:p:8", term: "Checkpoint", meaning: "Kennzeichnet die Kontrolle", wissen: "Qualität. Checkpoint bedeutet: Kennzeichnet die Kontrolle." },
    { concept: "bio:lk11:gewebe:p:9", term: "Kambium", meaning: "Kennzeichnet das Dickenwachstum", wissen: "Seitlich. Kambium bedeutet: Kennzeichnet das Dickenwachstum." },
    { concept: "bio:lk11:gewebe:p:10", term: "Differenzierung", meaning: "Bezeichnet die Spezialisierung", wissen: "Programm. Differenzierung bedeutet: Steht für die Gewebe." },
  ],
}

const lk11Membran: BioBank = {
  quelle: "Wikipedia: Biomembran",
  url: "https://de.wikipedia.org/wiki/Biomembran",
  conceptPrefix: "bio:lk11:membran",
  facts: [
    {
      concept: "bio:lk11:membran:1",
      prompt: "Was bewirkt Synthese oder Transport?",
      answer: "Sie steht für die Lipide fluid und Proteine eingelagert (Singer/Nicholson).",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Flüssig-Mosaik-Modell.",
      wissen: "Lipide fluid, Proteine eingelagert (Singer/Nicholson). Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:membran:2",
      prompt: "Wozu dienen Synthese oder Transport?",
      answer: "Es dient als Amphiphil; Doppelschicht.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Phospholipide.",
      wissen: "Amphiphil; Doppelschicht. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:membran:3",
      prompt: "Was bewirkt Synthese oder Transport?",
      answer: "Sie steht für die Wasserkanäle.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Aquaporine.",
      wissen: "Wasserkanäle. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:membran:4",
      prompt: "Was bewirkt Synthese oder Transport?",
      answer: "Sie kennzeichnet die Synthese/Transport von Proteinen/Lipiden.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "ER Funktion grob.",
      wissen: "Synthese/Transport von Proteinen/Lipiden. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Synthese/Transport"],
    },
    {
      concept: "bio:lk11:membran:5",
      prompt: "Was beschreibt 5?",
      answer: "Es beschreibt die Modifikation und Versand.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Dictyosom/Golgi.",
      wissen: "Modifikation und Versand. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:membran:6",
      prompt: "Was bewirkt Beeinflusst?",
      answer: "Es kennzeichnet die getrennte Reaktionsbedingungen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Kompartimentierung Vorteil.",
      wissen: "Getrennte Reaktionsbedingungen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:membran:7",
      prompt: "Wozu dient Beeinflusst?",
      answer: "Es bezeichnet das Fest eingebettet vs. angelagert.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Integral vs. peripher.",
      wissen: "Fest eingebettet vs. angelagert. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:membran:8",
      prompt: "Wozu dient Beeinflusst?",
      answer: "Es beschreibt das Beeinflusst Fluidität (tierisch).",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Cholesterin in Membranen.",
      wissen: "Beeinflusst Fluidität (tierisch). Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Beeinflusst"],
    },
    {
      concept: "bio:lk11:membran:9",
      prompt: "Woran erkennt man 9?",
      answer: "Es bezeichnet den Kontrollierten Stoffaustausch.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Selektivität.",
      wissen: "Kontrollierter Stoffaustausch. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:membran:10",
      prompt: "Was kennzeichnet 10?",
      answer: "Es bezeichnet das Membranfluss zwischen Kompartimenten.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Vesikeltransport.",
      wissen: "Membranfluss zwischen Kompartimenten. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk11:membran:p:1", term: "Phospholipid", meaning: "Beschreibt das Amphiphil", wissen: "Doppelschicht. Phospholipid bedeutet: Beschreibt das Amphiphil." },
    { concept: "bio:lk11:membran:p:2", term: "Fluid-Mosaik", meaning: "Steht für das Modell", wissen: "Singer/Nicholson. Fluid-Mosaik bedeutet: Steht für das Modell." },
    { concept: "bio:lk11:membran:p:3", term: "Aquaporin", meaning: "Kennzeichnet das Wasserkanal", wissen: "Osmose. Aquaporin bedeutet: Kennzeichnet das Wasserkanal." },
    { concept: "bio:lk11:membran:p:4", term: "ER", meaning: "Bezeichnet den Synthese/Transport", wissen: "Netz. ER bedeutet: Bezeichnet den Synthese/Transport." },
    { concept: "bio:lk11:membran:p:5", term: "Golgi", meaning: "Kennzeichnet die Modifikation", wissen: "Versand. Golgi bedeutet: Kennzeichnet die Modifikation." },
    { concept: "bio:lk11:membran:p:6", term: "Integralprotein", meaning: "Bezeichnet das Eingebettet", wissen: "Transport/Signal. Integralprotein bedeutet: Bezeichnet das Eingebettet." },
    { concept: "bio:lk11:membran:p:7", term: "Fluidität", meaning: "Kennzeichnet die Beweglichkeit", wissen: "Lipide. Fluidität bedeutet: Kennzeichnet die Beweglichkeit." },
    { concept: "bio:lk11:membran:p:8", term: "Kompartiment", meaning: "Kennzeichnet das Raum", wissen: "Trennung. Kompartiment bedeutet: Kennzeichnet das Raum." },
    { concept: "bio:lk11:membran:p:9", term: "Vesikel", meaning: "Bezeichnet das Transportbläschen", wissen: "Membranfluss. Vesikel bedeutet: Bezeichnet das Transportbläschen." },
    { concept: "bio:lk11:membran:p:10", term: "Selektivität", meaning: "Beschreibt die Auswahl", wissen: "Barriere. Selektivität bedeutet: Beschreibt die Auswahl." },
  ],
}

const lk11Transport: BioBank = {
  quelle: "Wikipedia: Wasserpotenzial",
  url: "https://de.wikipedia.org/wiki/Wasserpotenzial",
  conceptPrefix: "bio:lk11:transport",
  facts: [
    {
      concept: "bio:lk11:transport:1",
      prompt: "Wasserpotenzial?",
      answer: "Es beschreibt die Tendenz des Wasserstroms; Summe von Komponenten.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Wasserpotenzial.",
      wissen: "Tendenz des Wasserstroms; Summe von Komponenten. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:transport:2",
      prompt: "Was bewirkt ATP?",
      answer: "Es steht für die Währung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Plasmolyse/Deplasmolyse.",
      wissen: "Wasserverlust/-aufnahme der Pflanzenzelle. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:transport:3",
      prompt: "Was bewirkt ATP?",
      answer: "Es steht für die Währung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Endo-/Exocytose.",
      wissen: "Vesikulärer Stoffaustausch. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:transport:4",
      prompt: "Was bewirkt ATP?",
      answer: "Es steht für die Währung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Aktiver Transport.",
      wissen: "ATP gegen Gefälle. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["ATP"],
    },
    {
      concept: "bio:lk11:transport:5",
      prompt: "Was bewirkt Wasserverlust?",
      answer: "Es kennzeichnet das Druck aus Osmosebestreben.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Osmotischer Druck grob.",
      wissen: "Druck aus Osmosebestreben. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:transport:6",
      prompt: "Was bewirkt Wasserverlust?",
      answer: "Es steht für das Innendruck der Pflanzenzelle.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Turgor.",
      wissen: "Innendruck der Pflanzenzelle. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:transport:7",
      prompt: "Was bewirkt Wasserverlust?",
      answer: "Es steht für die Wasseraufnahme und Zelle prall.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Hypoton → Turgor.",
      wissen: "Wasseraufnahme, Zelle prall. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:transport:8",
      prompt: "Was bewirkt Wasserverlust?",
      answer: "Es beschreibt das Wasserverlust und Protoplast löst sich.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Hyperton → Plasmolyse.",
      wissen: "Wasserverlust, Protoplast löst sich. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Wasserverlust"],
    },
    {
      concept: "bio:lk11:transport:9",
      prompt: "Woran erkennt man 9?",
      answer: "Es kennzeichnet die Pore vs. Konformationszyklus.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Kanal vs. Carrier.",
      wissen: "Pore vs. Konformationszyklus. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:transport:10",
      prompt: "Woran erkennt man 10?",
      answer: "Es bezeichnet das Erklärt Leitung und Spaltverhalten.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum Wasserpotenzial in Pflanzen.",
      wissen: "Erklärt Leitung und Spaltverhalten. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk11:transport:p:1", term: "Wasserpotenzial", meaning: "Beschreibt das Strommaß", wissen: "Pflanzen. Wasserpotenzial bedeutet: Beschreibt das Strommaß." },
    { concept: "bio:lk11:transport:p:2", term: "Turgor", meaning: "Bezeichnet den Innendruck", wissen: "Stabilität. Turgor bedeutet: Bezeichnet den Innendruck." },
    { concept: "bio:lk11:transport:p:3", term: "Plasmolyse", meaning: "Beschreibt die Wasserverlust", wissen: "Hyperton. Plasmolyse bedeutet: Beschreibt die Wasserverlust." },
    { concept: "bio:lk11:transport:p:4", term: "Deplasmolyse", meaning: "Kennzeichnet die Rückkehr", wissen: "Hypoton. Deplasmolyse bedeutet: Kennzeichnet die Rückkehr." },
    { concept: "bio:lk11:transport:p:5", term: "Endocytose", meaning: "Beschreibt die Rein", wissen: "Vesikel. Endocytose bedeutet: Beschreibt die Rein." },
    { concept: "bio:lk11:transport:p:6", term: "Exocytose", meaning: "Kennzeichnet die Raus", wissen: "Vesikel. Exocytose bedeutet: Kennzeichnet die Raus." },
    { concept: "bio:lk11:transport:p:7", term: "Osmose", meaning: "Ist die Diffusion von Wasser durch eine semipermeable Membran", wissen: "Membran. Osmose bedeutet: Ist die Diffusion von Wasser durch eine semipermeable Membran." },
    { concept: "bio:lk11:transport:p:8", term: "Aktiver Transport", meaning: "Steht für das ATP", wissen: "Gegen Gefälle. Aktiver Transport bedeutet: Steht für das ATP." },
    { concept: "bio:lk11:transport:p:9", term: "Kanal", meaning: "Bezeichnet die Pore", wissen: "Passiv oft. Kanal bedeutet: Bezeichnet die Pore." },
    { concept: "bio:lk11:transport:p:10", term: "Carrier", meaning: "Beschreibt den Binder", wissen: "Konformation. Carrier bedeutet: Beschreibt den Binder." },
  ],
}

const lk11Genreg: BioBank = {
  quelle: "Wikipedia: Operon",
  url: "https://de.wikipedia.org/wiki/Operon",
  conceptPrefix: "bio:lk11:genreg",
  facts: [
    {
      concept: "bio:lk11:genreg:1",
      prompt: "Wozu dient Hebt?",
      answer: "Es bezeichnet die gemeinsam regulierte prokaryotische Gene.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Operonmodell (Jacob/Monod).",
      wissen: "Gemeinsam regulierte prokaryotische Gene. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:genreg:2",
      prompt: "Wozu dient Hebt?",
      answer: "Es beschreibt die Induktion bei Lactosebedarf.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Lac-Operon grob.",
      wissen: "Induktion bei Lactosebedarf. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:genreg:3",
      prompt: "Wozu dient Hebt?",
      answer: "Es beschreibt das Hemmt Transkription bei Bindung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Repressor.",
      wissen: "Hemmt Transkription bei Bindung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:genreg:4",
      prompt: "Wozu dient Hebt?",
      answer: "Es beschreibt das Hebt Hemmung auf.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Induktor.",
      wissen: "Hebt Hemmung auf. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Hebt"],
    },
    {
      concept: "bio:lk11:genreg:5",
      prompt: "Woran erkennt man 5?",
      answer: "Es umfasst Chromatin und Enhancer und Spleißen und Epigenetik.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Eukaryoten-Regulation komplexer.",
      wissen: "Chromatin, Enhancer, Spleißen, Epigenetik. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:genreg:6",
      prompt: "Was bewirkt Kombinierte?",
      answer: "Sie steht für die Mehrere Proteine aus einem Gen.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Alternatives Spleißen.",
      wissen: "Mehrere Proteine aus einem Gen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:genreg:7",
      prompt: "Wozu dient die Kombinierte?",
      answer: "Sie bezeichnet die Expression ohne Sequenzänderung.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Epigenetik.",
      wissen: "Expression ohne Sequenzänderung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:genreg:8",
      prompt: "Was bewirkt Kombinierte?",
      answer: "Sie kennzeichnet die kombinierte Steuerung.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Transkriptionsfaktor-Netzwerke.",
      wissen: "Kombinierte Steuerung. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Kombinierte"],
    },
    {
      concept: "bio:lk11:genreg:9",
      prompt: "Woran erkennt man 9?",
      answer: "Es steht für das gemeinsame mRNA für Stoffwechselweg.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum Operon sparsam.",
      wissen: "Gemeinsame mRNA für Stoffwechselweg. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:genreg:10",
      prompt: "Woran erkennt man 10?",
      answer: "Es bezeichnet das Operons vs. individuelle Promotoren/Chromatin.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Vergleich Pro-/Eukaryot.",
      wissen: "Operons vs. individuelle Promotoren/Chromatin. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk11:genreg:p:1", term: "Operon", meaning: "Steht für den Gencluster", wissen: "Prokaryot. Operon bedeutet: Steht für den Gencluster." },
    { concept: "bio:lk11:genreg:p:2", term: "Repressor", meaning: "Kennzeichnet den Hemmprotein", wissen: "Operator. Repressor bedeutet: Kennzeichnet den Hemmprotein." },
    { concept: "bio:lk11:genreg:p:3", term: "Induktor", meaning: "Steht für den Auslöser", wissen: "Lactose z. B. Induktor bedeutet: Steht für den Auslöser." },
    { concept: "bio:lk11:genreg:p:4", term: "Operator", meaning: "Bezeichnet die Bindungsstelle", wissen: "Kontrolle. Operator bedeutet: Bezeichnet die Bindungsstelle." },
    { concept: "bio:lk11:genreg:p:5", term: "Promotor", meaning: "Beschreibt die RNA-Pol-Bindung", wissen: "Start. Promotor bedeutet: Beschreibt die RNA-Pol-Bindung." },
    { concept: "bio:lk11:genreg:p:6", term: "Spleißen", meaning: "Kennzeichnet das MRNAReifungg", wissen: "Eukaryot. Spleißen bedeutet: Kennzeichnet das MRNAReifungg." },
    { concept: "bio:lk11:genreg:p:7", term: "Epigenetik", meaning: "Kennzeichnet den Markierungen", wissen: "Expression. Epigenetik bedeutet: Kennzeichnet den Markierungen." },
    { concept: "bio:lk11:genreg:p:8", term: "Enhancer", meaning: "Beschreibt den Verstärker", wissen: "DNA. Enhancer bedeutet: Beschreibt den Verstärker." },
    { concept: "bio:lk11:genreg:p:9", term: "Jacob/Monod", meaning: "Beschreibt das Operon-Modell", wissen: "Historisch. Jacob oder Monod bedeutet: Beschreibt das Operon-Modell." },
    { concept: "bio:lk11:genreg:p:10", term: "Chromatin", meaning: "Steht für die Packung", wissen: "Zugänglichkeit. Chromatin bedeutet: Steht für die Packung." },
  ],
}

const lk11Enzyme: BioBank = {
  quelle: "Wikipedia: Enzymhemmung",
  url: "https://de.wikipedia.org/wiki/Enzymhemmung",
  conceptPrefix: "bio:lk11:enzyme",
  facts: [
    {
      concept: "bio:lk11:enzyme:1",
      prompt: "Enzymklassen grob?",
      answer: "1 gilt Nach Reaktionstyp (z. B. Hydrolasen, Oxidasen).",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Enzymklassen grob.",
      wissen: "Nach Reaktionstyp (z. B. Hydrolasen, Oxidasen). Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:enzyme:2",
      prompt: "Wozu dient die Andere?",
      answer: "Sie bezeichnet die Sie überträgt Gruppen/Elektronen.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Coenzym Beispielrolle.",
      wissen: "Überträgt Gruppen/Elektronen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:enzyme:3",
      prompt: "Was bewirkt Andere?",
      answer: "Sie steht für die Hemmung durch Zentrumskonkurrenz; durch Substrat abschwächbar.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Kompetitive Hemmung Kennzeichen.",
      wissen: "Hemmung durch Zentrumskonkurrenz; durch Substrat abschwächbar. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:enzyme:4",
      prompt: "Wozu dient die Andere?",
      answer: "Sie beschreibt die Andere Stelle; Vmax sinkt.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Nichtkompetitiv.",
      wissen: "Andere Stelle; Vmax sinkt. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Andere"],
    },
    {
      concept: "bio:lk11:enzyme:5",
      prompt: "Wozu dient 5?",
      answer: "Es dient als Diagnostik, Industrie, Waschmittel, Medizin.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Anwendung Enzyme.",
      wissen: "Diagnostik, Industrie, Waschmittel, Medizin. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:enzyme:6",
      prompt: "Was bewirkt Effektoren?",
      answer: "Es kennzeichnet die Denaturierung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Temperaturoptimum überschreiten.",
      wissen: "Denaturierung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:enzyme:7",
      prompt: "Wozu dient Effektoren?",
      answer: "Es bezeichnet die Ladungen/Struktur ändern Aktivität.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "pH-Abweichung.",
      wissen: "Ladungen/Struktur ändern Aktivität. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:enzyme:8",
      prompt: "Was bewirkt Effektoren?",
      answer: "Es kennzeichnet den Effektoren an anderer Stelle.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Allosterische Regulation.",
      wissen: "Effektoren an anderer Stelle. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Effektoren"],
    },
    {
      concept: "bio:lk11:enzyme:9",
      prompt: "Woran erkennt man 9?",
      answer: "Es bezeichnet den Kennlinien zur Hemmungsanalyse.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum Lineweaver-Burk historisch.",
      wissen: "Kennlinien zur Hemmungsanalyse. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:enzyme:10",
      prompt: "Was kennzeichnet 10?",
      answer: "Es kennzeichnet das aktive Zentrum passt zum Stoffwechselbedarf.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Spezifität evolutionär.",
      wissen: "Aktives Zentrum passt zum Stoffwechselbedarf. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk11:enzyme:p:1", term: "Hydrolase", meaning: "Bezeichnet die Spaltend mit Wasser", wissen: "Klasse. Hydrolase bedeutet: Bezeichnet die Spaltend mit Wasser." },
    { concept: "bio:lk11:enzyme:p:2", term: "Coenzym", meaning: "Beschreibt das Hilfsmolekül", wissen: "Transfer. Coenzym bedeutet: Beschreibt das Hilfsmolekül." },
    { concept: "bio:lk11:enzyme:p:3", term: "Kompetitiv", meaning: "Beschreibt die Zentrumskonkurrenz", wissen: "Hemmung. Kompetitiv bedeutet: Beschreibt die Zentrumskonkurrenz." },
    { concept: "bio:lk11:enzyme:p:4", term: "Nichtkompetitiv", meaning: "Kennzeichnet die andere Stelle", wissen: "Vmax↓. Nichtkompetitiv bedeutet: Kennzeichnet die andere Stelle." },
    { concept: "bio:lk11:enzyme:p:5", term: "Allosterie", meaning: "Steht für die Fernwirkung", wissen: "Regulation. Allosterie bedeutet: Steht für die Fernwirkung." },
    { concept: "bio:lk11:enzyme:p:6", term: "Vmax", meaning: "Kennzeichnet die Sättigungsrate", wissen: "Kinetik. Vmax bedeutet: Kennzeichnet die Sättigungsrate." },
    { concept: "bio:lk11:enzyme:p:7", term: "Km", meaning: "Beschreibt das Affinitätsmaß", wissen: "Kinetik. Km bedeutet: Beschreibt das Affinitätsmaß." },
    { concept: "bio:lk11:enzyme:p:8", term: "Denaturierung", meaning: "Steht für die Strukturverlust", wissen: "Hitze/pH. Denaturierung bedeutet: Steht für die Strukturverlust." },
    { concept: "bio:lk11:enzyme:p:9", term: "Biokatalyse", meaning: "Steht für die Enzymatik", wissen: "Technik. Biokatalyse bedeutet: Steht für die Enzymatik." },
    { concept: "bio:lk11:enzyme:p:10", term: "Effektor", meaning: "Kennzeichnet den Regulator", wissen: "Bindung. Effektor bedeutet: Kennzeichnet den Regulator." },
  ],
}

const lk11C3C4: BioBank = {
  quelle: "Wikipedia: C4-Pflanze",
  url: "https://de.wikipedia.org/wiki/C4-Pflanze",
  conceptPrefix: "bio:lk11:c3c4",
  facts: [
    {
      concept: "bio:lk11:c3c4:1",
      prompt: "Was beschreibt 1?",
      answer: "Es bezeichnet das Direktes CO2 in Calvin-Zyklus; Rubisco.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "C3-Pflanzen.",
      wissen: "Direktes CO2 in Calvin-Zyklus; Rubisco. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:c3c4:2",
      prompt: "Wozu dient die Primäre?",
      answer: "Sie bezeichnet die Bessere Effizienz bei Hitze/Licht; weniger Photorespiration.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "C4-Vorteil.",
      wissen: "Bessere Effizienz bei Hitze/Licht; weniger Photorespiration. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:c3c4:3",
      prompt: "Wozu dient die Primäre?",
      answer: "Sie bezeichnet die Mesophyll + Bündelscheidenzellen.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Raumtrennung C4.",
      wissen: "Mesophyll + Bündelscheidenzellen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:c3c4:4",
      prompt: "Wozu dient die Primäre?",
      answer: "Sie bezeichnet die primäre CO2-Fixierung bei C4.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "PEP-Carboxylase.",
      wissen: "Primäre CO2-Fixierung bei C4. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Primäre"],
    },
    {
      concept: "bio:lk11:c3c4:5",
      prompt: "Lichtsammelkomplex?",
      answer: "Es kennzeichnet das Fängt Photonen und leitet Energie.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Lichtsammelkomplex.",
      wissen: "Fängt Photonen und leitet Energie. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:c3c4:6",
      prompt: "Was bewirkt Zusätzliche?",
      answer: "Sie kennzeichnet die O2-Reaktion von Rubisco; Verlust.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Photorespiration Problem.",
      wissen: "O2-Reaktion von Rubisco; Verlust. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:c3c4:7",
      prompt: "Wozu dient die Zusätzliche?",
      answer: "Sie ist die zeitliche Trennung der Fixierung.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "CAM grob.",
      wissen: "Zeitliche Trennung der Fixierung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:c3c4:8",
      prompt: "Warum C4 energetisch teurer?",
      answer: "Sie steht für die zusätzliche ATP-Schritte.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum C4 energetisch teurer.",
      wissen: "Zusätzliche ATP-Schritte. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Zusätzliche"],
    },
    {
      concept: "bio:lk11:c3c4:9",
      prompt: "Abiotische Faktoren?",
      answer: "Es umfasst Licht, CO2, Wasser und Temperatur beeinflussen Rate.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Abiotische Faktoren.",
      wissen: "Licht, CO2, Wasser, Temperatur beeinflussen Rate. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:c3c4:10",
      prompt: "Was beschreibt 10?",
      answer: "Es bezeichnet das Lebensraum diktiert Strategie.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Anpassung Bedeutung.",
      wissen: "Lebensraum diktiert Strategie. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk11:c3c4:p:1", term: "C3", meaning: "Kennzeichnet das Calvin direkt", wissen: "Rubisco. C3 bedeutet: Kennzeichnet das Calvin direkt." },
    { concept: "bio:lk11:c3c4:p:2", term: "C4", meaning: "Beschreibt die Raumtrennung", wissen: "PEP. C4 bedeutet: Beschreibt die Raumtrennung." },
    { concept: "bio:lk11:c3c4:p:3", term: "CAM", meaning: "Kennzeichnet die Zeittrennung", wissen: "Sukkulenten oft. CAM bedeutet: Kennzeichnet die Zeittrennung." },
    { concept: "bio:lk11:c3c4:p:4", term: "Rubisco", meaning: "Beschreibt das CO2/O2-Enzym", wissen: "Limit. Rubisco bedeutet: Beschreibt das CO2/O2-Enzym." },
    { concept: "bio:lk11:c3c4:p:5", term: "Photorespiration", meaning: "Kennzeichnet die Verlustweg", wissen: "Hitze. Photorespiration bedeutet: Kennzeichnet die Verlustweg." },
    { concept: "bio:lk11:c3c4:p:6", term: "PEP-Carboxylase", meaning: "Kennzeichnet die C4-Fixierung", wissen: "Mesophyll. PEP-Carboxylase bedeutet: Kennzeichnet die C4-Fixierung." },
    { concept: "bio:lk11:c3c4:p:7", term: "Bündelscheide", meaning: "Bezeichnet die C4-Ort", wissen: "Calvin. Bündelscheide bedeutet: Bezeichnet die C4-Ort." },
    { concept: "bio:lk11:c3c4:p:8", term: "LHC", meaning: "Beschreibt den Lichtsammler", wissen: "Antenne. LHC bedeutet: Beschreibt den Lichtsammler." },
    { concept: "bio:lk11:c3c4:p:9", term: "ATP-Kosten", meaning: "Kennzeichnet das Extraaufwand", wissen: "C4. ATP-Kosten bedeutet: Kennzeichnet das Extraaufwand." },
    { concept: "bio:lk11:c3c4:p:10", term: "Angepasstheit", meaning: "Kennzeichnet die Strategie", wissen: "Klima. Angepasstheit bedeutet: Kennzeichnet die Strategie." },
  ],
}

const lk11Atmung: BioBank = {
  quelle: "Wikipedia: Zellatmung",
  url: "https://de.wikipedia.org/wiki/Zellatmung",
  conceptPrefix: "bio:lk11:atmung",
  facts: [
    {
      concept: "bio:lk11:atmung:1",
      prompt: "Wozu dient Viel?",
      answer: "Es bezeichnet das Cytoplasma.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Glykolyse Ort.",
      wissen: "Cytoplasma. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:atmung:2",
      prompt: "Was bewirkt Viel?",
      answer: "Es kennzeichnet das Mitochondrienmatrix.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Citratzyklus Ort.",
      wissen: "Mitochondrienmatrix. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:atmung:3",
      prompt: "Was bewirkt Viel?",
      answer: "Es steht für die Innere Mitochondrienmembran.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Atmungskette Ort.",
      wissen: "Innere Mitochondrienmembran. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:atmung:4",
      prompt: "Was bewirkt Viel?",
      answer: "Es steht für den Viel ATP aus oxidativer Phosphorylierung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Bilanz grob.",
      wissen: "Viel ATP aus oxidativer Phosphorylierung. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Viel"],
    },
    {
      concept: "bio:lk11:atmung:5",
      prompt: "Was bewirkt ATP?",
      answer: "Es steht für die Währung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "NADH/FADH2 Rolle.",
      wissen: "Elektronenüberträger. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:atmung:6",
      prompt: "Was bewirkt ATP?",
      answer: "Es steht für die Währung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Chemiosmose.",
      wissen: "Protonengradient treibt ATP-Synthase. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:atmung:7",
      prompt: "Was bewirkt ATP?",
      answer: "Es steht für die Währung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Sauerstoff Rolle.",
      wissen: "Terminaler Elektronenakzeptor. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:atmung:8",
      prompt: "Was bewirkt ATP?",
      answer: "Es steht für die Währung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Substratkettenphosphorylierung.",
      wissen: "ATP direkt in Reaktionen. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["ATP"],
    },
    {
      concept: "bio:lk11:atmung:9",
      prompt: "Woran erkennt man 9?",
      answer: "Es steht für das Kompartiment für effiziente Oxidation.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum Mitochondrium nötig.",
      wissen: "Kompartiment für effiziente Oxidation. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:atmung:10",
      prompt: "Woran erkennt man 10?",
      answer: "Es steht für das 10 gilt Ohne O2; weniger ATP.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Vergleich Gärung.",
      wissen: "Ohne O2; weniger ATP. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk11:atmung:p:1", term: "Glykolyse", meaning: "Spaltet Glucose zu Pyruvat und liefert ATP im Cytoplasma", wissen: "Cytosol. Glykolyse bedeutet: Spaltet Glucose zu Pyruvat und liefert ATP im Cytoplasma." },
    { concept: "bio:lk11:atmung:p:2", term: "Citratzyklus", meaning: "Kennzeichnet den Oxidationszyklus", wissen: "Matrix. Citratzyklus bedeutet: Kennzeichnet den Oxidationszyklus." },
    { concept: "bio:lk11:atmung:p:3", term: "Atmungskette", meaning: "Kennzeichnet die ETransportrt", wissen: "Membran. Atmungskette bedeutet: Kennzeichnet die ETransportrt." },
    { concept: "bio:lk11:atmung:p:4", term: "ATP-Synthase", meaning: "Kennzeichnet die ATP-Bildung", wissen: "Gradient. ATP-Synthase bedeutet: Kennzeichnet die ATP-Bildung." },
    { concept: "bio:lk11:atmung:p:5", term: "NADH", meaning: "Kennzeichnet das Reduktionsäquivalent", wissen: "Träger. NADH bedeutet: Kennzeichnet das Reduktionsäquivalent." },
    { concept: "bio:lk11:atmung:p:6", term: "Chemiosmose", meaning: "Steht für die Protonenfluss", wissen: "Energie. Chemiosmose bedeutet: Steht für die Protonenfluss." },
    { concept: "bio:lk11:atmung:p:7", term: "O2", meaning: "Bezeichnet das Akzeptor", wissen: "Atmung. O2 bedeutet: Bezeichnet das Akzeptor." },
    { concept: "bio:lk11:atmung:p:8", term: "Matrix", meaning: "Steht für das Innenraum", wissen: "Zyklus. Matrix bedeutet: Kennzeichnet den Daten." },
    { concept: "bio:lk11:atmung:p:9", term: "Cristae", meaning: "Bezeichnet die Fläche", wissen: "Membran. Cristae bedeutet: Bezeichnet die Fläche." },
    { concept: "bio:lk11:atmung:p:10", term: "Dissimilation", meaning: "Kennzeichnet die Abbau", wissen: "Energie. Dissimilation bedeutet: Kennzeichnet die Abbau." },
  ],
}

const lk11Chemo: BioBank = {
  quelle: "Wikipedia: Chemosynthese",
  url: "https://de.wikipedia.org/wiki/Chemosynthese",
  conceptPrefix: "bio:lk11:chemo",
  facts: [
    {
      concept: "bio:lk11:chemo:1",
      prompt: "Chemosynthese?",
      answer: "Es dient als Energie aus anorganischen Redoxreaktionen für Assimilation.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Chemosynthese.",
      wissen: "Energie aus anorganischen Redoxreaktionen für Assimilation. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:chemo:2",
      prompt: "Was bewirkt Chemoautotrophe?",
      answer: "Sie steht für das Licht vs. chemische Redoxenergie.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Unterschied Fotosynthese.",
      wissen: "Licht vs. chemische Redoxenergie. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:chemo:3",
      prompt: "Wozu dient die Chemoautotrophe?",
      answer: "Sie beschreibt die Nitrifikation u. a. im N-Kreislauf.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Stickstoffbakterien Rolle.",
      wissen: "Nitrifikation u. a. im N-Kreislauf. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:chemo:4",
      prompt: "Was bewirkt Chemoautotrophe?",
      answer: "Sie steht für die Chemoautotrophe in speziellen Habitaten.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Produzenten ohne Licht.",
      wissen: "Chemoautotrophe in speziellen Habitaten. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Chemoautotrophe"],
    },
    {
      concept: "bio:lk11:chemo:5",
      prompt: "Elektronendonor Beispiel?",
      answer: "Es umfasst NH3 und H2S und Fe2+ je nach Gruppe.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Elektronendonor Beispiel.",
      wissen: "NH3, H2S, Fe2+ je nach Gruppe. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:chemo:6",
      prompt: "Was bewirkt Vielfalt?",
      answer: "Es steht für das Menschen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Ökosystembezug.",
      wissen: "Grundlage mancher Nahrungsnetze (z. B. Quellen). Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:chemo:7",
      prompt: "Was bewirkt Vielfalt?",
      answer: "Es steht für das Menschen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Autotrophie.",
      wissen: "Aufbau organischer Stoffe aus CO2. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:chemo:8",
      prompt: "Warum im Lehrplan?",
      answer: "Es steht für das Menschen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum im Lehrplan.",
      wissen: "Vielfalt der Energiegewinnung. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Vielfalt"],
    },
    {
      concept: "bio:lk11:chemo:9",
      prompt: "Was kennzeichnet 9?",
      answer: "Es kennzeichnet die Elektronenübergänge liefern Energie.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Redox.",
      wissen: "Elektronenübergänge liefern Energie. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:chemo:10",
      prompt: "Woran erkennt man 10?",
      answer: "Es beschreibt die Beide Redox; unterschiedliche Donoren/Akzeptoren.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Vergleich Atmung.",
      wissen: "Beide Redox; unterschiedliche Donoren/Akzeptoren. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk11:chemo:p:1", term: "Chemosynthese", meaning: "Bezeichnet die chemische Energie", wissen: "Assimilation. Chemosynthese bedeutet: Beschreibt die Redox chemisch." },
    { concept: "bio:lk11:chemo:p:2", term: "Nitrifikation", meaning: "Beschreibt den Vorgang Vorgang Vorgang NH3→Nitrat", wissen: "Bakterien. Nitrifikation bedeutet: Kennzeichnet die Zu Nitrat." },
    { concept: "bio:lk11:chemo:p:3", term: "Autotroph", meaning: "Steht für das Eigenaufbau", wissen: "CO2. Autotroph bedeutet: Beschreibt das selbst." },
    { concept: "bio:lk11:chemo:p:4", term: "Redox", meaning: "Steht für das EÜbergangng", wissen: "Energie. Redox bedeutet: Steht für das EÜbergangng." },
    { concept: "bio:lk11:chemo:p:5", term: "Donor", meaning: "Bezeichnet den Elektronenspender", wissen: "Anorganisch oft. Donor bedeutet: Bezeichnet den Elektronenspender." },
    { concept: "bio:lk11:chemo:p:6", term: "Fotosynthese", meaning: "Wandelt Lichtenergie in chemische Energie in Form von Glucose um", wissen: "Vergleich. Fotosynthese bedeutet: Wandelt Lichtenergie in chemische Energie in Form von Glucose um." },
    { concept: "bio:lk11:chemo:p:7", term: "Habitat", meaning: "Bezeichnet das z. B. Quellen", wissen: "Ohne Licht. Habitat bedeutet: Bezeichnet das z. B. Quellen. B. Quellen. B. Quellen. B. Quellen. B. Quellen." },
    { concept: "bio:lk11:chemo:p:8", term: "Produzent", meaning: "Kennzeichnet das Biomassebasis", wissen: "Netz. Produzent bedeutet: Kennzeichnet das Biomassebasis." },
    { concept: "bio:lk11:chemo:p:9", term: "N-Kreislauf", meaning: "Beschreibt das Stickstoff", wissen: "Bakterien. N-Kreislauf bedeutet: Beschreibt das Stickstoff." },
    { concept: "bio:lk11:chemo:p:10", term: "Energiefluss", meaning: "Kennzeichnet das Durchsatz", wissen: "Ökosystem. Energiefluss bedeutet: Bezeichnet das Einbahn." },
  ],
}

const lk11Gaerung: BioBank = {
  quelle: "Wikipedia: Gärung",
  url: "https://de.wikipedia.org/wiki/G%C3%A4rung",
  conceptPrefix: "bio:lk11:gaerung",
  facts: [
    {
      concept: "bio:lk11:gaerung:1",
      prompt: "Wozu dient NAD+?",
      answer: "Es dient als Oxidationsmittel.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Gärung Kennzeichen.",
      wissen: "Abbau ohne Sauerstoff; wenig ATP. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:gaerung:2",
      prompt: "Wozu dient NAD+?",
      answer: "Es dient als Oxidationsmittel.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Milchsäuregärung Produkt.",
      wissen: "Lactat. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:gaerung:3",
      prompt: "Wozu dient NAD+?",
      answer: "Es dient als Oxidationsmittel.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Alkoholische Gärung Produkte.",
      wissen: "Ethanol + CO2. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:gaerung:4",
      prompt: "Wozu dient NAD+?",
      answer: "Es dient als Oxidationsmittel.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Zweck Regenerierung.",
      wissen: "NAD+ aus NADH zurückgewinnen. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["NAD+"],
    },
    {
      concept: "bio:lk11:gaerung:5",
      prompt: "Woran erkennt man 5?",
      answer: "Es bezeichnet die Atmung liefert deutlich mehr ATP.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Vergleich Atmung ATP.",
      wissen: "Atmung liefert deutlich mehr ATP. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:gaerung:6",
      prompt: "Woran erkennt man 6?",
      answer: "Es steht für die Milchsäuregärung möglich.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Muskel bei O2-Mangel.",
      wissen: "Milchsäuregärung möglich. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:gaerung:7",
      prompt: "Was kennzeichnet 7?",
      answer: "Es kennzeichnet das Brot (CO2) und alkoholische Getränke.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Hefe technisch.",
      wissen: "Brot (CO2), alkoholische Getränke. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:gaerung:8",
      prompt: "Was beschreibt 8?",
      answer: "Es beschreibt das Produkthemmung/Energiearmut.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum nicht unbegrenzt.",
      wissen: "Produkthemmung/Energiearmut. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:gaerung:9",
      prompt: "Was kennzeichnet 9?",
      answer: "Es bezeichnet den Ersten Schritt vor Gärung/Atmung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Glykolyse gemeinsam.",
      wissen: "Erster Schritt vor Gärung/Atmung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:gaerung:10",
      prompt: "Was beschreibt 10?",
      answer: "Es steht für die Anaerobe Lebensräume.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Ökologische Nische.",
      wissen: "Anaerobe Lebensräume. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk11:gaerung:p:1", term: "Gärung", meaning: "Beschreibt die Anaerob", wissen: "Wenig ATP. Gärung bedeutet: Beschreibt die Anaerob." },
    { concept: "bio:lk11:gaerung:p:2", term: "Lactat", meaning: "Kennzeichnet die Milchsäuregärung", wissen: "Produkt. Lactat bedeutet: Kennzeichnet die Milchsäuregärung." },
    { concept: "bio:lk11:gaerung:p:3", term: "Ethanol", meaning: "Kennzeichnet die Alkoholgärung", wissen: "Produkt. Ethanol bedeutet: Kennzeichnet die Alkoholgärung." },
    { concept: "bio:lk11:gaerung:p:4", term: "NAD+", meaning: "Dient als Oxidationsmittel", wissen: "Regenerierung. NAD+ bedeutet: Dient als Oxidationsmittel." },
    { concept: "bio:lk11:gaerung:p:5", term: "Glykolyse", meaning: "Spaltet Glucose zu Pyruvat und liefert ATP im Cytoplasma", wissen: "Start. Glykolyse bedeutet: Spaltet Glucose zu Pyruvat und liefert ATP im Cytoplasma." },
    { concept: "bio:lk11:gaerung:p:6", term: "Anaerob", meaning: "Bezeichnet die ohne O2", wissen: "Bedingung. Anaerob bedeutet: Bezeichnet die ohne O2." },
    { concept: "bio:lk11:gaerung:p:7", term: "Hefe", meaning: "Bezeichnet die Technisch", wissen: "Gärung. Hefe bedeutet: Bezeichnet die Technisch." },
    { concept: "bio:lk11:gaerung:p:8", term: "ATP-Ausbeute", meaning: "Kennzeichnet die Niedrig", wissen: "Vergleich Atmung. ATP-Ausbeute bedeutet: Kennzeichnet die Niedrig." },
    { concept: "bio:lk11:gaerung:p:9", term: "Produkthemmung", meaning: "Beschreibt die Limit", wissen: "Selbst. Produkthemmung bedeutet: Beschreibt die Limit." },
    { concept: "bio:lk11:gaerung:p:10", term: "Muskel", meaning: "Bezeichnet das Kurzfristig", wissen: "Lactat. Muskel bedeutet: Bezeichnet das Kurzfristig." },
  ],
}

const lk11Heterotroph: BioBank = {
  quelle: "Wikipedia: Verdauung",
  url: "https://de.wikipedia.org/wiki/Verdauung",
  conceptPrefix: "bio:lk11:hetero",
  facts: [
    {
      concept: "bio:lk11:hetero:1",
      prompt: "Wozu dient 1?",
      answer: "Es dient als Aufnahme und Umbau organischer Stoffe.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Heterotrophe Assimilation.",
      wissen: "Aufnahme und Umbau organischer Stoffe. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:hetero:2",
      prompt: "Wozu dient die Enzyme?",
      answer: "Sie bezeichnet die Makromoleküle in resorbierbare Bausteine.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Verdauung Zweck.",
      wissen: "Makromoleküle in resorbierbare Bausteine. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:hetero:3",
      prompt: "Wozu dient die Enzyme?",
      answer: "Sie bezeichnet die Aktivität über Substratumsatz/Indikator.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Enzymnachweis grob.",
      wissen: "Aktivität über Substratumsatz/Indikator. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:hetero:4",
      prompt: "Wozu dient die Enzyme?",
      answer: "Sie ist die Enzyme außerhalb der Zelle.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Extrazelluläre Verdauung.",
      wissen: "Enzyme außerhalb der Zelle. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Enzyme"],
    },
    {
      concept: "bio:lk11:hetero:5",
      prompt: "Wozu dient Selbstaufbau?",
      answer: "Es ist das Abbau in der Zelle/Vakuole.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Intrazellulär.",
      wissen: "Abbau in der Zelle/Vakuole. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:hetero:6",
      prompt: "Wozu dient Selbstaufbau?",
      answer: "Es beschreibt die Aufnahme der Bausteine.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Resorption.",
      wissen: "Aufnahme der Bausteine. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:hetero:7",
      prompt: "Was bewirkt Selbstaufbau?",
      answer: "Es steht für die Dissimilation liefert ATP.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Energie aus Nahrung.",
      wissen: "Dissimilation liefert ATP. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:hetero:8",
      prompt: "Was bewirkt Selbstaufbau?",
      answer: "Es kennzeichnet das Selbstaufbau vs. Fremdbezug.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Vergleich Autotrophie.",
      wissen: "Selbstaufbau vs. Fremdbezug. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Selbstaufbau"],
    },
    {
      concept: "bio:lk11:hetero:9",
      prompt: "Woran erkennt man 9?",
      answer: "Es kennzeichnet das Passend zu KH/Fett/Eiweiß.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Spezifität Verdauungsenzyme.",
      wissen: "Passend zu KH/Fett/Eiweiß. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:hetero:10",
      prompt: "Was kennzeichnet 10?",
      answer: "Es kennzeichnet den Bedingungen und Spezifität erfahren.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum Praktikum Enzyme.",
      wissen: "Bedingungen und Spezifität erfahren. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk11:hetero:p:1", term: "Heterotroph", meaning: "Bezeichnet die Fremdernährung", wissen: "Organisch. Heterotroph bedeutet: Steht für das Fremd." },
    { concept: "bio:lk11:hetero:p:2", term: "Verdauung", meaning: "Kennzeichnet die Aufschluss", wissen: "Enzyme. Verdauung bedeutet: Kennzeichnet die Aufschluss." },
    { concept: "bio:lk11:hetero:p:3", term: "Resorption", meaning: "Kennzeichnet die Aufnahme", wissen: "Bausteine. Resorption bedeutet: Kennzeichnet die Aufnahme." },
    { concept: "bio:lk11:hetero:p:4", term: "Extrazellulär", meaning: "Beschreibt das Außerhalb", wissen: "Enzyme. Extrazellulär bedeutet: Beschreibt das Außerhalb." },
    { concept: "bio:lk11:hetero:p:5", term: "Intrazellulär", meaning: "Beschreibt das Innerhalb", wissen: "Abbau. Intrazellulär bedeutet: Beschreibt das Innerhalb." },
    { concept: "bio:lk11:hetero:p:6", term: "Amylase", meaning: "Beschreibt die Stärke", wissen: "Beispiel. Amylase bedeutet: Beschreibt die Stärke." },
    { concept: "bio:lk11:hetero:p:7", term: "Protease", meaning: "Bezeichnet die Eiweiß", wissen: "Beispiel. Protease bedeutet: Bezeichnet die Eiweiß." },
    { concept: "bio:lk11:hetero:p:8", term: "Lipase", meaning: "Bezeichnet die Fett", wissen: "Beispiel. Lipase bedeutet: Bezeichnet die Fett." },
    { concept: "bio:lk11:hetero:p:9", term: "Autotroph", meaning: "Beschreibt das Selbstaufbau", wissen: "Vergleich. Autotroph bedeutet: Beschreibt das selbst." },
    { concept: "bio:lk11:hetero:p:10", term: "ATP", meaning: "Steht für das Energie", wissen: "Dissimilation. ATP bedeutet: Steht für die Währung." },
  ],
}

const lk11PopModelle: BioBank = {
  quelle: "Wikipedia: Populationsdynamik",
  url: "https://de.wikipedia.org/wiki/Populationsdynamik",
  conceptPrefix: "bio:lk11:pop",
  facts: [
    {
      concept: "bio:lk11:pop:1",
      prompt: "Wozu dient die Wenige?",
      answer: "Sie bezeichnet die Konstante Rate ohne Begrenzung.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Exponentielles Wachstum.",
      wissen: "Konstante Rate ohne Begrenzung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:pop:2",
      prompt: "Was bewirkt Wenige?",
      answer: "Sie steht für die Annäherung an Tragfähigkeit K.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Logistisch.",
      wissen: "Annäherung an Tragfähigkeit K. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:pop:3",
      prompt: "Was bewirkt Wenige?",
      answer: "Sie steht für die Viele Nachkommen und Wenig Investition.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "R-Strategen.",
      wissen: "Viele Nachkommen, wenig Investition. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:pop:4",
      prompt: "Was bewirkt Wenige?",
      answer: "Sie bezeichnet den wenige Nachkommen und hohe Investition.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "K-Strategen.",
      wissen: "Wenige Nachkommen, hohe Investition. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Wenige"],
    },
    {
      concept: "bio:lk11:pop:5",
      prompt: "Wozu dient Nettozuwachs?",
      answer: "Es beschreibt den Räuber-Beute-Schwingungen modellhaft.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Lotka-Volterra grob.",
      wissen: "Räuber-Beute-Schwingungen modellhaft. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:pop:6",
      prompt: "Was bewirkt Nettozuwachs?",
      answer: "Es kennzeichnet die Regulation mit Populationsgröße.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Dichteabhängigkeit.",
      wissen: "Regulation mit Populationsgröße. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:pop:7",
      prompt: "Was bewirkt Nettozuwachs?",
      answer: "Es kennzeichnet das maximale langfristig tragbare Dichte.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Tragfähigkeit.",
      wissen: "Maximale langfristig tragbare Dichte. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:pop:8",
      prompt: "Wozu dient Nettozuwachs?",
      answer: "Es bezeichnet das Nettozuwachs pro Zeit.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Wachstumrate r.",
      wissen: "Nettozuwachs pro Zeit. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Nettozuwachs"],
    },
    {
      concept: "bio:lk11:pop:9",
      prompt: "Woran erkennt man 9?",
      answer: "Es beschreibt den Überschreiten von K mit Folgen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Übershoot.",
      wissen: "Überschreiten von K mit Folgen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:pop:10",
      prompt: "Was beschreibt 10?",
      answer: "Es bezeichnet den Szenarien und Mechanismen prüfen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum Modelle.",
      wissen: "Szenarien und Mechanismen prüfen. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk11:pop:p:1", term: "Exponentiell", meaning: "Bezeichnet die J-Kurve", wissen: "Unbegrenzt. Exponentiell bedeutet: Bezeichnet die J-Kurve." },
    { concept: "bio:lk11:pop:p:2", term: "Logistisch", meaning: "Kennzeichnet die S-Kurve", wissen: "K. Logistisch bedeutet: Kennzeichnet die S-Kurve." },
    { concept: "bio:lk11:pop:p:3", term: "Tragfähigkeit", meaning: "Steht für die K", wissen: "Limit. Tragfähigkeit bedeutet: Steht für die K." },
    { concept: "bio:lk11:pop:p:4", term: "r-Stratege", meaning: "Kennzeichnet die viele Junge", wissen: "Opportunistisch. r-Stratege bedeutet: Kennzeichnet die viele Junge." },
    { concept: "bio:lk11:pop:p:5", term: "K-Stratege", meaning: "Bezeichnet die wenige Junge", wissen: "Stabil. K-Stratege bedeutet: Bezeichnet die wenige Junge." },
    { concept: "bio:lk11:pop:p:6", term: "Lotka-Volterra", meaning: "Bezeichnet die Räuber-Beute", wissen: "Modell. Lotka-Volterra bedeutet: Bezeichnet die Räuber-Beute." },
    { concept: "bio:lk11:pop:p:7", term: "Dichteabhängig", meaning: "Bezeichnet die Regulation", wissen: "Ressourcen. Dichteabhängig bedeutet: Bezeichnet die Regulation." },
    { concept: "bio:lk11:pop:p:8", term: "r", meaning: "Beschreibt die Wachstumsrate", wissen: "Parameter. r bedeutet: Beschreibt die Wachstumsrate." },
    { concept: "bio:lk11:pop:p:9", term: "Übershoot", meaning: "Kennzeichnet das Überschuss", wissen: "Crashrisiko. Übershoot bedeutet: Kennzeichnet das Überschuss." },
    { concept: "bio:lk11:pop:p:10", term: "Modell", meaning: "Kennzeichnet die Vereinfachung", wissen: "Einsicht. Modell bedeutet: Kennzeichnet die Vereinfachung." },
  ],
}

const lk11Kreislauf: BioBank = {
  quelle: "Wikipedia: Stickstoffkreislauf",
  url: "https://de.wikipedia.org/wiki/Stickstoffkreislauf",
  conceptPrefix: "bio:lk11:kreislauf",
  facts: [
    {
      concept: "bio:lk11:kreislauf:1",
      prompt: "Wozu dient Nitrat?",
      answer: "Es dient als CO2 ↔ organischer C über Foto-/Atmung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "C-Kreislauf Kern.",
      wissen: "CO2 ↔ organischer C über Foto-/Atmung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:kreislauf:2",
      prompt: "Wozu dient Nitrat?",
      answer: "Es beschreibt den Vorgang Vorgang Vorgang N2 → bioverfügbare Formen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "N-Fixierung.",
      wissen: "N2 → bioverfügbare Formen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:kreislauf:3",
      prompt: "Wozu dient Nitrat?",
      answer: "Es beschreibt den Vorgang Vorgang Vorgang Ammonium → Nitrit/Nitrat.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Nitrifikation.",
      wissen: "Ammonium → Nitrit/Nitrat. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:kreislauf:4",
      prompt: "Wozu dient Nitrat?",
      answer: "Es beschreibt den Vorgang Vorgang Vorgang Nitrat → N2 (Verlust aus System).",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Denitrifikation.",
      wissen: "Nitrat → N2 (Verlust aus System). Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Nitrat"],
    },
    {
      concept: "bio:lk11:kreislauf:5",
      prompt: "Wozu dient 5?",
      answer: "Es dient als Mineralisierung organischer Stoffe.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Destruenten Rolle.",
      wissen: "Mineralisierung organischer Stoffe. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:kreislauf:6",
      prompt: "Was bewirkt Energie?",
      answer: "Sie kennzeichnet die fossile Emissionen.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Anthropogener Eingriff C.",
      wissen: "Fossile Emissionen. Fachlich themenspezifisch einordnen.",
    },
    { concept: "bio:lk11:kreislauf:7", prompt: "Wozu dient die Energie?", answer: "Sie erhöht Eintrag; Eutrophierung möglich.", wrong: ["Sie dient als Nur Stoffkreislauf ohne biologischen Bezug.", "Sie dient als nur Haarfarbe als Erklärung.", "Sie dient als Nur Zahnzahl ohne Stoffwechsel."],
      explanation: "Dünger und N.",
      wissen: "Erhöht Eintrag; Eutrophierung möglich. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:kreislauf:8",
      prompt: "Was bewirkt Energie?",
      answer: "Sie kennzeichnet die Energie einseitig und Stoffe zyklisch.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Energiefluss vs. Stoffkreislauf.",
      wissen: "Energie einseitig, Stoffe zyklisch. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Energie"],
    },
    {
      concept: "bio:lk11:kreislauf:9",
      prompt: "Was kennzeichnet 9?",
      answer: "Es steht für die symbiotische N-Fixierung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Knöllchenbakterien.",
      wissen: "Symbiotische N-Fixierung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:kreislauf:10",
      prompt: "Was beschreibt 10?",
      answer: "Es steht für die Eingriffe und Nachhaltigkeit beurteilen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum Kreisläufe kennen.",
      wissen: "Eingriffe und Nachhaltigkeit beurteilen. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk11:kreislauf:p:1", term: "Fixierung", meaning: "Beschreibt die N2 aktivieren", wissen: "Bakterien. Fixierung bedeutet: Beschreibt die N2 aktivieren." },
    { concept: "bio:lk11:kreislauf:p:2", term: "Nitrifikation", meaning: "Kennzeichnet die Zu Nitrat", wissen: "Oxidation. Nitrifikation bedeutet: Kennzeichnet die Zu Nitrat." },
    { concept: "bio:lk11:kreislauf:p:3", term: "Denitrifikation", meaning: "Beschreibt die Zu N2", wissen: "Verlust. Denitrifikation bedeutet: Beschreibt die Zu N2." },
    { concept: "bio:lk11:kreislauf:p:4", term: "Mineralisierung", meaning: "Beschreibt den Vorgang Vorgang Vorgang Organisch→anorganisch", wissen: "Destruenten. Mineralisierung bedeutet: Beschreibt den Vorgang Vorgang Vorgang Organisch→anorganisch." },
    { concept: "bio:lk11:kreislauf:p:5", term: "C-Kreislauf", meaning: "Bezeichnet das Kohlenstoff", wissen: "Foto/Atmung. C-Kreislauf bedeutet: Bezeichnet das Kohlenstoff." },
    { concept: "bio:lk11:kreislauf:p:6", term: "Emission", meaning: "Bezeichnet die Ausstoß", wissen: "Fossil. Emission bedeutet: Bezeichnet die Ausstoß." },
    { concept: "bio:lk11:kreislauf:p:7", term: "Eutrophierung", meaning: "Bezeichnet die Nährstoffüberschuss", wissen: "Gewässer. Eutrophierung bedeutet: Bezeichnet die Nährstoffüberschuss." },
    { concept: "bio:lk11:kreislauf:p:8", term: "Symbiose", meaning: "Kennzeichnet das Knöllchen", wissen: "Fixierung. Symbiose bedeutet: Kennzeichnet das Knöllchen." },
    { concept: "bio:lk11:kreislauf:p:9", term: "Energiefluss", meaning: "Bezeichnet das Einbahn", wissen: "Trophie. Energiefluss bedeutet: Bezeichnet das Einbahn." },
    { concept: "bio:lk11:kreislauf:p:10", term: "Destruent", meaning: "Bezeichnet den Zersetzer", wissen: "Recycling. Destruent bedeutet: Bezeichnet den Zersetzer." },
  ],
}

const lk11Landwirtschaft: BioBank = {
  quelle: "Wikipedia: Monokultur",
  url: "https://de.wikipedia.org/wiki/Monokultur",
  conceptPrefix: "bio:lk11:land",
  facts: [
    {
      concept: "bio:lk11:land:1",
      prompt: "Was beschreibt 1?",
      answer: "Es kennzeichnet die Anfälligkeit und Biodiversitätsverlust.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Monokultur Risiko.",
      wissen: "Anfälligkeit und Biodiversitätsverlust. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:land:2",
      prompt: "Was bewirkt Vielfalt?",
      answer: "Es steht für das Menschen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Ökologischer Fußabdruck.",
      wissen: "Ressourcenverbrauch/Fläche pro Person/Aktivität. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:land:3",
      prompt: "Was bewirkt Vielfalt?",
      answer: "Es steht für das Menschen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Schädlingsdruck.",
      wissen: "Steigt oft in homogenen Beständen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:land:4",
      prompt: "Was bewirkt Vielfalt?",
      answer: "Es steht für das Menschen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Alternative.",
      wissen: "Vielfalt, Fruchtfolge, IPS. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Vielfalt"],
    },
    {
      concept: "bio:lk11:land:5",
      prompt: "Was kennzeichnet 5?",
      answer: "Es steht für die Auswaschung und Eutrophierung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Düngerproblematik.",
      wissen: "Auswaschung, Eutrophierung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:land:6",
      prompt: "Was bewirkt Kurzfristgewinn?",
      answer: "Es kennzeichnet das Humus und Erosionsschutz und angepasste Bearbeitung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Boden schonen.",
      wissen: "Humus, Erosionsschutz, angepasste Bearbeitung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:land:7",
      prompt: "Wozu dient Kurzfristgewinn?",
      answer: "Es beschreibt die Limitierende Ressource in intensiver Produktion.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Wasserverbrauch.",
      wissen: "Limitierende Ressource in intensiver Produktion. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:land:8",
      prompt: "Was bewirkt Kurzfristgewinn?",
      answer: "Es kennzeichnet das Kurzfristgewinn vs. langfristige Kapazität.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Trade-off Ertrag–Umwelt.",
      wissen: "Kurzfristgewinn vs. langfristige Kapazität. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Kurzfristgewinn"],
    },
    {
      concept: "bio:lk11:land:9",
      prompt: "Was kennzeichnet 9?",
      answer: "Es umfasst Boden und Wasser und Arten und Emissionen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Indikatoren Nachhaltigkeit.",
      wissen: "Boden, Wasser, Arten, Emissionen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:land:10",
      prompt: "Woran erkennt man 10?",
      answer: "Es beschreibt die Nachfrage und Regeln steuern Praxis.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Politik/Verbrauch.",
      wissen: "Nachfrage und Regeln steuern Praxis. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk11:land:p:1", term: "Monokultur", meaning: "Beschreibt die Kultur", wissen: "Risiko. Monokultur bedeutet: Beschreibt die Kultur." },
    { concept: "bio:lk11:land:p:2", term: "Fußabdruck", meaning: "Steht für das Ressourcenmaß", wissen: "Verbrauch. Fußabdruck bedeutet: Steht für das Ressourcenmaß." },
    { concept: "bio:lk11:land:p:3", term: "Fruchtfolge", meaning: "Bezeichnet den Wechsel", wissen: "Schutz. Fruchtfolge bedeutet: Bezeichnet den Wechsel." },
    { concept: "bio:lk11:land:p:4", term: "Erosion", meaning: "Kennzeichnet die Bodenverlust", wissen: "Schutz nötig. Erosion bedeutet: Kennzeichnet die Bodenverlust." },
    { concept: "bio:lk11:land:p:5", term: "Humus", meaning: "Kennzeichnet den Bodenkohlenstoff", wissen: "Fruchtbarkeit. Humus bedeutet: Kennzeichnet den Bodenkohlenstoff." },
    { concept: "bio:lk11:land:p:6", term: "Auswaschung", meaning: "Steht für die Nährstoffverlust", wissen: "Gewässer. Auswaschung bedeutet: Steht für die Nährstoffverlust." },
    { concept: "bio:lk11:land:p:7", term: "IPS", meaning: "Beschreibt das Integriert", wissen: "Schädlinge. IPS bedeutet: Beschreibt das Integriert." },
    { concept: "bio:lk11:land:p:8", term: "Biodiversität", meaning: "Beschreibt die Vielfalt", wissen: "Stabilität. Biodiversität bedeutet: Beschreibt die Vielfalt." },
    { concept: "bio:lk11:land:p:9", term: "Trade-off", meaning: "Bezeichnet die Abwägung", wissen: "Ziele. Trade-off bedeutet: Bezeichnet die Abwägung." },
    { concept: "bio:lk11:land:p:10", term: "Indikator", meaning: "Steht für die Messgröße", wissen: "Nachhaltigkeit. Indikator bedeutet: Steht für die Messgröße." },
  ],
}

const lk11Naturschutz: BioBank = {
  quelle: "Wikipedia: Naturschutz",
  url: "https://de.wikipedia.org/wiki/Naturschutzgesetz",
  conceptPrefix: "bio:lk11:naturschutz",
  facts: [
    {
      concept: "bio:lk11:naturschutz:1",
      prompt: "Was kennzeichnet 1?",
      answer: "Es beschreibt den Klimawandel belastet Ökosysteme.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Treibhauseffekt Folge.",
      wissen: "Klimawandel belastet Ökosysteme. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:naturschutz:2",
      prompt: "Wozu dient die Unterschiedliche?",
      answer: "Sie beschreibt den rechtlichen Rahmen für Schutz.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Naturschutzgesetz Zweck.",
      wissen: "Rechtlicher Rahmen für Schutz. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:naturschutz:3",
      prompt: "Wozu dient die Unterschiedliche?",
      answer: "Sie beschreibt den Flussauen wieder anbinden.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Renaturierung Beispiel.",
      wissen: "Flussauen wieder anbinden. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:naturschutz:4",
      prompt: "Was bewirkt Unterschiedliche?",
      answer: "Sie kennzeichnet die unterschiedliche Strenge und Ziele.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Schutzgebietstypen grob.",
      wissen: "Unterschiedliche Strenge und Ziele. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Unterschiedliche"],
    },
    {
      concept: "bio:lk11:naturschutz:5",
      prompt: "Was bewirkt Monitoring?",
      answer: "Es kennzeichnet die Kontrolle.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Artenhilfsprogramm.",
      wissen: "Gezielte Maßnahmen für bedrohte Arten. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:naturschutz:6",
      prompt: "Was bewirkt Monitoring?",
      answer: "Es kennzeichnet die Kontrolle.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Biotopverbund.",
      wissen: "Vernetzung von Lebensräumen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:naturschutz:7",
      prompt: "Was bewirkt Monitoring?",
      answer: "Es kennzeichnet die Kontrolle.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Konflikt Infrastruktur.",
      wissen: "Zerschnittenheit und Verlust. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:naturschutz:8",
      prompt: "Was bewirkt Monitoring?",
      answer: "Es kennzeichnet die Kontrolle.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Erfolgskontrolle.",
      wissen: "Monitoring der Ziele. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Monitoring"],
    },
    {
      concept: "bio:lk11:naturschutz:9",
      prompt: "Welche Rolle hat 9?",
      answer: "Es beschreibt den Abkommen ergänzen nationales Recht.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Internationale Ebene.",
      wissen: "Abkommen ergänzen nationales Recht. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk11:naturschutz:10",
      prompt: "Was kennzeichnet 10?",
      answer: "Es bezeichnet die Fläche und Konsum und Engagement vor Ort.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Individuelle Handlung.",
      wissen: "Fläche, Konsum, Engagement vor Ort. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk11:naturschutz:p:1", term: "Naturschutzgesetz", meaning: "Steht für den Rechtsrahmen", wissen: "Schutz. Naturschutzgesetz bedeutet: Steht für den Rechtsrahmen." },
    { concept: "bio:lk11:naturschutz:p:2", term: "Renaturierung", meaning: "Steht für die Wiederherstellung", wissen: "Prozesse. Renaturierung bedeutet: Steht für die Wiederherstellung." },
    { concept: "bio:lk11:naturschutz:p:3", term: "Biotopverbund", meaning: "Bezeichnet die Vernetzung", wissen: "Wanderung. Biotopverbund bedeutet: Bezeichnet die Vernetzung." },
    { concept: "bio:lk11:naturschutz:p:4", term: "Schutzgebiet", meaning: "Bezeichnet das Reservat", wissen: "Rückzug. Schutzgebiet bedeutet: Bezeichnet das Reservat." },
    { concept: "bio:lk11:naturschutz:p:5", term: "Monitoring", meaning: "Kennzeichnet die Kontrolle", wissen: "Erfolg. Monitoring bedeutet: Kennzeichnet die Kontrolle." },
    { concept: "bio:lk11:naturschutz:p:6", term: "Klimawandel", meaning: "Steht für die Belastung", wissen: "Treibhaus. Klimawandel bedeutet: Steht für die Belastung." },
    { concept: "bio:lk11:naturschutz:p:7", term: "Zerschnittenheit", meaning: "Bezeichnet die Fragmentierung", wissen: "Straßen. Zerschnittenheit bedeutet: Bezeichnet die Fragmentierung." },
    { concept: "bio:lk11:naturschutz:p:8", term: "Artenhilfe", meaning: "Kennzeichnet Maßnahmen", wissen: "Bedroht. Artenhilfe bedeutet: Kennzeichnet Maßnahmen." },
    { concept: "bio:lk11:naturschutz:p:9", term: "Aue", meaning: "Kennzeichnet die Flusslandschaft", wissen: "Renaturierung. Aue bedeutet: Kennzeichnet die Flusslandschaft." },
    { concept: "bio:lk11:naturschutz:p:10", term: "Engagement", meaning: "Beschreibt das Handeln", wissen: "Lokal. Engagement bedeutet: Beschreibt das Handeln." },
  ],
}

const lk12Vererbung: BioBank = {
  quelle: "Wikipedia: Mendelsche Regeln",
  url: "https://de.wikipedia.org/wiki/Mendel_sche_Regeln",
  conceptPrefix: "bio:lk12:vererb",
  facts: [
    {
      concept: "bio:lk12:vererb:1",
      prompt: "Gekoppelte Gene?",
      answer: "Es beschreibt den Liegen auf demselben Chromosom; selten unabhängig.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Gekoppelte Gene.",
      wissen: "Liegen auf demselben Chromosom; selten unabhängig. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:vererb:2",
      prompt: "Wozu dient die Erbgutänderung?",
      answer: "Sie bezeichnet die unabhängige Kombination (verschiedene Chromosomen).",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Ungekoppelt.",
      wissen: "Unabhängige Kombination (verschiedene Chromosomen). Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:vererb:3",
      prompt: "Wozu dient die Erbgutänderung?",
      answer: "Sie beschreibt die Multiples Allelsystem; Codominanz A/B.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Blutgruppen ABO.",
      wissen: "Multiples Allelsystem; Codominanz A/B. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:vererb:4",
      prompt: "Wozu dient die Erbgutänderung?",
      answer: "Sie bezeichnet die Erbgutänderung vs. Umweltphänotyp.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Mutation vs. Modifikation.",
      wissen: "Erbgutänderung vs. Umweltphänotyp. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Erbgutänderung"],
    },
    {
      concept: "bio:lk12:vererb:5",
      prompt: "Wozu dient Auf?",
      answer: "Es bezeichnet die Neue Allelkombinationen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Rekombination.",
      wissen: "Neue Allelkombinationen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:vererb:6",
      prompt: "Wozu dient Auf?",
      answer: "Es bezeichnet das mischerbiger Zwischenphänotyp.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Intermediär.",
      wissen: "Mischerbiger Zwischenphänotyp. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:vererb:7",
      prompt: "Was bewirkt Auf?",
      answer: "Es kennzeichnet den Allel bestimmt Phänotyp.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Dominant-rezessiv.",
      wissen: "Ein Allel bestimmt Phänotyp. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:vererb:8",
      prompt: "Wozu dient Auf?",
      answer: "Es beschreibt das Auf Geschlechtschromosomen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Gonosomal.",
      wissen: "Auf Geschlechtschromosomen. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Auf"],
    },
    {
      concept: "bio:lk12:vererb:9",
      prompt: "Was beschreibt 9?",
      answer: "Es steht für das Auf Autosomen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Autosomal.",
      wissen: "Auf Autosomen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:vererb:10",
      prompt: "Woran erkennt man 10?",
      answer: "Es beschreibt das Austausch zwischen Homologen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Crossing-over.",
      wissen: "Austausch zwischen Homologen. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk12:vererb:p:1", term: "Kopplung", meaning: "Bezeichnet die gleiche Chromosome", wissen: "Abweichung Mendel. Kopplung bedeutet: Bezeichnet die gleiche Chromosome." },
    { concept: "bio:lk12:vererb:p:2", term: "Crossing-over", meaning: "Bezeichnet den Austausch", wissen: "Rekombination. Crossing-over bedeutet: Bezeichnet den Austausch." },
    { concept: "bio:lk12:vererb:p:3", term: "Codominanz", meaning: "Beschreibt die Beide sichtbar", wissen: "AB. Codominanz bedeutet: Beschreibt die Beide sichtbar." },
    { concept: "bio:lk12:vererb:p:4", term: "Modifikation", meaning: "Kennzeichnet die Umwelt", wissen: "Nicht erblich. Modifikation bedeutet: Kennzeichnet die Umwelt." },
    { concept: "bio:lk12:vererb:p:5", term: "Mutation", meaning: "Steht für die Erbgut", wissen: "Erblich. Mutation bedeutet: Steht für die Erbgut." },
    { concept: "bio:lk12:vererb:p:6", term: "Gonosomal", meaning: "Beschreibt das Geschlechtschromosom", wissen: "X/Y. Gonosomal bedeutet: Beschreibt das Geschlechtschromosom." },
    { concept: "bio:lk12:vererb:p:7", term: "Autosomal", meaning: "Beschreibt das Autosom", wissen: "1–22 Mensch. Autosomal bedeutet: Beschreibt das Autosom." },
    { concept: "bio:lk12:vererb:p:8", term: "Intermediär", meaning: "Kennzeichnet die Zwischenform", wissen: "Unvollständig. Intermediär bedeutet: Kennzeichnet die Zwischenform." },
    { concept: "bio:lk12:vererb:p:9", term: "Rekombination", meaning: "Bezeichnet die neue Kombi", wissen: "Vielfalt. Rekombination bedeutet: Bezeichnet die neue Kombi." },
    { concept: "bio:lk12:vererb:p:10", term: "Allel", meaning: "Steht für die Genvariante", wissen: "Locus. Allel bedeutet: Steht für die Genvariante." },
  ],
}

const lk12Human: BioBank = {
  quelle: "Wikipedia: Humangenetik",
  url: "https://de.wikipedia.org/wiki/Humangenetik",
  conceptPrefix: "bio:lk12:human",
  facts: [
    {
      concept: "bio:lk12:human:1",
      prompt: "Was kennzeichnet 1?",
      answer: "Es bezeichnet den Musten und Chromosomenstatus.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Stammbaum + Karyogramm.",
      wissen: "Muster und Chromosomenstatus. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:human:2",
      prompt: "Was bewirkt Oft?",
      answer: "Es kennzeichnet die molekulare Analysewerkzeuge.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "PCR/Sequenz/Gel.",
      wissen: "Molekulare Analysewerkzeuge. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:human:3",
      prompt: "Was bewirkt Oft?",
      answer: "Es kennzeichnet den Gen auf Autosom; Vererbung nach Dominanz/Rezessivität.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Autosomale Erbkrankheit Beispielprinzip.",
      wissen: "Gen auf Autosom; Vererbung nach Dominanz/Rezessivität. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:human:4",
      prompt: "Wozu dient Oft?",
      answer: "Es beschreibt das Oft X-gebunden; geschlechtsunterschiedlich.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Gonosomale Erbkrankheit.",
      wissen: "Oft X-gebunden; geschlechtsunterschiedlich. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Oft"],
    },
    {
      concept: "bio:lk12:human:5",
      prompt: "Woran erkennt man 5?",
      answer: "Es kennzeichnet die Klinik + Stammbaum + Molekular.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Integration Diagnostik.",
      wissen: "Klinik + Stammbaum + Molekular. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:human:6",
      prompt: "Was bewirkt Testergebnis?",
      answer: "Es steht für das Aus Erbgang und Familienanamnese.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Risikoberechnung grob.",
      wissen: "Aus Erbgang und Familienanamnese. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:human:7",
      prompt: "Was bewirkt Testergebnis?",
      answer: "Es steht für die Freiwilligkeit und Datenschutz und Nicht-Diskriminierung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Ethik Diagnostik.",
      wissen: "Freiwilligkeit, Datenschutz, Nicht-Diskriminierung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:human:8",
      prompt: "Was bewirkt Testergebnis?",
      answer: "Es steht für das Testergebnis nicht gleich Diagnose absolut.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Falsch-positiv Risiko.",
      wissen: "Testergebnis nicht gleich Diagnose absolut. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Testergebnis"],
    },
    {
      concept: "bio:lk12:human:9",
      prompt: "Woran erkennt man 9?",
      answer: "Es bezeichnet den Verstehen und Entscheiden ermöglichen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Beratung Ziel.",
      wissen: "Verstehen und Entscheiden ermöglichen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:human:10",
      prompt: "Was kennzeichnet 10?",
      answer: "Es kennzeichnet die Penetranz und Polygenie und Umwelt.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Limitationen.",
      wissen: "Penetranz, Polygenie, Umwelt. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk12:human:p:1", term: "Karyogramm", meaning: "Bezeichnet den Chromosomen", wissen: "Anzahl. Karyogramm bedeutet: Bezeichnet den Chromosomen." },
    { concept: "bio:lk12:human:p:2", term: "Stammbaum", meaning: "Kennzeichnet das Familie", wissen: "Erbgang. Stammbaum bedeutet: Beschreibt die Verwandtschaftshypothese." },
    { concept: "bio:lk12:human:p:3", term: "X-gebunden", meaning: "Kennzeichnet das Gonosomal", wissen: "Geschlecht. X-gebunden bedeutet: Kennzeichnet das Gonosomal." },
    { concept: "bio:lk12:human:p:4", term: "Penetranz", meaning: "Bezeichnet die Durchschlag", wissen: "Variabel. Penetranz bedeutet: Bezeichnet die Durchschlag." },
    { concept: "bio:lk12:human:p:5", term: "Polygenie", meaning: "Kennzeichnet die viele Gene", wissen: "Komplex. Polygenie bedeutet: Kennzeichnet die viele Gene." },
    { concept: "bio:lk12:human:p:6", term: "PCR", meaning: "Beschreibt die Amplifikation", wissen: "Labor. PCR bedeutet: Beschreibt die Amplifikation." },
    { concept: "bio:lk12:human:p:7", term: "Beratung", meaning: "Beschreibt die Aufklärung", wissen: "Ethik. Beratung bedeutet: Beschreibt die Aufklärung." },
    { concept: "bio:lk12:human:p:8", term: "Datenschutz", meaning: "Kennzeichnet das Schutz", wissen: "Genetik. Datenschutz bedeutet: Kennzeichnet das Schutz." },
    { concept: "bio:lk12:human:p:9", term: "Risiko", meaning: "Steht für die Wahrscheinlichkeit", wissen: "Schätzung. Risiko bedeutet: Steht für die Wahrscheinlichkeit." },
    { concept: "bio:lk12:human:p:10", term: "Diagnostik", meaning: "Beschreibt die Nachweis", wissen: "Methoden. Diagnostik bedeutet: Beschreibt die Nachweis." },
  ],
}

const lk12Krebs: BioBank = {
  quelle: "Wikipedia: Onkogen",
  url: "https://de.wikipedia.org/wiki/Onkogen",
  conceptPrefix: "bio:lk12:krebs",
  facts: [
    {
      concept: "bio:lk12:krebs:1",
      prompt: "Woran erkennt man 1?",
      answer: "Es beschreibt das Fördert unkontrolliertes Wachstum wenn aktiviert.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Onkogen.",
      wissen: "Fördert unkontrolliertes Wachstum wenn aktiviert. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:krebs:2",
      prompt: "Was bewirkt Therapie?",
      answer: "Sie kennzeichnet die Hemmt Wachstum; Ausfall begünstigt Krebs.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Tumorsuppressor/Anti-Onkogen.",
      wissen: "Hemmt Wachstum; Ausfall begünstigt Krebs. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:krebs:3",
      prompt: "Was bewirkt Therapie?",
      answer: "Sie kennzeichnet die mehrere Mutationen nötig.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Mehrschritt-Modell.",
      wissen: "Mehrere Mutationen nötig. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:krebs:4",
      prompt: "Wozu dient die Therapie?",
      answer: "Sie beschreibt die Therapie nach molekularen Markern.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Personalisierte Medizin.",
      wissen: "Therapie nach molekularen Markern. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Therapie"],
    },
    {
      concept: "bio:lk12:krebs:5",
      prompt: "Wozu dient die Mutagene?",
      answer: "Sie dient als Absiedelung in andere Organe.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Metastase.",
      wissen: "Absiedelung in andere Organe. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:krebs:6",
      prompt: "Was bewirkt Mutagene?",
      answer: "Sie kennzeichnet die Checkpoints versagen.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Zellzyklus-Entgleisung.",
      wissen: "Checkpoints versagen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:krebs:7",
      prompt: "Wozu dient die Mutagene?",
      answer: "Sie bezeichnet den Zellen sterben nicht kontrolliert.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Apoptoseverlust.",
      wissen: "Zellen sterben nicht kontrolliert. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:krebs:8",
      prompt: "Was bewirkt Mutagene?",
      answer: "Sie steht für die Mutagene, Viren und Entzündung und Lifestyle je nach Typ.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Risikofaktoren.",
      wissen: "Mutagene, Viren, Entzündung, Lifestyle je nach Typ. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Mutagene"],
    },
    {
      concept: "bio:lk12:krebs:9",
      prompt: "Was kennzeichnet 9?",
      answer: "Es kennzeichnet die Bessere Behandlungschancen oft.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Früherkennung Vorteil.",
      wissen: "Bessere Behandlungschancen oft. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:krebs:10",
      prompt: "Was beschreibt 10?",
      answer: "Es umfasst Chirurgie, Strahl und Chemo und Zielgerichtet und Immuno.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Therapieprinzipien grob.",
      wissen: "Chirurgie, Strahl, Chemo, zielgerichtet, Immuno. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk12:krebs:p:1", term: "Onkogen", meaning: "Beschreibt den Wachstumsförderer", wissen: "Aktiviert. Onkogen bedeutet: Beschreibt den Wachstumsförderer." },
    { concept: "bio:lk12:krebs:p:2", term: "Suppressorgen", meaning: "Kennzeichnet die Bremse", wissen: "Ausfall. Suppressorgen bedeutet: Kennzeichnet die Bremse." },
    { concept: "bio:lk12:krebs:p:3", term: "Metastase", meaning: "Steht für die Streuung", wissen: "Fortschritt. Metastase bedeutet: Steht für die Streuung." },
    { concept: "bio:lk12:krebs:p:4", term: "Checkpoint", meaning: "Kennzeichnet die Kontrolle", wissen: "Zyklus. Checkpoint bedeutet: Kennzeichnet die Kontrolle." },
    { concept: "bio:lk12:krebs:p:5", term: "Apoptose", meaning: "Bezeichnet die Programmiert Tod", wissen: "Schutz. Apoptose bedeutet: Bezeichnet die Programmiert Tod." },
    { concept: "bio:lk12:krebs:p:6", term: "Marker", meaning: "Kennzeichnet das Kennzeichen", wissen: "Personalisiert. Marker bedeutet: Kennzeichnet das Kennzeichen." },
    { concept: "bio:lk12:krebs:p:7", term: "Mutagen", meaning: "Kennzeichnet das Mutationsauslösend", wissen: "Risiko. Mutagen bedeutet: Kennzeichnet das Mutationsauslösend." },
    { concept: "bio:lk12:krebs:p:8", term: "Tumor", meaning: "Beschreibt den Geschwulst", wissen: "Neoplasie. Tumor bedeutet: Beschreibt den Geschwulst." },
    { concept: "bio:lk12:krebs:p:9", term: "Immuntherapie", meaning: "Bezeichnet die Abwehr nutzen", wissen: "Modern. Immuntherapie bedeutet: Bezeichnet die Abwehr nutzen." },
    { concept: "bio:lk12:krebs:p:10", term: "Früherkennung", meaning: "Beschreibt die Screening", wissen: "Chance. Früherkennung bedeutet: Beschreibt die Screening." },
  ],
}

const lk12Gentechnik: BioBank = {
  quelle: "Wikipedia: Gentechnik",
  url: "https://de.wikipedia.org/wiki/Gentechnik",
  conceptPrefix: "bio:lk12:gentech",
  facts: [
    {
      concept: "bio:lk12:gentech:1",
      prompt: "Wozu dient Direkter?",
      answer: "Er beschreibt den Schleusen Gene in Zellen.",
      wrong: [
        "Er betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Vektor Bakterien/Viren.",
      wissen: "Schleusen Gene in Zellen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:gentech:2",
      prompt: "Wozu dient Direkter?",
      answer: "Er bezeichnet die Aufnahme freier DNA (Bakterien).",
      wrong: [
        "Er betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Transformation.",
      wissen: "Aufnahme freier DNA (Bakterien). Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:gentech:3",
      prompt: "Wozu dient Direkter?",
      answer: "Er bezeichnet die Genübertragung durch Viren.",
      wrong: [
        "Er betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Transduktion.",
      wissen: "Genübertragung durch Viren. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:gentech:4",
      prompt: "Wozu dient Direkter?",
      answer: "Er beschreibt den Direkten DNA-Austausch Bakterien.",
      wrong: [
        "Er betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Konjugation.",
      wissen: "Direkter DNA-Austausch Bakterien. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Direkter"],
    },
    {
      concept: "bio:lk12:gentech:5",
      prompt: "Was kennzeichnet 5?",
      answer: "Es steht für die Krankheitsgene korrigieren/ersetzen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Gentherapie Ziel.",
      wissen: "Krankheitsgene korrigieren/ersetzen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:gentech:6",
      prompt: "Was bewirkt Freisetzung?",
      answer: "Sie steht für die Umwelt.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Stammzellen Nutzen/Risiko.",
      wissen: "Differenzierungspotenzial vs. Kontrolle/Ethik. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:gentech:7",
      prompt: "Was bewirkt Freisetzung?",
      answer: "Sie steht für die Umwelt.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "CRISPR grob.",
      wissen: "Gezielte Genomeditierung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:gentech:8",
      prompt: "Was bewirkt Freisetzung?",
      answer: "Sie steht für die Umwelt.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Biosicherheit.",
      wissen: "Freisetzung und Kontamination vermeiden. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Freisetzung"],
    },
    {
      concept: "bio:lk12:gentech:9",
      prompt: "Welche Rolle hat 9?",
      answer: "Es kennzeichnet den Chancen und Risiken und Gerechtigkeit.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Ethik Gentechnik.",
      wissen: "Chancen, Risiken, Gerechtigkeit. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:gentech:10",
      prompt: "Was kennzeichnet 10?",
      answer: "Es beschreibt den PCR/Sequenzen/Marker.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Nachweis gentechnisch.",
      wissen: "PCR/Sequenzen/Marker. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk12:gentech:p:1", term: "Vektor", meaning: "Kennzeichnet den Träger", wissen: "Virus/Plasmid. Vektor bedeutet: Kennzeichnet den Träger." },
    { concept: "bio:lk12:gentech:p:2", term: "Transformation", meaning: "Steht für die DNA-Aufnahme", wissen: "Bakterien. Transformation bedeutet: Steht für die DNA-Aufnahme." },
    { concept: "bio:lk12:gentech:p:3", term: "Transduktion", meaning: "Beschreibt die Via Virus", wissen: "Übertragung. Transduktion bedeutet: Beschreibt die Via Virus." },
    { concept: "bio:lk12:gentech:p:4", term: "Konjugation", meaning: "Bezeichnet die Kontakt", wissen: "Austausch. Konjugation bedeutet: Bezeichnet die Kontakt." },
    { concept: "bio:lk12:gentech:p:5", term: "CRISPR", meaning: "Bezeichnet die Editierung", wissen: "Gezielt. CRISPR bedeutet: Bezeichnet die Editierung." },
    { concept: "bio:lk12:gentech:p:6", term: "Biosicherheit", meaning: "Bezeichnet die Schutz", wissen: "Containment. Biosicherheit bedeutet: Bezeichnet die Schutz." },
    { concept: "bio:lk12:gentech:p:7", term: "Gentherapie", meaning: "Beschreibt die Heilansatz", wissen: "Somatisch. Gentherapie bedeutet: Beschreibt die Heilansatz." },
    { concept: "bio:lk12:gentech:p:8", term: "Stammzelle", meaning: "Kennzeichnet die Potenzial", wissen: "Ethik. Stammzelle bedeutet: Kennzeichnet die Potenzial." },
    { concept: "bio:lk12:gentech:p:9", term: "Freisetzung", meaning: "Steht für die Umwelt", wissen: "Risiko. Freisetzung bedeutet: Steht für die Umwelt." },
    { concept: "bio:lk12:gentech:p:10", term: "Nachweis", meaning: "Steht für die Labormethode", wissen: "PCR. Nachweis bedeutet: Steht für die Labormethode." },
  ],
}

const lk12Immun: BioBank = {
  quelle: "Wikipedia: Immunologie",
  url: "https://de.wikipedia.org/wiki/Immunologie",
  conceptPrefix: "bio:lk12:immun",
  facts: [
    {
      concept: "bio:lk12:immun:1",
      prompt: "Was kennzeichnet 1?",
      answer: "Es steht für das hIV schwächt spezifische Abwehr (T-Helfer).",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "AIDS Mechanismus grob.",
      wissen: "HIV schwächt spezifische Abwehr (T-Helfer). Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:immun:2",
      prompt: "Wozu dient die Selektion?",
      answer: "Sie beschreibt die Gerichtet.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Hepatitis Risiko.",
      wissen: "Leberentzündung; Impfung/Hygiene je nach Typ. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:immun:3",
      prompt: "Wozu dient die Selektion?",
      answer: "Sie beschreibt die Gerichtet.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Tuberkulose.",
      wissen: "Bakterielle Infektion; lange Therapie. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:immun:4",
      prompt: "Wozu dient die Selektion?",
      answer: "Sie beschreibt die Gerichtet.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Antibiotikaresistenz.",
      wissen: "Selektion resistenter Bakterien. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Selektion"],
    },
    {
      concept: "bio:lk12:immun:5",
      prompt: "Was beschreibt 5?",
      answer: "Es kennzeichnet die Abstoßung durch Immunerkennung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Transplantation Problem.",
      wissen: "Abstoßung durch Immunerkennung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:immun:6",
      prompt: "Was bewirkt Hoher?",
      answer: "Er kennzeichnet den Dämpft Abwehr; Infektrisiko.",
      wrong: [
        "Er betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Immunsuppression.",
      wissen: "Dämpft Abwehr; Infektrisiko. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:immun:7",
      prompt: "Was bewirkt Hoher?",
      answer: "Er kennzeichnet die Eigenproduktion vs. fertige Antikörper.",
      wrong: [
        "Er betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Aktive vs. passive Immunisierung.",
      wissen: "Eigenproduktion vs. fertige Antikörper. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:immun:8",
      prompt: "Was bewirkt Hoher?",
      answer: "Er kennzeichnet den hohen Impfschutz mindert Ausbreitung.",
      wrong: [
        "Er betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Herdenschutz.",
      wissen: "Hoher Impfschutz mindert Ausbreitung. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Hoher"],
    },
    {
      concept: "bio:lk12:immun:9",
      prompt: "Was kennzeichnet 9?",
      answer: "Es kennzeichnet das Erreger/Antikörper/Antigen-Nachweis.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Diagnostik Infektion.",
      wissen: "Erreger/Antikörper/Antigen-Nachweis. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:immun:10",
      prompt: "Warum Kombination Prävention?",
      answer: "Es kennzeichnet die Hygiene + Impfung + Therapie gezielt.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum Kombination Prävention.",
      wissen: "Hygiene + Impfung + Therapie gezielt. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk12:immun:p:1", term: "HIV", meaning: "Steht für das Retrovirus", wissen: "AIDS. HIV bedeutet: Steht für das Retrovirus." },
    { concept: "bio:lk12:immun:p:2", term: "T-Helfer", meaning: "Kennzeichnet die Koordination", wissen: "Abwehr. T-Helfer bedeutet: Kennzeichnet die Koordination." },
    { concept: "bio:lk12:immun:p:3", term: "Resistenz", meaning: "Beschreibt die Unempfindlich", wissen: "Antibiotika. Resistenz bedeutet: Beschreibt die Unempfindlich." },
    { concept: "bio:lk12:immun:p:4", term: "Abstoßung", meaning: "Bezeichnet die Fremderkennung", wissen: "Transplant. Abstoßung bedeutet: Bezeichnet die Fremderkennung." },
    { concept: "bio:lk12:immun:p:5", term: "Immunsuppression", meaning: "Kennzeichnet die Dämpfung", wissen: "Therapie. Immunsuppression bedeutet: Kennzeichnet die Dämpfung." },
    { concept: "bio:lk12:immun:p:6", term: "Aktiv", meaning: "Steht für die eigene AK", wissen: "Impfung. Aktiv bedeutet: Steht für die eigene AK." },
    { concept: "bio:lk12:immun:p:7", term: "Passiv", meaning: "Steht für das fertige AK", wissen: "Sofort. Passiv bedeutet: Steht für das fertige AK." },
    { concept: "bio:lk12:immun:p:8", term: "Herdenschutz", meaning: "Bezeichnet die Gemeinschaft", wissen: "Impfung. Herdenschutz bedeutet: Bezeichnet die Gemeinschaft." },
    { concept: "bio:lk12:immun:p:9", term: "Tuberkulose", meaning: "Bezeichnet den Mykobakterien", wissen: "Lunge oft. Tuberkulose bedeutet: Bezeichnet den Mykobakterien." },
    { concept: "bio:lk12:immun:p:10", term: "Hepatitis", meaning: "Kennzeichnet den Leber", wissen: "Viren. Hepatitis bedeutet: Kennzeichnet den Leber." },
  ],
}

const lk12Neuro: BioBank = {
  quelle: "Wikipedia: Neurophysiologie",
  url: "https://de.wikipedia.org/wiki/Neurophysiologie",
  conceptPrefix: "bio:lk12:neuro",
  facts: [
    {
      concept: "bio:lk12:neuro:1",
      prompt: "Wozu dient die Muskelelektrik?",
      answer: "Sie dient als lokale Sensorpotenzial.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Rezeptorpotenzial.",
      wissen: "Lokales Sensorpotenzial. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:neuro:2",
      prompt: "Was bewirkt Muskelelektrik?",
      answer: "Sie steht für die Addition synaptischer Eingänge.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Summation.",
      wissen: "Addition synaptischer Eingänge. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:neuro:3",
      prompt: "Wozu dient die Muskelelektrik?",
      answer: "Sie beschreibt die hirnelektrische Aktivität von außen.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "EEG grob.",
      wissen: "Hirnelektrische Aktivität von außen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:neuro:4",
      prompt: "Was bewirkt Muskelelektrik?",
      answer: "Sie steht für die Muskelelektrik.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "EMG grob.",
      wissen: "Muskelelektrik. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Muskelelektrik"],
    },
    {
      concept: "bio:lk12:neuro:5",
      prompt: "Was beschreibt 5?",
      answer: "Es beschreibt die Neuroendokrine Achse.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Hypothalamus-Hypophyse.",
      wissen: "Neuroendokrine Achse. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:neuro:6",
      prompt: "Wozu dient die Abnehmende?",
      answer: "Sie beschreibt die Schnell vs. langsam/dauerhaft ergänzen sich.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Hormone + Nerven.",
      wissen: "Schnell vs. langsam/dauerhaft ergänzen sich. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:neuro:7",
      prompt: "Wozu dient die Abnehmende?",
      answer: "Sie bezeichnet die Erregende/hemmende Potenziale.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "EPSP/IPSP grob.",
      wissen: "Erregende/hemmende Potenziale. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:neuro:8",
      prompt: "Was bewirkt Abnehmende?",
      answer: "Sie steht für die Abnehmende Antwort bei Dauerreiz.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Adaptation Sensor.",
      wissen: "Abnehmende Antwort bei Dauerreiz. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Abnehmende"],
    },
    {
      concept: "bio:lk12:neuro:9",
      prompt: "Was beschreibt 9?",
      answer: "Es steht für das Gehirn/Rückenmark vs. Nerven.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Zentrale vs. periphere.",
      wissen: "Gehirn/Rückenmark vs. Nerven. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:neuro:10",
      prompt: "Welche Rolle hat 10?",
      answer: "Es beschreibt die Funktion und Störungen objektivieren.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Messung Nutzen.",
      wissen: "Funktion und Störungen objektivieren. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk12:neuro:p:1", term: "Rezeptorpotenzial", meaning: "Dient als Sensorlokal", wissen: "Reiz. Rezeptorpotenzial bedeutet: Dient als Sensorlokal." },
    { concept: "bio:lk12:neuro:p:2", term: "Summation", meaning: "Beschreibt die Addition", wissen: "Synapse. Summation bedeutet: Beschreibt die Addition." },
    { concept: "bio:lk12:neuro:p:3", term: "EEG", meaning: "Bezeichnet das Hirnstrom", wissen: "Messung. EEG bedeutet: Bezeichnet das Hirnstrom." },
    { concept: "bio:lk12:neuro:p:4", term: "EMG", meaning: "Beschreibt das Muskelstrom", wissen: "Messung. EMG bedeutet: Beschreibt das Muskelstrom." },
    { concept: "bio:lk12:neuro:p:5", term: "Hypothalamus", meaning: "Beschreibt die Steuerung", wissen: "Endokrin. Hypothalamus bedeutet: Beschreibt die Steuerung." },
    { concept: "bio:lk12:neuro:p:6", term: "Hypophyse", meaning: "Kennzeichnet die Hormondrüse", wissen: "Achse. Hypophyse bedeutet: Kennzeichnet die Hormondrüse." },
    { concept: "bio:lk12:neuro:p:7", term: "EPSP", meaning: "Kennzeichnet das Erregend", wissen: "Depolarisation. EPSP bedeutet: Kennzeichnet das Erregend." },
    { concept: "bio:lk12:neuro:p:8", term: "IPSP", meaning: "Steht für das Hemmend", wissen: "Hyperpolarisation. IPSP bedeutet: Steht für das Hemmend." },
    { concept: "bio:lk12:neuro:p:9", term: "Adaptation", meaning: "Kennzeichnet die Gewöhnung", wissen: "Sensor. Adaptation bedeutet: Kennzeichnet die Gewöhnung." },
    { concept: "bio:lk12:neuro:p:10", term: "Neuroendokrin", meaning: "Kennzeichnet das Nerv+Hormon", wissen: "Integration. Neuroendokrin bedeutet: Kennzeichnet das Nerv+Hormon." },
  ],
}

const lk12Gendrift: BioBank = {
  quelle: "Wikipedia: Gendrift",
  url: "https://de.wikipedia.org/wiki/Gendrift",
  conceptPrefix: "bio:lk12:drift",
  facts: [
    {
      concept: "bio:lk12:drift:1",
      prompt: "Was bewirkt Austausch?",
      answer: "Es steht für die zufällige Allelfrequenzänderung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Gendrift.",
      wissen: "Zufällige Allelfrequenzänderung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:drift:2",
      prompt: "Wozu dient Austausch?",
      answer: "Es beschreibt den Vorgang Vorgang Vorgang Starke Verkleinerung → Drift.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Flaschenhalseffekt.",
      wissen: "Starke Verkleinerung → Drift. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:drift:3",
      prompt: "Was bewirkt Austausch?",
      answer: "Es steht für die Neue Population aus wenigen Individuen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Gründereffekt.",
      wissen: "Neue Population aus wenigen Individuen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:drift:4",
      prompt: "Wozu dient Austausch?",
      answer: "Es beschreibt das Austausch zwischen Populationen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Migration/Genfluss.",
      wissen: "Austausch zwischen Populationen. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Austausch"],
    },
    {
      concept: "bio:lk12:drift:5",
      prompt: "Wozu dient die Stärkere?",
      answer: "Sie bezeichnet die Auffächerung in Nischen.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Adaptive Radiation.",
      wissen: "Auffächerung in Nischen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:drift:6",
      prompt: "Wozu dient die Stärkere?",
      answer: "Sie beschreibt die Genflussgemeinschaft.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Populationsgenetischer Artbegriff.",
      wissen: "Genflussgemeinschaft. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:drift:7",
      prompt: "Wozu dient die Stärkere?",
      answer: "Sie beschreibt die Gerichtet vs. zufällig.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Selektion vs. Drift.",
      wissen: "Gerichtet vs. zufällig. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:drift:8",
      prompt: "Was bewirkt Stärkere?",
      answer: "Sie bezeichnet die Stärkere Drift und Inzucht.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Kleine Population Risiko.",
      wissen: "Stärkere Drift, Inzucht. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Stärkere"],
    },
    {
      concept: "bio:lk12:drift:9",
      prompt: "Was beschreibt 9?",
      answer: "Es beschreibt das Genfluss unterbrochen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Artbildung + Isolation.",
      wissen: "Genfluss unterbrochen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:drift:10",
      prompt: "Woran erkennt man 10?",
      answer: "Es steht für das Vielfalt und Gefährdung beurteilen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum messen.",
      wissen: "Vielfalt und Gefährdung beurteilen. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk12:drift:p:1", term: "Gendrift", meaning: "Bezeichnet das Zufall", wissen: "Frequenz. Gendrift bedeutet: Bezeichnet das Zufall." },
    { concept: "bio:lk12:drift:p:2", term: "Flaschenhals", meaning: "Bezeichnet das Engpass", wissen: "Verlust. Flaschenhals bedeutet: Bezeichnet das Engpass." },
    { concept: "bio:lk12:drift:p:3", term: "Gründer", meaning: "Bezeichnet den Neustart", wissen: "Stichprobe. Gründer bedeutet: Bezeichnet den Neustart." },
    { concept: "bio:lk12:drift:p:4", term: "Genfluss", meaning: "Beschreibt die Migration", wissen: "Austausch. Genfluss bedeutet: Beschreibt die Migration." },
    { concept: "bio:lk12:drift:p:5", term: "Radiation", meaning: "Bezeichnet die Auffächerung", wissen: "Nischen. Radiation bedeutet: Bezeichnet die Auffächerung." },
    { concept: "bio:lk12:drift:p:6", term: "Isolation", meaning: "Beschreibt die Trennung", wissen: "Artbildung. Isolation bedeutet: Beschreibt die Trennung." },
    { concept: "bio:lk12:drift:p:7", term: "Inzucht", meaning: "Steht für das Verwandt", wissen: "Risiko. Inzucht bedeutet: Steht für das Verwandt." },
    { concept: "bio:lk12:drift:p:8", term: "Allelfrequenz", meaning: "Beschreibt die Anteil", wissen: "Population. Allelfrequenz bedeutet: Beschreibt die Anteil." },
    { concept: "bio:lk12:drift:p:9", term: "Selektion", meaning: "Beschreibt die Gerichtet", wissen: "Fitness. Selektion bedeutet: Beschreibt die Gerichtet." },
    { concept: "bio:lk12:drift:p:10", term: "Vielfalt", meaning: "Steht für die Variation", wissen: "Erhalt. Vielfalt bedeutet: Steht für das Menschen." },
  ],
}

const lk12Progression: BioBank = {
  quelle: "Wikipedia: Evolution",
  url: "https://de.wikipedia.org/wiki/Evolution",
  conceptPrefix: "bio:lk12:prog",
  facts: [
    {
      concept: "bio:lk12:prog:1",
      prompt: "Was kennzeichnet 1?",
      answer: "Es bezeichnet die Vergleichende Merkmalsentwicklung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Progression/Spezialisierung.",
      wissen: "Vergleichende Merkmalsentwicklung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:prog:2",
      prompt: "Was bewirkt Effizientere?",
      answer: "Sie kennzeichnet die Landgänge: Haut und Atmung und Fortpflanzung.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Wasserunabhängigkeit.",
      wissen: "Landgänge: Haut, Atmung, Fortpflanzung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:prog:3",
      prompt: "Was bewirkt Effizientere?",
      answer: "Sie steht für die Zunehmende Differenzierung.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Gewebe/Organe Trend.",
      wissen: "Zunehmende Differenzierung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:prog:4",
      prompt: "Was bewirkt Effizientere?",
      answer: "Sie kennzeichnet die effizientere Versorgung.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Herz-Kreislauf Trend.",
      wissen: "Effizientere Versorgung. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Effizientere"],
    },
    {
      concept: "bio:lk12:prog:5",
      prompt: "Wozu dient Kein?",
      answer: "Es beschreibt die Zentralisierung/Komplexität.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Nervensysteme Trend.",
      wissen: "Zentralisierung/Komplexität. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:prog:6",
      prompt: "Was bewirkt Kein?",
      answer: "Es steht für die Abstammung rekonstruieren.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Homologie nutzen.",
      wissen: "Abstammung rekonstruieren. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:prog:7",
      prompt: "Wozu dient Kein?",
      answer: "Es bezeichnet die Konvergenz nicht Abstammung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Analogie Vorsicht.",
      wissen: "Konvergenz nicht Abstammung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:prog:8",
      prompt: "Warum nicht teleologisch?",
      answer: "Es kennzeichnet das Kein zielgerichteter Plan in Selektion.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum nicht teleologisch.",
      wissen: "Kein zielgerichteter Plan in Selektion. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Kein"],
    },
    {
      concept: "bio:lk12:prog:9",
      prompt: "Was kennzeichnet 9?",
      answer: "Es bezeichnet das zeitliche und strukturelle Belege.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Fossilien + Anatomie.",
      wissen: "Zeitliche und strukturelle Belege. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:prog:10",
      prompt: "Was beschreibt 10?",
      answer: "Es kennzeichnet die Zusammenhänge statt Stufenmythos.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Unterrichtsziel.",
      wissen: "Zusammenhänge statt Stufenmythos. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk12:prog:p:1", term: "Progression", meaning: "Steht für die Vergleich", wissen: "Merkmale. Progression bedeutet: Steht für die Vergleich." },
    { concept: "bio:lk12:prog:p:2", term: "Spezialisierung", meaning: "Steht für die Anpassung", wissen: "Nische. Spezialisierung bedeutet: Steht für die Anpassung." },
    { concept: "bio:lk12:prog:p:3", term: "Homologie", meaning: "Kennzeichnet die Herkunft", wissen: "Vergleich. Homologie bedeutet: Kennzeichnet die Herkunft." },
    { concept: "bio:lk12:prog:p:4", term: "Analogie", meaning: "Bezeichnet die Konvergenz", wissen: "Funktion. Analogie bedeutet: Bezeichnet die Konvergenz." },
    { concept: "bio:lk12:prog:p:5", term: "Zentralisierung", meaning: "Bezeichnet das Nervensystem", wissen: "Trend. Zentralisierung bedeutet: Bezeichnet das Nervensystem." },
    { concept: "bio:lk12:prog:p:6", term: "Differenzierung", meaning: "Steht für die Gewebe", wissen: "Komplexität. Differenzierung bedeutet: Steht für die Gewebe." },
    { concept: "bio:lk12:prog:p:7", term: "Landgang", meaning: "Beschreibt den Vorgang Vorgang Vorgang Wasser→Land", wissen: "Anpassung. Landgang bedeutet: Beschreibt den Vorgang Vorgang Vorgang Wasser→Land." },
    { concept: "bio:lk12:prog:p:8", term: "Kreislauf", meaning: "Beschreibt das Transport", wissen: "Effizienz. Kreislauf bedeutet: Beschreibt das Transport." },
    { concept: "bio:lk12:prog:p:9", term: "Teleologie", meaning: "Bezeichnet die Zweckmythos", wissen: "Vermeiden. Teleologie bedeutet: Bezeichnet die Zweckmythos." },
    { concept: "bio:lk12:prog:p:10", term: "Beleg", meaning: "Kennzeichnet das Fossil/Anatomie", wissen: "Evidenz. Beleg bedeutet: Kennzeichnet das Fossil/Anatomie." },
  ],
}

const lk12Abgrenzung: BioBank = {
  quelle: "Wikipedia: Sozialdarwinismus",
  url: "https://de.wikipedia.org/wiki/Sozialdarwinismus",
  conceptPrefix: "bio:lk12:abgrenz",
  facts: [
    {
      concept: "bio:lk12:abgrenz:1",
      prompt: "Sozialdarwinismus Problem?",
      answer: "Es steht für das Missbrauch biologischer Ideen für gesellschaftliche Ungleichheit.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Sozialdarwinismus Problem.",
      wissen: "Missbrauch biologischer Ideen für gesellschaftliche Ungleichheit. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:abgrenz:2",
      prompt: "Wozu dient die Menschliche?",
      answer: "Sie ist die Kritik an Determinismus/Missbrauch; Kontingenz der Evolution.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Gould Beitrag grob.",
      wissen: "Kritik an Determinismus/Missbrauch; Kontingenz der Evolution. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:abgrenz:3",
      prompt: "Wozu dient die Menschliche?",
      answer: "Sie beschreibt die Prüfbarkeit und Methodenkriterien.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Abgrenzung nicht-naturwissenschaftlich.",
      wissen: "Prüfbarkeit und Methodenkriterien. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:abgrenz:4",
      prompt: "Was bewirkt Menschliche?",
      answer: "Sie kennzeichnet die menschliche Vielfalt keine Rangordnung biologisch gerechtfertigt.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Rassismus widerlegen.",
      wissen: "Menschliche Vielfalt keine Rangordnung biologisch gerechtfertigt. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Menschliche"],
    },
    {
      concept: "bio:lk12:abgrenz:5",
      prompt: "Woran erkennt man 5?",
      answer: "Es bezeichnet die Verantwortung für Deutungen und Anwendungen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Wissenschaftliche Ethik.",
      wissen: "Verantwortung für Deutungen und Anwendungen. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:abgrenz:6",
      prompt: "Wozu dient die Reflexion?",
      answer: "Sie wirft Licht an einer Fläche zurück.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Selektion ≠ moralisches Sollen.",
      wissen: "Sein-Sollen-Fehlschluss vermeiden. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:abgrenz:7",
      prompt: "Wozu dient die Reflexion?",
      answer: "Sie wirft Licht an einer Fläche zurück.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Eugenik historisch.",
      wissen: "Menschenzüchtungsideologien; verbrecherisch missbraucht. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:abgrenz:8",
      prompt: "Warum im Lehrplan?",
      answer: "Sie wirft Licht an einer Fläche zurück.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum im Lehrplan.",
      wissen: "Reflexion von Wissenschaft im gesellschaftlichen Kontext. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Reflexion"],
    },
    {
      concept: "bio:lk12:abgrenz:9",
      prompt: "Was kennzeichnet 9?",
      answer: "Es beschreibt den Daten statt Ideologie.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Evidenzbasierte Haltung.",
      wissen: "Daten statt Ideologie. Fachlich themenspezifisch einordnen.",
    },
    { concept: "bio:lk12:abgrenz:10", prompt: "Was kennzeichnet 10?", answer: "Es steht für die Keine wissenschaftlichen Rassenhierarchien.", wrong: ["Das ist die Nur Wissenschaft und Gesellschaft ohne biologischen Bezug.", "Es handelt sich um die Nur Haarfarbe als Erklärung.", "Es beschreibt die Nur Zahnzahl ohne Stoffwechsel."],
      explanation: "Antirassismus biologisch.",
      wissen: "Keine wissenschaftlichen Rassenhierarchien. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk12:abgrenz:p:1", term: "Sozialdarwinismus", meaning: "Steht für den Missbrauch", wissen: "Ideologie. Sozialdarwinismus bedeutet: Steht für den Missbrauch." },
    { concept: "bio:lk12:abgrenz:p:2", term: "Sein-Sollen", meaning: "Bezeichnet das Fehlschluss", wissen: "Ethik. Sein-Sollen bedeutet: Bezeichnet das Fehlschluss." },
    { concept: "bio:lk12:abgrenz:p:3", term: "Eugenik", meaning: "Bezeichnet die Züchtungsideologie", wissen: "Unrecht. Eugenik bedeutet: Bezeichnet die Züchtungsideologie." },
    { concept: "bio:lk12:abgrenz:p:4", term: "Rassismus", meaning: "Steht für den Hierarchieidee", wissen: "Widerlegt. Rassismus bedeutet: Steht für den Hierarchieidee." },
    { concept: "bio:lk12:abgrenz:p:5", term: "Kontingenz", meaning: "Bezeichnet die Zufallspfad", wissen: "Evolution. Kontingenz bedeutet: Bezeichnet die Zufallspfad." },
    { concept: "bio:lk12:abgrenz:p:6", term: "Verantwortung", meaning: "Kennzeichnet die Deutung", wissen: "Wissenschaft. Verantwortung bedeutet: Kennzeichnet die Deutung." },
    { concept: "bio:lk12:abgrenz:p:7", term: "Prüfbarkeit", meaning: "Steht für das Kriterium", wissen: "Abgrenzung. Prüfbarkeit bedeutet: Steht für das Kriterium." },
    { concept: "bio:lk12:abgrenz:p:8", term: "Ideologie", meaning: "Kennzeichnet die Weltbild", wissen: "Kritik. Ideologie bedeutet: Kennzeichnet die Weltbild." },
    { concept: "bio:lk12:abgrenz:p:9", term: "Vielfalt", meaning: "Steht für die Variation", wissen: "Gleichwertig. Vielfalt bedeutet: Steht für das Menschen." },
    { concept: "bio:lk12:abgrenz:p:10", term: "Reflexion", meaning: "Wirft Licht an einer Fläche zurück", wissen: "Unterricht. Reflexion bedeutet: Wirft Licht an einer Fläche zurück." },
  ],
}

const lk12Phylogenie: BioBank = {
  quelle: "Wikipedia: Phylogenetischer Baum",
  url: "https://de.wikipedia.org/wiki/Phylogenetischer_Baum",
  conceptPrefix: "bio:lk12:phylo",
  facts: [
    {
      concept: "bio:lk12:phylo:1",
      prompt: "Wozu dient die Gruppe?",
      answer: "Sie beschreibt die Hypothese der Verwandtschaft.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Phylogenetischer Stammbaum.",
      wissen: "Hypothese der Verwandtschaft. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:phylo:2",
      prompt: "Was bewirkt Gruppe?",
      answer: "Sie kennzeichnet die Sequenzähnlichkeit durch Abstammung.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Molekulare Homologien.",
      wissen: "Sequenzähnlichkeit durch Abstammung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:phylo:3",
      prompt: "Wozu dient die Gruppe?",
      answer: "Sie beschreibt die Vorfahre + alle Nachfahren.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Clade.",
      wissen: "Vorfahre + alle Nachfahren. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:phylo:4",
      prompt: "Was bewirkt Gruppe?",
      answer: "Sie kennzeichnet die Gruppe ohne alle Nachfahren.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Paraphylie Problem.",
      wissen: "Gruppe ohne alle Nachfahren. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Gruppe"],
    },
    {
      concept: "bio:lk12:phylo:5",
      prompt: "Was bewirkt Zeitliche?",
      answer: "Sie steht für die Wurzelung des Baums.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Outgroup-Methode.",
      wissen: "Wurzelung des Baums. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:phylo:6",
      prompt: "Wozu dient die Zeitliche?",
      answer: "Sie beschreibt die Kodierte Eigenschaften für Analyse.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Merkmalsmatrix.",
      wissen: "Kodierte Eigenschaften für Analyse. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:phylo:7",
      prompt: "Was bewirkt Zeitliche?",
      answer: "Sie bezeichnet die Funktion ähnlich und Herkunft verschieden.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Konvergenz erkennen.",
      wissen: "Funktion ähnlich, Herkunft verschieden. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:phylo:8",
      prompt: "Was bewirkt Zeitliche?",
      answer: "Sie steht für die zeitliche Ankerpunkte.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Fossilkalibrierung grob.",
      wissen: "Zeitliche Ankerpunkte. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Zeitliche"],
    },
    {
      concept: "bio:lk12:phylo:9",
      prompt: "Was kennzeichnet 9?",
      answer: "Es steht für die Primatenverwandtschaft evidenzbasiert.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Mensch im Baum.",
      wissen: "Primatenverwandtschaft evidenzbasiert. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:phylo:10",
      prompt: "Unsicherheit kommunizieren?",
      answer: "Es bezeichnet die Bäume sind Modelle mit Support.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Unsicherheit kommunizieren.",
      wissen: "Bäume sind Modelle mit Support. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk12:phylo:p:1", term: "Stammbaum", meaning: "Beschreibt die Verwandtschaftshypothese", wissen: "Phylogenie. Stammbaum bedeutet: Beschreibt die Verwandtschaftshypothese." },
    { concept: "bio:lk12:phylo:p:2", term: "Clade", meaning: "Bezeichnet das Monophylum", wissen: "Gruppe. Clade bedeutet: Bezeichnet das Monophylum." },
    { concept: "bio:lk12:phylo:p:3", term: "Outgroup", meaning: "Kennzeichnet den Außen", wissen: "Wurzel. Outgroup bedeutet: Kennzeichnet den Außen." },
    { concept: "bio:lk12:phylo:p:4", term: "Homologie", meaning: "Kennzeichnet die Herkunft", wissen: "Merkmal. Homologie bedeutet: Kennzeichnet die Herkunft." },
    { concept: "bio:lk12:phylo:p:5", term: "Konvergenz", meaning: "Kennzeichnet die Unabhängig", wissen: "Ähnlichkeit. Konvergenz bedeutet: Kennzeichnet die Unabhängig." },
    { concept: "bio:lk12:phylo:p:6", term: "Matrix", meaning: "Kennzeichnet den Daten", wissen: "Analyse. Matrix bedeutet: Kennzeichnet den Daten." },
    { concept: "bio:lk12:phylo:p:7", term: "Support", meaning: "Kennzeichnet die Stützung", wissen: "Zweig. Support bedeutet: Kennzeichnet die Stützung." },
    { concept: "bio:lk12:phylo:p:8", term: "Kalibrierung", meaning: "Bezeichnet die Zeit", wissen: "Fossil. Kalibrierung bedeutet: Bezeichnet die Zeit." },
    { concept: "bio:lk12:phylo:p:9", term: "Monophylie", meaning: "Steht für die vollständig", wissen: "Ideal. Monophylie bedeutet: Steht für die vollständig." },
    { concept: "bio:lk12:phylo:p:10", term: "Modell", meaning: "Kennzeichnet die Vereinfachung", wissen: "Unsicherheit. Modell bedeutet: Kennzeichnet die Vereinfachung." },
  ],
}

const lk12Mensch: BioBank = {
  quelle: "Wikipedia: Stammesgeschichte des Menschen",
  url: "https://de.wikipedia.org/wiki/Stammesgeschichte_des_Menschen",
  conceptPrefix: "bio:lk12:mensch",
  facts: [
    {
      concept: "bio:lk12:mensch:1",
      prompt: "Welche Rolle hat 1?",
      answer: "Es beschreibt den Aufrechten Gang als Merkmal.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Bipedie.",
      wissen: "Aufrechter Gang als Merkmal. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:mensch:2",
      prompt: "Wozu dient Nicht?",
      answer: "Es beschreibt die Zunahme bei Homininen (nicht linear einfach).",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Hirnvolumen Trend.",
      wissen: "Zunahme bei Homininen (nicht linear einfach). Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:mensch:3",
      prompt: "Wozu dient Nicht?",
      answer: "Es bezeichnet die Kulturelle Evolution ergänzt biologisch.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Werkzeugkultur.",
      wissen: "Kulturelle Evolution ergänzt biologisch. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:mensch:4",
      prompt: "Was bewirkt Nicht?",
      answer: "Es bezeichnet das Nicht moderne Affen und Sondern früher Vorfahr.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Gemeinsamer Vorfahr Affen.",
      wissen: "Nicht moderne Affen, sondern früher Vorfahr. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Nicht"],
    },
    {
      concept: "bio:lk12:mensch:5",
      prompt: "Was kennzeichnet 5?",
      answer: "Es kennzeichnet den Übergangsformen und Datierung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Fossilbelege.",
      wissen: "Übergangsformen und Datierung. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:mensch:6",
      prompt: "Was bewirkt Keine?",
      answer: "Sie steht für die Verwandtschaft und Vermischungssignale.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "DNA-Belege.",
      wissen: "Verwandtschaft und Vermischungssignale. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:mensch:7",
      prompt: "Was bewirkt Keine?",
      answer: "Sie steht für die Weitergabe von Wissen/Technik.",
      wrong: [
        "Sie betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Kulturelle Evolution.",
      wissen: "Weitergabe von Wissen/Technik. Fachlich themenspezifisch einordnen.",
    },
    { concept: "bio:lk12:mensch:8", prompt: "Wozu dient die Keine?", answer: "Sie beschreibt die Keine biologische Wertpyramide der Menschen.", wrong: ["Sie steht für die nur Humanevolution ohne biologischen Bezug.", "Sie beschreibt die Nur Haarfarbe als Erklärung.", "Es handelt sich um die Nur Zahnzahl ohne Stoffwechsel."],
      explanation: "Antirassismus.",
      wissen: "Keine biologische Wertpyramide der Menschen. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Keine"],
    },
    {
      concept: "bio:lk12:mensch:9",
      prompt: "Woran erkennt man 9?",
      answer: "Es ist die Modelle der Ausbreitung diskutiert/evidenzbasiert.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Multiregional vs. Out-of-Africa grob.",
      wissen: "Modelle der Ausbreitung diskutiert/evidenzbasiert. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:mensch:10",
      prompt: "Was kennzeichnet 10?",
      answer: "Es beschreibt die Komplexe Datenlage; keine Mythen.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum differenziert urteilen.",
      wissen: "Komplexe Datenlage; keine Mythen. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk12:mensch:p:1", term: "Bipedie", meaning: "Beschreibt den Zweibeiner", wissen: "Merkmal. Bipedie bedeutet: Beschreibt den Zweibeiner." },
    { concept: "bio:lk12:mensch:p:2", term: "Hominini", meaning: "Beschreibt das Menschenlinie", wissen: "Gruppe. Hominini bedeutet: Beschreibt das Menschenlinie." },
    { concept: "bio:lk12:mensch:p:3", term: "Fossil", meaning: "Beschreibt das Beleg", wissen: "Datierung. Fossil bedeutet: Beschreibt das Beleg." },
    { concept: "bio:lk12:mensch:p:4", term: "Kultur", meaning: "Steht für die Weitergabe", wissen: "Technik. Kultur bedeutet: Steht für die Weitergabe." },
    { concept: "bio:lk12:mensch:p:5", term: "Out-of-Africa", meaning: "Kennzeichnet die Ausbreitung", wissen: "Modell. Out-of-Africa bedeutet: Kennzeichnet die Ausbreitung." },
    { concept: "bio:lk12:mensch:p:6", term: "Neandertaler", meaning: "Beschreibt den Verwandt", wissen: "Vermischung. Neandertaler bedeutet: Beschreibt den Verwandt." },
    { concept: "bio:lk12:mensch:p:7", term: "Hirn", meaning: "Dient als Volumen/Organisation", wissen: "Trend. Hirn bedeutet: Dient als Volumen/Organisation." },
    { concept: "bio:lk12:mensch:p:8", term: "Werkzeug", meaning: "Bezeichnet die Kulturtechnik", wissen: "Evolution. Werkzeug bedeutet: Bezeichnet die Kulturtechnik." },
    { concept: "bio:lk12:mensch:p:9", term: "Vielfalt", meaning: "Steht für das Menschen", wissen: "Gleichwertig. Vielfalt bedeutet: Steht für das Menschen." },
    { concept: "bio:lk12:mensch:p:10", term: "Datierung", meaning: "Kennzeichnet den Alter", wissen: "Methode. Datierung bedeutet: Kennzeichnet den Alter." },
  ],
}

const lk12StoffVergleich: BioBank = {
  quelle: "Wikipedia: Stoffwechsel",
  url: "https://de.wikipedia.org/wiki/Stoffwechsel",
  conceptPrefix: "bio:lk12:stoffvgl",
  facts: [
    {
      concept: "bio:lk12:stoffvgl:1",
      prompt: "Was bewirkt 1?",
      answer: "Es steht für das Licht vs. chemische Redoxenergie.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Fotosynthese vs. Chemosynthese.",
      wissen: "Licht vs. chemische Redoxenergie. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:stoffvgl:2",
      prompt: "Was bewirkt Abbau?",
      answer: "Es kennzeichnet das Mit O2 viel ATP vs. ohne O2 wenig ATP.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Atmung vs. Gärung.",
      wissen: "Mit O2 viel ATP vs. ohne O2 wenig ATP. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:stoffvgl:3",
      prompt: "Was bewirkt Abbau?",
      answer: "Es steht für das Aufbau von Körpersubstanz.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Assimilation.",
      wissen: "Aufbau von Körpersubstanz. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:stoffvgl:4",
      prompt: "Was bewirkt Abbau?",
      answer: "Es kennzeichnet das Abbau zur Energiegewinnung.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Dissimilation.",
      wissen: "Abbau zur Energiegewinnung. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Abbau"],
    },
    {
      concept: "bio:lk12:stoffvgl:5",
      prompt: "Wozu dient 5?",
      answer: "Es dient als Selbstaufbau vs. organische Aufnahme.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Auto- vs. Heterotrophie.",
      wissen: "Selbstaufbau vs. organische Aufnahme. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:stoffvgl:6",
      prompt: "Was bewirkt Ebenen?",
      answer: "Es kennzeichnet die Einbahnstraße mit Verlusten.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Energiefluss Ökosystem.",
      wissen: "Einbahnstraße mit Verlusten. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:stoffvgl:7",
      prompt: "Was bewirkt Ebenen?",
      answer: "Es steht für die Elektronenübergänge zentral.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Redoxgemeinsamkeit.",
      wissen: "Elektronenübergänge zentral. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:stoffvgl:8",
      prompt: "Warum vernetzen?",
      answer: "Es beschreibt den Ebenen von Molekül bis Ökosystem.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Warum vernetzen.",
      wissen: "Ebenen von Molekül bis Ökosystem. Fachlich themenspezifisch einordnen.",
      gap: "Fachbegriff/Kern: ___.",
      gapAccepted: ["Ebenen"],
    },
    {
      concept: "bio:lk12:stoffvgl:9",
      prompt: "Woran erkennt man 9?",
      answer: "Es kennzeichnet die Kopplung endergonischer Prozesse.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "ATP als Währung.",
      wissen: "Kopplung endergonischer Prozesse. Fachlich themenspezifisch einordnen.",
    },
    {
      concept: "bio:lk12:stoffvgl:10",
      prompt: "Was kennzeichnet 10?",
      answer: "Es bezeichnet den Prinzipien statt isolierter Fakten.",
      wrong: [
        "Es betrifft einen anderen Aspekt in diesem Lernbereich.",
      ],
      explanation: "Systematisierung Ziel.",
      wissen: "Prinzipien statt isolierter Fakten. Fachlich themenspezifisch einordnen.",
    },
  ],
  pairs: [
    { concept: "bio:lk12:stoffvgl:p:1", term: "Fotosynthese", meaning: "Wandelt Lichtenergie in chemische Energie in Form von Glucose um", wissen: "Assimilation. Fotosynthese bedeutet: Wandelt Lichtenergie in chemische Energie in Form von Glucose um." },
    { concept: "bio:lk12:stoffvgl:p:2", term: "Chemosynthese", meaning: "Beschreibt die Redox chemisch", wissen: "Assimilation. Chemosynthese bedeutet: Beschreibt die Redox chemisch." },
    { concept: "bio:lk12:stoffvgl:p:3", term: "Atmung", meaning: "Gewinnt Energie, indem sie organische Stoffe oxidiert", wissen: "Viel ATP. Atmung bedeutet: Gewinnt Energie, indem sie organische Stoffe oxidiert." },
    { concept: "bio:lk12:stoffvgl:p:4", term: "Gärung", meaning: "Beschreibt die Anaerob", wissen: "Wenig ATP. Gärung bedeutet: Beschreibt die Anaerob." },
    { concept: "bio:lk12:stoffvgl:p:5", term: "Autotroph", meaning: "Beschreibt das selbst", wissen: "CO2. Autotroph bedeutet: Beschreibt das selbst." },
    { concept: "bio:lk12:stoffvgl:p:6", term: "Heterotroph", meaning: "Steht für das Fremd", wissen: "Organisch. Heterotroph bedeutet: Steht für das Fremd." },
    { concept: "bio:lk12:stoffvgl:p:7", term: "Assimilation", meaning: "Bezeichnet die Aufbau", wissen: "Anabol. Assimilation bedeutet: Bezeichnet die Aufbau." },
    { concept: "bio:lk12:stoffvgl:p:8", term: "Dissimilation", meaning: "Kennzeichnet die Abbau", wissen: "Katabol. Dissimilation bedeutet: Kennzeichnet die Abbau." },
    { concept: "bio:lk12:stoffvgl:p:9", term: "ATP", meaning: "Steht für die Währung", wissen: "Kopplung. ATP bedeutet: Steht für die Währung." },
    { concept: "bio:lk12:stoffvgl:p:10", term: "Vernetzung", meaning: "Steht für den Ebenen", wissen: "Systematik. Vernetzung bedeutet: Steht für den Ebenen." },
  ],
}

export const BIOLOGIE_OS_GAPS_FILL_GENERATORS: Record<string, Topic['generate']> = {
  'bi-gk11-lb1-osmose': bankGenerate(gk11Osmose),
  'bi-gk11-lb1-transport': bankGenerate(gk11Transport),
  'bi-gk11-lb1-wassertransport': bankGenerate(gk11Wasser),
  'bi-gk11-lb1-enzyme': bankGenerate(gk11Enzyme),
  'bi-gk11-lb1-replikation': bankGenerate(gk11Replikation),
  'bi-gk11-lb1-proteinbiosynthese': bankGenerate(gk11Protein),
  'bi-gk11-lb1-genregulation': bankGenerate(gk11Genreg),
  'bi-gk11-lb1-mikroskop-praktikum': bankGenerate(gk11Mikroskop),
  'bi-gk11-lb3-faktoren': bankGenerate(gk11Faktoren),
  'bi-gk11-lb3-schaedlinge': bankGenerate(gk11Schaedlinge),
  'bi-gk11-lb3-naturschutz': bankGenerate(gk11Naturschutz),
  'bi-gk12-lb1-humangenetik': bankGenerate(gk12Human),
  'bi-gk12-lb1-gentherapie': bankGenerate(gk12Gentherapie),
  'bi-gk12-lb2-immun': bankGenerate(gk12Immun),
  'bi-gk12-lb2-neuro': bankGenerate(gk12Neuro),
  'bi-gk12-lb3-verhalten': bankGenerate(gk12Verhalten),
  'bi-gk12-lb3-abgrenzung': bankGenerate(gk12Abgrenzung),
  'bi-gk12-lb3-molekular': bankGenerate(gk12Molekular),
  'bi-lk11-lb1-procyte': bankGenerate(lk11Procyte),
  'bi-lk11-lb1-gewebe-zyklus': bankGenerate(lk11GewebeZyklus),
  'bi-lk11-lb1-membran': bankGenerate(lk11Membran),
  'bi-lk11-lb1-transport': bankGenerate(lk11Transport),
  'bi-lk11-lb1-genregulation': bankGenerate(lk11Genreg),
  'bi-lk11-lb1-enzyme': bankGenerate(lk11Enzyme),
  'bi-lk11-lb2-c3c4': bankGenerate(lk11C3C4),
  'bi-lk11-lb2-atmung': bankGenerate(lk11Atmung),
  'bi-lk11-lb2-chemosynthese': bankGenerate(lk11Chemo),
  'bi-lk11-lb2-gaerung': bankGenerate(lk11Gaerung),
  'bi-lk11-lb2-heterotroph': bankGenerate(lk11Heterotroph),
  'bi-lk11-lb3-population-modelle': bankGenerate(lk11PopModelle),
  'bi-lk11-lb3-kreislauf': bankGenerate(lk11Kreislauf),
  'bi-lk11-lb3-landwirtschaft': bankGenerate(lk11Landwirtschaft),
  'bi-lk11-lb3-naturschutz': bankGenerate(lk11Naturschutz),
  'bi-lk12-lb1-vererbung': bankGenerate(lk12Vererbung),
  'bi-lk12-lb1-humangenetik': bankGenerate(lk12Human),
  'bi-lk12-lb1-krebs': bankGenerate(lk12Krebs),
  'bi-lk12-lb1-gentechnik': bankGenerate(lk12Gentechnik),
  'bi-lk12-lb2-immun': bankGenerate(lk12Immun),
  'bi-lk12-lb2-neuro': bankGenerate(lk12Neuro),
  'bi-lk12-lb4-gendrift': bankGenerate(lk12Gendrift),
  'bi-lk12-lb4-progression': bankGenerate(lk12Progression),
  'bi-lk12-lb4-abgrenzung': bankGenerate(lk12Abgrenzung),
  'bi-lk12-lb4-phylogenie': bankGenerate(lk12Phylogenie),
  'bi-lk12-lb4-mensch': bankGenerate(lk12Mensch),
  'bi-lk12-lb5-stoffwechsel-vergleich': bankGenerate(lk12StoffVergleich),
}
