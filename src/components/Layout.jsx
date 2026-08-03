import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import { titleFor } from '../routes.jsx'
import SpaceFX from '../SpaceFX.jsx'
import Nav from './Nav.jsx'
import Footer from './Footer.jsx'
import Deadline from './Deadline.jsx'
import RouteSkeleton from './RouteSkeleton.jsx'

// Tombol masukan (pakai Radix Popover) di-defer, tidak kritis untuk render awal.
const FeedbackBubble = lazy(() => import('../FeedbackBubble.jsx'))
// Modal pengumuman admin, isinya di config.js (ANNOUNCEMENT).
const Announcement = lazy(() => import('../Announcement.jsx'))

export default function Layout() {
  const location = useLocation()
  useEffect(() => { document.title = titleFor(location.pathname) }, [location.pathname])

  // Topbar menyusut jadi pil setelah halaman di-scroll sedikit. Ambangnya
  // ditandai sentinel yang diparkir 20px dari puncak dokumen (lihat
  // .topbar-sentinel): begitu dia keluar viewport, state flip. Pakai
  // IntersectionObserver, bukan listener scroll, supaya scroll tidak memicu
  // re-render sama sekali — cuma satu flip saat lewat batas.
  const sentinelRef = useRef(null)
  const [stuck, setStuck] = useState(false)
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="page">
      <SpaceFX />
      <div className="topbar-sentinel" ref={sentinelRef} aria-hidden="true" />

      <header className={'topbar' + (stuck ? ' stuck' : '')}>
        <div className="topbar-inner">
          <Link to="/points" className="brand"><span className="brand-title">ARCADE HUB</span></Link>
          <Nav />
        </div>
      </header>

      <main className="main">
        <div className="app">
          <div className="deadline"><Deadline /></div>
          <AnimatePresence mode="wait">
            <m.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
              <Suspense fallback={<RouteSkeleton />}>
                <Outlet />
              </Suspense>
            </m.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer />
      <Suspense fallback={null}><FeedbackBubble /></Suspense>
      <Suspense fallback={null}><Announcement /></Suspense>
    </div>
  )
}
