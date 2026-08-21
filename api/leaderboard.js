import { ensureSchema } from '../lib/db.js'

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
    const rows = await sql`
      SELECT id, guild, name, profile_url, games, skills, facil_games, facil_skills, base, mbonus, total, tier_idx, last_earned, last_synced
      FROM members
      ORDER BY total DESC, last_earned ASC NULLS LAST, skills DESC, name ASC`
    // Cache di edge: load ulang cepat (LCP). Stale-while-revalidate menyajikan cache lama
    // instan sambil refresh di background. Bust via ?t= (tombol Muat ulang) untuk data terbaru.
    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=60')
    res.status(200).json({ members: rows })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
