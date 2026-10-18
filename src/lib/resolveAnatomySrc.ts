/**
 * Anatomy images as Vite URL modules — works in Electron (file://) and web.
 * Curriculum still stores logical paths like `/anatomy/foo.svg`.
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

function fallbackPublicUrl(absolutePath: string): string {
  if (/^(https?:|data:|blob:)/i.test(absolutePath)) return absolutePath
  const clean = absolutePath.replace(/^\//, '')
  if (typeof window !== 'undefined' && window.location?.href) {
    try {
      return new URL(clean, window.location.href).href
    } catch {
      /* ignore */
    }
  }
  const base = import.meta.env.BASE_URL || './'
  return base.endsWith('/') ? `${base}${clean}` : `${base}/${clean}`
}

/** Map `/anatomy/file.ext` (or bare filename) to a bundled asset URL. */
export function resolveAnatomySrc(src: string): string {
  if (!src) return src
  if (/^(https?:|data:|blob:)/i.test(src)) return src
  const file = src.replace(/^\/?anatomy\//i, '').replace(/^\.\//, '')
  return byFile.get(file) ?? byFile.get(file.toLowerCase()) ?? fallbackPublicUrl(src)
}
