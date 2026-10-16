/**
 * Inhalts-Audit für generierte Aufgaben (alle Packs × viele Seeds).
 * Wird von `contentQualityAllPacks.test.ts` und `tmp/audit-content-quality.ts`
 * genutzt — Regeln siehe `.cursor/rules/curriculum-aufgaben-qualitaet.mdc`.
 */
import { createRng } from '../lib/rng'
import { resolveTasksPerRound } from './tasksPerRound'
import { buildUniqueTaskRound } from './uniqueRound'
import { isFormulaLikeHint, type Task, type Topic } from './types'

export type AuditSubject = 'mathematik' | 'physik' | 'biologie' | 'geschichte'

export type AuditRule =
  | 'dup-option'
  | 'cross-topic-dup'
  | 'in-topic-near-dup'
  | 'round-dup'
  | 'spoiler'
  | 'meta-slogan'
  | 'banned-format'
  | 'tracking-id'
  | 'topic-abbrev'
  | 'short-round'
  | 'fachwissen'
  | 'notation'
  | 'answer-key'
  | 'throw'

export interface AuditTopicRef {
  pack: string
  /** Packs mit gleicher Gruppe werden gemeinsam auf Cross-Topic-Duplikate geprüft. */
  group: string
  subject: AuditSubject
  gradeId: string
  areaId: string
  topic: Topic
}

export interface AuditIssue {
  rule: AuditRule
  pack: string
  gradeId: string
  areaId: string
  topicId: string
  title: string
  detail: string
}

// ---------------------------------------------------------------------------
// Normalisierung
// ---------------------------------------------------------------------------

const QUOTES = /[„“”"'‚‘’«»‹›`´]/g

/** Text-Normalform für Options-Vergleich: Kleinbuchstaben, ohne Leer-/Satzzeichen. */
export function normalizeOptionText(s: string): string {
  return s
    .normalize('NFKC')
    .toLowerCase()
    .replace(QUOTES, '')
    .replace(/[−–—]/g, '-')
    .replace(/[×*]/g, '·')
    .replace(/\s+/g, '')
    .replace(/[.!?;,]+$/g, '')
    .replace(/^[.!?;,]+/g, '')
}

const SUPERSCRIPT: Record<string, string> = {
  '½': '1/2',
  '⅓': '1/3',
  '⅔': '2/3',
  '¼': '1/4',
  '¾': '3/4',
  '⅕': '1/5',
  '⅛': '1/8',
}

/** Zahlwert einer reinen Zahlenoption (0,5 / 0.5 / 1/2 / ½ / 50 % / 1.000), sonst null. */
export function numericOptionValue(raw: string): number | null {
  let s = raw.normalize('NFKC').trim().replace(/[−–]/g, '-')
  for (const [k, v] of Object.entries(SUPERSCRIPT)) s = s.split(k).join(v)
  s = s.replace(/^\$|\$$/g, '').replace(/\s+/g, ' ').trim()
  const pct = /%$/.test(s)
  if (pct) s = s.replace(/\s*%$/, '')
  s = s.replace(/(\d)\s+(?=\d{3}\b)/g, '$1')
  let v: number | null = null
  let m: RegExpMatchArray | null
  if ((m = s.match(/^(-?\d+)\s*\/\s*(\d+)$/))) {
    const d = Number(m[2])
    v = d === 0 ? null : Number(m[1]) / d
  } else if ((m = s.match(/^(-?\d+) (\d+)\/(\d+)$/))) {
    const d = Number(m[3])
    const whole = Number(m[1])
    v = d === 0 ? null : whole + Math.sign(whole || 1) * (Number(m[2]) / d)
  } else if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) {
    v = Number(s.replace(/\./g, '').replace(',', '.'))
  } else if (/^-?\d+([.,]\d+)?$/.test(s)) {
    v = Number(s.replace(',', '.'))
  }
  if (v === null || !Number.isFinite(v)) return null
  return pct ? v / 100 : v
}

/** Option mit Zahl + Einheit: Zahl kanonisieren, Rest normalisieren. */
function canonicalOption(raw: string): string {
  const val = numericOptionValue(raw)
  if (val !== null) return `#${Math.round(val * 1e9) / 1e9}`
  const unit = raw.match(/^\s*(-?[\d.,\s]+(?:\/\d+)?)\s*([^\d\s].*)$/)
  if (unit) {
    const n = numericOptionValue(unit[1]!.trim())
    if (n !== null) return `#${Math.round(n * 1e9) / 1e9}${normalizeOptionText(unit[2]!)}`
  }
  return normalizeOptionText(raw)
}

const STOP = new Set(
  (
    'der die das den dem des ein eine einen einem einer eines und oder ist sind wird werden ' +
    'zu zum zur im in von vom mit auf für an am bei als nur auch sich es er sie man so wie ' +
    'dass da dann noch sehr hier dort diese dieser dieses jede jeder jedes'
  ).split(' '),
)

const NEGATION = /\b(nicht|kein|keine|keinen|keinem|keiner|nie|niemals|ohne|weniger|kleiner|niedriger|sinkt|fällt|abnehmend)\b/gi

function stemWord(w: string): string {
  return w.replace(/(ern|en|er|es|e|n|s)$/u, '')
}

/** Inhaltswörter in Reihenfolge (für Umformulierungs-Dubletten). */
export function contentWordSeq(s: string): string[] {
  return s
    .normalize('NFKC')
    .toLowerCase()
    .replace(QUOTES, ' ')
    .replace(/[−–]/g, '-')
    .replace(/[×*]/g, '·')
    .replace(/([+=<>≤≥·^√∩∪⊆⊂∈∉|])/g, ' $1 ')
    .replace(/[^\p{L}\p{N}%/,.\-+=<>≤≥·^√∩∪⊆⊂∈∉|() ]+/gu, ' ')
    .replace(/(\d)[.,](\d)/g, '$1d$2')
    .replace(/[,.]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w))
    .map(stemWord)
    .filter(Boolean)
}

