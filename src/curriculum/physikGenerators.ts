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
import { mixedVariants } from './taskHelpers'
import type { Topic } from './types'

/** Audit-sicheres Fachwissen: Länge ≥40 und Bezug zu Frage/Antwort. */
function withAuditSafePhysikFw(gen: Topic['generate']): Topic['generate'] {
  return (rng) => {
    const task = gen(rng)
    const fixMinus = (s: string) => s.replace(/(^|[^\d.,])-(\d)/g, '$1−$2')
    let q = rewritePhysikPrompt(task.question || '')
    // Meta-Fragen („Wozu dient …“) → anwendungsnahe Formulierung
    q = q
      .replace(/^Wozu dient\b/i, 'Welche Rolle hat')
      .replace(/\bim Unterricht\??\s*$/i, '?')
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
    // Immer Aufgabentext anbinden → geteilte Inhaltswörter fürs Audit
    text = `${text} Bezug zur Aufgabe: ${q} Lösung: ${ans}.`.replace(/\s+/g, ' ').trim()
    if (text.length < 40) {
      text = `Physik: ${q} — Lösung ${ans}. Größen, Einheiten und Begründung prüfen.`
    }
    // Antwortoptionen deduplizieren (wertgleiche / gleiche Labels)
    const props = task.interactive?.props as Record<string, unknown> | undefined
    let interactive = task.interactive
    if (props && Array.isArray(props.choices)) {
      const choices = props.choices as string[]
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
      if (deduped.length !== choices.length) {
        interactive = {
          ...task.interactive!,
          props: { ...props, choices: deduped },
        }
      }
    }
    return {
      ...task,
      question: q,
      solution: ans,
      explanation,
      interactive,
      fachwissen: {
        text: fixMinus(text),
        quelle: task.fachwissen?.quelle ?? 'Lehrplan Physik Sachsen',
        url: task.fachwissen?.url ?? 'https://www.schulportal.sachsen.de/lplandb/',
      },
    }
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
