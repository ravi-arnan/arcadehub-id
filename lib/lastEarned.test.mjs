import { test } from 'node:test'
import assert from 'node:assert/strict'
import { computePoints } from './parseProfile.js'

// lastEarned adalah pemutus urutan leaderboard saat poin sama, jadi salahnya tidak kelihatan
// dari tampilan: nomor urut tetap 1,2,3, cuma orangnya tertukar.

const badge = (title, day) => ({ title, earned: new Date(day + 'T00:00:00-07:00'), raw: day })
// Judul yang pasti berpoin: game Arcade bulan berjalan + skill badge resmi di katalog.
const GAME = 'Arcade Base Camp September 2026'
const SKILL = 'Monitoring in Google Cloud'
const FREE = 'Introduction to Generative AI'  // completion badge, tidak berpoin

test('mengambil tanggal badge berpoin TERAKHIR', () => {
  const p = computePoints([badge(SKILL, '2026-08-01'), badge(GAME, '2026-08-14')])
  assert.equal(p.lastEarned.toISOString().slice(0, 10), '2026-08-14')
})

test('badge tanpa poin tidak menggeser tanggalnya', () => {
  const p = computePoints([badge(GAME, '2026-08-14'), badge(FREE, '2026-08-20')])
  assert.equal(p.lastEarned.toISOString().slice(0, 10), '2026-08-14')
})

test('null kalau belum ada badge berpoin sama sekali', () => {
  assert.equal(computePoints([]).lastEarned, null)
  assert.equal(computePoints([badge(FREE, '2026-08-20')]).lastEarned, null)
})

test('badge di luar periode 2026 tidak ikut', () => {
  const p = computePoints([badge(SKILL, '2026-08-01'), badge(GAME, '2027-01-05')])
  assert.equal(p.lastEarned.toISOString().slice(0, 10), '2026-08-01')
})
