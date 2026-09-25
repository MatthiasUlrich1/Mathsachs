/**
 * Dense K5 fish banks: Raub-/Friedfische + Fortpflanzung.
 * Wired into Lebensraum / Fortpflanzung+Schutz (LB2); also Lurch-Meta & Vogel-Fortpflanzung.
 * Original German; concept ids scoped per topic (no sibling collisions).
 */
import type { Rng } from '../lib/rng'
import {
  bioFw,
  clozeBlanksTask,
  matchTermsTask,
  pick,
  shuffle,
  shuffleChoices,
  sortChronologyTask,
  trueFalse,
} from './biologieHelpers'
import {
  choicePickTask,
  dragDropSortTask,
  mixedVariants,
  multiSelectTask,
} from './taskHelpers'
import type { Task, Topic } from './types'

const Q = {
  quelle: 'Wikipedia: Fisch',
  url: 'https://de.wikipedia.org/wiki/Fisch',
} as const

const fw = (text: string) => bioFw(text, Q.quelle, Q.url)

const withIds = (task: Task, concept: string, extra: string[] = []): Task => ({
  ...task,
  dedupeKey: concept,
  contentIds: [concept, ...extra],
})

// ─── Raubfische / Friedfische (→ Lebensraum & Vielfalt) ─────────────────────

const RAUB: Array<{ name: string; note: string }> = [
  { name: 'Hecht', note: 'Lauert und jagt andere Fische' },
  { name: 'Flussbarsch', note: 'Raubfisch mit Stachelstrahlen in der Rückenflosse' },
  { name: 'Zander', note: 'Jagt oft dämmerungsaktiv kleinere Fische' },
  { name: 'Wels', note: 'Großer Raubfisch am Gewässergrund' },
  { name: 'Forelle', note: 'Jagt Insekten und Kleinfische im fließenden Wasser' },
]

const FRIED: Array<{ name: string; note: string }> = [
  { name: 'Karpfen', note: 'Gründelt nach Pflanzen und Kleintieren' },
  { name: 'Rotauge', note: 'Frisst Plankton, Pflanzenreste und Kleintiere' },
  { name: 'Brachse', note: 'Friedfisch mit hochrückigem Körper' },
  { name: 'Schleie', note: 'Lebt bodennah, sucht Nahrung im Schlamm' },
  { name: 'Hasel', note: 'Friedfisch in fließenden Gewässern' },
]

const DIFF_PAIRS: Array<{
  concept: string
  term: string
  meaning: string
  wissen: string
}> = [
  {
    concept: 'bio:k5:fisch:lr:diff-ernaehrung-raub',
    term: 'Ernährung Raubfisch',
    meaning: 'Jagt vorwiegend Tiere (oft andere Fische)',
    wissen:
      'Raubfische sind Fleischfresser im Gewässer: sie jagen Fische oder größere Wassertiere und brauchen oft klare Sicht oder gute Sinnesorgane.',
  },
  {
    concept: 'bio:k5:fisch:lr:diff-ernaehrung-fried',
    term: 'Ernährung Friedfisch',
    meaning: 'Frisst Pflanzen, Plankton oder Kleintiere',
    wissen:
      'Friedfische ernähren sich von Pflanzen, Plankton, Detritus oder Kleintieren — sie stehen oft in der Nahrungskette unter den Raubfischen.',
  },
  {
    concept: 'bio:k5:fisch:lr:diff-maul-raub',
    term: 'Maul vieler Raubfische',
    meaning: 'Oft weit und mit Zähnen / Greifmaul',
    wissen:
      'Viele Raubfische haben ein weites Maul und Zähne zum Festhalten der Beute — Angepasstheit an die Jagd.',
  },
  {
    concept: 'bio:k5:fisch:lr:diff-maul-fried',
    term: 'Maul vieler Friedfische',
    meaning: 'Oft zum Gründeln oder Abweiden geeignet',
    wissen:
      'Viele Friedfische haben ein Maul, mit dem sie am Grund gründeln oder Pflanzen abraspeln können.',
  },
  {
    concept: 'bio:k5:fisch:lr:diff-koerper-raub',
    term: 'Körperform oft bei Raubfischen',
    meaning: 'Schlank, wendig — für schnelle Angriffe',
    wissen:
      'Schlanke, stromlinienförmige Räuber können schnell beschleunigen und Beute verfolgen.',
  },
  {
    concept: 'bio:k5:fisch:lr:diff-koerper-fried',
    term: 'Körperform oft bei Friedfischen',
    meaning: 'Häufig hochrückig oder zum Gründeln gebaut',
    wissen:
      'Hochrückige oder bodennahe Körperformen passen zu Weiden und Gründeln in Pflanzenzonen oder am Grund.',
  },
  {
    concept: 'bio:k5:fisch:lr:diff-kette',
    term: 'Stellung in der Nahrungskette',
    meaning: 'Friedfisch oft Beute — Raubfisch oft Endglied',
    wissen:
      'In einfachen Ketten fressen Friedfische Pflanzen oder Kleintiere; Raubfische fressen Friedfische. So fließt Energie durchs Gewässer.',
  },
  {
    concept: 'bio:k5:fisch:lr:diff-verhalten',
    term: 'Verhalten',
    meaning: 'Raubfisch: Jagd / Lauern — Friedfisch: Suchen / Gründeln',
    wissen:
      'Verhaltensweisen spiegeln die Ernährung: lauern und zustoßen versus absuchen und gründeln.',
  },
]

