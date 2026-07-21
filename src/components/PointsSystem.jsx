// Infografik "Sistem Poin" (mengikuti go.cloudskillsboost.google/arcade):
// tiap Arcade GAME badge = 1 poin; 2 Skill Badge = 1 poin.
// Game diambil dari GAME_CATALOG (sumber kebenaran) + gambar badge asli.
import { GAME_CATALOG } from '../catalog.js'

function Badge() {
  return (
    <svg className="psi" viewBox="0 0 26 20" aria-hidden="true">
      <rect x="1.5" y="1.5" width="23" height="17" rx="2.5" fill="#eef1f6" stroke="#c7cede" strokeWidth="1" />
      <rect x="5" y="6" width="16" height="2" rx="1" fill="#b7c0d0" />
      <rect x="5" y="9.5" width="10" height="2" rx="1" fill="#cdd4df" />
      <rect x="4" y="15" width="4.5" height="2.2" fill="#4285F4" />
      <rect x="9" y="15" width="4.5" height="2.2" fill="#EA4335" />
      <rect x="14" y="15" width="4.5" height="2.2" fill="#FBBC05" />
      <rect x="19" y="15" width="3" height="2.2" fill="#34A853" />
    </svg>
  )
}

const GameImg = ({ g }) => <img className="ps-game" src={g.img} alt="" loading="lazy" width="40" height="40" />

export default function PointsSystem() {
  const example = GAME_CATALOG[1] || GAME_CATALOG[0] // 1 game untuk contoh
  return (
    <div className="infocard psys">
      <div className="ic-t">Sistem Poin</div>
      <div className="ps-rows">
        {GAME_CATALOG.map((g) => (
          <div key={g.name} className="ps-row">
            <span className="ps-label">{g.name}</span>
            <span className="ps-ico"><GameImg g={g} /></span>
            <span className="ps-desc">×1 game badge = <b>1 poin</b></span>
          </div>
        ))}
        <div className="ps-row">
          <span className="ps-label">Skill Badge</span>
          <span className="ps-ico"><Badge /></span>
          <span className="ps-desc">×2 badge = <b>1 poin</b></span>
        </div>
      </div>
      <div className="ps-example">
        <span className="ps-ex-label">Contoh</span>
        <span className="ps-ex-icons"><Badge /><Badge /><GameImg g={example} /></span>
        <span className="ps-ex-eq">= <b>2 poin</b></span>
      </div>
    </div>
  )
}
