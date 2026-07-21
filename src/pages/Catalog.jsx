import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { SKILL_CATALOG, GAME_CATALOG, courseUrl, gameUrl, skillImg, skillEarned, norm } from '../catalog.js'
import { MS, DEADLINE } from '../points.js'
import { projectMilestone } from '../../lib/projection.js'
import { useMyProfile } from '../profile.jsx'
import { shortDate } from '../utils/time.js'
import Bar from '../components/Bar.jsx'
import Collapse from '../components/Collapse.jsx'
import { IconGrid, IconList, IconArrowRight, IconAward, IconGamepad, IconTarget } from '../icons.jsx'

const fmtPts = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1))
const fmtRate = (n) => (n >= 10 ? Math.round(n) : Math.round(n * 10) / 10).toLocaleString('id-ID')

// Proyeksi: bandingkan kecepatan sekarang dengan kecepatan yang dibutuhkan sampai penutupan.
// Hanya tampil kalau profil sudah tersinkron (tanpa data, tidak ada yang bisa diproyeksikan).
function PaceStrip({ p }) {
  if (p.done) {
    return <div className="sh-pace ok"><span className="sh-verdict ok">Semua milestone tercapai</span><span className="sh-pdesc">Sisa {p.daysLeft} hari. Badge tambahan tetap menambah poin dasar.</span></div>
  }
  if (p.daysLeft === 0) {
    return <div className="sh-pace late"><span className="sh-verdict late">Periode ditutup</span><span className="sh-pdesc">Batas milestone fasilitator sudah lewat.</span></div>
  }
  if (p.needSkills === 0) {
    return <div className="sh-pace ok"><span className="sh-verdict ok">Badge cukup</span><span className="sh-pdesc">Sisa {p.daysLeft} hari. Badge skill untuk {p.target.short} sudah terpenuhi, tinggal {p.needGames} game lagi.</span></div>
  }
  const noHistory = p.perWeekActual === 0
  return (
    <div className={'sh-pace ' + (p.onTrack ? 'ok' : 'behind')}>
      <span className={'sh-verdict ' + (p.onTrack ? 'ok' : 'behind')}>{noHistory ? 'Belum mulai' : p.onTrack ? 'Sesuai target' : 'Perlu ngebut'}</span>
      <span className="sh-pdesc">
        Sisa <b>{p.daysLeft} hari</b>, butuh <b>{p.needSkills} badge</b> lagi untuk {p.target.short}: sekitar <b>{fmtRate(p.perWeekNeeded)} badge/minggu</b>.
        {noHistory
          ? ' Kamu belum menyelesaikan badge di periode fasilitator, jadi belum ada kecepatan untuk diproyeksikan.'
          : <> Kecepatanmu sekarang <b>{fmtRate(p.perWeekActual)} badge/minggu</b>{p.onTrack && p.etaDate ? <>, perkiraan tercapai <b>{shortDate(p.etaDate)}</b>.</> : '.'}</>}
      </span>
    </div>
  )
}

