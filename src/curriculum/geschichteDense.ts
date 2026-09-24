/**
 * Dense Geschichte subtopics under Sachsen Lehrplan LBs (lplanid=65).
 * Schlaukopf Gym-Themes mapped into correct Lernbereiche; Formulierungen original.
 * Alle Topics: released:false (Entwickler). K6 LB1 Rom bleibt in geschichte6.ts.
 */
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

const fact = (
  concept: string,
  prompt: string,
  answer: string,
  wrong: [string, string, string],
  explanation: string,
  wissen: string,
  gap: string,
  gapAccepted: string[],
) => ({ concept, prompt, answer, wrong, explanation, wissen, gap, gapAccepted })

const pair = (concept: string, term: string, meaning: string, wissen: string) => ({
  concept, term, meaning, wissen,
})

const tf = (
  concept: string,
  statement: string,
  correct: boolean,
  explanation: string,
  wissen: string,
) => ({ concept, statement, correct, explanation, wissen })

const k5Quellen: BioBank = {
  quelle: "Wikipedia: Historische Quelle",
  url: "https://de.wikipedia.org/wiki/Historische_Quelle",
  conceptPrefix: "ge:k5:quellen",
  facts: [
    fact("primär", "Was ist eine Primärquelle?", "Ein Zeugnis aus der Zeit des Ereignisses selbst", ["Ein heutiges Schulbuch über das Ereignis", "Nur eine Wettervorhersage", "Ein Quiz ohne Beleg"], "Primärquellen entstehen in der Zeit des Geschehens.", "Primärquellen entstehen in der Zeit des Geschehens. Sekundärquellen werten sie später aus. Die Unterscheidung hilft, Nähe zum Ereignis einzuschätzen.", "Eine ___ entsteht in der Zeit des Ereignisses.", ["Primärquelle"]),
    fact("sekundär", "Was ist eine Sekundärquelle?", "Eine spätere Auswertung oder Darstellung historischer Ereignisse", ["Ein Brief aus dem Jahr des Ereignisses", "Nur ein Steinwerkzeug ohne Kontext", "Eine Inschrift aus derselben Stunde"], "Sekundärquellen entstehen später und ordnen Primärquellen ein.", "Sekundärquellen entstehen später und ordnen Primärquellen ein. Schulbücher gehören dazu. Sie ersetzen keine Quellenkritik.", "Eine ___ wertet Ereignisse später aus.", ["Sekundärquelle"]),
    fact("kritik", "Was prüft Quellenkritik vor allem?", "Herkunft, Absicht, Glaubwürdigkeit und Aussagekraft einer Quelle", ["Nur die Schriftgröße", "Nur die Papierfarbe", "Nur heutige Börsenkurse"], "Quellenkritik fragt, wer wann warum etwas hinterlassen hat.", "Quellenkritik fragt, wer wann warum etwas hinterlassen hat. Ohne Kritik drohen Fehlschlüsse. Das gilt für Texte, Bilder und Funde.", "Quellenkritik prüft Herkunft, Absicht und ___.", ["Glaubwürdigkeit","Aussagekraft"]),
    fact("überrest", "Was sind Überreste?", "Materielle oder schriftliche Spuren, die nicht eigens als Geschichtserzählung geschaffen wurden", ["Nur moderne Werbespots", "Nur fiktionale Romane ohne Bezug", "Nur heutige Instantnachrichten"], "Überreste wie Werkzeuge oder Akten entstanden oft für den Alltag.", "Überreste wie Werkzeuge oder Akten entstanden oft für den Alltag. Historiker erschließen daraus Informationen. Der Fundkontext ist wichtig.", "___ sind Spuren, die nicht als Geschichtserzählung gedacht waren.", ["Überreste"]),
    fact("tradition", "Was sind Traditionsquellen?", "Quellen, die bewusst Erinnerung oder Deutung weitergeben wollen", ["Nur metallische Werkzeuge", "Nur Wetterdaten", "Nur moderne Stromtarife"], "Traditionsquellen wollen etwas bewahren oder deuten, etwa Chroniken.", "Traditionsquellen wollen etwas bewahren oder deuten, etwa Chroniken. Sie sind wertvoll, aber oft parteilich. Deshalb braucht es kritische Prüfung.", "Traditionsquellen wollen Erinnerung oder ___ weitergeben.", ["Deutung"]),
    fact("bild", "Warum sind Bildquellen besonders vorsichtig zu deuten?", "Weil sie Perspektiven, Absichten und Symbole enthalten können", ["Weil Bilder nie existieren", "Weil sie immer exakt datiert sind", "Weil sie nur Wetter zeigen"], "Bilder sind keine neutralen Abbilder.", "Bilder sind keine neutralen Abbilder. Künstler oder Auftraggeber setzen Schwerpunkte. Historiker fragen nach Kontext und Absicht.", "Bildquellen können ___ und Absichten enthalten.", ["Perspektiven","Symbole"]),
    fact("lücke", "Warum bleiben historische Deutungen oft unsicher?", "Weil Quellen lückenhaft, parteilich oder mehrdeutig sein können", ["Weil es nie Quellen gibt", "Weil Zeitrechnung unmöglich ist", "Weil Geschichte nur Zahlen sind"], "Quellen decken nie alles ab.", "Quellen decken nie alles ab. Lücken und Interessen begrenzen Sicherheit. Deshalb sprechen Historiker von Rekonstruktion.", "Historische Deutung bleibt oft unsicher, weil Quellen ___ sein können.", ["lückenhaft","parteilich"]),
    fact("sachsen-fund", "Warum sind archäologische Funde in Sachsen für Orientierung wichtig?", "Weil sie regionale Vergangenheit materiell belegen", ["Weil sie nur moderne Parkplätze zeigen", "Weil Geschichte nur in Rom stattfand", "Weil Funde keine Datierung erlauben"], "Regionale Funde machen Vergangenheit vor Ort greifbar.", "Regionale Funde machen Vergangenheit vor Ort greifbar. Sie ergänzen schriftliche Quellen. Museumsbesuche helfen bei der Einordnung.", "Archäologische Funde belegen ___ Vergangenheit materiell.", ["regionale","lokale"]),
  ],
  pairs: [
    pair("p1", "Primärquelle", "Zeugnis aus der Zeit des Ereignisses", "Entsteht im Geschehen selbst."),
    pair("p2", "Quellenkritik", "Prüfung von Herkunft und Glaubwürdigkeit", "Ohne Kritik drohen Fehldeutungen."),
    pair("p3", "Überrest", "Spur ohne Geschichtserzählungsabsicht", "Werkzeuge und Akten sind typische Überreste."),
  ],
  trueFalse: [
    tf("t1", "Historiker prüfen Quellen auf Herkunft, Absicht und Glaubwürdigkeit.", true, "Quellenkritik ist Grundlage historischer Arbeit.", "Quellenkritik ist Grundlage historischer Arbeit. Sie gilt für Texte und Funde. Ohne sie entstehen leicht Fehlschlüsse."),
  ],
}

const k5Zeitrechnung: BioBank = {
  quelle: "Wikipedia: Chronologie",
  url: "https://de.wikipedia.org/wiki/Chronologie",
  conceptPrefix: "ge:k5:zeitrechnung",
  facts: [
    fact("zeitstrahl", "Wozu dient ein Zeitstrahl?", "Ereignisse chronologisch von früher nach später einzuordnen", ["Nur Farben zu mischen", "Wetter vorherzusagen", "Personen zu zählen"], "Ein Zeitstrahl macht Abstände und Reihenfolgen sichtbar.", "Ein Zeitstrahl macht Abstände und Reihenfolgen sichtbar. Er ist ein zentrales Orientierungsinstrument. Epochengrenzen werden so vergleichbar.", "Der ___ ordnet Ereignisse chronologisch.", ["Zeitstrahl"]),
    fact("epoche", "Was meint „Epoche“?", "Einen längeren Zeitraum mit gemeinsamen Merkmalen", ["Nur einen einzelnen Tag", "Nur eine Namensliste", "Nur ein Gebäude"], "Epochen fassen Zeiträume mit typischen Merkmalen zusammen.", "Epochen fassen Zeiträume mit typischen Merkmalen zusammen. Grenzen sind oft fließend. Historiker setzen sie zur Orientierung.", "Eine ___ fasst einen längeren Zeitraum zusammen.", ["Epoche"]),
    fact("vc", "Was bedeutet „v. Chr.“?", "Vor Christus — Jahre vor der christlichen Zeitrechnung", ["Nach Christus", "Vor dem Computer", "Vor Charlemagne"], "„v.", "„v. Chr.“ zählt rückwärts vor Beginn der christlichen Zeitrechnung. „n. Chr.“ zählt vorwärts. Antike Daten sind oft Schätzungen.", "___ bedeutet Jahre vor der christlichen Zeitrechnung.", ["v. Chr.","vor Christus"]),
    fact("nc", "Was bedeutet „n. Chr.“?", "Nach Christus — Jahre der christlichen Zeitrechnung", ["Vor Christus", "Nur Mondkalender", "Nur Römerjahre ohne Bezug"], "„n.", "„n. Chr.“ zählt Jahre nach dem Beginn der christlichen Zeitrechnung. Viele Kalender folgen diesem Schema. Andere Kulturen nutzen eigene Systeme.", "___ bedeutet Jahre der christlichen Zeitrechnung.", ["n. Chr.","nach Christus"]),
    fact("datierung", "Warum ist Datierung eine Orientierungshilfe?", "Weil sie Ereignisse in eine gemeinsame Zeitordnung bringt", ["Weil sie Quellen überflüssig macht", "Weil sie nur Farben erklärt", "Weil sie keine Reihenfolge braucht"], "Datierung verbindet Ereignisse mit Jahren oder Epochen.", "Datierung verbindet Ereignisse mit Jahren oder Epochen. So werden Vergleiche möglich. Ohne Datierung bleibt Geschichte unübersichtlich.", "Datierung bringt Ereignisse in eine gemeinsame ___.", ["Zeitordnung","Ordnung"]),
    fact("unterschied", "Warum gibt es unterschiedliche Zeitrechnungen?", "Weil Kulturen andere Bezugspunkte und Kalender entwickelten", ["Weil Zeit überall gleich gezählt wird", "Weil es nur einen Kalender gibt", "Weil Historiker keine Zahlen nutzen"], "Kalender und Epochenbezug hängen von Kultur und Religion ab.", "Kalender und Epochenbezug hängen von Kultur und Religion ab. Historiker rechnen Systeme oft um. Das erfordert Sorgfalt.", "Unterschiedliche Zeitrechnungen entstehen durch andere ___.", ["Bezugspunkte","Kalender"]),
    fact("rekonstruktion", "Was meint Geschichte als Rekonstruktion?", "Dass Vergangenheit aus Quellen gedeutet, nicht einfach abgebildet wird", ["Dass Geschichte nur erfunden wird", "Dass Quellen unnötig sind", "Dass Zeitstrahlen verboten sind"], "Vergangenheit ist nicht mehr direkt beobachtbar.", "Vergangenheit ist nicht mehr direkt beobachtbar. Historiker rekonstruieren sie aus Spuren. Deutungen können sich mit neuen Funden ändern.", "Geschichte ist eine ___ aus Quellen.", ["Rekonstruktion"]),
    fact("frage", "Warum ist Fragen an die Geschichte wichtig?", "Weil klare Fragen helfen, Quellen gezielt auszuwerten", ["Weil Fragen Quellen zerstören", "Weil Geschichte ohne Fragen auskommt", "Weil nur Daten ohne Frage zählen"], "Gute historische Arbeit beginnt mit Fragen.", "Gute historische Arbeit beginnt mit Fragen. Sie steuern, wonach man in Quellen sucht. So wird Orientierung methodisch.", "Klare ___ steuern die Auswertung von Quellen.", ["Fragen"]),
  ],
  pairs: [
    pair("p1", "Chronologie", "Zeitliche Reihenfolge", "Ordnet, was früher und später geschah."),
    pair("p2", "Epoche", "Längerer Zeitraum mit Merkmalen", "Dient der Orientierung."),
    pair("p3", "Zeitstrahl", "Grafische chronologische Ordnung", "Macht Abstände sichtbar."),
  ],
  trueFalse: [
    tf("t1", "Ein Zeitstrahl zeigt Ereignisse in zufälliger Reihenfolge.", false, "Ein Zeitstrahl ist chronologisch geordnet.", "Ein Zeitstrahl ist chronologisch geordnet. Zufällige Reihenfolge zerstört Orientierung. Abstände werden so sichtbar."),
  ],
}