export function fischeRaubFriedClassify(rng: Rng): Task {
  const raub = shuffle(rng, RAUB).slice(0, 2)
  const fried = shuffle(rng, FRIED).slice(0, 2)
  const itemLabels = [raub[0]!.name, raub[1]!.name, fried[0]!.name, fried[1]!.name]
  const raubSet = new Set(raub.map((r) => r.name))
  const friedSet = new Set(fried.map((f) => f.name))
  const distractor = 'Stockente'
  const items = [
    ...itemLabels.map((label, value) => ({ label, value })),
    { label: distractor, value: itemLabels.length },
  ]
  // Shuffle presentation so pool order does not spoil groups.
  const order = shuffle(
    rng,
    items.map((_, i) => i),
  )
  const presentedItems = order.map((i) => items[i]!)
  const labelOf = (idx: number) => presentedItems[idx]?.label ?? ''
  const slotLabels = ['Raubfisch', 'Raubfisch', 'Friedfisch', 'Friedfisch']
  const findIdx = (name: string) =>
    presentedItems.findIndex((it) => it.label === name)
  const sampleSlots = [
    findIdx(raub[0]!.name),
    findIdx(raub[1]!.name),
    findIdx(fried[0]!.name),
    findIdx(fried[1]!.name),
  ]
  const gradeSlots = (slots: Array<number | null>) => {
    if (slots.length !== 4) return { fraction: 0, parts: [false, false, false, false] }
    const parts = slots.map((idx, slotI) => {
      if (idx === null || !Number.isInteger(idx)) return false
      const name = labelOf(idx)
      if (slotI < 2) return raubSet.has(name)
      return friedSet.has(name)
    })
    // Each target fish used at most once
    const used = slots.filter((s): s is number => s !== null)
    if (new Set(used).size !== used.length) {
      return { fraction: 0, parts: parts.map(() => false) }
    }
    const ok = parts.filter(Boolean).length
    return { fraction: ok / 4, parts }
  }
  const concept = `bio:k5:fisch:lr:zuordnung:${itemLabels.map((n) => n.toLowerCase()).sort().join('+')}`
  return {
    question: 'Ordne die Fische den Gruppen Raubfisch und Friedfisch zu.',
    answerKind: 'text',
    solution: `Raub: ${raub.map((r) => r.name).join(', ')}; Fried: ${fried.map((f) => f.name).join(', ')}`,
    explanation: `${raub.map((r) => `${r.name}: ${r.note}`).join(' ')} ${fried.map((f) => `${f.name}: ${f.note}`).join(' ')}`,
    fachwissen: fw(
      'Im Gewässer unterscheidet man oft Raub- und Friedfische nach der Ernährung: Räuber jagen Tiere, Friedfische fressen Pflanzen, Plankton oder Kleintiere. Körperform und Maul passen zur Nahrung.',
    ),
    sampleAnswer: { kind: 'dragDropSlots', slots: sampleSlots },
    interactive: {
      type: 'dragDropSlots',
      props: {
        items: presentedItems,
        slotCount: 4,
        slotLabels,
        instruction:
          'Ziehe jeden Fisch in das passende Gruppenfeld (einen Block brauchst du nicht).',
      },
    },
    check: (answer) => {
      if (answer.kind !== 'dragDropSlots') return false
      return gradeSlots(answer.slots).fraction >= 1
    },
    grade: (answer) => {
      if (answer.kind !== 'dragDropSlots') {
        return { fraction: 0, parts: [false, false, false, false] }
      }
      return gradeSlots(answer.slots)
    },
    dedupeKey: concept,
    contentIds: [concept, ...itemLabels.map((n) => `bio:k5:fisch:lr:art:${n.toLowerCase()}`)],
  }
}

export function fischeRaubFriedMulti(rng: Rng): Task {
  const raub = shuffle(rng, RAUB).slice(0, 2).map((r) => r.name)
  const fried = shuffle(rng, FRIED).slice(0, 2).map((f) => f.name)
  const concept = `bio:k5:fisch:lr:multi-raub:${[...raub].sort().join('+')}`
  return multiSelectTask({
    question: 'Welche der genannten Fische sind typische Raubfische?',
    choices: shuffle(rng, [...raub, ...fried]),
    correct: raub,
    solution: raub.join('; '),
    explanation: `${raub.join(' und ')} jagen typischerweise Tiere; ${fried.join(' und ')} gelten als Friedfische.`,
    fachwissen: fw(
      'Raubfische jagen vorwiegend Tiere (oft andere Fische). Friedfische ernähren sich von Pflanzen, Plankton oder Kleintieren.',
    ),
    dedupeKey: concept,
    contentIds: [concept],
  })
}

