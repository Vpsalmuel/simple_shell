import { useState } from 'react'
import { ArrowUpRightIcon as ArrowUpRight, CalendarDotsIcon as CalendarDays, CheckIcon as Check, LockIcon as Lock, MapPinIcon as MapPin, PhoneIcon as Phone, TrophyIcon as Trophy, UsersIcon as Users } from '@phosphor-icons/react'
import { people } from '../data'
import { gymChampion, nextHike, reap, wellbeingChecklist, wellbeingTabs } from '../data/culture'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useToast } from '../components/Toast'
import Avatar from '../components/Avatar'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'

const todayKey = () => new Date().toISOString().slice(0, 10)

function Reap() {
  const toast = useToast()
  const open = () => (reap.url ? window.open(reap.url, '_blank', 'noopener') : toast('REAP link coming soon. HCM will share it.'))
  return (
    <section className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-700 text-white dark:bg-brand-500"><Icon name="Brain" size={22} /></span>
      <div className="min-w-0 flex-1">
        <h2 className="section-title">{reap.name}</h2>
        <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{reap.text}</p>
      </div>
      <button onClick={open} className="btn-primary shrink-0">Open REAP <ArrowUpRight size={14} /></button>
    </section>
  )
}

function GymChampion() {
  const person = people.find((p) => p.name === gymChampion.name)
  const month = new Date(`${gymChampion.month}-01T00:00`).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
  return (
    <section className="card p-5">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Gym Champion of the month</h2>
        <Trophy size={18} weight="fill" className="text-accent-600" />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Avatar name={gymChampion.name} size="lg" />
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-slate-900 dark:text-white">{gymChampion.name}</p>
          <p className="truncate text-xs text-slate-500">{person?.role}, {month}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{gymChampion.stat}.</p>
      <p className="mt-2 text-sm text-slate-700 italic dark:text-slate-300">“{gymChampion.quote}”</p>
    </section>
  )
}

function Checklist() {
  // One list per day, so it starts fresh each morning.
  const [done, setDone] = useLocalStorage(`rex-wellbeing-${todayKey()}`, [])
  const toggle = (id) => setDone(done.includes(id) ? done.filter((x) => x !== id) : [...done, id])
  return (
    <section className="card p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="section-title">Today’s checklist</h2>
        <span className="text-xs text-slate-500 tabular-nums">{done.length} of {wellbeingChecklist.length}</span>
      </div>
      <ul className="mt-3 space-y-1">
        {wellbeingChecklist.map((c) => {
          const on = done.includes(c.id)
          return (
            <li key={c.id}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <input type="checkbox" checked={on} onChange={() => toggle(c.id)} className="peer sr-only" />
                <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors peer-focus-visible:ring-3 peer-focus-visible:ring-brand-100 ${on ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>{on && <Check size={11} weight="bold" />}</span>
                <span className={`text-sm ${on ? 'text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>{c.text}</span>
              </label>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Hike() {
  const toast = useToast()
  const [joined, setJoined] = useLocalStorage(`rex-hike-${nextHike.date}`, false)
  const slots = nextHike.slots - (joined ? 1 : 0)
  const date = new Date(`${nextHike.date}T00:00`).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })
  return (
    <section className="card p-5">
      <p className="text-xs font-medium text-slate-500">Monthly hiking challenge</p>
      <h2 className="mt-0.5 section-title">{nextHike.place}</h2>
      <div className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
        <p className="flex items-center gap-2"><CalendarDays size={16} className="text-slate-400" />{date}, {nextHike.time}</p>
        <p className="flex items-center gap-2"><MapPin size={16} className="text-slate-400" />Meet at the main gate</p>
        <p className="flex items-center gap-2"><Users size={16} className="text-slate-400" /><span><b className="font-medium text-slate-900 tabular-nums dark:text-white">{slots}</b> places left</span></p>
      </div>
      <button onClick={() => { setJoined(!joined); toast(joined ? 'You’ve left the hike' : 'You’re on the hike list') }} aria-pressed={joined} className={`mt-4 w-full ${joined ? 'btn-secondary text-emerald-700 dark:text-emerald-300' : 'btn-primary'}`}>{joined ? <><Check size={16} /> You’re going</> : 'Join the hike'}</button>
    </section>
  )
}

export default function Wellbeing() {
  const [tab, setTab] = useState(wellbeingTabs[0].id)
  const t = wellbeingTabs.find((x) => x.id === tab)
  return (
    <div>
      <PageHeader title="Health & Wellbeing" description="Medical cover, confidential support and ways to stay active." />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          <Reap />
          <section className="card">
            <nav className="flex gap-6 overflow-x-auto border-b border-slate-200 px-5 dark:border-slate-800" role="tablist">
              {wellbeingTabs.map((x) => (
                <button key={x.id} role="tab" aria-selected={tab === x.id} onClick={() => setTab(x.id)} className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 py-3.5 text-sm font-medium transition-colors ${tab === x.id ? 'border-brand-700 text-slate-900 dark:border-brand-300 dark:text-white' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}><Icon name={x.icon} size={16} />{x.label}</button>
              ))}
            </nav>
            <div key={t.id} className="animate-fade-up p-6" role="tabpanel">
              <h2 className="text-[17px] font-semibold text-slate-900 dark:text-white">{t.title}</h2>
              <p className="mt-1 text-[15px] text-slate-600 dark:text-slate-300">{t.intro}</p>
              {t.id === 'mind' && <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300"><Lock size={12} /> Private: not shared with HR or your manager</p>}
              <dl className="mt-6 divide-y divide-slate-100 border-y border-slate-100 dark:divide-slate-800 dark:border-slate-800">
                {t.points.map(([h, p]) => (
                  <div key={h} className="grid gap-1 py-3.5 sm:grid-cols-[13rem_1fr] sm:gap-6">
                    <dt className="text-sm font-medium text-slate-900 dark:text-white">{h}</dt>
                    <dd className="text-sm text-slate-600 dark:text-slate-300">{p}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Phone size={18} className="text-slate-400" />
                <span className="text-sm text-slate-500">{t.contact.label}:</span>
                <span className="text-sm font-semibold text-slate-900 select-all dark:text-white">{t.contact.value}</span>
                <span className="text-xs text-slate-500">{t.contact.note}</span>
              </div>
            </div>
          </section>
        </div>
        <aside className="space-y-6"><GymChampion /><Checklist /><Hike /></aside>
      </div>
    </div>
  )
}
