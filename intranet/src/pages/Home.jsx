import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon as ArrowRight, ArrowUpRightIcon as ArrowUpRight, BookOpenIcon as BookOpen, CakeIcon as Cake, CaretRightIcon as ChevronRight, CheckIcon as Check, CheckCircleIcon as CheckCircle, TrayIcon as Inbox, MegaphoneIcon as Megaphone, SealCheckIcon as Approve, XIcon as X } from '@phosphor-icons/react'
import { announcements, courses, events, poll } from '../data'
import { closedStatuses, initialRequests } from '../data/requests'
import { useNews } from '../hooks/useNews'
import { dashboardFor } from '../config/departments'
import { companyTools } from '../config/brand'
import { useUser } from '../context/UserContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { celebrationLabel, upcomingCelebrations } from '../lib/celebrations'
import { daysUntil, shortDate, whenLabel } from '../lib/dates'
import { useToast } from '../components/Toast'
import Avatar from '../components/Avatar'
import Icon from '../components/Icon'
import Photo from '../components/Photo'
import StatusBadge from '../components/StatusBadge'
import MeetingRoomModal from '../components/MeetingRoomModal'

// Home layout: a main column for what needs action and what's new, and a right rail for the tools and
// people things staff check daily. One card style, one radius, 15px section titles, no metrics, no carousel.

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

