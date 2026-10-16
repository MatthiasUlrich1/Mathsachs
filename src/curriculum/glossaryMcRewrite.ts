/**
 * Rewrite vague glossary/meta MC stems into concrete Schüler questions
 * and expand fragment answer options into comparable full phrases.
 *
 * Quality bar (Timer/Sensor): concrete application stem + full parallel options.
 * NEVER emit „Was trifft … zu?“ / „Welche Aussage … fachlich richtig?“ as final stems.
 *
 * Used by Physik/Bio/Geschichte bank sanitizers for locked gap/thin-fill content.
 */

export type GlossaryStemStyle = 'purpose' | 'property' | 'process' | 'definition'

/** Already a concrete application / role / process stem — leave alone. */
export function isConcreteGlossaryStem(prompt: string): boolean {
  const q = prompt.replace(/\s+/g, ' ').trim()
  // Explicitly NOT concrete: Was trifft / fachlich richtig / bare Was bedeutet
  if (isVagueGlossaryStem(q)) return false
  return /^(Wozu|Welche Rolle|Womit|Mit welchen|Was bewirkt|Was passiert|Berechne|Wie|Warum|Weshalb|Woran|Wofür|Welcher Zusammenhang|Welche Maßnahme|Welche Eigenschaft|Was kennzeichnet|Was beschreibt die|Was ist ein typisches|Was versteht man)\b/i.test(
    q,
  )
}

/** Vague glossary/meta stems that must be rewritten. */
export function isVagueGlossaryStem(prompt: string): boolean {
  const q = stripBankSlugPrefix(prompt).replace(/\s+/g, ' ').replace(/\?+$/g, '').trim()
  return (
    /^Was trifft\b/i.test(q) ||
    /fachlich\s+richtig/i.test(q) ||
    /^Welche Aussage\b/i.test(q) ||
    /^(?:Fachbegriff\s*)?\([^)]+\):\s*(?:Was bedeutet|Was versteht man unter)\b/i.test(q) ||
    /^(?:[^:?]{1,80}:\s*)?Was bedeutet(?: der Fachbegriff)?\s*[„""']/i.test(q) ||
    /^Was bedeutet\s+\S+$/i.test(q) ||
    /^Was ist fachlich richtig$/i.test(q) ||
    /^Was ist (ein|eine|der|die|das)\s+\S+$/i.test(q)
  )
}

/** Strip thin-fill slug prefixes like `[ge-k5-lb1-quellen]`. */
export function stripBankSlugPrefix(prompt: string): string {
  return prompt.replace(/^\[[^\]]+\]\s*/u, '').trim()
}

function isMachineTopicId(topic: string): boolean {
  return /^(ph|bio|ge|ma)[\s:_-]/i.test(topic) || /\bk\d+\b/i.test(topic) || /\blb\d+/i.test(topic)
}

export function displayGlossaryTerm(term: string): string {
  return term
    .replace(/\s*\([^)]*\)\s*$/u, '')
    .replace(/\//g, ' oder ')
    .replace(/\s+/g, ' ')
    .trim()
}

function pronounFor(term: string): 'Sie' | 'Er' | 'Es' {
  const t = displayGlossaryTerm(term)
  const low = t.toLowerCase()
  if (/ oder /.test(t)) return 'Sie'
  if (/^(transparent|transluzent|opak)$/i.test(low)) return 'Er'
  if (/(chen|lein|ment|tum|um)$/i.test(low) || /^(licht|gas|eis|pixel|display)$/i.test(low)) {
    return 'Es'
  }
  if (/(ung|heit|keit|schaft|ion|tät|ik|enz|anz|ur)$/i.test(low) || /e$/i.test(low)) {
    return 'Sie'
  }
  if (/(er|or|ismus|us|ling)$/i.test(low)) return 'Er'
  return 'Es'
}

