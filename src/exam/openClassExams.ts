import { getClass } from '../classCode/api'
import { getClassCodeSettings, getCompletedClassExamIds } from '../lib/storage'

/** Number of assigned class exams not yet completed locally. */
export async function countOpenClassExams(): Promise<number> {
  const code = getClassCodeSettings().activeCode
  if (!code) return 0
  try {
    const stats = await getClass(code)
    const completed = new Set(getCompletedClassExamIds())
    return (stats.exams ?? []).filter((exam) => !completed.has(exam.id)).length
  } catch {
    return 0
  }
}
