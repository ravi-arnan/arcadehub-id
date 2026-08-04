import { GAME_CATALOG } from './gameCatalog.js'

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
]

// Pola generik di atas TIDAK cukup: Google kadang merilis game yang judulnya tidak memuat kata
// "Arcade" sama sekali (Agustus 2026: "Spans and Plans"). Badge seperti itu diam-diam terhitung
// sebagai badge keahlian, jadi nilainya 0,5 poin bukan 1 DAN tidak mengisi syarat game milestone.
// GAME_CATALOG sudah punya regex persis per game bulan berjalan, jadi dipakai sekalian di sini
// ketimbang menyalin polanya ke dua tempat.
export function isGame(title) {
  const t = title || ''
  return GAME_PATTERNS.some((re) => re.test(t)) || GAME_CATALOG.some((g) => g.re.test(t))
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
