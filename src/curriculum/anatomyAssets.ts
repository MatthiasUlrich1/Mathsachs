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
 * Dog skull diagram — typical carnivore dentition (Commons schematic, CC BY-SA 3.0).
 * Clear K5-readable tooth row: Schneidezähne, Eckzähne, Reißzähne.
 */
export const LION_TEETH_ASSET: AnatomyAsset = {
  id: 'lioness-teeth-carnivore',
  imageSrc: '/anatomy/carnivore-skull-schematic.svg',
  imageAlt: 'Hundeschädel von der Seite — typisches Fleischfresser-Gebiss (Schema)',
  attribution:
    'Przemek Maksim: „Skull of a dog diagram“. Wikimedia Commons, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Skull_of_a_dog_diagram.svg',
  drawLeaders: true,
  fachwissenQuelle: 'Wikipedia: Gebiss',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Gebiss',
  distractors: ['Zahnlücke', 'Barten'],
  slots: [
    {
      id: 'schneidezaehne',
      x: 12,
      y: 90,
      targetX: 11.5,
      targetY: 54.5,
      label: 'Schneidezähne',
      functionDe: 'Abnagen und Festhalten',
      wissen: 'Kleine Schneidezähne sitzen vorn zwischen den Eckzähnen und helfen beim Abnagen von Fleisch.',
      concept: 'bio:k5:saeuger:gebiss:carnivor:schneide',
    },
    {
      id: 'eckzaehne',
      x: 32,
      y: 90,
      targetX: 19.5,
      targetY: 60.5,
      label: 'Eckzähne',
      functionDe: 'Beute festhalten und zerreißen',
      wissen:
        'Bei Fleischfressern sind die Eckzähne (Fangzähne) besonders lang und spitz — typisch für Raubtiere.',
      concept: 'bio:k5:saeuger:gebiss:carnivor:eck',
    },
    {
      id: 'reisszaehne',
      x: 52,
      y: 90,
      targetX: 35.5,
      targetY: 53.5,
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
      y: 10,
      targetX: 50,
      targetY: 14,
      label: 'Schädel',
      functionDe: 'Schützt das Gehirn',
      wissen: 'Der Schädel bildet den knöchernen Schutz für Gehirn und Sinnesorgane.',
      concept: 'bio:k5:saeuger:skelett:schaedel',
    },
    {
      id: 'schluesselbein',
      x: 92,
      y: 36,
      targetX: 58,
      targetY: 38,
      label: 'Schlüsselbein',
      functionDe: 'Verbindung Schulter–Brust',
      wissen: 'Das Schlüsselbein verbindet Schultergürtel und Brustbein und stützt die Schulter.',
      concept: 'bio:k5:saeuger:skelett:schluesselbein',
    },
    {
      id: 'brustbein',
      x: 8,
      y: 50,
      targetX: 50,
      targetY: 50,
      label: 'Brustbein',
      functionDe: 'Vorderer Abschluss des Brustkorbs',
      wissen: 'Am Brustbein setzen Rippenknorpel an — es stabilisiert den Brustkorb.',
      concept: 'bio:k5:saeuger:skelett:brustbein',
    },
    {
      id: 'rippen',
      x: 92,
      y: 50,
      targetX: 70,
      targetY: 52,
      label: 'Rippen',
      functionDe: 'Schutz von Herz und Lunge',
      wissen: 'Die Rippen bilden den Brustkorb und schützen Herz und Lunge.',
      concept: 'bio:k5:saeuger:skelett:rippen',
    },
    {
      id: 'wirbelsaeule',
      x: 8,
      y: 32,
      targetX: 50,
      targetY: 34,
      label: 'Wirbelsäule',
      functionDe: 'Stütze und Schutz des Rückenmarks',
      wissen: 'Die Wirbelsäule stützt den Rumpf und schützt das Rückenmark.',
      concept: 'bio:k5:saeuger:skelett:wirbelsaeule',
    },
    {
      id: 'oberarmknochen',
      x: 92,
      y: 62,
      targetX: 82,
      targetY: 58,
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
      y: 48,
      targetX: 50,
      targetY: 47,
      label: 'Becken',
      functionDe: 'Verbindung Rumpf–Beine',
      wissen: 'Das Becken verbindet Wirbelsäule und Beine und trägt den Rumpf.',
      concept: 'bio:k5:saeuger:skelett:becken',
    },
    {
      id: 'oberarm',
      x: 8,
      y: 30,
      targetX: 40,
      targetY: 32,
      label: 'Oberarmknochen',
      functionDe: 'Teil der oberen Gliedmaßen',
      wissen: 'Arme gehören zum Gliedmaßenskelett (nicht Achsenskelett).',
      concept: 'bio:k5:saeuger:skelett:glied-arm',
    },
    {
      id: 'oberschenkel',
      x: 8,
      y: 62,
      targetX: 45,
      targetY: 60,
      label: 'Oberschenkelknochen',
      functionDe: 'Teil der unteren Gliedmaßen',
      wissen: 'Beine gehören zum Gliedmaßenskelett und tragen den Körper.',
      concept: 'bio:k5:saeuger:skelett:glied-bein',
    },
  ],
}