const k5SteinzeitDetail: BioBank = {
  quelle: "Wikipedia: Steinzeit",
  url: "https://de.wikipedia.org/wiki/Steinzeit",
  conceptPrefix: "ge:k5:steinzeit-detail",
  facts: [
    fact("paleo", "Wovon lebten Menschen in der Altsteinzeit vor allem?", "Von Jagen, Sammeln und Fischen", ["Von industrieller Massentierhaltung", "Von Großbanken", "Von Dampfmaschinen"], "In der Altsteinzeit lebten Menschen als Jäger und Sammler.", "In der Altsteinzeit lebten Menschen als Jäger und Sammler. Gruppen waren oft mobil. Werkzeuge aus Stein und Knochen prägten den Alltag.", "Altsteinzeitliche Menschen lebten als ___.", ["Jäger und Sammler","Wildbeuter"]),
    fact("neo", "Was kennzeichnet die Jungsteinzeit besonders?", "Ackerbau, Viehzucht und sesshafte Dörfer", ["Raumfahrt", "Buchdruck", "Dampfkraft"], "Im Neolithikum begannen Ackerbau und Viehzucht.", "Im Neolithikum begannen Ackerbau und Viehzucht. Sesshaftigkeit veränderte Gesellschaft und Landschaft. Das gilt als Umbruch zum bäuerlichen Leben.", "Die Jungsteinzeit bringt ___ und Viehzucht.", ["Ackerbau","Landwirtschaft"]),
    fact("revolution", "Was meint die „jungsteinzeitliche Revolution“?", "Den Übergang zu Landwirtschaft und Sesshaftigkeit", ["Die Erfindung des Smartphones", "Den Beginn des Mittelalters", "Die Gründung des Völkerbunds"], "Der Begriff beschreibt den tiefen Wandel von Wildbeutern zu Bauern.", "Der Begriff beschreibt den tiefen Wandel von Wildbeutern zu Bauern. Vorräte, Dörfer und neue Arbeitsweisen entstanden. Die Naturbeziehung veränderte sich stark.", "Die jungsteinzeitliche Revolution meint den Übergang zur ___.", ["Landwirtschaft","Sesshaftigkeit"]),
    fact("feuer", "Welche Bedeutung hatte die Beherrschung des Feuers?", "Wärme, Schutz, Nahrung zubereiten, Licht", ["Nur für Stromnetze", "Nur für Autoreifen", "Nur für Smartphones"], "Feuer spendete Wärme und Licht und ermöglichte gekochte Nahrung.", "Feuer spendete Wärme und Licht und ermöglichte gekochte Nahrung. Es war zentral für Lagerleben. Die Kontrolle über Feuer war ein Kulturtechnik-Schritt.", "Feuer diente u. a. der ___.", ["Wärme","Nahrungszubereitung"]),
    fact("höhle", "Wofür sind Höhlenmalereien bekannt?", "Als frühe Bildkunst mit möglichen Ritualbezügen", ["Als Baupläne für Wolkenkratzer", "Als Fahrpläne", "Als Aktienkurse"], "Höhlenmalereien zeigen Tiere und Zeichen der Eiszeit.", "Höhlenmalereien zeigen Tiere und Zeichen der Eiszeit. Sie belegen symbolisches Denken. Der genaue Zweck wird diskutiert.", "Höhlenmalereien belegen frühe ___.", ["Bildkunst","Kunst"]),
    fact("sess", "Was bedeutet Sesshaftigkeit?", "Dauerhaftes Wohnen an einem Ort", ["Ständiges Umherziehen", "Nur Seefahrt", "Nur Weltraumleben"], "Sesshaftigkeit meint festes Wohnen mit Häusern und Feldern.", "Sesshaftigkeit meint festes Wohnen mit Häusern und Feldern. Sie erleichtert Vorräte und Spezialisierung. Nomadisches Leben bleibt daneben bestehen.", "Sesshaftigkeit heißt dauerhaftes ___ an einem Ort.", ["Wohnen","Leben"]),
    fact("vergleich", "Worin unterscheiden sich Alt- und Jungsteinzeit besonders?", "In Mobilität versus bäuerlicher Sesshaftigkeit mit Landwirtschaft", ["In der Nutzung von Atomkraft", "In der Existenz von Parlamenten", "In der Abwesenheit von Werkzeugen"], "Altsteinzeit: oft mobile Wildbeuter.", "Altsteinzeit: oft mobile Wildbeuter. Jungsteinzeit: Ackerbau, Viehzucht, Dörfer. Der Vergleich zeigt einen grundlegenden Lebenswandel.", "Die Jungsteinzeit bringt gegenüber der Altsteinzeit vor allem ___.", ["Sesshaftigkeit","Ackerbau"]),
    fact("natur", "Wie war das Verhältnis zur Natur in der Steinzeit grob geprägt?", "Durch starke Abhängigkeit und Nutzung lokaler Ressourcen", ["Durch Industrieemissionen", "Durch unabhängige Raumfahrt", "Durch globale Finanzmärkte"], "Steinzeitliche Gruppen hingen von Klima, Tieren und Pflanzen ab.", "Steinzeitliche Gruppen hingen von Klima, Tieren und Pflanzen ab. Werkzeuge halfen bei der Nutzung. Religion und Kunst spiegelten oft Naturbezüge.", "Steinzeitliches Leben hing stark von der ___ ab.", ["Natur"]),
  ],
  pairs: [
    pair("p1", "Altsteinzeit", "Jagen und Sammeln, oft mobil", "Werkzeuge aus Stein und Knochen."),
    pair("p2", "Jungsteinzeit", "Ackerbau, Viehzucht, Sesshaftigkeit", "Auch neolithische Revolution genannt."),
    pair("p3", "Sesshaftigkeit", "Dauerhaftes Wohnen an einem Ort", "Ermöglicht Vorräte und Spezialisierung."),
  ],
  trueFalse: [
    tf("t1", "Die Jungsteinzeit bringt Ackerbau und sesshafte Dörfer.", true, "Ackerbau und Viehzucht veränderten das Zusammenleben.", "Ackerbau und Viehzucht veränderten das Zusammenleben. Sesshaftigkeit wurde typisch. Das unterscheidet sie klar von vielen altsteinzeitlichen Lebensweisen."),
  ],
}

