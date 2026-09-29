import { test } from 'node:test'
import assert from 'node:assert/strict'
import { raw, toStatement } from './sqlTag.js'

test('setiap nilai jadi satu placeholder, urutannya dipertahankan', () => {
  const s = toStatement(['a = ', ' AND b = ', ''], [1, 'x'])
  assert.equal(s.sql, 'a = ? AND b = ?')
  assert.deepEqual(s.args, [1, 'x'])
})

test('tanpa nilai: sql apa adanya, args kosong', () => {
  const s = toStatement(['SELECT 1'], [])
  assert.equal(s.sql, 'SELECT 1')
  assert.deepEqual(s.args, [])
})

test('hasilnya berkunci `sql`, bukan `text`, supaya bisa langsung diserahkan ke client', () => {
  const s = toStatement(['SELECT 1'], [])
  assert.deepEqual(Object.keys(s).sort(), ['args', 'sql'])
})

test('nilai tidak pernah disambung ke teks SQL', () => {
  const jahat = "'; DROP TABLE members; --"
  const s = toStatement(['SELECT * FROM members WHERE name = ', ''], [jahat])
  assert.equal(s.sql, 'SELECT * FROM members WHERE name = ?')
  assert.deepEqual(s.args, [jahat])
})

test('raw() disisipkan apa adanya, bukan jadi parameter', () => {
  const s = toStatement(['last_synced = ', ' WHERE id = ', ''], [raw("strftime('%Y','now')"), 7])
  assert.equal(s.sql, "last_synced = strftime('%Y','now') WHERE id = ?")
  assert.deepEqual(s.args, [7])
})

test('undefined jadi null, supaya libSQL tidak menolak', () => {
  const s = toStatement(['x = ', ''], [undefined])
  assert.deepEqual(s.args, [null])
})

test('nol dan string kosong tetap jadi parameter, bukan dianggap kosong', () => {
  const s = toStatement(['a = ', ' AND b = ', ''], [0, ''])
  assert.equal(s.sql, 'a = ? AND b = ?')
  assert.deepEqual(s.args, [0, ''])
})
