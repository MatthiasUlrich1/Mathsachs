import { afterEach, describe, expect, it } from 'vitest'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import http from 'node:http'

const require = createRequire(import.meta.url)
const lan = require('../../electron/lanServer.cjs') as {
  isUsableLanIPv4: (address: string) => boolean
  collectLanIPv4s: (ifs?: NodeJS.Dict<os.NetworkInterfaceInfo[]>) => string[]
  sortLanIPv4s: (ips: string[]) => string[]
  buildLanUrls: (port: number, lanIps: string[]) => string[]
  mimeFor: (filePath: string) => string
  resolveSafeFile: (rootDir: string, rawUrl: string | undefined) => string | null
  startLanServer: (options: {
    rootDir: string
    port?: number
    host?: string
    proxyOrigin?: string
  }) => Promise<{
    port: number
    urls: string[]
    lanUrls: string[]
    stop: () => Promise<void>
  }>
}

const {
  isUsableLanIPv4,
  collectLanIPv4s,
  sortLanIPv4s,
  buildLanUrls,
  mimeFor,
  resolveSafeFile,
  startLanServer,
} = lan

describe('isUsableLanIPv4', () => {
  it('accepts RFC1918 addresses', () => {
    expect(isUsableLanIPv4('192.168.1.42')).toBe(true)
    expect(isUsableLanIPv4('10.0.0.8')).toBe(true)
    expect(isUsableLanIPv4('172.16.0.1')).toBe(true)
    expect(isUsableLanIPv4('172.31.255.1')).toBe(true)
  })

  it('rejects loopback, link-local and public addresses', () => {
    expect(isUsableLanIPv4('127.0.0.1')).toBe(false)
    expect(isUsableLanIPv4('169.254.1.1')).toBe(false)
    expect(isUsableLanIPv4('8.8.8.8')).toBe(false)
    expect(isUsableLanIPv4('172.15.0.1')).toBe(false)
    expect(isUsableLanIPv4('::1')).toBe(false)
  })
})

describe('collectLanIPv4s / buildLanUrls', () => {
  it('skips internal and IPv6 entries', () => {
    const ips = collectLanIPv4s({
      lo: [{ address: '127.0.0.1', family: 'IPv4', internal: true } as os.NetworkInterfaceInfo],
      wlan0: [
        { address: '192.168.0.12', family: 'IPv4', internal: false } as os.NetworkInterfaceInfo,
        { address: 'fe80::1', family: 'IPv6', internal: false } as os.NetworkInterfaceInfo,
      ],
      eth0: [{ address: '10.1.2.3', family: 4, internal: false } as unknown as os.NetworkInterfaceInfo],
    })
    expect(ips).toEqual(['192.168.0.12', '10.1.2.3'])
  })

  it('prefers 192.168 in the printed URL list and always includes loopback', () => {
    expect(sortLanIPv4s(['10.0.0.1', '192.168.1.9', '172.16.0.2'])).toEqual([
      '192.168.1.9',
      '10.0.0.1',
      '172.16.0.2',
    ])
    expect(buildLanUrls(4747, ['10.0.0.1', '192.168.1.9'])).toEqual([
      'http://127.0.0.1:4747/',
      'http://192.168.1.9:4747/',
      'http://10.0.0.1:4747/',
    ])
  })
})

describe('resolveSafeFile', () => {
  const root = path.resolve('/tmp/mathsachs-lan-root')

  it('maps / to index.html inside the root', () => {
    const resolved = resolveSafeFile(root, '/')
    expect(resolved).toBe(path.join(root, 'index.html'))
  })

  it('never resolves a path outside the root', () => {
    const cases = [
      '/../../etc/passwd',
      '/%2e%2e/%2e%2e/etc/passwd',
      '/foo/../../../etc/passwd',
      '//etc/passwd',
    ]
    for (const raw of cases) {
      const resolved = resolveSafeFile(root, raw)
      expect(
        resolved === null || resolved.startsWith(root + path.sep) || resolved === root,
      ).toBe(true)
    }
  })

  it('strips query strings', () => {
    expect(resolveSafeFile(root, '/assets/app.js?v=1')).toBe(
      path.join(root, 'assets', 'app.js'),
    )
  })
})

describe('mimeFor', () => {
  it('maps common web assets', () => {
    expect(mimeFor('index.html')).toContain('text/html')
    expect(mimeFor('app.js')).toContain('javascript')
    expect(mimeFor('app.css')).toContain('text/css')
  })
})

describe('startLanServer', () => {
  const stops: Array<() => Promise<void>> = []

  afterEach(async () => {
    while (stops.length) {
      const stop = stops.pop()
      if (stop) await stop()
    }
  })

  const makeDist = () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mathsachs-lan-'))
    fs.writeFileSync(
      path.join(dir, 'index.html'),
      '<!doctype html><title>Mathsachs LAN</title><p>ok</p>',
    )
    fs.mkdirSync(path.join(dir, 'assets'))
    fs.writeFileSync(path.join(dir, 'assets', 'app.js'), 'window.MATHSACHS_LAN=1')
    return dir
  }

  const get = (url: string) =>
    new Promise<{ status: number; body: string; type: string }>((resolve, reject) => {
      http
        .get(url, (res) => {
          const chunks: Buffer[] = []
          res.on('data', (c) => chunks.push(c as Buffer))
          res.on('end', () =>
            resolve({
              status: res.statusCode ?? 0,
              body: Buffer.concat(chunks).toString('utf8'),
              type: String(res.headers['content-type'] ?? ''),
            }),
          )
        })
        .on('error', reject)
    })

  it('serves the UI and rejects traversal', async () => {
    const rootDir = makeDist()
    const started = await startLanServer({
      rootDir,
      host: '127.0.0.1',
      port: 18080,
    })
    stops.push(started.stop)
    expect(started.urls[0]).toMatch(/http:\/\/127\.0\.0\.1:\d+\//)

    const home = await get(started.urls[0])
    expect(home.status).toBe(200)
    expect(home.body).toContain('Mathsachs LAN')
    expect(home.type).toContain('text/html')

    const asset = await get(`${started.urls[0]}assets/app.js`)
    expect(asset.status).toBe(200)
    expect(asset.body).toContain('MATHSACHS_LAN')

    const secretPath = path.join(path.dirname(rootDir), 'secret-outside.txt')
    fs.writeFileSync(secretPath, 'LAN_SECRET_OUTSIDE')
    const escaped = await get(`${started.urls[0]}../secret-outside.txt`)
    expect(escaped.body).not.toContain('LAN_SECRET_OUTSIDE')
    expect([403, 404, 200]).toContain(escaped.status)
    if (escaped.status === 200) {
      expect(escaped.body).toContain('Mathsachs LAN')
    }
  })

  it('picks the next port when the preferred one is busy', async () => {
    const rootDir = makeDist()
    const blocker = http.createServer()
    await new Promise<void>((resolve) => blocker.listen(18090, '127.0.0.1', resolve))
    stops.push(
      () =>
        new Promise((resolve) => {
          blocker.close(() => resolve())
        }),
    )
    const started = await startLanServer({
      rootDir,
      host: '127.0.0.1',
      port: 18090,
    })
    stops.push(started.stop)
    expect(started.port).toBeGreaterThan(18090)
    const home = await get(`http://127.0.0.1:${started.port}/`)
    expect(home.status).toBe(200)
  })
})
