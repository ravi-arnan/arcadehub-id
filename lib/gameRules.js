import { GAME_CATALOG } from './gameCatalog.js'
import { PAST_GAME_KEYS } from './pastGames.js'

// Aturan pengenalan badge GAME Arcade. Dipisah dari parseProfile.js supaya lib/scoring.js
// bisa memakainya tanpa impor melingkar (parseProfile memakai scoring, bukan sebaliknya).

// Arcade GAME badge name signals (each = 1 point).
const GAME_PATTERNS = [
  // "arcade" DIIKAT ke awal judul. Sebagai kata bebas di tengah judul, dia menyambar course
  // biasa: completion badge 1467 "AI Boost Bites: Create Your Own Retro Arcade Game" terhitung
  // 1 poin game dan mengisi satu slot game milestone, padahal itu course 10 menit.
  // Badge game asli selalu diawali "Arcade ..." atau tertangkap dua pola di sebelahnya.
  /\[arcade\]/i, /^arcade\b/i, /the arcade/i,
  /\blevel [123]\b/i, /base ?camp/i, /\btrivia\b/i,
  /cloud hero/i, /\bskills? challenge\b/i,
  /safe space/i, /arcade special/i,
  // Trivia mingguan Jan-Jun 2026 dinamai "Week N: <Bulan> 2026" / "Sprint N: <Bulan> 2026"
  // tanpa kata "Arcade" atau "Trivia", jadi sebelumnya salah terhitung sebagai skill badge.
  // Diikat ke awal judul supaya tidak menyambar skill badge yang kebetulan memuat kata itu.
  /^(week|sprint) [1-9]\b/i,
  // Seri game spesial "Work Meets Play" (Jan-Jun 2026) memakai judul bertema tanpa kata
  // "Arcade": "Work Meets Play: Cloud Canvas" (Juni) tidak punya alias di PAST_GAMES, jadi
  // lolos dari isGame() dan kehitung 0 poin alih-alih 1. Sebagian seri ini sudah ada di
  // PAST_GAMES lewat `alt` dan bobotnya tetap diambil dari sana; pola ini cuma jaring pengaman
  // supaya anggota seri yang belum terdaftar tetap terbaca game. Diikat ke awal judul karena
  // tidak ada badge keahlian/completion yang dibuka dengan frasa ini.
  /^works? meets? play/i,
  // Game spesial Juni 2026 lainnya: "Logic Log" (challenge lab LookML, 1 poin). Halaman arsip
  // resmi cuma menulis label generik "Arcade Skill Up Summer"/"Arcade Expressive Efficiency" untuk
  // Juni, jadi judul aslinya tidak pernah masuk PAST_GAMES. Bukan course: tidak ada di katalog
  // course Google dan halaman badge-nya tidak menaut ke course_templates mana pun.
  // Dikonfirmasi dari perbandingan dengan ArcadeCalc (tipe levelBadge, 1 poin, 20 profil).
  /^logic log\b/i,
]

// Pola generik di atas TIDAK cukup: Google kadang merilis game yang judulnya tidak memuat kata
// "Arcade" sama sekali (Agustus 2026: "Spans and Plans", September 2026: "Pitch Perfect"). Badge
// seperti itu diam-diam terhitung sebagai badge keahlian, jadi nilainya 0,5 poin bukan 1 DAN
// tidak mengisi syarat game milestone. GAME_CATALOG sudah punya regex persis per game bulan
// berjalan, jadi dipakai sekalian di sini ketimbang menyalin polanya ke dua tempat.
//
// Begitu bulan berganti, GAME_CATALOG tidak lagi memuat judul game bulan lalu, dan yang judulnya
// tidak berawalan "Arcade" akan lolos dari GAME_PATTERNS. Karena itu PAST_GAME_KEYS (nama +
// alias semua game "Game over!") ikut dicek: game terdahulu harus tetap terbaca game supaya
// poin Season-nya tidak hilang diam-diam.
const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '')
export function isGame(title) {
  const t = title || ''
  return GAME_PATTERNS.some((re) => re.test(t)) || GAME_CATALOG.some((g) => g.re.test(t)) || PAST_GAME_KEYS.has(norm(t))
}

// Kategori untuk breakdown tampilan: skill / basecamp / level / trivia / game (arcade lain).
export function categorize(title) {
  if (!isGame(title)) return 'skill'
  const t = (title || '').toLowerCase()
  if (/base ?camp/.test(t)) return 'basecamp'
  if (/\blevel [123]\b/.test(t)) return 'level'
  if (/\btrivia\b/.test(t)) return 'trivia'
  return 'game'
}
