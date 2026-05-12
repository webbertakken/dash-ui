#!/usr/bin/env tsx
// Tiny zero-dep static file server for apps/storybook-site/dist. Serves on
// the port given by PORT (default 4173). Pretty straightforward; no caching,
// no compression. The site itself is the artefact a real CDN would push.

import { stat, readFile } from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..', 'dist')
const PORT = Number(process.env.PORT ?? 4173)
const HOST = process.env.HOST ?? '0.0.0.0'

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
  '.ico': 'image/x-icon',
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', `http://${req.headers.host}`)
    let pathname = decodeURIComponent(url.pathname)
    if (pathname.endsWith('/')) pathname += 'index.html'

    // Resolve safely under ROOT
    let filePath = path.normalize(path.join(ROOT, pathname))
    if (!filePath.startsWith(ROOT)) {
      res.statusCode = 403
      res.end('Forbidden')
      return
    }
    let info = await stat(filePath).catch(() => null)
    if (info?.isDirectory()) {
      filePath = path.join(filePath, 'index.html')
      info = await stat(filePath).catch(() => null)
    }
    if (!info) {
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.end(`Not found: ${pathname}`)
      return
    }
    const ext = path.extname(filePath)
    const body = await readFile(filePath)
    res.statusCode = 200
    res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.end(body)
  } catch (err) {
    res.statusCode = 500
    res.end(String(err))
  }
})

server.listen(PORT, HOST, () => {
  console.log(`Serving ${ROOT} on http://${HOST}:${PORT}/`)
})
