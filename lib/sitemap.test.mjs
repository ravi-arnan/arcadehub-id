import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'

// File SEO statis di public/. sitemap.xml TIDAK ada di sini lagi: sejak 5 Agu 2026 dia
// dibangkitkan scripts/prerender.mjs dari lib/seoRoutes.js, dan kecocokan rutenya dijaga
// lib/seoRoutes.test.mjs. Yang tersisa untuk dijaga di sini adalah dua file yang memang
// ditulis tangan dan tidak boleh hilang.

const publicDir = new URL('../public/', import.meta.url)

test('robots.txt menunjuk sitemap dan tidak memblokir seluruh situs', () => {
  const robots = readFileSync(new URL('robots.txt', publicDir), 'utf8')
  assert.match(robots, /^Sitemap:\s*https:\/\/arcadehub-id\.vercel\.app\/sitemap\.xml$/m)
  // Penjagaan terhadap kecelakaan paling mahal di SEO: satu baris ini menghapus seluruh
  // situs dari hasil pencarian, dan gejalanya baru terlihat berminggu-minggu kemudian.
  assert.doesNotMatch(robots, /^Disallow:\s*\/\s*$/m, 'robots.txt memblokir SELURUH situs')
})

// Google membatalkan verifikasi kepemilikan kalau file buktinya hilang, dan itu gagal diam-diam:
// tidak ada error di mana pun, akses ke data Search Console cuma berhenti. File 53 byte bernama
// acak gampang dianggap sampah saat membersihkan public/, jadi keberadaannya dijaga di sini.
//
// Dicari lewat pola, bukan nama persis, supaya tes tidak perlu diubah kalau suatu saat properti
// diverifikasi ulang dengan token baru.
test('file verifikasi Google Search Console masih ada di public/', () => {
  const files = readdirSync(publicDir).filter((f) => /^google[0-9a-f]+\.html$/.test(f))
  assert.ok(files.length > 0, 'file verifikasi google*.html hilang dari public/, verifikasi Search Console akan batal')
  for (const f of files) {
    const isi = readFileSync(new URL(f, publicDir), 'utf8').trim()
    // Google mengharap file berisi baris yang menyebut nama filenya sendiri. Menyunting isinya
    // (menambah komentar, membungkus HTML) akan menggagalkan verifikasi.
    assert.equal(isi, `google-site-verification: ${f}`, `isi ${f} sudah diubah dari aslinya`)
  }
})

// Sitemap dibangkitkan, jadi tidak boleh ada salinan tangan yang tertinggal di public/:
// file statis menang atas hasil build, jadi salinan basi akan diam-diam menang.
test('tidak ada sitemap.xml tertinggal di public/', () => {
  const files = readdirSync(publicDir)
  assert.ok(!files.includes('sitemap.xml'),
    'public/sitemap.xml akan menimpa hasil prerender; hapus, sumbernya lib/seoRoutes.js')
})
