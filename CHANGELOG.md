# Changelog

Alle nennenswerten Änderungen an **TaskTrophy** werden in dieser Datei
dokumentiert.

Das Format orientiert sich an
[Keep a Changelog](https://keepachangelog.com/de/1.1.0/), und das Projekt folgt
der [Semantischen Versionierung](https://semver.org/lang/de/).

## [Unreleased]

## [0.28.51] – 2026-09-25

### Behoben
- **Installer-CI:** unbenutzte Index-Variable in `ImageLabelSlots` (tsc).

## [0.28.50] – 2026-09-25

### Behoben
- **Installer-CI:** Fachwissen Fisch-Auge ohne Meta-Phrase „Orientierung im“ (false positive
  in `biologieQuality`).

## [0.28.49] – 2026-09-25

### Hinzugefügt
- **Biologie K5 Fische:** dichte Pools zu Raubfisch/Friedfisch (Zuordnung, Unterschiede,
  Mehrfachauswahl) unter Lebensraum; detaillierte Fortpflanzung (Laichen, äußere Befruchtung,
  Rogen/Milch, Laichplatz, Brutfürsorge) unter Fortpflanzung und Schutz.
- **Verwandt:** zusätzliche Fortpflanzungsaufgaben bei Lurch-Metamorphose und Vogel-Fortpflanzung.

## [0.28.48] – 2026-09-25

### Hinzugefügt
- **Biologie:** Themen „Aufbau des Fisches“ (K5 LB2) und „Aufbau des Vogels“ (K5 LB5),
  `released:false`.
- **Interaktion `imageLabelSlots`:** Abbildung mit festen Drop-Feldern, Zieh-Blöcken und
  optionalen Hinweislinien; Quellenangabe unter dem Bild. Wiederverwendbar fachübergreifend.
- **Medien:** Regenbogenforelle (Duane Raver / USFWS, Public Domain) und Vogelorgan-Diagramm
  (Ndennis99, CC0) unter `public/anatomy/` mit Attribution.
- **Bio-Pack 1.4.0** exportiert.

## [0.28.45] – 2026-09-25

### Geändert
- **Biologie Gymnasium Sachsen 1.3.0:** K6 LB2 „Wirbellose Tiere in ihren Lebensräumen“
  freigegeben (IDs 1434, 2689, 2495, 4496, 3666, 7502, 1467): Überblick, Insekten,
  Spinnentiere, Krebstiere, Ringelwürmer, Rundwürmer, Hohltiere. Übrige Bio-Themen
  weiter `released:false`.

## [0.28.44] – 2026-09-24

### Behoben
- **Lückentexte Bio/Geschichte:** Spoiler-Guard — die gesuchte Antwort darf nicht schon in
  Lücke oder Fragestellung stehen (gesamter Bio- und Geschichte-Lehrplan).

## [0.28.43] – 2026-09-24

### Geändert
- **Geschichte Gymnasium Sachsen 1.7.0:** K7–Oberstufe verdichtet — Unterthemen unter
  korrekten Lehrplan-LBs (Schwerpunkt K8–K10/Gk/Lk); 133 Themen; neue Banken
  (Inspiration Schlaukopf/Klett/Wikipedia DE, eigene Formulierungen); Wahl
  „Alltag im Ersten Weltkrieg“ ergänzt. Alle neuen Inhalte `released:false`.

## [0.28.42] – 2026-09-24

### Geändert
- **Biologie Gymnasium Sachsen 1.2.8:** K8–K10 und Oberstufe verdichtet — Wahlbereiche
  und dünne Gk/Lk-Banken mit Deepen-Pools; neue LB-Unterthemen (Nervenzelle/Reflex, Haut,
  Spaltöffnungen/Blattgewebe, Stickstoffkreislauf) unter korrekten Lehrplan-LBs.
  Inspiration Schlaukopf/Klett/Wikipedia, eigene Formulierungen.
- **Geschichte Gymnasium Sachsen 1.6.1:** dichtere Themenstruktur unter Lehrplan-LBs
  (Export gemeinsam mit Biologie 1.2.8).

## [0.28.41] – 2026-09-24

### Behoben
- **Biologie Gymnasium Sachsen 1.2.7:** Themenstruktur exakt nach Lehrplan 522 —
  Gk JGS 11 und 12 getrennt; fehlende Wahlbereiche ergänzt (K6 Spinnen, K10 Transgene
  Organismen, Gk Gärung/Allergien, Lk11 Leben in der Wüste); K6 LB2 an Pflichtliste
  (Rundwürmer/Hohltiere statt Stachelhäuter/Tausendfüßer); offizielle LB-Titel und
  Zeitrichtwerte.

## [0.28.40] – 2026-09-24

### Behoben
- `emptyInput` akzeptiert die neuen Interaktionstypen `sourceQuote` / `causeEffect`
  (mappt auf choicePick bzw. pairMatch), damit Pages-Build und Desktop-Installer
  nach 0.28.39 wieder durchlaufen.

## [0.28.39] – 2026-09-24

### Hinzugefügt
- **Geschichte Pack 1.6.0:** dichtere Unterthemen unter Lehrplan-LBs (K5 Orientierung/
  Steinzeit–Hochkultur/Griechenland, K6 Mittelalter/Religionen, K7 Beschränkung der
  Alleinherrschaft). Schlaukopf- und Klett-Themen nur als Inspiration, Einsortierung
  strikt nach Sachsen lplanid=65 (z. B. Römer weiter K6 LB1). ~85 Themen; neue Inhalte
  `released:false`, K6 LB1 Rom freigegeben.
- **Interaktionen `sourceQuote` und `causeEffect`:** wiederverwendbar über `taskHelpers` /
  `BioBank.sources` / `BioBank.causeEffects` (Quellenauszug+MC, Ursache↔Wirkung). In
  Geschichte-Banken verdrahtet; für andere Fächer nutzbar.

## [0.28.38] – 2026-09-24

### Behoben
- Physik-Stromkreis-Test: MC-Variante ohne irreführendes „Summer“-Wording, damit der
  Desktop-Installer-Build (v0.28.37) durchläuft.

## [0.28.37] – 2026-09-24

### Behoben
- **Release-/Update-Pipeline:** TypeScript-Fehler und fehlgeschlagene CI-Tests (Physik-K6-Runden,
  Biologie-Themenisolation) blockierten Web-Deploy und Desktop-Installer seit 0.28.32–0.28.36.
  Leere GitHub-Releases ohne Installer (0.28.34/35) entfernt — sie waren fälschlich „Latest“ und
  verhinderten Auto-Updates.
- Physik K6: mehr Varianten/Dedupe für Licht, Schatten, Stromkreis, Schaltsymbole; generische
  Schaltsymbol-Fragen zählen nicht mehr als inhaltliche Stem-Duplikate.

## [0.28.36] – 2026-09-24

### Hinzugefügt
- **Geschichte Gym Sachsen (K5–12 Gk/Lk):** Aufgabengeneratoren für alle Lehrplan-Themen
  (Schlaukopf-Themen als Inspiration, eigene Formulierungen). Fragebezogenes Fachwissen
  pro Aufgabe; neue Inhalte bleiben **`released: false`** (Entwickler).
  K6 LB1 Rom unverändert freigegeben. Geschichte-Pack **1.5.0**.
- Qualitätstests: alle Topic-IDs spielbar, Fachwissen-Länge, Unique-Runden.

## [0.28.35] – 2026-09-24

### Hinzugefügt
- **Biologie K6 Wirbellose Spezialthemen:** Krebstiere, Tausendfüßer, Ringelwürmer, Stachelhäuter,
  Nesseltiere sowie Weichtiere-Überblick mit Schnecken, Muscheln und Kopffüßern
  (`released:false`, Entwickler). Überblick bleibt hochstufig; reiche Banken mit
  fragebezogenem Fachwissen und disjunkten `contentIds`.
- Isolationstests für die neuen Themen-IDs (spielbar, themenrein, Geschwister ohne Stem-/ID-Bleed).

### Geändert
- Spinnentiere-Titel präzisiert; Wirbellose-Überblick um Gruppen-Hinweise ergänzt.
  Biologie-Pack **1.2.6**.

## [0.28.34] – 2026-09-24

### Behoben
- **Biologie Fachbegriff-Fragen:** Interne Bank-Tags wie `(baeume)` / `(wirbellose)` erscheinen
  nicht mehr in Fragen, True/False-Aussagen oder Flashcard-Vorderseiten.
- **Biologie pairMatch:** Bei doppelten linken Begriffen (z. B. zwei „Weichtier“) zählt jede
  inhaltlich passende Zuordnung — nicht nur die starre Index-Paarung L₀→R₀.
- **Biologie Bedeutung→Begriff:** Lückenaufgaben spoilen den gesuchten Fachbegriff nicht mehr
  in der Frage darüber (`Was bedeutet „X“?` + Lücke erwartet X).

### Geändert
- Begriffs-Pools bevorzugen eindeutige linke Labels; Deepen-Generator ohne Theme-Slugs.
  Biologie-Pack **1.2.5**.

## [0.28.33] – 2026-09-24

### Behoben
- **Biologie Fachwissen (K5–10 + Oberstufe):** Jede Aufgabe trägt fragebezogenes Fachwissen
  (≥2 Sätze, keine LB-/Wahl-/Untertitel-Platzhalter). Genetik/PCR: Lücke und Wissen beschreiben
  DNA-Amplifikation (Denaturierung, Primer, Polymerase) — nicht mehr mRNA/Proteinbiosynthese
  oder den Lernbereichstitel „Anwendungen und Perspektiven der Genetik“.

### Geändert
- **Vielfalt erhalten:** größere pairMatch-/Faktenpools (`biologieBankDeepen`) bleiben aktiv,
  damit Runden bei Unique-Dedupe weiterhin ≈10 Aufgaben erreichen.
- **Qualitätstests:** Fachwissen-Bar für alle Generatoren inkl. Oberstufe; PCR-Konsistenz über
  Gk/Lk-Genetik-Themen. Biologie-Pack **1.2.4**.

## [0.28.32] – 2026-09-24

### Behoben
- **Biologie Bug A (innerhalb eines Themas):** Runden deduplizieren über `contentIds`,
  normalisierte Frage-Stems, charakteristische Antworten und Begriffs-Labels
  (pairMatch/Zuordnung). Kein Auffüllen mit Duplikaten — kürzere Runden, wenn der
  Unique-Pool erschöpft ist. Alle `BIOLOGIE_GENERATORS` tragen stabile Concept-IDs.
- **Biologie Bug B (zwischen Geschwister-Themen):** K5-Wirbeltiere Überblick / Merkmale /
  Lebensraum / Schutz (und gleiche Muster K6–10 + Organellen) haben disjunkte Banken —
  keine gemeinsamen Fragetexte oder `contentIds` mehr (Beweis: Fische Überblick ≠ Merkmale).
  NewUx: Icons nur Überblick, Flashcards nur Merkmale/Flug — kein Bleed mehr.
  Biologie-Pack **1.2.3**.

## [0.28.31] – 2026-09-24

### Behoben
- **Biologie Themen-Isolation:** Überblick und Spezial getrennt verdrahtet (keine Alias-Banken
  mehr). U. a. „Bäume / Holzpflanzen“ ohne Blütenbau-Fragen; Blüte/Bestäubung nur unter
  Blütenpflanzen. Dedizierte Spezialbanken (`biologieSpecialTopics`) überschreiben Alt-Aliase.
  Biologie-Pack **1.2.2**.

### Geändert
- **Lehrplan-Karten:** Beschreibung nur noch Themenanzahl, Klassenstufen, Version und
  Aktualisierungsdatum — kein Roh-`changelog` mehr (Interaktionsnamen, interne Notizen).
  Datum aus Install-Meta (`installedAt`, bei Versions-/Hash-Update erneuert); nicht installiert
  optional Katalog-`updatedAt`.

### Hinweis
- **0.28.30** war lokal vorbereitet, aber noch nicht released. Inhalt von 0.28.30 bleibt
  in diesem Stand enthalten und geht mit 0.28.31 heraus.

## [0.28.30] – 2026-09-24

### Hinzugefügt
- **Info (Entwickler):** Einstellungen → Info — anonyme Zähler für geprüfte Schüler-Antworten
  (Summe aller Schüler-Profile lokal; optional globaler Cloudflare-Zähler ohne Namen/Geräte-ID).
  Zählt bei „Prüfen“ in Übung (nicht Berichtigung/Replay) und pro Klausuraufgabe bei Abgabe.

### Geändert
- **Fachwissen = reines Fachwissen:** Nur Fakten, die zur Lösung der aktuellen Aufgabe beitragen —
  kein Bla zu Bedienung, Wertung oder Ablauf. FlashcardFlip zeigt keine Default-„Prüfung:“-Hinweise
  mehr; `bioFw` streift Meta-Formulierungen; Banken K5–K10 mit konkretem Fachwissen angereichert
  (u. a. Spinnentiere nach Arachnologie-Quellen). Biologie-Pack **1.2.1**.

## [0.28.29] – 2026-09-24

### Behoben
- **Desktop-Installer-CI:** Bio/Geschichte-Curricula-Export nachgezogen (`tasksPerRound` 10,
  contentHash `1158346f` / `d206d0ed`). Pack-Tests schlugen fehl, weil 0.28.28 die Generatoren
  änderte, aber `curricula/*.json` + Manifest nicht neu exportiert wurden.

## [0.28.28] – 2026-09-24

### Hinzugefügt
- **Teilpunkte für clozeMulti / pairMatch:** Jede Lücke bzw. jedes Paar wird einzeln bewertet;
  `PracticeSession` vergibt `round(pointsPerTask × fraction)` und markiert richtige/falsche Teile
  in der UI (Phase „Teilweise richtig“).
- **Konzept-Dedupe in Übungsrunden:** `Task.contentIds` + stärkere `uniqueRound`-Logik — dieselbe
  Lernidee (z. B. `bio:spinnen:beinzahl`) erscheint höchstens einmal pro Durchlauf, auch über
  verschiedene Interaktionen (MC, Cloze, Flashcard, pairMatch).
- **Fragebezogenes Fachwissen (Biologie):** Generatoren setzen `task.fachwissen` mit Bezug zur
  konkreten Frage (nicht nur Themen-Fallback).

### Geändert
- **Rundenlänge Standard 10:** Biologie- und Geschichte-Topic-Helper default `tasksPerRound: 10`
  (Jahreszahlen-Pool max. 10); Physik unverändert 10.
- **pairMatch-Vielfalt:** größere Begriffspools; `dedupeKey`/`contentIds` pro Begriffs-Set.
- **iconBelong Gym-Niveau:** Merkmals-/Angepasstheitsfragen statt „Welches Tier ist X (n Beine)?“;
  Emoji-UX bleibt, ohne Spoilers und Namens-Giveaways.
- **FlashcardFlip:** Schritte nur einmal (CSS-Liste); redundante „1) 2) 3)“-Absätze und
  Doppelnummerierung entfernt.

### Behoben
- **Themenfit:** Wirbellose-Überblick liefert keine Wirbeltier-Körperbedeckungs-Clozes mehr
  (bleiben bei K5 Systematik/Zuordnung).

## [0.28.27] – 2026-09-24

### Behoben
- **Kontrast (neue Bio-Widgets):** `iconBelong`, `flashcardFlip`, `pairMatch` und `clozeMulti`
  nutzen auf hellen Karten/Feldern dunklen Text (`#0f172a`) statt geerbter Theme-Schrift —
  Labels und Eingaben wieder lesbar im Dark-UI.
- **Themen-Isolation Biologie:** Überblick-Themen (z. B. Wirbellose / Fische) ziehen keine
  fremden Gruppen-Fragen mehr (kein „Welches Tier gehört zu den Vögeln?“ unter Wirbellose).
  K5 Wirbeltiere und K6 Wirbellose: Überblick vs. Spezialbanken getrennt; Systematik/Zuordnung
  behält bewusst den Gruppenvergleich. Shared `newUxBundle` (Wirbeltiere) nicht mehr global
  in K6–K10 gemischt.

### Geändert
- **Flashcard-UX:** klare Schritte (lesen → umdrehen → wählen/tippen); Antwort-Optionen
  (choicePick-Stil) nach dem Umdrehen bevorzugt; sonst Freitext mit akzeptierten Synonymen
  (trim/casefold). Prüfung und Hinweis in Fachwissen/UI dokumentiert; Erklärung nach Prüfen
  wie bei anderen Aufgaben.

## [0.28.26] – 2026-09-24

