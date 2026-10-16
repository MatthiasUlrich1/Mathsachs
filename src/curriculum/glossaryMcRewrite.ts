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
  /^(Schaltet|Dient|Dienen|Vermeidet|Ermöglicht|Regelt|Steuert|Misst|Schützt|Hilft|Unterstützt|Begrenzt|Verhindert|Reduziert|Erhöht|Verringert|Speichert|Überträgt|Entzieht|Nimmt|Bewegt|Reguliert|Verbindet|Gewährt|Organisiert|Stellt|Meint|Vergleicht|Erzeugt|Bezeichnet|Beschreibt)\b/i

const EFFECT_VERB =
  /^(Stört|Entsteht|Wird|Werden|Lässt|Lassen|Sendet|Wirft|Nimmt|Geht|Liegt|Steht|Bildet|Zeigt|Enthält|Umfasst|Kennzeichnet|Bezeichnet|Beschreibt|Bedeutet|Gilt|Lenkt|Hat|Haben|Ist|Sind|Ändert|Hängt|Folgt|Treibt|Wandelt|Abbildet|Stellt|Meint|Vergleicht|Gibt|Tritt|Sieht|Erzeugt|Prägt|Verbindet|Gewährt)\b/i

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

function lowerFirst(s: string): string {
  if (!s) return s
  return s.charAt(0).toLowerCase() + s.slice(1)
}

function stripDarunterWrap(m: string): string {
  return m
    .replace(/^Darunter versteht man\s+/i, '')
    .replace(/^(Gemeint ist|Gemeint sind)\s*:?\s*/i, '')
    .replace(/^(Das ist|Das sind)\s+/i, '')
    .replace(/^(Es handelt sich um)\s+/i, '')
    .replace(/^(Sie|Er|Es)\s+dient dazu:\s*/i, '')
    .replace(
      /^(Sie|Er|Es)\s+(bezeichnet|ist|sind|beschreibt|steht für|fungiert als|dient als|kennzeichnet|meint|umfasst)\s+/i,
      '',
    )
    .replace(/^(den|die|das|dem|des|der|ein|eine|einen|einem|einer)\s+/i, '')
    .trim()
}

/** Soften Title-Case abuse after articles/prepositions; capitalize bare nouns. */
function softenTitleCaseBody(body: string): string {
  const words = body.replace(/\s+/g, ' ').trim().split(' ')
  const func = new Set([
    ...PREPS,
    'ein',
    'eine',
    'einen',
    'einem',
    'einer',
    'der',
    'die',
    'das',
    'den',
    'dem',
    'des',
  ])
  const forceLower = new Set([
    'selbst',
    'vollständig',
    'immer',
    'nur',
    'nie',
    'sich',
    'vor',
    'allem',
    'anderen',
    'typischen',
    'politische',
    'zeitliche',
    'geistliche',
    'völlig',
    'direktes',
    'unbeleuchteter',
    'bedrohter',
    'geeigneter',
    'heimische',
    'warmer',
    'feuchter',
    'geschichtlichen',
    'aussendet',
    'ernährt',
    'verbessert',
    'nutzen',
    'meiden',
    'sind',
    'betroffen',
    'folgt',
  ])
  return words
    .map((w, i) => {
      const bare = w.replace(/[^a-zäöüßA-ZÄÖÜ]/g, '')
      const prev = i > 0 ? words[i - 1]!.replace(/[^a-zäöüß]/gi, '').toLowerCase() : ''

      // Finite verbs wrongly Title-Cased mid-sentence
      if (
        i > 0 &&
        /^[A-ZÄÖÜ]/.test(bare) &&
        /^(Aussendet|Ernährt|Verbessert|Nutzen|Meiden|Folgt|Sendet|Wirft|Geht|Wird|Werden|Sind|Ist|Hat|Haben)$/i.test(
          bare,
        )
      ) {
        return lowerFirst(w)
      }

      if (i === 0) {
        // Capitalize leading bare noun fragments: „atemorgan für …“
        if (/^[a-zäöü]/.test(bare) && bare.length > 2 && !PREPS.has(bare.toLowerCase())) {
          return `${bare.charAt(0).toUpperCase()}${bare.slice(1)}${w.slice(bare.length)}`
        }
        return w
      }
      if (!func.has(prev)) return w
      if (forceLower.has(bare.toLowerCase())) return lowerFirst(w)
      const next = words[i + 1]
      if (
        next &&
        /^[A-ZÄÖÜ]/.test(next) &&
        /(e|er|es|en|em|iges|liches|isches|ares)$/i.test(bare)
      ) {
        return lowerFirst(w)
      }
      // Article + lowercase noun → capitalize noun
      if (
        /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer)$/i.test(prev) &&
        /^[a-zäöü]/.test(bare) &&
        bare.length > 2
      ) {
        return `${bare.charAt(0).toUpperCase()}${bare.slice(1)}${w.slice(bare.length)}`
      }
      return w
    })
    .join(' ')
}

