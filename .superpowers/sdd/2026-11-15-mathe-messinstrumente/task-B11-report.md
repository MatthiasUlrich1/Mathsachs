# Task B11 report: exploreBoard

Not a task type: no UserInput/check/exam/worksheet wiring.

- Types: `Fachwissen.explore?: { boardId; params? }` (types.ts). Pack: `PackTopic.explore` + `parseExplore` (pack.ts), `seed.ts` topicMeta copies it, `hydrate.ts applyPackTopicMeta` re-attaches it to bundled topic fachwissen.
- Registry `src/lib/exploreBoards.ts`: controls (slider/toggle), pure `render` + `describe`, clamp/snap, `maxId` (Zaehler <= Nenner), `getExploreBoard` (unknown/prototype keys -> undefined).
- Component `src/components/ExploreBoard.tsx/.css`; mounted in PracticeSession Fachwissen panel and CurriculumBrowser Wissen card. Unknown id renders nothing. Native range/checkbox with labels, figure `role="img"` + aria-label = describe, caption `aria-live="polite"`.
- Boards: mittelsenkrechte (r 1..6 cm step 0.5, AB = 6 cm; none / touch at r = 3 / two points), winkelarten (0..360 step 5, exact boundaries), bruchErweitern (k 2..6, bar models).

| topic id | explore |
|---|---|
| k7-lb1-mittelsenkrechte-schritte__neu | mittelsenkrechte |
| lb3-winkelarten__neu | winkelarten |
| lb2-erweitern__neu (K5) | bruchErweitern |
| lb1-erweitern__neu (K6) | bruchErweitern |

Tests: exploreBoards.test.ts (boundaries, toggles, text-fit over all states, purity, no NaN), ExploreBoard.test.ts (markup, unknown id), pack.test.ts (round-trip incl. seed pack). Full vitest 1733 passed, tsc clean.

Notes: k min 2 (k=1 is not Erweitern). Pack JSONs in /curricula not regenerated (script not run).
