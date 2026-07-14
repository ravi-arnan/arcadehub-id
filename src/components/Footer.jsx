import { NavLink } from 'react-router-dom'
import { CONFIG } from '../config.js'
import { NAV } from '../routes.jsx'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="foot-cta">
        <div>
          <div className="fc-t">Belajar bareng lebih seru</div>
          <div className="fc-p">Gabung komunitas fasilitator: info, bantuan lab, dan teman seperjuangan.</div>
        </div>
        <a className="fc-btn" href={CONFIG.whatsappUrl} target="_blank" rel="noreferrer">Gabung Grup WhatsApp</a>
      </div>

      <div className="foot-cols">
        <div className="fcol brandcol">
          <span className="brand-title">ARCADE HUB</span>
          <p>Tracker &amp; kalkulator poin Google Cloud Arcade untuk komunitas fasilitator. Poin dihitung otomatis dari profil publik Cloud Skills Boost.</p>
          <p className="disc">Tools komunitas, tidak resmi dari Google. Poin best-effort, verifikasi via profil resmi.</p>
        </div>
        <div className="fcol">
          <h4>Menu</h4>
          {NAV.map(({ path, label }) => (
            <NavLink key={path} to={path} className="flink">{label}</NavLink>
          ))}
        </div>
        <div className="fcol">
          <h4>Program</h4>
          <a className="flink" href={CONFIG.registerUrl} target="_blank" rel="noreferrer">Daftar Program ↗</a>
          <a className="flink" href={CONFIG.arcadeUrl} target="_blank" rel="noreferrer">Halaman Arcade resmi ↗</a>
          <a className="flink" href={CONFIG.catalogUrl} target="_blank" rel="noreferrer">Katalog badge ↗</a>
        </div>
        <div className="fcol">
          <h4>Komunitas</h4>
          <a className="flink" href={CONFIG.whatsappUrl} target="_blank" rel="noreferrer">Grup WhatsApp ↗</a>
          <div className="fcode"><span>Kode referral</span><b>{CONFIG.referralCode}</b></div>
        </div>
      </div>

      <div className="foot-bottom">© 2026 Arcade Hub · Dibuat untuk komunitas Google Cloud Arcade Fasilitator 2026</div>
    </footer>
  )
}
