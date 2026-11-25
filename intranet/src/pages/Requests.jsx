import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CalendarIcon as Calendar, TrayIcon as Inbox, ChatTextIcon as MessageSquare, PlusIcon as Plus, MagnifyingGlassIcon as Search, PaperPlaneTiltIcon as Send, XIcon as X } from '@phosphor-icons/react'
import { closedStatuses, initialRequests, priorities, requestDesks } from '../data/requests'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useUser } from '../context/UserContext'
import { useToast } from '../components/Toast'
import Avatar from '../components/Avatar'
import Modal from '../components/Modal'
import Portal from '../components/Portal'
import StatusBadge from '../components/StatusBadge'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'

const statusTone = { Submitted: 'neutral', 'In progress': 'warning', 'Awaiting approval': 'warning', Completed: 'good', Rejected: 'critical', Cancelled: 'neutral' }
const priorityCls = {
  Low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  Medium: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
  High: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  Urgent: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
}
const fmt = (d) => new Date(d.length === 10 ? `${d}T00:00` : d).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
const fmtTime = (d) => new Date(d).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

function NewRequest({ to, onCreate, onClose }) {
  const desk = (d) => requestDesks.find((x) => x.dept === d) ?? requestDesks[0]
  const [f, setF] = useState({ title: '', to: desk(to).dept, type: desk(to).types[0], priority: 'Medium', due: '', description: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  return (
    <Modal open onClose={onClose} title="New request" wide>
      <form onSubmit={(e) => { e.preventDefault(); onCreate(f) }} className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium sm:col-span-2" htmlFor="rq-title">What do you need?
          <input id="rq-title" required className="input mt-1" value={f.title} onChange={set('title')} placeholder="e.g. Access to the reinsurance ledger" />
        </label>
        <label className="block text-sm font-medium" htmlFor="rq-to">Send to
          <select id="rq-to" className="input mt-1" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value, type: desk(e.target.value).types[0] })}>{requestDesks.map((d) => <option key={d.dept} value={d.dept}>{d.short === d.dept ? d.dept : `${d.short} (${d.dept})`}</option>)}</select>
        </label>
        <label className="block text-sm font-medium" htmlFor="rq-type">Type
          <select id="rq-type" className="input mt-1" value={f.type} onChange={set('type')}>{desk(f.to).types.map((t) => <option key={t}>{t}</option>)}</select>
        </label>
        <fieldset className="sm:col-span-1">
          <legend className="text-sm font-medium">Priority</legend>
          <div className="mt-1.5 flex flex-wrap gap-1.5">{priorities.map((p) => <button type="button" key={p} onClick={() => setF({ ...f, priority: p })} aria-pressed={f.priority === p} className={`btn h-8 px-3 ${f.priority === p ? 'bg-brand-700 text-white dark:bg-brand-500' : 'btn-secondary'}`}>{p}</button>)}</div>
        </fieldset>
        <label className="block text-sm font-medium" htmlFor="rq-due">Needed by
          <input id="rq-due" type="date" required min={new Date().toISOString().slice(0, 10)} className="input mt-1" value={f.due} onChange={set('due')} />
        </label>
        <label className="block text-sm font-medium sm:col-span-2" htmlFor="rq-desc">Details
          <textarea id="rq-desc" required rows={4} className="input mt-1" value={f.description} onChange={set('description')} placeholder="Give the receiving team everything they need to act." />
        </label>
        <div className="flex justify-end gap-2 sm:col-span-2">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button className="btn-primary"><Send size={16} /> Submit request</button>
        </div>
      </form>
    </Modal>
  )
}

