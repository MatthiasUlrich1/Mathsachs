import {
  formatExamAnswer,
  type ExamTaskResult,
} from '../components/ExamProtocolSheet'

export interface ExamProtocolExportInput {
  user: string
  title: string
  results: ExamTaskResult[]
  totalPoints: number
  printedAt: string
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Safe filename stem for download/save dialogs. */
export const examProtocolFileStem = (title: string, user: string): string => {
  const raw = `Klausurprotokoll_${title}_${user}`
    .replace(/[^\w\-äöüÄÖÜß ]+/gi, '')
    .replace(/\s+/g, '_')
    .slice(0, 80)
  return raw || 'Klausurprotokoll'
}

/** Self-contained HTML for print / PDF of the evaluation-only protocol. */
export const buildExamProtocolHtml = (input: ExamProtocolExportInput): string => {
  const earned = input.results.reduce((s, r) => s + r.earned, 0)
  const correctCount = input.results.filter((r) => r.correct).length
  const pct =
    input.totalPoints > 0 ? Math.round((earned / input.totalPoints) * 100) : 0

  const rows = input.results
    .map((r, i) => {
      const unit = r.resolved.task.unit ? ` ${r.resolved.task.unit}` : ''
      const answer = `${formatExamAnswer(r.answer)}${unit}`
      const correction = !r.correct
        ? ` (richtig: ${r.resolved.task.solution}${unit})`
        : ''
      return `<tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(r.resolved.topicTitle || '—')}</td>
        <td>${escapeHtml(r.resolved.task.question)}</td>
        <td>${escapeHtml(answer + correction)}</td>
        <td>${r.correct ? 'richtig' : 'falsch'}</td>
        <td>${r.earned}/${r.resolved.punkte}</td>
      </tr>`
    })
    .join('\n')

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>TaskTrophy – Klausurprotokoll</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Georgia, "Times New Roman", serif;
      color: #0f172a;
      background: #fff;
    }
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 2;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
      padding: 10px 16px;
      background: #f0f4f8;
      border-bottom: 1px solid #d0d8e0;
      font-family: system-ui, sans-serif;
      font-size: 13px;
    }
    .toolbar button {
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      border: none;
      border-radius: 6px;
      background: #1e40af;
      color: #fff;
    }
    .toolbar button.secondary {
      background: #334155;
    }
    .toolbar span { color: #475569; }
    .sheet {
      max-width: 900px;
      margin: 0 auto;
      padding: 24px 20px 40px;
    }
    h1 { font-size: 22px; margin: 0 0 8px; }
    .meta { margin: 0 0 20px; color: #334155; font-size: 14px; }
    .summary {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }
    .summary div { min-width: 100px; }
    .summary strong { display: block; font-size: 22px; }
    .summary span { font-size: 12px; color: #64748b; }
    h2 { font-size: 16px; margin: 0 0 10px; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: left;
      vertical-align: top;
    }
    th { background: #f8fafc; }
    @media print {
      .toolbar { display: none !important; }
      .sheet { padding: 0; max-width: none; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button type="button" onclick="window.print()">Drucken</button>
    <button type="button" class="secondary" onclick="window.print()">Als PDF speichern</button>
    <span>Für PDF im Druckdialog „Als PDF speichern“ bzw. „Microsoft Print to PDF“ wählen.</span>
  </div>
  <main class="sheet">
    <h1>TaskTrophy — Klausurprotokoll</h1>
    <p class="meta">
      Schüler/in: <strong>${escapeHtml(input.user)}</strong> ·
      Klausur: <strong>${escapeHtml(input.title)}</strong> ·
      erstellt am ${escapeHtml(input.printedAt)}
    </p>
    <div class="summary">
      <div><strong>${earned}/${input.totalPoints}</strong><span>Punkte</span></div>
      <div><strong>${pct}%</strong><span>Erreicht</span></div>
      <div><strong>${correctCount}/${input.results.length}</strong><span>richtige Aufgaben</span></div>
    </div>
    <h2>Auswertung je Aufgabe</h2>
    <table>
      <thead>
        <tr>
          <th>Nr.</th>
          <th>Thema</th>
          <th>Aufgabe</th>
          <th>Antwort</th>
          <th>Ergebnis</th>
          <th>Punkte</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </main>
</body>
</html>`
}

const openHtmlWindow = (html: string): void => {
  if (window.mathsachs?.openPrintWindow) {
    void window.mathsachs.openPrintWindow(html)
    return
  }
  const win = window.open('', '_blank', 'width=900,height=700')
  if (!win) return
  win.document.write(html)
  win.document.close()
}

/** Open a print preview window for the Klausurprotokoll. */
export const printExamProtocol = (input: ExamProtocolExportInput): void => {
  openHtmlWindow(buildExamProtocolHtml(input))
}

export type SaveExamPdfResult =
  | { ok: true; filePath?: string }
  | { ok: false; cancelled?: boolean; error?: string }

/**
 * Save the Klausurprotokoll as a PDF file.
 * Desktop: Electron printToPDF + Speichern-unter.
 * Browser: opens the print window (choose „Als PDF speichern“ in the dialog).
 */
export const saveExamProtocolPdf = async (
  input: ExamProtocolExportInput,
): Promise<SaveExamPdfResult> => {
  const html = buildExamProtocolHtml(input)
  const suggestedName = `${examProtocolFileStem(input.title, input.user)}.pdf`

  if (window.mathsachs?.savePdf) {
    try {
      return await window.mathsachs.savePdf(html, suggestedName)
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : 'PDF konnte nicht gespeichert werden.',
      }
    }
  }

  openHtmlWindow(html)
  return { ok: true }
}
