/**
 * Feldlinien (E/B) — grafisch + Anwendung, kein Definitions-Fließband.
 * Topics: ph-j11lk-lb7-linien, ph-j11lk-lb8-linien
 */
import type { Rng } from '../lib/rng'
import { pick, shuffle } from './biologieHelpers'
import {
  choicePickTask,
  mixedVariants,
  multiSelectTask,
  valueTask,
} from './taskHelpers'
import type { Topic } from './types'

const Q = 'Lehrplan Physik Sachsen — elektrische/magnetische Felder'
const U = 'https://www.schulportal.sachsen.de/lplandb/'
const fw = (text: string) => ({ text, quelle: Q, url: U })

function shuffleChoices(rng: Rng, choices: string[], correct: string): string[] {
  return shuffle(rng, [correct, ...choices.filter((c) => c !== correct)].slice(0, 4))
}

/** SVG: positive Punktladung — Feldlinien radial nach außen. */
function svgPunktPlus(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" role="img" aria-label="Feldlinien einer positiven Punktladung">
  <rect width="200" height="160" fill="#f7fafc"/>
  ${[0, 45, 90, 135, 180, 225, 270, 315]
    .map((a) => {
      const rad = (a * Math.PI) / 180
      const x2 = 100 + 70 * Math.cos(rad)
      const y2 = 80 + 70 * Math.sin(rad)
      return `<line x1="100" y1="80" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#1a365d" stroke-width="2" marker-end="url(#arr)"/>`
    })
    .join('')}
  <defs><marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#1a365d"/></marker></defs>
  <circle cx="100" cy="80" r="10" fill="#c53030"/><text x="100" y="85" text-anchor="middle" fill="#fff" font-size="14" font-family="sans-serif">+</text>
</svg>`
}

/** SVG: falsche geschlossene Kreise um + (wie Magnet, falsch für E). */
function svgPunktFalschKreise(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" role="img" aria-label="Falsche kreisförmige Linien">
  <rect width="200" height="160" fill="#f7fafc"/>
  <circle cx="100" cy="80" r="25" fill="none" stroke="#1a365d" stroke-width="2"/>
  <circle cx="100" cy="80" r="45" fill="none" stroke="#1a365d" stroke-width="2"/>
  <circle cx="100" cy="80" r="65" fill="none" stroke="#1a365d" stroke-width="2"/>
  <circle cx="100" cy="80" r="10" fill="#c53030"/><text x="100" y="85" text-anchor="middle" fill="#fff" font-size="14" font-family="sans-serif">+</text>
</svg>`
}

