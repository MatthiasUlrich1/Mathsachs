/**
 * Minimal safe glossary MC rewriter.
 *
 * Upgrades vague meta stems (Was bedeutet / Welche Aussage … fachlich richtig /
 * Was trifft) into concrete Schüler questions, and expands short meaning
 * fragments into full parallel option sentences.
 *
 * Hard rules — never emit:
 * - „Bezeichnet die Bezeichnet“, „zählt inhaltlich“, „— so bei … im Thema“
 * - stock wrongs (Nachbarbegriff / Randdetail / vertauschte Ursache-Wirkung)
 * - layered wrapper mash (Sie bezeichnet die Ist …)
 * - pad wrappers: „ist hier:“ / „ist kurz gesagt:“ / „Hier gilt:“ /
 *   „Es geht um“ / „und zwar gilt“ / „steht im Kern für Folgendes“
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

const PURPOSE_VERB =
  /^(Schaltet|Dient|Dienen|Vermeidet|Ermöglicht|Regelt|Steuert|Misst|Schützt|Hilft|Unterstützt|Begrenzt|Verhindert|Reduziert|Erhöht|Verringert|Speichert|Überträgt|Entzieht|Nimmt|Bewegt|Reguliert|Verbindet|Gewährt|Organisiert|Stellt|Meint|Vergleicht|Erzeugt|Lässt|Lassen|Wirft|Sendet|Bildet|Zeigt|Enthält|Umfasst|Ändert|Hängt|Folgt|Treibt|Wandelt|Gibt|Tritt|Prägt|Unterbricht|Transportiert|Hemmt|Pumpt|Katalysiert|Trennt|Isoliert|Leitet|Bereitet|Erfasst|Wertet|Wirkt|Fängt|Beherbergt|Ergänzt|Nutzt|Dokumentiert|Ordnet|Fasst|Spaltet|Läuft|Unterwirft|Fixiert|Schreibt)\b/i

const EFFECT_VERB =
  /^(Ist|Sind|Wird|Werden|Entsteht|Bedeutet|Gilt|Kennzeichnet|Bezeichnet|Beschreibt|Steht|Liegt|Geht|Hat|Haben|Stört)\b/i

const BANNED_OPTION =
  /Bezeichnet die Bezeichnet|zählt inhaltlich|Fachzusammenhang als zentralen|— so bei|\bNachbarbegriff\b|Randdetail ohne|vertauschte Ursache-Wirkung|bezeichnet die Ist |bezeichnet das Ist |Es das Ist|kennzeichnet das Ist|kennzeichnet die Ist|beschreibt die Ist|\?\?\?|zentralen fachlichen Kern|von Nachbarbegriffen|ist hier:|ist kurz gesagt:|\bHier gilt\b|Es geht um|und zwar gilt|steht im Kern für Folgendes|der Ereignisse|Was bedeutet|bei den behandelten Arten|\bNur Haarfarbe\b|\bNur Zahnzahl\b|ohne biologischen Bezug|Nur Fotosynthese ohne biologischen Bezug|\bEs ist eine Nur\b|\bSie ist eine Nur\b|\bEr ist eine Nur\b|Es ist eine Erbgänge|Es ist eine Lebensraum diktiert|Es beschreibt ein Zwei Membranen/i

/**
 * Title-Case mush after „ist eine“: two+ Title tokens (e.g. „ist eine Franklins Röntgen…“).
 * Plain „ist eine Genommutation, …“ remains valid German.
 */
const TITLE_AFTER_IST_EINE = /\bist eine [A-ZÄÖÜ][a-zäöüß]+ [A-ZÄÖÜ]/

/** Title-Case mush after „beschreibt eine/ein“ (same class as ist-hier pads). */
const TITLE_AFTER_BESCHREIBT_EINE = /\bbeschreibt eine [A-ZÄÖÜ]/
const TITLE_AFTER_BESCHREIBT_EIN = /\bbeschreibt ein [A-ZÄÖÜ]/

/** Gold definition stem that may keep „Was versteht man …“. */
export function isAllowedVerstehtStem(prompt: string): boolean {
  return /Was versteht man in der Geschichtswissenschaft unter einer Quelle\??$/i.test(
    prompt.replace(/\s+/g, ' ').trim(),
  )
}

