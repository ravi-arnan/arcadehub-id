import { neon } from '@neondatabase/serverless'

// Find a Postgres connection string regardless of the env-var prefix the Neon/Vercel
// integration used (e.g. DATABASE_URL, POSTGRES_URL, or STORAGE_DATABASE_URL).
function findConnString() {
  const e = process.env
  if (e.DATABASE_URL) return e.DATABASE_URL
  if (e.POSTGRES_URL) return e.POSTGRES_URL
  const keys = Object.keys(e).filter((k) => e[k])
  const pooled = keys.find((k) => /(^|_)(DATABASE_URL|POSTGRES_URL)$/.test(k) && !/UNPOOLED|NON_POOLING/.test(k))
  if (pooled) return e[pooled]
  const any = keys.find((k) => /(^|_)(DATABASE_URL|POSTGRES_URL)/.test(k))
  return any ? e[any] : null
}

let _sql
export function getSql() {
  if (!_sql) {
    const conn = findConnString()
    if (!conn) throw new Error('Database belum terkonfigurasi (DATABASE_URL kosong).')
    _sql = neon(conn)
  }
  return _sql
}

let ready
// Ensures the table + constraints exist, then returns the sql tagged-template client.
export async function ensureSchema() {
  const sql = getSql()
  if (!ready) {
    ready = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS members (
        id           text PRIMARY KEY,
        guild        text NOT NULL DEFAULT 'UMUM',
        name         text NOT NULL,
        profile_url  text NOT NULL,
        games        int  NOT NULL DEFAULT 0,
        skills       int  NOT NULL DEFAULT 0,
        base         int  NOT NULL DEFAULT 0,
        mbonus       int  NOT NULL DEFAULT 0,
        total        int  NOT NULL DEFAULT 0,
        tier_idx     int  NOT NULL DEFAULT -1,
        last_synced  timestamptz NOT NULL DEFAULT now()
      )`
      // 1 profil = 1 entri (lintas guild). Idempotent untuk tabel lama maupun baru.
      try { await sql`ALTER TABLE members ADD CONSTRAINT members_profile_url_key UNIQUE (profile_url)` } catch { /* sudah ada */ }
      // kolom facil (games/skills periode fasilitator) untuk konsistensi tampilan milestone
      await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS facil_games int NOT NULL DEFAULT 0`
      await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS facil_skills int NOT NULL DEFAULT 0`
      // token rahasia untuk "keluar dari leaderboard" sendiri; dibuat saat join pertama,
      // hanya dikembalikan ke pemilik (tidak pernah diekspos di /api/leaderboard).
      await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS remove_token text`
      // Tanggal badge berpoin terakhir peserta = momen ia mencapai totalnya sekarang.
      // Pemutus urutan leaderboard saat poin sama. Baris lama bernilai NULL sampai
      // tersinkron ulang, dan NULL sengaja diurutkan paling belakang: tidak diketahui
      // bukan berarti duluan.
      await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS last_earned date`
      // Snapshot poin harian, diisi di akhir api/refresh-all. Dasar untuk leaderboard
      // mingguan: tabel members cuma menyimpan skor SEKARANG, tanpa ini selisih antar
      // minggu mustahil dihitung.
      //
      // PRIMARY KEY (member_id, day) bikin pengisian idempoten: refresh-all yang dipanggil
      // dua kali dalam sehari menimpa baris yang sama, bukan menggandakan.
      //
      // ON DELETE CASCADE itu syarat privasi, bukan kerapian: tombol "Keluar dari
      // leaderboard" (api/leave) dan penghapusan admin (api/remove) menghapus baris members,
      // dan histori orang yang sudah menarik diri TIDAK boleh tertinggal.
      //
      // `day` memakai tanggal Asia/Jakarta, bukan CURRENT_DATE yang UTC: cron jalan 22:00 UTC
      // yang di WIB sudah tanggal berikutnya, jadi label harinya akan meleset satu hari dari
      // yang dilihat peserta.
      await sql`CREATE TABLE IF NOT EXISTS point_history (
        member_id text NOT NULL REFERENCES members(id) ON DELETE CASCADE,
        day       date NOT NULL,
        total     int  NOT NULL DEFAULT 0,
        games     int  NOT NULL DEFAULT 0,
        skills    int  NOT NULL DEFAULT 0,
        PRIMARY KEY (member_id, day)
      )`
      await sql`CREATE TABLE IF NOT EXISTS rate_limits (
        k text PRIMARY KEY, cnt int NOT NULL DEFAULT 0, ts timestamptz NOT NULL DEFAULT now()
      )`
      await sql`CREATE TABLE IF NOT EXISTS feedback (
        id text PRIMARY KEY, message text NOT NULL, name text, page text,
        created_at timestamptz NOT NULL DEFAULT now()
      )`
    })()
  }
  await ready
  return sql
}
