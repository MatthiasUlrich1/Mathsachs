# Lehrplan-Mapping: Oberschule Sachsen · Mathematik (Pakete oberschule-sachsen-hs und oberschule-sachsen-rs)

Erstellt von Agent E4b (rein lesend; Quellcode unverändert). Stand: 2026-11-16.

## Quelle und Prüfstatus

- Dokument: **Lehrplan Oberschule Mathematik**, Sächsisches Staatsministerium für Kultus, Fassung **2004/2009/2019** (überarbeitete Lehrpläne in Kraft seit 1. August 2019). Teil Fachlehrplan Mathematik, Klassenstufen 5-6 gemeinsam; **Hauptschulbildungsgang Kl. 7-9**; **Realschulbildungsgang Kl. 7-10**; je Klassenstufe Lernbereiche mit Pflichtcharakter und 3 Wahlbereiche.
- Download-URL (Sächsisches Schulportal, Lehrplandatenbank): https://www.schulportal.sachsen.de/lplandb/lehrplan/file/67/LBki8uwfGrSWPImJne29  (Herausgeber-Hinweis im PDF: https://www.schulportal.sachsen.de/lplandb/)
- **PDF lesbar: ja** (693,7 KB, Text extrahierbar; alle Lernbereiche, Zeitrichtwerte und Inhalte Kl. 5-10 geprüft). Seitenzahlen "S." sind aus den Seitenfüßen des PDFs abgeleitet (ca. +-1 Seite).
- Alle Lehrplan-Aussagen stammen aus diesem PDF; nichts wurde ergänzt. Hinweis: HS Kl. 9 und RS Kl. 7-8, Kl. 10 tragen teils Fußzeilen 2004/2009 (Teilüberarbeitung).
- Begriffe: LP = Lehrplan, LB = Lernbereich, "Differenzierungshinweis" = im LP nur als Hinweis (nicht verbindlicher Kerninhalt).

## Ergebnis auf einen Blick

| Profil | Pack-Themen | spielbar vorher | spielbar nachher | Abweichungen (D) |
|---|---|---|---|---|
| Hauptschulbildungsgang (oberschule-sachsen-hs) | 204 | 117 | 117 | siehe unten |
| Realschulbildungsgang (oberschule-sachsen-rs) | 247 | 142 | 129 | siehe unten |

"Vorher" enthält Doppelnutzungen desselben Master-Themas (bis 4x pro Pack); "nachher" ist dublettenfrei (siehe Regeln). Ein Master-Thema steht pro Pack höchstens einmal; einzige dokumentierte Ausnahme: HS K7 LB1 (LP verlangt ausdrücklich Wiederholung/Vernetzung der Klassenstufen 5 und 6): `os-hs-k7-lb1-flaeche` wiederholt `lb4-flaeche-zusammengesetzt` aus K5. Neu-Themen sind in ihren Parent integriert (Master-Quelle = Parent-ID, Neu-Anteil mitgebracht); die Waisen k5-/k6-umrechnen-* siehe D25.

## Abweichungen Outline <-> Lehrplan (und Mapping-/Master-Befunde)

Strukturell stimmen Lernbereichstitel, Reihenfolge, Wahlbereiche und Zeitrichtwerte der Outline (oberschulePacks.ts) mit dem LP überein, mit Ausnahme von D1. Befunde (Art: LP = Outline weicht vom LP ab; Mapping/Master/custom = technischer Befund):

| # | Art | Stelle | Befund | Empfehlung | LP-Quelle |
|---|---|---|---|---|---|
| D1 | LP | K5/K6 gemeinsam | Zeitrichtwerte K6: Outline LB2 = 25 und LB3 = 30 Ustd., LP LB2 = 30 Ustd. (explizit), LB3 = 25 (Rest, PDF-Spaltenlayout mehrdeutig) | Ustd. tauschen: lb2 = 30, lb3 = 25 (rein informativ) | Kl. 6, LB 2, S. 14 |
| D2 | LP | K5 LB4 | os-k5-lb4-achsen (Punktsymmetrie) und os-k5-lb4-drehung (Drehungen) stehen nicht im LP K5 LB4 (nur Spiegelung, Verschiebung, Symmetrieachse). Punktsymmetrie/Drehsymmetrie kommen HS K8 LB3 bzw. Wahlbereich | Themen als Outline lassen oder streichen; kein Master zuordnen | Kl. 5, LB 4, S. 10 |
| D3 | LP | K6 LB1 | os-k6-lb1-kuerzen heißt "Erweitern und Kürzen", daneben os-k6-lb1-erweitern: inhaltlich doppelt | Titel von os-k6-lb1-kuerzen auf "Kürzen" ändern | Kl. 6, LB 1, S. 13 |
| D4 | LP | HS K7 LB2 / RS K7 LB1, K8 LB1 | Kleinere Lücken in der Outline: Tabellenkalkulation (HS K7 LB2), Kubikwurzel (RS K9 LB2), Systematisieren von Funktionen und Herleiten von Formeln (RS K10), Kreiszahl als nichtrationale Zahl (RS K8 LB3), Kreisring/Hohlzylinder-Darstellung teils nur im Titel | Optional als Outline-Themen ergänzen (kein Master vorhanden, daher ohne Spielbarkeit); kein Handlungsdruck | siehe jeweiliger LB |
| D5 | LP | K6 LB5 | os-k6-lb5-anteil-prozent: Prozentrechnung steht im LP erst in Kl. 7 (HS LB2 / RS LB1); in K5 nur "Einblick Prozentschreibweise" | Kein Master in K6; Master lb5-anteil-prozent/lb1-prozent nach K7 verschoben | Kl. 5 LB 2 S. 9; HS Kl. 7 LB 2 S. 19; RS Kl. 7 LB 1 S. 29 |
| D6 | LP | K6 LB2 | os-k6-lb2-anteil ("Anteil einer Größe berechnen") steht nicht im LP K6 LB2 (Zuordnungen, Dreisatz) | Titel zu "Bruchteile in Sachaufgaben" (K6 LB1) umbenennen oder streichen; Master lb5-anteil-groesse geht nach K7 | Kl. 6, LB 2, S. 14 |
| D7 | LP | K6 LB3 | os-k6-lb3-winkelsumme-viereck ist im LP K6 LB3 nicht ausdrücklich genannt (Innenwinkelsatz nur für Dreiecke) | belassen (Gym-Master vorhanden), Hinweis in Outline | Kl. 6, LB 3, S. 14 |
| D8 | Mapping | OS_GENERATOR_MAP | Aktuelle Map nutzt dasselbe Master-Thema mehrfach im Pack (HS: 20 Master-Themen, RS: 21; z. B. lb4-wuerfelnetz 4x, lb5-anteil-prozent 3x, lb2-mittelwert 3x) | Map gemäß JSON-Blöcken unten neu aufbauen (1:n, dublettenfrei) | - |
| D9 | LP | HS K7 LB4, RS K7 LB4 | os-hs-k7-lb4-winkelsumme / os-rs-k7-lb4-winkelsumme (Innenwinkelsumme Vieleck) nicht im LP K7 LB4. HS: erst K8 LB3 (regelmäßige Vielecke, Innenwinkelsumme); RS: K10 LB1 (Winkelgrößen in Vielecken) | In K7 keinen Master; Master jeweils in K8 (HS) bzw. K10 (RS) | HS Kl. 8 LB 3 S. 23; RS Kl. 10 LB 1 S. 40 |
| D10 | LP + custom | HS/RS K7 LB3 | Custom osQ1CoordinatePlace beschränkt auf den 1. Quadranten; LP verlangt "Verwenden von vier Quadranten" und Eintragen/Ablesen von Punktkoordinaten (K7). Custom bleibt, aber der LP-Auftrag ist damit nicht erfüllt. (Beschränkung auf Q1 ist nur in K5 richtig) | Custom beibehalten und lb3-koordinaten-eintragen/-ablesen (4 Quadranten) beimischen (in den JSON-Blöcken als Quellen eingetragen); Entscheidung E3 | HS Kl. 7 LB 3 S. 19-20; RS Kl. 7 LB 3 S. 29-30 |
| D11 | LP | HS K7 LB3 | HS lernt im Kopf Vervielfachen/Teilen nur mit natürlicher Zahl; Multiplizieren/Dividieren/Potenzieren rationaler Zahlen ist nur Differenzierungshinweis. Master k7-lb2-mul/div-rational deckt volle rationale Zahlen ab | maxDifficulty 1 und Variantenfilter "Faktor/Divisor natürliche Zahl" in E3 prüfen | HS Kl. 7 LB 3 S. 19 |
| D12 | LP | HS K9 LB1 | HS: nur Sinus; Kosinus/Tangens nur Differenzierung. Master k9-lb3-trig-wert (sin/cos/tan) breiter | Variantenfilter nur Sinus; sonst bei Mischung dokumentierte Abweichung | HS Kl. 9 LB 1 S. 25 |
| D13 | LP | HS K9 LB3 | Quadratische Funktionen/Gleichungen nur Differenzierungshinweis; Einblick nur y = x², y = a·x², y = 1/x. Rechnerisches Schnittpunktbestimmen nur Einblick | k9-lb1-quadrat-wert (difficulty 2) nur als Einblick-Variante; k8-lb3-lgs (difficulty 3) ausgeschlossen; k9-lb1-scheitel ausgeschlossen | HS Kl. 9 LB 3 S. 26 |
| D14 | LP | HS K8 LB1 | Zinseszins nur Differenzierungshinweis (HS), RS dagegen Pflicht (K7 LB1) | HS: Thema behalten, als Differenzierung kennzeichnen, maxDifficulty 2 | HS Kl. 8 LB 1 S. 22 |
| D15 | LP | RS K9 LB3 | os-rs-k9-lb3-potenz-prod/-quot: Potenzgesetze stehen nicht im RS-LP K9 (K10 LB2 hat Potenzfunktionen y = a·x^n, kein Potenzgesetz-Block) | Themen streichen bzw. nicht mappen (Master k9-lb1-potenz-* bleiben ungenutzt) | RS Kl. 9 LB 3 S. 37 |
| D16 | LP | HS K9 LB2, RS K9 LB2 | os-hs-k9-lb2-zylinder / os-rs-k9-lb2-zylinder: Kreiszylinder ist HS K8 LB4 bzw. RS K8 LB3; K9 LB2 behandelt Pyramide/Kreiskegel (RS: Kugel) | K9-Zylinder ohne Master; Master nur in K8 | HS Kl. 8 LB 4 S. 23; RS Kl. 8 LB 3 S. 33-34; Kl. 9 LB 2 |
| D17 | LP | RS K10 LB1 | os-rs-k10-lb1-hyp (Pythagoras) steht nicht in K10 LB1 (dort: Systematisieren, Sinus-/Kosinussatz, Flächen in beliebigen Dreiecken). Für Sinus-/Kosinussatz existiert kein Master (Lücke) | hyp/trig ohne Master lassen; Lücke an Master-Ausbau melden (Task E-extern) | RS Kl. 10 LB 1 S. 40 |
| D18 | LP | RS K10 LB2 | os-rs-k10-lb2-zinseszins und -zunahme: nicht in K10 LB2 (Potenz-, Exponential-, Sinusfunktion); Zinseszins ist RS K7 LB1 | Ohne Master; Heimat K7 | RS Kl. 10 LB 2 S. 41; Kl. 7 LB 1 S. 29 |
| D19 | LP | RS K10 LB4 | os-rs-k10-lb4-zinsen/-kugel/-pyramide wiederholen K7-K9-Inhalte; LP K10 LB4 fordert Pyramiden- und Kegelstumpf, Herleiten von Formeln, Erwartungswerte (kein Master für Stumpf) | Ohne Master (Doppelnutzung vermeiden), Lücke Kegelstumpf melden | RS Kl. 10 LB 4 S. 41-42 |
| D20 | Mapping | RS K10 Wahl 3 | Vermessungsprobleme nennt Strahlensatz, Pythagoras, Trigonometrie (LP korrekt), aber Master dafür in K8/K9 verbraucht | Ohne Master | RS Kl. 10 Wahl 3 S. 42 |
| D21 | LP | HS K9 LB2 | os-hs-k9-lb2-formel-umstellen: Formelumstellen ist HS K8 LB2 (LP K9 LB2: "Umstellen der Formeln" nur in Anschauung zu Pyramide) | Ohne Master | HS Kl. 9 LB 2 S. 26; Kl. 8 LB 2 S. 23 |
| D22 | Mapping | K5 | os-k5-lb3-wuerfel und os-k5-lb1-gleichung nutzen Master aus K6/K7 (lb4-wuerfelnetz, k7-lb2-gleichung-add) - inhaltlich passend, nur grade-fremde IDs | Beibehalten (documented) | Kl. 5, LB 1/3 |
| D23 | LP | RS K7 LB2 / K8 LB5 | Laplace-Wahrscheinlichkeit (k8-lb2-laplace-*) war in RS K7 LB2 und K8 LB5 doppelt; LP K7: nur Begriff Wahrscheinlichkeit/Stabilisierung relativer Häufigkeit, K8 LB5: kombinatorisches Zählen, Baumdiagramm, Pfadregeln | Laplace-Master nur in K8 LB5; K7 nur Häufigkeit | RS Kl. 7 LB 2 S. 29; Kl. 8 LB 5 S. 34 |
| D24 | Master | math5 / math6 | Doppelte Master-IDs: lb4-volumen-quader und lb4-oberflaeche-quader existieren in math5.ts und math6.ts; der Katalog (gymGeneratorCatalog) nimmt das erste Vorkommen (math5), K6 würde also identische K5-Aufgaben zeigen | math6-IDs umbenennen (z. B. k6-lb4-volumen-quader), dann K6-Thema mappen; bis dahin K6 volumen-quader blockiert | - |
| D25 | Master | Neu-Waisen | k5-umrechnen-laenge/-masse/-zeit/-flaeche/-volumen und k6-umrechnen-laenge/-flaeche existieren nur als Neu-Aufgabenbänke ohne Parent in mathN.ts: nach dem Merge gibt es keinen Parent. Die K5-Quellen werden hier trotzdem zugeordnet (Pack-Themen vorhanden) | E1 muss Waisen zu eigenständigen (released) Topics machen oder Parent anlegen, sonst brechen os-k5-lb2-laenge/-masse/-zeit, os-k5-lb3-flaeche-eh/-volumen-eh | - |
| D26 | custom | HS K7 LB1+LB4, K6 LB4, RS K7 LB4 | Derselbe Custom-Generator osPrismNetz bedient in HS K7 gleich zwei Themen (lb1-netze, lb4-netze) und zusätzlich K6-darstellen / RS K7-darstellen: identische Aufgaben in Folge möglich | Custom bleibt; Round-Dedup (contentId) greift pro Runde, nicht über Themen: ggf. Seed-Offset je Pack-Thema | HS Kl. 7 LB 1/LB 4 S. 18/20 |
| D27 | LP-intern | RS K10 LB1 | LP-Übersicht nennt "Dreiecke und Vierecke", Lernbereichstitel "Dreiecke und Vielecke"; Outline folgt dem Lernbereichstitel | keine Änderung | RS Kl. 10 LB 1 S. 5/40 |

Anzahl: **27** Befunde, davon 21 echte Abweichungen Outline <-> LP (D1-D7, D9-D19, D21, D23, D27, ggf. mit custom/intern), der Rest Mapping-/Master-/Custom-Befunde.

## Profil 1: Hauptschulbildungsgang (oberschule-sachsen-hs)

Regeln: Master nur mit difficulty <= 2 (Default maxDifficulty 2). K5/K6 sind gemeinsam für HS und RS (Tabellen identisch in beiden Profilen). Nicht im HS-LP gelehrt: Potenzgesetze, quadratische Gleichungen, Scheitelform, rechnerisches LGS, Strahlensätze, Kosinus/Tangens (nur Differenzierung), Laplace.

#### Klasse 5 (HS) - 35 von 50 Themen spielbar

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `os-k5-lb1-runden` | Veranschaulichen, Schätzen, Runden, Vergleichen und Ordnen natürlicher Zahlen | `lb1-runden-natuerlich` | 2 | 1:1 Rundenübung natürlicher Zahlen | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-potenz` | Potenzschreibweise und Zehnerpotenzen | `lb1-potenzieren` | 2 | Quadrat- und Zehnerpotenzen; deckt os-k5-lb1-quadrat inhaltlich mit ab | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-addition` | Addieren natürlicher Zahlen | `lb1-addition` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-subtraktion` | Subtrahieren natürlicher Zahlen | `lb1-subtraktion` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-multiplikation` | Multiplizieren natürlicher Zahlen | `lb1-multiplikation`, `lb1-schriftliches-rechnen` | 2 | LP: mündlich/halbschriftlich/schriftlich multiplizieren; schriftliches Rechnen (Kästchenpapier) ergänzt (neu) | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-division` | Schriftliche Division durch einstelligen Divisor | `lb1-schriftliche-division`, `lb1-division-rest` | 2 | LP: schriftliche Division durch einstelligen Divisor; Rest-Variante ergänzt (neu) | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-quadrat` | Quadratzahl und Quadratwurzel | — | — | Abgedeckt durch lb1-potenzieren (Quadrat- und Zehnerpotenzen) in os-k5-lb1-potenz; Wurzel ohne eigenen Master | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-gleichung` | Einfache Gleichungen und Ungleichungen inhaltlich lösen | `k7-lb2-gleichung-add` | 2 | K7-Master (x + a = b, difficulty 1) für inhaltliches Lösen einfacher Gleichungen; bleibt | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-teilbarkeit` | Teilbarkeit, Vielfache und Teiler | `lb1-teilbarkeit` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-primzahl` | Teilbarkeitsregeln und Primzahlen | `lb1-primzahl` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-null` | Null als kleinste natürliche Zahl | — | — | Reiner Wissensinhalt, kein Master | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-rechengesetze` | Rechenstrategien, Rechenvorteile und Rechengesetze | — | — | Kein Master für Rechengesetze/Strategien in K5 | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb2-anteil` | Erkennen und Darstellen gemeiner Brüche und Dezimalzahlen | `lb2-anteil-bruch`, `lb2-grafische-brueche` | 2 | LP: Erkennen und Darstellen gemeiner Brüche; lb2-anteil-bruch neu hier (war HS-K7, dort Dublette) | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-kuerzen` | Echte und unechte Brüche, Kürzen | `lb2-kuerzen` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-erweitern` | Erweitern und Umwandeln von Zehnerbrüchen und Dezimalzahlen | `lb2-erweitern` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-vergleichen` | Vergleichen, Ordnen und Abschätzen gemeiner Brüche | — | — | lb2-zahlenstrahl (Dezimalzahlen) passt besser zu K6-Zahlenstrahl; kein Bruchvergleich-Master in K5 (K6-lb1-vergleichen gehört zu K6) | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-runden-dez` | Runden von Dezimalzahlen | `lb2-runden-dezimal` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-dez-add-sub` | Dezimalzahlen addieren und subtrahieren | `lb2-dez-add-sub` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-dez-mult` | Vervielfachen mit einstelligen natürlichen Zahlen und Zehnerpotenzen | `lb2-dez-mult` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-dez-div` | Teilen durch einstellige natürliche Zahlen und Zehnerpotenzen | `lb2-dez-div` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-prozent` | Prozentschreibweise für bequeme Anteile | — | — | LP K5: nur Einblick Prozentschreibweise; Master lb1-prozent liegt in K7 (HS: Anteile als Prozent, RS: Prozentrechnung) - keine Doppelung im Pack | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-mittelwert` | Arithmetisches Mittel | `lb2-mittelwert` | 2 | K5-Master; K6 nutzt den K7-Master k7-lb4-mittelwert (kein Doppelt im Pack) | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-laenge` | Einheiten umrechnen: Länge | `k5-umrechnen-laenge`, `lb2-ordnen-einheiten` | 2 | k5-umrechnen-laenge existiert nur als Neu-Aufgabenbank (Waise, siehe Coverage); Größen ordnen ergänzt | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-masse` | Einheiten umrechnen: Masse | `k5-umrechnen-masse` | 2 | Neu-Waise (kein Parent in math5.ts) | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-zeit` | Einheiten umrechnen: Zeit | `k5-umrechnen-zeit` | 2 | Neu-Waise (kein Parent in math5.ts) | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb3-koordinaten` | Koordinaten und Koordinatensystem (erster Quadrant) | **custom (bleibt)** | 2 | custom (bleibt): OS_CUSTOM_GENERATORS, erster Quadrant laut LP korrekt | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb3-lage` | Lagebeziehungen: parallel, senkrecht, schneiden einander | `lb3-strecken-bezeichnung` | 2 | LP K5 LB3: parallel/senkrecht/schneiden; Strecke/Gerade/Halbgerade als nächste Quelle (neu) | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb3-winkelarten` | Messen und Zeichnen von Winkeln, Winkelarten | `lb3-winkelarten` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb3-winkel-erg` | Winkel zu 90° oder 180° ergänzen | `lb3-winkel-ergaenzung` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb3-wuerfel` | Würfel skizzieren, Körpernetze und Schrägbild | `lb4-wuerfelnetz` | 2 | math6-ID, inhaltlich K5 (Würfelnetz); K6-Darstellen bleibt custom | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb3-umfang` | Umfang als Summe von Seitenlängen | `lb4-umfang-rechteck`, `lb4-umfang-zusammengesetzt` | 2 | LP K5 LB3: Umfang/Fläche an in Rechtecke zerlegbaren Figuren | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb3-flaeche` | Flächeninhaltsformel für das Rechteck | `lb4-flaeche-rechteck`, `lb4-flaeche-zusammengesetzt`, `lb5-sachaufgabe-flaeche` | 2 | LP K5 LB3: Zerlegen/Ergänzen; Sachaufgabe Fläche/Umfang ergänzt | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb3-flaeche-eh` | Einheiten umrechnen: Flächeninhalt | `k5-umrechnen-flaeche` | 2 | Neu-Waise (kein Parent in math5.ts) | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb3-oberflaeche` | Oberfläche als zusammengesetzte Fläche | `lb4-oberflaeche-quader` | 2 | ID-Kollision math5/math6 (D24): K5 bekommt die Quelle, K6 weicht aus | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb3-volumen-wuerfel` | Volumenformel für den Würfel | `lb4-volumen-quader` | 2 | ID-Kollision math5/math6 (D24): K5 bekommt die Quelle, K6 blockiert bis Umbenennung | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb3-volumen-eh` | Einheiten umrechnen: Volumen | `k5-umrechnen-volumen` | 2 | Neu-Waise (kein Parent in math5.ts) | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb4-spiegelung` | Spiegelungen und Verschiebungen, Symmetrieachse | `lb3-achsensymmetrie` | 2 | 1:1 (Geradenspiegelung/Symmetrieachse) | LP OS Mathematik 2019: Kl. 5, LB 4, S. 10 |
| `os-k5-lb4-deckung` | Zeichnen und Analysieren symmetrischer sowie deckungsgleicher Figuren | — | — | Kein Master für deckungsgleiche Figuren zeichnen | LP OS Mathematik 2019: Kl. 5, LB 4, S. 10 |
| `os-k5-lb4-drehung` | Drehungen und Symmetrie in Mustern | — | — | Drehungen nicht im LP K5 LB4 (D2); kein Master | LP OS Mathematik 2019: Kl. 5, LB 4, S. 10 |
| `os-k5-lb4-achsen` | Achsen- und Punktsymmetrie erkennen | — | — | Punktsymmetrie nicht im LP K5 LB4 (D2); lb3-punktsymmetrie anderweitig verwendet bzw. ungenutzt | LP OS Mathematik 2019: Kl. 5, LB 4, S. 10 |
| `os-k5-lb4-verschiebungsweite` | Verschiebungsrichtung und Verschiebungsweite | `lb3-verschiebung` | 2 | LP K5 LB4: Verschiebungsrichtung/-weite (neu) | LP OS Mathematik 2019: Kl. 5, LB 4, S. 10 |
| `os-k5-lbw1-zahlzeichen` | Zahlzeichen verschiedener Epochen und Kulturkreise | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 5, Wahlbereich 1, S. 11 |
| `os-k5-lbw1-abakus` | Darstellung und Rechnen mit Abakus oder Rechenpfennigen | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 5, Wahlbereich 1, S. 11 |
| `os-k5-lbw1-stellenwert` | Stellenwertsysteme im Vergleich | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 5, Wahlbereich 1, S. 11 |
| `os-k5-lbw2-daten` | Erfassen und Darstellen von Daten (Urliste, Tabelle, Säulendiagramm) | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 5, Wahlbereich 2, S. 11 |
| `os-k5-lbw2-kombinatorik` | Einfache kombinatorische Zählstrategien | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 5, Wahlbereich 2, S. 11 |
| `os-k5-lbw2-mittel` | Mittelwert aus Klassendaten | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 5, Wahlbereich 2, S. 11 |
| `os-k5-lbw3-angebote` | Angebote vergleichen, Zeitpläne und Fahrtkosten | `lb5-gesamtpreis` | 2 | Wahlbereich Klassenfahrt: Gesamtpreis/Angebote (neu) | LP OS Mathematik 2019: Kl. 5, Wahlbereich 3, S. 12 |
| `os-k5-lbw3-budget` | Budget und Stückkosten berechnen | `lb5-mehrstufig`, `lb5-teilen` | 2 | Budget und Stückkosten (neu) | LP OS Mathematik 2019: Kl. 5, Wahlbereich 3, S. 12 |
| `os-k5-lbw3-zeit` | Fahrzeiten und Zeitpläne | — | — | Fahrzeiten/Zeitpläne: kein Master | LP OS Mathematik 2019: Kl. 5, Wahlbereich 3, S. 12 |

