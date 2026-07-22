import './Footer.css'
import { NavLink } from 'react-router-dom'
import { Home, Target, Activity, User } from 'lucide-react'

export default function Footer() {
  return (
    <nav className="layout-footer">
      <NavLink to="/" end className={({ isActive }) => `footer-tab${isActive ? ' footer-tab--active' : ''}`}>
        <Home className="h-4 w-4" />
        Home
      </NavLink>
      <NavLink to="/goals" className={({ isActive }) => `footer-tab${isActive ? ' footer-tab--active' : ''}`}>
        <Target className="h-4 w-4" />
        Doelen
      </NavLink>
      <NavLink to="/progress" className={({ isActive }) => `footer-tab${isActive ? ' footer-tab--active' : ''}`}>
        <Activity className="h-4 w-4" />
        Progressie
      </NavLink>
      <NavLink to="/account" className={({ isActive }) => `footer-tab${isActive ? ' footer-tab--active' : ''}`}>
        <User className="h-4 w-4" />
        Account
      </NavLink>
    </nav>
  )
}
