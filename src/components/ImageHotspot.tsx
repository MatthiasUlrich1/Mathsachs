import React from 'react'
import './ImageHotspot.css'

export type HotspotRegion = {
  id: string
  label: string
  /** Percent of image box (0–100). */
  x: number
  y: number
  w: number
  h: number
}

export interface ImageHotspotProps {
  imageSrc?: string
  imageAlt?: string
  /** Inline SVG markup (preferred for schematic diagrams). */
  imageSvg?: string
  regions: HotspotRegion[]
  value: string | null
  onChange: (regionId: string) => void
  instruction?: string
  disabled?: boolean
}

/** Tap a region on an image/SVG — no drag-drop labels. */
export const ImageHotspot: React.FC<ImageHotspotProps> = ({
  imageSrc,
  imageAlt = '',
  imageSvg,
  regions,
  value,
  onChange,
  instruction,
  disabled = false,
}) => (
  <div className="image-hotspot">
    {instruction && <p className="image-hotspot__instruction">{instruction}</p>}
    <div className="image-hotspot__stage" role="group" aria-label="Bildstelle wählen">
      {imageSvg ? (
        <div
          className="image-hotspot__svg"
          dangerouslySetInnerHTML={{ __html: imageSvg }}
        />
      ) : imageSrc ? (
        <img className="image-hotspot__img" src={imageSrc} alt={imageAlt} />
      ) : (
        <div className="image-hotspot__placeholder" aria-hidden />
      )}
      {regions.map((r) => {
        const selected = value === r.id
        return (
          <button
            key={r.id}
            type="button"
            className={`image-hotspot__region${selected ? ' image-hotspot__region--selected' : ''}`}
            style={{
              left: `${r.x}%`,
              top: `${r.y}%`,
              width: `${r.w}%`,
              height: `${r.h}%`,
            }}
            onClick={() => onChange(r.id)}
            disabled={disabled}
            aria-pressed={selected}
            aria-label={r.label}
            title={r.label}
          />
        )
      })}
    </div>
  </div>
)
