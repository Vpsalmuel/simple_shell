import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CalendarCheck, Check, CheckCircle2, ChevronDown, FileSignature, Lock, MapPin, Quote, RotateCcw, Star } from 'lucide-react'
import { company, departmentTour, feedbackSlots, floors, itSetup, mdMessage, performance, policies, products, values, walkthroughSteps, workplaceNorms } from '../data/onboarding'
import { people } from '../data'
import { useUser } from '../context/UserContext'
import Logo from '../components/Logo'
import Avatar from '../components/Avatar'
import Icon from '../components/Icon'
import Modal from '../components/Modal'
import VideoPlayer from '../components/VideoPlayer'
import PersonaSwitcher from '../components/PersonaSwitcher'
import { CelebrateIllustration, WelcomeIllustration } from '../components/Illustrations'

// Each step's completion rule. A step unlocks only when every earlier step is done.
function requirement(stepId, progress) {
  switch (stepId) {
    case 'md':
      return { met: Boolean(progress.mdVideo), hint: 'Watch the MD’s welcome video to continue.' }
    case 'values': {
      const seen = progress.valuesSeen?.length ?? 0
      return { met: seen === values.length, hint: `Open each value card (${seen}/${values.length}).` }
    }
    case 'departments': {
      const seen = progress.deptVideos?.length ?? 0
      return { met: seen === departmentTour.length, hint: `Watch every department video (${seen}/${departmentTour.length}).` }
    }
    case 'policies': {
      const signed = Object.keys(progress.signatures ?? {}).length
      return { met: signed === policies.length, hint: `Sign every policy (${signed}/${policies.length}).` }
    }
    case 'products': {
      const seen = progress.productsSeen?.length ?? 0
      return { met: seen === products.length, hint: `Open each product (${seen}/${products.length}).` }
    }
    case 'tools': {
      const done = progress.itDone?.length ?? 0
      return { met: done === itSetup.length, hint: `Tick each setup task when done (${done}/${itSetup.length}).` }
    }
    case 'feedback':
      return { met: Boolean(progress.feedback), hint: 'Book a time with your buddy.' }
    default:
      return { met: true, hint: '' }
  }
}

