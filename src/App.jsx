import { lazy } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import {
  CHUNK_RELOAD_KEY,
  shouldReloadForChunkError,
} from '../lib/chunkReload.js'

// Tiap halaman di-lazy load (code-splitting per rute), lewat satu pembungkus
// supaya chunk basi sesudah deploy sembuh sendiri. Tanpa ini, tab yang kebuka
// waktu deploy jalan akan gagal import chunk lama (hilang dari server dan dari
// cache service worker) dan mendarat di layar error, padahal cukup refresh.
function lazyRoute(load) {
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
      return new Promise(() => {})
    }),
  )
}

const Points = lazyRoute(() => import('./pages/Points.jsx'))
const Leaderboard = lazyRoute(() => import('./pages/Leaderboard.jsx'))
const Catalog = lazyRoute(() => import('./pages/Catalog.jsx'))
const Prizes = lazyRoute(() => import('./pages/Prizes.jsx'))
const Info = lazyRoute(() => import('./pages/Info.jsx'))
const Contribute = lazyRoute(() => import('./pages/Contribute.jsx'))
const Roadmap = lazyRoute(() => import('./pages/Roadmap.jsx'))
const Guilds = lazyRoute(() => import('./pages/Guilds.jsx'))

// "/" -> /points, meneruskan ?guild= supaya guild ikut terpakai saat auto-join dari Poin Saya.
function IndexRedirect() {
  const { search } = useLocation()
  return <Navigate to={{ pathname: '/points', search }} replace />
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<IndexRedirect />} />
        <Route path="points" element={<Points />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="prizes" element={<Prizes />} />
        <Route path="info" element={<Info />} />
        <Route path="contribute" element={<Contribute />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="guilds" element={<Guilds />} />
        <Route path="*" element={<Navigate to="/points" replace />} />
      </Route>
    </Routes>
  )
}