function Detail({ req, user, onUpdate, onClose }) {
  const [draft, setDraft] = useState('')
  const isReceiver = user.dept === req.to
  const isRequester = user.name === req.requestedBy
  const open = !closedStatuses.includes(req.status)
  const now = () => new Date().toISOString()

  const setStatus = (status, extra = {}) => onUpdate({ ...req, ...extra, status, history: [...req.history, { action: extra.owner && !req.owner ? `Assigned to ${extra.owner}` : status, by: user.name, at: now() }] })
  const comment = (e) => {
    e.preventDefault()
    if (!draft.trim()) return
    onUpdate({ ...req, comments: [...req.comments, { author: user.name, text: draft.trim(), at: now() }] })
    setDraft('')
  }

  return (
    <Portal>
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={req.title}>
      <div className="absolute inset-0 bg-slate-900/30" onClick={onClose} />
      <aside className="animate-fade-up absolute inset-y-0 right-0 flex w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-[0_0_60px_-20px_rgba(30,45,100,0.35)] dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-start gap-3 border-b border-slate-100 p-5 dark:border-slate-800">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs text-slate-500">{req.id}</span><StatusBadge tone={statusTone[req.status]}>{req.status}</StatusBadge><span className={`chip ${priorityCls[req.priority]}`}>{req.priority}</span></div>
            <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{req.title}</h2>
          </div>
          <button onClick={onClose} className="btn-ghost p-2" aria-label="Close"><X size={18} /></button>
        </header>
        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div><dt className="text-xs text-slate-500">From</dt><dd>{req.requestedBy} · {req.from}</dd></div>
            <div><dt className="text-xs text-slate-500">Sent to</dt><dd>{req.to}</dd></div>
            <div><dt className="text-xs text-slate-500">Type</dt><dd>{req.type}</dd></div>
            <div><dt className="text-xs text-slate-500">Needed by</dt><dd>{fmt(req.due)}</dd></div>
            <div className="col-span-2"><dt className="text-xs text-slate-500">Owner</dt><dd>{req.owner ?? 'Not assigned yet'}</dd></div>
          </dl>
          <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">{req.description}</p>

          {open && (isReceiver || isRequester) && (
            <div className="flex flex-wrap gap-2">
              {isReceiver && !req.owner && <button onClick={() => setStatus('In progress', { owner: user.name })} className="btn-primary">Assign to me</button>}
              {isReceiver && req.owner && req.status !== 'In progress' && <button onClick={() => setStatus('In progress')} className="btn-ghost border border-slate-200 dark:border-slate-700">Mark in progress</button>}
              {isReceiver && <button onClick={() => setStatus('Awaiting approval')} disabled={req.status === 'Awaiting approval'} className="btn-ghost border border-slate-200 dark:border-slate-700">Needs approval</button>}
              {isReceiver && <button onClick={() => setStatus('Completed', { owner: req.owner ?? user.name })} className="btn bg-emerald-600 text-white hover:bg-emerald-700">Mark completed</button>}
              {isReceiver && <button onClick={() => setStatus('Rejected')} className="btn-ghost text-rose-600">Reject</button>}
              {isRequester && !isReceiver && <button onClick={() => setStatus('Cancelled')} className="btn-ghost text-rose-600">Cancel request</button>}
            </div>
          )}
          {open && !isReceiver && !isRequester && <p className="text-xs text-slate-500">Only {req.to} can update this request.</p>}

          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><MessageSquare size={16} /> Comments ({req.comments.length})</h3>
            <ul className="space-y-3">
              {req.comments.map((c, i) => (
                <li key={i} className="flex gap-3"><Avatar name={c.author} size="sm" /><div className="min-w-0 text-sm"><p className="font-medium text-slate-900 dark:text-white">{c.author} <span className="text-xs font-normal text-slate-500">{fmtTime(c.at)}</span></p><p className="break-words">{c.text}</p></div></li>
              ))}
            </ul>
            <form onSubmit={comment} className="mt-3 flex gap-2">
              <label htmlFor="rq-comment" className="sr-only">Add a comment</label>
              <input id="rq-comment" className="input" placeholder="Add a comment…" value={draft} onChange={(e) => setDraft(e.target.value)} />
              <button className="btn-primary" disabled={!draft.trim()}><Send size={16} /></button>
            </form>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold">History</h3>
            <ol className="space-y-3 border-l-2 border-slate-200 pl-4 text-sm dark:border-slate-700">
              {[...req.history].reverse().map((h, i) => (
                <li key={i} className="relative"><span className="absolute top-1.5 -left-[21px] h-2.5 w-2.5 rounded-full bg-brand-500" /><b>{h.action}</b> <span className="text-slate-500">· {h.by} · {fmtTime(h.at)}</span></li>
              ))}
            </ol>
          </section>
        </div>
      </aside>
    </div>
    </Portal>
  )
}

