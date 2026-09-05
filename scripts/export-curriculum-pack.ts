import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildGymSachsenSeed } from '../src/curriculum/seed'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const pack = await buildGymSachsenSeed()
const json = `${JSON.stringify(pack, null, 2)}\n`
const dir = join(root, 'curricula')
mkdirSync(dir, { recursive: true })
writeFileSync(join(dir, 'gym-sachsen.json'), json)
const manifest = {
  updatedAt: new Date().toISOString(),
  packs: [
    {
      id: pack.id,
      title: pack.title,
      region: pack.region,
      school: pack.school,
      subject: pack.subject,
      version: pack.version,
      url: 'https://raw.githubusercontent.com/MatthiasUlrich1/Mathsachs/main/curricula/gym-sachsen.json',
      size: Buffer.byteLength(json),
      changelog: pack.changelog,
    },
  ],
}
writeFileSync(join(dir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Wrote ${pack.id} ${pack.version} (${manifest.packs[0].size} bytes)`)
