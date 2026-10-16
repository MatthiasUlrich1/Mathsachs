/**
 * Rewrite vague glossary/meta MC stems into concrete Schüler questions
 * and expand fragment answer options into comparable full phrases.
 *
 * Quality bar (Timer/Sensor/Transparent):
 * - concrete application stem (Wozu / Welche Eigenschaft / Woran / Was bewirkt /
 *   Was kennzeichnet / Welche Rolle …) — meaning-aware, NOT meta-glossary
 * - full parallel option sentences with proper German capitalization
 * - NEVER emit „Was trifft …?“, „fachlich richtig“, or weak wraps like
 *   „Darunter versteht man den <fragment>“
 *
 * Used by Physik/Bio/Geschichte bank sanitizers for locked gap/thin-fill content.
 */

export type GlossaryStemStyle = 'purpose' | 'property' | 'process' | 'definition'

const PREPS = new Set([
  'zu',
  'zur',
  'zum',
  'von',
  'vom',
  'für',
  'im',
  'in',
  'am',
  'an',
  'auf',
  'bei',
  'vs',
  'oder',
  'und',
  'der',
  'die',
  'das',
  'den',
  'dem',
  'des',
  'ein',
  'eine',
  'einen',
  'einem',
  'einer',
  'mit',
  'ohne',
  'nach',
  'gegen',
  'über',
  'unter',
  'aus',
  'als',
  'bis',
  'um',
  'durch',
  'vor',
  'seit',
])

/** Gold definition stem that may keep „Was versteht man …“. */
export function isAllowedVerstehtStem(prompt: string): boolean {
  return /Was versteht man in der Geschichtswissenschaft unter einer Quelle\??$/i.test(
    prompt.replace(/\s+/g, ' ').trim(),
  )
}

/** Already a concrete application / role / process stem — leave alone. */
export function isConcreteGlossaryStem(prompt: string): boolean {
  const q = prompt.replace(/\s+/g, ' ').trim()
  if (isVagueGlossaryStem(q)) return false
  if (isAllowedVerstehtStem(q)) return true
  return /^(Wozu|Welche Rolle|Womit|Mit welchen|Was bewirkt|Was beschreibt|Was passiert|Berechne|Wie|Warum|Weshalb|Woran|Wofür|Welcher Zusammenhang|Welche Maßnahme|Welche Eigenschaft|Was kennzeichnet|Was beschreibt die|Was ist ein typisches)\b/i.test(
    q,
  )
}

