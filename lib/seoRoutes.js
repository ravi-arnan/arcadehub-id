// SUMBER TUNGGAL metadata per rute: judul, deskripsi, dan URL kanoniknya.
//
// Dipakai dua-duanya oleh scripts/prerender.mjs, yang menulis satu file HTML per rute ke dist/
// DAN membangkitkan sitemap.xml. Sitemap TIDAK lagi ditulis tangan; kalau menambah halaman,
// cukup tambahkan entri di sini.
//
// Dijaga lib/seoRoutes.test.mjs: tes gagal kalau ada <Route> di src/App.jsx yang belum punya
// entri di sini, jadi halaman baru tidak bisa lolos tanpa metadata.
export const SITE_URL = 'https://arcadehub-id.vercel.app'

const BRAND = 'Arcade Hub'

// Deskripsi ditulis per halaman, bukan disalin: deskripsi yang sama di semua URL adalah
// separuh dari masalah duplikat yang mau diperbaiki. Panjang diincar 120-160 karakter,
// rentang yang biasanya tidak dipotong Google.
export const SEO_ROUTES = [
  {
    path: '/',
    title: `${BRAND}: Tracker Poin Google Cloud Arcade Fasilitator 2026`,
    description: 'Hitung poin Google Cloud Arcade otomatis dari profil Cloud Skills Boost, pantau milestone fasilitator, tier hadiah, dan leaderboard guild. Gratis untuk komunitas.',
  },
  {
    path: '/points',
    title: `Poin Saya: hitung poin Arcade otomatis · ${BRAND}`,
    description: 'Tempel link public profile Cloud Skills Boost dan poin Arcade 2026 kamu dihitung otomatis, lengkap dengan progres milestone fasilitator dan daftar badge.',
  },
  {
    path: '/leaderboard',
    title: `Leaderboard komunitas Arcade 2026 · ${BRAND}`,
    description: 'Papan peringkat peserta Google Cloud Arcade Fasilitator 2026 Indonesia. Cari nama, saring per guild, dan lihat siapa yang sudah menembus tiap milestone.',
  },
  {
    path: '/catalog',
    title: `Katalog badge dan game Arcade 2026 · ${BRAND}`,
    description: 'Daftar lengkap Arcade Game bulan berjalan beserta access code dan seluruh skill badge resmi yang menambah poin, dengan penanda mana yang sudah kamu selesaikan.',
  },
  {
    path: '/prizes',
    title: `Tier hadiah Arcade 2026 dan syarat poinnya · ${BRAND}`,
    description: 'Rincian tier hadiah Arcade Player 2026: Trooper, Ranger, Champion, dan Legend, berapa poin yang dibutuhkan masing-masing, serta jumlah slot yang tersedia.',
  },
  {
    path: '/info',
    title: `Panduan dan aturan program Arcade Fasilitator 2026 · ${BRAND}`,
    description: 'Cara ikut Google Cloud Arcade Fasilitator 2026: pendaftaran, cara membuat profil publik Cloud Skills Boost, sistem poin, tenggat, dan pertanyaan yang sering muncul.',
  },
  {
    path: '/contribute',
    title: `Ikut kontribusi ke Arcade Hub · ${BRAND}`,
    description: 'Arcade Hub open source dengan lisensi MIT. Lihat cara melaporkan bug, mengusulkan fitur, mengambil good first issue, dan mencantumkan namamu sebagai kontributor.',
  },
  {
    path: '/roadmap',
    title: `Roadmap pengembangan · ${BRAND}`,
    description: 'Apa yang sudah rilis, sedang dikerjakan, dan direncanakan untuk Arcade Hub. Urutannya digerakkan kebutuhan dan masukan komunitas fasilitator.',
  },
  {
    path: '/guilds',
    title: `Perbandingan guild Arcade 2026 · ${BRAND}`,
    description: 'Peringkat guild peserta Arcade Fasilitator 2026: total poin, rata-rata per anggota, jumlah game dan badge, serta berapa anggota yang sudah menembus milestone.',
  },
]

export const canonicalFor = (path) => SITE_URL + (path === '/' ? '/' : path)
