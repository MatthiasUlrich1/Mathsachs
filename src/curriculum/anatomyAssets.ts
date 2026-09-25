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
  /** Fisch-typische Ablenker — keine Vogel-/Säuger-Begriffe. */
  distractors: ['Flossenstrahl', 'Kiemenlamelle', 'Schuppenreihe'],
  slots: [
    {
      id: 'auge',
      x: 8,
      y: 8,
      targetX: 10,
      targetY: 50,
      label: 'Auge',
      functionDe: 'Sehen und Orientierung',
      wissen: 'Das Auge nimmt Lichtreize wahr und hilft dem Fisch, sich unter Wasser zurechtzufinden.',
      concept: 'bio:k5:fisch:aufbau:auge',
    },
    {
      id: 'kiamendeckel',
      x: 3,
      y: 72,
      targetX: 18,
      targetY: 50,
      label: 'Kiemendeckel',
      functionDe: 'Schützt die Kiemen',
      wissen: 'Der Kiemendeckel bedeckt die Kiemen und steuert den Wasserstrom beim Atmen.',
      concept: 'bio:k5:fisch:aufbau:kiamendeckel',
    },
    {
      id: 'brustflosse',
      x: 18,
      y: 92,
      targetX: 27.5,
      targetY: 72,
      label: 'Brustflosse',
      functionDe: 'Steuern und Bremsen',
      wissen: 'Brustflossen dienen dem Steuern, Bremsen und Feinjustieren der Lage.',
      concept: 'bio:k5:fisch:aufbau:brustflosse',
    },
    {
      id: 'rueckenflosse',
      x: 48,
      y: 4,
      targetX: 48,
      targetY: 16,
      label: 'Rückenflosse',
      functionDe: 'Stabilität beim Schwimmen',
      wissen: 'Die Rückenflosse stabilisiert den Körper und verhindert seitliches Kentern.',
      concept: 'bio:k5:fisch:aufbau:rueckenflosse',
    },
    {
      id: 'seitenlinie',
      x: 58,
      y: 28,
      targetX: 55,
      targetY: 52,
      label: 'Seitenlinie',
      functionDe: 'Wahrnehmung von Wasserbewegungen',
      wissen: 'Die Seitenlinie registriert Druckwellen und Strömungen im Wasser.',
      concept: 'bio:k5:fisch:aufbau:seitenlinie',
    },
    {
      id: 'bauchflosse',
      x: 48,
      y: 94,
      targetX: 47,
      targetY: 80,
      label: 'Bauchflosse',
      functionDe: 'Lage und Balance halten',
      wissen: 'Bauchflossen stützen die Lage im Wasser und helfen bei der Balance.',
      concept: 'bio:k5:fisch:aufbau:bauchflosse',
    },
    {
      id: 'afterflosse',
      x: 78,
      y: 92,
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
      y: 8,
      targetX: 76,
      targetY: 38,
      label: 'Fettflosse',
      functionDe: 'Kennzeichen mancher Arten (z. B. Forelle)',
      wissen: 'Die Fettflosse ist eine fleischige Flosse ohne Flossenstrahlen — typisch für Salmoniden.',
      concept: 'bio:k5:fisch:aufbau:fettflosse',
    },
    {
      id: 'schwanzflosse',
      x: 96,
      y: 22,
      targetX: 93.5,
      targetY: 50,
      label: 'Schwanzflosse',
      functionDe: 'Vortrieb beim Schwimmen',
      wissen: 'Die Schwanzflosse erzeugt den Hauptvortrieb durch seitliche Schläge.',
      concept: 'bio:k5:fisch:aufbau:schwanzflosse',
    },
  ],
}

/**
 * Uwe Gille teleost schematic — numbered organs 1–11 (Commons).
 * Leaders from peripheral drop fields to organ centres (K5-clear schematic, not a dissection photo).
 * Mapping (Commons): 1 Leber, 2 Magen, 3 Darm, 4 Herz, 5 Schwimmblase, 11 Kiemen.
 */
