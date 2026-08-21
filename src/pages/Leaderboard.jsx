import { useEffect, useState, useCallback, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MS } from '../points.js'
import { searchMembers } from '../../lib/searchMembers.js'
import { competitionRanks, tieCounts, nextTotalAbove } from '../../lib/rank.js'
import { useMyProfile } from '../profile.jsx'
import Tip from '../Tip.jsx'
import Medal from '../Medal.jsx'
import Collapse from '../components/Collapse.jsx'
import { ago } from '../utils/time.js'
import { guildKey, guildLabel, DEFAULT_GUILD } from '../../lib/guild.js'
import { IconGamepad } from '../icons.jsx'

// `tied` menandai peringkat yang dibagi beberapa orang. Tanpa tanda itu, dua peserta
// berpoin sama tampak seperti yang satu mengalahkan yang lain.
const Rank = ({ i, tied }) => (i > 2
  ? <span className="rnum">{tied && <span className="rtie" aria-hidden>=</span>}{i + 1}</span>
  : <Medal i={i} className="rmedal" />)
const IconGame = () => <IconGamepad className="mini" />
// Sengaja TIDAK diganti IconAward dari icons.jsx: glif-nya beda (pita polos vs pita berlekuk),
// jadi menukarnya itu perubahan tampilan, bukan dedup. Dipakai dua kali di file ini saja.
const IconBadge = () => <svg className="mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /><circle cx="12" cy="8" r="6" /></svg>
const IconFilter = () => <svg className="gf-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
const IconSearch = () => <svg className="lbs-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>

// `place` = posisi slot di layout (1 kiri, 2 tengah, 3 kanan), `rank` = peringkat
// sebenarnya. Dua hal berbeda begitu ada poin seri: 12 peserta sama-sama 99 poin, jadi
// slot kedua dan ketiga dua-duanya peringkat 2 dan dua-duanya berhak medali perak.
function PodiumCard({ p, place, rank, tied, isMe, refreshing, onRefresh }) {
  return (
    <div className={`pod pod-${place}${isMe ? ' me' : ''}`}>
      <Medal i={rank} className="pod-medal" />
      <div className="pod-name" title={p.name}>{p.name}{isMe && <span className="youtag">kamu</span>}</div>
      <span className="gtag pod-guild">{guildLabel(p.guild)}</span>
      <div className="pod-score">{p.total}<span>poin</span></div>
      {/* Pemaksa ganti baris untuk layout mobile: tanpa ini, kartu dengan nama pendek
          menaikkan chip guild ke baris pertama sehingga tiap kartu tampak beda susunan. */}
      <span className="pod-break" aria-hidden="true" />
      <div className="pod-stats">
        <span className="pstat"><IconGame />{p.games}</span>
        <span className="pstat"><IconBadge />{p.skills}</span>
      </div>
      <div className="pod-acts">
        <Tip label={'Lihat profil ' + p.name}>
          <a className="viewlink" href={p.profile_url} target="_blank" rel="noreferrer" aria-label={'Lihat profil ' + p.name}>↗</a>
        </Tip>
        <Tip label="Sinkronkan ulang poin">
          <button className="miniref" disabled={refreshing} onClick={onRefresh} aria-label={'Sinkronkan ulang ' + p.name}>{refreshing ? '…' : '↻'}</button>
        </Tip>
      </div>
      <div className="pod-plinth">{tied && <span className="rtie" aria-hidden>=</span>}{rank + 1}</div>
    </div>
  )
}

// rank dilewatkan dari luar, bukan dihitung dari urutan render: hasil pencarian
// harus tetap menunjukkan peringkat asli peserta di leaderboard, bukan nomor
// urut di daftar hasil.
function MemberRow({ p, rank, tied, isMe, refreshing, onRefresh }) {
  return (
    <div className={'lbrow' + (p.tier_idx >= 0 ? ' hasms' : '') + (isMe ? ' me' : '')}>
      <div className="rank"><Rank i={rank} tied={tied} /></div>
      <div className="pinfo">
        <div className="pname">{p.name}{isMe && <span className="youtag">kamu</span>}</div>
        <div className="ptier">
          <span className="gtag">{guildLabel(p.guild)}</span>
          <span className="pstat"><IconGame />{p.games}</span> <span className="pstat"><IconBadge />{p.skills}</span> · sync {ago(p.last_synced)}
        </div>
      </div>
      <div className="pscore">{p.total}<small>poin</small></div>
      <div className="pacts">
        <Tip label={'Lihat profil ' + p.name}>
          <a className="viewlink" href={p.profile_url} target="_blank" rel="noreferrer" aria-label={'Lihat profil ' + p.name}>↗</a>
        </Tip>
        <Tip label="Sinkronkan ulang poin">
          <button className="miniref" disabled={refreshing} onClick={onRefresh} aria-label={'Sinkronkan ulang ' + p.name}>
            {refreshing ? '…' : '↻'}
          </button>
        </Tip>
      </div>
    </div>
  )
}

