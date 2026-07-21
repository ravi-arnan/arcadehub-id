import { ensureSchema } from '../lib/db.js'
import { rateLimit, clientIp } from '../lib/ratelimit.js'

// Self-service: peserta menghapus entri LEADERBOARD-nya sendiri. Otorisasi via remove_token
// rahasia (dibuat saat join pertama, hanya dipegang pemilik). id & profile_url publik jadi
// tidak cukup sebagai bukti; token wajib. Non-destruktif: bisa gabung lagi kapan saja.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    if (!(await rateLimit(clientIp(req), 12))) return res.status(429).json({ error: 'Terlalu banyak permintaan. Tunggu sebentar.' })
    const { id, token } = req.body || {}
    if (!id || !token) return res.status(400).json({ error: 'id dan token wajib.' })
    const sql = await ensureSchema()
    const rows = await sql`DELETE FROM members WHERE id = ${id} AND remove_token = ${token} RETURNING id`
    if (!rows.length) return res.status(403).json({ error: 'Tidak bisa memverifikasi kepemilikan entri ini.' })
    res.status(200).json({ ok: true })
  } catch (e) {
    res.status(400).json({ error: e.message || 'Gagal keluar dari leaderboard.' })
  }
}
