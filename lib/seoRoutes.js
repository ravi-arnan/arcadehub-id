// SUMBER TUNGGAL metadata per rute: judul, deskripsi, dan URL kanoniknya.
//
// Dipakai dua-duanya oleh scripts/prerender.mjs, yang menulis satu file HTML per rute ke dist/
// DAN membangkitkan sitemap.xml. Sitemap TIDAK lagi ditulis tangan; kalau menambah halaman,
// cukup tambahkan entri di sini.
//
// Dijaga lib/seoRoutes.test.mjs: tes gagal kalau ada <Route> di src/App.jsx yang belum punya
// entri di sini, jadi halaman baru tidak bisa lolos tanpa metadata.
export const SITE_URL = 'https://arcadehub.web.id'

const BRAND = 'Arcade Hub'

export const INFO_FAQ = [
  {
    q: 'Apa itu program ini?',
    a: 'Google Cloud Arcade Fasilitator 2026: program beasiswa coding gamifikasi dari Google Cloud (Cloud, AI, ML, Data Engineering). Gratis untuk semua WNI. Selesaikan game & skill badge, kumpulkan poin, tukar hadiah.',
  },
  {
    q: 'Bagaimana poin dihitung?',
    a: '1 Arcade Game = 1 poin (beberapa game spesial Januari sampai Juni 2026 bernilai 2-3 poin, lihat Game Terdahulu di Katalog). Setiap 2 Skill Badge = 1 poin. Milestone memberi bonus poin (hanya milestone tertinggi yang dihitung).',
  },
  {
    q: 'Apa itu Bonus Milestone (+10 poin)?',
    a: 'Proyek tambahan dari Google: bangun AI Agent pertamamu, dapat 10 Poin Arcade bonus. Syaratnya sudah terdaftar di kohort, Milestone 1 terbuka, dan 4 badge GEAR selesai. Panduan langkah demi langkah plus link dokumen instruksi dan form verifikasinya ada di tab Poin Saya, di kartu Bonus Milestone AI Agent.',
  },
  {
    q: 'Kenapa poin saya 0 padahal punya badge?',
    a: 'Pastikan profil di-set PUBLIC. Yang dihitung hanya badge Arcade Season 2026 (earned Jan-Des 2026); badge dari tahun sebelumnya tidak masuk hitungan.',
  },
  {
    q: 'Berapa lab yang bisa saya kerjakan per hari?',
    a: 'Maksimum 15 lab dalam 24 jam. Batas ini tidak bisa dinaikkan.',
  },
  {
    q: 'Email pendaftaran tidak masuk?',
    a: 'Tambahkan googlecloudedu-noreply@google.com ke kontak/allowlist emailmu agar tidak masuk folder Spam/Promosi, lalu daftar ulang bila perlu.',
  },
  {
    q: 'Kapan hadiah dikirim?',
    a: 'Setelah kamu mencapai tier Arcade Player (mengumpulkan cukup poin) dan program selesai. Slot per tier terbatas (first-come), jadi kunci poin secepatnya.',
  },
]

export const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: INFO_FAQ.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
}

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
    path: '/leaderboard',
    title: `Leaderboard komunitas Arcade 2026 · ${BRAND}`,
    description: 'Papan peringkat peserta Google Cloud Arcade Fasilitator 2026 Indonesia. Cari nama, saring per guild, dan lihat siapa yang sudah menembus tiap milestone.',
    breadcrumb: 'Leaderboard',
  },
  {
    path: '/catalog',
    title: `Katalog badge dan game Arcade 2026 · ${BRAND}`,
    description: 'Daftar lengkap Arcade Game bulan berjalan beserta access code dan seluruh skill badge resmi yang menambah poin, dengan penanda mana yang sudah kamu selesaikan.',
    breadcrumb: 'Katalog',
  },
  {
    path: '/prizes',
    title: `Tier Hadiah dan Merchandise Swag Arcade 2026 · ${BRAND}`,
    description: 'Rincian resmi tier hadiah Arcade 2026: Trooper, Ranger, Champion, Legend, kuota slot, bocoran merchandise resmi, dan mekanisme penukaran waterfall.',
    breadcrumb: 'Hadiah',
  },
  {
    path: '/info',
    title: `Panduan dan aturan program Arcade Fasilitator 2026 · ${BRAND}`,
    description: 'Cara ikut Google Cloud Arcade Fasilitator 2026: pendaftaran, cara membuat profil publik Cloud Skills Boost, sistem poin, tenggat, dan pertanyaan yang sering muncul.',
    schema: FAQ_SCHEMA,
    breadcrumb: 'Panduan & FAQ',
  },
  {
    path: '/contribute',
    title: `Ikut kontribusi ke Arcade Hub · ${BRAND}`,
    description: 'Arcade Hub open source dengan lisensi MIT. Lihat cara melaporkan bug, mengusulkan fitur, mengambil good first issue, dan mencantumkan namamu sebagai kontributor.',
    breadcrumb: 'Kontribusi',
  },
  {
    path: '/roadmap',
    title: `Roadmap pengembangan · ${BRAND}`,
    description: 'Apa yang sudah rilis, sedang dikerjakan, dan direncanakan untuk Arcade Hub. Urutannya digerakkan kebutuhan dan masukan komunitas fasilitator.',
    breadcrumb: 'Roadmap',
  },
  {
    path: '/guilds',
    title: `Perbandingan guild Arcade 2026 · ${BRAND}`,
    description: 'Peringkat guild peserta Arcade Fasilitator 2026: total poin, rata-rata per anggota, jumlah game dan badge, serta berapa anggota yang sudah menembus milestone.',
    breadcrumb: 'Guild',
  },
]

export const canonicalFor = (path) => SITE_URL + (path === '/' ? '/' : path)

export function breadcrumbSchemaFor(path, label) {
  if (path === '/' || !label) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: SITE_URL + '/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: label,
        item: canonicalFor(path),
      },
    ],
  }
}
