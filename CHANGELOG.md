# Changelog

Alle nennenswerten Änderungen an **Mathsachs** werden in dieser Datei
dokumentiert.

Das Format orientiert sich an
[Keep a Changelog](https://keepachangelog.com/de/1.1.0/), und das Projekt folgt
der [Semantischen Versionierung](https://semver.org/lang/de/).

## [Unreleased]

### Geplant für v0.1.2

#### Hinzugefügt

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

[Unreleased]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/MatthiasUlrich1/Mathsachs/releases/tag/v0.1.0
