import { ensureSchema } from './db.js'

export function clientIp(req) {
  const xff = req.headers['x-forwarded-for']
  if (xff) return String(xff).split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

// DB-backed per-IP limiter (fixed window). Fail-open on DB error.
export async function rateLimit(ip, max = 15, windowSec = 60) {
  if (!ip || ip === 'unknown') return true
  try {
    const sql = await ensureSchema()
    const bucket = `${ip}:${Math.floor(Date.now() / (windowSec * 1000))}`
    const rows = await sql`
      INSERT INTO rate_limits (k, cnt, ts) VALUES (${bucket}, 1, now())
      ON CONFLICT (k) DO UPDATE SET cnt = rate_limits.cnt + 1
      RETURNING cnt`
    // opportunistic cleanup of old buckets
    if (Math.random() < 0.03) { try { await sql`DELETE FROM rate_limits WHERE ts < now() - interval '10 minutes'` } catch { /* ignore */ } }
    return (rows[0]?.cnt || 1) <= max
  } catch {
    return true
  }
}
