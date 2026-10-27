import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Clock, Phone, Send } from 'lucide-react'
import { faqs, helpCategories } from '../data/knowledge'
import { initialRequests, priorities } from '../data/requests'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useUser } from '../context/UserContext'
import { useToast } from '../components/Toast'
import Icon from '../components/Icon'
import Modal from '../components/Modal'
import SectionHeader from '../components/SectionHeader'
import StatusBadge from '../components/StatusBadge'

const statusTone = { Submitted: 'neutral', 'In progress': 'warning', 'Awaiting approval': 'warning', Completed: 'good', Rejected: 'critical', Cancelled: 'neutral' }

export default function Help() {
  const { user } = useUser()
  const toast = useToast()
  // Help tickets live in the same store as the Request Centre, so each team has one queue.
  const [requests, setRequests] = useLocalStorage('rex-requests', initialRequests)
  const [cat, setCat] = useState(null)
  const [open, setOpen] = useState(0)
  const [f, setF] = useState({ title: '', priority: 'Medium', description: '' })
  const mine = requests.filter((r) => r.requestedBy === user.name && r.type === 'Help ticket')

  const submit = (e) => {
    e.preventDefault()
    const id = `REQ-${1000 + requests.length + 1}`
    const at = new Date().toISOString()
    const due = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10)
    setRequests([{ id, title: f.title, type: 'Help ticket', from: user.dept, to: cat.dept, requestedBy: user.name, priority: f.priority, due, status: 'Submitted', owner: null, description: f.description, comments: [], history: [{ action: 'Submitted', by: user.name, at }] }, ...requests])
    setCat(null)
    setF({ title: '', priority: 'Medium', description: '' })
    toast(`${id} sent to ${cat.label}`)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">Help Desk</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><Clock size={14} /> Standard tickets are picked up within 2 working hours.</p>
      </div>

      <section>
        <SectionHeader title="Get help from" />
        <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {helpCategories.map((c) => (
            <button key={c.id} onClick={() => setCat(c)} className="card card-hover group flex flex-col p-5 text-left">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-700 group-hover:text-white dark:bg-slate-800 dark:text-brand-200"><Icon name={c.icon} size={20} /></span>
              <span className="mt-4 font-display text-lg font-bold">{c.label}</span>
              <span className="text-sm text-slate-500">{c.text}</span>
              <span className="mt-4 flex items-center justify-between text-xs"><span className="inline-flex items-center gap-1 text-slate-500"><Phone size={12} />{c.contact}</span><span className="font-semibold text-accent-700 dark:text-accent-400">Raise a ticket →</span></span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px] [&>*]:min-w-0">
        <section className="card p-5">
          <SectionHeader title="Common questions" action={<Link to="/knowledge" className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-300">Knowledge Center</Link>} />
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {faqs.map((x, i) => (
              <li key={x.q}>
                <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 py-3.5 text-left font-medium">
                  {x.q}<ChevronDown size={18} className={`shrink-0 text-slate-400 transition ${open === i ? 'rotate-180' : ''}`} />
                </button>
                {open === i && <p className="animate-fade-up pb-4 text-sm text-slate-600 dark:text-slate-300">{x.a}</p>}
              </li>
            ))}
          </ul>
        </section>
        <section className="card p-5">
          <SectionHeader title="My help tickets" action={<Link to="/requests?tab=mine" className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-300">All requests</Link>} />
          {mine.length === 0 ? <p className="text-sm text-slate-500">You haven’t raised any help tickets yet.</p> : (
            <ul className="space-y-3">
              {mine.map((r) => (
                <li key={r.id}><Link to={`/requests?id=${r.id}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{r.title}</span><span className="text-xs text-slate-500">{r.id} · {r.to}</span></span>
                  <StatusBadge tone={statusTone[r.status]}>{r.status}</StatusBadge>
                </Link></li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {cat && (
        <Modal open onClose={() => setCat(null)} title={`Raise a ticket: ${cat.label}`}>
          <form onSubmit={submit} className="space-y-4">
            <label className="block text-sm font-medium" htmlFor="hd-title">What’s the problem?
              <input id="hd-title" required className="input mt-1" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="e.g. Can’t connect to VPN from home" />
            </label>
            <label className="block text-sm font-medium" htmlFor="hd-desc">Details
              <textarea id="hd-desc" required rows={4} className="input mt-1" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="What happened, and what have you tried?" />
            </label>
            <fieldset>
              <legend className="text-sm font-medium">Priority</legend>
              <div className="mt-2 flex flex-wrap gap-2">{priorities.map((p) => <button type="button" key={p} onClick={() => setF({ ...f, priority: p })} aria-pressed={f.priority === p} className={`chip px-3 py-1 text-sm ${f.priority === p ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{p}</button>)}</div>
            </fieldset>
            <p className="text-xs text-slate-500">For anything blocking your work right now, also call {cat.contact}.</p>
            <div className="flex justify-end gap-2"><button type="button" onClick={() => setCat(null)} className="btn-ghost">Cancel</button><button className="btn-primary"><Send size={16} /> Send ticket</button></div>
          </form>
        </Modal>
      )}
    </div>
  )
}
