// Serve dist/ with the exact headers from vercel.json, so the CSP can be
// eyeballed in a real browser before it goes anywhere near production.
// `vite preview` does not apply vercel.json, which is how a broken CSP would
// otherwise reach prod unnoticed.
//
// Usage: npm run build && node scripts/preview-headers.mjs   (then open the URL
// with the devtools console open and click through every route)
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const ROOT = new URL('../dist/', import.meta.url).pathname
const PORT = Number(process.env.PORT || 4178)

const vercel = JSON.parse(
  await readFile(new URL('../vercel.json', import.meta.url), 'utf8'),
)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
}

// Only the catch-all rule matters for checking the CSP. Cache rules are noise
// here, so this deliberately does not reimplement vercel's path matching.
const globalHeaders = Object.fromEntries(
  (vercel.headers ?? [])
    .filter((rule) => rule.source === '/(.*)')
    .flatMap((rule) => rule.headers)
    .map((h) => [h.key, h.value]),
)

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  // Same SPA fallback as the vercel.json rewrite: anything that is not a real
  // file and not /api/ becomes index.html.
  let path = normalize(join(ROOT, decodeURIComponent(url.pathname)))
  if (!path.startsWith(ROOT)) {
    res.writeHead(403).end('forbidden')
    return
  }

  let body
  try {
    body = await readFile(path)
  } catch {
    if (url.pathname.startsWith('/api/')) {
      res.writeHead(501, globalHeaders).end('api routes are not served here')
      return
    }
    path = join(ROOT, 'index.html')
    body = await readFile(path)
  }

  res.writeHead(200, {
    ...globalHeaders,
    'Content-Type': TYPES[extname(path)] ?? 'application/octet-stream',
  })
  res.end(body)
}).listen(PORT, () => {
  console.log(`dist/ on http://localhost:${PORT} with vercel.json headers`)
  console.log('CSP:', globalHeaders['Content-Security-Policy'] ?? '(none set)')
})
