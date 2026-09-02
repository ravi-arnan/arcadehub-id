# Arcade Hub — Project Context

## Tentang Project
Arcade Hub adalah web tracker poin untuk Google Cloud Arcade Fasilitator 2026.
React + Vite, deployed di Vercel. Repo: github.com/ravi-arnan/arcadehub-id

## Commands
- `npm run dev` — dev server
- `npm run build` — build produksi (vite build + prerender)
- `npm test` — unit test (134 test)
- `npm run gen:solutions` — generate labSolutions.js dari repo gsp_lab_solutions

## Agent Rules (WAJIB)

### Jangan pernah
- Tambah diri sendiri atau AI sebagai contributor di `src/contributors.js`
- Tambah footer `Co-Authored-By`, `Generated with Codebuff`, atau sejenisnya di commit
- Commit rahasia / hardcode API key
- Push ke production tanpa izin user
- Hapus file tanpa konfirmasi
- Ubah `package.json` dependencies tanpa diminta
- Rewrite git history atau force push tanpa izin

### Wajib sebelum commit
1. `npm test` — harus pass semua
2. `npm run build` — harus sukses
3. Review `git diff` — pastikan hanya file relevan yang berubah
4. Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`

### Gaya Commit
- Bahasa Indonesia, singkat, deskriftif
- Contoh: `fix(leaderboard): default filter ke 'Semua' bukan guild sendiri`
- Tanpa footer otomatis

### Project Structure
- `src/` — frontend React
- `lib/` — shared logic (serverless-safe)
- `api/` — Vercel serverless functions
- `scripts/` — build scripts
- `captions/` — caption WhatsApp (bukan kode)
- `video/` — aset video

### Key Files
- `lib/labSolutions.js` — DIHASILKAN OTOMATIS, jangan edit tangan. Update via `npm run gen:solutions`
- `lib/skillCatalog.js` — 93 badge resmi. Edit hanya kalau Google tambah/hapus badge
- `lib/gameCatalog.js` — game Arcade bulanan. Access code berubah tiap bulan
- `src/config.js` — `ANNOUNCEMENT` untuk modal popup. Ganti `id` untuk trigger ke semua user
- `src/contributors.js` — HUMAN ONLY. Jangan tambah entri AI

### Leaderboard
- Default filter: "Semua" (`'ALL'`), bukan guild spesifik
- Auto-filter ke guild sendiri sudah dihapus

### Lab Solutions Sync
- Repo: github.com/ravi-arnan/gsp_lab_solutions
- Jalankan `npm run gen:solutions` untuk sinkron
- Hasil: `lib/labSolutions.js` (37 badge terpetakan dari 96 lab)