/**
 * Tierische Zelle (domdomegg, CC BY 4.0) — nummeriert 1–4.
 * Drop-Felder überdecken die Bildnummern (viewBox 200 0 520 560).
 */
export const ANIMAL_CELL_ASSET: AnatomyAsset = {
  id: 'animal-cell-numbers',
  imageSrc: '/anatomy/animal-cell-numbers.svg',
  imageAlt: 'Schema einer tierischen Zelle mit nummerierten Beschriftungsplätzen',
  attribution:
    'domdomegg: „Simple diagram of animal cell (numbers)“. Wikimedia Commons, CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/ · https://commons.wikimedia.org/wiki/File:Simple_diagram_of_animal_cell_(numbers).svg',
  drawLeaders: false,
  fachwissenQuelle: 'Wikipedia: Zelle (Biologie)',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Zelle_(Biologie)',
  distractors: ['Zellwand', 'Chloroplast', 'Kapsel'],
  slots: [
    {
      id: 'zytoplasma',
      x: 7.4,
      y: 33.2,
      targetX: 55,
      targetY: 48,
      label: 'Zytoplasma',
      functionDe: 'Zellinhalt ohne Kern',
      wissen: 'Im Zytoplasma laufen viele Stoffwechselprozesse ab.',
      concept: 'bio:k6:zellen:bild:tier:zytoplasma',
    },
    {
      id: 'zellkern',
      x: 7.4,
      y: 40.4,
      targetX: 42,
      targetY: 38,
      label: 'Zellkern',
      functionDe: 'Enthält die Erbinformation',
      wissen: 'Der Zellkern steuert die Zelle und enthält die DNA.',
      concept: 'bio:k6:zellen:bild:tier:zellkern',
    },
    {
      id: 'zellmembran',
      x: 7.4,
      y: 47.4,
      targetX: 28,
      targetY: 52,
      label: 'Zellmembran',
      functionDe: 'Äußere Begrenzung der Tierzelle',
      wissen: 'Die Zellmembran begrenzt die Zelle und steuert den Stoffaustausch.',
      concept: 'bio:k6:zellen:bild:tier:zellmembran',
    },
    {
      id: 'mitochondrium',
      x: 7.4,
      y: 65.1,
      targetX: 48,
      targetY: 62,
      label: 'Mitochondrium',
      functionDe: 'Energiebereitstellung (Zellatmung)',
      wissen: 'Mitochondrien liefern Energie durch Zellatmung.',
      concept: 'bio:k6:zellen:bild:tier:mitochondrium',
    },
  ],
}

/**
 * Pflanzenzelle (domdomegg, CC BY 4.0) — nummeriert 1–7.
 * Drop-Felder überdecken die Bildnummern (viewBox 250 0 540 573 + group translate).
 */