export default function Requests() {
  const { user } = useUser()
  const toast = useToast()
  const [requests, setRequests] = useLocalStorage('rex-requests-v2', initialRequests)
  const [params, setParams] = useSearchParams()
  const [tab, setTab] = useState(params.get('tab') ?? 'all')
  const [q, setQ] = useState('')
  const [creating, setCreating] = useState(params.get('new') === '1' ? (params.get('to') ?? requestDesks[0].dept) : null)
  const selected = requests.find((r) => r.id === params.get('id'))

  const queue = requests.filter((r) => r.to === user.dept && !closedStatuses.includes(r.status))
  const tabs = [
    { id: 'all', label: 'All', test: () => true },
    { id: 'mine', label: 'Mine', test: (r) => r.requestedBy === user.name },
    ...(requestDesks.some((d) => d.dept === user.dept) || queue.length ? [{ id: 'queue', label: `${user.dept} queue`, test: (r) => r.to === user.dept, badge: queue.length }] : []),
    { id: 'open', label: 'Open', test: (r) => !closedStatuses.includes(r.status) },
    { id: 'closed', label: 'Resolved', test: (r) => closedStatuses.includes(r.status) },
  ]
  const shown = useMemo(() => {
    const t = q.toLowerCase()
    const test = tabs.find((x) => x.id === tab)?.test ?? (() => true)
    return requests.filter((r) => test(r) && [r.id, r.title, r.requestedBy, r.to].some((s) => s.toLowerCase().includes(t)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests, tab, q, user])

  const update = (r) => setRequests(requests.map((x) => (x.id === r.id ? r : x)))
  const create = (f) => {
    const id = `REQ-${1000 + requests.length + 1}`
    const at = new Date().toISOString()
    setRequests([{ id, ...f, from: user.dept, requestedBy: user.name, status: 'Submitted', owner: null, comments: [], history: [{ action: 'Submitted', by: user.name, at }] }, ...requests])
    setCreating(null)
    setTab('mine')
    toast(`${id} sent to ${f.to}`)
  }

  return (
    <div>
      <PageHeader title="Requests" description="Ask Brand, IT or Admin for help, and track what you’ve asked for." />

      {/* 17 Nov review: one place to send requests to Brand, IT and Admin. */}
      <section aria-label="Send a request" className="mb-10 grid gap-3 md:grid-cols-3">
        {requestDesks.map((d) => (
          <button key={d.dept} onClick={() => setCreating(d.dept)} className="card card-hover group flex items-start gap-4 p-5 text-left">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-700 group-hover:text-white dark:bg-brand-500/15 dark:text-brand-200 dark:group-hover:bg-brand-500"><Icon name={d.icon} size={20} /></span>
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">Request from {d.short} <Plus size={14} className="text-slate-400 transition-colors group-hover:text-brand-700 dark:group-hover:text-brand-300" /></span>
              <span className="mt-0.5 block text-sm text-slate-500">{d.desc}</span>
            </span>
          </button>
        ))}
      </section>

      <div className="mb-4 flex flex-col gap-3 border-b border-slate-200 lg:flex-row lg:items-end lg:justify-between dark:border-slate-800">
        <nav className="-mb-px flex gap-6 overflow-x-auto" role="tablist" aria-label="Filter requests">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`flex shrink-0 items-center gap-1.5 border-b-2 pb-3 text-sm font-medium transition-colors ${tab === t.id ? 'border-brand-700 text-slate-900 dark:border-brand-300 dark:text-white' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>
              {t.label}{t.badge > 0 && <span className="rounded-md bg-accent-700 px-1.5 text-[11px] font-semibold text-white tabular-nums">{t.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="relative pb-3 lg:w-72">
          <Search size={16} className="absolute top-[calc(50%-6px)] left-3 -translate-y-1/2 text-slate-400" />
          <label htmlFor="rq-q" className="sr-only">Search requests</label>
          <input id="rq-q" className="input h-9 pl-9" placeholder="Search by ID, title or person" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="card px-6 py-12 text-center"><p className="font-medium text-slate-900 dark:text-white">No requests here</p><p className="mt-1 text-sm text-slate-500">Try another tab, or send a new request above.</p></div>
      ) : (
        <ul className="card divide-y divide-slate-100 dark:divide-slate-800">
          {shown.map((r) => (
            <li key={r.id}>
              <button onClick={() => setParams({ id: r.id })} className="grid w-full gap-2 px-5 py-3.5 text-left transition-colors hover:bg-slate-50 md:grid-cols-[minmax(0,1fr)_10rem_5rem_12rem] md:items-center md:gap-6 dark:hover:bg-slate-800/50">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-slate-900 dark:text-white">{r.title}</span>
                  <span className="block truncate text-xs text-slate-500"><span className="font-mono">{r.id}</span>, {r.requestedBy}, {r.from}</span>
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300"><Inbox size={14} className="shrink-0 text-slate-400" /><span className="truncate">{r.to}</span></span>
                <span className="flex items-center gap-1 text-xs text-slate-500"><Calendar size={12} />{fmt(r.due)}</span>
                <span className="flex flex-wrap gap-1.5"><StatusBadge tone={statusTone[r.status]}>{r.status}</StatusBadge>{['High', 'Urgent'].includes(r.priority) && <span className={`chip ${priorityCls[r.priority]}`}>{r.priority}</span>}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {creating && <NewRequest to={creating} onCreate={create} onClose={() => setCreating(null)} />}
      {selected && <Detail req={selected} user={user} onUpdate={update} onClose={() => setParams({})} />}
    </div>
  )
}
