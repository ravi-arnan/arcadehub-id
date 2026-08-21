import { test } from 'node:test'
import assert from 'node:assert/strict'
import { nextTotalAbove } from './rank.js'

const mk = (...totals) => totals.map((total, i) => ({ id: 'p' + i, total }))

test('nextTotalAbove: nilai unik terdekat di atas, bukan yang tertinggi', () => {
  assert.equal(nextTotalAbove(mk(128, 99, 99, 41), 41), 99)
})

test('nextTotalAbove: null kalau sudah paling tinggi', () => {
  assert.equal(nextTotalAbove(mk(128, 99), 128), null)
})

test('nextTotalAbove: poin yang sama tidak dianggap di atas', () => {
  assert.equal(nextTotalAbove(mk(99, 99, 99), 99), null)
})

test('dayMonth: string tanggal-saja tidak bergeser oleh zona waktu', async () => {
  const { dayMonth } = await import('../src/utils/time.js')
  assert.equal(dayMonth('2026-08-01'), '1 Agu')
  assert.equal(dayMonth('2026-12-31'), '31 Des')
  assert.equal(dayMonth('2026-08-14T00:00:00.000Z'), '14 Agu')
  assert.equal(dayMonth(null), '')
})
