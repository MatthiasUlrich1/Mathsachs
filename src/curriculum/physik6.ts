import { pick, randInt, type Rng } from '../lib/rng'
import {
  augeSehSvg,
  circuitSvg,
  circuitSymbolLabel,
  circuitSymbolSvg,
  circuitSymbolsRowSvg,
  type CircuitSymbolKind,
  daemmstoffCompareSvg,
  eclipseArrangementSvg,
  farbfilterSvg,
  kernHalbschattenSvg,
  lightRayHintSvg,
  lightShadowSvg,
  lochkameraSvg,
  mirrorAngleSvg,
  moonPhaseSvg,
  type MoonPhaseKind,
  prismaSpektrumSvg,
  seriesParallelSvg,
  thermometerSvg,
  wegZeitCompareSvg,
  wegZeitDiagramSvg,
} from '../lib/physikSvg'
import {
  choicePickTask,
  coordinateClickTask,
  dragDropSlotsTask,
  dragDropSortTask,
  mixedVariants,
  multiSelectTask,
  numberLineTask,
  paramSliderTask,
  valueTask,
  visualTask,
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

/** LB1 — Licht und Schatten */
const schatten: Topic['generate'] = mixedVariants(
  (rng) => {
    const lampLeft = pick(rng, [true, false])
    const shadowSide: 'left' | 'right' = lampLeft ? 'right' : 'left'
    const correct = shadowSide === 'left' ? 'links vom Körper' : 'rechts vom Körper'
    const wrong = shadowSide === 'left' ? 'rechts vom Körper' : 'links vom Körper'
    return choicePickTask({
      question:
        'Wo liegt der Schatten des Körpers, wenn die Lampe wie in der Abbildung steht?',
      choices: shuffleChoices(rng, [correct, wrong, 'unter dem Körper', 'über dem Körper'], correct),
      correct,
      solution: correct,
      explanation:
        'Licht breitet sich geradlinig aus. Der Schatten liegt auf der dem Licht abgewandten Seite des Körpers.',
      visualContent: lightShadowSvg({ lampLeft, shadowSide, showShadow: false }),
      solutionVisualContent: lightShadowSvg({ lampLeft, shadowSide, showShadow: true }),
      instruction: 'Tippe die Schattenseite:',
    })
  },
  (rng) => {
    // Schatten fest zeigen — Lampe ohne Zahlenanzeige so einstellen, dass es passt.
    const shadowSide = pick(rng, ['left', 'right'] as const)
    const lampCorrect = shadowSide === 'left' ? pick(rng, [2, 3, 4, 5]) : pick(rng, [-5, -4, -3, -2])
    const start = shadowSide === 'left' ? -3 : 3
    return paramSliderTask({
      question:
        'Der Schatten liegt schon fest. Stelle die Lampe so ein, dass sie zum gezeigten Schatten passt (Licht und Schatten liegen auf gegenüberliegenden Seiten des Körpers).',
      params: [
        {
          id: 'lamp',
          label: 'Lampe verschieben',
          min: -5,
          max: 5,
          step: 1,
          start,
          hideValue: true,
        },
      ],
      correct: { lamp: lampCorrect },
      match: 'sign',
      fixedShadowSide: shadowSide,
      solution:
        shadowSide === 'left'
          ? 'Lampe rechts vom Körper → Schatten links'
          : 'Lampe links vom Körper → Schatten rechts',
      explanation:
        'Licht breitet sich geradlinig aus. Der Schatten entsteht auf der dem Licht abgewandten Seite.',
      preview: 'shadow',
      instruction: 'Schiebe die Lampe, bis sie zum Schatten passt (ohne Zahlenangabe):',
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Zwei Lampen beleuchten einen undurchsichtigen Körper. Welche Schattenarten entstehen?',
        correct: 'Kernschatten und Halbschatten',
        wrong: ['nur Kernschatten', 'nur Lichtkegel', 'keine Schatten'],
      },
      {
        q: 'Im Kernschatten hinter dem Körper …',
        correct: 'kommt von keiner der Lampen Licht an',
        wrong: [
          'kommt Licht von allen Lampen an',
          'gibt es immer mehr Licht als davor',
          'entsteht nur bei durchsichtigen Körpern',
        ],
      },
      {
        q: 'Im Halbschatten …',
        correct: 'kommt Licht von mindestens einer Lampe nicht an',
        wrong: [
          'kommt nie Licht an',
          'gibt es immer volles Licht aller Lampen',
          'gibt es nur bei einer einzigen Lampe Schatten',
        ],
      },
      {
        q: 'Eine punktförmige Lampe erzeugt hinter einem undurchsichtigen Körper vor allem …',
        correct: 'einen scharfen Schatten',
        wrong: ['gar keinen Schatten', 'nur Halbschatten ohne Kern', 'einen Lichtkegel ohne Schatten'],
      },
      {
        q: 'Je näher die Lampe am Körper steht, desto …',
        correct: 'größer wird (bei festem Schirm) der Schatten',
        wrong: [
          'kleiner wird immer der Schatten',
          'verschwindet der Schatten',
          'wird der Körper durchsichtig',
        ],
      },
      {
        q: 'Welche Körper werfen einen Schatten?',
        correct: 'undurchsichtige (opake) Körper',
        wrong: ['nur durchsichtige Körper', 'nur Gase', 'nur Spiegel'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Bei mehreren Lichtquellen: Kernschatten = von keiner Lampe erreicht; Halbschatten = nur von einem Teil der Lampen erreicht.',
      visualContent: kernHalbschattenSvg(),
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = pick(rng, [
      ['Sonne', 'brennende Kerze', 'Autoscheinwerfer'],
      ['Sonne', 'Kerze', 'Stern'],
    ])
    const pool =
      correct[2] === 'Autoscheinwerfer'
        ? ['Sonne', 'brennende Kerze', 'Autoscheinwerfer', 'Mond', 'Fahrrad-Rückstrahler', 'Tisch']
        : ['Sonne', 'Kerze', 'Stern', 'Mond', 'Wand', 'Buch']
    return multiSelectTask({
      question: 'Welche sind echte Lichtquellen (senden selbst Licht aus)? (mehrere möglich)',
      choices: pool,
      correct,
      solution: correct.join('; '),
      explanation:
        'Lichtquellen senden selbst Licht aus. Mond und Rückstrahler sind beleuchtete Körper.',
      instruction: 'Tippe alle Lichtquellen:',
    })
  },
)

/** LB1 — Kern- und Halbschatten (eigenes Thema; ≥10 unique stems) */
const kernschatten: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Zwei Lampen beleuchten einen undurchsichtigen Körper. Welche Schattenarten entstehen?',
        correct: 'Kernschatten und Halbschatten',
        wrong: ['nur Kernschatten', 'nur Lichtkegel', 'keine Schatten'],
      },
      {
        q: 'Im Kernschatten hinter dem Körper …',
        correct: 'kommt von keiner der Lampen Licht an',
        wrong: [
          'kommt Licht von allen Lampen an',
          'gibt es immer mehr Licht als davor',
          'entsteht nur bei durchsichtigen Körpern',
        ],
      },
      {
        q: 'Im Halbschatten …',
        correct: 'kommt Licht von mindestens einer Lampe nicht an',
        wrong: [
          'kommt nie Licht an',
          'gibt es immer volles Licht aller Lampen',
          'gibt es nur bei einer einzigen Lampe Schatten',
        ],
      },
      {
        q: 'Eine punktförmige Lampe erzeugt hinter einem undurchsichtigen Körper vor allem …',
        correct: 'einen scharfen Schatten',
        wrong: ['gar keinen Schatten', 'nur Halbschatten ohne Kern', 'einen Lichtkegel ohne Schatten'],
      },
      {
        q: 'Wann entsteht hinter einem Körper ein Halbschatten?',
        correct: 'wenn mehrere ausgedehnte Lichtquellen den Körper beleuchten',
        wrong: [
          'nur bei einer einzigen Punktlichtquelle',
          'nur ohne jede Lichtquelle',
          'nur bei durchsichtigen Körpern',
        ],
      },
      {
        q: 'Der Kernschatten ist der Bereich …',
        correct: 'der von keiner Lichtquelle erreicht wird',
        wrong: [
          'der von allen Lampen voll beleuchtet wird',
          'der immer heller als die Umgebung ist',
          'ohne Bezug zur Lampenzahl',
        ],
      },
      {
        q: 'Der Halbschatten ist der Bereich …',
        correct: 'der nur von einem Teil der Lampen beleuchtet wird',
        wrong: [
          'in den nie Licht gelangt',
          'der nur bei einer Lampe existiert',
          'ohne Schattenwirkung',
        ],
      },
      {
        q: 'Bei nur einer punktförmigen Lichtquelle gibt es typischerweise …',
        correct: 'einen scharfen Schatten ohne ausgeprägten Halbschatten',
        wrong: [
          'nur Halbschatten ohne Kern',
          'gar keinen Schatten',
          'immer Kern- und Halbschatten wie bei vielen Lampen',
        ],
      },
      {
        q: 'Zwei Lampen, Körper und Schirm: Wo ist es am dunkelsten?',
        correct: 'im Kernschatten',
        wrong: ['im Halbschatten', 'direkt vor dem Körper zur Lampe hin', 'überall gleich hell'],
      },
      {
        q: 'Was beschreibt die Abbildung mit Kern- und Halbschatten richtig?',
        correct: 'Kernschatten dunkler, Halbschatten nur teilweise verdunkelt',
        wrong: [
          'Halbschatten dunkler als Kernschatten',
          'beide Bereiche gleich hell',
          'es gibt nur Lichtkegel ohne Schatten',
        ],
      },
      {
        q: 'Mehrere Lampen → der Übergang vom Kern- zum Halbschatten …',
        correct: 'zeigt, welche Lampen den Ort noch erreichen',
        wrong: [
          'bedeutet, dass Licht kreisförmig läuft',
          'entsteht nur ohne Schirm',
          'gilt nur für Spiegel',
        ],
      },
      {
        q: 'Ein undurchsichtiger Körper wirft Kern-/Halbschatten, weil …',
        correct: 'er Licht abschirmt und die Lampen unterschiedliche Bereiche erreichen',
        wrong: [
          'er selbst Licht aussendet wie die Sonne',
          'Luft das Licht immer löscht',
          'Schatten ohne Lichtquellen entstehen',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Bei mehreren Lichtquellen: Kernschatten = von keiner Lampe erreicht; Halbschatten = nur von einem Teil der Lampen erreicht.',
      visualContent: kernHalbschattenSvg(),
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const pools = [
      {
        question: 'Welche Aussagen zu Kern- und Halbschatten stimmen? (mehrere möglich)',
        choices: [
          'Im Kernschatten kommt von keiner Lampe Licht an',
          'Im Halbschatten fehlt Licht von mindestens einer Lampe',
          'Eine punktförmige Lampe erzeugt vor allem einen scharfen Schatten',
          'Halbschatten entsteht nur ohne jede Lichtquelle',
          'Kernschatten ist der hellste Bereich hinter dem Körper',
        ],
        correct: [
          'Im Kernschatten kommt von keiner Lampe Licht an',
          'Im Halbschatten fehlt Licht von mindestens einer Lampe',
          'Eine punktförmige Lampe erzeugt vor allem einen scharfen Schatten',
        ],
      },
      {
        question: 'Welche Beobachtungen passen zu mehreren Lampen? (mehrere möglich)',
        choices: [
          'Es kann Kernschatten und Halbschatten geben',
          'Bereiche, die von allen Lampen erreicht werden, sind hell',
          'Der Kernschatten ist von keiner Lampe beleuchtet',
          'Schatten entstehen nur bei durchsichtigen Körpern',
          'Ohne Körper gibt es trotzdem Kernschatten',
        ],
        correct: [
          'Es kann Kernschatten und Halbschatten geben',
          'Bereiche, die von allen Lampen erreicht werden, sind hell',
          'Der Kernschatten ist von keiner Lampe beleuchtet',
        ],
      },
    ] as const
    const p = pick(rng, [...pools])
    return multiSelectTask({
      question: p.question,
      choices: [...p.choices],
      correct: [...p.correct],
      solution: p.correct.join('; '),
      explanation:
        'Kernschatten: keine Lampe erreicht den Ort. Halbschatten: nur ein Teil der Lampen. Punktlampe → scharfer Schatten.',
      visualContent: kernHalbschattenSvg(),
      instruction: 'Tippe alle richtigen Aussagen:',
    })
  },
)

const spiegel: Topic['generate'] = mixedVariants(
  (rng) => {
    const alpha = pick(rng, [20, 30, 35, 40, 45, 50, 55, 60])
    return choicePickTask({
      question: `Am ebenen Spiegel beträgt der Einfallswinkel ${alpha}°. Wie groß ist der Ausfallswinkel?`,
      choices: shuffleChoices(
        rng,
        [`${alpha}°`, `${90 - alpha}°`, `${180 - alpha}°`, `${alpha + 10}°`],
        `${alpha}°`,
      ),
      correct: `${alpha}°`,
      solution: `${alpha}°`,
      explanation:
        'Reflexionsgesetz: Einfallswinkel = Ausfallswinkel (beide gegen das Lot gemessen).',
      visualContent: mirrorAngleSvg(alpha),
      instruction: 'Tippe den Ausfallswinkel:',
    })
  },
  (rng) => {
    const alpha = randInt(rng, 15, 70)
    return valueTask({
      question: `Einfallswinkel am ebenen Spiegel: ${alpha}°. Gib den Ausfallswinkel in Grad an.`,
      answerKind: 'integer',
      unit: '°',
      value: alpha,
      solution: `${alpha}°`,
      explanation: 'Einfallswinkel = Ausfallswinkel.',
    })
  },
)

/** LB1 — Brechung und Prisma (nicht Spiegelung!) */
const brechung: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Licht geht von Luft in Glas. Was passiert mit dem Strahl am Lot?',
        correct: 'Er wird zum Lot hin gebrochen',
        wrong: [
          'Er wird vom Lot weg gebrochen',
          'Einfallswinkel = Ausfallswinkel wie am Spiegel',
          'Er wird immer totalreflektiert',
        ],
      },
      {
        q: 'Licht geht von Glas in Luft. Was passiert typischerweise?',
        correct: 'Der Strahl wird vom Lot weg gebrochen',
        wrong: [
          'Der Strahl wird immer zum Lot hin gebrochen',
          'Es gibt nie Brechung',
          'Nur Spiegelung ohne Brechung',
        ],
      },
      {
        q: 'Wozu dient das Lot bei der Brechung?',
        correct: 'Winkel werden gegen die Senkrechte zur Grenzfläche gemessen',
        wrong: [
          'Es ist der Lichtstrahl selbst',
          'Es misst nur die Temperatur',
          'Es ersetzt das Prisma',
        ],
      },
      {
        q: 'Ein Prisma aus Glas lenkt weißes Licht ab und …',
        correct: 'kann Spektralfarben erzeugen (Dispersion)',
        wrong: [
          'löscht immer alles Licht',
          'wirkt nur wie ein ebener Spiegel',
          'ändert die Lichtgeschwindigkeit nicht relativ zu Luft',
        ],
      },
      {
        q: 'Optisch dichteres Medium bedeutet (qualitativ):',
        correct: 'Licht ist dort langsamer, Brechung zum Lot beim Eintritt',
        wrong: [
          'Licht ist immer schneller',
          'Es gibt keine Grenzfläche',
          'Nur bei Spiegeln relevant',
        ],
      },
      {
        q: 'Beim Übergang Luft → Wasser wird der Strahl …',
        correct: 'zum Lot hin gebrochen',
        wrong: [
          'vom Lot weg gebrochen',
          'nie gebrochen',
          'nur reflektiert wie am Spiegel',
        ],
      },
      {
        q: 'Beim Übergang Wasser → Luft wird der Strahl …',
        correct: 'vom Lot weg gebrochen',
        wrong: [
          'immer zum Lot hin gebrochen',
          'zu Schall',
          'ohne Richtungsänderung',
        ],
      },
      {
        q: 'Welche Farbe wird in Glas typischerweise am stärksten gebrochen?',
        correct: 'Violett / Blau stärker als Rot',
        wrong: [
          'Rot stärker als Violett',
          'Alle Farben gleich ohne Dispersion',
          'Nur Grün wird gebrochen',
        ],
      },
      {
        q: 'Ein Lichtstrahl trifft senkrecht (0° zum Lot) auf Glas. Was passiert?',
        correct: 'Er geht ohne Richtungsänderung weiter (kein Brechungswinkel)',
        wrong: [
          'Er wird maximal vom Lot weg gebrochen',
          'Er wird immer totalreflektiert',
          'Er bleibt im Glas stecken',
        ],
      },
      {
        q: 'Totalreflexion kann auftreten, wenn Licht …',
        correct: 'vom dichteren ins dünnere Medium kommt und der Winkel groß genug ist',
        wrong: [
          'nur von Luft nach Glas geht',
          'nur bei Spiegeln vorkommt',
          'bei jedem Einfallswinkel 0° passiert',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Brechung: Übergang zwischen Medien. Luft→Glas: zum Lot; Glas→Luft: vom Lot. Prisma: Ablenkung + oft Dispersion.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (_rng) => {
    return multiSelectTask({
      question: 'Was gehört zur Brechung am Prisma? (mehrere möglich)',
      choices: [
        'Strahl wird an den Grenzflächen gebrochen',
        'Ablenkung hängt vom Prismenwinkel ab',
        'Weißes Licht kann in Farben zerlegt werden',
        'Einfallswinkel = Ausfallswinkel wie am Spiegel',
        'Licht braucht kein Lot zur Winkelmessung',
      ],
      correct: [
        'Strahl wird an den Grenzflächen gebrochen',
        'Ablenkung hängt vom Prismenwinkel ab',
        'Weißes Licht kann in Farben zerlegt werden',
      ],
      solution: 'Brechung an Grenzflächen, Ablenkung, Dispersion',
      explanation:
        'Am Prisma gilt Brechung (nicht das Spiegelgesetz Einfall = Ausfall).',
      instruction: 'Tippe alle zutreffenden Aussagen:',
    })
  },
  (rng) => {
    const items = [
      { label: 'Luft (dünner)', value: 1 },
      { label: 'Grenzfläche mit Lot', value: 2 },
      { label: 'Glas (dichter), zum Lot gebrochen', value: 3 },
    ]
    const ordered = [...items]
    const shuffled = [...items]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
    }
    const correctOrder = ordered.map((row) => shuffled.findIndex((it) => it.value === row.value))
    return dragDropSortTask({
      question: 'Ordne den Weg bei Brechung Luft → Glas.',
      items: shuffled,
      correctOrder,
      solution: ordered.map((r) => r.label).join(' → '),
      explanation: 'Vom dünneren Medium zur Grenzfläche, dann im dichteren Medium zum Lot hin.',
    })
  },
)

const ausbreitung: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Wie breitet sich Licht in Luft (ohne Spiegel/Linse) aus?',
        correct: 'geradlinig',
        wrong: ['kreisrund', 'nur nach oben', 'zufällig'],
      },
      {
        q: 'Warum entstehen bei einer Punktlichtquelle scharfe Schatten?',
        correct: 'weil Licht sich geradlinig ausbreitet',
        wrong: [
          'weil Licht nur nach oben läuft',
          'weil Schatten ohne Licht entsteht',
          'weil Luft das Licht kreisförmig streut',
        ],
      },
      {
        q: 'Ein Lichtstrahl durch zwei Löcher hintereinander zeigt vor allem …',
        correct: 'geradlinige Ausbreitung',
        wrong: ['kreisförmige Ausbreitung', 'Ausbreitung nur nach unten', 'keine Ausbreitung'],
      },
      {
        q: 'Was gilt für Licht in homogenen Medien (z. B. Luft)?',
        correct: 'Es läuft geradlinig.',
        wrong: ['Es läuft nur im Kreis.', 'Es bleibt stehen.', 'Es läuft nur nach links.'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'In homogenen Medien breitet sich Licht geradlinig aus — deshalb entstehen scharfe Schatten.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const pools = [
      {
        question: 'Welche Aussagen zum Licht stimmen? (mehrere möglich)',
        choices: [
          'Licht breitet sich geradlinig aus',
          'Schatten entsteht hinter dem Körper',
          'Zum Sehen braucht es Licht vom Gegenstand zum Auge',
          'Licht läuft nur nach oben',
          'Ohne Lichtquelle gibt es trotzdem Schatten',
        ],
        correct: [
          'Licht breitet sich geradlinig aus',
          'Schatten entsteht hinter dem Körper',
          'Zum Sehen braucht es Licht vom Gegenstand zum Auge',
        ],
      },
      {
        question: 'Welche Beobachtungen passen zur geradlinigen Ausbreitung? (mehrere möglich)',
        choices: [
          'scharfe Schatten hinter undurchsichtigen Körpern',
          'Lichtfleck hinter zwei hintereinanderliegenden Löchern',
          'Licht läuft nur im Kreis um die Lampe',
          'Sonnenstrahlen als „Strahlenbüschel“ im Staub',
          'Schatten ohne jede Lichtquelle',
        ],
        correct: [
          'scharfe Schatten hinter undurchsichtigen Körpern',
          'Lichtfleck hinter zwei hintereinanderliegenden Löchern',
          'Sonnenstrahlen als „Strahlenbüschel“ im Staub',
        ],
      },
    ] as const
    const p = pick(rng, [...pools])
    return multiSelectTask({
      question: p.question,
      choices: [...p.choices],
      correct: [...p.correct],
      solution: p.correct.join('; '),
      explanation: 'Falsch sind Aussagen, die Licht nur nach oben oder Schatten ohne Lichtquelle behaupten.',
      instruction: 'Tippe alle richtigen Aussagen:',
    })
  },
  (rng) => {
    // Taschenlampe auf Kästchenpapier: zwei Punkte vorgegeben, Strahl verlängern — ohne Antwortkoordinaten in der Frage.
    const y = randInt(rng, 1, 3)
    const ax = randInt(rng, 0, 2)
    const dx = pick(rng, [1, 2])
    const throughX = ax + dx
    const targetX = Math.min(6, throughX + dx)
    // Ensure target is strictly beyond the slit
    const tx = targetX > throughX ? targetX : Math.min(6, throughX + 1)
    const through = { x: throughX, y }
    const target = { x: tx, y }
    return coordinateClickTask({
      question:
        'Taschenlampe und Spalt sind markiert. Zeichne den Lichtstrahl weiter: Tippe einen Gitterpunkt auf der geraden Verlängerung.',
      x: target.x,
      y: target.y,
      xRange: [0, 6],
      yRange: [0, 5],
      solution: 'Jeder Gitterpunkt auf der Verlängerung hinter dem Spalt (gleiche Richtung)',
      explanation: `Geradlinige Ausbreitung: von (${ax}|${y}) durch (${through.x}|${through.y}) weiter in dieselbe Richtung — Abstand egal.`,
      visualContent: lightRayHintSvg({ from: { x: ax, y }, through }),
      markers: [
        { x: ax, y, label: 'Lampe', color: '#f59e0b' },
        { x: through.x, y: through.y, label: 'Spalt', color: '#64748b' },
      ],
      guide: { from: { x: ax, y }, to: through },
      solutionRay: { from: { x: ax, y }, to: { x: 6, y } },
      acceptForwardRay: { from: { x: ax, y }, through },
      instruction: 'Tippe einen Punkt auf dem Lichtstrahl:',
    })
  },
)

