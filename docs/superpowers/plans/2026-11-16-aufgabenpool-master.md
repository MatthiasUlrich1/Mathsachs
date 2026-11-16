# Task pool: dissolve Neu topics, Gymnasium Sachsen as master for all maths curricula

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use `- [ ]`.

**Goal:** (1) All `__neu` maths topics (K5–JGS) are merged into their main topics, so the Neu topics disappear and their tasks complete the main topics — well mixed, without repeats, 10 tasks per round. (2) Gymnasium Sachsen is the master pool. From it, Gymnasium Sachsen-Anhalt, Oberschule Sachsen (Hauptschul- and Realschulbildungsgang) and Sekundarschule Sachsen-Anhalt (Hauptschul- and Realschulabschluss) are filled according to their official curricula, with no duplicates.

**Starting point (as of 0.29.0):**
- Neu topics are separate topics `${parent}__neu` with `reviewOf: parent`, spread into the areas in `src/curriculum/math{5,6,7,8,9,10,11_12}.ts` (`...math5NeuLb1` etc.).
- The other packs (`gymSachsenAnhaltPack.ts`, `oberschulePacks.ts` + `oberschuleGenerators.ts`, `sekundarschuleSachsenAnhaltPack.ts`) carry an outline taken from the official curriculum. Each pack topic points to **exactly one** Gym Sachsen topic (`ST_/OS_/SKS_GENERATOR_MAP`) or has a custom generator (`OS_CUSTOM_GENERATORS`). Topics without a mapping are `outlineOnly`.
- Rounds: `buildUniqueTaskRound(generate, rng, 10)` deduplicates via `taskContentIds` / `dedupeKey`. `mixedVariants` picks a variant uniformly at random.
- Exam codes and challenges store **seeds** and regenerate tasks from them. When generators change, the app warns about older codes ("Aufgaben könnten abweichen") — schema B embeds the content.

**Architecture:** Merging happens **centrally** via a helper (not by rewriting the released generators line by line). The other packs get **1:n mappings** (a pack topic can draw from several master topics) plus an **optional difficulty filter** for the Hauptschul profiles. Mapping decisions are recorded as a traceable table in `docs/lehrplan-mapping/` with a source citation from the official curriculum.

## Global Constraints

- Gym Sachsen is the master. Other packs get **no** new content of their own. They only receive allocations from the master (existing `OS_CUSTOM_GENERATORS` stay).
- **No duplicates within a pack:** a master topic (or master task family) appears in **at most one** pack topic per pack. Exception, documented in the mapping: deliberate repetition in a later grade, when the curriculum explicitly requires it there (e.g. revision), but never twice in the same grade.
- Every round: by default 10 tasks, no repeat (`contentId` / `dedupeKey`), new and old tasks well mixed (see E1).
- Hauptschul profiles (OS-HS, SKS-HS): only master topics/variants with `difficulty ≤ 2`, unless the curriculum demands more, then documented.
- Released status: merged topics stay `released` like their parent. Neu topics no longer exist after the merge.
- Quality rules from `CLAUDE.md` + `.cursor/rules/*.mdc` apply in full.
- Model rules: implementation Sonnet, shipping Haiku, planning/review controller.
- Curriculum research only from official sources (LISA Sachsen-Anhalt, schule.sachsen.de / Sächsisches Staatsministerium für Kultus). Cite the source URL + section in the mapping.

## Review Focus

1. Old exam codes / challenges / protocols referring to former `__neu` IDs or seeds of changed topics: no crash, a sensible fallback (redirect `__neu` → parent).
2. Duplicates between old and new task families within a merged topic (same question in two variants) → would cause repeats in a round.
3. Round length 10 in every merged topic and in every pack topic (over 30 seeds).
4. Mixing: a merged topic must not consist almost entirely of old or almost entirely of new tasks.
5. HS profiles: no grade-9/10 Gymnasium content (e.g. trigonometry, quadratic functions) in topics where the curriculum doesn't foresee it.

---

### Task E1: merge Neu topics into the main topics (infrastructure + all grades)

**Files:** new `src/curriculum/mergeNeu.ts` (+ test), `src/curriculum/math{5,6,7,8,9,10,11_12}.ts` (replace only the spread `...mathXNeuLbY` with the merge call — **no** generator content changes), `neuTopic.ts`/`placeholderNeuIds.ts`/`topicVisibility.ts` (registry clean-up), resolvers for old IDs (`resolveFaultyTask.ts`, `App.tsx` `openPracticeById`, `challenge/topics.ts`, `examCode.ts` lookup).

