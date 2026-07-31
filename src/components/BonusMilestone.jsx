// Bonus Milestone 2026: +10 poin untuk membangun AI Agent pertama.
// Sumber: discuss.google.dev/t/arcade-facilitator-2026-bonus-milestone/386412 (31 Jul 2026).
//
// Statusnya TIDAK bisa dibaca dari public profile (verifikasinya lewat form Google berisi
// Project ID + Billing Account ID), jadi klaimnya manual dan disimpan lokal saja. Sengaja TIDAK
// dikirim ke leaderboard: itu angka yang bisa diklaim siapa pun tanpa bukti.
// ponytail: localStorage, cukup sampai ada endpoint verifikasi resmi yang bisa dicek.
import { useState } from 'react'
import { BONUS_TASK } from '../points.js'
import { GEAR_BADGES, SKILL_CATALOG, courseUrl, skillEarned, norm } from '../catalog.js'
import { CONFIG } from '../config.js'
import Collapse from './Collapse.jsx'
import { IconArrowRight, IconTrophy } from '../icons.jsx'

const KEY = 'gcaf2026_bonus_done'
const read = () => { try { return localStorage.getItem(KEY) === '1' } catch { return false } }
const write = (v) => { try { v ? localStorage.setItem(KEY, '1') : localStorage.removeItem(KEY) } catch { /* private mode: klaim tidak persisten, bukan error */ } }

export default function BonusMilestone({ score }) {
  const [done, setDone] = useState(read)
  const [open, setOpen] = useState(false)

  const earned = new Set((score?.skillList || []).map(norm))
  const gear = GEAR_BADGES.map((id) => {
    const s = SKILL_CATALOG.find((x) => x.id === id)
    return { id, name: s?.name || String(id), done: s ? skillEarned(s.id, s.name, earned) : false }
  })
  const gearDone = gear.filter((g) => g.done).length
  // Syarat resmi: Milestone 1 sudah terbuka. tierIdx = index milestone tertinggi (-1 = belum ada).
  const msOk = (score?.tierIdx ?? -1) >= 0

  const toggle = () => { const v = !done; setDone(v); write(v) }

  return (
    <div className="card bonusms">
      <div className="card-h">
        <IconTrophy width="17" height="17" /> Bonus Milestone
        <span className="bm-pts">+{BONUS_TASK} poin</span>
      </div>
      <div className="card-note" style={{ marginTop: 0 }}>
        Bangun AI Agent pertamamu di Google Cloud, dapat <b>{BONUS_TASK} poin bonus</b> di luar poin game dan badge.
        Bisa diselesaikan dalam sehari.
      </div>

      <div className="bm-req">
        <div className="bm-rrow">
          <span className={'bm-dot' + (msOk ? ' ok' : '')} aria-hidden>{msOk ? '✓' : ''}</span>
          <span>Milestone 1 sudah terbuka {msOk ? '' : '(syarat ikut)'}</span>
        </div>
        <div className="bm-rrow">
          <span className={'bm-dot' + (gearDone === gear.length ? ' ok' : '')} aria-hidden>{gearDone === gear.length ? '✓' : ''}</span>
          <span>4 badge GEAR selesai <b>{gearDone}/{gear.length}</b></span>
        </div>
      </div>

      <ul className="bm-gear">
        {gear.map((g) => (
          <li key={g.id} className={g.done ? 'ok' : ''}>
            <a href={courseUrl(g.id)} target="_blank" rel="noreferrer">{g.name} <IconArrowRight width="12" height="12" /></a>
            <span className="bm-gstat">{g.done ? 'Selesai' : 'Belum'}</span>
          </li>
        ))}
      </ul>

      <button className="sh-toggle bm-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? 'Sembunyikan langkah' : 'Lihat langkah lengkap'} <span className={'sh-chev' + (open ? ' up' : '')} aria-hidden>▾</span>
      </button>
      <Collapse open={open}>
        <ol className="bm-steps">
          <li>Selesaikan 4 badge GEAR di atas. Badge ini juga tetap menambah poin milestone biasa.</li>
          <li>Aktifkan Google Cloud free trial (90 hari, kredit 300 dolar) pakai email yang kamu daftarkan. Lewati kalau billing-mu sudah aktif.</li>
          <li>Ikuti <a href={CONFIG.bonusDocUrl} target="_blank" rel="noreferrer">dokumen instruksi</a> untuk membangun agent-nya. Jangan lewatkan langkah terakhir: beri akses ke <b>{CONFIG.bonusVerifierEmail}</b> supaya proyekmu bisa diverifikasi.</li>
          <li>Isi <a href={CONFIG.bonusFormUrl} target="_blank" rel="noreferrer">form verifikasi</a> dengan Project ID dan Billing Account ID (18 karakter) dari Cloud Console.</li>
        </ol>
        <p className="card-note">Detail resmi ada di <a href={CONFIG.bonusForumUrl} target="_blank" rel="noreferrer">pengumuman forum Google Developer</a>. Syarat lain: sudah terdaftar di kohort Arcade Facilitator 2026 dan punya GEAR Badge + Arcade GEAR Badge di Google Developer Profile.</p>
      </Collapse>

      <label className="bm-claim">
        <input type="checkbox" checked={done} onChange={toggle} />
        <span>Sudah saya kerjakan dan form verifikasinya sudah dikirim</span>
      </label>
      {done && (
        <div className="bm-claimed">
          +{BONUS_TASK} poin dihitung untukmu: <b>{(score?.total || 0) + BONUS_TASK}</b> poin total.
          Angka ini <b>catatan pribadi di perangkat ini</b>, tidak ikut ke leaderboard, karena Google yang memverifikasi lewat form, bukan kami.
        </div>
      )}
    </div>
  )
}
