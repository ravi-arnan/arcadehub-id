// Tarik ulang katalog COMPLETION BADGE dari Google Skills lalu tulis src/completionCatalog.js.
// Jalankan: npm run scrape:completion
//
// Kenapa endpoint ini: halaman /catalog itu SPA, tapi tombol filternya memanggil
// /catalog/list yang balas JSON polos (8 item per halaman) dan bisa diambil tanpa login.
// Tiap item punya `credentialType`:
//   "skill_badge" -> badge keahlian (sudah ditangani SKILL_CATALOG)
//   null          -> completion badge (course biasa, ini yang kita kumpulkan)
// Filter resmi `skill-badge=completion-badge` TIDAK dipakai: hasilnya cuma 209 dari 499 dan
// melewatkan course baru (AI Boost Bites, GEAR, Gemini in ...) yang jelas-jelas mengeluarkan
// completion badge. Diverifikasi 4 Agu 2026: dari 171 badge di satu profil publik yang rajin
// mengumpulkan completion badge, 154 cocok dengan set `credentialType: null`, 11 skill badge,
// dan 6 sisanya game Arcade. Nol yang meleset.
//
// Laporan + tulis file. Diff-nya tetap harus dibaca manusia sebelum di-commit.
import { writeFile } from 'node:fs/promises'
import { SKILL_CATALOG } from '../src/catalog.js'

const LIST = (page) => `https://www.skills.google/catalog/list?keywords=&locale=&format=courses&page=${page}`
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
const OUT = new URL('../src/completionCatalog.js', import.meta.url)
const DELAY_MS = 250 // sekuensial + jeda: skills.google balas 403 palsu kalau digeber
const MAX_PAGES = 200

// "3 hours 45 minutes" -> 225. Dipakai untuk mengurutkan dari yang paling cepat dikerjakan.
function toMinutes(dur) {
  const h = +(dur?.match(/(\d+)\s*hour/)?.[1] || 0)
  const m = +(dur?.match(/(\d+)\s*minute/)?.[1] || 0)
  return h * 60 + m
}

// Halaman berisi balas array; halaman SESUDAH yang terakhir balas `{"data":[]}` (bukan array).
// Bentuk lain berarti endpoint berubah, jadi berhenti dengan pesan jelas ketimbang diam-diam
// menulis katalog yang bolong.
async function fetchPage(page) {
  const res = await fetch(LIST(page), { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) })
  if (!res.ok) throw new Error(`halaman ${page} balas ${res.status}`)
  const body = await res.json()
  if (Array.isArray(body)) return body
  if (Array.isArray(body?.data) && body.data.length === 0) return []
  throw new Error(`halaman ${page} bentuknya tak dikenal: ${JSON.stringify(body).slice(0, 200)}`)
}

async function fetchAll() {
  const rows = []
  for (let page = 1; page <= MAX_PAGES; page++) {
    const batch = await fetchPage(page)
    if (batch.length === 0) return rows
    rows.push(...batch)
    await new Promise((r) => setTimeout(r, DELAY_MS))
  }
  throw new Error(`lebih dari ${MAX_PAGES} halaman, kemungkinan paginasi berubah`)
}

const raw = await fetchAll()
const skillIds = new Set(SKILL_CATALOG.map((s) => s.id))
const seen = new Set()
const dropped = []
const rows = []

for (const r of raw) {
  const id = +(r.path.match(/course_templates\/(\d+)/)?.[1] || 0)
  const name = (r.title || '').replace(/\s+/g, ' ').trim()
  if (!id || seen.has(id)) continue
  seen.add(id)
  if (r.credentialType) continue // skill badge, bukan urusan file ini
  // Course yang ditandai deprecated tidak bisa dikerjakan lagi, jadi tidak boleh muncul
  // sebagai saran. Contoh 4 Agu 2026: 12 dan 1412.
  if (/^\[depr[ie]cat/i.test(name)) { dropped.push(`${id} deprecated: ${name}`); continue }
  // Id yang sudah jadi skill badge di katalog kita tidak boleh dobel di sini.
  if (skillIds.has(id)) { dropped.push(`${id} sudah di SKILL_CATALOG: ${name}`); continue }
  rows.push({ id, name, min: toMinutes(r.duration) })
}

// Urut dari yang paling singkat: completion badge poinnya sama rata (0,5), jadi satu-satunya
// pembeda yang berguna adalah lama pengerjaan. Tie-break id supaya diff antar-bulan stabil.
rows.sort((a, b) => a.min - b.min || a.id - b.id)

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
const body = rows.map((r) => `  { id: ${r.id}, name: '${esc(r.name)}', min: ${r.min} },`).join('\n')
const file = `// Katalog COMPLETION BADGE Google Skills. DIBUAT OTOMATIS, jangan sunting tangan:
// jalankan \`npm run scrape:completion\` lalu baca diff-nya.
//
// Completion badge = badge dari course biasa (bukan skill badge berbasis lab). Sumber:
// skills.google/catalog dengan filter Format = Course, ambil yang \`credentialType\` null.
// \`min\` = perkiraan durasi resmi dalam menit, dipakai mengurutkan dari yang tercepat.
//
// Catatan poin: silabus resmi fasilitator menyebut "Badge Keahlian". Tracker ini menghitung
// SEMUA badge non-game yang di-earn di periode program sebagai badge keahlian (lihat
// lib/parseProfile.js), jadi completion badge ikut terhitung 2 badge = 1 poin. Daftar ini
// membuat katalog cocok dengan cara skor itu dihitung, bukan menambah aturan baru.
//
// Ada dua entri berjudul sama persis (1146 dan 1147, "Introduction to Security in the World
// of AI"). Itu memang dua course terpisah di Google dan keduanya bisa di-earn, jadi keduanya
// sengaja dipertahankan.
export const COMPLETION_CATALOG = [
${body}
]
`
await writeFile(OUT, file)

console.log(`course terbaca : ${raw.length}`)
console.log(`completion     : ${rows.length} -> ${OUT.pathname}`)
console.log(`dibuang        : ${dropped.length}`)
for (const d of dropped) console.log(`  - ${d}`)
