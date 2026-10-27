import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, Clock, Heart, MapPin, MessageCircle, Sparkles, Trophy } from 'lucide-react'
import { announcements, events, kpis, kudos as initialKudos, news, people, poll, quickLinks } from '../data'
import { currentUser } from '../config/brand'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useToast } from '../components/Toast'
import Avatar from '../components/Avatar'
import Icon from '../components/Icon'
import Modal from '../components/Modal'
import SectionHeader from '../components/SectionHeader'

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

function Hero() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const a = announcements[i]

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setI((x) => (x + 1) % announcements.length), 6000)
    return () => clearInterval(t)
  }, [paused])

  const toneChip = { brand: 'bg-white/15 text-white', warn: 'bg-accent-500 text-white', accent: 'bg-emerald-400/90 text-emerald-950' }

  return (
    <section
      className="relative overflow-hidden rounded-3xl bg-brand-700 p-6 text-white sm:p-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute -top-24 -right-24 hidden h-72 w-72 sm:block rounded-full border-[28px] border-accent-600/80" />
      <div className="pointer-events-none absolute -right-10 -bottom-32 h-64 w-64 rounded-full bg-brand-500/40 blur-2xl" />

      <p className="text-sm text-brand-200">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{greeting()}, {currentUser.firstName} 👋</h1>

      <div key={a.id} className="animate-fade-up relative mt-6 max-w-xl">
        <span className={`chip ${toneChip[a.tone]}`}>{a.tag}</span>
        <h2 className="mt-3 text-lg font-semibold sm:text-xl">{a.title}</h2>
        <p className="mt-1 text-sm text-brand-100">{a.body}</p>
        <button className="btn mt-4 bg-accent-600 text-white hover:bg-accent-700">{a.cta} <ArrowRight size={16} /></button>
      </div>

      <div className="relative mt-6 flex items-center gap-3">
        <button onClick={() => setI((i - 1 + announcements.length) % announcements.length)} className="rounded-full bg-white/10 p-1.5 hover:bg-white/20" aria-label="Previous announcement"><ChevronLeft size={16} /></button>
        <div className="flex gap-1.5">
          {announcements.map((x, idx) => (
            <button key={x.id} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-6 bg-accent-500' : 'w-1.5 bg-white/40'}`} aria-label={`Announcement ${idx + 1}`} />
          ))}
        </div>
        <button onClick={() => setI((i + 1) % announcements.length)} className="rounded-full bg-white/10 p-1.5 hover:bg-white/20" aria-label="Next announcement"><ChevronRight size={16} /></button>
      </div>
    </section>
  )
}

