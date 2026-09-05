import { availableCurricula } from '../curriculum/registry'
import { CONTACT_EMAIL } from './content'

/** Exact subject for the teacher task-request mail. */
export const TASK_REQUEST_SUBJECT =
  'Neue Aufgabe für das Mathsachs Übungsprogramm.'

export interface TaskRequestFields {
  grade: string
  area: string
  title: string
  example: string
}

/** Klassenstufen that already exist as Lehrplan modules. */
export const TASK_REQUEST_GRADES = availableCurricula.map((mod) => mod.gradeTitle)

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
