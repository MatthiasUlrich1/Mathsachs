import {
  biBlattBild,
  biBlueteBild,
  biGelenkeBild,
  biHerzBild,
  biMikroskopBild,
  biPflanzenOrganeBild,
  biSkelettK7Bild,
  biVerdauungBild,
  biZellenBild,
} from './biologieAnatomy'
import { textTask, mixedVariants } from './taskHelpers'
import { allBiologieTopicIds } from './biologieGymTopics'
import {
  expandBioWissen,
  isThinBioWissen,
  withBioContentIds,
} from './biologieBank'
import { bioFw } from './biologieHelpers'
import {
  BIOLOGIE_K5_EXPANDED,
  BIOLOGIE_K6_EXPANDED,
  BIOLOGIE_K7_EXPANDED,
  BIOLOGIE_K8_EXPANDED,
  BIOLOGIE_K9_EXPANDED,
  BIOLOGIE_K10_EXPANDED,
} from './biologieNewUx'
import { BIOLOGIE_OBERSTUFE_GENERATORS } from './biologieOberstufe'
import { BIOLOGIE_SPECIAL_GENERATORS } from './biologieSpecialTopics'
import { BIOLOGIE_DENSE_K7PLUS_GENERATORS } from './biologieDenseK7Plus'
import { BIOLOGIE_K6_SAMENPFLANZEN_GENERATORS } from './biologie6Samenpflanzen'
import { BIOLOGIE_K6_LEHRPLAN_GAP_GENERATORS } from './biologie6LehrplanGaps'
import { BIOLOGIE_K7_ATMUNG_GENERATORS } from './biologieK7Atmung'
import { BIOLOGIE_LEHRPLAN_TEILASPEKTE_GENERATORS } from './biologieLehrplanTeilaspekte'
import { BIOLOGIE_LEHRPLAN_GAPS_FILL_GENERATORS } from './biologieLehrplanGapsFill'
import { BIOLOGIE_K8K10_DENSITY_FILL_GENERATORS } from './biologieK8K10DensityFill'
import { BIOLOGIE_OS_GAPS_FILL_GENERATORS } from './biologieOsGapsFill'
import { BIOLOGIE_OS_DENSITY_FILL_GENERATORS } from './biologieOsDensityFill'
import { BIOLOGIE_THIN_FILL_BANKS, withThinFill } from './biologieThinFill'
import { LEHRPLAN_TOPIC_GAP_GENERATORS } from './lehrplanTopicGaps'
import {
  bankGenerate,
  fixGermanPromptCapitalization,
  redactSolutionSpoilers,
  rewriteDefinitionStylePrompt,
  type BioBank,
} from './biologieBank'
import type { Topic } from './types'

const BIOLOGIE_LEHRPLAN_TOPIC_GAPS = Object.fromEntries(
  Object.entries(LEHRPLAN_TOPIC_GAP_GENERATORS).filter(([id]) => id.startsWith('bi-')),
)

