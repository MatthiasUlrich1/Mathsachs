# Mathe-Messinstrumente (Winkelmesser, Lineal, Zirkel): Umsetzungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task by task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build three real measuring and construction interactions (`angleProtractor`, `rulerMeasure`, `compassArc`) for the whole portfolio. Then switch the locked Mathe `__neu` topics on angles, segments and construction over to them, by hand.

**Architecture:** Each instrument gets its own task helper (`src/curriculum/measureTaskHelpers.ts`, re-exported from `taskHelpers.ts`), its own `UserInput` kind and `InteractiveConfig` type, and its own React component (SVG with pointer events). Wiring follows the existing `paramSlider` pattern at the same 8 places. Content changes happen only in `src/curriculum/math{5,6,7}NeuTopics.ts`.

**Tech Stack:** React + TypeScript, Vite, Vitest + Testing Library, SVG.

**Spec:** GitHub issue MatthiasUlrich1/Mathsachs#49 plus the rules in `CLAUDE.md` (imported from `.cursor/rules/*.mdc`).

## Global Constraints

- Do **not** change released generators/topics (`src/curriculum/mathN.ts`, `math5AllGraphicReviews.ts`, `graphicReviewTopics.ts`).
- `__neu` topics stay `neu: true` / `released: false`. Do not change `asNeuTopic` defaults.
- Write tasks/variants **by hand**: no bulk scripts, no Python generators. Every variant gets a `dedupeKey`.
- No spoilers: the diagram shows no degree/length labels when the task is "measure" (`generateAngleSvg({ label: '' })`, `showLengthLabels: false`).
- Do not copy Bettermarks texts or graphics. Rebuild the mechanics, write the tasks yourself.
- Before exploring code: `graphify query "<Frage>"`; after code changes: `graphify update .`.
- Every subagent prompt names `CLAUDE.md` and the rule files.
- Models: Tasks 1–5 `sonnet`, Task 6 `haiku`. Do not use Opus for execution without asking the user.

## Review Focus

1. **Touch/stylus** (tablet, phone): all three instruments must work with pointer events (`onPointerDown/Move/Up` + `setPointerCapture`), not mouse events only. Test with `fireEvent.pointerDown/Move/Up`.
2. **Untouched answer in exam:** an instrument that was never moved counts as "not attempted" in `examAnswerAttempted.ts` (no score for the start position).
3. **Worksheet print:** `worksheetPrint.ts` prints a typed answer field (“___ °” / “___ cm”) for all three types, not an empty widget.
4. **Start position does not spoil:** the protractor/ruler start offset from the angle/segment, and the drawing ray does not start at the target angle.
5. **Narrow width (375 px):** the SVG scales with `viewBox` + `width: 100%`. The tolerance logic works in SVG units, not screen pixels.

---

### Task 0 (optional, Opus + user): look at Bettermarks as reference

- [ ] The user signs in to Bettermarks themselves in the browser pane (SchulLogin). Claude does not enter credentials.
- [ ] Claude looks at the protractor, ruler and compass in 1–2 example exercises and notes the **mechanics only** (how the tool is moved/rotated, what is entered, feedback) as notes in this file under “Referenz-Notizen”. No screenshots or texts go into the repo.
- [ ] If skipped: build the mechanics as described in Tasks 1–3.

### Task 1: `angleProtractorTask` (virtual Geodreieck)

The instrument looks like a **Geodreieck** (see Referenz-Notizen): an isosceles right triangle with a 0–180° scale (two directions of reading), zero point at the middle of the long side.

**Files:**
- Create: `src/curriculum/measureTaskHelpers.ts`, `src/components/AngleProtractor.tsx`, `src/components/AngleProtractor.css`
- Test: `src/curriculum/measureTaskHelpers.test.ts`, `src/components/AngleProtractor.test.tsx`
- Modify: `src/curriculum/types.ts` (UserInput, `emptyInputFor`, `InteractiveConfig.type`), `src/curriculum/taskHelpers.ts` (re-export), `src/components/TaskMedia.tsx` (render + initial value as for `paramSlider`, lines ~87 and ~382), `src/exam/examAnswerAttempted.ts`, `src/components/ExamProtocolSheet.tsx`, `src/lib/worksheetPrint.ts`, `src/lib/taskAuthoring.ts` + `src/components/TaskAuthoringPanel.tsx` (new authoring type “Winkelmesser”)

