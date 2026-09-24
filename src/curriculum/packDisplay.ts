import type { CurriculumPack, InstalledCurriculum, ManifestPack, PackGrade } from './pack'

/** Count topics across all official grades. */
export function countPackTopics(
  pack: Pick<CurriculumPack, 'official'> | { official: Array<{ areas: Array<{ topics: unknown[] }> }> },
): number {
  return pack.official.reduce(
    (sum, grade) => sum + grade.areas.reduce((n, area) => n + area.topics.length, 0),
    0,
  )
}

/** Extract Klasse/JGS year numbers (5–12) from grade titles. */
export function extractGradeYears(grades: readonly PackGrade[]): number[] {
  const years = new Set<number>()
  for (const grade of grades) {
    const text = `${grade.gradeTitle} ${grade.title}`
    for (const match of text.matchAll(/\b(1[0-2]|[5-9])\b/g)) {
      years.add(Number(match[1]))
    }
  }
  return [...years].sort((a, b) => a - b)
}

/** e.g. "9 Klassenstufen · Klassen 5–12" */
export function formatPackGradesLabel(grades: readonly PackGrade[]): string {
  const count = grades.length
  const years = extractGradeYears(grades)
  const base = `${count} Klassenstufe${count === 1 ? '' : 'n'}`
  if (years.length >= 2) return `${base} · Klassen ${years[0]}–${years[years.length - 1]}`
  if (years.length === 1) return `${base} · Klasse ${years[0]}`
  return base
}

/** German short date from epoch ms or ISO string. */
export function formatCurriculumDate(value: number | string | null | undefined): string | null {
  if (value == null || value === '') return null
  const ms = typeof value === 'number' ? value : Date.parse(value)
  if (!Number.isFinite(ms) || ms <= 0) return null
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(ms))
}

export interface PackCardCopy {
  /** Topics + grades when the installed pack is known. */
  coverage: string | null
  /** Version + optional last-update date. */
  status: string
}

/**
 * Structured Lehrplan card body — no raw changelog / interaction dump.
 * Title stays in the card header.
 */
export function formatPackCardCopy(opts: {
  entry: Pick<ManifestPack, 'version'>
  pack: Pick<CurriculumPack, 'official'> | null
  local: InstalledCurriculum | null | undefined
  canUpdate: boolean
  /** Manifest `updatedAt` — fallback when not installed. */
  catalogUpdatedAt?: string | null
}): PackCardCopy {
  const { entry, pack, local, canUpdate, catalogUpdatedAt } = opts

  const topics = pack ? countPackTopics(pack) : 0
  const coverage = pack
    ? `${topics === 1 ? '1 Thema' : `${topics} Themen`} · ${formatPackGradesLabel(pack.official)}`
    : null

  if (local) {
    const updated = formatCurriculumDate(local.installedAt)
    const parts = [`Version ${local.version}`]
    if (updated) parts.push(`Aktualisiert am ${updated}`)
    if (canUpdate) parts.push(`Online: Version ${entry.version}`)
    return { coverage, status: parts.join(' · ') }
  }

  const catalogDate = formatCurriculumDate(catalogUpdatedAt)
  const parts = [`Version ${entry.version} verfügbar`]
  if (catalogDate) parts.push(`Katalog vom ${catalogDate}`)
  return { coverage, status: parts.join(' · ') }
}
