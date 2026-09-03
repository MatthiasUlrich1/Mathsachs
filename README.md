# Mathsachs

A fast, modern **mental-math practice** web app. Pick a difficulty and the
operations you want to drill, then answer as many problems as you can before the
60-second timer runs out. Built with React, TypeScript, and Vite.

## Features

- Four operations (`+`, `−`, `×`, `÷`) with three difficulty tiers.
- Clean integer answers only — subtraction never goes negative and division
  always resolves to a whole number.
- Live score, streak, accuracy, and a countdown timer.
- Polished, responsive dark UI.

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
  math.ts             # Pure problem-generation + answer-checking logic
  math.test.ts        # Vitest unit tests for the math engine
  App.tsx             # Game UI and state
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
