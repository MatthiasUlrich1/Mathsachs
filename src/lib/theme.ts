export type ThemePreference = 'system' | 'heft' | 'tafel'
export type ResolvedTheme = 'heft' | 'tafel'

export const THEME_STORAGE_KEY = 'tasktrophy.theme'

export const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Automatisch' },
  { value: 'heft', label: 'Heft (hell)' },
  { value: 'tafel', label: 'Tafel (dunkel)' },
]

export const isThemePreference = (v: unknown): v is ThemePreference =>
  v === 'system' || v === 'heft' || v === 'tafel'

export function resolveTheme(pref: ThemePreference, systemDark: boolean): ResolvedTheme {
  if (pref === 'heft' || pref === 'tafel') return pref
  return systemDark ? 'tafel' : 'heft'
}

/** Resolves the storage; the global access itself can throw (blocked storage). */
const getStore = (storage?: unknown): Pick<Storage, 'getItem' | 'setItem'> | null => {
  if (storage) return storage as Pick<Storage, 'getItem' | 'setItem'>
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null
  } catch {
    return null
  }
}

export function loadThemePreference(
  storage?: Pick<Storage, 'getItem'> | null,
): ThemePreference {
  const store = getStore(storage)
  if (!store) return 'system'
  try {
    const raw = store.getItem(THEME_STORAGE_KEY)
    return isThemePreference(raw) ? raw : 'system'
  } catch {
    return 'system'
  }
}

export function saveThemePreference(
  pref: ThemePreference,
  storage?: Pick<Storage, 'setItem'> | null,
): void {
  const store = getStore(storage)
  if (!store) return
  try {
    store.setItem(THEME_STORAGE_KEY, pref)
  } catch {
    /* private mode / blocked storage */
  }
}

/**
 * Applies the preference to <html data-theme>. 'system' removes the attribute
 * so the prefers-color-scheme media query in index.css decides.
 */
export function applyTheme(pref: ThemePreference): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (pref === 'system') delete root.dataset.theme
  else root.dataset.theme = pref
}

/** Reads the stored preference, applies it, returns it. Call once at startup. */
export function initTheme(): ThemePreference {
  const pref = loadThemePreference()
  applyTheme(pref)
  return pref
}

/** Persists and applies a new preference. */
export function setThemePreference(pref: ThemePreference): void {
  saveThemePreference(pref)
  applyTheme(pref)
}
