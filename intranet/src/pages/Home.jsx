import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, CalendarDays, Check, ChevronRight, Clock, Inbox, Info, MapPin, Search, Sparkles, X } from 'lucide-react'
import { announcements, claims, courses, events, people, poll } from '../data'
import { birthdays } from '../data/culture'
import { closedStatuses, initialRequests } from '../data/requests'
import { useNews } from '../hooks/useNews'
import { dashboardFor } from '../config/departments'
import { useUser } from '../context/UserContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { daysUntil, nextOccurrence, shortDate, whenLabel } from '../lib/dates'
import { useToast } from '../components/Toast'
import Avatar from '../components/Avatar'
import Icon from '../components/Icon'
import Photo from '../components/Photo'
import StatusBadge from '../components/StatusBadge'
import MeetingRoomModal from '../components/MeetingRoomModal'

// Home follows the patterns of award-winning intranets (NN/g Intranet Design Annual, Viva Connections):
// search first, things to act on, then news, events and people. No metrics, no rotating banners.

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

const openSearch = () => window.dispatchEvent(new Event('rex:search'))

function Greeting({ user }) {
  return (
    <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm text-slate-500">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        <h1 className="mt-1 text-3xl font-bold text-brand-800 sm:text-4xl dark:text-white">{greeting()}, {user.firstName}</h1>
      </div>
      <button
        data-tour="search"
        onClick={openSearch}
        className="group flex h-12 w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-left text-slate-500 shadow-[0_1px_2px_rgba(30,45,100,0.05)] transition hover:border-brand-300 lg:w-[26rem] dark:border-slate-800 dark:bg-slate-900"
      >
        <Search size={18} className="text-slate-400 group-hover:text-brand-600" />
        <span className="flex-1">Search people, policies and news</span>
        <kbd className="hidden rounded-md border border-slate-200 px-1.5 py-0.5 text-[11px] text-slate-400 sm:inline dark:border-slate-700">Ctrl K</kbd>
      </button>
    </section>
  )
}

// One important notice, fixed in place (not a rotating banner). People can dismiss it.
function Notice() {
  const [dismissed, setDismissed] = useLocalStorage('rex-dismissed-notices', [])
  const a = announcements.find((x) => !dismissed.includes(x.id))
  if (!a) return null
  const to = a.tag === 'Compliance' ? '/learning' : a.tag === 'Wellbeing' ? '/wellbeing' : '/news'
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-accent-200 bg-accent-50 p-4 sm:flex-row sm:items-center dark:border-accent-700/40 dark:bg-accent-700/10" aria-label="Announcement">
      <Info size={20} className="hidden shrink-0 text-accent-700 sm:block dark:text-accent-400" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900 dark:text-white">{a.title}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">{a.body}</p>
      </div>
      <div className="flex items-center gap-2">
        <Link to={to} className="btn bg-brand-700 text-white hover:bg-brand-800">{a.cta}</Link>
        <button onClick={() => setDismissed([...dismissed, a.id])} className="btn-ghost p-2" aria-label="Dismiss announcement"><X size={16} /></button>
      </div>
    </section>
  )
}

const slaTone = (d) => (d === 0 ? 'critical' : d <= 2 ? 'warning' : 'neutral')
const slaText = (d) => (d === 0 ? 'Due today' : d === 1 ? '1 day left' : `${d} days left`)

function TaskRow({ icon: Ico, title, meta, children, to }) {
  const body = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"><Ico size={16} /></span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 block text-sm font-medium text-slate-900 sm:truncate dark:text-white">{title}</span>
        <span className="line-clamp-2 block text-xs text-slate-500 sm:truncate">{meta}</span>
        {children && <span className="mt-2 flex sm:hidden">{children}</span>}
      </span>
      {children && <span className="hidden sm:flex">{children}</span>}
    </>
  )
  return (
    <li>
      {to
        ? <Link to={to} className="flex items-start gap-3 rounded-xl px-2 py-2.5 sm:items-center transition hover:bg-slate-50 dark:hover:bg-slate-800/60">{body}<ChevronRight size={16} className="shrink-0 text-slate-300" /></Link>
        : <div className="flex items-start gap-3 px-2 py-2.5 sm:items-center">{body}</div>}
    </li>
  )
}

