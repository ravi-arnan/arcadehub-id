import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MS } from '../points.js'
import { guildStats } from '../../lib/guildStats.js'
import { guildKey } from '../../lib/guild.js'
import { useMyProfile } from '../profile.jsx'
import Medal from '../Medal.jsx'
import { IconArrowRight } from '../icons.jsx'

// Peringkat guild pakai total poin, jadi guild besar hampir selalu menang. Rata-rata
// ditampilkan berdampingan supaya guild kecil yang efisien tetap terbaca, bukan tenggelam.
export default function Guilds() {
  const { guild: myGuild } = useMyProfile()
  const [members, setMembers] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    // Status HTTP wajib diperiksa: badan error dari API bentuknya {error}, tanpa `members`.
    // Kalau langsung `j.members || []`, kegagalan server tampil sebagai "belum ada peserta",
    // yang membuat orang mengira leaderboard-nya kosong padahal backend-nya yang bermasalah.
    fetch('/api/leaderboard')
      .then(async (r) => {
        const j = await r.json()
        if (!r.ok) throw new Error(j.error || 'Gagal memuat data guild')
        return j
      })
      .then((j) => setMembers(j.members || []))
      .catch((e) => { setErr(e.message); setMembers([]) })
  }, [])

  const guilds = useMemo(() => guildStats(members || []), [members])
  const mine = myGuild ? guildKey(myGuild) : null

  if (members === null) {
    return (
      <div className="card">
        <div className="card-h">Guild</div>
        <div className="rskel">
          {[0, 1, 2].map((i) => <div key={i} className="skel sk-block short" />)}
        </div>
      </div>
    )
  }

  if (err) return <div className="ferr">{err}</div>

  if (guilds.length === 0) {
    return (
      <div className="empty">
        Belum ada peserta sama sekali. <Link to="/points">Hitung poinmu di Poin Saya</Link> untuk jadi yang pertama.
      </div>
    )
  }

  const totalMembers = members.length
  const totalPoints = guilds.reduce((n, g) => n + g.total, 0)
  const topAvg = Math.max(...guilds.map((g) => g.avg))

  return (
    <div>
      <div className="card">
        <div className="card-h">Perbandingan Guild <span className="card-tag">{guilds.length}</span></div>
        <div className="card-note" style={{ marginTop: 0 }}>
          Guild diambil dari kode yang dipakai peserta saat menghitung poin. Peserta tanpa kode masuk
          ke <b>Umum</b>. Urutannya memakai total poin, jadi guild besar wajar unggul. Kolom rata-rata
          ada supaya guild kecil yang aktif tetap kelihatan.
        </div>
        <div className="stats3" style={{ marginTop: 14 }}>
          <div className="stat"><div className="s-n">{guilds.length}</div><div className="s-l">Guild</div></div>
          <div className="stat"><div className="s-n">{totalMembers}</div><div className="s-l">Peserta</div></div>
          <div className="stat"><div className="s-n">{totalPoints.toLocaleString('id-ID')}</div><div className="s-l">Total poin</div></div>
        </div>
      </div>

      <div className="gl-list">
        {guilds.map((g, i) => (
          <div key={g.code} className={'gl-card' + (g.code === mine ? ' me' : '')}>
            <div className="gl-rank">{i < 3 ? <Medal i={i} className="rmedal" /> : <span className="rnum">{i + 1}</span>}</div>
            <div className="gl-main">
              <div className="gl-name">
                {g.label}
                {g.code === mine && <span className="youtag">guildmu</span>}
                {g.avg === topAvg && guilds.length > 1 && <span className="gl-tag">rata-rata tertinggi</span>}
              </div>
              <div className="gl-meta">
                {g.count} peserta · {g.games} game · {g.skills} badge
              </div>
              {/* Chip milestone dilewati kalau nol supaya guild pemula tidak jadi deretan angka 0. */}
              <div className="gl-ms">
                {MS.map((m, mi) => g.reached[mi] > 0
                  ? <span key={m.short} className="chip">{m.short}: <b>{g.reached[mi]}</b></span>
                  : null)}
              </div>
            </div>
            <div className="gl-nums">
              <div className="gl-total">{g.total.toLocaleString('id-ID')}<span>poin</span></div>
              <div className="gl-avg">rata-rata <b>{g.avg.toLocaleString('id-ID')}</b> · tertinggi <b>{g.best}</b></div>
            </div>
            <Link className="gl-open" to={`/leaderboard?guild=${encodeURIComponent(g.code)}`}>
              Lihat peserta <IconArrowRight width="14" height="14" />
            </Link>
          </div>
        ))}
      </div>

      <div className="foot" style={{ marginTop: 14 }}>
        Ingin peserta guildmu masuk ke sini? Bagikan link Poin Saya dengan <b>?guild=KODE</b> di
        belakangnya; kode itu ikut tersimpan otomatis saat mereka menghitung poin.
      </div>
    </div>
  )
}