- [ ] `mergeNeuIntoParents(areas, neuTopics): Area[]` — per Neu topic: find the parent via `reviewOf` (in any area of the grade); the new `generate` = `blendGenerators([{gen: parent.generate, weight}, {gen: neu.generate, weight}])`; **remove** the Neu topic. Carry over Fachwissen/`explore` and keywords sensibly (parent text stays primary; Neu-only aspects appended, no duplicate sentences). Neu topics without a parent: report + test-fail (none expected).
- [ ] `blendGenerators`: deterministic per seed (uses the rng, no extra randomness). Weights: default 1:1; per-topic override possible when one side has a very small unique pool (measured by `buildUniqueTaskRound` pool size in the test).
- [ ] Map old IDs: `legacyNeuIdToParent(id)` — every place that looks up a topic by ID falls back to the parent.
- [ ] Tests: no `__neu` ID in any loaded grade; per merged topic over 30 seeds: round length 10, no duplicate `contentId`, share of new **and** old tasks each ≥ 20 % on average; old exam code with a `__neu` ref doesn't crash.
- [ ] `CURRICULUM_VERSION`/pack version is bumped (warning for old codes — accepted).

### Task E2: duplicate cleanup old ↔ new

- [ ] Per merged topic, sample 400 tasks; find duplicates between old and new tasks (same normalised question stem or same solution + same numbers / same concept). Remove/rework duplicate **new** variants (old ones are the released reference), or give both the same `dedupeKey`, so that they never appear twice in one round.
- [ ] Test sweep per topic: no two tasks of a round with an identical normalised question stem.
- [ ] Report: per topic the number of duplicates found / fixed.

### Task E3: pack infrastructure 1:n + difficulty filter

**Files:** `pack.ts` (types), `oberschuleGenerators.ts` (resolver), `gymSachsenAnhaltPack.ts`, `sekundarschuleSachsenAnhaltPack.ts`, `oberschulePacks.ts`, `seed.ts`/`hydrate.ts` (if the pack JSON carries it), `scripts/export-curriculum-pack.ts`.

- [ ] Mapping format: `Record<packTopicId, { sources: string[]; maxDifficulty?: 1|2|3; note?: string }>` (backwards-compatible with the old 1:1 string maps).
- [ ] Resolver: several sources → `blendGenerators`; `maxDifficulty` filters master topics by `difficulty` (topic level).
- [ ] Guard tests (per pack): (a) every master source exists, (b) **no master topic twice in the same pack** (except entries marked `allowRepeat` with a note), (c) every playable pack topic reaches round length 10 or the documented pool size, (d) HS packs: no source with `difficulty 3` without a note.

### Task E4: curriculum research + mapping tables (5 profiles, read-only, in parallel)

One agent per curriculum family, writes only `docs/lehrplan-mapping/<pack>.md`:
- **E4a** Gymnasium Sachsen-Anhalt (Fachlehrplan Mathematik Gymnasium, LISA, as of 2022).
- **E4b** Oberschule Sachsen Mathematik (Lehrplan Oberschule, HS- and RS-Bildungsgang).
- **E4c** Sekundarschule Sachsen-Anhalt Mathematik (Fachlehrplan Sekundarschule, Hauptschul- and Realschulabschluss).

Each table: per grade and pack topic → master source(s) (Gym Sachsen topic IDs incl. the former Neu tasks now in the parent), `maxDifficulty` for HS, curriculum source (section/page). Plus: master topics of the grade levels concerned that remain **unused** (with reason: not in the curriculum / different grade), and pack topics **without** a matching master source (stay outline; list them). Check the existing outline against the official curriculum; deviations (missing/surplus topics) as a separate section with a recommendation.

### Task E5: implement the mappings (in sequence, per pack file)

- [ ] E5a Gym Sachsen-Anhalt, E5b Oberschule Sachsen HS+RS, E5c Sekundarschule Sachsen-Anhalt HS+RS: apply the mapping table from E4; outline corrections only where E4 recommends them with a source citation; E3 guard tests green.

### Task E6: full check + shipping (PR, **no** merge without your OK)

- [ ] Audit across all 6 maths packs: round length, no repeats, no duplicate master topic per pack, HS difficulty, coverage report (share of playable pack topics before/after).
- [ ] Version bump of all affected packs + app version 0.30.0, CHANGELOG, curricula export, PR.
- [ ] Report to the user: coverage per pack, open outline topics, decisions.
