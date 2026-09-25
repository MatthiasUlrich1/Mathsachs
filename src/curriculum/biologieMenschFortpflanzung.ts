/**
 * K5 LB6 — Säugetiere Fortpflanzung / Mensch.
 * Aufbau/Funktion Geschlechtsorgane (Bild+Blöcke), Pubertät, Menstruation, Pollution, Eltern-Kind.
 */
import type { Rng } from '../lib/rng'
import {
  bioFw,
  clozeBlanksTask,
  matchTermsTask,
  pick,
  shuffle,
  shuffleChoices,
  trueFalse,
} from './biologieHelpers'
import {
  choicePickTask,
  imageLabelSlotsTask,
  mixedVariants,
  multiSelectTask,
} from './taskHelpers'
import type { Topic } from './types'

const FEMALE_REPRO_SRC = '/anatomy/female-reproductive-unlabeled.svg'
const FEMALE_REPRO_ATTR =
  'TaskTrophy / Mathsachs: Originales Unterrichtsschema „Weibliche Geschlechtsorgane (unbeschriftet)“ — Public Domain (CC0) für Bildungszwecke.'

const MALE_REPRO_SRC = '/anatomy/male-reproductive-unlabeled.svg'
const MALE_REPRO_ATTR =
  'TaskTrophy / Mathsachs: Originales Unterrichtsschema „Männliche Geschlechtsorgane (unbeschriftet)“ — Public Domain (CC0) für Bildungszwecke.'

const FEMALE_SLOTS = [
  {
    id: 'eierstock',
    x: 13.8,
    y: 28.1,
    targetX: 24,
    targetY: 38,
    label: 'Eierstock',
    functionDe: 'Bildet Eizellen und Hormone',
    wissen: 'Im Eierstock reifen Eizellen; Hormone steuern den Zyklus.',
    concept: 'bio:k5:saeuger:fp-mensch:eierstock',
  },
  {
    id: 'eileiter',
    x: 13.8,
    y: 48.4,
    targetX: 35,
    targetY: 39,
    label: 'Eileiter',
    functionDe: 'Transport der Eizelle; Ort der Befruchtung',
    wissen: 'Durch den Eileiter wandert die Eizelle; hier kann die Befruchtung erfolgen.',
    concept: 'bio:k5:saeuger:fp-mensch:eileiter',
  },
  {
    id: 'gebaermutter',
    x: 50,
    y: 12.5,
    targetX: 50,
    targetY: 40,
    label: 'Gebärmutter',
    functionDe: 'Nidationsort und Entwicklung des Embryos',
    wissen: 'In der Gebärmutter nistet sich die befruchtete Eizelle ein und entwickelt sich weiter.',
    concept: 'bio:k5:saeuger:fp-mensch:gebaermutter',
  },
  {
    id: 'scheide',
    x: 50,
    y: 93.8,
    targetX: 50,
    targetY: 82,
    label: 'Scheide',
    functionDe: 'Verbindung nach außen; Geburtsweg',
    wissen: 'Die Scheide verbindet Gebärmutter und Außenwelt und ist Geburtsweg.',
    concept: 'bio:k5:saeuger:fp-mensch:scheide',
  },
] as const

const MALE_SLOTS = [
  {
    id: 'hoden',
    x: 13.8,
    y: 75,
    targetX: 30,
    targetY: 75,
    label: 'Hoden',
    functionDe: 'Bildet Spermien und Hormone',
    wissen: 'In den Hoden entstehen Spermien; Hormone steuern u. a. die Pubertät.',
    concept: 'bio:k5:saeuger:fp-mensch:hoden',
  },
  {
    id: 'samenleiter',
    x: 13.8,
    y: 53.1,
    targetX: 35,
    targetY: 48,
    label: 'Samenleiter',
    functionDe: 'Transport der Spermien',
    wissen: 'Der Samenleiter leitet Spermien aus dem Hoden weiter.',
    concept: 'bio:k5:saeuger:fp-mensch:samenleiter',
  },
  {
    id: 'prostata',
    x: 50,
    y: 12.5,
    targetX: 50,
    targetY: 40,
    label: 'Vorsteherdrüse',
    functionDe: 'Bildet einen Teil der Samenflüssigkeit',
    wissen: 'Die Vorsteherdrüse (Prostata) trägt zur Samenflüssigkeit bei.',
    concept: 'bio:k5:saeuger:fp-mensch:prostata',
  },
  {
    id: 'penis',
    x: 86.3,
    y: 62.5,
    targetX: 50,
    targetY: 62,
    label: 'Penis',
    functionDe: 'Begattungsorgan; Harn- und Samenweg',
    wissen: 'Über den Penis verlassen Harn und Samen den Körper.',
    concept: 'bio:k5:saeuger:fp-mensch:penis',
  },
] as const