**Interfaces (Produces):**
```ts
// types.ts
| { kind: 'angleProtractor'; degrees: number | null; touched: boolean }
// InteractiveConfig.type += 'angleProtractor'
// measureTaskHelpers.ts
export interface AngleProtractorTaskInput {
  question: string
  mode: 'measure' | 'draw'        // measure: read off the drawn angle; draw: rotate the second leg to the target angle
  angle: number                   // target angle 1..179 (integer)
  startAngle?: number             // rotation of the first leg, default 0
  tolerance?: number              // default 1 (degrees)
  solution: string
  explanation: string
  instruction?: string
}
export const angleProtractorTask: (input: AngleProtractorTaskInput) => Task
```
- `measure`: the angle is drawn without a label. The learner moves and rotates the protractor (snaps onto the vertex within 12 SVG units), reads it off and enters the degrees in the input field of the component. Answer = `degrees` entered.
- `draw`: the first leg and the protractor are fixed on the vertex. The learner rotates the second leg (handle at the end of the ray, 1° steps). Answer = current angle of the leg.
- `check`: `touched && degrees !== null && |degrees − angle| ≤ tolerance`. Also accepts `{ kind: 'value' }` (typed in exam/worksheet) with the same tolerance.

- [ ] **Step 1: Write the failing tests** in `measureTaskHelpers.test.ts`: `angleProtractorTask({mode:'measure', angle:47,…}).check({kind:'angleProtractor',degrees:48,touched:true})` → `true`; `degrees:49` → `false`; `touched:false` → `false`; `{kind:'value',value:'47'}` → `true`; `sampleAnswer` passes `check`; `visualContent` contains no `47°`.
- [ ] **Step 2:** `npx vitest run src/curriculum/measureTaskHelpers.test.ts` → FAIL (helper missing).
- [ ] **Step 3:** Implement the helper + types + re-export.
- [ ] **Step 4:** Tests → PASS.
- [ ] **Step 5: Component test** `AngleProtractor.test.tsx`: renders the SVG with `role="img"` and the protractor group `data-testid="protractor"`; pointerDown/Move on the rotation handle changes `transform`; in `draw` mode, dragging the leg handle calls `onChange` with `touched:true` and a new `degrees`; the start rotation of the leg ≠ target angle.
- [ ] **Step 6:** Component + wiring at all 8 places (look up the pattern with `grep -n "paramSlider"`). Extend the tests in `TaskMedia.test.tsx` and `ExamProtocolSheet.test.tsx` with one case each.
- [ ] **Step 7:** `npx vitest run src/components src/curriculum/measureTaskHelpers.test.ts src/lib/taskAuthoring.test.ts` → PASS. `npx tsc --noEmit` → no errors.
- [ ] **Step 8: Commit** `feat(mathe): Winkelmesser-Interaktion angleProtractorTask`

### Task 2: `rulerMeasureTask` (ruler)

Same structure as Task 1: files `RulerMeasure.tsx/.css`, helper in `measureTaskHelpers.ts`, same 8 wiring places.

**Interfaces (Produces):**
```ts
| { kind: 'rulerMeasure'; length: number | null; touched: boolean }
export interface RulerMeasureTaskInput {
  question: string
  mode: 'measure' | 'draw'        // measure: measure a segment; draw: drag a segment of the target length off the ruler
  lengthCm: number                // target length, 0.5..12, step 0.1
  angle?: number                  // tilt of the segment in degrees, default 0
  tolerance?: number              // default 0.1 (cm)
  unitPx?: number                 // SVG units per cm, default 40
  solution: string
  explanation: string
}
export const rulerMeasureTask: (input: RulerMeasureTaskInput) => Task
```
- Ruler with cm/mm graduation; can be moved and rotated, 0 mark snaps onto the segment end point. `measure`: enter the value in cm (comma allowed). `draw`: drag the end point along the ruler edge, length = distance in cm, rounded to 0.1.
- [ ] Tests (same pattern as Task 1): `lengthCm:4.3` → `4.4` true, `4.5` false, `'4,3'` as `value` true, `touched:false` false, the SVG contains no `4,3`.
- [ ] Implement, wire up, `vitest` + `tsc` green, commit `feat(mathe): Lineal-Interaktion rulerMeasureTask`

### Task 3: `compassArcTask` (compass as a circle tool in the existing editor)

From the Bettermarks review: constructions run on a drawing canvas with a toolbar (point, segment, circle, angle, labelling, delete, move, undo/redo). Mathsachs already has that canvas in `CoordinateGraphEditor` (`coordinateDraw`), but without a circle. So: **no separate compass widget**. Instead, extend the editor with a circle/arc tool and build `compassArcTask` on top of it.

