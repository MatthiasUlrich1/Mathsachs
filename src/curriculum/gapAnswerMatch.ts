/**
 * Central tolerance for free-text / cloze / gap answers across all curricula.
 *
 * Accepts: case, German umlauts (ä↔ae), trailing punctuation, light inflection
 * (Wirkstoff↔Wirkstoffe), and significant words from multi-word accepted phrases.
 * Does not accept unrelated stems (art ⊄ artfremde; short tokens stay exact).
 */

/** Normalize for comparison: trim, casefold, umlauts, trailing sentence punct. */
export function normalizeGapAnswer(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[„“”"'`´]/g, '')
    .replace(/[.!?…]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Letters/digits only (for stem / token checks). */
function lettersForm(text: string): string {
  return normalizeGapAnswer(text)
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Light German inflection / stem match between two single tokens. */
function tokensStemMatch(given: string, accepted: string): boolean {
  if (!given || !accepted) return false
  if (given === accepted) return true
  // Short tokens: exact only (avoid "art" ⊂ "artfremde", "6" noise).
  if (accepted.length < 4 || given.length < 4) return false
  if (given.startsWith(accepted) && given.length - accepted.length <= 4) return true
  if (accepted.startsWith(given) && accepted.length - given.length <= 2) return true
  return false
}

/**
 * True when `given` matches any entry in `accepted`
 * (exact after normalize, stem, or significant multi-word token).
 */
export function gapAnswerMatches(given: string, accepted: readonly string[]): boolean {
  if (!accepted.length) return false
  const n = normalizeGapAnswer(given)
  if (!n) return false

  for (const raw of accepted) {
    const a = normalizeGapAnswer(raw)
    if (!a) continue
    if (n === a) return true
  }

  const nLetters = lettersForm(given)
  if (!nLetters) {
    // Symbolic / punctuation-only (e.g. "<", "="): exact normalize only.
    return false
  }
  const givenTokens = nLetters.split(' ').filter(Boolean)

  for (const raw of accepted) {
    const aLetters = lettersForm(raw)
    if (!aLetters) continue

    if (nLetters === aLetters) return true

    if (aLetters.includes(' ')) {
      const parts = aLetters.split(' ').filter((p) => p.length >= 4)
      // User typed a significant word from the accepted phrase.
      if (parts.some((p) => givenTokens.some((g) => tokensStemMatch(g, p)))) {
        return true
      }
      // User typed the full phrase (possibly with extra fluff words).
      if (` ${nLetters} `.includes(` ${aLetters} `)) return true
      continue
    }

    // Single-token accepted: stem against whole answer or each token.
    if (tokensStemMatch(nLetters, aLetters)) return true
    if (givenTokens.some((g) => tokensStemMatch(g, aLetters))) return true
  }

  // Comma/slash-separated multi-answers: each token must match something accepted.
  const parts = n.split(/[,;/]+/).map((t) => t.trim()).filter(Boolean)
  if (parts.length > 1) {
    return parts.every((tok) => gapAnswerMatches(tok, accepted))
  }

  return false
}

/**
 * Common school-term synonyms / spellings layered onto authored gapAccepted lists.
 * Key = letters-only normalizeGapAnswer form of the primary term.
 */
const GAP_SYNONYM_MAP: Record<string, readonly string[]> = {
  wirkstoff: ['Wirkstoffe', 'Inhaltsstoffe', 'Arzneistoffe', 'Heilstoffe'],
  wirkstoffe: ['Wirkstoff', 'Inhaltsstoffe', 'Arzneistoffe', 'Heilstoffe'],
  dosis: ['Dosierung', 'Menge', 'richtige Dosis'],
  dosierung: ['Dosis', 'Menge'],
  kamille: ['Echte Kamille', 'Kamillentee'],
  bestimmung: ['Pflanzenbestimmung', 'Artbestimmung', 'Identifikation'],
  teeaufguss: ['Aufguss', 'Tee', 'Auszug'],
  aufguss: ['Teeaufguss', 'Tee', 'Auszug'],
  staubblatt: ['Staubgefäß', 'Staubgefaess', 'Staubbeutel'],
  narbe: ['Narben', 'Blütennarbe'],
  samenanlage: ['Samenanlagen', 'Ovule'],
  bestaeubung: ['Pollenübertragung', 'Pollenuebertragung', 'Pollination'],
  befruchtung: ['Fertilisation', 'Keimzellenverschmelzung'],
  spaltoeffnung: ['Stoma', 'Stomata', 'Spaltöffnungen', 'Spaltoeffnungen'],
  fotosynthese: ['Photosynthese', 'Assimilation'],
  photosynthese: ['Fotosynthese', 'Assimilation'],
  sauerstoff: ['O2', 'O₂'],
  kohlenstoffdioxid: ['CO2', 'CO₂', 'Kohlendioxid'],
  wirbelsaeule: ['Rückgrat', 'Rueckgrat'],
  zellkern: ['Kern', 'Nucleus'],
  wasserfloh: ['Daphnia', 'Wasserflöhe', 'Wasserfloeh'],
  einzeller: ['Protist', 'Protisten', 'Mikroorganismus'],
  mikroorganismen: ['Kleinstlebewesen', 'Einzeller'],
  kleinstlebewesen: ['Mikroorganismen', 'Einzeller', 'Mikroben'],
  primaerquelle: ['Originalquelle'],
  sekundaerquelle: ['Zweitquelle'],
  zeitstrahl: ['Zeitleiste'],
  epoche: ['Zeitalter'],
  steuern: ['Steuerung', 'Lenken', 'Lenkung'],
  steuerung: ['Steuern', 'Lenken', 'Lenkung'],
  vortrieb: ['Antrieb'],
  antrieb: ['Vortrieb'],
  stabilitaet: ['Stabilisieren', 'Stabilität'],
}

function synonymKey(term: string): string {
  return normalizeGapAnswer(term)
    .replace(/[^a-z0-9]+/g, '')
    .trim()
}

/** Merge authored accepts with curated synonym lists (deduped, order stable). */
export function enrichGapAccepted(accepted: readonly string[]): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  const add = (s: string) => {
    const k = normalizeGapAnswer(s)
    if (!k || seen.has(k)) return
    seen.add(k)
    out.push(s)
  }
  const addWithSynonyms = (term: string) => {
    add(term)
    const extras = GAP_SYNONYM_MAP[synonymKey(term)]
    if (extras) for (const e of extras) add(e)
  }
  for (const a of accepted) {
    addWithSynonyms(a)
    // Also expand significant words inside multi-word phrases (e.g. „Steuern und Bremsen“).
    for (const word of lettersForm(a).split(' ').filter((w) => w.length >= 4)) {
      addWithSynonyms(word)
    }
  }
  return out
}