function femaleLabel(rng: Rng) {
  const distractors = shuffle(rng, ['Kiemendeckel', 'Federfahne', 'Schwanzflosse']).slice(0, 2)
  const labels = [...FEMALE_SLOTS.map((s) => s.label), ...distractors]
  return imageLabelSlotsTask({
    question:
      'Beschrifte die weiblichen Geschlechtsorgane. Ziehe die Begriffe in die Felder.',
    imageSrc: FEMALE_REPRO_SRC,
    imageAlt: 'Schema der weiblichen Geschlechtsorgane (unbeschriftet)',
    attribution: FEMALE_REPRO_ATTR,
    drawLeaders: false,
    items: labels.map((label) => ({ label })),
    slots: FEMALE_SLOTS.map(({ id, x, y, targetX, targetY }) => ({
      id,
      x,
      y,
      targetX,
      targetY,
    })),
    correctSlots: FEMALE_SLOTS.map((_, i) => i),
    solution: FEMALE_SLOTS.map((s, i) => `${i + 1}:${s.label}`).join('; '),
    explanation: FEMALE_SLOTS.map((s) => `${s.label}: ${s.wissen}`).join(' '),
    instruction: 'Ziehe die Bezeichnungen in die nummerierten Felder am Schema.',
    fachwissen: bioFw(
      FEMALE_SLOTS.map((s) => `${s.label} — ${s.functionDe}. ${s.wissen}`).join(' '),
      'Wikipedia: Weibliche Geschlechtsorgane',
      'https://de.wikipedia.org/wiki/Weibliche_Geschlechtsorgane',
    ),
    contentIds: FEMALE_SLOTS.map((s) => s.concept),
    dedupeKey: 'imgLabel:female-repro:all',
    rng,
  })
}

function maleLabel(rng: Rng) {
  const distractors = shuffle(rng, ['Federfahne', 'Kiemendeckel', 'Laich']).slice(0, 2)
  const labels = [...MALE_SLOTS.map((s) => s.label), ...distractors]
  return imageLabelSlotsTask({
    question:
      'Beschrifte die männlichen Geschlechtsorgane. Ziehe die Begriffe in die Felder.',
    imageSrc: MALE_REPRO_SRC,
    imageAlt: 'Schema der männlichen Geschlechtsorgane (unbeschriftet)',
    attribution: MALE_REPRO_ATTR,
    drawLeaders: false,
    items: labels.map((label) => ({ label })),
    slots: MALE_SLOTS.map(({ id, x, y, targetX, targetY }) => ({
      id,
      x,
      y,
      targetX,
      targetY,
    })),
    correctSlots: MALE_SLOTS.map((_, i) => i),
    solution: MALE_SLOTS.map((s, i) => `${i + 1}:${s.label}`).join('; '),
    explanation: MALE_SLOTS.map((s) => `${s.label}: ${s.wissen}`).join(' '),
    instruction: 'Ziehe die Bezeichnungen in die nummerierten Felder am Schema.',
    fachwissen: bioFw(
      MALE_SLOTS.map((s) => `${s.label} — ${s.functionDe}. ${s.wissen}`).join(' '),
      'Wikipedia: Männliche Geschlechtsorgane',
      'https://de.wikipedia.org/wiki/M%C3%A4nnliche_Geschlechtsorgane',
    ),
    contentIds: MALE_SLOTS.map((s) => s.concept),
    dedupeKey: 'imgLabel:male-repro:all',
    rng,
  })
}

