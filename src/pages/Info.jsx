import { useState } from 'react'
import { CONFIG, ANNOUNCEMENT } from '../config.js'
import Collapse from '../components/Collapse.jsx'
import PointsSystem from '../components/PointsSystem.jsx'

// FAQ terkontrol (bukan <details> native) agar buka/tutupnya beranimasi seperti collapsible lain.
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={'faq-item' + (open ? ' open' : '')}>
      <button className="faq-q" onClick={() => setOpen((o) => !o)} aria-expanded={open}>{q}</button>
      <Collapse open={open}><p className="faq-a">{a}</p></Collapse>
    </div>
  )
}

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
  ['Bonus Milestone: pengumuman resmi', CONFIG.bonusForumUrl],
  ['Bonus Milestone: dokumen instruksi', CONFIG.bonusDocUrl],
]

const FAQ = [
  ['Apa itu program ini?', 'Google Cloud Arcade Fasilitator 2026: program beasiswa coding gamifikasi dari Google Cloud (Cloud, AI, ML, Data Engineering). Gratis untuk semua WNI. Selesaikan game & skill badge, kumpulkan poin, tukar hadiah.'],
  ['Bagaimana poin dihitung?', '1 Arcade Game = 1 poin (beberapa game spesial Januari–Juni 2026 bernilai 2–3 poin, lihat "Game Terdahulu" di Katalog). Setiap 2 Skill Badge = 1 poin. Milestone memberi bonus poin (hanya milestone tertinggi yang dihitung).'],
  ['Apa itu Bonus Milestone (+10 poin)?', 'Proyek tambahan dari Google: bangun AI Agent pertamamu, dapat 10 Poin Arcade bonus. Syaratnya sudah terdaftar di kohort, Milestone 1 terbuka, dan 4 badge GEAR selesai. Panduan langkah demi langkah plus link dokumen instruksi dan form verifikasinya ada di tab Poin Saya, di kartu Bonus Milestone AI Agent.'],
  ['Kenapa poin saya 0 padahal punya badge?', 'Pastikan profil di-set PUBLIC. Yang dihitung hanya badge Arcade Season 2026 (earned Jan–Des 2026); badge dari tahun sebelumnya tidak masuk hitungan.'],
  ['Berapa lab yang bisa saya kerjakan per hari?', 'Maksimum 15 lab dalam 24 jam. Batas ini tidak bisa dinaikkan.'],
  ['Email pendaftaran tidak masuk?', `Tambahkan ${CONFIG.spamEmail} ke kontak/allowlist emailmu agar tidak masuk folder Spam/Promosi, lalu daftar ulang bila perlu.`],
  ['Kapan hadiah dikirim?', 'Setelah kamu mencapai tier Arcade Player (mengumpulkan cukup poin) dan program selesai. Slot per tier terbatas (first-come), jadi kunci poin secepatnya.'],
]

export default function Info() {
  return (
    <div className="info">
      {/* Pengumuman yang sedang aktif, sumbernya sama dengan modal (config.js). */}
      {ANNOUNCEMENT?.id && (
        <div className="infocard ann">
          <div className="ic-lab">Pengumuman · {ANNOUNCEMENT.date}</div>
          <div className="ic-t">{ANNOUNCEMENT.title}</div>
          <div className="ann-body">
            {ANNOUNCEMENT.body.map((line, i) => <p key={i}>{line}</p>)}
          </div>
          {ANNOUNCEMENT.signature && <div className="ann-sign">{ANNOUNCEMENT.signature}</div>}
        </div>
      )}

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

      <PointsSystem />

      <div className="infocard">
        <div className="ic-t">FAQ</div>
        <div className="faq">
          {FAQ.map(([q, a], i) => <FaqItem key={i} q={q} a={a} />)}
        </div>
      </div>

      <div className="foot">Info program mengikuti sumber resmi (rsvp.withgoogle.com/events/arcade-fasilitator-id). Poin di app ini dihitung otomatis dari profilmu (best-effort).</div>
    </div>
  )
}