/** Option ist Fließtext (Umformulierungs-Vergleich sinnvoll), keine Formel/Zahl. */
function isProseOption(s: string): boolean {
  if (/[<>=≤≥∩∪⊆⊂∈∉+·×^√|/\d]/.test(s)) return false
  return (s.match(/[a-zäöüß]{3,}/gi) ?? []).length >= 2
}

function negationSig(s: string): string {
  return (s.toLowerCase().match(NEGATION) ?? []).sort().join('|')
}

// ---------------------------------------------------------------------------
// 1) Doppelte Antwortoptionen
// ---------------------------------------------------------------------------

type OptionList = { label: string; options: string[]; correct?: Set<string> }

function labelsOf(arr: unknown): string[] {
  if (!Array.isArray(arr)) return []
  return arr
    .map((it) => {
      if (typeof it === 'string') return it
      if (it && typeof it === 'object') {
        const o = it as Record<string, unknown>
        const v = o.label ?? o.text ?? o.value ?? o.id
        return v == null ? '' : String(v)
      }
      return String(it)
    })
    .filter((s) => s.trim() !== '')
}

export function taskOptionLists(task: Task): OptionList[] {
  const ix = task.interactive
  if (!ix) return []
  const p = ix.props ?? {}
  const out: OptionList[] = []
  switch (ix.type) {
    case 'choicePick':
    case 'sourceQuote':
    case 'flashcardFlip':
      out.push({ label: ix.type, options: labelsOf(p.choices) })
      break
    case 'multiSelect': {
      const correct =
        task.sampleAnswer.kind === 'multiSelect' ? new Set(task.sampleAnswer.selected) : undefined
      out.push({ label: ix.type, options: labelsOf(p.choices), correct })
      break
    }
    case 'iconBelong':
      out.push({ label: 'iconBelong', options: labelsOf(p.options) })
      break
    case 'dragDropSort':
    case 'dragDropSlots':
    case 'imageLabelSlots':
      out.push({ label: ix.type, options: labelsOf(p.items) })
      if (Array.isArray(p.slotLabels)) out.push({ label: `${ix.type}.slotLabels`, options: labelsOf(p.slotLabels) })
      break
    case 'pairMatch':
    case 'causeEffect':
      out.push({ label: `${ix.type}.left`, options: labelsOf(p.left) })
      out.push({ label: `${ix.type}.right`, options: labelsOf(p.right) })
      break
    case 'comparePick':
      out.push({
        label: 'comparePick',
        options: labelsOf(
          (p.cards as Array<{ body?: string; title?: string }> | undefined)?.map(
            (c) => c.body ?? c.title ?? '',
          ),
        ),
      })
      break
    case 'findError':
      out.push({ label: 'findError', options: labelsOf(p.statements) })
      break
    case 'imageHotspot':
      out.push({
        label: 'imageHotspot',
        options: labelsOf(
          (p.regions as Array<{ label?: string; id?: string }> | undefined)?.map(
            (r) => r.label ?? r.id ?? '',
          ),
        ),
      })
      break
    default:
      break
  }
  return out.filter((l) => l.options.length > 1)
}

/** Formel-Bausteine dürfen gleiche Symbole mehrfach haben (z. B. zwei „·“). */
function allowsRepeatedTokens(list: OptionList): boolean {
  if (list.label !== 'dragDropSlots') return false
  return list.options.every((o) => o.trim().length <= 4)
}

export function findDuplicateOptions(task: Task): string[] {
  const hits: string[] = []
  for (const list of taskOptionLists(task)) {
    if (allowsRepeatedTokens(list)) continue
    const seenText = new Map<string, string>()
    const seenCanon = new Map<string, string>()
    const seenSeq = new Map<string, string>()
    for (const opt of list.options) {
      const t = normalizeOptionText(opt)
      const prevT = seenText.get(t)
      if (prevT !== undefined) {
        hits.push(`${list.label}: „${prevT}“ = „${opt}“`)
        continue
      }
      seenText.set(t, opt)
      const c = canonicalOption(opt)
      const prevC = seenCanon.get(c)
      if (prevC !== undefined) {
        const bothCorrect = list.correct?.has(prevC) && list.correct?.has(opt)
        if (!bothCorrect) hits.push(`${list.label}: „${prevC}“ ≙ „${opt}“ (gleicher Wert)`)
        continue
      }
      seenCanon.set(c, opt)
      const words = isProseOption(opt) ? contentWordSeq(opt) : []
      if (words.length >= 2) {
        const key = `${words.join(' ')}|${negationSig(opt)}`
        const prevS = seenSeq.get(key)
        if (prevS !== undefined) {
          hits.push(`${list.label}: „${prevS}“ ~ „${opt}“ (gleiche Aussage)`)
          continue
        }
        seenSeq.set(key, opt)
      }
    }
  }
  return hits
}

// ---------------------------------------------------------------------------
// 4) Spoiler im Aufgabentext / Hint / Instruction
// ---------------------------------------------------------------------------

