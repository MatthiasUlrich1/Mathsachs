# Mapping Gymnasium Sachsen-Anhalt · Mathematik (E4a)

Stand: 2026-11-16 · Pack: `st-gym-*` (Outline in `src/curriculum/gymSachsenAnhaltPack.ts`, Map `ST_GENERATOR_MAP`). Master: Gymnasium Sachsen (`math5.ts` … `math11_12.ts`); ehemalige Neu-Aufgaben (`*__neu`, `reviewOf` = Eltern-ID) sind Teil der Eltern-Themen und werden über deren ID angesprochen.

## 1. Quelle

- **Dokument:** Fachlehrplan Gymnasium Mathematik, Land Sachsen-Anhalt, Fassung **01.08.2022** (Quelle: Landesportal Sachsen-Anhalt, CC BY-SA 3.0).
- **Abgerufen von:** https://www.bildung-lsa.de/files/b45de329c361a40a2f0a7211902d5815/FLP_Mathe_Gym_010822_swd.pdf (HTTP 200, 1,28 MB; Text per pdftotext vollständig lesbar). Der Header der Repo-Datei nennt als Ursprung `lisa.sachsen-anhalt.de/…/FLP_Mathe_Gym_010822_swd.pdf`; die Datei wird heute auf `bildung-lsa.de` ausgeliefert (LISA-Einstieg: lisa.sachsen-anhalt.de → Unterricht → Lehrpläne → Gymnasium).
- **PDF lesbar: ja.** Alle Lehrplanangaben unten sind gegen dieses PDF geprüft (Kapitel 3.1–3.6, 2.5). Seitenzahlen = gedruckte Seitenzahlen des PDFs. „KS“ = Kompetenzschwerpunkt.
- **Nicht geprüft:** die „Ergänzenden fachspezifischen Hinweise 2025 Mathematik“ (bildung-lsa.de) – Abruf lieferte keine lesbare PDF-Datei (489-Byte-Antwort). Änderungen daraus sind nicht berücksichtigt.
- **Lehrplanstruktur:** Jg. 5/6, 7/8 (je Doppeljahrgang, keine Aufteilung auf Einzeljahre), Jg. 9, Jg. 10 (Einführungsphase), Jg. 11/12 (Qualifikationsphase; gA = grundlegend, eAN = erhöht). Das Pack bildet 11/12 mit gA ab.

## 2. Ergebnis in Zahlen

| Klasse | spielbar vorher | spielbar nachher | Δ |
|---|---|---|---|
| Klasse 5 | 46 | 46 | +0 |
| Klasse 6 | 28 | 29 | +1 |
| Klasse 7 | 26 | 23 | -3 |
| Klasse 8 | 18 | 19 | +1 |
| Klasse 9 | 12 | 12 | +0 |
| Klasse 10 | 12 | 10 | -2 |
| 11/12 gA | 7 | 5 | -2 |
| **gesamt** | **149** | **144** | **-5** |

- Pack-Themen im Outline: 177. Ohne Quelle nachher (Outline): 33.
- Master-Themen (ohne `__grafik`-Prüfvarianten): 156; davon genutzt: 144, ungenutzt: 12.
- Jeder Master wird höchstens einmal verwendet (per Skript geprüft; vorher 7 Doppelnutzungen).
- Abweichungen Outline ↔ Lehrplan: **22** (Abschnitt 4).

Regeln der Zuordnung: Master nach Inhalt (Beispielaufgabe geprüft, nicht nur Titel); ein Master höchstens einmal im Pack; Master aus anderer Klasse nur, wenn der Lehrplan den Inhalt in der Pack-Klasse verortet. Hauptschul-/`maxDifficulty`-Spalte entfällt (Gymnasium-Pack). Das Pack nutzt 1:1-Aliasse (je 1 Quelle).

## 3. Mapping je Klasse

Spalte „Master-Quellen“: `id` = Gym-Sachsen-Master (Eltern-ID inkl. ehemals Neu-Aufgaben); **[geändert]** = Mapping weicht von `ST_GENERATOR_MAP` ab; „(vorher: …)“ = bisher gemappt, jetzt Outline.

### Klasse 5 (vorher 46 spielbar, nachher 46)