function indefinitePhrase(term: string): string {
  const low = displayGlossaryTerm(term).toLowerCase()
  if (low === 'transparent') return 'ein transparenter Körper'
  if (low === 'transluzent') return 'ein transluzenter Körper'
  if (low === 'opak') return 'ein opaker Körper'
  const t = displayGlossaryTerm(term)
  if (/(ung|heit|keit|schaft|ion|tät|ik|enz|anz|ur)$/i.test(low) || /e$/i.test(low)) {
    return `eine ${t}`
  }
  return `ein ${t}`
}

const PURPOSE_VERB =
  /^(Schaltet|Dient|Dienen|Vermeidet|Ermöglicht|Regelt|Steuert|Misst|Schützt|Hilft|Unterstützt|Begrenzt|Verhindert|Reduziert|Erhöht|Verringert|Speichert|Überträgt)\b/i

const EFFECT_VERB =
  /^(Stört|Entsteht|Wird|Werden|Lässt|Lassen|Sendet|Wirft|Nimmt|Geht|Liegt|Steht|Bildet|Zeigt|Enthält|Umfasst|Kennzeichnet|Bezeichnet|Beschreibt|Bedeutet|Gilt|Lenkt|Hat|Haben|Ist|Sind|Ändert|Hängt|Folgt|Treibt)\b/i

export function classifyGlossaryStyle(
  term: string,
  meaning?: string,
  topic?: string,
): GlossaryStemStyle {
  const t = displayGlossaryTerm(term)
  const m = (meaning ?? '').replace(/\s+/g, ' ').trim()
  const ctx = `${topic ?? ''} ${t}`
  if (
    /^(Transparent|Transluzent|Opak)$/i.test(t) ||
    (/lichtdurch|optik/i.test(ctx) && /lässt|durch/i.test(m))
  ) {
    return 'property'
  }
  if (PURPOSE_VERB.test(m)) return 'purpose'
  if (/stört|blend/i.test(m) || /^(Licht wird|Entsteht|Wärme|Energie|Wird |Werden )/i.test(m)) {
    return 'process'
  }
  if (EFFECT_VERB.test(m)) return 'process'
  if (/quelle|chronologie|epoche|herrschaft|gesellschaft|revolution|migration|kieme/i.test(t)) {
    return 'definition'
  }
  if (m && m.split(/\s+/).length <= 5 && !PURPOSE_VERB.test(m)) return 'definition'
  return 'definition'
}

/**
 * Build a concrete MC stem from term + optional topic/meaning.
 * Never returns „Was trifft …?“.
 */
export function concreteGlossaryStem(
  term: string,
  topic?: string,
  meaning?: string,
): string {
  const t = displayGlossaryTerm(term)
  let topicClean = topic?.replace(/\s+/g, ' ').trim()
  if (topicClean && isMachineTopicId(topicClean)) topicClean = undefined
  if (topicClean && t && topicClean.toLowerCase() === t.toLowerCase()) topicClean = undefined

  if (!t) {
    return topicClean
      ? `Was kennzeichnet den Sachverhalt im Thema ${topicClean}?`
      : 'Was kennzeichnet den Sachverhalt in diesem Zusammenhang?'
  }

  const style = classifyGlossaryStyle(t, meaning, topicClean)

  if (style === 'purpose') {
    let label = t
    if (/^Timer oder Sensor$/i.test(t)) label = 'Timer oder Sensoren'
    const base =
      / oder /.test(label) || /\s/.test(label) ? `Wozu dienen ${label}` : `Wozu dient ${label}`
    return topicClean ? `${base} im Thema ${topicClean}?` : `${base}?`
  }

  if (style === 'property') {
    return `Welche Eigenschaft hat ${indefinitePhrase(t)}?`
  }

  if (style === 'process') {
    return topicClean
      ? `Was bewirkt oder beschreibt ${t} im Thema ${topicClean}?`
      : `Was bewirkt oder beschreibt ${t}?`
  }

  // definition
  const low = t.toLowerCase()
  if (low === 'quelle') {
    return 'Was versteht man in der Geschichtswissenschaft unter einer Quelle?'
  }
  const art =
    /(ung|heit|keit|schaft|ion|tät|ik|enz|anz|ur)$/i.test(low) || /e$/i.test(low)
      ? 'einer'
      : 'einem'
  if (topicClean) {
    return `Was versteht man im Thema ${topicClean} unter ${art} ${t}?`
  }
  return `Was versteht man unter ${art} ${t}?`
}

