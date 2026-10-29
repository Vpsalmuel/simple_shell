import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, List, Mail, MapPin, MessageSquare, Phone, Search, X } from 'lucide-react'
import { departments, people } from '../data'
import Avatar from '../components/Avatar'
import Portal from '../components/Portal'
import { EmptyIllustration } from '../components/Illustrations'

const statusLabel = { online: 'Available', meeting: 'In a meeting', away: 'Away', offline: 'Offline' }

function ProfilePanel({ person, onClose }) {
  if (!person) return null
  const reports = people.filter((p) => p.manager === person.name)
  return (
    <Portal>
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={person.name}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="animate-fade-up absolute inset-y-0 right-0 w-full max-w-md overflow-y-auto bg-white shadow-2xl dark:bg-slate-900">
        <div className="relative h-28 bg-brand-700">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full border-[18px] border-accent-600/80" />
          <button onClick={onClose} className="absolute top-4 left-4 rounded-lg bg-white/10 p-1.5 text-white hover:bg-white/20" aria-label="Close"><X size={18} /></button>
        </div>
        <div className="-mt-10 px-6 pb-8">
          <div className="rounded-full bg-white p-1 inline-block dark:bg-slate-900"><Avatar name={person.name} size="xl" status={person.status} /></div>
          <h2 className="mt-3 text-xl font-bold">{person.name}</h2>
          <p className="text-sm text-slate-500">{person.role} · {person.dept}</p>
          <p className="mt-1 text-xs text-slate-400">{statusLabel[person.status]}</p>
          {person.bio && <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{person.bio}</p>}

          <div className="mt-5 grid grid-cols-3 gap-2">
            <a href={`mailto:${person.email}`} className="btn border border-slate-200 dark:border-slate-700"><Mail size={16} /> Email</a>
            <a href={`tel:${person.phone}`} className="btn border border-slate-200 dark:border-slate-700"><Phone size={16} /> Call</a>
            <button className="btn-primary"><MessageSquare size={16} /> Chat</button>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Email</dt><dd className="truncate">{person.email}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Phone</dt><dd>{person.phone}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Location</dt><dd>{person.location}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Reports to</dt><dd>{person.manager}</dd></div>
          </dl>

          <h3 className="mt-6 text-sm font-semibold">Skills</h3>
          <div className="mt-2 flex flex-wrap gap-2">{person.skills.map((s) => <span key={s} className="chip bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-200">{s}</span>)}</div>

          {reports.length > 0 && (
            <>
              <h3 className="mt-6 text-sm font-semibold">Direct reports ({reports.length})</h3>
              <ul className="mt-2 space-y-2">{reports.map((r) => <li key={r.id} className="flex items-center gap-3 text-sm"><Avatar name={r.name} size="sm" status={r.status} />{r.name}<span className="text-xs text-slate-400">{r.role}</span></li>)}</ul>
            </>
          )}
        </div>
      </aside>
    </div>
    </Portal>
  )
}

export default function People() {
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')
  const [dept, setDept] = useState('All')
  const [view, setView] = useState('grid')
  const selected = people.find((p) => String(p.id) === params.get('id'))

  const filtered = useMemo(() => {
    const t = q.toLowerCase()
    return people.filter((p) => (dept === 'All' || p.dept === dept) && [p.name, p.role, p.location, ...p.skills].some((s) => s.toLowerCase().includes(t)))
  }, [q, dept])

  const open = (p) => setParams({ id: p.id })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">People directory</h1>
        <p className="mt-1 text-sm text-slate-500">{people.length} colleagues across {departments.length} departments</p>
      </div>

      <div className="card flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Search by name, role, skill or city" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="input sm:w-56" value={dept} onChange={(e) => setDept(e.target.value)} aria-label="Department">
          <option>All</option>
          {departments.map((d) => <option key={d}>{d}</option>)}
        </select>
        <div className="flex rounded-xl border border-slate-200 p-1 dark:border-slate-700">
          <button onClick={() => setView('grid')} className={`rounded-lg p-1.5 ${view === 'grid' ? 'bg-brand-700 text-white' : 'text-slate-500'}`} aria-label="Grid view"><LayoutGrid size={16} /></button>
          <button onClick={() => setView('list')} className={`rounded-lg p-1.5 ${view === 'list' ? 'bg-brand-700 text-white' : 'text-slate-500'}`} aria-label="List view"><List size={16} /></button>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="card flex flex-col items-center p-12 text-center">
          <EmptyIllustration />
          <p className="mt-4 font-semibold">No one matches “{q}”</p>
          <p className="text-sm text-slate-500">Try a different name, skill or department.</p>
          <button onClick={() => { setQ(''); setDept('All') }} className="btn-ghost mt-3 border border-slate-200 dark:border-slate-700">Clear filters</button>
        </div>
      )}

      {view === 'grid' ? (
        <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <button key={p.id} onClick={() => open(p)} className="card card-hover p-5 text-center hover:border-brand-200 dark:hover:border-brand-700">
              <Avatar name={p.name} size="lg" status={p.status} />
              <p className="mt-3 font-semibold">{p.name}</p>
              <p className="text-sm text-slate-500">{p.role}</p>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs">
                <span className="chip bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-200">{p.dept}</span>
                <span className="inline-flex items-center gap-1 text-slate-400"><MapPin size={12} />{p.location}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="card divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.map((p) => (
            <button key={p.id} onClick={() => open(p)} className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <Avatar name={p.name} status={p.status} />
              <div className="min-w-0 flex-1"><p className="truncate font-medium">{p.name}</p><p className="truncate text-sm text-slate-500">{p.role}</p></div>
              <span className="hidden text-sm text-slate-500 md:block">{p.dept}</span>
              <span className="hidden text-sm text-slate-400 lg:block">{p.email}</span>
            </button>
          ))}
        </div>
      )}

      <ProfilePanel person={selected} onClose={() => setParams({})} />
    </div>
  )
}
