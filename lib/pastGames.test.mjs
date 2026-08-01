import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { PAST_GAMES, gamePoints, pastGameImg } from './pastGames.js'

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

test('gamePoints: cocok walau spasi/tanda baca judul beda, default 1', () => {
  assert.equal(gamePoints('Arcade Work-Life Refresh'), 2) // profil menulis tanpa spasi ganjil
  assert.equal(gamePoints('Arcade Skills Spawn'), 3)
  assert.equal(gamePoints('Arcade Base Camp'), 1)         // game bulan berjalan
})
