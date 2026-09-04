/**
 * Compare dotted version numbers (major.minor.patch), ignoring a leading `v`
 * and any pre-release / build suffix. Returns 1 / 0 / -1 like strcmp.
 */
export function compareSemver(a: string, b: string): number {
  const pa = parseSemver(a)
  const pb = parseSemver(b)
  if (!pa && !pb) return 0
  if (!pa) return -1
  if (!pb) return 1
  for (let i = 0; i < 3; i++) {
    if (pa[i] > pb[i]) return 1
    if (pa[i] < pb[i]) return -1
  }
  return 0
}

/** True when `latest` is a higher major.minor.patch than `current`. */
export function isNewerVersion(latest: string, current: string): boolean {
  return compareSemver(latest, current) > 0
}

/** Strip a leading `v` and any suffix after `+` or `-`. */
export function normalizeVersion(input: string): string {
  const parsed = parseSemver(input)
  return parsed ? parsed.join('.') : input.trim().replace(/^v/i, '')
}

function parseSemver(input: string): [number, number, number] | null {
  const cleaned = input.trim().replace(/^v/i, '')
  const match = cleaned.match(/^(\d+)\.(\d+)\.(\d+)/)
  if (!match) return null
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}
