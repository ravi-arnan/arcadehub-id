// Pengumuman admin, muncul sekali per pengunjung saat buka web.
// Cara pakai: ganti `id` tiap bikin pengumuman baru (itu yang bikin modal muncul
// lagi buat semua orang). Set `id: null` kalau lagi tidak ada pengumuman.
// `links` opsional: URL ditulis lengkap di sini (bukan ambil dari CONFIG) karena
// tiap pengumuman bisa menunjuk dokumen yang berbeda.
export const ANNOUNCEMENT = {
  id: '2026-08-21-re-trail',
  date: '21 Agustus 2026',
  title: 'Game bonus: Arcade Re-Trail',
  body: [
    'Google membuka satu game tambahan di luar enam game reguler Agustus: Arcade Re-Trail: Vaults & Vectors. Nilainya 1 poin, sama seperti game Arcade lain.',
    'Ini game penambal. Arcade Trail bulan Juli ditutup lebih awal dari jadwal, jadi yang kehilangan poin di situ bisa mengambilnya kembali lewat game ini. Yang sudah lengkap pun tetap boleh ikut, poinnya tetap masuk.',
    'Isinya Cloud Storage (bucket, API, Bucket Lock) lalu Cloud Run Functions dan Pub/Sub, ditutup dua challenge lab.',
    'Tutup 1 September 2026 dan kuotanya terbatas (sekitar 7.500 slot saat pengumuman ini dibuat). Kartunya sudah ada di Poin Saya lengkap dengan access code, jadi ambil sekarang selagi slotnya ada.',
  ],
  links: [
    { label: 'Buka game', href: 'https://www.skills.google/games/7426' },
  ],
  signature: 'R',
}

// Konfigurasi guild fasilitator, ubah di sini kalau ganti kode/link.
export const CONFIG = {
  referralCode: 'GCAF26-ID-D4J-QEH',
  registerUrl: 'https://bit.ly/PesertaGoogleArcade26',
  whatsappUrl: 'https://chat.whatsapp.com/F2nCFAiffFgCjHAVvOXr0d',
  regOpen: '13 Juli 2026, 09.00 WIB',
  regClose: '14 September 2026, 23.59 WIB',
  arcadeUrl: 'https://go.cloudskillsboost.google/arcade',
  // Weekly challenge peserta (Dicoding). Short link sengaja dipakai apa adanya:
  // tujuannya bisa berganti tanpa perlu ubah kode.
  wcPlayerUrl: 'https://dicoding.id/Arcade26-WCPlayer',
  wcLeaderboardUrl: 'https://dicoding.id/Arcade26-PlayerLeaderboard',
  catalogUrl: 'https://www.cloudskillsboost.google/catalog',
  profileHelp: 'https://www.cloudskillsboost.google/my_account/profile',
  spamEmail: 'googlecloudedu-noreply@google.com',
  // Bonus Milestone 2026 (+10 poin, bikin AI Agent pertama). Diumumkan 31 Jul 2026.
  bonusForumUrl: 'https://discuss.google.dev/t/arcade-facilitator-2026-bonus-milestone/386412',
  bonusDocUrl: 'https://docs.google.com/document/d/1RjwwiKY0fGyMm9wt5t4exXaA7pM3IU45FBOOPtmgUdo/preview',
  bonusFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdq6-5RPthTa4D_o7xfgM0We_pnFWmj80ByiZfEl9ov1yZ3iw/viewform',
  bonusVerifierEmail: 'arcade-agent-verifier@google.com',
  // Open source
  repoUrl: 'https://github.com/ravi-arnan/arcadehub-id',
  issuesUrl: 'https://github.com/ravi-arnan/arcadehub-id/issues',
  goodFirstIssuesUrl: 'https://github.com/ravi-arnan/arcadehub-id/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22',
  contributingUrl: 'https://github.com/ravi-arnan/arcadehub-id/blob/main/CONTRIBUTING.md',
  addYourselfUrl: 'https://github.com/ravi-arnan/arcadehub-id/edit/main/src/contributors.js',
}
