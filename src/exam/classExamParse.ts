import {
  DELETED_CLASS_EXAM_TTL_MS,
  MAX_CLASS_EXAM_NAME_LENGTH,
  MAX_DELETED_CLASS_EXAMS,
  MAX_EXAM_CODE_PAYLOAD,
  type DeletedClassExam,
  type StoredClassExam,
} from './classExamTypes'

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

export function parseStoredClassExam(raw: unknown): StoredClassExam | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  const id = typeof row.id === 'string' ? row.id.trim().toUpperCase() : ''
  const hostCode = typeof row.hostCode === 'string' ? row.hostCode.trim().toUpperCase() : ''
  const name = typeof row.name === 'string' ? row.name.trim() : ''
  const examCode = typeof row.examCode === 'string' ? row.examCode.trim() : ''
  if (!id || !hostCode || !name || !examCode) return null
  if (name.length > MAX_CLASS_EXAM_NAME_LENGTH) return null
  if (examCode.length > MAX_EXAM_CODE_PAYLOAD) return null
  if (!examCode.startsWith('MSX1:')) return null
  const createdAt = isFiniteNumber(row.createdAt) ? row.createdAt : Date.now()
  return {
    id,
    hostCode,
    name: name.slice(0, MAX_CLASS_EXAM_NAME_LENGTH),
    examCode,
    createdAt,
    ...(typeof row.className === 'string' && row.className.trim()
      ? { className: row.className.trim().slice(0, MAX_CLASS_EXAM_NAME_LENGTH) }
      : {}),
    ...(isFiniteNumber(row.taskCount) ? { taskCount: Math.max(0, Math.floor(row.taskCount)) } : {}),
    ...(isFiniteNumber(row.totalPoints)
      ? { totalPoints: Math.max(0, Math.floor(row.totalPoints)) }
      : {}),
    ...(row.owned === true ? { owned: true } : row.owned === false ? { owned: false } : {}),
    ...(Array.isArray(row.curriculumRefs) ? { curriculumRefs: row.curriculumRefs as StoredClassExam['curriculumRefs'] } : {}),
  }
}

function pickMerged(prev: StoredClassExam, next: StoredClassExam): StoredClassExam {
  const newer = next.createdAt >= prev.createdAt ? next : prev
  const older = newer === next ? prev : next
  return {
    ...older,
    ...newer,
    owned: prev.owned === true || next.owned === true ? true : newer.owned,
    className: newer.className || older.className,
  }
}

export function parseStoredClassExams(raw: unknown): StoredClassExam[] {
  if (!Array.isArray(raw)) return []
  const byId = new Map<string, StoredClassExam>()
  for (const item of raw) {
    const parsed = parseStoredClassExam(item)
    if (!parsed) continue
    const prev = byId.get(parsed.id)
    byId.set(parsed.id, prev ? pickMerged(prev, parsed) : parsed)
  }
  return [...byId.values()].sort((a, b) => b.createdAt - a.createdAt || a.name.localeCompare(b.name, 'de'))
}

export function parseDeletedClassExams(
  raw: unknown,
  now: number = Date.now(),
): DeletedClassExam[] {
  if (!Array.isArray(raw)) return []
  const byId = new Map<string, DeletedClassExam>()
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const row = item as Record<string, unknown>
    const id = typeof row.id === 'string' ? row.id.trim().toUpperCase() : ''
    const deletedAt = isFiniteNumber(row.deletedAt) ? row.deletedAt : now
    if (!id) continue
    if (now - deletedAt > DELETED_CLASS_EXAM_TTL_MS) continue
    const prev = byId.get(id)
    if (!prev || deletedAt >= prev.deletedAt) byId.set(id, { id, deletedAt })
  }
  return [...byId.values()]
    .sort((a, b) => b.deletedAt - a.deletedAt)
    .slice(0, MAX_DELETED_CLASS_EXAMS)
}

export function mergeDeletedClassExams(
  base: DeletedClassExam[] | undefined,
  incoming: DeletedClassExam[] | undefined,
  now: number = Date.now(),
): DeletedClassExam[] {
  return parseDeletedClassExams([...(base ?? []), ...(incoming ?? [])], now)
}

export function applyClassExamTombstones(
  exams: StoredClassExam[],
  deleted: DeletedClassExam[],
): { classExams: StoredClassExam[]; deletedClassExams: DeletedClassExam[] } {
  const dead = new Set(deleted.map((row) => row.id))
  const live = exams.filter((row) => !dead.has(row.id))
  return {
    classExams: live,
    deletedClassExams: parseDeletedClassExams(deleted),
  }
}

export function mergeStoredClassExams(
  base: StoredClassExam[] | undefined,
  incoming: StoredClassExam[] | undefined,
): StoredClassExam[] {
  return parseStoredClassExams([...(base ?? []), ...(incoming ?? [])])
}

export function parseCompletedClassExamIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  const out: string[] = []
  const seen = new Set<string>()
  for (const item of raw) {
    if (typeof item !== 'string') continue
    const id = item.trim().toUpperCase()
    if (!id || seen.has(id)) continue
    seen.add(id)
    out.push(id)
  }
  return out.slice(0, 500)
}

export function mergeCompletedClassExamIds(
  a: string[] | undefined,
  b: string[] | undefined,
): string[] {
  return parseCompletedClassExamIds([...(a ?? []), ...(b ?? [])])
}
