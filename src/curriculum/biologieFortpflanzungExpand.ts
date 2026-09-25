/**
 * K5 Fortpflanzung-Themen (Lurche, Kriechtiere) nach dem Fisch-Muster.
 * Zusätzlich: Federarten, heimische Säuger-Liste (tolerant), dünne Banken verdichten.
 * Originales Deutsch; concept-ids themenspezifisch.
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
  mixedVariants,
  multiSelectTask,
  textTask,
} from './taskHelpers'
import type { Task, Topic, UserInput } from './types'

const norm = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]/g, '')

// ─── Lurche – Fortpflanzung ───────────────────────────────────────────────────

function lurcheFpMatch(rng: Rng): Task {
  return matchTermsTask(rng, {
    question: 'Ordne Begriffe zur Fortpflanzung der Lurche zu.',
    terms: ['Laich', 'Äußere Befruchtung', 'Kaulquappe', 'Laichgewässer'],
    meanings: [
      'Eigelege im Wasser',
      'Befruchtung oft außerhalb des Körpers',
      'Larve der Froschlurche',
      'Ort der Eiablage und frühen Entwicklung',
    ],
    distractor: 'Harte Kalkschale wie beim Vogelei',
    solution: 'Laich / äußere Befruchtung / Kaulquappe / Laichgewässer',
    explanation:
      'Lurche legen Laich ins Wasser; die Befruchtung ist oft äußerlich; die Larve (z. B. Kaulquappe) lebt zunächst im Wasser.',
    fachwissen: bioFw(
      'Fortpflanzung der Lurche: Bindung an Laichgewässer, oft äußere Befruchtung, Larvenstadium mit Kiemen, später Metamorphose.',
      'Wikipedia: Amphibien',
      'https://de.wikipedia.org/wiki/Amphibien',
    ),
    dedupeKey: 'bio:k5:lurch:fp-topic:match',
    contentIds: [
      'bio:k5:lurch:fp-topic:laich',
      'bio:k5:lurch:fp-topic:aeusser',
      'bio:k5:lurch:fp-topic:kaulquappe',
      'bio:k5:lurch:fp-topic:gewaesser',
    ],
  })
}

function lurcheFpCloze(rng: Rng): Task {
  const variants = [
    {
      template:
        'Viele Froschlurche legen ___ im Wasser ab; die Befruchtung erfolgt oft ___.',
      accepted: [
        ['Laich', 'Eier', 'Eigelege'],
        ['außen', 'aeusserlich', 'außerhalb', 'aussen', 'äusserlich', 'aeussere'],
      ],
      solution: 'Laich; außen',
      concept: 'bio:k5:lurch:fp-topic:cloze-laich',
    },
    {
      template:
        'Aus dem Laich entsteht die ___; später folgt die ___ zum landlebenden Adulttier.',
      accepted: [
        ['Kaulquappe', 'Larve'],
        ['Metamorphose', 'Umwandlung'],
      ],
      solution: 'Kaulquappe; Metamorphose',
      concept: 'bio:k5:lurch:fp-topic:cloze-meta',
    },
  ]
  const v = pick(rng, variants)
  return clozeBlanksTask({
    question: 'Ergänze den Lückentext zur Fortpflanzung der Lurche.',
    template: v.template,
    accepted: v.accepted,
    solution: v.solution,
    explanation: 'Wasserbindung, Larve und Metamorphose kennzeichnen viele Lurche.',
    fachwissen: bioFw(
      'Ohne geeignetes Laichgewässer scheitert oft die Fortpflanzung. Die Metamorphose verbindet Wasser- und Landleben.',
      'Wikipedia: Amphibien',
      'https://de.wikipedia.org/wiki/Amphibien',
    ),
    dedupeKey: v.concept,
    contentIds: [v.concept],
  })
}

function lurcheFpSort(rng: Rng): Task {
  return sortChronologyTask(rng, {
    question: 'Ordne die Schritte der Froschlurch-Fortpflanzung von früh nach spät.',
    labels: [
      'Wanderung zum Laichgewässer',
      'Laichablage und Befruchtung',
      'Kaulquappenstadium',
      'Metamorphose zum Adulttier',
    ],
    solution: 'Wanderung → Laichen → Kaulquappe → Metamorphose',
    explanation: 'Erst Laichgewässer, dann Entwicklung im Wasser, danach Landleben.',
    fachwissen: bioFw(
      'Typischer Ablauf: Aufsuchen des Laichgewässers, Ablegen und Befruchten des Laichs, Larvenleben, Metamorphose.',
      'Wikipedia: Amphibien',
      'https://de.wikipedia.org/wiki/Amphibien',
    ),
    dedupeKey: 'bio:k5:lurch:fp-topic:sort',
    contentIds: ['bio:k5:lurch:fp-topic:sort'],
  })
}

function lurcheFpMc(rng: Rng): Task {
  const items = [
    {
      q: 'Warum sind viele Lurche auf Feuchtgebiete angewiesen?',
      correct: 'Weil Laich und Larven auf Wasser angewiesen sind',
      wrong: [
        'Weil sie Federn trocknen müssen',
        'Weil sie nur in Salzwasser atmen',
        'Weil sie ausschließlich Winterschlaf im Eis halten',
      ],
      concept: 'bio:k5:lurch:fp-topic:mc-feucht',
    },
    {
      q: 'Was ist typisch für die Fortpflanzung vieler Froschlurche?',
      correct: 'Äußere Befruchtung und Metamorphose',
      wrong: [
        'Nur innere Befruchtung ohne Larve',
        'Nur Brüten mit Federkleid',
        'Nur lebendgebärend wie alle Säuger',
      ],
      concept: 'bio:k5:lurch:fp-topic:mc-typisch',
    },
  ]
  const it = pick(rng, items)
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.correct, ...it.wrong], it.correct),
    correct: it.correct,
    solution: it.correct,
    explanation: it.correct,
    fachwissen: bioFw(
      'Lurch-Fortpflanzung: Wasserbindung, oft äußere Befruchtung, Larve mit Kiemen, Metamorphose.',
      'Wikipedia: Amphibien',
      'https://de.wikipedia.org/wiki/Amphibien',
    ),
    dedupeKey: it.concept,
    contentIds: [it.concept],
  })
}

function lurcheFpTf(rng: Rng): Task {
  const cases = [
    {
      statement: 'Kaulquappen vieler Froschlurche atmen zunächst mit Kiemen.',
      correct: true,
      explanation: 'Die Larve ist an das Wasserleben angepasst.',
      concept: 'bio:k5:lurch:fp-topic:tf-kiemen',
    },
    {
      statement: 'Alle Lurche legen Eier mit harter Kalkschale an Land wie Vögel.',
      correct: false,
      explanation: 'Typisch ist Laich im Wasser, nicht das Vogelschalen-Ei.',
      concept: 'bio:k5:lurch:fp-topic:tf-schale',
    },
  ]
  const c = pick(rng, cases)
  return trueFalse(rng, {
    statement: c.statement,
    correct: c.correct,
    explanation: c.explanation,
    fachwissen: bioFw(
      'Vergleich: Lurch-Laich im Wasser vs. Vogelei mit Schale an Land.',
      'Wikipedia: Amphibien',
      'https://de.wikipedia.org/wiki/Amphibien',
    ),
    contentIds: [c.concept],
  })
}

export const biLurcheFortpflanzung: Topic['generate'] = mixedVariants(
  lurcheFpMatch,
  lurcheFpCloze,
  lurcheFpSort,
  lurcheFpMc,
  lurcheFpTf,
  lurcheFpMatch,
  lurcheFpMc,
  lurcheFpCloze,
)

// ─── Kriechtiere – Fortpflanzung ─────────────────────────────────────────────

function kriechFpMatch(rng: Rng): Task {
  return matchTermsTask(rng, {
    question: 'Ordne Begriffe zur Fortpflanzung der Kriechtiere zu.',
    terms: ['Innere Befruchtung', 'Schalenei', 'Eiablage an Land', 'Dotter'],
    meanings: [
      'Befruchtung im Körper des Weibchens',
      'Ei mit schützender Hülle (oft lederartig)',
      'Entwicklung unabhängig vom offenen Gewässer',
      'Nährstoffvorrat für den Embryo',
    ],
    distractor: 'Nur äußere Befruchtung wie bei den meisten Knochenfischen',
    solution: 'Innere Befruchtung / Schalenei / Eiablage an Land / Dotter',
    explanation:
      'Kriechtiere: innere Befruchtung und Eier mit Hülle — Angepasstheit an das Landleben.',
    fachwissen: bioFw(
      'Fortpflanzung der Kriechtiere: innere Befruchtung, oft Eiablage an Land mit schützender Eihülle; Dotter ernährt den Embryo.',
      'Wikipedia: Reptilien',
      'https://de.wikipedia.org/wiki/Reptilien',
    ),
    dedupeKey: 'bio:k5:kriechtier:fp-topic:match',
    contentIds: [
      'bio:k5:kriechtier:fp-topic:innere',
      'bio:k5:kriechtier:fp-topic:ei',
      'bio:k5:kriechtier:fp-topic:land',
      'bio:k5:kriechtier:fp-topic:dotter',
    ],
  })
}

function kriechFpCloze(_rng: Rng): Task {
  return clozeBlanksTask({
    question: 'Ergänze: Fortpflanzung der Kriechtiere.',
    template:
      'Bei Kriechtieren erfolgt typischerweise eine ___ Befruchtung; viele Arten legen ___ an Land ab.',
    accepted: [
      ['innere', 'innerliche'],
      ['Eier', 'Schaleneier', 'Gelege'],
    ],
    solution: 'innere; Eier',
    explanation: 'Innere Befruchtung und Eiablage an Land lösen die starke Wasserbindung der Fische/Lurche.',
    fachwissen: bioFw(
      'Im Vergleich zu vielen Fischen und Lurchen sind Kriechtiere in der Fortpflanzung unabhängiger vom offenen Wasser.',
      'Wikipedia: Reptilien',
      'https://de.wikipedia.org/wiki/Reptilien',
    ),
    dedupeKey: 'bio:k5:kriechtier:fp-topic:cloze',
    contentIds: ['bio:k5:kriechtier:fp-topic:cloze'],
  })
}

function kriechFpSort(rng: Rng): Task {
  return sortChronologyTask(rng, {
    question: 'Ordne die Schritte der Kriechtier-Fortpflanzung von früh nach spät.',
    labels: [
      'Paarung / innere Befruchtung',
      'Bildung des Eis mit Dotter und Hülle',
      'Eiablage an Land',
      'Schlupf des Jungtiers',
    ],
    solution: 'Paarung → Eibildung → Eiablage → Schlupf',
    explanation: 'Nach der inneren Befruchtung folgen Gelege und Schlupf an Land.',
    fachwissen: bioFw(
      'Typischer Ablauf: innere Befruchtung, Eibildung, Eiablage, Entwicklung und Schlupf — oft ohne Metamorphose wie bei Lurchen.',
      'Wikipedia: Reptilien',
      'https://de.wikipedia.org/wiki/Reptilien',
    ),
    dedupeKey: 'bio:k5:kriechtier:fp-topic:sort',
    contentIds: ['bio:k5:kriechtier:fp-topic:sort'],
  })
}

function kriechFpMc(rng: Rng): Task {
  const items = [
    {
      q: 'Was unterscheidet die Fortpflanzung vieler Kriechtiere klar von den meisten Knochenfischen?',
      correct: 'Innere Befruchtung und Eiablage an Land',
      wrong: [
        'Nur äußere Befruchtung im offenen Wasser',
        'Nur Kiemenatmung der Jungtiere',
        'Nur Laichen ohne Eihülle',
      ],
      concept: 'bio:k5:kriechtier:fp-topic:mc-vs-fisch',
    },
    {
      q: 'Wozu dient der Dotter im Kriechtier-Ei?',
      correct: 'Als Nährstoffvorrat für den Embryo',
      wrong: [
        'Als Kiemenersatz der Elterntiere',
        'Als Federfahne für den Flug',
        'Als Schwimmblase im Wasser',
      ],
      concept: 'bio:k5:kriechtier:fp-topic:mc-dotter',
    },
  ]
  const it = pick(rng, items)
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.correct, ...it.wrong], it.correct),
    correct: it.correct,
    solution: it.correct,
    explanation: it.correct,
    fachwissen: bioFw(
      'Kriechtiere: innere Befruchtung und Eier mit Hülle/Dotter — Merkmale der Angepasstheit an das Landleben.',
      'Wikipedia: Reptilien',
      'https://de.wikipedia.org/wiki/Reptilien',
    ),
    dedupeKey: it.concept,
    contentIds: [it.concept],
  })
}

function kriechFpTf(rng: Rng): Task {
  const cases = [
    {
      statement: 'Viele Kriechtiere legen Eier an Land und sind damit unabhängiger vom offenen Wasser.',
      correct: true,
      explanation: 'Die Eihülle schützt den Embryo außerhalb des Gewässers.',
      concept: 'bio:k5:kriechtier:fp-topic:tf-land',
    },
    {
      statement: 'Kriechtiere pflanzen sich typischerweise nur durch äußere Befruchtung im Wasser fort.',
      correct: false,
      explanation: 'Typisch ist innere Befruchtung.',
      concept: 'bio:k5:kriechtier:fp-topic:tf-aeusser',
    },
  ]
  const c = pick(rng, cases)
  return trueFalse(rng, {
    statement: c.statement,
    correct: c.correct,
    explanation: c.explanation,
    fachwissen: bioFw(
      'Fortpflanzung der Kriechtiere: innere Befruchtung, oft Eiablage an Land.',
      'Wikipedia: Reptilien',
      'https://de.wikipedia.org/wiki/Reptilien',
    ),
    contentIds: [c.concept],
  })
}

export const biKriechtiereFortpflanzung: Topic['generate'] = mixedVariants(
  kriechFpMatch,
  kriechFpCloze,
  kriechFpSort,
  kriechFpMc,
  kriechFpTf,
  kriechFpMatch,
  kriechFpMc,
  kriechFpCloze,
)

// ─── Vögel Flug: Federarten / Federaufbau (Text+Zuordnung; Bild folgt) ────────

function federArtenMatch(rng: Rng): Task {
  return matchTermsTask(rng, {
    question: 'Ordne die Federarten ihrer Funktion zu.',
    terms: ['Konturfeder', 'Daunenfeder', 'Schwungfeder', 'Steuerfeder'],
    meanings: [
      'Äußere Körperform und Schutz',
      'Wärmeisolation (Unterkleid)',
      'Auftrieb und Vortrieb am Flügel',
      'Steuerung am Schwanz',
    ],
    distractor: 'Nur Kiemenatmung unter Wasser',
    solution: 'Kontur / Daune / Schwung / Steuer',
    explanation: 'Verschiedene Federarten übernehmen Form, Wärme, Flug und Steuerung.',
    fachwissen: bioFw(
      'Federkleid: Konturfedern formen den Körper, Daunen isolieren, Schwung- und Steuerfedern ermöglichen den Flug.',
      'Wikipedia: Feder',
      'https://de.wikipedia.org/wiki/Feder_(Vogel)',
    ),
    dedupeKey: 'bio:k5:vogel:flug:federarten-match',
    contentIds: [
      'bio:k5:vogel:flug:kontur',
      'bio:k5:vogel:flug:daune',
      'bio:k5:vogel:flug:schwung',
      'bio:k5:vogel:flug:steuer',
    ],
  })
}

function federAufbauMatch(rng: Rng): Task {
  return matchTermsTask(rng, {
    question: 'Ordne die Bestandteile einer Konturfeder zu.',
    terms: ['Federkiel', 'Federschaft', 'Federfahne', 'Äste und Strahlen'],
    meanings: [
      'Hohler unterer Teil, steckt in der Haut',
      'Zentrale Achse der Feder',
      'Flächiger Teil links und rechts des Schafts',
      'Verzweigungen, die die Fahne zusammenhalten',
    ],
    distractor: 'Schwimmblase der Knochenfische',
    solution: 'Kiel / Schaft / Fahne / Äste+Strahlen',
    explanation: 'Aufbau der Feder: Kiel, Schaft, Fahne aus Ästen und Strahlen.',
    fachwissen: bioFw(
      'Eine typische Konturfeder besteht aus Kiel, Schaft und Federfahne. Äste und Strahlen verzahnen die Fahne zu einer tragfähigen Fläche.',
      'Wikipedia: Feder',
      'https://de.wikipedia.org/wiki/Feder_(Vogel)',
    ),
    dedupeKey: 'bio:k5:vogel:flug:federaufbau-match',
    contentIds: [
      'bio:k5:vogel:flug:kiel',
      'bio:k5:vogel:flug:schaft',
      'bio:k5:vogel:flug:fahne',
      'bio:k5:vogel:flug:straahlen',
    ],
  })
}

function federMc(rng: Rng): Task {
  const items = [
    {
      q: 'Welche Federart dient vor allem der Wärmeisolation?',
      correct: 'Daunenfeder',
      wrong: ['Schwungfeder', 'Nur Kiemendeckel', 'Nur Schuppenpanzer'],
      concept: 'bio:k5:vogel:flug:mc-daune',
    },
    {
      q: 'Was bildet die tragfähige Fläche der Schwungfeder?',
      correct: 'Die Federfahne aus Ästen und Strahlen',
      wrong: [
        'Nur die Kiemenlamellen',
        'Nur die Schwimmblase',
        'Nur der Dottersack',
      ],
      concept: 'bio:k5:vogel:flug:mc-fahne',
    },
  ]
  const it = pick(rng, items)
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.correct, ...it.wrong], it.correct),
    correct: it.correct,
    solution: it.correct,
    explanation: it.correct,
    fachwissen: bioFw(
      'Struktur und Funktion: Federarten und Federaufbau sind Angepasstheiten an Flug und Temperaturhaushalt.',
      'Wikipedia: Feder',
      'https://de.wikipedia.org/wiki/Feder_(Vogel)',
    ),
    dedupeKey: it.concept,
    contentIds: [it.concept],
  })
}

export function buildVoegelFlugDense(base: Topic['generate']): Topic['generate'] {
  return mixedVariants(
    federArtenMatch,
    federAufbauMatch,
    federMc,
    federArtenMatch,
    federMc,
    base,
    base,
  )
}

// ─── Säugetiere Schutz: 5 heimische Arten (tolerant) ─────────────────────────

const HEIMISCHE_SAEUGER = [
  'Reh',
  'Fuchs',
  'Igel',
  'Maulwurf',
  'Rothirsch',
  'Wildschwein',
  'Dachs',
  'Feldhase',
  'Eichhörnchen',
  'Fledermaus',
  'Maus',
  'Ratte',
  'Biber',
  'Fischotter',
  'Luchs',
  'Wolf',
  'Steinmarder',
  'Waschbär',
]

const SAEUGER_ALIAS: Record<string, string> = {
  hirsch: 'rothirsch',
  rehgeiss: 'reh',
  rehbock: 'reh',
  wildschwein: 'wildschwein',
  keiler: 'wildschwein',
  hase: 'feldhase',
  maulwuerfe: 'maulwurf',
  fledermause: 'fledermaus',
  eichhorn: 'eichhoernchen',
  eichhoernchen: 'eichhoernchen',
}

function parseSaeugerList(raw: string): string[] {
  return raw
    .split(/[,;/]|\bund\b|\s{2,}/i)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const n = norm(p)
      return SAEUGER_ALIAS[n] ?? n
    })
}

/** Tippe fünf heimische Säugetiere — Reihenfolge egal, Schreibweise tolerant. */
export function saeugerFuenfArten(rng: Rng): Task {
  const sample = shuffle(rng, HEIMISCHE_SAEUGER).slice(0, 5)
  const poolNorm = new Set(HEIMISCHE_SAEUGER.map(norm))
  const check = (answer: UserInput) => {
    if (answer.kind !== 'value') return false
    const parts = parseSaeugerList(answer.value)
    if (parts.length < 5) return false
    const unique = new Set(parts)
    if (unique.size < 5) return false
    let ok = 0
    for (const p of unique) {
      if (poolNorm.has(p)) ok++
    }
    return ok >= 5
  }
  return {
    ...textTask({
      question:
        'Nenne fünf heimische Säugetiere (durch Komma getrennt). Reihenfolge ist egal; leichte Tippfehler bei Umlauten sind ok.',
      accepted: [sample.join(', ')],
      solution: `z. B. ${sample.join(', ')} (aus dem Pool heimischer Arten)`,
      explanation:
        'Heimische Säuger kennen und nennen — Artenkenntnis und Vielfalt. Akzeptiert wird jede sinnvolle Auswahl aus dem Pool.',
      fachwissen: bioFw(
        'Vielfalt der Säugetiere: In Sachsen und Mitteleuropa leben u. a. Reh, Fuchs, Igel, Hirsch, Wildschwein, Dachs, Feldhase und viele weitere Arten. Artenschutz beginnt mit Kenntnis der heimischen Fauna.',
        'Wikipedia: Säugetiere',
        'https://de.wikipedia.org/wiki/S%C3%A4ugetiere',
      ),
      dedupeKey: 'bio:k5:saeuger:schutz:fuenf-arten',
      contentIds: ['bio:k5:saeuger:schutz:fuenf-arten'],
    }),
    check,
    sampleAnswer: { kind: 'value' as const, value: sample.join(', ') },
  }
}

