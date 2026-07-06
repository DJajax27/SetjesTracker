import './Header.css'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title: string
  subtitle?: string
  back?: boolean
  actions?: React.ReactNode
}

export default function Header({ title, subtitle, back, actions }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="layout-header">
      {back && (
        <button className="layout-header__back" onClick={() => navigate(-1)}>
          ← Terug
        </button>
      )}
      <div className="layout-header__titles">
        <h1 className="layout-header__title">{title}</h1>
        {subtitle && <p className="layout-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="layout-header__actions">{actions}</div>}
    </header>
  )
}