import './Layout.css'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  title: string
  subtitle?: string
  back?: boolean
  backTo?: string
  actions?: React.ReactNode
  mainClassName?: string
  children: React.ReactNode
}

export default function Layout({ title, subtitle, back, backTo, actions, mainClassName, children }: LayoutProps) {
  return (
    <div className="layout">
      <Header title={title} subtitle={subtitle} back={back} backTo={backTo} actions={actions} />
      <main className={`layout-main${mainClassName ? ` ${mainClassName}` : ''}`}>{children}</main>
      <Footer />
    </div>
  )
}