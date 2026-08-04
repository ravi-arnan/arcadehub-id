import { test } from 'node:test'
import assert from 'node:assert/strict'
import { classifyBadge, COUNT_UNKNOWN_BADGES } from './scoring.js'

// Judul di tes ini sengaja diambil dari katalog sungguhan, bukan karangan, supaya tes ikut
// gagal kalau suatu saat entri itu hilang dari katalog.
const A_SKILL = 'Monitoring in Google Cloud'                        // SKILL_CATALOG id 747
const A_SKILL_ALIAS = 'Get Started with Sensitive Data Protection'  // alias lama id 750
const A_COMPLETION = 'AI Boost Bites: Create Your Own Retro Arcade Game' // course biasa
const A_GAME = 'Spans and Plans'                                    // Arcade Special Agu 2026

test('sakelar aturan: default mengikuti silabus resmi, badge asing tidak berpoin', () => {
  assert.equal(COUNT_UNKNOWN_BADGES, false)
})

test('classifyBadge: skill badge resmi terbaca skill dan berpoin', () => {
  const c = classifyBadge(A_SKILL)
  assert.equal(c.kind, 'skill')
  assert.equal(c.counts, true)
})

test('classifyBadge: nama lama skill badge tetap terbaca skill', () => {
  // Google mengganti nama badge tanpa mengganti course id, dan profil peserta menyimpan
  // judul saat di-earn. Kalau alias tidak dipakai, orang kehilangan poin karena rename.
  assert.equal(classifyBadge(A_SKILL_ALIAS).kind, 'skill')
})

test('classifyBadge: completion badge jatuh ke unknown dan TIDAK berpoin', () => {
  // Judul ini juga memuat kata "Arcade Game": pernah salah terhitung 1 poin game.
  const c = classifyBadge(A_COMPLETION)
  assert.equal(c.kind, 'unknown')
  assert.equal(c.counts, false)
})

test('classifyBadge: game menang atas kategori lain walau judulnya tidak memuat "Arcade"', () => {
  const c = classifyBadge(A_GAME)
  assert.equal(c.kind, 'game')
  assert.equal(c.counts, true)
})

test('classifyBadge: badge di luar katalog terbaca unknown', () => {
  assert.equal(classifyBadge('Badge Yang Belum Pernah Ada Di Katalog Mana Pun').kind, 'unknown')
})

test('classifyBadge: judul kosong, null, atau undefined tidak melempar', () => {
  assert.equal(classifyBadge('').kind, 'unknown')
  assert.equal(classifyBadge(null).kind, 'unknown')
  assert.equal(classifyBadge(undefined).counts, false)
})

test('classifyBadge: beda tanda baca dan kapitalisasi tetap cocok', () => {
  assert.equal(classifyBadge('monitoring in google cloud').kind, 'skill')
  assert.equal(classifyBadge('Monitoring in  Google Cloud!').kind, 'skill')
})
