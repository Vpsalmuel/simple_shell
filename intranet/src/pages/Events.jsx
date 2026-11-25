import { useMemo, useState } from 'react'
import { CalendarDotsIcon as CalendarDays, CheckIcon as Check, CaretLeftIcon as ChevronLeft, CaretRightIcon as ChevronRight, ClockIcon as Clock, ListBulletsIcon as List, MapPinIcon as MapPin, UsersIcon as Users } from '@phosphor-icons/react'
import { events } from '../data'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useToast } from '../components/Toast'
import PageHeader from '../components/PageHeader'

const types = ['Company', 'Learning', 'Social', 'Business']
const typeTone = {
  Company: 'bg-brand-100 text-brand-800 dark:bg-brand-500/25 dark:text-brand-100',
  Learning: 'bg-accent-100 text-accent-900 dark:bg-accent-600/25 dark:text-accent-200',
  Social: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
  Business: 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300',
}
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const longDate = (s) => new Date(`${s}T00:00`).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })

function useRsvp() {
  const [rsvp, setRsvp] = useLocalStorage('rex-rsvp', [])
  const toast = useToast()
  const toggle = (e) => {
    const going = rsvp.includes(e.id)
    setRsvp(going ? rsvp.filter((x) => x !== e.id) : [...rsvp, e.id])
    toast(going ? `RSVP removed for ${e.title}` : `You're going to ${e.title}`)
  }
  return [rsvp, toggle]
}

function EventCard({ e, going, onToggle }) {
  const d = new Date(`${e.date}T00:00`)
  return (
    <article className="flex gap-4 py-4">
      <div className="w-10 shrink-0 text-center">
        <p className="text-[11px] font-medium text-accent-700 uppercase dark:text-accent-400">{d.toLocaleDateString(undefined, { month: 'short' })}</p>
        <p className="text-lg leading-tight font-semibold text-slate-900 tabular-nums dark:text-white">{d.getDate()}</p>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{e.title}</h3>
        <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{e.desc}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className={`chip ${typeTone[e.type]}`}>{e.type}</span>
          <span className="inline-flex items-center gap-1"><Clock size={12} /> {e.time} to {e.end}</span>
          <span className="inline-flex items-center gap-1"><MapPin size={12} /> {e.place}</span>
          <span className="inline-flex items-center gap-1"><Users size={12} /> {e.host}</span>
        </div>
      </div>
      <button onClick={() => onToggle(e)} aria-pressed={going} className={going ? 'btn h-8 shrink-0 self-start px-3 text-xs text-emerald-700 dark:text-emerald-300' : 'btn-secondary h-8 shrink-0 self-start px-3 text-xs'}>
        {going ? <><Check size={14} /> Going</> : 'RSVP'}
      </button>
    </article>
  )
}