export const PLANT_CELL_ASSET: AnatomyAsset = {
  id: 'plant-cell-numbers',
  imageSrc: '/anatomy/plant-cell-numbers.svg',
  imageAlt: 'Schema einer Pflanzenzelle mit nummerierten Beschriftungsplätzen',
  attribution:
    'domdomegg: „Simple diagram of plant cell (numbers)“. Wikimedia Commons, CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/ · https://commons.wikimedia.org/wiki/File:Simple_diagram_of_plant_cell_(numbers).svg',
  drawLeaders: false,
  fachwissenQuelle: 'Wikipedia: Zelle (Biologie)',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Zelle_(Biologie)',
  distractors: ['Geißel', 'Kapsel', 'Plasmid'],
  slots: [
    {
      id: 'zytoplasma',
      x: 10.6,
      y: 33.5,
      targetX: 52,
      targetY: 42,
      label: 'Zytoplasma',
      functionDe: 'Zellinhalt ohne Kern',
      wissen: 'Im Zytoplasma liegen Organellen und laufen Stoffwechselwege ab.',
      concept: 'bio:k6:zellen:bild:pflanze:zytoplasma',
    },
    {
      id: 'zellkern',
      x: 10.6,
      y: 40.4,
      targetX: 48,
      targetY: 38,
      label: 'Zellkern',
      functionDe: 'Enthält die Erbinformation',
      wissen: 'Der Zellkern enthält DNA und steuert viele Zellvorgänge.',
      concept: 'bio:k6:zellen:bild:pflanze:zellkern',
    },
    {
      id: 'zellmembran',
      x: 10.6,
      y: 47.5,
      targetX: 38,
      targetY: 48,
      label: 'Zellmembran',
      functionDe: 'Grenzt den Zellinhalt ab',
      wissen: 'Unter der Zellwand liegt die Zellmembran und steuert den Stoffaustausch.',
      concept: 'bio:k6:zellen:bild:pflanze:zellmembran',
    },
    {
      id: 'mitochondrium',
      x: 10.6,
      y: 64.6,
      targetX: 42,
      targetY: 68,
      label: 'Mitochondrium',
      functionDe: 'Energiebereitstellung (Zellatmung)',
      wissen: 'Auch Pflanzenzellen haben Mitochondrien für die Zellatmung.',
      concept: 'bio:k6:zellen:bild:pflanze:mitochondrium',
    },
    {
      id: 'zellwand',
      x: 10.6,
      y: 54.5,
      targetX: 32,
      targetY: 55,
      label: 'Zellwand',
      functionDe: 'Feste Hülle aus Cellulose',
      wissen: 'Die Zellwand gibt Form und Schutz — typisch für Pflanzenzellen.',
      concept: 'bio:k6:zellen:bild:pflanze:zellwand',
    },
    {
      id: 'vakuole',
      x: 10.6,
      y: 71.6,
      targetX: 68,
      targetY: 58,
      label: 'Vakuole',
      functionDe: 'Speicher und Innendruck (Turgor)',
      wissen: 'Die große Zentralvakuole speichert Stoffe und hält den Innendruck.',
      concept: 'bio:k6:zellen:bild:pflanze:vakuole',
    },
    {
      id: 'chloroplast',
      x: 10.6,
      y: 78.6,
      targetX: 58,
      targetY: 72,
      label: 'Chloroplast',
      functionDe: 'Ort der Fotosynthese',
      wissen: 'Chloroplasten enthalten Chlorophyll und betreiben Fotosynthese.',
      concept: 'bio:k6:zellen:bild:pflanze:chloroplast',
    },
  ],
}

/**
 * Bakterie (domdomegg, CC BY 4.0) — Nummern 1,3,5,8–11 (Serie-kompatibel).
 * Drop-Felder überdecken die Bildnummern (viewBox 0 0 500 623 + group translate).
 */
export const BACTERIUM_ASSET: AnatomyAsset = {
  id: 'bacterium-numbers',
  imageSrc: '/anatomy/bacterium-numbers.svg',
  imageAlt: 'Schema einer Bakterienzelle mit nummerierten Beschriftungsplätzen',
  attribution:
    'domdomegg: „Simple diagram of bacterium (numbers)“. Wikimedia Commons, CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/ · https://commons.wikimedia.org/wiki/File:Simple_diagram_of_bacterium_(numbers).svg',
  drawLeaders: false,
  fachwissenQuelle: 'Wikipedia: Bakterien',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Bakterien',
  distractors: ['Zellkern', 'Chloroplast', 'Mitochondrium'],
  slots: [
    {
      id: 'zytoplasma',
      x: 10.5,
      y: 31.8,
      targetX: 58,
      targetY: 42,
      label: 'Zytoplasma',
      functionDe: 'Zellinhalt der Bakterienzelle',
      wissen: 'Im Zytoplasma liegen Ribosomen und Stoffwechselenzyme.',
      concept: 'bio:k7:bakbau:bild:zytoplasma',
    },
    {
      id: 'zellmembran',
      x: 10.5,
      y: 38.3,
      targetX: 52,
      targetY: 38,
      label: 'Zellmembran',
      functionDe: 'Steuert Stoffaustausch',
      wissen: 'Die Zellmembran begrenzt das Zytoplasma und steuert den Stofftransport.',
      concept: 'bio:k7:bakbau:bild:zellmembran',
    },
    {
      id: 'zellwand',
      x: 10.5,
      y: 44.8,
      targetX: 48,
      targetY: 45,
      label: 'Zellwand',
      functionDe: 'Formgebung und Schutz',
      wissen: 'Die Bakterienzellwand gibt Form und mechanischen Schutz.',
      concept: 'bio:k7:bakbau:bild:zellwand',
    },
    {
      id: 'kapsel',
      x: 10.5,
      y: 51.2,
      targetX: 44,
      targetY: 52,
      label: 'Kapsel',
      functionDe: 'Äußere Schutzschicht mancher Bakterien',
      wissen: 'Eine Kapsel kann die Phagozytose erschweren und schützt die Zelle.',
      concept: 'bio:k7:bakbau:bild:kapsel',
    },
    {
      id: 'nucleoid',
      x: 10.5,
      y: 63.7,
      targetX: 62,
      targetY: 55,
      label: 'Nucleoid',
      functionDe: 'Bereich mit dem Erbgut (kein echter Kern)',
      wissen: 'Bakterien-DNA liegt im Nucleoid — ohne Kernmembran (Prokaryot).',
      concept: 'bio:k7:bakbau:bild:nucleoid',
    },
    {
      id: 'plasmid',
      x: 10.5,
      y: 70.2,
      targetX: 55,
      targetY: 48,
      label: 'Plasmid',
      functionDe: 'Kleine ringförmige DNA zusätzlich zum Chromosom',
      wissen: 'Plasmide tragen oft Zusatzgene (z. B. Resistenz) und liegen getrennt vom Nucleoid.',
      concept: 'bio:k7:bakbau:bild:plasmid',
    },
    {
      id: 'geissel',
      x: 10.5,
      y: 89.4,
      targetX: 58,
      targetY: 92,
      label: 'Geißel',
      functionDe: 'Bewegung in Flüssigkeiten',
      wissen: 'Geißeln ermöglichen vielen Bakterien die Fortbewegung.',
      concept: 'bio:k7:bakbau:bild:geissel',
    },
  ],
}

