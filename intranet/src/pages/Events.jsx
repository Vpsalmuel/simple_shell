import { useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Clock, List, MapPin, Users } from 'lucide-react'
import { events } from '../data'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useToast } from '../components/Toast'

const types = ['Company', 'Learning', 'Social', 'Business']
const typeTone = {
  Company: 'bg-brand-100 text-brand-800 dark:bg-brand-500/25 dark:text-brand-100',
  Learning: 'bg-accent-100 text-accent-700 dark:bg-accent-600/25 dark:text-accent-400',
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
  return (
    <article className="card flex gap-4 p-4">
      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-700 text-white">
        <span className="text-[10px] font-semibold uppercase">{new Date(`${e.date}T00:00`).toLocaleDateString(undefined, { month: 'short' })}</span>
        <span className="font-display text-xl leading-none font-extrabold">{new Date(`${e.date}T00:00`).getDate()}</span>
      </div>
      <div className="min-w-0 flex-1">
        <span className={`chip ${typeTone[e.type]}`}>{e.type}</span>
        <h3 className="mt-1.5 font-semibold">{e.title}</h3>
        <p className="mt-1 text-sm text-slate-500">{e.desc}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1"><Clock size={12} /> {e.time}–{e.end}</span>
          <span className="inline-flex items-center gap-1"><MapPin size={12} /> {e.place}</span>
          <span className="inline-flex items-center gap-1"><Users size={12} /> {e.host}</span>
        </div>
      </div>
      <button onClick={() => onToggle(e)} className={`btn shrink-0 self-start px-3 py-1.5 ${going ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'border border-slate-200 hover:border-brand-400 dark:border-slate-700'}`}>
        {going ? 'Going ✓' : 'RSVP'}
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">Events</h1>
          <p className="mt-1 text-sm text-slate-500">{upcoming.length} upcoming · you’re going to {rsvp.length}</p>
        </div>
        <div className="flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
          <button onClick={() => setView('month')} className={`btn px-3 py-1.5 ${view === 'month' ? 'bg-brand-700 text-white' : 'text-slate-600 dark:text-slate-300'}`}><CalendarDays size={16} /> Month</button>
          <button onClick={() => setView('list')} className={`btn px-3 py-1.5 ${view === 'list' ? 'bg-brand-700 text-white' : 'text-slate-600 dark:text-slate-300'}`}><List size={16} /> Upcoming</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
        {types.map((t) => (
          <button key={t} onClick={() => toggleType(t)} aria-pressed={active.includes(t)} className={`chip px-3 py-1.5 text-sm transition ${active.includes(t) ? typeTone[t] : 'bg-white text-slate-400 ring-1 ring-slate-200 line-through dark:bg-slate-900 dark:ring-slate-700'}`}>{t}</button>
        ))}
      </div>

      {view === 'month' ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_360px] [&>*]:min-w-0">
          <section className="card p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h2>
              <div className="flex gap-1">
                <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="btn-ghost p-2" aria-label="Previous month"><ChevronLeft size={18} /></button>
                <button onClick={() => { setMonth(new Date(today.getFullYear(), today.getMonth(), 1)); setSelected(ymd(today)) }} className="btn-ghost px-3 py-1.5 text-xs">Today</button>
                <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="btn-ghost p-2" aria-label="Next month"><ChevronRight size={18} /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
              {weekdays.map((d) => <div key={d} className="py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((d) => {
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
                    className={`flex min-h-16 flex-col items-stretch gap-1 rounded-xl p-1.5 text-left transition sm:min-h-24 ${isSel ? 'bg-brand-50 ring-2 ring-brand-500 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'} ${inMonth ? '' : 'opacity-40'}`}
                  >
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${isToday ? 'bg-accent-600 text-white' : ''}`}>{d.getDate()}</span>
                    {evs.slice(0, 2).map((e) => <span key={e.id} className={`hidden truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium sm:block ${typeTone[e.type]}`}>{e.title}</span>)}
                    {evs.length > 0 && <span className="flex gap-0.5 sm:hidden">{evs.map((e) => <i key={e.id} className={`h-1.5 w-1.5 rounded-full ${typeTone[e.type]}`} />)}</span>}
                    {evs.length > 2 && <span className="hidden text-[11px] text-slate-500 sm:block">+{evs.length - 2} more</span>}
                  </button>
                )
              })}
            </div>
          </section>
          <section aria-live="polite">
            <h2 className="mb-3 text-sm font-semibold text-slate-500">{longDate(selected)}</h2>
            {dayEvents.length ? (
              <div className="space-y-3">{dayEvents.map((e) => <EventCard key={e.id} e={e} going={rsvp.includes(e.id)} onToggle={toggleRsvp} />)}</div>
            ) : (
              <div className="card p-6 text-center text-sm text-slate-500">Nothing scheduled. Pick a highlighted day to see its events.</div>
            )}
          </section>
        </div>
      ) : (
        <div className="stagger space-y-3">
          {upcoming.map((e) => <EventCard key={e.id} e={e} going={rsvp.includes(e.id)} onToggle={toggleRsvp} />)}
          {upcoming.length === 0 && <div className="card p-10 text-center text-sm text-slate-500">No upcoming events for the selected types.</div>}
        </div>
      )}
    </div>
  )
}
