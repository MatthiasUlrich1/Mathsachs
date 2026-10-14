/**
 * Physik — Schemata für `imageLabelSlots` (Geräte/Aufbau).
 * Koordinaten in Prozent der Bildbox (0–100).
 */
import type { AnatomyAsset } from './anatomyAssets'

/**
 * Kepler-Fernrohr (Michael Schmid, CC BY-SA 2.0 AT) — Nummern (1)(2)(7) u. a.
 * viewBox faktisch 600×300.
 */
export const TELESCOPE_KEPLER_ASSET: AnatomyAsset = {
  id: 'telescope-schematic-a',
  imageSrc: '/physik/telescope-schematic-a.svg',
  imageAlt: 'Schema eines Kepler-Fernrohrs mit nummerierten Teilen',
  attribution:
    'Michael Schmid: „Telescope-schematic-A“. Wikimedia Commons, CC BY-SA 2.0 AT — https://creativecommons.org/licenses/by-sa/2.0/at/ · https://commons.wikimedia.org/wiki/File:Telescope-schematic-A.svg',
  drawLeaders: false,
  fachwissenQuelle: 'Wikipedia: Kepler-Fernrohr',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Kepler-Fernrohr',
  distractors: ['Kondensator', 'Amperemeter', 'Schwingkreis'],
  slots: [
    {
      id: 'objektiv',
      x: 45.7,
      y: 22,
      targetX: 52,
      targetY: 31,
      label: 'Objektiv',
      functionDe: 'Sammelt Licht vom fernen Objekt',
      wissen: 'Das Objektiv erzeugt ein reelles Zwischenbild vom fernen Objekt.',
      concept: 'ph:k10:fernrohr:bild:objektiv',
    },
    {
      id: 'okular',
      x: 83.3,
      y: 27.3,
      targetX: 81.5,
      targetY: 31,
      label: 'Okular',
      functionDe: 'Vergrößert das Zwischenbild zum Betrachten',
      wissen: 'Das Okular wirkt wie eine Lupe auf das Zwischenbild.',
      concept: 'ph:k10:fernrohr:bild:okular',
    },
    {
      id: 'tubus',
      x: 63.7,
      y: 12.3,
      targetX: 62,
      targetY: 28,
      label: 'Tubus',
      functionDe: 'Hält den Abstand Objektiv–Okular',
      wissen: 'Im Tubus verläuft der Strahlengang zwischen Objektiv und Okular.',
      concept: 'ph:k10:fernrohr:bild:tubus',
    },
    {
      id: 'zwischenbild',
      x: 71.3,
      y: 27.3,
      targetX: 73,
      targetY: 31,
      label: 'Zwischenbild',
      functionDe: 'Reelles Bild in der Brennebene des Objektivs',
      wissen: 'Dort entsteht das umgekehrte Zwischenbild, das das Okular vergrößert.',
      concept: 'ph:k10:fernrohr:bild:zwischenbild',
    },
  ],
}

/**
 * Einfacher Stromkreis mit Amperemeter (MikeRun, CC BY-SA 4.0) — unlabeled Symbolkreis.
 * viewBox 0 0 55.9 × 31.6 → Prozent der Bildbox.
 */
export const CIRCUIT_AMMETER_ASSET: AnatomyAsset = {
  id: 'simple-circuit-amperemeter',
  imageSrc: '/physik/simple-circuit-amperemeter.svg',
  imageAlt: 'Stromkreis mit Spannungsquelle, Verbraucher und Amperemeter',
  attribution:
    'MikeRun: „Simple-circuit-with-amperemeter“. Wikimedia Commons, CC BY-SA 4.0 — https://creativecommons.org/licenses/by-sa/4.0/ · https://commons.wikimedia.org/wiki/File:Simple-circuit-with-amperemeter.svg',
  drawLeaders: true,
  fachwissenQuelle: 'Wikipedia: Amperemeter',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Amperemeter',
  distractors: ['Voltmeter parallel', 'Kondensator', 'Transformator'],
  slots: [
    {
      id: 'quelle',
      x: 8,
      y: 55,
      targetX: 22,
      targetY: 55,
      label: 'Spannungsquelle',
      functionDe: 'Treibt den Strom im Kreis',
      wissen: 'Die Spannungsquelle liefert die treibende Spannung für den Stromkreis.',
      concept: 'ph:k7:messen:bild:quelle',
    },
    {
      id: 'verbraucher',
      x: 50,
      y: 8,
      targetX: 50,
      targetY: 22,
      label: 'Verbraucher',
      functionDe: 'Wandelt elektrische Energie um (z. B. Lampe)',
      wissen: 'Der Verbraucher nimmt Energie aus dem Stromkreis auf — z. B. als Licht.',
      concept: 'ph:k7:messen:bild:verbraucher',
    },
    {
      id: 'amperemeter',
      x: 88,
      y: 55,
      targetX: 72,
      targetY: 55,
      label: 'Amperemeter',
      functionDe: 'Misst die Stromstärke in Reihe',
      wissen: 'Das Amperemeter liegt im Stromweg (Reihenschaltung) und misst die Stromstärke.',
      concept: 'ph:k7:messen:bild:amperemeter',
    },
    {
      id: 'leiter',
      x: 50,
      y: 92,
      targetX: 50,
      targetY: 78,
      label: 'Verbindungsleiter',
      functionDe: 'Schließt den Stromkreis',
      wissen: 'Leitungen verbinden Quelle, Verbraucher und Messgerät zu einem geschlossenen Kreis.',
      concept: 'ph:k7:messen:bild:leiter',
    },
  ],
}

