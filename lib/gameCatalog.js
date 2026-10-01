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
// KOSONG sejak 1 Okt 2026, dan ini keadaan SEMENTARA, bukan permanen:
//   - Game September sudah dipindah ke PAST_GAMES (m: 9) karena bulan berganti.
//   - Game Oktober BELUM diterbitkan Google saat rotasi ini dikerjakan. Halaman resmi masih
//     menampilkan keenam kartu September dengan access code aktif dan menulis
//     "Last refreshed: Sep 28, 2026", sedangkan daftar "Game over!"-nya berhenti di Agustus.
//     Jadi tidak ada judul, access code, game id, maupun art Oktober yang bisa dipakai.
//
// Mengosongkan daftar ini TIDAK menghilangkan poin: game September tetap terbaca sebagai game
// lewat PAST_GAME_KEYS di lib/pastGames.js, jadi 654 peserta tidak kehilangan 1 poin game-nya.
// Yang hilang sementara cuma kartu "game bulan ini" di UI.
//
// Begitu game Oktober terbit, isi lagi dengan 6 entri seperti bulan-bulan sebelumnya: title dari
// <title> skills.google/games/{id}, `re` memuat penanda khas Oktober, access code dari halaman
// resmi, art baru dari Ravi, lalu naikkan cache-buster `?v=` di Insights.jsx dan Catalog.jsx.
export const GAME_CATALOG = []