**Files:**
- Modify: `src/lib/coordinateScene.ts` (new object `GraphCircleObj { id; kind: 'circle'; cx; cy; r; arc?: [startDeg, endDeg]; color? }`, add to `GraphObject`), `src/components/CoordinateGraphEditor.tsx` (tool `'circle'`: 1st click = needle point (snap onto existing points), 2nd click/drag = radius; shows the radius live in cm), rendering in `generateCoordinateGridSvg`/scene SVG
- Helper `compassArcTask` in `measureTaskHelpers.ts`; it produces a `coordinateDraw` task with `allowedTools: ['select','point','segment','circle','label','delete']` and its own `check`. No new widget wiring needed (reuses `coordinateDraw` everywhere).
- Test: `src/lib/coordinateScene.test.ts` (extend), `measureTaskHelpers.test.ts`

**Interfaces (Produces):**
```ts
// answer stays { kind: 'coordinateDraw'; scene }; check reads scene.objects.filter(o => o.kind === 'circle')
export interface CompassArcTaskInput {
  question: string
  points: Array<{ id: string; x: number; y: number; label: string }>  // given points (grid units)
  targets: Array<{ centerId: string; radius: number }>                // required arcs (radius in grid units)
  radiusTolerance?: number        // default 0.15 (grid units)
  sameRadius?: boolean            // e.g. perpendicular bisector: all arcs share one radius, value free above minRadius
  minRadius?: number
  solution: string
  explanation: string
}
export const compassArcTask: (input: CompassArcTaskInput) => Task
```
- Learner: choose the circle tool, set the center onto a point (snap), drag the radius (live display “r = 3,0 cm”), let go → circle/arc. Undo via the editor's existing undo; if it has none, add a “Rückgängig” button.
- `check`: for every target there is an arc with the matching center and radius within tolerance. With `sameRadius`, all arcs have the same radius (±tolerance) and `r > minRadius`. No extra arcs around points that are not targets.
- [ ] Tests: perpendicular bisector case (A, B, `sameRadius`, `minRadius: |AB|/2`): two arcs with r=3 at |AB|=4 → true; r=1.9 → false; different radii → false; only one arc → false; triangle SSS case with two fixed radii → true/false.
- [ ] Implement, `vitest` + `tsc` green, commit `feat(mathe): Kreis-Werkzeug im Editor + compassArcTask`

### Task 3b: `constructionStepsTask` (guided construction in steps)

Bettermarks pattern: at the top a **Planfigur** (sketch “nicht maßstabsgetreu” with the given measurements), below that the canvas with “Schritt 1 von 4”; each step has its own short task (“Zeichne nur die Seite c = 10 cm, beginne bei A …”) and is checked separately; after a correct step the next one is unlocked and the drawing so far stays.

**Interfaces (Produces):**
```ts
export interface ConstructionStep {
  instruction: string
  allowedTools: EditorTool[]
  check: (scene: CoordinateScene) => boolean   // checks only what this step adds
}
export interface ConstructionStepsTaskInput {
  question: string
  planFigureSvg: string            // sketch with measurements, NOT to scale
  startScene: CoordinateScene      // e.g. point A + guide line
  steps: ConstructionStep[]        // 2..5
  solution: string
  explanation: string
}
export const constructionStepsTask: (input: ConstructionStepsTaskInput) => Task
// UserInput: { kind: 'constructionSteps'; scene: CoordinateScene; stepIndex: number }
// InteractiveConfig.type += 'constructionSteps'
```
- New component `ConstructionSteps.tsx` wraps `CoordinateGraphEditor` + step indicator + “Schritt prüfen”. Wiring at the 8 places like Task 1. In exam/worksheet: all steps at once, check = all step checks on the final scene.
- Reusable check building blocks in `measureTaskHelpers.ts`: `hasSegment(scene, from, to, lengthCm, tol)`, `hasCircle(scene, centerId, r, tol)`, `hasPointNear(scene, x, y, tol)`, `hasLabel(scene, text)`.
- [ ] Tests: SSS triangle (c = 5, b = 4, a = 3) in 4 steps — correct scene passes each step; wrong length in step 1 → step 1 false; skipping step 2 is not possible (`stepIndex` only increments after a pass).
- [ ] Implement, wire up, `vitest` + `tsc` green, commit `feat(mathe): geführte Konstruktion constructionStepsTask`

