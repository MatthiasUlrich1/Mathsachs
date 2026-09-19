/**
 * Add viewBox from numeric width/height when missing so CSS can scale the SVG
 * without changing geometry, labels, or aspect ratio.
 */
export function ensureSvgViewBox(html: string): string {
  return html.replace(/<svg(\s[^>]*)?>/i, (full, attrs: string | undefined) => {
    const a = attrs ?? ''
    if (/\bviewBox\s*=/i.test(a)) return full
    const width = numericSvgLengthAttr(a, 'width')
    const height = numericSvgLengthAttr(a, 'height')
    if (!width || !height) return full
    const trimmed = a.replace(/\s*$/, '')
    return `<svg${trimmed} viewBox="0 0 ${width} ${height}">`
  })
}

function numericSvgLengthAttr(attrs: string, name: string): string | null {
  const re = new RegExp(`\\b${name}\\s*=\\s*(["']?)([^"'\\s>]+)\\1`, 'i')
  const m = attrs.match(re)
  if (!m) return null
  const value = m[2]
  if (!/^\d+(\.\d+)?$/.test(value)) return null
  return value
}
