import { NavLink } from 'react-router-dom'

export default function Footer() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `layout-footer__link${isActive ? ' layout-footer__link--active' : ''}`

  return (
    <footer className="layout-footer">
      <NavLink to="/" end className={linkClass}>
        Home
      </NavLink>
      <NavLink to="/history" className={linkClass}>
        Geschiedenis
      </NavLink>
    </footer>
  )
}