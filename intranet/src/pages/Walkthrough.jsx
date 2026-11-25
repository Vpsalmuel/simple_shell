import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon as ArrowLeft, ArrowRightIcon as ArrowRight, CalendarCheckIcon as CalendarCheck, SignOutIcon as LogOut, CheckIcon as Check, CheckCircleIcon as CheckCircle2, CaretDownIcon as ChevronDown, SignatureIcon as FileSignature, LockIcon as Lock, MapPinIcon as MapPin, QuotesIcon as Quote, ArrowCounterClockwiseIcon as RotateCcw, StarIcon as Star, XIcon as X, BuildingsIcon as Buildings, ClockIcon as Clock, UsersThreeIcon as UsersThree, SunIcon as Sun, SunHorizonIcon as SunHorizon } from '@phosphor-icons/react'
import { company, departmentTour, dressCode, feedbackSlots, floors, itSetup, mdMessage, performance, policies, products, values, walkthroughSteps, workplaceNorms } from '../data/onboarding'
import { people } from '../data'
import { useUser } from '../context/UserContext'
import Logo from '../components/Logo'
import Avatar from '../components/Avatar'
import Icon from '../components/Icon'
import Modal from '../components/Modal'
import VideoPlayer from '../components/VideoPlayer'
import PersonaSwitcher from '../components/PersonaSwitcher'
import { CelebrateIllustration } from '../components/Illustrations'
import companyPhoto from '../assets/photos/company-team.jpg'
// Illustrative thumbnail until the MD's real video and poster frame are added.
import mdThumb from '../assets/photos/md-video.jpg'
import { departmentPhotos, dressPhotos, floorPhotos, peoplePhotos, performanceArt, productPhotos } from '../data/photos'
import Portal from '../components/Portal'

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
      return { met: Boolean(progress.feedback) && ![0, 6].includes(new Date(`${progress.feedback.date}T00:00`).getDay()), hint: 'Book a weekday time with your buddy.' }
    default:
      return { met: true, hint: '' }
  }
}

function CompanyStep() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,1fr)_16rem]">
        <div>
          <p className="text-[17px] leading-relaxed text-slate-700 dark:text-slate-300">{company.intro}</p>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"><dt className="text-xs font-medium text-brand-700 dark:text-brand-300">Our mission</dt><dd className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{company.mission}</dd></div>
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"><dt className="text-xs font-medium text-accent-700 dark:text-accent-400">Our vision</dt><dd className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{company.vision}</dd></div>
          </dl>
        </div>
        <img src={companyPhoto} alt="Rex colleagues walking through the head office lobby" className="aspect-[4/5] w-full rounded-xl object-cover" />
      </div>
      <div className="stagger grid grid-cols-2 gap-3 md:grid-cols-4">
        {company.stats.map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <p className="font-display text-2xl font-semibold text-brand-700 dark:text-white">{s.value}</p>
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
  // Video full width on every screen size, the welcome letter underneath (review comment).
  return (
    <div className="space-y-10">
      <VideoPlayer title={`A welcome from ${mdMessage.name}`} {...mdMessage.video} poster={mdMessage.video?.poster ?? mdThumb} posterVivid watched={progress.mdVideo} onComplete={() => update({ mdVideo: true })} />
      <figure className="relative w-full">
        <Quote className="absolute -top-2 -left-1 text-accent-300 dark:text-accent-700/60" size={32} weight="fill" aria-hidden="true" />
        <div className="space-y-4 pt-8 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">{mdMessage.letter.map((p, i) => <p key={i}>{p}</p>)}</div>
        <figcaption className="mt-8 flex items-center gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
          <Avatar name={mdMessage.name} />
          <span><span className="block text-sm font-semibold text-slate-900 dark:text-white">{mdMessage.name}</span><span className="block text-xs text-slate-500">{mdMessage.title}</span></span>
        </figcaption>
      </figure>
    </div>
  )
}

// Each value gets its own colour from the brand palette: two solid (navy, orange) and two tinted.
const valueTones = [
  { card: 'bg-brand-700 text-white dark:bg-brand-600', sub: 'text-brand-100', chip: 'bg-white/15 text-white', mark: 'text-white/10', quote: 'bg-white/10 text-white' },
  { card: 'bg-accent-700 text-white', sub: 'text-accent-100', chip: 'bg-white/15 text-white', mark: 'text-white/15', quote: 'bg-white/10 text-white' },
  { card: 'bg-brand-50 text-brand-900 ring-1 ring-brand-100 dark:bg-brand-500/15 dark:text-white dark:ring-brand-500/25', sub: 'text-brand-800/80 dark:text-brand-100', chip: 'bg-brand-700 text-white dark:bg-brand-400 dark:text-slate-900', mark: 'text-brand-700/10 dark:text-white/10', quote: 'bg-white text-brand-900 dark:bg-white/10 dark:text-white' },
  { card: 'bg-accent-50 text-accent-900 ring-1 ring-accent-100 dark:bg-accent-600/15 dark:text-white dark:ring-accent-600/25', sub: 'text-accent-900/80 dark:text-accent-100', chip: 'bg-accent-700 text-white', mark: 'text-accent-700/10 dark:text-white/10', quote: 'bg-white text-accent-900 dark:bg-white/10 dark:text-white' },
]

