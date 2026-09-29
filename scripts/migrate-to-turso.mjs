// Muat hasil backup Neon ke Turso.
//
//   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... node scripts/migrate-to-turso.mjs --in ../db-backup/2026-10-01
//
// Skema tujuan dibuat oleh ensureSchema() aplikasi, BUKAN ditiru dari tipe Postgres, supaya yang
// dipakai nanti benar-benar sama dengan yang diharapkan kode. Skrip ini hanya memindahkan isi.
//
// Isi baris tidak pernah dicetak ke stdout, hanya jumlahnya (ada nama peserta di dalamnya).
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { ensureSchema, getClient, batch } from '../lib/db.js'
import { insertStatements, createStatementFor } from '../lib/dump.js'

const BATCH = 200

// members DULU. point_history mereferensikannya, jadi urutan ini wajib supaya tetap benar
// kalau foreign_keys menyala (INSERT OR REPLACE yang menggantikan baris induk bisa memicu
// ON DELETE CASCADE).
const URUTAN = ['members', 'point_history', 'rate_limits', 'feedback']

const argv = process.argv.slice(2)
const i = argv.indexOf('--in')
const dir = i >= 0 ? argv[i + 1] : null
if (!dir) {
  console.error('Wajib: --in <dir backup>. Contoh: node scripts/migrate-to-turso.mjs --in ../db-backup/2026-10-01')
  process.exit(2)
}

const berkas = readdirSync(dir).filter((f) => f.endsWith('.json') && f !== 'meta.json').map((f) => f.replace(/\.json$/, ''))
if (!berkas.length) {
  console.error(`Tidak ada berkas tabel di ${dir}. Jalankan backup-neon.mjs dulu.`)
  process.exit(1)
}

// Tabel yang kita kenal dulu (menurut URUTAN), sisanya di akhir menurut abjad.
const dikenal = URUTAN.filter((t) => berkas.includes(t))
const lain = berkas.filter((t) => !URUTAN.includes(t)).sort()

await ensureSchema()
const client = getClient()

for (const nama of lain) {
  const d = JSON.parse(readFileSync(join(dir, `${nama}.json`), 'utf8'))
  await client.execute(createStatementFor(nama, d.columns))
  console.log(`Tabel di luar aplikasi, dibuat apa adanya (tanpa PRIMARY KEY/UNIQUE): ${nama}`)
}

let total = 0
for (const nama of [...dikenal, ...lain]) {
  const d = JSON.parse(readFileSync(join(dir, `${nama}.json`), 'utf8'))
  const stmts = insertStatements(nama, d.columns, d.rows)
  for (let n = 0; n < stmts.length; n += BATCH) {
    await batch(...stmts.slice(n, n + BATCH))
  }
  total += stmts.length
  console.log(`  ${nama.padEnd(16)} ${String(stmts.length).padStart(6)} baris`)
}
console.log(`\nSelesai: ${total} baris dimuat.`)
console.log('Langkah berikutnya WAJIB: jalankan scripts/verify-migration.mjs. Jangan anggap selesai')
console.log('sebelum skrip itu keluar exit 0.')
