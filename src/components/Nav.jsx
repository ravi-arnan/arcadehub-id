import { useLayoutEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { NAV, NavIcon } from '../routes.jsx'

// Top nav bar. Pil aktif meluncur antar-tab.
//
// Dulu ini pakai framer-motion `layoutId`, tapi layout animation cuma ikut di
// bundle `domMax`, sementara main.jsx sengaja pakai `domAnimation` yang lebih
// ramping. Efeknya pil-nya nyeplak, bukan meluncur. Sekarang cuma satu pil,
// digeser lewat transform CSS dari offset item aktif: gerakannya benar tanpa
// nambah sekitar 10KB ke bundle, dan reduced-motion diurus CSS.
export default function Nav() {
  const navRef = useRef(null)
  const [pill, setPill] = useState(null)
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const measure = () => {
      const active = nav.querySelector('.navitem.on')
      // Rute di luar NAV tidak punya item aktif: sembunyikan pil, jangan
      // tinggalkan di posisi terakhir yang salah.
      setPill(active ? { x: active.offsetLeft, w: active.offsetWidth } : null)
    }

    measure()
    // Nav ganti dari flex ke grid di breakpoint mobile, jadi ukuran item bisa
    // berubah tanpa navigasi. ResizeObserver menangkap itu sekaligus resize.
    const observer = new ResizeObserver(measure)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [pathname])

  return (
    <nav className="topnav" ref={navRef}>
      <span
        className="navpill"
        aria-hidden="true"
        style={
          pill
            ? { transform: `translateX(${pill.x}px)`, width: `${pill.w}px` }
            : { opacity: 0 }
        }
      />
      {NAV.map(({ path, label, icon }) => (
        <NavLink
          key={path}
          to={path}
          aria-label={label}
          className={({ isActive }) => 'navitem' + (isActive ? ' on' : '')}
        >
          <NavIcon icon={icon} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
