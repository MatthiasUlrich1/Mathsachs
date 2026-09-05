export const ALL_FILTER = ''

export type SchulformId = 'gymnasium' | 'hauptschule' | 'realschule'

export interface PackFilterMeta {
  id: string
  title: string
  region: string
  school: string
}

export const SCHULFORM_OPTIONS: { id: SchulformId; label: string }[] = [
  { id: 'gymnasium', label: 'Gymnasium' },
  { id: 'hauptschule', label: 'Hauptschule' },
  { id: 'realschule', label: 'Realschule' },
]

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

  if (school === 'gymnasium' || id === 'gym-sachsen' || id.includes('gymnasium')) {
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
): boolean {
  if (region && regionLabel(pack.region).toLowerCase() !== regionLabel(region).toLowerCase()) {
    return false
  }
  if (schulform && schulformIdForPack(pack) !== schulform) {
    return false
  }
  return true
}

export function filterPacks<T extends PackFilterMeta>(
  packs: T[],
  region: string,
  schulform: string,
): T[] {
  return packs.filter((pack) => packMatchesFilters(pack, region, schulform))
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

export function defaultRegionFilter(packs: Pick<PackFilterMeta, 'region'>[]): string {
  const regions = uniqueRegions(packs)
  return regions.length === 1 ? regions[0] : ALL_FILTER
}

export function gradeSectionHeading(packTitle: string): string {
  return `Klassenstufen · ${packTitle}`
}
