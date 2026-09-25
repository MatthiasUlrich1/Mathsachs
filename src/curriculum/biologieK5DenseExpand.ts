/**
 * K5 Freigabeliste — dichte Banken für noch gesperrte Themen + Mensch-Fortpflanzung.
 * Originales Deutsch; concept-ids themenspezifisch (keine Sibling-Kollisionen).
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

const near = (a: string, b: string) => {
  if (a === b) return true
  if (Math.abs(a.length - b.length) > 2) return false
  let diff = 0
  const n = Math.max(a.length, b.length)
  for (let i = 0; i < n; i++) {
    if (a[i] !== b[i]) diff++
    if (diff > 1) return false
  }
  return diff <= 1
}

// ─── Lurche Metamorphose (min. 7–10) ─────────────────────────────────────────

function lurcheMetaExtra(rng: Rng): Task {
  const pool = [
    () =>
      matchTermsTask(rng, {
        question: 'Ordne Phasen der Metamorphose zu.',
        terms: ['Laich', 'Kaulquappe', 'Metamorphose', 'Adulttier'],
        meanings: [
          'Eigelege im Wasser',
          'Wasserlebende Larve mit Kiemen',
          'Umwandlung Larve → Landform',
          'Landlebendes ausgewachsenes Tier',
        ],
        distractor: 'Federkleid der Vögel',
        solution: 'Laich / Kaulquappe / Metamorphose / Adulttier',
        explanation: 'Die Metamorphose verbindet Wasserlarve und landlebendes Adulttier.',
        fachwissen: bioFw(
          'Metamorphose der Froschlurche: Aus dem Laich entsteht die Kaulquappe (Kiemen). Später wachsen Beine, die Kiemen werden ersetzt, und das Adulttier lebt oft an Land.',
          'Wikipedia: Amphibien',
          'https://de.wikipedia.org/wiki/Amphibien',
        ),
        dedupeKey: 'bio:k5:lurch:meta:match-phasen',
        contentIds: [
          'bio:k5:lurch:meta:laich',
          'bio:k5:lurch:meta:kaulquappe',
          'bio:k5:lurch:meta:umwandlung',
          'bio:k5:lurch:meta:adult',
        ],
      }),
    () =>
      clozeBlanksTask({
        question: 'Ergänze den Lückentext zur Metamorphose.',
        template: 'Die ___ atmet zuerst mit ___; später übernimmt die ___ und Beine wachsen.',
        accepted: [
          ['Kaulquappe', 'Larve'],
          ['Kiemen', 'Kieme'],
          ['Lunge', 'Lungenatmung'],
        ],
        solution: 'Kaulquappe; Kiemen; Lunge',
        explanation: 'Atmung und Fortbewegung ändern sich während der Metamorphose.',
        fachwissen: bioFw(
          'In der Metamorphose wechseln viele Lurche von Kiemen- zu Lungen-/Hautatmung und von Schwimmen zu Landbewegung.',
          'Wikipedia: Metamorphose (Zoologie)',
          'https://de.wikipedia.org/wiki/Metamorphose_(Zoologie)',
        ),
        dedupeKey: 'bio:k5:lurch:meta:cloze-atmung',
        contentIds: ['bio:k5:lurch:meta:cloze-atmung'],
      }),
    () => {
      const items = [
        {
          q: 'Wozu dient die Metamorphose bei vielen Lurchen?',
          correct: 'Sie ermöglicht den Wechsel vom Wasser- zum Landleben',
          wrong: [
            'Sie erzeugt Federn für den Flug',
            'Sie ersetzt das Gebiss durch Schuppen',
            'Sie macht alle Lurche gleichwarm',
          ],
          concept: 'bio:k5:lurch:meta:mc-zweck',
        },
        {
          q: 'Welches Organ ersetzt bei vielen Kaulquappen später die Kiemen?',
          correct: 'Die Lunge (oft ergänzt durch Hautatmung)',
          wrong: [
            'Nur die Schwimmblase der Knochenfische',
            'Nur Federfahnen',
            'Nur der Kiemendeckel der Adulttiere',
          ],
          concept: 'bio:k5:lurch:meta:mc-organe',
        },
        {
          q: 'Wann verlässt typischerweise der Froschlurch das reine Wasserleben?',
          correct: 'Nach Abschluss der Metamorphose als Adulttier',
          wrong: [
            'Schon als unbefruchteter Laich an Land',
            'Nur im Winterschlaf unter Eis',
            'Nie — alle Lurche bleiben dauerhaft im Salzwasser',
          ],
          concept: 'bio:k5:lurch:meta:mc-zeitpunkt',
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
          'Metamorphose ist der Gestaltwechsel, der Wasserlarve und landtaugliches Adulttier verbindet — zentral für Angepasstheit und Lebenszyklus der Lurche.',
          'Wikipedia: Amphibien',
          'https://de.wikipedia.org/wiki/Amphibien',
        ),
        dedupeKey: it.concept,
        contentIds: [it.concept],
      })
    },
    () =>
      trueFalse(rng, {
        statement: 'Kaulquappen vieler Froschlurche atmen zuerst mit Kiemen.',
        correct: true,
        explanation: 'Die wasserlebende Larve nutzt Kiemen; später folgt die Umstellung.',
        fachwissen: bioFw(
          'Larvale Kiemenatmung und spätere Lungen-/Hautatmung kennzeichnen den typischen Metamorphoseweg vieler Froschlurche.',
          'Wikipedia: Kaulquappe',
          'https://de.wikipedia.org/wiki/Kaulquappe',
        ),
        dedupeKey: 'bio:k5:lurch:meta:tf-kiemen',
        contentIds: ['bio:k5:lurch:meta:tf-kiemen'],
      }),
    () =>
      trueFalse(rng, {
        statement: 'Metamorphose bedeutet bei Lurchen denselben Körperbau von Anfang an ohne Umwandlung.',
        correct: false,
        explanation: 'Gerade der Gestaltwechsel von Larve zu Adulttier ist die Metamorphose.',
        fachwissen: bioFw(
          'Ohne Metamorphose bliebe die wasserlebende Larvenform — der Wechsel ist das Kennzeichen vieler Amphibienlebenszyklen.',
          'Wikipedia: Metamorphose (Zoologie)',
          'https://de.wikipedia.org/wiki/Metamorphose_(Zoologie)',
        ),
        dedupeKey: 'bio:k5:lurch:meta:tf-keinwechsel',
        contentIds: ['bio:k5:lurch:meta:tf-keinwechsel'],
      }),
    () =>
      multiSelectTask({
        question: 'Welche Veränderungen gehören typisch zur Froschlurch-Metamorphose?',
        choices: shuffle(rng, [
          'Beine wachsen',
          'Kiemen werden rückgebildet',
          'Schwanz der Kaulquappe wird rückgebildet',
          'Es wachsen Federn wie bei Vögeln',
          'Es entsteht eine Schwimmblase wie bei Knochenfischen',
        ]),
        correct: [
          'Beine wachsen',
          'Kiemen werden rückgebildet',
          'Schwanz der Kaulquappe wird rückgebildet',
        ],
        solution: 'Beine, Kiemenrückbildung, Schwanzrückbildung',
        explanation: 'Körperbau und Atmung werden an das Landleben angepasst.',
        fachwissen: bioFw(
          'Typische Umbauten: Gliedmaßen, Atmungsorgane, Rückbildung larvaler Strukturen (z. B. Schwanz bei Froschlurchen).',
          'Wikipedia: Kaulquappe',
          'https://de.wikipedia.org/wiki/Kaulquappe',
        ),
        dedupeKey: 'bio:k5:lurch:meta:multi-umbau',
        contentIds: ['bio:k5:lurch:meta:multi-umbau'],
      }),
  ]
  return pick(rng, pool)()
}

export function buildLurcheMetaDense(base: Topic['generate']): Topic['generate'] {
  return mixedVariants(
    lurcheMetaExtra,
    lurcheMetaExtra,
    lurcheMetaExtra,
    lurcheMetaExtra,
    base,
    base,
  )
}

// ─── Lurche Lebensraum/Schutz ────────────────────────────────────────────────

function lurcheSchutzExtra(rng: Rng): Task {
  const pool = [
    () =>
      matchTermsTask(rng, {
        question: 'Ordne Schutz und Lebensraum der Lurche zu.',
        terms: ['Laichgewässer', 'Wanderung', 'Amphibienschutzzaun', 'Feuchte Haut'],
        meanings: [
          'Ort für Eiablage und frühe Entwicklung',
          'Zug zwischen Winter- und Laichquartier',
          'Hilft, Tiere vor dem Straßenverkehr zu schützen',
          'Braucht Feuchtigkeit — Gefahr bei Austrocknung',
        ],
        distractor: 'Nur Salzwasser ohne Feuchte',
        solution: 'Laichgewässer / Wanderung / Schutzzaun / feuchte Haut',
        explanation: 'Schutz beginnt bei Lebensräumen und sicheren Wanderwegen.',
        fachwissen: bioFw(
          'Lurche brauchen geeignete Laichgewässer und feuchte Lebensräume. Straßen und Lebensraumverlust gefährden Wanderungen — Amphibienschutzmaßnahmen helfen.',
          'Wikipedia: Amphibienschutz',
          'https://de.wikipedia.org/wiki/Amphibienschutz',
        ),
        dedupeKey: 'bio:k5:lurch:schutz:match',
        contentIds: [
          'bio:k5:lurch:schutz:gewaesser',
          'bio:k5:lurch:schutz:wanderung',
          'bio:k5:lurch:schutz:zaun',
          'bio:k5:lurch:schutz:haut',
        ],
      }),
    () =>
      choicePickTask({
        question: 'Was gefährdet heimische Lurche besonders?',
        choices: shuffleChoices(
          rng,
          [
            'Zerstörung von Feuchtgebieten und sicheren Wanderwegen',
            'Zu viele Luftsäcke in der Lunge',
            'Zu viele Federn im Federkleid',
            'Zu harte Kalkschalen der Eier an Land',
          ],
          'Zerstörung von Feuchtgebieten und sicheren Wanderwegen',
        ),
        correct: 'Zerstörung von Feuchtgebieten und sicheren Wanderwegen',
        solution: 'Zerstörung von Feuchtgebieten und sicheren Wanderwegen',
        explanation: 'Ohne Feuchtlebensraum und sichere Wege bricht der Lebenszyklus.',
        fachwissen: bioFw(
          'Gefährdung: Trockenlegung, Bebauung, Verkehr und Schadstoffe treffen besonders feuchtigkeitsgebundene Arten.',
          'Wikipedia: Amphibienschutz',
          'https://de.wikipedia.org/wiki/Amphibienschutz',
        ),
        dedupeKey: 'bio:k5:lurch:schutz:mc-gefahr',
        contentIds: ['bio:k5:lurch:schutz:mc-gefahr'],
      }),
    () =>
      choicePickTask({
        question: 'Welche Maßnahme schützt wandernde Lurche an Straßen?',
        choices: shuffleChoices(
          rng,
          [
            'Amphibienschutzzäune und Querungshilfen',
            'Dauerhafte Austrocknung aller Tümpel',
            'Giftköder entlang der Wanderroute',
            'Entfernen aller Laichgewässer',
          ],
          'Amphibienschutzzäune und Querungshilfen',
        ),
        correct: 'Amphibienschutzzäune und Querungshilfen',
        solution: 'Amphibienschutzzäune und Querungshilfen',
        explanation: 'Zäune leiten Tiere zu sicheren Übergängen.',
        fachwissen: bioFw(
          'Temporäre oder feste Leiteinrichtungen und Durchlässe reduzieren Straßenopfer während der Laichwanderung.',
          'Wikipedia: Amphibienschutz',
          'https://de.wikipedia.org/wiki/Amphibienschutz',
        ),
        dedupeKey: 'bio:k5:lurch:schutz:mc-zaun',
        contentIds: ['bio:k5:lurch:schutz:mc-zaun'],
      }),
    () =>
      trueFalse(rng, {
        statement: 'Viele Lurche wandern im Frühjahr zu Laichgewässern.',
        correct: true,
        explanation: 'Die Laichwanderung ist typisch und schutzrelevant.',
        fachwissen: bioFw(
          'Laichwanderung: Adulttiere suchen Gewässer auf; dabei sind sie besonders durch Verkehr gefährdet.',
          'Wikipedia: Amphibien',
          'https://de.wikipedia.org/wiki/Amphibien',
        ),
        dedupeKey: 'bio:k5:lurch:schutz:tf-wanderung',
        contentIds: ['bio:k5:lurch:schutz:tf-wanderung'],
      }),
    () =>
      clozeBlanksTask({
        question: 'Ergänze zum Lebensraum der Lurche.',
        template: 'Viele Lurche brauchen ___ Lebensräume und geeignete ___.',
        accepted: [
          ['feuchte', 'feucht', 'nasse'],
          ['Laichgewässer', 'Tümpel', 'Teiche', 'Gewässer'],
        ],
        solution: 'feuchte; Laichgewässer',
        explanation: 'Feuchte und Gewässerbindung bestimmen den Lebensraum.',
        fachwissen: bioFw(
          'Feuchtlebensräume und Laichgewässer sind Schlüsselstrukturen für Bestand und Fortpflanzung der Lurche.',
          'Wikipedia: Amphibien',
          'https://de.wikipedia.org/wiki/Amphibien',
        ),
        dedupeKey: 'bio:k5:lurch:schutz:cloze-feucht',
        contentIds: ['bio:k5:lurch:schutz:cloze-feucht'],
      }),
    () =>
      multiSelectTask({
        question: 'Welche Maßnahmen schützen Lurche?',
        choices: shuffle(rng, [
          'Feuchtgebiete erhalten',
          'Laichgewässer nicht zuschütten',
          'Wanderwege sichern',
          'Alle Tümpel mit Beton versiegeln',
          'Flächig Gift im Ufer ausbringen',
        ]),
        correct: [
          'Feuchtgebiete erhalten',
          'Laichgewässer nicht zuschütten',
          'Wanderwege sichern',
        ],
        solution: 'Feuchtgebiete, Laichgewässer, Wanderwege',
        explanation: 'Schutz = Lebensraum + sichere Wege.',
        fachwissen: bioFw(
          'Praktischer Amphibienschutz verbindet Biotopschutz, Gewässerschutz und Verkehrsberuhigung an Wanderkorridoren.',
          'Wikipedia: Amphibienschutz',
          'https://de.wikipedia.org/wiki/Amphibienschutz',
        ),
        dedupeKey: 'bio:k5:lurch:schutz:multi',
        contentIds: ['bio:k5:lurch:schutz:multi'],
      }),
  ]
  return pick(rng, pool)()
}

export function buildLurcheSchutzDense(base: Topic['generate']): Topic['generate'] {
  return mixedVariants(
    lurcheSchutzExtra,
    lurcheSchutzExtra,
    lurcheSchutzExtra,
    lurcheSchutzExtra,
    base,
    base,
  )
}

// ─── Vögel Fortpflanzung (min. 10–15) ────────────────────────────────────────

function voegelFpExtra(rng: Rng): Task {
  const pool = [
    () =>
      matchTermsTask(rng, {
        question: 'Ordne Begriffe zur Vogel-Fortpflanzung zu.',
        terms: ['Innere Befruchtung', 'Gelege', 'Nesthocker', 'Nestflüchter'],
        meanings: [
          'Befruchtung im Körper des Weibchens',
          'Anzahl der Eier im Nest',
          'Jungvogel lange hilflos im Nest',
          'Jungvogel bald aktiv außerhalb des Nests',
        ],
        distractor: 'Äußere Befruchtung wie bei vielen Knochenfischen',
        solution: 'Innere Befruchtung / Gelege / Nesthocker / Nestflüchter',
        explanation: 'Vögel: innere Befruchtung, Nest, unterschiedliche Selbstständigkeit der Jungen.',
        fachwissen: bioFw(
          'Fortpflanzung der Vögel: innere Befruchtung, Schalenei, Nestbau und Brutpflege — Nesthocker vs. Nestflüchter beschreibt den Entwicklungsgrad der Jungen.',
          'Wikipedia: Vögel',
          'https://de.wikipedia.org/wiki/V%C3%B6gel',
        ),
        dedupeKey: 'bio:k5:vogel:fp:match-extra',
        contentIds: [
          'bio:k5:vogel:fp:x-innere',
          'bio:k5:vogel:fp:x-gelege',
          'bio:k5:vogel:fp:x-nesthocker',
          'bio:k5:vogel:fp:x-nestfluechter',
        ],
      }),
    () =>
      clozeBlanksTask({
        question: 'Ergänze zur Brutpflege der Vögel.',
        template: 'Nach der ___ Befruchtung legen Vögel ___ mit Schale; oft folgt das ___.',
        accepted: [
          ['inneren', 'innere', 'innerlich'],
          ['Eier', 'Gelege'],
          ['Bebrüten', 'Brüten', 'Brut'],
        ],
        solution: 'inneren; Eier; Bebrüten',
        explanation: 'Innere Befruchtung, Schalenei und Bebrüten kennzeichnen viele Arten.',
        fachwissen: bioFw(
          'Schaleneier schützen den Embryo an Land; Bebrüten hält die nötige Temperatur für die Entwicklung.',
          'Wikipedia: Vogelei',
          'https://de.wikipedia.org/wiki/Vogelei',
        ),
        dedupeKey: 'bio:k5:vogel:fp:cloze-brut',
        contentIds: ['bio:k5:vogel:fp:cloze-brut'],
      }),
    () =>
      choicePickTask({
        question: 'Was kennzeichnet Nestflüchter?',
        choices: shuffleChoices(
          rng,
          [
            'Jungvögel sind bald nach dem Schlupf relativ selbstständig',
            'Jungvögel bleiben immer flugunfähig im Nest ohne Eltern',
            'Es gibt nie ein Nest',
            'Befruchtung erfolgt nur im offenen Wasser',
          ],
          'Jungvögel sind bald nach dem Schlupf relativ selbstständig',
        ),
        correct: 'Jungvögel sind bald nach dem Schlupf relativ selbstständig',
        solution: 'Jungvögel sind bald nach dem Schlupf relativ selbstständig',
        explanation: 'Nestflüchter verlassen das Nest früh und folgen oft den Eltern.',
        fachwissen: bioFw(
          'Nestflüchter schlüpfen weiter entwickelt (oft befedert, lauffähig); Nesthocker brauchen längere Nestpflege und Fütterung.',
          'Wikipedia: Nestflüchter',
          'https://de.wikipedia.org/wiki/Nestfl%C3%BCchter',
        ),
        dedupeKey: 'bio:k5:vogel:fp:mc-nestfluechter',
        contentIds: ['bio:k5:vogel:fp:mc-nestfluechter'],
      }),
    () =>
      choicePickTask({
        question: 'Warum brüten viele Vögel ihre Eier?',
        choices: shuffleChoices(
          rng,
          [
            'Um die für die Entwicklung nötige Wärme zu sichern',
            'Um Kiemen der Eier zu belüften',
            'Um Laich im Wasser zu kühlen',
            'Um Schwimmblasen zu füllen',
          ],
          'Um die für die Entwicklung nötige Wärme zu sichern',
        ),
        correct: 'Um die für die Entwicklung nötige Wärme zu sichern',
        solution: 'Um die für die Entwicklung nötige Wärme zu sichern',
        explanation: 'Bebrüten hält die Temperatur im Ei.',
        fachwissen: bioFw(
          'Brüten: Körperwärme der Eltern treibt die Embryonalentwicklung im Schalenei voran.',
          'Wikipedia: Brutpflege',
          'https://de.wikipedia.org/wiki/Brutpflege',
        ),
        dedupeKey: 'bio:k5:vogel:fp:mc-brueten',
        contentIds: ['bio:k5:vogel:fp:mc-brueten'],
      }),
    () =>
      trueFalse(rng, {
        statement: 'Nesthocker brauchen nach dem Schlupf oft längere Fütterung im Nest.',
        correct: true,
        explanation: 'Sie sind anfangs hilflos und auf die Eltern angewiesen.',
        fachwissen: bioFw(
          'Nesthocker schlüpfen unvollständig entwickelt — Brutpflege und Fütterung sind entscheidend.',
          'Wikipedia: Nesthocker',
          'https://de.wikipedia.org/wiki/Nesthocker',
        ),
        dedupeKey: 'bio:k5:vogel:fp:tf-nesthocker',
        contentIds: ['bio:k5:vogel:fp:tf-nesthocker'],
      }),
    () =>
      trueFalse(rng, {
        statement: 'Alle Vogelarten legen ihre Eier ohne Nest direkt ins offene Meerwasser.',
        correct: false,
        explanation: 'Die meisten brüten an Land / im Nest; Wasservögel nutzen Nester an Land oder schwimmend.',
        fachwissen: bioFw(
          'Nester variieren stark (Boden, Baum, Fels, Schwimmnest) — typisch ist aber ein geschützter Ablageort, nicht „frei im Meerwasser“.',
          'Wikipedia: Nest',
          'https://de.wikipedia.org/wiki/Nest',
        ),
        dedupeKey: 'bio:k5:vogel:fp:tf-meer',
        contentIds: ['bio:k5:vogel:fp:tf-meer'],
      }),
    () =>
      sortChronologyTask(rng, {
        question: 'Ordne: Paarbildung bis flügger Jungvogel.',
        labels: [
          'Paarbildung / Balz',
          'Eiablage',
          'Bebrüten',
          'Füttern der Jungen',
        ],
        solution: 'Balz → Eiablage → Bebrüten → Füttern',
        explanation: 'Nach Balz und Gelege folgen Bebrüten und oft Fütterung.',
        fachwissen: bioFw(
          'Brutzyklus: Balz, Eiablage, Bebrüten, Aufzucht — Dauer und Intensität der Pflege sind artabhängig.',
          'Wikipedia: Brutpflege',
          'https://de.wikipedia.org/wiki/Brutpflege',
        ),
        dedupeKey: 'bio:k5:vogel:fp:sort-zyklus',
        contentIds: ['bio:k5:vogel:fp:sort-zyklus'],
      }),
    () =>
      multiSelectTask({
        question: 'Welche Aussagen zur Vogel-Fortpflanzung stimmen?',
        choices: shuffle(rng, [
          'Innere Befruchtung ist typisch',
          'Eier haben eine Schale',
          'Es gibt Nesthocker und Nestflüchter',
          'Alle Jungvögel atmen zuerst nur mit Kiemen',
          'Befruchtung erfolgt immer außerhalb im Teich',
        ]),
        correct: [
          'Innere Befruchtung ist typisch',
          'Eier haben eine Schale',
          'Es gibt Nesthocker und Nestflüchter',
        ],
        solution: 'Innere Befruchtung, Schalenei, Nesttypen',
        explanation: 'Kernmerkmale der Fortpflanzung und Brutpflege.',
        fachwissen: bioFw(
          'Vergleich: Vögel — innere Befruchtung und Schalenei; viele Fische — äußere Befruchtung im Wasser.',
          'Wikipedia: Vögel',
          'https://de.wikipedia.org/wiki/V%C3%B6gel',
        ),
        dedupeKey: 'bio:k5:vogel:fp:multi-kern',
        contentIds: ['bio:k5:vogel:fp:multi-kern'],
      }),
  ]
  return pick(rng, pool)()
}

export function buildVoegelFortpflanzungDense(
  base: Topic['generate'],
): Topic['generate'] {
  return mixedVariants(
    voegelFpExtra,
    voegelFpExtra,
    voegelFpExtra,
    voegelFpExtra,
    voegelFpExtra,
    base,
    base,
  )
}

// ─── Säuger Angepasstheit ────────────────────────────────────────────────────

function saeugerAngepasstExtra(rng: Rng): Task {
  const pool = [
    () =>
      matchTermsTask(rng, {
        question: 'Ordne Angepasstheiten der Säugetiere zu.',
        terms: ['Fell', 'Grabbeine', 'Flughaut', 'Flossen'],
        meanings: [
          'Wärmeschutz und oft Tarnung',
          'Grabende Lebensweise (z. B. Maulwurf)',
          'Flug bei Fledermäusen',
          'Schwimmen (z. B. Robbe, Wal)',
        ],
        distractor: 'Nur Kiemen ohne Lungen',
        solution: 'Fell / Grabbeine / Flughaut / Flossen',
        explanation: 'Körperbau spiegelt den Lebensraum wider.',
        fachwissen: bioFw(
          'Angepasstheit: Extremitäten und Körperbedeckung folgen der Lebensweise — Graben, Fliegen, Schwimmen, Laufen.',
          'Wikipedia: Säugetiere',
          'https://de.wikipedia.org/wiki/S%C3%A4ugetiere',
        ),
        dedupeKey: 'bio:k5:saeuger:angepasst:match',
        contentIds: [
          'bio:k5:saeuger:angepasst:fell',
          'bio:k5:saeuger:angepasst:graben',
          'bio:k5:saeuger:angepasst:flug',
          'bio:k5:saeuger:angepasst:schwimmen',
        ],
      }),
    () =>
      choicePickTask({
        question: 'Welche Angepasstheit passt zur Fledermaus?',
        choices: shuffleChoices(
          rng,
          [
            'Flughaut zwischen den Fingern — aktiver Flug',
            'Nur Kiemenatmung im Süßwasser',
            'Nur Federfahne ohne Haare',
            'Nur äußere Befruchtung im Teich',
          ],
          'Flughaut zwischen den Fingern — aktiver Flug',
        ),
        correct: 'Flughaut zwischen den Fingern — aktiver Flug',
        solution: 'Flughaut zwischen den Fingern — aktiver Flug',
        explanation: 'Fledermäuse sind fliegende Säuger mit Flughaut.',
        fachwissen: bioFw(
          'Fledermäuse: Haare, Säugen, Flughaut — Flug ohne Federn, im Gegensatz zu Vögeln.',
          'Wikipedia: Fledermäuse',
          'https://de.wikipedia.org/wiki/Flederm%C3%A4use',
        ),
        dedupeKey: 'bio:k5:saeuger:angepasst:mc-fledermaus',
        contentIds: ['bio:k5:saeuger:angepasst:mc-fledermaus'],
      }),
    () =>
      choicePickTask({
        question: 'Warum haben Wale Flossen statt Laufbeine?',
        choices: shuffleChoices(
          rng,
          [
            'Angepasstheit an das Schwimmen im Wasser',
            'Weil sie Federn zum Fliegen brauchen',
            'Weil sie Laich im Sand ablegen',
            'Weil sie Kiemen statt Lungen haben',
          ],
          'Angepasstheit an das Schwimmen im Wasser',
        ),
        correct: 'Angepasstheit an das Schwimmen im Wasser',
        solution: 'Angepasstheit an das Schwimmen im Wasser',
        explanation: 'Wale sind Säuger, deren Gliedmaßen zu Flossen umgebaut sind.',
        fachwissen: bioFw(
          'Wale atmen mit Lungen und säugen — die Flossenform ist eine Angepasstheit an das Dauerleben im Wasser.',
          'Wikipedia: Wale',
          'https://de.wikipedia.org/wiki/Wale',
        ),
        dedupeKey: 'bio:k5:saeuger:angepasst:mc-wal',
        contentIds: ['bio:k5:saeuger:angepasst:mc-wal'],
      }),
    () =>
      trueFalse(rng, {
        statement: 'Maulwürfe zeigen Grabbeine als Angepasstheit an unterirdisches Leben.',
        correct: true,
        explanation: 'Kurze, kräftige Vordergliedmaßen dienen dem Graben.',
        fachwissen: bioFw(
          'Grabende Säuger: Körperbau und Extremitäten sind an Tunnelbau und Bodenleben angepasst.',
          'Wikipedia: Maulwürfe',
          'https://de.wikipedia.org/wiki/Maulw%C3%BCrfe',
        ),
        dedupeKey: 'bio:k5:saeuger:angepasst:tf-maulwurf',
        contentIds: ['bio:k5:saeuger:angepasst:tf-maulwurf'],
      }),
    () =>
      clozeBlanksTask({
        question: 'Ergänze zur Angepasstheit.',
        template: 'Das ___ schützt viele Säuger vor Kälte; ___ dienen dem Schwimmen.',
        accepted: [
          ['Fell', 'Haarkleid', 'Haare'],
          ['Flossen', 'Paddel', 'Flossenartige Gliedmaßen'],
        ],
        solution: 'Fell; Flossen',
        explanation: 'Körperbedeckung und Extremitäten folgen dem Lebensraum.',
        fachwissen: bioFw(
          'Fell isoliert; wasserlebende Säuger nutzen umgebaute Gliedmaßen als Flossen.',
          'Wikipedia: Säugetiere',
          'https://de.wikipedia.org/wiki/S%C3%A4ugetiere',
        ),
        dedupeKey: 'bio:k5:saeuger:angepasst:cloze',
        contentIds: ['bio:k5:saeuger:angepasst:cloze'],
      }),
    () =>
      multiSelectTask({
        question: 'Welche Paare „Merkmal → Lebensweise“ passen?',
        choices: shuffle(rng, [
          'Flughaut → Flug (Fledermaus)',
          'Grabbeine → unterirdisch (Maulwurf)',
          'Flossen → Wasserleben (Robbe/Wal)',
          'Federn → Säugerflug',
          'Nur Kiemen → alle Landsäuger',
        ]),
        correct: [
          'Flughaut → Flug (Fledermaus)',
          'Grabbeine → unterirdisch (Maulwurf)',
          'Flossen → Wasserleben (Robbe/Wal)',
        ],
        solution: 'Flughaut/Grabbeine/Flossen',
        explanation: 'Form folgt der Funktion im Lebensraum.',
        fachwissen: bioFw(
          'Vergleichende Betrachtung von Extremitäten zeigt Angepasstheit an Flug, Graben oder Schwimmen bei Säugern.',
          'Wikipedia: Homologie (Biologie)',
          'https://de.wikipedia.org/wiki/Homologie_(Biologie)',
        ),
        dedupeKey: 'bio:k5:saeuger:angepasst:multi',
        contentIds: ['bio:k5:saeuger:angepasst:multi'],
      }),
  ]
  return pick(rng, pool)()
}

export function buildSaeugerAngepasstDense(base: Topic['generate']): Topic['generate'] {
  return mixedVariants(
    saeugerAngepasstExtra,
    saeugerAngepasstExtra,
    saeugerAngepasstExtra,
    saeugerAngepasstExtra,
    base,
    base,
  )
}

// ─── Säuger Gebiss-Typen (noch gesperrt) ─────────────────────────────────────

function gebissTypenExtra(rng: Rng): Task {
  const pool = [
    () =>
      matchTermsTask(rng, {
        question: 'Ordne Gebisstypen der Säugetiere zu.',
        terms: ['Fleischfresser-Gebiss', 'Pflanzenfresser-Gebiss', 'Allesfresser-Gebiss'],
        meanings: [
          'Starke Eckzähne, schneidende Backenzähne',
          'Breite Mahlzähne, oft ohne große Eckzähne',
          'Mischung aus schneidenden und mahlenden Zähnen',
        ],
        distractor: 'Nur Kiemenreusen ohne Zähne',
        solution: 'Fleisch- / Pflanzen- / Allesfresser',
        explanation: 'Zahnform folgt der Nahrung — Angepasstheit.',
        fachwissen: bioFw(
          'Gebisstypen: Carnivoren mit Reißzähnen, Herbivoren mit Mahlflächen, Omnivoren mit Mischgebiss (z. B. Mensch).',
          'Wikipedia: Gebiss',
          'https://de.wikipedia.org/wiki/Gebiss',
        ),
        dedupeKey: 'bio:k5:saeuger:gebiss:typen-match',
        contentIds: [
          'bio:k5:saeuger:gebiss:carnivor',
          'bio:k5:saeuger:gebiss:herbivor',
          'bio:k5:saeuger:gebiss:omnivor',
        ],
      }),
    () =>
      choicePickTask({
        question: 'Welches Merkmal passt typisch zum Fleischfresser-Gebiss?',
        choices: shuffleChoices(
          rng,
          [
            'Lange Eckzähne und schneidende Backenzähne',
            'Nur flache Mahlflächen ohne Eckzähne',
            'Nur Federkiel statt Zähne',
            'Nur Kiemenlamellen',
          ],
          'Lange Eckzähne und schneidende Backenzähne',
        ),
        correct: 'Lange Eckzähne und schneidende Backenzähne',
        solution: 'Lange Eckzähne und schneidende Backenzähne',
        explanation: 'Fleischfresser greifen und zerreißen Beute.',
        fachwissen: bioFw(
          'Carnivoren-Gebiss: Canini zum Festhalten, Carnassialzähne zum Schneiden von Fleisch.',
          'Wikipedia: Reißzahn',
          'https://de.wikipedia.org/wiki/Rei%C3%9Fzahn',
        ),
        dedupeKey: 'bio:k5:saeuger:gebiss:mc-carnivor',
        contentIds: ['bio:k5:saeuger:gebiss:mc-carnivor'],
      }),
    () =>
      choicePickTask({
        question: 'Welches Gebiss passt eher zu Rind oder Pferd?',
        choices: shuffleChoices(
          rng,
          [
            'Pflanzenfresser-Gebiss mit breiten Mahlzähnen',
            'Nur Reißzähne ohne Mahlflächen',
            'Nur Kiemenreusen',
            'Nur Federfahne',
          ],
          'Pflanzenfresser-Gebiss mit breiten Mahlzähnen',
        ),
        correct: 'Pflanzenfresser-Gebiss mit breiten Mahlzähnen',
        solution: 'Pflanzenfresser-Gebiss mit breiten Mahlzähnen',
        explanation: 'Pflanzenkost wird zermahlen.',
        fachwissen: bioFw(
          'Herbivoren nutzen große Kauflächen; Eckzähne fehlen oft oder sind reduziert.',
          'Wikipedia: Pflanzenfresser',
          'https://de.wikipedia.org/wiki/Pflanzenfresser',
        ),
        dedupeKey: 'bio:k5:saeuger:gebiss:mc-herbivor',
        contentIds: ['bio:k5:saeuger:gebiss:mc-herbivor'],
      }),
    () =>
      trueFalse(rng, {
        statement: 'Der Mensch hat ein Allesfresser-Gebiss mit Schneide-, Eck- und Backenzähnen.',
        correct: true,
        explanation: 'Schneiden, Reißen und Mahlen kommen kombiniert vor.',
        fachwissen: bioFw(
          'Menschliches Gebiss: Incisivi, Canini, Prämolaren und Molaren — typisches Omnivoren-Muster.',
          'Wikipedia: Zahnformel',
          'https://de.wikipedia.org/wiki/Zahnformel',
        ),
        dedupeKey: 'bio:k5:saeuger:gebiss:tf-mensch',
        contentIds: ['bio:k5:saeuger:gebiss:tf-mensch'],
      }),
  ]
  return pick(rng, pool)()
}

export function buildSaeugerMerkmaleDense(
  gebissBild: Topic['generate'],
  base: Topic['generate'],
): Topic['generate'] {
  return mixedVariants(
    gebissBild,
    gebissBild,
    gebissTypenExtra,
    gebissTypenExtra,
    base,
    base,
  )
}

// ─── Säuger Schutz: ≥50 Arten, Teilpunkte ────────────────────────────────────

const SAEUGER_50: string[] = [
  'Reh',
  'Fuchs',
  'Igel',
  'Maulwurf',
  'Rothirsch',
  'Wildschwein',
  'Dachs',
  'Feldhase',
  'Eichhörnchen',
  'Zwergfledermaus',
  'Hausmaus',
  'Wanderratte',
  'Biber',
  'Fischotter',
  'Luchs',
  'Wolf',
  'Steinmarder',
  'Waschbär',
  'Hermelin',
  'Mauswiesel',
  'Iltis',
  'Baummarder',
  'Wildkatze',
  'Damhirsch',
  'Mufflon',
  'Gämse',
  'Murmeltier',
  'Feldmaus',
  'Rötelmaus',
  'Schermaus',
  'Bisam',
  'Nutria',
  'Seehund',
  'Kegelrobbe',
  'Braunbär',
  'Elch',
  'Sikahirsch',
  'Marderhund',
  'Goldschakal',
  'Abendsegler',
  'Wasserfledermaus',
  'Großes Mausohr',
  'Siebenschläfer',
  'Gartenschläfer',
  'Haselmaus',
  'Wildkaninchen',
  'Hamster',
  'Schneemaus',
  'Alpenmurmeltier',
  'Ziesel',
  'Wisent',
  'Steinbock',
]

const SAEUGER_ALIAS: Record<string, string> = {
  hirsch: 'rothirsch',
  rehgeiss: 'reh',
  rehbock: 'reh',
  keiler: 'wildschwein',
  hase: 'feldhase',
  maulwuerfe: 'maulwurf',
  fledermaus: 'zwergfledermaus',
  fledermause: 'zwergfledermaus',
  eichhorn: 'eichhoernchen',
  eichhoernchen: 'eichhoernchen',
  maus: 'hausmaus',
  ratte: 'wanderratte',
  otter: 'fischotter',
  marder: 'steinmarder',
  katze: 'wildkatze',
  baer: 'braunbaer',
  braunbaer: 'braunbaer',
  wisents: 'wisent',
  murmeltier: 'alpenmurmeltier',
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

function matchPool(token: string, poolNorm: string[]): string | null {
  if (poolNorm.includes(token)) return token
  const hit = poolNorm.find((p) => near(token, p) || p.startsWith(token) || token.startsWith(p))
  return hit ?? null
}

/** Tippe fünf heimische Säugetiere — Reihenfolge egal, tolerant, Teilpunkte. */
export function saeugerFuenfArten(rng: Rng): Task {
  const sample = shuffle(rng, SAEUGER_50).slice(0, 5)
  const poolNorm = SAEUGER_50.map(norm)
  const grade = (answer: UserInput) => {
    if (answer.kind !== 'value') return { fraction: 0, parts: [] as boolean[] }
    const parts = parseSaeugerList(answer.value)
    const matched: string[] = []
    const flags: boolean[] = []
    for (const p of parts) {
      const m = matchPool(p, poolNorm)
      if (m && !matched.includes(m)) {
        matched.push(m)
        flags.push(true)
      } else {
        flags.push(false)
      }
    }
    // Score against target of 5 unique hits
    const ok = Math.min(5, matched.length)
    return { parts: flags, fraction: ok / 5 }
  }
  return {
    ...textTask({
      question:
        'Nenne fünf heimische Säugetiere (durch Komma getrennt). Reihenfolge ist egal; leichte Tippfehler sind ok. Einzelne richtige Namen geben Teilpunkte.',
      accepted: [sample.join(', ')],
      solution: `z. B. ${sample.join(', ')} (aus dem Pool heimischer Arten)`,
      explanation:
        'Artenkenntnis: Jede korrekte heimische Säugerart zählt; fünf verschiedene aus dem Pool ergeben die volle Punktzahl.',
      fachwissen: bioFw(
        'Vielfalt der Säugetiere: In Mitteleuropa leben u. a. Reh, Fuchs, Igel, Hirsch, Wildschwein, Dachs, Feldhase, Fledermäuse und viele weitere Arten. Artenschutz beginnt mit Kenntnis der heimischen Fauna.',
        'Wikipedia: Säugetiere',
        'https://de.wikipedia.org/wiki/S%C3%A4ugetiere',
      ),
      dedupeKey: 'bio:k5:saeuger:schutz:fuenf-arten',
      contentIds: ['bio:k5:saeuger:schutz:fuenf-arten'],
    }),
    check: (a) => grade(a).fraction >= 1,
    grade,
    sampleAnswer: { kind: 'value' as const, value: sample.join(', ') },
  }
}