const lampenposition: Topic['generate'] = mixedVariants(
  (rng) => {
    const shadowSide = pick(rng, ['left', 'right'] as const)
    const lampCorrect = shadowSide === 'left' ? pick(rng, [2, 3, 4, 5]) : pick(rng, [-5, -4, -3, -2])
    const start = shadowSide === 'left' ? -4 : 4
    return paramSliderTask({
      question:
        'Schatten und Körper sind gegeben. Positioniere die Lampe so, dass der Schatten zur Lampenstellung passt.',
      params: [
        {
          id: 'lamp',
          label: 'Lampe',
          min: -5,
          max: 5,
          step: 1,
          start,
          hideValue: true,
        },
      ],
      correct: { lamp: lampCorrect },
      match: 'sign',
      fixedShadowSide: shadowSide,
      solution:
        shadowSide === 'left'
          ? 'Lampe rechts → Schatten links'
          : 'Lampe links → Schatten rechts',
      explanation:
        'Ohne Zahlenangabe: Entscheide anhand der Abbildung, auf welcher Seite die Lampe stehen muss.',
      preview: 'shadow',
      instruction: 'Schiebe die Lampe, bis sie zum Schatten passt:',
    })
  },
  (rng) => {
    const lampLeft = pick(rng, [true, false])
    const shadowSide: 'left' | 'right' = lampLeft ? 'right' : 'left'
    const correct = lampLeft ? 'rechts vom Körper' : 'links vom Körper'
    return choicePickTask({
      question: `Die Lampe steht ${lampLeft ? 'links' : 'rechts'} vom Körper. Wohin fällt der Schatten?`,
      choices: shuffleChoices(
        rng,
        [correct, lampLeft ? 'links vom Körper' : 'rechts vom Körper', 'über dem Körper', 'unter dem Körper'],
        correct,
      ),
      correct,
      solution: correct,
      explanation: 'Schatten entsteht auf der dem Licht abgewandten Seite.',
      visualContent: lightShadowSvg({
        lampLeft,
        shadowSide,
        showShadow: false,
      }),
      solutionVisualContent: lightShadowSvg({
        lampLeft,
        shadowSide,
        showShadow: true,
      }),
      instruction: 'Tippe die Schattenseite:',
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Die Lampe rückt näher an den Körper (Schirm fest). Was passiert mit dem Schatten?',
        correct: 'Er wird größer',
        wrong: ['Er wird kleiner', 'Er verschwindet', 'Er wandert auf die Lampenseite'],
      },
      {
        q: 'Die Lampe rückt weiter vom Körper weg (Schirm fest). Was passiert mit dem Schatten?',
        correct: 'Er wird kleiner',
        wrong: ['Er wird größer', 'Er wird zum Kernschatten ohne Halbschatten', 'Er wechselt die Seite ohne Lampenwechsel'],
      },
      {
        q: 'Wohin musst du die Lampe stellen, damit der Schatten rechts vom Körper liegt?',
        correct: 'links vom Körper',
        wrong: ['rechts vom Körper', 'genau über dem Körper', 'unter dem Körper'],
      },
      {
        q: 'Wohin musst du die Lampe stellen, damit der Schatten links vom Körper liegt?',
        correct: 'rechts vom Körper',
        wrong: ['links vom Körper', 'genau über dem Körper', 'unter dem Körper'],
      },
      {
        q: 'Bei einer Mondfinsternis steht der Mond im …',
        correct: 'Schatten der Erde',
        wrong: ['Schatten der Sonne', 'Lichtkegel der Venus', 'Halbschatten ohne Erde'],
      },
      {
        q: 'Bei einer Sonnenfinsternis steht der Mond …',
        correct: 'zwischen Sonne und Erde',
        wrong: ['hinter der Erde', 'neben der Sonne ohne Erde', 'zwischen Erde und Mars'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Lampenposition und Abstände bestimmen Seite und Größe des Schattens; Finsternisse sind Schattenphänomene.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

const lichtstrahl: Topic['generate'] = mixedVariants(
  (rng) => {
    const ax = randInt(rng, 0, 2)
    const ay = randInt(rng, 1, 3)
    const dx = pick(rng, [1, 2])
    const dy = pick(rng, [0, 1])
    const bx = ax + dx
    const by = Math.min(5, ay + dy)
    let cx = bx + dx
    let cy = Math.min(5, by + dy)
    if (cx > 6) {
      cx = bx + 1
      cy = by
    }
    return coordinateClickTask({
      question:
        'Taschenlampe und Spalt sind auf dem Kästchenpapier markiert. Verlängere den Lichtstrahl geradlinig — tippe einen weiteren Punkt auf dem Strahl.',
      x: cx,
      y: cy,
      xRange: [0, 6],
      yRange: [0, 5],
      solution: 'Jeder Gitterpunkt hinter dem Spalt in derselben Richtung',
      explanation: `Geradlinig von (${ax}|${ay}) durch (${bx}|${by}) — jeder Punkt auf der Verlängerung zählt.`,
      visualContent: lightRayHintSvg({ from: { x: ax, y: ay }, through: { x: bx, y: by } }),
      markers: [
        { x: ax, y: ay, label: 'Lampe', color: '#f59e0b' },
        { x: bx, y: by, label: 'Spalt', color: '#64748b' },
      ],
      guide: { from: { x: ax, y: ay }, to: { x: bx, y: by } },
      solutionRay: {
        from: { x: ax, y: ay },
        to: {
          x: Math.min(6, bx + 3 * Math.sign(dx || 1)),
          y: Math.min(5, Math.max(0, by + 3 * Math.sign(dy))),
        },
      },
      acceptForwardRay: { from: { x: ax, y: ay }, through: { x: bx, y: by } },
      instruction: 'Tippe einen Punkt auf dem Lichtstrahl:',
    })
  },
  (rng) => {
    const x = randInt(rng, 1, 5)
    const ay = pick(rng, [4, 5])
    return coordinateClickTask({
      question:
        'Ein Lichtstrahl trifft senkrecht von oben auf den Spiegel in der x-Achse. Tippe den Auftreffpunkt auf dem Spiegel.',
      x,
      y: 0,
      xRange: [0, 6],
      yRange: [0, 5],
      solution: `(${x}|0)`,
      explanation: `Senkrecht nach unten: Auftreffpunkt (${x}|0) auf dem Spiegel.`,
      markers: [{ x, y: ay, label: 'Lampe', color: '#f59e0b' }],
      guide: { from: { x, y: ay }, to: { x, y: 1 } },
      solutionRay: { from: { x, y: ay }, to: { x, y: 0 } },
      instruction: 'Tippe den Punkt auf dem Spiegel:',
    })
  },
  (rng) => {
    const hitX = randInt(rng, 2, 4)
    const ax = pick(rng, [0, 1])
    const ay = pick(rng, [3, 4, 5])
    const rx = 2 * hitX - ax
    const ry = ay
    if (rx < 0 || rx > 6) {
      return coordinateClickTask({
        question:
          'Licht kommt senkrecht von oben auf den Spiegel (x-Achse). Tippe den Auftreffpunkt.',
        x: hitX,
        y: 0,
        xRange: [0, 6],
        yRange: [0, 5],
        solution: `(${hitX}|0)`,
        explanation: `Senkrecht: Auftreffpunkt (${hitX}|0).`,
        markers: [{ x: hitX, y: ay, label: 'Lampe', color: '#f59e0b' }],
        solutionRay: { from: { x: hitX, y: ay }, to: { x: hitX, y: 0 } },
        instruction: 'Tippe den Punkt auf dem Spiegel:',
      })
    }
    return coordinateClickTask({
      question:
        'Spiegel in der x-Achse. Einfallswinkel = Ausfallswinkel. Lampe und reflektierter Strahl sind markiert — tippe den Auftreffpunkt auf dem Spiegel.',
      x: hitX,
      y: 0,
      xRange: [0, 6],
      yRange: [0, 5],
      solution: `(${hitX}|0)`,
      explanation: `Mittelpunkt auf dem Spiegel: x = (${ax} + ${rx}) / 2 = ${hitX}.`,
      markers: [
        { x: ax, y: ay, label: 'Lampe', color: '#f59e0b' },
        { x: rx, y: ry, label: 'Reflektion', color: '#dc2626' },
      ],
      solutionRay: { from: { x: ax, y: ay }, to: { x: hitX, y: 0 } },
      instruction: 'Tippe den Auftreffpunkt auf dem Spiegel:',
    })
  },
)

/** LB2 — Körper, Masse, Bewegung */
const dichte: Topic['generate'] = mixedVariants(
  (rng) => {
    const m = pick(rng, [20, 40, 50, 60, 80, 100])
    const v = pick(rng, [2, 4, 5, 8, 10])
    const rho = m / v
    return valueTask({
      question: `Ein Körper hat die Masse m = ${m} g und das Volumen V = ${v} cm³. Berechne die Dichte.`,
      answerKind: rho % 1 === 0 ? 'integer' : 'decimal',
      unit: 'g/cm³',
      value: rho,
      solution: `${rho} g/cm³`,
      explanation: `ρ = m / V = ${m} / ${v} = ${rho} g/cm³.`,
    })
  },
  (rng) => {
    const pairs = [
      { m: 40, v: 5 },
      { m: 60, v: 5 },
      { m: 80, v: 4 },
      { m: 100, v: 5 },
      { m: 50, v: 2 },
      { m: 20, v: 4 },
    ] as const
    const { m, v } = pick(rng, [...pairs])
    const rho = m / v
    const startM = m === 40 ? 60 : 40
    const startV = v === 5 ? 2 : 5
    return paramSliderTask({
      question: `Stelle Masse und Volumen so ein, dass die Dichte ${rho} g/cm³ beträgt.`,
      params: [
        { id: 'm', label: 'Masse m (g)', min: 10, max: 100, step: 10, start: startM },
        { id: 'v', label: 'Volumen V (cm³)', min: 1, max: 10, step: 1, start: startV },
      ],
      correct: { m, v },
      solution: `m = ${m} g, V = ${v} cm³ → ρ = ${rho} g/cm³`,
      explanation: `ρ = m / V = ${m} / ${v} = ${rho} g/cm³. Beide Werte müssen passen.`,
      instruction: 'Schieberegler auf die geforderten Werte:',
    })
  },
  (rng) => {
    const parts = ['ρ', '=', 'm', '/', 'V']
    const distractor = '× V'
    const labels = [...parts, distractor]
    const items = labels.map((label, i) => ({ label, value: i + 1 }))
    const shuffled = [...items]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
    }
    const correctSlots = parts.map((label) => shuffled.findIndex((it) => it.label === label))
    return dragDropSlotsTask({
      question: 'Baue die Formel für die Dichte. Einen Block brauchst du nicht.',
      items: shuffled,
      correctSlots,
      solution: 'ρ = m / V',
      explanation: 'Die Dichte ist Masse durch Volumen: ρ = m / V (Reihenfolge der Division ist fest).',
      instruction: 'Ziehe die richtigen Blöcke in die Formelplätze. Einen Block brauchst du nicht.',
      checkMode: 'strict',
    })
  },
)

const geschwindigkeit: Topic['generate'] = mixedVariants(
  (rng) => {
    const v = pick(rng, [2, 3, 4, 5, 6, 8, 10])
    const t = pick(rng, [2, 3, 4, 5, 6])
    const s = v * t
    return valueTask({
      question: `Ein Körper bewegt sich gleichförmig mit v = ${v} m/s für t = ${t} s. Welche Strecke legt er zurück?`,
      answerKind: 'integer',
      unit: 'm',
      value: s,
      solution: `${s} m`,
      explanation: `s = v · t = ${v} · ${t} = ${s} m.`,
    })
  },
  (rng) => {
    const v = pick(rng, [2, 3, 4, 5, 6, 8, 10])
    const t = pick(rng, [2, 3, 4, 5, 6])
    const s = v * t
    return valueTask({
      question: `Ein Körper legt s = ${s} m in t = ${t} s gleichförmig zurück. Berechne die Geschwindigkeit.`,
      answerKind: 'integer',
      unit: 'm/s',
      value: v,
      solution: `${v} m/s`,
      explanation: `v = s / t = ${s} / ${t} = ${v} m/s.`,
    })
  },
  (rng) => {
    const v = pick(rng, [2, 3, 4, 5, 6, 8, 10])
    const t = pick(rng, [2, 3, 4, 5, 6])
    const s = v * t
    return valueTask({
      question: `Gleichförmige Bewegung: s = ${s} m, v = ${v} m/s. Wie lange dauert die Bewegung?`,
      answerKind: 'integer',
      unit: 's',
      value: t,
      solution: `${t} s`,
      explanation: `t = s / v = ${s} / ${v} = ${t} s.`,
    })
  },
  (rng) => {
    const parts = ['s', '=', 'v', '× t']
    const distractor = '× m'
    const labels = [...parts, distractor]
    const items = labels.map((label, i) => ({ label, value: i + 1 }))
    const shuffled = [...items]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
    }
    const correctSlots = parts.map((label) => shuffled.findIndex((it) => it.label === label))
    return dragDropSlotsTask({
      question: 'Baue die Formel für die Strecke bei gleichförmiger Bewegung. Einen Block brauchst du nicht.',
      items: shuffled,
      correctSlots,
      solution: 's = v × t',
      explanation: 'Bei gleichförmiger Bewegung gilt s = v × t (Faktoren nach = dürfen getauscht werden).',
      instruction: 'Ziehe die richtigen Blöcke in die Formelplätze. Einen Block brauchst du nicht.',
      checkMode: 'commutativeFactors',
    })
  },
)

/** Weg-Zeit-Diagramm: echte s–t-Grafik ablesen (Steigung / Weg zu Zeitpunkt). */
const wegzeit: Topic['generate'] = mixedVariants(
  (rng) => {
    const v = pick(rng, [2, 3, 4, 5])
    const tMax = pick(rng, [4, 5, 6])
    const markT = pick(
      rng,
      Array.from({ length: tMax - 1 }, (_, i) => i + 1).filter((t) => (v * t) % 1 === 0),
    )
    const s = v * markT
    return visualTask({
      question: `Im Weg-Zeit-Diagramm bewegt sich ein Körper gleichförmig. Lies den Weg s zum Zeitpunkt t = ${markT} s ab.`,
      answerKind: 'integer',
      unit: 'm',
      value: s,
      solution: `${s} m`,
      explanation: `Die Gerade geht durch den Ursprung mit Steigung v = ${v} m/s. Bei t = ${markT} s ist s = v·t = ${v}·${markT} = ${s} m.`,
      visualContent: wegZeitDiagramSvg({ v, tMax, markT, showEndLabels: true }),
    })
  },
  (rng) => {
    const v = pick(rng, [2, 3, 4, 5])
    const tMax = pick(rng, [4, 5, 6])
    return visualTask({
      question:
        'Im Weg-Zeit-Diagramm ist die Bewegung gleichförmig (Gerade durch den Ursprung). Welche Geschwindigkeit hat der Körper?',
      answerKind: 'integer',
      unit: 'm/s',
      value: v,
      solution: `${v} m/s`,
      explanation: `v = Δs / Δt = ${v * tMax} m / ${tMax} s = ${v} m/s (Steigung der Geraden).`,
      visualContent: wegZeitDiagramSvg({ v, tMax, showEndLabels: true }),
    })
  },
  (rng) => {
    const v = pick(rng, [2, 3, 4, 5])
    const tMax = pick(rng, [4, 5, 6])
    const sEnd = v * tMax
    return visualTask({
      question: `Welchen Weg hat der Körper nach t = ${tMax} s zurückgelegt? (Endpunkt der Geraden)`,
      answerKind: 'integer',
      unit: 'm',
      value: sEnd,
      solution: `${sEnd} m`,
      explanation: `Am rechten Ende der Geraden: s(${tMax} s) = ${sEnd} m.`,
      visualContent: wegZeitDiagramSvg({ v, tMax, showEndLabels: true }),
    })
  },
  (rng) => {
    const kind = pick(rng, ['rest', 'uniform', 'accel'] as const)
    const correct = kind === 'rest' ? 'A' : kind === 'uniform' ? 'B' : 'C'
    const what =
      kind === 'rest'
        ? 'Ruhe (s bleibt konstant)'
        : kind === 'uniform'
          ? 'gleichförmige Bewegung (konstante Geschwindigkeit)'
          : 'beschleunigte Bewegung (Geschwindigkeit nimmt zu)'
    return choicePickTask({
      question: `Welches Weg-Zeit-Diagramm zeigt ${what}?`,
      choices: shuffleChoices(rng, ['A', 'B', 'C'], correct),
      correct,
      solution: correct,
      explanation:
        kind === 'rest'
          ? 'Bei Ruhe ist s konstant → horizontale Gerade (Diagramm A).'
          : kind === 'uniform'
            ? 'Gleichförmig: s steigt linear mit t → Gerade mit konstanter Steigung (Diagramm B).'
            : 'Beschleunigt: die Steigung nimmt zu → gekrümmte Kurve (Diagramm C).',
      visualContent: wegZeitCompareSvg(kind),
      instruction: 'Tippe den Buchstaben:',
    })
  },
  (rng) => {
    const correct = 'die Steigung der Geraden'
    return choicePickTask({
      question: 'Was liest man im Weg-Zeit-Diagramm einer gleichförmigen Bewegung als Geschwindigkeit ab?',
      choices: shuffleChoices(
        rng,
        [correct, 'den Achsenabschnitt auf der s-Achse', 'nur die Zeitdauer', 'die Fläche unter der Kurve als Masse'],
        correct,
      ),
      correct,
      solution: correct,
      explanation: 'Bei gleichförmiger Bewegung ist v = Δs/Δt die Steigung der Geraden im s–t-Diagramm.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** Einheiten von Geschwindigkeit, Weg und Zeit. */
const einheiten: Topic['generate'] = mixedVariants(
  (rng) => {
    const correct = 'm/s (oder km/h)'
    return choicePickTask({
      question: 'Welche Einheit hat die Geschwindigkeit v?',
      choices: shuffleChoices(rng, [correct, 'nur m', 'nur s', 'Newton (N)'], correct),
      correct,
      solution: correct,
      explanation: 'Geschwindigkeit ist Weg durch Zeit: typisch m/s oder km/h.',
      instruction: 'Tippe die Einheit:',
    })
  },
  (rng) => {
    const correct = 'Meter (m)'
    return choicePickTask({
      question: 'Welche Einheit hat die Strecke s?',
      choices: shuffleChoices(rng, [correct, 'Sekunde (s)', 'm/s', 'Kilogramm (kg)'], correct),
      correct,
      solution: correct,
      explanation: 'Die Strecke (Weg) wird in Metern (m) gemessen — oder km, cm, …',
      instruction: 'Tippe die Einheit:',
    })
  },
  (rng) => {
    const correct = 'Sekunde (s)'
    return choicePickTask({
      question: 'Welche Einheit hat die Zeit t?',
      choices: shuffleChoices(rng, [correct, 'Meter (m)', 'm/s', 'Gramm (g)'], correct),
      correct,
      solution: correct,
      explanation: 'Die Zeit wird in Sekunden (s) gemessen — oder min, h, …',
      instruction: 'Tippe die Einheit:',
    })
  },
  (rng) => {
    const kmh = pick(rng, [36, 54, 72, 90])
    const ms = kmh / 3.6
    return valueTask({
      question: `${kmh} km/h entsprechen wie vielen m/s? (1 m/s = 3,6 km/h)`,
      answerKind: ms % 1 === 0 ? 'integer' : 'decimal',
      unit: 'm/s',
      value: ms,
      solution: `${ms} m/s`,
      explanation: `v = ${kmh} / 3,6 = ${ms} m/s.`,
    })
  },
  (rng) => {
    const ms = pick(rng, [5, 10, 15, 20])
    const kmh = ms * 3.6
    return valueTask({
      question: `${ms} m/s entsprechen wie vielen km/h? (1 m/s = 3,6 km/h)`,
      answerKind: kmh % 1 === 0 ? 'integer' : 'decimal',
      unit: 'km/h',
      value: kmh,
      solution: `${kmh} km/h`,
      explanation: `v = ${ms} · 3,6 = ${kmh} km/h.`,
    })
  },
  (rng) => {
    const correct = 'v = s / t'
    return choicePickTask({
      question: 'Welche Größen und Einheiten passen zusammen: Geschwindigkeit = …?',
      choices: shuffleChoices(
        rng,
        [correct, 'v = s · t', 'v = t / s', 'v = s + t'],
        correct,
      ),
      correct,
      solution: correct,
      explanation: 'v = s / t → Einheit z. B. m/s = Meter / Sekunde.',
      instruction: 'Tippe die Formel:',
    })
  },
)

const masseVergleich: Topic['generate'] = mixedVariants(
  (rng) => {
    const kg = pick(rng, [1, 2, 3, 4, 5])
    const g = kg * 1000
    return valueTask({
      question: `${kg} kg entsprechen wie vielen Gramm?`,
      answerKind: 'integer',
      unit: 'g',
      value: g,
      solution: `${g} g`,
      explanation: `1 kg = 1000 g → ${kg} kg = ${g} g.`,
    })
  },
  (rng) => {
    const g = pick(rng, [500, 1500, 2000, 2500, 3500])
    const kg = g / 1000
    return valueTask({
      question: `${g} g entsprechen wie vielen Kilogramm?`,
      answerKind: kg % 1 === 0 ? 'integer' : 'decimal',
      unit: 'kg',
      value: kg,
      solution: `${kg} kg`,
      explanation: `1000 g = 1 kg → ${g} g = ${kg} kg.`,
    })
  },
  (rng) => {
    const correct = 'Kilogramm (kg) bzw. Gramm (g)'
    return choicePickTask({
      question: 'Welche Einheit hat die Masse?',
      choices: shuffleChoices(rng, [correct, 'Newton (N)', 'Meter (m)', 'Sekunde (s)'], correct),
      correct,
      solution: correct,
      explanation: 'Masse wird in Kilogramm (kg) oder Gramm (g) angegeben — nicht in Newton.',
      instruction: 'Tippe die Einheit:',
    })
  },
  (rng) => {
    const rho = pick(rng, [2, 3, 4, 5, 8])
    const v = pick(rng, [2, 4, 5, 10])
    const m = rho * v
    return valueTask({
      question: `Ein Körper hat die Dichte ρ = ${rho} g/cm³ und das Volumen V = ${v} cm³. Berechne die Masse.`,
      answerKind: 'integer',
      unit: 'g',
      value: m,
      solution: `${m} g`,
      explanation: `m = ρ · V = ${rho} · ${v} = ${m} g.`,
    })
  },
  (rng) => {
    const a = randInt(rng, 2, 9)
    const b = randInt(rng, 2, 9)
    if (a === b) {
      return choicePickTask({
        question: `Zwei Körper haben jeweils die Masse ${a} kg. Was gilt?`,
        choices: ['A ist schwerer', 'B ist schwerer', 'beide gleich schwer'],
        correct: 'beide gleich schwer',
        solution: 'beide gleich schwer',
        explanation: 'Gleiche Masse → gleiche Schwere (am selben Ort).',
        instruction: 'Tippe den Vergleich:',
      })
    }
    const correct = a > b ? 'A ist schwerer' : 'B ist schwerer'
    return choicePickTask({
      question: `Körper A hat die Masse ${a} kg, Körper B ${b} kg. Was gilt?`,
      choices: shuffleChoices(rng, ['A ist schwerer', 'B ist schwerer', 'beide gleich schwer'], correct),
      correct,
      solution: correct,
      explanation: `Vergleiche die Massen: ${a} kg ${a > b ? '>' : '<'} ${b} kg.`,
      instruction: 'Tippe den Vergleich:',
    })
  },
)

/** LB3 — Temperatur */
const thermometer: Topic['generate'] = mixedVariants(
  (rng) => {
    const c = pick(rng, [-10, 0, 20, 37, 40, 60, 80, 100])
    return numberLineTask({
      question: `Stelle ${c} °C am Thermometer ein.`,
      min: -20,
      max: 100,
      step: 1,
      value: c,
      labelStep: 20,
      variant: 'thermometer',
      eps: 1,
      solution: `${c} °C`,
      explanation: `Die Quecksilbersäule (rote Säule) endet bei ${c} °C (±1 °C).`,
    })
  },
  (rng) => {
    const c = pick(rng, [0, 20, 37, 50, 80, 100])
    return choicePickTask({
      question: 'Welche Temperatur zeigt das Thermometer ungefähr?',
      choices: shuffleChoices(
        rng,
        [`${c} °C`, `${c + 20} °C`, `${c - 20} °C`, `${c + 40} °C`].map(String),
        `${c} °C`,
      ),
      correct: `${c} °C`,
      solution: `${c} °C`,
      explanation: `Ablesen an der Skala: etwa ${c} °C.`,
      visualContent: thermometerSvg(c),
      instruction: 'Tippe den passenden Wert:',
    })
  },
)

const kelvin: Topic['generate'] = mixedVariants(
  (rng) => {
    const c = pick(rng, [-20, -10, 0, 20, 27, 37, 100])
    const k = c + 273
    return valueTask({
      question: `Wandle ${c} °C in Kelvin um.`,
      answerKind: 'integer',
      unit: 'K',
      value: k,
      solution: `${k} K`,
      explanation: `T = ${c} + 273 = ${k} K.`,
    })
  },
  (rng) => {
    const c = pick(rng, [-20, -10, 0, 20, 27, 37, 100])
    const k = c + 273
    return valueTask({
      question: `Wandle ${k} K in °C um.`,
      answerKind: 'integer',
      unit: '°C',
      value: c,
      solution: `${c} °C`,
      explanation: `ϑ = ${k} − 273 = ${c} °C.`,
    })
  },
  (rng) => {
    const c = pick(rng, [0, 20, 37, 100])
    const k = c + 273
    return numberLineTask({
      question: `Stelle die Temperatur ${k} K auf dem Zahlenstrahl in °C ein.`,
      min: -20,
      max: 120,
      step: 1,
      value: c,
      labelStep: 20,
      solution: `${c} °C`,
      explanation: `ϑ = ${k} − 273 = ${c} °C — diesen Wert auf dem Zahlenstrahl einstellen.`,
    })
  },
)

const aggregate: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Wasser bei 20 °C und Normaldruck ist …',
        correct: 'flüssig',
        choices: ['fest', 'flüssig', 'gasförmig'],
      },
      {
        q: 'Wasser bei −5 °C und Normaldruck ist …',
        correct: 'fest',
        choices: ['fest', 'flüssig', 'gasförmig'],
      },
      {
        q: 'Wasser über 100 °C und Normaldruck ist …',
        correct: 'gasförmig',
        choices: ['fest', 'flüssig', 'gasförmig'],
      },
      {
        q: 'Wasser bei 0 °C kann (bei Normaldruck) …',
        correct: 'fest oder flüssig sein (Schmelzpunkt)',
        choices: [
          'fest oder flüssig sein (Schmelzpunkt)',
          'nur gasförmig sein',
          'nie fest sein',
          'nur plasmaförmig sein',
        ],
      },
      {
        q: 'Welcher Aggregatzustand hat eine feste Form und ein festes Volumen?',
        correct: 'fest',
        choices: ['fest', 'flüssig', 'gasförmig'],
      },
      {
        q: 'Welcher Aggregatzustand hat ein festes Volumen, aber keine feste Form?',
        correct: 'flüssig',
        choices: ['fest', 'flüssig', 'gasförmig'],
      },
      {
        q: 'Welcher Aggregatzustand füllt den verfügbaren Raum und hat kein festes Volumen?',
        correct: 'gasförmig',
        choices: ['fest', 'flüssig', 'gasförmig'],
      },
      {
        q: 'Beim Übergang fest → flüssig spricht man von …',
        correct: 'Schmelzen',
        choices: ['Schmelzen', 'Erstarren', 'Kondensieren', 'Verdampfen'],
      },
      {
        q: 'Beim Übergang flüssig → fest spricht man von …',
        correct: 'Erstarren / Gefrieren',
        choices: ['Erstarren / Gefrieren', 'Schmelzen', 'Sieden', 'Sublimieren'],
      },
      {
        q: 'Beim Übergang flüssig → gasförmig spricht man von …',
        correct: 'Verdampfen / Sieden',
        choices: ['Verdampfen / Sieden', 'Schmelzen', 'Erstarren', 'Kondensieren'],
      },
      {
        q: 'Beim Übergang gasförmig → flüssig spricht man von …',
        correct: 'Kondensieren',
        choices: ['Kondensieren', 'Schmelzen', 'Sieden', 'Sublimieren'],
      },
      {
        q: 'Ein Stück Butter wird warm und wird weich bis flüssig. Der Aggregatzustand …',
        correct: 'ändert sich von fest nach flüssig',
        choices: [
          'ändert sich von fest nach flüssig',
          'bleibt immer fest',
          'wird sofort gasförmig',
          'ändert sich von gasförmig nach fest',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [...c.choices], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Aggregatzustände: fest / flüssig / gasförmig. Sie hängen vom Stoff und von Temperatur (und Druck) ab.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const items = [
      { label: 'fest', value: 0 },
      { label: 'flüssig', value: 1 },
      { label: 'gasförmig', value: 2 },
    ]
    const shuffled = [...items]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
    }
    const correctOrder = items.map((row) => shuffled.findIndex((it) => it.value === row.value))
    return dragDropSortTask({
      question: 'Ordne die Aggregatzustände nach zunehmender Teilchenbeweglichkeit (wenig → stark).',
      items: shuffled,
      correctOrder,
      solution: 'fest → flüssig → gasförmig',
      explanation: 'Im Festkörper sind Teilchen am stärksten gebunden; im Gas bewegen sie sich am freiesten.',
    })
  },
  (rng) => {
    const pools = [
      {
        question: 'Welche Aussagen zu Aggregatzuständen stimmen? (mehrere möglich)',
        choices: [
          'Feste Körper haben meist feste Form und festes Volumen',
          'Flüssigkeiten passen sich der Gefäßform an',
          'Gase füllen den verfügbaren Raum aus',
          'Wasser ist bei −20 °C flüssig',
          'Aggregatzustände hängen nie von der Temperatur ab',
        ],
        correct: [
          'Feste Körper haben meist feste Form und festes Volumen',
          'Flüssigkeiten passen sich der Gefäßform an',
          'Gase füllen den verfügbaren Raum aus',
        ],
      },
      {
        question: 'Was gehört zu Phasenübergängen von Wasser? (mehrere möglich)',
        choices: [
          'Schmelzen bei etwa 0 °C',
          'Sieden bei etwa 100 °C (Normaldruck)',
          'Erstarren beim Abkühlen unter 0 °C',
          'Wasser wird bei 20 °C immer gasförmig',
          'Eis ist bei −10 °C flüssig',
        ],
        correct: [
          'Schmelzen bei etwa 0 °C',
          'Sieden bei etwa 100 °C (Normaldruck)',
          'Erstarren beim Abkühlen unter 0 °C',
        ],
      },
    ] as const
    const p = pick(rng, [...pools])
    return multiSelectTask({
      question: p.question,
      choices: [...p.choices],
      correct: [...p.correct],
      solution: p.correct.join('; '),
      explanation: 'Aggregatzustand und Phasenübergänge hängen von Stoff und Temperatur (Druck) ab.',
      instruction: 'Tippe alle richtigen Aussagen:',
    })
  },
)

/** LB3 — Wärmeausdehnung */
const ausdehnung: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Die meisten Stoffe dehnen sich bei Erwärmung …',
        correct: 'aus (Volumen/Länge nehmen zu)',
        wrong: ['zusammen (werden immer kleiner)', 'gar nicht', 'nur magnetisch'],
      },
      {
        q: 'Warum lässt man Lücken zwischen Bahngleisen / Betonplatten?',
        correct: 'damit sich das Material bei Hitze ausdehnen kann',
        wrong: [
          'damit Wasser schneller verdampft',
          'damit Strom fließen kann',
          'damit es kälter wird',
        ],
      },
      {
        q: 'Ein Bimetallstreifen biegt sich bei Erwärmung, weil …',
        correct: 'die beiden Metalle sich unterschiedlich stark ausdehnen',
        wrong: [
          'Metalle bei Wärme immer schrumpfen',
          'Strom ohne Spannung fließt',
          'Licht reflektiert wird',
        ],
      },
      {
        q: 'Ein Flüssigkeitsthermometer funktioniert u. a., weil sich die Flüssigkeit bei Erwärmung …',
        correct: 'stärker ausdehnt als das Glasgefäß',
        wrong: [
          'zusammenzieht und verschwindet',
          'in Kelvin umwandelt',
          'zu Eis wird',
        ],
      },
      {
        q: 'Eine Metallkugel passt bei Raumtemperatur durch einen Ring, nach starker Erwärmung oft nicht mehr. Warum?',
        correct: 'Die Kugel dehnt sich aus und wird größer',
        wrong: [
          'Die Kugel wird leichter',
          'Der Ring wird magnetisch',
          'Die Temperatur in Kelvin sinkt',
        ],
      },
      {
        q: 'Beim Abkühlen eines erhitzten Metallstabes wird er typischerweise …',
        correct: 'wieder kürzer (zieht sich zusammen)',
        wrong: ['immer länger', 'zu einem Gas', 'schwerelos'],
      },
      {
        q: 'Wärmeausdehnung bedeutet vor allem …',
        correct: 'Änderung von Länge/Volumen mit der Temperatur',
        wrong: [
          'Umwandlung von °C in Kelvin',
          'nur das Schmelzen von Eis',
          'nur elektrischen Widerstand',
        ],
      },
      {
        q: 'Welche Aussage zur Wärmeausdehnung stimmt?',
        correct: 'Gase dehnen sich bei gleicher Erwärmung oft stärker aus als Festkörper',
        wrong: [
          'Festkörper dehnen sich nie aus',
          'Ausdehnung gibt es nur bei Kelvin-Umrechnung',
          'Nur Wasser dehnt sich aus, Metalle nie',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Wärmeausdehnung: bei Erwärmung nehmen Länge und Volumen der meisten Stoffe zu (unterschiedlich stark).',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const pools = [
      {
        question: 'Welche Beispiele gehören zur Wärmeausdehnung? (mehrere möglich)',
        choices: [
          'Lücken in Bahnschienen',
          'Bimetall in Temperaturschaltern',
          'Steigende Flüssigkeitssäule im Thermometer',
          'Umwandlung 20 °C → 293 K',
          'Ohmsches Gesetz R = U/I',
        ],
        correct: [
          'Lücken in Bahnschienen',
          'Bimetall in Temperaturschaltern',
          'Steigende Flüssigkeitssäule im Thermometer',
        ],
      },
      {
        question: 'Was passiert typischerweise beim Erwärmen eines Metallstabes?',
        choices: [
          'Länge nimmt zu',
          'Teilchen schwingen stärker / Abstand nimmt zu',
          'Stab wird kürzer',
          'Temperatur in °C wird automatisch zu Kelvin ohne Rechnung',
        ],
        correct: ['Länge nimmt zu', 'Teilchen schwingen stärker / Abstand nimmt zu'],
      },
    ] as const
    const p = pick(rng, [...pools])
    return multiSelectTask({
      question: p.question,
      choices: [...p.choices],
      correct: [...p.correct],
      solution: p.correct.join('; '),
      explanation: 'Wärmeausdehnung ist eine Längen-/Volumenänderung mit der Temperatur — keine Einheitenumrechnung.',
      instruction: 'Tippe alle richtigen Aussagen:',
    })
  },
  (rng) => {
    const items = [
      { label: 'kalt (zusammengezogen)', value: 0 },
      { label: 'erwärmt (ausgedehnt)', value: 1 },
      { label: 'wieder abgekühlt (zurückgeschrumpft)', value: 2 },
    ]
    const shuffled = [...items]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
    }
    const correctOrder = items.map((row) => shuffled.findIndex((it) => it.value === row.value))
    return dragDropSortTask({
      question: 'Ordne den typischen Ablauf bei Wärmeausdehnung eines Metallstücks.',
      items: shuffled,
      correctOrder,
      solution: 'kalt → erwärmt (ausgedehnt) → wieder abgekühlt',
      explanation: 'Erwärmen → Ausdehnung; Abkühlen → Zusammenziehen.',
    })
  },
)

/** LB3 — Schmelzen und Sieden */
const schmelzen: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Beim Schmelzen von Eis (Normaldruck) bleibt die Temperatur während des Schmelzens typischerweise bei …',
        correct: 'etwa 0 °C',
        wrong: ['etwa 100 °C', 'etwa −20 °C', 'etwa 273 °C'],
      },
      {
        q: 'Beim Sieden von Wasser (Normaldruck) bleibt die Temperatur während des Siedens typischerweise bei …',
        correct: 'etwa 100 °C',
        wrong: ['etwa 0 °C', 'etwa 20 °C', 'etwa −100 °C'],
      },
      {
        q: 'Schmelzen bedeutet den Übergang …',
        correct: 'fest → flüssig',
        wrong: ['flüssig → fest', 'flüssig → gasförmig', 'gasförmig → fest'],
      },
      {
        q: 'Sieden / Verdampfen bedeutet den Übergang …',
        correct: 'flüssig → gasförmig',
        wrong: ['fest → flüssig', 'gasförmig → flüssig', 'fest → gasförmig nur bei 0 °C'],
      },
      {
        q: 'Während des Schmelzens wird zugeführte Wärme vor allem …',
        correct: 'für den Phasenübergang genutzt (Temperatur bleibt oft konstant)',
        wrong: [
          'sofort in Kelvin umgerechnet',
          'nur für Längenausdehnung ohne Phasenwechsel',
          'nur für elektrischen Strom',
        ],
      },
      {
        q: 'Kondensieren ist der Übergang …',
        correct: 'gasförmig → flüssig',
        wrong: ['flüssig → gasförmig', 'fest → flüssig', 'flüssig → fest'],
      },
      {
        q: 'Erstarren / Gefrieren ist der Übergang …',
        correct: 'flüssig → fest',
        wrong: ['fest → flüssig', 'flüssig → gasförmig', 'gasförmig → flüssig'],
      },
      {
        q: 'Warum braucht man zum Schmelzen von Eis Wärme, obwohl die Temperatur bei 0 °C bleibt?',
        correct: 'Die Wärme ändert den Aggregatzustand (Schmelzwärme)',
        wrong: [
          'Weil 0 °C = 273 K gerechnet werden muss',
          'Weil Eis Strom leitet',
          'Weil sich nur die Farbe ändert',
        ],
      },
      {
        q: 'Wasserdampf, der an einer kalten Scheibe zu Tropfen wird, …',
        correct: 'kondensiert (gasförmig → flüssig)',
        wrong: ['schmilzt', 'siedet', 'sublimiert immer zu Eis'],
      },
      {
        q: 'Welche Aussage zu Schmelzen und Sieden stimmt?',
        correct: 'Beide sind Phasenübergänge bei charakteristischen Temperaturen (stoffabhängig)',
        wrong: [
          'Beide sind nur Umrechnungen °C ↔ K',
          'Schmelzen gibt es nur bei Metallen',
          'Sieden passiert nur bei −5 °C',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Schmelzen/Sieden: Phasenübergänge. Bei Normaldruck schmilzt Eis bei ~0 °C, Wasser siedet bei ~100 °C.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const items = [
      { label: 'Eis erwärmen bis 0 °C', value: 0 },
      { label: 'Schmelzen bei 0 °C', value: 1 },
      { label: 'Wasser erwärmen bis 100 °C', value: 2 },
      { label: 'Sieden bei 100 °C', value: 3 },
    ]
    const shuffled = [...items]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
    }
    const correctOrder = items.map((row) => shuffled.findIndex((it) => it.value === row.value))
    return dragDropSortTask({
      question: 'Ordne den Ablauf: Eis wird zu Dampf (Normaldruck, fortlaufend erwärmt).',
      items: shuffled,
      correctOrder,
      solution: 'Erwärmen → Schmelzen (0 °C) → Erwärmen → Sieden (100 °C)',
      explanation: 'Zuerst Schmelzen bei 0 °C, später Sieden bei 100 °C.',
    })
  },
  (rng) => {
    const pools = [
      {
        question: 'Was gehört zu Schmelzen und Sieden von Wasser? (mehrere möglich)',
        choices: [
          'Schmelzpunkt etwa 0 °C',
          'Siedepunkt etwa 100 °C (Normaldruck)',
          'Während des Phasenübergangs oft konstante Temperatur',
          'Schmelzen = Umrechnung in Kelvin',
          'Sieden = fest → flüssig',
        ],
        correct: [
          'Schmelzpunkt etwa 0 °C',
          'Siedepunkt etwa 100 °C (Normaldruck)',
          'Während des Phasenübergangs oft konstante Temperatur',
        ],
      },
    ] as const
    const p = pick(rng, [...pools])
    return multiSelectTask({
      question: p.question,
      choices: [...p.choices],
      correct: [...p.correct],
      solution: p.correct.join('; '),
      explanation: 'Schmelzen und Sieden sind Phasenübergänge — keine Temperatur-Einheitenumrechnung.',
      instruction: 'Tippe alle richtigen Aussagen:',
    })
  },
)