export function fischeRaubFriedDiffMatch(rng: Rng): Task {
  const size = rng() < 0.45 ? 4 : 5
  const subset = shuffle(rng, DIFF_PAIRS).slice(0, size)
  return matchTermsTask(rng, {
    question: `Ordne ${size} Unterschiede zwischen Raub- und Friedfischen zu.`,
    terms: subset.map((p) => p.term),
    meanings: subset.map((p) => p.meaning),
    distractor: 'Atmung nur über Lungen wie bei Säugern',
    solution: subset.map((p) => `${p.term}→${p.meaning}`).join('; '),
    explanation: subset.map((p) => p.wissen).join(' '),
    fachwissen: fw(
      'Raub- und Friedfische unterscheiden sich in Ernährung, oft auch in Maulform, Körperform und Verhalten — Angepasstheit an die ökologische Nische im Gewässer.',
    ),
    dedupeKey: `bio:k5:fisch:lr:diff:${subset.map((p) => p.concept).sort().join('+')}`,
    contentIds: subset.map((p) => p.concept),
  })
}

export function fischeRaubFriedMc(rng: Rng): Task {
  const pool: Array<{
    concept: string
    q: string
    good: string
    bad: string[]
    wissen: string
  }> = [
    {
      concept: 'bio:k5:fisch:lr:mc-hecht',
      q: 'Welcher Fisch ist typischerweise ein Raubfisch?',
      good: 'Hecht',
      bad: ['Karpfen', 'Rotauge', 'Schleie'],
      wissen:
        'Der Hecht jagt andere Fische — er ist ein klassischer Raubfisch in sächsischen Gewässern. Karpfen und Rotauge gelten typischerweise als Friedfische.',
    },
    {
      concept: 'bio:k5:fisch:lr:mc-karpfen',
      q: 'Welcher Fisch ist typischerweise ein Friedfisch?',
      good: 'Karpfen',
      bad: ['Hecht', 'Zander', 'Wels'],
      wissen:
        'Karpfen gründeln nach Pflanzen und Kleintieren. Hecht, Zander und Wels jagen überwiegend tierische Beute.',
    },
    {
      concept: 'bio:k5:fisch:lr:mc-ernaehrung',
      q: 'Woran erkennt man im Unterrichtsmodell oft den Unterschied Raub-/Friedfisch?',
      good: 'Vor allem an der typischen Ernährung (Jagd vs. Pflanzen/Kleintiere)',
      bad: [
        'Nur daran, ob der Fisch schwarz oder weiß ist',
        'Nur an der Anzahl der Augen',
        'Nur daran, ob er Federn hat',
      ],
      wissen:
        'Die Zuordnung folgt der Ernährung und den dazu passenden Bau- und Verhaltensmerkmalen — nicht der Farbe allein.',
    },
    {
      concept: 'bio:k5:fisch:lr:mc-kette',
      q: 'Welche Reihenfolge beschreibt eine einfache Nahrungskette im See?',
      good: 'Wasserpflanze → Friedfisch → Raubfisch',
      bad: [
        'Raubfisch → Friedfisch → Wasserpflanze',
        'Stein → Raubfisch → Alge',
        'Friedfisch → Wasserpflanze → Raubfisch',
      ],
      wissen:
        'Produzenten (z. B. Wasserpflanzen) bilden Biomasse; Friedfische fressen davon; Raubfische fressen Friedfische.',
    },
    {
      concept: 'bio:k5:fisch:lr:mc-angepasst',
      q: 'Welche Aussage zur Angepasstheit stimmt?',
      good: 'Maul und Körperform passen oft zur typischen Nahrung',
      bad: [
        'Alle Fische haben dasselbe Maul unabhängig von der Nahrung',
        'Nur die Farbe bestimmt die Ernährung',
        'Raubfische atmen nie über Kiemen',
      ],
      wissen:
        'Angepasstheit zeigt sich in Bau und Verhalten: Greifmaul und Wendigkeit bei Räubern, Gründelmaul und andere Formen bei vielen Friedfischen.',
    },
  ]
  const tip = pick(rng, pool)
  return choicePickTask({
    question: tip.q,
    choices: shuffleChoices(rng, [tip.good, ...tip.bad], tip.good),
    correct: tip.good,
    solution: tip.good,
    explanation: tip.wissen,
    fachwissen: fw(tip.wissen),
    dedupeKey: tip.concept,
    contentIds: [tip.concept],
  })
}

export function fischeRaubFriedTf(rng: Rng): Task {
  const bank = [
    {
      concept: 'bio:k5:fisch:lr:tf-hecht-raub',
      statement: 'Der Hecht ist ein typischer Raubfisch.',
      correct: true,
      explanation: 'Hechte jagen andere Fische.',
      wissen:
        'Raubfische wie der Hecht ernähren sich von Tieren — oft von anderen Fischen. Das unterscheidet sie von vielen Friedfischen.',
    },
    {
      concept: 'bio:k5:fisch:lr:tf-karpfen-fried',
      statement: 'Der Karpfen gilt typischerweise als Friedfisch.',
      correct: true,
      explanation: 'Karpfen gründeln nach Pflanzen und Kleintieren.',
      wissen:
        'Friedfische fressen vorwiegend Pflanzen, Plankton oder Kleintiere. Der Karpfen ist ein bekanntes Beispiel.',
    },
    {
      concept: 'bio:k5:fisch:lr:tf-alle-raub',
      statement: 'Alle Fische in einem See sind Raubfische.',
      correct: false,
      explanation: 'Es gibt Raub- und Friedfische (und weitere Ernährungsweisen).',
      wissen:
        'In Gewässern leben Fische mit unterschiedlicher Ernährung. Die Einteilung Raub-/Friedfisch hilft, Nahrungsbeziehungen zu verstehen.',
    },
    {
      concept: 'bio:k5:fisch:lr:tf-pflanzen-raub',
      statement: 'Raubfische ernähren sich vorwiegend von Wasserpflanzen.',
      correct: false,
      explanation: 'Raubfische jagen Tiere; Pflanzenfresser sind eher Friedfische.',
      wissen:
        'Pflanzenkost ist typisch für viele Friedfische. Raubfische nehmen vorwiegend tierische Nahrung auf.',
    },
  ]
  const c = pick(rng, bank)
  return trueFalse(rng, {
    statement: c.statement,
    correct: c.correct,
    explanation: c.explanation,
    fachwissen: fw(c.wissen),
    dedupeKey: c.concept,
    contentIds: [c.concept],
  })
}