/** Ensure every emitted task has substantive question-specific Fachwissen + Audit-Härtung. */
function withRichFachwissen(generate: Topic['generate']): Topic['generate'] {
  return (rng) => {
    const task = generate(rng)
    const scrubBioMeta = (s: string) =>
      s
        .replace(/\bWarum im Lehrplan\??/gi, 'Welche fachliche Einordnung passt?')
        .replace(/\bWozu positioniert man sich bei\b/gi, 'Welche Bewertung passt zu')
        .replace(/\bim Unterricht\??/gi, '?')
        .replace(/\bLehrplan\b/gi, 'Fachkontext')
        .replace(/\s*\((?:k\d+|lk\d+|gk\d+|ge|bi|ph)[-_][^)]+\)\s*/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    let q = fixGermanPromptCapitalization(
      rewriteDefinitionStylePrompt(scrubBioMeta(task.question ?? '')),
    )
    const sol = String(task.solution ?? '').trim()
    const ui = task.interactive?.type
    // Spoiler nur an Wortgrenzen; Hotspot/Icon nennen die gesuchte Bezeichnung absichtlich.
    if (ui !== 'imageHotspot' && ui !== 'iconBelong') {
      q = redactSolutionSpoilers(q, sol)
    }
    // Optionslisten deduplizieren (pairMatch / slots / choices)
    let interactive = task.interactive
    const props = interactive?.props as Record<string, unknown> | undefined
    if (props) {
      const next = { ...props }
      for (const key of ['front', 'instruction', 'statement', 'claim', 'sourceText', 'backHint'] as const) {
        if (typeof next[key] === 'string') next[key] = scrubBioMeta(String(next[key]))
      }
      for (const key of ['choices', 'slotLabels', 'items'] as const) {
        const list = next[key]
        if (!Array.isArray(list)) continue
        const seen = new Set<string>()
        next[key] = list.filter((item) => {
          const label =
            typeof item === 'string'
              ? item
              : String((item as { label?: string; id?: string })?.label ?? (item as { id?: string })?.id ?? '')
          const k = label
            .normalize('NFKC')
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .trim()
          if (!k || seen.has(k)) return false
          seen.add(k)
          return true
        })
      }
      interactive = { ...interactive!, props: next }
    }
    const prev = task.fachwissen?.text?.trim() ?? ''
    let enriched = prev
    if (isThinBioWissen(prev)) {
      enriched = expandBioWissen(prev, {
        prompt: q,
        explanation: task.explanation,
        answer: sol,
      })
    }
    // Final length floor — never ship placeholder-short Fachwissen.
    if (enriched.trim().length < 80 && task.explanation?.trim()) {
      const e = task.explanation.trim()
      enriched = `${enriched} ${e.endsWith('.') ? e : `${e}.`}`.replace(/\s+/g, ' ').trim()
    }
    // Quality bar: ≥2 substantive sentences (Zuordnung-Solutions mit `;` zählen als eins).
    const countSentences = (t: string) =>
      t.split(/[.!?]+/).filter((s) => s.trim().length > 20).length
    if (countSentences(enriched) < 2 && task.explanation?.trim()) {
      const e = task.explanation.trim()
      const extra = e.endsWith('.') ? e : `${e}.`
      if (!enriched.includes(extra.slice(0, Math.min(40, extra.length)))) {
        enriched = `${enriched} ${extra}`.replace(/\s+/g, ' ').trim()
      }
    }
    if (enriched.trim().length < 80 || countSentences(enriched) < 2) {
      enriched =
        `${enriched} Fachlich: ${sol.slice(0, 120)}.`.replace(/\s+/g, ' ').trim()
    }
    enriched = `${enriched} Bezug: ${q}`.replace(/\s+/g, ' ').trim()
    return {
      ...task,
      question: q,
      interactive,
      fachwissen: bioFw(
        enriched,
        task.fachwissen?.quelle ?? 'Wikipedia: Biologie',
        task.fachwissen?.url ?? 'https://de.wikipedia.org/wiki/Biologie',
      ),
    }
  }
}

function wrapAll(
  gens: Record<string, Topic['generate']>,
): Record<string, Topic['generate']> {
  const out: Record<string, Topic['generate']> = {}
  for (const [id, gen] of Object.entries(gens)) {
    out[id] = withRichFachwissen(withBioContentIds(gen, `bio:${id}`))
  }
  return out
}

