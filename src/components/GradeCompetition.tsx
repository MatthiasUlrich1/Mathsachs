import type { GradeSummary } from '../classCode/api'

export function GradeCompetition({
  grade,
  title = 'Stufen-Wettbewerb',
}: {
  grade: GradeSummary
  title?: string
}) {
  const rows = [...grade.classes].sort(
    (a, b) => b.points.year - a.points.year || a.name.localeCompare(b.name, 'de'),
  )
  return (
    <section className="grade-comp" aria-label={title}>
      <h3 className="class-codes__list-title">{title}</h3>
      <p className="muted small">
        {grade.name} — nur Klassennamen und Punktesummen, keine Personennamen.
      </p>
      {rows.length === 0 ? (
        <p className="muted small">Dieser Stufe sind noch keine Klassen zugeordnet.</p>
      ) : (
        <table className="grade-comp__table">
          <thead>
            <tr>
              <th>Klasse</th>
              <th>Tag</th>
              <th>Woche</th>
              <th>Monat</th>
              <th>Schuljahr</th>
              <th>Gesamt</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.points.today}</td>
                <td>{row.points.week}</td>
                <td>{row.points.month}</td>
                <td>{row.points.year}</td>
                <td>{row.points.total}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Stufe</th>
              <td>{grade.points.today}</td>
              <td>{grade.points.week}</td>
              <td>{grade.points.month}</td>
              <td>{grade.points.year}</td>
              <td>{grade.points.total}</td>
            </tr>
          </tfoot>
        </table>
      )}
    </section>
  )
}
