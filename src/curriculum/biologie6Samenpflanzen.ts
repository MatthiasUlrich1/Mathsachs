/**
 * Bio Gym SN K6 LB1 Samenpflanzen — Lehrplan-Lücken (522):
 * Fotosynthese; Kreuz-/Lippen-/Schmetterlingsblüten; Bestimmen/Herbarium.
 * released:false über Gym-Topics-Default. Keine Meta-/Philosophie-Prompts.
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

const fw = (s: string) => s

/** Fotosynthese am Laubblatt — Ausgangsstoffe, Produkte, Bedingungen (K6). */
export const k6Fotosynthese: BioBank = {
  quelle: 'Wikipedia: Fotosynthese',
  url: 'https://de.wikipedia.org/wiki/Fotosynthese',
  conceptPrefix: 'bio:k6:foto',
  facts: [
    {
      concept: 'bio:k6:foto:gleichung',
      prompt: 'Welche Wortgleichung beschreibt die Fotosynthese grob?',
      answer: 'Kohlenstoffdioxid + Wasser → Zucker + Sauerstoff (mit Licht)',
      wrong: [
        'Zucker + Sauerstoff → nur Stickstoff',
        'Nur Wasser → Eisen und Kalk',
        'Pollen + Nektar → Holzringe',
      ],
      explanation: 'Lichtenergie treibt den Aufbau von Zucker aus CO₂ und Wasser an; O₂ entsteht.',
      wissen: fw(
        'Bei der Fotosynthese bilden grüne Pflanzen aus Kohlenstoffdioxid und Wasser mit Hilfe von Lichtenergie Zucker. Als Nebenprodukt entsteht Sauerstoff. Vereinfacht: CO₂ + H₂O → C₆H₁₂O₆ + O₂.',
      ),
      gap: 'Bei der Fotosynthese entstehen Zucker und ___.',
      gapAccepted: ['Sauerstoff', 'O2', 'O₂'],
    },
    {
      concept: 'bio:k6:foto:ausgangsstoffe',
      prompt: 'Welche Ausgangsstoffe braucht die Fotosynthese?',
      answer: 'Kohlenstoffdioxid und Wasser',
      wrong: ['Nur Pollen und Nektar', 'Nur Holz und Borke', 'Nur Stickstoffgas allein'],
      explanation: 'CO₂ aus der Luft und Wasser aus der Wurzel sind die Edukte.',
      wissen: fw(
        'Ausgangsstoffe der Fotosynthese sind Kohlenstoffdioxid (über Spaltöffnungen) und Wasser (über die Wurzel). Licht liefert die Energie; Chlorophyll fängt sie im Blatt.',
      ),
      gap: 'Ausgangsstoffe der Fotosynthese sind CO₂ und ___.',
      gapAccepted: ['Wasser', 'H2O', 'H₂O'],
    },
    {
      concept: 'bio:k6:foto:produkte',
      prompt: 'Was sind die wichtigsten Produkte der Fotosynthese?',
      answer: 'Zucker (Glucose) und Sauerstoff',
      wrong: ['Nur Salz und Kalk', 'Nur Pollen und Samen', 'Nur Chitin und Keratin'],
      explanation: 'Zucker speichert Energie; Sauerstoff wird abgegeben.',
      wissen: fw(
        'Produkt der Fotosynthese ist vor allem Glucose (Zucker), die die Pflanze als Energie- und Baustoff nutzt oder als Stärke speichert. Sauerstoff entsteht als Nebenprodukt und wird abgegeben.',
      ),
    },
    {
      concept: 'bio:k6:foto:licht',
      prompt: 'Warum ist Licht für die Fotosynthese nötig?',
      answer: 'Es liefert die Energie für den Stoffaufbau',
      wrong: [
        'Es ersetzt das Wasser vollständig',
        'Es bildet die Wurzelhaare',
        'Es erzeugt den Pollen in der Anthere',
      ],
      explanation: 'Ohne Lichtenergie kein Aufbau von Zucker aus CO₂ und Wasser.',
      wissen: fw(
        'Lichtenergie wird vom Blattgrün (Chlorophyll) aufgenommen und treibt die Umwandlung von CO₂ und Wasser in Zucker an. Ohne ausreichendes Licht sinkt die Fotosyntheserate stark.',
      ),
    },
    {
      concept: 'bio:k6:foto:chlorophyll',
      prompt: 'Welche Rolle hat Chlorophyll bei der Fotosynthese?',
      answer: 'Es fängt Lichtenergie im Blatt',
      wrong: [
        'Es speichert nur Jahresringe',
        'Es bildet den Pollen',
        'Es verankert die Wurzel im Boden',
      ],
      explanation: 'Der grüne Blattfarbstoff absorbiert Licht für den Stoffaufbau.',
      wissen: fw(
        'Chlorophyll ist der grüne Blattfarbstoff in den Chloroplasten. Er absorbiert vor allem blaues und rotes Licht und macht so die Lichtenergie für die Fotosynthese nutzbar.',
      ),
      gap: 'Der grüne Blattfarbstoff heißt ___.',
      gapAccepted: ['Chlorophyll', 'Blattgrün'],
    },
    {
      concept: 'bio:k6:foto:ort',
      prompt: 'Wo findet die Fotosynthese bei Samenpflanzen vor allem statt?',
      answer: 'In den grünen Laubblättern (Chloroplasten)',
      wrong: [
        'Nur in den Wurzelspitzen',
        'Nur im toten Kernholz',
        'Nur in den Staubbeuteln',
      ],
      explanation: 'Chloroplasten in Blattzellen sind der Hauptort.',
      wissen: fw(
        'Fotosynthese läuft in Chloroplasten grüner Blattzellen ab. Wurzeln und ältere Holzteile betreiben typischerweise keine nennenswerte Fotosynthese.',
      ),
    },
    {
      concept: 'bio:k6:foto:bedingungen',
      prompt: 'Welche Bedingungen beeinflussen die Fotosynthese deutlich?',
      answer: 'Licht, CO₂-Angebot und Temperatur',
      wrong: [
        'Nur die Anzahl der Jahresringe',
        'Nur die Beinzahl von Insekten',
        'Nur der Wochentag',
      ],
      explanation: 'Zu wenig Licht, CO₂ oder ungünstige Temperatur drosseln die Rate.',
      wissen: fw(
        'Die Fotosyntheserate hängt von Lichtstärke, CO₂-Konzentration und Temperatur ab. Auch Wasserversorgung ist wichtig, weil Spaltöffnungen bei Trockenheit schließen und weniger CO₂ eintritt.',
      ),
    },
    {
      concept: 'bio:k6:foto:spaltoeffnung',
      prompt: 'Wozu dienen Spaltöffnungen am Blatt im Zusammenhang mit der Fotosynthese?',
      answer: 'Gasaustausch: CO₂ hinein, O₂ und Wasserdampf hinaus',
      wrong: [
        'Nur zur Bildung von Jahresringen',
        'Nur zur Pollenbildung',
        'Nur zur Verankerung im Boden',
      ],
      explanation: 'Über Stomata gelangt CO₂ zu den Chloroplasten.',
      wissen: fw(
        'Spaltöffnungen (Stomata) regulieren den Gasaustausch. CO₂ gelangt hinein; Sauerstoff und Wasserdampf treten aus. Schließzellen steuern die Weite der Öffnung.',
      ),
    },
    {
      concept: 'bio:k6:foto:staerke',
      prompt: 'Was macht die Pflanze oft mit dem gebildeten Zucker?',
      answer: 'Sie speichert ihn als Stärke oder baut daraus andere Stoffe',
      wrong: [
        'Sie wandelt ihn immer nur in Chitin um',
        'Sie speichert ihn nur als Knochen',
        'Sie gibt ihn nur als Pollen ab',
      ],
      explanation: 'Stärke ist eine typische Speicherform in Blatt und Speicherorganen.',
      wissen: fw(
        'Glucose kann sofort genutzt, zu Stärke umgebaut und gespeichert oder zu anderen organischen Stoffen weiterverarbeitet werden. Ein Iod-Stärke-Test zeigt oft Stärke im Blatt.',
      ),
    },
    {
      concept: 'bio:k6:foto:autotroph',
      prompt: 'Was bedeutet „autotroph“ bezogen auf grüne Pflanzen?',
      answer: 'Sie bilden organische Stoffe selbst (z. B. per Fotosynthese)',
      wrong: [
        'Sie fressen immer nur andere Tiere',
        'Sie brauchen nie Wasser',
        'Sie bilden nie Sauerstoff',
      ],
      explanation: 'Produzenten erzeugen Biomasse aus anorganischen Stoffen.',
      wissen: fw(
        'Autotrophe Organismen stellen energiereiche organische Stoffe selbst her — grüne Pflanzen vor allem durch Fotosynthese. Heterotrophe Organismen sind auf fertige organische Nahrung angewiesen.',
      ),
    },
  ],
  pairs: [
    {
      concept: 'bio:k6:foto:paar-co2',
      term: 'Kohlenstoffdioxid',
      meaning: 'Ausgangsstoff aus der Luft',
      wissen: 'Gelangt über Spaltöffnungen ins Blatt.',
    },
    {
      concept: 'bio:k6:foto:paar-wasser',
      term: 'Wasser',
      meaning: 'Ausgangsstoff aus dem Boden',
      wissen: 'Wird über die Wurzel aufgenommen und in Leitbahnen hochgeleitet.',
    },
    {
      concept: 'bio:k6:foto:paar-glucose',
      term: 'Glucose',
      meaning: 'Zuckerprodukt der Fotosynthese',
      wissen: 'Energiespeicher und Baustoff der Pflanze.',
    },
    {
      concept: 'bio:k6:foto:paar-o2',
      term: 'Sauerstoff',
      meaning: 'Nebenprodukt der Fotosynthese',
      wissen: 'Entsteht bei der Wasserspaltung und wird abgegeben.',
    },
    {
      concept: 'bio:k6:foto:paar-licht',
      term: 'Licht',
      meaning: 'Energielieferant der Fotosynthese',
      wissen: 'Ohne Licht kein Aufbau von Zucker aus CO₂ und Wasser.',
    },
    {
      concept: 'bio:k6:foto:paar-chloroplast',
      term: 'Chloroplast',
      meaning: 'Zellorganell der Fotosynthese',
      wissen: 'Enthält Chlorophyll und Membranstapel für Lichtreaktionen.',
    },
    {
      concept: 'bio:k6:foto:paar-stomata',
      term: 'Spaltöffnung',
      meaning: 'Öffnung für den Gasaustausch am Blatt',
      wissen: 'CO₂ hinein, O₂ und Wasserdampf hinaus.',
    },
    {
      concept: 'bio:k6:foto:paar-staerke',
      term: 'Stärke',
      meaning: 'Speicherform von Glucose',
      wissen: 'Wird in Blatt und Speicherorganen abgelagert.',
    },
    {
      concept: 'bio:k6:foto:paar-temperatur',
      term: 'Temperatur',
      meaning: 'Beeinflusst die Fotosyntheserate',
      wissen: 'Enzyme arbeiten nur in einem geeigneten Temperaturbereich optimal.',
    },
    {
      concept: 'bio:k6:foto:paar-produzent',
      term: 'Produzent',
      meaning: 'Erzeugt Biomasse (oft per Fotosynthese)',
      wissen: 'Grüne Pflanzen stehen am Anfang vieler Nahrungsnetze.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:foto:tf-wurzel',
      statement: 'Die Haupt-Fotosynthese einer typischen Samenpflanze findet in der Wurzel statt.',
      correct: false,
      explanation: 'Fotosynthese läuft vor allem in grünen Blättern ab.',
      wissen: fw(
        'Wurzeln nehmen Wasser und Mineralstoffe auf, betreiben aber kaum Fotosynthese. Der Hauptort sind Chloroplasten in Laubblättern.',
      ),
    },
    {
      concept: 'bio:k6:foto:tf-licht',
      statement: 'Ohne Licht findet bei grünen Pflanzen keine nennenswerte Fotosynthese statt.',
      correct: true,
      explanation: 'Licht liefert die nötige Energie.',
      wissen: fw(
        'Fotosynthese ist ein lichtabhängiger Prozess. Im Dunkeln kann die Pflanze gespeicherte Stoffe nutzen (Atmung), aber keinen Zucker neu aus CO₂ und Wasser aufbauen.',
      ),
    },
    {
      concept: 'bio:k6:foto:tf-produkte',
      statement: 'Bei der Fotosynthese entstehen Zucker und Sauerstoff.',
      correct: true,
      explanation: 'Das sind die zentralen Produkte der Wortgleichung.',
      wissen: fw(
        'Produkte: Glucose (und daraus weitere Stoffe) sowie Sauerstoff. Edukte: CO₂ und Wasser; Energie: Licht.',
      ),
    },
  ],
  multis: [
    {
      concept: 'bio:k6:foto:multi-bedingungen',
      question: 'Welche Faktoren beeinflussen die Fotosynthese?',
      correct: ['Licht', 'CO₂-Angebot', 'Temperatur'],
      wrong: ['Nur die Anzahl der Kelchblätter', 'Nur die Beinzahl von Spinnen'],
      explanation: 'Klassische begrenzende Faktoren der Fotosyntheserate.',
      wissen: fw(
        'Licht, Kohlenstoffdioxid und Temperatur begrenzen bzw. fördern die Fotosyntheserate. Auch Wasserversorgung wirkt indirekt über die Spaltöffnungen.',
      ),
    },
  ],
  sorts: [
    {
      concept: 'bio:k6:foto:sort-ablauf',
      question: 'Ordne den groben Ablauf der Fotosynthese.',
      labels: [
        'Licht wird vom Chlorophyll gefangen',
        'CO₂ und Wasser werden umgesetzt',
        'Zucker entsteht',
        'Sauerstoff wird abgegeben',
      ],
      explanation: 'Energieaufnahme → Stoffumwandlung → Produkte.',
      wissen: fw(
        'Vereinfacht: Lichtfang → Umsetzung von CO₂ und Wasser → Bildung von Zucker → Abgabe von Sauerstoff.',
      ),
    },
  ],
}

