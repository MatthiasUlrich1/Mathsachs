/**
 * Curated SVG templates for the Aufgabengenerator.
 * Each entry builds a live SVG and a paste-ready TS call for export.
 */
import {
  generateAngleSvg,
  generateCircleSvg,
  generateCompositeCuboidSvg,
  generateCoordinateGridSvg,
  generateCuboidSvg,
  generateLShapeSvg,
  generateLinearFunctionSvg,
  generatePyramidSurfaceSvg,
  generateRectangleSvg,
  generateTriangleSvg,
  generateUShapeSvg,
  generateVectorArrowsSvg,
} from './geometrySvg'
import {
  buildFunctionTemplateSvg,
  FUNCTION_KIND_META,
  type FunctionKind,
} from './functionGraph'
import {
  circuitSvg,
  circuitSymbolsRowSvg,
  seriesParallelSvg,
  thermometerSvg,
} from './physikSvg'

export type SvgTemplateParam = {
  key: string
  label: string
  /** Default string value shown in the form. */
  defaultValue: string
}

export type SvgTemplate = {
  id: string
  label: string
  group: 'mathe' | 'physik' | 'funktionen'
  params: SvgTemplateParam[]
  build: (params: Record<string, string>) => string
  /** TypeScript expression for exportSnippet (uses params). */
  exportCall: (params: Record<string, string>) => string
}

const s = (params: Record<string, string>, key: string, fallback: string) =>
  (params[key] ?? fallback).trim() || fallback

const n = (params: Record<string, string>, key: string, fallback: number) => {
  const v = Number(params[key])
  return Number.isFinite(v) ? v : fallback
}