function saeugerSchutzExtra(rng: Rng): Task {
  const pool: Array<() => Task> = [
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
        explanation: 'Schutz braucht Lebensraum, sichere Wanderwege und Regeln.',
        fachwissen: bioFw(
          'Säugetierschutz: Biotopverbund, Verkehrsberuhigung an Wanderkorridoren, gesetzlicher Artenschutz.',
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
          'Vielfalt: Räuber, Pflanzenfresser und Allesfresser nehmen unterschiedliche Rollen in Nahrungsnetzen ein.',
          'Wikipedia: Biodiversität',
          'https://de.wikipedia.org/wiki/Biodiversit%C3%A4t',
        ),
        dedupeKey: 'bio:k5:saeuger:schutz:mc-vielfalt',
        contentIds: ['bio:k5:saeuger:schutz:mc-vielfalt'],
      }),
    () => {
      const mammal = pick(rng, SAEUGER_50)
      return choicePickTask({
        question: 'Welches Tier ist ein heimisches Säugetier?',
        choices: shuffleChoices(rng, [mammal, 'Regenwurm', 'Forelle', 'Erdkröte'], mammal),
        correct: mammal,
        solution: mammal,
        explanation: `${mammal} ist ein Säugetier — nicht Wirbelloses, Fisch oder Lurch.`,
        fachwissen: bioFw(
          'Artenkenntnis: Heimische Säuger von anderen Tiergruppen unterscheiden.',
          'Wikipedia: Säugetiere',
          'https://de.wikipedia.org/wiki/S%C3%A4ugetiere',
        ),
        dedupeKey: `bio:k5:saeuger:schutz:mc-art:${norm(mammal)}`,
        contentIds: ['bio:k5:saeuger:schutz:mc-art', `bio:k5:saeuger:art:${norm(mammal)}`],
      })
    },
    () =>
      trueFalse(rng, {
        statement: 'Waschbär und Marderhund kommen in Mitteleuropa vor (teils eingebürgert).',
        correct: true,
        explanation: 'Beide sind hier anzutreffen und zählen zu den Säugern.',
        fachwissen: bioFw(
          'Neozoen wie Waschbär und Marderhund sind Säuger und beeinflussen heimische Ökosysteme — Kenntnis gehört zur Vielfalt.',
          'Wikipedia: Neozoon',
          'https://de.wikipedia.org/wiki/Neozoon',
        ),
        dedupeKey: 'bio:k5:saeuger:schutz:tf-neozoon',
        contentIds: ['bio:k5:saeuger:schutz:tf-neozoon'],
      }),
    () =>
      clozeBlanksTask({
        question: 'Ergänze zum Artenschutz.',
        template: 'Schutz braucht geeignete ___ und sichere ___ an Straßen.',
        accepted: [
          ['Lebensräume', 'Biotope', 'Habitate'],
          ['Querungen', 'Wildbrücken', 'Übergänge', 'Wanderwege'],
        ],
        solution: 'Lebensräume; Querungen',
        explanation: 'Lebensraum und sichere Wege sind zentrale Schutzfaktoren.',
        fachwissen: bioFw(
          'Biotopverbund und Querungshilfen verbinden isolierte Populationen und verringern Verkehrsopfer.',
          'Wikipedia: Biotopverbund',
          'https://de.wikipedia.org/wiki/Biotopverbund',
        ),
        dedupeKey: 'bio:k5:saeuger:schutz:cloze',
        contentIds: ['bio:k5:saeuger:schutz:cloze'],
      }),
  ]
  return pick(rng, pool)()
}

export function buildSaeugerSchutzDense(base: Topic['generate']): Topic['generate'] {
  return mixedVariants(
    saeugerSchutzExtra,
    saeugerSchutzExtra,
    saeugerFuenfArten,
    saeugerSchutzExtra,
    base,
    base,
  )
}

/** Export pool size for tests. */
export const SAEUGER_POOL_SIZE = SAEUGER_50.length
