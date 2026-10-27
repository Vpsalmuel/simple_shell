import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, Eye, Search, ThumbsDown, ThumbsUp } from 'lucide-react'
import { articleCategories, articles } from '../data/knowledge'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { EmptyIllustration } from '../components/Illustrations'

const fmt = (d) => new Date(`${d}T00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

function Article({ a }) {
  const [votes, setVotes] = useLocalStorage('rex-kb-votes', {})
  const related = articles.filter((x) => x.category === a.category && x.id !== a.id).concat(articles.filter((x) => x.category !== a.category)).slice(0, 3)
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px] [&>*]:min-w-0">
      <article>
        <Link to="/knowledge" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline dark:text-brand-300"><ArrowLeft size={14} /> Knowledge Center</Link>
        <span className="chip mt-4 bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-200">{a.category}</span>
        <h1 className="mt-2 text-3xl font-extrabold text-balance">{a.title}</h1>
        <p className="mt-2 text-sm text-slate-500">Owned by {a.owner} · Updated {fmt(a.updated)}</p>
        <div className="mt-6 max-w-[65ch] space-y-6">
          <p className="text-lg text-slate-700 dark:text-slate-300">{a.excerpt}</p>
          {a.body.map(([h, t]) => <section key={h}><h2 className="text-lg font-bold">{h}</h2><p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-300">{t}</p></section>)}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6 text-sm dark:border-slate-800" aria-live="polite">
          {votes[a.id] ? <span className="text-slate-600 dark:text-slate-300">Thanks for the feedback.</span> : (
            <>
              <span>Was this helpful?</span>
              <button onClick={() => setVotes({ ...votes, [a.id]: 'yes' })} className="btn-ghost border border-slate-200 px-3 py-1.5 dark:border-slate-700"><ThumbsUp size={14} /> Yes</button>
              <button onClick={() => setVotes({ ...votes, [a.id]: 'no' })} className="btn-ghost border border-slate-200 px-3 py-1.5 dark:border-slate-700"><ThumbsDown size={14} /> No</button>
            </>
          )}
        </div>
      </article>
      <aside className="space-y-3 lg:pt-10">
        <h2 className="text-sm font-semibold text-slate-500">Related articles</h2>
        {related.map((r) => <Link key={r.id} to={`/knowledge/${r.id}`} className="card card-hover block p-4"><span className="text-xs text-slate-500">{r.category}</span><span className="mt-1 block font-semibold">{r.title}</span></Link>)}
      </aside>
    </div>
  )
}

export default function Knowledge() {
  const { id } = useParams()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const shown = useMemo(() => {
    const t = q.toLowerCase()
    return articles.filter((a) => (cat === 'All' || a.category === cat) && [a.title, a.excerpt, ...a.body.flat()].some((s) => s.toLowerCase().includes(t)))
  }, [q, cat])

  if (id) {
    const a = articles.find((x) => x.id === id)
    return a ? <Article a={a} /> : <p className="text-slate-500">Article not found. <Link to="/knowledge" className="text-brand-600 underline">Back to Knowledge Center</Link></p>
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-brand-700 p-6 text-white sm:p-10">
        <div className="pointer-events-none absolute -top-1/2 -right-20 h-[180%] w-1/2 rounded-full bg-accent-600/30 blur-3xl" />
        <h1 className="relative text-3xl font-extrabold sm:text-4xl">Knowledge Center</h1>
        <p className="relative mt-2 text-brand-100">Policies, procedures, guides and answers, all in one place.</p>
        <div className="relative mt-6 max-w-xl">
          <Search size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
          <label htmlFor="kb-q" className="sr-only">Search the Knowledge Center</label>
          <input id="kb-q" className="h-12 w-full rounded-2xl bg-white pr-4 pl-11 text-slate-900 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-accent-500/40" placeholder="Search for leave, travel, claims SOP…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </section>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {['All', ...articleCategories].map((c) => <button key={c} onClick={() => setCat(c)} className={`chip shrink-0 px-3 py-1.5 text-sm transition ${cat === c ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700'}`}>{c}</button>)}
      </div>

      {shown.length === 0 ? (
        <div className="card flex flex-col items-center p-12 text-center"><EmptyIllustration /><p className="mt-3 font-semibold">No articles match “{q}”</p><p className="text-sm text-slate-500">Try other words, or ask the Help Desk.</p><Link to="/help" className="btn-primary mt-4">Go to Help Desk</Link></div>
      ) : (
        <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((a) => (
            <Link key={a.id} to={`/knowledge/${a.id}`} className="card card-hover flex flex-col p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="chip bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-200">{a.category}</span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-400"><Eye size={12} />{a.views.toLocaleString()}</span>
              </div>
              <h2 className="mt-3 flex items-start gap-2 font-display text-lg leading-snug font-bold"><BookOpen size={18} className="mt-1 shrink-0 text-accent-600" />{a.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{a.excerpt}</p>
              <p className="mt-auto pt-4 text-xs text-slate-400">{a.owner} · {fmt(a.updated)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