// Everything that needs the person's action, in one list.
function Tasks({ user }) {
  const toast = useToast()
  const { focus } = dashboardFor(user.dept)
  const [progress] = useLocalStorage('rex-learning', Object.fromEntries(courses.map((c) => [c.id, c.progress])))
  const [requests] = useLocalStorage('rex-requests', initialRequests)
  const [decided, setDecided] = useState([])
  useEffect(() => setDecided([]), [user.dept])

  const decide = (item, ok) => { setDecided([...decided, item.id]); toast(`${ok ? 'Approved' : 'Declined'}: ${item.primary}`) }
  const approvals = focus.type === 'approvals' ? focus.items.filter((i) => !decided.includes(i.id)) : []
  const queue = focus.type === 'queue' ? [...claims].sort((a, b) => a.sla - b.sla).slice(0, 3) : []
  const watch = focus.type === 'list' ? focus.items.slice(0, 3) : []
  const training = courses.filter((c) => c.mandatory && (progress[c.id] ?? 0) < 100)
  const waiting = requests.filter((r) => r.to === user.dept && !closedStatuses.includes(r.status))
  const count = approvals.length + queue.length + training.length + (waiting.length ? 1 : 0)

  return (
    <section className="card flex h-full flex-col p-5">
      <header className="mb-2 flex items-center gap-2">
        <h2 className="text-lg font-semibold">Your tasks</h2>
        {count > 0 && <span className="rounded-full bg-brand-700 px-2 py-0.5 text-xs font-semibold text-white tabular-nums">{count}</span>}
      </header>
      {count === 0 && watch.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <Check size={28} className="text-emerald-500" />
          <p className="mt-2 font-semibold">You’re all caught up</p>
          <p className="text-sm text-slate-500">New approvals and requests will appear here.</p>
        </div>
      ) : (
        <ul className="-mx-2 divide-y divide-slate-100 dark:divide-slate-800">
          {approvals.map((a) => (
            <TaskRow key={a.id} icon={Inbox} title={a.primary} meta={a.secondary}>
              <div className="flex shrink-0 gap-1.5">
                <button onClick={() => decide(a, false)} className="btn-ghost border border-slate-200 px-3 py-1.5 dark:border-slate-700">Decline</button>
                <button onClick={() => decide(a, true)} className="btn bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700">Approve</button>
              </div>
            </TaskRow>
          ))}
          {queue.map((c) => (
            <TaskRow key={c.id} icon={Inbox} title={`${c.id}, ${c.insured}`} meta={`${c.line} claim at ${c.stage.toLowerCase()} stage`} to={`/claims?claim=${c.id}`}>
              <StatusBadge tone={slaTone(c.sla)}>{slaText(c.sla)}</StatusBadge>
            </TaskRow>
          ))}
          {watch.map((w) => (
            <TaskRow key={w.primary} icon={Inbox} title={w.primary} meta={w.secondary} to={focus.cta?.to?.startsWith('/') ? focus.cta.to : undefined}>
              <StatusBadge tone={w.tone}>{w.badge}</StatusBadge>
            </TaskRow>
          ))}
          {training.map((c) => (
            <TaskRow key={c.id} icon={BookOpen} title={`Complete ${c.title}`} meta={`Required training, due ${shortDate(new Date(`${c.due}T00:00`))}`} to="/learning">
              <StatusBadge tone={daysUntil(new Date(`${c.due}T00:00`)) <= 14 ? 'warning' : 'neutral'}>{progress[c.id] ?? 0}% done</StatusBadge>
            </TaskRow>
          ))}
          {waiting.length > 0 && (
            <TaskRow icon={Inbox} title={`${waiting.length} ${waiting.length === 1 ? 'request is' : 'requests are'} waiting for ${user.dept}`} meta="Assign, reply or close them in the Request Centre" to="/requests?tab=queue" />
          )}
        </ul>
      )}
    </section>
  )
}

