import { people } from '../data'
import { birthdays } from '../data/culture'
import { daysUntil, nextOccurrence } from './dates'

const roleOf = (name) => people.find((p) => p.name === name)?.role ?? ''

// Upcoming birthdays within `withinDays`, soonest first.
export function upcomingBirthdays(withinDays = 60) {
  return Object.entries(birthdays)
    .map(([name, mmdd]) => { const date = nextOccurrence(mmdd); return { kind: 'birthday', name, role: roleOf(name), date, days: daysUntil(date) } })
    .filter((b) => b.days <= withinDays)
    .sort((a, b) => a.days - b.days)
}

// Upcoming work anniversaries within `withinDays`, counted from each person's joining date.
export function upcomingAnniversaries(withinDays = 120) {
  return people.filter((p) => p.joined).map((p) => {
    const date = nextOccurrence(p.joined.slice(5))
    return { kind: 'anniversary', name: p.name, role: p.role, email: p.email, date, days: daysUntil(date), years: date.getFullYear() - Number(p.joined.slice(0, 4)) }
  }).filter((a) => a.years > 0 && a.days <= withinDays).sort((a, b) => a.days - b.days)
}

// Birthdays and anniversaries together, soonest first.
export function upcomingCelebrations(withinDays = 7) {
  return [...upcomingBirthdays(withinDays), ...upcomingAnniversaries(withinDays)].sort((a, b) => a.days - b.days)
}

export const celebrationLabel = (c) => (c.kind === 'birthday' ? 'Birthday' : `${c.years} ${c.years === 1 ? 'year' : 'years'} at Rex`)
