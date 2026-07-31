// Cek drift katalog terhadap sumber resmi Google. Jalankan: npm run check:arcade
//
// Menggantikan langkah manual yang dipakai sesi 31 Jul 2026 (curl satu-satu lalu bandingkan
// dengan mata). Tiga sumber yang memang bisa diambil tanpa login:
//   1. go.cloudskillsboost.google/arcade  -> game bulan ini, access code, badge unggulan
//   2. skills.google/course_templates/ID  -> judul resmi + hidup/matinya tiap badge
//   3. (silabus rsvp.withgoogle.com TIDAK bisa: SPA boq, isinya lewat RPC internal.
//      Satu-satunya cara = save manual sambil accordion dibuka, lihat HANDOFF.)
//
// Laporan saja, tidak mengubah file apa pun. Keputusan tetap di tangan manusia.
import { SKILL_CATALOG, GAME_CATALOG, norm } from '../src/catalog.js'

const ARCADE = 'https://go.cloudskillsboost.google/arcade'
const COURSE = (id) => `https://www.skills.google/course_templates/${id}`
const CONCURRENCY = 3 // di atas ini skills.google mulai balas 403 palsu
const TIMEOUT_MS = 30000

const dec = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')

async function get(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), redirect: 'follow' })
  return { status: res.status, body: res.status === 200 ? await res.text() : '' }
}

// Jalankan job berbarengan tapi dibatasi, biar tidak kena 403 karena terlalu agresif.
async function pool(items, worker) {
  const out = new Array(items.length)
  let i = 0
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++
        out[idx] = await worker(items[idx])
      }
    }),
  )
  return out
}

// Judul course diambil dari <title>; sudah dicek konsisten dengan isi halaman.
const titleOf = (html) => dec((html.match(/<title>([^<]*)<\/title>/i)?.[1] || '').replace(/ \| Google Skills$/, '').trim())

async function courseInfo(id) {
  let r = await get(COURSE(id))
  // Sekali ulang untuk status non-200: 403 sesaat bisa muncul kalau permintaan menumpuk.
  if (r.status !== 200) {
    await new Promise((s) => setTimeout(s, 1500))
    r = await get(COURSE(id))
  }
  return { id, status: r.status, title: titleOf(r.body) }
}

const lines = []
const say = (s = '') => { lines.push(s); console.log(s) }
const section = (t) => { say(); say(t); say('-'.repeat(t.length)) }

// ---- 1. halaman Arcade resmi
const arcade = await get(ARCADE)
if (arcade.status !== 200) {
  console.error(`GAGAL memuat ${ARCADE} (HTTP ${arcade.status}). Cek koneksi lalu ulangi.`)
  process.exit(1)
}
const page = dec(arcade.body)

const codes = [...new Set(page.match(/1q-[a-z0-9-]+/g) || [])]
const gameIds = [...new Set((page.match(/games\/(\d+)/g) || []).map((s) => s.split('/')[1]))]
const featured = [...page.matchAll(/<a[^>]+href="[^"]*course_templates\/(\d+)[^"]*"[^>]*>([\s\S]*?)<\/a>/g)]
  .map((m) => ({ id: Number(m[1]), name: m[2].replace(/<[^>]+>/g, '').trim() }))
  .filter((x, i, a) => a.findIndex((y) => y.id === x.id) === i)

section('GAME BULAN INI')
for (const g of GAME_CATALOG) {
  const codeOk = g.code ? codes.includes(g.code) : true
  const idOk = gameIds.includes(String(g.game))
  const flags = []
  if (g.code && !codeOk) flags.push(`access code ${g.code} SUDAH TIDAK ADA di halaman resmi`)
  if (!g.off && !idOk) flags.push(`game id ${g.game} tidak ditemukan di halaman resmi`)
  if (g.off && idOk) flags.push(`ditandai off di katalog TAPI masih ada di halaman resmi, cek apakah sudah dibuka lagi`)
  say(`${flags.length ? 'x' : 'v'} ${g.name}${g.off ? ' (off: ' + g.off + ')' : ''}`)
  flags.forEach((f) => say(`    -> ${f}`))
}
const unknownCodes = codes.filter((c) => !GAME_CATALOG.some((g) => g.code === c))
if (unknownCodes.length) say(`! access code di halaman resmi yang belum ada di katalog: ${unknownCodes.join(', ')}`)

section('BADGE UNGGULAN BULAN INI (dari halaman Arcade)')
const catIds = new Set(SKILL_CATALOG.map((s) => s.id))
for (const f of featured) say(`${catIds.has(f.id) ? 'v' : '!'} ${f.id} ${f.name}${catIds.has(f.id) ? '' : '  <- BELUM ADA DI KATALOG'}`)

// ---- 2. status + judul semua badge katalog
section(`STATUS ${SKILL_CATALOG.length} BADGE KATALOG (butuh sekitar 1-2 menit)`)
const infos = await pool(SKILL_CATALOG, (s) => courseInfo(s.id))
const dead = [], renamed = [], deprecated = []
for (const s of SKILL_CATALOG) {
  const info = infos.find((i) => i.id === s.id)
  if (info.status !== 200) { dead.push({ ...s, status: info.status }); continue }
  if (/deprecated/i.test(info.title)) deprecated.push({ ...s, live: info.title })
  // Prefiks [DEPRECATED] sengaja tidak ikut di nama tampilan katalog, jadi jangan dilaporkan
  // sebagai rename tiap bulan. Cukup muncul sekali di daftar deprecated.
  const live = info.title.replace(/^\s*\[DEPRECATED\]\s*/i, '')
  if (norm(live) !== norm(s.name)) renamed.push({ ...s, live: info.title })
}
say(`hidup: ${SKILL_CATALOG.length - dead.length} | mati: ${dead.length} | ganti nama: ${renamed.length} | deprecated: ${deprecated.length}`)

if (dead.length) {
  section('BADGE MATI (halaman course tidak bisa dibuka)')
  dead.forEach((d) => say(`x ${d.id} HTTP ${d.status}  ${d.name}`))
  say('-> pertimbangkan hapus dari SKILL_CATALOG supaya tidak disarankan ke peserta.')
}
if (renamed.length) {
  section('GANTI NAMA (course id sama, judul beda)')
  renamed.forEach((r) => say(`! ${r.id}\n    katalog: ${r.name}\n    live   : ${r.live}`))
  say('-> ganti `name` ke judul live, pindahkan nama lama ke SKILL_ALIASES supaya deteksi "Selesai" tetap jalan.')
}
if (deprecated.length) {
  section('DITANDAI DEPRECATED OLEH GOOGLE')
  deprecated.forEach((d) => say(`! ${d.id} ${d.live}`))
}

section('RINGKASAN')
const drift = dead.length + renamed.length + unknownCodes.length + featured.filter((f) => !catIds.has(f.id)).length
say(drift === 0 ? 'Tidak ada perbedaan. Katalog masih sinkron dengan sumber resmi.' : `${drift} hal perlu ditindaklanjuti, lihat detail di atas.`)
say('Silabus fasilitator (level Pemula/Menengah/Lanjutan) TIDAK ikut dicek: butuh login, save manual.')
