/**
 * Navbar — top navigation bar shown on all auth-protected routes.
 * Replaces the floating LogoutButton from App.tsx (consolidated here).
 *
 * Active state: NavLink applies a teal underline + accent color when the route matches.
 * Hidden when the user is not authenticated.
 */
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'

interface NavItem {
  to: string
  label: string
}

const ITEMS: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/commander', label: 'Commander' },
  { to: '/dashboard', label: 'Dashboard' },
]

const linkBase: React.CSSProperties = {
  padding: '6px 4px',
  fontSize: 12,
  fontFamily: "'Figtree',sans-serif",
  fontWeight: 500,
  color: '#52525B',
  textDecoration: 'none',
  borderBottom: '1px solid transparent',
  transition: 'color .2s, border-color .2s',
}

const linkActive: React.CSSProperties = {
  color: '#5EEAD4',
  borderBottomColor: '#5EEAD4',
}

export function Navbar() {
  const { user, signOut } = useAuth()
  const location = useLocation()

  // Hide on /login and when not authenticated
  if (!user || location.pathname === '/login') return null

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(6,7,12,.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,.05)',
      }}
    >
      <div
        className="max-w-6xl mx-auto"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
          gap: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 11,
              fontWeight: 600,
              color: '#5EEAD4',
              letterSpacing: '.05em',
            }}
          >
            FOS
          </span>
          <div style={{ display: 'flex', gap: 16 }}>
            {ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                style={({ isActive }) => ({
                  ...linkBase,
                  ...(isActive ? linkActive : null),
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        <button
          onClick={signOut}
          style={{
            padding: '5px 12px',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,.055)',
            background: 'rgba(255,255,255,.025)',
            color: '#52525B',
            fontSize: 10,
            fontFamily: "'JetBrains Mono',monospace",
            cursor: 'pointer',
            transition: 'color .2s, border-color .2s',
          }}
        >
          Deconnexion
        </button>
      </div>
    </nav>
  )
}

export default Navbar
