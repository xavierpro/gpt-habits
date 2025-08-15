import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

export default function App() {
  const loc = useLocation()

  useEffect(() => {
    const p = new URLSearchParams(loc.search)
    if (p.get('d') === 'today') {
      // Placeholder for deep link handling
    }
  }, [loc.search])

  return (
    <div className="h-full flex flex-col">
      <header className="p-4 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <h1 className="text-xl font-semibold">Habit & Mood</h1>
      </header>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <nav className="safe-area border-t bg-white flex">
        <Tab to="/">Today</Tab>
        <Tab to="/history">History</Tab>
        <Tab to="/settings">Settings</Tab>
      </nav>
    </div>
  )
}

function Tab({ to, children }: { to: string; children: any }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        "flex-1 text-center py-3 " + (isActive ? "text-brand-700 font-medium" : "text-gray-500")
      }
      end
    >
      {children}
    </NavLink>
  )
}
