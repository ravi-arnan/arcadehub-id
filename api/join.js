import { ensureSchema } from '../lib/db.js'
import { fetchAndScore, normalizeProfileUrl } from '../lib/fetchProfile.js'
import { rateLimit, clientIp } from '../lib/ratelimit.js'
import { dbApiError } from '../lib/dbError.js'
import { NOW } from '../lib/schema.js'

const DEFAULT_GUILD = 'UMUM'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    if (!(await rateLimit(clientIp(req), 12))) return res.status(429).json({ error: 'Terlalu banyak permintaan. Tunggu sebentar.' })
    const { name, profileUrl, code, token: clientToken } = req.body || {}
    const rawCode = code && typeof code === 'string' ? code.trim().slice(0, 24) : null
    // guild null = tidak diberikan; saat re-sync jangan timpa guild yang sudah ada.
    const guild = rawCode ? rawCode.toUpperCase() : null
    const cleanClientToken = clientToken && typeof clientToken === 'string' ? clientToken.trim().slice(0, 64) : null

    const url = normalizeProfileUrl(profileUrl)
    if (!url) return res.status(400).json({ error: 'Link profil tidak valid. Pakai link public profile Cloud Skills Boost.' })

    const s = await fetchAndScore(url)
    const displayName = ((name && typeof name === 'string' && name.trim()) || s.name || 'Peserta').slice(0, 60)

    const sql = await ensureSchema()
    const id = crypto.randomUUID()
    const token = crypto.randomUUID()
    const rows = await sql`
      INSERT INTO members (id, guild, name, profile_url, games, skills, facil_games, facil_skills, base, mbonus, total, tier_idx, last_earned, avatar, remove_token, last_synced)
      VALUES (${id}, ${guild ?? DEFAULT_GUILD}, ${displayName}, ${url}, ${s.games}, ${s.skills}, ${s.facilGames}, ${s.facilSkills}, ${s.base}, ${s.mbonus}, ${s.total}, ${s.tierIdx}, ${s.lastEarned}, ${s.avatar}, ${token}, ${NOW})
      ON CONFLICT (profile_url) DO UPDATE SET
        guild = CASE
          WHEN (members.remove_token IS NULL OR members.remove_token = ${cleanClientToken}) AND ${guild} IS NOT NULL THEN ${guild}
          ELSE members.guild
        END,
        name = CASE
          WHEN members.remove_token IS NULL OR members.remove_token = ${cleanClientToken} THEN excluded.name
          ELSE members.name
        END,
        remove_token = CASE
          WHEN members.remove_token IS NULL THEN ${token}
          ELSE members.remove_token
        END,
        games = excluded.games, skills = excluded.skills,
        facil_games = excluded.facil_games, facil_skills = excluded.facil_skills,
        base = excluded.base, mbonus = excluded.mbonus, total = excluded.total, tier_idx = excluded.tier_idx,
        last_earned = excluded.last_earned, avatar = excluded.avatar, last_synced = ${NOW}
      RETURNING id, name, guild, remove_token`
    const row = rows[0] || {}
    const isOwner = row.remove_token === token || (cleanClientToken && row.remove_token === cleanClientToken)
    res.status(200).json({
      ok: true, id: row.id, guild: row.guild,
      // Token hanya diberikan ke pembuat baru atau pemilik sah dengan token cocok
      removeToken: isOwner ? row.remove_token : null,
      member: { ...s, name: row.name || displayName, profileUrl: url, guild: row.guild },
    })
  } catch (e) {
    const { status, message } = dbApiError(e, 400)
    res.status(status).json({ error: message })
  }
}