/** Strip thin-fill slug prefixes like `[ge-k5-lb1-quellen]`. */
export function stripBankSlugPrefix(prompt: string): string {
  return prompt.replace(/^\[[^\]]+\]\s*/u, '').trim()
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
  // Common masculine compound heads without -er suffix
  if (/(strahl|stoff|kreis|punkt|wert|druck|strom|schatten|spiegel)$/i.test(low)) return 'Er'
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

function lowerFirst(s: string): string {
  if (!s) return s
  return s.charAt(0).toLowerCase() + s.slice(1)
}

function ensurePeriod(s: string): string {
  const m = s.replace(/\s+/g, ' ').trim()
  if (!m) return m
  return /[.!?]$/.test(m) ? m : `${m}.`
}

function fixRelativeComma(s: string): string {
  return s.replace(
    /\b([A-Za-zÄÖÜäöüß]{3,})\s+(der|die|das)\s+(selbst|sich|nur|nicht|auch|dabei|völlig|teilweise)\b/gi,
    '$1, $2 $3',
  )
}

export function classifyGlossaryStyle(
  term: string,
  meaning?: string,
  _topic?: string,
): GlossaryStemStyle {
  const t = displayGlossaryTerm(term)
  const m = (meaning ?? '').replace(/\s+/g, ' ').trim()
  const low = t.toLowerCase()
  if (/^(transparent|transluzent|opak)$/i.test(low)) return 'property'
  if (PURPOSE_VERB.test(m) || /organ|gerät|mittel|hilfe|sensor|timer|schutz/i.test(t)) {
    return 'purpose'
  }
  if (EFFECT_VERB.test(m) && !/^(Ist|Sind|Bedeutet)\b/i.test(m)) return 'process'
  return 'definition'
}

/** Vague glossary/meta stems that must be rewritten. */
export function isVagueGlossaryStem(prompt: string): boolean {
  const q = stripBankSlugPrefix(prompt).replace(/\s+/g, ' ').replace(/\?+$/g, '').trim()
  if (isAllowedVerstehtStem(q + '?') || isAllowedVerstehtStem(q)) return false
  return (
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
    /^Was versteht man\b/i.test(q) ||
    /^Was bewirkt oder beschreibt\b/i.test(q)
  )
}

/** Already a concrete application / role / process stem — leave alone. */
export function isConcreteGlossaryStem(prompt: string): boolean {
  const q = prompt.replace(/\s+/g, ' ').trim()
  if (isVagueGlossaryStem(q)) return false
  if (isAllowedVerstehtStem(q)) return true
  return /^(Wozu|Welche Rolle|Womit|Mit welchen|Was bewirkt|Was beschreibt|Was passiert|Berechne|Wie|Warum|Weshalb|Woran|Wofür|Welcher Zusammenhang|Welche Maßnahme|Welche Eigenschaft|Was kennzeichnet|Was ist ein typisches)\b/i.test(
    q,
  )
}

/**
 * Concrete MC stem — never adds „im Thema …“ (formulaic) and never meta glossary.
 */
export function concreteGlossaryStem(
  term: string,
  topic?: string,
  meaning?: string,
): string {
  void topic
  const t = displayGlossaryTerm(term)
  const m = (meaning ?? '').replace(/\s+/g, ' ').trim()
  if (!t) return 'Was kennzeichnet den Sachverhalt in diesem Zusammenhang?'

  const style = classifyGlossaryStyle(t, m)
  const low = t.toLowerCase()

  if (
    low === 'quelle' &&
    /überrest|tradition|vergangenheit|geschicht/i.test(m)
  ) {
    return 'Was versteht man in der Geschichtswissenschaft unter einer Quelle?'
  }

  // Purpose terms even when meaning is a noun phrase (Atemorgan …)
  if (/^Kieme$/i.test(t) || (/\borgan\b/i.test(m) && /kieme|auge|blatt|wurzel/i.test(t))) {
    if (/^Kieme$/i.test(t)) return 'Wozu dient die Kieme bei Wassertieren?'
  }

  if (style === 'property') {
    if (low === 'transparent') return 'Welche Eigenschaft hat ein transparenter Körper?'
    if (low === 'transluzent') return 'Welche Eigenschaft hat ein transluzenter Körper?'
    if (low === 'opak') return 'Welche Eigenschaft hat ein opaker Körper?'
    return `Welche Eigenschaft kennzeichnet ${t}?`
  }

  if (/^Timer\s*\/\s*Sensor$/i.test(t) || /^Timer oder Sensor/i.test(t)) {
    return 'Wozu dienen Timer oder Sensoren bei intelligenter Beleuchtung gegen Lichtverschmutzung?'
  }

  if (
    style === 'purpose' ||
    /\b(organ|gerät|mittel|hilfe)\b/i.test(m) ||
    /organ|gerät|mittel|hilfe|sensor|timer|schutz/i.test(t)
  ) {
    if (/^Kieme$/i.test(t)) return 'Wozu dient die Kieme bei Wassertieren?'
    if (/ oder /.test(t) || /\s/.test(t)) return `Wozu dienen ${t}?`
    if (/(ung|heit|keit|schaft|ion|tät|ik|enz|anz|ur)$/i.test(low) || /e$/i.test(low)) {
      return `Wozu dient die ${t}?`
    }
    return `Wozu dient ${t}?`
  }

  if (style === 'process') return `Was bewirkt ${t}?`

  return `Was kennzeichnet „${t}“?`
}

