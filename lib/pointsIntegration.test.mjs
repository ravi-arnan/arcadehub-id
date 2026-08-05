import { test } from 'node:test'
import assert from 'node:assert/strict'
import { computePoints } from './parseProfile.js'
import { scoreProfile, MS, BONUS_TASK } from './points.js'
import { GEAR_BADGES } from '../src/catalog.js'
import { SKILL_CATALOG, norm, skillEarned } from './skillCatalog.js'

// Tes integrasi untuk memastikan pengetatan aturan poin (hanya game + skill badge resmi yang
// berpoin) TIDAK diam-diam mematikan sumber poin lain: bobot game spesial, bonus milestone,
// dan deteksi badge GEAR yang jadi syarat Bonus Milestone +10.
//
// Ini yang menjawab pertanyaan "apakah bonus milestone dll tetap terhitung". Jalur-jalur itu
// tidak punya tes sendiri sebelumnya, jadi kerusakannya akan gagal diam-diam.

const DALAM_FASIL = new Date('2026-08-01T10:00:00+07:00') // di dalam window fasilitator
const badge = (title, earned = DALAM_FASIL) => ({ title, earned, raw: '' })

const GAME_SPESIAL_3 = 'Arcade From Foundation to Wonders' // PAST_GAMES, bobot 3 poin
const GAME_BIASA = 'Arcade A Cloud That Cares'             // PAST_GAMES, bobot 1 poin
const COMPLETION = 'AI Boost Bites: Create Your Own Retro Arcade Game'
const ASING = 'Badge Yang Tidak Ada Di Katalog Mana Pun'

test('bobot game spesial tetap dihitung, bukan 1 poin rata', () => {
  const p = computePoints([badge(GAME_SPESIAL_3), badge(GAME_BIASA)])
  assert.equal(p.seasonGames, 2, 'dua-duanya harus terbaca game')
  // Kalau ini jadi 2, berarti bobot pastGames hilang dan game spesial turun nilainya.
  assert.equal(p.seasonGamePoints, 4, '3 poin + 1 poin')
})

test('bonus milestone tetap masuk total begitu syaratnya terpenuhi', () => {
  const ms = MS[0] // Milestone 1: 6 game + 14 badge, bonus 7
  const sc = scoreProfile(ms.g, ms.s, ms.g, ms.s)
  assert.equal(sc.milestoneIdx, 0)
  assert.equal(sc.mbonus, ms.bonus)
  assert.equal(sc.total, sc.base + ms.bonus, 'total wajib memuat bonus milestone')
  assert.ok(sc.mbonus > 0)
})

test('bonus milestone nol kalau syaratnya belum terpenuhi, bukan negatif atau NaN', () => {
  const sc = scoreProfile(0, 0, 0, 0)
  assert.equal(sc.milestoneIdx, -1)
  assert.equal(sc.mbonus, 0)
  assert.equal(sc.total, 0)
})

// Bonus Milestone AI Agent (+10) membaca progres 4 badge GEAR dari `score.skillList`.
// Sejak aturan diperketat, skillList HANYA berisi badge yang berpoin. Kalau salah satu badge
// GEAR sampai tidak masuk SKILL_CATALOG, progresnya akan terlihat mandek selamanya tanpa error.
test('4 badge GEAR tetap terbaca dari skillList sesudah aturan diperketat', () => {
  const gear = GEAR_BADGES.map((id) => SKILL_CATALOG.find((s) => s.id === id))
  for (const [i, s] of gear.entries()) {
    assert.ok(s, `badge GEAR ${GEAR_BADGES[i]} hilang dari SKILL_CATALOG`)
  }
  const p = computePoints(gear.map((s) => badge(s.name)))
  assert.equal(p.seasonSkills, 4, 'keempat badge GEAR wajib ikut terhitung sebagai badge keahlian')

  const earned = new Set(p.skillList.map(norm))
  for (const s of gear) {
    assert.equal(skillEarned(s.id, s.name, earned), true, `GEAR "${s.name}" tidak terdeteksi selesai`)
  }
})

test('BONUS_TASK masih 10 dan ditambahkan di luar poin badge', () => {
  assert.equal(BONUS_TASK, 10)
  const sc = scoreProfile(0, 0, 0, 0)
  // Bonus ini diklaim manual dan disimpan lokal, jadi penjumlahannya ada di UI.
  // Yang dijaga di sini: dia BUKAN bagian dari total hasil parsing, supaya tidak dobel.
  assert.equal(sc.total, 0)
})

test('badge tidak berpoin tidak mengurangi apa pun, hanya tidak menambah', () => {
  const dasar = computePoints([badge(GAME_BIASA)])
  const plus = computePoints([badge(GAME_BIASA), badge(COMPLETION), badge(ASING)])
  assert.equal(plus.seasonGamePoints, dasar.seasonGamePoints)
  assert.equal(plus.seasonSkills, dasar.seasonSkills)
  assert.equal(plus.seasonUnknown, 2, 'keduanya wajib dilaporkan supaya bisa ditampilkan')
})

// seasonBadges dipakai halaman Badge Saya. Tiap entri wajib membawa `counts` supaya UI bisa
// memisahkan badge berpoin dari yang tidak; tanpa itu Badge Saya akan menampilkan angka
// "Skills" yang berbeda dari kartu Skill Badges di halaman yang sama.
test('seasonBadges membawa penanda counts per badge', () => {
  const skillAsli = SKILL_CATALOG[0].name
  const p = computePoints([badge(GAME_BIASA), badge(skillAsli), badge(COMPLETION)])
  const byTitle = Object.fromEntries(p.seasonBadges.map((b) => [b.title, b]))
  assert.equal(byTitle[GAME_BIASA].counts, true)
  assert.equal(byTitle[skillAsli].counts, true)
  assert.equal(byTitle[COMPLETION].counts, false)
})

test('milestone fasilitator hanya menghitung badge di dalam window-nya', () => {
  const sebelum = new Date('2026-07-01T10:00:00+07:00') // sebelum 13 Jul, di luar window fasilitator
  const skillAsli = SKILL_CATALOG[0].name
  const p = computePoints([badge(skillAsli, sebelum)])
  assert.equal(p.seasonSkills, 1, 'tetap masuk total Season 2026')
  assert.equal(p.facilSkills, 0, 'tapi tidak mengisi milestone fasilitator')
})