const k5Aegypten: BioBank = {
  quelle: "Wikipedia: Altes Ägypten",
  url: "https://de.wikipedia.org/wiki/Altes_%C3%84gypten",
  conceptPrefix: "ge:k5:aegypten",
  facts: [
    fact("nil", "Warum war der Nil für Ägypten entscheidend?", "Überschwemmungen düngten die Felder und ermöglichten Landwirtschaft", ["Weil er nie Wasser führte", "Weil er nur gefror", "Weil er nur Bergbau ermöglichte"], "Nilüberschwemmungen brachten fruchtbaren Schlamm.", "Nilüberschwemmungen brachten fruchtbaren Schlamm. Landwirtschaft hing vom Fluss ab. Kalender und Verwaltung organisierten Aussaat.", "Der Nil brachte ___ auf die Felder.", ["Schlamm","Fruchtbarkeit","Wasser"]),
    fact("pharao", "Wer stand an der Spitze des ägyptischen Staates?", "Der Pharao als Herrscher mit religiöser und politischer Macht", ["Nur ein gewählter Bürgermeister", "Nur ein römischer Konsul", "Nur ein mittelalterlicher Vasall"], "Der Pharao galt als zentraler Herrscher.", "Der Pharao galt als zentraler Herrscher. Religion und Staat waren eng verbunden. Beamte unterstützten Verwaltung und Bauvorhaben.", "An der Spitze stand der ___.", ["Pharao"]),
    fact("beamte", "Welche Rolle hatten Beamte in Ägypten?", "Sie organisierten Verwaltung, Abgaben und Bauaufgaben", ["Sie regierten nur moderne Firmen", "Sie waren nur Gladiatoren", "Sie druckten nur Zeitungen"], "Ohne Verwaltung funktionierte der Flussstaat nicht.", "Ohne Verwaltung funktionierte der Flussstaat nicht. Beamte erfassten Ernten und organisierten Arbeit. Schriftlichkeit war dafür wichtig.", "Beamte organisierten ___ und Bauaufgaben.", ["Verwaltung","Abgaben"]),
    fact("pyramide", "Wofür stehen die Pyramiden vor allem?", "Als monumentale Grab- und Herrschaftsbauten der Pharaonenzeit", ["Als moderne Hochhäuser", "Als römische Aquädukte", "Als mittelalterliche Burgen"], "Pyramiden zeigen Organisation, Religion und Macht.", "Pyramiden zeigen Organisation, Religion und Macht. Tausende Arbeitskräfte waren nötig. Sie gehören zu den bekanntesten Zeugnissen der Hochkultur.", "Pyramiden sind monumentale ___ der Pharaonenzeit.", ["Grabbauten","Bauten"]),
    fact("schrift", "Welche Schrift ist für Ägypten besonders bekannt?", "Hieroglyphen", ["Lateinische Blockschrift der Neuzeit", "Morsezeichen", "QR-Codes"], "Hieroglyphen dienten Kult, Verwaltung und Erinnerung.", "Hieroglyphen dienten Kult, Verwaltung und Erinnerung. Schriftlichkeit stärkte den Staat. Lesen und Schreiben waren spezialisierte Fähigkeiten.", "In Ägypten sind ___ besonders bekannt.", ["Hieroglyphen"]),
    fact("religion", "Wie war Religion im alten Ägypten mit Herrschaft verbunden?", "Der Pharao galt als Mittler zwischen Göttern und Menschen", ["Religion spielte keine Rolle", "Nur Städte ohne Tempel existierten", "Nur moderne Parteien bestimmten Kult"], "Tempel, Götter und Rituale prägten den Alltag.", "Tempel, Götter und Rituale prägten den Alltag. Herrschaft wurde religiös begründet. Das stärkte Ordnung und Legitimation.", "Der Pharao galt als ___ zwischen Göttern und Menschen.", ["Mittler"]),
    fact("gesellschaft", "Wie war die ägyptische Gesellschaft grob gegliedert?", "Hierarchisch mit Pharao, Beamten, Bauern und abhängigen Gruppen", ["Als moderne Demokratie mit Parteien", "Als reine Nomadengesellschaft ohne Staat", "Als Industriegesellschaft mit Fabriken"], "Eine Gesellschaftspyramide hilft zur Orientierung.", "Eine Gesellschaftspyramide hilft zur Orientierung. Bauern trugen die Landwirtschaft. Oberschicht und Beamte organisierten den Staat.", "Die Gesellschaft war ___ gegliedert.", ["hierarchisch"]),
    fact("staat", "Warum gilt Ägypten als Beispiel früher Staatswerdung?", "Weil zentrale Herrschaft, Verwaltung und Schrift ein großes Gemeinwesen organisierten", ["Weil es keine Flüsse gab", "Weil es nur mobile Jäger gab", "Weil es keine Religion gab"], "Fluss, Landwirtschaft und Verwaltung ermöglichten einen Staat.", "Fluss, Landwirtschaft und Verwaltung ermöglichten einen Staat. Schrift und Beamte steuerten Ressourcen. Natur und Organisation hingen zusammen.", "Ägypten zeigt frühe ___ mit Verwaltung und Schrift.", ["Staatswerdung","Staatlichkeit"]),
  ],
  pairs: [
    pair("p1", "Pharao", "Herrscher mit politischer und religiöser Macht", "Stand an der Spitze des Staates."),
    pair("p2", "Nil", "Lebensader mit fruchtbaren Überschwemmungen", "Grundlage der Landwirtschaft."),
    pair("p3", "Hieroglyphen", "Ägyptische Bilderschrift", "Wichtig für Kult und Verwaltung."),
  ],
  trueFalse: [
    tf("t1", "Der Nil war für die ägyptische Landwirtschaft unerheblich.", false, "Ohne Nilüberschwemmungen wäre die Fruchtbarkeit stark eingeschränkt gewesen.", "Ohne Nilüberschwemmungen wäre die Fruchtbarkeit stark eingeschränkt gewesen. Der Fluss prägte Kalender und Staat. Deshalb ist er zentral für die Hochkultur."),
  ],
}

const k5Metallzeit: BioBank = {
  quelle: "Wikipedia: Metallzeit",
  url: "https://de.wikipedia.org/wiki/Metallzeit",
  conceptPrefix: "ge:k5:metallzeit",
  facts: [
    fact("metall", "Was kennzeichnet die Metallzeit besonders?", "Nutzung von Metallen für Werkzeuge, Waffen und Schmuck", ["Nur Stein ohne Metall", "Nur Kunststoff", "Nur Dampfmaschinen"], "Bronze- und Eisenzeit brachten neue Werkstoffe.", "Bronze- und Eisenzeit brachten neue Werkstoffe. Handwerk wurde spezialisierter. Handel mit Rohstoffen gewann an Bedeutung.", "Die Metallzeit nutzt ___ für Werkzeuge und Waffen.", ["Metalle","Metall"]),
    fact("bronze", "Woraus besteht Bronze vor allem?", "Aus Kupfer und Zinn", ["Aus nur reinem Eisen", "Aus Kunststoff", "Aus Beton"], "Bronze legierte Kupfer mit Zinn.", "Bronze legierte Kupfer mit Zinn. Sie war härter als reines Kupfer. Das veränderte Handwerk und Waffen.", "Bronze besteht vor allem aus Kupfer und ___.", ["Zinn"]),
    fact("spezial", "Warum förderte Metallverarbeitung Spezialisierung?", "Weil Gewinnung und Verarbeitung besonderes Können und Arbeitsteilung brauchten", ["Weil jeder alles allein konnte", "Weil Metalle nutzlos waren", "Weil Landwirtschaft verschwand"], "Erzsuche, Schmelzen und Schmieden erfordern Können.", "Erzsuche, Schmelzen und Schmieden erfordern Können. Nicht alle arbeiteten gleich. Spezialisiertes Handwerk entstand.", "Metallverarbeitung fördert ___ und Arbeitsteilung.", ["Spezialisierung"]),
    fact("handel", "Warum wurde Fernhandel in der Metallzeit wichtiger?", "Weil Rohstoffe wie Zinn oder Kupfer oft von weit her kamen", ["Weil niemand Rohstoffe brauchte", "Weil nur lokale Steine zählten", "Weil Schiffe verboten waren"], "Metalle sind ungleich verteilt.", "Metalle sind ungleich verteilt. Handel verband Regionen. Das veränderte Kontakte und Macht.", "Fernhandel wurde wichtiger wegen knapper ___.", ["Rohstoffe","Metalle"]),
    fact("hoch", "Was kennzeichnet frühe Hochkulturen grob?", "Schrift, Städte, Spezialisierung, zentrale Herrschaft", ["Nur Nomadentum ohne Schrift", "Nur Steinzeitjagd", "Nur moderne Industrie"], "Hochkulturen entwickelten Städte, Verwaltung und oft Schrift.", "Hochkulturen entwickelten Städte, Verwaltung und oft Schrift. Flusstäler boten günstige Bedingungen. Herrschaft und Religion waren eng verknüpft.", "Frühe Hochkulturen haben oft ___ und Städte.", ["Schrift","Verwaltung"]),
    fact("meso", "Wo lag Mesopotamien?", "Zwischen Euphrat und Tigris", ["Zwischen Rhein und Donau", "In Skandinavien", "In Australien"], "Mesopotamien liegt zwischen Euphrat und Tigris.", "Mesopotamien liegt zwischen Euphrat und Tigris. Dort entstanden Stadtstaaten und Keilschrift. Bewässerung war Grundlage der Landwirtschaft.", "Mesopotamien liegt zwischen ___ und Tigris.", ["Euphrat"]),
    fact("keil", "Welche Schrift entstand in Mesopotamien?", "Keilschrift", ["Lateinische Blockschrift der Neuzeit", "Morsezeichen", "QR-Codes"], "Keilschrift entstand in Mesopotamien, oft auf Tontafeln.", "Keilschrift entstand in Mesopotamien, oft auf Tontafeln. Sie diente Verwaltung und Literatur. Schrift macht komplexe Gesellschaften steuerbar.", "In Mesopotamien entstand die ___.", ["Keilschrift"]),
    fact("handwerk", "Warum ist spezialisiertes Handwerk ein Merkmal späterer Stein- und Metallzeiten?", "Weil nicht mehr alle dieselben Tätigkeiten ausübten", ["Weil Handwerk verboten war", "Weil nur Könige arbeiteten", "Weil Landwirtschaft verschwand"], "Arbeitsteilung steigt mit komplexeren Techniken.", "Arbeitsteilung steigt mit komplexeren Techniken. Handwerker, Bauern und Herrscher erfüllen unterschiedliche Rollen. Das verändert Zusammenleben.", "Spezialisiertes Handwerk bedeutet stärkere ___.", ["Arbeitsteilung"]),
  ],
  pairs: [
    pair("p1", "Bronze", "Legierung aus Kupfer und Zinn", "Wichtiger Werkstoff der Bronzezeit."),
    pair("p2", "Keilschrift", "Schrift Mesopotamiens", "Oft auf Tontafeln."),
    pair("p3", "Hochkultur", "Städte, Schrift, zentrale Herrschaft", "Oft in Flusstälern."),
  ],
  trueFalse: [
    tf("t1", "Metallzeit bedeutet ausschließlich den Verzicht auf jedes Handwerk.", false, "Gerade Handwerk und Spezialisierung nehmen zu.", "Gerade Handwerk und Spezialisierung nehmen zu. Metalle erfordern Können. Handel und Technik verändern Gesellschaften."),
  ],
}

