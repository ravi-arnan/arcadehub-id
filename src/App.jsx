import { useEffect, useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { MS, DEADLINE, TIERS, tierForPoints } from './points.js'
import { useCountUp } from './useCountUp.js'
import { CONFIG } from './config.js'
import { useMyProfile } from './profile.jsx'
import { WeeklyChart, CategoryTable, MonthlyGames } from './Insights.jsx'
import GuildBoard from './GuildBoard.jsx'
import Prizes from './Prizes.jsx'
import Info from './Info.jsx'
import Catalog from './Catalog.jsx'
import FeedbackBubble from './FeedbackBubble.jsx'
import ShareCard from './ShareCard.jsx'
import SpaceFX from './SpaceFX.jsx'
import Medal from './Medal.jsx'
import Contribute from './Contribute.jsx'

const NAV = [
  ['me', 'Poin Saya', <path key="a" d="M3 12h4l3 8 4-16 3 8h4" />],
  ['guild', 'Leaderboard', <path key="b" d="M8 21h8M12 17v4M6 4h12v4a6 6 0 0 1-12 0V4zM6 5H3v1a3 3 0 0 0 3 3M18 5h3v1a3 3 0 0 1-3 3" />],
  ['catalog', 'Katalog', <g key="e"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></g>],
  ['prizes', 'Hadiah', <path key="c" d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />],
  ['info', 'Info', <g key="d"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></g>],
  ['contribute', 'Kontribusi', <g key="f"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></g>],
]

function NavIcon({ path }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{path}</svg>
}

function useLocal(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial } catch { return initial }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)) } catch { /* ignore */ } }, [key, val])
  return [val, setVal]
}

function Bar({ label, cur, req }) {
  const pct = Math.min(100, (cur / req) * 100)
  return (
    <div className="bar">
      <span>{label}</span>
      <span className="track"><span className="fill" style={{ width: pct + '%' }} /></span>
      <span className="val">{Math.min(cur, req)} / {req}</span>
    </div>
  )
}

function Deadline() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(t) }, [])
  const ms = DEADLINE.getTime() - now
  if (ms <= 0) return <span className="dl closed">Program fasilitator ditutup</span>
  const days = Math.floor(ms / 864e5)
  const hours = Math.floor((ms % 864e5) / 36e5)
  return <span className="dl"><b>{days}</b> hari <b>{hours}</b> jam menuju penutupan fasilitator (14 Sep 2026)</span>
}

function ago(t) {
  const d = (Date.now() - t) / 1000
  if (d < 60) return 'baru saja'
  if (d < 3600) return Math.floor(d / 60) + ' mnt lalu'
  if (d < 86400) return Math.floor(d / 3600) + ' jam lalu'
  return Math.floor(d / 86400) + ' hari lalu'
}