// Berapa peringkat teratas yang tampil sebelum tombol "tampilkan sisanya". 50 dipilih karena
// itu batas orang masih mau menggulir; sisanya hampir selalu peserta 0 poin yang belum mulai,
// dan menggulirinya tidak memberi informasi apa pun.
const TOP_N = 50

// Peringkat sendiri, ditulis sebagai konteks, bukan vonis. Nomor peringkat mentah
// menyesatkan di data serapat ini: cuma ada 68 nilai poin unik untuk 209 peserta, jadi
// selisih beberapa poin melompati puluhan orang sekaligus.
function MyStanding({ shown, me, rank, tiedWith }) {
  const beat = shown.filter((p) => p.total < me.total).length
  const pct = shown.length > 1 ? Math.round((beat / (shown.length - 1)) * 100) : 100
  // Nilai poin unik terdekat di atas: itu lompatan peringkat berikutnya yang tersedia.
  const nextTotal = nextTotalAbove(shown, me.total)
  const nextRank = nextTotal === null ? null : shown.filter((p) => p.total > nextTotal).length

  return (
    <div className="mystand">
      <div className="ms-rank">
        <span className="ms-hash">#</span>{tiedWith > 0 && <span className="rtie" aria-hidden>=</span>}{rank + 1}
        <span className="ms-of">dari {shown.length}</span>
      </div>
      <div className="ms-body">
        {/* Peserta di dasar klasemen tidak diberi baris ini: "unggul dari 0 peserta"
            cuma menegaskan yang sudah ia tahu. Buat mereka, kalimat lompatan di
            bawahnya yang jadi pesan utama, dan itu justru kabar baik. */}
        {beat > 0 && (
          <div className="ms-t">
            Kamu unggul dari <b>{beat}</b> peserta ({pct}%).
            {tiedWith > 0 && <span className="ms-tie"> Seri dengan {tiedWith} peserta lain.</span>}
          </div>
        )}
        {nextTotal !== null ? (
          <div className="ms-p">
            Tambah <b>{nextTotal - me.total} poin</b> dan peringkatmu naik ke <b>{nextRank + 1}</b>
            {rank - nextRank > 1 && <>, melompati {rank - nextRank} posisi sekaligus</>}.
          </div>
        ) : (
          <div className="ms-p">Kamu di puncak leaderboard.</div>
        )}
      </div>
    </div>
  )
}

