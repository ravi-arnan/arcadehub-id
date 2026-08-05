import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { SEO_ROUTES, SITE_URL, canonicalFor } from './seoRoutes.js'

// App.jsx dibaca sebagai TEKS, bukan diimpor: file itu JSX dan `node --test` tidak bisa
// mem-parse-nya. Rute "*" dilewati karena itu penangkap 404, bukan halaman.
const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
const appRoutes = [...app.matchAll(/<Route\s+path="([^"]+)"/g)]
  .map((m) => m[1])
  .filter((p) => p !== '*')
  .map((p) => '/' + p.replace(/^\//, ''))

const seoPaths = SEO_ROUTES.map((r) => r.path)

// Ini penjagaan terpentingnya: halaman baru yang lupa didaftarkan akan mewarisi metadata
// halaman depan, termasuk canonical-nya, dan itu MEMBERI TAHU Google bahwa halaman itu
// duplikat halaman depan. Akibatnya halaman baru justru dikeluarkan dari indeks.
test('setiap rute di App.jsx punya metadata SEO sendiri', () => {
  assert.ok(appRoutes.length >= 8, `cuma ${appRoutes.length} rute terbaca, regex-nya mungkin rusak`)
  for (const r of appRoutes) {
    assert.ok(seoPaths.includes(r), `rute ${r} ada di App.jsx tapi belum punya entri di lib/seoRoutes.js`)
  }
})

test('tidak ada metadata untuk rute yang sudah tidak ada', () => {
  const boleh = new Set(['/', ...appRoutes])
  for (const p of seoPaths) {
    assert.ok(boleh.has(p), `seoRoutes memuat ${p} yang bukan rute aplikasi lagi`)
  }
})

test('path unik dan selalu diawali garis miring', () => {
  assert.equal(new Set(seoPaths).size, seoPaths.length, 'ada path duplikat')
  for (const p of seoPaths) assert.match(p, /^\//, `path tidak diawali garis miring: ${p}`)
})

// Judul dan deskripsi yang sama persis di banyak URL adalah separuh dari masalah duplikat
// yang mau diperbaiki prerender. Kalau ini gagal, prerender-nya jadi sia-sia.
test('judul dan deskripsi unik di tiap rute', () => {
  const judul = SEO_ROUTES.map((r) => r.title)
  const desk = SEO_ROUTES.map((r) => r.description)
  assert.equal(new Set(judul).size, judul.length, 'ada judul yang dipakai dua rute')
  assert.equal(new Set(desk).size, desk.length, 'ada deskripsi yang dipakai dua rute')
})

test('deskripsi berada di panjang yang tidak dipotong hasil pencarian', () => {
  for (const r of SEO_ROUTES) {
    assert.ok(r.description.length >= 70, `deskripsi ${r.path} terlalu pendek (${r.description.length})`)
    assert.ok(r.description.length <= 200, `deskripsi ${r.path} terlalu panjang (${r.description.length})`)
    assert.ok(r.title.length <= 90, `judul ${r.path} terlalu panjang (${r.title.length})`)
  }
})

test('metadata bebas karakter yang merusak atribut HTML', () => {
  // Nilainya ditulis ke dalam content="..." saat prerender, jadi tanda kutip ganda akan
  // memutus atributnya. Em dash ikut dijaga karena konvensi repo melarangnya.
  for (const r of SEO_ROUTES) {
    for (const [nama, v] of [['judul', r.title], ['deskripsi', r.description]]) {
      assert.doesNotMatch(v, /"/, `${nama} ${r.path} memuat tanda kutip ganda`)
      assert.doesNotMatch(v, /—/, `${nama} ${r.path} memuat em dash`)
      assert.doesNotMatch(v, /[<>]/, `${nama} ${r.path} memuat kurung siku`)
    }
  }
})

test('canonicalFor menghasilkan URL absolut tanpa garis miring ganda', () => {
  assert.equal(canonicalFor('/'), `${SITE_URL}/`)
  assert.equal(canonicalFor('/catalog'), `${SITE_URL}/catalog`)
  for (const r of SEO_ROUTES) {
    const u = canonicalFor(r.path)
    assert.match(u, /^https:\/\//, `canonical tidak absolut: ${u}`)
    assert.doesNotMatch(u.slice(8), /\/\//, `ada garis miring ganda: ${u}`)
  }
})
