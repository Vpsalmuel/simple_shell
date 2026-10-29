import { useState } from 'react'
import { MessageCircle, Plus, Send } from 'lucide-react'
import { people } from '../data'
import { milestones as seed } from '../data/culture'
import { adminDepts } from '../config/nav'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useUser } from '../context/UserContext'
import { useToast } from '../components/Toast'
import Avatar from '../components/Avatar'
import Modal from '../components/Modal'

const emojis = ['🎉', '👏', '❤️']
const fmt = (d) => new Date(`${d}T00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })

function MilestoneCard({ m, user }) {
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
    <article className="card p-5">
      <header className="flex items-start gap-3">
        <Avatar name={m.person} size="lg" status={person?.status} />
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-bold">{m.person}</p>
          <p className="truncate text-sm text-slate-500">{person?.role}</p>
        </div>
        <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-accent-600 font-display text-white"><span className="text-lg leading-none font-extrabold">{m.years}</span><span className="text-[9px] font-semibold uppercase">{m.years === 1 ? 'year' : 'years'}</span></span>
      </header>
      <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">{m.message}</p>
      <p className="mt-2 text-xs text-slate-400">{fmt(m.date)}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
        {emojis.map((e) => {
          const on = mine.includes(e)
          return (
            <button key={e} onClick={() => react(e)} aria-pressed={on} className={`chip gap-1.5 px-3 py-1 text-sm transition ${on ? 'bg-accent-100 text-accent-800 ring-1 ring-accent-400 dark:bg-accent-700/30 dark:text-accent-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}`}>
              <span aria-hidden="true">{e}</span><span className="tabular-nums">{(m.reactions?.[e] ?? 0) + (on ? 1 : 0)}</span>
            </button>
          )
        })}
        <button onClick={() => setOpen(!open)} aria-expanded={open} className="btn-ghost ml-auto px-3 py-1 text-sm"><MessageCircle size={14} /> {comments.length ? `${comments.length} ${comments.length === 1 ? 'comment' : 'comments'}` : 'Congratulate'}</button>
      </div>
      {open && (
        <div className="animate-fade-up mt-3 space-y-3">
          {comments.length === 0 && <p className="text-sm text-slate-500">No comments yet. Be the first to congratulate {m.person.split(' ')[0]}.</p>}
          {comments.map((c, i) => <div key={i} className="flex gap-2"><Avatar name={c.name} size="sm" /><p className="min-w-0 rounded-2xl bg-slate-100 px-3 py-2 text-sm break-words dark:bg-slate-800"><b>{c.name}</b> {c.text}</p></div>)}
          <form onSubmit={post} className="flex gap-2">
            <label htmlFor={`mc-${m.id}`} className="sr-only">Write a congratulation</label>
            <input id={`mc-${m.id}`} className="input" placeholder={`Congratulate ${m.person.split(' ')[0]}…`} value={draft} onChange={(e) => setDraft(e.target.value)} />
            <button className="btn-primary px-3" disabled={!draft.trim()} aria-label="Post"><Send size={16} /></button>
          </form>
        </div>
      )}
    </article>
  )
}

export default function Milestones() {
  const { user } = useUser()
  const toast = useToast()
  const [extra, setExtra] = useLocalStorage('rex-milestones', [])
  const [sharing, setSharing] = useState(false)
  const [f, setF] = useState({ person: people[0].name, years: 1, message: '' })
  const canShare = adminDepts.includes(user.dept)
  const all = [...extra, ...seed].sort((a, b) => b.date.localeCompare(a.date))
  const shown = all

  const share = (e) => {
    e.preventDefault()
    setExtra([{ id: `x${Date.now()}`, ...f, date: new Date().toISOString().slice(0, 10), reactions: {} }, ...extra])
    setSharing(false)
    setF({ ...f, message: '' })
    toast(`Anniversary shared for ${f.person}`)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">Milestones</h1>
          <p className="mt-1 text-sm text-slate-500">Work anniversaries across Rex. Thank you for your years with us.</p>
        </div>
        {canShare && <button onClick={() => setSharing(true)} className="btn bg-accent-600 text-white hover:bg-accent-700"><Plus size={16} /> Share an anniversary</button>}
      </div>
      <div className="stagger space-y-4">{shown.map((m) => <MilestoneCard key={m.id} m={m} user={user} />)}</div>
      {shown.length === 0 && <div className="card p-10 text-center text-sm text-slate-500">No work anniversaries yet.</div>}

      <Modal open={sharing} onClose={() => setSharing(false)} title="Share a work anniversary">
        <form onSubmit={share} className="space-y-4">
          <label className="block text-sm font-medium" htmlFor="ms-person">Colleague
            <select id="ms-person" className="input mt-1" value={f.person} onChange={(e) => setF({ ...f, person: e.target.value })}>{people.map((p) => <option key={p.id}>{p.name}</option>)}</select>
          </label>
          <label className="block text-sm font-medium" htmlFor="ms-years">Years at Rex
            <input id="ms-years" type="number" min={1} max={50} required className="input mt-1" value={f.years} onChange={(e) => setF({ ...f, years: Number(e.target.value) })} />
          </label>
          <label className="block text-sm font-medium" htmlFor="ms-msg">Message
            <textarea id="ms-msg" required rows={3} className="input mt-1" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} placeholder="A short thank-you for their years with us" />
          </label>
          <div className="flex justify-end gap-2"><button type="button" onClick={() => setSharing(false)} className="btn-ghost">Cancel</button><button className="btn-primary">Share</button></div>
        </form>
      </Modal>
    </div>
  )
}
