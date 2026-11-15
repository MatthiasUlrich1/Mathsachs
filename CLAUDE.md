# CLAUDE.md – Mathsachs

## Modellwahl (verbindliche Regeln)

Grundsatz: **Für jede Ausführung das günstigste Modell nutzen, das die Aufgabe gerade noch fehlerfrei schafft.**

| Modell | Einsatz |
|---|---|
| **Opus 5.5** (`claude-opus-5-5`) | **Nur Planung** (Architektur, Implementierungspläne, Analyse komplexer Probleme). Für die Ausführung nur bei wirklich anspruchsvollen Aufgaben – und **nur nach expliziter Nachfrage und Erlaubnis** des Nutzers. |
| **Sonnet 5.5** (`claude-sonnet-5-5`) | **Standard für normale Aufgaben**: Features implementieren, Bugs fixen, Refactorings, Tests schreiben, Code-Reviews. |
| **Haiku 5.5** (`claude-haiku-5-5`) | **Shipping**: Commits, Push, PRs, Releases, Versions-Bumps, CHANGELOG-Einträge, Builds anstoßen, einfache mechanische Änderungen. |

### Ablauf

1. **Planen** mit Opus 5.5 (Plan-Modus / Plan-Agent).
2. **Ausführen** mit dem kleinsten passenden Modell:
   - Shipping / mechanisch → Haiku 5.5
   - normale Entwicklungsarbeit → Sonnet 5.5
3. **Opus für die Ausführung**: Nur, wenn Sonnet die Aufgabe voraussichtlich nicht fehlerfrei schafft. Dann **vorher beim Nutzer nachfragen**, kurz begründen, warum Opus nötig ist, und erst nach ausdrücklichem „Ja“ starten. Keine stillschweigende Nutzung von Opus.
4. Scheitert ein kleineres Modell an einer Aufgabe, eine Stufe höher gehen (Haiku → Sonnet). Der Sprung auf Opus braucht immer die Erlaubnis aus Punkt 3.

### Subagents

- Subagents (Agent-Tool) immer mit explizitem `model` starten: `haiku` für Shipping, `sonnet` für normale Aufgaben.
- `opus` nur für Plan-Agents oder nach Erlaubnis gemäß Punkt 3.
- **Immer erst planen, dann an Subagents übergeben.** Plan dem Nutzer vorlegen, nach OK ausführen lassen.

## Aufgaben & Interaktionen (Qualität, alle Fächer und Lehrpläne)

Claude ist für das Erstellen von Aufgaben und Interaktionen zuständig. Der Anspruch ist hohe Qualität. Die folgenden Regeln sind **verbindlich** und gelten auch für jeden Subagent (im Subagent-Prompt ausdrücklich darauf verweisen):

@.cursor/rules/hand_authored_curriculum.mdc
@.cursor/rules/curriculum-aufgaben-qualitaet.mdc
@.cursor/rules/curriculum-lernbereiche.mdc
@.cursor/rules/math-interaction-guards.mdc
@.cursor/rules/input-focus-guards.mdc

Definition of Done je Fach × Klasse: `docs/LEHRPLAN-QUALITAETSPLAN.md`.

### Freigabe (hart)

- Freigegebene Themen und Generatoren (`src/curriculum/mathN.ts` usw.) **nicht verändern**.
- Neue Inhalte nur in `__neu`-Themen (`*NeuTopics.ts`, `asNeuTopic`). Sie bleiben `neu: true` / `released: false` und sind nur für die Rollen Prüfer und Entwickler sichtbar, bis der Nutzer ausdrücklich freigibt. Nach der Freigabe kommen sie als Ergänzung in den Aufgabenpool.

### Vorbild Bettermarks

- Bettermarks dient als Vorbild für **Interaktionsarten** (Winkelmesser, Lineal, Zirkel, Zahlenstrahl usw.). Die Mechanik bauen wir selbst nach.
- Aufgabentexte, Grafiken und Bilder von Bettermarks **nicht 1:1 übernehmen**. Aufgaben selbst formulieren (Urheberrecht).
- Für Bettermarks meldet sich der Nutzer selbst an (SchulLogin). Claude gibt keine Zugangsdaten ein.

### Code-Exploration

- Vor dem Erkunden des Codes `graphify query "<Frage>"` nutzen (siehe `.cursor/rules/graphify.mdc`). Nach Code-Änderungen `graphify update .`.