/**
 * Menschliches Herz (Wapcaplet / Ss181292, CC BY-SA 3.0) — nummeriert.
 * Schulrelevante Teilmenge; Drop-Felder überdecken die Bildnummern.
 * Legende Commons: 1 re. Vorhof, 2 li. Vorhof, 4 Aorta, 5 Lungenarterie,
 * 9 li. Kammer, 10 re. Kammer.
 */
export const HEART_NUMLABELS_ASSET: AnatomyAsset = {
  id: 'heart-numlabels',
  imageSrc: '/anatomy/heart-numlabels.svg',
  imageAlt: 'Schema des menschlichen Herzens mit nummerierten Beschriftungsplätzen',
  attribution:
    'Wapcaplet / Ss181292: „Heart numlabels“. Wikimedia Commons, CC BY-SA 3.0 — https://creativecommons.org/licenses/by-sa/3.0/ · https://commons.wikimedia.org/wiki/File:Heart_numlabels.svg',
  drawLeaders: false,
  fachwissenQuelle: 'Wikipedia: Herz',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Herz',
  distractors: ['Magensaft', 'Chloroplast', 'Zellwand'],
  slots: [
    {
      id: 'rechter-vorhof',
      x: 14,
      y: 42,
      targetX: 32,
      targetY: 48,
      label: 'Rechter Vorhof',
      functionDe: 'Nimmt sauerstoffarmes Blut aus dem Körper auf',
      wissen: 'Der rechte Vorhof nimmt Körpervenenblut auf und leitet es in die rechte Kammer.',
      concept: 'bio:k7:herz:bild:rechter-vorhof',
    },
    {
      id: 'linker-vorhof',
      x: 78,
      y: 36,
      targetX: 62,
      targetY: 40,
      label: 'Linker Vorhof',
      functionDe: 'Nimmt sauerstoffreiches Blut aus der Lunge auf',
      wissen: 'Der linke Vorhof nimmt Lungenvenenblut auf und leitet es in die linke Kammer.',
      concept: 'bio:k7:herz:bild:linker-vorhof',
    },
    {
      id: 'aorta',
      x: 52,
      y: 8,
      targetX: 52,
      targetY: 18,
      label: 'Aorta',
      functionDe: 'Ausgang der linken Kammer in den Körperkreislauf',
      wissen: 'Die Aorta führt Blut aus der linken Kammer in den Körperkreislauf.',
      concept: 'bio:k7:herz:bild:aorta',
    },
    {
      id: 'lungenarterie',
      x: 38,
      y: 14,
      targetX: 42,
      targetY: 22,
      label: 'Lungenarterie',
      functionDe: 'Führt Blut zur Lunge',
      wissen: 'Die Lungenarterie bringt sauerstoffarmes Blut von der rechten Kammer zur Lunge.',
      concept: 'bio:k7:herz:bild:lungenarterie',
    },
    {
      id: 'linke-kammer',
      x: 72,
      y: 68,
      targetX: 58,
      targetY: 62,
      label: 'Linke Kammer',
      functionDe: 'Pumpt Blut in den Körperkreislauf',
      wissen: 'Die linke Kammer hat die dickste Wand und pumpt Blut in die Aorta.',
      concept: 'bio:k7:herz:bild:linke-kammer',
    },
    {
      id: 'rechte-kammer',
      x: 22,
      y: 72,
      targetX: 38,
      targetY: 68,
      label: 'Rechte Kammer',
      functionDe: 'Pumpt Blut in den Lungenkreislauf',
      wissen: 'Die rechte Kammer pumpt Blut in die Lungenarterie zur Anreicherung mit Sauerstoff.',
      concept: 'bio:k7:herz:bild:rechte-kammer',
    },
  ],
}

