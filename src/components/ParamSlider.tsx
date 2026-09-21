import { useMemo } from 'react'
import { generateLinearFunctionSvg } from '../lib/geometrySvg'
import {
  FUNCTION_PREVIEW_OPTIONS,
  functionSpecFromSliderValues,
  generateAuthoredFunctionGraphSvg,
  type FunctionPreviewKind,
} from '../lib/functionGraph'
import { ensureSvgViewBox } from '../lib/ensureSvgViewBox'
import { lightShadowFromLampParam } from '../lib/physikSvg'
import type { ParamSliderSpec } from '../curriculum/taskHelpers'
import './ParamSlider.css'

export type ParamSliderPreview = FunctionPreviewKind | 'shadow'

export interface ParamSliderProps {
  params: ParamSliderSpec[]
  values: Record<string, number>
  onChange: (values: Record<string, number>) => void
  instruction?: string
  preview?: ParamSliderPreview
  /** When set with preview=shadow: Schatten bleibt fest, nur die Lampe wandert. */
  fixedShadowSide?: 'left' | 'right'
  disabled?: boolean
}

export { FUNCTION_PREVIEW_OPTIONS }

/** Numeric parameter sliders with optional live preview (functions / Schatten). */
export const ParamSlider: React.FC<ParamSliderProps> = ({
  params,
  values,
  onChange,
  instruction,
  preview,
  fixedShadowSide,
  disabled = false,
}) => {
  const setParam = (id: string, raw: number) => {
    onChange({ ...values, [id]: raw })
  }

  const previewSvg = useMemo(() => {
    if (!preview) return null
    if (preview === 'shadow') {
      const lamp = values.lamp
      if (lamp === undefined) return null
      return lightShadowFromLampParam(lamp, {
        fixedShadowSide,
        showLampCaption: false,
      })
    }
    if (preview === 'linear' && values.m !== undefined && values.n !== undefined) {
      // Keep the dedicated slope-triangle diagram for linear when m/n present.
      return generateLinearFunctionSvg({
        m: values.m,
        n: values.n,
        interceptLabel: `n=${values.n}`,
        slopeTriangle: { fromX: 0, run: values.m >= 0 ? 1 : -1, showLabels: true },
        xRange: [-5, 5],
        yRange: [-6, 6],
        cellSize: 28,
      })
    }
    const spec = functionSpecFromSliderValues(preview, values)
    const asymptotesX =
      preview === 'reciprocal'
        ? [values.h ?? 0]
        : preview === 'ln'
          ? [values.h ?? 0]
          : undefined
    return generateAuthoredFunctionGraphSvg({
      curves: [spec],
      xRange: [-6, 6],
      yRange: [-6, 6],
      cellSize: 26,
      asymptotesX,
    })
  }, [preview, values, fixedShadowSide])

  return (
    <div className="param-slider">
      {instruction && <p className="param-slider__instruction">{instruction}</p>}
      {previewSvg && (
        <div
          className="param-slider__preview"
          dangerouslySetInnerHTML={{ __html: ensureSvgViewBox(previewSvg) }}
        />
      )}
      <div className="param-slider__controls">
        {params.map((p) => {
          const step = p.step ?? 1
          const val = values[p.id] ?? p.start ?? p.min
          return (
            <label key={p.id} className="param-slider__row">
              <span className="param-slider__label">
                {p.label}
                {!p.hideValue && (
                  <>
                    : <strong>{String(val).replace('.', ',')}</strong>
                  </>
                )}
              </span>
              <input
                type="range"
                min={p.min}
                max={p.max}
                step={step}
                value={val}
                disabled={disabled}
                onChange={(e) => setParam(p.id, Number(e.target.value))}
              />
            </label>
          )
        })}
      </div>
    </div>
  )
}
