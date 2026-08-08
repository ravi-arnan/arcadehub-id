// Rincian dari mana poin datang: game, skill badge, bonus milestone.
//
// Sebelum ini yang tampil cuma chip "Base Arcade" yang sudah mencampur game + skill badge,
// jadi tidak ada cara melihat berapa poin datang dari mana. Angkanya diturunkan dari data yang
// sudah ada (lihat pointBreakdown di lib/points.js), tidak ada request tambahan.
import { MS, pointBreakdown } from '../points.js'

export default function PointBreakdown({ score, bonusDone }) {
  const b = pointBreakdown(score || {}, bonusDone)
  const games = score?.games || 0
  const skills = score?.skills || 0
  const msIdx = score?.tierIdx ?? -1

  const rows = [
    {
      k: 'game',
      label: 'Arcade Games',
      // Jumlah game != poin game: sebagian game Jan-Jun 2026 bernilai 2-3 poin.
      sub: games === b.gamePoints ? `${games} game x 1 poin` : `${games} game (ada yang bernilai lebih dari 1 poin)`,
      pts: b.gamePoints,
    },
    {
      k: 'skill',
      label: 'Skill Badges',
      sub: `${skills} badge, tiap 2 badge = 1 poin` + (b.skillLeftover ? ' (1 badge lagi untuk +1)' : ''),
      pts: b.skillPoints,
    },
    {
      k: 'ms',
      label: 'Bonus Milestone',
      sub: msIdx >= 0 ? MS[msIdx].n + ' tercapai' : 'belum ada milestone tercapai',
      pts: b.mbonus,
    },
  ]

  return (
    <div className="pbd">
      <div className="pbd-h">Rincian Poin</div>
      <ul className="pbd-rows">
        {rows.map((r) => (
          <li key={r.k} className={'pbd-row' + (r.pts ? '' : ' zero')}>
            <span className="pbd-lab">{r.label}<span className="pbd-sub">{r.sub}</span></span>
            <span className="pbd-pts">{r.pts}</span>
          </li>
        ))}
        <li className="pbd-row pbd-total">
          <span className="pbd-lab">Total</span>
          <span className="pbd-pts">{b.total}</span>
        </li>
        {/* Baris terakhir hanya muncul kalau bonus AI Agent diklaim. Sengaja DI BAWAH total dan
            diberi label lokal: +10 itu klaim manual di perangkat ini, tidak ikut ke leaderboard,
            jadi tidak boleh diam-diam menggeser angka besar di atas. */}
        {b.task > 0 && (
          <li className="pbd-row pbd-extra">
            <span className="pbd-lab">Bonus AI Agent<span className="pbd-sub">klaim lokal, tidak masuk leaderboard</span></span>
            <span className="pbd-pts">+{b.task}</span>
          </li>
        )}
        {b.task > 0 && (
          <li className="pbd-row pbd-total">
            <span className="pbd-lab">Total dengan bonus</span>
            <span className="pbd-pts">{b.grandTotal}</span>
          </li>
        )}
      </ul>
    </div>
  )
}
