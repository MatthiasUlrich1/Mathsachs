/**
 * Pick a valid class code for the "Weitere Klasse" select.
 * Empty / stale stored values must fall back — otherwise a controlled
 * <select value=""> with no matching <option> refuses to open (Electron/Chrome).
 */
export function resolveAddClassValue(
  stored: string | undefined,
  availableCodes: string[],
): string {
  if (stored && availableCodes.includes(stored)) return stored
  return availableCodes[0] ?? ''
}