function organMatch(rng: Rng) {
  return matchTermsTask(rng, {
    question: 'Ordne Geschlechtsorgane und Funktion zu.',
    terms: ['Eierstock', 'Eileiter', 'Gebärmutter', 'Hoden'],
    meanings: [
      'Bildet Eizellen und Hormone',
      'Transport / mögliche Befruchtung',
      'Entwicklung des Embryos',
      'Bildet Spermien und Hormone',
    ],
    distractor: 'Nur Kiemenatmung',
    solution: 'Eierstock / Eileiter / Gebärmutter / Hoden',
    explanation: 'Weibliche und männliche Organe haben klar unterscheidbare Funktionen.',
    fachwissen: bioFw(
      'Geschlechtsorgane produzieren Keimzellen und Hormone und ermöglichen Befruchtung und Entwicklung — beim Menschen innere Befruchtung und lebendgebärend.',
      'Wikipedia: Geschlechtsorgan',
      'https://de.wikipedia.org/wiki/Geschlechtsorgan',
    ),
    dedupeKey: 'bio:k5:saeuger:fp-mensch:organ-match',
    contentIds: [
      'bio:k5:saeuger:fp-mensch:eierstock',
      'bio:k5:saeuger:fp-mensch:eileiter',
      'bio:k5:saeuger:fp-mensch:gebaermutter',
      'bio:k5:saeuger:fp-mensch:hoden',
    ],
  })
}

function pubertyMc(rng: Rng) {
  const items = [
    {
      q: 'Was bedeutet Pubertät?',
      correct: 'Übergang zur Geschlechtsreife mit körperlichen und hormonalen Veränderungen',
      wrong: [
        'Nur der Winterschlaf der Säuger',
        'Nur die Metamorphose der Kaulquappe',
        'Nur das Abwerfen des Geweihs',
      ],
      concept: 'bio:k5:saeuger:fp-mensch:mc-pubertaet',
    },
    {
      q: 'Was ist die Menstruation?',
      correct: 'Periodische Abstoßung der Gebärmutterschleimhaut, wenn keine Schwangerschaft eintritt',
      wrong: [
        'Nur das Atmen mit Kiemen',
        'Nur das Mausern der Federn',
        'Nur die äußere Befruchtung im Teich',
      ],
      concept: 'bio:k5:saeuger:fp-mensch:mc-menstruation',
    },
    {
      q: 'Was bezeichnet Pollution (im Jugendalter)?',
      correct: 'Unwillkürlicher Samenerguss, oft nachts in der Pubertät',
      wrong: [
        'Nur die Eiablage der Vögel',
        'Nur das Laichen der Fische',
        'Nur das Häuten der Schlangen',
      ],
      concept: 'bio:k5:saeuger:fp-mensch:mc-pollution',
    },
    {
      q: 'Welche Hormone steuern u. a. die Pubertät?',
      correct: 'Geschlechtshormone aus Hoden bzw. Eierstöcken (gesteuert über die Hypophyse)',
      wrong: [
        'Nur Blattgrün der Pflanzen',
        'Nur Kiemenschleim der Fische',
        'Nur Federwachs der Vögel',
      ],
      concept: 'bio:k5:saeuger:fp-mensch:mc-hormone',
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
      'Pubertät, Menstruationszyklus und Pollution gehören zu den entwicklungsbedingten Veränderungen der menschlichen Fortpflanzung — sachlich und respektvoll zu besprechen.',
      'Wikipedia: Pubertät',
      'https://de.wikipedia.org/wiki/Pubert%C3%A4t',
    ),
    dedupeKey: it.concept,
    contentIds: [it.concept],
  })
}

function parentChildTf(rng: Rng) {
  const items = [
    {
      statement: 'Eltern-Kind-Beziehungen bei Säugern umfassen oft längere Fürsorge und Lernen.',
      correct: true,
      explanation: 'Viele Säuger investieren in Aufzucht und Bindung.',
      concept: 'bio:k5:saeuger:fp-mensch:tf-fuersorge',
    },
    {
      statement: 'Beim Menschen endet jede Eltern-Kind-Beziehung sofort nach der Geburt ohne Fürsorge.',
      correct: false,
      explanation: 'Menschenkinder brauchen lange Pflege, Ernährung und soziale Bindung.',
      concept: 'bio:k5:saeuger:fp-mensch:tf-pflege',
    },
    {
      statement: 'Säugen mit Milch ist ein Kennzeichen der Säugetiere und stärkt die Eltern-Kind-Bindung.',
      correct: true,
      explanation: 'Milchernährung ist namensgebend und versorgt das Jungtier.',
      concept: 'bio:k5:saeuger:fp-mensch:tf-saeugen',
    },
  ]
  const it = pick(rng, items)
  return trueFalse(rng, {
    statement: it.statement,
    correct: it.correct,
    explanation: it.explanation,
    fachwissen: bioFw(
      'Säuger-Fürsorge: Milchernährung und oft längere Eltern-Kind-Bindung sichern Überleben und Lernen — beim Menschen besonders ausgeprägt.',
      'Wikipedia: Brutpflege',
      'https://de.wikipedia.org/wiki/Brutpflege',
    ),
    dedupeKey: it.concept,
    contentIds: [it.concept],
  })
}