const SPOILER_PATTERNS: Array<[RegExp, string]> = [
  [/punkt\s*vor\s*strich/i, 'Punkt vor Strich'],
  [/klammern?\s+(zuerst|vorher|als erstes)/i, 'Klammern zuerst'],
  [/vorzeichenregel/i, 'Vorzeichenregel'],
  [/rechenvorteil/i, 'Rechenvorteil'],
  [
    /\b(nutze|nutzt|benutze|verwende|wende)\b[^.?!]{0,40}\b(\w*gesetz\w*|\w*regel\w*|\w*formel\w*|\w*satz\b|strategie|verfahren|distributiv\w*|kommutativ\w*|assoziativ\w*|binomisch\w*|pythagoras|dreisatz|kehrwert|hauptnenner)/i,
    'Methodenvorgabe',
  ],
  [
    /\b(mit|nach|über|durch)\s+(dem|der|den|hilfe\s+(des|der))\s+[\wäöüß-]*(gesetz|regel|satz|verfahren|formel)\b/i,
    'Lösungsweg im Stem',
  ],
  [/\bmit\s+(dem\s+)?(distributiv|kommutativ|assoziativ)/i, 'Rechengesetz im Stem'],
  [/\bmit\s+dem\s+kehrwert|\bauf\s+den\s+hauptnenner\s+(bringen|und)\b|\büber\s+den\s+hauptnenner\b/i, 'Rechenweg im Stem'],
  [/\(\s*(tipp|hinweis|regel|merke|erst|zuerst)\b[^)]*\)/i, 'Tipp in Klammern'],
  [/\btipp:/i, 'Tipp im Stem'],
  [/\b(lösung|antwort)\s*:\s*\S/i, 'Lösung im Stem'],
]

/** Formel im Stem, die den Rechenweg vorgibt („Berechne mit F = m · g …“). */
const FORMULA_GIVEN =
  /\b(mit|nach|über|gemäß|aus|durch)\s+(der\s+formel\s+)?[A-Za-zρηλΔωφτ][\w_]{0,4}\s*=\s*[A-Za-zρηλΔωφτ½√][\w_]{0,4}\s*[·*/×+−-]\s*[A-Za-zρηλΔωφτ(½√]/

/** Erlaubte Topic-Hints: nur Antwortformat / Bedienung, keine Strategie. */
const FORMAT_HINT_START =
  /^(Tippe|Gib|Antworte|Antwortformat|Wähle|Trage|Schreibe .* ein|Nutze das Komma als Dezimaltrennzeichen|1 Kästchen|Bei Buchstaben|Stelle .* (am|mit dem) (Slider|Schieberegler) ein|Werkzeug|Ziehe|Runde auf|Ergebnis in|Einheit|Mehrfachauswahl|Mehrere Antworten)/i
const HINT_STRATEGY =
  /\b(nutze|zerlege|zuerst|erst\b|setze|rechne|multiplizier|dividier|addier|subtrahier|ordne|bilde|vergleiche|leite|löse|faktorisier|quadrier|kehrwert|regel|gesetz|satz|formel|ergänz|ergeben|gleich groß|immer|bedeutet|heißt|zähle|teile|beseitig|bringe|kehre|probiere|zeichne|lies|schau|achte|beachte|übersetze|stelle die proportion)\b|=|→|⇔|\bja\W{0,3}\s*(oder|\/)\s*\W{0,3}nein\b|\b(richtig|wahr)\W{0,3}\s*(oder|\/)\s*\W{0,3}falsch\b/i

export function isFormatOnlyHint(hint: string): boolean {
  const h = hint.trim()
  if (!h) return true
  return FORMAT_HINT_START.test(h) && !HINT_STRATEGY.test(h)
}

export function findSpoilers(task: Task, topic: Topic): string[] {
  const hits: string[] = []
  if (topic.hint?.trim() && !isFormulaLikeHint(topic.hint) && !isFormatOnlyHint(topic.hint)) {
    hits.push(`hint: Strategie-Hinweis während des Lösens — ${topic.hint.slice(0, 120)}`)
  }
  const ixProps = task.interactive?.props ?? {}
  const fields: Array<[string, string]> = [
    ['question', task.question ?? ''],
    ['instruction', String(ixProps.instruction ?? '')],
    ['backHint', String(ixProps.backHint ?? '')],
    ['hint', topic.hint ?? ''],
  ]
  for (const [name, text] of fields) {
    if (!text.trim()) continue
    for (const [re, label] of SPOILER_PATTERNS) {
      if (re.test(text)) hits.push(`${name}: ${label} — ${text.slice(0, 120)}`)
    }
    if (name === 'question' && FORMULA_GIVEN.test(text)) {
      hits.push(`question: Formel vorgegeben — ${text.slice(0, 120)}`)
    }
  }
  // Antwort steht wörtlich im Stem (Text-Antworten, nicht Zahlen/Kurzlabels).
  const sol = String(task.solution ?? '').trim()
  const q = task.question ?? ''
  const front = String(ixProps.front ?? '')
  const isTextAnswer = task.answerKind === 'text' && numericOptionValue(sol) === null
  const isTf = /^(richtig|falsch|wahr|ja|nein|stimmt)/i.test(sol)
  const placement = ['coordinateClick', 'coordinateDraw', 'numberLine', 'paramSlider'].includes(
    task.interactive?.type ?? '',
  )
  const offersAlternatives = /\boder\b/i.test(q)
  if (isTextAnswer && !isTf && !placement && !offersAlternatives && sol.length >= 6 && sol.split(/\s+/).length <= 4) {
    const nq = ` ${normalizeOptionText(q)} ${normalizeOptionText(front)} `
    const ns = normalizeOptionText(sol)
    if (ns.length >= 6 && nq.includes(ns)) hits.push(`question: Antwort „${sol}“ steht im Aufgabentext`)
  }
  return hits
}

// ---------------------------------------------------------------------------
// 5) Meta-/Slogan-/Philosophie-Muster
// ---------------------------------------------------------------------------

const META_Q =
  /Unterrichtsthema|für Sachsen relevant|Lehrplan|Lernbereich|Teilaspekt|Kompetenz(en)? (erwerben|entwickeln)|im Unterricht|was (lernst|übst|trainierst) du|wozu (dient|braucht man|lernt man) (das|dieses|diese)\s+(thema|lernbereich|kapitel|wissen|fach)|warum (lernt|übt|behandelt) man|warum ist (es|dieses thema) wichtig|was ist (das )?ziel (des|dieses) (themas|lernbereichs)/i
const PHILO_Q =
  /was denkst du|deine meinung|wie findest du|wie fühlst du|was wäre, wenn|sinn des lebens|was ist (schon )?wahrheit|was ist gerecht(igkeit)?\?/i
/** Absurde Spaß-Distraktoren deuten auf Meta-/Füllfragen hin. */
const ABSURD_DISTRACTOR =
  /\b(biologie|physik|geschichte|mathematik|mathe|schule|unterricht|lehrer|hausaufgaben?)\s+(abzuschaffen|abschaffen|verbieten|zu verbieten|zu üben|üben)\b|um farben zu verbieten|nur physik zu üben/i
const ID_LEAK = /\b(ge|bi|ph|ma)\s+k\d+\s+lb\w*|\blb\d+[a-z]?\b[-_ ]|\bk\d+[-_]lb\d|\[(lb|k)\d[^\]]*\]|\bos[-_ ]?(hs|rs)\b/i
const SLOGAN_Q =
  /Zeichnung zum Sachverhalt|Zahlenaufgabe zu|Rechenvorschrift zu|Was geh(ö|oe)rt zu „(Rechnung|Begriff|Formel|Skizze|Probe|Einheit)“|Einheit:\s*Zahlenbeispiel|Begriff:\s*Zeichnung/i

