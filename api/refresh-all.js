import { ensureSchema } from '../lib/db.js'
import { fetchAndScore } from '../lib/fetchProfile.js'

// Sinkron ulang semua peserta leaderboard. Dipanggil otomatis oleh Vercel Cron (harian),
// atau manual dengan ?adminKey=<ADMIN_KEY>.
export const config = { maxDuration: 60 }

const BATCH = 60            // maksimal peserta per run (yang paling lama tak disinkron duluan)
const CONCURRENCY = 4       // fetch paralel ke Cloud Skills Boost
const TIME_BUDGET_MS = 50000

function authorized(req) {
  const secret = process.env.CRON_SECRET
  if (secret && req.headers.authorization === `Bearer ${secret}`) return true // Vercel Cron
  const admin = process.env.ADMIN_KEY
  if (admin && req.query?.adminKey === admin) return true                     // manual
  return false
}

export default async function handler(req, res) {
  if (!authorized(req)) return res.status(401).json({ error: 'Unauthorized' })
  const startedAt = Date.now()
  try {
    const sql = await ensureSchema()
    const rows = await sql`SELECT id, profile_url FROM members ORDER BY last_synced ASC LIMIT ${BATCH}`

    let ok = 0, failed = 0, skipped = 0
    const queue = [...rows]
    const worker = async () => {
      while (queue.length) {
        if (Date.now() - startedAt > TIME_BUDGET_MS) { skipped += queue.length; queue.length = 0; break }
        const m = queue.shift()
        try {
          const s = await fetchAndScore(m.profile_url)
          await sql`
            UPDATE members SET games = ${s.games}, skills = ${s.skills}, facil_games = ${s.facilGames},
              facil_skills = ${s.facilSkills}, base = ${s.base}, mbonus = ${s.mbonus}, total = ${s.total},
              tier_idx = ${s.tierIdx}, last_synced = now()
            WHERE id = ${m.id}`
          ok++
        } catch { failed++ } // profil privat/tak terjangkau, biarkan data lama, lanjut
      }
    }
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, rows.length) }, worker))

    // Snapshot poin harian, dasar untuk leaderboard mingguan. Menyapu SEMUA anggota lewat
    // satu statement, bukan cuma `rows`: BATCH membatasi berapa profil yang di-fetch ulang
    // dari Google, sedangkan histori harus lengkap tiap hari supaya selisih mingguan tidak
    // bolong untuk peserta yang kebetulan tidak kebagian batch hari itu.
    //
    // try terpisah: menyinkron poin adalah tugas utama dan sudah berhasil di titik ini.
    // Snapshot gagal tidak boleh membuat cron dilaporkan merah dan memicu retry sia-sia.
    let snapshot = 0
    let snapshotError = null
    try {
      const snap = await sql`
        INSERT INTO point_history (member_id, day, total, games, skills)
        SELECT id, (now() AT TIME ZONE 'Asia/Jakarta')::date, total, games, skills FROM members
        ON CONFLICT (member_id, day) DO UPDATE
          SET total = EXCLUDED.total, games = EXCLUDED.games, skills = EXCLUDED.skills
        RETURNING member_id`
      snapshot = snap.length
    } catch (e) {
      snapshotError = e.message
    }

    res.status(200).json({ ok: true, total: rows.length, refreshed: ok, failed, skipped, snapshot, snapshotError, ms: Date.now() - startedAt })
  } catch (e) {
    res.status(500).json({ error: e.message || 'Gagal refresh-all.' })
  }
}
