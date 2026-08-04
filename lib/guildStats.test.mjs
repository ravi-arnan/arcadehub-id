import { test } from 'node:test'
import assert from 'node:assert/strict'
import { guildStats } from './guildStats.js'

// Bentuk baris sama seperti yang dikirim /api/leaderboard.
const mem = (id, guild, total, extra = {}) => ({
  id, guild, name: 'P' + id, total,
  games: 0, skills: 0, tier_idx: -1, ...extra,
})

test('guildStats: kosong menghasilkan daftar kosong, bukan lempar error', () => {
  assert.deepEqual(guildStats([]), [])
})

test('guildStats: guild null dan string kosong jatuh ke UMUM yang sama', () => {
  const out = guildStats([mem(1, null, 10), mem(2, '', 20), mem(3, 'UMUM', 30)])
  assert.equal(out.length, 1)
  assert.equal(out[0].code, 'UMUM')
  assert.equal(out[0].label, 'Umum')
  assert.equal(out[0].count, 3)
})

test('guildStats: total, rata-rata, dan poin tertinggi per guild', () => {
  const out = guildStats([mem(1, 'A', 10), mem(2, 'A', 30), mem(3, 'B', 5)])
  const a = out.find((g) => g.code === 'A')
  assert.equal(a.count, 2)
  assert.equal(a.total, 40)
  assert.equal(a.avg, 20)
  assert.equal(a.best, 30)
})

test('guildStats: rata-rata dibulatkan satu desimal, bukan pecahan panjang', () => {
  // 10+10+11 = 31 / 3 = 10,333...
  const out = guildStats([mem(1, 'A', 10), mem(2, 'A', 10), mem(3, 'A', 11)])
  assert.equal(out[0].avg, 10.3)
})

test('guildStats: diurutkan dari total poin terbesar', () => {
  const out = guildStats([mem(1, 'kecil', 5), mem(2, 'besar', 100), mem(3, 'sedang', 50)])
  // Kode dikembalikan sudah ternormalisasi (guildKey uppercase), sama seperti yang
  // tersimpan di database, supaya link ?guild= yang dibangun dari sini selalu cocok.
  assert.deepEqual(out.map((g) => g.code), ['BESAR', 'SEDANG', 'KECIL'])
})

test('guildStats: seri total dipecah oleh jumlah peserta, lalu nama guild', () => {
  // Dua guild sama-sama 20 poin: yang pesertanya lebih sedikit lebih efisien, taruh duluan.
  const out = guildStats([mem(1, 'B', 20), mem(2, 'A', 10), mem(3, 'A', 10)])
  assert.deepEqual(out.map((g) => g.code), ['B', 'A'])
})

test('guildStats: menghitung peserta yang sudah menembus tiap milestone', () => {
  const out = guildStats([
    mem(1, 'A', 80, { tier_idx: 3 }),
    mem(2, 'A', 40, { tier_idx: 1 }),
    mem(3, 'A', 0, { tier_idx: -1 }),
  ])
  // reached[i] = berapa peserta yang tier_idx >= i, jadi kumulatif menurun.
  assert.deepEqual(out[0].reached, [2, 2, 1, 1])
})

test('guildStats: menjumlahkan games dan skills per guild', () => {
  const out = guildStats([
    mem(1, 'A', 0, { games: 3, skills: 10 }),
    mem(2, 'A', 0, { games: 2, skills: 4 }),
  ])
  assert.equal(out[0].games, 5)
  assert.equal(out[0].skills, 14)
})

test('guildStats: field numerik yang hilang diperlakukan nol, bukan NaN', () => {
  const out = guildStats([{ id: 1, guild: 'A', name: 'x' }])
  assert.equal(out[0].total, 0)
  assert.equal(out[0].avg, 0)
  assert.equal(out[0].best, 0)
  assert.equal(out[0].games, 0)
  assert.deepEqual(out[0].reached, [0, 0, 0, 0])
})

test('guildStats: tidak memutasi array maupun objek masukan', () => {
  const rows = [mem(1, 'A', 10)]
  const snapshot = JSON.parse(JSON.stringify(rows))
  guildStats(rows)
  assert.deepEqual(rows, snapshot)
})
