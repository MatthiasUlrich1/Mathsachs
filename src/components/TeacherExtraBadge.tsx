import type { Topic } from '../curriculum/types'

export function isTeacherExtra(source?: Topic['source']): boolean {
  return source === 'lehrer'
}

export function TeacherExtraBadge({ source }: { source?: Topic['source'] }) {
  if (!isTeacherExtra(source)) return null
  return <span className="badge badge--extra">Lehrer-Ergänzung</span>
}
