// Postbuild: tulis satu file HTML per rute ke dist/, masing-masing dengan judul, deskripsi,
// canonical, dan Open Graph sendiri. Sekaligus bangkitkan dist/sitemap.xml dari sumber yang sama.
//
// KENAPA INI PERLU. Aplikasi ini SPA tanpa SSR, jadi semua rute menerima dist/index.html yang
// sama lewat rewrite di vercel.json. Dampaknya bukan cuma "kurang optimal": sejak canonical
// ditambahkan, index.html menyatakan dirinya kanonik ke halaman depan, dan file itulah yang
// disajikan untuk /catalog, /leaderboard, dan sisanya. Artinya SETIAP halaman memberi tahu
// Google bahwa dirinya duplikat halaman depan, dan halaman itu akan dikeluarkan dari indeks.
//
// KENAPA CUKUP MENUKAR META, TANPA MERENDER ISI. Yang rusak adalah metadata, bukan isinya:
// Googlebot menjalankan JavaScript dan akan melihat konten aslinya setelah hidrasi. Merender
// isi butuh SSR atau headless browser saat build, dan itu mesin yang jauh lebih besar untuk
// masalah yang tidak kita punya. Body sengaja dibiarkan identik supaya React hidrasi seperti
// biasa dan tidak ada risiko mismatch.
//
// KENAPA INI BEKERJA DI VERCEL. File statis menang atas `rewrites`, mekanisme yang sama yang
// membuat /robots.txt akhirnya tersaji sebagai file asli. dist/catalog/index.html akan
// disajikan untuk /catalog sebelum rewrite sempat ikut campur.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SEO_ROUTES, SITE_URL, canonicalFor } from '../lib/seoRoutes.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const shell = readFileSync(join(dist, 'index.html'), 'utf8')

// PENJAGA, jangan dihapus. Halaman ditulis ke subdirektori (dist/catalog/index.html), jadi path
// aset RELATIF akan diminta dari /catalog/assets/... yang tidak ada dan halamannya blank untuk
// siapa pun yang membuka link langsung. Kegagalannya tidak terlihat saat build maupun saat
// membuka halaman depan, jadi build sengaja dibuat gagal keras di sini ketimbang menghasilkan
// delapan halaman rusak. Pemicunya: `base` di vite.config.js dikembalikan ke './'.
const asetRelatif = [...shell.matchAll(/(?:src|href)="(\.\/[^"]+)"/g)].map((m) => m[1])
if (asetRelatif.length > 0) {
  throw new Error(
    `prerender: index.html memakai path aset RELATIF (${asetRelatif.join(', ')}).\n` +
    "Halaman di subdirektori akan gagal memuatnya. Setel `base: '/'` di vite.config.js.",
  )
}

// Escape untuk nilai atribut HTML. lib/seoRoutes.test.mjs sudah melarang kutip ganda dan
// kurung siku di sumbernya, tapi ini lapis kedua supaya kesalahan di sana tidak berubah
// jadi markup rusak yang tersebar ke sembilan file sekaligus.
const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Penggantian ditulis sebagai regex yang MENGHARAP satu kecocokan. Kalau index.html berubah
// sampai polanya tidak cocok lagi, kita ingin build gagal keras di sini, bukan diam-diam
// menghasilkan sembilan halaman bermetadata sama yang justru merusak indeks.
function ganti(html, pola, penggantiBaru, label, path) {
  const cocok = html.match(pola)
  if (!cocok) throw new Error(`prerender: pola "${label}" tidak ditemukan di index.html saat memproses ${path}`)
  return html.replace(pola, penggantiBaru)
}

function halaman({ path, title, description }) {
  const canonical = canonicalFor(path)
  let html = shell
  html = ganti(html, /<title>[\s\S]*?<\/title>/, `<title>${attr(title)}</title>`, 'title', path)
  html = ganti(html, /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${attr(description)}" />`, 'description', path)
  html = ganti(html, /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${canonical}" />`, 'canonical', path)
  html = ganti(html, /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${attr(title)}" />`, 'og:title', path)
  html = ganti(html, /<meta property="og:description" content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${attr(description)}" />`, 'og:description', path)
  html = ganti(html, /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${canonical}" />`, 'og:url', path)
  html = ganti(html, /<meta name="twitter:title" content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${attr(title)}" />`, 'twitter:title', path)
  html = ganti(html, /<meta name="twitter:description" content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${attr(description)}" />`, 'twitter:description', path)
  return html
}

let ditulis = 0
for (const r of SEO_ROUTES) {
  const html = halaman(r)
  // "/" menimpa dist/index.html itu sendiri; sisanya jadi dist/<rute>/index.html supaya
  // Vercel menyajikannya sebagai indeks direktori untuk /<rute>.
  const target = r.path === '/' ? join(dist, 'index.html') : join(dist, r.path, 'index.html')
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, html)
  ditulis++
}

// Sitemap dibangkitkan, TIDAK ditulis tangan lagi: menambah halaman cukup di lib/seoRoutes.js
// dan sitemap ikut sendiri. Sengaja tanpa <lastmod>, <priority>, dan <changefreq>: yang pertama
// pasti basi tanpa ada yang sadar, dua sisanya diabaikan Google.
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<!-- DIBANGKITKAN scripts/prerender.mjs dari lib/seoRoutes.js. Jangan sunting tangan. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SEO_ROUTES.map((r) => `  <url><loc>${canonicalFor(r.path)}</loc></url>`).join('\n')}
</urlset>
`
writeFileSync(join(dist, 'sitemap.xml'), sitemap)

console.log(`prerender: ${ditulis} halaman + sitemap.xml (${SEO_ROUTES.length} URL) di ${SITE_URL}`)
