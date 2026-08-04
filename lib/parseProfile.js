import { gamePoints } from './pastGames.js'
import { isGame, categorize } from './gameRules.js'
import { classifyBadge } from './scoring.js'

export { categorize }

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

  // Badge keahlian sekarang HARUS ada di SKILL_CATALOG, tidak lagi "apa pun yang bukan game".
  // Aturannya dipusatkan di lib/scoring.js, termasuk sakelar untuk membalik keputusan ini.
  const isSkill = (b) => { const c = classifyBadge(b.title); return c.kind === 'skill' && c.counts }
  const isUnknown = (b) => classifyBadge(b.title).kind === 'unknown'

  const sGames = season.filter((b) => isGame(b.title))
  const sSkills = season.filter(isSkill)
  const fGames = facil.filter((b) => isGame(b.title))
  const fSkills = facil.filter(isSkill)
  // Badge di dalam periode yang tidak berpoin: completion badge, atau skill badge baru yang
  // belum masuk katalog. Dihitung dan dikirim ke frontend supaya bisa ditampilkan, bukan
  // hilang diam-diam. Ini satu-satunya cara peserta tahu kenapa angkanya lebih kecil dari
  // jumlah badge yang mereka lihat di profil.
  const sUnknown = season.filter(isUnknown)

  return {
    seasonGames: sGames.length,
    // Base poin pakai bobot, bukan jumlah: game spesial Jan-Jun bernilai 2-3 poin.
    seasonGamePoints: sGames.reduce((n, b) => n + gamePoints(b.title), 0),
    seasonSkills: sSkills.length,
    facilGames: fGames.length,
    facilSkills: fSkills.length,
    seasonUnknown: sUnknown.length,
    gameList: sGames.map((b) => b.title),
    skillList: sSkills.map((b) => b.title),
    unknownList: sUnknown.map((b) => b.title),
    seasonBadges: season.map((b) => ({
      title: b.title,
      earned: b.earned ? b.earned.toISOString() : null,
      cat: categorize(b.title),
      // Dipakai UI untuk meredupkan badge yang tidak menambah poin.
      counts: classifyBadge(b.title).counts,
    })),
    totalBadges: badges.length,
    inWindowBadges: season.length,
  }
}

export function summarize(html) {
  const { name, badges } = parseProfile(html)
  return { name, ...computePoints(badges) }
}
