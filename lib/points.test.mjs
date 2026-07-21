import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calc, scoreProfile, tierForPoints } from './points.js'

test('calc: milestone resmi', () => {
  assert.equal(calc(6, 14, false).total, 20)
  assert.equal(calc(8, 28, false).total, 40)
  assert.equal(calc(10, 42, false).total, 60)
  assert.equal(calc(12, 56, false).total, 80)
})

test('scoreProfile: total = base(season) + bonus milestone(facil)', () => {
  let r = scoreProfile(10, 38, 0, 0) // semua badge pra-fasilitator
  assert.equal(r.base, 29) // 10 + floor(38/2)=19
  assert.equal(r.mbonus, 0)
  assert.equal(r.milestoneIdx, -1)
  assert.equal(r.total, 29)

  r = scoreProfile(10, 38, 8, 28) // facil mencapai M2
  assert.equal(r.milestoneIdx, 1)
  assert.equal(r.mbonus, 18)
  assert.equal(r.total, 47)
})

test('scoreProfile: skill ganjil pakai floor', () => {
  assert.equal(scoreProfile(0, 7, 0, 0).base, 3)
})

test('scoreProfile: akun baru 0 badge -> semua nol, tanpa error', () => {
  const r = scoreProfile(0, 0, 0, 0)
  assert.equal(r.base, 0)
  assert.equal(r.mbonus, 0)
  assert.equal(r.milestoneIdx, -1)
  assert.equal(r.total, 0)
})

test('tierForPoints: batas tier hadiah', () => {
  assert.equal(tierForPoints(49), -1)
  assert.equal(tierForPoints(50), 0)
  assert.equal(tierForPoints(94), 1)
  assert.equal(tierForPoints(120), 3)
})