/**
 * Magen–Dickdarm–Mastdarm (NCI / Medium69, PD US Gov + CC BY-SA 4.0 overlay numbers).
 * viewBox 600×620; Nummern 1–7 aus dem SVG-Transform.
 */
export const DIGESTIVE_STOMACH_ASSET: AnatomyAsset = {
  id: 'stomach-colon-rectum-numbered',
  imageSrc: '/anatomy/stomach-colon-rectum-numbered.svg',
  imageAlt: 'Schema von Magen und Dickdarm mit nummerierten Beschriftungsplätzen',
  attribution:
    'NCI / Medium69: „Stomach colon rectum diagram numbered“. Wikimedia Commons, Public Domain (US Gov) / CC BY-SA 4.0 (Nummerierung) — https://commons.wikimedia.org/wiki/File:Stomach_colon_rectum_diagram_numbered.svg',
  drawLeaders: false,
  fachwissenQuelle: 'Wikipedia: Verdauungstrakt',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Verdauungstrakt',
  distractors: ['Herzklappe', 'Lungenbläschen', 'Nierenbecken'],
  slots: [
    {
      id: 'magen',
      x: 57.4,
      y: 18.8,
      targetX: 48,
      targetY: 28,
      label: 'Magen',
      functionDe: 'Durchmischung und saure Vorverdauung',
      wissen: 'Im Magen beginnen saure Aufschlussprozesse, vor allem für Eiweiße.',
      concept: 'bio:k7:verdauung:bild:magen',
    },
    {
      id: 'querdarm',
      x: 51.0,
      y: 55.3,
      targetX: 50,
      targetY: 48,
      label: 'Querdarm',
      functionDe: 'Teil des Dickdarms quer durch den Bauch',
      wissen: 'Der Querdarm (Colon transversum) verbindet aufsteigenden und absteigenden Dickdarm.',
      concept: 'bio:k7:verdauung:bild:querdarm',
    },
    {
      id: 'absteigend',
      x: 68.8,
      y: 80.2,
      targetX: 62,
      targetY: 70,
      label: 'Absteigender Dickdarm',
      functionDe: 'Weiterer Wasserentzug links im Bauch',
      wissen: 'Der absteigende Dickdarm führt Kot Richtung Sigma und Mastdarm.',
      concept: 'bio:k7:verdauung:bild:absteigend',
    },
    {
      id: 'aufsteigend',
      x: 24.7,
      y: 84.2,
      targetX: 32,
      targetY: 70,
      label: 'Aufsteigender Dickdarm',
      functionDe: 'Dickdarmabschnitt rechts aufsteigend',
      wissen: 'Der aufsteigende Dickdarm beginnt am Blinddarm und steigt rechts auf.',
      concept: 'bio:k7:verdauung:bild:aufsteigend',
    },
    {
      id: 'blinddarm',
      x: 35.5,
      y: 93.3,
      targetX: 38,
      targetY: 82,
      label: 'Blinddarm',
      functionDe: 'Beginn des Dickdarms',
      wissen: 'Am Blinddarm (Caecum) beginnt der Dickdarm; der Wurmfortsatz setzt hier an.',
      concept: 'bio:k7:verdauung:bild:blinddarm',
    },
    {
      id: 'sigma',
      x: 59.2,
      y: 87.6,
      targetX: 55,
      targetY: 78,
      label: 'Sigma',
      functionDe: 'S-förmiger Dickdarmabschnitt',
      wissen: 'Das Sigma führt Kot zum Mastdarm.',
      concept: 'bio:k7:verdauung:bild:sigma',
    },
    {
      id: 'mastdarm',
      x: 57.7,
      y: 93.8,
      targetX: 52,
      targetY: 88,
      label: 'Mastdarm',
      functionDe: 'Speichert Kot vor der Ausscheidung',
      wissen: 'Der Mastdarm (Rektum) ist der letzte Abschnitt vor dem After.',
      concept: 'bio:k7:verdauung:bild:mastdarm',
    },
  ],
}