/**
 * Einfacher Stromkreis mit Voltmeter (MikeRun, CC BY-SA 4.0).
 */
export const CIRCUIT_VOLTMETER_ASSET: AnatomyAsset = {
  id: 'simple-circuit-voltmeter',
  imageSrc: '/physik/simple-circuit-voltmeter.svg',
  imageAlt: 'Stromkreis mit Spannungsquelle, Verbraucher und Voltmeter',
  attribution:
    'MikeRun: „Simple-circuit-with-voltmeter“. Wikimedia Commons, CC BY-SA 4.0 — https://creativecommons.org/licenses/by-sa/4.0/ · https://commons.wikimedia.org/wiki/File:Simple-circuit-with-voltmeter.svg',
  drawLeaders: true,
  fachwissenQuelle: 'Wikipedia: Voltmeter',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Voltmeter',
  distractors: ['Amperemeter in Reihe', 'Diode', 'Schwingkreis'],
  slots: [
    {
      id: 'quelle',
      x: 8,
      y: 55,
      targetX: 22,
      targetY: 55,
      label: 'Spannungsquelle',
      functionDe: 'Treibt den Strom im Kreis',
      wissen: 'Die Spannungsquelle liefert die treibende Spannung für den Stromkreis.',
      concept: 'ph:k7:messen:bild:v-quelle',
    },
    {
      id: 'verbraucher',
      x: 50,
      y: 8,
      targetX: 50,
      targetY: 22,
      label: 'Verbraucher',
      functionDe: 'Bauteil, an dem die Spannung abfällt',
      wissen: 'Am Verbraucher fällt Spannung ab — das Voltmeter zeigt diesen Abfall.',
      concept: 'ph:k7:messen:bild:v-verbraucher',
    },
    {
      id: 'voltmeter',
      x: 88,
      y: 40,
      targetX: 72,
      targetY: 40,
      label: 'Voltmeter',
      functionDe: 'Misst die Spannung parallel zum Bauteil',
      wissen: 'Das Voltmeter liegt parallel zum Bauteil und misst die Spannung ohne den Hauptstrom zu führen.',
      concept: 'ph:k7:messen:bild:voltmeter',
    },
    {
      id: 'parallelzweig',
      x: 88,
      y: 72,
      targetX: 68,
      targetY: 62,
      label: 'Parallelzweig',
      functionDe: 'Messpfad parallel zum Verbraucher',
      wissen: 'Über den Parallelzweig misst das Voltmeter die Spannungsdifferenz am Verbraucher.',
      concept: 'ph:k7:messen:bild:parallelzweig',
    },
  ],
}

/**
 * Lochkamera (DrBob / Pbroks13, Public Domain) — unbeschriftet.
 */
export const PINHOLE_CAMERA_ASSET: AnatomyAsset = {
  id: 'pinhole-camera',
  imageSrc: '/physik/pinhole-camera.svg',
  imageAlt: 'Schema einer Lochkamera mit Gegenstand, Öffnung und Abbild',
  attribution:
    'DrBob (Original), Pbroks13 (SVG): „Pinhole-camera“. Wikimedia Commons, Public Domain — https://commons.wikimedia.org/wiki/File:Pinhole-camera.svg',
  drawLeaders: true,
  fachwissenQuelle: 'Wikipedia: Lochkamera',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Lochkamera',
  distractors: ['Linse', 'Spiegelreflex', 'Prisma'],
  slots: [
    {
      id: 'gegenstand',
      x: 12,
      y: 35,
      targetX: 22,
      targetY: 40,
      label: 'Gegenstand',
      functionDe: 'Sendet Lichtstrahlen aus',
      wissen: 'Vom Gegenstand gehen Lichtstrahlen aus, die durch die Öffnung fallen.',
      concept: 'ph:k6:lochkamera:bild:gegenstand',
    },
    {
      id: 'oeffnung',
      x: 48,
      y: 12,
      targetX: 48,
      targetY: 48,
      label: 'Öffnung (Loch)',
      functionDe: 'Lässt Licht in die dunkle Kammer',
      wissen: 'In der kleinen Öffnung kreuzen sich die Strahlen — deshalb entsteht ein umgekehrtes Abbild.',
      concept: 'ph:k6:lochkamera:bild:oeffnung',
    },
    {
      id: 'schirm',
      x: 88,
      y: 55,
      targetX: 78,
      targetY: 55,
      label: 'Schirm',
      functionDe: 'Auffangfläche für das Abbild',
      wissen: 'Auf dem Schirm gegenüber der Öffnung entsteht das sichtbare Abbild.',
      concept: 'ph:k6:lochkamera:bild:schirm',
    },
    {
      id: 'abbild',
      x: 88,
      y: 28,
      targetX: 78,
      targetY: 35,
      label: 'Abbild',
      functionDe: 'Umgekehrtes Bild des Gegenstands',
      wissen: 'Das Abbild steht auf dem Kopf und ist seitenverkehrt, weil sich die Strahlen in der Öffnung kreuzen.',
      concept: 'ph:k6:lochkamera:bild:abbild',
    },
  ],
}
