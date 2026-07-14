import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { SKILL_CATALOG, GAME_CATALOG, courseUrl, gameUrl, norm } from '../catalog.js'
import { useMyProfile } from '../profile.jsx'

function GameCard({ g }) {
  const [copied, setCopied] = useState(false)
  const copyCode = async () => {
    if (!g.code) return
    try {
      await navigator.clipboard.writeText(g.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch { /* clipboard tak tersedia: kode tetap terlihat untuk disalin manual */ }
  }
  const url = g.game ? gameUrl(g.game) : null
  const badge = <img src={g.img + '?v=3'} alt={g.name} loading="lazy" />
  return (
    <div className={'gamecard' + (g.done ? ' done' : '')}>
      {url ? (
        <a className="gc-badge" href={url} target="_blank" rel="noreferrer" onClick={copyCode}
          title={`Buka ${g.name} di Google Skills` + (g.code ? ' (access code otomatis tersalin)' : '')}>
          {badge}
        </a>
      ) : badge}
      <div className="gc-name">{g.name}</div>
      {g.sub && <div className="gc-sub">{g.sub}</div>}
      <div className={'gc-status' + (g.done ? ' ok' : '')}>{g.done ? '✓ Selesai' : 'Belum'}</div>
      {g.code && (
        <button className="gc-code" onClick={copyCode} title="Salin access code">
          {copied ? 'Tersalin' : g.code}
        </button>
      )}
    </div>
  )
}

export default function Catalog() {
  const navigate = useNavigate()
  const { score } = useMyProfile()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all') // all | done | todo

  const earned = useMemo(() => new Set((score?.skillList || []).map(norm)), [score])
  const gameBadges = useMemo(() => (score?.seasonBadges || []).filter((b) => b.cat !== 'skill'), [score])

  const skills = SKILL_CATALOG.map((s) => ({ ...s, done: earned.has(norm(s.name)) }))
  const games = GAME_CATALOG.map((g) => ({ ...g, done: gameBadges.some((b) => g.re.test(b.title)) }))
  const skillDone = skills.filter((s) => s.done).length
  const gameDone = games.filter((g) => g.done).length

  const shown = skills.filter((s) => {
    if (filter === 'done' && !s.done) return false
    if (filter === 'todo' && s.done) return false
    if (q && !s.name.toLowerCase().includes(q.toLowerCase())) return false
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

      <div className="card">
        <div className="card-h">Game Arcade <span className="card-tag">{gameDone}/{games.length}</span></div>
        <div className="games-grid">
          {games.map((g) => <GameCard key={g.name} g={g} />)}
        </div>
        <div className="card-note">Klik badge untuk membuka game di Google Skills (access code otomatis tersalin, tinggal tempel). Atau klik kodenya untuk menyalin manual. Kode game Jul 2026, diperbarui tiap bulan.</div>
      </div>

      <div className="card">
        <div className="card-h">Katalog Skill Badge <span className="card-tag">{skillDone}/{skills.length}</span></div>
        <div className="catbar">
          <input className="fin catsearch" placeholder="Cari badge…" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="catfilter">
            {[['all', 'Semua'], ['todo', 'Belum'], ['done', 'Selesai']].map(([k, l]) => (
              <button key={k} className={filter === k ? 'on' : ''} onClick={() => setFilter(k)}>{l}</button>
            ))}
          </div>
        </div>
        <div className="cbadges">
          {shown.length === 0 ? <div className="card-note" style={{ textAlign: 'center', padding: '14px 0' }}>Tidak ada badge cocok.</div> :
            shown.map((s) => (
              <a key={s.id} className={'cbadge' + (s.done ? ' done' : '')} href={courseUrl(s.id)} target="_blank" rel="noreferrer">
                <span className="cb-mark">{s.done ? '✓' : ''}</span>
                <span className="cb-name">{s.name}</span>
                <span className="cb-go">↗</span>
              </a>
            ))}
        </div>
        <div className="card-note">Klik badge untuk membukanya di Google Skills. Katalog = rekomendasi resmi fasilitator (nama badge dari katalog Google). Skill badge lain di luar daftar ini tetap dihitung poinnya.</div>
      </div>
    </div>
  )
}
