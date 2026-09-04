# Mathsachs

Ein **lehrplanorientiertes Mathematik-Übungsprogramm** für das Gymnasium in
Sachsen (**Klasse 5 bis Jahrgangsstufe 11/12**). Schülerinnen und Schüler wählen
aus den Lernbereichen des Lehrplans einzelne Themen aus und üben sie entweder
direkt am Bildschirm oder erzeugen ausdruckbare Übungsblätter. Lehrkräfte können
daraus **Übungsklausuren** zusammenstellen und als Code oder Link an eine Klasse
verteilen. Gebaut mit React, TypeScript und Vite.

## Funktionen

- **Lehrplan-Themen** (Gymnasium Sachsen) für **Klasse 5, 6, 7, 8, 9, 10 und die
  Jahrgangsstufe 11/12 (Grundkurs)** als nachladbare Module. Jede Klasse ist in
  aufklappbaren Lernbereichen organisiert – von natürlichen Zahlen und Brüchen
  über rationale Zahlen, Terme und Gleichungen, Funktionen, Pythagoras und
  Trigonometrie bis hin zu Differential-/Integralrechnung, Vektoren und
  Binomialverteilung.
- **Themen-Suche**: Stichwortsuche über die geladenen Klassen –
  case-insensitive, teilstring-basiert und umlaut-tolerant (z. B. „Fläche“ ↔
  „flaeche“). Passt ein Stichwort zu einer verfügbaren, aber nicht geladenen
  Klasse, wird ein entsprechender Hinweis angezeigt.
- **Einheiten umrechnen**: Länge, Flächeninhalt, Volumen, Masse und Zeit mit
  eindeutiger Lösung und Erklärung des Umrechnungsfaktors.
- **Direkt üben** im Programm mit sofortiger Auswertung.
- **Erklärung anzeigen** bei falschen Aufgaben (Schritt-für-Schritt-Lösungsweg).
- **Übungsblätter drucken** (oder als PDF speichern) inklusive Lösungsteil.
- **Mehrere Benutzer**: Punkte werden pro Name gespeichert.
- **Punkteprotokoll**: Auswertung je Thema in Prozent und Gesamtpunktzahl,
  ebenfalls druckbar.
