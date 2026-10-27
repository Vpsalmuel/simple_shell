import { useEffect, useState } from 'react'
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Bell, Menu, Moon, Search, Sun, X, LogOut, Settings } from 'lucide-react'
import Logo from './Logo'
import Avatar from './Avatar'
import CommandPalette from './CommandPalette'
import PersonaSwitcher from './PersonaSwitcher'
import { brand } from '../config/brand'
import { useUser } from '../context/UserContext'
import { navFor } from '../config/nav'
import { notifications as initialNotifications } from '../data'
import { useLocalStorage } from '../hooks/useLocalStorage'

function Sidebar({ onNavigate }) {
  const { user } = useUser()
  return (
    <div className="flex h-full flex-col bg-brand-700 text-brand-100">
      <div className="px-6 pt-6 pb-6">
        <Logo onDark className="h-10 w-auto" />
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3" aria-label="Main">
        {navFor(user).map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-1.5 text-[11px] font-semibold tracking-wider text-brand-300 uppercase">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(({ to, label, icon: Ico, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <span className="absolute top-2 bottom-2 left-0 w-1 rounded-r bg-accent-500" />}
                      <Ico size={18} className={isActive ? 'text-accent-400' : ''} />
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="m-3 rounded-2xl bg-gradient-to-br from-accent-600 to-accent-500 p-4 text-white">
        <p className="text-sm font-semibold">Need help?</p>
        <p className="mt-1 text-xs text-white/85">IT helpdesk is open 7am – 7pm.</p>
        <button className="mt-3 w-full rounded-lg bg-white/20 py-1.5 text-xs font-medium hover:bg-white/30">Raise a ticket</button>
      </div>
      <div className="border-t border-white/10 p-4 text-[11px] text-brand-200">© {new Date().getFullYear()} {brand.name}</div>
    </div>
  )
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notes, setNotes] = useState(initialNotifications)
  const [dark, setDark] = useLocalStorage('rex-dark', false)
  const location = useLocation()
  const { user, blocked } = useUser()
  const unread = notes.filter((n) => n.unread).length

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    setBellOpen(false)
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  // New staff stay in the walkthrough until it is complete.
  if (blocked) return <Navigate to="/welcome" replace />

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block"><Sidebar /></aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMobileOpen(false)} />
          <div className="animate-fade-up absolute inset-y-0 left-0 w-72">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
            <button onClick={() => setMobileOpen(false)} className="absolute top-5 right-4 rounded-lg p-1 text-white/80 hover:bg-white/10" aria-label="Close menu"><X size={20} /></button>
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-md sm:px-6 dark:border-slate-800 dark:bg-slate-950/80">
          <button onClick={() => setMobileOpen(true)} className="btn-ghost p-2 lg:hidden" aria-label="Open menu"><Menu size={20} /></button>
          <span className="lg:hidden"><Logo className="h-7 w-auto" /></span>

          <button
            onClick={() => setSearchOpen(true)}
            className="ml-auto flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 transition hover:border-brand-300 sm:w-80 lg:ml-0 dark:border-slate-800 dark:bg-slate-900"
          >
            <Search size={16} />
            <span className="hidden flex-1 text-left sm:inline">Search Rex Hub…</span>
            <kbd className="hidden rounded border border-slate-200 bg-white px-1.5 text-[10px] sm:inline dark:border-slate-700 dark:bg-slate-800">⌘K</kbd>
          </button>

          <div className="flex items-center gap-1 lg:ml-auto">
            <button onClick={() => setDark(!dark)} className="btn-ghost p-2" aria-label="Toggle dark mode">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>

            <div className="relative">
              <button onClick={() => { setBellOpen(!bellOpen); setMenuOpen(false) }} className="btn-ghost relative p-2" aria-label={`Notifications (${unread} unread)`}>
                <Bell size={18} />
                {unread > 0 && <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-600 px-1 text-[10px] font-bold text-white">{unread}</span>}
              </button>
              {bellOpen && (
                <div className="card animate-fade-up absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] p-2 shadow-xl">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-semibold">Notifications</span>
                    <button onClick={() => setNotes(notes.map((n) => ({ ...n, unread: false })))} className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-300">Mark all read</button>
                  </div>
                  {notes.map((n) => (
                    <div key={n.id} className="flex gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.unread ? 'bg-accent-600' : 'bg-transparent'}`} />
                      <div className="text-sm"><p>{n.text}</p><p className="mt-0.5 text-xs text-slate-400">{n.time} ago</p></div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => { setMenuOpen(!menuOpen); setBellOpen(false) }} className="ml-1 flex items-center gap-3 rounded-xl p-1 pr-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Account menu">
                <Avatar name={user.name} size="sm" status="online" />
                <span className="hidden text-left leading-tight md:block">
                  <span className="block text-sm font-medium">{user.name}</span>
                  <span className="block text-xs text-slate-500">{user.role}</span>
                </span>
              </button>
              {menuOpen && (
                <div className="card animate-fade-up absolute right-0 mt-2 w-64 p-1.5 shadow-xl">
                  <div className="border-b border-slate-100 px-3 pt-2 pb-3 dark:border-slate-800">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.role} · {user.dept}</p>
                    <PersonaSwitcher className="mt-3" />
                  </div>
                  <button className="btn-ghost w-full justify-start"><Settings size={16} /> Settings</button>
                  <button className="btn-ghost w-full justify-start"><LogOut size={16} /> Sign out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
          <div key={location.pathname} className="animate-fade-up">
            <Outlet />
          </div>
        </main>
      </div>

      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
