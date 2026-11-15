# Fixes after PR #50: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use `- [ ]`.

**Goal:** Three fixes the user approved on 2026-11-15 after testing PR #50, on branch `feat/mathe-messinstrumente`.

**Architecture:** Small, independent changes, following the established patterns (pure logic in `src/lib/*`, no DOM test environment, no new devDependencies).

**Tech Stack:** React + TypeScript + Vitest.

**Spec:** User decisions in the chat (2026-11-15): 1. limit ruler rotation, 2. hide locked topics completely from students, 3. angle tool in the construction editor + SWS/WSW constructions.

## Global Constraints

- Released files (`src/curriculum/math5.ts`…`math11_12.ts`, `math5AllGraphicReviews.ts`, `graphicReviewTopics.ts`) remain unchanged.
- `__neu` topics stay `neu: true` / `released: false`.
- Content is written by hand, according to `CLAUDE.md` + `.cursor/rules/*.mdc` (incl. section 7 in `curriculum-aufgaben-qualitaet.mdc` and the widget build rules in `math-interaction-guards.mdc`).
- Run `graphify query` before exploring code. Commit trailer: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. Do not push.
- When editing regexes: check the bytes afterwards with `grep -n` (backslashes have been lost in the past).

## Review Focus

1. A student/teacher must not see a locked topic **anywhere** (topic overview, practice selection, exam/challenge/worksheet creation, search, counters).
2. Prüfer/Entwickler still see everything.
3. The ruler stays operable at every allowed rotation (both grips inside the viewBox).
4. Angle tool: values exact in degrees, snap, touch-operable, without spoilers.

---

### Task C1: limit the ruler rotation to ±45°

**Files:** `src/lib/rulerGeometry.ts`, `src/components/RulerMeasure.tsx`, tests in `src/lib/rulerGeometry.test.ts`.

- [ ] New constant `RULER_MAX_ROTATION = 45` (degrees, relative to horizontal, both directions; additionally the range 180±45° stays **forbidden** — the ruler does not need to be upside down). Pure function `clampRulerRotation(rot: number): number` → nearest allowed value in [-45, 45] (normalised as 315..360 ∪ 0..45).
- [ ] Apply it during rotate drag before `clampRulerPose`; the snap onto the segment direction (±15° segments) stays possible.
- [ ] Tests: sweep 0..359 → result always in the allowed range; at every allowed rotation, for unitPx 20 and 40 and poses at all 4 edges, **both** grips (0-mark + rotation handle) are inside the viewBox after `clampRulerPose`; existing start poses (`rot` 4..11) remain valid.
- [ ] Update the "known issue" section in `docs/TESTLISTE-neue-interaktionen.md` (entry removed / marked as fixed).

### Task C2: hide locked topics completely for all non-preview roles

**Files:** find all places where topics are listed or picked for selection (`grep -rn "released" src/components src/lib src/App.tsx`, `topicUnavailable`, topic pickers in exam/challenge/worksheet/class, search).

- [ ] Central pure function `isTopicVisible(topic: Topic, role): boolean` = `topic.released !== false || isCurriculumPreviewRole(role)` in `src/lib/roles.ts` or `src/lib/topicVisibility.ts`; tests for schueler/lehrer/teacher/undefined (locked → false), pruefer/entwickler (→ true), released/without `released` (→ true).
- [ ] Use it **everywhere** topics are shown to users: CurriculumBrowser (locked topics no longer shown greyed out, but filtered out — including counters such as "x Themen" and empty Lernbereiche, which then disappear), practice selection, the teacher's exam/challenge/worksheet/task generator pickers, search. The existing `topicUnavailable` logic stays for genuine `outlineOnly` placeholders.
- [ ] Report: a list of all places found, each with the decision "filtered" or "not relevant (because …)".
- [ ] Tests for at least CurriculumBrowser (markup via `renderToStaticMarkup`: student does not see `__neu`, Prüfer does) and one teacher picker.

### Task C3: angle tool in the construction editor + SWS/WSW constructions

**Files:** `src/lib/coordinateScene.ts` (new object `GraphAngleRayObj` or a ray with a fixed angle — the implementer decides, documented), `src/components/CoordinateGraphEditor.tsx` (tool `'angle'`), `src/curriculum/measureTaskHelpers.ts` (predicate `hasAngleAt(scene, vertex, fromPointOrDir, degrees, tol)`), content in `math6NeuTopics.ts` / `math7NeuTopics.ts`.

- [ ] Tool "Winkel" (like Bettermarks: choose the vertex = an existing point, choose the first leg = a point/segment, then drag the second leg with a live display "α = 52°", snap 1°, then a ray is created). Opt-in via `allowedTools`, existing toolbars unchanged.
- [ ] Predicate `hasAngleAt` + re-export via `taskHelpers.ts`; tests (correct / wrong by 2° / wrong vertex / mirrored orientation counts as correct).
- [ ] Content: **SWS** (two sides + included angle) and **WSW** (one side + two adjacent angles) as `constructionStepsTask` with a hand-drawn Planfigur in the `__neu` topic `lb3-kongruenzsatz__neu` (math6), plus one variant each, if a matching K7 triangle construction `__neu` topic exists (search). At least 3 hand-written parameter sets per construction type, realistic, triangle constructible, a unique intersection point for WSW (angle sum < 180°).
- [ ] Spoiler-free (the Planfigur shows the given values, "nicht maßstabsgetreu"), explanation step by step, tolerances consistent with the explanation (lesson n).
- [ ] Extend the test list.

### Task C4: Shipping

- [ ] Full suite + tsc + lint (only branch files), version 0.28.148, CHANGELOG, curricula export, push to `feat/mathe-messinstrumente` (updates PR #50). No merge.