### Task 4: switch the `__neu` topics over (content, by hand)

**Files:** `src/curriculum/math5NeuTopics.ts`, `math6NeuTopics.ts`, `math7NeuTopics.ts` and their tests.

**Consumes:** `angleProtractorTask`, `rulerMeasureTask`, `compassArcTask` from Tasks 1–3.

Slider sites to replace (angles; slider = fake protractor):
| File | Line (as of 0.28.146) | Topic | new |
|---|---|---|---|
| math5NeuTopics.ts | ~1871 | `lb3-winkelarten__neu` | `angleProtractorTask` measure |
| math5NeuTopics.ts | ~1947 | `lb3-winkel-ergaenzung__neu` | `angleProtractorTask` draw (draw the supplementary angle) |
| math6NeuTopics.ts | ~1590 | `lb3-winkel-dreieck__neu` | measure γ |
| math6NeuTopics.ts | ~1677 | `lb3-winkel-viereck__neu` | measure δ |
| math7NeuTopics.ts | ~132 / ~211 / ~306 / ~387 | Nebenwinkel / Scheitelwinkel / Winkelsumme Vieleck / Basiswinkel `__neu` | draw (compute, then draw) |

Segments: `lb3-strecken-laenge__neu`, `lb3-strecken-mittelpunkt__neu`, `lb3-strecken-bezeichnung__neu` (math5, ~2550–2735): add at least one `rulerMeasureTask` variant each (measure, or draw for “Zeichne eine Strecke der Länge …”).

Construction: `mittelsenkrechte__neu` (math7, ~419): add a `compassArcTask` variant (`sameRadius`) and a `constructionStepsTask` variant (arcs → intersection points → line). Triangle constructions (SSS/SWS/WSW, if present as a `__neu` topic): `constructionStepsTask`. Also search the remaining `__neu` topics in math6/7 with `grep -niE "konstru|kreis|dreieck"` for constructions and add a compass variant only where it makes sense didactically. List the hits in the commit text.

Rules: keep the existing variants, add or swap them in `mixedVariants`, do not throw any out without replacement. Write every new variant by hand with its own `dedupeKey`, task-specific `explanation`, no spoiler. Leave sliders for computed values (volume, function parameters, math8–12) alone. That is not a fake protractor.

- [ ] Change each topic separately, then `npx vitest run src/curriculum/math5.test.ts src/curriculum/math6.test.ts src/curriculum/math7.test.ts src/curriculum/practiceRoundLength.test.ts` → PASS.
- [ ] Add a new test `src/curriculum/mathNeuMessinstrumente.test.ts`: for each switched topic, 20 seeds produce at least one task of the new type; every `sampleAnswer` passes `check`; all switched topics still have `released === false && neu === true`; `visualContent` of measure tasks contains no target value.
- [ ] Commit `feat(mathe): Neu-Themen Winkel/Strecken/Konstruktion auf Messinstrumente`

---

## Part B: 11 more interactions (from the Bettermarks review)

**Shared for B1–B11** (every task, same pattern as Task 1):
- Helper in `src/curriculum/interactionTaskHelpers.ts` (new, re-exported from `taskHelpers.ts`), component `src/components/<Name>.tsx/.css`, new `UserInput` kind + `InteractiveConfig.type`, wiring at the 8 places (`TaskMedia`, `examAnswerAttempted`, `ExamProtocolSheet`, `worksheetPrint`, `taskAuthoring` + `TaskAuthoringPanel`, `types.ts` `emptyInputFor`).
- Pointer events (touch), `viewBox` + `width:100%`, no solution in the start state, `touched`/not-empty logic for “attempted” in exams, worksheet print = sensible fallback (typed field or empty diagram to draw in).
- Tests: helper `check` (correct/wrong/untouched/`value` fallback where it makes sense, `sampleAnswer` passes `check`) + component (renders, pointer interaction calls `onChange`).
- **Content:** each new interaction gets at least 2 hand-written variants in fitting **`__neu` topics** (find them with `graphify query` / `grep -n "id: '" src/curriculum/math*NeuTopics.ts`). Only `__neu`, lock stays. Name the topics in the commit text.
- At the end, each time: `npx vitest run` (affected) + `npx tsc --noEmit` green, commit `feat(interaktion): <Name>`.

