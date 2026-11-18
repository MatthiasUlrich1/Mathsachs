# Mapping Sekundarschule Sachsen-Anhalt · Mathematik (E4c)

Stand der Recherche: 2026-11-16. Nur Auswertung, es wurde kein Quellcode geändert.

## 1. Quelle

- **Dokument:** Fachlehrplan Sekundarschule Mathematik, Ministerium für Bildung des Landes Sachsen-Anhalt, **Stand: 01.08.2019** („In Kraft seit 2012, Anpassung 2019“; Anpassung an die KMK-Strategie „Bildung in der digitalen Welt“).
- **Exakte URL (abgerufen, PDF lesbar, 782 KB, Text per pdftotext extrahiert):** https://www.bildung-lsa.de/files/164f3f97e3adf65ff6f44685dd9e1ced/lp_sks_mathe_01_08_2019.pdf
- Ein zweiter Treffer der Websuche (lisa.sachsen-anhalt.de/…/Lehrplaene/Sek/lp_sks_mathe.pdf, Druckversion) wurde nicht abgerufen. Dieser Stand (2019) ist die jüngste gefundene Fassung. Ob es eine neuere gibt, ist ungeprüft.
- Lizenz laut Fußzeile: CC BY-SA 3.0. Zitate unten sind Verweise (Abschnitt + Seite), keine Textübernahmen.
- Hinweis: Der Kommentar im Repo (`sekundarschuleSachsenAnhaltPack.ts`) nennt nur eine gekürzte URL („…/lp_sks_mathe_01_08_2019.pdf“); die volle URL steht oben. Pack-`version` ist `1.1.0`, das Changelog beginnt bei `1.0.2` (kleine Inkonsistenz).

### Wie der Lehrplan HSA und RSA trennt

| Schuljahrgänge | Realschulabschluss (§3.3) | Hauptschulabschluss (§3.4) |
|---|---|---|
| 5/6 | gemeinsamer Block für beide (§3.2, S. 21–30), **nicht in 5 und 6 getrennt** | derselbe Block |
| 7/8 | §3.3.1, S. 31–39, 12 KS | §3.4.1, S. 47–55, 12 KS (gleiche Titel, schmalere Inhalte) |
| 9/10 | §3.3.2, S. 40–46: Potenzen, Pyramide/Kegel/Kugel, Ähnlichkeit, Trigonometrie, LGS, Potenz-/Exponentialfunktionen, quadratische Gleichungen/Funktionen + Sinus, Häufigkeitsverteilungen, zweistufige Zufallsversuche. Fußnote S. 40: in Jg. 9 verpflichtend sind nur Variablen, LGS, Potenzfunktionen/Wachstum, Pyramide…zusammengesetzte Körper, Häufigkeitsverteilungen/zweistufige Zufallsversuche; Ähnlichkeit, Trigonometrie, Quadratisches liegen frei in 9 oder 10 | **nur Jg. 9**, §3.4.2, S. 56–60: Potenzen, Pyramide + zusammengesetzte Körper, LGS, Potenzfunktionen/Wachstum, Häufigkeitsverteilungen |

Übersichtstabelle der Kompetenzschwerpunkte: §3.1, S. 19–20. Typische HSA-Kürzungen gegenüber RSA 7/8: kein Thales, bei Kreisen nur Tangenten zeichnen statt konstruieren, in 7/8 kein Hohlzylinder/keine Kubikwurzel, Zinsrechnung nur Jahreszinsen, nur Parallelogramm/Trapez bei den Vierecken. Im HSA 9: keine Potenzgesetze, keine Kegel/Kugel, kein Median, keine Exponentialfunktion.

## 2. Abweichungen Outline ↔ Lehrplan

Die Titel der Kompetenzschwerpunkte im Outline stimmen mit dem Lehrplan überein. Die Abweichungen betreffen einzelne Pack-Themen. Das gemeinsame Aufteilen von 5/6 auf Klasse 5 und 6 ist eine Repo-Entscheidung (D28) und keine Abweichung im Inhalt.

| Nr | Betroffen | Befund | Empfehlung | Quelle |
|---|---|---|---|---|
| D1 | sks-k5-median, sks-k5-spannweite (HS+RS) | In 5/6 nur arithmetisches Mittel. | Entfernen. | §3.2 S. 30 |
| D2 | sks-k6-median, sks-k6-mittelwert (HS+RS) | Ein KS Mittel für 5/6 (K5 deckt ihn ab); Median nie in 5/6. | Median entfernen; K6-Mittel nur als Vertiefung (andere Master-Quelle) oder entfernen. | §3.2 S. 30 |
| D3 | sks-k7-mittelwert/-median/-spannweite (HS+RS) | 7/8-Daten sind absolute/relative Häufigkeiten, Kenngrößen erst HSA 9 / RSA 9/10. | Entfernen; Spannweite nach sks-hs-k9-spannweite bzw. sks-rs-k10-spannweite, Median nur RS. | §3.3.1 S. 39, §3.4.1 S. 55, §3.4.2 S. 60, §3.3.2 S. 46 |
| D4 | sks-k6-haeufigkeit (HS+RS) | Relative Häufigkeit ist 7/8-Stoff. | Nach K7 verschieben (sks-k7-haeufigkeit, NEU). | §3.3.1 S. 39 / §3.4.1 S. 55 |
| D5 | sks-k6-anteil-prozent (HS+RS) | Prozentrechnung (Prozentwert/Grundwert/Prozentsatz) erst 7/8; 5/6 nur Anteile von Zahlen/Größen. | Auf „Anteil einer Größe“ umtiteln (lb5-anteil-groesse). | §3.2 S. 23; §3.3.1 S. 33 |
| D6 | sks-k5-geo-punkt (HS+RS) | Punktsymmetrie/Punktspiegelung steht nirgends im Lehrplan. | Entfernen. | §3.2 S. 26 (nur Achsensymmetrie, Geradenspiegelung, Verschiebung) |
| D7 | sks-k5-gleichung-beid (HS+RS) | ax+b=cx+d erst 7/8; zugleich doppelt zu sks-k7-gleichung-beid. | Entfernen. | §3.2 S. 23; §3.3.1 S. 34 |
| D8 | sks-k7-winkelsumme (HS+RS) | Nur Winkelsumme im Viereck, nicht im Vieleck. | Entfernen. | §3.3.1 S. 35 / §3.4.1 S. 51 |
| D9 | sks-k7-ungleichung (HS+RS) | Ungleichung nur als Begriff in 5/6; in 7/8 nicht gefordert. | Entfernen (oder nach K5/6 als Begriff). | §3.2 S. 23 |
| D10 | sks-k7-zinseszins (nur HS) | HSA 7/8: Jahreszinsen. Zinseszinsen erst HSA 9. RSA 7/8 nennt Zinseszins. | HS: nach sks-hs-k9-zinseszins verschieben. RS: bleibt. | §3.4.1 S. 49; §3.4.2 S. 59; §3.3.1 S. 33 |
| D12 | sks-k8-zylinder (HS+RS) | Zylinder ist 7/8-Block; doppelt zu sks-k7-zylinder (gleicher Master). | Entfernen. | §3.3.1 S. 37 / §3.4.1 S. 53 |
| D13 | sks-k8-thales (nur HS) | Thales steht nur im RSA-Kreise-KS. | HS: entfernen. RS: Outline (kein Master). | §3.3.1 S. 36 vs. §3.4.1 S. 52 |
| D14 | sks-hs-k9-potenz-prod/-quot | HSA 9: Potenzen berechnen, Zehnerpotenzen, Vorsätze; Potenzgesetze nur RSA. | Entfernen oder umwidmen (Rechnen mit Zehnerpotenzen/Vorsätzen). | §3.4.2 S. 57 vs. §3.3.2 S. 41 |
| D15 | sks-hs-k9-kegel | HSA 9: nur Pyramide (quadratische Grundfläche) + zusammengesetzte Körper. Kegel nur Begriff. | Entfernen. | §3.4.2 S. 58 |
| D16 | sks-*-k9-lgs-y (HS+RS) | Ein Master (k8-lb3-lgs) für drei Pack-Themen. | lgs-y mit lgs zusammenlegen; lgs-grafik bleibt Outline. | §3.4.2 S. 59; §3.3.2 S. 44 |
| D17 | sks-hs-k9-exp | HSA nennt „nichtlineares Wachstum“ und Zinseszins, Exponentialfunktion y=2^x nur RSA. | Umtiteln. | §3.4.2 S. 59; §3.3.2 S. 44 |
| D18 | sks-hs-k9-median, sks-hs-k9-modal | HSA-Kenngrößen: absolute/relative Häufigkeit, Mittel, Spannweite. Kein Median, kein Modalwert. | Entfernen. | §3.4.2 S. 60 |
| D19 | sks-hs-k9-zinsen | Jahreszinsen sind 7/8-Stoff (Dublette zu sks-k7-zinsen). | Entfernen. | §3.4.1 S. 49 |
| D20 | sks-rs-k9-zinsen/-zinseszins, sks-rs-k10-zinsen/-zinseszins | Zinsen/Zinseszins gehören in RSA 7/8 (Prozentrechnung); doppelte Master-Nutzung im Pack. | Vier Pack-Themen entfernen (Platz: sks-k7-zinsen/-zinseszins). | §3.3.1 S. 33 |
| D21 | sks-rs-k10-erwartung, sks-rs-k10-erwartung-wuerfel | Erwartungswert kommt im Lehrplan nicht vor. | Entfernen; Area „Zufallsgrößen und Kenngrößen“ umbenennen/auflösen. | §3.3.2 S. 46 |
| D22 | sks-rs-k9-laplace | Einstufige Laplace-Wahrscheinlichkeit ist 7/8-Stoff, Dublette zu sks-k8-laplace. | Entfernen. | §3.3.1 S. 39 |
| D23 | sks-rs-k9-modal | Modalwert steht nicht im Lehrplan. | Entfernen. | §3.3.2 S. 46 |
| D24 | RS Jg. 9/10 | Fußnote: in Jg. 9 nur fünf KS verpflichtend; Ähnlichkeit, Trigonometrie, Quadratisches liegen frei in 9 oder 10. | Aufteilung 9 vs. 10 im Pack bleibt, als Information. | §3.3.2 S. 40 (Fußnote) |
| D25 | sks-k5-umr-*, k5-umrechnen-* (Master) | Master-Topics k5-umrechnen-* haben im Dump teils kein `difficulty`; Master-Katalog und Dump widersprechen sich (Direktlesen: 2). | E3-Filter: fehlendes difficulty wie 1 behandeln; Quelle prüfen. | (Repo) |
| D26 | Master lb4-volumen-quader, lb4-oberflaeche-quader | Gleiche IDs in Gym-K5 und Gym-K6; Katalog (first-wins) kennt nur K5. | IDs eindeutig machen oder 1:n-Auflösung per (Klasse, ID) in E3. | (Repo) |
| D27 | Fehlende Pack-Themen (gefordert, kein Master): Binomische Formeln, Potenzfunktionen/Graphen, Nullstellen/Funktionsgleichung linear, Quadratwurzeln (7/8), Trapez/Rhombus, Diagramme/Erfassen von Daten, absolute Abweichung (RS), Maßstab | Im Outline nicht vorhanden. | Als Outline anlegen, sobald Master vorhanden ist (kein neuer Inhalt in diesem Auftrag). | u. a. §3.3.2 S. 41, 44, 46; §3.3.1 S. 36, 38; §3.2 S. 24, 30 |
| D28 | Klasse 5 vs. 6 | Der Lehrplan teilt 5/6 nicht auf. | Aufteilung bleibt, ist reine Repo-Entscheidung. | §3.2 S. 21 |
| D35 | sks-k7-flaeche-rechteck (HS+RS) | Rechteck/Quadrat gehören zu 5/6; Dublette zu sks-k5-flaeche-rechteck. | Entfernen. | §3.2 S. 27 |

Insgesamt 28 dokumentierte Abweichungen/Befunde (D25, D26, D28 sind Repo-/Struktur-Hinweise, keine Lehrplanabweichung).

## 3. Zählung vor und nach (spielbare Pack-Themen)

„Vor“ = heutiges Pack (`SKS_GENERATOR_MAP`), „Nach“ = vorgeschlagene Tabelle (nach Entfernen der Abweichungen, inkl. neuer Themen). Spielbar = mindestens eine Master-Quelle.

**Hauptschulabschluss**

| Klasse | Themen vorher | spielbar vorher | Themen nachher | spielbar nachher |
|---|---|---|---|---|
| 5 | 47 | 43 | 44 | 43 |
| 6 | 27 | 22 | 25 | 23 |
| 7 | 28 | 24 | 24 | 22 |
| 8 | 13 | 12 | 12 | 12 |
| 9 | 19 | 12 | 13 | 10 |
| **Summe** | 134 | 113 | 118 | 110 |

**Realschulabschluss**

| Klasse | Themen vorher | spielbar vorher | Themen nachher | spielbar nachher |
|---|---|---|---|---|
| 5 | 47 | 43 | 44 | 43 |
| 6 | 27 | 22 | 25 | 23 |
| 7 | 28 | 24 | 23 | 21 |
| 8 | 13 | 12 | 13 | 12 |
| 9 | 26 | 16 | 23 | 16 |
| 10 | 13 | 10 | 9 | 8 |
| **Summe** | 154 | 127 | 137 | 123 |

## 4. Profil Hauptschulabschluss (Pack `sekundarschule-sachsen-anhalt-hs`, Klasse 5–9)

maxDifficulty: Standard 2; 3 nur wo begründet (sks-hs-k9-lgs). Master-Spalte: Gym-Sachsen-Topic-IDs (Parent; ehemalige Neu-Aufgaben stecken im Parent). Zeilen mit [ENTFERNEN] haben keine Quelle.

### Klasse 5 · HSA

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `sks-k5-nat-runden` | Natürliche Zahlen runden | `lb1-runden-natuerlich` | 2 | Runden: Rundungsregeln. | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-nat-add` | Addieren natürlicher Zahlen | `lb1-addition` | 2 | Addition. | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-nat-sub` | Subtrahieren natürlicher Zahlen | `lb1-subtraktion` | 2 | Subtraktion. | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-nat-mul` | Multiplizieren natürlicher Zahlen | `lb1-multiplikation` | 2 | Multiplikation. | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-nat-schriftlich` | Schriftliche Rechenverfahren | `lb1-schriftliches-rechnen` | 2 | „schriftliche Rechenverfahren verstehen und ausführen“ (d2). | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-nat-div-rest` | Division mit Rest | `lb1-division-rest` | 2 | Division/Umkehroperation. | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-nat-div` | Schriftliche Division | `lb1-schriftliche-division` | 2 | Schriftliche Division (d2). | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-nat-potenz` | Potenzen (Quadrat- und Zehnerpotenzen) | `lb1-potenzieren` | 2 | „Potenzen berechnen“; Quadrat-/Kubik-/Zehnerpotenz. | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-nat-teilbarkeit` | Teilbarkeit prüfen | `lb1-teilbarkeit` | 2 | Teilbarkeitsregeln 2, 3, 5, 10. | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-nat-prim` | Primzahlen erkennen | `lb1-primzahl` | 2 | „gerade, ungerade Zahlen, Primzahlen“ (d2). | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-sachaufgaben` | Sachaufgaben mit natürlichen Zahlen und Größen (NEU) [NEU] | `lb5-gesamtpreis`, `lb5-teilen`, `lb5-mehrstufig` | 2 | Neues Pack-Thema vorgeschlagen: „inner- und außermathematische Anwendungsaufgaben lösen“. Nutzt ungenutzte Gym-K5-LB5-Themen. | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-gleichung-add` | Gleichung umstellen: x + a = b | `k7-lb2-gleichung-add` | 2 | Gleichungstyp ax+b=c; Master-Quelle liegt in Gym-K7, Inhalt K5-Niveau. | §3.2 KS Gleichungen, S. 23 |
| `sks-k5-gleichung-mul` | Gleichung umstellen: a · x = b | `k7-lb2-gleichung-mul` | 2 | Gleichungstyp ax=b. | §3.2 KS Gleichungen, S. 23 |
| `sks-k5-gleichung-beid` | Gleichung mit x auf beiden Seiten [ENTFERNEN] | — | — | ABWEICHUNG D7: In 5/6 nur ax+b=c, a(x+b)=c, ax=b, a:x=b; ax+b=cx+d erst 7/8. Identisch zu sks-k7-gleichung-beid, daher entfernen. | §3.2 KS Gleichungen, S. 23 |
| `sks-k5-gleichung-probe` | Lineare Gleichung und Probe [Outline] | — | — | „Ergebnisse durch Einsetzen überprüfen“ ist gefordert, aber kein freier Master (k8-lb1-gleichung-linear ist in sks-k7-gleichung gebunden). Bleibt Outline. | §3.2 KS Gleichungen, S. 23 |
| `sks-k5-bruch-anteil` | Anteil als Bruch | `lb2-anteil-bruch` | 2 | „Brüche als Teile von Ganzen angeben“. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k5-bruch-kuerzen` | Brüche kürzen | `lb2-kuerzen` | 2 | Brüche kürzen/erweitern. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k5-bruch-erweitern` | Brüche erweitern | `lb2-erweitern` | 2 | Brüche erweitern. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k5-bruch-grafik` | Brüche grafisch ablesen | `lb2-grafische-brueche` | 2 | Brüche veranschaulichen. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k5-dez-add` | Dezimalzahlen addieren und subtrahieren | `lb2-dez-add-sub` | 2 | Dezimalbrüche addieren/subtrahieren. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k5-dez-mul` | Dezimalzahlen multiplizieren | `lb2-dez-mult` | 2 | Dezimalbrüche multiplizieren. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k5-dez-div` | Dezimalzahlen dividieren | `lb2-dez-div` | 2 | Division steht im 5/6-Block unter Gebrochene Zahlen (Jg.-6-Niveau); der Block ist nicht in 5 und 6 aufgeteilt. | §3.2 KS Gebrochene Zahlen, S. 25 |
| `sks-k5-dez-runden` | Dezimalzahlen runden | `lb2-runden-dezimal` | 2 | „Dezimalbrüche runden“. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k5-dez-zahlenstrahl` | Dezimalzahlen auf dem Zahlenstrahl | `lb2-zahlenstrahl` | 2 | „auf dem Zahlenstrahl ablesen und eintragen“ (d2). | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k5-groessen-ordnen` | Größen mit verschiedenen Einheiten ordnen | `lb2-ordnen-einheiten` | 2 | „Größenangaben umrechnen, vergleichen und ordnen“ (d2). | §3.2 KS Größen, S. 24 |
| `sks-k5-umr-laenge` | Einheiten umrechnen: Länge | `k5-umrechnen-laenge` | 2 | Größenarten/Einheiten Länge. | §3.2 KS Größen, S. 24 |
| `sks-k5-umr-masse` | Einheiten umrechnen: Masse | `k5-umrechnen-masse` | 2 | Größenarten/Einheiten Masse. | §3.2 KS Größen, S. 24 |
| `sks-k5-umr-zeit` | Einheiten umrechnen: Zeit | `k5-umrechnen-zeit` | 2 | Größenarten/Einheiten Zeit. | §3.2 KS Größen, S. 24 |
| `sks-k5-umr-flaeche` | Einheiten umrechnen: Flächeninhalt | `k5-umrechnen-flaeche` | 2 | Größenarten/Einheiten Flächeninhalt. | §3.2 KS Größen, S. 24 |
| `sks-k5-umr-volumen` | Einheiten umrechnen: Volumen | `k5-umrechnen-volumen` | 2 | Größenarten/Einheiten Volumen. | §3.2 KS Größen, S. 24 |
| `sks-k5-geo-strecken` | Strecke, Gerade und Halbgerade | `lb3-strecken-bezeichnung` | 2 | Punkt, Gerade, Strahl, Strecke bezeichnen. | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-geo-laenge` | Länge von Strecken | `lb3-strecken-laenge` | 2 | Messen von Längen. | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-geo-mittelpunkt` | Mittelpunkt einer Strecke | `lb3-strecken-mittelpunkt` | 2 | Nur indirekt (Konstruktion/Koordinaten); d2. | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-geo-koord-ablesen` | Koordinaten ablesen | `lb3-koordinaten-ablesen` | 2 | Koordinatensystem, I. Quadrant. | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-geo-koord-eintragen` | Punkte im Koordinatensystem zuordnen | `lb3-koordinaten-eintragen` | 2 | Koordinatensystem, I. Quadrant. | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-geo-abstand` | Abstand zwischen Punkten | `lb3-koordinaten-abstand` | 2 | Abstand im Koordinatensystem (d2). | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-geo-winkelarten` | Winkelarten erkennen | `lb3-winkelarten` | 2 | spitz/recht/stumpf/gestreckt/überstumpf. | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-geo-winkel-erg` | Winkel zu 90° oder 180° ergänzen | `lb3-winkel-ergaenzung` | 2 | Winkelgrößen bestimmen. | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-geo-verschiebung` | Verschiebung von Figuren | `lb3-verschiebung` | 2 | „Merkmale von Verschiebung und Spiegelung“ (d2). | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-geo-achse` | Achsensymmetrie erkennen | `lb3-achsensymmetrie` | 2 | Achsensymmetrie/Geradenspiegelung (d2). | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-geo-punkt` | Punktsymmetrie / Punktspiegelung [ENTFERNEN] | — | — | ABWEICHUNG D6: Punktsymmetrie/-spiegelung kommt im gesamten Fachlehrplan nicht vor (nur Achsen-/Geradenspiegelung, Verschiebung). Entfernen; lb3-punktsymmetrie bleibt ungenutzt. | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-umfang-rechteck` | Umfang von Rechteck und Quadrat | `lb4-umfang-rechteck`, `lb3-umfang-rechteck` | 2 | Zweite Quelle (Gym-K6) vergrößert den Pool; 5/6-Block ohne Klassenaufteilung. | §3.2 KS Umfang, Flächeninhalt und Volumen, S. 27 |
| `sks-k5-flaeche-rechteck` | Flächeninhalt von Rechteck und Quadrat | `lb4-flaeche-rechteck`, `lb3-flaeche-rechteck` | 2 | Wie oben. | §3.2 KS Umfang, Flächeninhalt und Volumen, S. 27 |
| `sks-k5-volumen-quader` | Volumen von Quader und Würfel | `lb4-volumen-quader` | 2 | ID lb4-volumen-quader kommt in Gym-K5 und Gym-K6 vor (ID-Kollision; Katalog nimmt K5). Als eine Quelle gezählt. | §3.2 KS Umfang, Flächeninhalt und Volumen, S. 27 |
| `sks-k5-oberflaeche-quader` | Oberflächeninhalt von Quadern | `lb4-oberflaeche-quader` | 2 | Wie oben (ID in K5 und K6), d2. | §3.2 KS Umfang, Flächeninhalt und Volumen, S. 27 |
| `sks-k5-mittelwert` | Arithmetisches Mittel | `lb2-mittelwert` | 2 | Der KS gilt für den gesamten 5/6-Block. | §3.2 KS Arithmetisches Mittel, S. 30 |
| `sks-k5-median` | Median (Zentralwert) [ENTFERNEN] | — | — | ABWEICHUNG D1: Im 5/6-Block nur arithmetisches Mittel. Median erst RSA 9/10 (Kenngrößen), im HSA nie. Entfernen. | §3.2 KS Arithmetisches Mittel, S. 30 |
| `sks-k5-spannweite` | Spannweite berechnen [ENTFERNEN] | — | — | ABWEICHUNG D1: nicht im 5/6-Block. Spannweite erst HSA 9 / RSA 9/10. Entfernen. | §3.2 KS Arithmetisches Mittel, S. 30 |

