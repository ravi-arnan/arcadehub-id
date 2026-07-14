import { ensureSchema } from '../lib/db.js'
import { fetchAndScore } from '../lib/fetchProfile.js'
import { rateLimit, clientIp } from '../lib/ratelimit.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    if (!(await rateLimit(clientIp(req), 20))) return res.status(429).json({ error: 'Terlalu banyak permintaan. Tunggu sebentar.' })
    const sql = await ensureSchema()
    const { id } = req.body || {}
    if (!id) return res.status(400).json({ error: 'id wajib' })
    const rows = await sql`SELECT profile_url FROM members WHERE id = ${id}`
    if (!rows.length) return res.status(404).json({ error: 'Peserta tidak ditemukan' })

    const s = await fetchAndScore(rows[0].profile_url)
    await sql`
      UPDATE members SET games = ${s.games}, skills = ${s.skills}, facil_games = ${s.facilGames}, facil_skills = ${s.facilSkills},
        base = ${s.base}, mbonus = ${s.mbonus}, total = ${s.total}, tier_idx = ${s.tierIdx}, last_synced = now()
      WHERE id = ${id}`
    res.status(200).json({ ok: true, member: s })
  } catch (e) {
    res.status(400).json({ error: e.message || 'Gagal refresh.' })
  }
}
