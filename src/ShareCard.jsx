import { useEffect, useRef, useState } from 'react'
import { m } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import { TIERS, tierForPoints } from './points.js'

const W = 1080, H = 1080
const NAVY0 = '#1b1f45', NAVY1 = '#0f1230', GOLD = '#fcc934', BLUE = '#7f8cff', INK = '#eef1ff', MUTED = '#9aa3d6'

function drawCard(ctx, score) {
  const total = score?.total || 0
  const tier = tierForPoints(total)
  const tierName = tier >= 0 ? TIERS[tier].n : 'Menuju tier pertama'
  const name = (score?.name || 'Peserta Arcade').slice(0, 28)

  // background
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, NAVY0); bg.addColorStop(1, NAVY1)
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)

  // subtle grid glow top
  const glow = ctx.createRadialGradient(W / 2, 120, 40, W / 2, 120, 620)
  glow.addColorStop(0, 'rgba(127,140,255,.16)'); glow.addColorStop(1, 'rgba(127,140,255,0)')
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H)

  // border frame
  ctx.strokeStyle = 'rgba(252,201,52,.35)'; ctx.lineWidth = 6
  ctx.strokeRect(40, 40, W - 80, H - 80)

  ctx.textAlign = 'center'

  // brand
  ctx.fillStyle = GOLD; ctx.font = "42px 'PS2P', monospace"
  ctx.fillText('ARCADE HUB', W / 2, 160)
  ctx.fillStyle = MUTED; ctx.font = "22px 'Segoe UI', sans-serif"
  ctx.fillText('Google Cloud Arcade Fasilitator 2026', W / 2, 205)

  // name
  ctx.fillStyle = INK; ctx.font = "600 46px 'Segoe UI', sans-serif"
  ctx.fillText(name, W / 2, 335)

  // big points
  ctx.fillStyle = GOLD; ctx.font = "180px 'PS2P', monospace"
  ctx.fillText(String(total), W / 2, 560)
  ctx.fillStyle = MUTED; ctx.font = "30px 'Segoe UI', sans-serif"
  ctx.fillText('TOTAL POIN', W / 2, 620)

  // tier pill
  ctx.font = "34px 'Segoe UI', sans-serif"
  const pillW = ctx.measureText(tierName.toUpperCase()).width + 90
  const pillX = (W - pillW) / 2, pillY = 680, pillH = 76
  ctx.fillStyle = 'rgba(252,201,52,.14)'
  roundRect(ctx, pillX, pillY, pillW, pillH, 38); ctx.fill()
  ctx.strokeStyle = 'rgba(252,201,52,.5)'; ctx.lineWidth = 2
  roundRect(ctx, pillX, pillY, pillW, pillH, 38); ctx.stroke()
  ctx.fillStyle = GOLD; ctx.font = "600 32px 'Segoe UI', sans-serif"
  ctx.fillText(tierName.toUpperCase(), W / 2, pillY + 50)

  // stats row
  const games = score?.games || 0, skills = score?.skills || 0
  const mbonus = score?.mbonus || 0
  const stats = [[games, 'Arcade Games'], [skills, 'Skill Badges'], [mbonus, 'Bonus Milestone']]
  const colW = (W - 160) / 3
  stats.forEach(([v, l], i) => {
    const cx = 80 + colW * i + colW / 2
    ctx.fillStyle = BLUE; ctx.font = "56px 'PS2P', monospace"
    ctx.fillText(String(v), cx, 880)
    ctx.fillStyle = MUTED; ctx.font = "24px 'Segoe UI', sans-serif"
    ctx.fillText(l, cx, 925)
  })

  // divider + footer
  ctx.strokeStyle = 'rgba(255,255,255,.1)'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(120, 975); ctx.lineTo(W - 120, 975); ctx.stroke()
  ctx.fillStyle = INK; ctx.font = "600 30px 'Segoe UI', sans-serif"
  ctx.fillText('arcadehub-id.vercel.app', W / 2, 1025)
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export default function ShareCard({ score, onClose }) {
  const canvasRef = useRef(null)
  const [blob, setBlob] = useState(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    let cancelled = false
    const render = async () => {
      try { await Promise.all([document.fonts.load("64px 'PS2P'"), document.fonts.load("32px 'Segoe UI'")]) } catch { /* pakai fallback */ }
      if (cancelled) return
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      drawCard(ctx, score)
      canvas.toBlob((b) => { if (!cancelled) setBlob(b) }, 'image/png')
    }
    render()
    return () => { cancelled = true }
  }, [score])

  const fileName = 'arcade-hub-progress.png'
  const download = () => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = fileName; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 4000)
  }
  const share = async () => {
    if (!blob) return
    const file = new File([blob], fileName, { type: 'image/png' })
    const text = `Progress Google Cloud Arcade 2026 aku: ${score?.total || 0} poin. Cek & hitung punyamu di arcadehub-id.vercel.app`
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Arcade Hub', text })
      } else {
        download(); setMsg('Gambar diunduh, siap kamu upload ke sosmed.')
      }
    } catch { /* dibatalkan user */ }
  }

  return (
    <Dialog.Root open onOpenChange={(o) => { if (!o) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <m.div className="sc-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }} />
        </Dialog.Overlay>
        <Dialog.Content asChild aria-describedby={undefined}>
          <m.div className="sc-modal"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}>
            <Dialog.Close asChild><button className="sc-x" aria-label="Tutup">✕</button></Dialog.Close>
            <Dialog.Title className="sc-title">Bagikan progress kamu</Dialog.Title>
            <canvas ref={canvasRef} width={W} height={H} className="sc-canvas" />
            <div className="sc-acts">
              <button className="joinbtn" onClick={share} disabled={!blob}>Bagikan</button>
              <button className="miniref" onClick={download} disabled={!blob}>Unduh gambar</button>
            </div>
            {msg && <div className="sc-msg">{msg}</div>}
          </m.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