// ─── Fortpflanzung Fische (→ Fortpflanzung und Schutz) ──────────────────────

const FORT_PAIRS: Array<{
  concept: string
  term: string
  meaning: string
  wissen: string
}> = [
  {
    concept: 'bio:k5:fisch:fp:paar-laichen',
    term: 'Laichen',
    meaning: 'Ablegen der Eier (und oft der Samenflüssigkeit) ins Wasser',
    wissen:
      'Beim Laichen geben viele Fische Eier und Samenflüssigkeit ins Wasser ab. Die Fortpflanzung ist eng an den Lebensraum Wasser gebunden.',
  },
  {
    concept: 'bio:k5:fisch:fp:paar-aeusser',
    term: 'Äußere Befruchtung',
    meaning: 'Befruchtung der Eier außerhalb des Körpers',
    wissen:
      'Bei den meisten Knochenfischen findet die Befruchtung außen im Wasser statt: Eier und Spermien treffen sich außerhalb der Elterntiere.',
  },
  {
    concept: 'bio:k5:fisch:fp:paar-rogen',
    term: 'Rogen',
    meaning: 'Eier der Weibchen (Laich)',
    wissen:
      'Die Eier der Weibchen nennt man oft Rogen. Viele Arten legen große Mengen ab — nur ein Teil der Jungtiere überlebt.',
  },
  {
    concept: 'bio:k5:fisch:fp:paar-milch',
    term: 'Milch (Samenflüssigkeit)',
    meaning: 'Samenflüssigkeit der Männchen zur Befruchtung',
    wissen:
      'Männchen geben die Samenflüssigkeit („Milch“) ab. Sie befruchtet die Eier im Wasser.',
  },
  {
    concept: 'bio:k5:fisch:fp:paar-laichplatz',
    term: 'Laichplatz',
    meaning: 'Geeigneter Ort zum Ablegen der Eier',
    wissen:
      'Laichplätze brauchen passende Tiefe, Temperatur, Strömung und oft Pflanzen oder Kies. Ihr Schutz ist Artenschutz.',
  },
  {
    concept: 'bio:k5:fisch:fp:paar-brut',
    term: 'Brutfürsorge (selten)',
    meaning: 'Eltern schützen Gelege oder Jungtiere (z. B. Stichling)',
    wissen:
      'Die meisten Fische betreiben wenig Brutfürsorge. Manche Arten wie der Stichling bauen Nester und bewachen den Laich.',
  },
  {
    concept: 'bio:k5:fisch:fp:paar-menge',
    term: 'Viele Eier',
    meaning: 'Hohe Eizahl gleicht Verluste im Wasser aus',
    wissen:
      'Weil viele Eier und Larven gefressen werden oder ungünstige Bedingungen treffen, legen viele Arten sehr viele Eier.',
  },
  {
    concept: 'bio:k5:fisch:fp:paar-zeit',
    term: 'Laichzeit',
    meaning: 'Jahreszeit mit geeigneten Bedingungen zum Laichen',
    wissen:
      'Viele heimische Fische laichen im Frühjahr, wenn Temperatur und Nahrungsangebot für die Jungfische günstig sind.',
  },
]

export function fischeFortpflanzungMatch(rng: Rng): Task {
  const size = rng() < 0.4 ? 4 : 5
  const subset = shuffle(rng, FORT_PAIRS).slice(0, size)
  return matchTermsTask(rng, {
    question: `Ordne ${size} Begriffe zur Fortpflanzung der Fische zu.`,
    terms: subset.map((p) => p.term),
    meanings: subset.map((p) => p.meaning),
    distractor: 'Innere Befruchtung wie bei den meisten Säugetieren',
    solution: subset.map((p) => `${p.term}→${p.meaning}`).join('; '),
    explanation: subset.map((p) => p.wissen).join(' '),
    fachwissen: fw(
      'Fortpflanzung vieler Knochenfische: äußere Befruchtung im Wasser, Laichen, Rogen und Milch, oft hohe Eizahl und wenig Brutfürsorge; Laichplätze sind entscheidend.',
    ),
    dedupeKey: `bio:k5:fisch:fp:match:${subset.map((p) => p.concept).sort().join('+')}`,
    contentIds: subset.map((p) => p.concept),
  })
}