#### Klasse 6 (HS) - 31 von 48 Themen spielbar

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `os-k6-lb1-erweiterung` | Notwendigkeit einer Zahlenbereichserweiterung, Mengenbegriff | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-zahlenstrahl` | Gebrochene Zahlen am Zahlenstrahl veranschaulichen | `lb2-zahlenstrahl` | 2 | LP K6 LB1: Veranschaulichen am Zahlenstrahl (neu) | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-negative-ausblick` | Ausblick: negative Zahlen in Sachproblemen | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-kuerzen` | Erweitern und Kürzen | `lb1-kuerzen` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-erweitern` | Erweitern gemeiner Brüche | `lb1-erweitern` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-bruch-dez` | Umwandeln gemeiner Brüche in Dezimalzahlen und umgekehrt | `lb1-bruch-dezimal` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-vergleichen` | Vergleichen und Ordnen gebrochener Zahlen | `lb1-vergleichen` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-add-sub` | Addieren und Subtrahieren gebrochener Zahlen | `lb1-add-sub-brueche` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-mult` | Multiplizieren gebrochener Zahlen | `lb1-mult-brueche` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-div` | Dividieren gebrochener Zahlen | `lb1-div-brueche` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-dez-add-sub` | Dezimalzahlen addieren und subtrahieren | `lb1-dez-add-sub` | 2 | 1:1 (math6-ID, distinkt von K5 lb2-dez-add-sub) | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-dez-mult` | Dezimalzahlen multiplizieren | `lb1-dez-mult` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-dez-div` | Dezimalzahlen dividieren | `lb1-dez-div` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-runden` | Überschlagen, Abschätzen und Runden | `lb1-runden` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-mittelwert` | Arithmetisches Mittel | `k7-lb4-mittelwert` | 2 | LP K6 LB1: arithmetisches Mittel; K7-Master, damit lb2-mittelwert nur in K5 liegt | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-verhaeltnis` | Verhältnisgleichungen | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb2-arten` | Eindeutige, eineindeutige und mehrdeutige Zuordnungen | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Kl. 6, LB 2, S. 14 |
| `os-k6-lb2-prop` | Direkt proportionale Zuordnung (Dreisatz) | `lb2-proportional` | 2 | 1:1 Dreisatz direkt | LP OS Mathematik 2019: Kl. 6, LB 2, S. 14 |
| `os-k6-lb2-antiprop` | Indirekt proportionale Zuordnung | `lb2-antiproportional` | 2 | 1:1 Dreisatz indirekt | LP OS Mathematik 2019: Kl. 6, LB 2, S. 14 |
| `os-k6-lb2-anteil` | Anteil einer Größe berechnen | `lb1-sachaufgabe-bruch` | 2 | Titel nicht im LP K6 LB2 (D6); Bruchteil-Sachaufgaben als Ersatzquelle, lb5-anteil-groesse geht nach K7 | LP OS Mathematik 2019: Kl. 6, LB 2, S. 14 |
| `os-k6-lb2-darstellung` | Darstellung in Wort, Tabelle, Koordinatensystem und Gleichung | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Kl. 6, LB 2, S. 14 |
| `os-k6-lb3-nebenwinkel` | Nebenwinkelsatz | `k7-lb1-nebenwinkel` | 2 | LP K6 LB3: Nebenwinkelsatz (K7-Master) | LP OS Mathematik 2019: Kl. 6, LB 3, S. 14-15 |
| `os-k6-lb3-scheitel` | Scheitelwinkelsatz und Stufen- bzw. Wechselwinkel | `k7-lb1-scheitelwinkel` | 2 | LP K6 LB3: Scheitel-/Stufen-/Wechselwinkel (K7-Master) | LP OS Mathematik 2019: Kl. 6, LB 3, S. 14-15 |
| `os-k6-lb3-innenwinkel` | Innenwinkelsatz für Dreiecke | `lb3-winkel-dreieck` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 3, S. 14-15 |
| `os-k6-lb3-einteilung` | Einteilung der Dreiecke nach Seiten und Winkeln | `k7-lb1-basiswinkel` | 2 | Dreiecke nach Seiten und Winkeln; Basiswinkel gleichschenklig als Näherung (neu) | LP OS Mathematik 2019: Kl. 6, LB 3, S. 14-15 |
| `os-k6-lb3-kongruenz` | Kongruenzsätze, Seiten-Winkel-Relation und Dreiecksungleichung | `lb3-kongruenzsatz` | 2 | 1:1; RS-K8 Kongruenz bekommt keine zweite Quelle | LP OS Mathematik 2019: Kl. 6, LB 3, S. 14-15 |
| `os-k6-lb3-flaeche-dreieck` | Flächeninhalt von Dreiecken (Grundseite und Höhe) | `lb3-flaeche-dreieck` | 2 | 1:1; K7/K10 ohne Doppelung | LP OS Mathematik 2019: Kl. 6, LB 3, S. 14-15 |
| `os-k6-lb3-parallelogramm` | Flächeninhalt von Parallelogramm, Drachenviereck und Trapez | — | — | Kein Master für Parallelogramm/Drachen/Trapez-Fläche | LP OS Mathematik 2019: Kl. 6, LB 3, S. 14-15 |
| `os-k6-lb3-umfang` | Umfangsberechnung | `lb3-umfang-rechteck`, `lb3-sachaufgabe-geometrie` | 2 | Umfang; Sachaufgabe Fläche/Umfang ergänzt (neu) | LP OS Mathematik 2019: Kl. 6, LB 3, S. 14-15 |
| `os-k6-lb3-flaeche-rechteck` | Flächeninhalt von Rechteck und Quadrat | `lb3-flaeche-rechteck` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 3, S. 14-15 |
| `os-k6-lb3-winkelsumme-viereck` | Winkelsumme im Viereck | `lb3-winkel-viereck` | 2 | 1:1; im LP K6 LB3 nicht ausdrücklich genannt, Gym-Quelle belassen | LP OS Mathematik 2019: Kl. 6, LB 3, S. 14-15 |
| `os-k6-lb4-darstellen` | Grundriss, Seitenansichten, Schrägbild und Körpernetz | **custom (bleibt)** | 2 | custom (bleibt): osPrismNetz (Prismen-Netze) | LP OS Mathematik 2019: Kl. 6, LB 4, S. 15 |
| `os-k6-lb4-volumen-quader` | Volumen von Quader und Würfel | — | — | BLOCKIERT: math6-ID lb4-volumen-quader kollidiert mit math5 (Katalog nimmt math5 = gleiche Aufgaben wie K5); erst nach Umbenennung der math6-ID mappbar (D24) | LP OS Mathematik 2019: Kl. 6, LB 4, S. 15 |
| `os-k6-lb4-oberflaeche` | Oberfläche als zusammengesetzte Fläche | `lb4-flaeche-kante-quader` | 2 | Ausweichquelle wegen ID-Kollision lb4-oberflaeche-quader (D24); Fläche/Seitenlänge am Quader | LP OS Mathematik 2019: Kl. 6, LB 4, S. 15 |
| `os-k6-lb4-volumen-prisma` | Volumen gerader Prismen | `lb4-volumen-prisma` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 4, S. 15 |
| `os-k6-lb5-probieren` | Problemlösestrategien: systematisches Probieren, Zurückführen auf Bekanntes | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Kl. 6, LB 5, S. 16 |
| `os-k6-lb5-haeufigkeit` | Zufallsversuche: absolute und relative Häufigkeit | `lb2-haeufigkeit` | 2 | LP K6 LB5: absolute/relative Häufigkeit | LP OS Mathematik 2019: Kl. 6, LB 5, S. 16 |
| `os-k6-lb5-anteil-prozent` | Anteile in Prozent | — | — | D5: Prozentrechnung nicht im LP K6; Master lb5-anteil-prozent nach K7 verlagert (vorher: lb5-anteil-prozent) | LP OS Mathematik 2019: Kl. 6, LB 5, S. 16 |
| `os-k6-lb5-praesentation` | Präsentation zu geometrischen Figuren und Körpern in der Umwelt | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Kl. 6, LB 5, S. 16 |
| `os-k6-lbw1-dgs` | Geometrische Objekte mit dynamischer Geometriesoftware | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 6, Wahlbereich 1, S. 16 |
| `os-k6-lbw1-konstruktion` | Grundkonstruktionen am Computer | `lb3-strecken-mittelpunkt` | 2 | Wahlbereich DGS: Streckenmittelpunkt/Grundkonstruktion (neu) | LP OS Mathematik 2019: Kl. 6, Wahlbereich 1, S. 16 |
| `os-k6-lbw1-messen` | Längen und Winkel dynamisch messen | `lb3-strecken-laenge` | 2 | Wahlbereich DGS: Längen messen (neu) | LP OS Mathematik 2019: Kl. 6, Wahlbereich 1, S. 16 |
| `os-k6-lbw2-spiele` | Spiele zur Problemlösefähigkeit, Raumanschauung und Stochastik | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 6, Wahlbereich 2, S. 16 |
| `os-k6-lbw2-strategie` | Strategiespiele und Gewinnzüge | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 6, Wahlbereich 2, S. 16 |
| `os-k6-lbw2-wuerfel` | Würfelspiele und relative Häufigkeit | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 6, Wahlbereich 2, S. 16 |
| `os-k6-lbw3-mittelwert` | Arithmetisches Mittel bei Datenerhebungen | — | — | LP K6 Wahl 3 nennt arithmetisches Mittel, aber Master (lb2-mittelwert, k7-lb4-mittelwert) bereits in K5/K6-LB1 verbraucht (vorher: lb2-mittelwert, Dublette) | LP OS Mathematik 2019: Kl. 6, Wahlbereich 3, S. 17 |
| `os-k6-lbw3-modal` | Modalwert, Maximum und Minimum | — | — | Modalwert-Master k9-lb4-modalwert liegt im jeweiligen K9-Thema (LP dort Pflicht bzw. Wahl 1); vorher in K6 Dublette | LP OS Mathematik 2019: Kl. 6, Wahlbereich 3, S. 17 |
| `os-k6-lbw3-diagramm` | Säulen- und Kreisdiagramme lesen | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 6, Wahlbereich 3, S. 17 |

