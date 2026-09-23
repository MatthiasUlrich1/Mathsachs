import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildGymSachsenAnhaltPack } from '../src/curriculum/gymSachsenAnhaltPack'
import { buildGymSachsenGeschichtePack } from '../src/curriculum/geschichteGymPack'
import { buildOberschuleHsPack, buildOberschuleRsPack } from '../src/curriculum/oberschulePacks'
import { buildGymSachsenPhysikPack } from '../src/curriculum/physikGymPack'
import {
  buildSekundarschuleSachsenAnhaltHsPack,
  buildSekundarschuleSachsenAnhaltRsPack,
} from '../src/curriculum/sekundarschuleSachsenAnhaltPack'
import { buildGymSachsenSeed } from '../src/curriculum/seed'
import type { CurriculumPack } from '../src/curriculum/pack'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dir = join(root, 'curricula')
mkdirSync(dir, { recursive: true })

const rawUrl = (file: string) =>
  `https://raw.githubusercontent.com/MatthiasUlrich1/Mathsachs/main/curricula/${file}`

const writePack = (file: string, pack: CurriculumPack) => {
  const json = `${JSON.stringify(pack, null, 2)}\n`
  writeFileSync(join(dir, file), json)
  return { json, size: Buffer.byteLength(json) }
}

const packs: Array<{ file: string; pack: CurriculumPack }> = [
  { file: 'gym-sachsen.json', pack: await buildGymSachsenSeed() },
  { file: 'gym-sachsen-physik.json', pack: buildGymSachsenPhysikPack() },
  { file: 'gym-sachsen-geschichte.json', pack: buildGymSachsenGeschichtePack() },
  { file: 'gym-sachsen-anhalt.json', pack: buildGymSachsenAnhaltPack() },
  { file: 'sekundarschule-sachsen-anhalt-hs.json', pack: buildSekundarschuleSachsenAnhaltHsPack() },
  { file: 'sekundarschule-sachsen-anhalt-rs.json', pack: buildSekundarschuleSachsenAnhaltRsPack() },
  { file: 'oberschule-sachsen-hs.json', pack: buildOberschuleHsPack() },
  { file: 'oberschule-sachsen-rs.json', pack: buildOberschuleRsPack() },
]

const manifest = {
  updatedAt: new Date().toISOString(),
  packs: packs.map(({ file, pack }) => {
    const out = writePack(file, pack)
    return {
      id: pack.id,
      title: pack.title,
      region: pack.region,
      school: pack.school,
      subject: pack.subject,
      version: pack.version,
      url: rawUrl(file),
      size: out.size,
      changelog: pack.changelog,
    }
  }),
}
writeFileSync(join(dir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
for (const row of manifest.packs) {
  console.log(`Wrote ${row.id} ${row.version} (${row.size} bytes)`)
}
