import { test } from 'node:test'
import assert from 'node:assert/strict'
import { badgeUrl, skillEarned, completionEarned, norm, GAME_CATALOG, GEAR_BADGES, SKILL_CATALOG, COMPLETION_CATALOG, NEWEST_BATCH, isNewSkill } from '../src/catalog.js'
import { PAST_GAMES } from './pastGames.js'
import { categorize } from './parseProfile.js'

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

// Bug 4 Agu 2026: game spesial Agustus judulnya cuma "Spans and Plans", tanpa kata "Arcade",
// jadi pola generik di parseProfile melewatkannya dan badge itu terhitung 0,5 poin sebagai badge
// keahlian, bukan 1 poin game, sekaligus tidak mengisi syarat game milestone. Gagalnya diam-diam:
// tidak ada error, angkanya cuma kurang. Tes ini menangkap judul game yang tidak dikenali.
test('tiap game bulan ini terbaca sebagai game, bukan badge keahlian', () => {
  for (const g of GAME_CATALOG) {
    assert.notEqual(categorize(g.title), 'skill', `game "${g.title}" terbaca sebagai badge keahlian`)
  }
})

// Game terdahulu tetap menyumbang poin Season, dan sebagian bernilai 2-3 poin. Kalau judulnya
// terbaca sebagai badge keahlian, bobot itu hilang tanpa jejak.
test('tiap game terdahulu terbaca sebagai game, termasuk judul aliasnya', () => {
  for (const p of PAST_GAMES) {
    for (const t of [p.name, ...[].concat(p.alt || [])]) {
      assert.notEqual(categorize(t), 'skill', `game terdahulu "${t}" terbaca sebagai badge keahlian`)
    }
  }
})

// Arah sebaliknya, dan ini yang tadinya bocor: pola /\barcade\b/ polos menyambar completion badge
// 1467 "AI Boost Bites: Create Your Own Retro Arcade Game", jadi course 10 menit itu terhitung
// 1 poin game DAN mengisi satu slot game milestone. Tidak boleh ada judul course yang terbaca game.
test('tidak ada badge katalog yang salah terbaca sebagai game', () => {
  for (const s of SKILL_CATALOG) assert.equal(categorize(s.name), 'skill', `skill badge "${s.name}"`)
  for (const c of COMPLETION_CATALOG) assert.equal(categorize(c.name), 'skill', `completion badge "${c.name}"`)
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

// --- completion badge ---

// File ini dibuat generator. Kalau generatornya rusak (paginasi berubah, endpoint balas HTML),
// gejalanya adalah katalog yang menciut diam-diam, bukan error. Ambang bawah menangkap itu.
test('COMPLETION_CATALOG: jumlah masuk akal + tiap entri lengkap', () => {
  assert.ok(COMPLETION_CATALOG.length > 400, `cuma ${COMPLETION_CATALOG.length} entri, generator kemungkinan cuma dapat sebagian`)
  for (const c of COMPLETION_CATALOG) {
    assert.ok(Number.isInteger(c.id) && c.id > 0, `id tidak valid: ${JSON.stringify(c)}`)
    assert.ok(c.name && c.name === c.name.trim(), `nama kosong atau ada spasi tepi: ${JSON.stringify(c)}`)
    assert.ok(Number.isInteger(c.min) && c.min >= 0, `durasi tidak valid: ${JSON.stringify(c)}`)
  }
})

test('COMPLETION_CATALOG: id unik', () => {
  assert.equal(new Set(COMPLETION_CATALOG.map((c) => c.id)).size, COMPLETION_CATALOG.length)
})

// Satu course id tidak boleh muncul di dua katalog: kartunya akan dobel dan hitungan
// "{selesai}/{total}" di header ikut salah.
test('COMPLETION_CATALOG tidak tumpang tindih dengan SKILL_CATALOG', () => {
  const skillIds = new Set(SKILL_CATALOG.map((s) => s.id))
  const skillNames = new Set(SKILL_CATALOG.map((s) => norm(s.name)))
  for (const c of COMPLETION_CATALOG) {
    assert.ok(!skillIds.has(c.id), `id ${c.id} ada di dua katalog: ${c.name}`)
    assert.ok(!skillNames.has(norm(c.name)), `nama ada di dua katalog: ${c.name}`)
  }
})

// Regex game yang terlalu longgar akan menyambar completion badge, lalu badge itu salah
// di-link ke halaman game (masalah yang sama seperti pada skill badge).
test('regex game tidak menyambar nama completion badge', () => {
  for (const c of COMPLETION_CATALOG) {
    const hit = GAME_CATALOG.find((g) => g.re.test(c.name))
    assert.equal(hit, undefined, `regex game "${hit?.short}" ikut cocok dengan completion badge "${c.name}"`)
  }
})

// Diurutkan dari yang paling singkat: itu satu-satunya pembeda yang berguna antar completion
// badge (poinnya sama rata), dan katalog memang menampilkannya apa adanya tanpa sorting ulang.
test('COMPLETION_CATALOG urut dari durasi terpendek', () => {
  for (let i = 1; i < COMPLETION_CATALOG.length; i++) {
    assert.ok(COMPLETION_CATALOG[i - 1].min <= COMPLETION_CATALOG[i].min, `urutan rusak di indeks ${i}`)
  }
})

test('badgeUrl: completion badge -> course template', () => {
  const c = COMPLETION_CATALOG[0]
  assert.equal(badgeUrl(c.name), `https://www.skills.google/course_templates/${c.id}?utm_source=arcade-hub`)
})

test('completionEarned: cocokkan nama yang sudah dinormalisasi', () => {
  const name = COMPLETION_CATALOG[0].name
  assert.equal(completionEarned(name, new Set([norm(name)])), true)
  assert.equal(completionEarned(name, new Set([norm('Sesuatu Lain')])), false)
})
