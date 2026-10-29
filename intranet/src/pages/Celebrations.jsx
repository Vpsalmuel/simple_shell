import { Link } from 'react-router-dom'
import { Cake, Gift, PartyPopper, Sparkles } from 'lucide-react'
import { people } from '../data'
import { birthdays } from '../data/culture'
import { daysUntil, nextOccurrence, shortDate, today, whenLabel } from '../lib/dates'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useToast } from '../components/Toast'
import Avatar from '../components/Avatar'
import SectionHeader from '../components/SectionHeader'
import { CelebrateIllustration } from '../components/Illustrations'

function WishButton({ id, name, wished, onWish }) {
  return wished
    ? <span className="chip shrink-0 bg-emerald-50 px-3 py-1 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">Wished ✓</span>
    : <button onClick={() => onWish(id, name)} className="btn shrink-0 border border-accent-200 px-3 py-1.5 text-accent-700 hover:bg-accent-50 dark:border-accent-700/50 dark:text-accent-400 dark:hover:bg-accent-700/10"><Gift size={14} /> Send wishes</button>
}

export default function Celebrations() {
  const toast = useToast()
  const [wishes, setWishes] = useLocalStorage('rex-wishes', [])
  const now = today()
  const wish = (id, name) => { setWishes([...wishes, id]); toast(`Wishes sent to ${name}`) }

  const upcomingBirthdays = Object.entries(birthdays)
    .map(([name, mmdd]) => { const date = nextOccurrence(mmdd); return { name, date, days: daysUntil(date) } })
    .filter((b) => b.days <= 60).sort((a, b) => a.days - b.days)

  const anniversaries = people.filter((p) => p.joined).map((p) => {
    const date = nextOccurrence(p.joined.slice(5))
    return { ...p, date, days: daysUntil(date), years: date.getFullYear() - Number(p.joined.slice(0, 4)) }
  }).filter((a) => a.years > 0 && a.days <= 120).sort((a, b) => a.days - b.days)

  const joiners = people.filter((p) => p.joined && daysUntil(new Date(`${p.joined}T00:00`)) >= -365)
  const todays = [...upcomingBirthdays.filter((b) => b.days === 0).map((b) => `${b.name}’s birthday`), ...anniversaries.filter((a) => a.days === 0).map((a) => `${a.name}’s ${a.years}-year anniversary`)]
  const key = (kind, name, date) => `${kind}:${name}:${date.getFullYear()}`

  return (
    <div className="space-y-6">
      <section className="relative grid items-center gap-6 overflow-hidden rounded-3xl bg-brand-700 p-6 text-white sm:p-8 md:grid-cols-[1fr_auto]">
        <div className="pointer-events-none absolute -top-1/2 -right-20 h-[180%] w-1/2 rounded-full bg-accent-600/30 blur-3xl" />
        <div className="relative">
          <p className="text-sm text-brand-200">{now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <h1 className="mt-1 text-3xl font-extrabold">Celebrations</h1>
          <p className="mt-2 max-w-xl text-brand-100">
            {todays.length ? <>Today we’re celebrating {todays.join(' and ')}. 🎉</> : upcomingBirthdays[0] ? <>Nothing today. Next up: {upcomingBirthdays[0].name}’s birthday on {shortDate(upcomingBirthdays[0].date)}.</> : 'Birthdays, anniversaries and new joiners across Rex.'}
          </p>
        </div>
        <CelebrateIllustration className="relative mx-auto hidden h-32 w-auto md:block" />
      </section>

      <div className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
        <section className="card p-5">
          <SectionHeader title="Upcoming birthdays" subtitle="Next 60 days" action={<Cake size={18} className="text-accent-600" />} />
          {upcomingBirthdays.length === 0 ? <p className="text-sm text-slate-500">No birthdays in the next 60 days.</p> : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {upcomingBirthdays.map((b) => {
                const p = people.find((x) => x.name === b.name)
                return (
                  <li key={b.name} className="flex items-center gap-3 py-3">
                    <Avatar name={b.name} status={p?.status} />
                    <span className="min-w-0 flex-1"><span className="block truncate font-medium">{b.name}</span><span className="block text-xs text-slate-500">{whenLabel(b.days)} · {shortDate(b.date)}</span></span>
                    <WishButton id={key('bday', b.name, b.date)} name={b.name} wished={wishes.includes(key('bday', b.name, b.date))} onWish={wish} />
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="card p-5">
          <SectionHeader title="Work anniversaries" subtitle="Next 4 months" action={<PartyPopper size={18} className="text-accent-600" />} />
          {anniversaries.length === 0 ? <p className="text-sm text-slate-500">No anniversaries coming up.</p> : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {anniversaries.map((a) => (
                <li key={a.id} className="flex items-center gap-3 py-3">
                  <span className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-accent-600 font-display text-white"><span className="text-base leading-none font-extrabold">{a.years}</span><span className="text-[9px] font-semibold uppercase">{a.years === 1 ? 'year' : 'years'}</span></span>
                  <span className="min-w-0 flex-1"><span className="block truncate font-medium">{a.name}</span><span className="block truncate text-xs text-slate-500">{a.role} · {whenLabel(a.days)}</span></span>
                  <WishButton id={key('anniv', a.name, a.date)} name={a.name} wished={wishes.includes(key('anniv', a.name, a.date))} onWish={wish} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5 lg:col-span-2">
          <SectionHeader title="Welcome new joiners" subtitle="Joined in the last year" action={<Sparkles size={18} className="text-accent-600" />} />
          <ul className="space-y-3">
            {joiners.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <Avatar name={p.name} status={p.status} />
                <span className="min-w-0 flex-1"><span className="block truncate font-medium">{p.name}</span><span className="block truncate text-xs text-slate-500">{p.role} · joined {shortDate(new Date(`${p.joined}T00:00`))}</span></span>
                <Link to={`/people?id=${p.id}`} className="btn-ghost shrink-0 px-3 py-1.5 text-sm">Say hello</Link>
              </li>
            ))}
          </ul>
        </section>

      </div>
    </div>
  )
}
