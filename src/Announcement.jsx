import { useState } from 'react'
import { m } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import { ANNOUNCEMENT } from './config.js'

// Sekali tutup, tidak muncul lagi, sampai `id` di config.js diganti.
const seenKey = (id) => `ann-seen:${id}`
function isSeen(id) {
  try { return localStorage.getItem(seenKey(id)) === '1' } catch { return false }
}
function markSeen(id) {
  try { localStorage.setItem(seenKey(id), '1') } catch { /* storage diblokir, tampil lagi nanti */ }
}

export default function Announcement() {
  const a = ANNOUNCEMENT
  const [open, setOpen] = useState(() => Boolean(a?.id) && !isSeen(a.id))

  if (!a?.id) return null

  const close = () => { markSeen(a.id); setOpen(false) }

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) close() }}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <m.div className="sc-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }} />
        </Dialog.Overlay>
        <Dialog.Content asChild aria-describedby={undefined}>
          <m.div className="sc-modal ann-modal"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}>
            <Dialog.Close asChild><button className="sc-x" aria-label="Tutup">✕</button></Dialog.Close>
            <Dialog.Title className="sc-title">{a.title}</Dialog.Title>
            {a.date && <div className="ann-date">{a.date}</div>}
            <div className="ann-body">
              {a.body.map((line, i) => <p key={i}>{line}</p>)}
            </div>
            {a.links?.length > 0 && (
              <div className="ann-links">
                {a.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">{l.label} <span aria-hidden>↗</span></a>
                ))}
              </div>
            )}
            {a.signature && <div className="ann-sign">{a.signature}</div>}
          </m.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