function CompanyStep() {
  return (
    <div className="space-y-8">
      <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">{company.intro}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-brand-50 p-4 dark:bg-slate-800"><p className="text-xs font-semibold tracking-wider text-brand-600 uppercase dark:text-brand-300">Mission</p><p className="mt-1 font-medium">{company.mission}</p></div>
            <div className="rounded-2xl bg-accent-50 p-4 dark:bg-slate-800"><p className="text-xs font-semibold tracking-wider text-accent-700 uppercase dark:text-accent-400">Vision</p><p className="mt-1 font-medium">{company.vision}</p></div>
          </div>
        </div>
        <WelcomeIllustration className="mx-auto hidden h-52 w-auto md:block" />
      </div>
      <div className="stagger grid grid-cols-2 gap-3 md:grid-cols-4">
        {company.stats.map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <p className="font-display text-3xl font-extrabold text-brand-700 dark:text-white">{s.value}</p>
            <p className="mt-1 text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
      <div>
        <h3 className="mb-4 text-base font-semibold">Our journey</h3>
        <ol className="relative space-y-5 border-l-2 border-slate-200 pl-6 dark:border-slate-700">
          {company.milestones.map((m) => (
            <li key={m.year} className="relative">
              <span className="absolute top-1 -left-[31px] h-3.5 w-3.5 rounded-full border-2 border-white bg-accent-600 dark:border-slate-950" />
              <p className="font-display text-sm font-bold text-accent-700 dark:text-accent-400">{m.year}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{m.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function MdStep({ progress, update }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <VideoPlayer title={`A welcome from ${mdMessage.name}`} {...mdMessage.video} watched={progress.mdVideo} onComplete={() => update({ mdVideo: true })} />
      <figure className="card relative p-6">
        <Quote className="absolute top-5 right-5 text-accent-200 dark:text-accent-700/40" size={40} />
        <div className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{mdMessage.letter.map((p, i) => <p key={i}>{p}</p>)}</div>
        <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <Avatar name={mdMessage.name} />
          <span><span className="block font-semibold">{mdMessage.name}</span><span className="block text-xs text-slate-500">{mdMessage.title}</span></span>
        </figcaption>
      </figure>
    </div>
  )
}

function ValuesStep({ progress, update }) {
  const seen = progress.valuesSeen ?? []
  const [open, setOpen] = useState(null)
  const toggle = (id) => {
    setOpen(open === id ? null : id)
    if (!seen.includes(id)) update({ valuesSeen: [...seen, id] })
  }
  return (
    <div className="stagger grid gap-4 md:grid-cols-2">
      {values.map((v) => {
        const isOpen = open === v.id
        const isSeen = seen.includes(v.id)
        return (
          <button key={v.id} onClick={() => toggle(v.id)} aria-expanded={isOpen} className={`card card-hover p-5 text-left transition ${isOpen ? 'ring-2 ring-accent-500' : ''}`}>
            <div className="flex items-start gap-4">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition ${isSeen ? 'bg-accent-600 text-white' : 'bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-200'}`}><Icon name={v.icon} size={22} /></span>
              <div className="flex-1">
                <p className="font-display text-lg font-bold">{v.name}</p>
                <p className="text-sm text-slate-500">{v.short}</p>
              </div>
              <ChevronDown size={18} className={`shrink-0 text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
              <div className="animate-fade-up mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
                <p>{v.detail}</p>
                <p className="rounded-xl bg-slate-50 p-3 text-slate-600 dark:bg-slate-800 dark:text-slate-300"><b className="text-slate-900 dark:text-white">In practice:</b> {v.example}</p>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

function DepartmentsStep({ progress, update }) {
  const seen = progress.deptVideos ?? []
  return (
    <div className="stagger grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {departmentTour.map((d) => (
        <article key={d.id} className="card overflow-hidden">
          <VideoPlayer compact title={d.name} {...d.video} watched={seen.includes(d.id)} onComplete={() => update({ deptVideos: [...new Set([...(progress.deptVideos ?? []), d.id])] })} />
          <div className="p-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">{d.what}</p>
            <p className="mt-3 flex items-center gap-2 text-xs text-slate-500"><Avatar name={d.head} size="sm" /> Led by <b className="text-slate-700 dark:text-slate-200">{d.head}</b></p>
          </div>
        </article>
      ))}
    </div>
  )
}

function PolicyReader({ policy, user, onSign, onClose }) {
  const bodyRef = useRef(null)
  const [reachedEnd, setReachedEnd] = useState(false)
  const [agree, setAgree] = useState(false)
  const [name, setName] = useState('')
  const nameOk = name.trim().toLowerCase() === user.name.toLowerCase()

  useEffect(() => {
    const el = bodyRef.current
    if (el && el.scrollHeight <= el.clientHeight + 8) setReachedEnd(true)
  }, [])

  const onScroll = (e) => {
    const el = e.currentTarget
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) setReachedEnd(true)
  }

  return (
    <Modal open onClose={onClose} title={`${policy.title} · ${policy.version}`} wide>
      <div ref={bodyRef} onScroll={onScroll} tabIndex={0} aria-label="Policy text" className="max-h-[40vh] outline-none focus-visible:ring-4 focus-visible:ring-brand-100 space-y-4 overflow-y-auto rounded-xl border border-slate-200 p-4 text-sm leading-relaxed dark:border-slate-700">
        {policy.sections.map(([h, t]) => <section key={h}><h4 className="font-semibold">{h}</h4><p className="mt-1 text-slate-600 dark:text-slate-300">{t}</p></section>)}
        <p className="text-xs text-slate-400">End of document.</p>
      </div>
      {!reachedEnd && <p className="mt-2 text-xs text-slate-500">Scroll to the end of the policy to sign.</p>}
      <form onSubmit={(e) => { e.preventDefault(); onSign(name.trim()) }} className={`mt-4 space-y-3 transition ${reachedEnd ? '' : 'pointer-events-none opacity-40'}`}>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--color-brand-700)]" disabled={!reachedEnd} />
          I have read, understood and agree to comply with this policy.
        </label>
        <label className="block text-sm font-medium">Type your full name to sign
          <input className="input mt-1 font-display text-lg italic" placeholder={user.name} value={name} onChange={(e) => setName(e.target.value)} disabled={!reachedEnd} />
        </label>
        {name && !nameOk && <p className="text-xs text-rose-600">Name must match “{user.name}”.</p>}
        <div className="flex justify-end"><button className="btn-primary" disabled={!agree || !nameOk}><FileSignature size={16} /> Sign policy</button></div>
      </form>
    </Modal>
  )
}

function PoliciesStep({ progress, update, user }) {
  const signatures = progress.signatures ?? {}
  const [reading, setReading] = useState(null)
  return (
    <div className="space-y-3">
      {policies.map((p) => {
        const sig = signatures[p.id]
        return (
          <div key={p.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${sig ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-200'}`}>
              {sig ? <CheckCircle2 size={20} /> : <FileSignature size={20} />}
            </span>
            <div className="flex-1">
              <p className="font-semibold">{p.title} <span className="text-xs font-normal text-slate-400">{p.version}</span></p>
              <p className="text-xs text-slate-500">{sig ? `Signed by ${sig.name} on ${new Date(sig.at).toLocaleString()}` : p.pages}</p>
            </div>
            <button onClick={() => setReading(p)} className={sig ? 'btn-ghost border border-slate-200 dark:border-slate-700' : 'btn-primary'}>{sig ? 'View' : 'Read & sign'}</button>
          </div>
        )
      })}
      {reading && (
        <PolicyReader
          policy={reading}
          user={user}
          onClose={() => setReading(null)}
          onSign={(name) => { update({ signatures: { ...signatures, [reading.id]: { name, at: new Date().toISOString() } } }); setReading(null) }}
        />
      )}
    </div>
  )
}

function CultureStep() {
  return (
    <div className="space-y-6">
      <p className="max-w-[65ch] text-lg leading-relaxed text-slate-600 dark:text-slate-300">At Rex Insurance our culture is built on transparency, empathy and innovation. We take care of our people so they can take care of our clients.</p>
      <div className="stagger grid gap-4 md:grid-cols-3">
        {workplaceNorms.map((n) => (
          <div key={n.title} className="card p-5">
            <p className="font-display font-bold">{n.title}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{n.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProductsStep({ progress, update }) {
  const seen = progress.productsSeen ?? []
  const [open, setOpen] = useState(null)
  const show = (p) => {
    setOpen(p)
    if (!seen.includes(p.id)) update({ productsSeen: [...seen, p.id] })
  }
  return (
    <>
      <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <button key={p.id} onClick={() => show(p)} className="card card-hover flex items-start gap-4 p-5 text-left">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition ${seen.includes(p.id) ? 'bg-accent-600 text-white' : 'bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-200'}`}><Icon name={p.icon} size={22} /></span>
            <span className="min-w-0">
              <span className="block font-display text-lg font-bold">{p.title}</span>
              <span className="block truncate text-xs text-slate-500">{p.variants.join(' · ')}</span>
            </span>
          </button>
        ))}
      </div>
      <Modal open={Boolean(open)} onClose={() => setOpen(null)} title={open?.title ?? ''}>
        {open && (
          <div className="space-y-4 text-sm">
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">{open.description}</p>
            <div>
              <p className="mb-2 font-semibold">Available variants</p>
              <div className="flex flex-wrap gap-2">{open.variants.map((v) => <span key={v} className="chip bg-brand-50 px-3 py-1 text-brand-700 dark:bg-slate-800 dark:text-brand-200">{v}</span>)}</div>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

function LocationsStep({ user }) {
  const myTeam = { Underwriting: 'Underwriting', Claims: 'Claims', IT: 'Technology', HR: 'People & Culture', 'Customer Care': 'Customer Care', Finance: 'Finance' }[user.dept] ?? user.dept
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <ol className="space-y-2" aria-label="Headquarters floor plan">
        {floors.map((f) => {
          const mine = f.teams.includes(myTeam)
          return (
            <li key={f.floor} className={`card flex flex-col gap-3 p-4 sm:flex-row sm:items-center ${mine ? 'ring-2 ring-accent-500' : ''}`}>
              <span className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl font-display ${mine ? 'bg-accent-600 text-white' : 'bg-brand-700 text-white'}`}>
                <span className="text-[10px] font-semibold uppercase opacity-80">Floor</span><span className="text-xl leading-none font-extrabold">{f.floor}</span>
              </span>
              <div className="flex-1">
                <p className="font-display font-bold">{f.name}{mine && <span className="chip ml-2 bg-accent-50 text-accent-700 dark:bg-accent-700/20 dark:text-accent-400">Your team</span>}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">{f.teams.map((t) => <span key={t} className={`chip ${t === myTeam ? 'bg-accent-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{t}</span>)}</div>
              </div>
            </li>
          )
        })}
      </ol>
      <aside className="card p-5 text-sm">
        <MapPin className="text-accent-600" size={20} />
        <p className="mt-2 font-semibold">Ground floor</p>
        <p className="text-slate-600 dark:text-slate-300">Reception, visitor sign-in and the staff café (opens 7:30). Collect your access card from reception on day one.</p>
      </aside>
    </div>
  )
}

function PersonCard({ name, label, highlight }) {
  const p = people.find((x) => x.name === name)
  return (
    <div className={`card flex items-center gap-4 p-5 ${highlight ? 'ring-2 ring-accent-500' : ''}`}>
      <Avatar name={name} size="lg" status={p?.status} />
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wider text-accent-700 uppercase dark:text-accent-400">{label}</p>
        <p className="font-display text-lg font-bold">{name}</p>
        <p className="truncate text-sm text-slate-500">{p?.role}</p>
      </div>
    </div>
  )
}

function TeamStep({ user }) {
  const colleagues = people.filter((p) => p.dept === user.dept && ![user.name, user.manager, user.buddy].includes(p.name))
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <PersonCard name={user.manager} label="Your line manager" />
        <PersonCard name={user.buddy} label="Your onboarding buddy" highlight />
      </div>
      <p className="rounded-2xl bg-accent-50 p-4 text-sm text-accent-800 dark:bg-accent-700/15 dark:text-accent-300">
        <b>{user.buddy}</b> will guide you through your first weeks: how things really work, who to ask, and where to find things. You’ll book your first check-in with them at the end of this walkthrough.
      </p>
      {colleagues.length > 0 && (
        <div>
          <h3 className="mb-3 text-base font-semibold">Also in {user.dept}</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {colleagues.map((c) => <div key={c.id} className="card flex items-center gap-3 p-3"><Avatar name={c.name} status={c.status} /><span className="min-w-0"><span className="block truncate text-sm font-medium">{c.name}</span><span className="block truncate text-xs text-slate-500">{c.role}</span></span></div>)}
          </div>
        </div>
      )}
    </div>
  )
}

function ToolsStep({ progress, update }) {
  const done = progress.itDone ?? []
  const toggle = (id) => update({ itDone: done.includes(id) ? done.filter((x) => x !== id) : [...done, id] })
  return (
    <div className="space-y-3">
      {itSetup.map((t) => {
        const on = done.includes(t.id)
        return (
          <label key={t.id} className={`card flex cursor-pointer items-start gap-4 p-5 transition ${on ? 'ring-2 ring-emerald-500' : 'hover:ring-1 hover:ring-slate-300'}`}>
            <input type="checkbox" checked={on} onChange={() => toggle(t.id)} className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-brand-700)]" />
            <span><span className="block font-semibold">{t.title}</span><span className="block text-sm text-slate-500">{t.text}</span></span>
          </label>
        )
      })}
      <p className="text-sm text-slate-500">Stuck? Call the IT service desk on extension 999, or raise a ticket in the Help Desk once you’re in.</p>
    </div>
  )
}

function PerformanceStep() {
  return (
    <div className="stagger grid gap-4 md:grid-cols-2">
      {performance.map((p) => (
        <div key={p.title} className="card flex gap-4 p-5">
          <Star className="mt-0.5 shrink-0 text-accent-600" size={20} />
          <div><p className="font-display font-bold">{p.title}</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{p.text}</p></div>
        </div>
      ))}
    </div>
  )
}

function FeedbackStep({ progress, update, user }) {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  const [date, setDate] = useState(progress.feedback?.date ?? '')
  const [time, setTime] = useState(progress.feedback?.time ?? '')
  const booked = progress.feedback
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <form onSubmit={(e) => { e.preventDefault(); update({ feedback: { date, time, with: user.buddy } }) }} className="card space-y-5 p-6">
        <p className="text-sm text-slate-600 dark:text-slate-300">Pick a 30-minute slot in your first week to talk with <b>{user.buddy}</b> about how it’s going.</p>
        <label className="block text-sm font-medium" htmlFor="fb-date">Date
          <input id="fb-date" type="date" required min={tomorrow} className="input mt-1" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <fieldset>
          <legend className="text-sm font-medium">Time</legend>
          <div className="mt-2 flex flex-wrap gap-2">{feedbackSlots.map((t) => <button type="button" key={t} onClick={() => setTime(t)} aria-pressed={time === t} className={`chip px-4 py-2 text-sm ${time === t ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>{t}</button>)}</div>
        </fieldset>
        <button className="btn-primary" disabled={!date || !time}><CalendarCheck size={16} /> {booked ? 'Update booking' : 'Book check-in'}</button>
      </form>
      <aside className={`card p-5 ${booked ? 'ring-2 ring-emerald-500' : ''}`} aria-live="polite">
        {booked ? (
          <>
            <CheckCircle2 className="text-emerald-500" size={24} />
            <p className="mt-2 font-semibold">Check-in booked</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{new Date(`${booked.date}T00:00`).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })} at {booked.time} with {booked.with}.</p>
          </>
        ) : (
          <p className="text-sm text-slate-500">No check-in booked yet.</p>
        )}
      </aside>
    </div>
  )
}

const stepViews = {
  md: MdStep, company: CompanyStep, values: ValuesStep, culture: CultureStep, products: ProductsStep, locations: LocationsStep,
  team: TeamStep, departments: DepartmentsStep, policies: PoliciesStep, tools: ToolsStep, performance: PerformanceStep, feedback: FeedbackStep,
}

export default function Walkthrough() {
  const { user, progress, updateProgress, resetWalkthrough, walkthroughDone } = useUser()
  const navigate = useNavigate()
  const firstOpen = walkthroughSteps.findIndex((s) => !progress[s.id])
  const [index, setIndex] = useState(firstOpen === -1 ? walkthroughSteps.length : firstOpen)
  useEffect(() => { window.scrollTo({ top: 0 }) }, [index])

  if (!user.newStaff) return <Navigate to="/" replace />

  const step = walkthroughSteps[index]
  const req = step ? requirement(step.id, progress) : { met: true }
  const unlocked = (i) => walkthroughSteps.slice(0, i).every((s) => progress[s.id])
  const pct = Math.round((walkthroughSteps.filter((s) => progress[s.id]).length / walkthroughSteps.length) * 100)
  const View = step ? stepViews[step.id] : null

  const next = () => {
    updateProgress({ [step.id]: true })
    setIndex(index + 1)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Logo className="h-8 w-auto" />
          <div className="hidden flex-1 items-center gap-3 md:flex">
            <div className="h-1.5 flex-1 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-1.5 rounded-full bg-accent-600 transition-all duration-500" style={{ width: `${pct}%` }} /></div>
            <span className="text-xs font-medium text-slate-500">{pct}% complete</span>
          </div>
          <PersonaSwitcher className="ml-auto md:ml-0" />
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr]">
        <nav aria-label="Walkthrough steps" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">Your first day</p>
          <ol className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1">
            {walkthroughSteps.map((s, i) => {
              const done = progress[s.id]
              const can = unlocked(i)
              const current = i === index
              return (
                <li key={s.id} className="shrink-0">
                  <button
                    disabled={!can}
                    onClick={() => setIndex(i)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${current ? 'bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800' : can ? 'hover:bg-white/70 dark:hover:bg-slate-900' : 'cursor-not-allowed opacity-50'}`}
                  >
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${done ? 'bg-emerald-500 text-white' : current ? 'bg-accent-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-800'}`}>
                      {done ? <Check size={14} /> : can ? i + 1 : <Lock size={12} />}
                    </span>
                    <span className="whitespace-nowrap lg:whitespace-normal"><span className="block font-medium">{s.label}</span><span className="hidden text-xs text-slate-500 lg:block">{s.blurb}</span></span>
                  </button>
                </li>
              )
            })}
          </ol>
          {user.buddy && (
            <div className="mt-6 hidden items-center gap-3 rounded-2xl border border-accent-200 bg-accent-50 p-3 text-sm lg:flex dark:border-accent-700/40 dark:bg-accent-700/10">
              <Avatar name={user.buddy} size="sm" />
              <span className="min-w-0"><span className="block text-xs text-accent-700 dark:text-accent-400">Your buddy</span><span className="block truncate font-semibold">{user.buddy}</span></span>
            </div>
          )}
          <div className="mt-3 hidden rounded-2xl bg-brand-700 p-4 text-sm text-brand-100 lg:block">
            <Lock size={16} className="mb-2 text-accent-400" />
            Rex Hub unlocks once you finish all {walkthroughSteps.length} steps. Your progress is saved.
          </div>
        </nav>

        <main className="min-w-0">
          {step ? (
            <div key={step.id} className="animate-fade-up">
              <p className="text-sm font-medium text-accent-700 dark:text-accent-400">Step {index + 1} of {walkthroughSteps.length}</p>
              <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">{index === 0 ? `Welcome to Rex, ${user.firstName}` : step.label}</h1>
              <p className="mt-1 mb-8 text-slate-500">{step.blurb}</p>
              <View progress={progress} update={updateProgress} user={user} />
              <div className="mt-10 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center dark:border-slate-800">
                <button onClick={() => setIndex(index - 1)} disabled={index === 0} className="btn-ghost"><ArrowLeft size={16} /> Back</button>
                <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                  {!req.met && <span className="text-center text-xs text-slate-500">{req.hint}</span>}
                  <button onClick={next} disabled={!req.met} className="btn bg-accent-600 px-6 text-white hover:bg-accent-700">
                    {index === walkthroughSteps.length - 1 ? 'Finish' : 'Continue'} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-up card mx-auto max-w-xl p-10 text-center">
              <CelebrateIllustration className="mx-auto h-40 w-auto animate-pop" />
              <h1 className="mt-6 text-3xl font-extrabold">You’re all set, {user.firstName}!</h1>
              <p className="mt-2 text-slate-500">You’ve met the company, your team and every department, signed {policies.length} policies and booked time with {user.buddy}. Rex Hub is now unlocked.</p>
              <button onClick={() => navigate('/')} disabled={!walkthroughDone} className="btn-primary mt-8 px-6 py-3 text-base">Enter Rex Hub <ArrowRight size={18} /></button>
              <button onClick={() => { resetWalkthrough(); setIndex(0) }} className="btn-ghost mx-auto mt-3 text-xs"><RotateCcw size={14} /> Restart walkthrough (demo)</button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
