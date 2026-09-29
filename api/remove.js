import { ensureSchema, batch, stmt } from '../lib/db.js'
import { dbApiError } from '../lib/dbError.js'

const ADMIN = process.env.ADMIN_KEY || ''

// Admin-only: delete a bogus/duplicate entry (any guild). Requires ADMIN_KEY.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { id, adminKey } = req.body || {}
    if (!ADMIN || adminKey !== ADMIN) return res.status(403).json({ error: 'Butuh kunci admin.' })
    if (!id) return res.status(400).json({ error: 'id wajib' })
    // ensureSchema() dipanggil dulu supaya tabelnya pasti ada sebelum transaksi di bawah.
    await ensureSchema()
    // point_history dihapus eksplisit: ON DELETE CASCADE butuh PRAGMA foreign_keys=ON per
    // koneksi dan itu tidak dijamin menempel lewat HTTP, sedangkan histori peserta yang
    // dihapus TIDAK boleh tertinggal. Satu transaksi supaya tidak berhenti setengah jalan.
    await batch(
      stmt`DELETE FROM point_history WHERE member_id = ${id}`,
      stmt`DELETE FROM members WHERE id = ${id}`,
    )
    res.status(200).json({ ok: true })
  } catch (e) {
    const { status, message } = dbApiError(e, 400)
    res.status(status).json({ error: message })
  }
}
