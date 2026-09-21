/**
 * Task-authoring feature flags.
 *
 * REMOVE / disable entire feature:
 * 1. Set TASK_AUTHORING_ENABLED = false  → hides all UI for every role
 * 2. Or delete imports of canSeeTaskAuthoringUI / canSeeTaskAuthoringReviewUI
 *    from nav.ts + Settings.tsx and remove the authoring components.
 *
 * Lehrer visibility (capability already wired via canAuthorTasks):
 * Set TASK_AUTHORING_SHOW_FOR_LEHRER = true after Entwickler QA.
 */
export const TASK_AUTHORING_ENABLED = true

/** When false, Lehrer canAuthorTasks is true but Settings entries stay hidden. */
export const TASK_AUTHORING_SHOW_FOR_LEHRER = false
