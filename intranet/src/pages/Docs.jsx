import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CalendarPlus, DoorOpen, Download, FileText, Laptop, Pin, Search, Wallet } from 'lucide-react'
import { documents, leaveBalance } from '../data'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useToast } from '../components/Toast'
import Modal from '../components/Modal'
import MeetingRoomModal from '../components/MeetingRoomModal'
import SectionHeader from '../components/SectionHeader'
import { EmptyIllustration } from '../components/Illustrations'

const typeTone = { PDF: 'bg-rose-100 text-rose-700', XLSX: 'bg-emerald-100 text-emerald-700', DOCX: 'bg-sky-100 text-sky-700', PPTX: 'bg-accent-100 text-accent-700', ZIP: 'bg-slate-200 text-slate-700' }

function LeaveForm({ onDone }) {
  const [form, setForm] = useState({ type: 'Annual', from: '', to: '', note: '' })
  const days = form.from && form.to ? Math.max(0, Math.round((new Date(form.to) - new Date(form.from)) / 86400000) + 1) : 0
  return (
    <form onSubmit={(e) => { e.preventDefault(); onDone(`Leave request sent for ${days} day${days === 1 ? '' : 's'}`) }} className="space-y-4">
      <label className="block text-sm font-medium">Leave type
        <select className="input mt-1" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{leaveBalance.map((l) => <option key={l.type}>{l.type}</option>)}</select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-medium">From<input type="date" required className="input mt-1" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} /></label>
        <label className="block text-sm font-medium">To<input type="date" required min={form.from} className="input mt-1" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} /></label>
      </div>
      {days > 0 && <p className="rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-700 dark:bg-slate-800 dark:text-brand-200">{days} calendar day{days === 1 ? '' : 's'} · goes to Arthur Pendelton for approval</p>}
      <label className="block text-sm font-medium">Note (optional)<textarea rows={2} className="input mt-1" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label>
      <div className="flex justify-end"><button className="btn-primary">Submit request</button></div>
    </form>
  )
}

function TicketForm({ onDone }) {
  const [priority, setPriority] = useState('Normal')
  return (
    <form onSubmit={(e) => { e.preventDefault(); onDone(`IT ticket raised (${priority} priority)`) }} className="space-y-4">
      <label className="block text-sm font-medium">Category
        <select className="input mt-1"><option>Hardware</option><option>Software / access</option><option>Network / VPN</option><option>Email</option></select>
      </label>
      <label className="block text-sm font-medium">Describe the issue<textarea required rows={3} className="input mt-1" placeholder="What happened, and what did you expect?" /></label>
      <fieldset>
        <legend className="text-sm font-medium">Priority</legend>
        <div className="mt-2 flex gap-2">{['Low', 'Normal', 'Urgent'].map((p) => <button type="button" key={p} onClick={() => setPriority(p)} className={`chip px-3 py-1 text-sm ${priority === p ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{p}</button>)}</div>
      </fieldset>
      <div className="flex justify-end"><button className="btn-primary">Raise ticket</button></div>
    </form>
  )
}

export default function Docs() {
  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')
  const [cat, setCat] = useState('All')
  const [pins, setPins] = useLocalStorage('rex-pins', documents.filter((d) => d.pinned).map((d) => d.id))
  const [modal, setModal] = useState(null)
  const toast = useToast()
  const cats = ['All', ...new Set(documents.map((d) => d.category))]

  const filtered = useMemo(() => {
    const t = q.toLowerCase()
    return documents
      .filter((d) => (cat === 'All' || d.category === cat) && (d.title.toLowerCase().includes(t) || d.owner.toLowerCase().includes(t)))
      .sort((a, b) => pins.includes(b.id) - pins.includes(a.id))
  }, [q, cat, pins])

  const togglePin = (id) => setPins(pins.includes(id) ? pins.filter((x) => x !== id) : [...pins, id])
  const done = (msg) => { setModal(null); toast(msg) }

  const actions = [
    { key: 'leave', label: 'Request leave', desc: 'Annual, sick or study', icon: CalendarPlus },
    { key: 'ticket', label: 'IT ticket', desc: 'Access, hardware, VPN', icon: Laptop },
    { key: 'payslip', label: 'Payslips', desc: 'Download latest', icon: Wallet },
    { key: 'room', label: 'Book meeting room', desc: 'Opens SeamlessHR', icon: DoorOpen },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">Docs & HR</h1>
        <p className="mt-1 text-sm text-slate-500">Policies, templates and self-service in one place.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="stagger grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {actions.map((a) => (
            <button key={a.key} onClick={() => (a.key === 'payslip' ? toast('October payslip downloaded') : setModal(a.key))} className="card card-hover group p-5 text-left">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600 transition group-hover:bg-accent-600 group-hover:text-white dark:bg-accent-700/20"><a.icon size={20} /></span>
              <p className="mt-4 font-semibold">{a.label}</p>
              <p className="text-sm text-slate-500">{a.desc}</p>
            </button>
          ))}
        </section>
        <section className="card p-5">
          <SectionHeader title="Leave balance" />
          <ul className="space-y-4">
            {leaveBalance.map((l) => (
              <li key={l.type}>
                <div className="mb-1 flex justify-between text-sm"><span>{l.type}</span><span className="text-slate-500"><b className="text-slate-900 dark:text-white">{l.total - l.used}</b> / {l.total} days left</span></div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-2 rounded-full bg-accent-600" style={{ width: `${((l.total - l.used) / l.total) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card p-5">
        <SectionHeader title="Document library" subtitle="Pin the files you use most" />
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9" placeholder="Search documents" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1">
            {cats.map((c) => <button key={c} onClick={() => setCat(c)} className={`chip shrink-0 px-3 py-1.5 text-sm ${cat === c ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{c}</button>)}
          </div>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-10 text-center">
            <EmptyIllustration />
            <p className="mt-3 font-semibold">No documents match</p>
            <p className="text-sm text-slate-500">Try another keyword or category.</p>
          </div>
        )}
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.map((d) => {
            const pinned = pins.includes(d.id)
            return (
              <li key={d.id} className="flex items-center gap-4 py-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[10px] font-bold ${typeTone[d.type]}`}>{d.type}</span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 truncate font-medium"><FileText size={14} className="shrink-0 text-slate-400" /><span className="truncate">{d.title}</span></p>
                  <p className="truncate text-xs text-slate-500">{d.owner} · {d.size} · Updated {new Date(d.updated).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <button onClick={() => togglePin(d.id)} className={`btn-ghost p-2 ${pinned ? 'text-accent-600' : ''}`} aria-pressed={pinned} aria-label={pinned ? 'Unpin' : 'Pin'}><Pin size={16} className={pinned ? 'fill-current' : ''} /></button>
                <button onClick={() => toast(`Downloading ${d.title}`)} className="btn-ghost p-2" aria-label={`Download ${d.title}`}><Download size={16} /></button>
              </li>
            )
          })}
        </ul>
      </section>

      <Modal open={modal === 'leave'} onClose={() => setModal(null)} title="Request leave"><LeaveForm onDone={done} /></Modal>
      <MeetingRoomModal open={modal === 'room'} onClose={() => setModal(null)} />
      <Modal open={modal === 'ticket'} onClose={() => setModal(null)} title="Raise an IT ticket"><TicketForm onDone={done} /></Modal>
    </div>
  )
}
