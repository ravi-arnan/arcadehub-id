// Pengumuman admin, muncul sekali per pengunjung saat buka web.
// Cara pakai: ganti `id` tiap bikin pengumuman baru (itu yang bikin modal muncul
// lagi buat semua orang). Set `id: null` kalau lagi tidak ada pengumuman.
// `links` opsional: URL ditulis lengkap di sini (bukan ambil dari CONFIG) karena
// tiap pengumuman bisa menunjuk dokumen yang berbeda.
export const ANNOUNCEMENT = {
  id: '2026-09-29-deadline',
  date: '14 September 2026',
  title: '📢 Pendaftaran ditutup 14 Sep, deadline milestone 29 September 2026',
  body: [
    'Pendaftaran program fasilitator sudah ditutup 14 September 2026. Deadline pengumpulan milestone diperpanjang sampai 29 September 2026. Manfaatkan waktu yang tersisa!',
    'Kalau masih ada badge yang belum kelar, kerjakan lab-nya sekarang. Deadline 29 September adalah batas akhir semua milestone.',
    'Bonus milestone +10 poin masih bisa dikejar kalau belum dikirim. Pastikan AI Agent pertamamu sudah dikumpulkan sebelum 29 September.',
    'Jangan lupa: Arcade Game kuotanya terbatas & game bisa kedaluwarsa tiap bulan. Mainkan dulu kalau belum. Slot hadiah bersifat waterfall & first-come, makin cepat kunci poin, makin aman.',
    'Butuh bantuan? Office Hour tiap Kamis 19.00-20.00 WIB, atau tanya langsung di grup WhatsApp.',
  ],
  links: [
    { label: 'Cek poin saya', href: '/points' },
    { label: 'Lihat katalog badge', href: '/catalog' },
    { label: 'Weekly Challenge Player', href: 'https://dicoding.id/Arcade26-WCPlayer' },
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
  profileHelp: 'https://www.cloudskillsboost.google/my_account/profile',
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
