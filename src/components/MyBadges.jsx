import { useMemo, useState } from 'react'
import { badgeUrl } from '../catalog.js'

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
// seasonBadges.cat === 'skill' hanya untuk non-game (lihat categorize di parseProfile).
const isGameCat = (b) => b.cat !== 'skill'

// `counts` ditambahkan 4 Agu 2026 bersama pengetatan aturan poin. Skor yang sudah tersimpan di
// localStorage SEBELUM itu tidak punya field ini, dan `undefined` yang falsy akan membuat SEMUA
// badge lama tampak tidak berpoin. Karena itu dibandingkan ke `false` secara eksplisit: data
// lama dianggap berpoin, dan ini terkoreksi sendiri karena profile.jsx menyinkron ulang saat
// halaman dibuka.
const isCounted = (b) => b.counts !== false
// Badge keahlian yang benar-benar menambah poin. Angka inilah yang wajib sama dengan kartu
// "Skill Badges" di atas; sebelumnya tab ini menghitung semua badge non-game, jadi halaman yang
// sama menampilkan dua angka berbeda untuk hal yang sama.
const isSkillCounted = (b) => !isGameCat(b) && isCounted(b)
const isNotCounted = (b) => !isGameCat(b) && !isCounted(b)

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
  const skills = badges.filter(isSkillCounted).length
  const other = badges.filter(isNotCounted).length
  const groups = useMemo(() => {
    const f = filter === 'games' ? badges.filter(isGameCat)
      : filter === 'skills' ? badges.filter(isSkillCounted)
        : filter === 'other' ? badges.filter(isNotCounted)
          : badges
    return groupByMonth(f)
  }, [badges, filter])

  const tab = (key, label, n) => (
    <button className={'bf' + (filter === key ? ' on' : '')} onClick={() => setFilter(key)}>{label} <span>{n}</span></button>
  )

  return (
    <div className="bs-view">
      <div className="bf-tabs">
        {tab('all', 'Semua', badges.length)}
        {tab('games', 'Games', games)}
        {tab('skills', 'Skills', skills)}
        {/* Tab keempat hanya muncul kalau memang ada isinya, supaya peserta yang semua badge-nya
            berpoin tidak melihat kategori kosong yang bikin bertanya-tanya. */}
        {other > 0 && tab('other', 'Tanpa poin', other)}
      </div>
      {groups.map((grp) => (
        <div key={grp.label} className="bmonth">
          <div className="bmonth-h">{grp.label} <span>{grp.items.length}</span></div>
          <div className="bmonth-list">
            {grp.items.map((b, i) => {
              const url = badgeUrl(b.title)
              // Diredupkan juga di tab "Semua", bukan cuma dipisah ke tabnya sendiri: di situlah
              // orang menghitung sendiri badge-nya dan bingung kenapa tidak cocok dengan poin.
              const cls = 'bi ' + (isGameCat(b) ? 'g' : 's') + (isCounted(b) ? '' : ' nc')
              const title = isCounted(b) ? undefined : 'Badge ini tidak menambah poin program'
              return url
                ? <a key={i} className={cls + ' lk'} href={url} target="_blank" rel="noreferrer" title={title}>{b.title}<span className="bi-x" aria-hidden>↗</span></a>
                : <div key={i} className={cls} title={title}>{b.title}</div>
            })}
          </div>
        </div>
      ))}
      <div className="blnote">
        Badge Arcade Season 2026 (Jan-Des). Yang menambah poin hanya Arcade Game dan badge keahlian
        resmi; badge lain tetap ditampilkan tapi diredupkan. Klasifikasi best-effort dari nama badge,
        dan link membuka halaman badge di Skills Boost bila dikenali.
      </div>
    </div>
  )
}