| Pack-Thema-ID | Titel | Master-Quellen | Begründung | Lehrplanquelle |
|---|---|---|---|---|
| `st-k5-nat-runden` | Natürliche Zahlen runden | `lb1-runden-natuerlich` | Master „Natürliche Zahlen runden“, Beispiel: „Runde 568.191 auf Hunderttausender. …“ – deckt den Inhalt des Pack-Themas. | 3.2 (Jg. 5/6) KS „Natürliche Zahlen“, S. 36 |
| `st-k5-nat-add` | Addieren natürlicher Zahlen | `lb1-addition` | Master „Addition natürlicher Zahlen“, Beispiel: „Berechne: 2.695 + 4.907 + 4.845 …“ – deckt den Inhalt des Pack-Themas. | 3.2 (Jg. 5/6) KS „Natürliche Zahlen“, S. 36 |
| `st-k5-nat-sub` | Subtrahieren natürlicher Zahlen | `lb1-subtraktion` | Master „Subtraktion natürlicher Zahlen“, Beispiel: „Berechne: 61.668 − 60.518 …“ – deckt den Inhalt des Pack-Themas. | 3.2 (Jg. 5/6) KS „Natürliche Zahlen“, S. 36 |
| `st-k5-nat-mul` | Multiplizieren natürlicher Zahlen | `lb1-multiplikation` | Master „Multiplikation natürlicher Zahlen“, Beispiel: „Berechne: 532 · 88 …“ – deckt den Inhalt des Pack-Themas. | 3.2 (Jg. 5/6) KS „Natürliche Zahlen“, S. 36 |
| `st-k5-nat-schriftlich` | Schriftliche Rechenverfahren | `lb1-schriftliches-rechnen` | Master „Schriftliches Rechnen (Kästchenpapier)“, Beispiel: „Schätze durch Runden auf Hunderter: 5.337 + 8.853 ≈ ? …“ – deckt den Inhalt des Pack-Themas. | 3.2 (Jg. 5/6) KS „Natürliche Zahlen“, S. 36 |
| `st-k5-nat-div-rest` | Division mit Rest | `lb1-division-rest` | Master „Division mit Rest“, Beispiel: „Berechne mit Rest: 5615 : 6 …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Natürliche Zahlen“, S. 36 (Division, Quotient/Dividend/Divisor) |
| `st-k5-nat-div` | Schriftliche Division | `lb1-schriftliche-division` | Master „Schriftliche Division“, Beispiel: „Dividiere schriftlich (große Zahl): …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Natürliche Zahlen“, S. 36 (schriftliche Rechenverfahren) |
| `st-k5-nat-potenz` | Potenzen (Quadrat- und Zehnerpotenzen) | `lb1-potenzieren` | Master „Potenzieren (Quadrat- und Zehnerpotenzen)“, Beispiel: „Berechne: 9⁴ …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Natürliche Zahlen“, S. 36 („Potenzen berechnen“, Quadrat-/Zehnerpotenz) |
| `st-k5-nat-teilbarkeit` | Teilbarkeit prüfen | `lb1-teilbarkeit` | Master „Teilbarkeit prüfen“, Beispiel: „Welchen Rest lässt 295 bei Division durch 6? …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Natürliche Zahlen“, S. 36 (Teilbarkeitsregeln) |
| `st-k5-nat-prim` | Primzahlen erkennen | `lb1-primzahl` | Master „Primzahlen erkennen“, Beispiel: „Wie viele Primzahlen liegen zwischen 33 und 48 (einschließlich)? …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Natürliche Zahlen“, S. 36 (Primzahlen) |
| `st-k5-bruch-anteil` | Anteil als Bruch | `lb2-anteil-bruch` | Master „Anteil als Bruch“, Beispiel: „Von 24 Plätzchen sind 23 schon gegessen. Welcher Anteil der Plätzchen ist n …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Brüche“, S. 37 |
| `st-k5-bruch-kuerzen` | Brüche kürzen | `lb2-kuerzen` | Master „Brüche kürzen“, Beispiel: „Eine Tafel Schokolade ist in 77 gleich große Stücke geteilt. 35 davon sind …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Brüche“, S. 37 |
| `st-k5-bruch-erweitern` | Brüche erweitern | `lb2-erweitern` | Master „Brüche erweitern“, Beispiel: „Der Bruch 5/6 wird erweitert. Der neue Zähler lautet 30. Wie lautet der neu …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Brüche“, S. 37 |
| `st-k5-bruch-grafik` | Brüche grafisch ablesen | `lb2-grafische-brueche` | Master „Brüche grafisch ablesen“, Beispiel: „Welcher Bruch ist im Kreisdiagramm dargestellt? …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Brüche“, S. 37 |
| `st-k5-dez-add` | Dezimalzahlen addieren und subtrahieren | `lb2-dez-add-sub` | Master „Dezimalzahlen addieren und subtrahieren“, Beispiel: „Berechne: 57,4 + 49,1 − 29,1 …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Brüche“, S. 37 |
| `st-k5-dez-mul` | Dezimalzahlen multiplizieren | `lb2-dez-mult` | Master „Dezimalzahl multiplizieren“, Beispiel: „Berechne: 5,7 · 9,8 …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Brüche“, S. 37 |
| `st-k5-dez-div` | Dezimalzahlen dividieren | `lb2-dez-div` | Master „Dezimalzahl dividieren“, Beispiel: „Berechne: 39,6 : 3,3 …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Gebrochene Zahlen“, S. 38 (Grundrechenoperationen; „Brüche“ S. 37 nennt nur +, −, ·) |
| `st-k5-dez-runden` | Dezimalzahlen runden | `lb2-runden-dezimal` | Master „Dezimalzahlen runden“, Beispiel: „Ein Preis wird mit 26,981 € berechnet. Runde ihn auf volle Cent (2 Nachkomm …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Brüche“, S. 37 |
| `st-k5-dez-zahlenstrahl` | Dezimalzahlen auf dem Zahlenstrahl | `lb2-zahlenstrahl` | Master „Dezimalzahlen auf dem Zahlenstrahl: Mitte finden“, Beispiel: „Auf dem Zahlenstrahl sind die Punkte 4,7 und 8,7 markiert. Wie groß ist der …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Brüche“, S. 37 (Zahlenstrahl ablesen/eintragen) |
| `st-k5-groessen-ordnen` | Größen mit verschiedenen Einheiten ordnen | `lb2-ordnen-einheiten` | Master „Größen mit verschiedenen Einheiten ordnen“, Beispiel: „Sortiere die Zeitangaben von klein nach groß (kleinste zuerst): …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Größen“, S. 38 |
| `st-k5-umr-laenge` | Einheiten umrechnen: Länge | `k5-umrechnen-laenge` | Master „Einheiten umrechnen: Länge“, Beispiel: „Max läuft morgens 550 m zur Schule und nachmittags denselben Weg zurück. Wi …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Größen“, S. 38 |
| `st-k5-umr-masse` | Einheiten umrechnen: Masse | `k5-umrechnen-masse` | Master „Einheiten umrechnen: Masse“, Beispiel: „Ein Lastwagen transportiert 500 Kisten Äpfel mit je 14 kg. Wie viele Tonnen …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Größen“, S. 38 |
| `st-k5-umr-zeit` | Einheiten umrechnen: Zeit | `k5-umrechnen-zeit` | Master „Einheiten umrechnen: Zeit“, Beispiel: „Lea trainiert an 4 Tagen pro Woche jeweils 90 Minuten. Wie viele Stunden tr …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Größen“, S. 38 |
| `st-k5-umr-flaeche` | Einheiten umrechnen: Flächeninhalt | `k5-umrechnen-flaeche` | Master „Einheiten umrechnen: Flächeninhalt“, Beispiel: „Ein Grundstück ist 700 m² groß. Wie viele a (Ar) sind das? …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Größen“, S. 38 |
| `st-k5-umr-volumen` | Einheiten umrechnen: Volumen | `k5-umrechnen-volumen` | Master „Einheiten umrechnen: Volumen“, Beispiel: „Eine Kiste enthält 12 Flaschen mit je 1000 ml. Wie viele Liter sind das ins …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Größen“, S. 38 |
| `st-k5-geo-strecken` | Strecke, Gerade und Halbgerade | `lb3-strecken-bezeichnung` | Master „Strecke, Gerade und Halbgerade“, Beispiel: „Welche Figur passt zu dieser Beschreibung: ein Lichtstrahl, der an einer Ta …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39 |
| `st-k5-geo-laenge` | Länge von Strecken | `lb3-strecken-laenge` | Master „Länge von Strecken“, Beispiel: „Die Strecken AB und AD sind zwei Seiten eines Rechtecks ABCD. Berechne den …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39 |
| `st-k5-geo-mittelpunkt` | Mittelpunkt einer Strecke | `lb3-strecken-mittelpunkt` | Master „Mittelpunkt einer Strecke“, Beispiel: „Der Mittelpunkt der Strecke AB ist M(5/0). Punkt A liegt bei (1/4). Wie lau …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39 |
| `st-k5-geo-koord-ablesen` | Koordinaten ablesen | `lb3-koordinaten-ablesen` | Master „Koordinaten ablesen“, Beispiel: „Punkt P ist im Koordinatensystem markiert. Wie groß ist der Abstand von P z …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39 |
| `st-k5-geo-koord-eintragen` | Punkte im Koordinatensystem zuordnen | `lb3-koordinaten-eintragen` | Master „Punkte im Koordinatensystem zuordnen“, Beispiel: „Setze die drei Punkte A(2/7), B(7/-1), C(3/4) im Koordinatensystem. …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39 |
| `st-k5-geo-abstand` | Abstand zwischen Punkten | `lb3-koordinaten-abstand` | Master „Abstand zwischen Punkten“, Beispiel: „Berechne den Umfang des Dreiecks ABC. (1 Kästchen = 1 LE) …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39 |
| `st-k5-geo-winkelarten` | Winkelarten erkennen | `lb3-winkelarten` | Master „Winkelarten erkennen“, Beispiel: „Um 6 Uhr zeigt der Minutenzeiger genau auf die 12. Welche Winkelart bildet …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39 |
| `st-k5-geo-winkel-erg` | Winkel zu 90° oder 180° ergänzen | `lb3-winkel-ergaenzung` | Master „Winkel zu 90° oder 180° ergänzen“, Beispiel: „Drei Winkel liegen lückenlos nebeneinander um einen Punkt und ergeben zusam …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39 |
| `st-k5-geo-verschiebung` | Verschiebung von Figuren | `lb3-verschiebung` | Master „Verschiebung von Figuren“, Beispiel: „Der Punkt A' = (6/6) ist durch die Verschiebung um den Vektor (4/1) aus dem …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39 |
| `st-k5-geo-achse` | Achsensymmetrie erkennen | `lb3-achsensymmetrie` | Master „Achsensymmetrie erkennen“, Beispiel: „Ist der Großbuchstabe „W“ in der üblichen Druckschrift achsensymmetrisch (b …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39 |
| `st-k5-geo-punkt` | Punktsymmetrie / Punktspiegelung | `lb3-punktsymmetrie` | Master „Punktsymmetrie / Punktspiegelung“, Beispiel: „Ist das Zeichen „B“ in der üblichen Druckschrift punktsymmetrisch (bei 180° …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39 |
| `st-k5-umfang-rechteck` | Umfang von Rechteck und Quadrat | `lb4-umfang-rechteck` | Master „Umfang von Rechteck und Quadrat“, Beispiel: „Ein Rechteck hat den Umfang 52 cm. Eine Seite ist 10 cm lang. Wie lang ist …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Umfang, Flächeninhalt und Volumen“, S. 40 |
| `st-k5-flaeche-rechteck` | Flächeninhalt von Rechteck und Quadrat | `lb4-flaeche-rechteck` | Master „Flächeninhalt von Rechteck und Quadrat“, Beispiel: „Ein Rechteck hat den Flächeninhalt 84 cm². Eine Seite ist 7 cm lang. Wie la …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Umfang, Flächeninhalt und Volumen“, S. 40 |
| `st-k5-volumen-quader` | Volumen von Quader und Würfel | `lb4-volumen-quader` | Master „Volumen von Quader und Würfel“, Beispiel: „Ein Quader hat das Volumen 600 cm³. Die Grundfläche ist 6 cm × 10 cm groß. …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Umfang, Flächeninhalt und Volumen“, S. 40 |
| `st-k5-oberflaeche-quader` | Oberflächeninhalt von Quadern | `lb4-oberflaeche-quader` | Master „Oberflächeninhalt von Quadern“, Beispiel: „Ein Quader hat drei unterschiedlich große Seitenflächen: 60 cm², 60 cm² und …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Umfang, Flächeninhalt und Volumen“, S. 40 |
| `st-k5-flaeche-zus` | Zusammengesetzte Flächen | `lb4-flaeche-zusammengesetzt` | Master „Zusammengesetzte Flächen: Fläche berechnen“, Beispiel: „Eine U-förmige Fläche entsteht aus einem Rechteck 12 m × 10 m, aus dem oben …“ – deckt den Inhalt des Pack-Themas. | nicht explizit in 5/6; „zusammengesetzte Figuren“ erst 3.3 KS „Kreise“ S. 46 (abgeleitet aus S. 40) |
| `st-k5-volumen-zus` | Zusammengesetzte Quader: Volumen | `lb4-volumen-zusammengesetzt` | Master „Zusammengesetzte Quader: Volumen“, Beispiel: „Von einem Quader 9 cm × 10 cm × 6 cm wird ein kleinerer Quader mit der Brei …“ – deckt den Inhalt des Pack-Themas. | nicht explizit in 5/6; „zusammengesetzte Körper“ erst 3.3 KS „Körperberechnung“ S. 47 (abgeleitet aus S. 40) |
| `st-k5-mittelwert` | Arithmetisches Mittel | `lb2-mittelwert` | Master „Arithmetisches Mittel“, Beispiel: „Berechne das arithmetische Mittel dieser Gewichte (in kg): 14,8; 14,6; 5,6; …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Kenngrößen von Daten“, S. 42 |
| `st-k5-sach-preis` | Sachaufgabe: Gesamtpreis | `lb5-gesamtpreis` | Master „Sachaufgabe: Gesamtpreis“, Beispiel: „Im Laden kosten Äpfel je 10 € und Bananen je 8 €. Paul kauft 8 Äpfel und 3 …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Natürliche Zahlen“, S. 36 („Anwendungsaufgaben lösen“); 2.5 S. 30 |
| `st-k5-sach-teilen` | Sachaufgabe: Gerecht aufteilen | `lb5-teilen` | Master „Sachaufgabe: Gerecht aufteilen“, Beispiel: „74 Sticker werden so gerecht wie möglich an 8 Kinder verteilt. Wie viele St …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Natürliche Zahlen“, S. 36 („Anwendungsaufgaben lösen“); 2.5 S. 30 |
| `st-k5-sach-mehr` | Sachaufgabe: Mehrstufige Alltagsrechnung | `lb5-mehrstufig` | Master „Sachaufgabe: Mehrstufige Alltagsrechnung“, Beispiel: „Mia spart 7 Wochen lang jede Woche 8 €. Danach kauft sie sich ein Spiel für …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Natürliche Zahlen“, S. 36 („Anwendungsaufgaben lösen“); 2.5 S. 30 |

### Klasse 6 (vorher 28 spielbar, nachher 29)

| Pack-Thema-ID | Titel | Master-Quellen | Begründung | Lehrplanquelle |
|---|---|---|---|---|
| `st-k6-bruch-kuerzen` | Brüche kürzen | `lb1-kuerzen` | Master „Brüche kürzen“, Beispiel: „Kürze den Bruch 7/14 vollständig. …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38 |
| `st-k6-bruch-erweitern` | Brüche erweitern | `lb1-erweitern` | Master „Brüche erweitern“, Beispiel: „Erweitere den Bruch 4/5 so, dass der Zähler 24 wird. Wie lautet der neue Ne …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38 |
| `st-k6-bruch-vergleichen` | Brüche vergleichen | `lb1-vergleichen` | Master „Brüche vergleichen“, Beispiel: „Vergleiche: 6/7 ___ 1/3 …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38 |
| `st-k6-bruch-add` | Brüche addieren und subtrahieren | `lb1-add-sub-brueche` | Master „Brüche addieren und subtrahieren“, Beispiel: „Berechne: 4/9 + 7/6 …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38 |
| `st-k6-bruch-mul` | Brüche multiplizieren | `lb1-mult-brueche` | Master „Brüche multiplizieren“, Beispiel: „Berechne: 7/12 · 11/5 …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38 |
| `st-k6-bruch-div` | Brüche dividieren | `lb1-div-brueche` | Master „Brüche dividieren“, Beispiel: „Berechne: 3/5 : 9/5 …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38 |
| `st-k6-bruch-dez` | Brüche in Dezimalzahlen umwandeln | `lb1-bruch-dezimal` | Master „Brüche in Dezimalzahlen umwandeln“, Beispiel: „Welcher Dezimalwert entspricht 7/8? …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38 |
| `st-k6-prozent` | In Prozent umwandeln | `lb1-prozent` | Master „In Prozent umwandeln“, Beispiel: „Wie viel Prozent sind 9/10? …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Brüche“, S. 37 („speziellen Brüchen prozentuale Angaben zuordnen“, bequeme Prozentsätze) |
| `st-k6-dez-add` | Dezimalzahlen addieren und subtrahieren | `lb1-dez-add-sub` | Master „Dezimalzahlen addieren und subtrahieren“, Beispiel: „Berechne: 32,1 + 58,8 − 58,1 …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38 |
| `st-k6-dez-mul` | Dezimalzahlen multiplizieren | `lb1-dez-mult` | Master „Dezimalzahlen multiplizieren“, Beispiel: „Berechne: 5,7 · 9,8 …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38 |
| `st-k6-dez-div` | Dezimalzahlen dividieren | `lb1-dez-div` | Master „Dezimalzahlen dividieren“, Beispiel: „Berechne: 235,2 : 6 …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38 |
| `st-k6-dez-runden` | Dezimalzahlen runden | `lb1-runden` | Master „Dezimalzahlen runden“, Beispiel: „Ein Produkt kostet genau 26,844 €. Runde den Preis auf volle Cent (2 Nachko …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38 |
| `st-k6-gleichung-add` | Gleichung umstellen: x + a = b | `k7-lb2-gleichung-add` | Master „Gleichung umstellen: x + a = b“, Beispiel: „Ein Spieler hatte x Punkte. Er bekommt 1 Punkte dazu und hat danach 16 Punk …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Gleichungen und Ungleichungen“, S. 37 (Umkehroperationen) |
| `st-k6-gleichung-mul` | Gleichung umstellen: a · x = b | `k7-lb2-gleichung-mul` | Master „Gleichung umstellen: a · x = b“, Beispiel: „Löse die Gleichung nach x: 1 · x = 12 …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Gleichungen und Ungleichungen“, S. 37 (Gleichungstyp ax = b) |
| `st-k6-gleichung-beid` | Gleichung mit x auf beiden Seiten | — (Outline) | Master k8-lb1-gleichung-beidseitig geht an st-k7-gleichung-beid (LP: 7/8). | NICHT 5/6: ax±b=cx±d ist 3.3 KS „Gleichungen und Ungleichungen“, S. 45 |
| `st-k6-gleichung-probe` | Lineare Gleichung und Probe | — (Outline) | Kein eigener Master (k7-lb2-gleichung-add/-mul sind vergeben). | 3.2 KS „Gleichungen und Ungleichungen“, S. 37 („Probe“, ax+b=c) |
| `st-k6-nebenwinkel` | Nebenwinkel berechnen | `k7-lb1-nebenwinkel` | Master „Nebenwinkel berechnen“, Beispiel: „An einer geraden Straße trifft ein Weg so, dass der eine Winkel zur Straße …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Winkelbeziehungen“, S. 39 (Nebenwinkelsatz) |
| `st-k6-scheitelwinkel` | Scheitel- und Stufenwinkel | `k7-lb1-scheitelwinkel` | Master „Scheitel- und Stufenwinkel“, Beispiel: „Zwei parallele Gehwege werden von einem dritten Weg (Transversale) geschnit …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Winkelbeziehungen“, S. 39 (Scheitel-, Stufenwinkel) |
| `st-k6-wechselwinkel` | Wechselwinkel an Parallelen | — (Outline) | Kein Master für Wechselwinkel (k7-lb1-scheitelwinkel enthält Stufen-/Scheitelwinkel, ist an st-k6-scheitelwinkel vergeben). | 3.2 KS „Winkelbeziehungen“, S. 39 (Wechselwinkelsatz) |
| `st-k6-gestreckter` | Winkel am gestreckten Winkel | — (Outline) | Passender Master lb3-winkel-ergaenzung (90°/180°) geht an st-k5-geo-winkel-erg. | 3.2 KS „Geometrische Grundbegriffe“, S. 39 (gestreckter Winkel) / „Winkelbeziehungen“ |
| `st-k6-winkel-dreieck` | Innenwinkelsatz im Dreieck | `lb3-winkel-dreieck` | Master „Innenwinkelsatz im Dreieck“, Beispiel: „In einem gleichschenkligen Dreieck sind die beiden Basiswinkel gleich groß …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Dreiecke“ S. 40 / „Vierecke“ S. 41 |
| `st-k6-winkel-viereck` | Winkelsumme im Viereck | `lb3-winkel-viereck` | Master „Winkelsumme im Viereck“, Beispiel: „In einem Viereck sind drei Winkel α = 77°, β = 97° und γ = 103° groß. Wie g …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Dreiecke“ S. 40 / „Vierecke“ S. 41 |
| `st-k6-flaeche-dreieck` | Flächeninhalt von Dreiecken | `lb3-flaeche-dreieck` | Master „Flächeninhalt von Dreiecken“, Beispiel: „Ein Dreieck hat den Flächeninhalt 80 cm² und die Grundseite 10 cm. Wie groß …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Dreiecke“ S. 40 / „Vierecke“ S. 41 |
| `st-k6-kongruenz` | Kongruenzsatz wählen | `lb3-kongruenzsatz` | Master „Kongruenzsatz wählen“, Beispiel: „Von einem Dreieck sind zwei Seitenlängen und der Winkel zwischen ihnen beka …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Dreiecke“ S. 40 / „Vierecke“ S. 41 |
| `st-k6-volumen-prisma` | Volumen gerader Prismen | `lb4-volumen-prisma` | lb4-volumen-prisma (Volumen↔Grundfläche/Höhe) – Inhalt passt, im LP aber erst 7/8; Duplikat-Gefahr zu st-k7-volumen-prisma (Abw. 4). | NICHT 5/6: Prismen erst 3.3 KS „Körperberechnung“, S. 47 (5/6: nur Quader, S. 40) |
| `st-k6-wuerfelnetz` | Würfelnetz erkennen | `lb4-wuerfelnetz` | Master „Würfelnetz erkennen“, Beispiel: „Der abgebildete Würfel hat überall gleich lange Kanten. Wie viele Kanten ha …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Umfang, Flächeninhalt und Volumen“, S. 40 (Netze von Quader/Würfel) |
| `st-k6-proportional` | Proportionale Zuordnung (Dreisatz) | `lb2-proportional` | Master „Proportionale Zuordnung (Dreisatz)“, Beispiel: „Ein Auto verbraucht bei gleichmäßiger Fahrt 28 Liter Benzin für 400 km (pro …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Zuordnungen, direkte und indirekte Proportionalität“, S. 41 |
| `st-k6-antiproportional` | Antiproportionale Zuordnung | `lb2-antiproportional` | Master „Antiproportionale Zuordnung“, Beispiel: „6 Maschinen füllen gemeinsam einen Lagerplatz in 24 Stunden. Wie lange brau …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Zuordnungen, direkte und indirekte Proportionalität“, S. 41 |
| `st-k6-dreisatz` | Sachaufgabe: Dreisatz mit Einheiten | `lb2-sachaufgabe-dreisatz` | Master „Sachaufgabe: Dreisatz mit Einheiten“, Beispiel: „250 Blätter Kopierpapier wiegen 200 g. Wie viel wiegen 1000 Blätter (gleich …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Zuordnungen, direkte und indirekte Proportionalität“, S. 41 |
| `st-k6-anteil` | Anteil einer Größe berechnen | `lb5-anteil-groesse` | Master „Anteil einer Größe berechnen“, Beispiel: „Ein Wassertank ist zu 4/5 gefüllt, das sind 36 Liter. Wie viel Wasser passt …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Brüche“, S. 37 („Anteile von Zahlen und Größen ermitteln“) |
| `st-k6-anteil-prozent` | Prozent einer Größe berechnen | — (Outline) (vorher: `lb5-anteil-prozent`) | Master lb5-anteil-prozent geht an st-k7-prozent (Konflikt); Prozentwert ist 7/8. | NICHT 5/6: Prozentwert ermitteln ist 3.3 KS „Prozentrechnung“, S. 44 |
| `st-k6-haeufigkeit` | Relative Häufigkeit in Prozent | `lb2-haeufigkeit` | Master „Relative Häufigkeit in Prozent“, Beispiel: „Bei einer Umfrage an einer Schule wurden 80 Kinder gefragt. 71 davon gaben …“ – deckt den Inhalt des Pack-Themas. | NICHT 5/6: relative Häufigkeit ist 3.3 KS „Zufällige Ereignisse, Häufigkeiten …“, S. 49 (5/6: Strichliste, Häufigkeitstabelle, S. 42) |
| `st-k6-mittelwert` | Arithmetisches Mittel | `k7-lb4-mittelwert` **[geändert]** | Kenngrößen stehen im LP in 5/6; k7-lb4-mittelwert (Master-Klasse 7) inhaltlich passend (Zulässig: LP platziert den Inhalt in 5/6). Vorher Outline; K7-Doppelthema entfällt (Abw. 5). | 3.2 KS „Kenngrößen von Daten“, S. 42 (arithmetisches Mittel) |
| `st-k6-median` | Median (Zentralwert) | `k7-lb4-median` **[geändert]** | wie st-k6-mittelwert; Median ist 5/6-Inhalt (S. 42). Vorher Outline. | 3.2 KS „Kenngrößen von Daten“, S. 42 (Modalwert, Median, Spannweite) |

### Klasse 7 (vorher 26 spielbar, nachher 23)

| Pack-Thema-ID | Titel | Master-Quellen | Begründung | Lehrplanquelle |
|---|---|---|---|---|
| `st-k7-prozent` | Prozent einer Größe berechnen | `lb5-anteil-prozent` | Master lb5-anteil-prozent (Beispiele: „25 % von 200 l“, „40 kg sind wie viel Prozent“, Rabatt) deckt Prozentwert/Prozentsatz. Konflikt mit st-k6-anteil-prozent zugunsten K7 aufgelöst (unverändert). | 3.3 KS „Prozentrechnung“, S. 44 („Prozentwerte, Grundwerte und Prozentsätze ermitteln“) |
| `st-k7-zinsen` | Jahreszinsen berechnen | `k10-lb1-zinsen` | Zinsrechnung ist 7/8-Inhalt; Master liegt in Klasse 10 (k10-lb1-zinsen: Kapital, Prozentsatz, Jahreszinsen). K7 gewinnt gegen st-k10-zinsen (Konflikt, unverändert). | 3.3 KS „Prozentrechnung“, S. 44 („einschließlich Zinsrechnung“; Kapital, Zinsen, Zinssatz) |
| `st-k7-zinseszins` | Zinseszins: Endkapital | `k10-lb1-zinseszins` | Zinseszins im LP 7/8 genannt; Master in Klasse 10. K7 gewinnt gegen st-k10-zinseszins (Konflikt, unverändert). | 3.3 KS „Prozentrechnung“, S. 44 (Wissensbestand „Zinseszins“) |
| `st-k7-preisaenderung` | Prozentuale Zunahme | `k10-lb1-prozentuale-zunahme` | k10-lb1-prozentuale-zunahme (Beispiel: Preis −50 % Rabatt) = Steigerung/Senkung um Prozent, LP 7/8. K7 gewinnt gegen st-k10-zunahme (Konflikt, unverändert). | 3.3 KS „Prozentrechnung“, S. 44 („Steigerung bzw. Senkung um bzw. auf“, Rabatt) |
| `st-k7-rat-add` | Rationale Zahlen addieren | `k7-lb2-add-rational` | Master „Rationale Zahlen addieren“, Beispiel: „Die Temperatur beträgt 1 °C. Sie steigt um 15 °C. Wie viele Grad Celsius si …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Rationale Zahlen und Wurzeln“, S. 44 |
| `st-k7-rat-sub` | Rationale Zahlen subtrahieren | `k7-lb2-sub-rational` | Master „Rationale Zahlen subtrahieren“, Beispiel: „Ein Konto hat einen Stand von 2 €. Es werden 30 € abgehoben. Wie hoch ist d …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Rationale Zahlen und Wurzeln“, S. 44 |
| `st-k7-rat-mul` | Rationale Zahlen multiplizieren | `k7-lb2-mul-rational` | Master „Rationale Zahlen multiplizieren“, Beispiel: „Du zahlst 5-mal Schulden von je 15 € (als negative Zahl: (−15) €). Wie hoch …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Rationale Zahlen und Wurzeln“, S. 44 |
| `st-k7-rat-div` | Rationale Zahlen dividieren | `k7-lb2-div-rational` | Master „Rationale Zahlen dividieren“, Beispiel: „Schulden in Höhe von (−75) € werden gleichmäßig auf 5 Personen aufgeteilt. …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Rationale Zahlen und Wurzeln“, S. 44 |
| `st-k7-betrag` | Betrag einer Zahl | `k7-lb2-betrag` | Master „Betrag einer Zahl“, Beispiel: „Ein Thermostat soll 1 °C einstellen, gemessen werden 16 °C. Wie groß ist di …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Rationale Zahlen und Wurzeln“, S. 44 (Betrag) |
| `st-k7-wurzeln` | Wurzeln und Näherungswerte | — (Outline) | Kein Master für Wurzeln/Näherungswerte vorhanden. | 3.3 KS „Rationale Zahlen und Wurzeln“, S. 44 (Radizieren, Näherungswerte) |
| `st-k7-gleichung` | Lineare Gleichung a·x + b = c | `k8-lb1-gleichung-linear` | Master „Lineare Gleichung a·x + b = c“, Beispiel: „Denke an eine Zahl x. Multipliziere sie mit 1 und addiere 15. Das Ergebnis …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Gleichungen und Ungleichungen“, S. 45 |
| `st-k7-gleichung-beid` | Gleichung mit x auf beiden Seiten | `k8-lb1-gleichung-beidseitig` | Master „Gleichung mit x auf beiden Seiten“, Beispiel: „Für welchen Wert von x sind die Terme 8·x + 6 und (−4)·x + 30 gleich groß? …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Gleichungen und Ungleichungen“, S. 45 |
| `st-k7-gleichung-klammer` | Gleichung mit Klammern vorbereiten | — (Outline) | Kein eigener Master (k8-lb1-ausmultiplizieren ist an st-k7-ausmult vergeben). | 3.3 KS „Gleichungen und Ungleichungen“, S. 45 (Gleichungen mit Klammern) |
| `st-k7-ungleichung` | Einfache lineare Ungleichung (Idee) | — (Outline) | Kein Master für lineare Ungleichungen vorhanden. | 3.3 KS „Gleichungen und Ungleichungen“, S. 45 |
| `st-k7-term` | Term mit Rechengesetzen auswerten | `k7-lb2-term-vorrang` | Master „Term mit Rechengesetzen auswerten“, Beispiel: „Berechne: (1 + 9) · 9 …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Rationale Zahlen und Wurzeln“, S. 44 („Rechenausdrücke … berechnen“, Rechengesetze) |
| `st-k7-term-auswerten` | Term auswerten (x einsetzen) | `k8-lb1-term-auswerten` | Master „Term auswerten (x einsetzen)“, Beispiel: „Ein Tarif kostet eine Grundgebühr von 15 € und 5 € pro Online-Minute x. Wie …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Arbeiten mit Variablen“, S. 45 |
| `st-k7-zusammenfassen` | Terme zusammenfassen | `k8-lb1-zusammenfassen` | Master „Terme zusammenfassen (Zahl vor x)“, Beispiel: „Paket A hat den Term 1x + 9, Paket B hat den Term 9x + (−4). Fasse A + B zu …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Arbeiten mit Variablen“, S. 45 |
| `st-k7-ausmult` | Klammer ausmultiplizieren | `k8-lb1-ausmultiplizieren` | Master „Klammer ausmultiplizieren (Wert bei x)“, Beispiel: „Eine Werkstatt berechnet die Materialkosten mit 6·(6x + (−4)), wobei x die …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Arbeiten mit Variablen“, S. 45 |
| `st-k7-volumen-prisma` | Volumen gerader Prismen | `k7-lb3-volumen-prisma` | Master „Volumen gerader Prismen“, Beispiel: „Ein gerader Wassertank hat die Form eines Prismas. Er fasst 420 cm³ und ist …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Körperberechnung“, S. 47 |
| `st-k7-mantel-prisma` | Mantelfläche eines Prismas | `k7-lb3-mantel-prisma` | Master „Mantelfläche eines Prismas“, Beispiel: „Ein Prisma hat die Mantelfläche M = 270 cm² und die Höhe 9 cm. Welchen Umfa …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Körperberechnung“, S. 47 |
| `st-k7-volumen-pyramide` | Volumen einer Pyramide | `k7-lb3-volumen-pyramide` | Master „Volumen einer Pyramide“, Beispiel: „Eine Pyramide hat dieselbe Grundfläche und Höhe wie ein Prisma mit dem Volu …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Körperberechnung“, S. 47 |
| `st-k7-oberflaeche-quader` | Oberfläche eines Quaders | `k7-lb3-oberflaeche-quader` | Master „Oberfläche eines Quaders“, Beispiel: „Eine Geschenkbox in Quaderform ist 10 cm lang, 16 cm breit und 16 cm hoch. …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Körperberechnung“, S. 47 |
| `st-k7-oberflaeche-pyramide` | Oberfläche einer Pyramide | `k7-lb3-oberflaeche-pyramide` | Master „Oberfläche einer Pyramide“, Beispiel: „Eine quadratische Pyramide hat die Grundkante a = 8 cm und die Oberfläche O …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Körperberechnung“, S. 47 |
| `st-k7-winkelsumme` | Innenwinkelsumme im Vieleck | `k7-lb1-winkelsumme-vieleck` | Master „Innenwinkelsumme im Vieleck“, Beispiel: „Die Innenwinkelsumme eines Vielecks beträgt 1080°. Wie viele Ecken (n) hat …“ – deckt den Inhalt des Pack-Themas. | Innenwinkelsatz nur für Dreieck/Viereck (3.2 S. 40–41); Vieleck nicht explizit |
| `st-k7-basiswinkel` | Basiswinkel im gleichschenkligen Dreieck | `k7-lb1-basiswinkel` | Master „Basiswinkel im gleichschenkligen Dreieck“, Beispiel: „In einem gleichschenkligen Dreieck sind beide Basiswinkel gleich groß und b …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Dreiecke“, S. 40 (Dreiecksarten, Seiten-Winkel-Beziehung) – gehört zu 5/6 |
| `st-k7-mittelsenkrechte` | Mittelsenkrechte: Konstruktionsschritte | `k7-lb1-mittelsenkrechte-schritte` | Master „Mittelsenkrechte: Konstruktionsschritte“, Beispiel: „Ordne die Konstruktionsschritte der Mittelsenkrechten von AB in der richtig …“ – deckt den Inhalt des Pack-Themas. | 3.2 KS „Dreiecke“, S. 40 („Mittelsenkrechte … konstruieren“) – gehört zu 5/6 |
| `st-k7-mittelwert` | Arithmetisches Mittel | — (Outline) (vorher: `k7-lb4-mittelwert`) | Master k7-lb4-mittelwert geht an st-k6-mittelwert (LP: 5/6); in 7/8 kein Kenngrößen-KS. | NICHT 7/8: Kenngrößen 3.2 KS „Kenngrößen von Daten“, S. 42; 3.4 KS „Häufigkeitsverteilungen“, S. 52 |
| `st-k7-median` | Median (Zentralwert) | — (Outline) (vorher: `k7-lb4-median`) | Master k7-lb4-median geht an st-k6-median (LP: 5/6). | NICHT 7/8: Kenngrößen 3.2 S. 42; 3.4 S. 52 |
| `st-k7-spannweite` | Spannweite berechnen | — (Outline) (vorher: `k7-lb4-spannweite`) | Master k7-lb4-spannweite geht an st-k9-spannweite (Konflikt); LP 5/6 und 9, nicht 7/8. | NICHT 7/8: Spannweite 3.2 S. 42 und 3.4 KS „Häufigkeitsverteilungen“, S. 52 |

### Klasse 8 (vorher 18 spielbar, nachher 19)

| Pack-Thema-ID | Titel | Master-Quellen | Begründung | Lehrplanquelle |
|---|---|---|---|---|
| `st-k8-kreis-umfang` | Umfang eines Kreises | `k9-lb2-kreis-umfang` | Master k9-lb2-kreis-umfang (Umfang→Radius, π≈3,14159); LP platziert Kreise in 7/8, Master aus Klasse 9 zulässig. | 3.3 KS „Kreise“, S. 46 (Umfang, Flächeninhalt, Radius, Durchmesser) |
| `st-k8-kreis-flaeche` | Flächeninhalt eines Kreises | `k9-lb2-kreis-flaeche` | LP: Kreise in 7/8 (S. 46); Master aus Klasse 9 zulässig. | 3.3 KS „Kreise“, S. 46 |
| `st-k8-zylinder` | Volumen eines Kreiszylinders | `k9-lb2-zylinder-volumen` | LP: Kreiszylinder in 7/8 Körperberechnung; Master aus Klasse 9 zulässig. | 3.3 KS „Körperberechnung“, S. 47 (Kreiszylinder) |
| `st-k8-kugel` | Volumen einer Kugel | `k9-lb2-kugel-volumen` | LP: Kugel in 7/8 Körperberechnung; Master aus Klasse 9 zulässig. | 3.3 KS „Körperberechnung“, S. 47 (Kugel) |
| `st-k8-streckfaktor` | Streckfaktor bestimmen | `k8-lb4-streckfaktor` | Master „Streckfaktor bestimmen“, Beispiel: „Ein Modellauto ist eine verkleinerte Nachbildung. Das Original ist 100 cm l …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Ähnlichkeit“, S. 47 |
| `st-k8-strahlensatz` | Strahlensatz: fehlende Länge | `k8-lb4-strahlensatz` | Master „Strahlensatz: fehlende Länge“, Beispiel: „Ein 2 m hoher Stab wirft einen 5 m langen Schatten. Zur gleichen Zeit wirft …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Ähnlichkeit“, S. 47 |
| `st-k8-aehnlich` | Ähnliche Figuren: Seitenlänge | `k8-lb4-aehnliche-seite` | Master „Ähnliche Figuren: Seitenlänge“, Beispiel: „Zwei Rechtecke sind ähnlich mit dem Ähnlichkeitsfaktor k = 0,25. Eine Seite …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Ähnlichkeit“, S. 47 |
| `st-k8-pythagoras-hyp` | Satz des Pythagoras: Hypotenuse | `k9-lb3-pythagoras-hypotenuse` | LP: Pythagoras in 7/8; Master k9-lb3-pythagoras-hypotenuse aus Klasse 9 zulässig. Nur hier genutzt (st-k9-pythagoras-hyp bleibt Outline). | 3.3 KS „Satzgruppe des Pythagoras“, S. 47 |
| `st-k8-pythagoras-kat` | Satz des Pythagoras: fehlende Kathete | `k9-lb3-pythagoras-kathete` | wie oben, Kathete. | 3.3 KS „Satzgruppe des Pythagoras“, S. 47 |
| `st-k8-leiter` | Pythagoras im Sachkontext | `k9-lb5-leiter` | Master k9-lb5-leiter (Entfernung Ost/Nord via Pythagoras) – Sachkontext zu 7/8-Pythagoras. | 3.3 KS „Satzgruppe des Pythagoras“, S. 47 („Anwendungsaufgaben“) |
| `st-k8-funktionswert` | Funktionswert einer linearen Funktion | `k8-lb3-funktionswert` | Master „Funktionswert einer linearen Funktion“, Beispiel: „Ein Fahrradverleih berechnet die Kosten mit f(x) = 4·x + 10, wobei x die An …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Lineare Funktionen“, S. 48 |
| `st-k8-steigung` | Steigung aus zwei Punkten | `k8-lb3-steigung` | Master „Steigung aus zwei Punkten“, Beispiel: „Ein Wanderweg liegt bei km 2 auf 128 m Höhe und bei km 10 auf 168 m Höhe. B …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Lineare Funktionen“, S. 48 |
| `st-k8-achsen` | y-Achsenabschnitt bestimmen | `k8-lb3-achsenabschnitt` | Master „y-Achsenabschnitt bestimmen“, Beispiel: „Ein Sparplan ändert sich um 1 € pro Monat und erreicht nach x = 12 Monaten …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Lineare Funktionen“, S. 48 |
| `st-k8-lgs` | Lineares Gleichungssystem (x bestimmen) | `k8-lb3-lgs` | k8-lb3-lgs (Sachaufgabe 2×2: Erwachsenen-/Kinderkarten) passt zum Titel; LP-Platzierung unsicher (Abw. 8). | LGS-Verfahren erst 3.5 KS „Vektoren“, S. 55; in 7/8 nur „Schnittpunkte von Graphen linearer Funktionen“, S. 48 |
| `st-k8-laplace` | Laplace-Wahrscheinlichkeit als Bruch | `k8-lb2-laplace-bruch` | Master „Laplace-Wahrscheinlichkeit als Bruch“, Beispiel: „Ein Stapel enthält 5 rote, 8 gelbe und 8 blaue Karten. Du ziehst verdeckt e …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Zufällige Ereignisse …“, S. 49 (LAPLACE-Versuch) |
| `st-k8-laplace-pct` | Laplace-Wahrscheinlichkeit in Prozent | `k8-lb2-laplace-prozent` | Master „Laplace-Wahrscheinlichkeit in Prozent“, Beispiel: „Ein Glücksrad hat 8 gleich große Felder, davon sind 7 mit einem Gewinnsymbo …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Zufällige Ereignisse …“, S. 49 |
| `st-k8-gegen` | Gegenwahrscheinlichkeit | `k8-lb2-gegenwahrscheinlichkeit` | Master „Gegenwahrscheinlichkeit“, Beispiel: „Laut Wetterbericht beträgt die Regenwahrscheinlichkeit für morgen 45 %. Wie …“ – deckt den Inhalt des Pack-Themas. | 3.3 KS „Zufällige Ereignisse …“, S. 49 (P(A)+P(Ā)=1) |
| `st-k8-mehrstufig` | Mehrstufige Zufallsversuche / Pfadregeln | — (Outline) | Kein Master für Baumdiagramm/Pfadregeln vorhanden. | 3.3 KS „Mehrstufige Zufallsversuche und Wahrscheinlichkeiten“, S. 49 (Baumdiagramm, Pfadregeln) |
| `st-k8-zahlenraetsel` | Zahlenrätsel (Gleichung aufstellen) | `k8-lb5-zahlenraetsel` | Master „Zahlenrätsel (Gleichung aufstellen)“, Beispiel: „Bei einer Rätselrunde denkt sich jemand eine Zahl aus, multipliziert sie mi …“ – deckt den Inhalt des Pack-Themas. | 2.5 Aufgabenpraktikum S. 30; 3.2 KS „Gleichungen und Ungleichungen“ S. 37 (Sachverhalte als Gleichung) |
| `st-k8-rueckwaerts` | Rückwärtsrechnen | `k8-lb5-rueckwaerts` **[geändert]** | NEU gemappt: Master k8-lb5-rueckwaerts („Zahl wird ×4, −15 → 65, ursprüngliche Zahl?“) = Rückwärtsrechnen via Umkehroperation; bisher Outline. | 3.2 KS „Natürliche Zahlen“ S. 36 / „Gleichungen“ S. 37 (Umkehroperationen); 2.5 S. 30 |
| `st-k8-probieren` | Systematisches Probieren | — (Outline) | Kein Master für systematisches Probieren vorhanden. | 3.3 KS „Gleichungen und Ungleichungen“, S. 45 („… durch Probieren“); 2.5 S. 30 |
| `st-k8-skizze` | Skizze und Hilfsfigur | — (Outline) | Kein Master für Skizze/Hilfsfigur vorhanden. | 2.5 Aufgabenpraktikum, S. 30 („ggf. unter Nutzung von Skizzen, Tabellen“) |

### Klasse 9 (vorher 12 spielbar, nachher 12)

| Pack-Thema-ID | Titel | Master-Quellen | Begründung | Lehrplanquelle |
|---|---|---|---|---|
| `st-k9-potenz-prod` | Potenzgesetz: Produkt gleicher Basis | `k9-lb1-potenz-produkt` | Master „Potenzgesetz: Produkt gleicher Basis“, Beispiel: „Berechne 3^3 · 3^2 als Zahl. …“ – deckt den Inhalt des Pack-Themas. | 3.4 (Jg. 9) KS „Potenzen und Logarithmen“, S. 51 |
| `st-k9-potenz-quot` | Potenzgesetz: Quotient und Potenz einer Potenz | `k9-lb1-potenz-quotient` | Master „Potenzgesetz: Quotient und Potenz einer Potenz“, Beispiel: „Berechne (3^2)^1 als Zahl. …“ – deckt den Inhalt des Pack-Themas. | 3.4 (Jg. 9) KS „Potenzen und Logarithmen“, S. 51 |
| `st-k9-logarithmen` | Logarithmen und Logarithmusgleichungen | — (Outline) | Kein Master für Logarithmen vorhanden. | 3.4 KS „Potenzen und Logarithmen“, S. 51 |
| `st-k9-trig` | Werte von Sinus, Kosinus, Tangens | `k9-lb3-trig-wert` | Master „Werte von Sinus, Kosinus, Tangens“, Beispiel: „In einem rechtwinkligen Dreieck sind die Katheten a = 14 cm (Gegenkathete v …“ – deckt den Inhalt des Pack-Themas. | 3.4 KS „Trigonometrie“, S. 51 |
| `st-k9-pythagoras-hyp` | Satz des Pythagoras: Hypotenuse | — (Outline) | Master k9-lb3-pythagoras-hypotenuse geht an st-k8-pythagoras-hyp (LP: 7/8). | NICHT 9: Pythagoras ist 3.3 KS „Satzgruppe des Pythagoras“, S. 47 |
| `st-k9-pythagoras-kat` | Satz des Pythagoras: fehlende Kathete | — (Outline) | Master k9-lb3-pythagoras-kathete geht an st-k8-pythagoras-kat (LP: 7/8). | NICHT 9: Pythagoras ist 3.3 S. 47 |
| `st-k9-quadrat-wert` | Wert einer quadratischen Funktion | `k9-lb1-quadrat-wert` | Master „Wert einer quadratischen Funktion“, Beispiel: „Gegeben ist f(x) = (x − 5)·(x + 2). Berechne f(1). …“ – deckt den Inhalt des Pack-Themas. | 3.4 KS „Quadratische Gleichungen und quadratische Funktionen“, S. 52 |
| `st-k9-scheitel` | Scheitelpunkt aus der Scheitelform | `k9-lb1-scheitel` | Master „Scheitelpunkt aus der Scheitelform“, Beispiel: „Die Parabel f(x) = (x − 8)² + 10 liegt in Scheitelform vor. Gib die y-Koord …“ – deckt den Inhalt des Pack-Themas. | 3.4 KS „Quadratische Gleichungen und quadratische Funktionen“, S. 52 |
| `st-k9-reinquadratisch` | Reinquadratische Gleichung x² = a | `k10-lb4-reinquadratisch` | Master k10-lb4-reinquadratisch (4x²=400); LP: Spezialfälle der Normalform in Jg. 9 (zulässig). | 3.4 KS „Quadratische Gleichungen …“, S. 52 (Normalform und Spezialfälle) |
| `st-k9-gleichung` | Quadratische Gleichung (größere Lösung) | `k10-lb4-quadratische-gleichung` | Master k10-lb4-quadratische-gleichung (Master-Klasse 10, fragt „kleinere Lösung“ statt „größere“); LP platziert quadratische Gleichungen in Jg. 9 (zulässig). | 3.4 KS „Quadratische Gleichungen …“, S. 52 (Lösungsformel, Lösbarkeitsfälle) |
| `st-k9-parabel` | Funktionswert einer Parabel | `k10-lb4-parabel-wert` | Master k10-lb4-parabel-wert (f(x)=x²+c auswerten); quadratische Funktionen sind Jg. 9 (zulässig). | 3.4 KS „Quadratische Gleichungen und quadratische Funktionen“, S. 52 |
| `st-k9-mittelwert` | Arithmetisches Mittel | `k9-lb4-mittelwert` | Master „Arithmetisches Mittel“, Beispiel: „5 Messwerte sollen im Mittel 28 ergeben. 4 Werte sind bekannt: 40, 39, 12, …“ – deckt den Inhalt des Pack-Themas. | 3.4 KS „Häufigkeitsverteilungen“, S. 52 |
| `st-k9-median` | Median (Zentralwert) | `k9-lb4-median` | Master „Median (Zentralwert)“, Beispiel: „Bestimme den Median von 59, 17, 37, 44, 26, 60. …“ – deckt den Inhalt des Pack-Themas. | 3.4 KS „Häufigkeitsverteilungen“, S. 52 |
| `st-k9-modal` | Modalwert (häufigster Wert) | `k9-lb4-modalwert` | Master „Modalwert (häufigster Wert)“, Beispiel: „In einer Klassenarbeit wurden folgende Noten vergeben: Note 1: 5×, Note 2: …“ – deckt den Inhalt des Pack-Themas. | 3.4 KS „Häufigkeitsverteilungen“, S. 52 |
| `st-k9-spannweite` | Spannweite berechnen | `k7-lb4-spannweite` | k7-lb4-spannweite (Master-Klasse 7); LP nennt Spannweite in 5/6 und in Jg. 9 als Streumaß (S. 52). K9 behält sie, K7-Thema entfällt (Konflikt, unverändert). | 3.4 KS „Häufigkeitsverteilungen“, S. 52 |
| `st-k9-boxplot` | Histogramm und Boxplot | — (Outline) | Kein Master für Histogramm/Boxplot vorhanden. | 3.4 KS „Häufigkeitsverteilungen“, S. 52 (Histogramm, Boxplot) |

### Klasse 10 (Einführungsphase) (vorher 12 spielbar, nachher 10)

| Pack-Thema-ID | Titel | Master-Quellen | Begründung | Lehrplanquelle |
|---|---|---|---|---|
| `st-k10-exp` | Exponentielles Wachstum | `k10-lb1-exp-wachstum` | Master „Exponentielles Wachstum“, Beispiel: „Eine Substanz mit anfänglich 448 mg verringert sich durch Abbau in jedem Ze …“ – deckt den Inhalt des Pack-Themas. | 3.5 KS „Funktionsklassen“, S. 54 („exponentielle Wachstums- und Zerfallsprozesse … modellieren“) |
| `st-k10-zunahme` | Prozentuale Zunahme | — (Outline) (vorher: `k10-lb1-prozentuale-zunahme`) | Master k10-lb1-prozentuale-zunahme geht an st-k7-preisaenderung (Konflikt). | NICHT 10: Steigerung/Senkung ist 3.3 KS „Prozentrechnung“, S. 44 |
| `st-k10-zinsen` | Jahreszinsen berechnen | — (Outline) (vorher: `k10-lb1-zinsen`) | Master k10-lb1-zinsen geht an st-k7-zinsen (Konflikt); Zinsrechnung ist 7/8. | NICHT 10: Zinsrechnung ist 3.3 KS „Prozentrechnung“, S. 44 |
| `st-k10-zinseszins` | Zinseszins: Endkapital | — (Outline) (vorher: `k10-lb1-zinseszins`) | Master k10-lb1-zinseszins geht an st-k7-zinseszins (Konflikt). | NICHT 10: Zinseszins ist 3.3 S. 44 (in 10 höchstens als Wachstumsbeispiel, S. 54) |
| `st-k10-kapital` | Kapital aus Zinsen bestimmen | `k10-lb5-kapital` | Master „Kapital aus Zinsen bestimmen“, Beispiel: „Bei einem Zinssatz von 10 % pro Jahr wurden nach 5 Jahren insgesamt 1.100 € …“ – deckt den Inhalt des Pack-Themas. | NICHT 10 (eigentlich 3.3 KS „Prozentrechnung“, S. 44: Kapital, Zinsen, Zinssatz) |
| `st-k10-zinssatz` | Zinssatz bestimmen | `k10-lb5-zinssatz` | Master „Zinssatz bestimmen“, Beispiel: „Für ein Kapital von 2.200 € wurden nach 5 Jahren insgesamt 1.100 € Zinsen g …“ – deckt den Inhalt des Pack-Themas. | NICHT 10 (eigentlich 3.3 KS „Prozentrechnung“, S. 44) |
| `st-k10-funk-sin` | Sinus- und Kosinusfunktionen (Funktionsklassen) | — (Outline) | Kein Master für Sinus-/Kosinusfunktionen vorhanden. | 3.5 KS „Funktionsklassen“, S. 54 (Sinus-/Kosinusfunktion, Periodizität) |
| `st-k10-vektor-skalar` | Skalarprodukt zweier Vektoren | `k1112-lb2-skalarprodukt` | LP führt Skalarprodukt in Jg. 10 ein (S. 55); Master (k1112-…) liegt in 11/12 (zulässig). K10 gewinnt gegen st-k1112-skalar (Konflikt, unverändert). | 3.5 KS „Vektoren“, S. 55 (Skalarprodukt, Orthogonalität) |
| `st-k10-vektor-betrag` | Betrag eines Vektors | `k1112-lb2-betrag-vektor` | LP führt Betrag eines Vektors in Jg. 10 ein (S. 55); K10 gewinnt gegen st-k1112-betrag (Konflikt, unverändert). | 3.5 KS „Vektoren“, S. 55 (Betrag eines Vektors) |
| `st-k10-lgs3` | Lineare Gleichungssysteme mit drei Variablen | — (Outline) | Einziger LGS-Master k8-lb3-lgs ist 2×2 (st-k8-lgs); 3 Variablen fehlen. | 3.5 KS „Vektoren“, S. 55 („LGS mit drei Variablen lösen“) |
| `st-k10-erwartung` | Erwartungswert eines Glücksrads | `k10-lb2-erwartungswert` | Master „Erwartungswert eines Glücksrads“, Beispiel: „Bei einem Glücksspiel gewinnt man mit 45 % Wahrscheinlichkeit 25 €, mit 35 …“ – deckt den Inhalt des Pack-Themas. | 3.5 KS „Zufallsgrößen“, S. 56 (Erwartungswert) |
| `st-k10-erwartung-wuerfel` | Erwartungswert beim Würfel | `k10-lb2-erwartungswert-wuerfel` | Master „Erwartungswert beim Würfel“, Beispiel: „Bei einem Würfelspiel gewinnt man bei einer geraden Augenzahl 11 € und bei …“ – deckt den Inhalt des Pack-Themas. | 3.5 KS „Zufallsgrößen“, S. 56 (Erwartungswert) |
| `st-k10-varianz` | Varianz einer Zufallsgröße | — (Outline) | Kein Master für Varianz/Standardabweichung vorhanden. | 3.5 KS „Zufallsgrößen“, S. 56 (Varianz, Standardabweichung) |
| `st-k10-laplace` | Laplace-Wahrscheinlichkeit als Bruch | — (Outline) | Passender Master k8-lb2-laplace-bruch geht an st-k8-laplace (LP: 7/8); in Jg. 10 kein LAPLACE-Schwerpunkt. | NICHT 10: LAPLACE ist 3.3 KS „Zufällige Ereignisse …“, S. 49 |
| `st-k10-rechteck` | Rechteck: Breite aus Fläche | `k10-lb3-rechteck-breite` | Master „Rechteck: Breite aus Fläche“, Beispiel: „Ein Rechteck hat den Flächeninhalt 240 cm² und die Breite b = 20 cm. Berech …“ – deckt den Inhalt des Pack-Themas. | kein KS in Jg. 10; Anwendung von Gleichungen: 3.3 S. 45 / 3.4 S. 52 |
| `st-k10-quadrat-seite` | Quadrat: Seitenlänge aus Fläche | `k10-lb3-quadrat-seite` | Master „Quadrat: Seitenlänge aus Fläche“, Beispiel: „Ein Quadrat hat den Flächeninhalt 196 cm². Berechne seinen Umfang. …“ – deckt den Inhalt des Pack-Themas. | kein KS in Jg. 10; quadratische Gleichung (Anwendung) 3.4 S. 52 |
| `st-k10-rechteck-umfang` | Rechteck: Breite aus Umfang | `k10-lb3-rechteck-umfang` **[geändert]** | NEU gemappt: Master k10-lb3-rechteck-umfang (Breite aus Umfang) deckt Titel und Inhalt exakt; bisher Outline. Curriculum-Abweichung der Gruppe siehe Abw. 13. | kein KS in Jg. 10; Formeln/Gleichungen umstellen 3.3 S. 45 |
| `st-k10-sinussatz` | Sinussatz: Seite berechnen | — (Outline) | Kein Master für Sinussatz (k9-lb3-trig-wert = Sinus/Kosinus/Tangens im rechtwinkligen Dreieck). | NICHT 10: Sinussatz ist 3.4 KS „Trigonometrie“, S. 51 |

### Jahrgangsstufen 11/12 (grundlegendes Anforderungsniveau) (vorher 7 spielbar, nachher 5)

| Pack-Thema-ID | Titel | Master-Quellen | Begründung | Lehrplanquelle |
|---|---|---|---|---|
| `st-k1112-ableitung` | Ableitung eines Polynoms an einer Stelle | `k1112-lb1-ableitung-stelle` | Master „Ableitung eines Polynoms an einer Stelle“, Beispiel: „Gegeben ist f(x) = x² − 4x + 3. Bestimme die x-Koordinate der Extremstelle …“ – deckt den Inhalt des Pack-Themas. | 3.6.1 KS „Grundlagen der Infinitesimalrechnung“, S. 59 (Ableitung an einer Stelle) / „Differentialrechnung“ S. 60 |
| `st-k1112-differential` | Differentialrechnung: Änderungsrate und Tangente | — (Outline) | Einziger passender Master k1112-lb1-ableitung-stelle geht an st-k1112-ableitung (bessere Passung). | 3.6.1 KS „Grundlagen der Infinitesimalrechnung“, S. 59 (Differenzenquotient, Tangentenanstieg) |
| `st-k1112-nullstelle` | Nullstelle einer linearen Funktion | `k1112-lb1-nullstelle-linear` | k1112-lb1-nullstelle-linear (f(x)=6x+n, Nullstelle x₀=6) – Inhalt 7/8; keine Dublette, aber falsche Stufe (Abw. 17). | nur Teil der Funktionsuntersuchung (3.6.1 S. 60); lineare Nullstelle ist 3.3 KS „Lineare Funktionen“, S. 48 |
| `st-k1112-integral` | Bestimmtes Integral eines Polynoms | `k1112-lb1-bestimmtes-integral` | Master „Bestimmtes Integral eines Polynoms“, Beispiel: „Berechne das bestimmte Integral ∫₀^6 6x dx. …“ – deckt den Inhalt des Pack-Themas. | 3.6.1 KS „Integralrechnung“, S. 61 (bestimmtes Integral, Hauptsatz) |
| `st-k1112-skalar` | Skalarprodukt zweier Vektoren | — (Outline) (vorher: `k1112-lb2-skalarprodukt`) | Master k1112-lb2-skalarprodukt geht an st-k10-vektor-skalar (Konflikt); LP: Jg. 10. | NICHT 11/12 gA: Skalarprodukt ist 3.5 KS „Vektoren“, S. 55 |
| `st-k1112-betrag` | Betrag eines Vektors | — (Outline) (vorher: `k1112-lb2-betrag-vektor`) | Master k1112-lb2-betrag-vektor geht an st-k10-vektor-betrag (Konflikt); LP: Jg. 10. | NICHT 11/12 gA: Betrag eines Vektors ist 3.5 S. 55 |
| `st-k1112-kreise-ag` | Kreise in der analytischen Geometrie | — (Outline) | Kein Master für Kreisgleichungen vorhanden. | 3.6.1 KS „Kreise“, S. 62 |
| `st-k1112-binomial` | Binomialverteilung: P(X = k) | `k1112-lb3-binomialverteilung` | Master „Binomialverteilung: P(X = k)“, Beispiel: „Eine Zufallsgröße ist binomialverteilt mit n = 5 und p = 0,5. Berechne die …“ – deckt den Inhalt des Pack-Themas. | 3.6.1 KS „Binomialverteilung“, S. 63 |
| `st-k1112-erwartung-binom` | Erwartungswert der Binomialverteilung | `k1112-lb3-erwartungswert-binom` | Master „Erwartungswert der Binomialverteilung“, Beispiel: „Eine binomialverteilte Zufallsgröße hat die Trefferwahrscheinlichkeit p = 0 …“ – deckt den Inhalt des Pack-Themas. | 3.6.1 KS „Binomialverteilung“, S. 63 (Kenngrößen) |
| `st-k1112-bedingte` | Bedingte Wahrscheinlichkeit | — (Outline) | Kein Master für bedingte Wahrscheinlichkeit/Vierfeldertafel vorhanden. | 3.6.1 KS „Bedingte Wahrscheinlichkeit“, S. 63 |
| `st-k1112-normal` | Normalverteilung | — (Outline) | Kein Master für Normalverteilung vorhanden (und im gA-Plan nicht vorgesehen). | NICHT gA: nur 3.6.2 (eAN) KS „Binomial- und Normalverteilung“, S. 69 |
| `st-k1112-statistik` | Beurteilende Statistik | — (Outline) | Kein Master für beurteilende Statistik vorhanden (und im gA-Plan nicht vorgesehen). | NICHT gA: nur 3.6.2 (eAN) KS „Beurteilende Statistik“, S. 70 (gA: nur Vertrauensintervall, S. 63) |


### 3.1 Aufgelöste Konflikte (Master von zwei Pack-Themen gewünscht)

| Master | Bisher genutzt von | Entscheidung | Begründung |
|---|---|---|---|
| `lb5-anteil-prozent` | st-k6-anteil-prozent, st-k7-prozent | **st-k7-prozent** | Prozentwert/Prozentsatz/Rabatt = LP 7/8 (S. 44). 5/6 kennt nur „bequeme Prozentsätze“ (S. 37). st-k6-anteil-prozent → Outline. |
| `k10-lb1-zinsen` | st-k7-zinsen, st-k10-zinsen | **st-k7-zinsen** | Zinsrechnung ist 7/8 (S. 44), kein Jg.-10-Schwerpunkt (S. 54). |
| `k10-lb1-zinseszins` | st-k7-zinseszins, st-k10-zinseszins | **st-k7-zinseszins** | „Zinseszins“ im Wissensbestand 7/8 (S. 44). In Jg. 10 nur als Beispiel für Wachstum (S. 54), keine ausdrückliche Wiederholungsforderung. |
| `k10-lb1-prozentuale-zunahme` | st-k7-preisaenderung, st-k10-zunahme | **st-k7-preisaenderung** | „Steigerung bzw. Senkung um bzw. auf“ = 7/8 (S. 44). |
| `k1112-lb2-skalarprodukt` | st-k10-vektor-skalar, st-k1112-skalar | **st-k10-vektor-skalar** | Skalarprodukt/Orthogonalität = Jg. 10 „Vektoren“ (S. 55); im gA-Plan 11/12 nicht als Schwerpunkt (S. 58–63). |
| `k1112-lb2-betrag-vektor` | st-k10-vektor-betrag, st-k1112-betrag | **st-k10-vektor-betrag** | „Beträge von Vektoren berechnen“ = Jg. 10 (S. 55). |
| `k7-lb4-spannweite` | st-k7-spannweite, st-k9-spannweite | **st-k9-spannweite** | Spannweite steht in 5/6 (S. 42) und Jg. 9 „Häufigkeitsverteilungen“ (S. 52), nicht in 7/8. Ein 5/6-Thema „Spannweite“ gibt es im Pack nicht (Kandidat: st-k6-… neu). |

Zusätzlich (kein Konflikt, aber Neuzuordnung nach Lehrplan): `k7-lb4-mittelwert` und `k7-lb4-median` (Master-Klasse 7) wandern von st-k7-mittelwert/-median zu **st-k6-mittelwert/-median**, weil der Lehrplan Kenngrößen in 5/6 verortet (S. 42). Minimal-invasive Alternative: Mapping von K7 belassen und K6 Outline lassen – netto gleiche Anzahl spielbar (±0), aber lehrplanwidrig.

Pack-Themen mit gleichem Titel, aber **verschiedenen** Mastern (kein Regelverstoß, Dublettengefahr für Lernende): K5↔K6 Brüche kürzen/erweitern, Dezimalzahlen add./mul./div./runden; K6 „Volumen gerader Prismen“ ↔ K7 „Volumen gerader Prismen“; K9 „Wert einer quadratischen Funktion“ ↔ „Funktionswert einer Parabel“. Der Lehrplan führt 5/6 und 7/8 als Doppeljahrgang, die Wiederholung ist plausibel; bei K6/K7-Prisma siehe Abw. 4.

## 4. Abweichungen Outline ↔ Lehrplan

Format: Befund · Empfehlung · Quelle. Reihenfolge nach Klasse; (A) = überzählig/falscher Jahrgang, (B) = im Lehrplan, im Outline fehlend, (C) = Hinweis.

1. **(A) K6 `st-k6-anteil-prozent`** („Prozent einer Größe berechnen“). Prozentwert ermitteln ist 7/8-Inhalt, in 5/6 nur „speziellen Brüchen prozentuale Angaben zuordnen“ / „bequeme Prozentsätze“. Doppelt zu `st-k7-prozent`. *Empfehlung:* aus K6 entfernen (oder auf bequeme Prozentsätze beschränken = bereits `st-k6-prozent`). *Quelle:* 3.2 KS „Brüche“, S. 37; 3.3 KS „Prozentrechnung“, S. 44.
2. **(A) K6 `st-k6-haeufigkeit`** („Relative Häufigkeit in Prozent“). 5/6 kennt Strichliste, Häufigkeitstabelle, Säulendiagramm; relative Häufigkeit gehört zu 7/8. *Empfehlung:* nach K7 verschieben (Master `lb2-haeufigkeit` bleibt, oder auf `k7-lb4-rel-haeufigkeit` umstellen). *Quelle:* 3.2 KS „Erfassen, Darstellen und Auswerten von Daten“, S. 42; 3.3 KS „Zufällige Ereignisse, Häufigkeiten, Wahrscheinlichkeiten“, S. 49.
3. **(A) K6 `st-k6-gleichung-beid`** (x auf beiden Seiten). 5/6-Gleichungstypen: ax+b=c, a(x+b)=c, ax=b, a/x=b; ax±b=cx±d erst 7/8, dort bereits `st-k7-gleichung-beid`. *Empfehlung:* aus K6 entfernen. *Quelle:* 3.2 KS „Gleichungen und Ungleichungen“, S. 37; 3.3 S. 45.
4. **(A) K6 `st-k6-volumen-prisma`**. 5/6 behandelt nur Quader/Würfel; Prismen = 7/8. Inhaltsgleiches `st-k7-volumen-prisma` existiert. *Empfehlung:* K6-Thema entfernen (Mapping bleibt vorerst bestehen, da keine Master-Doppelnutzung). *Quelle:* 3.2 KS „Umfang, Flächeninhalt und Volumen“, S. 40; 3.3 KS „Körperberechnung“, S. 47.
5. **(A) K7 Bereich „Daten und Kenngrößen“** (`st-k7-mittelwert/-median/-spannweite`). Kenngrößen (Mittel, Modalwert, Median, Spannweite) sind 5/6 und Jg. 9 (Lage-/Streumaße); 7/8 hat Häufigkeiten/LAPLACE/mehrstufige Versuche. Im Mapping nach Konfliktlösung Outline. *Empfehlung:* Bereich ersetzen durch „Relative Häufigkeit“ (Master `k7-lb4-rel-haeufigkeit` frei) und ggf. Mengendiagramm/Vierfeldertafel. *Quelle:* 3.2 S. 42; 3.3 S. 49; 3.4 S. 52.
6. **(A) K7 `st-k7-basiswinkel`, `st-k7-mittelsenkrechte`, `st-k7-winkelsumme`** (im Bereich „Körperdarstellung/-berechnung“). Gleichschenkliges Dreieck und Mittelsenkrechte sind 5/6 „Dreiecke“; Innenwinkelsatz nur für Dreieck und Viereck genannt, „Vieleck“ nicht explizit (Master `k7-lb1-winkelsumme-vieleck` ohne eindeutige LP-Stelle). *Empfehlung:* nach K6 „Dreiecke und Vierecke“ verschieben; Vieleck-Winkelsumme als optional kennzeichnen. *Quelle:* 3.2 KS „Dreiecke“, S. 40; „Vierecke“, S. 41.
7. **(C) K5 Randthemen.** `st-k5-flaeche-zus`/`st-k5-volumen-zus`: „zusammengesetzte Figuren/Körper“ nennt der LP erst in 7/8; `st-k5-dez-div`: Division von Dezimalbrüchen steht unter „Gebrochene Zahlen“ (Doppeljahrgang 5/6, unkritisch); Bereich „Daten erfassen und auswerten“ enthält Sachaufgaben (`st-k5-sach-*`), die keinem KS, sondern dem Aufgabenpraktikum zuzuordnen sind. *Empfehlung:* belassen, Bereichstitel „Sachaufgaben“ (Aufgabenpraktikum) erwägen. *Quelle:* 3.3 S. 46–47; 3.2 S. 37–38; 2.5 S. 30.
8. **(A) K8 `st-k8-lgs`** („Lineares Gleichungssystem“). In 7/8 nur „Koordinaten von Schnittpunkten von Graphen linearer Funktionen … ermitteln“; LGS-Verfahren (Additions-/Einsetzungsverfahren, drei Variablen) erst Jg. 10. *Empfehlung:* umbenennen in „Schnittpunkt zweier Geraden“ oder nach K10 verschieben (dann `st-k10-lgs3` auf 2×2 erweitern). Mapping (`k8-lb3-lgs`) bleibt. *Quelle:* 3.3 KS „Lineare Funktionen“, S. 48; 3.5 KS „Vektoren“, S. 55.
9. **(A) K9 `st-k9-pythagoras-hyp/-kat`** (Bereich „Trigonometrie“). Pythagoras ist 7/8 (bereits `st-k8-pythagoras-*`); Jg. 9 „Trigonometrie“ nennt ihn nicht. Masters sind K8 zugeordnet. *Empfehlung:* entfernen (Outline-Dubletten). *Quelle:* 3.3 KS „Satzgruppe des Pythagoras“, S. 47; 3.4 KS „Trigonometrie“, S. 51.
10. **(A) K10 Zins-/Prozentthemen** (`st-k10-zinsen`, `-zinseszins`, `-zunahme`, `-kapital`, `-zinssatz`). Zinsrechnung (Kapital, Zinsen, Zinssatz, Zinszeit, Zinseszins) und Steigerung/Senkung sind 7/8; in Jg. 10 „Funktionsklassen“ nur exponentielles Wachstum. Die ersten drei sind durch Konfliktlösung Outline; `kapital`/`zinssatz` bleiben (kein Konflikt) gemappt. *Empfehlung:* zinsen/zinseszins/zunahme aus K10 entfernen; kapital/zinssatz nach K7 verschieben (Master unverändert). *Quelle:* 3.3 KS „Prozentrechnung“, S. 44; 3.5 KS „Funktionsklassen“, S. 54.
11. **(A) K10 `st-k10-laplace`.** LAPLACE ist 7/8 (`st-k8-laplace`); Jg. 10 = Zufallsgrößen. *Empfehlung:* entfernen. *Quelle:* 3.3 S. 49; 3.5 S. 56.
12. **(A) K10 `st-k10-sinussatz`.** Sinus-/Kosinussatz stehen in Jg. 9 „Trigonometrie“. *Empfehlung:* nach K9 verschieben. *Quelle:* 3.4 KS „Trigonometrie“, S. 51.
13. **(A) K10 Bereich „Algebraisches Lösen geometrischer Probleme“** (`st-k10-rechteck`, `-quadrat-seite`, `-rechteck-umfang`, `-sinussatz`). Kein Kompetenzschwerpunkt in Jg. 10 (Übersicht: Funktionsklassen, Vektoren, Zufallsgrößen). Inhalt = Anwendung linearer/quadratischer Gleichungen (7/8, 9) bzw. Aufgabenpraktikum. *Empfehlung:* Bereich auflösen und die Themen nach K9 („Quadratische Gleichungen“) bzw. Aufgabenpraktikum verschieben; Mapping der drei Themen bleibt gültig (`st-k10-rechteck-umfang` neu gemappt). *Quelle:* 3.1 S. 33–34; 3.3 S. 45; 3.4 S. 52; 2.5 S. 30.
14. **(A) 11/12 gA `st-k1112-skalar`, `st-k1112-betrag`.** Vektorrechnung (Betrag, Skalarprodukt) ist Jg. 10; gA 11/12 hat „Geraden und Ebenen“ und „Kreise“. Doppelt zu `st-k10-vektor-*`. *Empfehlung:* entfernen; ersetzen durch Themen zu Geraden/Ebenen (Lagebeziehung, Abstand, Schnittwinkel) – dafür fehlt ein Master. *Quelle:* 3.5 S. 55; 3.6.1 S. 62.
15. **(A) 11/12 gA `st-k1112-normal`, `st-k1112-statistik`.** „Normalverteilung“ und „Beurteilende Statistik“ sind nur im **erhöhten** Anforderungsniveau (eAN). gA kennt nur Binomialverteilung inkl. 95 %-Vertrauensintervall. *Empfehlung:* aus gA-Pack entfernen (oder als eAN-Erweiterung kennzeichnen). *Quelle:* 3.6.2 (eAN) KS „Binomial- und Normalverteilung“, S. 69; KS „Beurteilende Statistik“, S. 70; gA: 3.6.1 KS „Binomialverteilung“, S. 63.
16. **(C) K8 Bereich „Vernetzung“** (`zahlenraetsel`, `rueckwaerts`, `probieren`, `skizze`). Kein KS, sondern Aufgabenpraktikum (mind. einmal pro Schuljahr, ca. zwei Wochen) bzw. Lösungsstrategien („inhaltlich, Umformen, Probieren“). Passend, nur nicht an Klasse 8 gebunden. *Empfehlung:* belassen; Bereichsname „Aufgabenpraktikum“ erwägen. *Quelle:* 2.5, S. 30–32; 3.3 S. 45.
17. **(A) 11/12 gA `st-k1112-nullstelle`** („Nullstelle einer linearen Funktion“). Lineare Nullstellen = 7/8 (Lineare Funktionen); in 11/12 nur als Teil der Funktionsuntersuchung. *Empfehlung:* nach K8 (Lineare Funktionen) verschieben; Master `k1112-lb1-nullstelle-linear` bleibt. *Quelle:* 3.3 KS „Lineare Funktionen“, S. 48; 3.6.1 S. 60.
18. **(B) Fehlt in K5/K6 (Jg. 5/6):** ganze/negative Zahlen am Zahlenstrahl, Primfaktorzerlegung, ggT/kgV (S. 36); römische Zahlen (S. 36); Maßstab (S. 38); Mengen/Zahlbereiche (S. 38); Lagebeziehungen, Lot, Drehung (S. 39); Vierecksarten und Umfang/Fläche spezieller Vierecke, Dreieckskonstruktion, Höhen/Winkelhalbierende (S. 40–41); Strichliste/Häufigkeitstabelle/Säulendiagramm (S. 42). *Quelle:* 3.2.
19. **(B) Fehlt in K7/K8 (Jg. 7/8):** Promille, Grundwert/Prozentsatz, Kreisdiagramm (S. 44); Verhältnisgleichungen, Formeln umstellen, Betragsgleichungen (S. 45); binomische Formeln, Ausklammern (S. 45); Winkel am Kreis/Thales/Tangenten (S. 46); Kegel, Schrägbild/Zweitafelbild (S. 46–47); Höhen-/Kathetensatz (S. 47); zentrische Streckung (S. 47); Nullstelle/Schnittpunkte/Funktionsgleichung linearer Funktionen (S. 48); Ergebnismengen, Vierfeldertafel, relative Häufigkeit (S. 49). *Quelle:* 3.3.
20. **(B) Fehlt in K9:** Wurzel-/Logarithmengesetze, rationale Exponenten, Zehnerpotenzen/Einheitenvorsätze (S. 51); Kosinussatz, Flächeninhaltssatz (S. 51); Gleichungen höheren Grades/Substitution (S. 52); Standardabweichung, Klasseneinteilung (S. 52). *Quelle:* 3.4.
21. **(B) Fehlt in K10:** Umkehrfunktionen, Exponential-/Logarithmus-/Wurzelgleichungen, Bogenmaß, Potenzfunktionen (S. 54); lineare Abhängigkeit, Vektorprodukt, Winkel zwischen Vektoren (S. 55); Wahrscheinlichkeitsverteilung/Standardabweichung (S. 56). *Quelle:* 3.5.
22. **(B) Fehlt in 11/12 gA:** Grenzwerte, Stetigkeit (S. 59); Ableitungsregeln, Extrem-/Wendepunkte, Monotonie, Tangente/Normale (S. 60); Stammfunktion, Hauptsatz, Flächeninhalt (S. 61); Geraden und Ebenen (Parameter-/Normalen-/Koordinatenform, Lage, Abstand) (S. 62); Bernoulli-Kette, Binomialkoeffizient, σ-Umgebung, Vertrauensintervall (S. 63). *Quelle:* 3.6.1.

Hinweis zu den Punkten 18–22: Masters für diese Inhalte existieren zum großen Teil nicht; neue Pack-Themen würden Outline bleiben (Pack erhält laut Plan keinen eigenen Inhalt).

## 5. Abdeckung

### 5.1 Pack-Themen ohne Master-Quelle (bleiben Outline) – 33

- `st-k6-gleichung-beid` – Gleichung mit x auf beiden Seiten
- `st-k6-gleichung-probe` – Lineare Gleichung und Probe
- `st-k6-wechselwinkel` – Wechselwinkel an Parallelen
- `st-k6-gestreckter` – Winkel am gestreckten Winkel
- `st-k6-anteil-prozent` – Prozent einer Größe berechnen
- `st-k7-wurzeln` – Wurzeln und Näherungswerte
- `st-k7-gleichung-klammer` – Gleichung mit Klammern vorbereiten
- `st-k7-ungleichung` – Einfache lineare Ungleichung (Idee)
- `st-k7-mittelwert` – Arithmetisches Mittel
- `st-k7-median` – Median (Zentralwert)
- `st-k7-spannweite` – Spannweite berechnen
- `st-k8-mehrstufig` – Mehrstufige Zufallsversuche / Pfadregeln
- `st-k8-probieren` – Systematisches Probieren
- `st-k8-skizze` – Skizze und Hilfsfigur
- `st-k9-logarithmen` – Logarithmen und Logarithmusgleichungen
- `st-k9-pythagoras-hyp` – Satz des Pythagoras: Hypotenuse
- `st-k9-pythagoras-kat` – Satz des Pythagoras: fehlende Kathete
- `st-k9-boxplot` – Histogramm und Boxplot
- `st-k10-zunahme` – Prozentuale Zunahme
- `st-k10-zinsen` – Jahreszinsen berechnen
- `st-k10-zinseszins` – Zinseszins: Endkapital
- `st-k10-funk-sin` – Sinus- und Kosinusfunktionen (Funktionsklassen)
- `st-k10-lgs3` – Lineare Gleichungssysteme mit drei Variablen
- `st-k10-varianz` – Varianz einer Zufallsgröße
- `st-k10-laplace` – Laplace-Wahrscheinlichkeit als Bruch
- `st-k10-sinussatz` – Sinussatz: Seite berechnen
- `st-k1112-differential` – Differentialrechnung: Änderungsrate und Tangente
- `st-k1112-skalar` – Skalarprodukt zweier Vektoren
- `st-k1112-betrag` – Betrag eines Vektors
- `st-k1112-kreise-ag` – Kreise in der analytischen Geometrie
- `st-k1112-bedingte` – Bedingte Wahrscheinlichkeit
- `st-k1112-normal` – Normalverteilung
- `st-k1112-statistik` – Beurteilende Statistik

### 5.2 Ungenutzte Master-Themen (Klasse 5–12) – 12

Die 10 `__grafik`-Prüfvarianten (k8-lb3-steigung__grafik, k8-lb3-achsenabschnitt__grafik, k8-lb3-funktionswert__grafik, k9-lb1-scheitel__grafik, k9-lb1-quadrat-wert__grafik, k10-lb4-parabel-wert__grafik, k10-lb4-parabel-wert__grafik-ablesen, k1112-lb1-ableitung-stelle__grafik, k1112-lb1-bestimmtes-integral__grafik, k1112-lb1-nullstelle-linear__grafik) sind keine eigenständigen Master, sondern Grafik-Prüfseiten ihrer Eltern-Themen (`reviewOf`) und hier nicht mitgezählt.

| Klasse | Master-ID | Titel | Grund |
|---|---|---|---|
| K5 | `lb4-umfang-zusammengesetzt` | Zusammengesetzte Flächen: Umfang berechnen | Pack hat nur „Zusammengesetzte Flächen: Fläche“ (st-k5-flaeche-zus), kein Umfang-Thema. LP nennt zusammengesetzte Figuren erst in 7/8 (S. 46). Kandidat für ein neues K5-Outline-Thema, falls gewünscht. |
| K5 | `lb5-sachaufgabe-flaeche` | Sachaufgabe: Fläche und Umfang im Alltag | Kein Pack-Thema „Sachaufgabe Fläche/Umfang“ in K5. LP: Anwendungsaufgaben Umfang/Flächeninhalt, S. 40 (Aufgabenpraktikum). |
| K6 | `lb1-sachaufgabe-bruch` | Sachaufgabe: Bruchrechnung im Alltag | Kein Pack-Thema „Sachaufgabe Bruchrechnung“ in K6. LP: Anwendungsaufgaben Gebrochene Zahlen, S. 38. |
| K6 | `lb3-umfang-rechteck` | Umfang von Rechteck und Quadrat | Master-Klasse 6, Inhalt identisch zu Klasse 5 (st-k5-umfang-rechteck nutzt lb4-umfang-rechteck). LP nennt Rechtecke nur in 5/6; Wiederholung nicht gefordert. |
| K6 | `lb3-flaeche-rechteck` | Flächeninhalt von Rechteck und Quadrat | wie lb3-umfang-rechteck (Dublette zu lb4-flaeche-rechteck, K5). |
| K6 | `lb3-sachaufgabe-geometrie` | Sachaufgabe: Fläche und Umfang im Alltag | Dublette zu lb5-sachaufgabe-flaeche (K5); Pack K6 hat kein passendes Thema. |
| K6 | `lb4-volumen-quader` (zweites Vorkommen derselben ID) | Volumen von Quader und Würfel | ID-Kollision: existiert in math5.ts UND math6.ts; der Katalog (first wins) liefert die Klasse-5-Version (st-k5-volumen-quader). Klasse-6-Variante per ID nicht erreichbar; Pack K6 hat kein Quader-Thema. |
| K6 | `lb4-oberflaeche-quader` (zweites Vorkommen derselben ID) | Oberflächeninhalt von Quadern | ID-Kollision wie lb4-volumen-quader (K5 gewinnt, st-k5-oberflaeche-quader). |
| K6 | `lb4-flaeche-kante-quader` | Fläche und senkrechte Seitenlänge | Kein Pack-Thema „Fläche und senkrechte Seitenlänge“. LP: Oberflächeninhalt/Volumen von Quadern in Sachsituationen, S. 40. |
| K6 | `k6-umrechnen-flaeche` | Einheiten umrechnen: Flächeninhalt | Pack K6 hat keinen Bereich „Größen“; Umrechnen läuft nur über K5 (st-k5-umr-*). LP: Größen in 5/6, S. 38 – Wiederholung nicht gefordert. |
| K6 | `k6-umrechnen-laenge` | Einheiten umrechnen: Länge | wie k6-umrechnen-flaeche. |
| K7 | `k7-lb4-rel-haeufigkeit` | Relative Häufigkeit in Prozent | Kein passendes Pack-Thema in K7 (K7-Statistik entfällt, Abw. 5). LP: Häufigkeiten, relative Häufigkeit in 7/8, S. 49 – Empfehlung: neues Pack-Thema `st-k7-rel-haeufigkeit` (oder st-k6-haeufigkeit nach K7 verschieben und auf diesen Master umstellen). |

Alle Master der Klassen 8–10 und 11/12 werden genutzt.

### 5.3 Hinweise für E1/E3

- **ID-Kollision im Master:** `lb4-volumen-quader` und `lb4-oberflaeche-quader` existieren in `math5.ts` und `math6.ts`; `gymGeneratorCatalog()` nimmt die erste (Klasse 5). Bei Zusammenführung/1:n-Mapping beachten.
- Die K5/K6-Umrechnen-Master (`k5-umrechnen-*`, `k6-umrechnen-*`) sind echte Eltern-Themen (Konstanten `conversionTopic`), keine verwaisten Neu-Themen; ihre Neu-Geschwister heißen `…__neu`.
- Mapping-Ziele mit Klassenverschiebung (zulässig, weil der Lehrplan den Inhalt in der Pack-Klasse verortet): K6→Master-Kl. 7 (Gleichungen, Winkel, Mittelwert/Median), K7→Kl. 6/8/10 (Prozent, Zinsen, Terme), K8→Kl. 9 (Kreis, Pythagoras), K9→Kl. 10 (quadratische Gleichungen/Funktionen), K10→Kl. 11/12 (Vektoren).

## 6. Maschinenlesbare Zuordnung (nur spielbare Pack-Themen, nach Änderungen)

```json
{
  "st-k5-nat-runden": {
    "sources": [
      "lb1-runden-natuerlich"
    ],
    "note": "3.2 (Jg. 5/6) KS „Natürliche Zahlen“, S. 36"
  },
  "st-k5-nat-add": {
    "sources": [
      "lb1-addition"
    ],
    "note": "3.2 (Jg. 5/6) KS „Natürliche Zahlen“, S. 36"
  },
  "st-k5-nat-sub": {
    "sources": [
      "lb1-subtraktion"
    ],
    "note": "3.2 (Jg. 5/6) KS „Natürliche Zahlen“, S. 36"
  },
  "st-k5-nat-mul": {
    "sources": [
      "lb1-multiplikation"
    ],
    "note": "3.2 (Jg. 5/6) KS „Natürliche Zahlen“, S. 36"
  },
  "st-k5-nat-schriftlich": {
    "sources": [
      "lb1-schriftliches-rechnen"
    ],
    "note": "3.2 (Jg. 5/6) KS „Natürliche Zahlen“, S. 36"
  },
  "st-k5-nat-div-rest": {
    "sources": [
      "lb1-division-rest"
    ],
    "note": "3.2 KS „Natürliche Zahlen“, S. 36 (Division, Quotient/Dividend/Divisor)"
  },
  "st-k5-nat-div": {
    "sources": [
      "lb1-schriftliche-division"
    ],
    "note": "3.2 KS „Natürliche Zahlen“, S. 36 (schriftliche Rechenverfahren)"
  },
  "st-k5-nat-potenz": {
    "sources": [
      "lb1-potenzieren"
    ],
    "note": "3.2 KS „Natürliche Zahlen“, S. 36 („Potenzen berechnen“, Quadrat-/Zehnerpotenz)"
  },
  "st-k5-nat-teilbarkeit": {
    "sources": [
      "lb1-teilbarkeit"
    ],
    "note": "3.2 KS „Natürliche Zahlen“, S. 36 (Teilbarkeitsregeln)"
  },
  "st-k5-nat-prim": {
    "sources": [
      "lb1-primzahl"
    ],
    "note": "3.2 KS „Natürliche Zahlen“, S. 36 (Primzahlen)"
  },
  "st-k5-bruch-anteil": {
    "sources": [
      "lb2-anteil-bruch"
    ],
    "note": "3.2 KS „Brüche“, S. 37"
  },
  "st-k5-bruch-kuerzen": {
    "sources": [
      "lb2-kuerzen"
    ],
    "note": "3.2 KS „Brüche“, S. 37"
  },
  "st-k5-bruch-erweitern": {
    "sources": [
      "lb2-erweitern"
    ],
    "note": "3.2 KS „Brüche“, S. 37"
  },
  "st-k5-bruch-grafik": {
    "sources": [
      "lb2-grafische-brueche"
    ],
    "note": "3.2 KS „Brüche“, S. 37"
  },
  "st-k5-dez-add": {
    "sources": [
      "lb2-dez-add-sub"
    ],
    "note": "3.2 KS „Brüche“, S. 37"
  },
  "st-k5-dez-mul": {
    "sources": [
      "lb2-dez-mult"
    ],
    "note": "3.2 KS „Brüche“, S. 37"
  },
  "st-k5-dez-div": {
    "sources": [
      "lb2-dez-div"
    ],
    "note": "3.2 KS „Gebrochene Zahlen“, S. 38 (Grundrechenoperationen; „Brüche“ S. 37 nennt nur +, −, ·)"
  },
  "st-k5-dez-runden": {
    "sources": [
      "lb2-runden-dezimal"
    ],
    "note": "3.2 KS „Brüche“, S. 37"
  },
  "st-k5-dez-zahlenstrahl": {
    "sources": [
      "lb2-zahlenstrahl"
    ],
    "note": "3.2 KS „Brüche“, S. 37 (Zahlenstrahl ablesen/eintragen)"
  },
  "st-k5-groessen-ordnen": {
    "sources": [
      "lb2-ordnen-einheiten"
    ],
    "note": "3.2 KS „Größen“, S. 38"
  },
  "st-k5-umr-laenge": {
    "sources": [
      "k5-umrechnen-laenge"
    ],
    "note": "3.2 KS „Größen“, S. 38"
  },
  "st-k5-umr-masse": {
    "sources": [
      "k5-umrechnen-masse"
    ],
    "note": "3.2 KS „Größen“, S. 38"
  },
  "st-k5-umr-zeit": {
    "sources": [
      "k5-umrechnen-zeit"
    ],
    "note": "3.2 KS „Größen“, S. 38"
  },
  "st-k5-umr-flaeche": {
    "sources": [
      "k5-umrechnen-flaeche"
    ],
    "note": "3.2 KS „Größen“, S. 38"
  },
  "st-k5-umr-volumen": {
    "sources": [
      "k5-umrechnen-volumen"
    ],
    "note": "3.2 KS „Größen“, S. 38"
  },
  "st-k5-geo-strecken": {
    "sources": [
      "lb3-strecken-bezeichnung"
    ],
    "note": "3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39"
  },
  "st-k5-geo-laenge": {
    "sources": [
      "lb3-strecken-laenge"
    ],
    "note": "3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39"
  },
  "st-k5-geo-mittelpunkt": {
    "sources": [
      "lb3-strecken-mittelpunkt"
    ],
    "note": "3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39"
  },
  "st-k5-geo-koord-ablesen": {
    "sources": [
      "lb3-koordinaten-ablesen"
    ],
    "note": "3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39"
  },
  "st-k5-geo-koord-eintragen": {
    "sources": [
      "lb3-koordinaten-eintragen"
    ],
    "note": "3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39"
  },
  "st-k5-geo-abstand": {
    "sources": [
      "lb3-koordinaten-abstand"
    ],
    "note": "3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39"
  },
  "st-k5-geo-winkelarten": {
    "sources": [
      "lb3-winkelarten"
    ],
    "note": "3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39"
  },
  "st-k5-geo-winkel-erg": {
    "sources": [
      "lb3-winkel-ergaenzung"
    ],
    "note": "3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39"
  },
  "st-k5-geo-verschiebung": {
    "sources": [
      "lb3-verschiebung"
    ],
    "note": "3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39"
  },
  "st-k5-geo-achse": {
    "sources": [
      "lb3-achsensymmetrie"
    ],
    "note": "3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39"
  },
  "st-k5-geo-punkt": {
    "sources": [
      "lb3-punktsymmetrie"
    ],
    "note": "3.2 KS „Geometrische Grundbegriffe und Abbildungen“, S. 39"
  },
  "st-k5-umfang-rechteck": {
    "sources": [
      "lb4-umfang-rechteck"
    ],
    "note": "3.2 KS „Umfang, Flächeninhalt und Volumen“, S. 40"
  },
  "st-k5-flaeche-rechteck": {
    "sources": [
      "lb4-flaeche-rechteck"
    ],
    "note": "3.2 KS „Umfang, Flächeninhalt und Volumen“, S. 40"
  },
  "st-k5-volumen-quader": {
    "sources": [
      "lb4-volumen-quader"
    ],
    "note": "3.2 KS „Umfang, Flächeninhalt und Volumen“, S. 40"
  },
  "st-k5-oberflaeche-quader": {
    "sources": [
      "lb4-oberflaeche-quader"
    ],
    "note": "3.2 KS „Umfang, Flächeninhalt und Volumen“, S. 40"
  },
  "st-k5-flaeche-zus": {
    "sources": [
      "lb4-flaeche-zusammengesetzt"
    ],
    "note": "nicht explizit in 5/6; „zusammengesetzte Figuren“ erst 3.3 KS „Kreise“ S. 46 (abgeleitet aus S. 40)"
  },
  "st-k5-volumen-zus": {
    "sources": [
      "lb4-volumen-zusammengesetzt"
    ],
    "note": "nicht explizit in 5/6; „zusammengesetzte Körper“ erst 3.3 KS „Körperberechnung“ S. 47 (abgeleitet aus S. 40)"
  },
  "st-k5-mittelwert": {
    "sources": [
      "lb2-mittelwert"
    ],
    "note": "3.2 KS „Kenngrößen von Daten“, S. 42"
  },
  "st-k5-sach-preis": {
    "sources": [
      "lb5-gesamtpreis"
    ],
    "note": "3.2 KS „Natürliche Zahlen“, S. 36 („Anwendungsaufgaben lösen“); 2.5 S. 30"
  },
  "st-k5-sach-teilen": {
    "sources": [
      "lb5-teilen"
    ],
    "note": "3.2 KS „Natürliche Zahlen“, S. 36 („Anwendungsaufgaben lösen“); 2.5 S. 30"
  },
  "st-k5-sach-mehr": {
    "sources": [
      "lb5-mehrstufig"
    ],
    "note": "3.2 KS „Natürliche Zahlen“, S. 36 („Anwendungsaufgaben lösen“); 2.5 S. 30"
  },
  "st-k6-bruch-kuerzen": {
    "sources": [
      "lb1-kuerzen"
    ],
    "note": "3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38"
  },
  "st-k6-bruch-erweitern": {
    "sources": [
      "lb1-erweitern"
    ],
    "note": "3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38"
  },
  "st-k6-bruch-vergleichen": {
    "sources": [
      "lb1-vergleichen"
    ],
    "note": "3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38"
  },
  "st-k6-bruch-add": {
    "sources": [
      "lb1-add-sub-brueche"
    ],
    "note": "3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38"
  },
  "st-k6-bruch-mul": {
    "sources": [
      "lb1-mult-brueche"
    ],
    "note": "3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38"
  },
  "st-k6-bruch-div": {
    "sources": [
      "lb1-div-brueche"
    ],
    "note": "3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38"
  },
  "st-k6-bruch-dez": {
    "sources": [
      "lb1-bruch-dezimal"
    ],
    "note": "3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38"
  },
  "st-k6-prozent": {
    "sources": [
      "lb1-prozent"
    ],
    "note": "3.2 KS „Brüche“, S. 37 („speziellen Brüchen prozentuale Angaben zuordnen“, bequeme Prozentsätze)"
  },
  "st-k6-dez-add": {
    "sources": [
      "lb1-dez-add-sub"
    ],
    "note": "3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38"
  },
  "st-k6-dez-mul": {
    "sources": [
      "lb1-dez-mult"
    ],
    "note": "3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38"
  },
  "st-k6-dez-div": {
    "sources": [
      "lb1-dez-div"
    ],
    "note": "3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38"
  },
  "st-k6-dez-runden": {
    "sources": [
      "lb1-runden"
    ],
    "note": "3.2 KS „Brüche“ S. 37 / „Gebrochene Zahlen“ S. 38"
  },
  "st-k6-gleichung-add": {
    "sources": [
      "k7-lb2-gleichung-add"
    ],
    "note": "3.2 KS „Gleichungen und Ungleichungen“, S. 37 (Umkehroperationen)"
  },
  "st-k6-gleichung-mul": {
    "sources": [
      "k7-lb2-gleichung-mul"
    ],
    "note": "3.2 KS „Gleichungen und Ungleichungen“, S. 37 (Gleichungstyp ax = b)"
  },
  "st-k6-nebenwinkel": {
    "sources": [
      "k7-lb1-nebenwinkel"
    ],
    "note": "3.2 KS „Winkelbeziehungen“, S. 39 (Nebenwinkelsatz)"
  },
  "st-k6-scheitelwinkel": {
    "sources": [
      "k7-lb1-scheitelwinkel"
    ],
    "note": "3.2 KS „Winkelbeziehungen“, S. 39 (Scheitel-, Stufenwinkel)"
  },
  "st-k6-winkel-dreieck": {
    "sources": [
      "lb3-winkel-dreieck"
    ],
    "note": "3.2 KS „Dreiecke“ S. 40 / „Vierecke“ S. 41"
  },
  "st-k6-winkel-viereck": {
    "sources": [
      "lb3-winkel-viereck"
    ],
    "note": "3.2 KS „Dreiecke“ S. 40 / „Vierecke“ S. 41"
  },
  "st-k6-flaeche-dreieck": {
    "sources": [
      "lb3-flaeche-dreieck"
    ],
    "note": "3.2 KS „Dreiecke“ S. 40 / „Vierecke“ S. 41"
  },
  "st-k6-kongruenz": {
    "sources": [
      "lb3-kongruenzsatz"
    ],
    "note": "3.2 KS „Dreiecke“ S. 40 / „Vierecke“ S. 41"
  },
  "st-k6-volumen-prisma": {
    "sources": [
      "lb4-volumen-prisma"
    ],
    "note": "NICHT 5/6: Prismen erst 3.3 KS „Körperberechnung“, S. 47 (5/6: nur Quader, S. 40)"
  },
  "st-k6-wuerfelnetz": {
    "sources": [
      "lb4-wuerfelnetz"
    ],
    "note": "3.2 KS „Umfang, Flächeninhalt und Volumen“, S. 40 (Netze von Quader/Würfel)"
  },
  "st-k6-proportional": {
    "sources": [
      "lb2-proportional"
    ],
    "note": "3.2 KS „Zuordnungen, direkte und indirekte Proportionalität“, S. 41"
  },
  "st-k6-antiproportional": {
    "sources": [
      "lb2-antiproportional"
    ],
    "note": "3.2 KS „Zuordnungen, direkte und indirekte Proportionalität“, S. 41"
  },
  "st-k6-dreisatz": {
    "sources": [
      "lb2-sachaufgabe-dreisatz"
    ],
    "note": "3.2 KS „Zuordnungen, direkte und indirekte Proportionalität“, S. 41"
  },
  "st-k6-anteil": {
    "sources": [
      "lb5-anteil-groesse"
    ],
    "note": "3.2 KS „Brüche“, S. 37 („Anteile von Zahlen und Größen ermitteln“)"
  },
  "st-k6-haeufigkeit": {
    "sources": [
      "lb2-haeufigkeit"
    ],
    "note": "NICHT 5/6: relative Häufigkeit ist 3.3 KS „Zufällige Ereignisse, Häufigkeiten …“, S. 49 (5/6: Strichliste, Häufigkeitstabelle, S. 42)"
  },
  "st-k6-mittelwert": {
    "sources": [
      "k7-lb4-mittelwert"
    ],
    "note": "3.2 KS „Kenngrößen von Daten“, S. 42 (arithmetisches Mittel) [Mapping geändert ggü. ST_GENERATOR_MAP]"
  },
  "st-k6-median": {
    "sources": [
      "k7-lb4-median"
    ],
    "note": "3.2 KS „Kenngrößen von Daten“, S. 42 (Modalwert, Median, Spannweite) [Mapping geändert ggü. ST_GENERATOR_MAP]"
  },
  "st-k7-prozent": {
    "sources": [
      "lb5-anteil-prozent"
    ],
    "note": "3.3 KS „Prozentrechnung“, S. 44 („Prozentwerte, Grundwerte und Prozentsätze ermitteln“)"
  },
  "st-k7-zinsen": {
    "sources": [
      "k10-lb1-zinsen"
    ],
    "note": "3.3 KS „Prozentrechnung“, S. 44 („einschließlich Zinsrechnung“; Kapital, Zinsen, Zinssatz)"
  },
  "st-k7-zinseszins": {
    "sources": [
      "k10-lb1-zinseszins"
    ],
    "note": "3.3 KS „Prozentrechnung“, S. 44 (Wissensbestand „Zinseszins“)"
  },
  "st-k7-preisaenderung": {
    "sources": [
      "k10-lb1-prozentuale-zunahme"
    ],
    "note": "3.3 KS „Prozentrechnung“, S. 44 („Steigerung bzw. Senkung um bzw. auf“, Rabatt)"
  },
  "st-k7-rat-add": {
    "sources": [
      "k7-lb2-add-rational"
    ],
    "note": "3.3 KS „Rationale Zahlen und Wurzeln“, S. 44"
  },
  "st-k7-rat-sub": {
    "sources": [
      "k7-lb2-sub-rational"
    ],
    "note": "3.3 KS „Rationale Zahlen und Wurzeln“, S. 44"
  },
  "st-k7-rat-mul": {
    "sources": [
      "k7-lb2-mul-rational"
    ],
    "note": "3.3 KS „Rationale Zahlen und Wurzeln“, S. 44"
  },
  "st-k7-rat-div": {
    "sources": [
      "k7-lb2-div-rational"
    ],
    "note": "3.3 KS „Rationale Zahlen und Wurzeln“, S. 44"
  },
  "st-k7-betrag": {
    "sources": [
      "k7-lb2-betrag"
    ],
    "note": "3.3 KS „Rationale Zahlen und Wurzeln“, S. 44 (Betrag)"
  },
  "st-k7-gleichung": {
    "sources": [
      "k8-lb1-gleichung-linear"
    ],
    "note": "3.3 KS „Gleichungen und Ungleichungen“, S. 45"
  },
  "st-k7-gleichung-beid": {
    "sources": [
      "k8-lb1-gleichung-beidseitig"
    ],
    "note": "3.3 KS „Gleichungen und Ungleichungen“, S. 45"
  },
  "st-k7-term": {
    "sources": [
      "k7-lb2-term-vorrang"
    ],
    "note": "3.3 KS „Rationale Zahlen und Wurzeln“, S. 44 („Rechenausdrücke … berechnen“, Rechengesetze)"
  },
  "st-k7-term-auswerten": {
    "sources": [
      "k8-lb1-term-auswerten"
    ],
    "note": "3.3 KS „Arbeiten mit Variablen“, S. 45"
  },
  "st-k7-zusammenfassen": {
    "sources": [
      "k8-lb1-zusammenfassen"
    ],
    "note": "3.3 KS „Arbeiten mit Variablen“, S. 45"
  },
  "st-k7-ausmult": {
    "sources": [
      "k8-lb1-ausmultiplizieren"
    ],
    "note": "3.3 KS „Arbeiten mit Variablen“, S. 45"
  },
  "st-k7-volumen-prisma": {
    "sources": [
      "k7-lb3-volumen-prisma"
    ],
    "note": "3.3 KS „Körperberechnung“, S. 47"
  },
  "st-k7-mantel-prisma": {
    "sources": [
      "k7-lb3-mantel-prisma"
    ],
    "note": "3.3 KS „Körperberechnung“, S. 47"
  },
  "st-k7-volumen-pyramide": {
    "sources": [
      "k7-lb3-volumen-pyramide"
    ],
    "note": "3.3 KS „Körperberechnung“, S. 47"
  },
  "st-k7-oberflaeche-quader": {
    "sources": [
      "k7-lb3-oberflaeche-quader"
    ],
    "note": "3.3 KS „Körperberechnung“, S. 47"
  },
  "st-k7-oberflaeche-pyramide": {
    "sources": [
      "k7-lb3-oberflaeche-pyramide"
    ],
    "note": "3.3 KS „Körperberechnung“, S. 47"
  },
  "st-k7-winkelsumme": {
    "sources": [
      "k7-lb1-winkelsumme-vieleck"
    ],
    "note": "Innenwinkelsatz nur für Dreieck/Viereck (3.2 S. 40–41); Vieleck nicht explizit"
  },
  "st-k7-basiswinkel": {
    "sources": [
      "k7-lb1-basiswinkel"
    ],
    "note": "3.2 KS „Dreiecke“, S. 40 (Dreiecksarten, Seiten-Winkel-Beziehung) – gehört zu 5/6"
  },
  "st-k7-mittelsenkrechte": {
    "sources": [
      "k7-lb1-mittelsenkrechte-schritte"
    ],
    "note": "3.2 KS „Dreiecke“, S. 40 („Mittelsenkrechte … konstruieren“) – gehört zu 5/6"
  },
  "st-k8-kreis-umfang": {
    "sources": [
      "k9-lb2-kreis-umfang"
    ],
    "note": "3.3 KS „Kreise“, S. 46 (Umfang, Flächeninhalt, Radius, Durchmesser)"
  },
  "st-k8-kreis-flaeche": {
    "sources": [
      "k9-lb2-kreis-flaeche"
    ],
    "note": "3.3 KS „Kreise“, S. 46"
  },
  "st-k8-zylinder": {
    "sources": [
      "k9-lb2-zylinder-volumen"
    ],
    "note": "3.3 KS „Körperberechnung“, S. 47 (Kreiszylinder)"
  },
  "st-k8-kugel": {
    "sources": [
      "k9-lb2-kugel-volumen"
    ],
    "note": "3.3 KS „Körperberechnung“, S. 47 (Kugel)"
  },
  "st-k8-streckfaktor": {
    "sources": [
      "k8-lb4-streckfaktor"
    ],
    "note": "3.3 KS „Ähnlichkeit“, S. 47"
  },
  "st-k8-strahlensatz": {
    "sources": [
      "k8-lb4-strahlensatz"
    ],
    "note": "3.3 KS „Ähnlichkeit“, S. 47"
  },
  "st-k8-aehnlich": {
    "sources": [
      "k8-lb4-aehnliche-seite"
    ],
    "note": "3.3 KS „Ähnlichkeit“, S. 47"
  },
  "st-k8-pythagoras-hyp": {
    "sources": [
      "k9-lb3-pythagoras-hypotenuse"
    ],
    "note": "3.3 KS „Satzgruppe des Pythagoras“, S. 47"
  },
  "st-k8-pythagoras-kat": {
    "sources": [
      "k9-lb3-pythagoras-kathete"
    ],
    "note": "3.3 KS „Satzgruppe des Pythagoras“, S. 47"
  },
  "st-k8-leiter": {
    "sources": [
      "k9-lb5-leiter"
    ],
    "note": "3.3 KS „Satzgruppe des Pythagoras“, S. 47 („Anwendungsaufgaben“)"
  },
  "st-k8-funktionswert": {
    "sources": [
      "k8-lb3-funktionswert"
    ],
    "note": "3.3 KS „Lineare Funktionen“, S. 48"
  },
  "st-k8-steigung": {
    "sources": [
      "k8-lb3-steigung"
    ],
    "note": "3.3 KS „Lineare Funktionen“, S. 48"
  },
  "st-k8-achsen": {
    "sources": [
      "k8-lb3-achsenabschnitt"
    ],
    "note": "3.3 KS „Lineare Funktionen“, S. 48"
  },
  "st-k8-lgs": {
    "sources": [
      "k8-lb3-lgs"
    ],
    "note": "LGS-Verfahren erst 3.5 KS „Vektoren“, S. 55; in 7/8 nur „Schnittpunkte von Graphen linearer Funktionen“, S. 48"
  },
  "st-k8-laplace": {
    "sources": [
      "k8-lb2-laplace-bruch"
    ],
    "note": "3.3 KS „Zufällige Ereignisse …“, S. 49 (LAPLACE-Versuch)"
  },
  "st-k8-laplace-pct": {
    "sources": [
      "k8-lb2-laplace-prozent"
    ],
    "note": "3.3 KS „Zufällige Ereignisse …“, S. 49"
  },
  "st-k8-gegen": {
    "sources": [
      "k8-lb2-gegenwahrscheinlichkeit"
    ],
    "note": "3.3 KS „Zufällige Ereignisse …“, S. 49 (P(A)+P(Ā)=1)"
  },
  "st-k8-zahlenraetsel": {
    "sources": [
      "k8-lb5-zahlenraetsel"
    ],
    "note": "2.5 Aufgabenpraktikum S. 30; 3.2 KS „Gleichungen und Ungleichungen“ S. 37 (Sachverhalte als Gleichung)"
  },
  "st-k8-rueckwaerts": {
    "sources": [
      "k8-lb5-rueckwaerts"
    ],
    "note": "3.2 KS „Natürliche Zahlen“ S. 36 / „Gleichungen“ S. 37 (Umkehroperationen); 2.5 S. 30 [Mapping geändert ggü. ST_GENERATOR_MAP]"
  },
  "st-k9-potenz-prod": {
    "sources": [
      "k9-lb1-potenz-produkt"
    ],
    "note": "3.4 (Jg. 9) KS „Potenzen und Logarithmen“, S. 51"
  },
  "st-k9-potenz-quot": {
    "sources": [
      "k9-lb1-potenz-quotient"
    ],
    "note": "3.4 (Jg. 9) KS „Potenzen und Logarithmen“, S. 51"
  },
  "st-k9-trig": {
    "sources": [
      "k9-lb3-trig-wert"
    ],
    "note": "3.4 KS „Trigonometrie“, S. 51"
  },
  "st-k9-quadrat-wert": {
    "sources": [
      "k9-lb1-quadrat-wert"
    ],
    "note": "3.4 KS „Quadratische Gleichungen und quadratische Funktionen“, S. 52"
  },
  "st-k9-scheitel": {
    "sources": [
      "k9-lb1-scheitel"
    ],
    "note": "3.4 KS „Quadratische Gleichungen und quadratische Funktionen“, S. 52"
  },
  "st-k9-reinquadratisch": {
    "sources": [
      "k10-lb4-reinquadratisch"
    ],
    "note": "3.4 KS „Quadratische Gleichungen …“, S. 52 (Normalform und Spezialfälle)"
  },
  "st-k9-gleichung": {
    "sources": [
      "k10-lb4-quadratische-gleichung"
    ],
    "note": "3.4 KS „Quadratische Gleichungen …“, S. 52 (Lösungsformel, Lösbarkeitsfälle)"
  },
  "st-k9-parabel": {
    "sources": [
      "k10-lb4-parabel-wert"
    ],
    "note": "3.4 KS „Quadratische Gleichungen und quadratische Funktionen“, S. 52"
  },
  "st-k9-mittelwert": {
    "sources": [
      "k9-lb4-mittelwert"
    ],
    "note": "3.4 KS „Häufigkeitsverteilungen“, S. 52"
  },
  "st-k9-median": {
    "sources": [
      "k9-lb4-median"
    ],
    "note": "3.4 KS „Häufigkeitsverteilungen“, S. 52"
  },
  "st-k9-modal": {
    "sources": [
      "k9-lb4-modalwert"
    ],
    "note": "3.4 KS „Häufigkeitsverteilungen“, S. 52"
  },
  "st-k9-spannweite": {
    "sources": [
      "k7-lb4-spannweite"
    ],
    "note": "3.4 KS „Häufigkeitsverteilungen“, S. 52"
  },
  "st-k10-exp": {
    "sources": [
      "k10-lb1-exp-wachstum"
    ],
    "note": "3.5 KS „Funktionsklassen“, S. 54 („exponentielle Wachstums- und Zerfallsprozesse … modellieren“)"
  },
  "st-k10-kapital": {
    "sources": [
      "k10-lb5-kapital"
    ],
    "note": "NICHT 10 (eigentlich 3.3 KS „Prozentrechnung“, S. 44: Kapital, Zinsen, Zinssatz)"
  },
  "st-k10-zinssatz": {
    "sources": [
      "k10-lb5-zinssatz"
    ],
    "note": "NICHT 10 (eigentlich 3.3 KS „Prozentrechnung“, S. 44)"
  },
  "st-k10-vektor-skalar": {
    "sources": [
      "k1112-lb2-skalarprodukt"
    ],
    "note": "3.5 KS „Vektoren“, S. 55 (Skalarprodukt, Orthogonalität)"
  },
  "st-k10-vektor-betrag": {
    "sources": [
      "k1112-lb2-betrag-vektor"
    ],
    "note": "3.5 KS „Vektoren“, S. 55 (Betrag eines Vektors)"
  },
  "st-k10-erwartung": {
    "sources": [
      "k10-lb2-erwartungswert"
    ],
    "note": "3.5 KS „Zufallsgrößen“, S. 56 (Erwartungswert)"
  },
  "st-k10-erwartung-wuerfel": {
    "sources": [
      "k10-lb2-erwartungswert-wuerfel"
    ],
    "note": "3.5 KS „Zufallsgrößen“, S. 56 (Erwartungswert)"
  },
  "st-k10-rechteck": {
    "sources": [
      "k10-lb3-rechteck-breite"
    ],
    "note": "kein KS in Jg. 10; Anwendung von Gleichungen: 3.3 S. 45 / 3.4 S. 52"
  },
  "st-k10-quadrat-seite": {
    "sources": [
      "k10-lb3-quadrat-seite"
    ],
    "note": "kein KS in Jg. 10; quadratische Gleichung (Anwendung) 3.4 S. 52"
  },
  "st-k10-rechteck-umfang": {
    "sources": [
      "k10-lb3-rechteck-umfang"
    ],
    "note": "kein KS in Jg. 10; Formeln/Gleichungen umstellen 3.3 S. 45 [Mapping geändert ggü. ST_GENERATOR_MAP]"
  },
  "st-k1112-ableitung": {
    "sources": [
      "k1112-lb1-ableitung-stelle"
    ],
    "note": "3.6.1 KS „Grundlagen der Infinitesimalrechnung“, S. 59 (Ableitung an einer Stelle) / „Differentialrechnung“ S. 60"
  },
  "st-k1112-nullstelle": {
    "sources": [
      "k1112-lb1-nullstelle-linear"
    ],
    "note": "nur Teil der Funktionsuntersuchung (3.6.1 S. 60); lineare Nullstelle ist 3.3 KS „Lineare Funktionen“, S. 48"
  },
  "st-k1112-integral": {
    "sources": [
      "k1112-lb1-bestimmtes-integral"
    ],
    "note": "3.6.1 KS „Integralrechnung“, S. 61 (bestimmtes Integral, Hauptsatz)"
  },
  "st-k1112-binomial": {
    "sources": [
      "k1112-lb3-binomialverteilung"
    ],
    "note": "3.6.1 KS „Binomialverteilung“, S. 63"
  },
  "st-k1112-erwartung-binom": {
    "sources": [
      "k1112-lb3-erwartungswert-binom"
    ],
    "note": "3.6.1 KS „Binomialverteilung“, S. 63 (Kenngrößen)"
  }
}
```

## 7. E5-Ergänzungen (umgesetzt in Pack 1.2.0)

Umsetzung: `ST_TOPIC_MAPPINGS` in `src/curriculum/gymSachsenAnhaltPack.ts` (144 spielbare Themen); `ST_GENERATOR_MAP` ist leer. Die ID-Kollisionen `lb4-volumen-quader`/`lb4-oberflaeche-quader` sind klassenqualifiziert (`mathematik-klasse-5:…`). Die Outline wurde NICHT verändert (die Abweichungen aus Abschnitt 4 bleiben Empfehlungen; gespeicherte Themen-IDs bleiben gültig, Themen ohne Mapping sind Outline). Ungenutzte Master, die zum Lehrplan passen, wurden als zusätzliche 1:n-Quellen ergänzt (kein Master doppelt im Pack):

| Pack-Thema | zusätzliche Quelle(n) | Lehrplan |
|---|---|---|
| `st-k5-volumen-quader` | `mathematik-klasse-6:lb4-volumen-quader` | 3.2 KS „Umfang, Flächeninhalt und Volumen“, S. 40 |
| `st-k5-oberflaeche-quader` | `mathematik-klasse-6:lb4-oberflaeche-quader`, `lb4-flaeche-kante-quader` | 3.2, S. 40 (Quader in Sachsituationen) |
| `st-k5-umr-laenge` | `k6-umrechnen-laenge` | 3.2 KS „Größen“, S. 38 |
| `st-k5-umr-flaeche` | `k6-umrechnen-flaeche` | 3.2 KS „Größen“, S. 38 |
| `st-k5-flaeche-rechteck` | `lb5-sachaufgabe-flaeche` | 3.2, S. 40 (Anwendungsaufgaben Umfang/Fläche) |
| `st-k5-flaeche-zus` | `lb4-umfang-zusammengesetzt` | gleicher Inhaltsbereich (Pack-Thema „Zusammengesetzte Flächen“) |
| `st-k6-bruch-add` | `lb1-sachaufgabe-bruch` | 3.2 KS „Gebrochene Zahlen“, S. 38 (Anwendungsaufgaben) |
| `st-k6-haeufigkeit` | `k7-lb4-rel-haeufigkeit` | 3.3 S. 49; Pack-Thema trägt den Titel „Relative Häufigkeit in Prozent“ |

Bewusst ungenutzt (Dubletten ohne Lehrplanforderung): `lb3-umfang-rechteck`, `lb3-flaeche-rechteck`, `lb3-sachaufgabe-geometrie` (identisch zu K5-Mastern). Rundenlänge: keine ST-Themen mit kurzer Runde (Baseline leer).