/** Kreuz-, Lippen- und Schmetterlingsblütengewächse + Artenkenntnis. */
export const k6Familien: BioBank = {
  quelle: 'Wikipedia: Kreuzblütler',
  url: 'https://de.wikipedia.org/wiki/Kreuzbl%C3%BCtler',
  conceptPrefix: 'bio:k6:familien',
  facts: [
    {
      concept: 'bio:k6:familien:kreuz-merkmal',
      prompt: 'Woran erkennst du Kreuzblütengewächse oft an der Blüte?',
      answer: 'Vier Kronblätter, kreuzweise angeordnet',
      wrong: [
        'Immer genau fünf gleiche Flügelblätter',
        'Nie Staubblätter',
        'Nur Nadeln statt Blüten',
      ],
      explanation: 'Name „Kreuz“: vier Kronblätter im Kreuz.',
      wissen: fw(
        'Kreuzblütengewächse (Brassicaceae) haben typisch vier Kelch- und vier Kronblätter, die kreuzweise stehen, sowie meist sechs Staubblätter. Viele Nutzpflanzen gehören dazu (Kohl, Raps, Senf).',
      ),
      gap: 'Kreuzblüten haben typischerweise ___ Kronblätter.',
      gapAccepted: ['vier', '4', 'Vier'],
    },
    {
      concept: 'bio:k6:familien:lippen-merkmal',
      prompt: 'Was ist typisch für Lippenblütengewächse?',
      answer: 'Zweigeteilte Blütenkrone (Ober- und Unterlippe), oft quadratischer Stängel',
      wrong: [
        'Immer Zapfen wie bei Nadelbäumen',
        'Nie Duftstoffe',
        'Nur Unterwasserblüten ohne Krone',
      ],
      explanation: 'Lippenblüte und oft vierkantiger Spross sind Kennzeichen.',
      wissen: fw(
        'Lippenblütengewächse (Lamiaceae) haben eine zweilippige Krone: Ober- und Unterlippe. Viele Arten duften stark (Minze, Salbei, Thymian) und haben einen vierkantigen Stängel.',
      ),
    },
    {
      concept: 'bio:k6:familien:schmetterling-merkmal',
      prompt: 'Woran erkennst du Schmetterlingsblütengewächse?',
      answer: 'Fahne, Flügel und Schiffchen bilden die Krone',
      wrong: [
        'Vier Kronblätter im Kreuz ohne Fahne',
        'Nur Kelchblätter ohne Krone',
        'Immer acht Beine an der Blüte',
      ],
      explanation: 'Schmetterlingsblüte: Fahne, zwei Flügel, Schiffchen.',
      wissen: fw(
        'Schmetterlingsblütengewächse (Fabaceae) haben eine typische Krone aus Fahne, zwei Flügeln und einem Schiffchen. Viele bilden Hülsenfrüchte; Wurzelknöllchen binden oft Stickstoff.',
      ),
    },
    {
      concept: 'bio:k6:familien:kreuz-arten',
      prompt: 'Welche Pflanzen gehören zu den Kreuzblütengewächsen?',
      answer: 'z. B. Raps, Kohl und Hirtentäschel',
      wrong: [
        'Nur Eiche und Buche',
        'Nur Regenwurm und Spinne',
        'Nur Minze und Salbei',
      ],
      explanation: 'Viele Gemüse- und Ölpflanzen sind Kreuzblütler.',
      wissen: fw(
        'Zu den Kreuzblütlern zählen u. a. Raps, verschiedene Kohlarten, Senf, Radieschen und das Hirtentäschel. Die Schote ist eine typische Fruchtform.',
      ),
    },
    {
      concept: 'bio:k6:familien:lippen-arten',
      prompt: 'Welche Pflanzen sind typische Lippenblütengewächse?',
      answer: 'z. B. Minze, Salbei und Thymian',
      wrong: [
        'Nur Raps und Kohl',
        'Nur Erbse und Bohne',
        'Nur Fichte und Kiefer',
      ],
      explanation: 'Viele Gewürz- und Duftpflanzen gehören zu den Lippenblütlern.',
      wissen: fw(
        'Minze, Salbei, Thymian, Lavendel und oft auch Taubnessel sind Lippenblütengewächse. Viele enthalten ätherische Öle — deshalb ihr intensiver Duft.',
      ),
    },
    {
      concept: 'bio:k6:familien:schmetterling-arten',
      prompt: 'Welche Nutzpflanzen gehören zu den Schmetterlingsblütengewächsen?',
      answer: 'z. B. Erbse, Bohne und Linse',
      wrong: [
        'Nur Raps und Senf',
        'Nur Minze und Lavendel',
        'Nur Farne ohne Samen',
      ],
      explanation: 'Hülsenfrüchte sind typisch für diese Familie.',
      wissen: fw(
        'Erbse, Bohne, Linse, Lupine und Klee sind Schmetterlingsblütler. Die Frucht ist oft eine Hülse. Knöllchenbakterien an den Wurzeln verbessern die Stickstoffversorgung.',
      ),
    },
    {
      concept: 'bio:k6:familien:oeko-kreuz',
      prompt: 'Welche ökologische oder ökonomische Bedeutung haben Kreuzblütler?',
      answer: 'Nahrung (Kohl, Rapsöl) und Lebensraum/Nahrung für Insekten',
      wrong: [
        'Nur als Knochenersatz beim Menschen',
        'Nur als Wirbelsäule von Fischen',
        'Keine Bedeutung für Landwirtschaft',
      ],
      explanation: 'Wichtige Kulturpflanzen und Nektar-/Pollenspender.',
      wissen: fw(
        'Kreuzblütler liefern Gemüse und Öl (Raps). Blüten bieten vielen Insekten Nahrung. In der Landwirtschaft sind sie ökonomisch bedeutsam; Wildarten bereichern die Vielfalt.',
      ),
    },
    {
      concept: 'bio:k6:familien:oeko-schmetterling',
      prompt: 'Warum sind Schmetterlingsblütler ökologisch besonders wichtig?',
      answer: 'Viele binden Stickstoff über Knöllchenbakterien und verbessern den Boden',
      wrong: [
        'Sie bilden nie Samen',
        'Sie betreiben keine Fotosynthese',
        'Sie haben immer Zapfen',
      ],
      explanation: 'Symbiose mit Knöllchenbakterien düngt den Boden natürlich.',
      wissen: fw(
        'An den Wurzeln vieler Fabaceae leben Knöllchenbakterien, die Luftstickstoff binden. Das verbessert die Bodenfruchtbarkeit — ökologisch und für die Landwirtschaft wichtig (Gründüngung, Eiweißpflanzen).',
      ),
    },
    {
      concept: 'bio:k6:familien:frucht-kreuz',
      prompt: 'Welche Fruchtform ist bei Kreuzblütlern typisch?',
      answer: 'Schote (oder Schötchen)',
      wrong: ['Zapfen mit Nadeln', 'Nur fleischige Steinfrucht wie Kirsche', 'Kokon aus Seide'],
      explanation: 'Schoten öffnen sich oft mit zwei Klappen.',
      wissen: fw(
        'Kreuzblütler bilden häufig Schoten oder Schötchen. Darin liegen die Samen. Am Hirtentäschel erkennt man die dreieckigen Schötchen leicht.',
      ),
    },
    {
      concept: 'bio:k6:familien:frucht-fabaceae',
      prompt: 'Welche Frucht ist für Schmetterlingsblütler typisch?',
      answer: 'Hülse',
      wrong: ['Zapfen', 'Nur Beere ohne Samen', 'Nur Achäne wie beim Löwenzahn immer'],
      explanation: 'Erbse und Bohne reifen in Hülsen.',
      wissen: fw(
        'Die Hülse entsteht aus einem Fruchtblatt und öffnet sich oft an zwei Nähten. Erbsen und Bohnen sind bekannte Beispiele.',
      ),
      gap: 'Schmetterlingsblütler bilden typischerweise eine ___.',
      gapAccepted: ['Hülse', 'Huelse', 'Hülsenfrucht'],
    },
    {
      concept: 'bio:k6:familien:vergleich',
      prompt: 'Was haben Kreuz-, Lippen- und Schmetterlingsblüten gemeinsam?',
      answer: 'Es sind Blütenpflanzen-Familien mit typischen Blütenmerkmalen',
      wrong: [
        'Es sind immer wirbellose Tiere',
        'Es sind Bakterien ohne Zellen',
        'Es sind nur Nadelbäume mit Zapfen',
      ],
      explanation: 'Drei Pflanzenfamilien — unterscheidbar an Bau der Blüte/Spross.',
      wissen: fw(
        'Alle drei sind Samenpflanzen-Familien. Man unterscheidet sie vor allem an Blütenbau (Kreuz, Lippe, Fahne/Flügel/Schiffchen) und oft an Frucht bzw. Sprossmerkmalen.',
      ),
    },
    {
      concept: 'bio:k6:familien:artenkenntnis-ziel',
      prompt: 'Warum sollst du mehrere Arten aus diesen Familien kennen?',
      answer: 'Um Merkmale zu vergleichen und Arten sicher zuzuordnen',
      wrong: [
        'Weil der Lehrplan Philosophie verlangt',
        'Weil Pflanzen keine Merkmale haben',
        'Weil Bestimmung unmöglich ist',
      ],
      explanation: 'Artenkenntnis trainiert Beobachtung und Systematik.',
      wissen: fw(
        'Mindestens sechs Arten aus Kreuz-, Lippen- und Schmetterlingsblütengewächsen helfen, Familienmerkmale zu erkennen und Pflanzen mit Schlüssel oder App zuzuordnen.',
      ),
    },
  ],
  pairs: [
    {
      concept: 'bio:k6:familien:paar-kreuz',
      term: 'Kreuzblütengewächse',
      meaning: 'Vier Kronblätter kreuzweise',
      wissen: 'z. B. Raps, Kohl, Hirtentäschel — oft Schoten.',
    },
    {
      concept: 'bio:k6:familien:paar-lippen',
      term: 'Lippenblütengewächse',
      meaning: 'Ober- und Unterlippe, oft Duftpflanzen',
      wissen: 'z. B. Minze, Salbei, Thymian — oft vierkantiger Stängel.',
    },
    {
      concept: 'bio:k6:familien:paar-schmetterling',
      term: 'Schmetterlingsblütengewächse',
      meaning: 'Fahne, Flügel, Schiffchen',
      wissen: 'z. B. Erbse, Bohne, Klee — oft Hülsen und Knöllchen.',
    },
    {
      concept: 'bio:k6:familien:paar-fahne',
      term: 'Fahne',
      meaning: 'Großes oberes Kronblatt der Schmetterlingsblüte',
      wissen: 'Zusammen mit Flügeln und Schiffchen typisch für Fabaceae.',
    },
    {
      concept: 'bio:k6:familien:paar-schiffchen',
      term: 'Schiffchen',
      meaning: 'Unterer Kronteil um Staub- und Fruchtblätter',
      wissen: 'Schützt oft die Fortpflanzungsorgane in der Schmetterlingsblüte.',
    },
    {
      concept: 'bio:k6:familien:paar-schote',
      term: 'Schote',
      meaning: 'Typische Frucht vieler Kreuzblütler',
      wissen: 'Enthält Samen; oft zweiklappig öffnend.',
    },
    {
      concept: 'bio:k6:familien:paar-huelse',
      term: 'Hülse',
      meaning: 'Typische Frucht der Schmetterlingsblütler',
      wissen: 'z. B. Erbsenschote im Alltag — botanisch eine Hülse.',
    },
    {
      concept: 'bio:k6:familien:paar-knoellchen',
      term: 'Knöllchenbakterien',
      meaning: 'Stickstoffbinder an Fabaceae-Wurzeln',
      wissen: 'Verbessern die Stickstoffversorgung der Pflanze und des Bodens.',
    },
    {
      concept: 'bio:k6:familien:paar-raps',
      term: 'Raps',
      meaning: 'Kreuzblütler — Ölpflanze',
      wissen: 'Gelbe Kreuzblüten; wirtschaftlich wichtige Kulturpflanze.',
    },
    {
      concept: 'bio:k6:familien:paar-minze',
      term: 'Minze',
      meaning: 'Lippenblütler — Duft- und Würzpflanze',
      wissen: 'Zweigeteilte Lippenblüte und aromatische Öle.',
    },
    {
      concept: 'bio:k6:familien:paar-erbse',
      term: 'Erbse',
      meaning: 'Schmetterlingsblütler — Hülsenfrucht',
      wissen: 'Fahne-Flügel-Schiffchen; Samen in der Hülse.',
    },
    {
      concept: 'bio:k6:familien:paar-taubnessel',
      term: 'Taubnessel',
      meaning: 'Lippenblütler — oft an Wegrändern',
      wissen: 'Lippenblüte; trotz Name keine Brennessel.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:familien:tf-kreuz-vier',
      statement: 'Kreuzblüten haben typischerweise vier Kronblätter.',
      correct: true,
      explanation: 'Das Kreuz aus vier Kronblättern ist namensgebend.',
      wissen: fw(
        'Vier Kelch- und vier Kronblätter in Kreuzstellung kennzeichnen viele Kreuzblütler zusätzlich zu den meist sechs Staubblättern.',
      ),
    },
    {
      concept: 'bio:k6:familien:tf-minze-kreuz',
      statement: 'Minze ist ein typischer Kreuzblütler wie der Raps.',
      correct: false,
      explanation: 'Minze gehört zu den Lippenblütengewächsen.',
      wissen: fw(
        'Minze hat eine Lippenblüte und oft einen vierkantigen Stängel — Merkmale der Lamiaceae, nicht der Brassicaceae.',
      ),
    },
    {
      concept: 'bio:k6:familien:tf-huelse',
      statement: 'Erbsen und Bohnen bilden typischerweise Hülsen.',
      correct: true,
      explanation: 'Hülsenfrüchte der Fabaceae.',
      wissen: fw(
        'Die Hülse ist die charakteristische Frucht vieler Schmetterlingsblütler; darin liegen die Samen.',
      ),
    },
  ],
  multis: [
    {
      concept: 'bio:k6:familien:multi-zuordnung',
      question: 'Welche Zuordnungen stimmen?',
      correct: [
        'Raps → Kreuzblütengewächse',
        'Salbei → Lippenblütengewächse',
        'Erbse → Schmetterlingsblütengewächse',
      ],
      wrong: ['Minze → Kreuzblütengewächse', 'Kohl → Schmetterlingsblütengewächse'],
      explanation: 'Familienmerkmale und Beispielarten zusammenbringen.',
      wissen: fw(
        'Raps/Kohl: Kreuzblütler. Salbei/Minze: Lippenblütler. Erbse/Bohne: Schmetterlingsblütler. So trainierst du Artenkenntnis.',
      ),
    },
  ],
}