export default function Events() {
  const today = new Date()
  const [view, setView] = useState('month')
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState(ymd(today))
  const [active, setActive] = useState(types)
  const [rsvp, toggleRsvp] = useRsvp()

  const shown = events.filter((e) => active.includes(e.type))
  const byDay = useMemo(() => shown.reduce((m, e) => ({ ...m, [e.date]: [...(m[e.date] ?? []), e] }), {}), [shown])

  // Monday-first grid covering the whole month.
  const first = new Date(month)
  const offset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cells = Array.from({ length: Math.ceil((offset + daysInMonth) / 7) * 7 }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i - offset + 1))

  const upcoming = shown.filter((e) => e.date >= ymd(today)).sort((a, b) => a.date.localeCompare(b.date))
  const dayEvents = byDay[selected] ?? []
  const toggleType = (t) => setActive(active.includes(t) ? active.filter((x) => x !== t) : [...active, t])
  const seg = (on) => `inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-sm transition-colors ${on ? 'bg-white text-slate-900 shadow-[0_1px_2px_rgba(30,45,100,0.12)] dark:bg-slate-700 dark:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`

  return (
    <div>
      <PageHeader
        title="Events"
        description={`${upcoming.length} upcoming. You’re going to ${rsvp.length}.`}
        actions={
          <div className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800" role="group" aria-label="View">
            <button onClick={() => setView('month')} aria-pressed={view === 'month'} className={seg(view === 'month')}><CalendarDays size={16} /> Month</button>
            <button onClick={() => setView('list')} aria-pressed={view === 'list'} className={seg(view === 'list')}><List size={16} /> Upcoming</button>
          </div>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by type">
        <span className="mr-1 text-xs text-slate-500">Show</span>
        {types.map((t) => (
          <button key={t} onClick={() => toggleType(t)} aria-pressed={active.includes(t)} className={`chip h-7 px-2.5 text-xs transition-colors ${active.includes(t) ? typeTone[t] : 'bg-transparent text-slate-500 ring-1 ring-slate-200 dark:ring-slate-700'}`}>{t}</button>
        ))}
      </div>

      {view === 'month' ? (
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <section className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3">
              <h2 className="section-title">{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h2>
              <div className="flex items-center gap-1">
                <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="btn-ghost h-8 w-8 px-0" aria-label="Previous month"><ChevronLeft size={16} /></button>
                <button onClick={() => { setMonth(new Date(today.getFullYear(), today.getMonth(), 1)); setSelected(ymd(today)) }} className="btn-secondary h-8 px-3 text-xs">Today</button>
                <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="btn-ghost h-8 w-8 px-0" aria-label="Next month"><ChevronRight size={16} /></button>
              </div>
            </div>
            {/* Ruled grid: every day is a cell bounded by 1px lines (17 Nov review). */}
            <div className="grid grid-cols-7 border-t border-slate-200 bg-slate-50 text-center text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900/60">
              {weekdays.map((d) => <div key={d} className="border-r border-slate-200 py-2 last:border-r-0 dark:border-slate-800">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 border-t border-slate-200 dark:border-slate-800">
              {cells.map((d, i) => {
                const key = ymd(d)
                const inMonth = d.getMonth() === month.getMonth()
                const evs = byDay[key] ?? []
                const isToday = key === ymd(today)
                const isSel = key === selected
                return (
                  <button
                    key={key}
                    onClick={() => setSelected(key)}
                    aria-label={`${longDate(key)}${evs.length ? `, ${evs.length} event${evs.length > 1 ? 's' : ''}` : ''}`}
                    aria-pressed={isSel}
                    className={`relative flex min-h-16 flex-col items-stretch gap-1 border-slate-200 p-1.5 text-left transition-colors sm:min-h-24 dark:border-slate-800 ${(i + 1) % 7 ? 'border-r' : ''} ${i < cells.length - 7 ? 'border-b' : ''} ${isSel ? 'bg-brand-50 dark:bg-brand-500/10' : inMonth ? 'hover:bg-slate-50 dark:hover:bg-slate-800/50' : 'bg-slate-50/70 dark:bg-slate-950/40'}`}
                  >
                    {isSel && <span className="pointer-events-none absolute inset-0 ring-2 ring-brand-500 ring-inset dark:ring-brand-400" />}
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs tabular-nums ${isToday ? 'bg-accent-700 font-semibold text-white' : inMonth ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500'}`}>{d.getDate()}</span>
                    {evs.slice(0, 2).map((e) => <span key={e.id} className={`hidden truncate rounded px-1.5 py-0.5 text-[11px] font-medium sm:block ${typeTone[e.type]}`}>{e.title}</span>)}
                    {evs.length > 0 && <span className="flex gap-0.5 px-1 sm:hidden">{evs.map((e) => <i key={e.id} className={`h-1.5 w-1.5 rounded-full ${typeTone[e.type]}`} />)}</span>}
                    {evs.length > 2 && <span className="hidden px-1 text-[11px] text-slate-500 sm:block">+{evs.length - 2} more</span>}
                  </button>
                )
              })}
            </div>
          </section>
          <section aria-live="polite">
            <h2 className="section-title">{longDate(selected)}</h2>
            {dayEvents.length ? (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">{dayEvents.map((e) => <EventCard key={e.id} e={e} going={rsvp.includes(e.id)} onToggle={toggleRsvp} />)}</div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Nothing scheduled. Pick a day with events to see them here.</p>
            )}
          </section>
        </div>
      ) : (
        <div className="card divide-y divide-slate-100 px-5 dark:divide-slate-800">
          {upcoming.map((e) => <EventCard key={e.id} e={e} going={rsvp.includes(e.id)} onToggle={toggleRsvp} />)}
          {upcoming.length === 0 && <p className="py-10 text-center text-sm text-slate-500">No upcoming events for the selected types.</p>}
        </div>
      )}
    </div>
  )
}
