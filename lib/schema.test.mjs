import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CREATE_STATEMENTS, NOW, TODAY_JAKARTA, missingDdl } from './schema.js'

const ALL = ['facil_games', 'facil_skills', 'remove_token', 'last_earned', 'avatar']

test('kolom lengkap: tidak ada DDL yang perlu dijalankan', () => {
  assert.deepEqual(missingDdl(ALL), [])
})

test('tabel belum ada: lima ALTER, semuanya unik', () => {
  const ddl = missingDdl([])
  assert.equal(ddl.length, 5)
  assert.equal(new Set(ddl).size, 5)
})

test('hanya kolom yang kurang yang di-ALTER', () => {
  const ddl = missingDdl(['facil_games'])
  assert.equal(ddl.length, 4)
  assert.ok(ddl.every((s) => s.startsWith('ALTER TABLE members ADD COLUMN ')))
  assert.ok(!ddl.join(' ').includes('facil_games'))
})

test('ALTER tidak memakai IF NOT EXISTS, tidak ada di SQLite', () => {
  assert.ok(missingDdl([]).every((s) => !/IF NOT EXISTS/i.test(s)))
})

test('CREATE: UNIQUE profile_url inline, tanpa ALTER ADD CONSTRAINT', () => {
  const ddl = CREATE_STATEMENTS.join('\n')
  assert.match(ddl, /profile_url\s+TEXT NOT NULL UNIQUE/)
  assert.ok(!/ADD CONSTRAINT/i.test(ddl))
})

test('empat tabel dibuat, semuanya IF NOT EXISTS', () => {
  assert.equal(CREATE_STATEMENTS.length, 4)
  assert.ok(CREATE_STATEMENTS.every((s) => /^CREATE TABLE IF NOT EXISTS/.test(s)))
  for (const t of ['members', 'point_history', 'rate_limits', 'feedback']) {
    assert.ok(CREATE_STATEMENTS.some((s) => s.includes(` ${t} (`)), `tabel ${t} hilang`)
  }
})

test('timestamp default berupa ISO-8601 UTC, bukan datetime() lokal', () => {
  const ddl = CREATE_STATEMENTS.join('\n')
  assert.ok(ddl.includes("strftime('%Y-%m-%dT%H:%M:%SZ','now')"))
  assert.ok(!/DEFAULT now\(\)/.test(ddl))
})

test('potongan waktu berupa raw, bukan parameter biasa', () => {
  assert.equal(NOW.rawSql, "strftime('%Y-%m-%dT%H:%M:%SZ','now')")
  assert.equal(TODAY_JAKARTA.rawSql, "date('now','+7 hours')")
})