// Roadmap prioritas untuk pemula: urutan resmi silabus (Game dulu, lalu kejar milestone via badge).
function StartHere({ score, gamesDone, gamesTotal, onShowGames, onShowSkills }) {
  const [open, setOpen] = useState(true)
  const fg = score?.facilGames || 0
  const fs = score?.facilSkills || 0
  const target = MS.find((m) => !(fg >= m.g && fs >= m.s)) || MS[MS.length - 1]
  const daysLeft = Math.max(0, Math.floor((DEADLINE.getTime() - Date.now()) / 864e5))
  const proj = useMemo(() => projectMilestone({ facilGames: fg, facilSkills: fs }), [fg, fs])

  return (
    <div className="card starthere">
      <div className="card-h">
        <span className="sh-badge">Panduan Pemula</span> Mulai dari Sini
        <button className="sh-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? 'Sembunyikan' : 'Lihat'} <span className={'sh-chev' + (open ? ' up' : '')} aria-hidden>▾</span>
        </button>
      </div>
      <div className="card-note" style={{ marginTop: 0, marginBottom: open ? 14 : 0 }}>
        Bingung mulai dari mana? Ikuti urutan ini biar poinmu naik paling cepat.
      </div>
      <Collapse open={open}>
        <ol className="sh-steps">
          <li className="sh-step">
            <span className="sh-num">1</span>
            <div className="sh-main">
              <div className="sh-title"><IconGamepad width="17" height="17" /> Kerjakan Game dulu <span className="sh-count">{gamesDone}/{gamesTotal}</span></div>
              <p className="sh-desc">
                Prioritas #1. Game rilis tiap bulan dengan <b>kuota terbatas</b> dan game lama <b>kedaluwarsa</b>, jadi amankan dulu selagi ada. Sisa {daysLeft} hari menuju penutupan.
              </p>
              <button className="sh-cta" onClick={onShowGames}>Lihat {gamesTotal} Game <IconArrowRight width="14" height="14" /></button>
            </div>
          </li>
          <li className="sh-step">
            <span className="sh-num">2</span>
            <div className="sh-main">
              <div className="sh-title"><IconTarget width="17" height="17" /> Kumpulkan badge keahlian <span className="sh-count">target {target.short}</span></div>
              <p className="sh-desc">
                Setiap <b>2 badge skill = 1 poin</b>. Kejar target terdekatmu: <b>{target.n}</b> ({target.g} game + {target.s} badge). Belum tahu badge mana? Buka daftar di bawah dan mulai dari topik yang paling kamu minati.
              </p>
              <div className="sh-bars">
                <Bar label="Game" cur={fg} req={target.g} />
                <Bar label="Badge" cur={fs} req={target.s} />
              </div>
              {score && <PaceStrip p={proj} />}
              <button className="sh-cta" onClick={onShowSkills}>
                {score && proj.needSkills > 0 ? `Lihat ${proj.needSkills} badge yang dibutuhkan` : 'Lihat badge yang belum'} <IconArrowRight width="14" height="14" />
              </button>
            </div>
          </li>
        </ol>
        <div className="sh-ladder" role="list" aria-label="Tahap milestone">
          {MS.map((m) => {
            const done = fg >= m.g && fs >= m.s
            const isTarget = m.short === target.short && !done
            return (
              <div key={m.short} role="listitem" className={'sh-rung' + (done ? ' done' : '') + (isTarget ? ' now' : '')}>
                <span className="sh-dot" aria-hidden>{done ? '✓' : m.short}</span>
                <span className="sh-rlabel">{m.n}</span>
              </div>
            )
          })}
        </div>
      </Collapse>
    </div>
  )
}

function useCopyCode(code) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch { /* clipboard tak tersedia: kode tetap terlihat untuk disalin manual */ }
  }
  return [copied, copy]
}

function CodeChip({ code, copied, onCopy }) {
  return (
    <button className="gc-code" onClick={onCopy} title="Salin access code">
      {copied ? 'Tersalin' : code}
    </button>
  )
}

function BadgeThumb({ it, onCopy }) {
  const title = it.type === 'game'
    ? `Buka ${it.name} di Google Skills` + (it.code ? ' (access code otomatis tersalin)' : '')
    : `Buka ${it.name} di Google Skills`
  const cls = 'bc-badge' + (it.type === 'skill' ? (it.img ? ' bc-badge-skill' : ' bc-skillthumb') : '')
  return (
    <a className={cls} href={it.url} target="_blank" rel="noreferrer" onClick={onCopy} title={title}>
      {it.img ? <img src={it.img} alt={it.name} loading="lazy" /> : <IconAward width="34" height="34" />}
    </a>
  )
}

function BadgeCard({ it }) {
  const [copied, copy] = useCopyCode(it.code)
  return (
    <div className={'badgecard' + (it.done ? ' done' : '')}>
      <div className="bc-top">
        <span className={'bc-tag ' + it.type}>{it.type === 'game' ? 'Game' : 'Skill'}</span>
        {it.done && <span className="bc-check" title="Selesai">✓</span>}
        <BadgeThumb it={it} onCopy={copy} />
      </div>
      <div className="bc-body">
        <div className="bc-title">{it.title}</div>
        <div className="bc-meta">
          {it.code ? <CodeChip code={it.code} copied={copied} onCopy={copy} /> : <span />}
          <span className="bc-pts">{fmtPts(it.points)} Poin</span>
        </div>
        <a className="bc-start" href={it.url} target="_blank" rel="noreferrer" onClick={copy}>
          {it.type === 'game' ? 'Mulai Challenge' : 'Buka Badge'} <IconArrowRight width="15" height="15" />
        </a>
      </div>
    </div>
  )
}

function BadgeRow({ it }) {
  const [copied, copy] = useCopyCode(it.code)
  return (
    <div className={'badgerow' + (it.done ? ' done' : '')}>
      <span className={'br-tag ' + it.type}>{it.type === 'game' ? 'Game' : 'Skill'}</span>
      <a className="br-title" href={it.url} target="_blank" rel="noreferrer" onClick={copy}>{it.title}</a>
      {it.code && <CodeChip code={it.code} copied={copied} onCopy={copy} />}
      <span className="br-pts">{fmtPts(it.points)} Poin</span>
      <span className={'br-status' + (it.done ? ' ok' : '')}>{it.done ? '✓ Selesai' : 'Belum'}</span>
    </div>
  )
}

