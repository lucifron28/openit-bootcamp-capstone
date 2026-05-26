import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const themes = ['light', 'dark', 'cupcake', 'corporate', 'emerald', 'business', 'night']
const defaultTheme = 'corporate'

function getStoredTheme() {
  if (typeof window === 'undefined') {
    return defaultTheme
  }

  return window.localStorage.getItem('sidekick-theme') || defaultTheme
}

function Navbar() {
  const { isAuthenticated, logoutMutation } = useAuth()
  const [theme, setTheme] = useState(getStoredTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('sidekick-theme', theme)
  }, [theme])

  const linkClass = ({ isActive }) =>
    isActive ? 'btn btn-ghost btn-sm text-primary' : 'btn btn-ghost btn-sm'

  return (
    <div className="navbar sticky top-0 z-40 border-b border-base-300 bg-base-100/95 px-4 shadow-sm backdrop-blur">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost px-2 text-xl font-bold">
          SideKick 
        </Link>
      </div>

      <div className="navbar-center hidden gap-1 md:flex">
        <NavLink to="/" className={linkClass}>
          Home
        </NavLink>
        {isAuthenticated && (
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
        )}
      </div>

      <div className="navbar-end gap-2">
        <select
          aria-label="Choose theme"
          className="select select-bordered select-sm w-32"
          value={theme}
          onChange={(event) => setTheme(event.target.value)}
        >
          {themes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {!isAuthenticated && (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </>
        )}

        {isAuthenticated && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
          </button>
        )}
      </div>
    </div>
  )
}

export default Navbar
