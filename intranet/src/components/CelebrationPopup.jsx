import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CakeIcon as Cake, ConfettiIcon as PartyPopper, XIcon as X } from '@phosphor-icons/react'
import { useUser } from '../context/UserContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { upcomingCelebrations, celebrationLabel } from '../lib/celebrations'
import { whenLabel, shortDate } from '../lib/dates'
import Avatar from './Avatar'
import Confetti from './Confetti'
import Portal from './Portal'

// Birthday and anniversary pop-up with confetti (20 Aug and 17 Nov reviews).
// Shows once a day per person, for celebrations today and in the next three days.
export default function CelebrationPopup() {
  const { user } = useUser()
  const day = new Date().toDateString()
  const [seen, setSeen] = useLocalStorage(`rex-celebrated-${user.id}`, '')
  const [open, setOpen] = useState(false)
  const list = upcomingCelebrations(3).slice(0, 4)
  const mine = list.find((c) => c.name === user.name && c.days === 0)

  useEffect(() => {
    if (seen === day || list.length === 0) return
    const t = setTimeout(() => setOpen(true), 900)
    return () => clearTimeout(t)
  }, [seen, day, list.length])

  const close = () => { setOpen(false); setSeen(day) }
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
  if (!open) return null

  const heading = mine ? `Happy ${mine.kind === 'birthday' ? 'birthday' : 'work anniversary'}, ${user.firstName}!` : list.some((c) => c.days === 0) ? 'Celebrating today' : 'Coming up this week'
  return (
    <Portal>
      <Confetti />
      <div className="fixed inset-0 z-[65] flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="celebrate-title">
        <div className="absolute inset-0 bg-slate-900/30" onClick={close} />
        <div className="card animate-pop relative w-full max-w-sm p-6 shadow-[0_24px_60px_-20px_rgba(30,45,100,0.45)]">
          <button onClick={close} className="btn-ghost absolute top-3 right-3 h-8 w-8 px-0" aria-label="Close"><X size={16} /></button>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-700 dark:bg-accent-600/20 dark:text-accent-300"><PartyPopper size={22} weight="duotone" /></span>
          <h2 id="celebrate-title" className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{heading}</h2>
          <ul className="mt-4 space-y-3">
            {list.map((c) => (
              <li key={c.kind + c.name} className="flex items-center gap-3">
                <Avatar name={c.name} size="md" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-900 dark:text-white">{c.name}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">{c.kind === 'birthday' && <Cake size={12} />}{celebrationLabel(c)}, {c.days === 0 ? 'today' : `${whenLabel(c.days).toLowerCase()} (${shortDate(c.date)})`}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-2">
            <Link to="/celebrations" onClick={close} className="btn-primary flex-1">Send wishes</Link>
            <button onClick={close} className="btn-secondary">Later</button>
          </div>
        </div>
      </div>
    </Portal>
  )
}