/**
 * Mechanical glossary wrappers (Sie bezeichnet / Sie ist das …) that must be rebuilt.
 * Keeps rich relative-clause answers (Timer/Kieme caliber).
 */
export function isMechanicalGlossaryOption(opt: string): boolean {
  const o = opt.replace(/\s+/g, ' ').trim()
  if (!o) return false
  if (/^(Sie|Er|Es)\s+bezeichnet\b/i.test(o)) return true
  if (/^(Sie|Er|Es)\s+ist\s+(das|die|der|den|ein|eine|einen)\b/i.test(o)) {
    // Rich teacher-style relative clause — keep
    if (/,\s*(mit|durch|über|für|bei|in|an|aus)\s+(dem|der|die|den|einem|einer)\b/i.test(o)) {
      return false
    }
    if (/,\s*(der|die|das)\s+\S+/i.test(o) && o.split(/\s+/).length >= 10) return false
    return true
  }
  // Broken pronoun+lowercase stub: „Sie auftriebshilfe …“
  if (
    /^(Sie|Er|Es)\s+[a-zäöü]/i.test(o) &&
    !PURPOSE_VERB.test(o.replace(/^(Sie|Er|Es)\s+/i, '')) &&
    !EFFECT_VERB.test(o.replace(/^(Sie|Er|Es)\s+/i, ''))
  ) {
    return true
  }
  return false
}

/** Weak glossary option wraps that must be rebuilt (fragment / bad casing). */
export function isWeakGlossaryOption(opt: string): boolean {
  const o = opt.replace(/\s+/g, ' ').trim()
  if (!o) return true
  if (/\\u00[0-9a-f]{2}/i.test(o)) return true
  if (isMechanicalGlossaryOption(o)) return true
  // Monotonous „Gemeint ist …“ wrappers — always rebuild into natural sentences
  if (/^Gemeint ist:?\s*/i.test(o) || /^Gemeint sind:?\s*/i.test(o)) return true
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
    !/^(Sie|Er|Es|Man|Licht|Wärme|Energie|Der|Die|Das|Ein|Eine|Es handelt|Das ist)\b/i.test(o)
  ) {
    return true
  }
  return false
}

/** True when bank text is already a natural full MC option — do not re-wrap. */
function alreadyFullOption(m: string): boolean {
  if (isWeakGlossaryOption(m) || isMechanicalGlossaryOption(m)) return false
  if (/^Gemeint ist\b|^Gemeint sind\b|^Darunter versteht man\b/i.test(m)) return false
  const words = m.split(/\s+/).length
  const hasVerb =
    /\b(ist|sind|hat|haben|wird|werden|lässt|lassen|dient|dienen|beschreibt|bezeichnet|steht|meint|handelt|verbindet|regelt|steuert|misst|schützt|entzieht|sendet|wirft|bildet|zeigt|enthält|umfasst|kennzeichnet|bedeutet|gilt|lenkt|ändert|hängt|folgt|treibt|wandelt|abbildet|schaltet|vermeidet|ermöglicht|nimmt|bewegt|reguliert|entsteht|geht|liegt|stört|fungiert|organisiert|fasst)\b/i.test(
      m,
    )
  // Prefer bank-authored full sentences (Timer/Transparent caliber)
  if (words >= 8 && hasVerb) return true
  if (words >= 6 && /[.!?]$/.test(m) && hasVerb) return true
  if (
    /^(Sie|Er|Es|Man|Damit|Dabei|Hier|Das|Die|Der|Licht|Wärme|Energie|Es handelt)\b/i.test(m) &&
    words >= 6 &&
    hasVerb
  ) {
    return true
  }
  return false
}

