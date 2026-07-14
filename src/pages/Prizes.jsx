import { useNavigate } from 'react-router-dom'
import { TIERS, tierForPoints } from '../points.js'
import { useMyProfile } from '../profile.jsx'
import { IconMedal, IconAward, IconTrophy, IconCrown } from '../icons.jsx'

const fmt = (n) => n.toLocaleString('id-ID')
const TIER_ICONS = [IconMedal, IconAward, IconTrophy, IconCrown]

export default function Prizes() {
  const navigate = useNavigate()
  const { score } = useMyProfile()
  const pts = score?.total || 0
  const myTier = tierForPoints(pts)
  const nextTier = myTier + 1 < TIERS.length ? TIERS[myTier + 1] : null
  const toNext = nextTier ? nextTier.min - pts : 0

  return (
    <div>
      {score ? (
        <>
          <div className="prizehead">
            <div>
              <div className="lab">Poin kamu</div>
              <div className="big">{pts}</div>
            </div>
            <div className="tier">{myTier >= 0 ? TIERS[myTier].n : 'Belum masuk tier'}</div>
          </div>
          {nextTier ? (
            <div className="nextnote">Butuh <b>{toNext}</b> poin lagi untuk mencapai <b>{nextTier.n}</b>.</div>
          ) : myTier >= 0 ? (
            <div className="nextnote">Kamu sudah di tier tertinggi. Kunci poinmu secepatnya!</div>
          ) : (
            <div className="nextnote">Kumpulkan <b>{TIERS[0].min}</b> poin untuk masuk tier pertama (<b>{TIERS[0].n}</b>).</div>
          )}
        </>
      ) : (
        <div className="lb-invite">
          <div>
            <div className="li-t">Belum ada poin kamu</div>
            <div className="li-p">Hitung poinmu dulu untuk melihat tier yang kamu capai.</div>
          </div>
          <button className="joinbtn" onClick={() => navigate('/points')}>Hitung Poin Saya</button>
        </div>
      )}

      <div className="ladder">
        <div className="hd">Tier Hadiah Arcade 2026</div>
        {[...TIERS].map((t, i) => {
          const reached = myTier >= i
          const Ic = TIER_ICONS[i]
          return (
            <div key={t.n} className={'tierrow' + (reached ? ' done' : '') + (myTier === i ? ' cur' : '')}>
              <div className="ticon"><Ic /></div>
              <div className="tinfo">
                <div className="tname">{t.n}{myTier === i && <span className="youtag">kamu di sini</span>}</div>
                <div className="tmeta">{t.max === Infinity ? `${t.min}+ poin` : `${t.min}–${t.max} poin`} · {fmt(t.spots)} slot</div>
              </div>
              <div className="tpts">{t.min}<small>poin</small></div>
            </div>
          )
        })}
      </div>

      <div className="card">
        <div className="card-h">Contoh Swag Google Cloud</div>
        <div className="swaggrid">
          <img src="/img/prize1.png?v=2" alt="Merchandise Google Cloud" loading="lazy" />
          <img src="/img/prize2.png?v=2" alt="Merchandise Google Cloud" loading="lazy" />
          <img src="/img/prize3.png?v=2" alt="Merchandise Google Cloud" loading="lazy" />
        </div>
        <div className="card-note">Foto ilustrasi resmi. Item pasti per tier diumumkan Google saat program berjalan.</div>
      </div>

      <div className="prizecard">
        <div className="pc-t">Cara kerja hadiah</div>
        <ul className="pc-list">
          <li>Sistem <b>waterfall &amp; first-come</b>: slot tiap tier terbatas. Makin cepat poinmu terkunci, makin aman posisimu. Kalau tier penuh, kelebihan peserta turun ke tier di bawahnya.</li>
          <li>Tier <b>tidak akumulatif</b>: kamu dapat hadiah tier tertinggi yang kamu capai (bukan gabungan semua tier).</li>
          <li>Contoh swag: hoodie, tas ransel, USB hub, brick set Google Cloud, botol, pulpen, dan merchandise eksklusif lain. Item pasti per tier diumumkan resmi oleh Google.</li>
        </ul>
        <a className="pc-link" href="https://go.cloudskillsboost.google/arcade" target="_blank" rel="noreferrer">Lihat halaman Arcade resmi ↗</a>
      </div>

      <div className="foot">Ambang poin per tier mengikuti pengumuman resmi Google Skills Arcade 2026. Buka tab Poin Saya untuk menghitung poinmu.</div>
    </div>
  )
}