/**
 * Lichtmikroskop blank (Tomia, CC BY 2.5) — Leader auf typische Teile.
 * Positionen an Microscope-letters (A–F) angelehnt.
 */
export const MICROSCOPE_BLANK_ASSET: AnatomyAsset = {
  id: 'microscope-blank',
  imageSrc: '/anatomy/microscope-blank.svg',
  imageAlt: 'Schema eines Lichtmikroskops ohne Beschriftung',
  attribution:
    'Tomia: „Microscope-blank“. Wikimedia Commons, CC BY 2.5 — https://creativecommons.org/licenses/by/2.5/ · https://commons.wikimedia.org/wiki/File:Microscope-blank.svg',
  drawLeaders: true,
  fachwissenQuelle: 'Wikipedia: Lichtmikroskop',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Lichtmikroskop',
  distractors: ['Zellkern', 'Chloroplast', 'Herzklappe'],
  slots: [
    {
      id: 'okular',
      x: 78,
      y: 8,
      targetX: 58,
      targetY: 10,
      label: 'Okular',
      functionDe: 'Einblicklinse',
      wissen: 'Das Okular vergrößert das Zwischenbild vom Objektiv.',
      concept: 'bio:k6:mikroskop:bild:okular',
    },
    {
      id: 'objektiv',
      x: 82,
      y: 46,
      targetX: 55,
      targetY: 48,
      label: 'Objektiv',
      functionDe: 'Linse nahe am Präparat',
      wissen: 'Das Objektiv bestimmt maßgeblich die Vergrößerung und Auflösung.',
      concept: 'bio:k6:mikroskop:bild:objektiv',
    },
    {
      id: 'objekttisch',
      x: 82,
      y: 56,
      targetX: 58,
      targetY: 56,
      label: 'Objekttisch',
      functionDe: 'Träger des Präparats',
      wissen: 'Auf dem Objekttisch liegt der Objektträger; oft mit Klammern fixiert.',
      concept: 'bio:k6:mikroskop:bild:objekttisch',
    },
    {
      id: 'kondensor',
      x: 82,
      y: 66,
      targetX: 55,
      targetY: 66,
      label: 'Kondensor',
      functionDe: 'Bündelt Licht auf das Präparat',
      wissen: 'Kondensor und Blende steuern Helligkeit und Kontrast.',
      concept: 'bio:k6:mikroskop:bild:kondensor',
    },
    {
      id: 'spiegel',
      x: 78,
      y: 90,
      targetX: 58,
      targetY: 90,
      label: 'Spiegel',
      functionDe: 'Lenkt Licht zum Präparat',
      wissen: 'Der Beleuchtungsspiegel (oder die Lampe) beleuchtet das Präparat von unten.',
      concept: 'bio:k6:mikroskop:bild:spiegel',
    },
    {
      id: 'trieb',
      x: 92,
      y: 38,
      targetX: 74,
      targetY: 40,
      label: 'Trieb',
      functionDe: 'Scharfeinstellung',
      wissen: 'Grob- und Feintrieb stellen die Schärfe ein — Feintrieb bei starker Vergrößerung.',
      concept: 'bio:k6:mikroskop:bild:trieb',
    },
  ],
}

/**
 * Pflanzenorgane Überblick (Bigman24225, CC BY-SA 4.0) — unbeschriftete Pfade;
 * Leader auf typische Regionen (viewBox 960×720).
 */
