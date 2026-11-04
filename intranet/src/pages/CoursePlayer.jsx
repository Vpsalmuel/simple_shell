import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon as ArrowLeft, ArrowRightIcon as ArrowRight, CheckCircleIcon as CheckCircle2, CaretRightIcon as ChevronRight, CircleIcon as Circle, ClockIcon as Clock, PlayCircleIcon as PlayCircle, StarIcon as Star } from '@phosphor-icons/react'
import { courses } from '../data'
import { useCourseProgress } from '../hooks/useCourseProgress'
import { useToast } from '../components/Toast'
import Photo from '../components/Photo'
import VideoPlayer from '../components/VideoPlayer'

const hours = (m) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ''}` : `${m} min`)

// Course player in the style of Udemy and Coursera: video on the left, course content and other courses on the right.
export default function CoursePlayer() {
  const { id } = useParams()
  const course = courses.find((c) => c.id === id)
  const { pct, doneLessons, completeLesson } = useCourseProgress()
  const toast = useToast()
  const done = course ? doneLessons(course) : []
  const firstOpen = course?.lessons.find((l) => !done.includes(l.id)) ?? course?.lessons[0]
  const [lessonId, setLessonId] = useState(firstOpen?.id)
  const [tab, setTab] = useState('overview')

  useEffect(() => { setLessonId(firstOpen?.id); setTab('overview'); window.scrollTo?.(0, 0) }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!course) return <Navigate to="/learning" replace />

  const index = Math.max(0, course.lessons.findIndex((l) => l.id === lessonId))
  const lesson = course.lessons[index]
  const next = course.lessons[index + 1]
  const percent = pct(course)
  const more = courses.filter((c) => c.id !== course.id).sort((a, b) => (b.category === course.category) - (a.category === course.category)).slice(0, 5)

  const onComplete = () => {
    const p = completeLesson(course, lesson.id)
    toast(p === 100 ? `Course completed: ${course.title}` : `Lesson complete: ${lesson.title}`)
  }

  const contents = (
    <section className="card overflow-hidden" aria-label="Course content">
      <header className="border-b border-slate-100 p-4 dark:border-slate-800">
        <h2 className="font-semibold">Course content</h2>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{done.length} of {course.lessons.length} lessons complete · {hours(course.mins)}</p>
        <div className="mt-3 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800"><div className={`h-1.5 rounded-full transition-[width] ${percent === 100 ? 'bg-emerald-500' : 'bg-accent-600'}`} style={{ width: `${percent}%` }} /></div>
      </header>
      <ol className="max-h-[26rem] overflow-y-auto py-1">
        {course.lessons.map((l, i) => {
          const isDone = done.includes(l.id)
          const current = l.id === lesson.id
          return (
            <li key={l.id}>
              <button
                onClick={() => setLessonId(l.id)}
                aria-current={current ? 'true' : undefined}
                className={`flex w-full items-start gap-3 px-4 py-3 text-left text-sm transition ${current ? 'bg-brand-50 dark:bg-brand-500/15' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'}`}
              >
                {isDone
                  ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-label="Completed" />
                  : current ? <PlayCircle size={18} className="mt-0.5 shrink-0 text-brand-700 dark:text-brand-300" /> : <Circle size={18} className="mt-0.5 shrink-0 text-slate-300 dark:text-slate-600" />}
                <span className="min-w-0 flex-1">
                  <span className={`block ${current ? 'font-semibold text-brand-800 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>{i + 1}. {l.title}</span>
                  <span className="mt-0.5 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400"><Clock size={12} /> {l.mins} min</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )

  return (
    <div className="space-y-5">
      <nav className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
        <Link to="/learning" className="inline-flex items-center gap-1 font-medium hover:text-brand-700 dark:hover:text-white"><ArrowLeft size={14} /> Learning</Link>
        <ChevronRight size={14} className="text-slate-300 dark:text-slate-600" />
        <span>{course.category}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] [&>*]:min-w-0">
        <div className="space-y-5">
          <VideoPlayer
            key={lesson.id}
            src={lesson.src}
            poster={course.image}
            title={`${index + 1}. ${lesson.title}`}
            duration={`${lesson.mins}:00`}
            watched={done.includes(lesson.id)}
            onComplete={onComplete}
            hint="Video placeholder: add each lesson's video URL in src/data/index.js"
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-accent-700 dark:text-accent-400">Lesson {index + 1} of {course.lessons.length}</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{course.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
                <span>{course.instructor}</span>
                <span className="flex items-center gap-1"><Star size={14} weight="fill" className="text-amber-500" /> <b className="text-slate-900 dark:text-white">{course.rating.toFixed(1)}</b> ({course.reviews} ratings)</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {hours(course.mins)}</span>
                <span>{course.level}</span>
              </div>
            </div>
            {next && (
              <button onClick={() => setLessonId(next.id)} className={`btn shrink-0 ${done.includes(lesson.id) ? 'btn-primary' : 'border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'}`}>
                Next lesson <ArrowRight size={16} />
              </button>
            )}
          </div>

          <div className="border-b border-slate-200 dark:border-slate-800" role="tablist">
            {[['overview', 'Overview'], ['content', 'Course content']].map(([k, label]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`-mb-px border-b-2 px-1 py-2.5 mr-6 text-sm font-semibold transition ${k === 'content' ? 'lg:hidden' : ''} ${tab === k ? 'border-brand-700 text-brand-800 dark:border-brand-300 dark:text-white' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}>{label}</button>
            ))}
          </div>

          {tab === 'content' ? <div className="lg:hidden">{contents}</div> : (
            <div className="grid gap-6 md:grid-cols-2">
              <section>
                <h2 className="font-semibold">About this course</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {course.title} is a {hours(course.mins)} {course.level.toLowerCase()} course led by {course.instructor}.
                  {course.mandatory ? ` It is required for all staff and due by ${new Date(`${course.due}T00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}.` : ' Take it at your own pace; your progress saves as you go.'}
                </p>
              </section>
              <section>
                <h2 className="font-semibold">What you’ll learn</h2>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                  {course.lessons.map((l) => <li key={l.id} className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-600 dark:text-brand-300" />{l.title}</li>)}
                </ul>
              </section>
            </div>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <div className="hidden lg:block">{contents}</div>
          <section aria-label="More courses">
            <h2 className="mb-3 font-semibold">More courses</h2>
            <ul className="space-y-3">
              {more.map((c) => (
                <li key={c.id}>
                  <Link to={`/learning/${c.id}`} className="group flex gap-3 rounded-xl p-1.5 -m-1.5 transition hover:bg-slate-100/70 dark:hover:bg-slate-800/60">
                    <Photo src={c.image} alt="" className="aspect-video w-28 shrink-0" rounded="rounded-lg" />
                    <span className="min-w-0">
                      <span className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">{c.title}</span>
                      <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">{c.instructor} · {hours(c.mins)}</span>
                      {pct(c) > 0 && <span className="mt-1 block text-xs font-medium text-accent-700 dark:text-accent-400">{pct(c)}% complete</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
