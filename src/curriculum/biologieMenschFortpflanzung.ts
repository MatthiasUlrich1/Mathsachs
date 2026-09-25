/**
 * K5 LB6 — Säugetiere Fortpflanzung / Mensch (released:false).
 * Aufbau/Funktion Geschlechtsorgane, Pubertät, Menstruation, Pollution, Eltern-Kind.
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
} from './taskHelpers'
import type { Topic } from './types'

/** Schema weibliche Geschlechtsorgane (unbeschriftet) — Originalschema für Unterricht. */
const FEMALE_REPRO_SRC = '/anatomy/female-reproductive-unlabeled.svg'
const FEMALE_REPRO_ATTR =
  'TaskTrophy / Mathsachs: Originales Unterrichtsschema „Weibliche Geschlechtsorgane (unbeschriftet)“ — Public Domain (CC0) für Bildungszwecke.'

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
    instruction: 'Ziehe die Bezeichnungen in die Felder am Schema.',
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
  ]
  const v = pick(rng, variants)
  return clozeBlanksTask({
    question: 'Ergänze zum Fortpflanzungssystem des Menschen.',
    template: v.template,
    accepted: v.accepted,
    solution: v.solution,
    explanation: 'Organe und Zyklus hängen zusammen.',
    fachwissen: bioFw(
      'Weiblicher Zyklus: Heranreifen der Eizelle, Aufbau der Gebärmutterschleimhaut; ohne Schwangerschaft folgt die Menstruation.',
      'Wikipedia: Menstruationszyklus',
      'https://de.wikipedia.org/wiki/Menstruationszyklus',
    ),
    dedupeKey: v.concept,
    contentIds: [v.concept],
  })
}

/** Thema: Fortpflanzung Mensch — locked until content review complete. */
export const biSaeugerFortpflanzungMensch: Topic['generate'] = mixedVariants(
  femaleLabel,
  femaleLabel,
  organMatch,
  pubertyMc,
  pubertyMc,
  parentChildTf,
  cycleCloze,
  organMatch,
)
