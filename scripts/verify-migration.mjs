// Bandingkan hasil backup (sumber kebenaran, diambil dari Neon) dengan isi Turso.
//
//   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... node scripts/verify-migration.mjs --in ../db-backup/2026-10-01
//
// Keluar exit 1 kalau ada satu saja yang beda. Ini gerbang "tidak ada yang tertinggal":
// yang dibandingkan bukan cuma jumlah baris, tapi juga himpunan kolom dan sidik jari sha256
// dari seluruh isi tabel.
//
// Yang dibandingkan adalah DUMP, bukan Neon yang hidup. Alasannya: dump itu beku, jadi hasil
// verifikasinya tidak ikut berubah kalau ada yang menulis ke Neon di antara backup dan
// migrasi. Yang kita pedulikan adalah "isinya sudah pindah utuh", bukan "Neon dan Turso sama
// pada detik ini".
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ensureSchema, getClient } from '../lib/db.js'
import { compareDumps } from '../lib/dump.js'

const argv = process.argv.slice(2)
const i = argv.indexOf('--in')
const dir = i >= 0 ? argv[i + 1] : null
if (!dir) {
  console.error('Wajib: --in <dir backup>. Contoh: node scripts/verify-migration.mjs --in ../db-backup/2026-10-01')
  process.exit(2)
}

const meta = JSON.parse(readFileSync(join(dir, 'meta.json'), 'utf8'))

// Sisi sumber: yang diharapkan ada di tujuan.
const expected = { tables: {} }
for (const [nama, info] of Object.entries(meta.tables)) {
  const d = JSON.parse(readFileSync(join(dir, `${nama}.json`), 'utf8'))
  expected.tables[nama] = { columns: info.columns, types: info.types, rows: d.rows }
}

await ensureSchema()
const client = getClient()

const IDENT = /^[a-z_][a-z0-9_]*$/
const tabel = (await client.execute("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'")).rows

// Sisi tujuan: dibaca langsung dari Turso, memakai tipe kolom dari sumber supaya
// perbandingannya setara (kolom `date` dan timestamp dinormalkan dengan aturan yang sama).
const actual = { tables: {} }
for (const { name } of tabel) {
  if (!IDENT.test(name)) continue
  const kolom = (await client.execute(`SELECT name FROM pragma_table_info('${name}')`)).rows.map((r) => r.name)
  const rows = (await client.execute(`SELECT * FROM "${name}"`)).rows
  actual.tables[name] = { columns: kolom, types: meta.tables[name]?.types || {}, rows }
}

const masalah = compareDumps(expected, actual)

for (const nama of Object.keys(expected.tables).sort()) {
  const exp = expected.tables[nama]
  const act = actual.tables[nama]
  const status = aktual(masalah, nama) ? 'FAIL' : 'PASS'
  console.log(`  ${status}  ${nama.padEnd(16)} ${String(exp.rows.length).padStart(6)} baris (tujuan ${act ? act.rows.length : 'tidak ada'})`)
}
console.log(`\nsidik jari dump sumber: ${meta.signature}`)

function aktual(daftar, nama) {
  return daftar.some((m) => m.table === nama)
}

if (!masalah.length) {
  console.log('SEMUA PASS. Tidak ada yang tertinggal.')
  process.exit(0)
}

console.error('')
for (const m of masalah) console.error(`FAIL ${m.table}: ${m.problem}${m.detail ? ` (${m.detail})` : ''}`)
console.error(`\n${masalah.length} masalah. JANGAN cutover sebelum bersih.`)
process.exit(1)
