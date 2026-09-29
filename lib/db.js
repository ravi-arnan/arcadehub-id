import { createClient } from '@libsql/client/web'
import { toStatement } from './sqlTag.js'
import { CREATE_STATEMENTS, missingDdl } from './schema.js'

// Turso (libSQL/SQLite), bukan Postgres lagi. Dua hal yang sengaja dipilih dan gampang
// "diperbaiki" jadi salah:
//
// 1. Import-nya '@libsql/client/web', BUKAN '@libsql/client'. Dokumentasi integrasi Vercel
//    milik Turso menyebut eksplisit: entry point biasa memakai transport WebSocket Node,
//    sedangkan /web memakai HTTP dan itulah yang cocok untuk runtime serverless.
// 2. Nama env var SENGAJA tidak berakhiran *_DATABASE_URL. Versi Postgres dulu mencari koneksi
//    dengan memindai env apa pun yang berakhiran itu; kalau nama Turso ikut memakai akhiran
//    tersebut, sisa var Neon dari integrasi Vercel bisa diam-diam ikut terbaca dan errornya
//    akan menyesatkan.

function tursoConfig() {
  const url = process.env.TURSO_DATABASE_URL
  if (!url) throw new Error('Database belum terkonfigurasi (TURSO_DATABASE_URL kosong).')
  return { url, authToken: process.env.TURSO_AUTH_TOKEN }
}

let _client
export function getClient() {
  if (!_client) _client = createClient(tursoConfig())
  return _client
}

// Mengembalikan Promise berisi array baris, bentuknya sengaja dibuat sama seperti neon():
//   const rows = await sql`SELECT ... WHERE id = ${id}`
// Barisnya objek berkunci nama kolom (bukan array nilai), jadi `rows[0].cnt` tetap sah.
export function sql(strings, ...values) {
  return getClient().execute(toStatement(strings, values)).then((r) => r.rows)
}

// Satu statement yang BELUM dijalankan, untuk dirangkai lewat batch().
export function stmt(strings, ...values) {
  return toStatement(strings, values)
}

// Beberapa statement dalam SATU transaksi (client.batch memakai BEGIN IMMEDIATE); satu gagal,
// semuanya di-rollback. Dipakai api/leave.js dan api/remove.js supaya penghapusan members dan
// point_history-nya tidak bisa berhenti setengah jalan.
export function batch(...statements) {
  return getClient().batch(statements, 'write')
}

// SQL mentah tanpa parameter, hanya untuk CREATE/ALTER yang kita tulis sendiri di lib/schema.js.
function exec(sqlText) {
  return getClient().execute(sqlText)
}

let ready
// Memastikan tabel dan kolomnya ada, lalu mengembalikan tag `sql`.
//
// Versi Postgres menjalankan 11 statement DDL tiap cold start. Sekarang: 4 CREATE yang idempoten,
// satu SELECT ke pragma_table_info, dan ALTER hanya untuk kolom yang benar-benar kurang.
//
// Kalau file ini salah, SELURUH endpoint mati, bukan satu fitur. Sesudah mengubahnya, verifikasi
// dengan `curl /api/leaderboard` (200 berarti skema jalan).
export async function ensureSchema() {
  if (!ready) {
    ready = (async () => {
      for (const ddl of CREATE_STATEMENTS) await exec(ddl)
      const cols = await sql`SELECT name FROM pragma_table_info('members')`
      for (const ddl of missingDdl(cols.map((r) => r.name))) await exec(ddl)
    })()
  }
  await ready
  return sql
}