function ensurePeriod(s: string): string {
  const m = s.replace(/\s+/g, ' ').trim()
  if (!m) return m
  return /[.!?]$/.test(m) ? m : `${m}.`
}

function alreadyFullOption(m: string): boolean {
  const words = m.split(/\s+/).length
  if (/^(Sie|Er|Es|Man|Darunter|Damit|Dabei|Hier|Das|Die|Der)\b/i.test(m) && words >= 4) {
    return true
  }
  if (words >= 8) return true
  if (words >= 6 && /[.!?]$/.test(m)) return true
  return false
}

/**
 * Expand a short meaning fragment into a full, comparable answer phrase.
 * Keeps UTF-8 umlauts untouched. Prefers Sie/Er/Es / Darunter-parallel style.
 */
export function expandGlossaryAnswer(
  meaning: string,
  opts?: { term?: string; topic?: string; style?: GlossaryStemStyle },
): string {
  let m = meaning.replace(/\s+/g, ' ').trim()
  if (!m) return m

  const term = opts?.term?.replace(/\s+/g, ' ').trim()
  const style = opts?.style ?? classifyGlossaryStyle(term ?? '', m, opts?.topic)

  if (term) {
    m = m
      .replace(new RegExp(`^${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*`, 'i'), '')
      .replace(
        new RegExp(
          `^${displayGlossaryTerm(term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*`,
          'i',
        ),
        '',
      )
      .trim()
  }

  if (alreadyFullOption(m)) return ensurePeriod(m)

  const pron = pronounFor(term ?? '')
  const verbish = PURPOSE_VERB.test(m) || EFFECT_VERB.test(m)

  if (verbish) {
    const rest = m.charAt(0).toLowerCase() + m.slice(1)
    return ensurePeriod(`${pron} ${rest}`)
  }

  if (style === 'process' && /^(Licht|Wärme|Energie|Der|Die|Das|Ein|Eine|Es|Man)\b/i.test(m)) {
    return ensurePeriod(m.charAt(0).toUpperCase() + m.slice(1))
  }

  if (style === 'purpose' || style === 'property') {
    const body = m.charAt(0).toLowerCase() + m.slice(1)
    return ensurePeriod(`${pron} ${body}`)
  }

  // definition — keep noun capitalization
  if (/^Darunter versteht man\b/i.test(m)) return ensurePeriod(m)
  const article = /^(den|die|das|dem|des|der|ein|eine|einen|einem|einer)\b/i.test(m)
    ? ''
    : /e$/i.test(m.split(/\s+/).pop() ?? '')
      ? 'die '
      : ''
  const body = article ? m.charAt(0).toLowerCase() + m.slice(1) : m
  return ensurePeriod(`Darunter versteht man ${article}${body}`)
}

/** Expand a distractor to the same style (parallel options). */
export function expandGlossaryDistractor(
  meaning: string,
  topic?: string,
  opts?: { term?: string; style?: GlossaryStemStyle },
): string {
  return expandGlossaryAnswer(meaning, {
    term: opts?.term,
    topic,
    style: opts?.style ?? classifyGlossaryStyle(opts?.term ?? '', meaning, topic),
  })
}

/**
 * Parse glossary-style prompts and return a concrete stem when possible.
 * Returns null if the prompt should be left unchanged (already concrete / not glossary).
 */
