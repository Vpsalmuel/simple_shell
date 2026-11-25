import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import { BellIcon as Bell, CameraIcon as Camera, CompassIcon as Compass, ListIcon as Menu, MoonIcon as Moon, MagnifyingGlassIcon as Search, SunIcon as Sun, XIcon as X, SignOutIcon as LogOut } from '@phosphor-icons/react'
import Logo from './Logo'
import Avatar from './Avatar'
import CommandPalette from './CommandPalette'
import PersonaSwitcher from './PersonaSwitcher'
import RexAI from './RexAI'
import GuidedTour from './GuidedTour'
import CelebrationPopup from './CelebrationPopup'
import { useToast } from './Toast'
import { useUser } from '../context/UserContext'
import { navFor } from '../config/nav'
import { notifications as initialNotifications } from '../data'
import { useLocalStorage } from '../hooks/useLocalStorage'

// Shrinks an uploaded photo to a 192px square JPEG so it stays small in storage.
function toAvatar(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const s = 192
      const c = document.createElement('canvas')
      c.width = c.height = s
      const side = Math.min(img.width, img.height)
      c.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, s, s)
      URL.revokeObjectURL(img.src)
      resolve(c.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

function Sidebar({ onNavigate }) {
  const { user } = useUser()
  return (
    <div className="flex h-full flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-14 items-center px-5">
        <Logo className="h-7 w-auto" />
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pt-3 pb-6" aria-label="Main">
        {navFor(user).map((group) => (
          <div key={group.label}>
            <p className="px-2.5 pb-1.5 text-xs font-medium text-slate-500">{group.label}</p>
            <div className="space-y-px">
              {group.items.map(({ to, label, icon: Ico, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-sm transition-colors ${isActive ? 'bg-brand-50 font-medium text-brand-800 dark:bg-brand-500/15 dark:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Ico size={17} weight={isActive ? 'fill' : 'regular'} className={isActive ? 'text-brand-700 dark:text-brand-300' : 'text-slate-500 dark:text-slate-400'} />
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-slate-200 px-5 py-3 text-xs text-slate-500 dark:border-slate-800">
        IT help: Ext. 999, 7am to 7pm
      </div>
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
  const toast = useToast()
  const fileRef = useRef(null)
  const { user, blocked, ready, signedIn, signOut, ssoConfigured, setPhoto } = useUser()
  // First visit per person: show the guided tour once.
  const [toured, setToured] = useLocalStorage(`rex-tour-${user.id}`, false)
  const [tourOpen, setTourOpen] = useState(false)
  useEffect(() => {
    if (!toured && !blocked) {
      const t = setTimeout(() => setTourOpen(true), 600)
      return () => clearTimeout(t)
    }
  }, [toured, blocked])
  const closeTour = useCallback(() => { setTourOpen(false); setToured(true) }, [setToured])
  const unread = notes.filter((n) => n.unread).length

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  // Other pages can open search with a 'rex:search' event.
  useEffect(() => {
    const open = () => setSearchOpen(true)
    window.addEventListener('rex:search', open)
    return () => window.removeEventListener('rex:search', open)
  }, [])

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

  const onPhoto = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) return toast('Choose an image file (JPG or PNG).')
    try {
      setPhoto(await toAvatar(file))
      toast('Profile photo updated')
    } catch {
      toast('That image could not be read. Try another one.')
    }
  }

  // New staff stay in the walkthrough until it is complete.
  if (!ready) return <div className="flex min-h-[100dvh] items-center justify-center text-sm text-slate-500">Signing you in…</div>
  if (!signedIn) return <Navigate to="/login" replace />
  if (blocked) return <Navigate to="/welcome" replace />

  return (
    <div className="min-h-[100dvh]">
      <aside data-tour="nav" className="fixed inset-y-0 left-0 z-30 hidden w-60 lg:block"><Sidebar /></aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileOpen(false)} />
          <div className="animate-fade-up absolute inset-y-0 left-0 w-72 shadow-xl">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
            <button onClick={() => setMobileOpen(false)} className="btn-ghost absolute top-2.5 right-2 h-9 w-9 px-0" aria-label="Close menu"><X size={18} /></button>
          </div>
        </div>
      )}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-slate-200 bg-slate-50/85 px-4 backdrop-blur-md sm:px-6 lg:px-10 dark:border-slate-800 dark:bg-slate-950/85">
          <button data-tour="menu" onClick={() => setMobileOpen(true)} className="btn-ghost h-9 w-9 px-0 lg:hidden" aria-label="Open menu"><Menu size={20} /></button>
          <span className="lg:hidden"><Logo className="h-6 w-auto" /></span>

          <button
            data-tour="search"
            onClick={() => setSearchOpen(true)}
            aria-label="Search Rex Hub"
            className="ml-auto flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-500 transition-colors hover:border-slate-300 sm:w-72 lg:ml-0 lg:w-96 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600"
          >
            <Search size={16} />
            <span className="hidden flex-1 text-left sm:inline">Search Rex Hub</span>
            <kbd className="hidden rounded border border-slate-200 px-1.5 font-sans text-[11px] sm:inline dark:border-slate-600 dark:text-slate-300">Ctrl K</kbd>
          </button>

          <div className="flex items-center gap-1 lg:ml-auto">
            <button onClick={() => setDark(!dark)} className="btn-ghost h-9 w-9 px-0" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>

            <div className="relative">
              <button onClick={() => { setBellOpen(!bellOpen); setMenuOpen(false) }} className="btn-ghost relative h-9 w-9 px-0" aria-label={`Notifications (${unread} unread)`}>
                <Bell size={18} />
                {unread > 0 && <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-700 px-1 text-[10px] font-semibold text-white">{unread}</span>}
              </button>
              {bellOpen && (
                <div className="card animate-fade-up absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] p-1.5 shadow-[0_16px_40px_-12px_rgba(30,45,100,0.25)]">
                  <div className="flex items-center justify-between px-2.5 py-2">
                    <span className="section-title">Notifications</span>
                    <button onClick={() => setNotes(notes.map((n) => ({ ...n, unread: false })))} className="link text-xs">Mark all read</button>
                  </div>
                  {notes.map((n) => (
                    <div key={n.id} className={`rounded-lg px-2.5 py-2 text-sm ${n.unread ? 'bg-brand-50/70 dark:bg-brand-500/10' : ''}`}>
                      <p>{n.text}</p><p className="mt-0.5 text-xs text-slate-500">{n.time} ago</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button data-tour="profile" onClick={() => { setMenuOpen(!menuOpen); setBellOpen(false) }} className="ml-1 flex items-center gap-2.5 rounded-lg p-1 pr-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Account menu">
                <Avatar name={user.name} src={user.photo} size="sm" />
                <span className="hidden text-left leading-tight md:block">
                  <span className="block text-sm font-medium">{user.name}</span>
                  <span className="block text-xs text-slate-500">{user.dept}</span>
                </span>
              </button>
              {menuOpen && (
                <div className="card animate-fade-up absolute right-0 mt-2 w-72 p-1.5 shadow-[0_16px_40px_-12px_rgba(30,45,100,0.25)]">
                  <div className="flex items-center gap-3 border-b border-slate-100 px-2.5 pt-2 pb-3 dark:border-slate-800">
                    <Avatar name={user.name} src={user.photo} size="md" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-slate-500">{user.role}</p>
                    </div>
                  </div>
                  {!ssoConfigured && <div className="border-b border-slate-100 px-2.5 py-2.5 dark:border-slate-800"><PersonaSwitcher /></div>}
                  <div className="pt-1">
                    <button onClick={() => fileRef.current?.click()} className="btn-ghost w-full justify-start"><Camera size={16} /> Change profile photo</button>
                    <button onClick={() => { setMenuOpen(false); setTourOpen(true) }} className="btn-ghost w-full justify-start"><Compass size={16} /> Take the tour</button>
                    <button onClick={() => { setMenuOpen(false); signOut() }} className="btn-ghost w-full justify-start"><LogOut size={16} /> Sign out</button>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPhoto} aria-label="Upload profile photo" />
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div key={location.pathname} className="animate-fade-up">
            <Outlet />
          </div>
        </main>
      </div>

      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
      <RexAI key={user.id} />
      <GuidedTour open={tourOpen} onClose={closeTour} />
      <CelebrationPopup />
    </div>
  )
}