/** SVG: Stabmagnet — Feldlinien außen N→S. */
function svgMagnet(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 140" role="img" aria-label="Feldlinien eines Stabmagneten">
  <rect width="220" height="140" fill="#f7fafc"/>
  <rect x="70" y="55" width="40" height="30" fill="#c53030"/><rect x="110" y="55" width="40" height="30" fill="#2b6cb0"/>
  <text x="90" y="75" text-anchor="middle" fill="#fff" font-size="12" font-family="sans-serif">N</text>
  <text x="130" y="75" text-anchor="middle" fill="#fff" font-size="12" font-family="sans-serif">S</text>
  <path d="M90 55 C90 20, 130 20, 130 55" fill="none" stroke="#1a365d" stroke-width="2" marker-end="url(#m)"/>
  <path d="M90 85 C90 120, 130 120, 130 85" fill="none" stroke="#1a365d" stroke-width="2" marker-end="url(#m)"/>
  <path d="M75 60 C40 40, 40 100, 75 80" fill="none" stroke="#1a365d" stroke-width="1.5" marker-end="url(#m)"/>
  <path d="M145 60 C180 40, 180 100, 145 80" fill="none" stroke="#1a365d" stroke-width="1.5" marker-end="url(#m)"/>
  <defs><marker id="m" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#1a365d"/></marker></defs>
</svg>`
}

const eFeldGenerate: Topic['generate'] = mixedVariants(
  (rng) => {
    const correct = 'radial nach außen von der positiven Ladung weg'
    const wrong = [
      'geschlossene Kreise um die Ladung wie bei einem Magneten',
      'alle Linien parallel nach unten ohne Quelle',
      'Linien enden willkürlich in der Luft ohne Ladung',
    ]
    return choicePickTask({
      question:
        'Die Skizze zeigt eine positive Punktladung. Welche Beschreibung passt zu den elektrischen Feldlinien?',
      choices: shuffleChoices(rng, [correct, ...wrong], correct),
      correct,
      solution: correct,
      explanation:
        'Elektrische Feldlinien beginnen an + und enden an − (oder im Unendlichen); bei isolierter + Ladung zeigen sie radial nach außen.',
      visualContent: svgPunktPlus(),
      instruction: 'Deute die Skizze:',
      fachwissen: fw(
        'E-Feldlinien: Richtung der Kraft auf eine positive Probeladung; Dichte ≈ Feldstärke.',
      ),
      dedupeKey: 'ph:feld:e:radial+',
      contentIds: ['ph:feld:e:radial+'],
    })
  },
  (rng) => {
    const correct = 'Das Bild zeigt kreisförmige Linien — das passt nicht zum E-Feld einer Punktladung.'
    const wrong = [
      'Kreise sind die korrekte Form für jede positive Punktladung',
      'Feldlinien elektrischer Felder sind immer geschlossen wie Magnetfeldlinien',
      'Die Farbe der Ladung bestimmt, ob Kreise oder Strahlen gezeichnet werden',
    ]
    return choicePickTask({
      question: 'Warum ist die folgende Skizze für das E-Feld einer Punktladung ungeeignet?',
      choices: shuffleChoices(rng, [correct, ...wrong], correct),
      correct,
      solution: correct,
      explanation:
        'Magnetische Feldlinien sind geschlossen; elektrische Feldlinien einer Punktladung verlaufen radial.',
      visualContent: svgPunktFalschKreise(),
      instruction: 'Vergleiche mit dem Modell elektrischer Feldlinien:',
      fachwissen: fw(
        'Unterscheide: B-Feldlinien geschlossen; E-Feldlinien beginnen/enden an Ladungen.',
      ),
      dedupeKey: 'ph:feld:e:falsch-kreis',
      contentIds: ['ph:feld:e:falsch-kreis'],
    })
  },
  (rng) => {
    const F = pick(rng, [2, 4, 5, 8])
    const q = pick(rng, [1, 2, 4])
    const E = F / q
    return valueTask({
      question: `Auf eine Probeladung q = ${q} nC wirkt im homogenen Feld die Kraft F = ${F}·10⁻⁹ N. Wie groß ist E in N/C? (E = F/q)`,
      answerKind: 'decimal',
      value: E,
      eps: 0.05,
      solution: `${E}`,
      explanation: `E = F/q = ${F}·10⁻⁹ / ${q}·10⁻⁹ = ${E} N/C.`,
      fachwissen: fw('Definition der elektrischen Feldstärke: E = F/q (Kraft auf Probeladung).'),
      dedupeKey: `ph:feld:e:calc:${F}:${q}`,
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Aussagen zu elektrischen Feldlinien sind richtig? (mehrere möglich)',
      choices: [
        'Linien beginnen an positiven und enden an negativen Ladungen',
        'Je dichter die Linien, desto größer typischerweise |E|',
        'Feldlinien kreuzen sich im Raum',
        'Die Tangentenrichtung gibt die Richtung von E an',
      ],
      correct: [
        'Linien beginnen an positiven und enden an negativen Ladungen',
        'Je dichter die Linien, desto größer typischerweise |E|',
        'Die Tangentenrichtung gibt die Richtung von E an',
      ],
      solution: 'Kreuzungsverbot; Start an +, Ende an −; Dichte ≈ Stärke; Tangente = Richtung.',
      explanation: 'Feldlinien sind ein Anschauungsmodell mit klaren Zeichenregeln.',
      fachwissen: fw(
        'Zeichenregeln E-Feld: keine Kreuzungen, Dichte ≈ |E|, Richtung = Kraft auf + Probe.',
      ),
      contentIds: ['ph:feld:e:multi'],
      dedupeKey: 'ph:feld:e:multi',
    }),
)

const bFeldGenerate: Topic['generate'] = mixedVariants(
  (rng) => {
    const correct = 'Außerhalb verlaufen die Linien vom Nord- zum Südpol (geschlossen über den Magneten).'
    const wrong = [
      'Alle Linien starten am Südpol und enden im Unendlichen',
      'Magnetfeldlinien kreuzen sich am Nordpol',
      'Es gibt nur Linien innerhalb des Magnets, außen keines',
    ]
    return choicePickTask({
      question: 'Stabmagnet — welche Aussage zu den Feldlinien stimmt zur Skizze?',
      choices: shuffleChoices(rng, [correct, ...wrong], correct),
      correct,
      solution: correct,
      explanation: 'Magnetische Feldlinien sind geschlossen; außerhalb konventionell N→S.',
      visualContent: svgMagnet(),
      instruction: 'Deute die Magnetfeldlinien:',
      fachwissen: fw('B-Feldlinien sind immer geschlossen; Richtung außerhalb: Nord → Süd.'),
      dedupeKey: 'ph:feld:b:stab',
      contentIds: ['ph:feld:b:stab'],
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Eisenfeilspäne auf Papier über einem Stabmagneten ordnen sich typischerweise …',
        correct: 'entlang der Magnetfeldlinien',
        wrong: [
          'in vollkommen zufälligen Kreisen ohne Bezug zum Magneten',
          'nur parallel zur Tischkante',
          'ausschließlich als elektrische Strompfeile',
        ],
        wissen: 'Feilspäne werden magnetisiert und zeigen die Richtung des B-Feldes.',
      },
      {
        q: 'Warum sind magnetische Feldlinien im Gegensatz zu elektrischen geschlossen?',
        correct: 'Es gibt keine magnetischen Monopole — Linien haben keinen Anfang/Ende an „Ladungen“.',
        wrong: [
          'Weil Magnete immer heißer sind als Ladungen',
          'Weil B immer größer als E ist',
          'Weil Feldlinien nur im Vakuum existieren',
        ],
        wissen: 'Bisher keine magnetischen Monopole beobachtet — B-Feldlinien sind geschlossen.',
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: c.wissen,
      fachwissen: fw(c.wissen),
      dedupeKey: `ph:feld:b:mc:${c.q.slice(0, 36)}`,
      contentIds: [`ph:feld:b:mc:${c.q.slice(0, 36)}`],
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Aussagen zum Magnetfeld eines Stabmagneten sind richtig?',
      choices: [
        'Feldlinien sind geschlossen',
        'Außerhalb zeigt die konventionelle Richtung von N nach S',
        'Feldlinien kreuzen sich frei im Raum',
        'Polnähe: typisch größere Felddichte',
      ],
      correct: [
        'Feldlinien sind geschlossen',
        'Außerhalb zeigt die konventionelle Richtung von N nach S',
        'Polnähe: typisch größere Felddichte',
      ],
      solution: 'Geschlossen; N→S außen; dichter nahe den Polen; keine Kreuzungen.',
      explanation: 'Zeichenregeln für B-Felder im Unterrichtsmodell.',
      fachwissen: fw('B-Feld: geschlossen, Dichte ≈ Stärke, Richtung N→S außerhalb.'),
      contentIds: ['ph:feld:b:multi'],
      dedupeKey: 'ph:feld:b:multi',
    }),
)

/** K7 Sek I: Magnet + Elektro-Feldlinien gemischt (grafisch). */
const k7FeldlinienGenerate: Topic['generate'] = mixedVariants(
  eFeldGenerate,
  bFeldGenerate,
  eFeldGenerate,
)

export const PHYSIK_FELDLINIEN_GENERATORS: Record<string, Topic['generate']> = {
  'ph-k7-lb1-feldlinien': k7FeldlinienGenerate,
  'ph-j11lk-lb7-linien': eFeldGenerate,
  'ph-j11lk-lb8-linien': bFeldGenerate,
}
