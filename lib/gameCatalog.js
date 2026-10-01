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
// Oktober 2026 (dicek 1 Okt 2026), bertema Halloween. September sudah dipindah ke PAST_GAMES
// (m: 9) karena bulan berganti, jadi daftar ini murni game bulan berjalan.
//
// Catatan halaman resmi: kakinya masih menulis "Last refreshed: Sep 28, 2026" walaupun keenam
// kartu Oktober sudah tayang. Yang dijadikan patokan tetap access code + game id di kartunya,
// bukan stempel tanggal itu (pola yang sama terjadi saat rotasi September).
export const GAME_CATALOG = [
  { name: 'Arcade Base Camp', short: 'Base Camp', title: 'Arcade Base Camp October 2026', game: 7499, code: '1q-basecamp-61332', img: '/img/game-basecamp.webp', re: /base ?camp october/i },
  { name: 'Arcade Adventure', short: 'Adventure', title: 'Arcade Adventure: Google Cloud ML APIs', sub: 'Google Cloud ML APIs', game: 7496, code: '1q-endpoint-01297', img: '/img/game-adventure.webp', re: /adventure.*ml apis/i },
  // Bukan /multimodal/i polos: skill badge 981, 1232, dan 1240 memuat kata itu, tapi bukan game.
  { name: 'Arcade Voyage', short: 'Voyage', title: 'Arcade Voyage: Language, Voice, and Multimodal Processing', sub: 'Language, Voice, and Multimodal Processing', game: 7497, code: '1q-synthesis-10713', img: '/img/game-voyage.webp', re: /voyage.*multimodal/i },
  // Bukan /load balancing/i polos: badge 648 dan 1558 memuat frasa itu, tapi bukan game.
  { name: 'Arcade Trail', short: 'Trail', title: 'Arcade Trail: Containers & Load Balancing', sub: 'Containers & Load Balancing', game: 7498, code: '1q-package-53921', img: '/img/game-trail.webp', re: /trail.*load balancing/i },
  // Game spesial Halloween. Judul resminya cuma "Trick-or-Metric" (tanpa awalan Arcade), jadi
  // pola generik di parseProfile melewatkannya kalau regex ini tidak ada. Pola yang sama sudah
  // menimpa "Spans and Plans" (Agustus) dan "Pitch Perfect" (September).
  { name: 'Arcade Special', short: 'Special', title: 'Trick-or-Metric', sub: 'Trick-or-Metric', game: 7501, code: '1q-spooky-33057', img: '/img/game-special.webp', re: /trick-?or-?metric/i },
  { name: 'Arcade Simulator', short: 'Simulator', title: 'Arcade Simulator: Site Reliability Engineer', sub: 'Site Reliability Engineer', game: 7500, code: '1q-reliability-21924', img: '/img/game-new.webp', re: /simulator.*site reliability/i },
]
