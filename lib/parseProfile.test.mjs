import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseProfile, computePoints, categorize } from './parseProfile.js'

// Badge di HTML profil: <span class=ql-title-medium>Judul</span><span class=ql-body-medium>Earned <tanggal></span>
const badge = (title, date) =>
  `<span class="ql-title-medium">${title}</span><span class="ql-body-medium">Earned ${date}</span>`
const page = (name, badges) =>
  `<h1 class="ql-display-small">${name}</h1>${badges.join('')}`

test('parseProfile: ekstrak nama member dari h1', () => {
  assert.equal(parseProfile('<h1 class="ql-display-small">Budi Baru</h1>').name, 'Budi Baru')
})

test('parseProfile: profil privat/broken -> name null (dipakai gate fetchAndScore)', () => {
  assert.equal(parseProfile('<div>profile is private</div>').name, null)
})

test('parseProfile: parse judul + tanggal earned', () => {
  const { badges } = parseProfile(page('X', [badge('Get Started with Pub/Sub', 'Jul 12, 2026')]))
  assert.equal(badges.length, 1)
  assert.equal(badges[0].title, 'Get Started with Pub/Sub')
  assert.ok(badges[0].earned instanceof Date && !isNaN(badges[0].earned))
})

test('parseProfile: hari satu digit render dua spasi ("Jul  7") tetap terbaca', () => {
  const { badges } = parseProfile(page('X', [badge('Arcade Base Camp', 'Jul  7, 2026')]))
  assert.equal(badges.length, 1)
  assert.ok(!isNaN(badges[0].earned))
})

test('parseProfile: decode HTML entity di judul', () => {
  const { badges } = parseProfile(page('X', [badge('Store &amp; Process Data', 'Aug 1, 2026')]))
  assert.equal(badges[0].title, 'Store & Process Data')
})

test('computePoints: window Season vs Facil + klasifikasi game/skill', () => {
  const html = page('X', [
    badge('Arcade Base Camp', 'Jul 20, 2026'),            // game, dalam window facil
    badge('Get Started with Pub/Sub', 'Jul 12, 2026'),    // skill, season tapi PRA-facil (facil mulai 13 Jul)
    badge('Get Started with Cloud Storage', 'Aug 1, 2026'), // skill, facil
    badge('Old Skill Lab', 'Mar 1, 2025'),                // di luar 2026 -> diabaikan total
  ])
  const p = computePoints(parseProfile(html).badges)
  assert.equal(p.seasonGames, 1)   // Base Camp
  assert.equal(p.seasonSkills, 2)  // Pub/Sub + Cloud Storage (2025 diabaikan)
  assert.equal(p.facilGames, 1)    // Base Camp (Jul 20)
  assert.equal(p.facilSkills, 1)   // Cloud Storage (Aug 1); Pub/Sub Jul 12 pra-facil
})

// Game Jan-Jun 2026: trivia mingguan tidak memuat kata "Arcade"/"Trivia" di judul, dan game
// spesial bernilai >1 poin. Dua-duanya dulu salah hitung (jadi skill badge / 1 poin).
test('computePoints: game terdahulu -> klasifikasi game + bobot poin resmi', () => {
  const html = page('X', [
    badge('Sprint 1: February 2026', 'Feb 10, 2026'),      // game 1 poin (bukan skill)
    badge('Week 3: January 2026', 'Jan 20, 2026'),         // game 1 poin (bukan skill)
    badge('Arcade Skills Spawn', 'Apr 20, 2026'),          // game spesial 3 poin
    badge('Arcade Work- Life Refresh', 'Jan 15, 2026'),    // game spesial 2 poin
    badge('Arcade Base Camp June', 'Jun 5, 2026'),         // game biasa 1 poin
  ])
  const p = computePoints(parseProfile(html).badges)
  assert.equal(p.seasonSkills, 0)
  assert.equal(p.seasonGames, 5)
  assert.equal(p.seasonGamePoints, 8) // 1+1+3+2+1
})

test('computePoints: game bulan berjalan tetap 1 poin per game', () => {
  const p = computePoints(parseProfile(page('X', [badge('Arcade Voyage', 'Jul 20, 2026')])).badges)
  assert.equal(p.seasonGamePoints, 1)
})

test('categorize: game vs sub-tipe', () => {
  assert.equal(categorize('Get Started with Pub/Sub'), 'skill')
  assert.equal(categorize('Arcade Base Camp'), 'basecamp')
  assert.equal(categorize('Level 2: Foo'), 'level')
  assert.equal(categorize('The Arcade Trivia'), 'trivia')
})
