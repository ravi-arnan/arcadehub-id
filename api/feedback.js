import { ensureSchema } from '../lib/db.js'
import { rateLimit, clientIp } from '../lib/ratelimit.js'

const ADMIN = process.env.ADMIN_KEY || ''

// Kirim notifikasi email via Resend (opsional, hanya jika env di-set). Fail-safe: tidak menggagalkan submit.
async function notifyEmail({ message, name, page }) {
  const key = process.env.RESEND_API_KEY
  const to = process.env.FEEDBACK_EMAIL
  if (!key || !to) return
  const from = process.env.FEEDBACK_FROM || 'Arcade Hub <onboarding@resend.dev>'
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        subject: '💬 Masukan baru, Arcade Hub',
        text: `Masukan baru dari Arcade Hub:\n\n"${message}"\n\nDari: ${name || '(tanpa nama)'}\nHalaman: ${page || '-'}\n\nBalas ke pengirim jika ada kontak. Semua masukan juga tersimpan di database.`,
      }),
      signal: AbortSignal.timeout(6000),
    })
  } catch { /* abaikan, email best-effort */ }
}

export default async function handler(req, res) {
  try {
    const sql = await ensureSchema()

    // GET (admin): baca semua masukan
    if (req.method === 'GET') {
      const key = req.query?.adminKey
      if (!ADMIN || key !== ADMIN) return res.status(403).json({ error: 'Butuh kunci admin.' })
      const rows = await sql`SELECT id, message, name, page, created_at FROM feedback ORDER BY created_at DESC LIMIT 500`
      return res.status(200).json({ feedback: rows })
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    if (!(await rateLimit(clientIp(req), 6))) return res.status(429).json({ error: 'Terlalu banyak kiriman. Coba lagi nanti.' })

    const { message, name, page } = req.body || {}
    const msg = (message && String(message).trim()) || ''
    if (msg.length < 3) return res.status(400).json({ error: 'Tulis masukan minimal 3 karakter.' })

    const cleanName = (name ? String(name).trim() : '').slice(0, 60) || null
    const cleanPage = page ? String(page).slice(0, 40) : null
    await sql`INSERT INTO feedback (id, message, name, page)
      VALUES (${crypto.randomUUID()}, ${msg.slice(0, 1000)}, ${cleanName}, ${cleanPage})`
    await notifyEmail({ message: msg.slice(0, 1000), name: cleanName, page: cleanPage })
    res.status(200).json({ ok: true })
  } catch (e) {
    res.status(400).json({ error: e.message || 'Gagal mengirim.' })
  }
}
