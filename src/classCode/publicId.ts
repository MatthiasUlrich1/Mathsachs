/** Anonymous UI key derived from a secret code. Not a Klassencode (prefix + hex). */

export function publicIdFromCode(code: string): string {
  let hash = 2166136261
  const text = String(code || '')
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return `n${(hash >>> 0).toString(16).padStart(8, '0')}`
}
