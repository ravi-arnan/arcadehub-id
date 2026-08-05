import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { CONFIG } from '../config.js'
import { NAV } from '../routes.jsx'
import { shortDate } from '../utils/time.js'

// Disuntik saat build oleh `define` di vite.config.js. Fallback ke waktu sekarang supaya
// impor file ini di luar bundel Vite (mis. tes Node) tidak melempar ReferenceError.
const BUILD_TIME = typeof __BUILD_TIME__ === 'string' ? __BUILD_TIME__ : new Date().toISOString()

// Jeda sebelum memantul, dihitung dari saat scroll benar-benar berhenti
// (momentum trackpad ikut terhitung berhenti). Nilainya menentukan berapa lama
// wordmark sempat dipandang: 140ms cukup untuk tidak melawan gerakan tapi
// terlalu singkat untuk dilihat, jadi ditahan hampir sedetik dulu.
const DWELL_BEFORE_REBOUND = 900

// Wordmark penutup sengaja berada di luar batas scroll "wajar": halaman terasa
// mentok di baris copyright, dan wordmark cuma tersingkap kalau pengguna
// meneruskan scroll — lalu memantul balik sendiri.
//
// Wordmark-nya tetap di alur dokumen (jadi benar-benar bisa di-scroll ke sana);
// hook ini cuma (1) menerbitkan --reveal 0..1 sesuai sedalam apa pengguna
// menarik, dan (2) menarik posisi scroll kembali ke batas setelah gerakan
// berhenti. Tidak perlu transform di elemen induk — itu bakal merusak posisi
// sticky topbar dan fixed FAB yang ada di dalamnya.
function useFooterReveal(footerRef, markRef) {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let timer

    // Diukur ulang tiap kali, bukan disimpan: tinggi halaman berubah tiap
    // navigasi rute dan tinggi wordmark ikut lebar viewport.
    const limitOf = () => {
      const mark = markRef.current
      return mark ? document.documentElement.scrollHeight - window.innerHeight - mark.offsetHeight : 0
    }

    // Digerakkan langsung oleh posisi scroll, bukan transisi CSS: cahayanya
    // naik seiring tarikan dan surut lagi mengikuti pantulan, jadi tidak ada
    // fade yang jalan sendiri di luar irama gerakan pengguna.
    const paint = () => {
      frame = 0
      const footer = footerRef.current
      const mark = markRef.current
      if (!footer || !mark) return
      const past = window.scrollY - limitOf()
      const progress = Math.min(1, Math.max(0, past / mark.offsetHeight))
      footer.style.setProperty('--reveal', progress.toFixed(3))
    }

    const settle = () => {
      const limit = limitOf()
      if (limit > 0 && window.scrollY > limit + 1) {
        window.scrollTo({ top: limit, behavior: 'smooth' })
      }
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint)
      // Pantulan dilewati kalau reduced-motion, tapi --reveal tetap jalan:
      // di sana pengguna boleh berhenti di bawah dan glow-nya harus ikut ada.
      if (reduced) return
      // Menunggu scroll benar-benar berhenti, termasuk momentum trackpad —
      // menarik balik di tengah gerakan bikin scroll terasa dilawan.
      clearTimeout(timer)
      timer = setTimeout(settle, DWELL_BEFORE_REBOUND)
    }

    paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
      clearTimeout(timer)
    }
  }, [footerRef, markRef])
}

export default function Footer() {
  const footerRef = useRef(null)
  const markRef = useRef(null)
  useFooterReveal(footerRef, markRef)

  return (
    <footer className="site-footer" ref={footerRef}>
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

        <div className="foot-colgroup">
          <div className="fcol">
            <h4>Menu</h4>
            {NAV.map(({ path, label }) => (
              <NavLink key={path} to={path} className="flink">{label}</NavLink>
            ))}
            <NavLink to="/guilds" className="flink">Guild</NavLink>
            <NavLink to="/roadmap" className="flink">Roadmap</NavLink>
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
          </div>
        </div>
      </div>

      <div className="foot-bottom">
        <div className="fcode"><span>Kode referral</span><b>{CONFIG.referralCode}</b></div>
        <div className="fcopy">
          © 2026 Arcade Hub · Dibuat untuk komunitas Google Cloud Arcade Fasilitator 2026
          {/* Tanggal build, disuntik vite.config.js. <time dateTime> dipakai supaya mesin
              pencari dan pembaca layar mendapat tanggal yang tidak ambigu, sementara
              manusia tetap membaca format Indonesia. */}
          <span className="fupdated">
            Terakhir diperbarui <time dateTime={BUILD_TIME}>{shortDate(BUILD_TIME)}</time>
          </span>
        </div>
      </div>

      {/* Wordmark raksasa. aria-hidden: murni dekorasi, namanya sudah diumumkan
          oleh .brand-title di atas — tanpa ini screen reader membacanya dua kali. */}
      <div className="foot-markwrap" ref={markRef} aria-hidden="true">
        <div className="foot-mark">ARCADE HUB</div>
      </div>
    </footer>
  )
}