function saeugerSchutzExtra(rng: Rng): Task {
  const pool = [
    () => saeugerFuenfArten(rng),
    () =>
      multiSelectTask({
        question: 'Welche Maßnahmen schützen heimische Säugetiere?',
        choices: shuffle(rng, [
          'Lebensräume erhalten (Hecken, Wälder, Gewässer)',
          'Straßenquerungen und Wildbrücken',
          'Jagd ohne Regeln das ganze Jahr',
          'Giftköder flächig auslegen',
          'Artenschutz und Aufklärung',
        ]),
        correct: [
          'Lebensräume erhalten (Hecken, Wälder, Gewässer)',
          'Straßenquerungen und Wildbrücken',
          'Artenschutz und Aufklärung',
        ],
        solution: 'Lebensräume, Querungshilfen, Artenschutz',
        explanation: 'Schutz braucht Lebensraum, sichere Wanderwege und gesellschaftliche Regeln.',
        fachwissen: bioFw(
          'Säugetierschutz: Biotopverbund, Verkehrsberuhigung an Wanderkorridoren, gesetzlicher Artenschutz und verantwortungsvoller Umgang mit Wildtieren.',
          'Wikipedia: Artenschutz',
          'https://de.wikipedia.org/wiki/Artenschutz',
        ),
        dedupeKey: 'bio:k5:saeuger:schutz:multi-massnahmen',
        contentIds: ['bio:k5:saeuger:schutz:multi-massnahmen'],
      }),
    () =>
      choicePickTask({
        question: 'Warum ist Vielfalt der Säugetiere ökologisch wichtig?',
        choices: shuffleChoices(
          rng,
          [
            'Unterschiedliche Arten nutzen und gestalten Lebensräume unterschiedlich',
            'Nur eine Art reicht immer in jedem Ökosystem',
            'Säuger ersetzen vollständig die Fotosynthese',
            'Vielfalt bedeutet immer nur Schaden',
          ],
          'Unterschiedliche Arten nutzen und gestalten Lebensräume unterschiedlich',
        ),
        correct: 'Unterschiedliche Arten nutzen und gestalten Lebensräume unterschiedlich',
        solution: 'Unterschiedliche Arten nutzen und gestalten Lebensräume unterschiedlich',
        explanation: 'Artenvielfalt sichert Funktionen im Ökosystem.',
        fachwissen: bioFw(
          'Vielfalt: Räuber, Pflanzenfresser und Allesfresser nehmen unterschiedliche Rollen in Nahrungsnetzen und Lebensräumen ein.',
          'Wikipedia: Biodiversität',
          'https://de.wikipedia.org/wiki/Biodiversit%C3%A4t',
        ),
        dedupeKey: 'bio:k5:saeuger:schutz:mc-vielfalt',
        contentIds: ['bio:k5:saeuger:schutz:mc-vielfalt'],
      }),
  ]
  return pick(rng, pool)()
}

