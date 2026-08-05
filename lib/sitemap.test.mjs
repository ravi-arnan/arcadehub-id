import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

// public/sitemap.xml ditulis tangan sementara rutenya hidup di src/App.jsx. Tanpa tes ini,
// menambah halaman baru akan diam-diam meninggalkan sitemap yang tidak lengkap, dan tidak ada
// yang akan sadar sampai seseorang bertanya kenapa halaman itu tidak muncul di pencarian.
//
// App.jsx dibaca sebagai TEKS, bukan diimpor: file itu JSX dan `node --test` tidak bisa
// mem-parse-nya.

const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
const sitemap = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8')

// <Route path="catalog" ...> -> "/catalog". Rute "*" (404) dan index dilewati: keduanya bukan
// halaman yang layak diindeks.
const appRoutes = [...app.matchAll(/<Route\s+path="([^"]+)"/g)]
  .map((m) => m[1])
  .filter((p) => p !== '*')
  .map((p) => '/' + p.replace(/^\//, ''))

const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)

test('sitemap memuat setiap rute halaman yang ada di App.jsx', () => {
  assert.ok(appRoutes.length >= 8, `cuma ${appRoutes.length} rute terbaca, regex-nya mungkin rusak`)
  for (const r of appRoutes) {
    assert.ok(sitemapPaths.includes(r), `rute ${r} ada di App.jsx tapi belum masuk sitemap.xml`)
  }
})

test('sitemap tidak memuat URL yang bukan rute aplikasi', () => {
  const boleh = new Set(['/', ...appRoutes])
  for (const p of sitemapPaths) {
    assert.ok(boleh.has(p), `sitemap memuat ${p} yang bukan rute aplikasi (rute dihapus?)`)
  }
})

test('sitemap: semua URL absolut, https, dan tanpa duplikat', () => {
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  assert.ok(locs.length > 0, 'sitemap kosong')
  assert.equal(new Set(locs).size, locs.length, 'ada <loc> duplikat')
  for (const l of locs) {
    assert.match(l, /^https:\/\/arcadehub-id\.vercel\.app\//, `URL tidak absolut atau salah host: ${l}`)
  }
})

test('robots.txt menunjuk sitemap dan tidak memblokir seluruh situs', () => {
  const robots = readFileSync(new URL('../public/robots.txt', import.meta.url), 'utf8')
  assert.match(robots, /^Sitemap:\s*https:\/\/arcadehub-id\.vercel\.app\/sitemap\.xml$/m)
  // Penjagaan terhadap kecelakaan paling mahal di SEO: satu baris ini menghapus seluruh
  // situs dari hasil pencarian, dan gejalanya baru terlihat berminggu-minggu kemudian.
  assert.doesNotMatch(robots, /^Disallow:\s*\/\s*$/m, 'robots.txt memblokir SELURUH situs')
})
