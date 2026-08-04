import { useState } from 'react'
import { Link } from 'react-router-dom'
import Collapse from '../components/Collapse.jsx'

// Roadmap pengembangan Arcade Hub. Halaman ini sengaja TIDAK ada di top nav (hanya via footer/link langsung).
const GROUPS = [
  {
    key: 'done',
    label: 'Sudah Rilis',
    tone: 'done',
    note: 'Sudah live di produksi.',
    items: [
      { title: 'Halaman perbandingan guild', desc: 'Halaman /guilds meranking semua guild: total poin, rata-rata, poin tertinggi, jumlah game dan badge, plus berapa anggota yang sudah menembus tiap milestone. Peringkat memakai total poin sehingga guild besar wajar unggul, jadi kolom rata-rata ditaruh berdampingan supaya guild kecil yang aktif tetap terbaca. Tiap baris membuka leaderboard yang sudah terfilter ke guild itu.' },
      { title: 'Alert game baru', desc: 'Katalog dibandingkan dengan halaman Arcade resmi tiap hari secara otomatis; kalau Google merilis batch bulanan baru atau mengubah badge, pengelola langsung dapat notifikasi dan katalog bisa segera disegarkan. Badge yang baru masuk ditandai chip "BARU", dan tandanya hilang sendiri saat batch berikutnya datang.' },
      { title: 'Pengumuman dari admin', desc: 'Pengumuman penting (mis. weekly challenge yang sedang berjalan) muncul sekali sebagai modal saat kamu membuka situs, lengkap dengan link dokumen dan leaderboard-nya. Sekali ditutup tidak mengganggu lagi, dan isinya tetap bisa dibaca ulang sebagai kartu di halaman Info.' },
      { title: 'Katalog mengikuti siklus bulanan Arcade', desc: 'Game bulan berjalan, access code, dan art badge-nya diperbarui tiap Google merilis batch baru; game bulan lalu otomatis pindah ke arsip Game Terdahulu beserta art-nya. Ada `npm run check:arcade` yang membandingkan katalog dengan halaman resmi supaya tidak ada yang tertinggal.' },
      { title: 'Deteksi badge lama diperbaiki', desc: 'Judul badge di profil sering bertema ("Arcade Voyage: Cloud Storage and Data Governance") sedangkan arsip Google memakai label generik ("Arcade Voyage: July 2026"), jadi banyak game lama tidak tercentang dan game spesial 2-3 poin kehitung 1 poin. Sekarang keduanya dikenali lewat daftar alias.' },
      { title: 'Bonus Milestone (+10 poin)', desc: 'Panduan Bonus Milestone AI Agent di halaman Poin Saya: progress 4 badge GEAR terbaca otomatis dari profilmu, langkah lengkap, link dokumen instruksi dan form verifikasi. Klaim selesainya dicatat lokal saja karena Google yang memverifikasi lewat form.' },
      { title: 'Status game yang ditutup', desc: 'Game yang ditarik Google bulan berjalan ditandai jelas di katalog dan tidak bisa diklik, access code-nya disembunyikan, tapi tetap dihitung sebagai target karena poinnya bisa diambil lewat sesi susulan.' },
      { title: 'Shortlist "kerjakan selanjutnya"', desc: 'Di langkah 2 "Mulai dari Sini": 4 badge yang belum kamu ambil ditampilkan langsung, dengan tombol "Ganti saran" kalau topiknya kurang cocok. Bukan peringkat, cuma potongan pendek biar tidak perlu memilih dari daftar panjang.' },
      { title: 'Header keamanan (CSP)', desc: 'Content-Security-Policy aktif di produksi: script hanya dari domain sendiri, tanpa inline script, plus object-src/frame-src dikunci. Ada `npm run preview:csp` untuk menguji header yang sama secara lokal sebelum deploy.' },
      { title: 'Animasi pill navigasi', desc: 'Penanda menu aktif meluncur antar tab, bukan lompat. Ditulis ulang pakai transform CSS, jadi tidak perlu menambah bundle animasi layout, dan otomatis diam saat perangkat minta reduced-motion.' },
      { title: 'Pulih otomatis dari deploy baru', desc: 'Tab yang sedang terbuka saat versi baru dirilis tidak lagi mendarat di layar error karena chunk lama hilang: halaman me-refresh sendiri sekali, dengan pengaman supaya tidak jadi loop.' },
      { title: 'Proyeksi milestone', desc: 'Di "Mulai dari Sini": sisa hari menuju penutupan, berapa badge lagi yang dibutuhkan, kecepatan badge per minggu yang diperlukan dibanding kecepatanmu sekarang, plus perkiraan tanggal tercapai kalau ritmemu bertahan.' },
      { title: 'Cakupan tes diperluas', desc: 'Tes otomatis di luar logika poin: parsing profil (regex badge & tanggal), normalisasi URL + guard SSRF, matching katalog/alias, proyeksi milestone, dan statistik guild. 84 tes via node --test, ikut gate CI tiap push.' },
      { title: 'Kontrol privasi leaderboard', desc: 'Pemberitahuan consent saat auto-join + tombol "Keluar dari leaderboard" yang menghapus entrimu (aman lewat token kepemilikan). Bisa gabung lagi kapan saja.' },
      { title: 'Badge Saya lebih rapi', desc: 'Badge di Poin Saya dikelompokkan per bulan, bisa difilter Game vs Skill, dan tiap badge yang dikenali nge-link ke halaman Skills Boost-nya.' },
      { title: 'Panduan pemula "Mulai dari Sini"', desc: 'Roadmap prioritas di atas Katalog: kerjakan Game dulu (kuota terbatas), lalu kejar milestone terdekat lewat badge, dengan progress dari profilmu.' },
      { title: 'Field guild di Poin Saya', desc: 'Isi kode guild saat hitung poin atau ubah kapan saja; tersimpan dan ikut saat sinkron ulang.' },
      { title: 'Poin mengikuti silabus resmi', desc: 'Hanya Arcade Game dan badge keahlian resmi yang menambah poin. Sebelumnya tracker memakai aturan longgar "semua badge non-game dihitung badge keahlian", sehingga badge dari course biasa (completion badge) ikut menaikkan poin dan mengisi syarat milestone. Akibatnya angka di sini tidak cocok dengan laporan progress resmi Google dan itu membingungkan. Badge yang tidak dihitung sekarang ditampilkan jumlahnya di Poin Saya, lengkap dengan alasannya, supaya selisihnya tidak jadi tebak-tebakan.' },
      { title: 'Katalog badge terpadu', desc: 'Game dan skill badge jadi satu koleksi: tab tipe, pencarian, filter status, dan toggle grid/list. Isinya hanya badge yang benar-benar berpoin, jadi tidak ada daftar panjang yang terlihat berguna padahal tidak menambah apa-apa.' },
      { title: 'Gambar badge skill asli', desc: '80 dari 93 skill badge tampil art resmi Google Skills, plus deteksi "Selesai" via alias nama badge untuk badge yang pernah diganti nama oleh Google.' },
      { title: 'Access code & buka game', desc: 'Klik badge game membuka halaman Google Skills dan menyalin access code otomatis.' },
      { title: 'Leaderboard podium ala Kahoot', desc: 'Top 3 di podium 2-1-3, sisanya list; responsif di mobile.' },
      { title: 'Auto-join dari Poin Saya', desc: 'Masukkan link profil sekali, otomatis muncul & tersinkron di leaderboard.' },
      { title: 'Judul tab per halaman', desc: 'document.title berubah tiap rute untuk navigasi & berbagi link yang lebih jelas.' },
      { title: 'Web Vitals lapangan', desc: 'Vercel Speed Insights memantau performa nyata pengguna.' },
      { title: 'CI otomatis', desc: 'GitHub Actions menjalankan build & test tiap push/PR sebelum merge.' },
    ],
  },
  {
    key: 'next',
    label: 'Sedang Dikerjakan / Berikutnya',
    tone: 'now',
    note: 'Prioritas dekat.',
    items: [
      { title: 'Leaderboard mingguan / "naik daun"', desc: 'Papan peringkat berdasarkan kenaikan poin minggu ini, menyorot peserta yang paling progresif, bukan cuma yang totalnya sudah tinggi. Perekaman datanya SUDAH JALAN: poin tiap peserta di-snapshot sekali sehari bersamaan dengan sinkronisasi otomatis. Papannya sendiri baru dipasang setelah snapshot terkumpul cukup, karena sebelum itu tidak ada selisih yang bisa ditampilkan.' },
      { title: 'Statistik mendalam per guild', desc: 'Lanjutan dari halaman perbandingan guild: tren poin guild dari waktu ke waktu dan badge apa yang paling banyak dikerjakan anggotanya. Menunggu data snapshot yang sama seperti leaderboard mingguan.' },
    ],
  },
  {
    key: 'plan',
    label: 'Direncanakan',
    tone: 'plan',
    note: 'Ide untuk nanti.',
    items: [
      { title: 'Notifikasi milestone', desc: 'Beri tahu (toast/push) saat kamu mencapai milestone berikutnya.' },
      { title: 'Dashboard analitik diperluas', desc: 'Grafik poin dari waktu ke waktu + breakdown per bulan/kategori, lanjutan dari chart yang sudah ada.' },
      { title: 'Toggle tema terang/gelap', desc: 'Pilihan tema; sekarang gelap-only. Simpan preferensi & hormati setting sistem.' },
      { title: 'Versi Bahasa Inggris (i18n)', desc: 'Dukungan dua bahasa agar bisa dipakai peserta non-Indonesia.' },
      { title: 'Digest opt-in', desc: 'Ringkasan progress mingguan via email/WhatsApp, sepenuhnya sukarela.' },
      { title: 'Pengalaman offline (PWA)', desc: 'Installable + halaman offline + prompt "versi baru tersedia".' },
      { title: 'Error monitoring & audit a11y', desc: 'Tangkap error produksi (mis. Sentry) dan audit aksesibilitas: kontras, keyboard-nav, ARIA.' },
      // Sengaja ditaruh paling akhir: butuh harness + env DB uji, dan fitur di atas masih bergerak.
      { title: 'Test komponen & E2E (browser)', desc: 'Tes render komponen (jsdom) + alur end-to-end di browser (Playwright). Butuh harness dan env database uji, dan paling berguna setelah fitur-fitur di atas mengendap, jadi dikerjakan paling akhir. Logika inti sendiri sudah ditutup 84 tes unit yang jalan di CI.' },
    ],
  },
]

