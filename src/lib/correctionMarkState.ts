/**
 * Which correction mark the red margin shows for a checked answer.
 * Pure helper so the decision is testable without a DOM.
 */
export type CheckPhase = 'answering' | 'correct' | 'partial' | 'wrong'

export type CorrectionMarkState = {
  kind: 'tick' | 'cross'
  /** Text alternative for screen readers. */
  label: string
}

export function markStateForPhase(phase: CheckPhase): CorrectionMarkState | null {
  switch (phase) {
    case 'correct':
      return { kind: 'tick', label: 'Richtig' }
    case 'partial':
      return { kind: 'cross', label: 'Teilweise richtig' }
    case 'wrong':
      return { kind: 'cross', label: 'Leider falsch' }
    default:
      return null
  }
}