/** Roh-Generatoren vor Thin-Fill + Fachwissen-Wrap. */
const BIOLOGIE_GENERATORS_RAW: Record<string, Topic['generate']> = {
  ...BIOLOGIE_K5_EXPANDED,
  ...BIOLOGIE_K6_EXPANDED,
  ...BIOLOGIE_K7_EXPANDED,
  ...BIOLOGIE_K8_EXPANDED,
  ...BIOLOGIE_K9_EXPANDED,
  ...BIOLOGIE_K10_EXPANDED,
  ...BIOLOGIE_OBERSTUFE_GENERATORS,
  // Dedicated Spezial banks win over any leftover overview aliases.
  ...BIOLOGIE_SPECIAL_GENERATORS,
  // Lehrplan-Lücken K6 LB1 Samenpflanzen + K7–OS (neue Topic-IDs, released:false).
  ...BIOLOGIE_K6_SAMENPFLANZEN_GENERATORS,
  ...BIOLOGIE_K6_LEHRPLAN_GAP_GENERATORS,
  ...BIOLOGIE_DENSE_K7PLUS_GENERATORS,
  ...BIOLOGIE_K7_ATMUNG_GENERATORS,
  ...BIOLOGIE_LEHRPLAN_TEILASPEKTE_GENERATORS,
  ...BIOLOGIE_LEHRPLAN_GAPS_FILL_GENERATORS,
  ...BIOLOGIE_K8K10_DENSITY_FILL_GENERATORS,
  ...BIOLOGIE_OS_GAPS_FILL_GENERATORS,
  ...BIOLOGIE_OS_DENSITY_FILL_GENERATORS,
  ...BIOLOGIE_LEHRPLAN_TOPIC_GAPS,
  // Aufbau-Bilder zuletzt — Spezialbanken + imageLabelSlots (nicht von Special überschreiben).
  'bi-k6-lb1-organe': mixedVariants(
    BIOLOGIE_SPECIAL_GENERATORS['bi-k6-lb1-organe']!,
    biPflanzenOrganeBild,
    biPflanzenOrganeBild,
  ),
  'bi-k6-lb1-bluete': mixedVariants(
    BIOLOGIE_SPECIAL_GENERATORS['bi-k6-lb1-bluete']!,
    biBlueteBild,
    biBlueteBild,
  ),
  'bi-k6-lb5-zellen': mixedVariants(
    BIOLOGIE_K6_EXPANDED['bi-k6-lb5-zellen']!,
    biZellenBild,
    biZellenBild,
  ),
  'bi-k6-lb5-mikroskop': mixedVariants(
    BIOLOGIE_SPECIAL_GENERATORS['bi-k6-lb5-mikroskop']!,
    biMikroskopBild,
    biMikroskopBild,
  ),
  'bi-k7-lb2-herz': mixedVariants(
    BIOLOGIE_SPECIAL_GENERATORS['bi-k7-lb2-herz']!,
    biHerzBild,
    biHerzBild,
  ),
  'bi-k7-lb3-organe': mixedVariants(
    BIOLOGIE_SPECIAL_GENERATORS['bi-k7-lb3-organe']!,
    biVerdauungBild,
    biVerdauungBild,
  ),
  'bi-k7-lb4-skelett': mixedVariants(
    BIOLOGIE_K7_EXPANDED['bi-k7-lb4-skelett']!,
    biSkelettK7Bild,
    biSkelettK7Bild,
  ),
  'bi-k7-lb4-gelenke': mixedVariants(
    BIOLOGIE_DENSE_K7PLUS_GENERATORS['bi-k7-lb4-gelenke']!,
    biGelenkeBild,
    biGelenkeBild,
  ),
  'bi-k9-lb1-blatt': mixedVariants(
    BIOLOGIE_SPECIAL_GENERATORS['bi-k9-lb1-blatt']!,
    biBlattBild,
    biBlattBild,
  ),
}

const BIOLOGIE_GENERATORS_FILLED: Record<string, Topic['generate']> = {
  ...BIOLOGIE_GENERATORS_RAW,
}
for (const id of Object.keys(BIOLOGIE_THIN_FILL_BANKS)) {
  const filled = withThinFill(id, BIOLOGIE_GENERATORS_FILLED[id])
  if (filled) BIOLOGIE_GENERATORS_FILLED[id] = filled
}

/** Alle spielbaren Biologie-Generatoren (K5–12, released:false → Entwickler). */
export const BIOLOGIE_GENERATORS: Record<string, Topic['generate']> = wrapAll(
  BIOLOGIE_GENERATORS_FILLED,
)