export const FISH_ORGANS_ASSET: AnatomyAsset = {
  id: 'fish-organs-teleost',
  imageSrc: '/anatomy/fish-internal-teleost-gille.svg',
  imageAlt: 'Schematische Darstellung der inneren Organe eines Knochenfisches (nummeriert)',
  attribution:
    'Uwe Gille: „Fish-anatomy“ (Schematische Zeichnung der inneren Anatomie eines Knochenfischs). Wikimedia Commons, CC BY 2.5 — https://creativecommons.org/licenses/by/2.5/ · https://commons.wikimedia.org/wiki/File:Fish-anatomy.svg (Datei unverändert, Drop-Felder + Leader nur UI-Overlay)',
  drawLeaders: true,
  fachwissenQuelle: 'Wikipedia: Fisch',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Fisch',
  distractors: ['Niere', 'Harnblase', 'Hoden'],
  slots: [
    {
      id: 'kiemen',
      x: 8,
      y: 42,
      targetX: 26,
      targetY: 52,
      label: 'Kiemen',
      functionDe: 'Sauerstoff aus dem Wasser aufnehmen',
      wissen: 'An den Kiemen geht Sauerstoff aus dem Wasser ins Blut — die Atmung der Fische.',
      concept: 'bio:k5:fisch:aufbau:kiemen',
    },
    {
      id: 'herz',
      x: 8,
      y: 72,
      targetX: 29,
      targetY: 61,
      label: 'Herz',
      functionDe: 'Blutkreislauf antreiben',
      wissen: 'Das Herz pumpt Blut durch den Körper und versorgt Organe mit Sauerstoff.',
      concept: 'bio:k5:fisch:aufbau:herz',
    },
    {
      id: 'leber',
      x: 18,
      y: 28,
      targetX: 33,
      targetY: 56,
      label: 'Leber',
      functionDe: 'Stoffwechsel und Entgiftung',
      wissen: 'Die Leber speichert Nährstoffe und hilft bei der Entgiftung.',
      concept: 'bio:k5:fisch:aufbau:leber',
    },
    {
      id: 'magen',
      x: 58,
      y: 78,
      targetX: 40,
      targetY: 62,
      label: 'Magen',
      functionDe: 'Nahrung chemisch verdauen',
      wissen: 'Im Magen wird die Nahrung mit Verdauungssäften zersetzt.',
      concept: 'bio:k5:fisch:aufbau:magen',
    },
    {
      id: 'schwimmblase',
      x: 58,
      y: 22,
      targetX: 40,
      targetY: 50,
      label: 'Schwimmblase',
      functionDe: 'Schweben ohne ständiges Schwimmen',
      wissen: 'Die Schwimmblase reguliert den Auftrieb — der Fisch schwebt mit wenig Kraftaufwand.',
      concept: 'bio:k5:fisch:aufbau:schwimmblase',
    },
    {
      id: 'darm',
      x: 72,
      y: 68,
      targetX: 36,
      targetY: 70,
      label: 'Darm',
      functionDe: 'Nährstoffe aufnehmen',
      wissen: 'Im Darm werden Nährstoffe aus der verdauten Nahrung aufgenommen.',
      concept: 'bio:k5:fisch:aufbau:darm',
    },
  ],
}

/**
 * Pfützen-Plankton: Wasserfloh + Hüpferling (Commons-Fotos, Collage).
 * Drop fields on numbered badges 1–2.
 */
