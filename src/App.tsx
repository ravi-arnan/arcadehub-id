import { lazy, type ComponentType } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import {
  CHUNK_RELOAD_KEY,
  shouldReloadForChunkError,
} from '../lib/chunkReload.js'

import Points from './pages/Points'

// Tiap halaman sekunder di-lazy load (code-splitting per rute), lewat satu pembungkus
// supaya chunk basi sesudah deploy sembuh sendiri. Halaman utama (Points / "/") sengaja
// diimpor statis langsung supaya LCP awal tidak kena penalti roundtrip lazy-load & Suspense skeleton.
function lazyRoute<T extends ComponentType<any>>(load: () => Promise<{ default: T }>) {
  return lazy(() =>
    load().catch((err) => {
      let last = null
      try {
        last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY)) || null
      } catch {
        // Private mode / storage mati: tidak ada cara aman menghindari loop,
        // jadi jangan reload sama sekali. Error boundary yang menangani.
        throw err
      }
      if (!shouldReloadForChunkError(last, Date.now())) throw err
      try {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()))
      } catch {
        throw err
      }
      location.reload()
      // Sengaja tidak pernah resolve: halaman sudah diganti oleh reload.
      return new Promise<{ default: T }>(() => {})
    })
  )
}

const Leaderboard = lazyRoute(() => import('./pages/Leaderboard'))
const Catalog = lazyRoute(() => import('./pages/Catalog'))
const Prizes = lazyRoute(() => import('./pages/Prizes'))
const Info = lazyRoute(() => import('./pages/Info'))
const Contribute = lazyRoute(() => import('./pages/Contribute'))
const Roadmap = lazyRoute(() => import('./pages/Roadmap'))
const Guilds = lazyRoute(() => import('./pages/Guilds'))

// Redirect fallback: alias /swags dialihkan ke /prizes, sisanya (termasuk /points) ke "/".
function NotFoundRedirect() {
  const { pathname, search } = useLocation()
  if (pathname === '/swags') return <Navigate to={{ pathname: '/prizes', search }} replace />
  return <Navigate to={{ pathname: '/', search }} replace />
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Points />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="prizes" element={<Prizes />} />
        <Route path="info" element={<Info />} />
        <Route path="contribute" element={<Contribute />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="guilds" element={<Guilds />} />
        <Route path="*" element={<NotFoundRedirect />} />
      </Route>
    </Routes>
  )
}