function QuickLinks({ links }) {
  const [room, setRoom] = useState(false)
  const cls = 'group flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm font-medium transition hover:bg-slate-50 dark:hover:bg-slate-800/60'
  const inner = (q) => (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition group-hover:bg-brand-700 group-hover:text-white dark:bg-slate-800 dark:text-brand-200"><Icon name={q.icon} size={16} /></span>
      {q.label}
    </>
  )
  return (
    <section className="card p-5">
      <h2 className="mb-2 text-lg font-semibold">Quick links</h2>
      <div className="-mx-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
        {links.map((q) => q.action === 'meetingRoom'
          ? <button key={q.label} onClick={() => setRoom(true)} className={`${cls} text-left`}>{inner(q)}</button>
          : q.href.startsWith('/')
            ? <Link key={q.label} to={q.href} className={cls}>{inner(q)}</Link>
            : <a key={q.label} href={q.href} className={cls}>{inner(q)}</a>)}
      </div>
      <MeetingRoomModal open={room} onClose={() => setRoom(false)} />
    </section>
  )
}

const fmtDate = (d) => new Date(`${d}T00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })

// One featured story and three headlines. Static: no carousel.
function News() {
  const { news } = useNews()
  const featured = news.find((n) => n.featured) ?? news[0]
  const rest = news.filter((n) => n !== featured).slice(0, 3)
  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-4">
        <h2 className="text-lg font-semibold">Company news</h2>
        <Link to="/news" className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline dark:text-brand-300">All company news <ArrowRight size={14} /></Link>
      </div>
      <div className="grid gap-5 lg:grid-cols-5 [&>*]:min-w-0">
        <Link to={`/news/${featured.id}`} className="card card-hover group overflow-hidden lg:col-span-3">
          <Photo src={featured.image} alt="" className="aspect-[16/8] w-full" rounded="rounded-none" />
          <div className="p-5">
            <p className="text-xs font-medium text-accent-700 dark:text-accent-400">{featured.category}</p>
            <h3 className="mt-1 text-xl font-semibold group-hover:text-brand-700 dark:group-hover:text-brand-300">{featured.title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{featured.excerpt}</p>
            <p className="mt-3 text-xs text-slate-500">{featured.author}, {fmtDate(featured.date)}</p>
          </div>
        </Link>
        <ul className="card divide-y divide-slate-100 lg:col-span-2 dark:divide-slate-800">
          {rest.map((n) => (
            <li key={n.id}>
              <Link to={`/news/${n.id}`} className="group flex gap-4 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <Photo src={n.image} alt="" className="h-16 w-20 shrink-0" rounded="rounded-lg" />
                <span className="min-w-0">
                  <span className="text-xs font-medium text-accent-700 dark:text-accent-400">{n.category}</span>
                  <span className="mt-0.5 block font-medium leading-snug group-hover:text-brand-700 dark:group-hover:text-brand-300">{n.title}</span>
                  <span className="mt-1 block text-xs text-slate-500">{fmtDate(n.date)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Events() {
  const [rsvp, setRsvp] = useLocalStorage('rex-rsvp', [])
  const toast = useToast()
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = events.filter((e) => e.date >= today).slice(0, 3)
  const toggle = (e) => {
    const going = rsvp.includes(e.id)
    setRsvp(going ? rsvp.filter((x) => x !== e.id) : [...rsvp, e.id])
    toast(going ? `RSVP removed for ${e.title}` : `You’re going to ${e.title}`)
  }
  return (
    <section className="card flex flex-col p-5">
      <h2 className="mb-3 text-lg font-semibold">Upcoming events</h2>
      <ul className="flex-1 space-y-3">
        {upcoming.map((e) => {
          const d = new Date(`${e.date}T00:00`)
          const going = rsvp.includes(e.id)
          return (
            <li key={e.id} className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-semibold text-accent-700 uppercase dark:text-accent-400">{d.toLocaleDateString(undefined, { month: 'short' })}</span>
                <span className="text-base leading-none font-bold">{d.getDate()}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{e.title}</p>
                <p className="flex items-center gap-1 truncate text-xs text-slate-500"><Clock size={11} /> {e.time} <MapPin size={11} className="ml-1" /> {e.place}</p>
              </div>
              <button onClick={() => toggle(e)} aria-pressed={going} className={`btn shrink-0 px-3 py-1.5 ${going ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'border border-slate-200 text-slate-700 hover:border-brand-400 dark:border-slate-700 dark:text-slate-200'}`}>
                {going ? <><Check size={14} /> Going</> : 'RSVP'}
              </button>
            </li>
          )
        })}
      </ul>
      <Link to="/events" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline dark:text-brand-300"><CalendarDays size={14} /> Open the events calendar</Link>
    </section>
  )
}

function ThisWeek() {
  const soonBirthdays = Object.entries(birthdays)
    .map(([name, mmdd]) => ({ name, days: daysUntil(nextOccurrence(mmdd)), date: nextOccurrence(mmdd), kind: 'Birthday' }))
  const anniversaries = people.filter((p) => p.joined).map((p) => {
    const date = nextOccurrence(p.joined.slice(5))
    const years = date.getFullYear() - Number(p.joined.slice(0, 4))
    return { name: p.name, days: daysUntil(date), date, kind: `${years}-year anniversary`, years }
  }).filter((a) => a.years > 0)
  const items = [...soonBirthdays, ...anniversaries].filter((x) => x.days <= 7).sort((a, b) => a.days - b.days).slice(0, 4)
  return (
    <section className="card flex flex-col p-5">
      <h2 className="mb-3 text-lg font-semibold">Celebrations this week</h2>
      {items.length === 0 ? <p className="flex-1 text-sm text-slate-500">No birthdays or work anniversaries this week.</p> : (
        <ul className="flex-1 space-y-3">
          {items.map((x) => (
            <li key={x.name + x.kind} className="flex items-center gap-3">
              <Avatar name={x.name} size="sm" />
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{x.name}</span><span className="block text-xs text-slate-500">{x.kind}, {whenLabel(x.days).toLowerCase()}</span></span>
            </li>
          ))}
        </ul>
      )}
      <Link to="/celebrations" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline dark:text-brand-300"><Sparkles size={14} /> See all celebrations</Link>
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
      <h2 className="text-lg font-semibold">Pulse poll</h2>
      <p className="mt-1 mb-3 text-sm text-slate-600 dark:text-slate-300">{poll.question}</p>
      <div className="space-y-2">
        {poll.options.map((o, i) => {
          const pct = Math.round((counts[i] / total) * 100)
          return (
            <button key={o} onClick={() => setVote(i)} disabled={vote !== null} aria-pressed={vote === i} className={`relative w-full overflow-hidden rounded-xl border px-3 py-2 text-left text-sm transition ${vote === i ? 'border-brand-500' : 'border-slate-200 hover:border-brand-300 dark:border-slate-700'}`}>
              {vote !== null && <span className="absolute inset-y-0 left-0 bg-brand-50 transition-all duration-700 dark:bg-brand-900/40" style={{ width: `${pct}%` }} />}
              <span className="relative flex justify-between gap-2"><span>{o}</span>{vote !== null && <span className="font-semibold tabular-nums">{pct}%</span>}</span>
            </button>
          )
        })}
      </div>
      {vote !== null && <button onClick={() => setVote(null)} className="mt-3 text-xs text-slate-500 hover:underline">Change my vote</button>}
    </section>
  )
}

function FirstNinetyDays({ user }) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-brand-100 bg-brand-50 p-4 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
      <div className="flex-1">
        <p className="font-semibold">Your first 90 days, {user.firstName}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">Your buddy is {user.buddy} and your manager is {user.manager}.</p>
      </div>
      <Link to="/welcome" className="btn-ghost shrink-0 border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">Revisit your onboarding</Link>
    </section>
  )
}

export default function Home() {
  const { user } = useUser()
  const { quickLinks } = dashboardFor(user.dept)
  return (
    <div className="space-y-6">
      <Greeting user={user} />
      {user.newStaff && <FirstNinetyDays user={user} />}
      <Notice />
      <div className="grid gap-6 lg:grid-cols-3 [&>*]:min-w-0">
        <div className="lg:col-span-2"><Tasks user={user} /></div>
        <QuickLinks links={quickLinks} />
      </div>
      <News />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 [&>*]:min-w-0">
        <Events />
        <ThisWeek />
        <Poll />
      </div>
    </div>
  )
}