export const PLANT_ORGANS_ASSET: AnatomyAsset = {
  id: 'plant-anatomy',
  imageSrc: '/anatomy/plant-anatomy.svg',
  imageAlt: 'Schema einer Samenpflanze mit Spross und Wurzel',
  attribution:
    'Bigman24225: „Plant Anatomy“. Wikimedia Commons, CC BY-SA 4.0 — https://creativecommons.org/licenses/by-sa/4.0/ · https://commons.wikimedia.org/wiki/File:Plant_Anatomy.svg',
  drawLeaders: true,
  fachwissenQuelle: 'Wikipedia: Spross',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Spross',
  distractors: ['Kiemendeckel', 'Herzklappe', 'Okular'],
  slots: [
    {
      id: 'endknospe',
      x: 78,
      y: 8,
      targetX: 52,
      targetY: 10,
      label: 'Endknospe',
      functionDe: 'Wachstumsspitze des Sprosses',
      wissen: 'Die Endknospe bildet neue Blätter und verlängert den Spross.',
      concept: 'bio:k6:organe:bild:endknospe',
    },
    {
      id: 'blatt',
      x: 88,
      y: 26,
      targetX: 74,
      targetY: 28,
      label: 'Blatt',
      functionDe: 'Hauptort der Fotosynthese',
      wissen: 'Im Blatt fängt die Pflanze Licht und betreibt Fotosynthese.',
      concept: 'bio:k6:organe:bild:blatt',
    },
    {
      id: 'spross',
      x: 82,
      y: 48,
      targetX: 50,
      targetY: 45,
      label: 'Sprossachse',
      functionDe: 'Träger von Blättern und Leitbahnen',
      wissen: 'Die Sprossachse transportiert Stoffe zwischen Wurzel und Blatt.',
      concept: 'bio:k6:organe:bild:spross',
    },
    {
      id: 'wurzel',
      x: 82,
      y: 78,
      targetX: 50,
      targetY: 78,
      label: 'Wurzel',
      functionDe: 'Verankerung und Wasseraufnahme',
      wissen: 'Die Wurzel verankert die Pflanze und nimmt Wasser mit Mineralstoffen auf.',
      concept: 'bio:k6:organe:bild:wurzel',
    },
    {
      id: 'seitenwurzel',
      x: 18,
      y: 82,
      targetX: 38,
      targetY: 80,
      label: 'Seitenwurzel',
      functionDe: 'Erschließt den Boden',
      wissen: 'Seitenwurzeln vergrößern die Aufnahmeoberfläche im Boden.',
      concept: 'bio:k6:organe:bild:seitenwurzel',
    },
    {
      id: 'wurzelspitze',
      x: 50,
      y: 94,
      targetX: 50,
      targetY: 90,
      label: 'Wurzelspitze',
      functionDe: 'Wachsendes Wurzelende',
      wissen: 'An der Wurzelspitze wächst die Wurzel in den Boden hinein.',
      concept: 'bio:k6:organe:bild:wurzelspitze',
    },
  ],
}

/**
 * Blatt an Spross (Jessekar0524, CC BY-SA 4.0) — Leader auf Blattteile.
 */
export const LEAF_BUD_STEM_ASSET: AnatomyAsset = {
  id: 'leaf-bud-stem',
  imageSrc: '/anatomy/leaf-bud-stem.svg',
  imageAlt: 'Schema von Blatt, Knospe und Spross',
  attribution:
    'Jessekar0524: „Leaf, Bud, and Stem Diagram“. Wikimedia Commons, CC BY-SA 4.0 — https://creativecommons.org/licenses/by-sa/4.0/ · https://commons.wikimedia.org/wiki/File:Leaf,_Bud,_and_Stem_Diagram.svg',
  drawLeaders: true,
  fachwissenQuelle: 'Wikipedia: Blatt (Pflanze)',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Blatt_(Pflanze)',
  distractors: ['Kiemenlamelle', 'Herzvorhof', 'Objektiv'],
  slots: [
    {
      id: 'spreite',
      x: 82,
      y: 32,
      targetX: 42,
      targetY: 38,
      label: 'Blattspreite',
      functionDe: 'Flächiger Teil für Lichtfang',
      wissen: 'Die Spreite bildet die große Blattfläche für die Fotosynthese.',
      concept: 'bio:k9:blatt:bild:spreite',
    },
    {
      id: 'mittelrippe',
      x: 82,
      y: 48,
      targetX: 52,
      targetY: 52,
      label: 'Mittelrippe',
      functionDe: 'Zentrale Leitbahn im Blatt',
      wissen: 'Die Mittelrippe führt Wasser und Assimilate in der Spreite.',
      concept: 'bio:k9:blatt:bild:mittelrippe',
    },
    {
      id: 'stiel',
      x: 82,
      y: 68,
      targetX: 36,
      targetY: 68,
      label: 'Blattstiel',
      functionDe: 'Verbindung Spreite–Spross',
      wissen: 'Der Blattstiel hält die Spreite und verbindet sie mit dem Spross.',
      concept: 'bio:k9:blatt:bild:stiel',
    },
    {
      id: 'knospe',
      x: 18,
      y: 72,
      targetX: 28,
      targetY: 76,
      label: 'Knospe',
      functionDe: 'Junges Sprossgewebe in der Achsel',
      wissen: 'In der Blattachsel sitzt oft eine Knospe für Verzweigung oder Blüte.',
      concept: 'bio:k9:blatt:bild:knospe',
    },
    {
      id: 'spross',
      x: 18,
      y: 88,
      targetX: 32,
      targetY: 84,
      label: 'Spross',
      functionDe: 'Achse, an der Blätter ansetzen',
      wissen: 'Am Spross sitzen Blätter und Knospen in Knoten.',
      concept: 'bio:k9:blatt:bild:spross',
    },
  ],
}

