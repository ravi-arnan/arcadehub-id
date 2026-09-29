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
    // remove_token sengaja TIDAK ikut di-set di cabang DO UPDATE, supaya token tetap milik
    // pemilik pertama. Itu sekaligus cara kita tahu baris ini INSERT atau UPDATE.
    const rows = await sql`
      INSERT INTO members (id, guild, name, profile_url, games, skills, facil_games, facil_skills, base, mbonus, total, tier_idx, last_earned, avatar, remove_token, last_synced)
      VALUES (${id}, ${guild ?? DEFAULT_GUILD}, ${displayName}, ${url}, ${s.games}, ${s.skills}, ${s.facilGames}, ${s.facilSkills}, ${s.base}, ${s.mbonus}, ${s.total}, ${s.tierIdx}, ${s.lastEarned}, ${s.avatar}, ${token}, ${NOW})
      ON CONFLICT (profile_url) DO UPDATE SET
        guild = COALESCE(${guild}, members.guild), name = excluded.name, games = excluded.games, skills = excluded.skills,
        facil_games = excluded.facil_games, facil_skills = excluded.facil_skills,
        base = excluded.base, mbonus = excluded.mbonus, total = excluded.total, tier_idx = excluded.tier_idx,
        last_earned = excluded.last_earned, avatar = excluded.avatar, last_synced = ${NOW}
      RETURNING id, guild, remove_token`
    const row = rows[0] || {}
    res.status(200).json({
      ok: true, id: row.id, guild: row.guild,
      // Token HANYA dikembalikan kalau baris ini benar-benar hasil INSERT.
      //
      // Postgres bisa menanyakannya langsung lewat (xmax = 0). SQLite tidak punya xmax, jadi
      // caranya membandingkan remove_token yang tersimpan dengan token yang BARU dibuat di
      // request ini: pada INSERT baris itu memakai token kita, sehingga cocok. Pada
      // ON CONFLICT DO UPDATE remove_token tidak di-set, jadi nilainya tetap milik pemilik lama
      // (atau NULL) dan perbandingannya false.
      //
      // JANGAN dilonggarkan jadi `row.remove_token == null || row.remove_token === token`:
      // itu membuat siapa pun yang me-resync profil orang lain bisa mengklaim token
      // "keluar dari leaderboard" miliknya.
      removeToken: row.remove_token === token ? token : null,
      member: { ...s, name: displayName, profileUrl: url, guild: row.guild },
    })
  } catch (e) {
    const { status, message } = dbApiError(e, 400)
    res.status(status).json({ error: message })
  }
}