/** Stichwort-„Aussage“ der Form „Begriff: Fragment.“ ohne Verb. */
export function isSloganStatement(raw: string): boolean {
  const s = raw.replace(QUOTES, '').replace(/\s+/g, ' ').trim()
  const colon = s.match(/^([^:?]{1,48}):\s*(.+)$/)
  if (!colon) return false
  const right = colon[2]!.replace(/[.!?]+$/, '').trim()
  const words = right.split(/\s+/).filter(Boolean)
  const hasVerb =
    /\b(ist|sind|war|waren|wird|werden|wurde|wurden|hat|haben|hatte|hatten|kann|können|konnte|muss|müssen|soll|sollen|darf|gilt|galt|liegt|lag|steigt|fällt|fließt|bedeutet|bedeutete|entsteht|entstand|führt|führte|bildet|bildete|leitet|enthält|gibt|gab|erhält|erhielt|bleibt|blieb|zeigt|zeigte|regiert|regierte|herrschte|begann|endete|kam|gehört|gehörte|besteht|bestand|wirkt|wirken|dient|diente|braucht|brauchen|nimmt|nehmen|erzeugt|transportiert|schützt|steuert|verbindet|trennt|teilt|lebt|leben|frisst|fressen|atmet|atmen|wächst|wachsen|bewegt|ändert|nennt|nannte|heißt|hieß|verdaut|verdauen|antreibt|antreiben|aufnimmt|aufnehmen|zerreißt|zerreißen|festhält|festhalten|unterstützt|unterstützen|speichert|speichern|zerkleinert|zerkleinern|hält|halten|sieht|sehen|orientiert|orientieren)\b/i.test(
      right,
    )
  return !hasVerb && words.length <= 6
}

