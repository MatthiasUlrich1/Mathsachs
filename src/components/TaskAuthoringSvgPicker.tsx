import { useMemo } from 'react'
import {
  getSvgTemplate,
  sanitizeSvg,
  SVG_TEMPLATES,
} from '../lib/svgTemplateRegistry'
import {
  emptyCoordinateScene,
  generateCoordinateSceneSvg,
  parseCoordinateScene,
} from '../lib/coordinateScene'
import type { VisualSpec } from '../lib/taskAuthoring'
import { TaskVisual } from './TaskMedia'
import { CoordinateGraphEditor } from './CoordinateGraphEditor'

interface Props {
  label: string
  value: VisualSpec
  onChange: (next: VisualSpec) => void
  enabled: boolean
}

/** SVG mode picker: none / template / scene editor / raw editor. */
export function TaskAuthoringSvgPicker({ label, value, onChange, enabled }: Props) {
  const template = value.templateId ? getSvgTemplate(value.templateId) : undefined
  const preview = useMemo(() => {
    if (!enabled || value.mode === 'none') return undefined
    if (value.mode === 'raw') return sanitizeSvg(value.svg ?? '') || undefined
    if (value.mode === 'scene') {
      const scene = parseCoordinateScene(value.scene) ?? emptyCoordinateScene()
      return generateCoordinateSceneSvg(scene)
    }
    if (value.mode === 'template' && template) {
      try {
        return template.build(value.params ?? {})
      } catch {
        return undefined
      }
    }
    return undefined
  }, [enabled, value, template])

  if (!enabled) {
    return (
      <div className="field">
        <span className="field__label">{label}</span>
        <p className="muted small">Deaktiviert (Anzeige-Checkbox aus).</p>
      </div>
    )
  }

  return (
    <div className="task-authoring-svg">
      <div className="field">
        <span className="field__label">{label}</span>
        <div className="task-authoring-svg__modes">
          {(
            [
              ['none', 'Kein Visual'],
              ['template', 'Vorlage'],
              ['scene', 'Zeichnen'],
              ['raw', 'SVG-Text'],
            ] as const
          ).map(([mode, text]) => (
            <label key={mode} className="task-authoring-svg__mode">
              <input
                type="radio"
                name={`svg-mode-${label}`}
                checked={value.mode === mode}
                onChange={() =>
                  onChange({
                    ...value,
                    mode,
                    scene:
                      mode === 'scene'
                        ? (parseCoordinateScene(value.scene) ?? emptyCoordinateScene())
                        : value.scene,
                  })
                }
              />
              {text}
            </label>
          ))}
        </div>
      </div>

      {value.mode === 'template' && (
        <>
          <div className="field">
            <label className="field__label" htmlFor={`tpl-${label}`}>
              Vorlage
            </label>
            <select
              id={`tpl-${label}`}
              value={value.templateId ?? ''}
              onChange={(e) => {
                const id = e.target.value
                const t = getSvgTemplate(id)
                const params: Record<string, string> = {}
                for (const p of t?.params ?? []) params[p.key] = p.defaultValue
                onChange({ mode: 'template', templateId: id, params })
              }}
            >
              <option value="">— wählen —</option>
              <optgroup label="Mathe">
                {SVG_TEMPLATES.filter((t) => t.group === 'mathe').map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Funktionen / Koordinaten">
                {SVG_TEMPLATES.filter((t) => t.group === 'funktionen').map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Physik">
                {SVG_TEMPLATES.filter((t) => t.group === 'physik').map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          {template &&
            template.params.map((p) => (
              <div className="field" key={p.key}>
                <label className="field__label" htmlFor={`${label}-${p.key}`}>
                  {p.label}
                </label>
                <input
                  id={`${label}-${p.key}`}
                  value={value.params?.[p.key] ?? p.defaultValue}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      params: { ...(value.params ?? {}), [p.key]: e.target.value },
                    })
                  }
                />
              </div>
            ))}
          {template && (
            <button
              type="button"
              className="link"
              onClick={() => {
                try {
                  const svg = template.build(value.params ?? {})
                  onChange({
                    mode: 'raw',
                    svg,
                    templateId: template.id,
                    params: value.params,
                  })
                } catch {
                  /* ignore */
                }
              }}
            >
              Vorlage als SVG-Text übernehmen
            </button>
          )}
        </>
      )}

      {value.mode === 'scene' && (
        <CoordinateGraphEditor
          scene={parseCoordinateScene(value.scene) ?? emptyCoordinateScene()}
          onChange={(scene) => onChange({ ...value, mode: 'scene', scene })}
          instruction="Geraden zeichnen und Objekte frei positionieren (Raster: frei / ½ / ganz)."
        />
      )}

      {value.mode === 'raw' && (
        <div className="field">
          <label className="field__label" htmlFor={`raw-${label}`}>
            SVG-Markup
          </label>
          <textarea
            id={`raw-${label}`}
            rows={6}
            value={value.svg ?? ''}
            onChange={(e) => onChange({ ...value, mode: 'raw', svg: e.target.value })}
            placeholder="<svg …>…</svg>"
          />
        </div>
      )}

      {preview && value.mode !== 'scene' ? <TaskVisual html={preview} /> : null}
    </div>
  )
}
