# Berkontribusi ke Arcade Hub

Makasih sudah mampir! Arcade Hub adalah tool komunitas (open source, MIT) untuk
menghitung poin Google Cloud Arcade otomatis dari profil Cloud Skills Boost.
Kontribusi sekecil apa pun dihargai. 🙌

## Cara ikut

- **Nemu bug / punya ide?** [Buka issue](https://github.com/ravi-arnan/arcadehub-id/issues/new/choose).
- **Baru mulai open source?** Lihat label
  [`good first issue`](https://github.com/ravi-arnan/arcadehub-id/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).
- **Mau tampil di halaman Kontributor?** Tambahkan dirimu ke
  [`src/contributors.js`](src/contributors.js) lewat PR (ini good first PR!).

## Setup lokal

```bash
npm install
cp .env.example .env   # isi kalau butuh fitur backend (DB/leaderboard)
npm run dev            # dev server (Vite)
npm run build          # build produksi
npm test               # unit test logika poin
```

Frontend (tab **Poin Saya**, **Katalog**, **Hadiah**, **Info**, **Kontribusi**)
jalan tanpa backend. Fitur **Leaderboard** & **feedback** butuh env
(`DATABASE_URL`, dll, lihat `.env.example`).

## Alur Pull Request

1. Fork repo & buat branch: `git checkout -b fix/deskripsi-singkat`.
2. Buat perubahan sekecil & sefokus mungkin.
3. Pastikan `npm run build` dan `npm test` hijau.
4. Commit dengan pesan jelas (format [Conventional Commits](https://www.conventionalcommits.org/):
   `feat:`, `fix:`, `docs:`, `refactor:`, `chore:` …).
5. Buka PR ke branch `main` dan isi template PR-nya.

## Gaya kode

- React + Vite (JSX). Komponen `PascalCase`, hook `useCamelCase`.
- Banyak file kecil > satu file besar. Utamakan kejelasan.
- **UI tanpa emoji**, pakai ikon SVG (lihat `src/icons.jsx`).
- Animasi via Framer Motion pakai komponen `m` (mode `strict`) dan hormati
  reduced-motion.
- Jangan commit rahasia. Semua kunci lewat env (lihat `.env.example`).

## Kode Etik

Proyek ini mengikuti [Contributor Covenant](CODE_OF_CONDUCT.md). Dengan ikut
berkontribusi kamu setuju menjaga ruang yang ramah dan saling menghormati.
