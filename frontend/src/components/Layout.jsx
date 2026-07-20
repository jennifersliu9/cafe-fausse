import { NavLink, Outlet } from 'react-router-dom'
import { contactInfo } from '../data/contact'
import Footer from './Footer'
import './Layout.css'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu' },
  { to: '/reservations', label: 'Reservations' },
  { to: '/about', label: 'About Us' },
  { to: '/gallery', label: 'Gallery' },
]

function Layout() {
  return (
    <div className="site">
      <header className="site-header">
        <div className="container header-inner">
          <NavLink to="/" className="brand">
            <span className="brand-mark">CF</span>
            <span>
              <strong>{contactInfo.name}</strong>
              <small>French Fine Dining</small>
            </span>
          </NavLink>

          <nav className="main-nav" aria-label="Main navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default Layout
