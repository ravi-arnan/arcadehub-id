import { parseProfile, computePoints } from './parseProfile.js'
import { scoreProfile } from './points.js'

// SSRF guard: only allow Google Cloud Skills Boost public-profile URLs.
const ALLOWED_HOSTS = new Set([
  'www.cloudskillsboost.google', 'cloudskillsboost.google',
  'www.skills.google', 'skills.google',
])
const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'

// Follow redirects manually, re-validating each hop's host (cloudskillsboost.google
// redirects to skills.google, both allowed, but never follow off-allowlist).
async function safeFetch(startUrl) {
  let url = startUrl
  for (let hop = 0; hop < 4; hop++) {
    let res
    try {
      res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'manual', signal: AbortSignal.timeout(9000) })
    } catch (e) {
      throw new Error(e?.name === 'TimeoutError' ? 'Profil terlalu lama merespons. Coba lagi.' : 'Gagal mengambil profil. Cek koneksi atau link.')
    }
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get('location')
      let next
      try { next = new URL(loc, url) } catch { throw new Error('Redirect tidak valid.') }
      if (next.protocol !== 'https:' || !ALLOWED_HOSTS.has(next.hostname)) throw new Error('Redirect ke host tidak diizinkan.')
      url = next.toString()
      continue
    }
    return res
  }
  throw new Error('Terlalu banyak redirect.')
}

// Accept a full URL or a bare profile UUID; return a canonical, validated URL or null.
export function normalizeProfileUrl(input) {
  if (!input || typeof input !== 'string') return null
  let s = input.trim()
  if (UUID.test(s) && !s.includes('/')) {
    return `https://www.cloudskillsboost.google/public_profiles/${s.match(UUID)[0]}`
  }
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s
  let u
  try { u = new URL(s) } catch { return null }
  if (!ALLOWED_HOSTS.has(u.hostname)) return null
  const m = u.pathname.match(new RegExp(`/public_profiles/(${UUID.source})`, 'i'))
  if (!m) return null
  return `https://${u.hostname}/public_profiles/${m[1]}`
}

export async function fetchAndScore(profileUrl) {
  const res = await safeFetch(profileUrl)
  if (!res.ok) throw new Error('Profil tidak bisa diakses. Pastikan profil di-set PUBLIC.')
  const html = await res.text()
  const { name, badges, avatar } = parseProfile(html)
  // Profil PUBLIC yang valid selalu me-render nama member (h1). Nama terbaca + 0 badge =
  // akun baru yang sah (skor 0, tetap boleh masuk leaderboard). Nama TIDAK terbaca = profil
  // privat / link salah / markup berubah -> baru error.
  if (!name && badges.length === 0) throw new Error('Profil tidak terbaca. Pastikan profil di-set PUBLIC dan link benar.')
  const p = computePoints(badges)
  const sc = scoreProfile(p.seasonGamePoints, p.seasonSkills, p.facilGames, p.facilSkills)
  return {
    name,
    games: p.seasonGames,       // total 2026 (untuk tampilan + base)
    skills: p.seasonSkills,
    facilGames: p.facilGames,   // periode fasilitator (untuk milestone)
    facilSkills: p.facilSkills,
    base: sc.base,
    mbonus: sc.mbonus,
    total: sc.total,
    tierIdx: sc.milestoneIdx,   // milestone fasilitator tertinggi (dipakai leaderboard + "Tercapai")
    totalBadges: p.totalBadges,
    // Badge di dalam periode yang TIDAK menambah poin (completion badge, atau skill badge
    // baru yang belum masuk katalog). Ikut dikirim supaya UI bisa menjelaskan selisih antara
    // jumlah badge di profil dan jumlah yang dihitung, bukan membiarkan orang menebak.
    seasonUnknown: p.seasonUnknown,
    unknownList: p.unknownList,
    gameList: p.gameList,
    skillList: p.skillList,
    seasonBadges: p.seasonBadges,
    // ISO date (YYYY-MM-DD), siap ditulis ke kolom `date` di Postgres.
    lastEarned: p.lastEarned ? p.lastEarned.toISOString().slice(0, 10) : null,
    avatar,
  }
}
