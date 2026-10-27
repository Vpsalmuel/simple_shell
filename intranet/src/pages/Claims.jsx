import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertTriangle, ArrowUpRight, Check, Search } from 'lucide-react'
import { claimStages, claims, claimsByLine, claimsWeekly, tools } from '../data'
import Icon from '../components/Icon'
import SectionHeader from '../components/SectionHeader'

const naira = (n) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n)

function WeeklyChart() {
  const max = Math.max(...claimsWeekly.flatMap((d) => [d.opened, d.closed]))
  return (
    <section className="card p-5">
      <SectionHeader
        title="Claims this week"
        action={<div className="flex gap-3 text-xs text-slate-500"><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-brand-700 dark:bg-brand-400" />Opened</span><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-accent-600" />Closed</span></div>}
      />
      <div className="flex h-48 items-end justify-between gap-3">
        {claimsWeekly.map((d) => (
          <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-40 w-full items-end justify-center gap-1">
              <div className="group relative w-full max-w-5 rounded-t-md bg-brand-700 transition-all dark:bg-brand-400 hover:opacity-80" style={{ height: `${(d.opened / max) * 100}%` }}>
                <span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-white group-hover:block">{d.opened}</span>
              </div>
              <div className="group relative w-full max-w-5 rounded-t-md bg-accent-600 transition-all hover:opacity-80" style={{ height: `${(d.closed / max) * 100}%` }}>
                <span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-white group-hover:block">{d.closed}</span>
              </div>
            </div>
            <span className="text-xs text-slate-500">{d.day}</span>
          </div>
        ))}
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
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-2 rounded-full bg-brand-700 dark:bg-brand-400" style={{ width: `${l.share}%` }} /></div>
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Claims & policy hub</h1>
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
