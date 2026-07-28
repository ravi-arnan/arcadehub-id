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
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {})
}