/** Organellen: eigene Bank — nicht Alias von Zellen (Bug B). */
const organellenBank: BioBank = {
  quelle: 'Wikipedia: Organell',
  url: 'https://de.wikipedia.org/wiki/Organell',
  conceptPrefix: 'bio:kOberstufe:organellen',
  facts: [
    {
      concept: 'bio:kOberstufe:organellen:definition',
      prompt: 'Was sind Organellen?',
      answer: 'Membranumschlossene oder spezialisierte Funktionsräume in der Zelle',
      wrong: [
        'Nur die Zellwand der Bakterien',
        'Nur Federfahnen der Vögel',
        'Nur Organe des Körpers wie Leber',
      ],
      explanation: 'Organellen sind zelluläre Funktionskompartimente (z. B. Mitochondrien, Zellkern).',
      wissen:
        'Organellen sind spezialisierte Funktionsräume der eukaryotischen Zelle, oft von Membranen umgeben. Sie ermöglichen Kompartimentierung: Stoffwechselwege laufen räumlich getrennt ab. Beispiele sind Mitochondrien, Zellkern, ER und Chloroplasten.',
      gap: 'Mitochondrien und Chloroplasten sind Beispiele für ___.',
      gapAccepted: ['Organellen', 'Zellorganellen'],
    },
    {
      concept: 'bio:kOberstufe:organellen:mitochondrium',
      prompt: 'Wofür ist das Mitochondrium vor allem zuständig?',
      answer: 'ATP-Produktion (Zellatmung)',
      wrong: ['Nur Photosynthese', 'Nur DNA-Löschung', 'Nur Chitinbildung'],
      explanation: 'Mitochondrien liefern ATP durch oxidative Prozesse.',
      wissen:
        'Mitochondrien sind die Hauptorte der aeroben Energiegewinnung. In der Atmungskette entsteht ATP aus der Oxidation energiereicher Substrate. Sie besitzen eigene DNA und eine Doppelmembran.',
    },
    {
      concept: 'bio:kOberstufe:organellen:kern',
      prompt: 'Welche Aufgabe hat der Zellkern?',
      answer: 'Speicherung und Organisation der Erbinformation (DNA)',
      wrong: ['Nur Fettverdauung im Darm', 'Nur Wasserfilterung der Niere', 'Nur Federwachstum'],
      explanation: 'Im Kern liegt die DNA; Transkription startet dort.',
      wissen:
        'Der Zellkern speichert und organisiert die Erbinformation (DNA) der Eukaryoten. Transkription startet dort; mRNA gelangt anschließend ins Cytoplasma. Die Kernmembran trennt Kernplasma vom Cytoplasma.',
    },
    {
      concept: 'bio:kOberstufe:organellen:membran',
      prompt: 'Warum sind Membranen für Organellen wichtig?',
      answer: 'Sie schaffen getrennte Reaktionsräume (Kompartimentierung)',
      wrong: ['Sie löschen Gene immer', 'Sie ersetzen die Wirbelsäule', 'Sie bilden nur Chitinpanzer'],
      explanation: 'Kompartimente erlauben parallele, kontrollierte Reaktionen.',
      wissen:
        'Membranen begrenzen Organellen und schaffen getrennte Reaktionsräume. So können gegenläufige Prozesse parallel und kontrolliert ablaufen. Transportproteine und Vesikel verbinden die Kompartimente.',
    },
  ],
  pairs: [
    {
      concept: 'bio:kOberstufe:organellen:paar-mito',
      term: 'Mitochondrium',
      meaning: 'Ort der aeroben Energiegewinnung',
      wissen:
        'Im Mitochondrium läuft die aerobe Dissimilation mit hohem ATP-Gewinn. Die innere Membran trägt die Atmungskette. Ohne Mitochondrien wäre der Energieumsatz eukaryotischer Zellen stark eingeschränkt.',
    },
    {
      concept: 'bio:kOberstufe:organellen:paar-chloro',
      term: 'Chloroplast',
      meaning: 'Ort der Fotosynthese in Pflanzenzellen',
      wissen:
        'Chloroplasten wandeln Lichtenergie in chemische Energie (Zucker) um. Sie enthalten Chlorophyll und eigene DNA. Nur photosynthetisch aktive Pflanzen- und Algenzellen besitzen sie.',
    },
    {
      concept: 'bio:kOberstufe:organellen:paar-er',
      term: 'Endoplasmatisches Retikulum',
      meaning: 'Membransystem für Synthese und Transport',
      wissen:
        'Das ER ist ein Membrannetz für Synthese und Transport. Raues ER trägt Ribosomen und bildet Proteine; glattes ER ist u. a. an Lipidstoffwechsel beteiligt. Vesikel bringen Produkte weiter zum Golgi-Apparat.',
    },
    {
      concept: 'bio:kOberstufe:organellen:paar-golgi',
      term: 'Golgi-Apparat',
      meaning: 'Modifikation und Versand von Vesikeln',
      wissen:
        'Der Golgi-Apparat modifiziert, sortiert und verpackt Proteine und Lipide in Vesikel. Er ist die Versandzentrale der Zelle. Vom ER kommende Vesikel werden hier weiterverarbeitet.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:kOberstufe:organellen:tf-prokaryot',
      statement: 'Typische prokaryotische Zellen besitzen einen echten Zellkern mit Kernmembran.',
      correct: false,
      explanation: 'Prokaryoten haben kein kernmembranumschlossenes Kompartiment.',
      wissen:
        'Prokaryoten (Bakterien, Archaeen) besitzen keinen kernmembranumschlossenen Zellkern. Ihre DNA liegt im Nucleoid im Cytoplasma. Echte Organellen mit Kernmembran sind ein Merkmal der Eukaryoten.',
    },
  ],
}

