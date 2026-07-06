import './Footer.css'
import { NavLink, useLocation } from 'react-router-dom'

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function GoalsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function ProgressIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

export default function Footer() {
  const location = useLocation()
  const isGoals = location.pathname.startsWith('/goals')
  const isProgress = location.pathname.startsWith('/progress')
  const isHome = !isGoals && !isProgress

  const base = 'layout-footer__link'
  const active = 'layout-footer__link--active'

  return (
    <footer className="layout-footer">
      <div className="layout-footer__tabs">
        <NavLink to="/" end className={`${base}${isHome ? ` ${active}` : ''}`}>
          <HomeIcon />
          <span>Home</span>
        </NavLink>
        <NavLink to="/goals" className={`${base}${isGoals ? ` ${active}` : ''}`}>
          <GoalsIcon />
          <span>Doelen</span>
        </NavLink>
        <NavLink to="/progress" className={`${base}${isProgress ? ` ${active}` : ''}`}>
          <ProgressIcon />
          <span>Progressie</span>
        </NavLink>
      </div>
      <p className="layout-footer__tagline">Blijf consistent — kleine stappen, grote resultaten.</p>
    </footer>
  )
}