function stripWraps(m: string): string {
  return m
    .replace(/^Darunter versteht man\s+/i, '')
    .replace(/^(Gemeint ist|Gemeint sind)\s*:?\s*/i, '')
    .replace(/^(Das ist|Das sind)\s+/i, '')
    .replace(/^(Es handelt sich um)\s+/i, '')
    .replace(/^(Sie|Er|Es)\s+steht im Kern für Folgendes:\s*/i, '')
    .replace(/^Es geht um(?: diesen Inhalt)?:\s*/i, '')
    .replace(/^(Der|Die|Das)\s+\S+(?:\s+\S+){0,6}\s+ist hier:\s*/i, '')
    .replace(/^(Der|Die|Das)\s+\S+(?:\s+\S+){0,6}\s+ist kurz gesagt:\s*/i, '')
    .replace(/^(Hier steht)\s+/i, '')
    .replace(/\s+im Mittelpunkt\.?$/i, '')
    .replace(/,\s*und zwar gilt(?: hier)?:\s*/gi, ', ')
    .replace(/\s+und zwar gilt(?: hier)?:\s*/gi, ', ')
    .replace(
      /^(Sie|Er|Es)\s+(bezeichnet|ist|sind|beschreibt|steht für|fungiert als|dient als|kennzeichnet|meint|umfasst|bildet|fasst)\s+/i,
      '',
    )
    .replace(/^(Der|Die|Das)\s+\S+\s+meint:\s*/i, '')
    .replace(/\s*—\s*so bei\b.*$/i, '')
    .trim()
    .replace(/^[.\s]+|[.\s]+$/g, '')
}

/** Capitalize German content words in an NP (keep articles/preps lower). */
function capitalizeNpWords(phrase: string): string {
  const keep = PREPS
  return phrase
    .split(/\s+/)
    .map((w, i) => {
      const bare = w.replace(/^[^a-zäöüßA-ZÄÖÜ]+|[^a-zäöüßA-ZÄÖÜ]+$/giu, '')
      if (!bare) return w
      const low = bare.toLowerCase()
      if (i > 0 && keep.has(low)) return w.replace(bare, low)
      if (/^[a-zäöü]/.test(bare)) {
        return w.replace(bare, bare.charAt(0).toUpperCase() + bare.slice(1))
      }
      return w
    })
    .join(' ')
}

/** Article + NP for a meaning fragment (gender from head noun). */
function meaningAsPredicate(body: string): string {
  const t = fixRelativeComma(body.trim())
  if (!t) return t
  if (/^(der|die|das|ein|eine|einen|einem|einer|den|dem|des)\s/i.test(t)) {
    const rest = t.replace(/^(der|die|das|ein|eine|einen|einem|einer|den|dem|des)\s+/i, '')
    const art = t.match(/^(der|die|das|ein|eine|einen|einem|einer|den|dem|des)/i)![1]!.toLowerCase()
    return `${art} ${capitalizeNpWords(rest)}`
  }
  // Verb-led clause kept as-is (caller may attach pronoun separately).
  if (PURPOSE_VERB.test(t) || EFFECT_VERB.test(t)) return lowerFirst(t)
  const capped = capitalizeNpWords(t)
  const last = (capped.split(/\s+/).pop() ?? capped).toLowerCase()
  if (/(ung|heit|keit|schaft|ion|tät|ik|enz|anz|ur)$/i.test(last) || /e$/i.test(last)) {
    return `eine ${capped}`
  }
  if (
    /(er|or|ismus|us|ling)$/i.test(last) ||
    /(strahl|stoff|kreis|punkt|wert|druck|strom|schatten|spiegel|weg|puls)$/i.test(last)
  ) {
    return `ein ${capped}`
  }
  if (/(chen|lein|ment|tum|um|modell|organ|gebiss)$/i.test(last)) {
    return `ein ${capped}`
  }
  return `eine ${capped}`
}

