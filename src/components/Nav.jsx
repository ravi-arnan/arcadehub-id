import { NavLink } from 'react-router-dom'
import { m } from 'framer-motion'
import { NAV, NavIcon } from '../routes.jsx'

// Top nav bar. Pil aktif meluncur antar-tab via layoutId; hover/active via CSS.
export default function Nav() {
  return (
    <nav className="topnav">
      {NAV.map(({ path, label, icon }) => (
        <NavLink key={path} to={path} className={({ isActive }) => 'navitem' + (isActive ? ' on' : '')}>
          {({ isActive }) => (
            <>
              {isActive && <m.span className="navpill" layoutId="navpill" transition={{ type: 'spring', stiffness: 500, damping: 34 }} />}
              <NavIcon icon={icon} /><span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
