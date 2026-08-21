import { ensureSchema } from '../lib/db.js'
import { fetchAndScore, normalizeProfileUrl } from '../lib/fetchProfile.js'
import { rateLimit, clientIp } from '../lib/ratelimit.js'

const DEFAULT_GUILD = 'UMUM'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    if (!(await rateLimit(clientIp(req), 12))) return res.status(429).json({ error: 'Terlalu banyak permintaan. Tunggu sebentar.' })
    const { name, profileUrl, code } = req.body || {}
    const raw = code && String(code).trim().slice(0, 24)
    // guild null = tidak diberikan; saat re-sync jangan timpa guild yang sudah ada.
    const guild = raw ? raw.toUpperCase() : null

    const url = normalizeProfileUrl(profileUrl)
    if (!url) return res.status(400).json({ error: 'Link profil tidak valid. Pakai link public profile Cloud Skills Boost.' })

    const s = await fetchAndScore(url)
    const displayName = ((name && String(name).trim()) || s.name || 'Peserta').slice(0, 60)

    const sql = await ensureSchema()
    const id = crypto.randomUUID()
    const token = crypto.randomUUID()
    // xmax=0 hanya pada baris hasil INSERT (bukan UPDATE via ON CONFLICT); dipakai untuk
    // memutuskan apakah token boleh dikembalikan. Token TIDAK di-set ulang saat re-sync.
    const rows = await sql`
      INSERT INTO members (id, guild, name, profile_url, games, skills, facil_games, facil_skills, base, mbonus, total, tier_idx, last_earned, avatar, remove_token, last_synced)
      VALUES (${id}, ${guild ?? DEFAULT_GUILD}, ${displayName}, ${url}, ${s.games}, ${s.skills}, ${s.facilGames}, ${s.facilSkills}, ${s.base}, ${s.mbonus}, ${s.total}, ${s.tierIdx}, ${s.lastEarned}, ${s.avatar}, ${token}, now())
      ON CONFLICT (profile_url) DO UPDATE SET
        guild = COALESCE(${guild}, members.guild), name = EXCLUDED.name, games = EXCLUDED.games, skills = EXCLUDED.skills,
        facil_games = EXCLUDED.facil_games, facil_skills = EXCLUDED.facil_skills,
        base = EXCLUDED.base, mbonus = EXCLUDED.mbonus, total = EXCLUDED.total, tier_idx = EXCLUDED.tier_idx,
        last_earned = EXCLUDED.last_earned, avatar = EXCLUDED.avatar, last_synced = now()
      RETURNING id, guild, (xmax = 0) AS inserted, remove_token`
    const row = rows[0] || {}
    res.status(200).json({
      ok: true, id: row.id, guild: row.guild,
      // Hanya kembalikan token pada join pertama; re-sync/join oleh orang lain atas profil publik tidak dapat token.
      removeToken: row.inserted ? row.remove_token : null,
      member: { ...s, name: displayName, profileUrl: url, guild: row.guild },
    })
  } catch (e) {
    res.status(400).json({ error: e.message || 'Gagal memproses.' })
  }
}