/** LB3 — Temperatur-Messreihe (ID 3173): auswerten, nicht sinnlos nach Zeit sortieren. */
const messreihe: Topic['generate'] = mixedVariants(
  (rng) => {
    const t0 = pick(rng, [0, 2, 5])
    const dt = pick(rng, [5, 10])
    const temp0 = pick(rng, [18, 20, 22, 25])
    const dT = pick(rng, [4, 5, 6, 8])
    const t1 = t0 + dt
    const t2 = t0 + 2 * dt
    const temp1 = temp0 + dT
    const temp2 = temp0 + 2 * dT
    const delta = temp2 - temp0
    return valueTask({
      question: `Messreihe einer Erwärmung:\n• t = ${t0} min → ${temp0} °C\n• t = ${t1} min → ${temp1} °C\n• t = ${t2} min → ${temp2} °C\nWie groß ist die Temperaturänderung Δϑ von Beginn bis Ende?`,
      answerKind: 'integer',
      unit: '°C',
      value: delta,
      solution: `${delta} °C`,
      explanation: `Δϑ = ${temp2} °C − ${temp0} °C = ${delta} °C.`,
    })
  },
  (rng) => {
    const a = pick(rng, [18, 19, 20, 21])
    const b = a + pick(rng, [1, 2])
    const c = b + pick(rng, [1, 2])
    const mean = Math.round(((a + b + c) / 3) * 10) / 10
    return valueTask({
      question: `Temperaturmesswerte: ${a} °C, ${b} °C, ${c} °C. Berechne den Mittelwert.`,
      answerKind: mean % 1 === 0 ? 'integer' : 'decimal',
      unit: '°C',
      value: mean,
      solution: `${mean} °C`,
      explanation: `Mittelwert = (${a} + ${b} + ${c}) / 3 = ${mean} °C.`,
    })
  },
  (rng) => {
    const base = pick(rng, [20, 22, 24, 25])
    const good = [base, base + 1, base + 2]
    const outlier = base + pick(rng, [12, 15, 18])
    const values = shuffleChoices(rng, [...good.map(String), String(outlier)], String(outlier))
    return choicePickTask({
      question: `Messwerte einer Wassertemperatur (°C): ${values.join(', ')}. Welcher Wert ist vermutlich ein Ausreißer?`,
      choices: shuffleChoices(
        rng,
        [`${outlier} °C`, `${good[0]} °C`, `${good[1]} °C`, `${good[2]} °C`],
        `${outlier} °C`,
      ),
      correct: `${outlier} °C`,
      solution: `${outlier} °C`,
      explanation: `Die Werte ${good.join(', ')} liegen nah beieinander; ${outlier} °C weicht stark ab.`,
      instruction: 'Tippe den Ausreißer:',
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Was gehört zu einer guten Temperatur-Messreihe?',
        correct: 'Zeitpunkt und Temperaturwert notieren',
        wrong: ['nur die Farbe des Thermometers', 'nur Kelvin ohne Messung', 'nur raten ohne Uhr'],
      },
      {
        q: 'Steigt die Temperatur in gleichen Zeitabständen um denselben Betrag, ist die Erwärmung …',
        correct: 'gleichmäßig (näherungsweise linear)',
        wrong: ['unmöglich', 'nur in Kelvin messbar', 'ohne Messwerte erkennbar'],
      },
      {
        q: 'Warum wiederholt man Temperaturmessungen oft?',
        correct: 'um Ausreißer zu erkennen und den Mittelwert zu bilden',
        wrong: ['um °C in Kelvin umzurechnen', 'damit Eis schmilzt', 'damit Strom fließt'],
      },
      {
        q: 'Was berechnet man aus mehreren Messwerten derselben Größe typischerweise zuerst?',
        correct: 'den Mittelwert',
        wrong: ['die Dichte der Luft', 'den Widerstand der Batterie', 'die Wellenlänge'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Messreihen: Zeit und Messwert sauber tabellieren, Ausreißer prüfen, Mittelwert bilden.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const t0 = pick(rng, [0, 5])
    const dt = pick(rng, [5, 10])
    const temp0 = pick(rng, [20, 22, 25])
    const dT = pick(rng, [5, 10])
    const rate = dT / dt
    const rateStr = Number.isInteger(rate) ? String(rate) : rate.toFixed(1).replace('.', ',')
    return valueTask({
      question: `In ${dt} Minuten steigt die Temperatur von ${temp0} °C auf ${temp0 + dT} °C. Wie groß ist die mittlere Temperaturänderung pro Minute?`,
      answerKind: Number.isInteger(rate) ? 'integer' : 'decimal',
      unit: '°C/min',
      value: rate,
      solution: `${rateStr} °C/min`,
      explanation: `Δϑ/Δt = ${dT} °C / ${dt} min = ${rateStr} °C/min (Startzeit t = ${t0} min).`,
    })
  },
)

/** LB4 — Stromkreis */
const stromkreis: Topic['generate'] = mixedVariants(
  (rng) => {
    const closed = pick(rng, [true, false])
    const device = pick(rng, ['Lampe', 'Summer', 'LED'] as const)
    const art = device === 'Summer' ? 'Der' : 'Die'
    const correct = closed ? `${art} ${device} ist an.` : `${art} ${device} ist aus.`
    const wrong = closed ? `${art} ${device} ist aus.` : `${art} ${device} ist an.`
    return choicePickTask({
      question: `Schau auf das Schaltbild mit ${device}. Was gilt für den Verbraucher?`,
      choices: shuffleChoices(
        rng,
        [correct, wrong, 'Die Batterie verschwindet.', 'Nur der Schalter leuchtet.'],
        correct,
      ),
      correct,
      solution: correct,
      explanation: closed
        ? 'Geschlossener Stromkreis: Ladung fließt, der Verbraucher arbeitet.'
        : 'Offener Stromkreis: kein geschlossener Weg, der Verbraucher bleibt aus.',
      visualContent: circuitSvg(closed, device),
      instruction: 'Tippe die richtige Aussage:',
    })
  },
  (rng) => {
    const pools = [
      {
        question: 'Welche Teile braucht ein einfacher Stromkreis, damit die Lampe leuchten kann?',
        choices: [
          'Spannungsquelle (Batterie)',
          'geschlossener Schalter',
          'Leiter (Drähte)',
          'offener Schalter',
          'nur Isolierband ohne Leiter',
        ],
        correct: [
          'Spannungsquelle (Batterie)',
          'geschlossener Schalter',
          'Leiter (Drähte)',
        ],
      },
      {
        question: 'Was gehört zu einem geschlossenen Stromkreis? (mehrere möglich)',
        choices: [
          'Spannungsquelle',
          'geschlossener Leitungsweg',
          'Verbraucher (z. B. Lampe)',
          'unterbrochene Leitung',
          'nur ein einzelner Draht ohne Rückweg',
        ],
        correct: ['Spannungsquelle', 'geschlossener Leitungsweg', 'Verbraucher (z. B. Lampe)'],
      },
    ] as const
    const p = pick(rng, [...pools])
    return multiSelectTask({
      question: p.question,
      choices: [...p.choices],
      correct: [...p.correct],
      solution: p.correct.join('; '),
      explanation: 'Ohne Spannungsquelle und geschlossenen Weg fließt kein Strom.',
      instruction: 'Tippe alle nötigen Teile:',
      visualContent: circuitSvg(true),
    })
  },
  (rng) => {
    const closed = pick(rng, [true, false])
    const correct = closed ? 'geschlossen' : 'offen'
    return choicePickTask({
      question: 'Schau auf das Schaltbild: Ist der Schalter offen oder geschlossen?',
      choices: shuffleChoices(rng, ['offen', 'geschlossen', 'weder noch', 'nur die Batterie'], correct),
      correct,
      solution: correct,
      explanation: closed
        ? 'Geschlossener Schalter: die Schaltlinie verbindet beide Kontaktpunkte.'
        : 'Offener Schalter: die angewinkelte Linie berührt den gegenüberliegenden Kontakt nicht.',
      visualContent: circuitSvg(closed),
      instruction: 'Tippe den Zustand:',
    })
  },
)

/** LB1 — Sonne, Mond und Erde (Finsternisse + Mondphasen) */
const sonneMondErde: Topic['generate'] = mixedVariants(
  (rng) => {
    const solar = pick(rng, [true, false])
    const correct = solar ? 'Sonnenfinsternis' : 'Mondfinsternis'
    const wrong = solar ? 'Mondfinsternis' : 'Sonnenfinsternis'
    return choicePickTask({
      question: 'Welche Finsternis passt zur abgebildeten Anordnung von Sonne, Mond und Erde?',
      choices: shuffleChoices(
        rng,
        [correct, wrong, 'keine Finsternis möglich', 'nur Polarlicht'],
        correct,
      ),
      correct,
      solution: correct,
      explanation: solar
        ? 'Sonnenfinsternis: Mond steht zwischen Sonne und Erde und wirft Schatten auf die Erde.'
        : 'Mondfinsternis: Erde steht zwischen Sonne und Mond; der Mond liegt im Erdschatten.',
      visualContent: eclipseArrangementSvg(solar ? 'solar' : 'lunar'),
      instruction: 'Tippe die passende Finsternis:',
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Bei einer Sonnenfinsternis steht der Mond …',
        correct: 'zwischen Sonne und Erde',
        wrong: ['hinter der Erde', 'zwischen Erde und Mars', 'neben der Sonne ohne Erde'],
      },
      {
        q: 'Bei einer Mondfinsternis steht der Mond …',
        correct: 'im Schatten der Erde',
        wrong: ['zwischen Sonne und Erde', 'im Inneren der Sonne', 'zwischen Venus und Merkur'],
      },
      {
        q: 'Anordnung Sonne – Mond – Erde gehört typischerweise zu …',
        correct: 'Sonnenfinsternis',
        wrong: ['Mondfinsternis', 'Vollmond ohne Schatten', 'nur Neumond auf dem Mars'],
      },
      {
        q: 'Anordnung Sonne – Erde – Mond gehört typischerweise zu …',
        correct: 'Mondfinsternis',
        wrong: ['Sonnenfinsternis', 'nur Halbschatten ohne Erde', 'Kurzschluss im Stromkreis'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Sonnenfinsternis: Mond zwischen Sonne und Erde. Mondfinsternis: Erde zwischen Sonne und Mond (Mond im Erdschatten).',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const phase = pick(rng, ['new', 'full', 'waxing', 'waning'] as MoonPhaseKind[])
    const labels: Record<MoonPhaseKind, string> = {
      new: 'Neumond',
      full: 'Vollmond',
      waxing: 'zunehmender Mond',
      waning: 'abnehmender Mond',
    }
    const correct = labels[phase]
    const wrong = (Object.keys(labels) as MoonPhaseKind[])
      .filter((k) => k !== phase)
      .map((k) => labels[k])
    return choicePickTask({
      question: 'Welche Mondphase passt zur abgebildeten Stellung von Sonne, Erde und Mond?',
      choices: shuffleChoices(rng, [correct, ...wrong], correct),
      correct,
      solution: correct,
      explanation:
        'Neumond: Mond zwischen Sonne und Erde. Vollmond: Erde zwischen Sonne und Mond. Zunehmend/abnehmend: Mond seitlich zur Sonne–Erde-Linie.',
      visualContent: moonPhaseSvg(phase),
      instruction: 'Tippe die Mondphase:',
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Beim Neumond steht der Mond …',
        correct: 'zwischen Sonne und Erde',
        wrong: ['hinter der Erde (gegenüber der Sonne)', 'im Erdschatten als Mondfinsternis immer', 'zwischen Erde und Mars'],
      },
      {
        q: 'Beim Vollmond steht der Mond …',
        correct: 'gegenüber der Sonne (Erde dazwischen)',
        wrong: ['zwischen Sonne und Erde', 'in der Sonne', 'ohne Bezug zur Erde'],
      },
      {
        q: 'Beim zunehmenden Mond (erste Viertel) steht der Mond ungefähr …',
        correct: 'seitlich zur Linie Sonne–Erde',
        wrong: ['genau zwischen Sonne und Erde', 'genau hinter der Erde', 'im Zentrum der Sonne'],
      },
      {
        q: 'Beim abnehmenden Mond (letztes Viertel) steht der Mond ungefähr …',
        correct: 'seitlich zur Linie Sonne–Erde (andere Seite als zunehmend)',
        wrong: ['genau zwischen Sonne und Erde', 'nur hinter dem Mars', 'ohne Sonne'],
      },
      {
        q: 'Warum sehen wir vom Neumond meist keine Mondscheibe?',
        correct: 'Die Sonnenseite des Mondes zeigt von der Erde weg',
        wrong: ['Der Mond verschwindet aus dem Sonnensystem', 'Die Erde leuchtet heller als die Sonne', 'Es gibt keinen Mond bei Neumond'],
      },
      {
        q: 'Bei Vollmond ist die der Erde zugewandte Mondseite …',
        correct: 'von der Sonne beleuchtet',
        wrong: ['vollständig im Erdschatten (immer)', 'von der Erde unbeleuchtbar', 'immer unsichtbar'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Mondphasen entstehen durch die Stellung Mond–Erde–Sonne und die beleuchtete Mondhälfte, die wir von der Erde sehen.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const items = [
      { label: 'Neumond', value: 0 },
      { label: 'zunehmender Mond', value: 1 },
      { label: 'Vollmond', value: 2 },
      { label: 'abnehmender Mond', value: 3 },
    ]
    const shuffled = [...items]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
    }
    const correctOrder = items.map((row) => shuffled.findIndex((it) => it.value === row.value))
    return dragDropSortTask({
      question: 'Ordne die Mondphasen im typischen Ablauf (Neumond → … → wieder Richtung Neumond).',
      items: shuffled,
      correctOrder,
      solution: 'Neumond → zunehmend → Vollmond → abnehmend',
      explanation: 'Nach Neumond nimmt der sichtbare Teil zu bis Vollmond, danach wieder ab.',
    })
  },
)

const leiter: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      { material: 'Kupferdraht', correct: 'Leiter' },
      { material: 'Silberblech', correct: 'Leiter' },
      { material: 'Gummi', correct: 'Nichtleiter' },
      { material: 'Kunststoffhülle', correct: 'Nichtleiter' },
      { material: 'Holz (trocken)', correct: 'Nichtleiter' },
      { material: 'Eisennagel', correct: 'Leiter' },
      { material: 'Alufolie', correct: 'Leiter' },
      { material: 'Porzellantasse', correct: 'Nichtleiter' },
      { material: 'Goldring', correct: 'Leiter' },
      { material: 'Papier (trocken)', correct: 'Nichtleiter' },
      { material: 'Graphitmine', correct: 'Leiter' },
      { material: 'Glasscheibe', correct: 'Nichtleiter' },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: `Ist „${c.material}“ eher ein elektrischer Leiter oder ein Nichtleiter?`,
      choices: ['Leiter', 'Nichtleiter'],
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Metalle und Graphit leiten gut; Gummi, Kunststoff, Glas, Porzellan und trockenes Holz isolieren.',
      instruction: 'Tippe die Einordnung:',
    })
  },
  (rng) => {
    const pools = [
      {
        choices: ['Kupfer', 'Eisen', 'Gummi', 'Silber', 'trockenes Holz'],
        correct: ['Kupfer', 'Eisen', 'Silber'],
      },
      {
        choices: ['Aluminium', 'Gold', 'Kunststoff', 'Graphit', 'Porzellan'],
        correct: ['Aluminium', 'Gold', 'Graphit'],
      },
    ] as const
    const p = pick(rng, [...pools])
    return multiSelectTask({
      question: 'Welche Stoffe sind typische elektrische Leiter? (mehrere möglich)',
      choices: [...p.choices],
      correct: [...p.correct],
      solution: p.correct.join(', '),
      explanation: 'Metalle und Graphit leiten; Isolatoren nicht.',
      instruction: 'Tippe alle Leiter:',
    })
  },
)

const CIRCUIT_SYMBOLS: CircuitSymbolKind[] = [
  'battery',
  'lamp',
  'switchOpen',
  'switchClosed',
  'resistor',
  'motor',
  'buzzer',
  'ammeter',
  'voltmeter',
]

/** LB4 — Schaltsymbole (ID 6148): Symbol erkennen, nicht Ohm-Rechnung. */
const schaltsymbole: Topic['generate'] = mixedVariants(
  (rng) => {
    const kind = pick(rng, CIRCUIT_SYMBOLS)
    const correct = circuitSymbolLabel(kind)
    const otherLabels = CIRCUIT_SYMBOLS.filter((k) => k !== kind).map(circuitSymbolLabel)
    const w1 = pick(rng, otherLabels)
    const w2 = pick(
      rng,
      otherLabels.filter((w) => w !== w1),
    )
    const w3 = pick(rng, ['Trafo', 'Kondensator', 'Diode', 'Lautsprecher'])
    return choicePickTask({
      question: 'Welches Schaltsymbol wird hier gezeigt?',
      choices: shuffleChoices(rng, [correct, w1, w2, w3], correct),
      correct,
      solution: correct,
      explanation: `Das gezeigte Schaltsymbol steht für: ${correct}.`,
      visualContent: circuitSymbolSvg(kind),
      instruction: 'Tippe den Namen des Symbols:',
    })
  },
  (rng) => {
    const kind = pick(rng, ['battery', 'lamp', 'resistor', 'switchOpen', 'motor', 'buzzer'] as const)
    const correct = circuitSymbolLabel(kind)
    const otherLabels = CIRCUIT_SYMBOLS.filter((k) => k !== kind).map(circuitSymbolLabel)
    const w1 = pick(rng, otherLabels)
    const w2 = pick(
      rng,
      otherLabels.filter((w) => w !== w1),
    )
    const w3 = pick(
      rng,
      otherLabels.filter((w) => w !== w1 && w !== w2),
    )
    return choicePickTask({
      question: 'Welches Schaltsymbol wird hier gezeigt?',
      choices: shuffleChoices(rng, [correct, w1, w2, w3], correct),
      correct,
      solution: correct,
      explanation: `Das abgebildete Symbol steht für „${correct}“.`,
      visualContent: circuitSymbolSvg(kind),
      instruction: 'Tippe die passende Zuordnung:',
    })
  },
  (rng) => {
    const pools = [
      {
        question: 'Welche Aussagen zu Schaltsymbolen stimmen? (mehrere möglich)',
        choices: [
          'Schaltsymbole sind genormte Zeichen in Schaltplänen',
          'Ein Rechteck zwischen Leitungen steht oft für einen Widerstand',
          'Ein Kreis mit X steht typischerweise für eine Lampe',
          'Schaltsymbole sind immer Fotos der Bauteile',
          'Ohne Schaltsymbole kann man keinen Stromkreis zeichnen',
        ],
        correct: [
          'Schaltsymbole sind genormte Zeichen in Schaltplänen',
          'Ein Rechteck zwischen Leitungen steht oft für einen Widerstand',
          'Ein Kreis mit X steht typischerweise für eine Lampe',
          'Ohne Schaltsymbole kann man keinen Stromkreis zeichnen',
        ],
        visuals: ['resistor', 'lamp', 'voltmeter'] as CircuitSymbolKind[],
      },
      {
        question: 'Was erkennst du an Messgeräte-Symbolen? (mehrere möglich)',
        choices: [
          'Kreis mit A = Amperemeter',
          'Kreis mit V = Voltmeter',
          'Kreis mit M = Motor',
          'Kreis mit A = immer nur eine Batterie',
          'Voltmeter und Amperemeter haben dasselbe Symbol',
        ],
        correct: ['Kreis mit A = Amperemeter', 'Kreis mit V = Voltmeter', 'Kreis mit M = Motor'],
        visuals: ['ammeter', 'voltmeter', 'motor'] as CircuitSymbolKind[],
      },
    ] as const
    const p = pick(rng, [...pools])
    return multiSelectTask({
      question: p.question,
      choices: [...p.choices],
      correct: [...p.correct],
      solution: p.correct.join('; '),
      explanation: 'Schaltsymbole sind genormte Zeichnungen — keine Fotos der Bauteile.',
      instruction: 'Tippe alle richtigen Aussagen:',
      visualContent: circuitSymbolsRowSvg([...p.visuals]),
    })
  },
)

/** LB4 — Elektrischer Widerstand: bisher fälschlich unter Schaltsymbole (Ohm-Aufgaben). */
const widerstand: Topic['generate'] = mixedVariants(
  (rng) => {
    const u = pick(rng, [2, 3, 4, 6, 8, 9, 12])
    const r = pick(rng, [2, 3, 4, 6])
    const i = u / r
    return valueTask({
      question: `U = ${u} V, R = ${r} Ω. Berechne die Stromstärke.`,
      answerKind: i % 1 === 0 ? 'integer' : 'decimal',
      unit: 'A',
      value: i,
      solution: `${i} A`,
      explanation: `I = U/R = ${u}/${r} = ${i} A.`,
    })
  },
  (rng) => {
    const correct = 'R = U / I'
    return choicePickTask({
      question: 'Welche Formel gilt für den ohmschen Widerstand?',
      choices: shuffleChoices(rng, [correct, 'R = U · I', 'R = I / U', 'R = U + I'], correct),
      correct,
      solution: correct,
      explanation: 'Widerstand = Spannung geteilt durch Stromstärke.',
      instruction: 'Tippe die Formel:',
      visualContent: circuitSymbolSvg('resistor'),
    })
  },
  (rng) => {
    const correct = 'Ohm (Ω)'
    return choicePickTask({
      question: 'Welche Einheit hat der elektrische Widerstand?',
      choices: shuffleChoices(rng, [correct, 'Ampere (A)', 'Volt (V)', 'Watt (W)'], correct),
      correct,
      solution: correct,
      explanation: 'Der elektrische Widerstand wird in Ohm (Ω) angegeben.',
      instruction: 'Tippe die Einheit:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Was gehört zum ohmschen Widerstand? (mehrere möglich)',
      choices: [
        'U und I sind proportional',
        'R ist (näherungsweise) konstant',
        'Kennlinie ist eine Gerade durch den Ursprung',
        'Strom fließt nur ohne Spannung',
        'Widerstand wächst immer mit der Zeit von allein',
      ],
      correct: [
        'U und I sind proportional',
        'R ist (näherungsweise) konstant',
        'Kennlinie ist eine Gerade durch den Ursprung',
      ],
      solution: 'Proportionalität U–I, konstantes R, lineare Kennlinie',
      explanation: 'Ohmsches Verhalten: I ~ U bei konstantem R.',
      instruction: 'Tippe alle zutreffenden Aussagen:',
    }),
  (rng) => {
    const parts = ['R', '=', 'U', '/', 'I']
    const distractor = '· I'
    const labels = [...parts, distractor]
    const items = labels.map((label, i) => ({ label, value: i + 1 }))
    const shuffled = [...items]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
    }
    const correctSlots = parts.map((label) => shuffled.findIndex((it) => it.label === label))
    return dragDropSlotsTask({
      question: 'Baue die Formel für den ohmschen Widerstand. Einen Block brauchst du nicht.',
      items: shuffled,
      correctSlots,
      solution: 'R = U / I',
      explanation: 'Richtige Formel: R = U / I. „· I“ gehört nicht dazu.',
      instruction: 'Ziehe die richtigen Blöcke in die Formelplätze. Einen Block brauchst du nicht.',
    })
  },
)

/** LB4 — Reihe und Parallel (einfach) */
const reiheparallel: Topic['generate'] = mixedVariants(
  (rng) => {
    const series = pick(rng, [true, false])
    const correct = series
      ? 'Beide Lampen liegen hintereinander im selben Weg'
      : 'Jede Lampe hat einen eigenen Zweig'
    const wrong = series
      ? 'Jede Lampe hat einen eigenen Zweig'
      : 'Beide Lampen liegen hintereinander im selben Weg'
    return choicePickTask({
      question: series
        ? 'Was gilt in der abgebildeten Reihenschaltung?'
        : 'Was gilt in der abgebildeten Parallelschaltung?',
      choices: shuffleChoices(
        rng,
        [correct, wrong, 'Es gibt keine Batterie', 'Lampen brauchen keinen Leiter'],
        correct,
      ),
      correct,
      solution: correct,
      explanation: series
        ? 'In Reihe teilen sich die Verbraucher einen gemeinsamen Stromweg.'
        : 'Parallel haben die Verbraucher eigene Zweige an derselben Spannung.',
      visualContent: seriesParallelSvg(series ? 'series' : 'parallel'),
      instruction: 'Tippe die passende Beschreibung:',
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Zwei gleiche Lampen in Reihe: eine Lampe brennt durch (Unterbrechung). Was passiert typischerweise?',
        correct: 'Beide Lampen gehen aus',
        wrong: ['Nur die andere leuchtet weiter', 'Die Batterie wird zum Isolator', 'Der Strom verdoppelt sich'],
      },
      {
        q: 'Zwei gleiche Lampen parallel: eine Lampe brennt durch. Was passiert typischerweise?',
        correct: 'Die andere Lampe kann weiter leuchten',
        wrong: ['Beide müssen ausgehen', 'Die Spannung wird immer null', 'Es gibt keinen Stromweg mehr'],
      },
      {
        q: 'Woran erkennst du eine Parallelschaltung zweier Lampen?',
        correct: 'Jede Lampe hat einen eigenen Zweig',
        wrong: [
          'Beide Lampen liegen nur hintereinander',
          'Es gibt keine Spannungsquelle',
          'Nur ein Draht ohne Rückweg',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Reihe = ein Weg; Parallel = eigene Zweige.',
      instruction: 'Tippe die richtige Aussage:',
      visualContent: seriesParallelSvg(/parallel/i.test(c.q) ? 'parallel' : 'series'),
    })
  },
  () =>
    dragDropSortTask({
      question: 'Ordne: zuerst typisch für Reihenschaltung, dann für Parallelschaltung.',
      items: [
        { label: 'Reihe: ein gemeinsamer Stromweg', value: 0 },
        { label: 'Parallel: eigene Zweige', value: 1 },
      ],
      correctOrder: [0, 1],
      solution: 'Reihe (gemeinsamer Weg) → Parallel (eigene Zweige)',
      explanation: 'Zuerst Reihe (gemeinsamer Weg), dann Parallel (eigene Zweige).',
    }),
)

/** LB4 — Gefahren und Kurzschluss */
const gefahren: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Was ist ein Kurzschluss?',
        correct: 'ein sehr niederohmiger Nebenweg an der Spannungsquelle',
        wrong: [
          'ein ausdrücklich geöffneter Schalter',
          'eine Lampe mit besonders großem Widerstand',
          'nur ein Symbol im Schaltplan ohne Wirkung',
        ],
      },
      {
        q: 'Warum ist ein Kurzschluss gefährlich?',
        correct: 'Es kann ein sehr großer Strom fließen (Hitze, Brandgefahr)',
        wrong: [
          'Der Strom wird immer genau null',
          'Die Spannung verschwindet immer spurlos',
          'Isolatoren beginnen zu leuchten',
        ],
      },
      {
        q: 'Welche Regel gilt für den Umgang mit Strom zu Hause?',
        correct: 'Keine nassen Hände an Steckdosen / beschädigte Kabel meiden',
        wrong: [
          'Kabel mit Metallschere prüfen',
          'Sicherungen immer überbrücken',
          'Wasser leitet nie',
        ],
      },
      {
        q: 'Wozu dient eine Sicherung im Stromkreis?',
        correct: 'Sie unterbricht bei zu großem Strom den Kreis',
        wrong: [
          'Sie erhöht die Spannung dauerhaft',
          'Sie speichert chemische Energie wie eine Batterie',
          'Sie ersetzt den Schalter im Alltag immer',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Kurzschluss und Überstrom sind gefährlich — Sicherungen und Isolierung schützen.',
      instruction: 'Tippe die sichere / richtige Aussage:',
    })
  },
  (rng) => {
    const pools = [
      {
        question: 'Was gehört zu sicherem Verhalten mit Strom? (mehrere möglich)',
        choices: [
          'Beschädigte Isolierung melden / nicht benutzen',
          'Nasse Hände von Steckdosen fernhalten',
          'Sicherungen nicht überbrücken',
          'Kabel mit Metallgegenständen „testen“',
          'Wasser in offene Geräte gießen',
        ],
        correct: [
          'Beschädigte Isolierung melden / nicht benutzen',
          'Nasse Hände von Steckdosen fernhalten',
          'Sicherungen nicht überbrücken',
        ],
      },
      {
        question: 'Was kann bei einem Kurzschluss passieren? (mehrere möglich)',
        choices: [
          'sehr großer Strom',
          'starke Erwärmung der Leitung',
          'Auslösen der Sicherung',
          'die Leitung wird zum Isolator aus Gummi',
          'Strom fließt nur ohne Spannungsquelle',
        ],
        correct: ['sehr großer Strom', 'starke Erwärmung der Leitung', 'Auslösen der Sicherung'],
      },
    ] as const
    const p = pick(rng, [...pools])
    return multiSelectTask({
      question: p.question,
      choices: [...p.choices],
      correct: [...p.correct],
      solution: p.correct.join('; '),
      explanation: 'Sicherheit geht vor: Isolierung, trockene Hände, intakte Sicherungen.',
      instruction: 'Tippe alle zutreffenden Punkte:',
    })
  },
)

/** Wahlbereiche */
/** LB1 — Lichtquellen und beleuchtete Körper */
const lichtquellen: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Was ist eine Lichtquelle?',
        correct: 'ein Körper, der selbst Licht aussendet',
        wrong: [
          'jeder Körper, den man sehen kann',
          'nur der Mond',
          'nur undurchsichtige Körper ohne Licht',
        ],
      },
      {
        q: 'Welche ist eine Lichtquelle?',
        correct: 'brennende Kerze / leuchtende Lampe / Sonne',
        wrong: ['Mond (ohne eigenes Licht)', 'ein Buch im Dunkeln', 'ein Schatten'],
      },
      {
        q: 'Der Mond ist …',
        correct: 'ein beleuchteter Körper (reflektiert Sonnenlicht)',
        wrong: [
          'eine echte Lichtquelle wie die Sonne',
          'unsichtbar ohne Schatten',
          'eine Wärmequelle ohne Lichtbezug',
        ],
      },
      {
        q: 'Warum siehst du ein Buch bei Tageslicht?',
        correct: 'es reflektiert Licht der Sonne/Lampe zum Auge',
        wrong: [
          'das Buch sendet selbst Licht wie die Sonne',
          'das Auge strahlt zum Buch',
          'ohne jede Lichtquelle',
        ],
      },
      {
        q: 'Ein beleuchteter Körper …',
        correct: 'sendet kein (oder kaum) eigenes Licht, wirft aber Licht zurück',
        wrong: [
          'leuchtet immer selbst wie eine Kerze',
          'kann man nie sehen',
          'braucht keinen Lichtweg zum Auge',
        ],
      },
      {
        q: 'Welche Aussage stimmt?',
        correct: 'Ohne Lichtquelle (direkt oder indirekt) sieht man nichts',
        wrong: [
          'Im Dunkeln sieht man alle Farben besonders gut',
          'Das Auge ersetzt die Lichtquelle',
          'Schatten allein reicht zum Sehen',
        ],
      },
      {
        q: 'Welche Körper sind Lichtquellen?',
        correct: 'Körper, die selbst Licht aussenden (z. B. Sonne, Lampe)',
        wrong: [
          'alle Körper, die man im Hellen sieht',
          'nur der Mond und Spiegel',
          'nur Körper ohne Wärme',
        ],
      },
      {
        q: 'Ein Spiegel im Sonnenlicht …',
        correct: 'ist beleuchtet und reflektiert Licht (keine eigene Lichtquelle)',
        wrong: [
          'wird dadurch selbst zur Sonne',
          'löscht das Licht der Sonne',
          'braucht kein Licht zum Spiegeln',
        ],
      },
      {
        q: 'Woran erkennst du eine Lichtquelle?',
        correct: 'sie sendet selbst Licht aus (auch im Dunkeln sichtbar, wenn sie leuchtet)',
        wrong: [
          'sie wirft immer einen Schatten auf sich selbst',
          'sie ist immer kalt',
          'man sieht sie nur durch undurchsichtige Wände',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Lichtquellen senden selbst Licht. Beleuchtete Körper (Mond, Buch) reflektieren Licht zum Auge.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const pools = [
      {
        question: 'Welche sind typische Lichtquellen? (mehrere möglich)',
        choices: [
          'Sonne',
          'Glühlampe / LED',
          'Kerzenflamme',
          'Mond',
          'ein dunkles Buch ohne Beleuchtung',
        ],
        correct: ['Sonne', 'Glühlampe / LED', 'Kerzenflamme'],
      },
      {
        question: 'Welche Aussagen stimmen? (mehrere möglich)',
        choices: [
          'Lichtquellen senden selbst Licht aus',
          'Beleuchtete Körper reflektieren Licht',
          'Der Mond leuchtet selbst wie die Sonne',
          'Ohne Licht sieht man keine Gegenstände',
          'Das Auge sendet Strahlen zum Gegenstand',
        ],
        correct: [
          'Lichtquellen senden selbst Licht aus',
          'Beleuchtete Körper reflektieren Licht',
          'Ohne Licht sieht man keine Gegenstände',
        ],
      },
      {
        question: 'Was gehört zu beleuchteten Körpern? (mehrere möglich)',
        choices: [
          'Mond',
          'Buch bei Tageslicht',
          'Wand im Lampenschein',
          'brennende Kerze',
          'Sonne',
        ],
        correct: ['Mond', 'Buch bei Tageslicht', 'Wand im Lampenschein'],
      },
    ] as const
    const p = pick(rng, [...pools])
    return multiSelectTask({
      question: p.question,
      choices: [...p.choices],
      correct: [...p.correct],
      solution: p.correct.join('; '),
      explanation: 'Lichtquelle ≠ beleuchteter Körper (z. B. Mond).',
      instruction: 'Tippe alle zutreffenden Aussagen:',
    })
  },
)

const sehen: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Damit wir einen Gegenstand sehen, muss Licht …',
        correct: 'Gegenstand → Auge (über Licht)',
        wrong: [
          'vom Auge zum Gegenstand und zurück ohne Lichtquelle',
          'nur im Dunkeln wirken',
          'nur durch den Schatten gehen',
        ],
      },
      {
        q: 'Warum sieht man einen Baum bei Tag?',
        correct: 'Sonnenlicht wird am Baum reflektiert und gelangt ins Auge',
        wrong: [
          'das Auge strahlt selbst Licht zum Baum',
          'der Baum leuchtet ohne jede Lichtquelle',
          'Licht läuft nur durch den Schatten',
        ],
      },
      {
        q: 'Eine Taschenlampe leuchtet auf ein Buch. Du siehst das Buch, weil …',
        correct: 'reflektiertes Licht ins Auge fällt',
        wrong: [
          'das Buch Licht zum Auge saugt ohne Reflexion',
          'Licht nur im Schatten sichtbar ist',
          'das Auge ohne Licht auskommt',
        ],
      },
      {
        q: 'Im völlig dunklen Raum ohne Lichtquelle …',
        correct: 'sieht man keine Gegenstände',
        wrong: [
          'sieht man alles besonders scharf',
          'braucht man kein Auge',
          'gibt es trotzdem bunte Farben ohne Licht',
        ],
      },
      {
        q: 'Eine Kerzenflamme sieht man auch im Dunkeln, weil …',
        correct: 'sie selbst leuchtet (Licht aussendet)',
        wrong: [
          'das Auge Licht zur Kerze schickt',
          'Schatten die Flamme erzeugt',
          'Luft ohne Licht leuchtet',
        ],
      },
      {
        q: 'Ein Spiegelbild entsteht, weil …',
        correct: 'Licht am Spiegel reflektiert und ins Auge gelangt',
        wrong: [
          'Licht im Spiegel verschwindet',
          'das Auge den Spiegel berührt',
          'ohne Licht Farben entstehen',
        ],
      },
      {
        q: 'Fotografie braucht …',
        correct: 'Licht, das auf den Sensor/Film trifft',
        wrong: [
          'einen völlig dunklen Raum ohne jedes Licht',
          'nur Schatten ohne Objektiv',
          'dass das Auge Strahlen aussendet',
        ],
      },
      {
        q: 'Welche Reihenfolge beschreibt das Sehen richtig?',
        correct: 'Lichtquelle → Gegenstand → Auge',
        wrong: [
          'Auge → Gegenstand → Lichtquelle ohne Licht',
          'Schatten → Auge → Lichtquelle',
          'Gegenstand → Schatten → ohne Auge',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Sehen braucht Licht vom Gegenstand (oder einer Quelle) zum Auge.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const pools = [
      {
        question: 'Was braucht man, um einen Gegenstand zu sehen? (mehrere möglich)',
        choices: [
          'Lichtquelle oder beleuchteten Gegenstand',
          'Lichtweg zum Auge',
          'völlig dunklen Raum ohne Licht',
          'reflektierendes oder selbstleuchtendes Objekt',
        ],
        correct: [
          'Lichtquelle oder beleuchteten Gegenstand',
          'Lichtweg zum Auge',
          'reflektierendes oder selbstleuchtendes Objekt',
        ],
      },
      {
        question: 'Welche Aussagen zum Sehen stimmen? (mehrere möglich)',
        choices: [
          'Ohne Licht sieht man nichts',
          'Reflektiertes Licht kann ins Auge gelangen',
          'Das Auge sendet unsichtbare Strahlen zum Gegenstand',
          'Selbstleuchtende Körper (z. B. Lampe) kann man sehen',
          'Schatten allein reicht zum Sehen aus',
        ],
        correct: [
          'Ohne Licht sieht man nichts',
          'Reflektiertes Licht kann ins Auge gelangen',
          'Selbstleuchtende Körper (z. B. Lampe) kann man sehen',
        ],
      },
    ] as const
    const p = pick(rng, [...pools])
    return multiSelectTask({
      question: p.question,
      choices: [...p.choices],
      correct: [...p.correct],
      solution: p.correct.join('; '),
      explanation: 'Ohne Licht und ohne Weg zum Auge sieht man nichts.',
      instruction: 'Tippe alle zutreffenden Aussagen:',
    })
  },
)

