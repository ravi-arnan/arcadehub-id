// Tema Halloween (Oktober 2026): nonaktif setelah Oktober selesai.
export const HALLOWEEN: boolean = false

// Tema Diwali (November 2026): menghidupkan dekorasi Pixel Diya dan Sky Lantern
// mengikuti halaman Arcade resmi Google yang bulan ini merayakan Diwali.
export const DIWALI: boolean = true

export interface AnnouncementLink {
  label: string
  href: string
}

export interface AnnouncementConfig {
  id: string | null
  date?: string
  title: string
  body: string[]
  links?: AnnouncementLink[]
  signature?: string
}

// Pengumuman admin, muncul sekali per pengunjung saat buka web.
// Cara pakai: ganti `id` tiap bikin pengumuman baru (itu yang bikin modal muncul
// lagi buat semua orang). Set `id: null` kalau lagi tidak ada pengumuman.
// `links` opsional: URL ditulis lengkap di sini (bukan ambil dari CONFIG) karena
// tiap pengumuman bisa menunjuk dokumen yang berbeda.
export const ANNOUNCEMENT: AnnouncementConfig = {
  id: '2026-11-02-november-arcade',
  date: '2 November 2026',
  title: 'Game Arcade November 2026 sudah rilis',
  body: [
    'Enam game Arcade November 2026 sudah tayang di Google Skills Boost, termasuk Arcade Simulator: Cloud Infrastructure Engineer dan game perayaan Diwali in the Cloud.',
    'Buka tab Katalog untuk access code tiap game. Klik kartu game untuk menyalin kode secara instan. Tiap game bernilai 1 poin dan mengisi syarat game milestone.',
    'Periode tema Halloween telah selesai dan tampilan telah kembali ke tema default Arcade. Seluruh data progres poin dan status badge tersimpan tetap aman dan tersinkron otomatis.',
  ],
  links: [
    { label: 'Cek poin saya', href: '/' },
    { label: 'Buka katalog game', href: '/catalog' },
    { label: 'Halaman Arcade resmi', href: 'https://go.cloudskillsboost.google/arcade' },
  ],
  signature: 'R',
}

export interface AppConfig {
  referralCode: string
  registerUrl: string
  whatsappUrl: string
  regOpen: string
  regClose: string
  arcadeUrl: string
  wcPlayerUrl: string
  wcLeaderboardUrl: string
  catalogUrl: string
  profileHelp: string
  spamEmail: string
  bonusForumUrl: string
  bonusDocUrl: string
  bonusFormUrl: string
  bonusVerifierEmail: string
  repoUrl: string
  issuesUrl: string
  goodFirstIssuesUrl: string
  contributingUrl: string
  addYourselfUrl: string
}

// Konfigurasi guild fasilitator, ubah di sini kalau ganti kode/link.
export const CONFIG: AppConfig = {
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
  addYourselfUrl: 'https://github.com/ravi-arnan/arcadehub-id/edit/main/src/contributors.ts',
}