export function buildSaeugerSchutzDense(base: Topic['generate']): Topic['generate'] {
  return mixedVariants(
    saeugerSchutzExtra,
    saeugerSchutzExtra,
    saeugerFuenfArten,
    base,
    base,
    base,
  )
}

/** Extra TF/MC für Säuger-Überblick (nach Entfernen zu leichter Aufgaben). */
function saeugerUeberblickExtra(rng: Rng): Task {
  const items = [
    {
      statement: 'Fledermäuse sind Säugetiere, obwohl sie fliegen können.',
      correct: true,
      explanation: 'Sie säugen ihre Jungen und haben Haare — Flug mit Flughaut.',
      concept: 'bio:k5:saeuger:ueberblick:tf-fledermaus-extra',
    },
    {
      statement: 'Alle Säugetiere legen Eier mit harter Schale wie Vögel.',
      correct: false,
      explanation: 'Die meisten Säuger sind lebendgebärend; nur Sonderfälle legen Eier.',
      concept: 'bio:k5:saeuger:ueberblick:tf-ei-extra',
    },
  ]
  const c = pick(rng, items)
  return trueFalse(rng, {
    statement: c.statement,
    correct: c.correct,
    explanation: c.explanation,
    fachwissen: bioFw(
      'Säugermerkmale: Fell/Haare, Säugen, meist lebendgebärend und gleichwarm — auch bei fliegenden oder schwimmenden Arten.',
      'Wikipedia: Säugetiere',
      'https://de.wikipedia.org/wiki/S%C3%A4ugetiere',
    ),
    contentIds: [c.concept],
  })
}

export function buildSaeugerUeberblickDense(base: Topic['generate']): Topic['generate'] {
  return mixedVariants(base, base, saeugerUeberblickExtra, saeugerUeberblickExtra)
}
