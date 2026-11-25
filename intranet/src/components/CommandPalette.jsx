import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowElbowDownLeftIcon as CornerDownLeft, FileTextIcon as FileText, NewspaperIcon as Newspaper, MagnifyingGlassIcon as Search, BookOpenIcon as BookOpen, GraduationCapIcon as GraduationCap } from '@phosphor-icons/react'
import { courses, documents, news } from '../data'
import { articles } from '../data/knowledge'
import { navFor } from '../config/nav'
import { useUser } from '../context/UserContext'

export default function CommandPalette({ open, onClose }) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const { user } = useUser()

  useEffect(() => {
    if (open) {
      setQ('')
      setActive(0)
    }
  }, [open])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    const match = (s) => s.toLowerCase().includes(term)
    const pages = navFor(user).flatMap((g) => g.items)
    const items = pages.filter((p) => !term || match(p.label)).map((p) => ({ group: 'Pages', label: p.label, icon: p.icon, to: p.to }))
    if (term) {
      documents.filter((d) => match(d.title) || match(d.category)).slice(0, 5)
        .forEach((d) => items.push({ group: 'Documents', label: d.title, meta: d.category, icon: FileText, to: `/knowledge?tab=documents&q=${encodeURIComponent(d.title)}` }))
      articles.filter((a) => match(a.title) || match(a.category)).slice(0, 4)
        .forEach((a) => items.push({ group: 'Knowledge', label: a.title, meta: a.category, icon: BookOpen, to: `/knowledge/${a.id}` }))
      courses.filter((c) => match(c.title) || match(c.category)).slice(0, 3)
        .forEach((c) => items.push({ group: 'Courses', label: c.title, meta: c.instructor, icon: GraduationCap, to: `/learning/${c.id}` }))
      news.filter((n) => match(n.title) || match(n.category)).slice(0, 4)
        .forEach((n) => items.push({ group: 'News', label: n.title, meta: n.category, icon: Newspaper, to: `/news/${n.id}` }))
    }
    return items
  }, [q, user])

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
      <div className="absolute inset-0 bg-slate-900/30" onClick={onClose} />
      <div className="animate-fade-up relative w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_24px_60px_-20px_rgba(30,45,100,0.4)] dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 dark:border-slate-800">
          <Search size={18} className="text-slate-400" />
          <input
            autoFocus
            value={q}
            onChange={(e) => { setQ(e.target.value); setActive(0) }}
            onKeyDown={onKeyDown}
            placeholder="Search pages, policies, courses, news"
            className="h-12 w-full bg-transparent text-[15px] outline-none"
          />
          <kbd className="rounded border border-slate-200 px-1.5 text-[10px] text-slate-400 dark:border-slate-700">ESC</kbd>
        </div>
        <ul className="max-h-[55vh] overflow-y-auto p-1.5">
          {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-slate-500">No results for “{q}”</li>}
          {results.map((r, i) => {
            const header = r.group !== lastGroup ? r.group : null
            lastGroup = r.group
            const Ico = r.icon
            return (
              <li key={r.group + r.label}>
                {header && <div className="px-3 pt-3 pb-1 text-xs font-medium text-slate-500">{header}</div>}
                <button
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm ${i === active ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white' : ''}`}
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
