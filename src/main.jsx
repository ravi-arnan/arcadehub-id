import React from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
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
  </React.StrictMode>
)
