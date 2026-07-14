import { ensureSchema } from '../lib/db.js'

const ADMIN = process.env.ADMIN_KEY || ''

// Admin-only: delete a bogus/duplicate entry (any guild). Requires ADMIN_KEY.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { id, adminKey } = req.body || {}
    if (!ADMIN || adminKey !== ADMIN) return res.status(403).json({ error: 'Butuh kunci admin.' })
    if (!id) return res.status(400).json({ error: 'id wajib' })
    const sql = await ensureSchema()
    await sql`DELETE FROM members WHERE id = ${id}`
    res.status(200).json({ ok: true })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
}
