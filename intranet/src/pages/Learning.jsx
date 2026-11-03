import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChartBarIcon as BarChart3, CalculatorIcon as Calculator, ClockIcon as Clock, GraduationCapIcon as GraduationCap, HeadphonesIcon as Headphones, PlayCircleIcon as PlayCircle, ShieldCheckIcon as ShieldCheck, StarIcon as Star, UsersIcon as Users } from '@phosphor-icons/react'
import { courses } from '../data'
import { useCourseProgress } from '../hooks/useCourseProgress'
import Photo from '../components/Photo'

const daysLeft = (d) => Math.ceil((new Date(`${d}T23:59`) - new Date()) / 86400000)
const hours = (m) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ''}` : `${m} min`)
const shortDate = (d) => new Date(`${d}T00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })

// Cover used until a course has its own thumbnail image: a tinted field with the category's icon.
const covers = {
  Compliance: { Icon: ShieldCheck, cls: 'bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-200' },
  Insurance: { Icon: GraduationCap, cls: 'bg-accent-100 text-accent-700 dark:bg-accent-700/25 dark:text-accent-400' },
  Customer: { Icon: Headphones, cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' },
  'Tools & data': { Icon: BarChart3, cls: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300' },
  Leadership: { Icon: Users, cls: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300' },
}

function Cover({ course }) {
  if (course.image) return <Photo src={course.image} alt="" className="aspect-video w-full" rounded="rounded-none" />
  const { Icon, cls } = covers[course.category] ?? { Icon: Calculator, cls: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' }
  return (
    <div className={`relative flex aspect-video w-full items-center justify-center overflow-hidden ${cls}`} aria-hidden="true">
      <Icon size={56} weight="light" className="transition duration-300 group-hover:scale-110" />
      <span className="absolute bottom-3 left-4 text-xs font-semibold opacity-80">{course.category}</span>
    </div>
  )
}

function Stars({ rating }) {
  return (
    <span className="flex items-center gap-1 text-xs">
      <b className="text-amber-700 dark:text-amber-400">{rating.toFixed(1)}</b>
      <span className="flex" aria-label={`Rated ${rating} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={12} weight="fill" className={n <= Math.round(rating) ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'} />)}
      </span>
    </span>
  )
}

function CourseCard({ course, pct }) {
  const left = course.due ? daysLeft(course.due) : null
  const action = pct === 100 ? 'Review' : pct > 0 ? 'Continue' : 'Start'
  return (
    <Link to={`/learning/${course.id}`} className="card card-hover group flex flex-col overflow-hidden text-left">
      <Cover course={course} />
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {course.mandatory && (
          <p className={`text-xs font-semibold ${pct === 100 ? 'text-emerald-700 dark:text-emerald-400' : left <= 21 ? 'text-accent-700 dark:text-accent-400' : 'text-slate-500'}`}>
            {pct === 100 ? 'Required, completed' : `Required, due ${shortDate(course.due)} (${left} days)`}
          </p>
        )}
        <h3 className="line-clamp-2 font-semibold leading-snug text-slate-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">{course.title}</h3>
        <p className="text-xs text-slate-500">{course.instructor}</p>
        <div className="flex items-center gap-1.5">
          <Stars rating={course.rating} />
          <span className="text-xs text-slate-400">({course.reviews})</span>
        </div>
        <p className="flex items-center gap-1 text-xs text-slate-500"><Clock size={12} /> {hours(course.mins)}, {course.level.toLowerCase()}</p>
        <div className="mt-auto pt-3">
          {pct > 0 && (
            <div className="mb-2">
              <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800"><div className={`h-1.5 rounded-full ${pct === 100 ? 'bg-emerald-500' : 'bg-accent-600'}`} style={{ width: `${pct}%` }} /></div>
              <p className="mt-1 text-xs text-slate-500">{pct}% complete</p>
            </div>
          )}
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 dark:text-brand-300"><PlayCircle size={16} /> {action}</span>
        </div>
      </div>
    </Link>
  )
}

export default function Learning() {
  const { pct } = useCourseProgress()
  const [cat, setCat] = useState('All')

  const mandatory = courses.filter((c) => c.mandatory)
  const inProgress = courses.filter((c) => !c.mandatory && pct(c) > 0 && pct(c) < 100)
  const cats = ['All', ...new Set(courses.filter((c) => !c.mandatory).map((c) => c.category))]
  const catalogue = courses.filter((c) => !c.mandatory && (cat === 'All' || c.category === cat))
  const done = courses.filter((c) => pct(c) === 100).length
  const outstanding = mandatory.filter((c) => pct(c) < 100).length
  const mins = Math.round(courses.reduce((t, c) => t + (c.mins * pct(c)) / 100, 0))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">Learning</h1>
        <p className="mt-1 text-sm text-slate-500">
          {hours(mins)} learned this year, {done} {done === 1 ? 'course' : 'courses'} completed{outstanding ? `, ${outstanding} required ${outstanding === 1 ? 'course' : 'courses'} to finish` : ''}.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Required for you</h2>
        <div className="stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mandatory.map((c) => <CourseCard key={c.id} course={c} pct={pct(c)} />)}
        </div>
      </section>

      {inProgress.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Continue learning</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {inProgress.map((c) => <CourseCard key={c.id} course={c} pct={pct(c)} />)}
          </div>
        </section>
      )}

      <section>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-lg font-semibold">Course catalogue</h2>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist">
            {cats.map((c) => <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`chip shrink-0 px-3 py-1.5 text-sm transition ${cat === c ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700'}`}>{c}</button>)}
          </div>
        </div>
        <div className="stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {catalogue.map((c) => <CourseCard key={c.id} course={c} pct={pct(c)} />)}
        </div>
      </section>
    </div>
  )
}
