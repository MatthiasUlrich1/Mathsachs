import {
  ROLE_RIGHT_COLUMNS,
  ROLE_RIGHT_ROWS,
  rightMarkLabel,
  rightMarkSymbol,
} from '../lib/roleRights'

export function RoleRightsMatrix() {
  return (
    <section className="card rights-matrix" aria-label="Rollen-Rechte-Matrix">
      <div className="session__head">
        <div>
          <h2 className="section-title no-margin">Rechte</h2>
          <p className="muted small">
            Welche Rolle darf was? Challenge erstellen kommt später für Lehrer
            und Klassenlehrer.
          </p>
        </div>
      </div>
      <div className="rights-matrix__scroll">
        <table className="rights-matrix__table">
          <caption className="visually-hidden">
            Rechte je Rolle: Schüler, Eltern, Klassenlehrer, Lehrer
          </caption>
          <thead>
            <tr>
              <th scope="col">Recht</th>
              {ROLE_RIGHT_COLUMNS.map((role) => (
                <th key={role.id} scope="col">
                  {role.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROLE_RIGHT_ROWS.map((row) => (
              <tr key={row.id}>
                <th scope="row">{row.label}</th>
                {ROLE_RIGHT_COLUMNS.map((role) => {
                  const mark = row.marks[role.id]
                  const planned = mark === 'planned'
                  return (
                    <td
                      key={role.id}
                      className={`rights-matrix__cell rights-matrix__cell--${mark}`}
                    >
                      <span aria-hidden="true">{rightMarkSymbol(mark)}</span>
                      <span className="visually-hidden">{rightMarkLabel(mark)}</span>
                      {planned ? null : mark === 'optin' ||
                        mark === 'viaClass' ||
                        mark === 'viaClassOrGrade' ? (
                        <span className="rights-matrix__note">
                          {rightMarkLabel(mark)}
                        </span>
                      ) : null}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