function ValuesStep({ progress, update }) {
  const seen = progress.valuesSeen ?? []
  const [open, setOpen] = useState(null)
  const toggle = (id) => {
    setOpen(open === id ? null : id)
    if (!seen.includes(id)) update({ valuesSeen: [...seen, id] })
  }
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex gap-1.5" aria-hidden="true">
          {values.map((v, i) => <span key={v.id} className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${seen.includes(v.id) ? (i % 2 ? 'bg-accent-600' : 'bg-brand-700 dark:bg-brand-300') : 'bg-slate-200 dark:bg-slate-700'}`} />)}
        </div>
        <span className="text-xs text-slate-500">{seen.length} of {values.length} opened. Tap a value to read what it means in practice.</span>
      </div>
      <div className="stagger grid gap-4 md:grid-cols-2">
        {values.map((v, i) => {
          const t = valueTones[i % valueTones.length]
          const isOpen = open === v.id
          const isSeen = seen.includes(v.id)
          return (
            <button key={v.id} onClick={() => toggle(v.id)} aria-expanded={isOpen} className={`card-lift group relative flex min-h-[15rem] flex-col overflow-hidden rounded-xl p-6 text-left ${t.card}`}>
              <Icon name={v.icon} size={180} weight="fill" aria-hidden="true" className={`pointer-events-none absolute -right-8 -bottom-10 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105 ${t.mark}`} />
              <div className="relative flex items-center justify-between gap-3">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${t.chip}`}><Icon name={v.icon} size={22} weight="duotone" className="icon-lift" /></span>
                {isSeen
                  ? <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${t.chip}`}><Check size={12} weight="bold" /> Read</span>
                  : <ChevronDown size={18} className={`transition-transform duration-300 ${t.sub}`} />}
              </div>
              <div className="relative mt-auto pt-10">
                <p className="text-[22px] leading-tight font-semibold">{v.name}</p>
                <p className={`mt-1.5 text-sm ${t.sub}`}>{v.short}</p>
                <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <p className="pt-4 text-sm leading-relaxed">{v.detail}</p>
                    <p className={`mt-3 rounded-lg p-3 text-sm ${t.quote}`}><b className="font-semibold">In practice: </b>{v.example}</p>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function DepartmentsStep({ progress, update }) {
  const seen = progress.deptVideos ?? []
  const [i, setI] = useState(() => Math.max(0, departmentTour.findIndex((d) => !seen.includes(d.id))))
  const d = departmentTour[i]
  const next = departmentTour[i + 1]
  const tabsRef = useRef(null)
  const pick = (n) => {
    setI(n)
    tabsRef.current?.querySelector(`[data-tab="${n}"]`)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }
  const watched = seen.includes(d.id)
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full rounded-full bg-accent-600 transition-[width] duration-500" style={{ width: `${(seen.length / departmentTour.length) * 100}%` }} />
        </div>
        <span className="text-xs font-semibold text-slate-500 tabular-nums">{seen.length} of {departmentTour.length} watched</span>
      </div>
      <div ref={tabsRef} role="tablist" aria-label="Departments" className="steps-scroll -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {departmentTour.map((t, n) => {
          const on = n === i
          const done = seen.includes(t.id)
          return (
            <button key={t.id} data-tab={n} role="tab" aria-selected={on} onClick={() => pick(n)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition active:scale-[0.98] ${on ? 'border-brand-700 bg-brand-700 text-white dark:border-brand-500 dark:bg-brand-500' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
              {done ? <CheckCircle2 size={16} weight="fill" className={on ? 'text-white' : 'text-accent-600'} /> : <span className={`text-[11px] tabular-nums ${on ? 'text-white/75' : 'text-slate-400'}`}>{String(n + 1).padStart(2, '0')}</span>}
              {t.name}
            </button>
          )
        })}
      </div>
      <article key={d.id} className="card animate-fade-up overflow-hidden">
        <VideoPlayer title={d.name} {...d.video} poster={d.video?.poster ?? departmentPhotos[d.id]} posterVivid watched={watched}
          onComplete={() => update({ deptVideos: [...new Set([...(progress.deptVideos ?? []), d.id])] })} />
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_280px]">
          <div>
            <p className="text-xs font-semibold tracking-wider text-accent-700 uppercase dark:text-accent-400">Department {i + 1} of {departmentTour.length}</p>
            <h3 className="mt-1 font-display text-2xl font-bold">{d.name}</h3>
            <p className="mt-2 max-w-[65ch] leading-relaxed text-slate-600 dark:text-slate-300">{d.what}</p>
            <p className="mt-5 mb-2 text-sm font-semibold">Come to them for</p>
            <div className="flex flex-wrap gap-2">{d.services.map((x) => <span key={x} className="chip bg-brand-50 px-3 py-1 text-brand-700 dark:bg-slate-800 dark:text-brand-200">{x}</span>)}</div>
          </div>
          <dl className="space-y-4 rounded-xl bg-slate-50 p-5 text-sm dark:bg-slate-800/60">
            <div className="flex items-center gap-3"><Avatar name={d.head} size="md" /><div><dt className="text-xs text-slate-500">Led by</dt><dd className="font-semibold">{d.head}</dd></div></div>
            <div className="flex items-center gap-3"><UsersThree size={20} className="shrink-0 text-brand-700 dark:text-brand-200" /><div><dt className="text-xs text-slate-500">Team size</dt><dd className="font-semibold">{d.headcount} people</dd></div></div>
            <div className="flex items-center gap-3"><MapPin size={20} className="shrink-0 text-brand-700 dark:text-brand-200" /><div><dt className="text-xs text-slate-500">Where</dt><dd className="font-semibold">{d.location}</dd></div></div>
            <div className="min-w-0"><dt className="text-xs text-slate-500">Contact</dt><dd className="truncate font-semibold">{d.contact}</dd></div>
          </dl>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <button onClick={() => pick(i - 1)} disabled={i === 0} className="btn-ghost disabled:opacity-40"><ArrowLeft size={16} /> Previous</button>
          {next ? (
            <button onClick={() => pick(i + 1)} className={watched ? 'btn-primary' : 'btn-secondary'}>
              Up next: {next.name} <ArrowRight size={16} />
            </button>
          ) : <span className="text-sm text-slate-500">{seen.length === departmentTour.length ? 'All departments watched.' : 'Last department. Watch any you skipped to continue.'}</span>}
        </div>
      </article>
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

const policyLook = {
  conduct: { icon: 'Scale', tone: 'from-brand-700 to-brand-500' },
  aml: { icon: 'ScanSearch', tone: 'from-accent-700 to-accent-500' },
  data: { icon: 'Lock', tone: 'from-brand-700 to-sky-600' },
  safety: { icon: 'HardHat', tone: 'from-accent-700 to-amber-500' },
  it: { icon: 'Desktop', tone: 'from-slate-800 to-brand-600' },
}

function PoliciesStep({ progress, update, user }) {
  const signatures = progress.signatures ?? {}
  const [reading, setReading] = useState(null)
  const signed = policies.filter((p) => signatures[p.id]).length
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full rounded-full bg-emerald-500 transition-[width] duration-500" style={{ width: `${(signed / policies.length) * 100}%` }} />
        </div>
        <span className="text-xs font-semibold text-slate-500 tabular-nums">{signed} of {policies.length} signed</span>
      </div>
      <div className="stagger grid grid-cols-1 gap-5 md:grid-cols-2">
        {policies.map((p, n) => {
          const sig = signatures[p.id]
          const look = policyLook[p.id] ?? { icon: 'ScrollText', tone: 'from-brand-700 to-brand-500' }
          return (
            <article key={p.id} className="card card-lift flex flex-col overflow-hidden">
              <div className={`relative flex h-32 items-end overflow-hidden bg-gradient-to-br ${look.tone} p-5 text-white`}>
                <Icon name={look.icon} size={128} className="absolute -top-4 -right-4 opacity-15" />
                <div className="relative flex w-full items-end justify-between gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur"><Icon name={look.icon} size={24} /></span>
                  {sig
                    ? <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 size={14} weight="fill" /> Signed</span>
                    : <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold ring-1 ring-white/25">Policy {n + 1} · {p.version}</span>}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><Clock size={14} /> {p.pages}</p>
                <p className="mt-4 mb-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">What it covers</p>
                <ul className="mb-5 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                  {p.sections.map(([h]) => <li key={h} className="flex items-center gap-2"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-600" />{h}</li>)}
                </ul>
                {sig && <p className="mb-3 text-xs text-emerald-700 dark:text-emerald-400">Signed by {sig.name} on {new Date(sig.at).toLocaleString()}</p>}
                <button onClick={() => setReading(p)} className={`mt-auto w-full justify-center ${sig ? 'btn-secondary' : 'btn-primary'}`}>
                  {sig ? 'View policy' : <>Read &amp; sign <FileSignature size={16} /></>}
                </button>
              </div>
            </article>
          )
        })}
      </div>
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

// How we work: three stops joined by one line (horizontal on desktop, vertical on phones),
// each with a small visual: the office week, the core-hours window, and the meeting habits.
function HowWeWork() {
  const [office, hours, meetings] = workplaceNorms
  const days = [['Mon', true], ['Tue', true], ['Wed', false], ['Thu', true], ['Fri', true]]
  const stops = [
    { n: office, Icon: Buildings, tone: 'bg-brand-700 text-white dark:bg-brand-500', visual: (<>
      <div className="flex gap-1" aria-label="Office Monday, Tuesday, Thursday and Friday; work from home on Wednesday">
        {days.map(([d, inOffice]) => <span key={d} className={`flex h-8 flex-1 items-center justify-center rounded-md text-[11px] font-medium ${inOffice ? 'bg-brand-700 text-white dark:bg-brand-500' : 'border border-dashed border-slate-300 text-slate-500 dark:border-slate-600'}`}>{d}</span>)}
      </div>
      <p className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500"><span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-brand-700 dark:bg-brand-500" /> Office</span><span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-sm border border-dashed border-slate-400" /> Work from home</span></p>
    </>) },
    { n: hours, Icon: Clock, tone: 'bg-accent-700 text-white', visual: (
      <div aria-label="Core hours 8:00 to 16:00">
        <div className="relative h-8 rounded-md bg-slate-100 dark:bg-slate-800">
          <span className="absolute inset-y-0 rounded-md bg-accent-700" style={{ left: `${(1 / 11) * 100}%`, right: `${(2 / 11) * 100}%` }} />
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-white">8:00 to 16:00</span>
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-slate-500 tabular-nums"><span>07:00</span><span>18:00</span></div>
      </div>
    ) },
    { n: meetings, Icon: UsersThree, tone: 'bg-emerald-600 text-white', visual: (
      <div className="flex flex-wrap gap-1.5">
        {['On time', 'Agenda', 'Next steps', 'Owners'].map((t) => <span key={t} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200"><Check size={11} weight="bold" />{t}</span>)}
      </div>
    ) },
  ]
  return (
    <section>
      <h2 className="section-title mb-5">How we work</h2>
      <ol className="relative grid gap-8 md:grid-cols-3 md:gap-6">
        {/* The connecting line: across the icons on desktop, down the left on phones. */}
        <span aria-hidden="true" className="absolute top-5 right-[16.66%] left-[16.66%] hidden h-0.5 bg-gradient-to-r from-brand-700 via-accent-600 to-emerald-600 md:block" />
        <span aria-hidden="true" className="absolute top-5 bottom-5 left-5 w-0.5 bg-gradient-to-b from-brand-700 via-accent-600 to-emerald-600 md:hidden" />
        {stops.map(({ n, Icon: StopIcon, tone, visual }) => (
          <li key={n.title} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
            <span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-950 ${tone}`}><StopIcon size={20} weight="fill" /></span>
            <div className="card card-lift min-w-0 flex-1 p-4 md:mt-4 md:w-full md:text-left">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{n.title}</p>
              <p className="mt-1 mb-4 text-sm text-slate-600 dark:text-slate-300">{n.text}</p>
              {visual}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function DressCode() {
  const [tab, setTab] = useState(dressCode[0].id)
  const d = dressCode.find((x) => x.id === tab)
  return (
    <section>
      <h2 className="section-title mb-3">Dress code</h2>
      <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-800/70" role="tablist" aria-label="Dress code">
        {dressCode.map((x) => (
          <button key={x.id} role="tab" aria-selected={tab === x.id} onClick={() => setTab(x.id)} className={`h-9 flex-1 shrink-0 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-colors ${tab === x.id ? 'bg-white text-slate-900 shadow-[0_1px_2px_rgba(30,45,100,0.15)] dark:bg-slate-700 dark:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}>{x.title}</button>
        ))}
      </div>
      <div key={d.id} role="tabpanel" className="card animate-fade-up grid overflow-hidden md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <img src={dressPhotos[d.image]} alt={`Example outfits for ${d.title.toLowerCase()}`} className="aspect-[3/2] h-full w-full object-cover" />
        <div className="p-6">
          <p className="text-[17px] font-semibold text-slate-900 dark:text-white">{d.title}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{d.summary}</p>
          <p className="mt-5 text-xs font-medium text-emerald-700 dark:text-emerald-400">Wear</p>
          <ul className="mt-1.5 space-y-1.5">{d.wear.map((w) => <li key={w} className="flex gap-2 text-sm text-slate-700 dark:text-slate-200"><Check size={16} weight="bold" className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />{w}</li>)}</ul>
          <p className="mt-5 text-xs font-medium text-rose-700 dark:text-rose-400">Avoid</p>
          <ul className="mt-1.5 space-y-1.5">{d.avoid.map((w) => <li key={w} className="flex gap-2 text-sm text-slate-700 dark:text-slate-200"><X size={16} weight="bold" className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-400" />{w}</li>)}</ul>
        </div>
      </div>
    </section>
  )
}

function CultureStep() {
  return (
    <div className="space-y-10">
      <p className="max-w-[65ch] text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">At Rex Insurance our culture is built on transparency, empathy and innovation. We take care of our people so they can take care of our clients.</p>
      <HowWeWork />
      <DressCode />
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
  const idx = open ? products.findIndex((p) => p.id === open.id) : -1
  const go = (d) => show(products[(idx + d + products.length) % products.length])
  return (
    <>
      <div className="mb-5 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full rounded-full bg-accent-600 transition-[width] duration-500 ease-[var(--ease-out)]" style={{ width: `${(seen.length / products.length) * 100}%` }} />
        </div>
        <span className="text-xs font-semibold text-slate-500 tabular-nums">{seen.length} of {products.length} explored</span>
      </div>
      <div className="stagger grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((p, i) => {
          const done = seen.includes(p.id)
          return (
            <article key={p.id} className="card card-lift img-zoom group flex flex-col overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img src={productPhotos[p.id]} alt="" loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-brand-700 shadow-sm backdrop-blur dark:bg-slate-900/90 dark:text-brand-200"><Icon name={p.icon} size={20} /></span>
                <span className="absolute top-3 right-3 rounded-full bg-slate-950/45 px-2 py-0.5 font-display text-[11px] font-semibold text-white tabular-nums backdrop-blur">{String(i + 1).padStart(2, '0')}</span>
                {done && <span className="animate-pop absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-accent-700 px-2.5 py-1 text-[11px] font-semibold text-white"><Check size={12} weight="bold" /> Explored</span>}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-semibold">{p.title}</h3>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{p.description}</p>
                <div className="mt-3 mb-5 flex flex-wrap gap-1.5">
                  {p.variants.slice(0, 2).map((v) => <span key={v} className="chip bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-200">{v}</span>)}
                  {p.variants.length > 2 && <span className="chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">+{p.variants.length - 2} more</span>}
                </div>
                <button onClick={() => show(p)} className="btn-secondary mt-auto w-full justify-center group-hover:border-accent-600" aria-label={`Read more about ${p.title}`}>
                  Read more <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            </article>
          )
        })}
      </div>
      {open && <ProductModal product={open} index={idx} onClose={() => setOpen(null)} onPrev={() => go(-1)} onNext={() => go(1)} />}
    </>
  )
}

function ProductModal({ product: p, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onNext, onPrev])
  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={p.title}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />
        <div key={p.id} className="animate-fade-up relative max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-[0_24px_60px_-20px_rgba(30,45,100,0.45)] sm:max-w-2xl sm:rounded-2xl dark:bg-slate-900">
          <div className="relative aspect-[16/8] overflow-hidden">
            <img src={productPhotos[p.id]} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            <button onClick={onClose} className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 transition hover:bg-white active:scale-95" aria-label="Close"><X size={18} /></button>
            <div className="absolute right-6 bottom-5 left-6 flex items-end gap-3 text-white">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-700"><Icon name={p.icon} size={24} /></span>
              <div>
                <p className="text-xs font-semibold tracking-wider text-white/80 uppercase">Product {index + 1} of {products.length}</p>
                <h2 className="font-display text-2xl font-bold">{p.title}</h2>
              </div>
            </div>
          </div>
          <div className="space-y-6 p-6">
            <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">{p.description}</p>
            <div className="rounded-xl border-l-4 border-accent-600 bg-accent-50/60 p-4 dark:bg-accent-700/10">
              <p className="text-xs font-semibold tracking-wider text-accent-700 uppercase dark:text-accent-400">Who it's for</p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{p.who}</p>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold">Available variants</p>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {p.variants.map((v) => (
                  <li key={v} className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700">
                    <CheckCircle2 size={18} weight="fill" className="shrink-0 text-brand-700 dark:text-brand-200" /> {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
            <button onClick={onPrev} className="btn-ghost"><ArrowLeft size={16} /> Previous</button>
            <div className="flex gap-2">
              <button onClick={onClose} className="btn-secondary">Got it</button>
              <button onClick={onNext} className="btn-primary">Next <ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  )
}

function LocationsStep({ user }) {
  const myTeam = { Underwriting: 'Underwriting', Claims: 'Claims', IT: 'Technology', HR: 'People & Culture', 'Customer Care': 'Customer Care', Finance: 'Finance' }[user.dept] ?? user.dept
  const mine = floors.find((f) => f.teams.includes(myTeam))
  const [sel, setSel] = useState(mine?.floor ?? floors[0].floor)
  const f = floors.find((x) => x.floor === sel)
  const panelRef = useRef(null)
  const choose = (n) => {
    setSel(n)
    // On phones the detail panel sits below the list, so bring it into view.
    if (window.innerWidth < 1024) requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div>
        <ol className="space-y-2" aria-label="Headquarters floors">
          {floors.map((x) => {
            const on = x.floor === sel
            const isMine = x.teams.includes(myTeam)
            return (
              <li key={x.floor}>
                <button onClick={() => choose(x.floor)} aria-pressed={on}
                  className={`group flex w-full items-center gap-4 rounded-xl border p-3 text-left transition active:scale-[0.99] ${on ? 'border-brand-700 bg-brand-50/70 shadow-sm dark:border-brand-500 dark:bg-slate-800' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800'}`}>
                  <span className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl font-display transition ${on ? 'bg-accent-700 text-white' : 'bg-brand-700 text-white'}`}>
                    <span className="text-[10px] font-semibold uppercase opacity-80">Floor</span><span className="text-xl leading-none font-bold">{x.floor}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 font-semibold">{x.name}{isMine && <span className="chip bg-accent-50 text-accent-700 dark:bg-accent-700/20 dark:text-accent-400">Your team</span>}</span>
                    <span className="block truncate text-xs text-slate-500">{x.teams.join(' · ')}</span>
                  </span>
                  <ArrowRight size={18} className={`shrink-0 transition ${on ? 'translate-x-0 text-accent-600' : 'text-slate-300 group-hover:translate-x-0.5'}`} />
                </button>
              </li>
            )
          })}
        </ol>
        <div className="mt-3 flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800/60">
          <MapPin className="mt-0.5 shrink-0 text-accent-600" size={18} />
          <p className="text-slate-600 dark:text-slate-300"><b className="text-slate-800 dark:text-slate-100">Ground floor:</b> reception, visitor sign-in and the staff café (opens 7:30). Collect your access card from reception on day one.</p>
        </div>
      </div>
      <aside ref={panelRef} key={f.floor} className="card animate-fade-up scroll-mt-24 overflow-hidden lg:sticky lg:top-6 lg:self-start" aria-live="polite">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img src={floorPhotos[f.floor]} alt={`Floor ${f.floor}: ${f.name}`} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-5 text-white">
            <p className="text-xs font-semibold tracking-wider text-white/80 uppercase">Floor {f.floor}</p>
            <h3 className="font-display text-2xl font-bold">{f.name}</h3>
          </div>
        </div>
        <div className="space-y-5 p-6 text-sm">
          <p className="flex items-start gap-2 font-medium text-slate-700 dark:text-slate-200"><MapPin size={18} className="mt-0.5 shrink-0 text-accent-600" /> {f.where}</p>
          <p className="leading-relaxed text-slate-600 dark:text-slate-300">{f.about}</p>
          <div>
            <p className="mb-2 font-semibold">Teams here</p>
            <div className="flex flex-wrap gap-1.5">{f.teams.map((t) => <span key={t} className={`chip ${t === myTeam ? 'bg-accent-700 text-white' : 'bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-200'}`}>{t}</span>)}</div>
          </div>
          <div>
            <p className="mb-2 font-semibold">Good to know</p>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">{f.spots.map((x) => <li key={x} className="flex items-center gap-2"><Check size={14} weight="bold" className="shrink-0 text-accent-600" />{x}</li>)}</ul>
          </div>
        </div>
      </aside>
    </div>
  )
}

function PersonCard({ name, label, highlight }) {
  const p = people.find((x) => x.name === name)
  const photo = peoplePhotos[name]
  return (
    <article className={`card card-lift flex overflow-hidden ${highlight ? 'ring-2 ring-accent-500' : ''}`}>
      <div className="relative w-36 shrink-0 overflow-hidden bg-brand-50 sm:w-44 dark:bg-slate-800">
        {photo ? <img src={photo} alt={name} className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center"><Avatar name={name} size="xl" /></span>}
        {p?.status && <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-700 capitalize">{p.status}</span>}
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-1 p-5">
        <p className="text-xs font-semibold tracking-wider text-accent-700 uppercase dark:text-accent-400">{label}</p>
        <p className="text-lg font-semibold">{name}</p>
        <p className="text-sm text-slate-500">{p?.role}</p>
        {p?.phone && <p className="mt-2 text-xs text-slate-500">{p.phone}<span className="block truncate">{p.email}</span></p>}
      </div>
    </article>
  )
}

function TeamStep({ user }) {
  const colleagues = people.filter((p) => p.dept === user.dept && ![user.name, user.manager, user.buddy].includes(p.name))
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PersonCard name={user.manager} label="Your line manager" />
        <PersonCard name={user.buddy} label="Your onboarding buddy" highlight />
      </div>
      <p className="rounded-xl bg-accent-50 p-4 text-sm text-accent-800 dark:bg-accent-700/15 dark:text-accent-300">
        <b>{user.buddy}</b> will guide you through your first weeks: how things really work, who to ask, and where to find things. You’ll book your first check-in with them at the end of this walkthrough.
      </p>
      {colleagues.length > 0 && (
        <div>
          <h3 className="mb-3 text-base font-semibold">Also in {user.dept}</h3>
          <div className="stagger grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {colleagues.map((c) => (
              <div key={c.id} className="card card-lift img-zoom overflow-hidden">
                <div className="aspect-square overflow-hidden bg-brand-50 dark:bg-slate-800">
                  {peoplePhotos[c.name] ? <img src={peoplePhotos[c.name]} alt={c.name} loading="lazy" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center"><Avatar name={c.name} size="xl" /></span>}
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <p className="truncate text-xs text-slate-500">{c.role}</p>
                </div>
              </div>
            ))}
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
    <div className="stagger grid grid-cols-1 gap-5 md:grid-cols-2">
      {performance.map((p, n) => (
        <article key={p.title} className="card card-lift img-zoom flex flex-col overflow-hidden">
          <div className="relative aspect-[16/9] overflow-hidden bg-[#FCEFE6]">
            <img src={performanceArt[n]} alt="" loading="lazy" className="h-full w-full object-cover" />
            <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 font-display text-xs font-semibold text-brand-700 tabular-nums">{String(n + 1).padStart(2, '0')}</span>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{p.text}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

// The next `count` weekdays from tomorrow. Buddy check-ins are Monday to Friday only (17 Nov review).
function nextWeekdays(count = 10) {
  const out = []
  const d = new Date()
  while (out.length < count) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d))
  }
  return out
}
const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function FeedbackStep({ progress, update, user }) {
  const days = nextWeekdays(10)
  const [date, setDate] = useState(progress.feedback?.date ?? '')
  const [time, setTime] = useState(progress.feedback?.time ?? '')
  const [justBooked, setJustBooked] = useState(false)
  const booked = progress.feedback
  // Drop a saved booking that falls on a weekend (booked before the weekday rule).
  const bookedOnWeekend = booked && [0, 6].includes(new Date(`${booked.date}T00:00`).getDay())
  // Group the weekdays into calendar weeks (a new week starts on Monday).
  const weeks = days.reduce((acc, d) => {
    if (!acc.length || d.getDay() === 1) acc.push([])
    acc[acc.length - 1].push(d)
    return acc
  }, [])
  const weekLabel = (wi) => ['This week', 'Next week', 'In two weeks'][wi + (days[0].getDay() === 1 ? 1 : 0)] ?? 'Later'
  const daySlot = (d) => ({ gridColumnStart: d.getDay() })
  const buddy = people.find((p) => p.name === user.buddy)
  const pickedDate = date ? new Date(`${date}T00:00`) : null
  const dirty = !booked || booked.date !== date || booked.time !== time
  const fmtLong = (d) => d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })
  const submit = (e) => {
    e.preventDefault()
    update({ feedback: { date, time, with: user.buddy } })
    setJustBooked(true)
    setTimeout(() => setJustBooked(false), 1600)
  }
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <form onSubmit={submit} className="card overflow-hidden">
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 to-brand-500 px-6 py-5 text-white">
          <CalendarCheck size={140} className="absolute -top-6 -right-6 opacity-10" />
          <div className="relative flex items-center gap-4">
            <span className="rounded-full ring-2 ring-white/40"><Avatar name={user.buddy} size="lg" /></span>
            <div>
              <p className="text-xs font-semibold tracking-wider text-white/75 uppercase">30-minute check-in</p>
              <p className="text-lg font-semibold">with {user.buddy}</p>
              <p className="text-sm text-white/80">{buddy?.role ?? 'Your onboarding buddy'}</p>
            </div>
          </div>
        </div>
        <div className="space-y-6 p-6">
          <p className="text-sm text-slate-600 dark:text-slate-300">Pick a slot in your first two weeks to talk about how it’s going.</p>
          <fieldset>
            <legend className="text-sm font-semibold">1. Choose a day <span className="font-normal text-slate-500">(Monday to Friday)</span></legend>
            <div className="mt-3 space-y-3">
              {weeks.map((w, wi) => (
                <div key={wi}>
                  <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">{weekLabel(wi)} · {w[0].toLocaleDateString(undefined, { month: 'long' })}</p>
                  <div className="grid grid-cols-5 gap-2">
                    {w.map((d) => {
                      const v = isoDate(d)
                      const on = date === v
                      const isBooked = booked?.date === v
                      return (
                        <button type="button" key={v} style={daySlot(d)} onClick={() => setDate(v)} aria-pressed={on} aria-label={fmtLong(d)}
                          className={`group relative flex flex-col items-center overflow-hidden rounded-xl border text-center transition duration-200 ease-[var(--ease-out)] hover:-translate-y-0.5 active:scale-[0.96] ${on ? 'border-accent-700 bg-accent-700 text-white shadow-[0_10px_24px_-12px_rgba(194,65,12,0.7)]' : 'border-slate-200 bg-white hover:border-brand-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900'}`}>
                          <span className={`w-full py-1 text-[10px] font-semibold tracking-wider uppercase transition-colors ${on ? 'bg-accent-800/40 text-white' : 'bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-200'}`}>{d.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                          <span key={on ? 'on' : 'off'} className={`py-2 font-display text-xl font-bold tabular-nums ${on ? 'animate-pop' : ''}`}>{d.getDate()}</span>
                          {isBooked && <span className={`absolute right-1.5 bottom-1.5 h-1.5 w-1.5 rounded-full ${on ? 'bg-white' : 'bg-emerald-500'}`} title="Booked" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-semibold">2. Choose a time</legend>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {feedbackSlots.map((t) => {
                const on = time === t
                const morning = Number(t.slice(0, 2)) < 12
                return (
                  <button type="button" key={t} onClick={() => setTime(t)} aria-pressed={on}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition duration-200 ease-[var(--ease-out)] hover:-translate-y-0.5 active:scale-[0.96] ${on ? 'border-brand-700 bg-brand-700 text-white dark:border-brand-500 dark:bg-brand-500' : 'border-slate-200 hover:border-brand-300 hover:shadow-sm dark:border-slate-700'}`}>
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${on ? 'bg-white/15' : morning ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10' : 'bg-accent-50 text-accent-700 dark:bg-accent-700/15 dark:text-accent-400'}`}>
                      {morning ? <Sun size={18} weight="fill" /> : <SunHorizon size={18} weight="fill" />}
                    </span>
                    <span><span className="block font-semibold tabular-nums">{t}</span><span className={`block text-[11px] ${on ? 'text-white/75' : 'text-slate-500'}`}>{morning ? 'Morning' : 'Afternoon'} · 30 min</span></span>
                  </button>
                )
              })}
            </div>
          </fieldset>
          <button className="btn-primary w-full justify-center sm:w-auto" disabled={!date || !time || !dirty}>
            <CalendarCheck size={16} /> {booked ? (dirty ? 'Update booking' : 'Booked') : 'Book check-in'}
          </button>
        </div>
      </form>

      <aside className="lg:sticky lg:top-6 lg:self-start" aria-live="polite">
        <div className={`card overflow-hidden transition duration-300 ${booked && !bookedOnWeekend ? 'ring-2 ring-emerald-500' : ''} ${justBooked ? 'animate-pop' : ''}`}>
          <div className={`px-5 py-3 text-xs font-semibold tracking-wider uppercase transition-colors duration-300 ${booked && !bookedOnWeekend ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
            {bookedOnWeekend ? 'Needs a new day' : booked ? 'Check-in booked' : 'Your booking'}
          </div>
          <div className="p-5">
            {bookedOnWeekend ? (
              <p className="text-sm text-amber-700 dark:text-amber-300">Your saved check-in falls on a weekend. Pick a weekday instead.</p>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className={`flex h-16 w-16 shrink-0 flex-col overflow-hidden rounded-xl border text-center transition-colors ${pickedDate ? 'border-accent-700' : 'border-dashed border-slate-300 dark:border-slate-600'}`}>
                    <span className={`py-0.5 text-[10px] font-semibold uppercase ${pickedDate ? 'bg-accent-700 text-white' : 'text-slate-400'}`}>{pickedDate ? pickedDate.toLocaleDateString(undefined, { month: 'short' }) : '—'}</span>
                    <span key={date} className="animate-pop flex flex-1 items-center justify-center font-display text-2xl font-bold tabular-nums">{pickedDate ? pickedDate.getDate() : '?'}</span>
                  </div>
                  <div className="min-w-0 text-sm">
                    <p className="font-semibold">{pickedDate ? fmtLong(pickedDate) : 'Pick a day'}</p>
                    <p key={time} className="animate-fade-up flex items-center gap-1.5 text-slate-500"><Clock size={14} /> {time ? `${time} · 30 minutes` : 'Pick a time'}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
                  <Avatar name={user.buddy} size="sm" /> <span>with <b>{user.buddy}</b></span>
                </div>
                {booked && !dirty && <p className="animate-fade-up mt-3 flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400"><CheckCircle2 size={16} weight="fill" /> You're all set</p>}
                {booked && dirty && date && time && <p className="mt-3 text-xs text-amber-700 dark:text-amber-300">Changes not saved yet. Press Update booking.</p>}
              </>
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}

const stepViews = {
  md: MdStep, company: CompanyStep, values: ValuesStep, culture: CultureStep, products: ProductsStep, locations: LocationsStep,
  team: TeamStep, departments: DepartmentsStep, policies: PoliciesStep, tools: ToolsStep, performance: PerformanceStep, feedback: FeedbackStep,
}

// The step list: a vertical stepper grouped into three chapters, with a rail joining the markers.
function Stepper({ index, progress, unlocked, onPick }) {
  const groups = [...new Set(walkthroughSteps.map((s) => s.group))]
  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <div key={g}>
          <p className="mb-2 px-3 text-xs font-medium text-slate-500">{g}</p>
          <ol>
            {walkthroughSteps.map((s, i) => {
              if (s.group !== g) return null
              const done = progress[s.id]
              const can = unlocked(i)
              const current = i === index
              const last = walkthroughSteps[i + 1]?.group !== g
              return (
                <li key={s.id} className="relative" ref={current ? (el) => el?.scrollIntoView({ block: 'nearest' }) : undefined}>
                  {!last && <span aria-hidden="true" className={`absolute top-8 bottom-0 left-[23px] w-px ${done ? 'bg-emerald-500/60' : 'bg-slate-200 dark:bg-slate-700'}`} />}
                  <button
                    disabled={!can}
                    onClick={() => onPick(i)}
                    aria-current={current ? 'step' : undefined}
                    className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${current ? 'bg-brand-50 dark:bg-brand-500/15' : can ? 'hover:bg-slate-100 dark:hover:bg-slate-800/70' : 'cursor-not-allowed'}`}
                  >
                    <span className={`relative z-10 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums ${done ? 'bg-emerald-600 text-white' : current ? 'bg-brand-700 text-white ring-4 ring-brand-100 dark:bg-brand-300 dark:text-slate-900 dark:ring-brand-500/25' : can ? 'border border-slate-300 bg-white text-slate-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300' : 'border border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'}`}>
                      {done ? <Check size={12} weight="bold" /> : i + 1}
                    </span>
                    <span className={`min-w-0 flex-1 ${current ? 'font-medium text-brand-900 dark:text-white' : done || can ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500'}`}>{s.label}</span>
                    {!can && <Lock size={12} className="shrink-0 text-slate-400" aria-label="Locked" />}
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      ))}
    </div>
  )
}

