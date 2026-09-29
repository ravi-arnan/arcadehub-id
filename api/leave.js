import { ensureSchema, batch, stmt } from '../lib/db.js'
import { rateLimit, clientIp } from '../lib/ratelimit.js'
import { dbApiError } from '../lib/dbError.js'

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
    // Urutannya penting: verifikasi kepemilikan DULU, baru hapus.
    //
    // Dulu ini satu statement `DELETE FROM members WHERE ... AND remove_token = ... RETURNING id`
    // yang sekaligus jadi penjaga otorisasinya. Karena point_history sekarang dihapus manual
    // (bukan lewat ON DELETE CASCADE, lihat catatan di lib/schema.js), menghapus histori lebih
    // dulu akan membuang data peserta lain yang tokennya salah.
    const own = await sql`SELECT id FROM members WHERE id = ${id} AND remove_token = ${token}`
    if (!own.length) return res.status(403).json({ error: 'Tidak bisa memverifikasi kepemilikan entri ini.' })
    // Satu transaksi, supaya syarat privasi (histori orang yang menarik diri tidak boleh
    // tertinggal) tetap terpenuhi tanpa bergantung pada PRAGMA foreign_keys.
    await batch(
      stmt`DELETE FROM point_history WHERE member_id = ${id}`,
      stmt`DELETE FROM members WHERE id = ${id} AND remove_token = ${token}`,
    )
    res.status(200).json({ ok: true })
  } catch (e) {
    const { status, message } = dbApiError(e, 400)
    res.status(status).json({ error: message })
  }
}
