import { IconGamepad, IconTent, IconTarget, IconHelp, IconAward } from './icons.jsx'

const DOW = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const fmtPts = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1))

function sameDay(iso, d) {
  const b = new Date(iso)
  return b.getFullYear() === d.getFullYear() && b.getMonth() === d.getMonth() && b.getDate() === d.getDate()
}

// Aktivitas 7 hari terakhir, line chart (dari tanggal earn badge)
export function WeeklyChart({ badges }) {
  const now = new Date()
  const days = []
  for (let i = 6; i >= 0; i--) { const d = new Date(now); d.setDate(now.getDate() - i); d.setHours(0, 0, 0, 0); days.push(d) }
  const counts = days.map((d) => badges.filter((b) => b.earned && sameDay(b.earned, d)).length)
  const max = Math.max(1, ...counts)
  const weekTotal = counts.reduce((a, c) => a + c, 0)

  const W = 340, H = 96, PL = 10, PR = 10, PT = 16, PB = 6
  const iw = W - PL - PR, ih = H - PT - PB
  const pts = counts.map((c, i) => ({ x: PL + (i / 6) * iw, y: PT + ih - (c / max) * ih, c }))
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join(' ')
  const area = `M${PL} ${PT + ih} ` + pts.map((p) => `L${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ` L${PL + iw} ${PT + ih} Z`

  return (
    <div className="card">
      <div className="card-h">Aktivitas 7 Hari Terakhir</div>
      <svg className="lchart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Grafik garis aktivitas badge 7 hari terakhir">
        <defs>
          <linearGradient id="wgrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fcc934" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#fcc934" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={PL} y1={PT + ih} x2={PL + iw} y2={PT + ih} stroke="rgba(255,255,255,.12)" strokeWidth="1" />
        <path d={area} fill="url(#wgrad)" />
        <path d={line} fill="none" stroke="#fcc934" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={p.c > 0 ? 3.5 : 2.5} fill={p.c > 0 ? '#fcc934' : '#5b6b93'} />
            {p.c > 0 && <text x={p.x} y={p.y - 7} textAnchor="middle" fill="#fcc934" fontSize="11" fontWeight="700">{p.c}</text>}
          </g>
        ))}
      </svg>
      <div className="ldays">{days.map((d, i) => <span key={i}>{DOW[d.getDay()]}</span>)}</div>
      <div className="card-note">{weekTotal > 0 ? `${weekTotal} badge minggu ini` : 'Belum ada badge minggu ini. Ayo selesaikan satu!'}</div>
    </div>
  )
}

const CATS = [
  { key: 'game', label: 'Arcade Games', Icon: IconGamepad, pt: 1 },
  { key: 'basecamp', label: 'Base Camp', Icon: IconTent, pt: 1 },
  { key: 'level', label: 'Level', Icon: IconTarget, pt: 1 },
  { key: 'trivia', label: 'Trivia', Icon: IconHelp, pt: 1 },
  { key: 'skill', label: 'Skill Badges', Icon: IconAward, pt: 0.5 },
]

export function CategoryTable({ badges }) {
  // skill = 2 badge → 1 poin (floor), sama seperti perhitungan total poin. Lainnya 1 poin/badge.
  const rows = CATS.map((c) => {
    const n = badges.filter((b) => b.cat === c.key).length
    return { ...c, n, pts: c.key === 'skill' ? Math.floor(n / 2) : n }
  })
  return (
    <div className="card">
      <div className="card-h">Kategori Badge</div>
      <div className="cattable">
        <div className="catrow cathead"><span>Kategori</span><span className="cat-n">Badge</span><span className="cat-p">Poin</span></div>
        {rows.map((r) => (
          <div key={r.key} className="catrow">
            <span className="cat-name"><span className="cat-ic"><r.Icon /></span>{r.label}</span>
            <span className="cat-n">{r.n}</span>
            <span className="cat-p">{fmtPts(r.pts)}</span>
          </div>
        ))}
      </div>
      <div className="card-note">2 skill badge = 1 poin (dibulatkan ke bawah). Game/Trivia/Level = 1 poin per badge.</div>
    </div>
  )
}

const GAMES = [
  { name: 'Base Camp', img: '/img/game-basecamp.webp', re: /base ?camp/i },
  { name: 'Adventure', img: '/img/game-adventure.webp', re: /adventure/i },
  { name: 'Voyage', img: '/img/game-voyage.webp', re: /voyage/i },
  { name: 'Trail', img: '/img/game-trail.webp', re: /trail/i },
  { name: 'Special', sub: 'Safe Spaces', img: '/img/game-special.webp', re: /special|safe space/i },
  { name: 'Simulator', sub: 'Data Mesh Architect', img: '/img/game-new.webp', re: /simulator|new game|data mesh/i },
]

// Game Arcade bulan ini (foto badge asli) + status selesai/belum
export function MonthlyGames({ badges }) {
  const done = (re) => badges.some((b) => b.cat !== 'skill' && re.test(b.title))
  const nDone = GAMES.filter((g) => done(g.re)).length
  return (
    <div className="card">
      <div className="card-h">Game Arcade 2026 <span className="card-tag">{nDone}/{GAMES.length}</span></div>
      <div className="games-grid">
        {GAMES.map((g) => {
          const ok = done(g.re)
          return (
            <div key={g.name} className={'gamecard' + (ok ? ' done' : '')}>
              <img src={g.img + '?v=3'} alt={g.name} loading="lazy" />
              <div className="gc-name">{g.name}</div>
              {g.sub && <div className="gc-sub">{g.sub}</div>}
              <div className={'gc-status' + (ok ? ' ok' : '')}>{ok ? '✓ Selesai' : 'Belum'}</div>
            </div>
          )
        })}
      </div>
      <div className="card-note">Foto badge resmi Google Cloud. Status dari badge di profilmu (best-effort). Access code &amp; game tiap bulan bisa berbeda.</div>
    </div>
  )
}
