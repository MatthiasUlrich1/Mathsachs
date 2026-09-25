/**
 * Bundled anatomy images + slot geometry for `imageLabelSlots`.
 * Coordinates are percentages of the image box (0–100).
 */

export type AnatomySlotDef = {
  id: string
  /** Drop-field centre (percent of image width/height). */
  x: number
  y: number
  /** Leader-line tip on the anatomical region (percent). */
  targetX: number
  targetY: number
  label: string
  functionDe: string
  wissen: string
  concept: string
}

export type AnatomyAsset = {
  id: string
  imageSrc: string
  imageAlt: string
  attribution: string
  /** When false, image already shows leader lines / empty slots. */
  drawLeaders: boolean
  slots: AnatomySlotDef[]
  distractors: string[]
  fachwissenQuelle: string
  fachwissenUrl: string
}

/** Duane Raver / USFWS rainbow trout — unlabeled external view. */
export const FISH_TROUT_ASSET: AnatomyAsset = {
  id: 'fish-trout-raver',
  imageSrc: '/anatomy/oncorhynchus-mykiss-raver.jpg',
  imageAlt: 'Regenbogenforelle von der Seite (unbeschriftete Zeichnung)',
  attribution:
    'Duane Raver, U.S. Fish & Wildlife Service: „Oncorhynchus mykiss“ (Regenbogenforelle), weißer Hintergrund. Wikimedia Commons, Public Domain (US-Regierungsarbeit) — https://commons.wikimedia.org/wiki/File:Oncorhynchus_mykiss_mid_res_150dpi_whiteBG.jpg',
  drawLeaders: true,
  fachwissenQuelle: 'Wikipedia: Fisch',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Fisch',
  distractors: ['Hornschicht', 'Federfahne', 'Schwimmhaut'],
  slots: [
    {
      id: 'auge',
      x: 6,
      y: 22,
      targetX: 14,
      targetY: 36,
      label: 'Auge',
      functionDe: 'Sehen und Orientierung',
      wissen: 'Das Auge nimmt Lichtreize wahr und hilft bei der Orientierung im Wasser.',
      concept: 'bio:k5:fisch:aufbau:auge',
    },
    {
      id: 'kiamendeckel',
      x: 6,
      y: 52,
      targetX: 22,
      targetY: 48,
      label: 'Kiemendeckel',
      functionDe: 'Schützt die Kiemen',
      wissen: 'Der Kiemendeckel bedeckt die Kiemen und steuert den Wasserstrom beim Atmen.',
      concept: 'bio:k5:fisch:aufbau:kiamendeckel',
    },
    {
      id: 'brustflosse',
      x: 18,
      y: 88,
      targetX: 28,
      targetY: 72,
      label: 'Brustflosse',
      functionDe: 'Steuern und Bremsen',
      wissen: 'Brustflossen dienen dem Steuern, Bremsen und Feinjustieren der Lage.',
      concept: 'bio:k5:fisch:aufbau:brustflosse',
    },
    {
      id: 'rueckenflosse',
      x: 48,
      y: 6,
      targetX: 48,
      targetY: 18,
      label: 'Rückenflosse',
      functionDe: 'Stabilität beim Schwimmen',
      wissen: 'Die Rückenflosse stabilisiert den Körper und verhindert seitliches Kentern.',
      concept: 'bio:k5:fisch:aufbau:rueckenflosse',
    },
    {
      id: 'seitenlinie',
      x: 58,
      y: 38,
      targetX: 55,
      targetY: 50,
      label: 'Seitenlinie',
      functionDe: 'Wahrnehmung von Wasserbewegungen',
      wissen: 'Die Seitenlinie registriert Druckwellen und Strömungen im Wasser.',
      concept: 'bio:k5:fisch:aufbau:seitenlinie',
    },
    {
      id: 'bauchflosse',
      x: 48,
      y: 92,
      targetX: 48,
      targetY: 80,
      label: 'Bauchflosse',
      functionDe: 'Lage und Balance halten',
      wissen: 'Bauchflossen stützen die Lage im Wasser und helfen bei der Balance.',
      concept: 'bio:k5:fisch:aufbau:bauchflosse',
    },
    {
      id: 'afterflosse',
      x: 78,
      y: 88,
      targetX: 72,
      targetY: 74,
      label: 'Afterflosse',
      functionDe: 'Stabilität am Hinterkörper',
      wissen: 'Die Afterflosse stabilisiert den hinteren Körperabschnitt beim Schwimmen.',
      concept: 'bio:k5:fisch:aufbau:afterflosse',
    },
    {
      id: 'fettflosse',
      x: 78,
      y: 10,
      targetX: 74,
      targetY: 28,
      label: 'Fettflosse',
      functionDe: 'Kennzeichen mancher Arten (z. B. Forelle)',
      wissen: 'Die Fettflosse ist eine fleischige Flosse ohne Flossenstrahlen — typisch für Salmoniden.',
      concept: 'bio:k5:fisch:aufbau:fettflosse',
    },
    {
      id: 'schwanzflosse',
      x: 96,
      y: 50,
      targetX: 92,
      targetY: 50,
      label: 'Schwanzflosse',
      functionDe: 'Vortrieb beim Schwimmen',
      wissen: 'Die Schwanzflosse erzeugt den Hauptvortrieb durch seitliche Schläge.',
      concept: 'bio:k5:fisch:aufbau:schwanzflosse',
    },
  ],
}

