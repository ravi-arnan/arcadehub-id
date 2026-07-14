import { fetchAndScore, normalizeProfileUrl } from '../lib/fetchProfile.js'
import { rateLimit, clientIp } from '../lib/ratelimit.js'

// Public self-check: hitung poin dari sebuah profil TANPA menyimpan ke DB.
export default async function handler(req, res) {
  try {
    if (!(await rateLimit(clientIp(req), 20))) return res.status(429).json({ error: 'Terlalu banyak permintaan. Tunggu sebentar.' })
    const raw = req.query?.url || (req.body && req.body.url)
    const url = normalizeProfileUrl(raw)
    if (!url) return res.status(400).json({ error: 'Link profil tidak valid. Pakai link public profile Cloud Skills Boost.' })
    const s = await fetchAndScore(url)
    res.status(200).json({ ok: true, profileUrl: url, ...s })
  } catch (e) {
    res.status(400).json({ error: e.message || 'Gagal memproses.' })
  }
}
