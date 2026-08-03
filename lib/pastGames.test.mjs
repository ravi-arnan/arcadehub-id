import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { PAST_GAMES, gamePoints, pastGameImg, pastGameEarned } from './pastGames.js'

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '')

// Nama file art diturunkan dari nama game, jadi salah ketik satu huruf = gambar hilang
// diam-diam di halaman (img rusak, tanpa error). Test ini yang menangkapnya.
test('setiap game terdahulu punya art badge di public/img/past', () => {
  for (const g of PAST_GAMES) {
    const p = new URL('../public' + pastGameImg(g.name), import.meta.url)
    assert.ok(existsSync(p), `art badge hilang untuk "${g.name}" -> ${pastGameImg(g.name)}`)
  }
})

test('nama unik: satu badge tidak boleh dihitung dua kali', () => {
  assert.equal(new Set(PAST_GAMES.map((g) => g.name)).size, PAST_GAMES.length)
})

// Profil peserta menyimpan judul badge yang bertema ("Arcade Voyage: Cloud Storage and Data
// Governance"), bukan label arsip Google ("Arcade Voyage: July 2026"). Tanpa alias, game itu
// tidak pernah tercentang dan poin spesialnya kehitung 1.
test('pastGameEarned: cocok lewat judul asli di profil (alt)', () => {
  const voyage = PAST_GAMES.find((g) => g.name === 'Arcade Voyage: July 2026')
  assert.ok(pastGameEarned(voyage, new Set([norm('Arcade Voyage: Cloud Storage and Data Governance')])))
  assert.ok(pastGameEarned(voyage, new Set([norm(voyage.name)])), 'nama arsip tetap dikenali')
  assert.equal(pastGameEarned(voyage, new Set([norm('Badge Lain')])), false)
})

test('alias tidak dipakai dua entri sekaligus', () => {
  const keys = PAST_GAMES.flatMap((g) => [g.name, ...(g.alt || [])].map(norm))
  assert.equal(new Set(keys).size, keys.length)
})

test('gamePoints: alias ikut membawa bobot poin entri aslinya', () => {
  assert.equal(gamePoints('Arcade Voyage: Cloud Storage and Data Governance'), 1)
  assert.equal(gamePoints('Safe Spaces'), 1)
})

test('gamePoints: cocok walau spasi/tanda baca judul beda, default 1', () => {
  assert.equal(gamePoints('Arcade Work-Life Refresh'), 2) // profil menulis tanpa spasi ganjil
  assert.equal(gamePoints('Arcade Skills Spawn'), 3)
  assert.equal(gamePoints('Arcade Base Camp'), 1)         // game bulan berjalan
})