export function fischeFortpflanzungSort(rng: Rng): Task {
  const variants = [
    {
      concept: 'bio:k5:fisch:fp:sort-ablauf',
      steps: [
        'Laichzeit / Partner finden',
        'Eier und Samenflüssigkeit ins Wasser',
        'Äußere Befruchtung',
        'Entwicklung zum Jungfisch',
      ],
      wissen:
        'Typischer Ablauf: Zur Laichzeit treffen sich die Elterntiere; Eier und Samenflüssigkeit gelangen ins Wasser; die Befruchtung erfolgt außen; aus den Eiern entwickeln sich Jungfische.',
    },
    {
      concept: 'bio:k5:fisch:fp:sort-schutz',
      steps: [
        'Laichplatz wählen',
        'Eier ablegen',
        'Befruchtung im Wasser',
        'Jungfische schlüpfen',
      ],
      wissen:
        'Ohne geeigneten Laichplatz scheitert oft schon der Start. Danach folgen Ablegen, Befruchtung und Schlupf der Jungfische.',
    },
  ]
  const v = pick(rng, variants)
  return withIds(
    dragDropSortTask({
      question: 'Ordne die Schritte der Fisch-Fortpflanzung von früh nach spät.',
      items: v.steps.map((label, value) => ({ label, value })),
      correctOrder: v.steps.map((_, i) => i),
      solution: v.steps.join(' → '),
      explanation: v.wissen,
      rng,
      fachwissen: fw(v.wissen),
    }),
    v.concept,
  )
}

export function fischeFortpflanzungCloze(rng: Rng): Task {
  const variants = [
    {
      concept: 'bio:k5:fisch:fp:cloze-befruchtung',
      template:
        'Bei den meisten Knochenfischen erfolgt die Befruchtung ___ im Wasser; die Weibchen legen ___ ab.',
      accepted: [
        ['äußere', 'ausser', 'außerhalb', 'aussen', 'ausserhalb'],
        ['Eier', 'Rogen', 'Laich'],
      ],
      solution: 'äußere; Eier',
      wissen:
        'Äußere Befruchtung bedeutet: Eier und Spermien treffen sich außerhalb des Körpers. Weibchen legen Eier (Rogen/Laich) ab.',
    },
    {
      concept: 'bio:k5:fisch:fp:cloze-eltern',
      template:
        'Die ___ legen Eier (Rogen) ab, die ___ geben Samenflüssigkeit (Milch) dazu.',
      accepted: [['Weibchen', 'Weibchenfische'], ['Männchen', 'Männchenfische']],
      solution: 'Weibchen; Männchen',
      wissen:
        'Weibchen produzieren die Eier, Männchen die Samenflüssigkeit. Zusammen ermöglichen sie die Befruchtung im Wasser.',
    },
    {
      concept: 'bio:k5:fisch:fp:cloze-laichplatz',
      template:
        'Geschützte ___ und gute Wasserqualität sind wichtig für erfolgreiches ___.',
      accepted: [
        ['Laichplätze', 'Laichplaetze', 'Laichgebiete'],
        ['Laichen', 'Fortpflanzen'],
      ],
      solution: 'Laichplätze; Laichen',
      wissen:
        'Laichplätze und sauberes Wasser sichern die Fortpflanzung. Zerstörte Ufer oder Schadstoffe gefährden den Nachwuchs.',
    },
  ]
  const v = pick(rng, variants)
  return clozeBlanksTask({
    question: 'Ergänze den Lückentext zur Fortpflanzung der Fische.',
    template: v.template,
    accepted: v.accepted,
    solution: v.solution,
    explanation: v.wissen,
    fachwissen: fw(v.wissen),
    dedupeKey: v.concept,
    contentIds: [v.concept],
  })
}

