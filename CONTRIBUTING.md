# Berkontribusi ke Arcade Hub

Makasih sudah mampir! Arcade Hub adalah tool komunitas (open source, MIT) untuk
menghitung poin Google Cloud Arcade otomatis dari profil Cloud Skills Boost.
Kontribusi sekecil apa pun dihargai.

## Cara ikut

- **Tertarik mengambil tugas di roadmap?** Cek issue berlabel [`roadmap: next`](https://github.com/ravi-arnan/arcadehub-id/issues?q=is%3Aissue+is%3Aopen+label%3A%22roadmap%3A+next%22) atau pantau pelacak utama di [Issue #15](https://github.com/ravi-arnan/arcadehub-id/issues/15).
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
(`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, dll, lihat `.env.example`).

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

## Bantuan AI (AI Assistance)

Penggunaan asisten AI (seperti Claude, ChatGPT, Gemini, Cursor, Copilot, dsb.)
sangat dipersilakan untuk membantu coding, debugging, atau menulis dokumen.
Beberapa prinsip sederhana:
- **Pahami kodenya**: pastikan kamu membaca dan mengerti apa yang dikerjakan oleh kode tersebut.
- **Verifikasi**: selalu jalankan `npm test` dan `npm run build` sebelum membuka PR untuk memastikan tidak ada regresi atau halusinasi kode.
- **Transparan**: cantumkan penjelasan singkat yang jelas pada PR mengenai perubahan yang dilakukan.

## Kode Etik

Proyek ini mengikuti [Contributor Covenant](CODE_OF_CONDUCT.md). Dengan ikut
berkontribusi kamu setuju menjaga ruang yang ramah dan saling menghormati.