export default function Catalog() {
  const navigate = useNavigate()
  const { score } = useMyProfile()
  const [q, setQ] = useState('')
  const [type, setType] = useState('all') // all | game | skill
  const [status, setStatus] = useState('all') // all | todo | done
  const [view, setView] = useState('grid') // grid | list

  const earned = useMemo(() => new Set((score?.skillList || []).map(norm)), [score])
  const gameBadges = useMemo(() => (score?.seasonBadges || []).filter((b) => b.cat !== 'skill'), [score])

  const items = useMemo(() => {
    const games = GAME_CATALOG.map((g) => ({
      key: 'g-' + g.name,
      type: 'game',
      name: g.name,
      title: g.sub ? `${g.name}: ${g.sub}` : g.name,
      img: g.img + '?v=3',
      code: g.code || null,
      url: g.game ? gameUrl(g.game) : null,
      points: 1,
      done: gameBadges.some((b) => g.re.test(b.title)),
    }))
    const skills = SKILL_CATALOG.map((s) => ({
      key: 's-' + s.id,
      type: 'skill',
      name: s.name,
      title: s.name,
      img: skillImg(s.id),
      code: null,
      url: courseUrl(s.id),
      points: 0.5,
      done: skillEarned(s.id, s.name, earned),
    }))
    return [...games, ...skills]
  }, [gameBadges, earned])

  const gameCount = GAME_CATALOG.length
  const skillCount = SKILL_CATALOG.length
  const doneCount = items.filter((it) => it.done).length
  const gamesDone = items.filter((it) => it.type === 'game' && it.done).length

  const scrollToCatalog = () => document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const showGames = () => { setType('game'); setStatus('all'); setQ(''); scrollToCatalog() }
  const showSkills = () => { setType('skill'); setStatus('todo'); setQ(''); scrollToCatalog() }

  const shown = items.filter((it) => {
    if (type !== 'all' && it.type !== type) return false
    if (status === 'done' && !it.done) return false
    if (status === 'todo' && it.done) return false
    if (q && !it.title.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <StartHere score={score} gamesDone={gamesDone} gamesTotal={gameCount} onShowGames={showGames} onShowSkills={showSkills} />

      {!score && (
        <div className="lb-invite" style={{ marginTop: 16, marginBottom: 4 }}>
          <div>
            <div className="li-t">Pantau progress badge kamu</div>
            <div className="li-p">Hitung poin dulu di tab Poin Saya agar katalog menandai badge yang sudah kamu selesaikan.</div>
          </div>
          <button className="joinbtn" onClick={() => navigate('/points')}>Hitung Poin Saya</button>
        </div>
      )}

      <div className="card" id="katalog">
        <div className="card-h">Katalog Badge <span className="card-tag">{doneCount}/{items.length}</span></div>

        <div className="catcontrols">
          <div className="cattabs">
            {[['all', 'Semua', items.length], ['game', 'Game', gameCount], ['skill', 'Skill', skillCount]].map(([k, l, n]) => (
              <button key={k} className={type === k ? 'on' : ''} onClick={() => setType(k)}>
                {l} <span className="tabn">{n}</span>
              </button>
            ))}
          </div>
          <div className="catview" role="group" aria-label="Tampilan">
            <button className={view === 'grid' ? 'on' : ''} onClick={() => setView('grid')} title="Grid" aria-label="Grid"><IconGrid width="16" height="16" /></button>
            <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')} title="List" aria-label="List"><IconList width="16" height="16" /></button>
          </div>
        </div>

        <div className="catbar">
          <input className="fin catsearch" placeholder="Cari badge…" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="catfilter">
            {[['all', 'Semua'], ['todo', 'Belum'], ['done', 'Selesai']].map(([k, l]) => (
              <button key={k} className={status === k ? 'on' : ''} onClick={() => setStatus(k)}>{l}</button>
            ))}
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="card-note" style={{ textAlign: 'center', padding: '18px 0' }}>Tidak ada badge cocok.</div>
        ) : view === 'grid' ? (
          <div className="badgegrid">{shown.map((it) => <BadgeCard key={it.key} it={it} />)}</div>
        ) : (
          <div className="badgelist">{shown.map((it) => <BadgeRow key={it.key} it={it} />)}</div>
        )}

        <div className="card-note">Game: klik badge atau Mulai Challenge untuk buka di Google Skills (access code otomatis tersalin, tinggal tempel). Skill: 2 badge = 1 poin. Kode game Jul 2026, diperbarui tiap bulan.</div>
      </div>
    </div>
  )
}
