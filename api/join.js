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
    const guild = raw ? raw.toUpperCase() : DEFAULT_GUILD

    const url = normalizeProfileUrl(profileUrl)
    if (!url) return res.status(400).json({ error: 'Link profil tidak valid. Pakai link public profile Cloud Skills Boost.' })

    const s = await fetchAndScore(url)
    const displayName = ((name && String(name).trim()) || s.name || 'Peserta').slice(0, 60)

    const sql = await ensureSchema()
    const id = crypto.randomUUID()
    await sql`
      INSERT INTO members (id, guild, name, profile_url, games, skills, facil_games, facil_skills, base, mbonus, total, tier_idx, last_synced)
      VALUES (${id}, ${guild}, ${displayName}, ${url}, ${s.games}, ${s.skills}, ${s.facilGames}, ${s.facilSkills}, ${s.base}, ${s.mbonus}, ${s.total}, ${s.tierIdx}, now())
      ON CONFLICT (profile_url) DO UPDATE SET
        guild = EXCLUDED.guild, name = EXCLUDED.name, games = EXCLUDED.games, skills = EXCLUDED.skills,
        facil_games = EXCLUDED.facil_games, facil_skills = EXCLUDED.facil_skills,
        base = EXCLUDED.base, mbonus = EXCLUDED.mbonus, total = EXCLUDED.total, tier_idx = EXCLUDED.tier_idx, last_synced = now()`

    const rows = await sql`SELECT id FROM members WHERE profile_url = ${url}`
    res.status(200).json({ ok: true, id: rows[0]?.id, guild, member: { ...s, name: displayName, profileUrl: url, guild } })
  } catch (e) {
    res.status(400).json({ error: e.message || 'Gagal memproses.' })
  }
}
