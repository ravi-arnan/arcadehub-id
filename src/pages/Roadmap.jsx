import { Link } from 'react-router-dom'

// Roadmap pengembangan Arcade Hub. Halaman ini sengaja TIDAK ada di top nav (hanya via footer/link langsung).
const GROUPS = [
  {
    key: 'done',
    label: 'Sudah Rilis',
    tone: 'done',
    note: 'Sudah live di produksi.',
    items: [
      { title: 'Katalog badge terpadu', desc: 'Game + skill jadi satu koleksi: tab tipe, pencarian, filter status, dan toggle grid/list.' },
      { title: '68 gambar badge skill asli', desc: 'Tiap skill badge tampil art resmi Google Skills, plus deteksi "Selesai" via alias nama badge.' },
      { title: 'Access code & buka game', desc: 'Klik badge game membuka halaman Google Skills dan menyalin access code otomatis.' },
      { title: 'Leaderboard podium ala Kahoot', desc: 'Top 3 di podium 2-1-3, sisanya list; responsif di mobile.' },
      { title: 'Badge Saya (mirror akun)', desc: 'Daftar semua badge yang kamu earn dari profil, bisa dilipat.' },
      { title: 'Auto-join dari Poin Saya', desc: 'Masukkan link profil sekali, otomatis muncul & tersinkron di leaderboard.' },
    ],
  },
  {
    key: 'next',
    label: 'Sedang Dikerjakan / Berikutnya',
    tone: 'now',
    note: 'Prioritas dekat.',
    items: [
      { title: 'Kontrol privasi leaderboard', desc: 'Tombol "keluar dari leaderboard" di UI + consent kecil saat auto-join.' },
      { title: 'Field guild di Poin Saya', desc: 'Kembalikan input guild (sekarang hanya via ?guild=KODE).' },
      { title: 'CI otomatis', desc: 'GitHub Actions untuk cek build & test tiap PR sebelum merge.' },
      { title: 'Badge Saya lebih rapi', desc: 'Grup per bulan / filter game vs skill, dan link ke tiap badge.' },
    ],
  },
  {
    key: 'plan',
    label: 'Direncanakan',
    tone: 'plan',
    note: 'Ide untuk nanti.',
    items: [
      { title: 'Web Vitals lapangan', desc: 'Pasang Speed Insights untuk pantau performa nyata pengguna.' },
      { title: 'Judul & meta per halaman', desc: 'Update document.title dan meta per rute untuk SEO/berbagi.' },
      { title: 'Notifikasi milestone', desc: 'Beri tahu saat kamu mencapai milestone berikutnya.' },
      { title: 'Pengalaman offline (PWA)', desc: 'Halaman offline + prompt "versi baru tersedia".' },
    ],
  },
]

function Group({ group }) {
  return (
    <div className="card rmgroup">
      <div className="rm-head">
        <span className={'rm-badge ' + group.tone}>{group.label}</span>
        <span className="rm-count">{group.items.length}</span>
        <span className="rm-note">{group.note}</span>
      </div>
      <div className="rm-items">
        {group.items.map((it) => (
          <div key={it.title} className={'rmitem ' + group.tone}>
            <span className="ri-dot" aria-hidden />
            <div>
              <div className="ri-title">{it.title}</div>
              <div className="ri-desc">{it.desc}</div>
            </div>
          </div>
        ))}
      </div>
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
      {GROUPS.map((g) => <Group key={g.key} group={g} />)}
      <div className="foot" style={{ marginTop: 14 }}>Status best-effort, bukan janji rilis. Diperbarui seiring pengembangan.</div>
    </div>
  )
}