#### Klasse 7 (HS) - 23 von 41 Themen spielbar

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `os-hs-k7-lb1-netze` | Netze, Seitenansichten und Schrägbilder zeichnen | **custom (bleibt)** | 2 | custom (bleibt): osPrismNetz; Dublette zu os-hs-k7-lb4-netze in derselben Klasse (D26) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 1, S. 18 |
| `os-hs-k7-lb1-modelle` | Herstellen von Modellen | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 1, S. 18 |
| `os-hs-k7-lb1-flaeche` | Flächeninhalte zusammengesetzter Figuren | `lb4-flaeche-zusammengesetzt` | 2 | LP HS K7 LB1: Wiederholung/Vernetzung Kl. 5-6 ausdrücklich -> dokumentierte Wiederholung der K5-Quelle [Wiederholung] | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 1, S. 18 |
| `os-hs-k7-lb1-volumen` | Volumen zusammengesetzter Körper | `lb4-volumen-zusammengesetzt` | 2 | LP HS K7 LB1: Wiederholung Kl. 5-6 -> dokumentierte Wiederholung (Quelle sonst nirgends im HS-Pack) [Wiederholung] | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 1, S. 18 |
| `os-hs-k7-lb2-anteil-bruch` | Anteile als gemeine Brüche, Dezimalzahlen und Prozente | `lb1-prozent` | 2 | Anteile als Prozent (K6-Master "In Prozent umwandeln"); K5-Prozenteinblick bleibt ohne Master | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 2, S. 19 |
| `os-hs-k7-lb2-vergleich` | Vergleichen von Anteilen | — | — | Kein Master für Anteile vergleichen | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 2, S. 19 |
| `os-hs-k7-lb2-kreisdiagramm` | Grafisches Darstellen von Anteilen im Kreisdiagramm | **custom (bleibt)** | 2 | custom (bleibt): osPieAnteil. Fallback-Eintrag in OS_GENERATOR_MAP (lb2-grafische-brueche) ist toter Code, bei Bereinigung entfernen | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 2, S. 19 |
| `os-hs-k7-lb2-anteil-groesse` | Anteil einer Größe berechnen | `lb5-anteil-groesse` | 2 | Anteil/Prozentwert einer Größe | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 2, S. 19 |
| `os-hs-k7-lb2-begriffe` | Prozent, Prozentwert, Prozentsatz und Grundwert | — | — | Reiner Begriffsinhalt, kein Master | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 2, S. 19 |
| `os-hs-k7-lb2-prozent` | Grundaufgaben der Prozentrechnung | `lb5-anteil-prozent` | 2 | Grundaufgaben der Prozentrechnung (LP K7 LB2); aus K6 nach K7 verlagert (D5) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 2, S. 19 |
| `os-hs-k7-lb2-dreisatz` | Dreisatz bei Aufgaben mit Umweltbezug | `lb2-sachaufgabe-dreisatz` | 2 | Dreisatz in Sachaufgaben; lb2-proportional bleibt in K6 | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 2, S. 19 |
| `os-hs-k7-lb2-haeufigkeit` | Zufallsversuche: Urliste, absolute und relative Häufigkeit | `k7-lb4-rel-haeufigkeit` | 2 | K7-Master relative Häufigkeit; lb2-haeufigkeit bleibt in K6 | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 2, S. 19 |
| `os-hs-k7-lb2-chancen` | Gleichwahrscheinliche Ergebnisse und Chancen abschätzen | `k8-lb2-laplace-bruch` | 2 | LP HS K7 LB2: gleichwahrscheinliche Ergebnisse, Chancen abschätzen; nur einfache Laplace-Variante (neu, difficulty 1) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 2, S. 19 |
| `os-hs-k7-lb3-zahlerweiterung` | Notwendigkeit der Zahlenbereichserweiterung | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 3, S. 19-20 |
| `os-hs-k7-lb3-zahlengerade` | Veranschaulichen auf der Zahlengeraden, Vergleichen und Ordnen | `k7-lb2-betrag` | 2 | Symmetrie zur Null auf der Zahlengeraden (Betrag); bleibt | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 3, S. 19-20 |
| `os-hs-k7-lb3-add` | Rationale Zahlen addieren | `k7-lb2-add-rational` | 2 | 1:1 | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 3, S. 19-20 |
| `os-hs-k7-lb3-sub` | Rationale Zahlen subtrahieren | `k7-lb2-sub-rational` | 2 | 1:1 | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 3, S. 19-20 |
| `os-hs-k7-lb3-mul` | Rationale Zahlen vervielfachen | `k7-lb2-mul-rational` | 1 | LP HS: Vervielfachen mit nat. Zahl; Multiplizieren rationaler Zahlen nur Differenzierung -> maxDifficulty 1 (D11) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 3, S. 19-20 |
| `os-hs-k7-lb3-div` | Rationale Zahlen durch eine natürliche Zahl teilen | `k7-lb2-div-rational` | 1 | LP HS: Teilen durch nat. Zahl; allgemeines Dividieren nur Differenzierung -> maxDifficulty 1 (D11) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 3, S. 19-20 |
| `os-hs-k7-lb3-term` | Termwerte berechnen | `k7-lb2-term-vorrang` | 2 | 1:1 | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 3, S. 19-20 |
| `os-hs-k7-lb3-gleichung` | Einfache Gleichungen und Zahlenrätsel inhaltlich lösen | `k7-lb2-gleichung-mul`, `k8-lb5-zahlenraetsel` | 2 | LP: einfache Gleichungen und Zahlenrätsel; gleichung-add liegt in K5; Zahlenrätsel (diff 2) einbezogen | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 3, S. 19-20 |
| `os-hs-k7-lb3-koordinaten` | Punktkoordinaten in vier Quadranten | `lb3-koordinaten-eintragen`, `lb3-koordinaten-ablesen` **custom (bleibt)** | 2 | custom (bleibt): osQ1CoordinatePlace nur 1. Quadrant, LP verlangt vier Quadranten (D10); Master (4 Quadranten) als Beimischung empfohlen | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 3, S. 19-20 |
| `os-hs-k7-lb4-konstruieren` | Konstruieren von Dreiecken, Parallelogrammen und Drachenvierecken | `k7-lb1-mittelsenkrechte-schritte` | 2 | Konstruktionsschritte; bleibt | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 4, S. 20 |
| `os-hs-k7-lb4-flaeche-dreieck` | Flächeninhalt von Dreiecken | — | — | Master lb3-flaeche-dreieck gehört zu K6 LB3 (vorher: lb3-flaeche-dreieck, Dublette) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 4, S. 20 |
| `os-hs-k7-lb4-umfang` | Umfang von Dreiecken und Vierecken | — | — | Master lb3-umfang-rechteck gehört zu K6 (Dublette entfernt; vorher: lb3-umfang-rechteck) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 4, S. 20 |
| `os-hs-k7-lb4-winkelsumme` | Innenwinkelsumme im Vieleck | — | — | D9: Innenwinkelsumme im Vieleck steht im HS-LP erst in K8 LB3 (vorher: k7-lb1-winkelsumme-vieleck) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 4, S. 20 |
| `os-hs-k7-lb4-zerlegen` | Flächeninhalte von Vielecken durch Zerlegen | — | — | Zerlegen von Vielecken: in HS K7 durch LB1-Wiederholung (lb4-flaeche-zusammengesetzt) abgedeckt; gleiche Klasse nicht doppelt (vorher: lb4-flaeche-zusammengesetzt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 4, S. 20 |
| `os-hs-k7-lb4-netze` | Körpernetze, Schrägbilder und Seitenansichten von Prismen | **custom (bleibt)** | 2 | custom (bleibt): osPrismNetz | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 4, S. 20 |
| `os-hs-k7-lb4-volumen-prisma` | Volumen gerader Prismen | `k7-lb3-volumen-prisma` | 2 | K7-Master (vorher K6-Quelle, Dublette) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 4, S. 20 |
| `os-hs-k7-lb4-mantel` | Grund-, Mantel- und Oberfläche von Prismen | `k7-lb3-mantel-prisma` | 2 | 1:1 | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 4, S. 20 |
| `os-hs-k7-lb4-oberflaeche` | Oberfläche eines Quaders | `k7-lb3-oberflaeche-quader` | 2 | K7-Master (vorher K5/K6-Quelle, Dublette) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 4, S. 20 |
| `os-hs-k7-lb4-verpackung` | Materialverbrauch und Verpackungen beurteilen | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, LB 4, S. 20 |
| `os-hs-k7-lbw1-parkett` | Bandornamente und Parkettierungen | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, Wahlbereich 1, S. 20 |
| `os-hs-k7-lbw1-spiegel` | Spiegelungen in Ornamenten | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, Wahlbereich 1, S. 20 |
| `os-hs-k7-lbw1-verschieb` | Verschiebungen und Rapport | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, Wahlbereich 1, S. 20 |
| `os-hs-k7-lbw2-taeuschung` | Räumliche Illusionen und optische Täuschungen | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, Wahlbereich 2, S. 21 |
| `os-hs-k7-lbw2-perspektive` | Perspektive und Scheinraum | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, Wahlbereich 2, S. 21 |
| `os-hs-k7-lbw2-messen` | Messen trotz Täuschung | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, Wahlbereich 2, S. 21 |
| `os-hs-k7-lbw3-knobel` | Probleme der Unterhaltungsmathematik | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, Wahlbereich 3, S. 21 |
| `os-hs-k7-lbw3-zahlen` | Zahlenrätsel und magische Quadrate | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, Wahlbereich 3, S. 21 |
| `os-hs-k7-lbw3-logik` | Logikspiele und Schlussfolgern | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 7, Wahlbereich 3, S. 21 |

#### Klasse 8 (HS) - 15 von 33 Themen spielbar

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `os-hs-k8-lb1-prozent` | Prozentrechnung in wirtschaftlichen Problemen | — | — | Prozentgrundaufgaben: Heimat K7 (lb5-anteil-prozent), vorher Dublette | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 1, S. 22 |
| `os-hs-k8-lb1-zinsen` | Kapital, Zinssatz, Jahreszins | `k10-lb1-zinsen` | 2 | Kapital/Zinssatz/Jahreszins (LP K8 LB1) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 1, S. 22 |
| `os-hs-k8-lb1-zinseszins` | Zinseszins | `k10-lb1-zinseszins` | 2 | LP: Zinseszins nur Differenzierungshinweis (D14); difficulty 2 reicht | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 1, S. 22 |
| `os-hs-k8-lb1-preisaenderung` | Preiserhöhung und Preissenkung | `k10-lb1-prozentuale-zunahme` | 2 | Preiserhöhung/-senkung | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 1, S. 22 |
| `os-hs-k8-lb1-skonto` | Skonto, Rabatt und Mehrwertsteuer | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 1, S. 22 |
| `os-hs-k8-lb1-diagramme` | Erstellen und Deuten von Säulen-, Linien- und Kreisdiagrammen | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 1, S. 22 |
| `os-hs-k8-lb1-kredit` | Sparformen, Kredit und Ratenzahlung beurteilen | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 1, S. 22 |
| `os-hs-k8-lb2-struktur` | Struktur von Formeln erkennen und Formeln umstellen | `k8-lb5-rueckwaerts` | 2 | Umstellen von Formeln ~ Rückwärtsrechnen (neu) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 2, S. 23 |
| `os-hs-k8-lb2-term` | Term auswerten (Werte berechnen) | `k8-lb1-term-auswerten` | 2 | 1:1 | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 2, S. 23 |
| `os-hs-k8-lb2-zusammenfassen` | Terme zusammenfassen | `k8-lb1-zusammenfassen` | 2 | 1:1 | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 2, S. 23 |
| `os-hs-k8-lb2-gleichung` | Lineare Gleichung | `k8-lb1-gleichung-linear` | 1 | LP HS: kalkülmäßiges Lösen nur Differenzierung -> maxDifficulty 1 | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 2, S. 23 |
| `os-hs-k8-lb2-formelsammlung` | Umgang mit der Formelsammlung | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 2, S. 23 |
| `os-hs-k8-lb3-vieleck` | Eigenschaften regelmäßiger Vielecke, Achsen- und Drehsymmetrie | `lb3-punktsymmetrie` | 2 | Drehsymmetrie regelmäßiger Vielecke ~ Punktsymmetrie (K5-Master, neu); vorher Dublette lb3-achsensymmetrie | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 3, S. 23 |
| `os-hs-k8-lb3-winkelsumme` | Innenwinkel und Innenwinkelsumme | `k7-lb1-winkelsumme-vieleck` | 2 | LP HS K8 LB3: Innenwinkelsumme regelmäßiger Vielecke (Heimat des Masters, K7 entfällt, D9) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 3, S. 23 |
| `os-hs-k8-lb3-kreis-umfang` | Umfang eines Kreises | `k9-lb2-kreis-umfang` | 2 | 1:1 (K9-Master, LP K8) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 3, S. 23 |
| `os-hs-k8-lb3-kreis-flaeche` | Flächeninhalt eines Kreises | `k9-lb2-kreis-flaeche` | 2 | 1:1 (K9-Master, LP K8) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 3, S. 23 |
| `os-hs-k8-lb3-kreisring` | Flächeninhalt am Kreisring | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 3, S. 23 |
| `os-hs-k8-lb3-lage` | Lagebeziehungen von Kreis und Gerade: Sehne, Sekante, Tangente | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 3, S. 23 |
| `os-hs-k8-lb4-darstellen` | Netze, Ansichten und Schrägbild des Kreiszylinders | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 4, S. 23 |
| `os-hs-k8-lb4-zylinder` | Volumen von Kreis- und Hohlzylindern | `k9-lb2-zylinder-volumen` | 2 | Heimat des Masters ist HS K8 LB4; K9-Zylinder entfällt (D16) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 4, S. 23 |
| `os-hs-k8-lb4-oberflaeche` | Grund-, Mantel- und Oberfläche des Kreiszylinders | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 4, S. 23 |
| `os-hs-k8-lb5-haushalt` | Haushaltsbuch, Rechnungen, Wohn- und Baukosten | — | — | Kein Master (Haushaltsbuch/Rechnungen) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 5, S. 24 |
| `os-hs-k8-lb5-zinsen` | Verzinsungsmöglichkeiten und Vergleich von Angeboten | `k10-lb5-kapital`, `k10-lb5-zinssatz` | 2 | Kapital/Zinssatz bestimmen (neu, vorher Dublette k10-lb1-zinsen) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 5, S. 24 |
| `os-hs-k8-lb5-streckfaktor` | Maßstäbliches Darstellen ebener Figuren und Körper | `k8-lb4-streckfaktor` | 2 | Maßstäbliches Darstellen; Ähnlichkeit nur Differenzierung | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, LB 5, S. 24 |
| `os-hs-k8-lbw1-fahrrad` | Kenndaten, Wegstrecken und Geschwindigkeiten am Fahrrad | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, Wahlbereich 1, S. 24 |
| `os-hs-k8-lbw1-umfang` | Radumfang und zurückgelegte Strecke | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, Wahlbereich 1, S. 24 |
| `os-hs-k8-lbw1-tempo` | Durchschnittsgeschwindigkeit berechnen | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, Wahlbereich 1, S. 24 |
| `os-hs-k8-lbw2-kredit` | Kredit, Tilgung und Kreditangebote | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, Wahlbereich 2, S. 24 |
| `os-hs-k8-lbw2-zinsen` | Zinsen und Gesamtkosten vergleichen | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, Wahlbereich 2, S. 24 |
| `os-hs-k8-lbw2-raten` | Ratenkauf und effektive Belastung | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, Wahlbereich 2, S. 24 |
| `os-hs-k8-lbw3-modell` | Maßstäbliches Vergrößern und Verkleinern im Modellbau | `k8-lb4-aehnliche-seite` | 2 | Maßstab/Modellbau (neu); Strahlensatz nicht HS | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, Wahlbereich 3, S. 24 |
| `os-hs-k8-lbw3-massstab` | Maßstab umrechnen | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, Wahlbereich 3, S. 24 |
| `os-hs-k8-lbw3-volumen` | Volumenveränderung bei Maßstab | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 8, Wahlbereich 3, S. 24 |

#### Klasse 9 (HS) - 13 von 32 Themen spielbar

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `os-hs-k9-lb1-hyp` | Satz des Pythagoras: Hypotenuse | `k9-lb3-pythagoras-hypotenuse` | 2 | 1:1 | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 1, S. 25 |
| `os-hs-k9-lb1-kathete` | Satz des Pythagoras: fehlende Kathete | `k9-lb3-pythagoras-kathete` | 2 | 1:1 | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 1, S. 25 |
| `os-hs-k9-lb1-sinus` | Sinus eines Winkels im rechtwinkligen Dreieck | `k9-lb3-trig-wert` | 2 | LP HS: nur Sinus; Kosinus/Tangens nur Differenzierung -> Variantenfilter Sinus empfohlen (D12) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 1, S. 25 |
| `os-hs-k9-lb1-umkehrung` | Umkehrung des Satzes des Pythagoras | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 1, S. 25 |
| `os-hs-k9-lb1-sach` | Seitenlängen und Winkel in Sachaufgaben | `k9-lb5-leiter` | 2 | Sachaufgaben Pythagoras | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 1, S. 25 |
| `os-hs-k9-lb2-darstellen` | Schrägbild, Netz und Ansichten von Pyramide und Kreiskegel | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 2, S. 26 |
| `os-hs-k9-lb2-pyramide` | Volumen einer Pyramide mit quadratischer Grundfläche | `k7-lb3-volumen-pyramide`, `k7-lb3-oberflaeche-pyramide` | 2 | LP HS K9 LB2: Mantel-/Oberfläche und Volumen bei quadratischer Grundfläche (Oberfläche neu) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 2, S. 26 |
| `os-hs-k9-lb2-kegel` | Volumen von Kreiskegeln | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 2, S. 26 |
| `os-hs-k9-lb2-zylinder` | Volumen eines Kreiszylinders | — | — | D16: Kreiszylinder ist HS K8 LB4; im LP K9 LB2 nicht enthalten (vorher: k9-lb2-zylinder-volumen, Dublette) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 2, S. 26 |
| `os-hs-k9-lb2-masse` | Masse unter Einbeziehung der Dichte | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 2, S. 26 |
| `os-hs-k9-lb2-zusammengesetzt` | Zusammengesetzte Körper | — | — | Master lb4-volumen-zusammengesetzt bereits in HS K7 LB1 (dokumentierte Wiederholung); Pyramide+Quader-Kombination ohne eigenen Master (vorher: lb4-volumen-zusammengesetzt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 2, S. 26 |
| `os-hs-k9-lb2-formel-umstellen` | Formeln umstellen und anwenden | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 2, S. 26 |
| `os-hs-k9-lb3-funktion` | Funktion als eindeutige Zuordnung | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 3, S. 26 |
| `os-hs-k9-lb3-funktionswert` | Funktionswert einer linearen Funktion y = m·x+n | **custom (bleibt)** | 2 | custom (bleibt): hsLinearFunktionswert; Map-Eintrag k8-lb3-funktionswert damit tot | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 3, S. 26 |
| `os-hs-k9-lb3-steigung` | Steigung aus zwei Punkten | **custom (bleibt)** | 2 | custom (bleibt): hsLinearSteigung; Map-Eintrag k8-lb3-steigung tot | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 3, S. 26 |
| `os-hs-k9-lb3-achsen` | y-Achsenabschnitt bestimmen | **custom (bleibt)** | 2 | custom (bleibt): hsLinearAchsen; Map-Eintrag k8-lb3-achsenabschnitt tot | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 3, S. 26 |
| `os-hs-k9-lb3-schnitt` | Schnittpunktkoordinaten zweier Graphen | — | — | D13: rechnerisches Bestimmen nur Einblick; k8-lb3-lgs hat difficulty 3 (> 2) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 3, S. 26 |
| `os-hs-k9-lb3-quadrat` | Einblick: y = x² und y = a·x² | `k9-lb1-quadrat-wert` | 2 | LP: nur Einblick y=x² bzw. y=a·x²; difficulty 2, nur Variante ohne Scheitelform (D13) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 3, S. 26 |
| `os-hs-k9-lb3-tarif` | Tarifvergleiche mit linearen Funktionen | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 3, S. 26 |
| `os-hs-k9-lb4-kalkulation` | Kalkulationen, Materialbedarf und funktionale Zusammenhänge | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 4, S. 27 |
| `os-hs-k9-lb4-mittelwert` | Darstellen und Auswerten von Daten | `k9-lb4-mittelwert` | 2 | Auswerten von Daten | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 4, S. 27 |
| `os-hs-k9-lb4-prozent` | Prozentuale Aufschläge und Rabatte | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 4, S. 27 |
| `os-hs-k9-lb4-vergleich` | Angebote und Tarife vergleichen | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, LB 4, S. 27 |
| `os-hs-k9-lbw1-median` | Zentralwert (Median) | `k9-lb4-median` | 2 | Wahlbereich Statistische Erhebungen | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, Wahlbereich 1, S. 27 |
| `os-hs-k9-lbw1-modal` | Modalwert | `k9-lb4-modalwert` | 2 | Wahlbereich Statistische Erhebungen (K6-Modal entfällt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, Wahlbereich 1, S. 27 |
| `os-hs-k9-lbw1-spannweite` | Spannweite | `k7-lb4-spannweite` | 2 | Wahlbereich Statistische Erhebungen | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, Wahlbereich 1, S. 27 |
| `os-hs-k9-lbw2-opt` | Optimierungsprobleme aus Alltag und Wirtschaft | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, Wahlbereich 2, S. 27 |
| `os-hs-k9-lbw2-flaeche` | Maximale Fläche bei gegebenem Umfang | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, Wahlbereich 2, S. 27 |
| `os-hs-k9-lbw2-kosten` | Kostenminimum abschätzen | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, Wahlbereich 2, S. 27 |
| `os-hs-k9-lbw3-zeichnen` | Technische Zeichnungen und mehrere Ansichten | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, Wahlbereich 3, S. 27 |
| `os-hs-k9-lbw3-mass` | Bemaßung und Maßstab | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, Wahlbereich 3, S. 27 |
| `os-hs-k9-lbw3-schnitt` | Schnittdarstellungen lesen | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Hauptschulbildungsgang Kl. 9, Wahlbereich 3, S. 27 |


### Coverage Hauptschulbildungsgang

- Pack-Themen gesamt: 204 (K5/K6 gemeinsam + K7-K9)
- Spielbar vorher (Eintrag in OS_GENERATOR_MAP oder OS_CUSTOM_GENERATORS): **117**
- Spielbar nachher (mind. eine Master-Quelle oder custom): **117**
- Davon custom (bleibt): 9
- Hinweis: "vorher" zählt Dubletten mit (dasselbe Master-Thema in bis zu 4 Pack-Themen); "nachher" ist dublettenfrei. Netto-Rückgang = entfernte Doppelnutzungen und LP-fremde Themen, keine verlorenen Inhalte.

#### Pack-Themen ohne Master-Quelle (Pflicht-Lernbereiche, 50)

- `os-k5-lb1-quadrat` - Quadratzahl und Quadratwurzel
- `os-k5-lb1-null` - Null als kleinste natürliche Zahl
- `os-k5-lb1-rechengesetze` - Rechenstrategien, Rechenvorteile und Rechengesetze
- `os-k5-lb2-vergleichen` - Vergleichen, Ordnen und Abschätzen gemeiner Brüche
- `os-k5-lb2-prozent` - Prozentschreibweise für bequeme Anteile
- `os-k5-lb4-deckung` - Zeichnen und Analysieren symmetrischer sowie deckungsgleicher Figuren
- `os-k5-lb4-drehung` - Drehungen und Symmetrie in Mustern
- `os-k5-lb4-achsen` - Achsen- und Punktsymmetrie erkennen
- `os-k6-lb1-erweiterung` - Notwendigkeit einer Zahlenbereichserweiterung, Mengenbegriff
- `os-k6-lb1-negative-ausblick` - Ausblick: negative Zahlen in Sachproblemen
- `os-k6-lb1-verhaeltnis` - Verhältnisgleichungen
- `os-k6-lb2-arten` - Eindeutige, eineindeutige und mehrdeutige Zuordnungen
- `os-k6-lb2-darstellung` - Darstellung in Wort, Tabelle, Koordinatensystem und Gleichung
- `os-k6-lb3-parallelogramm` - Flächeninhalt von Parallelogramm, Drachenviereck und Trapez
- `os-k6-lb4-volumen-quader` - Volumen von Quader und Würfel
- `os-k6-lb5-probieren` - Problemlösestrategien: systematisches Probieren, Zurückführen auf Bekanntes
- `os-k6-lb5-anteil-prozent` - Anteile in Prozent
- `os-k6-lb5-praesentation` - Präsentation zu geometrischen Figuren und Körpern in der Umwelt
- `os-hs-k7-lb1-modelle` - Herstellen von Modellen
- `os-hs-k7-lb2-vergleich` - Vergleichen von Anteilen
- `os-hs-k7-lb2-begriffe` - Prozent, Prozentwert, Prozentsatz und Grundwert
- `os-hs-k7-lb3-zahlerweiterung` - Notwendigkeit der Zahlenbereichserweiterung
- `os-hs-k7-lb4-flaeche-dreieck` - Flächeninhalt von Dreiecken
- `os-hs-k7-lb4-umfang` - Umfang von Dreiecken und Vierecken
- `os-hs-k7-lb4-winkelsumme` - Innenwinkelsumme im Vieleck
- `os-hs-k7-lb4-zerlegen` - Flächeninhalte von Vielecken durch Zerlegen
- `os-hs-k7-lb4-verpackung` - Materialverbrauch und Verpackungen beurteilen
- `os-hs-k8-lb1-prozent` - Prozentrechnung in wirtschaftlichen Problemen
- `os-hs-k8-lb1-skonto` - Skonto, Rabatt und Mehrwertsteuer
- `os-hs-k8-lb1-diagramme` - Erstellen und Deuten von Säulen-, Linien- und Kreisdiagrammen
- `os-hs-k8-lb1-kredit` - Sparformen, Kredit und Ratenzahlung beurteilen
- `os-hs-k8-lb2-formelsammlung` - Umgang mit der Formelsammlung
- `os-hs-k8-lb3-kreisring` - Flächeninhalt am Kreisring
- `os-hs-k8-lb3-lage` - Lagebeziehungen von Kreis und Gerade: Sehne, Sekante, Tangente
- `os-hs-k8-lb4-darstellen` - Netze, Ansichten und Schrägbild des Kreiszylinders
- `os-hs-k8-lb4-oberflaeche` - Grund-, Mantel- und Oberfläche des Kreiszylinders
- `os-hs-k8-lb5-haushalt` - Haushaltsbuch, Rechnungen, Wohn- und Baukosten
- `os-hs-k9-lb1-umkehrung` - Umkehrung des Satzes des Pythagoras
- `os-hs-k9-lb2-darstellen` - Schrägbild, Netz und Ansichten von Pyramide und Kreiskegel
- `os-hs-k9-lb2-kegel` - Volumen von Kreiskegeln
- `os-hs-k9-lb2-zylinder` - Volumen eines Kreiszylinders
- `os-hs-k9-lb2-masse` - Masse unter Einbeziehung der Dichte
- `os-hs-k9-lb2-zusammengesetzt` - Zusammengesetzte Körper
- `os-hs-k9-lb2-formel-umstellen` - Formeln umstellen und anwenden
- `os-hs-k9-lb3-funktion` - Funktion als eindeutige Zuordnung
- `os-hs-k9-lb3-schnitt` - Schnittpunktkoordinaten zweier Graphen
- `os-hs-k9-lb3-tarif` - Tarifvergleiche mit linearen Funktionen
- `os-hs-k9-lb4-kalkulation` - Kalkulationen, Materialbedarf und funktionale Zusammenhänge
- `os-hs-k9-lb4-prozent` - Prozentuale Aufschläge und Rabatte
- `os-hs-k9-lb4-vergleich` - Angebote und Tarife vergleichen

#### Pack-Themen ohne Master-Quelle (Wahlbereiche, 37)

`os-k5-lbw1-zahlzeichen`, `os-k5-lbw1-abakus`, `os-k5-lbw1-stellenwert`, `os-k5-lbw2-daten`, `os-k5-lbw2-kombinatorik`, `os-k5-lbw2-mittel`, `os-k5-lbw3-zeit`, `os-k6-lbw1-dgs`, `os-k6-lbw2-spiele`, `os-k6-lbw2-strategie`, `os-k6-lbw2-wuerfel`, `os-k6-lbw3-mittelwert`, `os-k6-lbw3-modal`, `os-k6-lbw3-diagramm`, `os-hs-k7-lbw1-parkett`, `os-hs-k7-lbw1-spiegel`, `os-hs-k7-lbw1-verschieb`, `os-hs-k7-lbw2-taeuschung`, `os-hs-k7-lbw2-perspektive`, `os-hs-k7-lbw2-messen`, `os-hs-k7-lbw3-knobel`, `os-hs-k7-lbw3-zahlen`, `os-hs-k7-lbw3-logik`, `os-hs-k8-lbw1-fahrrad`, `os-hs-k8-lbw1-umfang`, `os-hs-k8-lbw1-tempo`, `os-hs-k8-lbw2-kredit`, `os-hs-k8-lbw2-zinsen`, `os-hs-k8-lbw2-raten`, `os-hs-k8-lbw3-massstab`, `os-hs-k8-lbw3-volumen`, `os-hs-k9-lbw2-opt`, `os-hs-k9-lbw2-flaeche`, `os-hs-k9-lbw2-kosten`, `os-hs-k9-lbw3-zeichnen`, `os-hs-k9-lbw3-mass`, `os-hs-k9-lbw3-schnitt`

#### Master-Themen der Klassen 5-9, die ungenutzt bleiben (15)

| Master-ID | Titel | diff | Grund |
|---|---|---|---|
| `lb3-koordinaten-abstand` | Abstand zwischen Punkten | 2 | Abstand zweier Punkte im Koordinatensystem steht nicht im LP K5-K9 HS |
| `k7-lb4-median` | Median (Zentralwert) | 2 | Median/Zentralwert steht im HS-LP erst K9 (Wahlbereich 1); dort k9-lb4-median |
| `k8-lb1-gleichung-beidseitig` | Gleichung mit x auf beiden Seiten | 2 | HS K8 LB2: kalkülmäßiges Lösen/Termumformung nur Differenzierungshinweis |
| `k8-lb1-ausmultiplizieren` | Klammer ausmultiplizieren (Wert bei x) | 2 | HS K8 LB2: Termumformungen nur Differenzierungshinweis |
| `k8-lb2-laplace-prozent` | Laplace-Wahrscheinlichkeit in Prozent | 1 | Laplace-Wahrscheinlichkeit nicht im HS-LP (nur Chancen abschätzen/relative Häufigkeit); k8-lb2-laplace-bruch nur in K7-chancen |
| `k8-lb2-gegenwahrscheinlichkeit` | Gegenwahrscheinlichkeit | 1 | Gegenwahrscheinlichkeit nicht im HS-LP |
| `k8-lb3-funktionswert` | Funktionswert einer linearen Funktion | 1 | In HS durch Custom os-hs-k9-lb3-funktionswert (kleinerer Zahlenraum) ersetzt |
| `k8-lb3-steigung` | Steigung aus zwei Punkten | 2 | In HS durch Custom os-hs-k9-lb3-steigung ersetzt |
| `k8-lb3-achsenabschnitt` | y-Achsenabschnitt bestimmen | 2 | In HS durch Custom os-hs-k9-lb3-achsen ersetzt |
| `k8-lb3-lgs` | Lineares Gleichungssystem (x bestimmen) | 3 | difficulty 3 und HS-LP nur Einblick in rechnerische Schnittpunktbestimmung (HS K9 LB3) |
| `k8-lb4-strahlensatz` | Strahlensatz: fehlende Länge | 2 | Ähnlichkeit im HS-LP nur Differenzierungshinweis (K8 LB5) |
| `k9-lb1-potenz-produkt` | Potenzgesetz: Produkt gleicher Basis | 2 | Potenzgesetze nicht im HS-LP |
| `k9-lb1-potenz-quotient` | Potenzgesetz: Quotient und Potenz einer Potenz | 2 | Potenzgesetze nicht im HS-LP |
| `k9-lb1-scheitel` | Scheitelpunkt aus der Scheitelform | 2 | Quadratische Funktionen im HS-LP nur Differenzierung/Einblick (y = x², y = a·x²); Scheitelform nicht |
| `k9-lb2-kugel-volumen` | Volumen einer Kugel | 2 | Kugel im HS-LP nur Differenzierungshinweis (K9 LB2) |
| `k6-umrechnen-laenge` | Neu-Waise (math6) | 1 | Neu-Waise (kein Parent); kein Einheiten-Pack-Thema in K6, LP K6 behandelt Einheiten nur implizit |
| `k6-umrechnen-flaeche` | Neu-Waise (math6) | 1 | Neu-Waise (kein Parent); kein Einheiten-Pack-Thema in K6 |

Nicht zur Oberschule gehörig: Master K10 (alle, HS endet mit Klasse 9; die in K8 genutzten Zins-Themen k10-lb1-*/k10-lb5-* stammen aus der Gym-Klasse 10 und sind oben bereits eingeordnet) und Master Jahrgangsstufe 11/12 (k1112-*) - kein Lehrplaninhalt der Oberschule.

### JSON HS

```json
{
  "os-k5-lb1-runden": {
    "sources": [
      "lb1-runden-natuerlich"
    ],
    "maxDifficulty": 2,
    "note": "1:1 Rundenübung natürlicher Zahlen"
  },
  "os-k5-lb1-potenz": {
    "sources": [
      "lb1-potenzieren"
    ],
    "maxDifficulty": 2,
    "note": "Quadrat- und Zehnerpotenzen; deckt os-k5-lb1-quadrat inhaltlich mit ab"
  },
  "os-k5-lb1-addition": {
    "sources": [
      "lb1-addition"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb1-subtraktion": {
    "sources": [
      "lb1-subtraktion"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb1-multiplikation": {
    "sources": [
      "lb1-multiplikation",
      "lb1-schriftliches-rechnen"
    ],
    "maxDifficulty": 2,
    "note": "LP: mündlich/halbschriftlich/schriftlich multiplizieren; schriftliches Rechnen (Kästchenpapier) ergänzt (neu)"
  },
  "os-k5-lb1-division": {
    "sources": [
      "lb1-schriftliche-division",
      "lb1-division-rest"
    ],
    "maxDifficulty": 2,
    "note": "LP: schriftliche Division durch einstelligen Divisor; Rest-Variante ergänzt (neu)"
  },
  "os-k5-lb1-gleichung": {
    "sources": [
      "k7-lb2-gleichung-add"
    ],
    "maxDifficulty": 2,
    "note": "K7-Master (x + a = b, difficulty 1) für inhaltliches Lösen einfacher Gleichungen; bleibt"
  },
  "os-k5-lb1-teilbarkeit": {
    "sources": [
      "lb1-teilbarkeit"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb1-primzahl": {
    "sources": [
      "lb1-primzahl"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb2-anteil": {
    "sources": [
      "lb2-anteil-bruch",
      "lb2-grafische-brueche"
    ],
    "maxDifficulty": 2,
    "note": "LP: Erkennen und Darstellen gemeiner Brüche; lb2-anteil-bruch neu hier (war HS-K7, dort Dublette)"
  },
  "os-k5-lb2-kuerzen": {
    "sources": [
      "lb2-kuerzen"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb2-erweitern": {
    "sources": [
      "lb2-erweitern"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb2-runden-dez": {
    "sources": [
      "lb2-runden-dezimal"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb2-dez-add-sub": {
    "sources": [
      "lb2-dez-add-sub"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb2-dez-mult": {
    "sources": [
      "lb2-dez-mult"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb2-dez-div": {
    "sources": [
      "lb2-dez-div"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb2-mittelwert": {
    "sources": [
      "lb2-mittelwert"
    ],
    "maxDifficulty": 2,
    "note": "K5-Master; K6 nutzt den K7-Master k7-lb4-mittelwert (kein Doppelt im Pack)"
  },
  "os-k5-lb2-laenge": {
    "sources": [
      "k5-umrechnen-laenge",
      "lb2-ordnen-einheiten"
    ],
    "maxDifficulty": 2,
    "note": "k5-umrechnen-laenge existiert nur als Neu-Aufgabenbank (Waise, siehe Coverage); Größen ordnen ergänzt"
  },
  "os-k5-lb2-masse": {
    "sources": [
      "k5-umrechnen-masse"
    ],
    "maxDifficulty": 2,
    "note": "Neu-Waise (kein Parent in math5.ts)"
  },
  "os-k5-lb2-zeit": {
    "sources": [
      "k5-umrechnen-zeit"
    ],
    "maxDifficulty": 2,
    "note": "Neu-Waise (kein Parent in math5.ts)"
  },
  "os-k5-lb3-koordinaten": {
    "sources": [],
    "maxDifficulty": 2,
    "note": "custom (bleibt): OS_CUSTOM_GENERATORS, erster Quadrant laut LP korrekt [custom bleibt]"
  },
  "os-k5-lb3-lage": {
    "sources": [
      "lb3-strecken-bezeichnung"
    ],
    "maxDifficulty": 2,
    "note": "LP K5 LB3: parallel/senkrecht/schneiden; Strecke/Gerade/Halbgerade als nächste Quelle (neu)"
  },
  "os-k5-lb3-winkelarten": {
    "sources": [
      "lb3-winkelarten"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb3-winkel-erg": {
    "sources": [
      "lb3-winkel-ergaenzung"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb3-wuerfel": {
    "sources": [
      "lb4-wuerfelnetz"
    ],
    "maxDifficulty": 2,
    "note": "math6-ID, inhaltlich K5 (Würfelnetz); K6-Darstellen bleibt custom"
  },
  "os-k5-lb3-umfang": {
    "sources": [
      "lb4-umfang-rechteck",
      "lb4-umfang-zusammengesetzt"
    ],
    "maxDifficulty": 2,
    "note": "LP K5 LB3: Umfang/Fläche an in Rechtecke zerlegbaren Figuren"
  },
  "os-k5-lb3-flaeche": {
    "sources": [
      "lb4-flaeche-rechteck",
      "lb4-flaeche-zusammengesetzt",
      "lb5-sachaufgabe-flaeche"
    ],
    "maxDifficulty": 2,
    "note": "LP K5 LB3: Zerlegen/Ergänzen; Sachaufgabe Fläche/Umfang ergänzt"
  },
  "os-k5-lb3-flaeche-eh": {
    "sources": [
      "k5-umrechnen-flaeche"
    ],
    "maxDifficulty": 2,
    "note": "Neu-Waise (kein Parent in math5.ts)"
  },
  "os-k5-lb3-oberflaeche": {
    "sources": [
      "lb4-oberflaeche-quader"
    ],
    "maxDifficulty": 2,
    "note": "ID-Kollision math5/math6 (D24): K5 bekommt die Quelle, K6 weicht aus"
  },
  "os-k5-lb3-volumen-wuerfel": {
    "sources": [
      "lb4-volumen-quader"
    ],
    "maxDifficulty": 2,
    "note": "ID-Kollision math5/math6 (D24): K5 bekommt die Quelle, K6 blockiert bis Umbenennung"
  },
  "os-k5-lb3-volumen-eh": {
    "sources": [
      "k5-umrechnen-volumen"
    ],
    "maxDifficulty": 2,
    "note": "Neu-Waise (kein Parent in math5.ts)"
  },
  "os-k5-lb4-spiegelung": {
    "sources": [
      "lb3-achsensymmetrie"
    ],
    "maxDifficulty": 2,
    "note": "1:1 (Geradenspiegelung/Symmetrieachse)"
  },
  "os-k5-lb4-verschiebungsweite": {
    "sources": [
      "lb3-verschiebung"
    ],
    "maxDifficulty": 2,
    "note": "LP K5 LB4: Verschiebungsrichtung/-weite (neu)"
  },
  "os-k5-lbw3-angebote": {
    "sources": [
      "lb5-gesamtpreis"
    ],
    "maxDifficulty": 2,
    "note": "Wahlbereich Klassenfahrt: Gesamtpreis/Angebote (neu)"
  },
  "os-k5-lbw3-budget": {
    "sources": [
      "lb5-mehrstufig",
      "lb5-teilen"
    ],
    "maxDifficulty": 2,
    "note": "Budget und Stückkosten (neu)"
  },
  "os-k6-lb1-zahlenstrahl": {
    "sources": [
      "lb2-zahlenstrahl"
    ],
    "maxDifficulty": 2,
    "note": "LP K6 LB1: Veranschaulichen am Zahlenstrahl (neu)"
  },
  "os-k6-lb1-kuerzen": {
    "sources": [
      "lb1-kuerzen"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb1-erweitern": {
    "sources": [
      "lb1-erweitern"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb1-bruch-dez": {
    "sources": [
      "lb1-bruch-dezimal"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb1-vergleichen": {
    "sources": [
      "lb1-vergleichen"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb1-add-sub": {
    "sources": [
      "lb1-add-sub-brueche"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb1-mult": {
    "sources": [
      "lb1-mult-brueche"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb1-div": {
    "sources": [
      "lb1-div-brueche"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb1-dez-add-sub": {
    "sources": [
      "lb1-dez-add-sub"
    ],
    "maxDifficulty": 2,
    "note": "1:1 (math6-ID, distinkt von K5 lb2-dez-add-sub)"
  },
  "os-k6-lb1-dez-mult": {
    "sources": [
      "lb1-dez-mult"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb1-dez-div": {
    "sources": [
      "lb1-dez-div"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb1-runden": {
    "sources": [
      "lb1-runden"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb1-mittelwert": {
    "sources": [
      "k7-lb4-mittelwert"
    ],
    "maxDifficulty": 2,
    "note": "LP K6 LB1: arithmetisches Mittel; K7-Master, damit lb2-mittelwert nur in K5 liegt"
  },
  "os-k6-lb2-prop": {
    "sources": [
      "lb2-proportional"
    ],
    "maxDifficulty": 2,
    "note": "1:1 Dreisatz direkt"
  },
  "os-k6-lb2-antiprop": {
    "sources": [
      "lb2-antiproportional"
    ],
    "maxDifficulty": 2,
    "note": "1:1 Dreisatz indirekt"
  },
  "os-k6-lb2-anteil": {
    "sources": [
      "lb1-sachaufgabe-bruch"
    ],
    "maxDifficulty": 2,
    "note": "Titel nicht im LP K6 LB2 (D6); Bruchteil-Sachaufgaben als Ersatzquelle, lb5-anteil-groesse geht nach K7"
  },
  "os-k6-lb3-nebenwinkel": {
    "sources": [
      "k7-lb1-nebenwinkel"
    ],
    "maxDifficulty": 2,
    "note": "LP K6 LB3: Nebenwinkelsatz (K7-Master)"
  },
  "os-k6-lb3-scheitel": {
    "sources": [
      "k7-lb1-scheitelwinkel"
    ],
    "maxDifficulty": 2,
    "note": "LP K6 LB3: Scheitel-/Stufen-/Wechselwinkel (K7-Master)"
  },
  "os-k6-lb3-innenwinkel": {
    "sources": [
      "lb3-winkel-dreieck"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb3-einteilung": {
    "sources": [
      "k7-lb1-basiswinkel"
    ],
    "maxDifficulty": 2,
    "note": "Dreiecke nach Seiten und Winkeln; Basiswinkel gleichschenklig als Näherung (neu)"
  },
  "os-k6-lb3-kongruenz": {
    "sources": [
      "lb3-kongruenzsatz"
    ],
    "maxDifficulty": 2,
    "note": "1:1; RS-K8 Kongruenz bekommt keine zweite Quelle"
  },
  "os-k6-lb3-flaeche-dreieck": {
    "sources": [
      "lb3-flaeche-dreieck"
    ],
    "maxDifficulty": 2,
    "note": "1:1; K7/K10 ohne Doppelung"
  },
  "os-k6-lb3-umfang": {
    "sources": [
      "lb3-umfang-rechteck",
      "lb3-sachaufgabe-geometrie"
    ],
    "maxDifficulty": 2,
    "note": "Umfang; Sachaufgabe Fläche/Umfang ergänzt (neu)"
  },
  "os-k6-lb3-flaeche-rechteck": {
    "sources": [
      "lb3-flaeche-rechteck"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb3-winkelsumme-viereck": {
    "sources": [
      "lb3-winkel-viereck"
    ],
    "maxDifficulty": 2,
    "note": "1:1; im LP K6 LB3 nicht ausdrücklich genannt, Gym-Quelle belassen"
  },
  "os-k6-lb4-darstellen": {
    "sources": [],
    "maxDifficulty": 2,
    "note": "custom (bleibt): osPrismNetz (Prismen-Netze) [custom bleibt]"
  },
  "os-k6-lb4-oberflaeche": {
    "sources": [
      "lb4-flaeche-kante-quader"
    ],
    "maxDifficulty": 2,
    "note": "Ausweichquelle wegen ID-Kollision lb4-oberflaeche-quader (D24); Fläche/Seitenlänge am Quader"
  },
  "os-k6-lb4-volumen-prisma": {
    "sources": [
      "lb4-volumen-prisma"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb5-haeufigkeit": {
    "sources": [
      "lb2-haeufigkeit"
    ],
    "maxDifficulty": 2,
    "note": "LP K6 LB5: absolute/relative Häufigkeit"
  },
  "os-k6-lbw1-konstruktion": {
    "sources": [
      "lb3-strecken-mittelpunkt"
    ],
    "maxDifficulty": 2,
    "note": "Wahlbereich DGS: Streckenmittelpunkt/Grundkonstruktion (neu)"
  },
  "os-k6-lbw1-messen": {
    "sources": [
      "lb3-strecken-laenge"
    ],
    "maxDifficulty": 2,
    "note": "Wahlbereich DGS: Längen messen (neu)"
  },
  "os-hs-k7-lb1-netze": {
    "sources": [],
    "maxDifficulty": 2,
    "note": "custom (bleibt): osPrismNetz; Dublette zu os-hs-k7-lb4-netze in derselben Klasse (D26) [custom bleibt]"
  },
  "os-hs-k7-lb1-flaeche": {
    "sources": [
      "lb4-flaeche-zusammengesetzt"
    ],
    "maxDifficulty": 2,
    "note": "LP HS K7 LB1: Wiederholung/Vernetzung Kl. 5-6 ausdrücklich -> dokumentierte Wiederholung der K5-Quelle"
  },
  "os-hs-k7-lb1-volumen": {
    "sources": [
      "lb4-volumen-zusammengesetzt"
    ],
    "maxDifficulty": 2,
    "note": "LP HS K7 LB1: Wiederholung Kl. 5-6 -> dokumentierte Wiederholung (Quelle sonst nirgends im HS-Pack)"
  },
  "os-hs-k7-lb2-anteil-bruch": {
    "sources": [
      "lb1-prozent"
    ],
    "maxDifficulty": 2,
    "note": "Anteile als Prozent (K6-Master \"In Prozent umwandeln\"); K5-Prozenteinblick bleibt ohne Master"
  },
  "os-hs-k7-lb2-kreisdiagramm": {
    "sources": [],
    "maxDifficulty": 2,
    "note": "custom (bleibt): osPieAnteil. Fallback-Eintrag in OS_GENERATOR_MAP (lb2-grafische-brueche) ist toter Code, bei Bereinigung entfernen [custom bleibt]"
  },
  "os-hs-k7-lb2-anteil-groesse": {
    "sources": [
      "lb5-anteil-groesse"
    ],
    "maxDifficulty": 2,
    "note": "Anteil/Prozentwert einer Größe"
  },
  "os-hs-k7-lb2-prozent": {
    "sources": [
      "lb5-anteil-prozent"
    ],
    "maxDifficulty": 2,
    "note": "Grundaufgaben der Prozentrechnung (LP K7 LB2); aus K6 nach K7 verlagert (D5)"
  },
  "os-hs-k7-lb2-dreisatz": {
    "sources": [
      "lb2-sachaufgabe-dreisatz"
    ],
    "maxDifficulty": 2,
    "note": "Dreisatz in Sachaufgaben; lb2-proportional bleibt in K6"
  },
  "os-hs-k7-lb2-haeufigkeit": {
    "sources": [
      "k7-lb4-rel-haeufigkeit"
    ],
    "maxDifficulty": 2,
    "note": "K7-Master relative Häufigkeit; lb2-haeufigkeit bleibt in K6"
  },
  "os-hs-k7-lb2-chancen": {
    "sources": [
      "k8-lb2-laplace-bruch"
    ],
    "maxDifficulty": 2,
    "note": "LP HS K7 LB2: gleichwahrscheinliche Ergebnisse, Chancen abschätzen; nur einfache Laplace-Variante (neu, difficulty 1)"
  },
  "os-hs-k7-lb3-zahlengerade": {
    "sources": [
      "k7-lb2-betrag"
    ],
    "maxDifficulty": 2,
    "note": "Symmetrie zur Null auf der Zahlengeraden (Betrag); bleibt"
  },
  "os-hs-k7-lb3-add": {
    "sources": [
      "k7-lb2-add-rational"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-hs-k7-lb3-sub": {
    "sources": [
      "k7-lb2-sub-rational"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-hs-k7-lb3-mul": {
    "sources": [
      "k7-lb2-mul-rational"
    ],
    "maxDifficulty": 1,
    "note": "LP HS: Vervielfachen mit nat. Zahl; Multiplizieren rationaler Zahlen nur Differenzierung -> maxDifficulty 1 (D11)"
  },
  "os-hs-k7-lb3-div": {
    "sources": [
      "k7-lb2-div-rational"
    ],
    "maxDifficulty": 1,
    "note": "LP HS: Teilen durch nat. Zahl; allgemeines Dividieren nur Differenzierung -> maxDifficulty 1 (D11)"
  },
  "os-hs-k7-lb3-term": {
    "sources": [
      "k7-lb2-term-vorrang"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-hs-k7-lb3-gleichung": {
    "sources": [
      "k7-lb2-gleichung-mul",
      "k8-lb5-zahlenraetsel"
    ],
    "maxDifficulty": 2,
    "note": "LP: einfache Gleichungen und Zahlenrätsel; gleichung-add liegt in K5; Zahlenrätsel (diff 2) einbezogen"
  },
  "os-hs-k7-lb3-koordinaten": {
    "sources": [
      "lb3-koordinaten-eintragen",
      "lb3-koordinaten-ablesen"
    ],
    "maxDifficulty": 2,
    "note": "custom (bleibt): osQ1CoordinatePlace nur 1. Quadrant, LP verlangt vier Quadranten (D10); Master (4 Quadranten) als Beimischung empfohlen [custom bleibt]"
  },
  "os-hs-k7-lb4-konstruieren": {
    "sources": [
      "k7-lb1-mittelsenkrechte-schritte"
    ],
    "maxDifficulty": 2,
    "note": "Konstruktionsschritte; bleibt"
  },
  "os-hs-k7-lb4-netze": {
    "sources": [],
    "maxDifficulty": 2,
    "note": "custom (bleibt): osPrismNetz [custom bleibt]"
  },
  "os-hs-k7-lb4-volumen-prisma": {
    "sources": [
      "k7-lb3-volumen-prisma"
    ],
    "maxDifficulty": 2,
    "note": "K7-Master (vorher K6-Quelle, Dublette)"
  },
  "os-hs-k7-lb4-mantel": {
    "sources": [
      "k7-lb3-mantel-prisma"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-hs-k7-lb4-oberflaeche": {
    "sources": [
      "k7-lb3-oberflaeche-quader"
    ],
    "maxDifficulty": 2,
    "note": "K7-Master (vorher K5/K6-Quelle, Dublette)"
  },
  "os-hs-k8-lb1-zinsen": {
    "sources": [
      "k10-lb1-zinsen"
    ],
    "maxDifficulty": 2,
    "note": "Kapital/Zinssatz/Jahreszins (LP K8 LB1)"
  },
  "os-hs-k8-lb1-zinseszins": {
    "sources": [
      "k10-lb1-zinseszins"
    ],
    "maxDifficulty": 2,
    "note": "LP: Zinseszins nur Differenzierungshinweis (D14); difficulty 2 reicht"
  },
  "os-hs-k8-lb1-preisaenderung": {
    "sources": [
      "k10-lb1-prozentuale-zunahme"
    ],
    "maxDifficulty": 2,
    "note": "Preiserhöhung/-senkung"
  },
  "os-hs-k8-lb2-struktur": {
    "sources": [
      "k8-lb5-rueckwaerts"
    ],
    "maxDifficulty": 2,
    "note": "Umstellen von Formeln ~ Rückwärtsrechnen (neu)"
  },
  "os-hs-k8-lb2-term": {
    "sources": [
      "k8-lb1-term-auswerten"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-hs-k8-lb2-zusammenfassen": {
    "sources": [
      "k8-lb1-zusammenfassen"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-hs-k8-lb2-gleichung": {
    "sources": [
      "k8-lb1-gleichung-linear"
    ],
    "maxDifficulty": 1,
    "note": "LP HS: kalkülmäßiges Lösen nur Differenzierung -> maxDifficulty 1"
  },
  "os-hs-k8-lb3-vieleck": {
    "sources": [
      "lb3-punktsymmetrie"
    ],
    "maxDifficulty": 2,
    "note": "Drehsymmetrie regelmäßiger Vielecke ~ Punktsymmetrie (K5-Master, neu); vorher Dublette lb3-achsensymmetrie"
  },
  "os-hs-k8-lb3-winkelsumme": {
    "sources": [
      "k7-lb1-winkelsumme-vieleck"
    ],
    "maxDifficulty": 2,
    "note": "LP HS K8 LB3: Innenwinkelsumme regelmäßiger Vielecke (Heimat des Masters, K7 entfällt, D9)"
  },
  "os-hs-k8-lb3-kreis-umfang": {
    "sources": [
      "k9-lb2-kreis-umfang"
    ],
    "maxDifficulty": 2,
    "note": "1:1 (K9-Master, LP K8)"
  },
  "os-hs-k8-lb3-kreis-flaeche": {
    "sources": [
      "k9-lb2-kreis-flaeche"
    ],
    "maxDifficulty": 2,
    "note": "1:1 (K9-Master, LP K8)"
  },
  "os-hs-k8-lb4-zylinder": {
    "sources": [
      "k9-lb2-zylinder-volumen"
    ],
    "maxDifficulty": 2,
    "note": "Heimat des Masters ist HS K8 LB4; K9-Zylinder entfällt (D16)"
  },
  "os-hs-k8-lb5-zinsen": {
    "sources": [
      "k10-lb5-kapital",
      "k10-lb5-zinssatz"
    ],
    "maxDifficulty": 2,
    "note": "Kapital/Zinssatz bestimmen (neu, vorher Dublette k10-lb1-zinsen)"
  },
  "os-hs-k8-lb5-streckfaktor": {
    "sources": [
      "k8-lb4-streckfaktor"
    ],
    "maxDifficulty": 2,
    "note": "Maßstäbliches Darstellen; Ähnlichkeit nur Differenzierung"
  },
  "os-hs-k8-lbw3-modell": {
    "sources": [
      "k8-lb4-aehnliche-seite"
    ],
    "maxDifficulty": 2,
    "note": "Maßstab/Modellbau (neu); Strahlensatz nicht HS"
  },
  "os-hs-k9-lb1-hyp": {
    "sources": [
      "k9-lb3-pythagoras-hypotenuse"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-hs-k9-lb1-kathete": {
    "sources": [
      "k9-lb3-pythagoras-kathete"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-hs-k9-lb1-sinus": {
    "sources": [
      "k9-lb3-trig-wert"
    ],
    "maxDifficulty": 2,
    "note": "LP HS: nur Sinus; Kosinus/Tangens nur Differenzierung -> Variantenfilter Sinus empfohlen (D12)"
  },
  "os-hs-k9-lb1-sach": {
    "sources": [
      "k9-lb5-leiter"
    ],
    "maxDifficulty": 2,
    "note": "Sachaufgaben Pythagoras"
  },
  "os-hs-k9-lb2-pyramide": {
    "sources": [
      "k7-lb3-volumen-pyramide",
      "k7-lb3-oberflaeche-pyramide"
    ],
    "maxDifficulty": 2,
    "note": "LP HS K9 LB2: Mantel-/Oberfläche und Volumen bei quadratischer Grundfläche (Oberfläche neu)"
  },
  "os-hs-k9-lb3-funktionswert": {
    "sources": [],
    "maxDifficulty": 2,
    "note": "custom (bleibt): hsLinearFunktionswert; Map-Eintrag k8-lb3-funktionswert damit tot [custom bleibt]"
  },
  "os-hs-k9-lb3-steigung": {
    "sources": [],
    "maxDifficulty": 2,
    "note": "custom (bleibt): hsLinearSteigung; Map-Eintrag k8-lb3-steigung tot [custom bleibt]"
  },
  "os-hs-k9-lb3-achsen": {
    "sources": [],
    "maxDifficulty": 2,
    "note": "custom (bleibt): hsLinearAchsen; Map-Eintrag k8-lb3-achsenabschnitt tot [custom bleibt]"
  },
  "os-hs-k9-lb3-quadrat": {
    "sources": [
      "k9-lb1-quadrat-wert"
    ],
    "maxDifficulty": 2,
    "note": "LP: nur Einblick y=x² bzw. y=a·x²; difficulty 2, nur Variante ohne Scheitelform (D13)"
  },
  "os-hs-k9-lb4-mittelwert": {
    "sources": [
      "k9-lb4-mittelwert"
    ],
    "maxDifficulty": 2,
    "note": "Auswerten von Daten"
  },
  "os-hs-k9-lbw1-median": {
    "sources": [
      "k9-lb4-median"
    ],
    "maxDifficulty": 2,
    "note": "Wahlbereich Statistische Erhebungen"
  },
  "os-hs-k9-lbw1-modal": {
    "sources": [
      "k9-lb4-modalwert"
    ],
    "maxDifficulty": 2,
    "note": "Wahlbereich Statistische Erhebungen (K6-Modal entfällt)"
  },
  "os-hs-k9-lbw1-spannweite": {
    "sources": [
      "k7-lb4-spannweite"
    ],
    "maxDifficulty": 2,
    "note": "Wahlbereich Statistische Erhebungen"
  }
}
```

## Profil 2: Realschulbildungsgang (oberschule-sachsen-rs)

Regeln: Default maxDifficulty 3 ab Kl. 7 (Kl. 5/6 gemeinsam: 2); difficulty 3 nur bei LP-Begründung (LGS Kl. 8; quadratische Gleichung inkl. Lösungsformel Kl. 9).

#### Klasse 5 (RS) - 35 von 50 Themen spielbar

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `os-k5-lb1-runden` | Veranschaulichen, Schätzen, Runden, Vergleichen und Ordnen natürlicher Zahlen | `lb1-runden-natuerlich` | 2 | 1:1 Rundenübung natürlicher Zahlen | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-potenz` | Potenzschreibweise und Zehnerpotenzen | `lb1-potenzieren` | 2 | Quadrat- und Zehnerpotenzen; deckt os-k5-lb1-quadrat inhaltlich mit ab | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-addition` | Addieren natürlicher Zahlen | `lb1-addition` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-subtraktion` | Subtrahieren natürlicher Zahlen | `lb1-subtraktion` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-multiplikation` | Multiplizieren natürlicher Zahlen | `lb1-multiplikation`, `lb1-schriftliches-rechnen` | 2 | LP: mündlich/halbschriftlich/schriftlich multiplizieren; schriftliches Rechnen (Kästchenpapier) ergänzt (neu) | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-division` | Schriftliche Division durch einstelligen Divisor | `lb1-schriftliche-division`, `lb1-division-rest` | 2 | LP: schriftliche Division durch einstelligen Divisor; Rest-Variante ergänzt (neu) | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-quadrat` | Quadratzahl und Quadratwurzel | — | — | Abgedeckt durch lb1-potenzieren (Quadrat- und Zehnerpotenzen) in os-k5-lb1-potenz; Wurzel ohne eigenen Master | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-gleichung` | Einfache Gleichungen und Ungleichungen inhaltlich lösen | `k7-lb2-gleichung-add` | 2 | K7-Master (x + a = b, difficulty 1) für inhaltliches Lösen einfacher Gleichungen; bleibt | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-teilbarkeit` | Teilbarkeit, Vielfache und Teiler | `lb1-teilbarkeit` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-primzahl` | Teilbarkeitsregeln und Primzahlen | `lb1-primzahl` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-null` | Null als kleinste natürliche Zahl | — | — | Reiner Wissensinhalt, kein Master | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb1-rechengesetze` | Rechenstrategien, Rechenvorteile und Rechengesetze | — | — | Kein Master für Rechengesetze/Strategien in K5 | LP OS Mathematik 2019: Kl. 5, LB 1, S. 8 |
| `os-k5-lb2-anteil` | Erkennen und Darstellen gemeiner Brüche und Dezimalzahlen | `lb2-anteil-bruch`, `lb2-grafische-brueche` | 2 | LP: Erkennen und Darstellen gemeiner Brüche; lb2-anteil-bruch neu hier (war HS-K7, dort Dublette) | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-kuerzen` | Echte und unechte Brüche, Kürzen | `lb2-kuerzen` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-erweitern` | Erweitern und Umwandeln von Zehnerbrüchen und Dezimalzahlen | `lb2-erweitern` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-vergleichen` | Vergleichen, Ordnen und Abschätzen gemeiner Brüche | — | — | lb2-zahlenstrahl (Dezimalzahlen) passt besser zu K6-Zahlenstrahl; kein Bruchvergleich-Master in K5 (K6-lb1-vergleichen gehört zu K6) | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-runden-dez` | Runden von Dezimalzahlen | `lb2-runden-dezimal` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-dez-add-sub` | Dezimalzahlen addieren und subtrahieren | `lb2-dez-add-sub` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-dez-mult` | Vervielfachen mit einstelligen natürlichen Zahlen und Zehnerpotenzen | `lb2-dez-mult` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-dez-div` | Teilen durch einstellige natürliche Zahlen und Zehnerpotenzen | `lb2-dez-div` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-prozent` | Prozentschreibweise für bequeme Anteile | — | — | LP K5: nur Einblick Prozentschreibweise; Master lb1-prozent liegt in K7 (HS: Anteile als Prozent, RS: Prozentrechnung) - keine Doppelung im Pack | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-mittelwert` | Arithmetisches Mittel | `lb2-mittelwert` | 2 | K5-Master; K6 nutzt den K7-Master k7-lb4-mittelwert (kein Doppelt im Pack) | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-laenge` | Einheiten umrechnen: Länge | `k5-umrechnen-laenge`, `lb2-ordnen-einheiten` | 2 | k5-umrechnen-laenge existiert nur als Neu-Aufgabenbank (Waise, siehe Coverage); Größen ordnen ergänzt | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-masse` | Einheiten umrechnen: Masse | `k5-umrechnen-masse` | 2 | Neu-Waise (kein Parent in math5.ts) | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb2-zeit` | Einheiten umrechnen: Zeit | `k5-umrechnen-zeit` | 2 | Neu-Waise (kein Parent in math5.ts) | LP OS Mathematik 2019: Kl. 5, LB 2, S. 9 |
| `os-k5-lb3-koordinaten` | Koordinaten und Koordinatensystem (erster Quadrant) | **custom (bleibt)** | 2 | custom (bleibt): OS_CUSTOM_GENERATORS, erster Quadrant laut LP korrekt | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb3-lage` | Lagebeziehungen: parallel, senkrecht, schneiden einander | `lb3-strecken-bezeichnung` | 2 | LP K5 LB3: parallel/senkrecht/schneiden; Strecke/Gerade/Halbgerade als nächste Quelle (neu) | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb3-winkelarten` | Messen und Zeichnen von Winkeln, Winkelarten | `lb3-winkelarten` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb3-winkel-erg` | Winkel zu 90° oder 180° ergänzen | `lb3-winkel-ergaenzung` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb3-wuerfel` | Würfel skizzieren, Körpernetze und Schrägbild | `lb4-wuerfelnetz` | 2 | math6-ID, inhaltlich K5 (Würfelnetz); K6-Darstellen bleibt custom | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb3-umfang` | Umfang als Summe von Seitenlängen | `lb4-umfang-rechteck`, `lb4-umfang-zusammengesetzt` | 2 | LP K5 LB3: Umfang/Fläche an in Rechtecke zerlegbaren Figuren | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb3-flaeche` | Flächeninhaltsformel für das Rechteck | `lb4-flaeche-rechteck`, `lb4-flaeche-zusammengesetzt`, `lb5-sachaufgabe-flaeche` | 2 | LP K5 LB3: Zerlegen/Ergänzen; Sachaufgabe Fläche/Umfang ergänzt | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb3-flaeche-eh` | Einheiten umrechnen: Flächeninhalt | `k5-umrechnen-flaeche` | 2 | Neu-Waise (kein Parent in math5.ts) | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb3-oberflaeche` | Oberfläche als zusammengesetzte Fläche | `lb4-oberflaeche-quader` | 2 | ID-Kollision math5/math6 (D24): K5 bekommt die Quelle, K6 weicht aus | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb3-volumen-wuerfel` | Volumenformel für den Würfel | `lb4-volumen-quader` | 2 | ID-Kollision math5/math6 (D24): K5 bekommt die Quelle, K6 blockiert bis Umbenennung | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb3-volumen-eh` | Einheiten umrechnen: Volumen | `k5-umrechnen-volumen` | 2 | Neu-Waise (kein Parent in math5.ts) | LP OS Mathematik 2019: Kl. 5, LB 3, S. 10 |
| `os-k5-lb4-spiegelung` | Spiegelungen und Verschiebungen, Symmetrieachse | `lb3-achsensymmetrie` | 2 | 1:1 (Geradenspiegelung/Symmetrieachse) | LP OS Mathematik 2019: Kl. 5, LB 4, S. 10 |
| `os-k5-lb4-deckung` | Zeichnen und Analysieren symmetrischer sowie deckungsgleicher Figuren | — | — | Kein Master für deckungsgleiche Figuren zeichnen | LP OS Mathematik 2019: Kl. 5, LB 4, S. 10 |
| `os-k5-lb4-drehung` | Drehungen und Symmetrie in Mustern | — | — | Drehungen nicht im LP K5 LB4 (D2); kein Master | LP OS Mathematik 2019: Kl. 5, LB 4, S. 10 |
| `os-k5-lb4-achsen` | Achsen- und Punktsymmetrie erkennen | — | — | Punktsymmetrie nicht im LP K5 LB4 (D2); lb3-punktsymmetrie anderweitig verwendet bzw. ungenutzt | LP OS Mathematik 2019: Kl. 5, LB 4, S. 10 |
| `os-k5-lb4-verschiebungsweite` | Verschiebungsrichtung und Verschiebungsweite | `lb3-verschiebung` | 2 | LP K5 LB4: Verschiebungsrichtung/-weite (neu) | LP OS Mathematik 2019: Kl. 5, LB 4, S. 10 |
| `os-k5-lbw1-zahlzeichen` | Zahlzeichen verschiedener Epochen und Kulturkreise | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 5, Wahlbereich 1, S. 11 |
| `os-k5-lbw1-abakus` | Darstellung und Rechnen mit Abakus oder Rechenpfennigen | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 5, Wahlbereich 1, S. 11 |
| `os-k5-lbw1-stellenwert` | Stellenwertsysteme im Vergleich | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 5, Wahlbereich 1, S. 11 |
| `os-k5-lbw2-daten` | Erfassen und Darstellen von Daten (Urliste, Tabelle, Säulendiagramm) | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 5, Wahlbereich 2, S. 11 |
| `os-k5-lbw2-kombinatorik` | Einfache kombinatorische Zählstrategien | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 5, Wahlbereich 2, S. 11 |
| `os-k5-lbw2-mittel` | Mittelwert aus Klassendaten | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 5, Wahlbereich 2, S. 11 |
| `os-k5-lbw3-angebote` | Angebote vergleichen, Zeitpläne und Fahrtkosten | `lb5-gesamtpreis` | 2 | Wahlbereich Klassenfahrt: Gesamtpreis/Angebote (neu) | LP OS Mathematik 2019: Kl. 5, Wahlbereich 3, S. 12 |
| `os-k5-lbw3-budget` | Budget und Stückkosten berechnen | `lb5-mehrstufig`, `lb5-teilen` | 2 | Budget und Stückkosten (neu) | LP OS Mathematik 2019: Kl. 5, Wahlbereich 3, S. 12 |
| `os-k5-lbw3-zeit` | Fahrzeiten und Zeitpläne | — | — | Fahrzeiten/Zeitpläne: kein Master | LP OS Mathematik 2019: Kl. 5, Wahlbereich 3, S. 12 |

#### Klasse 6 (RS) - 31 von 48 Themen spielbar

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `os-k6-lb1-erweiterung` | Notwendigkeit einer Zahlenbereichserweiterung, Mengenbegriff | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-zahlenstrahl` | Gebrochene Zahlen am Zahlenstrahl veranschaulichen | `lb2-zahlenstrahl` | 2 | LP K6 LB1: Veranschaulichen am Zahlenstrahl (neu) | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-negative-ausblick` | Ausblick: negative Zahlen in Sachproblemen | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-kuerzen` | Erweitern und Kürzen | `lb1-kuerzen` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-erweitern` | Erweitern gemeiner Brüche | `lb1-erweitern` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-bruch-dez` | Umwandeln gemeiner Brüche in Dezimalzahlen und umgekehrt | `lb1-bruch-dezimal` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-vergleichen` | Vergleichen und Ordnen gebrochener Zahlen | `lb1-vergleichen` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-add-sub` | Addieren und Subtrahieren gebrochener Zahlen | `lb1-add-sub-brueche` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-mult` | Multiplizieren gebrochener Zahlen | `lb1-mult-brueche` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-div` | Dividieren gebrochener Zahlen | `lb1-div-brueche` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-dez-add-sub` | Dezimalzahlen addieren und subtrahieren | `lb1-dez-add-sub` | 2 | 1:1 (math6-ID, distinkt von K5 lb2-dez-add-sub) | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-dez-mult` | Dezimalzahlen multiplizieren | `lb1-dez-mult` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-dez-div` | Dezimalzahlen dividieren | `lb1-dez-div` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-runden` | Überschlagen, Abschätzen und Runden | `lb1-runden` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-mittelwert` | Arithmetisches Mittel | `k7-lb4-mittelwert` | 2 | LP K6 LB1: arithmetisches Mittel; K7-Master, damit lb2-mittelwert nur in K5 liegt | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb1-verhaeltnis` | Verhältnisgleichungen | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Kl. 6, LB 1, S. 13-14 |
| `os-k6-lb2-arten` | Eindeutige, eineindeutige und mehrdeutige Zuordnungen | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Kl. 6, LB 2, S. 14 |
| `os-k6-lb2-prop` | Direkt proportionale Zuordnung (Dreisatz) | `lb2-proportional` | 2 | 1:1 Dreisatz direkt | LP OS Mathematik 2019: Kl. 6, LB 2, S. 14 |
| `os-k6-lb2-antiprop` | Indirekt proportionale Zuordnung | `lb2-antiproportional` | 2 | 1:1 Dreisatz indirekt | LP OS Mathematik 2019: Kl. 6, LB 2, S. 14 |
| `os-k6-lb2-anteil` | Anteil einer Größe berechnen | `lb1-sachaufgabe-bruch` | 2 | Titel nicht im LP K6 LB2 (D6); Bruchteil-Sachaufgaben als Ersatzquelle, lb5-anteil-groesse geht nach K7 | LP OS Mathematik 2019: Kl. 6, LB 2, S. 14 |
| `os-k6-lb2-darstellung` | Darstellung in Wort, Tabelle, Koordinatensystem und Gleichung | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Kl. 6, LB 2, S. 14 |
| `os-k6-lb3-nebenwinkel` | Nebenwinkelsatz | `k7-lb1-nebenwinkel` | 2 | LP K6 LB3: Nebenwinkelsatz (K7-Master) | LP OS Mathematik 2019: Kl. 6, LB 3, S. 14-15 |
| `os-k6-lb3-scheitel` | Scheitelwinkelsatz und Stufen- bzw. Wechselwinkel | `k7-lb1-scheitelwinkel` | 2 | LP K6 LB3: Scheitel-/Stufen-/Wechselwinkel (K7-Master) | LP OS Mathematik 2019: Kl. 6, LB 3, S. 14-15 |
| `os-k6-lb3-innenwinkel` | Innenwinkelsatz für Dreiecke | `lb3-winkel-dreieck` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 3, S. 14-15 |
| `os-k6-lb3-einteilung` | Einteilung der Dreiecke nach Seiten und Winkeln | `k7-lb1-basiswinkel` | 2 | Dreiecke nach Seiten und Winkeln; Basiswinkel gleichschenklig als Näherung (neu) | LP OS Mathematik 2019: Kl. 6, LB 3, S. 14-15 |
| `os-k6-lb3-kongruenz` | Kongruenzsätze, Seiten-Winkel-Relation und Dreiecksungleichung | `lb3-kongruenzsatz` | 2 | 1:1; RS-K8 Kongruenz bekommt keine zweite Quelle | LP OS Mathematik 2019: Kl. 6, LB 3, S. 14-15 |
| `os-k6-lb3-flaeche-dreieck` | Flächeninhalt von Dreiecken (Grundseite und Höhe) | `lb3-flaeche-dreieck` | 2 | 1:1; K7/K10 ohne Doppelung | LP OS Mathematik 2019: Kl. 6, LB 3, S. 14-15 |
| `os-k6-lb3-parallelogramm` | Flächeninhalt von Parallelogramm, Drachenviereck und Trapez | — | — | Kein Master für Parallelogramm/Drachen/Trapez-Fläche | LP OS Mathematik 2019: Kl. 6, LB 3, S. 14-15 |
| `os-k6-lb3-umfang` | Umfangsberechnung | `lb3-umfang-rechteck`, `lb3-sachaufgabe-geometrie` | 2 | Umfang; Sachaufgabe Fläche/Umfang ergänzt (neu) | LP OS Mathematik 2019: Kl. 6, LB 3, S. 14-15 |
| `os-k6-lb3-flaeche-rechteck` | Flächeninhalt von Rechteck und Quadrat | `lb3-flaeche-rechteck` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 3, S. 14-15 |
| `os-k6-lb3-winkelsumme-viereck` | Winkelsumme im Viereck | `lb3-winkel-viereck` | 2 | 1:1; im LP K6 LB3 nicht ausdrücklich genannt, Gym-Quelle belassen | LP OS Mathematik 2019: Kl. 6, LB 3, S. 14-15 |
| `os-k6-lb4-darstellen` | Grundriss, Seitenansichten, Schrägbild und Körpernetz | **custom (bleibt)** | 2 | custom (bleibt): osPrismNetz (Prismen-Netze) | LP OS Mathematik 2019: Kl. 6, LB 4, S. 15 |
| `os-k6-lb4-volumen-quader` | Volumen von Quader und Würfel | — | — | BLOCKIERT: math6-ID lb4-volumen-quader kollidiert mit math5 (Katalog nimmt math5 = gleiche Aufgaben wie K5); erst nach Umbenennung der math6-ID mappbar (D24) | LP OS Mathematik 2019: Kl. 6, LB 4, S. 15 |
| `os-k6-lb4-oberflaeche` | Oberfläche als zusammengesetzte Fläche | `lb4-flaeche-kante-quader` | 2 | Ausweichquelle wegen ID-Kollision lb4-oberflaeche-quader (D24); Fläche/Seitenlänge am Quader | LP OS Mathematik 2019: Kl. 6, LB 4, S. 15 |
| `os-k6-lb4-volumen-prisma` | Volumen gerader Prismen | `lb4-volumen-prisma` | 2 | 1:1 | LP OS Mathematik 2019: Kl. 6, LB 4, S. 15 |
| `os-k6-lb5-probieren` | Problemlösestrategien: systematisches Probieren, Zurückführen auf Bekanntes | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Kl. 6, LB 5, S. 16 |
| `os-k6-lb5-haeufigkeit` | Zufallsversuche: absolute und relative Häufigkeit | `lb2-haeufigkeit` | 2 | LP K6 LB5: absolute/relative Häufigkeit | LP OS Mathematik 2019: Kl. 6, LB 5, S. 16 |
| `os-k6-lb5-anteil-prozent` | Anteile in Prozent | — | — | D5: Prozentrechnung nicht im LP K6; Master lb5-anteil-prozent nach K7 verlagert (vorher: lb5-anteil-prozent) | LP OS Mathematik 2019: Kl. 6, LB 5, S. 16 |
| `os-k6-lb5-praesentation` | Präsentation zu geometrischen Figuren und Körpern in der Umwelt | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Kl. 6, LB 5, S. 16 |
| `os-k6-lbw1-dgs` | Geometrische Objekte mit dynamischer Geometriesoftware | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 6, Wahlbereich 1, S. 16 |
| `os-k6-lbw1-konstruktion` | Grundkonstruktionen am Computer | `lb3-strecken-mittelpunkt` | 2 | Wahlbereich DGS: Streckenmittelpunkt/Grundkonstruktion (neu) | LP OS Mathematik 2019: Kl. 6, Wahlbereich 1, S. 16 |
| `os-k6-lbw1-messen` | Längen und Winkel dynamisch messen | `lb3-strecken-laenge` | 2 | Wahlbereich DGS: Längen messen (neu) | LP OS Mathematik 2019: Kl. 6, Wahlbereich 1, S. 16 |
| `os-k6-lbw2-spiele` | Spiele zur Problemlösefähigkeit, Raumanschauung und Stochastik | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 6, Wahlbereich 2, S. 16 |
| `os-k6-lbw2-strategie` | Strategiespiele und Gewinnzüge | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 6, Wahlbereich 2, S. 16 |
| `os-k6-lbw2-wuerfel` | Würfelspiele und relative Häufigkeit | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 6, Wahlbereich 2, S. 16 |
| `os-k6-lbw3-mittelwert` | Arithmetisches Mittel bei Datenerhebungen | — | — | LP K6 Wahl 3 nennt arithmetisches Mittel, aber Master (lb2-mittelwert, k7-lb4-mittelwert) bereits in K5/K6-LB1 verbraucht (vorher: lb2-mittelwert, Dublette) | LP OS Mathematik 2019: Kl. 6, Wahlbereich 3, S. 17 |
| `os-k6-lbw3-modal` | Modalwert, Maximum und Minimum | — | — | Modalwert-Master k9-lb4-modalwert liegt im jeweiligen K9-Thema (LP dort Pflicht bzw. Wahl 1); vorher in K6 Dublette | LP OS Mathematik 2019: Kl. 6, Wahlbereich 3, S. 17 |
| `os-k6-lbw3-diagramm` | Säulen- und Kreisdiagramme lesen | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Kl. 6, Wahlbereich 3, S. 17 |

#### Klasse 7 (RS) - 23 von 41 Themen spielbar

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `os-rs-k7-lb1-dreisatz` | Dreisatz auf Grundaufgaben der Prozentrechnung | `lb2-sachaufgabe-dreisatz`, `lb5-anteil-groesse` | 3 | LP RS K7 LB1: Dreisatz auf Grundaufgaben der Prozentrechnung | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 1, S. 29 |
| `os-rs-k7-lb1-prozent` | Bequeme Prozentsätze, Prozentwert, Prozentsatz, Grundwert | `lb1-prozent`, `lb5-anteil-prozent` | 3 | Bequeme Prozentsätze, Grundaufgaben; aus K5/K6 verlagert (D5) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 1, S. 29 |
| `os-rs-k7-lb1-kreisdiagramm` | Darstellung im Kreisdiagramm | **custom (bleibt)** | 3 | custom (bleibt): osPieAnteil; Map-Fallback lb2-grafische-brueche tot | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 1, S. 29 |
| `os-rs-k7-lb1-preisaenderung` | Preiserhöhung und Preissenkung | `k10-lb1-prozentuale-zunahme` | 3 | Preiserhöhung/-senkung | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 1, S. 29 |
| `os-rs-k7-lb1-zinsen` | Zinssatz, Zinsen, Kapital | `k10-lb1-zinsen` | 3 | Zinssatz, Zinsen, Kapital | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 1, S. 29 |
| `os-rs-k7-lb1-zinseszins` | Tageszins und Zinseszins | `k10-lb1-zinseszins` | 3 | LP RS K7 LB1: Tageszins, Zinseszins ausdrücklich (Heimat; K10-Doppelung entfällt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 1, S. 29 |
| `os-rs-k7-lb2-versuch` | Zufallsversuche: Ergebnis, Ergebnismenge, Ereignis | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 2, S. 29 |
| `os-rs-k7-lb2-haeufigkeit` | Urliste, absolute und relative Häufigkeit | `k7-lb4-rel-haeufigkeit` | 3 | Urliste, abs./rel. Häufigkeit | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 2, S. 29 |
| `os-rs-k7-lb2-laplace` | Wahrscheinlichkeit als Bruch | — | — | D23: Laplace-Formel gehört in RS K8 LB5 (vorher: k8-lb2-laplace-bruch, Dublette zu K8) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 2, S. 29 |
| `os-rs-k7-lb2-laplace-pct` | Wahrscheinlichkeit in Prozent | — | — | D23: siehe oben (vorher: k8-lb2-laplace-prozent); jetzt Baumdiagramm in K8 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 2, S. 29 |
| `os-rs-k7-lb3-ordnen` | Veranschaulichen, Vergleichen und Ordnen rationaler Zahlen | `k7-lb2-betrag` | 3 | bleibt | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 3, S. 29-30 |
| `os-rs-k7-lb3-add` | Rationale Zahlen addieren | `k7-lb2-add-rational` | 3 | 1:1 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 3, S. 29-30 |
| `os-rs-k7-lb3-sub` | Rationale Zahlen subtrahieren | `k7-lb2-sub-rational` | 3 | 1:1 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 3, S. 29-30 |
| `os-rs-k7-lb3-mul` | Rationale Zahlen multiplizieren und potenzieren | `k7-lb2-mul-rational` | 3 | 1:1 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 3, S. 29-30 |
| `os-rs-k7-lb3-div` | Rationale Zahlen dividieren | `k7-lb2-div-rational` | 3 | 1:1 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 3, S. 29-30 |
| `os-rs-k7-lb3-term` | Rechengesetze und Termwerte | `k7-lb2-term-vorrang` | 3 | 1:1 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 3, S. 29-30 |
| `os-rs-k7-lb3-venn` | Zahlbereiche systematisieren (Venn-Diagramm) | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 3, S. 29-30 |
| `os-rs-k7-lb3-gleichung` | Gleichungen der Form a·x+b = c | `k7-lb2-gleichung-mul` | 3 | LP RS K7 LB3: Gleichungen kalkülmäßig (gleichung-add liegt in K5); vorher Dublette zu K8 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 3, S. 29-30 |
| `os-rs-k7-lb3-gleichung-beid` | Gleichungen der Form a·x+b = c·x+d | `k8-lb1-gleichung-beidseitig` | 3 | Form a·x+b=c·x+d (LP K7); K8 bekommt keine zweite Quelle | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 3, S. 29-30 |
| `os-rs-k7-lb3-zahlenraetsel` | Aufstellen von Gleichungen, Zahlenrätsel | `k8-lb5-zahlenraetsel` | 3 | Aufstellen von Gleichungen | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 3, S. 29-30 |
| `os-rs-k7-lb3-koordinaten` | Punktkoordinaten in vier Quadranten | `lb3-koordinaten-eintragen`, `lb3-koordinaten-ablesen` **custom (bleibt)** | 3 | custom (bleibt): osQ1CoordinatePlace nur 1. Quadrant, LP verlangt vier Quadranten (D10); Master als Beimischung empfohlen | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 3, S. 29-30 |
| `os-rs-k7-lb4-konstruieren` | Konstruktion von Parallelogramm, Drachenviereck und Trapez | `k7-lb1-mittelsenkrechte-schritte` | 3 | bleibt | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 4, S. 30 |
| `os-rs-k7-lb4-flaeche-dreieck` | Flächeninhalt von Dreiecken | — | — | Master lb3-flaeche-dreieck gehört zu K6 LB3 (vorher Dublette) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 4, S. 30 |
| `os-rs-k7-lb4-umfang` | Umfang von Dreiecken und Vierecken | — | — | Master lb3-umfang-rechteck gehört zu K6 (vorher Dublette) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 4, S. 30 |
| `os-rs-k7-lb4-winkelsumme` | Innenwinkelsumme im Vieleck | — | — | D9: im RS-LP K7 LB4 nicht genannt; Heimat RS K10 LB1 (vorher: k7-lb1-winkelsumme-vieleck) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 4, S. 30 |
| `os-rs-k7-lb4-vieleck-flaeche` | Flächeninhalt und Umfang von Vielecken | — | — | Master lb4-flaeche-zusammengesetzt gehört zu K5 LB3 (vorher Dublette); kein RS-Wiederholungsauftrag im LP | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 4, S. 30 |
| `os-rs-k7-lb4-darstellen` | Körpernetze, Schrägbilder und senkrechte Zweitafelbilder | **custom (bleibt)** | 3 | custom (bleibt): osPrismNetz | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 4, S. 30 |
| `os-rs-k7-lb4-zweitafel` | Senkrechte Zweitafelprojektion: Grund- und Aufriss | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 4, S. 30 |
| `os-rs-k7-lb4-volumen-prisma` | Volumen gerader Prismen | `k7-lb3-volumen-prisma` | 3 | K7-Master (vorher K6-Quelle, Dublette) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 4, S. 30 |
| `os-rs-k7-lb4-mantel` | Mantelfläche eines Prismas | `k7-lb3-mantel-prisma` | 3 | 1:1 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 4, S. 30 |
| `os-rs-k7-lb4-oberflaeche` | Oberflächeninhalt von Prismen und Quadern | `k7-lb3-oberflaeche-quader` | 3 | K7-Master (vorher K5/K6-Dublette) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 4, S. 30 |
| `os-rs-k7-lb4-masse` | Masse unter Einbeziehung der Dichte | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, LB 4, S. 30 |
| `os-rs-k7-lbw1-zeichnen` | Lesen technischer Zeichnungen, Schnitte und Bemaßung | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, Wahlbereich 1, S. 30 |
| `os-rs-k7-lbw1-schnitt` | Schnittdarstellungen verstehen | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, Wahlbereich 1, S. 30 |
| `os-rs-k7-lbw1-mass` | Bemaßung und Maßlinien | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, Wahlbereich 1, S. 30 |
| `os-rs-k7-lbw2-knobel` | Andere Rechenverfahren und Unterhaltungsmathematik | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, Wahlbereich 2, S. 31 |
| `os-rs-k7-lbw2-zahlen` | Zahlenrätsel und magische Quadrate | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, Wahlbereich 2, S. 31 |
| `os-rs-k7-lbw2-logik` | Logikspiele und Schlussfolgern | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, Wahlbereich 2, S. 31 |
| `os-rs-k7-lbw3-parkett` | Parkettierung der Ebene | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, Wahlbereich 3, S. 31 |
| `os-rs-k7-lbw3-symmetrie` | Symmetrie in Parketten | `lb3-punktsymmetrie` | 3 | Wahlbereich Parkettierungen: Symmetrie (neu, K5-Master) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, Wahlbereich 3, S. 31 |
| `os-rs-k7-lbw3-fliese` | Fliesenmuster berechnen | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 7, Wahlbereich 3, S. 31 |

#### Klasse 8 (RS) - 20 von 43 Themen spielbar

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `os-rs-k8-lb1-term` | Termwertberechnung | `k8-lb1-term-auswerten` | 3 | 1:1 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 1, S. 33 |
| `os-rs-k8-lb1-zusammenfassen` | Addition und Subtraktion von Summen | `k8-lb1-zusammenfassen` | 3 | 1:1 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 1, S. 33 |
| `os-rs-k8-lb1-ausmult` | Multiplikation eines Faktors mit einer Summe | `k8-lb1-ausmultiplizieren` | 3 | 1:1 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 1, S. 33 |
| `os-rs-k8-lb1-ausklammern` | Ausklammern eines Faktors | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 1, S. 33 |
| `os-rs-k8-lb1-gleichung` | Kalkülmäßiges Lösen linearer Gleichungen | `k8-lb1-gleichung-linear` | 3 | Heimat k8-lb1-gleichung-linear; K7 nutzt gleichung-mul/-beidseitig | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 1, S. 33 |
| `os-rs-k8-lb1-gleichung-beid` | Gleichung mit x auf beiden Seiten | — | — | Heimat RS K7 LB3 (k8-lb1-gleichung-beidseitig bereits dort; vorher Dublette) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 1, S. 33 |
| `os-rs-k8-lb1-formel` | Umstellen von Formeln | `k8-lb5-rueckwaerts` | 3 | Umstellen von Formeln ~ Rückwärtsrechnen (neu) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 1, S. 33 |
| `os-rs-k8-lb2-funktion` | Funktion als eindeutige Zuordnung | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 2, S. 33 |
| `os-rs-k8-lb2-funktionswert` | Funktionswert einer linearen Funktion | `k8-lb3-funktionswert` | 3 | 1:1 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 2, S. 33 |
| `os-rs-k8-lb2-steigung` | Steigung aus zwei Punkten | `k8-lb3-steigung` | 3 | 1:1 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 2, S. 33 |
| `os-rs-k8-lb2-achsen` | y-Achsenabschnitt bestimmen | `k8-lb3-achsenabschnitt` | 3 | 1:1 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 2, S. 33 |
| `os-rs-k8-lb2-nullstelle` | Zeichnerisches und rechnerisches Ermitteln von Nullstellen | `k1112-lb1-nullstelle-linear` | 3 | Nullstelle linearer Funktion (neu; Master stammt aus 11/12, Inhalt K8-tauglich, difficulty 2) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 2, S. 33 |
| `os-rs-k8-lb2-definitionsbereich` | Definitions- und Wertebereich linearer Funktionen | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 2, S. 33 |
| `os-rs-k8-lb2-tarif` | Tarif- und Preisvergleiche mit linearen Funktionen | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 2, S. 33 |
| `os-rs-k8-lb2-lgs` | Lineares Gleichungssystem | `k8-lb3-lgs` | 3 | LP RS K8 LB2 verlangt LGS (difficulty 3 begründet) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 2, S. 33 |
| `os-rs-k8-lb3-lage` | Lagebeziehungen von Kreis und Gerade, Satz des Thales | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 3, S. 33-34 |
| `os-rs-k8-lb3-sekante-tangente` | Sekante und Tangente am Kreis | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 3, S. 33-34 |
| `os-rs-k8-lb3-kreis-umfang` | Umfang eines Kreises | `k9-lb2-kreis-umfang` | 3 | 1:1 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 3, S. 33-34 |
| `os-rs-k8-lb3-kreis-flaeche` | Flächeninhalt eines Kreises und Kreisrings | `k9-lb2-kreis-flaeche` | 3 | 1:1 (Kreisring ohne Master) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 3, S. 33-34 |
| `os-rs-k8-lb3-darstellen` | Netz, Ansichten und Schrägbild von Kreis- und Hohlzylinder | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 3, S. 33-34 |
| `os-rs-k8-lb3-zylinder` | Volumen von Kreis- und Hohlzylindern | `k9-lb2-zylinder-volumen` | 3 | Heimat LP RS K8 LB3; K9-Zylinder entfällt (D16) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 3, S. 33-34 |
| `os-rs-k8-lb4-streckfaktor` | Zentrische Streckung, Streckfaktor | `k8-lb4-streckfaktor` | 3 | 1:1 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 4, S. 34 |
| `os-rs-k8-lb4-strahlensatz` | Strahlensatz: fehlende Länge | `k8-lb4-strahlensatz` | 3 | 1:1 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 4, S. 34 |
| `os-rs-k8-lb4-aehnlich` | Ähnliche Figuren: Seitenlänge, Flächen und Volumen | `k8-lb4-aehnliche-seite` | 3 | 1:1 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 4, S. 34 |
| `os-rs-k8-lb4-kongruenz` | Kongruenz als Spezialfall der Ähnlichkeit | — | — | Kongruenzsatz-Master liegt in K6 (kein zweites Mal); LP: Kongruenz als Spezialfall der Ähnlichkeit ohne Master (vorher: lb3-kongruenzsatz) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 4, S. 34 |
| `os-rs-k8-lb5-simulation` | Simulation von Zufallsversuchen | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 5, S. 34 |
| `os-rs-k8-lb5-laplace` | Wahrscheinlichkeiten und kombinatorisches Zählen | `k8-lb2-laplace-bruch` | 3 | Laplace/kombinatorisches Zählen (aus K7 hierher, D23) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 5, S. 34 |
| `os-rs-k8-lb5-gegen` | Gegenwahrscheinlichkeit | `k8-lb2-gegenwahrscheinlichkeit` | 3 | 1:1 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 5, S. 34 |
| `os-rs-k8-lb5-baum` | Mehrstufige Zufallsversuche, Baumdiagramm und Pfadregeln | `k8-lb2-laplace-prozent` | 3 | Baumdiagramm-Aufgaben liegen nach Neu-Merge in den Laplace-Eltern; Verteilung in E1/E2 prüfen | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 5, S. 34 |
| `os-rs-k8-lb5-abhaengig` | Abhängige und unabhängige Ereignisse | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 5, S. 34 |
| `os-rs-k8-lb6-kosten` | Lebenshaltungs- und Baukosten | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 6, S. 35 |
| `os-rs-k8-lb6-lebenshaltung` | Lebenshaltungskosten: Miete, Energie, Versicherungen | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 6, S. 35 |
| `os-rs-k8-lb6-zinsen` | Vergleich von Angeboten, Sparanlagen und Ratenzahlungen | `k10-lb5-kapital`, `k10-lb5-zinssatz` | 3 | Sparanlagen/Zinsen (neu, vorher Dublette) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 6, S. 35 |
| `os-rs-k8-lb6-prozent` | Prozentrechnung in Alltagsbezügen | — | — | Prozentgrundaufgaben: Heimat K7 (vorher Dublette lb5-anteil-prozent) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, LB 6, S. 35 |
| `os-rs-k8-lbw1-fahrrad` | Kenndaten, Wegstrecken und Geschwindigkeiten am Fahrrad | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, Wahlbereich 1, S. 35 |
| `os-rs-k8-lbw1-umfang` | Radumfang und zurückgelegte Strecke | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, Wahlbereich 1, S. 35 |
| `os-rs-k8-lbw1-tempo` | Durchschnittsgeschwindigkeit berechnen | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, Wahlbereich 1, S. 35 |
| `os-rs-k8-lbw2-modell` | Maßstäbliches Vergrößern und Verkleinern im Modellbau | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, Wahlbereich 2, S. 35 |
| `os-rs-k8-lbw2-massstab` | Maßstab umrechnen | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, Wahlbereich 2, S. 35 |
| `os-rs-k8-lbw2-volumen` | Volumenveränderung bei Maßstab | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, Wahlbereich 2, S. 35 |
| `os-rs-k8-lbw3-polyeder` | Reguläre und halbreguläre Polyeder | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, Wahlbereich 3, S. 35 |
| `os-rs-k8-lbw3-netz` | Netze von Polyedern | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, Wahlbereich 3, S. 35 |
| `os-rs-k8-lbw3-euler` | Eulersche Polyederformel (Idee) | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 8, Wahlbereich 3, S. 35 |

#### Klasse 9 (RS) - 15 von 33 Themen spielbar

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `os-rs-k9-lb1-hyp` | Satz des Pythagoras: Hypotenuse | `k9-lb3-pythagoras-hypotenuse` | 3 | 1:1; K10-Wiederholung entfällt | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 1, S. 36 |
| `os-rs-k9-lb1-kathete` | Satz des Pythagoras: fehlende Kathete | `k9-lb3-pythagoras-kathete` | 3 | 1:1 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 1, S. 36 |
| `os-rs-k9-lb1-trig` | Sinus, Kosinus und Tangens im rechtwinkligen Dreieck | `k9-lb3-trig-wert` | 3 | Sinus/Kosinus/Tangens (LP RS K9 LB1) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 1, S. 36 |
| `os-rs-k9-lb1-umkehrung` | Umkehrung des Satzes des Pythagoras | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 1, S. 36 |
| `os-rs-k9-lb1-sach` | Seitenlängen, Höhen und Winkel in Sachaufgaben | `k9-lb5-leiter` | 3 | Sachaufgaben | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 1, S. 36 |
| `os-rs-k9-lb2-darstellen` | Schrägbild, Netz und Zweitafelbild von Pyramide und Kreiskegel | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 2, S. 37 |
| `os-rs-k9-lb2-pyramide` | Volumen und Oberfläche von Pyramiden | `k7-lb3-volumen-pyramide`, `k7-lb3-oberflaeche-pyramide` | 3 | LP: Mantel/Oberfläche/Volumen von Pyramiden (Oberfläche neu) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 2, S. 37 |
| `os-rs-k9-lb2-kegel` | Mantellinie, Mantel und Volumen von Kreiskegeln | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 2, S. 37 |
| `os-rs-k9-lb2-zylinder` | Volumen eines Kreiszylinders | — | — | D16: Kreiszylinder gehört zu RS K8 LB3 (vorher Dublette) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 2, S. 37 |
| `os-rs-k9-lb2-kugel` | Oberflächeninhalt und Volumen der Kugel | `k9-lb2-kugel-volumen` | 3 | LP RS K9 LB2: Kugel; K10-Doppelung entfällt | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 2, S. 37 |
| `os-rs-k9-lb2-zusammengesetzt` | Zusammengesetzte Körper | `lb4-volumen-zusammengesetzt` | 3 | LP RS K9 LB2: Anwenden auf zusammengesetzte Körper | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 2, S. 37 |
| `os-rs-k9-lb3-quadrat` | Wert einer quadratischen Funktion | `k9-lb1-quadrat-wert` | 3 | Funktionswert quadratischer Funktion | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 3, S. 37 |
| `os-rs-k9-lb3-scheitel` | Scheitelpunkt aus der Scheitelform | `k9-lb1-scheitel` | 3 | Scheitelpunkt (LP: y=(x-d)²+e) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 3, S. 37 |
| `os-rs-k9-lb3-gleichung` | Quadratische Gleichungen lösen | `k10-lb4-reinquadratisch`, `k10-lb4-quadratische-gleichung` | 3 | LP: quadratische Gleichungen inkl. Lösungsformel -> difficulty 3 begründet | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 3, S. 37 |
| `os-rs-k9-lb3-potenz-prod` | Potenzgesetz: Produkt gleicher Basis | — | — | D15: Potenzgesetze nicht im RS-LP K9 (Potenzfunktionen erst K10 LB2); vorher k9-lb1-potenz-produkt | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 3, S. 37 |
| `os-rs-k9-lb3-potenz-quot` | Potenzgesetz: Quotient und Potenz einer Potenz | — | — | D15: siehe oben; vorher k9-lb1-potenz-quotient | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 3, S. 37 |
| `os-rs-k9-lb3-nullstellen` | Nullstellen und Schnittpunktkoordinaten | `k10-lb3-quadrat-seite`, `k10-lb3-rechteck-breite`, `k10-lb3-rechteck-umfang` | 3 | nur Sachproblem-Variante (LP: Anwenden auf Sachprobleme); Nullstellen/Schnittpunkte rechnerisch ohne Master | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 3, S. 37 |
| `os-rs-k9-lb3-fall` | Prinzip der Fallunterscheidung | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 3, S. 37 |
| `os-rs-k9-lb3-monotonie` | Monotonieverhalten und Wertebereich quadratischer Funktionen | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 3, S. 37 |
| `os-rs-k9-lb4-medien` | Darstellungen und Inhalte von Datenerhebungen beurteilen | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 4, S. 38 |
| `os-rs-k9-lb4-mittelwert` | Arithmetisches Mittel | `k9-lb4-mittelwert` | 3 | 1:1 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 4, S. 38 |
| `os-rs-k9-lb4-median` | Zentralwert (Median) | `k9-lb4-median` | 3 | 1:1 | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 4, S. 38 |
| `os-rs-k9-lb4-modal` | Modalwert | `k9-lb4-modalwert` | 3 | 1:1 (K6-Modal entfällt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 4, S. 38 |
| `os-rs-k9-lb4-spannweite` | Maximum, Minimum und Spannweite | `k7-lb4-spannweite` | 3 | Max/Min/Spannweite | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, LB 4, S. 38 |
| `os-rs-k9-lbw1-gold` | Goldener Schnitt als Streckenverhältnis | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, Wahlbereich 1, S. 38 |
| `os-rs-k9-lbw1-rechteck` | Goldenes Rechteck konstruieren | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, Wahlbereich 1, S. 38 |
| `os-rs-k9-lbw1-natur` | Goldener Schnitt in Natur und Kunst | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, Wahlbereich 1, S. 38 |
| `os-rs-k9-lbw2-laenge` | Wahre Länge von Kanten und wahre Gestalt von Schnittflächen | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, Wahlbereich 2, S. 38 |
| `os-rs-k9-lbw2-schnitt` | Schnittebenen an Körpern | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, Wahlbereich 2, S. 38 |
| `os-rs-k9-lbw2-netz` | Netze und wahre Gestalt | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, Wahlbereich 2, S. 38 |
| `os-rs-k9-lbw3-sport` | Wettkampfsysteme und Auswertung eines Sportfestes | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, Wahlbereich 3, S. 38 |
| `os-rs-k9-lbw3-tabelle` | Tabellen und Ranglisten | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, Wahlbereich 3, S. 38 |
| `os-rs-k9-lbw3-statistik` | Mittelwerte bei Sportleistungen | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 9, Wahlbereich 3, S. 38 |

#### Klasse 10 (RS) - 5 von 32 Themen spielbar

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `os-rs-k10-lb1-system` | Systematisieren der Dreiecke und Vierecke | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 1, S. 40 |
| `os-rs-k10-lb1-trig` | Trigonometrische Beziehungen in beliebigen Dreiecken | — | — | D17: Sinus-/Kosinussatz hat keinen Master; k9-lb3-trig-wert gehört zu K9 (vorher Dublette) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 1, S. 40 |
| `os-rs-k10-lb1-hyp` | Seitenlängen mit dem Satz des Pythagoras | — | — | D17: Pythagoras ist K9 LB1; in K10 LB1 nicht gefordert (vorher Dublette) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 1, S. 40 |
| `os-rs-k10-lb1-winkelsumme` | Winkelgrößen in Vielecken | `k7-lb1-winkelsumme-vieleck` | 3 | LP RS K10 LB1: Winkelgrößen in Vielecken (Heimat; K7-Doppelung entfällt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 1, S. 40 |
| `os-rs-k10-lb1-flaeche-dreieck` | Flächeninhalte in Dreiecken und Vielecken | — | — | Master lb3-flaeche-dreieck gehört zu K6 (vorher Dublette); Dreiecksfläche mit Sinus ohne Master | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 1, S. 40 |
| `os-rs-k10-lb2-potenz` | Potenzfunktionen y = a·xⁿ | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 2, S. 41 |
| `os-rs-k10-lb2-quadrat` | Quadratische Zusammenhänge | `k10-lb4-parabel-wert` | 3 | Potenzfunktion y=a·x² (LP K10 LB2); K9 nutzt quadrat-wert | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 2, S. 41 |
| `os-rs-k10-lb2-exp` | Exponentialfunktionen und Wachstumsvorgänge | `k10-lb1-exp-wachstum` | 3 | Exponentialfunktionen/Wachstum | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 2, S. 41 |
| `os-rs-k10-lb2-zinseszins` | Zinseszins: Endkapital | — | — | D18: Zinseszins Heimat RS K7 LB1 (vorher Dublette) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 2, S. 41 |
| `os-rs-k10-lb2-zunahme` | Prozentuale Zunahme | — | — | D18: prozentuale Zunahme Heimat RS K7 LB1 (vorher Dublette) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 2, S. 41 |
| `os-rs-k10-lb2-sinus` | Sinusfunktion, Periodizität, Grad- und Bogenmaß | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 2, S. 41 |
| `os-rs-k10-lb2-sinus-parameter` | Sinusfunktion: Parameter, Amplitude und Periode | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 2, S. 41 |
| `os-rs-k10-lb3-zufall` | Verwenden von Zufallsgrößen | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 3, S. 41 |
| `os-rs-k10-lb3-erwartung` | Erwartungswert einer Zufallsgröße | `k10-lb2-erwartungswert` | 3 | LP K10 LB3: Erwartungswert | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 3, S. 41 |
| `os-rs-k10-lb3-laplace` | Wahrscheinlichkeiten bei Zufallsversuchen | — | — | Laplace-Master in RS K8 LB5 verbraucht (vorher Dublette) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 3, S. 41 |
| `os-rs-k10-lb3-simulation` | Simulation von Zufallsversuchen | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 3, S. 41 |
| `os-rs-k10-lb3-gewinnchance` | Gewinnchance und Gewinnerwartung unterscheiden | `k10-lb2-erwartungswert-wuerfel` | 3 | Gewinnerwartung beim Würfel (neu, vorher Dublette) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 3, S. 41 |
| `os-rs-k10-lb4-wirtschaft` | Probleme aus Umwelt und Wirtschaft, Sparen und Kredit | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 4, S. 41-42 |
| `os-rs-k10-lb4-zinsen` | Zinsen und Kapital | — | — | D19: Zinsen Heimat RS K7/K8 (vorher Dublette) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 4, S. 41-42 |
| `os-rs-k10-lb4-pyramide` | Körper einschließlich Pyramiden- und Kegelstumpf | — | — | D19: k7-lb3-volumen-pyramide in RS K9 LB2 verbraucht; Pyramiden-/Kegelstumpf ohne Master | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 4, S. 41-42 |
| `os-rs-k10-lb4-kugel` | Volumen der Kugel | — | — | D19: Kugel Heimat RS K9 LB2 (vorher Dublette) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 4, S. 41-42 |
| `os-rs-k10-lb4-erwartung` | Wahrscheinlichkeiten und Erwartungswerte | — | — | Erwartungswert-Master in os-rs-k10-lb3-* verbraucht (vorher: k10-lb2-erwartungswert, Dublette) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 4, S. 41-42 |
| `os-rs-k10-lb4-abgaben` | Abgaben von Arbeitnehmer und Arbeitgeber | — | — | Kein passendes Master-Thema (Outline bleibt, nicht spielbar) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, LB 4, S. 41-42 |
| `os-rs-k10-lbw1-dgs` | Zentralperspektive, Ortskurven und Makros | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, Wahlbereich 1, S. 42 |
| `os-rs-k10-lbw1-ort` | Ortslinien erzeugen | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, Wahlbereich 1, S. 42 |
| `os-rs-k10-lbw1-makro` | Makros und Konstruktionsschritte | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, Wahlbereich 1, S. 42 |
| `os-rs-k10-lbw2-opt` | Optimierungsprobleme und lineare Ungleichungen | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, Wahlbereich 2, S. 42 |
| `os-rs-k10-lbw2-flaeche` | Maximale Fläche bei Nebenbedingungen | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, Wahlbereich 2, S. 42 |
| `os-rs-k10-lbw2-kosten` | Kostenminimum abschätzen | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, Wahlbereich 2, S. 42 |
| `os-rs-k10-lbw3-pythagoras` | Vermessung mit dem Satz des Pythagoras | — | — | Pythagoras-Master in K9 verbraucht (vorher Dublette) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, Wahlbereich 3, S. 42 |
| `os-rs-k10-lbw3-strahlensatz` | Vermessung mit Strahlensätzen und ähnlichen Figuren | — | — | Strahlensatz-Master in K8 verbraucht (vorher Dublette) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, Wahlbereich 3, S. 42 |
| `os-rs-k10-lbw3-trig` | Vermessung mit Trigonometrie | — | — | Wahlbereich; kein passendes Master-Thema (Outline bleibt) | LP OS Mathematik 2019: Realschulbildungsgang Kl. 10, Wahlbereich 3, S. 42 |


### Coverage Realschulbildungsgang

- Pack-Themen gesamt: 247 (K5/K6 gemeinsam + K7-K10)
- Spielbar vorher (Eintrag in OS_GENERATOR_MAP oder OS_CUSTOM_GENERATORS): **142**
- Spielbar nachher (mind. eine Master-Quelle oder custom): **129**
- Davon custom (bleibt): 5
- Hinweis: "vorher" zählt Dubletten mit (dasselbe Master-Thema in bis zu 4 Pack-Themen); "nachher" ist dublettenfrei. Netto-Rückgang = entfernte Doppelnutzungen und LP-fremde Themen, keine verlorenen Inhalte.

#### Pack-Themen ohne Master-Quelle (Pflicht-Lernbereiche, 69)

- `os-k5-lb1-quadrat` - Quadratzahl und Quadratwurzel
- `os-k5-lb1-null` - Null als kleinste natürliche Zahl
- `os-k5-lb1-rechengesetze` - Rechenstrategien, Rechenvorteile und Rechengesetze
- `os-k5-lb2-vergleichen` - Vergleichen, Ordnen und Abschätzen gemeiner Brüche
- `os-k5-lb2-prozent` - Prozentschreibweise für bequeme Anteile
- `os-k5-lb4-deckung` - Zeichnen und Analysieren symmetrischer sowie deckungsgleicher Figuren
- `os-k5-lb4-drehung` - Drehungen und Symmetrie in Mustern
- `os-k5-lb4-achsen` - Achsen- und Punktsymmetrie erkennen
- `os-k6-lb1-erweiterung` - Notwendigkeit einer Zahlenbereichserweiterung, Mengenbegriff
- `os-k6-lb1-negative-ausblick` - Ausblick: negative Zahlen in Sachproblemen
- `os-k6-lb1-verhaeltnis` - Verhältnisgleichungen
- `os-k6-lb2-arten` - Eindeutige, eineindeutige und mehrdeutige Zuordnungen
- `os-k6-lb2-darstellung` - Darstellung in Wort, Tabelle, Koordinatensystem und Gleichung
- `os-k6-lb3-parallelogramm` - Flächeninhalt von Parallelogramm, Drachenviereck und Trapez
- `os-k6-lb4-volumen-quader` - Volumen von Quader und Würfel
- `os-k6-lb5-probieren` - Problemlösestrategien: systematisches Probieren, Zurückführen auf Bekanntes
- `os-k6-lb5-anteil-prozent` - Anteile in Prozent
- `os-k6-lb5-praesentation` - Präsentation zu geometrischen Figuren und Körpern in der Umwelt
- `os-rs-k7-lb2-versuch` - Zufallsversuche: Ergebnis, Ergebnismenge, Ereignis
- `os-rs-k7-lb2-laplace` - Wahrscheinlichkeit als Bruch
- `os-rs-k7-lb2-laplace-pct` - Wahrscheinlichkeit in Prozent
- `os-rs-k7-lb3-venn` - Zahlbereiche systematisieren (Venn-Diagramm)
- `os-rs-k7-lb4-flaeche-dreieck` - Flächeninhalt von Dreiecken
- `os-rs-k7-lb4-umfang` - Umfang von Dreiecken und Vierecken
- `os-rs-k7-lb4-winkelsumme` - Innenwinkelsumme im Vieleck
- `os-rs-k7-lb4-vieleck-flaeche` - Flächeninhalt und Umfang von Vielecken
- `os-rs-k7-lb4-zweitafel` - Senkrechte Zweitafelprojektion: Grund- und Aufriss
- `os-rs-k7-lb4-masse` - Masse unter Einbeziehung der Dichte
- `os-rs-k8-lb1-ausklammern` - Ausklammern eines Faktors
- `os-rs-k8-lb1-gleichung-beid` - Gleichung mit x auf beiden Seiten
- `os-rs-k8-lb2-funktion` - Funktion als eindeutige Zuordnung
- `os-rs-k8-lb2-definitionsbereich` - Definitions- und Wertebereich linearer Funktionen
- `os-rs-k8-lb2-tarif` - Tarif- und Preisvergleiche mit linearen Funktionen
- `os-rs-k8-lb3-lage` - Lagebeziehungen von Kreis und Gerade, Satz des Thales
- `os-rs-k8-lb3-sekante-tangente` - Sekante und Tangente am Kreis
- `os-rs-k8-lb3-darstellen` - Netz, Ansichten und Schrägbild von Kreis- und Hohlzylinder
- `os-rs-k8-lb4-kongruenz` - Kongruenz als Spezialfall der Ähnlichkeit
- `os-rs-k8-lb5-simulation` - Simulation von Zufallsversuchen
- `os-rs-k8-lb5-abhaengig` - Abhängige und unabhängige Ereignisse
- `os-rs-k8-lb6-kosten` - Lebenshaltungs- und Baukosten
- `os-rs-k8-lb6-lebenshaltung` - Lebenshaltungskosten: Miete, Energie, Versicherungen
- `os-rs-k8-lb6-prozent` - Prozentrechnung in Alltagsbezügen
- `os-rs-k9-lb1-umkehrung` - Umkehrung des Satzes des Pythagoras
- `os-rs-k9-lb2-darstellen` - Schrägbild, Netz und Zweitafelbild von Pyramide und Kreiskegel
- `os-rs-k9-lb2-kegel` - Mantellinie, Mantel und Volumen von Kreiskegeln
- `os-rs-k9-lb2-zylinder` - Volumen eines Kreiszylinders
- `os-rs-k9-lb3-potenz-prod` - Potenzgesetz: Produkt gleicher Basis
- `os-rs-k9-lb3-potenz-quot` - Potenzgesetz: Quotient und Potenz einer Potenz
- `os-rs-k9-lb3-fall` - Prinzip der Fallunterscheidung
- `os-rs-k9-lb3-monotonie` - Monotonieverhalten und Wertebereich quadratischer Funktionen
- `os-rs-k9-lb4-medien` - Darstellungen und Inhalte von Datenerhebungen beurteilen
- `os-rs-k10-lb1-system` - Systematisieren der Dreiecke und Vierecke
- `os-rs-k10-lb1-trig` - Trigonometrische Beziehungen in beliebigen Dreiecken
- `os-rs-k10-lb1-hyp` - Seitenlängen mit dem Satz des Pythagoras
- `os-rs-k10-lb1-flaeche-dreieck` - Flächeninhalte in Dreiecken und Vielecken
- `os-rs-k10-lb2-potenz` - Potenzfunktionen y = a·xⁿ
- `os-rs-k10-lb2-zinseszins` - Zinseszins: Endkapital
- `os-rs-k10-lb2-zunahme` - Prozentuale Zunahme
- `os-rs-k10-lb2-sinus` - Sinusfunktion, Periodizität, Grad- und Bogenmaß
- `os-rs-k10-lb2-sinus-parameter` - Sinusfunktion: Parameter, Amplitude und Periode
- `os-rs-k10-lb3-zufall` - Verwenden von Zufallsgrößen
- `os-rs-k10-lb3-laplace` - Wahrscheinlichkeiten bei Zufallsversuchen
- `os-rs-k10-lb3-simulation` - Simulation von Zufallsversuchen
- `os-rs-k10-lb4-wirtschaft` - Probleme aus Umwelt und Wirtschaft, Sparen und Kredit
- `os-rs-k10-lb4-zinsen` - Zinsen und Kapital
- `os-rs-k10-lb4-pyramide` - Körper einschließlich Pyramiden- und Kegelstumpf
- `os-rs-k10-lb4-kugel` - Volumen der Kugel
- `os-rs-k10-lb4-erwartung` - Wahrscheinlichkeiten und Erwartungswerte
- `os-rs-k10-lb4-abgaben` - Abgaben von Arbeitnehmer und Arbeitgeber

#### Pack-Themen ohne Master-Quelle (Wahlbereiche, 49)

`os-k5-lbw1-zahlzeichen`, `os-k5-lbw1-abakus`, `os-k5-lbw1-stellenwert`, `os-k5-lbw2-daten`, `os-k5-lbw2-kombinatorik`, `os-k5-lbw2-mittel`, `os-k5-lbw3-zeit`, `os-k6-lbw1-dgs`, `os-k6-lbw2-spiele`, `os-k6-lbw2-strategie`, `os-k6-lbw2-wuerfel`, `os-k6-lbw3-mittelwert`, `os-k6-lbw3-modal`, `os-k6-lbw3-diagramm`, `os-rs-k7-lbw1-zeichnen`, `os-rs-k7-lbw1-schnitt`, `os-rs-k7-lbw1-mass`, `os-rs-k7-lbw2-knobel`, `os-rs-k7-lbw2-zahlen`, `os-rs-k7-lbw2-logik`, `os-rs-k7-lbw3-parkett`, `os-rs-k7-lbw3-fliese`, `os-rs-k8-lbw1-fahrrad`, `os-rs-k8-lbw1-umfang`, `os-rs-k8-lbw1-tempo`, `os-rs-k8-lbw2-modell`, `os-rs-k8-lbw2-massstab`, `os-rs-k8-lbw2-volumen`, `os-rs-k8-lbw3-polyeder`, `os-rs-k8-lbw3-netz`, `os-rs-k8-lbw3-euler`, `os-rs-k9-lbw1-gold`, `os-rs-k9-lbw1-rechteck`, `os-rs-k9-lbw1-natur`, `os-rs-k9-lbw2-laenge`, `os-rs-k9-lbw2-schnitt`, `os-rs-k9-lbw2-netz`, `os-rs-k9-lbw3-sport`, `os-rs-k9-lbw3-tabelle`, `os-rs-k9-lbw3-statistik`, `os-rs-k10-lbw1-dgs`, `os-rs-k10-lbw1-ort`, `os-rs-k10-lbw1-makro`, `os-rs-k10-lbw2-opt`, `os-rs-k10-lbw2-flaeche`, `os-rs-k10-lbw2-kosten`, `os-rs-k10-lbw3-pythagoras`, `os-rs-k10-lbw3-strahlensatz`, `os-rs-k10-lbw3-trig`

#### Master-Themen der Klassen 5-10, die ungenutzt bleiben (4)

| Master-ID | Titel | diff | Grund |
|---|---|---|---|
| `lb3-koordinaten-abstand` | Abstand zwischen Punkten | 2 | Abstand im Koordinatensystem steht nicht im RS-LP; Pythagoras-Anwendung ohne Pack-Thema |
| `k7-lb4-median` | Median (Zentralwert) | 2 | Median steht im RS-LP erst K9 LB4 (dort k9-lb4-median) |
| `k9-lb1-potenz-produkt` | Potenzgesetz: Produkt gleicher Basis | 2 | Potenzgesetze nicht im RS-LP K9; Potenzfunktionen K10 sind anderer Inhalt (D15) |
| `k9-lb1-potenz-quotient` | Potenzgesetz: Quotient und Potenz einer Potenz | 2 | Potenzgesetze nicht im RS-LP K9 (D15) |
| `k6-umrechnen-laenge` | Neu-Waise (math6) | 1 | Neu-Waise (kein Parent); kein Einheiten-Pack-Thema in K6, LP K6 behandelt Einheiten nur implizit |
| `k6-umrechnen-flaeche` | Neu-Waise (math6) | 1 | Neu-Waise (kein Parent); kein Einheiten-Pack-Thema in K6 |

Nicht zur Oberschule gehörig: Master K10 (bis auf die ungenutzten oben alle verwendet) und Master Jahrgangsstufe 11/12 (k1112-*; k1112-lb1-nullstelle-linear wird in RS K8 genutzt) - kein Lehrplaninhalt der Oberschule.

### JSON RS

```json
{
  "os-k5-lb1-runden": {
    "sources": [
      "lb1-runden-natuerlich"
    ],
    "maxDifficulty": 2,
    "note": "1:1 Rundenübung natürlicher Zahlen"
  },
  "os-k5-lb1-potenz": {
    "sources": [
      "lb1-potenzieren"
    ],
    "maxDifficulty": 2,
    "note": "Quadrat- und Zehnerpotenzen; deckt os-k5-lb1-quadrat inhaltlich mit ab"
  },
  "os-k5-lb1-addition": {
    "sources": [
      "lb1-addition"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb1-subtraktion": {
    "sources": [
      "lb1-subtraktion"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb1-multiplikation": {
    "sources": [
      "lb1-multiplikation",
      "lb1-schriftliches-rechnen"
    ],
    "maxDifficulty": 2,
    "note": "LP: mündlich/halbschriftlich/schriftlich multiplizieren; schriftliches Rechnen (Kästchenpapier) ergänzt (neu)"
  },
  "os-k5-lb1-division": {
    "sources": [
      "lb1-schriftliche-division",
      "lb1-division-rest"
    ],
    "maxDifficulty": 2,
    "note": "LP: schriftliche Division durch einstelligen Divisor; Rest-Variante ergänzt (neu)"
  },
  "os-k5-lb1-gleichung": {
    "sources": [
      "k7-lb2-gleichung-add"
    ],
    "maxDifficulty": 2,
    "note": "K7-Master (x + a = b, difficulty 1) für inhaltliches Lösen einfacher Gleichungen; bleibt"
  },
  "os-k5-lb1-teilbarkeit": {
    "sources": [
      "lb1-teilbarkeit"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb1-primzahl": {
    "sources": [
      "lb1-primzahl"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb2-anteil": {
    "sources": [
      "lb2-anteil-bruch",
      "lb2-grafische-brueche"
    ],
    "maxDifficulty": 2,
    "note": "LP: Erkennen und Darstellen gemeiner Brüche; lb2-anteil-bruch neu hier (war HS-K7, dort Dublette)"
  },
  "os-k5-lb2-kuerzen": {
    "sources": [
      "lb2-kuerzen"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb2-erweitern": {
    "sources": [
      "lb2-erweitern"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb2-runden-dez": {
    "sources": [
      "lb2-runden-dezimal"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb2-dez-add-sub": {
    "sources": [
      "lb2-dez-add-sub"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb2-dez-mult": {
    "sources": [
      "lb2-dez-mult"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb2-dez-div": {
    "sources": [
      "lb2-dez-div"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb2-mittelwert": {
    "sources": [
      "lb2-mittelwert"
    ],
    "maxDifficulty": 2,
    "note": "K5-Master; K6 nutzt den K7-Master k7-lb4-mittelwert (kein Doppelt im Pack)"
  },
  "os-k5-lb2-laenge": {
    "sources": [
      "k5-umrechnen-laenge",
      "lb2-ordnen-einheiten"
    ],
    "maxDifficulty": 2,
    "note": "k5-umrechnen-laenge existiert nur als Neu-Aufgabenbank (Waise, siehe Coverage); Größen ordnen ergänzt"
  },
  "os-k5-lb2-masse": {
    "sources": [
      "k5-umrechnen-masse"
    ],
    "maxDifficulty": 2,
    "note": "Neu-Waise (kein Parent in math5.ts)"
  },
  "os-k5-lb2-zeit": {
    "sources": [
      "k5-umrechnen-zeit"
    ],
    "maxDifficulty": 2,
    "note": "Neu-Waise (kein Parent in math5.ts)"
  },
  "os-k5-lb3-koordinaten": {
    "sources": [],
    "maxDifficulty": 2,
    "note": "custom (bleibt): OS_CUSTOM_GENERATORS, erster Quadrant laut LP korrekt [custom bleibt]"
  },
  "os-k5-lb3-lage": {
    "sources": [
      "lb3-strecken-bezeichnung"
    ],
    "maxDifficulty": 2,
    "note": "LP K5 LB3: parallel/senkrecht/schneiden; Strecke/Gerade/Halbgerade als nächste Quelle (neu)"
  },
  "os-k5-lb3-winkelarten": {
    "sources": [
      "lb3-winkelarten"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb3-winkel-erg": {
    "sources": [
      "lb3-winkel-ergaenzung"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k5-lb3-wuerfel": {
    "sources": [
      "lb4-wuerfelnetz"
    ],
    "maxDifficulty": 2,
    "note": "math6-ID, inhaltlich K5 (Würfelnetz); K6-Darstellen bleibt custom"
  },
  "os-k5-lb3-umfang": {
    "sources": [
      "lb4-umfang-rechteck",
      "lb4-umfang-zusammengesetzt"
    ],
    "maxDifficulty": 2,
    "note": "LP K5 LB3: Umfang/Fläche an in Rechtecke zerlegbaren Figuren"
  },
  "os-k5-lb3-flaeche": {
    "sources": [
      "lb4-flaeche-rechteck",
      "lb4-flaeche-zusammengesetzt",
      "lb5-sachaufgabe-flaeche"
    ],
    "maxDifficulty": 2,
    "note": "LP K5 LB3: Zerlegen/Ergänzen; Sachaufgabe Fläche/Umfang ergänzt"
  },
  "os-k5-lb3-flaeche-eh": {
    "sources": [
      "k5-umrechnen-flaeche"
    ],
    "maxDifficulty": 2,
    "note": "Neu-Waise (kein Parent in math5.ts)"
  },
  "os-k5-lb3-oberflaeche": {
    "sources": [
      "lb4-oberflaeche-quader"
    ],
    "maxDifficulty": 2,
    "note": "ID-Kollision math5/math6 (D24): K5 bekommt die Quelle, K6 weicht aus"
  },
  "os-k5-lb3-volumen-wuerfel": {
    "sources": [
      "lb4-volumen-quader"
    ],
    "maxDifficulty": 2,
    "note": "ID-Kollision math5/math6 (D24): K5 bekommt die Quelle, K6 blockiert bis Umbenennung"
  },
  "os-k5-lb3-volumen-eh": {
    "sources": [
      "k5-umrechnen-volumen"
    ],
    "maxDifficulty": 2,
    "note": "Neu-Waise (kein Parent in math5.ts)"
  },
  "os-k5-lb4-spiegelung": {
    "sources": [
      "lb3-achsensymmetrie"
    ],
    "maxDifficulty": 2,
    "note": "1:1 (Geradenspiegelung/Symmetrieachse)"
  },
  "os-k5-lb4-verschiebungsweite": {
    "sources": [
      "lb3-verschiebung"
    ],
    "maxDifficulty": 2,
    "note": "LP K5 LB4: Verschiebungsrichtung/-weite (neu)"
  },
  "os-k5-lbw3-angebote": {
    "sources": [
      "lb5-gesamtpreis"
    ],
    "maxDifficulty": 2,
    "note": "Wahlbereich Klassenfahrt: Gesamtpreis/Angebote (neu)"
  },
  "os-k5-lbw3-budget": {
    "sources": [
      "lb5-mehrstufig",
      "lb5-teilen"
    ],
    "maxDifficulty": 2,
    "note": "Budget und Stückkosten (neu)"
  },
  "os-k6-lb1-zahlenstrahl": {
    "sources": [
      "lb2-zahlenstrahl"
    ],
    "maxDifficulty": 2,
    "note": "LP K6 LB1: Veranschaulichen am Zahlenstrahl (neu)"
  },
  "os-k6-lb1-kuerzen": {
    "sources": [
      "lb1-kuerzen"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb1-erweitern": {
    "sources": [
      "lb1-erweitern"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb1-bruch-dez": {
    "sources": [
      "lb1-bruch-dezimal"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb1-vergleichen": {
    "sources": [
      "lb1-vergleichen"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb1-add-sub": {
    "sources": [
      "lb1-add-sub-brueche"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb1-mult": {
    "sources": [
      "lb1-mult-brueche"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb1-div": {
    "sources": [
      "lb1-div-brueche"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb1-dez-add-sub": {
    "sources": [
      "lb1-dez-add-sub"
    ],
    "maxDifficulty": 2,
    "note": "1:1 (math6-ID, distinkt von K5 lb2-dez-add-sub)"
  },
  "os-k6-lb1-dez-mult": {
    "sources": [
      "lb1-dez-mult"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb1-dez-div": {
    "sources": [
      "lb1-dez-div"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb1-runden": {
    "sources": [
      "lb1-runden"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb1-mittelwert": {
    "sources": [
      "k7-lb4-mittelwert"
    ],
    "maxDifficulty": 2,
    "note": "LP K6 LB1: arithmetisches Mittel; K7-Master, damit lb2-mittelwert nur in K5 liegt"
  },
  "os-k6-lb2-prop": {
    "sources": [
      "lb2-proportional"
    ],
    "maxDifficulty": 2,
    "note": "1:1 Dreisatz direkt"
  },
  "os-k6-lb2-antiprop": {
    "sources": [
      "lb2-antiproportional"
    ],
    "maxDifficulty": 2,
    "note": "1:1 Dreisatz indirekt"
  },
  "os-k6-lb2-anteil": {
    "sources": [
      "lb1-sachaufgabe-bruch"
    ],
    "maxDifficulty": 2,
    "note": "Titel nicht im LP K6 LB2 (D6); Bruchteil-Sachaufgaben als Ersatzquelle, lb5-anteil-groesse geht nach K7"
  },
  "os-k6-lb3-nebenwinkel": {
    "sources": [
      "k7-lb1-nebenwinkel"
    ],
    "maxDifficulty": 2,
    "note": "LP K6 LB3: Nebenwinkelsatz (K7-Master)"
  },
  "os-k6-lb3-scheitel": {
    "sources": [
      "k7-lb1-scheitelwinkel"
    ],
    "maxDifficulty": 2,
    "note": "LP K6 LB3: Scheitel-/Stufen-/Wechselwinkel (K7-Master)"
  },
  "os-k6-lb3-innenwinkel": {
    "sources": [
      "lb3-winkel-dreieck"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb3-einteilung": {
    "sources": [
      "k7-lb1-basiswinkel"
    ],
    "maxDifficulty": 2,
    "note": "Dreiecke nach Seiten und Winkeln; Basiswinkel gleichschenklig als Näherung (neu)"
  },
  "os-k6-lb3-kongruenz": {
    "sources": [
      "lb3-kongruenzsatz"
    ],
    "maxDifficulty": 2,
    "note": "1:1; RS-K8 Kongruenz bekommt keine zweite Quelle"
  },
  "os-k6-lb3-flaeche-dreieck": {
    "sources": [
      "lb3-flaeche-dreieck"
    ],
    "maxDifficulty": 2,
    "note": "1:1; K7/K10 ohne Doppelung"
  },
  "os-k6-lb3-umfang": {
    "sources": [
      "lb3-umfang-rechteck",
      "lb3-sachaufgabe-geometrie"
    ],
    "maxDifficulty": 2,
    "note": "Umfang; Sachaufgabe Fläche/Umfang ergänzt (neu)"
  },
  "os-k6-lb3-flaeche-rechteck": {
    "sources": [
      "lb3-flaeche-rechteck"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb3-winkelsumme-viereck": {
    "sources": [
      "lb3-winkel-viereck"
    ],
    "maxDifficulty": 2,
    "note": "1:1; im LP K6 LB3 nicht ausdrücklich genannt, Gym-Quelle belassen"
  },
  "os-k6-lb4-darstellen": {
    "sources": [],
    "maxDifficulty": 2,
    "note": "custom (bleibt): osPrismNetz (Prismen-Netze) [custom bleibt]"
  },
  "os-k6-lb4-oberflaeche": {
    "sources": [
      "lb4-flaeche-kante-quader"
    ],
    "maxDifficulty": 2,
    "note": "Ausweichquelle wegen ID-Kollision lb4-oberflaeche-quader (D24); Fläche/Seitenlänge am Quader"
  },
  "os-k6-lb4-volumen-prisma": {
    "sources": [
      "lb4-volumen-prisma"
    ],
    "maxDifficulty": 2,
    "note": "1:1"
  },
  "os-k6-lb5-haeufigkeit": {
    "sources": [
      "lb2-haeufigkeit"
    ],
    "maxDifficulty": 2,
    "note": "LP K6 LB5: absolute/relative Häufigkeit"
  },
  "os-k6-lbw1-konstruktion": {
    "sources": [
      "lb3-strecken-mittelpunkt"
    ],
    "maxDifficulty": 2,
    "note": "Wahlbereich DGS: Streckenmittelpunkt/Grundkonstruktion (neu)"
  },
  "os-k6-lbw1-messen": {
    "sources": [
      "lb3-strecken-laenge"
    ],
    "maxDifficulty": 2,
    "note": "Wahlbereich DGS: Längen messen (neu)"
  },
  "os-rs-k7-lb1-dreisatz": {
    "sources": [
      "lb2-sachaufgabe-dreisatz",
      "lb5-anteil-groesse"
    ],
    "maxDifficulty": 3,
    "note": "LP RS K7 LB1: Dreisatz auf Grundaufgaben der Prozentrechnung"
  },
  "os-rs-k7-lb1-prozent": {
    "sources": [
      "lb1-prozent",
      "lb5-anteil-prozent"
    ],
    "maxDifficulty": 3,
    "note": "Bequeme Prozentsätze, Grundaufgaben; aus K5/K6 verlagert (D5)"
  },
  "os-rs-k7-lb1-kreisdiagramm": {
    "sources": [],
    "maxDifficulty": 3,
    "note": "custom (bleibt): osPieAnteil; Map-Fallback lb2-grafische-brueche tot [custom bleibt]"
  },
  "os-rs-k7-lb1-preisaenderung": {
    "sources": [
      "k10-lb1-prozentuale-zunahme"
    ],
    "maxDifficulty": 3,
    "note": "Preiserhöhung/-senkung"
  },
  "os-rs-k7-lb1-zinsen": {
    "sources": [
      "k10-lb1-zinsen"
    ],
    "maxDifficulty": 3,
    "note": "Zinssatz, Zinsen, Kapital"
  },
  "os-rs-k7-lb1-zinseszins": {
    "sources": [
      "k10-lb1-zinseszins"
    ],
    "maxDifficulty": 3,
    "note": "LP RS K7 LB1: Tageszins, Zinseszins ausdrücklich (Heimat; K10-Doppelung entfällt)"
  },
  "os-rs-k7-lb2-haeufigkeit": {
    "sources": [
      "k7-lb4-rel-haeufigkeit"
    ],
    "maxDifficulty": 3,
    "note": "Urliste, abs./rel. Häufigkeit"
  },
  "os-rs-k7-lb3-ordnen": {
    "sources": [
      "k7-lb2-betrag"
    ],
    "maxDifficulty": 3,
    "note": "bleibt"
  },
  "os-rs-k7-lb3-add": {
    "sources": [
      "k7-lb2-add-rational"
    ],
    "maxDifficulty": 3,
    "note": "1:1"
  },
  "os-rs-k7-lb3-sub": {
    "sources": [
      "k7-lb2-sub-rational"
    ],
    "maxDifficulty": 3,
    "note": "1:1"
  },
  "os-rs-k7-lb3-mul": {
    "sources": [
      "k7-lb2-mul-rational"
    ],
    "maxDifficulty": 3,
    "note": "1:1"
  },
  "os-rs-k7-lb3-div": {
    "sources": [
      "k7-lb2-div-rational"
    ],
    "maxDifficulty": 3,
    "note": "1:1"
  },
  "os-rs-k7-lb3-term": {
    "sources": [
      "k7-lb2-term-vorrang"
    ],
    "maxDifficulty": 3,
    "note": "1:1"
  },
  "os-rs-k7-lb3-gleichung": {
    "sources": [
      "k7-lb2-gleichung-mul"
    ],
    "maxDifficulty": 3,
    "note": "LP RS K7 LB3: Gleichungen kalkülmäßig (gleichung-add liegt in K5); vorher Dublette zu K8"
  },
  "os-rs-k7-lb3-gleichung-beid": {
    "sources": [
      "k8-lb1-gleichung-beidseitig"
    ],
    "maxDifficulty": 3,
    "note": "Form a·x+b=c·x+d (LP K7); K8 bekommt keine zweite Quelle"
  },
  "os-rs-k7-lb3-zahlenraetsel": {
    "sources": [
      "k8-lb5-zahlenraetsel"
    ],
    "maxDifficulty": 3,
    "note": "Aufstellen von Gleichungen"
  },
  "os-rs-k7-lb3-koordinaten": {
    "sources": [
      "lb3-koordinaten-eintragen",
      "lb3-koordinaten-ablesen"
    ],
    "maxDifficulty": 3,
    "note": "custom (bleibt): osQ1CoordinatePlace nur 1. Quadrant, LP verlangt vier Quadranten (D10); Master als Beimischung empfohlen [custom bleibt]"
  },
  "os-rs-k7-lb4-konstruieren": {
    "sources": [
      "k7-lb1-mittelsenkrechte-schritte"
    ],
    "maxDifficulty": 3,
    "note": "bleibt"
  },
  "os-rs-k7-lb4-darstellen": {
    "sources": [],
    "maxDifficulty": 3,
    "note": "custom (bleibt): osPrismNetz [custom bleibt]"
  },
  "os-rs-k7-lb4-volumen-prisma": {
    "sources": [
      "k7-lb3-volumen-prisma"
    ],
    "maxDifficulty": 3,
    "note": "K7-Master (vorher K6-Quelle, Dublette)"
  },
  "os-rs-k7-lb4-mantel": {
    "sources": [
      "k7-lb3-mantel-prisma"
    ],
    "maxDifficulty": 3,
    "note": "1:1"
  },
  "os-rs-k7-lb4-oberflaeche": {
    "sources": [
      "k7-lb3-oberflaeche-quader"
    ],
    "maxDifficulty": 3,
    "note": "K7-Master (vorher K5/K6-Dublette)"
  },
  "os-rs-k7-lbw3-symmetrie": {
    "sources": [
      "lb3-punktsymmetrie"
    ],
    "maxDifficulty": 3,
    "note": "Wahlbereich Parkettierungen: Symmetrie (neu, K5-Master)"
  },
  "os-rs-k8-lb1-term": {
    "sources": [
      "k8-lb1-term-auswerten"
    ],
    "maxDifficulty": 3,
    "note": "1:1"
  },
  "os-rs-k8-lb1-zusammenfassen": {
    "sources": [
      "k8-lb1-zusammenfassen"
    ],
    "maxDifficulty": 3,
    "note": "1:1"
  },
  "os-rs-k8-lb1-ausmult": {
    "sources": [
      "k8-lb1-ausmultiplizieren"
    ],
    "maxDifficulty": 3,
    "note": "1:1"
  },
  "os-rs-k8-lb1-gleichung": {
    "sources": [
      "k8-lb1-gleichung-linear"
    ],
    "maxDifficulty": 3,
    "note": "Heimat k8-lb1-gleichung-linear; K7 nutzt gleichung-mul/-beidseitig"
  },
  "os-rs-k8-lb1-formel": {
    "sources": [
      "k8-lb5-rueckwaerts"
    ],
    "maxDifficulty": 3,
    "note": "Umstellen von Formeln ~ Rückwärtsrechnen (neu)"
  },
  "os-rs-k8-lb2-funktionswert": {
    "sources": [
      "k8-lb3-funktionswert"
    ],
    "maxDifficulty": 3,
    "note": "1:1"
  },
  "os-rs-k8-lb2-steigung": {
    "sources": [
      "k8-lb3-steigung"
    ],
    "maxDifficulty": 3,
    "note": "1:1"
  },
  "os-rs-k8-lb2-achsen": {
    "sources": [
      "k8-lb3-achsenabschnitt"
    ],
    "maxDifficulty": 3,
    "note": "1:1"
  },
  "os-rs-k8-lb2-nullstelle": {
    "sources": [
      "k1112-lb1-nullstelle-linear"
    ],
    "maxDifficulty": 3,
    "note": "Nullstelle linearer Funktion (neu; Master stammt aus 11/12, Inhalt K8-tauglich, difficulty 2)"
  },
  "os-rs-k8-lb2-lgs": {
    "sources": [
      "k8-lb3-lgs"
    ],
    "maxDifficulty": 3,
    "note": "LP RS K8 LB2 verlangt LGS (difficulty 3 begründet)"
  },
  "os-rs-k8-lb3-kreis-umfang": {
    "sources": [
      "k9-lb2-kreis-umfang"
    ],
    "maxDifficulty": 3,
    "note": "1:1"
  },
  "os-rs-k8-lb3-kreis-flaeche": {
    "sources": [
      "k9-lb2-kreis-flaeche"
    ],
    "maxDifficulty": 3,
    "note": "1:1 (Kreisring ohne Master)"
  },
  "os-rs-k8-lb3-zylinder": {
    "sources": [
      "k9-lb2-zylinder-volumen"
    ],
    "maxDifficulty": 3,
    "note": "Heimat LP RS K8 LB3; K9-Zylinder entfällt (D16)"
  },
  "os-rs-k8-lb4-streckfaktor": {
    "sources": [
      "k8-lb4-streckfaktor"
    ],
    "maxDifficulty": 3,
    "note": "1:1"
  },
  "os-rs-k8-lb4-strahlensatz": {
    "sources": [
      "k8-lb4-strahlensatz"
    ],
    "maxDifficulty": 3,
    "note": "1:1"
  },
  "os-rs-k8-lb4-aehnlich": {
    "sources": [
      "k8-lb4-aehnliche-seite"
    ],
    "maxDifficulty": 3,
    "note": "1:1"
  },
  "os-rs-k8-lb5-laplace": {
    "sources": [
      "k8-lb2-laplace-bruch"
    ],
    "maxDifficulty": 3,
    "note": "Laplace/kombinatorisches Zählen (aus K7 hierher, D23)"
  },
  "os-rs-k8-lb5-gegen": {
    "sources": [
      "k8-lb2-gegenwahrscheinlichkeit"
    ],
    "maxDifficulty": 3,
    "note": "1:1"
  },
  "os-rs-k8-lb5-baum": {
    "sources": [
      "k8-lb2-laplace-prozent"
    ],
    "maxDifficulty": 3,
    "note": "Baumdiagramm-Aufgaben liegen nach Neu-Merge in den Laplace-Eltern; Verteilung in E1/E2 prüfen"
  },
  "os-rs-k8-lb6-zinsen": {
    "sources": [
      "k10-lb5-kapital",
      "k10-lb5-zinssatz"
    ],
    "maxDifficulty": 3,
    "note": "Sparanlagen/Zinsen (neu, vorher Dublette)"
  },
  "os-rs-k9-lb1-hyp": {
    "sources": [
      "k9-lb3-pythagoras-hypotenuse"
    ],
    "maxDifficulty": 3,
    "note": "1:1; K10-Wiederholung entfällt"
  },
  "os-rs-k9-lb1-kathete": {
    "sources": [
      "k9-lb3-pythagoras-kathete"
    ],
    "maxDifficulty": 3,
    "note": "1:1"
  },
  "os-rs-k9-lb1-trig": {
    "sources": [
      "k9-lb3-trig-wert"
    ],
    "maxDifficulty": 3,
    "note": "Sinus/Kosinus/Tangens (LP RS K9 LB1)"
  },
  "os-rs-k9-lb1-sach": {
    "sources": [
      "k9-lb5-leiter"
    ],
    "maxDifficulty": 3,
    "note": "Sachaufgaben"
  },
  "os-rs-k9-lb2-pyramide": {
    "sources": [
      "k7-lb3-volumen-pyramide",
      "k7-lb3-oberflaeche-pyramide"
    ],
    "maxDifficulty": 3,
    "note": "LP: Mantel/Oberfläche/Volumen von Pyramiden (Oberfläche neu)"
  },
  "os-rs-k9-lb2-kugel": {
    "sources": [
      "k9-lb2-kugel-volumen"
    ],
    "maxDifficulty": 3,
    "note": "LP RS K9 LB2: Kugel; K10-Doppelung entfällt"
  },
  "os-rs-k9-lb2-zusammengesetzt": {
    "sources": [
      "lb4-volumen-zusammengesetzt"
    ],
    "maxDifficulty": 3,
    "note": "LP RS K9 LB2: Anwenden auf zusammengesetzte Körper"
  },
  "os-rs-k9-lb3-quadrat": {
    "sources": [
      "k9-lb1-quadrat-wert"
    ],
    "maxDifficulty": 3,
    "note": "Funktionswert quadratischer Funktion"
  },
  "os-rs-k9-lb3-scheitel": {
    "sources": [
      "k9-lb1-scheitel"
    ],
    "maxDifficulty": 3,
    "note": "Scheitelpunkt (LP: y=(x-d)²+e)"
  },
  "os-rs-k9-lb3-gleichung": {
    "sources": [
      "k10-lb4-reinquadratisch",
      "k10-lb4-quadratische-gleichung"
    ],
    "maxDifficulty": 3,
    "note": "LP: quadratische Gleichungen inkl. Lösungsformel -> difficulty 3 begründet"
  },
  "os-rs-k9-lb3-nullstellen": {
    "sources": [
      "k10-lb3-quadrat-seite",
      "k10-lb3-rechteck-breite",
      "k10-lb3-rechteck-umfang"
    ],
    "maxDifficulty": 3,
    "note": "nur Sachproblem-Variante (LP: Anwenden auf Sachprobleme); Nullstellen/Schnittpunkte rechnerisch ohne Master"
  },
  "os-rs-k9-lb4-mittelwert": {
    "sources": [
      "k9-lb4-mittelwert"
    ],
    "maxDifficulty": 3,
    "note": "1:1"
  },
  "os-rs-k9-lb4-median": {
    "sources": [
      "k9-lb4-median"
    ],
    "maxDifficulty": 3,
    "note": "1:1"
  },
  "os-rs-k9-lb4-modal": {
    "sources": [
      "k9-lb4-modalwert"
    ],
    "maxDifficulty": 3,
    "note": "1:1 (K6-Modal entfällt)"
  },
  "os-rs-k9-lb4-spannweite": {
    "sources": [
      "k7-lb4-spannweite"
    ],
    "maxDifficulty": 3,
    "note": "Max/Min/Spannweite"
  },
  "os-rs-k10-lb1-winkelsumme": {
    "sources": [
      "k7-lb1-winkelsumme-vieleck"
    ],
    "maxDifficulty": 3,
    "note": "LP RS K10 LB1: Winkelgrößen in Vielecken (Heimat; K7-Doppelung entfällt)"
  },
  "os-rs-k10-lb2-quadrat": {
    "sources": [
      "k10-lb4-parabel-wert"
    ],
    "maxDifficulty": 3,
    "note": "Potenzfunktion y=a·x² (LP K10 LB2); K9 nutzt quadrat-wert"
  },
  "os-rs-k10-lb2-exp": {
    "sources": [
      "k10-lb1-exp-wachstum"
    ],
    "maxDifficulty": 3,
    "note": "Exponentialfunktionen/Wachstum"
  },
  "os-rs-k10-lb3-erwartung": {
    "sources": [
      "k10-lb2-erwartungswert"
    ],
    "maxDifficulty": 3,
    "note": "LP K10 LB3: Erwartungswert"
  },
  "os-rs-k10-lb3-gewinnchance": {
    "sources": [
      "k10-lb2-erwartungswert-wuerfel"
    ],
    "maxDifficulty": 3,
    "note": "Gewinnerwartung beim Würfel (neu, vorher Dublette)"
  }
}
```

## E5-Ergänzungen

Umsetzung E5b (Pack-Version 1.2.0 für HS und RS). Das Mapping steht in `OS_TOPIC_MAPPINGS` (`src/curriculum/oberschuleGenerators.ts`), `OS_GENERATOR_MAP` ist leer; Themen ohne Eintrag laufen über `OS_CUSTOM_GENERATORS` oder sind Outline. Abweichungen gegenüber den JSON-Blöcken oben:

- **K6 Quader (D24 aufgelöst):** `os-k6-lb4-volumen-quader` -> `mathematik-klasse-6:lb4-volumen-quader` (neu spielbar); `os-k6-lb4-oberflaeche` -> `mathematik-klasse-6:lb4-oberflaeche-quader` plus `lb4-flaeche-kante-quader`. K5-Themen nutzen `mathematik-klasse-5:lb4-...`.
- **HS K7 LB1 (Überarbeitung, Wiederholung Kl. 5-6):** `os-hs-k7-lb1-flaeche` und `-volumen` mit `allowRepeat: true` (Begründung im Eintrag). Da `lb4-volumen-zusammengesetzt` im HS-Pack sonst nicht wiederholt wird, kommt für die echte Wiederholung `mathematik-klasse-5:lb4-volumen-quader` als zweite Quelle hinzu.
- **K7 Koordinaten (D10):** `os-hs-k7-lb3-koordinaten` und `os-rs-k7-lb3-koordinaten` mit `includeCustom: true`: Custom (nur 1. Quadrant) wird mit `lb3-koordinaten-eintragen`/`-ablesen` (4 Quadranten) gemischt.
- **HS K9 Sinus (D12), bekannte Abweichung:** Es gibt kein reines Sinus-Master; `os-hs-k9-lb1-sinus` nutzt `k9-lb3-trig-wert` (Sinus/Kosinus/Tangens), obwohl der LP HS nur Sinus verlangt. Variantenfilter ist zurückgestellt.
- **Netze (Rundenlänge):** `osPrismNetz` hatte nur 3 Varianten (gleicher Stamm, 1 Aufgabe je Runde). Der Custom-Generator mischt jetzt Netz-Auswahl mit Zähl-Aufgaben (Flächen/Rechtecke/Kanten eines n-seitigen Prismas, n = 3-8); Runden zu 10 sind möglich, kein `tasksPerRound`-Sonderwert nötig.
- **Zusätzliche Master-Quellen (1:n):** keine. Ungenutzte Master (HS 15, RS 4) passen laut Doku nicht in den LP (oder sind durch Custom ersetzt); `k8-lb3-funktionswert`/`-steigung`/`-achsenabschnitt` bleiben bewusst ungenutzt (HS-Custom mit kleinerem Zahlenraum).
- **Outline:** keine Änderungen (Themen bleiben als Outline stehen, gespeicherte IDs bleiben auflösbar). Pack-Themen, die der alte String-Map spielbar machte und die die Doku ohne Quelle führt (z. B. `os-k6-lb5-anteil-prozent`, `os-hs-k7-lb4-winkelsumme`, `os-rs-k10-lb1-hyp`), sind jetzt Outline (Dublettenfreiheit, D5/D9/D16-D19).
- Baseline `KNOWN_BEFORE_E5`: alle Oberschule-Einträge entfernt.
