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
