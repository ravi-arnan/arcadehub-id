import { isSkillBadge } from './skillCatalog.js'
import { isGame } from './gameRules.js'

// ATURAN POIN: badge mana yang menambah poin.
//
// Silabus resmi Arcade Fasilitator 2026 hanya menyebut "Badge Keahlian" (skill badge).
// Sampai 4 Agu 2026 tracker ini memakai aturan longgar "semua badge non-game di dalam
// periode dihitung badge keahlian", sehingga completion badge (course biasa, bukan lab)
// ikut menaikkan poin DAN mengisi syarat milestone. Aturannya diperketat atas keputusan
// Ravi supaya angka di tracker bisa dicocokkan dengan laporan progress resmi Google.
//
// Sekarang sebuah badge hanya berpoin kalau dia GAME atau ada di SKILL_CATALOG.
//
// SAKELAR DI BAWAH INI SATU-SATUNYA TEMPAT untuk membalik keputusan itu; menyetelnya ke
// true mengembalikan persis perilaku longgar yang lama. Jangan sebar logikanya ke tempat lain.
//
// Badge "unknown" adalah semua yang bukan game dan tidak ada di SKILL_CATALOG: completion
// badge, dan juga skill badge yang baru dirilis Google tapi belum sempat masuk katalog kita.
//
// KONSEKUENSI NYATA dari false: peserta yang mengambil skill badge baru sebelum katalog
// diperbarui akan melihat poinnya tidak naik. Karena itu jumlah badge unknown WAJIB
// ditampilkan di UI, jangan didiamkan, dan cron harian `npm run check:arcade` yang
// membandingkan katalog dengan halaman resmi Google jadi bagian dari kebenaran skor,
// bukan sekadar perawatan.
//
// Catatan kejujuran: sampai baris ini ditulis BELUM ADA konfirmasi resmi dari Google bahwa
// completion badge tidak dihitung; yang ada cuma silabus yang menyebut "Badge Keahlian".
// Cara memastikannya murah: ambil 1-2 completion badge (AI Boost Bites sekitar 10 menit),
// lalu lihat apakah kolom "Jumlah Lencana Keahlian" di laporan progress kohort naik
// keesokan harinya. Kalau naik, setel sakelar ini ke true.
export const COUNT_UNKNOWN_BADGES = false

// Klasifikasi satu badge dari judulnya. Mengembalikan { kind, counts }.
//
// Urutan pengecekan tidak boleh diubah sembarangan: game DULU. Judul game bulanan bisa
// tidak memuat kata "Arcade" sama sekali (Agustus 2026 "Spans and Plans"), dan sebaliknya
// ada course biasa yang judulnya memuat kata "Arcade Game". Game selalu menang.
export function classifyBadge(title) {
  const t = title || ''
  if (isGame(t)) return { kind: 'game', counts: true }
  if (isSkillBadge(t)) return { kind: 'skill', counts: true }
  return { kind: 'unknown', counts: COUNT_UNKNOWN_BADGES }
}