/**
 * Natural full-sentence fallback for noun/adj fragments.
 * Never emits „ist hier:“ / „kurz gesagt:“ / „Es geht um“ / „und zwar gilt“.
 */
function naturalFragmentOption(term: string, fragment: string): string {
  let body = fragment.replace(/\s+/g, ' ').trim().replace(/[.!?]+$/g, '').trim()
  let enrich = ''
  const em = body.match(/^(.*?),\s*und zwar gilt(?: hier)?:\s*(.+)$/i)
  if (em) {
    body = em[1]!.trim()
    enrich = em[2]!.trim()
  } else {
    const em2 = body.match(/^(.*?);\s*(.+)$/)
    if (em2 && em2[1]!.split(/\s+/).length >= 2) {
      body = em2[1]!.trim()
      enrich = em2[2]!.trim()
    }
  }
  if (!body) body = fragment.replace(/\s+/g, ' ').trim().replace(/[.!?]+$/g, '').trim()
  // Strip leftover pad wrappers from bank text.
  body = body
    .replace(/^(Der|Die|Das)\s+\S+(?:\s+\S+){0,6}\s+ist hier:\s*/i, '')
    .replace(/^(Der|Die|Das)\s+\S+(?:\s+\S+){0,6}\s+ist kurz gesagt:\s*/i, '')
    .replace(/^Es geht um(?: diesen Inhalt)?:\s*/i, '')
    .replace(/,\s*und zwar gilt(?: hier)?:\s*/gi, ', ')
    .trim()

  const t = displayGlossaryTerm(term)
  const pron = t ? pronounFor(t) : 'Es'
  let out: string

  if (PURPOSE_VERB.test(body) || EFFECT_VERB.test(body)) {
    out = ensurePeriod(`${pron} ${lowerFirst(body)}`)
  } else if (/\b(ist|sind|hat|haben|wird|werden|lässt|dient|bedeutet|gilt|bildet|zeigt|enthält|umfasst|sendet|wirft|regelt|steuert|misst|schützt|entsteht|geht|liegt|nimmt|steht)\b/i.test(body)) {
    out = ensurePeriod(body.charAt(0).toUpperCase() + body.slice(1))
  } else {
    const pred = meaningAsPredicate(body)
    out = ensurePeriod(`${pron} ist ${pred}`)
  }

  if (enrich) {
    const hint = enrich.replace(/[.!?]+$/g, '').trim()
    if (hint && !out.toLowerCase().includes(hint.toLowerCase().slice(0, Math.min(20, hint.length)))) {
      // Fold enrich as a plain clause — never „und zwar gilt“.
      out = ensurePeriod(`${out.replace(/[.!?]$/, '')}, ${lowerFirst(hint)}`)
    }
  }

  // Prefer „Die {Term} ist …“ over pads when the pronoun sentence is too short.
  if (out.split(/\s+/).length < 6 && t) {
    const art = pronounFor(t) === 'Sie' ? 'Die' : pronounFor(t) === 'Er' ? 'Der' : 'Das'
    let pred = meaningAsPredicate(body)
    pred = pred.replace(/^(ein|eine|einen)\s+/i, () =>
      art === 'Die' ? 'die ' : art === 'Der' ? 'der ' : 'das ',
    )
    out = ensurePeriod(`${art} ${t} ist ${pred}`)
  }
  // Strip any leaked elongator pads — never invent replacements.
  out = out.replace(/\s+der Ereignisse\.?$/i, '.')
  out = out.replace(/\s+klar und deutlich\.?$/i, '.')
  if (BANNED_OPTION.test(out)) {
    const pred = meaningAsPredicate(body)
    out = ensurePeriod(`${pron} ist ${pred}`)
  }
  return out
}

function asNp(m: string): string {
  return meaningAsPredicate(m)
}