- **Übungsklausur per Code**: Lehrkräfte stellen aus Lehrplan-Themen eine
  Klausur zusammen; Schülerinnen und Schüler lösen denselben Satz Aufgaben über
  einen Code oder Link (siehe [Übungsklausur per Code](#übungsklausur-per-code)).
- **Erweiterbar** für weitere Klassenstufen und Fächer (Datenmodell mit
  Fach → Klassenstufe → Lernbereich → Thema).

Eine Übersicht aller Änderungen findet sich im [Changelog](CHANGELOG.md)
(aktuelle Version **0.1.5**).

Die App prüft beim Start die öffentlichen
[GitHub Releases](https://github.com/MatthiasUlrich1/Mathsachs/releases)
auf eine neuere Version (ohne Token). Ist ein Update da, erscheint ein
schließbarer Hinweis mit Versionsnummer, Release-Notes und Download. Im
Browser öffnet **Download** den passenden Installer bzw. die Releases-Seite;
die installierte Desktop-App kann das Update herunterladen und einspielen.

> Fachliche Grundlage: Sächsischer Lehrplan Gymnasium Mathematik. Die Aufgaben
> werden zufällig generiert und haben stets eindeutige, überprüfbare Lösungen.

## Übungsklausur per Code

Lehrkräfte stellen eine Übungsklausur aus konkreten Aufgaben des Lehrplans
zusammen. Die App erzeugt daraus einen **Klausurcode** (beginnt mit `MSX1:`)
sowie einen **teilbaren Link** (`…#klausur=…`) und einen **QR-Code**. Es wird
kein Server benötigt: Der Code enthält nur Verweise auf Thema und Zufalls-Seed,
die App erzeugt daraus auf jedem Gerät dieselben Aufgaben.

### Als Lehrkraft: Klausur erstellen

1. Im Reiter **Lehrpläne** die gewünschten Klassen laden (z. B. Klasse 6).
2. Reiter **Klausur erstellen** öffnen.
3. **Schritt 1 – Themen:** Lernbereiche aufklappen und die Themen per Checkbox
   vorauswählen.
4. **Schritt 2 – Aufgaben:** Pro Thema erscheinen fünf konkrete
   Vorschlagsaufgaben (mit Lösung zur Kontrolle). Per Checkbox die gewünschten
   Aufgaben auswählen, Punkte ggf. anpassen. „Neue Vorschläge“ erzeugt andere
   Zahlen zum selben Thema.
5. **Schritt 3 – Code:** Titel vergeben. Die App zeigt Klausurcode, Link und
   QR-Code.

### An die Klasse verteilen

Den **Link** (oder den Code bzw. den QR-Code) z. B. auf der **Schulwebseite**,
in der Lernplattform oder per E-Mail teilen. Wer den Link öffnet, landet direkt
in **Klausur schreiben** mit derselben Aufgabenliste.

### Als Schülerin oder Schüler: Klausur schreiben

1. Mit dem eigenen Namen anmelden (Punkte werden unter diesem Namen gespeichert).
2. Den geteilten Link öffnen **oder** den Reiter **Klausur schreiben** wählen und
   den Code einfügen (beginnt mit `MSX1:`).
3. Die Aufgaben der Reihe nach bearbeiten und die Klausur **abgeben**.
4. Die Auswertung zeigt je Aufgabe die eigene Antwort, die richtige Lösung und
   die Erklärung. Über **Ähnliche Aufgabe üben** kann dasselbe Thema mit neuen
   Zahlen weiter geübt werden.

> Der Code ist für **Übungsklausuren** gedacht, nicht für benotete Prüfungen:
> Aufgaben und Lösungen werden lokal erzeugt und sind nicht manipulationssicher.

## Requirements

- Node.js 20+ (developed against Node 22)
- npm 10+

## Getting started

```bash
npm ci          # install exact, locked dependencies
npm run dev     # start the Vite dev server at http://localhost:5173
```

## Scripts

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Start the dev server with hot reload.        |
| `npm run build`     | Type-check and produce a production build.    |
| `npm run preview`   | Preview the production build locally.         |
| `npm run typecheck` | Run the TypeScript compiler (no emit).        |
| `npm run lint`      | Lint the project with ESLint.                 |
| `npm run test`      | Run the Vitest unit suite once.              |

## Desktop app (installable setup)

Mathsachs can also be installed as a native desktop application via **Electron**.

### Install (end users)

Download the installer for your operating system from the project's
[GitHub Releases](https://github.com/MatthiasUlrich1/Mathsachs/releases) and run it:

| OS      | File                          | How to install                              |
| ------- | ----------------------------- | ------------------------------------------- |
| Windows | `Mathsachs-Setup-x.y.z.exe`   | Double-click and follow the setup wizard.   |
| macOS   | `Mathsachs-x.y.z.dmg`         | Open the `.dmg` and drag Mathsachs to Apps. |
| Linux   | `Mathsachs-x.y.z.AppImage`    | `chmod +x` then run it — no install needed. |
| Linux   | `mathsachs_x.y.z_amd64.deb`   | `sudo apt install ./mathsachs_*.deb`        |

**Windows-Hinweis (SmartScreen):** Weil die App von einer Privatperson kommt und
nicht mit einem kostenpflichtigen Code-Signing-Zertifikat signiert ist, warnt
Windows oft mit „Windows hat den PC geschützt“ bzw. unbekanntem Herausgeber.
Das ist bei diesem Setup erwartbar und kein Virenfund.

1. Den Installer **nur** von den offiziellen
   [GitHub Releases](https://github.com/MatthiasUlrich1/Mathsachs/releases)
   laden – nicht aus unbekannten Quellen.
2. Bei der Warnung **„Weitere Informationen“** klicken.
3. Dann **„Trotzdem ausführen“** wählen (manchmal **„Trotzdem installieren“**).

### Build installers yourself

Installers are produced by [`electron-builder`](https://www.electron.build/).
Each installer is built on its matching operating system:

```bash
npm run electron:dev          # run the desktop app in development
npm run electron:dist:linux   # build .AppImage + .deb   (run on Linux)
npm run electron:dist:win     # build .exe setup         (run on Windows)
npm run electron:dist:mac     # build .dmg               (run on macOS)
```

Output is written to the `release/` directory. Building the Debian package on
Linux requires `fakeroot` (`sudo apt-get install fakeroot`).

The cross-platform installers are produced automatically by the
[`release` GitHub Actions workflow](.github/workflows/release.yml), which builds
Windows, macOS, and Linux artifacts. Push a `v*` tag to attach them to a
GitHub Release, or run the workflow manually from the Actions tab.

## Project structure

```
src/
  lib/                # Reusable engine: rng, fractions, number parsing, storage
  curriculum/         # Lehrplan-Datenmodell, Klassen 5–12, Einheiten & Themen-Suche
  exam/               # Klausur-Code (Kodierung, Link, Auflösung der Aufgaben)
  legal/              # Impressum, MIT-Lizenztext, Ideenmelder-mailto
  updates/            # GitHub-Releases-Updateprüfung (Semver, Assets, Banner)
  components/         # UI: Browser, Üben, Übungsblatt, Protokoll, Klausur, Update-Hinweis, Rechtliches
  App.tsx             # Views, routing and user management
  App.css             # Component styles
  index.css           # Global theme
electron/
  main.cjs            # Electron main process (window + update check)
  preload.cjs         # Preload bridge (desktop + updates)
  githubUpdate.cjs    # GitHub-Releases-Fallback für Updates
build/
  icon.svg / icon.png # App icon used by the installers
electron-builder.yml  # Desktop packaging config (win / mac / linux targets)
```

## Cloud Agent environment

`.cursor/environment.json` configures the Cursor Cloud Agent environment:
`npm ci` installs dependencies and the `dev` terminal runs the Vite dev server
on port 5173.

## Lizenz

Mathsachs steht unter der [MIT-Lizenz](LICENSE).
Copyright © 2026 Linus und Matthias Ulrich.

Den vollständigen Lizenztext findest du in der Datei [`LICENSE`](LICENSE)
und in der App unter **Lizenz**.

## Impressum

Linus und Matthias Ulrich  
Große Wallstraße 42  
04509 Delitzsch  
[info@my-smart-home-support.de](mailto:info@my-smart-home-support.de)

In der App ebenfalls unter **Impressum**.

## Idee / Feedback

Über **Idee / Feedback** in der App (oder den folgenden Link) öffnet sich das
Standard-Mailprogramm mit vorausgefülltem Empfänger und Betreff:

[Idee / Feedback zum Mathsachs Übeungsprogramm.](mailto:info@my-smart-home-support.de?subject=Idee%20%2F%20Feedback%20zum%20Mathsachs%20%C3%9Cbeungsprogramm.)

- An: `info@my-smart-home-support.de`
- Betreff: `Idee / Feedback zum Mathsachs Übeungsprogramm.`
