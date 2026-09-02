// Game Arcade bulan berjalan. Ditaruh di lib/ (bukan src/) karena BUKAN cuma data tampilan:
// `lib/parseProfile.js` memakainya untuk memutuskan sebuah badge itu game atau badge keahlian,
// dan file itu jalan di serverless `api/*` yang tidak boleh mengimpor apa pun dari src/.
// `src/catalog.js` me-re-export dari sini supaya sisi UI tetap mengimpor dari satu tempat.
//
// Access code + game id (skills.google/games/{game}) berubah TIAP BULAN.
// Sumber: go.cloudskillsboost.google/arcade. Update bulanan.
// September 2026 (dicek 2 Sep 2026).
//
// `re` HARUS memuat penanda khas bulan ini (nama tema atau bulannya), bukan cuma kata generik
// seperti /base ?camp/ atau /voyage/. Judul badge Agustus ("Arcade Base Camp August 2026",
// "Arcade Adventure: Data Vault") ikut tersimpan di profil peserta, jadi regex generik membuat
// game bulan lalu terbaca sebagai game bulan ini dan statusnya salah jadi "Selesai".
// `title` = judul resmi badge (dari <title> skills.google/games/{id}), dipakai test untuk
// membuktikan tiap regex cocok dengan judulnya sendiri dan tidak dengan game lain.
export const GAME_CATALOG = [
  { name: 'Arcade Base Camp', short: 'Base Camp', title: 'Arcade Base Camp September 2026', game: 7444, code: '1q-basecamp-09304', img: '/img/game-basecamp.webp', re: /base ?camp september/i },
  { name: 'Arcade Adventure', short: 'Adventure', title: 'Arcade Adventure: Modern Cloud Architecture', sub: 'Modern Cloud Architecture', game: 7441, code: '1q-architecture-01381', img: '/img/game-adventure.webp', re: /adventure.*modern cloud architecture/i },
  // Bukan /microservice/i polos: skill badge 741 "Develop Serverless Applications on Cloud Run"
  // dan lab "Build a Resilient, Asynchronous System with Cloud Run and Pub/Sub" memuat kata itu,
  // tapi keduanya bukan badge game.
  { name: 'Arcade Voyage', short: 'Voyage', title: 'Arcade Voyage: App Modernization', sub: 'App Modernization', game: 7442, code: '1q-microservice-9210', img: '/img/game-voyage.webp', re: /voyage.*app modernization/i },
  { name: 'Arcade Trail', short: 'Trail', title: 'Arcade Trail: Data Engineering and Security', sub: 'Data Engineering and Security', game: 7443, code: '1q-vpcpeering-3469', img: '/img/game-trail.webp', re: /trail.*data engineering/i },
  // Judul resmi game spesial bulan ini cuma "Pitch Perfect" (tanpa awalan Arcade). Inilah alasan
  // GAME_CATALOG dipindah ke lib/: judul tanpa kata "Arcade" tidak tertangkap pola generik di
  // parseProfile, jadi badge-nya kehitung 0,5 poin sebagai badge keahlian, bukan 1 poin game.
  // (Kejadian yang sama bulan lalu: "Spans and Plans".)
  { name: 'Arcade Special', short: 'Special', title: 'Pitch Perfect', sub: 'Pitch Perfect', game: 7446, code: '1q-analysis-5026', img: '/img/game-special.webp', re: /pitch ?perfect/i },
  // Bukan /devops/i polos: judul badge game ini memang "Arcade Simulator: DevOps Engineer", dan
  // tidak ada skill badge yang memuat kata "simulator" + "devops", tapi polanya tetap diikat
  // supaya konsisten dengan bulan-bulan sebelumnya dan tidak menyambar apa pun di luar game.
  { name: 'Arcade Simulator', short: 'Simulator', title: 'Arcade Simulator: DevOps Engineer', sub: 'DevOps Engineer', game: 7445, code: '1q-devops-065131', img: '/img/game-new.webp', re: /simulator.*devops/i },
]
