// Game Arcade bulan berjalan. Ditaruh di lib/ (bukan src/) karena BUKAN cuma data tampilan:
// `lib/parseProfile.js` memakainya untuk memutuskan sebuah badge itu game atau badge keahlian,
// dan file itu jalan di serverless `api/*` yang tidak boleh mengimpor apa pun dari src/.
// `src/catalog.js` me-re-export dari sini supaya sisi UI tetap mengimpor dari satu tempat.
//
// Access code + game id (skills.google/games/{game}) berubah TIAP BULAN.
// Sumber: go.cloudskillsboost.google/arcade. Update bulanan.
// Agustus 2026 (dicek 3 Agu 2026). Trail sudah dibuka lagi, jadi tidak ada lagi entri `off`.
//
// `re` HARUS memuat penanda khas bulan ini (nama tema atau bulannya), bukan cuma kata generik
// seperti /base ?camp/ atau /voyage/. Judul badge Juli ("Arcade Base Camp July", "Arcade Voyage:
// July 2026") ikut tersimpan di profil peserta, jadi regex generik membuat game bulan lalu
// terbaca sebagai game bulan ini dan statusnya salah jadi "Selesai".
// `title` = judul resmi badge (dari <title> skills.google/games/{id}), dipakai test untuk
// membuktikan tiap regex cocok dengan judulnya sendiri dan tidak dengan game lain.
export const GAME_CATALOG = [
  { name: 'Arcade Base Camp', short: 'Base Camp', title: 'Arcade Base Camp August 2026', game: 7394, code: '1q-basecamp-10219', img: '/img/game-basecamp.webp', re: /base ?camp august/i },
  { name: 'Arcade Adventure', short: 'Adventure', title: 'Arcade Adventure: Data Vault', sub: 'Data Vault', game: 7395, code: '1q-datamgt-92372', img: '/img/game-adventure.webp', re: /adventure.*data vault/i },
  // Bukan /google sheets/i polos: skill badge 776 "Use Functions, Formulas, and Charts in Google
  // Sheets" akan ikut kena.
  { name: 'Arcade Voyage', short: 'Voyage', title: 'Arcade Voyage: Google Sheets', sub: 'Google Sheets', game: 7398, code: '1q-sheets-29185', img: '/img/game-voyage.webp', re: /voyage.*sheets/i },
  { name: 'Arcade Trail', short: 'Trail', title: 'Arcade Trail: Cloud Delivery Systems', sub: 'Cloud Delivery Systems', game: 7396, code: '1q-delivery-31058', img: '/img/game-trail.webp', re: /trail.*cloud delivery/i },
  // Judul resmi game spesial bulan ini cuma "Spans and Plans" (tanpa awalan Arcade). Inilah alasan
  // GAME_CATALOG dipindah ke lib/: judul tanpa kata "Arcade" tidak tertangkap pola generik di
  // parseProfile, jadi badge-nya kehitung 0,5 poin sebagai badge keahlian, bukan 1 poin game.
  { name: 'Arcade Special', short: 'Special', title: 'Spans and Plans', sub: 'Spans and Plans', game: 7399, code: '1q-schema-27083', img: '/img/game-special.webp', re: /spans ?and ?plans/i },
  // Bukan /network security/i polos: badge 1412 "Designing Network Security in Google Cloud" akan
  // ikut kena dan salah di-link ke halaman game. 1412 sudah dikeluarkan dari SKILL_CATALOG (mati
  // 4 Agu 2026), tapi judulnya masih tersimpan di profil peserta yang terlanjur mengambilnya,
  // jadi alasan regex ini tetap berlaku.
  { name: 'Arcade Simulator', short: 'Simulator', title: 'Arcade Simulator: Network Security Engineer', sub: 'Network Security Engineer', game: 7397, code: '1q-network-51470', img: '/img/game-new.webp', re: /simulator.*network security/i },
]
