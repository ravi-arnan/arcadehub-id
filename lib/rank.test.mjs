import { test } from 'node:test'
import assert from 'node:assert/strict'
import { competitionRanks, tieCounts, nextTotalAbove } from './rank.js'

const mk = (...totals) => totals.map((total, i) => ({ id: 'p' + i, total }))

test('competitionRanks: tanpa seri, peringkat mengikuti urutan', () => {
  const r = competitionRanks(mk(30, 20, 10))
  assert.deepEqual([...r.values()], [0, 1, 2])
})

test('competitionRanks: poin sama dapat peringkat sama', () => {
  const r = competitionRanks(mk(99, 99, 99, 50))
  assert.deepEqual([...r.values()], [0, 0, 0, 3])
})

test('competitionRanks: seri di puncak tidak menggeser peringkat 1', () => {
  const r = competitionRanks(mk(100, 100, 90))
  assert.equal(r.get('p0'), 0)
  assert.equal(r.get('p1'), 0)
  assert.equal(r.get('p2'), 2)
})

test('competitionRanks: ekor nol poin berbagi satu peringkat', () => {
  const r = competitionRanks(mk(5, 0, 0, 0))
  assert.deepEqual([...r.values()], [0, 1, 1, 1])
})

test('competitionRanks: daftar kosong tidak melempar', () => {
  assert.equal(competitionRanks([]).size, 0)
})

test('tieCounts: menghitung peserta per nilai poin', () => {
  const c = tieCounts(mk(99, 99, 50))
  assert.equal(c.get(99), 2)
  assert.equal(c.get(50), 1)
})

test('nextTotalAbove: nilai unik terdekat di atas, bukan yang tertinggi', () => {
  assert.equal(nextTotalAbove(mk(128, 99, 99, 41), 41), 99)
})

test('nextTotalAbove: null kalau sudah paling tinggi', () => {
  assert.equal(nextTotalAbove(mk(128, 99), 128), null)
})

test('nextTotalAbove: poin yang sama tidak dianggap di atas', () => {
  assert.equal(nextTotalAbove(mk(99, 99, 99), 99), null)
})
