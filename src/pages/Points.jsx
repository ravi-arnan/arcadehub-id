import { useEffect, useState, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { MS, TIERS, tierForPoints } from '../points.js'
import { useCountUp } from '../useCountUp.js'
import { useMyProfile } from '../profile.jsx'
import { WeeklyChart, CategoryTable, MonthlyGames } from '../Insights.jsx'
import Medal from '../Medal.jsx'

// Modal share (pakai Radix Dialog) hanya di-load saat tombol Bagikan diklik.
const ShareCard = lazy(() => import('../ShareCard.jsx'))
import Bar from '../components/Bar.jsx'
import MyBadges from '../components/MyBadges.jsx'
import Collapse from '../components/Collapse.jsx'
import ArcadeHero from '../components/ArcadeHero.jsx'
import BonusMilestone from '../components/BonusMilestone.jsx'
import { ago } from '../utils/time.js'
import { guildKey, guildLabel } from '../../lib/guild.js'
import { IconTrophy } from '../icons.jsx'

// Guild tampil/ubah di tampilan tersinkron. Kosongkan lalu simpan tidak menghapus guild lama (backend COALESCE).
function GuildRow() {
  const { profileUrl, guild, loading, fetchScore } = useMyProfile()
  const [edit, setEdit] = useState(false)
  const [val, setVal] = useState(guild || '')
  const save = () => { fetchScore(profileUrl, val).catch(() => {}); setEdit(false) }
  if (!edit) {
    return (
      <div className="guildrow">
        <span className="pmeta">Guild: <b>{guild || 'belum diatur'}</b></span>
        <button className="miniref" onClick={() => { setVal(guild || ''); setEdit(true) }}>{guild ? 'Ubah' : 'Atur guild'}</button>
      </div>
    )
  }
  return (
    <div className="guildrow">
      <input className="fin guildin" placeholder="Kode guild" value={val} autoFocus
        onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && save()} />
      <button className="miniref accent" disabled={loading} onClick={save}>Simpan</button>
      <button className="miniref" onClick={() => setEdit(false)}>Batal</button>
    </div>
  )
}

