import { test } from 'node:test'
import assert from 'node:assert/strict'
import { badgeUrl, skillEarned, norm, GAME_CATALOG, GEAR_BADGES, SKILL_CATALOG } from '../src/catalog.js'

test('game yang ditarik Google tidak membawa access code basi', () => {
  for (const g of GAME_CATALOG.filter((x) => x.off)) assert.equal(g.code, null)
})

// Silabus resmi membagi 51 badge jadi 17 per level. Kalau angkanya meleset, entah ada entri
// yang salah label entah daftarnya berubah dan katalog belum disinkronkan.
test('silabus resmi: 17 badge per level', () => {
  const count = {}
  for (const s of SKILL_CATALOG) if (s.level) count[s.level] = (count[s.level] || 0) + 1
  assert.deepEqual(count, { beginner: 17, intermediate: 17, advanced: 17 })
})

// Kartu Bonus Milestone menampilkan nama badge dari SKILL_CATALOG; id GEAR yang salah ketik
// akan diam-diam tampil sebagai angka, bukan error.
test('semua badge GEAR ada di katalog skill', () => {
  const ids = new Set(SKILL_CATALOG.map((s) => s.id))
  for (const id of GEAR_BADGES) assert.ok(ids.has(id), `GEAR badge ${id} tidak ada di SKILL_CATALOG`)
})

test('badgeUrl: skill by name -> course template', () => {
  assert.equal(badgeUrl('Get Started with Pub/Sub'), 'https://www.skills.google/course_templates/728?utm_source=arcade-hub')
})

// Game id berganti tiap bulan, jadi ambil dari katalog. Yang diuji tetap: judul badge Base Camp
// harus mendarat di entri Base Camp (bukan game lain) dan jadi URL game, bukan course/null.
test('badgeUrl: game by regex -> halaman game', () => {
  const bc = GAME_CATALOG.find((g) => g.short === 'Base Camp')
  assert.equal(badgeUrl('Arcade Base Camp'), `https://www.skills.google/games/${bc.game}?utm_source=arcade-hub`)
})

// Regex game yang terlalu longgar akan menyambar skill badge (mis. /network security/i vs badge
// "Designing Network Security in Google Cloud"), lalu badge itu salah di-link ke halaman game.
test('regex game tidak menyambar nama skill badge', () => {
  for (const s of SKILL_CATALOG) {
    const hit = GAME_CATALOG.find((g) => g.re.test(s.name))
    assert.equal(hit, undefined, `regex game "${hit?.short}" ikut cocok dengan skill badge "${s.name}"`)
  }
})

test('badgeUrl: skill by alias (nama lama Google) -> course sama', () => {
  assert.equal(
    badgeUrl('Implement Event-Driven Messaging and Automation Workflows'),
    'https://www.skills.google/course_templates/728?utm_source=arcade-hub',
  )
})

test('badgeUrl: di luar katalog -> null (tanpa link)', () => {
  assert.equal(badgeUrl('Badge Yang Tidak Ada Di Katalog'), null)
})

test('skillEarned: cocok nama sekarang maupun alias lama', () => {
  const now = 'Implement Event-Driven Messaging and Automation Workflows'
  assert.equal(skillEarned(728, now, new Set([norm('Get Started with Pub/Sub')])), true) // via alias
  assert.equal(skillEarned(728, now, new Set([norm(now)])), true) // via nama
  assert.equal(skillEarned(728, now, new Set([norm('Sesuatu Lain')])), false)
})

test('norm: lowercase + buang non-alfanumerik', () => {
  assert.equal(norm('Get Started with Pub/Sub!'), 'getstartedwithpubsub')
})
