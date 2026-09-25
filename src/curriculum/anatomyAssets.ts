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
      wissen: 'Das Auge nimmt Lichtreize wahr und hilft dem Fisch, sich unter Wasser zurechtzufinden.',
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
  slots: [
    {
      id: 'federfahne',
      x: 34,
      y: 14,
      targetX: 42,
      targetY: 28,
      label: 'Federfahne',
      functionDe: 'Tragfläche aus verzahnten Ästen',
      wissen: 'Die Federfahne bildet die flächige, tragfähige Fläche der Konturfeder.',
      concept: 'bio:k5:vogel:flug:fahne',
    },
    {
      id: 'federschaft',
      x: 80,
      y: 20,
      targetX: 58,
      targetY: 32,
      label: 'Federschaft',
      functionDe: 'Zentrale Achse der Feder',
      wissen: 'Der Federschaft (Rachis) ist die feste Mittelachse, an der die Fahne ansetzt.',
      concept: 'bio:k5:vogel:flug:schaft',
    },
    {
      id: 'federaste',
      x: 78,
      y: 42,
      targetX: 62,
      targetY: 48,
      label: 'Federäste',
      functionDe: 'Verzweigungen der Fahne',
      wissen: 'Äste und Strahlen verzahnen die Fahne zu einer zusammenhängenden Fläche.',
      concept: 'bio:k5:vogel:flug:aste',
    },
    {
      id: 'dunenanteil',
      x: 58,
      y: 74,
      targetX: 48,
      targetY: 68,
      label: 'Dunenanteil',
      functionDe: 'Lockere Isolierung am Federgrund',
      wissen: 'Der Dunenanteil am Federgrund isoliert und hält Wärme.',
      concept: 'bio:k5:vogel:flug:dunenanteil',
    },
    {
      id: 'federkiel',
      x: 40,
      y: 90,
      targetX: 36,
      targetY: 82,
      label: 'Federkiel',
      functionDe: 'Hohler Fuß, steckt in der Haut',
      wissen: 'Der Federkiel (Calamus) ist hohl und verankert die Feder in der Haut.',
      concept: 'bio:k5:vogel:flug:kiel',
    },
  ],
}

/** Bird lungs + air sacs schematic (English labels on source; German chips in app). */
export const BIRD_AIR_SACS_ASSET: AnatomyAsset = {
  id: 'bird-airsacs-cruithne',
  imageSrc: '/anatomy/bird-respiratory-cruithne.jpg',
  imageAlt: 'Schema der Vogelatmung mit Lunge und Luftsäcken',
  attribution:
    'Cruithne9: „Bird\'s respiratory system“. Wikimedia Commons, CC BY-SA 4.0 — https://creativecommons.org/licenses/by-sa/4.0/ · https://commons.wikimedia.org/wiki/File:Bird%27s_respiratory_system.jpg',
  drawLeaders: true,
  fachwissenQuelle: 'Wikipedia: Vogelatmung',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Vogelatmung',
  distractors: ['Schwimmblase', 'Kiemendeckel'],
  slots: [
    {
      id: 'luftroehre',
      x: 6,
      y: 88,
      targetX: 22,
      targetY: 78,
      label: 'Luftröhre',
      functionDe: 'Luftweg zum Atmungssystem',
      wissen: 'Über die Luftröhre gelangt Atemluft zu Lunge und Luftsäcken.',
      concept: 'bio:k5:vogel:atmung:luftroehre',
    },
    {
      id: 'vordere-luftsaecke',
      x: 6,
      y: 28,
      targetX: 24,
      targetY: 40,
      label: 'Vordere Luftsäcke',
      functionDe: 'Luftspeicher vor der Lunge',
      wissen: 'Vordere Luftsäcke speichern Luft und unterstützen den gerichteten Luftstrom.',
      concept: 'bio:k5:vogel:atmung:vordere-luftsaecke',
    },
    {
      id: 'lunge-parabronchien',
      x: 48,
      y: 8,
      targetX: 48,
      targetY: 42,
      label: 'Lunge',
      functionDe: 'Ort des Gasaustauschs',
      wissen: 'In der Vogellunge (u. a. Parabronchien) findet der Gasaustausch statt.',
      concept: 'bio:k5:vogel:atmung:lunge',
    },
    {
      id: 'hintere-luftsaecke',
      x: 94,
      y: 38,
      targetX: 82,
      targetY: 48,
      label: 'Hintere Luftsäcke',
      functionDe: 'Luftspeicher hinter der Lunge',
      wissen: 'Hintere Luftsäcke nehmen frische Luft auf und treiben den Luftstrom durch die Lunge.',
      concept: 'bio:k5:vogel:atmung:hintere-luftsaecke',
    },
  ],
}

/**
 * Human oral cavity with blank brackets for tooth-type groups (DBCLS).
 * Drop fields sit at the outer label areas; leaders point to tooth groups.
 */
