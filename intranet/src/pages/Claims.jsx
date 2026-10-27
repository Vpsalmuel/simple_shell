import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertTriangle, ArrowUpRight, BarChart3, Check, Search, Table2 } from 'lucide-react'
import { claimStages, claims, claimsByLine, claimsWeekly, settlementTrend, tools } from '../data'
import Icon from '../components/Icon'
import SectionHeader from '../components/SectionHeader'

const naira = (n) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n)

const series = [
  { key: 'opened', label: 'Opened', color: 'var(--color-chart-1)' },
  { key: 'closed', label: 'Closed', color: 'var(--color-chart-2)' },
]

function Legend() {
  return (
    <div className="flex gap-3 text-xs text-slate-500">
      {series.map((s) => <span key={s.key} className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />{s.label}</span>)}
    </div>
  )
}

function WeeklyChart() {
  const [asTable, setAsTable] = useState(false)
  const [hover, setHover] = useState(null)
  const max = 200
  const ticks = [0, 50, 100, 150, 200]

  return (
    <section className="card p-5">
      <SectionHeader
        title="Claims this week"
        action={
          <div className="flex items-center gap-3">
            <Legend />
            <button onClick={() => setAsTable(!asTable)} className="btn-ghost p-1.5" aria-label={asTable ? 'Show chart' : 'Show table'} title={asTable ? 'Show chart' : 'Show table'}>
              {asTable ? <BarChart3 size={16} /> : <Table2 size={16} />}
            </button>
          </div>
        }
      />
      {asTable ? (
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-slate-500"><tr><th className="py-2 font-medium">Day</th><th className="py-2 text-right font-medium">Opened</th><th className="py-2 text-right font-medium">Closed</th><th className="py-2 text-right font-medium">Net</th></tr></thead>
          <tbody className="divide-y divide-slate-100 tabular-nums dark:divide-slate-800">
            {claimsWeekly.map((d) => <tr key={d.day}><td className="py-2">{d.day}</td><td className="py-2 text-right">{d.opened}</td><td className="py-2 text-right">{d.closed}</td><td className="py-2 text-right">{d.closed - d.opened > 0 ? '+' : ''}{d.closed - d.opened}</td></tr>)}
          </tbody>
        </table>
      ) : (
        <div className="relative flex h-56 gap-3">
          {/* y axis + recessive grid */}
          <div className="flex flex-col-reverse justify-between pb-6 text-right text-[11px] text-slate-400 tabular-nums">
            {ticks.map((t) => <span key={t} className="leading-none">{t}</span>)}
          </div>
          <div className="relative flex-1">
            <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col-reverse justify-between" aria-hidden="true">
              {ticks.map((t) => <div key={t} className={`border-t ${t === 0 ? 'border-slate-300 dark:border-slate-600' : 'border-dashed border-slate-100 dark:border-slate-800'}`} />)}
            </div>
            <div className="relative flex h-full items-stretch justify-around" role="img" aria-label="Claims opened and closed per day this week">
              {claimsWeekly.map((d, i) => (
                <div
                  key={d.day}
                  className="relative flex flex-1 flex-col items-center"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  <div className={`absolute inset-x-1 top-0 bottom-6 rounded-lg transition ${hover === i ? 'bg-slate-100/70 dark:bg-slate-800/60' : ''}`} />
                  <div className="relative flex h-full w-full items-end justify-center gap-0.5 pb-6">
                    {series.map((s) => (
                      <div key={s.key} className="w-full max-w-6 rounded-t-[4px] transition-[height] duration-700 ease-out" style={{ height: `${(d[s.key] / max) * 100}%`, background: s.color }} />
                    ))}
                  </div>
                  <span className={`absolute bottom-0 text-xs ${hover === i ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-500'}`}>{d.day}</span>
                  {hover === i && (
                    <div className="pointer-events-none absolute -top-2 z-10 w-36 -translate-y-full rounded-xl bg-slate-900 p-3 text-xs text-white shadow-xl">
                      <p className="mb-1.5 font-semibold">{d.day}</p>
                      {series.map((s) => <p key={s.key} className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm" style={{ background: s.color }} />{s.label}</span><b className="tabular-nums">{d[s.key]}</b></p>)}
                      <p className="mt-1.5 border-t border-white/15 pt-1.5 text-white/70">Net {d.closed - d.opened > 0 ? '+' : ''}{d.closed - d.opened}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function SettlementTrend() {
  const [hover, setHover] = useState(null)
  const w = 600
  const h = 160
  const pad = { l: 8, r: 8, t: 12, b: 8 }
  const min = 5
  const max = 9
  const x = (i) => pad.l + (i / (settlementTrend.length - 1)) * (w - pad.l - pad.r)
  const y = (v) => pad.t + (1 - (v - min) / (max - min)) * (h - pad.t - pad.b)
  const d = settlementTrend.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')
  const target = 6.5
  const active = hover ?? settlementTrend.length - 1
  const last = settlementTrend[settlementTrend.length - 1]

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const i = Math.round(((e.clientX - r.left) / r.width) * (settlementTrend.length - 1))
    setHover(Math.max(0, Math.min(settlementTrend.length - 1, i)))
  }

  return (
    <section className="card p-5">
      <SectionHeader title="Average settlement time" subtitle="Days from registration to payment, last 12 weeks" action={<span className="font-display text-2xl font-extrabold tabular-nums">{last}<span className="text-sm font-medium text-slate-500"> days</span></span>} />
      <div className="relative">
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-40 w-full overflow-visible" onMouseMove={onMove} onMouseLeave={() => setHover(null)} role="img" aria-label={`Average settlement time fell from ${settlementTrend[0]} to ${last} days over 12 weeks; target ${target} days.`}>
          {[5, 6, 7, 8, 9].map((t) => <line key={t} x1="0" x2={w} y1={y(t)} y2={y(t)} className="stroke-slate-100 dark:stroke-slate-800" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />)}
          <line x1="0" x2={w} y1={y(target)} y2={y(target)} className="stroke-emerald-500" strokeWidth="1.5" strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
          <path d={d} fill="none" stroke="var(--color-chart-1)" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          {hover !== null && <line x1={x(active)} x2={x(active)} y1="0" y2={h} className="stroke-slate-300 dark:stroke-slate-600" vectorEffect="non-scaling-stroke" />}
        </svg>
        <span className="pointer-events-none absolute left-1 rounded bg-white/80 px-1 text-[11px] font-medium text-emerald-700 dark:bg-slate-900/80 dark:text-emerald-400" style={{ top: `calc(${(y(target) / h) * 100}% - 18px)` }}>Target {target} days</span>
        <span className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--color-chart-1)] dark:border-slate-900" style={{ left: `${(x(active) / w) * 100}%`, top: `${(y(settlementTrend[active]) / h) * 100}%` }} />
        {hover !== null && (
          <span className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg bg-slate-900 px-2 py-1 text-xs whitespace-nowrap text-white" style={{ left: `${(x(active) / w) * 100}%`, top: `calc(${(y(settlementTrend[active]) / h) * 100}% - 10px)` }}>
            {active === settlementTrend.length - 1 ? 'This week' : `${settlementTrend.length - 1 - active}w ago`} · <b>{settlementTrend[active]} days</b>
          </span>
        )}
      </div>
    </section>
  )
}

function ByLine() {
  return (
    <section className="card p-5">
      <SectionHeader title="Open claims by line" />
      <ul className="space-y-3">
        {claimsByLine.map((l) => (
          <li key={l.line}>
            <div className="mb-1 flex justify-between text-sm"><span>{l.line}</span><span className="font-medium">{l.share}%</span></div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-2 rounded-full bg-[var(--color-chart-1)] transition-[width] duration-700" style={{ width: `${l.share}%` }} /></div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Tracker({ claim }) {
  const idx = claimStages.indexOf(claim.stage)
  return (
    <ol className="mt-4 flex items-center">
      {claimStages.map((s, i) => (
        <li key={s} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${i < idx ? 'bg-emerald-500 text-white' : i === idx ? 'bg-accent-600 text-white ring-4 ring-accent-100 dark:ring-accent-700/30' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
              {i < idx ? <Check size={14} /> : i + 1}
            </span>
            <span className={`hidden text-[11px] sm:block ${i === idx ? 'font-semibold text-accent-700 dark:text-accent-400' : 'text-slate-500'}`}>{s}</span>
          </div>
          {i < claimStages.length - 1 && <span className={`mx-1 h-0.5 flex-1 ${i < idx ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />}
        </li>
      ))}
    </ol>
  )
}

export default function Claims() {
  const [params, setParams] = useSearchParams()
  const [lookup, setLookup] = useState(params.get('claim') ?? '')
  const found = claims.find((c) => c.id.toLowerCase() === (params.get('claim') ?? '').toLowerCase())

  const submit = (e) => {
    e.preventDefault()
    setParams(lookup ? { claim: lookup.trim() } : {})
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">Claims & policy hub</h1>
          <p className="mt-1 text-sm text-slate-500">Your queue, live performance, and core insurance systems in one place.</p>
        </div>
        <button className="btn-primary">Register new claim</button>
      </div>

      <section className="card p-5">
        <SectionHeader title="Track a claim" subtitle="Try CLM-24-08790" />
        <form onSubmit={submit} className="flex max-w-xl gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9" value={lookup} onChange={(e) => setLookup(e.target.value)} placeholder="Claim number" />
          </div>
          <button className="btn-primary">Track</button>
        </form>
        {params.get('claim') && !found && <p className="mt-3 text-sm text-rose-600">No claim found with number {params.get('claim')}.</p>}
        {found && (
          <div className="animate-fade-up mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
            <div className="flex flex-wrap justify-between gap-2 text-sm">
              <span><b>{found.id}</b> · {found.insured}</span>
              <span className="text-slate-500">{found.line} · {naira(found.amount)} · Owner: {found.owner}</span>
            </div>
            <Tracker claim={found} />
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2"><WeeklyChart /></div>
        <ByLine />
      </div>

      <SettlementTrend />

      <section className="card overflow-hidden">
        <div className="p-5 pb-0"><SectionHeader title="My work queue" subtitle="Sorted by SLA" /></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-slate-50 text-left text-xs tracking-wide text-slate-500 uppercase dark:bg-slate-800/50">
              <tr><th className="px-5 py-3 font-medium">Claim</th><th className="px-5 py-3 font-medium">Insured</th><th className="px-5 py-3 font-medium">Line</th><th className="px-5 py-3 text-right font-medium">Amount</th><th className="px-5 py-3 font-medium">Stage</th><th className="px-5 py-3 font-medium">SLA</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[...claims].sort((a, b) => a.sla - b.sla).map((c) => (
                <tr key={c.id} onClick={() => { setLookup(c.id); setParams({ claim: c.id }); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-3 font-medium text-brand-700 dark:text-brand-300">{c.id}</td>
                  <td className="px-5 py-3">{c.insured}</td>
                  <td className="px-5 py-3">{c.line}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{naira(c.amount)}</td>
                  <td className="px-5 py-3"><span className="chip bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-200">{c.stage}</span></td>
                  <td className="px-5 py-3">
                    {c.sla <= 1
                      ? <span className="chip gap-1 bg-rose-100 text-rose-700"><AlertTriangle size={12} />{c.sla === 0 ? 'Due today' : '1 day'}</span>
                      : <span className="chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{c.sla} days</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionHeader title="Core systems" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <a key={t.name} href="#" className="card card-hover group flex items-start gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white transition group-hover:bg-accent-600"><Icon name={t.icon} size={20} /></span>
              <span className="flex-1"><span className="block font-semibold">{t.name}</span><span className="block text-sm text-slate-500">{t.desc}</span></span>
              <ArrowUpRight size={16} className="text-slate-300 transition group-hover:text-accent-600" />
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
