# content-fix k6 report

Files: `src/curriculum/math6NeuTopics.ts`, new `src/curriculum/math6NeuQuality.test.ts` (72 tests, 320 seeds x 6 draws per topic). No helper/survey files changed (pieChartSurveys, barChartSurveys, angleConstructionTasks untouched, math5 unaffected).

| Finding | Status | Test (math6NeuQuality.test.ts) |
|---|---|---|
| lb1-vergleichen M1 number line out of range | fixed (only proper fractions, solution in [0,1]) | lb1-vergleichen: Zahlenstrahl |
| lb1-vergleichen M18 swapped pair twice | fixed (order-independent dedupeKey) | Schluessel unabhaengig von der Reihenfolge |
| lb1-vergleichen M21 improper fractions / integers | fixed (`properFractionNeu`) | nur echte Brueche im Stamm |
| lb1-vergleichen m23 "6. Strich" without 3/4 = 6/8 | fixed (explanation adds equal fraction) | - (text) |
| lb1-vergleichen m11 text field for <,>,= | not changed (would need new interaction; textTask accepted, out of scope) | - |
| lb1-vergleichen m24 small differences on wall | not-a-defect (deliberate, rule: red line helps) | - |
| lb1-erweitern M2 two correct options (n = d) | fixed (n < d in V1/V2) | lb1-erweitern: genau eine Option |
| lb1-erweitern k m1-type (n >= d) | fixed | same |
| lb1-kuerzen m10 options "1", n/n, improper | fixed (V3 distractors proper, reduced, distinct; correct form proper) | lb1-kuerzen V3 |
| lb1-prozent m9 "3/5 * 100" | fixed (extend to denominator 100) | - (text) |
| lb1-sachaufgabe-bruch A1 "1 Teile", M13 unrealistic numbers, m15 money 2 decimals / "Menge" | fixed (realistic totals per context, n >= 2 in reverse, euro 2 decimals, new contexts) | lb1-sachaufgabe-bruch (3 tests), generic text sweep |
| lb1-sachaufgabe-bruch M19 duplicate with class 5 divide task | fixed (class 6 pairs: 4/3, 3/2, 2/6, 4/6, 3/6, 4/5; no overlap with class 5 3/4, 3/5, 2/3) | Verteil-Aufgaben ueberschneiden sich nicht |
| lb2-proportional A3 "1 Felder", M17 "zu blaue Farbe"/"zu Nuesse" | fixed (felder(n) helper, sentence "sind a Felder fuer ...") | lb2-proportional Singular/Kasus |
| lb2-proportional m25 constant V4, tiny juice amounts | fixed (3 concept questions, totals 240-900 ml, no thousands separator) | Konzeptfrage wechselt, Rezepte |
| lb2-haeufigkeit M3 (V2/V3 non-integer counts) | fixed (only integer combinations; "Glücksrad wurde n-mal gedreht", "Wie viele der Versuche") | V2, V3 tests |
| lb2-haeufigkeit M3b unnamed rounding | fixed (totals 20..400 giving <= 2 decimals) | V1 test |
| lb2-haeufigkeit M20 topic fit | fixed (two new table variants asking relative frequency / which category; share of on-topic tasks > 45 %) | Thema / Tabellen-Aufgaben |
| lb2-haeufigkeit m26 400 pupils in a class | fixed ("an einer Schule") | V1 test |
| lb2-haeufigkeit m27 few pie scenarios | not changed (survey files shared, 7 scenarios; reported) | - |
| lb3-winkel-dreieck A5 spoiler, m12 longest answer, m13 measure vs compute | fixed (asked angle never equals a given angle, base angle != 60; 3 concept questions with similar answer lengths; text now "miss und pruefe") | lb3-winkel-dreieck (2 tests) |
| lb3-winkel-viereck M4 impossible 4th angle, A5 | fixed (4th angle 50-140, differs from given; MC options 10-170) | lb3-winkel-viereck V4th-angle test |
| lb3-winkel-viereck M23 class-7 content, m14 720 distractor | fixed (V4 replaced by diagonal/rectangle questions, fachwissen without (n-2)*180; distractor 180 - d etc.) | kein Klasse-7-Stoff |
| lb3-kongruenzsatz M5 triangle inequality | fixed (retry loop) | SSS-Aufgaben erfuellen die Dreiecksungleichung |
| lb3-kongruenzsatz M5b answer always last | fixed (shuffleChoices in V2/V3) | SsW nicht immer an letzter Stelle |
| lb3-kongruenzsatz M22 title, m28 always SSS / always Nein / V3 wording | fixed (title "Kongruenzsaetze und Dreieckskonstruktion", V1 covers SSS/SWS/WSW, Ja/Nein variants with both answers, new "NICHT eindeutig" MC, wording unified) | Texteingabe, Ja/Nein |
| lb5-anteil-groesse A2 "1 Teile", M14 too few options, m16 topic fit | fixed (n >= 2 or n = 1 wording, always 4 options, new forward case "n/d von G", fachwissen covers both, euro 2 decimals) | lb5-anteil-groesse (2 tests) |
| lb5-anteil-prozent A4 euro 1 decimal, M24 main case missing | fixed (new "x % von G" variants incl. MC, euro via `euroNeu`) | lb5-anteil-prozent (2 tests) |
| negative-number notation (grade 6) | not-a-defect: no negative-number arithmetic in math6 neu topics; generic sweep guards "- -", "+ -", "· -" | text sweep |

Generic sweeps for all 12 touched topics: no "1 Teile/Felder/Stuecke/Stunden", no NaN/undefined, no double signs, explanations not starting lowercase words, euro with 2 decimals, MC options unique with exactly one correct, round length 10.

Full `npx vitest run`: 201 files, 2360 tests pass. `npx tsc --noEmit` clean.