export const TEETH_TYPES_ASSET: AnatomyAsset = {
  id: 'oral-teeth-blank',
  imageSrc: '/anatomy/oral-cavity-teeth-blank.svg',
  imageAlt: 'Mundhöhle mit Zahnarten und leeren Beschriftungsplätzen',
  attribution:
    'DataBase Center for Life Science (DBCLS); blank labeling layout TheTechnician27: „Oral cavity teeth labels (blank)“. Wikimedia Commons, CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/ · https://commons.wikimedia.org/wiki/File:Oral_cavity_teeth_labels_(blank).svg',
  drawLeaders: true,
  fachwissenQuelle: 'Wikipedia: Zahn',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Zahn',
  distractors: ['Kiemenreusen', 'Federkiel'],
  slots: [
    {
      id: 'schneidezaehne',
      x: 50,
      y: 6,
      targetX: 50,
      targetY: 24,
      label: 'Schneidezähne',
      functionDe: 'Abbeißen und Abschneiden',
      wissen: 'Schneidezähne stehen vorn und dienen dem Abbeißen und Abschneiden der Nahrung.',
      concept: 'bio:k5:saeuger:gebiss:schneide',
    },
    {
      id: 'eckzaehne',
      x: 92,
      y: 36,
      targetX: 78,
      targetY: 40,
      label: 'Eckzähne',
      functionDe: 'Festhalten und Zerreißen',
      wissen: 'Eckzähne sind spitz und halten bzw. zerreißen Nahrung — besonders bei Fleischfressern.',
      concept: 'bio:k5:saeuger:gebiss:eck',
    },
    {
      id: 'vorbackenzaehne',
      x: 8,
      y: 40,
      targetX: 24,
      targetY: 44,
      label: 'Vorbackenzähne',
      functionDe: 'Zerkleinern der Nahrung',
      wissen: 'Vorbackenzähne (Prämolaren) zerkleinern die Nahrung zwischen Schneide- und Backenzähnen.',
      concept: 'bio:k5:saeuger:gebiss:praemolar',
    },
    {
      id: 'backenzaehne',
      x: 8,
      y: 68,
      targetX: 28,
      targetY: 58,
      label: 'Backenzähne',
      functionDe: 'Zermahlen der Nahrung',
      wissen: 'Backenzähne (Molaren) haben breite Kauflächen und zermahlen die Nahrung.',
      concept: 'bio:k5:saeuger:gebiss:molar',
    },
  ],
}

/** Unlabeled human upper-body skeleton (anterior). */
export const SKELETON_UPPER_ASSET: AnatomyAsset = {
  id: 'skeleton-upper-anterior',
  imageSrc: '/anatomy/human-skeleton-upper-anterior.jpg',
  imageAlt: 'Menschliches Skelett Oberkörper von vorn (unbeschriftet)',
  attribution:
    'Andrewmeyerson: „Human Skeleton Upper Body Anterior View“. Wikimedia Commons, CC BY-SA 3.0 — https://creativecommons.org/licenses/by-sa/3.0/ · https://commons.wikimedia.org/wiki/File:Human_Skeleton_Upper_Body_Anterior_View.jpg',
  drawLeaders: true,
  fachwissenQuelle: 'Wikipedia: Menschliches Skelett',
  fachwissenUrl: 'https://de.wikipedia.org/wiki/Menschliches_Skelett',
  distractors: ['Federfahne', 'Kiemendeckel'],
  slots: [
    {
      id: 'schaedel',
      x: 8,
      y: 8,
      targetX: 50,
      targetY: 10,
      label: 'Schädel',
      functionDe: 'Schützt das Gehirn',
      wissen: 'Der Schädel bildet den knöchernen Schutz für Gehirn und Sinnesorgane.',
      concept: 'bio:k5:saeuger:skelett:schaedel',
    },
    {
      id: 'schluesselbein',
      x: 92,
      y: 22,
      targetX: 62,
      targetY: 24,
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
      targetY: 36,
      label: 'Brustbein',
      functionDe: 'Vorderer Abschluss des Brustkorbs',
      wissen: 'Am Brustbein setzen Rippenknorpel an — es stabilisiert den Brustkorb.',
      concept: 'bio:k5:saeuger:skelett:brustbein',
    },
    {
      id: 'rippen',
      x: 92,
      y: 40,
      targetX: 68,
      targetY: 40,
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
      targetY: 48,
      label: 'Wirbelsäule',
      functionDe: 'Stütze und Schutz des Rückenmarks',
      wissen: 'Die Wirbelsäule stützt den Rumpf und schützt das Rückenmark.',
      concept: 'bio:k5:saeuger:skelett:wirbelsaeule',
    },
    {
      id: 'oberarmknochen',
      x: 92,
      y: 58,
      targetX: 78,
      targetY: 55,
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
    'Anatomography / BodyParts3D, DBCLS: „Axial skeleton - anterior view“. Wikimedia Commons, CC BY-SA 2.1 JP — https://creativecommons.org/licenses/by-sa/2.1/jp/ · https://commons.wikimedia.org/wiki/File:Axial_skeleton_-_anterior_view.png',
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