export default function Leaderboard() {
  const { profileUrl, memberId } = useMyProfile()
  // ?guild=KODE dibaca lewat useSearchParams, BUKAN sekali di level modul seperti dulu.
  // Nilai level modul cuma dihitung saat chunk pertama dimuat, jadi link dalam aplikasi
  // (dari /guilds) tidak akan pernah mengubah filter: rutenya berganti tapi modulnya
  // sudah terlanjur dievaluasi. Dulu tidak ketahuan karena satu-satunya jalan ke sini
  // dengan ?guild= adalah membuka URL-nya langsung, yang selalu memuat modul dari nol.
  const [params] = useSearchParams()
  const urlGuild = (params.get('guild') || '').trim().toUpperCase()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [refreshingId, setRefreshingId] = useState(null)
  const [filter, setFilter] = useState(urlGuild || 'ALL')
  const [filterOpen, setFilterOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  // bust=true melewati cache edge (dipakai tombol Muat ulang & setelah sync) agar data terbaru.
  const load = useCallback(async (bust) => {
    setLoading(true); setErr('')
    try {
      const r = await fetch('/api/leaderboard' + (bust ? '?t=' + Date.now() : ''))
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Gagal memuat')
      setMembers(j.members || [])
    } catch (e) { setErr(e.message) } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  // Ganti guild artinya daftarnya beda; kalau "tampilkan semua" ikut terbawa, peserta
  // mendarat di daftar 200 baris yang tidak pernah ia minta.
  useEffect(() => { setShowAll(false) }, [filter])

  const refresh = async (id) => {
    setRefreshingId(id); setErr('')
    try {
      const r = await fetch('/api/refresh', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Gagal refresh')
      await load(true)
    } catch (e) { setErr(e.message) } finally { setRefreshingId(null) }
  }

  const guilds = useMemo(() => {
    const map = new Map()
    members.forEach((m) => map.set(guildKey(m.guild), (map.get(guildKey(m.guild)) || 0) + 1))
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }, [members])

  const shown = filter === 'ALL' ? members : members.filter((m) => guildKey(m.guild) === filter)
  const reached = MS.map((_, i) => shown.filter((p) => p.tier_idx >= i).length)
  const isMe = (p) => (memberId && p.id === memberId) || (profileUrl && p.profile_url === profileUrl)

  // Sekali saja setelah data masuk: kalau peserta punya guild sungguhan, mulai dari
  // guild itu. Bukan untuk 'Umum', karena hampir semua orang ada di sana sehingga
  // menyaringnya tidak memangkas apa pun. Ambang 5 anggota supaya peserta guild
  // berisi 2 orang tidak mendarat di leaderboard dua baris, yang lebih buruk daripada
  // daftar penuh.
  const [autoFiltered, setAutoFiltered] = useState(false)
  useEffect(() => {
    if (autoFiltered || urlGuild || members.length === 0) return
    setAutoFiltered(true)
    const mine = members.find(isMe)
    if (!mine) return
    const key = guildKey(mine.guild)
    if (key === DEFAULT_GUILD) return
    if (members.filter((x) => guildKey(x.guild) === key).length < 5) return
    setFilter(key)
  }, [members, autoFiltered, urlGuild])

  const searching = query.trim() !== ''
  const results = useMemo(() => searchMembers(shown, query), [shown, query])
  // Peringkat asli tiap peserta dalam tampilan sekarang, dipetakan sebelum
  // pencarian menyaring. Tanpa ini, hasil cari akan menampilkan medali emas
  // untuk siapa pun yang kebetulan jadi baris pertama.
  // Peringkat kompetisi: poin sama berarti peringkat sama, dan peserta berikutnya
  // melompat sebanyak jumlah yang seri. Sebelumnya peringkat diambil dari posisi array,
  // jadi 12 peserta berpoin 99 mendapat nomor 2 sampai 13 dan yang di nomor 13 terlihat
  // kalah padahal poinnya identik.
  const rankOf = useMemo(() => competitionRanks(shown), [shown])
  const tiedTotals = useMemo(() => tieCounts(shown), [shown])
  const isTied = (p) => (tiedTotals.get(p.total) || 0) > 1

  // Daftar di bawah podium, dipotong di TOP_N kecuali diminta lengkap.
  const rest = shown.slice(3)
  const visible = showAll ? rest : rest.slice(0, Math.max(0, TOP_N - 3))
  const hidden = rest.length - visible.length
  // Peringkat sendiri dicari di seluruh daftar, bukan cuma yang tampil: justru saat
  // posisimu ada di luar potongan itulah baris ini paling dibutuhkan.
  const myIdx = shown.findIndex(isMe)
  const meHidden = myIdx >= TOP_N && !showAll

  return (
    <div>
      <div className="lb-note" id="lb-top">
        <span>Poin otomatis tersinkron dari tab <b>Poin Saya</b>. Masukkan link profil di sana, kamu langsung muncul di sini.</span>
        {!profileUrl && <Link className="joinbtn lb-note-btn" to="/points">Masuk lewat Poin Saya</Link>}
      </div>

      {err && <div className="ferr">{err}</div>}

      {loading ? (
        <div className="lb-skel" aria-hidden="true">
          <div className="lb-skel-sum" />
          <div className="lb-skel-podium">
            <div className="sk-pod p2" /><div className="sk-pod p1" /><div className="sk-pod p3" />
          </div>
          <div className="lb-skel-rows">
            {[0, 1, 2, 3, 4].map((i) => <div key={i} className="sk-row" />)}
          </div>
        </div>
      ) : members.length === 0 ? (
        <div className="empty">Belum ada peserta. <Link to="/points">Hitung poinmu di Poin Saya</Link> untuk jadi yang pertama.</div>
      ) : (
        <>
          {guilds.length > 1 && (
            <div className="gf-wrap">
              <button className={'gf-trig' + (filter !== 'ALL' ? ' active' : '')} onClick={() => setFilterOpen((o) => !o)}
                aria-expanded={filterOpen} aria-controls="gf-panel">
                <IconFilter />
                <span className="gf-val">{filter === 'ALL' ? 'Semua guild' : guildLabel(filter)}</span>
                <span className="gf-cnt">{shown.length}</span>
                <span className="gf-chev" aria-hidden>▾</span>
              </button>
              {/* Pintu masuk ke /guilds ditaruh di sini, bukan cuma di footer: orang yang
                  penasaran soal guild sedang berdiri tepat di filter guild. */}
              <Link className="gf-compare" to="/guilds">Bandingkan guild <span aria-hidden>→</span></Link>
              <Collapse open={filterOpen}>
                <div className="gfilter gf-panel" id="gf-panel">
                  <button className={filter === 'ALL' ? 'on' : ''} onClick={() => { setFilter('ALL'); setFilterOpen(false) }}>Semua ({members.length})</button>
                  {guilds.map(([g, n]) => (
                    <button key={g} className={filter === g ? 'on' : ''} onClick={() => { setFilter(g); setFilterOpen(false) }}>{guildLabel(g)} ({n})</button>
                  ))}
                </div>
              </Collapse>
            </div>
          )}

          <div className="lbsearch">
            <IconSearch />
            <input
              className="lbs-in"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama peserta…"
              aria-label="Cari nama peserta"
            />
            {searching && (
              <>
                {/* aria-live: pembaca layar tidak melihat daftar berubah, jadi
                    jumlah hasilnya harus diumumkan. */}
                <span className="lbs-cnt" aria-live="polite">{results.length} hasil</span>
                <button className="lbs-clear" onClick={() => setQuery('')} aria-label="Hapus pencarian">×</button>
              </>
            )}
          </div>

          <div className="lbsummary">
            <span className="chip">Peserta: <b>{shown.length}</b></span>
            {MS.map((m, i) => reached[i] > 0 ? <span key={m.short} className="chip">{m.short}: <b>{reached[i]}</b></span> : null)}
            <button className="miniref" onClick={() => load(true)} aria-label="Muat ulang leaderboard">↻ Muat ulang</button>
          </div>

          {myIdx >= 0 && (
            <MyStanding shown={shown} me={shown[myIdx]} rank={rankOf.get(shown[myIdx].id)}
              tiedWith={(tiedTotals.get(shown[myIdx].total) || 1) - 1} />
          )}

          {/* Saat mencari, podium dilewati: menaruh hasil cari di atas podium
              bakal memasangkan medali emas ke orang yang sebenarnya peringkat 50.
              Hasilnya jadi daftar datar dengan peringkat aslinya masing-masing. */}
          {searching ? (
            results.length === 0 ? (
              <div className="empty">Tidak ada peserta bernama “{query.trim()}”.</div>
            ) : (
              <div className="lblist">
                {results.map((p) => (
                  <MemberRow key={p.id} p={p} rank={rankOf.get(p.id)} tied={isTied(p)} isMe={isMe(p)}
                    refreshing={refreshingId === p.id} onRefresh={() => refresh(p.id)} />
                ))}
              </div>
            )
          ) : (
            <>
              {shown.length > 0 && (
                <div className="podium">
                  {shown.slice(0, 3).map((p, i) => (
                    <PodiumCard key={p.id} p={p} place={i + 1} rank={rankOf.get(p.id)} tied={isTied(p)}
                      isMe={isMe(p)} refreshing={refreshingId === p.id} onRefresh={() => refresh(p.id)} />
                  ))}
                </div>
              )}

              {visible.length > 0 && (
                <div className="lblist">
                  {visible.map((p) => (
                    <MemberRow key={p.id} p={p} rank={rankOf.get(p.id)} tied={isTied(p)} isMe={isMe(p)}
                      refreshing={refreshingId === p.id} onRefresh={() => refresh(p.id)} />
                  ))}

                  {/* Posisi sendiri diselipkan di ujung potongan supaya tidak perlu
                      menggulir 150 baris cuma untuk melihat peringkat sendiri. */}
                  {meHidden && (
                    <>
                      <div className="lbgap" aria-hidden>· · ·</div>
                      <MemberRow p={shown[myIdx]} rank={rankOf.get(shown[myIdx].id)} tied={isTied(shown[myIdx])} isMe
                        refreshing={refreshingId === shown[myIdx].id} onRefresh={() => refresh(shown[myIdx].id)} />
                    </>
                  )}
                </div>
              )}

              {hidden > 0 && (
                <button className="lbmore" onClick={() => setShowAll(true)}>
                  Tampilkan {hidden} peserta lainnya
                  <span className="lbmore-sub">peringkat {TOP_N + 1} sampai {shown.length}</span>
                </button>
              )}

              {showAll && rest.length > TOP_N - 3 && (
                <button className="lbmore lbless" onClick={() => { setShowAll(false); document.getElementById('lb-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>
                  Ringkas lagi ke {TOP_N} teratas
                </button>
              )}
            </>
          )}
          <div className="foot">Poin dihitung otomatis dari badge di profil (best-effort). Klik ↗ untuk verifikasi. Untuk masuk guild fasilitator, buka link dengan ?guild=KODE.</div>
        </>
      )}
    </div>
  )
}
