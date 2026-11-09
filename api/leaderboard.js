import { ensureSchema } from '../lib/db.js'
import { dbApiError } from '../lib/dbError.js'

export default async function handler(req, res) {
  try {
    const sql = await ensureSchema()
    // semua peserta lintas guild; frontend yang memfilter per guild
    //
    // Poin sama diurutkan menurut SIAPA YANG LEBIH DULU SAMPAI di angka itu (last_earned =
    // tanggal badge berpoin terakhirnya). Sebelumnya pemutusnya jumlah skill badge lalu nama,
    // yang tidak bermakna apa-apa: peserta berpoin identik diurutkan menurut abjad.
    //
    // NULLS LAST buat baris yang belum tersinkron ulang sejak kolomnya ada. Tidak diketahui
    // bukan berarti duluan, jadi mereka ditaruh di belakang yang tanggalnya jelas.
    // SQLite mendukung NULLS LAST sejak 3.30, jadi tidak perlu ditulis ulang secara manual
    // (kalau suatu saat ditolak, gantinya `(last_earned IS NULL), last_earned ASC`).
    const rows = await sql`
      SELECT id, guild, name, profile_url, games, skills, facil_games, facil_skills, base, mbonus, total, tier_idx, last_earned, avatar, last_synced
      FROM members
      ORDER BY total DESC, last_earned ASC NULLS LAST, skills DESC, name ASC`

    // Deduplikasi per UUID profil agar tidak ada entri ganda di leaderboard
    const seen = new Set()
    const members = []
    for (const row of rows) {
      const match = row.profile_url?.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)
      const key = match ? match[0].toLowerCase() : row.id
      if (!seen.has(key)) {
        seen.add(key)
        members.push(row)
      }
    }

    // Cache di edge: load ulang cepat (LCP). Stale-while-revalidate menyajikan cache lama
    // instan sambil refresh di background. Bust via ?t= (tombol Muat ulang) untuk data terbaru.
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    res.status(200).json({ members })
  } catch (e) {
    const { status, message } = dbApiError(e, 500)
    res.status(status).json({ error: message })
  }
}
