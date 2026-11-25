import { useState } from 'react'
import { CakeIcon as Cake, CheckIcon as Check, ChatCircleIcon as MessageCircle, ConfettiIcon as PartyPopper, HeartIcon as Heart, PlusIcon as Plus, PaperPlaneTiltIcon as Send, ThumbsUpIcon as ThumbsUp } from '@phosphor-icons/react'
import { people } from '../data'
import { milestones as seed } from '../data/culture'
import { adminDepts } from '../config/nav'
import { upcomingAnniversaries, upcomingBirthdays } from '../lib/celebrations'
import { daysUntil, shortDate, whenLabel } from '../lib/dates'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useUser } from '../context/UserContext'
import { useToast } from '../components/Toast'
import Avatar from '../components/Avatar'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'

// Celebrations replaces Milestones (17 Nov review). Recognition and kudos sit here too (20 Aug review).
const reactionTypes = [
  { id: 'celebrate', label: 'Celebrate', Icon: PartyPopper },
  { id: 'applaud', label: 'Applaud', Icon: ThumbsUp },
  { id: 'love', label: 'Love', Icon: Heart },
]
const fmt = (d) => new Date(`${d}T00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })

function Wish({ id, name, wished, onWish }) {
  return wished
    ? <span className="inline-flex h-8 shrink-0 items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-300"><Check size={14} /> Sent</span>
    : <button onClick={() => onWish(id, name)} className="btn-secondary h-8 shrink-0 px-3 text-xs">Send wishes</button>
}

function RecognitionPost({ m, user }) {
  const [mine, setMine] = useLocalStorage(`rex-react-${m.id}`, [])
  const [comments, setComments] = useLocalStorage(`rex-mcomments-${m.id}`, [])
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const person = people.find((p) => p.name === m.person)
  const react = (e) => setMine(mine.includes(e) ? mine.filter((x) => x !== e) : [...mine, e])
  const post = (ev) => {
    ev.preventDefault()
    if (!draft.trim()) return
    setComments([...comments, { name: user.name, text: draft.trim() }])
    setDraft('')
  }
  return (
    <article className="py-6 first:pt-0">
      <header className="flex items-center gap-3">
        <Avatar name={m.person} size="md" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{m.person}</p>
          <p className="truncate text-xs text-slate-500">{person?.role}</p>
        </div>
        <span className="chip shrink-0 bg-accent-50 text-accent-800 dark:bg-accent-600/20 dark:text-accent-200">{m.kind === 'kudos' ? 'Kudos' : `${m.years} ${m.years === 1 ? 'year' : 'years'} at Rex`}</span>
      </header>
      <p className="mt-3 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">{m.message}</p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {reactionTypes.map(({ id: e, label, Icon }) => {
          const on = mine.includes(e)
          return (
            <button key={e} onClick={() => react(e)} aria-pressed={on} aria-label={label} title={label} className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs transition-colors ${on ? 'bg-accent-50 text-accent-800 ring-1 ring-accent-300 dark:bg-accent-600/20 dark:text-accent-200 dark:ring-accent-600/50' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
              <Icon size={14} weight={on ? 'fill' : 'regular'} /><span className="tabular-nums">{(m.reactions?.[e] ?? 0) + (on ? 1 : 0)}</span>
            </button>
          )
        })}
        <span className="mx-1 h-4 w-px bg-slate-200 dark:bg-slate-700" />
        <button onClick={() => setOpen(!open)} aria-expanded={open} className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"><MessageCircle size={14} /> {comments.length ? `${comments.length} ${comments.length === 1 ? 'comment' : 'comments'}` : 'Congratulate'}</button>
        <span className="ml-auto text-xs text-slate-500">{fmt(m.date)}</span>
      </div>
      {open && (
        <div className="animate-fade-up mt-3 space-y-2.5 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
          {comments.map((c, i) => <p key={i} className="text-sm break-words"><b className="font-medium text-slate-900 dark:text-white">{c.name}</b> <span className="text-slate-600 dark:text-slate-300">{c.text}</span></p>)}
          <form onSubmit={post} className="flex gap-2">
            <label htmlFor={`mc-${m.id}`} className="sr-only">Write a congratulation</label>
            <input id={`mc-${m.id}`} className="input h-9 bg-white" placeholder={`Congratulate ${m.person.split(' ')[0]}`} value={draft} onChange={(e) => setDraft(e.target.value)} />
            <button className="btn-primary w-9 px-0" disabled={!draft.trim()} aria-label="Post"><Send size={16} /></button>
          </form>
        </div>
      )}
    </article>
  )
}

function PeopleList({ title, items, empty, render }) {
  return (
    <section>
      <h2 className="section-title mb-3">{title}</h2>
      {items.length === 0 ? <p className="text-sm text-slate-500">{empty}</p> : <ul className="space-y-3">{items.map(render)}</ul>}
    </section>
  )
}

export default function Celebrations() {
  const { user } = useUser()
  const toast = useToast()
  const [wishes, setWishes] = useLocalStorage('rex-wishes', [])
  const [extra, setExtra] = useLocalStorage('rex-milestones', [])
  const [sharing, setSharing] = useState(false)
  const [f, setF] = useState({ kind: 'kudos', person: people[0].name, years: 1, message: '' })
  const canShare = adminDepts.includes(user.dept)
  const wish = (id, name) => { setWishes([...wishes, id]); toast(`Wishes sent to ${name}`) }
  const key = (kind, name, date) => `${kind}:${name}:${date.getFullYear()}`

  const birthdays = upcomingBirthdays(45)
  const anniversaries = upcomingAnniversaries(90)
  const joiners = people.filter((p) => p.joined && daysUntil(new Date(`${p.joined}T00:00`)) >= -365)
  const feed = [...extra, ...seed].sort((a, b) => b.date.localeCompare(a.date))
  const todays = [...birthdays, ...anniversaries].filter((c) => c.days === 0)

  const share = (e) => {
    e.preventDefault()
    setExtra([{ id: `x${Date.now()}`, ...f, date: new Date().toISOString().slice(0, 10), reactions: {} }, ...extra])
    setSharing(false)
    setF({ ...f, message: '' })
    toast(`Shared on Celebrations: ${f.person}`)
  }

  return (
    <div>
      <PageHeader
        title="Celebrations"
        description={todays.length ? `Today: ${todays.map((c) => `${c.name}${c.kind === 'birthday' ? '’s birthday' : `, ${c.years} years at Rex`}`).join(' and ')}.` : 'Birthdays, work anniversaries, new joiners and recognition across Rex.'}
        actions={canShare && <button onClick={() => setSharing(true)} className="btn-primary"><Plus size={16} /> Share recognition</button>}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section aria-label="Recognition" className="card px-6 py-6">
          <h2 className="section-title mb-5">Recognition</h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {feed.map((m) => <RecognitionPost key={m.id} m={m} user={user} />)}
          </div>
        </section>

        <aside className="space-y-8">
          <PeopleList title="Birthdays" items={birthdays.slice(0, 6)} empty="No birthdays in the next six weeks." render={(b) => (
            <li key={b.name} className="flex items-center gap-3">
              <Avatar name={b.name} size="sm" />
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-900 dark:text-white">{b.name}</span><span className="flex items-center gap-1 text-xs text-slate-500"><Cake size={12} /> {whenLabel(b.days)}, {shortDate(b.date)}</span></span>
              <Wish id={key('bday', b.name, b.date)} name={b.name} wished={wishes.includes(key('bday', b.name, b.date))} onWish={wish} />
            </li>
          )} />
          <PeopleList title="Work anniversaries" items={anniversaries.slice(0, 6)} empty="No anniversaries in the next three months." render={(a) => (
            <li key={a.name} className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-semibold text-white tabular-nums dark:bg-brand-500">{a.years}</span>
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-900 dark:text-white">{a.name}</span><span className="block text-xs text-slate-500">{a.years} {a.years === 1 ? 'year' : 'years'}, {whenLabel(a.days).toLowerCase()}</span></span>
              <Wish id={key('anniv', a.name, a.date)} name={a.name} wished={wishes.includes(key('anniv', a.name, a.date))} onWish={wish} />
            </li>
          )} />
          <PeopleList title="New joiners" items={joiners} empty="No new joiners this year." render={(p) => (
            <li key={p.id} className="flex items-center gap-3">
              <Avatar name={p.name} size="sm" />
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-900 dark:text-white">{p.name}</span><span className="block truncate text-xs text-slate-500">{p.role}</span></span>
              <a href={`mailto:${p.email}?subject=Welcome to Rex`} className="btn-ghost h-8 shrink-0 px-2.5 text-xs">Say hello</a>
            </li>
          )} />
        </aside>
      </div>

      <Modal open={sharing} onClose={() => setSharing(false)} title="Share recognition">
        <form onSubmit={share} className="space-y-4">
          <fieldset>
            <legend className="text-sm font-medium">Type</legend>
            <div className="mt-1.5 flex gap-2">
              {[['kudos', 'Kudos'], ['anniversary', 'Work anniversary']].map(([k, l]) => (
                <button type="button" key={k} onClick={() => setF({ ...f, kind: k })} aria-pressed={f.kind === k} className={`btn h-8 px-3 ${f.kind === k ? 'bg-brand-700 text-white dark:bg-brand-500' : 'btn-secondary'}`}>{l}</button>
              ))}
            </div>
          </fieldset>
          <label className="block text-sm font-medium" htmlFor="ms-person">Colleague
            <select id="ms-person" className="input mt-1.5" value={f.person} onChange={(e) => setF({ ...f, person: e.target.value })}>{people.map((p) => <option key={p.id}>{p.name}</option>)}</select>
          </label>
          {f.kind === 'anniversary' && (
            <label className="block text-sm font-medium" htmlFor="ms-years">Years at Rex
              <input id="ms-years" type="number" min={1} max={50} required className="input mt-1.5" value={f.years} onChange={(e) => setF({ ...f, years: Number(e.target.value) })} />
            </label>
          )}
          <label className="block text-sm font-medium" htmlFor="ms-msg">Message
            <textarea id="ms-msg" required rows={3} className="input mt-1.5" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} placeholder="What did they do, and why it mattered" />
          </label>
          <div className="flex justify-end gap-2"><button type="button" onClick={() => setSharing(false)} className="btn-ghost">Cancel</button><button className="btn-primary">Share</button></div>
        </form>
      </Modal>
    </div>
  )
}
