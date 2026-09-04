/**
 * Local LAN HTTP server for the packaged (and Electron-dev) Mathsachs UI.
 *
 * Tablets on the same Wi-Fi can open http://<pc-ip>:<port>/ while the
 * desktop app is running. There is no extra backend: this only serves the
 * static Vite build (or proxies to Vite in development).
 */
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')

const DEFAULT_PORT = 4747
const MAX_PORT_TRIES = 20
const LOOPBACK = '127.0.0.1'

const MIME_BY_EXT = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
}

/** True for RFC1918 IPv4 addresses suitable to print as a tablet URL. */
function isUsableLanIPv4(address) {
  if (typeof address !== 'string' || address.includes(':')) return false
  if (address.startsWith('127.') || address.startsWith('169.254.')) return false
  const parts = address.split('.').map((part) => Number(part))
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return false
  }
  const [a, b] = parts
  if (a === 10) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  return false
}

function collectLanIPv4s(networkInterfaces = os.networkInterfaces()) {
  const ips = []
  for (const list of Object.values(networkInterfaces || {})) {
    for (const info of list || []) {
      if (!info || info.internal) continue
      const family = info.family
      if (family !== 'IPv4' && family !== 4) continue
      if (!isUsableLanIPv4(info.address)) continue
      if (!ips.includes(info.address)) ips.push(info.address)
    }
  }
  return ips
}

function sortLanIPv4s(ips) {
  const rank = (ip) => {
    if (ip.startsWith('192.168.')) return 0
    if (ip.startsWith('10.')) return 1
    return 2
  }
  return [...ips].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
}

function buildLanUrls(port, lanIps) {
  const urls = [`http://${LOOPBACK}:${port}/`]
  for (const ip of sortLanIPv4s(lanIps)) {
    urls.push(`http://${ip}:${port}/`)
  }
  return urls
}

function mimeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  return MIME_BY_EXT[ext] || 'application/octet-stream'
}

/**
 * Resolve a request path against `rootDir`. Returns null on traversal.
 * Query strings and hashes are ignored.
 */
function resolveSafeFile(rootDir, rawUrl) {
  const rootResolved = path.resolve(rootDir)
  let pathname = '/'
  try {
    pathname = new URL(rawUrl || '/', 'http://mathsachs.local').pathname
  } catch {
    return null
  }
  let decoded
  try {
    decoded = decodeURIComponent(pathname)
  } catch {
    return null
  }
  if (decoded === '/' || decoded === '') decoded = '/index.html'
  const candidate = path.resolve(rootResolved, `.${decoded}`)
  const rel = path.relative(rootResolved, candidate)
  if (rel.startsWith('..') || path.isAbsolute(rel)) return null
  return candidate
}

function send(res, status, body, headers = {}) {
  const payload = Buffer.isBuffer(body) ? body : Buffer.from(body ?? '')
  res.writeHead(status, {
    'Content-Length': payload.length,
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
    ...headers,
  })
  res.end(payload)
}

function sendFile(res, filePath) {
  let data
  try {
    data = fs.readFileSync(filePath)
  } catch {
    send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' })
    return
  }
  send(res, 200, data, { 'Content-Type': mimeFor(filePath) })
}

function handleStatic(req, res, rootDir) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, 'Method not allowed', {
      Allow: 'GET, HEAD',
      'Content-Type': 'text/plain; charset=utf-8',
    })
    return
  }

  const filePath = resolveSafeFile(rootDir, req.url)
  if (!filePath) {
    send(res, 403, 'Forbidden', { 'Content-Type': 'text/plain; charset=utf-8' })
    return
  }

  const finish = (target) => {
    if (req.method === 'HEAD') {
      let size = 0
      try {
        size = fs.statSync(target).size
      } catch {
        send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' })
        return
      }
      res.writeHead(200, {
        'Content-Type': mimeFor(target),
        'Content-Length': size,
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      })
      res.end()
      return
    }
    sendFile(res, target)
  }

  try {
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      finish(path.join(filePath, 'index.html'))
      return
    }
    finish(filePath)
  } catch {
    if (path.extname(filePath)) {
      send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' })
      return
    }
    finish(path.join(path.resolve(rootDir), 'index.html'))
  }
}

function proxyToVite(req, res, proxyOrigin) {
  let target
  try {
    target = new URL(proxyOrigin)
  } catch {
    send(res, 502, 'Dev-Server nicht erreichbar', {
      'Content-Type': 'text/plain; charset=utf-8',
    })
    return
  }
  const headers = { ...req.headers, host: target.host }
  const upstream = http.request(
    {
      protocol: target.protocol,
      hostname: target.hostname,
      port: target.port,
      path: req.url,
      method: req.method,
      headers,
    },
    (incoming) => {
      res.writeHead(incoming.statusCode || 502, incoming.headers)
      incoming.pipe(res)
    },
  )
  upstream.on('error', () => {
    if (!res.headersSent) {
      send(
        res,
        502,
        'Vite-Entwicklungsserver ist nicht erreichbar (npm run electron:dev).',
        { 'Content-Type': 'text/plain; charset=utf-8' },
      )
    } else {
      res.end()
    }
  })
  req.pipe(upstream)
}

function listenOnPort(server, host, port) {
  return new Promise((resolve, reject) => {
    const onError = (err) => {
      server.off('listening', onListening)
      reject(err)
    }
    const onListening = () => {
      server.off('error', onError)
      resolve(port)
    }
    server.once('error', onError)
    server.once('listening', onListening)
    server.listen(port, host)
  })
}

/**
 * Start the LAN static/proxy server.
 *
 * @param {object} options
 * @param {string} options.rootDir  Vite `dist` directory (packaged app)
 * @param {string} [options.proxyOrigin]  When set (Electron dev), proxy to Vite
 * @param {number} [options.port]
 * @param {string} [options.host]
 * @returns {Promise<{ port: number, urls: string[], lanUrls: string[], stop: () => Promise<void> }>}
 */
async function startLanServer(options) {
  const rootDir = options.rootDir
  const proxyOrigin = options.proxyOrigin || null
  const host = options.host || '0.0.0.0'
  const preferredPort = options.port ?? DEFAULT_PORT

  const server = http.createServer((req, res) => {
    try {
      if (proxyOrigin) proxyToVite(req, res, proxyOrigin)
      else handleStatic(req, res, rootDir)
    } catch {
      if (!res.headersSent) {
        send(res, 500, 'Server error', { 'Content-Type': 'text/plain; charset=utf-8' })
      }
    }
  })

  let port = preferredPort
  let lastError
  for (let i = 0; i < MAX_PORT_TRIES; i++) {
    try {
      await listenOnPort(server, host, port)
      lastError = null
      break
    } catch (err) {
      lastError = err
      if (!err || err.code !== 'EADDRINUSE') throw err
      port += 1
    }
  }
  if (lastError) throw lastError

  const addr = server.address()
  if (addr && typeof addr === 'object' && typeof addr.port === 'number') {
    port = addr.port
  }

  const lanIps = collectLanIPv4s()
  const urls = buildLanUrls(port, lanIps)
  const lanUrls = urls.filter((url) => !url.includes(`://${LOOPBACK}:`))

  const stop = () =>
    new Promise((resolve) => {
      server.close(() => resolve())
    })

  return { port, urls, lanUrls, stop, server }
}

module.exports = {
  DEFAULT_PORT,
  LOOPBACK,
  MIME_BY_EXT,
  isUsableLanIPv4,
  collectLanIPv4s,
  sortLanIPv4s,
  buildLanUrls,
  mimeFor,
  resolveSafeFile,
  startLanServer,
}
