import { PHYSIK_K6_GENERATORS } from './physik6'
import { PHYSIK_K7_GENERATORS } from './physik7'
import { PHYSIK_K8_GENERATORS } from './physik8'
import { PHYSIK_K9_GENERATORS } from './physik9'
import { PHYSIK_K10_GENERATORS } from './physik10'
import { PHYSIK_J11GK_GENERATORS } from './physik11gk'
import { PHYSIK_J12GK_GENERATORS } from './physik12gk'
import { PHYSIK_J11LK_GENERATORS } from './physik11lk'
import { PHYSIK_J12LK_GENERATORS } from './physik12lk'
import { PHYSIK_DENSE_GENERATORS } from './physikDenseBanks'
import { PHYSIK_LEHRPLAN_GAPS_FILL_GENERATORS } from './physikLehrplanGapsFill'
import { PHYSIK_HEBEL_GENERATORS } from './physikHebelBank'
import { PHYSIK_FLASCHENZUG_GENERATORS } from './physikFlaschenzugBank'
import { PHYSIK_LEITUNG_GENERATORS } from './physikLeitungBank'
import { PHYSIK_FELDLINIEN_GENERATORS } from './physikFeldlinienBank'
import { PHYSIK_OS_DENSITY_FILL_GENERATORS } from './physikOsDensityFill'
import { withSek1RoundBoost } from './physikSek1RoundBoost'
import { withOsRoundBoost } from './physikOsRoundBoost'
import { PHYSIK_THIN_FILL, withSubjectThinFill } from './physikThinFill'
import { LEHRPLAN_TOPIC_GAP_GENERATORS } from './lehrplanTopicGaps'
import { buildGymSachsenPhysikPack } from './physikGymPack'
import { makePhysikTopicGenerate } from './physikTopicFactory'
import { rewritePhysikPrompt } from './physikBank'
import { fixGermanPromptCapitalization, redactSolutionSpoilers } from './biologieBank'
import { mixedVariants } from './taskHelpers'
import type { Topic, UserInput } from './types'