export function fischeFortpflanzungMc(rng: Rng): Task {
  const pool = [
    {
      concept: 'bio:k5:fisch:fp:mc-aeusser',
      q: 'Wie erfolgt die Befruchtung bei den meisten Knochenfischen?',
      good: 'Äußerlich im Wasser (Eier und Samenflüssigkeit)',
      bad: [
        'Nur im Körper der Weibchen wie bei den meisten Säugetieren',
        'Durch Sporen wie bei Farnen',
        'Durch Bestäubung mit Pollen',
      ],
      wissen:
        'Die äußere Befruchtung im Wasser ist typisch für viele Fische. Innere Befruchtung ist dagegen bei Säugetieren und vielen Kriechtieren/Vögeln üblich.',
    },
    {
      concept: 'bio:k5:fisch:fp:mc-laichen',
      q: 'Was bedeutet Laichen bei Fischen?',
      good: 'Ablegen von Eiern (und oft Samenflüssigkeit) ins Wasser',
      bad: [
        'Nur das Atmen an der Wasseroberfläche',
        'Nur der Vogelzug im Herbst',
        'Nur das Häuten wie bei Insekten',
      ],
      wissen:
        'Laichen ist der Fortpflanzungsvorgang im Wasser: Eier und Samenflüssigkeit werden abgegeben, danach folgt die äußere Befruchtung.',
    },
    {
      concept: 'bio:k5:fisch:fp:mc-eltern',
      q: 'Welche Rollen haben Männchen und Weibchen typischerweise beim Laichen?',
      good: 'Weibchen: Eier (Rogen); Männchen: Samenflüssigkeit (Milch)',
      bad: [
        'Beide legen nur Federn ab',
        'Nur Männchen legen Eier, Weibchen nicht',
        'Beide betreiben immer intensive Brutpflege im Nest auf dem Baum',
      ],
      wissen:
        'Rogen stammt von den Weibchen, Milch (Samenflüssigkeit) von den Männchen. Intensive Nestbrutpflege ist bei Fischen die Ausnahme.',
    },
    {
      concept: 'bio:k5:fisch:fp:mc-eizahl',
      q: 'Warum legen viele Fischarten sehr viele Eier?',
      good: 'Weil viele Eier und Jungtiere verloren gehen',
      bad: [
        'Weil Fische keine Kiemen haben',
        'Weil Eier an Land trocknen müssen',
        'Weil jedes Ei sofort ein Säugetier wird',
      ],
      wissen:
        'Hohe Eizahlen gleichen Verluste durch Fraß, Strömung und ungünstige Bedingungen aus. Nur ein Teil der Nachkommen erreicht das Adultstadium.',
    },
    {
      concept: 'bio:k5:fisch:fp:mc-stichling',
      q: 'Was ist am Stichling im Unterricht besonders bemerkenswert?',
      good: 'Er zeigt Brutfürsorge (Nestbau und Bewachen des Laichs)',
      bad: [
        'Er atmet nur über Lungen an Land',
        'Er legt niemals Eier',
        'Er ist kein Wirbeltier',
      ],
      wissen:
        'Der Stichling baut ein Nest und bewacht den Laich — ein Beispiel für Brutfürsorge, die bei den meisten Fischen fehlt.',
    },
    {
      concept: 'bio:k5:fisch:fp:mc-wasser',
      q: 'Warum ist Wasser für die Fortpflanzung der meisten Fische unverzichtbar?',
      good: 'Eier und Befruchtung finden im Wasser statt',
      bad: [
        'Weil Fische nur an Land laichen',
        'Weil Eier Luftsauerstoff wie bei Vögeln brauchen',
        'Weil Fische Pollen übertragen',
      ],
      wissen:
        'Ohne Wasser keine typische äußere Befruchtung und kein Laichen. Deshalb sind Laichplätze und Wasserqualität so wichtig.',
    },
  ]
  const tip = pick(rng, pool)
  return choicePickTask({
    question: tip.q,
    choices: shuffleChoices(rng, [tip.good, ...tip.bad], tip.good),
    correct: tip.good,
    solution: tip.good,
    explanation: tip.wissen,
    fachwissen: fw(tip.wissen),
    dedupeKey: tip.concept,
    contentIds: [tip.concept],
  })
}

export function fischeFortpflanzungTf(rng: Rng): Task {
  const bank = [
    {
      concept: 'bio:k5:fisch:fp:tf-aeusser',
      statement: 'Bei den meisten Knochenfischen erfolgt die Befruchtung äußerlich im Wasser.',
      correct: true,
      explanation: 'Eier und Samenflüssigkeit treffen sich außerhalb der Elterntiere.',
      wissen:
        'Äußere Befruchtung ist das typische Muster vieler Fische und unterscheidet sie klar von den meisten Säugetieren.',
    },
    {
      concept: 'bio:k5:fisch:fp:tf-innere',
      statement: 'Alle Fische befruchten ihre Eier ausschließlich im Körper der Weibchen.',
      correct: false,
      explanation: 'Die Regel ist äußere Befruchtung im Wasser (mit Ausnahmen).',
      wissen:
        'Innere Befruchtung ist bei Fischen nicht die Regel. Unterrichtsmodell: äußere Befruchtung beim Laichen.',
    },
    {
      concept: 'bio:k5:fisch:fp:tf-brut',
      statement: 'Die meisten Fischarten betreiben intensive Nestbrutpflege wie Singvögel.',
      correct: false,
      explanation: 'Brutfürsorge ist bei Fischen eher die Ausnahme.',
      wissen:
        'Viele Fische legen viele Eier und kümmern sich wenig. Ausnahmen wie der Stichling zeigen Nestbau und Bewachen.',
    },
    {
      concept: 'bio:k5:fisch:fp:tf-laichplatz',
      statement: 'Zerstörte Laichplätze gefährden die Fortpflanzung der Fischbestände.',
      correct: true,
      explanation: 'Ohne geeignete Orte scheitert das Laichen.',
      wissen:
        'Laichplatzschutz gehört zum Artenschutz: Ufer, Kiesbänke und Pflanzenzonen müssen erhalten bleiben.',
    },
    {
      concept: 'bio:k5:fisch:fp:tf-rogen',
      statement: 'Rogen bezeichnet die Eier der Weibchen.',
      correct: true,
      explanation: 'Rogen = Fischrogen/Eier.',
      wissen:
        'Fachbegriffe: Rogen (Eier), Milch (Samenflüssigkeit), Laichen (Ablegen), äußere Befruchtung.',
    },
  ]
  const c = pick(rng, bank)
  return trueFalse(rng, {
    statement: c.statement,
    correct: c.correct,
    explanation: c.explanation,
    fachwissen: fw(c.wissen),
    dedupeKey: c.concept,
    contentIds: [c.concept],
  })
}

