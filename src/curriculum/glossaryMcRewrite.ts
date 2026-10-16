/**
 * Rewrite vague glossary/meta MC stems into concrete Schüler questions
 * and expand fragment answer options into comparable full phrases.
 *
 * Used by Physik/Bio/Geschichte bank sanitizers for locked gap/thin-fill content.
 * Does not invent joke distractors — only expands/rephrases existing meanings.
 */

/** Already a concrete application / role / process stem — leave alone. */
export function isConcreteGlossaryStem(prompt: string): boolean {
  const q = prompt.replace(/\s+/g, ' ').trim()
  return /^(Wozu|Welche Rolle|Womit|Mit welchen|Was bewirkt|Was passiert|Was trifft|Berechne|Wie|Warum|Weshalb|Woran|Wofür|Welcher Zusammenhang|Welche Maßnahme|Was kennzeichnet|Was beschreibt die|Was ist ein typisches)\b/i.test(
    q,
  )
}

/** Strip thin-fill slug prefixes like `[ge-k5-lb1-quellen]`. */
export function stripBankSlugPrefix(prompt: string): string {
  return prompt.replace(/^\[[^\]]+\]\s*/u, '').trim()
}

/**
 * Build a concrete MC stem from term + optional topic context.
 * Avoids „Welche Aussage … fachlich richtig?“.
 */
function isMachineTopicId(topic: string): boolean {
  return /^(ph|bio|ge|ma)[\s:_-]/i.test(topic) || /\bk\d+\b/i.test(topic) || /\blb\d+/i.test(topic)
}

