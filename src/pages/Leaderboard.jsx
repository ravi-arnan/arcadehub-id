import { useEffect, useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MS } from '../points.js'
import { useMyProfile } from '../profile.jsx'
import Tip from '../Tip.jsx'
import Medal from '../Medal.jsx'
import { ago } from '../utils/time.js'

const Rank = ({ i }) => (i > 2 ? <span className="rnum">{i + 1}</span> : <Medal i={i} className="rmedal" />)
const IconGame = () => <svg className="mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" x2="10" y1="11" y2="11" /><line x1="8" x2="8" y1="9" y2="13" /><line x1="15" x2="15.01" y1="12" y2="12" /><line x1="18" x2="18.01" y1="10" y2="10" /><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" /></svg>
const IconBadge = () => <svg className="mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /><circle cx="12" cy="8" r="6" /></svg>
const guildLabel = (g) => (!g || g === 'UMUM' ? 'Umum' : g)

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

  const load = useCallback(async () => {
    setLoading(true); setErr('')
    try {
      const r = await fetch('/api/leaderboard')
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
      await load()
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
        <div className="empty">Memuat leaderboard…</div>
      ) : members.length === 0 ? (
        <div className="empty">Belum ada peserta. <Link to="/points">Hitung poinmu di Poin Saya</Link> untuk jadi yang pertama.</div>
      ) : (
        <>
          {guilds.length > 1 && (
            <div className="gfilter">
              <button className={filter === 'ALL' ? 'on' : ''} onClick={() => setFilter('ALL')}>Semua ({members.length})</button>
              {guilds.map(([g, n]) => (
                <button key={g} className={filter === g ? 'on' : ''} onClick={() => setFilter(g)}>{guildLabel(g)} ({n})</button>
              ))}
            </div>
          )}

          <div className="lbsummary">
            <span className="chip">Peserta: <b>{shown.length}</b></span>
            {MS.map((m, i) => reached[i] > 0 ? <span key={m.short} className="chip">{m.short}: <b>{reached[i]}</b></span> : null)}
            <button className="miniref" onClick={load} aria-label="Muat ulang leaderboard">↻ Muat ulang</button>
          </div>

          <div className="lblist">
            {shown.map((p, i) => (
              <div key={p.id} className={'lbrow' + (p.tier_idx >= 0 ? ' hasms' : '') + (isMe(p) ? ' me' : '')}>
                <div className="rank"><Rank i={i} /></div>
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
          <div className="foot">Poin dihitung otomatis dari badge di profil (best-effort). Klik ↗ untuk verifikasi. Untuk masuk guild fasilitator, buka link dengan ?guild=KODE.</div>
        </>
      )}
    </div>
  )
}
