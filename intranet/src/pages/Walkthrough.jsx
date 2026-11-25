import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon as ArrowLeft, ArrowRightIcon as ArrowRight, CalendarCheckIcon as CalendarCheck, SignOutIcon as LogOut, CheckIcon as Check, CheckCircleIcon as CheckCircle2, CaretDownIcon as ChevronDown, SignatureIcon as FileSignature, LockIcon as Lock, MapPinIcon as MapPin, QuotesIcon as Quote, ArrowCounterClockwiseIcon as RotateCcw, StarIcon as Star, XIcon as X, BuildingsIcon as Buildings, ClockIcon as Clock, UsersThreeIcon as UsersThree } from '@phosphor-icons/react'
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
import { dressPhotos } from '../data/photos'

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
  return (
    <>
      <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <button key={p.id} onClick={() => show(p)} className="card card-hover flex items-start gap-4 p-5 text-left">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition ${seen.includes(p.id) ? 'bg-accent-700 text-white' : 'bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-200'}`}><Icon name={p.icon} size={22} /></span>
            <span className="min-w-0">
              <span className="block text-[15px] font-semibold">{p.title}</span>
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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
      <ol className="space-y-2" aria-label="Headquarters floor plan">
        {floors.map((f) => {
          const mine = f.teams.includes(myTeam)
          return (
            <li key={f.floor} className={`card flex flex-col gap-3 p-4 sm:flex-row sm:items-center ${mine ? 'ring-2 ring-accent-500' : ''}`}>
              <span className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl font-display ${mine ? 'bg-accent-700 text-white' : 'bg-brand-700 text-white'}`}>
                <span className="text-[10px] font-semibold uppercase opacity-80">Floor</span><span className="text-xl leading-none font-bold">{f.floor}</span>
              </span>
              <div className="flex-1">
                <p className="font-semibold">{f.name}{mine && <span className="chip ml-2 bg-accent-50 text-accent-700 dark:bg-accent-700/20 dark:text-accent-400">Your team</span>}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">{f.teams.map((t) => <span key={t} className={`chip ${t === myTeam ? 'bg-accent-700 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{t}</span>)}</div>
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
        <p className="text-[15px] font-semibold">{name}</p>
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
      <p className="rounded-xl bg-accent-50 p-4 text-sm text-accent-800 dark:bg-accent-700/15 dark:text-accent-300">
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
          <div><p className="font-semibold">{p.title}</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{p.text}</p></div>
        </div>
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
  const booked = progress.feedback
  // Drop a saved booking that falls on a weekend (booked before the weekday rule).
  const bookedOnWeekend = booked && [0, 6].includes(new Date(`${booked.date}T00:00`).getDay())
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <form onSubmit={(e) => { e.preventDefault(); update({ feedback: { date, time, with: user.buddy } }) }} className="card space-y-5 p-6">
        <p className="text-sm text-slate-600 dark:text-slate-300">Pick a 30-minute slot in your first week to talk with <b>{user.buddy}</b> about how it’s going.</p>
        <fieldset>
          <legend className="text-sm font-medium">Day <span className="font-normal text-slate-500">(Monday to Friday)</span></legend>
          <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-5">
            {days.map((d) => {
              const v = isoDate(d)
              return (
                <button type="button" key={v} onClick={() => setDate(v)} aria-pressed={date === v} className={`flex flex-col items-center rounded-lg border px-2 py-2 text-sm transition-colors ${date === v ? 'border-brand-700 bg-brand-700 text-white dark:border-brand-500 dark:bg-brand-500' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'}`}>
                  <span className={`text-xs ${date === v ? 'text-brand-100' : 'text-slate-500'}`}>{d.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                  <span className="font-medium">{d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                </button>
              )
            })}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-medium">Time</legend>
          <div className="mt-2 flex flex-wrap gap-1.5">{feedbackSlots.map((t) => <button type="button" key={t} onClick={() => setTime(t)} aria-pressed={time === t} className={`btn h-9 px-4 tabular-nums ${time === t ? 'bg-brand-700 text-white dark:bg-brand-500' : 'btn-secondary'}`}>{t}</button>)}</div>
        </fieldset>
        <button className="btn-primary" disabled={!date || !time}><CalendarCheck size={16} /> {booked ? 'Update booking' : 'Book check-in'}</button>
      </form>
      <aside className={`card p-5 ${booked ? 'ring-2 ring-emerald-500' : ''}`} aria-live="polite">
        {bookedOnWeekend ? (
          <p className="text-sm text-amber-700 dark:text-amber-300">Your saved check-in falls on a weekend. Pick a weekday instead.</p>
        ) : booked ? (
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