const daemmung: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Was verringert die Wärmeleitung durch eine Wand besonders gut?',
        correct: 'Luftschicht / Dämmstoff',
        wrong: ['dünnes Kupferblech', 'eine große Öffnung', 'feuchter Putz ohne Luft'],
      },
      {
        q: 'Warum dämmt Styropor gut?',
        correct: 'viel stillstehende Luft in kleinen Poren',
        wrong: [
          'es leitet Wärme besser als Metall',
          'es erzeugt eigene Wärme',
          'es ist vollständig durchsichtig für Wärme',
        ],
      },
      {
        q: 'Eine Wärmebrücke in der Wand …',
        correct: 'leitet Wärme besonders gut und verschlechtert die Dämmung',
        wrong: [
          'verbessert immer die Dämmung',
          'stoppt jede Wärmeleitung',
          'hat keinen Einfluss',
        ],
      },
      {
        q: 'Welches Fenster dämmt typischerweise besser?',
        correct: 'Dreifachverglasung mit Luft-/Gaszwischenräumen',
        wrong: [
          'einfache Einfachscheibe',
          'offenes Fenster',
          'Metallrahmen ohne Unterbrechung',
        ],
      },
      {
        q: 'Wozu dient eine Dämmstoffschicht in der Außenwand?',
        correct: 'Wärmeverlust zu verringern',
        wrong: [
          'die Wand elektrisch leitend zu machen',
          'Lichtstrahlen zu speichern',
          'Schatten zu erzeugen',
        ],
      },
      {
        q: 'Stillstehende Luft dämmt gut, weil sie …',
        correct: 'Wärme schlecht leitet',
        wrong: [
          'Wärme besser leitet als Kupfer',
          'Strom leitet',
          'Licht erzeugt',
        ],
      },
      {
        q: 'Ein ungedämmtes Dachfenster im Winter …',
        correct: 'lässt viel Wärme entweichen',
        wrong: [
          'dämmt besser als eine dicke Wand',
          'erzeugt eigene Wärme',
          'stoppt jede Wärmeleitung',
        ],
      },
      {
        q: 'Welche Materialwahl dämmt eher schlecht?',
        correct: 'durchgehende Metallbrücke',
        wrong: [
          'Mineralwolle zwischen Holzbalken',
          'Luftpolster in Isolierglas',
          'dicke Styroporschicht',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Stillstehende Luft und Dämmstoffe leiten Wärme schlecht.',
      instruction: 'Tippe die beste Antwort:',
    })
  },
  (rng) => {
    const pools = [
      {
        question: 'Welche Maßnahmen verbessern die Wärmedämmung? (mehrere möglich)',
        choices: [
          'dicke Dämmschicht',
          'stillstehende Luftpolster',
          'große Fenster ohne Isolierglas',
          'Metallbrücke durch die Wand',
          'Zweifach- oder Dreifachverglasung',
        ],
        correct: [
          'dicke Dämmschicht',
          'stillstehende Luftpolster',
          'Zweifach- oder Dreifachverglasung',
        ],
      },
      {
        question: 'Was gehört zur guten Gebäudedämmung? (mehrere möglich)',
        choices: [
          'Dämmstoffe in der Wand',
          'vermeiden von Wärmebrücken',
          'möglichst viele ungedämmte Öffnungen',
          'dichte Fenster und Türen',
          'durchgehende Metallstäbe ohne Trennung',
        ],
        correct: ['Dämmstoffe in der Wand', 'vermeiden von Wärmebrücken', 'dichte Fenster und Türen'],
      },
    ] as const
    const p = pick(rng, [...pools])
    return multiSelectTask({
      question: p.question,
      choices: [...p.choices],
      correct: [...p.correct],
      solution: p.correct.join('; '),
      explanation: 'Wärmebrücken und ungedämmte Öffnungen verschlechtern die Dämmung.',
      instruction: 'Tippe alle passenden Maßnahmen:',
    })
  },
)