export function rewriteVagueGlossaryPrompt(
  prompt: string,
  opts?: { meaning?: string },
): string | null {
  let q = stripBankSlugPrefix(prompt).replace(/\s+/g, ' ').trim()
  q = q.replace(/\?+$/g, '').trim()

  if (isConcreteGlossaryStem(q)) return null

  // Was trifft im Thema TOPIC auf „term“ zu?
  let m = q.match(
    /^Was trifft im Thema\s+(.+?)\s+auf\s*[„""']?([^„""']+?)[“""']?\s+zu\s*$/i,
  )
  if (m) {
    const term = m[2]!.replace(/\s+oder\s+/gi, '/').trim()
    return concreteGlossaryStem(term, m[1]!.trim(), opts?.meaning)
  }

  // Was trifft auf „term“ zu?
  m = q.match(/^Was trifft auf\s*[„""']?([^„""']+?)[“""']?\s+zu\s*$/i)
  if (m) {
    const term = m[1]!.replace(/\s+oder\s+/gi, '/').trim()
    return concreteGlossaryStem(term, undefined, opts?.meaning)
  }

  // Was trifft in diesem Zusammenhang / im Thema X zu?
  m = q.match(/^Was trifft(?: im Thema\s+(.+?))?(?: in diesem Zusammenhang)?\s+zu\s*$/i)
  if (m) {
    return concreteGlossaryStem('', m[1]?.trim(), opts?.meaning)
  }

  // Fachbegriff (topic): Was bedeutet „term“?
  m = q.match(
    /^(?:Fachbegriff\s*)?\(([^)]+)\):\s*(?:Was bedeutet(?: der Fachbegriff)?|Was versteht man unter)\s*[„""']([^„""']+)[“""']\s*$/i,
  )
  if (m) return concreteGlossaryStem(m[2]!, m[1]!.trim(), opts?.meaning)

  // Welche Aussage zu „term“ (topic) ist (fachlich) richtig?
  m = q.match(
    /^Welche Aussage zu\s*[„""']([^„""']+)[“""']\s*(?:\(([^)]+)\))?\s*ist(?:\s+fachlich)?\s+richtig\s*$/i,
  )
  if (m) return concreteGlossaryStem(m[1]!, m[2]?.trim(), opts?.meaning)

  // Was beschreibt „term“ fachlich richtig?
  m = q.match(
    /^(?:([^:?]{1,80}):\s*)?Was beschreibt\s*[„""']([^„""']+)[“""']\s*(?:fachlich\s+)?richtig\s*$/i,
  )
  if (m) return concreteGlossaryStem(m[2]!, m[1]?.trim() || undefined, opts?.meaning)

  // Was bedeutet „term“? / Was versteht man unter „term“?
  m = q.match(
    /^(?:([^:?]{1,80}):\s*)?(?:Was bedeutet(?: der Fachbegriff)?|Was versteht man unter)\s*[„""']([^„""']+)[“""']\s*$/i,
  )
  if (m) return concreteGlossaryStem(m[2]!, m[1]?.trim() || undefined, opts?.meaning)

  // Was ist fachlich richtig? (no term)
  if (/^Was ist fachlich richtig$/i.test(q) || /^Welche Aussage ist(?:\s+fachlich)?\s+richtig$/i.test(q)) {
    return concreteGlossaryStem('', undefined, opts?.meaning)
  }

  // Bare: Was bedeutet ShortTerm?
  m = q.match(/^Was bedeutet\s+(.+)$/i)
  if (m) {
    const topic = m[1]!.replace(/\s+qualitativ$/i, '').trim()
    // Keep richer curricular stems (e.g. „Was bedeutet eine große Dichte qualitativ?“).
    if (topic.split(/\s+/).length >= 4 || /qualitativ|quantitativ|bei |wenn |ohne |mit /i.test(m[1]!)) {
      return null
    }
    return concreteGlossaryStem(topic, undefined, opts?.meaning)
  }

  // Was ist ein/eine/der/die/das Term?
  m = q.match(/^Was ist (ein|eine|der|die|das)\s+(.+)$/i)
  if (m) return concreteGlossaryStem(m[2]!.trim(), undefined, opts?.meaning)

  return null
}