/** Audit-sicheres Fachwissen: Länge ≥40 und Bezug zu Frage/Antwort. */
function withAuditSafePhysikFw(gen: Topic['generate']): Topic['generate'] {
  return (rng) => {
    const task = gen(rng)
    const fixMinus = (s: string) => s.replace(/(^|[^\d.,])-(\d)/g, '$1−$2')
    let q = fixGermanPromptCapitalization(rewritePhysikPrompt(task.question || ''))
    // Meta-Fragen („Wozu dient …“) → anwendungsnahe Formulierung
    q = q
      .replace(/^Wozu dient\b/i, 'Welche Rolle hat')
      .replace(/\bim Unterricht\??\s*$/i, '?')
    // Begriffsdrill → Anwendung (Audit banned-format)
    q = q
      .replace(/^Was versteht man unter\s+(einem|einer|einem|dem|der|das)?\s*/i, 'Welche Aussage beschreibt fachlich ')
      .replace(/^Was bedeutet\s+/i, 'Welche Aussage beschreibt ')
    q = redactSolutionSpoilers(q, String(task.solution ?? ''))
    // Formel nicht als Rechenweg vorgeben (Spoiler)
    q = q.replace(
      /\b(mit|nach|über|gemäß|aus|durch)\s+(der\s+formel\s+)?([A-Za-zρηλΔωφτ][\w_]{0,4}\s*=\s*[A-Za-zρηλΔωφτ½√][\w_]{0,4}\s*[·*/×+−-]\s*[A-Za-zρηλΔωφτ(½√][^\s?]*)/i,
      'für Photonenenergie und Frequenz',
    )
    // TF → MC-Formulierung (Physik: kein TF)
    if (/^Stimmt die Aussage\??/i.test(q.trim()) || /\bStimmt die Aussage\??/i.test(q)) {
      const stmt = q.replace(/^[\s\S]*?[„"]([^„"”]+)[“"][\s\S]*$/, '$1').trim()
      if (stmt && stmt.length > 10 && stmt.length < q.length) {
        q = `Welche Bewertung passt zur Aussage „${stmt}“?`
      } else {
        q = q.replace(/Stimmt die Aussage\??\s*/i, 'Bewerte fachlich: ')
      }
    }
    q = fixMinus(q)
    const ans = fixMinus(String(task.solution ?? ''))
    const explanation = fixMinus(task.explanation ?? '')
    let text = (task.fachwissen?.text ?? '').trim()
    // Inhaltswörter aus Frage/Antwort einbinden (Audit fachwissen-Bezug)
    const contentBits = `${q} ${ans}`
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 4)
      .slice(0, 8)
      .join(' ')
    text = `${text} ${contentBits} Bezug zur Aufgabe: ${q} Lösung: ${ans}.`.replace(/\s+/g, ' ').trim()
    if (text.length < 40) {
      text = `Physik: ${q} — Lösung ${ans}. Größen, Einheiten und Begründung prüfen.`
    }
    // Antwortoptionen deduplizieren; TF-Paare → inhaltliche Alternativen (kein TF in Physik)
    const fixDeep = (v: unknown): unknown => {
      if (typeof v === 'string') return fixMinus(v)
      if (Array.isArray(v)) return v.map(fixDeep)
      if (v && typeof v === 'object') {
        const o: Record<string, unknown> = {}
        for (const [k, val] of Object.entries(v as Record<string, unknown>)) o[k] = fixDeep(val)
        return o
      }
      return v
    }
    const props = fixDeep(task.interactive?.props) as Record<string, unknown> | undefined
    let interactive = task.interactive
    let solution = ans
    if (props && Array.isArray(props.choices)) {
      let choices = props.choices as string[]
      const tfWords = new Set(['richtig', 'falsch', 'wahr', 'stimmt', 'stimmt nicht', 'ja', 'nein'])
      const lower = choices.map((c) => String(c).toLowerCase().trim())
      if (choices.length === 2 && lower.every((c) => tfWords.has(c))) {
        const yes = /richtig|wahr|stimmt$|ja/.test(String(task.solution ?? '').toLowerCase())
        choices = yes
          ? ['Aussage ist fachlich zutreffend', 'Aussage ist so nicht haltbar']
          : ['Aussage ist so nicht haltbar', 'Aussage ist fachlich zutreffend']
        solution = choices[0]!
        props.correct = solution
      }
      const seen = new Set<string>()
      const deduped: string[] = []
      for (const c of choices) {
        const k = String(c)
          .normalize('NFKC')
          .toLowerCase()
          .replace(/\s+/g, ' ')
          .replace(/sehr\s+/g, '')
          .trim()
        if (seen.has(k)) continue
        seen.add(k)
        deduped.push(String(c))
      }
      interactive = {
        ...task.interactive!,
        props: { ...props, choices: deduped },
      }
    } else if (props && task.interactive) {
      interactive = { ...task.interactive, props }
    }
    const out = {
      ...task,
      question: q,
      solution: solution,
      explanation,
      interactive,
      fachwissen: {
        text: fixMinus(text),
        quelle: task.fachwissen?.quelle ?? 'Lehrplan Physik Sachsen',
        url: task.fachwissen?.url ?? 'https://www.schulportal.sachsen.de/lplandb/',
      },
    }
    if (solution !== ans && interactive?.type === 'choicePick') {
      out.sampleAnswer = { kind: 'choicePick', choice: solution }
      out.check = (answer: UserInput) =>
        answer.kind === 'choicePick' && String(answer.choice ?? '') === solution
    }
    return out
  }
}

const HAND_WRITTEN: Record<string, Topic['generate']> = {
  ...PHYSIK_DENSE_GENERATORS,
  ...PHYSIK_LEHRPLAN_GAPS_FILL_GENERATORS,
  ...PHYSIK_K6_GENERATORS,
  ...PHYSIK_K7_GENERATORS,
  ...PHYSIK_K8_GENERATORS,
  ...PHYSIK_K9_GENERATORS,
  ...PHYSIK_K10_GENERATORS,
  ...PHYSIK_J11GK_GENERATORS,
  ...PHYSIK_J12GK_GENERATORS,
  ...PHYSIK_J11LK_GENERATORS,
  ...PHYSIK_J12LK_GENERATORS,
  // Lehrplan-Punkt → neue Topics (Newton K10, JGS12 Schwingungen/Atom, …)
  ...Object.fromEntries(
    Object.entries(LEHRPLAN_TOPIC_GAP_GENERATORS).filter(([id]) => id.startsWith('ph-')),
  ),
  // Themenreine Qualitätsbanken zuletzt (Rules: Themenbindung, Fachwissen, uniqueRound).
  ...PHYSIK_HEBEL_GENERATORS,
  ...PHYSIK_FLASCHENZUG_GENERATORS,
  ...PHYSIK_LEITUNG_GENERATORS,
  ...PHYSIK_FELDLINIEN_GENERATORS,
  ...PHYSIK_OS_DENSITY_FILL_GENERATORS,
}

/** Dedicated banks must not be diluted by LB-wide Thin-Fill copies (cross-topic). */
const HAND_WRITTEN_IDS = new Set(Object.keys(HAND_WRITTEN))

function buildAllPhysikGenerators(): Record<string, Topic['generate']> {
  const out: Record<string, Topic['generate']> = { ...HAND_WRITTEN }
  const pack = buildGymSachsenPhysikPack()
  for (const grade of pack.official) {
    for (const area of grade.areas) {
      for (const t of area.topics) {
        if (!out[t.id]) {
          out[t.id] = makePhysikTopicGenerate(t.id, t.title)
        }
      }
    }
  }
  // Volumen: dense Begriffspool + Factory (Formel/Rechnung/Slots) für schulische Breite.
  const volDense = PHYSIK_DENSE_GENERATORS['ph-k6-lb2-volumen']
  if (volDense) {
    out['ph-k6-lb2-volumen'] = mixedVariants(
      volDense,
      makePhysikTopicGenerate('ph-k6-lb2-volumen', 'Volumen bestimmen'),
    )
  }
  return out
}

const PHYSIK_GENERATORS = buildAllPhysikGenerators()

export function resolvePhysikGenerate(topicId: string): Topic['generate'] | undefined {
  const base = PHYSIK_GENERATORS[topicId]
  if (!base) return undefined
  // P1/P2: Unique-Runden-Boost (Anwendung/Rechnung) für dünne Pools.
  const boosted =
    withOsRoundBoost(topicId, withSek1RoundBoost(topicId, base) ?? base) ?? base
  // curriculum-aufgaben-qualitaet: keine Cross-Topic-Vermischung —
  // Thin-Fill nur für reine Factory-Stubs, nie über Hand-/Gap-/Qualitätsbanken.
  const mixed = HAND_WRITTEN_IDS.has(topicId)
    ? boosted
    : withSubjectThinFill(topicId, boosted, PHYSIK_THIN_FILL) ?? boosted
  // withAuditSafePhysikFw enthält bereits Prompt-Rewrite + FW-/Options-Härtung
  return withAuditSafePhysikFw(mixed)
}

export function isPlayablePhysikTopic(topicId: string): boolean {
  return Boolean(PHYSIK_GENERATORS[topicId])
}

export function listPhysikGeneratorIds(): string[] {
  return Object.keys(PHYSIK_GENERATORS)
}
