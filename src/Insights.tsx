import { useState, useRef, useEffect, useMemo, type ComponentType } from 'react'
import { IconGamepad, IconTent, IconTarget, IconHelp, IconAward, IconCheck } from './icons'
import { GAME_CATALOG, gamePoints, type CatalogGame } from './catalog'
import { HALLOWEEN } from './config'

const fmtPts = (n: number): string => (Number.isInteger(n) ? String(n) : n.toFixed(1))

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const MONTH_FULL = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]
const DAY_LABELS = [
  { row: 1, label: 'Sen' },
  { row: 3, label: 'Rab' },
  { row: 5, label: 'Jum' },
]

export interface InsightBadge {
  title: string
  earned?: string | null
  cat?: string
  name?: string
  date?: string
  counts?: boolean
}

interface TooltipState {
  x: number
  y: number
  dateStr: string
  count: number
}

/**
 * Heatmap aktivitas badge bergaya GitHub contribution graph (52 minggu terakhir)
 */
export function ActivityCalendar({ badges }: { badges: InsightBadge[] }) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [hovered, setHovered] = useState<TooltipState | null>(null)

  // Auto-scroll ke paling kanan (aktivitas terbaru) saat render di layar kecil
  useEffect(() => {
    if (wrapRef.current) {
      wrapRef.current.scrollLeft = wrapRef.current.scrollWidth
    }
  }, [])

  const { weeks, monthLabels, totalEarned, currentStreak, longestStreak } = useMemo(() => {
    const countMap = new Map<string, number>()
    for (const b of badges) {
      if (!b.earned) continue
      const d = new Date(b.earned)
      if (isNaN(d.getTime())) continue
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const k = `${y}-${m}-${day}`
      countMap.set(k, (countMap.get(k) || 0) + 1)
    }

    const now = new Date()
    const currentDayOfWeek = now.getDay()
    const endDate = new Date(now)
    endDate.setDate(now.getDate() + (6 - currentDayOfWeek))
    endDate.setHours(23, 59, 59, 999)

    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - (52 * 7 - 1))
    startDate.setHours(0, 0, 0, 0)

    const weeksData = []
    let totalInYear = 0
    const mLabels: { col: number; label: string }[] = []
    let lastMonth = -1
    let lastMonthCol = -10

    for (let w = 0; w < 52; w++) {
      const days = []
      for (let r = 0; r < 7; r++) {
        const d = new Date(startDate)
        d.setDate(startDate.getDate() + (w * 7 + r))

        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        const dateKey = `${y}-${m}-${day}`

        const isFuture = d > now
        const count = isFuture ? 0 : (countMap.get(dateKey) || 0)

        if (count > 0) totalInYear += count

        let level = 0
        if (count >= 5) level = 4
        else if (count >= 3) level = 3
        else if (count >= 2) level = 2
        else if (count >= 1) level = 1

        const formattedDate = `${d.getDate()} ${MONTH_FULL[d.getMonth()]} ${d.getFullYear()}`

        days.push({
          date: d,
          dateKey,
          count,
          level,
          isFuture,
          formattedDate,
          col: w,
          row: r,
        })
      }

      const firstDayOfWeek = days[0].date
      const month = firstDayOfWeek.getMonth()
      if (month !== lastMonth && w - lastMonthCol >= 3) {
        mLabels.push({ col: w, label: MONTH_NAMES[month] })
        lastMonth = month
        lastMonthCol = w
      }

      weeksData.push({ days })
    }

    // Streak kalkulasi
    let curStreak = 0
    let maxStreak = 0
    let tempStreak = 0

    const check = new Date(now)
    check.setHours(0, 0, 0, 0)
    while (true) {
      const y = check.getFullYear()
      const m = String(check.getMonth() + 1).padStart(2, '0')
      const day = String(check.getDate()).padStart(2, '0')
      const k = `${y}-${m}-${day}`
      if ((countMap.get(k) || 0) > 0) {
        curStreak++
        check.setDate(check.getDate() - 1)
      } else {
        break
      }
    }

    for (let w = 0; w < 52; w++) {
      for (let r = 0; r < 7; r++) {
        const d = weeksData[w].days[r]
        if (d.isFuture) continue
        if (d.count > 0) {
          tempStreak++
          if (tempStreak > maxStreak) maxStreak = tempStreak
        } else {
          tempStreak = 0
        }
      }
    }

    return {
      weeks: weeksData,
      monthLabels: mLabels,
      totalEarned: totalInYear,
      currentStreak: curStreak,
      longestStreak: maxStreak,
    }
  }, [badges])

  const LEVEL_COLORS = HALLOWEEN
    ? ['rgba(255, 255, 255, 0.05)', '#451a03', '#78350f', '#d97706', '#ffa726']
    : ['rgba(255, 255, 255, 0.05)', '#0e4429', '#006d32', '#26a641', '#39d353']

  const handleCellHover = (e: React.MouseEvent<SVGRectElement>, day: any) => {
    if (day.isFuture) return
    const wrap = wrapRef.current
    if (!wrap) return
    const rect = e.currentTarget.getBoundingClientRect()
    const wrapRect = wrap.getBoundingClientRect()
    setHovered({
      x: rect.left - wrapRect.left + wrap.scrollLeft + rect.width / 2,
      y: rect.top - wrapRect.top,
      dateStr: day.formattedDate,
      count: day.count,
    })
  }

  return (
    <div className="card gh-card">
      <div className="card-h">
        <span>Aktivitas Badge</span>
        <span className="card-tag">{totalEarned} badge</span>
      </div>

      <div className="gh-wrap" ref={wrapRef}>
        <svg
          className="gh-svg"
          viewBox="0 0 710 117"
          role="img"
          aria-label="Kalender aktivitas kontribusi badge mirip GitHub"
        >
          {/* Label Bulan di bagian atas */}
          {monthLabels.map((m) => (
            <text
              key={m.col + '-' + m.label}
              x={28 + m.col * 13}
              y={12}
              fill="var(--muted)"
              fontSize="10"
              fontWeight="600"
            >
              {m.label}
            </text>
          ))}

          {/* Label Hari di sebelah kiri (Sen, Rab, Jum) */}
          {DAY_LABELS.map((d) => (
            <text
              key={d.label}
              x={0}
              y={20 + d.row * 13 + 8.5}
              fill="var(--muted)"
              fontSize="9"
              fontWeight="500"
            >
              {d.label}
            </text>
          ))}

          {/* Kotak-kotak heatmap */}
          {weeks.map((week, wIdx) => (
            <g key={wIdx}>
              {week.days.map((day) => (
                <rect
                  key={day.dateKey}
                  className={'gh-cell' + (day.isFuture ? ' gh-cell-future' : '')}
                  x={28 + wIdx * 13}
                  y={20 + day.row * 13}
                  width="10"
                  height="10"
                  rx="2"
                  ry="2"
                  fill={LEVEL_COLORS[day.level]}
                  stroke={day.count === 0 ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.25)'}
                  strokeWidth="1"
                  onMouseEnter={(e) => handleCellHover(e, day)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <title>
                    {day.isFuture
                      ? ''
                      : day.count > 0
                        ? `${day.count} badge pada ${day.formattedDate}`
                        : `Tidak ada badge pada ${day.formattedDate}`}
                  </title>
                </rect>
              ))}
            </g>
          ))}
        </svg>

        {/* Floating tooltip */}
        {hovered && (
          <div
            className="gh-tooltip"
            style={{
              left: hovered.x,
              top: hovered.y - 7,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <strong>{hovered.count > 0 ? `${hovered.count} badge` : 'Tidak ada badge'}</strong> pada{' '}
            {hovered.dateStr}
            <div className="gh-tooltip-arrow" />
          </div>
        )}
      </div>

      <div className="gh-footer">
        <div className="gh-footer-left">
          <span>{totalEarned > 0 ? `${totalEarned} badge dalam setahun terakhir` : 'Belum ada aktivitas badge'}</span>
          {longestStreak > 1 && (
            <>
              <span className="gh-dot">•</span>
              <span className="gh-streak">Streak terpanjang: {longestStreak} hari</span>
            </>
          )}
          {currentStreak > 1 && (
            <>
              <span className="gh-dot">•</span>
              <span className="gh-streak">Streak saat ini: {currentStreak} hari</span>
            </>
          )}
        </div>

        <div className="gh-legend">
          <span className="gh-legend-label">Kurang</span>
          <span className="gh-box gh-box-0" title="0 badge" />
          <span className="gh-box gh-box-1" title="1 badge" />
          <span className="gh-box gh-box-2" title="2 badge" />
          <span className="gh-box gh-box-3" title="3-4 badge" />
          <span className="gh-box gh-box-4" title="5+ badge" />
          <span className="gh-legend-label">Banyak</span>
        </div>
      </div>
    </div>
  )
}

export const WeeklyChart = ActivityCalendar

interface CatItem {
  key: string
  label: string
  Icon: ComponentType
  pt: number
}

const CATS: CatItem[] = [
  { key: 'game', label: 'Arcade Games', Icon: IconGamepad, pt: 1 },
  { key: 'basecamp', label: 'Base Camp', Icon: IconTent, pt: 1 },
  { key: 'level', label: 'Level', Icon: IconTarget, pt: 1 },
  { key: 'trivia', label: 'Trivia', Icon: IconHelp, pt: 1 },
  { key: 'skill', label: 'Skill Badges', Icon: IconAward, pt: 0.5 },
]

export function CategoryTable({ badges }: { badges: InsightBadge[] }) {
  // skill = 2 badge -> 1 poin (floor), hanya badge resmi (counts !== false). Game menghitung bobot gamePoints.
  const rows = CATS.map((c) => {
    const matching = (badges || []).filter((b) => b.cat === c.key && b.counts !== false)
    const n = matching.length
    const pts = c.key === 'skill'
      ? Math.floor(n / 2)
      : matching.reduce((sum, b) => sum + gamePoints(b.title || b.name || ''), 0)
    return { ...c, n, pts }
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
      <div className="card-note">Game lama tertentu bernilai 2-3 poin. 2 skill badge resmi = 1 poin (dibulatkan ke bawah).</div>
    </div>
  )
}

// Satu sumber kebenaran daftar game di catalog.ts; di sini pakai nama pendek + sub.
const GAMES = (GAME_CATALOG as CatalogGame[]).map((g) => ({
  name: g.short,
  sub: g.sub,
  img: g.img,
  re: g.re,
  off: g.off || null,
}))

// Game Arcade bulan ini (foto badge asli) + status selesai/belum
export function MonthlyGames({ badges }: { badges: InsightBadge[] }) {
  // Tanpa game bulan berjalan kartu ini tidak dirender: judulnya jadi "0/0" dengan grid kosong,
  // dan itu cuma membingungkan (game bulan lalu sudah pindah ke arsip Game Terdahulu).
  if (!GAMES.length) return null
  const done = (re: RegExp) => badges.some((b) => b.cat !== 'skill' && re.test(b.title))
  // Game yang ditarik sementara tetap ikut penyebut: poinnya tetap dihitung lewat sesi susulan.
  const nDone = GAMES.filter((g) => done(g.re)).length
  return (
    <div className="card">
      <div className="card-h">Game Arcade 2026 <span className="card-tag">{nDone}/{GAMES.length}</span></div>
      <div className="games-grid">
        {GAMES.map((g) => {
          const ok = done(g.re)
          return (
            <div key={g.name} className={'gamecard' + (ok ? ' done' : '')}>
              <img src={g.img + '?v=6'} alt={g.name} loading="lazy" />
              <div className="gc-name">{g.name}</div>
              {g.sub && <div className="gc-sub">{g.sub}</div>}
              <div className={'gc-status' + (ok ? ' ok' : '')}>
                {ok ? <><IconCheck style={{ width: 14, height: 14, display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }} />Selesai</> : g.off ? 'Ditunda' : 'Belum'}
              </div>
              {g.off && <div className="gc-off">{g.off}</div>}
            </div>
          )
        })}
      </div>
      <div className="card-note">Foto badge resmi Google Cloud. Status dari badge di profilmu (best-effort). Access code &amp; game tiap bulan bisa berbeda.</div>
    </div>
  )
}