/** Mechanical glossary wrappers that must be rebuilt. */
export function isMechanicalGlossaryOption(opt: string): boolean {
  const o = opt.replace(/\s+/g, ' ').trim()
  if (!o) return false
  if (BANNED_OPTION.test(o)) return true
  if (TITLE_AFTER_IST_EINE.test(o)) return true
  if (TITLE_AFTER_BESCHREIBT_EINE.test(o) || TITLE_AFTER_BESCHREIBT_EIN.test(o)) return true
  if (/\bsteht im Kern für Folgendes\b/i.test(o)) return true
  if (/\bist hier:|\bist kurz gesagt:|\bHier gilt\b|\bEs geht um|\bund zwar gilt|\bder Ereignisse\b/i.test(o)) {
    return true
  }
  if (/\bfasst(?: den Inhalt so)? zusammen:\b/i.test(o)) return true
  if (/^(Sie|Er|Es)\s+(bezeichnet|kennzeichnet|steht für|meint)\b/i.test(o)) return true
  if (/^(Sie|Er|Es)\s+ist\s+(das|die|der|den|ein|eine|einen)\b/i.test(o)) {
    // Keep rich relative-clause answers
    if (/,\s*(mit|durch|über|für|bei|in|an|aus)\s+(dem|der|die|den|einem|einer)\b/i.test(o)) {
      return false
    }
    if (/,\s*(der|die|das)\s+\S+/i.test(o) && o.split(/\s+/).length >= 10) return false
    // Gender/casing mash like „das Körper der Selbst Licht …“ stays mechanical.
    if (
      /\b(das Körper|die Auge|den Verschwinden|der Selbst|Selbst Licht|die Weg)\b/i.test(o) ||
      /\bist\s+das\s+[A-ZÄÖÜ]\w+\s+der\s+[A-ZÄÖÜ]/i.test(o)
    ) {
      return true
    }
    // Plain „Sie ist eine …“ definition sentences (≥6 words) are allowed.
    if (
      /^(Sie|Er|Es)\s+ist\s+(ein|eine|einen|der|die|das|den)\s+[A-ZÄÖÜa-zäöü]/i.test(o) &&
      o.split(/\s+/).length >= 6
    ) {
      return false
    }
    return true
  }
  if (
    /\b(die Auge|das Abstand|den Verschwinden|Vorgang Vorgang|die Weg pro|die Stromweg)\b/i.test(o)
  ) {
    return true
  }
  return false
}

/** Weak glossary option wraps that must be rebuilt. */
export function isWeakGlossaryOption(opt: string): boolean {
  const o = opt.replace(/\s+/g, ' ').trim()
  if (!o) return true
  if (/\\u00[0-9a-f]{2}/i.test(o)) return true
  if (isMechanicalGlossaryOption(o)) return true
  if (/^Gemeint ist:?\s*/i.test(o) || /^Gemeint sind:?\s*/i.test(o)) return true
  if (/^Darunter versteht man\b/i.test(o)) return true
  if (
    o.split(/\s+/).length <= 5 &&
    !/^(Sie|Er|Es|Man|Licht|Wärme|Energie|Der|Die|Das|Ein|Eine|Es handelt|Das ist)\b/i.test(o)
  ) {
    return true
  }
  return false
}

function alreadyFullOption(m: string): boolean {
  if (isWeakGlossaryOption(m) || isMechanicalGlossaryOption(m)) return false
  if (BANNED_OPTION.test(m)) return false
  const words = m.split(/\s+/).length
  if (words < 6 || !/[.!?]$/.test(m)) return false
  if (
    !/^(Sie|Er|Es|Das|Die|Der|Man|Ein|Eine|Im|Licht|Wärme|Bei|Unter|Mit|Ohne)\b/.test(m)
  ) {
    return false
  }
  return /\b(ist|sind|hat|haben|wird|werden|lässt|lassen|dient|dienen|beschreibt|bedeutet|gilt|bildet|zeigt|enthält|umfasst|sendet|wirft|regelt|steuert|misst|schützt|entzieht|verbindet|erzeugt|entsteht|geht|liegt|nimmt|speichert|transportiert|unterbricht|hemmt|pumpt|wandelt|prägt|gewährt|organisiert|fasst|trennt|leitet|nutzt|dokumentiert|ordnet|wirkt|meint|folgt|braucht|brauchen|kennzeichnet)\b/i.test(
    m,
  )
}

/**
 * Expand a short meaning fragment into a full, comparable answer phrase.
 * Safe templates only: verb+pronoun or „Das ist …“. No stock pads, no topic tags.
 */