// Poin Saya: otomatis dari public profile Cloud Skills Boost (bukan input manual)
function MyPoints() {
  const { profileUrl, score, guild, loading, err, fetchScore, clear, leave, canLeave } = useMyProfile()
  const [input, setInput] = useState(profileUrl || '')
  const [guildInput, setGuildInput] = useState(guild || '')
  const [showBadges, setShowBadges] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const submit = () => { if (input.trim()) fetchScore(input.trim(), guildInput).catch(() => {}) }
  const handleLeave = () => {
    if (!window.confirm('Keluar dari leaderboard? Entrimu dihapus dari papan peringkat publik. Kamu bisa gabung lagi kapan saja dengan menghitung poin.')) return
    leave().then(() => { setInput(''); setGuildInput('') }).catch(() => {})
  }

  const total = score?.total || 0
  const shownTotal = useCountUp(total)
  const myTier = tierForPoints(total)

  if (!score && !loading) {
    return (
      <div className="joincard">
        <ArcadeHero />
        <div className="jt">Hitung poin otomatis</div>
        <p className="jp">Tempel link <b>public profile Google Cloud Skills Boost</b> kamu. Poin, milestone, dan tier dihitung otomatis dari badge-mu. Tidak ada input manual.</p>
        <div className="frow">
          <input className="fin" placeholder="https://www.cloudskillsboost.google/public_profiles/…" value={input}
            onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
          <button className="joinbtn" onClick={submit}>Hitung</button>
        </div>
        <input className="fin guildin" placeholder="Kode guild (opsional, mis. dari fasilitatormu)" value={guildInput}
          onChange={(e) => setGuildInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
        {err && <div className="ferr">{err}</div>}
        <p className="jp consent">Dengan menghitung poin, profilmu (nama & badge publik) otomatis tampil di <b>leaderboard komunitas</b>. Kamu bisa <b>keluar kapan saja</b> lewat tombol di halaman ini.</p>
        <p className="jp" style={{ marginTop: 10, marginBottom: 0 }}>Profil harus di-set <b>PUBLIC</b> dulu di Cloud Skills Boost. Bingung cari link-nya? Lihat tab <b>Info</b>.</p>
      </div>
    )
  }

  const fg = score?.facilGames || 0, fs = score?.facilSkills || 0
  return (
    <div>
      <div className="total">
        <div>
          <div className="lab">Total Poin Kamu {loading && <span className="spin">· menyinkron…</span>}</div>
          <div className="big">{shownTotal}</div>
        </div>
        <div className="tier">{score?.tierIdx >= 0 ? 'Milestone ' + (score.tierIdx + 1) : 'Belum ada milestone'}</div>
      </div>
      <div className="breakdown">
        <span className="chip">Base Arcade: <b>{score?.base || 0}</b></span>
        {/* "dari Milestone" supaya tidak tertukar dengan kartu Bonus Milestone AI Agent (+10)
            yang tampil di halaman yang sama tapi hitungannya lain. */}
        <span className="chip">Bonus dari Milestone: <b>{score?.mbonus || 0}</b></span>
        <span className="chip">Tier: <b>{myTier >= 0 ? TIERS[myTier].n : '-'}</b></span>
      </div>

      <div className="grid2">
        <div className="icard"><h3>Arcade Games</h3><div className="hint">total 2026</div><div className="statnum">{score?.games || 0}</div></div>
        <div className="icard"><h3>Skill Badges</h3><div className="hint">total 2026</div><div className="statnum">{score?.skills || 0}</div></div>
      </div>

      <div className="myprofrow">
        <span className="pmeta">{score?.name ? score.name + ' · ' : ''}sync {score ? ago(score.syncedAt) : '-'}</span>
        <span className="myacts">
          <a className="miniref" href={profileUrl} target="_blank" rel="noreferrer">Profil ↗</a>
          <button className="miniref" disabled={loading} onClick={() => fetchScore(profileUrl).catch(() => {})}>{loading ? '…' : '↻ Refresh'}</button>
          <button className="miniref accent" onClick={() => setShowShare(true)}>Bagikan</button>
          <button className="miniref" onClick={() => { clear(); setInput(''); setGuildInput('') }}>Ganti</button>
        </span>
      </div>
      <GuildRow />
      {canLeave && (
        <div className="leaverow">
          <span className="pmeta">Tampil di leaderboard komunitas.</span>
          <button className="leavebtn" disabled={loading} onClick={handleLeave}>Keluar dari leaderboard</button>
        </div>
      )}
      {err && <div className="ferr">{err}</div>}
      {showShare && <Suspense fallback={null}><ShareCard score={score} onClose={() => setShowShare(false)} /></Suspense>}

      <BonusMilestone score={score} />

      {score?.seasonBadges?.length ? (
        <div className="badgebox">
          <button className={'badgetoggle' + (showBadges ? ' open' : '')} onClick={() => setShowBadges(!showBadges)} aria-expanded={showBadges}>
            <span className="bt-chev" aria-hidden>▸</span> Badge Saya ({score.seasonBadges.length})
          </button>
          <Collapse open={showBadges}><MyBadges badges={score.seasonBadges} /></Collapse>
        </div>
      ) : null}

      <div className="ladder">
        <div className="hd">Milestone Fasilitator</div>
        <div className="mnote">Hanya menghitung badge sejak program fasilitator dibuka (13 Jul 2026). Badge sebelum itu tetap masuk total poin, tapi tidak mengisi milestone.</div>
        <m.div className="msgrid" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
        {MS.map((ms) => {
          const done = fg >= ms.g && fs >= ms.s
          const tierTotal = ms.g + Math.floor(ms.s / 2) + ms.bonus
          return (
            <m.div key={ms.n} className={'ms' + (done ? ' done' : '')}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
              <div className="mstop">
                <span className="name"><span className="mtrophy" aria-hidden="true"><IconTrophy /></span>{ms.n}</span>
                <span className="pts">{tierTotal} pts</span>
              </div>
              <div className="bars">
                <Bar label="Games" cur={fg} req={ms.g} />
                <Bar label="Badges" cur={fs} req={ms.s} />
              </div>
            </m.div>
          )
        })}
        </m.div>
      </div>

      {score?.seasonBadges?.length > 0 && (
        <>
          <div className="dash-row">
            <WeeklyChart badges={score.seasonBadges} />
            <CategoryTable badges={score.seasonBadges} />
          </div>
          <MonthlyGames badges={score.seasonBadges} />
        </>
      )}
    </div>
  )
}

// Statistik komunitas + preview leaderboard top-3
function HomeStats() {
  const navigate = useNavigate()
  const [members, setMembers] = useState(null)
  useEffect(() => {
    fetch('/api/leaderboard').then((r) => r.json()).then((j) => setMembers(j.members || [])).catch(() => setMembers([]))
  }, [])
  if (members === null) {
    return (
      <section className="home-extra">
        <div className="stats3">
          {[0, 1, 2].map((i) => <div key={i} className="stat skel"><div className="s-n">·</div><div className="s-l">memuat…</div></div>)}
        </div>
      </section>
    )
  }

  if (members.length === 0) {
    return (
      <section className="home-extra">
        <div className="lb-invite">
          <div>
            <div className="li-t">Leaderboard masih kosong</div>
            <div className="li-p">Jadilah peserta pertama. Poinmu langsung tampil dan bisa dilihat komunitas.</div>
          </div>
          <button className="joinbtn" onClick={() => navigate('/leaderboard')}>Masuk Leaderboard</button>
        </div>
      </section>
    )
  }

  const total = members.reduce((a, mem) => a + (mem.total || 0), 0)
  const guilds = new Set(members.map((mem) => guildKey(mem.guild))).size
  const top = members.slice(0, 3)
  return (
    <section className="home-extra">
      <div className="stats3">
        <div className="stat"><div className="s-n">{members.length}</div><div className="s-l">Peserta terlacak</div></div>
        <div className="stat"><div className="s-n">{total.toLocaleString('id-ID')}</div><div className="s-l">Total poin komunitas</div></div>
        <div className="stat"><div className="s-n">{guilds}</div><div className="s-l">Guild</div></div>
      </div>

      <div className="topwrap">
        <div className="tw-head"><span>Peringkat teratas</span><button className="tw-link" onClick={() => navigate('/leaderboard')}>Lihat semua →</button></div>
        <div className="top3">
          {top.map((mem, i) => (
            <div key={mem.id} className={'topcard r' + i}>
              <div className="tc-medal"><Medal i={i} /></div>
              <div className="tc-name">{mem.name}</div>
              <div className="tc-guild">{guildLabel(mem.guild)}</div>
              <div className="tc-pts">{mem.total}<span>poin</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Points() {
  return (
    <>
      <MyPoints />
      <HomeStats />
    </>
  )
}