export function concreteGlossaryStem(term: string, topic?: string): string {
  const t = term.replace(/\s+/g, ' ').trim()
  let topicClean = topic?.replace(/\s+/g, ' ').trim()
  if (topicClean && isMachineTopicId(topicClean)) topicClean = undefined
  if (!t) {
    return topicClean
      ? `Was trifft im Thema ${topicClean} zu?`
      : 'Was trifft in diesem Zusammenhang zu?'
  }
  // Slash-compounds read better without quotes in the role question.
  const label = /[⁄/]/.test(t) ? t.replace(/\//g, ' oder ') : `„${t}“`
  if (topicClean && topicClean.toLowerCase() !== t.toLowerCase()) {
    return `Was trifft im Thema ${topicClean} auf ${label} zu?`
  }
  return `Was trifft auf ${label} zu?`
}

/**
 * Expand a short meaning fragment into a full, comparable answer phrase.
 * Keeps UTF-8 umlauts untouched.
 */
export function expandGlossaryAnswer(
  meaning: string,
  opts?: { term?: string; topic?: string },
): string {
  let m = meaning.replace(/\s+/g, ' ').trim()
  if (!m) return m

  const term = opts?.term?.replace(/\s+/g, ' ').trim()
  const topic = opts?.topic?.replace(/\s+/g, ' ').trim()

  // Idempotent: already expanded / full phrase
  if (term && new RegExp(`^${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:`, 'i').test(m)) {
    return /[.!?]$/.test(m) ? m : `${m}.`
  }
  if (/^Im Thema\s+/i.test(m) || /^(Sie|Er|Es|Man)\s+/i.test(m)) {
    return /[.!?]$/.test(m) ? m : `${m}.`
  }

  // Already a solid sentence / clause
  const words = m.split(/\s+/).length
  if (words >= 7 || (words >= 5 && /[.!?]$/.test(m))) {
    return /[.!?]$/.test(m) ? m : `${m}.`
  }
  if (/^(Sie|Er|Es|Man|Das|Die|Der|Damit|Dabei|Hier)\s/i.test(m) && words >= 4) {
    return /[.!?]$/.test(m) ? m : `${m}.`
  }

  // Verb-initial fragments: „Schaltet bei Bedarf“ → „Timer/Sensor schaltet bei Bedarf.“
  if (
    /^(Wird|Werden|Ist|Sind|Hat|Haben|Lässt|Lassen|Sendet|Stört|Schaltet|Entsteht|Beschreibt|Bedeutet|Gilt|Dient|Dienen|Lenkt|Wirft|Nimmt|Geht|Liegt|Steht|Bildet|Regelt|Steuert|Reduziert|Erhöht|Verringert|Verhindert|Ermöglicht|Kennzeichnet|Bezeichnet|Umfasst|Enthält|Zeigt|Misst|Speichert|Überträgt)/i.test(
      m,
    )
  ) {
    const rest = m.charAt(0).toLowerCase() + m.slice(1)
    const body = term ? `${term} ${rest}` : rest.charAt(0).toUpperCase() + rest.slice(1)
    return /[.!?]$/.test(body) ? body : `${body}.`
  }

  // Noun / short phrase meanings
  if (term && words <= 6) {
    if (topic && topic.toLowerCase() !== term.toLowerCase()) {
      return `${term} im Thema ${topic}: ${m}${/[.!?]$/.test(m) ? '' : '.'}`
    }
    return `${term}: ${m}${/[.!?]$/.test(m) ? '' : '.'}`
  }

  if (topic && words <= 5) {
    return `Im Thema ${topic}: ${m}${/[.!?]$/.test(m) ? '' : '.'}`
  }

  return /[.!?]$/.test(m) ? m : `${m}.`
}

/** Expand a distractor to the same style (no term prefix — keep options parallel). */
export function expandGlossaryDistractor(meaning: string, topic?: string): string {
  let m = meaning.replace(/\s+/g, ' ').trim()
  if (!m) return m
  const words = m.split(/\s+/).length
  if (words >= 6 || (words >= 4 && /[.!?]$/.test(m))) {
    return /[.!?]$/.test(m) ? m : `${m}.`
  }
  if (
    /^(Wird|Werden|Ist|Sind|Hat|Haben|Lässt|Lassen|Sendet|Stört|Schaltet|Entsteht|Beschreibt|Bedeutet|Gilt|Dient|Dienen|Lenkt|Wirft|Nimmt|Geht|Liegt|Steht|Bildet|Regelt|Steuert|Reduziert|Erhöht|Verringert|Verhindert|Ermöglicht)/i.test(
      m,
    )
  ) {
    const body = m.charAt(0).toUpperCase() + m.slice(1)
    return /[.!?]$/.test(body) ? body : `${body}.`
  }
  if (topic && words <= 5) {
    return `Im Thema ${topic}: ${m}${/[.!?]$/.test(m) ? '' : '.'}`
  }
  return /[.!?]$/.test(m) ? m : `${m}.`
}

/**
 * Parse glossary-style prompts and return a concrete stem when possible.
 * Returns null if the prompt should be left unchanged (already concrete / not glossary).
 */
export function rewriteVagueGlossaryPrompt(prompt: string): string | null {
  let q = stripBankSlugPrefix(prompt).replace(/\s+/g, ' ').trim()
  q = q.replace(/\?+$/g, '').trim()

  if (isConcreteGlossaryStem(q)) return null

  // Fachbegriff (topic): Was bedeutet „term“?
  let m = q.match(
    /^(?:Fachbegriff\s*)?\(([^)]+)\):\s*(?:Was bedeutet(?: der Fachbegriff)?|Was versteht man unter)\s*[„""']([^„""']+)[“""']\s*$/i,
  )
  if (m) return concreteGlossaryStem(m[2]!, m[1]!.trim())

  // Welche Aussage zu „term“ (topic) ist (fachlich) richtig?
  m = q.match(
    /^Welche Aussage zu\s*[„""']([^„""']+)[“""']\s*(?:\(([^)]+)\))?\s*ist(?:\s+fachlich)?\s+richtig\s*$/i,
  )
  if (m) return concreteGlossaryStem(m[1]!, m[2]?.trim())

  // Was beschreibt „term“ fachlich richtig?
  m = q.match(
    /^(?:([^:?]{1,80}):\s*)?Was beschreibt\s*[„""']([^„""']+)[“""']\s*(?:fachlich\s+)?richtig\s*$/i,
  )
  if (m) return concreteGlossaryStem(m[2]!, m[1]?.trim() || undefined)

  // Was bedeutet „term“? / Was versteht man unter „term“?
  m = q.match(
    /^(?:([^:?]{1,80}):\s*)?(?:Was bedeutet(?: der Fachbegriff)?|Was versteht man unter)\s*[„""']([^„""']+)[“""']\s*$/i,
  )
  if (m) return concreteGlossaryStem(m[2]!, m[1]?.trim() || undefined)

  // Was ist fachlich richtig? (no term)
  if (/^Was ist fachlich richtig$/i.test(q) || /^Welche Aussage ist(?:\s+fachlich)?\s+richtig$/i.test(q)) {
    return 'Was trifft in diesem Zusammenhang zu?'
  }

  // Bare: Was bedeutet ShortTerm?
  m = q.match(/^Was bedeutet\s+(.+)$/i)
  if (m) {
    const topic = m[1]!.replace(/\s+qualitativ$/i, '').trim()
    // Keep richer curricular stems (e.g. „Was bedeutet eine große Dichte qualitativ?“).
    if (topic.split(/\s+/).length >= 4 || /qualitativ|quantitativ|bei |wenn |ohne |mit /i.test(m[1]!)) {
      return null
    }
    return concreteGlossaryStem(topic)
  }

  // Was ist ein/eine/der/die/das Term?
  m = q.match(/^Was ist (ein|eine|der|die|das)\s+(.+)$/i)
  if (m) return concreteGlossaryStem(m[2]!.trim())

  return null
}
