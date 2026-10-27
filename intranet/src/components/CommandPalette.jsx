import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Search, User, ShieldCheck, LayoutDashboard, CornerDownLeft } from 'lucide-react'
import { people, documents, claims } from '../data'

const pages = [
  { label: 'Home', to: '/', icon: LayoutDashboard },
  { label: 'People directory', to: '/people', icon: User },
  { label: 'Claims & policy hub', to: '/claims', icon: ShieldCheck },
  { label: 'Docs & HR', to: '/docs', icon: FileText },
]

export default function CommandPalette({ open, onClose }) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      setQ('')
      setActive(0)
    }
  }, [open])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    const match = (s) => s.toLowerCase().includes(term)
    const items = [
      ...pages.filter((p) => !term || match(p.label)).map((p) => ({ group: 'Pages', label: p.label, icon: p.icon, to: p.to })),
    ]
    if (term) {
      people.filter((p) => match(p.name) || match(p.role) || match(p.dept)).slice(0, 5)
        .forEach((p) => items.push({ group: 'People', label: p.name, meta: p.role, icon: User, to: `/people?id=${p.id}` }))
      documents.filter((d) => match(d.title) || match(d.category)).slice(0, 5)
        .forEach((d) => items.push({ group: 'Documents', label: d.title, meta: d.category, icon: FileText, to: `/docs?q=${encodeURIComponent(d.title)}` }))
      claims.filter((c) => match(c.id) || match(c.insured)).slice(0, 5)
        .forEach((c) => items.push({ group: 'Claims', label: c.id, meta: c.insured, icon: ShieldCheck, to: `/claims?claim=${c.id}` }))
    }
    return items
  }, [q])

  const go = (item) => {
    navigate(item.to)
    onClose()
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    if (e.key === 'Enter' && results[active]) go(results[active])
    if (e.key === 'Escape') onClose()
  }

  if (!open) return null
  let lastGroup = null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-fade-up relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 dark:border-slate-800">
          <Search size={18} className="text-slate-400" />
          <input
            autoFocus
            value={q}
            onChange={(e) => { setQ(e.target.value); setActive(0) }}
            onKeyDown={onKeyDown}
            placeholder="Search people, documents, claims…"
            className="h-14 w-full bg-transparent text-sm outline-none"
          />
          <kbd className="rounded border border-slate-200 px-1.5 text-[10px] text-slate-400 dark:border-slate-700">ESC</kbd>
        </div>
        <ul className="max-h-[55vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-slate-500">No results for “{q}”</li>}
          {results.map((r, i) => {
            const header = r.group !== lastGroup ? r.group : null
            lastGroup = r.group
            const Ico = r.icon
            return (
              <li key={r.group + r.label}>
                {header && <div className="px-3 pt-3 pb-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">{header}</div>}
                <button
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${i === active ? 'bg-brand-50 text-brand-800 dark:bg-brand-900/50 dark:text-white' : ''}`}
                >
                  <Ico size={16} className="shrink-0 text-slate-400" />
                  <span className="flex-1 truncate">{r.label}</span>
                  {r.meta && <span className="truncate text-xs text-slate-400">{r.meta}</span>}
                  {i === active && <CornerDownLeft size={14} className="text-slate-400" />}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