function Kpis() {
  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {kpis.map((k) => {
        const good = (k.delta < 0 && k.good === 'down') || (k.delta > 0 && k.good === 'up')
        const Arrow = k.delta < 0 ? ArrowDownRight : ArrowUpRight
        return (
          <div key={k.label} className="card card-hover p-4 sm:p-5">
            <p className="text-xs font-medium text-slate-500 sm:text-sm">{k.label}</p>
            <p className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">{k.value}</p>
            <p className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${good ? 'text-emerald-600' : 'text-rose-600'}`}>
              <Arrow size={14} /> {Math.abs(k.delta)}% <span className="font-normal text-slate-400">{k.hint}</span>
            </p>
          </div>
        )
      })}
    </section>
  )
}

function QuickLinks() {
  return (
    <section className="card p-5">
      <SectionHeader title="Quick links" />
      <div className="grid grid-cols-3 gap-3">
        {quickLinks.map((q) => (
          <a key={q.label} href={q.href} className="group flex flex-col items-center gap-2 rounded-xl p-3 text-center text-xs font-medium transition hover:bg-brand-50 dark:hover:bg-slate-800">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-700 group-hover:text-white dark:bg-slate-800 dark:text-brand-200">
              <Icon name={q.icon} size={20} />
            </span>
            {q.label}
          </a>
        ))}
      </div>
    </section>
  )
}

function NewsFeed() {
  const [liked, setLiked] = useLocalStorage('rex-liked', [])
  const [filter, setFilter] = useState('All')
  const cats = ['All', ...new Set(news.map((n) => n.category))]
  const shown = filter === 'All' ? news : news.filter((n) => n.category === filter)
  const toggle = (id) => setLiked(liked.includes(id) ? liked.filter((x) => x !== id) : [...liked, id])

  return (
    <section className="card p-5">
      <SectionHeader title="Company news" action={<a href="#" className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-300">View all</a>} />
      <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
        {cats.map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={`chip shrink-0 px-3 py-1 text-sm transition ${filter === c ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}`}>{c}</button>
        ))}
      </div>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {shown.map((n) => {
          const isLiked = liked.includes(n.id)
          return (
            <li key={n.id} className="animate-fade-up flex gap-4 py-4 first:pt-0 last:pb-0">
              <div className="hidden h-20 w-28 shrink-0 items-end rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 p-2 sm:flex">
                <span className="chip bg-white/15 text-white">{n.category}</span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="chip mb-1 bg-brand-50 text-brand-700 sm:hidden dark:bg-slate-800 dark:text-brand-200">{n.category}</span>
                <a href="#" className="block font-semibold text-slate-900 hover:text-brand-600 dark:text-white">{n.title}</a>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{n.excerpt}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                  <span>{n.author}</span>
                  <span className="inline-flex items-center gap-1"><Clock size={12} /> {n.readMins} min read</span>
                  <button onClick={() => toggle(n.id)} className={`inline-flex items-center gap-1 transition ${isLiked ? 'text-accent-600' : 'hover:text-accent-600'}`} aria-pressed={isLiked}>
                    <Heart size={14} className={isLiked ? 'fill-current' : ''} /> {n.likes + (isLiked ? 1 : 0)}
                  </button>
                  <span className="inline-flex items-center gap-1"><MessageCircle size={14} /> {n.comments}</span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Events() {
  const [rsvp, setRsvp] = useLocalStorage('rex-rsvp', [])
  const toast = useToast()
  const toggle = (e) => {
    const going = rsvp.includes(e.id)
    setRsvp(going ? rsvp.filter((x) => x !== e.id) : [...rsvp, e.id])
    toast(going ? `RSVP removed for ${e.title}` : `You're going to ${e.title}`)
  }
  return (
    <section className="card p-5">
      <SectionHeader title="Upcoming events" action={<CalendarDays size={18} className="text-slate-400" />} />
      <ul className="space-y-3">
        {events.map((e) => {
          const d = new Date(e.date)
          const going = rsvp.includes(e.id)
          return (
            <li key={e.id} className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-accent-50 text-accent-700 dark:bg-accent-700/20 dark:text-accent-400">
                <span className="text-[10px] font-semibold uppercase">{d.toLocaleDateString(undefined, { month: 'short' })}</span>
                <span className="text-base leading-none font-bold">{d.getDate()}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{e.title}</p>
                <p className="flex items-center gap-1 truncate text-xs text-slate-500"><Clock size={11} /> {e.time} · <MapPin size={11} /> {e.place}</p>
              </div>
              <button onClick={() => toggle(e)} className={`chip shrink-0 px-3 py-1 transition ${going ? 'bg-emerald-100 text-emerald-700' : 'border border-slate-200 text-slate-600 hover:border-brand-400 dark:border-slate-700 dark:text-slate-300'}`}>
                {going ? 'Going ✓' : 'RSVP'}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Kudos() {
  const [items, setItems] = useState(initialKudos)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ to: people[1].name, value: 'Customer first', message: '' })
  const toast = useToast()

  const submit = (e) => {
    e.preventDefault()
    if (!form.message.trim()) return
    setItems([{ id: Date.now(), from: `${currentUser.firstName} ${currentUser.lastName}`, ...form }, ...items])
    setForm({ ...form, message: '' })
    setOpen(false)
    toast(`Kudos sent to ${form.to}`)
  }

  return (
    <section className="card p-5">
      <SectionHeader
        title="Kudos wall"
        subtitle="Celebrate great work"
        action={<button onClick={() => setOpen(true)} className="btn bg-accent-600 px-3 py-1.5 text-white hover:bg-accent-700"><Sparkles size={14} /> Give kudos</button>}
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.slice(0, 6).map((k) => (
          <figure key={k.id} className="animate-fade-up rounded-2xl border border-slate-100 bg-gradient-to-br from-accent-50 to-white p-4 dark:border-slate-800 dark:from-slate-800 dark:to-slate-900">
            <div className="flex items-center gap-2">
              <Avatar name={k.to} size="sm" />
              <div className="min-w-0 text-sm"><p className="truncate font-semibold">{k.to}</p><p className="truncate text-xs text-slate-500">from {k.from}</p></div>
              <Trophy size={16} className="ml-auto shrink-0 text-accent-600" />
            </div>
            <blockquote className="mt-3 text-sm text-slate-600 dark:text-slate-300">“{k.message}”</blockquote>
            <figcaption className="chip mt-3 bg-brand-700 text-white">{k.value}</figcaption>
          </figure>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Give kudos">
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-medium">Colleague
            <select className="input mt-1" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })}>
              {people.filter((p) => p.id !== 1).map((p) => <option key={p.id}>{p.name}</option>)}
            </select>
          </label>
          <fieldset>
            <legend className="text-sm font-medium">Value</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {['Customer first', 'Ownership', 'Innovation', 'Integrity'].map((v) => (
                <button type="button" key={v} onClick={() => setForm({ ...form, value: v })} className={`chip px-3 py-1 text-sm ${form.value === v ? 'bg-accent-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{v}</button>
              ))}
            </div>
          </fieldset>
          <label className="block text-sm font-medium">Message
            <textarea className="input mt-1" rows={3} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="What did they do that made a difference?" />
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
            <button className="btn-primary">Send kudos</button>
          </div>
        </form>
      </Modal>
    </section>
  )
}

function Poll() {
  const [vote, setVote] = useLocalStorage('rex-poll', null)
  const base = [34, 41, 12, 13]
  const counts = base.map((c, i) => c + (vote === i ? 1 : 0))
  const total = counts.reduce((a, b) => a + b, 0)
  return (
    <section className="card p-5">
      <SectionHeader title="Pulse poll" />
      <p className="mb-3 text-sm font-medium">{poll.question}</p>
      <div className="space-y-2">
        {poll.options.map((o, i) => {
          const pct = Math.round((counts[i] / total) * 100)
          return (
            <button key={o} onClick={() => setVote(i)} disabled={vote !== null} className={`relative w-full overflow-hidden rounded-xl border px-3 py-2 text-left text-sm transition ${vote === i ? 'border-accent-500' : 'border-slate-200 hover:border-brand-300 dark:border-slate-700'}`}>
              {vote !== null && <span className="absolute inset-y-0 left-0 bg-accent-100 transition-all duration-700 dark:bg-accent-700/30" style={{ width: `${pct}%` }} />}
              <span className="relative flex justify-between"><span>{o}</span>{vote !== null && <span className="font-semibold">{pct}%</span>}</span>
            </button>
          )
        })}
      </div>
      {vote !== null && <button onClick={() => setVote(null)} className="mt-3 text-xs text-slate-500 hover:underline">Change vote</button>}
    </section>
  )
}

function NewJoiners() {
  return (
    <section className="card p-5">
      <SectionHeader title="Celebrations" />
      <ul className="space-y-3 text-sm">
        <li className="flex items-center gap-3"><Avatar name="Kelvin Ade" size="sm" /><span className="flex-1"><b>Kelvin Ade</b> joined IT</span><span className="chip bg-sky-100 text-sky-700">New</span></li>
        <li className="flex items-center gap-3"><Avatar name="Zainab Lawal" size="sm" /><span className="flex-1"><b>Zainab Lawal</b> · birthday today</span><span>🎂</span></li>
        <li className="flex items-center gap-3"><Avatar name="Funmi Adeyemi" size="sm" /><span className="flex-1"><b>Funmi Adeyemi</b> · 10 years</span><span>🎉</span></li>
      </ul>
      <Link to="/people" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline dark:text-brand-300">Open directory <ArrowRight size={14} /></Link>
    </section>
  )
}

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2"><Hero /></div>
        <QuickLinks />
      </div>
      <Kpis />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2"><NewsFeed /></div>
        <div className="space-y-6"><Events /><Poll /></div>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2"><Kudos /></div>
        <NewJoiners />
      </div>
    </div>
  )
}
