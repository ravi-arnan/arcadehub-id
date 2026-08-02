import React from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion'
import * as Tooltip from '@radix-ui/react-tooltip'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import { ProfileProvider } from './profile.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <Tooltip.Provider delayDuration={250} skipDelayDuration={400}>
            <BrowserRouter>
              <ProfileProvider>
                <App />
              </ProfileProvider>
            </BrowserRouter>
          </Tooltip.Provider>
        </MotionConfig>
      </LazyMotion>
    </ErrorBoundary>
    <Analytics />
    <SpeedInsights />
  </React.StrictMode>
)

// Moved out of an inline <script> in index.html so the CSP can stay script-src
// 'self'. Registering after the bundle loads instead of on window load costs
// nothing: the worker only matters from the second visit onward.
// Hanya di production. Di dev, worker ini meng-cache URL modul Vite yang
// hash-nya berubah tiap re-optimize dependensi, jadi halaman bisa kebagian
// campuran modul lama dan baru: dua salinan React sekaligus, lalu "Invalid
// hook call". Sekalian bersihkan worker sisa dari dev sebelumnya.
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  } else {
    navigator.serviceWorker.getRegistrations()
      .then((regs) => regs.forEach((r) => r.unregister()))
      .catch(() => {})
  }
}
