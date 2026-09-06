import { listedSupporters } from '../legal/supporters'

/** Einstellungen → Unterstützer. Rows come from `legal/supporters`. */
export function Supporters() {
  const rows = listedSupporters()
  return (
    <section className="card supporters" aria-label="Unterstützer">
      <div className="session__head">
        <div>
          <h2 className="section-title no-margin">Unterstützer</h2>
          <p className="muted small">
            Organisationen, die Mathsachs unterstützen. Weitere Einträge
            kommen in die Unterstützer-Liste.
          </p>
        </div>
      </div>
      {rows.length === 0 ? (
        <p className="muted small">Noch keine Unterstützer eingetragen.</p>
      ) : (
        <ul className="supporters-list">
          {rows.map((row) => (
            <li key={row.id} className="supporters-list__item">
              {row.logoSrc && (
                <img
                  className={
                    row.logoOnDark
                      ? 'supporters-list__logo supporters-list__logo--on-dark'
                      : 'supporters-list__logo'
                  }
                  src={row.logoSrc}
                  alt=""
                  width={72}
                  height={72}
                />
              )}
              <div className="supporters-list__text">
                <p className="supporters-list__name">{row.name}</p>
                {row.url ? (
                  <a
                    className="link"
                    href={row.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {row.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </a>
                ) : (
                  <p className="muted small">Keine Website hinterlegt.</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
