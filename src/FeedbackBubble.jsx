import { useState } from 'react'
import { m } from 'framer-motion'
import * as Popover from '@radix-ui/react-popover'

function IconMsg() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
}
function IconCheck() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21.8 10A10 10 0 1 1 17 3.34" /><path d="m9 11 3 3L22 4" /></svg>
}

export default function FeedbackBubble() {
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState('')
  const [name, setName] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')

  const onOpenChange = (o) => { setOpen(o); if (!o) { setErr(''); setSent(false) } }

  const send = async () => {
    if (msg.trim().length < 3) { setErr('Tulis masukan minimal 3 karakter.'); return }
    setSending(true); setErr('')
    try {
      const r = await fetch('/api/feedback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, name, page: location.pathname + location.search }),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Gagal mengirim')
      setSent(true); setMsg(''); setName('')
      setTimeout(() => onOpenChange(false), 2200)
    } catch (e) { setErr(e.message) } finally { setSending(false) }
  }

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        <button className="fab" aria-label="Kirim masukan">
          <IconMsg /><span>Masukan</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content asChild side="top" align="end" sideOffset={12} collisionPadding={12} aria-label="Kirim masukan">
          <m.div className="fabpanel" initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}>
            <div className="fp-head">
              <span className="fp-h"><IconMsg /> Kirim Masukan</span>
              <Popover.Close asChild><button className="fp-x" aria-label="Tutup">✕</button></Popover.Close>
            </div>
            {sent ? (
              <div className="fp-thanks"><IconCheck /> Terima kasih! Masukanmu terkirim.</div>
            ) : (
              <>
                <p className="fp-sub">Ada saran, bug, atau ide fitur? Kasih tahu aku.</p>
                <textarea className="fp-ta" placeholder="Tulis masukan kamu…" value={msg} maxLength={1000}
                  onChange={(e) => setMsg(e.target.value)} rows={4} />
                <input className="fin fp-name" placeholder="Nama / kontak (opsional)" value={name} maxLength={60}
                  onChange={(e) => setName(e.target.value)} />
                {err && <div className="ferr">{err}</div>}
                <button className="joinbtn fp-send" onClick={send} disabled={sending}>{sending ? 'Mengirim…' : 'Kirim'}</button>
              </>
            )}
          </m.div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
