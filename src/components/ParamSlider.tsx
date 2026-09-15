import { useMemo } from 'react'
import { generateLinearFunctionSvg } from '../lib/geometrySvg'
import type { ParamSliderSpec } from '../curriculum/taskHelpers'
import './ParamSlider.css'

export interface ParamSliderProps {
  params: ParamSliderSpec[]
  values: Record<string, number>
  onChange: (values: Record<string, number>) => void
  instruction?: string
  preview?: 'linear'
  disabled?: boolean
}

/** Numeric parameter sliders with optional live linear-function preview. */
export const ParamSlider: React.FC<ParamSliderProps> = ({
  params,
  values,
  onChange,
  instruction,
  preview,
  disabled = false,
}) => {
  const setParam = (id: string, raw: number) => {
    onChange({ ...values, [id]: raw })
  }

  const previewSvg = useMemo(() => {
    if (preview !== 'linear') return null
    const m = values.m
    const n = values.n
    if (m === undefined || n === undefined) return null
    return generateLinearFunctionSvg({
      m,
      n,
      interceptLabel: `n=${n}`,
      slopeTriangle: { fromX: 0, run: m >= 0 ? 1 : -1, showLabels: true },
      xRange: [-5, 5],
      yRange: [-6, 6],
      cellSize: 28,
    })
  }, [preview, values.m, values.n])

  return (
    <div className="param-slider">
      {instruction && <p className="param-slider__instruction">{instruction}</p>}
      {previewSvg && (
        <div
          className="param-slider__preview"
          dangerouslySetInnerHTML={{ __html: previewSvg }}
        />
      )}
      <div className="param-slider__controls">
        {params.map((p) => {
          const step = p.step ?? 1
          const val = values[p.id] ?? p.start ?? p.min
          return (
            <label key={p.id} className="param-slider__row">
              <span className="param-slider__label">
                {p.label}: <strong>{String(val).replace('.', ',')}</strong>
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
