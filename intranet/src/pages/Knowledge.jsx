import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeftIcon as ArrowLeft, ClockIcon as Clock, DownloadSimpleIcon as Download, MagnifyingGlassIcon as Search, PushPinIcon as Pin, StarIcon as Star, ThumbsDownIcon as ThumbsDown, ThumbsUpIcon as ThumbsUp } from '@phosphor-icons/react'
import { articleCategories, articles } from '../data/knowledge'
import { courses, documents } from '../data'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useCourseProgress } from '../hooks/useCourseProgress'
import { useToast } from '../components/Toast'
import PageHeader from '../components/PageHeader'
import Photo from '../components/Photo'

// Knowledge Center and Learning, merged into one page with three tabs (17 Nov review).
const MAX_PINS = 3 // 17 Nov review: people can pin at most three items.
const fmt = (d) => new Date(`${d}T00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
const hours = (m) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ''}` : `${m} min`)
const tabs = [['articles', 'Policies & guides'], ['courses', 'Courses'], ['documents', 'Documents']]

function Article({ a }) {
  const [votes, setVotes] = useLocalStorage('rex-kb-votes', {})
  const related = articles.filter((x) => x.category === a.category && x.id !== a.id).concat(articles.filter((x) => x.category !== a.category)).slice(0, 4)
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <article className="min-w-0">
        <Link to="/knowledge" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white"><ArrowLeft size={14} /> Knowledge & Learning</Link>
        <p className="mt-6 text-xs font-medium text-accent-700 dark:text-accent-400">{a.category}</p>
        <h1 className="mt-1 text-[28px] leading-tight font-semibold text-slate-900 dark:text-white">{a.title}</h1>
        <p className="mt-2 text-sm text-slate-500">Owned by {a.owner}, updated {fmt(a.updated)}</p>
        <div className="mt-8 max-w-[65ch] space-y-6">
          <p className="text-[17px] leading-relaxed text-slate-700 dark:text-slate-300">{a.excerpt}</p>
          {a.body.map(([h, t]) => <section key={h}><h2 className="text-base font-semibold text-slate-900 dark:text-white">{h}</h2><p className="mt-1.5 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">{t}</p></section>)}
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-6 text-sm dark:border-slate-800" aria-live="polite">
          {votes[a.id] ? <span className="text-slate-600 dark:text-slate-300">Thanks for the feedback.</span> : (
            <>
              <span className="mr-2 text-slate-600 dark:text-slate-300">Was this helpful?</span>
              <button onClick={() => setVotes({ ...votes, [a.id]: 'yes' })} className="btn-secondary h-8 px-3"><ThumbsUp size={14} /> Yes</button>
              <button onClick={() => setVotes({ ...votes, [a.id]: 'no' })} className="btn-secondary h-8 px-3"><ThumbsDown size={14} /> No</button>
            </>
          )}
        </div>
      </article>
      <aside className="lg:pt-16">
        <h2 className="mb-3 text-xs font-medium text-slate-500">Related</h2>
        <ul className="space-y-3">{related.map((r) => <li key={r.id}><Link to={`/knowledge/${r.id}`} className="group block"><span className="block text-sm font-medium text-slate-800 group-hover:text-brand-700 dark:text-slate-200 dark:group-hover:text-brand-300">{r.title}</span><span className="text-xs text-slate-500">{r.category}</span></Link></li>)}</ul>
      </aside>
    </div>
  )
}