/** K7 Skelett — gleiche Geometrie wie K5, eigene concept-IDs. */
export const SKELETON_UPPER_K7_ASSET: AnatomyAsset = {
  ...SKELETON_UPPER_ASSET,
  id: 'skeleton-upper-k7',
  slots: SKELETON_UPPER_ASSET.slots.map((s) => ({
    ...s,
    concept: s.concept.replace('bio:k5:saeuger:skelett', 'bio:k7:skelett:bild'),
  })),
}

export const SKELETON_AXIAL_K7_ASSET: AnatomyAsset = {
  ...SKELETON_AXIAL_ASSET,
  id: 'skeleton-axial-k7',
  slots: SKELETON_AXIAL_ASSET.slots.map((s) => ({
    ...s,
    concept: s.concept.replace('bio:k5:saeuger:skelett', 'bio:k7:skelett:bild'),
  })),
}

/**
 * Synovialgelenk (OpenStax / CFCF, CC BY 3.0) — Titles-Layer entfernt (joint-blank.svg).
 * Leader auf typische Strukturen; Drop-Felder am Rand.
 */
export const JOINT_BLANK_ASSET: AnatomyAsset = {
  id: 'joint-blank',
  imageSrc: '/anatomy/joint-blank.svg',
  imageAlt: 'Schema eines Synovialgelenks (unbeschriftet)',
  attribution:
    'Madhero88: „Joint“. Wikimedia Commons, CC BY-SA 3.0 — https://creativecommons.org/licenses/by-sa/3.0/ · https://commons.wikimedia.org/wiki/File:Joint.svg (ShareAlike: Titles-Layer entfernt für Blank-Version; Drop-Felder nur UI-Overlay)',
  drawLeaders: true,
  fachwissenQuelle: 'Wikipedia: Gelenk',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Gelenk',
  distractors: ['Chloroplast', 'Kiemenlamelle', 'Okular'],
  slots: [
    {
      id: 'gelenkhoehle',
      x: 6,
      y: 34,
      targetX: 42,
      targetY: 42,
      label: 'Gelenkhöhle',
      functionDe: 'Raum mit Gelenkflüssigkeit',
      wissen: 'In der Gelenkhöhle liegt die Synovialflüssigkeit und mindert Reibung.',
      concept: 'bio:k7:gelenke:bild:gelenkhoehle',
    },
    {
      id: 'kapsel',
      x: 6,
      y: 56,
      targetX: 38,
      targetY: 55,
      label: 'Gelenkkapsel',
      functionDe: 'Umschließt das Gelenk',
      wissen: 'Die Gelenkkapsel schließt die Gelenkhöhle ab und stabilisiert mit Bändern.',
      concept: 'bio:k7:gelenke:bild:kapsel',
    },
    {
      id: 'knorpel',
      x: 92,
      y: 46,
      targetX: 58,
      targetY: 48,
      label: 'Gelenkknorpel',
      functionDe: 'Überzieht die Knochenflächen',
      wissen: 'Gelenkknorpel glättet die Knochenenden und dämpft Druck.',
      concept: 'bio:k7:gelenke:bild:knorpel',
    },
    {
      id: 'band',
      x: 92,
      y: 62,
      targetX: 62,
      targetY: 58,
      label: 'Band',
      functionDe: 'Stabilisiert Knochen gegen Knochen',
      wissen: 'Bänder verbinden Knochen und begrenzen die Beweglichkeit des Gelenks.',
      concept: 'bio:k7:gelenke:bild:band',
    },
    {
      id: 'knochen',
      x: 92,
      y: 26,
      targetX: 55,
      targetY: 28,
      label: 'Knochenende',
      functionDe: 'Bildet die Gelenkpartner',
      wissen: 'Die angrenzenden Knochenenden bilden mit Knorpel und Kapsel das Gelenk.',
      concept: 'bio:k7:gelenke:bild:knochen',
    },
  ],
}
