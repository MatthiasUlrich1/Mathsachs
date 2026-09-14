import { formatClassCode } from './code'

/**
 * Öffnet ein neues Fenster mit einem druckfertigen Blatt mit 30 Code-Zetteln.
 * Jede Zeile in `rows` erzeugt eine eigene Seite mit 30 Kopien dieses Codes.
 * Das Blatt ist zum Ausschneiden gedacht – jeder Schüler bekommt einen Zettel.
 */
export function openCodePrintWindow(rows: { code: string; name: string }[]): void {
  const win = window.open('', '_blank', 'width=860,height=700')
  if (!win) return

  const pages = rows
    .map((row, i) => {
      const page = buildPage(row.code, row.name)
      // Seitenumbruch nach jeder Seite außer der letzten
      return i < rows.length - 1
        ? `${page}<div style="page-break-after:always"></div>`
        : page
    })
    .join('\n')

  win.document.write(`<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>Mathsachs – Klassencode drucken</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, Helvetica, sans-serif; background: #fff; color: #000; }

    /* Druckvorschau-Toolbar */
    .toolbar {
      padding: 10px 16px;
      background: #f0f4f8;
      border-bottom: 1px solid #d0d8e0;
      font-family: sans-serif;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .toolbar button {
      padding: 7px 18px;
      font-size: 14px;
      cursor: pointer;
      background: #1e40af;
      color: #fff;
      border: none;
      border-radius: 6px;
    }
    .toolbar span { color: #555; }

    /* Seite */
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 8mm;
      margin: 12px auto;
      background: #fff;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: auto repeat(10, 1fr);
      gap: 0;
    }

    /* Seitentitel */
    .page-title {
      grid-column: 1 / -1;
      font-size: 9pt;
      color: #555;
      text-align: center;
      padding-bottom: 3mm;
      border-bottom: 1px solid #ccc;
      margin-bottom: 0;
    }

    /* Einzelner Zettel */
    .slip {
      border: 1px dashed #bbb;
      padding: 4mm 3mm;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.5mm;
      height: 27mm;
    }
    .slip__brand {
      font-size: 6.5pt;
      color: #777;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .slip__class {
      font-size: 8pt;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 58mm;
    }
    .slip__code {
      font-size: 15pt;
      font-weight: bold;
      font-family: 'Courier New', Courier, monospace;
      letter-spacing: 0.1em;
      color: #111;
    }
    .slip__hint {
      font-size: 6pt;
      color: #999;
    }

    /* Druckstile */
    @media print {
      body { margin: 0; }
      .toolbar { display: none; }
      .page { margin: 0; padding: 6mm; }
    }
  </style>
</head>
<body>
<div class="toolbar">
  <button onclick="window.print()">🖨️&nbsp; Drucken</button>
  <span>Tipp: Seitenränder auf „Keine" setzen und Hochformat wählen für das beste Ergebnis.</span>
</div>
${pages}
</body>
</html>`)
  win.document.close()
}

// ---------------------------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------------------------

function buildPage(code: string, name: string): string {
  const formatted = formatClassCode(code)
  // 30 Zettel pro Seite (3 Spalten × 10 Zeilen)
  const slips = Array.from(
    { length: 30 },
    () => `
    <div class="slip">
      <div class="slip__brand">Mathsachs</div>
      <div class="slip__class">${esc(name)}</div>
      <div class="slip__code">${esc(formatted)}</div>
      <div class="slip__hint">Code in der App eingeben</div>
    </div>`,
  ).join('')
  return `<div class="page">
  <div class="page-title">Mathsachs &ndash; ${esc(name)} &ndash; ${esc(formatted)}</div>
  ${slips}
</div>`
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