const farben: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Was stimmt für weißes Licht (z. B. Sonnenlicht)?',
        correct: 'weißes Licht enthält viele Farben',
        wrong: [
          'weißes Licht hat keine Farbe und kann nicht zerlegt werden',
          'weißes Licht ist nur rot',
          'Farben entstehen nur ohne Licht',
        ],
      },
      {
        q: 'Ein Prisma zerlegt weißes Licht …',
        correct: 'in Spektralfarben',
        wrong: ['in nur eine Farbe Grün', 'in Schatten', 'in Ultraschall'],
      },
      {
        q: 'Ein roter Filter lässt vor allem …',
        correct: 'rotes Licht durch',
        wrong: ['alle Farben gleich stark durch', 'nur blaues Licht durch', 'kein Licht durch'],
      },
      {
        q: 'Ohne Licht …',
        correct: 'sieht man keine Farben',
        wrong: [
          'sieht man alle Farben besonders intensiv',
          'entstehen Farben von selbst',
          'braucht man keinen Filter',
        ],
      },
      {
        q: 'Ein blauer Filter …',
        correct: 'lässt vor allem blaues Licht durch',
        wrong: [
          'lässt nur rotes Licht durch',
          'erzeugt Ultraschall',
          'macht weißes Licht zu Schatten',
        ],
      },
      {
        q: 'Regenbogenfarben entstehen, weil …',
        correct: 'weißes Licht zerlegt wird (Dispersion)',
        wrong: [
          'Licht nur nach oben läuft',
          'ohne Sonne Farben entstehen',
          'Schatten Spektren speichern',
        ],
      },
      {
        q: 'Mischt man spektrale Farben geeignet, kann …',
        correct: 'wieder der Eindruck von weißem Licht entstehen',
        wrong: [
          'nur Schatten entstehen',
          'Licht verschwinden',
          'Ultraschall entstehen',
        ],
      },
      {
        q: 'Welche Aussage ist richtig?',
        correct: 'Farbfilter schwächen andere Spektralanteile',
        wrong: [
          'Filter erzeugen Licht aus dem Nichts',
          'Farben gibt es nur ohne Lichtquelle',
          'Weißes Licht besteht nur aus einer Wellenlänge',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Weißes Licht lässt sich zerlegen; Filter lassen „ihre“ Farbe durch.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const pools = [
      {
        question: 'Welche Aussagen zu Farben und Filtern stimmen? (mehrere möglich)',
        choices: [
          'Ein Farbfilter lässt vor allem „seine“ Farbe durch',
          'Weißes Licht lässt sich in Spektralfarben zerlegen',
          'Ohne Licht sieht man trotzdem alle Farben',
          'Ein roter Filter lässt vor allem Rot durch und hält andere Farben zurück',
          'Farben entstehen nur im Dunkeln',
        ],
        correct: [
          'Ein Farbfilter lässt vor allem „seine“ Farbe durch',
          'Weißes Licht lässt sich in Spektralfarben zerlegen',
          'Ein roter Filter lässt vor allem Rot durch und hält andere Farben zurück',
        ],
      },
      {
        question: 'Was gehört zur Zerlegung von weißem Licht? (mehrere möglich)',
        choices: [
          'Prisma oder Gitter',
          'Spektralfarben (z. B. rot bis violett)',
          'dass weißes Licht nur aus einer Wellenlänge besteht',
          'Dispersion / unterschiedliche Brechung',
          'dass Farben nur ohne Lichtquelle existieren',
        ],
        correct: [
          'Prisma oder Gitter',
          'Spektralfarben (z. B. rot bis violett)',
          'Dispersion / unterschiedliche Brechung',
        ],
      },
    ] as const
    const p = pick(rng, [...pools])
    return multiSelectTask({
      question: p.question,
      choices: [...p.choices],
      correct: [...p.correct],
      solution: p.correct.join('; '),
      explanation: 'Filter und Spektrum gehören zu Farbe und Licht; ohne Licht keine Farben.',
      instruction: 'Tippe alle richtigen Aussagen:',
    })
  },
)