export const SVG_TEMPLATES: SvgTemplate[] = [
  {
    id: 'rectangle',
    label: 'Rechteck',
    group: 'mathe',
    params: [
      { key: 'widthLabel', label: 'Breite-Label', defaultValue: '5 cm' },
      { key: 'heightLabel', label: 'Höhe-Label', defaultValue: '3 cm' },
    ],
    build: (p) =>
      generateRectangleSvg({
        widthLabel: s(p, 'widthLabel', '5 cm'),
        heightLabel: s(p, 'heightLabel', '3 cm'),
      }),
    exportCall: (p) =>
      `generateRectangleSvg({ widthLabel: ${JSON.stringify(s(p, 'widthLabel', '5 cm'))}, heightLabel: ${JSON.stringify(s(p, 'heightLabel', '3 cm'))} })`,
  },
  {
    id: 'triangle',
    label: 'Dreieck',
    group: 'mathe',
    params: [
      { key: 'baseLabel', label: 'Grundseite', defaultValue: '6 cm' },
      { key: 'heightLabel', label: 'Höhe', defaultValue: '4 cm' },
    ],
    build: (p) =>
      generateTriangleSvg({
        baseLabel: s(p, 'baseLabel', '6 cm'),
        heightLabel: s(p, 'heightLabel', '4 cm'),
      }),
    exportCall: (p) =>
      `generateTriangleSvg({ baseLabel: ${JSON.stringify(s(p, 'baseLabel', '6 cm'))}, heightLabel: ${JSON.stringify(s(p, 'heightLabel', '4 cm'))} })`,
  },
  {
    id: 'circle',
    label: 'Kreis',
    group: 'mathe',
    params: [{ key: 'radiusLabel', label: 'Radius-Label', defaultValue: 'r = 3 cm' }],
    build: (p) => generateCircleSvg({ radiusLabel: s(p, 'radiusLabel', 'r = 3 cm') }),
    exportCall: (p) =>
      `generateCircleSvg({ radiusLabel: ${JSON.stringify(s(p, 'radiusLabel', 'r = 3 cm'))} })`,
  },
  {
    id: 'angle',
    label: 'Winkel',
    group: 'mathe',
    params: [
      { key: 'angle', label: 'Winkel (°)', defaultValue: '60' },
      { key: 'label', label: 'Beschriftung', defaultValue: 'α' },
    ],
    build: (p) =>
      generateAngleSvg({
        angle: n(p, 'angle', 60),
        label: s(p, 'label', 'α'),
      }),
    exportCall: (p) =>
      `generateAngleSvg({ angle: ${n(p, 'angle', 60)}, label: ${JSON.stringify(s(p, 'label', 'α'))} })`,
  },
  {
    id: 'cuboid',
    label: 'Quader',
    group: 'mathe',
    params: [
      { key: 'lengthLabel', label: 'Länge', defaultValue: '5 cm' },
      { key: 'widthLabel', label: 'Breite', defaultValue: '3 cm' },
      { key: 'heightLabel', label: 'Höhe', defaultValue: '4 cm' },
    ],
    build: (p) =>
      generateCuboidSvg({
        lengthLabel: s(p, 'lengthLabel', '5 cm'),
        widthLabel: s(p, 'widthLabel', '3 cm'),
        heightLabel: s(p, 'heightLabel', '4 cm'),
      }),
    exportCall: (p) =>
      `generateCuboidSvg({ lengthLabel: ${JSON.stringify(s(p, 'lengthLabel', '5 cm'))}, widthLabel: ${JSON.stringify(s(p, 'widthLabel', '3 cm'))}, heightLabel: ${JSON.stringify(s(p, 'heightLabel', '4 cm'))} })`,
  },
  {
    id: 'pyramidSurface',
    label: 'Pyramide (Oberfläche)',
    group: 'mathe',
    params: [
      { key: 'edgeLabel', label: 'Grundkante a', defaultValue: '6 cm' },
      { key: 'slantHeightLabel', label: 'Seitenflächenhöhe hₛ', defaultValue: '5 cm' },
    ],
    build: (p) =>
      generatePyramidSurfaceSvg({
        edgeLabel: s(p, 'edgeLabel', '6 cm'),
        slantHeightLabel: s(p, 'slantHeightLabel', '5 cm'),
      }),
    exportCall: (p) =>
      `generatePyramidSurfaceSvg({ edgeLabel: ${JSON.stringify(s(p, 'edgeLabel', '6 cm'))}, slantHeightLabel: ${JSON.stringify(s(p, 'slantHeightLabel', '5 cm'))} })`,
  },
  {
    id: 'lShape',
    label: 'L-Form (2D)',
    group: 'mathe',
    params: [
      { key: 'outerWidth', label: 'Außenbreite', defaultValue: '8' },
      { key: 'outerHeight', label: 'Außenhöhe', defaultValue: '6' },
      { key: 'cutWidth', label: 'Ausschnitt-Breite', defaultValue: '3' },
      { key: 'cutHeight', label: 'Ausschnitt-Höhe', defaultValue: '2' },
    ],
    build: (p) =>
      generateLShapeSvg({
        outerWidth: n(p, 'outerWidth', 8),
        outerHeight: n(p, 'outerHeight', 6),
        cutWidth: n(p, 'cutWidth', 3),
        cutHeight: n(p, 'cutHeight', 2),
        bottomLabel: `${n(p, 'outerWidth', 8)} m`,
        leftLabel: `${n(p, 'outerHeight', 6)} m`,
      }),
    exportCall: (p) =>
      `generateLShapeSvg({ outerWidth: ${n(p, 'outerWidth', 8)}, outerHeight: ${n(p, 'outerHeight', 6)}, cutWidth: ${n(p, 'cutWidth', 3)}, cutHeight: ${n(p, 'cutHeight', 2)}, bottomLabel: '${n(p, 'outerWidth', 8)} m', leftLabel: '${n(p, 'outerHeight', 6)} m' })`,
  },
  {
    id: 'uShape',
    label: 'U-Form (2D)',
    group: 'mathe',
    params: [
      { key: 'outerWidth', label: 'Außenbreite', defaultValue: '9' },
      { key: 'outerHeight', label: 'Außenhöhe', defaultValue: '6' },
      { key: 'notchWidth', label: 'Innenbreite', defaultValue: '3' },
      { key: 'notchHeight', label: 'Innenhöhe', defaultValue: '3' },
    ],
    build: (p) =>
      generateUShapeSvg({
        outerWidth: n(p, 'outerWidth', 9),
        outerHeight: n(p, 'outerHeight', 6),
        notchWidth: n(p, 'notchWidth', 3),
        notchHeight: n(p, 'notchHeight', 3),
        bottomLabel: `${n(p, 'outerWidth', 9)} m`,
        leftLabel: `${n(p, 'outerHeight', 6)} m`,
      }),
    exportCall: (p) =>
      `generateUShapeSvg({ outerWidth: ${n(p, 'outerWidth', 9)}, outerHeight: ${n(p, 'outerHeight', 6)}, notchWidth: ${n(p, 'notchWidth', 3)}, notchHeight: ${n(p, 'notchHeight', 3)}, bottomLabel: '${n(p, 'outerWidth', 9)} m', leftLabel: '${n(p, 'outerHeight', 6)} m' })`,
  },
  {
    id: 'compositeCuboid',
    label: 'L-Quader (3D)',
    group: 'mathe',
    params: [
      { key: 'length', label: 'Länge', defaultValue: '10' },
      { key: 'width', label: 'Tiefe', defaultValue: '8' },
      { key: 'height', label: 'Höhe', defaultValue: '4' },
      { key: 'cutLength', label: 'Ausschnitt-Länge', defaultValue: '4' },
      { key: 'cutWidth', label: 'Ausschnitt-Tiefe', defaultValue: '3' },
    ],
    build: (p) => {
      const length = n(p, 'length', 10)
      const width = n(p, 'width', 8)
      const height = n(p, 'height', 4)
      const cutLength = n(p, 'cutLength', 4)
      const cutWidth = n(p, 'cutWidth', 3)
      return generateCompositeCuboidSvg({
        length,
        width,
        height,
        cutLength,
        cutWidth,
        lengthLabel: `${length} cm`,
        heightLabel: `${height} cm`,
        cutLengthLabel: `${cutLength} cm`,
        cutWidthLabel: `${cutWidth} cm`,
        footWidthLabel: `${width - cutWidth} cm`,
      })
    },
    exportCall: (p) => {
      const length = n(p, 'length', 10)
      const width = n(p, 'width', 8)
      const height = n(p, 'height', 4)
      const cutLength = n(p, 'cutLength', 4)
      const cutWidth = n(p, 'cutWidth', 3)
      return `generateCompositeCuboidSvg({ length: ${length}, width: ${width}, height: ${height}, cutLength: ${cutLength}, cutWidth: ${cutWidth}, lengthLabel: '${length} cm', heightLabel: '${height} cm', cutLengthLabel: '${cutLength} cm', cutWidthLabel: '${cutWidth} cm', footWidthLabel: '${width - cutWidth} cm' })`
    },
  },
  {
    id: 'grid',
    label: 'Koordinatengitter',
    group: 'mathe',
    params: [
      { key: 'xMin', label: 'x min', defaultValue: '-5' },
      { key: 'xMax', label: 'x max', defaultValue: '5' },
      { key: 'yMin', label: 'y min', defaultValue: '-5' },
      { key: 'yMax', label: 'y max', defaultValue: '5' },
    ],
    build: (p) =>
      generateCoordinateGridSvg({
        xRange: [n(p, 'xMin', -5), n(p, 'xMax', 5)],
        yRange: [n(p, 'yMin', -5), n(p, 'yMax', 5)],
      }),
    exportCall: (p) =>
      `generateCoordinateGridSvg({ xRange: [${n(p, 'xMin', -5)}, ${n(p, 'xMax', 5)}], yRange: [${n(p, 'yMin', -5)}, ${n(p, 'yMax', 5)}] })`,
  },
  {
    id: 'linearFn',
    label: 'Gerade (Steigung)',
    group: 'funktionen',
    params: [
      { key: 'm', label: 'Steigung m', defaultValue: '1' },
      { key: 'n', label: 'n', defaultValue: '0' },
      { key: 'xMin', label: 'x min', defaultValue: '-5' },
      { key: 'xMax', label: 'x max', defaultValue: '5' },
      { key: 'yMin', label: 'y min', defaultValue: '-5' },
      { key: 'yMax', label: 'y max', defaultValue: '5' },
    ],
    build: (p) =>
      generateLinearFunctionSvg({
        m: n(p, 'm', 1),
        n: n(p, 'n', 0),
        xRange: [n(p, 'xMin', -5), n(p, 'xMax', 5)],
        yRange: [n(p, 'yMin', -5), n(p, 'yMax', 5)],
        slopeTriangle: { fromX: 0, run: n(p, 'm', 1) >= 0 ? 1 : -1, showLabels: true },
      }),
    exportCall: (p) =>
      `generateLinearFunctionSvg({ m: ${n(p, 'm', 1)}, n: ${n(p, 'n', 0)}, xRange: [${n(p, 'xMin', -5)}, ${n(p, 'xMax', 5)}], yRange: [${n(p, 'yMin', -5)}, ${n(p, 'yMax', 5)}], slopeTriangle: { fromX: 0, run: ${n(p, 'm', 1) >= 0 ? 1 : -1}, showLabels: true } })`,
  },
  {
    id: 'vectors',
    label: 'Vektoren',
    group: 'funktionen',
    params: [
      { key: 'v1', label: 'Vektor 1 (x,y)', defaultValue: '3,2' },
      { key: 'v2', label: 'Vektor 2 (x,y, optional)', defaultValue: '-1,3' },
      { key: 'xMin', label: 'x min', defaultValue: '-5' },
      { key: 'xMax', label: 'x max', defaultValue: '5' },
      { key: 'yMin', label: 'y min', defaultValue: '-5' },
      { key: 'yMax', label: 'y max', defaultValue: '5' },
    ],
    build: (p) => {
      const parseV = (raw: string, label: string) => {
        const [xs, ys] = raw.split(/[,|;]/).map((t) => t.trim())
        const x = Number(String(xs ?? '').replace(',', '.'))
        const y = Number(String(ys ?? '').replace(',', '.'))
        if (!Number.isFinite(x) || !Number.isFinite(y)) return null
        return { x, y, label }
      }
      const vectors = [
        parseV(s(p, 'v1', '3,2'), 'a⃗'),
        parseV(s(p, 'v2', ''), 'b⃗'),
      ].filter((v): v is { x: number; y: number; label: string } => v != null)
      return generateVectorArrowsSvg({
        vectors: vectors.length ? vectors : [{ x: 3, y: 2, label: 'a⃗' }],
        xRange: [n(p, 'xMin', -5), n(p, 'xMax', 5)],
        yRange: [n(p, 'yMin', -5), n(p, 'yMax', 5)],
      })
    },
    exportCall: (p) =>
      `generateVectorArrowsSvg({ vectors: [{ x: ${n(p, 'v1', 3)}, y: 2, label: 'a' }], xRange: [${n(p, 'xMin', -5)}, ${n(p, 'xMax', 5)}], yRange: [${n(p, 'yMin', -5)}, ${n(p, 'yMax', 5)}] })`,
  },
  ...FUNCTION_KIND_META.map((meta): SvgTemplate => {
    const rangeParams: SvgTemplateParam[] = [
      { key: 'xMin', label: 'x min', defaultValue: '-6' },
      { key: 'xMax', label: 'x max', defaultValue: '6' },
      { key: 'yMin', label: 'y min', defaultValue: '-6' },
      { key: 'yMax', label: 'y max', defaultValue: '6' },
      {
        key: 'points',
        label: 'Punkte (x,y:Label; …)',
        defaultValue: '',
      },
    ]
    const kindParams: SvgTemplateParam[] = meta.params.map((p) => ({
      key: p.key,
      label: p.label,
      defaultValue: String(p.defaultValue),
    }))
    return {
      id: `fn-${meta.id}`,
      label: meta.label,
      group: 'funktionen',
      params: [...kindParams, ...rangeParams],
      build: (p) => buildFunctionTemplateSvg(meta.id as FunctionKind, p),
      exportCall: (p) =>
        `/* ${meta.formula} */ buildFunctionTemplateSvg(${JSON.stringify(meta.id)}, ${JSON.stringify(p)})`,
    }
  }),
  {
    id: 'fn-dual',
    label: 'Zwei Funktionen (Schnitt)',
    group: 'funktionen',
    params: [
      { key: 'kind', label: 'f-Typ (linear|quadratic|sin|…)', defaultValue: 'linear' },
      { key: 'm', label: 'f: m / a', defaultValue: '1' },
      { key: 'n', label: 'f: n / b', defaultValue: '0' },
      { key: 'a', label: 'f: a', defaultValue: '1' },
      { key: 'b', label: 'f: b', defaultValue: '0' },
      { key: 'c', label: 'f: c', defaultValue: '0' },
      { key: 'h', label: 'f: h', defaultValue: '0' },
      { key: 'k', label: 'f: k', defaultValue: '0' },
      { key: 'expr', label: 'f: expr (wenn custom)', defaultValue: 'x' },
      {
        key: 'secondKind',
        label: 'g-Typ',
        defaultValue: 'linear',
      },
      { key: 'g_m', label: 'g: m', defaultValue: '-0.5' },
      { key: 'g_n', label: 'g: n', defaultValue: '2' },
      { key: 'g_a', label: 'g: a', defaultValue: '1' },
      { key: 'g_b', label: 'g: b', defaultValue: '0' },
      { key: 'g_c', label: 'g: c', defaultValue: '0' },
      { key: 'g_h', label: 'g: h', defaultValue: '0' },
      { key: 'g_k', label: 'g: k', defaultValue: '0' },
      { key: 'g_expr', label: 'g: expr', defaultValue: '2-x' },
      { key: 'xMin', label: 'x min', defaultValue: '-6' },
      { key: 'xMax', label: 'x max', defaultValue: '6' },
      { key: 'yMin', label: 'y min', defaultValue: '-6' },
      { key: 'yMax', label: 'y max', defaultValue: '6' },
      { key: 'points', label: 'Punkte', defaultValue: '' },
    ],
    build: (p) => {
      const kindRaw = s(p, 'kind', 'linear') as FunctionKind
      const kind = FUNCTION_KIND_META.some((m) => m.id === kindRaw)
        ? kindRaw
        : 'linear'
      return buildFunctionTemplateSvg(kind, p)
    },
    exportCall: (p) =>
      `buildFunctionTemplateSvg(${JSON.stringify(s(p, 'kind', 'linear'))}, ${JSON.stringify(p)})`,
  },
  {
    id: 'thermometer',
    label: 'Thermometer',
    group: 'physik',
    params: [{ key: 'celsius', label: '°C', defaultValue: '20' }],
    build: (p) => thermometerSvg(n(p, 'celsius', 20)),
    exportCall: (p) => `thermometerSvg(${n(p, 'celsius', 20)})`,
  },
  {
    id: 'circuit',
    label: 'Stromkreis (einfach)',
    group: 'physik',
    params: [
      { key: 'closed', label: 'Geschlossen (true|false)', defaultValue: 'true' },
      { key: 'device', label: 'Gerät (Lampe|Summer|LED)', defaultValue: 'Lampe' },
    ],
    build: (p) => {
      const closed = s(p, 'closed', 'true') !== 'false'
      const raw = s(p, 'device', 'Lampe')
      const device =
        raw === 'Summer' || raw === 'LED' || raw === 'Lampe' ? raw : 'Lampe'
      return circuitSvg(closed, device)
    },
    exportCall: (p) => {
      const closed = s(p, 'closed', 'true') !== 'false'
      const raw = s(p, 'device', 'Lampe')
      const device =
        raw === 'Summer' || raw === 'LED' || raw === 'Lampe' ? raw : 'Lampe'
      return `circuitSvg(${closed}, ${JSON.stringify(device)})`
    },
  },
  {
    id: 'seriesParallel',
    label: 'Reihe / Parallel',
    group: 'physik',
    params: [{ key: 'kind', label: 'Art (series|parallel)', defaultValue: 'series' }],
    build: (p) => {
      const kind = s(p, 'kind', 'series') === 'parallel' ? 'parallel' : 'series'
      return seriesParallelSvg(kind)
    },
    exportCall: (p) =>
      `seriesParallelSvg(${JSON.stringify(s(p, 'kind', 'series') === 'parallel' ? 'parallel' : 'series')})`,
  },
  {
    id: 'symbolsRow',
    label: 'Schaltsymbole (Reihe)',
    group: 'physik',
    params: [
      {
        key: 'kinds',
        label: 'Symbole (Komma: lamp,resistor,switchOpen,…)',
        defaultValue: 'lamp,resistor,switchOpen',
      },
    ],
    build: (p) => {
      const allowed = new Set([
        'battery',
        'lamp',
        'switchOpen',
        'switchClosed',
        'resistor',
        'motor',
        'buzzer',
        'ammeter',
      ])
      const kinds = s(p, 'kinds', 'lamp,resistor,switchOpen')
        .split(',')
        .map((x) => x.trim())
        .filter((x) => allowed.has(x)) as Array<
        | 'battery'
        | 'lamp'
        | 'switchOpen'
        | 'switchClosed'
        | 'resistor'
        | 'motor'
        | 'buzzer'
        | 'ammeter'
      >
      return circuitSymbolsRowSvg(kinds.length ? kinds : ['lamp', 'resistor'])
    },
    exportCall: (p) => {
      const kinds = s(p, 'kinds', 'lamp,resistor,switchOpen')
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
      return `circuitSymbolsRowSvg(${JSON.stringify(kinds)})`
    },
  },
]

export function getSvgTemplate(id: string): SvgTemplate | undefined {
  return SVG_TEMPLATES.find((t) => t.id === id)
}

/** Strip scripts / event handlers from pasted SVG. */
export function sanitizeSvg(raw: string): string {
  let s = raw.trim()
  if (!s) return ''
  s = s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
  s = s.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  s = s.replace(/javascript:/gi, '')
  if (!/<svg[\s>]/i.test(s)) {
    s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120">${s}</svg>`
  }
  return s
}
