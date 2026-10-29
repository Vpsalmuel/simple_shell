import { useState } from 'react'
import { CalendarDays, Check, Lock, MapPin, Phone, Users } from 'lucide-react'
import { nextHike, wellbeingChecklist, wellbeingTabs } from '../data/culture'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useToast } from '../components/Toast'
import Icon from '../components/Icon'
import SectionHeader from '../components/SectionHeader'

const todayKey = () => new Date().toISOString().slice(0, 10)

function Checklist() {
  // One list per day, so it starts fresh each morning.
  const [done, setDone] = useLocalStorage(`rex-wellbeing-${todayKey()}`, [])
  const toggle = (id) => setDone(done.includes(id) ? done.filter((x) => x !== id) : [...done, id])
  const pct = Math.round((done.length / wellbeingChecklist.length) * 100)
  return (
    <section className="card p-5">
      <SectionHeader title="Today’s wellbeing checklist" subtitle="Small habits, reset every morning" action={<span className="font-display text-2xl font-extrabold tabular-nums text-accent-600">{pct}%</span>} />
      <div className="mb-4 h-2 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-2 rounded-full bg-emerald-500 transition-[width] duration-500" style={{ width: `${pct}%` }} /></div>
      <ul className="space-y-2">
        {wellbeingChecklist.map((c) => {
          const on = done.includes(c.id)
          return (
            <li key={c.id}>
              <label className={`flex cursor-pointer items-start gap-3 rounded-xl p-3 transition ${on ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <input type="checkbox" checked={on} onChange={() => toggle(c.id)} className="peer sr-only" />
                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition peer-focus-visible:ring-4 peer-focus-visible:ring-brand-100 ${on ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>{on && <Check size={14} />}</span>
                <span className={`text-sm ${on ? 'text-slate-500 line-through' : ''}`}>{c.text}</span>
              </label>
            </li>
          )
        })}
      </ul>
      {pct === 100 && <p className="animate-fade-up mt-3 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">All done for today. Well looked after. 🌿</p>}
    </section>
  )
}

function Hike() {
  const toast = useToast()
  const [joined, setJoined] = useLocalStorage(`rex-hike-${nextHike.date}`, false)
  const slots = nextHike.slots - (joined ? 1 : 0)
  const date = new Date(`${nextHike.date}T00:00`).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })
  return (
    <section className="card overflow-hidden">
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-5 text-white">
        <p className="text-xs font-semibold tracking-wider text-emerald-100 uppercase">Monthly hiking challenge</p>
        <p className="mt-1 font-display text-xl font-bold">{nextHike.place}</p>
      </div>
      <div className="space-y-2 p-5 text-sm">
        <p className="flex items-center gap-2"><CalendarDays size={16} className="text-slate-400" />{date}, {nextHike.time}</p>
        <p className="flex items-center gap-2"><MapPin size={16} className="text-slate-400" />Meet at the main gate</p>
        <p className="flex items-center gap-2"><Users size={16} className="text-slate-400" /><b className="tabular-nums">{slots}</b> places left</p>
        <button onClick={() => { setJoined(!joined); toast(joined ? 'You’ve left the hike' : 'You’re on the hike list') }} className={`btn mt-2 w-full ${joined ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-brand-700 text-white hover:bg-brand-800'}`}>{joined ? 'You’re going ✓' : 'Join the hike'}</button>
      </div>
    </section>
  )
}

export default function Wellbeing() {
  const [tab, setTab] = useState(wellbeingTabs[0].id)
  const t = wellbeingTabs.find((x) => x.id === tab)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">Health & Wellbeing</h1>
        <p className="mt-1 text-sm text-slate-500">Medical cover, confidential support and ways to stay active.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px] [&>*]:min-w-0">
        <section className="card overflow-hidden">
          <div className="flex gap-1 overflow-x-auto border-b border-slate-100 p-2 dark:border-slate-800" role="tablist">
            {wellbeingTabs.map((x) => (
              <button key={x.id} role="tab" aria-selected={tab === x.id} onClick={() => setTab(x.id)} className={`btn shrink-0 px-3 py-2 ${tab === x.id ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}><Icon name={x.icon} size={16} />{x.label}</button>
            ))}
          </div>
          <div key={t.id} className="animate-fade-up p-6" role="tabpanel">
            <h2 className="text-xl font-bold">{t.title}</h2>
            <p className="mt-1 text-slate-600 dark:text-slate-300">{t.intro}</p>
            {t.id === 'mind' && <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"><Lock size={12} /> Private: not shared with HR</p>}
            <ul className="mt-5 grid gap-3 md:grid-cols-3">
              {t.points.map(([h, p]) => <li key={h} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60"><p className="font-semibold">{h}</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{p}</p></li>)}
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600 dark:bg-accent-700/20"><Phone size={18} /></span>
              <span className="min-w-0 flex-1"><span className="block text-xs text-slate-500">{t.contact.label}</span><span className="block font-display text-lg font-bold select-all">{t.contact.value}</span></span>
              <span className="text-xs text-slate-500">{t.contact.note}</span>
            </div>
          </div>
        </section>
        <div className="space-y-6"><Checklist /><Hike /></div>
      </div>
    </div>
  )
}
