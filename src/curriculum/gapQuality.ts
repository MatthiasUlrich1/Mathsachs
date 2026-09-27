/**
 * Shared cloze/gap quality guards for curriculum banks (all subjects).
 * Reject meta templates and unguessable sentence-fragment answers.
 */

/** Meta / correction prompts that pupils cannot solve from Fachwissen alone. */
export const META_GAP_TEMPLATE =
  /korrekt\s+ist|kurz\s+gesagt|zutreffende\s+einordnung|zentraler\s+bezugspunkt|welche\s+korrektur\s+ist/i

/** Last token of a multi-word answer that signals a cut mid-phrase. */
const FRAGMENT_LAST_TOKEN =
  /^(für|mit|von|zu|bei|über|unter|durch|ohne|nach|vor|aus|an|in|um|als|und|die|den|der|das|dem|des|ein|eine|einen|einem|einer)$/i

const HYPHEN_CUT = /-$/

export function isMetaGapTemplate(gapOrPrompt: string): boolean {
  return META_GAP_TEMPLATE.test(gapOrPrompt.trim())
}

/** True if an accepted gap answer is an incomplete phrase, not a Fachbegriff. */
export function isFragmentGapAnswer(accepted: string): boolean {
  const a = accepted.trim()
  if (!a) return true
  if (HYPHEN_CUT.test(a)) return true
  const tokens = a.split(/\s+/).filter(Boolean)
  // Single Fachbegriffe (e.g. Schäden, Kirchenjahr) are fine even if they contain
  // letter sequences that look like articles under ASCII \b boundaries.
  if (tokens.length < 2) return false
  return FRAGMENT_LAST_TOKEN.test(tokens[tokens.length - 1]!)
}

export function gapQualityIssues(
  gap: string,
  accepted: string[],
  prompt = '',
): string[] {
  const issues: string[] = []
  if (isMetaGapTemplate(gap) || isMetaGapTemplate(prompt)) {
    issues.push('meta-gap')
  }
  for (const a of accepted) {
    if (isFragmentGapAnswer(a)) issues.push(`fragment:${a}`)
  }
  return issues
}
