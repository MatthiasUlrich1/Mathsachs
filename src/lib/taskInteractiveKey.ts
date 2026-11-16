import type { Task } from '../curriculum/types'

/**
 * Stable identity of a task's interactive widget. Used as React key so widget-local
 * state (typed text, pose, drag) never leaks between consecutive tasks.
 */
export function taskInteractiveKey(task: Task): string {
  const i = task.interactive
  if (!i) return ''
  let props = ''
  try {
    props = JSON.stringify(i.props)
  } catch {
    props = ''
  }
  return `${i.type}|${task.question}|${props}`
}
