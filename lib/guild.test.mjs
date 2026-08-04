import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DEFAULT_GUILD, guildKey, guildLabel } from './guild.js'

test('guildKey: kosong, null, dan undefined jatuh ke UMUM', () => {
  assert.equal(guildKey(''), DEFAULT_GUILD)
  assert.equal(guildKey(null), DEFAULT_GUILD)
  assert.equal(guildKey(undefined), DEFAULT_GUILD)
})

// api/join.js menyimpan kode guild dalam huruf besar (raw.toUpperCase()), sedangkan
// localStorage frontend menyimpan apa yang diketik peserta apa adanya. Tanpa normalisasi
// di sini, "guildmu" dari localStorage tidak akan pernah cocok dengan kode dari database.
test('guildKey: menyamakan huruf besar-kecil dengan yang disimpan backend', () => {
  assert.equal(guildKey('mygUiLd'), 'MYGUILD')
  assert.equal(guildKey('MYGUILD'), 'MYGUILD')
})

test('guildKey: spasi di tepi dibuang', () => {
  assert.equal(guildKey('  tim-a  '), 'TIM-A')
  assert.equal(guildKey('   '), DEFAULT_GUILD)
})

test('guildLabel: UMUM ditampilkan sebagai Umum, apa pun kapitalisasinya', () => {
  assert.equal(guildLabel('UMUM'), 'Umum')
  assert.equal(guildLabel('umum'), 'Umum')
  assert.equal(guildLabel(''), 'Umum')
  assert.equal(guildLabel(null), 'Umum')
})

test('guildLabel: guild biasa tampil sebagai kode ternormalisasi', () => {
  assert.equal(guildLabel('tim-a'), 'TIM-A')
  assert.equal(guildLabel(' TIM-A '), 'TIM-A')
})
