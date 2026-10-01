import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  normalizeValue, canonicalRow, tableSignature, dumpSignature, summarize,
  compareDumps, insertStatements, createStatementFor, sqliteType,
} from './dump.js'

const TS = { last_synced: 'timestamp with time zone', last_earned: 'date', total: 'integer' }

test('normalizeValue: Date jadi ISO detik dengan Z', () => {
  assert.equal(normalizeValue(new Date('2026-09-29T14:00:00.123Z')), '2026-09-29T14:00:00Z')
})

// Regresi: driver Neon mengembalikan kolom `date` sebagai Date tengah malam WAKTU LOKAL, dan
// setelah JSON round-trip bentuknya jadi string ISO dari instant yang sama. Versi lama memotong
// 10 karakter pertama, sehingga di mesin UTC+8 seluruh `last_earned` dan `point_history.day`
// mundur sehari. Semua nilai di bawah dibangun dari new Date(y, m, d), jadi tesnya tidak
// bergantung pada zona waktu mesin yang menjalankannya.
test('normalizeValue: kolom date jadi tanggal kalender lokal, bukan potongan UTC', () => {
  assert.equal(normalizeValue('2026-09-29', 'date'), '2026-09-29')
  assert.equal(normalizeValue(new Date(2026, 8, 29), 'date'), '2026-09-29')
  assert.equal(normalizeValue(new Date(2026, 8, 29).toISOString(), 'date'), '2026-09-29')
  assert.equal(normalizeValue(new Date(2026, 7, 30), 'date'), '2026-08-30')
  assert.equal(normalizeValue(new Date(2026, 0, 1).toISOString(), 'date'), '2026-01-01')
})

test('normalizeValue: mikrodetik dibuang supaya Postgres dan Turso setara', () => {
  assert.equal(normalizeValue('2026-09-29T14:00:00.123456Z'), '2026-09-29T14:00:00Z')
  assert.equal(normalizeValue('2026-09-29T14:00:00Z'), '2026-09-29T14:00:00Z')
})

test('normalizeValue: null, undefined, bigint, angka, dan teks biasa', () => {
  assert.equal(normalizeValue(null), null)
  assert.equal(normalizeValue(undefined), null)
  assert.equal(normalizeValue(42n), 42)
  assert.equal(normalizeValue(42), 42)
  assert.equal(normalizeValue('Budi'), 'Budi')
  assert.equal(normalizeValue(0), 0)
})

test('canonicalRow: urutan kunci tidak mempengaruhi hasil', () => {
  const a = canonicalRow({ b: 2, a: 1 }, {})
  const b = canonicalRow({ a: 1, b: 2 }, {})
  assert.deepEqual(Object.keys(a), ['a', 'b'])
  assert.deepEqual(a, b)
})

test('tableSignature: urutan baris tidak mempengaruhi hasil', () => {
  const baris = [{ id: 'a', total: 1 }, { id: 'b', total: 2 }]
  assert.equal(tableSignature(baris, {}), tableSignature([...baris].reverse(), {}))
})

test('tableSignature: nilai berbeda menghasilkan sidik jari berbeda', () => {
  assert.notEqual(tableSignature([{ id: 'a', total: 1 }], {}), tableSignature([{ id: 'a', total: 2 }], {}))
})

test('tableSignature: selisih sub-detik dianggap sama, sesuai presisi Turso', () => {
  const x = tableSignature([{ t: '2026-09-29T14:00:00.123456Z' }], {})
  const y = tableSignature([{ t: '2026-09-29T14:00:00Z' }], {})
  assert.equal(x, y)
})

test('tableSignature: Detik yang berbeda tetap terdeteksi', () => {
  assert.notEqual(tableSignature([{ t: '2026-09-29T14:00:00Z' }], {}), tableSignature([{ t: '2026-09-29T14:00:01Z' }], {}))
})

const DUMP = {
  members: {
    columns: [{ name: 'id', dataType: 'text' }, { name: 'last_synced', dataType: 'timestamp with time zone' }],
    rows: [{ id: 'a', last_synced: '2026-09-29T14:00:00.123Z' }, { id: 'b', last_synced: null }],
  },
  feedback: {
    columns: [{ name: 'id', dataType: 'text' }, { name: 'message', dataType: 'text' }],
    rows: [{ id: 'f1', message: 'halo' }],
  },
}

test('summarize: jumlah baris, kolom, dan sidik jari per tabel', () => {
  const meta = summarize(DUMP, '2026-09-29T14:00:00Z', 'neon')
  assert.equal(meta.source, 'neon')
  assert.equal(meta.tables.members.rowCount, 2)
  assert.deepEqual(meta.tables.members.columns, ['id', 'last_synced'])
  assert.equal(meta.tables.members.types.last_synced, 'timestamp with time zone')
  assert.match(meta.signature, /^[0-9a-f]{64}$/)
  assert.equal(Object.keys(meta.tables).join(','), 'feedback,members')
})

test('dumpSignature: berubah kalau satu tabel berubah', () => {
  const a = summarize(DUMP, 'x', 'neon')
  const ubah = { ...DUMP, feedback: { ...DUMP.feedback, rows: [{ id: 'f1', message: 'halo2' }] } }
  assert.notEqual(a.signature, summarize(ubah, 'x', 'neon').signature)
})