### Klasse 6 · HSA

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `sks-k6-bruch-kuerzen` | Brüche kürzen | `lb1-kuerzen` | 2 | Selbes Konzept wie sks-k5-bruch-kuerzen, aber anderes Master-Thema (Gym-K6). | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k6-bruch-erweitern` | Brüche erweitern | `lb1-erweitern` | 2 | Wie oben. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k6-bruch-vergleichen` | Brüche vergleichen | `lb1-vergleichen` | 2 | „gebrochene Zahlen vergleichen und ordnen“. | §3.2 KS Gebrochene Zahlen, S. 25 |
| `sks-k6-bruch-add` | Brüche addieren und subtrahieren | `lb1-add-sub-brueche`, `lb1-sachaufgabe-bruch` | 2 | Zusätzlich Sachaufgabe Bruchrechnung (Anwendungsaufgaben). | §3.2 KS Gebrochene Zahlen, S. 25 |
| `sks-k6-bruch-mul` | Brüche multiplizieren | `lb1-mult-brueche` | 2 | Grundrechenarten mit gebrochenen Zahlen. | §3.2 KS Gebrochene Zahlen, S. 25 |
| `sks-k6-bruch-div` | Brüche dividieren | `lb1-div-brueche` | 2 | Kehrwert (d2). | §3.2 KS Gebrochene Zahlen, S. 25 |
| `sks-k6-bruch-dez` | Brüche in Dezimalzahlen umwandeln | `lb1-bruch-dezimal` | 2 | „gemeine Brüche und Dezimalbrüche ineinander umwandeln“. | §3.2 KS Gebrochene Zahlen, S. 25 |
| `sks-k6-prozent` | In Prozent umwandeln | `lb1-prozent` | 2 | Nur „spezielle Brüche … prozentualen Angaben zuordnen“; Prozentrechnung erst 7/8. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k6-dez-add` | Dezimalzahlen addieren und subtrahieren | `lb1-dez-add-sub` | 2 | Master Gym-K6; Konzeptdopplung zu sks-k5-dez-add (anderes Master-Thema). | §3.2 KS Gebrochene Zahlen, S. 25 |
| `sks-k6-dez-mul` | Dezimalzahlen multiplizieren | `lb1-dez-mult` | 2 | Wie oben. | §3.2 KS Gebrochene Zahlen, S. 25 |
| `sks-k6-dez-div` | Dezimalzahlen dividieren | `lb1-dez-div` | 2 | Wie oben. | §3.2 KS Gebrochene Zahlen, S. 25 |
| `sks-k6-dez-runden` | Dezimalzahlen runden | `lb1-runden` | 2 | Wie oben. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k6-nebenwinkel` | Nebenwinkel berechnen | `k7-lb1-nebenwinkel` | 2 | Master in Gym-K7, Jg.-6-Niveau; Nebenwinkelsatz im 5/6-Block. | §3.2 KS Winkelbeziehungen, S. 27 |
| `sks-k6-scheitelwinkel` | Scheitel- und Stufenwinkel | `k7-lb1-scheitelwinkel` | 2 | Scheitel-/Stufenwinkelsatz. | §3.2 KS Winkelbeziehungen, S. 27 |
| `sks-k6-wechselwinkel` | Wechselwinkel an Parallelen [Outline] | — | — | Im Lehrplan gefordert (Wechselwinkelsatz), aber kein eigener Master, daher Outline. | §3.2 KS Winkelbeziehungen, S. 27 |
| `sks-k6-gestreckter` | Winkel am gestreckten Winkel [Outline] | — | — | Kein eigener Master (lb3-winkel-ergaenzung ist in K5 gebunden), daher Outline. | §3.2 KS Winkelbeziehungen, S. 27 |
| `sks-k6-winkel-dreieck` | Innenwinkelsatz im Dreieck | `lb3-winkel-dreieck`, `k7-lb1-basiswinkel` | 2 | Zusätzlich Basiswinkel im gleichschenkligen Dreieck (d2). | §3.2 KS Dreiecke, S. 28 |
| `sks-k6-flaeche-dreieck` | Flächeninhalt von Dreiecken | `lb3-flaeche-dreieck` | 2 | Formel Fläche Dreieck. | §3.2 KS Dreiecke, S. 28 |
| `sks-k6-kongruenz` | Kongruenzsatz wählen | `lb3-kongruenzsatz` | 2 | Kongruenzsätze (d2). | §3.2 KS Dreiecke, S. 28 |
| `sks-k6-umkreis` | Umkreis eines Dreiecks | `k7-lb1-mittelsenkrechte-schritte` | 2 | Mittelsenkrechte/Umkreis; Konstruktionsschritte (d2). Neu zugeordnet (bisher Outline). | §3.2 KS Dreiecke, S. 28 |
| `sks-k6-proportional` | Proportionale Zuordnung (Dreisatz) | `lb2-proportional` | 2 | Direkte Proportionalität/Dreisatz. | §3.2 KS Direkte und indirekte Proportionalität, S. 29 |
| `sks-k6-antiproportional` | Antiproportionale Zuordnung | `lb2-antiproportional` | 2 | Indirekte Proportionalität (d2). | §3.2 KS Direkte und indirekte Proportionalität, S. 29 |
| `sks-k6-dreisatz` | Sachaufgabe: Dreisatz mit Einheiten | `lb2-sachaufgabe-dreisatz` | 2 | Dreisatz (d2). | §3.2 KS Direkte und indirekte Proportionalität, S. 29 |
| `sks-k6-anteil-prozent` | Anteil einer Größe berechnen (statt „Prozent einer Größe“) [Titel anpassen] | `lb5-anteil-groesse` | 2 | ABWEICHUNG D5: „Prozent einer Größe“ ist 7/8-Stoff; in 5/6 „Anteile von Zahlen und Größen ermitteln“. Titel anpassen; lb5-anteil-prozent geht nach sks-k7-prozent. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k6-haeufigkeit` | Relative Häufigkeit in Prozent [ENTFERNEN] | — | — | ABWEICHUNG D4: Relative Häufigkeit gehört zu 7/8 (Erfassen, Darstellen und Auswerten von Daten). Verschieben nach sks-k7-haeufigkeit. | §3.3.1 S. 39 / §3.4.1 S. 55 (5/6, S. 30: nur Strichliste, Säulen-/Liniendiagramm) |
| `sks-k6-mittelwert` | Arithmetisches Mittel | `k7-lb4-mittelwert` | 2 | ABWEICHUNG D2: ein KS für den 5/6-Block, schon durch sks-k5-mittelwert abgedeckt. K6-Fassung nur als Vertiefung über das andere Master-Thema; Alternative: entfernen. | §3.2 KS Arithmetisches Mittel, S. 30 |
| `sks-k6-median` | Median (Zentralwert) [ENTFERNEN] | — | — | ABWEICHUNG D2: Median nicht im 5/6-Block. Entfernen. | §3.2 KS Arithmetisches Mittel, S. 30 |

### Klasse 7 · HSA

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `sks-k7-rat-add` | Rationale Zahlen addieren | `k7-lb2-add-rational` | 2 | Grundrechenoperationen mit rationalen Zahlen. | §3.4.1 (HSA 7/8) KS Rationale Zahlen, S. 48 |
| `sks-k7-rat-sub` | Rationale Zahlen subtrahieren | `k7-lb2-sub-rational` | 2 | Grundrechenoperationen mit rationalen Zahlen. | §3.4.1 (HSA 7/8) KS Rationale Zahlen, S. 48 |
| `sks-k7-rat-mul` | Rationale Zahlen multiplizieren | `k7-lb2-mul-rational` | 2 | Grundrechenoperationen mit rationalen Zahlen. | §3.4.1 (HSA 7/8) KS Rationale Zahlen, S. 48 |
| `sks-k7-rat-div` | Rationale Zahlen dividieren | `k7-lb2-div-rational` | 2 | Grundrechenoperationen mit rationalen Zahlen. | §3.4.1 (HSA 7/8) KS Rationale Zahlen, S. 48 |
| `sks-k7-betrag` | Betrag einer Zahl | `k7-lb2-betrag` | 2 | Betrag/entgegengesetzte Zahl. | §3.4.1 (HSA 7/8) KS Rationale Zahlen, S. 48 |
| `sks-k7-prozent` | Prozent einer Größe berechnen | `lb5-anteil-prozent` | 2 | Prozentwert/Grundwert/Prozentsatz (Pool ggf. nur Prozentwert). | §3.4.1 (HSA 7/8) KS Prozentrechnung, S. 49 |
| `sks-k7-zinsen` | Jahreszinsen berechnen | `k10-lb1-zinsen` | 2 | Zinsrechnung; HSA: Jahreszinsen. | §3.4.1 (HSA 7/8) KS Prozentrechnung, S. 49 |
| `sks-k7-zinseszins` | Zinseszins: Endkapital [ENTFERNEN] | — | — | ABWEICHUNG D10: HSA 7/8 nur Jahreszinsen; Zinseszinsen erst HSA 9. Für HS entfernen, nach sks-hs-k9-zinseszins verschieben. | §3.4.1 (HSA 7/8) KS Prozentrechnung, S. 49 |
| `sks-hs-k7-kapital` | Kapital aus Zinsen bestimmen (NEU, nur HS) [NEU] | `k10-lb5-kapital` | 2 | Grundwert aus Prozentwert/Prozentsatz (Kapital, Zinsen, Zinssatz sind im HSA 7/8 benannt). | §3.4.1 (HSA 7/8) KS Prozentrechnung, S. 49 |
| `sks-hs-k7-zinssatz` | Zinssatz bestimmen (NEU, nur HS) [NEU] | `k10-lb5-zinssatz` | 2 | Prozentsatz aus Zinsen/Kapital. | §3.4.1 (HSA 7/8) KS Prozentrechnung, S. 49 |
| `sks-k7-haeufigkeit` | Absolute und relative Häufigkeit (NEU, ersetzt sks-k6-haeufigkeit) [NEU] | `lb2-haeufigkeit`, `k7-lb4-rel-haeufigkeit` | 2 | Neues Pack-Thema; „absolute/relative Häufigkeit, auch in Prozent“. | §3.4.1 (HSA 7/8) KS Erfassen, Darstellen und Auswerten von Daten, S. 55 |
| `sks-k7-gleichung` | Lineare Gleichung a·x + b = c | `k8-lb1-gleichung-linear`, `k8-lb5-zahlenraetsel`, `k8-lb5-rueckwaerts` | 2 | Zusätzlich Anwendungsaufgaben/Gleichung aufstellen, Rückwärtsrechnen („Probe am Text“). | §3.4.1 (HSA 7/8) KS Lineare Gleichungen, S. 49 |
| `sks-k7-gleichung-beid` | Gleichung mit x auf beiden Seiten | `k8-lb1-gleichung-beidseitig` | 2 | Typ ax+b=cx+d (d2). | §3.4.1 (HSA 7/8) KS Arbeiten mit Variablen, Gleichungen und Formeln, S. 50 |
| `sks-k7-gleichung-klammer` | Gleichung mit Klammern vorbereiten [Outline] | — | — | Gefordert („mit Klammern“), kein freier Master, daher Outline. | §3.4.1 (HSA 7/8) KS Arbeiten mit Variablen, Gleichungen und Formeln, S. 50 |
| `sks-k7-ungleichung` | Einfache lineare Ungleichung (Idee) [ENTFERNEN] | — | — | ABWEICHUNG D9: Ungleichung nur als Begriff in 5/6 (S. 23), in 7/8 nicht gefordert. Entfernen. | §3.2 KS Gleichungen, S. 23 |
| `sks-k7-term` | Term mit Rechengesetzen auswerten | `k7-lb2-term-vorrang` | 2 | Termwerte berechnen/Rechenvorteile. | §3.4.1 (HSA 7/8) KS Arbeiten mit Variablen, Gleichungen und Formeln, S. 50 |
| `sks-k7-term-auswerten` | Term auswerten (x einsetzen) | `k8-lb1-term-auswerten` | 2 | „Termwerte … berechnen“. | §3.4.1 (HSA 7/8) KS Arbeiten mit Variablen, Gleichungen und Formeln, S. 50 |
| `sks-k7-zusammenfassen` | Terme zusammenfassen | `k8-lb1-zusammenfassen` | 2 | Zusammenfassen gleichartiger Summanden. | §3.4.1 (HSA 7/8) KS Arbeiten mit Variablen, Gleichungen und Formeln, S. 50 |
| `sks-k7-ausmult` | Klammer ausmultiplizieren | `k8-lb1-ausmultiplizieren` | 2 | Ausmultiplizieren (d2). | §3.4.1 (HSA 7/8) KS Arbeiten mit Variablen, Gleichungen und Formeln, S. 50 |
| `sks-k7-winkel-viereck` | Winkelsumme im Viereck | `lb3-winkel-viereck` | 2 | Innenwinkelsatz Viereck. | §3.4.1 (HSA 7/8) KS Vierecke, S. 51 |
| `sks-k7-winkelsumme` | Innenwinkelsumme im Vieleck [ENTFERNEN] | — | — | ABWEICHUNG D8: Lehrplan nur Viereck. Entfernen; k7-lb1-winkelsumme-vieleck bleibt ungenutzt. | §3.4.1 (HSA 7/8) KS Vierecke, S. 51 |
| `sks-k7-flaeche-rechteck` | Flächeninhalt von Rechteck und Quadrat [ENTFERNEN] | — | — | ABWEICHUNG D35: Konzeptdopplung zu sks-k5-flaeche-rechteck (5/6). Entfernen. | §3.4.1 (HSA 7/8) KS Vierecke, S. 51 |
| `sks-k7-parallelogramm` | Flächeninhalt von Dreieck/Parallelogramm (Idee) [Outline] | — | — | Parallelogramm/Trapez gefordert; kein Master, daher Outline. | §3.4.1 (HSA 7/8) KS Vierecke, S. 51 |
| `sks-k7-volumen-prisma` | Volumen gerader Prismen | `k7-lb3-volumen-prisma`, `lb4-volumen-prisma`, `lb4-flaeche-kante-quader` | 2 | Prisma (Grundfläche Dreieck/Viereck); „Bestimmungsstücke bei gegebenem Volumen“ über lb4-flaeche-kante-quader. | §3.4.1 (HSA 7/8) KS Körperberechnung – Prismen und Kreiszylinder, S. 53 |
| `sks-k7-mantel-prisma` | Mantelfläche eines Prismas | `k7-lb3-mantel-prisma` | 2 | Oberflächeninhalt Prisma (Mantel als Teil). | §3.4.1 (HSA 7/8) KS Körperberechnung – Prismen und Kreiszylinder, S. 53 |
| `sks-k7-oberflaeche-quader` | Oberfläche eines Quaders [Titel anpassen] | `k7-lb3-oberflaeche-quader` | 2 | Quader als Prisma; Konzeptnähe zu sks-k5-oberflaeche-quader, anderes Master-Thema. Titel „Oberflächeninhalt von Prismen“ empfohlen. | §3.4.1 (HSA 7/8) KS Körperberechnung – Prismen und Kreiszylinder, S. 53 |
| `sks-k7-zylinder` | Volumen eines Kreiszylinders | `k9-lb2-zylinder-volumen` | 2 | Einzige Zylinder-Platzierung (sks-k8-zylinder entfällt). | §3.4.1 (HSA 7/8) KS Körperberechnung – Prismen und Kreiszylinder, S. 53 |
| `sks-k7-netz` | Körpernetze und Schrägbilder | `lb4-wuerfelnetz` | 2 | Netz (Würfelnetz); Schrägbild ohne Master. | §3.4.1 (HSA 7/8) KS Körperdarstellung, S. 52 |
| `sks-k7-mittelwert` | Arithmetisches Mittel [ENTFERNEN] | — | — | ABWEICHUNG D3: In 7/8 keine Kenngrößen (nur Häufigkeiten). Mittel liegt in 5/6 und HSA 9 / RSA 9/10. Entfernen. | §3.4.1 (HSA 7/8) KS Erfassen, Darstellen und Auswerten von Daten, S. 55 |
| `sks-k7-median` | Median (Zentralwert) [ENTFERNEN] | — | — | ABWEICHUNG D3: nicht in 7/8, im HSA nie. Entfernen. | §3.4.1 (HSA 7/8) KS Erfassen, Darstellen und Auswerten von Daten, S. 55 |
| `sks-k7-spannweite` | Spannweite berechnen [ENTFERNEN] | — | — | ABWEICHUNG D3: nicht in 7/8. HS: sks-hs-k9-spannweite. | §3.4.1 (HSA 7/8) KS Erfassen, Darstellen und Auswerten von Daten, S. 55 |

### Klasse 8 · HSA

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `sks-k8-kreis-umfang` | Umfang eines Kreises | `k9-lb2-kreis-umfang` | 2 | Umfang Kreis. | §3.4.1 (HSA 7/8) KS Kreise, S. 52 |
| `sks-k8-kreis-flaeche` | Flächeninhalt eines Kreises | `k9-lb2-kreis-flaeche` | 2 | Fläche Kreis. | §3.4.1 (HSA 7/8) KS Kreise, S. 52 |
| `sks-k8-zylinder` | Volumen eines Kreiszylinders [ENTFERNEN] | — | — | ABWEICHUNG D12: Doppelt zu sks-k7-zylinder (Master nur einmal pro Pack). Entfernen. | §3.4.1 (HSA 7/8) KS Körperberechnung – Prismen und Kreiszylinder, S. 53 |
| `sks-k8-thales` | Satz des Thales [ENTFERNEN] | — | — | ABWEICHUNG D13: HSA-Kreise ohne Thales (S. 52). Für HS entfernen. | §3.4.1 (HSA 7/8) KS Kreise, S. 52 |
| `sks-k8-zusammengesetzt` | Zusammengesetzte Figuren: Fläche und Umfang (NEU) [NEU] | `lb4-flaeche-zusammengesetzt`, `lb4-umfang-zusammengesetzt`, `lb3-sachaufgabe-geometrie`, `lb5-sachaufgabe-flaeche` | 2 | Neues Pack-Thema: „Figuren aus Rechteck, Dreieck, Kreis“. Master enthält ggf. keine Kreisanteile (Stichprobe nötig). | §3.4.1 (HSA 7/8) KS Kreise, S. 52 |
| `sks-k8-pythagoras-hyp` | Satz des Pythagoras: Hypotenuse | `k9-lb3-pythagoras-hypotenuse` | 2 | Satz des Pythagoras. | §3.4.1 (HSA 7/8) KS Rechtwinklige Dreiecke, S. 53 |
| `sks-k8-pythagoras-kat` | Satz des Pythagoras: fehlende Kathete | `k9-lb3-pythagoras-kathete` | 2 | Dreiecksstücke berechnen (d2). | §3.4.1 (HSA 7/8) KS Rechtwinklige Dreiecke, S. 53 |
| `sks-k8-leiter` | Pythagoras im Sachkontext | `k9-lb5-leiter` | 2 | Anwendungsaufgaben (d2). | §3.4.1 (HSA 7/8) KS Rechtwinklige Dreiecke, S. 53 |
| `sks-k8-funktionswert` | Funktionswert einer linearen Funktion | `k8-lb3-funktionswert` | 2 | Funktionswert. | §3.4.1 (HSA 7/8) KS Lineare Funktionen, S. 54 |
| `sks-k8-steigung` | Steigung aus zwei Punkten | `k8-lb3-steigung` | 2 | Parameter m (d2). | §3.4.1 (HSA 7/8) KS Lineare Funktionen, S. 54 |
| `sks-k8-achsen` | y-Achsenabschnitt bestimmen | `k8-lb3-achsenabschnitt` | 2 | Parameter n / Nullstelle (d2). | §3.4.1 (HSA 7/8) KS Lineare Funktionen, S. 54 |
| `sks-k8-laplace` | Laplace-Wahrscheinlichkeit als Bruch | `k8-lb2-laplace-bruch` | 2 | Einstufige Zufallsversuche. | §3.4.1 (HSA 7/8) KS Häufigkeiten und Wahrscheinlichkeiten, S. 55 |
| `sks-k8-laplace-pct` | Laplace-Wahrscheinlichkeit in Prozent | `k8-lb2-laplace-prozent` | 2 | Wahrscheinlichkeit P(A). | §3.4.1 (HSA 7/8) KS Häufigkeiten und Wahrscheinlichkeiten, S. 55 |
| `sks-k8-gegen` | Gegenwahrscheinlichkeit | `k8-lb2-gegenwahrscheinlichkeit` | 2 | P(A)+P(Ā)=1. | §3.4.1 (HSA 7/8) KS Häufigkeiten und Wahrscheinlichkeiten, S. 55 |

### Klasse 9 · HSA

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `sks-hs-k9-potenz-prod` | Potenzgesetz: Produkt gleicher Basis [ENTFERNEN] | — | — | ABWEICHUNG D14: HSA 9 verlangt Potenzen berechnen/Zehnerpotenzen/Vorsätze, keine Potenzgesetze (nur RSA, S. 41). Entfernen oder auf Rechnen mit Zehnerpotenzen umwidmen. | §3.4.2 (HSA 9) KS Arbeiten mit Variablen, Potenzen, S. 57 |
| `sks-hs-k9-potenz-quot` | Potenzgesetz: Quotient und Potenz einer Potenz [ENTFERNEN] | — | — | ABWEICHUNG D14 wie oben. | §3.4.2 (HSA 9) KS Arbeiten mit Variablen, Potenzen, S. 57 |
| `sks-hs-k9-potenz-wert` | Potenz- und Quadratwerte berechnen [Outline] | — | — | Gefordert („Potenzen berechnen“), kein freier Master, daher Outline. | §3.4.2 (HSA 9) KS Arbeiten mit Variablen, Potenzen, S. 57 |
| `sks-hs-k9-wurzel` | Wurzeln und Betrag (Näherung) [Outline] | — | — | Kubikwurzel/Wertetabellen gefordert; kein Master, daher Outline. | §3.4.2 (HSA 9) KS Arbeiten mit Variablen, Potenzen, S. 57 |
| `sks-hs-k9-formeln` | Formeln umstellen (NEU) [NEU] | `k10-lb3-quadrat-seite`, `k10-lb3-rechteck-breite`, `k10-lb3-rechteck-umfang` | 2 | „Gleichungen und Formeln nach verschiedenen Variablen umstellen“; ungenutzte Gym-K10-LB3-Themen (d1/d2/d2). | §3.4.2 (HSA 9) KS Arbeiten mit Variablen, Potenzen, S. 57 |
| `sks-hs-k9-pyramide` | Volumen einer Pyramide | `k7-lb3-volumen-pyramide` | 2 | HSA: Pyramiden mit quadratischer Grundfläche; Master-Aufgaben darauf prüfen. | §3.4.2 KS Pyramide, zusammengesetzte Körper, S. 58 |
| `sks-hs-k9-oberflaeche-pyramide` | Oberfläche einer Pyramide | `k7-lb3-oberflaeche-pyramide` | 2 | Wie oben. | §3.4.2 KS Pyramide, zusammengesetzte Körper, S. 58 |
| `sks-hs-k9-volumen-zus` | Zusammengesetzte Körper: Volumen | `lb4-volumen-zusammengesetzt` | 2 | „Berechnungen an zusammengesetzten Körpern“. | §3.4.2 KS Pyramide, zusammengesetzte Körper, S. 58 |
| `sks-hs-k9-kegel` | Kegel (Volumen / Oberfläche) [ENTFERNEN] | — | — | ABWEICHUNG D15: Kegel nur als Begriff, im HSA nicht berechnet (S. 58). Entfernen. | §3.4.2 KS Pyramide, zusammengesetzte Körper, S. 58 |
| `sks-hs-k9-lgs` | Lineares Gleichungssystem (x bestimmen) | `k8-lb3-lgs` | 3 | Einziger LGS-Master ist difficulty 3; der Lehrplan verlangt LGS (Einsetzungsverfahren), daher md 3 begründet. Variantenfilter in E3 erwägen. | §3.4.2 KS Lineare Gleichungssysteme, S. 59 |
| `sks-hs-k9-lgs-y` | Lineares Gleichungssystem (y bestimmen) [ENTFERNEN] | — | — | ABWEICHUNG D16: derselbe Master wie sks-hs-k9-lgs; zusammenlegen, entfernen. | §3.4.2 KS Lineare Gleichungssysteme, S. 59 |
| `sks-hs-k9-lgs-grafik` | LGS grafisch deuten (Idee) [Outline] | — | — | „grafisch lösen“ gefordert; kein Master, daher Outline. | §3.4.2 KS Lineare Gleichungssysteme, S. 59 |
| `sks-hs-k9-exp` | Wachstum: Zinseszins/nichtlineares Wachstum [Titel anpassen] | `k10-lb1-exp-wachstum` | 2 | ABWEICHUNG D17: HSA nennt nichtlineares Wachstum, nicht Exponentialfunktionen; Titel „Exponentielles Wachstum“ anpassen (d2). | §3.4.2 KS Potenzfunktionen, Wachstumsprozesse, S. 59 |
| `sks-hs-k9-zunahme` | Prozentuale Zunahme | `k10-lb1-prozentuale-zunahme` | 2 | „Steigerung bzw. Senkung um bzw. auf; vermehrter/verminderter Grundwert“. | §3.4.2 KS Potenzfunktionen, Wachstumsprozesse, S. 59 |
| `sks-hs-k9-zinsen` | Jahreszinsen berechnen [ENTFERNEN] | — | — | ABWEICHUNG D19: Jahreszinsen sind 7/8-Stoff; Master k10-lb1-zinsen steckt in sks-k7-zinsen. Entfernen. | §3.4.2 KS Potenzfunktionen, Wachstumsprozesse, S. 59 |
| `sks-hs-k9-zinseszins` | Zinseszins: Endkapital | `k10-lb1-zinseszins` | 2 | „Zinseszinsen“ im HSA 9; aus K7 hierher verschoben. | §3.4.2 KS Potenzfunktionen, Wachstumsprozesse, S. 59 |
| `sks-hs-k9-mittelwert` | Arithmetisches Mittel | `k9-lb4-mittelwert` | 2 | Kenngröße. | §3.4.2 KS Häufigkeitsverteilungen, S. 60 |
| `sks-hs-k9-median` | Median (Zentralwert) [ENTFERNEN] | — | — | ABWEICHUNG D18: HSA-Kenngrößen: abs./rel. Häufigkeit, Mittel, Spannweite (S. 60); kein Median. Entfernen. | §3.4.2 KS Häufigkeitsverteilungen, S. 60 |
| `sks-hs-k9-modal` | Modalwert (häufigster Wert) [ENTFERNEN] | — | — | ABWEICHUNG D18: Modalwert steht in keinem Profil. Entfernen. | §3.4.2 KS Häufigkeitsverteilungen, S. 60 |
| `sks-hs-k9-spannweite` | Spannweite berechnen | `k7-lb4-spannweite` | 2 | Kenngröße Spannweite. | §3.4.2 KS Häufigkeitsverteilungen, S. 60 |

### Abdeckung HS

**Pack-Themen ohne Master-Quelle (bleiben Outline), 8:**

- `sks-k5-gleichung-probe` Lineare Gleichung und Probe
- `sks-k6-wechselwinkel` Wechselwinkel an Parallelen
- `sks-k6-gestreckter` Winkel am gestreckten Winkel
- `sks-k7-gleichung-klammer` Gleichung mit Klammern vorbereiten
- `sks-k7-parallelogramm` Flächeninhalt von Dreieck/Parallelogramm (Idee)
- `sks-hs-k9-potenz-wert` Potenz- und Quadratwerte berechnen
- `sks-hs-k9-wurzel` Wurzeln und Betrag (Näherung)
- `sks-hs-k9-lgs-grafik` LGS grafisch deuten (Idee)

**Zur Entfernung empfohlen (Abweichung), 22:** `sks-k5-gleichung-beid`, `sks-k5-geo-punkt`, `sks-k5-median`, `sks-k5-spannweite`, `sks-k6-haeufigkeit`, `sks-k6-median`, `sks-k7-zinseszins`, `sks-k7-ungleichung`, `sks-k7-winkelsumme`, `sks-k7-flaeche-rechteck`, `sks-k7-mittelwert`, `sks-k7-median`, `sks-k7-spannweite`, `sks-k8-zylinder`, `sks-k8-thales`, `sks-hs-k9-potenz-prod`, `sks-hs-k9-potenz-quot`, `sks-hs-k9-kegel`, `sks-hs-k9-lgs-y`, `sks-hs-k9-zinsen`, `sks-hs-k9-median`, `sks-hs-k9-modal`

**Nicht genutzte Master-Themen (Gym-K5 bis K10, Parent-Ebene), 21 von 147:**

| Master-ID | Herkunft | Titel | diff | Grund |
|---|---|---|---|---|
| lb3-punktsymmetrie | Gym-K5 | Punktsymmetrie / Punktspiegelung | d2 | Punktsymmetrie im FLP nicht vorhanden (D6). |
| k6-umrechnen-flaeche | Gym-K6 | Einheiten umrechnen: Flächeninhalt | d2 | Konzeptdopplung zu sks-k5-umr-flaeche; optional als Zusatzquelle dort. |
| k6-umrechnen-laenge | Gym-K6 | Einheiten umrechnen: Länge | d2 | Konzeptdopplung zu sks-k5-umr-laenge (ein KS Größen für 5/6); optional als Zusatzquelle dort. |
| k7-lb1-winkelsumme-vieleck | Gym-K7 | Innenwinkelsumme im Vieleck | d2 | FLP nur Viereck, nicht Vieleck (D8). |
| k7-lb4-median | Gym-K7 | Median (Zentralwert) | d2 | Median nur RSA 9/10 (D18). |
| k8-lb4-streckfaktor | Gym-K8 | Streckfaktor bestimmen | d2 | Ähnlichkeit/zentrische Streckung nur RSA 9/10, nicht im HSA. |
| k8-lb4-strahlensatz | Gym-K8 | Strahlensatz: fehlende Länge | d2 | Ähnlichkeit/zentrische Streckung nur RSA 9/10, nicht im HSA. |
| k8-lb4-aehnliche-seite | Gym-K8 | Ähnliche Figuren: Seitenlänge | d2 | Ähnlichkeit/zentrische Streckung nur RSA 9/10, nicht im HSA. |
| k9-lb1-potenz-produkt | Gym-K9 | Potenzgesetz: Produkt gleicher Basis | d2 | Potenzgesetze nur RSA (HSA 9: nur Potenzen berechnen), D14. |
| k9-lb1-potenz-quotient | Gym-K9 | Potenzgesetz: Quotient und Potenz einer Potenz | d2 | Potenzgesetze nur RSA (HSA 9: nur Potenzen berechnen), D14. |
| k9-lb1-quadrat-wert | Gym-K9 | Wert einer quadratischen Funktion | d2 | Quadratische Funktionen/Gleichungen nur RSA 9/10. |
| k9-lb1-scheitel | Gym-K9 | Scheitelpunkt aus der Scheitelform | d2 | Quadratische Funktionen/Gleichungen nur RSA 9/10. |
| k9-lb2-kugel-volumen | Gym-K9 | Volumen einer Kugel | d2 | Kugel nur RSA 9/10, nicht im HSA. |
| k9-lb3-trig-wert | Gym-K9 | Werte von Sinus, Kosinus, Tangens | d2 | Trigonometrie nur RSA 9/10. |
| k9-lb4-median | Gym-K9 | Median (Zentralwert) | d1 | Median nur RSA 9/10 (D18). |
| k9-lb4-modalwert | Gym-K9 | Modalwert (häufigster Wert) | d1 | Modalwert in keinem Profil im FLP (D18/D23). |
| k10-lb2-erwartungswert | Gym-K10 | Erwartungswert eines Glücksrads | d2 | Erwartungswert nicht im FLP (D21). |
| k10-lb2-erwartungswert-wuerfel | Gym-K10 | Erwartungswert beim Würfel | d2 | Erwartungswert nicht im FLP (D21). |
| k10-lb4-reinquadratisch | Gym-K10 | Reinquadratische Gleichung x² = a | d2 | Quadratische Funktionen/Gleichungen nur RSA 9/10. |
| k10-lb4-quadratische-gleichung | Gym-K10 | Quadratische Gleichung (größere Lösung) | d3 | Quadratische Funktionen/Gleichungen nur RSA 9/10. |
| k10-lb4-parabel-wert | Gym-K10 | Funktionswert einer Parabel | d2 | Quadratische Funktionen/Gleichungen nur RSA 9/10. |

Die `__grafik`-Varianten (7 Stück, `released: false`, `reviewOf` auf ihren Parent) sind Kinder ihres Parents und werden mit diesem gemerged; sie haben keinen eigenen Pack-Slot. Gym-K11/12 ist für beide Profile ohne Bezug.

## 5. Profil Realschulabschluss (Pack `sekundarschule-sachsen-anhalt-rs`, Klasse 5–10)

maxDifficulty: keine Einschränkung (3). Master-Spalte: Gym-Sachsen-Topic-IDs (Parent; ehemalige Neu-Aufgaben stecken im Parent). Zeilen mit [ENTFERNEN] haben keine Quelle.

### Klasse 5 · RSA

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `sks-k5-nat-runden` | Natürliche Zahlen runden | `lb1-runden-natuerlich` | 3 | Runden: Rundungsregeln. | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-nat-add` | Addieren natürlicher Zahlen | `lb1-addition` | 3 | Addition. | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-nat-sub` | Subtrahieren natürlicher Zahlen | `lb1-subtraktion` | 3 | Subtraktion. | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-nat-mul` | Multiplizieren natürlicher Zahlen | `lb1-multiplikation` | 3 | Multiplikation. | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-nat-schriftlich` | Schriftliche Rechenverfahren | `lb1-schriftliches-rechnen` | 3 | „schriftliche Rechenverfahren verstehen und ausführen“ (d2). | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-nat-div-rest` | Division mit Rest | `lb1-division-rest` | 3 | Division/Umkehroperation. | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-nat-div` | Schriftliche Division | `lb1-schriftliche-division` | 3 | Schriftliche Division (d2). | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-nat-potenz` | Potenzen (Quadrat- und Zehnerpotenzen) | `lb1-potenzieren` | 3 | „Potenzen berechnen“; Quadrat-/Kubik-/Zehnerpotenz. | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-nat-teilbarkeit` | Teilbarkeit prüfen | `lb1-teilbarkeit` | 3 | Teilbarkeitsregeln 2, 3, 5, 10. | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-nat-prim` | Primzahlen erkennen | `lb1-primzahl` | 3 | „gerade, ungerade Zahlen, Primzahlen“ (d2). | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-sachaufgaben` | Sachaufgaben mit natürlichen Zahlen und Größen (NEU) [NEU] | `lb5-gesamtpreis`, `lb5-teilen`, `lb5-mehrstufig` | 3 | Neues Pack-Thema vorgeschlagen: „inner- und außermathematische Anwendungsaufgaben lösen“. Nutzt ungenutzte Gym-K5-LB5-Themen. | §3.2 KS Natürliche Zahlen, S. 22 |
| `sks-k5-gleichung-add` | Gleichung umstellen: x + a = b | `k7-lb2-gleichung-add` | 3 | Gleichungstyp ax+b=c; Master-Quelle liegt in Gym-K7, Inhalt K5-Niveau. | §3.2 KS Gleichungen, S. 23 |
| `sks-k5-gleichung-mul` | Gleichung umstellen: a · x = b | `k7-lb2-gleichung-mul` | 3 | Gleichungstyp ax=b. | §3.2 KS Gleichungen, S. 23 |
| `sks-k5-gleichung-beid` | Gleichung mit x auf beiden Seiten [ENTFERNEN] | — | — | ABWEICHUNG D7: In 5/6 nur ax+b=c, a(x+b)=c, ax=b, a:x=b; ax+b=cx+d erst 7/8. Identisch zu sks-k7-gleichung-beid, daher entfernen. | §3.2 KS Gleichungen, S. 23 |
| `sks-k5-gleichung-probe` | Lineare Gleichung und Probe [Outline] | — | — | „Ergebnisse durch Einsetzen überprüfen“ ist gefordert, aber kein freier Master (k8-lb1-gleichung-linear ist in sks-k7-gleichung gebunden). Bleibt Outline. | §3.2 KS Gleichungen, S. 23 |
| `sks-k5-bruch-anteil` | Anteil als Bruch | `lb2-anteil-bruch` | 3 | „Brüche als Teile von Ganzen angeben“. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k5-bruch-kuerzen` | Brüche kürzen | `lb2-kuerzen` | 3 | Brüche kürzen/erweitern. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k5-bruch-erweitern` | Brüche erweitern | `lb2-erweitern` | 3 | Brüche erweitern. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k5-bruch-grafik` | Brüche grafisch ablesen | `lb2-grafische-brueche` | 3 | Brüche veranschaulichen. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k5-dez-add` | Dezimalzahlen addieren und subtrahieren | `lb2-dez-add-sub` | 3 | Dezimalbrüche addieren/subtrahieren. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k5-dez-mul` | Dezimalzahlen multiplizieren | `lb2-dez-mult` | 3 | Dezimalbrüche multiplizieren. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k5-dez-div` | Dezimalzahlen dividieren | `lb2-dez-div` | 3 | Division steht im 5/6-Block unter Gebrochene Zahlen (Jg.-6-Niveau); der Block ist nicht in 5 und 6 aufgeteilt. | §3.2 KS Gebrochene Zahlen, S. 25 |
| `sks-k5-dez-runden` | Dezimalzahlen runden | `lb2-runden-dezimal` | 3 | „Dezimalbrüche runden“. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k5-dez-zahlenstrahl` | Dezimalzahlen auf dem Zahlenstrahl | `lb2-zahlenstrahl` | 3 | „auf dem Zahlenstrahl ablesen und eintragen“ (d2). | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k5-groessen-ordnen` | Größen mit verschiedenen Einheiten ordnen | `lb2-ordnen-einheiten` | 3 | „Größenangaben umrechnen, vergleichen und ordnen“ (d2). | §3.2 KS Größen, S. 24 |
| `sks-k5-umr-laenge` | Einheiten umrechnen: Länge | `k5-umrechnen-laenge` | 3 | Größenarten/Einheiten Länge. | §3.2 KS Größen, S. 24 |
| `sks-k5-umr-masse` | Einheiten umrechnen: Masse | `k5-umrechnen-masse` | 3 | Größenarten/Einheiten Masse. | §3.2 KS Größen, S. 24 |
| `sks-k5-umr-zeit` | Einheiten umrechnen: Zeit | `k5-umrechnen-zeit` | 3 | Größenarten/Einheiten Zeit. | §3.2 KS Größen, S. 24 |
| `sks-k5-umr-flaeche` | Einheiten umrechnen: Flächeninhalt | `k5-umrechnen-flaeche` | 3 | Größenarten/Einheiten Flächeninhalt. | §3.2 KS Größen, S. 24 |
| `sks-k5-umr-volumen` | Einheiten umrechnen: Volumen | `k5-umrechnen-volumen` | 3 | Größenarten/Einheiten Volumen. | §3.2 KS Größen, S. 24 |
| `sks-k5-geo-strecken` | Strecke, Gerade und Halbgerade | `lb3-strecken-bezeichnung` | 3 | Punkt, Gerade, Strahl, Strecke bezeichnen. | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-geo-laenge` | Länge von Strecken | `lb3-strecken-laenge` | 3 | Messen von Längen. | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-geo-mittelpunkt` | Mittelpunkt einer Strecke | `lb3-strecken-mittelpunkt` | 3 | Nur indirekt (Konstruktion/Koordinaten); d2. | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-geo-koord-ablesen` | Koordinaten ablesen | `lb3-koordinaten-ablesen` | 3 | Koordinatensystem, I. Quadrant. | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-geo-koord-eintragen` | Punkte im Koordinatensystem zuordnen | `lb3-koordinaten-eintragen` | 3 | Koordinatensystem, I. Quadrant. | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-geo-abstand` | Abstand zwischen Punkten | `lb3-koordinaten-abstand` | 3 | Abstand im Koordinatensystem (d2). | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-geo-winkelarten` | Winkelarten erkennen | `lb3-winkelarten` | 3 | spitz/recht/stumpf/gestreckt/überstumpf. | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-geo-winkel-erg` | Winkel zu 90° oder 180° ergänzen | `lb3-winkel-ergaenzung` | 3 | Winkelgrößen bestimmen. | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-geo-verschiebung` | Verschiebung von Figuren | `lb3-verschiebung` | 3 | „Merkmale von Verschiebung und Spiegelung“ (d2). | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-geo-achse` | Achsensymmetrie erkennen | `lb3-achsensymmetrie` | 3 | Achsensymmetrie/Geradenspiegelung (d2). | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-geo-punkt` | Punktsymmetrie / Punktspiegelung [ENTFERNEN] | — | — | ABWEICHUNG D6: Punktsymmetrie/-spiegelung kommt im gesamten Fachlehrplan nicht vor (nur Achsen-/Geradenspiegelung, Verschiebung). Entfernen; lb3-punktsymmetrie bleibt ungenutzt. | §3.2 KS Geometrische Grundbegriffe und Symmetrie, S. 26 |
| `sks-k5-umfang-rechteck` | Umfang von Rechteck und Quadrat | `lb4-umfang-rechteck`, `lb3-umfang-rechteck` | 3 | Zweite Quelle (Gym-K6) vergrößert den Pool; 5/6-Block ohne Klassenaufteilung. | §3.2 KS Umfang, Flächeninhalt und Volumen, S. 27 |
| `sks-k5-flaeche-rechteck` | Flächeninhalt von Rechteck und Quadrat | `lb4-flaeche-rechteck`, `lb3-flaeche-rechteck` | 3 | Wie oben. | §3.2 KS Umfang, Flächeninhalt und Volumen, S. 27 |
| `sks-k5-volumen-quader` | Volumen von Quader und Würfel | `lb4-volumen-quader` | 3 | ID lb4-volumen-quader kommt in Gym-K5 und Gym-K6 vor (ID-Kollision; Katalog nimmt K5). Als eine Quelle gezählt. | §3.2 KS Umfang, Flächeninhalt und Volumen, S. 27 |
| `sks-k5-oberflaeche-quader` | Oberflächeninhalt von Quadern | `lb4-oberflaeche-quader` | 3 | Wie oben (ID in K5 und K6), d2. | §3.2 KS Umfang, Flächeninhalt und Volumen, S. 27 |
| `sks-k5-mittelwert` | Arithmetisches Mittel | `lb2-mittelwert` | 3 | Der KS gilt für den gesamten 5/6-Block. | §3.2 KS Arithmetisches Mittel, S. 30 |
| `sks-k5-median` | Median (Zentralwert) [ENTFERNEN] | — | — | ABWEICHUNG D1: Im 5/6-Block nur arithmetisches Mittel. Median erst RSA 9/10 (Kenngrößen), im HSA nie. Entfernen. | §3.2 KS Arithmetisches Mittel, S. 30 |
| `sks-k5-spannweite` | Spannweite berechnen [ENTFERNEN] | — | — | ABWEICHUNG D1: nicht im 5/6-Block. Spannweite erst HSA 9 / RSA 9/10. Entfernen. | §3.2 KS Arithmetisches Mittel, S. 30 |

### Klasse 6 · RSA

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `sks-k6-bruch-kuerzen` | Brüche kürzen | `lb1-kuerzen` | 3 | Selbes Konzept wie sks-k5-bruch-kuerzen, aber anderes Master-Thema (Gym-K6). | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k6-bruch-erweitern` | Brüche erweitern | `lb1-erweitern` | 3 | Wie oben. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k6-bruch-vergleichen` | Brüche vergleichen | `lb1-vergleichen` | 3 | „gebrochene Zahlen vergleichen und ordnen“. | §3.2 KS Gebrochene Zahlen, S. 25 |
| `sks-k6-bruch-add` | Brüche addieren und subtrahieren | `lb1-add-sub-brueche`, `lb1-sachaufgabe-bruch` | 3 | Zusätzlich Sachaufgabe Bruchrechnung (Anwendungsaufgaben). | §3.2 KS Gebrochene Zahlen, S. 25 |
| `sks-k6-bruch-mul` | Brüche multiplizieren | `lb1-mult-brueche` | 3 | Grundrechenarten mit gebrochenen Zahlen. | §3.2 KS Gebrochene Zahlen, S. 25 |
| `sks-k6-bruch-div` | Brüche dividieren | `lb1-div-brueche` | 3 | Kehrwert (d2). | §3.2 KS Gebrochene Zahlen, S. 25 |
| `sks-k6-bruch-dez` | Brüche in Dezimalzahlen umwandeln | `lb1-bruch-dezimal` | 3 | „gemeine Brüche und Dezimalbrüche ineinander umwandeln“. | §3.2 KS Gebrochene Zahlen, S. 25 |
| `sks-k6-prozent` | In Prozent umwandeln | `lb1-prozent` | 3 | Nur „spezielle Brüche … prozentualen Angaben zuordnen“; Prozentrechnung erst 7/8. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k6-dez-add` | Dezimalzahlen addieren und subtrahieren | `lb1-dez-add-sub` | 3 | Master Gym-K6; Konzeptdopplung zu sks-k5-dez-add (anderes Master-Thema). | §3.2 KS Gebrochene Zahlen, S. 25 |
| `sks-k6-dez-mul` | Dezimalzahlen multiplizieren | `lb1-dez-mult` | 3 | Wie oben. | §3.2 KS Gebrochene Zahlen, S. 25 |
| `sks-k6-dez-div` | Dezimalzahlen dividieren | `lb1-dez-div` | 3 | Wie oben. | §3.2 KS Gebrochene Zahlen, S. 25 |
| `sks-k6-dez-runden` | Dezimalzahlen runden | `lb1-runden` | 3 | Wie oben. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k6-nebenwinkel` | Nebenwinkel berechnen | `k7-lb1-nebenwinkel` | 3 | Master in Gym-K7, Jg.-6-Niveau; Nebenwinkelsatz im 5/6-Block. | §3.2 KS Winkelbeziehungen, S. 27 |
| `sks-k6-scheitelwinkel` | Scheitel- und Stufenwinkel | `k7-lb1-scheitelwinkel` | 3 | Scheitel-/Stufenwinkelsatz. | §3.2 KS Winkelbeziehungen, S. 27 |
| `sks-k6-wechselwinkel` | Wechselwinkel an Parallelen [Outline] | — | — | Im Lehrplan gefordert (Wechselwinkelsatz), aber kein eigener Master, daher Outline. | §3.2 KS Winkelbeziehungen, S. 27 |
| `sks-k6-gestreckter` | Winkel am gestreckten Winkel [Outline] | — | — | Kein eigener Master (lb3-winkel-ergaenzung ist in K5 gebunden), daher Outline. | §3.2 KS Winkelbeziehungen, S. 27 |
| `sks-k6-winkel-dreieck` | Innenwinkelsatz im Dreieck | `lb3-winkel-dreieck`, `k7-lb1-basiswinkel` | 3 | Zusätzlich Basiswinkel im gleichschenkligen Dreieck (d2). | §3.2 KS Dreiecke, S. 28 |
| `sks-k6-flaeche-dreieck` | Flächeninhalt von Dreiecken | `lb3-flaeche-dreieck` | 3 | Formel Fläche Dreieck. | §3.2 KS Dreiecke, S. 28 |
| `sks-k6-kongruenz` | Kongruenzsatz wählen | `lb3-kongruenzsatz` | 3 | Kongruenzsätze (d2). | §3.2 KS Dreiecke, S. 28 |
| `sks-k6-umkreis` | Umkreis eines Dreiecks | `k7-lb1-mittelsenkrechte-schritte` | 3 | Mittelsenkrechte/Umkreis; Konstruktionsschritte (d2). Neu zugeordnet (bisher Outline). | §3.2 KS Dreiecke, S. 28 |
| `sks-k6-proportional` | Proportionale Zuordnung (Dreisatz) | `lb2-proportional` | 3 | Direkte Proportionalität/Dreisatz. | §3.2 KS Direkte und indirekte Proportionalität, S. 29 |
| `sks-k6-antiproportional` | Antiproportionale Zuordnung | `lb2-antiproportional` | 3 | Indirekte Proportionalität (d2). | §3.2 KS Direkte und indirekte Proportionalität, S. 29 |
| `sks-k6-dreisatz` | Sachaufgabe: Dreisatz mit Einheiten | `lb2-sachaufgabe-dreisatz` | 3 | Dreisatz (d2). | §3.2 KS Direkte und indirekte Proportionalität, S. 29 |
| `sks-k6-anteil-prozent` | Anteil einer Größe berechnen (statt „Prozent einer Größe“) [Titel anpassen] | `lb5-anteil-groesse` | 3 | ABWEICHUNG D5: „Prozent einer Größe“ ist 7/8-Stoff; in 5/6 „Anteile von Zahlen und Größen ermitteln“. Titel anpassen; lb5-anteil-prozent geht nach sks-k7-prozent. | §3.2 KS Brüche und Dezimalbrüche, S. 23 |
| `sks-k6-haeufigkeit` | Relative Häufigkeit in Prozent [ENTFERNEN] | — | — | ABWEICHUNG D4: Relative Häufigkeit gehört zu 7/8 (Erfassen, Darstellen und Auswerten von Daten). Verschieben nach sks-k7-haeufigkeit. | §3.3.1 S. 39 / §3.4.1 S. 55 (5/6, S. 30: nur Strichliste, Säulen-/Liniendiagramm) |
| `sks-k6-mittelwert` | Arithmetisches Mittel | `k7-lb4-mittelwert` | 3 | ABWEICHUNG D2: ein KS für den 5/6-Block, schon durch sks-k5-mittelwert abgedeckt. K6-Fassung nur als Vertiefung über das andere Master-Thema; Alternative: entfernen. | §3.2 KS Arithmetisches Mittel, S. 30 |
| `sks-k6-median` | Median (Zentralwert) [ENTFERNEN] | — | — | ABWEICHUNG D2: Median nicht im 5/6-Block. Entfernen. | §3.2 KS Arithmetisches Mittel, S. 30 |

### Klasse 7 · RSA

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `sks-k7-rat-add` | Rationale Zahlen addieren | `k7-lb2-add-rational` | 3 | Grundrechenoperationen mit rationalen Zahlen. | §3.3.1 (RSA 7/8) KS Rationale Zahlen, S. 32 |
| `sks-k7-rat-sub` | Rationale Zahlen subtrahieren | `k7-lb2-sub-rational` | 3 | Grundrechenoperationen mit rationalen Zahlen. | §3.3.1 (RSA 7/8) KS Rationale Zahlen, S. 32 |
| `sks-k7-rat-mul` | Rationale Zahlen multiplizieren | `k7-lb2-mul-rational` | 3 | Grundrechenoperationen mit rationalen Zahlen. | §3.3.1 (RSA 7/8) KS Rationale Zahlen, S. 32 |
| `sks-k7-rat-div` | Rationale Zahlen dividieren | `k7-lb2-div-rational` | 3 | Grundrechenoperationen mit rationalen Zahlen. | §3.3.1 (RSA 7/8) KS Rationale Zahlen, S. 32 |
| `sks-k7-betrag` | Betrag einer Zahl | `k7-lb2-betrag` | 3 | Betrag/entgegengesetzte Zahl. | §3.3.1 (RSA 7/8) KS Rationale Zahlen, S. 32 |
| `sks-k7-prozent` | Prozent einer Größe berechnen | `lb5-anteil-prozent` | 3 | Prozentwert/Grundwert/Prozentsatz (Pool ggf. nur Prozentwert). | §3.3.1 (RSA 7/8) KS Prozentrechnung, S. 33 |
| `sks-k7-zinsen` | Jahreszinsen berechnen | `k10-lb1-zinsen` | 3 | Zinsrechnung; HSA: Jahreszinsen. | §3.3.1 (RSA 7/8) KS Prozentrechnung, S. 33 |
| `sks-k7-zinseszins` | Zinseszins: Endkapital | `k10-lb1-zinseszins` | 3 | RSA 7/8 nennt Zinseszins ausdrücklich. Einzige RS-Platzierung (rs-k9/k10-zinseszins entfallen, D20). | §3.3.1 (RSA 7/8) KS Prozentrechnung, S. 33 |
| `sks-k7-haeufigkeit` | Absolute und relative Häufigkeit (NEU, ersetzt sks-k6-haeufigkeit) [NEU] | `lb2-haeufigkeit`, `k7-lb4-rel-haeufigkeit` | 3 | Neues Pack-Thema; „absolute/relative Häufigkeit, auch in Prozent“. | §3.3.1 (RSA 7/8) KS Erfassen, Darstellen und Auswerten von Daten, S. 39 |
| `sks-k7-gleichung` | Lineare Gleichung a·x + b = c | `k8-lb1-gleichung-linear`, `k8-lb5-zahlenraetsel`, `k8-lb5-rueckwaerts` | 3 | Zusätzlich Anwendungsaufgaben/Gleichung aufstellen, Rückwärtsrechnen („Probe am Text“). | §3.3.1 (RSA 7/8) KS Lineare Gleichungen, S. 33 |
| `sks-k7-gleichung-beid` | Gleichung mit x auf beiden Seiten | `k8-lb1-gleichung-beidseitig` | 3 | Typ ax+b=cx+d (d2). | §3.3.1 (RSA 7/8) KS Arbeiten mit Variablen, Gleichungen und Formeln, S. 34 |
| `sks-k7-gleichung-klammer` | Gleichung mit Klammern vorbereiten [Outline] | — | — | Gefordert („mit Klammern“), kein freier Master, daher Outline. | §3.3.1 (RSA 7/8) KS Arbeiten mit Variablen, Gleichungen und Formeln, S. 34 |
| `sks-k7-ungleichung` | Einfache lineare Ungleichung (Idee) [ENTFERNEN] | — | — | Wie HS (D9). | §3.2 KS Gleichungen, S. 23 |
| `sks-k7-term` | Term mit Rechengesetzen auswerten | `k7-lb2-term-vorrang` | 3 | Termwerte berechnen/Rechenvorteile. | §3.3.1 (RSA 7/8) KS Arbeiten mit Variablen, Gleichungen und Formeln, S. 34 |
| `sks-k7-term-auswerten` | Term auswerten (x einsetzen) | `k8-lb1-term-auswerten` | 3 | „Termwerte … berechnen“. | §3.3.1 (RSA 7/8) KS Arbeiten mit Variablen, Gleichungen und Formeln, S. 34 |
| `sks-k7-zusammenfassen` | Terme zusammenfassen | `k8-lb1-zusammenfassen` | 3 | Zusammenfassen gleichartiger Summanden. | §3.3.1 (RSA 7/8) KS Arbeiten mit Variablen, Gleichungen und Formeln, S. 34 |
| `sks-k7-ausmult` | Klammer ausmultiplizieren | `k8-lb1-ausmultiplizieren` | 3 | Ausmultiplizieren (d2). | §3.3.1 (RSA 7/8) KS Arbeiten mit Variablen, Gleichungen und Formeln, S. 34 |
| `sks-k7-winkel-viereck` | Winkelsumme im Viereck | `lb3-winkel-viereck` | 3 | Innenwinkelsatz Viereck. | §3.3.1 (RSA 7/8) KS Vierecke, S. 35 |
| `sks-k7-winkelsumme` | Innenwinkelsumme im Vieleck [ENTFERNEN] | — | — | Wie HS (D8). | §3.3.1 (RSA 7/8) KS Vierecke, S. 35 |
| `sks-k7-flaeche-rechteck` | Flächeninhalt von Rechteck und Quadrat [ENTFERNEN] | — | — | Wie HS (D35). | §3.3.1 (RSA 7/8) KS Vierecke, S. 35 |
| `sks-k7-parallelogramm` | Flächeninhalt von Dreieck/Parallelogramm (Idee) [Outline] | — | — | Parallelogramm/Trapez gefordert; kein Master, daher Outline. | §3.3.1 (RSA 7/8) KS Vierecke, S. 35 |
| `sks-k7-volumen-prisma` | Volumen gerader Prismen | `k7-lb3-volumen-prisma`, `lb4-volumen-prisma`, `lb4-flaeche-kante-quader` | 3 | Prisma (Grundfläche Dreieck/Viereck); „Bestimmungsstücke bei gegebenem Volumen“ über lb4-flaeche-kante-quader. | §3.3.1 (RSA 7/8) KS Körperberechnung – Prismen und Kreiszylinder, S. 37 |
| `sks-k7-mantel-prisma` | Mantelfläche eines Prismas | `k7-lb3-mantel-prisma` | 3 | Oberflächeninhalt Prisma (Mantel als Teil). | §3.3.1 (RSA 7/8) KS Körperberechnung – Prismen und Kreiszylinder, S. 37 |
| `sks-k7-oberflaeche-quader` | Oberfläche eines Quaders [Titel anpassen] | `k7-lb3-oberflaeche-quader` | 3 | Quader als Prisma; Konzeptnähe zu sks-k5-oberflaeche-quader, anderes Master-Thema. Titel „Oberflächeninhalt von Prismen“ empfohlen. | §3.3.1 (RSA 7/8) KS Körperberechnung – Prismen und Kreiszylinder, S. 37 |
| `sks-k7-zylinder` | Volumen eines Kreiszylinders | `k9-lb2-zylinder-volumen` | 3 | Einzige Zylinder-Platzierung (sks-k8-zylinder entfällt). | §3.3.1 (RSA 7/8) KS Körperberechnung – Prismen und Kreiszylinder, S. 37 |
| `sks-k7-netz` | Körpernetze und Schrägbilder | `lb4-wuerfelnetz` | 3 | Netz (Würfelnetz); Schrägbild ohne Master. | §3.3.1 (RSA 7/8) KS Körperdarstellung, S. 36 |
| `sks-k7-mittelwert` | Arithmetisches Mittel [ENTFERNEN] | — | — | Wie HS (D3). | §3.3.1 (RSA 7/8) KS Erfassen, Darstellen und Auswerten von Daten, S. 39 |
| `sks-k7-median` | Median (Zentralwert) [ENTFERNEN] | — | — | Wie HS; k7-lb4-median wird Zusatzquelle von sks-rs-k9-median. | §3.3.1 (RSA 7/8) KS Erfassen, Darstellen und Auswerten von Daten, S. 39 |
| `sks-k7-spannweite` | Spannweite berechnen [ENTFERNEN] | — | — | Wie HS; RS: sks-rs-k10-spannweite. | §3.3.1 (RSA 7/8) KS Erfassen, Darstellen und Auswerten von Daten, S. 39 |

### Klasse 8 · RSA

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `sks-k8-kreis-umfang` | Umfang eines Kreises | `k9-lb2-kreis-umfang` | 3 | Umfang Kreis. | §3.3.1 (RSA 7/8) KS Kreise, S. 36 |
| `sks-k8-kreis-flaeche` | Flächeninhalt eines Kreises | `k9-lb2-kreis-flaeche` | 3 | Fläche Kreis. | §3.3.1 (RSA 7/8) KS Kreise, S. 36 |
| `sks-k8-zylinder` | Volumen eines Kreiszylinders [ENTFERNEN] | — | — | Wie HS (D12). | §3.3.1 (RSA 7/8) KS Körperberechnung – Prismen und Kreiszylinder, S. 37 |
| `sks-k8-thales` | Satz des Thales [Outline] | — | — | Thales ist RSA-Inhalt (S. 36), aber kein Master, daher Outline. | §3.3.1 (RSA 7/8) KS Kreise, S. 36 |
| `sks-k8-zusammengesetzt` | Zusammengesetzte Figuren: Fläche und Umfang (NEU) [NEU] | `lb4-flaeche-zusammengesetzt`, `lb4-umfang-zusammengesetzt`, `lb3-sachaufgabe-geometrie`, `lb5-sachaufgabe-flaeche` | 3 | Neues Pack-Thema: „Figuren aus Rechteck, Dreieck, Kreis“. Master enthält ggf. keine Kreisanteile (Stichprobe nötig). | §3.3.1 (RSA 7/8) KS Kreise, S. 36 |
| `sks-k8-pythagoras-hyp` | Satz des Pythagoras: Hypotenuse | `k9-lb3-pythagoras-hypotenuse` | 3 | Satz des Pythagoras. | §3.3.1 (RSA 7/8) KS Rechtwinklige Dreiecke, S. 37 |
| `sks-k8-pythagoras-kat` | Satz des Pythagoras: fehlende Kathete | `k9-lb3-pythagoras-kathete` | 3 | Dreiecksstücke berechnen (d2). | §3.3.1 (RSA 7/8) KS Rechtwinklige Dreiecke, S. 37 |
| `sks-k8-leiter` | Pythagoras im Sachkontext | `k9-lb5-leiter` | 3 | Anwendungsaufgaben (d2). | §3.3.1 (RSA 7/8) KS Rechtwinklige Dreiecke, S. 37 |
| `sks-k8-funktionswert` | Funktionswert einer linearen Funktion | `k8-lb3-funktionswert` | 3 | Funktionswert. | §3.3.1 (RSA 7/8) KS Lineare Funktionen, S. 38 |
| `sks-k8-steigung` | Steigung aus zwei Punkten | `k8-lb3-steigung` | 3 | Parameter m (d2). | §3.3.1 (RSA 7/8) KS Lineare Funktionen, S. 38 |
| `sks-k8-achsen` | y-Achsenabschnitt bestimmen | `k8-lb3-achsenabschnitt` | 3 | Parameter n / Nullstelle (d2). | §3.3.1 (RSA 7/8) KS Lineare Funktionen, S. 38 |
| `sks-k8-laplace` | Laplace-Wahrscheinlichkeit als Bruch | `k8-lb2-laplace-bruch` | 3 | Einstufige Zufallsversuche. | §3.3.1 (RSA 7/8) KS Häufigkeiten und Wahrscheinlichkeiten, S. 39 |
| `sks-k8-laplace-pct` | Laplace-Wahrscheinlichkeit in Prozent | `k8-lb2-laplace-prozent` | 3 | Wahrscheinlichkeit P(A). | §3.3.1 (RSA 7/8) KS Häufigkeiten und Wahrscheinlichkeiten, S. 39 |
| `sks-k8-gegen` | Gegenwahrscheinlichkeit | `k8-lb2-gegenwahrscheinlichkeit` | 3 | P(A)+P(Ā)=1. | §3.3.1 (RSA 7/8) KS Häufigkeiten und Wahrscheinlichkeiten, S. 39 |

### Klasse 9 · RSA

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `sks-rs-k9-potenz-prod` | Potenzgesetz: Produkt gleicher Basis | `k9-lb1-potenz-produkt` | 3 | „Potenzgesetze anwenden“ (d2). | §3.3.2 (RSA 9/10) KS Arbeiten mit Variablen, Potenzen, S. 41 |
| `sks-rs-k9-potenz-quot` | Potenzgesetz: Quotient und Potenz einer Potenz | `k9-lb1-potenz-quotient` | 3 | Potenzgesetze (d2). | §3.3.2 (RSA 9/10) KS Arbeiten mit Variablen, Potenzen, S. 41 |
| `sks-rs-k9-potenz-wert` | Potenz- und Quadratwerte berechnen [Outline] | — | — | Kein freier Master, daher Outline. | §3.3.2 (RSA 9/10) KS Arbeiten mit Variablen, Potenzen, S. 41 |
| `sks-rs-k9-wurzel` | Wurzeln und Betrag (Näherung) [Outline] | — | — | n-te Wurzel; kein Master, daher Outline. | §3.3.2 (RSA 9/10) KS Arbeiten mit Variablen, Potenzen, S. 41 |
| `sks-rs-k9-formeln` | Formeln umstellen (NEU) [NEU] | `k10-lb3-quadrat-seite`, `k10-lb3-rechteck-breite`, `k10-lb3-rechteck-umfang` | 3 | „Gleichungen und Formeln nach verschiedenen Variablen umstellen“. | §3.3.2 (RSA 9/10) KS Arbeiten mit Variablen, Potenzen, S. 41 |
| `sks-rs-k9-pyramide` | Volumen einer Pyramide | `k7-lb3-volumen-pyramide` | 3 | Volumen Pyramide (d2). | §3.3.2 KS Pyramide, Kegel, Kugel, zusammengesetzte Körper, S. 42 |
| `sks-rs-k9-oberflaeche-pyramide` | Oberfläche einer Pyramide (NEU) [NEU] | `k7-lb3-oberflaeche-pyramide` | 3 | Im RS-Pack fehlt die Pyramidenoberfläche (HS-Pack hat sie). | §3.3.2 KS Pyramide, Kegel, Kugel, zusammengesetzte Körper, S. 42 |
| `sks-rs-k9-kugel` | Volumen einer Kugel | `k9-lb2-kugel-volumen` | 3 | Kugel (RSA). | §3.3.2 KS Pyramide, Kegel, Kugel, zusammengesetzte Körper, S. 42 |
| `sks-rs-k9-volumen-zus` | Zusammengesetzte Körper: Volumen | `lb4-volumen-zusammengesetzt` | 3 | Zusammengesetzte Körper. | §3.3.2 KS Pyramide, Kegel, Kugel, zusammengesetzte Körper, S. 42 |
| `sks-rs-k9-kegel` | Kegel (Volumen / Oberfläche) [Outline] | — | — | Gefordert; kein Master, daher Outline. | §3.3.2 KS Pyramide, Kegel, Kugel, zusammengesetzte Körper, S. 42 |
| `sks-rs-k9-streckfaktor` | Streckfaktor bestimmen | `k8-lb4-streckfaktor` | 3 | Zentrische Streckung (d2). | §3.3.2 KS Ähnlichkeit, S. 42 |
| `sks-rs-k9-strahlensatz` | Strahlensatz: fehlende Länge | `k8-lb4-strahlensatz` | 3 | Streckenverhältnisse (d2). | §3.3.2 KS Ähnlichkeit, S. 42 |
| `sks-rs-k9-aehnlich` | Ähnliche Figuren: Seitenlänge | `k8-lb4-aehnliche-seite` | 3 | Ähnlichkeit (d2). | §3.3.2 KS Ähnlichkeit, S. 42 |
| `sks-rs-k9-trig` | Werte von Sinus, Kosinus, Tangens | `k9-lb3-trig-wert` | 3 | Trigonometrie am rechtwinkligen Dreieck (d2). | §3.3.2 KS Trigonometrie, S. 43 |
| `sks-rs-k9-trig-hoehe` | Höhe mit Sinus berechnen [Outline] | — | — | Gefordert; kein Master, daher Outline. | §3.3.2 KS Trigonometrie, S. 43 |
| `sks-rs-k9-trig-seite` | Seite mit Trigonometrie [Outline] | — | — | Gefordert; kein Master, daher Outline. | §3.3.2 KS Trigonometrie, S. 43 |
| `sks-rs-k9-lgs` | Lineares Gleichungssystem (x bestimmen) | `k8-lb3-lgs` | 3 | Master difficulty 3; für RS ohne Einschränkung. | §3.3.2 KS Lineare Gleichungssysteme, S. 44 |
| `sks-rs-k9-lgs-y` | Lineares Gleichungssystem (y bestimmen) [ENTFERNEN] | — | — | ABWEICHUNG D16: gleicher Master wie lgs; zusammenlegen, entfernen. | §3.3.2 KS Lineare Gleichungssysteme, S. 44 |
| `sks-rs-k9-lgs-grafik` | LGS grafisch deuten (Idee) [Outline] | — | — | Gefordert; kein Master, daher Outline. | §3.3.2 KS Lineare Gleichungssysteme, S. 44 |
| `sks-rs-k9-exp` | Exponentielles Wachstum | `k10-lb1-exp-wachstum` | 3 | Exponentialfunktion y=2^x, Wachstumsprozesse (d2). | §3.3.2 KS Potenzfunktionen, Wachstumsprozesse, S. 44 |
| `sks-rs-k9-zunahme` | Prozentuale Zunahme | `k10-lb1-prozentuale-zunahme` | 3 | „Prozentrechnung bei Wachstumsprozessen“. | §3.3.2 KS Potenzfunktionen, Wachstumsprozesse, S. 44 |
| `sks-rs-k9-zinsen` | Jahreszinsen berechnen [ENTFERNEN] | — | — | ABWEICHUNG D20: Dublette zu sks-k7-zinsen (Master pro Pack nur einmal). Entfernen. | §3.3.2 KS Potenzfunktionen, Wachstumsprozesse, S. 44 |
| `sks-rs-k9-zinseszins` | Zinseszins: Endkapital [ENTFERNEN] | — | — | ABWEICHUNG D20: Dublette zu sks-k7-zinseszins. Entfernen. | §3.3.2 KS Potenzfunktionen, Wachstumsprozesse, S. 44 |
| `sks-rs-k9-mittelwert` | Arithmetisches Mittel | `k9-lb4-mittelwert` | 3 | Kenngrößen. | §3.3.2 KS Häufigkeitsverteilungen, S. 46 |
| `sks-rs-k9-median` | Median (Zentralwert) | `k9-lb4-median`, `k7-lb4-median` | 3 | Median nur RSA; zweite Quelle aus entfernter K7-Platzierung. | §3.3.2 KS Häufigkeitsverteilungen, S. 46 |
| `sks-rs-k9-modal` | Modalwert (häufigster Wert) [ENTFERNEN] | — | — | ABWEICHUNG D23: Modalwert nicht im Lehrplan. Entfernen. | §3.3.2 KS Häufigkeitsverteilungen, S. 46 |
| `sks-rs-k9-laplace` | Laplace-Wahrscheinlichkeit als Bruch [ENTFERNEN] | — | — | ABWEICHUNG D22: einstufige Laplace-Wsk. ist 7/8-Stoff (sks-k8-laplace). Entfernen. | §3.3.2 KS Zweistufige Zufallsversuche, S. 46 |
| `sks-rs-k9-pfad` | Zweistufige Zufallsversuche / Pfadregeln [Outline] | — | — | Gefordert (Baumdiagramm, Pfadregeln); kein Master, daher Outline. | §3.3.2 KS Zweistufige Zufallsversuche, S. 46 |

### Klasse 10 · RSA

| Pack-Thema-ID | Titel | Master-Quellen | maxDifficulty | Begründung | Lehrplan-Quelle |
|---|---|---|---|---|---|
| `sks-rs-k10-quadrat-wert` | Wert einer quadratischen Funktion | `k9-lb1-quadrat-wert` | 3 | Quadratische Funktion (d2). | §3.3.2 KS Quadratische Gleichungen, quadratische Funktionen und Sinusfunktion, S. 45 |
| `sks-rs-k10-scheitel` | Scheitelpunkt aus der Scheitelform | `k9-lb1-scheitel` | 3 | Scheitelpunkt (d2). | §3.3.2 KS Quadratische Gleichungen, quadratische Funktionen und Sinusfunktion, S. 45 |
| `sks-rs-k10-reinquadratisch` | Reinquadratische Gleichung x² = a | `k10-lb4-reinquadratisch` | 3 | Spezialfall quadratische Gleichung (d2). | §3.3.2 KS Quadratische Gleichungen, quadratische Funktionen und Sinusfunktion, S. 45 |
| `sks-rs-k10-gleichung` | Quadratische Gleichung (größere Lösung) | `k10-lb4-quadratische-gleichung` | 3 | Lösungsformel/Diskriminante (d3). | §3.3.2 KS Quadratische Gleichungen, quadratische Funktionen und Sinusfunktion, S. 45 |
| `sks-rs-k10-parabel` | Funktionswert einer Parabel | `k10-lb4-parabel-wert` | 3 | Parabel (d2). | §3.3.2 KS Quadratische Gleichungen, quadratische Funktionen und Sinusfunktion, S. 45 |
| `sks-rs-k10-sinus` | Sinusfunktion (periodische Vorgänge) [Outline] | — | — | Gefordert; kein Master, daher Outline. | §3.3.2 KS Quadratische Gleichungen, quadratische Funktionen und Sinusfunktion, S. 45 |
| `sks-rs-k10-zinsen` | Jahreszinsen berechnen [ENTFERNEN] | — | — | ABWEICHUNG D20: Dublette zu sks-k7-zinsen. Entfernen. | §3.3.2 KS Potenzfunktionen, Wachstumsprozesse, S. 44 |
| `sks-rs-k10-zinseszins` | Zinseszins: Endkapital [ENTFERNEN] | — | — | ABWEICHUNG D20: Dublette zu sks-k7-zinseszins. Entfernen. | §3.3.2 KS Potenzfunktionen, Wachstumsprozesse, S. 44 |
| `sks-rs-k10-kapital` | Kapital aus Zinsen bestimmen | `k10-lb5-kapital` | 3 | Bleibt in K10 (Prozentrechnung ist 7/8-Stoff; Verschiebung nach K7 optional). | §3.3.1 (RSA 7/8) KS Prozentrechnung, S. 33 |
| `sks-rs-k10-zinssatz` | Zinssatz bestimmen | `k10-lb5-zinssatz` | 3 | Wie oben. | §3.3.1 (RSA 7/8) KS Prozentrechnung, S. 33 |
| `sks-rs-k10-erwartung` | Erwartungswert eines Glücksrads [ENTFERNEN] | — | — | ABWEICHUNG D21: Erwartungswert kommt im Fachlehrplan nicht vor. Entfernen. | §3.3.2 KS Häufigkeitsverteilungen, S. 46 |
| `sks-rs-k10-erwartung-wuerfel` | Erwartungswert beim Würfel [ENTFERNEN] | — | — | ABWEICHUNG D21 wie oben. | §3.3.2 KS Häufigkeitsverteilungen, S. 46 |
| `sks-rs-k10-spannweite` | Spannweite berechnen | `k7-lb4-spannweite` | 3 | Kenngröße (9/10-Block). | §3.3.2 KS Häufigkeitsverteilungen, S. 46 |

### Abdeckung RS

**Pack-Themen ohne Master-Quelle (bleiben Outline), 14:**

- `sks-k5-gleichung-probe` Lineare Gleichung und Probe
- `sks-k6-wechselwinkel` Wechselwinkel an Parallelen
- `sks-k6-gestreckter` Winkel am gestreckten Winkel
- `sks-k7-gleichung-klammer` Gleichung mit Klammern vorbereiten
- `sks-k7-parallelogramm` Flächeninhalt von Dreieck/Parallelogramm (Idee)
- `sks-k8-thales` Satz des Thales
- `sks-rs-k9-potenz-wert` Potenz- und Quadratwerte berechnen
- `sks-rs-k9-wurzel` Wurzeln und Betrag (Näherung)
- `sks-rs-k9-kegel` Kegel (Volumen / Oberfläche)
- `sks-rs-k9-trig-hoehe` Höhe mit Sinus berechnen
- `sks-rs-k9-trig-seite` Seite mit Trigonometrie
- `sks-rs-k9-lgs-grafik` LGS grafisch deuten (Idee)
- `sks-rs-k9-pfad` Zweistufige Zufallsversuche / Pfadregeln
- `sks-rs-k10-sinus` Sinusfunktion (periodische Vorgänge)

**Zur Entfernung empfohlen (Abweichung), 22:** `sks-k5-gleichung-beid`, `sks-k5-geo-punkt`, `sks-k5-median`, `sks-k5-spannweite`, `sks-k6-haeufigkeit`, `sks-k6-median`, `sks-k7-ungleichung`, `sks-k7-winkelsumme`, `sks-k7-flaeche-rechteck`, `sks-k7-mittelwert`, `sks-k7-median`, `sks-k7-spannweite`, `sks-k8-zylinder`, `sks-rs-k9-lgs-y`, `sks-rs-k9-zinsen`, `sks-rs-k9-zinseszins`, `sks-rs-k9-modal`, `sks-rs-k9-laplace`, `sks-rs-k10-zinsen`, `sks-rs-k10-zinseszins`, `sks-rs-k10-erwartung`, `sks-rs-k10-erwartung-wuerfel`

**Nicht genutzte Master-Themen (Gym-K5 bis K10, Parent-Ebene), 7 von 147:**

| Master-ID | Herkunft | Titel | diff | Grund |
|---|---|---|---|---|
| lb3-punktsymmetrie | Gym-K5 | Punktsymmetrie / Punktspiegelung | d2 | Punktsymmetrie im FLP nicht vorhanden (D6). |
| k6-umrechnen-flaeche | Gym-K6 | Einheiten umrechnen: Flächeninhalt | d2 | Konzeptdopplung zu sks-k5-umr-flaeche; optional als Zusatzquelle dort. |
| k6-umrechnen-laenge | Gym-K6 | Einheiten umrechnen: Länge | d2 | Konzeptdopplung zu sks-k5-umr-laenge (ein KS Größen für 5/6); optional als Zusatzquelle dort. |
| k7-lb1-winkelsumme-vieleck | Gym-K7 | Innenwinkelsumme im Vieleck | d2 | FLP nur Viereck, nicht Vieleck (D8). |
| k9-lb4-modalwert | Gym-K9 | Modalwert (häufigster Wert) | d1 | Modalwert in keinem Profil im FLP (D18/D23). |
| k10-lb2-erwartungswert | Gym-K10 | Erwartungswert eines Glücksrads | d2 | Erwartungswert nicht im FLP (D21). |
| k10-lb2-erwartungswert-wuerfel | Gym-K10 | Erwartungswert beim Würfel | d2 | Erwartungswert nicht im FLP (D21). |

Die `__grafik`-Varianten (7 Stück, `released: false`, `reviewOf` auf ihren Parent) sind Kinder ihres Parents und werden mit diesem gemerged; sie haben keinen eigenen Pack-Slot. Gym-K11/12 ist für beide Profile ohne Bezug.

## 6. JSON je Profil

### HS

```json
{
 "sks-k5-nat-runden": {"sources":["lb1-runden-natuerlich"],"maxDifficulty":2,"note":"Runden: Rundungsregeln."},
 "sks-k5-nat-add": {"sources":["lb1-addition"],"maxDifficulty":2,"note":"Addition."},
 "sks-k5-nat-sub": {"sources":["lb1-subtraktion"],"maxDifficulty":2,"note":"Subtraktion."},
 "sks-k5-nat-mul": {"sources":["lb1-multiplikation"],"maxDifficulty":2,"note":"Multiplikation."},
 "sks-k5-nat-schriftlich": {"sources":["lb1-schriftliches-rechnen"],"maxDifficulty":2,"note":"„schriftliche Rechenverfahren verstehen und ausführen“ (d2)."},
 "sks-k5-nat-div-rest": {"sources":["lb1-division-rest"],"maxDifficulty":2,"note":"Division/Umkehroperation."},
 "sks-k5-nat-div": {"sources":["lb1-schriftliche-division"],"maxDifficulty":2,"note":"Schriftliche Division (d2)."},
 "sks-k5-nat-potenz": {"sources":["lb1-potenzieren"],"maxDifficulty":2,"note":"„Potenzen berechnen“; Quadrat-/Kubik-/Zehnerpotenz."},
 "sks-k5-nat-teilbarkeit": {"sources":["lb1-teilbarkeit"],"maxDifficulty":2,"note":"Teilbarkeitsregeln 2, 3, 5, 10."},
 "sks-k5-nat-prim": {"sources":["lb1-primzahl"],"maxDifficulty":2,"note":"„gerade, ungerade Zahlen, Primzahlen“ (d2)."},
 "sks-k5-sachaufgaben": {"sources":["lb5-gesamtpreis","lb5-teilen","lb5-mehrstufig"],"maxDifficulty":2,"note":"[NEU] Neues Pack-Thema vorgeschlagen: „inner- und außermathematische Anwendungsaufgaben lösen“. Nutzt ungenutzte Gym-K5-LB5-Themen."},
 "sks-k5-gleichung-add": {"sources":["k7-lb2-gleichung-add"],"maxDifficulty":2,"note":"Gleichungstyp ax+b=c; Master-Quelle liegt in Gym-K7, Inhalt K5-Niveau."},
 "sks-k5-gleichung-mul": {"sources":["k7-lb2-gleichung-mul"],"maxDifficulty":2,"note":"Gleichungstyp ax=b."},
 "sks-k5-gleichung-beid": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D7: In 5/6 nur ax+b=c, a(x+b)=c, ax=b, a:x=b; ax+b=cx+d erst 7/8. Identisch zu sks-k7-gleichung-beid, daher entfernen."},
 "sks-k5-gleichung-probe": {"sources":[],"maxDifficulty":2,"note":"[Outline] „Ergebnisse durch Einsetzen überprüfen“ ist gefordert, aber kein freier Master (k8-lb1-gleichung-linear ist in sks-k7-gleichung gebunden). Bleibt Outline."},
 "sks-k5-bruch-anteil": {"sources":["lb2-anteil-bruch"],"maxDifficulty":2,"note":"„Brüche als Teile von Ganzen angeben“."},
 "sks-k5-bruch-kuerzen": {"sources":["lb2-kuerzen"],"maxDifficulty":2,"note":"Brüche kürzen/erweitern."},
 "sks-k5-bruch-erweitern": {"sources":["lb2-erweitern"],"maxDifficulty":2,"note":"Brüche erweitern."},
 "sks-k5-bruch-grafik": {"sources":["lb2-grafische-brueche"],"maxDifficulty":2,"note":"Brüche veranschaulichen."},
 "sks-k5-dez-add": {"sources":["lb2-dez-add-sub"],"maxDifficulty":2,"note":"Dezimalbrüche addieren/subtrahieren."},
 "sks-k5-dez-mul": {"sources":["lb2-dez-mult"],"maxDifficulty":2,"note":"Dezimalbrüche multiplizieren."},
 "sks-k5-dez-div": {"sources":["lb2-dez-div"],"maxDifficulty":2,"note":"Division steht im 5/6-Block unter Gebrochene Zahlen (Jg.-6-Niveau); der Block ist nicht in 5 und 6 aufgeteilt."},
 "sks-k5-dez-runden": {"sources":["lb2-runden-dezimal"],"maxDifficulty":2,"note":"„Dezimalbrüche runden“."},
 "sks-k5-dez-zahlenstrahl": {"sources":["lb2-zahlenstrahl"],"maxDifficulty":2,"note":"„auf dem Zahlenstrahl ablesen und eintragen“ (d2)."},
 "sks-k5-groessen-ordnen": {"sources":["lb2-ordnen-einheiten"],"maxDifficulty":2,"note":"„Größenangaben umrechnen, vergleichen und ordnen“ (d2)."},
 "sks-k5-umr-laenge": {"sources":["k5-umrechnen-laenge"],"maxDifficulty":2,"note":"Größenarten/Einheiten Länge."},
 "sks-k5-umr-masse": {"sources":["k5-umrechnen-masse"],"maxDifficulty":2,"note":"Größenarten/Einheiten Masse."},
 "sks-k5-umr-zeit": {"sources":["k5-umrechnen-zeit"],"maxDifficulty":2,"note":"Größenarten/Einheiten Zeit."},
 "sks-k5-umr-flaeche": {"sources":["k5-umrechnen-flaeche"],"maxDifficulty":2,"note":"Größenarten/Einheiten Flächeninhalt."},
 "sks-k5-umr-volumen": {"sources":["k5-umrechnen-volumen"],"maxDifficulty":2,"note":"Größenarten/Einheiten Volumen."},
 "sks-k5-geo-strecken": {"sources":["lb3-strecken-bezeichnung"],"maxDifficulty":2,"note":"Punkt, Gerade, Strahl, Strecke bezeichnen."},
 "sks-k5-geo-laenge": {"sources":["lb3-strecken-laenge"],"maxDifficulty":2,"note":"Messen von Längen."},
 "sks-k5-geo-mittelpunkt": {"sources":["lb3-strecken-mittelpunkt"],"maxDifficulty":2,"note":"Nur indirekt (Konstruktion/Koordinaten); d2."},
 "sks-k5-geo-koord-ablesen": {"sources":["lb3-koordinaten-ablesen"],"maxDifficulty":2,"note":"Koordinatensystem, I. Quadrant."},
 "sks-k5-geo-koord-eintragen": {"sources":["lb3-koordinaten-eintragen"],"maxDifficulty":2,"note":"Koordinatensystem, I. Quadrant."},
 "sks-k5-geo-abstand": {"sources":["lb3-koordinaten-abstand"],"maxDifficulty":2,"note":"Abstand im Koordinatensystem (d2)."},
 "sks-k5-geo-winkelarten": {"sources":["lb3-winkelarten"],"maxDifficulty":2,"note":"spitz/recht/stumpf/gestreckt/überstumpf."},
 "sks-k5-geo-winkel-erg": {"sources":["lb3-winkel-ergaenzung"],"maxDifficulty":2,"note":"Winkelgrößen bestimmen."},
 "sks-k5-geo-verschiebung": {"sources":["lb3-verschiebung"],"maxDifficulty":2,"note":"„Merkmale von Verschiebung und Spiegelung“ (d2)."},
 "sks-k5-geo-achse": {"sources":["lb3-achsensymmetrie"],"maxDifficulty":2,"note":"Achsensymmetrie/Geradenspiegelung (d2)."},
 "sks-k5-geo-punkt": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D6: Punktsymmetrie/-spiegelung kommt im gesamten Fachlehrplan nicht vor (nur Achsen-/Geradenspiegelung, Verschiebung). Entfernen; lb3-punktsymmetrie bleibt ungenutzt."},
 "sks-k5-umfang-rechteck": {"sources":["lb4-umfang-rechteck","lb3-umfang-rechteck"],"maxDifficulty":2,"note":"Zweite Quelle (Gym-K6) vergrößert den Pool; 5/6-Block ohne Klassenaufteilung."},
 "sks-k5-flaeche-rechteck": {"sources":["lb4-flaeche-rechteck","lb3-flaeche-rechteck"],"maxDifficulty":2,"note":"Wie oben."},
 "sks-k5-volumen-quader": {"sources":["lb4-volumen-quader"],"maxDifficulty":2,"note":"ID lb4-volumen-quader kommt in Gym-K5 und Gym-K6 vor (ID-Kollision; Katalog nimmt K5). Als eine Quelle gezählt."},
 "sks-k5-oberflaeche-quader": {"sources":["lb4-oberflaeche-quader"],"maxDifficulty":2,"note":"Wie oben (ID in K5 und K6), d2."},
 "sks-k5-mittelwert": {"sources":["lb2-mittelwert"],"maxDifficulty":2,"note":"Der KS gilt für den gesamten 5/6-Block."},
 "sks-k5-median": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D1: Im 5/6-Block nur arithmetisches Mittel. Median erst RSA 9/10 (Kenngrößen), im HSA nie. Entfernen."},
 "sks-k5-spannweite": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D1: nicht im 5/6-Block. Spannweite erst HSA 9 / RSA 9/10. Entfernen."},
 "sks-k6-bruch-kuerzen": {"sources":["lb1-kuerzen"],"maxDifficulty":2,"note":"Selbes Konzept wie sks-k5-bruch-kuerzen, aber anderes Master-Thema (Gym-K6)."},
 "sks-k6-bruch-erweitern": {"sources":["lb1-erweitern"],"maxDifficulty":2,"note":"Wie oben."},
 "sks-k6-bruch-vergleichen": {"sources":["lb1-vergleichen"],"maxDifficulty":2,"note":"„gebrochene Zahlen vergleichen und ordnen“."},
 "sks-k6-bruch-add": {"sources":["lb1-add-sub-brueche","lb1-sachaufgabe-bruch"],"maxDifficulty":2,"note":"Zusätzlich Sachaufgabe Bruchrechnung (Anwendungsaufgaben)."},
 "sks-k6-bruch-mul": {"sources":["lb1-mult-brueche"],"maxDifficulty":2,"note":"Grundrechenarten mit gebrochenen Zahlen."},
 "sks-k6-bruch-div": {"sources":["lb1-div-brueche"],"maxDifficulty":2,"note":"Kehrwert (d2)."},
 "sks-k6-bruch-dez": {"sources":["lb1-bruch-dezimal"],"maxDifficulty":2,"note":"„gemeine Brüche und Dezimalbrüche ineinander umwandeln“."},
 "sks-k6-prozent": {"sources":["lb1-prozent"],"maxDifficulty":2,"note":"Nur „spezielle Brüche … prozentualen Angaben zuordnen“; Prozentrechnung erst 7/8."},
 "sks-k6-dez-add": {"sources":["lb1-dez-add-sub"],"maxDifficulty":2,"note":"Master Gym-K6; Konzeptdopplung zu sks-k5-dez-add (anderes Master-Thema)."},
 "sks-k6-dez-mul": {"sources":["lb1-dez-mult"],"maxDifficulty":2,"note":"Wie oben."},
 "sks-k6-dez-div": {"sources":["lb1-dez-div"],"maxDifficulty":2,"note":"Wie oben."},
 "sks-k6-dez-runden": {"sources":["lb1-runden"],"maxDifficulty":2,"note":"Wie oben."},
 "sks-k6-nebenwinkel": {"sources":["k7-lb1-nebenwinkel"],"maxDifficulty":2,"note":"Master in Gym-K7, Jg.-6-Niveau; Nebenwinkelsatz im 5/6-Block."},
 "sks-k6-scheitelwinkel": {"sources":["k7-lb1-scheitelwinkel"],"maxDifficulty":2,"note":"Scheitel-/Stufenwinkelsatz."},
 "sks-k6-wechselwinkel": {"sources":[],"maxDifficulty":2,"note":"[Outline] Im Lehrplan gefordert (Wechselwinkelsatz), aber kein eigener Master, daher Outline."},
 "sks-k6-gestreckter": {"sources":[],"maxDifficulty":2,"note":"[Outline] Kein eigener Master (lb3-winkel-ergaenzung ist in K5 gebunden), daher Outline."},
 "sks-k6-winkel-dreieck": {"sources":["lb3-winkel-dreieck","k7-lb1-basiswinkel"],"maxDifficulty":2,"note":"Zusätzlich Basiswinkel im gleichschenkligen Dreieck (d2)."},
 "sks-k6-flaeche-dreieck": {"sources":["lb3-flaeche-dreieck"],"maxDifficulty":2,"note":"Formel Fläche Dreieck."},
 "sks-k6-kongruenz": {"sources":["lb3-kongruenzsatz"],"maxDifficulty":2,"note":"Kongruenzsätze (d2)."},
 "sks-k6-umkreis": {"sources":["k7-lb1-mittelsenkrechte-schritte"],"maxDifficulty":2,"note":"Mittelsenkrechte/Umkreis; Konstruktionsschritte (d2). Neu zugeordnet (bisher Outline)."},
 "sks-k6-proportional": {"sources":["lb2-proportional"],"maxDifficulty":2,"note":"Direkte Proportionalität/Dreisatz."},
 "sks-k6-antiproportional": {"sources":["lb2-antiproportional"],"maxDifficulty":2,"note":"Indirekte Proportionalität (d2)."},
 "sks-k6-dreisatz": {"sources":["lb2-sachaufgabe-dreisatz"],"maxDifficulty":2,"note":"Dreisatz (d2)."},
 "sks-k6-anteil-prozent": {"sources":["lb5-anteil-groesse"],"maxDifficulty":2,"note":"[Titel anpassen] ABWEICHUNG D5: „Prozent einer Größe“ ist 7/8-Stoff; in 5/6 „Anteile von Zahlen und Größen ermitteln“. Titel anpassen; lb5-anteil-prozent geht nach sks-k7-prozent."},
 "sks-k6-haeufigkeit": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D4: Relative Häufigkeit gehört zu 7/8 (Erfassen, Darstellen und Auswerten von Daten). Verschieben nach sks-k7-haeufigkeit."},
 "sks-k6-mittelwert": {"sources":["k7-lb4-mittelwert"],"maxDifficulty":2,"note":"ABWEICHUNG D2: ein KS für den 5/6-Block, schon durch sks-k5-mittelwert abgedeckt. K6-Fassung nur als Vertiefung über das andere Master-Thema; Alternative: entfernen."},
 "sks-k6-median": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D2: Median nicht im 5/6-Block. Entfernen."},
 "sks-k7-rat-add": {"sources":["k7-lb2-add-rational"],"maxDifficulty":2,"note":"Grundrechenoperationen mit rationalen Zahlen."},
 "sks-k7-rat-sub": {"sources":["k7-lb2-sub-rational"],"maxDifficulty":2,"note":"Grundrechenoperationen mit rationalen Zahlen."},
 "sks-k7-rat-mul": {"sources":["k7-lb2-mul-rational"],"maxDifficulty":2,"note":"Grundrechenoperationen mit rationalen Zahlen."},
 "sks-k7-rat-div": {"sources":["k7-lb2-div-rational"],"maxDifficulty":2,"note":"Grundrechenoperationen mit rationalen Zahlen."},
 "sks-k7-betrag": {"sources":["k7-lb2-betrag"],"maxDifficulty":2,"note":"Betrag/entgegengesetzte Zahl."},
 "sks-k7-prozent": {"sources":["lb5-anteil-prozent"],"maxDifficulty":2,"note":"Prozentwert/Grundwert/Prozentsatz (Pool ggf. nur Prozentwert)."},
 "sks-k7-zinsen": {"sources":["k10-lb1-zinsen"],"maxDifficulty":2,"note":"Zinsrechnung; HSA: Jahreszinsen."},
 "sks-k7-zinseszins": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D10: HSA 7/8 nur Jahreszinsen; Zinseszinsen erst HSA 9. Für HS entfernen, nach sks-hs-k9-zinseszins verschieben."},
 "sks-hs-k7-kapital": {"sources":["k10-lb5-kapital"],"maxDifficulty":2,"note":"[NEU] Grundwert aus Prozentwert/Prozentsatz (Kapital, Zinsen, Zinssatz sind im HSA 7/8 benannt)."},
 "sks-hs-k7-zinssatz": {"sources":["k10-lb5-zinssatz"],"maxDifficulty":2,"note":"[NEU] Prozentsatz aus Zinsen/Kapital."},
 "sks-k7-haeufigkeit": {"sources":["lb2-haeufigkeit","k7-lb4-rel-haeufigkeit"],"maxDifficulty":2,"note":"[NEU] Neues Pack-Thema; „absolute/relative Häufigkeit, auch in Prozent“."},
 "sks-k7-gleichung": {"sources":["k8-lb1-gleichung-linear","k8-lb5-zahlenraetsel","k8-lb5-rueckwaerts"],"maxDifficulty":2,"note":"Zusätzlich Anwendungsaufgaben/Gleichung aufstellen, Rückwärtsrechnen („Probe am Text“)."},
 "sks-k7-gleichung-beid": {"sources":["k8-lb1-gleichung-beidseitig"],"maxDifficulty":2,"note":"Typ ax+b=cx+d (d2)."},
 "sks-k7-gleichung-klammer": {"sources":[],"maxDifficulty":2,"note":"[Outline] Gefordert („mit Klammern“), kein freier Master, daher Outline."},
 "sks-k7-ungleichung": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D9: Ungleichung nur als Begriff in 5/6 (S. 23), in 7/8 nicht gefordert. Entfernen."},
 "sks-k7-term": {"sources":["k7-lb2-term-vorrang"],"maxDifficulty":2,"note":"Termwerte berechnen/Rechenvorteile."},
 "sks-k7-term-auswerten": {"sources":["k8-lb1-term-auswerten"],"maxDifficulty":2,"note":"„Termwerte … berechnen“."},
 "sks-k7-zusammenfassen": {"sources":["k8-lb1-zusammenfassen"],"maxDifficulty":2,"note":"Zusammenfassen gleichartiger Summanden."},
 "sks-k7-ausmult": {"sources":["k8-lb1-ausmultiplizieren"],"maxDifficulty":2,"note":"Ausmultiplizieren (d2)."},
 "sks-k7-winkel-viereck": {"sources":["lb3-winkel-viereck"],"maxDifficulty":2,"note":"Innenwinkelsatz Viereck."},
 "sks-k7-winkelsumme": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D8: Lehrplan nur Viereck. Entfernen; k7-lb1-winkelsumme-vieleck bleibt ungenutzt."},
 "sks-k7-flaeche-rechteck": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D35: Konzeptdopplung zu sks-k5-flaeche-rechteck (5/6). Entfernen."},
 "sks-k7-parallelogramm": {"sources":[],"maxDifficulty":2,"note":"[Outline] Parallelogramm/Trapez gefordert; kein Master, daher Outline."},
 "sks-k7-volumen-prisma": {"sources":["k7-lb3-volumen-prisma","lb4-volumen-prisma","lb4-flaeche-kante-quader"],"maxDifficulty":2,"note":"Prisma (Grundfläche Dreieck/Viereck); „Bestimmungsstücke bei gegebenem Volumen“ über lb4-flaeche-kante-quader."},
 "sks-k7-mantel-prisma": {"sources":["k7-lb3-mantel-prisma"],"maxDifficulty":2,"note":"Oberflächeninhalt Prisma (Mantel als Teil)."},
 "sks-k7-oberflaeche-quader": {"sources":["k7-lb3-oberflaeche-quader"],"maxDifficulty":2,"note":"[Titel anpassen] Quader als Prisma; Konzeptnähe zu sks-k5-oberflaeche-quader, anderes Master-Thema. Titel „Oberflächeninhalt von Prismen“ empfohlen."},
 "sks-k7-zylinder": {"sources":["k9-lb2-zylinder-volumen"],"maxDifficulty":2,"note":"Einzige Zylinder-Platzierung (sks-k8-zylinder entfällt)."},
 "sks-k7-netz": {"sources":["lb4-wuerfelnetz"],"maxDifficulty":2,"note":"Netz (Würfelnetz); Schrägbild ohne Master."},
 "sks-k7-mittelwert": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D3: In 7/8 keine Kenngrößen (nur Häufigkeiten). Mittel liegt in 5/6 und HSA 9 / RSA 9/10. Entfernen."},
 "sks-k7-median": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D3: nicht in 7/8, im HSA nie. Entfernen."},
 "sks-k7-spannweite": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D3: nicht in 7/8. HS: sks-hs-k9-spannweite."},
 "sks-k8-kreis-umfang": {"sources":["k9-lb2-kreis-umfang"],"maxDifficulty":2,"note":"Umfang Kreis."},
 "sks-k8-kreis-flaeche": {"sources":["k9-lb2-kreis-flaeche"],"maxDifficulty":2,"note":"Fläche Kreis."},
 "sks-k8-zylinder": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D12: Doppelt zu sks-k7-zylinder (Master nur einmal pro Pack). Entfernen."},
 "sks-k8-thales": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D13: HSA-Kreise ohne Thales (S. 52). Für HS entfernen."},
 "sks-k8-zusammengesetzt": {"sources":["lb4-flaeche-zusammengesetzt","lb4-umfang-zusammengesetzt","lb3-sachaufgabe-geometrie","lb5-sachaufgabe-flaeche"],"maxDifficulty":2,"note":"[NEU] Neues Pack-Thema: „Figuren aus Rechteck, Dreieck, Kreis“. Master enthält ggf. keine Kreisanteile (Stichprobe nötig)."},
 "sks-k8-pythagoras-hyp": {"sources":["k9-lb3-pythagoras-hypotenuse"],"maxDifficulty":2,"note":"Satz des Pythagoras."},
 "sks-k8-pythagoras-kat": {"sources":["k9-lb3-pythagoras-kathete"],"maxDifficulty":2,"note":"Dreiecksstücke berechnen (d2)."},
 "sks-k8-leiter": {"sources":["k9-lb5-leiter"],"maxDifficulty":2,"note":"Anwendungsaufgaben (d2)."},
 "sks-k8-funktionswert": {"sources":["k8-lb3-funktionswert"],"maxDifficulty":2,"note":"Funktionswert."},
 "sks-k8-steigung": {"sources":["k8-lb3-steigung"],"maxDifficulty":2,"note":"Parameter m (d2)."},
 "sks-k8-achsen": {"sources":["k8-lb3-achsenabschnitt"],"maxDifficulty":2,"note":"Parameter n / Nullstelle (d2)."},
 "sks-k8-laplace": {"sources":["k8-lb2-laplace-bruch"],"maxDifficulty":2,"note":"Einstufige Zufallsversuche."},
 "sks-k8-laplace-pct": {"sources":["k8-lb2-laplace-prozent"],"maxDifficulty":2,"note":"Wahrscheinlichkeit P(A)."},
 "sks-k8-gegen": {"sources":["k8-lb2-gegenwahrscheinlichkeit"],"maxDifficulty":2,"note":"P(A)+P(Ā)=1."},
 "sks-hs-k9-potenz-prod": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D14: HSA 9 verlangt Potenzen berechnen/Zehnerpotenzen/Vorsätze, keine Potenzgesetze (nur RSA, S. 41). Entfernen oder auf Rechnen mit Zehnerpotenzen umwidmen."},
 "sks-hs-k9-potenz-quot": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D14 wie oben."},
 "sks-hs-k9-potenz-wert": {"sources":[],"maxDifficulty":2,"note":"[Outline] Gefordert („Potenzen berechnen“), kein freier Master, daher Outline."},
 "sks-hs-k9-wurzel": {"sources":[],"maxDifficulty":2,"note":"[Outline] Kubikwurzel/Wertetabellen gefordert; kein Master, daher Outline."},
 "sks-hs-k9-formeln": {"sources":["k10-lb3-quadrat-seite","k10-lb3-rechteck-breite","k10-lb3-rechteck-umfang"],"maxDifficulty":2,"note":"[NEU] „Gleichungen und Formeln nach verschiedenen Variablen umstellen“; ungenutzte Gym-K10-LB3-Themen (d1/d2/d2)."},
 "sks-hs-k9-pyramide": {"sources":["k7-lb3-volumen-pyramide"],"maxDifficulty":2,"note":"HSA: Pyramiden mit quadratischer Grundfläche; Master-Aufgaben darauf prüfen."},
 "sks-hs-k9-oberflaeche-pyramide": {"sources":["k7-lb3-oberflaeche-pyramide"],"maxDifficulty":2,"note":"Wie oben."},
 "sks-hs-k9-volumen-zus": {"sources":["lb4-volumen-zusammengesetzt"],"maxDifficulty":2,"note":"„Berechnungen an zusammengesetzten Körpern“."},
 "sks-hs-k9-kegel": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D15: Kegel nur als Begriff, im HSA nicht berechnet (S. 58). Entfernen."},
 "sks-hs-k9-lgs": {"sources":["k8-lb3-lgs"],"maxDifficulty":3,"note":"Einziger LGS-Master ist difficulty 3; der Lehrplan verlangt LGS (Einsetzungsverfahren), daher md 3 begründet. Variantenfilter in E3 erwägen."},
 "sks-hs-k9-lgs-y": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D16: derselbe Master wie sks-hs-k9-lgs; zusammenlegen, entfernen."},
 "sks-hs-k9-lgs-grafik": {"sources":[],"maxDifficulty":2,"note":"[Outline] „grafisch lösen“ gefordert; kein Master, daher Outline."},
 "sks-hs-k9-exp": {"sources":["k10-lb1-exp-wachstum"],"maxDifficulty":2,"note":"[Titel anpassen] ABWEICHUNG D17: HSA nennt nichtlineares Wachstum, nicht Exponentialfunktionen; Titel „Exponentielles Wachstum“ anpassen (d2)."},
 "sks-hs-k9-zunahme": {"sources":["k10-lb1-prozentuale-zunahme"],"maxDifficulty":2,"note":"„Steigerung bzw. Senkung um bzw. auf; vermehrter/verminderter Grundwert“."},
 "sks-hs-k9-zinsen": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D19: Jahreszinsen sind 7/8-Stoff; Master k10-lb1-zinsen steckt in sks-k7-zinsen. Entfernen."},
 "sks-hs-k9-zinseszins": {"sources":["k10-lb1-zinseszins"],"maxDifficulty":2,"note":"„Zinseszinsen“ im HSA 9; aus K7 hierher verschoben."},
 "sks-hs-k9-mittelwert": {"sources":["k9-lb4-mittelwert"],"maxDifficulty":2,"note":"Kenngröße."},
 "sks-hs-k9-median": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D18: HSA-Kenngrößen: abs./rel. Häufigkeit, Mittel, Spannweite (S. 60); kein Median. Entfernen."},
 "sks-hs-k9-modal": {"sources":[],"maxDifficulty":2,"note":"[ENTFERNEN] ABWEICHUNG D18: Modalwert steht in keinem Profil. Entfernen."},
 "sks-hs-k9-spannweite": {"sources":["k7-lb4-spannweite"],"maxDifficulty":2,"note":"Kenngröße Spannweite."}
}
```

### RS

```json
{
 "sks-k5-nat-runden": {"sources":["lb1-runden-natuerlich"],"maxDifficulty":3,"note":"Runden: Rundungsregeln."},
 "sks-k5-nat-add": {"sources":["lb1-addition"],"maxDifficulty":3,"note":"Addition."},
 "sks-k5-nat-sub": {"sources":["lb1-subtraktion"],"maxDifficulty":3,"note":"Subtraktion."},
 "sks-k5-nat-mul": {"sources":["lb1-multiplikation"],"maxDifficulty":3,"note":"Multiplikation."},
 "sks-k5-nat-schriftlich": {"sources":["lb1-schriftliches-rechnen"],"maxDifficulty":3,"note":"„schriftliche Rechenverfahren verstehen und ausführen“ (d2)."},
 "sks-k5-nat-div-rest": {"sources":["lb1-division-rest"],"maxDifficulty":3,"note":"Division/Umkehroperation."},
 "sks-k5-nat-div": {"sources":["lb1-schriftliche-division"],"maxDifficulty":3,"note":"Schriftliche Division (d2)."},
 "sks-k5-nat-potenz": {"sources":["lb1-potenzieren"],"maxDifficulty":3,"note":"„Potenzen berechnen“; Quadrat-/Kubik-/Zehnerpotenz."},
 "sks-k5-nat-teilbarkeit": {"sources":["lb1-teilbarkeit"],"maxDifficulty":3,"note":"Teilbarkeitsregeln 2, 3, 5, 10."},
 "sks-k5-nat-prim": {"sources":["lb1-primzahl"],"maxDifficulty":3,"note":"„gerade, ungerade Zahlen, Primzahlen“ (d2)."},
 "sks-k5-sachaufgaben": {"sources":["lb5-gesamtpreis","lb5-teilen","lb5-mehrstufig"],"maxDifficulty":3,"note":"[NEU] Neues Pack-Thema vorgeschlagen: „inner- und außermathematische Anwendungsaufgaben lösen“. Nutzt ungenutzte Gym-K5-LB5-Themen."},
 "sks-k5-gleichung-add": {"sources":["k7-lb2-gleichung-add"],"maxDifficulty":3,"note":"Gleichungstyp ax+b=c; Master-Quelle liegt in Gym-K7, Inhalt K5-Niveau."},
 "sks-k5-gleichung-mul": {"sources":["k7-lb2-gleichung-mul"],"maxDifficulty":3,"note":"Gleichungstyp ax=b."},
 "sks-k5-gleichung-beid": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] ABWEICHUNG D7: In 5/6 nur ax+b=c, a(x+b)=c, ax=b, a:x=b; ax+b=cx+d erst 7/8. Identisch zu sks-k7-gleichung-beid, daher entfernen."},
 "sks-k5-gleichung-probe": {"sources":[],"maxDifficulty":3,"note":"[Outline] „Ergebnisse durch Einsetzen überprüfen“ ist gefordert, aber kein freier Master (k8-lb1-gleichung-linear ist in sks-k7-gleichung gebunden). Bleibt Outline."},
 "sks-k5-bruch-anteil": {"sources":["lb2-anteil-bruch"],"maxDifficulty":3,"note":"„Brüche als Teile von Ganzen angeben“."},
 "sks-k5-bruch-kuerzen": {"sources":["lb2-kuerzen"],"maxDifficulty":3,"note":"Brüche kürzen/erweitern."},
 "sks-k5-bruch-erweitern": {"sources":["lb2-erweitern"],"maxDifficulty":3,"note":"Brüche erweitern."},
 "sks-k5-bruch-grafik": {"sources":["lb2-grafische-brueche"],"maxDifficulty":3,"note":"Brüche veranschaulichen."},
 "sks-k5-dez-add": {"sources":["lb2-dez-add-sub"],"maxDifficulty":3,"note":"Dezimalbrüche addieren/subtrahieren."},
 "sks-k5-dez-mul": {"sources":["lb2-dez-mult"],"maxDifficulty":3,"note":"Dezimalbrüche multiplizieren."},
 "sks-k5-dez-div": {"sources":["lb2-dez-div"],"maxDifficulty":3,"note":"Division steht im 5/6-Block unter Gebrochene Zahlen (Jg.-6-Niveau); der Block ist nicht in 5 und 6 aufgeteilt."},
 "sks-k5-dez-runden": {"sources":["lb2-runden-dezimal"],"maxDifficulty":3,"note":"„Dezimalbrüche runden“."},
 "sks-k5-dez-zahlenstrahl": {"sources":["lb2-zahlenstrahl"],"maxDifficulty":3,"note":"„auf dem Zahlenstrahl ablesen und eintragen“ (d2)."},
 "sks-k5-groessen-ordnen": {"sources":["lb2-ordnen-einheiten"],"maxDifficulty":3,"note":"„Größenangaben umrechnen, vergleichen und ordnen“ (d2)."},
 "sks-k5-umr-laenge": {"sources":["k5-umrechnen-laenge"],"maxDifficulty":3,"note":"Größenarten/Einheiten Länge."},
 "sks-k5-umr-masse": {"sources":["k5-umrechnen-masse"],"maxDifficulty":3,"note":"Größenarten/Einheiten Masse."},
 "sks-k5-umr-zeit": {"sources":["k5-umrechnen-zeit"],"maxDifficulty":3,"note":"Größenarten/Einheiten Zeit."},
 "sks-k5-umr-flaeche": {"sources":["k5-umrechnen-flaeche"],"maxDifficulty":3,"note":"Größenarten/Einheiten Flächeninhalt."},
 "sks-k5-umr-volumen": {"sources":["k5-umrechnen-volumen"],"maxDifficulty":3,"note":"Größenarten/Einheiten Volumen."},
 "sks-k5-geo-strecken": {"sources":["lb3-strecken-bezeichnung"],"maxDifficulty":3,"note":"Punkt, Gerade, Strahl, Strecke bezeichnen."},
 "sks-k5-geo-laenge": {"sources":["lb3-strecken-laenge"],"maxDifficulty":3,"note":"Messen von Längen."},
 "sks-k5-geo-mittelpunkt": {"sources":["lb3-strecken-mittelpunkt"],"maxDifficulty":3,"note":"Nur indirekt (Konstruktion/Koordinaten); d2."},
 "sks-k5-geo-koord-ablesen": {"sources":["lb3-koordinaten-ablesen"],"maxDifficulty":3,"note":"Koordinatensystem, I. Quadrant."},
 "sks-k5-geo-koord-eintragen": {"sources":["lb3-koordinaten-eintragen"],"maxDifficulty":3,"note":"Koordinatensystem, I. Quadrant."},
 "sks-k5-geo-abstand": {"sources":["lb3-koordinaten-abstand"],"maxDifficulty":3,"note":"Abstand im Koordinatensystem (d2)."},
 "sks-k5-geo-winkelarten": {"sources":["lb3-winkelarten"],"maxDifficulty":3,"note":"spitz/recht/stumpf/gestreckt/überstumpf."},
 "sks-k5-geo-winkel-erg": {"sources":["lb3-winkel-ergaenzung"],"maxDifficulty":3,"note":"Winkelgrößen bestimmen."},
 "sks-k5-geo-verschiebung": {"sources":["lb3-verschiebung"],"maxDifficulty":3,"note":"„Merkmale von Verschiebung und Spiegelung“ (d2)."},
 "sks-k5-geo-achse": {"sources":["lb3-achsensymmetrie"],"maxDifficulty":3,"note":"Achsensymmetrie/Geradenspiegelung (d2)."},
 "sks-k5-geo-punkt": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] ABWEICHUNG D6: Punktsymmetrie/-spiegelung kommt im gesamten Fachlehrplan nicht vor (nur Achsen-/Geradenspiegelung, Verschiebung). Entfernen; lb3-punktsymmetrie bleibt ungenutzt."},
 "sks-k5-umfang-rechteck": {"sources":["lb4-umfang-rechteck","lb3-umfang-rechteck"],"maxDifficulty":3,"note":"Zweite Quelle (Gym-K6) vergrößert den Pool; 5/6-Block ohne Klassenaufteilung."},
 "sks-k5-flaeche-rechteck": {"sources":["lb4-flaeche-rechteck","lb3-flaeche-rechteck"],"maxDifficulty":3,"note":"Wie oben."},
 "sks-k5-volumen-quader": {"sources":["lb4-volumen-quader"],"maxDifficulty":3,"note":"ID lb4-volumen-quader kommt in Gym-K5 und Gym-K6 vor (ID-Kollision; Katalog nimmt K5). Als eine Quelle gezählt."},
 "sks-k5-oberflaeche-quader": {"sources":["lb4-oberflaeche-quader"],"maxDifficulty":3,"note":"Wie oben (ID in K5 und K6), d2."},
 "sks-k5-mittelwert": {"sources":["lb2-mittelwert"],"maxDifficulty":3,"note":"Der KS gilt für den gesamten 5/6-Block."},
 "sks-k5-median": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] ABWEICHUNG D1: Im 5/6-Block nur arithmetisches Mittel. Median erst RSA 9/10 (Kenngrößen), im HSA nie. Entfernen."},
 "sks-k5-spannweite": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] ABWEICHUNG D1: nicht im 5/6-Block. Spannweite erst HSA 9 / RSA 9/10. Entfernen."},
 "sks-k6-bruch-kuerzen": {"sources":["lb1-kuerzen"],"maxDifficulty":3,"note":"Selbes Konzept wie sks-k5-bruch-kuerzen, aber anderes Master-Thema (Gym-K6)."},
 "sks-k6-bruch-erweitern": {"sources":["lb1-erweitern"],"maxDifficulty":3,"note":"Wie oben."},
 "sks-k6-bruch-vergleichen": {"sources":["lb1-vergleichen"],"maxDifficulty":3,"note":"„gebrochene Zahlen vergleichen und ordnen“."},
 "sks-k6-bruch-add": {"sources":["lb1-add-sub-brueche","lb1-sachaufgabe-bruch"],"maxDifficulty":3,"note":"Zusätzlich Sachaufgabe Bruchrechnung (Anwendungsaufgaben)."},
 "sks-k6-bruch-mul": {"sources":["lb1-mult-brueche"],"maxDifficulty":3,"note":"Grundrechenarten mit gebrochenen Zahlen."},
 "sks-k6-bruch-div": {"sources":["lb1-div-brueche"],"maxDifficulty":3,"note":"Kehrwert (d2)."},
 "sks-k6-bruch-dez": {"sources":["lb1-bruch-dezimal"],"maxDifficulty":3,"note":"„gemeine Brüche und Dezimalbrüche ineinander umwandeln“."},
 "sks-k6-prozent": {"sources":["lb1-prozent"],"maxDifficulty":3,"note":"Nur „spezielle Brüche … prozentualen Angaben zuordnen“; Prozentrechnung erst 7/8."},
 "sks-k6-dez-add": {"sources":["lb1-dez-add-sub"],"maxDifficulty":3,"note":"Master Gym-K6; Konzeptdopplung zu sks-k5-dez-add (anderes Master-Thema)."},
 "sks-k6-dez-mul": {"sources":["lb1-dez-mult"],"maxDifficulty":3,"note":"Wie oben."},
 "sks-k6-dez-div": {"sources":["lb1-dez-div"],"maxDifficulty":3,"note":"Wie oben."},
 "sks-k6-dez-runden": {"sources":["lb1-runden"],"maxDifficulty":3,"note":"Wie oben."},
 "sks-k6-nebenwinkel": {"sources":["k7-lb1-nebenwinkel"],"maxDifficulty":3,"note":"Master in Gym-K7, Jg.-6-Niveau; Nebenwinkelsatz im 5/6-Block."},
 "sks-k6-scheitelwinkel": {"sources":["k7-lb1-scheitelwinkel"],"maxDifficulty":3,"note":"Scheitel-/Stufenwinkelsatz."},
 "sks-k6-wechselwinkel": {"sources":[],"maxDifficulty":3,"note":"[Outline] Im Lehrplan gefordert (Wechselwinkelsatz), aber kein eigener Master, daher Outline."},
 "sks-k6-gestreckter": {"sources":[],"maxDifficulty":3,"note":"[Outline] Kein eigener Master (lb3-winkel-ergaenzung ist in K5 gebunden), daher Outline."},
 "sks-k6-winkel-dreieck": {"sources":["lb3-winkel-dreieck","k7-lb1-basiswinkel"],"maxDifficulty":3,"note":"Zusätzlich Basiswinkel im gleichschenkligen Dreieck (d2)."},
 "sks-k6-flaeche-dreieck": {"sources":["lb3-flaeche-dreieck"],"maxDifficulty":3,"note":"Formel Fläche Dreieck."},
 "sks-k6-kongruenz": {"sources":["lb3-kongruenzsatz"],"maxDifficulty":3,"note":"Kongruenzsätze (d2)."},
 "sks-k6-umkreis": {"sources":["k7-lb1-mittelsenkrechte-schritte"],"maxDifficulty":3,"note":"Mittelsenkrechte/Umkreis; Konstruktionsschritte (d2). Neu zugeordnet (bisher Outline)."},
 "sks-k6-proportional": {"sources":["lb2-proportional"],"maxDifficulty":3,"note":"Direkte Proportionalität/Dreisatz."},
 "sks-k6-antiproportional": {"sources":["lb2-antiproportional"],"maxDifficulty":3,"note":"Indirekte Proportionalität (d2)."},
 "sks-k6-dreisatz": {"sources":["lb2-sachaufgabe-dreisatz"],"maxDifficulty":3,"note":"Dreisatz (d2)."},
 "sks-k6-anteil-prozent": {"sources":["lb5-anteil-groesse"],"maxDifficulty":3,"note":"[Titel anpassen] ABWEICHUNG D5: „Prozent einer Größe“ ist 7/8-Stoff; in 5/6 „Anteile von Zahlen und Größen ermitteln“. Titel anpassen; lb5-anteil-prozent geht nach sks-k7-prozent."},
 "sks-k6-haeufigkeit": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] ABWEICHUNG D4: Relative Häufigkeit gehört zu 7/8 (Erfassen, Darstellen und Auswerten von Daten). Verschieben nach sks-k7-haeufigkeit."},
 "sks-k6-mittelwert": {"sources":["k7-lb4-mittelwert"],"maxDifficulty":3,"note":"ABWEICHUNG D2: ein KS für den 5/6-Block, schon durch sks-k5-mittelwert abgedeckt. K6-Fassung nur als Vertiefung über das andere Master-Thema; Alternative: entfernen."},
 "sks-k6-median": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] ABWEICHUNG D2: Median nicht im 5/6-Block. Entfernen."},
 "sks-k7-rat-add": {"sources":["k7-lb2-add-rational"],"maxDifficulty":3,"note":"Grundrechenoperationen mit rationalen Zahlen."},
 "sks-k7-rat-sub": {"sources":["k7-lb2-sub-rational"],"maxDifficulty":3,"note":"Grundrechenoperationen mit rationalen Zahlen."},
 "sks-k7-rat-mul": {"sources":["k7-lb2-mul-rational"],"maxDifficulty":3,"note":"Grundrechenoperationen mit rationalen Zahlen."},
 "sks-k7-rat-div": {"sources":["k7-lb2-div-rational"],"maxDifficulty":3,"note":"Grundrechenoperationen mit rationalen Zahlen."},
 "sks-k7-betrag": {"sources":["k7-lb2-betrag"],"maxDifficulty":3,"note":"Betrag/entgegengesetzte Zahl."},
 "sks-k7-prozent": {"sources":["lb5-anteil-prozent"],"maxDifficulty":3,"note":"Prozentwert/Grundwert/Prozentsatz (Pool ggf. nur Prozentwert)."},
 "sks-k7-zinsen": {"sources":["k10-lb1-zinsen"],"maxDifficulty":3,"note":"Zinsrechnung; HSA: Jahreszinsen."},
 "sks-k7-zinseszins": {"sources":["k10-lb1-zinseszins"],"maxDifficulty":3,"note":"RSA 7/8 nennt Zinseszins ausdrücklich. Einzige RS-Platzierung (rs-k9/k10-zinseszins entfallen, D20)."},
 "sks-k7-haeufigkeit": {"sources":["lb2-haeufigkeit","k7-lb4-rel-haeufigkeit"],"maxDifficulty":3,"note":"[NEU] Neues Pack-Thema; „absolute/relative Häufigkeit, auch in Prozent“."},
 "sks-k7-gleichung": {"sources":["k8-lb1-gleichung-linear","k8-lb5-zahlenraetsel","k8-lb5-rueckwaerts"],"maxDifficulty":3,"note":"Zusätzlich Anwendungsaufgaben/Gleichung aufstellen, Rückwärtsrechnen („Probe am Text“)."},
 "sks-k7-gleichung-beid": {"sources":["k8-lb1-gleichung-beidseitig"],"maxDifficulty":3,"note":"Typ ax+b=cx+d (d2)."},
 "sks-k7-gleichung-klammer": {"sources":[],"maxDifficulty":3,"note":"[Outline] Gefordert („mit Klammern“), kein freier Master, daher Outline."},
 "sks-k7-ungleichung": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] Wie HS (D9)."},
 "sks-k7-term": {"sources":["k7-lb2-term-vorrang"],"maxDifficulty":3,"note":"Termwerte berechnen/Rechenvorteile."},
 "sks-k7-term-auswerten": {"sources":["k8-lb1-term-auswerten"],"maxDifficulty":3,"note":"„Termwerte … berechnen“."},
 "sks-k7-zusammenfassen": {"sources":["k8-lb1-zusammenfassen"],"maxDifficulty":3,"note":"Zusammenfassen gleichartiger Summanden."},
 "sks-k7-ausmult": {"sources":["k8-lb1-ausmultiplizieren"],"maxDifficulty":3,"note":"Ausmultiplizieren (d2)."},
 "sks-k7-winkel-viereck": {"sources":["lb3-winkel-viereck"],"maxDifficulty":3,"note":"Innenwinkelsatz Viereck."},
 "sks-k7-winkelsumme": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] Wie HS (D8)."},
 "sks-k7-flaeche-rechteck": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] Wie HS (D35)."},
 "sks-k7-parallelogramm": {"sources":[],"maxDifficulty":3,"note":"[Outline] Parallelogramm/Trapez gefordert; kein Master, daher Outline."},
 "sks-k7-volumen-prisma": {"sources":["k7-lb3-volumen-prisma","lb4-volumen-prisma","lb4-flaeche-kante-quader"],"maxDifficulty":3,"note":"Prisma (Grundfläche Dreieck/Viereck); „Bestimmungsstücke bei gegebenem Volumen“ über lb4-flaeche-kante-quader."},
 "sks-k7-mantel-prisma": {"sources":["k7-lb3-mantel-prisma"],"maxDifficulty":3,"note":"Oberflächeninhalt Prisma (Mantel als Teil)."},
 "sks-k7-oberflaeche-quader": {"sources":["k7-lb3-oberflaeche-quader"],"maxDifficulty":3,"note":"[Titel anpassen] Quader als Prisma; Konzeptnähe zu sks-k5-oberflaeche-quader, anderes Master-Thema. Titel „Oberflächeninhalt von Prismen“ empfohlen."},
 "sks-k7-zylinder": {"sources":["k9-lb2-zylinder-volumen"],"maxDifficulty":3,"note":"Einzige Zylinder-Platzierung (sks-k8-zylinder entfällt)."},
 "sks-k7-netz": {"sources":["lb4-wuerfelnetz"],"maxDifficulty":3,"note":"Netz (Würfelnetz); Schrägbild ohne Master."},
 "sks-k7-mittelwert": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] Wie HS (D3)."},
 "sks-k7-median": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] Wie HS; k7-lb4-median wird Zusatzquelle von sks-rs-k9-median."},
 "sks-k7-spannweite": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] Wie HS; RS: sks-rs-k10-spannweite."},
 "sks-k8-kreis-umfang": {"sources":["k9-lb2-kreis-umfang"],"maxDifficulty":3,"note":"Umfang Kreis."},
 "sks-k8-kreis-flaeche": {"sources":["k9-lb2-kreis-flaeche"],"maxDifficulty":3,"note":"Fläche Kreis."},
 "sks-k8-zylinder": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] Wie HS (D12)."},
 "sks-k8-thales": {"sources":[],"maxDifficulty":3,"note":"[Outline] Thales ist RSA-Inhalt (S. 36), aber kein Master, daher Outline."},
 "sks-k8-zusammengesetzt": {"sources":["lb4-flaeche-zusammengesetzt","lb4-umfang-zusammengesetzt","lb3-sachaufgabe-geometrie","lb5-sachaufgabe-flaeche"],"maxDifficulty":3,"note":"[NEU] Neues Pack-Thema: „Figuren aus Rechteck, Dreieck, Kreis“. Master enthält ggf. keine Kreisanteile (Stichprobe nötig)."},
 "sks-k8-pythagoras-hyp": {"sources":["k9-lb3-pythagoras-hypotenuse"],"maxDifficulty":3,"note":"Satz des Pythagoras."},
 "sks-k8-pythagoras-kat": {"sources":["k9-lb3-pythagoras-kathete"],"maxDifficulty":3,"note":"Dreiecksstücke berechnen (d2)."},
 "sks-k8-leiter": {"sources":["k9-lb5-leiter"],"maxDifficulty":3,"note":"Anwendungsaufgaben (d2)."},
 "sks-k8-funktionswert": {"sources":["k8-lb3-funktionswert"],"maxDifficulty":3,"note":"Funktionswert."},
 "sks-k8-steigung": {"sources":["k8-lb3-steigung"],"maxDifficulty":3,"note":"Parameter m (d2)."},
 "sks-k8-achsen": {"sources":["k8-lb3-achsenabschnitt"],"maxDifficulty":3,"note":"Parameter n / Nullstelle (d2)."},
 "sks-k8-laplace": {"sources":["k8-lb2-laplace-bruch"],"maxDifficulty":3,"note":"Einstufige Zufallsversuche."},
 "sks-k8-laplace-pct": {"sources":["k8-lb2-laplace-prozent"],"maxDifficulty":3,"note":"Wahrscheinlichkeit P(A)."},
 "sks-k8-gegen": {"sources":["k8-lb2-gegenwahrscheinlichkeit"],"maxDifficulty":3,"note":"P(A)+P(Ā)=1."},
 "sks-rs-k9-potenz-prod": {"sources":["k9-lb1-potenz-produkt"],"maxDifficulty":3,"note":"„Potenzgesetze anwenden“ (d2)."},
 "sks-rs-k9-potenz-quot": {"sources":["k9-lb1-potenz-quotient"],"maxDifficulty":3,"note":"Potenzgesetze (d2)."},
 "sks-rs-k9-potenz-wert": {"sources":[],"maxDifficulty":3,"note":"[Outline] Kein freier Master, daher Outline."},
 "sks-rs-k9-wurzel": {"sources":[],"maxDifficulty":3,"note":"[Outline] n-te Wurzel; kein Master, daher Outline."},
 "sks-rs-k9-formeln": {"sources":["k10-lb3-quadrat-seite","k10-lb3-rechteck-breite","k10-lb3-rechteck-umfang"],"maxDifficulty":3,"note":"[NEU] „Gleichungen und Formeln nach verschiedenen Variablen umstellen“."},
 "sks-rs-k9-pyramide": {"sources":["k7-lb3-volumen-pyramide"],"maxDifficulty":3,"note":"Volumen Pyramide (d2)."},
 "sks-rs-k9-oberflaeche-pyramide": {"sources":["k7-lb3-oberflaeche-pyramide"],"maxDifficulty":3,"note":"[NEU] Im RS-Pack fehlt die Pyramidenoberfläche (HS-Pack hat sie)."},
 "sks-rs-k9-kugel": {"sources":["k9-lb2-kugel-volumen"],"maxDifficulty":3,"note":"Kugel (RSA)."},
 "sks-rs-k9-volumen-zus": {"sources":["lb4-volumen-zusammengesetzt"],"maxDifficulty":3,"note":"Zusammengesetzte Körper."},
 "sks-rs-k9-kegel": {"sources":[],"maxDifficulty":3,"note":"[Outline] Gefordert; kein Master, daher Outline."},
 "sks-rs-k9-streckfaktor": {"sources":["k8-lb4-streckfaktor"],"maxDifficulty":3,"note":"Zentrische Streckung (d2)."},
 "sks-rs-k9-strahlensatz": {"sources":["k8-lb4-strahlensatz"],"maxDifficulty":3,"note":"Streckenverhältnisse (d2)."},
 "sks-rs-k9-aehnlich": {"sources":["k8-lb4-aehnliche-seite"],"maxDifficulty":3,"note":"Ähnlichkeit (d2)."},
 "sks-rs-k9-trig": {"sources":["k9-lb3-trig-wert"],"maxDifficulty":3,"note":"Trigonometrie am rechtwinkligen Dreieck (d2)."},
 "sks-rs-k9-trig-hoehe": {"sources":[],"maxDifficulty":3,"note":"[Outline] Gefordert; kein Master, daher Outline."},
 "sks-rs-k9-trig-seite": {"sources":[],"maxDifficulty":3,"note":"[Outline] Gefordert; kein Master, daher Outline."},
 "sks-rs-k9-lgs": {"sources":["k8-lb3-lgs"],"maxDifficulty":3,"note":"Master difficulty 3; für RS ohne Einschränkung."},
 "sks-rs-k9-lgs-y": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] ABWEICHUNG D16: gleicher Master wie lgs; zusammenlegen, entfernen."},
 "sks-rs-k9-lgs-grafik": {"sources":[],"maxDifficulty":3,"note":"[Outline] Gefordert; kein Master, daher Outline."},
 "sks-rs-k9-exp": {"sources":["k10-lb1-exp-wachstum"],"maxDifficulty":3,"note":"Exponentialfunktion y=2^x, Wachstumsprozesse (d2)."},
 "sks-rs-k9-zunahme": {"sources":["k10-lb1-prozentuale-zunahme"],"maxDifficulty":3,"note":"„Prozentrechnung bei Wachstumsprozessen“."},
 "sks-rs-k9-zinsen": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] ABWEICHUNG D20: Dublette zu sks-k7-zinsen (Master pro Pack nur einmal). Entfernen."},
 "sks-rs-k9-zinseszins": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] ABWEICHUNG D20: Dublette zu sks-k7-zinseszins. Entfernen."},
 "sks-rs-k9-mittelwert": {"sources":["k9-lb4-mittelwert"],"maxDifficulty":3,"note":"Kenngrößen."},
 "sks-rs-k9-median": {"sources":["k9-lb4-median","k7-lb4-median"],"maxDifficulty":3,"note":"Median nur RSA; zweite Quelle aus entfernter K7-Platzierung."},
 "sks-rs-k9-modal": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] ABWEICHUNG D23: Modalwert nicht im Lehrplan. Entfernen."},
 "sks-rs-k9-laplace": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] ABWEICHUNG D22: einstufige Laplace-Wsk. ist 7/8-Stoff (sks-k8-laplace). Entfernen."},
 "sks-rs-k9-pfad": {"sources":[],"maxDifficulty":3,"note":"[Outline] Gefordert (Baumdiagramm, Pfadregeln); kein Master, daher Outline."},
 "sks-rs-k10-quadrat-wert": {"sources":["k9-lb1-quadrat-wert"],"maxDifficulty":3,"note":"Quadratische Funktion (d2)."},
 "sks-rs-k10-scheitel": {"sources":["k9-lb1-scheitel"],"maxDifficulty":3,"note":"Scheitelpunkt (d2)."},
 "sks-rs-k10-reinquadratisch": {"sources":["k10-lb4-reinquadratisch"],"maxDifficulty":3,"note":"Spezialfall quadratische Gleichung (d2)."},
 "sks-rs-k10-gleichung": {"sources":["k10-lb4-quadratische-gleichung"],"maxDifficulty":3,"note":"Lösungsformel/Diskriminante (d3)."},
 "sks-rs-k10-parabel": {"sources":["k10-lb4-parabel-wert"],"maxDifficulty":3,"note":"Parabel (d2)."},
 "sks-rs-k10-sinus": {"sources":[],"maxDifficulty":3,"note":"[Outline] Gefordert; kein Master, daher Outline."},
 "sks-rs-k10-zinsen": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] ABWEICHUNG D20: Dublette zu sks-k7-zinsen. Entfernen."},
 "sks-rs-k10-zinseszins": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] ABWEICHUNG D20: Dublette zu sks-k7-zinseszins. Entfernen."},
 "sks-rs-k10-kapital": {"sources":["k10-lb5-kapital"],"maxDifficulty":3,"note":"Bleibt in K10 (Prozentrechnung ist 7/8-Stoff; Verschiebung nach K7 optional)."},
 "sks-rs-k10-zinssatz": {"sources":["k10-lb5-zinssatz"],"maxDifficulty":3,"note":"Wie oben."},
 "sks-rs-k10-erwartung": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] ABWEICHUNG D21: Erwartungswert kommt im Fachlehrplan nicht vor. Entfernen."},
 "sks-rs-k10-erwartung-wuerfel": {"sources":[],"maxDifficulty":3,"note":"[ENTFERNEN] ABWEICHUNG D21 wie oben."},
 "sks-rs-k10-spannweite": {"sources":["k7-lb4-spannweite"],"maxDifficulty":3,"note":"Kenngröße (9/10-Block)."}
}
```

## 7. E5-Ergänzungen (Umsetzung E5c, 2026-11-18)

Umgesetzt in `src/curriculum/sekundarschuleSachsenAnhaltPack.ts` (`SKS_TOPIC_MAPPINGS`); Test: `src/curriculum/sekundarschuleMapping.test.ts`. Pack-Version HS und RS: 1.2.0.

### Zusätzliche Quellen (1:n) aus bisher ungenutzten Mastern

| Pack-Thema | zusätzliche Quelle | Begründung |
|---|---|---|
| `sks-k5-umr-laenge` | `k6-umrechnen-laenge` | Ein KS Größen für 5/6 (§3.2 S. 24); Gym-K6-Master war ungenutzt. |
| `sks-k5-umr-flaeche` | `k6-umrechnen-flaeche` | Wie oben. |
| `sks-k5-volumen-quader` | `mathematik-klasse-6:lb4-volumen-quader` | Klassenqualifiziert; Doc-Quelle ist die K5-Fassung (`mathematik-klasse-5:...`). 5/6-Block ohne Klassenaufteilung (§3.2 S. 27). |
| `sks-k5-oberflaeche-quader` | `mathematik-klasse-6:lb4-oberflaeche-quader` | Wie oben. |
| `sks-k5-umfang-rechteck` | `lb4-umfang-zusammengesetzt` | Umfang rechteckig zusammengesetzter Figuren (§3.2 S. 27); Seitenbezug nur über die Doc-Zuordnung, im PDF nicht erneut geprüft. |
| `sks-k5-flaeche-rechteck` | `lb4-flaeche-zusammengesetzt` | Wie oben, Flächeninhalt. |
| `sks-k5-sachaufgaben` | `lb3-sachaufgabe-geometrie`, `lb5-sachaufgabe-flaeche` | Anwendungsaufgaben (§3.2 S. 22). |

Weiterhin bewusst ungenutzt (passen nicht zum jeweiligen Profil-Lehrplan): `lb3-punktsymmetrie` (D6), `k7-lb1-winkelsumme-vieleck` (D8), `k9-lb4-modalwert` und `k9-lb4-median` bei HS (D18/D23), `k10-lb2-erwartungswert(-wuerfel)` (D21); HS zusätzlich die RSA-Themen (Ähnlichkeit, Kugel, Trigonometrie, Quadratisches, Potenzgesetze).

### Stichprobe `sks-k8-zusammengesetzt` (verworfen)

60 Seeds je Master: `lb4-flaeche-zusammengesetzt`, `lb4-umfang-zusammengesetzt`, `lb3-sachaufgabe-geometrie`, `lb5-sachaufgabe-flaeche`. Ergebnis: 0 Aufgaben mit Kreis, Radius, Durchmesser oder Halbkreis; es kommen nur Rechteck-Zerlegungen (U-Formen) und Rechteck-Sachaufgaben vor. Das vorgeschlagene Thema „aus Rechteck, Dreieck, Kreis“ (KS Kreise, §3.4.1 S. 52) wäre damit inhaltlich falsch. Das Thema wird nicht angelegt; die Master laufen als Zusatzquellen in 5/6 (siehe oben). Zahl „nachher“ sinkt damit um 1 (HS 109, RS 122 statt 110/123).

### Schwierigkeit

- Gemeinsame Themen (`sks-k5..k8-*`) gelten für HS und RS in einem Mapping und sind auf `maxDifficulty: 2` begrenzt (HS-Vorgabe). RS-eigene Themen (`sks-rs-*`) haben keine Obergrenze.
- `sks-hs-k9-lgs`: `maxDifficulty: 3` mit `difficultyReason` (§3.4.2 KS Lineare Gleichungssysteme, S. 59; einziger LGS-Master `k8-lb3-lgs` hat difficulty 3).

### Outline-Änderungen mit Beleg

Entfernt (Belege siehe Tabelle in Abschnitt 2): beide Profile D1 bis D9, D12, D35 (13 Themen); nur HS: `sks-k7-zinseszins` (D10), `sks-k8-thales` (D13), `sks-hs-k9-potenz-prod/-quot` (D14), `-kegel` (D15), `-lgs-y` (D16), `-zinsen` (D19), `-median/-modal` (D18); nur RS: `sks-rs-k9-lgs-y` (D16), `-zinsen/-zinseszins` und `sks-rs-k10-zinsen/-zinseszins` (D20), `sks-rs-k9-modal` (D23), `sks-rs-k9-laplace` (D22), `sks-rs-k10-erwartung(-wuerfel)` (D21). Neu: `sks-k5-sachaufgaben` (§3.2 S. 22), `sks-k7-haeufigkeit` (§3.3.1 S. 39 / §3.4.1 S. 55), `sks-hs-k7-kapital/-zinssatz` (§3.4.1 S. 49), `sks-hs-k9-formeln` und `sks-rs-k9-formeln` (§3.4.2 S. 57 / §3.3.2), `sks-rs-k9-oberflaeche-pyramide`. Umtitelt: `sks-k6-anteil-prozent` (D5), `sks-k7-oberflaeche-quader`; Bereich „Zufallsgrößen und Kenngrößen“ in Klasse 10 RS heißt jetzt „Häufigkeitsverteilungen“ (D21, §3.3.2 S. 46).

Alte IDs: Zuvor spielbare, entfernte Themen bleiben als Alias in `SKS_TOPIC_MAPPINGS` auflösbar (nicht im Outline); `SKS_GENERATOR_MAP` ist leer.