### Task B1: `fractionModelTask` (interactive fraction model)
`{ kind: 'fractionModel'; den: number; shaded: number[] }`. Learner sets the number of parts (stepper 2–12) and colours parts by clicking (bar or circle, `shape: 'bar' | 'circle'`). Input: `target: { num; den }`, `allowEquivalent?: boolean` (default true: 2/4 counts for 1/2). Check: `shaded.length / den === num / target.den` (and `den === target.den` if `allowEquivalent:false`). Use: K5/6 fraction basics, extending/reducing.

### Task B2: `fractionWallTask` (fraction wall)
Wall with rows 1, 1/2 … 1/12 (`rows: number[]`). A vertical comparison line can be moved with a slider; learner clicks tiles. `{ kind: 'fractionWall'; selected: Array<{ row: number; count: number }> }`. Modes: `equivalent` (choose all rows where k tiles are exactly as long as the target), `compare` (choose the longer of two fractions). Use: equivalent fractions, ordering.

### Task B3: `divideToolTask` (dividing tool)
Objects (bars/circles, `count`) are divided into equal parts with a stepper “Teile pro Ganzes”, then the parts are dragged onto `persons` people. `{ kind: 'divideTool'; partsPerWhole: number; assignment: number[] /* part→person */ }`. Check: every person gets the same total share = `count / persons`. Use: fraction as share (“3 pizzas for 4 children”). No Bettermarks images; simple shapes or Commons images with attribution.

### Task B4: `ratioBarTask` (ratio bar)
Bar with `segments` fields; learner colours fields A/B (click toggles). `{ kind: 'ratioBar'; parts: Array<'A' | 'B' | null> }`. Check: count A : count B = `ratio[0] : ratio[1]` (reduced), all fields filled. Optional mode `split`: total amount + typed fields per share. Use: ratios, proportional relationships K6/7.

### Task B5: `numberLineMultiTask` (several labels on the number line)
Several labels (`items: Array<{ id; label; value }>`) are dragged onto a number line (`min, max, step`); snap to `snap` (default step/2). `{ kind: 'numberLineMulti'; positions: Record<string, number> }`. Check: each `|pos − value| ≤ tolerance` (default `snap/2`). Use: ordering fractions/decimals/negative numbers. Coordinate with the existing `NumberLineSlider` (reuse styles).

### Task B6: `treeDiagramTask` (build a tree diagram)
Tree from `levels: Array<{ outcomes: string[] }>` (2 levels, 2–3 branches). Learner fills branch probabilities (fraction/decimal input) and optionally path probabilities at the leaves. `{ kind: 'treeDiagram'; branches: Record<string, string>; leaves: Record<string, string> }` (edge IDs `"0"`, `"0.1"` …). Check: values are numerically equivalent (`3/10` = `0,3`), `blanks` decides which fields are asked; the rest are shown. Use: K7/8 multistage random experiments (path rule, sum rule).

### Task B7: `barChartTask` (build a bar chart)
Learner drags bar heights (snap to `step`) to the data from a table. `{ kind: 'barChart'; values: number[] }`. Input: `categories`, `data`, `yMax`, `step`. Check: every value exact (after snap). Use: K5/6 statistics, frequencies.

### Task B8: `pieChartTask` (pie chart)
Learner moves the sector boundaries (handles on the edge, snap `snapPercent`, default 5 %). `{ kind: 'pieChart'; percents: number[] }`. Check: every share `±tolerance` (default `snapPercent/2`), sum 100. Use: relative frequency, percentages.

### Task B9: `clockTask` (clock with hands)
Drag the hour and minute hands (minute snap 5 or 1). `{ kind: 'clock'; h: number; m: number }`. Modes: `setTime` (set a time), `angle` (set the hands so that they form angle X; check through the angle between the hands ±2.5°). The hour hand moves with the minute hand automatically (realistic). Use: angles on the clock K5, time periods.

### Task B10: `symmetryDrawTask` (complete a symmetric figure)
Grid (`cols × rows`), given figure on one side, axis (`axis: { kind: 'vertical' | 'horizontal' | 'diagonal'; at }`) or symmetry centre (`point`). Learner colours cells by clicking. `{ kind: 'symmetryDraw'; cells: string[] /* "x,y" */ }`. Check: coloured cells = mirror image of the given figure (exact set). Use: axial/point symmetry K5/6.

### Task B11: exploration board (`exploreBoard`, not graded)
A learning board like a Bettermarks Tafelbild: slider + checkboxes change an SVG live. **No task type**, but an optional `fachwissen.explore?: { boardId: string; params?: Record<string, number> }` on the topic. Boards are pure functions in `src/lib/exploreBoards.ts` (registry `Record<string, { controls; render(state): string }>`), so curriculum packs only store IDs. Component `ExploreBoard.tsx` in the Fachwissen panel. 3 boards to start: `mittelsenkrechte` (equal radii around A/B, toggle line), `winkelarten` (slider 0–360°, shows the type of angle), `bruchErweitern` (num/den × k, bar model). Hook into the matching `__neu` topics.