### Hinzugefügt
- **Neue Interaktionen (Biologie-Übung):** `pairMatch` (Zwei-Spalten-Klick-Paare ohne Slot-Spoiler),
  `clozeMulti` (Lückentext mit mehreren Lücken), `iconBelong` (große Emoji-/Symbol-Karten
  „welches gehört dazu?“), `flashcardFlip` (Karte umdrehen → Antwort tippen). Verdrahtet in
  `types` / `TaskMedia` / Übungsblatt / Klausur-Protokoll / Authoring-Auswahl.
- **Biologie Gymnasium Sachsen 1.2.0:** dichtere PackTopics unter den Lehrplan-522-Lernbereichen
  (K5–10, Ideen an Schlaukopf Bio-Gym angelehnt, original formuliert); Generatoren nutzen die
  neuen Interaktionen stark. Themen weiter `released:false` (Entwickler).

## [0.28.25] – 2026-09-24

### Behoben
- **Desktop-Installer-CI (`tsc`):** `gapFillTask` übergab `instruction` an
  `textTask`, obwohl `TextTaskInput` (anders als choicePick/multiSelect) kein
  Interactive-`instruction` hat — Build brach mit TS2353 ab. Argument entfernt;
  `dedupeKey` in `textTask` analog zu anderen Helpers verdrahtet.

## [0.28.24] – 2026-09-24

### Hinzugefügt
- **Biologie Gymnasium Sachsen 1.1.0:** Generatoren für **alle** Outline-Themen
  Klassen 5–12 (Gk/Lk), `released:false`. Interaktionen: MC, Richtig/Falsch,
  Mehrfachauswahl, Zuordnung/Klassifikation (Slots), chronologisches Sortieren,
  Lückentext (Gap-fill). Quiz-Ideen an Schlaukopf-Biologie angelehnt (original
  formuliert), Einsortierung strikt nach Lehrplan 522. K5 Wahlbereiche Saurier
  und artgerechte Haltung ergänzt.

### Behoben
- **Lehrplan-Install Physik/Biologie/Geschichte:** Nach Install wurde oft
  **Klasse 12 / Oberstufe** aktiv, weil `activateInstalledPack` alle Module
  lud und jedes `onLoad` `setActiveId` setzte (letzter = JGS 12); außerdem
  verlor ein stale-closure-`loaded` bei Mehrfachladen alle außer dem letzten
  Modul. Fix: nur Sek I einblenden (keine Oberstufe), `activate: false` beim
  Bulk-Load, funktionales `setLoaded`.

## [0.28.23] – 2026-09-24

### Behoben
- **Desktop-Installer-CI:** Tests erwarteten noch 8 Curriculum-Packs; nach
  `gym-sachsen-biologie` schlagen `CurriculumSetup` und `oberschulePacks` fehl
  (`expected 9 to be 8`). Erwartung auf 9 Packs inkl. Biologie angepasst.

## [0.28.22] – 2026-09-24

### Hinzugefügt
- **Biologie Gymnasium Sachsen (Lehrplan 522):** neues Pack `gym-sachsen-biologie`
  **1.0.0** mit Outline Klassen 5–12 (Gk/Lk). **Klasse 5 · Wirbeltiere** mit
  spielbaren Generatoren (MC, Richtig/Falsch, Mehrfachauswahl, Zuordnung,
  Sortieren, Klassifikations-Slots): Merkmale des Lebens, Fische, Lurche,
  Kriechtiere, Vögel, Säugetiere, Systematisierung, Wirbeltiere im Winter.
  Themen `released:false` (Entwickler-Test). Fachfilter **Biologie**.

## [0.28.21] – 2026-09-24

### Behoben
- **Curricula-Export / contentHash:** `gym-sachsen-geschichte.json` und Manifest
  nachgezogen (`tasksPerRound` Jahreszahlen 11, contentHash `a9138c22`). Der
  Tag **v0.28.20** brach die Desktop-Installer-Builds auf allen Plattformen ab
  (`geschichteGymPack` contentHash-Mismatch); Installer bitte mit **0.28.21**
  neu bauen.

## [0.28.20] – 2026-09-24

### Behoben
- **Geschichte K6 Jahreszahlen doppelt/dreifach:** Übungsrunden fragten dieselbe
  Jahreszahl mehrfach (Tipp / MC / Ereigniswahl hatten unterschiedliche
  Fingerprints). Tasks tragen jetzt `dedupeKey` pro Jahr; Runden deduplizieren
  danach. `tasksPerRound` = Poolgröße (11). Regression inkl. Seed 1978221244
  (Meldung ID 9045).

## [0.28.19] – 2026-09-23

### Behoben
- **Übungsblatt leerer Bildschirm:** Drag-and-Drop-Aufgaben (u. a. Geschichte K6
  Zuordnung/Chronologie) übergaben `{label, value}`-Objekte als Optionen — React
  stürzte ab. Print-Builder wandelt Items jetzt in Text um; Worksheet fängt
  Visual-/Generatorfehler ab. Karten-Abbildungen (PNG) skalieren drucktauglich
  mit lesbarer Quellenzeile.

## [0.28.18] – 2026-09-23

### Geändert
- **Mathe K11/12 Grafik freigegeben:** ID **2453** Steigung der Tangente ablesen,
  ID **8970** Fläche unter dem Graphen, ID **5544** Nullstelle linearer Graph
  tippen (`…__grafik`). Mathe-Pack **1.2.8**. „Grafik-Prüfung“-Badge entfällt
  für freigegebene Themen (wie in 0.28.15).

## [0.28.17] – 2026-09-23

### Geändert
- **Mathe K9/K10 Grafik freigegeben:** ID **3505** Scheitelpunkt am Graphen tippen,
  ID **3071** Nullstelle einer Parabel tippen, ID **1077** Scheitel einer Parabel
  tippen, ID **7302** Funktionswert am Parabelgraphen (`…__grafik`). Mathe-Pack
  **1.2.7**. „Grafik-Prüfung“-Badge entfällt für freigegebene Themen (wie in 0.28.15).

## [0.28.16] – 2026-09-23

### Hinzugefügt
- **Übungsblätter mit Grafiken:** `visualContent` (SVG/Bilder) erscheint auf dem
  Druckblatt; Interaktives (Koordinatensystem tippen/zeichnen, Parameter-Slider,
  Multiple Choice, Drag-and-Drop, Zifferngitter, …) wird als statisches Diagramm
  bzw. Papier-Prompt dargestellt — relevant u. a. für freigegebene K8-Grafik-Themen
  (Gerade einstellen / Nullstelle tippen / Gerade zeichnen).

## [0.28.15] – 2026-09-23

### Geändert
- **Grafik-Prüfung-Badge:** Freigegebene `__grafik`-Themen (IDs **4569**,
  **5997**, **6374**) zeigen im Curriculum-Browser kein „Grafik-Prüfung“-Label
  mehr — nur noch unfreigegebene Review-Unterthemen.

## [0.28.14] – 2026-09-23

### Geändert
- **Mathe K8 LB3 Grafik freigegeben:** ID **4569** Gerade einstellen (m und n),
  ID **5997** Nullstelle einer Geraden tippen, ID **6374** Gerade durch zwei
  Punkte zeichnen (`…__grafik`). Mathe-Pack **1.2.6**.

## [0.28.13] – 2026-09-23

### Hinzugefügt
- **Einstellungen → Über die App:** Nutzerhandbuch mit Inhaltsverzeichnis
  (Sprungmarken), Anleitung zu Themen, Lehrplänen, Challenge, Klausuren,
  Klasse/Codes, WLAN, Updates sowie **Web-App zum Startbildschirm** (Android
  und iOS). Ohne Entwickler-Funktionen.

## [0.28.12] – 2026-09-23

### Geändert
- **Geschichte K6 Mare Nostrum (ID 6763) freigegeben** (`ge-k6-lb1-weltreich` /
  Vom Stadtstaat zum Weltreich): `released: true`. Geschichte-Pack **1.4.5**.

## [0.28.11] – 2026-09-23

### Geändert
- **Geschichte K6 Mare Nostrum (ID 6763):** Kartenaufgaben fragen „Was zeigt die [Farbe]…?“ mit
  Antworten **Jahr + Entwicklungsphase** (z. B. „133 v. Chr. — Vormacht nach den Kriegen im Westen“);
  Distraktoren aus derselben Legende. Keine Spoiler über der Karte; vollständige Quellenangaben
  (Renato CC0 1.0, Javierfv1212 Public Domain, Varana CC BY-SA 3.0 inkl. ShareAlike) nur darunter.
  Thema bleibt **gesperrt**. Geschichte-Pack **1.4.4**.

## [0.28.10] – 2026-09-23

### Geändert
- **Geschichte K6 Mare Nostrum (ID 6763):** Kartenaufgaben nur noch einfache Legenden-Fragen
  („Was bedeutet die hellrote Farbe?“ → Jahr). Keine Spoiler-Hinweise über der Karte, keine
  Kartenvergleiche / „Welche Karte…“. Thema bleibt **gesperrt**. Geschichte-Pack **1.4.3**.

## [0.28.9] – 2026-09-23

### Geändert
- **Geschichte K6 Mare Nostrum (ID 6763):** Frühe Phasen nutzen Stadtstaat-/Italien-Karten
  (Renato, CC0: Latium um 500 v. Chr.; Javierfv1212, PD: Eroberung Italiens bis 218);
  Varana (CC BY-SA 3.0) nur noch ab 218 v. Chr. / Mare Nostrum — ohne Stadtstaat-Anspruch.
  Thema bleibt **gesperrt**. Geschichte-Pack **1.4.2**.

## [0.28.8] – 2026-09-23

### Geändert
- **Geschichte K6 Mare Nostrum (ID 6763):** Schematische SVG-Karte durch echte Wikimedia-Commons-Karten
  ersetzt (Varana, CC BY-SA 3.0; Javierfv1212 Italien-Karte, Public Domain), lokal unter `public/maps/`
  mit Attribution; Aufgaben lesen die Phasenfarben der historischen Karte. Thema wieder **gesperrt**
  (`released: false`) bis Freigabe. Geschichte-Pack **1.4.1**.

## [0.28.7] – 2026-09-23

### Geändert
- **Geschichte K6 LB1 freigegeben** (IDs 9045, 5521, 3377, 6594, 7496, 9229, 6763, 2358,
  1994): mehr Varianten je Thema; Chronologie ohne Ordnungszahl-Spoiler
  (Sizilien / Hannibal·Alpen·Zama / Zerstörung Karthagos); Mare-Nostrum-Phasenkarte
  (Attribution: Varana, Wikimedia Commons, CC BY-SA). Pack **1.4.0**.

## [0.28.6] – 2026-09-23

### Geändert
- **Fachwissen:** Aufgaben können eigenes `Task.fachwissen` tragen; die Übung zeigt
  fragenbezogen statt nur Themen-Text. Geschichte K6 LB1 (Jahreszahlen/`YEAR_FACTS` u. a.)
  liefert Wissen zur aktuellen Frage; Themen-Defaults sind LB1-spezifisch.
- **Lehrpläne:** Button „In Themen einblenden“ entfernt. Installation/Aktualisierung setzt
  weiter das Fach im Lehrerprofil (`preferredSubjects`) und lädt alle Klassenstufen.
- **Lehrplan-Kurztexte** (Geschichte und andere verbose Packs) im Mathematik-Stil;
  installierte Packs zeigen die Themenanzahl.

## [0.28.5] – 2026-09-23

### Geändert
- **Geschichte K6 LB1:** Themen entflochten (wenig Überschneidung); **Jahreszahlen** nur im
  eigenen Thema; Zuordnung **Begriff links → Erklärung rechts**; Merkhilfe-Spoiler aus
  Fragen entfernt. Pack **1.3.0**.

## [0.28.4] – 2026-09-23

### Geändert
- **Footer:** „Übungsprogramm nach Lehrplan“ — Hinweis „erweiterbar …“ entfernt;
  Version und Installationszahl bleiben.

## [0.28.3] – 2026-09-23

### Geändert
- **Geschichte K6 LB1 (LK):** Keine Platzhalter mehr — Jahreszahl-Drill (753, 500, 264–146
  u. a. mit vielen Wiederholungen), Chronologie, Begriffe, Ämter, Punische Kriege,
  Bürgerrecht. Pack **1.2.0**. Nach Update Lehrplan aktualisieren / in Themen einblenden.

## [0.28.2] – 2026-09-23

### Hinzugefügt
- **Geschichte K6 · Römische Zivilisation:** Übungs-Generatoren aus Heftnotizen +
  Schulwissen (Anfänge, Begriffe, Ämter, Punische Kriege, Mare Nostrum, Bürgerrecht).
  Geschichte-Pack **1.1.0** (Themen weiterhin nur Entwickleransicht).

## [0.28.1] – 2026-09-23

### Behoben
- **Lehrpläne → Themen:** Nach Installation (oder „In Themen einblenden“) werden alle
  Klassenstufen geladen und das Fach (z. B. Geschichte) in die bevorzugten Fächer
  übernommen — sonst blieb der Lehrplan in Themen unsichtbar.

## [0.28.0] – 2026-09-23

### Hinzugefügt
- **Lehrplan Gymnasium Sachsen · Geschichte** (lplanid=65): Klassen 5–10 und
  JGS 11/12 (Gk/Lk) als Outline. Alle Themen **gesperrt** — nur in der
  Entwickleransicht übbar. Physik-Pack unverändert; Fach-Filter um Geschichte ergänzt.

## [0.27.105] – 2026-09-22

### Behoben
- **Vom Fliegen:** Flugzeug-Skizze nach Vorlage neu gezeichnet (Seitenansicht mit Rumpf,
  Leitwerk, Tragfläche, Triebwerk, Fenster). Physik-Pack **2.5.32**.

## [0.27.104] – 2026-09-22

### Behoben
- **Vom Fliegen:** Skizze zeigt eine Flugzeug-Seitenansicht (Nase rechts = vorne), nicht
  nur ein Oval — Flugrichtung und damit Schub/Widerstand sind erkennbar. Physik-Pack
  **2.5.31**.

## [0.27.103] – 2026-09-22

### Geändert
- **K7 Wahlbereich freigegeben:** Flaschenzug-Text „Körper mit einer Gewichtskraft …“;
  Flug-Skizze nur noch Flugzeug + bunte Kraftpfeile (ohne Artefakte/Legende).
  Physik-Pack **2.5.30**.

## [0.27.102] – 2026-09-22

### Behoben
- **Build:** TypeScript-Fehler in `dragDropSlots.test.ts` (Slots-Indizes), der Web- und
  Desktop-Release von 0.27.101 blockiert hat. Physik-Pack **2.5.29**.

## [0.27.101] – 2026-09-22

### Behoben
- **K7 Wahlbereich (QA):** Körper liegt auf der schiefen Ebene; Flaschenzug-Aufgabenstellung
  beschreibt Anheben + Zugkraft; Flug-Kräfte mit Pfeilspitzen und klareren Stems;
  Kräfte-Zuordnung über eindeutige Slot-Plätze statt Sortieren. Physik-Pack **2.5.28**
  (Wahlbereich weiterhin **nicht** freigegeben).
- **Drag&Drop-Formel-Tests:** Checks nutzen die gemischten Pool-Indizes.

## [0.27.100] – 2026-09-22

### Geändert
- **K7 Wahlbereich:** Freigabe zurückgenommen — Inhalte bleiben, Freigabe erst nach
  Prüfung. Physik-Pack **2.5.27**.

## [0.27.99] – 2026-09-22

### Geändert
- **K7 Wahlbereich** mit eigenen Generatoren und Lehr-Skizzen (noch **nicht**
  freigegeben): Kraftwandler, Hebel, Flaschenzug, Schaltungen, Klingel/Wechsel,
  Fliegen, dynamischer Auftrieb. Physik-Pack **2.5.26**.

## [0.27.98] – 2026-09-22

### Behoben
- **Sortier- und Formelaufgaben (alle Lehrpläne):** Drag&Drop-Blöcke (Sortieren
  und Formel-Chips) werden beim Erzeugen gemischt — die Startreihenfolge ist
  nicht mehr die Lösung (bzw. die Formel als Pool-Präfix).

## [0.27.97] – 2026-09-22

### Geändert
- **Energie sparen (6864):** viele neue Aufgaben — Alltag (Standby, Dämmung, Kochen),
  Reibung verringern, LED-vs-Glühlampe-Rechnung, η→Zufuhr, MultiSelect und Slots.
  Physik-Pack **2.5.25**.

## [0.27.96] – 2026-09-22