const sebagaiSumber = (dump) => {
  const meta = summarize(dump, 'x', 'neon')
  return {
    tables: Object.fromEntries(Object.keys(meta.tables).map((t) => [t, {
      columns: meta.tables[t].columns, types: meta.tables[t].types, rows: dump[t].rows,
    }])),
  }
}

test('compareDumps: dump yang sama tidak melaporkan masalah', () => {
  assert.deepEqual(compareDumps(sebagaiSumber(DUMP), sebagaiSumber(DUMP)), [])
})

test('compareDumps: beda mikrodetik saja tetap dianggap sama', () => {
  const lain = { ...DUMP, members: { ...DUMP.members, rows: [{ id: 'a', last_synced: '2026-09-29T14:00:00Z' }, { id: 'b', last_synced: null }] } }
  assert.deepEqual(compareDumps(sebagaiSumber(DUMP), sebagaiSumber(lain)), [])
})

test('compareDumps: baris kurang terdeteksi', () => {
  const kurang = { ...DUMP, members: { ...DUMP.members, rows: [DUMP.members.rows[0]] } }
  const masalah = compareDumps(sebagaiSumber(DUMP), sebagaiSumber(kurang))
  const jumlah = masalah.find((m) => m.problem === 'jumlah baris beda')
  assert.ok(jumlah, 'jumlah baris beda harus dilaporkan')
  assert.equal(jumlah.detail, '2 vs 1')
  // Sidik jarinya ikut berbeda, dan itu memang sinyal kedua yang terpisah: menghitung baris
  // saja tidak akan menangkap baris yang tertukar isinya.
  assert.ok(masalah.some((m) => m.problem === 'sidik jari beda'))
})

test('compareDumps: nilai berubah terdeteksi lewat sidik jari', () => {
  const ubah = { ...DUMP, members: { ...DUMP.members, rows: [{ id: 'a', last_synced: null }, { id: 'b', last_synced: null }] } }
  const masalah = compareDumps(sebagaiSumber(DUMP), sebagaiSumber(ubah))
  assert.deepEqual(masalah.map((m) => m.problem), ['sidik jari beda'])
})

test('compareDumps: tabel hilang dan kolom hilang terdeteksi', () => {
  const tanpaFeedback = { members: DUMP.members }
  let masalah = compareDumps(sebagaiSumber(DUMP), sebagaiSumber(tanpaFeedback))
  assert.ok(masalah.some((m) => m.problem === 'tabel tidak ada di tujuan' && m.table === 'feedback'))

  const kolomKurang = { ...DUMP, members: { ...DUMP.members, columns: [{ name: 'id', dataType: 'text' }], rows: [{ id: 'a' }, { id: 'b' }] } }
  masalah = compareDumps(sebagaiSumber(DUMP), sebagaiSumber(kolomKurang))
  assert.ok(masalah.some((m) => m.problem === 'kolom hilang' && m.detail === 'last_synced'))
})

test('compareDumps: tabel tak terduga di tujuan dilaporkan', () => {
  const lebih = { ...DUMP, tabelBaru: { columns: [{ name: 'x', dataType: 'text' }], rows: [{ x: '1' }] } }
  const masalah = compareDumps(sebagaiSumber(DUMP), sebagaiSumber(lebih))
  assert.ok(masalah.some((m) => m.problem === 'tabel tak terduga di tujuan'))
})

test('insertStatements: bentuk SQL, kutip ganda, dan nilai ternormalkan', () => {
  const s = insertStatements('members', [
    { name: 'id', dataType: 'text' },
    { name: 'last_synced', dataType: 'timestamp with time zone' },
    { name: 'last_earned', dataType: 'date' },
  ], [{ id: 'a', last_synced: new Date('2026-09-29T14:00:00.123Z'), last_earned: '2026-09-01' }])
  assert.equal(s.length, 1)
  assert.equal(s[0].sql, 'INSERT OR REPLACE INTO "members" ("id", "last_synced", "last_earned") VALUES (?, ?, ?)')
  assert.deepEqual(s[0].args, ['a', '2026-09-29T14:00:00Z', '2026-09-01'])
})

test('insertStatements: undefined dan null jadi null, bukan dibiarkan hilang', () => {
  const s = insertStatements('t', [{ name: 'a', dataType: 'text' }, { name: 'b', dataType: 'text' }], [{ a: undefined }])
  assert.deepEqual(s[0].args, [null, null])
})

test('sqliteType: pemetaan tipe Postgres ke SQLite', () => {
  assert.equal(sqliteType('integer'), 'INTEGER')
  assert.equal(sqliteType('bigint'), 'INTEGER')
  assert.equal(sqliteType('boolean'), 'INTEGER')
  assert.equal(sqliteType('numeric'), 'REAL')
  assert.equal(sqliteType('double precision'), 'REAL')
  assert.equal(sqliteType('text'), 'TEXT')
  assert.equal(sqliteType('timestamp with time zone'), 'TEXT')
})

test('createStatementFor: tabel tak terduga tetap dibuatkan', () => {
  const sql = createStatementFor('catatan_lama', [{ name: 'id', dataType: 'text' }, { name: 'n', dataType: 'integer' }])
  assert.match(sql, /CREATE TABLE IF NOT EXISTS "catatan_lama"/)
  assert.match(sql, /"n" INTEGER/)
  assert.match(sql, /"id" TEXT/)
})
