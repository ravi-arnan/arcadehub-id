import { lazy } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout.jsx'

// Tiap halaman di-lazy load (code-splitting per rute).
const Points = lazy(() => import('./pages/Points.jsx'))
const Leaderboard = lazy(() => import('./pages/Leaderboard.jsx'))
const Catalog = lazy(() => import('./pages/Catalog.jsx'))
const Prizes = lazy(() => import('./pages/Prizes.jsx'))
const Info = lazy(() => import('./pages/Info.jsx'))
const Contribute = lazy(() => import('./pages/Contribute.jsx'))

// "/" -> /points, tapi kalau ada ?guild= arahkan ke leaderboard (jaga link lama fasilitator).
function IndexRedirect() {
  const { search } = useLocation()
  const hasGuild = new URLSearchParams(search).has('guild')
  return <Navigate to={{ pathname: hasGuild ? '/leaderboard' : '/points', search }} replace />
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
        <Route path="*" element={<Navigate to="/points" replace />} />
      </Route>
    </Routes>
  )
}
