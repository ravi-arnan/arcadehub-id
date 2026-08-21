// Menghasilkan lib/labSolutions.js dari tabel "Daftar lab" di README
// github.com/ravi-arnan/gsp_lab_solutions.
//
// Kenapa di-generate, bukan di-fetch saat runtime: peta ini cuma berubah saat repo solusi
// menambah lab, jadi tidak ada gunanya membebani tiap pengunjung dengan satu request lagi,
// dan CSP di vercel.json memang tidak mengizinkan connect ke raw.githubusercontent.com.
//
// Jalankan: npm run gen:solutions
import { writeFileSync } from 'node:fs'
import { SKILL_CATALOG } from '../lib/skillCatalog.js'

const REPO = 'ravi-arnan/gsp_lab_solutions'
const README = `https://raw.githubusercontent.com/${REPO}/main/README.md`

// Judul badge dan judul lab tidak selalu sama persis. PENCOCOKAN OTOMATIS SENGAJA HANYA
// COCOK PERSIS: uji kemiripan token (Jaccard >= 0.55) menghasilkan tiga dari delapan pasangan
// yang SALAH, dan salahnya berbahaya karena mengirim peserta ke script produk lain:
//   650 "Create and Manage Bigtable Instances"          -> GSP395 AlloyDB      (produk beda)
//   652 "Create and Manage Cloud SQL for PostgreSQL"     -> GSP381 Spanner      (produk beda)
//   704 "Create a Secure Data Lake on Cloud Storage"     -> ARC110 Streaming    (lab beda)
// Jadi selisih penamaan diselesaikan di daftar di bawah ini, satu per satu, setelah judul
// kedua sisi dibaca manual. Tambah baris baru di sini kalau ada lab yang jelas cocok tapi
// judulnya beda tulisan.
const ALIAS = {
  658: 'ARC100',  // "... - Console" vs "...: Challenge Lab" (pasangannya 659 -> ARC102)
  629: 'GSP351',  // "Database Migration Service" vs "DMS"
  1596: 'GSP540', // "Agent Development Kit (ADK)" vs "ADK"
  761: 'GSP364',  // badge menyebut "Google Cloud Managed Service", lab tidak
  636: 'GSP345',  // badge menyebut "on Google Cloud", lab tidak
}

const norm = (s) => s.toLowerCase().replace(/:?\s*challenge lab\s*$/, '').replace(/[^a-z0-9]+/g, ' ').trim()
const cell = (v) => (v === '-' || !v ? null : v)
// Kolom Script/Runbook berbentuk link markdown [teks](path); yang dipakai path-nya.
const linkPath = (v) => {
  const m = String(v || '').match(/\]\(([^)]+)\)/)
  return m ? m[1] : null
}

const md = await fetch(README).then((r) => {
  if (!r.ok) throw new Error(`README ${r.status}`)
  return r.text()
})

const labs = []
for (const line of md.split('\n')) {
  const m = line.match(/^\|\s*([A-Z]+\d+)\s*\|([^|]+)\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|/)
  if (!m) continue
  labs.push({
    code: m[1],
    title: m[2].trim(),
    script: linkPath(m[3]),
    runbook: linkPath(m[4]),
    status: cell(m[5].trim()),
    tested: cell(m[6].trim()),
  })
}
if (labs.length === 0) throw new Error('tabel lab tidak terbaca, format README berubah?')

const byTitle = new Map(labs.map((l) => [norm(l.title), l]))
const byCode = new Map(labs.map((l) => [l.code, l]))

const out = {}
let exact = 0
let aliased = 0
for (const s of SKILL_CATALOG) {
  const lab = ALIAS[s.id] ? byCode.get(ALIAS[s.id]) : byTitle.get(norm(s.name))
  if (!lab) continue
  if (ALIAS[s.id]) aliased++
  else exact++
  out[s.id] = {
    code: lab.code,
    // Runbook menjelaskan, script mengeksekusi. Yang dipakai sebagai tujuan link adalah
    // runbook kalau ada, karena peserta yang membuka ini sedang macet, bukan sedang
    // mengotomatiskan; script tetap satu klik dari sana lewat README repo.
    path: lab.runbook || lab.script,
    verified: /terverifikasi/i.test(lab.status || ''),
  }
}

const missAlias = Object.entries(ALIAS).filter(([id]) => !out[id])
if (missAlias.length) {
  console.error('ALIAS menunjuk kode lab yang tidak ada di README:', missAlias.map(([id]) => id).join(', '))
  process.exit(1)
}

const body = `// DIHASILKAN OTOMATIS oleh scripts/gen-lab-solutions.mjs. Jangan diedit tangan.
// Sumber: README github.com/${REPO} (tabel "Daftar lab").
// Perbarui dengan: npm run gen:solutions
//
// Peta: id skill badge -> lab di repo solusi milik fasilitator.
// \`verified\` = kolom Status di README menyebut lab itu sudah terverifikasi.
export const SOLUTION_REPO = '${REPO}'
export const LAB_SOLUTIONS = ${JSON.stringify(out, null, 2)}
`
writeFileSync(new URL('../lib/labSolutions.js', import.meta.url), body)

const verified = Object.values(out).filter((x) => x.verified).length
console.log(`lab di README: ${labs.length}`)
console.log(`badge terpetakan: ${Object.keys(out).length} dari ${SKILL_CATALOG.length} (cocok persis ${exact}, alias ${aliased})`)
console.log(`di antaranya berstatus terverifikasi: ${verified}`)
