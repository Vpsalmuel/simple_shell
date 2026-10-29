import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarClock, CheckCircle2, MapPin } from 'lucide-react'
import { benefits, careerTracks, currentTier } from '../data/culture'
import { useUser } from '../context/UserContext'
import Icon from '../components/Icon'
import SectionHeader from '../components/SectionHeader'

// Sample appraisal status from the prototype; in production this comes from the HR system.
const appraisal = ['Compliance check complete', 'Training progress satisfactory', 'Buddy recommendation received']

export default function Rewards() {
  const { user } = useUser()
  const [myTrack, myTier] = currentTier[user.name] ?? ['general', 0]
  const [track, setTrack] = useState(myTrack)
  const t = careerTracks[track]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">Rewards & Benefits</h1>
        <p className="mt-1 text-sm text-slate-500">What Rex offers you, and how to grow your career here.</p>
      </div>

      <section className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((b) => {
          const inner = (
            <>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600 dark:bg-accent-700/20"><Icon name={b.icon} size={20} /></span>
              <span className="mt-4 block font-display text-lg font-bold">{b.title}</span>
              <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">{b.text}</span>
              {b.to && <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-300">Learn more <ArrowRight size={14} /></span>}
            </>
          )
          return b.to ? <Link key={b.title} to={b.to} className="card card-hover p-5">{inner}</Link> : <div key={b.title} className="card p-5">{inner}</div>
        })}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px] [&>*]:min-w-0">
        <section className="card p-5">
          <SectionHeader title="Career tracks" subtitle="Promotion criteria for each level" />
          <div className="mb-5 flex flex-wrap gap-2" role="tablist">
            {Object.entries(careerTracks).map(([id, x]) => <button key={id} role="tab" aria-selected={track === id} onClick={() => setTrack(id)} className={`chip px-3 py-1.5 text-sm ${track === id ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{x.label}</button>)}
          </div>
          <ol className="relative space-y-3 border-l-2 border-slate-200 pl-6 dark:border-slate-700">
            {t.tiers.map((tier, i) => {
              const here = track === myTrack && i === myTier
              const past = track === myTrack && i < myTier
              return (
                <li key={tier.title} className={`relative rounded-2xl p-4 ${here ? 'bg-accent-50 ring-2 ring-accent-500 dark:bg-accent-700/15' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
                  <span className={`absolute top-5 -left-[33px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 ${here ? 'bg-accent-600' : past ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">Level {i + 1}</span>
                    {here && <span className="chip gap-1 bg-accent-600 text-white"><MapPin size={11} /> You are here</span>}
                    {past && <span className="chip gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"><CheckCircle2 size={11} /> Reached</span>}
                  </div>
                  <p className="mt-1 font-display font-bold">{tier.title}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300"><span className="font-medium">To reach this level:</span> {tier.criteria}</p>
                </li>
              )
            })}
          </ol>
        </section>

        <div className="space-y-6">
          <section className="card p-5">
            <CalendarClock className="text-accent-600" size={22} />
            <p className="mt-2 font-display text-lg font-bold">Pay & performance review</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Appraisals run twice a year. Your manager confirms your review date at the start of each cycle.</p>
          </section>
          <section className="card p-5">
            <SectionHeader title="Your appraisal readiness" subtitle="Sample status" />
            <ul className="space-y-2 text-sm">{appraisal.map((a) => <li key={a} className="flex items-center gap-2"><CheckCircle2 size={16} className="shrink-0 text-emerald-500" />{a}</li>)}</ul>
          </section>
        </div>
      </div>
    </div>
  )
}
