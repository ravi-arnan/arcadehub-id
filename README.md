# Arcade Hub 🕹️

Tracker poin **Google Cloud Arcade** untuk komunitas fasilitator. Tempel link
public profile Cloud Skills Boost, dan poin, milestone, tier hadiah, serta
leaderboard dihitung **otomatis** dari badge-mu. Gratis & open source.

**Live:** https://arcadehub-id.vercel.app

> Tool komunitas, tidak berafiliasi resmi dengan Google. Perhitungan poin
> bersifat best-effort dari badge yang ada di profil publik.

## Fitur

- **Poin Saya**, hitung poin otomatis dari profil (base Arcade + bonus milestone),
  rincian per-badge, tier hadiah, chart aktivitas 7 hari, kategori badge.
- **Leaderboard**, terbuka & multi-guild, ranking real-time, sinkron otomatis harian.
- **Katalog**, 93 skill badge (51 dari silabus resmi + tambahan) dan 6 game bulan
  berjalan, tandai selesai/belum, plus arsip game bulan-bulan sebelumnya.
- **Hadiah**, tier Arcade Player 2026 (Trooper / Ranger / Champion / Legend).
- **Info**, kode referral, jadwal, panduan, FAQ, pengumuman yang sedang berjalan.
- **Kontribusi**, profil kontributor + cara ikut.
- Installable (PWA), share card progress, kotak masukan, animasi Framer Motion,
  aksesibilitas Radix (Lighthouse a11y 100).

## Stack

Vite + React · React Router v6 · Framer Motion · Radix UI ·
Vercel Serverless Functions · Neon Postgres · Vercel Cron.

## Mulai

```bash
npm install
npm run dev     # dev server
npm run build   # build produksi
npm test        # 134 unit test (poin, parser profil, katalog, proyeksi)
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
  pages/          satu file per halaman: Points, Leaderboard, Catalog, Prizes, Info, Contribute, Roadmap
  components/     Layout, Nav, Footer, Deadline, Bar
  utils/          util kecil (time)
  contributors.js daftar kontributor, tambahkan dirimu di sini!
  (Insights, ShareCard, Announcement, Medal, icons, Tip, SpaceFX, profile, points, config, catalog)
lib/              logika poin + parser profil + DB + rate limit (backend)
api/              serverless functions (join, leave, remove, leaderboard, refresh, refresh-all, feedback)
public/img/       aset gambar (hero, badge game, hadiah)
```

Rute: `/points` (home) `/leaderboard` `/catalog` `/prizes` `/info` `/contribute`,
plus `/roadmap` (tidak di nav, ditautkan dari footer).
`/` diarahkan ke `/points` (atau `/leaderboard` bila ada `?guild=`).

Cara poin dihitung, dua window (season vs periode fasilitator), dan hardening
(SSRF, rate limit, security headers) dijelaskan di komentar `lib/points.js`,
`lib/parseProfile.js`, dan `lib/fetchProfile.js`.

## Kontribusi

PR dari luar sangat diterima! Lihat [CONTRIBUTING.md](CONTRIBUTING.md).
Cara tercepat tampil di halaman **Kontributor**: tambahkan dirimu ke
[`src/contributors.js`](src/contributors.js) lewat PR.

- [Buka issue](https://github.com/ravi-arnan/arcadehub-id/issues/new/choose)
- [Good first issues](https://github.com/ravi-arnan/arcadehub-id/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

## Lisensi

[MIT](LICENSE) © 2026 Ravi Arnan
