import { UPDATE_BUILDING_BODY, UPDATE_BUILDING_TITLE } from '../updates/github'

interface Props {
  onDismiss: () => void
}

export function UpdateBuildingBanner({ onDismiss }: Props) {
  return (
    <section
      className="update-banner update-banner--building no-print"
      role="status"
    >
      <div className="update-banner__head">
        <h2 className="update-banner__title">{UPDATE_BUILDING_TITLE}</h2>
        <button
          type="button"
          className="update-banner__close"
          aria-label="Hinweis schließen"
          onClick={onDismiss}
        >
          ×
        </button>
      </div>
      <p className="update-banner__building-copy">{UPDATE_BUILDING_BODY}</p>
    </section>
  )
}