const k5Athen: BioBank = {
  quelle: "Wikipedia: Attische Demokratie",
  url: "https://de.wikipedia.org/wiki/Attische_Demokratie",
  conceptPrefix: "ge:k5:athen",
  facts: [
    fact("polis", "Was war eine Polis im antiken Griechenland?", "Ein Stadtstaat mit eigenem Territorium und politischer Ordnung", ["Ein modernes Bundesland", "Nur ein Tempel ohne Bewohner", "Eine römische Provinzverwaltung"], "Die Polis war die typische politische Einheit Griechenlands.", "Die Polis war die typische politische Einheit Griechenlands. Bürger, Stadt und Umland bildeten eine Gemeinschaft. Verschiedene Poleis hatten unterschiedliche Verfassungen.", "Eine ___ war ein griechischer Stadtstaat.", ["Polis"]),
    fact("volk", "Was war die Volksversammlung in Athen?", "Die Versammlung der stimmberechtigten Bürger zur Entscheidungsfindung", ["Nur eine Theaterprobe", "Nur ein Markt ohne Politik", "Ein römischer Senat"], "In der attischen Demokratie berieten Bürger über Gesetze und Politik.", "In der attischen Demokratie berieten Bürger über Gesetze und Politik. Teilhabe galt aber nur für freie Männer mit Bürgerrecht. Frauen, Sklaven und Metöken waren ausgeschlossen.", "Die ___ beriet über Gesetze und Politik.", ["Volksversammlung"]),
    fact("scherben", "Wozu diente das Scherbengericht in Athen?", "Zur Verbannung eines als gefährlich geltenden Politikers", ["Zur Wahl von Pharaonen", "Zur Verteilung von Land an Ritter", "Zur Krönung von Kaisern"], "Beim Ostrakismos schrieben Bürger Namen auf Scherben.", "Beim Ostrakismos schrieben Bürger Namen auf Scherben. Wer genügend Stimmen erhielt, musste zeitweise Athen verlassen. Es sollte Machtmissbrauch vorbeugen.", "Das Scherbengericht diente der ___.", ["Verbannung"]),
    fact("ausschluss", "Wer hatte in Athen keine politischen Mitbestimmungsrechte?", "Unter anderem Frauen, Sklaven und Metöken", ["Nur die Volksversammlung selbst", "Nur freie Männer mit Bürgerrecht", "Nur Olympiasieger"], "Die attische Demokratie war keine moderne Gleichheit.", "Die attische Demokratie war keine moderne Gleichheit. Viele Menschen lebten in der Polis ohne Stimmrecht. Das gehört zur kritischen Bewertung des antiken Demokratieverständnisses.", "Ohne Stimmrecht blieben u. a. Frauen, Sklaven und ___.", ["Metöken"]),
    fact("500", "Wann etwa entwickelte sich die attische Demokratie entscheidend?", "Um 500 v. Chr.", ["Um 1848 n. Chr.", "Um 1945 n. Chr.", "Im 30-jährigen Krieg"], "Im 5.", "Im 5. Jahrhundert v. Chr. wurde Athen zu einem zentralen Beispiel politischer Mitbestimmung freier Bürger. Reformen und Praxis prägten das Bild. Der Vergleich mit heute bleibt wichtig.", "Die attische Demokratie entwickelte sich um ___ v. Chr.", ["500"]),
    fact("gegenwart", "Warum ist attische Demokratie für die Gegenwart interessant?", "Weil sie frühe Formen politischer Mitbestimmung zeigt und Grenzen sichtbar macht", ["Weil sie moderne Parteien erfand", "Weil sie Frauenwahlrecht einführte", "Weil sie Atomwaffen regelte"], "Athen zeigt, dass Demokratie historisch gewachsen ist.", "Athen zeigt, dass Demokratie historisch gewachsen ist. Zugleich macht der Ausschluss vieler Gruppen Grenzen klar. So lässt sich antikes und heutiges Demokratieverständnis vergleichen.", "Attische Demokratie zeigt frühe ___ und ihre Grenzen.", ["Mitbestimmung"]),
    fact("bürger", "Wer galt in Athen als politisch berechtigter Bürger?", "Freie Männer mit Bürgerrecht der Polis", ["Alle Einwohner einschließlich Sklaven", "Nur Frauen der Oberschicht", "Nur fremde Händler"], "Bürgerrecht war an Herkunft und Status gebunden.", "Bürgerrecht war an Herkunft und Status gebunden. Nicht jeder Bewohner war Bürger. Das prägte politische Teilhabe.", "Politisch berechtigt waren freie Männer mit ___.", ["Bürgerrecht"]),
    fact("vielfalt", "Warum spricht man von politischer Vielfalt im antiken Griechenland?", "Weil Poleis unterschiedliche Ordnungen hatten, z. B. Athen und Sparta", ["Weil alle Poleis identisch regiert wurden", "Weil es nur eine Monarchie gab", "Weil Rom alle Poleis sofort abschaffte"], "Griechenland war kulturell verbunden, politisch aber vielfältig.", "Griechenland war kulturell verbunden, politisch aber vielfältig. Athen und Sparta stehen für unterschiedliche Modelle. Das zeigt Vielfalt innerhalb einer Kultur.", "Politische Vielfalt meint unterschiedliche ___ der Poleis.", ["Ordnungen","Verfassungen"]),
  ],
  pairs: [
    pair("p1", "Polis", "Griechischer Stadtstaat", "Politische Grundeinheit der Antike."),
    pair("p2", "Volksversammlung", "Bürgerversammlung in Athen", "Entscheidungen über Politik und Gesetze."),
    pair("p3", "Scherbengericht", "Verbannung durch Abstimmung", "Sollte Machtmissbrauch vorbeugen."),
  ],
  trueFalse: [
    tf("t1", "In der attischen Demokratie hatten alle Einwohner einschließlich Sklaven und Frauen volles Stimmrecht.", false, "Nur freie Männer mit Bürgerrecht waren stimmberechtigt.", "Nur freie Männer mit Bürgerrecht waren stimmberechtigt. Frauen, Sklaven und Metöken blieben ausgeschlossen. Das ist zentral für die Bewertung."),
  ],
}

const k5Sparta: BioBank = {
  quelle: "Wikipedia: Sparta",
  url: "https://de.wikipedia.org/wiki/Sparta",
  conceptPrefix: "ge:k5:sparta",
  facts: [
    fact("militär", "Wofür war Sparta besonders bekannt?", "Für eine streng militärisch geprägte Lebens- und Staatsordnung", ["Für attische Volksversammlung allein", "Für römische Konsuln", "Für mittelalterliches Lehnswesen"], "Sparta galt als Militärstaat.", "Sparta galt als Militärstaat. Erziehung und Alltag waren auf Disziplin und Kampf ausgerichtet. Das unterschied es deutlich von Athen.", "Sparta war besonders ___ geprägt.", ["militärisch"]),
    fact("spartiaten", "Wer waren die Spartiaten?", "Die vollberechtigten Bürger Spartas mit politischer und militärischer Rolle", ["Nur Sklaven ohne Rechte", "Nur athenische Händler", "Nur römische Senatoren"], "Spartiaten bildeten die herrschende Bürgerschaft.", "Spartiaten bildeten die herrschende Bürgerschaft. Ihre Zahl war begrenzt. Militärdienst und Gemeinschaft prägten ihren Status.", "Vollberechtigte Bürger Spartas hießen ___.", ["Spartiaten"]),
    fact("heloten", "Wer waren die Heloten?", "Unfreie abhängige Landbewohner unter spartanischer Herrschaft", ["Freie athenische Bürger", "Römische Konsuln", "Mittelalterliche Zunftmeister"], "Heloten arbeiteten die Felder und waren unfrei.", "Heloten arbeiteten die Felder und waren unfrei. Sparta kontrollierte sie streng. Das System sicherte die Versorgung der Spartiaten.", "Heloten waren ___ Landbewohner.", ["unfreie","abhängige"]),
    fact("erziehung", "Worauf zielte die spartanische Erziehung stark ab?", "Auf Disziplin, Gehorsam und militärische Tüchtigkeit", ["Auf freie Kunstdebatten in der Agora allein", "Auf Industriearbeit", "Auf Pressefreiheit"], "Jungen wurden früh gemeinschaftlich erzogen.", "Jungen wurden früh gemeinschaftlich erzogen. Härte und Gehorsam standen im Vordergrund. Das diente der Kriegsfähigkeit des Staates.", "Spartanische Erziehung betonte Disziplin und ___.", ["militärische Tüchtigkeit","Gehorsam"]),
    fact("vergleich", "Worin unterschied sich Sparta deutlich von Athen?", "In der stärker militärischen Ordnung statt breiter Bürgerversammlungspraxis", ["In der Ablehnung jeder Polis", "Im Verzicht auf jede Hierarchie", "Im modernen Parteienstaat"], "Beide waren griechische Poleis, aber verschieden organisiert.", "Beide waren griechische Poleis, aber verschieden organisiert. Athen betonte Bürgerversammlung, Sparta Disziplin und Militär. Der Vergleich zeigt politische Vielfalt.", "Sparta war stärker ___ ausgerichtet als Athen.", ["militärisch"]),
    fact("metöken", "Was waren Metöken in griechischen Poleis grob?", "Freie Fremde ohne volles Bürgerrecht", ["Nur Pharaonen", "Nur Ritter", "Nur römische Kaiser"], "Metöken lebten oft als Händler oder Handwerker in der Polis.", "Metöken lebten oft als Händler oder Handwerker in der Polis. Sie hatten keinen vollen Bürgerstatus. Der Begriff hilft, Ausschluss von Teilhabe zu verstehen.", "Metöken waren freie Fremde ohne volles ___.", ["Bürgerrecht"]),
    fact("ordnung", "Warum spricht man bei Sparta von einem Militärstaat?", "Weil Staat, Erziehung und Alltag stark auf Kriegsfähigkeit ausgerichtet waren", ["Weil es keine Soldaten gab", "Weil nur Frauen regierten", "Weil es eine moderne Demokratie war"], "Militärische Bereitschaft war Organisationsprinzip.", "Militärische Bereitschaft war Organisationsprinzip. Unfreie Arbeit der Heloten ermöglichte den Spartiaten Konzentration auf Waffen. Das prägte das Bild Spartas.", "Sparta galt als ___, weil Kriegsfähigkeit zentral war.", ["Militärstaat"]),
    fact("vielfalt", "Was zeigt der Vergleich Athen–Sparta für Griechenland?", "Politische Vielfalt trotz kultureller Gemeinsamkeiten", ["Dass alle Poleis identisch waren", "Dass es keine Götter gab", "Dass Rom schon Klasse 5 gegründet wurde"], "Götterwelt und Sprache verbanden viele Griechen.", "Götterwelt und Sprache verbanden viele Griechen. Politische Ordnungen unterschieden sich stark. Vielfalt und Einheit gehören zusammen.", "Athen und Sparta zeigen politische ___ in Griechenland.", ["Vielfalt"]),
  ],
  pairs: [
    pair("p1", "Spartiaten", "Vollberechtigte Bürger Spartas", "Militärisch und politisch zentral."),
    pair("p2", "Heloten", "Unfreie abhängige Landbewohner", "Sicherten die Versorgung."),
    pair("p3", "Militärstaat", "Stark auf Kriegsfähigkeit ausgerichtet", "Kennzeichen Spartas."),
  ],
  trueFalse: [
    tf("t1", "Sparta und Athen hatten dieselbe politische Ordnung.", false, "Beide waren Poleis, aber unterschiedlich organisiert.", "Beide waren Poleis, aber unterschiedlich organisiert. Athen betonte Bürgerversammlung, Sparta Militär und Disziplin. Genau das zeigt Vielfalt."),
  ],
}

