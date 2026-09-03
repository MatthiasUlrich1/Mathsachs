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

## Project structure

```
src/
  math.ts        # Pure problem-generation + answer-checking logic
  math.test.ts   # Vitest unit tests for the math engine
  App.tsx        # Game UI and state
  App.css        # Component styles
  index.css      # Global theme
```

## Cloud Agent environment

`.cursor/environment.json` configures the Cursor Cloud Agent environment:
`npm ci` installs dependencies and the `dev` terminal runs the Vite dev server
on port 5173.
