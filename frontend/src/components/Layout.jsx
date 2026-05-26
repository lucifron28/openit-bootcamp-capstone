import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

function Layout() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
