import { Suspense, lazy } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import { CONFIG } from '../config.js'
import SpaceFX from '../SpaceFX.jsx'
import Nav from './Nav.jsx'
import Footer from './Footer.jsx'
import Deadline from './Deadline.jsx'
import RouteSkeleton from './RouteSkeleton.jsx'

// Tombol masukan (pakai Radix Popover) di-defer, tidak kritis untuk render awal.
const FeedbackBubble = lazy(() => import('../FeedbackBubble.jsx'))

export default function Layout() {
  const location = useLocation()
  return (
    <div className="page">
      <SpaceFX />
      <a className="announce" href={CONFIG.whatsappUrl} target="_blank" rel="noreferrer">
        <span className="ann-dot" />
        <span className="ann-full">Gabung komunitas WhatsApp fasilitator untuk info &amp; bantuan</span>
        <span className="ann-short">Gabung grup WhatsApp fasilitator</span>
        &nbsp;→
      </a>

      <header className="topbar">
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
    </div>
  )
}
