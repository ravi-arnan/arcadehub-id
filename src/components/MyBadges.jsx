import { useMemo, useState } from 'react'
import { badgeUrl } from '../catalog.js'

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
// seasonBadges.cat === 'skill' hanya untuk non-game (lihat categorize di parseProfile).
const isGameCat = (b) => b.cat !== 'skill'

// Kelompokkan badge per "Bulan Tahun" dari tanggal earned; terbaru dulu. Tanpa tanggal -> paling bawah.
function groupByMonth(badges) {
  const map = new Map()
  for (const b of badges) {
    const d = b.earned ? new Date(b.earned) : null
    const ok = d && !isNaN(d)
    const key = ok ? `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}` : '0000-00'
    const label = ok ? `${MONTHS[d.getMonth()]} ${d.getFullYear()}` : 'Tanpa tanggal'
    if (!map.has(key)) map.set(key, { label, items: [] })
    map.get(key).items.push(b)
  }
  return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1)).map(([, v]) => v)
}

export default function MyBadges({ badges }) {
  const [filter, setFilter] = useState('all')
  const games = badges.filter(isGameCat).length
  const skills = badges.length - games
  const groups = useMemo(() => {
    const f = filter === 'games' ? badges.filter(isGameCat)
      : filter === 'skills' ? badges.filter((b) => !isGameCat(b))
        : badges
    return groupByMonth(f)
  }, [badges, filter])

  const tab = (key, label, n) => (
    <button className={'bf' + (filter === key ? ' on' : '')} onClick={() => setFilter(key)}>{label} <span>{n}</span></button>
  )

  return (
    <div className="bs-view">
      <div className="bf-tabs">{tab('all', 'Semua', badges.length)}{tab('games', 'Games', games)}{tab('skills', 'Skills', skills)}</div>
      {groups.map((grp) => (
        <div key={grp.label} className="bmonth">
          <div className="bmonth-h">{grp.label} <span>{grp.items.length}</span></div>
          <div className="bmonth-list">
            {grp.items.map((b, i) => {
              const url = badgeUrl(b.title)
              const cls = 'bi ' + (isGameCat(b) ? 'g' : 's')
              return url
                ? <a key={i} className={cls + ' lk'} href={url} target="_blank" rel="noreferrer">{b.title}<span className="bi-x" aria-hidden>↗</span></a>
                : <div key={i} className={cls}>{b.title}</div>
            })}
          </div>
        </div>
      ))}
      <div className="blnote">Badge Arcade Season 2026 (Jan–Des). Klasifikasi game/skill best-effort dari nama badge; link membuka halaman badge di Skills Boost bila dikenali.</div>
    </div>
  )
}
