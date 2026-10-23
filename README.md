# Arcade Hub

[![CI](https://github.com/ravi-arnan/arcadehub-id/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/ravi-arnan/arcadehub-id/actions/workflows/ci.yml)
[![Live Site](https://img.shields.io/badge/Live-arcadehub.web.id-10b981?style=flat-square&logo=googlechrome&logoColor=white)](https://arcadehub.web.id)
[![Tests](https://img.shields.io/badge/Tests-180%20passing-brightgreen?style=flat-square&logo=node.js&logoColor=white)](npm%20test)
[![Lighthouse A11y](https://img.shields.io/badge/Lighthouse%20A11y-100-success?style=flat-square&logo=lighthouse&logoColor=white)](https://arcadehub.web.id)
[![XERJ Corpus Hub contributor](https://hub.xerj.org/contributors/ravi-arnan/badge.svg)](https://hub.xerj.org/contributors/ravi-arnan)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

Tracker poin **Google Cloud Arcade** untuk komunitas fasilitator. Tempel link
public profile Cloud Skills Boost, dan poin, milestone, tier hadiah, serta
leaderboard dihitung **otomatis** dari badge-mu. Gratis & open source.

**Live:** https://arcadehub.web.id

> Tool komunitas, tidak berafiliasi resmi dengan Google. Perhitungan poin
> bersifat best-effort dari badge yang ada di profil publik.

## Fitur

- **Poin Saya**, hitung poin otomatis dari profil (base Arcade + bonus milestone),
  rincian per-badge, tier hadiah, chart aktivitas 7 hari, kategori badge.
- **Leaderboard**, terbuka & multi-guild, ranking real-time, sinkron otomatis harian.
- **Guilds**, perbandingan performa guild: total poin, rata-rata, poin tertinggi, dan sebaran milestone.
- **Katalog**, 96 skill badge (51 dari silabus resmi + tambahan), game bulan berjalan,
  dan arsip game bulan-bulan sebelumnya, tandai selesai/belum.
- **Hadiah**, tier Arcade Player 2026 (Trooper / Ranger / Champion / Legend).
- **Info**, kode referral, jadwal, panduan, FAQ, pengumuman yang sedang berjalan.
- **Kontribusi**, profil kontributor + cara ikut.
- Installable (PWA), share card progress, kotak masukan, animasi Framer Motion,
  aksesibilitas Radix (Lighthouse a11y 100).

## Stack

Vite + React · React Router v7 · Framer Motion · Radix UI ·
Vercel Serverless Functions · Turso (libSQL) · Vercel Cron.

## Mulai

```bash
npm install
npm run dev     # dev server
npm run build   # build produksi
npm test        # 180 unit test (poin, parser profil, katalog, dialek SQL/libSQL, proyeksi)
npm run check:arcade   # bandingkan katalog dengan halaman Arcade resmi
```

Frontend jalan tanpa backend. Fitur **Leaderboard** & **feedback** butuh env.
Salin `.env.example` ke `.env` dan isi (atau `vercel env pull` kalau punya akses
project). Lihat daftar env di [`.env.example`](.env.example).

## Struktur

```
src/
  App.jsx         definisi rute (react-router, tiap halaman lazy-load)
  routes.jsx      metadata nav (path + label + ikon)
  pages/          satu file per halaman: Points, Leaderboard, Guilds, Catalog, Prizes, Info, Contribute, Roadmap
  components/     Layout, Nav, Footer, Deadline, Bar
  utils/          util kecil (time)
  contributors.js daftar kontributor, tambahkan dirimu di sini!
  (Insights, ShareCard, Announcement, Medal, icons, Tip, SpaceFX, profile, points, config, catalog)
lib/              logika poin + parser profil + DB + rate limit (backend)
api/              serverless functions (join, leave, remove, leaderboard, refresh, refresh-all, feedback)
public/img/       aset gambar (hero, badge game, hadiah)
scripts/          skrip build & migrasi (backup-neon, migrate-to-turso, verify-migration)
```

Rute: `/points` (home) `/leaderboard` `/guilds` `/catalog` `/prizes` `/info` `/contribute`,
plus `/roadmap` (tidak di nav, ditautkan dari footer).
`/` diarahkan ke `/points` (atau `/leaderboard` bila ada `?guild=`).

Cara poin dihitung, dua window (season vs periode fasilitator), dan hardening
(SSRF, rate limit, security headers) dijelaskan di komentar `lib/points.js`,
`lib/parseProfile.js`, dan `lib/fetchProfile.js`.

## Kontribusi

PR dari luar sangat diterima! Kontribusi yang dibantu AI (AI assistance seperti
Claude, Gemini, ChatGPT, Cursor, GitHub Copilot, dsb.) juga diperbolehkan,
asalkan kamu tetap memahami perubahan yang dibuat dan memastikan verifikasi
lokal (`npm run build` dan `npm test`) lulus hijau. Lihat [CONTRIBUTING.md](CONTRIBUTING.md).

Cara tercepat tampil di halaman **Kontributor**: tambahkan dirimu ke
[`src/contributors.js`](src/contributors.js) lewat PR.

- [Roadmap & backlog](https://arcadehub.web.id/roadmap) atau pantau di [Issue #15](https://github.com/ravi-arnan/arcadehub-id/issues/15)
- [Issue roadmap prioritas dekat](https://github.com/ravi-arnan/arcadehub-id/issues?q=is%3Aissue+is%3Aopen+label%3A%22roadmap%3A+next%22)
- [Buka issue](https://github.com/ravi-arnan/arcadehub-id/issues/new/choose)
- [Good first issues](https://github.com/ravi-arnan/arcadehub-id/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

## Lisensi

[MIT](LICENSE) © 2026 Ravi Arnan
