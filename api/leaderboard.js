import { ensureSchema } from '../lib/db.js'

export default async function handler(req, res) {
  try {
    const sql = await ensureSchema()
    // semua peserta lintas guild; frontend yang memfilter per guild
    const rows = await sql`
      SELECT id, guild, name, profile_url, games, skills, facil_games, facil_skills, base, mbonus, total, tier_idx, last_synced
      FROM members
      ORDER BY total DESC, skills DESC, name ASC`
    // Cache di edge: load ulang cepat (LCP). Stale-while-revalidate menyajikan cache lama
    // instan sambil refresh di background. Bust via ?t= (tombol Muat ulang) untuk data terbaru.
    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=60')
    res.status(200).json({ members: rows })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
