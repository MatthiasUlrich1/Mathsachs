/**
 * Bio K6 — weitere Lehrplan-522-Lücken (LB2/LB4) nach Samenpflanzen-Pack.
 * released:false über Gym-Topics-Default.
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

const fw = (s: string) => s

export const k6Insektenordnungen: BioBank = {
  quelle: 'Wikipedia: Insekten',
  url: 'https://de.wikipedia.org/wiki/Insekten',
  conceptPrefix: 'bio:k6:ordnungen',
  facts: [
    {
      concept: 'bio:k6:ordnungen:hautfluegler',
      prompt: 'Welche Insekten gehören zu den Hautflüglern?',
      answer: 'z. B. Bienen, Wespen und Ameisen',
      wrong: ['Nur Käfer mit Deckflügeln', 'Nur Schmetterlinge mit Schuppen', 'Nur Spinnen mit acht Beinen'],
      explanation: 'Hautflügler (Hymenoptera): oft zwei häutige Flügelpaare.',
      wissen: fw(
        'Hautflügler umfassen Bienen, Wespen und Ameisen. Viele haben zwei Paar häutige Flügel; Ameisenarbeiterinnen sind oft flügellos. Viele Arten bilden Staaten.',
      ),
    },
    {
      concept: 'bio:k6:ordnungen:kaefer',
      prompt: 'Woran erkennst du Käfer typischerweise?',
      answer: 'Hartes Vorderflügelpaar (Deckflügel) über den Hinterflügeln',
      wrong: ['Immer acht Beine', 'Federn statt Flügel', 'Keine Mundwerkzeuge'],
      explanation: 'Deckflügel (Elytren) schützen die häutigen Hinterflügel.',
      wissen: fw(
        'Käfer (Coleoptera) haben verhärtete Vorderflügel als Deckflügel. Darunter liegen die häutigen Hinterflügel zum Flug. Käfer sind die artenreichste Insektenordnung.',
      ),
    },
    {
      concept: 'bio:k6:ordnungen:schmetterling',
      prompt: 'Woran erkennt man Schmetterlinge äußerlich?',
      answer: 'Große Flügel mit Schuppen und oft auffällige Färbung',
      wrong: ['Chitinpanzer ohne Flügel immer', 'Acht Laufbeine', 'Kiemenatmung an Land'],
      explanation: 'Schuppenflügler: Flügel mit winzigen Schuppen.',
      wissen: fw(
        'Schmetterlinge (Lepidoptera) tragen Schuppen auf den Flügeln. Viele haben eine vollständige Metamorphose: Raupe → Puppe → Falter. Saugrüssel bei vielen Arten.',
      ),
    },
    {
      concept: 'bio:k6:ordnungen:zweifluegler',
      prompt: 'Was ist typisch für Zweiflügler?',
      answer: 'Nur ein Paar Flügel; das hintere oft zu Schwingkölbchen umgebildet',
      wrong: ['Immer vier gleich große Flügelpaare', 'Nie Mundwerkzeuge', 'Wirbelsäule aus Knochen'],
      explanation: 'Fliegen und Mücken: ein Flügelpaar + Halteren.',
      wissen: fw(
        'Zweiflügler (Diptera) wie Fliegen und Mücken haben ein Flügelpaar. Das hintere Paar ist zu Schwingkölbchen (Halteren) umgebildet und hilft bei der Flugsteuerung.',
      ),
    },
    {
      concept: 'bio:k6:ordnungen:mund-beissend',
      prompt: 'Welche Mundwerkzeuge hat z. B. ein Laufkäfer typischerweise?',
      answer: 'Beißend-kauend',
      wrong: ['Nur stechend-saugend wie eine Mücke', 'Nur einen Saugrüssel wie viele Falter', 'Keine Mundwerkzeuge'],
      explanation: 'Käfer oft mit kräftigen Beißwerkzeugen.',
      wissen: fw(
        'Beißend-kauende Mundwerkzeuge zerkleinern feste Nahrung — typisch für viele Käfer und Heuschrecken. Form der Mundwerkzeuge zeigt die Ernährung.',
      ),
    },
    {
      concept: 'bio:k6:ordnungen:mund-saugend',
      prompt: 'Wozu dient der Saugrüssel vieler Schmetterlinge?',
      answer: 'Zum Aufsaugen von Nektar',
      wrong: ['Zum Atmen unter Wasser', 'Zum Bilden von Jahresringen', 'Zum Spinnen von Seide wie Spinnen'],
      explanation: 'Gerollter Rüssel wird zum Nektarsaugen ausgefahren.',
      wissen: fw(
        'Viele Falter haben einen langen Saugrüssel. Er wird ausgerollt, um Nektar aus Blüten zu saugen — Anpassung an flüssige Nahrung.',
      ),
    },
    {
      concept: 'bio:k6:ordnungen:mund-stechend',
      prompt: 'Welche Mundwerkzeuge haben stechende Mücken?',
      answer: 'Stechend-saugend',
      wrong: ['Nur kauende Zangen ohne Stechrüssel', 'Nur Federkiele', 'Nur Kiemenblätter'],
      explanation: 'Stechrüssel durchdringt Haut und saugt Flüssigkeit.',
      wissen: fw(
        'Stechmücken haben stechend-saugende Mundwerkzeuge. Weibchen stechen oft, um Blut für die Eientwicklung zu saugen; Männchen ernähren sich anders.',
      ),
    },
    {
      concept: 'bio:k6:ordnungen:land-luft-wasser',
      prompt: 'Wie sind Insekten an verschiedene Lebensräume angepasst?',
      answer: 'Unterschiedliche Gliedmaßen, Flügel und Atmung je nach Land, Luft oder Wasser',
      wrong: [
        'Alle Insekten leben nur im Meer mit Kiemen wie Fische',
        'Keine Angepasstheit nötig',
        'Nur durch Jahresringe',
      ],
      explanation: 'Bau folgt dem Lebensraum.',
      wissen: fw(
        'Laufbeine, Sprungbeine, Schwimmbeine oder Flügel zeigen Angepasstheit. Landinsekten atmen über Tracheen; manche Wasserlarven haben Kiemenanhänge.',
      ),
    },
    {
      concept: 'bio:k6:ordnungen:tracheen',
      prompt: 'Womit atmen die meisten Landinsekten?',
      answer: 'Mit Tracheen (Luft röhren im Körper)',
      wrong: ['Nur mit Lungen wie Säuger', 'Nur mit Kiemen wie alle Fische', 'Durch Fotosynthese'],
      explanation: 'Tracheensystem leitet Luft zu den Geweben.',
      wissen: fw(
        'Tracheen sind feine Luftröhren, die Sauerstoff direkt zu den Zellen bringen. Das passt zum Leben an Land als Trockenlufttiere mit Chitinpanzer.',
      ),
    },
    {
      concept: 'bio:k6:ordnungen:vergleich',
      prompt: 'Was zeigen Hautflügler, Käfer, Schmetterlinge und Zweiflügler gemeinsam?',
      answer: 'Vielfalt typischer Bau- und Lebensweisen der Insekten',
      wrong: [
        'Sie ersetzen alle Wirbeltiere',
        'Sie sind Samenpflanzen-Familien',
        'Sie haben alle eine Wirbelsäule',
      ],
      explanation: 'Vier Ordnungen = Merkmalsvielfalt der Insekten.',
      wissen: fw(
        'Hautflügler, Käfer, Schmetterlinge und Zweiflügler stehen beispielhaft für Insektenvielfalt: Flügelbau, Mundwerkzeuge, Metamorphose und Lebensräume.',
      ),
    },
  ],
  pairs: [
    { concept: 'bio:k6:ordnungen:paar-haut', term: 'Hautflügler', meaning: 'Bienen, Wespen, Ameisen', wissen: 'Oft häutige Flügel; viele staatenbildend.' },
    { concept: 'bio:k6:ordnungen:paar-kaefer', term: 'Käfer', meaning: 'Deckflügel über Hinterflügeln', wissen: 'Artenreichste Ordnung; oft beißende Mundwerkzeuge.' },
    { concept: 'bio:k6:ordnungen:paar-schmetterling', term: 'Schmetterling', meaning: 'Schuppenflügel, oft Saugrüssel', wissen: 'Vollständige Metamorphose mit Raupe und Puppe.' },
    { concept: 'bio:k6:ordnungen:paar-zweifluegler', term: 'Zweiflügler', meaning: 'Ein Flügelpaar + Schwingkölbchen', wissen: 'Fliegen und Mücken.' },
    { concept: 'bio:k6:ordnungen:paar-beiss', term: 'Beißwerkzeug', meaning: 'Mundwerkzeug zum Zerkleinern', wissen: 'Typisch für viele Käfer.' },
    { concept: 'bio:k6:ordnungen:paar-saug', term: 'Saugrüssel', meaning: 'Mundwerkzeug für Nektar', wissen: 'Typisch für viele Schmetterlinge.' },
    { concept: 'bio:k6:ordnungen:paar-stech', term: 'Stechrüssel', meaning: 'Mundwerkzeug zum Stechen/Saugen', wissen: 'Typisch für stechende Mücken.' },
    { concept: 'bio:k6:ordnungen:paar-trachee', term: 'Trachee', meaning: 'Atmungsröhre der Insekten', wissen: 'Leitet Luft zu den Geweben.' },
    { concept: 'bio:k6:ordnungen:paar-deck', term: 'Deckflügel', meaning: 'Verhärtete Vorderflügel der Käfer', wissen: 'Schützen die häutigen Hinterflügel.' },
    { concept: 'bio:k6:ordnungen:paar-halteren', term: 'Halteren', meaning: 'Schwingkölbchen der Zweiflügler', wissen: 'Aus dem hinteren Flügelpaar entstanden.' },
    { concept: 'bio:k6:ordnungen:paar-metamorphose', term: 'Vollständige Metamorphose', meaning: 'Ei–Larve–Puppe–Imago', wissen: 'z. B. bei Käfer, Schmetterling, vielen Hautflüglern.' },
    { concept: 'bio:k6:ordnungen:paar-schuppe', term: 'Flügelschuppe', meaning: 'Deckschicht auf Schmetterlingsflügeln', wissen: 'Gibt Farbe und Muster.' },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:ordnungen:tf-kaefer',
      statement: 'Käfer haben typischerweise Deckflügel.',
      correct: true,
      explanation: 'Verhärtete Vorderflügel kennzeichnen Käfer.',
      wissen: fw('Deckflügel (Elytren) sind ein Hauptmerkmal der Käfer.'),
    },
    {
      concept: 'bio:k6:ordnungen:tf-biene-kaefer',
      statement: 'Honigbienen gehören zu den Käfern.',
      correct: false,
      explanation: 'Bienen sind Hautflügler.',
      wissen: fw('Bienen zählen zu den Hautflüglern, nicht zu den Käfern mit Deckflügeln.'),
    },
  ],
  multis: [
    {
      concept: 'bio:k6:ordnungen:multi',
      question: 'Welche Zuordnungen stimmen?',
      correct: ['Biene → Hautflügler', 'Fliege → Zweiflügler', 'Laufkäfer → Käfer'],
      wrong: ['Schmetterling → Käfer', 'Ameise → Zweiflügler'],
      explanation: 'Ordnungsmerkmale und Beispiele.',
      wissen: fw('Hautflügler: Biene/Ameise. Käfer: Laufkäfer. Zweiflügler: Fliege. Schmetterlinge: Falter.'),
    },
  ],
}

export const k6Honigbiene: BioBank = {
  quelle: 'Wikipedia: Honigbiene',
  url: 'https://de.wikipedia.org/wiki/Honigbiene',
  conceptPrefix: 'bio:k6:biene',
  facts: [
    {
      concept: 'bio:k6:biene:staat',
      prompt: 'Was ist ein Bienenstaat?',
      answer: 'Ein sozialer Verband mit Arbeitsteilung (Königin, Arbeiterinnen, Drohnen)',
      wrong: ['Eine einzelne Biene ohne Bezug zu anderen', 'Ein Säugetier-Rudelschule', 'Ein Baum mit Jahresringen'],
      explanation: 'Honigbienen leben in Staaten mit Rollenverteilung.',
      wissen: fw(
        'Im Bienenstaat leben Königin, Arbeiterinnen und Drohnen zusammen. Arbeitsteilung und Kommunikation halten den Staat funktionsfähig.',
      ),
    },
    {
      concept: 'bio:k6:biene:koenigin',
      prompt: 'Welche Aufgabe hat die Bienenkönigin vor allem?',
      answer: 'Eier legen und den Staat zusammenhalten',
      wrong: ['Nur Nektar sammeln wie alle Arbeiterinnen', 'Nur Waben aus Holz bauen', 'Nur Spinnenseide erzeugen'],
      explanation: 'Die Königin ist das fruchtbare Weibchen.',
      wissen: fw(
        'Die Königin legt die meisten Eier. Duftstoffe (Pheromone) beeinflussen Verhalten und Zusammenhalt des Volkes.',
      ),
    },
    {
      concept: 'bio:k6:biene:arbeiterin',
      prompt: 'Was machen Arbeiterinnen im Lauf ihres Lebens typischerweise?',
      answer: 'Nacheinander verschiedene Aufgaben (Putzen, Füttern, Sammeln, Wachen)',
      wrong: ['Nur Eier legen wie die Königin', 'Nur als Drohnen fliegen', 'Nie den Stock verlassen und nie arbeiten'],
      explanation: 'Altersabhängige Arbeitsteilung.',
      wissen: fw(
        'Arbeiterinnen wechseln mit dem Alter die Aufgaben: Stockpflege, Brutpflege, Wachdienst, später Trachtflug für Nektar und Pollen.',
      ),
    },
    {
      concept: 'bio:k6:biene:drohne',
      prompt: 'Wozu dienen Drohnen?',
      answer: 'Zur Paarung mit einer Königin (männliche Bienen)',
      wrong: ['Zum Sammeln von Nektar wie Arbeiterinnen', 'Zum Legen aller Eier', 'Zum Spinnen von Netzen'],
      explanation: 'Drohnen sind männlich und unfruchtbar für Arbeiterinnen-Aufgaben.',
      wissen: fw(
        'Drohnen sind männliche Bienen. Ihre Hauptaufgabe ist die Begattung einer Königin; sie sammeln typischerweise keinen Nektar.',
      ),
    },
    {
      concept: 'bio:k6:biene:tanz',
      prompt: 'Wozu dient der Schwänzeltanz der Honigbiene?',
      answer: 'Zur Kommunikation über Richtung und Entfernung einer Futterquelle',
      wrong: [
        'Zur Fotosynthese im Stock',
        'Zum Bilden von Jahresringen',
        'Zum Atmen unter Wasser',
      ],
      explanation: 'Informationsübertragung im Tierstaat.',
      wissen: fw(
        'Mit dem Schwänzeltanz teilen Sammelbienen mit, wo eine Trachtquelle liegt. Winkel und Dauer kodieren Richtung und Entfernung — ein Beispiel für Information im Tierstaat.',
      ),
    },
    {
      concept: 'bio:k6:biene:nektar',
      prompt: 'Was sammeln Honigbienen außer Nektar oft noch?',
      answer: 'Pollen als Eiweißquelle für die Brut',
      wrong: ['Nur Jahresringe von Bäumen', 'Nur Knochen von Säugern', 'Nur Chitin von Spinnen'],
      explanation: 'Pollen und Nektar sind zentrale Trachtstoffe.',
      wissen: fw(
        'Nektar wird zu Honig verarbeitet (Energie). Pollen liefert Eiweiße und Fette für die Aufzucht der Larven.',
      ),
    },
    {
      concept: 'bio:k6:biene:bestäubung',
      prompt: 'Welche ökologische Bedeutung haben Honigbienen?',
      answer: 'Bestäubung vieler Blütenpflanzen und Honigerzeugung',
      wrong: [
        'Nur Zerstörung aller Pflanzen',
        'Nur Bildung von Zapfen',
        'Keine Rolle in Ökosystemen',
      ],
      explanation: 'Bestäuber und Nutztiere.',
      wissen: fw(
        'Beim Sammelflug übertragen Bienen Pollen — wichtige Bestäubung für Wild- und Kulturpflanzen. Honig und Wachs sind wirtschaftliche Produkte.',
      ),
    },
    {
      concept: 'bio:k6:biene:wachs',
      prompt: 'Wozu dient Bienenwachs im Stock?',
      answer: 'Zum Bau der Waben',
      wrong: ['Zur Fotosynthese', 'Als Wirbelsäule', 'Als Ersatz für Tracheen'],
      explanation: 'Arbeiterinnen scheiden Wachs aus und formen Zellen.',
      wissen: fw(
        'Aus Wachs bauen Bienen die sechseckigen Wabenzellen für Honig, Pollen und Brut.',
      ),
    },
  ],
  pairs: [
    { term: 'Königin', meaning: 'Eierlegendes Weibchen im Staat', wissen: 'Steuert mit Duftstoffen das Volk mit.' },
    { term: 'Arbeiterin', meaning: 'Unfruchtbares Weibchen mit Aufgabenwechsel', wissen: 'Pflege, Bau, Sammeln, Wache.' },
    { term: 'Drohne', meaning: 'Männliche Biene', wissen: 'Vor allem zur Paarung.' },
    { term: 'Schwänzeltanz', meaning: 'Informationsübertragung über Futterquellen', wissen: 'Richtung und Entfernung werden kodiert.' },
    { term: 'Tracht', meaning: 'Nektar- und Pollensammlung', wissen: 'Versorgt Staat mit Energie und Baustoffen.' },
    { term: 'Wabe', meaning: 'Wachszellenbau im Stock', wissen: 'Lager und Brutstätte.' },
    { term: 'Pheromon', meaning: 'Duftstoff zur Kommunikation', wissen: 'Königinnen-Duft beeinflusst Verhalten.' },
    { term: 'Bestäubung', meaning: 'Pollenübertragung durch Bienen', wissen: 'Ökologisch und landwirtschaftlich wichtig.' },
    { term: 'Honig', meaning: 'Aus Nektar verarbeiteter Energiespeicher', wissen: 'Vorrat für das Volk.' },
    { term: 'Tierstaat', meaning: 'Sozialer Verband mit Arbeitsteilung', wissen: 'Beispiel Honigbiene.' },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:biene:tf-tanz',
      statement: 'Der Schwänzeltanz informiert über Futterquellen.',
      correct: true,
      explanation: 'Kommunikation im Bienenstaat.',
      wissen: fw('Richtung und Entfernung einer Trachtquelle werden getanzt.'),
    },
    {
      concept: 'bio:k6:biene:tf-drohne-sammeln',
      statement: 'Drohnen sammeln typischerweise den meisten Nektar.',
      correct: false,
      explanation: 'Sammeln ist Aufgabe der Arbeiterinnen.',
      wissen: fw('Drohnen sind Männchen zur Paarung; Trachtflug machen Arbeiterinnen.'),
    },
  ],
}

export const k6Parasiten: BioBank = {
  quelle: 'Wikipedia: Parasitismus',
  url: 'https://de.wikipedia.org/wiki/Parasitismus',
  conceptPrefix: 'bio:k6:parasit',
  facts: [
    {
      concept: 'bio:k6:parasit:def',
      prompt: 'Ein Floh lebt vom Blut seines Wirts und schadet ihm — welche Wechselwirkung zwischen Arten liegt vor?',
      answer: 'Ein Lebewesen nutzt ein anderes als Wirt und schadet ihm dabei',
      wrong: [
        'Zwei Arten helfen sich immer gegenseitig',
        'Pflanzen betreiben nur Fotosynthese ohne Interaktion',
        'Nur Freundschaft ohne Nutzen',
      ],
      explanation: 'Parasit profitiert, Wirt wird benachteiligt.',
      wissen: fw(
        'Parasiten leben auf oder in einem Wirt und beziehen Nahrung von ihm. Der Wirt wird geschädigt, stirbt aber nicht immer sofort — sonst verlöre der Parasit seine Lebensgrundlage.',
      ),
    },
    {
      concept: 'bio:k6:parasit:spulwurm',
      prompt: 'Welches Beispiel ist ein parasitärer Rundwurm des Menschen?',
      answer: 'Spulwurm (Askaris)',
      wrong: ['Honigbiene', 'Regenwurm im Gartenboden', 'Marienkäfer'],
      explanation: 'Askaris lebt im Darm.',
      wissen: fw(
        'Spulwürmer parasitieren im Darm. Eier gelangen über verunreinigte Nahrung oder Erde in den Menschen — Hygiene ist Prophylaxe.',
      ),
    },
    {
      concept: 'bio:k6:parasit:zecke',
      prompt: 'Warum gilt die Zecke als Parasit?',
      answer: 'Sie saugt Blut am Wirt und kann Krankheitserreger übertragen',
      wrong: [
        'Sie betreibt Fotosynthese auf der Haut',
        'Sie ist ein Samenpflanzen-Bestäuber ohne Schaden',
        'Sie bildet Jahresringe im Wirt',
      ],
      explanation: 'Blutsauger auf Wirbeltieren.',
      wissen: fw(
        'Zecken sind Spinnentiere und Ektoparasiten: sie stechen, saugen Blut und können Erreger (z. B. Borrelien) übertragen. Nach dem Aufenthalt im Freien Körper absuchen.',
      ),
    },
    {
      concept: 'bio:k6:parasit:bandwurm',
      prompt: 'Wo leben viele Bandwürmer im Menschen?',
      answer: 'Im Darm',
      wrong: ['Nur in den Blattchloroplasten', 'Nur im Holzjahresring', 'Nur in Spinnenseide'],
      explanation: 'Endoparasiten im Verdauungstrakt.',
      wissen: fw(
        'Bandwürmer sind Endoparasiten im Darm. Infektion oft über ungenügend erhitztes Fleisch mit Finnen — gründliches Garen schützt.',
      ),
    },
    {
      concept: 'bio:k6:parasit:floh',
      prompt: 'Was sind Flöhe im Verhältnis zum Wirt?',
      answer: 'Blutsaugende Insekten-Parasiten',
      wrong: ['Wirbeltiere mit Federn', 'Samenpflanzen', 'Nur Bakterien ohne Beine'],
      explanation: 'Ektoparasiten auf Säugern/Vögeln.',
      wissen: fw(
        'Flöhe sind flügellose Insekten, die Blut saugen. Sie können jucken und selten Erreger übertragen — Hygiene und Tierpflege helfen.',
      ),
    },
    {
      concept: 'bio:k6:parasit:prophylaxe',
      prompt: 'Welche Maßnahmen mindern parasitäre Infektionen?',
      answer: 'Hygiene, sauberes Wasser, sachgerechte Lebensmittelbehandlung',
      wrong: [
        'Nur das Ignorieren aller Symptome',
        'Nur das Verbot von Fotosynthese',
        'Nur das Zählen von Jahresringen',
      ],
      explanation: 'Vorbeugung statt nur Bekämpfung.',
      wissen: fw(
        'Prophylaxe: Hände waschen, Obst/Gemüse reinigen, Fleisch durchgaren, Trinkwasser schützen, Zeckenkontrolle. So sinkt das Infektionsrisiko.',
      ),
    },
    {
      concept: 'bio:k6:parasit:gesundheit',
      prompt: 'Warum sind parasitäre Wirbellose gesundheitsrelevant?',
      answer: 'Sie können Organe schädigen oder Krankheiten übertragen',
      wrong: [
        'Sie verbessern immer die Fotosynthese des Wirts',
        'Sie sind nie auf den Menschen bezogen',
        'Sie ersetzen Impfungen vollständig',
      ],
      explanation: 'Schäden und Erregerübertragung.',
      wissen: fw(
        'Parasiten entziehen Nährstoffe, reizen Gewebe oder übertragen Erreger. Kenntnis von Übertragungswegen ermöglicht Schutz und Bekämpfung.',
      ),
    },
    {
      concept: 'bio:k6:parasit:endo-ekto',
      prompt: 'Was unterscheidet Endo- und Ektoparasiten?',
      answer: 'Endo leben im Wirt, Ekto auf dem Wirt',
      wrong: [
        'Beide leben nur in Chloroplasten',
        'Beide sind immer Pflanzen',
        'Es gibt keinen Unterschied',
      ],
      explanation: 'Ort des Parasitismus.',
      wissen: fw(
        'Ektoparasiten (Zecke, Floh) leben außen. Endoparasiten (Spulwurm, Bandwurm) leben innen — oft im Darm oder Gewebe.',
      ),
    },
  ],
  pairs: [
    { term: 'Parasit', meaning: 'Nutzt Wirt und schadet ihm', wissen: 'Einseitiger Vorteil zulasten des Wirts.' },
    { term: 'Wirt', meaning: 'Organismus, der den Parasiten beherbergt', wissen: 'Wird geschädigt oder belastet.' },
    { term: 'Ektoparasit', meaning: 'Parasit an der Körperoberfläche des Wirts', wissen: 'z. B. Zecke, Floh.' },
    { term: 'Endoparasit', meaning: 'Parasit im Inneren des Wirtskörpers', wissen: 'z. B. Spulwurm, Bandwurm.' },
    { term: 'Spulwurm', meaning: 'Parasitärer Rundwurm im Darm', wissen: 'Übertragung über Eier — Hygiene.' },
    { term: 'Zecke', meaning: 'Blutsaugendes Spinnentier', wissen: 'Kann Erreger übertragen.' },
    { term: 'Bandwurm', meaning: 'Endoparasit im Darm', wissen: 'Oft über ungenügend erhitztes Fleisch.' },
    { term: 'Prophylaxe', meaning: 'Vorbeugende Schutzmaßnahmen', wissen: 'Hygiene, Garen, Zeckenkontrolle.' },
    { term: 'Übertragung', meaning: 'Weg vom Parasiten zum neuen Wirt', wissen: 'Eier, Stiche, kontaminierte Nahrung.' },
    { term: 'Floh', meaning: 'Blutsaugendes Insekt', wissen: 'Ektoparasit an Mensch und Tier.' },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:parasit:tf-regenwurm',
      statement: 'Der Regenwurm ist ein typischer Parasit des Menschen.',
      correct: false,
      explanation: 'Regenwürmer leben im Boden und sind keine Menschenparasiten.',
      wissen: fw('Regenwürmer sind freilebende Ringelwürmer und Bodenverbesserer — keine Humanparasiten.'),
    },
    {
      concept: 'bio:k6:parasit:tf-hygiene',
      statement: 'Hygiene kann parasitäre Infektionen vorbeugen.',
      correct: true,
      explanation: 'Weniger Übertragung durch Sauberkeit und sichere Lebensmittel.',
      wissen: fw('Saubere Hände, Wasser und durchgegarte Lebensmittel unterbrechen Übertragungswege.'),
    },
  ],
}

export const k6Sporempflanzen: BioBank = {
  quelle: 'Wikipedia: Sporenpflanze',
  url: 'https://de.wikipedia.org/wiki/Sporenpflanze',
  conceptPrefix: 'bio:k6:sporen',
  facts: [
    {
      concept: 'bio:k6:sporen:vs-samen',
      prompt: 'Wodurch unterscheiden sich Moose/Farne grob von Samenpflanzen?',
      answer: 'Sie verbreiten sich über Sporen, nicht über Samen',
      wrong: [
        'Sie haben immer Zapfen mit Samen',
        'Sie bilden nie Blätter',
        'Sie sind immer Tiere',
      ],
      explanation: 'Ungeschlechtliche Fortpflanzung durch Sporen.',
      wissen: fw(
        'Moose und Farne bilden Sporen. Samenpflanzen bilden Samen (oft in Früchten oder Zapfen). Das ist ein zentrales Unterscheidungsmerkmal im Wald.',
      ),
    },
    {
      concept: 'bio:k6:sporen:moos',
      prompt: 'Wo wachsen Moose im Wald typischerweise?',
      answer: 'An feuchten Standorten (Boden, Steine, Baumstämme)',
      wrong: ['Nur in der trockenen Wüstensonne ohne Wasser', 'Nur im offenen Ozean als Fische', 'Nur in Blütenkronen'],
      explanation: 'Feuchtigkeit ist entscheidend.',
      wissen: fw(
        'Moose brauchen Feuchtigkeit für Wachstum und Fortpflanzung. Im Wald besiedeln sie oft die Krautschicht, Steine und Rinde.',
      ),
    },
    {
      concept: 'bio:k6:sporen:farn',
      prompt: 'Wo findest du bei vielen Farnen die Sporenbehälter?',
      answer: 'An der Unterseite der Wedel (Blätter)',
      wrong: ['Nur in den Jahresringen des Holzes', 'Nur in den Staubbeuteln einer Blüte', 'Nur in den Wurzeln der Säuger'],
      explanation: 'Sori an der Wedelunterseite.',
      wissen: fw(
        'Viele Farne tragen Sporangien in Häufchen (Sori) unter den Wedeln. Aus Sporen wächst ein Vorkeim — anders als der Samenweg der Blütenpflanzen.',
      ),
    },
    {
      concept: 'bio:k6:sporen:pilz',
      prompt: 'Was sind Pilze im Wald ökologisch oft?',
      answer: 'Zersetzer oder Partner von Bäumen (Mykorrhiza)',
      wrong: [
        'Immer nur Blütenpflanzen mit Früchten',
        'Immer Wirbeltiere',
        'Immer Insekten mit sechs Beinen',
      ],
      explanation: 'Abbau von organischem Material / Symbiose.',
      wissen: fw(
        'Pilze zersetzen Totholz und Laub oder leben mit Baumwurzeln in Mykorrhiza zusammen. Fruchtkörper (z. B. Hutpilze) bilden Sporen.',
      ),
    },
    {
      concept: 'bio:k6:sporen:schicht',
      prompt: 'In welcher Waldschicht findest du Moose und Farne oft?',
      answer: 'In der Boden- bzw. Krautschicht',
      wrong: ['Nur in der Stratosphäre', 'Nur im Kernholz ohne Licht', 'Nur als Kronen-Alleinbewohner wie Adler'],
      explanation: 'Niedrige Schichten des Waldes.',
      wissen: fw(
        'Die Schichtung des Waldes reicht von Kraut- und Strauchschicht bis zur Baumkrone. Moose und Farne besiedeln vor allem die unteren, feuchteren Bereiche.',
      ),
    },
    {
      concept: 'bio:k6:sporen:merkmal-moos',
      prompt: 'Welches Merkmal passt zu Moosen?',
      answer: 'Keine echten Leitbündel wie bei vielen Farren/Samenpflanzen — oft klein und polsterig',
      wrong: ['Immer dicke Holzstämme mit Jahresringen', 'Immer Blüten mit Staubblättern', 'Immer acht Beine'],
      explanation: 'Einfacher Bau, Sporenfortpflanzung.',
      wissen: fw(
        'Moose sind meist klein, ohne echtes Holz. Sie halten Feuchtigkeit und bilden Sporen — typische Waldbodenbewohner.',
      ),
    },
    {
      concept: 'bio:k6:sporen:farn-wedel',
      prompt: 'Was sind Farnwedel?',
      answer: 'Die oft gefiederten Blätter der Farne',
      wrong: ['Die Flügel von Insekten', 'Die Federn der Vögel', 'Die Kelchblätter der Kreuzblütler'],
      explanation: 'Assimilationsorgane der Farne.',
      wissen: fw(
        'Wedel sind die Blätter der Farne. Viele sind gefiedert und tragen unterseits Sporenbehälter.',
      ),
    },
    {
      concept: 'bio:k6:sporen:bedeutung',
      prompt: 'Welche Rolle haben Moose, Farne und Pilze im Wald?',
      answer: 'Sie prägen Schichten und Stoffkreisläufe (z. B. Zersetzung, Symbiose)',
      wrong: [
        'Sie sind Wirbeltiere mit Milchdrüsen',
        'Sie ersetzen den Blutkreislauf des Menschen',
        'Sie haben keine ökologische Rolle',
      ],
      explanation: 'Vielfalt und Wechselwirkung im Wald.',
      wissen: fw(
        'Neben Samenpflanzen prägen Sporenorganismen und Pilze den Wald: Schichtung, Zersetzung, Symbiosen und Nahrungsnetze.',
      ),
    },
  ],
  pairs: [
    { term: 'Spore', meaning: 'Ausbreitungszelle ohne Embryo wie im Samen', wissen: 'Bei Moosen, Farnen, Pilzen.' },
    { term: 'Moos', meaning: 'Kleine Sporenpflanze an feuchten Orten', wissen: 'Oft Polster auf Boden und Rinde.' },
    { term: 'Farn', meaning: 'Sporenpflanze mit Wedeln', wissen: 'Sori oft unter den Blättern.' },
    { term: 'Pilz', meaning: 'Zersetzer oder Wurzelpartner', wissen: 'Fruchtkörper bilden Sporen.' },
    { term: 'Sorus', meaning: 'Häufchen von Sporenbehältern am Farn', wissen: 'Unterseite der Wedel.' },
    { term: 'Mykorrhiza', meaning: 'Pilz-Wurzel-Symbiose', wissen: 'Nährstofftausch mit Bäumen.' },
    { term: 'Wedel', meaning: 'Farnblatt', wissen: 'Oft gefiedert.' },
    { term: 'Krautschicht', meaning: 'Niedrige Pflanzenschicht im Wald', wissen: 'Moose, Farne, Kräuter.' },
    { term: 'Zersetzer', meaning: 'Baut totes organisches Material ab', wissen: 'Viele Pilze und Bakterien.' },
    { term: 'Samenpflanze', meaning: 'Fortpflanzung über Samen', wissen: 'Abgrenzung zu Sporenpflanzen.' },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:sporen:tf-samen',
      statement: 'Farne bilden typischerweise Samen wie Apfelbäume.',
      correct: false,
      explanation: 'Farne bilden Sporen.',
      wissen: fw('Farne sind Sporenpflanzen — keine Samen wie bei Blütenpflanzen.'),
    },
    {
      concept: 'bio:k6:sporen:tf-pilz',
      statement: 'Viele Pilze zersetzen Totholz und Laub im Wald.',
      correct: true,
      explanation: 'Wichtige Destruenten.',
      wissen: fw('Pilze brechen organisches Material ab und schließen Nährstoffe wieder auf.'),
    },
  ],
}

export const k6Waldschutz: BioBank = {
  quelle: 'Wikipedia: Waldschaden',
  url: 'https://de.wikipedia.org/wiki/Waldschaden',
  conceptPrefix: 'bio:k6:waldschutz',
  facts: [
    {
      concept: 'bio:k6:waldschutz:bedeutung',
      prompt: 'Welche Bedeutungen hat der Wald?',
      answer: 'Holzlieferung, Lebensraum, Klimaschutz, Erholung und Wasserschutz',
      wrong: [
        'Nur als Parkplatz ohne Leben',
        'Nur als Ort ohne jegliche Arten',
        'Nur als Ersatz für Fotosynthese im Weltall',
      ],
      explanation: 'Ökologisch, ökonomisch und sozial relevant.',
      wissen: fw(
        'Wälder liefern Holz, speichern Kohlenstoff, schützen Boden und Wasser, sind Lebensraum vieler Arten und Erholungsraum für Menschen.',
      ),
    },
    {
      concept: 'bio:k6:waldschutz:gefaehrdung',
      prompt: 'Was gefährdet Wälder unter anderem?',
      answer: 'Schadstoffe, Klimastress, Schädlinge und falsche Nutzung',
      wrong: [
        'Nur zu viel Bestäubung durch Bienen',
        'Nur zu viele Jahresringe',
        'Nur zu viel Fotosynthese',
      ],
      explanation: 'Mehrere Stressfaktoren wirken zusammen.',
      wissen: fw(
        'Luftschadstoffe, Trockenheit, Stürme, Borkenkäfer und Übernutzung können Wälder schädigen — regional unterschiedlich stark, auch in sächsischen Beständen.',
      ),
    },
    {
      concept: 'bio:k6:waldschutz:massnahmen',
      prompt: 'Welche Maßnahmen helfen, Wälder zu erhalten?',
      answer: 'Nachhaltige Nutzung, Mischwald, Schutzgebiete und Emissionsminderung',
      wrong: [
        'Nur das Abholzen aller Bestände',
        'Nur das Einbringen von Plastikmüll',
        'Nur das Trockenlegen aller Böden',
      ],
      explanation: 'Pflege und Schutz auf mehreren Ebenen.',
      wissen: fw(
        'Nachhaltige Forstwirtschaft, standortgerechte Mischwälder, Schutzgebiete und weniger Schadstoff-/Klimabelastung erhalten Waldfunktionen.',
      ),
    },
    {
      concept: 'bio:k6:waldschutz:mischwald',
      prompt: 'Warum gelten naturnahe Mischwälder oft als widerstandsfähiger?',
      answer: 'Verschiedene Arten nutzen Schichten und puffern Störungen besser',
      wrong: [
        'Weil sie nie Fotosynthese betreiben',
        'Weil sie nur aus einer Baumart bestehen müssen',
        'Weil sie keine Tiere beherbergen dürfen',
      ],
      explanation: 'Vielfalt erhöht Stabilität.',
      wissen: fw(
        'In Mischwäldern nutzen Arten unterschiedliche Schichten und Ressourcen. Bei Schädlingsbefall oder Trockenheit fällt nicht der ganze Bestand gleichzeitig aus.',
      ),
    },
    {
      concept: 'bio:k6:waldschutz:nahrungsnetz',
      prompt: 'Was passiert, wenn Destruenten im Wald fehlen würden?',
      answer: 'Totholz und Laub würden sich anhäufen, Nährstoffkreisläufe stocken',
      wrong: [
        'Sofort mehr Jahresringe in allen Insekten',
        'Sofort Blüten an allen Steinen',
        'Keine Veränderung der Stoffkreisläufe',
      ],
      explanation: 'Zersetzer schließen Kreisläufe.',
      wissen: fw(
        'Pilze, Bakterien und Bodentiere zersetzen organisches Material. Ohne sie blieben Nährstoffe gebunden — Produzenten und Konsumenten wären langfristig betroffen.',
      ),
    },
    {
      concept: 'bio:k6:waldschutz:messung',
      prompt: 'Warum misst man im Wald z. B. Temperatur und Licht?',
      answer: 'Um Unterschiede zwischen Schichten und Standorten zu erfassen',
      wrong: [
        'Nur um Jahresringe von Insekten zu zählen',
        'Nur um Blütenfarben zu ersetzen',
        'Messwerte haben keinen Bezug zum Lebensraum',
      ],
      explanation: 'Abiotische Faktoren prägen Organismen.',
      wissen: fw(
        'Licht und Temperatur unterscheiden sich zwischen Kronen- und Bodenschicht. Digitale Messungen helfen, Wechselwirkungen im Wald zu verstehen.',
      ),
    },
    {
      concept: 'bio:k6:waldschutz:sachsen',
      prompt: 'Welche regionalen Faktoren können sächsische Wälder belasten?',
      answer: 'z. B. Trockenheit, Schädlinge und frühere/aktuelle Schadstoffeinträge',
      wrong: [
        'Sachsen hat keine Wälder',
        'Wälder gibt es nur in der Antarktis',
        'Pflanzen haben keine Umweltbezüge',
      ],
      explanation: 'Lokale Stressfaktoren und Schäden.',
      wissen: fw(
        'Je nach Standort wirken Trockenperioden, Borkenkäfer, Stürme oder Schadstoffe unterschiedlich stark — regionale Beobachtungen helfen, Gefährdungen zu verstehen.',
      ),
    },
    {
      concept: 'bio:k6:waldschutz:nachhaltig',
      prompt: 'Im Forst wird nur so viel Holz geschlagen, wie nachwächst — welches Prinzip der Waldbewirtschaftung beschreibt das?',
      answer: 'Nur so viel nutzen, dass der Wald langfristig erhalten bleibt',
      wrong: [
        'Sofort alles abholzen ohne Wiederaufforstung',
        'Nur einmal nutzen und nie nachwachsen lassen',
        'Wald komplett durch Asphalt ersetzen',
      ],
      explanation: 'Nutzung und Erhalt im Gleichgewicht.',
      wissen: fw(
        'Nachhaltigkeit heißt: Holz und andere Leistungen so nutzen, dass Bestand, Boden und Artenvielfalt für die Zukunft gesichert bleiben.',
      ),
    },
  ],
  pairs: [
    { term: 'Waldschaden', meaning: 'Beeinträchtigung von Bäumen/Waldökosystem', wissen: 'Durch Klima, Schädlinge, Schadstoffe u. a.' },
    { term: 'Mischwald', meaning: 'Wald mit mehreren Baumarten', wissen: 'Oft stabiler als Reinbestand.' },
    { term: 'Nachhaltigkeit', meaning: 'Nutzung ohne Zerstörung der Zukunftsfähigkeit', wissen: 'Erhalt von Bestand und Funktionen.' },
    { term: 'Schutzgebiet', meaning: 'Fläche mit besonderen Schutzregeln', wissen: 'Sichert Lebensräume und Arten.' },
    { term: 'Destruent', meaning: 'Zersetzer organischen Materials', wissen: 'Pilze, Bakterien, viele Bodentiere.' },
    { term: 'Kronenschicht', meaning: 'Obere Baumschicht', wissen: 'Viel Licht, eigene Arten.' },
    { term: 'Bodenschutz', meaning: 'Erhalt von Bodenstruktur und -fruchtbarkeit', wissen: 'Wurzeln und Streu schützen vor Erosion.' },
    { term: 'Emission', meaning: 'Ausstoß von Schadstoffen', wissen: 'Kann Wälder belasten — Minderung hilft.' },
    { term: 'Aufforstung', meaning: 'Neubegründung von Wald', wissen: 'Nach Stürmen/Schäden oder als Ausgleich.' },
    { term: 'Biotop', meaning: 'Lebensraum mit typischen Bedingungen', wissen: 'Wald als Biotopkomplex mit Schichten.' },
  ],
  trueFalse: [
    {
      concept: 'bio:k6:waldschutz:tf-bedeutung',
      statement: 'Wälder dienen nur der Holzproduktion und sonst nichts.',
      correct: false,
      explanation: 'Auch Klima-, Wasser-, Arten- und Erholungsschutz.',
      wissen: fw('Holz ist eine Leistung — aber Wälder erfüllen viele ökologische und soziale Funktionen.'),
    },
    {
      concept: 'bio:k6:waldschutz:tf-misch',
      statement: 'Naturnahe Mischwälder können Störungen oft besser abfedern als Reinbestände.',
      correct: true,
      explanation: 'Arten- und Strukturvielfalt erhöhen Widerstandskraft.',
      wissen: fw('Unterschiedliche Arten reagieren verschieden auf Trockenheit oder Schädlinge.'),
    },
  ],
}

export const BIOLOGIE_K6_LEHRPLAN_GAP_GENERATORS: Record<string, Topic['generate']> = {
  'bi-k6-lb2-ordnungen': bankGenerate(k6Insektenordnungen),
  'bi-k6-lb2-honigbiene': bankGenerate(k6Honigbiene),
  'bi-k6-lb2-parasiten': bankGenerate(k6Parasiten),
  'bi-k6-lb4-sporempflanzen': bankGenerate(k6Sporempflanzen),
  'bi-k6-lb4-waldschutz': bankGenerate(k6Waldschutz),
}