function SearchBox({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
      <label className="sr-only" htmlFor="kl-q">{placeholder}</label>
      <input id="kl-q" className="input h-9 pl-9" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

function Filter({ options, value, onChange }) {
  return (
    <div className="-mx-1 flex gap-1 overflow-x-auto px-1" role="group" aria-label="Filter">
      {options.map((c) => <button key={c} onClick={() => onChange(c)} aria-pressed={value === c} className={`h-8 shrink-0 rounded-lg px-3 text-sm transition-colors ${value === c ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>{c}</button>)}
    </div>
  )
}

function Articles({ q }) {
  const [cat, setCat] = useState('All')
  const shown = useMemo(() => {
    const t = q.toLowerCase()
    return articles.filter((a) => (cat === 'All' || a.category === cat) && [a.title, a.excerpt, ...a.body.flat()].some((s) => s.toLowerCase().includes(t)))
  }, [q, cat])
  return (
    <>
      <Filter options={['All', ...articleCategories]} value={cat} onChange={setCat} />
      {shown.length === 0 ? <Empty q={q} /> : (
        <ul className="mt-4 card divide-y divide-slate-100 dark:divide-slate-800">
          {shown.map((a) => (
            <li key={a.id}>
              <Link to={`/knowledge/${a.id}`} className="group grid gap-1 px-5 py-4 transition-colors hover:bg-slate-50 sm:grid-cols-[minmax(0,1fr)_10rem] sm:gap-6 dark:hover:bg-slate-800/50">
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-slate-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">{a.title}</span>
                  <span className="mt-0.5 block truncate text-sm text-slate-500">{a.excerpt}</span>
                </span>
                <span className="text-xs text-slate-500 sm:text-right"><span className="block">{a.category}</span><span>Updated {fmt(a.updated)}</span></span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function CourseCard({ course, pct }) {
  const action = pct === 100 ? 'Review' : pct > 0 ? 'Continue' : 'Start'
  return (
    <Link to={`/learning/${course.id}`} className="group flex flex-col">
      <Photo src={course.image} alt="" className="aspect-video w-full" rounded="rounded-lg" />
      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="line-clamp-2 text-sm leading-snug font-semibold text-slate-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">{course.title}</h3>
        <p className="mt-1 text-xs text-slate-500">{course.instructor}</p>
        <p className="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-0.5"><Star size={12} weight="fill" className="text-amber-500" /> <b className="font-medium text-slate-700 dark:text-slate-200">{course.rating.toFixed(1)}</b></span>
          <span className="inline-flex items-center gap-1"><Clock size={12} /> {hours(course.mins)}</span>
          <span>{course.level}</span>
        </p>
        {pct > 0 ? (
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1 flex-1 rounded-full bg-slate-200 dark:bg-slate-800"><div className={`h-1 rounded-full ${pct === 100 ? 'bg-emerald-500' : 'bg-accent-600'}`} style={{ width: `${pct}%` }} /></div>
            <span className="text-xs text-slate-500 tabular-nums">{pct === 100 ? 'Done' : `${pct}%`}</span>
          </div>
        ) : <span className="mt-3 text-xs font-medium text-brand-700 dark:text-brand-300">{action}</span>}
      </div>
    </Link>
  )
}

function Courses({ q }) {
  const { pct } = useCourseProgress()
  const [cat, setCat] = useState('All')
  const t = q.toLowerCase()
  const match = (c) => !t || [c.title, c.instructor, c.category].some((s) => s.toLowerCase().includes(t))
  const required = courses.filter((c) => c.mandatory && match(c))
  const cats = ['All', ...new Set(courses.filter((c) => !c.mandatory).map((c) => c.category))]
  const catalogue = courses.filter((c) => !c.mandatory && match(c) && (cat === 'All' || c.category === cat))
  const outstanding = required.filter((c) => pct(c) < 100)
  return (
    <div className="space-y-12">
      {required.length > 0 && (
        <section>
          <h2 className="section-title">Required for you</h2>
          <p className="mt-0.5 mb-4 text-sm text-slate-500">{outstanding.length ? `${outstanding.length} to finish, due ${fmt(outstanding[0].due)}` : 'All required training is complete.'}</p>
          <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">{required.map((c) => <CourseCard key={c.id} course={c} pct={pct(c)} />)}</div>
        </section>
      )}
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="section-title">Course catalogue</h2>
          <Filter options={cats} value={cat} onChange={setCat} />
        </div>
        {catalogue.length === 0 ? <Empty q={q} /> : <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{catalogue.map((c) => <CourseCard key={c.id} course={c} pct={pct(c)} />)}</div>}
      </section>
    </div>
  )
}

function Documents({ q }) {
  const toast = useToast()
  const [pins, setPins] = useLocalStorage('rex-pins', documents.filter((d) => d.pinned).map((d) => d.id).slice(0, MAX_PINS))
  const pinsCapped = pins.slice(0, MAX_PINS)
  const t = q.toLowerCase()
  const shown = documents
    .filter((d) => d.title.toLowerCase().includes(t) || d.owner.toLowerCase().includes(t) || d.category.toLowerCase().includes(t))
    .sort((a, b) => pinsCapped.includes(b.id) - pinsCapped.includes(a.id))
  const togglePin = (d) => {
    if (pinsCapped.includes(d.id)) return setPins(pinsCapped.filter((x) => x !== d.id))
    if (pinsCapped.length >= MAX_PINS) return toast(`You can pin up to ${MAX_PINS} documents. Unpin one first.`)
    setPins([...pinsCapped, d.id])
  }
  return (
    <>
      <p className="mb-3 text-sm text-slate-500">Pinned documents stay at the top. You can pin up to {MAX_PINS} ({pinsCapped.length} pinned).</p>
      {shown.length === 0 ? <Empty q={q} /> : (
        <ul className="card divide-y divide-slate-100 dark:divide-slate-800">
          {shown.map((d) => {
            const pinned = pinsCapped.includes(d.id)
            return (
              <li key={d.id} className="flex items-center gap-4 px-5 py-3">
                <span className="w-11 shrink-0 text-xs font-medium text-slate-500">{d.type}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{d.title}</p>
                  <p className="truncate text-xs text-slate-500">{d.owner}, {d.size}, updated {fmt(d.updated)}</p>
                </div>
                <button onClick={() => togglePin(d)} className={`btn-ghost h-8 w-8 px-0 ${pinned ? 'text-accent-700 dark:text-accent-400' : ''}`} aria-pressed={pinned} aria-label={pinned ? `Unpin ${d.title}` : `Pin ${d.title}`}><Pin size={16} weight={pinned ? 'fill' : 'regular'} /></button>
                <button onClick={() => toast(`Downloading ${d.title}`)} className="btn-ghost h-8 w-8 px-0" aria-label={`Download ${d.title}`}><Download size={16} /></button>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

function Empty({ q }) {
  return (
    <div className="card mt-4 px-6 py-12 text-center">
      <p className="font-medium text-slate-900 dark:text-white">Nothing matches “{q}”</p>
      <p className="mt-1 text-sm text-slate-500">Try other words, or <Link to="/help" className="link">ask the Help Desk</Link>.</p>
    </div>
  )
}

export default function Knowledge() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const tab = tabs.some(([k]) => k === params.get('tab')) ? params.get('tab') : 'articles'
  const [q, setQ] = useState(params.get('q') ?? '')

  if (id) {
    const a = articles.find((x) => x.id === id)
    return a ? <Article a={a} /> : <p className="text-slate-500">Article not found. <Link to="/knowledge" className="link">Back to Knowledge & Learning</Link></p>
  }

  return (
    <div>
      <PageHeader title="Knowledge & Learning" description="Policies, procedures, documents and training in one place." />
      <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 sm:flex-row sm:items-end sm:justify-between dark:border-slate-800">
        <nav className="-mb-px flex gap-6" role="tablist" aria-label="Sections">
          {tabs.map(([k, label]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => { setParams(k === 'articles' ? {} : { tab: k }); setQ('') }} className={`border-b-2 pb-3 text-sm font-medium transition-colors ${tab === k ? 'border-brand-700 text-slate-900 dark:border-brand-300 dark:text-white' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>{label}</button>
          ))}
        </nav>
        <div className="pb-3"><SearchBox value={q} onChange={setQ} placeholder={tab === 'courses' ? 'Search courses' : tab === 'documents' ? 'Search documents' : 'Search policies and guides'} /></div>
      </div>
      {tab === 'articles' && <Articles q={q} />}
      {tab === 'courses' && <Courses q={q} />}
      {tab === 'documents' && <Documents q={q} />}
    </div>
  )
}