/** Wahlbereich — Lochkamera (Bild 1/2: Gegenstand, Öffnung, Schirm, Abbild; B/G = b/g) */
const lochkamera: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Wie steht das Abbild auf dem Schirm einer Lochkamera?',
        correct: 'auf dem Kopf (und seitenverkehrt)',
        wrong: [
          'immer aufrecht wie der Gegenstand',
          'nur als Schatten ohne Form',
          'gar nicht — es gibt kein Abbild',
        ],
      },
      {
        q: 'Warum entsteht auf dem Schirm ein umgekehrtes Abbild?',
        correct: 'Lichtstrahlen kreuzen sich in der Öffnung',
        wrong: [
          'die Kamera dreht den Schirm mechanisch',
          'Licht läuft nur im Kreis',
          'ohne Öffnung reflektiert der Schirm',
        ],
      },
      {
        q: 'Was passiert, wenn man die Öffnung vergrößert?',
        correct: 'Bild wird heller, aber unschärfer',
        wrong: [
          'Bild wird immer schärfer und dunkler',
          'Abbild verschwindet vollständig',
          'Gegenstand wird größer',
        ],
      },
      {
        q: 'Was passiert, wenn man die Öffnung verkleinert?',
        correct: 'Bild wird schärfer, aber dunkler',
        wrong: [
          'Bild wird immer heller und unschärfer',
          'Strahlen laufen nicht mehr geradlinig',
          'Schirm wird zur Lichtquelle',
        ],
      },
      {
        q: 'Welche Größen gehören zur Lochkamera-Formel B/G = b/g?',
        correct: 'Bildgröße, Gegenstandsgröße, Bildweite, Gegenstandsweite',
        wrong: [
          'nur Strom und Spannung',
          'nur Masse und Volumen',
          'nur Celsius und Kelvin',
        ],
      },
      {
        q: 'Was bedeutet die Gegenstandsweite g?',
        correct: 'Abstand Gegenstand → Öffnung',
        wrong: [
          'Abstand Öffnung → Schirm',
          'Höhe des Abbilds',
          'Durchmesser der Öffnung',
        ],
      },
      {
        q: 'Was bedeutet die Bildweite b?',
        correct: 'Abstand Öffnung → Schirm',
        wrong: [
          'Abstand Gegenstand → Öffnung',
          'Höhe des Gegenstands',
          'nur die Kerzenflamme',
        ],
      },
      {
        q: 'Je weiter der Gegenstand (größeres g) bei gleicher Bildweite …',
        correct: 'desto kleiner wird das Abbild (qualitativ)',
        wrong: [
          'desto größer wird das Abbild immer',
          'ändert sich nichts am Abbild',
          'verschwindet der Schirm',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Lochkamera: Strahlen kreuzen sich in der Öffnung → umgekehrtes Abbild. B/G = b/g. Kleines Loch: schärfer, dunkler.',
      visualContent: lochkameraSvg({ showRays: true, showLabels: true }),
      instruction: 'Tippe die passende Aussage zur Lochkamera:',
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'In der Abbildung: Welches Bauteil lässt nur ein schmales Lichtbündel durch?',
        correct: 'die Öffnung (Loch)',
        wrong: ['der Schirm allein', 'nur die Kerzenflamme', 'die Außenwand ohne Loch'],
      },
      {
        q: 'In der Abbildung: Wo entsteht das Abbild?',
        correct: 'auf dem Schirm hinter der Öffnung',
        wrong: [
          'vor dem Gegenstand',
          'nur außerhalb der Kamera in der Luft',
          'in der Kerzenflamme',
        ],
      },
      {
        q: 'Vergleiche Gegenstand und Abbild in der Abbildung. Was stimmt?',
        correct: 'Das Abbild steht auf dem Kopf',
        wrong: [
          'Beide stehen gleich ausgerichtet',
          'Es gibt kein Abbild',
          'Das Abbild ist immer größer als der Gegenstand',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Gegenstand → Öffnung (Kreuzung der Strahlen) → umgekehrtes Abbild auf dem Schirm.',
      visualContent: lochkameraSvg({ showRays: true, showLabels: true }),
      instruction: 'Nutze die Abbildung:',
    })
  },
  (rng) => {
    // Einfache B = G·b/g ohne sin — Klasse-6-Strahlensatz (ganzzahlige Ergebnisse)
    const triples = [
      { G: 5, g: 50, b: 10 },
      { G: 4, g: 40, b: 10 },
      { G: 6, g: 60, b: 10 },
      { G: 8, g: 40, b: 10 },
      { G: 10, g: 50, b: 10 },
      { G: 5, g: 25, b: 10 },
      { G: 6, g: 30, b: 15 },
      { G: 8, g: 80, b: 20 },
    ] as const
    const { G, g, b } = pick(rng, [...triples])
    const B = (G * b) / g
    return valueTask({
      question: `Lochkamera: G = ${G} cm, g = ${g} cm, b = ${b} cm. Berechne die Bildgröße B (B/G = b/g).`,
      answerKind: 'integer',
      unit: 'cm',
      value: B,
      solution: `${B} cm`,
      explanation: `B = G·b/g = ${G}·${b}/${g} = ${B} cm.`,
      visualContent: lochkameraSvg({ showRays: true, showLabels: true, showSizes: true }),
    })
  },
  (rng) => {
    const parts = ['B/G', '=', 'b/g']
    const distractor = '+ c'
    const labels = [...parts, distractor]
    const items = labels.map((label, i) => ({ label, value: i + 1 }))
    const shuffled = [...items]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
    }
    const correctSlots = parts.map((label) => shuffled.findIndex((it) => it.label === label))
    return dragDropSlotsTask({
      question: 'Baue die Lochkamera-Formel (Strahlensatz). Einen Block brauchst du nicht.',
      items: shuffled,
      correctSlots,
      solution: 'B/G = b/g',
      explanation: 'Abbildungsmaßstab: B/G = b/g (ähnliche Dreiecke).',
      instruction: 'Ziehe die richtigen Blöcke in die Formelplätze. Einen Block brauchst du nicht.',
      checkMode: 'strict',
      visualContent: lochkameraSvg({ showRays: true, showLabels: true, showSizes: true }),
    })
  },
  (rng) => {
    const pools = [
      {
        question: 'Was gehört zur Lochkamera? (mehrere möglich)',
        choices: [
          'kleine Öffnung (Loch)',
          'Schirm für das Abbild',
          'geradlinige Lichtausbreitung',
          'dass Lichtstrahlen die Öffnung meiden',
          'umgekehrtes Abbild auf dem Schirm',
        ],
        correct: [
          'kleine Öffnung (Loch)',
          'Schirm für das Abbild',
          'geradlinige Lichtausbreitung',
          'umgekehrtes Abbild auf dem Schirm',
        ],
      },
      {
        question: 'Welche Aussagen zur Öffnungsgröße stimmen? (mehrere möglich)',
        choices: [
          'größeres Loch → helleres Bild',
          'größeres Loch → unschärferes Bild',
          'kleineres Loch → schärferes Bild',
          'größeres Loch → immer schärferes Bild',
          'ohne Loch entsteht kein Abbild in der Kamera',
        ],
        correct: [
          'größeres Loch → helleres Bild',
          'größeres Loch → unschärferes Bild',
          'kleineres Loch → schärferes Bild',
          'ohne Loch entsteht kein Abbild in der Kamera',
        ],
      },
    ] as const
    const p = pick(rng, [...pools])
    return multiSelectTask({
      question: p.question,
      choices: [...p.choices],
      correct: [...p.correct],
      solution: p.correct.join('; '),
      explanation: 'Lochkamera nutzt geradlinige Ausbreitung und eine kleine Öffnung.',
      visualContent: lochkameraSvg({ showRays: true, showLabels: true }),
      instruction: 'Tippe alle zutreffenden Aussagen:',
    })
  },
)

