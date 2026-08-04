import { gamePoints } from './pastGames.js'
import { GAME_CATALOG } from './gameCatalog.js'

// Parse a public Google Cloud Skills Boost profile (skills.google / cloudskillsboost.google)
// and estimate Arcade Facilitator points. Best-effort: badge classification uses
// name heuristics because Google exposes no official API.

// Total poin Arcade = sepanjang Season 2026 (badge di luar ini diabaikan).
export const PROGRAM_START = new Date('2026-01-01T00:00:00+07:00')
export const PROGRAM_END = new Date('2026-12-31T23:59:59+07:00')

// Milestone fasilitator HANYA menghitung badge yang di-earn dalam periode program
// fasilitator (dibuka 13 Jul 2026). Badge sebelum ini tidak mengisi milestone.
export const FACIL_START = new Date('2026-07-13T00:00:00+07:00')
export const FACIL_END = new Date('2026-09-14T23:59:59+07:00')

// Arcade GAME badge name signals (each = 1 point). Everything else earned in-window
// that looks like a lab/skill badge counts toward skill badges (2 = 1 point).
const GAME_PATTERNS = [
  // "arcade" DIIKAT ke awal judul. Sebagai kata bebas di tengah judul, dia menyambar course
  // biasa: completion badge 1467 "AI Boost Bites: Create Your Own Retro Arcade Game" terhitung
  // 1 poin game dan mengisi satu slot game milestone, padahal itu course 10 menit senilai
  // 0,5 poin. Badge game asli selalu diawali "Arcade ..." atau tertangkap dua pola di sebelahnya.
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
function isGame(title) {
  return GAME_PATTERNS.some((re) => re.test(title)) || GAME_CATALOG.some((g) => g.re.test(title))
}

// kategori untuk breakdown: skill / basecamp / level / trivia / game (arcade lain)
export function categorize(title) {
  if (!isGame(title)) return 'skill'
  const t = title.toLowerCase()
  if (/base ?camp/.test(t)) return 'basecamp'
  if (/\blevel [123]\b/.test(t)) return 'level'
  if (/\btrivia\b/.test(t)) return 'trivia'
  return 'game'
}

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ').trim()
}

export function parseProfile(html) {
  const nameM = html.match(/<h1[^>]*class="[^"]*ql-display-small[^"]*"[^>]*>([^<]+)<\/h1>/) ||
    html.match(/<h1[^>]*>([^<]+)<\/h1>/)
  const name = nameM ? decodeEntities(nameM[1]) : null

  const badges = []
  // badge = title span followed by "Earned <date>" body span.
  // Note: single-digit days render with two spaces ("Jul  7"), so allow \s+ and collapse.
  const re = /ql-title-medium[^>]*>\s*([^<]+?)\s*<\/span>\s*<span[^>]*ql-body-medium[^>]*>\s*Earned\s+([A-Za-z]+\s+\d{1,2},\s*\d{4})/g
  let m
  while ((m = re.exec(html))) {
    const title = decodeEntities(m[1])
    const raw = m[2].replace(/\s+/g, ' ').trim()
    const earned = new Date(raw + ' 00:00:00 GMT-0700') // parse as Pacific-time day (Skills Boost display TZ); OK for 2026 window boundaries
    badges.push({ title, earned: isNaN(earned) ? null : earned, raw })
  }
  return { name, badges }
}

const inRange = (b, s, e) => b.earned && b.earned >= s && b.earned <= e

// Season = semua badge 2026 (untuk total poin). Facil = subset periode fasilitator (untuk milestone).
export function computePoints(badges) {
  const season = badges.filter((b) => inRange(b, PROGRAM_START, PROGRAM_END))
  const facil = badges.filter((b) => inRange(b, FACIL_START, FACIL_END))
  const sGames = season.filter((b) => isGame(b.title))
  const sSkills = season.filter((b) => !isGame(b.title))
  const fGames = facil.filter((b) => isGame(b.title))
  const fSkills = facil.filter((b) => !isGame(b.title))
  return {
    seasonGames: sGames.length,
    // Base poin pakai bobot, bukan jumlah: game spesial Jan-Jun bernilai 2-3 poin.
    seasonGamePoints: sGames.reduce((n, b) => n + gamePoints(b.title), 0),
    seasonSkills: sSkills.length,
    facilGames: fGames.length,
    facilSkills: fSkills.length,
    gameList: sGames.map((b) => b.title),
    skillList: sSkills.map((b) => b.title),
    seasonBadges: season.map((b) => ({ title: b.title, earned: b.earned ? b.earned.toISOString() : null, cat: categorize(b.title) })),
    totalBadges: badges.length,
    inWindowBadges: season.length,
  }
}

export function summarize(html) {
  const { name, badges } = parseProfile(html)
  return { name, ...computePoints(badges) }
}
