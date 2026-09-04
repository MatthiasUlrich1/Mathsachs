import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const yml = readFileSync(resolve(process.cwd(), 'electron-builder.yml'), 'utf8')

describe('electron-builder artifact names', () => {
  it('pins a space-free Windows NSIS name that matches latest.yml', () => {
    expect(yml).toMatch(
      /nsis:[\s\S]*?artifactName:\s*Mathsachs-Setup-\$\{version\}\.\$\{ext\}/,
    )
  })

  it('pins macOS and AppImage names without changing the Debian package', () => {
    expect(yml).toMatch(
      /dmg:[\s\S]*?artifactName:\s*Mathsachs-\$\{version\}-\$\{arch\}\.\$\{ext\}/,
    )
    expect(yml).toMatch(
      /appImage:[\s\S]*?artifactName:\s*Mathsachs-\$\{version\}\.\$\{ext\}/,
    )
    const linuxBlock = yml.match(/^linux:\n((?:[ \t].*\n)*)/m)?.[1] ?? ''
    expect(linuxBlock).not.toMatch(/artifactName:/)
  })

  it('does not use spaces in any artifactName', () => {
    for (const line of yml.split('\n')) {
      const match = line.match(/artifactName:\s*(.+)$/)
      if (!match) continue
      expect(match[1]).not.toMatch(/\s/)
    }
  })
})
