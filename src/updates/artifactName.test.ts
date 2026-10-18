import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const yml = readFileSync(resolve(process.cwd(), 'electron-builder.yml'), 'utf8')

describe('electron-builder artifact names', () => {
  it('brands the installer as TaskTrophy', () => {
    expect(yml).toMatch(/^productName:\s*TaskTrophy\s*$/m)
  })

  it('pins a space-free Windows NSIS name that matches latest.yml', () => {
    expect(yml).toMatch(
      /nsis:[\s\S]*?artifactName:\s*TaskTrophy-Setup-\$\{version\}\.\$\{ext\}/,
    )
  })

  it('pins macOS, AppImage and deb names with TaskTrophy branding', () => {
    expect(yml).toMatch(
      /dmg:[\s\S]*?artifactName:\s*TaskTrophy-\$\{version\}-\$\{arch\}\.\$\{ext\}/,
    )
    expect(yml).toMatch(
      /appImage:[\s\S]*?artifactName:\s*TaskTrophy-\$\{version\}\.\$\{ext\}/,
    )
    expect(yml).toMatch(
      /deb:[\s\S]*?artifactName:\s*tasktrophy_\$\{version\}_\$\{arch\}\.\$\{ext\}/,
    )
    const linuxBlock = yml.match(/^linux:\n((?:[ \t].*\n)*)/m)?.[1] ?? ''
    expect(linuxBlock).not.toMatch(/^\s*artifactName:/m)
  })

  it('does not use spaces in any artifactName', () => {
    for (const line of yml.split('\n')) {
      const match = line.match(/artifactName:\s*(.+)$/)
      if (!match) continue
      expect(match[1]).not.toMatch(/\s/)
    }
  })
})
