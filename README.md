# Mathsachs

Ein **lehrplanorientiertes Mathematik-Übungsprogramm** für das Gymnasium in
Sachsen (aktuell **Klasse 6**). Schülerinnen und Schüler wählen aus den
Lernbereichen des Lehrplans einzelne Themen aus und üben sie entweder direkt am
Bildschirm oder erzeugen ausdruckbare Übungsblätter. Gebaut mit React,
TypeScript und Vite.

## Funktionen

- **Lehrplan-Themen** (Gymnasium Sachsen, Klasse 6) in aufklappbaren
  Lernbereichen:
  - Arbeiten mit gebrochenen Zahlen (Kürzen, Erweitern, Vergleichen, Grundrechenarten mit Brüchen und Dezimalzahlen, Umwandeln, Runden)
  - Zuordnungen in der Umwelt (Dreisatz, antiproportional, relative Häufigkeit)
  - Dreiecke und Vierecke (Winkelsummen, Umfang, Flächeninhalt)
  - Prismen (Volumen, Oberfläche)
  - Vernetzung: Anteile (Bruch- und Prozentanteile)
- **Direkt üben** im Programm mit sofortiger Auswertung.
- **Erklärung anzeigen** bei falschen Aufgaben (Schritt-für-Schritt-Lösungsweg).
- **Übungsblätter drucken** (oder als PDF speichern) inklusive Lösungsteil.
- **Mehrere Benutzer**: Punkte werden pro Name gespeichert.
- **Punkteprotokoll**: Auswertung je Thema in Prozent und Gesamtpunktzahl,
  ebenfalls druckbar.
- **Erweiterbar** für weitere Klassenstufen und Fächer (Datenmodell mit
  Fach → Klassenstufe → Lernbereich → Thema).

> Fachliche Grundlage: Sächsischer Lehrplan Gymnasium Mathematik. Die Aufgaben
> werden zufällig generiert und haben stets eindeutige, überprüfbare Lösungen.

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
  curriculum/         # Lehrplan data model + Klasse-6 topics & generators
  components/         # UI: accordion browser, practice, worksheet, protocol
  App.tsx             # Views, routing and user management
  App.css             # Component styles
  index.css           # Global theme
electron/
  main.cjs            # Electron main process (creates the app window)
  preload.cjs         # Preload bridge
build/
  icon.svg / icon.png # App icon used by the installers
electron-builder.yml  # Desktop packaging config (win / mac / linux targets)
```

## Cloud Agent environment

`.cursor/environment.json` configures the Cursor Cloud Agent environment:
`npm ci` installs dependencies and the `dev` terminal runs the Vite dev server
on port 5173.
