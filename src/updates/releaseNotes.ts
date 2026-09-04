/** Escape HTML, then apply a tiny Markdown subset for GitHub release bodies. */
export function formatReleaseNotes(markdown: string): string {
  const trimmed = markdown.trim()
  if (!trimmed) return ''
  const escaped = escapeHtml(trimmed)
  const withInline = escaped
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, (_, label: string, href: string) => {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')

  const lines = withInline.split(/\r?\n/)
  const html: string[] = []
  let inList = false

  const closeList = () => {
    if (inList) {
      html.push('</ul>')
      inList = false
    }
  }

  for (const line of lines) {
    const heading = line.match(/^#{1,3}\s+(.+)$/)
    const bullet = line.match(/^[-*]\s+(.+)$/)
    if (heading) {
      closeList()
      html.push(`<p class="update-banner__heading">${heading[1]}</p>`)
      continue
    }
    if (bullet) {
      if (!inList) {
        html.push('<ul>')
        inList = true
      }
      html.push(`<li>${bullet[1]}</li>`)
      continue
    }
    closeList()
    if (line.trim() === '') continue
    html.push(`<p>${line}</p>`)
  }
  closeList()
  return html.join('')
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