/** Wahlbereich — Auge und Sehvorgang */
const auge: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Wo entsteht das scharfe Bild im Auge?',
        correct: 'auf der Netzhaut',
        wrong: ['nur auf der Hornhaut außen', 'im Sehnerv allein ohne Netzhaut', 'außerhalb des Auges'],
      },
      {
        q: 'Welche Aufgabe hat die Augenlinse?',
        correct: 'Licht bündeln, damit ein scharfes Bild auf der Netzhaut entsteht',
        wrong: [
          'Licht zum Gegenstand zurückschicken',
          'nur die Farbe des Auges bestimmen',
          'den Sehnerv ersetzen',
        ],
      },
      {
        q: 'Wie steht das Bild auf der Netzhaut?',
        correct: 'verkleinert und auf dem Kopf',
        wrong: [
          'immer aufrecht und vergrößert',
          'gar nicht — es gibt kein Bild',
          'nur als Schatten ohne Form',
        ],
      },
      {
        q: 'Wozu dient die Pupille?',
        correct: 'sie regelt, wie viel Licht ins Auge fällt',
        wrong: [
          'sie erzeugt selbst Licht',
          'sie leitet Signale zum Gehirn',
          'sie ist der Sehnerv',
        ],
      },
      {
        q: 'Bei hellerem Licht wird die Pupille typischerweise …',
        correct: 'enger (kleiner)',
        wrong: ['immer weiter', 'zu einer Linse', 'zum Sehnerv'],
      },
      {
        q: 'Bei dunklerem Licht wird die Pupille typischerweise …',
        correct: 'weiter (größer)',
        wrong: ['immer enger', 'geschlossen wie ein Schalter', 'zur Netzhaut'],
      },
      {
        q: 'Was macht der Sehnerv?',
        correct: 'leitet Signale von der Netzhaut zum Gehirn',
        wrong: [
          'bricht das Licht wie eine Linse',
          'erzeugt das Abbild auf dem Schirm außen',
          'regelt nur die Pupillengröße',
        ],
      },
      {
        q: 'Welcher Vergleich passt: Lochkamera ↔ Auge?',
        correct: 'Öffnung ≈ Pupille, Schirm ≈ Netzhaut',
        wrong: [
          'Öffnung ≈ Sehnerv, Schirm ≈ Hornhaut',
          'es gibt keine Ähnlichkeit',
          'Lochkamera braucht immer eine Brille',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Licht → Pupille/Linse → umgekehrtes Bild auf der Netzhaut → Sehnerv → Gehirn.',
      visualContent: augeSehSvg({ showRays: true }),
      instruction: 'Tippe die passende Aussage zum Auge:',
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'In der Abbildung: Welches Bauteil bündelt die Lichtstrahlen?',
        correct: 'die Linse',
        wrong: ['nur der Baum außen', 'nur der Sehnerv', 'die Netzhaut allein ohne Linse'],
      },
      {
        q: 'In der Abbildung: Wo siehst du das umgekehrte Bild des Gegenstands?',
        correct: 'auf der Netzhaut (hinten im Auge)',
        wrong: [
          'vor dem Auge in der Luft',
          'nur auf dem Baum',
          'im Sehnerv als fertiges Foto',
        ],
      },
      {
        q: 'Warum kreuzen sich die Strahlen im Auge (Abbildung)?',
        correct: 'durch Brechung an der Linse entsteht ein umgekehrtes Bild',
        wrong: [
          'Licht läuft nur im Kreis',
          'ohne Linse immer',
          'der Sehnerv dreht die Strahlen um',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Linse bricht/bündelt → umgekehrtes Netzhautbild; Gehirn „stellt aufrecht“.',
      visualContent: augeSehSvg({ showRays: true }),
      instruction: 'Nutze die Abbildung:',
    })
  },
  (rng) => {
    const ordered = [
      { label: 'Licht vom Gegenstand', value: 0 },
      { label: 'Pupille / Linse', value: 1 },
      { label: 'Bild auf der Netzhaut', value: 2 },
      { label: 'Sehnerv → Gehirn', value: 3 },
    ]
    const shuffled = [...ordered]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return dragDropSortTask({
      question: 'Ordne den Sehvorgang (Lichtweg bis Wahrnehmung).',
      items: shuffled,
      correctOrder: [0, 1, 2, 3],
      solution: 'Licht → Pupille/Linse → Netzhaut → Sehnerv/Gehirn',
      explanation: 'Ohne Licht und Weg zur Netzhaut kein Sehen; das Gehirn wertet die Signale aus.',
      visualContent: augeSehSvg({ showRays: true }),
    })
  },
  (rng) => {
    const pools = [
      {
        question: 'Welche Aussagen zum Auge stimmen? (mehrere möglich)',
        choices: [
          'Auf der Netzhaut entsteht ein umgekehrtes Bild',
          'Die Linse bündelt Licht',
          'Die Pupille regelt den Lichteinfall',
          'Das Auge sendet Strahlen zum Gegenstand',
          'Der Sehnerv leitet Signale zum Gehirn',
        ],
        correct: [
          'Auf der Netzhaut entsteht ein umgekehrtes Bild',
          'Die Linse bündelt Licht',
          'Die Pupille regelt den Lichteinfall',
          'Der Sehnerv leitet Signale zum Gehirn',
        ],
      },
      {
        question: 'Was brauchst du, um zu sehen? (mehrere möglich)',
        choices: [
          'Licht vom Gegenstand (oder einer Quelle)',
          'funktionierende Linse und Netzhaut',
          'völlig dunklen Raum ohne jedes Licht',
          'Weiterleitung zum Gehirn',
          'dass das Auge selbst Strahlen aussendet',
        ],
        correct: [
          'Licht vom Gegenstand (oder einer Quelle)',
          'funktionierende Linse und Netzhaut',
          'Weiterleitung zum Gehirn',
        ],
      },
    ] as const
    const p = pick(rng, [...pools])
    return multiSelectTask({
      question: p.question,
      choices: [...p.choices],
      correct: [...p.correct],
      solution: p.correct.join('; '),
      explanation: 'Sehen: Licht → Auge → Netzhautsignale → Gehirn.',
      visualContent: augeSehSvg({ showRays: true }),
      instruction: 'Tippe alle zutreffenden Aussagen:',
    })
  },
)

