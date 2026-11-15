# "Schulheft & Tafel" design: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use `- [ ]`.

**Goal:** Replace the generic dark "AI app" look (slate background, indigo/cyan glow, uppercase labels) with its own learning and school design: light mode = **Schulheft** (squared paper, ink, red correction pen, highlighter), dark mode = **Tafel** (green-slate board, chalk).

**Architecture:** One central token system (CSS custom properties in `src/index.css`) for both themes. All hard-coded colours in `App.css`, `components/*.css` and inline SVG colours are moved to tokens. Fonts are self-hosted (Electron/LAN mode runs offline). Print/worksheets stay black on white and are not themed.

**Tech Stack:** React + Vite + plain CSS, `@fontsource` packages.

**Spec:** User request 2026-11-15: "a new modern design instead of the standard AI app design. It should have something to do with learning and school." Skill: `frontend-design`.

## Audience and job

Pupils at Gymnasium Sachsen (grade 5–12) practise maths/history/biology/physics, collect points and play class duels; teachers create exams/challenges; Prüfer check new tasks. The app's main job: **work on a task in concentration and get clear feedback**. The design must therefore be calm, highly legible and unambiguous with right/wrong — but feel like school rather than an office tool.

## Design tokens

### Colours — light "Heft" (default)

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#FBFCFE` | Page/sheet (cool white, **not** cream) |
| `--grid` | `#DCE6F2` | Squared-paper lines (5 mm grid ≈ 20 px) |
| `--ink` | `#1D3FA8` | Royal blue ink: primary actions, links, active state |
| `--graphite` | `#23272F` | Body text |
| `--pencil` | `#5B6472` | Secondary text, hints |
| `--correction` | `#D62839` | Red correction pen: margin line, wrong, errors |
| `--tick` | `#1E8E4F` | Correct (green check mark) |
| `--marker` | `#FFE14D` | Yellow highlighter: points, rewards, "neu" |

### Colours — dark "Tafel" (`prefers-color-scheme: dark` or toggle)

| Token | Hex |
|---|---|
| `--paper` | `#1E3B35` (board green-slate) |
| `--grid` | `#2A4A43` |
| `--ink` | `#9CC7F2` (blue chalk) |
| `--graphite` | `#EEF2EA` (white chalk) |
| `--pencil` | `#B5C2B8` |
| `--correction` | `#F28B82` |
| `--tick` | `#8FD19E` |
| `--marker` | `#F6E27A` (yellow chalk) |

Additionally derived: `--surface` (sheet on the background), `--line` (borders), `--focus` (= `--ink`, 3 px outline). Contrast ≥ 4.5:1 for text on `--paper` in both themes — verify with a test/tool.

### Type

- **Headings:** *Bricolage Grotesque* (variable, `@fontsource-variable/bricolage-grotesque`), weights 600–800, slightly narrowed — personality without a kids' font.
- **Body + task text:** *Atkinson Hyperlegible* (`@fontsource/atkinson-hyperlegible`), designed for maximum legibility (clear distinction between 1/l/I, 0/O) — ideal for maths tasks. Numbers in answer fields `font-variant-numeric: tabular-nums`.
- No monospace for labels; monospace only where real code/digit grids require it (DigitGrid may stay).
- Scale (rem): 0.875 / 1 / 1.125 / 1.375 / 1.75 / 2.25; line-height 1.5 body, 1.15 headings; line length ≤ 70ch.
- **Remove all uppercase labels** (e.g. "NEUEN BENUTZER ANLEGEN") → sentence case.

### Layout

Signature element (the one bold thing): **the exercise-book page with its red margin**.

```
┌───────────────────────────────────────────────┐  ← Body: --paper with squared-paper grid
│ [Logo] TaskTrophy        Name-Etikett  ★ 340  │  ← Header like a book label: framed box, points marked with highlighter
├──┬────────────────────────────────────────────┤
│  │  Aufgabe 3 von 10                          │
│✓ │  Miss den Winkel α mit dem Geodreieck.     │  ← Margin column (red double line on the left).
│  │                                            │    Feedback appears there as a correction mark:
│  │   [ Widget / interaction on squared paper ]│    ✓ green / ✗ red / "f" for errors
│  │                                            │
│  │  [ Prüfen ]                                │
└──┴────────────────────────────────────────────┘
```

- Content **left-aligned** (like writing in an exercise book), never centred except on the login screen.
- The sheet (`.sheet`) is the only "card": white page on the squared paper with a subtle paper shadow; inside it no further nested cards, but sections with a light ruled line. Radii by hierarchy: sheet 14 px, buttons/fields 10 px, chips 999 px.
- Mobile (< 560 px): margin column shrinks to 28 px, correction mark stays visible, header label wraps.

### Principles

1. **School objects instead of tech decoration:** no glow gradients, no glass, no neon. Every decoration has a counterpart in a real exercise book (squared paper, margin, ink, highlighter, chalk).
2. **Red belongs to the correction:** red only for errors/margin/destructive actions — never as a decorative accent.
3. **Highlighter = reward:** yellow only for points, trophies, streaks, "Neu" — so it stays special.
4. **Calm surface around the task:** the task area has the most white space; navigation recedes (pencil grey).
5. **Motion only as an answer:** a single animation — the correction mark is "drawn" into the margin when the answer is checked (`stroke-dashoffset`, 250 ms); `prefers-reduced-motion` → appears without animation.

