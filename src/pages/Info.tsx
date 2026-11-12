import { useState } from 'react'
import { CONFIG, ANNOUNCEMENT } from '../config'
import { INFO_FAQ } from '../../lib/seoRoutes.js'
import Collapse from '../components/Collapse'
import PointsSystem from '../components/PointsSystem'
import { IconExternalLink } from '../icons'

// FAQ terkontrol (bukan <details> native) agar buka/tutupnya beranimasi seperti collapsible lain.
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={'faq-item' + (open ? ' open' : '')}>
      <button type="button" className="faq-q" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {q}
      </button>
      <Collapse open={open}>
        <p className="faq-a">{a}</p>
      </Collapse>
    </div>
  )
}

const STEPS = [
  ['Set profil jadi Public', 'Buka Cloud Skills Boost, lalu ke menu profil, klik Edit profile, dan aktifkan "Make profile public".'],
  ['Buka halaman profil publikmu', 'Di menu profil, klik "View public profile".'],
  ['Salin URL-nya', 'Copy alamat di address bar (formatnya cloudskillsboost.google/public_profiles/…), lalu tempel di tab Poin Saya.'],
]

const RESOURCES = [
  ['Halaman Arcade resmi', CONFIG.arcadeUrl],
  ['Katalog badge (skill & game)', CONFIG.catalogUrl],
  ['Weekly Challenge Player: info & aturan', CONFIG.wcPlayerUrl],
  ['Weekly Challenge Player: leaderboard', CONFIG.wcLeaderboardUrl],
  ['Profil & pengaturan publik', CONFIG.profileHelp],
  ['Bonus Milestone: pengumuman resmi', CONFIG.bonusForumUrl],
  ['Bonus Milestone: dokumen instruksi', CONFIG.bonusDocUrl],
]

const FAQ: [string, string][] = INFO_FAQ.map((item) => [item.q, item.a])

export default function Info() {
  return (
    <div className="info">
      {/* Pengumuman yang sedang aktif, sumbernya sama dengan modal (config.ts). */}
      {ANNOUNCEMENT?.id && (
        <div className="infocard ann">
          <div className="ic-lab">Pengumuman · {ANNOUNCEMENT.date}</div>
          <div className="ic-t">{ANNOUNCEMENT.title}</div>
          <div className="ann-body">
            {ANNOUNCEMENT.body.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          {ANNOUNCEMENT.links && ANNOUNCEMENT.links.length > 0 && (
            <div className="ann-links">
              {ANNOUNCEMENT.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                  {l.label} <IconExternalLink style={{ width: 13, height: 13, display: 'inline-block', verticalAlign: 'middle', marginLeft: 3 }} />
                </a>
              ))}
            </div>
          )}
          {ANNOUNCEMENT.signature && <div className="ann-sign">{ANNOUNCEMENT.signature}</div>}
        </div>
      )}

      <div className="infocard">
        <div className="ic-t">Gabung Komunitas</div>
        <p className="ic-p">Info, bantuan, dan teman belajar. Semua peserta guild wajib gabung.</p>
        <a className="wabtn" href={CONFIG.whatsappUrl} target="_blank" rel="noreferrer">
          Gabung Grup WhatsApp
        </a>
      </div>

      <div className="infocard">
        <div className="ic-t">Cara ambil link profil publik</div>
        <ol className="steps">
          {STEPS.map(([h, d], i) => (
            <li key={i}>
              <b>{h}.</b> {d}
            </li>
          ))}
        </ol>
        <a className="ic-link" href={CONFIG.profileHelp} target="_blank" rel="noreferrer">
          Buka pengaturan profil <IconExternalLink style={{ width: 13, height: 13, display: 'inline-block', verticalAlign: 'middle', marginLeft: 3 }} />
        </a>
      </div>

      <div className="infocard">
        <div className="ic-t">Resources</div>
        <div className="reslist">
          {RESOURCES.map(([label, url]) => (
            <a key={url} className="resitem" href={url} target="_blank" rel="noreferrer">
              {label} <IconExternalLink style={{ width: 13, height: 13, display: 'inline-block', verticalAlign: 'middle', marginLeft: 3 }} />
            </a>
          ))}
        </div>
      </div>

      <PointsSystem />

      <div className="infocard">
        <div className="ic-t">FAQ</div>
        <div className="faq">
          {FAQ.map(([q, a], i) => (
            <FaqItem key={i} q={q} a={a} />
          ))}
        </div>
      </div>

      <div className="foot">
        Info program mengikuti sumber resmi (rsvp.withgoogle.com/events/arcade-fasilitator-id). Poin di app ini dihitung otomatis dari profilmu (best-effort).
      </div>
    </div>
  )
}