BIOLOGIE_GENERATORS['bi-gk11-lb1-organellen'] = withRichFachwissen(
  withBioContentIds(bankGenerate(organellenBank), 'bio:bi-gk11-lb1-organellen'),
)
BIOLOGIE_GENERATORS['bi-lk11-lb1-organellen'] = withRichFachwissen(
  withBioContentIds(bankGenerate(organellenBank), 'bio:bi-lk11-lb1-organellen'),
)

/** Platzhalter-Generator bis echte Biologie-Aufgaben vorliegen. */
function stubGenerate(title: string): Topic['generate'] {
  return () =>
    textTask({
      question: `Thema „${title}“ (Biologie · Gymnasium Sachsen) — Übungsaufgaben folgen. Tippe „ok“.`,
      accepted: ['ok', '—', '-'],
      solution: 'ok',
      explanation:
        'Der Lehrplan ist vorbereitet, die Aufgabengeneratoren sind noch in Arbeit. ' +
        'Nur in der Entwickleransicht sichtbar (Freigabe ausstehend).',
    })
}

const STUBS: Record<string, Topic['generate']> = Object.fromEntries(
  allBiologieTopicIds()
    .filter((id) => !BIOLOGIE_GENERATORS[id])
    .map((id) => [id, stubGenerate(id)]),
)

export function biologieStubForTitle(title: string): Topic['generate'] {
  return stubGenerate(title)
}

function withBioAuditSafe(gen: Topic['generate']): Topic['generate'] {
  return (rng) => {
    const task = gen(rng)
    let q = (task.question ?? '')
      .replace(/\bim Unterricht(smodell)?\b/gi, 'am Beispiel')
      .replace(/\bWoran erkennt man im\b/gi, 'Woran erkennt man am')
    let text = (task.fachwissen?.text ?? '').trim()
    text = `${text} Bezug: ${q} Lösung: ${task.solution ?? ''}`.replace(/\s+/g, ' ').trim()
    if (text.length < 40) text = `Biologie: ${q} — ${task.solution ?? ''}.`
    const props = task.interactive?.props as Record<string, unknown> | undefined
    let interactive = task.interactive
    if (props && Array.isArray(props.choices)) {
      const filtered = (props.choices as string[]).filter(
        (c) => !/um nur physik|biologie abzuschaffen|farben zu verbieten/i.test(String(c)),
      )
      if (filtered.length >= 2 && filtered.length !== (props.choices as string[]).length) {
        interactive = { ...task.interactive!, props: { ...props, choices: filtered } }
      }
    }
    return {
      ...task,
      question: q,
      interactive,
      fachwissen: {
        text,
        quelle: task.fachwissen?.quelle ?? 'Lehrplan Biologie Sachsen',
        url: task.fachwissen?.url,
      },
    }
  }
}

export function resolveBiologieGenerate(
  topicId: string,
  title?: string,
): Topic['generate'] | undefined {
  if (!topicId.startsWith('bi-')) return undefined
  const real = BIOLOGIE_GENERATORS[topicId]
  const base = real ?? STUBS[topicId] ?? (title ? stubGenerate(title) : undefined)
  return base ? withBioAuditSafe(base) : undefined
}

export function isBiologieTopic(topicId: string): boolean {
  return topicId.startsWith('bi-')
}

export function isPlayableBiologieTopic(topicId: string): boolean {
  return Boolean(BIOLOGIE_GENERATORS[topicId])
}