function hashPick(seed: string, n: number): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  return Math.abs(h) % n
}

function isLikelyAdjective(word: string): boolean {
  return /(ig|lich|isch|iv|al|är|os|bar|sam|ig|iv)(e|er|es|en|em)?$/i.test(word) ||
    /^(geradliniges|teilweise|völlig|äußere|widerstandsarme|zeitliche|politische|geistliche)$/i.test(
      word,
    )
}

function articleForHead(head: string, term: string): string {
  const low = head.toLowerCase()
  if (
    /(ung|heit|keit|schaft|ion|tät|ik|enz|anz|ur|treue|freiheit|ordnung|hilfe|form|schicht|blase|linse)$/i.test(
      low,
    ) ||
    (/e$/i.test(low) && !/(ee|ie)$/i.test(low) && low.length > 3)
  ) {
    return 'die'
  }
  if (
    /(chen|lein|ment|tum|um|organ|system|modell|recht|wesen|maß|licht|gas)$/i.test(low)
  ) {
    return 'das'
  }
  if (/(er|en|el|körper|bereich|schatten|spiegel|filter|sensor|pixel|bund)$/i.test(low)) {
    return 'der'
  }
  const p = pronounFor(term)
  if (p === 'Sie') return 'die'
  if (p === 'Er') return 'der'
  return 'das'
}

function withNominativeNp(body: string, term: string): string {
  let b = softenTitleCaseBody(body).replace(/\.$/, '').trim()
  if (!b) return b
  if (/^(der|die|das|ein|eine)\s+/i.test(b)) {
    return b.replace(/^den\s+/i, 'der ').replace(/^dem\s+/i, 'dem ')
  }
  // Plural-ish bare NPs
  if (
    /^(maßnahmen|freiheiten|urkunden|abgaben|register|schuppen|flossen)\b/i.test(b) ||
    (/^[A-ZÄÖÜ][a-zäöüß]+en\b/.test(b) &&
      /maßnahmen|freiheiten|abgaben|urkunden/i.test(b))
  ) {
    return lowerFirst(b)
  }
  const words = b.split(/\s+/)
  const head = words[0] ?? ''
  if (isLikelyAdjective(head) && words.length >= 2) {
    const noun = words[1]!
    const art = articleForHead(noun, term)
    let adj = lowerFirst(head)
    if (/^(das|ein)$/i.test(art) && /es$/i.test(adj)) adj = adj.replace(/es$/i, 'e')
    if (/^(die|eine)$/i.test(art) && /es$/i.test(adj)) adj = adj.replace(/es$/i, 'e')
    return `${art} ${adj} ${words.slice(1).join(' ')}`
  }
  const art = articleForHead(head, term)
  return `${art} ${b}`
}

function toAccusativeNp(np: string): string {
  return np
    .replace(/^der\s+/i, 'den ')
    .replace(/^ein\s+(?![aeiouäöü])/i, 'einen ')
}

/**
 * Natural full answer from a meaning fragment — varied stems, no default Sie-bezeichnet.
 */
