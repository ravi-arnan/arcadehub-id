import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calc, scoreProfile, tierForPoints, pointBreakdown } from './points.js'

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

test('pointBreakdown: jumlah bagiannya sama dengan total yang tampil', () => {
  // Kasus nyata Ravi 8 Agu 2026: 11 game, 29 skill badge, M2 -> total 43.
  const b = pointBreakdown({ base: 25, skills: 29, mbonus: 18 })
  assert.equal(b.gamePoints, 11)
  assert.equal(b.skillPoints, 14)
  assert.equal(b.skillLeftover, 1)
  assert.equal(b.mbonus, 18)
  assert.equal(b.total, 43)
  assert.equal(b.grandTotal, 43) // bonus AI Agent belum diklaim
})

test('pointBreakdown: game spesial bernilai >1 poin tetap terpisah dari poin skill', () => {
  // 8 game tapi 11 poin game (game Jan-Jun 2026 ada yang 2-3 poin), 28 skill badge.
  const b = pointBreakdown({ base: 25, skills: 28, mbonus: 18 })
  assert.equal(b.skillPoints, 14)
  assert.equal(b.gamePoints, 11)
  assert.equal(b.skillLeftover, 0)
})

test('pointBreakdown: bonus AI Agent hanya masuk grandTotal, bukan total', () => {
  const b = pointBreakdown({ base: 25, skills: 29, mbonus: 18 }, true)
  assert.equal(b.task, 10)
  assert.equal(b.total, 43)
  assert.equal(b.grandTotal, 53)
})

test('pointBreakdown: nol/kosong aman, tidak pernah negatif', () => {
  assert.deepEqual(pointBreakdown(), { gamePoints: 0, skillPoints: 0, skillLeftover: 0, mbonus: 0, task: 0, total: 0, grandTotal: 0 })
  assert.equal(pointBreakdown({ base: 0, skills: 5, mbonus: 0 }).gamePoints, 0)
})
