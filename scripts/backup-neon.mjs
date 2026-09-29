// Backup penuh database Neon ke JSON. READ-ONLY: tidak ada INSERT, UPDATE, atau DELETE.
//
// Cara pakai:
//   NEON_DATABASE_URL="postgres://..." node scripts/backup-neon.mjs --out ~/Projects/gcaf-facilitator-2026/db-backup/2026-10-01
//
// `--out` WAJIB dan sengaja tidak punya nilai default: isinya nama peserta dan masukan
// pengguna, sedangkan folder repo ini publik (MIT). Jangan arahkan ke dalam tracker-web/.
//
// Tabelnya ditemukan dari information_schema, BUKAN didaftar tangan. Itu satu-satunya cara
// jujur menjamin tidak ada tabel yang tertinggal, dan itu inti dari permintaannya Ravi.
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { neon } from '@neondatabase/serverless'
import { summarize } from '../lib/dump.js'

const argv = process.argv.slice(2)
const arg = (nama) => {
  const i = argv.indexOf(`--${nama}`)
  return i >= 0 ? argv[i + 1] : null
}

const out = arg('out')
if (!out) {
  console.error('Wajib: --out <dir>. Contoh: node scripts/backup-neon.mjs --out ../db-backup/2026-10-01')
  process.exit(2)
}
// Nama env var-nya TIDAK BISA ditebak. Integrasi Neon di Vercel bisa menamainya DATABASE_URL,
// POSTGRES_URL, STORAGE_DATABASE_URL, atau varian berawalan lain, dan itu sebabnya versi
// Postgres di lib/db.js dulu memindai semuanya. Pemindaian yang sama dipertahankan di sini,
// kalau tidak skripnya cuma akan gagal dengan "env kosong" padahal isinya ada.
function findConn() {
  const e = process.env
  for (const nama of ['NEON_DATABASE_URL', 'DATABASE_URL', 'POSTGRES_URL']) {
    if (e[nama]) return { nama, conn: e[nama] }
  }
  const keys = Object.keys(e).filter((k) => e[k])
  const pooled = keys.find((k) => /(^|_)(DATABASE_URL|POSTGRES_URL)$/.test(k) && !/UNPOOLED|NON_POOLING/.test(k))
  if (pooled) return { nama: pooled, conn: e[pooled] }
  const apa = keys.find((k) => /(^|_)(DATABASE_URL|POSTGRES_URL)/.test(k))
  return apa ? { nama: apa, conn: e[apa] } : null
}

const ketemu = findConn()
if (!ketemu) {
  console.error('Tidak ada env var koneksi Postgres. Jalankan dengan --env-file, mis:')
  console.error('  node --env-file=.env.local scripts/backup-neon.mjs --out ../db-backup/2026-10-01')
  process.exit(2)
}
// Yang dicetak cuma NAMANYA, tidak pernah nilainya.
console.log(`Koneksi dibaca dari env var: ${ketemu.nama}`)
const conn = ketemu.conn

const sql = neon(conn)
if (typeof sql.unsafe !== 'function') {
  console.error('Driver Neon tidak punya .unsafe(); versi @neondatabase/serverless-nya tidak sesuai.')
  process.exit(2)
}

// Nama tabel dan kolom datang dari database dan tidak bisa lewat placeholder, jadi disaring
// ketat. Nama yang tidak lolos berarti ada yang tidak wajar, dan kita berhenti daripada
// menyusun SQL dari string yang belum diperiksa.
const IDENT = /^[a-z_][a-z0-9_]*$/
const ident = (nama) => {
  if (!IDENT.test(nama)) throw new Error(`Nama identifier tidak wajar: ${nama}`)
  return `"${nama}"`
}

const daftar = await sql`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  ORDER BY table_name`
if (!daftar.length) {
  console.error('Tidak ada tabel di schema public. Ada yang salah, jangan lanjut.')
  process.exit(1)
}

mkdirSync(out, { recursive: true })
const dump = {}
for (const { table_name: nama } of daftar) {
  const kolom = await sql`
    SELECT column_name, data_type FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = ${nama}
    ORDER BY ordinal_position`
  const rows = await sql.unsafe(`SELECT * FROM ${ident(nama)}`)
  dump[nama] = { columns: kolom.map((k) => ({ name: k.column_name, dataType: k.data_type })), rows }
  writeFileSync(join(out, `${nama}.json`), JSON.stringify(dump[nama]))
}

const meta = summarize(dump, new Date().toISOString(), 'neon')
writeFileSync(join(out, 'meta.json'), JSON.stringify(meta, null, 2))

// HANYA jumlah yang dicetak, tidak pernah isi barisnya (ada nama peserta di sana).
console.log(`Backup ke ${out}`)
for (const [nama, info] of Object.entries(meta.tables)) {
  console.log(`  ${nama.padEnd(16)} ${String(info.rowCount).padStart(6)} baris   ${info.signature.slice(0, 12)}`)
}
console.log(`  sidik jari seluruh dump: ${meta.signature}`)
console.log('')
console.log('Bandingkan daftar tabel di atas dengan dashboard Neon. Kalau ada tabel di dashboard')
console.log('yang tidak muncul di sini, backup-nya belum lengkap: jangan lanjut ke migrasi.')
