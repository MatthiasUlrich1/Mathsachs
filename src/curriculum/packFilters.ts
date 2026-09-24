export const ALL_FILTER = ''

export type SchulformId = 'gymnasium' | 'hauptschule' | 'realschule'

export interface PackFilterMeta {
  id: string
  title: string
  region: string
  school: string
  subject?: string
}

export const SCHULFORM_OPTIONS: { id: SchulformId; label: string }[] = [
  { id: 'gymnasium', label: 'Gymnasium' },
  { id: 'hauptschule', label: 'Hauptschule' },
  { id: 'realschule', label: 'Realschule' },
]

export const SUBJECT_OPTIONS = ['Mathematik', 'Physik', 'Geschichte', 'Biologie'] as const
export type SubjectId = (typeof SUBJECT_OPTIONS)[number]

export function normalizeSubject(subject: string | undefined | null): string {
  const trimmed = (subject ?? '').trim()
  if (!trimmed) return 'Mathematik'
  const known = SUBJECT_OPTIONS.find((s) => s.toLowerCase() === trimmed.toLowerCase())
  return known ?? trimmed
}

/** At least one Fach; unknown labels kept; preferred order follows SUBJECT_OPTIONS. */
export function normalizePreferredSubjects(raw: unknown): string[] {
  const fromList = Array.isArray(raw)
    ? raw
        .filter((item): item is string => typeof item === 'string')
        .map((item) => normalizeSubject(item))
    : typeof raw === 'string' && raw.trim()
      ? [normalizeSubject(raw)]
      : []
  const seen = new Set<string>()
  const out: string[] = []
  for (const label of fromList) {
    const key = label.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(label)
  }
  if (out.length === 0) return ['Mathematik']
  const known = SUBJECT_OPTIONS.filter((s) => seen.has(s.toLowerCase()))
  const extras = out.filter(
    (s) => !SUBJECT_OPTIONS.some((k) => k.toLowerCase() === s.toLowerCase()),
  )
  return [...known, ...extras]
}

export function isPreferredSubject(
  subject: string | undefined | null,
  preferred: readonly string[],
): boolean {
  const label = normalizeSubject(subject).toLowerCase()
  return preferred.some((p) => normalizeSubject(p).toLowerCase() === label)
}

const REGION_LABELS: Record<string, string> = {
  sachsen: 'Sachsen',
}

export function regionLabel(region: string): string {
  const trimmed = region.trim()
  if (!trimmed) return ''
  return REGION_LABELS[trimmed.toLowerCase()] ?? trimmed
}

export function schulformIdForPack(pack: PackFilterMeta): SchulformId | null {
  const school = pack.school.trim().toLowerCase()
  const id = pack.id.toLowerCase()
  const title = pack.title.toLowerCase()

  if (
    school === 'gymnasium' ||
    id.startsWith('gym-') ||
    id.includes('gymnasium')
  ) {
    return 'gymnasium'
  }
  if (
    school === 'hauptschule' ||
    id.endsWith('-hs') ||
    id.includes('hauptschule') ||
    title.includes('hauptschul')
  ) {
    return 'hauptschule'
  }
  if (
    school === 'realschule' ||
    id.endsWith('-rs') ||
    id.includes('realschule') ||
    title.includes('realschul')
  ) {
    return 'realschule'
  }
  return null
}

export function packMatchesFilters(
  pack: PackFilterMeta,
  region: string,
  schulform: string,
  subject: string = ALL_FILTER,
): boolean {
  if (region && regionLabel(pack.region).toLowerCase() !== regionLabel(region).toLowerCase()) {
    return false
  }
  if (schulform && schulformIdForPack(pack) !== schulform) {
    return false
  }
  if (
    subject &&
    normalizeSubject(pack.subject).toLowerCase() !== normalizeSubject(subject).toLowerCase()
  ) {
    return false
  }
  return true
}

export function filterPacks<T extends PackFilterMeta>(
  packs: T[],
  region: string,
  schulform: string,
  subject: string = ALL_FILTER,
): T[] {
  return packs.filter((pack) => packMatchesFilters(pack, region, schulform, subject))
}

export function uniqueRegions(packs: Pick<PackFilterMeta, 'region'>[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const pack of packs) {
    const label = regionLabel(pack.region)
    if (!label || seen.has(label)) continue
    seen.add(label)
    out.push(label)
  }
  return out
}

export function uniqueSubjects(packs: Pick<PackFilterMeta, 'subject'>[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const pack of packs) {
    const label = normalizeSubject(pack.subject)
    if (seen.has(label.toLowerCase())) continue
    seen.add(label.toLowerCase())
    out.push(label)
  }
  // Prefer known order, then any extras alphabetically
  const known = SUBJECT_OPTIONS.filter((s) => seen.has(s.toLowerCase()))
  const extras = out
    .filter((s) => !SUBJECT_OPTIONS.some((k) => k.toLowerCase() === s.toLowerCase()))
    .sort((a, b) => a.localeCompare(b, 'de'))
  return [...known, ...extras]
}

export function defaultRegionFilter(packs: Pick<PackFilterMeta, 'region'>[]): string {
  const regions = uniqueRegions(packs)
  return regions.length === 1 ? regions[0] : ALL_FILTER
}

export function defaultSubjectFilter(
  packs: Pick<PackFilterMeta, 'subject'>[],
  preferred?: string | null,
): string {
  const subjects = uniqueSubjects(packs)
  if (preferred) {
    const match = subjects.find(
      (s) => s.toLowerCase() === normalizeSubject(preferred).toLowerCase(),
    )
    if (match) return match
  }
  return subjects.length === 1 ? subjects[0] : ALL_FILTER
}

export function gradeSectionHeading(packTitle: string): string {
  return `Klassenstufen · ${packTitle}`
}
