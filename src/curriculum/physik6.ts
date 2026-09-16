import { pick, randInt, type Rng } from '../lib/rng'
import {
  circuitSvg,
  kernHalbschattenSvg,
  lightRayHintSvg,
  lightShadowSvg,
  mirrorAngleSvg,
  thermometerSvg,
} from '../lib/physikSvg'
import {
  choicePickTask,
  coordinateClickTask,
  dragDropSortTask,
  mixedVariants,
  multiSelectTask,
  numberLineTask,
  paramSliderTask,
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
      question: `Ein Körper hat die Masse m = ${m} g und das Volumen V = ${v} cm³. Berechne die Dichte ρ = m / V.`,
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
      question: `Stelle Masse und Volumen so ein, dass ρ = m / V = ${rho} g/cm³ gilt (m = ${m} g, V = ${v} cm³).`,
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
)

const geschwindigkeit: Topic['generate'] = (rng) => {
  const v = pick(rng, [2, 3, 4, 5, 6, 8, 10])
  const t = pick(rng, [2, 3, 4, 5, 6])
  const s = v * t
  return mixedVariants(
    () =>
      valueTask({
        question: `Ein Körper bewegt sich gleichförmig mit v = ${v} m/s für t = ${t} s. Welche Strecke s legt er zurück? (s = v · t)`,
        answerKind: 'integer',
        unit: 'm',
        value: s,
        solution: `${s} m`,
        explanation: `s = v · t = ${v} · ${t} = ${s} m.`,
      }),
    () =>
      valueTask({
        question: `Ein Körper legt s = ${s} m in t = ${t} s gleichförmig zurück. Berechne die Geschwindigkeit v = s / t.`,
        answerKind: 'integer',
        unit: 'm/s',
        value: v,
        solution: `${v} m/s`,
        explanation: `v = s / t = ${s} / ${t} = ${v} m/s.`,
      }),
  )(rng)
}

const masseVergleich: Topic['generate'] = mixedVariants(
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
  (rng) => {
    const items = [
      { label: 'Federwaage: 2 kg', value: 2 },
      { label: 'Federwaage: 5 kg', value: 5 },
      { label: 'Federwaage: 8 kg', value: 8 },
    ]
    const ordered = [...items]
    for (let i = items.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[items[i], items[j]] = [items[j]!, items[i]!]
    }
    const correctOrder = ordered.map((row) => items.findIndex((it) => it.value === row.value))
    return dragDropSortTask({
      question: 'Ordne die Körper nach steigender Masse (leicht → schwer).',
      items,
      correctOrder,
      solution: '2 kg → 5 kg → 8 kg',
      explanation: 'Größere Masse bedeutet bei gleicher g größere Gewichtskraft.',
    })
  },
)