export default function Walkthrough() {
  const { user, progress, updateProgress, resetWalkthrough, walkthroughDone, ready, signedIn, ssoConfigured, signOut } = useUser()
  const navigate = useNavigate()
  const firstOpen = walkthroughSteps.findIndex((s) => !progress[s.id])
  const [index, setIndex] = useState(firstOpen === -1 ? walkthroughSteps.length : firstOpen)
  const [stepsOpen, setStepsOpen] = useState(false)
  useEffect(() => { window.scrollTo({ top: 0 }); setStepsOpen(false) }, [index])

  if (ready && !signedIn) return <Navigate to="/login" replace />
  if (!user.newStaff) return <Navigate to="/" replace />

  const step = walkthroughSteps[index]
  const req = step ? requirement(step.id, progress) : { met: true }
  const unlocked = (i) => walkthroughSteps.slice(0, i).every((s) => progress[s.id])
  const doneCount = walkthroughSteps.filter((s) => progress[s.id]).length
  const pct = Math.round((doneCount / walkthroughSteps.length) * 100)
  const View = step ? stepViews[step.id] : null

  const next = () => {
    updateProgress({ [step.id]: true })
    setIndex(index + 1)
  }
  // Testing only (demo mode): skip ahead without meeting each step's requirement.
  const skipAll = () => {
    updateProgress(Object.fromEntries(walkthroughSteps.map((s) => [s.id, true])))
    setIndex(walkthroughSteps.length)
  }
  const testing = !ssoConfigured
  const testBtn = 'btn h-8 border border-dashed border-amber-400 px-2.5 text-xs text-amber-800 hover:bg-amber-50 dark:border-amber-500/60 dark:text-amber-300 dark:hover:bg-amber-500/10'
  const resetAll = () => { resetWalkthrough(); setIndex(0) }
  const ResetAll = () => testing && <button onClick={resetAll} disabled={doneCount === 0} className={testBtn}><RotateCcw size={12} /> Reset steps (test)</button>
  const SkipAll = ({ className = '' }) => testing && (
    <button onClick={skipAll} className={`btn h-8 border border-dashed border-amber-400 px-2.5 text-xs text-amber-800 hover:bg-amber-50 dark:border-amber-500/60 dark:text-amber-300 dark:hover:bg-amber-500/10 ${className}`}>Skip onboarding (test)</button>
  )

  const progressBlock = (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-medium text-slate-900 dark:text-white">{doneCount} of {walkthroughSteps.length} steps</span>
        <span className="text-slate-500 tabular-nums">{pct}%</span>
      </div>
      <div className="mt-2 h-1 rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-1 rounded-full bg-brand-700 transition-[width] duration-500 dark:bg-brand-400" style={{ width: `${pct}%` }} /></div>
    </div>
  )

  return (
    <div className="min-h-[100dvh] bg-white lg:grid lg:grid-cols-[18rem_minmax(0,1fr)] dark:bg-slate-950">
      {/* Left rail: fixed height; the step list scrolls inside it (17 Nov feedback). */}
      <aside className="hidden border-r border-slate-200 bg-slate-50 lg:sticky lg:top-0 lg:flex lg:h-[100dvh] lg:flex-col dark:border-slate-800 dark:bg-slate-900/60">
        <div className="space-y-6 px-5 pt-6 pb-5">
          <Logo className="h-7 w-auto" />
          <div>
            <p className="text-[15px] font-semibold text-slate-900 dark:text-white">Your first days at Rex</p>
            <p className="mt-0.5 text-xs text-slate-500">Rex Hub unlocks when all steps are done.</p>
          </div>
          {progressBlock}
        </div>
        <nav aria-label="Walkthrough steps" className="steps-scroll relative min-h-0 flex-1 overflow-y-auto border-t border-slate-200 px-2 py-5 dark:border-slate-800">
          <Stepper index={index} progress={progress} unlocked={unlocked} onPick={setIndex} />
        </nav>
        <div className="space-y-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          {user.buddy && (
            <div className="flex items-center gap-3">
              <Avatar name={user.buddy} size="sm" />
              <span className="min-w-0 flex-1"><span className="block text-xs text-slate-500">Your buddy</span><span className="block truncate text-sm font-medium text-slate-900 dark:text-white">{user.buddy}</span></span>
            </div>
          )}
          {!ssoConfigured && <PersonaSwitcher />}
          {testing && <div className="flex flex-wrap gap-2"><SkipAll /><ResetAll /></div>}
          <button onClick={signOut} className="btn-ghost -ml-2.5 h-8 px-2.5 text-xs"><LogOut size={14} /> Sign out</button>
        </div>
      </aside>

      <div className="flex min-h-[100dvh] min-w-0 flex-col">
        {/* Mobile header: logo, progress and a toggle for the step list. */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex items-center gap-3">
            <Logo className="h-6 w-auto" />
            <button onClick={() => setStepsOpen(!stepsOpen)} aria-expanded={stepsOpen} className="btn-secondary ml-auto h-8 px-3 text-xs">
              {step ? `Step ${index + 1} of ${walkthroughSteps.length}` : 'All steps'} <ChevronDown size={14} className={`transition-transform ${stepsOpen ? 'rotate-180' : ''}`} />
            </button>
            <button onClick={signOut} className="btn-ghost h-8 w-8 px-0" aria-label="Sign out"><LogOut size={16} /></button>
          </div>
          <div className="mt-3">{progressBlock}</div>
          {stepsOpen && (
            <nav aria-label="Walkthrough steps" className="steps-scroll animate-fade-up mt-3 max-h-[55dvh] overflow-y-auto border-t border-slate-200 pt-3 dark:border-slate-800">
              <Stepper index={index} progress={progress} unlocked={unlocked} onPick={setIndex} />
              {!ssoConfigured && <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-3 pt-3 dark:border-slate-800"><PersonaSwitcher /><div className="flex flex-wrap gap-2"><SkipAll /><ResetAll /></div></div>}
            </nav>
          )}
        </header>

        <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          {step ? (
            <div key={step.id} className="animate-fade-up">
              <p className="text-xs font-medium text-slate-500">{step.group}, step {index + 1} of {walkthroughSteps.length}</p>
              <h1 className="mt-2 text-[28px] leading-tight font-semibold text-slate-900 dark:text-white">{index === 0 ? `Welcome to Rex, ${user.firstName}` : step.label}</h1>
              <p className="mt-2 mb-10 max-w-[60ch] text-[15px] text-slate-600 dark:text-slate-300">{step.blurb}</p>
              <View progress={progress} update={updateProgress} user={user} />
            </div>
          ) : (
            <div className="animate-fade-up mx-auto max-w-lg py-10 text-center">
              <CelebrateIllustration className="mx-auto h-36 w-auto animate-pop" />
              <h1 className="mt-8 text-[28px] leading-tight font-semibold text-slate-900 dark:text-white">You’re all set, {user.firstName}</h1>
              <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-300">You’ve met the company, your team and every department, signed {policies.length} policies and booked time with {user.buddy}. Rex Hub is now unlocked.</p>
              <button onClick={() => navigate('/')} disabled={!walkthroughDone} className="btn-primary mt-8 h-10 px-5">Enter Rex Hub <ArrowRight size={16} /></button>
              <button onClick={() => { resetWalkthrough(); setIndex(0) }} className="btn-ghost mx-auto mt-3 h-8 text-xs"><RotateCcw size={14} /> Restart walkthrough (demo)</button>
            </div>
          )}
        </main>

        {step && (
          <footer className="sticky bottom-0 z-10 border-t border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
            <div className="mx-auto flex w-full max-w-4xl items-center gap-3 px-5 py-3 sm:px-8 lg:px-12">
              <button onClick={() => setIndex(index - 1)} disabled={index === 0} className="btn-ghost -ml-3"><ArrowLeft size={16} /> Back</button>
              {testing && !req.met && <button onClick={next} className="btn h-8 border border-dashed border-amber-400 px-2.5 text-xs text-amber-800 hover:bg-amber-50 dark:border-amber-500/60 dark:text-amber-300 dark:hover:bg-amber-500/10">Skip step (test)</button>}
              <span className="ml-auto hidden text-right text-xs text-slate-500 sm:block">{req.met ? (walkthroughSteps[index + 1] ? `Next: ${walkthroughSteps[index + 1].label}` : 'Last step') : req.hint}</span>
              <button onClick={next} disabled={!req.met} className="btn-primary ml-auto px-5 sm:ml-0">
                {index === walkthroughSteps.length - 1 ? 'Finish' : 'Continue'} <ArrowRight size={16} />
              </button>
            </div>
            {!req.met && <p className="px-5 pb-3 text-xs text-slate-500 sm:hidden">{req.hint}</p>}
          </footer>
        )}
      </div>
    </div>
  )
}
