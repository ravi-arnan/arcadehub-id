import { useEffect, useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MS } from '../points.js'
import { useMyProfile } from '../profile.jsx'
import Tip from '../Tip.jsx'
import Medal from '../Medal.jsx'
import Collapse from '../components/Collapse.jsx'
import { ago } from '../utils/time.js'

const Rank = ({ i }) => (i > 2 ? <span className="rnum">{i + 1}</span> : <Medal i={i} className="rmedal" />)
const IconGame = () => <svg className="mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" x2="10" y1="11" y2="11" /><line x1="8" x2="8" y1="9" y2="13" /><line x1="15" x2="15.01" y1="12" y2="12" /><line x1="18" x2="18.01" y1="10" y2="10" /><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" /></svg>
const IconBadge = () => <svg className="mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /><circle cx="12" cy="8" r="6" /></svg>
const IconFilter = () => <svg className="gf-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
const guildLabel = (g) => (!g || g === 'UMUM' ? 'Umum' : g)

function PodiumCard({ p, place, isMe, refreshing, onRefresh }) {
  return (
    <div className={`pod pod-${place}${isMe ? ' me' : ''}`}>
      <Medal i={place - 1} className="pod-medal" />
      <div className="pod-name" title={p.name}>{p.name}{isMe && <span className="youtag">kamu</span>}</div>
      <span className="gtag pod-guild">{guildLabel(p.guild)}</span>
      <div className="pod-score">{p.total}<span>poin</span></div>
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
      <div className="pod-plinth">{place}</div>
    </div>
  )
}

// dukung ?guild=KODE untuk auto-filter ke guild tsb
const urlGuild = (() => {
  try { const g = new URLSearchParams(location.search).get('guild'); return g ? g.trim().toUpperCase() : '' } catch { return '' }
})()

export default function Leaderboard() {
  const { profileUrl, memberId } = useMyProfile()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [refreshingId, setRefreshingId] = useState(null)
  const [filter, setFilter] = useState(urlGuild || 'ALL')
  const [filterOpen, setFilterOpen] = useState(false)

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
    members.forEach((m) => map.set(m.guild || 'UMUM', (map.get(m.guild || 'UMUM') || 0) + 1))
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }, [members])

  const shown = filter === 'ALL' ? members : members.filter((m) => (m.guild || 'UMUM') === filter)
  const reached = MS.map((_, i) => shown.filter((p) => p.tier_idx >= i).length)
  const isMe = (p) => (memberId && p.id === memberId) || (profileUrl && p.profile_url === profileUrl)

  return (
    <div>
      <div className="lb-note">
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

          <div className="lbsummary">
            <span className="chip">Peserta: <b>{shown.length}</b></span>
            {MS.map((m, i) => reached[i] > 0 ? <span key={m.short} className="chip">{m.short}: <b>{reached[i]}</b></span> : null)}
            <button className="miniref" onClick={() => load(true)} aria-label="Muat ulang leaderboard">↻ Muat ulang</button>
          </div>

          {shown.length > 0 && (
            <div className="podium">
              {shown.slice(0, 3).map((p, i) => (
                <PodiumCard key={p.id} p={p} place={i + 1} isMe={isMe(p)} refreshing={refreshingId === p.id} onRefresh={() => refresh(p.id)} />
              ))}
            </div>
          )}

          {shown.length > 3 && (
            <div className="lblist">
              {shown.slice(3).map((p, i) => (
                <div key={p.id} className={'lbrow' + (p.tier_idx >= 0 ? ' hasms' : '') + (isMe(p) ? ' me' : '')}>
                  <div className="rank"><Rank i={i + 3} /></div>
                  <div className="pinfo">
                    <div className="pname">{p.name}{isMe(p) && <span className="youtag">kamu</span>}</div>
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
                      <button className="miniref" disabled={refreshingId === p.id} onClick={() => refresh(p.id)} aria-label={'Sinkronkan ulang ' + p.name}>
                        {refreshingId === p.id ? '…' : '↻'}
                      </button>
                    </Tip>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="foot">Poin dihitung otomatis dari badge di profil (best-effort). Klik ↗ untuk verifikasi. Untuk masuk guild fasilitator, buka link dengan ?guild=KODE.</div>
        </>
      )}
    </div>
  )
}
