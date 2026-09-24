import { textTask } from './taskHelpers'
import { allBiologieTopicIds } from './biologieGymTopics'
import { withBioContentIds } from './biologieBank'
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
import { bankGenerate, type BioBank } from './biologieBank'
import type { Topic } from './types'

function wrapAll(
  gens: Record<string, Topic['generate']>,
): Record<string, Topic['generate']> {
  const out: Record<string, Topic['generate']> = {}
  for (const [id, gen] of Object.entries(gens)) {
    out[id] = withBioContentIds(gen, `bio:${id}`)
  }
  return out
}

/** Alle spielbaren Biologie-Generatoren (K5–12, released:false → Entwickler). */
export const BIOLOGIE_GENERATORS: Record<string, Topic['generate']> = wrapAll({
  ...BIOLOGIE_K5_EXPANDED,
  ...BIOLOGIE_K6_EXPANDED,
  ...BIOLOGIE_K7_EXPANDED,
  ...BIOLOGIE_K8_EXPANDED,
  ...BIOLOGIE_K9_EXPANDED,
  ...BIOLOGIE_K10_EXPANDED,
  ...BIOLOGIE_OBERSTUFE_GENERATORS,
  // Dedicated Spezial banks win over any leftover overview aliases.
  ...BIOLOGIE_SPECIAL_GENERATORS,
})

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
      wissen: 'Eukaryoten organisieren Stoffwechselwege in Organellen.',
      gap: 'Mitochondrien und Chloroplasten sind Beispiele für ___.',
      gapAccepted: ['Organellen', 'Zellorganellen'],
    },
    {
      concept: 'bio:kOberstufe:organellen:mitochondrium',
      prompt: 'Wofür ist das Mitochondrium vor allem zuständig?',
      answer: 'ATP-Produktion (Zellatmung)',
      wrong: ['Nur Photosynthese', 'Nur DNA-Löschung', 'Nur Chitinbildung'],
      explanation: 'Mitochondrien liefern ATP durch oxidative Prozesse.',
      wissen: 'EnergieUmwandlung in der Zelle.',
    },
    {
      concept: 'bio:kOberstufe:organellen:kern',
      prompt: 'Welche Aufgabe hat der Zellkern?',
      answer: 'Speicherung und Organisation der Erbinformation (DNA)',
      wrong: ['Nur Fettverdauung im Darm', 'Nur Wasserfilterung der Niere', 'Nur Federwachstum'],
      explanation: 'Im Kern liegt die DNA; Transkription startet dort.',
      wissen: 'Zellkern als Steuerzentrale.',
    },
    {
      concept: 'bio:kOberstufe:organellen:membran',
      prompt: 'Warum sind Membranen für Organellen wichtig?',
      answer: 'Sie schaffen getrennte Reaktionsräume (Kompartimentierung)',
      wrong: ['Sie löschen Gene immer', 'Sie ersetzen die Wirbelsäule', 'Sie bilden nur Chitinpanzer'],
      explanation: 'Kompartimente erlauben parallele, kontrollierte Reaktionen.',
      wissen: 'Membranen = selektive Barrieren.',
    },
  ],
  pairs: [
    {
      concept: 'bio:kOberstufe:organellen:paar-mito',
      term: 'Mitochondrium',
      meaning: 'Ort der aeroben Energiegewinnung',
      wissen: 'ATP aus Dissimilation.',
    },
    {
      concept: 'bio:kOberstufe:organellen:paar-chloro',
      term: 'Chloroplast',
      meaning: 'Ort der Fotosynthese in Pflanzenzellen',
      wissen: 'Lichtenergie → chemische Energie.',
    },
    {
      concept: 'bio:kOberstufe:organellen:paar-er',
      term: 'Endoplasmatisches Retikulum',
      meaning: 'Membransystem für Synthese und Transport',
      wissen: 'Raues ER mit Ribosomen.',
    },
    {
      concept: 'bio:kOberstufe:organellen:paar-golgi',
      term: 'Golgi-Apparat',
      meaning: 'Modifikation und Versand von Vesikeln',
      wissen: 'Sortier- und Versandzentrale.',
    },
  ],
  trueFalse: [
    {
      concept: 'bio:kOberstufe:organellen:tf-prokaryot',
      statement: 'Typische prokaryotische Zellen besitzen einen echten Zellkern mit Kernmembran.',
      correct: false,
      explanation: 'Prokaryoten haben kein kernmembranumschlossenes Kompartiment.',
      wissen: 'Unterschied Eu-/Prokaryoten.',
    },
  ],
}

BIOLOGIE_GENERATORS['bi-gk11-lb1-organellen'] = withBioContentIds(
  bankGenerate(organellenBank),
  'bio:bi-gk11-lb1-organellen',
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

export function resolveBiologieGenerate(
  topicId: string,
  title?: string,
): Topic['generate'] | undefined {
  if (!topicId.startsWith('bi-')) return undefined
  const real = BIOLOGIE_GENERATORS[topicId]
  if (real) return real
  if (STUBS[topicId]) return STUBS[topicId]
  if (title) return stubGenerate(title)
  return undefined
}

export function isBiologieTopic(topicId: string): boolean {
  return topicId.startsWith('bi-')
}

export function isPlayableBiologieTopic(topicId: string): boolean {
  return Boolean(BIOLOGIE_GENERATORS[topicId])
}