const fmtDate = (d) => new Date(`${d}T00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })

function Card({ title, action, children, className = '', ...rest }) {
  return (
    <section className={`card ${className}`} {...rest}>
      {title && (
        <header className="flex items-center justify-between gap-3 px-5 pt-4 pb-2">
          <h2 className="section-title">{title}</h2>
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

const MoreLink = ({ to, children }) => <Link to={to} className="link inline-flex items-center gap-1 text-xs">{children} <ArrowRight size={12} /></Link>

// One important notice, fixed in place. People can dismiss it.
function Notice() {
  const [dismissed, setDismissed] = useLocalStorage('rex-dismissed-notices', [])
  const a = announcements.find((x) => !dismissed.includes(x.id))
  if (!a) return null
  const to = a.tag === 'Compliance' ? '/knowledge?tab=courses' : a.tag === 'Wellbeing' ? '/wellbeing' : '/news'
  return (
    <section className="mb-8 flex items-start gap-3 rounded-xl border border-slate-200 bg-white py-3 pr-2 pl-4 sm:items-center dark:border-slate-800 dark:bg-slate-900" aria-label="Announcement">
      <Megaphone size={18} className="mt-0.5 shrink-0 text-accent-700 sm:mt-0 dark:text-accent-400" />
      <p className="min-w-0 flex-1 text-sm">
        <span className="font-medium text-slate-900 dark:text-white">{a.title}.</span>{' '}
        <span className="text-slate-600 dark:text-slate-300">{a.body}</span>{' '}
        <Link to={to} className="link whitespace-nowrap">{a.cta}</Link>
      </p>
      <button onClick={() => setDismissed([...dismissed, a.id])} className="btn-ghost h-8 w-8 shrink-0 px-0" aria-label="Dismiss announcement"><X size={16} /></button>
    </section>
  )
}

function TaskRow({ icon: Ico, title, meta, children, to }) {
  const inner = (
    <>
      <Ico size={18} className="mt-0.5 shrink-0 text-slate-500 sm:mt-0" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-slate-900 sm:truncate dark:text-white">{title}</span>
        <span className="block text-xs text-slate-500 sm:truncate">{meta}</span>
        {children && <span className="mt-2 flex sm:hidden">{children}</span>}
      </span>
      {children && <span className="hidden shrink-0 sm:flex">{children}</span>}
    </>
  )
  const cls = 'flex items-start gap-3 px-5 py-3 sm:items-center'
  return (
    <li>
      {to
        ? <Link to={to} className={`${cls} transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50`}>{inner}<ChevronRight size={14} className="shrink-0 text-slate-400" /></Link>
        : <div className={cls}>{inner}</div>}
    </li>
  )
}

// Pending approvals and everything else that needs the person's action, in one list.
function Tasks({ user }) {
  const toast = useToast()
  const { focus } = dashboardFor(user.dept)
  const [progress] = useLocalStorage('rex-learning', Object.fromEntries(courses.map((c) => [c.id, c.progress])))
  const [requests] = useLocalStorage('rex-requests-v2', initialRequests)
  const [decided, setDecided] = useState([])
  useEffect(() => setDecided([]), [user.dept])

  const decide = (item, ok) => { setDecided([...decided, item.id]); toast(`${ok ? 'Approved' : 'Declined'}: ${item.primary}`) }
  const approvals = focus.type === 'approvals' ? focus.items.filter((i) => !decided.includes(i.id)) : []
  const watch = focus.type === 'list' ? focus.items.slice(0, 3) : []
  const training = courses.filter((c) => c.mandatory && (progress[c.id] ?? 0) < 100)
  const waiting = requests.filter((r) => r.to === user.dept && !closedStatuses.includes(r.status))
  const count = approvals.length + training.length + (waiting.length ? 1 : 0)

  return (
    <Card title={<span className="flex items-center gap-2">Your tasks {count > 0 && <span className="rounded-md bg-slate-100 px-1.5 text-xs font-medium text-slate-600 tabular-nums dark:bg-slate-800 dark:text-slate-300">{count}</span>}</span>}>
      {count === 0 && watch.length === 0 ? (
        <div className="flex items-center gap-3 px-5 pt-2 pb-5 text-sm text-slate-600 dark:text-slate-300">
          <CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400" /> You’re all caught up. New approvals and requests appear here.
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 pb-1 dark:divide-slate-800">
          {approvals.length > 0 && <li className="px-5 pt-1 pb-1.5 text-xs font-medium text-slate-500">Pending approval</li>}
          {approvals.map((a) => (
            <TaskRow key={a.id} icon={Approve} title={a.primary} meta={a.secondary}>
              <div className="flex gap-1.5">
                <button onClick={() => decide(a, false)} className="btn-secondary h-8 px-3 text-xs">Decline</button>
                <button onClick={() => decide(a, true)} className="btn-primary h-8 px-3 text-xs">Approve</button>
              </div>
            </TaskRow>
          ))}
          {watch.map((w) => (
            <TaskRow key={w.primary} icon={Inbox} title={w.primary} meta={w.secondary} to={focus.cta?.to?.startsWith('/') ? focus.cta.to : undefined}>
              <StatusBadge tone={w.tone}>{w.badge}</StatusBadge>
            </TaskRow>
          ))}
          {training.map((c) => (
            <TaskRow key={c.id} icon={BookOpen} title={`Complete ${c.title}`} meta={`Required training, due ${shortDate(new Date(`${c.due}T00:00`))}, ${progress[c.id] ?? 0}% done`} to={`/learning/${c.id}`}>
              {daysUntil(new Date(`${c.due}T00:00`)) <= 14 && <StatusBadge tone="warning">Due soon</StatusBadge>}
            </TaskRow>
          ))}
          {waiting.length > 0 && (
            <TaskRow icon={Inbox} title={`${waiting.length} ${waiting.length === 1 ? 'request is' : 'requests are'} waiting for ${user.dept}`} meta="Assign, reply or close them in Requests" to="/requests?tab=queue" />
          )}
        </ul>
      )}
    </Card>
  )
}

function ToolLink({ tool, onAction, className, children }) {
  const toast = useToast()
  if (tool.internal) return <Link to={tool.internal} className={className}>{children}</Link>
  if (tool.action) return <button onClick={() => onAction(tool.action)} className={className}>{children}</button>
  if (!tool.url) return <button onClick={() => toast(`${tool.label}: link coming soon.`)} className={className}>{children}</button>
  return <a href={tool.url} target="_blank" rel="noreferrer" className={className}>{children}</a>
}

// The company tools staff open every day (17 Nov review: Book a room and Payslips moved in here).
function QuickTools() {
  const [room, setRoom] = useState(false)
  return (
    <Card title="Quick tools" data-tour="tools">
      <div className="grid grid-cols-3 gap-1 px-3 pb-3">
        {companyTools.map((t) => (
          <ToolLink key={t.id} tool={t} onAction={() => setRoom(true)} className="group flex flex-col items-center gap-2 rounded-lg px-1 py-3 text-center transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-700 group-hover:text-white dark:bg-brand-500/15 dark:text-brand-200 dark:group-hover:bg-brand-500"><Icon name={t.icon} size={20} /></span>
            <span className="text-xs leading-tight font-medium text-slate-700 dark:text-slate-200">{t.label}</span>
          </ToolLink>
        ))}
      </div>
      <MeetingRoomModal open={room} onClose={() => setRoom(false)} />
    </Card>
  )
}

// Replaces the Shortcuts list under Quick tools (17 Nov review).
function CelebrationsCard() {
  const items = upcomingCelebrations(7).slice(0, 4)
  return (
    <Card title="Celebrations" action={<MoreLink to="/celebrations">All</MoreLink>}>
      {items.length === 0 ? <p className="px-5 pb-5 text-sm text-slate-500">No birthdays or anniversaries this week.</p> : (
        <ul className="space-y-3 px-5 pt-1 pb-5">
          {items.map((c) => (
            <li key={c.kind + c.name} className="flex items-center gap-3">
              <Avatar name={c.name} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-900 dark:text-white">{c.name}</span>
                <span className="flex items-center gap-1 text-xs text-slate-500">{c.kind === 'birthday' && <Cake size={12} />}{celebrationLabel(c)}, {whenLabel(c.days).toLowerCase()}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

function News() {
  const { news } = useNews()
  const featured = news.find((n) => n.featured) ?? news[0]
  const rest = news.filter((n) => n !== featured).slice(0, 4)
  return (
    <Card title="Company news" action={<MoreLink to="/news">All news</MoreLink>}>
      <Link to={`/news/${featured.id}`} className="group mx-5 mt-1 grid gap-4 sm:grid-cols-[minmax(0,13rem)_1fr]">
        <Photo src={featured.image} alt="" className="aspect-[4/3] w-full" rounded="rounded-lg" />
        <span className="min-w-0 self-center">
          <span className="text-xs font-medium text-accent-700 dark:text-accent-400">{featured.category}</span>
          <span className="mt-1 block text-[17px] leading-snug font-semibold text-slate-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">{featured.title}</span>
          <span className="mt-1 line-clamp-2 block text-sm text-slate-600 dark:text-slate-300">{featured.excerpt}</span>
          <span className="mt-2 block text-xs text-slate-500">{featured.author}, {fmtDate(featured.date)}</span>
        </span>
      </Link>
      <ul className="mt-4 divide-y divide-slate-100 border-t border-slate-100 dark:divide-slate-800 dark:border-slate-800">
        {rest.map((n) => (
          <li key={n.id}>
            <Link to={`/news/${n.id}`} className="group flex items-baseline gap-3 px-5 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <span className="min-w-0 flex-1 truncate text-sm text-slate-800 group-hover:text-brand-700 dark:text-slate-200 dark:group-hover:text-brand-300">{n.title}</span>
              <span className="shrink-0 text-xs text-slate-500 tabular-nums">{fmtDate(n.date)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function UpcomingEvents() {
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
    <Card title="Upcoming events" action={<MoreLink to="/events">Calendar</MoreLink>}>
      <ul className="divide-y divide-slate-100 pb-1 dark:divide-slate-800">
        {upcoming.map((e) => {
          const d = new Date(`${e.date}T00:00`)
          const going = rsvp.includes(e.id)
          return (
            <li key={e.id} className="flex items-center gap-4 px-5 py-3">
              <div className="w-10 shrink-0 text-center">
                <p className="text-[11px] font-medium text-accent-700 uppercase dark:text-accent-400">{d.toLocaleDateString(undefined, { month: 'short' })}</p>
                <p className="text-lg leading-tight font-semibold text-slate-900 tabular-nums dark:text-white">{d.getDate()}</p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{e.title}</p>
                <p className="truncate text-xs text-slate-500">{e.time}, {e.place}</p>
              </div>
              <button onClick={() => toggle(e)} aria-pressed={going} className={going ? 'btn h-8 shrink-0 px-3 text-xs text-emerald-700 dark:text-emerald-300' : 'btn-secondary h-8 shrink-0 px-3 text-xs'}>
                {going ? <><Check size={14} /> Going</> : 'RSVP'}
              </button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

function Poll() {
  const [vote, setVote] = useLocalStorage('rex-poll', null)
  const base = [34, 41, 12, 13]
  const counts = base.map((c, i) => c + (vote === i ? 1 : 0))
  const total = counts.reduce((a, b) => a + b, 0)
  return (
    <Card title="Pulse poll">
      <div className="px-5 pb-5">
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">{poll.question}</p>
        <div className="space-y-1.5">
          {poll.options.map((o, i) => {
            const pct = Math.round((counts[i] / total) * 100)
            return (
              <button key={o} onClick={() => setVote(i)} disabled={vote !== null} aria-pressed={vote === i} className={`relative w-full overflow-hidden rounded-lg border px-3 py-2 text-left text-sm transition-colors disabled:cursor-default ${vote === i ? 'border-brand-500 dark:border-brand-400' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'}`}>
                {vote !== null && <span className="absolute inset-y-0 left-0 bg-brand-50 transition-[width] duration-700 dark:bg-brand-500/15" style={{ width: `${pct}%` }} />}
                <span className="relative flex justify-between gap-2"><span>{o}</span>{vote !== null && <span className="font-medium tabular-nums">{pct}%</span>}</span>
              </button>
            )
          })}
        </div>
        {vote !== null && <button onClick={() => setVote(null)} className="mt-3 text-xs text-slate-500 hover:underline">Change my vote</button>}
      </div>
    </Card>
  )
}

function FirstNinetyDays({ user }) {
  return (
    <p className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
      Your first 90 days: your buddy is <b className="font-medium text-slate-900 dark:text-white">{user.buddy}</b> and your manager is <b className="font-medium text-slate-900 dark:text-white">{user.manager}</b>.
      <Link to="/welcome" className="link inline-flex items-center gap-1">Revisit onboarding <ArrowUpRight size={12} /></Link>
    </p>
  )
}

export default function Home() {
  const { user } = useUser()
  return (
    <div>
      <header className="mb-8">
        <p className="text-sm text-slate-500">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        <h1 className="mt-1 text-[28px] leading-tight font-semibold text-slate-900 dark:text-white">{greeting()}, {user.firstName}</h1>
      </header>
      {user.newStaff && <FirstNinetyDays user={user} />}
      <Notice />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_19rem] xl:gap-8">
        <div className="min-w-0 space-y-6">
          <Tasks user={user} />
          <News />
          <UpcomingEvents />
        </div>
        <aside className="min-w-0 space-y-6">
          <QuickTools />
          <CelebrationsCard />
          <Poll />
        </aside>
      </div>
    </div>
  )
}