### Geändert
- **K7 LB3 Energiewandler freigegeben** mit getrennten Generatoren:
  - **Energieformen (8663):** viele Zuordnungen/MultiSelect, **kein** Leistungsstoff;
    Energieformen-Aufgaben nicht mehr unter Energiewandler (2714).
  - **Energiewandler (2714):** Geräte und Wandlungen.
  - **Umwandlungsketten (8655):** Wasserkraftwerk, Dynamo, Taschenlampe, Wärmeentwertung.
  - **Wirkungsgrad (6657):** η-Rechnung, Formel, LED/Glühlampe, Energieflussdiagramm.
  - **Leistung / Energiesparen:** eigene Varianten. Physik-Pack **2.5.24**.

## [0.27.95] – 2026-09-22

### Geändert
- **Parallelschaltung (8981):** Widerstands-Rechtecke stehen längs zur Leitung
  (hochkant auf vertikalen Zweigen), nicht quer. Physik-Pack **2.5.23**.

## [0.27.94] – 2026-09-22

### Geändert
- **K7 LB2 freigegeben:** Spannung (9744), Stromstärke und Spannung (7273),
  Ohmsches Gesetz (5904); zusätzlich Stromstärke, Reihe, Parallel, Messen.
- **Messgerät-Schaltbilder (8414/1589):** A- und V-Kreise sitzen auf durchgehender
  Leitung — keine Luftlücken mehr an Amperemeter/Voltmeter.
- **Reihe/Parallel (1841/8981):** Widerstands-Rechtecke im Schaltbild (passend zum
  Aufgabentext), nicht mehr Glühlampen. Physik-Pack **2.5.22**.

## [0.27.93] – 2026-09-22

### Geändert
- **K7 LB2 Stromkreis (Feedback):** Bilder nur wo sinnvoll (keine Deko-Schaltbilder
  bei reinen Text-/Rechenaufgaben); Stromstärke (8414) mit offenem Schalter bei
  „ohne geschlossen“; Spannung (9744) ohne Formel-Spoiler in der Aufgabe;
  Zusammenhang U/I (7273) mit mehr echten U/I-Aufgaben; Ohm (5904) ohne
  überflüssige Skizzen; Reihe (1841) / Parallel (8981) mit Glühlampen-Schaltbildern
  und geschlossenem Schalter (keine Schein-Lücke); Messen (1589) ohne falsche
  Kabel-Lücke. Physik-Pack **2.5.21**.

## [0.27.92] – 2026-09-22

### Geändert
- **Lehrplan Sekundarschule Sachsen-Anhalt · Mathematik (1.0.0):** zwei Packs
  Hauptschulabschluss (5–9) und Realschulabschluss (5–10); Kompetenzschwerpunkte
  mit Alias auf Sachsen-Gym-Aufgaben; Lücken als Outline.

## [0.27.91] – 2026-09-22

### Geändert
- **Themen-Menü (Handy):** Thementitel oben, Buttons (Üben / Übungsblatt / Wissen)
  darunter — auch in der Suche.
- **Lehrplan Gymnasium Sachsen-Anhalt · Mathematik (1.0.0):** Klassen 5–10 und
  11/12 gA nach Kompetenzschwerpunkten; vorhandene Sachsen-Gym-Aufgaben per Alias
  eingeordnet, Lücken als Outline. Unter Einstellungen → Lehrpläne installierbar
  (Region Sachsen-Anhalt).

## [0.27.90] – 2026-09-22

### Geändert
- **Freigaben:** Reibung (2021), Magnetische Kräfte (4779), Elektrostatik (7321).
- **Magnet/Elektrostatik:** Antwort-Buttons nur noch große Pfeile (`→ ←` / `← →`), nicht
  ausgeschrieben „Anziehen/Abstoßen“.
- **K7 LB2 Stromkreis:** Stromstärke (8414) inkl. Ladung I=Q/t + Fachwissen; Spannung (9744);
  Zusammenhang U/I ohne Ohm-Rechnung (7273); Ohmsches Gesetz (5904) mit mehr Varianten/Skizzen;
  Reihe (1841) / Parallel (8981) mit klarer Gesamtwiderstand-Formel + Schaltbild;
  Messen (1589) mit Lücken-Schaltbildern (A vs. V) und klarerer Zuordnung.
  Physik-Pack **2.5.20**.

## [0.27.89] – 2026-09-22

### Behoben
- **Reibung (2021):** F_R-Pfeil nicht mehr in der Skizze (nur v); Frage
  „In welche Richtung wirkt die Reibungskraft?“.
- **Magnet (4779) & Elektrostatik (7321):** keine Spoiler-Pfeile in der Skizze;
  Antwort-Buttons „Pfeile aufeinander zu (Anziehen)“ / „voneinander weg
  (Abstoßen)“; Formelblöcke mit →← (Anziehen) vs ←→ (Abstoßen); N/S bzw. +/−
  vertauschbar (`endsSwap`). Physik-Pack **2.5.19**.

## [0.27.88] – 2026-09-22

### Geändert
- **Freigaben K7 Kräfte:** Kraftbegriff (5888), Gewichtskraft (4203), Kräfte
  vergleichen (4243), Feder/Hooke (5427).
- **Reibung (2021) & Magnet (4779):** eigene Generatoren mit mehr Varianten und
  SVG-Skizzen (Reibungspfeile, Magnetpole).
- **Elektrostatik (7321):** mehr Aufgaben inkl. Ladungs-SVGs; Formelblöcke
  `+ ↔ −` tolerieren Vertauschen (`anyOrder`). Physik-Pack **2.5.18**.

## [0.27.87] – 2026-09-22

### Behoben
- **Themenfit gesperrte Physik K7–12:** Factory-Routing korrigiert (u. a. „Kraft“ in
  Kraftwerk/Zentripetalkraft nicht mehr → Gewichtskraft; „C =“ nicht mehr → Wellen;
  „Messunsicherheit“ nicht mehr → Sicherung; Geschwindigkeit nicht mehr → s=v·t bei
  Wellen/Schall/Licht). Neue Themen-Banks + Aliase; Fachwissen angepasst.
  Physik-Pack **2.5.17**.

## [0.27.86] – 2026-09-22

### Geändert
- **K7 Kräfte-Zuordnung:** ID 5888 nur noch Kraftbegriff (ohne F_G-Rechnung);
  Gewichtskraft-Rechnungen in ID 4203; ID 4243 Kräfte vergleichen/addieren.
- **Fachwissen:** passend für Kraftbegriff, Gewichtskraft, Kräfte addieren, Feder/Hooke,
  Reibung, Magnet (K7), Elektrostatik. Physik-Pack **2.5.16**.

## [0.27.85] – 2026-09-21

### Geändert
- **ID 2474:** gleiche Term-Blöcke (z. B. zwei „(−4)“) sind austauschbar — Prüfung
  nach Label, nicht nach Chip-Index. Mathe-Pack **1.2.5**.
- **Freigaben:** Lochkamera (2743), Auge und Sehvorgang (7496); Physik-Pack **2.5.15**.

### Behoben
- **CI:** Physik-K6-Test an voll freigegebenen Wahlbereich angepasst.

## [0.27.84] – 2026-09-21

### Geändert
- **ID 2474:** gleiche Term-Blöcke (z. B. zwei „(−4)“) sind austauschbar — Prüfung
  nach Label, nicht nach Chip-Index. Mathe-Pack **1.2.5**.
- **Freigaben:** Lochkamera (2743), Auge und Sehvorgang (7496); Physik-Pack **2.5.15**.

## [0.27.83] – 2026-09-21

### Behoben
- **CI:** unbenutzte Variable in `augeSehSvg` (Pages-Build); mehr Varianten bei
  Lichtquellen für 10er-Runden (Installer-Tests). Physik-Pack **2.5.14**.

## [0.27.82] – 2026-09-21

### Geändert
- **ID 2474 (a·x=b):** Operation hinter `|` per Drag&Drop setzen, dann
  `x = b : a`, plus Eingabe des Ergebnisses für x. Mathe-Pack **1.2.4**.

## [0.27.81] – 2026-09-21

### Geändert
- **Lochkamera-SVG:** Lichtstrahlen als echte Geraden durch die Öffnung (kein Knick);
  Abbild aus Strahltreffern am Schirm.
- **Auge-SVG:** Netzhaut-Baum als proportionales, verkehrtes Ähnlichkeitsabbild;
  Strahlen durch Linsenmitte.
- **Freigabe:** Farbfilter (7584); Physik-Pack **2.5.13**.

## [0.27.80] – 2026-09-21

### Geändert
- **ID 2474 (a·x=b):** Terme selbst in Slots setzen (`x = b : a`) — Tippen oder
  Ziehen; klar getrennt von ID 1607 (Äquivalenzumformung per Button). Mathe-Pack
  **1.2.3**.

## [0.27.79] – 2026-09-21

### Geändert
- **Lochkamera-SVG:** Lichtstrahlen kreuzen sich in der Öffnung; Abbild weiterhin
  umgekehrt.
- **Auge-SVG:** kleines, verkehrtes Abbild auf der Netzhaut; Strahlen kreuzen in
  der Linse.
- **Farbfilter:** Abbildung nur wenn sie zur Frage passt (gleiche Farbe); reine
  Textaufgaben ohne unnötiges Bild.
- **Freigaben:** Dämmstoffe vergleichen (7326), Spektrum und Prisma (6521);
  Physik-Pack **2.5.12**.

## [0.27.78] – 2026-09-21

### Hinzugefügt
- **Gleichung umstellen (K7):** Mehrzeilige Äquivalenzumformung mit Buttons
  (`| + …`, `| − …`, `| : …`) — ID 1607 (x+a=b) und ID 2474 (a·x=b) klar getrennt.
- **Oberfläche einer Pyramide (K7):** neues Thema inkl. SVG-Vorlage
  (`generatePyramidSurfaceSvg` / Generator „Pyramide (Oberfläche)“); Pack Mathe **1.2.2**.

## [0.27.77] – 2026-09-21

### Hinzugefügt
- **Physik K6 Wahlbereiche:** themenpassende Banken für Lochkamera (inkl. Grafik,
  B/G = b/g), Auge/Sehvorgang, Dämmstoffe vergleichen, Farbfilter, Spektrum/Prisma
  (qualitativ, ohne Sinus-Brechungsgesetz); Grafiken in `physikSvg`.

### Geändert
- **Freigaben:** Sehen und Fotografieren (1057), Wärmedämmung (8550), Farben (1612);
  Physik-Pack **2.5.11**.
- **Factory-Routing:** Spektrum/Filter/Lochkamera/Auge/Dämmstoffe/Lichtquellen nicht
  mehr in Spiegel-/Brechungsgesetz-Sammelbanken; Schwingkreis-Filter getrennt.

## [0.27.76] – 2026-09-21

### Hinzugefügt
- **Grafik-Prüfungsthemen (gesperrt):** Unter-IDs `…__grafik` zu Klasse 8–12
  (Gerade einstellen/zeichnen, Scheitel/Nullstelle tippen, Tangente, Fläche).
  Badge „Grafik-Prüfung“; Pack Gym Sachsen Mathe **1.2.1**.
- **Aufgabengenerator Koordinaten klicken:** mehrere Lösungspunkte, Anzahl
  1–12 einstellbar (Reihenfolge egal).

## [0.27.75] – 2026-09-21

### Hinzugefügt
- **Aufgabengenerator Funktionsgraphen:** Vorlagen für Gerade, Parabel, kubisch,
  Potenz, Betrag, 1/x, Wurzel, Exponential, ln, Sinus/Cosinus/Tangens, eigener
  Ausdruck, Zwei-Funktionen und Vektoren; Live-Vorschau am Parameter-Slider.
- **Koordinatensystem zeichnen:** Freihand-Geraden/Strecken/Halbgeraden, Punkte
  und Texte positionieren (Raster frei/½/ganz); Visual-Modus „Zeichnen“ und
  Interaktion „Zeichnen im Koordinatensystem“.

### Geändert
- **Aufgabengenerator Ziel:** gestaffelte Dropdowns Lehrplan → Klassenstufe →
  Lernbereich → Thema / Neues Thema; Pack- und Themen-IDs nur intern.
- **Aufgabengenerator Koordinaten:** Antwortpunkt per Klick im Gitter setzen.

## [0.27.74] – 2026-09-21

### Hinzugefügt
- **Aufgabengenerator (MVP, Entwickler-UI):** Einstellungen → Aufgabengenerator /
  Aufgaben-Prüfung. Alle Interactive-Typen wählbar, SVG-Vorlage oder Raw-Editor,
  lokale Drafts, Einreichen, Review, TS-Export. Lehrer-Capability ist verdrahtet,
  UI vorerst ausgeblendet (`TASK_AUTHORING_SHOW_FOR_LEHRER` in
  `taskAuthoringFlags.ts` — Kill-Switch: `TASK_AUTHORING_ENABLED`).

## [0.27.73] – 2026-09-21

### Behoben
- **ID 7081 u. a. Drag&Drop:** Sortieren und Formel-Slots nutzen Pointer-Events
  statt HTML5-DnD — funktioniert wieder auf iPhone/Touch; zusätzlich ▲/▼ bzw.
  × als Fallback.

## [0.27.72] – 2026-09-20

### Behoben
- **ID 7227 L-Quader:** Ausschnitt-Längen-Pfeil oben rechts weiter nach oben/rechts
  versetzt, linker Anfang an der Ausschnittkante.

## [0.27.71] – 2026-09-20

### Behoben
- **ID 7227 L-Quader:** Maßpfeile wie Handzeichnung — Ausschnitt-Tiefe oben
  links, Fuß-Tiefe (bis zum Ausschnitt) unten rechts, Länge unten, Höhe links,
  Ausschnitt-Länge oben am Arm; volle äußere Tiefe entfällt zugunsten der
  klareren Zerlegung.

## [0.27.70] – 2026-09-20

### Behoben
- **ID 7227 L-Quader:** Maßpfeile wie in der gezeichneten Vorlage — volle
  Tiefe rechts außen parallel zum Stem (nicht durch die Aussparung), Teiltiefe
  oben am Absatz; 45°/halbe Länge bleibt, damit z. B. 10 cm kürzer wirkt als
  9 cm Front.

## [0.27.69] – 2026-09-20

### Behoben
- **ID 7227 L-Quader:** echte Schrägbild-Projektion wie beim Quader — Tiefe
  unter **45°** und **halbe Länge**; Maßpfeile bleiben ohne Hilfsstriche.

## [0.27.68] – 2026-09-20

### Behoben
- **ID 7227 L-Quader:** Maßpfeile wie in der Vorgabe — freischwebend parallel
  versetzt (inkl. ~45° bei Tiefenmaßen), **ohne** Hilfslinien an den Ecken.

## [0.27.67] – 2026-09-20

### Behoben
- **ID 7227 L-Quader:** Körper gestreckt; Maßpfeile mit Hilfslinien parallel
  versetzt — Tiefenmaße in derselben ~45°-Richtung, klar der Seite zuordenbar.

## [0.27.66] – 2026-09-20

### Freigabe
- **ID 3173 Temperatur-Messreihe** freigegeben (Physik-Pack 2.5.10).

### Behoben
- **ID 5299 Zahlenstrahl:** Hinweis am Handy im Hochformat — Telefon seitlich
  drehen für bessere Bedienbarkeit.

## [0.27.65] – 2026-09-20

### Freigabe / Sperre
- **ID 3173 Temperatur-Messreihe:** wieder **gesperrt** bis Prüfung/Freigabe.
  Aufgaben neu: Δϑ aus Tabelle, Mittelwert, Ausreißer, Änderungsrate (°C/min) —
  kein sinnloses Sortieren nach der Zeit mehr.

### Behoben
- **Klausur:** erreichte Punkte werden während der Klausur nicht mehr angezeigt;
  kein Live-Mitzählen beim Tippen vor der Abgabe.
- **ID 7227 L-Quader:** hintere Schnittmaße klar außerhalb des Körpers.
- **ID 3126 Thermometer:** Toleranz ±1 °C.
- **ID 8500 Stromkreis:** Summer mit Summer-Schaltzeichen; Artikel „Der Summer“.
- **ID 6148 Schaltsymbole:** Mehrfach-Symbole zu den Antworten; „Ohne
  Schaltsymbole…“ zählt richtig; Frage „Welches Schaltsymbol wird hier gezeigt?“
  mit Bauteil-Antworten.
- **ID 5299 Zahlenstrahl:** hellere Striche/Beschriftung; mobile Skalierung.

## [0.27.64] – 2026-09-20

### Freigabe
- **Physik Klasse 6 LB3:** Wärmeausdehnung, Aggregatzustände, Schmelzen und
  Sieden, Temperatur-Messreihe (gesamter Lernbereich freigegeben).