function tfStatement(task: Task): string | null {
  const choices = labelsOf(task.interactive?.props?.choices).map((c) => c.toLowerCase().trim())
  const tfSet = new Set(['richtig', 'falsch', 'wahr', 'stimmt', 'stimmt nicht', 'ja', 'nein'])
  const isTf = choices.length === 2 && choices.every((c) => tfSet.has(c))
  if (!isTf) return null
  const q = task.question ?? ''
  const m = q.match(/[„"]([^“"]+)[“"]/)
  return m ? m[1]! : q
}

export function findMetaSlogan(task: Task, topic: Topic): string[] {
  const hits: string[] = []
  const q = task.question ?? ''
  const ixProps = task.interactive?.props ?? {}
  const front = String(ixProps.front ?? '')
  const texts = [q, front, String(ixProps.instruction ?? '')]
  for (const t of texts) {
    if (!t) continue
    if (META_Q.test(t)) hits.push(`meta: ${t.slice(0, 120)}`)
    if (PHILO_Q.test(t)) hits.push(`philosophie: ${t.slice(0, 120)}`)
    if (SLOGAN_Q.test(t)) hits.push(`slogan: ${t.slice(0, 120)}`)
    if (ID_LEAK.test(t)) hits.push(`id-leak: ${t.slice(0, 120)}`)
  }
  const opts = taskOptionLists(task).flatMap((l) => l.options)
  for (const o of opts) {
    if (ABSURD_DISTRACTOR.test(o)) {
      hits.push(`absurd/meta-option: „${o}“ in ${q.slice(0, 80)}`)
      break
    }
    if (ID_LEAK.test(o)) {
      hits.push(`id-leak-option: „${o}“`)
      break
    }
  }
  const stmt = tfStatement(task)
  if (stmt && isSloganStatement(stmt)) hits.push(`slogan-tf: ${stmt.slice(0, 120)}`)
  void topic
  return hits
}

// ---------------------------------------------------------------------------
// 6) Verbotene Formate (Mathe / Physik)
// ---------------------------------------------------------------------------

const BANNED_MATH_UI = new Set([
  'pairMatch',
  'clozeMulti',
  'flashcardFlip',
  'causeEffect',
  'dragDropSlots',
  'imageLabelSlots',
  'iconBelong',
])
const BANNED_PHY_UI = new Set(['pairMatch', 'clozeMulti', 'flashcardFlip', 'causeEffect', 'iconBelong'])
const TF_WORDS = new Set(['richtig', 'falsch', 'wahr', 'stimmt', 'stimmt nicht', 'ja', 'nein', 'true', 'false'])
const DEF_DRILL =
  /^(was bedeutet|was versteht man unter|was ist (ein|eine|der|die|das)\b[^?]{0,30}\?$|wie nennt man|wie heißt (der|die|das) (fach)?begriff|welcher (fach)?begriff|welche bezeichnung|ordne (begriff|fachbegriff)|definiere)/i

export function findBannedFormats(task: Task, subject: AuditSubject): string[] {
  if (subject !== 'mathematik' && subject !== 'physik') return []
  const hits: string[] = []
  const ix = task.interactive
  const ui = ix?.type
  const banned = subject === 'mathematik' ? BANNED_MATH_UI : BANNED_PHY_UI
  if (ui && banned.has(ui)) hits.push(`ui:${ui} — ${task.question.slice(0, 100)}`)
  if (subject === 'physik' && ui === 'dragDropSlots' && Array.isArray(ix?.props?.slotLabels)) {
    hits.push(`zuordnung:slotLabels — ${task.question.slice(0, 100)}`)
  }
  const choices = labelsOf(ix?.props?.choices).map((c) => c.toLowerCase().trim())
  if (choices.length === 2 && choices.every((c) => TF_WORDS.has(c))) {
    hits.push(`tf-choice — ${task.question.slice(0, 100)}`)
  }
  const sol = String(task.solution ?? '').trim().toLowerCase()
  if (!ix && task.answerKind === 'text' && TF_WORDS.has(sol)) {
    hits.push(`tf-text — ${task.question.slice(0, 100)}`)
  }
  if (/^(wahr oder falsch|richtig oder falsch|stimmt (das|die aussage))/i.test(task.question)) {
    hits.push(`tf-prompt — ${task.question.slice(0, 100)}`)
  }
  if (task.answerKind === 'text' && /_{2,}|\[\s*…?\s*\]|\.\.\.\s*\?|…\s*(\.|$)/.test(task.question) && !ix) {
    hits.push(`lückentext — ${task.question.slice(0, 100)}`)
  }
  if (subject === 'physik' && DEF_DRILL.test(task.question.trim())) {
    hits.push(`begriffsdrill — ${task.question.slice(0, 100)}`)
  }
  if (
    subject === 'mathematik' &&
    /^(was bedeutet|was versteht man unter|wie nennt man|wie heißt|welcher begriff|welche aussage zu „|was ist (ein|eine|der|die|das)\b)/i.test(
      task.question.trim(),
    )
  ) {
    hits.push(`vokabel — ${task.question.slice(0, 100)}`)
  }
  return hits
}

// ---------------------------------------------------------------------------
// 8) Fachwissen
// ---------------------------------------------------------------------------

const GENERIC_FW =
  /^(Thema „|Zu „[^“]*“: Lies die Aufgabe|Dieses Thema|In diesem Thema|Zum Thema)|In der Übung erklärt Fachwissen|Unterrichtsthema hilft|steht im Lehrplan|laut Lehrplan|Lehrplanziel|für Sachsen relevant|So verstehst du den Zusammenhang — nicht nur ein Rezept|Ziel ist, das Prinzip zu verstehen/i

export function effectiveFachwissen(task: Task, topic: Topic): string {
  return (task.fachwissen?.text ?? topic.fachwissen?.text ?? '').trim()
}

function contentWords(s: string): Set<string> {
  return new Set(
    contentWordSeq(s)
      .map((w) => w.replace(/[()]/g, ''))
      .filter((w) => w.length >= 4 && !/^\d/.test(w))
      .map((w) => w.slice(0, 6)),
  )
}

export function findFachwissenIssues(task: Task, topic: Topic): string[] {
  if (topic.excludeFachwissen) return []
  const fw = effectiveFachwissen(task, topic)
  if (!fw) return ['fehlt']
  if (fw.length < 40) return [`zu kurz: „${fw}“`]
  if (GENERIC_FW.test(fw)) return [`generisch/meta: „${fw.slice(0, 100)}“`]
  const numeric = task.answerKind !== 'text' || numericOptionValue(String(task.solution ?? '')) !== null
  if (!numeric) {
    const fwW = contentWords(fw)
    const qW = contentWords(
      `${task.question} ${task.solution} ${String(task.interactive?.props?.front ?? '')} ${topic.title}`,
    )
    let shared = 0
    for (const w of qW) if (fwW.has(w)) shared++
    if (shared === 0) return [`ohne Bezug zur Aufgabe: „${fw.slice(0, 80)}“ ↔ ${task.question.slice(0, 80)}`]
  }
  return []
}

// ---------------------------------------------------------------------------
// Prompt-Schlüssel (Cross-Topic / Runde)
// ---------------------------------------------------------------------------

const GENERIC_STEM =
  /^(ordne|sortiere|beschrifte|zuordnung|klick-paare|karteikarte|stimmt die aussage|richtig oder falsch|wahr oder falsch|was zeigt die abbildung|welches schaltsymbol|anordnung\b|beim übergang\b|was passiert zwischen|welcher bruchanteil ist|lies die koordinaten|welches netz|multipliziere schriftlich|addiere schriftlich|subtrahiere schriftlich|dividiere schriftlich|welche aussagen? (zu\b|stimmen|stimmt|sind richtig|ist richtig|fachlich)|welche (bewertung|alltagsbedeutung|modellaussage)\b|was bedeutet|was meint|fachbegriff|überblick\b|was passt|tippe|wähle|ziehe|baue die formel|welches (der (drei|vier) )?netz|dividiere schriftlich|setze den punkt|markiere)/i

function interactiveKey(task: Task): string {
  const ix = task.interactive
  if (!ix) return ''
  const p = ix.props ?? {}
  const lists = taskOptionLists(task)
  const parts: string[] = [ix.type]
  if (ix.type === 'choicePick' || ix.type === 'sourceQuote' || ix.type === 'multiSelect' || ix.type === 'iconBelong' || ix.type === 'flashcardFlip') {
    parts.push(normalizeOptionText(String(task.solution ?? '')))
    if (p.front) parts.push(normalizeOptionText(String(p.front)))
    if (p.sourceText) parts.push(normalizeOptionText(String(p.sourceText)))
  } else if (lists.length) {
    for (const l of lists) parts.push(l.options.map(normalizeOptionText).sort().join('|'))
  } else {
    const { instruction: _i, ...rest } = p as Record<string, unknown>
    parts.push(hashString(JSON.stringify(rest)))
  }
  if (Array.isArray(p.segments)) parts.push(normalizeOptionText((p.segments as string[]).join('_')))
  if (ix.type === 'imageLabelSlots') parts.push(String(p.imageSrc ?? ''))
  return parts.join('§')
}

/** Faktenschlüssel einer Aufgabe: normalisierte Inhaltswörter (+ Interaktionsinhalt bei generischem Stem). */
const NOTATION_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /(?<![\d,.])1x(?![\d])/, label: '„1x“ statt „x“' },
  { re: /\(x [+−-] 0\)/, label: '„(x − 0)“ statt „x“' },
  { re: /[a-zA-Z²³ₙ₀-₉] [+−-] 0(?![\d·]|[,.]\d)/, label: '„+ 0“ im Term' },
  { re: /[+−] -\d/, label: 'Vorzeichen ohne Klammer („+ -2“)' },
  { re: /·-\d/, label: 'Faktor ohne Klammer („·-3“)' },
  { re: /[\d)] (?:· ?|: )[−-]\d|[\d)]·[−-]\d/, label: 'negativer Faktor/Divisor ohne Klammer („: −4“)' },
  { re: /(?:^|[\s(=;|[])-\d/, label: 'Bindestrich statt Minuszeichen („-4,5“)' },
  { re: /\(−1\)·x/, label: '„(−1)·x“ statt „−x“' },
  { re: /[a-zA-Z²³] \+ \(−\d+(?:,\d+)?\)(?![²·])/, label: '„x + (−n)“ statt „x − n“' },
]

/**
 * Schreibweise: fehlende Einheit in der Lösung (die Übungsansicht zeigt `solution` ohne `unit`),
 * „1x“, „+ 0“, „+ (−3)“ in Termen.
 */
export function findNotationIssues(task: Task): string[] {
  const out: string[] = []
  const unit = task.unit?.trim()
  if (unit && !task.solution.includes(unit)) {
    out.push(`Einheit fehlt in der Lösung: „${task.solution}“ (Einheit ${unit})`)
  }
  const p = task.interactive?.props ?? {}
  const options = [p.choices, p.options].flatMap((l) =>
    Array.isArray(l) ? l.map((x) => (typeof x === 'string' ? x : String((x as { label?: string })?.label ?? ''))) : [],
  )
  const texts = [task.question, task.solution, task.explanation ?? '', ...options]
  for (const { re, label } of NOTATION_PATTERNS) {
    const hit = texts.find((t) => re.test(t))
    if (hit) out.push(`${label}: ${hit.slice(0, 100)}`)
  }
  return out
}

/** Musterlösung muss die eigene Prüfung bestehen; bei Auswahl muss die richtige Option angeboten werden. */
export function findAnswerKeyIssues(task: Task): string[] {
  const out: string[] = []
  let ok = false
  try {
    ok = task.check(task.sampleAnswer)
  } catch (e) {
    out.push(`check wirft: ${(e as Error).message}`)
  }
  if (!ok && !out.length) out.push(`Musterlösung wird als falsch gewertet: ${task.question.slice(0, 90)}`)
  const p = task.interactive?.props ?? {}
  if (Array.isArray(p.choices) && typeof p.correct === 'string' && !p.choices.includes(p.correct)) {
    out.push(`richtige Option fehlt unter den Auswahlmöglichkeiten: „${p.correct}“ — ${task.question.slice(0, 80)}`)
  }
  return out
}

/** Interne Tracking-Nummern (`· Nr123…`) — verboten im sichtbaren Aufgabentext. */
const TRACKING_ID_RE = /(?:^|[\s·•])Nr\d{4,}\b/i

/** Topic-/Bank-Kurzformen, die nie in der UI stehen dürfen (keine echten Wörter wie „Säugetiere“). */
const TOPIC_ABBREV_RE =
  /\b(krschutz|vgschutz|saeugverh|saeugsoc|saeugsinn|saeugmerk|saeugfort)\b|im Themenfeld\b/i

/** Abgeschnittene Spoiler-Ellipsen mitten im Wort („…ieren“) — verboten. */
const MID_WORD_ELLIPSIS_RE = /…[\p{L}]/u

/** Sichtbare Felder, in denen keine internen IDs stehen dürfen. */
export function visibleTaskTexts(task: Task): string[] {
  const p = task.interactive?.props ?? {}
  const out = [task.question ?? '', task.explanation ?? '', task.fachwissen?.text ?? '']
  for (const key of ['statement', 'claim', 'front', 'sourceText', 'instruction'] as const) {
    const v = p[key]
    if (typeof v === 'string' && v.trim()) out.push(v)
  }
  if (Array.isArray(p.choices)) {
    for (const c of p.choices) if (typeof c === 'string' && c.trim()) out.push(c)
  }
  if (Array.isArray(p.left)) {
    for (const x of p.left) {
      const label = typeof x === 'string' ? x : (x as { label?: string })?.label
      if (typeof label === 'string' && label.trim()) out.push(label)
    }
  }
  if (Array.isArray(p.right)) {
    for (const x of p.right) {
      const label = typeof x === 'string' ? x : (x as { label?: string })?.label
      if (typeof label === 'string' && label.trim()) out.push(label)
    }
  }
  return out.filter((t) => t.trim())
}

export function findTrackingIdIssues(task: Task): string[] {
  const hits: string[] = []
  for (const t of visibleTaskTexts(task)) {
    if (TRACKING_ID_RE.test(t)) hits.push(`interne ID im Text: „${t.slice(0, 100)}“`)
  }
  return hits
}

export function findTopicAbbrevIssues(task: Task): string[] {
  const hits: string[] = []
  for (const t of visibleTaskTexts(task)) {
    if (TOPIC_ABBREV_RE.test(t)) hits.push(`Topic-Abkürzung im Text: „${t.slice(0, 100)}“`)
    if (MID_WORD_ELLIPSIS_RE.test(t)) {
      hits.push(`Abgeschnittene Abkürzung/Ellipse im Wort: „${t.slice(0, 100)}“`)
    }
  }
  return hits
}

export function taskPromptKey(task: Task): string {
  // Tracking-Suffixe zählen nicht zur inhaltlichen Prompt-Identität.
  const q = (task.question ?? '')
    .replace(/\s*[·•]?\s*Nr\d+\b/gi, '')
    .trim()
  const seq = contentWordSeq(q).join(' ')
  const vis = task.visualContent ? `§v${hashString(task.visualContent)}` : ''
  const stmt = tfStatement(task)?.replace(/\s*[·•]?\s*Nr\d+\b/gi, '')
  if (stmt) return `tf:${contentWordSeq(stmt).join(' ')}${vis}`
  const front = String(task.interactive?.props?.front ?? '').replace(/\s*[·•]?\s*Nr\d+\b/gi, '')
  const frontSeq = front ? contentWordSeq(front).join(' ') : ''
  if (GENERIC_STEM.test(q) || seq.length < 8) {
    return `g:${seq}§${frontSeq}§${interactiveKey(task)}${vis}`
  }
  return `q:${seq}${frontSeq ? `§${frontSeq}` : ''}${vis}`
}

function hashString(s: string): string {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(36)
}

/** Reine Rechen-Stämme (Zahlen-Drill): Duplikate über Themen sind dort Zufall + Generator-Reuse. */
export function isNumericDrill(task: Task): boolean {
  if (task.answerKind === 'integer' || task.answerKind === 'decimal' || task.answerKind === 'fraction') return true
  const ui = task.interactive?.type
  return ui === 'digitGrid' || ui === 'numberLine' || ui === 'coordinateClick' || ui === 'equationSteps' || ui === 'paramSlider' || ui === 'coordinateDraw'
}

// ---------------------------------------------------------------------------
// Runden
// ---------------------------------------------------------------------------

export function roundDuplicates(round: Task[]): string[] {
  const hits: string[] = []
  const keys = new Map<string, string>()
  const sols = new Map<string, { q: string; words: Set<string>; nums: string }>()
  for (const t of round) {
    const k = taskPromptKey(t)
    const prev = keys.get(k)
    if (prev !== undefined) hits.push(`gleiche Frage: „${prev.slice(0, 80)}“ / „${t.question.slice(0, 80)}“`)
    else keys.set(k, t.question)
    const sol = normalizeOptionText(String(t.solution ?? ''))
    if (!isNumericDrill(t) && sol.length >= 5 && !/^(richtig|falsch|wahr|ja|nein)/.test(sol)) {
      const words = contentWords(t.question)
      const nums = (t.question.match(/\d+([.,/]\d+)?/g) ?? []).sort().join(' ')
      const p = sols.get(sol)
      if (p && p.nums !== nums) {
        // andere Zahlen → anderer Fall (z. B. 6/2 vs. 8/6 „unecht“)
      } else if (p) {
        let shared = 0
        for (const w of words) if (p.words.has(w)) shared++
        const ratio = shared / Math.max(1, Math.min(words.size, p.words.size))
        if (ratio >= 0.5) hits.push(`gleicher Fakt: „${p.q.slice(0, 70)}“ / „${t.question.slice(0, 70)}“ → ${t.solution}`)
      } else sols.set(sol, { q: t.question, words, nums })
    }
  }
  return hits
}

export interface TopicAuditOptions {
  seeds: number
  roundSeeds: number
}

export interface TopicSample {
  ref: AuditTopicRef
  keys: Map<string, { question: string; numeric: boolean }>
}

/** Prüft ein Thema (alle per-Task-Regeln + Runden). Liefert Issues und Prompt-Keys für Cross-Topic. */
export function auditTopic(ref: AuditTopicRef, opts: TopicAuditOptions): { issues: AuditIssue[]; sample: TopicSample } {
  const { topic } = ref
  const issues: AuditIssue[] = []
  const seenDetail = new Set<string>()
  const push = (rule: AuditRule, detail: string) => {
    const k = `${rule}|${detail}`
    if (seenDetail.has(k)) return
    seenDetail.add(k)
    issues.push({ rule, pack: ref.pack, gradeId: ref.gradeId, areaId: ref.areaId, topicId: topic.id, title: topic.title, detail })
  }
  const keys = new Map<string, { question: string; numeric: boolean }>()
  const nearSeq = new Map<string, string>()
  for (let s = 0; s < opts.seeds; s++) {
    let task: Task
    try {
      task = topic.generate(createRng(s * 104729 + 7))
    } catch (e) {
      push('throw', (e as Error).message)
      continue
    }
    for (const d of findDuplicateOptions(task)) push('dup-option', `${d} — ${task.question.slice(0, 90)}`)
    for (const d of findSpoilers(task, topic)) push('spoiler', d)
    for (const d of findMetaSlogan(task, topic)) push('meta-slogan', d)
    for (const d of findBannedFormats(task, ref.subject)) push('banned-format', d)
    for (const d of findTrackingIdIssues(task)) push('tracking-id', d)
    for (const d of findTopicAbbrevIssues(task)) push('topic-abbrev', d)
    for (const d of findFachwissenIssues(task, topic)) push('fachwissen', d)
    for (const d of findNotationIssues(task)) push('notation', d)
    for (const d of findAnswerKeyIssues(task)) push('answer-key', d)
    const promptKey = taskPromptKey(task)
    // Topics mit withOsTopicIdentity (`topicId::…` in dedupeKey/contentIds): Cross-Topic-Key
    // topic-scoped — ersetzt das frühere sichtbare „· Nr…“, ohne den Schüler-Prompt zu verändern.
    // Bundled Gym-Mathe ohne Wrap: echte Cross-Topic-Prüfung über den Prompt allein.
    const topicScoped =
      (task.dedupeKey?.startsWith(`${topic.id}::`) ?? false) ||
      (task.contentIds ?? []).some((c) => c.startsWith(`${topic.id}::`))
    const key = topicScoped ? `${topic.id}§${promptKey}` : promptKey
    const numeric = isNumericDrill(task)
    if (!keys.has(key)) {
      keys.set(key, { question: task.question, numeric })
      // Fast gleiche Fragen im selben Thema (gleiche Wortfolge, andere Formulierung der Antwort).
      if (!numeric && promptKey.startsWith('q:')) {
        const words = contentWordSeq(task.question)
        const near = `${[...new Set(words.filter((w) => !/\d/.test(w)))].sort().join(' ')}#${words.filter((w) => /\d/.test(w)).join(' ')}`
        const prev = nearSeq.get(near)
        if (prev !== undefined && prev !== task.question && near.length >= 12) {
          push('in-topic-near-dup', `„${prev.slice(0, 80)}“ ≈ „${task.question.slice(0, 80)}“`)
        } else nearSeq.set(near, task.question)
      }
    }
  }
  if (!topic.outlineOnly) {
    const target = resolveTasksPerRound(topic)
    for (let r = 0; r < opts.roundSeeds; r++) {
      let round: Task[]
      try {
        round = buildUniqueTaskRound(topic.generate, createRng(r * 7349 + 101), target)
      } catch (e) {
        push('throw', `round: ${(e as Error).message}`)
        continue
      }
      if (round.length < Math.min(10, target) || (target < 10 && round.length < target)) {
        push('short-round', `Runde ${round.length}/${target}`)
      }
      if (target < 10) push('short-round', `tasksPerRound-Override ${target}`)
      for (const d of roundDuplicates(round)) push('round-dup', d)
    }
  }
  return { issues, sample: { ref, keys } }
}

/** Cross-Topic-Duplikate innerhalb einer Pack-Gruppe (auch LB-/klassenübergreifend). */
export function crossTopicDuplicates(samples: TopicSample[]): AuditIssue[] {
  const byGroup = new Map<string, TopicSample[]>()
  for (const s of samples) {
    const arr = byGroup.get(s.ref.group) ?? []
    arr.push(s)
    byGroup.set(s.ref.group, arr)
  }
  const issues: AuditIssue[] = []
  for (const group of byGroup.values()) {
    // Rechen-Drills: einzelne Zufallstreffer sind ok, große Überschneidung = doppeltes Thema.
    const numOwners = new Map<string, number[]>()
    const numCount = group.map((s) => [...s.keys.values()].filter((v) => v.numeric).length)
    group.forEach((s, idx) => {
      for (const [k, v] of s.keys) {
        if (!v.numeric) continue
        const arr = numOwners.get(k) ?? []
        arr.push(idx)
        numOwners.set(k, arr)
      }
    })
    const pairOverlap = new Map<string, { n: number; example: string }>()
    for (const [k, owners] of numOwners) {
      if (owners.length < 2) continue
      for (let i = 0; i < owners.length; i++) {
        for (let j = i + 1; j < owners.length; j++) {
          const pk = `${owners[i]}|${owners[j]}`
          const cur = pairOverlap.get(pk) ?? { n: 0, example: group[owners[j]!]!.keys.get(k)!.question }
          cur.n++
          pairOverlap.set(pk, cur)
        }
      }
    }
    for (const [pk, v] of pairOverlap) {
      const [a, b] = pk.split('|').map(Number) as [number, number]
      const min = Math.min(numCount[a]!, numCount[b]!)
      if (v.n >= 3 && v.n >= 0.25 * min) {
        const sa = group[a]!
        const sb = group[b]!
        issues.push({
          rule: 'cross-topic-dup',
          pack: sb.ref.pack,
          gradeId: sb.ref.gradeId,
          areaId: sb.ref.areaId,
          topicId: sb.ref.topic.id,
          title: sb.ref.topic.title,
          detail: `Rechen-Pool überschneidet sich zu ${v.n}/${min} mit ${sa.ref.pack}/${sa.ref.topic.id} (z. B. „${v.example.slice(0, 80)}“)`,
        })
      }
    }
    const owner = new Map<string, TopicSample>()
    const reported = new Set<string>()
    for (const s of group) {
      for (const [k, v] of s.keys) {
        if (v.numeric) continue
        const prev = owner.get(k)
        if (!prev) {
          owner.set(k, s)
          continue
        }
        if (prev.ref.topic.id === s.ref.topic.id && prev.ref.pack === s.ref.pack) continue
        const pairKey = `${prev.ref.pack}/${prev.ref.topic.id}|${s.ref.pack}/${s.ref.topic.id}|${k}`
        if (reported.has(pairKey)) continue
        reported.add(pairKey)
        issues.push({
          rule: 'cross-topic-dup',
          pack: s.ref.pack,
          gradeId: s.ref.gradeId,
          areaId: s.ref.areaId,
          topicId: s.ref.topic.id,
          title: s.ref.topic.title,
          detail: `„${v.question.slice(0, 100)}“ auch in ${prev.ref.pack}/${prev.ref.topic.id}`,
        })
      }
    }
  }
  return issues
}