const k5GriechenKultur: BioBank = {
  quelle: "Wikipedia: Antikes Griechenland",
  url: "https://de.wikipedia.org/wiki/Antikes_Griechenland",
  conceptPrefix: "ge:k5:griechen-kultur",
  facts: [
    fact("götter", "Was kennzeichnet die griechische Götterwelt?", "Viele Götter mit menschlichen Zügen und eigenen Zuständigkeiten", ["Nur ein Gott ohne Mythen", "Nur moderne Parteien", "Nur römische Kaiser als einzige Gottheiten"], "Die Griechen verehrten viele Götter wie Zeus oder Athene.", "Die Griechen verehrten viele Götter wie Zeus oder Athene. Mythen erklärten Welt und Werte. Kulte verbanden die Poleis kulturell.", "Die griechische Religion kannte viele ___.", ["Götter"]),
    fact("olympia", "Wofür stehen die Olympischen Spiele der Antike?", "Für sportliche Wettkämpfe zu Ehren der Götter und als panhellenisches Ereignis", ["Für römische Gladiatorenkämpfe allein", "Für mittelalterliche Turniere nur", "Für moderne Fußball-WM ohne Bezug"], "In Olympia traten Athleten aus verschiedenen Poleis an.", "In Olympia traten Athleten aus verschiedenen Poleis an. Die Spiele hatten religiösen Charakter. Sie zeigten kulturelle Einheit trotz politischer Vielfalt.", "Die Olympischen Spiele waren ___ Wettkämpfe.", ["sportliche","panhellenische"]),
    fact("kunst", "Welche Künste prägten das antike Griechenland besonders?", "Unter anderem Tempelbau, Skulptur, Theater und Dichtung", ["Nur industrielle Fotografie", "Nur Buchdruck Gutenberg", "Nur Comics des 21. Jahrhunderts"], "Kunst und Architektur vermittelten religiöse und politische Botschaften.", "Kunst und Architektur vermittelten religiöse und politische Botschaften. Theater behandelte Konflikte und Werte. Viele Werke wurden später Vorbild.", "Griechische Kultur prägte Tempelbau, Skulptur und ___.", ["Theater","Dichtung"]),
    fact("einheit", "Worin lag kulturelle Einheit Griechenlands trotz vieler Poleis?", "In Sprache, Götterwelt, Spielen und gemeinsamen Vorstellungen", ["In einer einzigen Zentralregierung", "In römischem Bürgerrecht für alle", "In industrieller Produktion"], "Griechen teilten wichtige kulturelle Bezugspunkte.", "Griechen teilten wichtige kulturelle Bezugspunkte. Politisch blieben sie getrennt. Einheit und Vielfalt gehören zum Bild der Epoche.", "Kulturelle Einheit lag u. a. in Sprache und ___.", ["Götterwelt","Spielen"]),
    fact("theater", "Welche Rolle spielte das Theater?", "Es behandelte Mythen, Konflikte und gesellschaftliche Fragen öffentlich", ["Es war nur Privatsport ohne Publikum", "Es ersetzte jede Religion", "Es diente nur dem Buchdruck"], "Tragödien und Komödien wurden vor Publikum aufgeführt.", "Tragödien und Komödien wurden vor Publikum aufgeführt. Sie reflektierten Werte und Konflikte. Theater war Teil der Poliskultur.", "Theater behandelte öffentlich Mythen und ___.", ["Konflikte","Fragen"]),
    fact("tempel", "Wofür standen griechische Tempel?", "Als Kultorte und Ausdruck religiöser und politischer Ordnung", ["Als römische Thermen allein", "Als mittelalterliche Burgen", "Als moderne Fabriken"], "Tempel waren Zentren des Kults.", "Tempel waren Zentren des Kults. Architektur zeigte Können und Werte. Sie gehörten zur kulturellen Landschaft der Poleis.", "Tempel waren vor allem ___.", ["Kultorte"]),
    fact("panhellenisch", "Was bedeutet panhellenisch grob?", "Ganzgriechisch — mehrere Poleis betreffend", ["Nur athenisch", "Nur spartanisch", "Nur römisch"], "Panhellenische Feste verbanden Griechen über Polisgrenzen hinweg.", "Panhellenische Feste verbanden Griechen über Polisgrenzen hinweg. Olympia ist das bekannteste Beispiel. So entstand ein gemeinsamer Kulturraum.", "Panhellenisch meint ___ Feste oder Bezüge.", ["ganzgriechische","überpoleis"]),
    fact("vergleich", "Warum ist kulturelle Einheit ein wichtiges Lehrplanthema?", "Weil sie Gemeinsamkeiten trotz politischer Vielfalt erklärt", ["Weil Politik keine Rolle spielte", "Weil es keine Götter gab", "Weil Griechenland industriell war"], "Schüler sollen Einheit und Vielfalt unterscheiden.", "Schüler sollen Einheit und Vielfalt unterscheiden. Gemeinsame Kultur erklärt Austausch. Politische Unterschiede bleiben sichtbar.", "Kulturelle Einheit erklärt Gemeinsamkeiten trotz politischer ___.", ["Vielfalt"]),
  ],
  pairs: [
    pair("p1", "Olympische Spiele", "Panhellenische Wettkämpfe", "Religiös und sportlich."),
    pair("p2", "Götterwelt", "Viele Götter mit Mythen", "Kulturelle Gemeinsamkeit."),
    pair("p3", "Tempel", "Kultort und Architektur", "Ausdruck von Religion und Ordnung."),
  ],
  trueFalse: [
    tf("t1", "Olympische Spiele verbanden griechische Poleis kulturell trotz politischer Vielfalt.", true, "Athleten aus verschiedenen Poleis traten an.", "Athleten aus verschiedenen Poleis traten an. Die Spiele hatten religiösen Charakter. Sie sind ein Beispiel panhellenischer Kultur."),
  ],
}

const k6Lehnswesen: BioBank = {
  quelle: "Wikipedia: Lehnswesen",
  url: "https://de.wikipedia.org/wiki/Lehnswesen",
  conceptPrefix: "ge:k6:lehnswesen",
  facts: [
    fact("lehen", "Was war ein Lehen im Mittelalter?", "Ein Gut oder Recht, das ein Herr seinem Vasallen gegen Dienste überließ", ["Eine städtische Steuer nur für Handwerker", "Ein Klosterschwur ohne Besitz", "Ein Bürgerrecht der antiken Polis"], "Im Lehnswesen vergab ein Lehnsherr Land oder Rechte an einen Vasallen.", "Im Lehnswesen vergab ein Lehnsherr Land oder Rechte an einen Vasallen. Dafür schuldete der Vasall Treue und meist militärische Dienste. Herrschaft war persönlich gebunden.", "Ein ___ war ein Gut oder Recht gegen Treue und Dienste.", ["Lehen"]),
    fact("vasall", "Welche Hauptpflicht hatte ein Vasall?", "Treue und Dienst, besonders Heeresfolge und Beratung", ["Nur Handel mit Fernwaren", "Ausschließlich geistliche Predigt", "Steuerfreiheit ohne Gegenleistung"], "Ein Vasall war durch Treueeid gebunden.", "Ein Vasall war durch Treueeid gebunden. Er musste den Herrn beraten und oft Kriegsdienst leisten. Das Verhältnis beruhte auf gegenseitigen Pflichten.", "Ein Vasall schuldete vor allem ___ und Dienst.", ["Treue"]),
    fact("herr", "Was leistete der Lehnsherr dem Vasallen?", "Schutz und die Überlassung von Lehen", ["Nur moderne Sozialhilfe", "Nur olympische Medaillen", "Nur römische Gladiatorenkämpfe"], "Der Herr gewährte Land, Einkünfte oder Rechte.", "Der Herr gewährte Land, Einkünfte oder Rechte. Dafür erwartete er Treue. So entstand ein Netz persönlicher Bindungen.", "Der Lehnsherr gewährte Schutz und ___.", ["Lehen"]),
    fact("personal", "Warum war mittelalterliche Herrschaft oft persönlich?", "Weil Bindungen über Treue und Lehen liefen, nicht nur über moderne Ämter", ["Weil es keine Treue gab", "Weil nur Maschinen regierten", "Weil Parlamente alles steuerten"], "Lehnswesen knüpfte Macht an Personen.", "Lehnswesen knüpfte Macht an Personen. Vasallität war kein moderner Beamtenstaat. Das erklärt Strukturen der Epoche.", "Herrschaft lief oft über persönliche ___.", ["Bindungen","Treue"]),
    fact("heer", "Warum war Heeresfolge wichtig?", "Weil Vasallen den Herrn im Krieg unterstützen mussten", ["Weil Krieg verboten war", "Weil nur Bauern kämpften ohne Auftrag", "Weil Städte keine Mauern hatten"], "Militärische Hilfe war Kern der Gegenleistung.", "Militärische Hilfe war Kern der Gegenleistung. Ohne Heeresfolge fehlte dem Herrn Macht. Das prägte Politik und Krieg.", "Vasallen schuldeten oft ___.", ["Heeresfolge","Kriegsdienst"]),
    fact("grund", "Wie hängen Lehnswesen und Grundherrschaft zusammen?", "Beide ordnen Herrschaft über Land und abhängige Menschen", ["Beide sind moderne Demokratien", "Beide stammen aus der Industriellen Revolution", "Beide sind nur römische Ämter"], "Auf dem Land war Grundherrschaft zentral.", "Auf dem Land war Grundherrschaft zentral. Lehen konnten Rechte an Land und Leuten umfassen. Beides prägte Abhängigkeit.", "Beide betreffen Herrschaft über ___.", ["Land"]),
    fact("eid", "Wozu diente der Treueeid?", "Er bekräftigte die gegenseitige Bindung von Herr und Vasall", ["Er ersetzte jede Landwirtschaft", "Er gründete den Völkerbund", "Er schuf attische Demokratie"], "Der Eid machte das Verhältnis öffentlich und verbindlich.", "Der Eid machte das Verhältnis öffentlich und verbindlich. Bruch galt als schweres Vergehen. Rituale sicherten Ordnung.", "Der ___ bekräftigte die Bindung.", ["Treueeid","Eid"]),
    fact("netz", "Was entstand durch viele Lehnsbindungen?", "Ein Netz abgestufter Herrschaftsbeziehungen", ["Ein einheitlicher Industriestaat", "Ein modernes Parteienwesen", "Ein Kaltes-Kriegs-Block"], "Könige, Herzöge und lokale Herren waren oft mehrfach gebunden.", "Könige, Herzöge und lokale Herren waren oft mehrfach gebunden. Macht war gestuft. Das erklärt mittelalterliche Politik.", "Lehnsbindungen bildeten ein ___ von Herrschaft.", ["Netz"]),
  ],
  pairs: [
    pair("p1", "Lehen", "Gut oder Recht gegen Dienst", "Kern des Lehnswesens."),
    pair("p2", "Vasall", "Treuepflichtiger Gefolgsmann", "Schuldete Dienst dem Herrn."),
    pair("p3", "Treueeid", "Bekräftigt die Bindung", "Öffentlich und verbindlich."),
  ],
  trueFalse: [
    tf("t1", "Ein Lehen wurde ohne jede Gegenleistung vergeben.", false, "Gegenleistung war Treue und Dienst.", "Gegenleistung war Treue und Dienst. Ohne das fehlt der Kern des Lehnswesens. Herrschaft war vertraglich-persönlich gedacht."),
  ],
}