export function expandGlossaryAnswer(
  meaning: string,
  opts?: { term?: string; topic?: string; style?: GlossaryStemStyle },
): string {
  void opts?.topic
  void opts?.style
  let m = meaning.replace(/\s+/g, ' ').trim()
  if (!m) return m
  m = m.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))

  const term = opts?.term?.replace(/\s+/g, ' ').trim() ?? ''
  if (term) {
    const re = new RegExp(
      `^${displayGlossaryTerm(term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*`,
      'i',
    )
    m = m.replace(re, '').trim()
  }

  if (
    isMechanicalGlossaryOption(m) ||
    isWeakGlossaryOption(m) ||
    /^Darunter versteht man\b/i.test(m) ||
    /^Gemeint ist\b|^Gemeint sind\b/i.test(m)
  ) {
    m = stripWraps(m)
  }

  if (alreadyFullOption(meaning.replace(/\s+/g, ' ').trim())) {
    return ensurePeriod(meaning.replace(/\s+/g, ' ').trim())
  }
  if (alreadyFullOption(m)) return ensurePeriod(m)

  m = fixRelativeComma(stripWraps(m) || m)
  const pron = pronounFor(term)
  const hasVerb =
    /\b(ist|sind|hat|haben|wird|werden|lässt|lassen|dient|bedeutet|gilt|bildet|zeigt|zeigen|steht|hemmt|wirft|sendet|regelt|misst|schützt|entzieht|geht|liegt|folgt|braucht|brauchen|meint|kennzeichnet|enthält|umfasst|verbindet|erzeugt|entsteht|nimmt|speichert|transportiert|macht|machen|gibt|geben|führt|führen|zählt|zählen|gehört|gehören|besteht|bestehen|nennt|nennen|löst|lösen|bewegt|laufen|läuft|fließt|bleibt|kommt|sieht|trägt|hält|findet|bringt|setzt|stellt|legt|zieht|drückt|öffnet|schließt|beginnt|endet|ändert|steigt|fällt|sinkt|wächst|lebt|atmet|kämpft|herrscht|regiert|wählt|gründet|teilt|misst|prüft|beobachtet|erklärt|versteht|lernt|hilft|schützt|baut|produziert)\b/i.test(
      m,
    )

  let out: string
  let naturalVerb = false
  if (/^(Der|Die|Das|Ein|Eine)\b/.test(m) && !hasVerb) {
    out = ensurePeriod(`Es ist ${lowerFirst(m)}`)
    naturalVerb = true
  } else if (PURPOSE_VERB.test(m) || EFFECT_VERB.test(m)) {
    out = ensurePeriod(`${pron} ${lowerFirst(m)}`)
    naturalVerb = true
  } else if (/^(Licht|Wärme|Energie|Man)\b/.test(m) || hasVerb) {
    out = ensurePeriod(m.charAt(0).toUpperCase() + m.slice(1))
    naturalVerb = true
  } else {
    // Natural definition sentence from term + meaning fragment (no Folgendes).
    out = naturalFragmentOption(term, m)
    naturalVerb = true
  }

  out = out.replace(/\b(Aussendet|Ernährt|Verbessert)\b/g, (w) => w.toLowerCase())
  // Only rebuild when the primary path did not yield a natural sentence.
  if (!naturalVerb && (out.split(/\s+/).length < 6 || BANNED_OPTION.test(out))) {
    out = naturalFragmentOption(term, stripWraps(meaning) || meaning)
  }
  if (BANNED_OPTION.test(out)) {
    const bare = ensurePeriod(fixRelativeComma(stripWraps(meaning) || meaning))
    return bare.charAt(0).toUpperCase() + bare.slice(1)
  }
  return out
}

/** Expand a distractor to the same style (parallel options). */
export function expandGlossaryDistractor(
  meaning: string,
  topic?: string,
  opts?: { term?: string; style?: GlossaryStemStyle },
): string {
  void topic
  const expanded = expandGlossaryAnswer(meaning, {
    term: opts?.term,
    style: opts?.style ?? classifyGlossaryStyle(opts?.term ?? '', meaning),
  })
  // Never append topic-tagged stock tails
  return expanded.replace(/\s*—\s*so bei\b.*$/i, '').trim()
}

