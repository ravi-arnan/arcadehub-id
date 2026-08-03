import { test } from 'node:test'
import assert from 'node:assert/strict'
import { badgeUrl, skillEarned, norm, GAME_CATALOG, GEAR_BADGES, SKILL_CATALOG, NEWEST_BATCH, isNewSkill } from '../src/catalog.js'
import { PAST_GAMES } from './pastGames.js'

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

// Tanda "BARU" harus menempel ke batch bulanan terbaru saja. Kalau salah, seluruh katalog
// (yang mayoritas entrinya tanpa `since`) ikut ditandai baru.
test('isNewSkill: hanya batch terbaru, entri tanpa `since` tidak pernah baru', () => {
  const withSince = SKILL_CATALOG.filter((s) => s.since)
  assert.ok(withSince.length > 0, 'minimal satu badge menandai batch-nya')
  assert.equal(NEWEST_BATCH, withSince.map((s) => s.since).sort().at(-1))
  for (const s of SKILL_CATALOG) {
    if (!s.since) assert.equal(isNewSkill(s), false, `${s.name} tanpa since tidak boleh ditandai baru`)
    else assert.equal(isNewSkill(s), s.since === NEWEST_BATCH)
  }
})

test('isNewSkill: format `since` YYYY-MM supaya perbandingannya benar', () => {
  for (const s of SKILL_CATALOG.filter((x) => x.since)) assert.match(s.since, /^\d{4}-\d{2}$/, s.name)
})

test('badgeUrl: skill by name -> course template', () => {
  assert.equal(badgeUrl('Get Started with Pub/Sub'), 'https://www.skills.google/course_templates/728?utm_source=arcade-hub')
})

// Judul + game id berganti tiap bulan, jadi keduanya dibaca dari katalog. Yang diuji: judul resmi
// tiap game harus mendarat di entri game itu sendiri (bukan game lain, bukan course, bukan null).
test('badgeUrl: judul resmi game -> halaman game yang benar', () => {
  for (const g of GAME_CATALOG) {
    assert.equal(badgeUrl(g.title), `https://www.skills.google/games/${g.game}?utm_source=arcade-hub`, `judul "${g.title}"`)
  }
})

// Regex yang tidak cocok dengan judulnya sendiri = game itu TIDAK AKAN PERNAH terdeteksi selesai.
// Diam-diam, tanpa error: kartunya cuma terus menampilkan "Belum".
test('regex tiap game cocok dengan judul resminya sendiri', () => {
  for (const g of GAME_CATALOG) assert.ok(g.re.test(g.title), `regex ${g.re} tidak cocok dengan judulnya sendiri "${g.title}"`)
})

// Regex game yang terlalu longgar akan menyambar skill badge (mis. /network security/i vs badge
// "Designing Network Security in Google Cloud"), lalu badge itu salah di-link ke halaman game.
test('regex game tidak menyambar nama skill badge', () => {
  for (const s of SKILL_CATALOG) {
    const hit = GAME_CATALOG.find((g) => g.re.test(s.name))
    assert.equal(hit, undefined, `regex game "${hit?.short}" ikut cocok dengan skill badge "${s.name}"`)
  }
})

// Bug 3 Agu 2026: /base ?camp/i ikut cocok dengan "Arcade Base Camp July" yang tersimpan di profil,
// jadi game bulan lalu terbaca sebagai game bulan ini dan statusnya salah jadi "Selesai".
// Regex bulan berjalan wajib memuat penanda khas bulan ini.
test('regex game bulan ini tidak menyambar judul game bulan lalu', () => {
  for (const p of PAST_GAMES) {
    const hit = GAME_CATALOG.find((g) => g.re.test(p.name))
    assert.equal(hit, undefined, `regex game "${hit?.short}" ikut cocok dengan game terdahulu "${p.name}"`)
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