/** Wahlbereich — Dämmstoffe vergleichen (nicht allgemeine Wärmedämmung) */
const daemmstoff: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Welcher Stoff dämmt typischerweise am besten?',
        correct: 'Mineralwolle / Styropor (viel stillstehende Luft)',
        wrong: ['Massives Metallblech', 'durchgehende Kupferbrücke', 'fließendes Wasser allein'],
      },
      {
        q: 'Warum dämmt Mineralwolle gut?',
        correct: 'viele Luftporen — Luft leitet Wärme schlecht',
        wrong: [
          'sie leitet Wärme besser als Kupfer',
          'sie erzeugt eigene Wärme',
          'sie ist komplett metallisch',
        ],
      },
      {
        q: 'Warum dämmt Metall schlecht?',
        correct: 'Metalle leiten Wärme gut',
        wrong: [
          'Metalle enthalten nur Luftporen',
          'Metalle sind immer Isolatoren',
          'Metall erzeugt Kälte von allein',
        ],
      },
      {
        q: 'Vergleiche Styropor und Vollholz (schematisch):',
        correct: 'Styropor dämmt meist besser (mehr eingeschlossene Luft)',
        wrong: [
          'Vollholz dämmt immer besser als Styropor',
          'beide dämmen wie Kupfer',
          'Styropor leitet Wärme wie Metall',
        ],
      },
      {
        q: 'Welches Material ist als Wärmedämmstoff ungeeignet?',
        correct: 'durchgehendes Metall ohne Unterbrechung',
        wrong: ['Mineralwolle', 'Styroporplatten', 'Luftpolster in Isolierglas'],
      },
      {
        q: 'Stillstehende Luft in Poren …',
        correct: 'verbessert die Dämmwirkung',
        wrong: [
          'verschlechtert die Dämmung immer',
          'leitet Wärme wie Kupfer',
          'spielt bei Dämmstoffen keine Rolle',
        ],
      },
      {
        q: 'Zwei 10-cm-Schichten: Mineralwolle vs. Metall. Was gilt?',
        correct: 'Mineralwolle dämmt deutlich besser',
        wrong: [
          'Metall dämmt besser',
          'beide gleich',
          'Metall speichert Licht als Dämmung',
        ],
      },
      {
        q: 'Beim Vergleich von Dämmstoffen schaut man vor allem auf …',
        correct: 'wie gut sie den Wärmefluss behindern',
        wrong: [
          'nur die Farbe der Platte',
          'nur den Stromwiderstand',
          'nur die Lautstärke',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Gute Dämmstoffe halten Luft in Poren fest. Metall leitet Wärme gut → schlecht dämmend.',
      visualContent: daemmstoffCompareSvg(),
      instruction: 'Vergleiche die Dämmstoffe:',
    })
  },
  (rng) => {
    const ordered = [
      { label: 'Metall (leitet gut)', value: 0 },
      { label: 'Vollholz', value: 1 },
      { label: 'Styropor', value: 2 },
      { label: 'Mineralwolle', value: 3 },
    ]
    const shuffled = [...ordered]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return dragDropSortTask({
      question: 'Ordne nach steigender Dämmwirkung (schlecht → gut), schematisch wie in der Abbildung.',
      items: shuffled,
      correctOrder: [0, 1, 2, 3],
      solution: 'Metall → Vollholz → Styropor → Mineralwolle',
      explanation: 'Mehr stillstehende Luft in Poren → bessere Dämmung. Metall dämmt am schlechtesten.',
      visualContent: daemmstoffCompareSvg(),
    })
  },
  (rng) => {
    const pools = [
      {
        question: 'Welche Stoffe dämmen typischerweise gut? (mehrere möglich)',
        choices: [
          'Mineralwolle',
          'Styropor / Hartschaum',
          'blankes Kupferblech allein',
          'Luft in kleinen Poren',
          'durchgehende Stahlbrücke',
        ],
        correct: ['Mineralwolle', 'Styropor / Hartschaum', 'Luft in kleinen Poren'],
      },
      {
        question: 'Worauf achtest du beim Vergleich von Dämmstoffen? (mehrere möglich)',
        choices: [
          'Wärmeleitfähigkeit (niedrig = besser dämmend)',
          'Poren / stillstehende Luft',
          'ob Metallbrücken Wärme leiten',
          'nur die Verpackungsfarbe',
          'ob der Stoff Strom speichert',
        ],
        correct: [
          'Wärmeleitfähigkeit (niedrig = besser dämmend)',
          'Poren / stillstehende Luft',
          'ob Metallbrücken Wärme leiten',
        ],
      },
    ] as const
    const p = pick(rng, [...pools])
    return multiSelectTask({
      question: p.question,
      choices: [...p.choices],
      correct: [...p.correct],
      solution: p.correct.join('; '),
      explanation: 'Dämmstoffe vergleichen heißt: Wärmeleitung und Luftporen beurteilen.',
      visualContent: daemmstoffCompareSvg(),
      instruction: 'Tippe alle passenden Antworten:',
    })
  },
)

/** Wahlbereich — Farbfilter (nicht allgemeine Optik/Spiegel) */
const farbfilter: Topic['generate'] = mixedVariants(
  // Nur Text — Bild würde oft nicht zur Formulierung passen / ist überflüssig
  (rng) => {
    const cases = [
      {
        q: 'Weißes Licht hinter einem roten Filter erscheint …',
        correct: 'vor allem rot',
        wrong: ['vor allem blau', 'weiß wie vorher ohne Filter', 'immer schwarz'],
      },
      {
        q: 'Zwei starke Filter Rot und Grün hintereinander (weißes Licht) …',
        correct: 'lassen kaum Licht durch (fast dunkel)',
        wrong: [
          'lassen immer weißes Licht unverändert durch',
          'erzeugen Ultraschall',
          'wirken wie ein Prisma ohne Filterung',
        ],
      },
      {
        q: 'Ein Farbfilter …',
        correct: 'lässt „seine“ Farbe durch und schwächt andere Anteile',
        wrong: [
          'erzeugt Licht aus dem Nichts',
          'spiegelt nur wie ein ebener Spiegel',
          'ändert den Einfallswinkel = Ausfallswinkel',
        ],
      },
      {
        q: 'Ohne Licht hinter dem Filter …',
        correct: 'sieht man keine Filterfarbe',
        wrong: [
          'leuchtet der Filter von allein',
          'entstehen alle Spektralfarben neu',
          'gilt das Reflexionsgesetz am Filter',
        ],
      },
      {
        q: 'Ein blauer Filter lässt vor allem …',
        correct: 'blaues Licht durch',
        wrong: ['nur rotes Licht durch', 'alle Farben unverändert', 'Ultraschall'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Farbfilter: subtraktiv — „eigene“ Farbe durch, andere Spektralanteile werden geschwächt.',
      instruction: 'Tippe die passende Aussage zum Farbfilter:',
    })
  },
  // Mit Abbildung: Frage und SVG nutzen dieselbe Filterfarbe
  (rng) => {
    const color = pick(rng, ['rot', 'grün', 'blau'] as const)
    const through =
      color === 'rot' ? 'rotes Licht' : color === 'grün' ? 'grünes Licht' : 'blaues Licht'
    const cases = [
      {
        q: `Sieh dir die Abbildung an: Ein ${color}er Farbfilter lässt vor allem …`,
        correct: `${through} durch`,
        wrong: [
          'alle Spektralfarben gleich stark durch',
          'nur Ultraschall durch',
          'gar kein Licht durch',
        ],
      },
      {
        q: `Abbildung: Welches Licht kommt hinter dem ${color}en Filter vor allem an?`,
        correct: through,
        wrong: ['weißes Licht unverändert', 'nur Ultraschall', 'gar kein sichtbares Licht immer'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: `Der ${color}e Filter lässt vor allem ${through} durch.`,
      visualContent: farbfilterSvg({ filterColor: color, showAfter: true }),
      instruction: 'Nutze die Abbildung:',
    })
  },
  (rng) => {
    const ordered = [
      { label: 'weißes Licht', value: 0 },
      { label: 'Farbfilter', value: 1 },
      { label: 'vor allem Filterfarbe', value: 2 },
    ]
    const shuffled = [...ordered]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    const color = pick(rng, ['rot', 'grün', 'blau'] as const)
    return dragDropSortTask({
      question: `Ordne den Weg des Lichts durch den ${color}en Farbfilter (siehe Abbildung).`,
      items: shuffled,
      correctOrder: [0, 1, 2],
      solution: 'weißes Licht → Farbfilter → vor allem Filterfarbe',
      explanation: `Der ${color}e Filter lässt vor allem ${color}es Licht durch.`,
      visualContent: farbfilterSvg({ filterColor: color, showAfter: true }),
    })
  },
  (rng) => {
    const pools = [
      {
        question: 'Welche Aussagen zu Farbfiltern stimmen? (mehrere möglich)',
        choices: [
          'Ein roter Filter lässt vor allem Rot durch',
          'Andere Spektralfarben werden geschwächt',
          'Filter erzeugen Licht ohne Lichtquelle',
          'Zwei komplementäre Filter können fast alles Licht blockieren',
          'Ein Filter wirkt wie ein ebener Spiegel (Einfall = Ausfall)',
        ],
        correct: [
          'Ein roter Filter lässt vor allem Rot durch',
          'Andere Spektralfarben werden geschwächt',
          'Zwei komplementäre Filter können fast alles Licht blockieren',
        ],
      },
      {
        question: 'Was gehört zur Wirkung eines Farbfilters? (mehrere möglich)',
        choices: [
          'Durchlassen „seiner“ Farbe',
          'Zurückhalten / Schwächen anderer Farben',
          'Zerlegen in ein volles Spektrum wie ein Prisma',
          'Arbeitet mit vorhandenem Licht',
          'Ersetzt die Lichtquelle',
        ],
        correct: [
          'Durchlassen „seiner“ Farbe',
          'Zurückhalten / Schwächen anderer Farben',
          'Arbeitet mit vorhandenem Licht',
        ],
      },
    ] as const
    const p = pick(rng, [...pools])
    return multiSelectTask({
      question: p.question,
      choices: [...p.choices],
      correct: [...p.correct],
      solution: p.correct.join('; '),
      explanation: 'Farbfilter filtern Spektralanteile — sie ersetzen kein Prisma und keinen Spiegel.',
      instruction: 'Tippe alle zutreffenden Aussagen:',
    })
  },
)

/**
 * Wahlbereich — Spektrum und Prisma (Klasse 6: qualitativ, KEIN n·sin α / Brechungsgesetz-Formelbau).
 * Sinus-Brechungsgesetz gehört nicht in Klasse 6.
 */
const spektrumPrisma: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Was macht ein Prisma mit weißem Licht?',
        correct: 'es zerlegt es in Spektralfarben (Dispersion)',
        wrong: [
          'es spiegelt nur nach dem Reflexionsgesetz',
          'es löscht alles Licht',
          'es erzeugt Ultraschall',
        ],
      },
      {
        q: 'Weißes Licht enthält …',
        correct: 'viele Farben / Wellenlängen',
        wrong: [
          'nur eine einzige Farbe Rot',
          'keine Farben',
          'nur Schatten',
        ],
      },
      {
        q: 'Welche Farbe wird in Glas typischerweise am stärksten abgelenkt?',
        correct: 'Violett / Blau stärker als Rot',
        wrong: [
          'Rot stärker als Violett',
          'alle Farben gleich ohne Dispersion',
          'nur Grün wird abgelenkt',
        ],
      },
      {
        q: 'Ein Regenbogen entsteht, weil …',
        correct: 'Sonnenlicht an Wassertropfen gebrochen und zerlegt wird',
        wrong: [
          'ohne Sonne Farben entstehen',
          'nur Spiegelung am ebenen Spiegel',
          'Ultraschall Spektren speichert',
        ],
      },
      {
        q: 'Dispersion bedeutet …',
        correct: 'Zerlegung von Licht in Spektralfarben (unterschiedliche Brechung)',
        wrong: [
          'nur Mischen von Massen',
          'Einfallswinkel = Ausfallswinkel am Spiegel',
          'nur Kelvin-Umrechnung',
        ],
      },
      {
        q: 'Hinter dem Prisma siehst du typischerweise …',
        correct: 'ein Farbspektrum (z. B. rot bis violett)',
        wrong: [
          'nur eine graue Fläche ohne Farben',
          'nur den Schatten der Kerze',
          'einen Stromkreis',
        ],
      },
      {
        q: 'Welches Gerät zerlegt weißes Licht ähnlich wie ein Prisma?',
        correct: 'optisches Gitter (oder Tropfen beim Regenbogen)',
        wrong: ['Amperemeter', 'Thermometer', 'Kurzschlussdraht'],
      },
      {
        q: 'Rot und Violett im Spektrum unterscheiden sich durch …',
        correct: 'unterschiedliche Wellenlänge / Farbe',
        wrong: [
          'unterschiedliche Masse des Prismas',
          'nur die Lautstärke',
          'nur die Temperatur in Kelvin',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Prisma: Brechung hängt von der Farbe ab (Dispersion) → Spektrum. Kein Sinus-Brechungsgesetz nötig.',
      visualContent: prismaSpektrumSvg(),
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'In der Abbildung: Was tritt links in das Prisma ein?',
        correct: 'weißes Licht',
        wrong: ['nur rotes Licht', 'Ultraschall', 'ein Strom'],
      },
      {
        q: 'In der Abbildung: Was entsteht rechts hinter dem Prisma?',
        correct: 'ein Farbspektrum',
        wrong: [
          'nur ein grauer Schatten',
          'unverändertes weißes Licht ohne Farben',
          'eine Spiegelung mit Einfall = Ausfall',
        ],
      },
      {
        q: 'Warum fächern sich die Farben hinter dem Prisma auf?',
        correct: 'verschiedene Farben werden unterschiedlich stark gebrochen',
        wrong: [
          'das Prisma dreht sich mechanisch',
          'Licht läuft nur im Kreis',
          'ohne Brechung',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Weißes Licht → Prisma → Spektrum durch Dispersion.',
      visualContent: prismaSpektrumSvg(),
      instruction: 'Nutze die Abbildung:',
    })
  },
  (rng) => {
    const ordered = [
      { label: 'weißes Licht', value: 0 },
      { label: 'Prisma (Brechung)', value: 1 },
      { label: 'Spektrum sichtbar', value: 2 },
    ]
    const shuffled = [...ordered]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return dragDropSortTask({
      question: 'Ordne: Wie entsteht das Spektrum am Prisma?',
      items: shuffled,
      correctOrder: [0, 1, 2],
      solution: 'weißes Licht → Prisma → Spektrum',
      explanation: 'Einfall → wellenlängenabhängige Brechung → sichtbares Spektrum.',
      visualContent: prismaSpektrumSvg(),
    })
  },
  (rng) => {
    const pools = [
      {
        question: 'Was gehört zu Spektrum und Prisma? (mehrere möglich)',
        choices: [
          'weißes Licht enthält viele Farben',
          'Dispersion zerlegt Licht',
          'Farbspektrum hinter dem Prisma',
          'Einfallswinkel = Ausfallswinkel am Prisma wie am Spiegel',
          'Farben entstehen nur ohne Licht',
        ],
        correct: [
          'weißes Licht enthält viele Farben',
          'Dispersion zerlegt Licht',
          'Farbspektrum hinter dem Prisma',
        ],
      },
      {
        question: 'Welche Aussagen zum Regenbogen / Spektrum stimmen? (mehrere möglich)',
        choices: [
          'Tropfen wirken ähnlich wie ein Prisma',
          'Sonnenlicht wird zerlegt',
          'Farben von Rot bis Violett',
          'ohne Licht entsteht trotzdem ein Spektrum',
          'nur Metall erzeugt Spektren',
        ],
        correct: [
          'Tropfen wirken ähnlich wie ein Prisma',
          'Sonnenlicht wird zerlegt',
          'Farben von Rot bis Violett',
        ],
      },
    ] as const
    const p = pick(rng, [...pools])
    return multiSelectTask({
      question: p.question,
      choices: [...p.choices],
      correct: [...p.correct],
      solution: p.correct.join('; '),
      explanation:
        'Prisma und Regenbogen: weißes Licht wird in Spektralfarben zerlegt (Dispersion).',
      visualContent: prismaSpektrumSvg(),
      instruction: 'Tippe alle zutreffenden Aussagen:',
    })
  },
)

export const PHYSIK_K6_GENERATORS: Record<string, Topic['generate']> = {
  'ph-k6-lb1-schatten': schatten,
  'ph-k6-lb1-kernschatten': kernschatten,
  'ph-k6-lb1-lampenposition': lampenposition,
  'ph-k6-lb1-lichtstrahl': lichtstrahl,
  'ph-k6-lb1-spiegel': spiegel,
  'ph-k6-lb1-brechung': brechung,
  'ph-k6-lb1-ausbreitung': ausbreitung,
  'ph-k6-lb1-lichtquellen': lichtquellen,
  'ph-k6-lb1-sonne-mond-erde': sonneMondErde,
  'ph-k6-lb2-dichte': dichte,
  'ph-k6-lb2-geschwindigkeit': geschwindigkeit,
  'ph-k6-lb2-wegzeit': wegzeit,
  'ph-k6-lb2-einheiten': einheiten,
  'ph-k6-lb2-masse': masseVergleich,
  'ph-k6-lb3-thermometer': thermometer,
  'ph-k6-lb3-kelvin': kelvin,
  'ph-k6-lb3-aggregate': aggregate,
  'ph-k6-lb3-ausdehnung': ausdehnung,
  'ph-k6-lb3-schmelzen': schmelzen,
  'ph-k6-lb3-messreihe': messreihe,
  'ph-k6-lb4-stromkreis': stromkreis,
  'ph-k6-lb4-leiter': leiter,
  'ph-k6-lb4-symbole': schaltsymbole,
  'ph-k6-lb4-widerstand': widerstand,
  'ph-k6-lb4-reiheparallel': reiheparallel,
  'ph-k6-lb4-gefahren': gefahren,
  'ph-k6-lbw-sehen': sehen,
  'ph-k6-lbw-lochkamera': lochkamera,
  'ph-k6-lbw-auge': auge,
  'ph-k6-lbw-daemmung': daemmung,
  'ph-k6-lbw-daemmstoff': daemmstoff,
  'ph-k6-lbw-farben': farben,
  'ph-k6-lbw-filter': farbfilter,
  'ph-k6-lbw-spektrum': spektrumPrisma,
}
