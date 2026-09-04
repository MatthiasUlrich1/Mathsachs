# Changelog

Alle nennenswerten Änderungen an **Mathsachs** werden in dieser Datei
dokumentiert.

Das Format orientiert sich an
[Keep a Changelog](https://keepachangelog.com/de/1.1.0/), und das Projekt folgt
der [Semantischen Versionierung](https://semver.org/lang/de/).

## [Unreleased]

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

[Unreleased]: https://github.com/MatthiasUlrich1/Mathsachs/compare/v0.1.9...HEAD
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