/** LB3 — Temperatur */
const thermometer: Topic['generate'] = mixedVariants(
  (rng) => {
    const c = pick(rng, [-10, 0, 20, 37, 40, 60, 80, 100])
    return numberLineTask({
      question: 'Stelle die Temperatur auf dem Zahlenstrahl ein (in °C).',
      min: -20,
      max: 100,
      step: 1,
      value: c,
      solution: `${c} °C`,
      explanation: `Die Markierung liegt bei ${c} °C.`,
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
      question: `Wandle ${c} °C in Kelvin um (T/K = ϑ/°C + 273).`,
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
      question: `Wandle ${k} K in °C um (ϑ/°C = T/K − 273).`,
      answerKind: 'integer',
      unit: '°C',
      value: c,
      solution: `${c} °C`,
      explanation: `ϑ = ${k} − 273 = ${c} °C.`,
    })
  },
  (rng) => {
    const c = pick(rng, [0, 20, 37, 100])
    return numberLineTask({
      question: `Stelle ${c} °C auf dem Zahlenstrahl ein (nur zur Orientierung; Lösung in °C).`,
      min: -20,
      max: 120,
      step: 1,
      value: c,
      solution: `${c} °C`,
      explanation: `${c} °C entspricht ${c + 273} K.`,
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
        q: 'Eis bei −5 °C ist …',
        correct: 'fest',
        choices: ['fest', 'flüssig', 'gasförmig'],
      },
      {
        q: 'Wasserdampf über kochendem Wasser ist …',
        correct: 'gasförmig',
        choices: ['fest', 'flüssig', 'gasförmig'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [...c.choices], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Aggregatzustand hängt von Stoff und Temperatur (sowie Druck) ab.',
      instruction: 'Tippe den Aggregatzustand:',
    })
  },
  () =>
    dragDropSortTask({
      question: 'Ordne die Vorgänge nach steigender Temperatur (kalt → heiß) für Wasser.',
      items: [
        { label: 'Eis schmilzt (0 °C)', value: 0 },
        { label: 'Wasser kocht (100 °C)', value: 100 },
        { label: 'Raumtemperatur (~20 °C)', value: 20 },
      ],
      correctOrder: [0, 2, 1],
      solution: 'Eis schmilzt → Raumtemperatur → Wasser kocht',
      explanation: '0 °C (Schmelzen) < ~20 °C < 100 °C (Sieden).',
    }),
  (rng) => {
    const t0 = pick(rng, [0, 1, 2])
    const dt = pick(rng, [3, 4, 5])
    const temp0 = pick(rng, [5, 10, 18, 20, 22])
    const dT = pick(rng, [8, 10, 12, 14])
    const ordered = [
      { label: `t = ${t0} min: ${temp0} °C`, value: t0 },
      { label: `t = ${t0 + dt} min: ${temp0 + dT} °C`, value: t0 + dt },
      { label: `t = ${t0 + 2 * dt} min: ${temp0 + 2 * dT} °C`, value: t0 + 2 * dt },
    ]
    const items = [...ordered]
    for (let i = items.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[items[i], items[j]] = [items[j]!, items[i]!]
    }
    const correctOrder = ordered.map((row) => items.findIndex((it) => it.value === row.value))
    return dragDropSortTask({
      question: 'Ordne die Messreihe nach der Zeit (früh → spät).',
      items,
      correctOrder,
      solution: ordered.map((row) => row.label).join(' → '),
      explanation: 'Bei einer Messreihe sortiert man nach der Zeitachse von früh nach spät.',
    })
  },
)

/** LB4 — Stromkreis */
const stromkreis: Topic['generate'] = mixedVariants(
  (rng) => {
    const closed = pick(rng, [true, false])
    const device = pick(rng, ['Lampe', 'Summer', 'LED'])
    const correct = closed ? `Die ${device} ist an.` : `Die ${device} ist aus.`
    const wrong = closed ? `Die ${device} ist aus.` : `Die ${device} ist an.`
    return choicePickTask({
      question: `Einfacher Stromkreis mit ${device}: Schalter ist ${closed ? 'geschlossen' : 'offen'}. Was gilt?`,
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
      visualContent: circuitSvg(closed),
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
      question: `Die Lampe ${closed ? 'leuchtet' : 'leuchtet nicht'}. Ist der Stromkreis eher offen oder geschlossen?`,
      choices: shuffleChoices(rng, ['offen', 'geschlossen', 'weder noch', 'nur die Batterie'], correct),
      correct,
      solution: correct,
      explanation: closed
        ? 'Leuchtet die Lampe, ist der Kreis geschlossen.'
        : 'Leuchtet die Lampe nicht (bei intakter Lampe/Batterie), ist der Kreis oft offen.',
      visualContent: circuitSvg(closed),
      instruction: 'Tippe den Zustand:',
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

/** Wahlbereiche */
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

export const PHYSIK_K6_GENERATORS: Record<string, Topic['generate']> = {
  'ph-k6-lb1-schatten': schatten,
  'ph-k6-lb1-lampenposition': lampenposition,
  'ph-k6-lb1-lichtstrahl': lichtstrahl,
  'ph-k6-lb1-spiegel': spiegel,
  'ph-k6-lb1-brechung': brechung,
  'ph-k6-lb1-ausbreitung': ausbreitung,
  'ph-k6-lb2-dichte': dichte,
  'ph-k6-lb2-geschwindigkeit': geschwindigkeit,
  'ph-k6-lb2-masse': masseVergleich,
  'ph-k6-lb3-thermometer': thermometer,
  'ph-k6-lb3-kelvin': kelvin,
  'ph-k6-lb3-aggregate': aggregate,
  'ph-k6-lb4-stromkreis': stromkreis,
  'ph-k6-lb4-leiter': leiter,
  'ph-k6-lbw-sehen': sehen,
  'ph-k6-lbw-daemmung': daemmung,
  'ph-k6-lbw-farben': farben,
}
