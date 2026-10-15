/**
 * Flaschenzug (K7 Wahl) — themenreine Bank.
 * Rules: Themenbindung, uniqueRound ≥10, Fachwissen aufgabenbezogen, kein Meta.
 */
import { physikBankGenerate as bankGenerate } from './physikBank'
import { type BioBank } from './biologieBank'
import type { Topic } from './types'

const fw = (s: string) => s

export const k7FlaschenzugBank: BioBank = {
  quelle: 'Wikipedia: Flaschenzug',
  url: 'https://de.wikipedia.org/wiki/Flaschenzug',
  conceptPrefix: 'ph:flasche',
  facts: [
    {
      concept: 'prinzip',
      prompt: 'Was leistet ein idealer Flaschenzug (ohne Reibung)?',
      answer: 'Verringert die nötige Zugkraft — dafür länger Seilweg',
      wrong: [
        'Löscht die Gewichtskraft vollständig aus',
        'Spart Kraft und Weg gleichzeitig ohne Nachteil',
        'Erhöht die Fallbeschleunigung g',
      ],
      explanation: 'Goldene Regel der Mechanik: Kraft↓ → Weg↑.',
      wissen: fw(
        'Die Last verteilt sich auf mehrere tragende Seilstücke. Ideal: F = F_G / n; der Seilweg wird länger.',
      ),
      gap: 'Idealer Flaschenzug: F = F_G / ___.',
      gapAccepted: ['n', 'Anzahl Seilstücke', 'tragende Seilstücke'],
    },
    {
      concept: 'formel',
      prompt: 'Wie berechnet man die ideale Zugkraft am Flaschenzug?',
      answer: 'F = F_G / n (n = tragende Seilstücke)',
      wrong: ['F = F_G · n', 'F = F_G + n', 'F = n / F_G'],
      explanation: 'Last geteilt durch Anzahl der tragenden Stränge.',
      wissen: fw('n ist die Zahl der Seilstücke, die die Last tragen — nicht die Rollenanzahl allein.'),
      gap: 'Ideale Zugkraft: F = ___.',
      gapAccepted: ['F_G / n', 'FG/n', 'Gewichtskraft durch n'],
    },
    {
      concept: 'strang',
      prompt: 'Was bedeutet „tragendes Seilstück“?',
      answer: 'Ein Seilabschnitt, der die Last mitträgt',
      wrong: [
        'Nur das lose Ende ohne Lastanteil',
        'Nur die Farbe des Seils',
        'Nur die Masse der Rolle in kg',
      ],
      explanation: 'Mehr tragende Stücke → kleinere Zugkraft.',
      wissen: fw('Jedes tragende Seilstück übernimmt ideal denselben Anteil der Gewichtskraft.'),
    },
    {
      concept: 'rollen',
      prompt: 'Welche Rolle spielt eine feste Rolle am Flaschenzug?',
      answer: 'Umlenkung der Seilrichtung (Kraft gleich groß)',
      wrong: [
        'Halbiert immer die Kraft allein',
        'Ersetzt die Gewichtskraft',
        'Erzeugt magnetische Kraft',
      ],
      explanation: 'Feste Rolle ändert Richtung; lose Rollen helfen beim Kraftteilen.',
      wissen: fw('Feste Rolle: Umlenkung. Lose Rolle: bewegt sich mit der Last und teilt Kräfte.'),
      gap: 'Feste Rolle vor allem zur ___.',
      gapAccepted: ['Umlenkung', 'Richtungsänderung'],
    },
    {
      concept: 'lose',
      prompt: 'Was bewirkt eine lose Rolle typischerweise?',
      answer: 'Sie bewegt sich mit der Last und hilft, Kraft zu teilen',
      wrong: [
        'Sie bleibt immer absolut ortsfest am Decken',
        'Sie misst nur Temperatur',
        'Sie erzeugt Ohm’schen Widerstand',
      ],
      explanation: 'Lose Rollen sind Teil der Kraftteilung.',
      wissen: fw('Lose Rollen hängen an der Lastseite und verdoppeln oft die tragenden Stränge.'),
    },
    {
      concept: 'rechnen',
      prompt: 'F_G = 600 N, n = 4 tragende Seilstücke. Ideale Zugkraft?',
      answer: '150 N',
      wrong: ['300 N', '600 N', '2400 N'],
      explanation: '600 / 4 = 150 N.',
      wissen: fw('F = F_G / n = 600 N / 4 = 150 N.'),
      gap: '600 N / 4 = ___ N.',
      gapAccepted: ['150'],
    },
    {
      concept: 'weg',
      prompt: 'Warum ist der Seilweg länger, wenn die Zugkraft kleiner wird?',
      answer: 'Arbeit bleibt ideal näherungsweise gleich (Kraft · Weg)',
      wrong: [
        'Weil g größer wird',
        'Weil Masse der Last sinkt',
        'Weil Reibung verschwindet und Arbeit negativ wird',
      ],
      explanation: 'Goldene Regel: Was an Kraft gespart wird, kostet Weg.',
      wissen: fw('Idealer Flaschenzug: kleinere Kraft bedeutet proportional längeren Zugweg.'),
    },
    {
      concept: 'reibung',
      prompt: 'Was ändert reale Reibung am Flaschenzug?',
      answer: 'Die nötige Zugkraft wird größer als der Idealwert',
      wrong: [
        'Reibung macht F immer genau null',
        'Reibung verdoppelt g',
        'Reibung löscht Seilstücke',
      ],
      explanation: 'Reibung und Rollenmasse kosten zusätzliche Kraft.',
      wissen: fw('Im Realbetrieb: F > F_G / n wegen Reibung und Trägheit der Rollen.'),
    },
    {
      concept: 'kran',
      prompt: 'Wo werden Flaschenzüge typischerweise eingesetzt?',
      answer: 'Krane, Aufzüge, Takelage — Lasten heben mit geringerer Zugkraft',
      wrong: [
        'Nur in elektrischen Stromkreisen',
        'Nur bei Linsengleichungen',
        'Nur bei Kernspaltung',
      ],
      explanation: 'Klassischer Kraftwandler in Technik und Alltag.',
      wissen: fw('Flaschenzüge sind kraftumformende Einrichtungen zum Heben schwerer Lasten.'),
    },
    {
      concept: 'goldene',
      prompt: 'Was besagt die Goldene Regel der Mechanik am Flaschenzug?',
      answer: 'Was an Kraft gespart wird, muss an Weg dazukommen',
      wrong: [
        'Kraft und Weg werden gleichzeitig unbegrenzt gespart',
        'Nur die Farbe der Rolle zählt',
        'Gewichtskraft wird vernichtet',
      ],
      explanation: 'Kraftwandler tauschen Kraft gegen Weg.',
      wissen: fw('Goldene Regel: Vorteil bei der Kraft → Nachteil beim Weg (ideale Mechanik).'),
      gap: 'Kraft sparen kostet ___.',
      gapAccepted: ['Weg', 'Seilweg', 'längeren Weg'],
    },
    {
      concept: 'nmehr',
      prompt: 'Mehr tragende Seilstücke bedeuten typischerweise …',
      answer: 'kleinere nötige Zugkraft',
      wrong: [
        'größere nötige Zugkraft',
        'keine Wirkung auf F',
        'kürzeren Seilweg bei gleicher Kraft immer',
      ],
      explanation: 'F ≈ F_G / n sinkt mit wachsendem n.',
      wissen: fw('Verdoppelt man n, halbiert sich ideal die Zugkraft — der Weg verdoppelt sich.'),
    },
    {
      concept: 'ideal',
      prompt: 'Welche Annahme steckt im „idealen“ Flaschenzug?',
      answer: 'Keine Reibung, masselose ideale Rollen/Seile',
      wrong: [
        'Unendlich große Reibung',
        'Negative Masse',
        'Spannung ohne Stromkreis',
      ],
      explanation: 'Schulmodell vernachlässigt Verluste.',
      wissen: fw('Idealisiert: F = F_G / n ohne Reibungs- und Massenverluste.'),
    },
  ],
  pairs: [
    { concept: 'p:n', term: 'n', meaning: 'Anzahl tragender Seilstücke', wissen: 'Teiler der Gewichtskraft.' },
    { concept: 'p:zug', term: 'Zugkraft', meaning: 'Kraft am gezogenen Seilende', wissen: 'Ideal F_G/n.' },
    { concept: 'p:fest', term: 'feste Rolle', meaning: 'Umlenkung, ortsfest gelagert', wissen: 'Richtung ändern.' },
    { concept: 'p:lose', term: 'lose Rolle', meaning: 'Bewegt sich mit der Last', wissen: 'Kraftteilung.' },
    { concept: 'p:fg', term: 'Gewichtskraft', meaning: 'Last F_G = m·g', wissen: 'Zu hebende Kraft.' },
    { concept: 'p:gold', term: 'Goldene Regel', meaning: 'Kraftsparen kostet Weg', wissen: 'Mechanik.' },
    { concept: 'p:seil', term: 'Seilweg', meaning: 'Länge des gezogenen Seils', wissen: 'Steigt wenn F sinkt.' },
    { concept: 'p:ideal', term: 'Idealmodell', meaning: 'Ohne Reibung gerechnet', wissen: 'Schulische Näherung.' },
    { concept: 'p:kran', term: 'Kran', meaning: 'Anwendung mit Flaschenzug', wissen: 'Lasten heben.' },
    { concept: 'p:umlenk', term: 'Umlenkung', meaning: 'Richtungsänderung der Kraft', wissen: 'Feste Rolle.' },
    { concept: 'p:arbeit', term: 'Arbeit', meaning: 'näherungsweise Kraft·Weg', wissen: 'Ideal konstant.' },
    { concept: 'p:reib', term: 'Reibung', meaning: 'Erhöht reale Zugkraft', wissen: 'Abweichung vom Ideal.' },
  ],
  trueFalse: [
    {
      concept: 'tf0',
      statement: 'Am idealen Flaschenzug gilt F = F_G / n.',
      correct: true,
      explanation: 'Last geteilt durch tragende Seilstücke.',
      wissen: fw('n = Anzahl der tragenden Seilstücke.'),
    },
    {
      concept: 'tf1',
      statement: 'Ein Flaschenzug spart Kraft und Weg gleichzeitig unbegrenzt.',
      correct: false,
      explanation: 'Kraftsparen kostet Weg.',
      wissen: fw('Goldene Regel der Mechanik.'),
    },
    {
      concept: 'tf2',
      statement: 'Mehr tragende Seilstücke verringern ideal die Zugkraft.',
      correct: true,
      explanation: 'F sinkt mit wachsendem n.',
      wissen: fw('F = F_G / n.'),
    },
    {
      concept: 'tf3',
      statement: 'Eine feste Rolle allein halbiert immer die Zugkraft.',
      correct: false,
      explanation: 'Feste Rolle dient vor allem der Umlenkung.',
      wissen: fw('Kraftteilung braucht typischerweise lose Rollen / mehrere Stränge.'),
    },
  ],
}

export const PHYSIK_FLASCHENZUG_GENERATORS: Record<string, Topic['generate']> = {
  'ph-k7-lbw-flasche': bankGenerate(k7FlaschenzugBank),
}