/**
 * Bird internal organs diagram (CC0) — empty numbered slots already drawn;
 * we overlay drop fields and skip redrawing leaders.
 */
export const BIRD_ORGANS_ASSET: AnatomyAsset = {
  id: 'bird-organs-cc0',
  imageSrc: '/anatomy/bird-anatomy-unlabeled.png',
  imageAlt: 'Vogel von der Seite mit inneren Organen (unbeschriftete Beschriftungsplätze)',
  attribution:
    'Ndennis99: „Bird Anatomy Diagram“. Wikimedia Commons, CC0 1.0 — https://creativecommons.org/publicdomain/zero/1.0/ · https://commons.wikimedia.org/wiki/File:Bird_Anatomy_Diagram.png',
  drawLeaders: false,
  fachwissenQuelle: 'Wikipedia: Vögel',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/V%C3%B6gel',
  distractors: ['Kieme', 'Schwimmblase', 'Kiemendeckel'],
  slots: [
    {
      id: 'kropf',
      x: 11,
      y: 36,
      targetX: 28,
      targetY: 42,
      label: 'Kropf',
      functionDe: 'Vorrat und Vorweichung der Nahrung',
      wissen: 'Im Kropf wird Nahrung zwischengespeichert und angefeuchtet.',
      concept: 'bio:k5:vogel:aufbau:kropf',
    },
    {
      id: 'herz',
      x: 11,
      y: 50,
      targetX: 32,
      targetY: 52,
      label: 'Herz',
      functionDe: 'Blutkreislauf antreiben',
      wissen: 'Das Herz pumpt Blut und versorgt Organe mit Sauerstoff.',
      concept: 'bio:k5:vogel:aufbau:herz',
    },
    {
      id: 'leber',
      x: 11,
      y: 66,
      targetX: 36,
      targetY: 62,
      label: 'Leber',
      functionDe: 'Stoffwechsel und Entgiftung',
      wissen: 'Die Leber ist ein zentrales Stoffwechselorgan.',
      concept: 'bio:k5:vogel:aufbau:leber',
    },
    {
      id: 'lunge',
      x: 89,
      y: 26,
      targetX: 58,
      targetY: 36,
      label: 'Lunge',
      functionDe: 'Gasaustausch (mit Luftsäcken)',
      wissen: 'Lungen und Luftsäcke ermöglichen effizienten Gasaustausch beim Flug.',
      concept: 'bio:k5:vogel:aufbau:lunge',
    },
    {
      id: 'druesenmagen',
      x: 89,
      y: 42,
      targetX: 62,
      targetY: 48,
      label: 'Drüsenmagen',
      functionDe: 'Chemische Verdauung',
      wissen: 'Im Drüsenmagen werden Verdauungssäfte zugegeben.',
      concept: 'bio:k5:vogel:aufbau:druesenmagen',
    },
    {
      id: 'muskelmagen',
      x: 89,
      y: 55,
      targetX: 58,
      targetY: 58,
      label: 'Muskelmagen',
      functionDe: 'Mechanisches Zerkleinern',
      wissen: 'Der Muskelmagen zerreibt Nahrung oft mit aufgenommenen Steinchen.',
      concept: 'bio:k5:vogel:aufbau:muskelmagen',
    },
    {
      id: 'darm',
      x: 89,
      y: 68,
      targetX: 62,
      targetY: 68,
      label: 'Darm',
      functionDe: 'Nährstoffaufnahme',
      wissen: 'Im Darm werden Nährstoffe aufgenommen.',
      concept: 'bio:k5:vogel:aufbau:darm',
    },
    {
      id: 'kloake',
      x: 82,
      y: 86,
      targetX: 68,
      targetY: 82,
      label: 'Kloake',
      functionDe: 'Gemeinsamer Ausgang',
      wissen: 'Über die Kloake verlassen Kot, Harn und Geschlechtsprodukte den Körper.',
      concept: 'bio:k5:vogel:aufbau:kloake',
    },
  ],
}
