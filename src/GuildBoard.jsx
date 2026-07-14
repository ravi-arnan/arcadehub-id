import { useEffect, useState, useCallback, useMemo } from 'react'
import { MS } from './points.js'
import { useMyProfile } from './profile.jsx'
import Tip from './Tip.jsx'
import Medal from './Medal.jsx'

const Rank = ({ i }) => (i > 2 ? <span className="rnum">{i + 1}</span> : <Medal i={i} className="rmedal" />)
const IconGame = () => <svg className="mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" x2="10" y1="11" y2="11" /><line x1="8" x2="8" y1="9" y2="13" /><line x1="15" x2="15.01" y1="12" y2="12" /><line x1="18" x2="18.01" y1="10" y2="10" /><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" /></svg>
const IconBadge = () => <svg className="mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /><circle cx="12" cy="8" r="6" /></svg>
const guildLabel = (g) => (!g || g === 'UMUM' ? 'Umum' : g)

function ago(iso) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000
  if (d < 60) return 'baru saja'
  if (d < 3600) return Math.floor(d / 60) + ' mnt lalu'
  if (d < 86400) return Math.floor(d / 3600) + ' jam lalu'
  return Math.floor(d / 86400) + ' hari lalu'
}

function useLocalObj(key, initial) {
  const [v, setV] = useState(() => { try { return JSON.parse(localStorage.getItem(key)) ?? initial } catch { return initial } })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* ignore */ } }, [key, v])
  return [v, setV]
}

// dukung ?guild=KODE untuk pre-isi kode + filter ke guild tsb
const urlGuild = (() => {
  try { const g = new URLSearchParams(location.search).get('guild'); return g ? g.trim().toUpperCase() : '' } catch { return '' }
})()

export default function GuildBoard() {
  const { profileUrl } = useMyProfile()
  const [me, setMe] = useLocalObj('gcaf2026_guild_me', null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [form, setForm] = useState({ name: '', profileUrl: profileUrl || '', code: urlGuild })
  const prefilled = !!profileUrl && form.profileUrl === profileUrl
  const [busy, setBusy] = useState(false)
  const [refreshingId, setRefreshingId] = useState(null)
  const [filter, setFilter] = useState(urlGuild || 'ALL')
  const [showJoin, setShowJoin] = useState(false)

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

  const join = async () => {
    setBusy(true); setErr('')
    try {
      const r = await fetch('/api/join', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Gagal bergabung')
      setMe({ id: j.id, name: j.member?.name })
      setFilter(j.guild || 'ALL')
      setForm({ ...form, name: '' })
      await load()
      return true
    } catch (e) { setErr(e.message); return false } finally { setBusy(false) }
  }

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

  // daftar guild + jumlah anggota
  const guilds = useMemo(() => {
    const map = new Map()
    members.forEach((m) => map.set(m.guild || 'UMUM', (map.get(m.guild || 'UMUM') || 0) + 1))
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }, [members])

  const shown = filter === 'ALL' ? members : members.filter((m) => (m.guild || 'UMUM') === filter)
  const reached = MS.map((_, i) => shown.filter((p) => p.tier_idx >= i).length)

  const join2 = async () => { if (await join()) setShowJoin(false) }

  return (
    <div>
      <button className={'joinToggle' + (showJoin ? ' open' : '')} onClick={() => setShowJoin((v) => !v)} aria-expanded={showJoin}>
        <span>{showJoin ? 'Tutup' : '＋ Gabung leaderboard / update poin'}</span>
        <span className="jt-caret">{showJoin ? '▾' : '▸'}</span>
      </button>
      {showJoin && (
      <div className="joincard">
        <p className="jp">Tempel link <b>public profile Google Cloud Skills Boost</b> kamu. Poin dihitung otomatis dari badge-mu. Submit lagi kapan pun untuk memperbarui.</p>
        <input className="fin" placeholder="Nama tampil (opsional)" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="fin" placeholder="https://www.cloudskillsboost.google/public_profiles/…" value={form.profileUrl}
          onChange={(e) => setForm({ ...form, profileUrl: e.target.value })} />
        {prefilled && <div className="prefill">✓ Terisi otomatis dari profil di tab Poin Saya</div>}
        <div className="frow">
          <input className="fin" placeholder="Kode guild (opsional, kosongkan = Umum)" value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && join2()} />
          <button className="joinbtn" onClick={join2} disabled={busy}>{busy ? 'Memproses…' : 'Gabung / Update'}</button>
        </div>
        {err && <div className="ferr">{err}</div>}
      </div>
      )}

      {loading ? (
        <div className="empty">Memuat leaderboard…</div>
      ) : members.length === 0 ? (
        <div className="empty">Belum ada peserta. Jadilah yang pertama gabung di atas!</div>
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
              <div key={p.id} className={'lbrow' + (p.tier_idx >= 0 ? ' hasms' : '') + (me?.id === p.id ? ' me' : '')}>
                <div className="rank"><Rank i={i} /></div>
                <div className="pinfo">
                  <div className="pname">{p.name}{me?.id === p.id && <span className="youtag">kamu</span>}</div>
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
          <div className="foot">Poin dihitung otomatis dari badge di profil (best-effort). Kode guild opsional: kosong = Umum, isi kode fasilitator untuk masuk guild-nya. Klik ↗ untuk verifikasi.</div>
        </>
      )}
    </div>
  )
}
