// Arcade Hub service worker, minimal, install-enabling + offline shell.
const CACHE = 'arcadehub-v1'
const SHELL = ['/', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/')) return // never cache API

  // Navigations: network-first, fall back to cached shell when offline.
  //
  // Shell-nya ikut disegarkan tiap navigasi online. Tanpa itu, `/` cuma
  // di-cache sekali waktu install, dan CACHE hanya diganti kalau isi sw.js
  // sendiri berubah, yang tidak terjadi di deploy biasa. Efeknya pengguna
  // offline dapat index.html lama yang menunjuk chunk rute yang sudah dihapus.
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone()
            // waitUntil, bukan promise telanjang: browser boleh mematikan
            // worker begitu respondWith selesai, dan entri cache yang
            // ketulis separuh persis cara offline shell hilang diam-diam.
            e.waitUntil(caches.open(CACHE).then((c) => c.put('/', copy)))
          }
          return res
        })
        .catch(() => caches.match('/')),
    )
    return
  }

  // Static assets: cache-first, revalidate in background.
  e.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request).then((res) => {
        if (res && res.ok) {
          const copy = res.clone()
          e.waitUntil(caches.open(CACHE).then((c) => c.put(request, copy)))
        }
        return res
      }).catch(() => cached)
      return cached || network
    })
  )
})