/** Dichotomer Schlüssel, Blütendiagramm, Herbarium, Bestimmungsmedien. */
export const k6Bestimmung: BioBank = {
  quelle: 'Wikipedia: Bestimmungsschlüssel',
  url: 'https://de.wikipedia.org/wiki/Bestimmungsschl%C3%BCssel',
  conceptPrefix: 'bio:k6:bestimmung',
  facts: [
    {
      concept: 'bio:k6:bestimmung:dichotom',
      prompt: 'Was ist ein dichotomer Bestimmungsschlüssel?',
      answer: 'Ein Schlüssel mit jeweils zwei Alternativen pro Entscheidungsschritt',
      wrong: [
        'Ein Schlüssel nur für Jahresringe von Bäumen',
        'Eine Liste ohne Merkmale',
        'Ein Rezept nur für Nektar',
      ],
      explanation: 'Bei jedem Schritt wählst du eine von zwei gegensätzlichen Aussagen.',
      wissen: fw(
        'Ein dichotomer Schlüssel führt Schritt für Schritt durch Paare von Merkmalsalternativen (A oder B). Am Ende steht die Art oder Gruppe. Den Bestimmungsweg solltest du nachvollziehbar angeben können.',
      ),
      gap: 'Ein ___ Bestimmungsschlüssel bietet je Schritt zwei Alternativen.',
      gapAccepted: ['dichotomer', 'dichotomischer', 'zweigabeliger'],
    },
    {
      concept: 'bio:k6:bestimmung:weg',
      prompt: 'Warum soll der Bestimmungsweg angegeben werden?',
      answer: 'Damit die Entscheidungsschritte nachvollziehbar und prüfbar sind',
      wrong: [
        'Weil Pflanzen keine Merkmale haben',
        'Weil Apps immer falsch liegen müssen',
        'Weil Herbarien verboten sind',
      ],
      explanation: 'Dokumentation zeigt, welche Merkmale entscheidend waren.',
      wissen: fw(
        'Den Bestimmungsweg notieren heißt: Welche Alternativen wurden gewählt? So können Fehler gefunden und Merkmale bewusst verglichen werden — auch bei Nutzung von Apps.',
      ),
    },
    {
      concept: 'bio:k6:bestimmung:bluetendiagramm',
      prompt: 'Was zeigt ein Blütendiagramm?',
      answer: 'Den schematischen Aufbau der Blüte (Anordnung der Blütenorgane)',
      wrong: [
        'Nur den Jahresniederschlag',
        'Nur die Beinzahl von Insekten',
        'Nur den pH-Wert des Bodens',
      ],
      explanation: 'Im Diagramm siehst du Kelch, Krone, Staub- und Fruchtblätter in der Draufsicht.',
      wissen: fw(
        'Ein Blütendiagramm ist eine schematische Draufsicht: Kelch-, Kron-, Staub- und Fruchtblätter werden in Kreisen angeordnet. Es hilft, Familienmerkmale (z. B. Kreuzstellung) festzuhalten.',
      ),
    },
    {
      concept: 'bio:k6:bestimmung:lupe',
      prompt: 'Wozu untersucht man Blüten mit der Lupe?',
      answer: 'Um feine Merkmale (Staubblätter, Narbe, Behaarung) zu erkennen',
      wrong: [
        'Um Jahresringe im Stamm zu zählen',
        'Um Kiemen von Fischen zu messen',
        'Um DNA im Labor zu sequenzieren',
      ],
      explanation: 'Viele Bestimmungsmerkmale sind klein und brauchen Vergrößerung.',
      wissen: fw(
        'Mit der Lupe siehst du Anzahl und Form von Staubblättern, Narbenform, Haare oder Nektarien. Solche Details entscheiden oft im Bestimmungsschlüssel.',
      ),
    },
    {
      concept: 'bio:k6:bestimmung:praeparier',
      prompt: 'Wozu dient das Präparierbesteck bei der Blütenuntersuchung?',
      answer: 'Zum vorsichtigen Öffnen und Zerlegen der Blüte',
      wrong: [
        'Zum Fällen von Bäumen',
        'Zum Impfen von Tieren',
        'Zum Messen von Jahresringen allein',
      ],
      explanation: 'Pinzette und Präpariernadel legen innere Organe frei.',
      wissen: fw(
        'Mit Präpariernadel und Pinzette öffnest du die Blüte, zählst Organe und fertigst Skizzen oder ein Blütendiagramm an — ohne die Strukturen unnötig zu zerquetschen.',
      ),
    },
    {
      concept: 'bio:k6:bestimmung:herbarium',
      prompt: 'Was ist ein Herbarium?',
      answer: 'Eine Sammlung gepresster und beschrifteter Pflanzenbelege',
      wrong: [
        'Eine Liste nur von Tierknochen',
        'Ein Aquarium ohne Pflanzen',
        'Ein Gerätepark für Physikversuche',
      ],
      explanation: 'Getrocknete Belege mit Fundort, Datum und Namen.',
      wissen: fw(
        'Im Herbarium werden Pflanzen gepresst, getrocknet und mit Etikett (Art, Fundort, Datum, Sammler) aufbewahrt. Es dokumentiert Artenkenntnis und Vergleichsmaterial.',
      ),
      gap: 'Gepresste, beschriftete Pflanzenbelege bilden ein ___.',
      gapAccepted: ['Herbarium', 'Herbar'],
    },
    {
      concept: 'bio:k6:bestimmung:etikett',
      prompt: 'Welche Angaben gehören typisch auf ein Herbarium-Etikett?',
      answer: 'Artname, Fundort, Datum und Sammler',
      wrong: [
        'Nur die Lieblingsfarbe ohne Bezug',
        'Nur die Schuhgröße',
        'Nur der Wochentag ohne Ort',
      ],
      explanation: 'Ohne Metadaten ist der Beleg wissenschaftlich wenig nutzbar.',
      wissen: fw(
        'Ein gutes Etikett nennt wissenschaftlichen oder deutschen Namen, genauen Fundort, Datum, Lebensraum und Sammler. So bleibt der Beleg nachvollziehbar.',
      ),
    },
    {
      concept: 'bio:k6:bestimmung:apps',
      prompt: 'Wie nutzt du Bestimmungs-Apps sinnvoll?',
      answer: 'Als Hilfsmittel — Merkmale und Schlüsselweg trotzdem prüfen',
      wrong: [
        'Als Ersatz für jedes Nachdenken über Merkmale',
        'Nur zum Zählen von Jahresringen',
        'Nur wenn die Pflanze keine Blüte hat und nie Merkmale zeigt',
      ],
      explanation: 'Apps können irren; Beobachtung bleibt zentral.',
      wissen: fw(
        'Foto-Apps schlagen Arten vor, können aber verwechseln. Vergleiche Vorschlag mit Blüten-, Blatt- und Fruchtmerkmalen und ggf. mit einem dichotomen Schlüssel — Medienbildung und Fachmethode zusammen.',
      ),
    },
    {
      concept: 'bio:k6:bestimmung:literatur',
      prompt: 'Wozu dienen Bestimmungsliteratur und digitale Medien gemeinsam?',
      answer: 'Zum sicheren Zuordnen von Pflanzen anhand von Merkmalen',
      wrong: [
        'Zum Ersetzen der Fotosynthese',
        'Zum Bilden von Jahresringen',
        'Zum Erzeugen von Pollen in der App',
      ],
      explanation: 'Bücher, Schlüssel und Apps ergänzen Feldbeobachtung.',
      wissen: fw(
        'Floras, dichotome Schlüssel und Bestimmungs-Apps helfen bei der Artenkenntnis. Wichtig bleibt: Merkmale am Objekt prüfen und den Weg dokumentieren.',
      ),
    },
    {
      concept: 'bio:k6:bestimmung:zeichnen',
      prompt: 'Warum ist zeichnerisches Darstellen der Blüte sinnvoll?',
      answer: 'Es schärft die Beobachtung von Anzahl, Form und Anordnung der Organe',
      wrong: [
        'Weil Zeichnen die Fotosynthese ersetzt',
        'Weil Pflanzen keine Organe haben',
        'Weil Schlüssel dann überflüssig und falsch werden',
      ],
      explanation: 'Skizze und Diagramm zwingen zum genauen Hinsehen.',
      wissen: fw(
        'Beim Zeichnen zählst und ordnest du Kelch-, Kron-, Staub- und Fruchtblätter. Das unterstützt Blütendiagramm, Familienzuordnung und den Bestimmungsschlüssel.',
      ),
    },
  ],
  pairs: [
    {
      concept: 'bio:k6:bestimmung:paar-schluessel',
      term: 'Bestimmungsschlüssel',
      meaning: 'Führt über Merkmale zur Art/Gruppe',
      wissen: 'Dichotom: jeweils zwei Alternativen pro Schritt.',
    },
    {
      concept: 'bio:k6:bestimmung:paar-diagramm',
      term: 'Blütendiagramm',
      meaning: 'Schema der Blütenorgane in Draufsicht',
      wissen: 'Zeigt Anordnung von Kelch, Krone, Staub- und Fruchtblättern.',
    },
    {
      concept: 'bio:k6:bestimmung:paar-herbarium',
      term: 'Herbarium',
      meaning: 'Sammlung gepresster Pflanzenbelege',
      wissen: 'Mit Etikett zu Fundort, Datum und Namen.',
    },
    {
      concept: 'bio:k6:bestimmung:paar-lupe',
      term: 'Lupe',
      meaning: 'Vergrößert feine Blütenmerkmale',
      wissen: 'Wichtig für Staubblattzahl, Narbenform, Behaarung.',
    },
    {
      concept: 'bio:k6:bestimmung:paar-praeparier',
      term: 'Präparierbesteck',
      meaning: 'Hilft beim Öffnen der Blüte',
      wissen: 'Pinzette und Nadel legen innere Organe frei.',
    },
    {
      concept: 'bio:k6:bestimmung:paar-merkmal',
      term: 'Bestimmungsmerkmal',
      meaning: 'Beobachtbares Kennzeichen zur Unterscheidung',
      wissen: 'z. B. Kronblattzahl, Fruchtform, Stängelquerschnitt.',
    },
    {
      concept: 'bio:k6:bestimmung:paar-app',
      term: 'Bestimmungs-App',
      meaning: 'Digitales Hilfsmittel zur Artvorschau',
      wissen: 'Ergebnis immer anhand realer Merkmale prüfen.',
    },
    {
      concept: 'bio:k6:bestimmung:paar-etikett',
      term: 'Etikett',
      meaning: 'Beschriftung des Herbarbelegs',
      wissen: 'Art, Ort, Datum, Sammler — Pflichtangaben.',
    },
    {
      concept: 'bio:k6:bestimmung:paar-flora',
      term: 'Flora (Bestimmungsliteratur)',
      meaning: 'Nachschlagewerk zu Pflanzenarten einer Region',
      wissen: 'Enthält oft Schlüssel, Beschreibungen und Abbildungen.',
    },
    {
      concept: 'bio:k6:bestimmung:paar-alternative',
      term: 'Alternative (im Schlüssel)',
      meaning: 'Eine von zwei Merkmalsaussagen pro Schritt',
      wissen: 'Du wählst die passende Aussage und gehst zum nächsten Schritt.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:bestimmung:tf-dichotom',
      statement: 'Bei einem dichotomen Schlüssel gibt es je Schritt genau zwei Alternativen.',
      correct: true,
      explanation: '„Dichotom“ bedeutet zweigeteilt.',
      wissen: fw(
        'Jeder Bestimmungsschritt stellt zwei sich ausschließende Merkmalsaussagen gegenüber. So arbeitest du dich zur Art vor.',
      ),
    },
    {
      concept: 'bio:k6:bestimmung:tf-app',
      statement: 'Eine Bestimmungs-App ersetzt vollständig das Prüfen von Blütenmerkmalen.',
      correct: false,
      explanation: 'Apps können irren — Merkmale am Objekt bleiben maßgeblich.',
      wissen: fw(
        'Digitale Medien sind Hilfen. Sichere Bestimmung verlangt Abgleich mit sichtbaren Merkmalen und ggf. dem Schlüsselweg.',
      ),
    },
    {
      concept: 'bio:k6:bestimmung:tf-herbarium',
      statement: 'Ein Herbarium enthält gepresste und beschriftete Pflanzenbelege.',
      correct: true,
      explanation: 'Sammlung mit Etiketten.',
      wissen: fw(
        'Herbarien dokumentieren Artenkenntnis: Pressen, Trocknen, Aufkleben und Etikettieren gehören dazu.',
      ),
    },
  ],
  sorts: [
    {
      concept: 'bio:k6:bestimmung:sort-ablauf',
      question: 'Ordne einen sinnvollen Bestimmungsgang.',
      labels: [
        'Merkmale an der Pflanze beobachten',
        'Schlüssel-/App-Alternativen wählen',
        'Bestimmungsweg notieren',
        'Ergebnis anhand weiterer Merkmale prüfen',
      ],
      explanation: 'Beobachten → entscheiden → dokumentieren → prüfen.',
      wissen: fw(
        'Zuerst genau beobachten (ggf. Lupe), dann Schlüssel oder App nutzen, den Weg festhalten und das Ergebnis gegen weitere Merkmale absichern.',
      ),
    },
  ],
  multis: [
    {
      concept: 'bio:k6:bestimmung:multi-methoden',
      question: 'Welche Methoden gehören zur Pflanzenbestimmung im Unterricht?',
      correct: [
        'Dichotomer Schlüssel',
        'Blütendiagramm / Zeichnung',
        'Herbarium mit Etikett',
      ],
      wrong: ['Nur Würfeln ohne Merkmale', 'Nur Jahresringe von Tieren zählen'],
      explanation: 'Lehrplan: Untersuchen, Darstellen, Bestimmen, Sammeln.',
      wissen: fw(
        'Lupe und Präparierbesteck, Blütendiagramm, dichotomer Schlüssel, Herbarium sowie Bestimmungsliteratur/Apps sind die zentralen Methoden zu Samenpflanzen.',
      ),
    },
  ],
}

export const BIOLOGIE_K6_SAMENPFLANZEN_GENERATORS: Record<string, Topic['generate']> = {
  'bi-k6-lb1-fotosynthese': bankGenerate(k6Fotosynthese),
  'bi-k6-lb1-familien': bankGenerate(k6Familien),
  'bi-k6-lb1-bestimmung': bankGenerate(k6Bestimmung),
}