### Behoben
- **Themenfit Physik:** Wärmeausdehnung/Schmelzen/Messreihe nicht mehr mit
  Celsius↔Kelvin vermischt; Aggregatzustände ohne Spoiler („Eis…“,
  „Wasserdampf…“) und ohne themenfremde Messreihe.
- **Factory-Routing:** Wirkungsgrad-Regex traf fälschlich Beta/Zentripetal;
  Radio traf Radioaktiv; Wärmeleitung landete bei Kernstrahlung; Catch-all
  Welle/Schall ohne atom/kern/feld.
- **Celsius/Kelvin (ID 5299):** Zahlenstrahl gibt Kelvin vor, Einstellen in °C
  (vorher umrechnen).

## [0.27.63] – 2026-09-20

### Freigabe
- **Physik Klasse 6 LB3:** Temperatur ablesen (ID 3126) und Celsius und Kelvin
  (ID 5299).

### Behoben
- **Celsius/Kelvin (ID 5299):** Umrechnungsformel aus der Aufgabenstellung
  entfernt; Zahlenstrahl nur noch alle 20 °C beschriftet.
- **Temperatur ablesen (ID 3126):** Zieltemperatur in der Frage; Einstellung am
  Thermometer-Schieber mit klarer Skala statt Zahlenstrahl; Ablese-Thermometer
  länger und mit Einteilung.

## [0.27.62] – 2026-09-20

### Hinzugefügt
- **Physik Klasse 6 LB1:** Thema „Sonne, Mond und Erde“ mit Anordnungen bei
  Sonnen-/Mondfinsternis und Mondphasen (Neumond, zunehmend, Vollmond, abnehmend).

### Freigabe
- **Physik Klasse 6 LB4:** Offener und geschlossener Stromkreis (ID 8500).

### Geändert
- **Physik-Runden:** Standardmäßig 10 Aufgaben pro Durchgang (weniger nur, wenn
  nicht genug einzigartige Aufgaben verfügbar — keine Doppelungen).

### Behoben
- **Stromkreis-Schaltbilder (ID 8500):** Lösungstexte wie „Schalter zu/offen“ aus
  den Bildern entfernt; Zustand am Symbol ablesen.
- **Release-CI:** Physik-Pack-Upgrade-Test erwartet dynamisch die aktuelle
  Pack-Version (nicht mehr fest `2.5.2`).

## [0.27.61] – 2026-09-20

### Freigabe
- **Physik Klasse 6 LB4:** Gefahren und Kurzschluss (ID 2233).

## [0.27.60] – 2026-09-20

### Freigabe
- **Physik Klasse 6 LB4:** Leiter und Nichtleiter (ID 6788) und Reihe und Parallel
  (ID 5923).

### Behoben
- **Reihe/Parallel-Schaltbilder (ID 5923):** Parallel jetzt mit zwei eigenen
  Zweigen; Spannungsquelle und Glühlampen (Kreis mit X) nach Schulschnittbild;
  Lösungstexte wie „Parallel: eigene Zweige“ aus den Bildern entfernt.
- **Stromkreis-SVG:** gleiche offiziellen Symbole für Batterie und Lampe.

## [0.27.59] – 2026-09-20

### Freigabe
- **Physik Klasse 6 LB4:** Schaltsymbole (ID 6148) und Elektrischer Widerstand
  (ID 6936).

### Behoben
- **Stromkreis-Schalter (ID 8500):** Offener Schalter jetzt als angewinkelte
  Schaltlinie mit Kontaktpunkten (Schulschnittbild), nicht mehr als versetzte
  waagerechte Linien.

## [0.27.58] – 2026-09-20

### Geändert
- **Klassenstufen laden:** Nach dem Installieren eines Lehrplans wird keine
  Klassenstufe mehr automatisch geladen (früher oft Klasse 6). Es erscheinen
  nur noch die Stufen, die der Nutzer ausdrücklich auswählt.

## [0.27.57] – 2026-09-20

### Behoben
- **GitHub Pages Custom Domain:** `public/CNAME` + Deploy-Option `cname:
  app.tasktrophy.de`, damit die Custom-URL nach jedem Update erhalten bleibt
  (vorher wurde sie durch `force_orphan`-Deploys gelöscht).
- **Origin / Nutzerdaten:** Browser speichern localStorage pro Domain.
  github.io leitet ohne lokale Profile automatisch nach `app.tasktrophy.de` um;
  mit vorhandenen Profilen erscheint ein Hinweis inkl. Export-Hilfe.

## [0.27.56] – 2026-09-20

### Behoben
- **Üben / Punkte:** Punkte und Versuche werden sofort bei jeder geprüften
  Antwort gespeichert (richtig und falsch), nicht erst beim Beenden der Runde —
  so gehen keine Punkte verloren, wenn die App vorher geschlossen wird.

## [0.27.55] – 2026-09-20

### Hinzugefügt
- **Klausur-Berichtigung:** Nach der Auswertung können falsch beantwortete
  Aufgaben über **Falsche Aufgaben üben (Berichtigung)** mit ähnlichen Aufgaben
  aus denselben Themen geübt werden — ohne Einfluss auf Klausurauswertung oder
  Punkteprotokoll.
- **Fehlermeldungen mit Seed:** Beim Melden einer fehlerhaften Aufgabe wird der
  Generator-**Seed** mitgeschickt. In der Entwickleransicht sichtbar; „Aufgabe
  anzeigen“ öffnet genau diese Aufgabe.

## [0.27.54] – 2026-09-20

### Hinzugefügt
- **Klausur-Auswertung erneut öffnen:** Nach dem Abgeben wird die Auswertung
  lokal gespeichert. Unter „Klausur schreiben“ gibt es **Auswertung anzeigen**
  (letzte Klausur) bzw. bei bereits geschriebenen Klassenklausuren den Button
  **Auswertung**. Drucken/PDF bleiben verfügbar.

## [0.27.53] – 2026-09-19

### Behoben
- **Header-Überschrift:** Neben dem Logo erscheint wieder die sichtbare
  Überschrift **TaskTrophy – Das Klassen-Duell** (Login und kompakte Topbar).

## [0.27.52] – 2026-09-19

### Behoben
- **Header-Brand:** Im Kopfbereich erscheint das generierte TaskTrophy-Logo
  (PNG mit Wordmark, Trophy-T und Untertitel **Das Klassen-Duell**) statt des
  vereinfachten Favicon-SVG und separater Textzeilen.

## [0.27.51] – 2026-09-19

### Geändert
- **Rebrand (Anzeige):** Produktname **TaskTrophy** mit Untertitel
  **Das Klassen-Duell**. Logo/Favicon (Trophy-T), Fenster-Titel, Manifest,
  rechtliche und Teilen-Texte. Interne IDs bleiben unverändert (`appId`,
  localStorage-Keys, Export-Schema, GitHub-Repo, Artifact-Namen).

## [0.27.50] – 2026-09-19

### Geändert
- **Meine Meldungen / Korrektur-Banner:** Gelöschte Entwickler-Meldungen
  verschwinden beim Status-Abruf auch auf dem Gerät des Melders (lokale IDs
  werden bereinigt; Banner und Liste aktualisieren sich). Status-Texte klarer:
  offen / erledigt / „Aufgabe wurde korrigiert“; individuelle Entwickler-
  Nachricht (`replyMessage`) wird in Liste und Banner hervorgehoben. Der
  Status-Endpoint lässt gelöschte IDs weiterhin weg (kein API-Breaking-Change).

## [0.27.49] – 2026-09-19

### Geändert
- **Aufgaben-Grafiken mobil:** Diagramme (SVG) skalieren global mit der
  Gerätebreite (`TaskVisual` / `.task-visual`): fehlendes `viewBox` wird aus
  Breite/Höhe ergänzt; Container und Flex-Layout erlauben Schrumpfen. Inhalt,
  Maße und Beschriftungen bleiben unverändert – nur die Darstellung wird
  verkleinert.

## [0.27.48] – 2026-09-19

### Hinzugefügt
- **Einstellungen → Meine Meldungen:** Alle Rollen sehen ihre auf diesem Gerät
  gemeldeten Aufgaben (Content-ID, Thema, Kommentar, Status offen/erledigt/
  korrigiert inkl. Antwort). Ohne Entwickler-Aktionen. Leerer Zustand:
  „Noch keine gemeldeten Aufgaben“.
- **Korrektur-Banner:** Link **In Einstellungen anzeigen** öffnet die Rubrik
  Meine Meldungen (Banner bleibt zusätzlich sichtbar nach Poll).

### Geändert
- Beim Melden speichert die App lokal auch Kommentar/Content-ID/Thema; der
  öffentliche Status-Lookup `POST /reports/tasks/status` liefert für bekannte
  IDs zusätzlich `comment` und `topicTitle` (weiterhin kein PII). **Worker muss
  neu deployed werden**, damit Kommentare auch ohne lokales Snapshot kommen.

## [0.27.47] – 2026-09-19

### Hinzugefügt
- **Anonyme Rückmeldung bei korrigierten Aufgaben:** Nach dem Melden speichert die
  App nur die anonyme Melde-ID lokal. Entwickler können **Als korrigiert melden**
  (optional mit kurzer Nachricht, max. 500 Zeichen, keine personenbezogenen Daten).
  Melder sehen dann den Hinweis „Deine gemeldete Aufgabe wurde korrigiert“ inkl.
  optionaler Nachricht und können ihn schließen.
- **Cloudflare Worker:** Status `fixed`/`korrigiert` inkl. `replyMessage`/`fixedAt`
  über `PATCH /reports/tasks/:id`; öffentlicher Status-Lookup
  `POST /reports/tasks/status` nur für bekannte IDs. **Worker muss neu deployed
  werden.**

### Geändert
- **Fehlerhafte Aufgaben:** **Erledigt** schließt ohne Melder-Hinweis;
  **Als korrigiert melden** setzt Status `fixed` und benachrichtigt den Melder.

## [0.27.46] – 2026-09-19

### Behoben
- **Brüche kürzen (Klasse 6, Balken/Kreisdiagramm):** Generator erzeugte unechte
  oder ganzzahlige Anteile (`n ≥ d`). Die SVG-Darstellung füllt dann nur ein
  Ganzes (alles eingefärbt), während Lösung/Erklärung den unechten Bruch nannten
  (z. B. Bild 8/8 vs. Antwort 4/3, oder 3/3 → 1/1, 6/3 → 2/1). Visuelle Varianten
  erzeugen jetzt nur noch echte, kürzbare Teilbrüche (`0 < Zähler < Nenner`,
  gemeinsamer Teiler > 1); Segmentanzahl und Einfärbung entsprechen dem
  ungekürzten Bruch der Erklärung.

## [0.27.45] – 2026-09-19

### Hinzugefügt
- **Entwickler-Badges:** Offene (nicht erledigte) Fehlermeldungen als Zahlenbadge
  am Reiter **Einstellungen** und am Einstellungs-Eintrag **Fehlerhafte Aufgaben**.
  Zähler wird periodisch aktualisiert und nach Erledigt/Löschen in der Liste sofort
  angepasst; bei Zähler 0 oder anderen Rollen kein Badge.

## [0.27.44] – 2026-09-19

### Hinzugefügt
- **Fehlerhafte Aufgaben (Entwickler):** Buttons **Fehlerhafte Aufgabe anzeigen**
  (springt zur gemeldeten Übung über topicId/Content-ID), **Erledigt** (Status
  bleibt in der Liste) und bei erledigten Meldungen **Löschen** (entfernt den
  Eintrag dauerhaft auf Cloudflare).
- **Aufgaben ergänzen:** Lehrplan-Auswahl für alle mitgelieferten Packs
  (Gymnasium Mathematik/Physik, Oberschule HS/RS), nicht nur Mathematik Gym.

### Geändert
- **Cloudflare Worker:** `PATCH /reports/tasks/:id` (Status `open`/`done`) und
  `DELETE /reports/tasks/:id` (Auth wie GET über `REPORTS_TOKEN`). Öffentliches
  `POST /reports/tasks` unverändert. **Worker muss neu deployed werden.**

## [0.27.43] – 2026-09-18

### Behoben
- **Release-CI / Pages:** Thema `ph-k6-lb1-kernschatten` hatte zu wenig unique
  Aufgaben für Rundenlänge 10 — eigener Generator mit ausreichend Stämmen.
  Unused `r1`/`r2` in der Physik-Factory blockierten den TypeScript-Build
  (GitHub Pages). (v0.27.42 war getaggt, aber Build/Release fehlgeschlagen.)

## [0.27.42] – 2026-09-18

### Hinzugefügt
- **Aufgabe als fehlerhaft melden:** Button in Übung und Klausur — kurzer Kommentar
  wird mit Content-ID und Kontext an Cloudflare gesendet (`POST /reports/tasks`).
- **Entwickleransicht:** Einstellungsrubrik „Fehlerhafte Aufgaben“ listet Meldungen
  (`GET /reports/tasks`, Auth über Worker-Secret `REPORTS_TOKEN`).

### Behoben
- **Physik Schaltsymbole (ID 6148):** Fälschlich Ohm-/Widerstandsaufgaben; jetzt
  echte Schaltsymbol-Erkennung mit SVG. Neues Thema **Elektrischer Widerstand**
  (`ph-k6-lb4-widerstand`, ID 6936) im selben Lernbereich mit den bisherigen
  Ohm-Aufgaben. Dazu passende Generatoren für Reihe/Parallel und Gefahren.
- **Physik Factory (gesperrte Themen):** Keyword-Buckets Lernbereich-für-Lernbereich
  geschärft (Magnet, Reihe/Parallel, Spannung, Dämmung, Hebel, Induktion,
  Astronomie, Quanten, Impuls, Strahlung u. a.); generischer Fallback ohne
  themenfremde Gewichtskraft. Pack **2.5.2**.

## [0.27.41] – 2026-09-18

