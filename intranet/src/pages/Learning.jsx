import { useState } from 'react'
import { AlertTriangle, Award, BookOpen, CheckCircle2, Clock, PlayCircle } from 'lucide-react'
import { courses } from '../data'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useToast } from '../components/Toast'
import SectionHeader from '../components/SectionHeader'

const daysLeft = (d) => Math.ceil((new Date(`${d}T23:59`) - new Date()) / 86400000)
const hours = (m) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ''}` : `${m} min`)

function Ring({ pct, size = 44 }) {
  const r = (size - 6) / 2
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90" role="img" aria-label={`${pct}% complete`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="5" className="stroke-slate-100 dark:stroke-slate-800" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="5" strokeLinecap="round" stroke={pct === 100 ? '#10b981' : 'var(--color-chart-2)'} strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} className="transition-[stroke-dashoffset] duration-700" />
    </svg>
  )
}

export default function Learning() {
  // Demo progress per course, starting from the sample data.
  const [progress, setProgress] = useLocalStorage('rex-learning', Object.fromEntries(courses.map((c) => [c.id, c.progress])))
  const [cat, setCat] = useState('All')
  const toast = useToast()
  const pct = (c) => progress[c.id] ?? 0
  const cats = ['All', ...new Set(courses.map((c) => c.category))]

  const mandatory = courses.filter((c) => c.mandatory)
  const inProgress = courses.filter((c) => !c.mandatory && pct(c) > 0 && pct(c) < 100)
  const catalogue = courses.filter((c) => !c.mandatory && (cat === 'All' || c.category === cat))
  const done = courses.filter((c) => pct(c) === 100)
  const mins = courses.reduce((t, c) => t + (c.mins * pct(c)) / 100, 0)

  const advance = (c) => {
    const next = Math.min(100, pct(c) + (pct(c) === 0 ? 25 : 35))
    setProgress({ ...progress, [c.id]: next })
    toast(next === 100 ? `Completed: ${c.title}` : pct(c) === 0 ? `Started: ${c.title}` : `Progress saved: ${c.title}`)
  }

  const action = (c) => (pct(c) === 100 ? 'Review' : pct(c) > 0 ? 'Continue' : 'Start')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">Learning</h1>
        <p className="mt-1 text-sm text-slate-500">Required training and courses to grow your career at Rex.</p>
      </div>

      <section className="stagger grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Your learning summary">
        <div className="card flex items-center gap-4 p-5"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-200"><Clock size={20} /></span><div><p className="font-display text-2xl font-extrabold tabular-nums">{hours(Math.round(mins))}</p><p className="text-xs text-slate-500">Learning time this year</p></div></div>
        <div className="card flex items-center gap-4 p-5"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"><Award size={20} /></span><div><p className="font-display text-2xl font-extrabold tabular-nums">{done.length}</p><p className="text-xs text-slate-500">Courses completed</p></div></div>
        <div className="card flex items-center gap-4 p-5"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600 dark:bg-accent-700/20"><BookOpen size={20} /></span><div><p className="font-display text-2xl font-extrabold tabular-nums">{mandatory.filter((c) => pct(c) < 100).length}</p><p className="text-xs text-slate-500">Required courses outstanding</p></div></div>
      </section>

      <section className="card p-5">
        <SectionHeader title="Required for you" subtitle="Compliance training every colleague must complete" />
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {mandatory.map((c) => {
            const left = daysLeft(c.due)
            const complete = pct(c) === 100
            return (
              <li key={c.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-4">
                  <Ring pct={pct(c)} />
                  <div className="min-w-0">
                    <p className="font-semibold">{c.title}</p>
                    <p className="text-xs text-slate-500">{hours(c.mins)} · {pct(c)}% complete</p>
                  </div>
                </div>
                {complete ? (
                  <span className="chip gap-1 self-start bg-emerald-50 text-emerald-700 sm:self-auto dark:bg-emerald-500/10 dark:text-emerald-400"><CheckCircle2 size={12} /> Completed</span>
                ) : (
                  <span className={`chip gap-1 self-start sm:self-auto ${left <= 21 ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                    {left <= 21 && <AlertTriangle size={12} />} Due {new Date(`${c.due}T00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} · {left} days
                  </span>
                )}
                <button onClick={() => advance(c)} className={complete ? 'btn-ghost border border-slate-200 dark:border-slate-700' : 'btn-primary'}><PlayCircle size={16} /> {action(c)}</button>
              </li>
            )
          })}
        </ul>
      </section>

      {inProgress.length > 0 && (
        <section>
          <SectionHeader title="Continue learning" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {inProgress.map((c) => (
              <button key={c.id} onClick={() => advance(c)} className="card card-hover flex items-center gap-4 p-4 text-left">
                <Ring pct={pct(c)} />
                <span className="min-w-0"><span className="block truncate font-semibold">{c.title}</span><span className="text-xs text-slate-500">{pct(c)}% · {c.category}</span></span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionHeader title="Course catalogue" subtitle={`${courses.filter((c) => !c.mandatory).length} courses`} />
        <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
          {cats.filter((c) => c !== 'Compliance').map((c) => <button key={c} onClick={() => setCat(c)} className={`chip shrink-0 px-3 py-1.5 text-sm transition ${cat === c ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700'}`}>{c}</button>)}
        </div>
        <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {catalogue.map((c) => (
            <article key={c.id} className="card card-hover flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="chip bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-200">{c.category}</span>
                {pct(c) > 0 && <Ring pct={pct(c)} size={32} />}
              </div>
              <h3 className="mt-3 font-display text-lg leading-snug font-bold">{c.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{hours(c.mins)} · {c.level}</p>
              <button onClick={() => advance(c)} className="btn mt-4 self-start border border-slate-200 px-3 py-1.5 hover:border-brand-400 dark:border-slate-700"><PlayCircle size={16} /> {action(c)}</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
