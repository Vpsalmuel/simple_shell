import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronLeft, ChevronRight, Clock, Heart, MapPin, MessageCircle, Sparkles, Trophy, X } from 'lucide-react'
import { announcements, claims, events, kudos as initialKudos, people, poll } from '../data'
import { useNews } from '../hooks/useNews'
import { dashboardFor } from '../config/departments'
import { values } from '../data/onboarding'
import { useUser } from '../context/UserContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useCountUp } from '../hooks/useCountUp'
import { useToast } from '../components/Toast'
import Avatar from '../components/Avatar'
import Icon from '../components/Icon'
import Modal from '../components/Modal'
import Photo from '../components/Photo'
import SectionHeader from '../components/SectionHeader'
import Sparkline from '../components/Sparkline'
import StatusBadge from '../components/StatusBadge'
import { EmptyIllustration } from '../components/Illustrations'
import MeetingRoomModal from '../components/MeetingRoomModal'

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

function Hero({ user }) {
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

      <div className="relative flex flex-wrap items-center gap-2 text-sm text-brand-200">
        <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        <span className="chip bg-white/10 text-white">{user.dept} dashboard</span>
      </div>
      <h1 className="relative mt-1 text-2xl font-extrabold sm:text-3xl">{greeting()}, {user.firstName}</h1>

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

function formatKpi(k, v) {
  const n = v.toLocaleString(undefined, { minimumFractionDigits: k.decimals ?? 0, maximumFractionDigits: k.decimals ?? 0 })
  return `${k.prefix ?? ''}${n}${k.unit ?? ''}`
}

function KpiCard({ k }) {
  const value = useCountUp(k.value)
  const good = (k.delta < 0 && k.good === 'down') || (k.delta > 0 && k.good === 'up')
  const Arrow = k.delta < 0 ? ArrowDownRight : ArrowUpRight
  return (
    <div className="card card-hover flex flex-col p-4 sm:p-5">
      <p className="text-xs font-medium text-slate-500 sm:text-sm">{k.label}</p>
      <p className="mt-1.5 font-display text-xl font-extrabold text-slate-900 tabular-nums sm:text-[1.65rem] dark:text-white">{formatKpi(k, value)}</p>
      <p className={`mt-1 inline-flex flex-wrap items-center gap-1 text-xs font-medium ${good ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
        <Arrow size={14} /> {Math.abs(k.delta)}% <span className="font-normal text-slate-400">{k.hint}</span>
      </p>
      <div className="mt-auto pt-3"><Sparkline series={k.series} label={k.label} format={(v) => formatKpi(k, v)} /></div>
    </div>
  )
}

function Kpis({ kpis }) {
  return (
    <section className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Key metrics">
      {kpis.map((k) => <KpiCard key={k.label} k={k} />)}
    </section>
  )
}

function QuickLinks({ links }) {
  const [room, setRoom] = useState(false)
  const cls = 'group flex flex-col items-center gap-2 rounded-xl p-3 text-center text-xs font-medium transition hover:bg-brand-50 dark:hover:bg-slate-800'
  const inner = (q) => (
    <>
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:-translate-y-0.5 group-hover:bg-brand-700 group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-700/20 dark:bg-slate-800 dark:text-brand-200">
        <Icon name={q.icon} size={20} />
      </span>
      {q.label}
    </>
  )
  return (
    <section className="card p-5">
      <SectionHeader title="Quick links" />
      <div className="grid grid-cols-3 gap-2">
        {links.map((q) => q.action === 'meetingRoom'
          ? <button key={q.label} onClick={() => setRoom(true)} className={cls}>{inner(q)}</button>
          : q.href.startsWith('/')
            ? <Link key={q.label} to={q.href} className={cls}>{inner(q)}</Link>
            : <a key={q.label} href={q.href} className={cls}>{inner(q)}</a>)}
      </div>
      <MeetingRoomModal open={room} onClose={() => setRoom(false)} />
    </section>
  )
}

const slaTone = (d) => (d === 0 ? 'critical' : d <= 2 ? 'warning' : 'neutral')
const slaText = (d) => (d === 0 ? 'Due today' : d === 1 ? '1 day' : `${d} days`)

// Department-specific widget: a queue, a status list, or approvals with actions.
function FocusWidget({ focus }) {
  const toast = useToast()
  const [pending, setPending] = useState(focus.items ?? [])
  useEffect(() => setPending(focus.items ?? []), [focus])

  const decide = (item, approved) => {
    setPending((p) => p.filter((x) => x.id !== item.id))
    toast(`${approved ? 'Approved' : 'Declined'}: ${item.primary}`)
  }

  const rows = focus.type === 'queue'
    ? [...claims].sort((a, b) => a.sla - b.sla).slice(0, 4).map((c) => ({ primary: `${c.id} · ${c.insured}`, secondary: `${c.line} · ${c.stage}`, badge: slaText(c.sla), tone: slaTone(c.sla) }))
    : pending

  return (
    <section className="card flex flex-col p-5">
      <SectionHeader
        title={focus.title}
        subtitle={focus.subtitle}
        action={focus.cta && (focus.cta.to.startsWith('/')
          ? <Link to={focus.cta.to} className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand-600 hover:underline dark:text-brand-300">{focus.cta.label} <ArrowRight size={14} /></Link>
          : <a href={focus.cta.to} className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand-600 hover:underline dark:text-brand-300">{focus.cta.label} <ArrowRight size={14} /></a>)}
      />
      {rows.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
          <EmptyIllustration />
          <p className="mt-3 font-semibold">All caught up</p>
          <p className="text-sm text-slate-500">Nothing is waiting on you right now.</p>
        </div>
      ) : (
        <ul className="stagger divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((r) => (
            <li key={r.id ?? r.primary} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{r.primary}</p>
                <p className="truncate text-xs text-slate-500">{r.secondary}</p>
              </div>
              {focus.type === 'approvals' ? (
                <div className="flex shrink-0 gap-1.5">
                  <button onClick={() => decide(r, false)} className="btn-ghost border border-slate-200 p-2 dark:border-slate-700" aria-label={`Decline ${r.primary}`}><X size={16} /></button>
                  <button onClick={() => decide(r, true)} className="btn bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700"><Check size={16} /> <span className="hidden sm:inline">Approve</span></button>
                </div>
              ) : (
                <StatusBadge tone={r.tone}>{r.badge}</StatusBadge>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function FirstNinetyDays({ user }) {
  return (
    <section className="card flex flex-col gap-4 overflow-hidden border-accent-200 bg-gradient-to-r from-accent-50 to-white p-5 sm:flex-row sm:items-center dark:border-accent-700/40 dark:from-accent-700/10 dark:to-slate-900">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-600 text-white"><Sparkles size={22} /></span>
      <div className="flex-1">
        <p className="font-display font-bold">Your first 90 days, {user.firstName}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">Your buddy is {user.buddy} and your manager is {user.manager}. Finish your role training by 30 Nov.</p>
      </div>
      <Link to="/welcome" className="btn-ghost shrink-0 border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">Revisit walkthrough</Link>
    </section>
  )
}

function NewsFeed() {
  const { news } = useNews()
  const [liked, setLiked] = useLocalStorage('rex-liked', [])
  const [filter, setFilter] = useState('All')
  const cats = ['All', ...new Set(news.map((n) => n.category))]
  const shown = (filter === 'All' ? news : news.filter((n) => n.category === filter)).slice(0, 4)
  const toggle = (id) => setLiked(liked.includes(id) ? liked.filter((x) => x !== id) : [...liked, id])

  return (
    <section className="card p-5">
      <SectionHeader title="Company news" action={<Link to="/news" className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-300">View all</Link>} />
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
              <Photo src={n.image} alt="" label={n.category} className="hidden h-24 w-36 shrink-0 sm:block" />
              <div className="min-w-0 flex-1">
                <span className="chip mb-1 bg-brand-50 text-brand-700 sm:hidden dark:bg-slate-800 dark:text-brand-200">{n.category}</span>
                <Link to={`/news/${n.id}`} className="block font-semibold text-slate-900 hover:text-brand-600 dark:text-white">{n.title}</Link>
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
      <SectionHeader title="Upcoming events" action={<Link to="/events" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline dark:text-brand-300"><CalendarDays size={16} /> Calendar</Link>} />
      <ul className="space-y-3">
        {events.filter((e) => e.date >= new Date().toISOString().slice(0, 10)).slice(0, 4).map((e) => {
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
  const [form, setForm] = useState({ to: people[1].name, value: values[0].name, message: '' })
  const toast = useToast()
  const { user } = useUser()

  const submit = (e) => {
    e.preventDefault()
    if (!form.message.trim()) return
    setItems([{ id: Date.now(), from: user.name, ...form }, ...items])
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
              {people.filter((p) => p.name !== user.name).map((p) => <option key={p.id}>{p.name}</option>)}
            </select>
          </label>
          <fieldset>
            <legend className="text-sm font-medium">Value</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {values.map(({ name: v }) => (
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
        <li className="flex items-center gap-3"><Avatar name="Samuel Adebayo" size="sm" /><span className="flex-1"><b>Samuel Adebayo</b> joined Claims</span><span className="chip bg-sky-100 text-sky-700">New</span></li>
        <li className="flex items-center gap-3"><Avatar name="Marcus Vance" size="sm" /><span className="flex-1"><b>Marcus Vance</b> · birthday today</span><span>🎂</span></li>
        <li className="flex items-center gap-3"><Avatar name="Rebecca Sterling" size="sm" /><span className="flex-1"><b>Rebecca Sterling</b> · 10 years</span><span>🎉</span></li>
      </ul>
      <Link to="/celebrations" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline dark:text-brand-300">All celebrations <ArrowRight size={14} /></Link>
    </section>
  )
}

export default function Home() {
  const { user } = useUser()
  const dash = dashboardFor(user.dept)
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-3 [&>*]:min-w-0">
        <div className="xl:col-span-2"><Hero user={user} /></div>
        <QuickLinks links={dash.quickLinks} />
      </div>
      {user.newStaff && <FirstNinetyDays user={user} />}
      <Kpis kpis={dash.kpis} />
      <div className="grid gap-6 xl:grid-cols-3 [&>*]:min-w-0">
        <div className="xl:col-span-2"><FocusWidget key={user.dept} focus={dash.focus} /></div>
        <Events />
      </div>
      <div className="grid gap-6 xl:grid-cols-3 [&>*]:min-w-0">
        <div className="xl:col-span-2"><NewsFeed /></div>
        <div className="space-y-6"><Poll /><NewJoiners /></div>
      </div>
      <Kudos />
    </div>
  )
}
