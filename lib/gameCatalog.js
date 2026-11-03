// Game Arcade bulan berjalan. Ditaruh di lib/ (bukan src/) karena BUKAN cuma data tampilan:
// `lib/parseProfile.js` memakainya untuk memutuskan sebuah badge itu game atau badge keahlian,
// dan file itu jalan di serverless `api/*` yang tidak boleh mengimpor apa pun dari src/.
// `src/catalog.js` me-re-export dari sini supaya sisi UI tetap mengimpor dari satu tempat.
//
// Access code + game id (skills.google/games/{game}) berubah TIAP BULAN.
// Sumber: go.cloudskillsboost.google/arcade. Update bulanan.
//
// `re` HARUS memuat penanda khas bulan ini (nama tema atau bulannya), bukan cuma kata generik
// seperti /base ?camp/ atau /voyage/. Judul badge Agustus ("Arcade Base Camp August 2026",
// "Arcade Adventure: Data Vault") ikut tersimpan di profil peserta, jadi regex generik membuat
// game bulan lalu terbaca sebagai game bulan ini dan statusnya salah jadi "Selesai".
// `title` = judul resmi badge (dari <title> skills.google/games/{id}), dipakai test untuk
// membuktikan tiap regex cocok dengan judulnya sendiri dan tidak dengan game lain.
//
// November 2026 (dicek 2 Nov 2026). Oktober sudah dipindah ke PAST_GAMES (m: 10)
// karena bulan berganti, jadi daftar ini murni game bulan berjalan.
export const GAME_CATALOG = [
  { name: 'Arcade Base Camp', short: 'Base Camp', title: 'Arcade Base Camp November 2026', game: 7564, code: '1q-basecamp-02108', img: '/img/game-basecamp.webp', re: /base ?camp november/i },
  { name: 'Arcade Adventure', short: 'Adventure', title: 'Arcade Adventure: Cloud Infrastructure & App Scale', sub: 'Cloud Infrastructure & App Scale', game: 7561, code: '1q-cluster-51301', img: '/img/game-adventure.webp', re: /adventure.*(cloud infra|app scale)/i },
  { name: 'Arcade Voyage', short: 'Voyage', title: 'Arcade Voyage: Python Apps & Data Analytics', sub: 'Python Apps & Data Analytics', game: 7562, code: '1q-analytics-29273', img: '/img/game-voyage.webp', re: /voyage.*(python apps|data analytics)/i },
  { name: 'Arcade Trail', short: 'Trail', title: 'Arcade Trail: Cloud Security & GKE Cost Control', sub: 'Cloud Security & GKE Cost Control', game: 7563, code: '1q-machine-42361', img: '/img/game-trail.webp', re: /trail.*(cloud security|gke cost)/i },
  // Game spesial perayaan Diwali. Judul resminya "Diwali in the Cloud" (tanpa awalan Arcade).
  { name: 'Arcade Special', short: 'Special', title: 'Diwali in the Cloud', sub: 'Diwali in the Cloud', game: 7565, code: '1q-diwali-10000', img: '/img/game-special.webp', re: /diwali/i },
  { name: 'Arcade Simulator', short: 'Simulator', title: 'Arcade Simulator: Cloud Infrastructure Engineer', sub: 'Cloud Infrastructure Engineer', game: 7566, code: '1q-infraeng-41850', img: '/img/game-new.webp', re: /simulator.*cloud infrastructure/i },
]
