/**
 * Global practice-round length for all Lehrpläne (Mathe, Physik, Biologie,
 * Geschichte, Oberschule, …).
 *
 * Standard: 10 zufällig gezogene, innerhalb der Runde unique Aufgaben.
 * Ausnahme: nur wenn der Unique-Pool &lt; 10 ist — dann die Poolgröße
 * (kein Padding erfinden). Autoren setzen `tasksPerRound` nur bewusst unter
 * 10, wenn der Pool nachweislich kleiner ist (z. B. Jahreszahlen-Fakten).
 */
export const DEFAULT_TASKS_PER_ROUND = 10
export const MAX_TASKS_PER_ROUND = 30

/** Resolve pack/topic override or fall back to the global default of 10. */
export function resolveTasksPerRound(
  topic: { tasksPerRound?: number } | null | undefined,
): number {
  const raw = topic?.tasksPerRound
  if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 1) {
    return Math.min(MAX_TASKS_PER_ROUND, Math.trunc(raw))
  }
  return DEFAULT_TASKS_PER_ROUND
}