const k6AlltagStaende: BioBank = {
  quelle: "Wikipedia: Ständeordnung",
  url: "https://de.wikipedia.org/wiki/St%C3%A4ndeordnung",
  conceptPrefix: "ge:k6:alltag-staende",
  facts: [
    fact("stände", "Was meint die mittelalterliche Ständeordnung grob?", "Eine Gliederung der Gesellschaft in Gruppen mit unterschiedlichen Rechten und Pflichten", ["Eine moderne Parteiendemokratie", "Eine reine Industriegesellschaft", "Eine römische Republik ohne Stand"], "Klerus, Adel und Bauern oder Bürger wurden oft unterschieden.", "Klerus, Adel und Bauern oder Bürger wurden oft unterschieden. Rechte und Pflichten hingen vom Stand ab. Mobilität war begrenzt.", "Die Ständeordnung gliedert Gesellschaft nach Rechten und ___.", ["Pflichten"]),
    fact("bauer", "Wie lebten viele Bauern unter Grundherrschaft?", "Abhängig mit Abgaben und Frondiensten", ["Als freie Industrielle", "Als römische Konsuln", "Als moderne Abgeordnete"], "Bauern arbeiteten das Land und leisteten Abgaben.", "Bauern arbeiteten das Land und leisteten Abgaben. Frondienste banden Arbeitskraft. Alltag war von Pflichten geprägt.", "Viele Bauern leisteten Abgaben und ___.", ["Frondienste"]),
    fact("alltag", "Was prägte den Alltag auf dem Land stark?", "Arbeit, Abhängigkeit und christliche Jahresfeste", ["Nur Börsenhandel", "Nur Olympische Spiele", "Nur Atomkraft"], "Jahreszeiten und Kirche strukturierten Zeit.", "Jahreszeiten und Kirche strukturierten Zeit. Arbeit bestimmte den Tag. Religion durchdrang den Alltag.", "Alltag auf dem Land war von Arbeit und ___ geprägt.", ["Religion","Kirche"]),
    fact("adel", "Welche Rolle hatte der Adel oft?", "Herrschaft, Kriegsdienst und Besitz von Landrechten", ["Nur Fabrikarbeit", "Nur Sklavenstatus ohne Macht", "Nur moderne Presse"], "Adlige übten Herrschaft aus und kämpften.", "Adlige übten Herrschaft aus und kämpften. Besitz und Stand sicherten Einfluss. Leben unterschied sich stark vom Bauernalltag.", "Der Adel übte oft ___ aus.", ["Herrschaft"]),
    fact("klerus", "Welche Aufgabe hatte der Klerus?", "Geistliche Versorgung, Bildung und Verwaltung in Kirche und Kloster", ["Nur Ritterkämpfe", "Nur industrielle Produktion", "Nur römische Aquädukte"], "Mönche und Priester prägten Religion und Schriftkultur.", "Mönche und Priester prägten Religion und Schriftkultur. Klöster waren Wirtschafts- und Bildungsorte. Der Klerus bildete einen eigenen Stand.", "Der Klerus prägte Religion und ___.", ["Bildung","Kirche"]),
    fact("freiheit", "Was meint „Stadtluft macht frei“ grob?", "In Städten konnten Abhängige unter Bedingungen persönliche Freiheit gewinnen", ["Dass Städte keine Regeln hatten", "Dass Bauern keine Abgaben kannten", "Dass Adel verboten war"], "Wer lange in einer Stadt lebte, konnte aus grundherrlicher Abhängigkeit herauswachsen.", "Wer lange in einer Stadt lebte, konnte aus grundherrlicher Abhängigkeit herauswachsen. Das machte Städte attraktiv. Freiheit war aber an Regeln gebunden.", "Stadtluft macht ___.", ["frei"]),
    fact("christlich", "Warum spricht man von christlicher Durchdringung des Alltags?", "Weil Kirchenjahr, Glauben und Rituale das Leben prägten", ["Weil Religion keine Rolle spielte", "Weil nur Islam existierte", "Weil Tempel nur olympisch waren"], "Sonntage, Feste und Moralvorstellungen strukturierten Zeit.", "Sonntage, Feste und Moralvorstellungen strukturierten Zeit. Kirchenbauten prägten Orte. Christentum war Alltagskultur.", "Das ___ durchdrang den mittelalterlichen Alltag.", ["Christentum"]),
    fact("vergleich", "Warum lohnt der Vergleich von Stadt und Land?", "Weil Lebensformen, Rechte und Arbeit stark differierten", ["Weil alles identisch war", "Weil es keine Städte gab", "Weil Bauern nur in Rom lebten"], "Stadt und Land bildeten unterschiedliche Erfahrungsräume.", "Stadt und Land bildeten unterschiedliche Erfahrungsräume. Handel und Handwerk prägten Städte. Abhängigkeit prägte oft das Land.", "Stadt und Land unterscheiden sich in Lebensformen und ___.", ["Rechten"]),
  ],
  pairs: [
    pair("p1", "Ständeordnung", "Gruppen mit unterschiedlichen Rechten", "Prägte mittelalterliche Gesellschaft."),
    pair("p2", "Frondienst", "Arbeitsleistung für den Grundherrn", "Typisch für abhängige Bauern."),
    pair("p3", "Klerus", "Geistlicher Stand", "Kirche, Bildung, Kult."),
  ],
  trueFalse: [
    tf("t1", "Im Mittelalter hatten alle Menschen dieselben Rechte unabhängig vom Stand.", false, "Rechte und Pflichten hingen stark vom Stand ab.", "Rechte und Pflichten hingen stark vom Stand ab. Bauern, Adel und Klerus lebten unterschiedlich. Das ist Kern der Ständeordnung."),
  ],
}

const k6Staedte: BioBank = {
  quelle: "Wikipedia: Mittelalterliche Stadt",
  url: "https://de.wikipedia.org/wiki/Stadt_des_Mittelalters",
  conceptPrefix: "ge:k6:staedte",
  facts: [
    fact("markt", "Warum war der Markt für Städte zentral?", "Weil Handel und Austausch dort organisiert wurden", ["Weil nur Ritter dort kämpften", "Weil Felder nur in der Stadt lagen", "Weil Pharaonen dort residierten"], "Märkte zogen Händler und Handwerker an.", "Märkte zogen Händler und Handwerker an. Abgaben und Regeln ordneten den Handel. Der Markt war wirtschaftliches Herz.", "Der ___ war wirtschaftliches Zentrum der Stadt.", ["Markt"]),
    fact("zunft", "Was war eine Zunft?", "Ein Zusammenschluss von Handwerkern zur Regelung von Ausbildung und Qualität", ["Eine römische Legion", "Eine moderne Aktiengesellschaft allein", "Ein olympisches Team"], "Zünfte kontrollierten Lehre, Meisterrecht und Preise.", "Zünfte kontrollierten Lehre, Meisterrecht und Preise. Sie schützten Mitglieder und setzten Regeln. Handwerk war organisiert.", "Eine ___ organisierte Handwerker.", ["Zunft"]),
    fact("mauer", "Wozu dienten Stadtmauern?", "Schutz und klare Abgrenzung der Stadt", ["Nur Dekoration ohne Funktion", "Nur moderne Autobahnen", "Nur ägyptische Pyramiden"], "Mauern schützten vor Überfällen und markierten Rechtsraum.", "Mauern schützten vor Überfällen und markierten Rechtsraum. Tore kontrollierten Zugang. Sie prägten das Stadtbild.", "Stadtmauern dienten dem ___.", ["Schutz"]),
    fact("bürger", "Wer waren Stadtbürger grob?", "Rechtlich privilegierte Stadtbewohner mit bestimmten Rechten und Pflichten", ["Nur Heloten", "Nur Pharaonen", "Nur römische Sklaven"], "Bürgerrecht in der Stadt brachte Teilhabe und Pflichten.", "Bürgerrecht in der Stadt brachte Teilhabe und Pflichten. Nicht jeder Einwohner war Bürger. Stadtluft und Recht hingen zusammen.", "Stadtbürger hatten besondere ___ und Pflichten.", ["Rechte"]),
    fact("handel", "Warum wuchsen viele Städte durch Handel?", "Weil Warenströme Wohlstand und Spezialisierung brachten", ["Weil Landwirtschaft verboten war", "Weil es keine Handwerker gab", "Weil Kriege Handel unmöglich machten"], "Fernhandel und lokale Märkte stärkten Städte.", "Fernhandel und lokale Märkte stärkten Städte. Reichtum ermöglichte Bauten und Selbstverwaltung. Handel veränderte Gesellschaft.", "Städte wuchsen oft durch ___.", ["Handel"]),
    fact("selbst", "Was meint städtische Selbstverwaltung grob?", "Dass Städte eigene Regeln und Organe ausbildeten", ["Dass Könige jede Stadtregel verboten", "Dass nur Bauern regierten", "Dass Rom alle Städte abschaffte"], "Räte und Amtleute organisierten Ordnung.", "Räte und Amtleute organisierten Ordnung. Privilegien sicherten Rechte gegenüber Herren. Selbstverwaltung war ein städtisches Merkmal.", "Städte bildeten oft eigene ___.", ["Organe","Regeln"]),
    fact("attraktiv", "Warum zogen Städte Menschen an?", "Wegen Handel, Handwerk und größerer persönlicher Freiheit", ["Weil Abgaben immer höher waren als auf dem Land", "Weil nur Adel dort leben durfte", "Weil es keine Märkte gab"], "Chancen auf Arbeit und Freistatus lockten.", "Chancen auf Arbeit und Freistatus lockten. Gleichzeitig gab es städtische Regeln. Attraktivität war relativ zum Land.", "Städte lockten mit Handel, Handwerk und ___.", ["Freiheit"]),
    fact("kirche", "Welche Rolle spielten Kirchen in Städten?", "Religiöse Zentren, oft auch Bildung und Fürsorge", ["Nur industrielle Produktion", "Nur Gladiatorenkämpfe", "Nur Atomkraftwerke"], "Kirchen prägten Skyline und Alltag.", "Kirchen prägten Skyline und Alltag. Geistliche Institutionen besaßen Einfluss. Stadt und Kirche waren eng verbunden.", "Kirchen waren religiöse ___ der Stadt.", ["Zentren"]),
  ],
  pairs: [
    pair("p1", "Zunft", "Handwerkerzusammenschluss", "Regelte Lehre und Qualität."),
    pair("p2", "Stadtmauer", "Schutz und Rechtsgrenze", "Prägte das Stadtbild."),
    pair("p3", "Markt", "Ort des Handels", "Wirtschaftliches Zentrum."),
  ],
  trueFalse: [
    tf("t1", "Mittelalterliche Städte hatten weder Markt noch Handwerk.", false, "Markt und Handwerk waren zentral.", "Markt und Handwerk waren zentral. Zünfte organisierten Produktion. Genau das machte Städte attraktiv."),
  ],
}

