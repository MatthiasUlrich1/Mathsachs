/**
 * What the home (browse) screen shows when no Klassenstufe is loaded.
 * Pure so the two empty cases cannot be mixed up again:
 * - nothing installed at all -> install a curriculum
 * - installed, but no Klassenstufe selected -> choose grades in the settings
 */
export type BrowseEmptyState = 'loading' | 'no-curriculum' | 'no-grade-selected' | 'content'

export function browseEmptyState(input: {
  ready: boolean
  loadedCount: number
  anyInstalled: boolean
}): BrowseEmptyState {
  if (!input.ready) return 'loading'
  if (input.loadedCount > 0) return 'content'
  return input.anyInstalled ? 'no-grade-selected' : 'no-curriculum'
}

export const BROWSE_EMPTY_COPY: Record<
  'no-curriculum' | 'no-grade-selected',
  { title: string; body: string; button: string }
> = {
  'no-curriculum': {
    title: 'Kein Lehrplan installiert',
    body: 'Installiere unter Einstellungen → Lehrpläne zuerst „Gymnasium Sachsen · Mathematik“, „Gymnasium Sachsen · Physik“ oder einen anderen Lehrplan.',
    button: 'Zu den Lehrplänen',
  },
  'no-grade-selected': {
    title: 'Noch keine Klassenstufe ausgewählt',
    body: 'Der Lehrplan ist installiert. Wähle unter Einstellungen → Lehrpläne die Klassenstufen aus, mit denen du üben möchtest.',
    button: 'Klassenstufen auswählen',
  },
}
