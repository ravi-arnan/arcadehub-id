import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { SKILL_CATALOG, GAME_CATALOG, courseUrl, gameUrl, skillImg, skillEarned, earnedSkillImg, norm } from '../catalog.js'
import { useMyProfile } from '../profile.jsx'
import { IconGrid, IconList, IconArrowRight, IconAward, IconGamepad } from '../icons.jsx'

const fmtPts = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1))
const fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) } catch { return '' } }

function MyBadges({ score }) {
  const [open, setOpen] = useState(false)
  const badges = score?.seasonBadges || []
  if (!badges.length) return null
  const sorted = [...badges].sort((a, b) => (b.earned || '').localeCompare(a.earned || ''))
  const nGame = badges.filter((b) => b.cat === 'game').length
  const nSkill = badges.length - nGame
  return (
    <div className="card">
      <div className="card-h">
        Badge Saya <span className="card-tag">{badges.length}</span>
        <button className="mb-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? 'Sembunyikan' : 'Lihat semua'} <span className={'mb-chev' + (open ? ' up' : '')} aria-hidden>▾</span>
        </button>
      </div>
      <div className="card-note" style={{ marginTop: 0, marginBottom: open ? 12 : 0 }}>
        Semua badge yang sudah kamu selesaikan (dari profilmu): {nGame} game, {nSkill} skill, total <b>{fmtPts(score.total)}</b> poin.
      </div>
      {open && (
      <div className="mybadges">
        {sorted.map((b, i) => {
          const img = b.cat === 'game' ? null : earnedSkillImg(b.title)
          return (
            <div key={i} className={'mybadge ' + b.cat}>
              <span className="mb-ic">
                {img ? <img src={img} alt="" loading="lazy" /> : b.cat === 'game' ? <IconGamepad /> : <IconAward />}
              </span>
              <div className="mb-body">
                <div className="mb-name" title={b.title}>{b.title}</div>
                <div className="mb-meta"><span className={'mb-tag ' + b.cat}>{b.cat === 'game' ? 'Game' : 'Skill'}</span>{b.earned && <span className="mb-date">{fmtDate(b.earned)}</span>}</div>
              </div>
            </div>
          )
        })}
      </div>
      )}
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

  const shown = items.filter((it) => {
    if (type !== 'all' && it.type !== type) return false
    if (status === 'done' && !it.done) return false
    if (status === 'todo' && it.done) return false
    if (q && !it.title.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  return (
    <div>
      {!score && (
        <div className="lb-invite" style={{ marginBottom: 4 }}>
          <div>
            <div className="li-t">Pantau progress badge kamu</div>
            <div className="li-p">Hitung poin dulu di tab Poin Saya agar katalog menandai badge yang sudah kamu selesaikan.</div>
          </div>
          <button className="joinbtn" onClick={() => navigate('/points')}>Hitung Poin Saya</button>
        </div>
      )}

      {score && <MyBadges score={score} />}

      <div className="card">
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