function asDefinitionSentence(term: string, meaning: string): string {
  const pron = pronounFor(term)
  let body = softenTitleCaseBody(stripDarunterWrap(meaning)).replace(/\.$/, '').trim()
  if (!body) return ensurePeriod(`${pron} beschreibt einen verwandten Sachverhalt`)

  if (PURPOSE_VERB.test(body) || EFFECT_VERB.test(body)) {
    return ensurePeriod(`${pron} ${lowerFirst(body)}`)
  }
  if (
    /^(Licht|Wärme|Energie|Man|Der|Die|Das|Ein|Eine)\b/i.test(body) &&
    body.split(/\s+/).length >= 3
  ) {
    return ensurePeriod(body.charAt(0).toUpperCase() + body.slice(1))
  }

  // Date stubs: „ab 1929“
  if (/^ab\s+\d{3,4}\b/i.test(body) || /^\d{3,4}$/.test(body)) {
    const t = displayGlossaryTerm(term)
    return ensurePeriod(`${t || 'Der Begriff'} meint die Entwicklung ${body}`)
  }

  // Comma lists / short slogans — natural enumeration, no „Gemeint ist:“
  if (/,/.test(body) && body.split(/\s+/).length <= 6) {
    const parts = body.split(',').map((p) => {
      const s = p.trim()
      return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
    })
    const joined =
      parts.length >= 3
        ? `${parts.slice(0, -1).join(', ')} und ${parts[parts.length - 1]}`
        : parts.join(' und ')
    return ensurePeriod(`${pron} umfasst ${joined}`)
  }

  if (
    body.split(/\s+/).length <= 3 &&
    !/^(der|die|das|ein|eine)\b/i.test(body)
  ) {
    if (/^(ab|bei|nach|vor|um)\b/i.test(body)) {
      const t = displayGlossaryTerm(term)
      return ensurePeriod(`${t || 'Der Begriff'} gehört in den Zeitraum ${body}`)
    }
    const t = displayGlossaryTerm(term)
    return ensurePeriod(
      `${t || 'Der Begriff'} steht für ${body.charAt(0).toUpperCase()}${body.slice(1)}`,
    )
  }

  const np = withNominativeNp(body, term)
  if (!np) return ensurePeriod(`${pron} beschreibt einen verwandten Sachverhalt`)

  // Bare plural without article
  if (!/^(der|die|das|ein|eine)\s+/i.test(np)) {
    const plural = /^[a-zäöü]/.test(np) ? np.charAt(0).toUpperCase() + np.slice(1) : np
    return ensurePeriod(
      hashPick(`${term}|${np}`, 2) === 0
        ? `Es handelt sich um ${plural}`
        : `Das sind ${plural}`,
    )
  }

  // Natural definition sentences — never default to „Gemeint ist …“
  const pick = hashPick(`${term}|${np}`, 4)
  switch (pick) {
    case 0:
      return ensurePeriod(`Es handelt sich um ${np}`)
    case 1:
      return ensurePeriod(`Das ist ${np}`)
    case 2:
      return ensurePeriod(`${pron} beschreibt ${toAccusativeNp(np)}`)
    default:
      return ensurePeriod(`${pron} steht für ${np}`)
  }
}

/**
 * Expand a short meaning fragment into a full, comparable answer phrase.
 * Keeps UTF-8 umlauts untouched. Never emits weak „Darunter versteht man den …“ wraps
 * or monotonous „Sie bezeichnet …“ / „Sie ist das …“ templates.
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

  // Unwrap mechanical / weak wraps before deciding whether already full
  if (
    isMechanicalGlossaryOption(m) ||
    isWeakGlossaryOption(m) ||
    /^Darunter versteht man\b/i.test(m) ||
    /^Gemeint ist\b|^Gemeint sind\b/i.test(m)
  ) {
    m = softenTitleCaseBody(stripDarunterWrap(m))
  }

  // Bank already authored a full parallel sentence — keep it (no re-wrap)
  if (alreadyFullOption(meaning.replace(/\s+/g, ' ').trim())) {
    return ensurePeriod(meaning.replace(/\s+/g, ' ').trim())
  }
  if (alreadyFullOption(m)) return ensurePeriod(m)

  const pron = pronounFor(term ?? '')
  const verbish = PURPOSE_VERB.test(m) || EFFECT_VERB.test(m)

  if (verbish) {
    const rest = lowerFirst(m)
    return ensurePeriod(`${pron} ${rest}`)
  }

  if (style === 'process' && /^(Licht|Wärme|Energie|Der|Die|Das|Ein|Eine|Es|Man)\b/i.test(m)) {
    return ensurePeriod(m.charAt(0).toUpperCase() + m.slice(1))
  }

  if (style === 'purpose' || style === 'property') {
    if (verbish || PURPOSE_VERB.test(m) || EFFECT_VERB.test(m)) {
      return ensurePeriod(`${pron} ${lowerFirst(m)}`)
    }
    // Purpose noun phrases → natural „Sie dient als …“ / definition mix
    if (style === 'purpose' && /organ|hilfe|mittel|gerät|deckel|blase|schicht/i.test(m)) {
      const np = withNominativeNp(m, term ?? '')
      const pick = hashPick(`${term}|${m}|purpose`, 3)
      if (pick === 0) return ensurePeriod(`${pron} dient als ${stripDarunterWrap(np)}`)
      if (pick === 1) return ensurePeriod(`Das ist ${np}`)
      return ensurePeriod(`Es handelt sich um ${np}`)
    }
    return asDefinitionSentence(term ?? '', m)
  }

  // definition — varied natural sentences, no Darunter / Sie-bezeichnet default
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
