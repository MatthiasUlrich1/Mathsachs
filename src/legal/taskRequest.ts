import { availableCurricula } from '../curriculum/registry'
import type { Grade } from '../curriculum/types'
import { CONTACT_EMAIL } from './content'

/** Exact subject for the teacher task-request mail. */
export const TASK_REQUEST_SUBJECT =
  'Neue Aufgabe für das Mathsachs Übungsprogramm.'

/** Placeholder when the Aufgabenbeispiel is attached to the mail instead. */
export const TASK_REQUEST_ATTACHMENT_NOTE = 'siehe Anhang'

export interface TaskRequestFields {
  grade: string
  area: string
  title: string
  example: string
}

/** Klassenstufen that already exist as Lehrplan modules. */
export const TASK_REQUEST_GRADES = availableCurricula.map((mod) => mod.gradeTitle)

/** Lehrplan module for a Klassenstufe label, if one exists. */
export function getTaskRequestModule(gradeTitle: string) {
  const trimmed = gradeTitle.trim()
  return availableCurricula.find((mod) => mod.gradeTitle === trimmed)
}

/** Themengebiet titles: first-level `areas` of a loaded grade, not Einzelthemen. */
export function areaTitlesOfGrade(grade: Grade): string[] {
  return grade.areas.map((area) => area.title)
}

/**
 * Load the selected Lehrplan (same dynamic import as other screens) and
 * return its Themengebiet titles. Empty when the grade is unknown.
 */
export async function loadTaskRequestAreas(gradeTitle: string): Promise<string[]> {
  const mod = getTaskRequestModule(gradeTitle)
  if (!mod) return []
  const grade = await mod.load()
  return areaTitlesOfGrade(grade)
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
    grade: fields.grade.trim(),
    area: fields.area.trim(),
    title: fields.title.trim(),
    example: fields.example.trim(),
  }
}

export function isTaskRequestComplete(fields: TaskRequestFields): boolean {
  const trimmed = trimTaskRequest(fields)
  return Boolean(trimmed.grade && trimmed.area && trimmed.title && trimmed.example)
}

/** Plain-text body: Klassenstufe, Themengebiet, Titel, Aufgabenbeispiel. */
export function taskRequestBody(fields: TaskRequestFields): string {
  const trimmed = trimTaskRequest(fields)
  return [
    'Vorgaben für eine neue Aufgabe:',
    '',
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
