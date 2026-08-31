# Agent Harness — Arcade Hub

Aturan wajib untuk AI agent (Codebuff, Claude, Codex, dll) yang bekerja di repo ini.

## Jangan pernah

- **Jangan tambahkan diri sendiri sebagai contributor.** `src/contributors.js` hanya untuk manusia. AI tidak boleh menambahkan entri sendiri atau orang lain tanpa izin eksplisit.
- **Jangan tambahkan `Co-Authored-By` footer di commit messages.** Commit harus terlihat dari Ravi/manusia saja.hapus footer `Generated with Codebuff` dan sejenisnya.
- **Jangan commit rahasia.** Semua kunci lewat env (`.env.example`). Jangan hardcode API key, token, atau credential.
- **Jangan push ke production tanpa izin.** Selalu tanya dulu sebelum `git push`.
- **Jangan hapus file tanpa konfirmasi.** Kecuali diminta secara eksplisit.
- **Jangan ubah `package.json` dependencies** kecuali diminta.
- **Jangan jalankan script yang mengubah data production** (database, API, deploy) tanpa izin.

## Wajib lakukan sebelum commit

1. `npm test` — semua test harus pass (132 test saat ini).
2. `npm run build` — build harus sukses tanpa error.
3. Review `git diff` — pastikan hanya file yang relevan yang berubah.
4. Gunakan [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.

## Gaya Commit

- Pesan dalam Bahasa Indonesia, singkat, deskriptif.
- Contoh yang benar:
  - `fix(leaderboard): default filter ke 'Semua' bukan guild sendiri`
  - `feat(pengumuman): modal H-14, Week 8`
  - `fix(katalog): GSP351 punya runbook dan sudah terverifikasi`
- Jangan pakai footer otomatis seperti `Co-Authored-By` atau `Generated with ...`.

## Gaya Kode

- React + Vite (JSX). Komponen `PascalCase`, hook `useCamelCase`.
- UI tanpa emoji, pakai ikon SVG (`src/icons.jsx`).
- Animasi via Framer Motion, komponen `m` (mode `strict`), hormati reduced-motion.
- Banyak file kecil > satu file besar.

## Struktur Project

- `src/` — frontend (React)
- `lib/` — shared logic (bisa diakses serverless `api/`)
- `api/` — serverless functions (Vercel)
- `scripts/` — build scripts (gen-lab-solutions, prerender, dll)
- `captions/` — caption pengumuman WhatsApp/media sosial (bukan kode)
- `video/` — aset dan script video editing

## Konteks Spesifik

### Catalog & Lab Solutions
- `lib/labSolutions.js` di-generate oleh `scripts/gen-lab-solutions.mjs`. Jangan edit tangan.
- Jalankan `npm run gen:solutions` untuk update dari repo `ravi-arnan/gsp_lab_solutions`.
- `lib/skillCatalog.js` berisi 93 badge resmi. Hanya edit kalau Google menambah/menghapus badge.

### Game Catalog
- `lib/gameCatalog.js` berisi game Arcade bulan berjalan. Access code & game id berubah tiap bulan.
- `re` (regex) harus spesifik per bulan, jangan generik.

### Leaderboard
- Default filter harus "Semua" (`'ALL'`), bukan guild spesifik.
- Auto-filter ke guild sendiri sudah dihapus (jangan ditambahkan lagi).

### Announcement (Modal)
- ID di `src/config.js` (`ANNOUNCEMENT.id`) harus unik per pengumuman.
- Ganti `id` untuk membuat modal muncul lagi ke semua pengunjung.
- Set `id: null` kalau tidak ada pengumuman aktif.

### Commit History
- Jangan rewrite history tanpa izin.
- Jangan force push ke branch `main` tanpa konfirmasi.
