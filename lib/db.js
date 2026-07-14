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