/**
 * Parse glossary-style prompts and return a concrete stem when possible.
 * Returns null if the prompt should be left unchanged.
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

  let m = q.match(
    /^Was trifft im Thema\s+(.+?)\s+auf\s*[„""']?([^„""']+?)[“""']?\s+zu\s*$/i,
  )
  if (m) {
    return concreteGlossaryStem(m[2]!.trim(), undefined, opts?.meaning)
  }

  m = q.match(/^Was trifft auf\s*[„""']?([^„""']+?)[“""']?\s+zu\s*$/i)
  if (m) return concreteGlossaryStem(m[1]!.trim(), undefined, opts?.meaning)

  m = q.match(/^Was trifft(?: im Thema\s+(.+?))?(?: in diesem Zusammenhang)?\s+zu\s*$/i)
  if (m) return concreteGlossaryStem('', undefined, opts?.meaning)

  m = q.match(/^Welche Aussage beschreibt(?:\s+fachlich)?\s+(.+)$/i)
  if (m) {
    const rest = m[1]!.replace(/\?+$/g, '').trim().replace(/^[„""']|[“""']$/g, '')
    return concreteGlossaryStem(rest, undefined, opts?.meaning)
  }

  m = q.match(
    /^(?:Fachbegriff\s*)?\(([^)]+)\):\s*(?:Was bedeutet(?: der Fachbegriff)?|Was versteht man unter)\s*[„""']([^„""']+)[“""']\s*$/i,
  )
  if (m) return concreteGlossaryStem(m[2]!, undefined, opts?.meaning)

  m = q.match(
    /^Welche Aussage zu\s*[„""']([^„""']+)[“""']\s*(?:\(([^)]+)\))?\s*ist(?:\s+fachlich)?\s+richtig\s*$/i,
  )
  if (m) return concreteGlossaryStem(m[1]!, undefined, opts?.meaning)

  m = q.match(
    /^(?:([^:?]{1,80}):\s*)?Was beschreibt\s*[„""']([^„""']+)[“""']\s*(?:fachlich\s+)?richtig\s*$/i,
  )
  if (m) return concreteGlossaryStem(m[2]!, undefined, opts?.meaning)

  m = q.match(
    /^(?:([^:?]{1,80}):\s*)?(?:Was bedeutet(?: der Fachbegriff)?|Was versteht man unter)\s*[„""']([^„""']+)[“""']\s*$/i,
  )
  if (m) return concreteGlossaryStem(m[2]!, undefined, opts?.meaning)

  m = q.match(
    /^Was versteht man(?: im Thema\s+(.+?))?\s+unter\s+(?:einem|einer|einem|dem|der|das|die|den)?\s*(.+)$/i,
  )
  if (m) return concreteGlossaryStem(m[2]!.trim(), undefined, opts?.meaning)

  m = q.match(/^Was bewirkt oder beschreibt\s+(.+?)(?:\s+im Thema\s+(.+))?$/i)
  if (m) return concreteGlossaryStem(m[1]!.trim(), undefined, opts?.meaning)

  if (/^Was ist fachlich richtig$/i.test(q) || /^Welche Aussage ist(?:\s+fachlich)?\s+richtig$/i.test(q)) {
    return concreteGlossaryStem('', undefined, opts?.meaning)
  }

  m = q.match(/^Was bedeutet\s+(.+)$/i)
  if (m) {
    const topic = m[1]!.replace(/\s+qualitativ$/i, '').trim()
    if (topic.split(/\s+/).length >= 4 || /qualitativ|quantitativ|bei |wenn |ohne |mit /i.test(m[1]!)) {
      return null
    }
    return concreteGlossaryStem(topic, undefined, opts?.meaning)
  }

  m = q.match(/^Was ist (ein|eine|der|die|das)\s+(.+)$/i)
  if (m) return concreteGlossaryStem(m[2]!.trim(), undefined, opts?.meaning)

  return null
}

/** @deprecated kept for call-site compat — identity capitalize helper */
export function capitalizeGermanPhrase(text: string): string {
  const parts = text.replace(/\s+/g, ' ').trim().split(' ')
  return parts
    .map((w, i) => {
      const bare = w.replace(/^[^a-zäöüßA-ZÄÖÜ]+|[^a-zäöüßA-ZÄÖÜ]+$/giu, '')
      if (!bare) return w
      const low = bare.toLowerCase()
      if (i > 0 && PREPS.has(low)) {
        return w.replace(bare, low)
      }
      if (/^[a-zäöü]/.test(bare) && i === 0) {
        return w.replace(bare, bare.charAt(0).toUpperCase() + bare.slice(1))
      }
      return w
    })
    .join(' ')
}
