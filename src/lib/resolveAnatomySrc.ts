/**
 * Anatomy images for schema / imageLabelSlots tasks.
 *
 * Curriculum stores logical paths like `/anatomy/foo.svg`.
 * Electron loads the app via `file://` + Vite `base: './'`, so absolute
 * `/anatomy/…` resolves to the drive root and fails. Prefer `./anatomy/…`
 * (copied from `public/anatomy` into `dist/anatomy`). Bundled Vite URLs are
 * a secondary option; `data:` URLs are avoided (broken SVG encoding broke them).
 */
const modules = import.meta.glob('../assets/anatomy/*.{svg,png,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const byFile = new Map<string, string>()
for (const [key, url] of Object.entries(modules)) {
  const file = key.split('/').pop()!.split('\\').pop()!
  byFile.set(file, url)
  byFile.set(file.toLowerCase(), url)
}

function anatomyFileName(src: string): string {
  return src
    .replace(/^\/?anatomy\//i, '')
    .replace(/^\.\//, '')
    .replace(/^anatomy\//i, '')
}

/** Relative public path next to index.html (Electron + web). */
export function anatomyPublicSrc(src: string): string {
  const file = anatomyFileName(src)
  return file ? `./anatomy/${file}` : src
}

/**
 * Candidate URLs to try in order until one loads.
 * Always starts with `./anatomy/…` so every schema task has the same reliable path.
 */
export function anatomySrcCandidates(src: string): string[] {
  if (!src) return []
  if (/^(https?:|blob:)/i.test(src)) return [src]

  const file = anatomyFileName(src)
  if (!file) return [src]

  const out: string[] = []
  const push = (u: string) => {
    if (u && !out.includes(u)) out.push(u)
  }

  push(anatomyPublicSrc(file))

  const bundled = byFile.get(file) ?? byFile.get(file.toLowerCase())
  // Skip data: — small broken SVGs were inlined and failed to decode in <img>.
  if (bundled && !/^data:/i.test(bundled)) push(bundled)

  return out
}

/** Map `/anatomy/file.ext` to the best single URL (first candidate). */
export function resolveAnatomySrc(src: string): string {
  if (!src) return src
  if (/^(https?:|data:|blob:)/i.test(src)) return src
  return anatomySrcCandidates(src)[0] ?? src
}
