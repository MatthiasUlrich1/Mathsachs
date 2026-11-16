# content-fix k78 (K7/K8 `__neu`)

Dateien: `src/curriculum/math7NeuTopics.ts`, `math8NeuTopics.ts`, neu `src/curriculum/math78NeuQuality.test.ts` (Sweeps über 320 Seeds). Bestehendes `mathNeuNumberLineMulti.test.ts` blieb unverändert (neue Betrag-V4 erfüllt es).

| Finding | Status | Test |
|---|---|---|
| F1 Mittelsenkrechte V3 Mitte = Lösung | fixed: ungleiche Ränder links/rechts | Mittelsenkrechte "V3 Mitte" |
| F2 Mittelsenkrechte V2/V3 ASCII-Minus, "+ -" | fixed: `signed()`/`num()` | Mittelsenkrechte "V2/V3 Erklärungen" |
| F3 Betrag V4 off-topic, Pool 3 | fixed: Karten A-D mit Betrag/Abstand/Seite, 12 Kombinationen | Betrag "V4 fragt nach dem Betrag" |
| F4 wertgleicher Distraktor (Laplace-Bruch, Gegenwahrscheinlichkeit) | fixed: ungekürzte Option entfernt, echte Fehlvorstellungen als Distraktoren | "keine wertgleichen Optionen" (beide Themen) |
| F5 "P = 7/15 = 7/15" | fixed: `laplaceErklaerung` (Laplace-Formel, Kürzen nur wenn gekürzt wird); auch Urnen-Pfadregel V5 (gleiches Muster) | Laplace-Bruch "Erklärung" |
| M1 Nebenwinkel V2 360-a, a=90, 3 Optionen | fixed (a=90 ausgeschlossen, 4 Optionen, Distraktoren +-10) | Nebenwinkel / MC-Qualität |
| M2 Nebenwinkel V4 ohne dedupeKey, erratbar | fixed: zwei Konzeptfragen, gleich lange Optionen, dedupeKey | MC-Qualität |
| M3 Scheitelwinkel V1/V2 Antwort = Zahl in Frage | fixed: zweischrittig (Nebenwinkel von Stufen-/Wechselwinkel bzw. des Scheitelwinkels), a=90 ausgeschlossen | "Lösung steht nicht in der Frage" |
| M4 Stufenwinkel fehlen | fixed: V1 mit Stufen-/Wechsel-/Nachbarwinkel (Lage im Text), V5 Begriffs-MC | "echte Stufen-, Wechsel- und Nachbarwinkel" |
| M5 "3-Eck", n=3/4 trivial | fixed: `eckName()`, 60°/90° aus Zeichenaufgabe entfernt | Winkelsumme |
| M6 doppelte Leerzeichen, 3 Optionen bei n=4, V4 Länge | fixed (5. Distraktor, Texte gekürzt/angeglichen) | Winkelsumme / MC-Qualität |
| M7 Basiswinkel V2 3 Optionen; Spoiler Spitze 60 (Report A) | fixed (60 ausgeschlossen, 5 Distraktoren-Kandidaten); V3-Text präzisiert | Basiswinkel |
| M8 Titel vs. Inhalt Mittelsenkrechte | teilweise: Titel bleibt (spiegelt Hauptthema in math7.ts und Sachsen-Anhalt-Packs); Kommentar ergänzt. V2-V4 üben die Eigenschaft Mittelpunkt | - |
| M9 V6 Ansicht, V5 Doppelung | fixed: Ansicht passt zum Radius, Formulierung; Radius in V6 bleibt vorgegeben (V5 trainiert die freie Wahl) | Mittelsenkrechte "V6 Kreise sichtbar" |
| M10 Betrag V2 trivial/3 Optionen | fixed: nur negative a, 4 Optionen | Betrag V2 |
| M11 Betrag ASCII-Minus, Kontext | fixed: Thermostat in °C, echtes Minus | Betrag "Minuszeichen" |
| Laplace-Bruch Grammatik "davon sind 1", wertgleiche V2-Distraktoren, dedupeKey | fixed (`davonSind`, dedupeKeys V1/V3, V2-Key aus Gesamtzahl) | Laplace-Bruch Grammatik |
| Laplace-Bruch Thema Kartenstapel vs Urne | not-a-defect/belassen: Titel spiegelt Hauptthema `k8-lb2-laplace-bruch`; Urnen-Varianten bleiben | - |
| M12 Prozent V3 "Schätze", Start = Lösung | fixed ("Bestimme", Start 0) | Laplace-Prozent Regler |
| M13 "Egal ob Rot oder Grün" | fixed ("Unabhängig vom ersten Ergebnis ...") | Laplace-Prozent Wortlaut |
| M14 Münze/Würfel "Zahl" doppeldeutig, Prozent | fixed ("andere Augenzahl", Erklärung mit gerundeten Prozentwerten) | - |
| M15 Distraktor > 100 %, 25 Felder | fixed (Distraktoren <= 100 %, total 4/5/8/10/20) | Laplace-Prozent MC |
| M16 dedupeKey 3/4 vs 6/8 | fixed: Key aus gekürztem Bruch; V1/V3 mit Key | Gegenwahrscheinlichkeit "gleicher Fragetext" (inkl. 120 Runden) |
| M17 Wetter mit Brüchen | fixed: V1 Prozent, V4 Prozent | Gegenwahrscheinlichkeit "Wettertexte" |
| M18 rootLabel 'Samstag', Sonne | fixed: Start; Ja/Nein-Zweige (Label max. 6 Zeichen, "trocken" hat 7) | Gegenwahrscheinlichkeit "Wettertexte" |
| A-5 Spoiler Basiswinkel 60 | fixed (siehe M7) | Basiswinkel |
| A "double-space" Vieleck V1 | fixed (siehe M6) | MC-Qualität "Erklärungen" |

Zusätzlich: Gegenwahrscheinlichkeit V3 (k=10 -> 0,5 = Wert in der Frage) ausgeschlossen; Nebenwinkel V1/V3 und Scheitelwinkel V3 ohne a=90.
Verifikation: `npx tsc --noEmit` sauber; volle `npx vitest run`: 201 Dateien / 2360 Tests grün.
