import {
  GYM_SACHSEN_PACK_ID,
  GYM_SACHSEN_PHYSIK_PACK_ID,
  OS_HS_PACK_ID,
  OS_RS_PACK_ID,
} from '../curriculum/pack'
import { bundledPackById } from '../curriculum/install'
import { CONTACT_EMAIL } from './content'

/** Exact subject for the teacher task-request mail. */
export const TASK_REQUEST_SUBJECT =
  'Neue Aufgabe für das Mathsachs Übungsprogramm.'

/** Placeholder when the Aufgabenbeispiel is attached to the mail instead. */
export const TASK_REQUEST_ATTACHMENT_NOTE = 'siehe Anhang'

/** Bundled Lehrpläne teachers can request tasks for (install not required). */
export const TASK_REQUEST_PACK_IDS = [
  GYM_SACHSEN_PACK_ID,
  GYM_SACHSEN_PHYSIK_PACK_ID,
  OS_HS_PACK_ID,
  OS_RS_PACK_ID,
] as const

export interface TaskRequestGradeOption {
  id: string
  gradeTitle: string
  subjectTitle: string
}

export interface TaskRequestPackOption {
  id: string
  title: string
  grades: TaskRequestGradeOption[]
}

export interface TaskRequestFields {
  packId: string
  packTitle: string
  gradeId: string
  grade: string
  area: string
  title: string
  example: string
}

let packsCache: TaskRequestPackOption[] | null = null

/** Load all selectable Lehrpläne with their Klassenstufen (from bundled packs). */
export async function loadTaskRequestPacks(): Promise<TaskRequestPackOption[]> {
  if (packsCache) return packsCache
  const packs: TaskRequestPackOption[] = []
  for (const id of TASK_REQUEST_PACK_IDS) {
    const pack = await bundledPackById(id)
    if (!pack) continue
    packs.push({
      id: pack.id,
      title: pack.title,
      grades: pack.official.map((grade) => ({
        id: grade.id,
        gradeTitle: grade.gradeTitle,
        subjectTitle: grade.subjectTitle,
      })),
    })
  }
  packsCache = packs
  return packs
}

/** @internal — tests may clear the cache after mutating pack builders. */
export function clearTaskRequestPacksCache(): void {
  packsCache = null
}

export function getTaskRequestPack(
  packs: readonly TaskRequestPackOption[],
  packId: string,
): TaskRequestPackOption | undefined {
  const trimmed = packId.trim()
  return packs.find((pack) => pack.id === trimmed)
}

export function getTaskRequestGrade(
  pack: TaskRequestPackOption | undefined,
  gradeId: string,
): TaskRequestGradeOption | undefined {
  if (!pack) return undefined
  const trimmed = gradeId.trim()
  return pack.grades.find((grade) => grade.id === trimmed)
}

/**
 * Themengebiet titles for a grade in a Lehrplan (Lernbereiche from the
 * bundled pack outline — no install required).
 */
export async function loadTaskRequestAreas(
  gradeId: string,
  packId?: string,
): Promise<string[]> {
  const trimmed = gradeId.trim()
  if (!trimmed) return []
  const packIds = packId?.trim()
    ? [packId.trim()]
    : [...TASK_REQUEST_PACK_IDS]
  for (const id of packIds) {
    const pack = await bundledPackById(id)
    const grade = pack?.official.find((row) => row.id === trimmed)
    if (grade) return grade.areas.map((area) => area.title)
  }
  return []
}

/** Keep the current Themengebiet only if it still belongs to the loaded grade. */
export function keepValidArea(
  area: string,
  titles: readonly string[],
): string {
  return titles.includes(area) ? area : ''
}

export function trimTaskRequest(fields: TaskRequestFields): TaskRequestFields {
  return {
    packId: fields.packId.trim(),
    packTitle: fields.packTitle.trim(),
    gradeId: fields.gradeId.trim(),
    grade: fields.grade.trim(),
    area: fields.area.trim(),
    title: fields.title.trim(),
    example: fields.example.trim(),
  }
}

export function isTaskRequestComplete(fields: TaskRequestFields): boolean {
  const trimmed = trimTaskRequest(fields)
  return Boolean(
    trimmed.packId &&
      trimmed.packTitle &&
      trimmed.gradeId &&
      trimmed.grade &&
      trimmed.area &&
      trimmed.title &&
      trimmed.example,
  )
}

/** Plain-text body: Lehrplan, Klassenstufe, Themengebiet, Titel, Aufgabenbeispiel. */
export function taskRequestBody(fields: TaskRequestFields): string {
  const trimmed = trimTaskRequest(fields)
  return [
    'Vorgaben für eine neue Aufgabe:',
    '',
    `Lehrplan: ${trimmed.packTitle}`,
    `Klassenstufe: ${trimmed.grade}`,
    `Themengebiet: ${trimmed.area}`,
    `Titel des Themas: ${trimmed.title}`,
    '',
    'Aufgabenbeispiel:',
    trimmed.example,
  ].join('\n')
}

/** mailto to the Impressum address — nothing is stored on the Worker. */
export function buildTaskRequestMailto(fields: TaskRequestFields): string {
  const subject = encodeURIComponent(TASK_REQUEST_SUBJECT)
  const body = encodeURIComponent(taskRequestBody(fields))
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
}
