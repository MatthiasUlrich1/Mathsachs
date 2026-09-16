import { pick, randInt, type Rng } from '../lib/rng'
import {
  choicePickTask,
  dragDropSortTask,
  mixedVariants,
  multiSelectTask,
  numberLineTask,
  valueTask,
} from './taskHelpers'
import type { Topic } from './types'

const shuffleChoices = (rng: Rng, choices: string[], correct: string): string[] => {
  const list = [...choices]
  for (let i = list.length - 1; i > 0; i--) {
    const j = randInt(rng, 0, i)
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  if (!list.includes(correct)) list[0] = correct
  return list
}

/** LB1 — Welleneigenschaften des Lichts */
const licht: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Interferenz von Licht zeigt, dass …',
        correct: 'Licht Welleneigenschaften besitzt',
        wrong: [
          'Licht nur aus massiven Teilchen ohne Welle besteht',
          'Licht sich nicht ausbreiten kann',
          'Farben nur im Dunkeln entstehen',
        ],
        explanation:
          'Überlagerung (konstruktiv/destruktiv) ist ein Wellenphänomen — Interferenz belegt den Wellencharakter.',
      },
      {
        q: 'Beugung an einem Spalt bedeutet qualitativ …',
        correct: 'Licht wird am Rand „abgelenkt“ und breitet sich auch in den Schattenbereich aus',
        wrong: [
          'Licht stoppt immer abrupt hinter dem Spalt',
          'Beugung gibt es nur bei Schall, nie bei Licht',
          'Beugung löscht die Wellenlänge',
        ],
        explanation:
          'Wellen beugen an Hindernissen/Spalten; Licht zeigt dasselbe Verhalten.',
      },
      {
        q: 'Bei konstruktiver Interferenz …',
        correct: 'verstärken sich die Wellen (Maximum)',
        wrong: [
          'löschen sie sich immer vollständig aus',
          'verschwindet die Frequenz',
          'ändert sich die Lichtgeschwindigkeit lokal stark',
        ],
        explanation:
          'Gleichphasige Überlagerung → Verstärkung; gegenphasig → Abschwächung/Auslöschung.',
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: c.explanation,
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    // c = λ · f mit ganzzahligen, schulüblichen Werten (hier c in m/s skaliert)
    const triples = [
      { lam: 2, f: 3, c: 6 },
      { lam: 4, f: 5, c: 20 },
      { lam: 5, f: 4, c: 20 },
      { lam: 3, f: 6, c: 18 },
      { lam: 8, f: 2, c: 16 },
      { lam: 10, f: 3, c: 30 },
    ] as const
    const { lam, f, c } = pick(rng, [...triples])
    const mode = pick(rng, ['c', 'f', 'lam'] as const)
    if (mode === 'c') {
      return valueTask({
        question: `Eine Welle hat die Wellenlänge λ = ${lam} m und die Frequenz f = ${f} Hz. Berechne c = λ · f.`,
        answerKind: 'integer',
        unit: 'm/s',
        value: c,
        solution: `${c} m/s`,
        explanation: `c = λ · f = ${lam} · ${f} = ${c} m/s.`,
      })
    }
    if (mode === 'f') {
      return valueTask({
        question: `Licht (bzw. eine Welle) hat c = ${c} m/s und λ = ${lam} m. Berechne f = c / λ.`,
        answerKind: 'integer',
        unit: 'Hz',
        value: f,
        solution: `${f} Hz`,
        explanation: `f = c / λ = ${c} / ${lam} = ${f} Hz.`,
      })
    }
    return valueTask({
      question: `Eine Welle hat c = ${c} m/s und f = ${f} Hz. Berechne λ = c / f.`,
      answerKind: 'integer',
      unit: 'm',
      value: lam,
      solution: `${lam} m`,
      explanation: `λ = c / f = ${c} / ${f} = ${lam} m.`,
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Aussagen zu Lichtwellen stimmen? (mehrere möglich)',
      choices: [
        'Interferenz und Beugung belegen Welleneigenschaften',
        'Es gilt c = λ · f',
        'Kürzere Wellenlänge bedeutet bei festem c höhere Frequenz',
        'Beugung gibt es nur bei Wasserwellen, nie bei Licht',
        'Interferenz braucht immer absolute Dunkelheit ohne Licht',
      ],
      correct: [
        'Interferenz und Beugung belegen Welleneigenschaften',
        'Es gilt c = λ · f',
        'Kürzere Wellenlänge bedeutet bei festem c höhere Frequenz',
      ],
      solution: 'Welle via Interferenz/Beugung; c = λf; λ klein → f groß.',
      explanation: 'Falsch: Beugung nur Wasser; Interferenz ohne Licht.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
)

/** LB2 — Praktikum Optik */
const optik: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Die Brennweite f einer Sammellinse ist …',
        correct: 'der Abstand Brennpunkt–Linsenmitte',
        wrong: [
          'die Dicke der Linse in der Mitte allein',
          'die Farbe des Glases',
          'der Durchmesser des Gegenstandes',
        ],
        explanation:
          'Brennweite = Abstand zwischen optischer Mitte und Brennpunkt F.',
      },
      {
        q: 'Eine stärkere Sammellinse (größere Brechkraft) hat …',
        correct: 'eine kleinere Brennweite',
        wrong: [
          'immer eine größere Brennweite',
          'keine Brennweite',
          'nur Wirkung ohne Fokus',
        ],
        explanation: 'Brechkraft D = 1/f: große D → kleine Brennweite f.',
      },
      {
        q: 'Ein paralleles Strahlenbündel trifft eine Sammellinse. Wohin laufen die Strahlen hinter der Linse?',
        correct: 'durch den Brennpunkt (bzw. auf ihn zu)',
        wrong: [
          'immer parallel weiter ohne Ablenkung',
          'zurück zur Lichtquelle ohne Linse',
          'nur seitlich an der Linse vorbei',
        ],
        explanation:
          'Parallele Strahlen werden in der Brennebene gebündelt (ideale dünne Linse).',
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: c.explanation,
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Bildkonstruktion Sammellinse: Ein Strahl parallel zur optischen Achse verläuft nach der Linse …',
        correct: 'durch den bildseitigen Brennpunkt',
        wrong: [
          'unverändert parallel ohne Fokus',
          'immer durch den gegenstandsseitigen Brennpunkt zurück',
          'senkrecht zur Achse ohne Regel',
        ],
      },
      {
        q: 'Bildkonstruktion: Ein Strahl durch die Linsenmitte …',
        correct: 'geht ungebrochen weiter (dünne Linse)',
        wrong: [
          'wird immer um 90° abgelenkt',
          'endet in der Linsenmitte',
          'wird reflektiert wie am Spiegel',
        ],
      },
      {
        q: 'Gegenstand außerhalb der doppelten Brennweite (Sammellinse): Das Bild ist …',
        correct: 'reell, umgekehrt und verkleinert',
        wrong: [
          'immer virtuell und aufrecht',
          'immer vergrößert und aufrecht',
          'nicht konstruierbar',
        ],
      },
      {
        q: 'Gegenstand zwischen Brennweite und doppelter Brennweite (Sammellinse): Das Bild ist …',
        correct: 'reell, umgekehrt und vergrößert',
        wrong: [
          'virtuell und verkleinert',
          'reell und verkleinert',
          'immer aufrecht hinter dem Gegenstand',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Klassische Strahlenkonstruktion an der dünnen Sammellinse.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const ordered = pick(rng, [
      [
        { label: 'Gegenstand weit entfernt', value: 1 },
        { label: 'Bild nahe der Brennebene', value: 2 },
        { label: 'scharf einstellen am Schirm', value: 3 },
      ],
      [
        { label: 'Gegenstand außerhalb 2f', value: 1 },
        { label: 'reelles Bild zwischen f und 2f', value: 2 },
        { label: 'Bild auf dem Schirm auffangen', value: 3 },
      ],
    ])
    const items = [...ordered]
    for (let i = items.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[items[i], items[j]] = [items[j]!, items[i]!]
    }
    const correctOrder = ordered.map((row) => items.findIndex((it) => it.value === row.value))
    return dragDropSortTask({
      question: 'Ordne die Schritte im Optik-Praktikum (Ablauf).',
      items,
      correctOrder,
      solution: ordered.map((row) => row.label).join(' → '),
      explanation: 'Zuerst Gegenstand positionieren, Bildort verstehen, dann scharf stellen.',
    })
  },
)

/** LB3 — Quantenphysik */
const quanten: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Beim Photoeffekt werden Elektronen ausgelöst, wenn …',
        correct: 'die Frequenz des Lichts über der Grenzfrequenz liegt',
        wrong: [
          'nur die Intensität groß genug ist — unabhängig von der Frequenz',
          'das Licht immer infrarot ist',
          'gar kein Photon ankommt',
        ],
        explanation:
          'Jedes Photon hat E = h·f. Nur wenn E ≥ Austrittsarbeit, werden Elektronen freigesetzt.',
      },
      {
        q: 'Was ändert eine höhere Intensität (bei f über der Grenze) am Photoeffekt?',
        correct: 'mehr Elektronen pro Zeit (größere Rate)',
        wrong: [
          'die maximale kinetische Energie der Elektronen stark proportional zur Intensität',
          'die Grenzfrequenz wird null',
          'Photonen verschwinden',
        ],
        explanation:
          'Intensität ≈ Photonenrate → mehr Elektronen. Die max. Energie hängt von f ab, nicht von der Intensität.',
      },
      {
        q: 'Unterhalb der Grenzfrequenz …',
        correct: 'werden keine Elektronen ausgelöst (auch bei großer Intensität)',
        wrong: [
          'reicht immer mehr Lichtstärke aus',
          'steigt die Elektronenenergie unbegrenzt',
          'wird h negativ',
        ],
        explanation:
          'Wenn h·f unter der Austrittsarbeit liegt, hilft auch hohe Intensität nicht.',
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: c.explanation,
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    // Konzept E = h · f mit ganzzahligen „Einheiten“ (h = 2, f ganz → E ganz)
    const pairs = [
      { h: 2, f: 3, E: 6 },
      { h: 2, f: 5, E: 10 },
      { h: 3, f: 4, E: 12 },
      { h: 4, f: 5, E: 20 },
      { h: 5, f: 2, E: 10 },
      { h: 6, f: 3, E: 18 },
    ] as const
    const { h, f, E } = pick(rng, [...pairs])
    return valueTask({
      question: `Ein Photon hat die Frequenz f = ${f} (in passenden Einheiten). Mit h = ${h} gilt E = h · f. Berechne E.`,
      answerKind: 'integer',
      unit: 'E',
      value: E,
      solution: `${E}`,
      explanation: `E = h · f = ${h} · ${f} = ${E}. Die Energie wächst proportional zur Frequenz.`,
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Aussagen zu E = h · f stimmen? (mehrere möglich)',
      choices: [
        'h ist das plancksche Wirkungsquantum',
        'Höhere Frequenz bedeutet höhere Photonenenergie',
        'Photoeffekt braucht ausreichend große Frequenz',
        'E hängt nur von der Intensität ab, nie von f',
        'h ist die Elementarladung',
      ],
      correct: [
        'h ist das plancksche Wirkungsquantum',
        'Höhere Frequenz bedeutet höhere Photonenenergie',
        'Photoeffekt braucht ausreichend große Frequenz',
      ],
      solution: 'h = Wirkungsquantum; E ∝ f; Grenzfrequenz nötig.',
      explanation: 'Falsch: Energie nur von Intensität; h = Elementarladung.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
)

/** LB4 — Strahlung */
const strahlung: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Welche Strahlung besteht aus Heliumkernen (²He)?',
        correct: 'Alpha-Strahlung',
        wrong: ['Beta-Strahlung', 'Gamma-Strahlung', 'sichtbares Licht'],
        explanation: 'α-Teilchen = Heliumkerne (2p+2n), stark ionisierend, geringe Reichweite.',
      },
      {
        q: 'Beta-Strahlung besteht typischerweise aus …',
        correct: 'Elektronen (oder Positronen)',
        wrong: ['Heliumkernen', 'reinen Photonen ohne Ladung', 'Neutronen allein'],
        explanation: 'β⁻: Elektronen; β⁺: Positronen aus dem Kernzerfall.',
      },
      {
        q: 'Gamma-Strahlung ist …',
        correct: 'energiereiche elektromagnetische Strahlung (Photonen)',
        wrong: [
          'ein Strom aus Heliumkernen',
          'langsame Neutrino-Materieblöcke',
          'sichtbares Licht mit Masse',
        ],
        explanation: 'γ-Quanten sind Photonen sehr hoher Energie, ungeladen, große Durchdringung.',
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: c.explanation,
      instruction: 'Tippe die passende Strahlungsart:',
    })
  },
  (rng) => {
    const N0 = pick(rng, [16, 32, 64, 80, 100])
    const steps = pick(rng, [1, 2, 3])
    let N = N0
    for (let i = 0; i < steps; i++) N = N / 2
    // Nur ganzzahlige Endwerte
    if (N % 1 !== 0) {
      const N0b = 64
      const stepsB = 2
      const Nb = N0b / 4
      return numberLineTask({
        question: `Start: N₀ = ${N0b} Kerne. Nach ${stepsB} Halbwertszeiten ist N = N₀ / 2^${stepsB}. Stelle N ein.`,
        min: 0,
        max: N0b,
        step: 1,
        value: Nb,
        solution: `${Nb}`,
        explanation: `Nach jeder Halbwertszeit halbiert sich N: ${N0b} → ${N0b / 2} → ${Nb}.`,
      })
    }
    return numberLineTask({
      question: `Start: N₀ = ${N0} Kerne. Nach ${steps} Halbwertszeit${steps === 1 ? '' : 'en'} ist N = N₀ / 2^${steps}. Stelle N ein.`,
      min: 0,
      max: N0,
      step: 1,
      value: N,
      solution: `${N}`,
      explanation: `Jede Halbwertszeit halbiert die Anzahl: nach ${steps} Schritt${steps === 1 ? '' : 'en'} N = ${N0} / ${2 ** steps} = ${N}.`,
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Kernspaltung bedeutet qualitativ …',
        correct: 'ein schwerer Kern zerfällt in leichtere Bruchstücke',
        wrong: [
          'leichte Kerne verschmelzen zu einem schwereren',
          'nur Elektronen werden freigesetzt ohne Kern',
          'Atome verlieren nur ihre Hülle ohne Kernprozess',
        ],
        explanation: 'Spaltung: schwerer Kern → leichtere Kerne (+ Neutronen, Energie).',
      },
      {
        q: 'Kernfusion bedeutet qualitativ …',
        correct: 'leichte Kerne verschmelzen zu einem schwereren Kern',
        wrong: [
          'ein Uran-Kern zerfällt spontan in viele α-Teilchen allein',
          'Photonen werden zu Protonen',
          'Moleküle verdampfen ohne Kern',
        ],
        explanation: 'Fusion: z. B. Wasserstoffisotope → Helium (wie in der Sonne).',
      },
      {
        q: 'Was unterscheidet Spaltung und Fusion?',
        correct: 'Spaltung: schwer → leicht; Fusion: leicht → schwer',
        wrong: [
          'beide sind identisch',
          'Fusion braucht immer Alpha-Zerfall',
          'Spaltung gibt es nur bei Photonen',
        ],
        explanation: 'Gegensätzliche Kernprozesse; beide können Energie freisetzen.',
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: c.explanation,
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** Wahl — Anwendungen der Physik */
const anwendungen: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Welche Anwendung nutzt radioaktive Strahlung / Kernphysik?',
        correct: 'medizinische Bildgebung / Strahlentherapie (kontrolliert)',
        wrong: [
          'nur zum Kochen ohne Physik',
          'als reiner Farbfilter ohne Strahlung',
          'zum Messen von Lautstärke ohne Sensor',
        ],
      },
      {
        q: 'Laserlicht wird u. a. eingesetzt …',
        correct: 'in Scannern, Entfernungsmessern und der Medizin',
        wrong: [
          'nur als Heizölersatz',
          'nur zur Kernspaltung im Haushalt',
          'nie in der Technik',
        ],
      },
      {
        q: 'Halbleiter und Quantenphysik ermöglichen …',
        correct: 'moderne Elektronik (z. B. Transistoren, LEDs)',
        wrong: [
          'nur Dampfmaschinen ohne Elektronik',
          'nur mechanische Uhren ohne Strom',
          'keine technischen Geräte',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Physikalische Prinzipien stecken in Medizintechnik, Laser und Elektronik.',
      instruction: 'Tippe die passende Anwendung:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Technikbeispiele passen zur Physik der Oberstufe? (mehrere möglich)',
      choices: [
        'Röntgenaufnahme in der Medizin',
        'LED auf Quanten-/Halbleiterbasis',
        'GPS mit relativistischen Korrekturen',
        'Brot backen ohne Temperaturmessung als Kernfusion',
        'Schattenwurf als Beweis für Kernspaltung',
      ],
      correct: [
        'Röntgenaufnahme in der Medizin',
        'LED auf Quanten-/Halbleiterbasis',
        'GPS mit relativistischen Korrekturen',
      ],
      solution: 'Röntgen, LED, GPS — nicht Backen als Fusion oder Schatten als Spaltung.',
      explanation: 'Viele Alltagstechniken nutzen Wellen-, Quanten- oder Relativitätseffekte.',
      instruction: 'Tippe alle passenden Beispiele:',
    }),
  (rng) => {
    const correct = 'Physik liefert Modelle und Messmethoden für Technik'
    return choicePickTask({
      question: 'Welche Aussage trifft am besten zu?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'Technik braucht keine physikalischen Größen',
          'Nur Biologie steuert alle Sensoren',
          'Physik gilt nur im Weltall',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation: 'Von Sensorik bis Energieumwandlung: Technik baut auf Physik auf.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** Wahl — Optische Phänomene */
const optikWahl: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Ein Regenbogen entsteht vor allem durch …',
        correct: 'Brechung, Reflexion und Dispersion in Regentropfen',
        wrong: [
          'nur Beugung am Spalt ohne Tropfen',
          'Kernspaltung in Wolken',
          'reine Absorption ohne Licht',
        ],
        explanation:
          'Sonnenlicht wird in Tropfen gebrochen, reflektiert und nach Wellenlänge zerlegt (Dispersion).',
      },
      {
        q: 'Dispersion bedeutet …',
        correct: 'Abhängigkeit der Brechzahl von der Wellenlänge (Farben trennen sich)',
        wrong: [
          'dass alle Farben immer gleich schnell im Glas laufen',
          'dass Licht nur reflektiert, nie gebrochen wird',
          'dass Schall Farben erzeugt',
        ],
        explanation: 'Unterschiedliche Wellenlängen werden unterschiedlich stark gebrochen.',
      },
      {
        q: 'Am Prisma wird weißes Licht …',
        correct: 'in Spektralfarben zerlegt',
        wrong: [
          'zu einem einzigen Grauton ohne Spektrum',
          'vollständig in Materie umgewandelt',
          'nur reflektiert ohne Brechung',
        ],
        explanation: 'Dispersion am Prisma erzeugt das Farbspektrum.',
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: c.explanation,
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Aussagen zu Regenbogen und Dispersion stimmen? (mehrere möglich)',
      choices: [
        'Regentropfen brechen und reflektieren Licht',
        'Unterschiedliche Farben werden unterschiedlich stark gebrochen',
        'Weißes Licht enthält viele Wellenlängen',
        'Regenbogen entsteht ohne Sonne und ohne Tropfen',
        'Dispersion bedeutet, dass Farbe und Wellenlänge irrelevant sind',
      ],
      correct: [
        'Regentropfen brechen und reflektieren Licht',
        'Unterschiedliche Farben werden unterschiedlich stark gebrochen',
        'Weißes Licht enthält viele Wellenlängen',
      ],
      solution: 'Tropfen + Dispersion + Spektrum des weißen Lichts.',
      explanation: 'Ohne Sonne/Tropfen kein Regenbogen; Dispersion hängt von der Wellenlänge ab.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
  (rng) => {
    const ordered = [
      { label: 'weißes Licht trifft auf Prisma/Tropfen', value: 1 },
      { label: 'Brechung abhängig von der Farbe', value: 2 },
      { label: 'Spektrum / Regenbogen sichtbar', value: 3 },
    ]
    const items = [...ordered]
    for (let i = items.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[items[i], items[j]] = [items[j]!, items[i]!]
    }
    const correctOrder = ordered.map((row) => items.findIndex((it) => it.value === row.value))
    return dragDropSortTask({
      question: 'Ordne den Ablauf der Dispersion.',
      items,
      correctOrder,
      solution: ordered.map((row) => row.label).join(' → '),
      explanation: 'Einfall → wellenlängenabhängige Brechung → sichtbares Spektrum.',
    })
  },
)

/** Wahl — Akustik */
const akustik: Topic['generate'] = mixedVariants(
  (rng) => {
    const intPairs = [
      { f: 1, T: 1 },
      { f: 2, T: 0.5 },
      { f: 4, T: 0.25 },
      { f: 5, T: 0.2 },
      { f: 10, T: 0.1 },
      { f: 20, T: 0.05 },
    ] as const
    const { f, T } = pick(rng, [...intPairs])
    const mode = pick(rng, ['T', 'f'] as const)
    if (mode === 'T') {
      return valueTask({
        question: `Eine Schallschwingung hat die Frequenz f = ${f} Hz. Berechne die Periodendauer T = 1 / f.`,
        answerKind: T % 1 === 0 ? 'integer' : 'decimal',
        unit: 's',
        value: T,
        solution: `${T} s`,
        explanation: `T = 1 / f = 1 / ${f} = ${T} s.`,
      })
    }
    return valueTask({
      question: `Die Periodendauer einer Schwingung beträgt T = ${T} s. Berechne f = 1 / T.`,
      answerKind: 'integer',
      unit: 'Hz',
      value: f,
      solution: `${f} Hz`,
      explanation: `f = 1 / T = 1 / ${T} = ${f} Hz.`,
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Die Schallgeschwindigkeit in Luft (Raumtemperatur) ist näherungsweise …',
        correct: 'etwa 340 m/s',
        wrong: ['etwa 3 · 10⁸ m/s', 'etwa 1 m/s', 'etwa 340 km/s'],
        explanation: 'Schall in Luft ≈ 340 m/s; Licht ≈ 3 · 10⁸ m/s — nicht verwechseln.',
      },
      {
        q: 'Schall braucht zum Ausbreiten …',
        correct: 'ein Medium (z. B. Luft, Wasser, Festkörper)',
        wrong: [
          'kein Medium (auch im Vakuum wie Licht)',
          'nur Magnetfelder',
          'nur elektrische Ladung',
        ],
        explanation: 'Schall ist eine mechanische Welle und braucht Materie; im Vakuum gibt es keinen Schall.',
      },
      {
        q: 'In Wasser ist die Schallgeschwindigkeit im Vergleich zu Luft typischerweise …',
        correct: 'größer',
        wrong: ['viel kleiner', 'genau null', 'gleich der Lichtgeschwindigkeit'],
        explanation: 'In dichteren/elastischeren Medien ist v_Schall oft größer (Wasser > Luft).',
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: c.explanation,
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Aussagen zur Akustik stimmen? (mehrere möglich)',
      choices: [
        'Es gilt T = 1 / f',
        'Höhere Frequenz bedeutet kürzere Periodendauer',
        'Schall braucht ein Medium',
        'Schallgeschwindigkeit in Luft ≈ Lichtgeschwindigkeit',
        'Im Vakuum hört man Schall genauso gut wie in Luft',
      ],
      correct: [
        'Es gilt T = 1 / f',
        'Höhere Frequenz bedeutet kürzere Periodendauer',
        'Schall braucht ein Medium',
      ],
      solution: 'T = 1/f; f groß → T klein; Medium nötig.',
      explanation: 'Schall ≠ Lichtgeschwindigkeit; im Vakuum kein Schall.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
)

export const PHYSIK_J12GK_GENERATORS: Record<string, Topic['generate']> = {
  'ph-j12gk-lb1-licht': licht,
  'ph-j12gk-lb2-optik': optik,
  'ph-j12gk-lb3-quanten': quanten,
  'ph-j12gk-lb4-strahlung': strahlung,
  'ph-j12gk-lbw-anwendungen': anwendungen,
  'ph-j12gk-lbw-optik': optikWahl,
  'ph-j12gk-lbw-akustik': akustik,
}