/** Vague glossary/meta stems that must be rewritten. */
export function isVagueGlossaryStem(prompt: string): boolean {
  const q = stripBankSlugPrefix(prompt).replace(/\s+/g, ' ').replace(/\?+$/g, '').trim()
  if (isAllowedVerstehtStem(q + '?') || isAllowedVerstehtStem(q)) return false
  return (
    // Glossary/meta only — not application MCs like „Welche Aussage zur SRT passt?“ / „Was trifft den 2. Hauptsatz…“.
    /^Was trifft auf\b/i.test(q) ||
    /^Was trifft im Thema\b/i.test(q) ||
    /^Was trifft(?: in diesem Zusammenhang)?\s*zu$/i.test(q) ||
    /fachlich\s+richtig/i.test(q) ||
    /^Welche Aussage beschreibt(?:\s+fachlich)?\b/i.test(q) ||
    /^Welche Aussage zu\s*[„""']/i.test(q) ||
    /^Welche Aussage ist(?:\s+fachlich)?\s+richtig$/i.test(q) ||
    /^(?:Fachbegriff\s*)?\([^)]+\):\s*(?:Was bedeutet|Was versteht man unter)\b/i.test(q) ||
    /^(?:[^:?]{1,80}:\s*)?Was bedeutet(?: der Fachbegriff)?\s*[„""']/i.test(q) ||
    /^Was bedeutet\s+\S+$/i.test(q) ||
    /^Was ist fachlich richtig$/i.test(q) ||
    /^Was ist (ein|eine|der|die|das)\s+\S+$/i.test(q) ||
    // Meta glossary drill (except Quelle gold above)
    /^Was versteht man\b/i.test(q) ||
    // Generic dump template from earlier pass
    /^Was bewirkt oder beschreibt\b/i.test(q)
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
  /^(Schaltet|Dient|Dienen|Vermeidet|Ermöglicht|Regelt|Steuert|Misst|Schützt|Hilft|Unterstützt|Begrenzt|Verhindert|Reduziert|Erhöht|Verringert|Speichert|Überträgt|Entzieht|Nimmt|Bewegt|Reguliert)\b/i

const EFFECT_VERB =
  /^(Stört|Entsteht|Wird|Werden|Lässt|Lassen|Sendet|Wirft|Nimmt|Geht|Liegt|Steht|Bildet|Zeigt|Enthält|Umfasst|Kennzeichnet|Bezeichnet|Beschreibt|Bedeutet|Gilt|Lenkt|Hat|Haben|Ist|Sind|Ändert|Hängt|Folgt|Treibt|Wandelt|Abbildet)\b/i

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
  if (
    /organ|gerät|mittel|hilfe|sensor|timer|deckel|blase|werkzeug|schutzschicht/i.test(t) ||
    /organ|gerät|mittel|hilfe|schützt|steuert|misst|entzieht/i.test(m)
  ) {
    return 'purpose'
  }
  if (/stört|blend/i.test(m) || /^(Licht wird|Entsteht|Wärme|Energie|Wird |Werden )/i.test(m)) {
    return 'process'
  }
  if (EFFECT_VERB.test(m)) return 'process'
  if (/quelle|chronologie|epoche|herrschaft|gesellschaft|revolution|migration/i.test(t)) {
    return 'definition'
  }
  if (m && m.split(/\s+/).length <= 5 && !PURPOSE_VERB.test(m)) return 'definition'
  return 'definition'
}

/**
 * Build a concrete MC stem from term + optional topic/meaning.
 * Never returns „Was trifft …?“ or generic „Was versteht man …“ (except Quelle gold).
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
  const m = (meaning ?? '').replace(/\s+/g, ' ').trim()
  const low = t.toLowerCase()

  if (style === 'purpose') {
    let label = t
    if (/^Timer oder Sensor$/i.test(t)) label = 'Timer oder Sensoren'
    if (/^Kieme$/i.test(t)) {
      return topicClean
        ? `Wozu dient die Kieme im Thema ${topicClean}?`
        : 'Wozu dient die Kieme bei Wassertieren?'
    }
    const base =
      / oder /.test(label) || /\s/.test(label)
        ? `Wozu dienen ${label}`
        : /(ung|heit|keit|schaft|ion|tät|ik|enz|anz|ur)$/i.test(low) || /e$/i.test(low)
          ? `Wozu dient die ${label}`
          : `Wozu dient ${label}`
    return topicClean ? `${base} im Thema ${topicClean}?` : `${base}?`
  }

  if (style === 'property') {
    return `Welche Eigenschaft hat ${indefinitePhrase(t)}?`
  }

  if (style === 'process') {
    if (/stört|blend/i.test(m) || /blend/i.test(low)) {
      return topicClean
        ? `Woran erkennt man ${t} im Thema ${topicClean}?`
        : `Woran erkennt man ${t}?`
    }
    if (/beschreibt|bezeichnet|bedeutet|kennzeichnet|gilt|ordnung/i.test(m)) {
      return topicClean
        ? `Was beschreibt ${t} im Thema ${topicClean}?`
        : `Was beschreibt ${t}?`
    }
    return topicClean ? `Was bewirkt ${t} im Thema ${topicClean}?` : `Was bewirkt ${t}?`
  }

  // definition — meaning-aware; only Geschichts-Quelle keeps meta „Was versteht man“
  if (
    low === 'quelle' &&
    /überrest|tradition|vergangenheit|geschicht/i.test(`${topicClean ?? ''} ${m}`)
  ) {
    return 'Was versteht man in der Geschichtswissenschaft unter einer Quelle?'
  }
  if (/ordnung|chronologie|zeit|epoche|schicht|struktur|system/i.test(`${t} ${m}`)) {
    return topicClean
      ? `Was kennzeichnet ${t} im Thema ${topicClean}?`
      : `Was kennzeichnet ${t}?`
  }
  if (/rolle|funktion|aufgabe|zweck|macht|herrschaft|recht|bund|wesen/i.test(`${t} ${m}`)) {
    return topicClean
      ? `Welche Rolle hat ${t} im Thema ${topicClean}?`
      : `Welche Rolle hat ${t}?`
  }
  if (/mittel|maßnahme|weg|methode/i.test(`${t} ${m}`)) {
    return topicClean
      ? `Mit welchen Mitteln beschreibt man ${t} im Thema ${topicClean}?`
      : `Wozu dient ${t}?`
  }
  return topicClean
    ? `Was kennzeichnet ${t} im Thema ${topicClean}?`
    : `Was kennzeichnet ${t}?`
}

function ensurePeriod(s: string): string {
  const m = s.replace(/\s+/g, ' ').trim()
  if (!m) return m
  return /[.!?]$/.test(m) ? m : `${m}.`
}

/** Capitalize German content words; keep prepositions lowercase mid-phrase. */
export function capitalizeGermanPhrase(text: string): string {
  const parts = text.replace(/\s+/g, ' ').trim().split(' ')
  return parts
    .map((w, i) => {
      const m = /^([\("„']*)(.*?)([)"“'.,;:!?]*)$/u.exec(w)
      if (!m) return w
      const [, lead, bare, trail] = m
      if (!bare) return w
      const low = bare.toLowerCase()
      if (i > 0 && PREPS.has(low)) return `${lead}${low}${trail}`
      if (/^[a-zäöü]/.test(bare) && bare.length > 1) {
        return `${lead}${bare.charAt(0).toUpperCase()}${bare.slice(1)}${trail}`
      }
      return w
    })
    .join(' ')
}

function stripDarunterWrap(m: string): string {
  return m
    .replace(/^Darunter versteht man\s+/i, '')
    .replace(/^(Sie|Er|Es)\s+dient dazu:\s*/i, '')
    .replace(/^(Sie|Er|Es)\s+(bezeichnet|ist|sind)\s+/i, '')
    .replace(/^(den|die|das|dem|des|der|ein|eine|einen|einem|einer)\s+/i, '')
    .trim()
}

/** Weak glossary option wraps that must be rebuilt (fragment / bad casing). */
export function isWeakGlossaryOption(opt: string): boolean {
  const o = opt.replace(/\s+/g, ' ').trim()
  if (!o) return true
  if (/\\u00[0-9a-f]{2}/i.test(o)) return true
  if (/^Darunter versteht man\b/i.test(o)) {
    const rest = o.replace(/^Darunter versteht man\s+/i, '').trim()
    // „den atemorgan …“ / bare lowercase noun / short fragment
    if (/^(den|die|das|dem|der|ein|eine|einen)\s+[a-zäöü]/i.test(rest)) return true
    if (/^[a-zäöü]/.test(rest)) return true
    if (rest.split(/\s+/).length <= 7) return true
  }
  // Short noun-only fragment without sentence opener
  if (
    o.split(/\s+/).length <= 5 &&
    !/^(Sie|Er|Es|Man|Licht|Wärme|Energie|Der|Die|Das|Ein|Eine)\b/i.test(o)
  ) {
    return true
  }
  return false
}

function alreadyFullOption(m: string): boolean {
  if (isWeakGlossaryOption(m)) return false
  const words = m.split(/\s+/).length
  if (/^(Sie|Er|Es|Man|Damit|Dabei|Hier|Das|Die|Der|Licht|Wärme|Energie)\b/i.test(m) && words >= 5) {
    return true
  }
  if (words >= 8) return true
  if (words >= 6 && /[.!?]$/.test(m)) return true
  return false
}

function asDefinitionSentence(term: string, meaning: string): string {
  const pron = pronounFor(term)
  let body = stripDarunterWrap(meaning)
  body = capitalizeGermanPhrase(body)
  if (!body) return ensurePeriod(`${pron} beschreibt einen verwandten Sachverhalt`)

  const concreteNp =
    /organ|gerät|schicht|körper|hilfe|mittel|system|blase|deckel|fläche|form|larve|stadium|gewebe|zelle|knoche|muskel|nerv|sensor|pixel|spiegel|linse|widerstand|quelle|epoche|ordnung|herrschaft|recht|bund|wesen|zunft|hanse/i.test(
      body,
    )

  // Ensure article for NP after ist/bezeichnet — keep German noun capitalization
  if (!/^(der|die|das|ein|eine|einen|einem|einer|etwas|das,|die,)\b/i.test(body)) {
    const last = (body.split(/\s+/).pop() ?? '').toLowerCase()
    const art =
      /(ung|heit|keit|schaft|ion|tät|ik|enz|anz|ur)$/i.test(last) || /e$/i.test(last)
        ? 'die'
        : /(chen|lein|ment|tum|um|organ|system|recht|wesen)$/i.test(last)
          ? 'das'
          : 'den'
    body = `${art} ${body}`
  }

  if (concreteNp) {
    // Accusative „den“ after „ist“ is wrong — use nominative for „ist“
    body = body
      .replace(/^den\s+/i, 'das ')
      .replace(/^die\s+/i, (a) => a) // keep
    return ensurePeriod(`${pron} ist ${body}`)
  }
  return ensurePeriod(`${pron} bezeichnet ${body}`)
}

/**
 * Expand a short meaning fragment into a full, comparable answer phrase.
 * Keeps UTF-8 umlauts untouched. Never emits weak „Darunter versteht man den …“ wraps.
 */
export function expandGlossaryAnswer(
  meaning: string,
  opts?: { term?: string; topic?: string; style?: GlossaryStemStyle },
): string {
  let m = meaning.replace(/\s+/g, ' ').trim()
  if (!m) return m
  // Decode accidental JS unicode escapes left in source strings
  m = m.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))

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

  // Unwrap weak Darunter wraps before rebuilding
  if (/^Darunter versteht man\b/i.test(m) || isWeakGlossaryOption(m)) {
    m = stripDarunterWrap(m)
  }

  const pron = pronounFor(term ?? '')
  const verbish = PURPOSE_VERB.test(m) || EFFECT_VERB.test(m)

  if (verbish) {
    const rest = m.charAt(0).toLowerCase() + m.slice(1)
    return ensurePeriod(`${pron} ${rest}`)
  }

  if (style === 'process' && /^(Licht|Wärme|Energie|Der|Die|Das|Ein|Eine|Es|Man)\b/i.test(m)) {
    return ensurePeriod(capitalizeGermanPhrase(m.charAt(0).toUpperCase() + m.slice(1)))
  }

  if (style === 'purpose' || style === 'property') {
    // Verb clause → „Sie schaltet …“; noun phrase → „Sie ist das Atemorgan …“
    if (verbish || PURPOSE_VERB.test(m) || EFFECT_VERB.test(m)) {
      const body = m.charAt(0).toLowerCase() + m.slice(1)
      return ensurePeriod(`${pron} ${body}`)
    }
    return asDefinitionSentence(term ?? '', m)
  }

  // definition — full parallel sentence, no Darunter wrap
  return asDefinitionSentence(term ?? '', m)
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

  if (isAllowedVerstehtStem(q) || isAllowedVerstehtStem(`${q}?`)) {
    return 'Was versteht man in der Geschichtswissenschaft unter einer Quelle?'
  }

  if (isConcreteGlossaryStem(q) && !isVagueGlossaryStem(q)) return null

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

  // Welche Aussage beschreibt (fachlich) TERM?
  m = q.match(/^Welche Aussage beschreibt(?:\s+fachlich)?\s+(.+)$/i)
  if (m) {
    const rest = m[1]!.replace(/\?+$/g, '').trim()
    return concreteGlossaryStem(rest.replace(/^[„""']|[“""']$/g, ''), undefined, opts?.meaning)
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

  // Was versteht man im Thema TOPIC unter einer/einem TERM?
  m = q.match(
    /^Was versteht man(?: im Thema\s+(.+?))?\s+unter\s+(?:einem|einer|einem|dem|der|das|die|den)?\s*(.+)$/i,
  )
  if (m) {
    return concreteGlossaryStem(m[2]!.trim(), m[1]?.trim(), opts?.meaning)
  }

  // Was bewirkt oder beschreibt TERM (im Thema …)?
  m = q.match(/^Was bewirkt oder beschreibt\s+(.+?)(?:\s+im Thema\s+(.+))?$/i)
  if (m) {
    return concreteGlossaryStem(m[1]!.trim(), m[2]?.trim(), opts?.meaning)
  }

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
