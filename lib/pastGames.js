// Game Arcade 2026 yang sudah ditutup ("Game over!"), Januari–Juli 2026.
// Sumber: section "Game over!" di go.cloudskillsboost.google/arcade (dicek ulang 3 Agu 2026).
// Dipakai untuk dua hal:
//   1. Referensi di katalog (game lama tidak bisa dikerjakan lagi, tapi poinnya tetap terhitung
//      di total Season 2026, jadi peserta perlu tahu asal poinnya).
//   2. Bobot poin: sebagian game spesial bernilai 2-3 poin, bukan 1. Tanpa tabel ini poin
//      Season peserta yang ikut bulan-bulan awal kehitung kurang.
// `pts` disalin apa adanya dari halaman resmi. Untuk beberapa game spesial Google
// menyembunyikan baris poinnya (di-comment di HTML); nilainya diambil dari comment itu.
export const PAST_GAMES = [
  // Januari
  { m: 1, name: 'Arcade Work- Life Refresh', pts: 2 },
  { m: 1, name: 'Arcade A Cloud That Cares', pts: 1 },
  { m: 1, name: 'Arcade Base Camp January', pts: 1 },
  { m: 1, name: 'Arcade Certification Zone', pts: 1 },
  { m: 1, name: 'Level 1: January 2026', pts: 1 },
  { m: 1, name: 'Level 2: January 2026', pts: 1 },
  { m: 1, name: 'Level 3: January 2026', pts: 1 },
  { m: 1, name: 'Week 1: January 2026', pts: 1 },
  { m: 1, name: 'Week 2: January 2026', pts: 1 },
  { m: 1, name: 'Week 3: January 2026', pts: 1 },
  { m: 1, name: 'Week 4: January 2026', pts: 1 },
  // Februari
  { m: 2, name: 'Arcade From Foundation to Wonders', pts: 3 },
  { m: 2, name: 'Arcade Skills At the Pitch', pts: 3 },
  { m: 2, name: 'Arcade Journey Made Easy', pts: 1 },
  { m: 2, name: 'Arcade Base Camp February', pts: 1 },
  { m: 2, name: 'Arcade Adventure: February 2026', pts: 1 },
  { m: 2, name: 'Arcade Voyage: February 2026', pts: 1 },
  { m: 2, name: 'Arcade Trail: February 2026', pts: 1 },
  { m: 2, name: 'Sprint 1: February 2026', pts: 1 },
  { m: 2, name: 'Sprint 2: February 2026', pts: 1 },
  { m: 2, name: 'Sprint 3: February 2026', pts: 1 },
  { m: 2, name: 'Sprint 4: February 2026', pts: 1 },
  // Maret
  { m: 3, name: 'Arcade Holi-Istic Infrastrectures', pts: 2 },
  { m: 3, name: 'Arcade Matrics in Motion', pts: 3 },
  { m: 3, name: 'Arcade Base Camp March', pts: 1 },
  { m: 3, name: 'Arcade Adventure: March 2026', pts: 1 },
  { m: 3, name: 'Arcade Voyage: March 2026', pts: 1 },
  { m: 3, name: 'Arcade Trail: March 2026', pts: 1 },
  { m: 3, name: 'Sprint 1: March 2026', pts: 1 },
  { m: 3, name: 'Sprint 2: March 2026', pts: 1 },
  { m: 3, name: 'Sprint 3: March 2026', pts: 1 },
  { m: 3, name: 'Sprint 4: March 2026', pts: 1 },
  // April
  { m: 4, name: 'Arcade Dialogue Design', pts: 1 },
  { m: 4, name: 'Arcade Skills Spawn', pts: 3 },
  { m: 4, name: 'Arcade Base Camp April', pts: 1 },
  { m: 4, name: 'Arcade Adventure: April 2026', pts: 1 },
  { m: 4, name: 'Arcade Voyage: April 2026', pts: 1 },
  { m: 4, name: 'Arcade Trail: April 2026', pts: 1 },
  // Mei
  { m: 5, name: 'Arcade Skill Up Summer', pts: 1 },
  { m: 5, name: 'Arcade Expressive Efficiency', pts: 3 },
  { m: 5, name: 'Arcade Base Camp May', pts: 1 },
  { m: 5, name: 'Arcade Adventure: May 2026', pts: 1 },
  { m: 5, name: 'Arcade Voyage: May 2026', pts: 1 },
  { m: 5, name: 'Arcade Trail: May 2026', pts: 1 },
  // Juni. Halaman resmi mengulang "Arcade Skill Up Summer" + "Arcade Expressive Efficiency"
  // dari Mei (art badge-nya beda, judulnya sama) — jadi badge yang sama, berjalan dua bulan.
  { m: 6, name: 'Arcade Base Camp June', pts: 1 },
  { m: 6, name: 'Arcade Adventure: June 2026', pts: 1 },
  { m: 6, name: 'Arcade Voyage: June 2026', pts: 1 },
  { m: 6, name: 'Arcade Trail: June 2026', pts: 1 },
  // Juli. Masuk daftar "Game over!" per 3 Agu 2026, termasuk Trail Juli yang sempat ditarik
  // (sekarang resmi ditutup, poinnya tetap 1 untuk yang sudah sempat menyelesaikannya).
  { m: 7, name: 'Arcade Safe Spaces', pts: 1 },
  { m: 7, name: 'Arcade Simulator: Data Mesh Architect', pts: 1 },
  { m: 7, name: 'Arcade Base Camp July', pts: 1 },
  { m: 7, name: 'Arcade Adventure: July 2026', pts: 1 },
  { m: 7, name: 'Arcade Voyage: July 2026', pts: 1 },
  { m: 7, name: 'Arcade Trail: July 2026', pts: 1 },
]

// Judul badge di profil bisa beda spasi/tanda baca dengan halaman resmi (mis. "Work- Life"),
// jadi cocokkan pakai kunci yang sudah dibuang non-alfanumeriknya.
const key = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '')
const PTS_BY_KEY = new Map(PAST_GAMES.map((g) => [key(g.name), g.pts]))

// Poin resmi satu game badge: game spesial lama bisa 2-3, sisanya (termasuk semua game
// bulan berjalan) 1. Dipakai untuk menjumlahkan base poin Season.
export const gamePoints = (title) => PTS_BY_KEY.get(key(title)) ?? 1

// Art badge di /public/img/past/{slug}.webp, nama file diturunkan dari nama game (bukan field
// terpisah) supaya tidak bisa meleset. Dijaga test "setiap game punya art badge".
export const pastGameImg = (name) => `/img/past/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.webp`
