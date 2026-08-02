import test from 'node:test'
import assert from 'node:assert/strict'
import { searchMembers } from './searchMembers.js'

const MEMBERS = [
  { id: 1, name: 'Alfa Kautsar' },
  { id: 2, name: 'Adlianto' },
  { id: 3, name: 'Yudio Adifaza' },
  { id: 4, name: 'P KANISIUS BAGASKARA' },
]

const names = (list) => list.map((m) => m.name)

test('searchMembers: query kosong mengembalikan daftar apa adanya', () => {
  assert.equal(searchMembers(MEMBERS, ''), MEMBERS)
  assert.equal(searchMembers(MEMBERS, '   '), MEMBERS)
})

test('searchMembers: cocok sebagian, tidak peduli huruf besar-kecil', () => {
  assert.deepEqual(names(searchMembers(MEMBERS, 'adl')), ['Adlianto'])
  assert.deepEqual(names(searchMembers(MEMBERS, 'KAUTSAR')), ['Alfa Kautsar'])
  assert.deepEqual(names(searchMembers(MEMBERS, 'kanisius')), ['P KANISIUS BAGASKARA'])
})

test('searchMembers: cocok di tengah kata, bukan cuma awalan', () => {
  assert.deepEqual(names(searchMembers(MEMBERS, 'difa')), ['Yudio Adifaza'])
})

test('searchMembers: beberapa hasil tetap urut seperti masukan', () => {
  assert.deepEqual(names(searchMembers(MEMBERS, 'a')), names(MEMBERS))
})

test('searchMembers: spasi berlebih di query maupun nama diabaikan', () => {
  assert.deepEqual(names(searchMembers(MEMBERS, '  alfa   kautsar  ')), ['Alfa Kautsar'])
  const spaced = [{ id: 9, name: 'Alfa   Kautsar' }]
  assert.deepEqual(names(searchMembers(spaced, 'alfa kautsar')), ['Alfa   Kautsar'])
})

test('searchMembers: tanpa kecocokan mengembalikan daftar kosong', () => {
  assert.deepEqual(searchMembers(MEMBERS, 'zzz'), [])
})

test('searchMembers: nama hilang atau null tidak melempar error', () => {
  const messy = [{ id: 1 }, { id: 2, name: null }, { id: 3, name: 'Budi' }]
  assert.deepEqual(names(searchMembers(messy, 'budi')), ['Budi'])
  assert.equal(searchMembers(messy, 'zzz').length, 0)
})