export function fischeFortpflanzungMulti(rng: Rng): Task {
  const correct = shuffle(rng, [
    'Äußere Befruchtung im Wasser',
    'Laichen an geeigneten Plätzen',
    'Weibchen legen Eier (Rogen)',
  ]).slice(0, 2)
  const wrong = shuffle(rng, [
    'Befruchtung nur durch Pollenflug',
    'Jungtiere atmen sofort nur über Federn',
    'Laichen ausschließlich auf Baumkronen',
  ]).slice(0, 2)
  const concept = `bio:k5:fisch:fp:multi:${correct.join('|').slice(0, 40)}`
  return multiSelectTask({
    question: 'Welche Aussagen zur Fortpflanzung der Fische stimmen?',
    choices: shuffle(rng, [...correct, ...wrong]),
    correct,
    solution: correct.join('; '),
    explanation: correct.map((c) => `${c}.`).join(' '),
    fachwissen: fw(
      'Typisch: äußere Befruchtung, Laichen, Rogen und Milch, Bindung an Wasser und Laichplätze. Brutfürsorge ist bei vielen Arten gering.',
    ),
    dedupeKey: concept,
    contentIds: [concept],
  })
}

// ─── Related K5: Lurch Fortpflanzung densify + Vogel Fortpflanzung ───────────

export function lurcheFortpflanzungExtra(rng: Rng): Task {
  const pool = [
    () =>
      matchTermsTask(rng, {
        question: 'Ordne Begriffe zur Fortpflanzung der Lurche zu.',
        terms: ['Laich', 'Äußere Befruchtung', 'Metamorphose', 'Laichgewässer'],
        meanings: [
          'Eigelege im Wasser',
          'Befruchtung oft außerhalb des Körpers',
          'Umwandlung von der Larve zum Adulttier',
          'Ort, an dem Lurche Eier ablegen',
        ],
        distractor: 'Brustschwimmen nur mit Flossenstrahlen',
        solution: 'Laich / äußere Befruchtung / Metamorphose / Laichgewässer',
        explanation:
          'Lurche legen Laich ins Wasser; die Befruchtung ist oft äußerlich; die Larve verwandelt sich (Metamorphose).',
        fachwissen: bioFw(
          'Fortpflanzung der Lurche: Laichgewässer, oft äußere Befruchtung, Larvenstadium mit Kiemen, später Metamorphose zum landlebenden Adulttier.',
          'Wikipedia: Amphibien',
          'https://de.wikipedia.org/wiki/Amphibien',
        ),
        dedupeKey: 'bio:k5:lurch:fp:match-kern',
        contentIds: [
          'bio:k5:lurch:fp:laich',
          'bio:k5:lurch:fp:aeusser',
          'bio:k5:lurch:fp:meta',
          'bio:k5:lurch:fp:gewaesser',
        ],
      }),
    () =>
      choicePickTask({
        question: 'Warum wandern viele Froschlurche im Frühjahr zu Tümpeln?',
        choices: shuffleChoices(
          rng,
          [
            'Zum Laichen in geeigneten Gewässern',
            'Um Federn zu wechseln',
            'Um ausschließlich an Land zu brüten',
            'Um Kiemen gegen Schuppen zu tauschen als Fisch',
          ],
          'Zum Laichen in geeigneten Gewässern',
        ),
        correct: 'Zum Laichen in geeigneten Gewässern',
        solution: 'Zum Laichen in geeigneten Gewässern',
        explanation: 'Die Fortpflanzung ist an Laichgewässer gebunden.',
        fachwissen: bioFw(
          'Viele Froschlurche suchen im Frühjahr Laichgewässer auf. Dort werden Eier abgelegt und oft äußerlich befruchtet; die Larven leben zunächst im Wasser.',
          'Wikipedia: Amphibien',
          'https://de.wikipedia.org/wiki/Amphibien',
        ),
        dedupeKey: 'bio:k5:lurch:fp:mc-wanderung',
        contentIds: ['bio:k5:lurch:fp:mc-wanderung'],
      }),
    () =>
      clozeBlanksTask({
        question: 'Ergänze: Fortpflanzung der Froschlurche.',
        template:
          'Aus dem ___ wird die Kaulquappe; später folgt die ___ zum landlebenden Frosch.',
        accepted: [['Laich', 'Eigelege'], ['Metamorphose', 'Umwandlung']],
        solution: 'Laich; Metamorphose',
        explanation: 'Laich → Larve → Metamorphose → Adulttier.',
        fachwissen: bioFw(
          'Der Lebenszyklus verknüpft Wasser- und Landleben: Laich und Larve im Wasser, Adulttier oft an Land — verbunden durch die Metamorphose.',
          'Wikipedia: Amphibien',
          'https://de.wikipedia.org/wiki/Amphibien',
        ),
        dedupeKey: 'bio:k5:lurch:fp:cloze-zyklus',
        contentIds: ['bio:k5:lurch:fp:cloze-zyklus'],
      }),
  ]
  return pick(rng, pool)()
}