const k6Christentum: BioBank = {
  quelle: "Wikipedia: Christentum",
  url: "https://de.wikipedia.org/wiki/Christentum",
  conceptPrefix: "ge:k6:christentum",
  facts: [
    fact("ausbreitung", "Wie breitete sich das Christentum in Europa aus?", "Durch Mission, politische Förderung und kirchliche Organisation", ["Nur durch moderne Internetwerbung", "Nur durch Industrielle Revolution", "Nur durch olympische Spiele"], "Missionare predigten den Glauben.", "Missionare predigten den Glauben. Herrscher förderten oft die Kirche. Bistümer und Klöster organisierten das Christentum räumlich.", "Das Christentum breitete sich durch Mission und ___ aus.", ["Organisation","Förderung"]),
    fact("kirche", "Welche Rolle spielte die Kirche im Mittelalter?", "Sie war religiöse, kulturelle und oft politische Macht", ["Sie war nur ein Sportverein", "Sie ersetzte jede Landwirtschaft", "Sie war nur in Ägypten wichtig"], "Die Kirche prägte Glauben, Bildung und Herrschaft.", "Die Kirche prägte Glauben, Bildung und Herrschaft. Päpste und Bischöfe übten Einfluss aus. Alltag und Politik waren eng mit Kirche verbunden.", "Die Kirche war religiöse und oft ___ Macht.", ["politische","kulturelle"]),
    fact("kloster", "Wofür waren Klöster wichtig?", "Für Gebet, Wirtschaft, Bildung und Schriftkultur", ["Nur für moderne Fabriken", "Nur für römische Legionen", "Nur für Atomkraft"], "Mönche und Nonnen lebten nach Regeln.", "Mönche und Nonnen lebten nach Regeln. Klöster bewahrten Wissen und bewirtschafteten Land. Sie waren Zentren mittelalterlicher Kultur.", "Klöster dienten Gebet, Wirtschaft und ___.", ["Bildung"]),
    fact("papst", "Was war der Papst?", "Das Oberhaupt der lateinischen Kirche in Rom", ["Ein römischer Konsul der Republik", "Ein Pharao Ägyptens", "Ein spartanischer König"], "Der Papst beanspruchte geistliche Führung.", "Der Papst beanspruchte geistliche Führung. Konflikte mit Kaisern kamen vor. Das Papsttum prägte europäische Geschichte.", "Der ___ war Oberhaupt der lateinischen Kirche.", ["Papst"]),
    fact("taufe", "Warum war die Taufe gesellschaftlich wichtig?", "Weil sie Zugehörigkeit zur christlichen Gemeinschaft markierte", ["Weil sie nur Sportregeln festlegte", "Weil sie den Buchdruck erfand", "Weil sie Atomwaffen verbot"], "Taufe bedeutete Aufnahme in die Kirche.", "Taufe bedeutete Aufnahme in die Kirche. In christlichen Gesellschaften war das zentral für Zugehörigkeit. Rituale strukturierten Lebensläufe.", "Die Taufe markierte Zugehörigkeit zur ___ Gemeinschaft.", ["christlichen"]),
    fact("alltag", "Wie durchdrang das Christentum den Alltag?", "Durch Feste, Kirchenjahr, Moral und Gotteshäuser", ["Durch reine Industrieproduktion", "Durch olympische Athleten allein", "Durch moderne Parteien"], "Sonntage und Heiligenfeste gliederten Zeit.", "Sonntage und Heiligenfeste gliederten Zeit. Kirchenbauten prägten Orte. Glauben beeinflusste Normen.", "Christentum prägte Alltag durch Feste und ___.", ["Kirchenjahr","Moral"]),
    fact("mission", "Was meint Mission?", "Die Verbreitung des christlichen Glaubens", ["Nur Handel mit Metallen", "Nur Bau von Pyramiden", "Nur Gründung von Zünften"], "Missionare predigten und tauften.", "Missionare predigten und tauften. Manche Mission war mit Herrschaft verbunden. Ausbreitung war ein langer Prozess.", "Mission meint die Verbreitung des christlichen ___.", ["Glaubens"]),
    fact("toleranz", "Warum ist Religionsfreiheit heute ein Lehrplanbezug?", "Weil historische Konflikte den Wert von Toleranz zeigen", ["Weil Religion nie Konflikte auslöste", "Weil Kirche und Staat immer getrennt waren", "Weil Mission unnötig war"], "Christentum prägte Europa, führte aber auch zu Konflikten.", "Christentum prägte Europa, führte aber auch zu Konflikten. Lehrplan zielt auf Toleranz und Ablehnung von Fanatismus. Geschichte schärft Urteil.", "Historische Konflikte zeigen den Wert von ___.", ["Toleranz","Religionsfreiheit"]),
  ],
  pairs: [
    pair("p1", "Kloster", "Ort von Gebet, Wirtschaft und Bildung", "Zentrum mittelalterlicher Kultur."),
    pair("p2", "Papst", "Oberhaupt der lateinischen Kirche", "Sitz in Rom."),
    pair("p3", "Mission", "Verbreitung des Glaubens", "Oft mit Herrschaft verknüpft."),
  ],
  trueFalse: [
    tf("t1", "Die Kirche spielte im europäischen Mittelalter kaum eine Rolle.", false, "Kirche prägte Glauben, Bildung und Politik.", "Kirche prägte Glauben, Bildung und Politik. Klöster und Bistümer organisierten Raum und Alltag. Genau deshalb ist sie Lehrplanstoff."),
  ],
}

