/** Crockford Base32 without I, L, O, U — 8 characters, human-typable. */
export const CLASS_CODE_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
export const CLASS_CODE_LENGTH = 8

const VALID_RE = new RegExp(`^[${CLASS_CODE_ALPHABET}]{${CLASS_CODE_LENGTH}}$`)

/** Trim, uppercase, map ambiguous glyphs, strip separators/invalid chars. */
export function normalizeClassCode(raw: string): string {
  if (typeof raw !== 'string') return ''
  const compact = raw
    .trim()
    .toUpperCase()
    .replace(/[-_\s]/g, '')
    .replace(/[IL]/g, '1')
    .replace(/O/g, '0')
    .replace(/[^0-9A-HJKMNP-TV-Z]/g, '')
  return compact
}

export function isValidClassCode(raw: string): boolean {
  return VALID_RE.test(normalizeClassCode(raw))
}

/** Display as XXXX-XXXX after normalization. */
export function formatClassCode(raw: string): string {
  const code = normalizeClassCode(raw)
  if (code.length !== CLASS_CODE_LENGTH) return code
  return `${code.slice(0, 4)}-${code.slice(4)}`
}

/** Prefer a stored class name; otherwise the formatted code. */
export function displayClassName(name: string | undefined, code: string): string {
  const trimmed = name?.trim() ?? ''
  return trimmed || formatClassCode(code)
}

/**
 * Badge / Punkteprotokoll label: the human class name only.
 * Never returns the secret or formatted Klassencode.
 */
export function publicClassLabel(name: string | undefined | null): string | null {
  const trimmed = name?.trim() ?? ''
  return trimmed || null
}

export function classNameFromRows(
  rows: ReadonlyArray<{ code: string; name: string }>,
  code: string,
): string {
  const normalized = normalizeClassCode(code)
  if (!normalized) return ''
  for (const row of rows) {
    if (row.code !== normalized) continue
    const name = row.name.trim()
    if (name) return name
  }
  return ''
}

/** Created-list name first, then a cached Worker name from an entered code. */
export function resolveKnownClassName(
  created: ReadonlyArray<{ code: string; name: string }>,
  known: ReadonlyArray<{ code: string; name: string }>,
  code: string,
): string {
  return classNameFromRows(created, code) || classNameFromRows(known, code)
}

export function generateClassCode(
  randomBytes: (n: number) => Uint8Array = defaultRandomBytes,
): string {
  const bytes = randomBytes(CLASS_CODE_LENGTH)
  let out = ''
  for (let i = 0; i < CLASS_CODE_LENGTH; i++) {
    out += CLASS_CODE_ALPHABET[bytes[i]! % CLASS_CODE_ALPHABET.length]
  }
  return out
}

function defaultRandomBytes(n: number): Uint8Array {
  const bytes = new Uint8Array(n)
  crypto.getRandomValues(bytes)
  return bytes
}