function cycleCloze(rng: Rng) {
  const variants = [
    {
      template: 'In der ___ werden Eizellen gebildet; die ___ bereitet sich auf eine mögliche Schwangerschaft vor.',
      accepted: [
        ['Eierstöcken', 'Eierstock', 'Ovarien'],
        ['Gebärmutter', 'Gebärmutterschleimhaut', 'Uterusschleimhaut'],
      ],
      solution: 'Eierstöcken; Gebärmutter',
      concept: 'bio:k5:saeuger:fp-mensch:cloze-zyklus',
    },
    {
      template: 'Die ___ ist der Übergang zur Geschlechtsreife; die ___ ist die periodische Abstoßung der Schleimhaut.',
      accepted: [
        ['Pubertät', 'Pubertaet'],
        ['Menstruation', 'Regelblutung', 'Periode'],
      ],
      solution: 'Pubertät; Menstruation',
      concept: 'bio:k5:saeuger:fp-mensch:cloze-pub',
    },
    {
      template: 'In den ___ entstehen Spermien; eine ___ kann in der Pubertät nachts auftreten.',
      accepted: [
        ['Hoden', 'Hodens'],
        ['Pollution', 'Samenerguss', 'unwillkürlicher Samenerguss'],
      ],
      solution: 'Hoden; Pollution',
      concept: 'bio:k5:saeuger:fp-mensch:cloze-pollution',
    },
  ]
  const v = pick(rng, variants)
  return clozeBlanksTask({
    question: 'Ergänze zum Fortpflanzungssystem des Menschen.',
    template: v.template,
    accepted: v.accepted,
    solution: v.solution,
    explanation: 'Organe und Entwicklung hängen zusammen.',
    fachwissen: bioFw(
      'Weiblicher Zyklus und männliche Keimzellenbildung gehören zur menschlichen Fortpflanzung; Pubertät bringt hormonelle Umstellung.',
      'Wikipedia: Menstruationszyklus',
      'https://de.wikipedia.org/wiki/Menstruationszyklus',
    ),
    dedupeKey: v.concept,
    contentIds: [v.concept],
  })
}

function parentMulti(rng: Rng) {
  return multiSelectTask({
    question: 'Was gehört zu Eltern-Kind-Beziehungen beim Menschen?',
    choices: shuffle(rng, [
      'Lange Pflege und Ernährung',
      'Soziale Bindung und Lernen',
      'Schutz und Zuwendung',
      'Sofortiges Verlassen ohne Fürsorge wie bei vielen Fischen',
      'Nur Kiemenatmung der Eltern',
    ]),
    correct: [
      'Lange Pflege und Ernährung',
      'Soziale Bindung und Lernen',
      'Schutz und Zuwendung',
    ],
    solution: 'Pflege, Bindung, Schutz',
    explanation: 'Menschenkinder brauchen lange Fürsorge.',
    fachwissen: bioFw(
      'Beim Menschen dauert die Abhängigkeit besonders lange — Ernährung, Schutz und soziales Lernen sind zentral.',
      'Wikipedia: Eltern-Kind-Beziehung',
      'https://de.wikipedia.org/wiki/Eltern-Kind-Beziehung',
    ),
    dedupeKey: 'bio:k5:saeuger:fp-mensch:multi-eltern',
    contentIds: ['bio:k5:saeuger:fp-mensch:multi-eltern'],
  })
}

/** Thema: Fortpflanzung Mensch — freigeben nach Bild+Blöcke und Themenabdeckung. */
export const biSaeugerFortpflanzungMensch: Topic['generate'] = mixedVariants(
  femaleLabel,
  maleLabel,
  femaleLabel,
  maleLabel,
  organMatch,
  pubertyMc,
  pubertyMc,
  parentChildTf,
  cycleCloze,
  parentMulti,
  organMatch,
)