const k6Islam: BioBank = {
  quelle: "Wikipedia: Islam",
  url: "https://de.wikipedia.org/wiki/Islam",
  conceptPrefix: "ge:k6:islam",
  facts: [
    fact("entstehung", "Wann und wo entstand der Islam?", "Im 7. Jahrhundert auf der Arabischen Halbinsel", ["Im 19. Jahrhundert in England", "In der Altsteinzeit in Europa", "Im alten Ägypten unter den Pharaonen"], "Mohammed verkündete den Islam in Mekka und Medina.", "Mohammed verkündete den Islam in Mekka und Medina. Rasch entstand eine neue Glaubensgemeinschaft. Das 7. Jahrhundert markiert den Beginn.", "Der Islam entstand im ___ Jahrhundert auf der Arabischen Halbinsel.", ["7.","siebten"]),
    fact("koran", "Was ist der Koran?", "Die heilige Schrift des Islam", ["Nur ein römisches Gesetzbuch", "Nur ein mittelalterliches Zunftstatut", "Nur eine olympische Regel"], "Muslime sehen den Koran als Offenbarung.", "Muslime sehen den Koran als Offenbarung. Er prägt Glauben und Praxis. Schriftlichkeit war für die Religion zentral.", "Die heilige Schrift des Islam ist der ___.", ["Koran"]),
    fact("ausbreitung", "Wie breitete sich der Islam rasch aus?", "Durch Eroberungen, Handel und Mission in Vorderasien, Nordafrika und darüber hinaus", ["Nur durch Industrielle Revolution", "Nur durch attische Demokratie", "Nur durch Buchdruck Gutenberg"], "In kurzer Zeit entstanden große Herrschaftsräume.", "In kurzer Zeit entstanden große Herrschaftsräume. Handel verband Regionen. Religion und Politik wirkten zusammen.", "Der Islam breitete sich durch Eroberungen, Handel und ___ aus.", ["Mission"]),
    fact("mekka", "Warum ist Mekka wichtig?", "Als heiliger Ort und Zentrum der Wallfahrt", ["Als Hauptstadt des Römischen Reichs", "Als Ort der Französischen Revolution", "Als Sitz des Völkerbunds"], "Mekka ist zentraler Wallfahrtsort.", "Mekka ist zentraler Wallfahrtsort. Die Kaaba ist religiöses Symbol. Orientierung im Glauben bezieht sich darauf.", "Mekka ist Zentrum der ___.", ["Wallfahrt"]),
    fact("fünf", "Was sind die fünf Säulen des Islam grob?", "Zentrale religiöse Pflichten wie Bekenntnis, Gebet, Almosen, Fasten und Wallfahrt", ["Fünf römische Konsuln", "Fünf mittelalterliche Zünfte", "Fünf moderne Parteien"], "Die Säulen strukturieren religiöse Praxis.", "Die Säulen strukturieren religiöse Praxis. Nicht alle Details muss man auswendig können, aber die Idee zentraler Pflichten ist wichtig. Glaube und Alltag sind verbunden.", "Die fünf Säulen sind zentrale religiöse ___.", ["Pflichten"]),
    fact("kultur", "Welche kulturellen Leistungen entstanden in islamischen Reichen?", "Unter anderem Wissenschaft, Architektur und Schriftkultur", ["Nur Ablehnung jeder Schrift", "Nur olympische Spiele ohne Bauten", "Nur Industrielle Revolution"], "Städte wie Bagdad oder Córdoba wurden Zentren.", "Städte wie Bagdad oder Córdoba wurden Zentren. Gelehrte übersetzten und erweiterten Wissen. Architektur prägte Landschaften.", "Islamische Reiche förderten Wissenschaft und ___.", ["Architektur","Schriftkultur"]),
    fact("vielfalt", "Warum ist der Islam keine einheitliche politische Form?", "Weil sich über Jahrhunderte unterschiedliche Reiche und Richtungen entwickelten", ["Weil es nur einen Staat gab", "Weil Mission verboten war", "Weil Koran keine Religion ist"], "Sunniten und Schiiten sind bekannte Richtungen.", "Sunniten und Schiiten sind bekannte Richtungen. Herrschaftsformen wechselten. Vielfalt gehört zur Geschichte.", "Der Islam entwickelte unterschiedliche Reiche und ___.", ["Richtungen"]),
    fact("begegnung", "Warum ist Kenntnis des Islam im Lehrplan wichtig?", "Weil Begegnung von Kulturen und Religionen europäische Geschichte prägte", ["Weil Islam nur außerhalb jeder Geschichte liegt", "Weil Europa nie Kontakt hatte", "Weil nur Antike zählt"], "Handel, Konflikte und Austausch verbanden christliche und islamische Räume.", "Handel, Konflikte und Austausch verbanden christliche und islamische Räume. Urteil braucht Wissen statt Vorurteil. Lehrplan betont Toleranz.", "Begegnung von Religionen prägte ___ Geschichte.", ["europäische"]),
  ],
  pairs: [
    pair("p1", "Koran", "Heilige Schrift des Islam", "Prägt Glauben und Praxis."),
    pair("p2", "Mekka", "Heiliger Ort und Wallfahrtsziel", "Zentral im Islam."),
    pair("p3", "Fünf Säulen", "Zentrale religiöse Pflichten", "Strukturieren die Praxis."),
  ],
  trueFalse: [
    tf("t1", "Der Islam entstand im 7. Jahrhundert auf der Arabischen Halbinsel.", true, "Mohammed verkündete den neuen Glauben in Mekka und Medina.", "Mohammed verkündete den neuen Glauben in Mekka und Medina. Rasch entstand eine Gemeinschaft. Das Jahrhundert markiert den Beginn."),
  ],
}

const k6Begegnung: BioBank = {
  quelle: "Wikipedia: Kreuzzüge",
  url: "https://de.wikipedia.org/wiki/Kreuzzug",
  conceptPrefix: "ge:k6:begegnung",
  facts: [
    fact("kreuzzug", "Was waren die Kreuzzüge?", "Militärische Unternehmungen christlicher Heere in den Vorderen Orient und angrenzende Räume", ["Nur friedliche Handelsmessen", "Nur olympische Spiele", "Nur industrielle Expeditionen"], "Ab dem späten 11.", "Ab dem späten 11. Jahrhundert zogen Kreuzfahrer aus religiösen und politischen Motiven. Gewalt und Herrschaftsansprüche prägten viele Züge. Folgen waren tiefgreifend.", "Kreuzzüge waren ___ Unternehmungen christlicher Heere.", ["militärische"]),
    fact("motive", "Welche Motive spielten bei Kreuzzügen eine Rolle?", "Religion, Herrschaft, Abenteuer und wirtschaftliche Interessen", ["Nur moderne Aktienkurse", "Nur Ablehnung jeder Religion", "Nur Bau von Pyramiden"], "Frömmigkeit und Ablassversprechen wirkten.", "Frömmigkeit und Ablassversprechen wirkten. Fürsten suchten Macht und Land. Motive waren gemischt.", "Motive waren Religion, Herrschaft und ___.", ["Interessen","Abenteuer"]),
    fact("mitgegen", "Was meint Mit- und Gegeneinander von Kulturen?", "Austausch und Konflikt können zugleich auftreten", ["Nur ewigen Frieden ohne Kontakt", "Nur Isolation ohne Handel", "Nur industrielle Konkurrenz"], "Handel, Wissen und Allianzen existierten neben Kriegen.", "Handel, Wissen und Allianzen existierten neben Kriegen. Begegnung ist nicht nur Konflikt. Lehrplan betont beides.", "Kulturen können zugleich austauschen und ___.", ["konfliktieren","kämpfen"]),
    fact("handel", "Wie verband Handel christliche und islamische Räume?", "Über Mittelmeer und Handelswege zirkulierten Waren und Wissen", ["Gar nicht, es gab nie Kontakt", "Nur über Atomkraftwerke", "Nur über Fußball"], "Kaufleute handelten trotz Konflikten.", "Kaufleute handelten trotz Konflikten. Städte profitierten. Austausch prägte Wirtschaft und Kultur.", "Handel verband Räume über ___ und Wege.", ["Mittelmeer"]),
    fact("jerusalem", "Warum war Jerusalem besonders umkämpft?", "Weil es für mehrere Religionen heilig ist", ["Weil es nur eine Industriestadt war", "Weil dort der Buchdruck erfunden wurde", "Weil dort die NATO gegründet wurde"], "Juden, Christen und Muslime beziehen sich auf die Stadt.", "Juden, Christen und Muslime beziehen sich auf die Stadt. Heiligkeit steigerte Konflikte. Symbolik war enorm.", "Jerusalem ist für mehrere Religionen ___.", ["heilig"]),
    fact("folgen", "Welche Folgen hatten Kreuzzüge?", "Gewalt, Herrschaftsbildungen und langanhaltende Feindbilder", ["Sofortige Europäische Union", "Abschaffung aller Religionen", "Nur friedliche Demokratie überall"], "Kreuzfahrerstaaten entstanden zeitweise.", "Kreuzfahrerstaaten entstanden zeitweise. Erinnerungen und Feindbilder wirkten nach. Geschichte verlangt differenzierte Bewertung.", "Kreuzzüge hinterließen Gewalt und ___.", ["Feindbilder","Herrschaft"]),
    fact("urteil", "Warum ist kritisches Urteil hier wichtig?", "Weil religiöse Gewalt und Vorurteile hinterfragt werden müssen", ["Weil Geschichte nur Feiern erlaubt", "Weil Konflikte nie existierten", "Weil Quellen unnötig sind"], "Lehrplan zielt auf Toleranz und Ablehnung von Fanatismus.", "Lehrplan zielt auf Toleranz und Ablehnung von Fanatismus. Begegnung soll verstanden, nicht verklärt werden. Urteil braucht Quellen.", "Kritisches Urteil hinterfragt religiöse ___ und Vorurteile.", ["Gewalt"]),
    fact("heute", "Welchen Gegenwartsbezug hat das Thema?", "Es schärft den Blick für Religionsfreiheit und kulturellen Respekt", ["Es zeigt, dass Toleranz überflüssig ist", "Es beweist Isolation als einziges Modell", "Es betrifft nur die Steinzeit"], "Historische Konflikte erklären nicht automatisch heutige, aber Muster von Vorurteilen wiederholen sich.", "Historische Konflikte erklären nicht automatisch heutige, aber Muster von Vorurteilen wiederholen sich. Bildung stärkt Zusammenleben. Das ist Lehrplanziel.", "Das Thema schärft den Blick für Religionsfreiheit und ___.", ["Respekt","Toleranz"]),
  ],
  pairs: [
    pair("p1", "Kreuzzug", "Militärische Unternehmung mit religiösem Anspruch", "Ab dem 11. Jahrhundert."),
    pair("p2", "Jerusalem", "Heilige Stadt mehrerer Religionen", "Besonders umkämpft."),
    pair("p3", "Feindbild", "Vereinfachte Abwertung einer Gruppe", "Kann lange nachwirken."),
  ],
  trueFalse: [
    tf("t1", "Begegnung von Christentum und Islam bestand nur aus Frieden ohne Konflikte.", false, "Es gab Handel und Austausch, aber auch Kriege wie die Kreuzzüge.", "Es gab Handel und Austausch, aber auch Kriege wie die Kreuzzüge. Mit- und Gegeneinander gehören zusammen. Genau das fordert der Lehrplan."),
  ],
}

export const GESCHICHTE_DENSE_GENERATORS: Record<string, Topic['generate']> = {
  'ge-k5-lb1-quellen': bankGenerate(k5Quellen),
  'ge-k5-lb1-zeitrechnung': bankGenerate(k5Zeitrechnung),
  'ge-k5-lb2-steinzeit': bankGenerate(k5SteinzeitDetail),
  'ge-k5-lb2-aegypten': bankGenerate(k5Aegypten),
  'ge-k5-lb2-metallzeit': bankGenerate(k5Metallzeit),
  'ge-k5-lb3-athen': bankGenerate(k5Athen),
  'ge-k5-lb3-sparta': bankGenerate(k5Sparta),
  'ge-k5-lb3-kultur': bankGenerate(k5GriechenKultur),
  'ge-k6-lb2-lehnswesen': bankGenerate(k6Lehnswesen),
  'ge-k6-lb2-alltag-staende': bankGenerate(k6AlltagStaende),
  'ge-k6-lb2-staedte': bankGenerate(k6Staedte),
  'ge-k6-lb3-christentum': bankGenerate(k6Christentum),
  'ge-k6-lb3-islam': bankGenerate(k6Islam),
  'ge-k6-lb3-begegnung': bankGenerate(k6Begegnung),
}
