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
      { title: 'Shortlist "kerjakan selanjutnya"', desc: 'Di langkah 2 "Mulai dari Sini": 4 badge yang belum kamu ambil ditampilkan langsung, dengan tombol "Ganti saran" kalau topiknya kurang cocok. Bukan peringkat, cuma potongan pendek biar tidak perlu memilih dari daftar panjang.' },
      { title: 'Header keamanan (CSP)', desc: 'Content-Security-Policy aktif di produksi: script hanya dari domain sendiri, tanpa inline script, plus object-src/frame-src dikunci. Ada `npm run preview:csp` untuk menguji header yang sama secara lokal sebelum deploy.' },
      { title: 'Animasi pill navigasi', desc: 'Penanda menu aktif meluncur antar tab, bukan lompat. Ditulis ulang pakai transform CSS, jadi tidak perlu menambah bundle animasi layout, dan otomatis diam saat perangkat minta reduced-motion.' },
      { title: 'Pulih otomatis dari deploy baru', desc: 'Tab yang sedang terbuka saat versi baru dirilis tidak lagi mendarat di layar error karena chunk lama hilang: halaman me-refresh sendiri sekali, dengan pengaman supaya tidak jadi loop.' },
      { title: 'Proyeksi milestone', desc: 'Di "Mulai dari Sini": sisa hari menuju penutupan, berapa badge lagi yang dibutuhkan, kecepatan badge per minggu yang diperlukan dibanding kecepatanmu sekarang, plus perkiraan tanggal tercapai kalau ritmemu bertahan.' },
      { title: 'Cakupan tes diperluas', desc: 'Tes otomatis di luar logika poin: parsing profil (regex badge & tanggal), normalisasi URL + guard SSRF, matching katalog/alias, dan proyeksi milestone. 41 tes via node --test, ikut gate CI tiap push.' },
      { title: 'Kontrol privasi leaderboard', desc: 'Pemberitahuan consent saat auto-join + tombol "Keluar dari leaderboard" yang menghapus entrimu (aman lewat token kepemilikan). Bisa gabung lagi kapan saja.' },
      { title: 'Badge Saya lebih rapi', desc: 'Badge di Poin Saya dikelompokkan per bulan, bisa difilter Game vs Skill, dan tiap badge yang dikenali nge-link ke halaman Skills Boost-nya.' },
      { title: 'Panduan pemula "Mulai dari Sini"', desc: 'Roadmap prioritas di atas Katalog: kerjakan Game dulu (kuota terbatas), lalu kejar milestone terdekat lewat badge, dengan progress dari profilmu.' },
      { title: 'Field guild di Poin Saya', desc: 'Isi kode guild saat hitung poin atau ubah kapan saja; tersimpan dan ikut saat sinkron ulang.' },
      { title: 'Katalog badge terpadu', desc: 'Game + skill jadi satu koleksi: tab tipe, pencarian, filter status, dan toggle grid/list.' },
      { title: '68 gambar badge skill asli', desc: 'Tiap skill badge tampil art resmi Google Skills, plus deteksi "Selesai" via alias nama badge.' },
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
      { title: 'Test komponen & E2E (browser)', desc: 'Tes render komponen (jsdom) + alur end-to-end di browser (Playwright). Butuh harness + env DB uji, jadi dikerjakan setelah cakupan logika.' },
    ],
  },
  {
    key: 'plan',
    label: 'Direncanakan',
    tone: 'plan',
    note: 'Ide untuk nanti.',
    items: [
      { title: 'Notifikasi milestone', desc: 'Beri tahu (toast/push) saat kamu mencapai milestone berikutnya.' },
      { title: 'Halaman per-guild', desc: 'Leaderboard + statistik khusus satu guild (dibuka lewat ?guild=KODE), plus perbandingan antar-guild.' },
      { title: 'Leaderboard mingguan / "naik daun"', desc: 'Papan peringkat berdasarkan kenaikan poin minggu ini, menyorot peserta yang paling progresif.' },
      { title: 'Alert game baru', desc: 'Arcade rilis game tiap bulan; deteksi otomatis dan tandai game/badge "BARU" di katalog.' },
      { title: 'Dashboard analitik diperluas', desc: 'Grafik poin dari waktu ke waktu + breakdown per bulan/kategori, lanjutan dari chart yang sudah ada.' },
      { title: 'Toggle tema terang/gelap', desc: 'Pilihan tema; sekarang gelap-only. Simpan preferensi & hormati setting sistem.' },
      { title: 'Versi Bahasa Inggris (i18n)', desc: 'Dukungan dua bahasa agar bisa dipakai peserta non-Indonesia.' },
      { title: 'Digest opt-in', desc: 'Ringkasan progress mingguan via email/WhatsApp, sepenuhnya sukarela.' },
      { title: 'Pengalaman offline (PWA)', desc: 'Installable + halaman offline + prompt "versi baru tersedia".' },
      { title: 'Error monitoring & audit a11y', desc: 'Tangkap error produksi (mis. Sentry) dan audit aksesibilitas: kontras, keyboard-nav, ARIA.' },
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
