import { createHash } from 'node:crypto'

// Utilitas backup dan migrasi database: menormalkan nilai, menghitung sidik jari, membandingkan
// dua dump, dan menyusun statement INSERT.
//
// Semuanya MURNI supaya bisa dites tanpa database. Bagian inilah yang membuat klaim
// "tidak ada yang tertinggal" bisa dipercaya: kalau penormalamannya salah, sidik jari dua sisi
// akan sama-sama salah dan verifikasinya lolos padahal datanya beda.

const ISO_DETIK = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/

// Normalkan satu nilai supaya bisa dibandingkan lintas mesin dan lintas tipe penyimpanan.
//
// `dataType` adalah tipe kolom menurut information_schema (mis. 'date', 'timestamp with time
// zone'), dan itu WAJIB dikirim karena driver bisa mengembalikan kolom `date` sebagai Date
// (tengah malam UTC) atau sebagai string, sedangkan di Turso kolom itu disimpan sebagai TEXT
// 'YYYY-MM-DD'. Tanpa tipe, dua bentuk itu tidak akan pernah cocok.
//
// Presisi DETIK itu sengaja, bukan karena malas: Turso menyimpan waktu lewat
// strftime('%Y-%m-%dT%H:%M:%SZ'), sedangkan Postgres menyimpan mikrodetik. Memotong keduanya
// ke detik membuat perbandingannya jujur (sub-detik memang hilang saat migrasi), bukan gagal
// hanya karena selisih .123456.
export function normalizeValue(v, dataType) {
  if (v === null || v === undefined) return null
  if (dataType === 'date') {
    const s = v instanceof Date ? v.toISOString() : String(v)
    return s.slice(0, 10)
  }
  if (v instanceof Date) return v.toISOString().slice(0, 19) + 'Z'
  if (typeof v === 'bigint') return Number(v)
  if (typeof v === 'string' && ISO_DETIK.test(v)) return v.slice(0, 19) + 'Z'
  return v
}

// Baris dengan kunci urut abjad, supaya urutan kunci di JSON tidak mempengaruhi sidik jari.
// `types` = { namaKolom: dataType }.
export function canonicalRow(row, types = {}) {
  const out = {}
  for (const k of Object.keys(row).sort()) out[k] = normalizeValue(row[k], types[k])
  return out
}

// Sidik jari satu tabel. Baris diurutkan sebagai string JSON, jadi urutan asli baris dari
// database tidak berpengaruh. Semua tabel yang kita punya punya kunci unik, jadi urutan ini
// total dan stabil.
export function tableSignature(rows, types = {}) {
  const baris = (rows || []).map((r) => JSON.stringify(canonicalRow(r, types))).sort()
  return createHash('sha256').update(baris.join('\n')).digest('hex')
}

// Sidik jari seluruh dump, dari sidik jari tiap tabel yang diurutkan menurut nama tabel.
export function dumpSignature(tables) {
  const bagian = Object.keys(tables).sort().map((t) => `${t}:${tables[t].signature}`)
  return createHash('sha256').update(bagian.join('\n')).digest('hex')
}

const typesOf = (columns) => Object.fromEntries(columns.map((c) => [c.name, c.dataType]))

// Bangun meta dump: jumlah baris, nama kolom, tipe, dan sidik jari per tabel.
// `tables` = { nama: { columns: [{name, dataType}], rows: [...] } }.
export function summarize(tables, at, source) {
  const out = {}
  for (const name of Object.keys(tables).sort()) {
    const t = tables[name]
    out[name] = {
      rowCount: t.rows.length,
      columns: t.columns.map((c) => c.name),
      types: typesOf(t.columns),
      signature: tableSignature(t.rows, typesOf(t.columns)),
    }
  }
  return { at, source, tables: out, signature: dumpSignature(out) }
}

// Bandingkan dump sumber (hasil backup) dengan isi tujuan. Mengembalikan daftar masalah;
// daftar kosong berarti tidak ada yang tertinggal.
//
// `expected.tables[nama]` = { columns: [namaKolom], types: {kolom: dataType}, rows: [...] }
// `actual.tables[nama]`   = bentuk yang sama, dibaca dari database tujuan.
export function compareDumps(expected, actual) {
  const masalah = []
  for (const name of Object.keys(expected.tables).sort()) {
    const exp = expected.tables[name]
    const act = actual.tables[name]
    if (!act) { masalah.push({ table: name, problem: 'tabel tidak ada di tujuan' }); continue }

    const kurang = exp.columns.filter((c) => !act.columns.includes(c))
    if (kurang.length) masalah.push({ table: name, problem: 'kolom hilang', detail: kurang.join(', ') })
    const lebih = act.columns.filter((c) => !exp.columns.includes(c))
    if (lebih.length) masalah.push({ table: name, problem: 'kolom tak terduga', detail: lebih.join(', ') })

    if (exp.rows.length !== act.rows.length) {
      masalah.push({ table: name, problem: 'jumlah baris beda', detail: `${exp.rows.length} vs ${act.rows.length}` })
    }
    // Tipe dari sisi SUMBER dipakai untuk keduanya, supaya perbandingannya setara.
    const sa = tableSignature(exp.rows, exp.types)
    const sb = tableSignature(act.rows, exp.types)
    if (sa !== sb) masalah.push({ table: name, problem: 'sidik jari beda', detail: `${sa.slice(0, 12)} vs ${sb.slice(0, 12)}` })
  }
  for (const name of Object.keys(actual.tables).sort()) {
    if (!expected.tables[name]) masalah.push({ table: name, problem: 'tabel tak terduga di tujuan' })
  }
  return masalah
}

// Statement INSERT OR REPLACE untuk satu tabel. `columns` = [{name, dataType}], nilainya lewat
// placeholder, nama tabel dan kolom dikutip ganda.
//
// Catatan urutan: pemanggil WAJIB memuat `members` sebelum `point_history`. INSERT OR REPLACE
// yang menggantikan baris induk bisa memicu ON DELETE CASCADE kalau foreign_keys menyala, dan
// point_history adalah anaknya. Di database tujuan yang masih kosong ini tidak terjadi, tapi
// urutannya tetap dijaga supaya aman juga saat dijalankan ulang.
export function insertStatements(table, columns, rows) {
  const names = columns.map((c) => `"${c.name}"`).join(', ')
  const marks = columns.map(() => '?').join(', ')
  const sql = `INSERT OR REPLACE INTO "${table}" (${names}) VALUES (${marks})`
  return (rows || []).map((r) => ({
    sql,
    args: columns.map((c) => normalizeValue(r[c.name], c.dataType)),
  }))
}

// CREATE TABLE sederhana untuk tabel yang TIDAK dikenal aplikasi, dipakai supaya tabel
// tak terduga dari database lama tidak hilang begitu saja. Sengaja tanpa PRIMARY KEY, UNIQUE,
// dan DEFAULT karena tujuannya cuma menyelamatkan isinya, bukan meniru skemanya.
export function createStatementFor(table, columns) {
  const defs = columns.map((c) => `  "${c.name}" ${sqliteType(c.dataType)}`).join(',\n')
  return `CREATE TABLE IF NOT EXISTS "${table}" (\n${defs}\n)`
}

export function sqliteType(dataType) {
  const t = String(dataType || '').toLowerCase()
  if (/^(smallint|integer|bigint)$/.test(t)) return 'INTEGER'
  if (/^(numeric|real|double precision|decimal)$/.test(t)) return 'REAL'
  if (/^boolean$/.test(t)) return 'INTEGER'
  return 'TEXT'
}