### Review against generic defaults (done)

- The first draft had a "cream background + serif display" → that is the typical AI tell (cream/terracotta). **Changed** to cool white paper with a blue squared-paper grid and a sans display.
- The dark theme as "near-black + one neon accent" would have been default → **changed** to board green with chalk colours (subject-specific).
- "Cards everywhere" (the current state is all rounded cards with shadows) → **reduced** to one sheet with ruled sections.
- Uppercase eyebrow labels and monospace labels from the current state → **removed**.

## Global Constraints

- Do not change functionality/tests semantically; tests that check colours/classes are adapted to tokens.
- Print/worksheet (`worksheetPrint.ts`, print CSS) stays black/white, independent of theme.
- New widgets (Geodreieck, ruler … symmetry) use tokens; SVG colours via `var(--…)` in inline SVG. Generated SVG strings for print keep fixed print colours.
- Released curriculum files unchanged (only styling).
- Fonts self-hosted, no CDN (Electron/LAN offline).
- Commit trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. Do not push. Branch `feat/lern-design` (based on `feat/mathe-messinstrumente`).

## Review Focus

1. Contrast in both themes (text, buttons, focus, disabled).
2. Right/wrong unambiguous without colour alone (✓/✗ symbol + text).
3. No leftovers of the old palette (`#0f172a`, `#1e293b`, `#6366f1`, `#22d3ee`, indigo/cyan glows) — grep test.
4. Mobile 375 px: header, margin column, widgets without horizontal scrolling.
5. Print unchanged black/white.

---

### Task D1: foundation — tokens, fonts, theme, base elements

**Files:** `package.json` (fonts), `src/main.tsx` (font imports), `src/index.css` (tokens light/dark, body with squared-paper grid, base elements button/input/select/a/headings/focus-visible/disabled), `src/lib/theme.ts` (pure: `resolveTheme(pref: 'system'|'heft'|'tafel', systemDark: boolean)`; persistence via localStorage with try/catch), theme toggle in the existing settings or header area.

- [ ] Fonts via `npm i @fontsource-variable/bricolage-grotesque @fontsource/atkinson-hyperlegible` (check that the packages exist; if one is missing: choose a fitting alternative and document it).
- [ ] Token sets as in the tables above, `:root` = Heft, `[data-theme="tafel"]` and `@media (prefers-color-scheme: dark) :root:not([data-theme="heft"])` = Tafel.
- [ ] Test: `theme.ts` (resolve + storage errors); a test that `index.css` defines all tokens in both themes; contrast test for the text pairs (WCAG formula as a pure function).

### Task D2: App shell and App.css

**Files:** `src/App.css`, `src/App.tsx` (only class names/structure of the shell, no logic).

- [ ] Header as a book label (logo, user name, points with highlighter), sheet `.sheet` with margin column (`.sheet__margin`, red double line), sections with a ruled line instead of nested cards.
- [ ] Replace all 219 colour values in `App.css` with tokens; remove glows/gradients; convert uppercase/letter-spacing labels to sentence case.
- [ ] Grep test: no old palette hex values in `src/**/*.css`.

### Task D3: components and widgets

**Files:** all `src/components/*.css` (385 colour values) and inline SVG colours in `src/components/*.tsx` / `src/lib/*.ts` (27 files), except print paths.

- [ ] Map colours to tokens; for SVG `fill="var(--ink)"` etc. Shared semantic SVG tokens: `--svg-line`, `--svg-fill-a/b` (two clearly distinguishable shading colours for fraction/ratio/pie), `--svg-highlight`.
- [ ] Adapt tests that assert fixed hex values to tokens (do not weaken them; check the token name instead).
- [ ] Print strings (`*PrintSvg`, `worksheetPrint.ts`) keep fixed print colours — test that no `var(--` appears in print output.

### Task D4: signature — correction marks in the margin

**Files:** `PracticeSession.tsx`, `ExamRunner.tsx` (only where exam feedback is shown), new `src/components/CorrectionMark.tsx/.css`.

- [ ] After checking: ✓ (`--tick`) or ✗ (`--correction`) as a hand-drawn SVG path in the margin column, with a text alternative ("Richtig"/"Leider falsch") for screen readers, drawn with stroke-dashoffset 250 ms, `prefers-reduced-motion` without animation.
- [ ] Points/rewards with a highlighter stripe (`--marker`), the "Neu" badge as a highlighter mark.
- [ ] Copy check: buttons named by action ("Prüfen", "Nächste Aufgabe"), no uppercase.

### Task D5: visual QA (controller in the browser)

- [ ] Controller checks via browser: login, home, topic overview, practice session with 4 different widgets, exam, teacher area; each at 1280 px and 375 px, Heft and Tafel. Screenshots → one fix list → one fix subagent → one re-review.
