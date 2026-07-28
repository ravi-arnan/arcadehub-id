import test from 'node:test'
import assert from 'node:assert/strict'
import { pickShortlist } from './shortlist.js'

const ITEMS = ['a', 'b', 'c', 'd', 'e']

test('pickShortlist: ambil sejumlah count dari offset', () => {
  assert.deepEqual(pickShortlist(ITEMS, 0, 3), ['a', 'b', 'c'])
  assert.deepEqual(pickShortlist(ITEMS, 2, 3), ['c', 'd', 'e'])
})

test('pickShortlist: membungkus ke awal saat offset melewati ujung', () => {
  assert.deepEqual(pickShortlist(ITEMS, 4, 3), ['e', 'a', 'b'])
  assert.deepEqual(pickShortlist(ITEMS, 7, 2), ['c', 'd'])
})

test('pickShortlist: count lebih besar dari daftar tidak mengulang item', () => {
  const out = pickShortlist(ITEMS, 0, 99)
  assert.equal(out.length, ITEMS.length)
  assert.equal(new Set(out).size, ITEMS.length)
})

test('pickShortlist: daftar kosong atau count nol -> kosong', () => {
  assert.deepEqual(pickShortlist([], 0, 4), [])
  assert.deepEqual(pickShortlist(ITEMS, 0, 0), [])
  assert.deepEqual(pickShortlist(ITEMS, 0, -1), [])
})

test('pickShortlist: offset negatif tetap di dalam rentang', () => {
  assert.deepEqual(pickShortlist(ITEMS, -1, 2), ['e', 'a'])
})
