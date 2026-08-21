import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { SKILL_CATALOG, GAME_CATALOG, PAST_GAMES, pastGameImg, pastGameEarned, courseUrl, gameUrl, skillImg, skillEarned, isNewSkill, norm } from '../catalog.js'
import { MS, DEADLINE } from '../points.js'
import { LAB_SOLUTIONS, SOLUTION_REPO } from '../../lib/labSolutions.js'
import { projectMilestone } from '../../lib/projection.js'
import { pickShortlist } from '../../lib/shortlist.js'
import { useMyProfile } from '../profile.jsx'
import { useWishlist } from '../wishlist.js'
import { shortDate } from '../utils/time.js'
import Tip from '../Tip.jsx'
import Bar from '../components/Bar.jsx'
import Collapse from '../components/Collapse.jsx'
import ToggleButton from '../components/ToggleButton.jsx'
import { IconGrid, IconList, IconArrowRight, IconAward, IconGamepad, IconTarget, IconBookmark, IconZap, IconGithub } from '../icons.jsx'

const fmtPts = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1))

// Fast-track. Setiap skill badge diakhiri challenge lab, dan lab itu bisa langsung dikerjakan
// tanpa menyelesaikan lab-lab kursusnya dulu: badge tetap terbit. Ditulis sebagai satu banner,
// bukan penanda per kartu, karena berlaku untuk SEMUA skill badge. Penanda di 93 kartu yang
// isinya sama persis cuma menambah ramai tanpa menambah informasi.
function FastTrack() {
  return (
    <div className="fasttrack">
      <span className="ft-ic" aria-hidden><IconZap width="18" height="18" /></span>
      <div>
        <div className="ft-t">Sudah bisa materinya? Lompat ke challenge lab</div>
        <div className="ft-p">
          Tiap skill badge ditutup satu <b>challenge lab</b>, dan lab itu boleh dikerjakan duluan tanpa
          menyelesaikan lab kursus di depannya. Selesai challenge lab, badge langsung terbit dan poinnya
          masuk. Buka course-nya, gulir ke aktivitas paling bawah yang bertanda <b>Challenge Lab</b>.
        </div>
        <div className="ft-p ft-warn">
          Sekali dimulai, waktunya jalan dan percobaan ulang butuh kredit lagi. Kalau belum yakin,
          kerjakan lab kursusnya dulu.
        </div>
      </div>
    </div>
  )
}

// Level resmi dari silabus fasilitator. Badge di luar silabus tidak punya level, ditaruh paling akhir.
const LEVEL_LABEL = { beginner: 'Pemula', intermediate: 'Menengah', advanced: 'Lanjutan' }
const LEVEL_ORDER = { beginner: 0, intermediate: 1, advanced: 2 }
const levelRank = (lv) => LEVEL_ORDER[lv] ?? 3
const fmtRate = (n) => (n >= 10 ? Math.round(n) : Math.round(n * 10) / 10).toLocaleString('id-ID')

const TYPE_LABEL = { game: 'Game', skill: 'Skill' }

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
// Daftar target yang ditandai sendiri. Dipotong 6 supaya panduan tidak berubah jadi katalog
// kedua; sisanya diarahkan ke filter Target di katalog.
const TARGET_PREVIEW = 6

function MyTargets({ items, onShowSaved }) {
  const preview = items.slice(0, TARGET_PREVIEW)
  return (
    <div className="sh-mine">
      <div className="sh-shead">
        <span><IconBookmark width="14" height="14" /> Target kamu <b>{items.length}</b></span>
        <button className="sh-swap" onClick={onShowSaved}>Buka di katalog</button>
      </div>
      <ul className="sh-slist">
        {preview.map((it) => (
          <li key={it.key}>
            {it.url
              ? <a href={it.url} target="_blank" rel="noreferrer">{it.title} <IconArrowRight width="13" height="13" /></a>
              : <span>{it.title}</span>}
            <span className="sh-lvl">{it.type === 'game' ? 'Game' : it.level ? LEVEL_LABEL[it.level] : 'Skill'}</span>
          </li>
        ))}
      </ul>
      <p className="sh-snote">
        Badge yang kamu tandai sendiri di katalog, belum selesai
        {items.length > preview.length && <>, {items.length - preview.length} lagi tidak ditampilkan di sini</>}.
        Tanda ini <b>catatan pribadi di perangkat ini</b>, tidak ikut ke leaderboard dan tidak menambah poin.
      </p>
    </div>
  )
}

