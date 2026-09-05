import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildOberschuleHsPack, buildOberschuleRsPack } from '../src/curriculum/oberschulePacks'
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

const gym = await buildGymSachsenSeed()
const hs = buildOberschuleHsPack()
const rs = buildOberschuleRsPack()

const gymOut = writePack('gym-sachsen.json', gym)
const hsOut = writePack('oberschule-sachsen-hs.json', hs)
const rsOut = writePack('oberschule-sachsen-rs.json', rs)

const manifest = {
  updatedAt: new Date().toISOString(),
  packs: [
    {
      id: gym.id,
      title: gym.title,
      region: gym.region,
      school: gym.school,
      subject: gym.subject,
      version: gym.version,
      url: rawUrl('gym-sachsen.json'),
      size: gymOut.size,
      changelog: gym.changelog,
    },
    {
      id: hs.id,
      title: hs.title,
      region: hs.region,
      school: hs.school,
      subject: hs.subject,
      version: hs.version,
      url: rawUrl('oberschule-sachsen-hs.json'),
      size: hsOut.size,
      changelog: hs.changelog,
    },
    {
      id: rs.id,
      title: rs.title,
      region: rs.region,
      school: rs.school,
      subject: rs.subject,
      version: rs.version,
      url: rawUrl('oberschule-sachsen-rs.json'),
      size: rsOut.size,
      changelog: rs.changelog,
    },
  ],
}
writeFileSync(join(dir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
for (const row of manifest.packs) {
  console.log(`Wrote ${row.id} ${row.version} (${row.size} bytes)`)
}
