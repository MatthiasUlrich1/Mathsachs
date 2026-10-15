import type { Topic } from './types'

/**
 * Gym-Mathe-Generatoren laufen unverändert: kein themenfremder Round-Boost,
 * keine Stichwort-Stub-Banken. Dünne Pools werden im Themengenerator selbst
 * verdichtet (siehe `curriculum-aufgaben-qualitaet.mdc`, Themenbindung).
 */
export function withMathGymThinFill(
  _id: string,
  base: Topic['generate'] | undefined,
): Topic['generate'] | undefined {
  return base
}
