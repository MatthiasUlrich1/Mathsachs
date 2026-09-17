import { publicIdFromCode } from '../classCode/publicId'
import {
  classCodesForChallengeCreate,
  gradeCodesForChallengeList,
} from '../challenge/logic'
import type { ClassCodeSettings, GradeCodeSettings } from '../lib/sharedState'

export type ExamAssignableClass = {
  /** Klassencode when known locally; empty when only Stufe+publicId. */
  code: string
  name: string
  /** Stufencode — set when assigning via grade without local Klassencode. */
  gradeCode?: string
  /** Anonymous class id from getGrade (n…). */
  classId?: string
  /** Select value: code or `grade:GRADE:CLASSID`. */
  value: string
}

export function examAssignableSelectValue(row: ExamAssignableClass): string {
  if (row.code) return row.code
  return `grade:${row.gradeCode}:${row.classId}`
}

export function parseExamAssignableValue(value: string): {
  classCode?: string
  gradeCode?: string
  classId?: string
} {
  const trimmed = value.trim()
  if (!trimmed) return {}
  if (trimmed.startsWith('grade:')) {
    const rest = trimmed.slice('grade:'.length)
    const sep = rest.indexOf(':')
    if (sep <= 0) return {}
    return { gradeCode: rest.slice(0, sep), classId: rest.slice(sep + 1) }
  }
  return { classCode: trimmed }
}

/**
 * Classes a Lehrer can assign Klausuren to: own/entered Klassencodes plus
 * classes listed on entered/created Stufencodes (by public id).
 */
export function mergeExamAssignableClasses(input: {
  classSettings: ClassCodeSettings
  gradeSettings: GradeCodeSettings
  /** gradeCode → { id, name }[] from getGrade().classes */
  gradeClasses: Record<string, Array<{ id: string; name: string }>>
}): ExamAssignableClass[] {
  const byValue = new Map<string, ExamAssignableClass>()
  const localCodes = classCodesForChallengeCreate(input.classSettings)
  const localByPublicId = new Map<string, string>()
  const localName = new Map<string, string>()

  for (const row of input.classSettings.created) {
    localName.set(row.code, row.name)
    localByPublicId.set(publicIdFromCode(row.code), row.code)
  }
  for (const row of input.classSettings.known ?? []) {
    if (!localName.has(row.code) && row.name) localName.set(row.code, row.name)
    if (!localByPublicId.has(publicIdFromCode(row.code))) {
      localByPublicId.set(publicIdFromCode(row.code), row.code)
    }
  }

  for (const code of localCodes) {
    byValue.set(code, {
      code,
      name: localName.get(code) || code,
      value: code,
    })
  }

  for (const gradeCode of gradeCodesForChallengeList(input.gradeSettings)) {
    for (const cls of input.gradeClasses[gradeCode] ?? []) {
      const localCode = localByPublicId.get(cls.id)
      if (localCode) {
        const existing = byValue.get(localCode)
        if (existing && (!existing.name || existing.name === localCode)) {
          byValue.set(localCode, { ...existing, name: cls.name || existing.name })
        }
        continue
      }
      const value = `grade:${gradeCode}:${cls.id}`
      if (byValue.has(value)) continue
      byValue.set(value, {
        code: '',
        name: cls.name,
        gradeCode,
        classId: cls.id,
        value,
      })
    }
  }

  return [...byValue.values()].sort((a, b) => a.name.localeCompare(b.name, 'de'))
}