export const POND_PLANKTON_ASSET: AnatomyAsset = {
  id: 'pond-plankton-collage',
  imageSrc: '/anatomy/pond-organisms-daphnia-cyclops.png',
  imageAlt: 'Zwei Kleinstkrebse aus dem Plankton: Wasserfloh und Hüpferling',
  attribution:
    'Links: Paul Hebert: „Daphnia pulex“. Wikimedia Commons, CC BY 2.5 — https://creativecommons.org/licenses/by/2.5/ · https://commons.wikimedia.org/wiki/File:Daphnia_pulex.png · Rechts: „Cyclops.jpg“. Wikimedia Commons, Public Domain — https://commons.wikimedia.org/wiki/File:Cyclops.jpg (Collage: unveränderte Fotos nebeneinander; Drop-Felder nur UI-Overlay)',
  drawLeaders: false,
  fachwissenQuelle: 'Wikipedia: Plankton',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Plankton',
  distractors: ['Hai', 'Adler', 'Regenwurm'],
  slots: [
    {
      id: 'wasserfloh',
      x: 25,
      y: 8,
      targetX: 25,
      targetY: 50,
      label: 'Wasserfloh',
      functionDe: 'Filtert Algen und Bakterien',
      wissen: 'Wasserflöhe (Daphnia) sind kleine Krebse im Plankton und wichtige Filtrierer.',
      concept: 'bio:k6:pfuetze:wasserfloh-bild',
    },
    {
      id: 'huepferling',
      x: 75,
      y: 8,
      targetX: 75,
      targetY: 50,
      label: 'Hüpferling',
      functionDe: 'Ruderfußkrebs im Plankton',
      wissen: 'Hüpferlinge (Cyclops) sind Ruderfußkrebse und typische Pfützen-/Teichbewohner.',
      concept: 'bio:k6:pfuetze:huepferling-bild',
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
  // Optional Ablenkungen — nur als Extra-Chips, nie als Pflicht-Slots.
  distractors: ['Kieme', 'Schwimmblase'],
  /**
   * Reihenfolge = Bildnummern 1–8. Koordinaten mittig auf den vorgezeichneten
   * Nummernbannern (gemessen an 1632×1125, CC0-Diagramm).
   */
  slots: [
    {
      id: 'kropf',
      x: 10.0,
      y: 52.8,
      targetX: 28,
      targetY: 48,
      label: 'Kropf',
      functionDe: 'Vorrat und Vorweichung der Nahrung',
      wissen: 'Im Kropf wird Nahrung zwischengespeichert und angefeuchtet.',
      concept: 'bio:k5:vogel:aufbau:kropf',
    },
    {
      id: 'herz',
      x: 14.5,
      y: 64.0,
      targetX: 32,
      targetY: 58,
      label: 'Herz',
      functionDe: 'Blutkreislauf antreiben',
      wissen: 'Das Herz pumpt Blut und versorgt Organe mit Sauerstoff.',
      concept: 'bio:k5:vogel:aufbau:herz',
    },
    {
      id: 'leber',
      x: 19.3,
      y: 75.2,
      targetX: 36,
      targetY: 68,
      label: 'Leber',
      functionDe: 'Stoffwechsel und Entgiftung',
      wissen: 'Die Leber ist ein zentrales Stoffwechselorgan.',
      concept: 'bio:k5:vogel:aufbau:leber',
    },
    {
      id: 'kloake',
      x: 67.4,
      y: 86.6,
      targetX: 58,
      targetY: 82,
      label: 'Kloake',
      functionDe: 'Gemeinsamer Ausgang',
      wissen: 'Über die Kloake verlassen Kot, Harn und Geschlechtsprodukte den Körper.',
      concept: 'bio:k5:vogel:aufbau:kloake',
    },
    {
      id: 'darm',
      x: 87.6,
      y: 65.3,
      targetX: 62,
      targetY: 68,
      label: 'Darm',
      functionDe: 'Nährstoffaufnahme',
      wissen: 'Im Darm werden Nährstoffe aufgenommen.',
      concept: 'bio:k5:vogel:aufbau:darm',
    },
    {
      id: 'muskelmagen',
      x: 82.5,
      y: 58.0,
      targetX: 58,
      targetY: 60,
      label: 'Muskelmagen',
      functionDe: 'Mechanisches Zerkleinern',
      wissen: 'Der Muskelmagen zerreibt Nahrung oft mit aufgenommenen Steinchen.',
      concept: 'bio:k5:vogel:aufbau:muskelmagen',
    },
    {
      id: 'druesenmagen',
      x: 78.4,
      y: 50.4,
      targetX: 58,
      targetY: 52,
      label: 'Drüsenmagen',
      functionDe: 'Chemische Verdauung',
      wissen: 'Im Drüsenmagen werden Verdauungssäfte zugegeben.',
      concept: 'bio:k5:vogel:aufbau:druesenmagen',
    },
    {
      id: 'lunge',
      x: 73.0,
      y: 43.0,
      targetX: 55,
      targetY: 40,
      label: 'Lunge',
      functionDe: 'Gasaustausch (mit Luftsäcken)',
      wissen: 'Lungen und Luftsäcke ermöglichen effizienten Gasaustausch beim Flug.',
      concept: 'bio:k5:vogel:aufbau:lunge',
    },
  ],
}

/**
 * Contour feather with numbered markers 1–5 (language-neutral).
 * Order matches Wikimedia caption: vane, rachis, barb, afterfeather, calamus.
 */
export const FEATHER_PARTS_ASSET: AnatomyAsset = {
  id: 'feather-parts-numbered',
  imageSrc: '/anatomy/feather-parts-numbered.jpg',
  imageAlt: 'Konturfeder mit nummerierten Beschriftungsplätzen 1–5',
  attribution:
    'Icea (nach Image:Parts_of_feather.jpg): „Parts of feather modified“. Wikimedia Commons, Copyrighted free use — https://commons.wikimedia.org/wiki/File:Parts_of_feather_modified.jpg',
  drawLeaders: false,
  fachwissenQuelle: 'Wikipedia: Feder',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Feder_(Vogel)',
  distractors: ['Kiemendeckel', 'Schwimmblase'],
  /**
   * Drop-Felder mittig auf den Bildnummern 1–5 (gemessen an 599×600).
   * target* zeigt auf die anatomische Region (Linie bleibt im Bild).
   */
  slots: [
    {
      id: 'federfahne',
      x: 33.0,
      y: 17.4,
      targetX: 42,
      targetY: 28,
      label: 'Federfahne',
      functionDe: 'Tragfläche aus verzahnten Ästen',
      wissen: 'Die Federfahne bildet die flächige, tragfähige Fläche der Konturfeder.',
      concept: 'bio:k5:vogel:flug:fahne',
    },
    {
      id: 'federschaft',
      x: 86.2,
      y: 32.4,
      targetX: 58,
      targetY: 32,
      label: 'Federschaft',
      functionDe: 'Zentrale Achse der Feder',
      wissen: 'Der Federschaft (Rachis) ist die feste Mittelachse, an der die Fahne ansetzt.',
      concept: 'bio:k5:vogel:flug:schaft',
    },
    {
      id: 'federaste',
      x: 80.7,
      y: 48.0,
      targetX: 62,
      targetY: 48,
      label: 'Federäste',
      functionDe: 'Verzweigungen der Fahne',
      wissen: 'Äste und Strahlen verzahnen die Fahne zu einer zusammenhängenden Fläche.',
      concept: 'bio:k5:vogel:flug:aste',
    },
    {
      id: 'dunenanteil',
      x: 70.9,
      y: 80.6,
      targetX: 48,
      targetY: 68,
      label: 'Dunenanteil',
      functionDe: 'Lockere Isolierung am Federgrund',
      wissen: 'Der Dunenanteil am Federgrund isoliert und hält Wärme.',
      concept: 'bio:k5:vogel:flug:dunenanteil',
    },
    {
      id: 'federkiel',
      x: 46.6,
      y: 89.2,
      targetX: 36,
      targetY: 82,
      label: 'Federkiel',
      functionDe: 'Hohler Fuß, steckt in der Haut',
      wissen: 'Der Federkiel (Calamus) ist hohl und verankert die Feder in der Haut.',
      concept: 'bio:k5:vogel:flug:kiel',
    },
  ],
}

/**
 * Human oral cavity with blank brackets for tooth-type groups (DBCLS).
 * Drop fields sit ON the outer ends of the pre-drawn leaders (viewBox 400×400).
 * Mapping follows inkscape labels in the Commons SVG (Incisors / Canines /
 * Premolars / Molars). drawLeaders stays false — baked-in lines only.
 */
export const TEETH_TYPES_ASSET: AnatomyAsset = {
  id: 'oral-teeth-blank',
  imageSrc: '/anatomy/oral-cavity-teeth-blank.svg',
  imageAlt: 'Mundhöhle mit Zahnarten und leeren Beschriftungsplätzen',
  attribution:
    'DataBase Center for Life Science (DBCLS); blank labeling layout TheTechnician27: „Oral cavity teeth labels (blank)“. Wikimedia Commons, CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/ · https://commons.wikimedia.org/wiki/File:Oral_cavity_teeth_labels_(blank).svg',
  /** Blank-SVG hat bereits Klammern/Striche — Drop-Felder darüber, keine Extra-Linien. */
  drawLeaders: false,
  fachwissenQuelle: 'Wikipedia: Zahn',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Zahn',
  /** Themenbezogene Ablenker (kein Fisch-/Vogel-Jargon). */
  distractors: ['Barten', 'Giftzähne'],
  /**
   * Drop-Feld-Zentren = äußere Leader-Enden (gemessen aus SVG-Pfaden):
   * Schneide oben Mitte, Eck unten links, Vorbacken oben rechts, Backen links.
   */
  slots: [
    {
      id: 'schneidezaehne',
      x: 50,
      y: 25,
      targetX: 50,
      targetY: 40,
      label: 'Schneidezähne',
      functionDe: 'Abbeißen und Abschneiden',
      wissen: 'Schneidezähne stehen vorn und dienen dem Abbeißen und Abschneiden der Nahrung.',
      concept: 'bio:k5:saeuger:gebiss:schneide',
    },
    {
      id: 'eckzaehne',
      x: 24,
      y: 90,
      targetX: 35,
      targetY: 85,
      label: 'Eckzähne',
      functionDe: 'Festhalten und Zerreißen',
      wissen: 'Eckzähne sind spitz und halten bzw. zerreißen Nahrung — besonders bei Fleischfressern.',
      concept: 'bio:k5:saeuger:gebiss:eck',
    },
    {
      id: 'vorbackenzaehne',
      x: 79,
      y: 16,
      targetX: 76,
      targetY: 20,
      label: 'Vorbackenzähne',
      functionDe: 'Zerkleinern der Nahrung',
      wissen: 'Vorbackenzähne (Prämolaren) zerkleinern die Nahrung zwischen Schneide- und Backenzähnen.',
      concept: 'bio:k5:saeuger:gebiss:praemolar',
    },
    {
      id: 'backenzaehne',
      x: 13,
      y: 32,
      targetX: 17,
      targetY: 33,
      label: 'Backenzähne',
      functionDe: 'Zermahlen der Nahrung',
      wissen: 'Backenzähne (Molaren) haben breite Kauflächen und zermahlen die Nahrung.',
      concept: 'bio:k5:saeuger:gebiss:molar',
    },
  ],
}

/**
 * Lion skull engraving — carnivore dentition (Commons schematic, public domain).
 */
export const LION_TEETH_ASSET: AnatomyAsset = {
  id: 'lioness-teeth-carnivore',
  imageSrc: '/anatomy/lion-skull-schematic.png',
  imageAlt: 'Löwenschädel von der Seite — Fleischfresser-Gebiss (Schema)',
  attribution:
    'F. A. Brockhaus / unbekannt: „Skull lion“. Wikimedia Commons, Public Domain — https://commons.wikimedia.org/wiki/File:Skull_lion.png',
  drawLeaders: true,
  fachwissenQuelle: 'Wikipedia: Gebiss',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Gebiss',
  distractors: ['Zahnlücke', 'Barten'],
  slots: [
    {
      id: 'schneidezaehne',
      x: 3,
      y: 30,
      targetX: 6,
      targetY: 54,
      label: 'Schneidezähne',
      functionDe: 'Abnagen und Festhalten',
      wissen: 'Kleine Schneidezähne sitzen vorn zwischen den Eckzähnen und helfen beim Abnagen von Fleisch.',
      concept: 'bio:k5:saeuger:gebiss:carnivor:schneide',
    },
    {
      id: 'eckzaehne',
      x: 3,
      y: 52,
      targetX: 9,
      targetY: 50,
      label: 'Eckzähne',
      functionDe: 'Beute festhalten und zerreißen',
      wissen:
        'Bei Fleischfressern sind die Eckzähne (Fangzähne) besonders lang und spitz — typisch für Großkatzen.',
      concept: 'bio:k5:saeuger:gebiss:carnivor:eck',
    },
    {
      id: 'reisszaehne',
      x: 3,
      y: 78,
      targetX: 40,
      targetY: 52,
      label: 'Reißzähne',
      functionDe: 'Fleisch scheren wie eine Schere',
      wissen:
        'Reißzähne (Carnassialzähne) sind scharfkantige Backenzähne — Kennzeichen vieler Fleischfresser.',
      concept: 'bio:k5:saeuger:gebiss:carnivor:reiss',
    },
  ],
}

/**
 * Horse skull line drawing — herbivore dentition (Commons schematic, public domain).
 */
export const HORSE_SKULL_TEETH_ASSET: AnatomyAsset = {
  id: 'horse-skull-herbivore',
  imageSrc: '/anatomy/horse-skull-schematic.svg',
  imageAlt: 'Pferdeschädel von der Seite — Pflanzenfresser-Gebiss (Schema)',
  attribution:
    '„20150129 horse-skull-side-drawn-medical …“. Wikimedia Commons, Public Domain — https://commons.wikimedia.org/wiki/File:20150129_horse-skull-side-drawn-medical_ore-e-refineries_cool1_gh3-raw_xxx_e-1-a_trans-horse_pho.svg',
  drawLeaders: true,
  fachwissenQuelle: 'Wikipedia: Gebiss',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Gebiss',
  distractors: ['Reißzähne', 'Fangzähne'],
  slots: [
    {
      id: 'schneidezaehne',
      x: 6,
      y: 88,
      targetX: 10,
      targetY: 92,
      label: 'Schneidezähne',
      functionDe: 'Gras abbeißen',
      wissen: 'Pflanzenfresser haben vorn breite Schneidezähne zum Abschneiden von Gras und Blättern.',
      concept: 'bio:k5:saeuger:gebiss:herbivor:schneide',
    },
    {
      id: 'zahnluecke',
      x: 6,
      y: 70,
      targetX: 26,
      targetY: 78,
      label: 'Zahnlücke',
      functionDe: 'Freier Abschnitt zwischen Schneide- und Backenzähnen',
      wissen:
        'Viele Pflanzenfresser haben eine große Zahnlücke (Diastema) zwischen Vorder- und Backenzähnen.',
      concept: 'bio:k5:saeuger:gebiss:herbivor:luecke',
    },
    {
      id: 'backenzaehne',
      x: 92,
      y: 55,
      targetX: 50,
      targetY: 62,
      label: 'Backenzähne',
      functionDe: 'Pflanzen zermahlen',
      wissen:
        'Breite Mahlzähne mit langen Wurzeln zerreiben zähe Pflanzenkost — typisch für Pferde und andere Pflanzenfresser.',
      concept: 'bio:k5:saeuger:gebiss:herbivor:mahl',
    },
  ],
}

/**
 * Celebes pig skull plate — omnivore dentition (Commons schematic, public domain).
 * Lateral view is the right half of the plate.
 */
export const PIG_SKULL_TEETH_ASSET: AnatomyAsset = {
  id: 'pig-skull-omnivore',
  imageSrc: '/anatomy/pig-skull-schematic.png',
  imageAlt: 'Schweineschädel (Schema) — Allesfresser-Gebiss',
  attribution:
    '„Sus celebensis skull“. Wikimedia Commons, Public Domain — https://commons.wikimedia.org/wiki/File:Sus_celebensis_skull.png',
  drawLeaders: true,
  fachwissenQuelle: 'Wikipedia: Gebiss',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Gebiss',
  distractors: ['Barten', 'Reißzähne'],
  slots: [
    {
      id: 'schneidezaehne',
      x: 96,
      y: 42,
      targetX: 90,
      targetY: 58,
      label: 'Schneidezähne',
      functionDe: 'Abbeißen und Wühlen',
      wissen: 'Vorn am Rüssel sitzen Schneidezähne — Schweine nutzen sie beim Abbeißen und Wühlen.',
      concept: 'bio:k5:saeuger:gebiss:omnivor:schneide',
    },
    {
      id: 'hauer',
      x: 96,
      y: 72,
      targetX: 80,
      targetY: 60,
      label: 'Eckzähne',
      functionDe: 'Festhalten und Verteidigen',
      wissen:
        'Beim Schwein sind die Eckzähne oft als Hauer ausgebildet — Allesfresser haben schneidende und mahlende Zähne.',
      concept: 'bio:k5:saeuger:gebiss:omnivor:eck',
    },
    {
      id: 'backenzaehne',
      x: 38,
      y: 38,
      targetX: 65,
      targetY: 58,
      label: 'Backenzähne',
      functionDe: 'Pflanzen und tierische Kost zerdrücken',
      wissen:
        'Höckerige Backenzähne (bunodont) zerdrücken gemischte Nahrung — typisch für Allesfresser wie Schwein und Mensch.',
      concept: 'bio:k5:saeuger:gebiss:omnivor:back',
    },
  ],
}

/** Unlabeled human upper-body skeleton (anterior). */
export const SKELETON_UPPER_ASSET: AnatomyAsset = {
  id: 'skeleton-upper-anterior',
  imageSrc: '/anatomy/human-skeleton-upper-anterior.jpg',
  imageAlt: 'Menschliches Skelett Oberkörper von vorn (unbeschriftet)',
  attribution:
    'Andrewmeyerson (Ableitung von Anatomography / BodyParts3D, DBCLS): „Human Skeleton Upper Body Anterior View“. Wikimedia Commons, CC BY-SA 3.0 — https://creativecommons.org/licenses/by-sa/3.0/ · https://commons.wikimedia.org/wiki/File:Human_Skeleton_Upper_Body_Anterior_View.jpg (ShareAlike: Bearbeitungen unter gleicher/kompatibler Lizenz; Datei unverändert, Drop-Felder nur UI-Overlay)',
  drawLeaders: true,
  fachwissenQuelle: 'Wikipedia: Menschliches Skelett',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Menschliches_Skelett',
  distractors: ['Federfahne', 'Kiemendeckel'],
  /** Zielpunkte (target*) sitzen auf dem Knochen; Drop-Felder am Bildrand. */
  slots: [
    {
      id: 'schaedel',
      x: 8,
      y: 8,
      targetX: 50,
      targetY: 9,
      label: 'Schädel',
      functionDe: 'Schützt das Gehirn',
      wissen: 'Der Schädel bildet den knöchernen Schutz für Gehirn und Sinnesorgane.',
      concept: 'bio:k5:saeuger:skelett:schaedel',
    },
    {
      id: 'schluesselbein',
      x: 92,
      y: 22,
      targetX: 60,
      targetY: 25,
      label: 'Schlüsselbein',
      functionDe: 'Verbindung Schulter–Brust',
      wissen: 'Das Schlüsselbein verbindet Schultergürtel und Brustbein und stützt die Schulter.',
      concept: 'bio:k5:saeuger:skelett:schluesselbein',
    },
    {
      id: 'brustbein',
      x: 8,
      y: 36,
      targetX: 50,
      targetY: 34,
      label: 'Brustbein',
      functionDe: 'Vorderer Abschluss des Brustkorbs',
      wissen: 'Am Brustbein setzen Rippenknorpel an — es stabilisiert den Brustkorb.',
      concept: 'bio:k5:saeuger:skelett:brustbein',
    },
    {
      id: 'rippen',
      x: 92,
      y: 40,
      targetX: 70,
      targetY: 38,
      label: 'Rippen',
      functionDe: 'Schutz von Herz und Lunge',
      wissen: 'Die Rippen bilden den Brustkorb und schützen Herz und Lunge.',
      concept: 'bio:k5:saeuger:skelett:rippen',
    },
    {
      id: 'wirbelsaeule',
      x: 8,
      y: 52,
      targetX: 50,
      targetY: 20,
      label: 'Wirbelsäule',
      functionDe: 'Stütze und Schutz des Rückenmarks',
      wissen: 'Die Wirbelsäule stützt den Rumpf und schützt das Rückenmark.',
      concept: 'bio:k5:saeuger:skelett:wirbelsaeule',
    },
    {
      id: 'oberarmknochen',
      x: 92,
      y: 58,
      targetX: 80,
      targetY: 56,
      label: 'Oberarmknochen',
      functionDe: 'Knochen des Oberarms',
      wissen: 'Der Oberarmknochen (Humerus) ist der lange Knochen zwischen Schulter und Ellbogen.',
      concept: 'bio:k5:saeuger:skelett:humerus',
    },
  ],
}

/** Full-body axial skeleton (red) vs appendicular (white) — BodyParts3D. */
export const SKELETON_AXIAL_ASSET: AnatomyAsset = {
  id: 'skeleton-axial-anterior',
  imageSrc: '/anatomy/axial-skeleton-anterior.png',
  imageAlt: 'Menschliches Skelett von vorn; Achsenskelett hervorgehoben',
  attribution:
    'Anatomography / BodyParts3D, DBCLS: „Axial skeleton - anterior view“. Wikimedia Commons, CC BY-SA 2.1 JP — https://creativecommons.org/licenses/by-sa/2.1/jp/ · https://commons.wikimedia.org/wiki/File:Axial_skeleton_-_anterior_view.png (ShareAlike: Bearbeitungen unter gleicher/kompatibler Lizenz; Datei unverändert, Drop-Felder nur UI-Overlay)',
  drawLeaders: true,
  fachwissenQuelle: 'Wikipedia: Achsenskelett',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Achsenskelett',
  distractors: ['Federkiel', 'Kiemenlamelle'],
  slots: [
    {
      id: 'schaedel',
      x: 8,
      y: 6,
      targetX: 50,
      targetY: 8,
      label: 'Schädel',
      functionDe: 'Teil des Achsenskeletts; schützt das Gehirn',
      wissen: 'Der Schädel gehört zum Achsenskelett und schützt das Gehirn.',
      concept: 'bio:k5:saeuger:skelett:axial-schaedel',
    },
    {
      id: 'wirbelsaeule',
      x: 8,
      y: 42,
      targetX: 50,
      targetY: 40,
      label: 'Wirbelsäule',
      functionDe: 'Zentrale Achse des Rumpfs',
      wissen: 'Die Wirbelsäule ist die zentrale Stütze und führt das Rückenmark.',
      concept: 'bio:k5:saeuger:skelett:axial-wirbel',
    },
    {
      id: 'brustkorb',
      x: 92,
      y: 28,
      targetX: 58,
      targetY: 30,
      label: 'Brustkorb',
      functionDe: 'Rippen und Brustbein schützen Organe',
      wissen: 'Der Brustkorb (Rippen + Brustbein) schützt Herz und Lunge.',
      concept: 'bio:k5:saeuger:skelett:axial-brustkorb',
    },
    {
      id: 'becken',
      x: 92,
      y: 54,
      targetX: 50,
      targetY: 54,
      label: 'Becken',
      functionDe: 'Verbindung Rumpf–Beine',
      wissen: 'Das Becken verbindet Wirbelsäule und Beine und trägt den Rumpf.',
      concept: 'bio:k5:saeuger:skelett:becken',
    },
    {
      id: 'oberarm',
      x: 8,
      y: 30,
      targetX: 28,
      targetY: 32,
      label: 'Oberarmknochen',
      functionDe: 'Teil der oberen Gliedmaßen',
      wissen: 'Arme gehören zum Gliedmaßenskelett (nicht Achsenskelett).',
      concept: 'bio:k5:saeuger:skelett:glied-arm',
    },
    {
      id: 'oberschenkel',
      x: 8,
      y: 72,
      targetX: 38,
      targetY: 70,
      label: 'Oberschenkelknochen',
      functionDe: 'Teil der unteren Gliedmaßen',
      wissen: 'Beine gehören zum Gliedmaßenskelett und tragen den Körper.',
      concept: 'bio:k5:saeuger:skelett:glied-bein',
    },
  ],
}
