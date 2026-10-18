import type { Task } from '../curriculum/types'

/** Extract fixer-relevant answer/options text from a live task (no PII). */
export function taskReportChoices(task: Task): string | undefined {
  const parts: string[] = []
  const interactive = task.interactive
  if (interactive?.props && typeof interactive.props === 'object') {
    const props = interactive.props as Record<string, unknown>
    const options = props.options ?? props.choices ?? props.items
    if (Array.isArray(options)) {
      for (const opt of options) {
        if (typeof opt === 'string' && opt.trim()) {
          parts.push(`- ${opt.trim()}`)
        } else if (opt && typeof opt === 'object') {
          const row = opt as Record<string, unknown>
          const label =
            (typeof row.label === 'string' && row.label) ||
            (typeof row.text === 'string' && row.text) ||
            (typeof row.value === 'string' && row.value) ||
            ''
          if (label.trim()) parts.push(`- ${label.trim()}`)
        }
      }
    }
    if (typeof props.statement === 'string' && props.statement.trim()) {
      parts.push(`Aussage: ${props.statement.trim()}`)
    }
  }
  if (parts.length === 0) return undefined
  return parts.join('\n').slice(0, 1200)
}

export function taskReportSolution(task: Task): string | undefined {
  const solution = typeof task.solution === 'string' ? task.solution.trim() : ''
  if (!solution) return undefined
  return solution.slice(0, 500)
}