function StartHere({ score, gamesDone, gamesTotal, gamesOff = [], skillTodo, savedTodo = [], onShowGames, onShowSkills, onShowSaved }) {
  const [open, setOpen] = useState(true)
  const [shortOff, setShortOff] = useState(0)
  const fg = score?.facilGames || 0
  const fs = score?.facilSkills || 0
  const target = MS.find((m) => !(fg >= m.g && fs >= m.s)) || MS[MS.length - 1]
  const daysLeft = Math.max(0, Math.floor((DEADLINE.getTime() - Date.now()) / 864e5))
  const proj = useMemo(() => projectMilestone({ facilGames: fg, facilSkills: fs }), [fg, fs])
  // Index milestone tertinggi yang sudah tercapai, -1 kalau belum ada. Cara hitungnya sengaja
  // sama persis dengan scoreProfile() supaya tangga ini tidak pernah beda dari poin asli.
  const topIdx = MS.reduce((acc, m, i) => (fg >= m.g && fs >= m.s ? i : acc), -1)
  // Shortlist dibatasi 4 walau kebutuhannya lebih banyak: daftar panjang justru
  // mengembalikan masalah "bingung memilih" yang mau dihilangkan.
  const shortlist = pickShortlist(skillTodo, shortOff, Math.min(proj.needSkills, 4))

  return (
    <div className="card starthere">
      <div className="card-h">
        <span className="sh-badge">Panduan Pemula</span> Mulai dari Sini
        <ToggleButton open={open} onToggle={() => setOpen((o) => !o)} />
      </div>
      <div className="card-note" style={{ marginTop: 0, marginBottom: open ? 14 : 0 }}>
        Bingung mulai dari mana? Ikuti urutan ini biar poinmu naik paling cepat.
      </div>
      <Collapse open={open}>
        {savedTodo.length > 0 && <MyTargets items={savedTodo} onShowSaved={onShowSaved} />}
        <ol className="sh-steps">
          <li className="sh-step">
            <span className="sh-num">1</span>
            <div className="sh-main">
              <div className="sh-title"><IconGamepad width="17" height="17" /> Kerjakan Game dulu <span className="sh-count">{gamesDone}/{gamesTotal}</span></div>
              <p className="sh-desc">
                Prioritas #1. Game rilis tiap bulan dengan <b>kuota terbatas</b> dan game lama <b>kedaluwarsa</b>, jadi amankan dulu selagi ada. Sisa {daysLeft} hari menuju penutupan.
              </p>
              {gamesOff.length > 0 && (
                <p className="sh-desc sh-off">
                  {gamesOff.map((g) => g.name).join(', ')} bulan ini <b>ditarik sementara</b> oleh Google, jadi belum bisa dikerjakan. <b>Poinnya tidak hangus</b>: Google menjanjikan sesi susulan, dan game itu tetap dihitung 1 poin, jadi targetmu tetap {gamesTotal} game. Kerjakan yang lain dulu.
                </p>
              )}
              <button className="sh-cta" onClick={onShowGames}>Lihat {gamesTotal} Game <IconArrowRight width="14" height="14" /></button>
            </div>
          </li>
          <li className="sh-step">
            <span className="sh-num">2</span>
            <div className="sh-main">
              <div className="sh-title"><IconTarget width="17" height="17" /> Kumpulkan badge keahlian <span className="sh-count">target {target.short}</span></div>
              <p className="sh-desc">
                Setiap <b>2 badge skill = 1 poin</b>. Kejar target terdekatmu: <b>{target.n}</b> ({target.g} game + {target.s} badge), bonusnya <b>+{target.bonus} poin</b> di luar poin game dan badge. Belum tahu badge mana? Buka daftar di bawah dan mulai dari topik yang paling kamu minati.
              </p>
              <div className="sh-bars">
                <Bar label="Game" cur={fg} req={target.g} />
                <Bar label="Badge" cur={fs} req={target.s} />
              </div>
              {score && <PaceStrip p={proj} />}
              {/* Tanpa profil tersinkron, badge "belum" tidak bisa dipercaya, jadi
                  shortlist hanya muncul setelah poin dihitung. */}
              {score && shortlist.length > 0 && (
                <div className="sh-short">
                  <div className="sh-shead">
                    <span>Mulai dari {shortlist.length} badge ini</span>
                    {skillTodo.length > shortlist.length && (
                      <button className="sh-swap" onClick={() => setShortOff((o) => o + shortlist.length)}>Ganti saran</button>
                    )}
                  </div>
                  <ul className="sh-slist">
                    {shortlist.map((it) => (
                      <li key={it.key}>
                        <a href={it.url} target="_blank" rel="noreferrer">{it.title} <IconArrowRight width="13" height="13" /></a>
                        {it.level && <span className="sh-lvl">{LEVEL_LABEL[it.level]}</span>}
                      </li>
                    ))}
                  </ul>
                  <p className="sh-snote">Diurutkan dari level termudah menurut silabus resmi (Pemula, lalu Menengah, lalu Lanjutan). Poinnya sama semua (0,5 poin), jadi ini soal beban belajar, bukan nilai. Potongan pendek dari {skillTodo.length} badge yang belum kamu ambil.</p>
                </div>
              )}
              <button className="sh-cta" onClick={onShowSkills}>
                {score && proj.needSkills > 0 ? `Lihat ${proj.needSkills} badge yang dibutuhkan` : 'Lihat badge yang belum'} <IconArrowRight width="14" height="14" />
              </button>
            </div>
          </li>
        </ol>
        <div className="sh-ladder" role="list" aria-label="Tahap milestone">
          {MS.map((m, i) => {
            const done = fg >= m.g && fs >= m.s
            const isTarget = m.short === target.short && !done
            // Hanya milestone tertinggi yang bonusnya dibayar. Tanpa pembedaan ini, M1 yang
            // sudah lewat ikut tampil hijau "+7 poin bonus" dan terbaca seolah ditumpuk
            // dengan M2, padahal 7 poin itu tidak pernah masuk total.
            const paid = done && i === topIdx
            // Sisa kebutuhan hanya ditampilkan di rung yang sedang dikejar. Di rung yang lebih
            // jauh angkanya cuma bikin panik, dan di rung yang sudah lewat tidak ada artinya.
            const kurang = [
              fg < m.g ? `${m.g - fg} game` : null,
              fs < m.s ? `${m.s - fs} badge` : null,
            ].filter(Boolean).join(' + ')
            return (
              <div key={m.short} role="listitem" className={'sh-rung' + (done ? ' done' : '') + (isTarget ? ' now' : '') + (paid ? ' paid' : '')}>
                <div className="sh-rtop">
                  <span className="sh-dot" aria-hidden>{done ? '✓' : m.short}</span>
                  <span className="sh-rlabel">{m.n}</span>
                </div>
                <div className="sh-rreq">{m.g} game + {m.s} badge</div>
                {/* Angka yang paling sering ditanya: bonusnya berapa. Ini bonus MURNI, di luar
                    poin dari game dan badge itu sendiri. Lihat scoreProfile di lib/points.js. */}
                <div className="sh-rbonus">+{m.bonus} poin bonus</div>
                {isTarget && kurang && <div className="sh-rgap">kurang {kurang}</div>}
                {paid && <div className="sh-rgap paid">bonus ini yang kamu dapat</div>}
                {done && !paid && <div className="sh-rgap">tercapai, digantikan {MS[topIdx].short}</div>}
              </div>
            )
          })}
        </div>
        <p className="sh-lnote">
          Bonus dibayar dari <b>milestone tertinggi saja</b>, tidak ditumpuk. Kalau kamu sampai
          Milestone 2, bonusmu {MS[1].bonus} poin, bukan {MS[0].bonus} + {MS[1].bonus}. Poin dari
          game dan badge tetap dihitung terpisah dan tidak hangus.
        </p>
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
  const cls = 'bc-badge' + (it.type !== 'game' ? (it.img ? ' bc-badge-skill' : ' bc-skillthumb') : '')
  const thumb = it.img ? <img src={it.img} alt={it.name} loading="lazy" /> : <IconAward width="34" height="34" />
  if (!it.url) return <span className={cls}>{thumb}</span>
  return (
    <a className={cls} href={it.url} target="_blank" rel="noreferrer" onClick={onCopy} title={title}>
      {thumb}
    </a>
  )
}

// Tombol tandai target. Bukan status capaian, jadi label dan warnanya sengaja beda dari centang
// selesai: yang satu fakta dari profil Google, yang satu niat yang diketik sendiri.
// Tombol cari panduan komunitas.
//
// Sengaja pencarian, BUKAN link langsung ke satu repo, karena tidak ada pemetaan
// badge -> repo yang bisa dipercaya. Sudah diuji ke API GitHub: pencarian repo dengan
// judul badge dalam tanda kutip mengembalikan NOL hasil untuk sebagian badge ("Privileged
// Access with IAM", "Connecting Cloud Networks with NCC"), tanpa kutip hasilnya ada tapi
// tiga teratasnya sering repo yang tidak berhubungan, dan pencarian kode GitHub, satu-satunya
// yang benar-benar menemukan lab di dalam monorepo, mewajibkan login.
//
// Jadi yang dipakai Google dengan site:github.com. Google mengindeks isi README dan nama
// folder di dalam repo, sehingga lab baru yang solusinya cuma jadi satu folder pun tetap
// ketemu. Ikonnya tetap GitHub karena itu tujuan akhirnya; tooltip menyebut lewat Google
// supaya tidak ada yang merasa dikelabui.
const searchUrl = (title) =>
  'https://www.google.com/search?q=' + encodeURIComponent(`site:github.com "${title}"`)

const repoUrl = (path) => `https://github.com/${SOLUTION_REPO}/blob/main/${path}`

// HANYA untuk skill badge.
//
// Game sengaja tidak dapat tombol ini. Satu game Arcade berisi beberapa lab yang masing-masing
// punya kode sendiri, jadi tidak ada satu berkas pun yang benar untuk judul game, dan
// pencariannya memang kosong: `site:github.com "Arcade Adventure: Data Vault"` nol hasil.
// Tombol yang selalu mentok lebih buruk daripada tidak ada tombol.
//
// Untuk skill badge ada dua tujuan, dan bedanya ditandai jelas:
//
// 1. Badge yang ada di repo solusi fasilitator -> link LANGSUNG ke runbook lab itu, ikon
//    berwarna. Ini yang dicari peserta, dan penulisnya orang yang sama dengan fasilitatornya.
// 2. Badge lain -> pencarian, ikon redup. Pemetaan badge ke repo orang lain tidak ada yang
//    bisa dipercaya, jadi tidak ada link langsung yang jujur bisa dibuat.
function SolutionButton({ it, className }) {
  if (it.type !== 'skill') return null
  const sol = LAB_SOLUTIONS[it.id]
  const href = sol ? repoUrl(sol.path) : searchUrl(it.title)
  const tip = sol
    ? `${sol.code} di repo fasilitator${sol.verified ? ', sudah diverifikasi' : ', belum diuji'}`
    : 'Cari panduan komunitas di GitHub'
  return (
    <Tip label={tip}>
      <a className={className + (sol ? ' has' : '')} href={href} target="_blank" rel="noreferrer noopener"
        aria-label={tip + ': ' + it.title} onClick={(e) => e.stopPropagation()}>
        <IconGithub width="14" height="14" />
      </a>
    </Tip>
  )
}

function SaveButton({ saved, onSave, className }) {
  return (
    <button
      className={className + (saved ? ' on' : '')}
      onClick={onSave}
      aria-pressed={saved}
      title={saved ? 'Hapus dari target saya' : 'Tandai sebagai target saya'}
      aria-label={saved ? 'Hapus dari target saya' : 'Tandai sebagai target saya'}
    >
      <IconBookmark width="15" height="15" fill={saved ? 'currentColor' : 'none'} />
    </button>
  )
}

function BadgeCard({ it, saved, onSave }) {
  const [copied, copy] = useCopyCode(it.code)
  return (
    <div className={'badgecard' + (it.done ? ' done' : '') + (it.off ? ' off' : '') + (saved ? ' saved' : '')}>
      <div className="bc-top">
        <span className={'bc-tag ' + it.type}>{TYPE_LABEL[it.type]}</span>
        {it.isNew && <span className="bc-new" title="Badge unggulan batch terbaru">BARU</span>}
        {it.done && <span className="bc-check" title="Selesai">✓</span>}
        <SaveButton saved={saved} onSave={onSave} className="bc-save" />
        <BadgeThumb it={it} onCopy={copy} />
      </div>
      <div className="bc-body">
        <div className="bc-title">{it.title}</div>
        <div className="bc-meta">
          {/* Chip level ditaruh di baris meta, bukan di atas gambar: art badge Google punya
              garis warna di tepi bawah, chip melayang di sana jadi bertabrakan. */}
          {it.code
            ? <CodeChip code={it.code} copied={copied} onCopy={copy} />
            : it.level ? <span className={'bc-lvl ' + it.level}>{LEVEL_LABEL[it.level]}</span>
            : <span />}
          {/* Poin + tombol panduan dibungkus satu grup: .bc-meta memakai space-between,
              jadi tiga anak sejajar akan melempar angka poin ke tengah. */}
          <span className="bc-right">
            <span className="bc-pts">{fmtPts(it.points)} Poin</span>
            <SolutionButton it={it} className="bc-gh" />
          </span>
        </div>
        {it.off ? (
          <span className="bc-start off">Belum bisa dikerjakan</span>
        ) : (
          <a className="bc-start" href={it.url} target="_blank" rel="noreferrer" onClick={copy}>
            {it.type === 'game' ? 'Mulai Challenge' : 'Buka Badge'} <IconArrowRight width="15" height="15" />
          </a>
        )}
        {it.off && <div className="bc-offnote">{it.off}</div>}
      </div>
    </div>
  )
}

function BadgeRow({ it, saved, onSave }) {
  const [copied, copy] = useCopyCode(it.code)
  return (
    <div className={'badgerow' + (it.done ? ' done' : '') + (saved ? ' saved' : '')}>
      <SaveButton saved={saved} onSave={onSave} className="br-save" />
      <span className={'br-tag ' + it.type}>{TYPE_LABEL[it.type]}</span>
      {it.isNew && <span className="bc-new">BARU</span>}
      {it.url
        ? <a className="br-title" href={it.url} target="_blank" rel="noreferrer" onClick={copy}>{it.title}</a>
        : <span className="br-title">{it.title}</span>}
      {it.code && <CodeChip code={it.code} copied={copied} onCopy={copy} />}
      <SolutionButton it={it} className="br-gh" />
      <span className="br-pts">{fmtPts(it.points)} Poin</span>
      <span className={'br-status' + (it.done ? ' ok' : '')}>{it.done ? '✓ Selesai' : it.off ? 'Ditunda' : 'Belum'}</span>
    </div>
  )
}

const PG_MONTHS = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli']

// Arsip game Jan-Jul 2026. Tidak bisa dikerjakan lagi (halaman game-nya ditutup), tapi poinnya
// TETAP masuk total Season, jadi ini penjelasan dari mana poin peserta lama datang.
function PastGames({ gameBadges }) {
  const [open, setOpen] = useState(false)
  const done = useMemo(() => new Set(gameBadges.map((b) => norm(b.title))), [gameBadges])
  const months = useMemo(() => {
    const map = new Map()
    for (const g of PAST_GAMES) {
      if (!map.has(g.m)) map.set(g.m, [])
      map.get(g.m).push({ ...g, done: pastGameEarned(g, done) })
    }
    return [...map.entries()].sort((a, b) => b[0] - a[0])
  }, [done])
  const mine = PAST_GAMES.filter((g) => pastGameEarned(g, done))
  const minePts = mine.reduce((n, g) => n + g.pts, 0)

  return (
    <div className="card">
      <div className="card-h">
        Game Terdahulu <span className="card-tag">{mine.length}/{PAST_GAMES.length}</span>
        <ToggleButton open={open} onToggle={() => setOpen((o) => !o)} />
      </div>
      <div className="card-note" style={{ marginTop: 0, marginBottom: open ? 14 : 0 }}>
        Game Arcade Januari–Juli 2026 yang sudah ditutup. Tidak bisa dikerjakan lagi, tapi kalau kamu
        sempat main, poinnya tetap dihitung di total Season 2026
        {mine.length > 0 && <> — punyamu <b>{mine.length} game = {minePts} poin</b></>}.
      </div>
      <Collapse open={open}>
        {months.map(([m, items]) => (
          <div key={m} className="bmonth">
            <div className="bmonth-h">{PG_MONTHS[m]} 2026 <span>{items.length}</span></div>
            <div className="bmonth-list">
              {items.map((g) => (
                <div key={g.name} className={'bi g pg' + (g.done ? ' pg-done' : '')}>
                  <img className="pg-img" src={pastGameImg(g.name)} alt="" loading="lazy" />
                  <span className="pg-name">{g.done && <span className="pg-ok" aria-hidden>✓</span>}{g.name}</span>
                  <span className="pg-pts">{g.pts} poin</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="blnote">
          Sumber: bagian “Game over!” di halaman resmi Google Skills Arcade (arsip 1 Agu 2026).
          Game spesial bernilai 2–3 poin, sisanya 1 poin. “Arcade Skill Up Summer” dan “Arcade
          Expressive Efficiency” berjalan dua bulan (Mei–Juni) jadi hanya dihitung sekali.
        </div>
      </Collapse>
    </div>
  )
}

export default function Catalog() {
  const navigate = useNavigate()
  const { score } = useMyProfile()
  const [saved, toggleSaved] = useWishlist()
  const [q, setQ] = useState('')
  const [type, setType] = useState('all') // all | game | skill
  const [status, setStatus] = useState('all') // all | todo | saved | done
  const [view, setView] = useState('grid') // grid | list

  const earned = useMemo(() => new Set((score?.skillList || []).map(norm)), [score])
  const gameBadges = useMemo(() => (score?.seasonBadges || []).filter((b) => b.cat !== 'skill'), [score])

  const items = useMemo(() => {
    const games = GAME_CATALOG.map((g) => ({
      key: 'g-' + g.name,
      type: 'game',
      name: g.name,
      title: g.sub ? `${g.name}: ${g.sub}` : g.name,
      img: g.img + '?v=4',
      code: g.code || null,
      // Game yang ditarik Google tidak dilink: halamannya tidak bisa dimasuki lagi.
      url: g.off || !g.game ? null : gameUrl(g.game),
      off: g.off || null,
      points: 1,
      done: gameBadges.some((b) => g.re.test(b.title)),
    }))
    const skills = SKILL_CATALOG.map((s) => ({
      key: 's-' + s.id,
      id: s.id,
      type: 'skill',
      name: s.name,
      title: s.name,
      level: s.level || null,
      img: skillImg(s.id),
      code: null,
      url: courseUrl(s.id),
      points: 0.5,
      done: skillEarned(s.id, s.name, earned),
      isNew: isNewSkill(s),
    }))
    return [...games, ...skills]
  }, [gameBadges, earned])

  // Diurutkan Pemula -> Menengah -> Lanjutan -> di luar silabus, supaya shortlist "kerjakan
  // selanjutnya" mulai dari yang paling ringan, bukan dari posisi acak di katalog.
  const skillTodo = useMemo(
    () => items.filter((it) => it.type === 'skill' && !it.done).sort((a, b) => levelRank(a.level) - levelRank(b.level)),
    [items],
  )

  // Game yang ditarik TETAP masuk hitungan: poinnya tidak hangus, Google menjanjikan susulan.
  // Menurunkan target jadi 5 justru menyesatkan (milestone fasilitator tetap butuh 6/8/10/12 game).
  const gameCount = GAME_CATALOG.length
  const gameOff = GAME_CATALOG.filter((g) => g.off)
  const skillCount = SKILL_CATALOG.length
  const doneCount = items.filter((it) => it.done).length
  const gamesDone = items.filter((it) => it.type === 'game' && it.done).length

  // Diturunkan dari katalog yang sedang tampil, bukan dari isi Set target: kunci game bulan lalu
  // yang sudah keluar dari katalog tidak boleh ikut terhitung. Lihat komentar di src/wishlist.js.
  const savedItems = useMemo(() => items.filter((it) => saved.has(it.key)), [items, saved])
  const savedTodo = savedItems.filter((it) => !it.done)

  const scrollToCatalog = () => document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const showGames = () => { setType('game'); setStatus('all'); setQ(''); scrollToCatalog() }
  const showSkills = () => { setType('skill'); setStatus('todo'); setQ(''); scrollToCatalog() }
  const showSaved = () => { setType('all'); setStatus('saved'); setQ(''); scrollToCatalog() }

  const shown = items.filter((it) => {
    if (type !== 'all' && it.type !== type) return false
    if (status === 'done' && !it.done) return false
    if (status === 'todo' && it.done) return false
    if (status === 'saved' && !saved.has(it.key)) return false
    if (q && !it.title.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })


  return (
    <div>
      <StartHere score={score} gamesDone={gamesDone} gamesTotal={gameCount} gamesOff={gameOff} skillTodo={skillTodo} savedTodo={savedTodo} onShowGames={showGames} onShowSkills={showSkills} onShowSaved={showSaved} />

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
            {[['all', 'Semua'], ['todo', 'Belum'], ['saved', 'Target'], ['done', 'Selesai']].map(([k, l]) => (
              <button key={k} className={status === k ? 'on' : ''} onClick={() => setStatus(k)}>
                {l}{k === 'saved' && savedItems.length > 0 && <span className="catn">{savedItems.length}</span>}
              </button>
            ))}
          </div>
        </div>

        {type !== 'game' && <FastTrack />}

        {shown.length === 0 ? (
          <div className="card-note" style={{ textAlign: 'center', padding: '18px 0' }}>
            {status === 'saved' && savedItems.length === 0
              ? 'Belum ada target. Klik ikon bookmark di badge mana pun untuk menandainya sebagai target kamu.'
              : 'Tidak ada badge cocok.'}
          </div>
        ) : view === 'grid' ? (
          <div className="badgegrid">{shown.map((it) => <BadgeCard key={it.key} it={it} saved={saved.has(it.key)} onSave={() => toggleSaved(it.key)} />)}</div>
        ) : (
          <div className="badgelist">{shown.map((it) => <BadgeRow key={it.key} it={it} saved={saved.has(it.key)} onSave={() => toggleSaved(it.key)} />)}</div>
        )}


        <div className="card-note">
          Ikon GitHub di tiap <b>skill badge</b> membuka panduan lab. Yang <b>berwarna kuning</b> menuju runbook
          di repo fasilitator (<a href={`https://github.com/${SOLUTION_REPO}`} target="_blank" rel="noreferrer noopener">{SOLUTION_REPO}</a>),
          lengkap dengan catatan checkpoint mana yang harus manual dan kapan terakhir diuji.
          Yang <b>redup</b> belum ada di repo itu, jadi tombolnya membuka pencarian panduan komunitas.
          Panduan komunitas tidak diverifikasi siapa pun. Pakai keduanya untuk memahami langkah yang
          bikin macet, bukan untuk menyalin jawaban: challenge lab mengacak soalnya, jadi badge yang
          didapat tanpa mengerti isinya tidak menolongmu di sana. Game tidak punya tombol ini karena
          satu game berisi beberapa lab, jadi tidak ada satu panduan yang mewakilinya.
        </div>

        <div className="card-note">Game: klik badge atau Mulai Challenge untuk buka di Google Skills (access code otomatis tersalin, tinggal tempel). Skill badge: 2 badge = 1 poin. Hanya skill badge resmi yang menambah poin; badge dari course biasa (completion badge) tidak dihitung program, jadi tidak didaftarkan di sini. Access code diperbarui tiap bulan mengikuti rilis Arcade.</div>
      </div>

      <PastGames gameBadges={gameBadges} />
    </div>
  )
}