// Poin Saya: otomatis dari public profile Cloud Skills Boost (bukan input manual)
function MyPoints() {
  const { profileUrl, score, loading, err, fetchScore, clear } = useMyProfile()
  const [input, setInput] = useState(profileUrl || '')
  const [showBadges, setShowBadges] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const submit = () => { if (input.trim()) fetchScore(input.trim()).catch(() => {}) }

  const total = score?.total || 0
  const shownTotal = useCountUp(total)
  const myTier = tierForPoints(total)

  if (!score && !loading) {
    return (
      <div className="joincard">
        <img className="herobanner" src="/img/hero.png?v=2" alt="Google Cloud Arcade" loading="eager" />
        <div className="jt">Hitung poin otomatis</div>
        <p className="jp">Tempel link <b>public profile Google Cloud Skills Boost</b> kamu. Poin, milestone, dan tier dihitung otomatis dari badge-mu. Tidak ada input manual.</p>
        <div className="frow">
          <input className="fin" placeholder="https://www.cloudskillsboost.google/public_profiles/…" value={input}
            onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
          <button className="joinbtn" onClick={submit}>Hitung</button>
        </div>
        {err && <div className="ferr">{err}</div>}
        <p className="jp" style={{ marginTop: 12, marginBottom: 0 }}>Profil harus di-set <b>PUBLIC</b> dulu di Cloud Skills Boost. Bingung cari link-nya? Lihat tab <b>Info</b>.</p>
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
        <span className="chip">Bonus Milestone: <b>{score?.mbonus || 0}</b></span>
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
          <button className="miniref" onClick={() => { clear(); setInput('') }}>Ganti</button>
        </span>
      </div>
      {err && <div className="ferr">{err}</div>}
      {showShare && <ShareCard score={score} onClose={() => setShowShare(false)} />}

      {(score?.gameList?.length || score?.skillList?.length) ? (
        <div className="badgebox">
          <button className="badgetoggle" onClick={() => setShowBadges(!showBadges)}>
            {showBadges ? '▾' : '▸'} Rincian badge yang dihitung ({(score.gameList?.length || 0) + (score.skillList?.length || 0)})
          </button>
          {showBadges && (
            <div className="badgelists">
              <div className="bl">
                <div className="blh">Arcade Games · {score.gameList?.length || 0} ({score.gameList?.length || 0} poin)</div>
                {score.gameList?.length ? score.gameList.map((t, i) => <div key={i} className="bi g">{t}</div>) : <div className="bi none">tidak ada</div>}
              </div>
              <div className="bl">
                <div className="blh">Skill Badges · {score.skillList?.length || 0} ({Math.floor((score.skillList?.length || 0) / 2)} poin)</div>
                {score.skillList?.length ? score.skillList.map((t, i) => <div key={i} className="bi s">{t}</div>) : <div className="bi none">tidak ada</div>}
              </div>
              <div className="blnote">Total poin dari badge Arcade Season 2026 (Jan–Des). Klasifikasi game/skill best-effort dari nama badge.</div>
            </div>
          )}
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
                <span className="name"><span className="mtrophy" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg></span>{ms.n}</span>
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

// Statistik komunitas + preview leaderboard top-3 (homepage)
function HomeStats({ go }) {
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

  const gl = (g) => (!g || g === 'UMUM' ? 'Umum' : g)
  if (members.length === 0) {
    return (
      <section className="home-extra">
        <div className="lb-invite">
          <div>
            <div className="li-t">Leaderboard masih kosong</div>
            <div className="li-p">Jadilah peserta pertama. Poinmu langsung tampil dan bisa dilihat komunitas.</div>
          </div>
          <button className="joinbtn" onClick={() => go('guild')}>Masuk Leaderboard</button>
        </div>
      </section>
    )
  }

  const total = members.reduce((a, m) => a + (m.total || 0), 0)
  const guilds = new Set(members.map((m) => m.guild || 'UMUM')).size
  const top = members.slice(0, 3)
  return (
    <section className="home-extra">
      <div className="stats3">
        <div className="stat"><div className="s-n">{members.length}</div><div className="s-l">Peserta terlacak</div></div>
        <div className="stat"><div className="s-n">{total.toLocaleString('id-ID')}</div><div className="s-l">Total poin komunitas</div></div>
        <div className="stat"><div className="s-n">{guilds}</div><div className="s-l">Guild</div></div>
      </div>

      <div className="topwrap">
        <div className="tw-head"><span>Peringkat teratas</span><button className="tw-link" onClick={() => go('guild')}>Lihat semua →</button></div>
        <div className="top3">
          {top.map((m, i) => (
            <div key={m.id} className={'topcard r' + i}>
              <div className="tc-medal"><Medal i={i} /></div>
              <div className="tc-name">{m.name}</div>
              <div className="tc-guild">{gl(m.guild)}</div>
              <div className="tc-pts">{m.total}<span>poin</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer({ go }) {
  return (
    <footer className="site-footer">
      <div className="foot-cta">
        <div>
          <div className="fc-t">Belajar bareng lebih seru</div>
          <div className="fc-p">Gabung komunitas fasilitator: info, bantuan lab, dan teman seperjuangan.</div>
        </div>
        <a className="fc-btn" href={CONFIG.whatsappUrl} target="_blank" rel="noreferrer">Gabung Grup WhatsApp</a>
      </div>

      <div className="foot-cols">
        <div className="fcol brandcol">
          <span className="brand-title">ARCADE HUB</span>
          <p>Tracker &amp; kalkulator poin Google Cloud Arcade untuk komunitas fasilitator. Poin dihitung otomatis dari profil publik Cloud Skills Boost.</p>
          <p className="disc">Tools komunitas, tidak resmi dari Google. Poin best-effort, verifikasi via profil resmi.</p>
        </div>
        <div className="fcol">
          <h4>Menu</h4>
          {NAV.map(([k, label]) => (
            <button key={k} className="flink" onClick={() => go(k)}>{label}</button>
          ))}
        </div>
        <div className="fcol">
          <h4>Program</h4>
          <a className="flink" href={CONFIG.registerUrl} target="_blank" rel="noreferrer">Daftar Program ↗</a>
          <a className="flink" href={CONFIG.arcadeUrl} target="_blank" rel="noreferrer">Halaman Arcade resmi ↗</a>
          <a className="flink" href={CONFIG.catalogUrl} target="_blank" rel="noreferrer">Katalog badge ↗</a>
        </div>
        <div className="fcol">
          <h4>Komunitas</h4>
          <a className="flink" href={CONFIG.whatsappUrl} target="_blank" rel="noreferrer">Grup WhatsApp ↗</a>
          <div className="fcode"><span>Kode referral</span><b>{CONFIG.referralCode}</b></div>
        </div>
      </div>

      <div className="foot-bottom">© 2026 Arcade Hub · Dibuat untuk komunitas Google Cloud Arcade Fasilitator 2026</div>
    </footer>
  )
}

export default function App() {
  const [tab, setTab] = useLocal('gcaf2026_tab', 'me')
  const go = (k) => { setTab(k); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const content = tab === 'guild' ? <GuildBoard /> : tab === 'catalog' ? <Catalog go={go} /> : tab === 'prizes' ? <Prizes go={go} /> : tab === 'info' ? <Info />
    : tab === 'contribute' ? <Contribute />
    : <><MyPoints /><HomeStats go={go} /></>

  return (
    <div className="page">
      <SpaceFX />
      <a className="announce" href={CONFIG.whatsappUrl} target="_blank" rel="noreferrer">
        <span className="ann-dot" />Gabung komunitas WhatsApp fasilitator untuk info &amp; bantuan &nbsp;→
      </a>

      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand"><span className="brand-title">ARCADE HUB</span></div>
          <nav className="topnav">
            {NAV.map(([k, label, path]) => {
              const active = tab === k
              return (
                <m.button key={k} className={active ? 'on' : ''} onClick={() => setTab(k)}
                  whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }} aria-current={active ? 'page' : undefined}>
                  {active && <m.span className="navpill" layoutId="navpill"
                    transition={{ type: 'spring', stiffness: 500, damping: 34 }} />}
                  <NavIcon path={path} /><span>{label}</span>
                </m.button>
              )
            })}
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="app">
          <div className="deadline"><Deadline /></div>
          <AnimatePresence mode="wait">
            <m.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
              {content}
            </m.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer go={go} />
      <FeedbackBubble />
    </div>
  )
}