// Item roadmap: judul selalu tampil, deskripsi collapsible (default tertutup).
function RmItem({ item, tone }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={'rmitem ' + tone + (open ? ' open' : '')}>
      <button className="ri-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <div className="ri-title">{item.title}</div>
        <span className="ri-chev" aria-hidden>▾</span>
      </button>
      <Collapse open={open}><div className="ri-desc">{item.desc}</div></Collapse>
    </div>
  )
}

function Group({ group, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={'card rmgroup' + (open ? '' : ' collapsed')}>
      <button className="rm-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className={'rm-badge ' + group.tone}>{group.label}</span>
        <span className="rm-count">{group.items.length}</span>
        <span className="rm-note">{group.note}</span>
        <span className="rm-chev" aria-hidden>▾</span>
      </button>
      <Collapse open={open}>
        <div className="rm-items">
          {group.items.map((it) => <RmItem key={it.title} item={it} tone={group.tone} />)}
        </div>
      </Collapse>
    </div>
  )
}

export default function Roadmap() {
  return (
    <div>
      <div className="card rm-intro">
        <div className="card-h">Roadmap Arcade Hub</div>
        <p className="rm-lead">Target dan arah pengembangan Arcade Hub. Tools ini open-source dan digerakkan komunitas fasilitator, jadi urutan bisa berubah sesuai kebutuhan dan masukan.</p>
        <p className="rm-lead" style={{ marginTop: 8 }}>Punya ide atau nemu bug? Kirim lewat tombol <b>Masukan</b> di pojok, atau lihat cara ikut kontribusi di halaman <Link to="/contribute">Kontribusi</Link>.</p>
      </div>
      <div className="rm-board">
        {/* "Sudah Rilis" (paling panjang) collapsed default; grup aktif tetap terbuka. */}
        {GROUPS.map((g) => <Group key={g.key} group={g} defaultOpen={g.key !== 'done'} />)}
      </div>
      <div className="foot" style={{ marginTop: 14 }}>Status best-effort, bukan janji rilis. Diperbarui seiring pengembangan.</div>
    </div>
  )
}
