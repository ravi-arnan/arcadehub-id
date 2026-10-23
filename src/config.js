// Tema Halloween (Oktober 2026): menghidupkan hiasan hantu + labu di background dan hero,
// mengikuti halaman Arcade resmi Google yang bulan ini bertema Halloween.
// Setel `false` begitu bulan berganti supaya hiasannya tidak nyangkut.
export const HALLOWEEN = true

// Pengumuman admin, muncul sekali per pengunjung saat buka web.
// Cara pakai: ganti `id` tiap bikin pengumuman baru (itu yang bikin modal muncul
// lagi buat semua orang). Set `id: null` kalau lagi tidak ada pengumuman.
// `links` opsional: URL ditulis lengkap di sini (bukan ambil dari CONFIG) karena
// tiap pengumuman bisa menunjuk dokumen yang berbeda.
export const ANNOUNCEMENT = {
  id: '2026-10-16-official-domain',
  date: '16 Oktober 2026',
  title: 'Arcade Hub resmi pindah ke arcadehub.web.id',
  body: [
    'Kabar gembira, Arcade Hub sekarang resmi menggunakan domain baru arcadehub.web.id agar lebih mudah diingat dan diakses oleh komunitas fasilitator maupun peserta.',
    'Domain lama arcadehub-id.vercel.app tetap aktif sebagai alias dan fallback, jadi tautan maupun bookmark yang sudah dibagikan sebelumnya tetap berfungsi normal.',
    'Seluruh data profil, progres poin tersimpan, leaderboard guild, dan katalog badge tetap aman dan tersinkron otomatis seperti biasa.',
  ],
  links: [
    { label: 'Buka arcadehub.web.id', href: 'https://arcadehub.web.id' },
    { label: 'Cek poin saya', href: '/points' },
    { label: 'Lihat leaderboard', href: '/leaderboard' },
  ],
  signature: 'R',
}

// Konfigurasi guild fasilitator, ubah di sini kalau ganti kode/link.
export const CONFIG = {
  referralCode: 'GCAF26-ID-D4J-QEH',
  registerUrl: 'https://bit.ly/PesertaGoogleArcade26',
  whatsappUrl: 'https://chat.whatsapp.com/F2nCFAiffFgCjHAVvOXr0d',
  regOpen: '13 Juli 2026, 09.00 WIB',
  regClose: '29 September 2026, 23.59 WIB',
  arcadeUrl: 'https://go.cloudskillsboost.google/arcade',
  // Weekly challenge peserta (Dicoding). Short link sengaja dipakai apa adanya:
  // tujuannya bisa berganti tanpa perlu ubah kode.
  wcPlayerUrl: 'https://dicoding.id/Arcade26-WCPlayer',
  wcLeaderboardUrl: 'https://dicoding.id/Arcade26-PlayerLeaderboard',
  catalogUrl: 'https://www.cloudskillsboost.google/catalog',
  profileHelp: 'https://www.cloudskillsboost.google/my_account/profile#public-visibility',
  spamEmail: 'googlecloudedu-noreply@google.com',
  // Bonus Milestone 2026 (+10 poin, bikin AI Agent pertama). Diumumkan 31 Jul 2026.
  bonusForumUrl: 'https://discuss.google.dev/t/arcade-facilitator-2026-bonus-milestone/386412',
  bonusDocUrl: 'https://docs.google.com/document/d/1RjwwiKY0fGyMm9wt5t4exXaA7pM3IU45FBOOPtmgUdo/preview',
  bonusFormUrl: 'https://dicoding.id/Arcade-BonusMilestone',
  bonusVerifierEmail: 'arcade-agent-verifier@google.com',
  // Open source
  repoUrl: 'https://github.com/ravi-arnan/arcadehub-id',
  issuesUrl: 'https://github.com/ravi-arnan/arcadehub-id/issues',
  goodFirstIssuesUrl: 'https://github.com/ravi-arnan/arcadehub-id/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22',
  contributingUrl: 'https://github.com/ravi-arnan/arcadehub-id/blob/main/CONTRIBUTING.md',
  addYourselfUrl: 'https://github.com/ravi-arnan/arcadehub-id/edit/main/src/contributors.js',
}