---

### Task 5: update rules and docs

- [ ] `.cursor/rules/math-interaction-guards.mdc`: replace the sections “Winkelmessen” and “Strecken messen” with `angleProtractorTask` / `rulerMeasureTask`; new section “Konstruktion” → `compassArcTask`; add the sentence “`paramSliderTask` is **not** a protractor/ruler substitute, only for parameters/computed values.”
- [ ] `docs/TESTCHECKLISTE-grafik-interaktiv.md`: add the widget legend “Winkelmesser, Lineal, Zirkel”.
- [ ] Commit `docs: Interaktions-Guards für Messinstrumente`

### Task 6: shipping (Haiku)

- [ ] `npx vitest run` (all) and `npx tsc --noEmit` → green. `npm run lint` → no new errors.
- [ ] Bump the pack version + CHANGELOG entry (pattern from the latest entries), curricula export with `scripts/export-curriculum-pack.ts` (look up the call in CHANGELOG/package.json).
- [ ] `graphify update .`
- [ ] Push the branch `feat/mathe-messinstrumente`, open a PR referencing `Closes #49`. **Do not merge** – the user tests first (Prüfer/Entwickler view).

Task 5 additionally: `math-interaction-guards.mdc` gets a short list of all new interactions B1–B11 with “use for …” (one line each), and `taskAuthoring.ts` lists them in the type selection.

## After that (separate plans, not part of this one)

- Further Bettermarks interactions (virtual balance, unit circle, 3D solids).
- The same quality pass for other subjects/curricula according to `docs/LEHRPLAN-QUALITAETSPLAN.md`.

## Referenz-Notizen (Task 0, done on 2026-11-15)

Only the mechanics are noted. No texts or graphics were taken over. No answers were submitted in the user's account.

- **Geodreieck instead of a round protractor:** German schools measure with the Geodreieck (set square with a semicircular scale). Our protractor should look like a Geodreieck (triangle with a 0–180° scale, zero point at the middle of the long side). Bettermarks has an image choice task “how do you place the Geodreieck correctly?” → our own variant possible with `choicePick` + 3 of our own SVGs (allowed, because this is about the instrument, not a label diagram).
- **Construction canvas:** toolbar point, segment, circle (also measures lengths), angle, labelling, delete, move, undo/redo. Planfigur at the top, steps (“Schritt 1 von 4”) with their own instruction each. → Tasks 3 + 3b.
- **Exploration boards (Tafelbilder):** a slider plus checkboxes change the geometry live (e.g. circles of equal radius around A and B, checkbox “Mittelsenkrechte” shows the line). These are learning boards, not graded tasks.

### Further interactions found (backlog, own plans later)

| Interaction | Bettermarks topic | exists in Mathsachs? | Use |
|---|---|---|---|
| Interactive fraction model (numerator/denominator steppers, bar/circle updates live) | Anteile, Brüche | SVG only, not interactive | K5/6 fractions, comparing fractions |
| Fraction wall with slider | Anteile, Brüche | no | equivalent fractions, ordering |
| Dividing tool (cut chocolate/pizza into equal parts) | Anteile, Brüche | no | introducing fractions |
| Ratio bar (e.g. 1 : 3, divide bar into parts) | Anteile, Brüche | no | ratios, proportional relationships |
| Several labels onto the number line (drag) | Brüche, numbers | `numberLine` only one value | ordering fractions/decimals |
| Build a tree diagram (fill branches, place objects) | Mehrstufige Zufallsexperimente | no | K7/8 probability, path rules |
| Build a bar chart (drag bar heights) | Daten und Häufigkeiten | no | K5/6 statistics |
| Pie chart with slider | Daten und Häufigkeiten | no | relative frequency, percent |
| Clock with movable hands | Kreise und Winkel | no | angles on the clock |
| Symmetry drawing (one half is mirrored) | Kreise und Winkel | no | axial/point symmetry |
| Exploration board (slider + checkboxes, live) | many | `paramSlider` partly | learning boards / Fachwissen panel |

Suggested order for later: fraction model + several labels on the number line → tree diagram → bar/pie chart → ratio bar → clock/symmetry → exploration boards.
