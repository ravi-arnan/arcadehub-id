import { useState } from 'react'
import { CONFIG } from './config.js'

function CopyCode() {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(CONFIG.referralCode).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    }).catch(() => {})
  }
  return (
    <button className="codecopy" onClick={copy}>
      <span className="cc-code">{CONFIG.referralCode}</span>
      <span className="cc-btn">{copied ? 'Tersalin ✓' : 'Salin'}</span>
    </button>
  )
}

const STEPS = [
  ['Set profil jadi Public', 'Buka Cloud Skills Boost → menu profil → Edit profile → aktifkan "Make profile public".'],
  ['Buka halaman profil publikmu', 'Di menu profil, klik "View public profile".'],
  ['Salin URL-nya', 'Copy alamat di address bar (formatnya cloudskillsboost.google/public_profiles/…), lalu tempel di tab Poin Saya.'],
]

const RESOURCES = [
  ['Halaman Arcade resmi', CONFIG.arcadeUrl],
  ['Katalog badge (skill & game)', CONFIG.catalogUrl],
  ['Profil & pengaturan publik', CONFIG.profileHelp],
]

const FAQ = [
  ['Apa itu program ini?', 'Google Cloud Arcade Fasilitator 2026: program beasiswa coding gamifikasi dari Google Cloud (Cloud, AI, ML, Data Engineering). Gratis untuk semua WNI. Selesaikan game & skill badge, kumpulkan poin, tukar hadiah.'],
  ['Bagaimana poin dihitung?', '1 Arcade Game = 1 poin. Setiap 2 Skill Badge = 1 poin. Milestone memberi bonus poin (hanya milestone tertinggi yang dihitung).'],
  ['Kenapa poin saya 0 padahal punya badge?', 'Pastikan profil di-set PUBLIC. Yang dihitung hanya badge Arcade Season 2026 (earned Jan–Des 2026); badge dari tahun sebelumnya tidak masuk hitungan.'],
  ['Berapa lab yang bisa saya kerjakan per hari?', 'Maksimum 15 lab dalam 24 jam. Batas ini tidak bisa dinaikkan.'],
  ['Email pendaftaran tidak masuk?', `Tambahkan ${CONFIG.spamEmail} ke kontak/allowlist emailmu agar tidak masuk folder Spam/Promosi, lalu daftar ulang bila perlu.`],
  ['Kapan hadiah dikirim?', 'Setelah kamu mencapai tier Arcade Player (mengumpulkan cukup poin) dan program selesai. Slot per tier terbatas (first-come), jadi kunci poin secepatnya.'],
]

export default function Info() {
  return (
    <div className="info">
      <div className="infocard hero">
        <div className="ic-t">Daftar Program</div>
        <p className="ic-p">Belum daftar? Gunakan kode referral guild ini saat mengisi formulir pendaftaran.</p>
        <div className="ic-lab">Kode Referral</div>
        <CopyCode />
        <a className="bigcta" href={CONFIG.registerUrl} target="_blank" rel="noreferrer">Daftar Sekarang ↗</a>
        <div className="ic-dates">
          <div><span>Buka</span><b>{CONFIG.regOpen}</b></div>
          <div><span>Tutup</span><b>{CONFIG.regClose}</b></div>
        </div>
      </div>

      <div className="infocard">
        <div className="ic-t">Gabung Komunitas</div>
        <p className="ic-p">Info, bantuan, dan teman belajar. Semua peserta guild wajib gabung.</p>
        <a className="wabtn" href={CONFIG.whatsappUrl} target="_blank" rel="noreferrer">Gabung Grup WhatsApp</a>
      </div>

      <div className="infocard">
        <div className="ic-t">Cara ambil link profil publik</div>
        <ol className="steps">
          {STEPS.map(([h, d], i) => (
            <li key={i}><b>{h}.</b> {d}</li>
          ))}
        </ol>
        <a className="ic-link" href={CONFIG.profileHelp} target="_blank" rel="noreferrer">Buka pengaturan profil ↗</a>
      </div>

      <div className="infocard">
        <div className="ic-t">Resources</div>
        <div className="reslist">
          {RESOURCES.map(([label, url]) => (
            <a key={url} className="resitem" href={url} target="_blank" rel="noreferrer">{label} <span>↗</span></a>
          ))}
        </div>
      </div>

      <div className="infocard">
        <div className="ic-t">FAQ</div>
        <div className="faq">
          {FAQ.map(([q, a], i) => (
            <details key={i}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="foot">Info program mengikuti sumber resmi (rsvp.withgoogle.com/events/arcade-fasilitator-id). Poin di app ini dihitung otomatis dari profilmu (best-effort).</div>
    </div>
  )
}
