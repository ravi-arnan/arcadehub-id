import { raw } from './sqlTag.js'

// Skema Turso (libSQL/SQLite). Ditulis di satu tempat karena bedanya dengan Postgres gampang
// menjebak, dan kalau file ini salah SELURUH endpoint mati, bukan cuma satu fitur:
//
// 1. Tidak ada `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`. Kolom yang dulu ditambahkan
//    belakangan dideteksi lewat pragma_table_info lebih dulu, baru di-ALTER yang kurang.
// 2. UNIQUE harus inline di CREATE TABLE, tidak bisa `ALTER TABLE ... ADD CONSTRAINT`.
// 3. Tidak ada timestamptz/date. Waktu disimpan TEXT ISO-8601 dengan akhiran Z, tanggal
//    disimpan TEXT 'YYYY-MM-DD'. Akhiran Z itu WAJIB, bukan selera: src/utils/time.js `ago()`
//    memanggil new Date(t), dan "2026-09-29 14:00:00" diurai sebagai waktu LOKAL sehingga baris
//    yang baru saja disinkron tampil "8 jam lalu" di mesin WITA.
// 4. ON DELETE CASCADE butuh PRAGMA foreign_keys=ON per koneksi, dan lewat HTTP itu tidak
//    dijamin menempel. REFERENCES tetap ditulis sebagai dokumentasi, tapi point_history
//    dihapus eksplisit di api/leave.js dan api/remove.js. Syarat privasinya sama, sumbernya beda.

const isoNow = (modifier) => `strftime('%Y-%m-%dT%H:%M:%SZ','now'${modifier ? `,'${modifier}'` : ''})`

const NOW_SQL = isoNow()

// Dipakai di dalam tagged template `sql` sebagai ${NOW}; lihat lib/sqlTag.js kenapa harus lewat
// raw() dan tidak boleh masuk sebagai nilai biasa.
export const NOW = raw(NOW_SQL)
// Tanggal Asia/Jakarta, untuk point_history.day. Jakarta tidak punya DST, jadi +7 jam selalu
// benar. Pengganti (now() AT TIME ZONE 'Asia/Jakarta')::date.
export const TODAY_JAKARTA = raw("date('now','+7 hours')")
// Batas bucket rate limit lama. Pengganti `ts < now() - interval '10 minutes'`.
export const TEN_MINUTES_AGO = raw(isoNow('-10 minutes'))

export const CREATE_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS members (
    id           TEXT PRIMARY KEY,
    guild        TEXT NOT NULL DEFAULT 'UMUM',
    name         TEXT NOT NULL,
    profile_url  TEXT NOT NULL UNIQUE,
    games        INTEGER NOT NULL DEFAULT 0,
    skills       INTEGER NOT NULL DEFAULT 0,
    facil_games  INTEGER NOT NULL DEFAULT 0,
    facil_skills INTEGER NOT NULL DEFAULT 0,
    base         INTEGER NOT NULL DEFAULT 0,
    mbonus       INTEGER NOT NULL DEFAULT 0,
    total        INTEGER NOT NULL DEFAULT 0,
    tier_idx     INTEGER NOT NULL DEFAULT -1,
    last_earned  TEXT,
    avatar       TEXT,
    remove_token TEXT,
    last_synced  TEXT NOT NULL DEFAULT (${NOW_SQL})
  )`,
  `CREATE TABLE IF NOT EXISTS point_history (
    member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    day       TEXT NOT NULL,
    total     INTEGER NOT NULL DEFAULT 0,
    games     INTEGER NOT NULL DEFAULT 0,
    skills    INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (member_id, day)
  )`,
  `CREATE TABLE IF NOT EXISTS rate_limits (
    k   TEXT PRIMARY KEY,
    cnt INTEGER NOT NULL DEFAULT 0,
    ts  TEXT NOT NULL DEFAULT (${NOW_SQL})
  )`,
  `CREATE TABLE IF NOT EXISTS feedback (
    id         TEXT PRIMARY KEY,
    message    TEXT NOT NULL,
    name       TEXT,
    page       TEXT,
    created_at TEXT NOT NULL DEFAULT (${NOW_SQL})
  )`,
]

// Kolom members yang ditambahkan setelah tabelnya pertama kali dibuat. Di Postgres dulu cukup
// `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`; SQLite tidak punya bentuk itu, jadi daftar ini
// dibandingkan dengan isi pragma_table_info('members') dan hanya yang kurang yang di-ALTER.
const LATER_COLUMNS = [
  ['facil_games', 'INTEGER NOT NULL DEFAULT 0'],
  ['facil_skills', 'INTEGER NOT NULL DEFAULT 0'],
  ['remove_token', 'TEXT'],
  ['last_earned', 'TEXT'],
  ['avatar', 'TEXT'],
]

export function missingDdl(existingColumns) {
  const have = new Set(existingColumns || [])
  return LATER_COLUMNS.filter(([name]) => !have.has(name))
    .map(([name, def]) => `ALTER TABLE members ADD COLUMN ${name} ${def}`)
}