### Hinzugefügt
- **Wissen-Rubrik standardmäßig in jedem Lehrplan:** Jedes Thema erhält
  Fachwissen (How-to/Prinzip), sofern nicht explizit mit
  `excludeFachwissen` ausgenommen — gilt für Mathe, Physik, Oberschule und
  künftige Packs (Hydrate-/Factory-Default, Issue #45).
- **Einheiten umrechnen:** detailliertes Wissensfeld (Faktoren; Fläche
  Faktor² / m×m; Volumen Faktor³ / m×m×m; Länge, Masse, Zeit).
- **Physik Fachwissen:** themennahe Erklärungen inkl. Formeln (z. B. ρ=m/V,
  s=v·t, V=l·b·h) für alle Physik-Themen.

## [0.27.40] – 2026-09-18

### Behoben
- **Volumen bestimmen (ID 6453) blieb „gesperrt“:** Pack-Version 2.5.0 war
  ohne Semver-Bump freigegeben worden — installierte Kopien behielten
  `released: false`. Physik-Pack jetzt **2.5.1**; App-Upgrade ersetzt auch
  bei gleichem Pack-Stand abweichende `contentHash`-Inhalte.

## [0.27.39] – 2026-09-18

### Behoben
- **Desktop-Release-CI:** Freigabe-Allowlist in `physikAll.test` um
  „Volumen bestimmen“ (`ph-k6-lb2-volumen`) ergänzt, damit Installer-Builds
  nach ID-6453-Freigabe wieder grün werden.

## [0.27.38] – 2026-09-18

### Behoben
- **L-förmiger Körper (Maßbeschriftung):** Alle Maße wieder einheitlich als
  Strecken mit auswärtigen Pfeilen (wie Quader / L- / U-Form) — Aussparung
  nicht mehr mit Leadern; Tiefe rechts statt links; genug Abstand ohne
  Überlappung oder Clipping.

## [0.27.37] – 2026-09-18

### Hinzugefügt
- **Physik Klasse 6 LB2:** Freigabe „Volumen bestimmen“ (ID 6453, 10 Aufgaben/Runde).

## [0.27.36] – 2026-09-18

### Behoben
- **Physik-Lehrplanmodul:** Export/`contentHash` für Pack 2.5.0 nachgezogen
  (Release-Build-Test `physikGymPack`).

## [0.27.35] – 2026-09-18

### Hinzugefügt
- **Physik Klasse 6 LB2:** Freigabe für Dichte, Stoffvergleich, Masse,
  gleichförmige Bewegung, Weg-Zeit-Diagramm und Einheiten (je 10 Aufgaben/Runde).
- **Dichte:** Formel-Drag&Drop ρ = m / V (Division streng); Slider ohne Ziel-Spoiler.
- **Weg-Zeit-Diagramm:** echte s–t-SVG-Grafiken (Weg ablesen, Steigung/v, Vergleich).

### Behoben
- **Druck-Slider (Klasse 8):** Ziel-Werte nicht mehr im Aufgabentext verraten.

## [0.27.34] – 2026-09-18

### Behoben
- **Geometrie-Maßbeschriftung:** Auswärtige Strecken-Pfeile zuverlässig
  (zwei Halbgeraden mit `marker-end`, kein `auto-start-reverse`); nie
  Strecke und Leader gemischt; L-Körper mit getrennter Höhe/Tiefe ohne
  Kreuzung/Clipping; Innenmaße nur als kurze Leader in der Aussparung.
- **Formel-Drag&Drop:** Reine Produkte nach `=` (z. B. V = l × b × h,
  s = v × t) akzeptieren Faktorreihenfolge; Division bleibt streng.

## [0.27.33] – 2026-09-18

### Behoben
- **Maßpfeile & Beschriftung:** Quader-Höhe mit denselben auswärtigen
  Dimensionstpfeilen wie Länge/Breite; U-/L-Form und L-Körper ohne
  übereinanderliegende Maße (weniger redundante Labels, Hilfslinien zu
  abgesetzten Beschriftungen).
- **Formeln nur im Fachwissen:** Formel-Hints nicht mehr dauerhaft unter der
  Aufgabe; gehören in die aufklappbare Fachwissen-Box.

## [0.27.32] – 2026-09-18

### Behoben
- **Physik Klasse 6 LB2:** Thema „Masse“ (statt nur vergleichen) mit Einheiten und
  m aus ρ·V; Reihenfolge Volumen → Dichte → Stoffvergleich → Masse.
- **Dichte vergleichen:** nur schwimmen/sinken bzw. welche Dichte größer — keine
  Unsinns-Distraktoren, keine Dichte-Rechnung.
- **Physik-Aufgaben:** Formeln stehen nicht mehr im Aufgabentext (kommen ins
  Wissensfeld); Rechenfragen nennen nur die gesuchte Größe.

## [0.27.31] – 2026-09-18

### Behoben
- **Physik Formel-Drag&Drop:** Blöcke liegen im Vorrat; darunter leere
  Formelplätze — der falsche Block bleibt ungenutzt (kein „ans Ende sortieren“).

## [0.27.30] – 2026-09-18

### Behoben
- **Physik-Aufgaben (Factory):** Keine philosophischen/themenfremden Fragen mehr
  (z. B. Kunststil-Distraktoren, s=v·t unter „Volumen“, Prozess-Sortierung).
  Stattdessen Formel, Einheiten, Rechnung und Drag&Drop-Formelblöcke
  (z. B. V = l × b × h mit optionalem Falschblock) — themenbezogen für alle
  Factory-Themen.

## [0.27.29] – 2026-09-18

### Behoben
- **Grafische Geometrie-Aufgaben:** Maßbeschriftungen hell mit Kontrast-Halo
  (lesbar auf dunklem Hintergrund); fehlende Innenmaße bei U-/L-Form ergänzt;
  Innenbeschriftung der L-Form sitzt in der Aussparung (nicht im Flächenfüll);
  Quader-Höhe ohne irrelevante orange Markierung; L-Körper-Schnittkanten
  eindeutiger beschriftet (Hilfslinien + Abstand).

## [0.27.28] – 2026-09-17

### Behoben
- **Stufen-Wettbewerb:** Punkte-Übertragungen laufen nacheinander (Client + Worker),
  damit parallele POSTs in KV sich nicht mehr gegenseitig überschreiben.
- Punkteprotokoll zeigt zusätzlich den **Online-Stand** der Klasse neben dem
  lokalen Vormerken. Worker bitte aktualisieren (`cloudflare/worker.js`).

## [0.27.27] – 2026-09-17

### Behoben
- Klausur: Antworten und Endpunktzahl zuverlässiger (kein verlorenes Ergebnis
  beim Abgeben); Anzeige „Bisher X / Y P.“ während des Schreibens.
- **Gelöst-Zähler:** Abgabe auch über Klassencode + MSX1-Code
  (`POST /exams/complete`); Hinweis nach erfolgreicher Meldung.
- Worker: TypeScript-Warnungen im Cloudflare-Editor (Prize/JSON/Exam-Create)
  bereinigt. Bitte `cloudflare/worker.js` neu deployen.

## [0.27.26] – 2026-09-17

### Behoben
- Klausur schreiben: Punkte werden während des Lösens mitgezählt (bei richtiger
  Antwort / beim Weitergehen); Anzeige `erreicht / gesamt`.
- **Gelöst-Zähler:** Abgabe meldet den Zähler zuverlässiger (frischer Klassenabruf);
  Hinweis, wenn kein Klassencode aktiv ist. Worker bitte aktuell halten
  (`POST /exams/:id/complete`).

## [0.27.25] – 2026-09-17

### Neu
- Lehrer-Profil: mehrere **Fächer per Checkbox**; Themen und Klausur erstellen
  zeigen nur die ausgewählten Fächer (auch in der Web-App).
- Klausur erstellen: Themen nach Fach getrennt; **Alle auswählen** bei Themen
  und bei den Aufgabenvorschlägen.

### Behoben
- Klausur schreiben: während des Lösens steht die Punktanzeige auf
  `0 / Gesamt` (nicht mehr die Maximalpunkte wie schon erreicht).
- **Gelöst-Zähler:** Eingefügter MSX1-Code wird wieder der Klassenklausur
  zugeordnet (`POST …/complete`); Lehreransicht aktualisiert den Zähler
  regelmäßig und beim Zurückkehren in den Tab.

## [0.27.24] – 2026-09-17

### Behoben
- Installer-Release: Assets werden in einem Job angehängt (kein paralleler
  softprops-Race mehr, der Drafts mit unvollständigen Dateien hinterließ).

## [0.27.23] – 2026-09-17

### Behoben
- Installer-CI: HTTP-State-Test stubbt wieder `hostname` (LAN), damit der
  Klassencode-Lösch-Merge nach dem Pages-Fix nicht fehlschlägt.

## [0.27.22] – 2026-09-17

### Behoben
- **Klausur bearbeiten (Physik):** Themen aller geladenen Lehrpläne sind
  verfügbar; fehlende Module werden beim Bearbeiten nachgeladen (#44).
- **Klausur + Stufencode:** Mit eingetragenem Stufencode lassen sich Klausuren
  auch Klassen der Stufe zuordnen (ohne lokalen Klassencode; nur Codes/IDs)
  (#46). Worker bitte aktualisieren (`POST /exams` mit `gradeCode` + `classId`).

## [0.27.21] – 2026-09-17

### Neu
- **GitHub Pages Web-App:** Build/Deploy-Workflow; Site unter
  https://matthiasulrich1.github.io/Mathsachs/ (Browser-localStorage,
  Export/Import der Benutzerdaten wie bisher).

### Behoben
- Weiße Seite auf Pages: Quellcode statt Vite-Build wurde ausgeliefert.
- Auf github.io kein Versuch mehr, `/api/state` zu laden (nur LAN/Desktop).

## [0.27.20] – 2026-09-16

### Behoben
- Mathe-Freigabe über Lehrplan-Update wirkte nicht: gebündelte Generatoren
  ignorierten `released` aus dem Pack. Pack-Freigabe (z. B. ID 2101) gilt jetzt.

## [0.27.19] – 2026-09-16

### Freigabe
- Mathe-Pack **1.2.0**: **ID 2101** „Fläche und senkrechte Seitenlänge“ freigegeben
  (Klasse 6 Prismen).

## [0.27.18] – 2026-09-16

### Behoben
- Würfel/Quader in **Kavalierperspektive**: Tiefenkanten exakt **halb so lang**
  wie die Bezugskante und im **45°-Winkel** (Schulbuch-Darstellung).
- Gesuchte Länge orange **auf der senkrechten Kante** (nicht als schwebende Maßlinie).

### Verbessert
- Thema „Fläche und senkrechte Seitenlänge“: wechselnde Flächen (oben / vorne /
  rechts), damit V = A · a an unterschiedlichen Seiten klar wird.

## [0.27.17] – 2026-09-16

### Behoben
- Würfel-Aufgaben: Abbildung ist ein Würfel (Isometrie); Fläche oben, gesuchte
  Kante als **vertikale** Höhe senkrecht zur Fläche (nicht Tiefenkante).
- Prisma-Aufgaben: aufrechtes Prisma mit Grundfläche unten und **h** an der
  senkrechten Kante (nicht an einer schrägen Verbindungskante).

## [0.27.16] – 2026-09-16

### Verbessert
- Thema „Fläche und senkrechte Seitenlänge“: Fokus auf **V = G · h**
  (2D · 1D = 3D); mehr Aufgaben Volumen↔Fläche/Höhe bzw. Würfel V↔A.

### Behoben
- Würfel-Abbildung mit echter Isometrie (gleiche Kantenlängen).
- Höhenbeschriftung (z. B. „10 cm“) nicht mehr abgeschnitten.

## [0.27.15] – 2026-09-16

### Behoben
- Quader-/Würfel-Abbildungen: fehlende Seiten und verdeckte Kanten (gestrichelt);
  Würfel mit quadratischen Proportionen.
- Thema „Fläche und senkrechte Seitenlänge“: Quader-Aufgabe zeigt Quader (nicht
  Dreiecksprisma), Würfel-Aufgabe zeigt Würfel.

## [0.27.14] – 2026-09-16

### Neu
- Mathe Klasse 6 LB Prismen: Thema **Fläche und senkrechte Seitenlänge**
  (ID 2101) — grafisch, Division Fläche↔Kante bzw. Volumen↔Grundfläche/Höhe.
  Vorerst **gesperrt** (nur Entwickler-Vorschau); übrige Themen unverändert.

## [0.27.13] – 2026-09-16

### Neu
- Physik-Pack **2.4.0**: LB1 Licht-Themen freigegeben (IDs 2910, 3625, 6162,
  9806, 2610, 7298, 6991, 1992); Rundenlänge je Thema über Pack
  (`tasksPerRound`, z. B. Spiegel 5, sonst 10).

### Behoben
- Schatten-MC (Lampenposition): Schatten erst nach dem Prüfen in der Abbildung
  (kein Spoiler mehr).

## [0.27.12] – 2026-09-16

### Behoben
- Rolle **Entwickler** bleibt in der Desktop-/WLAN-Speicherung erhalten (wurde
  zuvor verworfen und als Schüler angezeigt).
- Hinweis und Button „Lehrercode anfordern“ bei Schüler/Eltern entfernt.

## [0.27.11] – 2026-09-16

### Neu
- Versteckte Rolle **Entwickler** (nicht bei der Profilerstellung wählbar):
  Lehrerrechte plus Lehrplan-Vorschau für gesperrte Themen. Aktivierung über den
  alternativen Lehrercode; im Profilwechsel und in den Einstellungen sichtbar,
  damit man zwischen Testprofilen wechseln kann.

## [0.27.10] – 2026-09-16

### Behoben
- Lehrplan-Vorschau für gesperrte Themen nur noch still über den Lehrercode-Dialog
  (keine eigene UI, kein Hinweis in den Einstellungen).

## [0.27.9] – 2026-09-16

### Neu
- **Physik-Freigabe:** Alle Physik-Themen starten als **gesperrt** (`released: false`).
  Schüler sehen „Noch keine Aufgaben enthalten“. Freigabe später per Pack-Update
  ohne App-Build.

### Verbessert
- Schatten-MC ohne vorgezeichneten Schatten; Lichtstrahl akzeptiert jeden Punkt
  in der richtigen Richtung; Brechung/Prisma mit eigenen Aufgaben; Physik-Runden
  max. 5 Aufgaben. Pack **2.3.0**.

## [0.27.8] – 2026-09-16

### Verbessert
- **Physik-Aufgaben**: Meta-Fragen („Idee → Anwendung → Kontrolle“, „Wozu übt
  man …“) entfernt; Factory erzeugt schulübliche Rechen-/Konzeptaufgaben
  (Optik, Strom, Mechanik, Wellen).
- **K6 Licht/Schatten**: Lampe per Schieberegler zum Schatten passend
  positionieren (ohne x-Anzeige); Lichtstrahl auf Kästchenpapier mit Lampe/Spalt
  und Auflösung als eingezeichneter Strahl; Kern-/Halbschatten und Lichtquellen.
- **Physik Pack 2.2.0** (automatische Aktualisierung installierter Lehrpläne).

## [0.27.7] – 2026-09-16

### Verbessert
- **Lehrpläne:** Installierte Pakete werden beim App-Start automatisch auf die
  mitgelieferte Version aktualisiert (z. B. Physik 2.1.0 nach App-Update).
  Online-Katalog-Updates werden ebenfalls automatisch eingespielt — kein
  manuelles „Lehrplan aktualisieren“ mehr nötig.

## [0.27.6] – 2026-09-16

### Behoben
- **Physik K6-Tests**: Generator-Registrierung prüft jetzt Factory-Themen
  (`resolvePhysikGenerate`) statt nur handgeschriebene `PHYSIK_K6_GENERATORS`
  — behebt CI-Fehler der Pre-Release 0.27.5.

## [0.27.5] – 2026-09-16

### Neu
- **Physik Pack 2.1.0**: Lernbereiche mit **5–9 Übungsthemen** (ähnlich Mathe),
  Themen an Lehrplan Gym Sachsen und typische Aufgaben (LEIFI, Olympiade,
  Schulaufgaben) angelehnt — Klassen 6–10 und JGS 11/12 Gk/Lk (~309 Themen).

## [0.27.4] – 2026-09-16

### Neu
- **Physik Gym Sachsen 2.0.0**: Übungsaufgaben für **alle** Themen Klassen 6–10 und
  JGS 11/12 Gk/Lk (je Thema mehrere Varianten wie in Mathe).

### Verbessert
- **Physik Klasse 6**: mehr Aufgaben-Varianten je Thema (Pack-Inhalte 1.1–1.3
  ausgebaut), damit Übungsrunden wieder ~10 verschiedene Aufgaben schaffen.

## [0.27.3] – 2026-09-16

### Behoben
- **Bevorzugtes Fach im Lehrerprofil**: wird nach Neustart wiederhergestellt; erneutes
  Umstellen bleibt erhalten (Last-Write-Wins mit Zeitstempel).
- **CSS**: verwaiste Regeln bei Klassenklausur-UI (Build-Warnung).

### Neu
- **Physik K6**: Spiegelweg tippen; Messreihe (Zeiten/Temperaturen) sortieren;
  Dichte-Schieberegler; Stromkreis- und Farbfilter-Mehrfachauswahl (Pack 1.3.0).

## [0.27.2] – 2026-09-16

### Neu
- **Physik Klasse 6 · Licht**: interaktive Übungen zu Schatten und Lichtquelle
  (Schieberegler mit Live-Schattenvorschau), Lampenposition, Lichtstrahl tippen
  (Koordinatengitter), Mehrfachauswahl zur geradlinigen Ausbreitung; Pack 1.2.0.

## [0.27.1] – 2026-09-16

### Neu
- **Anonymer Installationszähler**: Beim ersten Start einmal +1 an Cloudflare
  (`POST /stats/install`); Anzeige in der Fußzeile. Keine Geräte-ID, kein Name.

### Behoben
- **Klassenklausuren (#44)**: Desktop-`sharedStore` verwarf `classExams` beim
  Speichern — Klausuren fehlten nach Neustart. Persistenz + Wiederherstellung
  über eigene Klassencodes vom Worker.

## [0.27.0] – 2026-09-16

### Neu
- **Mehrere Fächer**: Lehrpläne nach Fach filtern; Fach-Buttons unter Themen;
  bevorzugtes Fach im Lehrerprofil (Lehrpläne und Klausur erstellen).
- **Gymnasium Sachsen · Physik** als installierbares Lehrplan-Paket (Klassen 6–10,
  JGS 11/12 Gk/Lk, Themenstruktur laut Lehrplan; Übungsaufgaben folgen schrittweise).

## [0.26.3] – 2026-09-16

### Behoben
- **Klassenklausuren (#44)**: Dropdown „Weitere Klasse“ öffnete nach Zuordnen/Entfernen
  nicht mehr (leerer `value` ohne passende Option). Auswahl wird wieder gültig gesetzt.

## [0.26.2] – 2026-09-15

### Behoben
- **K5 Lagebeziehungen**: Winkelarten ohne Wiederholungen (Rotation + Unique-Round im
  Übungsblatt); Ergänzungswinkel mit klarer Rechnung „90°/180° − …“; Streckenlänge immer
  auf Kästchenpapier; Mittelpunkt-Strecken bleiben im Raster; Strecke/Gerade/Halbgerade
  per Tippen wählbar.

## [0.26.1] – 2026-09-15

### Behoben
- **Update-Prüfung**: Bei GitHub-API-Rate-Limit wurde fälschlich „aktuell“ gemeldet und
  electron-updater unterdrückt. Fallback über `latest.yml` (ohne REST-Quota); Desktop
  vertraut wieder einem neueren Updater-Treffer.
- **Klassenklausuren (#44)**: Zuordnung blieb lokal nicht haften; Liste zeigt jetzt eine
  Klausur mit allen Klassen, weitere zuordenbar / entfernbar; Speichern aktualisiert alle
  Zuordnungen.

## [0.26.0] – 2026-09-15

### Neu
- **Schriftliche Multiplikation** auf dem Kästchenpapier wie Stellenwertverfahren von links:
  Teilprodukte je Ziffer des zweiten Faktors plus Summe (mehrere Antwortzeilen).
- **Schriftliche Division** als DigitGrid-Thema (`lb1-schriftliche-division`): Quotient
  ziffernweise, optional Rest; Varianten mit Nullen im Quotienten.
- Gym K5 und Oberschule K5 auf die neuen Multiplikations-/Divisions-Widgets umgestellt;
  Testcheckliste ergänzt.

## [0.25.0] – 2026-09-15

### Neu
- **Klassenklausuren im Lehrermodus (#44)**: Code erneut zeigen/kopieren (WhatsApp/Mail),
  Klausur bearbeiten und speichern, einer anderen Klasse zuordnen (wie bisher),
  anonymes „× gelöst“ über Worker (`POST /exams/:id/complete`).

## [0.24.1] – 2026-09-15

### Behoben
- TypeScript-Build: ungenutzter `rng`-Parameter in Mantelflächen-Variante (K7).

## [0.24.0] – 2026-09-15

### Neu
- **Interaktionen nachgezogen**: Winkel A/B/C tippen (Neben/Scheitel); zwei Graphen
  vergleichen (Steigung A/B); Nullstelle per Punkt setzen; Mantelflächen-Mehrfachauswahl
  am Prisma-Netz; Mittelsenkrechte-Schritte per Drag&Drop; Glücksrad-Sektor tippen;
  Betrag/Ordnen auf Zahlenstrahl (K7+); Schieberegler auch bei Funktionswert/Achsenabschnitt.
- **Widget `multiSelect`**: mehrere Flächen/Optionen tippen.
- **Testcheckliste**: `docs/TESTCHECKLISTE-grafik-interaktiv.md` (Checkbox + Kommentar,
  Klasse für Klasse, Gym + OS HS/RS).

### Geändert
- OS: Zahlengerade/Ordnen → Betrag-Generator; Konstruieren → Mittelsenkrechte-Schritte;
  HS-Steigung mit A/B-Graphenvergleich.

## [0.23.0] – 2026-09-15

### Neu
- **Klasse 10 grafisch**: Parabel-Skizze mit Punkten, Rechteck/Quadrat im Koordinatensystem,
  Glücksrad mit Sektoren zum Erwartungswert.
- **Klasse 11/12 grafisch**: Ableitung als Tangente am Graphen, Integral als Flächenfüllung,
  Vektoren als Pfeile.
- **Oberschule-Diagramme**: echte Kreisdiagramme mit Anteilen (statt Bruch-Torten);
  Prisma-Netze für Körpernetze/Darstellen; Remaps für Kreis/Zylinder, lineare Funktionen
  und rechtwinklige Dreiecke bleiben auf die grafischen Gym-Generatoren.

## [0.22.0] – 2026-09-15

### Neu
- **Interaktions-Widgets (Phase 6)**: Tippen (choicePick), Punkt im Koordinatensystem
  setzen (coordinateClick), Parameter-Slider für y = mx + n; Kongruenzsatz wählen;
  Würfelnetz erkennen.
- **Oberschule**: Kongruenz/Netze auf neue Generatoren; HS-Funktionen mit kleinerem
  Zahlenraum; K5/K7-Koordinaten interaktiv im 1. Quadranten (HS/RS).

## [0.21.1] – 2026-09-15

### Behoben
- **Winkelbögen lehrerkonform**: SVG-Sweep korrigiert (Bögen liegen im Innenwinkel,
  auch bei stumpfen Winkeln); rechter Winkel als **Viertelkreis mit Punkt** statt
  US-Quadrat; Orientierung über Flächenschwerpunkt abgesichert.

## [0.21.0] – 2026-09-15

### Neu
- **Klasse 9 Pythagoras / Kreis / Trig grafisch (Phase 5)**: Kreisumfang/-fläche,
  Zylinder, Kugelquerschnitt, rechtwinklige Dreiecke (Hypotenuse/Kathete),
  Trigonometrie mit Winkelbogen und Leiter-Sachaufgabe mit Skizze.

## [0.20.0] – 2026-09-15

### Neu
- **Klasse 8 lineare Funktionen grafisch (Phase 4)**: Funktionswert, Steigung,
  y-Achsenabschnitt und LGS mischen Text mit Graph (Steigungsdreieck),
  Wertetabelle und Schnittpunkt zweier Geraden.

## [0.19.0] – 2026-09-15

### Geändert
- **Oberschule-Remaps (Phase 3)**: Häufigkeit, Prisma-Volumen und Quader-Oberfläche
  in HS/RS K7 zeigen auf die grafischen K6-Generatoren statt textbasierter K7-Fallbacks.

## [0.18.0] – 2026-09-15

### Neu
- **Klasse 7 Geometrie grafisch (Phase 2)**: Neben-/Scheitel-/Stufen-/Wechselwinkel
  mit Bögen; Basiswinkel am gleichschenkligen Dreieck; Prisma, Pyramide und
  Quader-Oberfläche mit SVG.

## [0.17.0] – 2026-09-15

### Geändert
- **Winkel-Darstellungen lehrerkonform**: Dreiecks-/Vierecksfiguren werden aus den
  Winkelmaßen konstruiert; Innenwinkel mit **Bögen**, rechte Winkel mit
  **Quadratmarkierung**. Gilt auch für einzelne Winkel-SVGs (K5).

## [0.16.0] – 2026-09-15

### Neu
- **Klasse 6 Zuordnungen grafisch (Plan C)**: LB2 proportional / antiproportional /
  Dreisatz-Sachaufgaben mit Wertetabelle (fehlende Zelle, ·k-Pfeil), Punkten im
  1. Quadranten und Gerade-vs.-Hyperbel-Erkennen.

### Geändert
- **Schwierigkeit Klasse 6 vs. K5**: größere Zahlenräume, Dezimalmaße bei Quader/
  Prisma, stärkere Antiproportional-Varianten; Prisma betont gegebene Grundfläche.

## [0.15.0] – 2026-09-15

### Neu
- **Klasse 6 Brüche/Anteile grafisch (Plan B)**: LB1 (Kürzen, Vergleichen,
  Add/Sub, Bruch↔Dezimal, Prozent), LB2 relative Häufigkeit und LB5 Anteile
  mischen Text mit Kreis-/Balken-/Rasterdiagrammen, Zahlenstrahl und Drag&Drop.

## [0.14.0] – 2026-09-15

### Neu
- **Klasse 6 Geometrie mit Grafiken (Plan A)**: LB3 (Winkel im Dreieck/Viereck,
  Umfang und Fläche von Rechteck/Quadrat/Dreieck) und LB4 (Volumen/Oberfläche
  Quader, Volumen Prisma) mischen Text- und SVG-Aufgaben wie in Klasse 5.

## [0.1.51] – 2026-09-14

### Behoben
- **ACTIVE_KEY-Bereinigung verbessert**: Der gelöschte User wird nun aus dem Active-Key
  entfernt und beim Init wird validiert ob der User noch existiert. Stale Keys werden
  automatisch bereinigt. **Bekanntes Problem**: In der Electron-Desktop-App mit IPC-Backend
  kann durch den Merge-Mechanismus (LAN-Sync) ein gelöschter User wiederhergestellt werden.
  Lösung: Tombstone-System für User (kommt in nächster Version) oder Browser-Version nutzen.

## [0.1.50] – 2026-09-14

### Behoben
- **Gelöschte Benutzer bleiben nun wirklich gelöscht**: Der `ACTIVE_KEY` in localStorage
  wurde beim Löschen nicht entfernt und beim Reload wieder gelesen – dadurch wurde der
  gelöschte User quasi wiederbelebt. Jetzt wird der Key korrekt entfernt und beim Init
  geprüft ob der User aus dem Key überhaupt noch in der User-Liste existiert. Stale Keys
  werden automatisch bereinigt.

## [0.1.49] – 2026-09-14

### Behoben
- **Benutzer löschen/umbenennen jetzt garantiert persistent**: `deleteUser()` und
  `renameUser()` warten jetzt auf die vollständige Persistierung bevor sie zurückkehren.
  Vorher war die Speicherung asynchron im Hintergrund – bei schnellem Neuladen
  (F5) oder Schließen der App waren die Änderungen verloren. Jetzt sind Lösch- und
  Umbenennvorgänge garantiert auf Disk/IPC/HTTP geschrieben bevor die UI aktualisiert
  wird. Die Buttons zeigen während der Operation „Wird gelöscht…" bzw. „Wird umbenannt…".

## [0.1.48] – 2026-09-14

### Behoben
- **Benutzer löschen funktioniert jetzt korrekt**: Race Condition zwischen manuellem
  State-Update und Storage-Subscription behoben. Nach dem Löschen wird der Benutzer
  nun zuverlässig aus der Auswahlliste entfernt. Gleiches gilt für Umbenennen.

## [0.1.47] – 2026-09-14

### Neu (Issue #38 + #42)
- **Benutzer umbenennen**: Im Bereich Einstellungen → Profil → Benutzerverwaltung
  kann der aktive Benutzer umbenannt werden. Alle Übungsdaten bleiben erhalten.
- **Benutzer löschen**: Zweistufige Bestätigung verhindert versehentliches Löschen.
  Vorher exportieren wird empfohlen.
- **Übungsdaten exportieren**: Speichert alle Ergebnisse, Punkte und Einstellungen
  eines Benutzers als JSON-Datei – funktioniert im Browser und in der Desktop-App.
- **Daten importieren**: Lädt eine exportierte JSON-Datei ein. Vorhandene Daten
  werden zusammengeführt (Sessions, Stats). Ist der Benutzername neu, wird
  automatisch ein neuer Benutzer angelegt – damit lassen sich Übungsdaten von
  einem Gerät auf ein anderes übertragen.

## [0.1.46] – 2026-09-14

### Behoben
- **Klassencode-Druck und Stufendruck funktionieren wieder** in der Desktop-App.
  `window.open()` wird in Electron durch den `setWindowOpenHandler` blockiert –
  das Druckfenster öffnete sich deshalb gar nicht. Der Druck wird jetzt über
  einen eigenen IPC-Kanal (`print:openWindow`) als neues `BrowserWindow` aus
  dem Main-Prozess heraus geöffnet. Der Browser-Fallback (z. B. im Web) nutzt
  weiterhin `window.open`.

## [0.1.45] – 2026-09-14

### Behoben
- **In-App-Update robuster**: Wenn `electron-updater` beim Updatecheck wegen eines
  kurzzeitigen Netzwerkfehlers oder GitHub-Rate-Limits einen Fehler warf, wurde
  `canAutoInstall` dauerhaft auf `false` gesetzt und der Download öffnete den
  Browser statt den In-App-Fortschrittsbalken zu zeigen. Jetzt wird beim Klick auf
  „Update herunterladen" ein erneuter Check durchgeführt, sodass der In-App-Download
  und der „Jetzt installieren"-Button wieder zuverlässig erscheinen.

## [0.1.44] – 2026-09-14

### Hinzugefügt

- **Klassencode drucken (30 Zettel):** In der Liste der eigenen Klasscodes
  gibt es den neuen Link **„Drucken (30 Zettel)"**. Er öffnet ein
  druckfertiges A4-Blatt mit 30 Kopien des Klassencodes (3 Spalten × 10
  Zeilen) und gestrichelten Schnittlinien. Die Zettel können ausgeschnitten
  und an die Schüler verteilt werden.
- **Stufendruck:** Im Bereich „Klassenstufe" erscheint der Link
  **„Stufendruck"**, sobald mindestens eine Klasse der Stufe zugeordnet ist.
  Er druckt für jede zugeordnete Klasse eine eigene Seite mit 30
  Code-Zetteln – alles in einem einzigen Druckauftrag.
- Neues Modul `src/classCode/printSheet.ts` mit der Funktion
  `openCodePrintWindow`.

## [0.1.43] – 2026-09-14

### Hinzugefügt

- **Fachwissen:** Jedes Thema in den Klassen 5–12 enthält jetzt eine kompakte
  mathematische Erklärung (eigene Formulierung) mit Quellenangabe und Link zu
  Wikipedia (CC BY-SA 4.0). Die Wissensbox lässt sich im Lehrplan-Browser
  (Schaltfläche „Wissen ▼") und direkt in der Übe-Session (💡 Fachwissen)
  auf- und zuklappen.
- **Schwierigkeitsgrad:** Jedes Thema trägt nun ein Schwierigkeits-Badge
  (★ Basis · ★★ Standard · ★★★ Erweiterung), das im Lehrplan-Browser sichtbar
  ist.
- **Neue Anwendungsaufgaben (Klasse 5 & 6):** Dezimalzahlen auf dem
  Zahlenstrahl einordnen, Größen mit verschiedenen Einheiten der Größe nach
  ordnen (z. B. 1,5 kg vs. 1 200 g), mehrstufige Sachaufgaben mit
  Alltagsbezug sowie Flächenaufgaben als Textaufgaben.
- **Difficulty-Badge & Fachwissen-Karte:** Neue CSS-Komponenten in `App.css`
  und neue React-Unterkomponente `TopicRow` im `CurriculumBrowser`.

## [0.1.42] – 2026-09-06

### Hinzugefügt

- **Unterstützer:** In der Fußzeile stehen die Logos der
  **Bürgerinitiative Menschenskinder Delitzsch! e.V.** und von
  **Mein Delitzsch**. Unter **Einstellungen → Unterstützer** ist die
  Bürgerinitiative mit Website aufgeführt. Weitere Unterstützer werden
  in einer gemeinsamen Liste ergänzt.

## [0.1.41] – 2026-09-05

### Behoben

- **Punkteprotokoll nach Klassenwechsel:** Unter **An die Klasse übertragen**
  zählen nur noch Sendungen an den **aktuellen** Klassencode. Nach
  **Klasse löschen** verschwinden die alten Überträge, auch wenn die neue
  Klasse denselben Anzeigenamen hat und noch keine Punkte bekommen hat.

## [0.1.40] – 2026-09-05

### Geändert

- **Lehrpläne-Filter:** Unter **Einstellungen → Lehrpläne** filterst du den
  Katalog nach **Bundesland** (z. B. Sachsen) und **Schulform**
  (Gymnasium, Hauptschule, Realschule). Standard ist alle Schulformen
  und Sachsen, solange nur dieses Land im Katalog steht.
- **Klassenstufen-Überschrift:** Die Stufen stehen unter dem jeweiligen
  installierten Paket, z. B. **Klassenstufen · Gymnasium Sachsen ·
  Mathematik**. Mehrere installierte Lehrpläne bekommen je eine eigene
  Gruppe statt einer gemeinsamen, namenlosen Liste.

## [0.1.39] – 2026-09-05

### Behoben

- **Lehrplan entfernen:** Nach **Entfernen** (Gymnasium oder Oberschule)
  bleibt das Paket auf diesem Gerät weg. Die gemeinsame WLAN-/PC-Zusammenführung
  hat gelöschte Lehrpläne bisher wiederhergestellt (Vereinigung ohne
  Löschmarker). Jetzt merkt sich das Gerät entfernte Paket-IDs
  (`deletedCurricula`, nur ID und Zeitpunkt, keine Personendaten) und
  spielt sie nicht erneut ein. Erneutes **Installieren** ist weiter möglich.
  Eine Challenge blockiert das Entfernen nicht.

## [0.1.38] – 2026-09-05

### Hinzugefügt

- **Oberschule Sachsen Mathematik** als zwei downloadbare Lehrplan-Pakete
  (`oberschule-sachsen-hs` und `oberschule-sachsen-rs`, je 1.0.0).
  Unter **Einstellungen → Lehrpläne** installierst du
  **Hauptschulbildungsgang** (Klassen 5–9) und/oder
  **Realschulbildungsgang** (Klassen 5–10). Die Klassen 5–6 stehen in
  beiden Paketen, damit jedes für sich vollständig ist.
- Lernbereiche und Themen folgen dem offiziellen Lehrplan Oberschule
  Mathematik (Sachsen, 2004/2009/2019, lplanid=67). Themen mit gleichem
  Rechenstoff nutzen die vorhandenen Generatoren; die übrigen bleiben
  im Lehrplan sichtbar mit dem Hinweis **noch keine Aufgaben**.
  Lehrer-Ergänzungen bleiben getrennt (`extras: []`).

## [0.1.37] – 2026-09-05

### Hinzugefügt

- **Lehrpläne als Module:** Gymnasium Sachsen Mathematik ist ein
  versioniertes Paket (`gym-sachsen` 1.0.0). Unter
  **Einstellungen → Lehrpläne** kannst du Pakete **installieren**,
  **aktualisieren** und **entfernen**. Der Katalog liegt auf GitHub
  (`curricula/manifest.json`); installierte Dateien liegen lokal bzw.
  auf dem PC (WLAN-Tablets nutzen denselben Stand).
- **Lehrer-Ergänzungen** stehen im Paket getrennt unter `extras` und
  erscheinen im selben Themengebiet mit dem Badge **Lehrer-Ergänzung**.
- Klausur und Challenge speichern `curriculumRefs` (Paket-ID + Version).
  Ist die benötigte Version neuer als die installierte, erscheint die
  Aufforderung, den Lehrplan zu aktualisieren.
- Hinweisbanner oben, wenn online eine neuere Lehrplan-Version vorliegt
  (Prüfung beim Start und einmal täglich, wie bei App-Updates).
- Bestehende Nutzer mit geladenen Klassen oder Übungen bekommen das
  bisherige Gymnasium-Sachsen-Paket automatisch als lokale Version 1.0.0.
  Neue Profile starten leer und sehen den Hinweis zum Installieren.

## [0.1.36] – 2026-09-05

### Behoben

- **Challenge-Protokoll:** Punkte im Challenge-Zeitraum zählen jede Übung nur
  einmal. Eine Sitzung und ihre Klassenübertragung (oder eine getaggte und
  eine ungetaggte Kopie derselben Sitzung) werden nicht mehr addiert.
- Der Block **An die Klasse übertragen** entfällt im Challenge-Protokoll;
  der anonyme Challenge-Stand der Klasse kommt weiter vom Worker.
- **Klassenziel** und **noch … Punkte** auf der weißen Protokollkarte sind
  wieder gut lesbar (dunkler Text, kräftigeres Türkis).

## [0.1.35] – 2026-09-05

### Hinzugefügt

- **Challenge ändern / löschen:** Lehrer und Klassenlehrer können eine von
  ihnen angelegte, laufende oder angelegte Challenge **ändern** (Name,
  Zeiten, Themen, Gewinnchance, Klassenziel) oder nach Rückfrage **löschen**.
  Umfang (Klasse/Stufe) und die Bindung an den Code bleiben. Klassenlehrer
  können keine Stufenchallenge ändern oder löschen. Schüler und Eltern
  sehen keine solchen Knöpfe. Nach dem Löschen gilt wieder
  „Aktuell keine Challenge aktiv.“, wenn keine Challenge mehr da ist.
  Bereits gespeicherte Übungen bleiben; das Protokoll nutzt danach das
  neue Fenster und die neuen Themen.
- Worker: `PUT /challenges/:id` und `DELETE /challenges/:id` (Geheimnis =
  Challenge-ID). Klassensummen bleiben. Keine Personendaten. **Linus/
  Matthias:** `cloudflare/worker.js` einfügen und Deploy.

## [0.1.34] – 2026-09-05

### Behoben

- **Challenge-Protokoll:** Punkte und Übertragungen gehören nur noch zu
  **dieser** Challenge. Gewertet werden Sitzungen im Berlin-Fenster der
  Challenge **und** mit einem Thema aus ihrer Themenliste. Neue Übungen
  aus dem Challenge-Reiter (und Übungen während genau einer passenden
  laufenden Challenge) merken sich die `challengeId`; das Protokoll
  bevorzugt diese Zuordnung. Ein neuer Challenge-Zeitraum übernimmt
  deshalb keine älteren Tests mehr, nur weil dasselbe Thema später
  wieder vorkommt. Ohne `challengeId` gilt weiter Thema + Zeitraum —
  aber nichts vor dem Start.
- Bei mehreren Challenges steht der Name an den Zahlen: **Punkte im
  Challenge-Zeitraum — …**, **An die Klasse übertragen — …** und
  **Challenge-Stand — …**.

## [0.1.33] – 2026-09-05

### Behoben

- **Challenge-Protokoll:** Nach dem Üben in einer laufenden Challenge stehen
  Themen mit Ergebnis (Aufgaben, richtig, Anteil, Punkte), die **an die Klasse
  übertragenen** Punkte und der **Challenge-Stand** (eigene lokale Punkte,
  Klassensumme, bei Stufe die anonymen Klassenstände). Das Protokoll zeigte
  vorher überall 0, obwohl die Punkte gespeichert und an die Klasse gesendet
  wurden: Übertragungen wurden nicht eingerechnet, und Worker-Zusammenfassungen
  ohne `topicIds` fanden die lokalen Sitzungen nicht.
- **Klassenziel / Gewinnschwellwert** erscheint im Protokoll, wenn für die
  Challenge eine Punkteschwelle gesetzt ist (`Klassenziel: N Punkte`), sonst
  nicht. Weiterhin keine Schülernamen online.

## [0.1.32] – 2026-09-05

### Geändert

- **Challenge sichtbar:** Lehrer und Klassenlehrer sehen ihre **laufenden**
  und **angelegten** Challenges (Name, Klasse/Stufe, Zeitraum, Themen,
  Gewinnchance, Stand). Nicht nur das Anlegeformular und nicht nur die
  Challenge der gerade aktiven Klasse — auch Challenges an erstellten oder
  eingetragenen Klassen- und Stufencodes sowie lokal gemerkte eigene
  Challenges.
- **Schüler und Eltern** sehen neben dem Gewinntext **wer gewinnen kann**
  (Klasse und/oder Schüler; bei Stufe: Klasse/Stufe vs. Schüler) und das
  **Klassenziel** (Punkteschwelle), z. B. `Klassenziel: 100 Punkte`.
  Keine Personennamen online.
- Worker: `GET /classes/:code` und `GET /grades/:code` liefern angelegte
  (noch nicht gestartete) Challenges mit, nicht nur das laufende Fenster.
  `challenge` bleibt die gerade laufende. **Linus/Matthias:**
  `cloudflare/worker.js` einfügen und Deploy.

## [0.1.31] – 2026-09-05

### Hinzugefügt

- **Challenge-Modus:** Neuer Reiter **Challenge** (in den Einstellungen wie
  die anderen Übungs-Reiter ausgeblendet). **Lehrer** legen eine Klassen-
  oder Stufenchallenge an, **Klassenlehrer** nur eine Klassenchallenge
  (mit eingetragenem Klassencode). Schüler machen mit: nur die gewählten
  Themen üben und ein lokales **Challenge-Protokoll** drucken. Eltern
  sehen die Challenge nur — ohne Anlegen und ohne Üben aus diesem Reiter.
- Start und Ende als Datum/Uhrzeit in **Europe/Berlin**. Optional
  **Gewinnchance** (Klasse/Stufe und/oder bester Schüler, Gewinn als Text;
  bei Klassenchallenge eine optionale Punkteschwelle).
- Punkte in den Challenge-Themen zählen weiter für Klasse und Stufe **und**
  extra für die Challenge. Online nur anonyme Summen. Keine Schülernamen,
  Benutzer- oder Geräte-IDs auf dem Worker. „Bester Schüler“ nur über das
  gedruckte lokale Protokoll.
- Worker: `POST /challenges`, `GET /challenges/:id`, Challenge-Zusammenfassung
  in `GET /classes/:code` und `GET /grades/:code`. `POST …/points` nimmt
  optional `topicId` entgegen; der Server prüft Fenster und Thema.
  **Linus/Matthias:** `cloudflare/worker.js` einfügen und Deploy.

Fixes #11

## [0.1.30] – 2026-09-05

### Geändert

- **Updates:** Eine neuere GitHub-Version gilt erst als verfügbar, wenn der
  Installer für dieses System wirklich herunterladbar ist (Windows `.exe`,
  macOS `.dmg`, Linux `.AppImage`/`.deb`). Fehlt die Datei noch — typisch
  direkt nach dem Tag, solange **Build desktop installers** läuft — zeigt
  die App keinen Download und keine 404-Meldung, sondern:

  ```
  Da kommt was neues!
  Ein Update wird gerade erzeugt.
  Bitte in 5 Minuten erneut prüfen.
  ```

  Unter **Einstellungen → Auf Updates prüfen** steht derselbe Text. Die
  Desktop-App bietet **Update herunterladen** nur an, wenn zusätzlich
  `latest.yml` / `latest-mac.yml` / `latest-linux.yml` auf dem Release
  liegt.

## [0.1.29] – 2026-09-05

### Hinzugefügt

- **Lehrercode:** Wechsel in **Lehrer** oder **Klassenlehrer** (auch beim
  Anlegen) nur mit einem gemeinsamen Code. Er verhindert, dass Schüler
  Stufen oder Klassen anlegen. **Lehrercode anfordern** öffnet eine Mail
  an uns — auf dem Klassen-Server werden keine Personendaten gespeichert.
  Im Profil von Lehrer und Klassenlehrer steht derselbe Code zum Teilen
  mit anderen Lehrern der Schule.

## [0.1.28] – 2026-09-05

### Geändert

- **Aufgaben ergänzen:** Das **Themengebiet** ist eine Auswahlliste der
  Lernbereiche des gewählten Lehrplans (zum Beispiel Klasse 5 →
  „Arbeiten mit natürlichen Zahlen“). Wechselt die Klassenstufe, wird
  ein ungültiges Themengebiet geleert. Unter dem Aufgabenbeispiel steht,
  dass Beispiele auch als E-Mail-Anhang gehen — dann **siehe Anhang**
  eintragen.

## [0.1.27] – 2026-09-05

### Geändert

- **Auf Updates prüfen:** Der Button sitzt direkt auf der
  **Einstellungen**-Übersicht (Lehrpläne, Klasse, WLAN-Zugang, Profil,
  Aufgaben ergänzen), nicht mehr unter **Profil**. Beim Start und einmal
  am Kalendertag (**Europe/Berlin**) prüft die App weiter automatisch.
  Der manuelle Button umgeht die Tages-Sperre. Ist ein Update da, erscheint
  der bekannte Hinweis.

## [0.1.26] – 2026-09-05

### Hinzugefügt

- **Aufgaben ergänzen:** Lehrer senden unter **Einstellungen → Aufgaben
  ergänzen** Vorgaben für neue Übungsaufgaben: **Klassenstufe**,
  **Themengebiet**, **Titel des Themas** und ein **Aufgabenbeispiel**. Die
  Angaben gehen per E-Mail an uns. Der Klassen-Server speichert nichts
  davon.

## [0.1.25] – 2026-09-05

### Hinzugefügt

- **Auf Updates prüfen:** Unter **Einstellungen → Profil** prüft ein Button
  jederzeit auf eine neue Version. Die Sperre „schon heute geprüft“ gilt nur
  für die automatische Prüfung. Ist ein Update da, erscheint der bekannte
  Hinweis. Sonst steht unter dem Button, dass du die aktuelle Version hast
  (oder dass die Prüfung fehlgeschlagen ist).

## [0.1.24] – 2026-09-05

### Hinzugefügt

- **Rolle Klassenlehrer:** Rechte wie Lehrer beim Mitmachen in der Klasse
  (Code eintragen, Stufen-Wettbewerb über die eigene Klasse), aber **ohne**
  Klausur erstellen/schreiben, ohne Klassencode oder Stufencode anzulegen
  und ohne Punkte an die Klasse zu senden.
- **Stufencode eintragen:** Andere **Lehrer** derselben Klassenstufe tragen
  denselben Stufencode ein (wie bisher das Geheimnis). Danach sehen sie den
  Wettbewerb aller Klassen (nur Namen und Summen) und können Klassencodes
  dieser Stufe zuordnen oder neu anlegen. Neu erstellte Codes werden nicht
  automatisch aktiv. Eltern legen weiter nur Klassencodes an, keine Stufe.
- **Rollen-Rechte-Matrix** unter **Einstellungen → Profil**: Übersicht aller
  Rechte je Rolle. **Challenge erstellen** ist für Lehrer und Klassenlehrer
  als **geplant** eingetragen, noch nicht in der App.

### Geändert

- Benutzerwahl und Profil bieten vier Rollen: Schüler, Eltern, Klassenlehrer,
  Lehrer. Profile ohne Rolle bleiben **Schüler**, mit eigenen Klassencodes
  **Eltern** — nie automatisch Lehrer.

## [0.1.23] – 2026-09-05

### Geändert

- **Klassencode erstellen:** Ein neuer Klassencode wird nicht mehr automatisch
  aktiv. Der bisher aktive Code bleibt aktiv. Aktivieren bleibt über
  **Aktivieren** bei den eigenen Codes oder über **Code eintragen**.

### Hinzugefügt

- **Update-Prüfung einmal täglich:** Bleibt Mathsachs über Nacht oder das
  Wochenende geöffnet, prüft die App nach dem Start erneut am nächsten
  Kalendertag (**Europe/Berlin**) auf GitHub-Releases. Der vorhandene
  Update-Hinweis erscheint, wenn eine neue Version da ist. An einem Tag
  höchstens eine Prüfung (der Zeitpunkt wird lokal gemerkt).

## [0.1.22] – 2026-09-05

### Geändert

- **Klausurerstellung:** Der WLAN-/Teilen-Link und der QR-Code entfallen —
  Schüler können den Link nur im selben Netz wie der Klausurersteller nutzen.
  Beim **Klausurcode** gibt es dafür **WhatsApp** und **Mail** (wie beim
  Klassencode). Kopieren bleibt. WLAN-Zugang unter den Einstellungen bleibt.

## [0.1.21] – 2026-09-05

### Behoben

- **Klassenname statt Klassencode:** In der Leiste neben dem Namen und im
  Punkteprotokoll („Punkte an …“) erscheint wieder der **Klassenname**
  (z. B. `6/6`), nicht der geheime Klassencode. Schüler tragen den Code nur
  ein; der Name kommt vom Klassen-Server und wird lokal gemerkt. Der
  Stufen-Wettbewerb zeigte die Namen bereits richtig.

## [0.1.20] – 2026-09-05

### Hinzugefügt

- **Klassenstufencode:** Nur **Lehrer** legen unter **Einstellungen → Klasse**
  eine Klassenstufe an und ordnen ihr Klassencodes zu. Der Stufencode bleibt
  beim Lehrer (kopieren zum Teilen unter Lehrkräften). **Eltern** erstellen
  weiter Klassencodes, aber keine Stufe. **Schüler** tragen nur einen
  Klassencode ein und senden Punkte nur dorthin.
- **Stufen-Wettbewerb:** Ist eine Klasse einer Stufe zugeordnet, sehen alle
  mit diesem Klassencode die Punktestände der anderen Klassen derselben Stufe
  (Tag / Woche / Monat / Schuljahr) — in den Einstellungen und im
  Punkteprotokoll. Es erscheinen nur **Klassennamen** und Summen, keine
  Personennamen.
- **Worker:** `POST /grades`, `GET /grades/:code`, `PUT /grades/:code/classes`,
  `DELETE /grades/:code`. `GET /classes/:code` liefert bei Zuordnung eine
  Stufenübersicht ohne Mitgliedscodes. Punkte nur per `POST /classes/:code/points`.
  Nach dem Update einmal [`cloudflare/worker.js`](cloudflare/worker.js) in
  Cloudflare einfügen und **Deploy**en.

## [0.1.19] – 2026-09-05

### Hinzugefügt

- **Benutzerrollen:** Beim Anlegen eines Profils und unter **Einstellungen →
  Profil** wählst du **Schüler**, **Eltern** oder **Lehrer**.
  - **Schüler:** Themen, Klausur schreiben, Punkteprotokoll, Einstellungen.
    Unter Klasse nur einen bestehenden Code eintragen und aktivieren — kein
    Erstellen, Teilen oder Löschen eigener Codes.
  - **Eltern** und **Lehrer:** zusätzlich Klausur erstellen und die volle
    Klassencode-Verwaltung wie bisher.
  Vorhandene Profile ohne gespeicherte Rolle gelten als **Schüler**. Haben sie
  bereits eigene Klassencodes, gilt **Eltern**. Die Rolle lässt sich jederzeit
  im Profil ändern; die Reiter passen sich sofort an.

## [0.1.18] – 2026-09-05

### Geändert

- **Einstellungen-Leiste:** In den Einstellungen (inkl. Untermenüs) zeigt die
  Leiste **Zum Üben** links neben **Einstellungen**. Themen, Klausur
  erstellen, Klausur schreiben und Punkteprotokoll sind dort ausgeblendet.
  Einstellungen bleibt hervorgehoben. **Zum Üben** in der Leiste öffnet die
  Themen. Der doppelte Knopf in der Karte entfällt; **Zurück** bleibt in den
  Untermenüs.
- **Benutzerauswahl:** WLAN-Zugang steht nicht mehr auf „Wer übt heute?“,
  sondern nur unter Einstellungen → WLAN-Zugang.

## [0.1.17] – 2026-09-05

### Geändert

- **Einstellungen-Untermenü:** Die Seite zeigt zuerst eine Liste (Lehrpläne,
  Klasse, WLAN-Zugang, Profil). Ein Eintrag öffnet nur diesen Bereich;
  **Zurück** führt zur Liste. **Zum Üben** verlässt die Einstellungen und
  öffnet die Themen. WLAN-Zugang bleibt auf dem Desktop aktiv; im Browser
  ein Hinweis. „Zu den Lehrplänen“ öffnet direkt den Lehrplan-Bereich.

## [0.1.16] – 2026-09-05

### Geändert

- **Einstellungen:** Lehrpläne, Klasse/Klassencode, WLAN-Zugang und Profil
  liegen auf einer Seite. Die Leiste zeigt Themen, Klausur erstellen,
  Klausur schreiben, Punkteprotokoll und **Einstellungen**. Der Name und die
  aktive Klasse bleiben in der Leiste; **Benutzer wechseln** steht nur noch
  unter Profil (keine Benutzerrollen). WLAN-Zugang nur, wenn die Desktop-App
  den LAN-Status liefert — im Browser ein kurzer Hinweis.

## [0.1.15] – 2026-09-05

### Hinzugefügt

- **Klassencodes pro Benutzer:** Erstellte Codes, aktiver Code und
  „Punkte an Klasse senden“ gehören zum angemeldeten Benutzer. User B sieht
  User A’s Codes nicht; Wechseln lädt den Klasse-Reiter neu. Die Leiste zeigt
  nur die aktive Klasse des aktuellen Benutzers. Vorhandene gemeinsame Codes
  wandern einmal zum aktuellen bzw. ersten Benutzer. Die WLAN-Datei speichert
  weiter alle Benutzer, die Oberfläche nur den eigenen Stand.

### Behoben

- **Löschen bleibt gelöscht:** Ein lokal gelöschter Klassencode kommt beim
  WLAN-Abgleich nicht wieder. Die App schreibt einen Tombstone, speichert,
  und löscht dann online. Tablets, die den Tombstone sehen, entfernen den
  Code ebenfalls.
- **Stände aktualisieren** läuft nach dem Löschen nicht in einer GET-Schleife
  (ein Abruf pro Listenänderung, In-Flight-Sperre, Pause nach 429).

## [0.1.14] – 2026-09-05

### Hinzugefügt

- **Aktive Klasse in der Leiste:** Neben dem Benutzernamen steht der Name der
  aktiven Klasse (aus den eigenen Codes, sonst der formatierte Klassencode).
  Ohne aktiven Code bleibt die Zeile leer.
- **Punkteprotokoll nach Zeitraum:** Tag / Woche / Monat / Schuljahr / Gesamt
  aus den lokalen Übungen (Europe/Berlin, Schuljahr 1. Aug.–31. Jul.) — unabhängig
  von der Online-Klassensumme.
- **Übertragene Klassenpunkte:** Beim Senden an den Klassencode legt Mathsachs
  ein lokales Protokoll an (Zeit, Code, Klassenname, Punkte). Das Protokoll zeigt
  die Summe und, wenn mehrere Codes genutzt wurden, die Aufteilung je Klasse —
  ebenfalls nach Tag / Woche / Monat / Schuljahr. Zählt schon beim Senden; ein
  späterer Netzfehler ändert die Übung nicht.

## [0.1.13] – 2026-09-05

### Behoben

- **Löschen** entfernt den Klassencode sofort aus **Eigene Codes** (und
  deaktiviert ihn lokal), auch wenn der Server mit 429 oder Netzwerkfehler
  antwortet. Die Liste bleibt nicht mit „Zu viele Anfragen“ und **Löschen**
  stehen. Ein kurzer Hinweis, falls der Server den Code noch haben kann.
- **Stände aktualisieren** läuft nicht mehr in einer GET-Schleife bei jeder
  Speicher-Benachrichtigung. Bei 429 eine Banner-Meldung und Pause, kein
  Entfernen des Eintrags. Nur bestätigtes `not_found` (404) löscht lokal.

### Geändert

- Cloudflare-Worker: GET-Limit 300/min, DELETE 30/min (vorher 120 / 8).
  POST-Punkte bleibt 60/min. Nach dem Update einmal `cloudflare/worker.js`
  in Cloudflare **Deploy**en.

## [0.1.12] – 2026-09-05

### Behoben

- **Eigene Codes:** Gelöschte oder unbekannte Klassencodes (Worker 404 /
  `not_found`) werden aus der lokalen Liste entfernt. War der Code aktiv,
  endet das Sammeln. **Aktivieren** prüft den Code zuerst per GET; fehlt er,
  bleibt kein Aktivieren übrig. Netzwerk-, Rate-Limit- und „nicht bereit“-
  Fehler lassen den Eintrag stehen.

## [0.1.11] – 2026-09-04

### Hinzugefügt

- **Klassencode löschen** in der App (Reiter Klasse). Löscht die Klassensummen
  online und den Eintrag auf dem Gerät. Schüler und Lehrkräfte brauchen dafür
  keinen Cloudflare-Account.
- **Klassencode teilen** in der Liste **Eigene Codes**: **Code kopieren**
  (Zwischenablage, Format `ABCD-2345`), **WhatsApp** und **Mail**. Auf Tablets
  mit Web Share API zusätzlich **Teilen**.

### Geändert

- Klare Trennung: **Klassencode** = in der App erzeugt; **Worker-Programm** =
  einmaliges Server-Skript nur für die Betreiber. Meldung, wenn noch das
  Cloudflare-Testprogramm läuft.

## [0.1.10] – 2026-09-04

### Hinzugefügt

- **Online-Klassencodes:** Im Reiter **Klasse** kann ein Klassencode mit
  Klassennamen erzeugt oder eingetragen werden. Punkte gehen nur nach
  ausdrücklichem Opt-in an die Klasse, und nur ein Code sammelt gleichzeitig.
  Stände: Tag / Woche / Monat / Schuljahr (1. Aug.–31. Jul., Zeitzone
  Europe/Berlin, Serverzeit). Online liegen nur Klassenname und Summen — keine
  Vornamen, keine Geräte-IDs. Der Code ist das Geheimnis.
- **Cloudflare Worker** in [`cloudflare/worker.js`](cloudflare/worker.js):
  einmal in dash.cloudflare.com unter Edit Code einfügen und Deploy klicken
  (KV-Bindung `CLASSES`). Bis dahin zeigt die App eine deutsche Fehlermeldung.

## [0.1.9] – 2026-09-04

### Hinzugefügt

- **Gemeinsame Benutzer und Punkte über WLAN:** Die Desktop-App speichert
  Benutzerliste und Punkteprotokoll auf dem PC. Tablets, die die App im
  Browser über den WLAN-Zugang öffnen, sehen dieselben Namen und Punkte.
  Änderungen (neuer Benutzer, Übung, Klausur) erscheinen auf den anderen
  Geräten, solange Mathsachs läuft — ohne Neustart.

## [0.1.8] – 2026-09-04

### Hinzugefügt

- **WLAN-Zugang in der Desktop-App:** Solange Mathsachs auf einem Rechner
  läuft, startet sie einen lokalen Webserver (Port 4747, bei Belegung der
  nächste freie Port). Tablets und Handys im **selben WLAN** öffnen die
  Übungs-App im Browser unter `http://<Rechner-IP>:4747/`. Die Adresse und ein
  QR-Code stehen in der App. Klausur-Links/QR-Codes nutzen diese WLAN-Adresse,
  damit sie auf dem Tablet funktionieren. Die App muss geöffnet bleiben;
  es gibt kein Passwort (nur Geräte im lokalen Netz).

## [0.1.7] – 2026-09-04

### Behoben

- **Ideenmelder-Betreff:** Tippfehler *Übeungsprogramm* korrigiert zu
  *Übungsprogramm*. Der mailto-Betreff lautet jetzt
  *Idee / Feedback zum Mathsachs Übungsprogramm.*

## [0.1.6] – 2026-09-04

### Behoben

- **Windows-Auto-Update (HTTP 404):** Der NSIS-Installer hieß bisher
  `Mathsachs Setup x.y.z.exe` (Leerzeichen). `electron-updater` schreibt in
  `latest.yml` den Namen mit Bindestrichen (`Mathsachs-Setup-x.y.z.exe`),
  GitHub macht aus Leerzeichen Punkte (`Mathsachs.Setup.x.y.z.exe`). Der
  Download schlug deshalb fehl. Die Artefaktnamen sind jetzt fest ohne
  Leerzeichen, damit Dateiname, `latest.yml` und GitHub-Asset
  übereinstimmen.

## [0.1.5] – 2026-09-04

### Hinzugefügt

- **Impressum** in der App (Fußzeile) und in der README: Linus und Matthias
  Ulrich, Große Wallstraße 42, 04509 Delitzsch,
  info@my-smart-home-support.de.
- **MIT-Lizenz**: Datei [`LICENSE`](LICENSE) (Copyright 2026 Linus und Matthias
  Ulrich), Abschnitt in der README und vollständiger Lizenztext in der App.
- **Ideenmelder**: Schaltfläche „Idee / Feedback“ öffnet das Standard-Mailprogramm
  (`mailto:`) an info@my-smart-home-support.de mit dem Betreff
  *Idee / Feedback zum Mathsachs Übeungsprogramm.*

## [0.1.4] – 2026-09-04

### Hinzugefügt

- **Update-Hinweis aus GitHub Releases**: Die App prüft die öffentlichen GitHub
  Releases auf eine neuere Version und zeigt ein Banner mit Versionsnummer,
  Release-Notes und einem Download-Link zur passenden Datei.
  In der Desktop-App kann das Update über `electron-updater` heruntergeladen
  und installiert werden (Fallback: Installer-Link der Plattform).

## [0.1.3] – 2026-09-04

### Hinzugefügt

- **Übungsklausur per Code (Variante A)**: Lehrkräfte wählen Themen aus dem
  Lehrplan voraus, picken konkrete Vorschlagsaufgaben per Checkbox und erzeugen
  einen kompakten, seed-basierten Klausur-Code plus teilbaren Link
  (`#klausur=…`) und QR-Code — zum Verteilen z. B. über die Schulwebseite.
- **Klausur schreiben**: Schülerinnen und Schüler lösen den Code ein (oder
  öffnen den Link), rechnen die festen Aufgaben durch und erhalten eine
  automatische Auswertung mit Lösung und Erklärung je Aufgabe.
- **Ähnliche Aufgabe üben** nach der Auswertung (gleiches Thema, neuer Seed).
- Das Datenschema ist vorbereitet für eine spätere **Variante B** (eingebetteter
  Aufgabeninhalt).

## [0.1.2] – 2026-09-03

### Hinzugefügt

- **Lehrpläne Klasse 7 bis Jahrgangsstufe 11/12** als nachladbare Module
  (Gymnasium Mathematik, Sachsen):
  - **Klasse 7** – Geometrie in der Ebene, Arbeiten mit rationalen Zahlen,
    Prismen und Pyramiden, Darstellen von Daten.
  - **Klasse 8** – Terme und Gleichungen, Zufallsversuche, Funktionen und
    lineare Gleichungssysteme, Ähnlichkeit, heuristische Strategien.
  - **Klasse 9** – Funktionen und Potenzen, Kreise/Zylinder/Kugeln,
    rechtwinklige Dreiecke (Pythagoras, Trigonometrie), Auswerten von Daten.
  - **Klasse 10** – Wachstum und Zinsrechnung, diskrete Zufallsgrößen,
    algebraisches Lösen geometrischer Probleme, funktionale Zusammenhänge.
  - **Jahrgangsstufe 11/12 (Grundkurs)** – Differential- und Integralrechnung,
    Vektoren, binomialverteilte Zufallsgrößen (bewusst auf wenige, eindeutig
    prüfbare Themen begrenzt).
- **Themen-Suchfunktion**: Stichwortsuche über die Themen der geladenen Klassen
  – case-insensitive, teilstring-basiert, umlaut-tolerant (z. B. „Fläche“ ↔
  „flaeche“) und über kuratierte Schlagwörter je Thema. Treffer werden mit
  Klasse und Lernbereich sowie den Aktionen „Üben“/„Übungsblatt“ angezeigt.
  Passt ein Stichwort zu einer verfügbaren, aber nicht geladenen Klasse, erscheint
  der Hinweis „In Klasse X verfügbar – im Reiter ‚Lehrpläne‘ laden“.
- **Einheiten-Umrechnen-Themen**: Länge (mm/cm/dm/m/km), Flächeninhalt
  (mm²/cm²/dm²/m²/a/ha/km²), Volumen (mm³/cm³/dm³/m³/l/ml), Masse (mg/g/kg/t)
  und Zeit (s/min/h) mit eindeutiger Lösung und Erklärung über den
  Umrechnungsfaktor – zugeordnet zu Klasse 5 (alle Größen) und Klasse 6
  (Flächen- und Längeneinheiten).

## [0.1.1] – 2026-09-03

### Hinzugefügt

- **Lehrplan Klasse 5** (Gymnasium Mathematik, Sachsen) als nachladbares Modul:
  natürliche Zahlen, gemeine Brüche und Dezimalzahlen, Lagebeziehungen,
  Rechtecke und Quader sowie Sachaufgaben aus dem Alltag.

## [0.1.0] – 2026-09-03

### Hinzugefügt

- **Erststart von Mathsachs**: lehrplanorientiertes Übungsprogramm für das
  Gymnasium in Sachsen mit **Klasse 6** (Brüche, Zuordnungen, Dreiecke und
  Vierecke, Prismen, Anteile).
- **Direktes Üben** mit sofortiger Auswertung, Schritt-für-Schritt-Erklärungen
  und druckbaren **Übungsblättern** inklusive Lösungsteil.
- **Mehrbenutzer-Punkteprotokoll** je Thema.
- **Desktop-App** (Electron) mit Installern für Windows, macOS und Linux.
- **Cloud-Agent-Umgebung** (`.cursor/environment.json`) für die Entwicklung.

[Unreleased]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.42...HEAD
[0.1.42]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.41...v0.1.42
[0.1.41]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.40...v0.1.41
[0.1.40]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.39...v0.1.40
[0.1.39]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.38...v0.1.39
[0.1.38]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.37...v0.1.38
[0.1.37]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.36...v0.1.37
[0.1.36]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.35...v0.1.36
[0.1.35]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.34...v0.1.35
[0.1.34]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.33...v0.1.34
[0.1.33]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.32...v0.1.33
[0.1.32]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.31...v0.1.32
[0.1.31]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.30...v0.1.31
[0.1.30]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.29...v0.1.30
[0.1.29]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.28...v0.1.29
[0.1.28]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.27...v0.1.28
[0.1.27]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.26...v0.1.27
[0.1.26]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.25...v0.1.26
[0.1.25]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.24...v0.1.25
[0.1.24]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.23...v0.1.24
[0.1.23]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.22...v0.1.23
[0.1.22]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.21...v0.1.22
[0.1.21]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.20...v0.1.21
[0.1.20]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.19...v0.1.20
[0.1.19]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.18...v0.1.19
[0.1.18]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.17...v0.1.18
[0.1.17]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.16...v0.1.17
[0.1.16]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.15...v0.1.16
[0.1.15]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.14...v0.1.15
[0.1.14]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.13...v0.1.14
[0.1.13]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.12...v0.1.13
[0.1.12]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.11...v0.1.12
[0.1.11]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.10...v0.1.11
[0.1.10]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.9...v0.1.10
[0.1.9]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.8...v0.1.9
[0.1.8]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/MatthiasUlrich1/Mathsachs/releases/tag/v0.1.0