export function voegelFortpflanzungExtra(rng: Rng): Task {
  const pool = [
    () =>
      matchTermsTask(rng, {
        question: 'Ordne Begriffe zur Fortpflanzung der Vögel zu.',
        terms: ['Innere Befruchtung', 'Nest', 'Nesthocker', 'Nestflüchter'],
        meanings: [
          'Befruchtung im Körper des Weibchens',
          'Ort für Gelege und oft Aufzucht',
          'Jungvögel lange hilflos im Nest',
          'Jungvögel bald aktiv außerhalb des Nestes',
        ],
        distractor: 'Äußere Befruchtung wie bei den meisten Knochenfischen',
        solution: 'Innere Befruchtung / Nest / Nesthocker / Nestflüchter',
        explanation:
          'Vögel: innere Befruchtung, Eiablage, Nest; Nesthocker vs. Nestflüchter beschreibt die Selbstständigkeit der Jungen.',
        fachwissen: bioFw(
          'Fortpflanzung der Vögel: innere Befruchtung, Eier mit harter Schale, Nestbau und unterschiedliche Formen der Brutpflege (Nesthocker/Nestflüchter).',
          'Wikipedia: Vögel',
          'https://de.wikipedia.org/wiki/V%C3%B6gel',
        ),
        dedupeKey: 'bio:k5:vogel:fp:match-kern',
        contentIds: [
          'bio:k5:vogel:fp:innere',
          'bio:k5:vogel:fp:nest',
          'bio:k5:vogel:fp:nesthocker',
          'bio:k5:vogel:fp:nestfluechter',
        ],
      }),
    () =>
      choicePickTask({
        question: 'Was unterscheidet die Fortpflanzung der Vögel klar von den meisten Fischen?',
        choices: shuffleChoices(
          rng,
          [
            'Innere Befruchtung und Eier mit Schale an Land / im Nest',
            'Nur äußere Befruchtung im offenen Wasser ohne Nest',
            'Nur Kiemenatmung der Jungtiere',
            'Nur Laichen ohne elterliche Brutpflege bei allen Arten',
          ],
          'Innere Befruchtung und Eier mit Schale an Land / im Nest',
        ),
        correct: 'Innere Befruchtung und Eier mit Schale an Land / im Nest',
        solution: 'Innere Befruchtung und Eier mit Schale an Land / im Nest',
        explanation: 'Vögel sind in der Fortpflanzung vom offenen Wasser unabhängig.',
        fachwissen: bioFw(
          'Im Vergleich: Fische — äußere Befruchtung im Wasser; Vögel — innere Befruchtung, Schalenei, oft Nest und Brutpflege.',
          'Wikipedia: Vögel',
          'https://de.wikipedia.org/wiki/V%C3%B6gel',
        ),
        dedupeKey: 'bio:k5:vogel:fp:mc-vs-fisch',
        contentIds: ['bio:k5:vogel:fp:mc-vs-fisch'],
      }),
    () =>
      sortChronologyTask(rng, {
        question: 'Ordne die Schritte der Vogelbrut von früh nach spät.',
        labels: ['Paarung / innere Befruchtung', 'Eiablage ins Nest', 'Bebrüten', 'Schlüpfen der Jungen'],
        solution: 'Paarung → Eiablage → Bebrüten → Schlüpfen',
        explanation: 'Nach der inneren Befruchtung folgen Gelege, Bebrüten und Schlupf.',
        fachwissen: bioFw(
          'Typischer Ablauf: innere Befruchtung, Eiablage, Bebrüten durch die Eltern, Schlupf — oft mit anschließender Fütterung (Nesthocker).',
          'Wikipedia: Vögel',
          'https://de.wikipedia.org/wiki/V%C3%B6gel',
        ),
        dedupeKey: 'bio:k5:vogel:fp:sort-brut',
        contentIds: ['bio:k5:vogel:fp:sort-brut'],
      }),
  ]
  return pick(rng, pool)()
}

/** Topic generators — merge with existing Lebensraum / Schutz / Meta / Vogel-FP. */
export function buildFischeLebensraumDense(
  base: Topic['generate'],
): Topic['generate'] {
  return mixedVariants(
    fischeRaubFriedClassify,
    fischeRaubFriedClassify,
    fischeRaubFriedMulti,
    fischeRaubFriedDiffMatch,
    fischeRaubFriedMc,
    fischeRaubFriedTf,
    fischeRaubFriedMc,
    base,
    base,
  )
}

export function buildFischeSchutzDense(base: Topic['generate']): Topic['generate'] {
  return mixedVariants(
    fischeFortpflanzungMatch,
    fischeFortpflanzungMatch,
    fischeFortpflanzungSort,
    fischeFortpflanzungCloze,
    fischeFortpflanzungMc,
    fischeFortpflanzungMc,
    fischeFortpflanzungTf,
    fischeFortpflanzungMulti,
    base,
    base,
  )
}

export function buildLurcheMetaDense(base: Topic['generate']): Topic['generate'] {
  return mixedVariants(base, base, lurcheFortpflanzungExtra, lurcheFortpflanzungExtra)
}

export function buildVoegelFortpflanzungDense(
  base: Topic['generate'],
): Topic['generate'] {
  return mixedVariants(base, voegelFortpflanzungExtra, voegelFortpflanzungExtra, base)
}
