import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = readFileSync(join(root, 'src/lib/teacherCode.ts'), 'utf8')
const raw = source.match(/export const TEACHER_CODE = '([A-Z0-9]+)'/)?.[1]
if (!raw || raw.length !== 8) {
  throw new Error('TEACHER_CODE in src/lib/teacherCode.ts nicht gefunden')
}
const formatted = `${raw.slice(0, 4)}-${raw.slice(4)}`

const html = readFileSync(join(root, 'docs/lehrercode.html'), 'utf8').replaceAll(
  '{{TEACHER_CODE}}',
  formatted,
)
const tmpHtml = join('/tmp', 'mathsachs-lehrercode.html')
writeFileSync(tmpHtml, html)

const outDir = join(root, 'docs')
mkdirSync(outDir, { recursive: true })
const outPdf = join(outDir, 'Lehrercode-Mathsachs.pdf')
const chrome = process.env.CHROME_PATH ?? 'google-chrome'

const profile = join('/tmp', 'mathsachs-chrome-pdf-profile')
mkdirSync(profile, { recursive: true })

execFileSync(
  'timeout',
  [
    '25',
    chrome,
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--user-data-dir=${profile}`,
    '--no-pdf-header-footer',
    `--print-to-pdf=${outPdf}`,
    `file://${tmpHtml}`,
  ],
  { stdio: 'inherit' },
)

const artifacts = '/opt/cursor/artifacts'
try {
  mkdirSync(artifacts, { recursive: true })
  copyFileSync(outPdf, join(artifacts, 'Lehrercode-Mathsachs.pdf'))
} catch {
  /* artifacts folder is optional outside Cloud Agent */
}

console.log(`Lehrercode-PDF: ${outPdf} (${formatted})`)
